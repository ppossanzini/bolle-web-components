import { controlLabels, type ControlLabels } from "./localization.js";
import { html, nothing, type PropertyValues } from "lit";
import {
  BolleElement,
  applyTail,
  moveFocus,
  type BolleItem,
  type SurfaceTail,
} from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { chevronDownIcon, closeIcon } from "./icons.js";
import { overlayStyles } from "./overlays.styles.js";
import type { BolleMenu } from "./menu.js";
import type { MenuEntry } from "./menu.types.js";

export class BolleDialog extends BolleElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    label: {},
    variant: { reflect: true },
    modal: { type: Boolean },
    closeLabel: { attribute: "close-label" },
  };
  static styles = [commonStyles, overlayStyles];
  open = false;
  label = "";
  variant = "basic";
  /** Modal by default only for surfaces that open a blocking task; a plain dialog opens modeless. */
  modal = false;
  closeLabel = "";
  private opener?: HTMLElement;
  get dialog() {
    return this.renderRoot.querySelector("dialog")!;
  }
  async show(opener?: HTMLElement) {
    this.opener = opener ?? (document.activeElement as HTMLElement);
    this.open = true;
    await this.updateComplete;
  }
  close(returnValue = "") {
    if (this.dialog?.open) this.dialog.close(returnValue);
    else if (this.open) this.closed(returnValue);
    this.open = false;
  }
  protected updated(changed: PropertyValues) {
    if (!changed.has("open") && !changed.has("modal")) return;
    if (this.open && !this.dialog.open) {
      this.opener ??= document.activeElement as HTMLElement;
      if (this.modal) {
        this.dialog.showModal();
        void this.focusInside();
      } else this.dialog.show();
    } else if (!this.open && this.dialog.open) this.dialog.close();
  }
  private async focusInside() {
    await this.updateComplete;
    const candidates = this.querySelectorAll<HTMLElement>(
      "[autofocus], bolle-button, bolle-icon-button, button, a, input, textarea, select",
    );
    for (const candidate of candidates) {
      const target =
        candidate.shadowRoot?.querySelector<HTMLElement>(
          "button, a, input, textarea, select",
        ) ?? candidate;
      if (target.matches(":disabled")) continue;
      target.focus();
      return;
    }
    this.dialog.tabIndex = -1;
    this.dialog.focus();
  }
  disconnectedCallback() {
    if (this.dialog?.open) this.dialog.close();
    super.disconnectedCallback();
  }
  private closed(value?: string | Event) {
    this.open = false;
    this.opener?.focus();
    this.opener = undefined;
    this.emit("closed", {
      returnValue:
        typeof value === "string" ? value : (this.dialog?.returnValue ?? ""),
    });
  }
  protected renderContent() {
    return html`<header part="heading">
        <slot name="heading">${this.label}</slot>
      </header>
      <div part="content"><slot></slot></div>
      <footer part="actions">
        ${this.closeLabel ? html`<bolle-button part="close" variant="text" @click=${() => this.close()}>${this.closeLabel}</bolle-button>` : nothing}<slot
          name="actions"
        ></slot>
      </footer>`;
  }
  private onKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || event.defaultPrevented || !this.open) return;
    if (!this.emit("before-close", { reason: "escape" })) return;
    event.preventDefault();
    this.close();
  };
  protected render() {
    const placement = this.getAttribute("placement");
    return html`<dialog
      part=${placement ? `surface sheet ${placement}-sheet` : "surface dialog"}
      aria-label=${this.label}
      @close=${this.closed}
      @keydown=${this.onKeydown}
      @cancel=${(event: Event) => {
        if (!this.emit("before-close", { reason: "escape" }))
          event.preventDefault();
      }}
    >
      ${this.renderContent()}
    </dialog>`;
  }
}
export class BolleBottomSheet extends BolleDialog {
  static properties = {
    ...BolleDialog.properties,
    dragHandle: { type: Boolean, attribute: "drag-handle" },
  };
  variant = "modal";
  dragHandle = false;
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("placement", "bottom");
  }
  protected renderContent() {
    return html`${this.dragHandle ? html`<div part="drag-handle" class="drag-handle" aria-hidden="true"></div>` : nothing}${super.renderContent()}`;
  }
  protected render() {
    return this.variant === "standard"
      ? html`<section
          part="surface sheet bottom-sheet"
          class="standard"
          aria-label=${this.label}
          ?hidden=${!this.open}
        >
          ${this.renderContent()}
        </section>`
      : super.render();
  }
  protected updated(changed: PropertyValues) {
    if (this.variant !== "standard") super.updated(changed);
  }
}
export class BolleSideSheet extends BolleDialog {
  static properties = {
    ...BolleDialog.properties,
    detached: { type: Boolean, reflect: true },
  };
  variant = "modal";
  modal = true;
  detached = false;
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("placement", "side");
  }
  protected renderContent() {
    return html`<header part="heading" class="sheet-header">
        <span part="label"><slot name="heading">${this.label}</slot></span>
        ${
          this.closeLabel
            ? html`<bolle-icon-button
                part="close dismiss"
                variant="standard"
                size="small"
                label=${this.closeLabel}
                @click=${() => this.close()}
                ><span class="sheet-close-icon" aria-hidden="true"
                  >${closeIcon()}</span
                ></bolle-icon-button
              >`
            : nothing
        }
      </header>
      <div part="content" class="sheet-content"><slot></slot></div>
      <slot part="actions" name="actions"></slot>`;
  }
  protected render() {
    return this.variant === "standard"
      ? html`<aside
          part="surface sheet side-sheet"
          class="standard"
          aria-label=${this.label}
          ?hidden=${!this.open}
        >
          ${this.renderContent()}
        </aside>`
      : super.render();
  }
  protected updated(changed: PropertyValues) {
    if (this.variant !== "standard") super.updated(changed);
  }
}
export class BolleNavigationDrawer extends BolleSideSheet {
  static properties = {
    ...BolleSideSheet.properties,
    items: { attribute: false },
    value: {},
  };
  items: BolleItem[] = [];
  value = "";
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("placement", "start");
  }
  protected renderContent() {
    return html`<header part="heading" class="drawer-header">
        <slot name="heading">${this.label}</slot>
      </header>
      <nav part="navigation" class="drawer-nav" aria-label=${this.label}>
        ${this.items.map((item) => {
          const active = this.value === item.id;
          const select = () => {
            this.value = item.id;
            if (this.variant !== "standard") this.close();
            this.emit("navigate", { id: item.id });
          };
          const content = html`${
              item.icon
                ? html`<span
                    part="icon"
                    class="drawer-icon icon"
                    aria-hidden="true"
                    >${item.icon}</span
                  >`
                : nothing
            }<span part="label" class="drawer-label">${item.label}</span>${
              item.badge
                ? html`<span part="badge" class="drawer-badge"
                    >${item.badge}</span
                  >`
                : nothing
            }`;
          return item.href && !item.disabled
            ? html`<a
                part="item"
                class="drawer-item"
                href=${item.href}
                aria-current=${active ? "page" : nothing}
                @click=${select}
                >${content}</a
              >`
            : html`<button
                part="item"
                class="drawer-item"
                type="button"
                ?disabled=${item.disabled}
                aria-current=${active ? "page" : nothing}
                @click=${select}
              >
                ${content}
              </button>`;
        })}
      </nav>
      <slot></slot>
      <footer part="actions">
        ${this.closeLabel ? html`<bolle-button part="close" variant="text" @click=${() => this.close()}>${this.closeLabel}</bolle-button>` : nothing}
      </footer>`;
  }
}

