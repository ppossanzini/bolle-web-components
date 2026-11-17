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
} from "../../src/index.js";
import grip from "@tabler/icons/outline/grip-vertical.svg?raw";
import dots from "@tabler/icons/outline/dots-vertical.svg?raw";
import plus from "@tabler/icons/outline/plus.svg?raw";
import close from "@tabler/icons/outline/x.svg?raw";
import alert from "@tabler/icons/outline/alert-triangle.svg?raw";
import refresh from "@tabler/icons/outline/refresh.svg?raw";
import chevronRight from "@tabler/icons/outline/chevron-right.svg?raw";
import chevronLeft from "@tabler/icons/outline/chevron-left.svg?raw";
import databaseOff from "@tabler/icons/outline/database-off.svg?raw";
import columnsIcon from "@tabler/icons/outline/columns-3.svg?raw";
import {
  COLUMNS,
  MANAGERS,
  TODAY_ISO,
  makeBoard,
  type Card,
  type Column,
  type Phase,
} from "./data.js";

const icon = (svg: string, extra = "") =>
  html`<span class="icon ${extra}" aria-hidden="true">${unsafeSVG(svg)}</span>`;

const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const dayMonth = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short" });
const formatDate = (iso: string) => dayMonth.format(new Date(`${iso}T12:00`));
const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
const normalize = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
const isLate = (card: Card) => card.due < TODAY_ISO && card.phase !== "chiuso";
const daysLate = (card: Card) =>
  Math.round(
    (new Date(`${TODAY_ISO}T12:00`).getTime() - new Date(`${card.due}T12:00`).getTime()) /
      86_400_000,
  );

type Lane = "none" | "manager" | "client";
type Scenario = "normal" | "loading" | "empty" | "error";
type Density = "comfortable" | "compact";

interface Drag {
  cardId: string;
  lane: string;
  overColumn: Phase;
  overIndex: number;
  refused: string;
  /** Pointer position in viewport coordinates. */
  x: number;
  y: number;
  /** Offset of the grab point inside the card. */
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

class ProtoKanbanApp extends LitElement {
  static properties = {
    cards: { state: true },
    columns: { state: true },
    collapsed: { state: true },
    lane: { state: true },
    query: { state: true },
    managers: { state: true },
    scenario: { state: true },
    density: { state: true },
    selected: { state: true },
    drag: { state: true },
    composing: { state: true },
    announcement: { state: true },
  };

  declare cards: Card[];
  declare columns: Column[];
  declare collapsed: string[];
  declare lane: Lane;
  declare query: string;
  declare managers: string[];
  declare scenario: Scenario;
  declare density: Density;
  declare selected: string | undefined;
  declare drag: Drag | undefined;
  declare composing: { phase: Phase; lane: string } | undefined;
  declare announcement: string;

  private menuContext:
    | { kind: "card"; id: string }
    | { kind: "column"; phase: Phase }
    | { kind: "scenario" }
    | undefined;

  constructor() {
    super();
    this.cards = makeBoard();
    this.columns = COLUMNS.map((column) => ({ ...column }));
    this.collapsed = [];
    this.lane = "none";
    this.query = "";
    this.managers = [];
    this.scenario = "normal";
    this.density = "comfortable";
    this.selected = undefined;
    this.announcement = "";
  }

  createRenderRoot() {
    return this;
  }

  /* Data ---------------------------------------------------------------- */

  private get visible() {
    return this.cards.filter((card) => {
      if (
        this.query &&
        !normalize(`${card.code} ${card.title} ${card.client} ${card.city}`).includes(
          normalize(this.query.trim()),
        )
      )
        return false;
      if (this.managers.length && !this.managers.includes(card.manager)) return false;
      return true;
    });
  }

  private inColumn(phase: Phase, laneValue?: string) {
    return this.visible.filter(
      (card) =>
        card.phase === phase &&
        (laneValue === undefined || this.laneValue(card) === laneValue),
    );
  }

