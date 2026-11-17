// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import "../../src/index.js";
import type {
  BolleMenu,
  BolleNavigationDrawer,
  BolleSideSheet,
  BolleSnackbar,
  MenuEntry,
  MenuSelectDetail,
} from "../../src/index.js";
import dashboard from "@tabler/icons/outline/layout-dashboard.svg?raw";
import briefcase from "@tabler/icons/outline/briefcase.svg?raw";
import mapPin from "@tabler/icons/outline/map-pin.svg?raw";
import packageIcon from "@tabler/icons/outline/package.svg?raw";
import tool from "@tabler/icons/outline/tool.svg?raw";
import invoice from "@tabler/icons/outline/file-invoice.svg?raw";
import users from "@tabler/icons/outline/users.svg?raw";
import settings from "@tabler/icons/outline/settings.svg?raw";
import menuIcon from "@tabler/icons/outline/menu-2.svg?raw";
import dots from "@tabler/icons/outline/dots-vertical.svg?raw";
import grip from "@tabler/icons/outline/grip-vertical.svg?raw";
import alert from "@tabler/icons/outline/alert-triangle.svg?raw";
import refresh from "@tabler/icons/outline/refresh.svg?raw";
import bell from "@tabler/icons/outline/bell.svg?raw";
import calendar from "@tabler/icons/outline/calendar.svg?raw";
import arrowUpRight from "@tabler/icons/outline/arrow-up-right.svg?raw";
import arrowDownRight from "@tabler/icons/outline/arrow-down-right.svg?raw";
import minus from "@tabler/icons/outline/minus.svg?raw";
import photo from "@tabler/icons/outline/photo.svg?raw";
import fileText from "@tabler/icons/outline/file-text.svg?raw";
import check from "@tabler/icons/outline/check.svg?raw";
import clock from "@tabler/icons/outline/clock.svg?raw";
import plus from "@tabler/icons/outline/plus.svg?raw";
import close from "@tabler/icons/outline/x.svg?raw";
import download from "@tabler/icons/outline/download.svg?raw";
import chartBar from "@tabler/icons/outline/chart-bar.svg?raw";
import building from "@tabler/icons/outline/building.svg?raw";
import gauge from "@tabler/icons/outline/gauge.svg?raw";
import {
  activities,
  kpis,
  lateJobs,
  load,
  revenue,
  siteProgress,
  TODAY_LABEL,
  type Activity,
  type LateJob,
  type SiteProgress,
} from "./data.js";

const icon = (svg: string, extra = "") =>
  html`<span class="icon ${extra}" aria-hidden="true">${unsafeSVG(svg)}</span>`;

const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

/* Widgets ---------------------------------------------------------------- */
type WidgetId =
  | "kpi-active"
  | "kpi-value"
  | "kpi-late"
  | "kpi-handover"
  | "late"
  | "sites"
  | "revenue"
  | "activity"
  | "load";

interface Widget {
  id: WidgetId;
  title: string;
  subtitle: string;
  span: number;
  minSpan: number;
  icon: string;
  removable: boolean;
}

const WIDGETS: Widget[] = [
  { id: "kpi-active", title: "Commesse attive", subtitle: "42 su 248", span: 3, minSpan: 2, icon: gauge, removable: false },
  { id: "kpi-value", title: "Valore in corso", subtitle: "12,4 Mln €", span: 3, minSpan: 2, icon: building, removable: false },
  { id: "kpi-late", title: "In ritardo", subtitle: "7 commesse", span: 3, minSpan: 2, icon: alert, removable: false },
  { id: "kpi-handover", title: "Collaudi", subtitle: "3 questa settimana", span: 3, minSpan: 2, icon: check, removable: false },
  { id: "late", title: "Lavori in ritardo", subtitle: "6 commesse con scadenza superata", span: 8, minSpan: 4, icon: alert, removable: true },
  { id: "sites", title: "Avanzamento cantieri", subtitle: "5 cantieri aperti", span: 4, minSpan: 3, icon: mapPin, removable: true },
  { id: "revenue", title: "Fatturato", subtitle: "ultimi dodici mesi, in migliaia di €", span: 8, minSpan: 4, icon: chartBar, removable: true },
  { id: "activity", title: "Attività recenti", subtitle: "ultime 24 ore", span: 4, minSpan: 3, icon: clock, removable: true },
  { id: "load", title: "Carico per responsabile", subtitle: "ore assegnate su 40 settimanali", span: 12, minSpan: 4, icon: users, removable: true },
];

