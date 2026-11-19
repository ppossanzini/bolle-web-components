import { html, nothing, unsafeCSS, type PropertyValues } from "lit";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { dataTableStyles } from "./data-table.styles.js";
import { dataTableLabels, type DataTableLabels } from "./localization.js";
import {
  alertIcon,
  columnGripIcon,
  databaseOffIcon,
  expandIcon,
  pinIcon,
  rowMenuIcon,
  sortArrowDownIcon,
  sortArrowUpIcon,
  sortNoneIcon,
} from "./icons.js";
import type { BolleMenu } from "./menu.js";
import type { MenuEntry, MenuSelectDetail } from "./menu.types.js";

export type DataTableRow = Record<string, unknown>;

export interface DataTableColumn {
  /** Field of the row read by the default cell, by the sorting and by the grouping. */
  key: string;
  label: string;
  /** Cell width in pixels; the reader can resize it. */
  width?: number;
  align?: "start" | "end";
  /** The column can be used with `groupBy`. */
  groupable?: boolean;
  pinned?: boolean;
  hidden?: boolean;
  sortable?: boolean;
  /** Text of the cell when the row holds something other than a string. */
  value?: (row: DataTableRow) => string | number | null | undefined;
  /** Cell content, replacing the default text. */
  render?: (row: DataTableRow, table: BolleDataTable) => unknown;
}

export interface DataTableSort {
  key: string;
  dir: "asc" | "desc";
}

export interface DataTableSortDetail {
  sort: DataTableSort[];
}

export interface DataTableColumnChangeDetail {
  columns: DataTableColumn[];
}

export interface DataTablePageDetail {
  page: number;
  pageSize: number;
}

export interface DataTableSelectDetail {
  selected: string[];
  rows: DataTableRow[];
}

export interface DataTableExpandDetail {
  expanded: string[];
  row: DataTableRow;
}

export interface DataTableRowDetail {
  row: DataTableRow;
}

export interface DataTableRowActionDetail {
  id: string;
  row: DataTableRow;
}

export type DataTableRowRenderer = (
  row: DataTableRow,
  table: BolleDataTable,
) => unknown;
export type DataTableHeaderRenderer = (
  column: DataTableColumn,
  table: BolleDataTable,
) => unknown;
export type DataTableGroupRenderer = (
  name: string,
  rows: DataTableRow[],
  table: BolleDataTable,
) => unknown;
export type DataTableStateRenderer = (table: BolleDataTable) => unknown;
/** Called after the reader asked for a different order; may return a promise. */
export type DataTableSortCallback = (
  detail: DataTableSortDetail,
) => void | Promise<unknown>;
/** Called after the reader asked for a different page; may return a promise. */
export type DataTablePageCallback = (
  detail: DataTablePageDetail,
) => void | Promise<unknown>;
/** Called after the columns changed; may return a promise. */
export type DataTableColumnCallback = (
  detail: DataTableColumnChangeDetail,
) => void | Promise<unknown>;

type VirtualItem =
  | { key: string; kind: "row"; row: DataTableRow }
  | { key: string; kind: "detail"; row: DataTableRow }
  | {
      key: string;
      kind: "group";
      name: string;
      rows: DataTableRow[];
    };

const SELECT_WIDTH = 52;
const EXPAND_WIDTH = 44;
const ACTIONS_WIDTH = 56;
const KEY_STEP = 16;

const fill = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );

/**
 * Table of rows the application owns: the component renders the columns,
 * reports every sorting, paging, selection, expansion and column change in an
 * event and in an optional callback, and never filters the data itself. Sorting
 * and paging happen on `rows` unless `sortHandler` or `pageHandler` take them over.
 */
export class BolleDataTable extends BolleElement {
  static properties = {
    label: {},
    columns: { attribute: false },
    rows: { attribute: false },
    rowKey: { attribute: "row-key" },
    selectable: { type: Boolean, reflect: true },
    selected: { attribute: false },
    sort: { attribute: false },
    groupBy: { attribute: "group-by", reflect: true },
    groupSummary: { attribute: false },
    expandable: { type: Boolean, reflect: true },
    expanded: { attribute: false },
    detail: { attribute: false },
    rowActions: { attribute: false },
    page: { type: Number },
    pageSize: { type: Number, attribute: "page-size" },
    total: { type: Number },
    density: { reflect: true },
    variant: { reflect: true },
    virtual: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    error: { reflect: true },
    emptyLabel: { attribute: "empty-label" },
    contentStyles: { attribute: false },
    labels: { attribute: false },
    updating: { type: Boolean, reflect: true },
    rowHeight: { attribute: "row-height", type: Number },
    compactRowHeight: { attribute: "compact-row-height", type: Number },
    headerHeight: { attribute: "header-height", type: Number },
    groupHeight: { attribute: "group-height", type: Number },
    defaultColumnWidth: { attribute: "default-column-width", type: Number },
    minColumnWidth: { attribute: "min-column-width", type: Number },
    maxColumnWidth: { attribute: "max-column-width", type: Number },
    overscan: { type: Number },
    rowRenderer: { attribute: false },
    headerRenderer: { attribute: false },
    groupRenderer: { attribute: false },
    loadingRenderer: { attribute: false },
    errorRenderer: { attribute: false },
    emptyRenderer: { attribute: false },
    footerRenderer: { attribute: false },
    sortHandler: { attribute: false },
    pageHandler: { attribute: false },
    columnHandler: { attribute: false },
    _collapsed: { state: true },
    _windowStart: { state: true },
    _windowEnd: { state: true },
    _virtualVersion: { state: true },
    _scrolledX: { state: true },
    _dragging: { state: true },
    _announcement: { state: true },
  };
  static styles = [commonStyles, dataTableStyles];