  private laneValue(card: Card) {
    if (this.lane === "manager") return card.manager;
    if (this.lane === "client") return card.client;
    return "";
  }

  private get lanes() {
    if (this.lane === "none") return [{ key: "", label: "" }];
    const values = [...new Set(this.visible.map((card) => this.laneValue(card)))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "it"));
    return values.map((key) => ({ key, label: key }));
  }

  private columnOf(phase: Phase) {
    return this.columns.find((column) => column.id === phase)!;
  }

  private countIn(phase: Phase) {
    return this.inColumn(phase).length;
  }

  /* Rules --------------------------------------------------------------- */

  /** The application decides where a card may go, the board only asks. */
  private canMove(card: Card, phase: Phase): { ok: boolean; reason?: string } {
    if (card.phase === phase) return { ok: true };
    if (card.phase === "chiuso")
      return { ok: false, reason: "Una commessa chiusa non si riapre dal kanban." };
    if (phase === "chiuso" && card.progress < 100)
      return {
        ok: false,
        reason: "Per passare in Chiuso l'avanzamento deve essere al 100%.",
      };
    if (phase === "in-corso" && card.phase === "programmato" && card.progress > 60)
      return {
        ok: false,
        reason: "Una commessa già avanzata non torna in cantiere senza un verbale.",
      };
    return { ok: true };
  }

  private moveCard(card: Card, phase: Phase, index?: number) {
    const verdict = this.canMove(card, phase);
    if (!verdict.ok) {
      this.announce(verdict.reason ?? "");
      this.notify(verdict.reason ?? "");
      return false;
    }
    const column = this.columnOf(phase);
    const count = this.inColumn(phase).length;
    if (column.wip > 0 && count >= column.wip && card.phase !== phase)
      this.notify(
        `Attenzione: ${column.label} supera il limite consigliato (${count + 1} su ${column.wip}).`,
      );
    const others = this.cards.filter((item) => item.id !== card.id);
    const moved = { ...card, phase };
    if (index === undefined) {
      this.cards = [...others, moved];
    } else {
      const sameColumn = others.filter((item) => item.phase === phase);
      const rest = others.filter((item) => item.phase !== phase);
      sameColumn.splice(Math.max(0, Math.min(index, sameColumn.length)), 0, moved);
      this.cards = [...rest, ...sameColumn];
    }
    this.announce(
      `${card.code} in ${column.label}${index !== undefined ? `, posizione ${index + 1}` : ""}.`,
    );
    return true;
  }

  private ordered(phase: Phase) {
    return this.cards.filter((card) => card.phase === phase);
  }

  private reorderWithin(phase: Phase, card: Card, step: -1 | 1) {
    const list = this.ordered(phase);
    const index = list.findIndex((item) => item.id === card.id);
    const target = index + step;
    if (target < 0 || target >= list.length) {
      this.announce("La scheda è già al bordo della colonna.");
      return;
    }
    this.moveCard(card, phase, target);
  }

  /* Announcements ------------------------------------------------------- */

  private announce(message: string) {
    this.announcement = "";
    requestAnimationFrame(() => (this.announcement = message));
  }

  private notify(message: string) {
    const bar = this.querySelector<BolleSnackbar>("bolle-snackbar");
    if (!bar) return;
    bar.actionLabel = "";
    bar.show(message);
  }

  /* Pointer drag -------------------------------------------------------- */

