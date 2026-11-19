import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { dashboardStyles } from "./dashboard.styles.js";
import { shellLabels, type ShellLabels } from "./localization.js";
import { columnGripIcon, rowMenuIcon } from "./icons.js";
import type { BolleMenu } from "./menu.js";
import type { MenuEntry, MenuSelectDetail } from "./menu.types.js";

export interface DashboardLayoutEntry {
  id: string;
  span: number;
}

export interface DashboardLayoutDetail {
  layout: DashboardLayoutEntry[];
}

export const DASHBOARD_COLUMNS = 12;
export const DASHBOARD_COMPACT_COLUMNS = 4;
export const DASHBOARD_MEDIUM_COLUMNS = 8;

interface DashboardDrag {
  widget: BolleWidget;
  index: number;
  refused: string;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

/**
 * One tile of a `bolle-dashboard`: a title, an optional subtitle, its actions and
 * the body. The dashboard reads `span` and `min-span` and arranges the tiles.
 */
export class BolleWidget extends BolleElement {
  static properties = {
    icon: { attribute: false },
    title: {},
    subtitle: {},
    span: { type: Number },
    minSpan: { type: Number, attribute: "min-span" },
    removable: { type: Boolean, reflect: true },
    menuLabel: { attribute: "menu-label" },
    labels: { attribute: false },
    movable: { type: Boolean, reflect: true },
    resizable: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    error: {},
    _dragging: { state: true },
    _resizing: { state: true },
  };
  static styles = [commonStyles, dashboardStyles];

  icon?: TemplateResult;
  title = "";
  subtitle = "";
  span = DASHBOARD_COLUMNS;
  minSpan = 2;
  removable = false;
  movable = false;
  resizable = false;
  loading = false;
  error = "";
  menuLabel = "";
  labels: Partial<ShellLabels> = {};
  private _dragging = false;
  private _resizing = false;
  private static counter = 0;

  private get text(): ShellLabels {
    return shellLabels(document.documentElement.lang, this.labels);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "listitem");
    if (!this.id) this.id = `bolle-widget-${++BolleWidget.counter}`;
  }

  set dragging(value: boolean) {
    this._dragging = value;
  }

  set resizing(value: boolean) {
    this._resizing = value;
  }