export class BolleSnackbar extends BolleElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    message: {},
    actionLabel: { attribute: "action-label" },
    closeLabel: { attribute: "close-label" },
    duration: { type: Number },
    tail: { reflect: true },
    _hasActionSlot: { state: true },
    _hasDismissSlot: { state: true },
  };
  static styles = [commonStyles, overlayStyles];
  open = false;
  message = "";
  actionLabel = "";
  closeLabel = "";
  duration = 5000;
  tail: SurfaceTail = "auto";
  private _hasActionSlot = false;
  private _hasDismissSlot = false;
  private timer?: ReturnType<typeof setTimeout>;
  private exitTimer?: ReturnType<typeof setTimeout>;
  private queue: string[] = [];
  show(message = this.message) {
    if (this.open) {
      this.queue.push(message);
      this.emit("queued", { pending: this.queue.length });
      return;
    }
    this.message = message;
    this.open = true;
    this.restart();
  }
  close(reason = "dismiss") {
    clearTimeout(this.timer);
    this.open = false;
    const next = this.queue.shift();
    if (next !== undefined) {
      this.exitTimer = setTimeout(() => this.show(next), 160);
    }
    this.emit("closed", { reason });
  }
  private restart() {
    clearTimeout(this.timer);
    if (this.open && this.duration > 0)
      this.timer = setTimeout(
        () => this.close("timeout"),
        Math.max(4000, this.duration),
      );
  }
  protected updated(changed: PropertyValues) {
    const surface = this.renderRoot.querySelector<HTMLElement>(".snackbar");
    if (this.open && surface && !surface.matches(":popover-open"))
      surface.showPopover();
    if (changed.has("open") || changed.has("duration")) this.restart();
  }
  disconnectedCallback() {
    clearTimeout(this.timer);
    clearTimeout(this.exitTimer);
    this.queue = [];
    super.disconnectedCallback();
  }
  protected render() {
    return html`<div
      part="host"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      ${
        this.open
          ? html`<div
              class="snackbar"
              part="surface snackbar"
              popover="manual"
              @pointerenter=${() => clearTimeout(this.timer)}
              @pointerleave=${this.restart}
              @focusin=${() => clearTimeout(this.timer)}
              @focusout=${this.restart}
            >
              <span part="message"
                ><slot name="message">${this.message}</slot></span
              ><button
                part="action"
                ?hidden=${!this.actionLabel && !this._hasActionSlot}
                @click=${() => {
                  this.emit("action", {});
                  this.close("action");
                }}
              >
                <slot
                  name="action"
                  @slotchange=${(event: Event) => {
                    this._hasActionSlot =
                      (event.currentTarget as HTMLSlotElement).assignedNodes()
                        .length > 0;
                  }}
                  >${this.actionLabel}</slot
                ></button
              ><button
                part="dismiss"
                ?hidden=${!this.closeLabel && !this._hasDismissSlot}
                @click=${() => this.close()}
              >
                <slot
                  name="dismiss"
                  @slotchange=${(event: Event) => {
                    this._hasDismissSlot =
                      (event.currentTarget as HTMLSlotElement).assignedNodes()
                        .length > 0;
                  }}
                  >${this.closeLabel}</slot
                >
              </button>
            </div>`
          : nothing
      }
    </div>`;
  }
}

