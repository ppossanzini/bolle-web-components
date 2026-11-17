import { LitElement, css, html } from "lit";
import "../src/index.js";
import type {
  KanbanAddDetail,
  KanbanCard,
  KanbanCardActionDetail,
  KanbanCardDetail,
  KanbanCollapseDetail,
  KanbanColumn,
  KanbanColumnActionDetail,
  KanbanMoveBlockedDetail,
  KanbanMoveDetail,
} from "../src/index.js";
import { l, m } from "./i18n.js";

interface JobCard extends KanbanCard {
  code: string;
  client: string;
  city: string;
  manager: string;
  tags: string[];
  progress: number;
  due: string;
  amount: number;
}

const TODAY_ISO = "2026-11-16";

const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const dayMonth = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short" });
const formatDate = (value: string) => dayMonth.format(new Date(`${value}T12:00`));
const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

const isLate = (card: JobCard) =>
  card.due < TODAY_ISO && card.column !== "chiuso";

/** Rules for the markup the card renderer returns: it lives in the board shadow root. */
const contentCss = css`
  .kcode {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 0.6875rem;
    letter-spacing: 0.02em;
    color: var(--md-sys-color-primary);
  }
  .ktitle {
    margin: 2px 0 0;
    font: var(--md-sys-typescale-title-small-font);
    overflow-wrap: anywhere;
  }
  .kclient {
    margin: 2px 0 0;
    font: var(--md-sys-typescale-body-small-font);
    color: var(--md-sys-color-on-surface-variant);
  }
  .ktags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-block-start: 8px;
  }
  .ktag {
    padding: 1px 8px;
    border-radius: 8px;
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    font: var(--md-sys-typescale-label-small-font);
  }
  .kprogress {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 4ch;
    align-items: center;
    gap: 8px;
    margin-block-start: 10px;
  }
  .knum {
    text-align: end;
    font: var(--md-sys-typescale-label-small-font);
    color: var(--md-sys-color-on-surface-variant);
    font-variant-numeric: tabular-nums;
  }
  .kfoot {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-block-start: 10px;
    font: var(--md-sys-typescale-label-small-font);
    color: var(--md-sys-color-on-surface-variant);
  }
  .kavatar {
    display: inline-grid;
    place-items: center;
    inline-size: 22px;
    block-size: 22px;
    flex: none;
    border-radius: 50%;
    background: var(--md-sys-color-tertiary-container);
    color: var(--md-sys-color-on-tertiary-container);
    font-weight: 700;
  }
  .kmanager {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .kdue {
    margin-inline-start: auto;
    white-space: nowrap;
  }
  .kdue.late {
    color: var(--md-sys-color-error);
    font-weight: 600;
  }
  .kamount {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
`;

const MANAGERS = [
  "Giulia Ferraro",
  "Marco Bellini",
  "Sara Colombo",
  "Luca De Santis",
  "Francesca Moretti",
];

const makeCards = (): JobCard[] => {
  const rows: Array<[string, string, string, string, string, string[], number, string, number]> = [
    ["programmato", "C2026-1000", "Illuminazione pubblica a LED", "Hotel Bellavista Sirmione", "Bergamo", ["Edilizia"], 4, "2026-11-22", 79350],
    ["programmato", "C2025-1001", "Bonifica amianto e nuova copertura", "Hotel Bellavista Sirmione", "Bergamo", ["Urgente"], 7, "2026-12-23", 305500],
    ["programmato", "C2025-1002", "Rifacimento impianto elettrico", "Agricola Valcalepio", "Clusone", ["Variante"], 2, "2027-02-26", 141800],
    ["in-corso", "C2025-1003", "Ristrutturazione facciata e cappotto", "Immobiliare Lago Srl", "Seriate", ["Urgente"], 23, "2026-11-09", 70600],
    ["in-corso", "C2025-1004", "Illuminazione pubblica a LED", "Logistica Padana SpA", "Treviglio", ["Urgente", "Edilizia"], 70, "2026-10-20", 408700],
    ["in-corso", "C2025-1005", "Rifacimento impianto elettrico", "Fondazione Carlo Rossi Onlus", "Brescia", ["Impianti"], 67, "2026-10-29", 67250],
    ["in-corso", "C2026-1006", "Nuova pavimentazione industriale", "Fondazione Carlo Rossi Onlus", "Dalmine", ["Sicurezza"], 77, "2026-12-07", 320950],
    ["in-corso", "C2025-1007", "Riqualificazione centrale termica", "Hotel Bellavista Sirmione", "Bergamo", [], 51, "2026-12-18", 122450],
    ["in-corso", "C2025-1008", "Illuminazione pubblica a LED", "Hotel Bellavista Sirmione", "Treviglio", ["Variante"], 65, "2026-10-10", 171950],
    ["collaudo", "C2026-1009", "Rifacimento impianto elettrico", "Provincia di Brescia", "Treviglio", ["Variante"], 92, "2027-02-09", 256650],
    ["collaudo", "C2025-1010", "Bonifica amianto e nuova copertura", "Hotel Bellavista Sirmione", "Brescia", ["Variante", "Energia"], 96, "2027-01-18", 13300],
    ["collaudo", "C2026-1011", "Nuovo impianto fotovoltaico 60 kWp", "ASST Papa Giovanni XXIII", "Dalmine", ["Impianti"], 89, "2026-12-21", 69900],
    ["chiuso", "C2025-1012", "Rifacimento impianto elettrico", "Hotel Bellavista Sirmione", "Seriate", ["Urgente", "Impianti"], 100, "2027-03-03", 34600],
    ["chiuso", "C2026-1013", "Bonifica amianto e nuova copertura", "ASST Papa Giovanni XXIII", "Bergamo", ["Edilizia"], 100, "2026-12-08", 16900],
  ];
  return rows.map(([column, code, title, client, city, tags, progress, due, amount], index) => ({
    id: `job-${index + 1}`,
    column,
    lane: MANAGERS[index % MANAGERS.length],
    title,
    subtitle: `${client} · ${city}`,
    code,
    client,
    city,
    manager: MANAGERS[index % MANAGERS.length],
    tags,
    progress,
    due,
    amount,
  }));
};

