import { LitElement, html, nothing } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import "../src/index.js";
import type {
  BolleDag,
  DagChangeDetail,
  DagConstraints,
  DagEdge,
  DagGraph,
  DagNode,
  DagNodeDetail,
  DagNodeKind,
  DagOrientation,
  DagPort,
} from "../src/index.js";
import terminal from "@tabler/icons/outline/terminal-2.svg?raw";
import testPipe from "@tabler/icons/outline/test-pipe.svg?raw";
import pkg from "@tabler/icons/outline/package.svg?raw";
import rocket from "@tabler/icons/outline/rocket.svg?raw";
import userCheck from "@tabler/icons/outline/user-check.svg?raw";
import bell from "@tabler/icons/outline/bell.svg?raw";
import shield from "@tabler/icons/outline/shield-check.svg?raw";
import branch from "@tabler/icons/outline/git-branch.svg?raw";
import database from "@tabler/icons/outline/database.svg?raw";
import csv from "@tabler/icons/outline/file-type-csv.svg?raw";
import api from "@tabler/icons/outline/api.svg?raw";
import wash from "@tabler/icons/outline/wash.svg?raw";
import join from "@tabler/icons/outline/arrows-join.svg?raw";
import filter from "@tabler/icons/outline/filter.svg?raw";
import sum from "@tabler/icons/outline/sum.svg?raw";
import brain from "@tabler/icons/outline/brain.svg?raw";
import chartDots from "@tabler/icons/outline/chart-dots.svg?raw";
import warehouse from "@tabler/icons/outline/building-warehouse.svg?raw";
import fileExport from "@tabler/icons/outline/file-export.svg?raw";
import chartBar from "@tabler/icons/outline/chart-bar.svg?raw";
import dbImport from "@tabler/icons/outline/database-import.svg?raw";
import { l, m } from "./i18n.js";

export type DagDemoConfig = "free" | "typed";

const icon = (raw: string) => html`${unsafeSVG(raw)}`;

const edge = (source: string, target: string, sourcePort = "out", targetPort = "in"): DagEdge => ({
  id: `e-${source}-${sourcePort}-${target}-${targetPort}`,
  source,
  sourcePort,
  target,
  targetPort,
});

/** Columns by longest path from the sources, rows stacked inside each column. */
function place(graph: DagGraph, vertical: boolean, height: number): DagGraph {
  const rank = new Map<string, number>();
  const visit = (id: string): number => {
    if (rank.has(id)) return rank.get(id)!;
    const from = graph.edges.filter((item) => item.target === id).map((item) => item.source);
    const value = from.length ? Math.max(...from.map(visit)) + 1 : 0;
    rank.set(id, value);
    return value;
  };
  graph.nodes.forEach((node) => visit(node.id));
  const columns: string[][] = [];
  for (const node of graph.nodes) (columns[rank.get(node.id)!] ??= []).push(node.id);
  const at = new Map<string, { x: number; y: number }>();
  columns.forEach((ids, column) =>
    ids.forEach((id, row) => {
      const across = (row - (ids.length - 1) / 2) * (vertical ? 260 : height);
      const along = column * (vertical ? height + 72 : 328);
      at.set(id, vertical ? { x: across, y: along } : { x: along, y: across });
    }),
  );
  return { nodes: graph.nodes.map((node) => ({ ...node, ...at.get(node.id)! })), edges: graph.edges };
}

const releaseKinds = (): DagNodeKind[] => [
  { kind: "source", label: l(m("Sorgenti")), description: l(m("Checkout di un repository")), icon: icon(branch), group: l(m("Esecuzione")) },
  { kind: "script", label: l(m("Script")), description: l(m("Comando di shell")), icon: icon(terminal), group: l(m("Esecuzione")) },
  { kind: "test", label: l(m("Test")), description: l(m("Suite di test automatici")), icon: icon(testPipe), group: l(m("Esecuzione")) },
  { kind: "build", label: l(m("Build")), description: l(m("Compilazione e pacchetto")), icon: icon(pkg), group: l(m("Esecuzione")) },
  { kind: "scan", label: l(m("Controllo sicurezza")), description: l(m("Scansione delle dipendenze")), icon: icon(shield), group: l(m("Esecuzione")) },
  { kind: "deploy", label: l(m("Rilascio")), description: l(m("Pubblicazione in un ambiente")), icon: icon(rocket), group: l(m("Rilascio")) },
  { kind: "approval", label: l(m("Approvazione")), description: l(m("Attende una persona")), icon: icon(userCheck), group: l(m("Rilascio")) },
  { kind: "notify", label: l(m("Avviso")), description: l(m("Messaggio a un canale")), icon: icon(bell), group: l(m("Avvisi")) },
];