export class BolleTooltip extends BolleElement {
  static properties = {
    label: {},
    variant: { reflect: true },
    supportingText: { attribute: "supporting-text" },
    persistent: { type: Boolean, reflect: true },
    tail: { reflect: true },
    labels: { attribute: false },
  };
  static styles = [commonStyles, overlayStyles];
  label = "";
  variant = "plain";
  supportingText = "";
  persistent = false;
  tail: SurfaceTail = "auto";
  labels: Partial<ControlLabels> = {};
  private get text(): ControlLabels {
    return controlLabels(this.lang, this.labels);
  }
  private trigger?: HTMLElement;
  private previousDescription: string | null = null;
  private controller?: AbortController;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private dismissController?: AbortController;
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tooltip", "");
  }
  disconnectedCallback() {
    this.cleanup();
    super.disconnectedCallback();
  }
  private cleanup() {
    clearTimeout(this.hideTimer);
    this.controller?.abort();
    this.dismissController?.abort();
    if (this.trigger) {
      if (this.previousDescription === null)
        this.trigger.removeAttribute("aria-description");
      else
        this.trigger.setAttribute("aria-description", this.previousDescription);
    }
  }
  private async setup() {
    this.cleanup();
    const host =
      this.querySelector<HTMLElement>(
        "button,a,input,[tabindex],bolle-button,bolle-icon-button",
      ) ?? undefined;
    if (host && "updateComplete" in host)
      await (host as BolleElement).updateComplete;
    this.trigger =
      host?.shadowRoot?.querySelector<HTMLElement>("button,a,input") ?? host;
    if (!this.trigger) return;
    this.previousDescription = this.trigger.getAttribute("aria-description");
    this.trigger.setAttribute("aria-description", this.label);
    this.controller = new AbortController();
    const options = { signal: this.controller.signal };
    for (const event of ["pointerenter", "focusin"])
      this.trigger.addEventListener(event, () => this.show(), options);
    for (const event of ["pointerleave", "focusout"])
      this.trigger.addEventListener(
        event,
        () => {
          if (!this.persistent && this.variant !== "rich") this.scheduleHide();
        },
        options,
      );
    this.trigger.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") this.hide();
      },
      options,
    );
  }
  show() {
    clearTimeout(this.hideTimer);
    const tip = this.renderRoot.querySelector<HTMLElement>(".tooltip")!;
    if (!this.trigger || !tip) return;
    tip.showPopover();
    const gap = this.variant === "rich" ? 8 : 4;
    const anchor = this.trigger.getBoundingClientRect();
    // offset sizes ignore the entry scale, unlike getBoundingClientRect.
    const rect = { width: tip.offsetWidth, height: tip.offsetHeight };
    // The narrow corner sits over the trigger centre: start-aligned when it fits,
    // end-aligned near the right edge, so the tail always points at the opener.
    const centre = anchor.left + anchor.width / 2;
    const reach = Math.min(16, anchor.width / 2);
    const fitsStart = centre - reach + rect.width <= innerWidth - 4;
    const fitsEnd = centre + reach - rect.width >= 4;
    const left =
      rect.width <= anchor.width
        ? anchor.left + (anchor.width - rect.width) / 2
        : fitsStart || !fitsEnd
          ? centre - reach
          : centre + reach - rect.width;
    const finalLeft = Math.max(4, Math.min(innerWidth - rect.width - 4, left));
    const finalTop = Math.max(
      4,
      anchor.bottom + rect.height + gap < innerHeight
        ? anchor.bottom + gap
        : anchor.top - rect.height - gap,
    );
    tip.style.left = `${finalLeft}px`;
    tip.style.top = `${finalTop}px`;
    applyTail(tip, this.tail, anchor, {
      left: finalLeft,
      top: finalTop,
      width: rect.width,
      height: rect.height,
    });
    if (this.variant === "rich") {
      this.dismissController?.abort();
      this.dismissController = new AbortController();
      const signal = this.dismissController.signal;
      document.addEventListener(
        "pointerdown",
        (event) => {
          const path = event.composedPath();
          if (!path.includes(this) && !path.includes(tip)) this.hide();
        },
        { capture: true, signal },
      );
      window.addEventListener("resize", () => this.hide(), { signal });
    }
  }
  hide() {
    clearTimeout(this.hideTimer);
    this.renderRoot.querySelector<HTMLElement>(".tooltip")?.hidePopover();
  }
  private scheduleHide() {
    if (this.persistent || this.variant === "rich") return;
    clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => {
      if (!this.matches(":focus-within") && !this.matches(":hover"))
        this.hide();
    }, 200);
  }
  protected render() {
    return html`<slot name="trigger" part="trigger" @slotchange=${this.setup}
        ><slot @slotchange=${this.setup}></slot
      ></slot>
      <div
        part="surface tooltip"
        class="tooltip"
        popover="manual"
        role=${this.variant === "rich" ? "dialog" : "tooltip"}
        aria-label=${this.variant === "rich" ? this.label : nothing}
        @pointerenter=${() => clearTimeout(this.hideTimer)}
        @pointerleave=${this.scheduleHide}
        @focusin=${() => clearTimeout(this.hideTimer)}
        @focusout=${this.scheduleHide}
        @keydown=${(event: KeyboardEvent) => {
          if (event.key === "Escape") this.hide();
        }}
      >
        <span part="label"><slot name="label">${this.label}</slot></span
        >${
          this.variant === "rich"
            ? html`<p part="supporting">
                  <slot name="supporting">${this.supportingText}</slot>
                </p>
                <slot part="content" name="content"></slot>
                <footer part="actions">
                  <slot name="actions"></slot>
                  <button
                    type="button"
                    part="dismiss"
                    class="tooltip-dismiss"
                    aria-label=${this.text.dismiss}
                    @click=${() => this.hide()}
                  >
                    <slot name="dismiss">${closeIcon()}</slot>
                  </button>
                </footer>`
            : nothing
        }
      </div>`;
  }
}

