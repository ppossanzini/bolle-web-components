import { html, nothing } from "lit";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { emptyStateStyles } from "./empty-state.styles.js";

/**
 * The surface a container shows when it has nothing to render: an icon, a title,
 * a line of text and the actions that leave the state. Slots: `icon`, `actions`.
 */
export class BolleEmptyState extends BolleElement {
  static properties = {
    icon: { attribute: false },
    title: {},
    text: {},
    tone: { reflect: true },
    align: { reflect: true },
    role: { reflect: true },
  };
  static styles = [commonStyles, emptyStateStyles];

  /** Icon content; the slot `icon` replaces it. */
  icon?: unknown;
  title = "";
  text = "";
  /** `error` paints the icon with the error role and lets the region be announced. */
  tone: "neutral" | "error" = "neutral";
  align: "center" | "start" = "center";
  /**
   * ARIA role of the region. Empty by default; `alert` makes the container announce
   * the state as soon as it appears, which is what an error needs.
   */
  role = "";

  protected render() {
    const icon = this.icon ? html`<slot name="icon">${this.icon}</slot>` : html`<slot name="icon"></slot>`;
    return html`<div
      class="state"
      role=${this.role || nothing}
      aria-live=${this.role === "alert" ? "assertive" : nothing}
    >
      <span class="icon" aria-hidden="true">${icon}</span>
      ${this.title ? html`<h3 class="title">${this.title}</h3>` : nothing}
      ${this.text ? html`<p class="text">${this.text}</p>` : nothing}
      <div class="actions"><slot name="actions"></slot></div>
    </div>`;
  }
}
