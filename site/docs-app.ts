import { LitElement, html, nothing, svg, type TemplateResult } from "lit";
import type {
  BolleItem,
  BolleNavigationDrawer,
  BolleSideSheet,
  BolleSnackbar,
} from "../src/index.js";
import { ti } from "../demo/icons.js";
import {
  entries,
  entryByTag,
  groups,
  initialState,
  type Control,
  type Entry,
  type PreviewContext,
  type State,
} from "./catalog.js";
import { buildHtml, buildReact, buildVue } from "./codegen.js";
import {
  componentApi,
  componentSupport,
  pageMarkdown,
  type ApiRow,
  type SupportInfo,
} from "./reference.js";
import "./docs-color.js";
import "./docs-select.js";
import {
  componentTokenUsage,
  tokenDefault,
  activeTokenValue,
  type ComponentTokenUsage,
} from "./usage.js";
import {
  LOCALES,
  isLocale,
  l,
  m,
  locale,
  routeHref,
  setLocale,
  browserLocale,
  type Locale,
} from "./i18n.js";
import { componentQuotes, shortTokenName, type Quote } from "./quotes.js";
import { bolleLogo, bolleMark, renderLanding } from "./landing.js";
import { FOUNDATION_SECTIONS, renderFoundations } from "./foundations.js";
import {
  applyTokens,
  defaultTokenSet,
  hctScheme,
  contrastRatio,
  COLOR_ALGORITHMS,
  SURFACE_MODES,
  colorAlgorithm,
  surfaceMode,
  presetTokenSet,
  themePreset,
  tokensCss,
  exportThemeCss,
  exportThemeJson,
  importTheme,
  COLOR_ROLE_GROUPS,
  COLOR_ROLES,
  FONT_KEYS,
  SHAPE_TOKENS,
  DEFAULT_THEME_PRESET,
  THEME_PRESETS,
  DENSITY_PRESETS,
  densityPreset,
  type Density,
  type ThemeName,
  type TokenSet,
} from "./tokens.js";

const GROUP_PREFIX = "group:";

const ALGORITHM_HINTS: Record<string, string> = {
  "tonal-spot": m("Predefinito M3: secondary e tertiary sono varianti tenui della tinta del seme."),
  vibrant: m("Come tonal spot, con colori più saturi."),
  expressive: m("Ruota le tinte di secondary e tertiary in modo marcato rispetto al seme."),
  fidelity: m("Primary e container restano molto vicini al seme, anche se saturo."),
  content: m("Pensato per colori estratti da immagini: fedele al seme, accenti per temperatura."),
  rainbow: m("Accenti colorati con superfici grigie."),
  "fruit-salad": m("Tinte ruotate e giocose per tutti gli accenti."),
  neutral: m("Quasi senza colore: utile per interfacce sobrie."),
  monochrome: m("Solo grigi: il seme non conta."),
  complementary: m("Secondary e tertiary sul lato opposto della ruota (+180°)."),
  analogous: m("Secondary e tertiary accanto al seme (−30° e +30°)."),
  split: m("I due vicini del complementare (+150° e +210°)."),
  triadic: m("Tre tinte equidistanti (+120° e +240°)."),
  tetradic: m("Quadrato sulla ruota (+90° e +180°)."),
};

type CodeTab = "html" | "vue" | "react";
type SideTab = "params" | "sizes";

interface DocSection {
  id: string;
  label: string;
}

/** Groups whose previews need the full row, so variants stack instead of tiling. */
const WIDE_GROUPS = new Set<string>([
  "App bars",
  "Cards",
  "Carousel",
  "Date & time pickers",
  "Divider",
  "Lists",
  "Navigation bar",
  "Navigation rail",
  "Progress indicators",
  "Search",
  "Sliders",
  "Tabs",
  "Text fields",
  "Toolbars",
]);

/** Groups whose variants are whole panels: each cell gets room for the panel at its own size. */
const PANEL_GROUPS = new Set<string>([
  "Sidebar",
  "Data table",
  "App shell",
  "Dashboard",
  "Kanban",
  "Pagination",
  "App bars",
]);

const SCHIUMA = "Schiuma";
const coreEntries = entries.filter((entry) => !entry.section);
const schiumaEntries = entries.filter((entry) => entry.section === SCHIUMA);
/** Material families first, then the Schiuma components for admin applications. */
const orderedEntries = [
  ...groups.flatMap((group) =>
    coreEntries.filter((entry) => entry.group === group),
  ),
  ...schiumaEntries,
];

