import readme from "../README.md?raw";
import anatomy from "./component-anatomy.json";
import { l } from "./i18n.js";

export interface ApiRow {
  name: string;
  /** Attribute name, or empty when the property is JavaScript-only. */
  attribute: string;
  type: string;
  defaultValue: string;
  reflects: boolean;
}

export interface SupportInfo {
  support: string[];
  limits: string[];
}

export interface ComponentSurface {
  slots: string[];
  parts: string[];
}

interface DeclaredProperty {
  attribute?: boolean | string;
  type?: { name?: string };
  reflect?: boolean;
  state?: boolean;
}

function formatDefault(value: unknown): string {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "string") return `"${value}"`;
  if (Array.isArray(value)) return value.length === 0 ? "[]" : "[…]";
  if (typeof value === "object") return "{…}";
  return String(value);
}

function inferType(declared: DeclaredProperty, value: unknown): string {
  const name = declared.type?.name;
  if (name) return name.toLowerCase();
  if (Array.isArray(value)) return "array";
  if (value !== null && typeof value === "object") return "object";
  if (typeof value === "boolean" || typeof value === "number")
    return typeof value;
  return "string";
}

const apiCache = new Map<string, ApiRow[]>();

/** Public reactive properties declared by the Lit class registered for `tag`. */
export function componentApi(tag: string): ApiRow[] {
  const cached = apiCache.get(tag);
  if (cached) return cached;
  const ctor = customElements.get(tag) as
    | (CustomElementConstructor & {
        elementProperties?: Map<PropertyKey, DeclaredProperty>;
      })
    | undefined;
  if (!ctor?.elementProperties) return [];
  const sample = document.createElement(tag) as unknown as Record<
    string,
    unknown
  >;
  const rows: ApiRow[] = [];
  for (const [key, declared] of ctor.elementProperties) {
    if (typeof key !== "string" || key.startsWith("_") || declared.state)
      continue;
    const value = sample[key];
    const attribute =
      declared.attribute === false
        ? ""
        : typeof declared.attribute === "string"
          ? declared.attribute
          : key.toLowerCase();
    rows.push({
      name: key,
      attribute,
      type: inferType(declared, value),
      defaultValue: formatDefault(value),
      reflects: Boolean(declared.reflect),
    });
  }
  rows.sort((left, right) => left.name.localeCompare(right.name));
  apiCache.set(tag, rows);
  return rows;
}

const surfaceCache = new Map<string, ComponentSurface>();

/** Public slots and CSS parts extracted from the component class hierarchy. */
export function componentSurface(tag: string): ComponentSurface {
  const cached = surfaceCache.get(tag);
  if (cached) return cached;
  const ctor = customElements.get(tag);
  const result = anatomy[ctor?.name as keyof typeof anatomy] ?? {
    slots: [],
    parts: [],
  };
  surfaceCache.set(tag, result);
  return result;
}

const splitClauses = (cell: string) =>
  cell
    .split(/;\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));

const supportByTag = new Map<string, SupportInfo>();
for (const line of readme.split("\n")) {
  if (!line.startsWith("|")) continue;
  const cells = line.split("|").map((cell) => cell.trim());
  const tag = /^`(bolle-[a-z-]+)`$/.exec(cells[2] ?? "")?.[1];
  if (!tag || supportByTag.has(tag)) continue;
  supportByTag.set(tag, {
    support: splitClauses(cells[3] ?? ""),
    limits: splitClauses(cells[4] ?? ""),
  });
}

/** "Support" and "Open limits" columns of the README component catalogue. */
export const componentSupport = (tag: string): SupportInfo | undefined =>
  supportByTag.get(tag);

export interface PageMarkdown {
  title: string;
  tag: string;
  group: string;
  summary: string;
  code: string;
  codeLanguage: string;
  api: ApiRow[];
  surface?: ComponentSurface;
  support?: SupportInfo;
  recipes?: Array<{
    title: string;
    description: string;
    code: Record<string, string>;
  }>;
  /** True when the component exposes refresh() and takes its rows as an array. */
  dataContract?: boolean;
  sortsAndPages?: boolean;
}

