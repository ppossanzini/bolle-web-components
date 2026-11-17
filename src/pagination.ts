import { html, nothing } from "lit";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { paginationStyles } from "./pagination.styles.js";
import { paginationLabels, type PaginationLabels } from "./localization.js";
import {
  firstPageIcon,
  lastPageIcon,
  nextPageIcon,
  previousIcon,
} from "./icons.js";

export interface PaginationChangeDetail {
  page: number;
  pageSize: number;
}

const fill = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );

/**
 * Pager of a list the application owns: it reports the page and the size the reader
 * asks for and never slices the data itself.
 */
export class BollePagination extends BolleElement {
  static properties = {
    page: { type: Number },
    pageSize: { type: Number, attribute: "page-size" },
    total: { type: Number },
    pageSizes: { attribute: false },
    form: { reflect: true },
    range: { reflect: true },
    label: {},
    labels: { attribute: false },
    // The numbered window follows the width the pager is given.
    _width: { state: true },
  };
  static styles = [commonStyles, paginationStyles];

  /** Zero-based current page. */
  page = 0;
  /** Rows per page; 0 hides the pager. */
  pageSize = 0;
  /** Number of rows the application holds, not the ones on the page. */
  total = 0;
  /** Sizes offered by the size select; empty hides it. */
  pageSizes: number[] = [];
  /**
   * `full` shows the numbered pages next to the arrows and the size select;
   * `compact` keeps the range with the arrows. In both forms the numbered list
   * gives way to the page number when the container is narrower than 560px.
   */
  form: "full" | "compact" = "full";
  /** `range` is the "12–24 of 248" readout at the start. */
  range: "show" | "none" = "show";
  /** Accessible name of the pagination. */
  label = "";
  labels: Partial<PaginationLabels> = {};

  private _width = 0;
  private observer?: ResizeObserver;

  connectedCallback() {
    super.connectedCallback();
    this.observer = new ResizeObserver(() => {
      this._width = this.clientWidth;
    });
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }

  private get text(): PaginationLabels {
    return paginationLabels(
      document.documentElement.lang,
      this.labels as Partial<PaginationLabels>,
    );
  }

  private get pages() {
    if (!this.pageSize) return 1;
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  private get current() {
    return Math.max(0, Math.min(this.pages - 1, this.page));
  }

  private from() {
    return this.total ? this.current * this.pageSize + 1 : 0;
  }

  private to() {
    return Math.min(this.total, this.from() + this.pageSize - 1);
  }

  private goTo(page: number) {
    const next = Math.max(0, Math.min(this.pages - 1, page));
    if (next === this.current) return;
    this.emit<PaginationChangeDetail>("page-change", {
      page: next,
      pageSize: this.pageSize,
    });
  }

  private changeSize(size: number) {
    if (size === this.pageSize) return;
    this.emit<PaginationChangeDetail>("page-change", { page: 0, pageSize: size });
  }

  /**
   * Window of pages around the current one, with a gap where the sequence breaks:
   * 1 … 4 5 6 … 20. Never wider than the space the pager has.
   */
  private windowPages() {
    const pages = this.pages;
    const current = this.current;
    const width = this._width || this.clientWidth || 720;
    /* The numbered window leaves room for the range and for the rows-per-page choice. */
    const span = width < 760 ? 0 : width < 940 ? 1 : 2;
    const items: Array<number | "gap"> = [];
    const push = (value: number | "gap") => {
      if (items[items.length - 1] !== value) items.push(value);
    };
    push(0);
    if (current - span > 1) push("gap");
    for (let index = Math.max(1, current - span); index <= Math.min(pages - 2, current + span); index++)
      push(index);
    if (current + span < pages - 2) push("gap");
    if (pages > 1) push(pages - 1);
    return items;
  }

  protected render() {
    if (!this.pageSize) return nothing;
    const pages = this.pages;
    const current = this.current;
    const first = current === 0;
    const last = current >= pages - 1;
    return html`<nav
      class="pagination"
      aria-label=${this.label || this.text.label}
    >
      ${this.range === "show"
        ? html`<span class="range"
            >${fill(this.text.range, {
              from: this.from(),
              to: this.to(),
              total: this.total,
            })}</span
          >`
        : nothing}
      ${this.pageSizes.length
        ? html`<span class="size">
            <bolle-select
              class="size-select"
              label=${this.text.perPage}
              .value=${String(this.pageSize)}
              @change=${(event: CustomEvent<{ value: string }>) =>
                this.changeSize(Number(event.detail.value))}
            >
              ${this.pageSizes.map(
                (size) =>
                  html`<option value=${String(size)} ?selected=${size === this.pageSize}>
                    ${size}
                  </option>`,
              )}
            </bolle-select>
          </span>`
        : nothing}
      <div class="pages">
        <bolle-icon-button
          class="first"
          variant="standard"
          size="xs"
          label=${this.text.first}
          ?disabled=${first}
          @click=${() => this.goTo(0)}
          >${firstPageIcon()}</bolle-icon-button
        >
        <bolle-icon-button
          variant="standard"
          size="xs"
          label=${this.text.previous}
          ?disabled=${first}
          @click=${() => this.goTo(current - 1)}
          >${previousIcon()}</bolle-icon-button
        >
        <span class="page-list">
          ${this.windowPages().map((item) =>
            item === "gap"
              ? html`<span class="gap" aria-hidden="true">…</span>`
              : html`<button
                  class="page"
                  type="button"
                  aria-label=${fill(this.text.goTo, { page: item + 1 })}
                  aria-current=${item === current ? "page" : nothing}
                  @click=${() => this.goTo(item)}
                >
                  ${item + 1}
                </button>`,
          )}
        </span>
        <span class="label"
          >${fill(this.text.pageOf, { page: current + 1, pages })}</span
        >
        <bolle-icon-button
          variant="standard"
          size="xs"
          label=${this.text.next}
          ?disabled=${last}
          @click=${() => this.goTo(current + 1)}
          >${nextPageIcon()}</bolle-icon-button
        >
        <bolle-icon-button
          class="last"
          variant="standard"
          size="xs"
          label=${this.text.last}
          ?disabled=${last}
          @click=${() => this.goTo(pages - 1)}
          >${lastPageIcon()}</bolle-icon-button
        >
      </div>
    </nav>`;
  }
}
