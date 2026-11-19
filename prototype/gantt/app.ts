// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
// Pianificazione a barre: scale giorno/settimana/mese/trimestre, dipendenze,
// raggruppamenti, baseline, carico risorse, virtualizzazione e modifica da
// puntatore e da tastiera.

import { LitElement, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import "../../src/index.js";
import type { BolleMenu, MenuEntry, MenuSelectDetail } from "../../src/index.js";
import chevronDown from "@tabler/icons/outline/chevron-down.svg?raw";
import chevronRight from "@tabler/icons/outline/chevron-right.svg?raw";
import dots from "@tabler/icons/outline/dots-vertical.svg?raw";
import columnsIcon from "@tabler/icons/outline/columns-3.svg?raw";
import alert from "@tabler/icons/outline/alert-triangle.svg?raw";
import refresh from "@tabler/icons/outline/refresh.svg?raw";
import databaseOff from "@tabler/icons/outline/database-off.svg?raw";
import chartIcon from "@tabler/icons/outline/chart-bar.svg?raw";
import {
  CAPACITY,
  TODAY,
  addDays,
  diffDays,
  isWeekend,
  iso,
  loadOn,
  makeTasks,
  parseISO,
  startOfMonth,
  startOfQuarter,
  workingDays,
  type GroupBy,
  type Row,
  type Task,
} from "./data.js";

const icon = (svg: string, extra = "") =>
  html`<span class="icon ${extra}" aria-hidden="true">${unsafeSVG(svg)}</span>`;

type Scale = "day" | "week" | "month" | "quarter";
type Scenario = "normal" | "loading" | "empty" | "error";

interface Column {
  id: string;
  label: string;
  width: number;
  visible: boolean;
}

const COLUMNS: Column[] = [
  { id: "code", label: "Codice", width: 118, visible: true },
  { id: "name", label: "Attività", width: 240, visible: true },
  { id: "resource", label: "Responsabile", width: 132, visible: true },
  { id: "start", label: "Inizio", width: 86, visible: true },
  { id: "end", label: "Fine", width: 86, visible: true },
  { id: "duration", label: "Giorni", width: 62, visible: true },
  { id: "progress", label: "Avanz.", width: 62, visible: true },
  { id: "load", label: "Carico", width: 70, visible: false },
  { id: "deps", label: "Predecessori", width: 96, visible: false },
];

const DAY_WIDTH: Record<Scale, number> = { day: 34, week: 12, month: 4, quarter: 1.6 };
const STEP: Record<Scale, number> = { day: 1, week: 7, month: 1, quarter: 1 };
const MONTHS = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];
const MONTHS_SHORT = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];

const dateFormat = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
const formatDate = (value: string) => dateFormat.format(parseISO(value));
const monthLabel = (value: string) => `${MONTHS[Number(value.slice(5, 7)) - 1]} ${value.slice(0, 4)}`;

const isoWeek = (value: string) => {
  const date = parseISO(value);
  const target = new Date(date.getTime());
  const day = (date.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - day + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 86_400_000));
};

const mondayOf = (value: string) => addDays(value, -((parseISO(value).getUTCDay() + 6) % 7));

interface Drag {
  kind: "move" | "resize-start" | "resize-end" | "link";
  taskId: string;
  pointerX: number;
  start: string;
  end: string;
  days: number;
  targetId: string;
  refused: string;
}

export class ProtoGanttApp extends LitElement {
  static properties = {
    tasks: { state: true },
    query: { state: true },
    groupBy: { state: true },
    scale: { state: true },
    density: { state: true },
    showBaseline: { state: true },
    theme: { state: true },
    direction: { state: true },
    selected: { state: true },
    collapsed: { state: true },
    columns: { state: true },
    scenario: { state: true },
    drag: { state: true },
    windowStart: { state: true },
    windowEnd: { state: true },
    announcement: { state: true },
  };

  declare tasks: Task[];
  declare query: string;
  declare groupBy: GroupBy;
  declare scale: Scale;
  declare density: "comfortable" | "compact";
  declare showBaseline: boolean;
  declare theme: "light" | "dark";
  declare direction: "ltr" | "rtl";
  declare selected: string;
  declare collapsed: string[];
  declare columns: Column[];
  declare scenario: Scenario;
  declare drag: Drag | undefined;
  declare windowStart: number;
  declare windowEnd: number;
  declare announcement: string;

  private menuContext: { kind: "columns" } | { kind: "row"; id: string } | undefined;
  private columnsTouched = false;
  private initialScrollDone = false;
  private dragPointer = { x: 0, y: 0 };
  private scrollTop = 0;
  private viewport = 600;
  private loadIndex = new Map<string, Map<string, number>>();
  private plannedStart = new Map<string, string>();
  private observer?: ResizeObserver;

