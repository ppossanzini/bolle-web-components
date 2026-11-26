import { html, nothing, svg, type PropertyValues } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { dagStyles } from "./dag.styles.js";
import { dagLabels, type DagLabels } from "./localization.js";
import {
  alertIcon,
  boxIcon,
  fitViewIcon,
  graphIcon,
  keyboardIcon,
  layoutIcon,
  lockIcon,
  redoIcon,
  sidebarCollapseIcon,
  sidebarExpandIcon,
  undoIcon,
  zoomInIcon,
  zoomOutIcon,
} from "./icons.js";
import type { BolleMenu } from "./menu.js";
import type { BolleSideSheet } from "./overlays.js";
import type { BolleSnackbar } from "./overlays.js";
import type { MenuAction, MenuEntry, MenuSelectDetail } from "./menu.types.js";

export type DagTone = "neutral" | "primary" | "success" | "warning" | "error";
export type DagOrientation = "horizontal" | "vertical";

export interface DagPort {
  id: string;
  /** Visible name; a port without a label is drawn as a dot only. */
  label?: string;
  /** Data type; the type check applies only when both ports declare one. */
  type?: string;
  /** Maximum number of links on the port. Unlimited when omitted. */
  max?: number;
}

export interface DagNode {
  id: string;
  label: string;
  description?: string;
  /** Key of the `DagNodeKind` the node was created from. */
  kind?: string;
  icon?: unknown;
  badge?: { label: string; tone: DagTone };
  x: number;
  y: number;
  /** Omitted: one generic input. Empty: the node receives no links. */
  inputs?: DagPort[];
  /** Omitted: one generic output. Empty: the node sends no links. */
  outputs?: DagPort[];
  data?: Record<string, unknown>;
}

export interface DagEdge {
  id: string;
  source: string;
  sourcePort: string;
  target: string;
  targetPort: string;
}

export interface DagNodeKind {
  kind: string;
  label: string;
  description?: string;
  icon?: unknown;
  /** Heading of the palette section and of the add menu. */
  group?: string;
  inputs?: DagPort[];
  outputs?: DagPort[];
}

export interface DagGraph {
  nodes: DagNode[];
  edges: DagEdge[];
}

export interface DagConnection {
  source: DagNode;
  sourcePort: DagPort;
  target: DagNode;
  targetPort: DagPort;
  graph: DagGraph;
}

/** `true` allows; a string refuses and becomes the reason shown to the user. */
export type DagVerdict = true | string;

/**
 * Rules of the application. Without them the editor is free: only the structural
 * rules of a DAG stay — no loop, no link to the node itself, no duplicate link.
 */
export interface DagConstraints {
  typeCompatible?: (outputType: string, inputType: string) => boolean;
  maxIncoming?: number;
  maxOutgoing?: number;
  maxNodes?: number;
  canConnect?: (connection: DagConnection) => DagVerdict;
  canAdd?: (kind: DagNodeKind, graph: DagGraph) => DagVerdict;
  canDelete?: (node: DagNode, graph: DagGraph) => DagVerdict;
  canDeleteEdge?: (edge: DagEdge, graph: DagGraph) => DagVerdict;
}

export interface DagPosition {
  id: string;
  x: number;
  y: number;
}

export interface DagAddRequest {
  node: DagNode;
  /** Present when the node is added by releasing a link on empty space. */
  edge?: DagEdge;
}
export interface DagConnectRequest {
  edge: DagEdge;
}
export interface DagMoveRequest {
  positions: DagPosition[];
}
export interface DagDuplicateRequest {
  nodes: DagNode[];
  edges: DagEdge[];
}
export interface DagDeleteRequest {
  nodes: string[];
  /** Links removed, including those attached to the deleted nodes. */
  edges: string[];
}

/**
 * Replaces the default behaviour of an operation. The function receives the
 * request and `apply`, which performs the default change; when `apply` is not
 * called the graph stays as it is.
 */
export interface DagOverrides {
  add: (request: DagAddRequest, apply: () => void) => void;
  connect: (request: DagConnectRequest, apply: () => void) => void;
  move: (request: DagMoveRequest, apply: () => void) => void;
  arrange: (request: DagMoveRequest, apply: () => void) => void;
  duplicate: (request: DagDuplicateRequest, apply: () => void) => void;
  delete: (request: DagDeleteRequest, apply: () => void) => void;
}

export type DagChangeCause =
  | "add"
  | "connect"
  | "move"
  | "arrange"
  | "duplicate"
  | "delete"
  | "undo"
  | "redo";

export interface DagChangeDetail extends DagGraph {
  cause: DagChangeCause;
}
export interface DagSelectionDetail {
  nodes: string[];
  edges: string[];
}
export interface DagRejectedDetail {
  source: string;
  sourcePort: string;
  target: string;
  targetPort: string;
  reason: string;
}
export interface DagNodeDetail {
  node: DagNode;
}

type Side = "in" | "out";
type Point = { x: number; y: number };
type PortRef = { node: string; port: string; side: Side };
interface View {
  x: number;
  y: number;
  k: number;
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

const NODE_W = 232;
const NODE_H = 64;
const HEAD_H = 60;
const ROW_H = 24;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;
const READABLE_ZOOM = 0.55;
const HISTORY = 100;
const GENERIC_IN: DagPort = { id: "in" };
const GENERIC_OUT: DagPort = { id: "out" };
const INTERACTIVE = "button, a[href], input, select, textarea, [contenteditable], [tabindex]";

const inputsOf = (node: DagNode) => node.inputs ?? [GENERIC_IN];
const outputsOf = (node: DagNode) => node.outputs ?? [GENERIC_OUT];

const fill = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );

