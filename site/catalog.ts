import { html, nothing, type TemplateResult } from "lit";
import { ti } from "../demo/icons.js";
import type {
  BolleItem,
  CardTail,
  MenuEntry,
  SidebarItem,
} from "../src/index.js";
import type { AttrSpec, SnippetSpec } from "./codegen.js";
import "./data-table-demo.js";
import "./app-shell-demo.js";
import "./kanban-demo.js";
import "./pagination-demo.js";
import { code } from "./codegen.js";
import { l, libraryLocale, m } from "./i18n.js";

export type Group =
  | "App bars"
  | "Avatars"
  | "Badges"
  | "Buttons"
  | "Cards"
  | "Carousel"
  | "Checkbox"
  | "Chips"
  | "App shell"
  | "Dashboard"
  | "Data table"
  | "Date & time pickers"
  | "Dialogs"
  | "Divider"
  | "Empty states"
  | "HTML controls"
  | "Kanban"
  | "Lists"
  | "Loading indicator"
  | "Menus"
  | "Navigation bar"
  | "Navigation drawer"
  | "Navigation rail"
  | "Pagination"
  | "Progress indicators"
  | "Radio button"
  | "Search"
  | "Sheets"
  | "Sidebar"
  | "Sliders"
  | "Snackbar"
  | "Switch"
  | "Tabs"
  | "Text fields"
  | "Toolbars"
  | "Tooltips";

export type State = Record<string, unknown>;

export interface PreviewContext {
  show(id: string, event: Event): void;
  close(id: string, value?: string): void;
  snackbar(id: string, message?: string): void;
}

interface ControlBase {
  prop: string;
  label: string;
}
export type Control =
  | (ControlBase & {
      kind: "enum";
      options: string[];
      default: string;
    })
  | (ControlBase & { kind: "bool"; default: boolean })
  | (ControlBase & {
      kind: "range";
      min: number;
      max: number;
      step?: number;
      default: number;
    })
  | (ControlBase & { kind: "text"; default: string; placeholder?: string })
  | (ControlBase & { kind: "longtext"; default: string; rows?: number });

export interface Entry {
  tag: string;
  title: string;
  /** Label used inside a multi-component family in the navigation. */
  navLabel?: string;
  group: Group;
  /** Advanced components for admin applications, listed apart from the Material families. */
  section?: "Schiuma";
  summary: string;
  note?: string;
  controls: Control[];
  render: (state: State, ctx: PreviewContext) => TemplateResult;
  code: (state: State) => SnippetSpec;
}

const en = (
  prop: string,
  label: string,
  options: string[],
  fallback: string,
): Control => ({ kind: "enum", prop, label, options, default: fallback });
const fl = (prop: string, label: string, fallback: boolean): Control => ({
  kind: "bool",
  prop,
  label,
  default: fallback,
});
const rg = (
  prop: string,
  label: string,
  min: number,
  max: number,
  fallback: number,
  step = 1,
): Control => ({ kind: "range", prop, label, min, max, step, default: fallback });
const tx = (
  prop: string,
  label: string,
  fallback: string,
  placeholder?: string,
): Control => ({ kind: "text", prop, label, default: fallback, placeholder });
const lt = (
  prop: string,
  label: string,
  fallback: string,
  rows = 3,
): Control => ({ kind: "longtext", prop, label, default: fallback, rows });

const s = (state: State, prop: string) => String(state[prop] ?? "");
const b = (state: State, prop: string) => Boolean(state[prop]);
const n = (state: State, prop: string) => Number(state[prop] ?? 0);
const a = (name: string, value: unknown): AttrSpec => ({
  name,
  value: value as string | number | boolean,
});

/**
 * A drawn portrait as a data URI: the avatar preview needs a real image without
 * a network request, so the page stays offline-safe.
 */
const portrait =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#d6c8f0"/><circle cx="48" cy="38" r="17" fill="#6b53a8"/><path d="M14 96c0-19 15-30 34-30s34 11 34 30z" fill="#6b53a8"/></svg>`,
  );

const ICON_ITEMS = [
  { id: "inbox", label: m("Posta"), icon: "inbox" },
  { id: "archive", label: m("Archivio"), icon: "archive" },
  { id: "settings", label: m("Impostazioni"), icon: "settings" },
];
const sixItems = [
  ...ICON_ITEMS,
  { id: "trash", label: m("Cestino"), icon: "trash" },
  { id: "help", label: m("Aiuto"), icon: "help" },
];
/** ICON_ITEMS with labels in the current language, as shown in code snippets. */
const iconCode = () => ICON_ITEMS.map((item) => ({ ...item, label: l(item.label) }));
const navItems = (source = ICON_ITEMS): BolleItem[] =>
  source.map((item) => ({ ...item, label: l(item.label), icon: ti(item.icon) }));

const LIST_CODE = [
  {
    id: "inbox",
    label: m("Posta"),
    icon: "inbox",
    supportingText: m("Messaggi ricevuti"),
    badge: "3",
  },
  { id: "archive", label: m("Archivio"), icon: "archive", href: "/archivio" },
  {
    id: "folders",
    label: m("Cartelle"),
    icon: "folder",
    items: [
      { id: "work", label: m("Lavoro"), badge: "12" },
      { id: "home", label: m("Casa") },
    ],
  },
  { id: "trash", label: m("Cestino"), icon: "trash", disabled: true },
];
/** LIST_CODE with labels in the current language, as shown in code snippets. */
const listCode = () =>
  LIST_CODE.map((item) => ({
    ...item,
    label: l(item.label),
    ...(item.supportingText ? { supportingText: l(item.supportingText) } : {}),
    ...(item.items
      ? { items: item.items.map((child) => ({ ...child, label: l(child.label) })) }
      : {}),
  }));
const listItems = (): BolleItem[] =>
  listCode().map((item) => ({
    ...item,
    icon: item.icon ? ti(item.icon) : undefined,
    items: item.items ? item.items.map((child) => ({ ...child })) : undefined,
  }));

interface SidebarCode {
  id: string;
  label: string;
  icon?: string;
  count?: number;
  children?: SidebarCode[];
}

/** Navigation of a works management application, three levels deep. */
const SIDEBAR_CODE: SidebarCode[] = [
  { id: "dashboard", label: m("Cruscotto"), icon: "layout-dashboard" },
  {
    id: "jobs",
    label: m("Commesse"),
    icon: "briefcase",
    count: 12,
    children: [
      {
        id: "active",
        label: m("Attive"),
        count: 8,
        children: [
          { id: "sites", label: m("Cantieri edili"), count: 3 },
          { id: "plants", label: m("Impianti elettrici e termici"), count: 4 },
          { id: "extra", label: m("Manutenzione straordinaria"), count: 1 },
        ],
      },
      { id: "waiting", label: m("In attesa di avvio"), count: 4 },
      { id: "closed", label: m("Chiuse") },
    ],
  },
  {
    id: "warehouse",
    label: m("Magazzino"),
    icon: "package",
    children: [
      { id: "articles", label: m("Articoli") },
      { id: "movements", label: m("Movimenti di carico e scarico") },
      { id: "inventory", label: m("Inventario") },
    ],
  },
  {
    id: "maintenance",
    label: m("Manutenzioni"),
    icon: "tool",
    count: 5,
    children: [
      { id: "planned", label: m("Programmate"), count: 5 },
      { id: "history", label: m("Storico interventi") },
    ],
  },
  {
    id: "admin",
    label: m("Amministrazione"),
    icon: "file-invoice",
    children: [
      { id: "invoices", label: m("Fatture") },
      { id: "payments", label: m("Scadenzario pagamenti") },
    ],
  },
  { id: "registry", label: m("Anagrafiche"), icon: "users" },
];
/** SIDEBAR_CODE with labels in the current language, as shown in code snippets. */
const sidebarCode = (items = SIDEBAR_CODE): SidebarCode[] =>
  items.map((item) => ({
    ...item,
    label: l(item.label),
    ...(item.children ? { children: sidebarCode(item.children) } : {}),
  }));
const sidebarItems = (items = sidebarCode()): SidebarItem[] =>
  items.map((item) => ({
    ...item,
    icon: item.icon ? ti(item.icon) : undefined,
    children: item.children ? sidebarItems(item.children) : undefined,
  }));

const MENU_GROUPS: MenuEntry[] = [
  {
    group: true,
    label: m("Modifica"),
    items: [
      { id: "undo", label: m("Annulla"), trailingText: "⌘Z" },
      { id: "redo", label: m("Ripeti"), trailingText: "⇧⌘Z", disabled: true },
    ],
  },
  { separator: true },
  {
    id: "share",
    label: m("Condividi"),
    children: [
      { id: "link", label: m("Copia collegamento") },
      { id: "email", label: m("Invia per email") },
    ],
  },
];
/** Menu entries with labels translated to the current language, recursively. */
const translateMenu = (source: MenuEntry[]): MenuEntry[] =>
  source.map((entry) => {
    if ("separator" in entry && entry.separator) return entry;
    const item = { ...entry } as MenuEntry & {
      label?: string;
      items?: MenuEntry[];
      children?: MenuEntry[];
    };
    if (item.label) item.label = l(item.label);
    if (item.items) item.items = translateMenu(item.items);
    if (item.children) item.children = translateMenu(item.children);
    return item;
  });
const menuEntries = (selection: string): MenuEntry[] =>
  translateMenu([
    ...MENU_GROUPS,
    ...(selection === "none"
      ? [{ id: "open", label: m("Apri in nuova scheda"), href: "https://example.com" } as MenuEntry]
      : []),
    { id: "download", label: m("Scarica"), trailingText: "PDF" },
  ]);

const SPLIT_ITEMS: MenuEntry[] = [
  { id: "later", label: m("Invia più tardi") },
  { id: "draft", label: m("Salva bozza") },
  { separator: true },
  { id: "template", label: m("Usa modello") },
];
const splitItems = () => translateMenu(SPLIT_ITEMS);

const SUGGESTIONS = ["Bologna", "Bolzano", "Firenze", "Genova", "Milano", "Napoli", "Roma", "Torino"];
const CITY_OPTIONS = [
  "Bari",
  "Bologna",
  "Firenze",
  "Genova",
  "Milano",
  "Napoli",
  "Palermo",
  "Roma",
  "Torino",
  "Venezia",
];

const TAB_CODE = [
  { id: "inbox", label: m("Posta"), icon: "inbox", badge: "3" },
  { id: "archive", label: m("Archivio"), icon: "archive" },
  { id: "settings", label: m("Preferenze"), icon: "settings" },
];
/** TAB_CODE with labels in the current language, as shown in code snippets. */
const tabCode = () => TAB_CODE.map((item) => ({ ...item, label: l(item.label) }));
const tabItems = (): BolleItem[] =>
  tabCode().map((item) => ({ ...item, icon: ti(item.icon) }));

const snippets = (items: unknown, name = "items") => ({
  vuePreamble: [`const ${name} = ${code(items)}`],
  reactPreamble: [`const ${name} = ${code(items)}`],
});

