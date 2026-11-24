import { html, nothing, unsafeCSS, type PropertyValues } from "lit";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { kanbanStyles } from "./kanban.styles.js";
import { kanbanLabels, type KanbanLabels } from "./localization.js";
import {
  alertIcon,
  columnGripIcon,
  databaseOffIcon,
  plusIcon,
  rowMenuIcon,
  sidebarExpandIcon,
} from "./icons.js";
import type { BolleMenu } from "./menu.js";
import type { MenuEntry, MenuSelectDetail } from "./menu.types.js";

export interface KanbanColumn {
  id: string;
  label: string;
  /** Advised limit; the board only reports the overrun, the application decides. */
  wip?: number;
}

export interface KanbanCard {
  id: string;
  /** Column the card sits in. */
  column: string;
  /** Lane the card belongs to; read only when the board is in `lanes` mode. */
  lane?: string;
  /** Text used by the announcements and by the default card content. */
  title: string;
  subtitle?: string;
}

export interface KanbanMoveDetail {
  card: KanbanCard;
  /** Requested column. */
  column: string;
  /** Requested lane, empty when the board has no lanes. */
  lane: string;
  /** Requested position inside the column. */
  index: number;
}

export interface KanbanMoveBlockedDetail extends KanbanMoveDetail {
  reason: string;
}

export interface KanbanCardDetail {
  card: KanbanCard;
}

export interface KanbanCardActionDetail {
  id: string;
  card: KanbanCard;
}

export interface KanbanColumnDetail {
  column: KanbanColumn;
}

export interface KanbanColumnActionDetail {
  id: string;
  column: KanbanColumn;
}

export interface KanbanCollapseDetail {
  column: KanbanColumn;
  collapsed: boolean;
}

export interface KanbanAddDetail {
  column: KanbanColumn;
  lane: string;
  text: string;
}

const fill = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );

interface Drag {
  card: KanbanCard;
  column: string;
  lane: string;
  index: number;
  refused: string;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

/**
 * Board of columns and cards the application owns: the component renders the
 * columns, moves the cards by drag or by keyboard, applies the move to its own
 * copy of `cards` and reports it in the `card-move` event. The rule that decides
 * whether a move is allowed belongs to the application, through `restrict`.
 */
export class BolleKanban extends BolleElement {
  static properties = {
    label: {},
    columns: { attribute: false },
    cards: { attribute: false },
    density: { reflect: true },
    lanes: { type: Boolean, reflect: true },
    laneLabel: { attribute: false },
    collapsible: { type: Boolean, reflect: true },
    collapsed: { attribute: false },
    movable: { type: Boolean, reflect: true },
    addable: { type: Boolean, reflect: true },
    restrict: { attribute: false },
    card: { attribute: false },
    cardActions: { attribute: false },
    columnActions: { attribute: false },
    selected: {},
    contentStyles: { attribute: false },
    loading: { type: Boolean, reflect: true },
    error: {},
    emptyLabel: { attribute: "empty-label" },
    labels: { attribute: false },
    columnMinWidth: { attribute: "column-min-width", type: Number },
    columnMaxWidth: { attribute: "column-max-width", type: Number },
    columnGap: { attribute: "column-gap", type: Number },
    cardGap: { attribute: "card-gap", type: Number },
    columnRenderer: { attribute: false },
    laneRenderer: { attribute: false },
    loadingRenderer: { attribute: false },
    errorRenderer: { attribute: false },
    emptyRenderer: { attribute: false },
    // Drag and composer state: the board re-renders on every pointer move.
    drag: { state: true },
    composing: { state: true },
    _announcement: { state: true },
  };
  static styles = [commonStyles, kanbanStyles];

