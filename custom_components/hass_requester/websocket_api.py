"""WebSocket API commands for HASS Requester panel communication."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .curl_parser import parse_curl
from .http_client import async_send_request

# Imported lazily to avoid circular imports
_DOMAIN_REFRESH_CB = f"{DOMAIN}_refresh_description"


def _refresh(hass: HomeAssistant) -> None:
    """Call the service description refresh callback if registered."""
    cb = hass.data.get(_DOMAIN_REFRESH_CB)
    if cb:
        cb()

_LOGGER = logging.getLogger(__name__)


@callback
def register_websocket_api(hass: HomeAssistant) -> None:
    """Register all WebSocket commands."""
    websocket_api.async_register_command(hass, ws_list)
    websocket_api.async_register_command(hass, ws_create)
    websocket_api.async_register_command(hass, ws_update)
    websocket_api.async_register_command(hass, ws_delete)
    websocket_api.async_register_command(hass, ws_parse_curl)
    websocket_api.async_register_command(hass, ws_test_request)


@websocket_api.websocket_command({vol.Required("type"): "hass_requester/list"})
@websocket_api.async_response
async def ws_list(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Return all saved requests."""
    store = hass.data[DOMAIN]
    connection.send_result(msg["id"], {"requests": store.get_all()})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "hass_requester/create",
        vol.Required("name"): str,
        vol.Required("method"): str,
        vol.Required("url"): str,
        vol.Optional("query_params"): dict,
        vol.Optional("headers"): dict,
        vol.Optional("body_type"): str,
        vol.Optional("body"): object,
        vol.Optional("slots"): list,
    }
)
@websocket_api.async_response
async def ws_create(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Create a new request."""
    store = hass.data[DOMAIN]
    data = {k: v for k, v in msg.items() if k not in ("id", "type")}
    try:
        new_request = await store.create(data)
        _refresh(hass)
        connection.send_result(msg["id"], {"id": new_request["id"]})
    except Exception as e:
        _LOGGER.error("Failed to create request: %s", e)
        connection.send_error(msg["id"], "create_failed", str(e))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "hass_requester/update",
        vol.Required("request_id"): str,
        vol.Required("name"): str,
        vol.Required("method"): str,
        vol.Required("url"): str,
        vol.Optional("query_params"): dict,
        vol.Optional("headers"): dict,
        vol.Optional("body_type"): str,
        vol.Optional("body"): object,
        vol.Optional("slots"): list,
    }
)
@websocket_api.async_response
async def ws_update(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Update an existing request."""
    store = hass.data[DOMAIN]
    request_id = msg["request_id"]
    data = {k: v for k, v in msg.items() if k not in ("id", "type", "request_id")}
    try:
        updated = await store.update(request_id, data)
        if updated is None:
            connection.send_error(msg["id"], "not_found", f"Request '{request_id}' not found")
            return
        _refresh(hass)
        connection.send_result(msg["id"], {"success": True})
    except Exception as e:
        _LOGGER.error("Failed to update request: %s", e)
        connection.send_error(msg["id"], "update_failed", str(e))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "hass_requester/delete",
        vol.Required("request_id"): str,
    }
)
@websocket_api.async_response
async def ws_delete(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Delete a request by ID."""
    store = hass.data[DOMAIN]
    deleted = await store.delete(msg["request_id"])
    if not deleted:
        connection.send_error(msg["id"], "not_found", f"Request '{msg['request_id']}' not found")
        return
    _refresh(hass)
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "hass_requester/parse_curl",
        vol.Required("curl"): str,
    }
)
@websocket_api.async_response
async def ws_parse_curl(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Parse a CURL command string and return a structured request object."""
    try:
        parsed = parse_curl(msg["curl"])
    except ValueError as e:
        connection.send_error(msg["id"], "invalid_format", str(e))
        return
    connection.send_result(msg["id"], parsed)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "hass_requester/test_request",
        vol.Required("name"): str,
        vol.Required("method"): str,
        vol.Required("url"): str,
        vol.Optional("query_params"): dict,
        vol.Optional("headers"): dict,
        vol.Optional("body_type"): str,
        vol.Optional("body"): object,
        vol.Optional("slots"): list,
        vol.Optional("params"): dict,
    }
)
@websocket_api.async_response
async def ws_test_request(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Execute a request immediately without saving (for testing from the panel)."""
    request_config = {
        "id": "__test__",
        "name": msg.get("name", "test"),
        "method": msg["method"],
        "url": msg["url"],
        "query_params": msg.get("query_params", {}),
        "headers": msg.get("headers", {}),
        "body_type": msg.get("body_type", "none"),
        "body": msg.get("body"),
        "slots": msg.get("slots", []),
    }
    params = msg.get("params", {})

    try:
        await async_send_request(hass, request_config, params)
        connection.send_result(msg["id"], {"success": True, "message": "Request sent successfully"})
    except Exception as e:
        connection.send_error(msg["id"], "request_failed", str(e))
