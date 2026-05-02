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
- [Panel UI](#panel-ui)
  - [Creating & Editing Requests](#creating--editing-requests)
  - [Import & Export](#import--export)
  - [cURL Import](#curl-import)
- [Dynamic Slots](#dynamic-slots)
  - [Slot Types](#slot-types)
  - [Template Values in Slots](#template-values-in-slots)
- [Automation](#automation)
  - [Per-Request Services](#per-request-services)
  - [Generic `send` Service](#generic-send-service)
  - [Capturing the Response (`response_variable`)](#capturing-the-response-response_variable)
- [Dashboard (Lovelace)](#dashboard-lovelace)
- [Scenarios & Examples](#scenarios--examples)
  - [Scenario 1 — Send a notification when motion is detected](#scenario-1--send-a-notification-when-motion-is-detected)
  - [Scenario 2 — Fetch weather and notify every hour](#scenario-2--fetch-weather-and-notify-every-hour)
  - [Scenario 3 — Control a smart device via REST API](#scenario-3--control-a-smart-device-via-rest-api)
  - [Scenario 4 — Webhook on door open](#scenario-4--webhook-on-door-open)
  - [Scenario 5 — API with token stored in an input helper](#scenario-5--api-with-token-stored-in-an-input-helper)
  - [Scenario 6 — Check server status and act conditionally](#scenario-6--check-server-status-and-act-conditionally)
  - [Scenario 7 — Save API response to an entity](#scenario-7--save-api-response-to-an-entity)
  - [Scenario 8 — Dashboard button that triggers a request](#scenario-8--dashboard-button-that-triggers-a-request)
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
| cURL import | No | Yes |
| Per-request automation UI | No | Yes (labeled fields) |
| Capture HTTP response in automations | No | Yes |
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

## Panel UI

### Creating & Editing Requests

The sidebar panel is your central place to manage all HTTP requests.

**What you can do:**
- Create, edit, and delete requests
- Set method (GET / POST / PUT / PATCH / DELETE)
- Define URL, query parameters, headers, and body
- Add dynamic slots (placeholders filled at call time)
- Test the request live before saving

**How to open it:**
Click **Requester** in the Home Assistant sidebar (admin only).

### Import & Export

You can back up and restore requests as JSON files.

- **Export all** — saves a single JSON file with all your requests
- **Import** — loads requests from a JSON file; if a request with the same name already exists, you can choose to update or skip it
- **Per-request export/import** — available inside the request editor to back up a single request

### cURL Import

Already have a working curl command? Import it in one click.

**How to use:**
1. Open the request editor → click **⬇ cURL**
2. Paste your curl command, for example:
   ```bash
   curl -X POST "https://api.example.com/notify" \
     -H "Authorization: Bearer mytoken" \
     -H "Content-Type: application/json" \
     -d '{"message": "hello"}'
   ```
3. URL, method, headers, and body are filled in automatically

---

## Dynamic Slots

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

### Slot Types

When defining a slot in the panel, choose a type to get the right input field in the automation editor:

| Type | Description | Example value |
|---|---|---|
| `text` | Any string or template | `"hello"` or `"{{ states('sensor.name') }}"` |
| `select` | Fixed list of options | `"option_a"` |
| `number` | Numeric value | `42` |
| `boolean` | true / false toggle | `true` |

### Template Values in Slots

Slot values can contain **Home Assistant Jinja2 templates**. HASS Requester resolves them **before** building the HTTP request — so the final URL and body always contain real values.

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

**Common template examples:**

| What you want | Template value |
|---|---|
| State of an entity | `"{{ states('sensor.front_door') }}"` |
| Entity attribute | `"{{ state_attr('device_tracker.phone', 'latitude') }}"` |
| Trigger event data | `"{{ trigger.event.data.name }}"` |
| Input helper value | `"{{ states('input_text.api_token') }}"` |
| Current timestamp | `"{{ now().timestamp() \| int }}"` |

---

## Automation

### Per-Request Services

Every saved request automatically registers its own HA service named `hass_requester.<request_name>`.

This means each request shows up as a **labeled action** in the automation editor with a field for every slot.

**Example — request named `person_arrived` with a `person` slot:**

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

### Generic `send` Service

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

### Capturing the Response (`response_variable`)

Every HASS Requester service call returns the full HTTP response.  
Use `response_variable` in your automation to capture it and branch on the result.

> **Requires Home Assistant 2023.7 or newer.**

**Response object fields:**

| Field | Type | Description |
|---|---|---|
| `status_code` | int | HTTP status code (200, 404, 500…) |
| `success` | bool | `true` if status < 400, `false` otherwise |
| `body` | dict or string | Parsed JSON object if the API returns JSON, plain text otherwise |
| `headers` | dict | Response headers returned by the server |

**Basic usage:**

```yaml
- action: hass_requester.my_request
  data:
    city: "Tel Aviv"
  response_variable: result

- action: notify.mobile_app_my_phone
  data:
    message: "Status {{ result.status_code }}: {{ result.body.temperature }}°C"
```

**Common condition templates:**

```yaml
# Success check
value_template: "{{ result.success }}"

# Specific field value
value_template: "{{ result.body.status == 'active' }}"

# Numeric threshold
value_template: "{{ result.body.temperature > 30 }}"

# Exact status code
value_template: "{{ result.status_code == 200 }}"

# Nested JSON field
value_template: "{{ result.body.data.device.state == 'on' }}"

# Plain-text response
value_template: "{{ result.body == 'OK' }}"
```

---

## Dashboard (Lovelace)

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

## Scenarios & Examples

### Scenario 1 — Send a notification when motion is detected

**Goal:** When the living room motion sensor fires, call an external API to log the event, then send a push notification.

**Request setup in panel:**
- Name: `log_motion_event`
- Method: `POST`
- URL: `https://my-server.com/api/events`
- Body: `{ "room": "{{ room }}", "timestamp": "{{ ts }}" }`
- Slots: `room` (text), `ts` (text)

**Automation:**
```yaml
alias: Log motion event
triggers:
  - trigger: state
    entity_id: binary_sensor.living_room_motion
    to: "on"
actions:
  - action: hass_requester.log_motion_event
    data:
      room: "Living Room"
      ts: "{{ now().isoformat() }}"
    response_variable: result

  - action: notify.mobile_app_my_phone
    data:
      title: "Motion detected"
      message: >
        {% if result.success %}
          Event logged successfully.
        {% else %}
          Motion detected but logging failed ({{ result.status_code }}).
        {% endif %}
mode: single
```

---

### Scenario 2 — Fetch weather and notify every hour

**Goal:** Every hour, fetch the current temperature from an external weather API and send it as a notification.

**Request setup in panel:**
- Name: `get_weather`
- Method: `GET`
- URL: `https://api.weatherapi.com/v1/current.json?key={{ api_key }}&q={{ city }}`
- Slots: `api_key` (text), `city` (text)

**Automation:**
```yaml
alias: Hourly weather update
triggers:
  - trigger: time_pattern
    hours: "/1"
actions:
  - action: hass_requester.get_weather
    data:
      api_key: "{{ states('input_text.weather_api_key') }}"
      city: "Tel Aviv"
    response_variable: weather

  - if:
      - condition: template
        value_template: "{{ weather.success }}"
    then:
      - action: notify.mobile_app_my_phone
        data:
          title: "Weather — Tel Aviv"
          message: >
            {{ weather.body.current.temp_c }}°C,
            {{ weather.body.current.condition.text }}
    else:
      - action: notify.mobile_app_my_phone
        data:
          title: "Weather API error"
          message: "Failed to fetch weather ({{ weather.status_code }})"
mode: single
```

---

### Scenario 3 — Control a smart device via REST API

**Goal:** When a HA switch is turned on, send a REST command to an external smart home bridge to turn on a specific device.

**Request setup in panel:**
- Name: `set_device_state`
- Method: `PUT`
- URL: `https://bridge.local/api/devices/{{ device_id }}/state`
- Headers: `Authorization: Bearer {{ token }}`
- Body: `{ "state": "{{ state }}" }`
- Slots: `device_id` (text), `token` (text), `state` (select: on/off)

**Automation:**
```yaml
alias: Sync bridge when switch changes
triggers:
  - trigger: state
    entity_id: input_boolean.living_room_scene
actions:
  - action: hass_requester.set_device_state
    data:
      device_id: "lamp-001"
      token: "{{ states('input_text.bridge_token') }}"
      state: "{{ states('input_boolean.living_room_scene') }}"
    response_variable: result

  - condition: template
    value_template: "{{ not result.success }}"

  - action: notify.mobile_app_my_phone
    data:
      message: "Bridge command failed: {{ result.status_code }}"
mode: queued
max: 5
```

---

### Scenario 4 — Webhook on door open

**Goal:** Send a webhook to an external service (e.g. Zapier, Make, IFTTT) every time the front door opens, including the time and door name.

**Request setup in panel:**
- Name: `door_webhook`
- Method: `POST`
- URL: `https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy/`
- Body: `{ "door": "{{ door_name }}", "opened_at": "{{ opened_at }}", "user": "{{ user }}" }`
- Slots: `door_name` (text), `opened_at` (text), `user` (text)

**Automation:**
```yaml
alias: Notify Zapier on door open
triggers:
  - trigger: state
    entity_id: binary_sensor.front_door
    to: "on"
actions:
  - action: hass_requester.door_webhook
    data:
      door_name: "Front Door"
      opened_at: "{{ now().strftime('%Y-%m-%d %H:%M:%S') }}"
      user: "{{ states('input_text.last_person_home') }}"
mode: single
```

---

### Scenario 5 — API with token stored in an input helper

**Goal:** Call a private API that requires an auth token. Store the token in an `input_text` helper so it can be updated without changing the automation.

**Setup:**
1. Create an `input_text` helper named `my_api_token` in **Settings → Helpers**
2. Set the token value there

**Request setup in panel:**
- Name: `private_api_call`
- Method: `GET`
- URL: `https://my-private-api.com/data`
- Headers: `Authorization: Bearer {{ token }}`
- Slots: `token` (text)

**Automation:**
```yaml
actions:
  - action: hass_requester.private_api_call
    data:
      token: "{{ states('input_text.my_api_token') }}"
    response_variable: result
```

> **Tip:** Use `input_text` helpers to store tokens, API keys, and other values that may change — no need to edit automations when you rotate credentials.

---

### Scenario 6 — Check server status and act conditionally

**Goal:** When a light turns on, verify with an external server that the action is allowed. Proceed only if the server confirms.

**Request setup in panel:**
- Name: `check_permission`
- Method: `GET`
- URL: `https://my-server.com/api/permission?action={{ action }}`
- Slots: `action` (text)

**Automation:**
```yaml
alias: Check permission before turning on lights
triggers:
  - trigger: state
    entity_id: light.living_room
    to: "on"
actions:
  # Ask the server if this action is allowed
  - action: hass_requester.check_permission
    data:
      action: "light_on"
    response_variable: perm

  # Stop if the server says no
  - condition: template
    value_template: "{{ perm.body.allowed == true }}"

  # Proceed — the server confirmed
  - action: scene.turn_on
    target:
      entity_id: scene.evening_mode
mode: single
```

**With `if/then/else` for full branching:**
```yaml
  - if:
      - condition: template
        value_template: "{{ perm.body.allowed == true }}"
    then:
      - action: scene.turn_on
        target:
          entity_id: scene.evening_mode
    else:
      - action: light.turn_off
        target:
          entity_id: light.living_room
      - action: notify.mobile_app_my_phone
        data:
          message: "Action blocked by server: {{ perm.body.reason }}"
```

---

### Scenario 7 — Save API response to an entity

**Goal:** Periodically fetch data from an API and store the result in an `input_text` helper so it can be displayed on the dashboard or used in other automations.

**Request setup in panel:**
- Name: `get_server_status`
- Method: `GET`
- URL: `https://my-server.com/api/status`

**Automation:**
```yaml
alias: Refresh server status every 5 minutes
triggers:
  - trigger: time_pattern
    minutes: "/5"
actions:
  - action: hass_requester.get_server_status
    response_variable: status

  - action: input_text.set_value
    target:
      entity_id: input_text.server_status
    data:
      value: "{{ status.body.state }} ({{ status.body.uptime }}s)"

  # Also store the full JSON for later use
  - action: input_text.set_value
    target:
      entity_id: input_text.server_status_raw
    data:
      value: "{{ status.body | tojson }}"
mode: single
```

---

### Scenario 8 — Dashboard button that triggers a request

**Goal:** Add a button to a Lovelace dashboard that calls an API directly, passing a value from an entity at the time of the press.

**Request setup in panel:**
- Name: `ring_doorbell`
- Method: `POST`
- URL: `https://my-server.com/api/doorbell`
- Body: `{ "message": "{{ message }}", "volume": {{ volume }} }`
- Slots: `message` (text), `volume` (number)

**Lovelace card:**
```yaml
type: button
name: Ring Doorbell
icon: mdi:doorbell
tap_action:
  action: call-service
  service: hass_requester.ring_doorbell
  service_data:
    message: "Someone at the door"
    volume: "{{ states('input_number.doorbell_volume') | int }}"
```

**Multiple buttons with different values:**
```yaml
type: grid
columns: 2
cards:
  - type: button
    name: Low volume
    tap_action:
      action: call-service
      service: hass_requester.ring_doorbell
      service_data:
        message: "Soft ring"
        volume: 30

  - type: button
    name: High volume
    tap_action:
      action: call-service
      service: hass_requester.ring_doorbell
      service_data:
        message: "Loud ring"
        volume: 100
```

---

## Service Reference

### `hass_requester.<request_name>`

Automatically created for each saved request. Slot names become the service fields.

```yaml
action: hass_requester.person_arrived
data:
  person: "John"           # slot named 'person'
  location: "home"         # slot named 'location'
response_variable: result  # optional — capture the HTTP response
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
response_variable: result  # optional
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