export class BolleFabMenu extends BolleElement {
  static properties = {
    label: {},
    items: { attribute: false },
    color: { reflect: true },
    open: { type: Boolean, reflect: true },
    tail: { reflect: true },
  };
  static styles = [commonStyles, overlayStyles];
  label = "";
  items: BolleItem[] = [];
  color: "primary" | "secondary" | "tertiary" = "primary";
  open = false;
  tail: SurfaceTail = "auto";
  private get trigger() {
    return this.renderRoot.querySelector<HTMLButtonElement>(".fab-trigger")!;
  }
  private get surface() {
    return this.renderRoot.querySelector<HTMLElement>(".fab-actions")!;
  }
  protected updated() {
    if (this.open && !this.surface.matches(":popover-open")) {
      this.surface.showPopover();
      const rect = this.trigger.getBoundingClientRect();
      const above = Math.max(0, rect.top - 20);
      const below = Math.max(0, innerHeight - rect.bottom - 20);
      const placeAbove = above >= below;
      this.surface.style.maxBlockSize = `${placeAbove ? above : below}px`;
      const menu = this.surface.getBoundingClientRect();
      this.surface.style.left = `${Math.max(16, Math.min(innerWidth - menu.width - 16, rect.right - menu.width))}px`;
      this.surface.style.top = `${placeAbove ? Math.max(16, rect.top - menu.height - 4) : rect.bottom + 4}px`;
      applyTail(this.surface, this.tail, rect);
    } else if (!this.open && this.surface.matches(":popover-open"))
      this.surface.hidePopover();
  }
  private dismiss(restore = true) {
    if (this.surface.matches(":popover-open")) this.surface.hidePopover();
    this.open = false;
    if (restore) this.trigger.focus();
  }
  private async triggerKey(event: KeyboardEvent) {
    if (event.key === "Escape") this.dismiss();
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    this.open = true;
    await this.updateComplete;
    const buttons = this.surface.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not(:disabled)',
    );
    buttons[event.key === "ArrowDown" ? 0 : buttons.length - 1]?.focus();
  }
  protected render() {
    return html`<div part="fab-menu" class="fab-menu">
      <div
        part="surface actions"
        class="fab-actions"
        id="actions"
        popover="auto"
        role="menu"
        aria-label=${this.label}
        @toggle=${(event: ToggleEvent) => {
          this.open = event.newState === "open";
        }}
        @keydown=${(event: KeyboardEvent) => {
          const controls = Array.from(
            this.surface.querySelectorAll<HTMLElement>(
              '[role="menuitem"]:not(:disabled)',
            ),
          );
          moveFocus(event, controls, true);
          if (event.key === "Escape") this.dismiss();
          if (event.key === "Tab") this.dismiss();
          if (
            event.key.length === 1 &&
            !event.ctrlKey &&
            !event.altKey &&
            event.key !== " "
          ) {
            const start = controls.indexOf(
              this.shadowRoot?.activeElement as HTMLElement,
            );
            const ordered = [
              ...controls.slice(start + 1),
              ...controls.slice(0, start + 1),
            ];
            ordered
              .find((control) =>
                control.textContent
                  ?.trim()
                  .toLocaleLowerCase()
                  .startsWith(event.key.toLocaleLowerCase()),
              )
              ?.focus();
          }
        }}
      >
        ${this.items.map(
          (item) =>
            html`<button
              part="item"
              class="fab-item"
              role="menuitem"
              tabindex="-1"
              ?disabled=${item.disabled}
              @click=${() => {
                this.dismiss();
                this.emit("action", { id: item.id });
              }}
            >
              ${item.icon ? html`<span part="icon" class="icon" aria-hidden="true">${item.icon}</span>` : nothing}<span
                part="label"
                >${item.label}</span
              >
            </button>`,
        )}
      </div>
      <button
        part="trigger"
        class="fab-trigger"
        id="trigger"
        aria-label=${this.label}
        aria-expanded=${String(this.open)}
        aria-controls="actions"
        aria-haspopup="menu"
        @keydown=${this.triggerKey}
        @click=${() => {
          this.open = !this.open;
        }}
      >
        <span part="trigger-icon"
          >${this.open ? "×" : html`<slot name="icon">+</slot>`}</span
        >
      </button>
    </div>`;
  }
}

