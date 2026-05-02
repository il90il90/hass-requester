# HASS Requester

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/hacs/integration)
![HA Version](https://img.shields.io/badge/HA-2024.1%2B-blue)

[![Add to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=il90il90&repository=hass-requester&category=integration)
[![Add Integration](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=hass_requester)

> Send HTTP requests from Home Assistant automations, scripts, and dashboard buttons — with a visual panel, dynamic slots, and full Jinja2 template support.

---

## Table of Contents

- [What is HASS Requester?](#what-is-hass-requester)
- [Installation](#installation)
  - [Step 1 — Add via HACS](#step-1--add-via-hacs)
  - [Step 2 — Add the Integration](#step-2--add-the-integration)
- [Feature: Panel UI](#feature-panel-ui)
- [Feature: CURL Import](#feature-curl-import)
- [Feature: Dynamic Slots](#feature-dynamic-slots)
- [Feature: Per-Request Services (Automation UI)](#feature-per-request-services-automation-ui)
- [Feature: Template Slot Values](#feature-template-slot-values)
- [Feature: Lovelace Card Buttons](#feature-lovelace-card-buttons)
- [Feature: Generic `send` Service](#feature-generic-send-service)
- [Feature: Response Data](#feature-response-data)
- [Slot Types Reference](#slot-types-reference)
- [Service Reference](#service-reference)
- [Deploying to Home Assistant OS](#deploying-to-home-assistant-os)
- [Development](#development)

---

## What is HASS Requester?

HASS Requester lets you define HTTP requests once in a visual panel, then trigger them from anywhere in Home Assistant — automations, scripts, Lovelace buttons — with dynamic values filled in at call time.

**Why use it instead of `rest_command`?**

| | `rest_command` | HASS Requester |
|---|---|---|
| Visual editor | No | Yes |
| Dynamic parameters (slots) | Limited | Full support |
| Jinja2 templates in slot values | No | Yes |
| CURL import | No | Yes |
| Per-request automation UI | No | Yes (labeled fields) |
| Test before saving | No | Yes |

---

## Installation

### Step 1 — Add via HACS

1. Open **HACS** in your Home Assistant sidebar
2. Click the **⋮ menu** (top right) → **Custom repositories**
3. Paste the repository URL:
   ```
   https://github.com/il90il90/hass-requester
   ```
4. Set **Category** to `Integration` → click **Add**
5. Search for **HASS Requester** in HACS → click **Download**
6. **Restart Home Assistant**

### Step 2 — Add the Integration

1. Go to **Settings → Devices & Services → Add Integration**
2. Search for **HASS Requester** → click to add
3. No configuration needed — the **Requester** panel appears in your sidebar

> **Important:** This step is required. Without adding the integration entry, no services will be registered and the panel will be read-only.

---

## Feature: Panel UI

The sidebar panel is your central place to manage all HTTP requests.

**What you can do:**
- Create, edit, and delete requests
- Set method (GET / POST / PUT / PATCH / DELETE)
- Define URL, query parameters, headers, and body
- Add dynamic slots (placeholders filled at call time)
- Test the request live before saving

**How to open it:**
Click **Requester** in the Home Assistant sidebar (admin only).

---

## Feature: CURL Import

Already have a working curl command? Import it in one click.

**How to use:**
1. Open the request editor → click **Import from CURL**
2. Paste your curl command, for example:
   ```bash
   curl -X POST "https://api.example.com/notify" \
     -H "Authorization: Bearer mytoken" \
     -H "Content-Type: application/json" \
     -d '{"message": "hello"}'
   ```
3. URL, method, headers, and body are filled in automatically

---

## Feature: Dynamic Slots

Slots are named placeholders inside your request that get filled with real values when the request is triggered.

**Example:**

Define this URL in the panel:
```
https://api.example.com/notify?name={{ person }}&location={{ place }}
```

Add two slots: `person` and `place`.

When calling the service, you provide the values:
```yaml
action: hass_requester.my_request
data:
  person: "John"
  place: "Home"
```

The final request sent will be:
```
GET https://api.example.com/notify?name=John&location=Home
```

**Slots work everywhere in a request:**
- URL path: `https://api.example.com/users/{{ user_id }}`
- Query params: defined as `{{ slot_name }}`
- Headers: `Authorization: Bearer {{ token }}`
- Body (JSON): `{ "name": "{{ person }}", "action": "arrived" }`

---

## Feature: Per-Request Services (Automation UI)

Every saved request automatically registers its own HA service named `hass_requester.<request_name>`.

This means each request shows up as a **labeled action** in the automation editor with a field for every slot.

**Example — request named `person_arrived` with a `person` slot:**

In the automation YAML:
```yaml
action:
  - action: hass_requester.person_arrived
    data:
      person: "{{ trigger.event.data.name }}"
```

In the automation visual editor: search for **`Requester:`** to find your request with its labeled fields.

**Service name rules:**
- Spaces and special characters are replaced with `_`
- All lowercase
- Example: `"Person Arrived!"` → `hass_requester.person_arrived`

> **Note:** After saving a new request in the panel, do a hard browser refresh (**Ctrl+Shift+R**) for the Lovelace editor to recognize the new service name.

---

## Feature: Template Slot Values

Slot values can contain **Home Assistant Jinja2 templates**. HASS Requester resolves them **before** building the HTTP request — so the final URL and body always contain real values.

**How it works:**

```
You pass:     person: "{{ states('input_text.person_name') }}"
                           │
                           │  HASS Requester renders this
                           ▼
Resolved to:  person: "John"
                           │
                           │  Injected into URL / body
                           ▼
Final URL:    https://api.example.com/notify?name=John
```

**Template examples:**

| What you want | Template value |
|---|---|
| State of an entity | `"{{ states('sensor.front_door') }}"` |
| Entity attribute | `"{{ state_attr('device_tracker.phone', 'latitude') }}"` |
| Trigger event data | `"{{ trigger.event.data.name }}"` |
| Input helper value | `"{{ states('input_text.api_token') }}"` |
| Current timestamp | `"{{ now().timestamp() \| int }}"` |

---

## Feature: Lovelace Card Buttons

You can trigger any saved request directly from a **dashboard button** — with slot values read from HA entities in real time.

**Example — Grid card button:**

```yaml
- show_name: true
  show_icon: true
  type: button
  icon: mdi:home-assistant
  name: Notify Arrival
  tap_action:
    action: call-service
    service: hass_requester.person_arrived
    service_data:
      person: "{{ states('input_text.person_name') }}"
```

Because slot values are resolved **server-side** by HASS Requester, the `{{ states(...) }}` template is fully evaluated even when called from a Lovelace button.

**Static value (no template):**
```yaml
    service_data:
      person: "John"
```

**No slots needed (simple request):**
```yaml
tap_action:
  action: call-service
  service: hass_requester.open_door
```

---

## Feature: Generic `send` Service

If you prefer to reference requests by name without using the per-request service, use `hass_requester.send`:

```yaml
action:
  - action: hass_requester.send
    data:
      request: person_arrived        # name of the saved request
      params:
        person: "John"               # static slot value
        location: "{{ states('zone.home') }}"  # template slot value
```

This is useful when the request name is dynamic or when you want a single action that calls different requests based on conditions.

---

## Feature: Response Data

Every HASS Requester service call returns the full HTTP response. Use `response_variable` in your automation to capture it and branch on the result.

### Response object fields

| Field | Type | Description |
|---|---|---|
| `status_code` | int | HTTP status code (200, 404, 500…) |
| `success` | bool | `true` if status < 400, `false` otherwise |
| `body` | dict or string | Parsed JSON object if the API returns JSON, plain text otherwise |
| `headers` | dict | Response headers returned by the server |

### Basic example

```yaml
action:
  - action: hass_requester.my_weather_request
    data:
      city: "Tel Aviv"
    response_variable: api_response

  - if:
      - condition: template
        value_template: "{{ api_response.success }}"
    then:
      - action: notify.mobile_app
        data:
          message: "Temperature: {{ api_response.body.temperature }}°C"
    else:
      - action: notify.mobile_app
        data:
          message: "API error {{ api_response.status_code }}: {{ api_response.body }}"
```

### Accessing nested JSON fields

If the API returns:
```json
{ "data": { "weather": { "temp": 28, "condition": "sunny" } } }
```

Access fields like this:
```yaml
message: >
  Temp: {{ api_response.body.data.weather.temp }}°C,
  Condition: {{ api_response.body.data.weather.condition }}
```

### Saving the response to an input helper

```yaml
  - action: input_text.set_value
    target:
      entity_id: input_text.last_api_response
    data:
      value: "{{ api_response.body | tojson }}"
```

### Conditional branching based on status code

```yaml
  - choose:
      - conditions:
          - condition: template
            value_template: "{{ api_response.status_code == 200 }}"
        sequence:
          - action: light.turn_on
            target:
              entity_id: light.living_room
      - conditions:
          - condition: template
            value_template: "{{ api_response.status_code == 401 }}"
        sequence:
          - action: notify.mobile_app
            data:
              message: "Authentication failed — check your API token"
    default:
      - action: notify.mobile_app
        data:
          message: "Unexpected response: {{ api_response.status_code }}"
```

### Using the generic `send` service with response_variable

```yaml
  - action: hass_requester.send
    data:
      request: my_weather_request
      params:
        city: "Tel Aviv"
    response_variable: api_response
```

> **Note:** `response_variable` requires Home Assistant 2023.7 or newer.

---

## Slot Types Reference

When defining a slot in the panel, choose a type to get the right input field in the automation editor:

| Type | Description | Example value |
|---|---|---|
| `text` | Any string or template | `"hello"` or `"{{ states('sensor.name') }}"` |
| `select` | Fixed list of options | `"option_a"` |
| `number` | Numeric value | `42` |
| `boolean` | true / false toggle | `true` |

---

## Service Reference

### `hass_requester.<request_name>`

Automatically created for each saved request. Slot names become the service fields.

```yaml
action: hass_requester.person_arrived
data:
  person: "John"           # slot named 'person'
  location: "home"         # slot named 'location'
```

### `hass_requester.send`

Generic service — call any request by name with a `params` object.

| Field | Type | Required | Description |
|---|---|---|---|
| `request` | string | yes | Name or ID of the saved request |
| `params` | object | no | Key-value pairs for slots. Supports HA templates. |

```yaml
action: hass_requester.send
data:
  request: person_arrived
  params:
    person: "John"
```

---

## Deploying to Home Assistant OS

If you are developing locally and want to update the running integration:

### Option 1 — Enable SSH add-on

1. Install the **SSH & Web Terminal** add-on from the HA add-on store
2. Copy the files from your machine:
   ```bash
   scp -r custom_components/hass_requester root@<HA_IP>:/config/custom_components/
   ```
3. Restart Home Assistant

### Option 2 — Enable Samba add-on

1. Install the **Samba share** add-on
2. Map `\\<HA_IP>\config` as a network drive on your PC
3. Copy the `custom_components/hass_requester` folder there
4. Restart Home Assistant

### Option 3 — Push to GitHub and update via HACS

1. Merge your feature branch to `main`
2. Create a new release/tag on GitHub
3. In HA → HACS → find HASS Requester → **Update**
4. Restart Home Assistant

---

## Development

```bash
# Install frontend dependencies
cd frontend
npm install

# Build (outputs to custom_components/hass_requester/www/)
npm run build

# Watch mode (rebuilds on file change)
npm run watch
```

---

## License

MIT
