"""HASS Requester - Send HTTP requests from automations with a panel UI."""
from __future__ import annotations

import logging
import os
import re
from typing import Any

import voluptuous as vol

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.service import (
    ALL_SERVICE_DESCRIPTIONS_CACHE,
    SERVICE_DESCRIPTION_CACHE,
)

from .const import CONF_PARAMS, CONF_REQUEST, DOMAIN, SERVICE_SEND
from .http_client import async_send_request
from .store import RequestStore
from .websocket_api import register_websocket_api

_LOGGER = logging.getLogger(__name__)

# Keys in hass.data
DOMAIN_REFRESH_CB = f"{DOMAIN}_refresh_description"
DOMAIN_REGISTERED_SERVICES = f"{DOMAIN}_registered_services"

SERVICE_SEND_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_REQUEST): cv.string,
        vol.Optional(CONF_PARAMS, default={}): dict,
    }
)


def _slugify(name: str) -> str:
    """Convert a request name to a valid HA service name (lowercase alphanumeric + underscore)."""
    slug = re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")
    return slug or "request"


def _build_slot_field(slot: dict[str, Any]) -> dict[str, Any]:
    """Build a HA service field descriptor from a slot definition."""
    field: dict[str, Any] = {
        "name": slot["name"],
        "description": f"Value for the '{{{{ {slot['name']} }}}}' slot.",
        "required": slot.get("required", True),
    }
    if slot.get("default") is not None:
        field["example"] = slot["default"]

    slot_type = slot.get("type", "text")
    if slot_type == "select" and slot.get("options"):
        field["selector"] = {"select": {"options": slot["options"], "mode": "dropdown"}}
    elif slot_type == "number":
        field["selector"] = {"number": {"mode": "box"}}
    elif slot_type == "boolean":
        field["selector"] = {"boolean": {}}
    else:
        field["selector"] = {"template": {}}

    return field


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up HASS Requester from a config entry."""
    store = RequestStore(hass)
    await store.async_load()
    hass.data[DOMAIN] = store
    hass.data[DOMAIN_REGISTERED_SERVICES] = set()

    hass.data[DOMAIN_REFRESH_CB] = lambda: _refresh_services(hass, store)

    register_websocket_api(hass)
    _register_send_service(hass)
    await _register_panel(hass)

    _refresh_services(hass, store)

    _LOGGER.info("HASS Requester integration loaded successfully")
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload HASS Requester config entry."""
    hass.services.async_remove(DOMAIN, SERVICE_SEND)
    registered: set[str] = hass.data.pop(DOMAIN_REGISTERED_SERVICES, set())
    for svc in registered:
        hass.services.async_remove(DOMAIN, svc)
    hass.data.pop(DOMAIN, None)
    hass.data.pop(DOMAIN_REFRESH_CB, None)
    cache = hass.data.get(SERVICE_DESCRIPTION_CACHE, {})
    for svc in list(registered) + [SERVICE_SEND]:
        cache.pop((DOMAIN, svc), None)
    hass.data.pop(ALL_SERVICE_DESCRIPTIONS_CACHE, None)

    frontend.async_remove_panel(hass, DOMAIN)
    return True


