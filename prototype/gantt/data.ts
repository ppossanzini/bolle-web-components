// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
// Dati finti ma realistici: pianificazione di un'impresa edile e impiantistica.

export interface Task {
  id: string;
  code: string;
  name: string;
  /** Parent task id: the row is a summary of its children. */
  parent?: string;
  resource: string;
  start: string;
  end: string;
  /** Percent of the work done. */
  progress: number;
  /** A point in time: the bar is drawn as a diamond. */
  milestone?: boolean;
  /** Hours the work needs, spread over the working days it spans. */
  hours: number;
  /** Predecessors, finish to start. */
  deps: string[];
  /** Agreed dates, kept when the plan moves. */
  baseline?: { start: string; end: string };
}

export type GroupBy = "wbs" | "resource" | "phase";

export interface Row {
  id: string;
  task?: Task;
  /** Synthetic header row of a grouping, with the tasks it collects. */
  group?: { key: string; label: string; count: number };
  depth: number;
  kind: "task" | "summary" | "group";
  /** Dates shown for a summary, rolled up from its children. */
  span?: { start: string; end: string; progress: number };
}

export const PHASES = [
  "Progettazione",
  "Autorizzazioni",
  "Approvvigionamento",
  "Cantiere",
  "Collaudo",
  "Consegna",
];

export const RESOURCES = [
  "Giulia Ferraro",
  "Marco Bellini",
  "Sara Colombo",
  "Luca De Santis",
  "Francesca Moretti",
  "Davide Rinaldi",
  "Anna Pavesi",
  "Pietro Sala",
  "Chiara Neri",
  "Elena Riva",
];

const WORKS = [
  "Rilievo e verifica dello stato di fatto",
  "Rifacimento impianto elettrico",
  "Ristrutturazione facciata e cappotto termico",
  "Nuovo impianto fotovoltaico 60 kWp",
  "Adeguamento antincendio",
  "Riqualificazione centrale termica",
  "Impianto di climatizzazione VRF",
  "Bonifica amianto e nuova copertura",
  "Illuminazione pubblica a LED",
  "Nuova pavimentazione industriale",
  "Impermeabilizzazione copertura",
  "Impianto idrico sanitario",
  "Posa in opera serramenti",
  "Realizzazione controsoffitti",
  "Verifica strutturale e consolidamento",
  "Asfaltatura area di manovra",
  "Impianto di rivelazione incendi",
  "Documentazione as-built e consegna",
];

const CLIENTS = [
  "Comune di Bergamo",
  "Immobiliare Lago Srl",
  "Condominio Via Manzoni 14",
  "ASST Papa Giovanni XXIII",
  "Fondazione Carlo Rossi Onlus",
  "Logistica Padana SpA",
  "Hotel Bellavista Sirmione",
  "Istituto Comprensivo Seriate",
  "Parrocchia San Giorgio",
  "Agricola Valcalepio",
  "Provincia di Brescia",
  "Università degli Studi di Bergamo",
];

export const TODAY = "2026-11-17";

export const parseISO = (value: string) => new Date(`${value}T12:00:00Z`);
export const iso = (date: Date) => date.toISOString().slice(0, 10);
export const addDays = (value: string, days: number) => {
  const date = parseISO(value);
  date.setUTCDate(date.getUTCDate() + days);
  return iso(date);
};
export const diffDays = (from: string, to: string) =>
  Math.round((parseISO(to).getTime() - parseISO(from).getTime()) / 86_400_000);
export const isWeekend = (value: string) => {
  const day = parseISO(value).getUTCDay();
  return day === 0 || day === 6;
};
export const startOfMonth = (value: string) => `${value.slice(0, 7)}-01`;
export const startOfQuarter = (value: string) => {
  const month = Number(value.slice(5, 7));
  const first = month - ((month - 1) % 3);
  return `${value.slice(0, 4)}-${String(first).padStart(2, "0")}-01`;
};

/** Working days between two dates, both included; at least one. */
export function workingDays(start: string, end: string) {
  let count = 0;
  for (let index = 0; index <= diffDays(start, end); index += 1)
    if (!isWeekend(addDays(start, index))) count += 1;
  return Math.max(1, count);
}