  /** Accessible name of the board. */
  label = "";
  columns: KanbanColumn[] = [];
  cards: KanbanCard[] = [];
  density: "comfortable" | "compact" = "comfortable";
  /** Groups the cards in stacked strips by `card.lane`. */
  lanes = false;
  /** Label of a lane; the key itself when omitted. */
  laneLabel?: (key: string) => string;
  /** The reader can fold a column into a vertical strip. */
  collapsible = false;
  /** Ids of the folded columns; the board updates it when a column is folded. */
  collapsed: string[] = [];
  movable = false;
  /** Offers a quick add at the foot of every column. */
  addable = false;
  /**
   * Rule of the application: returns the reason of a refused move, or nothing
   * when the card may go there.
   */
  restrict?: (card: KanbanCard, column: KanbanColumn) => string | undefined;
  /** Card content, replacing the default title and subtitle. */
  card?: (card: KanbanCard, board: BolleKanban) => unknown;
  cardActions: MenuEntry[] = [];
  columnActions: MenuEntry[] = [];
  /** Id of the card drawn as selected. */
  selected = "";
  /**
   * CSS for the markup returned by `card`. It runs inside the board shadow root,
   * where the page stylesheet does not reach; pass its rules here as a string.
   */
  contentStyles = "";
  loading = false;
  /** Text shown instead of the board when it cannot be loaded. */
  error = "";
  emptyLabel = "";
  /** Replaces the built-in texts. */
  labels: Partial<KanbanLabels> = {};
  columnMinWidth = 260;
  columnMaxWidth = 360;
  columnGap = 16;
  cardGap = 8;
  columnRenderer?: (column: KanbanColumn, board: BolleKanban) => unknown;
  laneRenderer?: (lane: string, board: BolleKanban) => unknown;
  loadingRenderer?: (board: BolleKanban) => unknown;
  errorRenderer?: (error: string, board: BolleKanban) => unknown;
  emptyRenderer?: (board: BolleKanban) => unknown;

  /** Internal: the drag in progress, rendered by the board. */
  declare drag: Drag | undefined;
  /** Internal: the quick add open in a column. */
  declare composing: { column: string; lane: string } | undefined;

  private _announcement = "";
  private menuContext?:
    | { kind: "card"; card: KanbanCard }
    | { kind: "column"; column: KanbanColumn };

  private get text(): KanbanLabels {
    return kanbanLabels(document.documentElement.lang, this.labels);
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has("cards") && this.drag) {
      const still = this.cards.find((card) => card.id === this.drag!.card.id);
      if (!still) this.drag = undefined;
    }
  }

  private get menu() {
    return this.renderRoot.querySelector<BolleMenu>("bolle-menu");
  }

  private announce(message: string) {
    this._announcement = "";
    requestAnimationFrame(() => (this._announcement = message));
  }

  private laneOf(card: KanbanCard) {
    return this.lanes ? (card.lane ?? "") : "";
  }

  private get laneKeys() {
    if (!this.lanes) return [""];
    return [
      ...new Set(this.cards.map((card) => card.lane ?? "").filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));
  }

  private laneText(key: string) {
    return this.laneLabel ? this.laneLabel(key) : key;
  }

  private cardsIn(column: string, lane: string) {
    return this.cards.filter(
      (card) => card.column === column && this.laneOf(card) === lane,
    );
  }

  private columnOf(id: string) {
    return this.columns.find((column) => column.id === id);
  }

  /** Hit testing stays inside the shadow root: the document stops at the host. */
  private hitStack(x: number, y: number): Element[] {
    const root = this.renderRoot;
    const scope = root as ShadowRoot & {
      elementsFromPoint?: (x: number, y: number) => Element[];
    };
    return scope.elementsFromPoint
      ? scope.elementsFromPoint(x, y)
      : document.elementsFromPoint(x, y);
  }

  private canDrop(card: KanbanCard, column: string) {
    const target = this.columnOf(column);
    if (!target) return { ok: false, reason: this.text.unknownColumn };
    const reason = this.restrict?.(card, target);
    return reason ? { ok: false, reason } : { ok: true };
  }

  /* Moving ------------------------------------------------------------- */

  private applyMove(detail: KanbanMoveDetail) {
    const verdict = this.canDrop(detail.card, detail.column);
    if (!verdict.ok) {
      this.announce(verdict.reason ?? "");
      this.emit<KanbanMoveBlockedDetail>("card-move-blocked", {
        ...detail,
        reason: verdict.reason ?? this.text.unknownColumn,
      });
      return;
    }
    this.cards = this.moved(detail);
    this.emit<KanbanMoveDetail>("card-move", detail);
    const column = this.columnOf(detail.column)!;
    const overrun =
      column.wip &&
      this.cardsIn(column.id, detail.lane).length + 1 > column.wip;
    this.announce(
      overrun
        ? fill(this.text.wipOver, {
            column: column.label,
            count: this.cardsIn(column.id, detail.lane).length + 1,
            limit: column.wip ?? 0,
          })
        : fill(this.text.moved, {
            title: detail.card.title,
            column: column.label,
            index: detail.index + 1,
          }),
    );
  }

