import { LitElement, html, nothing } from "lit";
import "../src/index.js";
import type {
  GanttChangeDetail,
  GanttGroup,
  GanttScale,
  GanttTask,
  GanttTaskDetail,
} from "../src/index.js";
import { l, m, locale, LOCALES } from "./i18n.js";

const CLIENTS = [
  "Provincia di Brescia",
  "Hotel Bellavista Sirmione",
  "Immobiliare Lago Srl",
  "ASST Papa Giovanni XXIII",
  "Agricola Valcalepio",
  "Logistica Padana SpA",
  "Fondazione Carlo Rossi Onlus",
  "Comune di Bergamo",
  "Consorzio Irriguo Seriate",
  "Residenze Al Portico",
];

const RESOURCES = [
  "Giulia Ferraro",
  "Marco Bellini",
  "Sara Colombo",
  "Luca De Santis",
  "Francesca Moretti",
  "Davide Rinaldi",
  "Anna Pavesi",
  "Pietro Sala",
];

const PHASES = [
  "Progettazione",
  "Autorizzazioni",
  "Approvvigionamento",
  "Cantiere",
  "Collaudo",
  "Consegna",
];

const WORKS = [
  "Rilievo e verifica dello stato di fatto",
  "Rifacimento impianto elettrico",
  "Ristrutturazione facciata e cappotto termico",
  "Nuovo impianto fotovoltaico 60 kWp",
  "Adeguamento antincendio",
  "Riqualificazione centrale termica",
  "Impianto di climatizzazione VRF",
  "Nuova pavimentazione industriale",
  "Bonifica amianto e nuova copertura",
  "Posa in opera serramenti",
  "Documentazione as-built e consegna",
  "Verifica strutturale e consolidamento",
  "Impianto idrico sanitario",
  "Illuminazione pubblica a LED",
];

let seed = 20261117;
const next = () => {
  seed = (seed + 0x6d2b79f5) % 4294967296;
  return ((seed * 16807) % 2147483647) / 2147483647;
};
const pick = <T>(list: T[]) => list[Math.floor(next() * list.length)];

const parseISO = (value: string) => new Date(`${value}T00:00:00Z`);
const iso = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (value: string, days: number) => {
  const date = parseISO(value);
  date.setUTCDate(date.getUTCDate() + days);
  return iso(date);
};
const diffDays = (from: string, to: string) =>
  Math.round((parseISO(to).getTime() - parseISO(from).getTime()) / 86_400_000);
const isWeekend = (value: string) =>
  [0, 6].includes(parseISO(value).getUTCDay());
const workingDays = (from: string, to: string) => {
  let days = 0;
  for (let day = from; day <= to; day = addDays(day, 1))
    if (!isWeekend(day)) days += 1;
  return days;
};
const TODAY = iso(new Date());

/** Ten jobs of a construction firm, each with its own chain of activities. */
function makeTasks(): GanttTask[] {
  // Same plan for every instance, so the variant rows compare the same data.
  seed = 20261117;
  const tasks: GanttTask[] = [];
  for (let project = 0; project < 10; project += 1) {
    const parentId = `p-${project + 1}`;
    const start = addDays(TODAY, -140 + project * 26);
    const total = 90 + Math.round(next() * 180);
    const parent: GanttTask = {
      id: parentId,
      code: `C${2026}-${String(1000 + project)}`,
      name: pick(CLIENTS),
      resource: pick(RESOURCES),
      phase: PHASES[0],
      start,
      end: addDays(start, total),
      progress: Math.round(next() * 100),
      hours: 0,
      deps: [],
      baseline: {
        start: addDays(start, -Math.round(next() * 10)),
        end: addDays(start, total + 12),
      },
    };
    tasks.push(parent);
    let cursor = start;
    let previous = "";
    const count = 10 + Math.round(next() * 8);
    for (let index = 0; index < count; index += 1) {
      const span = 2 + Math.round(next() * 12);
      const milestone = index === count - 1;
      const taskStart = milestone
        ? cursor
        : addDays(cursor, Math.round(next() * 3));
      const taskEnd = milestone ? taskStart : addDays(taskStart, span);
      const id = `${parentId}-${index + 1}`;
      tasks.push({
        id,
        code: `${parent.code}.${String(index + 1).padStart(2, "0")}`,
        name: milestone ? `${l(m("Consegna lavori"))}` : pick(WORKS),
        parent: parentId,
        resource: pick(RESOURCES),
        phase: PHASES[Math.min(PHASES.length - 1, Math.floor(index / 3))],
        start: taskStart,
        end: taskEnd,
        progress: milestone ? 100 : Math.round(next() * 100),
        milestone,
        hours: milestone ? 0 : Math.round((span + 1) * (2 + next() * 4)),
        deps: previous && next() < 0.8 ? [previous] : [],
        baseline:
          next() < 0.55
            ? {
                start: addDays(taskStart, -Math.round(next() * 8)),
                end: addDays(taskEnd, Math.round(next() * 10)),
              }
            : undefined,
      });
      previous = id;
      cursor = addDays(taskEnd, 1 + Math.round(next() * 3));
    }
  }
  return tasks;
}

