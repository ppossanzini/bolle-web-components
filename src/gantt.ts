import { html, nothing, unsafeCSS, type PropertyValues } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { ganttStyles } from "./gantt.styles.js";
import { ganttLabels, type GanttLabels } from "./localization.js";
import {
  alertIcon,
  chevronDownIcon,
  columnsIcon,
  databaseOffIcon,
  refreshIcon,
} from "./icons.js";
import type { BolleMenu } from "./menu.js";
import type { MenuEntry, MenuSelectDetail } from "./menu.types.js";

export type GanttScale = "day" | "week" | "month" | "quarter";
export type GanttGroup = "" | "resource" | "phase";

export interface GanttTask {
  id: string;
  /** Short identifier shown in the code column and in the announcements. */
  code?: string;
  name: string;
  /** ISO date, `YYYY-MM-DD`. */
  start: string;
  /** ISO date, `YYYY-MM-DD`. */
  end: string;
  resource?: string;
  /** Key of the phase, read when the surface groups by phase. */
  phase?: string;
  /** Id of the parent; a task with children is drawn as a summary bar. */
  parent?: string;
  /** 0–100. */
  progress?: number;
  milestone?: boolean;
  /** Effort in hours, spread over the working days of the task for the load strip. */
  hours?: number;
  /** Ids of the tasks that must finish first. */
  deps?: string[];
  /** Approved plan, drawn under the bar when the surface shows it. */
  baseline?: { start: string; end: string };
}

export interface GanttColumn {
  id: string;
  label?: string;
  width?: number;
  visible?: boolean;
  /** Text of a cell the component does not know. */
  value?: (task: GanttTask) => string;
  /** Cell content, replacing the text; runs inside the chart shadow root. */
  render?: (task: GanttTask, gantt: BolleGantt) => unknown;
}

export type GanttBarRenderer = (
  task: GanttTask,
  gantt: BolleGantt,
  span: GanttSpan,
) => unknown;
export type GanttRenderer = (gantt: BolleGantt) => unknown;

export interface GanttChangeRequest {
  task: GanttTask;
  start: string;
  end: string;
}

export interface GanttChangeDetail extends GanttChangeRequest {
  reason?: string;
}

export interface GanttDependencyDetail {
  /** The task that receives the dependency. */
  task: GanttTask;
  /** The task that must finish first. */
  predecessor: GanttTask;
  reason?: string;
}

export interface GanttTaskDetail {
  task: GanttTask;
}

export interface GanttViewDetail {
  scale: GanttScale;
  density: "comfortable" | "compact";
  baseline: boolean;
}

export interface GanttColumnsDetail {
  visible: string[];
}

/** Start, end and progress a row shows, from the task or from its descendants. */
export interface GanttSpan {
  start: string;
  end: string;
  progress: number;
}

interface Row {
  id: string;
  task?: GanttTask;
  depth: number;
  kind: "summary" | "task" | "group";
  span?: GanttSpan;
  group?: { key: string; label: string; count: number };
}

interface Drag {
  kind: "move" | "resize-start" | "resize-end" | "link";
  taskId: string;
  start: string;
  end: string;
  days: number;
  targetId: string;
  refused: string;
}

const DAY_WIDTH: Record<GanttScale, number> = {
  day: 34,
  week: 12,
  month: 4,
  quarter: 1.6,
};
const STEP: Record<GanttScale, number> = {
  day: 1,
  week: 7,
  month: 1,
  quarter: 1,
};
const CAPACITY = 8;

const DEFAULT_COLUMNS: Array<
  Required<Pick<GanttColumn, "id" | "width" | "visible">>
> = [
  { id: "code", width: 118, visible: true },
  { id: "name", width: 240, visible: true },
  { id: "resource", width: 132, visible: true },
  { id: "start", width: 86, visible: true },
  { id: "end", width: 86, visible: true },
  { id: "duration", width: 62, visible: true },
  { id: "progress", width: 62, visible: true },
  { id: "deps", width: 96, visible: false },
];
const DEFAULT_COLUMN_IDS = new Set(DEFAULT_COLUMNS.map((column) => column.id));

const fill = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );

const parseISO = (value: string) => new Date(`${value}T00:00:00Z`);
const iso = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (value: string, days: number) => {
  const date = parseISO(value);
  date.setUTCDate(date.getUTCDate() + days);
  return iso(date);
};
const diffDays = (from: string, to: string) =>
  Math.round((parseISO(to).getTime() - parseISO(from).getTime()) / 86_400_000);
const isWeekend = (value: string) =>
  [0, 6].includes(parseISO(value).getUTCDay());
const startOfMonth = (value: string) => `${value.slice(0, 7)}-01`;
const startOfQuarter = (value: string) => {
  const month = Math.floor((Number(value.slice(5, 7)) - 1) / 3) * 3 + 1;
  return `${value.slice(0, 4)}-${String(month).padStart(2, "0")}-01`;
};
const mondayOf = (value: string) =>
  addDays(value, -((parseISO(value).getUTCDay() + 6) % 7));
const workingDays = (from: string, to: string) => {
  let days = 0;
  for (let day = from; day <= to; day = addDays(day, 1))
    if (!isWeekend(day)) days += 1;
  return days;
};
const todayISO = () => iso(new Date());

const isoWeek = (value: string) => {
  const target = parseISO(value);
  const day = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - day + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  return (
    1 +
    Math.round((target.getTime() - firstThursday.getTime()) / (7 * 86_400_000))
  );
};

/**
 * Planning surface: rows of tasks on a time axis, with dependency arrows, pointer and
 * keyboard changes. A change is applied to its own copy of `tasks` and reported in
 * the `task-change` or `dependency-add` event. The rule that decides whether a
 * change is allowed belongs to the application, through `restrict`.
 */
