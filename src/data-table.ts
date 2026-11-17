import {
  html,
  nothing,
  unsafeCSS,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { dataTableStyles } from "./data-table.styles.js";
import { dataTableLabels, type DataTableLabels } from "./localization.js";
import {
  alertIcon,
  columnGripIcon,
  databaseOffIcon,
  expandIcon,
  firstPageIcon,
  lastPageIcon,
  nextPageIcon,
  pinIcon,
  previousIcon,
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

const DEFAULT_WIDTH = 168;
const MIN_COLUMN = 88;
const MAX_COLUMN = 560;
const SELECT_WIDTH = 52;
const EXPAND_WIDTH = 44;
const ACTIONS_WIDTH = 56;
const OVERSCAN = 8;
const KEY_STEP = 16;
const ROW_HEIGHT = { comfortable: 52, compact: 40 };

const fill = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );

/**
 * Table of rows the application owns: the component renders the columns, reports
 * every sorting, paging, selection, expansion and column change in an event, and
 * never reorders or filters the data itself.
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
    updating: { type: Boolean, reflect: true },
    _collapsed: { state: true },
    _windowStart: { state: true },
    _windowEnd: { state: true },
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
  sort: DataTableSort[] = [];
  groupBy = "";
  /** Content of the group header, beyond the count. */
  groupSummary?: (rows: DataTableRow[]) => unknown;
  expandable = false;
  expanded: string[] = [];
  /** Content of the row opened by the expander. */
  detail?: (row: DataTableRow) => unknown;
  rowActions: MenuEntry[] = [];
  page = 0;
  pageSize = 0;
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
  /** Keeps the rows visible, dimmed, while the application fetches new ones. */
  updating = false;

  private _collapsed = new Set<string>();
  private _windowStart = 0;
  private _windowEnd = 40;
  private _scrolledX = false;
  private _dragging = "";
  private _announcement = "";
  private drag?: { key: string; startX: number; dx: number; target: number; cancelled: boolean };
  private menuContext?: { kind: "column"; key: string } | { kind: "row"; row: DataTableRow };
  private resizeObserver?: ResizeObserver;
  private scrollerObserver?: ResizeObserver;
  private observedScroller?: HTMLElement;
  private resizeCleanup?: () => void;

  private get text(): DataTableLabels {
    return dataTableLabels("");
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has("rows") && this.groupBy) this.measureWindow();
  }

  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => this.measureWindow());
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.scrollerObserver?.disconnect();
    this.resizeCleanup?.();
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
    this.measureWindow();
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
    return column.width ?? DEFAULT_WIDTH;
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
    return [...this.visibleColumns].reverse().find((column) => column.pinned)?.key;
  }

  /* Data: groups and the virtual window -------------------------------- */

  private groupName(row: DataTableRow) {
    const column = this.columns.find((item) => item.key === this.groupBy);
    if (!column) return "";
    const value = this.valueOf(column, row);
    return value === null || value === undefined ? "" : String(value);
  }

  private get groups() {
    if (!this.groupBy) return [];
    const map = new Map<string, DataTableRow[]>();
    for (const row of this.rows) {
      const name = this.groupName(row);
      map.set(name, [...(map.get(name) ?? []), row]);
    }
    return [...map.entries()];
  }

  private get rowHeight() {
    return ROW_HEIGHT[this.density] ?? ROW_HEIGHT.comfortable;
  }

  private measureWindow = () => {
    const scroller = this.scroller;
    if (!scroller || !this.virtual) return;
    const top = scroller.scrollTop;
    const bottom = top + scroller.clientHeight;
    const start = Math.max(0, Math.floor(top / this.rowHeight) - OVERSCAN);
    const end = Math.ceil(bottom / this.rowHeight) + OVERSCAN;
    if (start !== this._windowStart) this._windowStart = start;
    if (end !== this._windowEnd) this._windowEnd = end;
  };

  private onScroll = (event: Event) => {
    const scroller = event.currentTarget as HTMLElement;
    const scrolled = Math.abs(scroller.scrollLeft) > 0;
    if (scrolled !== this._scrolledX) this._scrolledX = scrolled;
    if (this.virtual) requestAnimationFrame(this.measureWindow);
  };

  /* Sorting, selection, paging ---------------------------------------- */

  private newSort(key: string, additive: boolean): DataTableSort[] {
    const current = this.sort.find((item) => item.key === key);
    if (!additive)
      return !current
        ? [{ key, dir: "asc" }]
        : current.dir === "asc"
          ? [{ key, dir: "desc" }]
          : [];
    if (!current) return [...this.sort, { key, dir: "asc" }];
    if (current.dir === "asc")
      return this.sort.map((item) =>
        item.key === key ? { key, dir: "desc" as const } : item,
      );
    return this.sort.filter((item) => item.key !== key);
  }

  private toggleSort(column: DataTableColumn, event: MouseEvent) {
    if (column.sortable === false) return;
    const sort = this.newSort(column.key, event.shiftKey);
    this.emit<DataTableSortDetail>("sort", { sort });
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
    return this.rows.map((row) => this.rowId(row));
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

  private emitSelect(selected: string[]) {
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
    this.emit<DataTableExpandDetail>("expand", { expanded: next, row });
    this.announce(
      fill(next.includes(id) ? this.text.expandRow : this.text.collapseRow, {
        row: id,
      }),
    );
  }

  private goTo(page: number) {
    const pages = this.pageCount;
    const next = Math.max(0, Math.min(pages - 1, page));
    this.emit<DataTablePageDetail>("page-change", {
      page: next,
      pageSize: this.pageSize,
    });
  }

  private get pageCount() {
    if (!this.pageSize) return 1;
    return Math.max(1, Math.ceil((this.total || this.rows.length) / this.pageSize));
  }

  /* Columns ----------------------------------------------------------- */

  private commitColumns(columns: DataTableColumn[], message: string) {
    this.emit<DataTableColumnChangeDetail>("column-change", { columns });
    this.announce(message);
  }

  private patchColumn(key: string, patch: Partial<DataTableColumn>) {
    const columns = this.columns.map((column) =>
      column.key === key ? { ...column, ...patch } : column,
    );
    this.emit<DataTableColumnChangeDetail>("column-change", { columns });
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

  private placeColumn(key: string, targetKey: string) {
    if (key === targetKey) return;
    const columns = [...this.columns];
    const from = columns.findIndex((column) => column.key === key);
    const to = columns.findIndex((column) => column.key === targetKey);
    const [moved] = columns.splice(from, 1);
    columns.splice(to, 0, moved);
    this.emit<DataTableColumnChangeDetail>("column-change", { columns });
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
          MAX_COLUMN,
          Math.max(
            MIN_COLUMN,
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
      if (current !== startWidth) this.patchColumn(column.key, { width: current });
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
            ? MIN_COLUMN
            : event.key === "End"
              ? MAX_COLUMN
              : event.key === "Enter"
                ? (column.width ?? DEFAULT_WIDTH)
                : undefined;
    if (next === undefined) return;
    event.preventDefault();
    this.patchColumn(column.key, {
      width: Math.min(MAX_COLUMN, Math.max(MIN_COLUMN, next)),
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
        if (!current || Boolean(current.pinned) !== Boolean(column.pinned)) continue;
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
      this.announce(this.text.sortNone);
    };
    const stop = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
      window.removeEventListener("keydown", keys, true);
      this.resizeCleanup = undefined;
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
                  : fill(this.text.groupBy, { column: column.label.toLowerCase() }),
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
        disabled: index === 0 || Boolean(order[index - 1]?.pinned) !== Boolean(column.pinned),
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
      this.emit<DataTableSortDetail>("sort", {
        sort: this.newSort(column.key, false).map((item) => ({
          key: item.key,
          dir: id as "asc" | "desc",
        })),
      });
    else if (id === "unsort")
      this.emit<DataTableSortDetail>("sort", {
        sort: this.sort.filter((item) => item.key !== column.key),
      });
    else if (id === "pin") this.togglePinned(column.key);
    else if (id === "start") this.moveColumn(column.key, -1);
    else if (id === "end") this.moveColumn(column.key, 1);
    else if (id === "hide") this.toggleHidden(column.key);
    else if (id === "group" || id === "ungroup")
      this.emit("group", { groupBy: id === "group" ? column.key : "" });
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
    return html`<thead>
      <tr>
        ${
          this.selectable
            ? html`<th class="select cell-pinned" scope="col" style="inset-inline-start:0">
                <bolle-checkbox
                  .checked=${selection.all}
                  .indeterminate=${selection.chosen > 0 && !selection.all}
                  ?disabled=${!selection.keys.length}
                  @change=${(event: CustomEvent<{ checked: boolean }>) =>
                    this.togglePage(event.detail.checked)}
                  ><span class="sr-only">${this.text.selectPage}</span></bolle-checkbox
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
            class="data ${column.align === "end" ? "end" : ""} ${column.pinned ? "cell-pinned" : ""} ${column.key === lastPinned ? "pinned-edge" : ""} ${dragging ? "dragging" : ""}"
            style=${column.pinned ? `inset-inline-start:${this.pinnedOffset(column.key)}px` : ""}
            aria-sort=${current
              ? current.dir === "asc"
                ? "ascending"
                : "descending"
              : nothing}
          >
            <div class="head">
              <span
                class="grip"
                aria-hidden="true"
                @pointerdown=${(event: PointerEvent) => this.startDrag(event, column)}
                >${columnGripIcon()}</span
              >
              ${
                column.sortable === false
                  ? html`<span class="sort static"><span class="ellipsis">${column.label}</span></span>`
                  : html`<button
                      class="sort"
                      @click=${(event: MouseEvent) => this.toggleSort(column, event)}
                      @keydown=${(event: KeyboardEvent) => {
                        if (!event.altKey) return;
                        const rtl = getComputedStyle(this).direction === "rtl";
                        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
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
                      <span class="ellipsis">${column.label}</span>
                      <span class="sort-mark ${current ? "on" : ""}">
                        ${current
                          ? current.dir === "asc"
                            ? sortArrowUpIcon()
                            : sortArrowDownIcon()
                          : sortNoneIcon()}
                        ${current && this.sort.length > 1
                          ? html`<span class="rank">${rank + 1}</span>`
                          : nothing}
                      </span>
                    </button>`
              }
              ${column.pinned ? html`<span class="pin-mark">${pinIcon()}</span>` : nothing}
              <bolle-icon-button
                class="head-menu"
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
              role="separator"
              tabindex="0"
              aria-orientation="vertical"
              aria-label=${fill(this.text.resizeColumn, { column: column.label })}
              aria-valuemin=${MIN_COLUMN}
              aria-valuemax=${MAX_COLUMN}
              aria-valuenow=${this.width(column)}
              @pointerdown=${(event: PointerEvent) => this.startResize(event, column)}
              @keydown=${(event: KeyboardEvent) => this.resizeWithKeys(event, column)}
              @dblclick=${() =>
                this.patchColumn(column.key, { width: column.width ?? DEFAULT_WIDTH })}
            ></span>
          </th>`;
        })}
        ${
          this.rowActions.length
            ? html`<th class="actions cell-end" scope="col"><span class="sr-only">${this.text.rowActions.replace("{row}", "")}</span></th>`
            : nothing
        }
      </tr>
    </thead>`;
  }

  private renderRow(row: DataTableRow, index: number) {
    const id = this.rowId(row);
    const selected = this.selected.includes(id);
    const open = this.expanded.includes(id);
    const lastPinned = this.lastPinned;
    return html`<tr
      class="row ${selected ? "selected" : ""}"
      aria-selected=${this.selectable ? String(selected) : nothing}
      @click=${(event: MouseEvent) => this.onRowClick(event, row)}
    >
      ${
        this.selectable
          ? html`<td class="select cell-pinned" style="inset-inline-start:0">
              <bolle-checkbox
                .checked=${selected}
                @change=${(event: CustomEvent<{ checked: boolean }>) =>
                  this.toggleRow(row, event.detail.checked)}
                ><span class="sr-only">${fill(this.text.selectRow, { key: id })}</span></bolle-checkbox
              >
            </td>`
          : nothing
      }
      ${
        this.expandable
          ? html`<td
              class="expand cell-pinned ${lastPinned ? "" : "pinned-edge"}"
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
                ><span class="chev ${open ? "open" : ""}">${expandIcon()}</span></bolle-icon-button
              >
            </td>`
          : nothing
      }
      ${this.visibleColumns.map(
        (column) => html`<td
          class="${column.align === "end" ? "end" : ""} ${column.pinned ? "cell-pinned" : ""} ${column.key === lastPinned ? "pinned-edge" : ""}"
          style=${column.pinned
            ? `inset-inline-start:${this.pinnedOffset(column.key)}px`
            : ""}
        >
          ${this.cell(column, row)}
        </td>`,
      )}
      ${
        this.rowActions.length
          ? html`<td class="actions cell-end">
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
      open && this.detail
        ? html`<tr class="detail">
            <td colspan=${this.visibleColumns.length + (this.selectable ? 1 : 0) + (this.expandable ? 1 : 0) + (this.rowActions.length ? 1 : 0)}>
              <div class="detail-inner">${this.detail(row)}</div>
            </td>
          </tr>`
        : nothing
    }`;
  }

  private onRowClick(event: MouseEvent, row: DataTableRow) {
    const path = event.composedPath() as HTMLElement[];
    if (
      path.some((node) =>
        ["BOLLE-CHECKBOX", "BOLLE-ICON-BUTTON", "BUTTON", "A"].includes(node.tagName),
      )
    )
      return;
    if (window.getSelection()?.toString()) return;
    this.emit<DataTableRowDetail>("row-activate", { row });
  }

  private renderGroup(name: string, rows: DataTableRow[]) {
    const collapsed = this._collapsed.has(name);
    return html`<tr class="group">
      <th
        colspan=${this.visibleColumns.length + (this.selectable ? 1 : 0) + (this.expandable ? 1 : 0) + (this.rowActions.length ? 1 : 0)}
        scope="rowgroup"
      >
        <div class="group-inner">
          <button
            class="group-toggle"
            aria-expanded=${String(!collapsed)}
            @click=${() => {
              const next = new Set(this._collapsed);
              if (next.has(name)) next.delete(name);
              else next.add(name);
              this._collapsed = next;
              requestAnimationFrame(this.measureWindow);
            }}
          >
            <span class="chev ${collapsed ? "" : "open"}">${expandIcon()}</span>
            <span class="group-title">${name}</span>
            <span class="group-count">${rows.length}</span>
          </button>
          ${this.groupSummary ? html`<span class="group-summary">${this.groupSummary(rows)}</span>` : nothing}
        </div>
      </th>
    </tr>`;
  }

  private renderBody() {
    if (!this.groupBy) return this.rows.map((row, index) => this.renderRow(row, index));
    const out: unknown[] = [];
    let index = 0;
    for (const [name, rows] of this.groups) {
      out.push(this.renderGroup(name, rows));
      if (!this._collapsed.has(name))
        for (const row of rows) {
          out.push(this.renderRow(row, index));
          index += 1;
        }
    }
    return out;
  }

  private renderState() {
    if (this.error)
      return html`<div class="state" role="alert">
        <span class="state-icon error">${alertIcon()}</span>
        <p class="state-title">${this.text.error}</p>
        ${this.error ? html`<p class="state-text">${this.error}</p>` : nothing}
        <bolle-button variant="filled" @click=${() => this.emit("retry", {})}
          >${this.text.retry}</bolle-button
        >
      </div>`;
    return html`<div class="state">
      <span class="state-icon">${databaseOffIcon()}</span>
      <p class="state-title">${this.emptyLabel || this.text.empty}</p>
      <slot name="empty"></slot>
    </div>`;
  }

  private renderFooter() {
    if (!this.pageSize) return nothing;
    const pages = this.pageCount;
    const total = this.total || this.rows.length;
    const from = pages ? this.page * this.pageSize + 1 : 0;
    const to = Math.min(total, from + this.rows.length - 1);
    return html`<footer class="footer">
      <span class="range">${fill(this.text.range, { from, to: Math.max(from, to), total })}</span>
      <nav class="pager" aria-label=${this.text.pageOf.replace("{page}", "").replace("{pages}", "").trim()}>
        <bolle-icon-button variant="standard" size="xs" label=${this.text.firstPage} ?disabled=${this.page === 0} @click=${() => this.goTo(0)}>${firstPageIcon()}</bolle-icon-button>
        <bolle-icon-button variant="standard" size="xs" label=${this.text.previousPage} ?disabled=${this.page === 0} @click=${() => this.goTo(this.page - 1)}>${previousIcon()}</bolle-icon-button>
        <span class="page-of">${fill(this.text.pageOf, { page: this.page + 1, pages })}</span>
        <bolle-icon-button variant="standard" size="xs" label=${this.text.nextPage} ?disabled=${this.page >= pages - 1} @click=${() => this.goTo(this.page + 1)}>${nextPageIcon()}</bolle-icon-button>
        <bolle-icon-button variant="standard" size="xs" label=${this.text.lastPage} ?disabled=${this.page >= pages - 1} @click=${() => this.goTo(pages - 1)}>${lastPageIcon()}</bolle-icon-button>
      </nav>
    </footer>`;
  }

  protected render() {
    const empty = !this.rows.length;
    const rowCount = this.groupBy
      ? this.groups.length + this.rows.length
      : this.rows.length;
    const body = empty ? this.renderState() : this.renderBody();
    return html`<div
      class="table ${this.variant === "free" ? "is-free" : ""} density-${this.density}"
      role="group"
      aria-label=${this.label || nothing}
      aria-busy=${String(this.loading || this.updating)}
    >
      ${
        this.updating
          ? html`<bolle-loading-indicator
              class="busy"
              variant="contained"
              label=${this.text.updating}
            ></bolle-loading-indicator>`
          : nothing
      }
      <div
        class="scroller ${this._scrolledX ? "scrolled-x" : ""} ${this.updating ? "dimmed" : ""}"
        @scroll=${this.onScroll}
      >
        <table>
          <caption class="sr-only">
            ${this.label || this.text.rows}
          </caption>
          <colgroup>
            ${this.selectable ? html`<col style=${`inline-size:${SELECT_WIDTH}px`} />` : nothing}
            ${this.expandable ? html`<col style=${`inline-size:${EXPAND_WIDTH}px`} />` : nothing}
            ${this.visibleColumns.map(
              (column) => html`<col style=${`inline-size:${this.width(column)}px`} />`,
            )}
            ${this.rowActions.length
              ? html`<col style=${`inline-size:${ACTIONS_WIDTH}px`} />`
              : nothing}
          </colgroup>
          ${this.renderHeader()}
          ${
            this.loading && empty
              ? nothing
              : html`<tbody>
                  ${this.virtual && !this.groupBy
                    ? html`
                        ${this._windowStart > 0
                          ? html`<tr class="spacer" aria-hidden="true"><td style=${`block-size:${this._windowStart * this.rowHeight}px`} colspan=${this.visibleColumns.length + 3}></td></tr>`
                          : nothing}
                        ${this.rows
                          .slice(this._windowStart, this._windowEnd)
                          .map((row, index) =>
                            this.renderRow(row, this._windowStart + index),
                          )}
                        ${this._windowEnd < this.rows.length
                          ? html`<tr class="spacer" aria-hidden="true"><td style=${`block-size:${(this.rows.length - this._windowEnd) * this.rowHeight}px`} colspan=${this.visibleColumns.length + 3}></td></tr>`
                          : nothing}
                      `
                    : body}
                </tbody>`
          }
        </table>
        ${this.contentStyles
          ? html`<style>
              ${unsafeCSS(this.contentStyles)}
            </style>`
          : nothing}
        ${this.loading && empty
          ? html`<div class="state loading">
              <bolle-loading-indicator label=${this.text.loading}></bolle-loading-indicator>
              <p class="state-text">${this.text.loading}…</p>
            </div>`
          : nothing}
      </div>
      ${this.renderFooter()}
      <span class="sr-only" role="status" aria-live="polite">${this._announcement}</span>
      <span class="sr-only" id="table-sort-hint">${this.text.sortHint}</span>
      <bolle-menu menu-label=${this.text.rows} @menu-select=${this.onMenuSelect}></bolle-menu>
    </div>`;
  }
}
