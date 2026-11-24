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
  RECIPES,
  RECIPE_LANGS,
  type Recipe,
  type RecipeLang,
} from "./recipes.js";
import { PLAYGROUND_EXAMPLES } from "./playground-examples.js";
import type { RecipePlayground } from "./recipe-playground.js";
import "./recipe-playground.js";
import {
  componentApi,
  componentSurface,
  componentSupport,
  pageMarkdown,
  type ApiRow,
  type SupportInfo,
} from "./reference.js";
import "./docs-color.js";
import "./docs-select.js";
import { renderStateMatrix } from "./states.js";
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
import { adaptText, pinnedPairs } from "./token-pins.js";
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
  roleVariable,
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
  "tonal-spot": m(
    "Predefinito M3: secondary e tertiary sono varianti tenui della tinta del seme.",
  ),
  vibrant: m("Come tonal spot, con colori più saturi."),
  expressive: m(
    "Ruota le tinte di secondary e tertiary in modo marcato rispetto al seme.",
  ),
  fidelity: m(
    "Primary e container restano molto vicini al seme, anche se saturo.",
  ),
  content: m(
    "Pensato per colori estratti da immagini: fedele al seme, accenti per temperatura.",
  ),
  rainbow: m("Accenti colorati con superfici grigie."),
  "fruit-salad": m("Tinte ruotate e giocose per tutti gli accenti."),
  neutral: m("Quasi senza colore: utile per interfacce sobrie."),
  monochrome: m("Solo grigi: il seme non conta."),
  complementary: m(
    "Secondary e tertiary sul lato opposto della ruota (+180°).",
  ),
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
  "Gantt",
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
  "Gantt",
  "Pagination",
  "App bars",
  "Breadcrumb",
]);

const SCHIUMA = "Schiuma";
/** Reading order of the Schiuma group: whole surfaces first, then the primitives. */
const SCHIUMA_ORDER = [
  "bolle-sidebar",
  "bolle-app-shell",
  "bolle-dashboard",
  "bolle-kanban",
  "bolle-gantt",
  "bolle-data-table",
  "bolle-avatar",
  "bolle-avatar-group",
  "bolle-breadcrumb",
  "bolle-empty-state",
  "bolle-pagination",
];
const bySchiumaOrder = (a: Entry, b: Entry) => {
  const index = (entry: Entry) => {
    const position = SCHIUMA_ORDER.indexOf(entry.tag);
    return position === -1 ? SCHIUMA_ORDER.length : position;
  };
  return index(a) - index(b);
};
const coreEntries = entries.filter((entry) => !entry.section);
const schiumaEntries = entries
  .filter((entry) => entry.section === SCHIUMA)
  .sort(bySchiumaOrder);
/** Material families first, then the Schiuma components for admin applications. */
const orderedEntries = [
  ...groups.flatMap((group) =>
    coreEntries.filter((entry) => entry.group === group),
  ),
  ...schiumaEntries,
];

/** Fills the `{name}` placeholders of a translated string with template parts. */
const withParts = (translated: string, parts: Record<string, unknown>) =>
  translated.split(/(\{\w+\})/).map((segment) => {
    const key = /^\{(\w+)\}$/.exec(segment)?.[1];
    return key && key in parts ? parts[key] : segment;
  });

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

interface AnatomySlotGuide {
  name: string;
  purpose: string;
  example: string;
}

interface AnatomyPartGuide {
  name: string;
  purpose: string;
}

interface AnatomyGuide {
  /** Where the content of the component goes. */
  intro: string;
  /** Complete markup, shown under the two lists. */
  example: string;
  /** Purposes that differ from the shared dictionary. */
  slots?: AnatomySlotGuide[];
  parts?: AnatomyPartGuide[];
}

/** Purpose and markup of a slot, shared by every component that exposes it. */
const SLOT_PURPOSES: Record<string, { purpose: string; example: string }> = {
  default: {
    purpose: "Contenuto principale del componente.",
    example: "<p>Contenuto</p>",
  },
  icon: {
    purpose: "Icona che accompagna il contenuto.",
    example: '<span slot="icon" aria-hidden="true">★</span>',
  },
  avatar: {
    purpose: "Avatar mostrato accanto al testo.",
    example:
      '<bolle-avatar slot="avatar" name="Giulia Ferraro"></bolle-avatar>',
  },
  media: {
    purpose: "Immagine o contenuto grafico della superficie.",
    example: '<img slot="media" alt="" src="/foto.jpg" />',
  },
  supporting: {
    purpose: "Testo di supporto sotto il contenuto principale.",
    example: '<span slot="supporting">Aggiornato ieri</span>',
  },
  leading: {
    purpose: "Contenuto prima del testo: icona o avatar.",
    example: '<bolle-icon slot="leading">…</bolle-icon>',
  },
  trailing: {
    purpose: "Contenuto dopo il testo: icona o valore.",
    example: '<span slot="trailing">12</span>',
  },
  "trailing-icon": {
    purpose: "Icona finale dell'elemento.",
    example: '<span slot="trailing-icon" aria-hidden="true">★</span>',
  },
  actions: {
    purpose: "Comandi in coda all'area o sotto il contenuto.",
    example:
      '<bolle-button slot="actions" variant="text">Annulla</bolle-button>',
  },
  action: {
    purpose: "Comando associato al contenuto.",
    example: '<bolle-button slot="action" variant="text">Apri</bolle-button>',
  },
  prefix: {
    purpose: "Contenuto prima del campo di testo.",
    example: '<span slot="prefix">€</span>',
  },
  suffix: {
    purpose: "Contenuto dopo il campo di testo.",
    example: '<span slot="suffix">,00</span>',
  },
  label: {
    purpose: "Etichetta del controllo, collegata al campo.",
    example: '<span slot="label">Importo</span>',
  },
  value: {
    purpose: "Valore mostrato accanto all'etichetta.",
    example: '<span slot="value">24</span>',
  },
  title: {
    purpose: "Titolo principale della superficie.",
    example: '<h2 slot="title">Commesse</h2>',
  },
  heading: {
    purpose: "Titolo dell'area, letto come intestazione.",
    example: '<h2 slot="heading">Commesse 2026</h2>',
  },
  header: {
    purpose: "Area sopra il contenuto, fuori dal riquadro.",
    example: '<h2 slot="header">Commesse 2026</h2>',
  },
  footer: {
    purpose: "Area sotto il contenuto.",
    example: '<p slot="footer">Totale: 12 commesse</p>',
  },
  content: {
    purpose: "Contenuto centrale, quando il componente ne separa uno.",
    example: "<p>Contenuto</p>",
  },
  body: {
    purpose: "Corpo scorrevole della superficie.",
    example: "<p>Contenuto del corpo</p>",
  },
  message: {
    purpose: "Messaggio testuale della superficie.",
    example: '<span slot="message">Commessa archiviata</span>',
  },
  status: {
    purpose: "Area di stato dell'impalcatura.",
    example: '<span slot="status">Connesso</span>',
  },
  dismiss: {
    purpose: "Comando che chiude la superficie.",
    example:
      '<bolle-button slot="dismiss" variant="text">Chiudi</bolle-button>',
  },
  trigger: {
    purpose: "Elemento che apre l'overlay.",
    example: '<bolle-button slot="trigger">Apri</bolle-button>',
  },
  loading: {
    purpose: "Sostituisce lo stato mostrato durante il caricamento.",
    example: '<p slot="loading">Caricamento…</p>',
  },
  error: {
    purpose:
      "Sostituisce lo stato mostrato quando error contiene un messaggio.",
    example: '<p slot="error" role="alert">Errore di caricamento</p>',
  },
  empty: {
    purpose: "Sostituisce lo stato mostrato quando non ci sono dati.",
    example: '<bolle-button slot="empty" variant="filled">Crea</bolle-button>',
  },
  "empty-state": {
    purpose: "Contenuto dell'area vuota predefinita.",
    example: '<bolle-button slot="empty-state">Crea</bolle-button>',
  },
  badge: {
    purpose: "Segnalazione sovrapposta, come un conteggio.",
    example: '<span slot="badge">3</span>',
  },
  fab: {
    purpose: "Pulsante flottante agganciato all'angolo.",
    example: '<bolle-button slot="fab" variant="fab">+</bolle-button>',
  },
  controls: {
    purpose: "Comandi di avanzamento del contenuto.",
    example:
      '<bolle-button slot="controls" variant="text">Avanti</bolle-button>',
  },
  next: {
    purpose: "Contenuto del comando che va avanti.",
    example: '<span slot="next">Avanti</span>',
  },
  previous: {
    purpose: "Contenuto del comando che torna indietro.",
    example: '<span slot="previous">Indietro</span>',
  },
  results: {
    purpose: "Area dei risultati della ricerca.",
    example: '<bolle-list slot="results">…</bolle-list>',
  },
  filter: {
    purpose: "Campo o comando che filtra il contenuto.",
    example: '<bolle-search slot="filter" label="Filtra"></bolle-search>',
  },
  "end-label": {
    purpose: "Etichetta del valore finale di un intervallo.",
    example: '<span slot="end-label">18:00</span>',
  },
  bar: {
    purpose: "Barra superiore dell'impalcatura.",
    example: '<bolle-app-bar slot="bar" title="Commesse"></bolle-app-bar>',
  },
  "bottom-bar": {
    purpose: "Barra inferiore dell'impalcatura.",
    example: '<bolle-bottom-app-bar slot="bottom-bar"></bolle-bottom-app-bar>',
  },
  navigation: {
    purpose: "Navigazione principale dell'impalcatura.",
    example:
      '<bolle-navigation-drawer slot="navigation">…</bolle-navigation-drawer>',
  },
  "navigation-compact": {
    purpose: "Navigazione ridotta a icona.",
    example:
      '<bolle-navigation-rail slot="navigation-compact">…</bolle-navigation-rail>',
  },
  "supporting-actions": {
    purpose: "Comandi del pannello di supporto.",
    example: '<bolle-button slot="supporting-actions">Salva</bolle-button>',
  },
  "supporting-header": {
    purpose: "Intestazione del pannello di supporto.",
    example: '<h2 slot="supporting-header">Dettaglio</h2>',
  },
  "supporting-inline": {
    purpose: "Supporto in linea, accanto al contenuto.",
    example: '<p slot="supporting-inline">Dettaglio della riga</p>',
  },
  "content-{itemId}": {
    purpose: "Contenuto del pannello della scheda con questo identificatore.",
    example: '<div slot="note">Note della commessa</div>',
  },
  "supporting-modal": {
    purpose: "Supporto sovrapposto al contenuto.",
    example: '<p slot="supporting-modal">Dettaglio della riga</p>',
  },
};

/**
 * Purpose of a CSS part, shared by every component that exposes it. A part the
 * component does not list here keeps the sentence built from its name.
 */