/** Documentation preview: the board plus the application state it reports. */
export class BolleKanbanDemo extends LitElement {
  static properties = {
    density: { reflect: true },
    lanes: { type: Boolean },
    collapsible: { type: Boolean },
    addable: { type: Boolean },
    movable: { type: Boolean },
    label: {},
  };

  declare density: "comfortable" | "compact";
  declare lanes: boolean;
  declare collapsible: boolean;
  declare addable: boolean;
  declare movable: boolean;
  declare label: string;

  private cards: JobCard[] = makeCards();
  private collapsed: string[] = [];

  constructor() {
    super();
    this.density = "comfortable";
    this.lanes = false;
    this.collapsible = true;
    this.addable = true;
    this.movable = true;
    this.label = l(m("Commesse"));
  }

  createRenderRoot() {
    return this;
  }

  private get columns(): KanbanColumn[] {
    return [
      { id: "programmato", label: l(m("Programmato")) },
      { id: "in-corso", label: l(m("In corso")), wip: 5 },
      { id: "collaudo", label: l(m("Collaudo")), wip: 3 },
      { id: "chiuso", label: l(m("Chiuso")) },
    ];
  }

  /** Rule of the application: the board only asks, the page decides. */
  private restrict = (card: KanbanCard, column: KanbanColumn) => {
    const job = card as JobCard;
    if (job.column === "chiuso" && column.id !== "chiuso")
      return l(m("Una commessa chiusa non si riapre dal kanban."));
    if (column.id === "chiuso" && job.progress < 100)
      return l(m("Per passare in Chiuso l'avanzamento deve essere al 100%."));
    if (column.id === "in-corso" && job.column === "programmato" && job.progress > 60)
      return l(m("Una commessa già avanzata non torna in cantiere senza un verbale."));
    return undefined;
  };

  private onMove = (event: Event) => {
    const detail = (event as CustomEvent<KanbanMoveDetail>).detail;
    const moving = this.cards.find((card) => card.id === detail.card.id);
    if (!moving) return;
    const rest = this.cards.filter((card) => card.id !== moving.id);
    const target = rest.filter(
      (card) =>
        card.column === detail.column &&
        (!this.lanes || card.lane === detail.lane),
    );
    target.splice(Math.max(0, Math.min(detail.index, target.length)), 0, {
      ...moving,
      column: detail.column,
      lane: this.lanes ? detail.lane : moving.lane,
    });
    const others = rest.filter(
      (card) =>
        !(card.column === detail.column && (!this.lanes || card.lane === detail.lane)),
    );
    this.cards = [...others, ...target];
    this.requestUpdate();
  };

  private onBlocked = (event: Event) => {
    const detail = (event as CustomEvent<KanbanMoveBlockedDetail>).detail;
    this.report(detail.reason);
  };

  private onOpen = (event: Event) => {
    const detail = (event as CustomEvent<KanbanCardDetail>).detail;
    this.report(`${detail.card.title} · ${(detail.card as JobCard).client}`);
  };