function releaseGraph(kinds: DagNodeKind[]): DagGraph {
  const n = (id: string, kind: string, label: string, description: string): DagNode => ({
    id,
    kind,
    label,
    description,
    icon: kinds.find((item) => item.kind === kind)?.icon,
    x: 0,
    y: 0,
  });
  return {
    nodes: [
      n("checkout", "source", l(m("Checkout sorgenti")), "git · main"),
      n("deps", "script", l(m("Installa dipendenze")), "npm ci"),
      n("lint", "test", l(m("Analisi statica")), "ESLint · tsc"),
      n("unit", "test", l(m("Test unitari")), "1.284 · Vitest"),
      n("fe", "build", l(m("Build frontend")), "Vite · 412 kB"),
      n("be", "build", l(m("Build backend")), ".NET 9 · Release"),
      n("image", "build", l(m("Immagine container")), "app:2.14.0"),
      n("scan", "scan", l(m("Scansione vulnerabilità")), "Trivy"),
      n("migrate", "script", l(m("Migrazione database")), l(m("14 script in coda"))),
      n("staging", "deploy", l(m("Rilascio in collaudo")), l(m("3 repliche"))),
      n("e2e", "test", l(m("Test end-to-end")), "Playwright · 96"),
      n("approve", "approval", l(m("Approvazione rilascio")), l(m("responsabile di prodotto"))),
      n("prod", "deploy", l(m("Rilascio in produzione")), "10% → 100%"),
      n("notify", "notify", l(m("Avviso al team")), "#rilasci"),
    ],
    edges: [
      edge("checkout", "deps"),
      edge("deps", "lint"),
      edge("deps", "unit"),
      edge("deps", "fe"),
      edge("deps", "be"),
      edge("fe", "image"),
      edge("be", "image"),
      edge("be", "migrate"),
      edge("image", "scan"),
      edge("lint", "staging"),
      edge("unit", "staging"),
      edge("scan", "staging"),
      edge("migrate", "staging"),
      edge("staging", "e2e"),
      edge("e2e", "approve"),
      edge("approve", "prod"),
      edge("prod", "notify"),
    ],
  };
}

const port = (id: string, label: string, type: string, max?: number): DagPort => ({ id, label, type, max });

const dataKinds = (): DagNodeKind[] => {
  const rows = l(m("Righe"));
  const table = l(m("tabella"));
  return [
    { kind: "db", group: l(m("Sorgenti")), label: l(m("Database")), description: l(m("Tabella di un database relazionale")), icon: icon(database), inputs: [], outputs: [port("rows", rows, table)] },
    { kind: "csv", group: l(m("Sorgenti")), label: l(m("File CSV")), description: l(m("File caricato o su archivio")), icon: icon(csv), inputs: [], outputs: [port("file", l(m("File")), "file")] },
    { kind: "api", group: l(m("Sorgenti")), label: l(m("API REST")), description: l(m("Risposta JSON resa tabellare")), icon: icon(api), inputs: [], outputs: [port("rows", rows, table)] },
    { kind: "read", group: l(m("Trasformazioni")), label: l(m("Lettura CSV")), description: l(m("Da file a tabella")), icon: icon(dbImport), inputs: [port("file", l(m("File")), "file", 1)], outputs: [port("rows", rows, table)] },
    { kind: "clean", group: l(m("Trasformazioni")), label: l(m("Pulizia")), description: l(m("Duplicati, valori mancanti, formati")), icon: icon(wash), inputs: [port("rows", rows, table, 1)], outputs: [port("rows", l(m("Righe pulite")), table)] },
    { kind: "join", group: l(m("Trasformazioni")), label: l(m("Unione")), description: l(m("Join su una chiave comune")), icon: icon(join), inputs: [port("left", l(m("Sinistra")), table, 1), port("right", l(m("Destra")), table, 1)], outputs: [port("rows", rows, table)] },
    { kind: "filter", group: l(m("Trasformazioni")), label: l(m("Filtro")), description: l(m("Condizione sulle righe")), icon: icon(filter), inputs: [port("rows", rows, table, 1)], outputs: [port("kept", l(m("Accettate")), table), port("dropped", l(m("Scartate")), table)] },
    { kind: "agg", group: l(m("Trasformazioni")), label: l(m("Aggregazione")), description: l(m("Somme e medie per gruppo")), icon: icon(sum), inputs: [port("rows", rows, table, 1)], outputs: [port("rows", rows, table)] },
    { kind: "train", group: l(m("Analisi")), label: l(m("Addestramento")), description: l(m("Modello di regressione")), icon: icon(brain), inputs: [port("rows", l(m("Dati")), table, 1)], outputs: [port("model", l(m("Modello")), l(m("modello")))] },
    { kind: "eval", group: l(m("Analisi")), label: l(m("Valutazione")), description: l(m("Confronto su dati di test")), icon: icon(chartDots), inputs: [port("model", l(m("Modello")), l(m("modello")), 1), port("test", l(m("Dati di test")), table, 1)], outputs: [port("metrics", l(m("Metriche")), l(m("metriche")))] },
    { kind: "dwh", group: l(m("Destinazioni")), label: l(m("Data warehouse")), description: l(m("Tabella storicizzata")), icon: icon(warehouse), inputs: [port("rows", rows, table)], outputs: [] },
    { kind: "dash", group: l(m("Destinazioni")), label: l(m("Cruscotto")), description: l(m("Grafici e indicatori")), icon: icon(chartBar), inputs: [port("metrics", l(m("Metriche")), l(m("metriche"))), port("rows", rows, table)], outputs: [] },
    { kind: "export", group: l(m("Destinazioni")), label: l(m("Esportazione")), description: l(m("CSV o Parquet su archivio")), icon: icon(fileExport), inputs: [port("rows", rows, table, 1)], outputs: [] },
  ];
};

