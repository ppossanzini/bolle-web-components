// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import "../../src/index.js";
import type {
  BolleMenu,
  BolleSideSheet,
  BolleSnackbar,
  MenuEntry,
  MenuSelectDetail,
  SidebarItem,
} from "../../src/index.js";
import arrowUp from "@tabler/icons/outline/arrow-up.svg?raw";
import arrowDown from "@tabler/icons/outline/arrow-down.svg?raw";
import arrowsSort from "@tabler/icons/outline/arrows-sort.svg?raw";
import dots from "@tabler/icons/outline/dots-vertical.svg?raw";
import chevronRight from "@tabler/icons/outline/chevron-right.svg?raw";
import chevronDown from "@tabler/icons/outline/chevron-down.svg?raw";
import chevronLeft from "@tabler/icons/outline/chevron-left.svg?raw";
import chevronsLeft from "@tabler/icons/outline/chevrons-left.svg?raw";
import chevronsRight from "@tabler/icons/outline/chevrons-right.svg?raw";
import grip from "@tabler/icons/outline/grip-vertical.svg?raw";
import filterIcon from "@tabler/icons/outline/filter.svg?raw";
import columnsIcon from "@tabler/icons/outline/columns-3.svg?raw";
import refresh from "@tabler/icons/outline/refresh.svg?raw";
import alert from "@tabler/icons/outline/alert-triangle.svg?raw";
import databaseOff from "@tabler/icons/outline/database-off.svg?raw";
import filterOff from "@tabler/icons/outline/filter-off.svg?raw";
import pin from "@tabler/icons/outline/pin.svg?raw";
import pinOff from "@tabler/icons/outline/pinned-off.svg?raw";
import close from "@tabler/icons/outline/x.svg?raw";
import plus from "@tabler/icons/outline/plus.svg?raw";
import archive from "@tabler/icons/outline/archive.svg?raw";
import userCheck from "@tabler/icons/outline/user-check.svg?raw";
import arrowLeft from "@tabler/icons/outline/arrow-left.svg?raw";
import arrowRight from "@tabler/icons/outline/arrow-right.svg?raw";
import densityMedium from "@tabler/icons/outline/baseline-density-medium.svg?raw";
import densitySmall from "@tabler/icons/outline/baseline-density-small.svg?raw";
import menuIcon from "@tabler/icons/outline/menu-2.svg?raw";
import layoutRows from "@tabler/icons/outline/layout-rows.svg?raw";
import dashboard from "@tabler/icons/outline/layout-dashboard.svg?raw";
import briefcase from "@tabler/icons/outline/briefcase.svg?raw";
import packageIcon from "@tabler/icons/outline/package.svg?raw";
import tool from "@tabler/icons/outline/tool.svg?raw";
import invoice from "@tabler/icons/outline/file-invoice.svg?raw";
import users from "@tabler/icons/outline/users.svg?raw";
import settings from "@tabler/icons/outline/settings.svg?raw";
import mapPin from "@tabler/icons/outline/map-pin.svg?raw";
import {
  MANAGERS,
  STATUS_LABEL,
  TODAY_ISO,
  makeJobs,
  type Job,
  type JobStatus,
} from "./data.js";

const icon = (svg: string, extra = "") =>
  html`<span class="icon ${extra}" aria-hidden="true">${unsafeSVG(svg)}</span>`;

