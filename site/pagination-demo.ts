import { LitElement, type PropertyValues, html } from "lit";
import "../src/index.js";
import type { PaginationChangeDetail } from "../src/index.js";
import { l, m } from "./i18n.js";

/** Documentation preview: the pager keeps the page the way an application would. */
export class BollePaginationDemo extends LitElement {
  static properties = {
    page: { type: Number },
    pageSize: { type: Number, attribute: "page-size" },
    total: { type: Number },
    form: {},
    pageSizes: { type: Boolean, attribute: "page-sizes" },
    _current: { state: true },
  };

  declare page: number;
  declare pageSize: number;
  declare total: number;
  declare form: "full" | "compact";
  declare pageSizes: boolean;

  declare _current: number;

  constructor() {
    super();
    this.page = 0;
    this.pageSize = 10;
    this.total = 248;
    this.form = "full";
    this.pageSizes = true;
    this._current = 0;
  }

  createRenderRoot() {
    return this;
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has("page")) this._current = this.page;
  }

  private onChange = (event: Event) => {
    const detail = (event as CustomEvent<PaginationChangeDetail>).detail;
    this._current = detail.page;
    this.pageSize = detail.pageSize;
    this.requestUpdate();
  };

  protected render() {
    return html`
      <bolle-pagination
        .page=${this._current}
        .pageSize=${this.pageSize}
        .total=${this.total}
        .pageSizes=${this.pageSizes ? [10, 25, 50, 100] : []}
        .form=${this.form}
        @page-change=${this.onChange}
      ></bolle-pagination>
      <p class="readout">
        ${l(m("Pagina"))} ${this._current + 1} · ${this.pageSize} ${l(m("righe"))} · ${this.total}
        ${l(m("righe in totale"))}
      </p>
    `;
  }
}

if (!customElements.get("demo-pagination"))
  customElements.define("demo-pagination", BollePaginationDemo);