  /** Accessible name of the table. */
  label = "";
  columns: DataTableColumn[] = [];
  rows: DataTableRow[] = [];
  rowKey = "id";
  selectable = false;
  selected: string[] = [];
  /** Current order: the table replaces it every time the reader clicks a header. */
  sort: DataTableSort[] = [];
  groupBy = "";
  /** Content of the group header, beyond the count. */
  groupSummary?: (rows: DataTableRow[]) => unknown;
  expandable = false;
  expanded: string[] = [];
  /** Content of the row opened by the expander. */
  detail?: (row: DataTableRow) => unknown;
  rowActions: MenuEntry[] = [];
  /** Requested page, from zero. With `pageHandler` it is the page the application loaded. */
  page = 0;
  /** Rows per page. From one up the table shows the pager and cuts `rows` itself. */
  pageSize = 0;
  /** Rows of the whole dataset when the application loads one page at a time. */
  total = 0;
  density: "comfortable" | "compact" = "comfortable";
  variant: "card" | "free" = "card";
  virtual = false;
  loading = false;
  /** Text shown instead of the rows when they cannot be loaded. */
  error = "";
  /**
   * CSS for the markup returned by `render`, `detail` and `groupSummary`. Those
   * functions run inside the table shadow root, where the page stylesheet does
   * not reach; pass their rules here as a string.
   */
  contentStyles = "";
  emptyLabel = "";
  /** Replaces the built-in texts. */
  labels: Partial<DataTableLabels> = {};
  /** Keeps the rows visible, dimmed, while the application fetches new ones. */
  updating = false;
  rowHeight = 52;
  compactRowHeight = 40;
  headerHeight = 52;
  groupHeight = 48;
  defaultColumnWidth = 168;
  minColumnWidth = 88;
  maxColumnWidth = 560;
  overscan = 8;
  rowRenderer?: DataTableRowRenderer;
  headerRenderer?: DataTableHeaderRenderer;
  groupRenderer?: DataTableGroupRenderer;
  loadingRenderer?: DataTableStateRenderer;
  errorRenderer?: DataTableStateRenderer;
  emptyRenderer?: DataTableStateRenderer;
  footerRenderer?: DataTableStateRenderer;
  /**
   * Loads the data again after the reader changed the order. When it is absent
   * the table sorts the rows it holds. It runs before the `sort` event and the
   * table redraws once it has finished, so an in-place edit of `rows` is shown.
   */
  sortHandler?: DataTableSortCallback;
  /**
   * Loads the page the reader asked for. When it is absent the table pages the
   * rows it holds. It runs before the `page-change` event and the table redraws
   * once it has finished.
   */
  pageHandler?: DataTablePageCallback;
  /**
   * Stores the layout when the application keeps it somewhere else. The table
   * applies the new columns first and redraws once the promise has finished.
   */
  columnHandler?: DataTableColumnCallback;

  private _collapsed = new Set<string>();
  private _windowStart = 0;
  private _windowEnd = 40;
  private _virtualVersion = 0;
  private _scrolledX = false;
  private _dragging = "";
  private _announcement = "";
  private drag?: {
    key: string;
    startX: number;
    dx: number;
    target: number;
    cancelled: boolean;
  };
  private menuContext?:
    { kind: "column"; key: string } | { kind: "row"; row: DataTableRow };
  private resizeObserver?: ResizeObserver;
  private scrollerObserver?: ResizeObserver;
  private observedScroller?: HTMLElement;
  private virtualHeights = new Map<string, number>();