/** Self-contained Markdown of a component page, for pasting into notes or an LLM. */
export function pageMarkdown(page: PageMarkdown): string {
  const lines = [
    `# ${page.title}`,
    "",
    `\`<${page.tag}>\` · ${page.group}`,
    "",
    page.summary,
    "",
    l("## Esempio"),
    "",
    "```" + page.codeLanguage,
    page.code,
    "```",
  ];
  if (page.recipes?.length) {
    lines.push("", l("## Uso nel codice"));
    for (const recipe of page.recipes) {
      lines.push("", `### ${l(recipe.title)}`, "", l(recipe.description));
      for (const [lang, code] of Object.entries(recipe.code))
        lines.push("", `#### ${lang}`, "", "```" + lang, code, "```");
    }
  }
  if (page.dataContract) {
    lines.push(
      "",
      l("## Aggiornamento dei dati"),
      "",
      l(
        "Il componente ridisegna quando riceve una nuova proprietà. Non osserva le mutazioni interne all'array: un valore riassegnato con lo stesso riferimento non produce aggiornamenti.",
      ),
      "",
      `- \`table.rows = altroArray\`: ${l("ridisegna")}.`,
      `- \`rows.sort(); table.rows = rows\`: ${l("non ridisegna, il riferimento è lo stesso")}.`,
      `- \`rows.sort(); table.refresh()\`: ${l("ridisegna con i dati mutati")}.`,
    );
    if (page.sortsAndPages) {
      lines.push(
        "",
        "### " + l("Ordinamento e paginazione"),
        "",
        l(
          "La tabella ordina e pagina le righe che riceve: un clic sull'intestazione va prima crescente e poi decrescente, e page-size da solo accende il pager.",
        ),
        "",
        `- \`table.sortHandler = (richiesta) => …\`: ${l("riceve l'ordine, la tabella ridisegna dopo la promessa")}.`,
        `- \`table.pageHandler = (richiesta) => …\`: ${l("riceve pagina e dimensione, la tabella ridisegna dopo la promessa")}.`,
        `- \`table.sort = [{ key, dir }]\`: ${l("fissa l'ordine iniziale")}.`,
        `- \`table.selected = [id]\`: ${l("la tabella applica selezione, apertura riga, raggruppamento e cambi di colonna da sé: gli eventi li riportano soltanto")}.`,
        `- \`table.columnHandler = (elenco) => …\`: ${l("riceve l'elenco delle colonne dopo ogni modifica, per conservarlo altrove")}.`,
      );
    }
  }
  if (page.api.length > 0) {
    lines.push(
      "",
      "## API",
      "",
      l("| Proprietà | Attributo | Tipo | Default | Riflessa |"),
      "| --- | --- | --- | --- | --- |",
      ...page.api.map(
        (row) =>
          `| \`${row.name}\` | ${row.attribute ? `\`${row.attribute}\`` : l("solo JS")} | ${row.type} | ${row.defaultValue} | ${row.reflects ? l("sì") : l("no")} |`,
      ),
    );
  }
  if (page.surface?.slots.length || page.surface?.parts.length) {
    lines.push("", l("## Anatomia pubblica"));
    if (page.tag === "bolle-data-table") {
      lines.push(
        "",
        l(
          "Il componente chiama le funzioni dell'applicazione: column.render per ogni cella, rowRenderer per l'intera riga, detail per la riga aperta, groupSummary per gruppo. Gli slot coprono solo le aree esterne.",
        ),
        "",
        `${l("Slot")}: ${page.surface.slots.map((slot) => `\`${slot}\``).join(", ")}`,
        "",
        l("Esempio di renderer di cella"),
        "",
        "```ts",
        `const columns = [
  {
    key: "status",
    label: "Stato",
    render: (row) => badgeFor(String(row.status)),
  },
];`,
        "```",
      );
      if (page.surface.parts.length)
        lines.push(
          "",
          `${l("CSS part")}: ${page.surface.parts.map((part) => `\`${part}\``).join(", ")}`,
        );
    } else if (page.surface.slots.length)
      lines.push(
        "",
        `${l("Slot")}: ${page.surface.slots.map((slot) => `\`${slot}\``).join(", ")}`,
        "",
        l(
          "I segnaposto hanno questo significato: {rowId} è il valore di rowKey, {columnKey} è il campo key della colonna, {groupName} è il valore del gruppo e {id} è l'identificatore dell'elemento.",
        ),
      );
    else if (page.tag !== "bolle-data-table" && page.surface.parts.length)
      lines.push(
        "",
        `${l("CSS part")}: ${page.surface.parts.map((part) => `\`${part}\``).join(", ")}`,
      );
  }
  if (page.support) {
    lines.push(
      "",
      l("## Supporto"),
      "",
      ...page.support.support.map((item) => `- ${item}`),
    );
    lines.push(
      "",
      l("## Limiti aperti"),
      "",
      ...page.support.limits.map((item) => `- ${item}`),
    );
  }
  return `${lines.join("\n")}\n`;
}
