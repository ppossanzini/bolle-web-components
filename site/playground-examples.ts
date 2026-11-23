import type { ExamplePanels } from "./codepen.js";

/**
 * Runnable examples for the HTML + JavaScript recipes. Each one carries its own
 * rows, so it runs in the playground and in CodePen without the documentation page.
 */
const ROWS = `const rows = [
  { id: "job-1", code: "C-2026-1001", client: "Comune di Bergamo", status: "In corso", amount: 148000 },
  { id: "job-2", code: "C-2026-1002", client: "Hotel Bellavista", status: "In ritardo", amount: 92000 },
  { id: "job-3", code: "C-2026-1003", client: "Immobiliare Lago", status: "In corso", amount: 61000 },
];`;

const COLUMNS = `const columns = [
  { key: "code", label: "Codice", width: 140, pinned: true },
  { key: "client", label: "Cliente", width: 240 },
  { key: "amount", label: "Importo", width: 140, align: "end" },
];`;

const TABLE = `<bolle-data-table id="jobs" label="Commesse" row-key="id"></bolle-data-table>`;

const PLAN = `<bolle-gantt
  id="plan"
  label="Piano di commessa"
  editable
  style="block-size: 380px"
></bolle-gantt>`;

const TASKS = `const tasks = [
  { id: "p-1", code: "C2026-1000", name: "Ristrutturazione scuola", start: "2026-09-07", end: "2027-03-12" },
  { id: "p-1-1", parent: "p-1", code: "C2026-1000.01", name: "Impianto elettrico", start: "2026-09-14", end: "2026-10-02", progress: 30, resource: "Giulia Ferraro" },
  { id: "p-1-2", parent: "p-1", code: "C2026-1000.02", name: "Cappotto termico", start: "2026-10-05", end: "2026-11-27", progress: 10, resource: "Marco Bellini" },
  { id: "p-2", code: "C2026-1001", name: "Palestra comunale", start: "2026-10-12", end: "2027-02-26", progress: 5 },
];`;
const importLine = `import "@bolle/web-components";`;

const TOUR_PAGE = `<div class="tour-page">
  <div class="tour-target" id="tour-filters">
    <bolle-search label="Cerca commesse" placeholder="Numero o cliente"></bolle-search>
  </div>
  <div class="tour-target" id="tour-chips">
    <bolle-chip label="In corso" variant="filter" selected></bolle-chip>
    <bolle-chip label="Archiviate"></bolle-chip>
  </div>
</div>
<bolle-button id="tour-start" variant="tonal">Rivedi il tour</bolle-button>
<bolle-tour id="tour" placement="auto"></bolle-tour>`;