const PART_PURPOSES: Record<string, { purpose: string }> = {
  surface: { purpose: "Superficie visibile della bolla o del pannello." },
  label: { purpose: "Testo dell'etichetta." },
  "label-text": { purpose: "Testo scritto dentro l'etichetta." },
  icon: { purpose: "Icona del componente." },
  "icon-on": { purpose: "Icona dello stato attivo." },
  "icon-off": { purpose: "Icona dello stato inattivo." },
  body: { purpose: "Corpo del componente, sotto l'intestazione." },
  "body-content": { purpose: "Contenuto scorrevole del corpo." },
  actions: { purpose: "Riga dei comandi." },
  "actions-slot": { purpose: "Area che riceve i comandi esterni." },
  "actions-cell": { purpose: "Cella dei comandi di riga." },
  "supporting-text": { purpose: "Testo secondario sotto il contenuto." },
  supporting: { purpose: "Area del testo di supporto." },
  control: { purpose: "Controllo nativo che riceve il clic." },
  trailing: { purpose: "Area finale dell'elemento." },
  content: { purpose: "Contenuto del componente." },
  counter: { purpose: "Conteggio mostrato accanto al testo." },
  field: { purpose: "Riquadro del campo." },
  "field-surface": {
    purpose: "Superficie del campo, su cui si disegna il contorno.",
  },
  input: { purpose: "Area di scrittura." },
  leading: { purpose: "Area iniziale dell'elemento." },
  prefix: { purpose: "Contenuto prima del valore." },
  suffix: { purpose: "Contenuto dopo il valore." },
  loading: { purpose: "Riquadro dello stato di caricamento." },
  empty: { purpose: "Riquadro dello stato vuoto." },
  error: { purpose: "Riquadro dello stato di errore." },
  trigger: { purpose: "Elemento che apre il menu o l'overlay." },
  navigation: { purpose: "Contenitore della navigazione." },
  button: { purpose: "Pulsante interno del componente." },
  group: { purpose: "Gruppo che tiene insieme gli elementi." },
  title: { purpose: "Titolo della superficie." },
  titles: { purpose: "Blocco del titolo e del sottotitolo." },
  subtitle: { purpose: "Sottotitolo della superficie." },
  value: { purpose: "Valore numerico o testuale." },
  indicator: { purpose: "Indicatore dello stato o della posizione." },
  item: { purpose: "Singolo elemento dell'elenco." },
  close: { purpose: "Comando che chiude la superficie." },
  heading: { purpose: "Intestazione della superficie." },
  dismiss: { purpose: "Comando che chiude senza confermare." },
  header: { purpose: "Intestazione del componente." },
  "header-custom": { purpose: "Intestazione fornita dall'applicazione." },
  footer: { purpose: "Piè di pagina del componente." },
  track: { purpose: "Binario su cui scorre l'indicatore." },
  container: { purpose: "Contenitore interno del componente." },
  badge: { purpose: "Segnalazione sovrapposta." },
  "badge-label": { purpose: "Testo della segnalazione." },
  rail: { purpose: "Barra stretta della navigazione." },
  sheet: { purpose: "Pannello che entra dal bordo." },
  status: { purpose: "Area di stato." },
  "resize-handle": { purpose: "Maniglia che ridimensiona il pannello." },
  bubble: { purpose: "Bolla visibile della superficie." },
  list: { purpose: "Elenco interno del componente." },
  card: { purpose: "Scheda interna del componente." },
  divider: { purpose: "Linea di separazione." },
  filter: { purpose: "Campo di filtro." },
  menu: { purpose: "Menu dell'overlay." },
  cancel: { purpose: "Comando di annullamento." },
  confirm: { purpose: "Comando di conferma." },
  dialog: { purpose: "Riquadro del dialogo." },
  bottom: { purpose: "Area inferiore dell'impalcatura." },
  shell: { purpose: "Contenitore dell'impalcatura." },
  grip: { purpose: "Presa che avvia il trascinamento." },
  tile: { purpose: "Riquadro del riquadro della dashboard." },
  busy: { purpose: "Velo mostrato durante un aggiornamento." },
  scroller: { purpose: "Area che riceve lo scorrimento." },
  table: { purpose: "Contenitore esterno della tabella." },
  row: { purpose: "Riga della tabella o dell'elenco." },
  "row-content": { purpose: "Contenuto interno della riga." },
  "row-selected": { purpose: "Riga scelta." },
  "selection-cell": { purpose: "Cella della casella di selezione." },
  "expand-cell": { purpose: "Cella del comando di apertura." },
  "data-cell": { purpose: "Cella di dati." },
  "detail": { purpose: "Riga del dettaglio aperto." },
  "detail-cell": { purpose: "Cella che contiene il dettaglio." },
  "detail-inner": { purpose: "Contenuto del dettaglio." },
  "group-title": { purpose: "Titolo del gruppo." },
  "group-count": { purpose: "Numero di righe del gruppo." },
  "group-summary": { purpose: "Riepilogo del gruppo." },
  "group-toggle": { purpose: "Comando che apre e chiude il gruppo." },
  "group-chevron": { purpose: "Freccia del gruppo." },
  "progress": { purpose: "Avanzamento dell'attività." },
  circular: { purpose: "Indicatore circolare." },
  linear: { purpose: "Indicatore lineare." },
  stop: { purpose: "Comando che ferma l'operazione." },
  wavy: { purpose: "Onda dell'indicatore." },
  carousel: { purpose: "Area del carosello." },
  items: { purpose: "Contenitore degli elementi." },
  viewport: { purpose: "Finestra visibile del contenuto." },
  handle: { purpose: "Presa del cursore." },
  search: { purpose: "Campo di ricerca." },
  "search-form": { purpose: "Modulo della ricerca." },
  "search-results": { purpose: "Elenco dei risultati." },
  suggestion: { purpose: "Singolo suggerimento." },
  suggestions: { purpose: "Elenco dei suggerimenti." },
  segment: { purpose: "Singolo segmento del controllo." },
  segments: { purpose: "Traccia che tiene i segmenti." },
  "segment-label": { purpose: "Testo del segmento." },
  option: { purpose: "Singola voce dell'elenco." },
  board: { purpose: "Superficie della board." },
  column: { purpose: "Colonna della board." },
  "column-title": { purpose: "Titolo della colonna." },
  "column-count": { purpose: "Numero di schede della colonna." },
  "column-header": { purpose: "Intestazione della colonna." },
  "card-header": { purpose: "Intestazione della scheda." },
  "card-row": { purpose: "Riga di dati della scheda." },
  "card-grip": { purpose: "Presa che avvia il trascinamento della scheda." },
  lane: { purpose: "Corsia della board." },
  "lane-header": { purpose: "Intestazione della corsia." },
  tab: { purpose: "Singola scheda della barra." },
  tablist: { purpose: "Elenco delle schede." },
  tabpanel: { purpose: "Pannello della scheda attiva." },
  "tab-label": { purpose: "Testo della scheda." },
  "tab-icon": { purpose: "Icona della scheda." },
  "tab-badge": { purpose: "Segnalazione della scheda." },
  snackbar: { purpose: "Superficie del messaggio." },
  tooltip: { purpose: "Superficie del suggerimento." },
  "fab-menu": { purpose: "Gruppo dei pulsanti flottanti." },
  calendar: { purpose: "Area del calendario." },
  "calendar-grid": { purpose: "Griglia dei giorni." },
  "calendar-header": { purpose: "Intestazione del calendario." },
  day: { purpose: "Singolo giorno." },
  "day-control": { purpose: "Pulsante del giorno." },
  weekday: { purpose: "Nome del giorno della settimana." },
  dial: { purpose: "Quadrante dell'ora." },
  "dial-option": { purpose: "Valore sul quadrante." },
  hour: { purpose: "Campo delle ore." },
  minute: { purpose: "Campo dei minuti." },
  "period-control": { purpose: "Comando del periodo, mattina o pomeriggio." },
  mode: { purpose: "Selettore della modalità." },
  chevron: { purpose: "Freccia che indica l'apertura." },
  placeholder: { purpose: "Testo mostrato quando il campo è vuoto." },
  branch: { purpose: "Ramo dell'albero di navigazione." },
  brand: { purpose: "Marchio in cima alla navigazione." },
  tree: { purpose: "Albero della navigazione." },
  bridge: { purpose: "Ponte che collega i due cursori." },
  liquid: { purpose: "Goccia che segue il cursore." },
  membrane: { purpose: "Membrana della superficie." },
  range: { purpose: "Intervallo scelto." },
  slider: { purpose: "Binario del cursore." },
  thumb: { purpose: "Cursore." },
  "thumb-lower": { purpose: "Cursore inferiore dell'intervallo." },
  "thumb-upper": { purpose: "Cursore superiore dell'intervallo." },
  steps: { purpose: "Elenco dei passi." },
  step: { purpose: "Singolo passo." },
  "step-dot": { purpose: "Punto del passo." },
  "app-bar": { purpose: "Barra dell'applicazione." },
  toolbar: { purpose: "Barra dei comandi." },
  "toolbar-content": { purpose: "Contenuto della barra dei comandi." },
  chip: { purpose: "Superficie della pastiglia." },
  "chip-label": { purpose: "Testo della pastiglia." },
  "chip-remove": { purpose: "Comando che toglie la pastiglia." },
  "list-item": { purpose: "Singola riga dell'elenco." },
  "list-item-row": { purpose: "Riga visibile dell'elemento." },
  "list-label": { purpose: "Testo principale dell'elemento." },
  "list-supporting-text": { purpose: "Testo secondario dell'elemento." },
  "list-icon": { purpose: "Icona dell'elemento." },
  "list-disclosure": { purpose: "Comando che apre il sottoelenco." },
  "list-sublist": { purpose: "Sottoelenco dell'elemento." },
  "list-badge": { purpose: "Segnalazione dell'elemento." },
  "list-content": { purpose: "Contenuto dell'elenco." },
  "navigation-bar": { purpose: "Barra di navigazione." },
  "navigation-rail": { purpose: "Barra stretta di navigazione." },
  destination: { purpose: "Destinazione della navigazione." },
  "destination-item": { purpose: "Elemento della destinazione." },
  destinations: { purpose: "Elenco delle destinazioni." },
  "navigation-destination": { purpose: "Destinazione della barra." },
  "navigation-icon": { purpose: "Icona della destinazione." },
  "navigation-indicator": { purpose: "Indicatore della destinazione attiva." },
  "navigation-label": { purpose: "Testo della destinazione." },
  "rail-item": { purpose: "Elemento della barra stretta." },
  "rail-icon": { purpose: "Icona dell'elemento stretto." },
  "rail-indicator": { purpose: "Indicatore dell'elemento attivo." },
  "rail-label": { purpose: "Testo dell'elemento stretto." },
  "item-icon": { purpose: "Icona dell'elemento di navigazione." },
  "item-label": { purpose: "Testo dell'elemento di navigazione." },
  "item-count": { purpose: "Conteggio dell'elemento di navigazione." },
  "item-chevron": { purpose: "Freccia dell'elemento di navigazione." },
  action: { purpose: "Comando associato al contenuto." },
  "app-bar-actions": {
    purpose: "Comandi in coda all'area o sotto il contenuto.",
  },
  "app-bar-leading": { purpose: "Area iniziale dell'elemento." },
  "app-bar-subtitle": { purpose: "Sottotitolo della superficie." },
  "app-bar-title": { purpose: "Titolo della superficie." },
  "app-bar-title-group": { purpose: "Blocco del titolo e del sottotitolo." },
  bar: { purpose: "Barra dei comandi." },
  "bottom-sheet": { purpose: "Pannello che entra dal bordo." },
  "bubble-primary": {
    purpose: "Superficie visibile della bolla o del pannello.",
  },
  "bubble-secondary": {
    purpose: "Superficie visibile della bolla o del pannello.",
  },
  "bubble-tertiary": {
    purpose: "Superficie visibile della bolla o del pannello.",
  },
  "bubble-value": { purpose: "Valore numerico o testuale." },
  "calendar-month": { purpose: "Intestazione del calendario." },
  "calendar-next": { purpose: "Contenuto del comando che va avanti." },
  "calendar-previous": { purpose: "Contenuto del comando che torna indietro." },
  "calendar-year": { purpose: "Intestazione del calendario." },
  "card-content": { purpose: "Contenuto del componente." },
  "card-link": { purpose: "Elemento che apre l'overlay." },
  "card-media": { purpose: "Immagine o contenuto grafico della superficie." },
  "chip-avatar": { purpose: "Avatar mostrato accanto al testo." },
  "chip-content": { purpose: "Contenuto del componente." },
  "chip-control": { purpose: "Controllo nativo che riceve il clic." },
  "chip-icon": { purpose: "Icona del componente." },
  "column-collapsed": { purpose: "Colonna della board." },
  "column-grip": { purpose: "Presa che avvia il trascinamento." },
  "column-resize": { purpose: "Maniglia che ridimensiona il pannello." },
  "compact-grabber": { purpose: "Presa che avvia il trascinamento." },
  controls: { purpose: "Comandi di avanzamento del contenuto." },
  "data-cell-pinned": { purpose: "Cella di dati." },
  "drag-handle": { purpose: "Presa che avvia il trascinamento." },
  "empty-slot": { purpose: "Contenuto dell'area vuota predefinita." },
  "end-field-surface": {
    purpose: "Superficie del campo, su cui si disegna il contorno.",
  },
  "error-slot": { purpose: "Riquadro dello stato di errore." },
  "filter-container": { purpose: "Campo di filtro." },
  "footer-slot": { purpose: "Piè di pagina del componente." },
  "group-inner": { purpose: "Gruppo che tiene insieme gli elementi." },
  "group-label": { purpose: "Testo dell'etichetta." },
  "header-cell": { purpose: "Cella di dati." },
  "header-cell-pinned": { purpose: "Cella di dati." },
  "header-content": { purpose: "Contenuto della barra dei comandi." },
  "header-label": { purpose: "Testo dell'etichetta." },
  "header-menu": { purpose: "Menu dell'overlay." },
  "header-row": { purpose: "Riga della tabella o dell'elenco." },
  "header-slot": { purpose: "Area sopra il contenuto, fuori dal riquadro." },
  host: { purpose: "Contenitore interno del componente." },
  "hour-input": { purpose: "Campo delle ore." },
  "list-disclosure-icon": { purpose: "Icona che accompagna il contenuto." },
  "list-row": { purpose: "Riga della tabella o dell'elenco." },
  "list-text": { purpose: "Testo principale dell'elemento." },
  "loading-slot": { purpose: "Riquadro dello stato di caricamento." },
  "menu-trigger": { purpose: "Elemento che apre il menu o l'overlay." },
  message: { purpose: "Messaggio testuale della superficie." },
  "minute-input": { purpose: "Campo dei minuti." },
  "month-control": { purpose: "Pulsante del giorno." },
  "month-title": { purpose: "Intestazione del calendario." },
  morph: { purpose: "Onda dell'indicatore." },
  "navigation-compact": { purpose: "Navigazione ridotta a icona." },
  "navigation-destination-item": { purpose: "Elemento della destinazione." },
  next: { purpose: "Contenuto del comando che va avanti." },
  period: { purpose: "Comando del periodo, mattina o pomeriggio." },
  "period-option": { purpose: "Valore sul quadrante." },
  previous: { purpose: "Contenuto del comando che torna indietro." },
  primary: { purpose: "Superficie visibile della bolla o del pannello." },
  "range-merged": { purpose: "Intervallo scelto." },
  "scroll-button": { purpose: "Comandi di avanzamento del contenuto." },
  "scroll-button-next": { purpose: "Contenuto del comando che va avanti." },
  "scroll-button-previous": {
    purpose: "Contenuto del comando che torna indietro.",
  },
  "scroll-icon": { purpose: "Icona del componente." },
  "segment-control": { purpose: "Controllo nativo che riceve il clic." },
  "segment-icon": { purpose: "Icona del componente." },
  "side-sheet": { purpose: "Pannello che entra dal bordo." },
  sort: { purpose: "Comando associato al contenuto." },
  "sort-mark": { purpose: "Indicatore dello stato o della posizione." },
  "submenu-indicator": { purpose: "Freccia che indica l'apertura." },
  support: { purpose: "Area del testo di supporto." },
  "supporting-body": { purpose: "Corpo scorrevole della superficie." },
  "supporting-header": { purpose: "Intestazione del pannello di supporto." },
  "supporting-sheet": { purpose: "Pannello che entra dal bordo." },
  "supporting-title": { purpose: "Titolo della superficie." },
  "tab-content": { purpose: "Pannello della scheda attiva." },
  "tab-scroller": { purpose: "Area che riceve lo scorrimento." },
  "table-grid": { purpose: "Contenitore esterno della tabella." },
  "time-selectors": { purpose: "Modulo della ricerca." },
  "title-group": { purpose: "Blocco del titolo e del sottotitolo." },
  "trailing-icon": { purpose: "Icona finale dell'elemento." },
  "trigger-icon": { purpose: "Icona del componente." },
  "year-control": { purpose: "Pulsante del giorno." },
};

