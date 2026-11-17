import { LitElement, css, html, type TemplateResult } from "lit";
import "../src/index.js";
import type {
  DataTableColumn,
  DataTableColumnChangeDetail,
  DataTableExpandDetail,
  DataTablePageDetail,
  DataTableRow,
  DataTableSelectDetail,
  DataTableSort,
  DataTableSortDetail,
} from "../src/index.js";
import { m } from "./i18n.js";

export interface JobRow extends DataTableRow {
  id: string;
  code: string;
  title: string;
  client: string;
  city: string;
  status: string;
  manager: string;
  amount: number;
  progress: number;
  due: string;
  notes: string;
}

/** Rules for the markup the renderers return: they live in the table shadow root. */
const contentCss = css`
  .code {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.8125rem;
    color: var(--md-sys-color-primary);
  }
  .num {
    font-variant-numeric: tabular-nums;
  }
  .status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    block-size: 24px;
    padding: 0 10px 0 8px;
    border-radius: 12px 12px 12px 4px;
    font: var(--md-sys-typescale-label-medium-font);
  }
  .status::before {
    content: "";
    inline-size: 6px;
    block-size: 6px;
    border-radius: 50%;
    background: currentColor;
  }
  .tone-primary {
    background: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
  }
  .tone-secondary {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }
  .tone-tertiary {
    background: var(--md-sys-color-tertiary-container);
    color: var(--md-sys-color-on-tertiary-container);
  }
  .tone-error {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
  }
  .tone-neutral {
    background: var(--md-sys-color-surface-container-highest);
    color: var(--md-sys-color-on-surface-variant);
  }
  .tone-outline {
    box-shadow: inset 0 0 0 1px var(--md-sys-color-outline-variant);
    color: var(--md-sys-color-on-surface-variant);
  }
  .person {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-inline-size: 0;
  }
  .avatar {
    display: inline-grid;
    place-items: center;
    inline-size: 26px;
    block-size: 26px;
    flex: none;
    border-radius: 50%;
    background: var(--md-sys-color-tertiary-container);
    color: var(--md-sys-color-on-tertiary-container);
    font: var(--md-sys-typescale-label-small-font);
    font-weight: 700;
  }
  .progress {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 4ch;
    align-items: center;
    gap: 10px;
    inline-size: 100%;
  }
  .progress .num {
    text-align: end;
    color: var(--md-sys-color-on-surface-variant);
  }
  .due.late {
    color: var(--md-sys-color-error);
    font-weight: 600;
  }
  .detail-body {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 32px;
    padding: 18px 24px 18px calc(var(--detail-inset, 96px) + 12px);
  }
  .detail-body p {
    margin: 0;
  }
  .detail-kicker {
    font: var(--md-sys-typescale-label-medium-font);
    color: var(--md-sys-color-primary);
  }
  .detail-title {
    margin: 4px 0 8px !important;
    font: var(--md-sys-typescale-title-medium-font);
  }
  .detail-notes {
    color: var(--md-sys-color-on-surface-variant);
  }
  .detail-facts {
    display: grid;
    gap: 10px;
    margin: 0;
    align-content: start;
  }
  .detail-facts dt {
    font: var(--md-sys-typescale-label-small-font);
    color: var(--md-sys-color-on-surface-variant);
  }
  .detail-facts dd {
    margin: 2px 0 0;
  }
`;

const STATUSES = ["In offerta", "Pianificata", "In corso", "Sospesa", "In collaudo", "Chiusa"];
const STATUS_TONE: Record<string, string> = {
  "In offerta": "neutral",
  Pianificata: "secondary",
  "In corso": "primary",
  Sospesa: "error",
  "In collaudo": "tertiary",
  Chiusa: "outline",
};
const CLIENTS = [
  "Comune di Bergamo",
  "Immobiliare Lago Srl",
  "Condominio Via Manzoni 14",
  "ASST Papa Giovanni XXIII",
  "Fondazione Carlo Rossi Onlus",
  "Logistica Padana SpA",
  "Hotel Bellavista Sirmione",
  "Istituto Comprensivo Seriate",
  "Parrocchia San Giorgio",
  "Agricola Valcalepio",
];
const CITIES = ["Bergamo", "Brescia", "Seriate", "Treviglio", "Dalmine", "Sirmione", "Lovere", "Clusone"];
const MANAGERS = ["Giulia Ferraro", "Marco Bellini", "Sara Colombo", "Luca De Santis", "Francesca Moretti", "Davide Rinaldi"];
const WORKS = [
  "Rifacimento impianto elettrico",
  "Ristrutturazione facciata e cappotto termico",
  "Nuovo impianto fotovoltaico da 60 kWp",
  "Adeguamento antincendio",
  "Riqualificazione centrale termica",
  "Impianto di climatizzazione VRF",
  "Bonifica amianto e nuova copertura",
  "Illuminazione pubblica a LED",
];
const NOTES = [
  "In attesa del nulla osta dei Vigili del Fuoco per la chiusura dei lavori.",
  "Il cliente ha chiesto una variante sui corpi illuminanti: preventivo inviato.",
  "Accesso al cantiere solo dalle 7:30 alle 16:00, ritiro chiavi in portineria.",
  "Fornitura pannelli in ritardo di due settimane, già avvisato il direttore lavori.",
];