export const entries: Entry[] = [
  {
    tag: "bolle-button",
    title: "Button",
    navLabel: "Buttons",
    group: "Buttons",
    summary:
      m("Azione principale o secondaria, con stati di toggle, link e invio form."),
    controls: [
      en("variant", m("Variante"), ["filled", "tonal", "outlined", "elevated", "text", "accent"], "filled"),
      en("size", m("Dimensione"), ["xs", "small", "medium", "large", "xl"], "small"),
      en("shape", m("Forma"), ["round", "square"], "round"),
      fl("icon", m("Icona iniziale"), false),
      fl("toggle", m("Toggle"), false),
      fl("selected", m("Selezionato"), false),
      fl("disabled", m("Disabilitato"), false),
      tx("label", m("Etichetta accessibile"), m("Azione")),
    ],
    render: (state) => html`<bolle-button
      .variant=${s(state, "variant")}
      .size=${s(state, "size")}
      .shape=${s(state, "shape")}
      ?toggle=${b(state, "toggle") && s(state, "variant") !== "text"}
      ?selected=${b(state, "selected")}
      ?disabled=${b(state, "disabled")}
      .label=${s(state, "label")}
      >${b(state, "icon")
        ? html`<span slot="icon" aria-hidden="true">${ti("plus")}</span>`
        : nothing}${s(state, "label") || l("Azione")}</bolle-button
    >`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("size", s(state, "size")),
        a("shape", s(state, "shape")),
        a("toggle", b(state, "toggle") && s(state, "variant") !== "text"),
        a("selected", b(state, "selected")),
        a("disabled", b(state, "disabled")),
        a("label", s(state, "label")),
      ],
      content: `${b(state, "icon") ? '<span slot="icon" aria-hidden="true">plus</span>' : ""}${s(state, "label") || l("Azione")}`,
    }),
  },
  {
    tag: "bolle-icon-button",
    title: "Icon button",
    navLabel: "Icon buttons",
    group: "Buttons",
    summary: m("Bottone con sola icona; l'etichetta accessibile è obbligatoria."),
    controls: [
      en("variant", m("Variante"), ["filled", "tonal", "outlined", "standard"], "tonal"),
      en("size", m("Dimensione"), ["xs", "small", "medium", "large", "xl"], "small"),
      en("shape", m("Forma"), ["round", "square"], "round"),
      en("width", m("Larghezza"), ["default", "narrow", "wide"], "default"),
      fl("toggle", m("Toggle"), false),
      fl("selected", m("Selezionato"), false),
      fl("disabled", m("Disabilitato"), false),
      tx("label", m("Etichetta accessibile"), m("Notifiche")),
    ],
    render: (state) => html`<bolle-icon-button
      .variant=${s(state, "variant")}
      .size=${s(state, "size")}
      .shape=${s(state, "shape")}
      .width=${s(state, "width")}
      ?toggle=${b(state, "toggle")}
      ?selected=${b(state, "selected")}
      ?disabled=${b(state, "disabled")}
      .label=${s(state, "label")}
      >${ti("star")}</bolle-icon-button
    >`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("size", s(state, "size")),
        a("shape", s(state, "shape")),
        a("width", s(state, "width")),
        a("toggle", b(state, "toggle")),
        a("selected", b(state, "selected")),
        a("disabled", b(state, "disabled")),
        a("label", s(state, "label")),
      ],
      content: "star",
    }),
  },
  {
    tag: "bolle-floating-action-button",
    title: "FAB",
    navLabel: "FABs",
    group: "Buttons",
    summary: m("Azione flottante con taglie e sei mappature di colore."),
    controls: [
      en("size", m("Dimensione"), ["fab", "small", "medium", "large"], "medium"),
      en("color", m("Colore"), ["primary-container", "secondary-container", "tertiary-container", "primary", "secondary", "tertiary", "surface"], "primary-container"),
      fl("disabled", m("Disabilitato"), false),
      tx("label", m("Etichetta accessibile"), m("Crea")),
    ],
    render: (state) => html`<bolle-floating-action-button
      .size=${s(state, "size")}
      .color=${s(state, "color")}
      ?disabled=${b(state, "disabled")}
      .label=${s(state, "label")}
      >${ti("plus")}</bolle-floating-action-button
    >`,
    code: (state) => ({
      attrs: [
        a("size", s(state, "size")),
        a("color", s(state, "color")),
        a("disabled", b(state, "disabled")),
        a("label", s(state, "label")),
      ],
      content: "add",
    }),
  },
  {
    tag: "bolle-extended-fab",
    title: "Extended FAB",
    navLabel: "Extended FABs",
    group: "Buttons",
    summary: m("FAB esteso con testo visibile e icona opzionale."),
    controls: [
      en("size", m("Dimensione"), ["small", "medium", "large"], "small"),
      en("color", m("Colore"), ["primary-container", "secondary-container", "tertiary-container", "primary", "secondary", "tertiary", "surface"], "primary-container"),
      fl("icon", m("Icona iniziale"), true),
      fl("disabled", m("Disabilitato"), false),
      tx("label", m("Etichetta"), m("Crea documento")),
    ],
    render: (state) => html`<bolle-extended-fab
      .size=${s(state, "size")}
      .color=${s(state, "color")}
      ?disabled=${b(state, "disabled")}
      .label=${s(state, "label")}
      >${b(state, "icon")
        ? html`<span slot="icon" aria-hidden="true">${ti("plus")}</span>`
        : nothing}${s(state, "label")}</bolle-extended-fab
    >`,
    code: (state) => ({
      attrs: [
        a("size", s(state, "size")),
        a("color", s(state, "color")),
        a("disabled", b(state, "disabled")),
        a("label", s(state, "label")),
      ],
      content: `${b(state, "icon") ? '<span slot="icon" aria-hidden="true">add</span>\n' : ""}${s(state, "label")}`,
    }),
  },
  {
    tag: "bolle-button-group",
    title: "Button group",
    navLabel: "Button groups",
    group: "Buttons",
    summary:
      m("Gruppo con selezione singola o multipla, navigazione da tastiera e geometria connessa."),
    controls: [
      en("variant", m("Variante"), ["standard", "connected"], "connected"),
      en("selection", m("Selezione"), ["none", "single", "multiple"], "single"),
      en("buttonVariant", m("Stile bottoni"), ["filled", "tonal", "outlined", "elevated"], "filled"),
      en("size", m("Dimensione"), ["xs", "small", "medium", "large", "xl"], "small"),
      en("shape", m("Forma"), ["round", "square"], "round"),
      fl("icons", m("Icone"), false),
      fl("required", m("Obbligatorio"), false),
      tx("label", m("Etichetta del gruppo"), m("Allineamento")),
    ],
    render: (state) => html`<bolle-button-group
      .variant=${s(state, "variant")}
      .selection=${s(state, "selection")}
      .size=${s(state, "size")}
      .shape=${s(state, "shape")}
      ?required=${b(state, "required")}
      .label=${s(state, "label")}
    >
      <bolle-button
        value="left"
        variant=${s(state, "buttonVariant")}
        selected
        >${b(state, "icons")
          ? html`<span slot="icon" aria-hidden="true">${ti("bold")}</span>`
          : nothing}${l("Sinistra")}</bolle-button
      >
      <bolle-button value="center" variant=${s(state, "buttonVariant")}
        >${b(state, "icons")
          ? html`<span slot="icon" aria-hidden="true">${ti("italic")}</span>`
          : nothing}${l("Centro")}</bolle-button
      >
      <bolle-button value="right" variant=${s(state, "buttonVariant")}
        >${b(state, "icons")
          ? html`<span slot="icon" aria-hidden="true">${ti("underline")}</span>`
          : nothing}${l("Destra")}</bolle-button
      >
    </bolle-button-group>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("selection", s(state, "selection")),
        a("size", s(state, "size")),
        a("shape", s(state, "shape")),
        a("required", b(state, "required")),
        a("label", s(state, "label")),
      ],
      content: ["left", "center", "right"]
        .map((value, index) => {
          const text = [l("Sinistra"), l("Centro"), l("Destra")][index];
          const icon = ["bold", "italic", "underline"][index];
          const attrs = `value="${value}" variant="${s(state, "buttonVariant")}"${index === 0 ? " selected" : ""}`;
          const leading = b(state, "icons")
            ? `<span slot="icon" aria-hidden="true">${icon}</span>`
            : "";
          return `<bolle-button ${attrs}>${leading}${text}</bolle-button>`;
        })
        .join("\n"),
    }),
  },
  {
    tag: "bolle-badge",
    title: "Badge",
    group: "Badges",
    summary: m("Contatore o punto di notifica; con etichetta diventa uno stato annunciato."),
    controls: [
      tx("value", m("Valore"), "12"),
      rg("max", m("Massimo"), 0, 999, 999),
      fl("small", m("Solo punto"), false),
      tx("label", m("Etichetta accessibile"), m("Notifiche")),
    ],
    render: (state) => html`<bolle-badge
      .value=${s(state, "value")}
      .max=${n(state, "max")}
      ?small=${b(state, "small")}
      .label=${s(state, "label")}
    ></bolle-badge>`,
    code: (state) => ({
      attrs: [
        a("value", s(state, "value")),
        a("max", n(state, "max")),
        a("small", b(state, "small")),
        a("label", s(state, "label")),
      ],
    }),
  },
  {
    tag: "bolle-bottom-app-bar",
    title: "Bottom app bar",
    group: "App bars",
    summary: m(
      "Contenitore in fondo alla schermata: azioni, uno spazio per il pulsante principale e una forma piana o staccata dal bordo.",
    ),
    note: m(
      "La barra non conosce l'applicazione: riceve le azioni negli slot e lascia al contenitore decidere cosa mostrare. Con dock il pulsante flottante esce dal bordo superiore e la barra resta un riferimento stabile mentre il contenuto scorre, se è sticky.",
    ),
    controls: [
      en("variant", m("Forma"), ["standard", "floating"], "standard"),
      en("align", m("Allineamento"), ["start", "center"], "start"),
      fl("divider", m("Linea superiore"), true),
      fl("dock", m("Pulsante agganciato"), false),
      tx("label", m("Etichetta accessibile"), m("Azioni della schermata")),
    ],
    render: (state) =>
      html`<bolle-bottom-app-bar
        class="bar-preview"
        .variant=${s(state, "variant")}
        .align=${s(state, "align")}
        ?divider=${b(state, "divider")}
        ?dock=${b(state, "dock")}
        .label=${s(state, "label")}
      >
        <bolle-icon-button
          slot="leading"
          variant="standard"
          label=${l(m("Indietro"))}
          >${ti("arrow-left")}</bolle-icon-button
        >
        <bolle-icon-button variant="standard" label=${l(m("Condividi"))}
          >${ti("users")}</bolle-icon-button
        >
        <bolle-icon-button variant="standard" label=${l(m("Preferiti"))}
          >${ti("heart")}</bolle-icon-button
        >
        <bolle-icon-button slot="trailing" variant="standard" label=${l(m("Altro"))}
          >${ti("menu-2")}</bolle-icon-button
        >
        <bolle-floating-action-button
          slot="fab"
          size="medium"
          label=${l(m("Nuova commessa"))}
          >${ti("plus")}</bolle-floating-action-button
        >
      </bolle-bottom-app-bar>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("align", s(state, "align")),
        a("label", s(state, "label")),
        ...(b(state, "divider") ? [] : [a("divider", false)]),
        ...(b(state, "dock") ? [a("dock", true)] : []),
      ],
      content: `<bolle-icon-button slot="leading" label="${l(m("Indietro"))}" variant="standard">…</bolle-icon-button>
<bolle-icon-button label="${l(m("Condividi"))}" variant="standard">…</bolle-icon-button>
<bolle-icon-button label="${l(m("Preferiti"))}" variant="standard">…</bolle-icon-button>
<bolle-icon-button slot="trailing" label="${l(m("Altro"))}" variant="standard">…</bolle-icon-button>
<bolle-floating-action-button slot="fab" label="${l(m("Nuova commessa"))}">…</bolle-floating-action-button>`,
    }),
  },
  {
    tag: "bolle-avatar",
    title: "Avatar",
    group: "Avatars",
    summary: m(
      "Segno di identità di una persona o di un ente: immagine, iniziali o icona, con un indicatore di stato.",
    ),
    note: m(
      "Le iniziali si ricavano dal nome quando non sono date, e restano leggibili anche in una lingua senza spazi. Se l'immagine non si carica, l'avatar ricade sulle iniziali senza lasciare un riquadro vuoto. Lo slot icon sostituisce il contenuto e lo slot badge aggiunge un contatore.",
    ),
    controls: [
      en("size", m("Dimensione"), ["xs", "small", "medium", "large", "xl"], "medium"),
      en("shape", m("Forma"), ["circle", "rounded", "square"], "circle"),
      en("color", m("Colore"), ["tertiary", "primary", "secondary", "surface"], "tertiary"),
      en("status", m("Stato"), ["", "online", "busy", "away", "offline"], "online"),
      fl("image", m("Con immagine"), false),
      tx("name", m("Nome"), "Francesca Moretti"),
    ],
    render: (state) =>
      html`<bolle-avatar
        .size=${s(state, "size")}
        .shape=${s(state, "shape")}
        .color=${s(state, "color")}
        .status=${s(state, "status") || undefined}
        .name=${s(state, "name")}
        .src=${b(state, "image") ? portrait : ""}
      ></bolle-avatar>`,
    code: (state) => ({
      attrs: [
        a("size", s(state, "size")),
        a("shape", s(state, "shape")),
        a("color", s(state, "color")),
        ...(s(state, "status") ? [a("status", s(state, "status"))] : []),
        ...(b(state, "image") ? [a("src", "/persone/moretti.jpg")] : []),
        a("name", s(state, "name")),
      ],
    }),
  },
  {
    tag: "bolle-empty-state",
    title: "Empty state",
    group: "Empty states",
    summary: m(
      "Superficie da mostrare quando un contenitore non ha nulla da disegnare: icona, titolo, una riga di testo e le azioni che ne escono.",
    ),
    note: m(
      "Un solo componente per il vuoto e per l'errore: il tono error colora l'icona con il ruolo d'errore e, con role alert, la regione viene annunciata appena compare. Con align start il testo e le azioni si allineano al bordo, come dentro una tabella.",
    ),
    controls: [
      en("tone", m("Tono"), ["neutral", "error"], "neutral"),
      en("align", m("Allineamento"), ["center", "start"], "center"),
      tx("title", m("Titolo"), m("Nessuna commessa da mostrare")),
      lt("text", m("Testo"), m("Le commesse archiviate non compaiono qui. Cambia i filtri o creane una nuova.")),
      fl("actions", m("Azioni"), true),
    ],
    render: (state) =>
      html`<bolle-empty-state
        class="empty-preview"
        .tone=${s(state, "tone")}
        .align=${s(state, "align")}
        .icon=${ti("folder")}
        .title=${s(state, "title")}
        .text=${s(state, "text")}
      >
        ${b(state, "actions")
          ? html`<bolle-button slot="actions" variant="filled">${l(m("Nuova commessa"))}</bolle-button>
              <bolle-button slot="actions" variant="text">${l(m("Cancella i filtri"))}</bolle-button>`
          : nothing}
      </bolle-empty-state>`,
    code: (state) => ({
      attrs: [
        a("tone", s(state, "tone")),
        a("align", s(state, "align")),
        a("title", s(state, "title")),
        a("text", s(state, "text")),
        { name: "icon", raw: "icon" },
      ],
      content: b(state, "actions")
        ? `<bolle-button slot="actions" variant="filled">${l(m("Nuova commessa"))}</bolle-button>`
        : undefined,
    }),
  },
  {
    tag: "bolle-pagination",
    title: "Pagination",
    group: "Pagination",
    summary: m(
      "Controllo delle pagine di un elenco che resta all'applicazione: intervallo, pagine numerate, frecce e righe per pagina.",
    ),
    note: m(
      m("La paginazione non taglia i dati: chiede la pagina e la dimensione con page-change e il totale lo riceve. La finestra delle pagine numerate lascia sempre raggiungibili la prima e l'ultima, e sotto i 560px di spazio il numero della pagina prende il posto dell'elenco; con form compact restano intervallo e frecce."),
    ),
    controls: [
      en("form", m("Forma"), ["full", "compact"], "full"),
      rg("page", m("Pagina"), 1, 25, 3),
      rg("pageSize", m("Righe per pagina"), 5, 50, 10, 5),
      rg("total", m("Righe in totale"), 20, 500, 248, 10),
      fl("pageSizes", m("Scelta delle righe"), true),
      tx("label", m("Etichetta accessibile"), m("Pagine")),
    ],
    render: (state) =>
      html`<demo-pagination
        .form=${s(state, "form")}
        .page=${n(state, "page") - 1}
        .pageSize=${n(state, "pageSize")}
        .total=${n(state, "total")}
        ?page-sizes=${b(state, "pageSizes")}
      ></demo-pagination>`,
    code: (state) => ({
      attrs: [
        a("page", n(state, "page") - 1),
        a("page-size", n(state, "pageSize")),
        a("total", n(state, "total")),
        a("form", s(state, "form")),
        a("label", s(state, "label")),
      ],
      vuePreamble: [
        `const page = ref(${n(state, "page") - 1})`,
        `const pageSize = ref(${n(state, "pageSize")})`,
      ],
      reactPreamble: [
        `const [page, setPage] = useState(${n(state, "page") - 1})`,
        `const [pageSize, setPageSize] = useState(${n(state, "pageSize")})`,
      ],
    }),
  },
  {
    tag: "bolle-progress-indicator",
    title: "Progress indicator",
    group: "Progress indicators",
    summary: m("Avanzamento lineare o circolare, determinato o indeterminato, anche ondulato."),
    controls: [
      en("variant", m("Variante"), ["linear", "circular"], "linear"),
      rg("value", m("Valore"), 0, 100, 65),
      fl("indeterminate", m("Indeterminato"), false),
      fl("wavy", m("Ondulato"), false),
      tx("label", m("Etichetta accessibile"), m("Avanzamento")),
    ],
    render: (state) => html`<bolle-progress-indicator
      .variant=${s(state, "variant")}
      .value=${n(state, "value")}
      ?indeterminate=${b(state, "indeterminate")}
      ?wavy=${b(state, "wavy")}
      .label=${s(state, "label")}
    ></bolle-progress-indicator>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("value", n(state, "value")),
        a("indeterminate", b(state, "indeterminate")),
        a("wavy", b(state, "wavy")),
        a("label", s(state, "label")),
      ],
    }),
  },
  {
    tag: "bolle-loading-indicator",
    title: "Loading indicator",
    group: "Loading indicator",
    summary: m("Indicatore Morph, libero o dentro un contenitore."),
    controls: [
      en("variant", m("Variante"), ["default", "contained"], "default"),
      tx("label", m("Etichetta accessibile"), m("Caricamento")),
    ],
    render: (state) => html`<bolle-loading-indicator
      .variant=${s(state, "variant")}
      .label=${s(state, "label")}
    ></bolle-loading-indicator>`,
    code: (state) => ({
      attrs: [a("variant", s(state, "variant")), a("label", s(state, "label"))],
    }),
  },
  {
    tag: "bolle-snackbar",
    title: "Snackbar",
    group: "Snackbar",
    summary: m("Messaggio temporaneo con azione, chiusura e coda di messaggi."),
    controls: [
      tx("message", m("Messaggio"), m("Documento eliminato")),
      tx("actionLabel", m("Etichetta azione"), m("Annulla")),
      tx("closeLabel", m("Etichetta chiusura"), m("Chiudi")),
      rg("duration", m("Durata (ms)"), 0, 10000, 5000, 1000),
      en("tail", m("Coda"), ["auto", "none"], "auto"),
    ],
    render: (state, ctx) => html`
      <bolle-button variant="tonal" @click=${() => ctx.snackbar("pv-snackbar", s(state, "message"))}>
        ${l("Mostra snackbar")}
      </bolle-button>
      <bolle-snackbar
        id="pv-snackbar"
        .message=${s(state, "message")}
        .actionLabel=${s(state, "actionLabel")}
        .closeLabel=${s(state, "closeLabel")}
        .duration=${n(state, "duration")}
        .tail=${s(state, "tail")}
      ></bolle-snackbar>
    `,
    code: (state) => ({
      attrs: [
        a("message", s(state, "message")),
        a("actionLabel", s(state, "actionLabel")),
        a("closeLabel", s(state, "closeLabel")),
        a("duration", n(state, "duration")),
        a("tail", s(state, "tail") === "auto" ? undefined : s(state, "tail")),
      ],
    }),
  },
  {
    tag: "bolle-tooltip",
    title: "Tooltip",
    group: "Tooltips",
    summary: m("Testo di aiuto su hover e focus, semplice o con contenuto ricco."),
    controls: [
      en("variant", m("Variante"), ["plain", "rich"], "plain"),
      fl("persistent", m("Persistente"), false),
      en("tail", m("Coda"), ["auto", "none"], "auto"),
      tx("label", m("Etichetta"), m("Salva una copia")),
      tx("supportingText", m("Testo di supporto"), m("La copia resta nel tuo spazio personale.")),
    ],
    render: (state) =>
      html`<bolle-tooltip
        .variant=${s(state, "variant")}
        ?persistent=${b(state, "persistent")}
        .label=${s(state, "label")}
        .supportingText=${s(state, "supportingText")}
        .tail=${s(state, "tail")}
      >
        <bolle-button variant="tonal">${l("Salva una copia")}</bolle-button>
      </bolle-tooltip>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("persistent", b(state, "persistent")),
        a("label", s(state, "label")),
        a("supportingText", s(state, "supportingText")),
        a("tail", s(state, "tail") === "auto" ? undefined : s(state, "tail")),
      ],
      content: `<bolle-button variant="tonal">${l("Salva una copia")}</bolle-button>`,
    }),
  },
  {
    tag: "bolle-carousel",
    title: "Carousel",
    group: "Carousel",
    summary: m("Sequenza di slide con controlli, contatore e varianti hero, multi-browse e full-screen."),
    controls: [
      en("variant", m("Variante"), ["hero", "multi-browse", "uncontained", "uncontained-multi-aspect-ratio", "center-aligned-hero", "full-screen"], "hero"),
      tx("label", m("Etichetta"), m("Documenti recenti")),
      tx("previousLabel", m("Etichetta precedente"), m("Precedente")),
      tx("nextLabel", m("Etichetta successivo"), m("Successivo")),
    ],
    render: (state) => html`<bolle-carousel
      .variant=${s(state, "variant")}
      .label=${s(state, "label")}
      .previousLabel=${s(state, "previousLabel")}
      .nextLabel=${s(state, "nextLabel")}
    >
      <article><h3>${l("Posta")}</h3><p>${l("Messaggi ricevuti")}</p></article>
      <article><h3>${l("Archivio")}</h3><p>${l("Documenti salvati")}</p></article>
      <article><h3>${l("Impostazioni")}</h3><p>${l("Preferenze personali")}</p></article>
    </bolle-carousel>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("label", s(state, "label")),
        a("previousLabel", s(state, "previousLabel")),
        a("nextLabel", s(state, "nextLabel")),
      ],
      content:
        `<article><h3>${l("Posta")}</h3><p>${l("Messaggi ricevuti")}</p></article>\n` +
        `<article><h3>${l("Archivio")}</h3><p>${l("Documenti salvati")}</p></article>\n` +
        `<article><h3>${l("Impostazioni")}</h3><p>${l("Preferenze personali")}</p></article>`,
    }),
  },
  {
    tag: "bolle-card",
    title: "Card",
    group: "Cards",
    summary: m(
      "Superficie per contenuto correlato, con media, orientamento e varianti di elevazione.",
    ),
    note: m(
      "Con href l'intera card diventa un link: è il modo di portare a un'altra pagina con una superficie, mentre i bottoni restano per le azioni. Una card-link non deve contenere altri controlli interattivi. La coda punta da dove arriva l'utente: una card sotto il contenuto la gira in alto, dal lato opposto alla direzione in cui porta. Con tail=\"none\" la coda sparisce e la card resta una bolla con i quattro angoli uguali.",
    ),
    controls: [
      en(
        "variant",
        m("Variante"),
        ["filled", "elevated", "outlined"],
        "filled",
      ),
      en(
        "orientation",
        m("Orientamento"),
        ["vertical", "horizontal"],
        "vertical",
      ),
      en(
        "tail",
        m("Coda"),
        ["bottom-start", "bottom-end", "top-start", "top-end", "none"],
        "bottom-start",
      ),
      tx("href", m("Collegamento"), "", "#/bolle-dialog"),
      tx("label", m("Etichetta accessibile"), m("Documento")),
    ],
    render: (state) => html`<bolle-card
      .variant=${s(state, "variant")}
      .orientation=${s(state, "orientation")}
      .tail=${s(state, "tail") as CardTail}
      .href=${s(state, "href")}
      .label=${s(state, "label")}
    >
      <h3>${l("Documento")}</h3>
      <p>
        ${s(state, "href")
          ? l("Tutta la card porta alla destinazione.")
          : l("Contenuto indipendente con un'azione interna.")}
      </p>
      ${s(state, "href")
        ? nothing
        : html`<bolle-button variant="text">${l("Apri")}</bolle-button>`}
    </bolle-card>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("orientation", s(state, "orientation")),
        a("tail", s(state, "tail") === "bottom-start" ? undefined : s(state, "tail")),
        a("href", s(state, "href")),
        a("label", s(state, "label")),
      ],
      content: s(state, "href")
        ? `<h3>${l("Documento")}</h3>\n<p>${l("Tutta la card porta alla destinazione.")}</p>`
        : `<h3>${l("Documento")}</h3>\n<p>${l("Contenuto indipendente con un'azione interna.")}</p>\n<bolle-button variant="text">${l("Apri")}</bolle-button>`,
    }),
  },
  {
    tag: "bolle-dialog",
    title: "Dialog",
    group: "Dialogs",
    summary: m("Finestra modale o non modale, con azioni e variante a schermo intero."),
    controls: [
      en("variant", m("Variante"), ["basic", "full-screen"], "basic"),
      fl("modal", m("Modale"), true),
      tx("closeLabel", m("Etichetta chiusura"), m("Annulla")),
      tx("label", m("Etichetta accessibile"), m("Eliminare il documento?")),
    ],
    render: (state, ctx) => html`
      <bolle-button variant="filled" @click=${(event: Event) => ctx.show("pv-dialog", event)}>
        ${l("Apri dialog")}
      </bolle-button>
      <bolle-dialog
        id="pv-dialog"
        .variant=${s(state, "variant")}
        ?modal=${b(state, "modal")}
        .closeLabel=${s(state, "closeLabel")}
        .label=${s(state, "label")}
      >
        <p>${l("L'operazione non può essere annullata.")}</p>
        <bolle-button
          slot="actions"
          variant="text"
          @click=${() => ctx.close("pv-dialog", "elimina")}
          >${l("Elimina")}</bolle-button
        >
      </bolle-dialog>
    `,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("modal", b(state, "modal")),
        a("closeLabel", s(state, "closeLabel")),
        a("label", s(state, "label")),
      ],
      content:
        `<p>${l("L'operazione non può essere annullata.")}</p>\n` +
        `<bolle-button slot="actions" variant="text">${l("Elimina")}</bolle-button>`,
    }),
  },
  {
    tag: "bolle-bottom-sheet",
    title: "Bottom sheet",
    group: "Sheets",
    summary: m("Foglio ancorato in basso, modale o standard, con maniglia di trascinamento."),
    controls: [
      en("variant", m("Variante"), ["modal", "standard"], "modal"),
      fl("dragHandle", m("Maniglia"), true),
      tx("closeLabel", m("Etichetta chiusura"), m("Chiudi")),
      tx("label", m("Etichetta accessibile"), m("Filtri")),
    ],
    render: (state, ctx) => html`
      ${s(state, "variant") === "modal"
        ? html`<bolle-button variant="filled" @click=${(event: Event) => ctx.show("pv-sheet", event)}>
            ${l("Apri foglio")}
          </bolle-button>`
        : nothing}
      <bolle-bottom-sheet
        id="pv-sheet"
        .variant=${s(state, "variant")}
        ?dragHandle=${b(state, "dragHandle")}
        .open=${s(state, "variant") === "standard"}
        .closeLabel=${s(state, "closeLabel")}
        .label=${s(state, "label")}
      >
        <p>${l("Scegli i filtri da applicare.")}</p>
        <bolle-button slot="actions" @click=${() => ctx.close("pv-sheet", "applica")}>
          ${l("Applica")}
        </bolle-button>
      </bolle-bottom-sheet>
    `,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("dragHandle", b(state, "dragHandle")),
        a("open", s(state, "variant") === "standard"),
        a("closeLabel", s(state, "closeLabel")),
        a("label", s(state, "label")),
      ],
      content:
        `<p>${l("Scegli i filtri da applicare.")}</p>\n` +
        `<bolle-button slot="actions">${l("Applica")}</bolle-button>`,
    }),
  },
  {
    tag: "bolle-side-sheet",
    title: "Side sheet",
    group: "Sheets",
    summary: m("Pannello laterale modale o standard, con variante staccata dal bordo."),
    controls: [
      en("variant", m("Variante"), ["modal", "standard"], "modal"),
      fl("detached", m("Staccato"), false),
      tx("closeLabel", m("Etichetta chiusura"), m("Chiudi")),
      tx("label", m("Etichetta accessibile"), m("Dettagli")),
    ],
    render: (state, ctx) => html`
      ${s(state, "variant") === "modal"
        ? html`<bolle-button variant="filled" @click=${(event: Event) => ctx.show("pv-side", event)}>
            ${l("Apri pannello")}
          </bolle-button>`
        : nothing}
      <bolle-side-sheet
        id="pv-side"
        .variant=${s(state, "variant")}
        ?detached=${b(state, "detached")}
        .open=${s(state, "variant") === "standard"}
        .closeLabel=${s(state, "closeLabel")}
        .label=${s(state, "label")}
      >
        <p>${l("Dettagli del documento selezionato.")}</p>
        <bolle-button slot="actions" @click=${() => ctx.close("pv-side", "salvato")}>
          ${l("Salva")}
        </bolle-button>
      </bolle-side-sheet>
    `,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("detached", b(state, "detached")),
        a("open", s(state, "variant") === "standard"),
        a("closeLabel", s(state, "closeLabel")),
        a("label", s(state, "label")),
      ],
      content:
        `<p>${l("Dettagli del documento selezionato.")}</p>\n` +
        `<bolle-button slot="actions">${l("Salva")}</bolle-button>`,
    }),
  },
  {
    tag: "bolle-divider",
    title: "Divider",
    group: "Divider",
    summary: m("Separatore orizzontale o verticale, con inset e modalità decorativa."),
    controls: [
      en("variant", m("Variante"), ["full", "inset", "inset-start", "inset-end"], "full"),
      fl("vertical", m("Verticale"), false),
      fl("inset", m("Inset"), false),
      fl("decorative", m("Decorativo"), false),
    ],
    render: (state) => html`<div class="divider-row">
      ${b(state, "vertical") ? html`<span>${l("Prima")}</span>` : nothing}
      <bolle-divider
        .variant=${s(state, "variant")}
        ?vertical=${b(state, "vertical")}
        ?inset=${b(state, "inset")}
        ?decorative=${b(state, "decorative")}
      ></bolle-divider>
      ${b(state, "vertical") ? html`<span>${l("Dopo")}</span>` : nothing}
    </div>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("vertical", b(state, "vertical")),
        a("inset", b(state, "inset")),
        a("decorative", b(state, "decorative")),
      ],
    }),
  },
  {
    tag: "bolle-app-bar",
    title: "App bar",
    group: "App bars",
    summary: m("Barra superiore con sette layout, sottotitolo, slot e stato di scorrimento."),
    controls: [
      en("variant", m("Variante"), ["small", "center-aligned", "medium", "medium-flexible", "large", "large-flexible", "search"], "small"),
      tx("subtitle", m("Sottotitolo"), m("12 non letti")),
      en("alignment", m("Allineamento"), ["leading", "center"], "leading"),
      fl("sticky", m("Sticky"), false),
      fl("scrolled", m("Scorso"), false),
      fl("collapsed", m("Compresso"), false),
      tx("label", m("Titolo"), m("Posta")),
    ],
    render: (state) => html`<bolle-app-bar
      .variant=${s(state, "variant")}
      .subtitle=${s(state, "subtitle")}
      .alignment=${s(state, "alignment")}
      ?sticky=${b(state, "sticky")}
      ?scrolled=${b(state, "scrolled")}
      ?collapsed=${b(state, "collapsed")}
      .label=${s(state, "label")}
    >
      ${s(state, "variant") === "search"
        ? nothing
        : html`<span class="preview-app-title">${s(state, "label")}</span>`}
      <bolle-icon-button slot="leading" label=${l("Menu")}>${ti("menu-2")}</bolle-icon-button>
      ${s(state, "variant") === "search"
        ? html`<bolle-search label=${l("Cerca")} placeholder=${l("Cerca nella posta")}>
            <span slot="leading" aria-hidden="true">${ti("search")}</span>
          </bolle-search>`
        : nothing}
      <bolle-icon-button slot="trailing" label=${l("Cerca")}>${ti("search")}</bolle-icon-button>
    </bolle-app-bar>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("subtitle", s(state, "subtitle")),
        a("alignment", s(state, "alignment")),
        a("sticky", b(state, "sticky")),
        a("scrolled", b(state, "scrolled")),
        a("collapsed", b(state, "collapsed")),
        a("label", s(state, "label")),
      ],
      content:
        `<bolle-icon-button slot="leading" label="${l("Menu")}">menu</bolle-icon-button>\n` +
        `<bolle-icon-button slot="trailing" label="${l("Cerca")}">search</bolle-icon-button>`,
    }),
  },
  {
    tag: "bolle-toolbar",
    title: "Toolbar",
    group: "Toolbars",
    summary: m("Raggruppa azioni correlate con roving tabindex, orizzontale o verticale."),
    controls: [
      en("variant", m("Variante"), ["docked", "floating"], "docked"),
      en("orientation", m("Orientamento"), ["horizontal", "vertical"], "horizontal"),
      en("color", m("Colore"), ["standard", "vibrant"], "standard"),
      tx("label", m("Etichetta"), m("Formato")),
    ],
    render: (state) => html`<bolle-toolbar
      .variant=${s(state, "variant")}
      .orientation=${s(state, "orientation")}
      .color=${s(state, "color")}
      .label=${s(state, "label")}
    >
      <bolle-icon-button label=${l("Grassetto")} toggle>${ti("bold")}</bolle-icon-button>
      <bolle-icon-button label=${l("Corsivo")} toggle>${ti("italic")}</bolle-icon-button>
      <bolle-icon-button label=${l("Sottolineato")} toggle>${ti("underline")}</bolle-icon-button>
    </bolle-toolbar>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("orientation", s(state, "orientation")),
        a("color", s(state, "color")),
        a("label", s(state, "label")),
      ],
      content:
        `<bolle-icon-button label="${l("Grassetto")}" toggle>format_bold</bolle-icon-button>\n` +
        `<bolle-icon-button label="${l("Corsivo")}" toggle>format_italic</bolle-icon-button>\n` +
        `<bolle-icon-button label="${l("Sottolineato")}" toggle>format_underline</bolle-icon-button>`,
    }),
  },
  {
    tag: "bolle-navigation-bar",
    title: "Navigation bar",
    group: "Navigation bar",
    summary: m("Da tre a cinque destinazioni, baseline o flexible, con layout orizzontale."),
    controls: [
      en("variant", m("Variante"), ["standard", "flexible"], "standard"),
      en("layout", m("Layout"), ["vertical", "horizontal"], "vertical"),
      tx("label", m("Etichetta"), m("Navigazione principale")),
    ],
    render: (state) => html`<bolle-navigation-bar
      .variant=${s(state, "variant")}
      .layout=${s(state, "layout")}
      .label=${s(state, "label")}
      .items=${navItems()}
      value="inbox"
    ></bolle-navigation-bar>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("layout", s(state, "layout")),
        a("label", s(state, "label")),
        { name: "items", raw: "items" },
        a("value", "inbox"),
      ],
      ...snippets(iconCode()),
    }),
  },
  {
    tag: "bolle-navigation-rail",
    title: "Navigation rail",
    group: "Navigation rail",
    summary: m("Rail compresso o espanso per la navigazione laterale."),
    controls: [
      fl("expanded", m("Espanso"), true),
      en("variant", m("Variante"), ["standard", "flexible"], "standard"),
      en("layout", m("Layout"), ["vertical", "horizontal"], "vertical"),
      tx("label", m("Etichetta"), m("Navigazione laterale")),
    ],
    render: (state) => html`<bolle-navigation-rail
      ?expanded=${b(state, "expanded")}
      .variant=${s(state, "variant")}
      .layout=${s(state, "layout")}
      .label=${s(state, "label")}
      .items=${navItems()}
      value="inbox"
    ></bolle-navigation-rail>`,
    code: (state) => ({
      attrs: [
        a("expanded", b(state, "expanded")),
        a("variant", s(state, "variant")),
        a("layout", s(state, "layout")),
        a("label", s(state, "label")),
        { name: "items", raw: "items" },
        a("value", "inbox"),
      ],
      ...snippets(iconCode()),
    }),
  },
  {
    tag: "bolle-navigation-drawer",
    title: "Navigation drawer",
    group: "Navigation drawer",
    summary: m("Drawer di sezioni modale o standard, con contenuto aggiuntivo."),
    controls: [
      en("variant", m("Variante"), ["modal", "standard"], "modal"),
      fl("detached", m("Staccato"), false),
      tx("closeLabel", m("Etichetta chiusura"), m("Chiudi")),
      tx("label", m("Etichetta"), m("Sezioni")),
    ],
    render: (state, ctx) => html`
      ${s(state, "variant") === "modal"
        ? html`<bolle-button variant="filled" @click=${(event: Event) => ctx.show("pv-drawer", event)}>
            ${l("Apri drawer")}
          </bolle-button>`
        : nothing}
      <bolle-navigation-drawer
        id="pv-drawer"
        .variant=${s(state, "variant")}
        ?detached=${b(state, "detached")}
        .open=${s(state, "variant") === "standard"}
        .closeLabel=${s(state, "closeLabel")}
        .label=${s(state, "label")}
        .items=${navItems()}
        value="inbox"
      >
        <p>${l("Contenuto aggiuntivo del drawer.")}</p>
      </bolle-navigation-drawer>
    `,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("detached", b(state, "detached")),
        a("open", s(state, "variant") === "standard"),
        a("closeLabel", s(state, "closeLabel")),
        a("label", s(state, "label")),
        { name: "items", raw: "items" },
        a("value", "inbox"),
      ],
      content: `<p>${l("Contenuto aggiuntivo del drawer.")}</p>`,
      ...snippets(iconCode()),
    }),
  },
  {
    tag: "bolle-tabs",
    title: "Tabs",
    group: "Tabs",
    summary: m("Tab primari o secondari, attivazione automatica o manuale, anche scorrevoli."),
    controls: [
      en("variant", m("Variante"), ["primary", "secondary"], "primary"),
      en("activation", m("Attivazione"), ["automatic", "manual"], "automatic"),
      fl("scrollable", m("Scorrevoli"), false),
      fl("icons", m("Icone"), true),
      fl("badges", m("Badge"), true),
      tx("label", m("Etichetta"), m("Categorie")),
    ],
    render: (state) => {
      const items = tabCode().map((item, index) => ({
        id: item.id,
        label: item.label,
        icon: b(state, "icons") ? ti(item.icon) : undefined,
        badge: b(state, "badges") && index === 0 ? item.badge : undefined,
      }));
      return html`<bolle-tabs
        .variant=${s(state, "variant")}
        .activation=${s(state, "activation")}
        ?scrollable=${b(state, "scrollable")}
        .label=${s(state, "label")}
        .items=${items}
        value="inbox"
      >
        <p slot="inbox">${l("Messaggi ricevuti.")}</p>
        <p slot="archive">${l("Documenti salvati.")}</p>
        <p slot="settings">${l("Preferenze personali.")}</p>
      </bolle-tabs>`;
    },
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("activation", s(state, "activation")),
        a("scrollable", b(state, "scrollable")),
        a("label", s(state, "label")),
        { name: "items", raw: "items" },
        a("value", "inbox"),
      ],
      content:
        `<p slot="inbox">${l("Messaggi ricevuti.")}</p>\n` +
        `<p slot="archive">${l("Documenti salvati.")}</p>\n` +
        `<p slot="settings">${l("Preferenze personali.")}</p>`,
      ...snippets(
        tabCode().map((item, index) => ({
          id: item.id,
          label: item.label,
          ...(b(state, "icons") ? { icon: item.icon } : {}),
          ...(b(state, "badges") && index === 0 ? { badge: item.badge } : {}),
        })),
      ),
    }),
  },
  {
    tag: "bolle-checkbox",
    title: "Checkbox",
    group: "Checkbox",
    summary: m("Selezione binaria con stato indeterminato, errore e testo di supporto."),
    controls: [
      fl("checked", m("Selezionata"), true),
      fl("indeterminate", m("Indeterminata"), false),
      fl("required", m("Obbligatoria"), false),
      fl("disabled", m("Disabilitata"), false),
      fl("error", m("Errore"), false),
      tx("label", m("Etichetta"), m("Accetto i termini")),
      tx("supportingText", m("Testo di supporto"), m("Puoi revocare il consenso.")),
    ],
    render: (state) => html`<bolle-checkbox
      ?checked=${b(state, "checked")}
      ?indeterminate=${b(state, "indeterminate")}
      ?required=${b(state, "required")}
      ?disabled=${b(state, "disabled")}
      ?error=${b(state, "error")}
      .label=${s(state, "label")}
      .supportingText=${s(state, "supportingText")}
    ></bolle-checkbox>`,
    code: (state) => ({
      attrs: [
        a("checked", b(state, "checked")),
        a("indeterminate", b(state, "indeterminate")),
        a("required", b(state, "required")),
        a("disabled", b(state, "disabled")),
        a("error", b(state, "error")),
        a("label", s(state, "label")),
        a("supportingText", s(state, "supportingText")),
      ],
    }),
  },
  {
    tag: "bolle-switch",
    title: "Switch",
    group: "Switch",
    summary: m("Interruttore immediato con icone di stato opzionali."),
    controls: [
      fl("checked", m("Attivo"), true),
      en("icons", m("Icone"), ["none", "selected", "both"], "both"),
      fl("required", m("Obbligatorio"), false),
      fl("disabled", m("Disabilitato"), false),
      fl("error", m("Errore"), false),
      tx("label", m("Etichetta"), "Wi-Fi"),
      tx("supportingText", m("Testo di supporto"), m("Rete senza fili.")),
    ],
    render: (state) => html`<bolle-switch
      ?checked=${b(state, "checked")}
      ?required=${b(state, "required")}
      ?disabled=${b(state, "disabled")}
      ?error=${b(state, "error")}
      .label=${s(state, "label")}
      .supportingText=${s(state, "supportingText")}
      .icon=${s(state, "icons") === "both" ? ti("wifi-off") : nothing}
      .iconSelected=${s(state, "icons") === "none" ? nothing : ti("wifi")}
    ></bolle-switch>`,
    code: (state) => ({
      attrs: [
        a("checked", b(state, "checked")),
        a("required", b(state, "required")),
        a("disabled", b(state, "disabled")),
        a("error", b(state, "error")),
        a("label", s(state, "label")),
        a("supportingText", s(state, "supportingText")),
      ],
    }),
  },
  {
    tag: "bolle-radio-button",
    title: "Radio button",
    group: "Radio button",
    summary: m("Scelta singola in un gruppo con navigazione da tastiera."),
    controls: [
      fl("checked", m("Selezionato"), true),
      fl("required", m("Obbligatorio"), false),
      fl("disabled", m("Disabilitato"), false),
      tx("label", m("Etichetta"), m("Standard")),
    ],
    render: (state) => html`<div class="radio-group">
      ${["standard", "plus", "enterprise"].map(
        (value, index) => html`<bolle-radio-button
          name="plan"
          value=${value}
          .label=${index === 0 ? s(state, "label") : value}
          ?checked=${index === 0 && b(state, "checked")}
          ?required=${b(state, "required")}
          ?disabled=${b(state, "disabled")}
        ></bolle-radio-button>`,
      )}
    </div>`,
    code: (state) => ({
      attrs: [
        a("name", "plan"),
        a("value", "standard"),
        a("label", s(state, "label")),
        a("checked", b(state, "checked")),
        a("required", b(state, "required")),
        a("disabled", b(state, "disabled")),
      ],
    }),
  },
  {
    tag: "bolle-chip",
    title: "Chip",
    group: "Chips",
    summary: m("Assist, filter, input e suggestion, con elevazione, rimozione e avatar."),
    controls: [
      en("variant", m("Variante"), ["assist", "filter", "input", "suggestion"], "assist"),
      fl("selected", m("Selezionata"), false),
      fl("elevated", m("Elevata"), false),
      fl("disabled", m("Disabilitata"), false),
      fl("removable", m("Rimovibile"), false),
      tx("label", m("Etichetta"), m("Preferiti")),
      tx("removeLabel", m("Etichetta rimozione"), m("Rimuovi Preferiti")),
    ],
    render: (state) => html`<bolle-chip
      .variant=${s(state, "variant")}
      ?selected=${b(state, "selected")}
      ?elevated=${b(state, "elevated")}
      ?disabled=${b(state, "disabled")}
      ?removable=${b(state, "removable")}
      .label=${s(state, "label")}
      .removeLabel=${s(state, "removeLabel")}
    ></bolle-chip>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("selected", b(state, "selected")),
        a("elevated", b(state, "elevated")),
        a("disabled", b(state, "disabled")),
        a("removable", b(state, "removable")),
        a("label", s(state, "label")),
        a("removeLabel", s(state, "removeLabel")),
      ],
    }),
  },
  {
    tag: "bolle-list",
    title: "List",
    group: "Lists",
    summary: m("Righe con icone, testo di supporto, link, espansione e selezione singola o multipla."),
    controls: [
      en("variant", m("Variante"), ["standard", "segmented"], "standard"),
      en("selection", m("Selezione"), ["none", "single", "multiple"], "single"),
      fl("interactive", m("Interattiva"), true),
      tx("label", m("Etichetta"), m("Documenti")),
    ],
    render: (state) => html`<bolle-list
      .variant=${s(state, "variant")}
      .selection=${s(state, "selection")}
      ?interactive=${b(state, "interactive")}
      .label=${s(state, "label")}
      .items=${listItems()}
      .value=${s(state, "selection") === "multiple" ? ["inbox"] : "inbox"}
      .expanded=${["folders"]}
    ></bolle-list>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("selection", s(state, "selection")),
        a("interactive", b(state, "interactive")),
        a("label", s(state, "label")),
        { name: "items", raw: "items" },
        { name: "value", raw: s(state, "selection") === "multiple" ? "['inbox']" : "'inbox'" },
        { name: "expanded", raw: "['folders']" },
      ],
      ...snippets(listCode()),
    }),
  },
  {
    tag: "bolle-segmented-buttons",
    title: "Segmented buttons",
    group: "Buttons",
    summary: m("Da due a cinque segmenti con selezione singola o multipla."),
    controls: [
      fl("multiple", m("Selezione multipla"), false),
      fl("required", m("Obbligatorio"), false),
      fl("disabled", m("Disabilitato"), false),
      rg("count", m("Segmenti"), 2, 5, 3),
      en("content", m("Contenuto"), ["label", "icon-label"], "icon-label"),
      tx("label", m("Etichetta"), m("Vista")),
    ],
    render: (state) => {
      const pool = [
        { id: "inbox", label: l("Posta"), icon: "inbox" },
        { id: "archive", label: l("Archivio"), icon: "archive" },
        { id: "settings", label: l("Impostazioni"), icon: "settings" },
        { id: "star", label: l("Preferiti"), icon: "star" },
        { id: "trash", label: l("Cestino"), icon: "trash" },
      ];
      const items = pool.slice(0, n(state, "count")).map((item) => ({
        ...item,
        icon: s(state, "content") === "label" ? undefined : ti(item.icon),
      }));
      return html`<bolle-segmented-buttons
        ?multiple=${b(state, "multiple")}
        ?required=${b(state, "required")}
        ?disabled=${b(state, "disabled")}
        .label=${s(state, "label")}
        .items=${items}
        .value=${items[0]?.id}
        .values=${items.slice(0, 2).map((item) => item.id)}
      ></bolle-segmented-buttons>`;
    },
    code: (state) => {
      const pool = [
        { id: "inbox", label: l("Posta"), icon: "inbox" },
        { id: "archive", label: l("Archivio"), icon: "archive" },
        { id: "settings", label: l("Impostazioni"), icon: "settings" },
        { id: "star", label: l("Preferiti"), icon: "star" },
        { id: "trash", label: l("Cestino"), icon: "trash" },
      ];
      const items = pool.slice(0, n(state, "count"));
      return {
        attrs: [
          a("multiple", b(state, "multiple")),
          a("required", b(state, "required")),
          a("disabled", b(state, "disabled")),
          a("label", s(state, "label")),
          { name: "items", raw: "items" },
          { name: "value", raw: `'${items[0]?.id}'` },
          ...(b(state, "multiple")
            ? [{ name: "values", raw: `[${items.slice(0, 2).map((item) => `'${item.id}'`).join(", ")}]` }]
            : []),
        ],
        ...snippets(
          items.map((item) =>
            s(state, "content") === "label"
              ? { id: item.id, label: item.label }
              : item,
          ),
        ),
      };
    },
  },
  {
    tag: "bolle-slider",
    title: "Slider",
    group: "Sliders",
    summary: m("Bolla-valore, livello liquido, membrana o intervallo a gocce che si fondono."),
    controls: [
      en("variant", m("Variante"), ["bubble", "liquid", "membrane", "range"], "bubble"),
      rg("min", m("Minimo"), 0, 100, 0),
      rg("max", m("Massimo"), 0, 100, 100),
      rg("step", m("Passo"), 1, 10, 1),
      rg("value", m("Valore"), 0, 100, 40),
      rg("upperValue", m("Valore massimo (range)"), 0, 100, 70),
      tx("suffix", m("Suffisso"), ""),
      fl("disabled", m("Disabilitato"), false),
      tx("label", m("Etichetta"), m("Volume")),
    ],
    render: (state) => html`<bolle-slider
      .variant=${s(state, "variant")}
      .min=${n(state, "min")}
      .max=${n(state, "max")}
      .step=${n(state, "step")}
      .value=${String(n(state, "value"))}
      .upperValue=${n(state, "upperValue")}
      .suffix=${s(state, "suffix")}
      .icon=${s(state, "variant") === "liquid" ? ti("volume") : undefined}
      ?disabled=${b(state, "disabled")}
      .label=${s(state, "label")}
    ></bolle-slider>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("min", n(state, "min")),
        a("max", n(state, "max")),
        a("step", n(state, "step")),
        a("value", String(n(state, "value"))),
        a("upper-value", s(state, "variant") === "range" ? n(state, "upperValue") : undefined),
        a("suffix", s(state, "suffix")),
        a("disabled", b(state, "disabled")),
        a("label", s(state, "label")),
      ],
    }),
  },
  {
    tag: "bolle-steps",
    title: "Steps",
    group: "Sliders",
    summary: m("Da tre a sette livelli con nome, disegnati come bolle che crescono."),
    controls: [
      tx("options", m("Opzioni"), m("Leggera,Morbida,Media,Forte,Intensa")),
      rg("value", m("Indice"), 0, 6, 2),
      fl("disabled", m("Disabilitato"), false),
      tx("label", m("Etichetta"), m("Intensità")),
    ],
    render: (state) => html`<bolle-steps
      options=${s(state, "options")}
      .value=${String(n(state, "value"))}
      ?disabled=${b(state, "disabled")}
      .label=${s(state, "label")}
    ></bolle-steps>`,
    code: (state) => ({
      attrs: [
        a("options", s(state, "options")),
        a("value", String(n(state, "value"))),
        a("disabled", b(state, "disabled")),
        a("label", s(state, "label")),
      ],
    }),
  },
  {
    tag: "bolle-text-field",
    title: "Text field",
    group: "Text fields",
    summary: m("Campo a riga singola o multilinea, con affissi, contatore, errore e slot icona."),
    controls: [
      en("variant", m("Variante"), ["filled", "outlined"], "filled"),
      en("type", m("Tipo"), ["text", "email", "password", "number", "search", "date"], "text"),
      fl("multiline", m("Multilinea"), false),
      rg("rows", m("Righe"), 2, 8, 3),
      fl("leadingIcon", m("Icona iniziale"), false),
      fl("trailingIcon", m("Icona finale"), false),
      tx("prefix", m("Prefisso"), ""),
      tx("suffix", m("Suffisso"), ""),
      fl("error", m("Errore"), false),
      fl("readonly", m("Sola lettura"), false),
      fl("required", m("Obbligatorio"), false),
      fl("disabled", m("Disabilitato"), false),
      fl("counter", m("Contatore"), false),
      rg("maxlength", m("Lunghezza massima"), 0, 200, 120),
      tx("label", m("Etichetta"), m("Email")),
      tx("value", m("Valore"), ""),
      tx("supportingText", m("Testo di supporto"), m("Useremo questo indirizzo per le notifiche.")),
    ],
    render: (state) => html`<bolle-text-field
      .variant=${s(state, "variant")}
      .type=${s(state, "type")}
      ?multiline=${b(state, "multiline")}
      .rows=${n(state, "rows")}
      ?error=${b(state, "error")}
      ?readonly=${b(state, "readonly")}
      ?required=${b(state, "required")}
      ?disabled=${b(state, "disabled")}
      ?counter=${b(state, "counter")}
      .maxlength=${n(state, "maxlength")}
      .label=${s(state, "label")}
      .value=${s(state, "value")}
      .prefix=${s(state, "prefix")}
      .suffix=${s(state, "suffix")}
      .supportingText=${s(state, "supportingText")}
      >${b(state, "leadingIcon")
        ? html`<span slot="leading" aria-hidden="true">${ti("inbox")}</span>`
        : nothing}${b(state, "trailingIcon")
        ? html`<span slot="trailing" aria-hidden="true">${ti("help")}</span>`
        : nothing}</bolle-text-field
    >`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("type", s(state, "type")),
        a("multiline", b(state, "multiline")),
        a("rows", b(state, "multiline") ? n(state, "rows") : undefined),
        a("error", b(state, "error")),
        a("readonly", b(state, "readonly")),
        a("required", b(state, "required")),
        a("disabled", b(state, "disabled")),
        a("counter", b(state, "counter")),
        a("maxlength", n(state, "maxlength")),
        a("label", s(state, "label")),
        a("value", s(state, "value")),
        a("prefix", s(state, "prefix")),
        a("suffix", s(state, "suffix")),
        a("supportingText", s(state, "supportingText")),
      ],
      content:
        (b(state, "leadingIcon")
          ? '<span slot="leading" aria-hidden="true">inbox</span>\n'
          : "") +
        (b(state, "trailingIcon")
          ? '<span slot="trailing" aria-hidden="true">help</span>'
          : "") || undefined,
    }),
  },
  {
    tag: "bolle-search",
    title: "Search",
    group: "Search",
    summary: m("Ricerca con suggerimenti filtrabili, combobox ARIA e area risultati."),
    controls: [
      en("appearance", m("Aspetto"), ["contained", "divided"], "contained"),
      en("layout", m("Layout"), ["docked", "full-screen"], "docked"),
      fl("filter", m("Filtra suggerimenti"), true),
      rg("suggestionDelay", m("Ritardo suggerimenti (ms)"), 0, 1000, 0, 50),
      tx("label", m("Etichetta"), m("Cerca città")),
      tx("placeholder", m("Placeholder"), m("Scrivi una città")),
    ],
    render: (state) => html`<bolle-search
      .appearance=${s(state, "appearance")}
      .layout=${s(state, "layout")}
      ?filter=${b(state, "filter")}
      .suggestionDelay=${n(state, "suggestionDelay")}
      .label=${s(state, "label")}
      .placeholder=${s(state, "placeholder")}
      .suggestions=${SUGGESTIONS}
      suggestions-label=${l("Suggerimenti")}
    ></bolle-search>`,
    code: (state) => ({
      attrs: [
        a("appearance", s(state, "appearance")),
        a("layout", s(state, "layout")),
        a("filter", b(state, "filter")),
        a("suggestionDelay", n(state, "suggestionDelay")),
        a("label", s(state, "label")),
        a("placeholder", s(state, "placeholder")),
        { name: "suggestions", raw: "suggestions" },
        a("suggestionsLabel", l("Suggerimenti")),
      ],
      ...snippets(SUGGESTIONS, "suggestions"),
    }),
  },
  {
    tag: "bolle-date-picker",
    title: "Date picker",
    group: "Date & time pickers",
    summary: m("Data singola o intervallo, con selettore modale o calendario docked."),
    controls: [
      en("variant", m("Variante"), ["modal", "docked"], "modal"),
      en("selectionMode", m("Selezione"), ["single", "range"], "single"),
      en("weekStartsOn", m("Inizio settimana"), ["1", "0"], "1"),
      en("locale", m("Lingua"), ["it", "en", "fr", "zh"], "it"),
      tx("label", m("Etichetta"), m("Data appuntamento")),
      tx("value", m("Data iniziale"), "2026-11-11"),
      tx("endValue", m("Data finale"), "2026-11-20"),
      fl("required", m("Obbligatorio"), false),
      fl("disabled", m("Disabilitato"), false),
    ],
    render: (state) => html`<bolle-date-picker
      .variant=${s(state, "variant")}
      .selectionMode=${s(state, "selectionMode")}
      .weekStartsOn=${Number(s(state, "weekStartsOn"))}
      .locale=${s(state, "locale")}
      .label=${s(state, "label")}
      .value=${s(state, "value")}
      .endValue=${s(state, "endValue")}
      ?required=${b(state, "required")}
      ?disabled=${b(state, "disabled")}
    ></bolle-date-picker>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("selectionMode", s(state, "selectionMode")),
        a("weekStartsOn", Number(s(state, "weekStartsOn"))),
        a("locale", s(state, "locale")),
        a("label", s(state, "label")),
        a("value", s(state, "value")),
        a("endValue", s(state, "selectionMode") === "range" ? s(state, "endValue") : ""),
        a("required", b(state, "required")),
        a("disabled", b(state, "disabled")),
      ],
    }),
  },
  {
    tag: "bolle-time-picker",
    title: "Time picker",
    group: "Date & time pickers",
    summary: m("Ora con quadrante o inserimento numerico, ciclo 12 o 24 ore."),
    controls: [
      en("variant", m("Variante"), ["dial", "input"], "dial"),
      en("hourCycle", m("Ciclo orario"), ["24", "12"], "24"),
      en("locale", m("Lingua"), ["it", "en", "fr", "zh"], "it"),
      tx("label", m("Etichetta"), m("Ora promemoria")),
      tx("value", m("Valore"), "09:30"),
      fl("required", m("Obbligatorio"), false),
      fl("disabled", m("Disabilitato"), false),
    ],
    render: (state) => html`<bolle-time-picker
      .variant=${s(state, "variant")}
      .hourCycle=${Number(s(state, "hourCycle"))}
      .locale=${s(state, "locale")}
      .label=${s(state, "label")}
      .value=${s(state, "value")}
      ?required=${b(state, "required")}
      ?disabled=${b(state, "disabled")}
    ></bolle-time-picker>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("hourCycle", Number(s(state, "hourCycle"))),
        a("locale", s(state, "locale")),
        a("label", s(state, "label")),
        a("value", s(state, "value")),
        a("required", b(state, "required")),
        a("disabled", b(state, "disabled")),
      ],
    }),
  },
  {
    tag: "bolle-menu",
    title: "Menu",
    group: "Menus",
    summary: m("Menu baseline o verticale, con gruppi, sottomenu e selezione."),
    note: m(
      "Vibrant è disponibile solo con menu verticale. Il menu si apre con show(anchor). tail=\"none\" disegna il menu senza coda, con i quattro angoli uguali.",
    ),
    controls: [
      en("variant", m("Variante"), ["vertical", "baseline"], "vertical"),
      en("colorScheme", m("Schema colore"), ["standard", "vibrant"], "standard"),
      en("selectionMode", m("Selezione"), ["none", "single", "multi"], "none"),
      fl("quick", m("Senza animazione"), false),
      rg("density", m("Densità"), -3, 1, 0),
      fl("inactive", m("Inattivo"), false),
      en("tail", m("Coda"), ["auto", "none"], "auto"),
      tx("menuLabel", m("Etichetta accessibile"), m("Azioni documento")),
    ],
    render: (state, ctx) => html`
      <bolle-button
        variant="tonal"
        haspopup="menu"
        @click=${(event: Event) => ctx.show("pv-menu", event)}
        >${l("Azioni")}</bolle-button
      >
      <bolle-menu
        id="pv-menu"
        .variant=${s(state, "variant")}
        .colorScheme=${s(state, "variant") === "baseline" ? "standard" : s(state, "colorScheme")}
        .selectionMode=${s(state, "selectionMode")}
        ?quick=${b(state, "quick")}
        .density=${n(state, "density")}
        ?inactive=${b(state, "inactive")}
        .tail=${s(state, "tail")}
        .menuLabel=${s(state, "menuLabel")}
        .items=${menuEntries(s(state, "selectionMode"))}
      ></bolle-menu>
    `,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("colorScheme", s(state, "variant") === "baseline" ? "standard" : s(state, "colorScheme")),
        a("selectionMode", s(state, "selectionMode")),
        a("quick", b(state, "quick")),
        a("density", n(state, "density")),
        a("inactive", b(state, "inactive")),
        a("tail", s(state, "tail") === "auto" ? undefined : s(state, "tail")),
        a("menuLabel", s(state, "menuLabel")),
        { name: "items", raw: "items" },
      ],
      ...snippets(menuEntries(s(state, "selectionMode"))),
    }),
  },
  {
    tag: "bolle-fab-menu",
    title: "FAB menu",
    group: "Buttons",
    summary: m("Da due a sei azioni correlate aperte da un FAB."),
    controls: [
      en(
        "color",
        m("Set colore"),
        ["primary", "secondary", "tertiary"],
        "primary",
      ),
      en("tail", m("Coda"), ["auto", "none"], "auto"),
      tx("label", m("Etichetta accessibile"), m("Crea")),
    ],
    render: (state) =>
      html`<bolle-fab-menu
        .color=${s(state, "color")}
        .tail=${s(state, "tail")}
        .label=${s(state, "label")}
        .items=${navItems()}
      >
        <span slot="icon" aria-hidden="true">${ti("plus")}</span>
      </bolle-fab-menu>`,
    code: (state) => ({
      attrs: [
        a("color", s(state, "color")),
        a("tail", s(state, "tail") === "auto" ? undefined : s(state, "tail")),
        a("label", s(state, "label")),
        { name: "items", raw: "items" },
      ],
      content: '<span slot="icon" aria-hidden="true">add</span>',
      ...snippets(iconCode()),
    }),
  },
  {
    tag: "bolle-split-button",
    title: "Split button",
    group: "Buttons",
    summary: m("Azione principale affiancata da un menu di azioni alternative."),
    controls: [
      en("variant", m("Variante"), ["filled", "tonal", "outlined", "elevated"], "filled"),
      en("size", m("Dimensione"), ["xs", "small", "medium", "large", "xl"], "small"),
      fl("icon", m("Icona iniziale"), false),
      fl("disabled", m("Disabilitato"), false),
      tx("label", m("Etichetta"), m("Invia")),
      tx("menuLabel", m("Etichetta menu"), m("Altre opzioni")),
    ],
    render: (state) => html`<bolle-split-button
      .variant=${s(state, "variant")}
      .size=${s(state, "size")}
      ?icon=${b(state, "icon")}
      ?disabled=${b(state, "disabled")}
      .label=${s(state, "label")}
      .menuLabel=${s(state, "menuLabel")}
      .items=${splitItems()}
      >${b(state, "icon")
        ? html`<span slot="icon" aria-hidden="true">${ti("plane")}</span>`
        : nothing}</bolle-split-button
    >`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("size", s(state, "size")),
        a("icon", b(state, "icon")),
        a("disabled", b(state, "disabled")),
        a("label", s(state, "label")),
        a("menuLabel", s(state, "menuLabel")),
        { name: "items", raw: "items" },
      ],
      content: b(state, "icon")
        ? '<span slot="icon" aria-hidden="true">plane</span>'
        : undefined,
      ...snippets(splitItems()),
    }),
  },
  {
    tag: "bolle-select",
    title: "Select",
    group: "HTML controls",
    summary:
      m("Scelta singola su option e optgroup native, con menu Material, stato di errore e campo filled o outlined."),
    controls: [
      en("variant", m("Variante"), ["filled", "outlined"], "filled"),
      fl("error", m("Errore"), false),
      fl("required", m("Obbligatorio"), false),
      fl("disabled", m("Disabilitato"), false),
      tx("label", m("Etichetta"), m("Regione")),
      tx("placeholder", m("Segnaposto"), m("Scegli una regione")),
      tx("value", m("Valore"), "lazio"),
      tx(
        "supportingText",
        m("Testo di supporto"),
        m("Determina il fuso orario della spedizione."),
      ),
    ],
    render: (state) => html`<bolle-select
      .variant=${s(state, "variant")}
      ?error=${b(state, "error")}
      ?required=${b(state, "required")}
      ?disabled=${b(state, "disabled")}
      .label=${s(state, "label")}
      .placeholder=${s(state, "placeholder")}
      .value=${s(state, "value")}
      .supportingText=${s(state, "supportingText")}
    >
      <optgroup label=${l("Nord")}>
        <option value="lombardia">Lombardia</option>
        <option value="veneto">Veneto</option>
      </optgroup>
      <optgroup label=${l("Centro")}>
        <option value="lazio">Lazio</option>
        <option value="toscana">Toscana</option>
      </optgroup>
      <option value="sicilia" disabled>${l("{region} (non disponibile)", { region: "Sicilia" })}</option>
    </bolle-select>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("error", b(state, "error")),
        a("required", b(state, "required")),
        a("disabled", b(state, "disabled")),
        a("label", s(state, "label")),
        a("placeholder", s(state, "placeholder")),
        a("value", s(state, "value")),
        a("supportingText", s(state, "supportingText")),
      ],
      content: `<optgroup label="${l("Nord")}">
  <option value="lombardia">Lombardia</option>
  <option value="veneto">Veneto</option>
</optgroup>
<optgroup label="${l("Centro")}">
  <option value="lazio">Lazio</option>
  <option value="toscana">Toscana</option>
</optgroup>
<option value="sicilia" disabled>${l("{region} (non disponibile)", { region: "Sicilia" })}</option>`,
    }),
  },
  {
    tag: "bolle-autocomplete",
    title: "Autocomplete",
    group: "HTML controls",
    summary:
      m("Campo di testo con suggerimenti da option native, filtro durante la digitazione e ruolo combobox."),
    controls: [
      en("variant", m("Variante"), ["filled", "outlined"], "filled"),
      fl("error", m("Errore"), false),
      fl("required", m("Obbligatorio"), false),
      fl("readonly", m("Sola lettura"), false),
      fl("disabled", m("Disabilitato"), false),
      tx("label", m("Etichetta"), m("Città di consegna")),
      tx("placeholder", m("Segnaposto"), m("Scrivi una città")),
      tx("value", m("Valore"), ""),
      tx(
        "supportingText",
        m("Testo di supporto"),
        m("Suggerimenti fra le città servite."),
      ),
    ],
    render: (state) => html`<bolle-autocomplete
      .variant=${s(state, "variant")}
      ?error=${b(state, "error")}
      ?required=${b(state, "required")}
      ?readonly=${b(state, "readonly")}
      ?disabled=${b(state, "disabled")}
      .label=${s(state, "label")}
      .placeholder=${s(state, "placeholder")}
      .value=${s(state, "value")}
      .supportingText=${s(state, "supportingText")}
    >
      ${CITY_OPTIONS.map(
        (city) => html`<option value=${city}></option>`,
      )}
    </bolle-autocomplete>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("error", b(state, "error")),
        a("required", b(state, "required")),
        a("readonly", b(state, "readonly")),
        a("disabled", b(state, "disabled")),
        a("label", s(state, "label")),
        a("placeholder", s(state, "placeholder")),
        a("value", s(state, "value")),
        a("supportingText", s(state, "supportingText")),
      ],
      content: CITY_OPTIONS.map((city) => `<option value="${city}"></option>`).join(
        "\n",
      ),
    }),
  },
  {
    tag: "bolle-sidebar",
    title: "Sidebar",
    group: "Sidebar",
    section: "Schiuma",
    summary: m(
      "Navigazione di un'applicazione gestionale: albero fino a tre livelli, filtro, contatori, rail compatta e larghezza regolabile.",
    ),
    note: m(
      "Le voci troppo lunghe finiscono con i puntini e mostrano il testo intero in un tooltip. Nella rail i gruppi si aprono in un menu accanto.",
    ),
    controls: [
      en("variant", m("Variante"), ["edge", "card"], "edge"),
      en("search", m("Ricerca"), ["field", "contained", "divided", "none"], "field"),
      fl("collapsed", m("Compressa"), false),
      rg("width", m("Larghezza"), 220, 480, 300, 4),
      tx("label", m("Etichetta"), m("Navigazione principale")),
      tx("header", m("Intestazione"), "Cantieri Rossi"),
    ],
    render: (state) =>
      html`<bolle-sidebar
        .variant=${s(state, "variant")}
        .search=${s(state, "search")}
        ?collapsed=${b(state, "collapsed")}
        .width=${n(state, "width")}
        .label=${s(state, "label")}
        .items=${sidebarItems()}
        current="jobs/active/plants"
      >
        <span slot="header">${s(state, "header")}</span>
      </bolle-sidebar>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("search", s(state, "search")),
        a("collapsed", b(state, "collapsed")),
        a("width", n(state, "width")),
        a("label", s(state, "label")),
        { name: "items", raw: "items" },
        a("current", "jobs/active/plants"),
      ],
      content: `<span slot="header">${s(state, "header")}</span>`,
      ...snippets(sidebarCode()),
    }),
  },
  {
    tag: "bolle-app-shell",
    title: "App shell",
    group: "App shell",
    section: "Schiuma",
    summary: m(
      "Regioni di un'applicazione gestionale: barra superiore, navigazione, contenuto, pannello secondario e barra di stato, con la forma che cambia secondo la larghezza.",
    ),
    note: m(
      "L'applicazione riempie gli slot, la shell decide la forma misurando la propria larghezza: sotto 840px la navigazione passa sotto il contenuto e il pannello diventa un foglio, oltre 1240px la navigazione resta estesa. Allargando la finestra l'anteprima passa da sola alla forma più ampia.",
    ),
    controls: [
      en("form", m("Forma"), ["auto", "medium", "compact"], "auto"),
      en("density", m("Densità"), ["comfortable", "compact"], "comfortable"),
      fl("supportingOpen", m("Pannello secondario"), false),
      tx("label", m("Etichetta"), m("Applicazione")),
    ],
    render: (state) =>
      html`<demo-app-shell
        .form=${s(state, "form")}
        .density=${s(state, "density")}
        ?supportingOpen=${b(state, "supportingOpen")}
        .label=${s(state, "label")}
      ></demo-app-shell>`,
    code: (state) => ({
      attrs: [
        a("form", s(state, "form")),
        a("label", s(state, "label")),
        a("supporting-open", b(state, "supportingOpen")),
        a("supporting-label", l(m("Commessa"))),
      ],
      content: `<bolle-app-bar slot="bar" variant="small">…</bolle-app-bar>
<bolle-sidebar slot="navigation" …></bolle-sidebar>
<div>…</div>
<div slot="supporting">…</div>
<p slot="status">…</p>
<bolle-navigation-bar slot="bottom-bar" …></bolle-navigation-bar>`,
    }),
  },
  {
    tag: "bolle-dashboard",
    title: "Dashboard",
    group: "Dashboard",
    section: "Schiuma",
    summary: m(
      "Griglia a dodici colonne di riquadri: ampiezza, ordine, ridimensionamento e riordino, con il layout che resta all'applicazione.",
    ),
    note: m(
      "Ogni riquadro dichiara la propria ampiezza con span e un minimo con min-span. Il riquadro si sposta trascinando la maniglia, con Alt e le frecce o dal menu, e si allarga trascinando l'angolo o con le frecce. Ogni modifica arriva con layout-change.",
    ),
    controls: [
      en("density", m("Densità"), ["comfortable", "compact"], "comfortable"),
      rg("columns", m("Colonne"), 6, 12, 12, 1),
      tx("label", m("Etichetta"), m("Riquadri del cruscotto")),
    ],
    render: (state) =>
      html`<demo-dashboard
        .density=${s(state, "density")}
        .columns=${n(state, "columns")}
        .label=${s(state, "label")}
      ></demo-dashboard>`,
    code: (state) => ({
      attrs: [
        a("density", s(state, "density")),
        a("columns", n(state, "columns")),
        a("label", s(state, "label")),
      ],
      content: `<bolle-widget id="late" title="${l(m("Lavori in ritardo"))}" span="8" min-span="4">…</bolle-widget>
<bolle-widget id="sites" title="${l(m("Avanzamento cantieri"))}" span="4" min-span="3">…</bolle-widget>`,
    }),
  },
  {
    tag: "bolle-kanban",
    title: "Kanban",
    group: "Kanban",
    section: "Schiuma",
    summary: m(
      "Board a colonne di schede: spostamento tra colonne e riordino, corsie, colonne comprimibili, limiti WIP segnalati e stato di carico, errore e board vuota.",
    ),
    note: m(
      "La board non decide dove può andare una scheda: chiede con card-move e ascolta il rifiuto con card-move-blocked, applicando la regola che l'applicazione passa in restrict. Lo scorrimento verticale è della colonna, non della board; il trascinamento ha la copia che segue il puntatore, il segnaposto e lo scorrimento automatico ai bordi. La scheda si sposta anche con Alt e le frecce dalla maniglia.",
    ),
    controls: [
      en("density", m("Densità"), ["comfortable", "compact"], "comfortable"),
      fl("lanes", m("Corsie"), false),
      fl("collapsible", m("Colonne comprimibili"), true),
      fl("addable", m("Aggiunta rapida"), true),
      fl("movable", m("Trascinamento"), true),
      tx("label", m("Etichetta"), m("Commesse")),
    ],
    render: (state) =>
      html`<demo-kanban
        .density=${s(state, "density")}
        ?lanes=${b(state, "lanes")}
        ?collapsible=${b(state, "collapsible")}
        ?addable=${b(state, "addable")}
        ?movable=${b(state, "movable")}
        .label=${s(state, "label")}
      ></demo-kanban>`,
    code: (state) => ({
      attrs: [
        a("label", s(state, "label")),
        a("density", s(state, "density")),
        ...(b(state, "lanes") ? [a("lanes", true)] : []),
        ...(b(state, "collapsible") ? [] : [a("collapsible", false)]),
        ...(b(state, "addable") ? [] : [a("addable", false)]),
        ...(b(state, "movable") ? [] : [a("movable", false)]),
        { name: "columns", raw: "columns" },
        { name: "cards", raw: "cards" },
        { name: "card", raw: "renderCard" },
        { name: "restrict", raw: "restrict" },
      ],
      vuePreamble: [
        `const columns = [
  { id: "programmato", label: "${l(m("Programmato"))}" },
  { id: "in-corso", label: "${l(m("In corso"))}", wip: 5 },
  { id: "collaudo", label: "${l(m("Collaudo"))}", wip: 3 },
  { id: "chiuso", label: "${l(m("Chiuso"))}" },
]`,
        `const cards = ref(jobs.map((job) => ({ id: job.id, column: job.phase, title: job.title })))`,
        `const renderCard = (card) => html\`<p>\${card.title}</p>\``,
        `const restrict = (card, column) =>
  column.id === "chiuso" && card.progress < 100
    ? "${l(m("Per passare in Chiuso l'avanzamento deve essere al 100%."))}"
    : undefined`,
      ],
      reactPreamble: [
        `const columns = [
  { id: "programmato", label: "${l(m("Programmato"))}" },
  { id: "in-corso", label: "${l(m("In corso"))}", wip: 5 },
  { id: "collaudo", label: "${l(m("Collaudo"))}", wip: 3 },
  { id: "chiuso", label: "${l(m("Chiuso"))}" },
]`,
        `const [cards, setCards] = useState(jobs.map((job) => ({ id: job.id, column: job.phase, title: job.title })))`,
        `const renderCard = (card) => <p>{card.title}</p>`,
        `const restrict = (card, column) =>
  column.id === "chiuso" && card.progress < 100
    ? "${l(m("Per passare in Chiuso l'avanzamento deve essere al 100%."))}"
    : undefined`,
      ],
      content: undefined,
    }),
  },
  {
    tag: "bolle-data-table",
    title: "Data table",
    group: "Data table",
    section: "Schiuma",
    summary: m(
      "Elenco di righe con colonne dichiarate dall'applicazione: ordinamento anche multiplo, gruppi, pagine, selezione, dettaglio della riga e colonne regolabili.",
    ),
    note: m(
      "La tabella non tocca i dati: ordina, pagina, raggruppa e seleziona solo su richiesta dell'applicazione, che ascolta gli eventi. L'intestazione resta ferma, le colonne fissate restano visibili mentre scorri e le righe si aprono con un dettaglio.",
    ),
    controls: [
      en("variant", m("Variante"), ["card", "free"], "card"),
      en("density", m("Densità"), ["comfortable", "compact"], "comfortable"),
      fl("selectable", m("Selezione"), true),
      fl("expandable", m("Dettaglio riga"), true),
      en("groupBy", m("Raggruppa per"), ["", "client", "city", "status", "manager"], ""),
      rg("pageSize", m("Righe per pagina"), 0, 25, 8, 1),
      fl("virtual", m("Scorrimento continuo"), false),
      tx("label", m("Etichetta"), m("Commesse")),
    ],
    render: (state) =>
      html`<demo-data-table
        .variant=${s(state, "variant")}
        .density=${s(state, "density")}
        ?selectable=${b(state, "selectable")}
        ?expandable=${b(state, "expandable")}
        .groupBy=${s(state, "groupBy")}
        .pageSize=${n(state, "pageSize")}
        ?virtual=${b(state, "virtual")}
        .label=${s(state, "label")}
      ></demo-data-table>`,
    code: (state) => ({
      attrs: [
        a("variant", s(state, "variant")),
        a("density", s(state, "density")),
        a("selectable", b(state, "selectable")),
        a("expandable", b(state, "expandable")),
        ...(s(state, "groupBy") ? [a("group-by", s(state, "groupBy"))] : []),
        a("page-size", n(state, "pageSize")),
        ...(b(state, "virtual") ? [a("virtual", true)] : []),
        a("label", s(state, "label")),
        { name: "columns", raw: "columns" },
        { name: "rows", raw: "rows" },
      ],
      vuePreamble: [
        `const columns = [
  { key: "code", label: "${l(m("Codice"))}", width: 136, pinned: true },
  { key: "title", label: "${l(m("Commessa"))}", width: 300 },
  { key: "client", label: "${l(m("Cliente"))}", width: 220, groupable: true },
  { key: "amount", label: "${l(m("Importo"))}", width: 140, align: "end" },
]`,
        `const rows = jobs.map((job) => ({ ...job }))`,
      ],
      reactPreamble: [
        `const columns = [
  { key: "code", label: "${l(m("Codice"))}", width: 136, pinned: true },
  { key: "title", label: "${l(m("Commessa"))}", width: 300 },
  { key: "client", label: "${l(m("Cliente"))}", width: 220, groupable: true },
  { key: "amount", label: "${l(m("Importo"))}", width: 140, align: "end" },
]`,
        `const rows = jobs.map((job) => ({ ...job }))`,
      ],
      content: undefined,
    }),
  },
];