export const PLAYGROUND_EXAMPLES: Record<string, ExamplePanels> = {
  "Tour dal JSON di configurazione": {
    title: "bolle-tour · tour dal JSON di configurazione",
    html: TOUR_PAGE,
    css: `.tour-page {
  display: grid;
  gap: 12px;
  margin-block-end: 12px;
}

.tour-target {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border-radius: var(--md-sys-shape-corner-medium);
  background: var(--md-sys-color-surface-container);
}`,
    js: `${importLine}
import { parseTourConfig, shouldStartTour } from "@bolle/web-components";

// The configuration the application would fetch from /tour.json.
const config = parseTourConfig(
  JSON.stringify({
    version: "2",
    steps: [
      {
        target: "#tour-filters",
        title: "Cerca una commessa",
        body: "Il numero o il nome del cliente bastano: la ricerca parte da qui.",
      },
      {
        target: "#tour-chips",
        title: "Filtra per stato",
        body: "In corso e archiviate sono due filtri che si sommano.",
        placement: "top",
      },
      {
        title: "Ci siamo",
        body: "Questo passo non ha un bersaglio: la scheda resta al centro.",
        actionLabel: "Apri il cruscotto",
      },
    ],
  }),
);

const tour = document.querySelector("#tour");
tour.steps = config.steps;
tour.placement = config.placement ?? "auto";

// The application owns the memory: it keeps the version it already showed.
if (shouldStartTour(config, localStorage.getItem("bolle-tour"))) tour.start();

document.querySelector("#tour-start").addEventListener("click", () => tour.start());

tour.addEventListener("finish", (event) => {
  if (event.detail.completed)
    localStorage.setItem("bolle-tour", config.version);
});`,
  },
  "Tabella minima": {
    title: "bolle-data-table · tabella minima",
    html: TABLE,
    css: "",
    js: `${importLine}

const table = document.querySelector("#jobs");

${COLUMNS}
${ROWS}

table.columns = columns;
table.rows = rows;`,
  },
  "Formattare i valori": {
    title: "bolle-data-table · formattare i valori",
    html: TABLE,
    css: "",
    js: `${importLine}

const table = document.querySelector("#jobs");
const euros = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });

${ROWS}

table.columns = [
  { key: "client", label: "Cliente", width: 240 },
  { key: "amount", label: "Importo", width: 140, align: "end", value: (row) => euros.format(row.amount) },
];

table.rows = rows;`,
  },
  "Cella personalizzata": {
    title: "bolle-data-table · cella personalizzata",
    html: TABLE,
    css: `.badge {
  padding: 2px 10px;
  border-radius: 12px;
  background: var(--md-sys-color-primary-container);
}
.badge.is-late {
  background: var(--md-sys-color-error-container);
}`,
    js: `${importLine}

const table = document.querySelector("#jobs");

${ROWS}

const badge = (text, isLate) => {
  const span = document.createElement("span");
  span.className = isLate ? "badge is-late" : "badge";
  span.textContent = text;
  return span;
};

table.columns = [
  { key: "code", label: "Codice", width: 140 },
  { key: "status", label: "Stato", width: 160, render: (row) => badge(row.status, row.status === "In ritardo") },
];

table.rows = rows;`,
  },
  "Ordinamento": {
    title: "bolle-data-table · ordinamento",
    html: TABLE,
    css: "",
    js: `${importLine}

const table = document.querySelector("#jobs");

${COLUMNS}
${ROWS}

table.columns = columns;
table.rows = rows;

// Un clic sull'intestazione ordina da sola: prima crescente, poi decrescente.
// sortHandler serve solo quando le righe arrivano dal server.`,
  },
  "Selezione delle righe": {
    title: "bolle-data-table · selezione",
    html: `<bolle-data-table id="jobs" label="Commesse" row-key="id" selectable></bolle-data-table>`,
    css: "",
    js: `${importLine}

const table = document.querySelector("#jobs");

${COLUMNS}
${ROWS}

table.columns = columns;
table.rows = rows;

// La tabella tiene la selezione da sé: l'evento serve per leggerla.
table.addEventListener("select", (event) => {
  console.log("Righe scelte:", event.detail.rows);
});`,
  },
  "Dettaglio della riga": {
    title: "bolle-data-table · dettaglio della riga",
    html: `<bolle-data-table id="jobs" label="Commesse" row-key="id" expandable></bolle-data-table>`,
    css: `.facts {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 4px 16px;
  margin: 0;
  padding: 16px;
}
.facts dt { color: var(--md-sys-color-on-surface-variant); }
.facts dd { margin: 0; }`,
    js: `${importLine}

const table = document.querySelector("#jobs");

${COLUMNS}
${ROWS}

table.columns = columns;
table.rows = rows;

table.detail = (row) => {
  const list = document.createElement("dl");
  list.className = "facts";
  list.innerHTML = \`<dt>Cliente</dt><dd>\${row.client}</dd><dt>Importo</dt><dd>\${row.amount} €</dd>\`;
  return list;
};

// La riga si apre e si chiude da sola: expand riporta solo quali sono aperte.
table.addEventListener("expand", (event) => {
  console.log("Righe aperte:", event.detail.expanded);
});`,
  },
  "Raggruppamento": {
    title: "bolle-data-table · raggruppamento",
    html: `<bolle-data-table id="jobs" label="Commesse" row-key="id" group-by="status"></bolle-data-table>`,
    css: "",
    js: `${importLine}

const table = document.querySelector("#jobs");

${ROWS}

table.columns = [
  { key: "code", label: "Codice", width: 140 },
  { key: "status", label: "Stato", width: 160, groupable: true },
  { key: "amount", label: "Importo", width: 140, align: "end" },
];

table.groupSummary = (list) =>
  list.length + " commesse · " + list.reduce((sum, row) => sum + row.amount, 0) + " €";

table.rows = rows;`,
  },
  "Paginazione": {
    title: "bolle-data-table · paginazione",
    html: `<bolle-data-table id="jobs" label="Commesse" row-key="id" page-size="10"></bolle-data-table>`,
    css: "",
    js: `${importLine}

const table = document.querySelector("#jobs");

const jobs = Array.from({ length: 26 }, (_, index) => ({
  id: "job-" + (index + 1),
  code: "C-2026-" + String(1000 + index),
  client: "Cliente " + (index + 1),
  amount: 10000 + index * 500,
}));

table.columns = [
  { key: "code", label: "Codice", width: 140 },
  { key: "client", label: "Cliente", width: 240 },
  { key: "amount", label: "Importo", width: 140, align: "end" },
];

// Con page-size la tabella pagina da sé le righe che ha già.
table.rows = jobs;`,
  },
  "Piano minimo": {
    title: "bolle-gantt · piano minimo",
    html: PLAN,
    css: "",
    js: `${importLine}

const plan = document.querySelector("#plan");

${TASKS}

plan.tasks = tasks;`,
  },
  "Spostare e ridimensionare": {
    title: "bolle-gantt · spostamento",
    html: PLAN,
    css: "",
    js: `${importLine}

const plan = document.querySelector("#plan");

${TASKS}

plan.tasks = tasks;

// Nessuno spostamento nel passato: il rifiuto arriva con task-change-blocked.
plan.restrict = ({ start }) =>
  start < "2026-09-01" ? "Non si sposta un'attività prima del 1 settembre 2026." : undefined;

// Il piano ha già applicato lo spostamento: qui lo si legge.
plan.addEventListener("task-change", (event) => {
  const { task, start, end } = event.detail;
  console.log(task.code, start, "→", end);
});

plan.addEventListener("task-select", (event) => {
  console.log("Attività scelta:", event.detail.task.code);
});`,
  },
  "Caricamento, errore e vuoto": {
    title: "bolle-data-table · stati",
    html: `<bolle-data-table
  id="jobs"
  label="Commesse"
  row-key="id"
  loading
  empty-label="Nessuna commessa per questo filtro"
>
  <bolle-button slot="empty" variant="filled">Crea commessa</bolle-button>
</bolle-data-table>

<p>
  <bolle-button id="ok">Carica i dati</bolle-button>
  <bolle-button id="fail" variant="outlined">Simula l'errore</bolle-button>
</p>`,
    css: "",
    js: `${importLine}

const table = document.querySelector("#jobs");

table.columns = [
  { key: "code", label: "Codice", width: 140 },
  { key: "client", label: "Cliente", width: 240 },
];

const load = async () => {
  table.loading = true;
  table.error = "";
  await new Promise((resolve) => setTimeout(resolve, 600));
  table.rows = [
    { id: "job-1", code: "C-2026-1001", client: "Comune di Bergamo" },
    { id: "job-2", code: "C-2026-1002", client: "Hotel Bellavista" },
  ];
  table.loading = false;
};

document.querySelector("#ok").addEventListener("click", load);

document.querySelector("#fail").addEventListener("click", () => {
  table.rows = [];
  table.error = "Il servizio non risponde.";
});

load();`,
  },
  "Colonne fisse, larghezze e visibilità": {
    title: "bolle-data-table · colonne",
    html: `<bolle-data-table
  id="jobs"
  label="Commesse"
  row-key="id"
  default-column-width="180"
  min-column-width="88"
  max-column-width="480"
></bolle-data-table>`,
    css: "",
    js: `${importLine}

const table = document.querySelector("#jobs");

${ROWS}

table.columns = [
  { key: "code", label: "Codice", width: 140, pinned: true },
  { key: "client", label: "Cliente", width: 260 },
  { key: "status", label: "Stato", width: 160 },
  { key: "notes", label: "Note", width: 320, hidden: true },
  { key: "amount", label: "Importo", width: 140, align: "end" },
];

table.rows = rows;`,
  },
  "Scorrimento continuo": {
    title: "bolle-data-table · scorrimento continuo",
    html: `<bolle-data-table id="jobs" label="Commesse" row-key="id" virtual style="block-size: 420px"></bolle-data-table>`,
    css: "",
    js: `${importLine}

const table = document.querySelector("#jobs");

const rows = Array.from({ length: 500 }, (_, index) => ({
  id: "job-" + (index + 1),
  code: "C-2026-" + String(1000 + index),
  client: "Cliente " + (index + 1),
  amount: 10000 + index * 100,
}));

table.rowHeight = 44;
table.columns = [
  { key: "code", label: "Codice", width: 140 },
  { key: "client", label: "Cliente", width: 240 },
  { key: "amount", label: "Importo", width: 140, align: "end" },
];
table.rows = rows;`,
  },
  "Stile tramite CSS part": {
    title: "bolle-data-table · CSS part",
    html: TABLE,
    css: `bolle-data-table::part(header-cell) {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

bolle-data-table::part(row-selected) {
  background: var(--md-sys-color-primary-container);
}

bolle-data-table::part(data-cell) {
  font-variant-numeric: tabular-nums;
}`,
    js: `${importLine}

const table = document.querySelector("#jobs");

${COLUMNS}
${ROWS}

table.columns = columns;
table.rows = rows;
table.selectable = true;
table.selected = ["job-2"];`,
  },
  "Pulsante con icona": {
    title: "bolle-button · pulsante con icona",
    html: `<bolle-button variant="filled">Salva la commessa</bolle-button>
<bolle-button variant="outlined">
  <span slot="icon" aria-hidden="true">★</span>
  Archivia
</bolle-button>
<bolle-button variant="text">Tutte le commesse</bolle-button>`,
    css: `bolle-button { margin: 0 8px 8px 0; }`,
    js: `${importLine}`,
  },
  "Pulsante a icona": {
    title: "bolle-icon-button · pulsante a icona",
    html: `<bolle-icon-button label="Cerca">
  <span slot="icon" aria-hidden="true">★</span>
</bolle-icon-button>
<bolle-icon-button variant="filled" label="Aggiungi">
  <span slot="icon" aria-hidden="true">+</span>
</bolle-icon-button>`,
    css: `bolle-icon-button { margin-inline-end: 8px; }`,
    js: `${importLine}`,
  },
  "Segnalazione su un elemento": {
    title: "bolle-badge · segnalazione",
    html: `<bolle-badge value="12">
  <bolle-icon-button label="Messaggi">
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-icon-button>
</bolle-badge>

<bolle-badge value="1200" max="99">
  <bolle-avatar name="Giulia Ferraro"></bolle-avatar>
</bolle-badge>`,
    css: `bolle-badge { margin-inline-end: 24px; }`,
    js: `${importLine}`,
  },
  "Avatar con immagine o iniziali": {
    title: "bolle-avatar · avatar",
    html: `<bolle-avatar name="Giulia Ferraro" status="online"></bolle-avatar>
<bolle-avatar name="Marco Bellini" size="lg"></bolle-avatar>
<bolle-avatar initials="SC" color="tertiary"></bolle-avatar>`,
    css: `bolle-avatar { margin-inline-end: 12px; }`,
    js: `${importLine}`,
  },
  "Gruppo di avatar": {
    title: "bolle-avatar-group · gruppo",
    html: `<bolle-avatar-group label="Partecipanti" max="3" total="8">
  <bolle-avatar name="Giulia Ferraro"></bolle-avatar>
  <bolle-avatar name="Marco Bellini"></bolle-avatar>
  <bolle-avatar name="Sara Colombo"></bolle-avatar>
</bolle-avatar-group>`,
    css: "",
    js: `${importLine}`,
  },
  "Percorso di navigazione": {
    title: "bolle-breadcrumb · percorso",
    html: `<bolle-breadcrumb id="percorso" label="Percorso"></bolle-breadcrumb>`,
    css: "",
    js: `${importLine}

const percorso = document.querySelector("#percorso");

percorso.items = [
  { label: "Home", href: "#" },
  { label: "Commesse", href: "#" },
  { label: "C2026-1000" },
];

percorso.addEventListener("breadcrumb-select", (event) => {
  console.log("Voce scelta:", event.detail.label);
});`,
  },
  "Stato vuoto con un comando": {
    title: "bolle-empty-state · stato vuoto",
    html: `<bolle-empty-state title="Nessuna commessa" text="Non ci sono commesse per questo filtro.">
  <bolle-button slot="actions" variant="filled">Crea commessa</bolle-button>
</bolle-empty-state>`,
    css: "",
    js: `${importLine}`,
  },
  "Pager sui dati presenti": {
    title: "bolle-pagination · pagine",
    html: `<bolle-pagination id="pager" label="Pagine" page-size="10"></bolle-pagination>`,
    css: "",
    js: `${importLine}

const pager = document.querySelector("#pager");
pager.total = 248;

pager.addEventListener("page-change", (event) => {
  const { page, pageSize } = event.detail;
  console.log("Pagina", page + 1, "di", Math.ceil(248 / pageSize));
});`,
  },
  "Casella con testo e supporto": {
    title: "bolle-checkbox · casella",
    html: `<bolle-checkbox name="urgente">Segna come urgente</bolle-checkbox>
<bolle-checkbox name="privacy" supporting-text="Serve per inviare la richiesta">
  Ho letto l'informativa
</bolle-checkbox>`,
    css: `bolle-checkbox { display: block; margin-block-end: 12px; }`,
    js: `${importLine}`,
  },
  "Interruttore": {
    title: "bolle-switch · interruttore",
    html: `<bolle-switch name="notifiche" checked>Notifiche attive</bolle-switch>`,
    css: "",
    js: `${importLine}

document.querySelector("bolle-switch").addEventListener("change", (event) => {
  console.log("Notifiche:", event.detail.checked);
});`,
  },
  "Gruppo di opzioni": {
    title: "bolle-radio-button · opzioni",
    html: `<bolle-radio-button name="priorita" value="alta" checked>Alta</bolle-radio-button>
<bolle-radio-button name="priorita" value="media">Media</bolle-radio-button>
<bolle-radio-button name="priorita" value="bassa">Bassa</bolle-radio-button>`,
    css: `bolle-radio-button { display: block; margin-block-end: 8px; }`,
    js: `${importLine}`,
  },
  "Pastiglia con icona e rimozione": {
    title: "bolle-chip · pastiglia",
    html: `<bolle-chip selected>Urgente</bolle-chip>
<bolle-chip removable>
  <bolle-avatar slot="avatar" name="Giulia Ferraro"></bolle-avatar>
  Cliente
</bolle-chip>`,
    css: `bolle-chip { margin-inline-end: 8px; }`,
    js: `${importLine}

document.querySelector("bolle-chip[removable]").addEventListener("remove", () => {
  console.log("Filtro tolto");
});`,
  },
  "Separatore fra gruppi": {
    title: "bolle-divider · separatore",
    html: `<p>Committenti</p>
<bolle-divider inset></bolle-divider>
<p>Fornitori</p>`,
    css: `p { margin: 8px 0; }`,
    js: `${importLine}`,
  },
  "Avanzamento lineare e circolare": {
    title: "bolle-progress-indicator · avanzamento",
    html: `<bolle-progress-indicator value="62" label="Avanzamento cantieri"></bolle-progress-indicator>
<p></p>
<bolle-progress-indicator value="30" variant="circular" label="Avanzamento"></bolle-progress-indicator>`,
    css: `p { margin: 16px 0; }`,
    js: `${importLine}`,
  },
  "Indicatore di caricamento": {
    title: "bolle-loading-indicator · caricamento",
    html: `<bolle-loading-indicator label="Caricamento delle commesse"></bolle-loading-indicator>`,
    css: "",
    js: `${importLine}`,
  },
  "Scheda con immagine e comandi": {
    title: "bolle-card · scheda",
    html: `<bolle-card variant="filled" style="max-inline-size: 340px">
  <h3>Ristrutturazione scuola</h3>
  <p>Consegna prevista a marzo 2027.</p>
  <bolle-button slot="actions" variant="text">Apri</bolle-button>
</bolle-card>`,
    css: `h3 { margin: 0 0 8px; }`,
    js: `${importLine}`,
  },
  "Elenco con icone e dettaglio": {
    title: "bolle-list · elenco",
    html: `<bolle-list label="Commesse" interactive selection="single">
  <bolle-list-item>
    <span slot="leading" aria-hidden="true">★</span>
    C2026-1000
    <span slot="supporting">Ristrutturazione scuola</span>
    <span slot="trailing">12</span>
  </bolle-list-item>
  <bolle-list-item>C2026-1001</bolle-list-item>
</bolle-list>`,
    css: "",
    js: `${importLine}

document.querySelector("bolle-list").addEventListener("change", (event) => {
  console.log("Voce scelta:", event.detail.value);
});`,
  },
  "Schede con pannelli": {
    title: "bolle-tabs · schede",
    html: `<bolle-tabs id="dettaglio" label="Dettaglio" value="note">
  <div slot="note">Note della commessa</div>
  <div slot="documenti">Documenti allegati</div>
</bolle-tabs>`,
    css: ``,
    js: `${importLine}

const dettaglio = document.querySelector("#dettaglio");
dettaglio.items = [
  { id: "note", label: "Note" },
  { id: "documenti", label: "Documenti", count: 3 },
];`,
  },
  "Cursore singolo": {
    title: "bolle-slider · cursore",
    html: `<bolle-slider id="avanzamento" label="Avanzamento" min="0" max="100" step="5" value="40"></bolle-slider>`,
    css: "",
    js: `${importLine}

document.querySelector("#avanzamento").addEventListener("change", (event) => {
  console.log("Avanzamento:", event.detail.value);
});`,
  },
  "Passi di un percorso": {
    title: "bolle-steps · passi",
    html: `<bolle-steps id="passi" label="Avanzamento" options="Dati,Documenti,Riepilogo"></bolle-steps>`,
    css: "",
    js: `${importLine}

const passi = document.querySelector("#passi");
passi.value = "1";

passi.addEventListener("change", (event) => {
  console.log("Passo scelto:", event.detail.index);
});`,
  },
  "Campo con prefisso e supporto": {
    title: "bolle-text-field · campo",
    html: `<bolle-text-field label="Importo" type="number">
  <span slot="prefix">€</span>
  <span slot="supporting">Importo al netto dell'IVA</span>
</bolle-text-field>`,
    css: "",
    js: `${importLine}

document.querySelector("bolle-text-field").addEventListener("change", (event) => {
  console.log("Importo:", event.detail.value);
});`,
  },
  "Select con opzioni native": {
    title: "bolle-select · select",
    html: `<bolle-select label="Stato">
  <select name="stato">
    <option value="aperta">In corso</option>
    <option value="chiusa">Chiusa</option>
    <option value="sospesa">Sospesa</option>
  </select>
  <span slot="supporting">Lo stato decide l'ordine delle commesse</span>
</bolle-select>`,
    css: "",
    js: `${importLine}`,
  },
  "Scelta fra segmenti": {
    title: "bolle-segmented-buttons · segmenti",
    html: `<bolle-segmented-buttons id="vista" label="Vista"></bolle-segmented-buttons>`,
    css: "",
    js: `${importLine}

const vista = document.querySelector("#vista");
vista.items = [
  { id: "elenco", label: "Elenco" },
  { id: "griglia", label: "Griglia" },
  { id: "mappa", label: "Mappa" },
];
vista.value = "elenco";

vista.addEventListener("change", (event) => {
  console.log("Vista scelta:", event.detail.value);
});`,
  },
  "Barra di navigazione": {
    title: "bolle-navigation-bar · navigazione",
    html: `<bolle-navigation-bar id="nav" label="Sezioni"></bolle-navigation-bar>`,
    css: "",
    js: `${importLine}

const nav = document.querySelector("#nav");
nav.items = [
  { id: "commesse", label: "Commesse" },
  { id: "clienti", label: "Clienti" },
  { id: "scadenze", label: "Scadenze" },
];
nav.value = "commesse";

nav.addEventListener("change", (event) => {
  console.log("Sezione:", event.detail.value);
});`,
  },
  "Dialogo di conferma": {
    title: "bolle-dialog · dialogo",
    html: `<bolle-button id="apri" variant="filled">Archivia</bolle-button>

<bolle-dialog id="conferma" label="Archivia commessa" modal>
  <h2 slot="heading">Archiviare la commessa?</h2>
  <p>La commessa esce dagli elenchi attivi.</p>
  <bolle-button slot="actions" variant="text" id="annulla">Annulla</bolle-button>
  <bolle-button slot="actions" variant="filled" id="ok">Archivia</bolle-button>
</bolle-dialog>`,
    css: "",
    js: `${importLine}

const dialogo = document.querySelector("#conferma");

document.querySelector("#apri").addEventListener("click", () => dialogo.show());
document.querySelector("#annulla").addEventListener("click", () => dialogo.close());
document.querySelector("#ok").addEventListener("click", () => dialogo.close("archivia"));

dialogo.addEventListener("closed", (event) => {
  console.log("Scelta:", event.detail.returnValue);
});`,
  },
  "Foglio dal basso": {
    title: "bolle-bottom-sheet · foglio",
    html: `<bolle-button id="apri" variant="filled">Filtri</bolle-button>

<bolle-bottom-sheet id="filtri" label="Filtri" drag-handle modal>
  <h2 slot="heading">Filtri</h2>
  <p>Scegli lo stato delle commesse.</p>
  <bolle-button slot="actions" variant="text" id="chiudi">Annulla</bolle-button>
  <bolle-button slot="actions" variant="filled">Applica</bolle-button>
</bolle-bottom-sheet>`,
    css: "",
    js: `${importLine}

const filtri = document.querySelector("#filtri");
document.querySelector("#apri").addEventListener("click", () => filtri.show());
document.querySelector("#chiudi").addEventListener("click", () => filtri.close());`,
  },
  "Pannello laterale di dettaglio": {
    title: "bolle-side-sheet · pannello",
    html: `<bolle-button id="apri" variant="tonal">Dettaglio</bolle-button>

<bolle-side-sheet id="dettaglio" label="Dettaglio commessa" placement="end" modal>
  <h2 slot="heading">C2026-1000</h2>
  <p>Ristrutturazione scuola di Seriate.</p>
  <bolle-button slot="actions" variant="filled">Apri scheda</bolle-button>
</bolle-side-sheet>`,
    css: "",
    js: `${importLine}

const dettaglio = document.querySelector("#dettaglio");
document.querySelector("#apri").addEventListener("click", () => dettaglio.show());`,
  },
  "Messaggio con azione": {
    title: "bolle-snackbar · messaggio",
    html: `<bolle-button id="archivia" variant="filled">Archivia</bolle-button>

<bolle-snackbar id="feedback" duration="6000">
  <span slot="message">Commessa archiviata</span>
  <bolle-button slot="action" variant="text" id="annulla">Annulla</bolle-button>
</bolle-snackbar>`,
    css: "",
    js: `${importLine}

const feedback = document.querySelector("#feedback");
document.querySelector("#archivia").addEventListener("click", () => feedback.show());
document.querySelector("#annulla").addEventListener("click", () => {
  feedback.close();
  console.log("Archiviazione annullata");
});`,
  },
  "Suggerimento su un comando": {
    title: "bolle-tooltip · suggerimento",
    html: `<bolle-icon-button id="salva" label="Salva">
  <span slot="icon" aria-hidden="true">★</span>
</bolle-icon-button>

<bolle-tooltip id="hint" label="Salva la commessa" supporting-text="Scorciatoia: Ctrl e S">
</bolle-tooltip>`,
    css: "",
    js: `${importLine}

const hint = document.querySelector("#hint");
const salva = document.querySelector("#salva");

salva.addEventListener("pointerenter", () => hint.show(salva));
salva.addEventListener("pointerleave", () => hint.close());`,
  },
  "Menu di azioni": {
    title: "bolle-menu · menu",
    html: `<bolle-button id="apri" variant="tonal">Azioni</bolle-button>

<bolle-menu id="azioni" label="Azioni"></bolle-menu>`,
    css: "",
    js: `${importLine}

const menu = document.querySelector("#azioni");
menu.items = [
  { id: "apri", label: "Apri scheda" },
  { id: "duplica", label: "Duplica", shortcut: "Ctrl D" },
  { id: "archivia", label: "Archivia" },
];

document.querySelector("#apri").addEventListener("click", (event) => {
  menu.show(event.currentTarget);
});

menu.addEventListener("menu-select", (event) => {
  console.log("Voce scelta:", event.detail.item.id);
});`,
  },
  "Azione principale e menu": {
    title: "bolle-split-button · pulsante diviso",
    html: `<bolle-split-button id="salva" label="Salva" variant="filled"></bolle-split-button>`,
    css: "",
    js: `${importLine}

const salva = document.querySelector("#salva");
salva.items = [
  { id: "bozza", label: "Salva come bozza" },
  { id: "duplica", label: "Salva e duplica" },
];

salva.addEventListener("menu-select", (event) => {
  console.log("Scelta:", event.detail.item.id);
});`,
  },
  "Azioni rapide": {
    title: "bolle-fab-menu · azioni rapide",
    html: `<bolle-fab-menu id="rapide" label="Azioni rapide">
  <span slot="icon" aria-hidden="true">+</span>
</bolle-fab-menu>`,
    css: "",
    js: `${importLine}

const rapide = document.querySelector("#rapide");
rapide.items = [
  { id: "commessa", label: "Nuova commessa" },
  { id: "cliente", label: "Nuovo cliente" },
];

rapide.addEventListener("menu-select", (event) => {
  console.log("Azione:", event.detail.item.id);
});`,
  },
  "Pulsante flottante": {
    title: "bolle-floating-action-button · pulsante flottante",
    html: `<div style="position: relative; block-size: 320px; border: 1px dashed #ccc">
  <bolle-floating-action-button
    label="Nuova commessa"
    style="position: absolute; inset-block-end: 16px; inset-inline-end: 16px"
  >
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-floating-action-button>
</div>`,
    css: "",
    js: `${importLine}`,
  },
  "Barra dell'applicazione": {
    title: "bolle-app-bar · barra",
    html: `<bolle-app-bar title="Commesse" subtitle="12 attive">
  <bolle-icon-button slot="leading" label="Menu">
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-icon-button>
  <bolle-icon-button slot="actions" label="Cerca">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-icon-button>
</bolle-app-bar>`,
    css: "",
    js: `${importLine}`,
  },
  "Barra di comandi": {
    title: "bolle-toolbar · barra di comandi",
    html: `<bolle-toolbar label="Azioni sulle commesse">
  <bolle-segmented-buttons id="vista" label="Vista"></bolle-segmented-buttons>
  <bolle-button variant="text">Esporta</bolle-button>
  <bolle-button variant="text">Archivia</bolle-button>
</bolle-toolbar>`,
    css: "",
    js: `${importLine}

const vista = document.querySelector("#vista");
vista.items = [
  { id: "elenco", label: "Elenco" },
  { id: "griglia", label: "Griglia" },
];`,
  },
  "Barra inferiore con pulsante flottante": {
    title: "bolle-bottom-app-bar · barra inferiore",
    html: `<bolle-bottom-app-bar dock>
  <bolle-icon-button slot="leading" label="Menu">
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-icon-button>
  <bolle-icon-button label="Cerca">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-icon-button>
  <bolle-floating-action-button slot="fab" label="Nuova commessa">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-floating-action-button>
</bolle-bottom-app-bar>`,
    css: "",
    js: `${importLine}`,
  },
  "Scelta di una data": {
    title: "bolle-date-picker · data",
    html: `<bolle-date-picker id="scadenza" label="Scadenza"></bolle-date-picker>`,
    css: "",
    js: `${importLine}

document.querySelector("#scadenza").addEventListener("change", (event) => {
  console.log("Data scelta:", event.detail.value);
});`,
  },
  "Scelta di un orario": {
    title: "bolle-time-picker · orario",
    html: `<bolle-time-picker id="consegna" label="Consegna" hour-cycle="24">
  <span slot="title">Orario di consegna</span>
</bolle-time-picker>`,
    css: "",
    js: `${importLine}

document.querySelector("#consegna").addEventListener("change", (event) => {
  console.log("Orario scelto:", event.detail.value);
});`,
  },
  "Campo con suggerimenti": {
    title: "bolle-autocomplete · suggerimenti",
    html: `<bolle-autocomplete id="comune" label="Comune"></bolle-autocomplete>`,
    css: "",
    js: `${importLine}

const comune = document.querySelector("#comune");
comune.suggestions = [
  { id: "bergamo", label: "Bergamo" },
  { id: "brescia", label: "Brescia" },
  { id: "seriate", label: "Seriate" },
];`,
  },
  "Barra di ricerca con risultati": {
    title: "bolle-search · ricerca",
    html: `<bolle-search id="cerca" label="Cerca commesse"></bolle-search>`,
    css: "",
    js: `${importLine}

const cerca = document.querySelector("#cerca");

cerca.addEventListener("search", (event) => {
  console.log("Cerca:", event.detail.value);
});`,
  },
  "Carosello di schede": {
    title: "bolle-carousel · carosello",
    html: `<bolle-carousel id="schede" label="Schede">
  <bolle-card>Prima scheda</bolle-card>
  <bolle-card>Seconda scheda</bolle-card>
  <bolle-card>Terza scheda</bolle-card>
</bolle-carousel>`,
    css: `bolle-card { margin: 0 8px; padding: 24px; }`,
    js: `${importLine}

document.querySelector("#schede").addEventListener("change", (event) => {
  console.log("Scheda visibile:", event.detail.index);
});`,
  },
  "Albero di navigazione": {
    title: "bolle-sidebar · navigazione",
    html: `<bolle-sidebar id="nav" label="Navigazione" style="block-size: 420px"></bolle-sidebar>`,
    css: "",
    js: `${importLine}

const nav = document.querySelector("#nav");

nav.items = [
  { id: "cruscotto", label: "Cruscotto" },
  {
    id: "commesse",
    label: "Commesse",
    count: 12,
    children: [
      { id: "attive", label: "Attive" },
      { id: "chiuse", label: "Chiuse" },
    ],
  },
  { id: "clienti", label: "Clienti" },
];
nav.current = "commesse/attive";

nav.addEventListener("navigate", (event) => {
  console.log("Percorso scelto:", event.detail.path);
});`,
  },
  "Board minima": {
    title: "bolle-kanban · board",
    html: `<bolle-kanban id="board" label="Cantieri" movable collapsible style="block-size: 420px"></bolle-kanban>`,
    css: "",
    js: `${importLine}

const board = document.querySelector("#board");

board.columns = [
  { id: "da-fare", label: "Da fare" },
  { id: "in-corso", label: "In corso" },
  { id: "fatto", label: "Fatto" },
];

board.cards = [
  { id: "c-1", column: "da-fare", title: "Sopralluogo" },
  { id: "c-2", column: "in-corso", title: "Posa massetto" },
];

board.addEventListener("card-move", (event) => {
  console.log("Scheda spostata:", event.detail.card.id, "→", event.detail.column);
});`,
  },
  "Griglia di riquadri": {
    title: "bolle-dashboard · riquadri",
    html: `<bolle-dashboard label="Panoramica" style="block-size: 420px">
  <bolle-widget title="Lavori in ritardo" span="8" min-span="4">
    <p>Quattro commesse oltre la scadenza.</p>
  </bolle-widget>
  <bolle-widget title="Avanzamento" span="4" min-span="3">
    <bolle-progress-indicator value="62" label="Avanzamento"></bolle-progress-indicator>
  </bolle-widget>
</bolle-dashboard>`,
    css: "",
    js: `${importLine}`,
  },
  "Impalcatura completa": {
    title: "bolle-app-shell · impalcatura",
    html: `<bolle-app-shell style="block-size: 420px">
  <bolle-app-bar slot="bar" title="Commesse"></bolle-app-bar>
  <main style="padding: 16px">Contenuto della pagina</main>
</bolle-app-shell>`,
    css: "",
    js: `${importLine}`,
  },
  "Slot del framework tramite wrapper": {
    title: "bolle-data-table · slot del framework",
    html: `<bolle-data-table id="jobs" label="Commesse" row-key="id"></bolle-data-table>`,
    css: "",
    js: `${importLine}

const table = document.querySelector("#jobs");

table.columns = [
  { key: "code", label: "Codice", width: 140 },
  { key: "client", label: "Cliente", width: 240 },
];

table.rows = [
  { id: "job-1", code: "C-2026-1001", client: "Comune di Bergamo" },
  { id: "job-2", code: "C-2026-1002", client: "Hotel Bellavista" },
];`,
  },
  "Barra stretta": {
    title: "bolle-navigation-rail · barra stretta",
    html: `<bolle-navigation-rail id="rail" label="Sezioni" expanded style="block-size: 420px"></bolle-navigation-rail>`,
    css: "",
    js: `${importLine}

const rail = document.querySelector("#rail");
rail.items = [
  { id: "commesse", label: "Commesse" },
  { id: "clienti", label: "Clienti" },
  { id: "scadenze", label: "Scadenze" },
];
rail.value = "clienti";`,
  },
  "Pannello di navigazione": {
    title: "bolle-navigation-drawer · pannello",
    html: `<bolle-navigation-drawer id="drawer" label="Sezioni" open style="block-size: 420px">
  <h2 slot="heading">Commesse</h2>
</bolle-navigation-drawer>`,
    css: "",
    js: `${importLine}

const drawer = document.querySelector("#drawer");
drawer.items = [
  { id: "elenco", label: "Elenco" },
  { id: "clienti", label: "Clienti" },
];
drawer.value = "elenco";`,
  },
  "Pulsante flottante esteso": {
    title: "bolle-extended-fab · pulsante esteso",
    html: `<bolle-extended-fab>
  <span slot="icon" aria-hidden="true">+</span>
  Nuova commessa
</bolle-extended-fab>`,
    css: "",
    js: `${importLine}`,
  },
  "Pulsanti collegati": {
    title: "bolle-button-group · pulsanti collegati",
    html: `<bolle-button-group variant="connected" selection="single" label="Vista">
  <bolle-button variant="outlined" value="elenco">Elenco</bolle-button>
  <bolle-button variant="outlined" value="griglia">Griglia</bolle-button>
</bolle-button-group>`,
    css: "",
    js: `${importLine}

document.querySelector("bolle-button-group").addEventListener("change", (event) => {
  console.log("Vista scelta:", event.detail.value);
});`,
  },
};
