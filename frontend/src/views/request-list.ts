import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassRequest, HomeAssistant } from "../types";

@customElement("hass-requester-list")
export class RequestList extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) requests: HassRequest[] = [];
  @state() private _confirmDeleteId: string | null = null;
  @state() private _deleting = false;
  @state() private _copiedId: string | null = null;
  @state() private _importing = false;
  @state() private _importError = "";
  @state() private _importConflicts: Array<{ incoming: Record<string, unknown>; existing: HassRequest }> = [];
  @state() private _conflictChoices: Record<string, "update" | "skip"> = {};
  @state() private _pendingImportNew: Array<Record<string, unknown>> = [];

  static styles = css`
    :host {
      display: block;
      max-width: 900px;
      margin: 0 auto;
      padding: 24px 16px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-title img {
      width: 40px;
      height: 40px;
      border-radius: 8px;
    }
    h2 {
      margin: 0;
      font-size: 22px;
      color: var(--primary-text-color);
    }
    .header-right {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .new-btn {
      padding: 8px 20px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    .export-btn {
      padding: 8px 16px;
      background: none;
      border: 1px solid var(--primary-color);
      border-radius: 6px;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .export-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08);
    }
    .import-btn {
      padding: 8px 16px;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .import-btn:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .import-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .import-error {
      margin-top: 10px;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      background: rgba(219, 68, 55, 0.12);
      color: var(--error-color, #db4437);
      border: 1px solid rgba(219, 68, 55, 0.3);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card-background-color);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,.1));
    }
    thead {
      background: var(--primary-color);
      color: white;
    }
    th {
      text-align: left;
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 14px;
      color: var(--primary-text-color);
    }
    td.url-cell {
      max-width: 260px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
    }
    .method-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 12px;
      font-weight: 700;
      font-family: monospace;
    }
    .method-GET    { background: #e8f5e9; color: #2e7d32; }
    .method-POST   { background: #e3f2fd; color: #1565c0; }
    .method-PUT    { background: #fff3e0; color: #e65100; }
    .method-PATCH  { background: #f3e5f5; color: #6a1b9a; }
    .method-DELETE { background: #ffebee; color: #b71c1c; }
    .slots-cell {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .slot-chip {
      background: var(--secondary-background-color, #f5f5f5);
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 1px 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .name-cell {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .copy-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 3px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      border-radius: 4px;
      opacity: 0;
      transition: opacity 0.15s, color 0.15s, background 0.15s;
      flex-shrink: 0;
    }
    tr:hover .copy-btn {
      opacity: 1;
    }
    .copy-btn:hover {
      color: var(--primary-color);
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
    }
    .copy-btn.copied {
      opacity: 1;
      color: #43a047;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .action-btn {
      padding: 4px 12px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
    }
    .edit-btn {
      background: var(--primary-color);
      color: white;
    }
    .delete-btn {
      background: var(--error-color, #db4437);
      color: white;
    }
    .empty-state {
      text-align: center;
      padding: 60px 0;
      color: var(--secondary-text-color);
    }
    .empty-state .icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    .empty-state p {
      font-size: 16px;
      margin: 0 0 16px;
    }
    .confirm-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }
    .confirm-card {
      background: var(--card-background-color);
      border-radius: 8px;
      padding: 24px;
      max-width: 380px;
      width: 90%;
    }
    .confirm-card h3 { margin: 0 0 14px; font-size: 17px; }
    .confirm-details {
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 14px;
    }
    .confirm-detail-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      padding: 4px 0;
      font-size: 13px;
      border-bottom: 1px solid var(--divider-color);
    }
    .confirm-detail-row:last-child { border-bottom: none; }
    .confirm-detail-label {
      min-width: 54px;
      font-weight: 700;
      color: var(--secondary-text-color);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      flex-shrink: 0;
    }
    .confirm-url {
      word-break: break-all;
      color: var(--primary-text-color);
      font-size: 12px;
      font-family: monospace;
    }
    .confirm-warning {
      font-size: 13px;
      color: var(--secondary-text-color);
      margin: 0 0 18px;
    }
    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .confirm-cancel {
      padding: 8px 16px;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      cursor: pointer;
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .confirm-delete {
      padding: 8px 20px;
      background: var(--error-color, #db4437);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
    }
    .confirm-delete:disabled { opacity: 0.6; cursor: not-allowed; }

    /* ── Import conflict dialog ── */
    .conflict-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 110;
    }
    .conflict-card {
      background: var(--card-background-color);
      border-radius: 10px;
      padding: 24px;
      max-width: 480px;
      width: 94%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    }
    .conflict-card h3 { margin: 0 0 6px; font-size: 17px; }
    .conflict-subtitle {
      font-size: 13px;
      color: var(--secondary-text-color);
      margin: 0 0 16px;
    }
    .conflict-new-notice {
      font-size: 13px;
      color: #43a047;
      background: rgba(67,160,71,0.1);
      border: 1px solid rgba(67,160,71,0.3);
      border-radius: 6px;
      padding: 7px 12px;
      margin-bottom: 14px;
    }
    .conflict-list {
      overflow-y: auto;
      flex: 1;
      margin-bottom: 16px;
    }
    .conflict-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color);
      gap: 10px;
    }
    .conflict-item:last-child { border-bottom: none; }
    .conflict-item-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }
    .conflict-item-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .conflict-item-meta {
      font-size: 12px;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .conflict-toggle {
      display: flex;
      border: 1px solid var(--divider-color);
      border-radius: 5px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .conflict-toggle button {
      padding: 5px 12px;
      border: none;
      background: none;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      color: var(--secondary-text-color);
      transition: background 0.15s, color 0.15s;
    }
    .conflict-toggle button.active-update {
      background: var(--primary-color);
      color: white;
    }
    .conflict-toggle button.active-skip {
      background: var(--secondary-background-color, #e0e0e0);
      color: var(--primary-text-color);
    }
    .conflict-bulk {
      display: flex;
      gap: 8px;
      margin-bottom: 14px;
    }
    .conflict-bulk button {
      padding: 4px 12px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: none;
      font-size: 12px;
      cursor: pointer;
      color: var(--secondary-text-color);
    }
    .conflict-bulk button:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .conflict-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 4px;
    }
    .conflict-cancel {
      padding: 8px 16px;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      color: var(--primary-text-color);
    }
    .conflict-confirm {
      padding: 8px 20px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    .conflict-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── Mobile: convert table rows into stacked cards ── */
    @media (max-width: 640px) {
      :host {
        padding: 16px 12px;
      }
      thead {
        display: none;
      }
      table {
        background: transparent;
        box-shadow: none;
      }
      tbody tr {
        display: block;
        background: var(--card-background-color);
        border-radius: 8px;
        margin-bottom: 12px;
        box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,.1));
        overflow: hidden;
      }
      td {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 14px;
        border-bottom: 1px solid var(--divider-color);
        max-width: 100%;
        white-space: normal;
        overflow: visible;
        text-overflow: initial;
      }
      td:last-child {
        border-bottom: none;
      }
      td::before {
        content: attr(data-label);
        min-width: 58px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--secondary-text-color);
        padding-top: 2px;
        flex-shrink: 0;
      }
      td.url-cell {
        max-width: 100%;
        word-break: break-all;
        white-space: normal;
      }
      td.actions-cell {
        background: var(--secondary-background-color, #f9f9f9);
        justify-content: flex-end;
      }
      td.actions-cell::before {
        display: none;
      }
      .action-btn {
        padding: 8px 20px;
        font-size: 13px;
      }
      .copy-btn {
        opacity: 1;
      }
    }
  `;

  private _slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "request";
  }

  private async _copy(req: HassRequest) {
    const svcName = `hass_requester.${this._slugify(req.name)}`;
    await navigator.clipboard.writeText(svcName);
    this._copiedId = req.id;
    setTimeout(() => { this._copiedId = null; }, 2000);
  }

  private _edit(request: HassRequest) {
    this.dispatchEvent(
      new CustomEvent<HassRequest>("edit", {
        detail: request,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _isIdentical(incoming: Record<string, unknown>, existing: HassRequest): boolean {
    const fields: Array<keyof HassRequest> = [
      "name", "method", "url", "query_params", "headers", "body_type", "body", "slots",
    ];
    for (const field of fields) {
      if (JSON.stringify(incoming[field] ?? null) !== JSON.stringify(existing[field] ?? null)) {
        return false;
      }
    }
    return true;
  }

  private _exportAll() {
    const data = JSON.stringify({ requests: this.requests }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hass-requester-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private _triggerImport() {
    const input = this.shadowRoot?.querySelector<HTMLInputElement>("#import-file-input");
    input?.click();
  }

  private async _onImportFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    input.value = "";
    this._importError = "";
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const requests: Array<Record<string, unknown>> = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.requests)
        ? parsed.requests
        : null;
      if (!requests) throw new Error("Invalid backup file format.");

      const newRequests: Array<Record<string, unknown>> = [];
      const conflicts: Array<{ incoming: Record<string, unknown>; existing: HassRequest }> = [];

      for (const req of requests) {
        const incomingName = String(req.name ?? "").toLowerCase();
        const existing = this.requests.find(
          (r) => r.name.toLowerCase() === incomingName
        );
        if (existing) {
          // Identical content — silently skip, no need to ask
          if (!this._isIdentical(req, existing)) {
            conflicts.push({ incoming: req, existing });
          }
        } else {
          newRequests.push(req);
        }
      }

      if (conflicts.length === 0) {
        // No real conflicts — import new requests directly
        this._importing = true;
        for (const req of newRequests) {
          const { id: _id, ...payload } = req;
          await this.hass.callWS({ type: "hass_requester/create", ...payload });
        }
        this.dispatchEvent(new CustomEvent("imported", { bubbles: true, composed: true }));
      } else {
        // Store state and show conflict dialog for changed requests only
        this._pendingImportNew = newRequests;
        this._importConflicts = conflicts;
        // Default choice: update all
        const choices: Record<string, "update" | "skip"> = {};
        for (const c of conflicts) {
          choices[c.existing.id] = "update";
        }
        this._conflictChoices = choices;
      }
    } catch (err: unknown) {
      this._importError =
        err instanceof Error ? err.message : "Failed to import backup file.";
    } finally {
      this._importing = false;
    }
  }

  private async _confirmImport() {
    this._importing = true;
    this._importError = "";
    try {
      // Create new (no-conflict) requests
      for (const req of this._pendingImportNew) {
        const { id: _id, ...payload } = req;
        await this.hass.callWS({ type: "hass_requester/create", ...payload });
      }
      // Handle conflicts based on user choices
      for (const { incoming, existing } of this._importConflicts) {
        const choice = this._conflictChoices[existing.id] ?? "skip";
        if (choice === "update") {
          const { id: _id, ...payload } = incoming;
          await this.hass.callWS({
            type: "hass_requester/update",
            request_id: existing.id,
            ...payload,
          });
        }
        // skip: do nothing
      }
      this._importConflicts = [];
      this._pendingImportNew = [];
      this._conflictChoices = {};
      this.dispatchEvent(new CustomEvent("imported", { bubbles: true, composed: true }));
    } catch (err: unknown) {
      this._importError =
        err instanceof Error ? err.message : "Failed to import backup file.";
    } finally {
      this._importing = false;
    }
  }

  private _cancelImportConflict() {
    this._importConflicts = [];
    this._pendingImportNew = [];
    this._conflictChoices = {};
    this._importError = "";
  }

  private async _deleteConfirmed() {
    if (!this._confirmDeleteId) return;
    this._deleting = true;
    try {
      await this.hass.callWS({
        type: "hass_requester/delete",
        request_id: this._confirmDeleteId,
      });
      this.dispatchEvent(
        new CustomEvent("deleted", { bubbles: true, composed: true })
      );
    } finally {
      this._deleting = false;
      this._confirmDeleteId = null;
    }
  }

  render() {
    return html`
      <input
        id="import-file-input"
        type="file"
        accept=".json,application/json"
        style="display:none"
        @change=${this._onImportFile}
      />

      <div class="header">
        <div class="header-title">
          <img src="/api/hass_requester/frontend/logo.png" alt="HASS Requester" />
          <h2>HASS Requester</h2>
        </div>
        <div class="header-right">
          <button
            class="import-btn"
            ?disabled=${this._importing}
            title="Import requests from a backup JSON file"
            @click=${this._triggerImport}
          >
            ↓ ${this._importing ? "Importing..." : "Import"}
          </button>
          <button
            class="export-btn"
            ?disabled=${this.requests.length === 0}
            title="Export all requests as a backup JSON file"
            @click=${this._exportAll}
          >
            ↑ Export
          </button>
          <button
            class="new-btn"
            @click=${() =>
              this.dispatchEvent(
                new CustomEvent("new", { bubbles: true, composed: true })
              )}
          >
            + New Request
          </button>
        </div>
      </div>

      ${this._importError
        ? html`<div class="import-error">${this._importError}</div>`
        : html``}

      ${this.requests.length === 0
        ? html`
            <div class="empty-state">
              <div class="icon">🌐</div>
              <p>No requests saved yet.</p>
              <button class="new-btn" @click=${() =>
                this.dispatchEvent(new CustomEvent("new", { bubbles: true, composed: true }))}>
                Create your first request
              </button>
            </div>
          `
        : html`
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Method</th>
                  <th>URL</th>
                  <th>Slots</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.requests.map(
                  (req) => html`
                    <tr>
                      <td data-label="Name">
                        <div class="name-cell">
                          <strong>${req.name}</strong>
                          <button
                            class="copy-btn ${this._copiedId === req.id ? "copied" : ""}"
                            title="Copy: hass_requester.${this._slugify(req.name)}"
                            @click=${(e: Event) => { e.stopPropagation(); this._copy(req); }}
                          >
                            ${this._copiedId === req.id
                              ? html`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
                              : html`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`}
                          </button>
                        </div>
                      </td>
                      <td data-label="Method">
                        <span class="method-badge method-${req.method}">
                          ${req.method}
                        </span>
                      </td>
                      <td class="url-cell" data-label="URL">
                        ${req.url}
                      </td>
                      <td data-label="Slots">
                        <div class="slots-cell">
                          ${req.slots.length === 0
                            ? html`<span style="color:var(--secondary-text-color);font-size:12px;">none</span>`
                            : req.slots.map(
                                (s) => html`<span class="slot-chip">{{ ${s.name} }}</span>`
                              )}
                        </div>
                      </td>
                      <td class="actions-cell">
                        <div class="actions">
                          <button
                            class="action-btn edit-btn"
                            @click=${() => this._edit(req)}
                          >
                            Edit
                          </button>
                          <button
                            class="action-btn delete-btn"
                            @click=${() => (this._confirmDeleteId = req.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          `}

      ${this._confirmDeleteId
        ? (() => {
            const req = this.requests.find((r) => r.id === this._confirmDeleteId);
            return html`
              <div class="confirm-overlay">
                <div class="confirm-card">
                  <h3>🗑️ Delete Request?</h3>
                  ${req
                    ? html`
                        <div class="confirm-details">
                          <div class="confirm-detail-row">
                            <span class="confirm-detail-label">Name</span>
                            <strong>${req.name}</strong>
                          </div>
                          <div class="confirm-detail-row">
                            <span class="confirm-detail-label">Method</span>
                            <span class="method-badge method-${req.method}">${req.method}</span>
                          </div>
                          <div class="confirm-detail-row">
                            <span class="confirm-detail-label">URL</span>
                            <span class="confirm-url">${req.url}</span>
                          </div>
                          ${req.slots.length > 0
                            ? html`
                                <div class="confirm-detail-row">
                                  <span class="confirm-detail-label">Slots</span>
                                  <span>${req.slots.length} dynamic slot${req.slots.length !== 1 ? "s" : ""}</span>
                                </div>
                              `
                            : html``}
                        </div>
                        <p class="confirm-warning">
                          ⚠️ This action <strong>cannot be undone</strong>. The request and all its configuration will be permanently removed.
                        </p>
                      `
                    : html`<p>This action cannot be undone.</p>`}
                  <div class="confirm-actions">
                    <button
                      class="confirm-cancel"
                      @click=${() => (this._confirmDeleteId = null)}
                    >
                      Cancel
                    </button>
                    <button
                      class="confirm-delete"
                      ?disabled=${this._deleting}
                      @click=${this._deleteConfirmed}
                    >
                      ${this._deleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                  </div>
                </div>
              </div>
            `;
          })()
        : html``}

      ${this._importConflicts.length > 0
        ? html`
            <div class="conflict-overlay">
              <div class="conflict-card">
                <h3>⚠️ Conflicts Found</h3>
                <p class="conflict-subtitle">
                  ${this._importConflicts.length} request${this._importConflicts.length !== 1 ? "s" : ""}
                  already exist${this._importConflicts.length === 1 ? "s" : ""} with the same name.
                  Choose what to do for each one.
                </p>

                ${this._pendingImportNew.length > 0
                  ? html`
                      <div class="conflict-new-notice">
                        ✓ ${this._pendingImportNew.length} new request${this._pendingImportNew.length !== 1 ? "s" : ""}
                        will be created automatically.
                      </div>
                    `
                  : html``}

                <div class="conflict-bulk">
                  <button @click=${() => {
                    const all: Record<string, "update" | "skip"> = {};
                    this._importConflicts.forEach(c => { all[c.existing.id] = "update"; });
                    this._conflictChoices = all;
                  }}>Update All</button>
                  <button @click=${() => {
                    const all: Record<string, "update" | "skip"> = {};
                    this._importConflicts.forEach(c => { all[c.existing.id] = "skip"; });
                    this._conflictChoices = all;
                  }}>Skip All</button>
                </div>

                <div class="conflict-list">
                  ${this._importConflicts.map(({ existing }) => html`
                    <div class="conflict-item">
                      <div class="conflict-item-info">
                        <span class="conflict-item-name">${existing.name}</span>
                        <span class="conflict-item-meta">
                          <span class="method-badge method-${existing.method}">${existing.method}</span>
                          &nbsp;${existing.url}
                        </span>
                      </div>
                      <div class="conflict-toggle">
                        <button
                          class=${this._conflictChoices[existing.id] === "update" ? "active-update" : ""}
                          @click=${() => {
                            this._conflictChoices = { ...this._conflictChoices, [existing.id]: "update" };
                          }}
                        >Update</button>
                        <button
                          class=${this._conflictChoices[existing.id] === "skip" ? "active-skip" : ""}
                          @click=${() => {
                            this._conflictChoices = { ...this._conflictChoices, [existing.id]: "skip" };
                          }}
                        >Skip</button>
                      </div>
                    </div>
                  `)}
                </div>

                <div class="conflict-actions">
                  <button class="conflict-cancel" @click=${this._cancelImportConflict}>
                    Cancel
                  </button>
                  <button
                    class="conflict-confirm"
                    ?disabled=${this._importing}
                    @click=${this._confirmImport}
                  >
                    ${this._importing ? "Importing..." : "Confirm Import"}
                  </button>
                </div>
              </div>
            </div>
          `
        : html``}
    `;
  }
}