const dateLabel = (value: string) =>
  new Intl.DateTimeFormat(
    LOCALES.find((item) => item.id === locale())?.tag ?? "en",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  ).format(parseISO(value));

/** Documentation preview: the surface plus the state the application keeps. */
export class BolleGanttDemo extends LitElement {
  static properties = {
    scale: { reflect: true },
    density: { reflect: true },
    baseline: { type: Boolean },
    editable: { type: Boolean },
    linkable: { type: Boolean },
    groupBy: { attribute: "group-by" },
    label: {},
    selected: { state: true },
  };

  declare scale: GanttScale;
  declare density: "comfortable" | "compact";
  declare baseline: boolean;
  declare editable: boolean;
  declare linkable: boolean;
  declare groupBy: GanttGroup;
  declare label: string;
  declare selected: string;

  private tasks: GanttTask[] = makeTasks();
  /** Position of every activity when the plan was loaded: the floor of the move rule. */
  private planned = new Map(this.tasks.map((task) => [task.id, task.start]));

  constructor() {
    super();
    this.scale = "week";
    this.density = "comfortable";
    this.baseline = true;
    this.groupBy = "";
    this.label = l(m("Pianificazione lavori"));
    this.selected = "";
  }

  createRenderRoot() {
    return this;
  }

  /** Rule of the application: the surface only asks, the page decides. */
  private restrict = ({ task, start }: { task: GanttTask; start: string }) => {
    const planned = this.planned.get(task.id) ?? task.start;
    const floor = planned < TODAY ? planned : TODAY;
    if (start < floor)
      return `${l(m("Non si sposta un'attività prima del"))} ${dateLabel(floor)}.`;
    if (task.milestone && isWeekend(start))
      return l(m("Una scadenza non cade di sabato o domenica."));
    return undefined;
  };

  private onChange = (event: Event) => {
    const detail = (event as CustomEvent<GanttChangeDetail>).detail;
    this.tasks = this.tasks.map((task) =>
      task.id === detail.task.id
        ? { ...task, start: detail.start, end: detail.end }
        : task,
    );
    this.requestUpdate();
  };

  private onBlocked = (event: Event) => {
    const detail = (event as CustomEvent<GanttChangeDetail>).detail;
    this.report(detail.reason ?? "");
  };

  private onDependency = (event: Event) => {
    const detail = (
      event as CustomEvent<{ task: GanttTask; predecessor: GanttTask }>
    ).detail;
    this.tasks = this.tasks.map((task) =>
      task.id === detail.task.id
        ? { ...task, deps: [...(task.deps ?? []), detail.predecessor.id] }
        : task,
    );
    this.requestUpdate();
  };

  private onOpen = (event: Event) => {
    const detail = (event as CustomEvent<GanttTaskDetail>).detail;
    this.selected = detail.task.id;
  };