function dataGraph(kinds: DagNodeKind[]): DagGraph {
  const n = (id: string, kind: string, label: string, description: string, data?: Record<string, unknown>): DagNode => {
    const k = kinds.find((item) => item.kind === kind)!;
    return {
      id,
      kind,
      label,
      description,
      icon: k.icon,
      inputs: k.inputs?.map((p) => ({ ...p })),
      outputs: k.outputs?.map((p) => ({ ...p })),
      data,
      x: 0,
      y: 0,
    };
  };
  return {
    nodes: [
      n("orders", "db", l(m("Ordini 2026")), "erp.vendite.ordini", { managed: true, rows: "1.240.512" }),
      n("prices", "csv", l(m("Listino prezzi")), "listino_2026_q4.csv", { rows: "18.430" }),
      n("weather", "api", l(m("Meteo regionale")), "api.meteo", { rows: "7.300" }),
      n("clean", "clean", l(m("Pulizia ordini")), l(m("rimuove 1,8% di duplicati")), { rows: "1.218.183" }),
      n("read", "read", l(m("Lettura listino")), "UTF-8 · ;"),
      n("join", "join", l(m("Ordini con prezzi")), l(m("chiave: codice articolo"))),
      n("italy", "filter", l(m("Solo Italia")), "paese = IT"),
      n("revenue", "agg", l(m("Fatturato per regione")), l(m("somma per regione e mese")), { rows: "240" }),
      n("dwh", "dwh", l(m("Data warehouse vendite")), "dwh.fatti_vendite"),
      n("dropped", "export", l(m("Righe scartate")), "archivio/scarti/"),
      n("forecast", "train", l(m("Previsione domanda")), l(m("regressione · 12 variabili"))),
      n("check", "eval", l(m("Valutazione previsione")), l(m("ultimi 90 giorni"))),
      n("board", "dash", l(m("Cruscotto commerciale")), l(m("aggiornato ogni notte"))),
    ],
    edges: [
      edge("orders", "clean", "rows", "rows"),
      edge("clean", "join", "rows", "left"),
      edge("prices", "read", "file", "file"),
      edge("read", "join", "rows", "right"),
      edge("join", "italy", "rows", "rows"),
      edge("italy", "revenue", "kept", "rows"),
      edge("revenue", "dwh", "rows", "rows"),
      edge("italy", "dropped", "dropped", "rows"),
      edge("revenue", "forecast", "rows", "rows"),
      edge("forecast", "check", "model", "model"),
      edge("italy", "check", "kept", "test"),
      edge("check", "board", "metrics", "metrics"),
    ],
  };
}

const passedCleaning = (node: DagNode, graph: DagGraph) => {
  const seen = new Set<string>();
  const stack = [node.id];
  while (stack.length) {
    const id = stack.pop()!;
    if (graph.nodes.find((item) => item.id === id)?.kind === "clean") return true;
    for (const item of graph.edges)
      if (item.target === id && !seen.has(item.source)) {
        seen.add(item.source);
        stack.push(item.source);
      }
  }
  return false;
};

const dataConstraints = (): DagConstraints => ({
  maxNodes: 40,
  canConnect: ({ source, target, graph }) =>
    target.kind === "dwh" && !passedCleaning(source, graph)
      ? l(m("Il data warehouse accetta solo righe passate da «Pulizia»"))
      : true,
  canAdd: (kind, graph) =>
    kind.kind === "dwh" && graph.nodes.some((node) => node.kind === "dwh")
      ? l(m("Il flusso ha già un data warehouse"))
      : true,
  canDelete: (node) =>
    node.data?.managed ? l(m("Sorgente gestita dall'amministratore dei dati")) : true,
});