export class BolleGantt extends BolleElement {
  static properties = {
    label: {},
    tasks: { attribute: false },
    columns: { attribute: false },
    scale: { reflect: true },
    groupBy: { reflect: true, attribute: "group-by" },
    density: { reflect: true },
    baseline: { type: Boolean, reflect: true },
    editable: { type: Boolean, reflect: true },
    linkable: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    error: {},
    emptyLabel: { attribute: "empty-label" },
    restrict: { attribute: false },
    labels: { attribute: false },
    barRenderer: { attribute: false },
    groupLabel: { attribute: false },
    contentStyles: { attribute: false },
    loadingRenderer: { attribute: false },
    errorRenderer: { attribute: false },
    emptyRenderer: { attribute: false },
    selected: {},
    drag: { state: true },
    windowStart: { state: true },
    windowEnd: { state: true },
    _announcement: { state: true },
    _layout: { state: true },
    _collapsed: { state: true },
  };
  static styles = [commonStyles, ganttStyles];

  /** Accessible name of the surface. */
  label = "";
  tasks: GanttTask[] = [];
  /** Visible columns; the built-in set when empty. */
  columns: GanttColumn[] = [];
  scale: GanttScale = "week";
  /** Empty draws the tree from `parent`; `resource` and `phase` group the rows. */
  groupBy: GanttGroup = "";
  density: "comfortable" | "compact" = "comfortable";
  /** Shows the approved plan under every bar. */
  baseline = false;
  /** Lets the reader move and resize with pointer or keyboard. */
  editable = false;
  /** Shows the connector that creates a dependency. */
  linkable = false;
  loading = false;
  /** Text shown instead of the chart when it cannot be loaded. */
  error = "";
  emptyLabel = "";
  /**
   * Rule of the application: returns the reason of a refused change, or nothing when
   * the requested start and end are acceptable.
   */
  restrict?: (request: GanttChangeRequest) => string | undefined;
  /** Replaces the built-in texts. */
  labels: Partial<GanttLabels> = {};
  /** Content of a bar, replacing the label the component puts inside it. */
  barRenderer?: GanttBarRenderer;
  /** Label of a group row; the key itself when omitted. */
  groupLabel?: (key: string) => string;
  /**
   * CSS for the markup returned by a column `render` and by `barRenderer`. Those
   * functions run inside the chart shadow root, where the page stylesheet does
   * not reach; pass their rules here as a string.
   */
  contentStyles = "";
  loadingRenderer?: GanttRenderer;
  errorRenderer?: GanttRenderer;
  emptyRenderer?: GanttRenderer;
  /** Id of the task drawn as selected; the chart updates it on click. */
  selected = "";

  declare drag: Drag | undefined;
  declare windowStart: number;
  declare windowEnd: number;
  declare _announcement: string;
  declare _layout: Array<GanttColumn & { width: number; visible: boolean }>;
  declare _collapsed: string[];

  private scrollOffset = 0;
  private viewport = 480;
  private observer?: ResizeObserver;
  private rowCache?: Row[];
  private loadIndex = new Map<string, Map<string, number>>();
  private menuContext?: { kind: "columns" };
  private columnsTouched = false;
  private dragPointer = { x: 0, y: 0 };
  private initialScrollDone = false;

  constructor() {
    super();
    this.windowStart = 0;
    this.windowEnd = 40;
    this._announcement = "";
    this._layout = [];
    this._collapsed = [];
  }

