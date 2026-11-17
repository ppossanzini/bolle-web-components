// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import "../../src/index.js";
import type {
  BolleMenu,
  MenuAction,
  MenuSelectDetail,
} from "../../src/index.js";
import chevronDown from "@tabler/icons/outline/chevron-down.svg?raw";
import collapse from "@tabler/icons/outline/layout-sidebar-left-collapse.svg?raw";
import expand from "@tabler/icons/outline/layout-sidebar-left-expand.svg?raw";
import { navigation, type NavNode } from "./data.js";

const icon = (svg: string) =>
  html`<span class="icon" aria-hidden="true">${unsafeSVG(svg)}</span>`;
const normalize = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const keyOf = (path: string[]) => path.join("/");
const MIN_WIDTH = 220;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 360;
const KEY_STEP = 16;
const clamp = (value: number) =>
  Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value));

function findPath(nodes: NavNode[], ids: string[]): NavNode[] {
  const trail: NavNode[] = [];
  let level = nodes;
  for (const id of ids) {
    const node = level.find((entry) => entry.id === id);
    if (!node) break;
    trail.push(node);
    level = node.children ?? [];
  }
  return trail;
}

/** Light DOM keeps the page stylesheet in charge of the prototype layout. */
class ProtoSidebarApp extends LitElement {
  static properties = {
    collapsed: { state: true },
    query: { state: true },
    current: { state: true },
    expanded: { state: true },
    flyout: { state: true },
    width: { state: true },
    layout: { state: true },
  };
  declare collapsed: boolean;
  declare query: string;
  declare current: string[];
  declare expanded: Set<string>;
  declare flyout: string;
  declare width: number;
  declare layout: "edge" | "card";