/* Formatting ------------------------------------------------------------- */
const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const integer = new Intl.NumberFormat("it-IT");
const dateFormat = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T12:00`));
const dayDiff = (from: string, to: string) =>
  Math.round(
    (new Date(`${to}T12:00`).getTime() - new Date(`${from}T12:00`).getTime()) /
      86_400_000,
  );
const isLate = (job: Job) =>
  job.due < TODAY_ISO && job.status !== "chiusa" && job.status !== "collaudo";
const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
const normalize = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const plural = (count: number, one: string, many: string) =>
  `${integer.format(count)} ${count === 1 ? one : many}`;

/* Columns ---------------------------------------------------------------- */
type ColumnKey =
  | "code"
  | "title"
  | "client"
  | "city"
  | "status"
  | "manager"
  | "amount"
  | "progress"
  | "due"
  | "started";

interface ColumnDef {
  key: ColumnKey;
  label: string;
  width: number;
  align?: "end";
  groupable?: boolean;
  compare: (a: Job, b: Job) => number;
}

interface ColumnState {
  key: ColumnKey;
  visible: boolean;
  width: number;
  pinned: boolean;
}

const text = (pick: (job: Job) => string) => (a: Job, b: Job) =>
  pick(a).localeCompare(pick(b), "it");
const number = (pick: (job: Job) => number) => (a: Job, b: Job) =>
  pick(a) - pick(b);
const STATUS_ORDER: JobStatus[] = [
  "offerta",
  "pianificata",
  "in-corso",
  "sospesa",
  "collaudo",
  "chiusa",
];

const COLUMNS: ColumnDef[] = [
  { key: "code", label: "Codice", width: 136, compare: text((j) => j.code) },
  { key: "title", label: "Commessa", width: 320, compare: text((j) => j.title) },
  {
    key: "client",
    label: "Cliente",
    width: 230,
    groupable: true,
    compare: text((j) => j.client),
  },
  {
    key: "city",
    label: "Comune",
    width: 160,
    groupable: true,
    compare: text((j) => j.city),
  },
  {
    key: "status",
    label: "Stato",
    width: 148,
    groupable: true,
    compare: number((j) => STATUS_ORDER.indexOf(j.status)),
  },
  {
    key: "manager",
    label: "Responsabile",
    width: 208,
    groupable: true,
    compare: text((j) => j.manager),
  },
  {
    key: "amount",
    label: "Importo",
    width: 140,
    align: "end",
    compare: number((j) => j.amount),
  },
  {
    key: "progress",
    label: "Avanzamento",
    width: 176,
    compare: number((j) => j.progress),
  },
  { key: "due", label: "Scadenza", width: 168, compare: text((j) => j.due) },
  { key: "started", label: "Inizio", width: 132, compare: text((j) => j.started) },
];
const DEF = Object.fromEntries(COLUMNS.map((c) => [c.key, c])) as Record<
  ColumnKey,
  ColumnDef
>;
const defaultColumns = (): ColumnState[] =>
  COLUMNS.map((column) => ({
    key: column.key,
    visible: column.key !== "started",
    width: column.width,
    pinned: column.key === "code",
  }));

const groupValue = (job: Job, key: ColumnKey) =>
  key === "status" ? STATUS_LABEL[job.status] : String(job[key as keyof Job]);

const SELECT_WIDTH = 52;
const EXPAND_WIDTH = 44;
const ACTIONS_WIDTH = 56;
const MIN_COLUMN = 88;
const MAX_COLUMN = 560;
const OVERSCAN = 8;
const HEIGHTS = {
  comfortable: { row: 52, group: 48, detail: 212 },
  compact: { row: 40, group: 40, detail: 196 },
};

/* Sidebar ---------------------------------------------------------------- */
const navigation: SidebarItem[] = [
  { id: "dashboard", label: "Cruscotto", icon: icon(dashboard) },
  {
    id: "jobs",
    label: "Commesse",
    icon: icon(briefcase),
    count: 248,
    children: [
      { id: "all", label: "Tutte le commesse", count: 248 },
      { id: "mine", label: "Assegnate a me", count: 31 },
      { id: "late", label: "In ritardo", count: 17 },
    ],
  },
  { id: "sites", label: "Cantieri", icon: icon(mapPin) },
  { id: "stock", label: "Magazzino", icon: icon(packageIcon) },
  { id: "maintenance", label: "Manutenzioni", icon: icon(tool), count: 5 },
  { id: "billing", label: "Amministrazione", icon: icon(invoice) },
  { id: "people", label: "Personale", icon: icon(users) },
  { id: "settings", label: "Impostazioni", icon: icon(settings) },
];

/* Model ------------------------------------------------------------------ */
type Mode = "paged" | "virtual";
type Load = "initial" | "ready" | "refreshing" | "error";
type Scenario = "normal" | "slow" | "fail-next" | "empty";
type Density = "comfortable" | "compact";
interface Sort {
  key: ColumnKey;
  dir: "asc" | "desc";
}
interface Filters {
  statuses: JobStatus[];
  managers: string[];
  late: boolean;
  minAmount: string;
  maxAmount: string;
}
const NO_FILTERS: Filters = {
  statuses: [],
  managers: [],
  late: false,
  minAmount: "",
  maxAmount: "",
};

type Line =
  | {
      kind: "group";
      key: string;
      label: string;
      count: number;
      total: number;
      progress: number;
      collapsed: boolean;
    }
  | { kind: "row"; job: Job; index: number }
  | { kind: "detail"; job: Job };

interface Drag {
  key: ColumnKey;
  startX: number;
  dx: number;
  target: number;
  cancelled: boolean;
}

class ProtoTableApp extends LitElement {
  static properties = {
    mode: { state: true },
    load: { state: true },
    scenario: { state: true },
    density: { state: true },
    container: { state: true },
    query: { state: true },
    filters: { state: true },
    sorts: { state: true },
    groupBy: { state: true },
    collapsedGroups: { state: true },
    page: { state: true },
    pageSize: { state: true },
    selected: { state: true },
    expanded: { state: true },
    columns: { state: true },
    result: { state: true },
    total: { state: true },
    narrow: { state: true },
    compactShell: { state: true },
    windowStart: { state: true },
    windowEnd: { state: true },
    scrolledX: { state: true },
    drag: { state: true },
    announcement: { state: true },
    detailJob: { state: true },
    menuJob: { state: true },
  };

  declare mode: Mode;
  declare load: Load;
  declare scenario: Scenario;
  declare density: Density;
  declare container: "card" | "free";
  declare query: string;
  declare filters: Filters;
  declare sorts: Sort[];
  declare groupBy: ColumnKey | "";
  declare collapsedGroups: Set<string>;
  declare page: number;
  declare pageSize: number;
  declare selected: Set<string>;
  declare expanded: Set<string>;
  declare columns: ColumnState[];
  declare result: Job[];
  declare total: number;
  declare narrow: boolean;
  declare compactShell: boolean;
  declare windowStart: number;
  declare windowEnd: number;
  declare scrolledX: boolean;
  declare drag: Drag | undefined;
  declare announcement: string;
  declare detailJob: Job | undefined;
  declare menuJob: Job | undefined;

  constructor() {
    super();
    this.mode = "paged";
    this.load = "initial";
    this.scenario = "normal";
    this.density = "comfortable";
    this.container = "card";
    this.query = "";
    this.filters = { ...NO_FILTERS };
    this.sorts = [{ key: "due", dir: "asc" }];
    this.groupBy = "";
    this.collapsedGroups = new Set<string>();
    this.page = 0;
    this.pageSize = 25;
    this.selected = new Set<string>();
    this.expanded = new Set<string>();
    this.columns = defaultColumns();
    this.result = [];
    this.total = 0;
    this.narrow = false;
    this.compactShell = false;
    this.windowStart = 0;
    this.windowEnd = 40;
    this.scrolledX = false;
    this.announcement = "";
  }

  private source: Record<Mode, Job[]> = {
    paged: makeJobs(248),
    virtual: makeJobs(5000),
  };
  private archived: Job[] = [];
  private request = 0;
  private hadData = false;
  private resizeObserver?: ResizeObserver;
  private visibleObserver?: ResizeObserver;
  private observedScroller?: HTMLElement;
  private menuContext: { kind: "column"; key: ColumnKey } | { kind: "row"; job: Job } | { kind: "bulk"; action: string } | { kind: "scenario" } | { kind: "group" } | { kind: "nav" } | { kind: "page-size" } | undefined;
  private queryTimer?: ReturnType<typeof setTimeout>;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => {
      this.narrow = window.innerWidth < 720;
      this.compactShell = window.innerWidth < 1180;
      this.measureWindow();
      this.measureVisible();
      this.requestUpdate();
    });
    this.resizeObserver.observe(document.documentElement);
    void this.fetch(true);
  }

  disconnectedCallback() {
    this.resizeObserver?.disconnect();
    this.visibleObserver?.disconnect();
    super.disconnectedCallback();
  }

  /* Data: the "server" ------------------------------------------------- */
  private get rows() {
    return this.scenario === "empty" ? [] : this.source[this.mode];
  }

  private jobMatches(job: Job, filters = this.filters, query = this.query) {
    const q = normalize(query.trim());
    if (
      q &&
      !normalize(
        `${job.code} ${job.title} ${job.client} ${job.city} ${job.manager}`,
      ).includes(q)
    )
      return false;
    if (filters.statuses.length && !filters.statuses.includes(job.status))
      return false;
    if (filters.managers.length && !filters.managers.includes(job.manager))
      return false;
    if (filters.late && !isLate(job)) return false;
    const min = Number(filters.minAmount.replace(/\D/g, ""));
    const max = Number(filters.maxAmount.replace(/\D/g, ""));
    if (filters.minAmount && job.amount < min) return false;
    if (filters.maxAmount && job.amount > max) return false;
    return true;
  }

  private compute() {
    const list = this.rows.filter((job) => this.jobMatches(job));
    const sorts = [
      ...(this.groupBy ? [{ key: this.groupBy, dir: "asc" as const }] : []),
      ...this.sorts,
    ];
    list.sort((a, b) => {
      for (const sort of sorts) {
        const value = DEF[sort.key].compare(a, b);
        if (value) return sort.dir === "asc" ? value : -value;
      }
      return a.code.localeCompare(b.code);
    });
    return list;
  }

  private async fetch(initial = false) {
    const ticket = ++this.request;
    this.load = initial || !this.hadData ? "initial" : "refreshing";
    const delay =
      this.scenario === "slow" ? 2200 : initial ? 900 : 260 + Math.random() * 160;
    await new Promise((resolve) => setTimeout(resolve, delay));
    if (ticket !== this.request) return;
    if (this.scenario === "fail-next") {
      this.scenario = "normal";
      this.load = "error";
      this.announce("Caricamento delle commesse non riuscito.");
      return;
    }
    this.result = this.compute();
    this.total = this.rows.length;
    this.hadData = true;
    const pages = Math.max(1, Math.ceil(this.result.length / this.pageSize));
    if (this.page >= pages) this.page = pages - 1;
    this.load = "ready";
    this.announce(this.summaryText());
    await this.updateComplete;
    this.measureWindow();
  }

  private refetch(resetPage = true) {
    if (resetPage) this.page = 0;
    void this.fetch();
  }

  private announce(message: string) {
    this.announcement = "";
    requestAnimationFrame(() => (this.announcement = message));
  }

  private summaryText() {
    const sort = this.sorts
      .map(
        (s) =>
          `${DEF[s.key].label} ${s.dir === "asc" ? "crescente" : "decrescente"}`,
      )
      .join(", poi ");
    const count = plural(this.result.length, "commessa", "commesse");
    return `${count}${sort ? `, ordinate per ${sort}` : ""}${this.groupBy ? `, raggruppate per ${DEF[this.groupBy].label}` : ""}.`;
  }

  /* Derived view ------------------------------------------------------- */
  private get visibleColumns() {
    const shown = this.columns.filter((c) => c.visible);
    return [...shown.filter((c) => c.pinned), ...shown.filter((c) => !c.pinned)];
  }

  private get activeFilterCount() {
    const f = this.filters;
    return (
      (f.statuses.length ? 1 : 0) +
      (f.managers.length ? 1 : 0) +
      (f.late ? 1 : 0) +
      (f.minAmount || f.maxAmount ? 1 : 0)
    );
  }

  private get pageJobs() {
    if (this.mode === "virtual") return this.result;
    const start = this.page * this.pageSize;
    return this.result.slice(start, start + this.pageSize);
  }

  private lines(): Line[] {
    const jobs = this.pageJobs;
    const offset = this.mode === "paged" ? this.page * this.pageSize : 0;
    const lines: Line[] = [];
    const pushRows = (list: Job[]) =>
      list.forEach((job) => {
        lines.push({ kind: "row", job, index: offset + jobs.indexOf(job) });
        if (this.expanded.has(job.id)) lines.push({ kind: "detail", job });
      });
    if (!this.groupBy) {
      pushRows(jobs);
      return lines;
    }
    const groups = new Map<string, Job[]>();
    for (const job of jobs) {
      const key = groupValue(job, this.groupBy);
      groups.set(key, [...(groups.get(key) ?? []), job]);
    }
    for (const [key, members] of groups) {
      const all = this.result.filter(
        (job) => groupValue(job, this.groupBy as ColumnKey) === key,
      );
      const collapsed = this.collapsedGroups.has(key);
      lines.push({
        kind: "group",
        key,
        label: key,
        count: all.length,
        total: all.reduce((sum, job) => sum + job.amount, 0),
        progress: Math.round(
          all.reduce((sum, job) => sum + job.progress, 0) / all.length,
        ),
        collapsed,
      });
      if (!collapsed) pushRows(members);
    }
    return lines;
  }

  private heightOf(line: Line) {
    const h = HEIGHTS[this.density];
    return line.kind === "group" ? h.group : line.kind === "detail" ? h.detail : h.row;
  }

  private get scroller() {
    return this.querySelector<HTMLElement>(".table-scroll");
  }

  private measureWindow = () => {
    const scroller = this.scroller;
    if (!scroller || this.mode !== "virtual") return;
    const lines = this.lines();
    const top = scroller.scrollTop;
    const bottom = top + scroller.clientHeight;
    let y = 0;
    let start = 0;
    let end = lines.length;
    for (let i = 0; i < lines.length; i++) {
      const next = y + this.heightOf(lines[i]);
      if (next < top) start = i + 1;
      if (y > bottom) {
        end = i;
        break;
      }
      y = next;
    }
    this.windowStart = Math.max(0, start - OVERSCAN);
    this.windowEnd = Math.min(lines.length, end + OVERSCAN);
  };

  protected updated() {
    const scroller = this.scroller;
    if (!scroller) return;
    // Track the scroller itself: measuring once per render goes stale on resize.
    if (this.observedScroller !== scroller) {
      this.visibleObserver?.disconnect();
      this.visibleObserver = new ResizeObserver(() => this.measureVisible());
      this.visibleObserver.observe(scroller);
      this.observedScroller = scroller;
    }
    this.measureVisible();
  }

  /** Group headers and previews span what the reader can see, not the full table. */
  private measureVisible() {
    const scroller = this.scroller;
    if (!scroller) return;
    scroller.style.setProperty("--visible-width", `${scroller.clientWidth}px`);
  }

  private onScroll = (event: Event) => {
    const scroller = event.currentTarget as HTMLElement;
    const scrolled = Math.abs(scroller.scrollLeft) > 0;
    if (scrolled !== this.scrolledX) this.scrolledX = scrolled;
    this.measureVisible();
    if (this.mode === "virtual") requestAnimationFrame(this.measureWindow);
  };

  /* Actions ------------------------------------------------------------ */
  private setQuery(value: string) {
    this.query = value;
    clearTimeout(this.queryTimer);
    this.queryTimer = setTimeout(() => this.refetch(), 220);
  }

  private setFilters(filters: Filters) {
    this.filters = filters;
    this.refetch();
  }

  private clearFilters() {
    this.query = "";
    this.filters = { ...NO_FILTERS };
    this.refetch();
  }

  private toggleSort(key: ColumnKey, additive: boolean) {
    const current = this.sorts.find((s) => s.key === key);
    let next: Sort[];
    if (!additive) {
      next = !current
        ? [{ key, dir: "asc" }]
        : current.dir === "asc"
          ? [{ key, dir: "desc" }]
          : [];
    } else if (!current) next = [...this.sorts, { key, dir: "asc" }];
    else if (current.dir === "asc")
      next = this.sorts.map((s) => (s.key === key ? { key, dir: "desc" } : s));
    else next = this.sorts.filter((s) => s.key !== key);
    this.sorts = next;
    this.refetch(false);
  }

  private setSort(key: ColumnKey, dir: "asc" | "desc" | "") {
    this.sorts = dir ? [{ key, dir }] : this.sorts.filter((s) => s.key !== key);
    this.refetch(false);
  }

  private setGroup(key: ColumnKey | "") {
    this.groupBy = key;
    this.collapsedGroups = new Set();
    this.refetch();
  }

  private toggleGroup(key: string) {
    const next = new Set(this.collapsedGroups);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.collapsedGroups = next;
    requestAnimationFrame(this.measureWindow);
  }

  private toggleExpanded(job: Job) {
    const next = new Set(this.expanded);
    if (next.has(job.id)) next.delete(job.id);
    else next.add(job.id);
    this.expanded = next;
    requestAnimationFrame(this.measureWindow);
  }

  private toggleRow(job: Job, checked: boolean) {
    const next = new Set(this.selected);
    if (checked) next.add(job.id);
    else next.delete(job.id);
    this.selected = next;
  }

  private get pageSelection() {
    const ids = this.pageJobs.map((job) => job.id);
    const chosen = ids.filter((id) => this.selected.has(id)).length;
    return { ids, chosen, all: ids.length > 0 && chosen === ids.length };
  }

  private togglePage(checked: boolean) {
    const next = new Set(this.selected);
    for (const id of this.pageSelection.ids)
      if (checked) next.add(id);
      else next.delete(id);
    this.selected = next;
    this.announce(
      checked
        ? `${plural(this.pageSelection.ids.length, "commessa selezionata", "commesse selezionate")}.`
        : "Selezione della pagina annullata.",
    );
  }

  private selectAllMatching() {
    this.selected = new Set(this.result.map((job) => job.id));
    this.announce(
      `${plural(this.selected.size, "commessa selezionata", "commesse selezionate")}.`,
    );
  }

  private archiveJobs(ids: string[]) {
    const removed = this.source[this.mode].filter((job) => ids.includes(job.id));
    this.source[this.mode] = this.source[this.mode].filter(
      (job) => !ids.includes(job.id),
    );
    this.archived = removed;
    this.selected = new Set([...this.selected].filter((id) => !ids.includes(id)));
    this.refetch(false);
    const bar = this.querySelector<BolleSnackbar>("bolle-snackbar");
    if (bar) bar.actionLabel = "Annulla";
    bar?.show(
      removed.length === 1
        ? `Commessa ${removed[0].code} archiviata`
        : `${plural(removed.length, "commessa archiviata", "commesse archiviate")}`,
    );
  }

  private notify(message: string) {
    const bar = this.querySelector<BolleSnackbar>("bolle-snackbar");
    if (!bar) return;
    bar.actionLabel = "";
    bar.show(message);
  }

  private undoArchive() {
    this.source[this.mode] = [...this.source[this.mode], ...this.archived];
    this.archived = [];
    this.refetch(false);
  }

  private updateJobs(ids: string[], patch: Partial<Job>, message: string) {
    this.source[this.mode] = this.source[this.mode].map((job) =>
      ids.includes(job.id) ? { ...job, ...patch } : job,
    );
    this.refetch(false);
    this.notify(message);
  }

  /* Columns ------------------------------------------------------------ */
  private patchColumn(key: ColumnKey, patch: Partial<ColumnState>) {
    this.columns = this.columns.map((c) => (c.key === key ? { ...c, ...patch } : c));
  }

  /** Moves a column by one step inside its zone (pinned or not). */
  private moveColumn(key: ColumnKey, step: -1 | 1) {
    const order = this.visibleColumns;
    const index = order.findIndex((c) => c.key === key);
    const target = index + step;
    const column = order[index];
    if (
      target < 0 ||
      target >= order.length ||
      order[target].pinned !== column.pinned
    ) {
      this.announce(
        `${DEF[key].label} è già ${step < 0 ? "la prima" : "l'ultima"} colonna ${column.pinned ? "fissata" : "mobile"}.`,
      );
      return;
    }
    this.placeColumn(key, order[target].key);
    this.announce(
      `${DEF[key].label} spostata in posizione ${target + 1} di ${order.length}.`,
    );
  }

  /** Puts `key` where `targetKey` is, shifting the rest. */
  private placeColumn(key: ColumnKey, targetKey: ColumnKey) {
    if (key === targetKey) return;
    const list = [...this.columns];
    const from = list.findIndex((c) => c.key === key);
    const to = list.findIndex((c) => c.key === targetKey);
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    this.columns = list;
  }

  private togglePinned(key: ColumnKey) {
    const column = this.columns.find((c) => c.key === key)!;
    this.patchColumn(key, { pinned: !column.pinned });
    this.announce(
      `${DEF[key].label} ${column.pinned ? "non è più fissata" : "fissata a sinistra"}.`,
    );
  }

  private hideColumn(key: ColumnKey) {
    if (this.visibleColumns.length <= 2) return;
    this.patchColumn(key, { visible: false });
    this.announce(`Colonna ${DEF[key].label} nascosta.`);
  }

  private pinnedOffset(key: ColumnKey) {
    let left = SELECT_WIDTH + EXPAND_WIDTH;
    for (const column of this.visibleColumns) {
      if (column.key === key) return left;
      if (column.pinned) left += column.width;
    }
    return left;
  }

  private startResize(event: PointerEvent, key: ColumnKey) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLElement;
    const rtl = getComputedStyle(this).direction === "rtl";
    const startX = event.clientX;
    const startWidth = this.columns.find((c) => c.key === key)!.width;
    handle.setPointerCapture(event.pointerId);
    const move = (e: PointerEvent) =>
      this.patchColumn(key, {
        width: Math.round(
          Math.min(
            MAX_COLUMN,
            Math.max(MIN_COLUMN, startWidth + (e.clientX - startX) * (rtl ? -1 : 1)),
          ),
        ),
      });
    const stop = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  }

  private resizeKeys(event: KeyboardEvent, key: ColumnKey) {
    const rtl = getComputedStyle(this).direction === "rtl";
    const width = this.columns.find((c) => c.key === key)!.width;
    const grow = rtl ? "ArrowLeft" : "ArrowRight";
    const shrink = rtl ? "ArrowRight" : "ArrowLeft";
    const next =
      event.key === grow
        ? width + 16
        : event.key === shrink
          ? width - 16
          : event.key === "Home"
            ? MIN_COLUMN
            : event.key === "End"
              ? MAX_COLUMN
              : event.key === "Enter"
                ? DEF[key].width
                : undefined;
    if (next === undefined) return;
    event.preventDefault();
    this.patchColumn(key, {
      width: Math.min(MAX_COLUMN, Math.max(MIN_COLUMN, next)),
    });
  }

  /** Header drag: the cell follows the pointer, a line shows where it lands. */
  private startDrag(event: PointerEvent, key: ColumnKey) {
    if (event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);
    const order = this.visibleColumns;
    const zone = order.find((c) => c.key === key)!.pinned;
    this.drag = {
      key,
      startX: event.clientX,
      dx: 0,
      target: order.findIndex((c) => c.key === key),
      cancelled: false,
    };
    const move = (e: PointerEvent) => {
      if (!this.drag) return;
      const cells = [...this.querySelectorAll<HTMLElement>("th[data-key]")];
      let target = this.drag.target;
      cells.forEach((cell, index) => {
        if (order[index]?.pinned !== zone) return;
        const rect = cell.getBoundingClientRect();
        if (e.clientX > rect.left && e.clientX < rect.right) target = index;
      });
      this.drag = { ...this.drag, dx: e.clientX - this.drag.startX, target };
    };
    const keys = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !this.drag) return;
      this.drag = { ...this.drag, cancelled: true };
      stop();
      this.announce("Spostamento annullato.");
    };
    const stop = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
      window.removeEventListener("keydown", keys, true);
      const drag = this.drag;
      this.drag = undefined;
      if (!drag || drag.cancelled) return;
      const target = order[drag.target];
      if (target && target.key !== drag.key) {
        this.placeColumn(drag.key, target.key);
        this.announce(
          `${DEF[drag.key].label} spostata in posizione ${drag.target + 1} di ${order.length}.`,
        );
      }
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
    window.addEventListener("keydown", keys, true);
  }

  /* Menus -------------------------------------------------------------- */
  private get menu() {
    return this.querySelector<BolleMenu>("bolle-menu#context")!;
  }

  private openMenu(
    anchor: HTMLElement,
    items: MenuEntry[],
    context: NonNullable<ProtoTableApp["menuContext"]>,
    label: string,
  ) {
    const menu = this.menu;
    menu.items = items;
    menu.menuLabel = label;
    menu.selectionMode = "none";
    this.menuContext = context;
    void menu.show(anchor);
  }

  private columnMenu(event: Event, key: ColumnKey) {
    const def = DEF[key];
    const column = this.columns.find((c) => c.key === key)!;
    const sort = this.sorts.find((s) => s.key === key);
    const order = this.visibleColumns;
    const index = order.findIndex((c) => c.key === key);
    const items: MenuEntry[] = [
      { id: "asc", label: "Ordina crescente", selected: sort?.dir === "asc" },
      { id: "desc", label: "Ordina decrescente", selected: sort?.dir === "desc" },
      ...(sort ? [{ id: "unsort", label: "Togli ordinamento" }] : []),
      { separator: true },
      ...(def.groupable
        ? [
            this.groupBy === key
              ? { id: "ungroup", label: "Non raggruppare" }
              : { id: "group", label: `Raggruppa per ${def.label.toLowerCase()}` },
          ]
        : []),
      { id: "pin", label: column.pinned ? "Sblocca colonna" : "Fissa a sinistra" },
      {
        id: "left",
        label: "Sposta a sinistra",
        disabled: index === 0 || order[index - 1].pinned !== column.pinned,
        trailingText: "Alt ←",
      },
      {
        id: "right",
        label: "Sposta a destra",
        disabled:
          index === order.length - 1 || order[index + 1].pinned !== column.pinned,
        trailingText: "Alt →",
      },
      { separator: true },
      {
        id: "hide",
        label: "Nascondi colonna",
        disabled: order.length <= 2,
      },
    ];
    this.openMenu(
      event.currentTarget as HTMLElement,
      items,
      { kind: "column", key },
      `Colonna ${def.label}`,
    );
  }

  private rowMenu(event: Event, job: Job) {
    event.stopPropagation();
    this.openMenu(
      event.currentTarget as HTMLElement,
      [
        { id: "open", label: "Apri scheda" },
        { id: "expand", label: this.expanded.has(job.id) ? "Chiudi anteprima" : "Mostra anteprima" },
        { id: "copy", label: "Duplica commessa" },
        {
          id: "assign",
          label: "Assegna a",
          children: MANAGERS.map((name) => ({
            id: `assign:${name}`,
            label: name,
            selected: name === job.manager,
          })),
        },
        { separator: true },
        { id: "archive", label: "Archivia" },
      ],
      { kind: "row", job },
      `Azioni per ${job.code}`,
    );
  }

  private bulkMenu(event: Event, action: "assign" | "status") {
    const items: MenuEntry[] =
      action === "assign"
        ? MANAGERS.map((name) => ({ id: name, label: name }))
        : STATUS_ORDER.map((status) => ({ id: status, label: STATUS_LABEL[status] }));
    this.openMenu(
      event.currentTarget as HTMLElement,
      items,
      { kind: "bulk", action },
      action === "assign" ? "Assegna a" : "Cambia stato",
    );
  }

  private scenarioMenu(event: Event) {
    this.openMenu(
      event.currentTarget as HTMLElement,
      [
        {
          group: true,
          label: "Volume",
          items: [
            { id: "paged", label: "248 commesse, a pagine", selected: this.mode === "paged" },
            { id: "virtual", label: "5.000 commesse, scorrimento continuo", selected: this.mode === "virtual" },
          ],
        },
        {
          group: true,
          label: "Risposta del server",
          items: [
            { id: "normal", label: "Normale", selected: this.scenario === "normal" },
            { id: "slow", label: "Lenta (2 secondi)", selected: this.scenario === "slow" },
            { id: "fail-next", label: "Errore al prossimo caricamento", selected: this.scenario === "fail-next" },
            { id: "empty", label: "Archivio vuoto", selected: this.scenario === "empty" },
          ],
        },
        { separator: true },
        { id: "reload", label: "Ricarica da zero" },
      ],
      { kind: "scenario" },
      "Scenario di prova",
    );
  }

  private navMenu(event: Event) {
    this.openMenu(
      event.currentTarget as HTMLElement,
      navigation.map((item) => ({
        id: item.id,
        label: item.label,
        trailingText: item.count ? String(item.count) : undefined,
        selected: item.id === "jobs",
        children: item.children?.map((child) => ({
          id: child.id,
          label: child.label,
          trailingText: child.count ? String(child.count) : undefined,
          selected: child.id === "all",
        })),
      })),
      { kind: "nav" },
      "Navigazione principale",
    );
  }

  private groupMenu(event: Event) {
    this.openMenu(
      event.currentTarget as HTMLElement,
      [
        { id: "none", label: "Nessun gruppo", selected: !this.groupBy },
        ...COLUMNS.filter((c) => c.groupable).map((c) => ({
          id: c.key,
          label: c.label,
          selected: this.groupBy === c.key,
        })),
      ],
      { kind: "group" },
      "Raggruppa per",
    );
  }

  private pageSizeMenu(event: Event) {
    this.openMenu(
      event.currentTarget as HTMLElement,
      [25, 50, 100].map((size) => ({
        id: String(size),
        label: `${size} righe`,
        selected: this.pageSize === size,
      })),
      { kind: "page-size" },
      "Righe per pagina",
    );
  }

  private onMenuSelect(event: CustomEvent<MenuSelectDetail>) {
    const id = event.detail.item.id;
    const context = this.menuContext;
    if (!context) return;
    if (context.kind === "nav") return;
    if (context.kind === "group")
      return this.setGroup(id === "none" ? "" : (id as ColumnKey));
    if (context.kind === "page-size") {
      this.pageSize = Number(id);
      return this.refetch();
    }
    if (context.kind === "column") {
      const key = context.key;
      if (id === "asc" || id === "desc") this.setSort(key, id);
      else if (id === "unsort") this.setSort(key, "");
      else if (id === "group") this.setGroup(key);
      else if (id === "ungroup") this.setGroup("");
      else if (id === "pin") this.togglePinned(key);
      else if (id === "left") this.moveColumn(key, -1);
      else if (id === "right") this.moveColumn(key, 1);
      else if (id === "hide") this.hideColumn(key);
    } else if (context.kind === "row") {
      const job = context.job;
      if (id === "open") this.openDetail(job);
      else if (id === "expand") this.toggleExpanded(job);
      else if (id === "copy")
        this.notify(`Bozza creata da ${job.code}`);
      else if (id.startsWith("assign:")) {
        const manager = id.slice(7);
        this.updateJobs([job.id], { manager }, `${job.code} assegnata a ${manager}`);
      } else if (id === "archive") this.archiveJobs([job.id]);
    } else if (context.kind === "bulk") {
      const ids = [...this.selected];
      if (context.action === "assign")
        this.updateJobs(
          ids,
          { manager: id },
          `${plural(ids.length, "commessa assegnata", "commesse assegnate")} a ${id}`,
        );
      else
        this.updateJobs(
          ids,
          { status: id as JobStatus },
          `${plural(ids.length, "commessa", "commesse")} in stato «${STATUS_LABEL[id as JobStatus]}»`,
        );
    } else if (context.kind === "scenario") {
      if (id === "paged" || id === "virtual") {
        this.mode = id;
        this.selected = new Set();
        this.expanded = new Set();
        this.scroller?.scrollTo({ top: 0 });
        this.refetch();
      } else if (id === "reload") {
        this.hadData = false;
        this.result = [];
        void this.fetch(true);
      } else {
        this.scenario = id as Scenario;
        if (id === "empty" || id === "normal") this.refetch();
      }
    }
  }

  private openDetail(job: Job) {
    this.detailJob = job;
    void this.updateComplete.then(() =>
      this.querySelector<BolleSideSheet>("bolle-side-sheet#detail")?.show(),
    );
  }

  private onRowClick(event: MouseEvent, job: Job) {
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
    this.openDetail(job);
  }

  /* Rendering: cells --------------------------------------------------- */
  private statusPill(status: JobStatus) {
    return html`<span class="status status-${status}">${STATUS_LABEL[status]}</span>`;
  }

  private dueCell(job: Job) {
    const late = isLate(job);
    const days = Math.abs(dayDiff(TODAY_ISO, job.due));
    return html`<span class="due ${late ? "late" : ""}">
      <span>${formatDate(job.due)}</span>
      ${late
        ? html`<span class="due-note">in ritardo di ${days} gg</span>`
        : job.status !== "chiusa" && days <= 30 && job.due >= TODAY_ISO
          ? html`<span class="due-note soon">tra ${days} gg</span>`
          : nothing}
    </span>`;
  }

  private cell(key: ColumnKey, job: Job, needle: string): TemplateResult {
    switch (key) {
      case "code":
        return html`<button
          class="code-link"
          @click=${(e: Event) => {
            e.stopPropagation();
            this.openDetail(job);
          }}
        >
          ${this.mark(job.code, needle)}
        </button>`;
      case "title":
        return html`<span class="ellipsis strong">${this.mark(job.title, needle)}</span>`;
      case "client":
        return html`<span class="ellipsis">${this.mark(job.client, needle)}</span>`;
      case "city":
        return html`<span class="ellipsis">${this.mark(job.city, needle)}</span>`;
      case "status":
        return this.statusPill(job.status);
      case "manager":
        return html`<span class="person">
          <span class="avatar" aria-hidden="true">${initials(job.manager)}</span>
          <span class="ellipsis">${this.mark(job.manager, needle)}</span>
        </span>`;
      case "amount":
        return html`<span class="num">${euro.format(job.amount)}</span>`;
      case "progress":
        return html`<span class="progress-cell">
          <bolle-progress-indicator
            value=${job.progress}
            label=${`Avanzamento ${job.code}`}
          ></bolle-progress-indicator>
          <span class="num">${job.progress}%</span>
        </span>`;
      case "due":
        return this.dueCell(job);
      case "started":
        return html`<span>${formatDate(job.started)}</span>`;
    }
  }

  private mark(value: string, needle: string) {
    if (!needle) return value;
    const index = normalize(value).indexOf(needle);
    if (index < 0) return value;
    return html`${value.slice(0, index)}<mark>${value.slice(index, index + needle.length)}</mark>${value.slice(index + needle.length)}`;
  }

  /* Rendering: table --------------------------------------------------- */
  private renderHeader() {
    const order = this.visibleColumns;
    const selection = this.pageSelection;
    const lastPinned = [...order].reverse().find((c) => c.pinned)?.key;
    return html`<thead>
      <tr aria-rowindex="1">
        <th class="col-select pinned" scope="col" style="inset-inline-start:0">
          <bolle-checkbox
            .checked=${selection.all}
            .indeterminate=${selection.chosen > 0 && !selection.all}
            ?disabled=${!selection.ids.length}
            @change=${(e: CustomEvent<{ checked: boolean }>) =>
              this.togglePage(e.detail.checked)}
            ><span class="sr-only">Seleziona tutte le righe della pagina</span></bolle-checkbox
          >
        </th>
        <th
          class="col-expand pinned ${lastPinned ? "" : "pinned-edge"}"
          scope="col"
          style=${`inset-inline-start:${SELECT_WIDTH}px`}
        >
          <span class="sr-only">Anteprima</span>
        </th>
        ${order.map((column, index) => {
          const def = DEF[column.key];
          const sortIndex = this.sorts.findIndex((s) => s.key === column.key);
          const sort = this.sorts[sortIndex];
          const dragging = this.drag?.key === column.key;
          const dropHere =
            this.drag && !dragging && this.drag.target === index;
          const dropSide =
            this.drag &&
            order.findIndex((c) => c.key === this.drag!.key) < index
              ? "after"
              : "before";
          return html`<th
            scope="col"
            data-key=${column.key}
            class="col-data ${def.align === "end" ? "end" : ""} ${column.pinned ? "pinned" : ""} ${column.key === lastPinned ? "pinned-edge" : ""} ${dragging ? "dragging" : ""} ${dropHere ? `drop-${dropSide}` : ""}"
            style=${column.pinned
              ? `inset-inline-start:${this.pinnedOffset(column.key)}px`
              : ""}
            aria-sort=${sort
              ? sort.dir === "asc"
                ? "ascending"
                : "descending"
              : nothing}
          >
            <div
              class="th-inner"
              style=${dragging ? `transform:translateX(${this.drag!.dx}px)` : ""}
            >
              <span
                class="drag-handle"
                aria-hidden="true"
                title="Trascina per spostare la colonna"
                @pointerdown=${(e: PointerEvent) => this.startDrag(e, column.key)}
                >${icon(grip)}</span
              >
              <button
                class="sort-button"
                @click=${(e: MouseEvent) => this.toggleSort(column.key, e.shiftKey)}
                @keydown=${(e: KeyboardEvent) => {
                  if (!e.altKey) return;
                  const rtl = getComputedStyle(this).direction === "rtl";
                  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                    e.preventDefault();
                    const left = (e.key === "ArrowLeft") !== rtl;
                    this.moveColumn(column.key, left ? -1 : 1);
                    void this.updateComplete.then(() =>
                      this.querySelector<HTMLElement>(
                        `th[data-key="${column.key}"] .sort-button`,
                      )?.focus(),
                    );
                  }
                }}
                aria-describedby="sort-help"
              >
                <span class="ellipsis">${def.label}</span>
                <span class="sort-icon ${sort ? "on" : ""}">
                  ${icon(sort ? (sort.dir === "asc" ? arrowUp : arrowDown) : arrowsSort)}
                  ${sort && this.sorts.length > 1
                    ? html`<span class="sort-rank">${sortIndex + 1}</span>`
                    : nothing}
                </span>
              </button>
              ${column.pinned ? html`<span class="pin-mark" title="Colonna fissata">${icon(pin)}</span>` : nothing}
              <bolle-icon-button
                class="th-menu"
                variant="standard"
                size="xs"
                label=${`Opzioni colonna ${def.label}`}
                haspopup="menu"
                @click=${(e: Event) => this.columnMenu(e, column.key)}
                >${icon(dots)}</bolle-icon-button
              >
            </div>
            <span
              class="resize-handle"
              role="separator"
              tabindex="0"
              aria-orientation="vertical"
              aria-label=${`Larghezza colonna ${def.label}`}
              aria-valuemin=${MIN_COLUMN}
              aria-valuemax=${MAX_COLUMN}
              aria-valuenow=${column.width}
              @pointerdown=${(e: PointerEvent) => this.startResize(e, column.key)}
              @keydown=${(e: KeyboardEvent) => this.resizeKeys(e, column.key)}
              @dblclick=${() => this.patchColumn(column.key, { width: def.width })}
            ></span>
          </th>`;
        })}
        <th class="col-actions sticky-end" scope="col">
          <span class="sr-only">Azioni</span>
        </th>
      </tr>
    </thead>`;
  }

  private renderLine(line: Line, needle: string, rowIndex: number) {
    const order = this.visibleColumns;
    const span = order.length + 3;
    const lastPinned = [...order].reverse().find((c) => c.pinned)?.key;
    if (line.kind === "group")
      return html`<tr class="group-row" aria-rowindex=${rowIndex}>
        <th colspan=${span} scope="rowgroup">
          <div class="group-inner">
            <button
              class="group-toggle"
              aria-expanded=${String(!line.collapsed)}
              @click=${() => this.toggleGroup(line.key)}
            >
              ${icon(line.collapsed ? chevronRight : chevronDown, "chev")}
              <span class="group-title">${line.key === "status" ? line.label : line.label}</span>
              <span class="group-count">${plural(line.count, "commessa", "commesse")}</span>
            </button>
            <span class="group-stats">
              <span><span class="muted">Totale</span> <strong class="num">${euro.format(line.total)}</strong></span>
              <span><span class="muted">Avanzamento medio</span> <strong class="num">${line.progress}%</strong></span>
            </span>
          </div>
        </th>
      </tr>`;
    if (line.kind === "detail")
      return html`<tr class="detail-row" aria-rowindex=${rowIndex}>
        <td colspan=${span}>
          ${this.renderPreview(line.job)}
        </td>
      </tr>`;
    const job = line.job;
    const selected = this.selected.has(job.id);
    const expanded = this.expanded.has(job.id);
    return html`<tr
      class="data-row ${selected ? "selected" : ""} ${expanded ? "expanded" : ""}"
      aria-rowindex=${rowIndex}
      aria-selected=${String(selected)}
      @click=${(e: MouseEvent) => this.onRowClick(e, job)}
    >
      <td class="col-select pinned" style="inset-inline-start:0">
        <bolle-checkbox
          .checked=${selected}
          @change=${(e: CustomEvent<{ checked: boolean }>) =>
            this.toggleRow(job, e.detail.checked)}
          ><span class="sr-only">Seleziona ${job.code}</span></bolle-checkbox
        >
      </td>
      <td
        class="col-expand pinned ${lastPinned ? "" : "pinned-edge"}"
        style=${`inset-inline-start:${SELECT_WIDTH}px`}
      >
        <bolle-icon-button
          variant="standard"
          size="xs"
          label=${expanded ? `Chiudi anteprima ${job.code}` : `Anteprima ${job.code}`}
          aria-expanded=${String(expanded)}
          @click=${(e: Event) => {
            e.stopPropagation();
            this.toggleExpanded(job);
          }}
          >${icon(expanded ? chevronDown : chevronRight)}</bolle-icon-button
        >
      </td>
      ${order.map(
        (column) =>
          html`<td
            class="${DEF[column.key].align === "end" ? "end" : ""} ${column.pinned ? "pinned" : ""} ${column.key === lastPinned ? "pinned-edge" : ""} ${this.drag?.key === column.key ? "dragging" : ""}"
            style=${column.pinned
              ? `inset-inline-start:${this.pinnedOffset(column.key)}px`
              : ""}
          >
            ${this.cell(column.key, job, needle)}
          </td>`,
      )}
      <td class="col-actions sticky-end">
        <bolle-icon-button
          variant="standard"
          size="xs"
          label=${`Azioni per ${job.code}`}
          haspopup="menu"
          @click=${(e: Event) => this.rowMenu(e, job)}
          >${icon(dots)}</bolle-icon-button
        >
      </td>
    </tr>`;
  }

  private renderPreview(job: Job) {
    return html`<div class="preview">
      <section class="preview-main">
        <p class="preview-kicker">${job.client} · ${job.city}</p>
        <p class="preview-title">${job.title}</p>
        <p class="preview-notes">${job.notes}</p>
        <div class="preview-actions">
          <bolle-button variant="tonal" @click=${() => this.openDetail(job)}
            >Apri scheda</bolle-button
          >
        </div>
      </section>
      <section class="preview-phases" aria-label="Avanzamento per fase">
        ${job.phases.map(
          (phase) => html`<div class="phase">
            <span class="phase-name">${phase.name}</span>
            <bolle-progress-indicator
              value=${phase.progress}
              label=${`${phase.name} ${job.code}`}
            ></bolle-progress-indicator>
            <span class="num">${phase.progress}%</span>
          </div>`,
        )}
      </section>
      <dl class="preview-facts">
        <div><dt>Inizio lavori</dt><dd>${formatDate(job.started)}</dd></div>
        <div><dt>Scadenza</dt><dd>${this.dueCell(job)}</dd></div>
        <div><dt>Importo</dt><dd class="num">${euro.format(job.amount)}</dd></div>
      </dl>
    </div>`;
  }

  private renderLoading() {
    return html`<div class="state loading-state">
      <bolle-loading-indicator label="Caricamento delle commesse"></bolle-loading-indicator>
      <p>Caricamento delle commesse…</p>
    </div>`;
  }

  private renderBodyState() {
    const filtered = this.query.trim() !== "" || this.activeFilterCount > 0;
    if (this.load === "error" && !this.hadData)
      return html`<div class="state" role="alert">
        ${icon(alert, "state-icon error")}
        <h2>Non riusciamo a caricare le commesse</h2>
        <p>Il server non ha risposto in tempo. I dati non sono stati modificati.</p>
        <bolle-button variant="filled" @click=${() => void this.fetch(true)}
          >${icon(refresh)} Riprova</bolle-button
        >
      </div>`;
    if (!this.result.length && this.total === 0)
      return html`<div class="state">
        ${icon(databaseOff, "state-icon")}
        <h2>Non ci sono ancora commesse</h2>
        <p>Le commesse create o importate dal gestionale compariranno qui.</p>
        <bolle-button variant="filled">${icon(plus)} Nuova commessa</bolle-button>
      </div>`;
    if (!this.result.length && filtered)
      return html`<div class="state">
        ${icon(filterOff, "state-icon")}
        <h2>Nessuna commessa corrisponde</h2>
        <p>
          ${this.query.trim()
            ? html`Nessun risultato per «${this.query.trim()}»`
            : "Nessun risultato"}${this.activeFilterCount
            ? html` con ${plural(this.activeFilterCount, "filtro attivo", "filtri attivi")}`
            : nothing}. Prova a togliere qualche filtro.
        </p>
        <bolle-button variant="tonal" @click=${() => this.clearFilters()}
          >Cancella ricerca e filtri</bolle-button
        >
      </div>`;
    return undefined;
  }

  private renderTable() {
    const needle = normalize(this.query.trim());
    const state =
      this.load === "initial" ? this.renderLoading() : this.renderBodyState();
    const lines = this.lines();
    const virtual = this.mode === "virtual";
    const start = virtual ? this.windowStart : 0;
    const end = virtual ? Math.min(this.windowEnd, lines.length) : lines.length;
    let before = 0;
    let after = 0;
    if (virtual) {
      for (let i = 0; i < start; i++) before += this.heightOf(lines[i]);
      for (let i = end; i < lines.length; i++) after += this.heightOf(lines[i]);
    }
    const rowCount =
      this.result.length + 1 + (this.groupBy ? new Set(this.result.map((j) => groupValue(j, this.groupBy as ColumnKey))).size : 0);
    const tableWidth =
      SELECT_WIDTH +
      EXPAND_WIDTH +
      ACTIONS_WIDTH +
      this.visibleColumns.reduce((sum, c) => sum + c.width, 0);
    return html`<div
      class="table-frame ${this.load === "refreshing" ? "busy" : ""}"
    >
      ${this.load === "refreshing"
        ? html`<bolle-loading-indicator
            class="table-progress"
            variant="contained"
            label="Aggiornamento delle commesse"
          ></bolle-loading-indicator>`
        : nothing}
      ${this.load === "error" && this.hadData
        ? html`<div class="inline-error" role="alert">
            ${icon(alert)}
            <span
              >Aggiornamento non riuscito: stai vedendo i dati del caricamento
              precedente.</span
            >
            <bolle-button variant="text" @click=${() => void this.fetch()}
              >Riprova</bolle-button
            >
          </div>`
        : nothing}
      <div
        class="table-scroll ${this.scrolledX ? "scrolled-x" : ""}"
        @scroll=${this.onScroll}
        tabindex="-1"
      >
        <table
          class="data-table density-${this.density}"
          style=${`inline-size:${tableWidth}px`}
          aria-labelledby="page-title"
          aria-describedby="table-summary"
          aria-rowcount=${virtual ? rowCount : nothing}
          aria-busy=${String(this.load === "initial" || this.load === "refreshing")}
        >
          <colgroup>
            <col style=${`inline-size:${SELECT_WIDTH}px`} />
            <col style=${`inline-size:${EXPAND_WIDTH}px`} />
            ${this.visibleColumns.map(
              (c) => html`<col style=${`inline-size:${c.width}px`} />`,
            )}
            <col style=${`inline-size:${ACTIONS_WIDTH}px`} />
          </colgroup>
          ${this.renderHeader()}
          ${state
              ? nothing
              : html`<tbody>
                  ${before
                    ? html`<tr class="spacer" aria-hidden="true"><td style=${`block-size:${before}px`} colspan=${this.visibleColumns.length + 3}></td></tr>`
                    : nothing}
                  ${lines
                    .slice(start, end)
                    .map((line, i) =>
                      this.renderLine(
                        line,
                        needle,
                        (this.mode === "paged" ? this.page * this.pageSize : 0) + start + i + 2,
                      ),
                    )}
                  ${after
                    ? html`<tr class="spacer" aria-hidden="true"><td style=${`block-size:${after}px`} colspan=${this.visibleColumns.length + 3}></td></tr>`
                    : nothing}
                </tbody>`}
        </table>
        ${state ?? nothing}
      </div>
      ${this.drag ? html`<div class="drag-hint" role="presentation">Rilascia per spostare · Esc per annullare</div>` : nothing}
    </div>`;
  }

  /* Rendering: narrow list --------------------------------------------- */
  private renderCards() {
    const needle = normalize(this.query.trim());
    if (this.load === "initial")
      return html`<div class="table-frame">${this.renderLoading()}</div>`;
    const state = this.renderBodyState();
    if (state) return html`<div class="table-frame">${state}</div>`;
    return html`<div class="card-frame ${this.load === "refreshing" ? "busy" : ""}">
      ${this.load === "refreshing"
        ? html`<bolle-loading-indicator class="table-progress" variant="contained" label="Aggiornamento delle commesse"></bolle-loading-indicator>`
        : nothing}
      <ul class="card-list" aria-labelledby="page-title">
        ${this.lines().map((line) => {
          if (line.kind === "group")
            return html`<li class="card-group">
              <button class="group-toggle" aria-expanded=${String(!line.collapsed)} @click=${() => this.toggleGroup(line.key)}>
                ${icon(line.collapsed ? chevronRight : chevronDown, "chev")}
                <span class="group-title">${line.label}</span>
                <span class="group-count">${integer.format(line.count)}</span>
              </button>
              <span class="num">${euro.format(line.total)}</span>
            </li>`;
          if (line.kind === "detail") return nothing;
          const job = line.job;
          const selected = this.selected.has(job.id);
          return html`<li class="job-card ${selected ? "selected" : ""}" @click=${(e: MouseEvent) => this.onRowClick(e, job)}>
            <div class="card-top">
              <bolle-checkbox .checked=${selected}
                @change=${(e: CustomEvent<{ checked: boolean }>) => this.toggleRow(job, e.detail.checked)}><span class="sr-only">Seleziona ${job.code}</span></bolle-checkbox>
              <button class="code-link" @click=${(e: Event) => { e.stopPropagation(); this.openDetail(job); }}>${this.mark(job.code, needle)}</button>
              ${this.statusPill(job.status)}
              <bolle-icon-button class="card-menu" variant="standard" size="xs" label=${`Azioni per ${job.code}`} haspopup="menu" @click=${(e: Event) => this.rowMenu(e, job)}>${icon(dots)}</bolle-icon-button>
            </div>
            <p class="card-title">${this.mark(job.title, needle)}</p>
            <p class="card-meta">${this.mark(job.client, needle)} · ${job.city}</p>
            <div class="card-bottom">
              <span class="progress-cell"><bolle-progress-indicator value=${job.progress} label=${`Avanzamento ${job.code}`}></bolle-progress-indicator><span class="num">${job.progress}%</span></span>
              <span class="num strong">${euro.format(job.amount)}</span>
            </div>
            <div class="card-foot">
              <span class="person"><span class="avatar" aria-hidden="true">${initials(job.manager)}</span>${job.manager}</span>
              ${this.dueCell(job)}
            </div>
          </li>`;
        })}
      </ul>
    </div>`;
  }

  /* Rendering: toolbars ------------------------------------------------ */
  private renderToolbar() {
    const count = this.selected.size;
    if (count)
      return html`<div class="toolbar selection-bar" role="toolbar" aria-label="Azioni sulle commesse selezionate">
        <bolle-icon-button variant="standard" label="Annulla selezione" @click=${() => (this.selected = new Set())}>${icon(close)}</bolle-icon-button>
        <span class="selection-count">${plural(count, "selezionata", "selezionate")}</span>
        ${this.mode === "paged" && this.pageSelection.all && count < this.result.length
          ? html`<bolle-button variant="text" @click=${() => this.selectAllMatching()}>Seleziona tutte le ${integer.format(this.result.length)}</bolle-button>`
          : nothing}
        <span class="spacer-flex"></span>
        <bolle-button variant="tonal" haspopup="menu" @click=${(e: Event) => this.bulkMenu(e, "assign")}>${icon(userCheck)} Assegna</bolle-button>
        <bolle-button variant="tonal" haspopup="menu" @click=${(e: Event) => this.bulkMenu(e, "status")}>Cambia stato</bolle-button>
        <bolle-button variant="tonal" @click=${() => this.archiveJobs([...this.selected])}>${icon(archive)} Archivia</bolle-button>
      </div>`;
    const filters = this.activeFilterCount;
    return html`<div class="toolbar" role="toolbar" aria-label="Strumenti della tabella">
      <bolle-search
        class="table-search"
        label="Cerca commesse"
        placeholder="Cerca per codice, cliente, comune…"
        .value=${this.query}
        @value-input=${(e: CustomEvent<{ value: string }>) => this.setQuery(e.detail.value)}
      ></bolle-search>
      <bolle-button
        variant=${filters ? "tonal" : "outlined"}
        @click=${() => this.querySelector<BolleSideSheet>("#filters")?.show()}
        >${icon(filterIcon)} Filtri${filters ? html`<span class="count-badge">${filters}</span>` : nothing}</bolle-button
      >
      <bolle-button
        variant=${this.groupBy ? "tonal" : "outlined"}
        haspopup="menu"
        @click=${(e: Event) => this.groupMenu(e)}
        >${icon(layoutRows)} ${this.groupBy ? `Gruppi: ${DEF[this.groupBy].label}` : "Raggruppa"}</bolle-button
      >
      <span class="spacer-flex"></span>
      ${this.narrow
        ? nothing
        : html`<bolle-button variant="outlined" @click=${() => this.querySelector<BolleSideSheet>("#columns")?.show()}
            >${icon(columnsIcon)} Vista</bolle-button
          >`}
    </div>`;
  }

  private renderFilterChips() {
    const f = this.filters;
    const chips: { label: string; clear: () => void }[] = [];
    if (f.statuses.length)
      chips.push({
        label: `Stato: ${f.statuses.map((s) => STATUS_LABEL[s]).join(", ")}`,
        clear: () => this.setFilters({ ...f, statuses: [] }),
      });
    if (f.managers.length)
      chips.push({
        label: `Responsabile: ${f.managers.length === 1 ? f.managers[0] : `${f.managers.length} persone`}`,
        clear: () => this.setFilters({ ...f, managers: [] }),
      });
    if (f.late)
      chips.push({ label: "Solo in ritardo", clear: () => this.setFilters({ ...f, late: false }) });
    if (f.minAmount || f.maxAmount)
      chips.push({
        label: `Importo ${f.minAmount ? `da ${euro.format(Number(f.minAmount))}` : ""} ${f.maxAmount ? `fino a ${euro.format(Number(f.maxAmount))}` : ""}`.replace(/\s+/g, " "),
        clear: () => this.setFilters({ ...f, minAmount: "", maxAmount: "" }),
      });
    if (!chips.length) return nothing;
    return html`<div class="chip-row" aria-label="Filtri attivi" role="group">
      ${chips.map(
        (chip) => html`<bolle-chip
          variant="input"
          label=${chip.label}
          removable
          remove-label=${`Togli filtro ${chip.label}`}
          @remove=${chip.clear}
        ></bolle-chip>`,
      )}
      <bolle-button variant="text" @click=${() => this.setFilters({ ...NO_FILTERS })}>Cancella filtri</bolle-button>
    </div>`;
  }

  private renderFooter() {
    if (this.load === "initial" || !this.result.length) return nothing;
    if (this.mode === "virtual")
      return html`<footer class="table-footer">
        <span>${plural(this.result.length, "commessa", "commesse")}${this.result.length !== this.total ? ` su ${integer.format(this.total)}` : ""}</span>
        <span class="muted">Scorrimento continuo: le righe si caricano mentre scorri</span>
      </footer>`;
    const pages = Math.max(1, Math.ceil(this.result.length / this.pageSize));
    const from = this.page * this.pageSize + 1;
    const to = Math.min(this.result.length, from + this.pageSize - 1);
    const go = (page: number) => {
      this.page = page;
      this.scroller?.scrollTo({ top: 0 });
      this.refetch(false);
    };
    return html`<footer class="table-footer">
      ${this.narrow
        ? nothing
        : html`<span class="page-size">
            Righe per pagina
            <bolle-button variant="text" haspopup="menu" @click=${(e: Event) => this.pageSizeMenu(e)}
              >${this.pageSize} ${icon(chevronDown)}</bolle-button
            >
          </span>`}
      <span class="range" aria-live="off">${integer.format(from)}–${integer.format(to)} di ${integer.format(this.result.length)}</span>
      <nav class="pager" aria-label="Pagine">
        <bolle-icon-button variant="standard" label="Prima pagina" ?disabled=${this.page === 0} @click=${() => go(0)}>${icon(chevronsLeft)}</bolle-icon-button>
        <bolle-icon-button variant="standard" label="Pagina precedente" ?disabled=${this.page === 0} @click=${() => go(this.page - 1)}>${icon(chevronLeft)}</bolle-icon-button>
        <span class="page-of">Pagina ${this.page + 1} di ${pages}</span>
        <bolle-icon-button variant="standard" label="Pagina successiva" ?disabled=${this.page >= pages - 1} @click=${() => go(this.page + 1)}>${icon(chevronRight)}</bolle-icon-button>
        <bolle-icon-button variant="standard" label="Ultima pagina" ?disabled=${this.page >= pages - 1} @click=${() => go(pages - 1)}>${icon(chevronsRight)}</bolle-icon-button>
      </nav>
    </footer>`;
  }

  /* Rendering: sheets -------------------------------------------------- */
  private renderFilterSheet() {
    const f = this.filters;
    const preview = this.rows.filter((job) => this.jobMatches(job)).length;
    const toggle = <T,>(list: T[], value: T) =>
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    return html`<bolle-side-sheet id="filters" label="Filtri" close-label="Chiudi filtri">
      <div class="sheet-body">
        <fieldset>
          <legend>Stato</legend>
          <div class="chip-set">
            ${STATUS_ORDER.map(
              (status) => html`<bolle-chip
                variant="filter"
                label=${STATUS_LABEL[status]}
                .selected=${f.statuses.includes(status)}
                @change=${() => this.setFilters({ ...f, statuses: toggle(f.statuses, status) })}
              ></bolle-chip>`,
            )}
          </div>
        </fieldset>
        <fieldset>
          <legend>Scadenza</legend>
          <bolle-switch
            label="Solo commesse in ritardo"
            .checked=${f.late}
            @change=${(e: CustomEvent<{ checked: boolean }>) => this.setFilters({ ...f, late: e.detail.checked })}
          ></bolle-switch>
        </fieldset>
        <fieldset>
          <legend>Importo</legend>
          <div class="range-fields">
            <bolle-text-field label="Da" suffix="€" inputmode="numeric" .value=${f.minAmount}
              @change=${(e: CustomEvent<{ value: string }>) => this.setFilters({ ...f, minAmount: e.detail.value.replace(/\D/g, "") })}></bolle-text-field>
            <bolle-text-field label="Fino a" suffix="€" inputmode="numeric" .value=${f.maxAmount}
              @change=${(e: CustomEvent<{ value: string }>) => this.setFilters({ ...f, maxAmount: e.detail.value.replace(/\D/g, "") })}></bolle-text-field>
          </div>
        </fieldset>
        <fieldset>
          <legend>Responsabile</legend>
          <div class="check-list">
            ${MANAGERS.map(
              (name) => html`<bolle-checkbox
                label=${name}
                .checked=${f.managers.includes(name)}
                @change=${() => this.setFilters({ ...f, managers: toggle(f.managers, name) })}
              ></bolle-checkbox>`,
            )}
          </div>
        </fieldset>
      </div>
      <div slot="actions" class="sheet-actions">
        <bolle-button variant="text" ?disabled=${!this.activeFilterCount} @click=${() => this.setFilters({ ...NO_FILTERS })}>Cancella</bolle-button>
        <bolle-button variant="filled" @click=${() => this.querySelector<BolleSideSheet>("#filters")?.close()}>
          Mostra ${plural(preview, "commessa", "commesse")}
        </bolle-button>
      </div>
    </bolle-side-sheet>`;
  }

  private renderColumnSheet() {
    const order = [
      ...this.columns.filter((c) => c.pinned),
      ...this.columns.filter((c) => !c.pinned),
    ];
    const visible = this.visibleColumns.length;
    return html`<bolle-side-sheet id="columns" label="Vista" close-label="Chiudi vista">
      <div class="sheet-body">
        <bolle-segmented-buttons
            label="Densità delle righe"
            .value=${this.density}
            .items=${[
              { id: "comfortable", label: "Comoda", icon: icon(densityMedium) },
              { id: "compact", label: "Compatta", icon: icon(densitySmall) },
            ]}
            @change=${(e: CustomEvent<{ value: string }>) => {
              this.density = e.detail.value as Density;
              requestAnimationFrame(this.measureWindow);
            }}
          ></bolle-segmented-buttons>
        <fieldset>
        <legend>Colonne</legend>
        <p class="sheet-lead">
          Scegli le colonne da mostrare e il loro ordine. Le colonne fissate restano visibili mentre scorri in orizzontale.
        </p>
        <ol class="column-list">
          ${order.map((column, index) => {
            const def = DEF[column.key];
            const prev = order[index - 1];
            const next = order[index + 1];
            return html`<li class=${column.visible ? "" : "off"}>
              <bolle-checkbox
                label=${def.label}
                .checked=${column.visible}
                ?disabled=${column.visible && visible <= 2}
                @change=${(e: CustomEvent<{ checked: boolean }>) => this.patchColumn(column.key, { visible: e.detail.checked })}
              ></bolle-checkbox>
              <span class="column-tools">
                <bolle-icon-button variant="standard" size="xs" toggle .selected=${column.pinned}
                  label=${column.pinned ? `Sblocca ${def.label}` : `Fissa ${def.label}`}
                  @click=${() => this.togglePinned(column.key)}>${icon(column.pinned ? pinOff : pin)}</bolle-icon-button>
                <bolle-icon-button variant="standard" size="xs" label=${`Sposta ${def.label} prima`}
                  ?disabled=${!prev || prev.pinned !== column.pinned}
                  @click=${() => this.placeColumn(column.key, prev.key)}>${icon(arrowUp)}</bolle-icon-button>
                <bolle-icon-button variant="standard" size="xs" label=${`Sposta ${def.label} dopo`}
                  ?disabled=${!next || next.pinned !== column.pinned}
                  @click=${() => this.placeColumn(column.key, next.key)}>${icon(arrowDown)}</bolle-icon-button>
              </span>
            </li>`;
          })}
        </ol>
        </fieldset>
      </div>
      <div slot="actions" class="sheet-actions">
        <bolle-button variant="text" @click=${() => {
          this.columns = defaultColumns();
          this.density = "comfortable";
        }}>Ripristina</bolle-button>
        <bolle-button variant="filled" @click=${() => this.querySelector<BolleSideSheet>("#columns")?.close()}>Fatto</bolle-button>
      </div>
    </bolle-side-sheet>`;
  }

  private renderDetailSheet() {
    const job = this.detailJob;
    return html`<bolle-side-sheet id="detail" label=${job ? `Commessa ${job.code}` : "Commessa"} close-label="Chiudi scheda">
      ${job
        ? html`<div class="sheet-body detail">
            ${this.statusPill(job.status)}
            <h2 class="detail-title">${job.title}</h2>
            <p class="muted">${job.client} · ${job.city}</p>
            <dl class="detail-facts">
              <div><dt>Responsabile</dt><dd><span class="person"><span class="avatar" aria-hidden="true">${initials(job.manager)}</span>${job.manager}</span></dd></div>
              <div><dt>Importo</dt><dd class="num">${euro.format(job.amount)}</dd></div>
              <div><dt>Inizio lavori</dt><dd>${formatDate(job.started)}</dd></div>
              <div><dt>Scadenza</dt><dd>${this.dueCell(job)}</dd></div>
            </dl>
            <h3>Avanzamento per fase</h3>
            ${job.phases.map(
              (phase) => html`<div class="phase">
                <span class="phase-name">${phase.name}</span>
                <bolle-progress-indicator value=${phase.progress} label=${phase.name}></bolle-progress-indicator>
                <span class="num">${phase.progress}%</span>
              </div>`,
            )}
            <h3>Note</h3>
            <p>${job.notes}</p>
          </div>
          <div slot="actions" class="sheet-actions">
            <bolle-button variant="text" @click=${() => this.querySelector<BolleSideSheet>("#detail")?.close()}>Chiudi</bolle-button>
            <bolle-button variant="filled">Modifica</bolle-button>
          </div>`
        : nothing}
    </bolle-side-sheet>`;
  }

  protected render() {
    const totalAmount = this.result.reduce((sum, job) => sum + job.amount, 0);
    return html`<div class="shell ${this.narrow ? "phone" : this.compactShell ? "rail" : ""}">
      ${this.narrow
        ? html`<header class="phone-bar">
            <bolle-icon-button variant="standard" label="Apri navigazione" haspopup="menu" @click=${(e: Event) => this.navMenu(e)}
              >${icon(menuIcon)}</bolle-icon-button
            >
            <span class="brand">Cantieri Rossi</span>
          </header>`
        : html`<bolle-sidebar
        class="app-sidebar"
        label="Navigazione principale"
        search="none"
        ?collapsed=${this.compactShell}
        .width=${280}
        .items=${navigation}
        current="jobs/all"
        @collapse=${(e: CustomEvent<{ collapsed: boolean }>) => (this.compactShell = e.detail.collapsed)}
      >
        <span slot="header" class="brand">Cantieri Rossi</span>
      </bolle-sidebar>`}
      <main class="page">
        <header class="page-header">
          <div>
            <p class="breadcrumb">Commesse</p>
            <h1 id="page-title">Tutte le commesse</h1>
            <p class="page-sub" id="table-summary">
              ${this.load === "initial"
                ? "Caricamento in corso…"
                : this.load === "error" && !this.hadData
                  ? "Dati non disponibili"
                  : html`${plural(this.result.length, "commessa", "commesse")}${this.result.length !== this.total ? html` su ${integer.format(this.total)}` : nothing} · valore ${euro.format(totalAmount)}`}
            </p>
          </div>
          <div class="page-actions">
            <bolle-segmented-buttons
              class="container-switch"
              label="Contenitore della tabella"
              .value=${this.container}
              .items=${[
                { id: "card", label: "Card" },
                { id: "free", label: "Libera" },
              ]}
              @change=${(e: CustomEvent<{ value: string }>) => {
                this.container = e.detail.value as "card" | "free";
              }}
            ></bolle-segmented-buttons>
            <bolle-button variant="text" class="scenario" haspopup="menu" @click=${(e: Event) => this.scenarioMenu(e)}
              >Scenario di prova</bolle-button
            >
            <bolle-button variant="filled">${icon(plus)} Nuova commessa</bolle-button>
          </div>
        </header>
        <section
          class="table-card ${this.container === "free" ? "is-free" : ""}"
          aria-label="Elenco commesse"
        >
          ${this.renderToolbar()} ${this.renderFilterChips()}
          ${this.narrow ? this.renderCards() : this.renderTable()}
          ${this.renderFooter()}
        </section>
        <p id="sort-help" class="sr-only">
          Invio ordina la colonna; Maiuscole e clic aggiunge un ordinamento; Alt e frecce spostano la colonna.
        </p>
        <p class="sr-only" role="status" aria-live="polite">${this.announcement}</p>
      </main>
    </div>
    ${this.renderFilterSheet()} ${this.renderColumnSheet()} ${this.renderDetailSheet()}
    <bolle-menu id="context" menu-label="Azioni" @menu-select=${this.onMenuSelect}></bolle-menu>
    <bolle-snackbar close-label="Chiudi" @action=${() => this.undoArchive()}></bolle-snackbar>`;
  }
}

customElements.define("proto-table-app", ProtoTableApp);