let sequence = 0;
const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${(sequence++).toString(36)}`;

function successors(graph: DagGraph) {
  const map = new Map<string, string[]>(graph.nodes.map((node) => [node.id, []]));
  for (const edge of graph.edges) map.get(edge.source)?.push(edge.target);
  return map;
}

function predecessors(graph: DagGraph) {
  const map = new Map<string, string[]>(graph.nodes.map((node) => [node.id, []]));
  for (const edge of graph.edges) map.get(edge.target)?.push(edge.source);
  return map;
}

/** Nodes reachable from `start` along `next`, `start` excluded. */
function reach(start: string, next: Map<string, string[]>) {
  const seen = new Set<string>();
  const stack = [...(next.get(start) ?? [])];
  while (stack.length) {
    const id = stack.pop()!;
    if (seen.has(id)) continue;
    seen.add(id);
    stack.push(...(next.get(id) ?? []));
  }
  return seen;
}

/** Shortest path from `from` to `to`, both included; empty when there is none. */
function pathBetween(from: string, to: string, next: Map<string, string[]>) {
  const parent = new Map<string, string>([[from, ""]]);
  const queue = [from];
  while (queue.length) {
    const id = queue.shift()!;
    if (id === to) {
      const path = [id];
      let step = parent.get(id)!;
      while (step) {
        path.unshift(step);
        step = parent.get(step)!;
      }
      return path;
    }
    for (const child of next.get(id) ?? [])
      if (!parent.has(child)) {
        parent.set(child, id);
        queue.push(child);
      }
  }
  return [];
}

function topologicalOrder(graph: DagGraph) {
  const indegree = new Map(graph.nodes.map((node) => [node.id, 0]));
  for (const edge of graph.edges)
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
  const next = successors(graph);
  const queue = graph.nodes.filter((node) => !indegree.get(node.id)).map((node) => node.id);
  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    for (const child of next.get(id) ?? []) {
      const left = indegree.get(child)! - 1;
      indegree.set(child, left);
      if (!left) queue.push(child);
    }
  }
  return order;
}

/**
 * Layered layout: rank by longest path, order by barycentre over several sweeps,
 * then align every layer on its predecessors without overlaps.
 */
function layeredLayout(
  graph: DagGraph,
  sizeOf: (node: DagNode) => { w: number; h: number },
  horizontal: boolean,
  reverse: boolean,
) {
  const gapMain = 96;
  const gapCross = 28;
  const prev = predecessors(graph);
  const next = successors(graph);
  const order = topologicalOrder(graph);
  const rank = new Map<string, number>();
  for (const id of order)
    rank.set(id, Math.max(-1, ...(prev.get(id) ?? []).map((p) => rank.get(p) ?? 0)) + 1);
  const placedIds = new Set(order);
  const layers: string[][] = [];
  for (const id of [...order, ...graph.nodes.map((n) => n.id).filter((id) => !placedIds.has(id))])
    (layers[rank.get(id) ?? 0] ??= []).push(id);
  const index = new Map<string, number>();
  const reindex = () => layers.forEach((layer) => layer.forEach((id, i) => index.set(id, i)));
  reindex();
  const sweep = (layer: string[], near: Map<string, string[]>) => {
    const score = new Map(
      layer.map((id) => {
        const list = near.get(id) ?? [];
        return [
          id,
          list.length ? list.reduce((sum, n) => sum + index.get(n)!, 0) / list.length : index.get(id)!,
        ];
      }),
    );
    layer.sort((a, b) => score.get(a)! - score.get(b)!);
  };
  for (let pass = 0; pass < 6; pass++) {
    if (pass % 2 === 0) for (let r = 1; r < layers.length; r++) sweep(layers[r], prev);
    else for (let r = layers.length - 2; r >= 0; r--) sweep(layers[r], next);
    reindex();
  }
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  const cross = (node: DagNode) => (horizontal ? sizeOf(node).h : sizeOf(node).w);
  const main = (node: DagNode) => (horizontal ? sizeOf(node).w : sizeOf(node).h);
  const center = new Map<string, number>();
  for (const layer of layers) {
    const sizes = layer.map((id) => cross(byId.get(id)!));
    const wanted: number[] = [];
    layer.forEach((id, i) => {
      const near = (prev.get(id) ?? []).filter((p) => center.has(p));
      wanted[i] = near.length
        ? near.reduce((sum, p) => sum + center.get(p)!, 0) / near.length
        : i
          ? wanted[i - 1] + (sizes[i - 1] + sizes[i]) / 2 + gapCross
          : 0;
    });
    const placed: number[] = [];
    layer.forEach((_, i) => {
      placed[i] = i
        ? Math.max(wanted[i], placed[i - 1] + (sizes[i - 1] + sizes[i]) / 2 + gapCross)
        : wanted[i];
    });
    // The mean shift keeps the layer on its predecessors instead of drifting.
    const shift = placed.reduce((sum, value, i) => sum + (wanted[i] - value), 0) / layer.length;
    layer.forEach((id, i) => center.set(id, placed[i] + shift));
  }
  const positions: DagPosition[] = [];
  let offset = 0;
  for (const layer of layers) {
    const depth = Math.max(...layer.map((id) => main(byId.get(id)!)));
    for (const id of layer) {
      const node = byId.get(id)!;
      const along = reverse ? -offset - main(node) : offset;
      const across = Math.round(center.get(id)! - cross(node) / 2);
      positions.push(horizontal ? { id, x: along, y: across } : { id, x: across, y: along });
    }
    offset += depth + gapMain;
  }
  return positions;
}

/**
 * Editor of a directed acyclic graph. Nodes, ports and links are declared by the
 * application; the editor applies a change to its own `nodes` and `edges` and
 * reports it with `dag-change`. Constraints decide what may be linked, added or
 * deleted, and `overrides` replace the default behaviour of an operation.
 */
export class BolleDag extends BolleElement {
  static properties = {
    label: {},
    nodes: { attribute: false },
    edges: { attribute: false },
    kinds: { attribute: false },
    constraints: { attribute: false },
    overrides: { attribute: false },
    readonly: { type: Boolean, reflect: true },
    orientation: { reflect: true },
    loading: { type: Boolean, reflect: true },
    error: {},
    minimap: { attribute: false },
    snap: { type: Number },
    labels: { attribute: false },
    _paletteOpen: { state: true },
    _paletteQuery: { state: true },
    _view: { state: true },
    _selection: { state: true },
    _gesture: { state: true },
    _note: { state: true },
    _ghost: { state: true },
    _announcement: { state: true },
    _history: { state: true },
    _measured: { state: true },
  };
  static styles = [commonStyles, dagStyles];

  /** Accessible name of the editor. */
  label = "";
  nodes: DagNode[] = [];
  edges: DagEdge[] = [];
  /** Node types offered by the palette and by the add menus. */
  kinds: DagNodeKind[] = [];
  constraints: DagConstraints = {};
  /** Replaces the default behaviour of the operations it names. */
  overrides: Partial<DagOverrides> = {};
  /** Selection, zoom, view movement and keyboard stay; every change is refused. */
  readonly = false;
  orientation: DagOrientation = "horizontal";
  loading = false;
  /** Text shown instead of the graph when it cannot be loaded. */
  error = "";
  /** Shows the map of the graph in the bottom corner. */
  minimap = true;
  /** Grid step for moved and added nodes; 0 turns the snap off. */
  snap = 8;
  /** Replaces the built-in texts. */
  labels: Partial<DagLabels> = {};

  declare _paletteOpen: boolean;
  declare _paletteQuery: string;
  declare _view: View;
  declare _selection: DagSelectionDetail;
  declare _gesture: Gesture | undefined;
  declare _note: { text: string; tone: "info" | "ok" | "error"; x: number; y: number } | undefined;
  declare _ghost: { kind: DagNodeKind; x: number; y: number; over: boolean } | undefined;
  declare _announcement: string;
  declare _history: [number, number];
  declare _measured: Map<string, number>;

  private past: DagGraph[] = [];
  private future: DagGraph[] = [];
  private menuContext?: MenuContext;
  private stageSize = { w: 0, h: 0 };
  /** Nodes of the previous document; `null` once the view has been fitted. */
  private fitAfter: DagNode[] | null | undefined = undefined;
  private stageObserver?: ResizeObserver;
  private nodeObserver?: ResizeObserver;
  private observedNodes = new WeakSet<Element>();
  private sized = false;

  constructor() {
    super();
    this._paletteOpen = true;
    this._paletteQuery = "";
    this._view = { x: 0, y: 0, k: 1 };
    this._selection = { nodes: [], edges: [] };
    this._announcement = "";
    this._history = [0, 0];
    this._measured = new Map();
  }

  private get text(): DagLabels {
    return dagLabels(document.documentElement.lang, this.labels);
  }

  connectedCallback() {
    super.connectedCallback();
    this.stageObserver = new ResizeObserver(() => {
      const canvas = this.canvas;
      if (!canvas) return;
      // Below 760px the palette overlays the canvas: at the first real size it starts closed.
      if (!this.sized && this.clientWidth) {
        this.sized = true;
        if (this.clientWidth < 760) this._paletteOpen = false;
      }
      this.stageSize = { w: canvas.clientWidth, h: canvas.clientHeight };
      if (this.shouldFit()) this.fitView(true);
      this.requestUpdate();
    });
    this.nodeObserver = new ResizeObserver((entries) => {
      let changed = false;
      const measured = new Map(this._measured);
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const id = element.dataset.id!;
        if (measured.get(id) !== element.offsetHeight) {
          measured.set(id, element.offsetHeight);
          changed = true;
        }
      }
      if (changed) this._measured = measured;
    });
  }

  disconnectedCallback() {
    this.stageObserver?.disconnect();
    this.nodeObserver?.disconnect();
    this.stageObserver = undefined;
    this.nodeObserver = undefined;
    this.observedNodes = new WeakSet();
    super.disconnectedCallback();
  }

  protected updated(changed: PropertyValues) {
    if (changed.has("nodes") || changed.has("edges")) {
      const ids = new Set(this.nodes.map((node) => node.id));
      const edgeIds = new Set(this.edges.map((edge) => edge.id));
      const nodes = this._selection.nodes.filter((id) => ids.has(id));
      const edges = this._selection.edges.filter((id) => edgeIds.has(id));
      if (nodes.length !== this._selection.nodes.length || edges.length !== this._selection.edges.length)
        this.select({ nodes, edges });
    }
    const canvas = this.canvas;
    if (canvas && this.stageObserver && !this.observedNodes.has(canvas)) {
      this.observedNodes.add(canvas);
      this.stageObserver.observe(canvas);
    }
    for (const element of this.renderRoot.querySelectorAll(".node"))
      if (!this.observedNodes.has(element)) {
        this.observedNodes.add(element);
        this.nodeObserver?.observe(element);
      }
    if (this.shouldFit()) this.fitView(true);
  }

  /* Public API ------------------------------------------------------------ */

  get graph(): DagGraph {
    return { nodes: this.nodes, edges: this.edges };
  }

  /**
   * Fits the view to the nodes. With `readable` the zoom does not drop below a
   * readable value and, when the graph does not fit, the view starts from the sources.
   */
  fitView(readable = false) {
    const { w, h } = this.stageSize;
    if (!w || !this.nodes.length) {
      this._view = { x: w / 2, y: h / 2, k: 1 };
      return;
    }
    const box = this.bounds(this.nodes);
    const pad = 56;
    const fit = Math.min((w - pad * 2) / box.w, (h - pad * 2) / box.h);
    const k = Math.min(MAX_ZOOM * 0.6, Math.max(readable ? READABLE_ZOOM : MIN_ZOOM, fit));
    const x = (w - box.w * k) / 2 - box.x * k;
    const y = (h - box.h * k) / 2 - box.y * k;
    if (k <= fit) {
      this._view = { k, x, y };
      return;
    }
    const horizontal = this.orientation === "horizontal";
    const start = this.flip ? w - pad - (box.x + box.w) * k : pad - box.x * k;
    const targets = new Set(this.edges.map((edge) => edge.target));
    const sources = this.bounds(this.nodes.filter((node) => !targets.has(node.id)));
    const across = horizontal
      ? h / 2 - (sources.y + sources.h / 2) * k
      : w / 2 - (sources.x + sources.w / 2) * k;
    this._view = {
      k,
      x: horizontal ? start : box.w * k > w ? across : x,
      y: horizontal ? (box.h * k > h ? across : y) : pad - box.y * k,
    };
  }

  zoomTo(k: number, around = { x: this.stageSize.w / 2, y: this.stageSize.h / 2 }) {
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, k));
    const { x, y, k: prev } = this._view;
    this._view = {
      k: next,
      x: around.x - ((around.x - x) / prev) * next,
      y: around.y - ((around.y - y) / prev) * next,
    };
  }

  /** Arranges the nodes by levels, from the sources to the sinks. */
  autoLayout() {
    if (this.readonly || !this.nodes.length) return;
    const positions = layeredLayout(
      this.graph,
      (node) => this.sizeOf(node),
      this.orientation === "horizontal",
      this.flip,
    );
    this.run("arrange", { positions }, this.withPositions(positions), "arrange", () => {
      this.fitView(true);
      this.say(this.text.arranged);
    });
  }

  topologicalOrder() {
    return topologicalOrder(this.graph);
  }

  /** Checks a link without creating it, so the application can explain a constraint. */
  canConnect(source: string, sourcePort: string, target: string, targetPort: string): DagVerdict {
    return this.verdict(source, sourcePort, target, targetPort) || true;
  }

  undo() {
    const previous = this.past.pop();
    if (!previous) return;
    this.future.push(this.graph);
    this.apply(previous, "undo");
    this.say(this.text.undone);
  }

  redo() {
    const next = this.future.pop();
    if (!next) return;
    this.past.push(this.graph);
    this.apply(next, "redo");
    this.say(this.text.redone);
  }

  /**
   * New document: clears the history and fits the view to the next graph the
   * application assigns to `nodes`.
   */
  clearHistory() {
    this.past = [];
    this.future = [];
    this.fitAfter = this.nodes;
    this._history = [0, 0];
  }

  /* Geometry -------------------------------------------------------------- */

  private get canvas() {
    return this.renderRoot?.querySelector<HTMLElement>(".canvas") ?? null;
  }

  private get flip() {
    return this.orientation === "horizontal" && getComputedStyle(this).direction === "rtl";
  }

  /** The view fits once per document, when new nodes arrive. */
  private shouldFit() {
    if (
      this.fitAfter === null ||
      this.nodes === this.fitAfter ||
      !this.nodes.length ||
      !this.stageSize.w
    )
      return false;
    this.fitAfter = null;
    return true;
  }

  /** In horizontal orientation labelled ports become rows of the node; in vertical they stay dots. */
  private labelled(node: DagNode) {
    return (
      this.orientation === "horizontal" &&
      [...inputsOf(node), ...outputsOf(node)].some((port) => port.label)
    );
  }

  private baseHeight(node: DagNode) {
    if (!this.labelled(node)) return NODE_H;
    return HEAD_H + Math.max(inputsOf(node).length, outputsOf(node).length) * ROW_H + 10;
  }

  private sizeOf(node: DagNode) {
    return { w: NODE_W, h: Math.max(this.baseHeight(node), this._measured.get(node.id) ?? 0) };
  }

  private portOffset(node: DagNode, side: Side, portId: string) {
    const ports = side === "in" ? inputsOf(node) : outputsOf(node);
    const i = Math.max(0, ports.findIndex((port) => port.id === portId));
    const { w, h } = this.sizeOf(node);
    if (this.orientation === "vertical")
      return { x: (w * (i + 1)) / (ports.length + 1), y: side === "in" ? 0 : h };
    const y = this.labelled(node)
      ? HEAD_H + i * ROW_H + ROW_H / 2
      : (h * (i + 1)) / (ports.length + 1);
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
      x: (clientX - rect.left - this._view.x) / this._view.k,
      y: (clientY - rect.top - this._view.y) / this._view.k,
    };
  }

  /**
   * Bezier between two ports. The control arm is half the gap when the target lies
   * ahead; when it lies behind, the arm grows with the square root of the gap, so the
   * link bends around softly instead of folding over the node.
   */
  private curve(a: { x: number; y: number }, b: { x: number; y: number }) {
    const arm = (gap: number) => (gap >= 0 ? Math.max(24, gap / 2) : 24 + 6.25 * Math.sqrt(-gap));
    if (this.orientation === "vertical") {
      const end = b.y - 6;
      const d = arm(end - a.y);
      return `M${a.x},${a.y} C${a.x},${a.y + d} ${b.x},${end - d} ${b.x},${end}`;
    }
    const dir = this.flip ? -1 : 1;
    const end = b.x - dir * 6;
    const d = arm((end - a.x) * dir);
    return `M${a.x},${a.y} C${a.x + dir * d},${a.y} ${end - dir * d},${b.y} ${end},${b.y}`;
  }

  private snapTo(value: number) {
    return this.snap > 0 ? Math.round(value / this.snap) * this.snap : value;
  }

  /** The shadow element an event or a hit belongs to, climbing out of slotted content. */
  private lift(element: Element | null): HTMLElement | null {
    let current = element;
    while (current && current.getRootNode() !== this.renderRoot)
      current = (current as HTMLElement).assignedSlot ?? current.parentElement;
    return current as HTMLElement | null;
  }

  private hitAt(clientX: number, clientY: number) {
    return this.lift((this.renderRoot as ShadowRoot).elementFromPoint(clientX, clientY));
  }

  /* Constraints ----------------------------------------------------------- */

  private node(id: string) {
    return this.nodes.find((node) => node.id === id);
  }

  private port(node: DagNode, side: Side, id: string) {
    return (side === "in" ? inputsOf(node) : outputsOf(node)).find((port) => port.id === id);
  }

  /** Reason of the refusal, or an empty string when the link is valid. */
  private check(
    graph: DagGraph,
    source: DagNode,
    sourcePort: DagPort,
    target: DagNode,
    targetPort: DagPort,
    next = successors(graph),
  ): string {
    const text = this.text;
    const constraints = this.constraints;
    if (source.id === target.id) return text.self;
    if (
      graph.edges.some(
        (edge) =>
          edge.source === source.id &&
          edge.target === target.id &&
          edge.sourcePort === sourcePort.id &&
          edge.targetPort === targetPort.id,
      )
    )
      return text.duplicate;
    const back = pathBetween(target.id, source.id, next);
    if (back.length) {
      const names = new Map(graph.nodes.map((node) => [node.id, node.label]));
      const path = [source.id, ...back].map((id) => names.get(id) ?? id);
      const shown = path.length > 5 ? [...path.slice(0, 2), "…", ...path.slice(-2)] : path;
      return fill(text.cycle, { path: shown.join(" → ") });
    }
    if (sourcePort.type && targetPort.type) {
      const compatible = constraints.typeCompatible ?? ((a: string, b: string) => a === b);
      if (!compatible(sourcePort.type, targetPort.type))
        return fill(text.type, { output: sourcePort.type, input: targetPort.type });
    }
    const into = graph.edges.filter((edge) => edge.target === target.id);
    const from = graph.edges.filter((edge) => edge.source === source.id);
    if (
      targetPort.max !== undefined &&
      into.filter((edge) => edge.targetPort === targetPort.id).length >= targetPort.max
    )
      return fill(targetPort.max === 1 ? text.inputFullOne : text.inputFullMany, {
        port: targetPort.label ?? target.label,
        max: targetPort.max,
      });
    if (
      sourcePort.max !== undefined &&
      from.filter((edge) => edge.sourcePort === sourcePort.id).length >= sourcePort.max
    )
      return fill(sourcePort.max === 1 ? text.outputFullOne : text.outputFullMany, {
        port: sourcePort.label ?? source.label,
        max: sourcePort.max,
      });
    if (constraints.maxIncoming !== undefined && into.length >= constraints.maxIncoming)
      return fill(text.nodeInFull, { node: target.label, max: constraints.maxIncoming });
    if (constraints.maxOutgoing !== undefined && from.length >= constraints.maxOutgoing)
      return fill(text.nodeOutFull, { node: source.label, max: constraints.maxOutgoing });
    const verdict =
      constraints.canConnect?.({ source, sourcePort, target, targetPort, graph }) ?? true;
    return verdict === true ? "" : verdict;
  }

  private verdict(
    source: string,
    sourcePort: string,
    target: string,
    targetPort: string,
    next?: Map<string, string[]>,
  ) {
    if (this.readonly) return this.text.readOnly;
    const s = this.node(source);
    const t = this.node(target);
    const sp = s && this.port(s, "out", sourcePort);
    const tp = t && this.port(t, "in", targetPort);
    if (!s || !t || !sp || !tp) return this.text.unknown;
    return this.check(this.graph, s, sp, t, tp, next);
  }

  /** First valid pair of ports between two nodes, or the reason of the first refusal. */
  private bestPair(source: DagNode, target: DagNode, next = successors(this.graph)) {
    const outs = outputsOf(source);
    const ins = inputsOf(target);
    if (!outs.length) return { reason: fill(this.text.noOutputs, { node: source.label }) };
    if (!ins.length) return { reason: fill(this.text.noInputs, { node: target.label }) };
    let reason = "";
    for (const sp of outs)
      for (const tp of ins) {
        const why = this.verdict(source.id, sp.id, target.id, tp.id, next);
        if (!why) return { sourcePort: sp.id, targetPort: tp.id, reason: "" };
        reason ||= why;
      }
    return { reason };
  }

  private addVerdict(kind: DagNodeKind): string {
    if (this.readonly) return this.text.readOnly;
    const max = this.constraints.maxNodes;
    if (max !== undefined && this.nodes.length >= max) return fill(this.text.maxNodes, { max });
    const verdict = this.constraints.canAdd?.(kind, this.graph) ?? true;
    return verdict === true ? "" : verdict;
  }

  private deleteVerdict(node: DagNode): string {
    if (this.readonly) return this.text.readOnly;
    const verdict = this.constraints.canDelete?.(node, this.graph) ?? true;
    return verdict === true ? "" : verdict;
  }

  private edgeDeleteVerdict(edge: DagEdge): string {
    if (this.readonly) return this.text.readOnly;
    const verdict = this.constraints.canDeleteEdge?.(edge, this.graph) ?? true;
    return verdict === true ? "" : verdict;
  }

  /* Changes --------------------------------------------------------------- */

  private say(message: string) {
    this._announcement = "";
    requestAnimationFrame(() => (this._announcement = message));
  }

  private toast(message: string, undoable = false) {
    const bar = this.renderRoot.querySelector<BolleSnackbar>("bolle-snackbar");
    if (!bar) return;
    bar.actionLabel = undoable ? this.text.undo : "";
    bar.show(message);
  }

  private apply(graph: DagGraph, cause: DagChangeCause) {
    this.nodes = graph.nodes;
    this.edges = graph.edges;
    this._history = [this.past.length, this.future.length];
    this.emit<DagChangeDetail>("dag-change", { nodes: graph.nodes, edges: graph.edges, cause });
  }

  private commit(graph: DagGraph, cause: DagChangeCause, snapshot = this.graph) {
    this.past.push(snapshot);
    if (this.past.length > HISTORY) this.past.shift();
    this.future = [];
    this.apply(graph, cause);
  }

  /** Runs an operation through its override, if any; `apply` commits the default change. */
  private run<K extends keyof DagOverrides>(
    operation: K,
    request: Parameters<DagOverrides[K]>[0],
    next: DagGraph,
    cause: DagChangeCause,
    after?: () => void,
    snapshot = this.graph,
  ) {
    const apply = () => {
      this.commit(next, cause, snapshot);
      after?.();
    };
    const override = this.overrides[operation] as
      | ((request: unknown, apply: () => void) => void)
      | undefined;
    if (override) override(request, apply);
    else apply();
  }

  private withPositions(positions: DagPosition[]): DagGraph {
    const map = new Map(positions.map((position) => [position.id, position]));
    return {
      nodes: this.nodes.map((node) => {
        const at = map.get(node.id);
        return at ? { ...node, x: at.x, y: at.y } : node;
      }),
      edges: this.edges,
    };
  }

  private select(selection: DagSelectionDetail) {
    this._selection = selection;
    this.emit<DagSelectionDetail>("dag-selection-change", selection);
  }

  private connect(source: string, sourcePort: string, target: string, targetPort: string) {
    const reason = this.verdict(source, sourcePort, target, targetPort);
    if (reason) {
      this.emit<DagRejectedDetail>("dag-connection-rejected", {
        source,
        sourcePort,
        target,
        targetPort,
        reason,
      });
      this.say(fill(this.text.rejected, { reason }));
      this.toast(reason);
      return;
    }
    const s = this.node(source)!;
    const t = this.node(target)!;
    const edge: DagEdge = { id: uid("e"), source, sourcePort, target, targetPort };
    this.run("connect", { edge }, { nodes: this.nodes, edges: [...this.edges, edge] }, "connect", () => {
      this.select({ nodes: [], edges: [edge.id] });
      this.say(fill(this.text.connected, { source: s.label, target: t.label }));
    });
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

  private addNode(kind: DagNodeKind, at: { x: number; y: number }, focus = false) {
    const reason = this.addVerdict(kind);
    if (reason) {
      this.toast(reason);
      this.say(fill(this.text.notAdded, { reason }));
      return;
    }
    const node = this.createNode(kind, at);
    this.run("add", { node }, { nodes: [...this.nodes, node], edges: this.edges }, "add", () => {
      this.select({ nodes: [node.id], edges: [] });
      this.say(fill(this.text.added, { node: node.label }));
      if (focus) void this.updateComplete.then(() => this.focusNode(node.id));
    });
  }

  private addAndConnect(kind: DagNodeKind, from: PortRef, at: Point) {
    const reason = this.addVerdict(kind);
    if (reason) return this.toast(reason);
    const created = this.createNode(kind, at);
    const origin = this.node(from.node)!;
    const originPort = this.port(origin, from.side, from.port)!;
    const graph = { nodes: [...this.nodes, created], edges: this.edges };
    const next = successors(graph);
    const ports = from.side === "out" ? inputsOf(created) : outputsOf(created);
    const port = ports.find((p) =>
      from.side === "out"
        ? !this.check(graph, origin, originPort, created, p, next)
        : !this.check(graph, created, p, origin, originPort, next),
    );
    if (!port) return;
    const edge: DagEdge =
      from.side === "out"
        ? { id: uid("e"), source: from.node, sourcePort: from.port, target: created.id, targetPort: port.id }
        : { id: uid("e"), source: created.id, sourcePort: port.id, target: from.node, targetPort: from.port };
    this.run(
      "add",
      { node: created, edge },
      { nodes: graph.nodes, edges: [...this.edges, edge] },
      "add",
      () => {
        this.select({ nodes: [created.id], edges: [] });
        this.say(fill(this.text.addedConnected, { node: created.label }));
      },
    );
  }

  private deleteSelection() {
    if (this.readonly) return;
    const blocked: string[] = [];
    const nodeIds = new Set(
      this._selection.nodes.filter((id) => {
        const node = this.node(id);
        const reason = node ? this.deleteVerdict(node) : "";
        if (node && reason) blocked.push(fill(this.text.notDeleted, { node: node.label, reason }));
        return !!node && !reason;
      }),
    );
    const edgeIds = new Set(
      this._selection.edges.filter((id) => {
        const edge = this.edges.find((item) => item.id === id);
        const reason = edge ? this.edgeDeleteVerdict(edge) : "";
        if (reason) blocked.push(reason);
        return !!edge && !reason;
      }),
    );
    if (!nodeIds.size && !edgeIds.size) {
      if (blocked.length) this.toast(blocked[0]);
      return;
    }
    const removed = this.edges.filter(
      (edge) => edgeIds.has(edge.id) || nodeIds.has(edge.source) || nodeIds.has(edge.target),
    );
    const removedIds = new Set(removed.map((edge) => edge.id));
    const next = {
      nodes: this.nodes.filter((node) => !nodeIds.has(node.id)),
      edges: this.edges.filter((edge) => !removedIds.has(edge.id)),
    };
    this.run(
      "delete",
      { nodes: [...nodeIds], edges: [...removedIds] },
      next,
      "delete",
      () => {
        this.select({ nodes: [], edges: [] });
        const message = [
          !nodeIds.size && removed.length === 1
            ? this.text.edgeDeleted
            : fill(this.text.deleted, { nodes: nodeIds.size, edges: removed.length }),
          ...blocked.slice(0, 1),
        ].join(". ");
        this.toast(message, true);
        this.say(message);
        this.canvas?.focus({ preventScroll: true });
      },
    );
  }

  private duplicateSelection() {
    if (this.readonly || !this._selection.nodes.length) return;
    const chosen = this.nodes.filter((node) => this._selection.nodes.includes(node.id));
    const max = this.constraints.maxNodes;
    if (max !== undefined && this.nodes.length + chosen.length > max)
      return this.toast(fill(this.text.maxNodesExceeded, { max }));
    for (const node of chosen) {
      const kind = this.kinds.find((item) => item.kind === node.kind);
      const reason = kind ? this.addVerdict(kind) : "";
      if (reason) return this.toast(fill(this.text.notDuplicated, { node: node.label, reason }));
    }
    const map = new Map(chosen.map((node) => [node.id, uid(node.kind ?? "n")]));
    const copies = chosen.map((node) => ({
      ...node,
      id: map.get(node.id)!,
      label: fill(this.text.copy, { label: node.label }),
      badge: undefined,
      x: node.x + 32,
      y: node.y + 32,
    }));
    const inner = this.edges
      .filter((edge) => map.has(edge.source) && map.has(edge.target))
      .map((edge) => ({
        ...edge,
        id: uid("e"),
        source: map.get(edge.source)!,
        target: map.get(edge.target)!,
      }));
    this.run(
      "duplicate",
      { nodes: copies, edges: inner },
      { nodes: [...this.nodes, ...copies], edges: [...this.edges, ...inner] },
      "duplicate",
      () => {
        this.select({ nodes: copies.map((node) => node.id), edges: [] });
        this.say(fill(this.text.duplicated, { count: copies.length }));
      },
    );
  }

  private nudge(dx: number, dy: number) {
    const ids = new Set(this._selection.nodes);
    if (!ids.size) return;
    const positions = this.nodes
      .filter((node) => ids.has(node.id))
      .map((node) => ({ id: node.id, x: node.x + dx, y: node.y + dy }));
    this.run("move", { positions }, this.withPositions(positions), "move");
  }

  private unlink(edgeId: string) {
    const removed = this.edges.filter((edge) => edge.id !== edgeId);
    this.run("delete", { nodes: [], edges: [edgeId] }, { nodes: this.nodes, edges: removed }, "delete", () =>
      this.toast(this.text.edgeDeleted, true),
    );
  }

  /* Pointer --------------------------------------------------------------- */

  private onPointerDown = (event: PointerEvent) => {
    if (event.button === 2) return;
    const canvas = this.canvas!;
    const path = event.composedPath() as Element[];
    // Interactive content slotted by the application keeps its own clicks.
    const slotted = path.find(
      (element) =>
        element instanceof HTMLElement &&
        element.getRootNode() !== this.renderRoot &&
        this.contains(element) &&
        element.matches(INTERACTIVE),
    );
    const origin = this.lift(path[0] ?? null);
    const portEl = origin?.closest<HTMLElement>(".port");
    const nodeEl = origin?.closest<HTMLElement>(".node");
    const edgeEl = origin?.closest<SVGElement>("[data-edge]");
    const additive = event.shiftKey || event.ctrlKey || event.metaKey;

    if (slotted) {
      if (nodeEl && !this._selection.nodes.includes(nodeEl.dataset.id!))
        this.select({ nodes: [nodeEl.dataset.id!], edges: [] });
      return;
    }
    if (event.button === 1 || (!portEl && !nodeEl && !edgeEl && !event.shiftKey)) {
      event.preventDefault();
      canvas.focus({ preventScroll: true });
      canvas.setPointerCapture(event.pointerId);
      this._gesture = {
        kind: "pan",
        startX: event.clientX,
        startY: event.clientY,
        view: this._view,
        moved: false,
      };
      return;
    }
    if (portEl && nodeEl && !this.readonly) {
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      this.startConnect(nodeEl.dataset.id!, portEl.dataset.port!, portEl.dataset.side as Side, event);
      return;
    }
    if (nodeEl) {
      const id = nodeEl.dataset.id!;
      const selected = this._selection.nodes.includes(id);
      if (additive)
        this.select({
          nodes: selected
            ? this._selection.nodes.filter((item) => item !== id)
            : [...this._selection.nodes, id],
          edges: [],
        });
      else if (!selected) this.select({ nodes: [id], edges: [] });
      if (this.readonly || (additive && selected)) return;
      canvas.setPointerCapture(event.pointerId);
      const ids = new Set(this._selection.nodes);
      this._gesture = {
        kind: "move",
        startX: event.clientX,
        startY: event.clientY,
        origin: new Map(
          this.nodes.filter((node) => ids.has(node.id)).map((node) => [node.id, { x: node.x, y: node.y }]),
        ),
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
          ? { nodes: this._selection.nodes, edges: [...new Set([...this._selection.edges, id])] }
          : { nodes: [], edges: [id] },
      );
      return;
    }
    // Shift + drag on the background: rectangle selection.
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(event.pointerId);
    this._gesture = {
      kind: "marquee",
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      base: this._selection.nodes,
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
    this._gesture = { kind: "connect", node, port, side, x: at.x, y: at.y, verdicts };
    this._note = {
      text: this.kinds.length ? this.text.dropOnPortOrEmpty : this.text.dropOnPort,
      tone: "info",
      x: event.clientX,
      y: event.clientY,
    };
  }

  private onPointerMove = (event: PointerEvent) => {
    const gesture = this._gesture;
    if (!gesture) return;
    if (gesture.kind === "pan") {
      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) gesture.moved = true;
      this._view = { ...gesture.view, x: gesture.view.x + dx, y: gesture.view.y + dy };
      return;
    }
    if (gesture.kind === "move") {
      const dx = (event.clientX - gesture.startX) / this._view.k;
      const dy = (event.clientY - gesture.startY) / this._view.k;
      if (!gesture.moved && Math.abs(dx) + Math.abs(dy) < 3) return;
      gesture.moved = true;
      this.nodes = this.nodes.map((node) => {
        const origin = gesture.origin.get(node.id);
        return origin
          ? { ...node, x: this.snapTo(origin.x + dx), y: this.snapTo(origin.y + dy) }
          : node;
      });
      return;
    }
    if (gesture.kind === "marquee") {
      this._gesture = { ...gesture, x: event.clientX, y: event.clientY };
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
      this._selection = { nodes: [...new Set([...gesture.base, ...inside])], edges: [] };
      return;
    }
    const text = this.text;
    const at = this.toWorld(event.clientX, event.clientY);
    const hit = this.hitAt(event.clientX, event.clientY);
    const portEl = hit?.closest<HTMLElement>(".port");
    const nodeEl = hit?.closest<HTMLElement>(".node");
    const wanted: Side = gesture.side === "out" ? "in" : "out";
    let hover: { node: string; port: string } | undefined;
    if (nodeEl && nodeEl.dataset.id !== gesture.node) {
      const other = this.node(nodeEl.dataset.id!)!;
      if (portEl && portEl.dataset.side === wanted)
        hover = { node: other.id, port: portEl.dataset.port! };
      else {
        const ports = wanted === "in" ? inputsOf(other) : outputsOf(other);
        const first =
          ports.find((port) => gesture.verdicts.get(`${other.id}:${port.id}`) === "") ?? ports[0];
        if (first) hover = { node: other.id, port: first.id };
      }
    }
    this._gesture = { ...gesture, x: at.x, y: at.y, hover };
    const place = { x: event.clientX, y: event.clientY };
    if (hover) {
      const reason = gesture.verdicts.get(`${hover.node}:${hover.port}`) ?? "";
      const other = this.node(hover.node)!;
      const port = this.port(other, wanted, hover.port);
      this._note = {
        text:
          reason ||
          (port?.label
            ? fill(text.dropToLinkPort, { node: other.label, port: port.label })
            : fill(text.dropToLink, { node: other.label })),
        tone: reason ? "error" : "ok",
        ...place,
      };
    } else if (nodeEl) this._note = { text: text.self, tone: "error", ...place };
    else
      this._note = {
        text: this.kinds.length ? text.dropOnEmpty : text.dropOnPort,
        tone: "info",
        ...place,
      };
  };

  private onPointerUp = (event: PointerEvent) => {
    const gesture = this._gesture;
    this._gesture = undefined;
    this._note = undefined;
    if (!gesture) return;
    if (gesture.kind === "pan") {
      if (
        !gesture.moved &&
        event.button === 0 &&
        (this._selection.nodes.length || this._selection.edges.length)
      )
        this.select({ nodes: [], edges: [] });
      return;
    }
    if (gesture.kind === "move") {
      if (!gesture.moved) return;
      const positions = this.nodes
        .filter((node) => gesture.origin.has(node.id))
        .map((node) => ({ id: node.id, x: node.x, y: node.y }));
      // The preview moved the nodes; the operation decides whether the move stays.
      this.nodes = gesture.snapshot.nodes;
      this.run("move", { positions }, this.withPositions(positions), "move");
      return;
    }
    if (gesture.kind === "marquee") {
      this.emit<DagSelectionDetail>("dag-selection-change", this._selection);
      if (this._selection.nodes.length)
        this.say(fill(this.text.selectedCount, { count: this._selection.nodes.length }));
      return;
    }
    if (gesture.hover) {
      const { node, port } = gesture.hover;
      if (gesture.side === "out") this.connect(gesture.node, gesture.port, node, port);
      else this.connect(node, port, gesture.node, gesture.port);
      return;
    }
    const hit = this.hitAt(event.clientX, event.clientY);
    if (!hit?.closest(".node") && hit?.closest(".canvas") && this.kinds.length)
      this.openMenu(
        {
          kind: "add-connect",
          node: gesture.node,
          port: gesture.port,
          side: gesture.side,
          at: { x: gesture.x, y: gesture.y },
        },
        event.clientX,
        event.clientY,
      );
  };

  private onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const rect = this.canvas!.getBoundingClientRect();
    if (event.ctrlKey || event.metaKey) {
      const factor = Math.exp(-event.deltaY * 0.0022);
      this.zoomTo(this._view.k * factor, {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      return;
    }
    const dx = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
    const dy = event.shiftKey && !event.deltaX ? 0 : event.deltaY;
    this._view = { ...this._view, x: this._view.x - dx, y: this._view.y - dy };
  };

  private onDoubleClick = (event: MouseEvent) => {
    // With pointer capture the target is the canvas: what counts is under the pointer.
    const hit = this.hitAt(event.clientX, event.clientY);
    const nodeEl = hit?.closest<HTMLElement>(".node");
    if (nodeEl) {
      const node = this.node(nodeEl.dataset.id!);
      if (node) this.emit<DagNodeDetail>("dag-node-activate", { node });
      return;
    }
    if (this.readonly || !this.kinds.length || hit?.closest("[data-edge]")) return;
    this.openMenu(
      { kind: "canvas", at: this.toWorld(event.clientX, event.clientY) },
      event.clientX,
      event.clientY,
      true,
    );
  };

  private onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    const origin = this.lift((event.composedPath()[0] as Element) ?? null);
    const nodeEl = origin?.closest<HTMLElement>(".node");
    const edgeEl = origin?.closest<SVGElement>("[data-edge]");
    if (nodeEl) {
      const id = nodeEl.dataset.id!;
      if (!this._selection.nodes.includes(id)) this.select({ nodes: [id], edges: [] });
      return this.openMenu({ kind: "node", id }, event.clientX, event.clientY);
    }
    if (edgeEl) {
      const id = edgeEl.dataset.edge!;
      this.select({ nodes: [], edges: [id] });
      return this.openMenu({ kind: "edge", id }, event.clientX, event.clientY);
    }
    this.openMenu(
      { kind: "canvas", at: this.toWorld(event.clientX, event.clientY) },
      event.clientX,
      event.clientY,
    );
  };

  /* Palette --------------------------------------------------------------- */

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
      const over =
        e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom;
      this._ghost = { kind, x: e.clientX, y: e.clientY, over };
    };
    const up = (e: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const ghost = this._ghost;
      this._ghost = undefined;
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
    const rect = this.canvas!.getBoundingClientRect();
    this.addNode(kind, this.toWorld(rect.left + rect.width / 2, rect.top + rect.height / 2), true);
  }

  /* Keyboard -------------------------------------------------------------- */

  private focusNode(id: string) {
    this.renderRoot
      .querySelector<HTMLElement>(`.node[data-id="${CSS.escape(id)}"]`)
      ?.focus({ preventScroll: true });
  }

  private onKeyDown = (event: KeyboardEvent) => {
    const path = event.composedPath() as Element[];
    const first = path[0];
    if (
      first instanceof HTMLElement &&
      (first.isContentEditable || first.matches("input, textarea, select"))
    )
      return;
    if (
      path.some(
        (element) =>
          element instanceof HTMLElement &&
          (element.matches?.(".palette, .toolbar, bolle-menu, bolle-side-sheet, bolle-snackbar") ||
            (element.getRootNode() !== this.renderRoot && this.contains(element) && element.matches(INTERACTIVE))),
      )
    )
      return;
    const nodeEl = this.lift(first ?? null)?.closest<HTMLElement>(".node");
    const mod = event.ctrlKey || event.metaKey;
    const key = event.key;
    if (key === "Escape") {
      if (this._gesture) {
        this._gesture = undefined;
        this._note = undefined;
        this.say(this.text.linkCancelled);
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
      return this.say(fill(this.text.selectedCount, { count: this.nodes.length }));
    }
    if (mod && key.toLowerCase() === "d") {
      event.preventDefault();
      return this.duplicateSelection();
    }
    if (key === "Delete" || key === "Backspace") {
      event.preventDefault();
      return this.deleteSelection();
    }
    if (!mod && (key === "+" || key === "=")) return this.zoomTo(this._view.k * 1.2);
    if (!mod && key === "-") return this.zoomTo(this._view.k / 1.2);
    if (!mod && key === "0") return this.fitView();
    if (!mod && key === "1") return this.zoomTo(1);
    if ((key === "F10" && event.shiftKey) || key === "ContextMenu") {
      event.preventDefault();
      const rect = (nodeEl ?? this.canvas!).getBoundingClientRect();
      if (nodeEl)
        return this.openMenu({ kind: "node", id: nodeEl.dataset.id! }, rect.left + 24, rect.bottom);
      if (this._selection.edges.length === 1)
        return this.openMenu({ kind: "edge", id: this._selection.edges[0] }, rect.left + 24, rect.top + 24);
      return this.openMenu(
        { kind: "canvas", at: this.toWorld(rect.left + rect.width / 2, rect.top + rect.height / 2) },
        rect.left + 24,
        rect.top + 24,
      );
    }
    if (nodeEl && key === "Enter") {
      event.preventDefault();
      const node = this.node(nodeEl.dataset.id!);
      if (node) this.emit<DagNodeDetail>("dag-node-activate", { node });
      return;
    }
    if (nodeEl && key === " ") {
      event.preventDefault();
      const id = nodeEl.dataset.id!;
      const on = this._selection.nodes.includes(id);
      this.select({
        nodes: on ? this._selection.nodes.filter((item) => item !== id) : [...this._selection.nodes, id],
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
      this._view = {
        ...this._view,
        x: this._view.x - arrow[0] * step,
        y: this._view.y - arrow[1] * step,
      };
    }
  };

  /** Alt + arrows: the nearest node in the direction pressed. */
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
    if (!best) return this.say(this.text.noNeighbour);
    this.select({ nodes: [best.id], edges: [] });
    this.focusNode(best.id);
  }

  private onNodeFocus(id: string) {
    if (this._gesture) return;
    if (!this._selection.nodes.includes(id)) this.select({ nodes: [id], edges: [] });
  }

  /** Brings the node to the centre: only on an explicit request from the menu. */
  private centerOn(id: string) {
    const node = this.node(id);
    if (!node) return;
    const { w, h } = this.sizeOf(node);
    this._view = {
      ...this._view,
      x: this.stageSize.w / 2 - (node.x + w / 2) * this._view.k,
      y: this.stageSize.h / 2 - (node.y + h / 2) * this._view.k,
    };
  }

  /* Menu ------------------------------------------------------------------ */

  private kindEntries(check: (kind: DagNodeKind) => string): MenuEntry[] {
    const groups = new Map<string, DagNodeKind[]>();
    for (const kind of this.kinds) groups.set(kind.group ?? "", [...(groups.get(kind.group ?? "") ?? []), kind]);
    const action = (kind: DagNodeKind): MenuAction => {
      const reason = check(kind);
      return {
        id: `add:${kind.kind}`,
        label: kind.label,
        disabled: !!reason,
        supportingText: reason || kind.description,
      };
    };
    if (groups.size <= 1) return this.kinds.map(action);
    return [...groups].map(([label, kinds]) => ({
      group: true as const,
      label: label || this.text.other,
      items: kinds.map(action),
    }));
  }

  private nodeEntries(id: string): MenuEntry[] {
    const text = this.text;
    const node = this.node(id)!;
    const next = successors(this.graph);
    const others = this.nodes
      .filter((other) => other.id !== id)
      .sort((a, b) => a.label.localeCompare(b.label));
    const linked = this.edges.filter((edge) => edge.source === id || edge.target === id);
    const deleteReason = this.deleteVerdict(node);
    const view: MenuEntry[] = [
      { id: "props", label: text.properties, trailingText: text.keyEnter },
      { id: "center", label: text.center },
      { id: "up", label: text.selectUpstream, disabled: !this.edges.some((edge) => edge.target === id) },
      { id: "down", label: text.selectDownstream, disabled: !this.edges.some((edge) => edge.source === id) },
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
        label: text.linkTo,
        disabled: !outputsOf(node).length || !others.length,
        children: others.map((other) => pairTo(other, true)),
      },
      {
        id: "connect-from",
        label: text.receiveFrom,
        disabled: !inputsOf(node).length || !others.length,
        children: others.map((other) => pairTo(other, false)),
      },
      {
        id: "unlink",
        label: text.unlink,
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
      { id: "duplicate", label: text.duplicateAction, trailingText: "Ctrl+D" },
      {
        id: "delete",
        label: text.delete,
        trailingText: text.keyDelete,
        disabled: !!deleteReason,
        supportingText: deleteReason || undefined,
      },
    ];
  }

  private openMenu(context: MenuContext, x: number, y: number, addOnly = false) {
    const menu = this.renderRoot.querySelector<BolleMenu>("bolle-menu");
    if (!menu) return;
    const text = this.text;
    let items: MenuEntry[] = [];
    let label = text.actions;
    if (context.kind === "node") {
      label = fill(text.actionsOn, { node: this.node(context.id)?.label ?? "" });
      items = this.nodeEntries(context.id);
    } else if (context.kind === "edge") {
      const edge = this.edges.find((item) => item.id === context.id);
      if (!edge) return;
      const source = this.node(edge.source)?.label ?? "";
      const target = this.node(edge.target)?.label ?? "";
      const reason = this.edgeDeleteVerdict(edge);
      label = fill(text.link, { source, target });
      items = [
        { id: "edge-source", label: fill(text.goTo, { node: source }) },
        { id: "edge-target", label: fill(text.goTo, { node: target }) },
        ...(this.readonly
          ? []
          : [
              { separator: true as const },
              {
                id: "edge-delete",
                label: text.deleteLink,
                trailingText: text.keyDelete,
                disabled: !!reason,
                supportingText: reason || undefined,
              },
            ]),
      ];
    } else if (context.kind === "add-connect") {
      label = text.addAndLink;
      const from = this.node(context.node)!;
      const fromPort = this.port(from, context.side, context.port)!;
      items = this.kindEntries((kind) => {
        const reason = this.addVerdict(kind);
        if (reason) return reason;
        const probe = this.createNode(kind, context.at);
        const ports = context.side === "out" ? inputsOf(probe) : outputsOf(probe);
        if (!ports.length) return context.side === "out" ? text.acceptsNone : text.emitsNone;
        const graph = { nodes: [...this.nodes, probe], edges: this.edges };
        let first = "";
        for (const port of ports) {
          const why =
            context.side === "out"
              ? this.check(graph, from, fromPort, probe, port)
              : this.check(graph, probe, port, from, fromPort);
          if (!why) return "";
          first ||= why;
        }
        return first;
      });
    } else {
      label = addOnly ? text.addNode : text.graph;
      const add = this.kindEntries((kind) => this.addVerdict(kind));
      items = addOnly
        ? add
        : [
            ...(this.readonly || !this.kinds.length
              ? []
              : [
                  {
                    id: "add",
                    label: text.addNode,
                    children: add.flatMap((entry) => ("group" in entry ? entry.items : [entry])),
                  },
                  { separator: true as const },
                ]),
            { id: "fit", label: text.fit, trailingText: "0" },
            { id: "all", label: text.selectAll, trailingText: "Ctrl+A", disabled: !this.nodes.length },
            ...(this.readonly
              ? []
              : [
                  { id: "layout", label: text.arrange, disabled: !this.nodes.length },
                  { separator: true as const },
                  { id: "undo", label: text.undo, trailingText: "Ctrl+Z", disabled: !this.past.length },
                  { id: "redo", label: text.redo, trailingText: "Ctrl+Y", disabled: !this.future.length },
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
        return this.addAndConnect(
          kind,
          { node: context.node, port: context.port, side: context.side },
          context.at,
        );
      if (context.kind === "canvas") this.addNode(kind, context.at);
      return;
    }
    if (context.kind === "node") {
      const node = this.node(context.id);
      if (!node) return;
      if (id === "props") return void this.emit<DagNodeDetail>("dag-node-activate", { node });
      if (id === "center") return this.centerOn(node.id);
      if (id === "up" || id === "down") {
        const ids = [
          ...reach(node.id, id === "up" ? predecessors(this.graph) : successors(this.graph)),
        ];
        this.select({ nodes: [node.id, ...ids], edges: [] });
        return this.say(
          fill(id === "up" ? this.text.upstreamSelected : this.text.downstreamSelected, {
            count: ids.length,
          }),
        );
      }
      if (id.startsWith("to:") || id.startsWith("from:")) {
        const other = this.node(id.slice(id.indexOf(":") + 1));
        if (!other) return;
        const outgoing = id.startsWith("to:");
        const pair = outgoing ? this.bestPair(node, other) : this.bestPair(other, node);
        if (!pair.sourcePort || !pair.targetPort) return;
        if (outgoing) this.connect(node.id, pair.sourcePort, other.id, pair.targetPort);
        else this.connect(other.id, pair.sourcePort, node.id, pair.targetPort);
        return;
      }
      if (id.startsWith("unlink:")) return this.unlink(id.slice(7));
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
      this.focusNode(target);
      return;
    }
    if (id === "fit") return this.fitView();
    if (id === "all") return this.select({ nodes: this.nodes.map((node) => node.id), edges: [] });
    if (id === "layout") return this.autoLayout();
    if (id === "undo") return this.undo();
    if (id === "redo") return this.redo();
  };

  /* Rendering ------------------------------------------------------------- */

  private renderPalette() {
    if (!this.kinds.length || this.readonly) return nothing;
    const text = this.text;
    if (!this._paletteOpen)
      return html`<div class="palette-rail">
        <bolle-tooltip label=${text.showPalette}>
          <bolle-icon-button
            variant="tonal"
            label=${text.showPalette}
            @click=${() => (this._paletteOpen = true)}
            >${sidebarExpandIcon()}</bolle-icon-button
          >
        </bolle-tooltip>
      </div>`;
    const query = this._paletteQuery.trim().toLowerCase();
    const kinds = this.kinds.filter(
      (kind) =>
        !query ||
        `${kind.label} ${kind.description ?? ""} ${kind.group ?? ""}`.toLowerCase().includes(query),
    );
    const groups = new Map<string, DagNodeKind[]>();
    for (const kind of kinds) groups.set(kind.group ?? "", [...(groups.get(kind.group ?? "") ?? []), kind]);
    return html`<aside class="palette" part="palette" aria-label=${text.palette}>
      <header>
        <h2>${text.paletteTitle}</h2>
        <bolle-tooltip label=${text.hidePalette}>
          <bolle-icon-button
            variant="standard"
            size="xs"
            label=${text.hidePalette}
            @click=${() => (this._paletteOpen = false)}
            >${sidebarCollapseIcon()}</bolle-icon-button
          >
        </bolle-tooltip>
      </header>
      <bolle-search
        label=${text.searchKind}
        placeholder=${text.searchPlaceholder}
        filter
        .value=${this._paletteQuery}
        @change=${(event: CustomEvent<{ value: string }>) => (this._paletteQuery = event.detail.value)}
      ></bolle-search>
      <div class="palette-list">
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
                        class="kind"
                        ?disabled=${!!reason}
                        @pointerdown=${(event: PointerEvent) => this.startPaletteDrag(event, kind)}
                        @click=${(event: MouseEvent) => this.onPaletteClick(event, kind)}
                      >
                        <span class="kind-icon" aria-hidden="true">${kind.icon ?? boxIcon()}</span>
                        <span class="kind-text">
                          <strong>${kind.label}</strong>
                          <span>${reason || kind.description || ""}</span>
                        </span>
                        ${reason ? html`<span class="kind-lock" aria-hidden="true">${lockIcon()}</span>` : nothing}
                      </button>
                    </li>`;
                  })}
                </ul>
              </section>`,
            )
          : html`<p class="palette-empty">${fill(text.noKind, { query: this._paletteQuery })}</p>`}
      </div>
      <p class="palette-foot">${text.paletteHint}</p>
    </aside>`;
  }

  private renderEdges(related: Set<string>) {
    const gesture = this._gesture;
    const selected = new Set(this._selection.edges);
    const byId = new Map(this.nodes.map((node) => [node.id, node]));
    const box = this.nodes.length ? this.bounds(this.nodes) : { x: 0, y: 0, w: 1, h: 1 };
    const pad = 400;
    const x = box.x - pad;
    const y = box.y - pad;
    const w = box.w + pad * 2;
    const h = box.h + pad * 2;
    let preview: unknown = nothing;
    if (gesture?.kind === "connect") {
      const origin = byId.get(gesture.node);
      if (origin) {
        const from = this.portPoint(origin, gesture.side, gesture.port);
        let to = { x: gesture.x, y: gesture.y };
        let tone = "info";
        if (gesture.hover) {
          const other = byId.get(gesture.hover.node)!;
          to = this.portPoint(other, gesture.side === "out" ? "in" : "out", gesture.hover.port);
          tone = gesture.verdicts.get(`${gesture.hover.node}:${gesture.hover.port}`) ? "error" : "ok";
        }
        const [a, b] = gesture.side === "out" ? [from, to] : [to, from];
        preview = svg`<path class="preview" data-tone=${tone} d=${this.curve(a, b)} marker-end=${`url(#arrow-${tone})`}></path>`;
      }
    }
    return html`<svg
      class="edges"
      style=${`left:${x}px;top:${y}px;width:${w}px;height:${h}px`}
      viewBox=${`${x} ${y} ${w} ${h}`}
      aria-hidden="true"
    >
      <defs>
        ${["base", "active", "ok", "error", "info"].map(
          (tone) =>
            svg`<marker id=${`arrow-${tone}`} class="arrow" data-tone=${tone} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,1 L9,5 L0,9 z"></path></marker>`,
        )}
      </defs>
      ${repeat(
        this.edges,
        (edge) => edge.id,
        (edge) => {
          const s = byId.get(edge.source);
          const t = byId.get(edge.target);
          if (!s || !t) return nothing;
          const d = this.curve(
            this.portPoint(s, "out", edge.sourcePort),
            this.portPoint(t, "in", edge.targetPort),
          );
          const on = selected.has(edge.id);
          const near = related.has(edge.id);
          return svg`<g class="edge" part="edge" data-selected=${on} data-related=${near}>
            <path class="edge-hit" data-edge=${edge.id} d=${d}></path>
            <path class="edge-line" d=${d} marker-end=${`url(#arrow-${on || near ? "active" : "base"})`}></path>
          </g>`;
        },
      )}
      ${preview}
    </svg>`;
  }

  private renderNode(node: DagNode, related: Set<string>) {
    const text = this.text;
    const id = node.id;
    const gesture = this._gesture;
    const selected = this._selection.nodes.includes(node.id);
    const ins = inputsOf(node);
    const outs = outputsOf(node);
    const labelled = this.labelled(node);
    const incoming = this.edges.filter((edge) => edge.target === node.id).length;
    const outgoing = this.edges.filter((edge) => edge.source === node.id).length;
    let candidate = "";
    if (gesture?.kind === "connect" && gesture.node !== node.id) {
      const ports = gesture.side === "out" ? ins : outs;
      candidate = ports.some((port) => gesture.verdicts.get(`${node.id}:${port.id}`) === "")
        ? "valid"
        : "invalid";
    }
    const port = (p: DagPort, side: Side) => {
      const at = this.portOffset(node, side, p.id);
      let state = "";
      if (gesture?.kind === "connect") {
        if (gesture.node === node.id && gesture.port === p.id && gesture.side === side) state = "origin";
        else if (side !== gesture.side && gesture.node !== node.id)
          state = gesture.verdicts.get(`${node.id}:${p.id}`) ? "invalid" : "valid";
        if (gesture.hover?.node === node.id && gesture.hover.port === p.id && side !== gesture.side)
          state += " hover";
      }
      const used = this.edges.some((edge) =>
        side === "in"
          ? edge.target === node.id && edge.targetPort === p.id
          : edge.source === node.id && edge.sourcePort === p.id,
      );
      const name = p.label ?? (side === "in" ? text.input : text.output);
      return html`<span
        class="port"
        part="port"
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
      return html`<span
        class="port-label"
        data-side=${side}
        style=${`${at.x === 0 ? "left" : "right"}:14px;top:${at.y}px`}
        ><span class="port-name">${p.label}</span>${p.type ? html`<em>${p.type}</em>` : nothing}</span
      >`;
    };
    const description = [
      node.description,
      node.badge?.label,
      fill(text.links, { incoming, outgoing }),
      selected ? text.selected : "",
    ]
      .filter(Boolean)
      .join(", ");
    const rows = labelled ? Math.max(ins.length, outs.length) * ROW_H + 10 : 0;
    return html`<div
      class="node"
      part="node"
      tabindex="0"
      role="group"
      aria-roledescription=${text.nodeRole}
      aria-label=${node.label}
      aria-description=${description}
      data-id=${node.id}
      data-selected=${selected}
      data-related=${related.has(node.id)}
      data-candidate=${candidate}
      data-tone=${node.badge?.tone ?? ""}
      style=${`left:${node.x}px;top:${node.y}px;width:${NODE_W}px;min-height:${this.baseHeight(node)}px`}
      @focus=${() => this.onNodeFocus(node.id)}
    >
      <div class="node-head" data-labelled=${labelled}>
        <span class="node-icon" aria-hidden="true">${node.icon ?? boxIcon()}</span>
        <span class="node-text">
          <strong>${node.label}</strong>
          ${node.description ? html`<span>${node.description}</span>` : nothing}
        </span>
        ${node.badge
          ? html`<span class="badge" data-tone=${node.badge.tone}>${node.badge.label}</span>`
          : nothing}
      </div>
      ${rows ? html`<div class="node-rows" style=${`block-size:${rows}px`}></div>` : nothing}
      <slot name=${`node-${id}`}></slot>
      ${labelled
        ? [
            ...ins.filter((p) => p.label).map((p) => rowLabel(p, "in")),
            ...outs.filter((p) => p.label).map((p) => rowLabel(p, "out")),
          ]
        : nothing}
      ${ins.map((p) => port(p, "in"))} ${outs.map((p) => port(p, "out"))}
    </div>`;
  }

  private renderMinimap() {
    if (!this.minimap || this.nodes.length < 2 || !this.stageSize.w) return nothing;
    const box = this.bounds(this.nodes);
    const { x, y, k } = this._view;
    const vx = -x / k;
    const vy = -y / k;
    const vw = this.stageSize.w / k;
    const vh = this.stageSize.h / k;
    const x1 = Math.min(box.x, vx);
    const y1 = Math.min(box.y, vy);
    const x2 = Math.max(box.x + box.w, vx + vw);
    const y2 = Math.max(box.y + box.h, vy + vh);
    const pad = 40;
    const selected = new Set(this._selection.nodes);
    const move = (event: PointerEvent) => {
      if (event.type === "pointermove" && !(event.buttons & 1)) return;
      const element = event.currentTarget as SVGSVGElement;
      if (event.type === "pointerdown") element.setPointerCapture(event.pointerId);
      const point = element.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const world = point.matrixTransform(element.getScreenCTM()!.inverse());
      this._view = {
        ...this._view,
        x: this.stageSize.w / 2 - world.x * k,
        y: this.stageSize.h / 2 - world.y * k,
      };
    };
    return html`<div class="minimap" part="minimap">
      <svg
        viewBox=${`${x1 - pad} ${y1 - pad} ${x2 - x1 + pad * 2} ${y2 - y1 + pad * 2}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label=${this.text.minimap}
        @pointerdown=${move}
        @pointermove=${move}
      >
        ${this.nodes.map((node) => {
          const size = this.sizeOf(node);
          return svg`<rect x=${node.x} y=${node.y} width=${size.w} height=${size.h} rx="14" data-selected=${selected.has(node.id)} data-tone=${node.badge?.tone ?? ""}></rect>`;
        })}
        <rect class="minimap-view" x=${vx} y=${vy} width=${vw} height=${vh}></rect>
      </svg>
    </div>`;
  }

  private renderToolbar() {
    const text = this.text;
    const [past, future] = this._history;
    const button = (label: string, tip: string, icon: unknown, action: () => void, disabled = false) =>
      html`<bolle-tooltip label=${tip}
        ><bolle-icon-button variant="standard" label=${label} ?disabled=${disabled} @click=${action}
          >${icon}</bolle-icon-button
        ></bolle-tooltip
      >`;
    return html`<div class="toolbar" part="toolbar" role="toolbar" aria-label=${text.commands}>
      ${this.readonly
        ? nothing
        : html`${button(text.undo, `${text.undo} · Ctrl+Z`, undoIcon(), () => this.undo(), !past)}
            ${button(text.redo, `${text.redo} · Ctrl+Y`, redoIcon(), () => this.redo(), !future)}
            <span class="toolbar-separator"></span>`}
      ${button(text.zoomOut, `${text.zoomOut} · −`, zoomOutIcon(), () => this.zoomTo(this._view.k / 1.2), this._view.k <= MIN_ZOOM)}
      <bolle-tooltip label=${`${text.actualSize} · 1`}
        ><button type="button" class="zoom" aria-label=${text.zoomReset} @click=${() => this.zoomTo(1)}>
          ${Math.round(this._view.k * 100)}%
        </button></bolle-tooltip
      >
      ${button(text.zoomIn, `${text.zoomIn} · +`, zoomInIcon(), () => this.zoomTo(this._view.k * 1.2), this._view.k >= MAX_ZOOM)}
      ${button(text.fit, `${text.fit} · 0`, fitViewIcon(), () => this.fitView(), !this.nodes.length)}
      ${this.readonly
        ? nothing
        : html`<span class="toolbar-separator"></span>
            ${button(text.arrange, text.arrangeTip, layoutIcon(), () => this.autoLayout(), this.nodes.length < 2)}`}
      <span class="toolbar-separator"></span>
      ${button(text.shortcuts, text.shortcuts, keyboardIcon(), () =>
        void this.renderRoot.querySelector<BolleSideSheet>("bolle-side-sheet")?.show(),
      )}
    </div>`;
  }

  private renderState() {
    const text = this.text;
    if (this.loading)
      return html`<div class="state" data-kind="loading">
        <div class="skeleton" aria-hidden="true">
          ${[0, 1, 2, 3, 4, 5].map((i) => html`<span style=${`--i:${i}`}></span>`)}
        </div>
        <bolle-loading-indicator label=${text.loading}></bolle-loading-indicator>
        <p>${text.loading}…</p>
      </div>`;
    if (this.error)
      return html`<div class="state" data-kind="error">
        <bolle-empty-state tone="error" role="alert" .title=${text.errorTitle} .text=${this.error} .icon=${alertIcon()}>
          <bolle-button slot="actions" variant="filled" @click=${() => this.emit("dag-retry", {})}
            >${text.retry}</bolle-button
          >
        </bolle-empty-state>
      </div>`;
    if (!this.nodes.length)
      return html`<div class="state" data-kind="empty">
        <bolle-empty-state
          .title=${this.readonly ? text.emptyReadOnlyTitle : text.emptyTitle}
          .text=${this.readonly
            ? text.emptyReadOnlyText
            : this.kinds.length
              ? text.emptyText
              : text.emptyNoKinds}
          .icon=${graphIcon()}
        >
          ${!this.readonly && this.kinds.length
            ? html`<bolle-button
                slot="actions"
                variant="filled"
                @click=${(event: MouseEvent) => {
                  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
                  this.openMenu(
                    {
                      kind: "canvas",
                      at: {
                        x: (this.stageSize.w / 2 - this._view.x) / this._view.k,
                        y: (this.stageSize.h / 2 - this._view.y) / this._view.k,
                      },
                    },
                    rect.left,
                    rect.bottom + 4,
                    true,
                  );
                }}
                >${text.addFirst}</bolle-button
              >`
            : nothing}
        </bolle-empty-state>
      </div>`;
    return nothing;
  }

  private renderKeys() {
    const text = this.text;
    const rows: [string, string][] = [
      [text.keysTab, text.keysTabText],
      [text.keysAltArrows, text.keysAltArrowsText],
      [text.keysArrows, text.keysArrowsText],
      [text.keysShiftArrows, text.keysShiftArrowsText],
      [text.keysSpace, text.keysSpaceText],
      [text.keysEnter, text.keysEnterText],
      [text.keysMenu, text.keysMenuText],
      [text.keysDelete, text.keysDeleteText],
      [text.keysDuplicate, text.keysDuplicateText],
      [text.keysSelectAll, text.keysSelectAllText],
      [text.keysUndo, text.keysUndoText],
      [text.keysZoom, text.keysZoomText],
      [text.keysEscape, text.keysEscapeText],
      [text.keysMarquee, text.keysMarqueeText],
      [text.keysWheel, text.keysWheelText],
    ];
    return html`<bolle-side-sheet label=${text.shortcuts} close-label=${text.close}>
      <dl class="keys">
        ${rows.map(
          ([keys, what]) =>
            html`<div>
              <dt>${keys.split(", ").map((key) => html`<kbd>${key}</kbd>`)}</dt>
              <dd>${what}</dd>
            </div>`,
        )}
      </dl>
    </bolle-side-sheet>`;
  }

  protected render() {
    const text = this.text;
    const busy = this.loading || !!this.error;
    const related = new Set<string>();
    const chosen = new Set(this._selection.nodes);
    for (const edge of this.edges)
      if (chosen.has(edge.source) || chosen.has(edge.target)) {
        related.add(edge.id);
        related.add(chosen.has(edge.source) ? edge.target : edge.source);
      }
    for (const id of this._selection.edges) {
      const edge = this.edges.find((item) => item.id === id);
      if (edge) related.add(edge.source).add(edge.target);
    }
    // Nodes follow the topological order, so Tab walks the graph from the sources.
    const order = topologicalOrder(this.graph);
    const byId = new Map(this.nodes.map((node) => [node.id, node]));
    const listed = new Set(order);
    const ordered = [
      ...order.map((id) => byId.get(id)!),
      ...this.nodes.filter((node) => !listed.has(node.id)),
    ];
    const gesture = this._gesture;
    const { x, y, k } = this._view;
    let marquee = "";
    if (gesture?.kind === "marquee" && this.canvas) {
      const rect = this.canvas.getBoundingClientRect();
      marquee = `left:${Math.min(gesture.startX, gesture.x) - rect.left}px;top:${Math.min(gesture.startY, gesture.y) - rect.top}px;width:${Math.abs(gesture.x - gesture.startX)}px;height:${Math.abs(gesture.y - gesture.startY)}px`;
    }
    // Below 10px the dots would merge: the grid doubles its step.
    const grid = 16 * k * 2 ** Math.max(0, Math.ceil(Math.log2(10 / (16 * k))));
    return html`<div
      class="dag"
      data-orientation=${this.orientation}
      data-readonly=${this.readonly}
      data-gesture=${gesture?.kind ?? ""}
      @keydown=${this.onKeyDown}
    >
      ${this.renderPalette()}
      <div class="stage">
        <div
          class="canvas"
          part="canvas"
          tabindex="0"
          role="application"
          aria-roledescription=${text.roleDescription}
          aria-label=${this.label}
          aria-description=${`${fill(text.summary, { nodes: this.nodes.length, edges: this.edges.length })}${this.readonly ? text.readOnlySuffix : ""}${text.help}`}
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
            : html`<div class="world" style=${`transform:translate(${x}px,${y}px) scale(${k})`}>
                ${this.renderEdges(related)}
                ${repeat(ordered, (node) => node.id, (node) => this.renderNode(node, related))}
              </div>`}
          ${marquee ? html`<div class="marquee" style=${marquee}></div>` : nothing}
        </div>
        ${this.renderState()}
        ${busy ? nothing : html`${this.renderToolbar()} ${this.renderMinimap()}`}
        ${this.readonly && !busy
          ? html`<span class="readonly">${lockIcon()} ${text.readOnly}</span>`
          : nothing}
      </div>
      ${this._note
        ? html`<div
            class="note"
            data-tone=${this._note.tone}
            style=${`left:${this._note.x + 16}px;top:${this._note.y + 18}px`}
            role="presentation"
          >
            ${this._note.text}
          </div>`
        : nothing}
      ${this._ghost
        ? html`<div
            class="ghost"
            data-over=${this._ghost.over}
            style=${`left:${this._ghost.x}px;top:${this._ghost.y}px`}
          >
            <span class="node-icon" aria-hidden="true">${this._ghost.kind.icon ?? boxIcon()}</span>
            <strong>${this._ghost.kind.label}</strong>
          </div>`
        : nothing}
      <bolle-menu menu-label=${text.actions} @menu-select=${this.onMenuSelect}></bolle-menu>
      <bolle-snackbar close-label=${text.close} @action=${() => this.undo()}></bolle-snackbar>
      ${this.renderKeys()}
      <p class="sr" role="status" aria-live="polite">${this._announcement}</p>
    </div>`;
  }
}
