import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassRequest, HomeAssistant } from "../types";

@customElement("hass-requester-list")
export class RequestList extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) requests: HassRequest[] = [];
  @state() private _confirmDeleteId: string | null = null;
  @state() private _deleting = false;

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
    .confirm-card h3 { margin: 0 0 12px; }
    .confirm-card p { color: var(--secondary-text-color); margin: 0 0 20px; }
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
    }
    .confirm-delete {
      padding: 8px 16px;
      background: var(--error-color, #db4437);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }
  `;

  private _edit(request: HassRequest) {
    this.dispatchEvent(
      new CustomEvent<HassRequest>("edit", {
        detail: request,
        bubbles: true,
        composed: true,
      })
    );
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
      <div class="header">
        <div class="header-title">
          <img src="/api/hass_requester/frontend/logo.png" alt="HASS Requester" />
          <h2>HASS Requester</h2>
        </div>
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
                      <td><strong>${req.name}</strong></td>
                      <td>
                        <span class="method-badge method-${req.method}">
                          ${req.method}
                        </span>
                      </td>
                      <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                        ${req.url}
                      </td>
                      <td>
                        <div class="slots-cell">
                          ${req.slots.length === 0
                            ? html`<span style="color:var(--secondary-text-color);font-size:12px;">none</span>`
                            : req.slots.map(
                                (s) => html`<span class="slot-chip">{{ ${s.name} }}</span>`
                              )}
                        </div>
                      </td>
                      <td>
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
        ? html`
            <div class="confirm-overlay">
              <div class="confirm-card">
                <h3>Delete Request?</h3>
                <p>
                  This will permanently delete
                  <strong>
                    ${this.requests.find((r) => r.id === this._confirmDeleteId)?.name}
                  </strong>.
                  This action cannot be undone.
                </p>
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
                    ${this._deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          `
        : html``}
    `;
  }
}
