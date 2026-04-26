import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import type { Slot, SlotType } from "../types";

@customElement("hass-requester-slot-editor")
export class SlotEditor extends LitElement {
  @property({ attribute: false }) slots: Slot[] = [];

  static styles = css`
    :host {
      display: block;
    }
    .slot-row {
      display: grid;
      grid-template-columns: 1fr 120px 80px 1fr auto;
      gap: 8px;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .slot-row:last-child {
      border-bottom: none;
    }
    label {
      font-size: 12px;
      color: var(--secondary-text-color);
      display: block;
      margin-bottom: 2px;
    }
    input,
    select {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      box-sizing: border-box;
    }
    .options-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 6px;
    }
    .chip {
      background: var(--primary-color);
      color: white;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: default;
    }
    .chip button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
      font-size: 12px;
      line-height: 1;
    }
    .add-option {
      display: flex;
      gap: 4px;
      margin-top: 4px;
    }
    .add-option input {
      flex: 1;
    }
    .add-option button {
      padding: 4px 10px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    }
    .delete-btn {
      background: none;
      border: none;
      color: var(--error-color, #db4437);
      cursor: pointer;
      font-size: 18px;
      padding: 0 4px;
      align-self: center;
    }
    .empty {
      color: var(--secondary-text-color);
      font-style: italic;
      font-size: 13px;
      padding: 8px 0;
    }
    .add-slot-btn {
      margin-top: 8px;
      padding: 6px 16px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    }
  `;

  private _emit() {
    this.dispatchEvent(
      new CustomEvent("slots-changed", {
        detail: { slots: [...this.slots] },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _updateSlot(index: number, partial: Partial<Slot>) {
    const updated = [...this.slots];
    updated[index] = { ...updated[index], ...partial };
    this.slots = updated;
    this._emit();
  }

  private _deleteSlot(index: number) {
    const updated = [...this.slots];
    updated.splice(index, 1);
    this.slots = updated;
    this._emit();
  }

  private _addSlot() {
    this.slots = [
      ...this.slots,
      { _id: crypto.randomUUID(), name: "", type: "text", required: true, default: null },
    ];
    this._emit();
  }

  private _addOption(index: number, input: HTMLInputElement) {
    const value = input.value.trim();
    if (!value) return;
    const slot = this.slots[index];
    const options = [...(slot.options ?? []), value];
    this._updateSlot(index, { options });
    input.value = "";
  }

  private _removeOption(slotIndex: number, optionIndex: number) {
    const slot = this.slots[slotIndex];
    const options = [...(slot.options ?? [])];
    options.splice(optionIndex, 1);
    this._updateSlot(slotIndex, { options });
  }

  render() {
    return html`
      ${this.slots.length === 0
        ? html`<p class="empty">No slots defined. Click "Add Slot" or use the → Slot button in params/headers.</p>`
        : repeat(
            this.slots,
            (s, i) => s._id ?? i,
            (slot, i) => html`
              <div class="slot-row">
                <div>
                  <label>Name</label>
                  <input
                    .value=${slot.name}
                    placeholder="slot_name"
                    @input=${(e: InputEvent) =>
                      this._updateSlot(i, {
                        name: (e.target as HTMLInputElement).value,
                      })}
                  />
                </div>
                <div>
                  <label>Type</label>
                  <select
                    .value=${slot.type}
                    @change=${(e: Event) =>
                      this._updateSlot(i, {
                        type: (e.target as HTMLSelectElement).value as SlotType,
                      })}
                  >
                    <option value="text">text</option>
                    <option value="select">select</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                  </select>
                </div>
                <div>
                  <label>Required</label>
                  <input
                    type="checkbox"
                    .checked=${slot.required}
                    @change=${(e: Event) =>
                      this._updateSlot(i, {
                        required: (e.target as HTMLInputElement).checked,
                      })}
                  />
                </div>
                <div>
                  ${slot.required
                    ? html``
                    : html`
                        <label>Default</label>
                        <input
                          .value=${slot.default != null ? String(slot.default) : ""}
                          placeholder="default value"
                          @input=${(e: InputEvent) =>
                            this._updateSlot(i, {
                              default: (e.target as HTMLInputElement).value || null,
                            })}
                        />
                      `}
                  ${slot.type === "select"
                    ? html`
                        <div class="options-list">
                          ${(slot.options ?? []).map(
                            (opt, oi) => html`
                              <span class="chip">
                                ${opt}
                                <button @click=${() => this._removeOption(i, oi)}>×</button>
                              </span>
                            `
                          )}
                        </div>
                        <div class="add-option">
                          <input
                            id="opt-input-${i}"
                            placeholder="Add option"
                            @keydown=${(e: KeyboardEvent) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                this._addOption(
                                  i,
                                  this.shadowRoot!.querySelector(
                                    `#opt-input-${i}`
                                  ) as HTMLInputElement
                                );
                              }
                            }}
                          />
                          <button
                            @click=${() =>
                              this._addOption(
                                i,
                                this.shadowRoot!.querySelector(
                                  `#opt-input-${i}`
                                ) as HTMLInputElement
                              )}
                          >
                            Add
                          </button>
                        </div>
                      `
                    : html``}
                </div>
                <button class="delete-btn" @click=${() => this._deleteSlot(i)}>
                  ×
                </button>
              </div>
            `
          )}
      <button class="add-slot-btn" @click=${this._addSlot}>+ Add Slot</button>
    `;
  }
}
