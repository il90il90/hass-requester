"""Config flow for HASS Requester - single step, no user input needed."""
from __future__ import annotations

from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .const import DOMAIN


class HassRequesterConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle the config flow for HASS Requester."""

    VERSION = 1

    async def async_step_user(self, user_input=None) -> FlowResult:
        """Handle the initial step - just create the entry immediately."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        return self.async_create_entry(title="HASS Requester", data={})
