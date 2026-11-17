import { html, nothing } from "lit";
import { BolleElement, moveFocus } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { bottomAppBarStyles } from "./bottom-app-bar.styles.js";

/**
 * Container at the bottom edge of an application: a set of actions, an optional
 * label and a place for the primary action of the screen. Slots: `leading`,
 * default (actions), `fab`, `trailing`.
 */
export class BolleBottomAppBar extends BolleElement {
  static properties = {
    label: {},
    variant: { reflect: true },
    align: { reflect: true },
    divider: { type: Boolean, reflect: true },
    sticky: { type: Boolean, reflect: true },
    dock: { type: Boolean, reflect: true },
  };
  static styles = [commonStyles, bottomAppBarStyles];

  /** Accessible name of the toolbar. */
  label = "";
  /** `standard` sits on the edge; `floating` detaches the surface with an inset. */
  variant: "standard" | "floating" = "standard";
  align: "start" | "center" = "start";
  /** Line along the top edge, which separates the bar from the content. */
  divider = true;
  sticky = false;
  /** The FAB in `fab` hangs over the top edge instead of sitting inside the bar. */
  dock = false;

  private controls() {
    return Array.from(
      this.querySelectorAll<HTMLElement>(
        "button,a,bolle-button,bolle-icon-button,bolle-floating-action-button",
      ),
    )
      .map((host) => host.shadowRoot?.querySelector<HTMLElement>(".button") ?? host)
      .filter((control) => !(control as HTMLButtonElement).disabled);
  }

  protected render() {
    return html`<div
      class="bar"
      role="toolbar"
      aria-label=${this.label || nothing}
      @keydown=${(event: KeyboardEvent) => moveFocus(event, this.controls())}
    >
      <div class="leading"><slot name="leading"></slot></div>
      <div class="actions">
        <slot
          @slotchange=${() => {
            Promise.all(
              Array.from(this.children).map(
                (child) => (child as BolleElement).updateComplete,
              ),
            ).then(() =>
              this.controls().forEach(
                (control, index) => (control.tabIndex = index === 0 ? 0 : -1),
              ),
            );
          }}
        ></slot>
      </div>
      <div class="trailing"><slot name="trailing"></slot></div>
      <div class="fab"><slot name="fab"></slot></div>
    </div>`;
  }
}
