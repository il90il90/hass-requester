import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type {
  HassRequest,
  HomeAssistant,
  HttpMethod,
  BodyType,
  NewHassRequest,
  Slot,
} from "../types";
import "../components/curl-importer";
import "../components/slot-editor";
import { saveJsonFile, pickJsonFile } from "../utils/download";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const BODY_TYPES: BodyType[] = ["none", "json", "form", "text"];
const METHODS_WITH_BODY: HttpMethod[] = ["POST", "PUT", "PATCH"];

@customElement("hass-requester-editor")
export class RequestEditor extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) request: HassRequest | null = null;

  @state() private _name = "";
  @state() private _method: HttpMethod = "GET";
  @state() private _url = "";
  @state() private _queryParams: Array<[string, string]> = [];
  @state() private _headers: Array<[string, string]> = [];
  @state() private _bodyType: BodyType = "none";
  @state() private _bodyJson = "";
  @state() private _bodyForm: Array<[string, string]> = [];
  @state() private _bodyText = "";
  @state() private _slots: Slot[] = [];
  @state() private _saving = false;
  @state() private _testing = false;
  @state() private _error = "";
  @state() private _testResult: { success: boolean; message: string } | null = null;
  @state() private _testParams: Record<string, string> = {};
  @state() private _importFileError = "";
  @state() private _copyDialog: { data: string; filename: string } | null = null;
  @state() private _copied = false;

  static styles = css`
    :host {
      display: block;
      max-width: 920px;
      margin: 0 auto;
      padding: 24px 16px;
    }
    h2 {
      margin: 0 0 6px;
      font-size: 22px;
      color: var(--primary-text-color);
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .header-title {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .header-title img {
      width: 36px;
      height: 36px;
      border-radius: 7px;
      flex-shrink: 0;
    }
    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .card {
      background: var(--card-background-color);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 14px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,.12));
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0 0 14px;
    }
    .field {
      margin-bottom: 14px;
    }
    label {
      font-size: 13px;
      color: var(--secondary-text-color);
      display: block;
      margin-bottom: 4px;
    }
    input[type="text"],
    select,
    textarea {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
    }
    input[type="text"]:focus,
    select:focus,
    textarea:focus {
      border-color: var(--primary-color);
    }
    textarea {
      font-family: monospace;
      min-height: 120px;
      resize: vertical;
    }
    .method-url {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 10px;
    }
    .kv-table {
      width: 100%;
      border-collapse: collapse;
    }
    .kv-table th {
      text-align: left;
      font-size: 12px;
      color: var(--secondary-text-color);
      padding: 4px 6px;
      border-bottom: 1px solid var(--divider-color);
    }
    .kv-table td {
      padding: 4px 4px;
    }
    .kv-table input {
      width: 100%;
      padding: 5px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
      box-sizing: border-box;
    }
    .slot-btn {
      padding: 3px 10px;
      background: var(--accent-color, #03a9f4);
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
    }
    .delete-btn {
      background: none;
      border: none;
      color: var(--error-color, #db4437);
      cursor: pointer;
      font-size: 18px;
      padding: 0 4px;
    }
    .add-row-btn {
      margin-top: 8px;
      padding: 4px 12px;
      background: none;
      border: 1px solid var(--primary-color);
      border-radius: 4px;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 13px;
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    .btn-cancel {
      padding: 8px 20px;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 14px;
    }
    .btn-test {
      padding: 8px 20px;
      background: #ff9800;
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    .btn-test:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-save {
      padding: 8px 24px;
      background: var(--primary-color);
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    .btn-save:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .slot-hint {
      margin-top: 16px;
      padding: 12px 16px;
      background: rgba(3, 169, 244, 0.08);
      border: 1px solid rgba(3, 169, 244, 0.3);
      border-radius: 8px;
      font-size: 13px;
      color: var(--primary-text-color);
    }
    .slot-hint p {
      margin: 6px 0;
    }
    .slot-hint code {
      background: rgba(0,0,0,0.18);
      padding: 1px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
    }
    .slot-hint-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
    }
    .slot-hint-table th,
    .slot-hint-table td {
      text-align: left;
      padding: 4px 10px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      font-size: 13px;
    }
    .slot-hint-table th {
      color: var(--secondary-text-color);
      font-weight: 600;
    }
    .slot-hint-example {
      margin-top: 10px !important;
      color: var(--secondary-text-color);
    }
    .msg {
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      margin-top: 10px;
    }
    .msg.error {
      background: rgba(219, 68, 55, 0.12);
      color: var(--error-color, #db4437);
      border: 1px solid rgba(219, 68, 55, 0.3);
    }
    .msg.success {
      background: rgba(67, 160, 71, 0.12);
      color: #43a047;
      border: 1px solid rgba(67, 160, 71, 0.3);
    }
    /* Test params modal */
    .test-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
    }
    .test-dialog {
      background: var(--card-background-color);
      border-radius: 10px;
      padding: 28px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .test-dialog h3 { margin: 0 0 6px; }
    .test-dialog p { color: var(--secondary-text-color); font-size: 13px; margin: 0 0 16px; }
    .test-field { margin-bottom: 12px; }
    .test-field label { font-size: 13px; color: var(--secondary-text-color); display: block; margin-bottom: 4px; }
    .test-field input {
      width: 100%;
      padding: 7px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      box-sizing: border-box;
    }
    .test-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
    .test-cancel { padding: 8px 18px; background: none; border: 1px solid var(--divider-color); border-radius: 6px; cursor: pointer; color: var(--primary-text-color); }
    .test-run { padding: 8px 20px; background: #ff9800; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .test-run:disabled { opacity: 0.5; }
    /* copy-fallback dialog */
    .copy-dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 220;
    }
    .copy-dialog-card {
      background: var(--card-background-color);
      border-radius: 10px;
      padding: 22px;
      max-width: 500px;
      width: 94%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .copy-dialog-card h3 { margin: 0; font-size: 16px; }
    .copy-dialog-card p { margin: 0; font-size: 13px; color: var(--secondary-text-color); }
    .copy-dialog-card textarea {
      width: 100%;
      height: 180px;
      font-family: monospace;
      font-size: 11px;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--secondary-background-color, #1e1e1e);
      color: var(--primary-text-color);
      resize: none;
      box-sizing: border-box;
    }
    .copy-dialog-actions { display: flex; justify-content: flex-end; gap: 10px; }
    .copy-dialog-close {
      padding: 8px 16px;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    .copy-dialog-copy {
      padding: 8px 20px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    .copy-dialog-copy.done { background: #43a047; }
    .btn-export {
      padding: 7px 12px;
      background: none;
      border: 1px solid var(--primary-color);
      border-radius: 6px;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }
    .btn-export:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
    }
    .btn-import {
      padding: 7px 12px;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }
    .btn-import:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .import-file-error {
      margin-top: 10px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      background: rgba(219, 68, 55, 0.12);
      color: var(--error-color, #db4437);
      border: 1px solid rgba(219, 68, 55, 0.3);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.request) {
      this._populateFromRequest(this.request);
    }
  }

  private _populateFromRequest(req: HassRequest) {
    this._name = req.name;
    this._method = req.method;
    this._url = req.url;
    this._queryParams = Object.entries(req.query_params);
    this._headers = Object.entries(req.headers);
    this._bodyType = req.body_type;
    this._slots = req.slots.map((s) => ({ _id: crypto.randomUUID(), ...s }));
    if (req.body_type === "json" && req.body) {
      this._bodyJson =
        typeof req.body === "string"
          ? req.body
          : JSON.stringify(req.body, null, 2);
    } else if (
      req.body_type === "form" &&
      req.body &&
      typeof req.body === "object"
    ) {
      this._bodyForm = Object.entries(req.body as Record<string, string>);
    } else if (req.body_type === "text" && req.body) {
      this._bodyText = String(req.body);
    }
    // Init test params with empty strings for each slot
    const params: Record<string, string> = {};
    req.slots.forEach((s) => { params[s.name] = ""; });
    this._testParams = params;
  }

  private _onCurlParsed(e: CustomEvent<Omit<NewHassRequest, "name">>) {
    const d = e.detail;
    this._method = d.method;
    this._url = d.url;
    this._queryParams = Object.entries(d.query_params);
    this._headers = Object.entries(d.headers);
    this._bodyType = d.body_type;
    if (d.body_type === "json" && d.body) {
      this._bodyJson =
        typeof d.body === "string"
          ? d.body
          : JSON.stringify(d.body, null, 2);
    } else if (
      d.body_type === "form" &&
      d.body &&
      typeof d.body === "object"
    ) {
      this._bodyForm = Object.entries(d.body as Record<string, string>);
    } else if (d.body_type === "text" && d.body) {
      this._bodyText = String(d.body);
    }
  }

  private _toSlot(
    table: "query" | "headers",
    rowIndex: number,
    key: string,
    _value: string
  ) {
    const slotName =
      key.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase() || "slot";
    const newValue = `{{ ${slotName} }}`;
    if (table === "query") {
      const updated = [...this._queryParams];
      updated[rowIndex] = [key, newValue];
      this._queryParams = updated;
    } else {
      const updated = [...this._headers];
      updated[rowIndex] = [key, newValue];
      this._headers = updated;
    }
    if (!this._slots.find((s) => s.name === slotName)) {
      this._slots = [
        ...this._slots,
        { name: slotName, type: "text", required: true, default: null },
      ];
      this._testParams = { ...this._testParams, [slotName]: "" };
    }
  }

  private _kvTable(
    rows: Array<[string, string]>,
    onChange: (rows: Array<[string, string]>) => void,
    onSlot: (i: number, k: string, v: string) => void
  ) {
    return html`
      <table class="kv-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(
            ([k, v], i) => html`
              <tr>
                <td>
                  <input
                    .value=${k}
                    placeholder="key"
                    @input=${(e: InputEvent) => {
                      const updated = [...rows];
                      updated[i] = [
                        (e.target as HTMLInputElement).value,
                        v,
                      ];
                      onChange(updated);
                    }}
                  />
                </td>
                <td>
                  <input
                    .value=${v}
                    placeholder="value or {{ slot }}"
                    @input=${(e: InputEvent) => {
                      const updated = [...rows];
                      updated[i] = [
                        k,
                        (e.target as HTMLInputElement).value,
                      ];
                      onChange(updated);
                    }}
                  />
                </td>
                <td>
                  <button
                    class="slot-btn"
                    title="Convert to dynamic slot"
                    @click=${() => onSlot(i, k, v)}
                  >
                    → Slot
                  </button>
                </td>
                <td>
                  <button
                    class="delete-btn"
                    @click=${() => {
                      const updated = [...rows];
                      updated.splice(i, 1);
                      onChange(updated);
                    }}
                  >
                    ×
                  </button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
      <button
        class="add-row-btn"
        @click=${() => onChange([...rows, ["", ""]])}
      >
        + Add Row
      </button>
    `;
  }

  private _buildPayload(): NewHassRequest {
    const query_params = Object.fromEntries(
      this._queryParams.filter(([k]) => k.trim())
    );
    const headers = Object.fromEntries(
      this._headers.filter(([k]) => k.trim())
    );

    let body: Record<string, unknown> | string | null = null;
    if (this._bodyType === "json" && this._bodyJson.trim()) {
      try {
        body = JSON.parse(this._bodyJson);
      } catch {
        body = this._bodyJson;
      }
    } else if (this._bodyType === "form") {
      body = Object.fromEntries(this._bodyForm.filter(([k]) => k.trim()));
    } else if (this._bodyType === "text") {
      body = this._bodyText || null;
    }

    return {
      name: this._name,
      method: this._method,
      url: this._url,
      query_params,
      headers,
      body_type: this._bodyType,
      body,
      slots: this._slots.map(({ _id: _ignored, ...s }) => s),
    };
  }

  private _getWsError(e: unknown): string {
    if (!e || typeof e !== "object") return "Failed to save request";
    const err = e as Record<string, unknown>;
    return String(err["message"] ?? err["error"] ?? "Failed to save request");
  }

  private async _exportRequest() {
    const payload = this._buildPayload();
    const filename = payload.name
      ? payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + ".json"
      : "request.json";
    const data = JSON.stringify(payload, null, 2);
    await saveJsonFile(filename, data, (d, f) => { this._copyDialog = { data: d, filename: f }; });
  }

  private async _triggerImportFile() {
    this._importFileError = "";
    const file = await pickJsonFile();
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<HassRequest>;
      // Support both single request object and { requests: [...] } wrapping
      const req: Partial<HassRequest> = Array.isArray((parsed as Record<string, unknown>)?.requests)
        ? ((parsed as Record<string, unknown>).requests as HassRequest[])[0]
        : parsed;
      if (!req?.url && !req?.method) throw new Error("Not a valid request file.");
      this._populateFromRequest({
        id: "",
        name: req.name ?? "",
        method: req.method ?? "GET",
        url: req.url ?? "",
        query_params: req.query_params ?? {},
        headers: req.headers ?? {},
        body_type: req.body_type ?? "none",
        body: req.body ?? null,
        slots: req.slots ?? [],
      });
    } catch (err: unknown) {
      this._importFileError =
        err instanceof Error ? err.message : "Failed to import request file.";
    }
  }

  private async _save() {
    if (!this._name.trim()) {
      this._error = "Name is required.";
      return;
    }
    if (!this._url.trim()) {
      this._error = "URL is required.";
      return;
    }
    this._saving = true;
    this._error = "";
    this._testResult = null;
    try {
      const payload = this._buildPayload();
      if (this.request?.id) {
        await this.hass.callWS({
          type: "hass_requester/update",
          request_id: this.request.id,
          ...payload,
        });
      } else {
        await this.hass.callWS({
          type: "hass_requester/create",
          ...payload,
        });
      }
      this.dispatchEvent(
        new CustomEvent("saved", { bubbles: true, composed: true })
      );
    } catch (e: unknown) {
      this._error = this._getWsError(e);
    } finally {
      this._saving = false;
    }
  }

  @state() private _showTestDialog = false;

  private _openTest() {
    // Reset test params for current slots
    const params: Record<string, string> = {};
    this._slots.forEach((s) => {
      params[s.name] = this._testParams[s.name] ?? "";
    });
    this._testParams = params;
    this._testResult = null;
    this._showTestDialog = true;
  }

  private async _runTest() {
    this._testing = true;
    this._testResult = null;
    try {
      const payload = this._buildPayload();
      await this.hass.callWS({
        type: "hass_requester/test_request",
        ...payload,
        params: this._testParams,
      });
      this._testResult = { success: true, message: "Request sent successfully!" };
    } catch (e: unknown) {
      this._testResult = {
        success: false,
        message: this._getWsError(e),
      };
    } finally {
      this._testing = false;
    }
  }

  render() {
    const hasBody = METHODS_WITH_BODY.includes(this._method);

    return html`
      <!-- Header -->
      <div class="header-row">
        <div class="header-title">
          <img src="/api/hass_requester/frontend/logo.png" alt="HASS Requester" />
          <h2>${this.request ? "Edit Request" : "New Request"}</h2>
        </div>
        <div class="header-actions">
          <button
            class="btn-import"
            title="Load request from a JSON file"
            @click=${this._triggerImportFile}
          >
            ↓ Import
          </button>
          <button
            class="btn-export"
            title="Save this request as a JSON file"
            @click=${this._exportRequest}
          >
            ↑ Export
          </button>
          <hass-requester-curl-importer
            .hass=${this.hass}
            @curl-parsed=${this._onCurlParsed}
          ></hass-requester-curl-importer>
        </div>
      </div>

      ${this._importFileError
        ? html`<div class="import-file-error">${this._importFileError}</div>`
        : html``}

      <!-- Basic Info -->
      <div class="card">
        <p class="section-title">Basic</p>
        <div class="field">
          <label>Name</label>
          <input
            type="text"
            .value=${this._name}
            placeholder="my_request"
            @input=${(e: InputEvent) =>
              (this._name = (e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="field method-url">
          <div>
            <label>Method</label>
            <select
              .value=${this._method}
              @change=${(e: Event) => {
                this._method = (e.target as HTMLSelectElement)
                  .value as HttpMethod;
                if (!METHODS_WITH_BODY.includes(this._method)) {
                  this._bodyType = "none";
                }
              }}
            >
              ${METHODS.map(
                (m) => html`<option value=${m} ?selected=${m === this._method}>${m}</option>`
              )}
            </select>
          </div>
          <div>
            <label>URL</label>
            <input
              type="text"
              .value=${this._url}
              placeholder="https://api.example.com/endpoint/{{ path_param }}"
              @input=${(e: InputEvent) =>
                (this._url = (e.target as HTMLInputElement).value)}
            />
          </div>
        </div>
      </div>

      <!-- Query Params -->
      <div class="card">
        <p class="section-title">Query Parameters</p>
        ${this._kvTable(
          this._queryParams,
          (rows) => (this._queryParams = rows),
          (i, k, v) => this._toSlot("query", i, k, v)
        )}
      </div>

      <!-- Headers -->
      <div class="card">
        <p class="section-title">Headers</p>
        ${this._kvTable(
          this._headers,
          (rows) => (this._headers = rows),
          (i, k, v) => this._toSlot("headers", i, k, v)
        )}
      </div>

      <!-- Body (POST/PUT/PATCH only) -->
      ${hasBody
        ? html`
            <div class="card">
              <p class="section-title">Body</p>
              <div class="field">
                <label>Body Type</label>
                <select
                  .value=${this._bodyType}
                  @change=${(e: Event) =>
                    (this._bodyType = (e.target as HTMLSelectElement)
                      .value as BodyType)}
                >
                  ${BODY_TYPES.map(
                    (t) => html`<option value=${t} ?selected=${t === this._bodyType}>${t}</option>`
                  )}
                </select>
              </div>
              ${this._bodyType === "json"
                ? html`
                    <div class="field">
                      <label>JSON Body — use <code>{{ slot_name }}</code> for dynamic values</label>
                      <textarea
                        .value=${this._bodyJson}
                        placeholder='{"key": "{{ slot_name }}", "static": "value"}'
                        @input=${(e: InputEvent) =>
                          (this._bodyJson = (
                            e.target as HTMLTextAreaElement
                          ).value)}
                      ></textarea>
                    </div>
                  `
                : this._bodyType === "form"
                ? html`
                    ${this._kvTable(
                      this._bodyForm,
                      (rows) => (this._bodyForm = rows),
                      (i, k, v) => this._toSlot("query", i, k, v)
                    )}
                  `
                : this._bodyType === "text"
                ? html`
                    <div class="field">
                      <label>Text Body</label>
                      <textarea
                        .value=${this._bodyText}
                        @input=${(e: InputEvent) =>
                          (this._bodyText = (
                            e.target as HTMLTextAreaElement
                          ).value)}
                      ></textarea>
                    </div>
                  `
                : html``}
            </div>
          `
        : html``}

      <!-- Slots -->
      <div class="card">
        <p class="section-title">Dynamic Slots</p>
        <hass-requester-slot-editor
          .slots=${this._slots}
          @slots-changed=${(e: CustomEvent<{ slots: Slot[] }>) => {
            this._slots = e.detail.slots;
            const params = { ...this._testParams };
            e.detail.slots.forEach((s) => {
              if (!(s.name in params)) params[s.name] = "";
            });
            this._testParams = params;
          }}
        ></hass-requester-slot-editor>

        ${this._slots.length > 0 ? html`
          <div class="slot-hint">
            <strong>💡 How to use slots in your request:</strong>
            <p>Place <code>{{ slot_name }}</code> anywhere in the URL, query params, headers or body. It will be replaced with the value from the automation.</p>
            <table class="slot-hint-table">
              <thead><tr><th>Slot</th><th>Use in URL / params / body as</th></tr></thead>
              <tbody>
                ${this._slots.filter(s => s.name).map(s => html`
                  <tr>
                    <td><strong>${s.name}</strong></td>
                    <td><code>{{ ${s.name} }}</code></td>
                  </tr>
                `)}
              </tbody>
            </table>
            <p class="slot-hint-example">
              Example URL:&nbsp;
              <code>https://api.example.com/notify?location={{ ${this._slots[0]?.name || "slot_name"} }}</code>
            </p>
          </div>
        ` : html``}
      </div>

      <!-- Messages -->
      ${this._error
        ? html`<div class="msg error">${this._error}</div>`
        : html``}
      ${this._testResult
        ? html`<div class="msg ${this._testResult.success ? "success" : "error"}">
            ${this._testResult.success ? "✓" : "✗"} ${this._testResult.message}
          </div>`
        : html``}

      <!-- Footer -->
      <div class="footer">
        <button
          class="btn-cancel"
          @click=${() =>
            this.dispatchEvent(
              new CustomEvent("cancelled", { bubbles: true, composed: true })
            )}
        >
          Cancel
        </button>
        <button
          class="btn-test"
          ?disabled=${this._testing || this._saving}
          @click=${this._openTest}
        >
          ${this._testing ? "Sending..." : "⚡ Test"}
        </button>
        <button
          class="btn-save"
          ?disabled=${this._saving || this._testing}
          @click=${this._save}
        >
          ${this._saving ? "Saving..." : "Save Request"}
        </button>
      </div>

      <!-- Test Dialog -->
      ${this._showTestDialog
        ? html`
            <div
              class="test-overlay"
              @click=${(e: MouseEvent) => {
                if (e.target === e.currentTarget) this._showTestDialog = false;
              }}
            >
              <div class="test-dialog">
                <h3>⚡ Test Request</h3>
                <p>
                  Fill in slot values to test the request live.
                  ${this._slots.length === 0
                    ? "No slots defined — request will be sent as-is."
                    : ""}
                </p>
                ${this._slots.map(
                  (s) => html`
                    <div class="test-field">
                      <label>{{ ${s.name} }}${s.required ? " *" : ""}</label>
                      <input
                        type="text"
                        .value=${this._testParams[s.name] ?? ""}
                        placeholder=${s.default != null
                          ? `default: ${s.default}`
                          : s.required
                          ? "required"
                          : "optional"}
                        @input=${(e: InputEvent) => {
                          this._testParams = {
                            ...this._testParams,
                            [s.name]: (e.target as HTMLInputElement).value,
                          };
                        }}
                      />
                    </div>
                  `
                )}
                ${this._testResult
                  ? html`
                      <div
                        class="msg ${this._testResult.success
                          ? "success"
                          : "error"}"
                        style="margin-top:12px"
                      >
                        ${this._testResult.success ? "✓" : "✗"}
                        ${this._testResult.message}
                      </div>
                    `
                  : html``}
                <div class="test-actions">
                  <button
                    class="test-cancel"
                    @click=${() => {
                      this._showTestDialog = false;
                      this._testResult = null;
                    }}
                  >
                    Close
                  </button>
                  <button
                    class="test-run"
                    ?disabled=${this._testing}
                    @click=${this._runTest}
                  >
                    ${this._testing ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </div>
            </div>
          `
        : html``}

      ${this._copyDialog
        ? html`
            <div class="copy-dialog-overlay">
              <div class="copy-dialog-card">
                <h3>📋 Save Request Manually</h3>
                <p>
                  Your browser couldn't download the file automatically.
                  Copy the text below and save it as
                  <strong>${this._copyDialog.filename}</strong>.
                </p>
                <textarea readonly .value=${this._copyDialog.data}></textarea>
                <div class="copy-dialog-actions">
                  <button
                    class="copy-dialog-close"
                    @click=${() => { this._copyDialog = null; this._copied = false; }}
                  >Close</button>
                  <button
                    class="copy-dialog-copy ${this._copied ? "done" : ""}"
                    @click=${async () => {
                      await navigator.clipboard.writeText(this._copyDialog!.data);
                      this._copied = true;
                      setTimeout(() => { this._copied = false; }, 2500);
                    }}
                  >${this._copied ? "✓ Copied!" : "Copy to Clipboard"}</button>
                </div>
              </div>
            </div>
          `
        : html``}
    `;
  }
}
