import { LitElement, html } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import type { BolleDialog } from "../src/index.js";
import {
  BLACK,
  MATERIAL_FAMILIES,
  WHITE,
  familyOf,
  readableOn,
} from "./palette.js";
import { l } from "./i18n.js";

const baseShade = (name: string) => {
  const family = MATERIAL_FAMILIES.find((item) => item.name === name);
  return (
    family?.shades.find((shade) => shade.name === "500") ??
    family?.shades[family.shades.length - 1]
  );
};

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** "#abc", "abc" or "#AABBCC" to "#AABBCC"; empty when the text is not a hex colour. */
export function normalizeHex(text: string): string {
  const match = HEX.exec(text.trim());
  if (!match) return "";
  const digits =
    match[1].length === 3 ? [...match[1]].map((c) => c + c).join("") : match[1];
  return `#${digits.toUpperCase()}`;
}

/** Colour picker used by the token editor: any custom colour, or a Material palette shade. */
export class DocsColor extends LitElement {
  static properties = {
    label: {},
    value: {},
    family: { state: true },
    draft: { state: true },
    tile: { type: Boolean },
    token: {},
    previous: {},
  };

  declare label: string;
  declare value: string;
  declare family: string;
  declare draft: string;
  /** Render the trigger as a full colour swatch with label, token and value on it. */
  declare tile: boolean;
  declare token: string;
  /** Previous value, shown as a strip inside the tile after a change. */
  declare previous: string;
  private dialog = createRef<BolleDialog>();

  constructor() {
    super();
    this.label = "";
    this.value = "#6750A4";
    this.family = MATERIAL_FAMILIES[0].name;
    this.draft = "";
    this.tile = false;
    this.token = "";
    this.previous = "";
  }

  createRenderRoot() {
    return this;
  }

  private open = () => {
    this.family = familyOf(this.value);
    this.draft = this.value.toUpperCase();
    this.dialog.value?.show();
  };

  private choose = (hex: string) => {
    this.value = hex;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: hex },
        bubbles: true,
        composed: true,
      }),
    );
    this.dialog.value?.close();
  };

  private swatch(hex: string, name: string, selected: boolean) {
    return html`<button
      type="button"
      class=${`shade ${selected ? "is-selected" : ""}`}
      style=${`background:${hex};color:${readableOn(hex)}`}
      title=${`${name} · ${hex}`}
      aria-label=${`${name}, ${hex}`}
      aria-pressed=${String(selected)}
      @click=${() => this.choose(hex)}
    >
      ${name}
    </button>`;
  }

  private renderCustom() {
    const hex = normalizeHex(this.draft);
    return html`<section
      class="custom-color"
      aria-label=${l("Colore personalizzato")}
    >
      <p class="palette-caption">${l("Colore personalizzato")}</p>
      <div class="custom-color-row">
        <label
          class="custom-color-well"
          style=${`background:${hex || this.value}`}
        >
          <input
            type="color"
            aria-label=${l("Scegli un colore qualsiasi")}
            .value=${(hex || this.value).toLowerCase()}
            @input=${(event: Event) =>
              (this.draft = (
                event.target as HTMLInputElement
              ).value.toUpperCase())}
          />
        </label>
        <bolle-text-field
          label=${l("Esadecimale")}
          placeholder="#5B4CF0"
          .value=${this.draft}
          ?error=${this.draft !== "" && !hex}
          supporting-text=${this.draft !== "" && !hex ? l("Usa #RGB o #RRGGBB") : ""}
          @value-input=${(event: Event) =>
            (this.draft = (
              event as CustomEvent<{ value: string }>
            ).detail.value)}
          @keydown=${(event: KeyboardEvent) => {
            if (event.key === "Enter" && hex) this.choose(hex);
          }}
        ></bolle-text-field>
        <bolle-button ?disabled=${!hex} @click=${() => hex && this.choose(hex)}
          >${l("Usa")}</bolle-button
        >
      </div>
    </section>`;
  }

  protected render() {
    const family =
      MATERIAL_FAMILIES.find((item) => item.name === this.family) ??
      MATERIAL_FAMILIES[0];
    const current = this.value.toUpperCase();
    const changed =
      this.previous !== "" &&
      this.previous.toLowerCase() !== this.value.toLowerCase();
    return html`
      ${
        this.tile
          ? html`<button
              type="button"
              class="color-tile ${changed ? "is-changed" : ""}"
              style=${`background:${this.value};color:${readableOn(this.value)}`}
              aria-haspopup="dialog"
              aria-label=${`${this.label}, ${this.token}: ${this.value}${changed ? l(", prima {color}", { color: this.previous }) : ""}`}
              @click=${this.open}
            >
              ${
                changed
                  ? html`<span
                      class="color-tile-before"
                      style=${`background:${this.previous};color:${readableOn(this.previous)}`}
                      title=${l("Prima: {color}", { color: this.previous })}
                      >${l("prima")}</span
                    >`
                  : ""
              }
              <span class="color-tile-name">${this.label}</span>
              <code class="color-tile-token">${this.token}</code>
              <code class="color-tile-value"
                >${
                  changed
                    ? html`<span class="color-tile-old"
                        >${this.previous} →
                      </span>`
                    : ""
                }${this.value}</code
              >
            </button>`
          : html`<button
              type="button"
              class="color-trigger"
              aria-haspopup="dialog"
              aria-label=${`${this.label}: ${this.value}`}
              @click=${this.open}
            >
              <span
                class="color-swatch"
                style=${`background:${this.value}`}
              ></span>
              <span class="color-value">${this.value}</span>
            </button>`
      }

      <bolle-dialog
        modal
        ${ref(this.dialog)}
        class="palette-dialog"
        label=${l("Colore · {name}", { name: this.label })}
        close-label=${l("Chiudi")}
      >
        <div class="palette-content">
          ${this.renderCustom()}
          <div class="palette-head">
            <span class="palette-caption"
              >${l("Colore selezionato · {name}", { name: family.name })}</span
            >
            <span class="palette-current">
              <span
                class="color-swatch"
                style=${`background:${this.value}`}
              ></span>
              <code>${this.value}</code>
            </span>
          </div>

          <p class="palette-caption">${l("Colori di base")}</p>
          <div class="base-grid" role="group" aria-label=${l("Colori di base")}>
            ${MATERIAL_FAMILIES.map((item) => {
              const base = baseShade(item.name);
              if (!base) return null;
              const selected = item.name === family.name;
              return html`<button
                type="button"
                class=${`base-color ${selected ? "is-selected" : ""}`}
                style=${`background:${base.hex};color:${readableOn(base.hex)}`}
                title=${`${item.name} · ${base.hex}`}
                aria-label=${`${item.name}, ${base.hex}`}
                aria-pressed=${String(selected)}
                @click=${() => (this.family = item.name)}
              >
                ${item.name}
              </button>`;
            })}
          </div>

          <p class="palette-caption">
            ${l("Toni {name}", { name: family.name })}
          </p>
          <div
            class="shade-grid"
            role="group"
            aria-label=${l("Toni {name}", { name: family.name })}
          >
            ${family.shades.map((shade) =>
              this.swatch(
                shade.hex,
                `${family.name} ${shade.name}`,
                shade.hex === current,
              ),
            )}
          </div>

          <div class="palette-neutrals">
            ${this.swatch(WHITE, l("Bianco"), WHITE === current)}
            ${this.swatch(BLACK, l("Nero"), BLACK === current)}
          </div>
        </div>
      </bolle-dialog>
    `;
  }
}

if (!customElements.get("docs-color"))
  customElements.define("docs-color", DocsColor);
