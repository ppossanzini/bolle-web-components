import { html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { sidebarStyles } from "./sidebar.styles.js";
import { sidebarLabels } from "./localization.js";
import {
  chevronDownIcon,
  sidebarCollapseIcon,
  sidebarExpandIcon,
} from "./icons.js";
import type { BolleMenu } from "./menu.js";
import type { MenuAction, MenuSelectDetail } from "./menu.types.js";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: TemplateResult;
  count?: number;
  href?: string;
  children?: SidebarItem[];
}

export interface SidebarNavigateDetail {
  /** Item ids from the root, joined with "/". */
  path: string;
  item: SidebarItem;
}
export interface SidebarExpandDetail {
  path: string;
  expanded: boolean;
}
export interface SidebarCollapseDetail {
  collapsed: boolean;
}
export interface SidebarResizeDetail {
  width: number;
}

export const SIDEBAR_MIN_WIDTH = 220;
export const SIDEBAR_MAX_WIDTH = 480;
const MAX_DEPTH = 3;
const KEY_STEP = 16;

const normalize = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const clampWidth = (value: number) =>
  Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, Math.round(value)));
const fill = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );

function depthOf(items: SidebarItem[]): number {
  return items.reduce(
    (deepest, item) =>
      Math.max(deepest, 1 + (item.children ? depthOf(item.children) : 0)),
    0,
  );
}

function itemAt(items: SidebarItem[], path: string) {
  let level = items;
  let found: SidebarItem | undefined;
  for (const id of path.split("/")) {
    found = level.find((item) => item.id === id);
    if (!found) return undefined;
    level = found.children ?? [];
  }
  return found;
}

/**
 * Admin navigation tree up to three levels deep, with a rail form whose groups
 * open in a menu. The application owns the data and the state: it sets
 * `current`, `expanded`, `collapsed` and `width`; the component updates them on
 * interaction and reports each change in an event (`navigate` can be cancelled).
 */
export class BolleSidebar extends BolleElement {
  static properties = {
    label: {},
    items: { attribute: false },
    current: {},
    expanded: { attribute: false },
    collapsed: { type: Boolean, reflect: true },
    width: { type: Number },
    variant: { reflect: true },
    search: { reflect: true },
    _query: { state: true },
    _truncated: { state: true },
    _flyout: { state: true },
  };
  static styles = [commonStyles, sidebarStyles];

  label = "";
  items: SidebarItem[] = [];
  current = "";
  expanded: string[] = [];
  collapsed = false;
  width = 360;
  variant: "edge" | "card" = "edge";
  /** `field` is the text field, `contained` and `divided` use `bolle-search`, `none` hides the filter. */
  search: "field" | "contained" | "divided" | "none" = "field";
  private _query = "";
  private _truncated = new Set<string>();
  private _flyout = "";
  private resizeObserver?: ResizeObserver;

