// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
// Banco di prova del componente <proto-dag-editor>: la pagina fa la parte
// dell'applicazione host e mostra al developer vincoli, eventi e ordine.

import { LitElement, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import "../../src/index.js";
import type { BolleSideSheet } from "../../src/index.js";
import graphIcon from "@tabler/icons/outline/topology-star-3.svg?raw";
import "./dag-editor.js";
import { inputsOf, outputsOf, predecessors, ranks, reach, successors, type DagEdge, type DagNode, type DagOrientation } from "./graph.js";
import { PRESETS, place, type Preset, type PresetId } from "./data.js";
import type { ProtoDagEditor } from "./dag-editor.js";

type Scenario = "normal" | "loading" | "empty" | "error";
type Tab = "rules" | "events" | "order";
interface LogEntry {
  at: string;
  name: string;
  text: string;
  tone: "" | "error";
}

const icon = (raw: string) => html`<span class="icon" aria-hidden="true">${unsafeSVG(raw)}</span>`;
const clock = new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
const CAUSE: Record<string, string> = {
  add: "nodo aggiunto",
  connect: "collegamento creato",
  disconnect: "collegamento eliminato",
  move: "nodi spostati",
  delete: "elementi eliminati",
  duplicate: "nodi duplicati",
  layout: "disposizione automatica",
  undo: "annullamento",
  redo: "ripristino",
};

export class ProtoDagApp extends LitElement {
  static properties = {
    presetId: { state: true },
    orientation: { state: true },
    scenario: { state: true },
    theme: { state: true },
    direction: { state: true },
    nodes: { state: true },
    edges: { state: true },
    tab: { state: true },
    panel: { state: true },
    log: { state: true },
    detail: { state: true },
  };

  declare presetId: PresetId;
  declare orientation: DagOrientation;
  declare scenario: Scenario;
  declare theme: "light" | "dark";
  declare direction: "ltr" | "rtl";
  declare nodes: DagNode[];
  declare edges: DagEdge[];
  declare tab: Tab;
  declare panel: boolean;
  declare log: LogEntry[];
  declare detail: string;

  constructor() {
    super();
    this.presetId = "typed";
    this.orientation = "horizontal";
    this.scenario = "normal";
    this.theme = "light";
    this.direction = "ltr";
    this.tab = "rules";
    this.panel = innerWidth > 1100;
    this.log = [];
    this.detail = "";
    const graph = this.preset.build();
    this.nodes = graph.nodes;
    this.edges = graph.edges;
  }

  createRenderRoot() {
    return this;
  }

  private get preset(): Preset {
    return PRESETS.find((preset) => preset.id === this.presetId)!;
  }

  private get editor() {
    return this.querySelector<ProtoDagEditor>("proto-dag-editor");
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("theme") || changed.has("direction")) {
      document.documentElement.dataset.theme = this.theme;
      document.documentElement.dir = this.direction;
    }
  }

  private async reload() {
    const graph = this.preset.build();
    const placed =
      this.orientation === "horizontal" && this.direction === "ltr"
        ? graph
        : place(graph, this.orientation, this.orientation === "horizontal" && this.direction === "rtl");
    this.editor?.clearHistory();
    this.nodes = placed.nodes;
    this.edges = placed.edges;
    this.detail = "";
  }

  private relayout() {
    const graph = place(
      { nodes: this.nodes, edges: this.edges },
      this.orientation,
      this.orientation === "horizontal" && this.direction === "rtl",
    );
    this.editor?.clearHistory();
    this.nodes = graph.nodes;
  }

  private record(name: string, text: string, tone: LogEntry["tone"] = "") {
    this.log = [{ at: clock.format(new Date()), name, text, tone }, ...this.log].slice(0, 80);
  }

  private onChange = (event: CustomEvent<{ nodes: DagNode[]; edges: DagEdge[]; cause: string }>) => {
    this.nodes = event.detail.nodes;
    this.edges = event.detail.edges;
    this.record("dag-change", `${CAUSE[event.detail.cause] ?? event.detail.cause} · ${event.detail.nodes.length} nodi, ${event.detail.edges.length} collegamenti`);
  };

  private onSelection = (event: CustomEvent<{ nodes: string[]; edges: string[] }>) => {
    const { nodes, edges } = event.detail;
    const names = nodes.slice(0, 3).map((id) => this.nodes.find((node) => node.id === id)?.label ?? id);
    this.record(
      "dag-selection-change",
      !nodes.length && !edges.length
        ? "nessuna selezione"
        : nodes.length
          ? `${names.join(", ")}${nodes.length > 3 ? ` e altri ${nodes.length - 3}` : ""}`
          : `${edges.length} ${edges.length === 1 ? "collegamento" : "collegamenti"}`,
    );
  };

  private onRejected = (event: CustomEvent<{ reason: string }>) => {
    this.record("dag-connection-rejected", event.detail.reason, "error");
  };

  private onActivate = (event: CustomEvent<{ node: DagNode }>) => {
    this.detail = event.detail.node.id;
    this.record("dag-node-activate", event.detail.node.label);
    void this.updateComplete.then(() => this.querySelector<BolleSideSheet>("#node-sheet")?.show());
  };

  private onRetry = () => {
    this.record("dag-retry", "nuovo tentativo di caricamento");
    this.scenario = "loading";
    setTimeout(() => {
      this.scenario = "normal";
      void this.reload();
    }, 1200);
  };

  private rename(id: string, label: string) {
    const value = label.trim();
    if (!value) return;
    this.nodes = this.nodes.map((node) => (node.id === id ? { ...node, label: value } : node));
    this.record("host", `rinominato in «${value}» dall'applicazione`);
  }

  /* Pannello del developer ------------------------------------------------ */

  private renderRules() {
    const preset = this.preset;
    return html`<p class="panel-lead">${preset.summary}.</p>
      <ul class="rules">
        ${preset.rules.map((rule) => html`<li>${rule}</li>`)}
      </ul>
      <h3>Configurazione</h3>
      <pre class="code" dir="ltr"><code>${preset.source}</code></pre>
      <h3>Da provare</h3>
      <ul class="rules">
        ${preset.id === "typed"
          ? html`<li>Trascina «Righe» di «Meteo regionale» su «Dati» di «Previsione domanda»: l'ingresso è già occupato.</li>
              <li>Trascina «Meteo regionale» sul «Data warehouse vendite»: la regola del developer lo rifiuta.</li>
              <li>Trascina «Metriche» di «Valutazione previsione» su un ingresso «tabella»: tipo non compatibile.</li>
              <li>Collega «Fatturato per regione» a «Pulizia ordini»: creerebbe un ciclo.</li>
              <li>Rilascia un collegamento nel vuoto: compaiono solo i tipi di nodo compatibili.</li>
              <li>Prova a eliminare «Ordini 2026» o ad aggiungere un secondo data warehouse.</li>`
          : preset.id === "monitor"
            ? html`<li>Seleziona un nodo e usa «Seleziona a monte» dal menu (Maiusc+F10) per vedere da cosa dipende.</li>
                <li>Doppio clic o Invio su un nodo: l'applicazione apre il proprio dettaglio.</li>`
            : html`<li>Collega «Avviso al team» a «Checkout sorgenti»: è l'unico rifiuto, il ciclo.</li>
                <li>Trascina un tipo di nodo dalla tavolozza, oppure fai doppio clic sul canvas.</li>
                <li>Maiusc + trascina sul fondo per selezionare più nodi, poi Ctrl+D per duplicarli.</li>`}
      </ul>`;
  }

  private renderEvents() {
    if (!this.log.length)
      return html`<p class="panel-lead">Nessun evento ancora. Interagisci con il grafo: qui compaiono gli eventi che l'applicazione riceve.</p>`;
    return html`<div class="log-head">
        <span>${this.log.length} eventi</span>
        <bolle-button variant="text" @click=${() => (this.log = [])}>Svuota</bolle-button>
      </div>
      <ol class="log">
        ${this.log.map(
          (entry) => html`<li data-tone=${entry.tone}>
            <time>${entry.at}</time>
            <code>${entry.name}</code>
            <span>${entry.text}</span>
          </li>`,
        )}
      </ol>`;
  }

  private renderOrder() {
    const graph = { nodes: this.nodes, edges: this.edges };
    const order = this.editor?.topologicalOrder() ?? [];
    const byId = new Map(this.nodes.map((node) => [node.id, node]));
    const rank = ranks(graph);
    const prev = predecessors(graph);
    const next = successors(graph);
    const sources = this.nodes.filter((node) => !prev.get(node.id)?.length).length;
    const sinks = this.nodes.filter((node) => !next.get(node.id)?.length).length;
    const depth = this.nodes.length ? Math.max(...rank.values()) + 1 : 0;
    return html`<dl class="stats">
        <div><dt>Nodi</dt><dd>${this.nodes.length}</dd></div>
        <div><dt>Collegamenti</dt><dd>${this.edges.length}</dd></div>
        <div><dt>Sorgenti</dt><dd>${sources}</dd></div>
        <div><dt>Destinazioni</dt><dd>${sinks}</dd></div>
        <div><dt>Livelli</dt><dd>${depth}</dd></div>
      </dl>
      <h3>Ordine topologico · <code>topologicalOrder()</code></h3>
      <ol class="order">
        ${order.map(
          (id) => html`<li>
            <span class="order-rank">L${(rank.get(id) ?? 0) + 1}</span>
            <span>${byId.get(id)?.label ?? id}</span>
          </li>`,
        )}
      </ol>`;
  }

  private renderDetail() {
    const node = this.nodes.find((item) => item.id === this.detail);
    if (!node) return nothing;
    const graph = { nodes: this.nodes, edges: this.edges };
    const kind = this.preset.kinds.find((item) => item.kind === node.kind);
    const byId = new Map(this.nodes.map((item) => [item.id, item]));
    const up = reach(node.id, predecessors(graph)).size;
    const down = reach(node.id, successors(graph)).size;
    const portRows = (side: "in" | "out") => {
      const ports = side === "in" ? inputsOf(node) : outputsOf(node);
      if (!ports.length) return html`<dd>nessuna</dd>`;
      return html`<dd>
        <ul class="ports">
          ${ports.map((port) => {
            const linked = this.edges
              .filter((edge) => (side === "in" ? edge.target === node.id && edge.targetPort === port.id : edge.source === node.id && edge.sourcePort === port.id))
              .map((edge) => byId.get(side === "in" ? edge.source : edge.target)?.label);
            return html`<li>
              <strong>${port.label ?? (side === "in" ? "Ingresso" : "Uscita")}</strong>
              ${port.type ? html`<span class="type">${port.type}</span>` : nothing}
              ${port.max !== undefined ? html`<span class="type">max ${port.max}</span>` : nothing}
              <span class="linked">${linked.length ? linked.join(", ") : "non collegata"}</span>
            </li>`;
          })}
        </ul>
      </dd>`;
    };
    return html`<bolle-side-sheet id="node-sheet" label="Proprietà del nodo" close-label="Chiudi" @closed=${() => (this.detail = "")}>
      <div class="sheet">
        <p class="sheet-note">Questo pannello appartiene all'applicazione, non al componente: lo apre l'evento <code>dag-node-activate</code>.</p>
        ${this.preset.readonly
          ? html`<h2>${node.label}</h2>`
          : html`<bolle-text-field
              label="Nome"
              .value=${node.label}
              @change=${(event: CustomEvent<{ value: string }>) => this.rename(node.id, event.detail.value)}
            ></bolle-text-field>`}
        <dl class="facts">
          <div><dt>Identificativo</dt><dd><code>${node.id}</code></dd></div>
          <div><dt>Tipo</dt><dd>${kind?.label ?? node.kind ?? "generico"}</dd></div>
          ${node.description ? html`<div><dt>Descrizione</dt><dd>${node.description}</dd></div>` : nothing}
          ${node.badge ? html`<div><dt>Stato</dt><dd>${node.badge.label}</dd></div>` : nothing}
          <div><dt>Ingressi</dt>${portRows("in")}</div>
          <div><dt>Uscite</dt>${portRows("out")}</div>
          <div><dt>A monte</dt><dd>${up} nodi</dd></div>
          <div><dt>A valle</dt><dd>${down} nodi</dd></div>
        </dl>
      </div>
    </bolle-side-sheet>`;
  }

  protected render() {
    const preset = this.preset;
    const loading = this.scenario === "loading";
    const empty = this.scenario === "empty";
    return html`<div class="app" data-panel=${this.panel}>
      <header class="topbar">
        <div class="brand">
          <span class="brand-mark">${icon(graphIcon)}</span>
          <div>
            <h1>Grafo aciclico orientato</h1>
            <p>Prototipo del componente · configurazione ${preset.label.toLowerCase()} · ${this.nodes.length} nodi · ${this.edges.length} collegamenti</p>
          </div>
        </div>
        <div class="controls">
          <bolle-select
            label="Configurazione"
            .value=${this.presetId}
            @change=${(event: CustomEvent<{ value: string }>) => {
              this.presetId = event.detail.value as PresetId;
              this.scenario = "normal";
              this.log = [];
              void this.reload();
            }}
          >
            ${PRESETS.map((item) => html`<option value=${item.id}>${item.label}</option>`)}
          </bolle-select>
          <bolle-select
            label="Orientamento"
            .value=${this.orientation}
            @change=${async (event: CustomEvent<{ value: string }>) => {
              this.orientation = event.detail.value as DagOrientation;
              await this.updateComplete;
              this.relayout();
            }}
          >
            <option value="horizontal">Orizzontale</option>
            <option value="vertical">Verticale</option>
          </bolle-select>
          <bolle-select
            class="harness"
            label="Scenario di prova"
            .value=${this.scenario}
            @change=${(event: CustomEvent<{ value: string }>) => {
              this.scenario = event.detail.value as Scenario;
              if (this.scenario === "normal" && !this.nodes.length) void this.reload();
            }}
          >
            <option value="normal">Dati</option>
            <option value="loading">In caricamento</option>
            <option value="empty">Grafo vuoto</option>
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
            @change=${async (event: CustomEvent<{ value: string }>) => {
              this.direction = event.detail.value as "ltr" | "rtl";
              await this.updateComplete;
              this.relayout();
            }}
          >
            <option value="ltr">Da sinistra</option>
            <option value="rtl">Da destra</option>
          </bolle-select>
          <bolle-switch
            label="Pannello developer"
            .checked=${this.panel}
            @change=${(event: CustomEvent<{ checked: boolean }>) => (this.panel = event.detail.checked)}
          ></bolle-switch>
        </div>
      </header>

      <main class="main">
        <proto-dag-editor
          label=${preset.id === "typed" ? "Flusso dati vendite" : preset.id === "large" ? "Flusso batch notturno" : preset.id === "monitor" ? "Esecuzione n. 1842" : "Pipeline di rilascio"}
          .nodes=${empty ? [] : this.nodes}
          .edges=${empty ? [] : this.edges}
          .kinds=${preset.kinds}
          .constraints=${preset.constraints}
          .orientation=${this.orientation}
          ?readonly=${preset.readonly}
          ?loading=${loading}
          .error=${this.scenario === "error" ? "Il servizio ha risposto 503 dopo 3 tentativi. Le modifiche locali non sono andate perse." : ""}
          @dag-change=${this.onChange}
          @dag-selection-change=${this.onSelection}
          @dag-connection-rejected=${this.onRejected}
          @dag-node-activate=${this.onActivate}
          @dag-retry=${this.onRetry}
        ></proto-dag-editor>
        ${this.panel
          ? html`<aside class="panel" aria-label="Pannello del developer">
              <bolle-segmented-buttons
                label="Contenuto del pannello"
                .value=${this.tab}
                .items=${[
                  { id: "rules", label: "Vincoli" },
                  { id: "events", label: `Eventi${this.log.length ? ` (${this.log.length})` : ""}` },
                  { id: "order", label: "Ordine" },
                ]}
                @change=${(event: CustomEvent<{ value: string }>) => (this.tab = event.detail.value as Tab)}
              ></bolle-segmented-buttons>
              <div class="panel-body">
                ${this.tab === "rules" ? this.renderRules() : this.tab === "events" ? this.renderEvents() : this.renderOrder()}
              </div>
            </aside>`
          : nothing}
      </main>
      ${this.renderDetail()}
    </div>`;
  }
}

customElements.define("proto-dag-app", ProtoDagApp);