/** Fills the `{name}` placeholders of a translated string with template parts. */
const withParts = (translated: string, parts: Record<string, unknown>) =>
  translated
    .split(/(\{\w+\})/)
    .map((segment) => {
      const key = /^\{(\w+)\}$/.exec(segment)?.[1];
      return key && key in parts ? parts[key] : segment;
    });

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export class DocsApp extends LitElement {
  static properties = {
    route: { state: true },
    states: { state: true },
    expanded: { state: true },
    codeTab: { state: true },
    dark: { state: true },
    rtl: { state: true },
    palettes: { state: true },
    contrast: { state: true },
    keepSeed: { state: true },
    previousColors: { state: true },
    asideTab: { state: true },
    paletteDensity: { state: true },
    inspected: { state: true },
    importText: { state: true },
    language: { state: true },
    dropActive: { state: true },
    importError: { state: true },
    activeShape: { state: true },
    algorithm: { state: true },
    surfaces: { state: true },
    presetId: { state: true },
    density: { state: true },
    usage: { state: true },
    usageTag: { state: true },
    details: { state: true },
    quotes: { state: true },
    quoteLines: { state: true },
    hoverToken: { state: true },
    sideTab: { state: true },
    navFilter: { state: true },
    activeSection: { state: true },
  };

  declare route: string;
  declare codeTab: CodeTab;
  declare sideTab: SideTab;
  declare navFilter: string;
  declare activeSection: string;
  declare dark: boolean;
  declare rtl: boolean;
  declare expanded: string[];
  declare states: Record<string, State>;
  declare palettes: Record<ThemeName, TokenSet>;
  declare contrast: number;
  declare keepSeed: boolean;
  /** Colours before the last generation or preset, to show what changed. */
  declare previousColors: Record<string, string> | null;
  declare asideTab: "colors" | "shape";
  declare paletteDensity: "compact" | "medium" | "full";
  /** Component under the pointer or focus in the tokens preview, with the tokens it reads. */
  declare inspected: {
    tag: string;
    usage: ComponentTokenUsage;
    x: number;
    y: number;
  } | null;
  private inspectedElement?: HTMLElement;
  declare importText: string;
  /** Site language; changing it re-renders every translated string. */
  declare language: Locale;
  declare importError: string;
  declare dropActive: boolean;
  /** Shape token being adjusted, highlighted in the scale. */
  declare activeShape: string;
  declare algorithm: string;
  declare surfaces: string;
  declare presetId: string;
  declare density: Density;
  declare usage: ComponentTokenUsage | null;
  declare usageTag: string;
  declare details: Record<string, Record<string, string>>;
  declare quotes: boolean;
  declare quoteLines: Quote[];
  declare hoverToken: string;
  private usageRetry = 0;
  private quoteObserver?: ResizeObserver;

  constructor() {
    super();
    const fromHash = location.hash.replace(/^#\/?/, "").split("/")[0];
    this.language = isLocale(fromHash) ? fromHash : browserLocale();
    setLocale(this.language);
    document.title = l("bolle · Interfacce con tensione superficiale");
    this.route = "home";
    this.codeTab = "html";
    this.sideTab = "params";
    this.navFilter = "";
    this.activeSection = "";
    this.dark = false;
    this.rtl = false;
    this.expanded = groups
      .filter(
        (group) => entries.filter((entry) => entry.group === group).length > 1,
      )
      .map((group) => `${GROUP_PREFIX}${group}`)
      .concat(`${GROUP_PREFIX}${SCHIUMA}`);
    this.states = Object.fromEntries(
      entries.map((entry) => [entry.tag, initialState(entry)]),
    );
    this.palettes = {
      light: defaultTokenSet("light"),
      dark: defaultTokenSet("dark"),
    };
    this.contrast = 0;
    this.keepSeed = true;
    this.previousColors = null;
    this.asideTab = "colors";
    this.paletteDensity = "medium";
    this.inspected = null;
    this.importText = "";
    this.importError = "";
    this.dropActive = false;
    this.activeShape = "";
    this.algorithm = "tonal-spot";
    this.surfaces = "white";
    this.presetId = DEFAULT_THEME_PRESET.id;
    this.density = "airy";
    this.usage = null;
    this.usageTag = "";
    this.details = {};
    this.quotes = false;
    this.quoteLines = [];
    this.hoverToken = "";
  }

  private ctx: PreviewContext = {
    show: (id, event) => {
      const host = this.querySelector<{ show?: (opener?: HTMLElement) => void }>(
        `#${id}`,
      );
      host?.show?.(event.currentTarget as HTMLElement);
    },
    close: (id, value) => {
      const host = this.querySelector<{ close?: (value?: string) => void }>(
        `#${id}`,
      );
      host?.close?.(value);
    },
    snackbar: (id, message) => {
      this.querySelector<BolleSnackbar>(`#${id}`)?.show(message);
    },
  };

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.readHash();
    applyTokens(this.tokenSet, this.density);
    window.addEventListener("hashchange", this.readHash);
    window.addEventListener("scroll", this.onScroll, { passive: true });
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.readHash);
    window.removeEventListener("scroll", this.onScroll);
    this.quoteObserver?.disconnect();
    this.quoteObserver = undefined;
    super.disconnectedCallback();
  }

  protected updated() {
    if (this.isHome || this.isTokens || this.isPage) return;
    const element = this.querySelector(
      `.preview-surface ${this.entry.tag}`,
    );
    if (!element) return;
    const root = element.shadowRoot;
    const ready = !!root && root.childElementCount > 0;
    const usage = componentTokenUsage(
      this.entry.tag,
      ready ? element : undefined,
    );
    if (
      this.usageTag !== this.entry.tag ||
      JSON.stringify(this.usage) !== JSON.stringify(usage)
    ) {
      this.usage = usage;
      this.usageTag = this.entry.tag;
    }
    if (!ready && this.usageRetry < 5) {
      this.usageRetry += 1;
      setTimeout(() => this.requestUpdate(), 60);
    }
    this.scheduleQuotes();
    const surface = this.querySelector<HTMLElement>(".preview-surface");
    if (surface) {
      this.quoteObserver?.disconnect();
      this.quoteObserver ??= new ResizeObserver(() => this.scheduleQuotes());
      this.quoteObserver.observe(surface);
    }
  }

  private quotePending = false;

  private scheduleQuotes() {
    if (this.quotePending) return;
    this.quotePending = true;
    requestAnimationFrame(() => {
      this.quotePending = false;
      this.refreshQuotes();
    });
  }

  private refreshQuotes() {
    const surface = this.querySelector<HTMLElement>(".preview-surface");
    const element = surface?.querySelector(this.entry.tag);
    if (!surface || !element || !this.quotes || !this.usage) {
      if (this.quoteLines.length > 0) this.quoteLines = [];
      return;
    }
    const box = surface.getBoundingClientRect();
    const origin = {
      left: box.left + surface.clientLeft,
      top: box.top + surface.clientTop,
      width: surface.clientWidth,
      height: surface.clientHeight,
    };
    const allowed = new Set(this.usage.details.filter(this.isSizeToken));
    const next = componentQuotes(this.entry.tag, element, origin, allowed);
    if (JSON.stringify(next) !== JSON.stringify(this.quoteLines))
      this.quoteLines = next;
  }

  private readHash = () => {
    const parts = location.hash.replace(/^#\/?/, "").split("/");
    const requested = isLocale(parts[0]) ? parts.shift()! : "";
    const tag = parts.join("/") || "home";
    const known =
      tag === "home" ||
      tag === "tokens" ||
      tag === "foundations" ||
      tag === "overview" ||
      !!entryByTag(tag);
    if (requested && requested !== locale()) this.applyLocale(requested as Locale);
    // Known routes without a language (old bookmarks) get the current one, without a history step.
    if (!requested && known)
      history.replaceState(null, "", routeHref(tag === "home" ? "" : tag));
    if (known) {
      if (this.route !== tag) {
        this.usageRetry = 0;
        this.hoverToken = "";
        this.sideTab = "params";
        this.quotes = false;
        this.activeSection = "";
        this.querySelector<BolleSideSheet>("#site-config")?.close();
        window.scrollTo({ top: 0 });
      }
      this.route = tag;
    }
  };

  /** Scroll spy: the last section whose heading passed under the top bar. */
  private onScroll = () => {
    const sections = this.querySelectorAll<HTMLElement>(
      ".doc-section[id], .fd-section[id], [data-section][id]",
    );
    let current = sections[0]?.id ?? "";
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 140) current = section.id;
    }
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom && sections.length > 0) current = sections[sections.length - 1].id;
    if (current !== this.activeSection) this.activeSection = current;
  };

  private scrollToSection(id: string) {
    const section = this.querySelector<HTMLElement>(`#${id}`);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    section.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    this.activeSection = id;
  }

  private get isTokens(): boolean {
    return this.route === "tokens";
  }

  private get isOverview(): boolean {
    return this.route === "overview";
  }

  private get isHome(): boolean {
    return this.route === "home";
  }

  private get isFoundations(): boolean {
    return this.route === "foundations";
  }

  /** Pages without a component entry: no preview, no configuration sheet. */
  private get isPage(): boolean {
    return this.isOverview || this.isFoundations;
  }

  private get activeTheme(): ThemeName {
    return this.dark ? "dark" : "light";
  }

  private get tokenSet(): TokenSet {
    return this.palettes[this.activeTheme];
  }

  private get entry(): Entry {
    return entryByTag(this.route) ?? entries[0];
  }

  private get state(): State {
    return this.states[this.entry.tag] ?? initialState(this.entry);
  }

  private setProp(prop: string, value: unknown) {
    const entry = this.entry;
    this.states = {
      ...this.states,
      [entry.tag]: { ...this.state, [prop]: value },
    };
  }

  private applyLocale(next: Locale) {
    setLocale(next);
    this.language = next;
    document.title = l("bolle · Interfacce con tensione superficiale");
    // Playground defaults hold translated text: rebuild them in the new language.
    this.states = Object.fromEntries(
      entries.map((entry) => [entry.tag, initialState(entry)]),
    );
    // Pickers read their language when created; existing ones get it explicitly.
    for (const picker of this.querySelectorAll<HTMLElement & { locale: string }>(
      "bolle-date-picker, bolle-time-picker",
    ))
      picker.locale = document.documentElement.lang;
  }

  private switchLocale = (next: Locale) => {
    if (next === this.language) return;
    this.applyLocale(next);
    const tag = this.route === "home" ? "" : this.route;
    history.replaceState(null, "", routeHref(tag));
  };

  private renderLocaleSelect(): TemplateResult {
    const current = LOCALES.find((item) => item.id === this.language) ?? LOCALES[0];
    return html`<docs-select
      class="locale-select"
      label=${l("Lingua")}
      .options=${LOCALES.map((item) => item.label)}
      .value=${current.label}
      @change=${(event: Event) => {
        const label = (event as CustomEvent<{ value: string }>).detail.value;
        const next = LOCALES.find((item) => item.label === label);
        if (next) this.switchLocale(next.id);
      }}
    ></docs-select>`;
  }

  private navigate(tag: string) {
    const target = routeHref(tag === "home" ? "" : tag);
    if (location.hash === target) this.route = tag;
    else location.hash = target;
  }

  /** Index of the current page for Foundations and Tokens; null on component pages. */
  private pageSections(): BolleItem[] | null {
    if (this.isFoundations)
      return FOUNDATION_SECTIONS.map(([id, label]) => ({ id, label: l(label) }));
    if (!this.isTokens) return null;
    const colors = this.tokenSet.colors;
    const swatch = (token: string) =>
      html`<span
        style=${`display:inline-block;inline-size:18px;block-size:18px;border-radius:6px 6px 6px 2px;box-shadow:inset 0 0 0 1px rgb(0 0 0 / 0.15);background:${colors[token]}`}
      ></span>`;
    const groupToken: Record<string, string> = {
      Primary: "primary",
      Secondary: "secondary",
      Tertiary: "tertiary",
      Error: "error",
      Surface: "surface-container",
      Outline: "outline",
      Inverse: "inverse-surface",
      Fixed: "primary-fixed",
      Utility: "scrim",
    };
    return [
      ...COLOR_ROLE_GROUPS.map((group) => ({
        id: `tk-${group.toLowerCase()}`,
        label: group,
        icon: swatch(groupToken[group] ?? "primary"),
      })),
      { id: "tk-preview", label: l("Anteprima") },
      { id: "tk-shape", label: l("Forme") },
      { id: "tk-type", label: l("Tipografia") },
      { id: "tk-css", label: l("Esporta e importa") },
    ];
  }

  private onSectionNav = (event: Event) => {
    const id = (event as CustomEvent<{ value: string }>).detail.value;
    if (id) this.scrollToSection(id);
  };

  private renderSideNav(navigate: (event: Event) => void): TemplateResult {
    const sections = this.pageSections();
    if (!sections)
      return html`<p class="panel-kicker">${l("Componenti")}</p>
        <bolle-list
          label=${l("Componenti")}
          selection="single"
          interactive
          .items=${this.navItems()}
          .value=${this.isOverview ? "overview" : this.entry.tag}
          .expanded=${this.expanded}
          @change=${navigate}
          @expand=${this.onExpand}
        ></bolle-list>`;
    return html`<p class="panel-kicker">${l("In questa pagina")}</p>
      <bolle-list
        label=${l("Sezioni della pagina")}
        selection="single"
        interactive
        .items=${sections}
        .value=${this.activeSection || sections[0].id}
        @change=${this.onSectionNav}
      ></bolle-list>
      <a class="nav-back" href=${routeHref("overview")}>${l("Tutti i componenti →")}</a>`;
  }

  private navItems(): BolleItem[] {
    const query = this.navFilter.trim().toLowerCase();
    if (query)
      return orderedEntries
        .filter((entry) =>
          [
            entry.title,
            entry.navLabel ?? "",
            entry.group,
            entry.section ?? "",
            entry.tag,
          ].some((text) => text.toLowerCase().includes(query)),
        )
        .map((entry) => ({ id: entry.tag, label: entry.navLabel ?? entry.title }));

    const families = groups
      .map((group) => ({
        group,
        list: coreEntries.filter((entry) => entry.group === group),
      }))
      .filter((family) => family.list.length > 0);

    return [
      { id: "overview", label: l("Panoramica dei componenti") },
      ...families.map((family) =>
        family.list.length === 1
          ? { id: family.list[0].tag, label: family.group }
          : {
              id: `${GROUP_PREFIX}${family.group}`,
              label: family.group,
              items: family.list.map((entry) => ({
                id: entry.tag,
                label: entry.navLabel ?? entry.title,
              })),
            },
      ),
      ...(schiumaEntries.length
        ? [
            {
              id: `${GROUP_PREFIX}${SCHIUMA}`,
              label: SCHIUMA,
              items: schiumaEntries.map((entry) => ({
                id: entry.tag,
                label: entry.navLabel ?? entry.title,
              })),
            },
          ]
        : []),
    ];
  }

  private onNavigate = (event: Event) => {
    const id = (event as CustomEvent<{ value: string }>).detail.value;
    if (!id.startsWith(GROUP_PREFIX)) this.navigate(id);
  };

  private onExpand = (event: Event) => {
    const { id, expanded } = (
      event as CustomEvent<{ id: string; expanded: boolean }>
    ).detail;
    this.expanded = expanded
      ? [...this.expanded, id]
      : this.expanded.filter((value) => value !== id);
  };

  private onCodeTab = (event: Event) => {
    this.codeTab = (event as CustomEvent<{ value: string }>).detail.value as CodeTab;
  };

  private onSideTab = (event: Event) => {
    this.sideTab = (event as CustomEvent<{ value: string }>).detail.value as SideTab;
    this.quotes = this.sideTab === "sizes";
    this.scheduleQuotes();
  };

  private onNavFilter = (event: Event) => {
    this.navFilter = (event as CustomEvent<{ value: string }>).detail.value;
  };

  private toggleTheme = () => {
    this.dark = !this.dark;
    document.documentElement.dataset.theme = this.dark ? "dark" : "light";
    applyTokens(this.tokenSet, this.density);
  };

  private updateTokens(update: (set: TokenSet) => TokenSet) {
    const theme = this.activeTheme;
    const next = update(this.palettes[theme]);
    this.palettes = { ...this.palettes, [theme]: next };
    applyTokens(next, this.density);
  }

  private setDensity = (event: Event) => {
    const label = (event as CustomEvent<{ value: string }>).detail.value;
    const preset = DENSITY_PRESETS.find((item) => l(item.label) === label);
    if (!preset) return;
    this.density = preset.id;
    applyTokens(this.tokenSet, this.density);
  };

  private setColor(token: string, value: string) {
    this.updateTokens((set) => ({
      ...set,
      colors: { ...set.colors, [token]: value },
    }));
  }

  private setShape(token: string, value: number) {
    this.updateTokens((set) => ({
      ...set,
      shapes: { ...set.shapes, [token]: value },
    }));
  }

  private setDetail(tag: string, token: string, value: string) {
    const trimmed = value.trim();
    const current = this.details[tag] ?? {};
    const next = { ...current };
    if (trimmed) next[token] = trimmed;
    else delete next[token];
    this.details = { ...this.details, [tag]: next };
  }

  private resetDetails(tag: string) {
    if (!this.details[tag]) return;
    const next = { ...this.details };
    delete next[tag];
    this.details = next;
  }

  private get detailsCss(): string {
    return Object.entries(this.details)
      .filter(([, values]) => Object.keys(values).length > 0)
      .map(
        ([tag, values]) =>
          `${tag} {\n${Object.entries(values)
            .map(([token, value]) => `  ${token}: ${value};`)
            .join("\n")}\n}`,
      )
      .join("\n");
  }

  private detailValue(tag: string, token: string): string {
    const override = this.details[tag]?.[token];
    if (override !== undefined) return override;
    return activeTokenValue(token) || tokenDefault(token);
  }

  private setFont(kind: "brandFont" | "plainFont", value: string) {
    this.updateTokens((set) => ({ ...set, [kind]: value }));
  }

  private setBaseSize(value: number) {
    this.updateTokens((set) => ({ ...set, baseSize: value }));
  }

  private setContrast(value: string) {
    this.contrast = Number(value);
  }

  private generateHct = () => {
    const colors = hctScheme(this.tokenSet.colors.primary, this.activeTheme, {
      contrast: this.contrast,
      keepSeed: this.keepSeed,
      algorithm: this.algorithm,
      surfaces: this.surfaces,
    });
    this.previousColors = { ...this.tokenSet.colors };
    this.updateTokens((set) => ({ ...set, colors }));
  };

  private notify(message: string) {
    this.querySelector<BolleSnackbar>("#site-snackbar")?.show(message);
  }

  private download(name: string, text: string, type: string) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }

  private exportJson = () =>
    this.download("bolle-tokens.json", exportThemeJson(this.palettes, this.density), "application/json");

  private exportCss = () =>
    this.download("bolle-tokens.css", exportThemeCss(this.palettes), "text/css");

  private applyImport(text: string) {
    try {
      const result = importTheme(text, this.palettes);
      this.previousColors = { ...this.tokenSet.colors };
      this.palettes = result.palettes;
      if (result.density) this.density = result.density;
      applyTokens(this.tokenSet, this.density);
      this.importError = "";
      this.importText = "";
      this.notify(l("Token importati: {count} valori", { count: result.count }));
    } catch (error) {
      this.importError = error instanceof Error ? error.message : String(error);
    }
  }

  private onDrop = (event: DragEvent) => {
    event.preventDefault();
    this.dropActive = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) void this.readImportFile(file);
  };

  private importFile = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (file) await this.readImportFile(file);
  };

  private async readImportFile(file: File) {
    if (file.size > 512 * 1024) {
      this.importError = l("Il file è troppo grande (massimo 512 KB).");
      return;
    }
    this.applyImport(await file.text());
  }

  private undoColors = () => {
    const previous = this.previousColors;
    if (!previous) return;
    this.previousColors = null;
    this.updateTokens((set) => ({ ...set, colors: previous }));
  };

  private applyPreset = (id: string) => {
    if (this.isTokens) this.previousColors = { ...this.tokenSet.colors };
    this.presetId = id;
    this.palettes = {
      light: presetTokenSet("light", id),
      dark: presetTokenSet("dark", id),
    };
    applyTokens(this.tokenSet, this.density);
  };

  private resetTokens = () => {
    this.previousColors = { ...this.tokenSet.colors };
    const next = presetTokenSet(this.activeTheme, this.presetId);
    this.palettes = { ...this.palettes, [this.activeTheme]: next };
    applyTokens(next, this.density);
  };

  private toggleRtl = () => {
    this.rtl = !this.rtl;
    document.documentElement.dir = this.rtl ? "rtl" : "ltr";
  };

  private openDrawer = (event: Event) => {
    this.querySelector<BolleNavigationDrawer>("#site-drawer")?.show(
      event.currentTarget as HTMLElement,
    );
  };

  private openConfig = async (event: Event) => {
    const sheet = this.querySelector<BolleSideSheet>("#site-config");
    if (!sheet) return;
    await sheet.show(event.currentTarget as HTMLElement);
    // The sheet keeps the scroll position of the previous visit, which lands on
    // the token list and hides theme and parameters.
    const dialog = sheet.shadowRoot?.querySelector<HTMLDialogElement>("dialog");
    if (dialog) dialog.scrollTop = 0;
  };

  private closeDrawer = () => {
    this.querySelector<BolleNavigationDrawer>("#site-drawer")?.close();
  };

  private drawerNavigate = (event: Event) => {
    this.onNavigate(event);
    this.closeDrawer();
  };

  private reset(entry: Entry) {
    this.states = {
      ...this.states,
      [entry.tag]: initialState(entry),
    };
  }

  private async copy(text: string, message = l("Codice copiato")) {
    try {
      await navigator.clipboard.writeText(text);
    } finally {
      this.querySelector<BolleSnackbar>("#site-snackbar")?.show(message);
    }
  }

  private renderControl(
    control: Control,
    state: State,
  ): TemplateResult {
    const value = state[control.prop];
    switch (control.kind) {
      case "bool":
        return html`<bolle-switch
          .label=${l(control.label)}
          ?checked=${Boolean(value)}
          @change=${(event: Event) =>
            this.setProp(
              control.prop,
              (event as CustomEvent<{ checked: boolean }>).detail.checked,
            )}
        ></bolle-switch>`;
      case "range":
        return html`<bolle-slider
          .label=${l(control.label)}
          .min=${control.min}
          .max=${control.max}
          .step=${control.step ?? 1}
          .value=${String(value ?? control.default)}
          show-value
          @value-input=${(event: Event) =>
            this.setProp(
              control.prop,
              (event as CustomEvent<{ value: string }>).detail.value,
            )}
        ></bolle-slider>`;
      case "text":
        return html`<bolle-text-field
          .label=${l(control.label)}
          .value=${String(value ?? "")}
          placeholder=${control.placeholder ? l(control.placeholder) : ""}
          @value-input=${(event: Event) =>
            this.setProp(
              control.prop,
              (event as CustomEvent<{ value: string }>).detail.value,
            )}
        ></bolle-text-field>`;
      case "longtext":
        return html`<bolle-text-field
          .label=${l(control.label)}
          multiline
          .rows=${control.rows ?? 3}
          .value=${String(value ?? "")}
          @value-input=${(event: Event) =>
            this.setProp(
              control.prop,
              (event as CustomEvent<{ value: string }>).detail.value,
            )}
        ></bolle-text-field>`;
      case "enum":
        if (control.options.length <= 4 && control.options.join("").length <= 22)
          return html`<bolle-segmented-buttons
            .label=${l(control.label)}
            .items=${control.options.map((option) => ({
              id: option,
              label: option,
            }))}
            .value=${String(value ?? control.default)}
            @change=${(event: Event) =>
              this.setProp(
                control.prop,
                (event as CustomEvent<{ value: string }>).detail.value,
              )}
          ></bolle-segmented-buttons>`;
        return html`<div class="config-field">
          <span class="config-label">${l(control.label)}</span>
          <docs-select
            .label=${l(control.label)}
            .value=${String(value ?? control.default)}
            .options=${control.options}
            @change=${(event: Event) =>
              this.setProp(
                control.prop,
                (event as CustomEvent<{ value: string }>).detail.value,
              )}
          ></docs-select>
        </div>`;
    }
  }

  private renderOverview(): TemplateResult {
    return html`<header class="component-header">
        <span class="kicker">${l("Catalogo")}</span>
        <h1>${l("Panoramica dei componenti")}</h1>
        <code class="tag">${l("{n} componenti", { n: entries.length })}</code>
        <p class="lead">
          ${l(
            "Ogni scheda mostra il componente reale nel suo stato predefinito. Le famiglie seguono l'ordine e il raggruppamento della overview Material 3.",
          )}
        </p>
      </header>

      <div class="overview-grid">
        ${orderedEntries.map(
          (entry) => html`<bolle-card
            class="overview-card"
            variant="elevated"
            href=${routeHref(entry.tag)}
            label=${entry.title}
          >
            <div
              class="overview-stage ${WIDE_GROUPS.has(entry.group) ? "is-wide" : ""}"
              aria-hidden="true"
              inert
            >
              ${entry.render(initialState(entry), this.ctx)}
            </div>
            <span class="overview-tag"
              >${entry.section ? `${entry.section} · ${entry.group}` : entry.group}</span
            >
            <h3>${entry.title}</h3>
            <p>${l(entry.summary)}</p>
          </bolle-card>`,
        )}
      </div>`;
  }

  private inspect = (event: Event) => {
    const host = (event.composedPath() as Element[]).find(
      (node) => node instanceof HTMLElement && node.tagName.startsWith("BOLLE-"),
    ) as HTMLElement | undefined;
    if (!host) return this.clearInspect();
    const box =
      event instanceof PointerEvent
        ? { x: event.clientX, y: event.clientY }
        : (() => {
            const rect = host.getBoundingClientRect();
            return { x: rect.left, y: rect.bottom };
          })();
    if (this.inspectedElement !== host) {
      this.inspectedElement?.removeAttribute("data-inspected");
      host.setAttribute("data-inspected", "");
      this.inspectedElement = host;
    }
    const tag = host.tagName.toLowerCase();
    this.inspected = { tag, usage: componentTokenUsage(tag, host), x: box.x, y: box.y };
  };

  private clearInspect = () => {
    this.inspectedElement?.removeAttribute("data-inspected");
    this.inspectedElement = undefined;
    this.inspected = null;
  };

  private renderInspector(): TemplateResult | typeof nothing {
    const info = this.inspected;
    if (!info) return nothing;
    const colors = this.tokenSet.colors;
    const roles = COLOR_ROLES.filter((role) => info.usage.colors.includes(role.token));
    const x = Math.min(info.x + 16, window.innerWidth - 336);
    const y = Math.min(info.y + 16, window.innerHeight - 260);
    return html`<div class="token-inspector" role="status" style=${`left:${x}px;top:${y}px`}>
      <code class="token-inspector-tag">&lt;${info.tag}&gt;</code>
      ${roles.length
        ? html`<p class="token-inspector-head">${l("Colori")}</p>
            <ul class="token-inspector-colors">
              ${roles.map(
                (role) => html`<li>
                  <span class="token-inspector-swatch" style=${`background:${colors[role.token]}`}></span
                  ><span>${role.label}</span>
                </li>`,
              )}
            </ul>`
        : nothing}
      ${info.usage.shapes.length
        ? html`<p class="token-inspector-head">${l("Forma")}</p>
            <p class="token-inspector-list">
              ${info.usage.shapes
                .map((shape) => `${shape} ${this.tokenSet.shapes[shape]}px`)
                .join(" · ")}
            </p>`
        : nothing}
      ${info.usage.typography.length
        ? html`<p class="token-inspector-head">${l("Tipografia")}</p>
            <p class="token-inspector-list">${info.usage.typography.join(" · ")}</p>`
        : nothing}
    </div>`;
  }

  private renderTokensPreview(): TemplateResult {
    return html`<div class="token-preview">
      <bolle-app-bar label=${l("Anteprima")} subtitle=${l("Token applicati")}></bolle-app-bar>
      <div class="token-type">
        <p class="type-display">Aa</p>
        <h2>${l("Titolo di sezione")}</h2>
        <p>
          ${l(
            "Testo di esempio per valutare carattere, interlinea e colore su una superficie reale.",
          )}
        </p>
      </div>
      <div class="token-row">
        <bolle-button variant="filled">${l("Salva")}</bolle-button>
        <bolle-button variant="tonal">${l("Anteprima")}</bolle-button>
        <bolle-button variant="outlined">${l("Annulla")}</bolle-button>
        <bolle-chip variant="filter" selected label=${l("Filtro")}></bolle-chip>
      </div>
      <div class="token-fields">
        <bolle-text-field
          label=${l("Titolo")}
          value=${l("Documento di esempio")}
          supporting-text=${l("Testo di supporto")}
        ></bolle-text-field>
        <bolle-switch label=${l("Notifiche")} checked></bolle-switch>
      </div>
      <bolle-progress-indicator label=${l("Avanzamento")} value="60"></bolle-progress-indicator>
      <bolle-card variant="outlined" label=${l("Scheda di esempio")}>
        <h3>${l("Superficie")}</h3>
        <p>${l("Forma, colore e tipografia applicati a una scheda.")}</p>
      </bolle-card>
    </div>`;
  }

  private renderThemeSelect(): TemplateResult {
    return html`<div class="config-field">
      <span class="config-label">${l("Schema colore")}</span>
      <docs-select
        label=${l("Tema")}
        .options=${THEME_PRESETS.map((preset) => l(preset.label))}
        .value=${l(themePreset(this.presetId).label)}
        @change=${(event: Event) => {
          const label = (event as CustomEvent<{ value: string }>).detail.value;
          const preset = THEME_PRESETS.find((item) => l(item.label) === label);
          if (preset) this.applyPreset(preset.id);
        }}
      ></docs-select>
    </div>`;
  }

  private renderDensitySelect(): TemplateResult {
    return html`<div class="config-field">
      <span class="config-label">${l("Densità")}</span>
      <docs-select
        label=${l("Template")}
        .options=${DENSITY_PRESETS.map((preset) => l(preset.label))}
        .value=${l(densityPreset(this.density).label)}
        @change=${this.setDensity}
      ></docs-select>
    </div>`;
  }

  private isSizeToken = (token: string) =>
    /(padding|margin|gap|space|inset|height|width|size|target|between|leading|trailing|min-|max-)/.test(
      token,
    ) && !/(font|tracking|corner|radius)/.test(token);

  /** Colour shared by a dimension row and the matching measurement line. */
  private quoteColor(token: string): string {
    if (!this.usage) return "";
    const sizes = this.usage.details.filter(this.isSizeToken);
    const index = sizes.indexOf(token);
    if (index < 0) return "";
    // Golden angle keeps neighbouring tokens far apart in hue.
    const hue = (index * 137.5) % 360;
    return `hsl(${Math.round(hue)} 58% 42%)`;
  }
  /** Number of the measurement line drawn for a token, if the preview has one. */
  private quoteNumber(token: string): number {
    const quote = this.quoteLines.find((line) => line.token === token);
    return quote?.index ?? 0;
  }

  private get sizeTokens(): string[] {
    if (this.usageTag !== this.entry.tag || !this.usage) return [];
    return this.usage.details.filter(this.isSizeToken);
  }

  private renderSizeTable(): TemplateResult {
    const tag = this.entry.tag;
    // Same order as the numbers on the canvas, unmeasured tokens last.
    const ordered = [...this.sizeTokens].sort((a, b) => {
      const left = this.quoteNumber(a) || 999;
      const right = this.quoteNumber(b) || 999;
      return left - right || a.localeCompare(b);
    });
    return html`<div class="size-table">
      <span class="hint">${l("Dichiarato · attivo")}</span>
      <div class="measure-table">
        ${ordered.map((token) => this.renderTokenRow(tag, token))}
      </div>
      <p class="usage-note">
        ${withParts(
          l("Ogni token ha il colore e il numero della sua quota nell'anteprima. La modifica vale per tutti gli esempi di {tag}."),
          { tag: html`<code>&lt;${tag}&gt;</code>` },
        )}
      </p>
    </div>`;
  }

  private renderQuotes(): TemplateResult {
    const active = this.hoverToken;
    const targets = this.quoteLines.filter(
      (quote) => active && quote.token === active,
    );
    return svg`<svg
      class="measure-quotes"
      aria-hidden="true"
      focusable="false"
    >
      ${targets.map(
        (quote) => svg`<rect
          class="quote-target"
          style=${`--quote-color:${this.quoteColor(quote.token)}`}
          x=${quote.box.x - 2}
          y=${quote.box.y - 2}
          width=${quote.box.width + 4}
          height=${quote.box.height + 4}
          rx=${6}
        />`,
      )}
      ${this.quoteLines.map(
        (quote) => svg`<g
          class="quote ${quote.inside ? "is-inside" : ""} ${active &&
          active !== quote.token
            ? "is-muted"
            : ""}"
          style=${`--quote-color:${this.quoteColor(quote.token)}`}
        >
          <title>${quote.token}: ${quote.value}</title>
          <path
            class="quote-leader"
            d=${`M ${quote.badgeX + (quote.side === "start" ? 9 : -9)} ${quote.badgeY} L ${quote.anchorX} ${quote.anchorY}`}
          />
          <line
            class="quote-line"
            x1=${quote.x1}
            y1=${quote.y1}
            x2=${quote.x2}
            y2=${quote.y2}
          />
          <line
            class="quote-tick"
            x1=${quote.axis === "v" ? quote.x1 - 5 : quote.x1}
            y1=${quote.axis === "v" ? quote.y1 : quote.y1 - 5}
            x2=${quote.axis === "v" ? quote.x1 + 5 : quote.x1}
            y2=${quote.axis === "v" ? quote.y1 : quote.y1 + 5}
          />
          <line
            class="quote-tick"
            x1=${quote.axis === "v" ? quote.x2 - 5 : quote.x2}
            y1=${quote.axis === "v" ? quote.y2 : quote.y2 - 5}
            x2=${quote.axis === "v" ? quote.x2 + 5 : quote.x2}
            y2=${quote.axis === "v" ? quote.y2 : quote.y2 + 5}
          />
          <circle
            class="quote-badge"
            cx=${quote.badgeX}
            cy=${quote.badgeY}
            r=${8}
          />
          <text
            class="quote-number"
            x=${quote.badgeX}
            y=${quote.badgeY}
            text-anchor="middle"
            dominant-baseline="central"
          >
            ${quote.index}
          </text>
          <text
            class="quote-caption"
            x=${quote.badgeX + (quote.side === "start" ? 13 : -13)}
            y=${quote.badgeY}
            text-anchor=${quote.side === "start" ? "start" : "end"}
            dominant-baseline="central"
          >
            <tspan class="quote-caption-value">${quote.value}</tspan>
            <tspan class="quote-caption-name" dx="4">${quote.label}</tspan>
          </text>
        </g>`,
      )}
    </svg>`;
  }

  /** WCAG checks for the pairs a custom primary is most likely to break. */
  private renderContrastChecks(colors: Record<string, string>): TemplateResult {
    const checks = [
      { label: l("Testo su Primary"), ratio: contrastRatio(colors["on-primary"], colors.primary), min: 4.5 },
      { label: l("Primary su Surface"), ratio: contrastRatio(colors.primary, colors.surface), min: 3 },
    ];
    return html`<ul class="contrast-checks" aria-label=${l("Verifica del contrasto")}>
      ${checks.map(
        (check) => html`<li class=${check.ratio >= check.min ? "is-pass" : "is-fail"}>
          <span>${check.label}</span>
          <strong>${check.ratio.toFixed(1)}:1</strong>
          <span class="contrast-verdict"
            >${check.ratio >= check.min ? "ok" : l("sotto {min}:1", { min: check.min })}</span
          >
        </li>`,
      )}
    </ul>`;
  }

  private renderColorGenerator(): TemplateResult {
    const contrasts = ["Standard", "Medium", "High"];
    return html`<div class="generator">
      <div class="generator-fields">
        ${this.renderThemeSelect()}
        <div class="config-field">
          <span class="config-label">${l("Algoritmo")}</span>
          <docs-select
            label=${l("Algoritmo")}
            .options=${COLOR_ALGORITHMS.map((item) => l(item.label))}
            .value=${l(colorAlgorithm(this.algorithm).label)}
            @change=${(event: Event) => {
              const label = (event as CustomEvent<{ value: string }>).detail.value;
              this.algorithm =
                COLOR_ALGORITHMS.find((item) => l(item.label) === label)?.id ?? "tonal-spot";
            }}
          ></docs-select>
        </div>
        <div class="config-field">
          <span class="config-label">${l("Superfici")}</span>
          <docs-select
            label=${l("Superfici")}
            .options=${SURFACE_MODES.map((item) => l(item.label))}
            .value=${l(surfaceMode(this.surfaces).label)}
            @change=${(event: Event) => {
              const label = (event as CustomEvent<{ value: string }>).detail.value;
              this.surfaces = SURFACE_MODES.find((item) => l(item.label) === label)?.id ?? "white";
            }}
          ></docs-select>
        </div>
        <div class="config-field">
          <span class="config-label">${l("Contrasto")}</span>
          <docs-select
            label=${l("Contrasto")}
            .options=${contrasts}
            .value=${contrasts[Math.round(this.contrast * 2)]}
            @change=${(event: Event) =>
              this.setContrast(
                String(
                  contrasts.indexOf((event as CustomEvent<{ value: string }>).detail.value) / 2,
                ),
              )}
          ></docs-select>
        </div>
      </div>
      <p class="hct-hint">${l(ALGORITHM_HINTS[colorAlgorithm(this.algorithm).id])}</p>
      <div class="generator-actions">
        <bolle-switch
          label=${l("Mantieni il primario esatto")}
          ?checked=${this.keepSeed}
          @change=${(event: Event) =>
            (this.keepSeed = (event as CustomEvent<{ checked: boolean }>).detail.checked)}
        ></bolle-switch>
        <bolle-button @click=${this.generateHct}>${l("Genera da Primary")}</bolle-button>
      </div>
      <p class="hct-hint">
        ${this.dark
          ? l("Il seme è il valore corrente di Primary; la generazione sostituisce tutti gli altri ruoli del tema scuro.")
          : l("Il seme è il valore corrente di Primary; la generazione sostituisce tutti gli altri ruoli del tema chiaro.")}
        ${this.keepSeed
          ? l("Primary resta il colore scelto; il testo sopra diventa il tono più leggibile.")
          : l("Come in Material 3, Primary diventa il tono 40 (chiaro) o 80 (scuro) della palette del seme.")}
      </p>
      ${this.renderContrastChecks(this.tokenSet.colors)}
    </div>`;
  }

  private renderColorRoles(): TemplateResult {
    const set = this.tokenSet;
    const previous = this.previousColors;
    const changed = previous
      ? COLOR_ROLES.filter((role) => previous[role.token] !== set.colors[role.token])
      : [];
    return html`<div class="roles-summary" role="status">
        ${previous
          ? html`<span
                >${withParts(
                  l("{changed} di {total} ruoli cambiati nell'ultima operazione: a sinistra il colore precedente."),
                  { changed: html`<strong>${changed.length}</strong>`, total: COLOR_ROLES.length },
                )}</span
              >
              <bolle-button variant="text" size="xs" @click=${this.undoColors}
                >${l("Annulla")}</bolle-button
              >`
          : html`<span
              >${l(
                "{total} ruoli. Dopo una generazione i ruoli cambiati mostrano il colore precedente accanto al nuovo.",
                { total: COLOR_ROLES.length },
              )}</span
            >`}
      </div>
      ${COLOR_ROLE_GROUPS.map(
        (group) => html`<div class="role-group" id=${`tk-${group.toLowerCase()}`} data-section>
          <h3>${group}</h3>
          <div class="role-grid">
            ${COLOR_ROLES.filter((role) => role.group === group).map((role) => {
              const value = set.colors[role.token];
              const before = previous?.[role.token];
              const isChanged = before !== undefined && before !== value;
              const used = this.inspected?.usage.colors.includes(role.token) ?? false;
              const tile = html`<docs-color
                tile
                class="role-tile ${used ? "is-used" : ""}"
                .label=${role.label}
                .token=${`--md-sys-color-${role.token}`}
                .value=${value}
                .previous=${isChanged ? (before ?? "") : ""}
                @change=${(event: Event) =>
                  this.setColor(role.token, (event as CustomEvent<{ value: string }>).detail.value)}
              ></docs-color>`;
              // Compact tiles show only the value: name and token move into a tooltip.
              return this.paletteDensity === "compact"
                ? html`<bolle-tooltip
                    class="role-tip"
                    .label=${`${role.label} · --md-sys-color-${role.token}${isChanged ? l(" · prima {color}", { color: before ?? "" }) : ""}`}
                    >${tile}</bolle-tooltip
                  >`
                : tile;
            })}
          </div>
        </div>`,
      )}`;
  }

  private shapeUsers = new Map<string, string[]>();

  /** Components whose CSS reads each shape token, computed once from the registered styles. */
  private shapeUsage(token: string): string[] {
    if (this.shapeUsers.size === 0)
      for (const entry of orderedEntries)
        for (const shape of componentTokenUsage(entry.tag).shapes) {
          const list = this.shapeUsers.get(shape) ?? [];
          if (!list.includes(entry.title)) list.push(entry.title);
          this.shapeUsers.set(shape, list);
        }
    return this.shapeUsers.get(token) ?? [];
  }

  private renderShapeControls(): TemplateResult {
    const set = this.tokenSet;
    return html`<div class="generator">
      <h3 class="aside-group">${l("Forma")}</h3>
      ${SHAPE_TOKENS.filter((shape) => shape.max > 0).map(
        (shape) => html`<bolle-slider
          compact
          suffix="px"
          .label=${shape.label}
          .min=${0}
          .max=${shape.max}
          .step=${1}
          .value=${String(set.shapes[shape.token])}
          @focusin=${() => (this.activeShape = shape.token)}
          @pointerenter=${() => (this.activeShape = shape.token)}
          @pointerleave=${() => (this.activeShape = "")}
          @value-input=${(event: Event) => {
            this.activeShape = shape.token;
            this.setShape(shape.token, Number((event as CustomEvent<{ value: string }>).detail.value));
          }}
        ></bolle-slider>`,
      )}
      <h3 class="aside-group">${l("Densità")}</h3>
      ${this.renderDensitySelect()}
      <p class="hct-hint">
        ${withParts(l("{compact} porta a tre quarti spaziature e dimensioni dei componenti."), {
          compact: html`<em>${l("Compatta")}</em>`,
        })}
      </p>
      <h3 class="aside-group">${l("Tipografia")}</h3>
      <div class="config-field">
        <span class="config-label">${l("Font titoli")}</span>
        <docs-select
          label=${l("Font titoli")}
          .options=${FONT_KEYS}
          .value=${set.brandFont}
          @change=${(event: Event) =>
            this.setFont("brandFont", (event as CustomEvent<{ value: string }>).detail.value)}
        ></docs-select>
      </div>
      <div class="config-field">
        <span class="config-label">${l("Font testo")}</span>
        <docs-select
          label=${l("Font testo")}
          .options=${FONT_KEYS}
          .value=${set.plainFont}
          @change=${(event: Event) =>
            this.setFont("plainFont", (event as CustomEvent<{ value: string }>).detail.value)}
        ></docs-select>
      </div>
      <bolle-slider
        compact
        suffix="px"
        label=${l("Dimensione base")}
        .min=${14}
        .max=${20}
        .step=${1}
        .value=${String(set.baseSize)}
        @value-input=${(event: Event) =>
          this.setBaseSize(Number((event as CustomEvent<{ value: string }>).detail.value))}
      ></bolle-slider>
    </div>`;
  }

  /** Every corner token drawn at its current radius, with the components that read it. */
  private renderShapeScale(): TemplateResult {
    const set = this.tokenSet;
    return html`<div class="shape-scale">
      ${SHAPE_TOKENS.map((shape) => {
        const users = this.shapeUsage(shape.token);
        const radius = set.shapes[shape.token];
        return html`<div
          class="shape-tile ${this.activeShape === shape.token ||
          this.inspected?.usage.shapes.includes(shape.token)
            ? "is-active"
            : ""}"
        >
          <div class="shape-sample" style=${`border-radius:${radius}px`}>
            <span class="shape-radius">${radius}px</span>
          </div>
          <span class="shape-name">${shape.label}</span>
          <code class="shape-token">--md-sys-shape-corner-${shape.token}</code>
          <span class="shape-users" title=${users.join(", ")}
            >${users.length === 0
              ? l("Nessun componente: disponibile per il tuo CSS")
              : `${l("{n} componenti", { n: users.length })} · ${users.slice(0, 3).join(", ")}${users.length > 3 ? "…" : ""}`}</span
          >
        </div>`;
      })}
    </div>`;
  }

  private renderTypeSample(): TemplateResult {
    const set = this.tokenSet;
    return html`<div class="type-sample">
      <div>
        <span class="config-label">${l("Titoli · {font}", { font: set.brandFont })}</span>
        <p class="type-sample-brand">${l("Interfacce con tensione superficiale")}</p>
      </div>
      <div>
        <span class="config-label"
          >${l("Testo · {font} · {size}px", { font: set.plainFont, size: set.baseSize })}</span
        >
        <p class="type-sample-plain">
          ${l(
            "Il testo di base usa la dimensione scelta: etichette, campi e paragrafi crescono e calano insieme.",
          )}
        </p>
      </div>
    </div>`;
  }

  private renderEntryTokens(): TemplateResult | typeof nothing {
    if (this.usageTag !== this.entry.tag || !this.usage) return nothing;
    const usage = this.usage;
    const set = this.tokenSet;
    const tag = this.entry.tag;
    const shapes = new Map(SHAPE_TOKENS.map((shape) => [shape.token, shape]));
    const hasEditable =
      usage.colors.length > 0 ||
      usage.shapes.length > 0 ||
      usage.details.length > 0;
    const hasTypography = usage.typography.length > 0;
    if (!hasEditable && !hasTypography) return nothing;
    const hasOverrides = usage.details.some(
      (token) => this.details[tag]?.[token] !== undefined,
    );
    const isSizeToken = this.isSizeToken;
    const otherTokens = usage.details.filter(
      (token) => !isSizeToken(token) && !/color$/.test(token),
    );

    return html`<section class="config-section token-usage" aria-label=${l("Token del componente")}>
      <div class="config-head">
        <h2>${l("Token del componente")}</h2>
        ${hasOverrides
          ? html`<bolle-button
              variant="text"
              size="xs"
              @click=${() => this.resetDetails(tag)}
              >${l("Reimposta dettaglio")}</bolle-button
            >`
          : nothing}
      </div>
      <div class="config-body tokens-config">
        <p class="usage-note">
          ${withParts(
            l("Elenco dei token che il CSS di {tag} usa, con il valore dichiarato accanto a quello attivo. Ogni valore si scrive per intero (px o altra unità) e la modifica vale per tutti gli esempi del componente. Colori e forma restano token globali del tema attivo; i token dei componenti annidati appartengono al componente che li usa."),
            { tag: html`<code>&lt;${tag}&gt;</code>` },
          )}
        </p>

        ${usage.colors.length > 0
          ? html`<h4 class="config-subgroup">${l("Colore")}</h4>
              ${usage.colors.map((token) => {
                const role = COLOR_ROLES.find((item) => item.token === token);
                if (!role) return nothing;
                return html`<div class="config-field">
                  <span class="config-label">${role.label}</span>
                  <docs-color
                    .label=${role.label}
                    .value=${set.colors[token]}
                    @change=${(event: Event) =>
                      this.setColor(
                        token,
                        (event as CustomEvent<{ value: string }>).detail.value,
                      )}
                  ></docs-color>
                </div>`;
              })}`
          : nothing}

        ${usage.shapes.length > 0
          ? html`<h4 class="config-subgroup">${l("Forma")}</h4>
              ${usage.shapes.map((token) => {
                const shape = shapes.get(token);
                if (!shape) return nothing;
                return html`<bolle-slider
                  .label=${shape.label}
                  .min=${0}
                  .max=${shape.max}
                  .step=${1}
                  .value=${String(set.shapes[token])}
                  show-value
                  @value-input=${(event: Event) =>
                    this.setShape(
                      token,
                      Number(
                        (event as CustomEvent<{ value: string }>).detail.value,
                      ),
                    )}
                ></bolle-slider>`;
              })}`
          : nothing}

        ${otherTokens.length > 0
          ? html`<h4 class="config-subgroup">${l("Altri token")}</h4>
              <div class="measure-table">
                ${otherTokens.map((token) => this.renderTokenRow(tag, token))}
              </div>`
          : nothing}

        ${hasTypography
          ? html`<h4 class="config-subgroup">${l("Tipografia")}</h4>
              <p class="usage-scales">
                ${usage.typography.map(
                  (scale) => html`<code>${scale}</code>`,
                )}
              </p>
              <div class="config-field">
                <span class="config-label">${l("Font titoli")}</span>
                <docs-select
                  label=${l("Font titoli")}
                  .options=${FONT_KEYS}
                  .value=${set.brandFont}
                  @change=${(event: Event) =>
                    this.setFont(
                      "brandFont",
                      (event as CustomEvent<{ value: string }>).detail.value,
                    )}
                ></docs-select>
              </div>
              <div class="config-field">
                <span class="config-label">${l("Font testo")}</span>
                <docs-select
                  label=${l("Font testo")}
                  .options=${FONT_KEYS}
                  .value=${set.plainFont}
                  @change=${(event: Event) =>
                    this.setFont(
                      "plainFont",
                      (event as CustomEvent<{ value: string }>).detail.value,
                    )}
                ></docs-select>
              </div>
              <bolle-slider
                label=${l("Dimensione base (px)")}
                .min=${14}
                .max=${20}
                .step=${1}
                .value=${String(set.baseSize)}
                show-value
                @value-input=${(event: Event) =>
                  this.setBaseSize(
                    Number(
                      (event as CustomEvent<{ value: string }>).detail.value,
                    ),
                  )}
              ></bolle-slider>`
          : nothing}
      </div>
    </section>`;
  }

  private renderTokenRow(tag: string, token: string): TemplateResult {
    const value = this.detailValue(tag, token);
    const fallback = tokenDefault(token);
    const overridden = this.details[tag]?.[token] !== undefined;
    const color = this.quoteColor(token);
    const number = this.quotes ? this.quoteNumber(token) : 0;
    const pixels = /^-?\d*\.?\d+px$/.test(value)
      ? Math.abs(parseFloat(value))
      : null;
    return html`<div
      class="measure-row ${overridden ? "is-overridden" : ""} ${this.hoverToken &&
      this.hoverToken !== token
        ? "is-muted"
        : ""}"
      style=${color ? `--quote-color:${color}` : ""}
      @mouseenter=${() => (this.hoverToken = token)}
      @mouseleave=${() => (this.hoverToken = "")}
    >
      <code class="measure-name" title=${token}>
        ${number > 0
          ? html`<span class="measure-index" aria-hidden="true">${number}</span>`
          : html`<span class="measure-swatch" aria-hidden="true"></span>`}${shortTokenName(
          token,
          tag,
        )}
      </code>
      <span class="measure-meta"
        >${withParts(l("default {value}"), { value: html`<b>${fallback || l("non dichiarato")}</b>` })}</span
      >
      ${pixels !== null
        ? html`<span class="measure-field">
            <input
              class="measure-input"
              type="number"
              inputmode="decimal"
              step="1"
              min="0"
              spellcheck="false"
              autocomplete="off"
              aria-label=${l("Valore di {token} in pixel", { token })}
              .value=${String(pixels)}
              @change=${(event: Event) =>
                this.commitPixels(tag, token, event.target as HTMLInputElement)}
              @keydown=${this.onMeasureKeydown}
              @wheel=${this.onMeasureWheel}
            />
            <span class="measure-unit" aria-hidden="true">px</span>
          </span>`
        : html`<input
            class="measure-input is-text"
            type="text"
            spellcheck="false"
            autocomplete="off"
            aria-label=${l("Valore di {token}", { token })}
            .value=${value}
            @change=${(event: Event) =>
              this.setDetail(tag, token, (event.target as HTMLInputElement).value)}
          />`}
      <span class="measure-ruler" aria-hidden="true">
        <span
          class="measure-ruler-bar"
          style=${pixels !== null ? `inline-size:${Math.min(pixels, 96)}px` : ""}
        ></span>
        <span class="measure-ruler-value"
          >${pixels !== null ? `${value}` : value || "—"}</span
        >
      </span>
      ${overridden
        ? html`<bolle-button
            variant="text"
            size="xs"
            @click=${() => this.setDetail(tag, token, "")}
            >${l("Reset")}</bolle-button
          >`
        : nothing}
    </div>`;
  }

  private commitPixels(tag: string, token: string, input: HTMLInputElement) {
    const raw = input.value.trim();
    if (!raw) {
      this.setDetail(tag, token, "");
      return;
    }
    const number = Number(raw);
    if (!Number.isFinite(number)) {
      const current = parseFloat(this.detailValue(tag, token));
      input.value = String(Number.isFinite(current) ? Math.abs(current) : 0);
      return;
    }
    this.setDetail(tag, token, `${Math.round(Math.max(0, number) * 100) / 100}px`);
  }

  /** Shift widens the step, as with any number input plus a coarse mode. */
  private onMeasureKeydown = (event: KeyboardEvent) => {
    const input = event.currentTarget as HTMLInputElement;
    if (!event.shiftKey) return;
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    if (event.key === "ArrowUp") input.stepUp(10);
    else input.stepDown(10);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };

  private onMeasureWheel = (event: WheelEvent) => {
    const input = event.currentTarget as HTMLInputElement;
    // Same rule as a native number input: the wheel edits only a focused field,
    // otherwise it scrolls the panel.
    if (document.activeElement !== input) return;
    event.preventDefault();
    if (event.deltaY < 0) input.stepUp(event.shiftKey ? 10 : 1);
    else input.stepDown(event.shiftKey ? 10 : 1);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };

  private codeFor(entry: Entry, state: State) {
    const spec = entry.code(state);
    const snippets: Record<CodeTab, string | null> = {
      html: buildHtml(entry.tag, spec),
      vue: buildVue(entry.tag, spec),
      react: buildReact(entry.tag, spec),
    };
    const tabs = (Object.keys(snippets) as CodeTab[]).filter(
      (tab) => snippets[tab] !== null,
    );
    const tab = tabs.includes(this.codeTab) ? this.codeTab : tabs[0];
    return { tabs, tab, text: snippets[tab] ?? "" };
  }

  /** Enum controls shown side by side; previews with fixed ids cannot be repeated. */
  private variantControls(entry: Entry, state: State) {
    const sample = entry.render(state, this.ctx);
    if (sample.strings.join("").includes(' id="')) return [];
    return entry.controls.filter(
      (control): control is Extract<Control, { kind: "enum" }> =>
        control.kind === "enum" &&
        control.options.length > 1 &&
        control.options.length <= 7,
    );
  }

  private copyPage(entry: Entry, code: { tab: CodeTab; text: string }) {
    const markdown = pageMarkdown({
      title: entry.title,
      tag: entry.tag,
      group: entry.group,
      summary: l(entry.summary),
      code: code.text,
      codeLanguage: code.tab === "react" ? "jsx" : code.tab,
      api: componentApi(entry.tag),
      support: componentSupport(entry.tag),
    });
    void this.copy(markdown, l("Pagina copiata in Markdown"));
  }

  private renderComponentPage(entry: Entry, state: State): TemplateResult {
    const code = this.codeFor(entry, state);
    const variants = this.variantControls(entry, state);
    const api = componentApi(entry.tag);
    const support = componentSupport(entry.tag);
    const index = orderedEntries.indexOf(entry);
    const previous = orderedEntries[index - 1];
    const next = orderedEntries[index + 1];
    const sections: DocSection[] = [
      { id: "sec-preview", label: l("Anteprima") },
      ...(variants.length > 0 ? [{ id: "sec-variants", label: l("Varianti") }] : []),
      ...(api.length > 0 ? [{ id: "sec-api", label: "API" }] : []),
      ...(support ? [{ id: "sec-support", label: l("Supporto e limiti") }] : []),
      { id: "sec-a11y", label: l("Accessibilità") },
    ];
    const active = this.activeSection || sections[0].id;

    return html`<div class="doc-layout">
      <article class="doc-article">
        <header class="doc-header">
          <nav class="breadcrumb" aria-label=${l("Percorso")}>
            <a href=${routeHref("overview")}>${l("Componenti")}</a>
            <span aria-hidden="true">/</span>
            <span>${entry.section ?? entry.group}</span>
          </nav>
          <div class="doc-title-row">
            <h1>${entry.title}</h1>
            <div class="doc-pager-mini">
              <bolle-icon-button
                variant="standard"
                label=${previous
                  ? l("Precedente: {name}", { name: previous.title })
                  : l("Nessun componente precedente")}
                ?disabled=${!previous}
                @click=${() => previous && this.navigate(previous.tag)}
                >${ti("arrow-left")}</bolle-icon-button
              >
              <bolle-icon-button
                variant="standard"
                label=${next
                  ? l("Successivo: {name}", { name: next.title })
                  : l("Nessun componente successivo")}
                ?disabled=${!next}
                @click=${() => next && this.navigate(next.tag)}
                >${ti("arrow-right")}</bolle-icon-button
              >
            </div>
          </div>
          <div class="doc-meta">
            <code class="tag">&lt;${entry.tag}&gt;</code>
            <span class="meta-chip">${l("{n} proprietà", { n: api.length })}</span>
            <span class="meta-chip">${code.tabs.map((tab) => tab.toUpperCase()).join(" · ")}</span>
          </div>
          <p class="lead">${l(entry.summary)}</p>
          ${entry.note ? html`<p class="note">${l(entry.note)}</p>` : nothing}
        </header>

        ${this.renderPlayground(entry, state, code)}
        ${variants.length > 0 ? this.renderVariants(entry, state, variants) : nothing}
        ${api.length > 0 ? this.renderApi(api) : nothing}
        ${support ? this.renderSupport(support) : nothing}
        ${this.renderAccessibility(entry)}

        <nav class="pager" aria-label=${l("Altri componenti")}>
          ${previous
            ? html`<bolle-card
                class="pager-card"
                variant="elevated"
                tail="top-end"
                href=${routeHref(previous.tag)}
                label=${l("Precedente: {name}", { name: previous.title })}
              >
                <span class="pager-dir">${ti("arrow-left")} ${l("Precedente")}</span>
                <span class="pager-title">${previous.title}</span>
              </bolle-card>`
            : html`<span></span>`}
          ${next
            ? html`<bolle-card
                class="pager-card is-next"
                variant="elevated"
                tail="top-start"
                href=${routeHref(next.tag)}
                label=${l("Successivo: {name}", { name: next.title })}
              >
                <span class="pager-dir">${l("Successivo")} ${ti("arrow-right")}</span>
                <span class="pager-title">${next.title}</span>
              </bolle-card>`
            : nothing}
        </nav>
      </article>

      <aside class="doc-toc" aria-label=${l("In questa pagina")}>
        <p class="toc-title">${l("In questa pagina")}</p>
        <ul>
          ${sections.map(
            (section) => html`<li>
              <button
                type="button"
                class="toc-link ${section.id === active ? "is-active" : ""}"
                aria-current=${section.id === active ? "location" : "false"}
                @click=${() => this.scrollToSection(section.id)}
              >
                ${section.label}
              </button>
            </li>`,
          )}
        </ul>
        <div class="toc-actions">
          <bolle-button variant="text" size="xs" @click=${() => this.copyPage(entry, code)}
            ><span slot="icon" aria-hidden="true">${ti("markdown")}</span>${l("Copia pagina")}</bolle-button
          >
          <bolle-button variant="text" size="xs" @click=${this.openConfig}
            ><span slot="icon" aria-hidden="true">${ti("palette")}</span>${l("Tema e token")}</bolle-button
          >
        </div>
      </aside>
    </div>`;
  }

  /** Tail corner of the code block: toward the tab that opened it, start side for a centred tab. */
  private codeTail(index: number, count: number): "top-start" | "top-end" {
    return index > (count - 1) / 2 ? "top-end" : "top-start";
  }

  private renderPlayground(
    entry: Entry,
    state: State,
    code: { tabs: CodeTab[]; tab: CodeTab; text: string },
  ): TemplateResult {
    const hasSizes = this.sizeTokens.length > 0;
    const side = hasSizes ? this.sideTab : "params";
    const labels: Record<CodeTab, string> = { html: "HTML", vue: "Vue", react: "React" };
    const params = html`<div class="side-body" slot="params">
      ${entry.controls.map((control) => this.renderControl(control, state))}
      <bolle-button variant="text" size="xs" @click=${() => this.reset(entry)}
        ><span slot="icon" aria-hidden="true">${ti("refresh")}</span>${l("Reimposta parametri")}</bolle-button
      >
    </div>`;
    return html`<section id="sec-preview" class="doc-section" aria-labelledby="h-preview">
      <h2 id="h-preview" tabindex="-1">${l("Anteprima")}</h2>
      <div class="playground">
        <div class="playground-stage">
          <div
            class="preview-surface ${this.quotes ? "with-quotes" : ""}"
            data-group=${entry.group}
          >
            ${entry.render(state, this.ctx)}
            ${this.quotes && this.quoteLines.length > 0 ? this.renderQuotes() : nothing}
          </div>
          <div class="playground-side">
            ${hasSizes
              ? html`<bolle-tabs
                  variant="secondary"
                  label=${l("Pannello del playground")}
                  .items=${[
                    { id: "params", label: l("Parametri") },
                    { id: "sizes", label: l("Misure") },
                  ]}
                  .value=${side}
                  @change=${this.onSideTab}
                >
                  ${params}
                  <div class="side-body" slot="sizes">
                    ${this.renderSizeTable()}
                    ${this.details[entry.tag]
                      ? html`<bolle-button
                          variant="text"
                          size="xs"
                          @click=${() => this.resetDetails(entry.tag)}
                          ><span slot="icon" aria-hidden="true">${ti("refresh")}</span>${l("Reimposta misure")}</bolle-button
                        >`
                      : nothing}
                  </div>
                </bolle-tabs>`
              : html`<h3 class="side-title">${l("Parametri")}</h3>
                  ${params}`}
          </div>
        </div>
        <div class="playground-code">
          <bolle-tabs
            variant="secondary"
            label=${l("Codice dell'esempio")}
            .items=${code.tabs.map((tab) => ({ id: tab, label: labels[tab] }))}
            .value=${code.tab}
            @change=${this.onCodeTab}
          >
            ${code.tabs.map(
              (tab, index) => html`<div class="code-panel-body" slot=${tab}>
                <pre
                  class="code-block"
                  data-tail=${this.codeTail(index, code.tabs.length)}
                ><code>${tab === code.tab ? code.text : ""}</code></pre>
                ${tab === code.tab
                  ? html`<bolle-button
                      class="code-copy"
                      variant="text"
                      size="xs"
                      @click=${() => this.copy(code.text)}
                      ><span slot="icon" aria-hidden="true">${ti("copy")}</span>${l("Copia")}</bolle-button
                    >`
                  : nothing}
              </div>`,
            )}
          </bolle-tabs>
        </div>
      </div>
    </section>`;
  }

  private renderVariants(
    entry: Entry,
    state: State,
    controls: Extract<Control, { kind: "enum" }>[],
  ): TemplateResult {
    return html`<section id="sec-variants" class="doc-section" aria-labelledby="h-variants">
      <h2 id="h-variants" tabindex="-1">${l("Varianti")}</h2>
      <p class="section-lead">
        ${l("Ogni riga cambia un solo attributo; gli altri restano quelli dell'anteprima.")}
      </p>
      ${controls.map(
        (control) => html`<div class="variant-group">
          <h3>${l(control.label)} <code>${kebab(control.prop)}</code></h3>
          <div
            class="variant-grid ${WIDE_GROUPS.has(entry.group) ? "is-wide" : ""} ${PANEL_GROUPS.has(entry.group) ? "is-panel" : ""}"
          >
            ${control.options.map(
              (option) => html`<figure class="variant-cell">
                <div class="variant-stage">
                  ${entry.render({ ...state, [control.prop]: option }, this.ctx)}
                </div>
                <figcaption><code>${option}</code></figcaption>
              </figure>`,
            )}
          </div>
        </div>`,
      )}
    </section>`;
  }

  private renderApi(rows: ApiRow[]): TemplateResult {
    return html`<section id="sec-api" class="doc-section" aria-labelledby="h-api">
      <h2 id="h-api" tabindex="-1">API</h2>
      <p class="section-lead">
        ${withParts(
          l("Proprietà pubbliche lette dalla classe registrata. Array e oggetti si assegnano come proprietà JavaScript; gli attributi booleani valgono per presenza, quindi {example} resta disabilitato."),
          { example: html`<code>disabled="false"</code>` },
        )}
      </p>
      <div class="table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th scope="col">${l("Proprietà")}</th>
              <th scope="col">${l("Attributo")}</th>
              <th scope="col">${l("Tipo")}</th>
              <th scope="col">${l("Default")}</th>
              <th scope="col">${l("Riflessa")}</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(
              (row) => html`<tr>
                <th scope="row"><code>${row.name}</code></th>
                <td>${row.attribute ? html`<code>${row.attribute}</code>` : html`<span class="muted">${l("solo JS")}</span>`}</td>
                <td><span class="type">${row.type}</span></td>
                <td><code>${row.defaultValue}</code></td>
                <td>${row.reflects ? l("sì") : html`<span class="muted">${l("no")}</span>`}</td>
              </tr>`,
            )}
          </tbody>
        </table>
      </div>
    </section>`;
  }

  private renderInline(text: string): TemplateResult[] {
    return text
      .split("`")
      .map((part, index) => (index % 2 === 1 ? html`<code>${part}</code>` : html`${part}`));
  }

  private renderSupport(support: SupportInfo): TemplateResult {
    return html`<section id="sec-support" class="doc-section" aria-labelledby="h-support">
      <h2 id="h-support" tabindex="-1">${l("Supporto e limiti")}</h2>
      <p class="section-lead">
        ${l(
          "Cosa è implementato e cosa manca rispetto a Material 3, dal catalogo del README (in inglese). Copertura della voce non significa conformità completa.",
        )}
      </p>
      <div class="support-grid">
        <div class="support-card is-support">
          <h3>${l("Implementato")}</h3>
          <ul>
            ${support.support.map((item) => html`<li>${this.renderInline(item)}</li>`)}
          </ul>
        </div>
        <div class="support-card is-limits">
          <h3>${l("Limiti aperti")}</h3>
          <ul>
            ${support.limits.map((item) => html`<li>${this.renderInline(item)}</li>`)}
          </ul>
        </div>
      </div>
    </section>`;
  }

  private renderAccessibility(entry: Entry): TemplateResult {
    const shortcut = entry.tag !== "bolle-menu";
    return html`<section id="sec-a11y" class="doc-section" aria-labelledby="h-a11y">
      <h2 id="h-a11y" tabindex="-1">${l("Accessibilità")}</h2>
      <dl class="a11y-list">
        <div>
          <dt>${l("Testi ed etichette")}</dt>
          <dd>
            ${l(
              "Etichette, nomi accessibili e testi tradotti arrivano dal contenuto del chiamante: il componente non inventa testo.",
            )}
          </dd>
        </div>
        ${shortcut
          ? html`<div>
              <dt>${l("Scorciatoia da tastiera")}</dt>
              <dd>
                ${withParts(
                  l("L'attributo {attribute} usa la sintassi di {syntax}. Se il componente contiene un controllo focalizzabile, la combinazione lo mette a fuoco; bottoni e link vengono anche attivati."),
                  {
                    attribute: html`<code>shortcut</code>`,
                    syntax: html`<code>aria-keyshortcuts</code>`,
                  },
                )}
                <pre class="code-inline"><code>&lt;${entry.tag} shortcut="Alt+S"&gt;&lt;/${entry.tag}&gt;</code></pre>
              </dd>
            </div>`
          : nothing}
        <div>
          <dt>${l("Direzione del testo")}</dt>
          <dd>
            ${withParts(l("Verifica la resa da destra a sinistra con il pulsante {rtl} nella barra in alto."), {
              rtl: html`<strong>RTL</strong>`,
            })}
          </dd>
        </div>
      </dl>
    </section>`;
  }

  private renderTokensMain(css: string): TemplateResult {
    return html`<div class="tokens-layout">
      <div class="tokens-main">
        <header class="component-header">
          <span class="kicker">${l("Fondamenta")}</span>
          <h1>Design tokens</h1>
          <code class="tag">:root</code>
          <p class="lead">
            ${l(
              "Regola colori, forma e tipografia. Le modifiche si applicano a tutti i componenti e al sito, separatamente per tema chiaro e scuro.",
            )}
          </p>
        </header>

        <section class="panel tokens-colors" aria-labelledby="tokens-colors-title">
          <div class="section-head">
            <h2 id="tokens-colors-title">${l("Tavolozza")}</h2>
            <div class="palette-actions">
              <bolle-segmented-buttons
                label=${l("Densità della tavolozza")}
                .items=${[
                  { id: "compact", label: l("Compatta") },
                  { id: "medium", label: l("Media") },
                  { id: "full", label: l("Estesa") },
                ]}
                .value=${this.paletteDensity}
                @change=${(event: Event) =>
                  (this.paletteDensity = (event as CustomEvent<{ value: string }>).detail
                    .value as "compact" | "medium" | "full")}
              ></bolle-segmented-buttons>
              <bolle-button variant="text" @click=${this.resetTokens}
                >${l("Reimposta tema")}</bolle-button
              >
            </div>
          </div>
          <div class=${`palette palette-${this.paletteDensity} ${this.inspected ? "is-inspecting" : ""}`}>${this.renderColorRoles()}</div>
        </section>

        <section class="panel" id="tk-preview" data-section aria-labelledby="tokens-preview-title">
          <div class="section-head">
            <h2 id="tokens-preview-title">${l("Anteprima")}</h2>
            <span class="hint">${l("Passa sopra un componente per vedere i token che usa")}</span>
          </div>
          <div
            class="preview-surface"
            @pointerover=${this.inspect}
            @focusin=${this.inspect}
            @pointerleave=${this.clearInspect}
            @focusout=${this.clearInspect}
          >
            ${this.renderTokensPreview()}
          </div>
          ${this.renderInspector()}
        </section>

        <section class="panel" id="tk-shape" data-section aria-labelledby="tokens-shape-title">
          <div class="section-head">
            <h2 id="tokens-shape-title">${l("Scala delle forme")}</h2>
            <span class="hint">${l("Raggio degli angoli e componenti che lo usano")}</span>
          </div>
          ${this.renderShapeScale()}
        </section>

        <section class="panel" id="tk-type" data-section aria-labelledby="tokens-type-title">
          <div class="section-head">
            <h2 id="tokens-type-title">${l("Tipografia")}</h2>
          </div>
          ${this.renderTypeSample()}
        </section>

        <section class="panel code-panel" id="tk-css" data-section aria-labelledby="tokens-io-title">
          <div class="section-head">
            <h2 id="tokens-io-title">${l("Esporta e importa")}</h2>
          </div>
          <p class="section-lead">
            ${withParts(
              l("Il JSON contiene tema chiaro e scuro, forme, tipografia e densità e si reimporta qui. Il CSS è pronto per il tuo foglio di stile: tema chiaro su {light}, colori scuri su {dark}."),
              {
                light: html`<code>:root</code>`,
                dark: html`<code>:root[data-theme="dark"]</code>`,
              },
            )}
          </p>
          <div class="io-grid">
            <div class="io-card">
              <h3>${l("Esporta")}</h3>
              <div class="io-actions">
                <bolle-button @click=${this.exportJson}
                  ><span slot="icon" aria-hidden="true">${ti("arrow-down")}</span>${l("Scarica JSON")}</bolle-button
                >
                <bolle-button variant="tonal" @click=${this.exportCss}
                  ><span slot="icon" aria-hidden="true">${ti("arrow-down")}</span>${l("Scarica CSS")}</bolle-button
                >
                <bolle-button variant="text" @click=${() => this.copy(exportThemeCss(this.palettes))}
                  ><span slot="icon" aria-hidden="true">${ti("copy")}</span>${l("Copia CSS")}</bolle-button
                >
              </div>
              <details class="io-preview">
                <summary>${l("Anteprima del CSS")}</summary>
                <pre class="code-block"><code>${exportThemeCss(this.palettes)}</code></pre>
              </details>
            </div>

            <div class="io-card">
              <h3>${l("Importa")}</h3>
              <div
                class="io-drop ${this.dropActive ? "is-active" : ""}"
                @dragover=${(event: DragEvent) => {
                  event.preventDefault();
                  this.dropActive = true;
                }}
                @dragleave=${() => (this.dropActive = false)}
                @drop=${this.onDrop}
              >
                <span>${l("Trascina qui un file .json o .css")}</span>
                <bolle-button
                  variant="outlined"
                  @click=${() => this.querySelector<HTMLInputElement>("#io-file")?.click()}
                  ><span slot="icon" aria-hidden="true">${ti("arrow-up")}</span>${l("Scegli file")}</bolle-button
                >
                <input
                  id="io-file"
                  type="file"
                  hidden
                  accept=".json,.css,application/json,text/css"
                  @change=${this.importFile}
                />
              </div>
              <bolle-text-field
                variant="outlined"
                label=${l("Oppure incolla JSON o CSS")}
                multiline
                rows="3"
                .value=${this.importText}
                ?error=${this.importError !== ""}
                supporting-text=${this.importError}
                @value-input=${(event: Event) => {
                  this.importText = (event as CustomEvent<{ value: string }>).detail.value;
                  this.importError = "";
                }}
              ></bolle-text-field>
              <div class="io-apply">
                <bolle-button
                  variant="tonal"
                  ?disabled=${this.importText.trim() === ""}
                  @click=${() => this.applyImport(this.importText)}
                  >${l("Applica")}</bolle-button
                >
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside class="tokens-aside" aria-label=${l("Controlli dei token")}>
        <bolle-tabs
          variant="secondary"
          label=${l("Controlli")}
          .items=${[
            { id: "colors", label: l("Colori") },
            { id: "shape", label: l("Forma e testo") },
          ]}
          .value=${this.asideTab}
          @change=${(event: Event) => {
            this.asideTab = (event as CustomEvent<{ value: string }>).detail.value as
              | "colors"
              | "shape";
            this.scrollToSection(this.asideTab === "colors" ? "tk-primary" : "tk-shape");
          }}
        >
          <div slot="colors">${this.renderColorGenerator()}</div>
          <div slot="shape">${this.renderShapeControls()}</div>
        </bolle-tabs>
      </aside>
    </div>`;
  }

  private renderFooter(): TemplateResult {
    return html`<footer class="site-footer">
      <span class="bb-logo">${bolleMark(20)}<span>
        ${withParts(l("{name} · ispirata a Material 3, non affiliata a Google."), {
          name: html`<strong class="site-footer-name">bolle</strong>`,
        })}</span></span>
      <a class="md-text-link" href="https://materialui.co/colors" target="_blank" rel="noopener noreferrer"
        >${l("Palette Material")}</a
      >
      <a class="md-text-link" href="https://tabler.io/icons" target="_blank" rel="noopener noreferrer"
        >${l("Icone Tabler")}</a
      >
    </footer>`;
  }

  protected render() {
    if (this.isHome)
      return html`${renderLanding({
          presetId: this.presetId,
          applyPreset: this.applyPreset,
          navigate: (route) => this.navigate(route),
          copy: (text) => this.copy(text),
          localeSelect: this.renderLocaleSelect(),
        })}
        ${this.renderFooter()}
        <bolle-snackbar id="site-snackbar" .duration=${3000}></bolle-snackbar>`;
    const isTokens = this.isTokens;
    const entry = this.entry;
    const state = this.state;
    const css = tokensCss(this.tokenSet);
    const navFilter = html`<bolle-text-field
      class="nav-filter"
      label=${l("Filtra componenti")}
      placeholder=${l("Premi / per cercare")}
      shortcut="/"
      .value=${this.navFilter}
      @value-input=${this.onNavFilter}
      ><span slot="leading" aria-hidden="true">${ti("search")}</span></bolle-text-field
    >`;
    const navList = (navigate: (event: Event) => void) => this.renderSideNav(navigate);

    return html`
      <style>
        ${this.detailsCss}
      </style>
      <header class="topbar">
        <div class="topbar-inner">
          <bolle-icon-button
            class="nav-toggle"
            variant="standard"
            label=${l("Apri navigazione")}
            @click=${this.openDrawer}
            >${ti("menu-2")}</bolle-icon-button
          >
          <a href=${routeHref()} class="landing-brand" aria-label=${l("bolle, presentazione")}
            >${bolleLogo(30)}</a
          >
          <nav class="landing-nav site-nav" aria-label=${l("Principale")}>
            <a
              href=${routeHref("overview")}
              aria-current=${!isTokens && !this.isFoundations ? "page" : nothing}
              >${l("Componenti")}</a
            >
            <a href=${routeHref("foundations")} aria-current=${this.isFoundations ? "page" : nothing}
              >Foundations</a
            >
            <a href=${routeHref("tokens")} aria-current=${isTokens ? "page" : nothing}>${l("Token")}</a>
          </nav>
          <span class="topbar-actions">
            ${this.renderLocaleSelect()}
            ${!isTokens && !this.isPage
              ? html`<bolle-icon-button
                  variant="standard"
                  label=${l("Tema e token")}
                  @click=${this.openConfig}
                  >${ti("palette")}</bolle-icon-button
                >`
              : nothing}
            <bolle-icon-button
              variant="standard"
              label=${this.dark ? l("Tema chiaro") : l("Tema scuro")}
              toggle
              ?selected=${this.dark}
              @click=${this.toggleTheme}
              >${this.dark ? ti("sun") : ti("moon")}</bolle-icon-button
            >
            <bolle-icon-button
              variant="standard"
              label=${l("Direzione RTL")}
              toggle
              ?selected=${this.rtl}
              @click=${this.toggleRtl}
              >RTL</bolle-icon-button
            >
          </span>
        </div>
      </header>

      <div class="shell">
        <aside class="nav-panel" aria-label=${l("Elenco componenti")}>
          ${this.pageSections() ? nothing : navFilter} ${navList(this.onNavigate)}
        </aside>

        <main class="content">
          ${isTokens
            ? this.renderTokensMain(css)
            : this.isFoundations
              ? renderFoundations()
              : this.isOverview
              ? this.renderOverview()
              : this.renderComponentPage(entry, state)}
        </main>

      </div>

      ${!isTokens && !this.isPage
        ? html`<bolle-side-sheet
            id="site-config"
            class="config-sheet"
            label=${l("Tema e token")}
            close-label=${l("Chiudi")}
            detached
          >
            <div class="config-sheet-body">
              <section class="config-section" aria-label=${l("Tema")}>
                <div class="config-head">
                  <h2>${l("Tema")}</h2>
                </div>
                ${this.renderThemeSelect()}
              </section>
              <section class="config-section" aria-label=${l("Template")}>
                <div class="config-head">
                  <h2>${l("Template")}</h2>
                </div>
                ${this.renderDensitySelect()}
              </section>
              ${this.renderEntryTokens()}
            </div>
          </bolle-side-sheet>`
        : nothing}

      ${this.renderFooter()}

      <bolle-snackbar id="site-snackbar" .duration=${3000}></bolle-snackbar>

      <bolle-navigation-drawer
        id="site-drawer"
        label=${l("Componenti")}
        close-label=${l("Chiudi")}
      >
        ${navFilter}
        <bolle-button
          class="tokens-link"
          .variant=${this.isFoundations ? "filled-tonal" : "text"}
          @click=${() => {
            this.navigate("foundations");
            this.closeDrawer();
          }}
          >${ti("star")}<span>Foundations</span></bolle-button
        >
        <bolle-button
          class="tokens-link"
          .variant=${isTokens ? "filled-tonal" : "text"}
          @click=${() => {
            this.navigate("tokens");
            this.closeDrawer();
          }}
          >${ti("palette")}<span>Design tokens</span></bolle-button
        >
        ${navList(this.drawerNavigate)}
      </bolle-navigation-drawer>
    `;
  }
}

if (!customElements.get("bolle-docs"))
  customElements.define("bolle-docs", DocsApp);