  private request(name: string, event: Event) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: { event, widget: this },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private openMenu(event: Event) {
    this.dispatchEvent(
      new CustomEvent("widget-menu", {
        detail: { widget: this, anchor: event.currentTarget },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    return html`<article
      class="tile ${this._dragging ? "dragging" : ""} ${this._resizing ? "resizing" : ""}"
      part="tile"
      aria-labelledby=${`h-${this.id}`}
    >
      <header class="tile-head" part="header">
        <button
          class="tile-grip"
          part="grip"
          ?disabled=${!this.movable}
          aria-label=${this.text.moveWidget.replace("{title}", this.title)}
          @pointerdown=${(event: PointerEvent) => {
            if (event.button !== 0) return;
            if (!this.movable) return;
            event.preventDefault();
            this.request("widget-grip", event);
          }}
          @keydown=${(event: KeyboardEvent) => {
            if (this.movable) this.request("widget-key", event);
          }}
        >
          ${columnGripIcon()}
        </button>
        <slot name="icon" part="icon"
          >${this.icon ? html`<span class="tile-icon" aria-hidden="true">${this.icon}</span>` : nothing}</slot
        >
        <div class="tile-titles" part="titles">
          <slot name="header" part="header-custom">
            <h3 id=${`h-${this.id}`} part="title">${this.title}</h3>
            ${this.subtitle ? html`<p part="subtitle">${this.subtitle}</p>` : nothing}
          </slot>
        </div>
        <div class="tile-actions" part="actions">
          <slot name="actions" part="actions-slot"></slot>
          <bolle-icon-button
            variant="standard"
            size="xs"
            label=${this.menuLabel || this.text.widgetMenu.replace("{title}", this.title)}
            haspopup="menu"
            @click=${(event: Event) => this.openMenu(event)}
            >${rowMenuIcon()}</bolle-icon-button
          >
        </div>
      </header>
      <div class="tile-body" part="body">
        <slot name="loading" part="loading"
          >${
            this.loading
              ? html`<bolle-loading-indicator
                  label=""
                ></bolle-loading-indicator>`
              : nothing
          }</slot
        >
        <slot name="error" part="error"
          >${this.error ? html`<div role="alert">${this.error}</div>` : nothing}</slot
        >
        <slot name="body" part="body-content"><slot></slot></slot>
      </div>
      <slot name="footer" part="footer"></slot>
      <span
        class="tile-resize"
        part="resize-handle"
        aria-disabled=${String(!this.resizable)}
        role="separator"
        tabindex="0"
        aria-orientation="vertical"
        aria-label=${this.text.resizeWidget.replace("{title}", this.title)}
        aria-valuemin=${this.minSpan}
        aria-valuemax=${DASHBOARD_COLUMNS}
        aria-valuenow=${this.span}
        @pointerdown=${(event: PointerEvent) => {
          if (event.button !== 0) return;
          if (!this.resizable) return;
          event.preventDefault();
          event.stopPropagation();
          this.request("widget-resize-start", event);
        }}
        @keydown=${(event: KeyboardEvent) => {
          if (this.resizable) this.request("widget-key", event);
        }}
      ></span>
    </article>`;
  }
}

/**
 * Grid of `bolle-widget` tiles twelve columns wide. The tiles keep the order and
 * the width the application gives them; the component reports every change in
 * `layout-change` and stores nothing.
 */
export class BolleDashboard extends BolleElement {
  static properties = {
    label: {},
    density: { reflect: true },
    columns: { type: Number },
    labels: { attribute: false },
    compactColumns: { attribute: "compact-columns", type: Number },
    mediumColumns: { attribute: "medium-columns", type: Number },
    _drag: { state: true },
    _announcement: { state: true },
    _effectiveColumns: { state: true },
  };
  static styles = [commonStyles, dashboardStyles];

  label = "";
  density: "comfortable" | "compact" = "comfortable";
  columns = DASHBOARD_COLUMNS;
  compactColumns = DASHBOARD_COMPACT_COLUMNS;
  mediumColumns = DASHBOARD_MEDIUM_COLUMNS;
  labels: Partial<ShellLabels> = {};
  private _effectiveColumns = DASHBOARD_COLUMNS;
  private _announcement = "";
  private _drag?: DashboardDrag;
  private placeholder?: HTMLElement;
  private menuWidget?: BolleWidget;
  private observer?: ResizeObserver;

  private get text(): ShellLabels {
    return shellLabels(document.documentElement.lang, this.labels);
  }

  private get widgets() {
    return Array.from(this.querySelectorAll<BolleWidget>("bolle-widget"));
  }

  private get menu() {
    return this.renderRoot.querySelector<BolleMenu>("bolle-menu");
  }

  connectedCallback() {
    super.connectedCallback();
    this.observer = new ResizeObserver(() => this.refresh());
    this.observer.observe(this);
    this.refresh();
    this.addEventListener("widget-grip", this.onGrip as EventListener);
    this.addEventListener(
      "widget-resize-start",
      this.onResizeStart as EventListener,
    );
    this.addEventListener("widget-key", this.onKey as EventListener);
    this.addEventListener("widget-menu", this.onWidgetMenu as EventListener);
    this.addEventListener("menu-select", this.onMenuSelect as EventListener);
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    this.removeEventListener("widget-grip", this.onGrip as EventListener);
    this.removeEventListener(
      "widget-resize-start",
      this.onResizeStart as EventListener,
    );
    this.removeEventListener("widget-key", this.onKey as EventListener);
    this.removeEventListener("widget-menu", this.onWidgetMenu as EventListener);
    this.removeEventListener("menu-select", this.onMenuSelect as EventListener);
    super.disconnectedCallback();
  }

  protected updated(changed: PropertyValues<this>) {
    if (
      changed.has("columns") ||
      changed.has("compactColumns") ||
      changed.has("mediumColumns") ||
      changed.has("density")
    )
      this.refresh();
  }

  private normalizedColumns() {
    const compact = Math.max(1, Math.round(this.compactColumns));
    const medium = Math.max(compact, Math.round(this.mediumColumns));
    const full = Math.max(medium, Math.round(this.columns));
    return { compact, medium, full };
  }

  private get effectiveColumns() {
    return this._effectiveColumns || this.normalizedColumns().full;
  }

  /** Keeps every tile inside the grid and publishes its width. */
  private refresh() {
    const width = this.clientWidth;
    const limits = this.normalizedColumns();
    const effective =
      width < 600
        ? limits.compact
        : width < 840
          ? limits.compact
          : width < 1200
            ? limits.medium
            : limits.full;
    if (effective !== this._effectiveColumns)
      this._effectiveColumns = effective;
    for (const widget of this.widgets) {
      const span = Math.min(
        effective,
        Math.max(widget.minSpan, Math.round(widget.span)),
      );
      widget.style.setProperty("--tile-span", String(span));
      widget.style.setProperty("--tile-columns", String(effective));
      widget.style.gridColumn = `span ${span}`;
    }
  }

  private get layout(): DashboardLayoutEntry[] {
    return this.widgets.map((widget) => ({ id: widget.id, span: widget.span }));
  }

  private announce(message: string) {
    this._announcement = "";
    requestAnimationFrame(() => (this._announcement = message));
  }

  private changed() {
    this.refresh();
    this.dispatchEvent(
      new CustomEvent<DashboardLayoutDetail>("layout-change", {
        detail: { layout: this.layout },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /* Reordering --------------------------------------------------------- */

  private onGrip = (
    event: CustomEvent<{ event: PointerEvent; widget: BolleWidget }>,
  ) => {
    const widget = event.detail.widget;
    if (!widget.movable) return;
    if (!this.widgets.includes(widget)) return;
    const pointer = event.detail.event;
    const grip = pointer.currentTarget as HTMLElement;
    const tile = widget.querySelector<HTMLElement>("[part], .tile") ?? widget;
    const box = tile.getBoundingClientRect();
    try {
      grip.setPointerCapture(pointer.pointerId);
    } catch {
      /* A pointer without an active capture still tracks through the listeners below. */
    }
    widget.dragging = true;
    this.placeholder = document.createElement("div");
    this.placeholder.className = "bb-dashboard-placeholder";
    this.placeholder.setAttribute("aria-hidden", "true");
    this.placeholder.style.gridColumn = `span ${this.spanOf(widget)}`;
    /* An empty grid item collapses: the gap keeps the height of the tile it replaces. */
    this.placeholder.style.minBlockSize = `${Math.round(box.height)}px`;
    /* The gap starts where the tile is, so nothing shifts before the pointer moves. */
    widget.after(this.placeholder);

    const place = (x: number, y: number) => {
      const bounds = this.getBoundingClientRect();
      const outside =
        x < bounds.left ||
        x > bounds.right ||
        y < bounds.top ||
        y > bounds.bottom;
      const index = this.insertionIndex(x, y, widget);
      this.insertAt(widget, index);
      this._drag = {
        widget,
        index,
        refused: outside ? this.text.noTarget : "",
        x,
        y,
        offsetX: pointer.clientX - box.left,
        offsetY: pointer.clientY - box.top,
        width: box.width,
        height: box.height,
      };
    };
    place(pointer.clientX, pointer.clientY);

    const scroller = this.scrollParent();
    let frame = 0;
    const scroll = () => {
      const drag = this._drag;
      if (!drag || !scroller) return;
      /* The page scroller spans the whole document: its edge is the viewport edge. */
      const page = scroller === document.scrollingElement;
      const top = page ? 0 : scroller.getBoundingClientRect().top;
      const bottom = page
        ? window.innerHeight
        : scroller.getBoundingClientRect().bottom;
      const edge = 64;
      if (drag.y < top + edge) scroller.scrollTop -= 14;
      else if (drag.y > bottom - edge) scroller.scrollTop += 14;
      frame = requestAnimationFrame(scroll);
    };

    const move = (moveEvent: PointerEvent) => {
      place(moveEvent.clientX, moveEvent.clientY);
    };
    const cancel = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key !== "Escape") return;
      keyEvent.preventDefault();
      stop(true);
    };
    const stop = (cancelled = false) => {
      cancelAnimationFrame(frame);
      grip.removeEventListener("pointermove", move);
      grip.removeEventListener("pointerup", up);
      grip.removeEventListener("pointercancel", abort);
      window.removeEventListener("keydown", cancel, true);
      const drag = this._drag;
      this._drag = undefined;
      widget.dragging = false;
      this.placeholder?.remove();
      this.placeholder = undefined;
      if (!drag) return;
      if (cancelled) {
        this.announce(this.text.cancelled);
        return;
      }
      if (drag.refused) {
        this.announce(drag.refused);
        return;
      }
      this.applyMove(drag.widget, drag.index);
    };
    const up = () => stop(false);
    const abort = () => stop(true);
    grip.addEventListener("pointermove", move);
    grip.addEventListener("pointerup", up);
    grip.addEventListener("pointercancel", abort);
    window.addEventListener("keydown", cancel, true);
    frame = requestAnimationFrame(scroll);
  };

  private othersOf(widget: BolleWidget) {
    return this.widgets.filter((item) => item !== widget && !item.hidden);
  }

  private spanOf(widget: BolleWidget) {
    return Math.min(
      this.effectiveColumns,
      Math.max(widget.minSpan, Math.round(widget.span)),
    );
  }

  /** Puts the placeholder where the tile would land, keeping the grid order. */
  private insertAt(widget: BolleWidget, index: number) {
    const placeholder = this.placeholder;
    if (!placeholder) return;
    const reference = this.othersOf(widget)[index];
    if (reference) reference.before(placeholder);
    else this.append(placeholder);
  }

  /**
   * Index the tile would take: the first tile whose top half is below the pointer,
   * then the first whose left half is to its right on the same row.
   */
  private insertionIndex(x: number, y: number, dragged: BolleWidget) {
    const others = this.othersOf(dragged);
    for (const [index, other] of others.entries()) {
      const box = other.getBoundingClientRect();
      if (y < box.top + box.height / 2 - 2) return index;
      if (y <= box.bottom - 2 && x < box.left + box.width / 2) return index;
    }
    return others.length;
  }

  private scrollParent() {
    let node = this.parentElement;
    while (node && node !== document.body) {
      const style = getComputedStyle(node);
      if (
        /(auto|scroll)/.test(style.overflowY) &&
        node.scrollHeight > node.clientHeight
      )
        return node;
      node = node.parentElement;
    }
    return document.scrollingElement as HTMLElement | null;
  }

  /** Puts the tile in the slot the placeholder showed. */
  private applyMove(widget: BolleWidget, index: number) {
    const reference = this.othersOf(widget)[index];
    const unchanged = reference
      ? reference === widget.nextElementSibling
      : !widget.nextElementSibling;
    if (!unchanged) {
      if (reference) reference.before(widget);
      else this.append(widget);
    }
    const widgets = this.widgets;
    this.announce(
      this.text.moved
        .replace("{title}", widget.title)
        .replace("{index}", String(widgets.indexOf(widget) + 1))
        .replace("{count}", String(widgets.length)),
    );
    this.changed();
  }

  private moveWidget(widget: BolleWidget, target: number) {
    const widgets = this.widgets;
    const from = widgets.indexOf(widget);
    if (from < 0 || target < 0 || target >= widgets.length || from === target)
      return;
    const reference = widgets[target];
    if (from < target) reference.after(widget);
    else reference.before(widget);
    this.announce(
      this.text.moved
        .replace("{title}", widget.title)
        .replace("{index}", String(target + 1))
        .replace("{count}", String(widgets.length)),
    );
    this.changed();
  }

  /* Resizing ----------------------------------------------------------- */

  private onResizeStart = (
    event: CustomEvent<{ event: PointerEvent; widget: BolleWidget }>,
  ) => {
    const widget = event.detail.widget;
    if (!widget.resizable) return;
    const pointer = event.detail.event;
    const handle = pointer.currentTarget as HTMLElement;
    if (!this.clientWidth) return;
    const gap = Number.parseFloat(getComputedStyle(this).columnGap || "0") || 0;
    const column =
      (this.clientWidth - gap * (this.effectiveColumns - 1)) /
        this.effectiveColumns +
      gap;
    const rtl = getComputedStyle(this).direction === "rtl";
    handle.setPointerCapture(pointer.pointerId);
    const state = {
      widget,
      startX: pointer.clientX,
      startSpan: widget.span,
      span: widget.span,
      column,
    };
    widget.resizing = true;
    const move = (moveEvent: PointerEvent) => {
      const delta =
        ((moveEvent.clientX - state.startX) * (rtl ? -1 : 1)) / column;
      state.span = Math.max(
        widget.minSpan,
        Math.min(this.effectiveColumns, Math.round(state.startSpan + delta)),
      );
      widget.style.setProperty("--tile-span", String(state.span));
      widget.style.gridColumn = `span ${state.span}`;
    };
    const stop = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
      widget.resizing = false;
      if (state.span === state.startSpan) return;
      this.setSpan(widget, state.span);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  };

  private setSpan(widget: BolleWidget, span: number) {
    const value = Math.max(
      widget.minSpan,
      Math.min(this.effectiveColumns, span),
    );
    widget.span = value;
    this.announce(
      this.text.resized
        .replace("{title}", widget.title)
        .replace("{count}", String(value)),
    );
    this.changed();
  }

  /* Keyboard ------------------------------------------------------------ */

  private onKey = (
    event: CustomEvent<{ event: KeyboardEvent; widget: BolleWidget }>,
  ) => {
    const { event: keyEvent, widget } = event.detail;
    const rtl = getComputedStyle(this).direction === "rtl";
    const onResize =
      keyEvent.currentTarget instanceof HTMLElement &&
      keyEvent.currentTarget.classList.contains("tile-resize");
    if (onResize) {
      const grow = rtl ? "ArrowLeft" : "ArrowRight";
      const shrink = rtl ? "ArrowRight" : "ArrowLeft";
      const next =
        keyEvent.key === grow
          ? widget.span + 1
          : keyEvent.key === shrink
            ? widget.span - 1
            : undefined;
      if (next === undefined) return;
      keyEvent.preventDefault();
      this.setSpan(widget, next);
      return;
    }
    if (!keyEvent.altKey) return;
    if (keyEvent.key !== "ArrowLeft" && keyEvent.key !== "ArrowRight") return;
    keyEvent.preventDefault();
    const step = (keyEvent.key === "ArrowLeft") !== rtl ? -1 : 1;
    this.moveWidget(widget, this.widgets.indexOf(widget) + step);
    void this.updateComplete.then(() =>
      widget.querySelector<HTMLElement>(".tile-grip")?.focus(),
    );
  };

  /* Tile menu ----------------------------------------------------------- */

  private onWidgetMenu = (
    event: CustomEvent<{ widget: BolleWidget; anchor: HTMLElement }>,
  ) => {
    const menu = this.menu;
    if (!menu) return;
    const widget = event.detail.widget;
    const index = this.widgets.indexOf(widget);
    const items: MenuEntry[] = [
      {
        group: true,
        label: this.text.width,
        items: Array.from({ length: this.effectiveColumns }, (_, i) => i + 1)
          .filter((span) => span >= widget.minSpan)
          .map((span) => ({
            id: `span:${span}`,
            label: this.text.columns.replace("{count}", String(span)),
            selected: widget.span === span,
          })),
      },
      { separator: true },
      {
        id: "before",
        label: this.text.moveBefore,
        trailingText: "Alt ←",
        disabled: index === 0,
      },
      {
        id: "after",
        label: this.text.moveAfter,
        trailingText: "Alt →",
        disabled: index === this.widgets.length - 1,
      },
      { separator: true },
      { id: "hide", label: this.text.hideWidget, disabled: !widget.removable },
    ];
    this.menuWidget = widget;
    menu.items = items;
    menu.menuLabel = this.text.widgetMenu.replace("{title}", widget.title);
    menu.selectionMode = "none";
    void menu.show(event.detail.anchor);
  };

  private onMenuSelect = (event: CustomEvent<MenuSelectDetail>) => {
    const widget = this.menuWidget;
    if (!widget) return;
    const id = event.detail.item.id;
    const index = this.widgets.indexOf(widget);
    if (id.startsWith("span:")) this.setSpan(widget, Number(id.slice(5)));
    else if (id === "before") this.moveWidget(widget, index - 1);
    else if (id === "after") this.moveWidget(widget, index + 1);
    else if (id === "hide") {
      widget.hidden = true;
      this.announce(this.text.hidden.replace("{title}", widget.title));
      this.dispatchEvent(
        new CustomEvent<{ id: string }>("widget-hide", {
          detail: { id: widget.id },
          bubbles: true,
          composed: true,
        }),
      );
      this.changed();
    }
  };

  private renderGhost() {
    const drag = this._drag;
    if (!drag) return nothing;
    const count = this.othersOf(drag.widget).length + 1;
    const note =
      drag.refused ||
      this.text.dropAt
        .replace("{index}", String(drag.index + 1))
        .replace("{count}", String(count));
    return html`<div
      class="ghost-drop"
      style=${`inset-inline-start:${Math.round(drag.x - drag.offsetX)}px;inset-block-start:${Math.round(
        drag.y - drag.offsetY,
      )}px;inline-size:${Math.round(drag.width)}px`}
    >
      <div class="ghost ${drag.refused ? "refused" : ""}">
        <h4>${drag.widget.title}</h4>
        ${drag.widget.subtitle ? html`<p>${drag.widget.subtitle}</p>` : nothing}
      </div>
      <p class="ghost-note">${note}</p>
    </div>`;
  }

  protected render() {
    const label = this.label || this.text.dashboard;
    return html`<div class="dashboard density-${this.density}">
      <div
        class="dashboard-grid"
        style=${`--dashboard-columns:${this.effectiveColumns}`}
        role="list"
        aria-label=${label}
      >
        <slot></slot>
      </div>
      ${this.renderGhost()}
      <span class="sr-only" role="status" aria-live="polite"
        >${this._announcement}</span
      >
      <bolle-menu
        menu-label=${label}
        @menu-select=${this.onMenuSelect}
      ></bolle-menu>
    </div>`;
  }
}