const random = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Quarantotto commesse, ognuna con le sue attività in sequenza: abbastanza righe
 * per provare la virtualizzazione e la ricerca su un volume reale.
 */
export function makeTasks(projects = 48, perProject = 44): Task[] {
  const next = random(20261117);
  const pick = <T,>(list: T[]) => list[Math.floor(next() * list.length)];
  const tasks: Task[] = [];
  for (let project = 0; project < projects; project += 1) {
    const parentId = `p-${project + 1}`;
    const client = pick(CLIENTS);
    const start = addDays("2025-09-01", Math.round(next() * 300));
    const total = 60 + Math.round(next() * 260);
    const parent: Task = {
      id: parentId,
      code: `C${2025 + Math.floor(next() * 2)}-${String(1000 + project).padStart(4, "0")}`,
      name: client,
      resource: pick(RESOURCES),
      start,
      end: addDays(start, total),
      progress: Math.round(next() * 100),
      hours: 0,
      deps: [],
      baseline: {
        start: addDays(start, -Math.round(next() * 12)),
        end: addDays(start, total + Math.round(next() * 20)),
      },
    };
    tasks.push(parent);
    let cursor = start;
    let previous = "";
    for (let index = 0; index < perProject; index += 1) {
      const span = index === 0 ? 2 + Math.round(next() * 8) : 1 + Math.round(next() * 14);
      const milestone = index > 0 && next() < 0.12;
      const taskStart = milestone ? cursor : addDays(cursor, Math.round(next() * 3));
      const taskEnd = milestone ? taskStart : addDays(taskStart, span);
      const hours = 0;
      const id = `${parentId}-${index + 1}`;
      tasks.push({
        id,
        code: `${parent.code}.${String(index + 1).padStart(2, "0")}`,
        name: `${pick(WORKS)}${milestone ? " · consegna" : ""}`,
        parent: parentId,
        resource: pick(RESOURCES),
        start: taskStart,
        end: taskEnd,
        progress: Math.round(next() * 100),
        milestone,
        hours,
        deps: previous && next() < 0.75 ? [previous] : [],
        baseline:
          next() < 0.6
            ? {
                start: addDays(taskStart, -Math.round(next() * 10)),
                end: addDays(taskEnd, Math.round(next() * 14)),
              }
            : undefined,
      });
      previous = id;
      cursor = addDays(taskEnd, 1 + Math.round(next() * 4));
    }
  }
  return spreadHours(tasks, next);
}

/**
 * Hours per activity follow the number of activities the same resource already carries:
 * the daily commitment lands near capacity, and only the busiest weeks overload it.
 */
function spreadHours(tasks: Task[], next: () => number) {
  const byResource = new Map<string, Task[]>();
  for (const task of tasks) {
    if (!task.parent || task.milestone) continue;
    const list = byResource.get(task.resource) ?? [];
    list.push(task);
    byResource.set(task.resource, list);
  }
  for (const list of byResource.values()) {
    for (const task of list) {
      // Average over the whole span, so a task that overlaps a busy month does not
      // inherit the congestion of its first day alone.
      const span = Math.max(1, diffDays(task.start, task.end) + 1);
      let concurrent = 0;
      for (let offset = 0; offset < span; offset += 1) {
        const day = addDays(task.start, offset);
        concurrent += list.filter((other) => other.start <= day && other.end >= day).length;
      }
      concurrent = Math.max(1, concurrent / span);
      const daily = Math.min(CAPACITY, (CAPACITY / concurrent) * (0.5 + next() * 1.0));
      task.hours = Math.max(1, Math.round(workingDays(task.start, task.end) * daily));
    }
  }
  return tasks;
}

/** Hours a resource carries on one day, from the tasks that cover it. */
export function loadOn(tasks: Task[], resource: string, day: string) {
  if (isWeekend(day)) return 0;
  let hours = 0;
  for (const task of tasks) {
    // Project rows are summaries: the hours sit on the activities.
    if (!task.parent || task.resource !== resource || task.milestone) continue;
    if (day < task.start || day > task.end) continue;
    hours += task.hours / workingDays(task.start, task.end);
  }
  return Math.round(hours * 10) / 10;
}

export const CAPACITY = 8;
