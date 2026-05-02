import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HomeAssistant, NewHassRequest } from "../types";

@customElement("hass-requester-curl-importer")
export class CurlImporter extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _open = false;
  @state() private _curl = "";
  @state() private _loading = false;
  @state() private _error = "";

  static styles = css`
    :host {
      display: block;
    }
    .import-btn {
      padding: 7px 12px;
      background: none;
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      white-space: nowrap;
    }
    .import-btn:hover {
      background: rgba(var(--rgb-primary-color, 3,169,244), 0.08);
    }
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
    }
    .dialog {
      background: var(--card-background-color);
      border-radius: 10px;
      padding: 28px;
      width: 90%;
      max-width: 640px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .dialog h3 {
      margin: 0 0 6px;
      font-size: 18px;
      color: var(--primary-text-color);
    }
    .dialog p {
      margin: 0 0 16px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    textarea {
      width: 100%;
      min-height: 120px;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--secondary-background-color, #1e1e1e);
      color: var(--primary-text-color);
      font-family: "Consolas", "Monaco", monospace;
      font-size: 13px;
      resize: vertical;
      box-sizing: border-box;
      outline: none;
    }
    textarea:focus {
      border-color: var(--primary-color);
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 16px;
    }
    .btn-cancel {
      padding: 8px 18px;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      cursor: pointer;
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .btn-parse {
      padding: 8px 20px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    .btn-parse:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .error {
      color: var(--error-color, #db4437);
      font-size: 13px;
      margin-top: 10px;
    }
  `;

  private async _parse() {
    if (!this._curl.trim()) return;
    this._loading = true;
    this._error = "";
    try {
      const parsed = await this.hass.callWS<Omit<NewHassRequest, "name">>({
        type: "hass_requester/parse_curl",
        curl: this._curl,
      });
      this.dispatchEvent(
        new CustomEvent<Omit<NewHassRequest, "name">>("curl-parsed", {
          detail: parsed,
          bubbles: true,
          composed: true,
        })
      );
      this._curl = "";
      this._open = false;
    } catch (e: unknown) {
      this._error =
        e instanceof Error
          ? e.message
          : (e as { message?: string })?.message ?? "Failed to parse CURL";
    } finally {
      this._loading = false;
    }
  }

  render() {
    return html`
      <button class="import-btn" @click=${() => (this._open = true)}>
        ⬇ cURL
      </button>

      ${this._open
        ? html`
            <div class="overlay" @click=${(e: MouseEvent) => {
              if (e.target === e.currentTarget) this._open = false;
            }}>
              <div class="dialog">
                <h3>Import from CURL</h3>
                <p>Paste your curl command below. All fields will be auto-filled.</p>
                <textarea
                  .value=${this._curl}
                  placeholder='curl -X POST "https://api.example.com/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d '"'"'"{"msg": "hello"}'"'"'"'
                  @input=${(e: InputEvent) =>
                    (this._curl = (e.target as HTMLTextAreaElement).value)}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === "Escape") this._open = false;
                  }}
                ></textarea>
                ${this._error
                  ? html`<p class="error">${this._error}</p>`
                  : html``}
                <div class="actions">
                  <button
                    class="btn-cancel"
                    @click=${() => {
                      this._open = false;
                      this._error = "";
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    class="btn-parse"
                    ?disabled=${this._loading || !this._curl.trim()}
                    @click=${this._parse}
                  >
                    ${this._loading ? "Parsing..." : "Import"}
                  </button>
                </div>
              </div>
            </div>
          `
        : html``}
    `;
  }
}