  /** New card array with the moved card at the requested place. */
  private moved(detail: KanbanMoveDetail): KanbanCard[] {
    const lane = this.lanes ? detail.lane : (detail.card.lane ?? "");
    const card: KanbanCard = { ...detail.card, column: detail.column, lane };
    const rest = this.cards.filter((item) => item.id !== card.id);
    const group = rest
      .map((item, index) => ({ item, index }))
      .filter(
        ({ item }) =>
          item.column === card.column &&
          this.laneOf(item) === this.laneOf(card),
      );
    const next = [...rest];
    if (detail.index < group.length)
      next.splice(group[detail.index].index, 0, card);
    else if (group.length) next.splice(group.at(-1)!.index + 1, 0, card);
    else next.push(card);
    return next;
  }

  private setCollapsed(column: KanbanColumn, collapsed: boolean) {
    this.collapsed = collapsed
      ? [...new Set([...this.collapsed, column.id])]
      : this.collapsed.filter((id) => id !== column.id);
    this.emit<KanbanCollapseDetail>("column-collapse", { column, collapsed });
    this.announce(
      fill(collapsed ? this.text.collapsed : this.text.expanded, {
        label: column.label,
      }),
    );
  }

  private keyMove(event: KeyboardEvent, card: KanbanCard) {
    if (!event.altKey) return;
    const horizontal = event.key === "ArrowRight" || event.key === "ArrowLeft";
    const vertical = event.key === "ArrowUp" || event.key === "ArrowDown";
    if (!horizontal && !vertical) return;
    event.preventDefault();
    event.stopPropagation();
    const lane = this.laneOf(card);
    if (horizontal) {
      const ids = this.columns.map((column) => column.id);
      const index = ids.indexOf(card.column);
      const next = index + (event.key === "ArrowRight" ? 1 : -1);
      if (next < 0 || next >= ids.length) {
        this.announce(this.text.edge);
        return;
      }
      this.applyMove({
        card,
        column: ids[next],
        lane,
        index: this.cardsIn(ids[next], lane).length,
      });
      return;
    }
    const list = this.cardsIn(card.column, lane);
    const index = list.findIndex((item) => item.id === card.id);
    const next = index + (event.key === "ArrowDown" ? 1 : -1);
    if (next < 0 || next >= list.length) {
      this.announce(this.text.edge);
      return;
    }
    this.applyMove({ card, column: card.column, lane, index: next });
  }

  /* Drag and drop ------------------------------------------------------ */

