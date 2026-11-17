import { LitElement, html, nothing, type TemplateResult } from "lit";
import "../src/index.js";
import type {
  DashboardLayoutDetail,
  SidebarItem,
} from "../src/index.js";
import { m } from "./i18n.js";
import { ti } from "../demo/icons.js";
import { activities, kpis, lateJobs, load, revenue, siteProgress } from "./shell-data.js";

const euro = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const navItems = (): SidebarItem[] => [
  { id: "dashboard", label: m("Cruscotto"), icon: ti("layout-dashboard") },
  { id: "jobs", label: m("Commesse"), icon: ti("briefcase"), count: 12 },
  { id: "sites", label: m("Cantieri"), icon: ti("map-pin") },
  { id: "stock", label: m("Magazzino"), icon: ti("package") },
  { id: "maintenance", label: m("Manutenzioni"), icon: ti("tool"), count: 5 },
  { id: "billing", label: m("Amministrazione"), icon: ti("file-invoice") },
  { id: "people", label: m("Personale"), icon: ti("users") },
  { id: "settings", label: m("Impostazioni"), icon: ti("settings") },
];

/** Documentation preview: a whole application, shell plus dashboard. */
export class BolleShellDemo extends LitElement {
  static properties = {
    form: { reflect: true },
    density: { reflect: true },
    supportingOpen: { type: Boolean, attribute: "supporting-open" },
    nav: { state: true },
    layout: { state: true },
    detail: { state: true },
  };

  declare form: "auto" | "compact" | "medium" | "expanded";
  declare density: "comfortable" | "compact";
  declare supportingOpen: boolean;
  declare nav: string;
  declare layout: string;
  declare detail: number;

  constructor() {
    super();
    this.form = "auto";
    this.density = "comfortable";
    this.supportingOpen = false;
    this.nav = "dashboard";
    this.layout = "";
    this.detail = 0;
  }

  createRenderRoot() {
    return this;
  }

  private onLayout = (event: Event) => {
    const detail = (event as CustomEvent<DashboardLayoutDetail>).detail;
    this.layout = detail.layout
      .map((entry) => `${entry.id.replace("tile-", "")}:${entry.span}`)
      .join(" · ");
    this.requestUpdate();
  };

  private tile(
    id: string,
    title: string,
    subtitle: string,
    span: number,
    body: TemplateResult,
    icon?: string,
    minSpan = 2,
  ) {
    return html`<bolle-widget
      id=${`tile-${id}`}
      .title=${title}
      .subtitle=${subtitle}
      .span=${span}
      .minSpan=${minSpan}
      .icon=${icon ? ti(icon) : undefined}
    >
      ${body}
    </bolle-widget>`;
  }

  private get supporting() {
    const job = lateJobs[this.detail] ?? lateJobs[0];
    return html`<div class="content-pad" slot="supporting">
      <p class="muted">${job.client} · ${job.city}</p>
      <h2>${job.title}</h2>
      <p class="code">${job.code}</p>
      <p class="late">${job.days} giorni di ritardo</p>
      <p class="num">${euro.format(job.amount)}</p>
      <div class="bar-row">
        <bolle-progress-indicator
          value=${job.progress}
          label=${m("Avanzamento")}
        ></bolle-progress-indicator>
        <span class="num">${job.progress}%</span>
      </div>
      <p class="muted">${m("Responsabile")}: ${job.manager}</p>
    </div>`;
  }

