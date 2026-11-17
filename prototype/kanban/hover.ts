// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
// Confronto affiancato delle tre varianti di hover della scheda del kanban.

import { LitElement, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import "../../src/index.js";
import grip from "@tabler/icons/outline/grip-vertical.svg?raw";
import dots from "@tabler/icons/outline/dots-vertical.svg?raw";
import { makeBoard, TODAY_ISO, type Card } from "./data.js";

const icon = (svg: string) =>
  html`<span class="icon" aria-hidden="true">${unsafeSVG(svg)}</span>`;

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
    .slice(0, 2)
    .toUpperCase();
const isLate = (card: Card) => card.due < TODAY_ISO && card.phase !== "chiuso";

const MODES = [
  {
    id: "layer",
    label: "A · Strato di stato",
    note: "La superficie si scurisce di un gradino, come un controllo Material. Nessuna ombra.",
  },
  {
    id: "lift",
    label: "B · Sollevamento",
    note: "Ombra float-2 attorno alla scheda, la superficie resta invariata.",
  },
  {
    id: "both",
    label: "C · Strato di stato + sollevamento",
    note: "Le due risposte insieme: la scheda si scurisce e si stacca dal fondo.",
  },
] as const;

class ProtoKanbanHover extends LitElement {
  static properties = {
    theme: { state: true },
  };

  declare theme: "light" | "dark";

  private cards: Card[] = makeBoard().filter((card) => card.phase === "in-corso").slice(0, 3);

  constructor() {
    super();
    this.theme = "light";
  }

  createRenderRoot() {
    return this;
  }

  private toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = this.theme;
  }

  private renderCard(card: Card, frozen = false) {
    const late = isLate(card);
    return html`<bolle-card
      class="kcard ${frozen ? "force-hover" : ""}"
      variant="outlined"
      tail="none"
    >
      <div class="kcard-head">
        <button class="kgrip" aria-label=${`Sposta ${card.code}`}>${icon(grip)}</button>
        <span class="kcode">${card.code}</span>
        <span class="kspacer"></span>
        <bolle-icon-button variant="standard" size="xs" label=${`Azioni per ${card.code}`}
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
        <span class="kdue ${late ? "late" : ""}">${formatDate(card.due)}</span>
        <span class="kamount">${euro.format(card.amount)}</span>
      </div>
    </bolle-card>`;
  }

  render() {
    return html`<style>
        proto-kanban-hover {
          display: block;
        }
        .confronto {
          min-block-size: 100dvh;
          padding: 24px clamp(14px, 3vw, 32px) 40px;
          background: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
        }
        .confronto-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-block-end: 6px;
        }
        .confronto h1 {
          margin: 0;
          font: var(--md-sys-typescale-headline-small-font);
        }
        .confronto-lead {
          margin: 0 0 20px;
          max-inline-size: 78ch;
          font: var(--md-sys-typescale-body-medium-font);
          color: var(--md-sys-color-on-surface-variant);
        }
        .pannelli {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .pannelli {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        .pannello {
          padding: 8px;
          border-radius: 20px 20px 20px 6px;
          background: var(--md-sys-color-surface-container-low);
          border: 1px solid var(--md-sys-color-outline-variant);
        }
        .pannello-head {
          padding: 6px 8px 10px;
        }
        .pannello-head h2 {
          margin: 0;
          font: var(--md-sys-typescale-title-small-font);
        }
        .pannello-head p {
          margin: 4px 0 0;
          font: var(--md-sys-typescale-body-small-font);
          color: var(--md-sys-color-on-surface-variant);
        }
        .pannello-lista {
          display: grid;
          gap: 10px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        /* One rule per panel; .force-hover freezes the same state so the three read side by side. */
        .pannello .kcard:hover,
        .pannello .kcard.force-hover {
          --md-sys-color-surface: var(--md-sys-color-surface);
          box-shadow: none;
        }
        .pannello[data-mode="layer"] .kcard:hover,
        .pannello[data-mode="layer"] .kcard.force-hover {
          --md-sys-color-surface: var(--md-sys-color-surface-container);
        }
        .pannello[data-mode="lift"] .kcard:hover,
        .pannello[data-mode="lift"] .kcard.force-hover {
          box-shadow: var(--bb-float-2);
        }
        .pannello[data-mode="both"] .kcard:hover,
        .pannello[data-mode="both"] .kcard.force-hover {
          --md-sys-color-surface: var(--md-sys-color-surface-container);
          box-shadow: var(--bb-float-2);
        }
        .pannello .kcard.force-hover .kgrip,
        .pannello .kcard:hover .kgrip {
          opacity: 1;
        }
        .scheda-etichetta {
          margin: 0 0 4px;
          font: var(--md-sys-typescale-label-small-font);
          color: var(--md-sys-color-on-surface-variant);
        }
        .pannello[data-mode="lift"] .kcard,
        .pannello[data-mode="both"] .kcard {
          transition: box-shadow 140ms;
        }
      </style>
      <div class="confronto">
        <div class="confronto-head">
          <h1>Hover della scheda · tre varianti</h1>
          <bolle-button variant="tonal" @click=${this.toggleTheme}>
            ${this.theme === "light" ? "Tema scuro" : "Tema chiaro"}
          </bolle-button>
        </div>
        <p class="confronto-lead">
          Stesse schede, stesso fondo di colonna, stessa spaziatura: cambia solo la risposta all'hover. La
          prima scheda di ogni pannello mostra lo stato fermo, le altre due rispondono al puntatore. La
          maniglia di trascinamento resta attenuata e diventa piena su hover in tutte tre le varianti.
        </p>
        <div class="pannelli">
          ${MODES.map(
            (mode) => html`<section class="pannello" data-mode=${mode.id} aria-label=${mode.label}>
              <header class="pannello-head">
                <h2>${mode.label}</h2>
                <p>${mode.note}</p>
              </header>
              <ul class="pannello-lista">
                <li>
                  <p class="scheda-etichetta">Stato di hover fermo</p>
                  ${this.renderCard(this.cards[0], true)}
                </li>
                ${this.cards.slice(1).map((card) => html`<li>${this.renderCard(card)}</li>`)}
              </ul>
            </section>`,
          )}
        </div>
      </div>`;
  }
}

customElements.define("proto-kanban-hover", ProtoKanbanHover);