  constructor() {
    super();
    this.tasks = makeTasks();
    // The plan as loaded: the only position an activity may be moved back to.
    this.plannedStart = new Map(this.tasks.map((task) => [task.id, task.start]));
    this.query = "";
    this.groupBy = "wbs";
    this.scale = "week";
    this.density = "comfortable";
    this.showBaseline = true;
    this.theme = "light";
    this.direction = "ltr";
    this.selected = "";
    this.collapsed = [];
    this.columns = COLUMNS.map((column) => ({ ...column }));
    this.scenario = "normal";
    this.windowStart = 0;
    this.windowEnd = 60;
    this.announcement = "";
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this.onResize);
    this.observer = new ResizeObserver(() => {
      const chart = this.querySelector<HTMLElement>(".chart");
      if (chart) this.viewport = chart.clientHeight;
      this.measure();
    });
    requestAnimationFrame(() => {
      const chart = this.querySelector<HTMLElement>(".chart");
      if (!chart) return;
      this.observer?.observe(chart);
      this.viewport = chart.clientHeight;
      this.applyColumnPreset();
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

  private onResize = () => this.applyColumnPreset();

  /** Changing the scale keeps the date at the left edge, not the pixel offset. */
  private setScale(scale: Scale) {
    if (scale === this.scale) return;
    const chart = this.querySelector<HTMLElement>(".chart");
    const anchor = chart
      ? addDays(this.timeline.start, Math.round(chart.scrollLeft / this.timeline.dayW))
      : this.timeline.start;
    this.scale = scale;
    requestAnimationFrame(() => {
      const current = this.querySelector<HTMLElement>(".chart");
      if (current) current.scrollLeft = Math.max(0, diffDays(this.timeline.start, anchor) * this.timeline.dayW);
    });
  }

  /**
   * Opens on the first activity of the first row, not on the padded origin of the timeline.
   * Opening on the current date would be empty whenever the first rows are already closed.
   */
  private scrollToStart(chart: HTMLElement) {
    const first = this.rows.find((row) => row.task)?.task;
    chart.scrollLeft = Math.max(0, this.x(first?.start ?? this.timeline.start) - 60);
  }

  /**
   * The grid column narrows as the window does, so the timeline keeps a usable width.
   * A manual choice in the columns menu wins until the window is resized again.
   */
  private applyColumnPreset() {
    if (this.columnsTouched) return;
    const width = window.innerWidth;
    const narrow = width < 720;
    const preset =
      narrow
        ? ["name"]
        : width < 900
          ? ["name", "resource"]
          : width < 1180
            ? ["code", "name", "resource", "start", "end"]
            : ["code", "name", "resource", "start", "end", "duration", "progress"];
    const next = this.columns.map((column) => ({
      ...column,
      width: column.id === "name" && narrow ? 190 : column.id === "name" && width < 1180 ? 210 : column.width,
      visible: preset.includes(column.id),
    }));
    if (JSON.stringify(next) !== JSON.stringify(this.columns)) this.columns = next;
  }

  /** The note follows the pointer, so its position is written outside the reactive render. */
  private positionNote() {
    const note = this.querySelector<HTMLElement>(".drag-note");
    if (!note) return;
    note.style.left = `${this.dragPointer.x + 16}px`;
    note.style.top = `${this.dragPointer.y + 20}px`;
  }

  protected updated() {
    if (this.drag) this.positionNote();
  }

  private announce(message: string) {
    this.announcement = "";
    requestAnimationFrame(() => (this.announcement = message));
  }

  /* Data ------------------------------------------------------------------ */

  private get index() {
    return new Map(this.tasks.map((task) => [task.id, task]));
  }

  private get children() {
    const map = new Map<string, Task[]>();
    for (const task of this.tasks) {
      if (!task.parent) continue;
      const list = map.get(task.parent) ?? [];
      list.push(task);
      map.set(task.parent, list);
    }
    return map;
  }

  private matches(task: Task) {
    const query = this.query.trim().toLocaleLowerCase();
    if (!query) return true;
    return `${task.code} ${task.name} ${task.resource}`.toLocaleLowerCase().includes(query);
  }

  private get filtered() {
    return this.tasks.filter((task) => this.matches(task));
  }

  private rowCache?: Row[];

  private applyHarness() {
    const root = document.documentElement;
    root.dataset.theme = this.theme;
    root.dir = this.direction;
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("theme") || changed.has("direction")) this.applyHarness();
    if (
      changed.has("tasks") ||
      changed.has("query") ||
      changed.has("groupBy") ||
      changed.has("collapsed")
    )
      this.rowCache = undefined;
  }

  /** Rows in reading order for the current grouping, with collapses applied. */
  private get rows(): Row[] {
    if (this.rowCache) return this.rowCache;
    this.rowCache = this.buildRows();
    return this.rowCache;
  }

  private buildRows(): Row[] {
    const filtered = this.filtered;
    const visible = new Set(filtered.map((task) => task.id));
    const children = this.children;
    const rows: Row[] = [];

    const pushTask = (task: Task, depth: number) => {
      const kids = children.get(task.id) ?? [];
      const shown = kids.filter((child) => visible.has(child.id));
      rows.push({
        id: task.id,
        task,
        depth,
        kind: shown.length ? "summary" : "task",
        span: shown.length ? this.rollup(shown) : undefined,
      });
      if (shown.length && !this.collapsed.includes(task.id)) {
        for (const child of shown) pushTask(child, depth + 1);
      }
    };

    if (this.groupBy === "wbs") {
      for (const task of filtered) if (!task.parent) pushTask(task, 0);
      return rows;
    }

    const key = (task: Task) => (this.groupBy === "resource" ? task.resource : this.phaseOf(task));
    const groups = new Map<string, Task[]>();
    for (const task of filtered) {
      const name = key(task);
      const list = groups.get(name) ?? [];
      list.push(task);
      groups.set(name, list);
    }
    for (const [name, list] of [...groups].sort((a, b) => a[0].localeCompare(b[0], "it"))) {
      rows.push({
        id: `group:${name}`,
        group: { key: name, label: name, count: list.length },
        depth: 0,
        kind: "group",
      });
      if (this.collapsed.includes(`group:${name}`)) continue;
      for (const task of list.sort((a, b) => a.start.localeCompare(b.start)))
        rows.push({
          id: `g:${task.id}`,
          task,
          depth: 1,
          kind: "task",
          span: undefined,
        });
    }
    return rows;
  }

  private phaseOf(task: Task) {
    const order = ["Progettazione", "Autorizzazioni", "Approvvigionamento", "Cantiere", "Collaudo", "Consegna"];
    return order[Number(task.code.split(".")[1] ?? 1) % order.length];
  }

  private rollup(tasks: Task[]) {
    const start = tasks.reduce((min, task) => (task.start < min ? task.start : min), tasks[0].start);
    const end = tasks.reduce((max, task) => (task.end > max ? task.end : max), tasks[0].end);
    const progress = Math.round(
      tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length,
    );
    return { start, end, progress };
  }

  private spanOf(row: Row) {
    if (row.group) return undefined;
    if (row.span) return row.span;
    return row.task ? { start: row.task.start, end: row.task.end, progress: row.task.progress } : undefined;
  }

  /* Timeline -------------------------------------------------------------- */

  private get timeline() {
    const visible = this.filtered.length ? this.filtered : this.tasks;
    let min = visible[0].start;
    let max = visible[0].end;
    for (const task of visible) {
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
    return Math.round(diffDays(this.timeline.start, value) * this.timeline.dayW);
  }

  private widthOf(start: string, end: string) {
    return Math.round((diffDays(start, end) + 1) * this.timeline.dayW);
  }

  private get todayX() {
    if (TODAY < this.timeline.start || TODAY > this.timeline.end) return -1;
    return this.x(TODAY);
  }

  /* Windows --------------------------------------------------------------- */

  private measure() {
    const rowH = this.density === "compact" ? 30 : 40;
    const first = Math.max(0, Math.floor(this.scrollTop / rowH) - 6);
    const last = Math.min(this.rows.length, Math.ceil((this.scrollTop + this.viewport) / rowH) + 6);
    if (first !== this.windowStart) this.windowStart = first;
    if (last !== this.windowEnd) this.windowEnd = last;
  }

  private onScroll = (event: Event) => {
    this.scrollTop = (event.currentTarget as HTMLElement).scrollTop;
    this.measure();
  };

  /* Load index ------------------------------------------------------------ */

  private buildLoad() {
    const index = new Map<string, Map<string, number>>();
    if (this.groupBy !== "resource") {
      this.loadIndex = index;
      return;
    }
    for (const task of this.filtered) {
      // Project rows are summaries: the hours sit on the activities.
      if (!task.parent || task.milestone) continue;
      const perDay = task.hours / workingDays(task.start, task.end);
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
    this.loadIndex = index;
  }

  /* Moving ---------------------------------------------------------------- */

  /**
   * The earliest start the application accepts: today, unless the activity was already
   * running at load time, in which case it is the position it had in the loaded plan.
   */
  private rule(task: Task, start: string) {
    // The floor is today, unless the activity was already running before today: then it is
    // the position it had when the plan was loaded. A move forward therefore stays reversible.
    const planned = this.plannedStart.get(task.id) ?? task.start;
    const floor = planned < TODAY ? planned : TODAY;
    if (start < floor) return `Non si sposta un'attività prima del ${formatDate(floor)}.`;
    if (task.milestone && isWeekend(start)) return "Una scadenza non cade di sabato o domenica.";
    return "";
  }

  /** A finish-to-start link is refused when it would close a loop. */
  private createsLoop(from: string, to: string) {
    const seen = new Set<string>();
    const walk = (id: string): boolean => {
      if (id === from) return true;
      if (seen.has(id)) return false;
      seen.add(id);
      const task = this.index.get(id);
      return task ? task.deps.some(walk) : false;
    };
    return walk(to);
  }

  private patch(taskId: string, patch: Partial<Task>) {
    this.tasks = this.tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task));
  }

  private moveBy(task: Task, days: number, edge: "start" | "end" | "both") {
    const start = edge === "end" ? task.start : addDays(task.start, days);
    const end = edge === "start" ? task.end : addDays(task.end, days);
    const reason = this.rule(task, start);
    if (reason) {
      this.announce(reason);
      return false;
    }
    if (end < start) return false;
    this.patch(task.id, { start, end });
    this.announce(
      `${task.code} ${edge === "end" ? "conclusa il" : "inizia il"} ${formatDate(edge === "end" ? end : start)}.`,
    );
    return true;
  }

  private addDependency(from: Task, to: Task) {
    if (from.id === to.id) return false;
    if (from.deps.includes(to.id)) {
      this.announce("La dipendenza esiste già.");
      return false;
    }
    if (this.createsLoop(from.id, to.id)) {
      this.announce("La dipendenza chiuderebbe un ciclo.");
      return false;
    }
    this.patch(from.id, { deps: [...from.deps, to.id] });
    this.announce(`${to.code} precede ${from.code}.`);
    return true;
  }

  /* Pointer --------------------------------------------------------------- */

  private startDrag(event: PointerEvent, task: Task, kind: Drag["kind"]) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLElement;
    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      /* A pointer without capture still tracks through the listeners below. */
    }
    this.selected = task.id;
    this.dragPointer = { x: event.clientX, y: event.clientY };
    this.drag = {
      kind,
      taskId: task.id,
      pointerX: event.clientX,
      start: task.start,
      end: task.end,
      days: 0,
      targetId: "",
      refused: "",
    };
    const move = (moveEvent: PointerEvent) => {
      const days = Math.round((moveEvent.clientX - event.clientX) / this.timeline.dayW);
      if (kind === "link") {
        const under = (this.renderRoot as ShadowRoot).elementsFromPoint
          ? (this.renderRoot as ShadowRoot).elementsFromPoint(moveEvent.clientX, moveEvent.clientY)
          : document.elementsFromPoint(moveEvent.clientX, moveEvent.clientY);
        const bar = under
          .map((element) => (element as HTMLElement).closest?.("[data-task]"))
          .find((element) => element instanceof HTMLElement) as HTMLElement | undefined;
        const targetId = bar?.dataset.task ?? "";
        this.dragPointer = { x: moveEvent.clientX, y: moveEvent.clientY };
        this.drag = { ...this.drag!, targetId, pointerX: moveEvent.clientX };
        this.positionNote();
        return;
      }
      const start =
        kind === "resize-end" ? task.start : addDays(task.start, days);
      const end = kind === "resize-start" ? task.end : addDays(task.end, days);
      const refused = end < start ? "La fine non può precedere l'inizio." : this.rule(task, start);
      this.dragPointer = { x: moveEvent.clientX, y: moveEvent.clientY };
      this.drag = { ...this.drag!, days, start, end, refused };
      this.positionNote();
    };
    const cancel = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key !== "Escape") return;
      keyEvent.preventDefault();
      stop(true);
    };
    const stop = (cancelled = false) => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", abort);
      window.removeEventListener("keydown", cancel, true);
      const drag = this.drag;
      this.drag = undefined;
      if (!drag || cancelled) {
        if (cancelled) this.announce("Modifica annullata.");
        return;
      }
      if (drag.kind === "link") {
        const target = this.index.get(drag.targetId);
        if (target) this.addDependency(task, target);
        return;
      }
      if (drag.refused) {
        this.announce(drag.refused);
        return;
      }
      if (!drag.days) return;
      this.patch(task.id, { start: drag.start, end: drag.end });
      this.announce(
        `${task.code}: ${formatDate(drag.start)} → ${formatDate(drag.end)}.`,
      );
    };
    const up = () => stop(false);
    const abort = () => stop(true);
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", abort);
    window.addEventListener("keydown", cancel, true);
  }

  private onKey(event: KeyboardEvent, task: Task) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.selected = task.id;
      return;
    }
    if (!event.altKey) return;
    const down = event.key === "ArrowRight";
    const upKey = event.key === "ArrowLeft";
    if (!down && !upKey) return;
    event.preventDefault();
    const step = STEP[this.scale] * (down ? 1 : -1);
    if (event.shiftKey) this.moveBy(task, step, "end");
    else this.moveBy(task, step, "both");
  }

  /* Columns --------------------------------------------------------------- */

  private get visibleColumns() {
    return this.columns.filter((column) => column.visible);
  }

  private get template() {
    return this.visibleColumns
      .map((column) => (column.id === "name" ? `minmax(120px, ${column.width}px)` : `${column.width}px`))
      .join(" ");
  }

  private get gridWidth() {
    return this.visibleColumns.reduce((sum, column) => sum + column.width, 0);
  }

  private startColumnResize(event: PointerEvent, column: Column) {
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const startWidth = column.width;
    const move = (moveEvent: PointerEvent) => {
      const width = Math.max(56, Math.round(startWidth + (moveEvent.clientX - startX)));
      this.columns = this.columns.map((item) => (item.id === column.id ? { ...item, width } : item));
    };
    const stop = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
  }

  private openColumns(event: Event) {
    const menu = this.querySelector<BolleMenu>("bolle-menu#columns");
    if (!menu) return;
    const items: MenuEntry[] = this.columns.map((column) => ({
      id: column.id,
      label: column.label,
      selected: column.visible,
      disabled: column.visible && this.visibleColumns.length <= 1,
    }));
    menu.items = items;
    menu.menuLabel = "Colonne";
    menu.selectionMode = "multi";
    menu.setSelection(this.visibleColumns.map((column) => column.id));
    this.menuContext = { kind: "columns" };
    void menu.show(event.currentTarget as HTMLElement);
  }

  private onMenuSelect = (event: CustomEvent<MenuSelectDetail>) => {
    const context = this.menuContext;
    this.menuContext = undefined;
    if (!context) return;
    if (context.kind === "columns") {
      this.columnsTouched = true;
      const shown = new Set(event.detail.selectedIds);
      this.columns = this.columns.map((column) => ({ ...column, visible: shown.has(column.id) }));
      return;
    }
  };

  private toggle(id: string) {
    this.collapsed = this.collapsed.includes(id)
      ? this.collapsed.filter((item) => item !== id)
      : [...this.collapsed, id];
  }

  /* Rendering ------------------------------------------------------------- */

  private renderTicks() {
    const { start, end, dayW } = this.timeline;
    const primary: unknown[] = [];
    const secondary: unknown[] = [];
    const coarse = this.scale === "month" || this.scale === "quarter";

    if (coarse) {
      // The coarse scales repeat the month in the primary row: the year spans its months.
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
        const left = this.x(cursor);
        const width = this.widthOf(cursor, addDays(startOfMonth(addDays(cursor, 32)), -1));
        primary.push(
          html`<span class="tick" style=${`inset-inline-start:${left}px;inline-size:${Math.max(1, width)}px`}>
            ${monthLabel(cursor)}
          </span>`,
        );
        cursor = addDays(startOfMonth(addDays(cursor, 32)), 0);
      }
    }

    if (this.scale === "day") {
      for (let day = start; day <= end; day = addDays(day, 1)) {
        secondary.push(
          html`<span
            class="tick"
            data-weekend=${isWeekend(day) ? "true" : nothing}
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
            >S${isoWeek(day)}</span
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
            >${MONTHS_SHORT[Number(month.slice(5, 7)) - 1]}</span
          >`,
        );
        month = next;
      }
    } else {
      let quarter = startOfQuarter(start);
      while (quarter <= end) {
        const month = Number(quarter.slice(5, 7));
        const next = startOfMonth(addDays(quarter, 95));
        secondary.push(
          html`<span
            class="tick"
            style=${`inset-inline-start:${this.x(quarter)}px;inline-size:${Math.round(dayW * diffDays(quarter, next))}px`}
            >Q${Math.ceil(month / 3)}</span
          >`,
        );
        quarter = next;
      }
    }

    return html`
      <div class="head-row primary">${primary}</div>
      <div class="head-row">${secondary}</div>
    `;
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
      const label = `${task!.code} ${task!.name}, ${formatDate(task!.start)}`;
      return html`<div
        class="milestone ${active ? "dragging" : ""} ${this.drag?.refused && active ? "refused" : ""}"
        role="button"
        tabindex="0"
        data-task=${task!.id}
        aria-label=${label}
        style=${`inset-inline-start:${left}px`}
        @pointerdown=${(event: PointerEvent) => this.startDrag(event, task!, "move")}
        @keydown=${(event: KeyboardEvent) => this.onKey(event, task!)}
      ></div>`;
    }
    const dragging = active && this.drag?.kind !== "link";
    return html`<div
      class="bar ${dragging ? "dragging" : ""} ${dragging && this.drag?.refused ? "refused" : ""}"
      role="button"
      tabindex="0"
      data-task=${task!.id}
      aria-label=${`${task!.code} ${task!.name}, dal ${formatDate(span.start)} al ${formatDate(span.end)}, ${span.progress}%`}
      style=${`inset-inline-start:${left}px;inline-size:${Math.max(10, width)}px`}
      @pointerdown=${(event: PointerEvent) => this.startDrag(event, task!, "move")}
      @keydown=${(event: KeyboardEvent) => this.onKey(event, task!)}
    >
      <span class="fill" style=${`inline-size:${span.progress}%`}></span>
      ${width > 90 ? html`<span class="bar-label">${task!.name}</span>` : nothing}
      <span class="handle start" @pointerdown=${(event: PointerEvent) => this.startDrag(event, task!, "resize-start")}></span>
      <span class="handle end" @pointerdown=${(event: PointerEvent) => this.startDrag(event, task!, "resize-end")}></span>
    </div>
    <span
      class="link"
      role="button"
      tabindex="-1"
      data-link=${task!.id}
      title="Collega a un'altra attività"
      aria-label=${`Collega ${task!.code} a un'altra attività`}
      style=${`inset-inline-start:${left + Math.max(10, width) + 8}px`}
      @pointerdown=${(event: PointerEvent) => this.startDrag(event, task!, "link")}
    ></span>`;
  }

  private renderRow(row: Row, index: number) {
    const task = row.task;
    const span = this.spanOf(row);
    const baseline =
      task?.baseline && row.kind === "task" && this.showBaseline
        ? html`<div
            class="baseline"
            style=${`inset-inline-start:${this.x(task.baseline.start)}px;inline-size:${Math.max(4, this.widthOf(task.baseline.start, task.baseline.end))}px`}
          ></div>`
        : nothing;
    const toggle =
      row.kind === "summary" || row.kind === "group"
        ? html`<button
            class="toggle"
            aria-expanded=${this.collapsed.includes(row.id) ? "false" : "true"}
            aria-label=${`${this.collapsed.includes(row.id) ? "Espandi" : "Comprimi"} ${task?.name ?? row.group?.label ?? ""}`}
            @click=${() => this.toggle(row.id)}
            >${icon(chevronDown)}</button
          >`
        : html`<span class="toggle" aria-hidden="true"></span>`;
    const cells = this.visibleColumns.map((column) => {
      if (column.id === "name")
        return html`<div class="name" style=${`padding-inline-start:${row.depth * 14 + 4}px`}>
          ${toggle}<span class="label">${row.group?.label ?? task?.name ?? ""}</span>
          ${row.group ? html`<span style="color:var(--md-sys-color-on-surface-variant)">(${row.group.count})</span>` : nothing}
        </div>`;
      if (row.group) return column.id === "code" ? html`<div>${row.group.count} attività</div>` : html`<div></div>`;
      return this.cellValue(column.id, task!, span);
    });
    return html`<div
      class="row ${row.kind} ${this.collapsed.includes(row.id) ? "collapsed" : ""} ${this.selected === task?.id ? "selected" : ""}"
      style=${`inset-block-start:${index * this.rowHeight}px`}
      @click=${() => (this.selected = task?.id ?? "")}
    >
      <div class="cell" style=${`--columns:${this.template}`}>${cells}</div>
      <div class="track" style=${`--timeline-w:${this.timeline.width}px`}>
        ${this.groupBy === "resource" && row.kind === "group" ? this.loadCells(row.group!.key) : nothing}
        ${this.renderBar(row)}${baseline}
      </div>
    </div>`;
  }

  private cellValue(id: string, task: Task, span?: { start: string; end: string; progress: number }) {
    const days = diffDays(task.start, task.end) + 1;
    if (id === "code") return html`<div style="font-family:'JetBrains Mono',monospace">${task.code}</div>`;
    if (id === "resource") return html`<div>${task.resource}</div>`;
    if (id === "start") return html`<div>${formatDate(task.start)}</div>`;
    if (id === "end") return html`<div>${formatDate(task.end)}</div>`;
    if (id === "duration") return html`<div style="font-variant-numeric:tabular-nums">${task.milestone ? "—" : days}</div>`;
    if (id === "progress") return html`<div style="font-variant-numeric:tabular-nums">${span?.progress ?? task.progress}%</div>`;
    if (id === "load") {
      const hours = task.milestone ? 0 : task.hours / workingDays(task.start, task.end);
      const over = hours > CAPACITY;
      return html`<div style="font-variant-numeric:tabular-nums;${over ? "color:var(--md-sys-color-error);font-weight:600" : ""}">
        ${hours.toFixed(1)} h
      </div>`;
    }
    if (id === "deps") return html`<div>${task.deps.length ? task.deps.map((dep) => this.index.get(dep)?.code).join(", ") : "—"}</div>`;
    return html`<div></div>`;
  }

  private get rowHeight() {
    return this.density === "compact" ? 30 : 40;
  }

  /** Load of a resource per column of the timeline, drawn inside the header row of its group. */
  private loadCells(resource: string) {
    const hoursOf = this.loadIndex.get(resource) ?? new Map<string, number>();
    const step = this.scale === "day" ? 1 : 7;
    const cells: unknown[] = [];
    for (let day = this.timeline.start; day <= this.timeline.end; day = addDays(day, step)) {
      let hours = 0;
      let working = 0;
      for (let offset = 0; offset < step; offset += 1) {
        const current = addDays(day, offset);
        if (isWeekend(current)) continue;
        working += 1;
        hours += hoursOf.get(current) ?? 0;
      }
      // A single weekend column carries no capacity at all: it is drawn as a gap, not as idle.
      const average = working ? hours / working : 0;
      const ratio = average / CAPACITY;
      const level = !working ? "off" : ratio > 1.05 ? "over" : ratio > 0.85 ? "full" : ratio > 0.1 ? "some" : "idle";
      cells.push(
        html`<span
          class="load-cell"
          data-level=${level}
          title=${`${resource} · ${formatDate(day)} · ${average.toFixed(1)} h/giorno`}
          style=${`inline-size:${Math.round(this.timeline.dayW * step)}px`}
        ></span>`,
      );
    }
    return html`<div class="load-cells" style=${`--timeline-w:${this.timeline.width}px`}>${cells}</div>`;
  }

  private renderDeps(rows: Row[]) {
    const rowOf = new Map<string, number>();
    rows.forEach((row, index) => {
      if (row.task) rowOf.set(row.task.id, index);
    });
    const mid = this.rowHeight / 2;
    const parts: string[] = [];
    for (const row of rows.slice(this.windowStart, this.windowEnd)) {
      const task = row.task;
      if (!task || !task.deps.length) continue;
      const to = rowOf.get(task.id);
      if (to === undefined) continue;
      for (const depId of task.deps) {
        const from = rowOf.get(depId);
        const predecessor = this.index.get(depId);
        const summary = (this.children.get(depId) ?? []).length > 0;
        if (from === undefined || !predecessor || summary) continue;
        const x1 = this.x(predecessor.end) + this.widthOf(predecessor.end, predecessor.end);
        const y1 = from * this.rowHeight + mid;
        const x2 = this.x(task.start);
        const y2 = to * this.rowHeight + mid;
        const bend = Math.max(x1 + 8, x2 - 14);
        const hot = this.drag?.kind === "link" && this.drag.targetId === task.id ? "hot" : "";
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
    return html`<div class="rows" style=${`block-size:${rows.length * this.rowHeight}px`}>
      ${rows.slice(this.windowStart, this.windowEnd).map(
        (row, offset) => this.renderRow(row, this.windowStart + offset),
      )}
      ${this.renderDeps(rows)}
    </div>`;
  }

  private renderState() {
    if (this.scenario === "loading")
      return html`<div class="state">
        <bolle-loading-indicator label="Caricamento della pianificazione"></bolle-loading-indicator>
        <p>Caricamento della pianificazione…</p>
      </div>`;
    if (this.scenario === "error")
      return html`<div class="state" role="alert">
        ${icon(alert, "state-icon error")}
        <p>Non riusciamo a caricare la pianificazione</p>
        <bolle-button variant="tonal" @click=${() => (this.scenario = "normal")}
          >${icon(refresh)} Riprova</bolle-button
        >
      </div>`;
    return html`<div class="state">
      ${icon(databaseOff)}
      <p>${this.query ? "Nessuna attività corrisponde alla ricerca" : "La pianificazione è vuota"}</p>
      ${this.query
        ? html`<bolle-button variant="tonal" @click=${() => (this.query = "")}>Cancella la ricerca</bolle-button>`
        : nothing}
    </div>`;
  }

  private renderNote() {
    const drag = this.drag;
    if (!drag) return nothing;
    if (drag.kind === "link")
      return html`<div class="drag-note" role="presentation">
        ${drag.targetId
          ? `Rilascia per collegare ${this.index.get(drag.targetId)?.code ?? ""}`
          : "Rilascia su un'altra attività"}
      </div>`;
    if (drag.refused) return html`<div class="drag-note" data-refused="true" role="presentation">${drag.refused}</div>`;
    return html`<div class="drag-note" role="presentation">
      ${formatDate(drag.start)} → ${formatDate(drag.end)}
    </div>`;
  }

  private renderDetail() {
    const task = this.index.get(this.selected);
    if (!task) return nothing;
    const kids = this.children.get(task.id) ?? [];
    return html`<bolle-side-sheet
      id="detail"
      label=${`Attività ${task.code}`}
      close-label="Chiudi il dettaglio"
      @closed=${() => (this.selected = "")}
    >
      <div class="detail">
        <span style="font-family:'JetBrains Mono',monospace;color:var(--md-sys-color-primary)">${task.code}</span>
        <h2>${task.name}</h2>
        <dl class="facts">
          <div><dt>Responsabile</dt><dd>${task.resource}</dd></div>
          <div><dt>Inizio</dt><dd>${formatDate(task.start)}</dd></div>
          <div><dt>Fine</dt><dd>${formatDate(task.end)}</dd></div>
          <div><dt>Durata</dt><dd>${task.milestone ? "milestone" : `${diffDays(task.start, task.end) + 1} giorni`}</dd></div>
          <div><dt>Ore</dt><dd>${task.hours}</dd></div>
          <div><dt>Avanzamento</dt><dd>${task.progress}%</dd></div>
          ${task.baseline
            ? html`<div><dt>Baseline</dt><dd>${formatDate(task.baseline.start)} → ${formatDate(task.baseline.end)}</dd></div>`
            : nothing}
          <div>
            <dt>Predecessori</dt>
            <dd class="chip-row">
              ${task.deps.length
                ? task.deps.map((dep) => html`<span class="kchip">${this.index.get(dep)?.code ?? dep}</span>`)
                : "nessuno"}
            </dd>
          </div>
          ${kids.length ? html`<div><dt>Attività figlie</dt><dd>${kids.length}</dd></div>` : nothing}
        </dl>
        <div class="chip-row">
          <bolle-button variant="tonal" @click=${() => this.moveBy(task, -1, "both")}>−1 giorno</bolle-button>
          <bolle-button variant="tonal" @click=${() => this.moveBy(task, 1, "both")}>+1 giorno</bolle-button>
          <bolle-button variant="text" @click=${() => this.moveBy(task, 7, "end")}>+1 settimana alla fine</bolle-button>
        </div>
      </div>
    </bolle-side-sheet>`;
  }

  protected render() {
    const rows = this.rows;
    const empty = this.scenario === "empty" || !rows.length;
    const state = this.scenario === "loading" || this.scenario === "error" || empty;
    const timeline = this.timeline;
    const columns = this.visibleColumns;
    return html`<div
      class="app"
      data-density=${this.density}
      data-scale=${this.scale}
      style=${`--grid-w:${this.gridWidth}px;--day-w:${timeline.dayW}px;--timeline-w:${timeline.width}px`}
    >
      <header class="topbar">
        <div class="brand">
          <span class="brand-mark">${icon(chartIcon)}</span>
          <div>
            <h1>Pianificazione lavori</h1>
            <p>${this.tasks.length} attività · ${rows.length} righe · ${this.scale === "day" ? "giorno" : this.scale === "week" ? "settimana" : this.scale === "month" ? "mese" : "trimestre"}</p>
          </div>
        </div>
        <div class="topbar-actions">
          <bolle-search
            class="search"
            label="Cerca un'attività"
            placeholder="Codice, attività o responsabile"
            .value=${this.query}
            filter
            @change=${(event: CustomEvent<{ value: string }>) => (this.query = event.detail.value)}
          ></bolle-search>
          <bolle-select
            label="Raggruppa per"
            .value=${this.groupBy}
            @change=${(event: CustomEvent<{ value: string }>) => {
              this.groupBy = event.detail.value as GroupBy;
              this.buildLoad();
            }}
          >
            <option value="wbs">Struttura del lavoro</option>
            <option value="resource">Responsabile</option>
            <option value="phase">Fase</option>
          </bolle-select>
          <bolle-button variant="tonal" @click=${this.openColumns}>${icon(columnsIcon)} Colonne</bolle-button>
          <bolle-select
            label="Scenario di prova"
            .value=${this.scenario}
            @change=${(event: CustomEvent<{ value: string }>) => (this.scenario = event.detail.value as Scenario)}
          >
            <option value="normal">Dati reali</option>
            <option value="loading">In caricamento</option>
            <option value="empty">Senza attività</option>
            <option value="error">In errore</option>
          </bolle-select>
          <bolle-select
            class="harness"
            label="Tema"
            .value=${this.theme}
            @change=${(event: CustomEvent<{ value: string }>) => (this.theme = event.detail.value as "light" | "dark")}
          >
            <option value="light">Chiaro</option>
            <option value="dark">Scuro</option>
          </bolle-select>
          <bolle-select
            class="harness"
            label="Direzione"
            .value=${this.direction}
            @change=${(event: CustomEvent<{ value: string }>) =>
              (this.direction = event.detail.value as "ltr" | "rtl")}
          >
            <option value="ltr">Da sinistra</option>
            <option value="rtl">Da destra</option>
          </bolle-select>
        </div>
      </header>

      <div class="toolbar">
        <bolle-segmented-buttons
          label="Scala temporale"
          .value=${this.scale}
          .items=${[
            { id: "day", label: "Giorno" },
            { id: "week", label: "Settimana" },
            { id: "month", label: "Mese" },
            { id: "quarter", label: "Trimestre" },
          ]}
          @change=${(event: CustomEvent<{ value: string }>) => this.setScale(event.detail.value as Scale)}
        ></bolle-segmented-buttons>
        <span class="spacer"></span>
        <bolle-segmented-buttons
          label="Densità"
          .value=${this.density}
          .items=${[
            { id: "comfortable", label: "Comoda" },
            { id: "compact", label: "Compatta" },
          ]}
          @change=${(event: CustomEvent<{ value: string }>) =>
            (this.density = event.detail.value as "comfortable" | "compact")}
        ></bolle-segmented-buttons>
        <bolle-switch
          label="Piano approvato"
          .checked=${this.showBaseline}
          @change=${(event: CustomEvent<{ checked: boolean }>) => (this.showBaseline = event.detail.checked)}
        ></bolle-switch>
      </div>

      <div class="chart-frame">
      <div class="chart" @scroll=${this.onScroll}>
        <div class="inner" style=${`--timeline-w:${timeline.width}px`}>
          <div class="head">
            <div class="corner" style=${`--columns:${this.template}`}>
              ${columns.map(
                (column) => html`<div class="col-head">
                  ${column.label}
                  <span class="grip" @pointerdown=${(event: PointerEvent) => this.startColumnResize(event, column)}></span>
                </div>`,
              )}
            </div>
            <div class="head-time">${this.renderTicks()}</div>
          </div>
          ${state ? this.renderState() : this.renderRows(rows)}
          ${this.todayX >= 0
            ? html`<span
                class="today"
                style=${`inset-inline-start:${this.gridWidth + this.todayX}px`}
              ></span>`
            : nothing}
        </div>
      </div>
      </div>

      ${this.renderNote()}
      ${this.renderDetail()}
      <bolle-menu id="columns" menu-label="Colonne" @menu-select=${this.onMenuSelect}></bolle-menu>
      <bolle-snackbar close-label="Chiudi"></bolle-snackbar>
      <p class="sr-only" role="status" aria-live="polite">${this.announcement}</p>
    </div>`;
  }
}

customElements.define("proto-gantt-app", ProtoGanttApp);