const random = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const TODAY = new Date(2026, 10, 16);
const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const TODAY_ISO = iso(TODAY);

const dateFormat = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", year: "numeric" });
const euro = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const formatDate = (value: string) => dateFormat.format(new Date(`${value}T12:00`));

function makeJobs(count: number): JobRow[] {
  const next = random(20261116);
  const pick = <T,>(list: T[]) => list[Math.floor(next() * list.length)];
  return Array.from({ length: count }, (_, index) => {
    const status = pick(STATUSES);
    const progress =
      status === "Chiusa" ? 100 : status === "In offerta" ? 0 : 5 + Math.round(next() * 90);
    const started = new Date(TODAY);
    started.setDate(started.getDate() - Math.round(next() * 400));
    const due = new Date(started);
    due.setDate(due.getDate() + 60 + Math.round(next() * 480));
    return {
      id: `job-${index + 1}`,
      code: `C${2024 + Math.floor(next() * 3)}-${String(1000 + index).padStart(4, "0")}`,
      title: pick(WORKS),
      client: pick(CLIENTS),
      city: pick(CITIES),
      status,
      manager: pick(MANAGERS),
      amount: Math.round((8000 + next() * next() * 1_200_000) / 50) * 50,
      progress,
      due: iso(due),
      notes: pick(NOTES),
    };
  });
}

const isLate = (row: DataTableRow) =>
  String(row.due) < TODAY_ISO && row.status !== "Chiusa" && row.status !== "In collaudo";

const initials = (name: string) =>
  String(name)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

const statusPill = (status: string) =>
  html`<span class="status tone-${STATUS_TONE[status] ?? "neutral"}">${status}</span>`;

const columns = (): DataTableColumn[] => [
  {
    key: "code",
    label: m("Codice"),
    width: 136,
    pinned: true,
    render: (row) => html`<span class="code">${row.code}</span>`,
  },
  { key: "title", label: m("Commessa"), width: 300 },
  { key: "client", label: m("Cliente"), width: 220, groupable: true },
  { key: "city", label: m("Comune"), width: 150, groupable: true },
  {
    key: "status",
    label: m("Stato"),
    width: 150,
    groupable: true,
    render: (row) => statusPill(String(row.status)),
  },
  {
    key: "manager",
    label: m("Responsabile"),
    width: 200,
    groupable: true,
    render: (row) => html`<span class="person"
      ><span class="avatar" aria-hidden="true">${initials(String(row.manager))}</span
      >${row.manager}</span
    >`,
  },
  {
    key: "amount",
    label: m("Importo"),
    width: 140,
    align: "end",
    render: (row) => html`<span class="num">${euro.format(Number(row.amount))}</span>`,
  },
  {
    key: "progress",
    label: m("Avanzamento"),
    width: 160,
    render: (row) => html`<span class="progress"
      ><bolle-progress-indicator
        value=${Number(row.progress)}
        label=${m("Avanzamento")}
      ></bolle-progress-indicator
      ><span class="num">${row.progress}%</span></span
    >`,
  },
  {
    key: "due",
    label: m("Scadenza"),
    width: 160,
    render: (row) =>
      html`<span class="due ${isLate(row) ? "late" : ""}">${formatDate(String(row.due))}</span>`,
  },
];

/** The same sorting the table asks for, applied by the application. */
const compare = (a: DataTableRow, b: DataTableRow, key: string) => {
  const left = key === "status" ? STATUSES.indexOf(String(a.status)) : a[key];
  const right = key === "status" ? STATUSES.indexOf(String(b.status)) : b[key];
  if (typeof left === "number" && typeof right === "number") return left - right;
  return String(left).localeCompare(String(right), "it");
};