  private startDrag(event: PointerEvent, card: Card) {
    if (event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    const box = (handle.closest(".kcard") as HTMLElement).getBoundingClientRect();
    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      /* A pointer without an active capture still tracks through the listeners below. */
    }
    const laneValue = this.laneValue(card);
    const drop = (target: Phase, lane: string, index: number, x: number, y: number) => {
      const verdict = this.canMove(card, target);
      this.drag = {
        cardId: card.id,
        lane,
        overColumn: target,
        overIndex: index,
        refused: verdict.ok ? "" : (verdict.reason ?? ""),
        x,
        y,
        offsetX: event.clientX - box.left,
        offsetY: event.clientY - box.top,
        width: box.width,
        height: box.height,
      };
    };
    drop(
      card.phase,
      laneValue,
      this.ordered(card.phase).findIndex((item) => item.id === card.id),
      event.clientX,
      event.clientY,
    );

    const board = this.querySelector<HTMLElement>(".board");
    const columns = this.querySelector<HTMLElement>(".kcolumns");
    let frame = 0;
    /* The column strip scrolls sideways; the list under the pointer scrolls down. */
    const scrollSideways = (delta: number) => {
      if (columns && columns.scrollWidth > columns.clientWidth) columns.scrollLeft += delta;
      else if (board) board.scrollLeft += delta;
    };
    const verticalScroller = (x: number, y: number) => {
      const under = document.elementFromPoint(x, y);
      const list = under?.closest<HTMLElement>(".klist");
      if (list && list.scrollHeight > list.clientHeight) return list;
      if (board && board.scrollHeight > board.clientHeight) return board;
      return undefined;
    };
    const scroll = () => {
      const drag = this.drag;
      if (!board || !drag) return;
      const bounds = board.getBoundingClientRect();
      const edge = 72;
      if (drag.x < bounds.left + edge) scrollSideways(-14);
      else if (drag.x > bounds.right - edge) scrollSideways(14);
      const list = verticalScroller(drag.x, drag.y);
      if (list) {
        const listBounds = list.getBoundingClientRect();
        if (drag.y < listBounds.top + 48) list.scrollTop -= 12;
        else if (drag.y > listBounds.bottom - 48) list.scrollTop += 12;
      }
      /* The loop runs for the whole drag: the edge can be reached at any time. */
      frame = requestAnimationFrame(scroll);
    };

    const move = (moveEvent: PointerEvent) => {
      const element = document
        .elementsFromPoint(moveEvent.clientX, moveEvent.clientY)
        .find(
          (item) => item instanceof HTMLElement && item.dataset.phase,
        ) as HTMLElement | undefined;
      if (!element) {
        if (this.drag)
          this.drag = {
            ...this.drag,
            x: moveEvent.clientX,
            y: moveEvent.clientY,
          };
        return;
      }
      const phase = element.dataset.phase as Phase;
      const cards = [...element.querySelectorAll<HTMLElement>(".kcard")];
      let index = cards.length;
      for (const [position, cardElement] of cards.entries()) {
        const cardBox = cardElement.getBoundingClientRect();
        if (moveEvent.clientY < cardBox.top + cardBox.height / 2) {
          index = position;
          break;
        }
      }
      drop(phase, element.dataset.lane ?? "", index, moveEvent.clientX, moveEvent.clientY);
    };
    const cancel = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key !== "Escape") return;
      keyEvent.preventDefault();
      stop(true);
      this.announce("Spostamento annullato.");
    };
    const stop = (cancelled = false) => {
      cancelAnimationFrame(frame);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", abort);
      window.removeEventListener("keydown", cancel, true);
      const drag = this.drag;
      this.drag = undefined;
      if (!drag) return;
      if (cancelled) {
        this.announce("Spostamento annullato.");
        return;
      }
      if (drag.refused) {
        this.announce(drag.refused);
        this.notify(drag.refused);
        return;
      }
      this.moveCard(card, drag.overColumn, drag.overIndex);
    };
    const up = () => stop(false);
    const abort = () => stop(true);
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", abort);
    window.addEventListener("keydown", cancel, true);
    frame = requestAnimationFrame(scroll);
  }

  /* Menus --------------------------------------------------------------- */

  private openMenu(
    event: Event,
    items: MenuEntry[],
    label: string,
    context: NonNullable<ProtoKanbanApp["menuContext"]>,
  ) {
    const menu = this.querySelector<BolleMenu>("bolle-menu#context");
    if (!menu) return;
    menu.items = items;
    menu.menuLabel = label;
    menu.selectionMode = "none";
    this.menuContext = context;
    void menu.show(event.currentTarget as HTMLElement);
  }

  private cardMenu(event: Event, card: Card) {
    const phases = this.columns.filter((column) => column.id !== card.phase);
    this.openMenu(
      event,
      [
        { id: "open", label: "Apri scheda" },
        {
          group: true,
          label: "Sposta in",
          items: phases.map((column) => {
            const verdict = this.canMove(card, column.id);
            return {
              id: `move:${column.id}`,
              label: column.label,
              disabled: !verdict.ok,
              supportingText: verdict.reason,
            };
          }),
        },
        { separator: true },
        { id: "before", label: "Sposta prima nella colonna", trailingText: "Alt ↑" },
        { id: "after", label: "Sposta dopo nella colonna", trailingText: "Alt ↓" },
        { separator: true },
        { id: "duplicate", label: "Duplica scheda" },
      ],
      `Azioni per ${card.code}`,
      { kind: "card", id: card.id },
    );
  }

  private columnMenu(event: Event, column: Column) {
    const index = this.columns.findIndex((item) => item.id === column.id);
    this.openMenu(
      event,
      [
        {
          id: "collapse",
          label: this.collapsed.includes(column.id)
            ? "Espandi la colonna"
            : "Comprimi la colonna",
        },
        { id: "left", label: "Sposta a sinistra", disabled: index === 0 },
        {
          id: "right",
          label: "Sposta a destra",
          disabled: index === this.columns.length - 1,
        },
        { separator: true },
        { id: "sort", label: "Ordina per scadenza" },
      ],
      `Colonna ${column.label}`,
      { kind: "column", phase: column.id },
    );
  }

  private scenarioMenu(event: Event) {
    this.openMenu(
      event,
      [
        {
          group: true,
          label: "Stato della board",
          items: [
            { id: "normal", label: "Con schede", selected: this.scenario === "normal" },
            { id: "loading", label: "Caricamento", selected: this.scenario === "loading" },
            { id: "empty", label: "Senza schede", selected: this.scenario === "empty" },
            { id: "error", label: "Errore", selected: this.scenario === "error" },
          ],
        },
        { separator: true },
        { id: "reset", label: "Ripristina la board" },
      ],
      "Scenario di prova",
      { kind: "scenario" },
    );
  }

  private onMenuSelect(event: CustomEvent<MenuSelectDetail>) {
    const context = this.menuContext;
    const id = event.detail.item.id;
    if (!context) return;
    if (context.kind === "scenario") {
      if (id === "reset") {
        this.cards = makeBoard();
        this.columns = COLUMNS.map((column) => ({ ...column }));
        this.collapsed = [];
        this.notify("Board ripristinata.");
        return;
      }
      this.scenario = id as Scenario;
      return;
    }
    if (context.kind === "column") {
      const column = this.columnOf(context.phase);
      const index = this.columns.findIndex((item) => item.id === column.id);
      if (id === "collapse")
        this.collapsed = this.collapsed.includes(column.id)
          ? this.collapsed.filter((item) => item !== column.id)
          : [...this.collapsed, column.id];
      else if (id === "left" || id === "right") {
        const next = [...this.columns];
        const [moved] = next.splice(index, 1);
        next.splice(index + (id === "left" ? -1 : 1), 0, moved);
        this.columns = next;
        this.announce(`${column.label} in posizione ${next.indexOf(moved) + 1}.`);
      } else if (id === "sort") {
        const sorted = [...this.ordered(column.id)].sort((a, b) =>
          a.due.localeCompare(b.due),
        );
        const rest = this.cards.filter((card) => card.phase !== column.id);
        this.cards = [...rest, ...sorted];
        this.announce(`${column.label} ordinata per scadenza.`);
      }
      return;
    }
    const card = this.cards.find((item) => item.id === context.id);
    if (!card) return;
    if (id === "open") this.openCard(card);
    else if (id === "duplicate") {
      this.cards = [
        ...this.cards,
        { ...card, id: `${card.id}-copy-${Date.now()}`, code: `${card.code} bis` },
      ];
      this.notify(`Copia creata da ${card.code}.`);
    } else if (id.startsWith("move:"))
      this.moveCard(card, id.slice(5) as Phase);
    else if (id === "before") this.reorderWithin(card.phase, card, -1);
    else if (id === "after") this.reorderWithin(card.phase, card, 1);
  }

  /* Keyboard ------------------------------------------------------------ */

  private cardKeys(event: KeyboardEvent, card: Card) {
    if (!event.altKey) return;
    const rtl = getComputedStyle(this).direction === "rtl";
    const list = this.ordered(card.phase);
    const index = list.findIndex((item) => item.id === card.id);
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      this.reorderWithin(card.phase, card, event.key === "ArrowUp" ? -1 : 1);
      return;
    }
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = (event.key === "ArrowLeft") !== rtl ? -1 : 1;
    const columns = this.columns;
    const at = columns.findIndex((column) => column.id === card.phase);
    const next = columns[at + step];
    if (!next) {
      this.announce("Non c'è un'altra colonna in quella direzione.");
      return;
    }
    if (this.moveCard(card, next.id, index))
      void this.updateComplete.then(() =>
        this.querySelector<HTMLElement>(`[data-card="${card.id}"] .kgrip`)?.focus(),
      );
  }

  /* Composer ------------------------------------------------------------ */

  private addCard(phase: Phase, laneValue: string, text: string) {
    const value = text.trim();
    if (!value) {
      this.composing = undefined;
      return;
    }
    this.cards = [
      ...this.cards,
      {
        id: `card-new-${Date.now()}`,
        code: `C2026-${1200 + this.cards.length}`,
        title: value,
        client: "Da assegnare",
        city: "—",
        manager: this.managers[0] ?? MANAGERS[0],
        phase,
        due: TODAY_ISO,
        progress: phase === "programmato" ? 0 : 5,
        amount: 0,
        tags: [],
      },
    ];
    this.composing = undefined;
    this.announce(`Scheda aggiunta in ${this.columnOf(phase).label}.`);
  }

  /* Detail -------------------------------------------------------------- */

  private openCard(card: Card) {
    this.selected = card.id;
    void this.updateComplete.then(() =>
      this.querySelector<BolleSideSheet>("#detail")?.show(),
    );
  }

  /* Rendering ----------------------------------------------------------- */

  private renderCard(card: Card) {
    const dragging = this.drag?.cardId === card.id;
    const late = isLate(card);
    const selected = this.selected === card.id;
    return html`<li>
      <bolle-card
        class="kcard ${dragging ? "dragging" : ""} ${selected ? "selected" : ""}"
        variant="outlined"
        tail="none"
        data-card=${card.id}
        @click=${() => this.openCard(card)}
      >
        <div class="kcard-head">
          <button
            class="kgrip"
            aria-label=${`Sposta ${card.code}`}
            @pointerdown=${(event: PointerEvent) => this.startDrag(event, card)}
            @keydown=${(event: KeyboardEvent) => this.cardKeys(event, card)}
            @click=${(event: Event) => event.stopPropagation()}
            >${icon(grip)}</button
          >
          <span class="kcode">${card.code}</span>
          <span class="kspacer"></span>
          <bolle-icon-button
            variant="standard"
            size="xs"
            label=${`Azioni per ${card.code}`}
            haspopup="menu"
            @click=${(event: Event) => {
              event.stopPropagation();
              this.cardMenu(event, card);
            }}
            >${icon(dots)}</bolle-icon-button
          >
        </div>
        <p class="ktitle" dir="auto">${card.title}</p>
        <p class="kclient" dir="auto">${card.client} · ${card.city}</p>
        ${card.tags.length
          ? html`<div class="ktags">
              ${card.tags.map((tag) => html`<span class="ktag">${tag}</span>`)}
            </div>`
          : nothing}
        <div class="kprogress">
          <bolle-progress-indicator
            value=${card.progress}
            label=${`Avanzamento ${card.code}`}
          ></bolle-progress-indicator>
          <span class="knum">${card.progress}%</span>
        </div>
        <div class="kfoot">
          <span class="kavatar" aria-hidden="true">${initials(card.manager)}</span>
          <span class="kmanager" dir="auto">${card.manager}</span>
          <span class="kdue ${late ? "late" : ""}">
            ${late ? `${daysLate(card)} gg di ritardo` : formatDate(card.due)}
          </span>
          <span class="kamount">${euro.format(card.amount)}</span>
        </div>
      </bolle-card>
    </li>`;
  }

  private renderPlaceholder() {
    const drag = this.drag!;
    return html`<li
      class="kplaceholder ${drag.refused ? "refused" : ""}"
      style=${`block-size:${Math.round(drag.height)}px`}
      aria-hidden="true"
    ></li>`;
  }

  private renderGhost() {
    const drag = this.drag;
    if (!drag) return nothing;
    const card = this.cards.find((item) => item.id === drag.cardId);
    if (!card) return nothing;
    const note = drag.refused || `${this.columnOf(drag.overColumn).label} · posizione ${drag.overIndex + 1}`;
    return html`<div
      class="kghost-drop"
      style=${`inset-inline-start:${Math.round(drag.x - drag.offsetX)}px;inset-block-start:${Math.round(
        drag.y - drag.offsetY,
      )}px;inline-size:${Math.round(drag.width)}px`}
    >
      <bolle-card class="kghost ${drag.refused ? "refused" : ""}" variant="outlined" tail="none">
        <div class="kcard-head">
          <span class="kcode">${card.code}</span>
        </div>
        <p class="ktitle" dir="auto">${card.title}</p>
        <p class="kclient" dir="auto">${card.client} · ${card.city}</p>
      </bolle-card>
      <p class="kghost-note">${note}</p>
    </div>`;
  }

  private renderColumn(column: Column, laneValue: string) {
    const cards = this.inColumn(column.id, laneValue);
    const collapsed = this.collapsed.includes(column.id);
    const over =
      this.drag && this.drag.lane === laneValue && this.drag.overColumn === column.id;
    const overWip = column.wip > 0 && cards.length > column.wip;
    if (collapsed)
      return html`<section class="kcolumn collapsed" data-phase=${column.id} data-lane=${laneValue}>
        <button class="kcollapsed" @click=${() => (this.collapsed = this.collapsed.filter((id) => id !== column.id))}>
          ${icon(chevronRight)}
          <span class="kcolumn-label">${column.label}</span>
          <span class="kcount">${cards.length}</span>
        </button>
      </section>`;
    return html`<section
      class="kcolumn ${over ? (this.drag!.refused ? "refused" : "over") : ""}"
      data-phase=${column.id}
      data-lane=${laneValue}
      aria-label=${column.label}
    >
      <header class="kcolumn-head">
        <h2>${column.label}</h2>
        <span class="kcount ${overWip ? "over" : ""}" title=${column.wip ? `Limite consigliato ${column.wip}` : ""}>
          ${cards.length}${column.wip ? ` / ${column.wip}` : ""}
        </span>
        <bolle-icon-button
          variant="standard"
          size="xs"
          label=${`Aggiungi una scheda in ${column.label}`}
          @click=${() => (this.composing = { phase: column.id, lane: laneValue })}
          >${icon(plus)}</bolle-icon-button
        >
        <bolle-icon-button
          variant="standard"
          size="xs"
          label=${`Opzioni della colonna ${column.label}`}
          haspopup="menu"
          @click=${(event: Event) => this.columnMenu(event, column)}
          >${icon(dots)}</bolle-icon-button
        >
      </header>
      ${!cards.length && !over
        ? html`<p class="kempty">Nessuna scheda in questa colonna</p>`
        : nothing}
      <ol class="klist">
        ${cards.map((card, index) => html`
          ${over && this.drag!.overIndex === index ? this.renderPlaceholder() : nothing}
          ${this.renderCard(card)}
        `)}
        ${over && this.drag!.overIndex >= cards.length ? this.renderPlaceholder() : nothing}
      </ol>
      ${this.composing && this.composing.phase === column.id && this.composing.lane === laneValue
        ? html`<div class="kcomposer">
            <bolle-text-field
              label=${`Nuova scheda in ${column.label}`}
              placeholder="Titolo della scheda"
              autofocus
              @keydown=${(event: KeyboardEvent) => {
                if (event.key === "Enter")
                  this.addCard(column.id, laneValue, (event.target as HTMLInputElement).value);
                if (event.key === "Escape") this.composing = undefined;
              }}
              @change=${(event: CustomEvent<{ value: string }>) =>
                this.addCard(column.id, laneValue, event.detail.value)}
            ></bolle-text-field>
            <div class="kcomposer-actions">
              <bolle-button variant="text" size="xs" @click=${() => (this.composing = undefined)}
                >Annulla</bolle-button
              >
            </div>
          </div>`
        : nothing}
    </section>`;
  }

  private renderBoard() {
    if (this.scenario === "loading")
      return html`<div class="kstate">
        <bolle-loading-indicator label="Caricamento della board"></bolle-loading-indicator>
        <p>Caricamento delle schede…</p>
      </div>`;
    if (this.scenario === "error")
      return html`<div class="kstate" role="alert">
        ${icon(alert, "kstate-icon error")}
        <p>Non riusciamo a caricare la board</p>
        <bolle-button variant="tonal" @click=${() => (this.scenario = "normal")}
          >${icon(refresh)} Riprova</bolle-button
        >
      </div>`;
    if (this.scenario === "empty" || !this.visible.length)
      return html`<div class="kstate">
        ${icon(databaseOff, "kstate-icon")}
        <p>
          ${this.query || this.managers.length
            ? "Nessuna scheda corrisponde ai filtri"
            : "Non ci sono ancora schede"}
        </p>
        ${this.query || this.managers.length
          ? html`<bolle-button variant="tonal" @click=${() => {
              this.query = "";
              this.managers = [];
            }}>Cancella i filtri</bolle-button>`
          : html`<bolle-button variant="tonal" @click=${() => (this.composing = { phase: "programmato", lane: "" })}
              >${icon(plus)} Nuova scheda</bolle-button
            >`}
      </div>`;
    const lanes = this.lanes;
    return html`${lanes.map(
      (lane) => html`<section class="klane" aria-label=${lane.label || nothing}>
        ${lane.label
          ? html`<header class="klane-head">
              <h2>${lane.label}</h2>
              <span class="kcount">${this.visible.filter((card) => this.laneValue(card) === lane.key).length}</span>
            </header>`
          : nothing}
        <div class="kcolumns">
          ${this.columns.map((column) => this.renderColumn(column, lane.key))}
        </div>
      </section>`,
    )}`;
  }

  private renderDetail() {
    const card = this.cards.find((item) => item.id === this.selected);
    if (!card) return nothing;
    return html`<bolle-side-sheet
      id="detail"
      label=${`Scheda ${card.code}`}
      close-label="Chiudi la scheda"
      @closed=${() => (this.selected = undefined)}
    >
      <div class="kdetail">
        <span class="kcode">${card.code}</span>
        <h2 class="kdetail-title" dir="auto">${card.title}</h2>
        <p class="kclient" dir="auto">${card.client} · ${card.city}</p>
        <dl class="kfacts">
          <div><dt>Fase</dt><dd>${this.columnOf(card.phase).label}</dd></div>
          <div><dt>Responsabile</dt><dd>${card.manager}</dd></div>
          <div><dt>Scadenza</dt><dd>${formatDate(card.due)}</dd></div>
          <div><dt>Importo</dt><dd>${euro.format(card.amount)}</dd></div>
        </dl>
        <div class="kprogress big">
          <bolle-progress-indicator
            value=${card.progress}
            label="Avanzamento della commessa"
          ></bolle-progress-indicator>
          <span class="knum">${card.progress}%</span>
        </div>
        ${card.tags.length
          ? html`<div class="ktags">
              ${card.tags.map((tag) => html`<span class="ktag">${tag}</span>`)}
            </div>`
          : nothing}
        <div class="kdetail-moves">
          ${this.columns
            .filter((column) => column.id !== card.phase)
            .map((column) => {
              const verdict = this.canMove(card, column.id);
              return html`<bolle-button
                variant="tonal"
                size="xs"
                ?disabled=${!verdict.ok}
                title=${verdict.reason ?? ""}
                @click=${() => {
                  if (this.moveCard(card, column.id))
                    this.querySelector<BolleSideSheet>("#detail")?.close();
                }}
                >Sposta in ${column.label}</bolle-button
              >`;
            })}
        </div>
      </div>
    </bolle-side-sheet>`;
  }

  protected render() {
    const late = this.visible.filter(isLate).length;
    return html`<div class="app ${this.drag ? "dragging" : ""}" data-density=${this.density}>
      <header class="topbar">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true">${icon(columnsIcon)}</span>
          <div>
            <h1>Commesse</h1>
            <p class="brand-sub" dir="auto">
              ${this.visible.length} schede · ${late} in ritardo
            </p>
          </div>
        </div>
        <div class="topbar-actions">
          <bolle-search
            class="ksearch"
            label="Cerca nella board"
            placeholder="Cerca per codice, titolo, cliente…"
            .value=${this.query}
            @value-input=${(event: CustomEvent<{ value: string }>) =>
              (this.query = event.detail.value)}
          ></bolle-search>
          <bolle-button
            variant="outlined"
            haspopup="menu"
            @click=${(event: Event) => this.scenarioMenu(event)}
            >Scenario di prova</bolle-button
          >
        </div>
      </header>

      <div class="toolbar">
        <div class="filters" role="group" aria-label="Filtri per responsabile">
          ${MANAGERS.map(
            (manager) => html`<bolle-chip
              variant="filter"
              label=${manager}
              .selected=${this.managers.includes(manager)}
              @change=${() => {
                this.managers = this.managers.includes(manager)
                  ? this.managers.filter((item) => item !== manager)
                  : [...this.managers, manager];
              }}
            ></bolle-chip>`,
          )}
          ${this.managers.length
            ? html`<bolle-button variant="text" size="xs" @click=${() => (this.managers = [])}
                >Cancella</bolle-button
              >`
            : nothing}
        </div>
        <div class="toolbar-right">
          <bolle-select
            class="lane-select"
            label="Corsie"
            .value=${this.lane}
            @change=${(event: CustomEvent<{ value: string }>) =>
              (this.lane = event.detail.value as Lane)}
          >
            <option value="none">Nessuna corsia</option>
            <option value="manager">Per responsabile</option>
            <option value="client">Per cliente</option>
          </bolle-select>
          <bolle-segmented-buttons
            class="density"
            label="Densità"
            .value=${this.density}
            .items=${[
              { id: "comfortable", label: "Comoda" },
              { id: "compact", label: "Compatta" },
            ]}
            @change=${(event: CustomEvent<{ value: string }>) =>
              (this.density = event.detail.value as Density)}
          ></bolle-segmented-buttons>
        </div>
      </div>

      <main class="board ${this.lane === "none" ? "" : "has-lanes"}">${this.renderBoard()}</main>

      ${this.renderGhost()}
      ${this.renderDetail()}
      <bolle-menu id="context" menu-label="Azioni" @menu-select=${this.onMenuSelect}></bolle-menu>
      <bolle-snackbar close-label="Chiudi"></bolle-snackbar>
      <p class="sr-only" role="status" aria-live="polite">${this.announcement}</p>
    </div>`;
  }
}

customElements.define("proto-kanban-app", ProtoKanbanApp);