export const groups: Group[] = [
  "App bars",
  "App shell",
  "Avatars",
  "Badges",
  "Buttons",
  "Cards",
  "Carousel",
  "Data table",
  "Checkbox",
  "Dashboard",
  "Chips",
  "Date & time pickers",
  "Dialogs",
  "Divider",
  "Empty states",
  "HTML controls",
  "Kanban",
  "Lists",
  "Loading indicator",
  "Menus",
  "Navigation bar",
  "Navigation drawer",
  "Navigation rail",
  "Pagination",
  "Progress indicators",
  "Radio button",
  "Search",
  "Sheets",
  "Sidebar",
  "Sliders",
  "Snackbar",
  "Switch",
  "Tabs",
  "Text fields",
  "Toolbars",
  "Tooltips",
];

export const entryByTag = (tag: string) =>
  entries.find((entry) => entry.tag === tag);

export const initialState = (entry: Entry): State =>
  Object.fromEntries(
    entry.controls.map((control) => [
      control.prop,
      control.kind === "text" || control.kind === "longtext"
        ? l(control.default)
        : control.prop === "locale"
          ? libraryLocale()
          : control.default,
    ]),
  );

export { MENU_GROUPS, menuEntries, SPLIT_ITEMS, SUGGESTIONS, TAB_CODE, tabItems, navItems, listItems, LIST_CODE, ICON_ITEMS, sixItems, snippets };
export type { MenuEntry };
