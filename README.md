# HASS Requester

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
![HA Version](https://img.shields.io/badge/HA-2024.1%2B-blue)

[![Add to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=il90il90&repository=hass-requester&category=integration)

[![Add Integration](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=hass_requester)

Send HTTP requests from Home Assistant automations with a beautiful panel UI and dynamic slot parameters.

---

## Features

- **Panel UI** — Manage all your HTTP requests from the HA sidebar
- **CURL Import** — Paste any curl command and it auto-fills the form
- **Dynamic Slots** — Define parameters that are filled at automation call time
- **All HTTP Methods** — GET, POST, PUT, PATCH, DELETE
- **Full Headers & Body** — JSON, Form, Text body types supported
- **Jinja2 Templates** — Use HA state values and trigger data anywhere in the request
- **Automation UI** — Each request appears as a dedicated service with labeled slot fields
- **Template Slot Values** — Pass `{{ states('sensor.x') }}` as a slot value — it is resolved before the request is sent

---

## Screenshots

### Panel — Request Editor
Define your request once with dynamic slots. The hint box shows exactly how to reference each slot in your URL.

![Panel Editor](screenshots/panel-editor.png)

### Automation — Action Picker
Search for `Requester:` to find your request directly. Each saved request appears as a dedicated action.

![Automation Picker](screenshots/automation-picker.png)

### Automation — Guided Slot Inputs
Select your request and get labeled fields with examples for each slot — static values or HA templates.

![Automation Editor](screenshots/automation-editor.png)

---

## Installation via HACS

### Step 1 — Add as Custom Repository

1. Open **HACS** in your Home Assistant sidebar
2. Click the **⋮ menu** (top right) → **Custom repositories**
3. Enter the repository URL:
   ```
   https://github.com/il90il90/hass-requester
   ```
4. Set **Category** to `Integration`
5. Click **Add**

### Step 2 — Install

1. Search for **HASS Requester** in HACS
2. Click **Download**
3. **Restart Home Assistant**

### Step 3 — Add the Integration

1. Go to **Settings → Integrations → Add Integration**
2. Search for **HASS Requester**
3. Click to add — no configuration needed
4. The **Requester** panel appears in your sidebar

---

## Usage

### 1. Create a Request

Open the **Requester** panel → **New Request**

- Paste a curl command via **Import from CURL** to auto-fill all fields
- Or fill in the URL, method, headers, and body manually
- Add **Dynamic Slots** for any value that changes per automation call
- The hint box shows exactly how to reference each slot in your URL (e.g. `{{ location }}`)
- Click **Test** to send the request live before saving
- Click **Save Request**

### 2. Call from Automation — Two Ways

#### Option A: Per-request service — guided UI (recommended)

Each saved request automatically registers a dedicated service.
Search for **`Requester:`** in the automation editor action picker.
Every slot appears as a labeled field — accepts static values or any HA template:

```yaml
action:
  - action: hass_requester.person_arrived
    data:
      person_name: "{{ trigger.event.data.name }}"   # resolved before sending
      location: "{{ states('zone.home') }}"
```

The slot value templates are resolved by HASS Requester **before** the HTTP request
is built, so the final URL / body always contains the real value.

#### Option B: Generic `send` service with YAML params

```yaml
action:
  - action: hass_requester.send
    data:
      request: person_arrived       # name of the saved request
      params:
        person_name: "John"         # static value
        location: "{{ states('input_text.last_location') }}"  # dynamic HA template
```

#### Option C: Lovelace card button

Because slot values are rendered server-side you can reference `input_text`,
`input_select`, or any other entity directly from a dashboard button:

```yaml
tap_action:
  action: call-service
  service: hass_requester.person_arrived
  service_data:
    person_name: "{{ states('input_text.person_name') }}"
    location: home
```

---

## Example: Dynamic location with one request

**Before** — two separate `rest_command` entries:

```yaml
rest_command:
  person_arrived_home:
    url: "https://api.example.com/notify?location=home"
  person_arrived_work:
    url: "https://api.example.com/notify?location=work"
```

**After** — one request with a `location` slot:

```yaml
# URL defined once in the panel:
# https://api.example.com/notify?location={{ location }}

action:
  - action: hass_requester.person_arrived
    data:
      location: "{{ trigger.event.data.location }}"
```

Or from a **Lovelace button** (e.g. a Grid card):

```yaml
tap_action:
  action: call-service
  service: hass_requester.person_arrived
  service_data:
    location: "{{ states('input_text.current_location') }}"
```

---

## How slot template rendering works

When you pass a slot value that contains a Jinja2 template string, HASS Requester
resolves it using Home Assistant's template engine **before** constructing the HTTP request.

```
service_data:
  person_name: "{{ states('input_text.person_name') }}"
         │
         │  resolved by hass_requester
         ▼
  person_name: "John"
         │
         │  injected into URL / body template
         ▼
  https://api.example.com/notify?name=John
```

This means you can use the full HA template language anywhere:

| Use case | Example value |
|---|---|
| Entity state | `"{{ states('sensor.front_door') }}"` |
| Attribute | `"{{ state_attr('device_tracker.phone', 'latitude') }}"` |
| Trigger data | `"{{ trigger.event.data.name }}"` |
| Input helper | `"{{ states('input_text.api_token') }}"` |
| Computed value | `"{{ (now().timestamp() \| int) }}"` |

---

## Service Reference

### `hass_requester.<request_name>` (per-request, guided — recommended)

Each saved request automatically registers its own service with a labeled field per slot.
Search for `Requester:` in the automation editor action picker.
Slot values support HA templates — they are resolved server-side before the request is sent.

### `hass_requester.send` (advanced / generic)

| Field | Type | Required | Description |
|---|---|---|---|
| `request` | string | yes | Name or ID of the saved request |
| `params` | object | no | Key-value pairs for dynamic slots. Supports HA templates. |

---

## Slot Types

| Type | Description | Example value |
|---|---|---|
| `text` | Any string | `"hello"` or `"{{ states('sensor.name') }}"` |
| `select` | Fixed set of options | `"option_a"` |
| `number` | Numeric value | `42` |
| `boolean` | true / false | `true` |

---

## Development

```bash
# Install frontend dependencies
cd frontend
npm install

# Build (output goes to custom_components/hass_requester/www/)
npm run build
```

---

## License

MIT
