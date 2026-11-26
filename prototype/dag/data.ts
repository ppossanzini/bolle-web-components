// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
// Dati finti per il banco di prova. Il componente non conosce questi casi
// d'uso: ognuno è solo una configurazione diversa dello stesso editor.

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
import code from "@tabler/icons/outline/code.svg?raw";
import {
  layeredLayout,
  nodeSize,
  predecessors,
  reach,
  type DagConstraints,
  type DagEdge,
  type DagGraph,
  type DagNode,
  type DagNodeKind,
  type DagOrientation,
  type DagPort,
} from "./graph.js";

export type PresetId = "free" | "typed" | "monitor" | "large";

export interface Preset {
  id: PresetId;
  label: string;
  summary: string;
  kinds: DagNodeKind[];
  constraints: DagConstraints;
  readonly: boolean;
  /** Regole in linguaggio naturale, per il pannello del developer. */
  rules: string[];
  /** Configurazione come la scriverebbe il developer. */
  source: string;
  build: () => DagGraph;
}

export function place(graph: DagGraph, orientation: DagOrientation, reverse = false): DagGraph {
  const positions = layeredLayout(graph, (node) => nodeSize(node, orientation), { orientation, reverse });
  return { nodes: graph.nodes.map((node) => ({ ...node, ...positions.get(node.id)! })), edges: graph.edges };
}

const edge = (source: string, target: string, sourcePort = "out", targetPort = "in"): DagEdge => ({
  id: `e-${source}-${sourcePort}-${target}-${targetPort}`,
  source,
  sourcePort,
  target,
  targetPort,
});

/* Configurazione libera ---------------------------------------------------- */

const releaseKinds: DagNodeKind[] = [
  { kind: "source", label: "Sorgenti", description: "Checkout di un repository", icon: branch, group: "Esecuzione" },
  { kind: "script", label: "Script", description: "Comando di shell", icon: terminal, group: "Esecuzione" },
  { kind: "test", label: "Test", description: "Suite di test automatici", icon: testPipe, group: "Esecuzione" },
  { kind: "build", label: "Build", description: "Compilazione e pacchetto", icon: pkg, group: "Esecuzione" },
  { kind: "scan", label: "Controllo sicurezza", description: "Scansione delle dipendenze", icon: shield, group: "Esecuzione" },
  { kind: "deploy", label: "Rilascio", description: "Pubblicazione in un ambiente", icon: rocket, group: "Rilascio" },
  { kind: "approval", label: "Approvazione", description: "Attende una persona", icon: userCheck, group: "Rilascio" },
  { kind: "notify", label: "Avviso", description: "Messaggio a un canale", icon: bell, group: "Avvisi" },
];

const kindIcon = (kinds: DagNodeKind[], kind: string) => kinds.find((item) => item.kind === kind)?.icon;

function releaseGraph(): DagGraph {
  const n = (id: string, kind: string, label: string, description: string): DagNode => ({
    id,
    kind,
    label,
    description,
    icon: kindIcon(releaseKinds, kind),
    x: 0,
    y: 0,
  });
  const nodes = [
    n("checkout", "source", "Checkout sorgenti", "git · ramo main"),
    n("deps", "script", "Installa dipendenze", "npm ci · cache attiva"),
    n("lint", "test", "Analisi statica", "ESLint e controllo dei tipi"),
    n("unit", "test", "Test unitari", "1.284 test · Vitest"),
    n("fe", "build", "Build frontend", "Vite · bundle 412 kB"),
    n("be", "build", "Build backend", ".NET 9 · configurazione Release"),
    n("image", "build", "Immagine container", "registry.interno/app:2.14.0"),
    n("scan", "scan", "Scansione vulnerabilità", "Trivy · blocca da gravità alta"),
    n("migrate", "script", "Migrazione database", "14 script in coda"),
    n("staging", "deploy", "Rilascio in collaudo", "cluster collaudo · 3 repliche"),
    n("e2e", "test", "Test end-to-end", "Playwright · 96 scenari"),
    n("approve", "approval", "Approvazione rilascio", "responsabile di prodotto"),
    n("prod", "deploy", "Rilascio in produzione", "graduale dal 10% al 100%"),
    n("notify", "notify", "Avviso al team", "canale #rilasci"),
  ];
  const edges = [
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
  ];
  return { nodes, edges };
}

/* Configurazione vincolata ------------------------------------------------- */