  private get text(): GanttLabels {
    return ganttLabels(document.documentElement.lang, this.labels);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this.onResize);
    this.observer = new ResizeObserver(() => {
      const chart = this.renderRoot.querySelector<HTMLElement>(".chart");
      if (chart) this.viewport = chart.clientHeight;
      this.applyColumnPreset();
      this.measure();
    });
    requestAnimationFrame(() => {
      const chart = this.renderRoot.querySelector<HTMLElement>(".chart");
      if (!chart) return;
      this.observer?.observe(chart);
      this.observer?.observe(this);
      this.viewport = chart.clientHeight;
      this.syncLayout();
      this.measure();
      if (!this.initialScrollDone) {
        this.initialScrollDone = true;
        this.scrollToStart(chart);
      }
    });
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.onResize);
    this.observer?.disconnect();
    super.disconnectedCallback();
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (
      changed.has("tasks") ||
      changed.has("groupBy") ||
      changed.has("_collapsed")
    ) {
      this.rowCache = undefined;
      this.buildLoad();
    }
    if (changed.has("columns") || !this._layout.length) this.syncLayout();
    if (
      changed.has("tasks") &&
      this.drag &&
      !this.tasks.some((task) => task.id === this.drag!.taskId)
    )
      this.drag = undefined;
  }

  protected updated() {
    if (this.drag) this.positionNote();
  }

  /* Texts ----------------------------------------------------------------- */

  private columnLabel(id: string) {
    const text = this.text;
    if (id === "code") return text.columnCode;
    if (id === "name") return text.columnName;
    if (id === "resource") return text.columnResource;
    if (id === "start") return text.columnStart;
    if (id === "end") return text.columnEnd;
    if (id === "duration") return text.columnDuration;
    if (id === "progress") return text.columnProgress;
    if (id === "deps") return text.columnDeps;
    return id;
  }

  private announce(message: string) {
    this._announcement = "";
    requestAnimationFrame(() => (this._announcement = message));
  }

  /* Layout of the grid column --------------------------------------------- */

  private syncLayout() {
    const provided = this.columns.length
      ? this.columns
      : DEFAULT_COLUMNS.map((column) => ({
          ...column,
          label: this.columnLabel(column.id),
        }));
    const next = provided.map((column) => ({
      ...column,
      label: column.label ?? this.columnLabel(column.id),
      width: column.width ?? 120,
      visible: column.visible ?? true,
    }));
    if (JSON.stringify(next) !== JSON.stringify(this._layout)) {
      this._layout = next;
      this.applyColumnPreset();
    }
  }

  private onResize = () => this.applyColumnPreset();

  /**
   * The grid column narrows as the surface does, so the timeline keeps a usable width.
   * A choice made in the columns menu wins until the surface is resized again.
   */
  private applyColumnPreset() {
    if (this.columnsTouched || !this._layout.length) return;
    const width = this.clientWidth || window.innerWidth;
    const narrow = width < 560;
    const preset = narrow
      ? ["name"]
      : width < 760
        ? ["name", "resource"]
        : width < 1000
          ? ["code", "name", "resource", "start", "end"]
          : [
              "code",
              "name",
              "resource",
              "start",
              "end",
              "duration",
              "progress",
            ];
    const next = this._layout.map((column) => ({
      ...column,
      width:
        column.id === "name" && narrow
          ? 190
          : column.id === "name" && width < 1000
            ? 210
            : column.width,
      // The preset chooses among the built-in columns; one the application
      // declares keeps the visibility it asked for.
      visible: preset.includes(column.id) || !DEFAULT_COLUMN_IDS.has(column.id),
    }));
    if (JSON.stringify(next) !== JSON.stringify(this._layout))
      this._layout = next;
  }

  private get visibleColumns() {
    return (this._layout ?? []).filter((column) => column.visible);
  }

  private get template() {
    return this.visibleColumns
      .map((column) =>
        column.id === "name"
          ? `minmax(120px, ${column.width}px)`
          : `${column.width}px`,
      )
      .join(" ");
  }

  private get gridWidth() {
    return this.visibleColumns.reduce((sum, column) => sum + column.width, 0);
  }

  private startColumnResize(event: PointerEvent, column: GanttColumn) {
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLElement;
    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      /* A pointer without capture still tracks through the listeners below. */
    }
    this.columnsTouched = true;
    const startX = event.clientX;
    const startWidth = column.width ?? 120;
    const move = (moveEvent: PointerEvent) => {
      const width = Math.max(
        56,
        Math.round(startWidth + (moveEvent.clientX - startX)),
      );
      this._layout = this._layout.map((item) =>
        item.id === column.id ? { ...item, width } : item,
      );
    };
    const stop = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      this.emitColumns();
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
  }

  private emitColumns() {
    this.emit<GanttColumnsDetail>("columns-change", {
      visible: this.visibleColumns.map((column) => column.id),
    });
  }

  private openColumns(event: Event) {
    const menu = this.renderRoot.querySelector<BolleMenu>("bolle-menu");
    if (!menu) return;
    const items: MenuEntry[] = this._layout.map((column) => ({
      id: column.id,
      label: column.label ?? column.id,
      selected: column.visible,
      disabled: column.visible && this.visibleColumns.length <= 1,
    }));
    menu.items = items;
    menu.menuLabel = this.text.columns;
    menu.selectionMode = "multi";
    menu.setSelection(this.visibleColumns.map((column) => column.id));
    this.menuContext = { kind: "columns" };
    void menu.show(event.currentTarget as HTMLElement);
  }

  private onMenuSelect = (event: CustomEvent<MenuSelectDetail>) => {
    const context = this.menuContext;
    this.menuContext = undefined;
    if (context?.kind !== "columns") return;
    this.columnsTouched = true;
    const shown = new Set(event.detail.selectedIds);
    this._layout = this._layout.map((column) => ({
      ...column,
      visible: shown.has(column.id),
    }));
    this.emitColumns();
  };

  /* Rows ------------------------------------------------------------------ */

  private get childMap() {
    const map = new Map<string, GanttTask[]>();
    for (const task of this.tasks) {
      if (!task.parent) continue;
      const list = map.get(task.parent) ?? [];
      list.push(task);
      map.set(task.parent, list);
    }
    return map;
  }

  private get rows(): Row[] {
    if (this.rowCache) return this.rowCache;
    this.rowCache = this.buildRows();
    return this.rowCache;
  }

  private rollup(tasks: GanttTask[]): GanttSpan {
    const start = tasks.reduce(
      (min, task) => (task.start < min ? task.start : min),
      tasks[0].start,
    );
    const end = tasks.reduce(
      (max, task) => (task.end > max ? task.end : max),
      tasks[0].end,
    );
    const progress = Math.round(
      tasks.reduce((sum, task) => sum + (task.progress ?? 0), 0) / tasks.length,
    );
    return { start, end, progress };
  }

  private buildRows(): Row[] {
    const rows: Row[] = [];
    if (!this.tasks.length) return rows;
    const children = this.childMap;
    const push = (task: GanttTask, depth: number) => {
      const kids = children.get(task.id) ?? [];
      rows.push({
        id: task.id,
        task,
        depth,
        kind: kids.length ? "summary" : "task",
        span: kids.length ? this.rollup(kids) : undefined,
      });
      if (kids.length && !this._collapsed.includes(task.id))
        for (const child of kids) push(child, depth + 1);
    };

    if (this.groupBy === "") {
      for (const task of this.tasks) if (!task.parent) push(task, 0);
      return rows;
    }

    const key = (task: GanttTask) =>
      this.groupBy === "resource" ? (task.resource ?? "") : (task.phase ?? "");
    const groups = new Map<string, GanttTask[]>();
    for (const task of this.tasks) {
      if (task.parent && children.has(task.id)) continue;
      const name = key(task);
      const list = groups.get(name) ?? [];
      list.push(task);
      groups.set(name, list);
    }
    for (const [name, list] of [...groups].sort((a, b) =>
      a[0].localeCompare(b[0]),
    )) {
      const id = `group:${name}`;
      rows.push({
        id,
        depth: 0,
        kind: "group",
        group: {
          key: name,
          label: this.groupLabel ? this.groupLabel(name) : name,
          count: list.length,
        },
      });
      if (this._collapsed.includes(id)) continue;
      for (const task of [...list].sort((a, b) =>
        a.start.localeCompare(b.start),
      ))
        rows.push({ id: `g:${task.id}`, task, depth: 1, kind: "task" });
    }
    return rows;
  }

  private spanOf(row: Row) {
    if (row.group) return undefined;
    if (row.span) return row.span;
    const task = row.task;
    return task
      ? { start: task.start, end: task.end, progress: task.progress ?? 0 }
      : undefined;
  }

  /* Timeline -------------------------------------------------------------- */

  private get timeline() {
    const list = this.tasks;
    if (!list.length) {
      const start = mondayOf(addDays(todayISO(), -14));
      const dayW = DAY_WIDTH[this.scale];
      return {
        start,
        end: addDays(start, 90),
        days: 91,
        dayW,
        width: Math.round(91 * dayW),
      };
    }
    let min = list[0].start;
    let max = list[0].end;
    for (const task of list) {
      if (task.start < min) min = task.start;
      if (task.end > max) max = task.end;
    }
    const start = mondayOf(addDays(min, -14));
    const end = addDays(max, 30);
    const days = diffDays(start, end) + 1;
    const dayW = DAY_WIDTH[this.scale];
    return { start, end, days, dayW, width: Math.round(days * dayW) };
  }

  private x(value: string) {
    return Math.round(
      diffDays(this.timeline.start, value) * this.timeline.dayW,
    );
  }

  private widthOf(start: string, end: string) {
    return Math.round((diffDays(start, end) + 1) * this.timeline.dayW);
  }

  private get todayX() {
    const today = todayISO();
    if (today < this.timeline.start || today > this.timeline.end) return -1;
    return this.x(today);
  }

  private get rowHeight() {
    return this.density === "compact" ? 30 : 40;
  }

  private measure() {
    const rowH = this.rowHeight;
    const first = Math.max(0, Math.floor(this.scrollOffset / rowH) - 6);
    const last = Math.min(
      this.rows.length,
      Math.ceil((this.scrollOffset + this.viewport) / rowH) + 6,
    );
    if (first !== this.windowStart) this.windowStart = first;
    if (last !== this.windowEnd) this.windowEnd = last;
  }

  private onScroll = (event: Event) => {
    this.scrollOffset = (event.currentTarget as HTMLElement).scrollTop;
    this.measure();
  };

  /** Opens on the first activity of the first row, not on the padded origin. */
  private scrollToStart(chart: HTMLElement) {
    const first = this.rows.find((row) => row.task)?.task;
    chart.scrollLeft = Math.max(
      0,
      this.x(first?.start ?? this.timeline.start) - 60,
    );
  }

  /** Changing the scale keeps the date at the edge, not the pixel offset. */
  private setScale(scale: GanttScale) {
    if (scale === this.scale) return;
    const chart = this.renderRoot.querySelector<HTMLElement>(".chart");
    const anchor = chart
      ? addDays(
          this.timeline.start,
          Math.round(chart.scrollLeft / this.timeline.dayW),
        )
      : this.timeline.start;
    this.scale = scale;
    this.emitView();
    requestAnimationFrame(() => {
      const current = this.renderRoot.querySelector<HTMLElement>(".chart");
      if (current)
        current.scrollLeft = Math.max(
          0,
          diffDays(this.timeline.start, anchor) * this.timeline.dayW,
        );
    });
  }

  private setDensity(density: "comfortable" | "compact") {
    if (density === this.density) return;
    this.density = density;
    this.emitView();
    requestAnimationFrame(() => this.measure());
  }

  private setBaseline(value: boolean) {
    if (value === this.baseline) return;
    this.baseline = value;
    this.emitView();
  }

  private emitView() {
    this.emit<GanttViewDetail>("view-change", {
      scale: this.scale,
      density: this.density,
      baseline: this.baseline,
    });
  }

  /* Load ------------------------------------------------------------------ */

  private buildLoad() {
    const index = new Map<string, Map<string, number>>();
    this.loadIndex = index;
    if (this.groupBy !== "resource") return;
    for (const task of this.tasks) {
      if (!task.parent || task.milestone || !task.hours || !task.resource)
        continue;
      const perDay =
        task.hours / Math.max(1, workingDays(task.start, task.end));
      let map = index.get(task.resource);
      if (!map) {
        map = new Map();
        index.set(task.resource, map);
      }
      for (let day = task.start; day <= task.end; day = addDays(day, 1)) {
        if (isWeekend(day)) continue;
        map.set(day, (map.get(day) ?? 0) + perDay);
      }
    }
  }

  /* Changes --------------------------------------------------------------- */

  /** A dependency that would close a loop is refused by the surface itself. */
  private createsLoop(from: string, to: string) {
    const byId = new Map(this.tasks.map((task) => [task.id, task]));
    const seen = new Set<string>();
    const walk = (id: string): boolean => {
      if (id === from) return true;
      if (seen.has(id)) return false;
      seen.add(id);
      const task = byId.get(id);
      return task ? (task.deps ?? []).some(walk) : false;
    };
    return walk(to);
  }

  /** New task array with the change applied to the task the reader moved. */
  private moved(task: GanttTask, start: string, end: string): GanttTask[] {
    return this.tasks.map((item) =>
      item.id === task.id ? { ...item, start, end } : item,
    );
  }

  private request(task: GanttTask, start: string, end: string) {
    if (end < start) {
      this.announce(this.text.endBeforeStart);
      this.emit<GanttChangeDetail>("task-change-blocked", {
        task,
        start,
        end,
        reason: this.text.endBeforeStart,
      });
      return false;
    }
    const reason = this.restrict?.({ task, start, end });
    if (reason) {
      this.announce(reason);
      this.emit<GanttChangeDetail>("task-change-blocked", {
        task,
        start,
        end,
        reason,
      });
      return false;
    }
    this.tasks = this.moved(task, start, end);
    this.emit<GanttChangeDetail>("task-change", { task, start, end });
    this.announce(
      fill(this.text.moved, {
        code: task.code ?? task.name,
        from: start,
        to: end,
      }),
    );
    return true;
  }

  private moveBy(
    task: GanttTask,
    days: number,
    edge: "start" | "end" | "both",
  ) {
    const start = edge === "end" ? task.start : addDays(task.start, days);
    const end = edge === "start" ? task.end : addDays(task.end, days);
    return this.request(task, start, end);
  }

  private addDependency(task: GanttTask, predecessor: GanttTask) {
    const reason =
      task.id === predecessor.id
        ? this.text.dependencySame
        : (task.deps ?? []).includes(predecessor.id)
          ? this.text.dependencyExists
          : this.createsLoop(task.id, predecessor.id)
            ? this.text.dependencyLoop
            : "";
    if (reason) {
      this.announce(reason);
      this.emit<GanttDependencyDetail>("dependency-blocked", {
        task,
        predecessor,
        reason,
      });
      return false;
    }
    this.tasks = this.tasks.map((item) =>
      item.id === task.id
        ? { ...item, deps: [...(item.deps ?? []), predecessor.id] }
        : item,
    );
    this.emit<GanttDependencyDetail>("dependency-add", { task, predecessor });
    this.announce(
      fill(this.text.dependencyAdded, {
        predecessor: predecessor.code ?? predecessor.name,
        task: task.code ?? task.name,
      }),
    );
    return true;
  }

  /** Applies the choice, then reports it: the chart does not wait for the application. */
  private select(task: GanttTask) {
    if (this.selected !== task.id) this.selected = task.id;
    this.emit<GanttTaskDetail>("task-select", { task });
  }

  private onKey(event: KeyboardEvent, task: GanttTask) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.select(task);
      this.emit<GanttTaskDetail>("task-open", { task });
      return;
    }
    if (!this.editable || !event.altKey) return;
    const right = event.key === "ArrowRight";
    const left = event.key === "ArrowLeft";
    if (!right && !left) return;
    event.preventDefault();
    event.stopPropagation();
    const step = STEP[this.scale] * (right ? 1 : -1);
    if (event.shiftKey) this.moveBy(task, step, "end");
    else this.moveBy(task, step, "both");
  }

  /* Pointer --------------------------------------------------------------- */

  private startDrag(event: PointerEvent, task: GanttTask, kind: Drag["kind"]) {
    if (event.button !== 0) return;
    if (kind === "link" && !this.linkable) return;
    if (kind !== "link" && !this.editable) return;
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLElement;
    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      /* A pointer without capture still tracks through the listeners below. */
    }
    this.select(task);
    this.dragPointer = { x: event.clientX, y: event.clientY };
    this.drag = {
      kind,
      taskId: task.id,
      start: task.start,
      end: task.end,
      days: 0,
      targetId: "",
      refused: "",
    };
    const move = (moveEvent: PointerEvent) => {
      const days = Math.round(
        (moveEvent.clientX - event.clientX) / this.timeline.dayW,
      );
      this.dragPointer = { x: moveEvent.clientX, y: moveEvent.clientY };
      if (kind === "link") {
        const root = this.renderRoot as ShadowRoot & {
          elementsFromPoint?: (x: number, y: number) => Element[];
        };
        const stack = root.elementsFromPoint
          ? root.elementsFromPoint(moveEvent.clientX, moveEvent.clientY)
          : document.elementsFromPoint(moveEvent.clientX, moveEvent.clientY);
        const bar = stack
          .map((element) => (element as HTMLElement).closest?.("[data-task]"))
          .find((element) => element instanceof HTMLElement) as
          HTMLElement | undefined;
        this.drag = { ...this.drag!, targetId: bar?.dataset.task ?? "" };
        this.positionNote();
        return;
      }
      const start =
        kind === "resize-end" ? task.start : addDays(task.start, days);
      const end = kind === "resize-start" ? task.end : addDays(task.end, days);
      const refused =
        end < start
          ? this.text.endBeforeStart
          : (this.restrict?.({ task, start, end }) ?? "");
      this.drag = { ...this.drag!, days, start, end, refused };
      this.positionNote();
    };
    const stop = (cancelled = false) => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", abort);
      window.removeEventListener("keydown", cancel, true);
      const drag = this.drag;
      this.drag = undefined;
      if (cancelled) {
        this.announce(this.text.cancelled);
        return;
      }
      if (!drag) return;
      if (drag.kind === "link") {
        const target = this.tasks.find((item) => item.id === drag.targetId);
        if (target) this.addDependency(task, target);
        return;
      }
      if (drag.refused) {
        this.announce(drag.refused);
        this.emit<GanttChangeDetail>("task-change-blocked", {
          task,
          start: drag.start,
          end: drag.end,
          reason: drag.refused,
        });
        return;
      }
      if (!drag.days) return;
      this.request(task, drag.start, drag.end);
    };
    const up = () => stop(false);
    const abort = () => stop(true);
    const cancel = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key !== "Escape") return;
      keyEvent.preventDefault();
      stop(true);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", abort);
    window.addEventListener("keydown", cancel, true);
  }

  /** The note follows the pointer, so its position is written outside the render. */
  private positionNote() {
    const note = this.renderRoot.querySelector<HTMLElement>(".drag-note");
    if (!note) return;
    note.style.left = `${this.dragPointer.x + 16}px`;
    note.style.top = `${this.dragPointer.y + 20}px`;
  }

  private toggle(id: string) {
    this._collapsed = this._collapsed.includes(id)
      ? this._collapsed.filter((item) => item !== id)
      : [...this._collapsed, id];
  }

  /* Rendering ------------------------------------------------------------- */

  private dateLabel(value: string) {
    return new Intl.DateTimeFormat(document.documentElement.lang || "en", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(parseISO(value));
  }

  private monthLabel(value: string) {
    return new Intl.DateTimeFormat(document.documentElement.lang || "en", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(parseISO(value));
  }

  private shortMonth(value: string) {
    return new Intl.DateTimeFormat(document.documentElement.lang || "en", {
      month: "short",
      timeZone: "UTC",
    }).format(parseISO(value));
  }

  private renderTicks() {
    const { start, end, dayW } = this.timeline;
    const primary: unknown[] = [];
    const secondary: unknown[] = [];
    const coarse = this.scale === "month" || this.scale === "quarter";

    if (coarse) {
      // The coarse scales repeat the month below: the year spans its months.
      let year = Number(start.slice(0, 4));
      while (year <= Number(end.slice(0, 4))) {
        const from = `${year}-01-01` < start ? start : `${year}-01-01`;
        const nextYear = `${year + 1}-01-01`;
        const to = nextYear > end ? end : addDays(nextYear, -1);
        primary.push(
          html`<span
            class="tick"
            style=${`inset-inline-start:${this.x(from)}px;inline-size:${Math.max(1, this.widthOf(from, to))}px`}
            >${year}</span
          >`,
        );
        year += 1;
      }
    } else {
      let cursor = startOfMonth(start);
      while (cursor <= end) {
        const next = startOfMonth(addDays(cursor, 32));
        primary.push(
          html`<span
            class="tick"
            style=${`inset-inline-start:${this.x(cursor)}px;inline-size:${Math.max(1, this.widthOf(cursor, addDays(next, -1)))}px`}
            >${this.monthLabel(cursor)}</span
          >`,
        );
        cursor = next;
      }
    }

    if (this.scale === "day") {
      for (let day = start; day <= end; day = addDays(day, 1)) {
        secondary.push(
          html`<span
            class="tick"
            style=${`inset-inline-start:${this.x(day)}px;inline-size:${Math.round(dayW)}px`}
            >${Number(day.slice(8, 10))}</span
          >`,
        );
      }
    } else if (this.scale === "week") {
      for (let day = start; day <= end; day = addDays(day, 7)) {
        secondary.push(
          html`<span
            class="tick"
            style=${`inset-inline-start:${this.x(day)}px;inline-size:${Math.round(dayW * 7)}px`}
            >${fill(this.text.week, { week: isoWeek(day) })}</span
          >`,
        );
      }
    } else if (this.scale === "month") {
      let month = startOfMonth(start);
      while (month <= end) {
        const next = startOfMonth(addDays(month, 32));
        secondary.push(
          html`<span
            class="tick"
            style=${`inset-inline-start:${this.x(month)}px;inline-size:${Math.round(dayW * diffDays(month, next))}px`}
            >${this.shortMonth(month)}</span
          >`,
        );
        month = next;
      }
    } else {
      let quarter = startOfQuarter(start);
      while (quarter <= end) {
        const next = startOfMonth(addDays(quarter, 95));
        secondary.push(
          html`<span
            class="tick"
            style=${`inset-inline-start:${this.x(quarter)}px;inline-size:${Math.round(dayW * diffDays(quarter, next))}px`}
            >${fill(this.text.quarter, { quarter: Math.ceil(Number(quarter.slice(5, 7)) / 3) })}</span
          >`,
        );
        quarter = next;
      }
    }

    return html`<div class="head-row primary">${primary}</div>
      <div class="head-row">${secondary}</div>`;
  }

  private taskLabel(task: GanttTask, span: GanttSpan) {
    return fill(this.text.taskLabel, {
      code: task.code ?? "",
      name: task.name,
      from: this.dateLabel(span.start),
      to: this.dateLabel(span.end),
      progress: span.progress,
    });
  }

  private renderBar(row: Row) {
    const span = this.spanOf(row);
    if (!span) return nothing;
    const task = row.task;
    const left = this.x(span.start);
    const width = this.widthOf(span.start, span.end);
    if (row.kind === "summary")
      return html`<div
        class="bar summary-bar"
        style=${`inset-inline-start:${left}px;inline-size:${Math.max(6, width)}px`}
        aria-hidden="true"
      >
        <span class="fill" style=${`inline-size:${span.progress}%`}></span>
      </div>`;
    const active = this.drag?.taskId === task!.id;
    if (task!.milestone) {
      return html`<div
        class="milestone"
        role="button"
        tabindex="0"
        data-task=${task!.id}
        data-refused=${active && this.drag?.refused ? "true" : nothing}
        aria-label=${fill(this.text.milestoneLabel, {
          code: task!.code ?? "",
          name: task!.name,
          date: this.dateLabel(task!.start),
        })}
        style=${`inset-inline-start:${left}px`}
        @pointerdown=${(event: PointerEvent) => this.startDrag(event, task!, "move")}
        @keydown=${(event: KeyboardEvent) => this.onKey(event, task!)}
      >
        ${this.barRenderer ? this.barRenderer(task!, this, span) : nothing}
      </div>`;
    }
    const dragging = active && this.drag?.kind !== "link";
    return html`<div
        class="bar ${dragging ? "dragging" : ""} ${dragging && this.drag?.refused ? "refused" : ""}"
        role="button"
        tabindex="0"
        data-task=${task!.id}
        aria-label=${this.taskLabel(task!, span)}
        style=${`inset-inline-start:${left}px;inline-size:${Math.max(10, width)}px`}
        @pointerdown=${(event: PointerEvent) => this.startDrag(event, task!, "move")}
        @keydown=${(event: KeyboardEvent) => this.onKey(event, task!)}
      >
        <span class="fill" style=${`inline-size:${span.progress}%`}></span>
        ${
          this.barRenderer
            ? this.barRenderer(task!, this, span)
            : width > 90
              ? html`<span class="bar-label">${task!.name}</span>`
              : nothing
        }
        <span
          class="handle start"
          @pointerdown=${(event: PointerEvent) => this.startDrag(event, task!, "resize-start")}
        ></span>
        <span
          class="handle end"
          @pointerdown=${(event: PointerEvent) => this.startDrag(event, task!, "resize-end")}
        ></span>
      </div>
      ${
        this.linkable
          ? html`<span
              class="link"
              role="button"
              tabindex="-1"
              data-link=${task!.id}
              title=${fill(this.text.linkTitle, { code: task!.code ?? "" })}
              aria-label=${fill(this.text.linkTitle, { code: task!.code ?? "" })}
              style=${`inset-inline-start:${left + Math.max(10, width) + 8}px`}
              @pointerdown=${(event: PointerEvent) => this.startDrag(event, task!, "link")}
            ></span>`
          : nothing
      }`;
  }

  private cellValue(
    id: string,
    task: GanttTask,
    column: GanttColumn,
    span?: GanttSpan,
  ) {
    if (column.render) return html`<div>${column.render(task, this)}</div>`;
    if (column.value) return html`<div>${column.value(task)}</div>`;
    const days = diffDays(task.start, task.end) + 1;
    if (id === "code")
      return html`<div title=${task.code ?? ""}>${task.code ?? ""}</div>`;
    if (id === "resource") return html`<div>${task.resource ?? ""}</div>`;
    if (id === "start") return html`<div>${this.dateLabel(task.start)}</div>`;
    if (id === "end") return html`<div>${this.dateLabel(task.end)}</div>`;
    if (id === "duration")
      return html`<div>${task.milestone ? "—" : days}</div>`;
    if (id === "progress")
      return html`<div>${span?.progress ?? task.progress ?? 0}%</div>`;
    if (id === "deps")
      return html`<div>
        ${
          (task.deps ?? [])
            .map(
              (dep) => this.tasks.find((item) => item.id === dep)?.code ?? dep,
            )
            .join(", ") || "—"
        }
      </div>`;
    return html`<div></div>`;
  }

  private loadCells(resource: string) {
    const hoursOf = this.loadIndex.get(resource) ?? new Map<string, number>();
    const step = this.scale === "day" ? 1 : 7;
    const cells: unknown[] = [];
    for (
      let day = this.timeline.start;
      day <= this.timeline.end;
      day = addDays(day, step)
    ) {
      let hours = 0;
      let working = 0;
      for (let offset = 0; offset < step; offset += 1) {
        const current = addDays(day, offset);
        if (isWeekend(current)) continue;
        working += 1;
        hours += hoursOf.get(current) ?? 0;
      }
      const average = working ? hours / working : 0;
      const ratio = average / CAPACITY;
      const level = !working
        ? "off"
        : ratio > 1.05
          ? "over"
          : ratio > 0.85
            ? "full"
            : ratio > 0.1
              ? "some"
              : "idle";
      cells.push(
        html`<span
          class="load-cell"
          data-level=${level}
          title=${fill(this.text.loadTitle, {
            resource,
            date: this.dateLabel(day),
            hours: average.toFixed(1),
          })}
          style=${`inline-size:${Math.round(this.timeline.dayW * step)}px`}
        ></span>`,
      );
    }
    return html`<div
      class="load-cells"
      style=${`--timeline-w:${this.timeline.width}px`}
    >
      ${cells}
    </div>`;
  }

  private renderRow(row: Row, index: number) {
    const task = row.task;
    const span = this.spanOf(row);
    const baseline =
      this.baseline && task?.baseline && row.kind === "task"
        ? html`<div
            class="baseline"
            style=${`inset-inline-start:${this.x(task.baseline.start)}px;inline-size:${Math.max(4, this.widthOf(task.baseline.start, task.baseline.end))}px`}
          ></div>`
        : nothing;
    const foldable = row.kind === "summary" || row.kind === "group";
    const collapsed = this._collapsed.includes(row.id);
    const toggle = foldable
      ? html`<button
          class="toggle"
          type="button"
          aria-expanded=${collapsed ? "false" : "true"}
          aria-label=${fill(collapsed ? this.text.expand : this.text.collapse, {
            label: task?.name ?? row.group?.label ?? "",
          })}
          @click=${() => this.toggle(row.id)}
        >
          ${chevronDownIcon()}
        </button>`
      : html`<span class="toggle" aria-hidden="true"></span>`;
    const cells = this.visibleColumns.map((column) => {
      if (column.id === "name")
        return html`<div
          class="name"
          style=${`padding-inline-start:${row.depth * 14 + 4}px`}
        >
          ${toggle}<span class="label"
            >${row.group?.label ?? task?.name ?? ""}</span
          >
          ${
            row.group
              ? html`<span class="count"
                  >(${fill(this.text.rowCount, { count: row.group.count })})</span
                >`
              : nothing
          }
        </div>`;
      if (row.group)
        return column.id === "code"
          ? html`<div>
              ${fill(this.text.rowCount, { count: row.group.count })}
            </div>`
          : html`<div></div>`;
      return this.cellValue(column.id, task!, column, span);
    });
    return html`<div
      class="row ${row.kind} ${collapsed ? "collapsed" : ""} ${this.selected === task?.id ? "selected" : ""}"
      style=${`inset-block-start:${index * this.rowHeight}px`}
      @click=${() => task && this.select(task)}
      @dblclick=${() => task && this.emit<GanttTaskDetail>("task-open", { task })}
    >
      <div class="cell" style=${`--columns:${this.template}`}>${cells}</div>
      <div class="track" style=${`--timeline-w:${this.timeline.width}px`}>
        ${
          this.groupBy === "resource" && row.kind === "group"
            ? this.loadCells(row.group!.key)
            : nothing
        }
        ${this.renderBar(row)}${baseline}
      </div>
    </div>`;
  }

  private renderDeps(rows: Row[]) {
    const rowOf = new Map<string, number>();
    rows.forEach((row, index) => {
      if (row.task) rowOf.set(row.task.id, index);
    });
    const byId = new Map(this.tasks.map((task) => [task.id, task]));
    const children = this.childMap;
    const mid = this.rowHeight / 2;
    const parts: string[] = [];
    for (const row of rows.slice(this.windowStart, this.windowEnd)) {
      const task = row.task;
      if (!task || !(task.deps ?? []).length) continue;
      const to = rowOf.get(task.id);
      if (to === undefined) continue;
      for (const depId of task.deps ?? []) {
        const from = rowOf.get(depId);
        const predecessor = byId.get(depId);
        if (
          from === undefined ||
          !predecessor ||
          (children.get(depId) ?? []).length
        )
          continue;
        const x1 =
          this.x(predecessor.end) +
          this.widthOf(predecessor.end, predecessor.end);
        const y1 = from * this.rowHeight + mid;
        const x2 = this.x(task.start);
        const y2 = to * this.rowHeight + mid;
        const bend = Math.max(x1 + 8, x2 - 14);
        const hot =
          this.drag?.kind === "link" && this.drag.targetId === task.id
            ? "hot"
            : "";
        parts.push(
          `<path class="${hot}" d="M${x1} ${y1} H${bend} V${y2} H${x2 - 5}"/>`,
          `<path class="arrow ${hot}" d="M${x2 - 5} ${y2 - 4} L${x2} ${y2} L${x2 - 5} ${y2 + 4} Z"/>`,
        );
      }
    }
    return html`<svg
      class="deps"
      style=${`inset-inline-start:${this.gridWidth}px;inline-size:${this.timeline.width}px;block-size:${rows.length * this.rowHeight}px`}
    >
      ${unsafeSVG(parts.join(""))}
    </svg>`;
  }

  private renderRows(rows: Row[]) {
    return html`<div
      class="rows"
      style=${`block-size:${rows.length * this.rowHeight}px`}
    >
      ${rows
        .slice(this.windowStart, this.windowEnd)
        .map((row, offset) => this.renderRow(row, this.windowStart + offset))}
      ${this.renderDeps(rows)}
    </div>`;
  }

  private renderNote() {
    const drag = this.drag;
    if (!drag) return nothing;
    if (drag.kind === "link") {
      const target = this.tasks.find((task) => task.id === drag.targetId);
      return html`<div class="drag-note" role="presentation">
        ${
          target
            ? fill(this.text.linkTarget, { code: target.code ?? target.name })
            : this.text.linkHint
        }
      </div>`;
    }
    if (drag.refused)
      return html`<div
        class="drag-note"
        data-refused="true"
        role="presentation"
      >
        ${drag.refused}
      </div>`;
    return html`<div class="drag-note" role="presentation">
      ${this.dateLabel(drag.start)} → ${this.dateLabel(drag.end)}
    </div>`;
  }

  private renderState() {
    if (this.loading)
      return html`<div class="state" part="loading">
        <slot name="loading"
          >${
            this.loadingRenderer
              ? this.loadingRenderer(this)
              : html`<bolle-loading-indicator
                    label=${this.text.loading}
                  ></bolle-loading-indicator>
                  <p>${this.text.loading}</p>`
          }</slot
        >
      </div>`;
    if (this.error)
      return html`<div class="state" part="error" role="alert">
        <slot name="error"
          >${
            this.errorRenderer
              ? this.errorRenderer(this)
              : html`<span class="state-icon">${alertIcon()}</span>
                  <p>${this.error || this.text.error}</p>
                  <bolle-button
                    variant="tonal"
                    @click=${() => this.emit("retry", {})}
                    >${refreshIcon()} ${this.text.retry}</bolle-button
                  >`
          }</slot
        >
      </div>`;
    return html`<div class="state" part="empty">
      <slot name="empty"
        >${
          this.emptyRenderer
            ? this.emptyRenderer(this)
            : html`<span class="state-icon">${databaseOffIcon()}</span>
                <p>${this.emptyLabel || this.text.empty}</p>`
        }</slot
      >
    </div>`;
  }

  protected render() {
    const rows = this.rows;
    const empty = !rows.length;
    const state = this.loading || Boolean(this.error) || empty;
    const timeline = this.timeline;
    const text = this.text;
    const gridWidth = this.gridWidth;
    return html`<div
      class="gantt"
      style=${`--grid-w:${gridWidth}px;--day-w:${timeline.dayW}px;--timeline-w:${timeline.width}px`}
    >
      <div class="toolbar">
        <bolle-segmented-buttons
          label=${text.scale}
          .value=${this.scale}
          .items=${[
            { id: "day", label: text.scaleDay },
            { id: "week", label: text.scaleWeek },
            { id: "month", label: text.scaleMonth },
            { id: "quarter", label: text.scaleQuarter },
          ]}
          @change=${(event: CustomEvent<{ value: string }>) =>
            this.setScale(event.detail.value as GanttScale)}
        ></bolle-segmented-buttons>
        <bolle-segmented-buttons
          label=${text.density}
          .value=${this.density}
          .items=${[
            { id: "comfortable", label: text.densityComfortable },
            { id: "compact", label: text.densityCompact },
          ]}
          @change=${(event: CustomEvent<{ value: string }>) =>
            this.setDensity(event.detail.value as "comfortable" | "compact")}
        ></bolle-segmented-buttons>
        <span class="spacer"></span>
        <bolle-switch
          label=${text.baseline}
          .checked=${this.baseline}
          @change=${(event: CustomEvent<{ checked: boolean }>) => this.setBaseline(event.detail.checked)}
        ></bolle-switch>
        <bolle-button variant="tonal" @click=${this.openColumns}
          >${columnsIcon()} ${text.columns}</bolle-button
        >
      </div>

      <div class="frame">
        <div class="chart" @scroll=${this.onScroll}>
          <div class="inner" style=${`--timeline-w:${timeline.width}px`}>
            <div class="head">
              <div class="corner" style=${`--columns:${this.template}`}>
                ${this.visibleColumns.map(
                  (column) =>
                    html`<div class="col-head">
                      ${column.label}
                      <span
                        class="grip"
                        role="separator"
                        aria-orientation="vertical"
                        @pointerdown=${(event: PointerEvent) => this.startColumnResize(event, column)}
                      ></span>
                    </div>`,
                )}
              </div>
              <div class="head-time">${this.renderTicks()}</div>
            </div>
            ${state ? this.renderState() : this.renderRows(rows)}
            ${
              this.todayX >= 0
                ? html`<span
                    class="today"
                    style=${`inset-inline-start:${gridWidth + this.todayX}px`}
                  >
                    <span class="sr-only">${text.today}</span>
                  </span>`
                : nothing
            }
          </div>
        </div>
      </div>

      ${
        this.contentStyles
          ? html`<style>
              ${unsafeCSS(this.contentStyles)}
            </style>`
          : nothing
      }
      ${this.renderNote()}
      <bolle-menu
        menu-label=${text.columns}
        @menu-select=${this.onMenuSelect}
      ></bolle-menu>
      <p class="sr-only" role="status" aria-live="polite">
        ${this._announcement}
      </p>
    </div>`;
  }
}