type Form = "compact" | "medium" | "expanded";
type Scenario = "normal" | "loading" | "empty" | "error";
type SecondaryTab = "detail" | "layout";

interface Selection {
  kind: "job";
  job: LateJob;
}

class ProtoShellApp extends LitElement {
  static properties = {
    form: { state: true },
    density: { state: true },
    scenario: { state: true },
    nav: { state: true },
    widgets: { state: true },
    secondaryOpen: { state: true },
    secondaryTab: { state: true },
    selection: { state: true },
    drag: { state: true },
    resizing: { state: true },
    announcement: { state: true },
    savedLayout: { state: true },
    drawerOpen: { state: true },
    narrowDrawer: { state: true },
  };

  declare form: Form;
  declare density: "comfortable" | "compact";
  declare scenario: Scenario;
  declare nav: string;
  declare widgets: Widget[];
  declare secondaryOpen: boolean;
  declare secondaryTab: SecondaryTab;
  declare selection: Selection | undefined;
  declare drag: { id: WidgetId; target: number; dx: number } | undefined;
  declare resizing: { id: WidgetId; span: number } | undefined;
  declare announcement: string;
  declare savedLayout: string;
  declare drawerOpen: boolean;
  declare narrowDrawer: boolean;

  private menuContext: { kind: "widget"; id: WidgetId } | { kind: "scenario" } | { kind: "nav" } | undefined;
  private layoutTimer?: ReturnType<typeof setTimeout>;
  private observer?: ResizeObserver;

  constructor() {
    super();
    this.form = "expanded";
    this.density = "comfortable";
    this.scenario = "normal";
    this.nav = "dashboard";
    this.widgets = WIDGETS.map((widget) => ({ ...widget }));
    this.secondaryOpen = false;
    this.secondaryTab = "detail";
    this.announcement = "";
    this.savedLayout = this.serialize();
    this.drawerOpen = false;
    this.narrowDrawer = false;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.observer = new ResizeObserver(() => this.measureForm());
    this.observer.observe(document.documentElement);
    this.measureForm();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }

  private measureForm() {
    const width = window.innerWidth;
    const form: Form = width < 840 ? "compact" : width < 1240 ? "medium" : "expanded";
    if (form === this.form) return;
    this.form = form;
    if (form === "compact" && this.secondaryOpen) this.secondaryTab = "detail";
  }

  private get text() {
    return {
      menu: "Apri la navigazione",
      dashboard: "Cruscotto",
      layout: "Layout",
      secondary: "Pannello secondario",
      close: "Chiudi",
      drag: "Trascina il riquadro",
      resize: "Larghezza del riquadro",
      saved: "Layout salvato",
    };
  }

  private serialize() {
    return JSON.stringify(this.widgets.map(({ id, span }) => ({ id, span })));
  }

  private persist(message = this.text.saved) {
    clearTimeout(this.layoutTimer);
    this.savedLayout = this.serialize();
    this.emit("layout-change", { layout: JSON.parse(this.savedLayout) });
    this.layoutTimer = setTimeout(() => this.notify(message), 60);
  }

  private emit(name: string, detail: unknown) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private notify(message: string) {
    const bar = this.querySelector<BolleSnackbar>("bolle-snackbar");
    if (!bar) return;
    bar.actionLabel = "";
    bar.show(message);
  }

  private announce(message: string) {
    this.announcement = "";
    requestAnimationFrame(() => (this.announcement = message));
  }

  /* Widgets: drag, resize, menu --------------------------------------- */

  private moveWidget(id: WidgetId, target: number) {
    const from = this.widgets.findIndex((widget) => widget.id === id);
    if (from < 0 || target < 0 || target >= this.widgets.length || from === target) return;
    const next = [...this.widgets];
    const [moved] = next.splice(from, 1);
    next.splice(target, 0, moved);
    this.widgets = next;
    this.announce(`${moved.title} in posizione ${target + 1} di ${next.length}.`);
    this.persist();
  }

