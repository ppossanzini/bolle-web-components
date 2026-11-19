import { html, nothing, type PropertyValues } from "lit";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { appShellStyles } from "./app-shell.styles.js";
import { shellLabels, type ShellLabels } from "./localization.js";
import { closeIcon } from "./icons.js";

export type AppShellForm = "compact" | "medium" | "expanded";

export interface AppShellFormDetail {
  form: AppShellForm;
}

/** Narrower than this the navigation moves below the content, wider it needs no rail. */
export const APP_SHELL_MEDIUM = 840;
export const APP_SHELL_EXPANDED = 1240;

/**
 * Regions of an application: bar, navigation, content, supporting pane and status.
 * The application fills the slots; the shell decides the form from its own width
 * and moves the navigation where the form needs it.
 */
export class BolleAppShell extends BolleElement {
  static properties = {
    label: {},
    form: { reflect: true },
    supportingOpen: {
      type: Boolean,
      attribute: "supporting-open",
      reflect: true,
    },
    supportingLabel: { attribute: "supporting-label" },
    closeLabel: { attribute: "close-label" },
    labels: { attribute: false },
    _form: { state: true },
    _hasBar: { state: true },
    _hasNavigation: { state: true },
    _hasBottom: { state: true },
    _hasSupporting: { state: true },
    _hasStatus: { state: true },
  };
  static styles = [commonStyles, appShellStyles];

  label = "";
  /** `auto` measures the element; the other values force a form. */
  form: "auto" | AppShellForm = "auto";
  supportingOpen = false;
  supportingLabel = "";
  closeLabel = "";
  labels: Partial<ShellLabels> = {};
  private _form: AppShellForm = "expanded";
  private _hasBar = false;
  private _hasNavigation = false;
  private _hasBottom = false;
  private _hasSupporting = false;
  private _hasStatus = false;
  private observer?: ResizeObserver;

  private get text(): ShellLabels {
    return shellLabels(document.documentElement.lang, this.labels);
  }

  connectedCallback() {
    super.connectedCallback();
    this.observer = new ResizeObserver(() => this.measure());
    this.observer.observe(this);
    this.measure();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }

  protected updated(changed: PropertyValues<this>) {
    if (changed.has("form")) this.measure();
    if (!changed.has("supportingOpen") && this.isConnected) this.readSlots();
    if (changed.has("supportingOpen"))
      this.renderRoot.querySelector<HTMLElement>("[data-shell-pane]")?.focus();
  }

  private readSlots() {
    this._hasBar = Boolean(this.querySelector('[slot="bar"]'));
    this._hasNavigation = Boolean(this.querySelector('[slot="navigation"]'));
    this._hasBottom = Boolean(this.querySelector('[slot="bottom-bar"]'));
    this._hasSupporting = Boolean(this.querySelector('[slot="supporting"]'));
    this._hasStatus = Boolean(this.querySelector('[slot="status"]'));
  }

  private measure() {
    if (!this.isConnected) return;
    this.readSlots();
    const width = this.clientWidth || window.innerWidth;
    const form: AppShellForm =
      width < APP_SHELL_MEDIUM
        ? "compact"
        : width < APP_SHELL_EXPANDED
          ? "medium"
          : "expanded";
    const next = this.form === "auto" ? form : this.form;
    if (next === this._form && this.getAttribute("data-form") === next) return;
    this._form = next;
    this.setAttribute("data-form", next);
    this.emit<AppShellFormDetail>("form-change", { form: next });
  }

  /** True when the supporting pane is a modal sheet instead of a column. */
  private get supportingModal() {
    return this._form === "compact";
  }

  private renderSupporting() {
    if (!this._hasSupporting) return nothing;
    const label = this.supportingLabel || this.text.supporting;
    if (this.supportingModal)
      return html`<bolle-side-sheet
        id="supporting"
        label=${label}
        close-label=${this.closeLabel || this.text.closeSupporting}
        ?open=${this.supportingOpen}
        @closed=${() => this.emit("supporting-close", {})}
      >
        <slot name="supporting"></slot>
      </bolle-side-sheet>`;
    if (!this.supportingOpen) return nothing;
    return html`<aside
      class="supporting"
      data-shell-pane
      tabindex="-1"
      role="region"
      aria-label=${label}
    >
      <header class="supporting-head">
        <span class="supporting-title">${label}</span>
        <bolle-icon-button
          variant="standard"
          size="xs"
          label=${this.closeLabel || this.text.closeSupporting}
          @click=${() => this.emit("supporting-close", {})}
          >${closeIcon()}</bolle-icon-button
        >
      </header>
      <div class="supporting-body"><slot name="supporting"></slot></div>
    </aside>`;
  }

  protected render() {
    const form = this._form;
    return html`<div
      class="shell"
      data-form=${form}
      role="group"
      aria-label=${this.label || nothing}
    >
      ${
        this._hasBar
          ? html`<div class="bar"><slot name="bar"></slot></div>`
          : nothing
      }
      <div class="body">
        ${
          this._hasNavigation && form !== "compact"
            ? html`<div class="navigation">
                <slot name="navigation"></slot>
              </div>`
            : nothing
        }
        <main class="content" id="app-content"><slot></slot></main>
        ${this.renderSupporting()}
      </div>
      ${
        this._hasStatus
          ? html`<div class="status" role="contentinfo">
              <slot name="status"></slot>
            </div>`
          : nothing
      }
      ${
        this._hasBottom && form === "compact"
          ? html`<div class="bottom"><slot name="bottom-bar"></slot></div>`
          : nothing
      }
    </div>`;
  }
}