def _refresh_services(hass: HomeAssistant, store: RequestStore) -> None:
    """
    Keep the generic 'send' service and register one dedicated service per
    saved request so the automation UI shows labeled slot fields for each.
    """
    requests = store.get_all()
    cache = hass.data.setdefault(SERVICE_DESCRIPTION_CACHE, {})

    # --- 1. Generic fallback "send" service (manual YAML params) ---
    options = [r["name"] for r in requests]
    cache[(DOMAIN, SERVICE_SEND)] = {
        "name": "Send Request (advanced)",
        "description": (
            "Send any saved request by name. "
            "For guided slot inputs, search 'Requester:' and pick your request directly."
        ),
        "fields": {
            "request": {
                "name": "Request name",
                "description": "Name of the saved request to send.",
                "required": True,
                "selector": {
                    "select": {
                        "options": options,
                        "mode": "dropdown",
                        "custom_value": True,
                    }
                },
            },
            "params": {
                "name": "Parameters",
                "description": (
                    "Enter a value for each slot defined in the request.\n"
                    "You can use static text or a dynamic HA template.\n\n"
                    "Example:\n"
                    "location: 'Tel Aviv'\n"
                    "location: '{{ trigger.event.data.location }}'"
                ),
                "required": False,
                "example": {"location": "{{ trigger.event.data.location }}"},
                "selector": {"object": {}},
            },
        },
    }

    # --- 2. Unregister per-request services no longer needed ---
    old_services: set[str] = hass.data.get(DOMAIN_REGISTERED_SERVICES, set())
    new_slugs = {_slugify(r["name"]) for r in requests}
    for svc in old_services - new_slugs:
        hass.services.async_remove(DOMAIN, svc)
        cache.pop((DOMAIN, svc), None)

    # --- 3. Register one dedicated service per request with labeled slot fields ---
    new_services: set[str] = set()
    for req in requests:
        svc_name = _slugify(req["name"])
        new_services.add(svc_name)
        slots: list[dict[str, Any]] = req.get("slots", [])

        # Build voluptuous schema – all slots are optional at schema level;
        # required enforcement happens in the http_client.
        schema = vol.Schema(
            {vol.Optional(s["name"]): vol.Any(str, int, float, bool, None) for s in slots},
            extra=vol.ALLOW_EXTRA,
        )

        def _make_handler(req_id: str):
            async def _handle(call: ServiceCall) -> None:
                req_cfg = hass.data[DOMAIN].get_by_id(req_id)
                if req_cfg is None:
                    raise ServiceValidationError(f"Request '{req_id}' no longer exists")
                await async_send_request(hass, req_cfg, dict(call.data))
            return _handle

        hass.services.async_register(DOMAIN, svc_name, _make_handler(req["id"]), schema=schema)

        # Build labeled field descriptors shown in the automation UI
        method = req.get("method", "GET")
        url = req.get("url", "")
        short_url = url[:60] + ("…" if len(url) > 60 else "")

        fields: dict[str, Any] = {}
        for slot in slots:
            slot_name = slot["name"]
            default_val = slot.get("default")
            required = slot.get("required", True)

            lines = [
                f"Fill in a value for the `{slot_name}` parameter.",
                "",
                "• Static value:  Tel Aviv",
                f"• Sensor state:  {{{{ states('sensor.my_{slot_name}') }}}}",
                f"• From trigger:  {{{{ trigger.event.data.{slot_name} }}}}",
                f"• From input:    {{{{ states('input_text.{slot_name}') }}}}",
            ]
            if default_val is not None:
                lines.append(f"• Default value: {default_val}")
            if not required:
                lines.append("(optional – leave empty to skip)")

            fields[slot_name] = {
                "name": slot_name,
                "description": "\n".join(lines),
                "required": required,
                "example": default_val or f"{{{{ trigger.event.data.{slot_name} }}}}",
                "selector": {"template": {}},
            }

        cache[(DOMAIN, svc_name)] = {
            "name": f"Requester: {req['name']}",
            "description": f"{method} {short_url}",
            "fields": fields,
        }

    hass.data[DOMAIN_REGISTERED_SERVICES] = new_services
    hass.data.pop(ALL_SERVICE_DESCRIPTIONS_CACHE, None)

    _LOGGER.debug(
        "Services refreshed: %d per-request + send. Requests: %s",
        len(new_services),
        [r["name"] for r in requests],
    )


def _register_send_service(hass: HomeAssistant) -> None:
    """Register the generic hass_requester.send service."""

    async def handle_send(call: ServiceCall) -> None:
        store: RequestStore = hass.data[DOMAIN]
        request_ref = call.data[CONF_REQUEST]
        params = call.data.get(CONF_PARAMS, {})

        request_config = store.get_by_id(request_ref) or store.get_by_name(request_ref)
        if request_config is None:
            raise ServiceValidationError(
                f"No request found with name or ID '{request_ref}'"
            )
        await async_send_request(hass, request_config, params)

    hass.services.async_register(
        DOMAIN,
        SERVICE_SEND,
        handle_send,
        schema=SERVICE_SEND_SCHEMA,
    )


async def _register_panel(hass: HomeAssistant) -> None:
    """Register the sidebar panel and static file serving."""
    www_dir = os.path.join(os.path.dirname(__file__), "www")
    os.makedirs(www_dir, exist_ok=True)

    await hass.http.async_register_static_paths(
        [StaticPathConfig(f"/api/{DOMAIN}/frontend", www_dir, cache_headers=False)]
    )

    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title="Requester",
        sidebar_icon="mdi:home-lightning-bolt",
        frontend_url_path=DOMAIN,
        config={
            "_panel_custom": {
                "name": "hass-requester-panel",
                "module_url": f"/api/{DOMAIN}/frontend/hass-requester-panel.js",
            }
        },
        require_admin=True,
    )