  private onCardAction = (event: Event) => {
    const { id, card } = (event as CustomEvent<KanbanCardActionDetail>).detail;
    if (id === "duplicate") {
      const copy = {
        ...(card as JobCard),
        id: `${card.id}-copy-${this.cards.length}`,
        code: `${(card as JobCard).code}-bis`,
      };
      this.cards = [...this.cards, copy];
    } else if (id === "archive") {
      this.cards = this.cards.filter((item) => item.id !== card.id);
    }
    this.requestUpdate();
    this.report(`${l(m("Azione"))}: ${id} · ${card.title}`);
  };

  private onColumnAction = (event: Event) => {
    const { id, column } = (event as CustomEvent<KanbanColumnActionDetail>).detail;
    if (id === "sort") {
      const sorted = this.cards
        .filter((card) => card.column === column.id)
        .sort((a, b) => a.due.localeCompare(b.due));
      this.cards = [
        ...this.cards.filter((card) => card.column !== column.id),
        ...sorted,
      ];
      this.requestUpdate();
    }
    this.report(`${l(m("Colonna"))} ${column.label}: ${id}`);
  };

  private onCollapse = (event: Event) => {
    const detail = (event as CustomEvent<KanbanCollapseDetail>).detail;
    this.collapsed = detail.collapsed
      ? [...this.collapsed, detail.column.id]
      : this.collapsed.filter((id) => id !== detail.column.id);
    this.requestUpdate();
  };

  private onAdd = (event: Event) => {
    const detail = (event as CustomEvent<KanbanAddDetail>).detail;
    this.cards = [
      ...this.cards,
      {
        id: `job-new-${this.cards.length}`,
        column: detail.column.id,
        lane: detail.lane || MANAGERS[0],
        title: detail.text,
        subtitle: l(m("Nuova commessa · da assegnare")),
        code: `C2026-${2000 + this.cards.length}`,
        client: l(m("Da assegnare")),
        city: "Bergamo",
        manager: MANAGERS[0],
        tags: [],
        progress: 0,
        due: "2027-04-30",
        amount: 0,
      },
    ];
    this.requestUpdate();
    this.report(`${l(m("Nuova scheda"))}: ${detail.text}`);
  };

  private report(message: string) {
    this.dispatchEvent(
      new CustomEvent("demo-report", { detail: message, bubbles: true, composed: true }),
    );
  }

  private cardContent = (card: KanbanCard) => {
    const job = card as JobCard;
    const late = isLate(job);
    return html`
      <p class="kcode">${job.code}</p>
      <p class="ktitle" dir="auto">${job.title}</p>
      <p class="kclient" dir="auto">${job.client} · ${job.city}</p>
      ${job.tags.length
        ? html`<div class="ktags">
            ${job.tags.map((tag) => html`<span class="ktag">${tag}</span>`)}
          </div>`
        : ""}
      <div class="kprogress">
        <bolle-progress-indicator
          value=${job.progress}
          label=${l(m("Avanzamento"))}
        ></bolle-progress-indicator>
        <span class="knum">${job.progress}%</span>
      </div>
      <div class="kfoot">
        <span class="kavatar" aria-hidden="true">${initials(job.manager)}</span>
        <span class="kmanager" dir="auto">${job.manager}</span>
        <span class="kdue ${late ? "late" : ""}"
          >${late ? l(m("in ritardo")) : formatDate(job.due)}</span
        >
        <span class="kamount">${euro.format(job.amount)}</span>
      </div>
    `;
  };

  protected render() {
    return html`<bolle-kanban
        .label=${this.label}
        .columns=${this.columns}
        .cards=${this.cards}
        .collapsed=${this.collapsed}
        .density=${this.density}
        ?lanes=${this.lanes}
        ?collapsible=${this.collapsible}
        ?addable=${this.addable}
        ?movable=${this.movable}
        .laneLabel=${(key: string) => key}
        .restrict=${this.restrict}
        .card=${this.cardContent}
        .contentStyles=${contentCss.cssText}
        .cardActions=${[
          { id: "duplicate", label: l(m("Duplica la scheda")) },
          { id: "archive", label: l(m("Archivia la scheda")) },
        ]}
        .columnActions=${[{ id: "sort", label: l(m("Ordina per scadenza")) }]}
        @card-move=${this.onMove}
        @card-move-blocked=${this.onBlocked}
        @card-open=${this.onOpen}
        @card-action=${this.onCardAction}
        @column-action=${this.onColumnAction}
        @column-collapse=${this.onCollapse}
        @card-add=${this.onAdd}
      ></bolle-kanban>`;
  }
}

if (!customElements.get("demo-kanban"))
  customElements.define("demo-kanban", BolleKanbanDemo);