  constructor() {
    super();
    this.collapsed = false;
    this.query = "";
    this.current = this.readHash();
    this.expanded = new Set(this.ancestorKeys(this.current));
    this.flyout = "";
    this.width = DEFAULT_WIDTH;
    this.layout = "edge";
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("hashchange", this.onHash);
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.onHash);
    super.disconnectedCallback();
  }

  private readHash() {
    const ids = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    return ids.length ? ids : ["commesse", "attive", "impianti"];
  }

  private ancestorKeys(path: string[]) {
    return path.slice(0, -1).map((_, index) => keyOf(path.slice(0, index + 1)));
  }

  private onHash = () => {
    this.current = this.readHash();
    this.expanded = new Set([
      ...this.expanded,
      ...this.ancestorKeys(this.current),
    ]);
  };

  private toggle(key: string) {
    const next = new Set(this.expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.expanded = next;
  }

  private matches(node: NavNode): boolean {
    const query = normalize(this.query.trim());
    if (!query) return true;
    return (
      normalize(node.label).includes(query) ||
      (node.children ?? []).some((child) => this.matches(child))
    );
  }

  private countMatches(nodes: NavNode[]): number {
    const query = normalize(this.query.trim());
    return nodes.reduce(
      (total, node) =>
        total +
        (normalize(node.label).includes(query) ? 1 : 0) +
        this.countMatches(node.children ?? []),
      0,
    );
  }

  private highlight(label: string): TemplateResult | string {
    const query = normalize(this.query.trim());
    const start = query ? normalize(label).indexOf(query) : -1;
    if (start < 0) return label;
    const end = start + query.length;
    return html`${label.slice(0, start)}<mark>${label.slice(start, end)}</mark>${label.slice(end)}`;
  }

  private count(node: NavNode) {
    return node.count
      ? html`<span class="count" aria-label=${`${node.count} da gestire`}
          >${node.count}</span
        >`
      : nothing;
  }

  private renderTree(
    nodes: NavNode[],
    parents: string[],
    level: number,
  ): unknown {
    const filtering = this.query.trim() !== "";
    return nodes
      .filter((node) => this.matches(node))
      .map((node) => {
        const path = [...parents, node.id];
        const key = keyOf(path);
        const inCurrent = keyOf(this.current).startsWith(`${key}/`);
        if (!node.children)
          return html`<li>
            <a
              class="row level-${level}"
              href=${`#/${key}`}
              aria-current=${keyOf(this.current) === key ? "page" : nothing}
            >
              ${node.icon ? icon(node.icon) : nothing}
              <span class="label">${this.highlight(node.label)}</span>
              ${this.count(node)}
            </a>
          </li>`;
        const open = filtering || this.expanded.has(key);
        return html`<li>
          <button
            class="row group level-${level} ${inCurrent && !open ? "in-current" : ""}"
            aria-expanded=${String(open)}
            aria-controls=${`sub-${key}`}
            @click=${() => this.toggle(key)}
          >
            ${node.icon ? icon(node.icon) : nothing}
            <span class="label">${this.highlight(node.label)}</span>
            ${this.count(node)}
            <span class="chevron" aria-hidden="true"
              >${unsafeSVG(chevronDown)}</span
            >
          </button>
          <ul id=${`sub-${key}`} class="branch" ?hidden=${!open}>
            ${this.renderTree(node.children, path, level + 1)}
          </ul>
        </li>`;
      });
  }

  private menuItems(nodes: NavNode[], parents: string[]): MenuAction[] {
    return nodes.map((node) => {
      const path = [...parents, node.id];
      return {
        id: keyOf(path),
        label: node.label,
        trailingText: node.count ? String(node.count) : undefined,
        children: node.children
          ? this.menuItems(node.children, path)
          : undefined,
      };
    });
  }

  private openFlyout(event: Event, node: NavNode) {
    const menu = this.querySelector<BolleMenu>("#flyout")!;
    menu.items = this.menuItems(node.children ?? [], [node.id]);
    menu.menuLabel = node.label;
    this.flyout = node.id;
    // Beside the rail, aligned with the item, so the menu does not cover the rail.
    const anchor = event.currentTarget as HTMLElement;
    const box = anchor.getBoundingClientRect();
    const rtl = getComputedStyle(anchor).direction === "rtl";
    void menu.show(anchor, {
      x: rtl ? box.left - 8 : box.right + 8,
      y: box.top,
    });
  }

  private onFlyoutSelect(event: CustomEvent<MenuSelectDetail>) {
    if (!event.detail.item.children)
      location.hash = `#/${event.detail.item.id}`;
  }

  /** Pointer drag on the grip; the sign follows the writing direction. */
  private startResize(event: PointerEvent) {
    if (event.button !== 0) return;
    const grip = event.currentTarget as HTMLElement;
    const rtl = getComputedStyle(grip).direction === "rtl";
    const startX = event.clientX;
    const startWidth = this.width;
    grip.setPointerCapture(event.pointerId);
    const move = (moveEvent: PointerEvent) => {
      const delta = (moveEvent.clientX - startX) * (rtl ? -1 : 1);
      this.width = clamp(startWidth + delta);
    };
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
    const rtl =
      getComputedStyle(event.currentTarget as HTMLElement).direction === "rtl";
    const grow = rtl ? "ArrowLeft" : "ArrowRight";
    const shrink = rtl ? "ArrowRight" : "ArrowLeft";
    const next =
      event.key === grow
        ? this.width + KEY_STEP
        : event.key === shrink
          ? this.width - KEY_STEP
          : event.key === "Home"
            ? MIN_WIDTH
            : event.key === "End"
              ? MAX_WIDTH
              : undefined;
    if (next === undefined) return;
    event.preventDefault();
    this.width = clamp(next);
  }

  private renderGrip() {
    return html`<div
      class="grip"
      role="separator"
      tabindex="0"
      aria-orientation="vertical"
      aria-label="Ridimensiona il menu"
      aria-valuemin=${MIN_WIDTH}
      aria-valuemax=${MAX_WIDTH}
      aria-valuenow=${this.width}
      aria-valuetext=${`${this.width} pixel`}
      @pointerdown=${this.startResize}
      @keydown=${this.resizeWithKeys}
    ></div>`;
  }

  private renderRail() {
    const top = this.current[0];
    return html`<ul class="rail">
      ${navigation.map((node) => {
        const active = node.id === top;
        const content = html`<span class="indicator">
            ${node.icon ? icon(node.icon) : nothing}
            ${
              node.count
                ? html`<bolle-badge value=${String(node.count)}></bolle-badge>`
                : nothing
            }
          </span>
          <span class="rail-label">${node.label}</span>`;
        return html`<li>
          ${
            node.children
              ? html`<button
                  class="rail-item ${active ? "active" : ""}"
                  aria-haspopup="menu"
                  aria-expanded=${String(this.flyout === node.id)}
                  aria-label=${node.count ? `${node.label}, ${node.count} da gestire` : node.label}
                  @click=${(event: Event) => this.openFlyout(event, node)}
                >
                  ${content}
                </button>`
              : html`<a
                  class="rail-item ${active ? "active" : ""}"
                  href=${`#/${node.id}`}
                  aria-current=${active ? "page" : nothing}
                >
                  ${content}
                </a>`
          }
        </li>`;
      })}
    </ul>`;
  }

  private renderExpanded() {
    const filtering = this.query.trim() !== "";
    const found = filtering ? this.countMatches(navigation) : 0;
    return html`<div class="filter">
        <bolle-text-field
          label="Filtra il menu"
          type="search"
          .value=${this.query}
          @value-input=${(event: CustomEvent<{ value: string }>) =>
            (this.query = event.detail.value)}
        ></bolle-text-field>
      </div>
      <p class="sr-only" role="status">
        ${filtering ? `${found} voci trovate` : ""}
      </p>
      ${
        filtering && !found
          ? html`<div class="empty">
              <p>Nessuna voce del menu contiene «${this.query.trim()}».</p>
              <bolle-button variant="text" @click=${() => (this.query = "")}
                >Cancella il filtro</bolle-button
              >
            </div>`
          : html`<ul class="tree">
              ${this.renderTree(navigation, [], 1)}
            </ul>`
      }`;
  }

  render() {
    const trail = findPath(navigation, this.current);
    const page = trail.at(-1);
    return html`<div
      class="shell ${this.collapsed ? "collapsed" : ""} ${this.layout}"
      style=${`--sidebar-width: ${this.width}px`}
    >
      <nav class="sidebar" aria-label="Navigazione principale">
        <header class="sidebar-header">
          ${this.collapsed ? nothing : html`<span class="brand">Cantieri&nbsp;Rossi</span>`}
          <bolle-icon-button
            variant="standard"
            label=${this.collapsed ? "Espandi il menu" : "Riduci il menu"}
            @click=${() => {
              this.collapsed = !this.collapsed;
              this.flyout = "";
            }}
            >${icon(this.collapsed ? expand : collapse)}</bolle-icon-button
          >
        </header>
        <div class="sidebar-body">
          ${this.collapsed ? this.renderRail() : this.renderExpanded()}
        </div>
        ${this.collapsed ? nothing : this.renderGrip()}
        <bolle-menu
          id="flyout"
          menu-label="Sottomenu"
          @menu-select=${this.onFlyoutSelect}
          @menu-close=${() => (this.flyout = "")}
        ></bolle-menu>
      </nav>
      <main class="content">
        <ol class="breadcrumb" aria-label="Percorso">
          ${trail.map((node) => html`<li>${node.label}</li>`)}
        </ol>
        <h1>${page?.label ?? "Pagina non trovata"}</h1>
        <bolle-segmented-buttons
          class="layout-switch"
          label="Contenitore della sidebar"
          .items=${[
            { id: "edge", label: "Bordo pagina" },
            { id: "card", label: "Card" },
          ]}
          .value=${this.layout}
          @change=${(event: CustomEvent<{ value: "edge" | "card" }>) =>
            (this.layout = event.detail.value)}
        ></bolle-segmented-buttons>
        <p class="lead">
          ${
            page
              ? "Pagina di destinazione della voce selezionata nella sidebar."
              : "Il percorso dell’indirizzo non corrisponde a nessuna voce del menu."
          }
        </p>
      </main>
    </div>`;
  }
}

customElements.define("proto-sidebar-app", ProtoSidebarApp);