/** Documentation preview: the application side of `bolle-dag`, with its own detail sheet. */
export class BolleDagDemo extends LitElement {
  static properties = {
    config: {},
    orientation: {},
    readonly: { type: Boolean },
    minimap: { type: Boolean },
    label: {},
    graph: { state: true },
    opened: { state: true },
  };

  declare config: DagDemoConfig;
  declare orientation: DagOrientation;
  declare readonly: boolean;
  declare minimap: boolean;
  declare label: string;
  declare graph: DagGraph;
  declare opened: string;

  private kinds: DagNodeKind[] = [];
  private constraints: DagConstraints = {};

  constructor() {
    super();
    this.config = "typed";
    this.orientation = "horizontal";
    this.readonly = false;
    this.minimap = true;
    this.label = "";
    this.graph = { nodes: [], edges: [] };
    this.opened = "";
  }

  protected willUpdate(changed: Map<string, unknown>) {
    if (changed.has("config") || changed.has("orientation")) {
      const typed = this.config === "typed";
      this.kinds = typed ? dataKinds() : releaseKinds();
      this.constraints = typed ? dataConstraints() : {};
      const graph = typed ? dataGraph(this.kinds) : releaseGraph(this.kinds);
      this.graph = place(graph, this.orientation === "vertical", typed ? 170 : 96);
      this.opened = "";
      this.renderRoot?.querySelector<BolleDag>("bolle-dag")?.clearHistory();
    }
  }

  private onChange = (event: CustomEvent<DagChangeDetail>) => {
    this.graph = { nodes: event.detail.nodes, edges: event.detail.edges };
  };

  private onActivate = (event: CustomEvent<DagNodeDetail>) => {
    this.opened = event.detail.node.id;
  };

  protected updated() {
    const sheet = this.renderRoot.querySelector<
      HTMLElement & { show(): Promise<void>; open: boolean }
    >("bolle-side-sheet");
    if (sheet && this.opened && !sheet.open) void sheet.show();
  }

  private renderDetail() {
    const node = this.graph.nodes.find((item) => item.id === this.opened);
    if (!node) return nothing;
    const byId = new Map(this.graph.nodes.map((item) => [item.id, item]));
    const incoming = this.graph.edges.filter((item) => item.target === node.id);
    const outgoing = this.graph.edges.filter((item) => item.source === node.id);
    const names = (ids: string[]) =>
      ids.length ? ids.map((id) => byId.get(id)?.label ?? id).join(", ") : l(m("nessuno"));
    return html`<bolle-side-sheet
      label=${node.label}
      close-label=${l(m("Chiudi il dettaglio"))}
      @closed=${() => (this.opened = "")}
    >
      <dl class="ddetail">
        <div>
          <dt>${l(m("Tipo"))}</dt>
          <dd>${this.kinds.find((item) => item.kind === node.kind)?.label ?? "—"}</dd>
        </div>
        <div>
          <dt>${l(m("Descrizione"))}</dt>
          <dd>${node.description ?? "—"}</dd>
        </div>
        <div>
          <dt>${l(m("Riceve da"))}</dt>
          <dd>${names(incoming.map((item) => item.source))}</dd>
        </div>
        <div>
          <dt>${l(m("Invia a"))}</dt>
          <dd>${names(outgoing.map((item) => item.target))}</dd>
        </div>
      </dl>
    </bolle-side-sheet>`;
  }

  protected render() {
    return html`<style>
        bolle-dag {
          min-block-size: 0;
        }
        .ddetail {
          display: grid;
          gap: 12px;
          margin: 0;
        }
        .ddetail dt {
          font: var(--md-sys-typescale-label-medium-font);
          color: var(--md-sys-color-on-surface-variant);
        }
        .ddetail dd {
          margin: 2px 0 0;
        }
      </style>
      <bolle-dag
        .label=${this.label}
        .nodes=${this.graph.nodes}
        .edges=${this.graph.edges}
        .kinds=${this.kinds}
        .constraints=${this.constraints}
        .orientation=${this.orientation}
        .minimap=${this.minimap}
        ?readonly=${this.readonly}
        @dag-change=${this.onChange}
        @dag-node-activate=${this.onActivate}
      >
        ${this.graph.nodes
          .filter((node) => node.data?.rows)
          .map(
            (node) =>
              html`<span slot=${`node-${node.id}`}
                >${l(m("{rows} righe"), { rows: String(node.data!.rows) })}</span
              >`,
          )}
      </bolle-dag>
      ${this.renderDetail()}`;
  }
}

if (!customElements.get("demo-dag")) customElements.define("demo-dag", BolleDagDemo);
