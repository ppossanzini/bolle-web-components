// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
// Modello del grafo: tipi pubblici, vincoli, controllo dei cicli, ordine
// topologico e disposizione a livelli.

export type DagTone = "neutral" | "primary" | "success" | "warning" | "error";
export type DagOrientation = "horizontal" | "vertical";

export interface DagPort {
  id: string;
  /** Etichetta visibile della porta; senza etichetta la porta è solo un punto. */
  label?: string;
  /** Tipo di dato; il controllo dei tipi si applica solo quando entrambe le porte lo dichiarano. */
  type?: string;
  /** Numero massimo di collegamenti sulla porta. Assente: illimitato. */
  max?: number;
}

export interface DagNode {
  id: string;
  label: string;
  description?: string;
  kind?: string;
  /** SVG grezzo dell'icona. */
  icon?: string;
  badge?: { label: string; tone: DagTone };
  x: number;
  y: number;
  /** Assente: una porta d'ingresso generica. Vuoto: il nodo non riceve collegamenti. */
  inputs?: DagPort[];
  /** Assente: una porta d'uscita generica. Vuoto: il nodo non emette collegamenti. */
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
  icon?: string;
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

/** `true` consente; una stringa rifiuta e diventa il motivo mostrato all'utente. */
export type DagVerdict = true | string;

/**
 * Vincoli stabiliti dal developer. Senza vincoli l'editor è libero: restano solo
 * le regole strutturali di un DAG (niente cicli, niente anelli, niente doppioni).
 */
export interface DagConstraints {
  typeCompatible?: (outType: string, inType: string) => boolean;
  maxIncoming?: number;
  maxOutgoing?: number;
  maxNodes?: number;
  canConnect?: (connection: DagConnection) => DagVerdict;
  canAdd?: (kind: DagNodeKind, graph: DagGraph) => DagVerdict;
  canDelete?: (node: DagNode, graph: DagGraph) => DagVerdict;
  canDeleteEdge?: (edge: DagEdge, graph: DagGraph) => DagVerdict;
}

const GENERIC_IN: DagPort = { id: "in" };
const GENERIC_OUT: DagPort = { id: "out" };

export const inputsOf = (node: DagNode) => node.inputs ?? [GENERIC_IN];
export const outputsOf = (node: DagNode) => node.outputs ?? [GENERIC_OUT];

export const NODE_W = 232;
export const NODE_H = 64;
export const HEAD_H = 60;
export const ROW_H = 24;

/** In orizzontale le porte con etichetta diventano righe del nodo; in verticale restano punti. */
export const hasPortLabels = (node: DagNode, orientation: DagOrientation) =>
  orientation === "horizontal" && [...inputsOf(node), ...outputsOf(node)].some((port) => port.label);

export function nodeSize(node: DagNode, orientation: DagOrientation) {
  if (!hasPortLabels(node, orientation)) return { w: NODE_W, h: NODE_H };
  const rows = Math.max(inputsOf(node).length, outputsOf(node).length);
  return { w: NODE_W, h: HEAD_H + rows * ROW_H + 10 };
}

export function successors(graph: DagGraph) {
  const map = new Map<string, string[]>();
  for (const node of graph.nodes) map.set(node.id, []);
  for (const edge of graph.edges) map.get(edge.source)?.push(edge.target);
  return map;
}

export function predecessors(graph: DagGraph) {
  const map = new Map<string, string[]>();
  for (const node of graph.nodes) map.set(node.id, []);
  for (const edge of graph.edges) map.get(edge.target)?.push(edge.source);
  return map;
}

/** Nodi raggiungibili da `start` seguendo `next`, `start` escluso. */
export function reach(start: string, next: Map<string, string[]>) {
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

/** Percorso più breve da `from` a `to`, estremi inclusi; vuoto se non esiste. */
export function pathBetween(from: string, to: string, next: Map<string, string[]>) {
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

/** Ordine di Kahn; a parità di grado decide l'ordine dei nodi in ingresso. */
export function topologicalOrder(graph: DagGraph) {
  const indegree = new Map(graph.nodes.map((node) => [node.id, 0]));
  for (const edge of graph.edges) indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1);
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

/** Livello di ogni nodo: il cammino più lungo da una sorgente. */
export function ranks(graph: DagGraph) {
  const prev = predecessors(graph);
  const rank = new Map<string, number>();
  for (const id of topologicalOrder(graph))
    rank.set(id, Math.max(-1, ...(prev.get(id) ?? []).map((p) => rank.get(p) ?? 0)) + 1);
  return rank;
}

export interface ConnectionText {
  self: string;
  duplicate: string;
  cycle: (path: string[]) => string;
  type: (outType: string, inType: string) => string;
  portFull: (port: string, max: number, side: "in" | "out") => string;
  nodeFull: (node: string, max: number, side: "in" | "out") => string;
}

/** Restituisce il motivo del rifiuto, oppure una stringa vuota se il collegamento è valido. */
export function checkConnection(
  graph: DagGraph,
  constraints: DagConstraints,
  text: ConnectionText,
  source: DagNode,
  sourcePort: DagPort,
  target: DagNode,
  targetPort: DagPort,
  next = successors(graph),
): string {
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
    return text.cycle([source.id, ...back].map((id) => names.get(id) ?? id));
  }
  if (sourcePort.type && targetPort.type) {
    const compatible = constraints.typeCompatible ?? ((a: string, b: string) => a === b);
    if (!compatible(sourcePort.type, targetPort.type)) return text.type(sourcePort.type, targetPort.type);
  }
  const into = graph.edges.filter((edge) => edge.target === target.id);
  const from = graph.edges.filter((edge) => edge.source === source.id);
  if (targetPort.max !== undefined && into.filter((edge) => edge.targetPort === targetPort.id).length >= targetPort.max)
    return text.portFull(targetPort.label ?? target.label, targetPort.max, "in");
  if (sourcePort.max !== undefined && from.filter((edge) => edge.sourcePort === sourcePort.id).length >= sourcePort.max)
    return text.portFull(sourcePort.label ?? source.label, sourcePort.max, "out");
  if (constraints.maxIncoming !== undefined && into.length >= constraints.maxIncoming)
    return text.nodeFull(target.label, constraints.maxIncoming, "in");
  if (constraints.maxOutgoing !== undefined && from.length >= constraints.maxOutgoing)
    return text.nodeFull(source.label, constraints.maxOutgoing, "out");
  const verdict = constraints.canConnect?.({ source, sourcePort, target, targetPort, graph }) ?? true;
  return verdict === true ? "" : verdict;
}

export interface Size {
  w: number;
  h: number;
}

/**
 * Disposizione a livelli in stile Sugiyama ridotto: livello per cammino più
 * lungo, ordinamento per baricentro in più passate, allineamento ai
 * predecessori senza sovrapposizioni.
 */
export function layeredLayout(
  graph: DagGraph,
  sizeOf: (node: DagNode) => Size,
  options: { orientation: DagOrientation; reverse?: boolean; gapMain?: number; gapCross?: number },
) {
  const { orientation, reverse = false, gapMain = 96, gapCross = 28 } = options;
  const horizontal = orientation === "horizontal";
  const rank = ranks(graph);
  const order = topologicalOrder(graph);
  const placed = new Set(order);
  for (const node of graph.nodes) if (!rank.has(node.id)) rank.set(node.id, 0);
  const layers: string[][] = [];
  for (const id of [...order, ...graph.nodes.map((n) => n.id).filter((id) => !placed.has(id))]) {
    const r = rank.get(id)!;
    (layers[r] ??= []).push(id);
  }
  const prev = predecessors(graph);
  const next = successors(graph);
  const index = new Map<string, number>();
  const reindex = () => layers.forEach((layer) => layer.forEach((id, i) => index.set(id, i)));
  reindex();
  const sweep = (layer: string[], neighbours: Map<string, string[]>) => {
    const score = new Map(
      layer.map((id) => {
        const near = neighbours.get(id) ?? [];
        return [id, near.length ? near.reduce((sum, n) => sum + index.get(n)!, 0) / near.length : index.get(id)!];
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
    // Centro desiderato: media dei predecessori già piazzati, altrimenti in coda al vicino.
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
      placed[i] = i ? Math.max(wanted[i], placed[i - 1] + (sizes[i - 1] + sizes[i]) / 2 + gapCross) : wanted[i];
    });
    // Lo spostamento medio riporta il livello sui predecessori invece di farlo scivolare.
    const shift = placed.reduce((sum, value, i) => sum + (wanted[i] - value), 0) / layer.length;
    layer.forEach((id, i) => center.set(id, placed[i] + shift));
  }
  const positions = new Map<string, { x: number; y: number }>();
  let offset = 0;
  for (const layer of layers) {
    const depth = Math.max(...layer.map((id) => main(byId.get(id)!)));
    for (const id of layer) {
      const node = byId.get(id)!;
      const along = reverse ? -offset - main(node) : offset;
      const across = Math.round(center.get(id)! - cross(node) / 2);
      positions.set(id, horizontal ? { x: along, y: across } : { x: across, y: along });
    }
    offset += depth + gapMain;
  }
  return positions;
}
