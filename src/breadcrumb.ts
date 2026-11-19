import { html, nothing, type PropertyValues } from "lit";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { breadcrumbStyles } from "./breadcrumb.styles.js";
import { breadcrumbLabels, type BreadcrumbLabels } from "./localization.js";
import { nextPageIcon } from "./icons.js";

export interface BreadcrumbItem {
  id: string;
  label: string;
  /** Destination; the current level has none and is not a link. */
  href?: string;
  /** Content before the label, usually an icon. */
  icon?: unknown;
  /** Marks the level the reader is on, even when it is not the last one. */
  current?: boolean;
}

const fill = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );

/**
 * Path from the root of the application to the page the reader is on. The levels
 * the application declares, the current one marked and not linked.
 */
export class BolleBreadcrumb extends BolleElement {
  static properties = {
    items: { attribute: false },
    label: {},
    maxItems: { type: Number, attribute: "max-items" },
    separator: { reflect: true },
    labels: { attribute: false },
    _expanded: { state: true },
  };
  static styles = [commonStyles, breadcrumbStyles];

  items: BreadcrumbItem[] = [];
  /** Accessible name of the navigation. */
  label = "";
  /**
   * Levels kept when the path is long: the first one, an ellipsis and the last
   * ones. 0 keeps every level.
   */
  maxItems = 0;
  separator: "chevron" | "slash" | "none" = "chevron";
  labels: Partial<BreadcrumbLabels> = {};

  private _expanded = false;

  private get text(): BreadcrumbLabels {
    return breadcrumbLabels(
      document.documentElement.lang,
      this.labels as Partial<BreadcrumbLabels>,
    );
  }

  protected willUpdate(changed: PropertyValues<this>) {
    // A new path starts collapsed: the reader has not asked to see all of it yet.
    if (changed.has("items") || changed.has("maxItems")) this._expanded = false;
  }

  private get collapsed() {
    // A path of three levels needs room for the first, the gap and one last level.
    return (
      !this._expanded && this.maxItems >= 3 && this.items.length > this.maxItems
    );
  }

  /** Shown levels: the first, a gap, then the last `maxItems - 1`. */
  private get visible(): Array<BreadcrumbItem | "gap"> {
    if (!this.collapsed) return this.items;
    return [this.items[0], "gap", ...this.items.slice(this.items.length - (this.maxItems - 1))];
  }

  private isCurrent(item: BreadcrumbItem, index: number) {
    return item.current || index === this.items.length - 1;
  }

  private renderSeparator() {
    if (this.separator === "none") return nothing;
    return this.separator === "slash"
      ? html`<span class="separator slash" aria-hidden="true">/</span>`
      : html`<span class="separator chevron" aria-hidden="true">${nextPageIcon()}</span>`;
  }

  protected render() {
    const shown = this.visible;
    return html`<nav aria-label=${this.label || this.text.label}>
      <ol>
        ${shown.map((entry, position) => {
          const item =
            entry === "gap" ? undefined : entry;
          const index = item ? this.items.indexOf(item) : -1;
          const current = item ? this.isCurrent(item, index) : false;
          const content = item
            ? html`${item.icon
                ? html`<span class="icon" aria-hidden="true">${item.icon}</span>`
                : nothing}<span class="txt" dir="auto">${item.label}</span>`
            : html`<button
                class="ellipsis"
                type="button"
                aria-label=${fill(this.text.expand, { count: this.items.length })}
                @click=${() => (this._expanded = true)}
              >
                …
              </button>`;
          return html`<li>
            ${position > 0 ? this.renderSeparator() : nothing}
            ${!item
              ? content
              : current || !item.href
                ? html`<span class="current" aria-current=${current ? "page" : nothing}
                    >${content}</span
                  >`
                : html`<a
                    href=${item.href}
                    @click=${() => this.emit<BreadcrumbItem>("breadcrumb-select", item)}
                    >${content}</a
                  >`}
          </li>`;
        })}
      </ol>
    </nav>`;
  }
}
