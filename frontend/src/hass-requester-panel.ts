import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassRequest, HomeAssistant } from "./types";
import "./views/request-list";
import "./views/request-editor";

type View = "list" | "edit";

@customElement("hass-requester-panel")
export class HassRequesterPanel extends LitElement {
  // Injected by Home Assistant
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;

  @state() private _view: View = "list";
  @state() private _requests: HassRequest[] = [];
  @state() private _editingRequest: HassRequest | null = null;
  @state() private _loading = true;
  @state() private _error = "";

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--primary-background-color);
    }
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      color: var(--secondary-text-color);
      font-size: 16px;
    }
    .error-banner {
      background: var(--error-color, #db4437);
      color: white;
      padding: 12px 16px;
      font-size: 14px;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this._loadRequests();
  }

  private async _loadRequests() {
    this._loading = true;
    this._error = "";
    try {
      const result = await this.hass.callWS<{ requests: HassRequest[] }>({
        type: "hass_requester/list",
      });
      this._requests = result.requests;
    } catch (e: unknown) {
      this._error =
        e instanceof Error ? e.message : "Failed to load requests";
    } finally {
      this._loading = false;
    }
  }

  private _onNew() {
    this._editingRequest = null;
    this._view = "edit";
  }

  private _onEdit(e: CustomEvent<HassRequest>) {
    this._editingRequest = e.detail;
    this._view = "edit";
  }

  private async _onSaved() {
    this._view = "list";
    await this._loadRequests();
  }

  private async _onDeleted() {
    await this._loadRequests();
  }

  private async _onImported() {
    await this._loadRequests();
  }

  private _onCancelled() {
    this._view = "list";
    this._editingRequest = null;
  }

  render() {
    if (this._loading) {
      return html`<div class="loading">Loading requests...</div>`;
    }

    return html`
      ${this._error
        ? html`<div class="error-banner">${this._error}</div>`
        : html``}
      ${this._view === "list"
        ? html`
            <hass-requester-list
              .hass=${this.hass}
              .requests=${this._requests}
              @new=${this._onNew}
              @edit=${this._onEdit}
              @deleted=${this._onDeleted}
              @imported=${this._onImported}
            ></hass-requester-list>
          `
        : html`
            <hass-requester-editor
              .hass=${this.hass}
              .request=${this._editingRequest}
              @saved=${this._onSaved}
              @cancelled=${this._onCancelled}
            ></hass-requester-editor>
          `}
    `;
  }
}