export class BolleSplitButton extends BolleElement {
  static properties = {
    label: {},
    menuLabel: { attribute: "menu-label" },
    items: { attribute: false },
    disabled: { type: Boolean },
    icon: { type: Boolean, reflect: true },
    variant: { reflect: true },
    size: { reflect: true },
  };
  static styles = [commonStyles, overlayStyles];
  label = "";
  menuLabel = "";
  items: MenuEntry[] = [];
  disabled = false;
  icon = false;
  variant = "filled";
  size = "small";
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("split", "");
  }
  protected render() {
    return html`<bolle-button
        part="primary"
        variant=${this.variant}
        size=${this.size}
        ?disabled=${this.disabled}
        @click=${() => this.emit("action", {})}
        >${
          this.icon
            ? html`<slot name="icon" slot="icon" aria-hidden="true"></slot>`
            : nothing
        }${this.label}</bolle-button
      ><bolle-icon-button
        part="menu-trigger"
        variant=${this.variant}
        size=${this.size}
        label=${this.menuLabel}
        ?disabled=${this.disabled}
        @click=${(event: Event) => {
          const menu = this.renderRoot.querySelector<BolleMenu>("bolle-menu")!;
          const host = event.currentTarget as HTMLElement;
          menu.show(
            host.shadowRoot?.querySelector<HTMLElement>("button") ?? host,
          );
        }}
        >${chevronDownIcon()}</bolle-icon-button
      ><bolle-menu
        part="menu"
        .items=${this.items}
        menu-label=${this.menuLabel}
      ></bolle-menu>`;
  }
}
