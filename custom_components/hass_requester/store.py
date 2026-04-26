"""Storage layer for HASS Requester requests."""
from __future__ import annotations

import uuid
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_MINOR_VERSION, STORAGE_VERSION


class RequestStore:
    """Manages persistence of request definitions in HA storage."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store = Store(
            hass,
            STORAGE_VERSION,
            STORAGE_KEY,
            minor_version=STORAGE_MINOR_VERSION,
        )
        self._requests: list[dict[str, Any]] = []

    async def async_load(self) -> None:
        """Load requests from storage."""
        data = await self._store.async_load()
        if data is not None:
            self._requests = data.get("requests", [])
        else:
            self._requests = []

    async def async_save(self) -> None:
        """Persist current requests to storage."""
        await self._store.async_save({"requests": self._requests})

    def get_all(self) -> list[dict[str, Any]]:
        """Return all saved requests."""
        return list(self._requests)

    def get_by_id(self, request_id: str) -> dict[str, Any] | None:
        """Return a single request by ID, or None if not found."""
        for req in self._requests:
            if req["id"] == request_id:
                return req
        return None

    def get_by_name(self, name: str) -> dict[str, Any] | None:
        """Return a single request by name (case-insensitive), or None."""
        name_lower = name.lower()
        for req in self._requests:
            if req["name"].lower() == name_lower:
                return req
        return None

    async def create(self, data: dict[str, Any]) -> dict[str, Any]:
        """Create a new request and persist it."""
        new_request = {
            "id": str(uuid.uuid4()),
            "name": data["name"],
            "method": data["method"],
            "url": data["url"],
            "query_params": data.get("query_params", {}),
            "headers": data.get("headers", {}),
            "body_type": data.get("body_type", "none"),
            "body": data.get("body"),
            "slots": data.get("slots", []),
        }
        self._requests.append(new_request)
        await self.async_save()
        return new_request

    async def update(self, request_id: str, data: dict[str, Any]) -> dict[str, Any] | None:
        """Update an existing request. Returns updated object or None if not found."""
        for i, req in enumerate(self._requests):
            if req["id"] == request_id:
                updated = {
                    "id": request_id,
                    "name": data["name"],
                    "method": data["method"],
                    "url": data["url"],
                    "query_params": data.get("query_params", {}),
                    "headers": data.get("headers", {}),
                    "body_type": data.get("body_type", "none"),
                    "body": data.get("body"),
                    "slots": data.get("slots", []),
                }
                self._requests[i] = updated
                await self.async_save()
                return updated
        return None

    async def delete(self, request_id: str) -> bool:
        """Delete a request by ID. Returns True if deleted, False if not found."""
        for i, req in enumerate(self._requests):
            if req["id"] == request_id:
                self._requests.pop(i)
                await self.async_save()
                return True
        return False
