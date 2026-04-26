# HASS Requester

Send HTTP requests from Home Assistant automations with a beautiful panel UI and dynamic parameters.

## Features

- **Panel UI** - Manage all your HTTP requests from the HA sidebar
- **CURL Import** - Paste any curl command and it auto-fills the form
- **Dynamic Slots** - Define parameters filled at automation call time
- **All HTTP Methods** - GET, POST, PUT, PATCH, DELETE
- **Full Headers & Body** - JSON, Form, Text body types supported
- **Jinja2 Templates** - Use HA state values anywhere in the request

## Installation

1. Install via HACS (add this repository as a custom repository)
2. Restart Home Assistant
3. Go to **Settings → Integrations → Add Integration → HASS Requester**
4. The **Requester** panel appears in your sidebar

## Usage

### 1. Create a Request

Open the **Requester** panel → **New Request**

- Paste a curl command to auto-fill, or fill manually
- Click **→ Slot** on any parameter to make it dynamic
- Save the request

### 2. Call from Automation

```yaml
action:
  - service: hass_requester.send
    data:
      request: person_arrived    # name or ID
      params:
        location: "ישראל"
```

### Example: Dynamic location with one request

Instead of multiple rest_commands:

```yaml
# Old way - two separate rest_commands
person_arrived_israel:
  url: "https://trigger.macrodroid.com/.../person_arravied?מקום=ישראל"
person_arrived_osny:
  url: "https://trigger.macrodroid.com/.../person_arravied?מקום=אוסני"
```

With HASS Requester - one request with a slot:

```yaml
action:
  - service: hass_requester.send
    data:
      request: person_arrived
      params:
        location: "{{ trigger.event.data.location }}"
```

## Service Reference

### `hass_requester.send`

| Field | Type | Required | Description |
|---|---|---|---|
| `request` | string | yes | Request name or ID |
| `params` | object | no | Values for dynamic slots |

## Slot Types

| Type | Description |
|---|---|
| `text` | Any string value |
| `select` | Fixed set of options |
| `number` | Numeric value |
| `boolean` | true / false |

## Development

```bash
# Build frontend
cd frontend
npm install
npm run build

# The built JS is copied automatically to:
# custom_components/hass_requester/www/hass-requester-panel.js
```