  private startDrag(event: PointerEvent, widget: Widget) {
    if (event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);
    const cells = [...this.querySelectorAll<HTMLElement>("[data-widget]")];
    const index = this.widgets.findIndex((item) => item.id === widget.id);
    this.drag = { id: widget.id, target: index, dx: 0 };
    const startX = event.clientX;
    const move = (moveEvent: PointerEvent) => {
      if (!this.drag) return;
      let target = this.drag.target;
      cells.forEach((cell, position) => {
        const box = cell.getBoundingClientRect();
        if (
          moveEvent.clientX > box.left &&
          moveEvent.clientX < box.right &&
          moveEvent.clientY > box.top &&
          moveEvent.clientY < box.bottom
        )
          target = position;
      });
      this.drag = {
        ...this.drag,
        dx: moveEvent.clientX - startX,
        target,
      };
    };
    const keys = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key !== "Escape") return;
      stop();
      this.announce("Spostamento annullato.");
    };
    const stop = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
      window.removeEventListener("keydown", keys, true);
      const drag = this.drag;
      this.drag = undefined;
      if (drag) this.moveWidget(drag.id, drag.target);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
    window.addEventListener("keydown", keys, true);
  }

  private startResize(event: PointerEvent, widget: Widget) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget as HTMLElement;
    const grid = this.querySelector<HTMLElement>(".grid");
    if (!grid) return;
    const rtl = getComputedStyle(this).direction === "rtl";
    handle.setPointerCapture(event.pointerId);
    const gap = 16;
    const column = (grid.clientWidth - gap * 11) / 12 + gap;
    const startX = event.clientX;
    const startSpan = widget.span;
    this.resizing = { id: widget.id, span: startSpan };
    const move = (moveEvent: PointerEvent) => {
      const delta = ((moveEvent.clientX - startX) * (rtl ? -1 : 1)) / column;
      const span = Math.max(
        widget.minSpan,
        Math.min(12, Math.round(startSpan + delta)),
      );
      this.resizing = { id: widget.id, span };
    };
    const stop = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
      const resizing = this.resizing;
      this.resizing = undefined;
      if (!resizing || resizing.span === startSpan) return;
      this.widgets = this.widgets.map((item) =>
        item.id === widget.id ? { ...item, span: resizing.span } : item,
      );
      this.announce(
        `${widget.title} largo ${resizing.span} colonne su 12.`,
      );
      this.persist();
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  }

  private resizeWithKeys(event: KeyboardEvent, widget: Widget) {
    const rtl = getComputedStyle(this).direction === "rtl";
    const grow = rtl ? "ArrowLeft" : "ArrowRight";
    const shrink = rtl ? "ArrowRight" : "ArrowLeft";
    const span =
      event.key === grow
        ? Math.min(12, widget.span + 1)
        : event.key === shrink
          ? Math.max(widget.minSpan, widget.span - 1)
          : undefined;
    if (span === undefined) return;
    event.preventDefault();
    this.widgets = this.widgets.map((item) =>
      item.id === widget.id ? { ...item, span } : item,
    );
    this.announce(`${widget.title} largo ${span} colonne su 12.`);
    this.persist();
  }

  private widgetKeys(event: KeyboardEvent, widget: Widget) {
    if (!event.altKey) return;
    const rtl = getComputedStyle(this).direction === "rtl";
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = this.widgets.findIndex((item) => item.id === widget.id);
    const step = (event.key === "ArrowLeft") !== rtl ? -1 : 1;
    this.moveWidget(widget.id, index + step);
    void this.updateComplete.then(() =>
      this.querySelector<HTMLElement>(`[data-widget="${widget.id}"] .widget-grip`)?.focus(),
    );
  }

  private widgetMenu(event: Event, widget: Widget) {
    const index = this.widgets.findIndex((item) => item.id === widget.id);
    const items: MenuEntry[] = [
      {
        group: true,
        label: "Larghezza",
        items: [2, 3, 4, 6, 8, 12]
          .filter((span) => span >= widget.minSpan)
          .map((span) => ({
            id: `span:${span}`,
            label: `${span} colonne su 12`,
            selected: widget.span === span,
          })),
      },
      { separator: true },
      {
        id: "left",
        label: "Sposta prima",
        trailingText: "Alt ←",
        disabled: index === 0,
      },
      {
        id: "right",
        label: "Sposta dopo",
        trailingText: "Alt →",
        disabled: index === this.widgets.length - 1,
      },
      { separator: true },
      ...(widget.removable
        ? [{ id: "hide", label: "Nascondi il riquadro" }]
        : [{ id: "hide", label: "Questo riquadro resta sempre visibile", disabled: true }]),
    ];
    this.menuContext = { kind: "widget", id: widget.id };
    const menu = this.querySelector<BolleMenu>("bolle-menu#context");
    if (!menu) return;
    menu.items = items;
    menu.menuLabel = `Riquadro ${widget.title}`;
    menu.selectionMode = "none";
    void menu.show(event.currentTarget as HTMLElement);
  }

  private onMenuSelect(event: CustomEvent<MenuSelectDetail>) {
    const context = this.menuContext;
    if (!context) return;
    if (context.kind === "scenario") {
      const id = event.detail.item.id;
      if (id === "layout") {
        this.secondaryTab = "layout";
        this.secondaryOpen = true;
        if (this.form === "compact") this.narrowDrawer = true;
        return;
      }
      if (id === "reset") return this.resetLayout();
      return this.setScenario(id);
    }
    if (context.kind === "nav") {
      this.nav = event.detail.item.id;
      return;
    }
    const widget = this.widgets.find((item) => item.id === context.id);
    if (!widget) return;
    const index = this.widgets.findIndex((item) => item.id === widget.id);
    const id = event.detail.item.id;
    if (id.startsWith("span:")) {
      const span = Number(id.slice(5));
      this.widgets = this.widgets.map((item) =>
        item.id === widget.id ? { ...item, span } : item,
      );
      this.announce(`${widget.title} largo ${span} colonne su 12.`);
      this.persist();
    } else if (id === "left") this.moveWidget(widget.id, index - 1);
    else if (id === "right") this.moveWidget(widget.id, index + 1);
    else if (id === "hide") {
      this.widgets = this.widgets.filter((item) => item.id !== widget.id);
      this.announce(`${widget.title} nascosto.`);
      this.persist("Riquadro nascosto. Lo riporti dal menu Layout.");
    }
  }

  private setScenario(id: string) {
    this.scenario = id as Scenario;
  }

  private scenarioMenu(event: Event) {
    this.menuContext = { kind: "scenario" };
    const menu = this.querySelector<BolleMenu>("bolle-menu#context");
    if (!menu) return;
    menu.items = [
      {
        group: true,
        label: "Stato dei riquadri",
        items: [
          { id: "normal", label: "Con dati", selected: this.scenario === "normal" },
          { id: "loading", label: "Caricamento", selected: this.scenario === "loading" },
          { id: "empty", label: "Senza dati", selected: this.scenario === "empty" },
          { id: "error", label: "Errore", selected: this.scenario === "error" },
        ],
      },
      { separator: true },
      { id: "layout", label: "Vedi il layout salvato" },
      { id: "reset", label: "Ripristina il layout" },
    ];
    menu.menuLabel = "Scenario di prova";
    menu.selectionMode = "none";
    void menu.show(event.currentTarget as HTMLElement);
  }

  private resetLayout() {
    this.widgets = WIDGETS.map((widget) => ({ ...widget }));
    this.announce("Layout ripristinato.");
    this.persist("Layout ripristinato.");
  }

  private navMenu(event: Event) {
    this.menuContext = { kind: "nav" };
    const menu = this.querySelector<BolleMenu>("bolle-menu#context");
    if (!menu) return;
    menu.items = this.navItems().map((item) => ({
      id: item.id,
      label: item.label,
      selected: item.id === this.nav,
    }));
    menu.menuLabel = this.text.menu;
    menu.selectionMode = "single";
    menu.setSelection([this.nav]);
    void menu.show(event.currentTarget as HTMLElement);
  }

  private navItems() {
    return [
      { id: "dashboard", label: "Cruscotto", icon: dashboard },
      { id: "jobs", label: "Commesse", icon: briefcase, badge: "12" },
      { id: "sites", label: "Cantieri", icon: mapPin },
      { id: "stock", label: "Magazzino", icon: packageIcon },
      { id: "maintenance", label: "Manutenzioni", icon: tool, badge: "5" },
      { id: "billing", label: "Amministrazione", icon: invoice },
      { id: "people", label: "Personale", icon: users },
      { id: "settings", label: "Impostazioni", icon: settings },
    ];
  }

  /* Widget bodies ------------------------------------------------------ */

  private widgetState(widget: Widget) {
    if (this.scenario === "loading")
      return html`<div class="wstate">
        <bolle-loading-indicator label="Caricamento del riquadro"></bolle-loading-indicator>
        <p>Caricamento…</p>
      </div>`;
    if (this.scenario === "error")
      return html`<div class="wstate" role="alert">
        ${icon(alert, "wstate-icon error")}
        <p>Dati non disponibili</p>
        <bolle-button variant="text" size="xs" @click=${() => this.setScenario("normal")}
          >${icon(refresh)} Riprova</bolle-button
        >
      </div>`;
    if (this.scenario === "empty")
      return html`<div class="wstate">
        ${icon(chartBar, "wstate-icon")}
        <p>Nessun dato per questo periodo</p>
      </div>`;
    return undefined;
  }

  private kpiBody(widget: Widget) {
    const kpi = {
      "kpi-active": kpis[0],
      "kpi-value": kpis[1],
      "kpi-late": kpis[2],
      "kpi-handover": kpis[3],
    }[widget.id as "kpi-active" | "kpi-value" | "kpi-late" | "kpi-handover"];
    if (!kpi) return nothing;
    return html`<div class="kpi tone-${kpi.tone}" dir="auto">
      <p class="kpi-value">${kpi.value}</p>
      <p class="kpi-detail">${kpi.detail}</p>
      <p class="kpi-trend trend-${kpi.trend}">
        ${icon(kpi.trend === "up" ? arrowUpRight : kpi.trend === "down" ? arrowDownRight : minus)}
        ${kpi.trendLabel}
      </p>
    </div>`;
  }

  private lateBody() {
    return html`<ul class="late-list">
      ${lateJobs.map(
        (job) => html`<li>
          <button class="late-row" @click=${() => this.openJob(job)}>
            <span class="late-main" dir="auto">
              <span class="late-code">${job.code}</span>
              <span class="late-title">${job.title}</span>
              <span class="late-meta">${job.client} · ${job.city}</span>
            </span>
            <span class="late-days">${job.days} gg</span>
            <span class="late-progress">
              <bolle-progress-indicator
                value=${job.progress}
                label=${`Avanzamento ${job.code}`}
              ></bolle-progress-indicator>
              <span class="num">${job.progress}%</span>
            </span>
            <span class="late-amount num">${euro.format(job.amount)}</span>
          </button>
        </li>`,
      )}
    </ul>`;
  }

  private sitesBody() {
    return html`<ul class="site-list">
      ${siteProgress.map(
        (site) => html`<li>
          <div class="site-head">
            <span class="site-name" dir="auto">${site.name}</span>
            <span class="num">${site.progress}%</span>
          </div>
          <bolle-progress-indicator
            value=${site.progress}
            label=${`Avanzamento ${site.name}`}
          ></bolle-progress-indicator>
          <p class="site-meta" dir="auto">
            ${site.city} · ${site.phase} · ${site.people} persone
          </p>
        </li>`,
      )}
    </ul>`;
  }

  private revenueBody() {
    const max = Math.max(...revenue.map((item) => item.value));
    const points = revenue
      .map((item, index) => {
        const x = (index / (revenue.length - 1)) * 100;
        const y = 100 - (item.value / max) * 84;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
    return html`<div class="revenue">
      <svg class="spark" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--md-sys-color-primary)" stop-opacity="0.28"></stop>
            <stop offset="100%" stop-color="var(--md-sys-color-primary)" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        <polygon points="0,100 ${points} 100,100" fill="url(#rev-fill)"></polygon>
        <polyline
          points=${points}
          fill="none"
          stroke="var(--md-sys-color-primary)"
          stroke-width="1.6"
          vector-effect="non-scaling-stroke"
        ></polyline>
      </svg>
      <ol class="revenue-months" aria-label="Fatturato per mese">
        ${revenue.map(
          (item) => html`<li>
            <span class="bar" style=${`block-size:${Math.round((item.value / max) * 100)}%`}></span>
            <span class="month">${item.month}</span>
          </li>`,
        )}
      </ol>
      <p class="sr-only">
        Fatturato da 410 a 1240 mila euro, massimo a giugno.
      </p>
    </div>`;
  }

  private activityIcon(kind: Activity["kind"]) {
    return { foto: photo, documento: fileText, collaudo: check, nota: clock }[kind];
  }

  private activityBody() {
    return html`<ul class="activity-list">
      ${activities.map(
        (item) => html`<li>
          <span class="avatar" aria-hidden="true">${initials(item.who)}</span>
          <span class="activity-main" dir="auto">
            <span><strong>${item.who}</strong> ${item.what}</span>
            <span class="activity-meta">
              ${icon(this.activityIcon(item.kind), "tiny")} ${item.target} · ${item.when}
            </span>
          </span>
        </li>`,
      )}
    </ul>`;
  }

  private loadBody() {
    return html`<ul class="load-list">
      ${load.map(
        (person) => html`<li>
          <span class="load-name" dir="auto">${person.name}</span>
          <span class="load-bar">
            <bolle-progress-indicator
              value=${Math.min(100, (person.hours / person.capacity) * 100)}
              label=${`Carico di ${person.name}`}
            ></bolle-progress-indicator>
          </span>
          <span class="num load-hours ${person.hours > person.capacity ? "over" : ""}"
            >${person.hours} / ${person.capacity} h</span
          >
          <span class="load-jobs">${person.jobs} commesse</span>
        </li>`,
      )}
    </ul>`;
  }

  private widgetBody(widget: Widget) {
    const state = this.widgetState(widget);
    if (state) return state;
    if (widget.id.startsWith("kpi-")) return this.kpiBody(widget);
    if (widget.id === "late") return this.lateBody();
    if (widget.id === "sites") return this.sitesBody();
    if (widget.id === "revenue") return this.revenueBody();
    if (widget.id === "activity") return this.activityBody();
    return this.loadBody();
  }

  /* Secondary pane ----------------------------------------------------- */

  private openJob(job: LateJob) {
    this.selection = { kind: "job", job };
    this.secondaryTab = "detail";
    this.secondaryOpen = true;
    if (this.form === "compact") this.narrowDrawer = true;
  }

  private closeSecondary() {
    this.secondaryOpen = false;
    this.narrowDrawer = false;
  }

  private renderDetail() {
    const job = this.selection?.job;
    if (!job)
      return html`<p class="secondary-empty">
        Scegli una commessa dall'elenco dei ritardi per vederne il dettaglio.
      </p>`;
    return html`<div class="detail">
      <p class="detail-kicker">${job.client} · ${job.city}</p>
      <h2 class="detail-title" dir="auto">${job.title}</h2>
      <p class="detail-code">${job.code}</p>
      <dl class="detail-facts">
        <div><dt>Responsabile</dt><dd>${job.manager}</dd></div>
        <div><dt>Ritardo</dt><dd class="late-value">${job.days} giorni</dd></div>
        <div><dt>Importo</dt><dd class="num">${euro.format(job.amount)}</dd></div>
        <div><dt>Avanzamento</dt><dd class="num">${job.progress}%</dd></div>
      </dl>
      <bolle-progress-indicator
        value=${job.progress}
        label="Avanzamento della commessa"
      ></bolle-progress-indicator>
      <div class="detail-actions">
        <bolle-button variant="tonal" size="xs">Apri scheda</bolle-button>
        <bolle-button variant="text" size="xs">${icon(download)} Scarica rapportino</bolle-button>
      </div>
    </div>`;
  }

  private renderLayoutPanel() {
    const parsed = JSON.parse(this.savedLayout) as { id: string; span: number }[];
    return html`<div class="layout-panel">
      <p class="panel-lead">
        Il layout lo conserva l'applicazione: ogni modifica arriva con l'evento
        <code>layout-change</code>. Questo è quello che riceverebbe.
      </p>
      <pre class="layout-json">${this.savedLayout}</pre>
      <ol class="layout-list">
        ${parsed.map((item, index) => {
          const widget = this.widgets.find((entry) => entry.id === item.id);
          return html`<li>
            <span class="layout-index">${index + 1}</span>
            <span class="layout-name">${widget?.title ?? item.id}</span>
            <span class="layout-span">${item.span}/12</span>
          </li>`;
        })}
      </ol>
      <bolle-button variant="tonal" size="xs" @click=${() => this.resetLayout()}
        >Ripristina il layout</bolle-button
      >
    </div>`;
  }

  /* Shell -------------------------------------------------------------- */

  private renderNav() {
    if (this.form === "compact") return nothing;
    return html`<bolle-sidebar
      class="shell-nav"
      label="Navigazione principale"
      search="none"
      ?collapsed=${this.form === "medium"}
      .width=${264}
      .items=${this.navItems().map((item) => ({ ...item, icon: icon(item.icon) }))}
      current=${this.nav}
      @navigate=${(event: CustomEvent<{ path: string }>) => {
        this.nav = event.detail.path.split("/")[0];
      }}
    >
      <span slot="header" class="brand">Cantieri Rossi</span>
    </bolle-sidebar>`;
  }

  private renderWidget(widget: Widget) {
    const dragging = this.drag?.id === widget.id;
    const dropTarget =
      this.drag && !dragging && this.widgets[this.drag.target]?.id === widget.id;
    const span = Math.min(
      12,
      this.resizing?.id === widget.id ? this.resizing.span : widget.span,
    );
    return html`<article
      class="widget ${dragging ? "dragging" : ""} ${dropTarget ? "drop-target" : ""}"
      data-widget=${widget.id}
      data-span=${span}
      data-kind=${widget.id.startsWith("kpi-") ? "kpi" : "panel"}
      aria-labelledby=${`h-${widget.id}`}
    >
      <header class="widget-head">
        <button
          class="widget-grip"
          aria-label=${`${this.text.drag}: ${widget.title}`}
          @pointerdown=${(event: PointerEvent) => this.startDrag(event, widget)}
          @keydown=${(event: KeyboardEvent) => this.widgetKeys(event, widget)}
          >${icon(grip)}</button
        >
        <span class="widget-icon" aria-hidden="true">${icon(widget.icon)}</span>
        <div class="widget-titles" dir="auto">
          <h2 id=${`h-${widget.id}`}>${widget.title}</h2>
          <p>${widget.subtitle}</p>
        </div>
        <bolle-icon-button
          variant="standard"
          size="xs"
          label=${`Opzioni del riquadro ${widget.title}`}
          haspopup="menu"
          @click=${(event: Event) => this.widgetMenu(event, widget)}
          >${icon(dots)}</bolle-icon-button
        >
      </header>
      <div class="widget-body">${this.widgetBody(widget)}</div>
      <span
        class="widget-resize"
        role="separator"
        tabindex="0"
        aria-orientation="vertical"
        aria-label=${`${this.text.resize}: ${widget.title}`}
        aria-valuemin=${widget.minSpan}
        aria-valuemax="12"
        aria-valuenow=${span}
        @pointerdown=${(event: PointerEvent) => this.startResize(event, widget)}
        @keydown=${(event: KeyboardEvent) => this.resizeWithKeys(event, widget)}
      ></span>
    </article>`;
  }

  private renderSecondary(modal: boolean) {
    const content = html`<div class="secondary-body">
      <bolle-tabs
        class="secondary-tabs"
        variant="secondary"
        label="Contenuto del pannello"
        .items=${[
          { id: "detail", label: "Dettaglio" },
          { id: "layout", label: this.text.layout },
        ]}
        .value=${this.secondaryTab}
        @change=${(event: CustomEvent<{ value: string }>) =>
          (this.secondaryTab = event.detail.value as SecondaryTab)}
      >
        <div slot="detail">${this.renderDetail()}</div>
        <div slot="layout">${this.renderLayoutPanel()}</div>
      </bolle-tabs>
    </div>`;
    if (modal)
      return html`<bolle-side-sheet
        id="secondary"
        label=${this.text.secondary}
        close-label=${this.text.close}
        ?open=${this.narrowDrawer}
        @closed=${() => this.closeSecondary()}
      >
        ${content}
      </bolle-side-sheet>`;
    return html`<aside class="secondary" aria-label=${this.text.secondary}>
      <header class="secondary-head">
        <span class="secondary-title"
          >${this.secondaryTab === "detail" ? "Commessa" : this.text.layout}</span
        >
        <bolle-icon-button
          variant="standard"
          size="xs"
          label=${this.text.close}
          @click=${() => this.closeSecondary()}
          >${icon(close)}</bolle-icon-button
        >
      </header>
      ${content}
    </aside>`;
  }

  private renderStatusBar() {
    return html`<footer class="status" role="contentinfo">
      <span dir="auto">${this.widgets.length} riquadri</span>
      <span class="dot" aria-hidden="true">·</span>
      <span dir="auto">Ultimo aggiornamento 22:31</span>
      <span class="spacer"></span>
      <span class="status-form">
        ${this.form === "expanded"
          ? "Schermo ampio: navigazione estesa e pannello affiancato"
          : this.form === "medium"
            ? "Schermo medio: navigazione a rail"
            : "Schermo stretto: barra in basso"}
      </span>
    </footer>`;
  }

  protected render() {
    const compact = this.form === "compact";
    return html`<div class="app" data-form=${this.form} data-density=${this.density}>
      <bolle-app-bar
        class="shell-bar"
        variant="small"
        .subtitle=${compact ? "" : TODAY_LABEL}
      >
        ${compact
          ? html`<bolle-icon-button
              slot="leading"
              variant="standard"
              label=${this.text.menu}
              @click=${(event: Event) => this.navMenu(event)}
              >${icon(menuIcon)}</bolle-icon-button
            >`
          : nothing}
        <span class="bar-title">Cruscotto</span>
        <div slot="trailing" class="bar-actions">
          ${compact
            ? html`<bolle-icon-button
                  variant="standard"
                  label="Altre opzioni"
                  haspopup="menu"
                  @click=${(event: Event) => this.scenarioMenu(event)}
                  >${icon(dots)}</bolle-icon-button
                >
                <div class="bell">
                  ${icon(bell)}<span class="bell-count" aria-hidden="true">3</span>
                  <span class="sr-only">Notifiche: 3 non lette</span>
                </div>`
            : html`<bolle-segmented-buttons
                  class="density-switch"
                  label="Densità"
                  .value=${this.density}
                  .items=${[
                    { id: "comfortable", label: "Comoda" },
                    { id: "compact", label: "Compatta" },
                  ]}
                  @change=${(event: CustomEvent<{ value: string }>) =>
                    (this.density = event.detail.value as "comfortable" | "compact")}
                ></bolle-segmented-buttons>
                <bolle-button
                  variant="text"
                  size="xs"
                  haspopup="menu"
                  @click=${(event: Event) => this.scenarioMenu(event)}
                  >Scenario di prova</bolle-button
                >
                <bolle-icon-button
                  variant="standard"
                  label="Vedi il layout salvato"
                  ?selected=${this.secondaryOpen}
                  toggle
                  @click=${() => {
                    this.secondaryTab = "layout";
                    this.secondaryOpen = true;
                  }}
                  >${icon(calendar)}</bolle-icon-button
                >
                <div class="bell">
                  ${icon(bell)}<span class="bell-count" aria-hidden="true">3</span>
                  <span class="sr-only">Notifiche: 3 non lette</span>
                </div>`}
        </div>
      </bolle-app-bar>

      <div class="shell-body">
        ${this.renderNav()}
        <main class="content" id="main">
          <div class="content-head">
            <p class="content-sub" dir="auto">
              ${this.form === "expanded"
                ? "Schermo ampio: navigazione estesa e pannello affiancato."
                : this.form === "medium"
                  ? "Schermo medio: navigazione a rail."
                  : "Schermo stretto: barra di navigazione in basso."}
              42 commesse attive · 7 in ritardo · 3 collaudi questa settimana.
            </p>
            <div class="content-actions">
              <bolle-button variant="tonal" size="xs">${icon(plus)} Nuova commessa</bolle-button>
              <bolle-button variant="outlined" size="xs"
                >${icon(download)} Esporta</bolle-button
              >
            </div>
          </div>
          <section class="grid" aria-label="Riquadri del cruscotto">
            ${this.widgets.map((widget) => this.renderWidget(widget))}
          </section>
          ${this.widgets.length === 0
            ? html`<div class="grid-empty">
                ${icon(chartBar, "wstate-icon")}
                <p>Nessun riquadro visibile</p>
                <bolle-button variant="tonal" size="xs" @click=${() => this.resetLayout()}
                  >Ripristina il layout</bolle-button
                >
              </div>`
            : nothing}
        </main>
        ${!compact && this.secondaryOpen ? this.renderSecondary(false) : nothing}
      </div>

      ${this.renderStatusBar()}

      ${compact
        ? html`<bolle-navigation-bar
            class="shell-bottom"
            label="Navigazione principale"
            .items=${this.navItems()
              .slice(0, 4)
              .map((item) => ({ ...item, icon: icon(item.icon), badge: undefined }))}
            .value=${this.nav}
            @navigate=${(event: CustomEvent<{ id: string }>) => (this.nav = event.detail.id)}
          ></bolle-navigation-bar>`
        : nothing}
      ${this.renderSecondary(true)}
      <bolle-menu id="context" menu-label="Azioni" @menu-select=${this.onMenuSelect}></bolle-menu>
      <bolle-snackbar close-label="Chiudi"></bolle-snackbar>
      <p class="sr-only" role="status" aria-live="polite">${this.announcement}</p>
    </div>`;
  }
}

customElements.define("proto-shell-app", ProtoShellApp);
