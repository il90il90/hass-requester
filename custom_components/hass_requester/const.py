"""Constants for HASS Requester integration."""

DOMAIN = "hass_requester"

STORAGE_KEY = "hass_requester"
STORAGE_VERSION = 1
STORAGE_MINOR_VERSION = 1

PANEL_URL = "hass-requester"
PANEL_TITLE = "Requester"
PANEL_ICON = "mdi:web"

SERVICE_SEND = "send"

CONF_REQUEST = "request"
CONF_PARAMS = "params"

SUPPORTED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"]
BODY_TYPES = ["none", "json", "form", "text"]
SLOT_TYPES = ["text", "select", "number", "boolean"]
