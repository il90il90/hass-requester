"""Execute HTTP requests with Jinja2 slot rendering."""
from __future__ import annotations

import logging
from typing import Any
from urllib.parse import urlencode, urlparse, urlunparse

from homeassistant.core import HomeAssistant, ServiceValidationError
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.template import Template

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


def _render(hass: HomeAssistant, value: str, variables: dict[str, Any]) -> str:
    """Render a Jinja2 template string using HA's template engine."""
    if "{{" not in value and "{%" not in value:
        return value
    try:
        tmpl = Template(value, hass)
        return str(tmpl.async_render(variables=variables))
    except Exception as e:
        _LOGGER.error("Template render error for '%s': %s", value, e)
        return value


def _render_dict(
    hass: HomeAssistant, d: dict[str, str], variables: dict[str, Any]
) -> dict[str, str]:
    """Render all values in a dict."""
    return {k: _render(hass, v, variables) for k, v in d.items()}


def _render_body(
    hass: HomeAssistant, body: Any, variables: dict[str, Any]
) -> Any:
    """Recursively render templates in a body object."""
    if isinstance(body, str):
        return _render(hass, body, variables)
    if isinstance(body, dict):
        return {k: _render_body(hass, v, variables) for k, v in body.items()}
    if isinstance(body, list):
        return [_render_body(hass, item, variables) for item in body]
    return body


def _render_params(
    hass: HomeAssistant, params: dict[str, Any]
) -> dict[str, Any]:
    """
    Render HA Jinja2 templates inside slot param values.
    Called before slot validation so callers can pass templates like
    '{{ states("input_text.name") }}' and receive the resolved value.
    Non-string values (int, bool, None) are passed through unchanged.
    """
    result: dict[str, Any] = {}
    for k, v in params.items():
        if isinstance(v, str):
            result[k] = _render(hass, v, {})
        else:
            result[k] = v
    return result


def _validate_slots(
    request_config: dict[str, Any], params: dict[str, Any]
) -> dict[str, Any]:
    """
    Validate that all required slots have values.
    Returns merged variables dict (defaults filled in).
    Raises ServiceValidationError for missing required slots.
    """
    variables: dict[str, Any] = {}
    for slot in request_config.get("slots", []):
        name = slot["name"]
        required = slot.get("required", True)
        default = slot.get("default")

        if name in params:
            variables[name] = params[name]
        elif default is not None:
            variables[name] = default
        elif required:
            raise ServiceValidationError(
                f"Missing required slot '{name}' for request '{request_config['name']}'"
            )
    return variables


async def async_send_request(
    hass: HomeAssistant,
    request_config: dict[str, Any],
    params: dict[str, Any],
) -> None:
    """
    Execute an HTTP request with rendered slot values.
    Slot param values may themselves contain HA Jinja2 templates — they
    are resolved first so the rendered value is available during URL/body rendering.
    Logs the outcome; does not return response data (v1 scope).
    """
    rendered_params = _render_params(hass, params)
    variables = _validate_slots(request_config, rendered_params)

    # Render URL
    rendered_url = _render(hass, request_config["url"], variables)

    # Append query params to URL
    rendered_query = _render_dict(hass, request_config.get("query_params", {}), variables)
    if rendered_query:
        parsed = urlparse(rendered_url)
        query_string = urlencode(rendered_query, encoding="utf-8")
        rendered_url = urlunparse(parsed._replace(query=query_string))

    # Render headers
    rendered_headers = _render_dict(hass, request_config.get("headers", {}), variables)

    # Render body
    method = request_config["method"].upper()
    body_type = request_config.get("body_type", "none")
    body = request_config.get("body")
    request_kwargs: dict[str, Any] = {}

    if body_type == "json" and body is not None:
        rendered_body = _render_body(hass, body, variables)
        request_kwargs["json"] = rendered_body
        rendered_headers.setdefault("Content-Type", "application/json")

    elif body_type == "form" and body is not None:
        rendered_body = _render_body(hass, body, variables)
        request_kwargs["data"] = rendered_body

    elif body_type == "text" and body is not None:
        rendered_body = _render(hass, body, variables)
        request_kwargs["data"] = rendered_body

    session = async_get_clientsession(hass)

    _LOGGER.debug(
        "Sending %s %s | headers=%s | kwargs=%s",
        method,
        rendered_url,
        rendered_headers,
        request_kwargs,
    )

    try:
        async with session.request(
            method,
            rendered_url,
            headers=rendered_headers or None,
            **request_kwargs,
        ) as response:
            if response.status >= 400:
                body_text = await response.text()
                _LOGGER.warning(
                    "Request '%s' returned HTTP %s: %s",
                    request_config["name"],
                    response.status,
                    body_text[:500],
                )
            else:
                _LOGGER.info(
                    "Request '%s' succeeded with HTTP %s",
                    request_config["name"],
                    response.status,
                )
    except Exception as e:
        _LOGGER.error(
            "Request '%s' failed: %s", request_config["name"], e
        )