  private get text(): DataTableLabels {
    return dataTableLabels(document.documentElement.lang, this.labels);
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (
      changed.has("rows") ||
      changed.has("groupBy") ||
      changed.has("expanded") ||
      changed.has("density") ||
      changed.has("detail")
    ) {
      this.resetWindow();
      this.virtualHeights.clear();
    }
    if (changed.has("rows") && !this.appPages && this.page > this.lastPage)
      this.page = this.lastPage;
  }

  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => this.measureWindow());
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.scrollerObserver?.disconnect();
    super.disconnectedCallback();
  }

  protected updated() {
    const scroller = this.scroller;
    if (!scroller) return;
    if (this.observedScroller !== scroller) {
      this.scrollerObserver?.disconnect();
      this.scrollerObserver = new ResizeObserver(() => this.measureVisible());
      this.scrollerObserver.observe(scroller);
      this.observedScroller = scroller;
    }
    this.measureVisible();
    requestAnimationFrame(() => {
      if (!this.isConnected) return;
      this.measureVirtualRows();
      this.measureWindow();
    });
  }

  private get scroller() {
    return this.renderRoot.querySelector<HTMLElement>(".scroller");
  }

  /** Group headers and details span what the reader sees, not the whole table. */
  private measureVisible() {
    const scroller = this.scroller;
    if (!scroller) return;
    scroller.style.setProperty("--table-visible", `${scroller.clientWidth}px`);
  }

  private rowId(row: DataTableRow) {
    const value = row[this.rowKey];
    return value === undefined || value === null ? "" : String(value);
  }

  private valueOf(column: DataTableColumn, row: DataTableRow) {
    if (column.value) return column.value(row);
    const value = row[column.key];
    return typeof value === "number" || typeof value === "string" ? value : "";
  }

  private get visibleColumns() {
    const shown = this.columns.filter((column) => !column.hidden);
    return [
      ...shown.filter((column) => column.pinned),
      ...shown.filter((column) => !column.pinned),
    ];
  }

  private width(column: DataTableColumn) {
    return column.width ?? this.defaultColumnWidth;
  }

  private pinnedOffset(key: string) {
    let offset = this.selectable ? SELECT_WIDTH : 0;
    if (this.expandable) offset += EXPAND_WIDTH;
    for (const column of this.visibleColumns) {
      if (column.key === key) return offset;
      if (column.pinned) offset += this.width(column);
    }
    return offset;
  }

  private get lastPinned() {
    return [...this.visibleColumns].reverse().find((column) => column.pinned)
      ?.key;
  }

  /* Data: order, page, groups and the virtual window -------------------- */

  /** The application loads and sorts the rows itself, so the table keeps their order. */
  private get appSorts() {
    return typeof this.sortHandler === "function";
  }

  /** The application loads one page at a time, so the table shows what it receives. */
  private get appPages() {
    return typeof this.pageHandler === "function";
  }

  /** Rows in the order the reader asked for, on all the data the table holds. */
  private get sortedRows() {
    if (this.appSorts || !this.sort.length) return this.rows;
    const orders = this.sort
      .map((item) => ({
        column: this.columns.find((column) => column.key === item.key),
        dir: item.dir,
      }))
      .filter((order) => order.column && order.column.sortable !== false);
    if (!orders.length) return this.rows;
    const collator = new Intl.Collator(document.documentElement.lang || "it", {
      numeric: true,
      sensitivity: "base",
    });
    const compare = (a: unknown, b: unknown) => {
      const emptyA = a === null || a === undefined || a === "";
      const emptyB = b === null || b === undefined || b === "";
      if (emptyA || emptyB) return emptyA === emptyB ? 0 : emptyA ? 1 : -1;
      if (typeof a === "number" && typeof b === "number") return a - b;
      return collator.compare(String(a), String(b));
    };
    return [...this.rows].sort((left, right) => {
      for (const { column, dir } of orders) {
        const result = compare(
          this.valueOf(column!, left),
          this.valueOf(column!, right),
        );
        if (result) return dir === "asc" ? result : -result;
      }
      return 0;
    });
  }

  private get lastPage() {
    if (!this.pageSize) return 0;
    return Math.max(0, Math.ceil(this.rows.length / this.pageSize) - 1);
  }

  /**
   * Requested page. The table keeps it inside the pages its own data has; a page
   * loaded by the application is taken as it comes.
   */
  private get currentPage() {
    const page = Math.max(0, this.page);
    return this.appPages ? page : Math.min(page, this.lastPage);
  }

  /** Rows on screen: sorted, then cut to the current page. */
  private get data() {
    if (this.appPages) return this.rows;
    const rows = this.sortedRows;
    if (!this.pageSize) return rows;
    const start = this.currentPage * this.pageSize;
    return rows.slice(start, start + this.pageSize);
  }

  private groupName(row: DataTableRow) {
    const column = this.columns.find((item) => item.key === this.groupBy);
    if (!column) return "";
    const value = this.valueOf(column, row);
    return value === null || value === undefined ? "" : String(value);
  }

  private get groups() {
    if (!this.groupBy) return [];
    const map = new Map<string, DataTableRow[]>();
    for (const row of this.data) {
      const name = this.groupName(row);
      map.set(name, [...(map.get(name) ?? []), row]);
    }
    return [...map.entries()];
  }

  private get effectiveRowHeight() {
    return this.density === "compact" ? this.compactRowHeight : this.rowHeight;
  }

  private get virtualWindowed() {
    return this.virtual;
  }

  /**
   * Redraws the rows after the application changed its array in place. A
   * reassignment with the same reference does not reach the component, because
   * the property keeps its identity.
   */
  refresh() {
    this.virtualHeights.clear();
    this.resetWindow();
    this.requestUpdate();
  }

  private resetWindow() {
    this._windowStart = 0;
    this._windowEnd = 40;
  }

  private get virtualItems(): VirtualItem[] {
    const items: VirtualItem[] = [];
    const pushRow = (row: DataTableRow) => {
      const id = this.rowId(row);
      items.push({ key: `row:${id}`, kind: "row", row });
      if (this.expanded.includes(id) && this.detail)
        items.push({ key: `detail:${id}`, kind: "detail", row });
    };
    if (!this.groupBy) {
      for (const row of this.data) pushRow(row);
      return items;
    }
    for (const [name, rows] of this.groups) {
      items.push({ key: `group:${name}`, kind: "group", name, rows });
      if (this._collapsed.has(name)) continue;
      for (const row of rows) pushRow(row);
    }
    return items;
  }

  private estimatedHeight(item: VirtualItem) {
    if (item.kind === "row") return this.effectiveRowHeight;
    return item.kind === "group" ? (this.density === "compact" ? 40 : 48) : 120;
  }

  private itemHeight(item: VirtualItem) {
    return this.virtualHeights.get(item.key) ?? this.estimatedHeight(item);
  }

  private itemOffset(items: VirtualItem[], end: number) {
    let offset = 0;
    for (let index = 0; index < end; index += 1)
      offset += this.itemHeight(items[index]);
    return offset;
  }

  private measureVirtualRows() {
    if (!this.virtualWindowed) return;
    let changed = false;
    for (const element of this.renderRoot.querySelectorAll<HTMLElement>(
      "tr[data-virtual-key]",
    )) {
      const key = element.dataset.virtualKey;
      const height = element.getBoundingClientRect().height;
      if (
        key &&
        height > 0 &&
        Math.abs((this.virtualHeights.get(key) ?? 0) - height) > 0.5
      ) {
        this.virtualHeights.set(key, height);
        changed = true;
      }
    }
    if (changed) this._virtualVersion += 1;
  }

  private measureWindow = () => {
    const scroller = this.scroller;
    if (!scroller || !this.virtualWindowed) return;
    const items = this.virtualItems;
    const overscan = this.effectiveRowHeight * this.overscan;
    const top = Math.max(0, scroller.scrollTop - overscan);
    const bottom = scroller.scrollTop + scroller.clientHeight + overscan;
    let offset = 0;
    let start = items.length;
    let end = items.length;
    for (let index = 0; index < items.length; index += 1) {
      const next = offset + this.itemHeight(items[index]);
      if (start === items.length && next > top) start = index;
      if (next >= bottom) {
        end = index + 1;
        break;
      }
      offset = next;
    }
    start = Math.min(start, Math.max(0, items.length - 1));
    if (start !== this._windowStart) this._windowStart = start;
    if (end !== this._windowEnd) this._windowEnd = end;
  };

  private onScroll = (event: Event) => {
    const scroller = event.currentTarget as HTMLElement;
    const scrolled = Math.abs(scroller.scrollLeft) > 0;
    if (scrolled !== this._scrolledX) this._scrolledX = scrolled;
    if (this.virtualWindowed) requestAnimationFrame(this.measureWindow);
  };

  /* Sorting, selection, paging ---------------------------------------- */

  private newSort(key: string, additive: boolean): DataTableSort[] {
    const current = this.sort.find((item) => item.key === key);
    if (!additive)
      return [
        {
          key,
          dir: current?.dir === "asc" ? "desc" : "asc",
        },
      ];
    if (!current) return [...this.sort, { key, dir: "asc" }];
    return this.sort.map((item) =>
      item.key === key
        ? {
            key,
            dir: item.dir === "asc" ? ("desc" as const) : ("asc" as const),
          }
        : item,
    );
  }

  /** Header click and column menu: asc then desc, on the same key. */
  private toggleSort(column: DataTableColumn, event: MouseEvent) {
    if (column.sortable === false) return;
    void this.applySort(this.newSort(column.key, event.shiftKey));
  }

  /**
   * Hands the new order to the application when it loads the data, then redraws
   * so an in-place change to `rows` is shown. Otherwise the table sorts them.
   */
  private async applySort(sort: DataTableSort[]) {
    this.sort = sort;
    if (!this.appPages && this.page) this.page = 0;
    this.announce(
      sort.length
        ? sort
            .map(
              (item) =>
                `${this.labelOf(item.key)} ${item.dir === "asc" ? this.text.sortAscending.toLowerCase() : this.text.sortDescending.toLowerCase()}`,
            )
            .join(", ")
        : this.text.sortNone,
    );
    this.emit<DataTableSortDetail>("sort", { sort });
    if (!this.sortHandler) return;
    await this.sortHandler({ sort });
    this.refresh();
  }

  /**
   * Shows the page the reader asked for. The application loads it when it
   * declared `pageHandler`, then the table redraws; otherwise the table cuts
   * `rows`. The `page-change` event of the pager already leaves the component,
   * so it is not repeated here.
   */
  private async applyPage(detail: DataTablePageDetail) {
    const pageSize = detail.pageSize || this.pageSize;
    const page = detail.page;
    if (pageSize !== this.pageSize) this.pageSize = pageSize;
    if (page !== this.page) this.page = page;
    if (!this.pageHandler) return;
    await this.pageHandler({ page, pageSize });
    this.refresh();
  }

  private labelOf(key: string) {
    return this.columns.find((column) => column.key === key)?.label ?? key;
  }

  private toggleRow(row: DataTableRow, checked: boolean) {
    const id = this.rowId(row);
    const next = new Set(this.selected);
    if (checked) next.add(id);
    else next.delete(id);
    this.emitSelect([...next]);
  }

  private get pageKeys() {
    return this.data.map((row) => this.rowId(row));
  }

  private get pageState() {
    const keys = this.pageKeys;
    const chosen = keys.filter((key) => this.selected.includes(key)).length;
    return { keys, chosen, all: keys.length > 0 && chosen === keys.length };
  }

  private togglePage(checked: boolean) {
    const next = new Set(this.selected);
    for (const key of this.pageKeys) {
      if (checked) next.add(key);
      else next.delete(key);
    }
    this.emitSelect([...next]);
  }

  /** Applies the choice, then reports it: the table does not wait for the application. */
  private emitSelect(selected: string[]) {
    this.selected = selected;
    this.emit<DataTableSelectDetail>("select", {
      selected,
      rows: this.rows.filter((row) => selected.includes(this.rowId(row))),
    });
    this.announce(fill(this.text.selected, { count: selected.length }));
  }

  private toggleExpanded(row: DataTableRow) {
    const id = this.rowId(row);
    const next = this.expanded.includes(id)
      ? this.expanded.filter((key) => key !== id)
      : [...this.expanded, id];
    this.expanded = next;
    this.emit<DataTableExpandDetail>("expand", { expanded: next, row });
    this.announce(
      fill(next.includes(id) ? this.text.expandRow : this.text.collapseRow, {
        row: id,
      }),
    );
  }

  private get columnCount() {
    return (
      this.visibleColumns.length +
      (this.selectable ? 1 : 0) +
      (this.expandable ? 1 : 0) +
      (this.rowActions.length ? 1 : 0)
    );
  }

  /* Columns ----------------------------------------------------------- */

  private patchColumn(key: string, patch: Partial<DataTableColumn>) {
    void this.applyColumns(
      this.columns.map((column) =>
        column.key === key ? { ...column, ...patch } : column,
      ),
    );
  }

  /**
   * Applies the new set of columns, then reports it and hands it to
   * `columnHandler` when the application keeps the layout somewhere else.
   */
  private async applyColumns(columns: DataTableColumn[]) {
    this.columns = columns;
    this.emit<DataTableColumnChangeDetail>("column-change", { columns });
    if (!this.columnHandler) return;
    await this.columnHandler({ columns });
    this.refresh();
  }

  /** Moves a column by one step inside its zone; pinned and free do not mix. */
  private moveColumn(key: string, step: -1 | 1) {
    const order = this.visibleColumns;
    const index = order.findIndex((column) => column.key === key);
    const target = index + step;
    const column = order[index];
    if (
      !column ||
      target < 0 ||
      target >= order.length ||
      Boolean(order[target].pinned) !== Boolean(column.pinned)
    ) {
      this.announce(fill(this.text.moveBlocked, { column: this.labelOf(key) }));
      return;
    }
    this.placeColumn(key, order[target].key);
    this.announce(
      fill(this.text.moved, {
        column: this.labelOf(key),
        index: target + 1,
        count: order.length,
      }),
    );
  }

  private moveColumnToEdge(key: string, edge: "start" | "end") {
    const order = this.visibleColumns;
    const column = order.find((item) => item.key === key);
    if (!column) return;
    const zone = order.filter(
      (item) => Boolean(item.pinned) === Boolean(column.pinned),
    );
    const target = edge === "start" ? zone[0] : zone.at(-1);
    if (!target || target.key === key) return;
    this.placeColumn(key, target.key);
    const position = order.findIndex((item) => item.key === target.key) + 1;
    this.announce(
      fill(this.text.moved, {
        column: column.label,
        index: position,
        count: order.length,
      }),
    );
  }

  private placeColumn(key: string, targetKey: string) {
    if (key === targetKey) return;
    const columns = [...this.columns];
    const from = columns.findIndex((column) => column.key === key);
    const to = columns.findIndex((column) => column.key === targetKey);
    const [moved] = columns.splice(from, 1);
    columns.splice(to, 0, moved);
    void this.applyColumns(columns);
  }

  private togglePinned(key: string) {
    const column = this.columns.find((item) => item.key === key);
    if (!column) return;
    this.patchColumn(key, { pinned: !column.pinned });
    this.announce(
      fill(column.pinned ? this.text.unpinned : this.text.pinned, {
        column: column.label,
      }),
    );
  }

  private toggleHidden(key: string) {
    const column = this.columns.find((item) => item.key === key);
    if (!column) return;
    if (!column.hidden && this.visibleColumns.length <= 1) return;
    this.patchColumn(key, { hidden: !column.hidden });
    this.announce(
      fill(column.hidden ? this.text.shown : this.text.hidden, {
        column: column.label,
      }),
    );
  }

  private startResize(event: PointerEvent, column: DataTableColumn) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLElement;
    const rtl = getComputedStyle(this).direction === "rtl";
    const startX = event.clientX;
    const startWidth = this.width(column);
    handle.setPointerCapture(event.pointerId);
    let current = startWidth;
    const move = (moveEvent: PointerEvent) => {
      current = Math.round(
        Math.min(
          this.maxColumnWidth,
          Math.max(
            this.minColumnWidth,
            startWidth + (moveEvent.clientX - startX) * (rtl ? -1 : 1),
          ),
        ),
      );
      const th = this.renderRoot.querySelector<HTMLElement>(
        `th[data-key="${column.key}"]`,
      );
      if (th) th.style.inlineSize = `${current}px`;
    };
    const stop = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
      if (current !== startWidth)
        this.patchColumn(column.key, { width: current });
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  }

  private resizeWithKeys(event: KeyboardEvent, column: DataTableColumn) {
    const rtl = getComputedStyle(this).direction === "rtl";
    const grow = rtl ? "ArrowLeft" : "ArrowRight";
    const shrink = rtl ? "ArrowRight" : "ArrowLeft";
    const width = this.width(column);
    const next =
      event.key === grow
        ? width + KEY_STEP
        : event.key === shrink
          ? width - KEY_STEP
          : event.key === "Home"
            ? this.minColumnWidth
            : event.key === "End"
              ? this.maxColumnWidth
              : event.key === "Enter"
                ? this.defaultColumnWidth
                : undefined;
    if (next === undefined) return;
    event.preventDefault();
    this.patchColumn(column.key, {
      width: Math.min(this.maxColumnWidth, Math.max(this.minColumnWidth, next)),
    });
  }

  /** Drag on the header: the cell follows the pointer and Esc cancels. */
  private startDrag(event: PointerEvent, column: DataTableColumn) {
    if (event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    const order = this.visibleColumns;
    const index = order.findIndex((item) => item.key === column.key);
    handle.setPointerCapture(event.pointerId);
    this.drag = {
      key: column.key,
      startX: event.clientX,
      dx: 0,
      target: index,
      cancelled: false,
    };
    this._dragging = column.key;
    const move = (moveEvent: PointerEvent) => {
      const drag = this.drag;
      if (!drag) return;
      let target = drag.target;
      for (const cell of this.renderRoot.querySelectorAll<HTMLElement>(
        "th[data-key]",
      )) {
        const current = order.find((item) => item.key === cell.dataset.key);
        if (!current || Boolean(current.pinned) !== Boolean(column.pinned))
          continue;
        const box = cell.getBoundingClientRect();
        if (moveEvent.clientX > box.left && moveEvent.clientX < box.right)
          target = order.findIndex((item) => item.key === cell.dataset.key);
      }
      this.drag = { ...drag, dx: moveEvent.clientX - drag.startX, target };
    };
    const keys = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key !== "Escape" || !this.drag) return;
      this.drag = { ...this.drag, cancelled: true };
      stop();
      this.announce(fill(this.text.moveCancelled, { column: column.label }));
    };
    const stop = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
      window.removeEventListener("keydown", keys, true);
      const drag = this.drag;
      this.drag = undefined;
      this._dragging = "";
      if (!drag || drag.cancelled) return;
      const target = order[drag.target];
      if (target && target.key !== drag.key) {
        this.placeColumn(drag.key, target.key);
        this.announce(
          fill(this.text.moved, {
            column: column.label,
            index: drag.target + 1,
            count: order.length,
          }),
        );
      }
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
    window.addEventListener("keydown", keys, true);
  }

  /* Menus ------------------------------------------------------------- */

  private get menu() {
    return this.renderRoot.querySelector<BolleMenu>("bolle-menu");
  }

  private openMenu(
    anchor: HTMLElement,
    items: MenuEntry[],
    context: NonNullable<BolleDataTable["menuContext"]>,
    label: string,
  ) {
    const menu = this.menu;
    if (!menu) return;
    menu.items = items;
    menu.menuLabel = label;
    menu.selectionMode = "none";
    this.menuContext = context;
    void menu.show(anchor);
  }

  private columnMenu(event: Event, column: DataTableColumn) {
    const sort = this.sort.find((item) => item.key === column.key);
    const order = this.visibleColumns;
    const index = order.findIndex((item) => item.key === column.key);
    const items: MenuEntry[] = [
      {
        id: "asc",
        label: this.text.sortAscending,
        selected: sort?.dir === "asc",
        disabled: column.sortable === false,
      },
      {
        id: "desc",
        label: this.text.sortDescending,
        selected: sort?.dir === "desc",
        disabled: column.sortable === false,
      },
      ...(sort ? [{ id: "unsort", label: this.text.sortNone }] : []),
      { separator: true },
      ...(column.groupable
        ? [
            {
              id: this.groupBy === column.key ? "ungroup" : "group",
              label:
                this.groupBy === column.key
                  ? this.text.ungroup
                  : fill(this.text.groupBy, {
                      column: column.label.toLowerCase(),
                    }),
            },
          ]
        : []),
      {
        id: "pin",
        label: column.pinned ? this.text.unpin : this.text.pin,
      },
      {
        id: "start",
        label: this.text.moveStart,
        disabled:
          index === 0 ||
          Boolean(order[index - 1]?.pinned) !== Boolean(column.pinned),
      },
      {
        id: "end",
        label: this.text.moveEnd,
        disabled:
          index === order.length - 1 ||
          Boolean(order[index + 1]?.pinned) !== Boolean(column.pinned),
      },
      { separator: true },
      {
        id: "hide",
        label: column.hidden ? this.text.showColumn : this.text.hideColumn,
        disabled: !column.hidden && this.visibleColumns.length <= 1,
      },
    ];
    this.openMenu(
      event.currentTarget as HTMLElement,
      items,
      { kind: "column", key: column.key },
      fill(this.text.column, { column: column.label }),
    );
  }

  private rowMenu(event: Event, row: DataTableRow) {
    event.stopPropagation();
    const id = this.rowId(row);
    this.openMenu(
      event.currentTarget as HTMLElement,
      this.rowActions,
      { kind: "row", row },
      fill(this.text.rowActions, { row: id }),
    );
  }

  private onMenuSelect(event: CustomEvent<MenuSelectDetail>) {
    const context = this.menuContext;
    const id = event.detail.item.id;
    if (!context) return;
    if (context.kind === "row") {
      this.emit<DataTableRowActionDetail>("row-action", {
        id,
        row: context.row,
      });
      return;
    }
    const column = this.columns.find((item) => item.key === context.key);
    if (!column) return;
    if (id === "asc" || id === "desc")
      void this.applySort([{ key: column.key, dir: id }]);
    else if (id === "unsort")
      void this.applySort(this.sort.filter((item) => item.key !== column.key));
    else if (id === "pin") this.togglePinned(column.key);
    else if (id === "start") this.moveColumnToEdge(column.key, "start");
    else if (id === "end") this.moveColumnToEdge(column.key, "end");
    else if (id === "hide") this.toggleHidden(column.key);
    else if (id === "group" || id === "ungroup") {
      const groupBy = id === "group" ? column.key : "";
      this.groupBy = groupBy;
      if (!this.appPages && this.page) this.page = 0;
      this.emit("group", { groupBy });
    }
  }

  /* Rendering --------------------------------------------------------- */

  private announce(message: string) {
    this._announcement = "";
    requestAnimationFrame(() => (this._announcement = message));
  }

  private cell(column: DataTableColumn, row: DataTableRow) {
    if (column.render) return column.render(row, this);
    const value = this.valueOf(column, row);
    return value === null || value === undefined ? "" : value;
  }

  private renderHeader() {
    const order = this.visibleColumns;
    const selection = this.pageState;
    const lastPinned = this.lastPinned;
    const sort = (key: string) => this.sort.find((item) => item.key === key);
    return html`<thead part="header">
      <tr part="header-row">
        ${
          this.selectable
            ? html` <th
                class="select cell-pinned"
                scope="col"
                style="inset-inline-start:0"
              >
                <bolle-checkbox
                  .checked=${selection.all}
                  .indeterminate=${selection.chosen > 0 && !selection.all}
                  ?disabled=${!selection.keys.length}
                  @change=${(event: CustomEvent<{ checked: boolean }>) =>
                    this.togglePage(event.detail.checked)}
                  ><span class="sr-only"
                    >${this.text.selectPage}</span
                  ></bolle-checkbox
                >
              </th>`
            : nothing
        }
        ${
          this.expandable
            ? html`<th
                class="expand cell-pinned ${lastPinned ? "" : "pinned-edge"}"
                scope="col"
                style=${this.selectable ? `inset-inline-start:${SELECT_WIDTH}px` : "inset-inline-start:0"}
              >
                <span class="sr-only">${this.text.details}</span>
              </th>`
            : nothing
        }
        ${order.map((column) => {
          const current = sort(column.key);
          const rank = this.sort.findIndex((item) => item.key === column.key);
          const dragging = this._dragging === column.key;
          return html`<th
            scope="col"
            data-key=${column.key}
            part=${column.pinned ? "header-cell header-cell-pinned" : "header-cell"}
            class="data ${column.align === "end" ? "end" : ""} ${column.pinned ? "cell-pinned" : ""} ${column.key === lastPinned ? "pinned-edge" : ""} ${dragging ? "dragging" : ""}"
            style=${column.pinned ? `inset-inline-start:${this.pinnedOffset(column.key)}px` : ""}
            aria-sort=${
              current
                ? current.dir === "asc"
                  ? "ascending"
                  : "descending"
                : nothing
            }
          >
            <div class="head" part="header-content">
              <span
                class="grip"
                part="column-grip"
                aria-hidden="true"
                @pointerdown=${(event: PointerEvent) => this.startDrag(event, column)}
                >${columnGripIcon()}</span
              >
              ${
                column.sortable === false
                  ? html`<span class="sort static"
                      ><span class="ellipsis" part="header-label"
                        >${
                          this.headerRenderer
                            ? this.headerRenderer(column, this)
                            : column.label
                        }</span
                      ></span
                    >`
                  : html`<button
                      class="sort"
                      part="sort"
                      aria-describedby="table-sort-hint"
                      @click=${(event: MouseEvent) => this.toggleSort(column, event)}
                      @keydown=${(event: KeyboardEvent) => {
                        if (!event.altKey) return;
                        const rtl = getComputedStyle(this).direction === "rtl";
                        if (
                          event.key !== "ArrowLeft" &&
                          event.key !== "ArrowRight"
                        )
                          return;
                        event.preventDefault();
                        this.moveColumn(
                          column.key,
                          (event.key === "ArrowLeft") !== rtl ? -1 : 1,
                        );
                        void this.updateComplete.then(() =>
                          this.renderRoot
                            .querySelector<HTMLElement>(
                              `th[data-key="${column.key}"] .sort`,
                            )
                            ?.focus(),
                        );
                      }}
                    >
                      <span class="ellipsis" part="header-label"
                        >${
                          this.headerRenderer
                            ? this.headerRenderer(column, this)
                            : column.label
                        }</span
                      >
                      <span
                        class="sort-mark ${current ? "on" : ""}"
                        part="sort-mark"
                      >
                        ${
                          current
                            ? current.dir === "asc"
                              ? sortArrowUpIcon()
                              : sortArrowDownIcon()
                            : sortNoneIcon()
                        }
                        ${
                          current && this.sort.length > 1
                            ? html`<span class="rank">${rank + 1}</span>`
                            : nothing
                        }
                      </span>
                    </button>`
              }
              ${column.pinned ? html`<span class="pin-mark">${pinIcon()}</span>` : nothing}
              <bolle-icon-button
                class="head-menu"
                part="header-menu"
                variant="standard"
                size="xs"
                label=${fill(this.text.column, { column: column.label })}
                haspopup="menu"
                @click=${(event: Event) => this.columnMenu(event, column)}
                >${rowMenuIcon()}</bolle-icon-button
              >
            </div>
            <span
              class="resize"
              part="column-resize"
              role="separator"
              tabindex="0"
              aria-orientation="vertical"
              aria-label=${fill(this.text.resizeColumn, { column: column.label })}
              aria-valuemin=${this.minColumnWidth}
              aria-valuemax=${this.maxColumnWidth}
              aria-valuenow=${this.width(column)}
              @pointerdown=${(event: PointerEvent) => this.startResize(event, column)}
              @keydown=${(event: KeyboardEvent) => this.resizeWithKeys(event, column)}
              @dblclick=${() =>
                this.patchColumn(column.key, {
                  width: this.defaultColumnWidth,
                })}
            ></span>
          </th>`;
        })}
        ${
          this.rowActions.length
            ? html`<th class="actions cell-end" scope="col">
                <span class="sr-only"
                  >${this.text.rowActions.replace("{row}", "")}</span
                >
              </th>`
            : nothing
        }
      </tr>
    </thead>`;
  }

  private renderRow(
    row: DataTableRow,
    virtual?: { key: string; rowIndex: number },
  ) {
    const id = this.rowId(row);
    const selected = this.selected.includes(id);
    const open = this.expanded.includes(id);
    const lastPinned = this.lastPinned;
    return html`<tr
        class="row ${selected ? "selected" : ""}"
        part=${selected ? "row row-selected" : "row"}
        aria-selected=${this.selectable ? String(selected) : nothing}
        aria-rowindex=${virtual?.rowIndex ?? nothing}
        data-virtual-key=${virtual?.key ?? nothing}
        @click=${(event: MouseEvent) => this.onRowClick(event, row)}
      >
        ${
          this.selectable
            ? html`<td
                class="select cell-pinned"
                part="selection-cell"
                style="inset-inline-start:0"
              >
                <bolle-checkbox
                  .checked=${selected}
                  @change=${(event: CustomEvent<{ checked: boolean }>) =>
                    this.toggleRow(row, event.detail.checked)}
                  ><span class="sr-only"
                    >${fill(this.text.selectRow, { key: id })}</span
                  ></bolle-checkbox
                >
              </td>`
            : nothing
        }
        ${
          this.expandable
            ? html`<td
                class="expand cell-pinned ${lastPinned ? "" : "pinned-edge"}"
                part="expand-cell"
                style=${this.selectable ? `inset-inline-start:${SELECT_WIDTH}px` : "inset-inline-start:0"}
              >
                <bolle-icon-button
                  variant="standard"
                  size="xs"
                  label=${fill(open ? this.text.collapseRow : this.text.expandRow, { row: id })}
                  aria-expanded=${String(open)}
                  @click=${(event: Event) => {
                    event.stopPropagation();
                    this.toggleExpanded(row);
                  }}
                  ><span class="chev ${open ? "open" : ""}"
                    >${expandIcon()}</span
                  ></bolle-icon-button
                >
              </td>`
            : nothing
        }
        ${
          this.rowRenderer
            ? html`<td
                class="row-custom"
                part="row-content"
                colspan=${this.visibleColumns.length}
              >
                ${this.rowRenderer(row, this)}
              </td>`
            : this.visibleColumns.map(
                (column) =>
                  html`<td
                    class="${column.align === "end" ? "end" : ""} ${column.pinned ? "cell-pinned" : ""} ${column.key === lastPinned ? "pinned-edge" : ""}"
                    part=${column.pinned ? "data-cell data-cell-pinned" : "data-cell"}
                    style=${
                      column.pinned
                        ? `inset-inline-start:${this.pinnedOffset(column.key)}px`
                        : ""
                    }
                  >
                    ${this.cell(column, row)}
                  </td>`,
              )
        }
        ${
          this.rowActions.length
            ? html`<td class="actions cell-end" part="actions-cell">
                <bolle-icon-button
                  variant="standard"
                  size="xs"
                  label=${fill(this.text.rowActions, { row: id })}
                  haspopup="menu"
                  @click=${(event: Event) => this.rowMenu(event, row)}
                  >${rowMenuIcon()}</bolle-icon-button
                >
              </td>`
            : nothing
        }
      </tr>
      ${
        open && this.detail && !virtual
          ? html`<tr class="detail" part="detail">
              <td colspan=${this.columnCount} part="detail-cell">
                <div class="detail-inner" part="detail-inner">
                  ${this.detail(row)}
                </div>
              </td>
            </tr>`
          : nothing
      }`;
  }

  private onRowClick(event: MouseEvent, row: DataTableRow) {
    const path = event.composedPath() as HTMLElement[];
    if (
      path.some((node) =>
        ["BOLLE-CHECKBOX", "BOLLE-ICON-BUTTON", "BUTTON", "A"].includes(
          node.tagName,
        ),
      )
    )
      return;
    if (window.getSelection()?.toString()) return;
    this.emit<DataTableRowDetail>("row-activate", { row });
  }

  private renderGroup(
    name: string,
    rows: DataTableRow[],
    virtual?: { key: string; rowIndex: number },
  ) {
    const collapsed = this._collapsed.has(name);
    return html`<tr
      class="group"
      part="group"
      aria-rowindex=${virtual?.rowIndex ?? nothing}
      data-virtual-key=${virtual?.key ?? nothing}
    >
      <th colspan=${this.columnCount} scope="rowgroup">
        <div class="group-inner" part="group-inner">
          ${
            this.groupRenderer
              ? this.groupRenderer(name, rows, this)
              : html`<button
                    class="group-toggle"
                    part="group-toggle"
                    aria-expanded=${String(!collapsed)}
                    @click=${() => {
                      const next = new Set(this._collapsed);
                      if (next.has(name)) next.delete(name);
                      else next.add(name);
                      this._collapsed = next;
                      this.virtualHeights.clear();
                      this.resetWindow();
                      requestAnimationFrame(this.measureWindow);
                    }}
                  >
                    <span
                      class="chev ${collapsed ? "" : "open"}"
                      part="group-chevron"
                      >${expandIcon()}</span
                    >
                    <span class="group-title" part="group-title">${name}</span>
                    <span class="group-count" part="group-count"
                      >${rows.length}</span
                    >
                  </button>
                  ${
                    this.groupSummary
                      ? html`<span class="group-summary" part="group-summary"
                          >${this.groupSummary(rows)}</span
                        >`
                      : nothing
                  }`
          }
        </div>
      </th>
    </tr>`;
  }

  private renderBody() {
    if (!this.groupBy) return this.data.map((row) => this.renderRow(row));
    const out: unknown[] = [];
    for (const [name, rows] of this.groups) {
      out.push(this.renderGroup(name, rows));
      if (!this._collapsed.has(name))
        for (const row of rows) out.push(this.renderRow(row));
    }
    return out;
  }

  private renderVirtualDetail(
    row: DataTableRow,
    key: string,
    rowIndex: number,
  ) {
    if (!this.detail) return nothing;
    return html`<tr
      class="detail"
      part="detail"
      aria-rowindex=${rowIndex}
      data-virtual-key=${key}
    >
      <td colspan=${this.columnCount} part="detail-cell">
        <div class="detail-inner" part="detail-inner">${this.detail(row)}</div>
      </td>
    </tr>`;
  }

  private renderVirtualBody() {
    const items = this.virtualItems;
    const start = Math.min(this._windowStart, items.length);
    const end = Math.min(this._windowEnd, items.length);
    const before = this.itemOffset(items, start);
    const after =
      this.itemOffset(items, items.length) - this.itemOffset(items, end);
    return html`
      ${
        before > 0
          ? html`<tr class="spacer" aria-hidden="true">
              <td
                style=${`block-size:${before}px`}
                colspan=${this.columnCount}
              ></td>
            </tr>`
          : nothing
      }
      ${items.slice(start, end).map((item, offset) => {
        const rowIndex = start + offset + 2;
        if (item.kind === "group")
          return this.renderGroup(item.name, item.rows, {
            key: item.key,
            rowIndex,
          });
        if (item.kind === "detail")
          return this.renderVirtualDetail(item.row, item.key, rowIndex);
        return this.renderRow(item.row, {
          key: item.key,
          rowIndex,
        });
      })}
      ${
        after > 0
          ? html`<tr class="spacer" aria-hidden="true">
              <td
                style=${`block-size:${after}px`}
                colspan=${this.columnCount}
              ></td>
            </tr>`
          : nothing
      }
    `;
  }

  private renderState() {
    if (this.error)
      return html`<div class="state" part="error">
        <slot name="error" part="error-slot"
          >${
            this.errorRenderer
              ? this.errorRenderer(this)
              : html`<bolle-empty-state
                  class="empty"
                  tone="error"
                  role="alert"
                  .icon=${alertIcon()}
                  .title=${this.text.error}
                  .text=${this.error}
                >
                  <bolle-button
                    slot="actions"
                    variant="filled"
                    @click=${() => this.emit("retry", {})}
                    >${this.text.retry}</bolle-button
                  >
                </bolle-empty-state>`
          }</slot
        >
      </div>`;
    return html`<div class="state" part="empty">
      <slot name="empty-state" part="empty-slot"
        >${
          this.emptyRenderer
            ? this.emptyRenderer(this)
            : html`<bolle-empty-state
                class="empty"
                .icon=${databaseOffIcon()}
                .title=${this.emptyLabel || this.text.empty}
              >
                <div slot="actions"><slot name="empty"></slot></div>
              </bolle-empty-state>`
        }</slot
      >
    </div>`;
  }

  private renderFooter() {
    if (!this.pageSize) return nothing;
    const total = this.appPages
      ? this.total || this.rows.length
      : this.rows.length;
    return html`<footer class="footer" part="footer">
      <slot name="footer" part="footer-slot"
        >${
          this.footerRenderer
            ? this.footerRenderer(this)
            : html`<bolle-pagination
                .page=${this.currentPage}
                .pageSize=${this.pageSize}
                .total=${total}
                form="compact"
                @page-change=${(
                  event: CustomEvent<{ page: number; pageSize: number }>,
                ) => void this.applyPage(event.detail)}
              ></bolle-pagination>`
        }</slot
      >
    </footer>`;
  }

  protected render() {
    const empty = !this.rows.length;
    const loading = this.loading && empty;
    const body = this.renderBody();
    return html`<div
      class="table ${this.variant === "free" ? "is-free" : ""} density-${this.density}"
      part="table"
      role="group"
      aria-label=${this.label || nothing}
      aria-busy=${String(this.loading || this.updating)}
      style=${`--table-row-height:${this.density === "compact" ? this.compactRowHeight : this.rowHeight}px;--table-header-height:${this.headerHeight}px;--table-group-height:${this.groupHeight}px`}
    >
      ${
        this.updating
          ? html`<bolle-loading-indicator
              class="busy"
              part="busy"
              variant="contained"
              label=${this.text.updating}
            ></bolle-loading-indicator>`
          : nothing
      }
      <slot name="header" part="header-slot"></slot>
      <div
        class="scroller ${this._scrolledX ? "scrolled-x" : ""} ${this.updating ? "dimmed" : ""}"
        part="scroller"
        @scroll=${this.onScroll}
      >
        <table
          part="table-grid"
          aria-rowcount=${
            this.virtualWindowed ? this.virtualItems.length + 1 : nothing
          }
        >
          <caption class="sr-only">
            ${this.label || this.text.rows}
          </caption>
          <colgroup>
            ${this.selectable ? html`<col style=${`inline-size:${SELECT_WIDTH}px`} />` : nothing}
            ${this.expandable ? html`<col style=${`inline-size:${EXPAND_WIDTH}px`} />` : nothing}
            ${this.visibleColumns.map(
              (column) =>
                html`<col style=${`inline-size:${this.width(column)}px`} />`,
            )}
            ${
              this.rowActions.length
                ? html`<col style=${`inline-size:${ACTIONS_WIDTH}px`} />`
                : nothing
            }
          </colgroup>
          ${this.renderHeader()}
          ${
            empty
              ? nothing
              : html`<tbody>
                  ${this.virtualWindowed ? this.renderVirtualBody() : body}
                </tbody>`
          }
        </table>
        ${empty && !loading ? this.renderState() : nothing}
        ${
          this.contentStyles
            ? html`<style>
                ${unsafeCSS(this.contentStyles)}
              </style>`
            : nothing
        }
        ${
          loading
            ? html`<div class="state loading" part="loading">
                <slot name="loading" part="loading-slot"
                  >${
                    this.loadingRenderer
                      ? this.loadingRenderer(this)
                      : html`<bolle-loading-indicator
                            label=${this.text.loading}
                          ></bolle-loading-indicator>
                          <p class="state-text">${this.text.loading}…</p>`
                  }</slot
                >
              </div>`
            : nothing
        }
      </div>
      ${this.renderFooter()}
      <span class="sr-only" role="status" aria-live="polite"
        >${this._announcement}</span
      >
      <span class="sr-only" id="table-sort-hint">${this.text.sortHint}</span>
      <bolle-menu
        menu-label=${this.text.rows}
        @menu-select=${this.onMenuSelect}
      ></bolle-menu>
    </div>`;
  }
}