  protected render() {
    return html`<bolle-app-shell
      .form=${this.form}
      label="Applicazione"
      .supportingOpen=${this.supportingOpen}
      supporting-label=${m("Commessa")}
      close-label=${m("Chiudi")}
      @supporting-close=${() => {
        this.supportingOpen = false;
        this.requestUpdate();
      }}
      @form-change=${(event: CustomEvent<{ form: string }>) => {
        this.setAttribute("data-form", event.detail.form);
      }}
    >
      <bolle-app-bar
        slot="bar"
        variant="small"
        subtitle=${m("lunedì 16 novembre 2026")}
      >
        <bolle-icon-button
          class="menu-button"
          slot="leading"
          variant="standard"
          label=${m("Apri navigazione")}
          >${ti("menu-2")}</bolle-icon-button
        >
        <span class="brand">${m("Cruscotto")}</span>
      </bolle-app-bar>
      <bolle-sidebar
        slot="navigation"
        label=${m("Navigazione principale")}
        search="none"
        .width=${252}
        .items=${navItems()}
        current=${this.nav}
        @navigate=${(event: CustomEvent<{ path: string }>) =>
          (this.nav = event.detail.path.split("/")[0])}
      >
        <span slot="header" class="brand">Cantieri Rossi</span>
      </bolle-sidebar>
      <bolle-navigation-bar
        slot="bottom-bar"
        label=${m("Navigazione principale")}
        .items=${navItems().slice(0, 4)}
        .value=${this.nav}
        @navigate=${(event: CustomEvent<{ id: string }>) => (this.nav = event.detail.id)}
      ></bolle-navigation-bar>

      <div class="content-pad">
        <p class="content-sub">
          ${m("42 commesse attive · 7 in ritardo · 3 collaudi questa settimana")}
        </p>
        <bolle-dashboard
          label=${m("Riquadri del cruscotto")}
          .density=${this.density}
          @layout-change=${this.onLayout}
        >
          ${kpis.map((kpi, index) =>
            this.tile(
              kpi.id,
              kpi.label,
              kpi.detail,
              3,
              html`<p class="kpi-value" dir="auto">${kpi.value}</p>
                <p class="kpi-detail" dir="auto">${kpi.trendLabel}</p>`,
              ["gauge", "building", "alert-triangle", "check"][index],
            ),
          )}
          ${this.tile(
            "late",
            m("Lavori in ritardo"),
            m("6 commesse con scadenza superata"),
            8,
            html`<ul class="list">
              ${lateJobs.map(
                (job, index) => html`<li>
                  <div class="row">
                    <span class="code">${job.code}</span>
                    <span class="late">${job.days} gg</span>
                  </div>
                  <div class="row">
                    <span>${job.title}</span>
                    <span class="num">${euro.format(job.amount)}</span>
                  </div>
                  <div class="bar-row">
                    <bolle-progress-indicator
                      value=${job.progress}
                      label=${m("Avanzamento")}
                    ></bolle-progress-indicator>
                    <span class="num">${job.progress}%</span>
                  </div>
                  <button
                    class="open-row"
                    @click=${() => {
                      this.detail = index;
                      this.supportingOpen = true;
                      this.requestUpdate();
                    }}
                  >
                    ${m("Apri scheda")}
                  </button>
                </li>`,
              )}
            </ul>`,
            "alert-triangle",
            4,
          )}
          ${this.tile(
            "sites",
            m("Avanzamento cantieri"),
            m("5 cantieri aperti"),
            4,
            html`<ul class="list">
              ${siteProgress.map(
                (site) => html`<li>
                  <div class="row"><span>${site.name}</span><span class="num">${site.progress}%</span></div>
                  <bolle-progress-indicator
                    value=${site.progress}
                    label=${m("Avanzamento")}
                  ></bolle-progress-indicator>
                  <span class="muted">${site.city} · ${site.phase}</span>
                </li>`,
              )}
            </ul>`,
            "map-pin",
            3,
          )}
          ${this.tile(
            "revenue",
            m("Fatturato"),
            m("ultimi dodici mesi, in migliaia di €"),
            8,
            html`<ol class="revenue-bars" aria-label=${m("Fatturato per mese")}>
              ${revenue.map((item) => html`<li>
                <span
                  class="bar"
                  style=${`block-size:${Math.round((item.value / 1240) * 100)}%`}
                ></span>
                <span class="month">${item.month}</span>
              </li>`)}
            </ol>`,
            "chart-bar",
            4,
          )}
          ${this.tile(
            "activity",
            m("Attività recenti"),
            m("ultime 24 ore"),
            4,
            html`<ul class="list">
              ${activities.map(
                (item) => html`<li>
                  <div class="row"><strong>${item.who}</strong><span class="muted">${item.when}</span></div>
                  <span>${item.what}</span>
                  <span class="code">${item.target}</span>
                </li>`,
              )}
            </ul>`,
            "clock",
            3,
          )}
          ${this.tile(
            "load",
            m("Carico per responsabile"),
            m("ore assegnate su 40 settimanali"),
            12,
            html`<ul class="list">
              ${load.map(
                (person) => html`<li>
                  <div class="row"><span>${person.name}</span><span class="num" dir="ltr">${person.hours} / ${person.capacity} h</span></div>
                  <bolle-progress-indicator
                    value=${Math.min(100, (person.hours / person.capacity) * 100)}
                    label=${m("Carico")}
                  ></bolle-progress-indicator>
                </li>`,
              )}
            </ul>`,
            "users",
            4,
          )}
        </bolle-dashboard>
        <p class="muted">${this.layout ? `${m("Layout")}: ${this.layout}` : nothing}</p>
      </div>

      <p slot="status" class="status-bar">
        <span dir="auto">${m("9 riquadri")}</span>
        <span aria-hidden="true">·</span>
        <span dir="auto">${m("Ultimo aggiornamento 22:31")}</span>
      </p>

      ${this.supporting}
    </bolle-app-shell>`;
  }
}