const p = (id: string, label: string, type: string, max?: number): DagPort => ({ id, label, type, max });

const dataKinds: DagNodeKind[] = [
  { kind: "db", group: "Sorgenti", label: "Database", description: "Tabella di un database relazionale", icon: database, inputs: [], outputs: [p("rows", "Righe", "tabella")] },
  { kind: "csv", group: "Sorgenti", label: "File CSV", description: "File caricato o su archivio", icon: csv, inputs: [], outputs: [p("file", "File", "file")] },
  { kind: "api", group: "Sorgenti", label: "API REST", description: "Risposta JSON resa tabellare", icon: api, inputs: [], outputs: [p("rows", "Righe", "tabella")] },
  { kind: "read", group: "Trasformazioni", label: "Lettura CSV", description: "Da file a tabella", icon: dbImport, inputs: [p("file", "File", "file", 1)], outputs: [p("rows", "Righe", "tabella")] },
  { kind: "clean", group: "Trasformazioni", label: "Pulizia", description: "Duplicati, valori mancanti, formati", icon: wash, inputs: [p("rows", "Righe", "tabella", 1)], outputs: [p("rows", "Righe pulite", "tabella")] },
  { kind: "join", group: "Trasformazioni", label: "Unione", description: "Join su una chiave comune", icon: join, inputs: [p("left", "Sinistra", "tabella", 1), p("right", "Destra", "tabella", 1)], outputs: [p("rows", "Righe", "tabella")] },
  { kind: "filter", group: "Trasformazioni", label: "Filtro", description: "Condizione sulle righe", icon: filter, inputs: [p("rows", "Righe", "tabella", 1)], outputs: [p("kept", "Accettate", "tabella"), p("dropped", "Scartate", "tabella")] },
  { kind: "agg", group: "Trasformazioni", label: "Aggregazione", description: "Somme e medie per gruppo", icon: sum, inputs: [p("rows", "Righe", "tabella", 1)], outputs: [p("rows", "Righe", "tabella")] },
  { kind: "train", group: "Analisi", label: "Addestramento", description: "Modello di regressione", icon: brain, inputs: [p("rows", "Dati", "tabella", 1)], outputs: [p("model", "Modello", "modello")] },
  { kind: "eval", group: "Analisi", label: "Valutazione", description: "Confronto su dati di test", icon: chartDots, inputs: [p("model", "Modello", "modello", 1), p("test", "Dati di test", "tabella", 1)], outputs: [p("metrics", "Metriche", "metriche")] },
  { kind: "dwh", group: "Destinazioni", label: "Data warehouse", description: "Tabella storicizzata", icon: warehouse, inputs: [p("rows", "Righe", "tabella")], outputs: [] },
  { kind: "dash", group: "Destinazioni", label: "Cruscotto", description: "Grafici e indicatori", icon: chartBar, inputs: [p("metrics", "Metriche", "metriche"), p("rows", "Righe", "tabella")], outputs: [] },
  { kind: "export", group: "Destinazioni", label: "Esportazione", description: "CSV o Parquet su archivio", icon: fileExport, inputs: [p("rows", "Righe", "tabella", 1)], outputs: [] },
];

function dataGraph(): DagGraph {
  const n = (id: string, kind: string, label: string, description: string, data?: Record<string, unknown>): DagNode => {
    const k = dataKinds.find((item) => item.kind === kind)!;
    return {
      id,
      kind,
      label,
      description,
      icon: k.icon,
      inputs: k.inputs?.map((port) => ({ ...port })),
      outputs: k.outputs?.map((port) => ({ ...port })),
      data,
      x: 0,
      y: 0,
    };
  };
  const nodes = [
    n("orders", "db", "Ordini 2026", "erp.vendite.ordini", { managed: true }),
    n("prices", "csv", "Listino prezzi", "listino_2026_q4.csv"),
    n("weather", "api", "Meteo regionale", "api.meteo · dati giornalieri"),
    n("clean", "clean", "Pulizia ordini", "rimuove 1,8% di duplicati"),
    n("read", "read", "Lettura listino", "separatore ; · UTF-8"),
    n("join", "join", "Ordini con prezzi", "chiave: codice articolo"),
    n("italy", "filter", "Solo Italia", "paese = IT"),
    n("revenue", "agg", "Fatturato per regione", "somma per regione e mese"),
    n("dwh", "dwh", "Data warehouse vendite", "dwh.fatti_vendite"),
    n("dropped", "export", "Righe scartate", "archivio/scarti/2026/"),
    n("forecast", "train", "Previsione domanda", "regressione · 12 variabili"),
    n("check", "eval", "Valutazione previsione", "ultimi 90 giorni"),
    n("board", "dash", "Cruscotto commerciale", "aggiornato ogni notte"),
  ];
  const edges = [
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
  ];
  return { nodes, edges };
}

