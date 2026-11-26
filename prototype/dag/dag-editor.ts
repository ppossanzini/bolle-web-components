// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
// Editor di grafo aciclico orientato, generico: libero quando non riceve
// vincoli, vincolato quando il developer li dichiara (tipi di porta, limiti,
// regole programmatiche). Il ciclo è sempre rifiutato.

import { LitElement, html, nothing, svg } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import "../../src/index.js";
import type { BolleMenu, BolleSideSheet, BolleSnackbar, MenuAction, MenuEntry, MenuSelectDetail } from "../../src/index.js";
import zoomIn from "@tabler/icons/outline/zoom-in.svg?raw";
import zoomOut from "@tabler/icons/outline/zoom-out.svg?raw";
import fitIcon from "@tabler/icons/outline/focus-centered.svg?raw";
import undoIcon from "@tabler/icons/outline/arrow-back-up.svg?raw";
import redoIcon from "@tabler/icons/outline/arrow-forward-up.svg?raw";
import layoutIcon from "@tabler/icons/outline/hierarchy-2.svg?raw";
import keyboardIcon from "@tabler/icons/outline/keyboard.svg?raw";
import paletteOpen from "@tabler/icons/outline/layout-sidebar-left-expand.svg?raw";
import paletteClose from "@tabler/icons/outline/layout-sidebar-left-collapse.svg?raw";
import alertIcon from "@tabler/icons/outline/alert-triangle.svg?raw";
import emptyIcon from "@tabler/icons/outline/topology-star-3.svg?raw";
import boxIcon from "@tabler/icons/outline/box.svg?raw";
import lockIcon from "@tabler/icons/outline/lock.svg?raw";
import {
  HEAD_H,
  NODE_W,
  ROW_H,
  checkConnection,
  hasPortLabels,
  inputsOf,
  nodeSize,
  layeredLayout,
  outputsOf,
  predecessors,
  reach,
  successors,
  topologicalOrder,
  type ConnectionText,
  type DagConstraints,
  type DagEdge,
  type DagGraph,
  type DagNode,
  type DagNodeKind,
  type DagOrientation,
  type DagPort,
  type DagVerdict,
} from "./graph.js";

export * from "./graph.js";

const icon = (raw: string) => html`<span class="dag-icon" aria-hidden="true">${unsafeSVG(raw)}</span>`;

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;
const READABLE_ZOOM = 0.55;
const HISTORY = 100;

const TEXT: ConnectionText & Record<string, unknown> = {
  self: "Un nodo non può collegarsi a se stesso",
  duplicate: "Questo collegamento esiste già",
  cycle: (path: string[]) =>
    `Creerebbe un ciclo: ${(path.length > 5 ? [...path.slice(0, 2), "…", ...path.slice(-2)] : path).join(" → ")}`,
  type: (outType: string, inType: string) => `Tipo non compatibile: «${outType}» non entra in «${inType}»`,
  portFull: (port: string, max: number, side: "in" | "out") =>
    side === "in"
      ? `L'ingresso «${port}» accetta ${max === 1 ? "un solo collegamento" : `al massimo ${max} collegamenti`}`
      : `L'uscita «${port}» ammette ${max === 1 ? "un solo collegamento" : `al massimo ${max} collegamenti`}`,
  nodeFull: (node: string, max: number, side: "in" | "out") =>
    side === "in"
      ? `«${node}» riceve al massimo ${max} collegamenti`
      : `«${node}» emette al massimo ${max} collegamenti`,
};
const READONLY = "Il grafo è in sola lettura";

type Side = "in" | "out";
interface View {
  x: number;
  y: number;
  k: number;
}
interface Selection {
  nodes: string[];
  edges: string[];
}
type Gesture =
  | { kind: "pan"; startX: number; startY: number; view: View; moved: boolean }
  | {
      kind: "move";
      startX: number;
      startY: number;
      origin: Map<string, { x: number; y: number }>;
      snapshot: DagGraph;
      moved: boolean;
    }
  | { kind: "marquee"; startX: number; startY: number; x: number; y: number; base: string[] }
  | {
      kind: "connect";
      node: string;
      port: string;
      side: Side;
      x: number;
      y: number;
      verdicts: Map<string, string>;
      hover?: { node: string; port: string };
    };
type MenuContext =
  | { kind: "node"; id: string }
  | { kind: "edge"; id: string }
  | { kind: "canvas"; at: { x: number; y: number } }
  | { kind: "add-connect"; node: string; port: string; side: Side; at: { x: number; y: number } };

