import { html, nothing } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { repeat } from "lit/directives/repeat.js";
import {
  BolleElement,
  BolleFormElement,
  moveFocus,
  type BolleItem,
} from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { listLabels, type ListLabels } from "./localization.js";
import { surfaceStyles } from "./surfaces.styles.js";

export class BolleAppBar extends BolleElement {
  static properties = {
    label: {},
    variant: { reflect: true },
    sticky: { type: Boolean, reflect: true },
    scrolled: { type: Boolean, reflect: true },
    subtitle: { reflect: true },
    alignment: { reflect: true },
    collapsed: { type: Boolean, reflect: true },
  };
  static styles = [commonStyles, surfaceStyles];
  label = "";
  variant = "small";
  sticky = false;
  scrolled = false;
  subtitle = "";
  alignment = "leading";
  collapsed = false;
  protected render() {
    return html`<header class="bar" part="app-bar">
      <slot name="leading" part="app-bar-leading leading"></slot>
      ${
        this.variant === "search"
          ? html`<div
              class="title-group"
              part="app-bar-title-group title-group"
            >
              <slot name="title" part="app-bar-title title"><slot></slot></slot>
            </div>`
          : html`<div
              class="title-group"
              part="app-bar-title-group title-group"
            >
              <h1 class="title" part="app-bar-title title">
                <slot name="title"><slot>${this.label}</slot></slot>
              </h1>
              ${this.subtitle ? html`<p class="subtitle" part="app-bar-subtitle subtitle">${this.subtitle}</p>` : nothing}
            </div>`
      }
      <slot name="actions" part="app-bar-actions actions trailing"
        ><slot name="trailing"></slot
      ></slot>
    </header>`;
  }
}
export class BolleToolbar extends BolleElement {
  static properties = {
    label: {},
    variant: { reflect: true },
    orientation: { reflect: true },
    color: { reflect: true },
  };
  static styles = [commonStyles, surfaceStyles];
  label = "";
  variant = "docked";
  orientation = "horizontal";
  color = "standard";
  private controls() {
    return Array.from(
      this.querySelectorAll<HTMLElement>(
        "button,a,bolle-button,bolle-icon-button",
      ),
    )
      .map(
        (host) =>
          host.shadowRoot?.querySelector<HTMLElement>(".button") ?? host,
      )
      .filter((control) => !(control as HTMLButtonElement).disabled);
  }
  protected render() {
    return html`<div
      class="toolbar"
      part="toolbar"
      role="toolbar"
      aria-label=${this.label}
      aria-orientation=${this.orientation}
      @keydown=${(event: KeyboardEvent) => moveFocus(event, this.controls(), this.orientation === "vertical")}
    >
      <slot
        part="toolbar-content"
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
    </div>`;
  }
}
/** `none` drops the narrow corner: the card keeps the same radius on all four corners. */
export type CardTail =
  "bottom-start" | "bottom-end" | "top-start" | "top-end" | "none";
