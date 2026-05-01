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
    this._importing = true;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const requests: Array<Record<string, unknown>> = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.requests)
        ? parsed.requests
        : null;
      if (!requests) throw new Error("Invalid backup file format.");
      let imported = 0;
      for (const req of requests) {
        // Strip ID so backend generates a new one
        const { id: _id, ...payload } = req as Record<string, unknown>;
        await this.hass.callWS({ type: "hass_requester/create", ...payload });
        imported++;
      }
      this.dispatchEvent(new CustomEvent("imported", { bubbles: true, composed: true }));
    } catch (err: unknown) {
      this._importError =
        err instanceof Error ? err.message : "Failed to import backup file.";
    } finally {
      this._importing = false;
    }
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
            ↑ ${this._importing ? "Importing..." : "Import"}
          </button>
          <button
            class="export-btn"
            ?disabled=${this.requests.length === 0}
            title="Export all requests as a backup JSON file"
            @click=${this._exportAll}
          >
            ↓ Export
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
    `;
  }
}