const passedCleaning = (node: DagNode, graph: DagGraph) => {
  if (node.kind === "clean") return true;
  const byId = new Map(graph.nodes.map((item) => [item.id, item]));
  return [...reach(node.id, predecessors(graph))].some((id) => byId.get(id)?.kind === "clean");
};

const dataConstraints: DagConstraints = {
  maxNodes: 40,
  typeCompatible: (outType, inType) => outType === inType,
  canConnect: ({ source, target, graph }) =>
    target.kind === "dwh" && !passedCleaning(source, graph)
      ? "Il data warehouse accetta solo righe passate da «Pulizia»"
      : true,
  canAdd: (kind, graph) =>
    kind.kind === "dwh" && graph.nodes.some((node) => node.kind === "dwh") ? "Il flusso ha già un data warehouse" : true,
  canDelete: (node) => (node.data?.managed ? "Sorgente gestita dall'amministratore dei dati" : true),
};

/* Grafo grande ------------------------------------------------------------- */

function largeGraph(): DagGraph {
  let seed = 20261126;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const verbs = ["Importa", "Valida", "Calcola", "Aggrega", "Riconcilia", "Normalizza", "Arricchisci", "Indicizza", "Pubblica", "Archivia"];
  const objects = ["ordini", "fatture", "clienti", "giacenze", "listini", "spedizioni", "resi", "pagamenti", "contratti", "ticket"];
  const areas = ["Nord", "Centro", "Sud", "Isole", "Estero"];
  const layers: string[][] = [];
  const nodes: DagNode[] = [];
  const edges: DagEdge[] = [];
  let count = 0;
  for (let layer = 0; layer < 12; layer++) {
    const width = layer === 0 ? 8 : 14 + Math.floor(rand() * 10);
    layers.push([]);
    for (let i = 0; i < width; i++) {
      const id = `job-${String(++count).padStart(3, "0")}`;
      const verb = verbs[(layer + Math.floor(rand() * 3)) % verbs.length];
      nodes.push({
        id,
        kind: "script",
        icon: code,
        label: `${verb} ${objects[Math.floor(rand() * objects.length)]} · ${areas[Math.floor(rand() * areas.length)]}`,
        description: `${id} · ${(rand() * 9 + 0.4).toFixed(1).replace(".", ",")} mln righe`,
        x: 0,
        y: 0,
      });
      layers[layer].push(id);
      if (!layer) continue;
      const links = 1 + Math.floor(rand() * 2.4);
      const used = new Set<string>();
      for (let l = 0; l < links; l++) {
        const from = layer > 1 && rand() < 0.25 ? layers[layer - 2] : layers[layer - 1];
        const source = from[Math.floor(rand() * from.length)];
        if (used.has(source)) continue;
        used.add(source);
        edges.push(edge(source, id));
      }
    }
  }
  return { nodes, edges };
}

/* Elenco ------------------------------------------------------------------- */