  private startDrag(event: PointerEvent, card: KanbanCard) {
    if (!this.movable || event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    const element = handle.closest<HTMLElement>(".card");
    if (!element) return;
    const box = element.getBoundingClientRect();
    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      /* A pointer without an active capture still tracks through the listeners below. */
    }
    const lane = this.laneOf(card);
    const place = (
      column: string,
      targetLane: string,
      index: number,
      x: number,
      y: number,
    ) => {
      const verdict = this.canDrop(card, column);
      this.drag = {
        card,
        column,
        lane: targetLane,
        index,
        refused: verdict.ok ? "" : (verdict.reason ?? ""),
        x,
        y,
        offsetX: event.clientX - box.left,
        offsetY: event.clientY - box.top,
        width: box.width,
        height: box.height,
      };
    };
    place(
      card.column,
      lane,
      this.cardsIn(card.column, lane).findIndex((item) => item.id === card.id),
      event.clientX,
      event.clientY,
    );

    const board = this.renderRoot.querySelector<HTMLElement>(".board");
    let frame = 0;
    const scrollSideways = (delta: number) => {
      if (board && board.scrollWidth > board.clientWidth) {
        board.scrollLeft += delta;
      }
    };
    const verticalScroller = (x: number, y: number) => {
      const under = this.hitStack(x, y)[0];
      const list = under?.closest<HTMLElement>(".list");
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
      const under = this.hitStack(moveEvent.clientX, moveEvent.clientY).find(
        (item) => item instanceof HTMLElement && item.dataset.column,
      ) as HTMLElement | undefined;
      if (!under) {
        if (this.drag)
          this.drag = {
            ...this.drag,
            x: moveEvent.clientX,
            y: moveEvent.clientY,
          };
        return;
      }
      const cards = [...under.querySelectorAll<HTMLElement>(".card")];
      let index = cards.length;
      for (const [position, cardElement] of cards.entries()) {
        const cardBox = cardElement.getBoundingClientRect();
        if (moveEvent.clientY < cardBox.top + cardBox.height / 2) {
          index = position;
          break;
        }
      }
      place(
        under.dataset.column ?? "",
        under.dataset.lane ?? this.drag?.lane ?? lane,
        index,
        moveEvent.clientX,
        moveEvent.clientY,
      );
    };
    const cancel = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key !== "Escape") return;
      keyEvent.preventDefault();
      stop(true);
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
        this.announce(this.text.cancelled);
        return;
      }
      if (drag.refused) {
        this.announce(drag.refused);
        this.emit<KanbanMoveBlockedDetail>("card-move-blocked", {
          card: drag.card,
          column: drag.column,
          lane: drag.lane,
          index: drag.index,
          reason: drag.refused,
        });
        return;
      }
      this.applyMove({
        card: drag.card,
        column: drag.column,
        lane: drag.lane,
        index: drag.index,
      });
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
    anchor: HTMLElement,
    items: MenuEntry[],
    context: NonNullable<BolleKanban["menuContext"]>,
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

  private cardMenu(event: Event, card: KanbanCard) {
    event.stopPropagation();
    if (!this.cardActions.length) return;
    this.openMenu(
      event.currentTarget as HTMLElement,
      this.cardActions,
      { kind: "card", card },
      fill(this.text.cardMenu, { title: card.title }),
    );
  }

  private columnMenu(event: Event, column: KanbanColumn) {
    event.stopPropagation();
    const open = this.collapsed.includes(column.id);
    const items: MenuEntry[] = [
      ...(this.collapsible
        ? [
            {
              id: "__collapse",
              label: open ? this.text.expand : this.text.collapse,
            },
          ]
        : []),
      ...this.columnActions,
    ];
    if (!items.length) return;
    this.openMenu(
      event.currentTarget as HTMLElement,
      items,
      { kind: "column", column },
      fill(this.text.columnMenu, { label: column.label }),
    );
  }

  private onMenuSelect(event: CustomEvent<MenuSelectDetail>) {
    const context = this.menuContext;
    const id = event.detail.item.id;
    this.menuContext = undefined;
    if (!context) return;
    if (id === "__collapse") {
      const column = context.kind === "column" ? context.column : undefined;
      if (!column) return;
      this.setCollapsed(column, !this.collapsed.includes(column.id));
      return;
    }
    if (context.kind === "card") {
      this.emit<KanbanCardActionDetail>("card-action", {
        id,
        card: context.card,
      });
      return;
    }
    this.emit<KanbanColumnActionDetail>("column-action", {
      id,
      column: context.column,
    });
  }

  /* Adding -------------------------------------------------------------- */

  private submitComposer(column: KanbanColumn, lane: string, value: string) {
    // Enter also fires change: the composer closes on the first submit and stays closed.
    if (!this.composing) return;
    const text = value.trim();
    this.composing = undefined;
    if (!text) return;
    this.emit<KanbanAddDetail>("card-add", { column, lane, text });
    this.announce(fill(this.text.added, { column: column.label }));
  }

  /* Rendering ----------------------------------------------------------- */

  private renderCard(card: KanbanCard) {
    const dragging = this.drag?.card.id === card.id;
    return html`<li part="card-row">
      <bolle-card
        class="card ${dragging ? "dragging" : ""} ${
          this.selected === card.id ? "selected" : ""
        }"
        part="card"
        variant="outlined"
        tail="none"
        data-card=${card.id}
        @click=${() => this.emit<KanbanCardDetail>("card-open", { card })}
      >
        <div class="card-head" part="card-header">
          ${
            this.movable
              ? html`<button
                  class="grip"
                  part="card-grip"
                  aria-label=${fill(this.text.moveCard, { title: card.title })}
                  @pointerdown=${(event: PointerEvent) => this.startDrag(event, card)}
                  @keydown=${(event: KeyboardEvent) => this.keyMove(event, card)}
                  @click=${(event: Event) => event.stopPropagation()}
                >
                  ${columnGripIcon()}
                </button>`
              : nothing
          }
          <span class="spacer"></span>
          ${
            this.cardActions.length
              ? html`<bolle-icon-button
                  variant="standard"
                  size="xs"
                  label=${fill(this.text.cardMenu, { title: card.title })}
                  haspopup="menu"
                  @click=${(event: Event) => this.cardMenu(event, card)}
                  >${rowMenuIcon()}</bolle-icon-button
                >`
              : nothing
          }
        </div>
        ${
          this.card
            ? html`<div class="card-body">${this.card(card, this)}</div>`
            : html`<div class="card-body">
                <p class="card-title" dir="auto">${card.title}</p>
                ${
                  card.subtitle
                    ? html`<p class="card-subtitle" dir="auto">
                        ${card.subtitle}
                      </p>`
                    : nothing
                }
              </div>`
        }
      </bolle-card>
    </li>`;
  }

  private renderPlaceholder() {
    const drag = this.drag!;
    return html`<li
      class="placeholder ${drag.refused ? "refused" : ""}"
      style=${`block-size:${Math.round(drag.height)}px`}
      aria-hidden="true"
    ></li>`;
  }

  private renderGhost() {
    const drag = this.drag;
    if (!drag) return nothing;
    const note =
      drag.refused ||
      fill(this.text.dropAt, {
        column: this.columnOf(drag.column)?.label ?? drag.column,
        index: drag.index + 1,
      });
    return html`<div
      class="ghost-drop"
      style=${`inset-inline-start:${Math.round(drag.x - drag.offsetX)}px;inset-block-start:${Math.round(
        drag.y - drag.offsetY,
      )}px;inline-size:${Math.round(drag.width)}px`}
    >
      <bolle-card
        class="ghost ${drag.refused ? "refused" : ""}"
        variant="outlined"
        tail="none"
      >
        <p class="card-title" dir="auto">${drag.card.title}</p>
        ${
          drag.card.subtitle
            ? html`<p class="card-subtitle" dir="auto">
                ${drag.card.subtitle}
              </p>`
            : nothing
        }
      </bolle-card>
      <p class="ghost-note">${note}</p>
    </div>`;
  }

  private renderColumn(column: KanbanColumn, lane: string) {
    const cards = this.cardsIn(column.id, lane);
    const folded = this.collapsed.includes(column.id);
    const over =
      this.drag && this.drag.lane === lane && this.drag.column === column.id;
    const overWip = column.wip ? cards.length > column.wip : false;
    if (folded)
      return html`<section
        class="column collapsed"
        part="column column-collapsed"
        data-column=${column.id}
        data-lane=${lane}
      >
        <button
          class="collapse-strip"
          @click=${() => this.setCollapsed(column, false)}
          aria-label=${fill(this.text.expandColumn, { label: column.label })}
        >
          ${sidebarExpandIcon()}
          <span class="label">${column.label}</span>
          <span class="count">${cards.length}</span>
        </button>
      </section>`;
    return html`<section
      class="column ${over ? (this.drag!.refused ? "refused" : "over") : ""}"
      part="column"
      data-column=${column.id}
      data-lane=${lane}
      aria-label=${column.label}
    >
      <header class="column-head" part="column-header">
        ${
          this.columnRenderer
            ? this.columnRenderer(column, this)
            : html`<h2 part="column-title">${column.label}</h2>
                <span
                  class="count ${overWip ? "over" : ""}"
                  part="column-count"
                  title=${column.wip ? fill(this.text.wipLimit, { count: column.wip }) : nothing}
                >
                  ${cards.length}${column.wip ? ` / ${column.wip}` : ""}
                </span>`
        }
        <span class="spacer"></span>
        ${
          this.addable
            ? html`<bolle-icon-button
                variant="standard"
                size="xs"
                label=${fill(this.text.addCard, { column: column.label })}
                @click=${() => (this.composing = { column: column.id, lane })}
                >${plusIcon()}</bolle-icon-button
              >`
            : nothing
        }
        ${
          this.collapsible || this.columnActions.length
            ? html`<bolle-icon-button
                variant="standard"
                size="xs"
                label=${fill(this.text.columnMenu, { label: column.label })}
                haspopup="menu"
                @click=${(event: Event) => this.columnMenu(event, column)}
                >${rowMenuIcon()}</bolle-icon-button
              >`
            : nothing
        }
      </header>
      ${
        !cards.length && !over
          ? html`<p class="empty-column">${this.text.emptyColumn}</p>`
          : nothing
      }
      <ol class="list">
        ${cards.map(
          (card, index) =>
            html`${
              over && this.drag!.index === index
                ? this.renderPlaceholder()
                : nothing
            }${this.renderCard(card)}`,
        )}
        ${
          over && this.drag!.index >= cards.length
            ? this.renderPlaceholder()
            : nothing
        }
      </ol>
      ${
        this.composing &&
        this.composing.column === column.id &&
        this.composing.lane === lane
          ? html`<div class="composer">
              <bolle-text-field
                label=${fill(this.text.newCard, { column: column.label })}
                placeholder=${this.text.cardPlaceholder}
                autofocus
                @keydown=${(event: KeyboardEvent) => {
                  if (event.key === "Enter")
                    this.submitComposer(
                      column,
                      lane,
                      (event.target as HTMLInputElement).value,
                    );
                  if (event.key === "Escape") this.composing = undefined;
                }}
                @change=${(event: CustomEvent<{ value: string }>) =>
                  this.submitComposer(column, lane, event.detail.value)}
              ></bolle-text-field>
              <div class="composer-actions">
                <bolle-button
                  variant="text"
                  size="xs"
                  @click=${() => (this.composing = undefined)}
                  >${this.text.cancel}</bolle-button
                >
              </div>
            </div>`
          : nothing
      }
    </section>`;
  }

  private renderState() {
    if (this.loading)
      return html`<div class="state" part="loading">
        <slot name="loading">
          ${
            this.loadingRenderer
              ? this.loadingRenderer(this)
              : html`
                  <bolle-loading-indicator
                    label=${this.text.loading}
                  ></bolle-loading-indicator>
                  <p>${this.text.loading}</p>
                `
          }
        </slot>
      </div>`;
    if (this.error)
      return html`<div class="state" part="error">
        <slot name="error">
          ${
            this.errorRenderer
              ? this.errorRenderer(this.error, this)
              : html`
                  <bolle-empty-state
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
                  </bolle-empty-state>
                `
          }
        </slot>
      </div>`;
    return html`<div class="state" part="empty">
      <slot name="empty">
        ${
          this.emptyRenderer
            ? this.emptyRenderer(this)
            : html`
                <bolle-empty-state
                  .icon=${databaseOffIcon()}
                  .title=${this.emptyLabel || this.text.empty}
                >
                </bolle-empty-state>
              `
        }
      </slot>
    </div>`;
  }

  protected render() {
    const state = this.loading || this.error || !this.cards.length;
    return html`<div
      class="board"
      part="board"
      role="group"
      aria-label=${this.label || nothing}
      style=${`--kanban-column-min-width:${Math.max(1, this.columnMinWidth)}px;--kanban-column-max-width:${Math.max(this.columnMinWidth, this.columnMaxWidth)}px;--kanban-column-gap:${Math.max(0, this.columnGap)}px;--kanban-card-gap:${Math.max(0, this.cardGap)}px`}
    >
      ${
        this.contentStyles
          ? html`<style>
              ${unsafeCSS(this.contentStyles)}
            </style>`
          : nothing
      }
      ${
        state
          ? this.renderState()
          : this.laneKeys.map((lane) => {
              const label = this.laneText(lane);
              return html`<section
                class="lane"
                part="lane"
                aria-label=${label || nothing}
              >
                ${
                  this.lanes && label
                    ? html`<header class="lane-head" part="lane-header">
                        ${
                          this.laneRenderer
                            ? this.laneRenderer(lane, this)
                            : html`<h2>${label}</h2>
                                <span class="count"
                                  >${this.cards.filter((card) => this.laneOf(card) === lane).length}</span
                                >`
                        }
                      </header>`
                    : nothing
                }
                <div class="columns">
                  ${this.columns.map((column) => this.renderColumn(column, lane))}
                </div>
              </section>`;
            })
      }
      ${this.renderGhost()}
      <span class="sr-only" role="status" aria-live="polite"
        >${this._announcement}</span
      >
      <bolle-menu
        menu-label=${this.text.boardMenu}
        @menu-select=${this.onMenuSelect}
      ></bolle-menu>
    </div>`;
  }
}