  private report(message: string) {
    if (!message) return;
    this.dispatchEvent(
      new CustomEvent("demo-report", {
        detail: message,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private get openTask() {
    return this.tasks.find((task) => task.id === this.selected);
  }

  private renderDetail() {
    const task = this.openTask;
    if (!task) return nothing;
    const children = this.tasks.filter((item) => item.parent === task.id);
    let hours = 0;
    for (const child of children.length ? children : [task])
      if (child.hours)
        hours += child.hours / Math.max(1, workingDays(child.start, child.end));
    return html`<bolle-side-sheet
      label=${`${task.code ?? ""} ${task.name}`}
      close-label=${l(m("Chiudi il dettaglio"))}
      @closed=${() => (this.selected = "")}
    >
      <div class="gdetail">
        <span class="gcode">${task.code ?? ""}</span>
        <h2>${task.name}</h2>
        <dl class="gfacts">
          <div>
            <dt>${l(m("Responsabile"))}</dt>
            <dd>${task.resource ?? "—"}</dd>
          </div>
          <div>
            <dt>${l(m("Fase"))}</dt>
            <dd>${task.phase ?? "—"}</dd>
          </div>
          <div>
            <dt>${l(m("Inizio"))}</dt>
            <dd>${dateLabel(task.start)}</dd>
          </div>
          <div>
            <dt>${l(m("Fine"))}</dt>
            <dd>${dateLabel(task.end)}</dd>
          </div>
          <div>
            <dt>${l(m("Durata"))}</dt>
            <dd>
              ${task.milestone ? l(m("milestone")) : `${diffDays(task.start, task.end) + 1} ${l(m("giorni"))}`}
            </dd>
          </div>
          <div>
            <dt>${l(m("Carico"))}</dt>
            <dd>${hours ? `${hours.toFixed(1)} h/${l(m("giorno"))}` : "—"}</dd>
          </div>
          <div>
            <dt>${l(m("Avanzamento"))}</dt>
            <dd>${task.progress ?? 0}%</dd>
          </div>
          ${
            task.baseline
              ? html`<div>
                  <dt>${l(m("Piano approvato"))}</dt>
                  <dd>
                    ${dateLabel(task.baseline.start)} →
                    ${dateLabel(task.baseline.end)}
                  </dd>
                </div>`
              : nothing
          }
          <div>
            <dt>${l(m("Predecessori"))}</dt>
            <dd class="gchips">
              ${
                (task.deps ?? []).length
                  ? (task.deps ?? []).map((dep) => {
                      const found = this.tasks.find((item) => item.id === dep);
                      return html`<span class="gchip"
                        >${found?.code ?? dep}</span
                      >`;
                    })
                  : l(m("nessuno"))
              }
            </dd>
          </div>
          ${
            children.length
              ? html`<div>
                  <dt>${l(m("Attività figlie"))}</dt>
                  <dd>${children.length}</dd>
                </div>`
              : nothing
          }
        </dl>
      </div>
    </bolle-side-sheet>`;
  }

  protected updated() {
    const sheet = this.querySelector<
      HTMLElement & { show(): Promise<void>; open: boolean }
    >("bolle-side-sheet");
    if (sheet && this.selected && !sheet.open) void sheet.show();
  }

  protected render() {
    return html`<bolle-gantt
        .label=${this.label}
        .tasks=${this.tasks}
        .scale=${this.scale}
        .density=${this.density}
        ?baseline=${this.baseline}
        ?editable=${this.editable}
        ?linkable=${this.linkable}
        .groupBy=${this.groupBy}
        .selected=${this.selected}
        .restrict=${this.restrict}
        @task-change=${this.onChange}
        @task-change-blocked=${this.onBlocked}
        @dependency-add=${this.onDependency}
        @task-open=${this.onOpen}
      ></bolle-gantt>
      ${this.renderDetail()}`;
  }
}

if (!customElements.get("demo-gantt"))
  customElements.define("demo-gantt", BolleGanttDemo);