const ANATOMY_GUIDES: Record<string, AnatomyGuide> = {
  "bolle-gantt": {
    intro:
      "Il contenuto delle righe non passa dagli slot: il componente chiama column.render per una cella e barRenderer per la barra, e groupLabel per il nome di un gruppo. Gli slot coprono gli stati, quando al posto delle righe non c'è nulla da mostrare.",
    slots: [
      {
        name: "loading",
        purpose: "Sostituisce lo stato mostrato mentre loading è attivo.",
        example: '<p slot="loading">Caricamento del piano…</p>',
      },
      {
        name: "error",
        purpose:
          "Sostituisce lo stato mostrato quando error contiene un messaggio.",
        example: '<p slot="error" role="alert">Piano non raggiungibile</p>',
      },
      {
        name: "empty",
        purpose: "Sostituisce lo stato mostrato quando non ci sono attività.",
        example:
          '<bolle-button slot="empty" variant="filled">Aggiungi attività</bolle-button>',
      },
    ],
    parts: [
      { name: "loading", purpose: "Riquadro dello stato di caricamento." },
      { name: "error", purpose: "Riquadro dello stato di errore." },
      { name: "empty", purpose: "Riquadro dello stato vuoto." },
    ],
    example: `<bolle-gantt label="Piano di commessa" editable style="block-size: 420px">
  <bolle-button slot="empty" variant="filled">Aggiungi attività</bolle-button>
</bolle-gantt>`,
  },
  "bolle-button": {
    intro:
      "Il pulsante prende dallo slot predefinito il testo e dagli altri due l'icona iniziale e quella finale; la variante decide se il contenuto è testo, icona o entrambi.",
    example: `<bolle-button variant="filled">
  <span slot="icon" aria-hidden="true">★</span>
  Salva la commessa
</bolle-button>`,
  },
  "bolle-icon-button": {
    intro:
      "Il pulsante a icona prende dallo slot predefinito il simbolo e da icon la variante grafica; label resta obbligatoria perché è il nome letto dai lettori di schermo.",
    example: `<bolle-icon-button label="Cerca">
  <span slot="icon" aria-hidden="true">★</span>
</bolle-icon-button>`,
  },
  "bolle-floating-action-button": {
    intro:
      "Il pulsante flottante prende dallo slot predefinito il testo, che con size regular resta nascosto, e da icon il simbolo; extended aggiunge l'etichetta accanto all'icona.",
    example: `<bolle-floating-action-button label="Nuova commessa">
  <span slot="icon" aria-hidden="true">+</span>
</bolle-floating-action-button>`,
  },
  "bolle-extended-fab": {
    intro:
      "Il pulsante flottante esteso mostra icona e testo insieme: lo slot predefinito riceve il testo e lo slot icon il simbolo.",
    example: `<bolle-extended-fab>
  <span slot="icon" aria-hidden="true">+</span>
  Nuova commessa
</bolle-extended-fab>`,
  },
  "bolle-button-group": {
    intro:
      "Il gruppo tiene insieme pulsanti adiacenti e prende dallo slot predefinito i pulsanti da unire, nell'ordine in cui li scrivi.",
    example: `<bolle-button-group variant="connected">
  <bolle-button variant="outlined">Giorno</bolle-button>
  <bolle-button variant="outlined">Settimana</bolle-button>
</bolle-button-group>`,
  },
  "bolle-badge": {
    intro:
      "Il badge mostra un conteggio o una parola sopra un altro elemento e prende dallo slot label il testo, quando non vuoi passarlo come proprietà.",
    example: `<bolle-badge label="12">
  <bolle-icon-button label="Messaggi">…</bolle-icon-button>
</bolle-badge>`,
  },
  "bolle-bottom-app-bar": {
    intro:
      "La barra inferiore tiene i comandi in linea e il pulsante flottante: lo slot predefinito riceve i comandi, gli altri slot l'elemento iniziale, quello finale e il pulsante flottante.",
    example: `<bolle-bottom-app-bar>
  <bolle-icon-button slot="leading" label="Menu">…</bolle-icon-button>
  <bolle-icon-button label="Cerca">…</bolle-icon-button>
  <bolle-button slot="fab" variant="fab" label="Nuovo">+</bolle-button>
</bolle-bottom-app-bar>`,
  },
  "bolle-progress-indicator": {
    intro:
      "L'indicatore di avanzamento non ha slot: riceve value, min, max e label e disegna la forma lineare o circolare; con indeterminate segnala un'attesa senza valore.",
    example: `<bolle-progress-indicator value="62" label="Avanzamento"></bolle-progress-indicator>`,
  },
  "bolle-loading-indicator": {
    intro:
      "L'indicatore di caricamento non ha slot: mostra un'animazione con la label accessibile che gli passi, e contained lo appoggia su una superficie.",
    example: `<bolle-loading-indicator label="Caricamento delle commesse"></bolle-loading-indicator>`,
  },
  "bolle-snackbar": {
    intro:
      "Il messaggio si mostra con show() e prende dagli slot il testo, l'azione che lo accompagna e il comando che lo chiude; la proprietà message resta la scorciatoia per il solo testo.",
    example: `<bolle-snackbar id="feedback" timeout="6000">
  <span slot="message">Commessa archiviata</span>
  <bolle-button slot="action" variant="text">Annulla</bolle-button>
</bolle-snackbar>`,
  },
  "bolle-tooltip": {
    intro:
      "Il suggerimento si aggancia a un elemento con show(anchor) e prende dallo slot predefinito il contenuto; gli altri slot coprono etichetta, testo di supporto, comandi e il comando di chiusura delle varianti ricche.",
    example: `<bolle-tooltip id="hint" text="Salva la commessa">
  <bolle-icon-button label="Salva">…</bolle-icon-button>
</bolle-tooltip>`,
  },
  "bolle-carousel": {
    intro:
      "Il carosello scorre gli elementi che riceve nello slot predefinito e prende dagli slot i comandi di avanzamento, lo stato letto dai lettori di schermo e i controlli aggiuntivi.",
    example: `<bolle-carousel label="Schede">
  <bolle-card>Prima scheda</bolle-card>
  <bolle-card>Seconda scheda</bolle-card>
</bolle-carousel>`,
  },
  "bolle-card": {
    intro:
      "La scheda prende dallo slot predefinito il contenuto e dagli altri slot l'immagine di testa e la riga di comandi: media occupa la larghezza, content resta la scorciatoia per il solo blocco interno.",
    example: `<bolle-card variant="filled">
  <img slot="media" alt="" src="/cantiere.jpg" />
  <h3>Ristrutturazione scuola</h3>
  <p>Consegna prevista a marzo 2027.</p>
  <bolle-button slot="actions" variant="text">Apri</bolle-button>
</bolle-card>`,
  },
  "bolle-dialog": {
    intro:
      "Il dialogo prende dallo slot predefinito il contenuto e dagli altri due il titolo letto come intestazione e la riga dei comandi; con modal blocca la pagina, con fullscreen la occupa.",
    example: `<bolle-dialog label="Archivia commessa" modal>
  <h2 slot="heading">Archiviare la commessa?</h2>
  <p>La commessa esce dagli elenchi attivi.</p>
  <bolle-button slot="actions" variant="text">Annulla</bolle-button>
  <bolle-button slot="actions" variant="filled">Archivia</bolle-button>
</bolle-dialog>`,
  },
  "bolle-bottom-sheet": {
    intro:
      "Il foglio dal basso prende dallo slot predefinito il contenuto, dallo slot heading il titolo e da actions i comandi; drag-handle mostra la presa che lo trascina.",
    example: `<bolle-bottom-sheet label="Filtri" drag-handle>
  <h2 slot="heading">Filtri</h2>
  <p>Scegli lo stato delle commesse.</p>
  <bolle-button slot="actions" variant="filled">Applica</bolle-button>
</bolle-bottom-sheet>`,
  },
  "bolle-side-sheet": {
    intro:
      "Il foglio laterale prende dallo slot predefinito il contenuto, da heading il titolo e da actions i comandi; entra dal lato indicato da placement e modal lo rende bloccante.",
    example: `<bolle-side-sheet label="Dettaglio commessa" placement="end">
  <h2 slot="heading">C2026-1000</h2>
  <p>Ristrutturazione scuola di Seriate.</p>
  <bolle-button slot="actions" variant="filled">Apri scheda</bolle-button>
</bolle-side-sheet>`,
  },
  "bolle-divider": {
    intro:
      "Il separatore non ha slot: disegna una linea fra due gruppi di contenuto, con inset per staccarla dai bordi e vertical per separare elementi affiancati.",
    example: `<p>Committenti</p>
<bolle-divider></bolle-divider>
<p>Fornitori</p>`,
  },
  "bolle-app-bar": {
    intro:
      "La barra dell'applicazione prende dal titolo il testo principale e dagli slot i comandi iniziali e finali; lo slot predefinito sostituisce il titolo quando serve un'intestazione più ricca.",
    example: `<bolle-app-bar title="Commesse">
  <bolle-icon-button slot="leading" label="Menu">…</bolle-icon-button>
  <bolle-icon-button slot="actions" label="Cerca">…</bolle-icon-button>
</bolle-app-bar>`,
  },
  "bolle-toolbar": {
    intro:
      "La barra dei comandi dispone gli elementi che riceve nello slot predefinito, e con variabili può portare a capo i comandi in eccesso invece di comprimerli.",
    example: `<bolle-toolbar label="Azioni sulle commesse">
  <bolle-button variant="text">Esporta</bolle-button>
  <bolle-button variant="text">Archivia</bolle-button>
</bolle-toolbar>`,
  },
  "bolle-navigation-bar": {
    intro:
      "La barra di navigazione legge le destinazioni dalle proprietà, non dagli slot: ogni destinazione porta icona, testo e indicatore di attività.",
    example: `<bolle-navigation-bar label="Sezioni" value="commesse"></bolle-navigation-bar>`,
  },
  "bolle-navigation-rail": {
    intro:
      "La barra stretta legge le destinazioni dalle proprietà: con expanded mostra anche i testi, altrimenti resta alle icone con il suggerimento.",
    example: `<bolle-navigation-rail label="Sezioni" value="commesse"></bolle-navigation-rail>`,
  },
  "bolle-navigation-drawer": {
    intro:
      "Il pannello di navigazione prende dallo slot predefinito le voci, da heading il titolo e da actions i comandi in coda, e si apre in linea o sovrapposto alla pagina.",
    example: `<bolle-navigation-drawer label="Sezioni" open>
  <h2 slot="heading">Commesse</h2>
  <a href="#/it/clienti">Clienti</a>
  <a href="#/it/fornitori">Fornitori</a>
  <span slot="actions">Versione 0.3.3</span>
</bolle-navigation-drawer>`,
  },
  "bolle-tabs": {
    intro:
      "Le schede leggono le voci dalle proprietà e prendono dallo slot predefinito i pannelli: ogni pannello dichiara con slot il nome della scheda che lo apre.",
    example: `<bolle-tabs label="Dettaglio" value="note">
  <div slot="note">Note della commessa</div>
  <div slot="documenti">Documenti allegati</div>
</bolle-tabs>`,
  },
  "bolle-checkbox": {
    intro:
      "La casella prende dallo slot predefinito il testo dell'etichetta e si collega al campo con name, value e checked; indeterminate mostra lo stato misto.",
    example: `<bolle-checkbox name="urgente">Segna come urgente</bolle-checkbox>`,
  },
  "bolle-switch": {
    intro:
      "L'interruttore prende dallo slot predefinito il testo dell'etichetta e cambia stato da sé, riportando il valore con l'evento change.",
    example: `<bolle-switch name="notifiche" checked>Notifiche attive</bolle-switch>`,
  },
  "bolle-radio-button": {
    intro:
      "Il pulsante di opzione prende dallo slot predefinito il testo e si raggruppa per name: scegliere una voce toglie la scelta alle altre dello stesso gruppo.",
    example: `<bolle-radio-button name="priorita" value="alta" checked>Alta</bolle-radio-button>
<bolle-radio-button name="priorita" value="bassa">Bassa</bolle-radio-button>`,
  },
  "bolle-chip": {
    intro:
      "La pastiglia prende dallo slot predefinito il testo e dagli altri un'icona o un avatar; removable aggiunge il comando che la toglie.",
    example: `<bolle-chip removable>
  <bolle-avatar slot="avatar" name="Giulia Ferraro"></bolle-avatar>
  Urgente
</bolle-chip>`,
  },
  "bolle-list": {
    intro:
      "L'elenco prende dallo slot predefinito le righe, scritte come bolle-list-item, e le compone con icona, testo, supporto e coda; itemRenderer sostituisce l'intera riga.",
    example: `<bolle-list label="Commesse">
  <bolle-list-item>C2026-1000</bolle-list-item>
  <bolle-list-item>C2026-1001</bolle-list-item>
</bolle-list>`,
  },
  "bolle-segmented-buttons": {
    intro:
      "Il controllo a segmenti legge le voci dalle proprietà e non ha slot: label resta la legenda del gruppo, e con multiple la scelta ammette più segmenti.",
    example: `<bolle-segmented-buttons id="vista" label="Vista"></bolle-segmented-buttons>

<script type="module">
  const vista = document.querySelector("#vista");
  vista.items = [
    { id: "elenco", label: "Elenco" },
    { id: "griglia", label: "Griglia" },
  ];
  vista.value = "elenco";
</script>`,
  },
  "bolle-slider": {
    intro:
      "Il cursore prende dagli slot l'icona alle due estremità, l'etichetta e il valore mostrato; con range mostra due cursori e riporta entrambi i valori.",
    example: `<bolle-slider label="Avanzamento" value="40"></bolle-slider>`,
  },
  "bolle-steps": {
    intro:
      "I passi leggono le voci dalle proprietà e prendono dallo slot label il testo del passo corrente, quando il nome non basta.",
    example: `<bolle-steps label="Avanzamento" value="1">
  <span slot="label">Documenti</span>
</bolle-steps>`,
  },
  "bolle-text-field": {
    intro:
      "Il campo di testo prende dallo slot predefinito nulla del contenuto scritto, che resta nell'input, e dagli altri slot l'icona iniziale, il prefisso, il suffisso, il comando finale e il testo di supporto.",
    example: `<bolle-text-field label="Importo">
  <span slot="prefix">€</span>
  <span slot="suffix">,00</span>
  <span slot="supporting">Importo al netto dell'IVA</span>
</bolle-text-field>`,
  },
  "bolle-search": {
    intro:
      "La ricerca prende dagli slot il contenuto del campo e dei risultati: results riceve l'elenco che compare sotto la barra, il resto segue le regole del campo di testo.",
    example: `<bolle-search label="Cerca commesse">
  <bolle-list slot="results" label="Risultati"></bolle-list>
</bolle-search>`,
  },
  "bolle-date-picker": {
    intro:
      "Il selettore di data prende dagli slot il titolo del pannello e il testo di supporto del campo; end-label nomina il valore finale quando selection-mode è range.",
    example: `<bolle-date-picker label="Scadenza" selection-mode="range">
  <span slot="end-label">Fine periodo</span>
</bolle-date-picker>`,
  },
  "bolle-time-picker": {
    intro:
      "Il selettore di orario prende dagli slot il titolo del quadrante e il testo di supporto del campo; con format a ventiquattro ore sparisce il periodo.",
    example: `<bolle-time-picker label="Consegna" format="24">
  <span slot="title">Orario di consegna</span>
</bolle-time-picker>`,
  },
  "bolle-menu": {
    intro:
      "Il menu si apre con show(anchor) e legge le voci dalle proprietà, non dagli slot: ogni voce porta testo, icona, scorciatoia e sotto-menu.",
    example: `<bolle-button id="apri">Azioni</bolle-button>

<script type="module">
  const menu = document.querySelector("#azioni");
  menu.items = [{ id: "esporta", label: "Esporta" }];
  menu.show(document.querySelector("#apri"));
</script>`,
  },
  "bolle-fab-menu": {
    intro:
      "Il menu dei pulsanti flottanti legge le azioni dalle proprietà e prende dallo slot icon il simbolo del pulsante che lo apre.",
    example: `<bolle-fab-menu label="Azioni rapide">
  <span slot="icon" aria-hidden="true">+</span>
</bolle-fab-menu>`,
  },
  "bolle-split-button": {
    intro:
      "Il pulsante diviso separa l'azione principale dal menu: lo slot predefinito riceve il testo del pulsante, icon l'icona e il menu si apre dal comando a fianco.",
    example: `<bolle-split-button label="Salva">
  <span slot="icon" aria-hidden="true">★</span>
</bolle-split-button>`,
  },
  "bolle-select": {
    intro:
      "La select avvolge un elemento select nativo: le opzioni restano nel markup, e lo slot supporting porta il testo che spiega la scelta.",
    example: `<bolle-select label="Stato">
  <select>
    <option>In corso</option>
    <option>Chiusa</option>
  </select>
  <span slot="supporting">Lo stato cambia l'ordine degli elenchi</span>
</bolle-select>`,
  },
  "bolle-autocomplete": {
    intro:
      "Il campo con suggerimenti prende dagli slot gli stessi contenuti del campo di testo; l'elenco dei suggerimenti si apre da sé sopra il resto del contenuto.",
    example: `<bolle-autocomplete label="Comune">
  <span slot="supporting">Inizia a scrivere il nome del comune</span>
</bolle-autocomplete>`,
  },
  "bolle-sidebar": {
    intro:
      "Il contenuto della navigazione non passa dagli slot: il componente legge items, groups e actions e chiama item e railItem per il contenuto di una voce. Gli slot coprono l'intestazione, il filtro, il piè di pagina e lo stato vuoto.",
    parts: [
      {
        name: "item",
        purpose:
          "Riga della navigazione, uguale per voce semplice e gruppo; porta anche il livello e lo stato con le parti qui sotto.",
      },
      {
        name: "item-current",
        purpose: "Riga che corrisponde alla pagina corrente.",
      },
      {
        name: "item-group",
        purpose: "Riga di un gruppo che apre un sottoelenco.",
      },
      {
        name: "item-active",
        purpose:
          "Gruppo che contiene la pagina corrente, aperto o chiuso che sia.",
      },
      {
        name: "level-1",
        purpose: "Riga di primo livello.",
      },
      {
        name: "level-2",
        purpose: "Riga di secondo livello, dentro un gruppo.",
      },
      {
        name: "level-3",
        purpose: "Riga di terzo livello, dentro un gruppo annidato.",
      },
      {
        name: "branch",
        purpose: "Sottoelenco aperto da un gruppo.",
      },
      {
        name: "resize-handle",
        purpose: "Maniglia che regola la larghezza della barra.",
      },
    ],
    example: `<bolle-sidebar label="Navigazione" collapsed-label="Espandi">
  <bolle-search slot="filter" label="Filtra"></bolle-search>
  <span slot="footer">Versione 0.3.3</span>
</bolle-sidebar>`,
  },
  "bolle-app-shell": {
    intro:
      "L'impalcatura compone le superfici intorno al contenuto: la navigazione, la barra, quella inferiore e il pannello di supporto arrivano dagli slot, e il contenuto principale è lo slot predefinito.",
    example: `<bolle-app-shell>
  <bolle-navigation-drawer slot="navigation" label="Sezioni"></bolle-navigation-drawer>
  <bolle-app-bar slot="bar" title="Commesse"></bolle-app-bar>
  <main>Contenuto della pagina</main>
  <bolle-bottom-app-bar slot="bottom-bar"></bolle-bottom-app-bar>
</bolle-app-shell>`,
  },
  "bolle-dashboard": {
    intro:
      "La dashboard dispone i riquadri che le passi e non impone contenuti: ogni riquadro è un bolle-widget nello slot predefinito, con intestazione, corpo, comandi e maniglia di ridimensionamento già forniti dal widget.",
    example: `<bolle-dashboard label="Panoramica">
  <bolle-widget title="Lavori in ritardo" span="8">
    <p>Quattro commesse oltre la scadenza.</p>
  </bolle-widget>
  <bolle-widget title="Avanzamento cantieri" span="4">
    <bolle-progress-indicator value="62" label="Avanzamento"></bolle-progress-indicator>
  </bolle-widget>
</bolle-dashboard>`,
  },
  "bolle-kanban": {
    intro:
      "Il contenuto di una scheda non passa dagli slot: il componente legge columns e cards e chiama card per il contenuto della scheda. Gli slot coprono gli stati, quando al posto della board non c'è nulla da mostrare.",
    example: `<bolle-kanban label="Cantieri" movable>
  <bolle-button slot="empty" variant="filled">Crea la prima scheda</bolle-button>
</bolle-kanban>`,
  },
  "bolle-avatar": {
    intro:
      "L'avatar mostra iniziali o un'immagine e prende dallo slot icon il simbolo che sostituisce le iniziali, per esempio quando l'immagine non è disponibile.",
    example: `<bolle-avatar name="Giulia Ferraro">
  <span slot="icon" aria-hidden="true">★</span>
</bolle-avatar>`,
  },
  "bolle-avatar-group": {
    intro:
      "Il gruppo impila gli avatar che riceve e riassume i restanti in un conteggio: lo slot predefinito riceve i bolle-avatar, e l'ordine è quello in cui li scrivi.",
    example: `<bolle-avatar-group label="Partecipanti" max="3">
  <bolle-avatar name="Giulia Ferraro"></bolle-avatar>
  <bolle-avatar name="Marco Bellini"></bolle-avatar>
  <bolle-avatar name="Sara Colombo"></bolle-avatar>
  <bolle-avatar name="Luca De Santis"></bolle-avatar>
</bolle-avatar-group>`,
  },
  "bolle-breadcrumb": {
    intro:
      "Le briciole arrivano da items, non dagli slot: il componente disegna il percorso, separa le voci e rende l'ultima come pagina corrente.",
    example: `<bolle-breadcrumb label="Percorso">
  <a href="#/it/">Home</a>
  <a href="#/it/commesse">Commesse</a>
  <span aria-current="page">C2026-1000</span>
</bolle-breadcrumb>`,
  },
  "bolle-tour": {
    intro:
      "Il tour non ha slot: il contenuto dei passi è un array, e l'applicazione lo ricava dal JSON con parseTourConfig. Espone i CSS part di ogni pezzo della scheda, dalla layer al singolo testo, per adattarlo alla propria pelle.",
    parts: [
      {
        name: "layer",
        purpose:
          "Livello fisso che blocca la pagina e contiene il riflettore e la scheda.",
      },
      {
        name: "spotlight",
        purpose:
          "Riquadro che tiene in luce l'elemento del passo e scurisce il resto.",
      },
      {
        name: "card",
        purpose: "Scheda del passo, ancorata al bersaglio o centrata.",
      },
      { name: "counter", purpose: "Riga con il numero del passo e il totale." },
      {
        name: "title",
        purpose:
          "Titolo del passo, usato anche come nome accessibile della scheda.",
      },
      { name: "body", purpose: "Testo del passo." },
      {
        name: "actions",
        purpose: "Riga dei comandi: salta, indietro, avanti o fine.",
      },
    ],
    example: `<script type="module">
  import { parseTourConfig, shouldStartTour } from "@bolle/web-components";

  const config = parseTourConfig(await (await fetch("/tour.json")).text());
  if (shouldStartTour(config, localStorage.getItem("tour-version"))) {
    const tour = document.querySelector("bolle-tour");
    tour.steps = config.steps;
    tour.addEventListener("finish", () => {
      localStorage.setItem("tour-version", config.version);
    });
    tour.start();
  }
</script>

<bolle-tour label="Primo accesso"></bolle-tour>`,
  },
  "bolle-empty-state": {
    intro:
      "Lo stato vuoto centra un'icona, un titolo e un testo, e prende dallo slot actions il comando che fa uscire dallo stato vuoto.",
    example: `<bolle-empty-state title="Nessuna commessa" text="Non ci sono commesse per questo filtro.">
  <bolle-button slot="actions" variant="filled">Crea commessa</bolle-button>
</bolle-empty-state>`,
  },
  "bolle-pagination": {
    intro:
      "La paginazione non ha slot: mostra l'intervallo, le frecce e le pagine numerate, e si sposta alla pagina richiesta riportandola con page-change.",
    example: `<bolle-pagination label="Pagine" page-size="10" total="248"></bolle-pagination>`,
  },
  "bolle-data-table": {
    intro:
      "Il contenuto delle celle non passa dagli slot: il componente chiama column.render, rowRenderer, detail e groupSummary. Gli slot coprono le aree esterne alla tabella.",
    slots: [
      {
        name: "header",
        purpose: "Aggiunge un'area sopra la tabella, fuori dal riquadro.",
        example: '<h2 slot="header">Commesse 2026</h2>',
      },
      {
        name: "loading",
        purpose:
          "Sostituisce lo stato mostrato durante il caricamento iniziale.",
        example: '<p slot="loading">Caricamento delle commesse…</p>',
      },
      {
        name: "error",
        purpose:
          "Sostituisce lo stato mostrato quando error contiene un messaggio.",
        example: '<p slot="error" role="alert">Errore di caricamento</p>',
      },
      {
        name: "empty",
        purpose: "Aggiunge azioni dentro lo stato vuoto predefinito.",
        example:
          '<bolle-button slot="empty" variant="filled">Crea commessa</bolle-button>',
      },
      {
        name: "empty-state",
        purpose: "Sostituisce interamente lo stato vuoto.",
        example: '<section slot="empty-state">Nessuna commessa</section>',
      },
      {
        name: "footer",
        purpose: "Sostituisce la paginazione predefinita.",
        example: '<nav slot="footer" aria-label="Pagine">Pagina 1</nav>',
      },
    ],
    parts: [
      { name: "table", purpose: "Contenitore esterno della tabella." },
      {
        name: "scroller",
        purpose: "Area che riceve lo scorrimento verticale e orizzontale.",
      },
      { name: "header", purpose: "Intestazione della tabella." },
      { name: "header-cell", purpose: "Singola cella di intestazione." },
      { name: "sort", purpose: "Pulsante che attiva l'ordinamento." },
      {
        name: "column-resize",
        purpose: "Controllo separatore della larghezza colonna.",
      },
      { name: "row", purpose: "Riga dati." },
      { name: "data-cell", purpose: "Cella dati." },
      { name: "detail", purpose: "Area espansa sotto la riga." },
      { name: "group", purpose: "Riga di raggruppamento." },
      { name: "group-summary", purpose: "Area del riepilogo di gruppo." },
      { name: "loading", purpose: "Stato di caricamento." },
      { name: "error", purpose: "Stato di errore." },
      { name: "empty", purpose: "Stato vuoto." },
      { name: "footer", purpose: "Area della paginazione." },
    ],
    example: `const columns = [
  {
    key: "code",
    label: "Codice",
    render: (row) => html\`<strong>\${row.code}</strong>\`,
  },
  {
    key: "amount",
    label: "Importo",
    align: "end",
  },
];

const detail = (row) => html\`
  <dl>
    <dt>Cliente</dt>
    <dd>\${row.client}</dd>
  </dl>
\`;

html\`<bolle-data-table
  .columns=\${columns}
  .rows=\${rows}
  .detail=\${detail}
  expandable
></bolle-data-table>\``,
  },
};