  private get text() {
    return sidebarLabels();
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has("search") && this.search === "none") this._query = "";
    if (changed.has("items") && depthOf(this.items) > MAX_DEPTH)
      throw new Error("bolle-sidebar items nest at most three levels deep.");
    if (changed.has("current") && this.current) {
      const ids = this.current.split("/");
      const ancestors = ids
        .slice(0, -1)
        .map((_, index) => ids.slice(0, index + 1).join("/"));
      const missing = ancestors.filter((path) => !this.expanded.includes(path));
      if (missing.length) this.expanded = [...this.expanded, ...missing];
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => this.measureLabels());
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    super.disconnectedCallback();
  }

  protected updated() {
    this.measureLabels();
  }

  /** Labels cut by the ellipsis get the full text in a tooltip. */
  private measureLabels() {
    const truncated = new Set<string>();
    for (const label of this.renderRoot.querySelectorAll<HTMLElement>(
      ".label[data-path]",
    )) {
      const path = label.dataset.path!;
      // A label without a box (hidden branch, tooltip not slotted yet) keeps
      // its state: measuring it as 0 would toggle the tooltip forever.
      const cut =
        label.clientWidth === 0
          ? this._truncated.has(path)
          : label.scrollWidth > label.clientWidth;
      if (cut) truncated.add(path);
    }
    const same =
      truncated.size === this._truncated.size &&
      [...truncated].every((path) => this._truncated.has(path));
    if (!same) this._truncated = truncated;
  }

  private navigate(event: Event, path: string, item: SidebarItem) {
    const accepted = this.emit<SidebarNavigateDetail>("navigate", {
      path,
      item,
    });
    if (accepted) this.current = path;
    if (!accepted || !item.href) event.preventDefault();
  }

  private toggle(path: string) {
    const open = !this.expanded.includes(path);
    this.expanded = open
      ? [...this.expanded, path]
      : this.expanded.filter((entry) => entry !== path);
    this.emit<SidebarExpandDetail>("expand", { path, expanded: open });
  }

  private setCollapsed(collapsed: boolean) {
    this.collapsed = collapsed;
    this._flyout = "";
    this.emit<SidebarCollapseDetail>("collapse", { collapsed });
  }

  private setWidth(width: number) {
    const next = clampWidth(width);
    if (next === this.width) return;
    this.width = next;
    this.emit<SidebarResizeDetail>("resize", { width: next });
  }

  private matchesQuery(item: SidebarItem): boolean {
    const query = normalize(this._query.trim());
    return (
      !query ||
      normalize(item.label).includes(query) ||
      (item.children ?? []).some((child) => this.matchesQuery(child))
    );
  }

  private countMatches(items: SidebarItem[]): number {
    const query = normalize(this._query.trim());
    return items.reduce(
      (total, item) =>
        total +
        (normalize(item.label).includes(query) ? 1 : 0) +
        this.countMatches(item.children ?? []),
      0,
    );
  }

  private highlight(label: string) {
    const query = normalize(this._query.trim());
    const start = query ? normalize(label).indexOf(query) : -1;
    if (start < 0) return label;
    const end = start + query.length;
    return html`${label.slice(0, start)}<mark>${label.slice(start, end)}</mark>${label.slice(end)}`;
  }

  private rowContent(item: SidebarItem, path: string, group: boolean) {
    return html`${
        item.icon
          ? html`<span class="icon" aria-hidden="true">${item.icon}</span>`
          : nothing
      }
      <span class="label" data-path=${path}>${this.highlight(item.label)}</span>
      ${item.count ? html`<span class="count">${item.count}</span>` : nothing}
      ${
        group
          ? html`<span class="chevron" aria-hidden="true"
              >${chevronDownIcon()}</span
            >`
          : nothing
      }`;
  }

  private withTooltip(path: string, label: string, row: TemplateResult) {
    return this._truncated.has(path)
      ? html`<bolle-tooltip label=${label}>${row}</bolle-tooltip>`
      : row;
  }

  private renderTree(
    items: SidebarItem[],
    parents: string[],
    level: number,
  ): unknown {
    const filtering = this._query.trim() !== "";
    return items
      .filter((item) => this.matchesQuery(item))
      .map((item) => {
        const path = [...parents, item.id].join("/");
        if (!item.children)
          return html`<li>
            ${this.withTooltip(
              path,
              item.label,
              html`<a
                class="row level-${level}"
                href=${item.href ?? "#"}
                aria-current=${this.current === path ? "page" : nothing}
                @click=${(event: Event) => this.navigate(event, path, item)}
                >${this.rowContent(item, path, false)}</a
              >`,
            )}
          </li>`;
        const open = filtering || this.expanded.includes(path);
        const inCurrent = this.current.startsWith(`${path}/`);
        return html`<li>
          ${this.withTooltip(
            path,
            item.label,
            html`<button
              class="row group level-${level} ${inCurrent && !open ? "in-current" : ""}"
              aria-expanded=${String(open)}
              aria-controls=${`branch-${path}`}
              @click=${() => this.toggle(path)}
            >
              ${this.rowContent(item, path, true)}
            </button>`,
          )}
          <ul id=${`branch-${path}`} class="branch" ?hidden=${!open}>
            ${this.renderTree(item.children, [...parents, item.id], level + 1)}
          </ul>
        </li>`;
      });
  }

  private menuItems(items: SidebarItem[], parents: string[]): MenuAction[] {
    return items.map((item) => {
      const path = [...parents, item.id].join("/");
      return {
        id: path,
        label: item.label,
        trailingText: item.count ? String(item.count) : undefined,
        children: item.children
          ? this.menuItems(item.children, [...parents, item.id])
          : undefined,
      };
    });
  }

  private openFlyout(event: Event, item: SidebarItem) {
    const menu = this.renderRoot.querySelector<BolleMenu>("bolle-menu")!;
    const anchor = event.currentTarget as HTMLElement;
    const box = anchor.getBoundingClientRect();
    const rtl = getComputedStyle(this).direction === "rtl";
    menu.items = this.menuItems(item.children ?? [], [item.id]);
    menu.menuLabel = item.label;
    this._flyout = item.id;
    // Beside the rail, so the menu does not cover it.
    void menu.show(anchor, {
      x: rtl ? box.left - 8 : box.right + 8,
      y: box.top,
    });
  }

  private onFlyoutSelect(event: CustomEvent<MenuSelectDetail>) {
    const path = event.detail.item.id;
    const item = itemAt(this.items, path);
    if (!item || item.children) return;
    const accepted = this.emit<SidebarNavigateDetail>("navigate", {
      path,
      item,
    });
    if (!accepted) return;
    this.current = path;
    if (item.href) location.assign(item.href);
  }

  private renderRail() {
    const top = this.current.split("/")[0];
    return html`<ul class="rail">
      ${this.items.map((item) => {
        const active = item.id === top;
        const content = html`<span class="indicator">
            ${
              item.icon
                ? html`<span class="icon" aria-hidden="true"
                    >${item.icon}</span
                  >`
                : nothing
            }
            ${
              item.count
                ? html`<bolle-badge value=${String(item.count)}></bolle-badge>`
                : nothing
            }
          </span>
          <span class="rail-label">${item.label}</span>`;
        const name = item.count ? `${item.label}, ${item.count}` : item.label;
        return html`<li>
          ${
            item.children
              ? html`<button
                  class="rail-item ${active ? "active" : ""}"
                  aria-haspopup="menu"
                  aria-expanded=${String(this._flyout === item.id)}
                  aria-label=${name}
                  @click=${(event: Event) => this.openFlyout(event, item)}
                >
                  ${content}
                </button>`
              : html`<a
                  class="rail-item ${active ? "active" : ""}"
                  href=${item.href ?? "#"}
                  aria-current=${this.current === item.id ? "page" : nothing}
                  aria-label=${name}
                  @click=${(event: Event) => this.navigate(event, item.id, item)}
                >
                  ${content}
                </a>`
          }
        </li>`;
      })}
    </ul>`;
  }

  private renderTreePanel() {
    const filtering = this._query.trim() !== "";
    const found = filtering ? this.countMatches(this.items) : 0;
    const onInput = (event: CustomEvent<{ value: string }>) =>
      (this._query = event.detail.value);
    const filter =
      this.search === "none"
        ? nothing
        : html`<div class="filter">
            ${
              this.search === "contained" || this.search === "divided"
                ? html`<bolle-search
                    label=${this.text.filter}
                    placeholder=${this.text.filter}
                    appearance=${this.search}
                    .value=${this._query}
                    @value-input=${onInput}
                  ></bolle-search>`
                : html`<bolle-text-field
                    label=${this.text.filter}
                    type="search"
                    .value=${this._query}
                    @value-input=${onInput}
                  ></bolle-text-field>`
            }
          </div>`;
    return html`${filter}
      <p class="visually-hidden" role="status">
        ${filtering ? fill(this.text.found, { count: found }) : ""}
      </p>
      ${
        filtering && !found
          ? html`<div class="empty">
              <p>${fill(this.text.empty, { query: this._query.trim() })}</p>
              <bolle-button variant="text" @click=${() => (this._query = "")}
                >${this.text.clear}</bolle-button
              >
            </div>`
          : html`<ul class="tree">
              ${this.renderTree(this.items, [], 1)}
            </ul>`
      }`;
  }

  /** Pointer drag on the grip; the sign follows the writing direction. */
  private startResize(event: PointerEvent) {
    if (event.button !== 0) return;
    const grip = event.currentTarget as HTMLElement;
    const rtl = getComputedStyle(this).direction === "rtl";
    const startX = event.clientX;
    const startWidth = this.width;
    grip.setPointerCapture(event.pointerId);
    const move = (moveEvent: PointerEvent) =>
      this.setWidth(startWidth + (moveEvent.clientX - startX) * (rtl ? -1 : 1));
    const stop = () => {
      grip.removeEventListener("pointermove", move);
      grip.removeEventListener("pointerup", stop);
      grip.removeEventListener("pointercancel", stop);
    };
    grip.addEventListener("pointermove", move);
    grip.addEventListener("pointerup", stop);
    grip.addEventListener("pointercancel", stop);
  }

  private resizeWithKeys(event: KeyboardEvent) {
    const rtl = getComputedStyle(this).direction === "rtl";
    const next =
      event.key === (rtl ? "ArrowLeft" : "ArrowRight")
        ? this.width + KEY_STEP
        : event.key === (rtl ? "ArrowRight" : "ArrowLeft")
          ? this.width - KEY_STEP
          : event.key === "Home"
            ? SIDEBAR_MIN_WIDTH
            : event.key === "End"
              ? SIDEBAR_MAX_WIDTH
              : undefined;
    if (next === undefined) return;
    event.preventDefault();
    this.setWidth(next);
  }

  protected render() {
    const width = clampWidth(this.width);
    return html`<nav
      class="surface"
      aria-label=${this.label || nothing}
      style=${this.collapsed ? "" : `inline-size: ${width}px`}
    >
      <header class="header">
        ${this.collapsed ? nothing : html`<div class="brand"><slot name="header"></slot></div>`}
        <bolle-icon-button
          variant="standard"
          label=${this.collapsed ? this.text.expand : this.text.collapse}
          @click=${() => this.setCollapsed(!this.collapsed)}
          >${this.collapsed ? sidebarExpandIcon() : sidebarCollapseIcon()}</bolle-icon-button
        >
      </header>
      <div class="body">
        ${this.collapsed ? this.renderRail() : this.renderTreePanel()}
      </div>
      ${
        this.collapsed
          ? nothing
          : html`<div
              class="grip"
              role="separator"
              tabindex="0"
              aria-orientation="vertical"
              aria-label=${this.text.resize}
              aria-valuemin=${SIDEBAR_MIN_WIDTH}
              aria-valuemax=${SIDEBAR_MAX_WIDTH}
              aria-valuenow=${width}
              aria-valuetext=${`${width} px`}
              @pointerdown=${this.startResize}
              @keydown=${this.resizeWithKeys}
            ></div>`
      }
      <bolle-menu
        menu-label=${this.label}
        @menu-select=${this.onFlyoutSelect}
        @menu-close=${() => (this._flyout = "")}
      ></bolle-menu>
    </nav>`;
  }
}