/** Documentation preview: the table plus the application state it reports. */
export class BolleDataTableDemo extends LitElement {
  static properties = {
    variant: { reflect: true },
    density: { reflect: true },
    selectable: { type: Boolean },
    expandable: { type: Boolean },
    groupBy: { attribute: "group-by" },
    pageSize: { type: Number, attribute: "page-size" },
    virtual: { type: Boolean },
    label: {},
  };

  declare variant: "card" | "free";
  declare density: "comfortable" | "compact";
  declare selectable: boolean;
  declare expandable: boolean;
  declare groupBy: string;
  declare pageSize: number;
  declare virtual: boolean;
  declare label: string;

  private jobs = makeJobs(120);
  private columns: DataTableColumn[] = columns();
  private sort: DataTableSort[] = [{ key: "due", dir: "asc" }];
  private selected: string[] = [];
  private expanded: string[] = [];
  private page = 0;

  constructor() {
    super();
    this.variant = "card";
    this.density = "comfortable";
    this.selectable = true;
    this.expandable = true;
    this.groupBy = "";
    this.pageSize = 8;
    this.virtual = false;
    this.label = m("Commesse");
  }

  createRenderRoot() {
    return this;
  }

  private get ordered() {
    const rows = [...this.jobs];
    if (!this.sort.length) return rows;
    rows.sort((a, b) => {
      for (const item of this.sort) {
        const value = compare(a, b, item.key);
        if (value) return item.dir === "asc" ? value : -value;
      }
      return 0;
    });
    return rows;
  }

  private get pageRows() {
    if (!this.pageSize) return this.ordered;
    const start = this.page * this.pageSize;
    return this.ordered.slice(start, start + this.pageSize);
  }

  private onSort = (event: Event) => {
    this.sort = (event as CustomEvent<DataTableSortDetail>).detail.sort;
    this.page = 0;
    this.requestUpdate();
  };

  private onPage = (event: Event) => {
    this.page = (event as CustomEvent<DataTablePageDetail>).detail.page;
    this.requestUpdate();
  };

  private onSelect = (event: Event) => {
    this.selected = (event as CustomEvent<DataTableSelectDetail>).detail.selected;
    this.requestUpdate();
  };

  private onExpand = (event: Event) => {
    this.expanded = (event as CustomEvent<DataTableExpandDetail>).detail.expanded;
    this.requestUpdate();
  };

  private onColumns = (event: Event) => {
    this.columns = (event as CustomEvent<DataTableColumnChangeDetail>).detail.columns;
    this.requestUpdate();
  };

  private onGroup = (event: Event) => {
    this.groupBy = (event as CustomEvent<{ groupBy: string }>).detail.groupBy;
    this.page = 0;
    this.requestUpdate();
  };

  private detail = (row: DataTableRow): TemplateResult => html`<div class="detail-body">
    <div>
      <p class="detail-kicker">${row.client} · ${row.city}</p>
      <p class="detail-title">${row.title}</p>
      <p class="detail-notes">${row.notes}</p>
    </div>
    <dl class="detail-facts">
      <div><dt>${m("Inizio lavori")}</dt><dd>${formatDate(String(row.due))}</dd></div>
      <div><dt>${m("Importo")}</dt><dd class="num">${euro.format(Number(row.amount))}</dd></div>
      <div><dt>${m("Responsabile")}</dt><dd>${row.manager}</dd></div>
    </dl>
  </div>`;

  protected render() {
    return html`<bolle-data-table
      .label=${this.label}
      .columns=${this.columns}
      .rows=${this.pageRows}
      .sort=${this.sort}
      .selected=${this.selected}
      .expanded=${this.expanded}
      .detail=${this.detail}
      .total=${this.jobs.length}
      .page=${this.page}
      .pageSize=${this.pageSize}
      .groupBy=${this.groupBy}
      .groupSummary=${(rows: DataTableRow[]) =>
        html`<span>${rows.length} ${m("commesse")}</span>`}
      .rowActions=${[
        { id: "open", label: m("Apri scheda") },
        { id: "duplicate", label: m("Duplica commessa") },
        { id: "archive", label: m("Archivia") },
      ]}
      .contentStyles=${contentCss.cssText}
      .variant=${this.variant}
      .density=${this.density}
      .selectable=${this.selectable}
      .expandable=${this.expandable}
      .virtual=${this.virtual}
      @sort=${this.onSort}
      @page-change=${this.onPage}
      @select=${this.onSelect}
      @expand=${this.onExpand}
      @column-change=${this.onColumns}
      @group=${this.onGroup}
    ></bolle-data-table>`;
  }
}

if (!customElements.get("demo-data-table"))
  customElements.define("demo-data-table", BolleDataTableDemo);