export const PRESETS: Preset[] = [
  {
    id: "free",
    label: "Libera",
    summary: "Nessun vincolo: porte generiche, qualsiasi collegamento che non crei un ciclo",
    kinds: releaseKinds,
    constraints: {},
    readonly: false,
    rules: [
      "Regole strutturali del DAG, sempre attive: niente cicli, niente anelli su se stesso, niente collegamenti doppi.",
      "Nessun vincolo del developer.",
      "Ogni nodo ha una porta d'ingresso e una d'uscita generiche, perché i tipi di nodo non dichiarano porte.",
    ],
    source: `<proto-dag-editor
  label="Pipeline di rilascio"
  .nodes=\${nodes}
  .edges=\${edges}
  .kinds=\${kinds}
></proto-dag-editor>`,
    build: () => place(releaseGraph(), "horizontal"),
  },
  {
    id: "typed",
    label: "Vincolata",
    summary: "Porte tipizzate, limiti per porta e regole programmatiche del developer",
    kinds: dataKinds,
    constraints: dataConstraints,
    readonly: false,
    rules: [
      "Regole strutturali del DAG, sempre attive.",
      "Tipi di porta: «tabella», «file», «modello», «metriche». Un'uscita entra solo in un ingresso dello stesso tipo.",
      "Porte con limite: molti ingressi accettano un solo collegamento (max: 1).",
      "Sorgenti senza ingressi e destinazioni senza uscite (inputs: [] e outputs: []).",
      "canConnect: il data warehouse accetta solo righe passate da «Pulizia», anche più a monte.",
      "canAdd: un solo data warehouse per flusso.",
      "canDelete: «Ordini 2026» è gestito dall'amministratore e non si elimina.",
      "maxNodes: 40.",
    ],
    source: `editor.constraints = {
  maxNodes: 40,
  typeCompatible: (out, input) => out === input,
  canConnect: ({ source, target, graph }) =>
    target.kind === "dwh" && !passedCleaning(source, graph)
      ? "Il data warehouse accetta solo righe passate da «Pulizia»"
      : true,
  canAdd: (kind, graph) =>
    kind.kind === "dwh" && graph.nodes.some((n) => n.kind === "dwh")
      ? "Il flusso ha già un data warehouse"
      : true,
  canDelete: (node) =>
    node.data?.managed ? "Sorgente gestita dall'amministratore dei dati" : true,
};

// Porte dichiarate dal tipo di nodo
{ kind: "join", label: "Unione",
  inputs: [
    { id: "left",  label: "Sinistra", type: "tabella", max: 1 },
    { id: "right", label: "Destra",   type: "tabella", max: 1 },
  ],
  outputs: [{ id: "rows", label: "Righe", type: "tabella" }] }`,
    build: () => place(dataGraph(), "horizontal"),
  },
  {
    id: "monitor",
    label: "Sola lettura",
    summary: "Stessa pipeline, in osservazione: stato per nodo, nessuna modifica",
    kinds: releaseKinds,
    constraints: {},
    readonly: true,
    rules: [
      "readonly: nessuna modifica; restano selezione, zoom, spostamento della vista e navigazione da tastiera.",
      "badge per nodo: etichetta e tono scelti dal developer (neutral, primary, success, warning, error).",
    ],
    source: `<proto-dag-editor
  readonly
  label="Esecuzione n. 1842"
  .nodes=\${nodes.map((n) => ({ ...n, badge: statusOf(n) }))}
  .edges=\${edges}
></proto-dag-editor>`,
    build: () => {
      const graph = place(releaseGraph(), "horizontal");
      const status: Record<string, { label: string; tone: "neutral" | "primary" | "success" | "warning" | "error" }> = {
        checkout: { label: "4 s", tone: "success" },
        deps: { label: "38 s", tone: "success" },
        lint: { label: "3 avvisi", tone: "warning" },
        unit: { label: "2 min 40 s", tone: "success" },
        fe: { label: "54 s", tone: "success" },
        be: { label: "1 min 31 s", tone: "success" },
        image: { label: "47 s", tone: "success" },
        scan: { label: "In corso", tone: "primary" },
        migrate: { label: "Errore", tone: "error" },
        staging: { label: "Bloccato", tone: "neutral" },
        e2e: { label: "In attesa", tone: "neutral" },
        approve: { label: "In attesa", tone: "neutral" },
        prod: { label: "In attesa", tone: "neutral" },
        notify: { label: "In attesa", tone: "neutral" },
      };
      return { nodes: graph.nodes.map((node) => ({ ...node, badge: status[node.id] })), edges: graph.edges };
    },
  },
  {
    id: "large",
    label: "Grafo grande",
    summary: "Circa 200 nodi su 12 livelli, configurazione libera",
    kinds: [{ kind: "script", label: "Elaborazione", description: "Passo di un flusso batch", icon: code }],
    constraints: {},
    readonly: false,
    rules: [
      "Regole strutturali del DAG, sempre attive.",
      "Nessun vincolo del developer. Serve a verificare lettura, mappa e prestazioni su un volume alto.",
    ],
    source: `<proto-dag-editor
  label="Flusso batch notturno"
  .nodes=\${nodes}
  .edges=\${edges}
  .kinds=\${kinds}
></proto-dag-editor>`,
    build: () => place(largeGraph(), "horizontal"),
  },
];