let sequence = 0;
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(sequence++).toString(36)}`;

export class ProtoDagEditor extends LitElement {
  static properties = {
    nodes: { attribute: false },
    edges: { attribute: false },
    kinds: { attribute: false },
    constraints: { attribute: false },
    label: {},
    readonly: { type: Boolean, reflect: true },
    orientation: { reflect: true },
    loading: { type: Boolean, reflect: true },
    error: {},
    minimap: { type: Boolean },
    snap: { type: Number },
    paletteOpen: { state: true },
    paletteQuery: { state: true },
    view: { state: true },
    selection: { state: true },
    gesture: { state: true },
    note: { state: true },
    ghost: { state: true },
    announcement: { state: true },
    historyLength: { state: true },
  };

  declare nodes: DagNode[];
  declare edges: DagEdge[];
  declare kinds: DagNodeKind[];
  declare constraints: DagConstraints;
  declare label: string;
  declare readonly: boolean;
  declare orientation: DagOrientation;
  declare loading: boolean;
  declare error: string;
  declare minimap: boolean;
  declare snap: number;
  declare paletteOpen: boolean;
  declare paletteQuery: string;
  declare view: View;
  declare selection: Selection;
  declare gesture: Gesture | undefined;
  declare note: { text: string; tone: "info" | "ok" | "error"; x: number; y: number } | undefined;
  declare ghost: { kind: DagNodeKind; x: number; y: number; over: boolean } | undefined;
  declare announcement: string;
  declare historyLength: [number, number];

  private past: DagGraph[] = [];
  private future: DagGraph[] = [];
  private menuContext?: MenuContext;
  private stageSize = { w: 0, h: 0 };
  /** Nodi del documento precedente; `null` quando la vista è già adattata. */
  private fitAfter: DagNode[] | null | undefined = undefined;
  private observer?: ResizeObserver;

  constructor() {
    super();
    this.nodes = [];
    this.edges = [];
    this.kinds = [];
    this.constraints = {};
    this.label = "Grafo";
    this.readonly = false;
    this.orientation = "horizontal";
    this.loading = false;
    this.error = "";
    this.minimap = true;
    this.snap = 8;
    this.paletteOpen = true;
    this.paletteQuery = "";
    this.view = { x: 0, y: 0, k: 1 };
    this.selection = { nodes: [], edges: [] };
    this.announcement = "";
    this.historyLength = [0, 0];
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    // Sotto i 760 px la tavolozza copre il canvas: parte chiusa.
    if (innerWidth < 760) this.paletteOpen = false;
    this.observer = new ResizeObserver(() => {
      const stage = this.canvas;
      if (!stage) return;
      this.stageSize = { w: stage.clientWidth, h: stage.clientHeight };
      if (this.shouldFit()) this.fitView(true);
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has("nodes") || changed.has("edges")) {
      const ids = new Set(this.nodes.map((node) => node.id));
      const edgeIds = new Set(this.edges.map((edge) => edge.id));
      const nodes = this.selection.nodes.filter((id) => ids.has(id));
      const edges = this.selection.edges.filter((id) => edgeIds.has(id));
      if (nodes.length !== this.selection.nodes.length || edges.length !== this.selection.edges.length)
        this.select({ nodes, edges });
    }
    if (this.shouldFit()) this.fitView(true);
    if (this.canvas && !this.observed) {
      this.observed = true;
      this.observer?.observe(this.canvas);
    }
  }
  private observed = false;

  /* API pubblica ------------------------------------------------------------ */

  get graph(): DagGraph {
    return { nodes: this.nodes, edges: this.edges };
  }

  /**
   * Adatta la vista ai nodi. Con `readable` lo zoom non scende sotto una soglia
   * leggibile e, se il grafo non entra, la vista parte dalle sorgenti.
   */
  fitView(readable = false) {
    const { w, h } = this.stageSize;
    if (!w || !this.nodes.length) {
      this.view = { x: w / 2, y: h / 2, k: 1 };
      return;
    }
    const box = this.bounds(this.nodes);
    const pad = 56;
    const fit = Math.min((w - pad * 2) / box.w, (h - pad * 2) / box.h);
    const k = Math.min(MAX_ZOOM * 0.6, Math.max(readable ? READABLE_ZOOM : MIN_ZOOM, fit));
    const x = (w - box.w * k) / 2 - box.x * k;
    const y = (h - box.h * k) / 2 - box.y * k;
    if (k <= fit) {
      this.view = { k, x, y };
      return;
    }
    const horizontal = this.orientation === "horizontal";
    const start = this.flip ? w - pad - (box.x + box.w) * k : pad - box.x * k;
    // Il grafo non entra: la vista si ancora al centro delle sorgenti, da dove si legge.
    const targets = new Set(this.edges.map((edge) => edge.target));
    const sources = this.bounds(this.nodes.filter((node) => !targets.has(node.id)));
    const across = horizontal
      ? h / 2 - (sources.y + sources.h / 2) * k
      : w / 2 - (sources.x + sources.w / 2) * k;
    this.view = {
      k,
      x: horizontal ? start : box.w * k > w ? across : x,
      y: horizontal ? (box.h * k > h ? across : y) : pad - box.y * k,
    };
  }

  zoomTo(k: number, around = { x: this.stageSize.w / 2, y: this.stageSize.h / 2 }) {
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, k));
    const { x, y, k: prev } = this.view;
    this.view = {
      k: next,
      x: around.x - ((around.x - x) / prev) * next,
      y: around.y - ((around.y - y) / prev) * next,
    };
  }

  autoLayout() {
    if (this.readonly || !this.nodes.length) return;
    const positions = layeredLayout(this.graph, (node) => this.sizeOf(node), {
      orientation: this.orientation,
      reverse: this.flip,
    });
    this.commit(
      { nodes: this.nodes.map((node) => ({ ...node, ...positions.get(node.id)! })), edges: this.edges },
      "layout",
    );
    this.fitView(true);
    this.say("Grafo disposto per livelli");
  }

  topologicalOrder() {
    return topologicalOrder(this.graph);
  }

  /** Verifica un collegamento senza eseguirlo: utile all'host per spiegare un vincolo. */
  canConnect(source: string, sourcePort: string, target: string, targetPort: string): DagVerdict {
    const reason = this.verdict(source, sourcePort, target, targetPort);
    return reason ? reason : true;
  }

  undo() {
    const previous = this.past.pop();
    if (!previous) return;
    this.future.push(this.graph);
    this.apply(previous, "undo");
    this.say("Modifica annullata");
  }

  redo() {
    const next = this.future.pop();
    if (!next) return;
    this.past.push(this.graph);
    this.apply(next, "redo");
    this.say("Modifica ripristinata");
  }

  /**
   * Nuovo documento: azzera la cronologia e adatta la vista al prossimo
   * grafo che l'host assegna a `nodes`.
   */
  clearHistory() {
    this.past = [];
    this.future = [];
    this.fitAfter = this.nodes;
    this.historyLength = [0, 0];
  }

  /** La vista si adatta una volta sola per documento, quando arrivano nodi nuovi. */
  private shouldFit() {
    if (this.fitAfter === null || this.nodes === this.fitAfter || !this.nodes.length || !this.stageSize.w) return false;
    this.fitAfter = null;
    return true;
  }

  /* Geometria ------------------------------------------------------------- */

  private get canvas() {
    return this.querySelector<HTMLElement>(".dag-canvas");
  }

  private get flip() {
    return this.orientation === "horizontal" && getComputedStyle(this).direction === "rtl";
  }

  private labeled(node: DagNode) {
    return hasPortLabels(node, this.orientation);
  }

  private sizeOf(node: DagNode) {
    return nodeSize(node, this.orientation);
  }

  /** Posizione della porta relativa al nodo. */
  private portOffset(node: DagNode, side: Side, portId: string) {
    const ports = side === "in" ? inputsOf(node) : outputsOf(node);
    const i = Math.max(0, ports.findIndex((port) => port.id === portId));
    const { w, h } = this.sizeOf(node);
    if (this.orientation === "vertical")
      return { x: (w * (i + 1)) / (ports.length + 1), y: side === "in" ? 0 : h };
    const y = this.labeled(node) ? HEAD_H + i * ROW_H + ROW_H / 2 : (h * (i + 1)) / (ports.length + 1);
    const atStart = (side === "in") !== this.flip;
    return { x: atStart ? 0 : w, y };
  }

  private portPoint(node: DagNode, side: Side, portId: string) {
    const offset = this.portOffset(node, side, portId);
    return { x: node.x + offset.x, y: node.y + offset.y };
  }

  private bounds(nodes: DagNode[]) {
    let x1 = Infinity;
    let y1 = Infinity;
    let x2 = -Infinity;
    let y2 = -Infinity;
    for (const node of nodes) {
      const { w, h } = this.sizeOf(node);
      x1 = Math.min(x1, node.x);
      y1 = Math.min(y1, node.y);
      x2 = Math.max(x2, node.x + w);
      y2 = Math.max(y2, node.y + h);
    }
    return { x: x1, y: y1, w: Math.max(1, x2 - x1), h: Math.max(1, y2 - y1) };
  }

  private toWorld(clientX: number, clientY: number) {
    const rect = this.canvas!.getBoundingClientRect();
    return {
      x: (clientX - rect.left - this.view.x) / this.view.k,
      y: (clientY - rect.top - this.view.y) / this.view.k,
    };
  }

  private curve(a: { x: number; y: number }, b: { x: number; y: number }) {
    if (this.orientation === "vertical") {
      const d = Math.max(40, Math.abs(b.y - a.y) / 2);
      const end = b.y - 6;
      return `M${a.x},${a.y} C${a.x},${a.y + d} ${b.x},${end - d} ${b.x},${end}`;
    }
    const dir = this.flip ? -1 : 1;
    const d = Math.max(40, Math.abs(b.x - a.x) / 2);
    const end = b.x - dir * 6;
    return `M${a.x},${a.y} C${a.x + dir * d},${a.y} ${end - dir * d},${b.y} ${end},${b.y}`;
  }

  private snapTo(value: number) {
    return this.snap > 0 ? Math.round(value / this.snap) * this.snap : value;
  }

  /* Vincoli --------------------------------------------------------------- */

  private node(id: string) {
    return this.nodes.find((node) => node.id === id);
  }

  private port(node: DagNode, side: Side, id: string) {
    return (side === "in" ? inputsOf(node) : outputsOf(node)).find((port) => port.id === id);
  }

  private verdict(source: string, sourcePort: string, target: string, targetPort: string, next?: Map<string, string[]>) {
    if (this.readonly) return READONLY;
    const s = this.node(source);
    const t = this.node(target);
    if (!s || !t) return "Nodo inesistente";
    const sp = this.port(s, "out", sourcePort);
    const tp = this.port(t, "in", targetPort);
    if (!sp || !tp) return "Porta inesistente";
    return checkConnection(this.graph, this.constraints, TEXT, s, sp, t, tp, next);
  }

  /** Prima coppia di porte valida fra due nodi, oppure il motivo del primo rifiuto. */
  private bestPair(source: DagNode, target: DagNode, next = successors(this.graph)) {
    let reason = "";
    const outs = outputsOf(source);
    const ins = inputsOf(target);
    if (!outs.length) return { reason: `«${source.label}» non ha uscite` };
    if (!ins.length) return { reason: `«${target.label}» non riceve collegamenti` };
    for (const sp of outs)
      for (const tp of ins) {
        const why = this.verdict(source.id, sp.id, target.id, tp.id, next);
        if (!why) return { sourcePort: sp.id, targetPort: tp.id, reason: "" };
        reason ||= why;
      }
    return { reason };
  }

  private addVerdict(kind: DagNodeKind): string {
    if (this.readonly) return READONLY;
    const max = this.constraints.maxNodes;
    if (max !== undefined && this.nodes.length >= max) return `Il grafo contiene già ${max} nodi, il massimo previsto`;
    const verdict = this.constraints.canAdd?.(kind, this.graph) ?? true;
    return verdict === true ? "" : verdict;
  }

  private deleteVerdict(node: DagNode): string {
    if (this.readonly) return READONLY;
    const verdict = this.constraints.canDelete?.(node, this.graph) ?? true;
    return verdict === true ? "" : verdict;
  }

  private edgeDeleteVerdict(edge: DagEdge): string {
    if (this.readonly) return READONLY;
    const verdict = this.constraints.canDeleteEdge?.(edge, this.graph) ?? true;
    return verdict === true ? "" : verdict;
  }

  /* Modifiche ------------------------------------------------------------- */

  private emit(name: string, detail: unknown) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private say(message: string) {
    this.announcement = "";
    requestAnimationFrame(() => (this.announcement = message));
  }

  private toast(message: string, undoable = false) {
    const bar = this.querySelector<BolleSnackbar>("bolle-snackbar");
    if (!bar) return;
    bar.actionLabel = undoable ? "Annulla" : "";
    bar.show(message);
  }

  private apply(graph: DagGraph, cause: string) {
    this.nodes = graph.nodes;
    this.edges = graph.edges;
    this.historyLength = [this.past.length, this.future.length];
    this.emit("dag-change", { nodes: graph.nodes, edges: graph.edges, cause });
  }

  private commit(graph: DagGraph, cause: string, snapshot = this.graph) {
    this.past.push(snapshot);
    if (this.past.length > HISTORY) this.past.shift();
    this.future = [];
    this.apply(graph, cause);
  }

  private select(selection: Selection) {
    this.selection = selection;
    this.emit("dag-selection-change", selection);
  }

  private connect(source: string, sourcePort: string, target: string, targetPort: string) {
    const reason = this.verdict(source, sourcePort, target, targetPort);
    const s = this.node(source)!;
    const t = this.node(target)!;
    if (reason) {
      this.emit("dag-connection-rejected", { source, sourcePort, target, targetPort, reason });
      this.say(`Collegamento rifiutato. ${reason}`);
      this.toast(reason);
      return false;
    }
    const edge: DagEdge = { id: uid("e"), source, sourcePort, target, targetPort };
    this.commit({ nodes: this.nodes, edges: [...this.edges, edge] }, "connect");
    this.select({ nodes: [], edges: [edge.id] });
    this.say(`Collegato «${s.label}» a «${t.label}»`);
    return true;
  }

  private createNode(kind: DagNodeKind, at: { x: number; y: number }) {
    const same = this.nodes.filter((node) => node.kind === kind.kind).length;
    const node: DagNode = {
      id: uid(kind.kind),
      kind: kind.kind,
      label: same ? `${kind.label} ${same + 1}` : kind.label,
      description: kind.description,
      icon: kind.icon,
      inputs: kind.inputs?.map((port) => ({ ...port })),
      outputs: kind.outputs?.map((port) => ({ ...port })),
      x: 0,
      y: 0,
    };
    const { w, h } = this.sizeOf(node);
    let x = this.snapTo(at.x - w / 2);
    let y = this.snapTo(at.y - h / 2);
    for (let i = 0; i < 24 && this.overlaps(x, y, w, h); i++) {
      x += 24;
      y += 24;
    }
    return { ...node, x, y };
  }

  private overlaps(x: number, y: number, w: number, h: number) {
    return this.nodes.some((node) => {
      const size = this.sizeOf(node);
      return x < node.x + size.w && x + w > node.x && y < node.y + size.h && y + h > node.y;
    });
  }

  private addNode(kind: DagNodeKind, at: { x: number; y: number }) {
    const reason = this.addVerdict(kind);
    if (reason) {
      this.toast(reason);
      this.say(`Nodo non aggiunto. ${reason}`);
      return undefined;
    }
    const node = this.createNode(kind, at);
    this.commit({ nodes: [...this.nodes, node], edges: this.edges }, "add");
    this.select({ nodes: [node.id], edges: [] });
    this.say(`Aggiunto il nodo «${node.label}»`);
    return node;
  }

  private addAndConnect(kind: DagNodeKind, from: { node: string; port: string; side: Side }, at: { x: number; y: number }) {
    const reason = this.addVerdict(kind);
    if (reason) return this.toast(reason);
    const created = this.createNode(kind, at);
    const snapshot = this.graph;
    const nodes = [...this.nodes, created];
    const ports = from.side === "out" ? inputsOf(created) : outputsOf(created);
    this.nodes = nodes;
    const next = successors(this.graph);
    const port = ports.find((p) =>
      from.side === "out"
        ? !this.verdict(from.node, from.port, created.id, p.id, next)
        : !this.verdict(created.id, p.id, from.node, from.port, next),
    );
    this.nodes = snapshot.nodes;
    if (!port) return;
    const edge: DagEdge =
      from.side === "out"
        ? { id: uid("e"), source: from.node, sourcePort: from.port, target: created.id, targetPort: port.id }
        : { id: uid("e"), source: created.id, sourcePort: port.id, target: from.node, targetPort: from.port };
    this.commit({ nodes, edges: [...this.edges, edge] }, "add", snapshot);
    this.select({ nodes: [created.id], edges: [] });
    this.say(`Aggiunto «${created.label}» e collegato`);
  }

  private deleteSelection() {
    if (this.readonly) return;
    const blocked: string[] = [];
    const nodeIds = new Set(
      this.selection.nodes.filter((id) => {
        const node = this.node(id);
        const reason = node ? this.deleteVerdict(node) : "";
        if (node && reason) blocked.push(`«${node.label}»: ${reason}`);
        return node && !reason;
      }),
    );
    const edgeIds = new Set(
      this.selection.edges.filter((id) => {
        const edge = this.edges.find((item) => item.id === id);
        const reason = edge ? this.edgeDeleteVerdict(edge) : "";
        if (reason) blocked.push(reason);
        return edge && !reason;
      }),
    );
    if (!nodeIds.size && !edgeIds.size) {
      if (blocked.length) this.toast(blocked[0]);
      return;
    }
    const edges = this.edges.filter(
      (edge) => !edgeIds.has(edge.id) && !nodeIds.has(edge.source) && !nodeIds.has(edge.target),
    );
    const removedEdges = this.edges.length - edges.length;
    this.commit({ nodes: this.nodes.filter((node) => !nodeIds.has(node.id)), edges }, "delete");
    this.select({ nodes: [], edges: [] });
    const parts = [
      nodeIds.size ? `${nodeIds.size} ${nodeIds.size === 1 ? "nodo" : "nodi"}` : "",
      removedEdges ? `${removedEdges} ${removedEdges === 1 ? "collegamento" : "collegamenti"}` : "",
    ].filter(Boolean);
    const message = `Eliminati ${parts.join(" e ")}${blocked.length ? `. Non eliminato ${blocked[0]}` : ""}`;
    this.toast(message, true);
    this.say(message);
    this.canvas?.focus({ preventScroll: true });
  }

  private duplicateSelection() {
    if (this.readonly || !this.selection.nodes.length) return;
    const chosen = this.nodes.filter((node) => this.selection.nodes.includes(node.id));
    const max = this.constraints.maxNodes;
    if (max !== undefined && this.nodes.length + chosen.length > max)
      return this.toast(`Il grafo non può superare ${max} nodi`);
    for (const node of chosen) {
      const kind = this.kinds.find((item) => item.kind === node.kind);
      const reason = kind ? this.addVerdict(kind) : "";
      if (reason) return this.toast(`«${node.label}» non duplicato: ${reason}`);
    }
    const map = new Map(chosen.map((node) => [node.id, uid(node.kind ?? "n")]));
    const copies = chosen.map((node) => ({
      ...node,
      id: map.get(node.id)!,
      label: `${node.label} (copia)`,
      badge: undefined,
      x: node.x + 32,
      y: node.y + 32,
    }));
    const inner = this.edges
      .filter((edge) => map.has(edge.source) && map.has(edge.target))
      .map((edge) => ({ ...edge, id: uid("e"), source: map.get(edge.source)!, target: map.get(edge.target)! }));
    this.commit({ nodes: [...this.nodes, ...copies], edges: [...this.edges, ...inner] }, "duplicate");
    this.select({ nodes: copies.map((node) => node.id), edges: [] });
    this.say(`Duplicati ${copies.length} nodi`);
  }

  private nudge(dx: number, dy: number) {
    const ids = new Set(this.selection.nodes);
    if (!ids.size) return;
    this.commit(
      {
        nodes: this.nodes.map((node) => (ids.has(node.id) ? { ...node, x: node.x + dx, y: node.y + dy } : node)),
        edges: this.edges,
      },
      "move",
    );
  }

  /* Puntatore ------------------------------------------------------------- */

  private onPointerDown = (event: PointerEvent) => {
    if (event.button === 2) return;
    const canvas = this.canvas!;
    const target = event.target as HTMLElement;
    const portEl = target.closest<HTMLElement>(".dag-port");
    const nodeEl = target.closest<HTMLElement>(".dag-node");
    const edgeEl = target.closest<SVGElement>("[data-edge]");
    const additive = event.shiftKey || event.ctrlKey || event.metaKey;

    if (event.button === 1 || (!portEl && !nodeEl && !edgeEl && !event.shiftKey)) {
      event.preventDefault();
      canvas.focus({ preventScroll: true });
      canvas.setPointerCapture(event.pointerId);
      this.gesture = { kind: "pan", startX: event.clientX, startY: event.clientY, view: this.view, moved: false };
      return;
    }
    if (portEl && nodeEl && !this.readonly) {
      event.preventDefault();
      event.stopPropagation();
      canvas.setPointerCapture(event.pointerId);
      this.startConnect(nodeEl.dataset.id!, portEl.dataset.port!, portEl.dataset.side as Side, event);
      return;
    }
    if (nodeEl) {
      const id = nodeEl.dataset.id!;
      const selected = this.selection.nodes.includes(id);
      if (additive)
        this.select({
          nodes: selected ? this.selection.nodes.filter((item) => item !== id) : [...this.selection.nodes, id],
          edges: [],
        });
      else if (!selected) this.select({ nodes: [id], edges: [] });
      if (this.readonly || (additive && selected)) return;
      canvas.setPointerCapture(event.pointerId);
      const ids = new Set(this.selection.nodes);
      this.gesture = {
        kind: "move",
        startX: event.clientX,
        startY: event.clientY,
        origin: new Map(this.nodes.filter((node) => ids.has(node.id)).map((node) => [node.id, { x: node.x, y: node.y }])),
        snapshot: this.graph,
        moved: false,
      };
      return;
    }
    if (edgeEl) {
      const id = edgeEl.dataset.edge!;
      canvas.focus({ preventScroll: true });
      this.select(
        additive
          ? { nodes: this.selection.nodes, edges: [...new Set([...this.selection.edges, id])] }
          : { nodes: [], edges: [id] },
      );
      return;
    }
    // Maiuscolo + trascinamento sul fondo: selezione rettangolare.
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(event.pointerId);
    this.gesture = {
      kind: "marquee",
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      base: this.selection.nodes,
    };
  };

  private startConnect(node: string, port: string, side: Side, event: PointerEvent) {
    const next = successors(this.graph);
    const verdicts = new Map<string, string>();
    for (const other of this.nodes)
      for (const candidate of side === "out" ? inputsOf(other) : outputsOf(other))
        verdicts.set(
          `${other.id}:${candidate.id}`,
          side === "out"
            ? this.verdict(node, port, other.id, candidate.id, next)
            : this.verdict(other.id, candidate.id, node, port, next),
        );
    const at = this.toWorld(event.clientX, event.clientY);
    this.gesture = { kind: "connect", node, port, side, x: at.x, y: at.y, verdicts };
    this.note = {
      text: this.kinds.length ? "Rilascia su una porta, oppure nel vuoto per aggiungere un nodo" : "Rilascia su una porta",
      tone: "info",
      x: event.clientX,
      y: event.clientY,
    };
  }

  private onPointerMove = (event: PointerEvent) => {
    const gesture = this.gesture;
    if (!gesture) return;
    if (gesture.kind === "pan") {
      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) gesture.moved = true;
      this.view = { ...gesture.view, x: gesture.view.x + dx, y: gesture.view.y + dy };
      return;
    }
    if (gesture.kind === "move") {
      const dx = (event.clientX - gesture.startX) / this.view.k;
      const dy = (event.clientY - gesture.startY) / this.view.k;
      if (!gesture.moved && Math.abs(dx) + Math.abs(dy) < 3) return;
      gesture.moved = true;
      this.nodes = this.nodes.map((node) => {
        const origin = gesture.origin.get(node.id);
        return origin ? { ...node, x: this.snapTo(origin.x + dx), y: this.snapTo(origin.y + dy) } : node;
      });
      return;
    }
    if (gesture.kind === "marquee") {
      this.gesture = { ...gesture, x: event.clientX, y: event.clientY };
      const a = this.toWorld(gesture.startX, gesture.startY);
      const b = this.toWorld(event.clientX, event.clientY);
      const x1 = Math.min(a.x, b.x);
      const x2 = Math.max(a.x, b.x);
      const y1 = Math.min(a.y, b.y);
      const y2 = Math.max(a.y, b.y);
      const inside = this.nodes
        .filter((node) => {
          const { w, h } = this.sizeOf(node);
          return node.x < x2 && node.x + w > x1 && node.y < y2 && node.y + h > y1;
        })
        .map((node) => node.id);
      this.selection = { nodes: [...new Set([...gesture.base, ...inside])], edges: [] };
      return;
    }
    const at = this.toWorld(event.clientX, event.clientY);
    const hit = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    const portEl = hit?.closest<HTMLElement>(".dag-port");
    const nodeEl = hit?.closest<HTMLElement>(".dag-node");
    let hover: { node: string; port: string } | undefined;
    const wanted: Side = gesture.side === "out" ? "in" : "out";
    if (nodeEl && nodeEl.dataset.id !== gesture.node) {
      const other = this.node(nodeEl.dataset.id!)!;
      if (portEl && portEl.dataset.side === wanted) hover = { node: other.id, port: portEl.dataset.port! };
      else {
        const ports = wanted === "in" ? inputsOf(other) : outputsOf(other);
        const valid = ports.find((port) => gesture.verdicts.get(`${other.id}:${port.id}`) === "");
        const first = valid ?? ports[0];
        if (first) hover = { node: other.id, port: first.id };
      }
    }
    this.gesture = { ...gesture, x: at.x, y: at.y, hover };
    if (hover) {
      const reason = gesture.verdicts.get(`${hover.node}:${hover.port}`) ?? "";
      const other = this.node(hover.node)!;
      const port = this.port(other, wanted, hover.port);
      this.note = {
        text: reason || `Rilascia per collegare «${other.label}»${port?.label ? ` · ${port.label}` : ""}`,
        tone: reason ? "error" : "ok",
        x: event.clientX,
        y: event.clientY,
      };
    } else if (nodeEl) {
      this.note = { text: TEXT.self, tone: "error", x: event.clientX, y: event.clientY };
    } else {
      this.note = {
        text: this.kinds.length ? "Rilascia nel vuoto per aggiungere un nodo collegato" : "Rilascia su una porta",
        tone: "info",
        x: event.clientX,
        y: event.clientY,
      };
    }
  };

  private onPointerUp = (event: PointerEvent) => {
    const gesture = this.gesture;
    this.gesture = undefined;
    this.note = undefined;
    if (!gesture) return;
    if (gesture.kind === "pan") {
      if (!gesture.moved && event.button === 0 && (this.selection.nodes.length || this.selection.edges.length))
        this.select({ nodes: [], edges: [] });
      return;
    }
    if (gesture.kind === "move") {
      if (gesture.moved) {
        this.past.push(gesture.snapshot);
        this.future = [];
        this.apply(this.graph, "move");
      }
      return;
    }
    if (gesture.kind === "marquee") {
      this.emit("dag-selection-change", this.selection);
      if (this.selection.nodes.length) this.say(`${this.selection.nodes.length} nodi selezionati`);
      return;
    }
    if (gesture.hover) {
      const { node, port } = gesture.hover;
      if (gesture.side === "out") this.connect(gesture.node, gesture.port, node, port);
      else this.connect(node, port, gesture.node, gesture.port);
      return;
    }
    const hit = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    if (!hit?.closest(".dag-node") && hit?.closest(".dag-canvas") && this.kinds.length)
      this.openMenu(
        { kind: "add-connect", node: gesture.node, port: gesture.port, side: gesture.side, at: { x: gesture.x, y: gesture.y } },
        event.clientX,
        event.clientY,
      );
  };

  private onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const rect = this.canvas!.getBoundingClientRect();
    if (event.ctrlKey || event.metaKey) {
      const factor = Math.exp(-event.deltaY * 0.0022);
      this.zoomTo(this.view.k * factor, { x: event.clientX - rect.left, y: event.clientY - rect.top });
      return;
    }
    const dx = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
    const dy = event.shiftKey && !event.deltaX ? 0 : event.deltaY;
    this.view = { ...this.view, x: this.view.x - dx, y: this.view.y - dy };
  };

  private onDoubleClick = (event: MouseEvent) => {
    // Con la cattura del puntatore il bersaglio è il canvas: conta ciò che sta sotto il puntatore.
    const hit = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    const nodeEl = hit?.closest<HTMLElement>(".dag-node");
    if (nodeEl) {
      const node = this.node(nodeEl.dataset.id!);
      if (node) this.emit("dag-node-activate", { node });
      return;
    }
    if (this.readonly || !this.kinds.length || hit?.closest("[data-edge]")) return;
    this.openMenu({ kind: "canvas", at: this.toWorld(event.clientX, event.clientY) }, event.clientX, event.clientY, true);
  };

  private onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const nodeEl = target.closest<HTMLElement>(".dag-node");
    const edgeEl = target.closest<SVGElement>("[data-edge]");
    if (nodeEl) {
      const id = nodeEl.dataset.id!;
      if (!this.selection.nodes.includes(id)) this.select({ nodes: [id], edges: [] });
      return this.openMenu({ kind: "node", id }, event.clientX, event.clientY);
    }
    if (edgeEl) {
      const id = edgeEl.dataset.edge!;
      this.select({ nodes: [], edges: [id] });
      return this.openMenu({ kind: "edge", id }, event.clientX, event.clientY);
    }
    this.openMenu({ kind: "canvas", at: this.toWorld(event.clientX, event.clientY) }, event.clientX, event.clientY);
  };

  /* Tavolozza ------------------------------------------------------------- */

  private startPaletteDrag(event: PointerEvent, kind: DagNodeKind) {
    if (event.button !== 0 || this.readonly) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const button = event.currentTarget as HTMLElement;
    let dragging = false;
    const move = (e: PointerEvent) => {
      if (!dragging && Math.hypot(e.clientX - startX, e.clientY - startY) < 5) return;
      dragging = true;
      const rect = this.canvas!.getBoundingClientRect();
      const over = e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom;
      this.ghost = { kind, x: e.clientX, y: e.clientY, over };
    };
    const up = (e: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const ghost = this.ghost;
      this.ghost = undefined;
      if (!dragging) return;
      button.dataset.dragged = "true";
      if (ghost?.over) this.addNode(kind, this.toWorld(e.clientX, e.clientY));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  private onPaletteClick(event: MouseEvent, kind: DagNodeKind) {
    const button = event.currentTarget as HTMLElement;
    if (button.dataset.dragged) {
      delete button.dataset.dragged;
      return;
    }
    const center = this.toWorld(
      this.canvas!.getBoundingClientRect().left + this.stageSize.w / 2,
      this.canvas!.getBoundingClientRect().top + this.stageSize.h / 2,
    );
    const node = this.addNode(kind, center);
    if (node)
      this.updateComplete.then(() =>
        this.querySelector<HTMLElement>(`.dag-node[data-id="${node.id}"]`)?.focus({ preventScroll: true }),
      );
  }

  /* Tastiera -------------------------------------------------------------- */

  private onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest(".dag-palette, .dag-toolbar, bolle-menu, bolle-side-sheet, bolle-snackbar")) return;
    const nodeEl = target.closest<HTMLElement>(".dag-node");
    const mod = event.ctrlKey || event.metaKey;
    const key = event.key;
    if (key === "Escape") {
      if (this.gesture) {
        this.gesture = undefined;
        this.note = undefined;
        this.say("Collegamento annullato");
      } else this.select({ nodes: [], edges: [] });
      return;
    }
    if (mod && key.toLowerCase() === "z") {
      event.preventDefault();
      return event.shiftKey ? this.redo() : this.undo();
    }
    if (mod && key.toLowerCase() === "y") {
      event.preventDefault();
      return this.redo();
    }
    if (mod && key.toLowerCase() === "a") {
      event.preventDefault();
      this.select({ nodes: this.nodes.map((node) => node.id), edges: [] });
      return this.say(`${this.nodes.length} nodi selezionati`);
    }
    if (mod && key.toLowerCase() === "d") {
      event.preventDefault();
      return this.duplicateSelection();
    }
    if (key === "Delete" || key === "Backspace") {
      event.preventDefault();
      return this.deleteSelection();
    }
    if (!mod && (key === "+" || key === "=")) return this.zoomTo(this.view.k * 1.2);
    if (!mod && key === "-") return this.zoomTo(this.view.k / 1.2);
    if (!mod && key === "0") return this.fitView();
    if (!mod && key === "1") return this.zoomTo(1);
    if ((key === "F10" && event.shiftKey) || key === "ContextMenu") {
      event.preventDefault();
      const rect = target.getBoundingClientRect();
      if (nodeEl) return this.openMenu({ kind: "node", id: nodeEl.dataset.id! }, rect.left + 24, rect.bottom);
      if (this.selection.edges.length === 1)
        return this.openMenu({ kind: "edge", id: this.selection.edges[0] }, rect.left + 24, rect.top + 24);
      return this.openMenu(
        { kind: "canvas", at: this.toWorld(rect.left + rect.width / 2, rect.top + rect.height / 2) },
        rect.left + 24,
        rect.top + 24,
      );
    }
    if (nodeEl && key === "Enter") {
      event.preventDefault();
      const node = this.node(nodeEl.dataset.id!);
      if (node) this.emit("dag-node-activate", { node });
      return;
    }
    if (nodeEl && key === " ") {
      event.preventDefault();
      const id = nodeEl.dataset.id!;
      const on = this.selection.nodes.includes(id);
      this.select({
        nodes: on ? this.selection.nodes.filter((item) => item !== id) : [...this.selection.nodes, id],
        edges: [],
      });
      return;
    }
    const arrows: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const arrow = arrows[key];
    if (!arrow) return;
    event.preventDefault();
    if (nodeEl && event.altKey) return this.focusNeighbour(nodeEl.dataset.id!, arrow);
    if (nodeEl && !this.readonly) {
      const step = (this.snap || 8) * (event.shiftKey ? 5 : 1);
      return this.nudge(arrow[0] * step, arrow[1] * step);
    }
    if (!nodeEl) {
      const step = event.shiftKey ? 240 : 48;
      this.view = { ...this.view, x: this.view.x - arrow[0] * step, y: this.view.y - arrow[1] * step };
    }
  };

  /** Alt + frecce: il nodo più vicino nella direzione indicata. */
  private focusNeighbour(id: string, [dx, dy]: [number, number]) {
    const from = this.node(id)!;
    const a = { x: from.x + NODE_W / 2, y: from.y + this.sizeOf(from).h / 2 };
    let best: DagNode | undefined;
    let score = Infinity;
    for (const node of this.nodes) {
      if (node.id === id) continue;
      const b = { x: node.x + NODE_W / 2, y: node.y + this.sizeOf(node).h / 2 };
      const along = (b.x - a.x) * dx + (b.y - a.y) * dy;
      const across = Math.abs((b.x - a.x) * dy) + Math.abs((b.y - a.y) * dx);
      if (along <= 0 || across > along * 2) continue;
      const value = along + across * 2;
      if (value < score) {
        score = value;
        best = node;
      }
    }
    if (!best) return this.say("Nessun nodo in quella direzione");
    this.select({ nodes: [best.id], edges: [] });
    this.querySelector<HTMLElement>(`.dag-node[data-id="${best.id}"]`)?.focus({ preventScroll: true });
  }

  private onNodeFocus(id: string) {
    if (this.gesture) return;
    if (!this.selection.nodes.includes(id)) this.select({ nodes: [id], edges: [] });
  }

  /** Porta la vista sul nodo: solo su richiesta esplicita dell'utente dal menu. */
  private centerOn(id: string) {
    const node = this.node(id);
    if (!node) return;
    const { w, h } = this.sizeOf(node);
    this.view = {
      ...this.view,
      x: this.stageSize.w / 2 - (node.x + w / 2) * this.view.k,
      y: this.stageSize.h / 2 - (node.y + h / 2) * this.view.k,
    };
  }

  /* Menu ------------------------------------------------------------------ */

  private kindEntries(check: (kind: DagNodeKind) => string): MenuEntry[] {
    const groups = new Map<string, DagNodeKind[]>();
    for (const kind of this.kinds) {
      const key = kind.group ?? "";
      groups.set(key, [...(groups.get(key) ?? []), kind]);
    }
    const action = (kind: DagNodeKind): MenuAction => {
      const reason = check(kind);
      return { id: `add:${kind.kind}`, label: kind.label, disabled: !!reason, supportingText: reason || kind.description };
    };
    if (groups.size <= 1) return this.kinds.map(action);
    return [...groups].map(([label, kinds]) => ({ group: true as const, label: label || "Altro", items: kinds.map(action) }));
  }

  private nodeEntries(id: string): MenuEntry[] {
    const node = this.node(id)!;
    const next = successors(this.graph);
    const others = this.nodes.filter((other) => other.id !== id).sort((a, b) => a.label.localeCompare(b.label));
    const linked = this.edges.filter((edge) => edge.source === id || edge.target === id);
    const deleteReason = this.deleteVerdict(node);
    const view: MenuEntry[] = [
      { id: "props", label: "Proprietà", trailingText: "Invio" },
      { id: "center", label: "Centra nella vista" },
      { id: "up", label: "Seleziona a monte", disabled: !this.edges.some((edge) => edge.target === id) },
      { id: "down", label: "Seleziona a valle", disabled: !this.edges.some((edge) => edge.source === id) },
    ];
    if (this.readonly) return view;
    const pairTo = (other: DagNode, outgoing: boolean): MenuAction => {
      const pair = outgoing ? this.bestPair(node, other, next) : this.bestPair(other, node, next);
      return {
        id: `${outgoing ? "to" : "from"}:${other.id}`,
        label: other.label,
        disabled: !!pair.reason,
        supportingText: pair.reason || other.description,
      };
    };
    return [
      ...view,
      { separator: true },
      {
        id: "connect-to",
        label: "Collega a",
        disabled: !outputsOf(node).length || !others.length,
        children: others.map((other) => pairTo(other, true)),
      },
      {
        id: "connect-from",
        label: "Ricevi da",
        disabled: !inputsOf(node).length || !others.length,
        children: others.map((other) => pairTo(other, false)),
      },
      {
        id: "unlink",
        label: "Scollega",
        disabled: !linked.length,
        children: linked.map((edge) => {
          const outgoing = edge.source === id;
          const other = this.node(outgoing ? edge.target : edge.source)!;
          const reason = this.edgeDeleteVerdict(edge);
          return {
            id: `unlink:${edge.id}`,
            label: `${outgoing ? "→" : "←"} ${other.label}`,
            disabled: !!reason,
            supportingText: reason || undefined,
          };
        }),
      },
      { separator: true },
      { id: "duplicate", label: "Duplica", trailingText: "Ctrl+D" },
      { id: "delete", label: "Elimina", trailingText: "Canc", disabled: !!deleteReason, supportingText: deleteReason || undefined },
    ];
  }

  private openMenu(context: MenuContext, x: number, y: number, addOnly = false) {
    const menu = this.querySelector<BolleMenu>("bolle-menu");
    if (!menu) return;
    let items: MenuEntry[] = [];
    let label = "Azioni";
    if (context.kind === "node") {
      label = `Azioni su «${this.node(context.id)?.label}»`;
      items = this.nodeEntries(context.id);
    } else if (context.kind === "edge") {
      const edge = this.edges.find((item) => item.id === context.id);
      if (!edge) return;
      const reason = this.edgeDeleteVerdict(edge);
      label = `Collegamento ${this.node(edge.source)?.label} → ${this.node(edge.target)?.label}`;
      items = [
        { id: "edge-source", label: `Vai a «${this.node(edge.source)?.label}»` },
        { id: "edge-target", label: `Vai a «${this.node(edge.target)?.label}»` },
        ...(this.readonly
          ? []
          : [
              { separator: true as const },
              { id: "edge-delete", label: "Elimina collegamento", trailingText: "Canc", disabled: !!reason, supportingText: reason || undefined },
            ]),
      ];
    } else if (context.kind === "add-connect") {
      label = "Aggiungi e collega";
      const from = this.node(context.node)!;
      items = this.kindEntries((kind) => {
        const reason = this.addVerdict(kind);
        if (reason) return reason;
        const probe = this.createNode(kind, context.at);
        const ports = context.side === "out" ? inputsOf(probe) : outputsOf(probe);
        if (!ports.length) return context.side === "out" ? "Non riceve collegamenti" : "Non ha uscite";
        const graph = { nodes: [...this.nodes, probe], edges: this.edges };
        const fromPort = this.port(from, context.side, context.port)!;
        let first = "";
        for (const port of ports) {
          const why =
            context.side === "out"
              ? checkConnection(graph, this.constraints, TEXT, from, fromPort, probe, port)
              : checkConnection(graph, this.constraints, TEXT, probe, port, from, fromPort);
          if (!why) return "";
          first ||= why;
        }
        return first;
      });
    } else {
      label = addOnly ? "Aggiungi nodo" : "Grafo";
      const add = this.kindEntries((kind) => this.addVerdict(kind));
      items = addOnly
        ? add
        : [
            ...(this.readonly || !this.kinds.length ? [] : [{ id: "add", label: "Aggiungi nodo", children: add.flatMap((entry) => ("group" in entry ? entry.items : [entry])) } as MenuAction, { separator: true as const }]),
            { id: "fit", label: "Adatta alla vista", trailingText: "0" },
            { id: "all", label: "Seleziona tutto", trailingText: "Ctrl+A", disabled: !this.nodes.length },
            ...(this.readonly
              ? []
              : [
                  { id: "layout", label: "Disponi automaticamente", disabled: !this.nodes.length },
                  { separator: true as const },
                  { id: "undo", label: "Annulla", trailingText: "Ctrl+Z", disabled: !this.past.length },
                  { id: "redo", label: "Ripeti", trailingText: "Ctrl+Y", disabled: !this.future.length },
                ]),
          ];
    }
    this.menuContext = context;
    menu.items = items;
    menu.menuLabel = label;
    menu.selectionMode = "none";
    void menu.show(this.canvas!, { x, y });
  }

  private onMenuSelect = (event: CustomEvent<MenuSelectDetail>) => {
    const context = this.menuContext;
    this.menuContext = undefined;
    if (!context) return;
    const id = event.detail.item.id;
    if (id.startsWith("add:")) {
      const kind = this.kinds.find((item) => `add:${item.kind}` === id);
      if (!kind) return;
      if (context.kind === "add-connect")
        return this.addAndConnect(kind, { node: context.node, port: context.port, side: context.side }, context.at);
      if (context.kind === "canvas") this.addNode(kind, context.at);
      return;
    }
    if (context.kind === "node") {
      const node = this.node(context.id)!;
      if (id === "props") return this.emit("dag-node-activate", { node });
      if (id === "center") return this.centerOn(node.id);
      if (id === "up" || id === "down") {
        const ids = [...reach(node.id, id === "up" ? predecessors(this.graph) : successors(this.graph))];
        this.select({ nodes: [node.id, ...ids], edges: [] });
        return this.say(`${ids.length} nodi ${id === "up" ? "a monte" : "a valle"} selezionati`);
      }
      if (id.startsWith("to:") || id.startsWith("from:")) {
        const other = this.node(id.split(":")[1])!;
        const outgoing = id.startsWith("to:");
        const pair = outgoing ? this.bestPair(node, other) : this.bestPair(other, node);
        if (pair.sourcePort && pair.targetPort)
          outgoing
            ? this.connect(node.id, pair.sourcePort, other.id, pair.targetPort)
            : this.connect(other.id, pair.sourcePort, node.id, pair.targetPort);
        return;
      }
      if (id.startsWith("unlink:")) {
        const edgeId = id.slice(7);
        this.commit({ nodes: this.nodes, edges: this.edges.filter((edge) => edge.id !== edgeId) }, "disconnect");
        this.toast("Collegamento eliminato", true);
        return;
      }
      if (id === "duplicate") return this.duplicateSelection();
      if (id === "delete") {
        this.select({ nodes: [node.id], edges: [] });
        return this.deleteSelection();
      }
    }
    if (context.kind === "edge") {
      const edge = this.edges.find((item) => item.id === context.id);
      if (!edge) return;
      if (id === "edge-delete") {
        this.select({ nodes: [], edges: [edge.id] });
        return this.deleteSelection();
      }
      const target = id === "edge-source" ? edge.source : edge.target;
      this.select({ nodes: [target], edges: [] });
      this.querySelector<HTMLElement>(`.dag-node[data-id="${target}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (id === "fit") return this.fitView();
    if (id === "all") return this.select({ nodes: this.nodes.map((node) => node.id), edges: [] });
    if (id === "layout") return this.autoLayout();
    if (id === "undo") return this.undo();
    if (id === "redo") return this.redo();
  };

  /* Disegno --------------------------------------------------------------- */

  private renderPalette() {
    if (!this.kinds.length || this.readonly) return nothing;
    if (!this.paletteOpen)
      return html`<div class="dag-palette-rail">
        <bolle-tooltip label="Mostra i nodi">
          <bolle-icon-button variant="tonal" size="small" label="Mostra i nodi" @click=${() => (this.paletteOpen = true)}
            >${icon(paletteOpen)}</bolle-icon-button
          >
        </bolle-tooltip>
      </div>`;
    const query = this.paletteQuery.trim().toLowerCase();
    const kinds = this.kinds.filter(
      (kind) => !query || `${kind.label} ${kind.description ?? ""} ${kind.group ?? ""}`.toLowerCase().includes(query),
    );
    const groups = new Map<string, DagNodeKind[]>();
    for (const kind of kinds) groups.set(kind.group ?? "", [...(groups.get(kind.group ?? "") ?? []), kind]);
    return html`<aside class="dag-palette" aria-label="Nodi disponibili">
      <header>
        <h2>Nodi</h2>
        <bolle-tooltip label="Nascondi i nodi">
          <bolle-icon-button variant="standard" size="xs" label="Nascondi i nodi" @click=${() => (this.paletteOpen = false)}
            >${icon(paletteClose)}</bolle-icon-button
          >
        </bolle-tooltip>
      </header>
      <bolle-search
        label="Cerca un tipo di nodo"
        placeholder="Cerca"
        filter
        .value=${this.paletteQuery}
        @change=${(event: CustomEvent<{ value: string }>) => (this.paletteQuery = event.detail.value)}
      ></bolle-search>
      <div class="dag-palette-list">
        ${kinds.length
          ? [...groups].map(
              ([group, items]) => html`<section>
                ${group ? html`<h3>${group}</h3>` : nothing}
                <ul>
                  ${items.map((kind) => {
                    const reason = this.addVerdict(kind);
                    return html`<li>
                      <button
                        type="button"
                        class="dag-kind"
                        ?disabled=${!!reason}
                        aria-describedby=${`kind-${kind.kind}`}
                        @pointerdown=${(event: PointerEvent) => this.startPaletteDrag(event, kind)}
                        @click=${(event: MouseEvent) => this.onPaletteClick(event, kind)}
                      >
                        <span class="dag-kind-icon">${icon(kind.icon ?? boxIcon)}</span>
                        <span class="dag-kind-text">
                          <strong>${kind.label}</strong>
                          <span id=${`kind-${kind.kind}`}>${reason || kind.description || ""}</span>
                        </span>
                        ${reason ? html`<span class="dag-kind-lock">${icon(lockIcon)}</span>` : nothing}
                      </button>
                    </li>`;
                  })}
                </ul>
              </section>`,
            )
          : html`<p class="dag-palette-empty">Nessun tipo di nodo corrisponde a «${this.paletteQuery}»</p>`}
      </div>
      <p class="dag-palette-foot">Trascina sul canvas o premi Invio per aggiungere al centro</p>
    </aside>`;
  }

  private renderEdges(related: Set<string>) {
    const gesture = this.gesture;
    const selectedEdges = new Set(this.selection.edges);
    const byId = new Map(this.nodes.map((node) => [node.id, node]));
    const box = this.nodes.length ? this.bounds(this.nodes) : { x: 0, y: 0, w: 1, h: 1 };
    const pad = 400;
    const x = box.x - pad;
    const y = box.y - pad;
    const w = box.w + pad * 2;
    const h = box.h + pad * 2;
    let preview: unknown = nothing;
    if (gesture?.kind === "connect") {
      const origin = byId.get(gesture.node)!;
      const from = this.portPoint(origin, gesture.side, gesture.port);
      let to = { x: gesture.x, y: gesture.y };
      let tone = "info";
      if (gesture.hover) {
        const other = byId.get(gesture.hover.node)!;
        to = this.portPoint(other, gesture.side === "out" ? "in" : "out", gesture.hover.port);
        tone = gesture.verdicts.get(`${gesture.hover.node}:${gesture.hover.port}`) ? "error" : "ok";
      }
      const [a, b] = gesture.side === "out" ? [from, to] : [to, from];
      preview = svg`<path class="dag-edge-preview" data-tone=${tone} d=${this.curve(a, b)} marker-end=${`url(#dag-arrow-${tone})`}></path>`;
    }
    return html`<svg
      class="dag-edges"
      style=${`left:${x}px;top:${y}px;width:${w}px;height:${h}px`}
      viewBox=${`${x} ${y} ${w} ${h}`}
      aria-hidden="true"
    >
      <defs>
        ${["base", "active", "ok", "error", "info"].map(
          (tone) => svg`<marker id=${`dag-arrow-${tone}`} class="dag-arrow" data-tone=${tone} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z"></path></marker>`,
        )}
      </defs>
      ${repeat(
        this.edges,
        (edge) => edge.id,
        (edge) => {
          const s = byId.get(edge.source);
          const t = byId.get(edge.target);
          if (!s || !t) return nothing;
          const d = this.curve(this.portPoint(s, "out", edge.sourcePort), this.portPoint(t, "in", edge.targetPort));
          const selected = selectedEdges.has(edge.id);
          const near = related.has(edge.id);
          return svg`<g class="dag-edge" data-selected=${selected} data-related=${near}>
            <path class="dag-edge-hit" data-edge=${edge.id} d=${d}></path>
            <path class="dag-edge-line" d=${d} marker-end=${`url(#dag-arrow-${selected || near ? "active" : "base"})`}></path>
          </g>`;
        },
      )}
      ${preview}
    </svg>`;
  }

  private renderNode(node: DagNode, related: Set<string>) {
    const gesture = this.gesture;
    const selected = this.selection.nodes.includes(node.id);
    const { w, h } = this.sizeOf(node);
    const ins = inputsOf(node);
    const outs = outputsOf(node);
    const labeled = this.labeled(node);
    const incoming = this.edges.filter((edge) => edge.target === node.id).length;
    const outgoing = this.edges.filter((edge) => edge.source === node.id).length;
    let candidate = "";
    if (gesture?.kind === "connect" && gesture.node !== node.id) {
      const ports = gesture.side === "out" ? ins : outs;
      candidate = ports.some((port) => gesture.verdicts.get(`${node.id}:${port.id}`) === "") ? "valid" : "invalid";
    }
    const port = (p: DagPort, side: Side) => {
      const at = this.portOffset(node, side, p.id);
      let state = "";
      if (gesture?.kind === "connect") {
        if (gesture.node === node.id && gesture.port === p.id && gesture.side === side) state = "origin";
        else if (side !== gesture.side && gesture.node !== node.id)
          state = gesture.verdicts.get(`${node.id}:${p.id}`) ? "invalid" : "valid";
        if (gesture.hover?.node === node.id && gesture.hover.port === p.id && side !== gesture.side) state += " hover";
      }
      const used = this.edges.some((edge) =>
        side === "in" ? edge.target === node.id && edge.targetPort === p.id : edge.source === node.id && edge.sourcePort === p.id,
      );
      const name = p.label ?? (side === "in" ? "Ingresso" : "Uscita");
      return html`<span
        class="dag-port"
        aria-hidden="true"
        data-side=${side}
        data-port=${p.id}
        data-state=${state}
        data-used=${used}
        data-tip=${p.type ? `${name} · ${p.type}` : name}
        style=${`left:${at.x}px;top:${at.y}px`}
      ></span>`;
    };
    const rowLabel = (p: DagPort, side: Side) => {
      const at = this.portOffset(node, side, p.id);
      const edge = at.x === 0 ? `left:14px` : `right:14px`;
      return html`<span class="dag-port-label" data-side=${side} style=${`${edge};top:${at.y}px`}
        >${p.label}${p.type ? html`<em>${p.type}</em>` : nothing}</span
      >`;
    };
    const description = [
      node.description,
      node.badge?.label,
      `${incoming} in ingresso, ${outgoing} in uscita`,
      selected ? "selezionato" : "",
    ]
      .filter(Boolean)
      .join(", ");
    return html`<div
      class="dag-node"
      tabindex="0"
      role="group"
      aria-roledescription="nodo"
      aria-label=${node.label}
      aria-description=${description}
      data-id=${node.id}
      data-selected=${selected}
      data-related=${related.has(node.id)}
      data-candidate=${candidate}
      data-tone=${node.badge?.tone ?? ""}
      style=${`left:${node.x}px;top:${node.y}px;width:${w}px;height:${h}px`}
      @focus=${() => this.onNodeFocus(node.id)}
    >
      <div class="dag-node-head">
        <span class="dag-node-icon">${icon(node.icon ?? boxIcon)}</span>
        <span class="dag-node-text">
          <strong>${node.label}</strong>
          ${node.description ? html`<span>${node.description}</span>` : nothing}
        </span>
        ${node.badge ? html`<span class="dag-badge" data-tone=${node.badge.tone}>${node.badge.label}</span>` : nothing}
      </div>
      ${labeled ? [...ins.filter((p) => p.label).map((p) => rowLabel(p, "in")), ...outs.filter((p) => p.label).map((p) => rowLabel(p, "out"))] : nothing}
      ${ins.map((p) => port(p, "in"))} ${outs.map((p) => port(p, "out"))}
    </div>`;
  }

  private renderMinimap() {
    if (!this.minimap || this.nodes.length < 2 || !this.stageSize.w) return nothing;
    const box = this.bounds(this.nodes);
    const { x, y, k } = this.view;
    const vx = -x / k;
    const vy = -y / k;
    const vw = this.stageSize.w / k;
    const vh = this.stageSize.h / k;
    const x1 = Math.min(box.x, vx);
    const y1 = Math.min(box.y, vy);
    const x2 = Math.max(box.x + box.w, vx + vw);
    const y2 = Math.max(box.y + box.h, vy + vh);
    const pad = 40;
    const viewBox = `${x1 - pad} ${y1 - pad} ${x2 - x1 + pad * 2} ${y2 - y1 + pad * 2}`;
    const selected = new Set(this.selection.nodes);
    const move = (event: PointerEvent) => {
      if (event.type === "pointermove" && !(event.buttons & 1)) return;
      const svgEl = event.currentTarget as SVGSVGElement;
      if (event.type === "pointerdown") svgEl.setPointerCapture(event.pointerId);
      const point = svgEl.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const world = point.matrixTransform(svgEl.getScreenCTM()!.inverse());
      this.view = { ...this.view, x: this.stageSize.w / 2 - world.x * k, y: this.stageSize.h / 2 - world.y * k };
    };
    return html`<div class="dag-minimap">
      <svg viewBox=${viewBox} preserveAspectRatio="xMidYMid meet" @pointerdown=${move} @pointermove=${move} role="img" aria-label="Mappa del grafo: trascina per spostare la vista">
        ${this.nodes.map((node) => {
          const s = this.sizeOf(node);
          return svg`<rect x=${node.x} y=${node.y} width=${s.w} height=${s.h} rx="14" data-selected=${selected.has(node.id)} data-tone=${node.badge?.tone ?? ""}></rect>`;
        })}
        <rect class="dag-minimap-view" x=${vx} y=${vy} width=${vw} height=${vh}></rect>
      </svg>
    </div>`;
  }

  private renderToolbar() {
    const [past, future] = this.historyLength;
    const button = (label: string, tip: string, raw: string, action: () => void, disabled = false) =>
      html`<bolle-tooltip label=${tip}
        ><bolle-icon-button variant="standard" size="small" label=${label} ?disabled=${disabled} @click=${action}
          >${icon(raw)}</bolle-icon-button
        ></bolle-tooltip
      >`;
    return html`<div class="dag-toolbar" role="toolbar" aria-label="Comandi del grafo">
      ${this.readonly
        ? nothing
        : html`${button("Annulla", "Annulla · Ctrl+Z", undoIcon, () => this.undo(), !past)}
            ${button("Ripeti", "Ripeti · Ctrl+Y", redoIcon, () => this.redo(), !future)}
            <span class="dag-toolbar-sep"></span>`}
      ${button("Riduci", "Riduci · −", zoomOut, () => this.zoomTo(this.view.k / 1.2), this.view.k <= MIN_ZOOM)}
      <bolle-tooltip label="Dimensione reale · 1"
        ><button type="button" class="dag-zoom" @click=${() => this.zoomTo(1)} aria-label="Zoom al 100%">
          ${Math.round(this.view.k * 100)}%
        </button></bolle-tooltip
      >
      ${button("Ingrandisci", "Ingrandisci · +", zoomIn, () => this.zoomTo(this.view.k * 1.2), this.view.k >= MAX_ZOOM)}
      ${button("Adatta alla vista", "Adatta alla vista · 0", fitIcon, () => this.fitView(), !this.nodes.length)}
      ${this.readonly
        ? nothing
        : html`<span class="dag-toolbar-sep"></span>
            ${button("Disponi automaticamente", "Disponi per livelli", layoutIcon, () => this.autoLayout(), this.nodes.length < 2)}`}
      <span class="dag-toolbar-sep"></span>
      ${button("Scorciatoie da tastiera", "Scorciatoie da tastiera", keyboardIcon, () =>
        this.querySelector<BolleSideSheet>("#dag-keys")?.show(),
      )}
    </div>`;
  }

  private renderState() {
    if (this.loading)
      return html`<div class="dag-state" data-kind="loading">
        <div class="dag-skeleton" aria-hidden="true">
          ${[0, 1, 2, 3, 4, 5].map((i) => html`<span style=${`--i:${i}`}></span>`)}
        </div>
        <bolle-loading-indicator label="Caricamento del grafo"></bolle-loading-indicator>
        <p>Caricamento del grafo…</p>
      </div>`;
    if (this.error)
      return html`<div class="dag-state" data-kind="error">
        <bolle-empty-state tone="error" role="alert" title="Grafo non disponibile" .text=${this.error} .icon=${icon(alertIcon)}>
          <bolle-button slot="actions" variant="filled" @click=${() => this.emit("dag-retry", {})}>Riprova</bolle-button>
        </bolle-empty-state>
      </div>`;
    if (!this.nodes.length)
      return html`<div class="dag-state" data-kind="empty">
        <bolle-empty-state
          title=${this.readonly ? "Nessun nodo da mostrare" : "Il grafo è vuoto"}
          .text=${this.readonly
            ? "Quando il grafo conterrà dei nodi, compariranno qui."
            : this.kinds.length
              ? "Trascina un tipo di nodo dalla tavolozza, oppure fai doppio clic sul canvas."
              : "Nessun tipo di nodo è disponibile per questo grafo."}
          .icon=${icon(emptyIcon)}
        >
          ${!this.readonly && this.kinds.length
            ? html`<bolle-button
                slot="actions"
                variant="filled"
                @click=${(event: MouseEvent) => {
                  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
                  this.openMenu(
                    { kind: "canvas", at: { x: (this.stageSize.w / 2 - this.view.x) / this.view.k, y: (this.stageSize.h / 2 - this.view.y) / this.view.k } },
                    rect.left,
                    rect.bottom + 4,
                    true,
                  );
                }}
                >Aggiungi un nodo</bolle-button
              >`
            : nothing}
        </bolle-empty-state>
      </div>`;
    return nothing;
  }

  private renderKeys() {
    const rows: [string, string][] = [
      ["Tab, Maiusc+Tab", "Nodo successivo o precedente, in ordine topologico"],
      ["Alt + frecce", "Nodo più vicino in quella direzione"],
      ["Frecce", "Sposta i nodi selezionati; sul fondo sposta la vista"],
      ["Maiusc + frecce", "Spostamento ampio"],
      ["Spazio", "Aggiungi o togli il nodo dalla selezione"],
      ["Invio", "Proprietà del nodo"],
      ["Maiusc+F10, Menu", "Azioni: collega, ricevi, scollega, duplica, elimina"],
      ["Canc, Backspace", "Elimina la selezione"],
      ["Ctrl+D", "Duplica la selezione"],
      ["Ctrl+A", "Seleziona tutto"],
      ["Ctrl+Z, Ctrl+Y", "Annulla e ripeti"],
      ["+, −, 1, 0", "Ingrandisci, riduci, 100%, adatta"],
      ["Esc", "Annulla il collegamento o la selezione"],
      ["Maiusc + trascina", "Selezione rettangolare"],
      ["Ctrl + rotella", "Zoom sul puntatore"],
    ];
    return html`<bolle-side-sheet id="dag-keys" label="Scorciatoie da tastiera" close-label="Chiudi">
      <dl class="dag-keys">
        ${rows.map(([keys, what]) => html`<div><dt>${keys.split(", ").map((k) => html`<kbd>${k}</kbd>`)}</dt><dd>${what}</dd></div>`)}
      </dl>
    </bolle-side-sheet>`;
  }

  protected render() {
    const busy = this.loading || !!this.error;
    const related = new Set<string>();
    const chosen = new Set(this.selection.nodes);
    for (const edge of this.edges)
      if (chosen.has(edge.source) || chosen.has(edge.target)) {
        related.add(edge.id);
        related.add(chosen.has(edge.source) ? edge.target : edge.source);
      }
    for (const id of this.selection.edges) {
      const edge = this.edges.find((item) => item.id === id);
      if (edge) related.add(edge.source).add(edge.target);
    }
    const order = topologicalOrder(this.graph);
    const byId = new Map(this.nodes.map((node) => [node.id, node]));
    const ordered = [...order.map((id) => byId.get(id)!), ...this.nodes.filter((node) => !order.includes(node.id))];
    const gesture = this.gesture;
    const { x, y, k } = this.view;
    const marquee =
      gesture?.kind === "marquee" && this.canvas
        ? (() => {
            const rect = this.canvas!.getBoundingClientRect();
            return `left:${Math.min(gesture.startX, gesture.x) - rect.left}px;top:${Math.min(gesture.startY, gesture.y) - rect.top}px;width:${Math.abs(gesture.x - gesture.startX)}px;height:${Math.abs(gesture.y - gesture.startY)}px`;
          })()
        : "";
    const grid = 16 * k * 2 ** Math.max(0, Math.ceil(Math.log2(10 / (16 * k))));
    return html`<div
      class="dag"
      data-orientation=${this.orientation}
      data-readonly=${this.readonly}
      data-gesture=${gesture?.kind ?? ""}
      data-palette=${this.kinds.length ? (this.paletteOpen ? "open" : "closed") : "none"}
      @keydown=${this.onKeyDown}
    >
      ${this.renderPalette()}
      <div class="dag-stage">
        <div
          class="dag-canvas"
          tabindex="0"
          role="application"
          aria-roledescription="editor di grafo"
          aria-label=${this.label}
          aria-description=${`${this.nodes.length} nodi, ${this.edges.length} collegamenti.${this.readonly ? " Sola lettura." : ""} Maiusc+F10 per le azioni, Tab per i nodi.`}
          aria-busy=${busy}
          style=${`--grid:${grid}px;background-position:${x}px ${y}px`}
          @pointerdown=${this.onPointerDown}
          @pointermove=${this.onPointerMove}
          @pointerup=${this.onPointerUp}
          @pointercancel=${this.onPointerUp}
          @wheel=${this.onWheel}
          @dblclick=${this.onDoubleClick}
          @contextmenu=${this.onContextMenu}
        >
          ${busy
            ? nothing
            : html`<div class="dag-world" style=${`transform:translate(${x}px,${y}px) scale(${k})`}>
                ${this.renderEdges(related)}
                ${repeat(ordered, (node) => node.id, (node) => this.renderNode(node, related))}
              </div>`}
          ${marquee ? html`<div class="dag-marquee" style=${marquee}></div>` : nothing}
        </div>
        ${this.renderState()}
        ${busy ? nothing : html`${this.renderToolbar()} ${this.renderMinimap()}`}
        ${this.readonly && !busy ? html`<span class="dag-readonly">${icon(lockIcon)} Sola lettura</span>` : nothing}
      </div>
      ${this.note
        ? html`<div class="dag-note" data-tone=${this.note.tone} style=${`left:${this.note.x + 16}px;top:${this.note.y + 18}px`} role="presentation">
            ${this.note.text}
          </div>`
        : nothing}
      ${this.ghost
        ? html`<div class="dag-ghost" data-over=${this.ghost.over} style=${`left:${this.ghost.x}px;top:${this.ghost.y}px`}>
            <span class="dag-node-icon">${icon(this.ghost.kind.icon ?? boxIcon)}</span>
            <strong>${this.ghost.kind.label}</strong>
          </div>`
        : nothing}
      <bolle-menu menu-label="Azioni" @menu-select=${this.onMenuSelect}></bolle-menu>
      <bolle-snackbar close-label="Chiudi" @action=${() => this.undo()}></bolle-snackbar>
      ${this.renderKeys()}
      <p class="dag-sr" role="status" aria-live="polite">${this.announcement}</p>
    </div>`;
  }
}

customElements.define("proto-dag-editor", ProtoDagEditor);

declare global {
  interface HTMLElementTagNameMap {
    "proto-dag-editor": ProtoDagEditor;
  }
}