export class BolleCard extends BolleElement {
  static properties = {
    variant: { reflect: true },
    orientation: { reflect: true },
    tail: { reflect: true },
    href: {},
    label: {},
  };
  static styles = [commonStyles, surfaceStyles];
  variant = "filled";
  orientation = "vertical";
  /** Narrow corner: points at where the card comes from, e.g. the content above a link card. */
  tail: CardTail = "bottom-start";
  href = "";
  label = "";
  protected render() {
    return html`<article
      class="card ${this.href ? "is-link" : ""}"
      part="card"
      aria-label=${this.label || nothing}
    >
      <slot name="media" part="card-media"></slot>
      ${
        this.href
          ? html`<a part="card-link" href=${this.href}
              ><slot name="content" part="card-content content"
                ><slot></slot></slot
            ></a>`
          : html`<div class="card-content" part="card-content content">
              <slot name="content"><slot></slot></slot>
            </div>`
      }
    </article>`;
  }
}
export class BolleBadge extends BolleElement {
  static properties = {
    value: {},
    label: {},
    small: { type: Boolean, reflect: true },
    max: { type: Number },
  };
  static styles = [commonStyles, surfaceStyles];
  value = "";
  label = "";
  small = false;
  max = 999;
  protected render() {
    return keyed(
      this.value,
      html`<span
        class="badge"
        part="badge"
        role=${this.label ? "status" : nothing}
        aria-label=${this.label || nothing}
        aria-hidden=${this.label ? nothing : "true"}
        ><slot name="label" part="badge-label label"
          >${this.small ? nothing : Number(this.value) > this.max ? `${this.max}+` : this.value}</slot
        ></span
      >`,
    );
  }
}
export class BolleDivider extends BolleElement {
  static properties = {
    vertical: { type: Boolean, reflect: true },
    inset: { type: Boolean, reflect: true },
    variant: { reflect: true },
    decorative: { type: Boolean },
  };
  static styles = [commonStyles, surfaceStyles];
  vertical = false;
  inset = false;
  variant = "full";
  decorative = false;
  private get mode() {
    return this.variant || (this.inset ? "inset" : "full");
  }
  protected render() {
    if (!this.vertical && this.mode === "full")
      return html`<hr
        class="divider"
        part="divider"
        role=${this.decorative ? "none" : nothing}
      />`;
    return html`<div
      class="divider"
      part="divider"
      data-mode=${this.mode}
      role=${this.decorative ? "none" : "separator"}
      aria-orientation=${this.decorative ? nothing : this.vertical ? "vertical" : "horizontal"}
    ></div>`;
  }
}
export class BolleList extends BolleElement {
  static properties = {
    items: { attribute: false },
    label: {},
    variant: { reflect: true },
    interactive: { type: Boolean },
    selection: { reflect: true },
    value: { attribute: false },
    expanded: { attribute: false },
    labels: { attribute: false },
  };
  static styles = [commonStyles, surfaceStyles];
  items: BolleItem[] = [];
  label = "";
  variant = "standard";
  interactive = false;
  selection: "none" | "single" | "multiple" = "none";
  value: string | string[] = "";
  expanded: string[] = [];
  labels: Partial<ListLabels> = {};
  private get text(): ListLabels {
    return listLabels(document.documentElement.lang, this.labels);
  }
  private selectedIds() {
    if (Array.isArray(this.value)) return [...this.value];
    return this.value ? [this.value] : [];
  }
  private isSelected(item: BolleItem) {
    return (
      this.selectedIds().includes(item.id) ||
      (this.selection === "none" && Boolean(item.selected))
    );
  }
  private toggle(item: BolleItem) {
    if (item.items) {
      const open = this.expanded.includes(item.id);
      this.expanded = open
        ? this.expanded.filter((id) => id !== item.id)
        : [...this.expanded, item.id];
      this.emit("expand", { id: item.id, expanded: !open });
      this.requestUpdate();
    }
    if (this.selection === "none") {
      this.emit("action", { id: item.id });
      return;
    }
    if (this.selection === "single") {
      this.value = item.id;
    } else {
      const current = this.selectedIds();
      this.value = current.includes(item.id)
        ? current.filter((id) => id !== item.id)
        : [...current, item.id];
    }
    this.emit("change", {
      value: this.value,
      id: item.id,
      selected: this.isSelected(item),
    });
  }
  private content(item: BolleItem) {
    return html`<slot name=${`leading-${item.id}`} part="list-leading"
        >${item.icon ? html`<span class="icon" part="list-icon" aria-hidden="true">${item.icon}</span>` : nothing}</slot
      ><span part="list-text" class="list-text"
        ><span part="list-label">${item.label}</span
        >${item.supportingText ? html`<span class="support" part="list-supporting-text">${item.supportingText}</span>` : nothing}</span
      ><slot name=${`trailing-${item.id}`} part="list-trailing"
        >${item.badge ? html`<span class="list-badge" part="list-badge">${item.badge}</span>` : nothing}</slot
      >`;
  }
  private listRole() {
    return this.selection === "single" ? "listbox" : nothing;
  }
  private state(item: BolleItem) {
    return this.isSelected(item) ? "true" : nothing;
  }
  private disclosure(item: BolleItem) {
    if (!item.items) return nothing;
    const open = this.expanded.includes(item.id);
    return html`<button
      class="list-disclosure"
      part="list-disclosure"
      type="button"
      aria-expanded=${String(open)}
      aria-label=${`${open ? this.text.collapse : this.text.expand} ${item.label}`}
      @click=${(event: Event) => {
        event.stopPropagation();
        this.toggle(item);
      }}
    >
      <svg
        part="list-disclosure-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d=${open ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}></path>
      </svg>
    </button>`;
  }
  private nested(item: BolleItem) {
    if (!item.items || !this.expanded.includes(item.id)) return nothing;
    return html`<ul class="list-sublist" part="list-sublist">
      ${repeat(
        item.items,
        (child) => child.id,
        (child) =>
          html`<li part="list-item-row" data-id=${child.id}>
            <button
              class="list-item"
              part="list-item"
              type="button"
              role=${this.selection === "single" ? "option" : nothing}
              aria-selected=${this.selection === "single" ? (this.state(child) ?? "false") : nothing}
              aria-current=${this.selection === "single" ? nothing : this.state(child)}
              ?disabled=${child.disabled}
              @click=${() => this.toggle(child)}
            >
              ${this.content(child)}
            </button>
          </li>`,
      )}
    </ul>`;
  }
  protected render() {
    const selectable = this.selection !== "none";
    return html`<ul
      part="list"
      role=${this.listRole()}
      aria-label=${this.label || nothing}
      aria-multiselectable=${this.selection === "multiple" ? "true" : nothing}
    >
      ${repeat(
        this.items,
        (item) => item.id,
        (item) => {
          const selected =
            this.selection === "single" ? this.state(item) : nothing;
          const current =
            this.selection === "single" ? nothing : this.state(item);
          const role = this.selection === "single" ? "option" : nothing;
          const expanded = item.items
            ? String(this.expanded.includes(item.id))
            : nothing;
          return html`<li part="list-item-row" data-id=${item.id}>
            <div class="list-row" part="list-row">
              ${
                item.href && !item.disabled
                  ? html`<a
                      class="list-item"
                      part="list-item"
                      href=${item.href}
                      role=${role}
                      aria-selected=${selected}
                      aria-current=${current}
                      aria-expanded=${expanded}
                      >${this.content(item)}</a
                    >`
                  : !this.interactive && !selectable
                    ? html`<div
                        class="list-item"
                        part="list-item"
                        role=${role}
                        aria-selected=${selected}
                        aria-current=${current}
                        aria-disabled=${item.disabled ? "true" : nothing}
                        aria-expanded=${expanded}
                      >
                        ${this.content(item)}
                      </div>`
                    : html`<button
                        class="list-item"
                        part="list-item"
                        type="button"
                        role=${role}
                        aria-selected=${selected}
                        aria-current=${current}
                        aria-expanded=${expanded}
                        ?disabled=${item.disabled}
                        @click=${() => this.toggle(item)}
                      >
                        ${this.content(item)}
                      </button>`
              }
              ${this.disclosure(item)}
            </div>
            ${this.nested(item)}
          </li>`;
        },
      )}<slot part="list-content"></slot>
    </ul>`;
  }
}
export class BolleChip extends BolleFormElement {
  static properties = {
    ...BolleFormElement.properties,
    variant: { reflect: true },
    label: {},
    selected: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    elevated: { type: Boolean, reflect: true },
    removable: { type: Boolean },
    removeLabel: { attribute: "remove-label" },
    href: {},
  };
  static styles = [commonStyles, surfaceStyles];
  variant = "assist";
  label = "";
  selected = false;
  disabled = false;
  elevated = false;
  removable = false;
  removeLabel = "";
  href = "";
  private initialSelected = false;
  protected firstUpdated() {
    super.firstUpdated();
    this.initialSelected = this.selected;
  }
  formResetCallback() {
    super.formResetCallback();
    this.selected = this.initialSelected;
  }
  formStateRestoreCallback(state: string | File | FormData | null) {
    this.selected = state === "selected";
  }
  protected syncForm() {
    super.syncForm();
    this.internals.setFormValue(
      this.variant === "filter" && this.selected && !this.isDisabled
        ? this.value || "on"
        : null,
      this.selected ? "selected" : "unselected",
    );
  }
  private activate() {
    this.emit("action", {});
  }
  protected render() {
    return html`<span class="chip" part="chip"
      >${
        this.variant === "filter"
          ? html`<label part="chip-control"
              ><input
                type="checkbox"
                .checked=${this.selected}
                ?disabled=${this.isDisabled}
                ?required=${this.required}
                @change=${(event: Event) => {
                  this.selected = (event.target as HTMLInputElement).checked;
                  this.syncForm();
                  this.emit("change", { selected: this.selected });
                }} /><slot name="avatar" part="chip-avatar"></slot
              ><slot name="icon" part="chip-icon"></slot
              ><span part="chip-label">${this.label}</span
              ><slot part="chip-content"></slot
            ></label>`
          : this.href && !this.isDisabled
            ? html`<a part="chip-control" href=${this.href}
                ><slot name="avatar" part="chip-avatar"></slot
                ><slot name="icon" part="chip-icon"></slot
                ><span part="chip-label">${this.label}</span></a
              >`
            : html`<button
                part="chip-control"
                ?disabled=${this.isDisabled}
                @click=${this.activate}
              >
                <slot name="avatar" part="chip-avatar"></slot
                ><slot name="icon" part="chip-icon"></slot
                ><span part="chip-label">${this.label}</span
                ><slot part="chip-content"></slot>
              </button>`
      }${this.removable ? html`<button class="remove" part="chip-remove" ?disabled=${this.isDisabled} aria-label=${this.removeLabel} @click=${() => this.emit("remove", {})}>×</button>` : nothing}</span
    >`;
  }
}