/** Documentation preview: the dashboard alone, with the layout it reports. */
export class BolleDashboardDemo extends LitElement {
  static properties = {
    density: { reflect: true },
    columns: { type: Number },
    label: {},
    layout: { state: true },
  };

  declare density: "comfortable" | "compact";
  declare columns: number;
  declare label: string;
  declare layout: string;

  constructor() {
    super();
    this.density = "comfortable";
    this.columns = 12;
    this.label = m("Riquadri del cruscotto");
    this.layout = "";
  }

  createRenderRoot() {
    return this;
  }

  private onLayout = (event: Event) => {
    const detail = (event as CustomEvent<DashboardLayoutDetail>).detail;
    this.layout = detail.layout
      .map((entry) => `${entry.id}:${entry.span}`)
      .join(" · ");
    this.requestUpdate();
  };

  protected render() {
    return html`<bolle-dashboard
      label=${this.label}
      .density=${this.density}
      .columns=${this.columns}
      @layout-change=${this.onLayout}
    >
      ${kpis.slice(0, 4).map(
        (kpi, index) => html`<bolle-widget
          id=${kpi.id}
          .title=${kpi.label}
          .subtitle=${kpi.detail}
          .span=${3}
          .icon=${ti(["gauge", "building", "alert-triangle", "check"][index])}
        >
          <p class="kpi-value" dir="auto">${kpi.value}</p>
          <p class="kpi-detail" dir="auto">${kpi.trendLabel}</p>
        </bolle-widget>`,
      )}
      <bolle-widget
        id="late"
        .title=${m("Lavori in ritardo")}
        .subtitle=${m("6 commesse con scadenza superata")}
        .span=${8}
        .minSpan=${4}
        .icon=${ti("alert-triangle")}
      >
        <ul class="list">
          ${lateJobs.map(
            (job) => html`<li>
              <div class="row">
                <span class="code">${job.code}</span>
                <span class="late">${job.days} gg</span>
              </div>
              <div class="row">
                <span>${job.title}</span>
                <span class="num">${euro.format(job.amount)}</span>
              </div>
            </li>`,
          )}
        </ul>
      </bolle-widget>
      <bolle-widget
        id="sites"
        .title=${m("Avanzamento cantieri")}
        .subtitle=${m("5 cantieri aperti")}
        .span=${4}
        .minSpan=${3}
        .icon=${ti("map-pin")}
      >
        <ul class="list">
          ${siteProgress.map(
            (site) => html`<li>
              <div class="row">
                <span>${site.name}</span>
                <span class="num">${site.progress}%</span>
              </div>
              <bolle-progress-indicator
                value=${site.progress}
                label=${m("Avanzamento")}
              ></bolle-progress-indicator>
            </li>`,
          )}
        </ul>
      </bolle-widget>
    </bolle-dashboard>
    <p class="layout-feedback">
      ${this.layout ? `${m("Layout")}: ${this.layout}` : m("Sposta o allarga un riquadro")}
    </p>`;
  }
}

if (!customElements.get("demo-app-shell"))
  customElements.define("demo-app-shell", BolleShellDemo);
if (!customElements.get("demo-dashboard"))
  customElements.define("demo-dashboard", BolleDashboardDemo);