export class DocsApp extends LitElement {
  static properties = {
    route: { state: true },
    states: { state: true },
    expanded: { state: true },
    codeTab: { state: true },
    recipeLang: { state: true },
    dark: { state: true },
    rtl: { state: true },
    palettes: { state: true },
    contrast: { state: true },
    keepSeed: { state: true },
    pins: { state: true },
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
  declare recipeLang: RecipeLang;
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
  /** Colour roles the reader fixed, per theme: the generator adapts the rest around them. */
  declare pins: Record<ThemeName, Record<string, string>>;
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
  private usagePending = false;
  private quoteObserver?: ResizeObserver;

  constructor() {
    super();
    const fromHash = location.hash.replace(/^#\/?/, "").split("/")[0];
    this.language = isLocale(fromHash) ? fromHash : browserLocale();
    setLocale(this.language);
    document.title = l("bolle · Interfacce con tensione superficiale");
    this.route = "home";
    this.codeTab = "html";
    this.recipeLang = "html";
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
    this.pins = { light: {}, dark: {} };
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
      const host = this.querySelector<{
        show?: (opener?: HTMLElement) => void;
      }>(`#${id}`);
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
    const element = this.querySelector(`.preview-surface ${this.entry.tag}`);
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
      this.scheduleUsage();
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

  private scheduleUsage() {
    if (this.usagePending) return;
    this.usagePending = true;
    requestAnimationFrame(() => {
      this.usagePending = false;
      if (!this.isConnected || this.isHome || this.isTokens || this.isPage)
        return;
      const element = this.querySelector(`.preview-surface ${this.entry.tag}`);
      if (!element) return;
      const root = element.shadowRoot;
      const usage = componentTokenUsage(
        this.entry.tag,
        root?.childElementCount ? element : undefined,
      );
      if (
        this.usageTag !== this.entry.tag ||
        JSON.stringify(this.usage) !== JSON.stringify(usage)
      ) {
        this.usage = usage;
        this.usageTag = this.entry.tag;
      }
    });
  }

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
    if (requested && requested !== locale())
      this.applyLocale(requested as Locale);
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
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;
    if (atBottom && sections.length > 0)
      current = sections[sections.length - 1].id;
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
    for (const picker of this.querySelectorAll<
      HTMLElement & { locale: string }
    >("bolle-date-picker, bolle-time-picker"))
      picker.locale = document.documentElement.lang;
  }

  private switchLocale = (next: Locale) => {
    if (next === this.language) return;
    this.applyLocale(next);
    const tag = this.route === "home" ? "" : this.route;
    history.replaceState(null, "", routeHref(tag));
  };

  private renderLocaleSelect(): TemplateResult {
    const current =
      LOCALES.find((item) => item.id === this.language) ?? LOCALES[0];
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
      return FOUNDATION_SECTIONS.map(([id, label]) => ({
        id,
        label: l(label),
      }));
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
      Success: "success",
      Warning: "warning",
      Surface: "surface-container",
      Outline: "outline",
      Inverse: "inverse-surface",
      Fixed: "primary-fixed",
      Utility: "scrim",
      Bolle: "accent",
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
      <a class="nav-back" href=${routeHref("overview")}
        >${l("Tutti i componenti →")}</a
      >`;
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
        .map((entry) => ({
          id: entry.tag,
          label: entry.navLabel ?? entry.title,
        }));

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
    this.codeTab = (event as CustomEvent<{ value: string }>).detail
      .value as CodeTab;
  };

  private onSideTab = (event: Event) => {
    // Parameter controls inside the panels emit bubbling change events too.
    if (event.target !== event.currentTarget) return;
    this.sideTab = (event as CustomEvent<{ value: string }>).detail
      .value as SideTab;
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
      // A chosen accent decides the readable ink on it straight away.
      colors: adaptText(
        { ...set.colors, [token]: value },
        token,
        this.activeTheme === "dark",
      ),
    }));
    const theme = this.activeTheme;
    if (!this.pins[theme][token]) return;
    // A fixed colour drives the rest of the scheme, so changing it regenerates.
    this.pins = {
      ...this.pins,
      [theme]: { ...this.pins[theme], [token]: value },
    };
    this.generateHct();
  }

  private readonly pinned = (token: string) =>
    Boolean(this.pins[this.activeTheme][token]);

  private readonly roleLabel = (token: string) =>
    COLOR_ROLES.find((role) => role.token === token)?.label ?? token;

  /** Pinning keeps the current colour of a role; unpinning returns it to the algorithm. */
  private togglePin(token: string, pinned: boolean) {
    const theme = this.activeTheme;
    const next = { ...this.pins[theme] };
    if (pinned) next[token] = this.tokenSet.colors[token];
    else delete next[token];
    this.pins = { ...this.pins, [theme]: next };
    if (pinned) this.generateHct();
  }

  private clearPins() {
    this.pins = { light: {}, dark: {} };
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
      pins: this.pins[this.activeTheme],
      previous: this.tokenSet.colors,
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
    this.download(
      "bolle-tokens.json",
      exportThemeJson(this.palettes, this.density),
      "application/json",
    );

  private exportCss = () =>
    this.download(
      "bolle-tokens.css",
      exportThemeCss(this.palettes),
      "text/css",
    );

  private applyImport(text: string) {
    try {
      const result = importTheme(text, this.palettes);
      this.previousColors = { ...this.tokenSet.colors };
      this.clearPins();
      this.palettes = result.palettes;
      if (result.density) this.density = result.density;
      applyTokens(this.tokenSet, this.density);
      this.importError = "";
      this.importText = "";
      this.notify(
        l("Token importati: {count} valori", { count: result.count }),
      );
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
    this.clearPins();
    this.presetId = id;
    this.palettes = {
      light: presetTokenSet("light", id),
      dark: presetTokenSet("dark", id),
    };
    applyTokens(this.tokenSet, this.density);
  };

  private resetTokens = () => {
    this.previousColors = { ...this.tokenSet.colors };
    this.clearPins();
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

  private renderControl(control: Control, state: State): TemplateResult {
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
        if (
          control.options.length <= 4 &&
          control.options.join("").length <= 22
        )
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
          (entry) =>
            html`<bolle-card
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
      </div>
      ${renderStateMatrix()}`;
  }

  private inspect = (event: Event) => {
    const host = (event.composedPath() as Element[]).find(
      (node) =>
        node instanceof HTMLElement && node.tagName.startsWith("BOLLE-"),
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
    this.inspected = {
      tag,
      usage: componentTokenUsage(tag, host),
      x: box.x,
      y: box.y,
    };
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
    const roles = COLOR_ROLES.filter((role) =>
      info.usage.colors.includes(role.token),
    );
    const x = Math.min(info.x + 16, window.innerWidth - 336);
    const y = Math.min(info.y + 16, window.innerHeight - 260);
    return html`<div
      class="token-inspector"
      role="status"
      style=${`left:${x}px;top:${y}px`}
    >
      <code class="token-inspector-tag">&lt;${info.tag}&gt;</code>
      ${
        roles.length
          ? html`<p class="token-inspector-head">${l("Colori")}</p>
              <ul class="token-inspector-colors">
                ${roles.map(
                  (role) =>
                    html`<li>
                      <span
                        class="token-inspector-swatch"
                        style=${`background:${colors[role.token]}`}
                      ></span
                      ><span>${role.label}</span>
                    </li>`,
                )}
              </ul>`
          : nothing
      }
      ${
        info.usage.shapes.length
          ? html`<p class="token-inspector-head">${l("Forma")}</p>
              <p class="token-inspector-list">
                ${info.usage.shapes
                  .map((shape) => `${shape} ${this.tokenSet.shapes[shape]}px`)
                  .join(" · ")}
              </p>`
          : nothing
      }
      ${
        info.usage.typography.length
          ? html`<p class="token-inspector-head">${l("Tipografia")}</p>
              <p class="token-inspector-list">
                ${info.usage.typography.join(" · ")}
              </p>`
          : nothing
      }
    </div>`;
  }

  private renderTokensPreview(): TemplateResult {
    return html`<div class="token-preview">
      <bolle-app-bar
        label=${l("Anteprima")}
        subtitle=${l("Token applicati")}
      ></bolle-app-bar>
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
      <bolle-progress-indicator
        label=${l("Avanzamento")}
        value="60"
      ></bolle-progress-indicator>
      <bolle-card variant="outlined" label=${l("Scheda di esempio")}>
        <h3>${l("Superficie")}</h3>
        <p>${l("Forma, colore e tipografia applicati a una scheda.")}</p>
      </bolle-card>
      ${this.renderStatusExample()}
    </div>`;
  }

  /**
   * Success, warning, error and the accent in use: one state block each, with the
   * container for the background and the plain role for the border and the icon, so a
   * token edit shows up here before it shows up in a component.
   */
  private renderStatusExample(): TemplateResult {
    const states = [
      {
        role: "success",
        icon: "check",
        title: l("Commessa salvata"),
        text: l("Le modifiche sono state registrate e condivise con il team."),
      },
      {
        role: "warning",
        icon: "alert-triangle",
        title: l("Scadenza vicina"),
        text: l("Restano due giorni per consegnare il collaudo."),
      },
      {
        role: "error",
        icon: "alert-circle",
        title: l("Sincronizzazione non riuscita"),
        text: l("La connessione è caduta: i dati restano in coda."),
      },
    ];
    return html`<div class="token-status" aria-label=${l("Stati")}>
      <p class="token-status-caption">${l("Stati")}</p>
      ${states.map(
        (state) =>
          html`<div class=${`status-note is-${state.role}`}>
            <span class="status-icon" aria-hidden="true"
              >${ti(state.icon)}</span
            >
            <div class="status-body">
              <strong>${state.title}</strong>
              <span>${state.text}</span>
            </div>
          </div>`,
      )}
      <div class="token-row">
        <bolle-button variant="accent">${l("Azione critica")}</bolle-button>
        <bolle-chip label=${l("In attesa")}></bolle-chip>
        <bolle-chip
          label=${l("Approvata")}
          variant="filter"
          selected
        ></bolle-chip>
      </div>
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
          l(
            "Ogni token ha il colore e il numero della sua quota nell'anteprima. La modifica vale per tutti gli esempi di {tag}.",
          ),
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
          class="quote ${quote.inside ? "is-inside" : ""} ${
            active && active !== quote.token ? "is-muted" : ""
          }"
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

  /**
   * WCAG checks for the pairs a generation, a custom colour or a pin is most likely to
   * break: text on every accent and semantic colour, and each of them on the surface.
   */
  private renderContrastChecks(colors: Record<string, string>): TemplateResult {
    const pins = this.pins[this.activeTheme];
    // Roles measured unconditionally: a pin on one of them must not repeat the row.
    const measured = ["primary", "error", "success", "warning", "accent"];
    const pairsOf = (role: string) => [
      {
        label: l("Testo su {role}", { role: this.roleLabel(role) }),
        ratio: contrastRatio(colors[`on-${role}`], colors[role]),
        min: 4.5,
      },
      {
        label: l("{role} su Surface", { role: this.roleLabel(role) }),
        ratio: contrastRatio(colors[role], colors.surface),
        min: 3,
      },
    ];
    const checks = [
      ...pairsOf("primary"),
      ...["error", "success", "warning", "accent"].flatMap(pairsOf),
      ...pinnedPairs(pins)
        .filter((pair) => !measured.includes(pair.base))
        .map((pair) => ({
          label: l("Testo su {role}", { role: this.roleLabel(pair.base) }),
          ratio: contrastRatio(colors[pair.on], colors[pair.base]),
          min: 4.5,
        })),
    ];
    return html`<ul
      class="contrast-checks"
      aria-label=${l("Verifica del contrasto")}
    >
      ${checks.map(
        (check) =>
          html`<li class=${check.ratio >= check.min ? "is-pass" : "is-fail"}>
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
              const label = (event as CustomEvent<{ value: string }>).detail
                .value;
              this.algorithm =
                COLOR_ALGORITHMS.find((item) => l(item.label) === label)?.id ??
                "tonal-spot";
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
              const label = (event as CustomEvent<{ value: string }>).detail
                .value;
              this.surfaces =
                SURFACE_MODES.find((item) => l(item.label) === label)?.id ??
                "white";
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
                  contrasts.indexOf(
                    (event as CustomEvent<{ value: string }>).detail.value,
                  ) / 2,
                ),
              )}
          ></docs-select>
        </div>
      </div>
      <p class="hct-hint">
        ${l(ALGORITHM_HINTS[colorAlgorithm(this.algorithm).id])}
      </p>
      <div class="generator-actions">
        <bolle-switch
          label=${l("Mantieni il primario esatto")}
          ?checked=${this.keepSeed}
          @change=${(event: Event) =>
            (this.keepSeed = (
              event as CustomEvent<{ checked: boolean }>
            ).detail.checked)}
        ></bolle-switch>
        <bolle-button @click=${this.generateHct}
          >${l("Genera da Primary")}</bolle-button
        >
      </div>
      <p class="hct-hint">
        ${
          this.dark
            ? l(
                "Il seme è il valore corrente di Primary; la generazione sostituisce tutti gli altri ruoli del tema scuro.",
              )
            : l(
                "Il seme è il valore corrente di Primary; la generazione sostituisce tutti gli altri ruoli del tema chiaro.",
              )
        }
        ${
          this.keepSeed
            ? l(
                "Primary resta il colore scelto; il testo sopra diventa il tono più leggibile.",
              )
            : l(
                "Come in Material 3, Primary diventa il tono 40 (chiaro) o 80 (scuro) della palette del seme.",
              )
        }
      </p>
      <p class="hct-hint">
        ${l(
          "I colori Bolle (Accent e On accent) non derivano dal seme: la generazione li lascia come sono e adatta solo il testo sopra l'accento. Film, ombre e scrollbar si ricalcolano da soli dal primario e dalla superficie.",
        )}
      </p>
      ${this.renderPins()} ${this.renderContrastChecks(this.tokenSet.colors)}
    </div>`;
  }

  /** Roles the reader fixed, each removable; the generator rebuilds their family around them. */
  private renderPins(): TemplateResult {
    const pins = this.pins[this.activeTheme];
    const entries = COLOR_ROLES.filter((role) => pins[role.token]);
    return html`<div class="pins">
      <div class="pins-head">
        <span class="config-label">${l("Colori fissati")}</span>
        ${
          entries.length
            ? html`<bolle-button
                variant="text"
                size="xs"
                @click=${this.clearPins}
                >${l("Sblocca tutti")}</bolle-button
              >`
            : null
        }
      </div>
      ${
        entries.length
          ? html`<ul class="pin-list">
              ${entries.map(
                (role) =>
                  html`<li class="pin-item">
                    <span
                      class="pin-swatch"
                      style=${`background:${pins[role.token]}`}
                      aria-hidden="true"
                    ></span>
                    <span class="pin-name">${l(role.label)}</span>
                    <code>${pins[role.token]}</code>
                    <bolle-icon-button
                      variant="standard"
                      label=${l("Sblocca {role}", { role: l(role.label) })}
                      @click=${() => this.togglePin(role.token, false)}
                      >${ti("x")}</bolle-icon-button
                    >
                  </li>`,
              )}
            </ul>`
          : html`<p class="hct-hint">
              ${l(
                "Nessun colore fissato: la generazione segue il seme. Apri un colore della tavolozza e attiva «Fissa questo colore» per imporlo e lasciare che il resto si adatti.",
              )}
            </p>`
      }
    </div>`;
  }

  private renderColorRoles(): TemplateResult {
    const set = this.tokenSet;
    const previous = this.previousColors;
    const changed = previous
      ? COLOR_ROLES.filter(
          (role) => previous[role.token] !== set.colors[role.token],
        )
      : [];
    return html`<div class="roles-summary" role="status">
        ${
          previous
            ? html`<span
                  >${withParts(
                    l(
                      "{changed} di {total} ruoli cambiati nell'ultima operazione: a sinistra il colore precedente.",
                    ),
                    {
                      changed: html`<strong>${changed.length}</strong>`,
                      total: COLOR_ROLES.length,
                    },
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
              >`
        }
      </div>
      ${COLOR_ROLE_GROUPS.map(
        (group) =>
          html`<div
            class="role-group"
            id=${`tk-${group.toLowerCase()}`}
            data-section
          >
            <h3>${group}</h3>
            <div class="role-grid">
              ${COLOR_ROLES.filter((role) => role.group === group).map(
                (role) => {
                  const value = set.colors[role.token];
                  const before = previous?.[role.token];
                  const isChanged = before !== undefined && before !== value;
                  const used =
                    this.inspected?.usage.colors.includes(role.token) ?? false;
                  const isPinned = this.pinned(role.token);
                  const tile = html`<docs-color
                    tile
                    pinnable
                    class="role-tile ${used ? "is-used" : ""}"
                    .label=${role.label}
                    .token=${roleVariable(role)}
                    .value=${value}
                    .previous=${isChanged ? (before ?? "") : ""}
                    ?pinned=${isPinned}
                    @change=${(event: Event) =>
                      this.setColor(
                        role.token,
                        (event as CustomEvent<{ value: string }>).detail.value,
                      )}
                    @pin=${(event: Event) =>
                      this.togglePin(
                        role.token,
                        (event as CustomEvent<{ pinned: boolean }>).detail
                          .pinned,
                      )}
                  ></docs-color>`;
                  // Compact tiles show only the value: name and token move into a tooltip.
                  return this.paletteDensity === "compact"
                    ? html`<bolle-tooltip
                        class="role-tip"
                        .label=${`${role.label} · ${roleVariable(role)}${isPinned ? l(" · fissato") : ""}${isChanged ? l(" · prima {color}", { color: before ?? "" }) : ""}`}
                        >${tile}</bolle-tooltip
                      >`
                    : tile;
                },
              )}
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
        (shape) =>
          html`<bolle-slider
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
              this.setShape(
                shape.token,
                Number((event as CustomEvent<{ value: string }>).detail.value),
              );
            }}
          ></bolle-slider>`,
      )}
      <h3 class="aside-group">${l("Densità")}</h3>
      ${this.renderDensitySelect()}
      <p class="hct-hint">
        ${withParts(
          l(
            "{compact} porta a tre quarti spaziature e dimensioni dei componenti; i token ridotti escono con l'esportazione e si attivano con {attr}.",
          ),
          {
            compact: html`<em>${l("Compatta")}</em>`,
            attr: html`<code>data-density="compact"</code>`,
          },
        )}
      </p>
      <h3 class="aside-group">${l("Tipografia")}</h3>
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
        compact
        suffix="px"
        label=${l("Dimensione base")}
        .min=${14}
        .max=${20}
        .step=${1}
        .value=${String(set.baseSize)}
        @value-input=${(event: Event) =>
          this.setBaseSize(
            Number((event as CustomEvent<{ value: string }>).detail.value),
          )}
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
          class="shape-tile ${
            this.activeShape === shape.token ||
            this.inspected?.usage.shapes.includes(shape.token)
              ? "is-active"
              : ""
          }"
        >
          <div class="shape-sample" style=${`border-radius:${radius}px`}>
            <span class="shape-radius">${radius}px</span>
          </div>
          <span class="shape-name">${shape.label}</span>
          <code class="shape-token">--md-sys-shape-corner-${shape.token}</code>
          <span class="shape-users" title=${users.join(", ")}
            >${
              users.length === 0
                ? l("Nessun componente: disponibile per il tuo CSS")
                : `${l("{n} componenti", { n: users.length })} · ${users.slice(0, 3).join(", ")}${users.length > 3 ? "…" : ""}`
            }</span
          >
        </div>`;
      })}
    </div>`;
  }

  private renderTypeSample(): TemplateResult {
    const set = this.tokenSet;
    return html`<div class="type-sample">
      <div>
        <span class="config-label"
          >${l("Titoli · {font}", { font: set.brandFont })}</span
        >
        <p class="type-sample-brand">
          ${l("Interfacce con tensione superficiale")}
        </p>
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

    return html`<section
      class="config-section token-usage"
      aria-label=${l("Token del componente")}
    >
      <div class="config-head">
        <h2>${l("Token del componente")}</h2>
        ${
          hasOverrides
            ? html`<bolle-button
                variant="text"
                size="xs"
                @click=${() => this.resetDetails(tag)}
                >${l("Reimposta dettaglio")}</bolle-button
              >`
            : nothing
        }
      </div>
      <div class="config-body tokens-config">
        <p class="usage-note">
          ${withParts(
            l(
              "Elenco dei token che il CSS di {tag} usa, con il valore dichiarato accanto a quello attivo. Ogni valore si scrive per intero (px o altra unità) e la modifica vale per tutti gli esempi del componente. Colori e forma restano token globali del tema attivo; i token dei componenti annidati appartengono al componente che li usa.",
            ),
            { tag: html`<code>&lt;${tag}&gt;</code>` },
          )}
        </p>

        ${
          usage.colors.length > 0
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
                          (event as CustomEvent<{ value: string }>).detail
                            .value,
                        )}
                    ></docs-color>
                  </div>`;
                })}`
            : nothing
        }
        ${
          usage.shapes.length > 0
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
                          (event as CustomEvent<{ value: string }>).detail
                            .value,
                        ),
                      )}
                  ></bolle-slider>`;
                })}`
            : nothing
        }
        ${
          otherTokens.length > 0
            ? html`<h4 class="config-subgroup">${l("Altri token")}</h4>
                <div class="measure-table">
                  ${otherTokens.map((token) => this.renderTokenRow(tag, token))}
                </div>`
            : nothing
        }
        ${
          hasTypography
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
            : nothing
        }
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
      class="measure-row ${overridden ? "is-overridden" : ""} ${
        this.hoverToken && this.hoverToken !== token ? "is-muted" : ""
      }"
      style=${color ? `--quote-color:${color}` : ""}
      @mouseenter=${() => (this.hoverToken = token)}
      @mouseleave=${() => (this.hoverToken = "")}
    >
      <code class="measure-name" title=${token}>
        ${
          number > 0
            ? html`<span class="measure-index" aria-hidden="true"
                >${number}</span
              >`
            : html`<span class="measure-swatch" aria-hidden="true"></span>`
        }${shortTokenName(token, tag)}
      </code>
      <span class="measure-meta"
        >${withParts(l("default {value}"), { value: html`<b>${fallback || l("non dichiarato")}</b>` })}</span
      >
      ${
        pixels !== null
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
                  this.commitPixels(
                    tag,
                    token,
                    event.target as HTMLInputElement,
                  )}
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
                this.setDetail(
                  tag,
                  token,
                  (event.target as HTMLInputElement).value,
                )}
            />`
      }
      <span class="measure-ruler" aria-hidden="true">
        <span
          class="measure-ruler-bar"
          style=${pixels !== null ? `inline-size:${Math.min(pixels, 96)}px` : ""}
        ></span>
        <span class="measure-ruler-value"
          >${pixels !== null ? `${value}` : value || "—"}</span
        >
      </span>
      ${
        overridden
          ? html`<bolle-button
              variant="text"
              size="xs"
              @click=${() => this.setDetail(tag, token, "")}
              >${l("Reset")}</bolle-button
            >`
          : nothing
      }
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
    this.setDetail(
      tag,
      token,
      `${Math.round(Math.max(0, number) * 100) / 100}px`,
    );
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
      surface: componentSurface(entry.tag),
      support: componentSupport(entry.tag),
      recipes: RECIPES[entry.tag] ?? [],
      dataContract: this.hasDataContract(entry.tag),
      sortsAndPages: this.hasSortPaging(entry.tag),
    });
    void this.copy(markdown, l("Pagina copiata in Markdown"));
  }

  private renderComponentPage(entry: Entry, state: State): TemplateResult {
    const code = this.codeFor(entry, state);
    const variants =
      entry.variants === false ? [] : this.variantControls(entry, state);
    const recipes = RECIPES[entry.tag] ?? [];
    const api = componentApi(entry.tag);
    const surface = componentSurface(entry.tag);
    const support = componentSupport(entry.tag);
    const index = orderedEntries.indexOf(entry);
    const previous = orderedEntries[index - 1];
    const next = orderedEntries[index + 1];
    const sections: DocSection[] = [
      { id: "sec-preview", label: l("Anteprima") },
      ...(variants.length > 0
        ? [{ id: "sec-variants", label: l("Varianti") }]
        : []),
      ...(recipes.length > 0
        ? [{ id: "sec-usage", label: l("Uso nel codice") }]
        : []),
      ...(this.hasDataContract(entry.tag)
        ? [{ id: "sec-updates", label: l("Aggiornamento dei dati") }]
        : []),
      ...(api.length > 0 ? [{ id: "sec-api", label: "API" }] : []),
      ...(surface.slots.length || surface.parts.length
        ? [{ id: "sec-anatomy", label: l("Anatomia pubblica") }]
        : []),
      ...(support
        ? [{ id: "sec-support", label: l("Supporto e limiti") }]
        : []),
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
                label=${
                  previous
                    ? l("Precedente: {name}", { name: previous.title })
                    : l("Nessun componente precedente")
                }
                ?disabled=${!previous}
                @click=${() => previous && this.navigate(previous.tag)}
                >${ti("arrow-left")}</bolle-icon-button
              >
              <bolle-icon-button
                variant="standard"
                label=${
                  next
                    ? l("Successivo: {name}", { name: next.title })
                    : l("Nessun componente successivo")
                }
                ?disabled=${!next}
                @click=${() => next && this.navigate(next.tag)}
                >${ti("arrow-right")}</bolle-icon-button
              >
            </div>
          </div>
          <div class="doc-meta">
            <code class="tag">&lt;${entry.tag}&gt;</code>
            <span class="meta-chip"
              >${l("{n} proprietà", { n: api.length })}</span
            >
            <span class="meta-chip"
              >${code.tabs.map((tab) => tab.toUpperCase()).join(" · ")}</span
            >
          </div>
          <p class="lead">${l(entry.summary)}</p>
          ${entry.note ? html`<p class="note">${l(entry.note)}</p>` : nothing}
        </header>

        ${this.renderPlayground(entry, state, code)}
        ${variants.length > 0 ? this.renderVariants(entry, state, variants) : nothing}
        ${recipes.length > 0 ? this.renderRecipes(recipes) : nothing}
        ${this.hasDataContract(entry.tag) ? this.renderDataContract(entry.tag) : nothing}
        ${
          recipes.length > 0
            ? html`<recipe-playground
                id="recipe-playground"
              ></recipe-playground>`
            : nothing
        }
        ${api.length > 0 ? this.renderApi(api) : nothing}
        ${
          surface.slots.length || surface.parts.length
            ? this.renderAnatomy(
                entry.tag,
                surface.slots,
                surface.parts,
                ANATOMY_GUIDES[entry.tag],
              )
            : nothing
        }
        ${support ? this.renderSupport(support) : nothing}
        ${this.renderAccessibility(entry)}

        <nav class="pager" aria-label=${l("Altri componenti")}>
          ${
            previous
              ? html`<bolle-card
                  class="pager-card"
                  variant="elevated"
                  tail="top-end"
                  href=${routeHref(previous.tag)}
                  label=${l("Precedente: {name}", { name: previous.title })}
                >
                  <span class="pager-dir"
                    >${ti("arrow-left")} ${l("Precedente")}</span
                  >
                  <span class="pager-title">${previous.title}</span>
                </bolle-card>`
              : html`<span></span>`
          }
          ${
            next
              ? html`<bolle-card
                  class="pager-card is-next"
                  variant="elevated"
                  tail="top-start"
                  href=${routeHref(next.tag)}
                  label=${l("Successivo: {name}", { name: next.title })}
                >
                  <span class="pager-dir"
                    >${l("Successivo")} ${ti("arrow-right")}</span
                  >
                  <span class="pager-title">${next.title}</span>
                </bolle-card>`
              : nothing
          }
        </nav>
      </article>

      <aside class="doc-toc" aria-label=${l("In questa pagina")}>
        <p class="toc-title">${l("In questa pagina")}</p>
        <ul>
          ${sections.map(
            (section) =>
              html`<li>
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
          <bolle-button
            variant="text"
            size="xs"
            @click=${() => this.copyPage(entry, code)}
            ><span slot="icon" aria-hidden="true">${ti("markdown")}</span
            >${l("Copia pagina")}</bolle-button
          >
          <bolle-button variant="text" size="xs" @click=${this.openConfig}
            ><span slot="icon" aria-hidden="true">${ti("palette")}</span
            >${l("Tema e token")}</bolle-button
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
    const labels: Record<CodeTab, string> = {
      html: "HTML",
      vue: "Vue",
      react: "React",
    };
    const params = html`<div class="side-body" slot="params">
      ${entry.controls.map((control) => this.renderControl(control, state))}
      <bolle-button variant="text" size="xs" @click=${() => this.reset(entry)}
        ><span slot="icon" aria-hidden="true">${ti("refresh")}</span
        >${l("Reimposta parametri")}</bolle-button
      >
    </div>`;
    return html`<section
      id="sec-preview"
      class="doc-section"
      aria-labelledby="h-preview"
    >
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
            ${
              hasSizes
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
                      ${
                        this.details[entry.tag]
                          ? html`<bolle-button
                              variant="text"
                              size="xs"
                              @click=${() => this.resetDetails(entry.tag)}
                              ><span slot="icon" aria-hidden="true"
                                >${ti("refresh")}</span
                              >${l("Reimposta misure")}</bolle-button
                            >`
                          : nothing
                      }
                    </div>
                  </bolle-tabs>`
                : html`<h3 class="side-title">${l("Parametri")}</h3>
                    ${params}`
            }
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
              (tab, index) =>
                html`<div class="code-panel-body" slot=${tab}>
                  <pre
                    class="code-block"
                    data-tail=${this.codeTail(index, code.tabs.length)}
                  ><code>${tab === code.tab ? code.text : ""}</code></pre>
                  ${
                    tab === code.tab
                      ? html`<bolle-button
                          class="code-copy"
                          variant="text"
                          size="xs"
                          @click=${() => this.copy(code.text)}
                          ><span slot="icon" aria-hidden="true"
                            >${ti("copy")}</span
                          >${l("Copia")}</bolle-button
                        >`
                      : nothing
                  }
                </div>`,
            )}
          </bolle-tabs>
        </div>
      </div>
    </section>`;
  }

  private renderRecipes(recipes: Recipe[]): TemplateResult {
    return html`<section
      id="sec-usage"
      class="doc-section"
      aria-labelledby="h-usage"
    >
      <h2 id="h-usage" tabindex="-1">${l("Uso nel codice")}</h2>
      <p class="section-lead">
        ${l(
          "Il componente chiama le funzioni che gli passi: column.render per ogni cella, detail per la riga aperta, groupSummary per gruppo. Gli slot servono solo alle aree esterne, come intestazione, stati e piè di pagina.",
        )}
      </p>
      <div class="recipe-switch">
        <bolle-segmented-buttons
          label=${l("Linguaggio degli esempi")}
          .items=${RECIPE_LANGS}
          .value=${this.recipeLang}
          @change=${(event: Event) => {
            if (event.target !== event.currentTarget) return;
            this.recipeLang = (event as CustomEvent<{ value: string }>).detail
              .value as RecipeLang;
          }}
        ></bolle-segmented-buttons>
      </div>
      <div class="recipes">
        ${recipes.map((recipe) => {
          const code = recipe.code[this.recipeLang] ?? recipe.code.html;
          const example =
            this.recipeLang === "html"
              ? PLAYGROUND_EXAMPLES[recipe.title]
              : undefined;
          return html`<article class="recipe">
            <h3>${l(recipe.title)}</h3>
            <p>${l(recipe.description)}</p>
            <div class="recipe-code">
              <div class="recipe-bar">
                <span class="recipe-lang"
                  >${
                    RECIPE_LANGS.find((item) => item.id === this.recipeLang)
                      ?.label
                  }</span
                >
                <span class="recipe-bar-actions">
                  ${
                    example
                      ? html`<bolle-button
                          variant="text"
                          size="xs"
                          @click=${() =>
                            this.querySelector<RecipePlayground>(
                              "#recipe-playground",
                            )?.show(example)}
                          >${l("Apri nel playground")}</bolle-button
                        >`
                      : nothing
                  }
                  <bolle-button
                    variant="text"
                    size="xs"
                    @click=${() => this.copy(code)}
                    ><span slot="icon" aria-hidden="true">${ti("copy")}</span
                    >${l("Copia")}</bolle-button
                  >
                </span>
              </div>
              <pre class="code-block"><code>${code}</code></pre>
            </div>
          </article>`;
        })}
      </div>
    </section>`;
  }

  /** Components that take an array and expose refresh() declare this contract. */
  private hasDataContract(tag: string): boolean {
    const ctor = customElements.get(tag) as
      (CustomElementConstructor & { prototype: object }) | undefined;
    return Boolean(ctor && "refresh" in ctor.prototype);
  }

  /** Components that sort and page their own rows through the two handlers. */
  private hasSortPaging(tag: string): boolean {
    const ctor = customElements.get(tag) as
      | (CustomElementConstructor & { properties?: Record<string, unknown> })
      | undefined;
    const properties = ctor?.properties;
    return Boolean(
      properties && "sortHandler" in properties && "pageHandler" in properties,
    );
  }

  private renderSortPaging(): TemplateResult {
    return html`<h3>${l("Ordinamento e paginazione")}</h3>
      <p class="section-lead">
        ${l(
          "La tabella ordina e pagina le righe che riceve: un clic sull'intestazione va prima crescente e poi decrescente, e page-size da solo accende il pager. Selezione, apertura riga, raggruppamento e cambi di colonna li applica lei, e gli eventi li riportano. sortHandler, pageHandler e columnHandler servono solo quando i dati stanno altrove: ricevono la richiesta e la tabella ridisegna quando la promessa è risolta.",
        )}
      </p>
      <div class="table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th scope="col">${l("Operazione")}</th>
              <th scope="col">${l("Risultato")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <code>table.rows = tutteLeRighe</code>
              </th>
              <td>
                ${l(
                  "Ordina e pagina da sola: l'applicazione non taglia né riordina nulla.",
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">
                <code>table.sortHandler = (richiesta) =&gt; …</code>
              </th>
              <td>
                ${l(
                  "Riceve l'ordine richiesto e la tabella ridisegna dopo la promessa.",
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">
                <code>table.pageHandler = (richiesta) =&gt; …</code>
              </th>
              <td>
                ${l(
                  "Riceve pagina e dimensione e la tabella ridisegna dopo la promessa.",
                )}
              </td>
            </tr>
            <tr>
              <th scope="row"><code>table.sort = [{ key, dir }]</code></th>
              <td>${l("Fissa l'ordine iniziale, con l'icona già accesa.")}</td>
            </tr>
            <tr>
              <th scope="row"><code>table.selected = [id]</code></th>
              <td>
                ${l(
                  "La tabella applica selezione, apertura riga, raggruppamento e cambi di colonna da sé: gli eventi li riportano soltanto.",
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">
                <code>table.columnHandler = (elenco) =&gt; …</code>
              </th>
              <td>
                ${l(
                  "Riceve l'elenco delle colonne dopo ogni modifica, per conservarlo altrove.",
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>`;
  }

  private renderDataContract(tag: string): TemplateResult {
    return html`<section
      id="sec-updates"
      class="doc-section"
      aria-labelledby="h-updates"
    >
      <h2 id="h-updates" tabindex="-1">${l("Aggiornamento dei dati")}</h2>
      <p class="section-lead">
        ${l(
          "Il componente ridisegna quando riceve una nuova proprietà. Non osserva le mutazioni interne all'array: un valore riassegnato con lo stesso riferimento non produce aggiornamenti. La tabella riporta i casi misurati.",
        )}
      </p>
      <div class="table-wrap">
        <table class="api-table">
          <thead>
            <tr>
              <th scope="col">${l("Operazione")}</th>
              <th scope="col">${l("Risultato")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><code>table.rows = altroArray</code></th>
              <td>${l("Ridisegna: il riferimento è nuovo.")}</td>
            </tr>
            <tr>
              <th scope="row">
                <code>rows.sort(); table.rows = rows</code>
              </th>
              <td>
                ${l(
                  "Non ridisegna: l'array è lo stesso oggetto e il confronto è per riferimento.",
                )}
              </td>
            </tr>
            <tr>
              <th scope="row"><code>rows.sort(); table.refresh()</code></th>
              <td>${l("Ridisegna con i dati mutati.")}</td>
            </tr>
            <tr>
              <th scope="row">
                <code>computed(() => rows.toSorted(…))</code>
              </th>
              <td>
                ${l(
                  "Vue assegna una nuova proprietà a ogni cambio, quindi ridisegna.",
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">
                <code>useMemo(() => rows.toSorted(…))</code>
              </th>
              <td>
                ${l(
                  "React assegna una nuova proprietà a ogni cambio, quindi ridisegna.",
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="anatomy-grid">
        <div>
          <h3>${l("JavaScript, mutazione sul posto")}</h3>
          <pre
            class="code-block"
          ><code>rows.sort((a, b) => a.code.localeCompare(b.code));
table.refresh();</code></pre>
        </div>
        <div>
          <h3>${l("Vue, stato derivato")}</h3>
          <pre
            class="code-block"
          ><code>const sorted = computed(() => sort.value.length ? rows.toSorted(compare) : rows);</code></pre>
        </div>
      </div>
      <p class="anatomy-intro">
        ${l(
          "La proprietà è un array dell'applicazione: il componente lo legge e non lo modifica. Il riferimento resta l'unico segnale di cambiamento, tranne la chiamata esplicita a refresh().",
        )}
      </p>
      ${this.hasSortPaging(tag) ? this.renderSortPaging() : nothing}
    </section>`;
  }

  private renderVariants(
    entry: Entry,
    state: State,
    controls: Extract<Control, { kind: "enum" }>[],
  ): TemplateResult {
    return html`<section
      id="sec-variants"
      class="doc-section"
      aria-labelledby="h-variants"
    >
      <h2 id="h-variants" tabindex="-1">${l("Varianti")}</h2>
      <p class="section-lead">
        ${l("Ogni riga cambia un solo attributo; gli altri restano quelli dell'anteprima.")}
      </p>
      ${controls.map(
        (control) =>
          html`<div class="variant-group">
            <h3>${l(control.label)} <code>${kebab(control.prop)}</code></h3>
            <div
              class="variant-grid ${WIDE_GROUPS.has(entry.group) ? "is-wide" : ""} ${PANEL_GROUPS.has(entry.group) ? "is-panel" : ""}"
            >
              ${control.options.map(
                (option) =>
                  html`<figure class="variant-cell">
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
    return html`<section
      id="sec-api"
      class="doc-section"
      aria-labelledby="h-api"
    >
      <h2 id="h-api" tabindex="-1">API</h2>
      <p class="section-lead">
        ${withParts(
          l(
            "Proprietà pubbliche lette dalla classe registrata. Array e oggetti si assegnano come proprietà JavaScript; gli attributi booleani valgono per presenza, quindi {example} resta disabilitato.",
          ),
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
              (row) =>
                html`<tr>
                  <th scope="row"><code>${row.name}</code></th>
                  <td>
                    ${row.attribute ? html`<code>${row.attribute}</code>` : html`<span class="muted">${l("solo JS")}</span>`}
                  </td>
                  <td><span class="type">${row.type}</span></td>
                  <td><code>${row.defaultValue}</code></td>
                  <td>
                    ${row.reflects ? l("sì") : html`<span class="muted">${l("no")}</span>`}
                  </td>
                </tr>`,
            )}
          </tbody>
        </table>
      </div>
    </section>`;
  }

  private renderAnatomy(
    tag: string,
    slots: string[],
    parts: string[],
    guide?: AnatomyGuide,
  ): TemplateResult {
    const slotGuide = new Map(
      (guide?.slots ?? []).map((item) => [item.name, item]),
    );
    const partGuide = new Map(
      (guide?.parts ?? []).map((item) => [item.name, item]),
    );
    // The detected names lead; a name only the guide knows stays visible after them.
    const publicSlots = [
      ...slots,
      ...(guide?.slots ?? [])
        .map((item) => item.name)
        .filter((name) => !slots.includes(name)),
    ];
    const publicParts = [
      ...parts,
      ...(guide?.parts ?? [])
        .map((item) => item.name)
        .filter((name) => !parts.includes(name)),
    ];
    const examplePart =
      publicParts.find((part) => partGuide.has(part)) ?? publicParts[0];
    return html`<section
      id="sec-anatomy"
      class="doc-section"
      aria-labelledby="h-anatomy"
    >
      <h2 id="h-anatomy" tabindex="-1">${l("Anatomia pubblica")}</h2>
      <p class="section-lead">
        ${l(
          "Slot e CSS part sono un contratto di composizione. Le parti interne senza elenco restano private al componente.",
        )}
      </p>
      ${guide ? html`<p class="anatomy-intro">${l(guide.intro)}</p>` : nothing}
      <div class="anatomy-grid">
        ${
          publicSlots.length
            ? html`<div class="anatomy-column">
                <h3>${l("Slot")}</h3>
                <div class="anatomy-items">
                  ${publicSlots.map((slot) => {
                    const item = slotGuide.get(slot) ?? SLOT_PURPOSES[slot];
                    const resolved = slot
                      .replace("{rowId}", "job-1")
                      .replace("{columnKey}", "code")
                      .replace("{groupName}", "Bergamo")
                      .replace("{lane}", "todo")
                      .replace("{cardId}", "card-1")
                      .replace("{itemId}", "item-1")
                      .replace("{id}", "item-1");
                    return html`<article class="anatomy-item">
                      <code class="anatomy-name">${slot}</code>
                      ${
                        item
                          ? html`<p>${l(item.purpose)}</p>`
                          : html`<p>
                              ${l(
                                "Slot pubblico da usare per il contenuto indicato dal nome.",
                              )}
                            </p>`
                      }
                      <pre
                        class="code-inline"
                      ><code>${item?.example ?? `<span slot="${resolved}">Contenuto</span>`}</code></pre>
                    </article>`;
                  })}
                </div>
                ${
                  guide
                    ? nothing
                    : html`<pre class="code-block"><code>${
                        publicSlots[0] === "default"
                          ? `<${tag}>Contenuto</${tag}>`
                          : `<${tag}>\n  <span slot="${publicSlots[0].replace("{id}", "item-1")}">Contenuto</span>\n</${tag}>`
                      }</code></pre>`
                }
              </div>`
            : nothing
        }
        ${
          publicParts.length
            ? html`<div class="anatomy-column">
                <h3>${l("CSS part")}</h3>
                <div class="anatomy-items">
                  ${publicParts.map(
                    (part) =>
                      html`<article class="anatomy-item">
                        <code class="anatomy-name">${part}</code>
                        ${
                          partGuide.has(part)
                            ? html`<p>${l(partGuide.get(part)!.purpose)}</p>`
                            : PART_PURPOSES[part]
                              ? html`<p>${l(PART_PURPOSES[part].purpose)}</p>`
                              : html`<p>
                                  ${l(
                                    "Parte pubblica dello stile del componente.",
                                  )}
                                </p>`
                        }
                      </article>`,
                  )}
                </div>
                <pre class="code-block"><code>${tag}::part(${examplePart}) {
  /* Sovrascrittura pubblica */
}</code></pre>
              </div>`
            : nothing
        }
      </div>
      ${
        guide?.example
          ? html`<div class="anatomy-example">
              <h3>${l("Esempio completo")}</h3>
              <pre class="code-block"><code>${guide.example}</code></pre>
            </div>`
          : nothing
      }
    </section>`;
  }

  private renderInline(text: string): TemplateResult[] {
    return text
      .split("`")
      .map((part, index) =>
        index % 2 === 1 ? html`<code>${part}</code>` : html`${part}`,
      );
  }

  private renderSupport(support: SupportInfo): TemplateResult {
    return html`<section
      id="sec-support"
      class="doc-section"
      aria-labelledby="h-support"
    >
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
    return html`<section
      id="sec-a11y"
      class="doc-section"
      aria-labelledby="h-a11y"
    >
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
        ${
          shortcut
            ? html`<div>
                <dt>${l("Scorciatoia da tastiera")}</dt>
                <dd>
                  ${withParts(
                    l(
                      "L'attributo {attribute} usa la sintassi di {syntax}. Se il componente contiene un controllo focalizzabile, la combinazione lo mette a fuoco; bottoni e link vengono anche attivati.",
                    ),
                    {
                      attribute: html`<code>shortcut</code>`,
                      syntax: html`<code>aria-keyshortcuts</code>`,
                    },
                  )}
                  <pre
                    class="code-inline"
                  ><code>&lt;${entry.tag} shortcut="Alt+S"&gt;&lt;/${entry.tag}&gt;</code></pre>
                </dd>
              </div>`
            : nothing
        }
        <div>
          <dt>${l("Direzione del testo")}</dt>
          <dd>
            ${withParts(
              l(
                "Verifica la resa da destra a sinistra con il pulsante {rtl} nella barra in alto.",
              ),
              {
                rtl: html`<strong>RTL</strong>`,
              },
            )}
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

        <section
          class="panel tokens-colors"
          aria-labelledby="tokens-colors-title"
        >
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
                  (this.paletteDensity = (
                    event as CustomEvent<{ value: string }>
                  ).detail.value as "compact" | "medium" | "full")}
              ></bolle-segmented-buttons>
              <bolle-button variant="text" @click=${this.resetTokens}
                >${l("Reimposta tema")}</bolle-button
              >
            </div>
          </div>
          <div
            class=${`palette palette-${this.paletteDensity} ${this.inspected ? "is-inspecting" : ""}`}
          >
            ${this.renderColorRoles()}
          </div>
        </section>

        <section
          class="panel"
          id="tk-preview"
          data-section
          aria-labelledby="tokens-preview-title"
        >
          <div class="section-head">
            <h2 id="tokens-preview-title">${l("Anteprima")}</h2>
            <span class="hint"
              >${l("Passa sopra un componente per vedere i token che usa")}</span
            >
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

        <section
          class="panel"
          id="tk-shape"
          data-section
          aria-labelledby="tokens-shape-title"
        >
          <div class="section-head">
            <h2 id="tokens-shape-title">${l("Scala delle forme")}</h2>
            <span class="hint"
              >${l("Raggio degli angoli e componenti che lo usano")}</span
            >
          </div>
          ${this.renderShapeScale()}
        </section>

        <section
          class="panel"
          id="tk-type"
          data-section
          aria-labelledby="tokens-type-title"
        >
          <div class="section-head">
            <h2 id="tokens-type-title">${l("Tipografia")}</h2>
          </div>
          ${this.renderTypeSample()}
        </section>

        <section
          class="panel code-panel"
          id="tk-css"
          data-section
          aria-labelledby="tokens-io-title"
        >
          <div class="section-head">
            <h2 id="tokens-io-title">${l("Esporta e importa")}</h2>
          </div>
          <p class="section-lead">
            ${withParts(
              l(
                "Il JSON contiene tema chiaro e scuro, forme, tipografia e densità, compresi i token delle dimensioni ridotti per la densità compatta, e si reimporta qui. Il CSS è pronto per il tuo foglio di stile: tema chiaro su {light}, colori scuri su {dark}, dimensioni compatte su {density}.",
              ),
              {
                light: html`<code>:root</code>`,
                dark: html`<code>:root[data-theme="dark"]</code>`,
                density: html`<code>:root[data-density="compact"]</code>`,
              },
            )}
          </p>
          <div class="io-grid">
            <div class="io-card">
              <h3>${l("Esporta")}</h3>
              <div class="io-actions">
                <bolle-button @click=${this.exportJson}
                  ><span slot="icon" aria-hidden="true"
                    >${ti("arrow-down")}</span
                  >${l("Scarica JSON")}</bolle-button
                >
                <bolle-button variant="tonal" @click=${this.exportCss}
                  ><span slot="icon" aria-hidden="true"
                    >${ti("arrow-down")}</span
                  >${l("Scarica CSS")}</bolle-button
                >
                <bolle-button
                  variant="text"
                  @click=${() => this.copy(exportThemeCss(this.palettes))}
                  ><span slot="icon" aria-hidden="true">${ti("copy")}</span
                  >${l("Copia CSS")}</bolle-button
                >
              </div>
              <details class="io-preview">
                <summary>${l("Anteprima del CSS")}</summary>
                <pre
                  class="code-block"
                ><code>${exportThemeCss(this.palettes)}</code></pre>
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
                  ><span slot="icon" aria-hidden="true">${ti("arrow-up")}</span
                  >${l("Scegli file")}</bolle-button
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
                  this.importText = (
                    event as CustomEvent<{ value: string }>
                  ).detail.value;
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
            // Controls inside the panels emit bubbling change events too.
            if (event.target !== event.currentTarget) return;
            this.asideTab = (event as CustomEvent<{ value: string }>).detail
              .value as "colors" | "shape";
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
      <span class="bb-logo"
        >${bolleMark(20)}<span>
          ${withParts(
            l("{name} · ispirata a Material 3, non affiliata a Google."),
            {
              name: html`<strong class="site-footer-name">bolle</strong>`,
            },
          )}</span
        ></span
      >
      <a
        class="md-text-link"
        href="https://materialui.co/colors"
        target="_blank"
        rel="noopener noreferrer"
        >${l("Palette Material")}</a
      >
      <a
        class="md-text-link"
        href="https://tabler.io/icons"
        target="_blank"
        rel="noopener noreferrer"
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
      ><span slot="leading" aria-hidden="true"
        >${ti("search")}</span
      ></bolle-text-field
    >`;
    const navList = (navigate: (event: Event) => void) =>
      this.renderSideNav(navigate);

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
          <a
            href=${routeHref()}
            class="landing-brand"
            aria-label=${l("bolle, presentazione")}
            >${bolleLogo(30)}</a
          >
          <nav class="landing-nav site-nav" aria-label=${l("Principale")}>
            <a
              href=${routeHref("overview")}
              aria-current=${!isTokens && !this.isFoundations ? "page" : nothing}
              >${l("Componenti")}</a
            >
            <a
              href=${routeHref("foundations")}
              aria-current=${this.isFoundations ? "page" : nothing}
              >Foundations</a
            >
            <a
              href=${routeHref("tokens")}
              aria-current=${isTokens ? "page" : nothing}
              >${l("Token")}</a
            >
          </nav>
          <span class="topbar-actions">
            ${this.renderLocaleSelect()}
            ${
              !isTokens && !this.isPage
                ? html`<bolle-icon-button
                    variant="standard"
                    label=${l("Tema e token")}
                    @click=${this.openConfig}
                    >${ti("palette")}</bolle-icon-button
                  >`
                : nothing
            }
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
          ${this.pageSections() ? nothing : navFilter}
          ${navList(this.onNavigate)}
        </aside>

        <main class="content">
          ${
            isTokens
              ? this.renderTokensMain(css)
              : this.isFoundations
                ? renderFoundations()
                : this.isOverview
                  ? this.renderOverview()
                  : this.renderComponentPage(entry, state)
          }
        </main>
      </div>

      ${
        !isTokens && !this.isPage
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
          : nothing
      }
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
