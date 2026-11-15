import { html, svg, type TemplateResult } from "lit";
import { bolleMark } from "./landing.js";
import { l, m } from "./i18n.js";

/** Translates `text`, then replaces `{name}` placeholders with markup from `parts`. */
const lh = (text: string, parts: Record<string, unknown>) =>
  l(text)
    .split(/(\{\w+\})/)
    .map((piece) => {
      const key = /^\{(\w+)\}$/.exec(piece)?.[1];
      return key && key in parts ? parts[key] : piece;
    });

const show = (id: string) => (event: Event) =>
  document
    .querySelector<HTMLElement & { show?: (opener?: HTMLElement) => void }>(`#${id}`)
    ?.show?.(event.currentTarget as HTMLElement);

const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Long gradient values collapse to their function name. */
const shortValue = (value: string) => {
  const flat = value.replace(/\s+/g, " ");
  return flat.length > 60 ? `${flat.slice(0, flat.indexOf("("))}(…)` : flat;
};

const tokenTable = (rows: [string, string][]) =>
  html`<table class="fd-tokens">
    <thead>
      <tr><th scope="col">${l("Token")}</th><th scope="col">${l("Valore")}</th><th scope="col">${l("Uso")}</th></tr>
    </thead>
    <tbody>
      ${rows.map(
        ([name, use]) =>
          html`<tr>
            <td><code>${name}</code></td>
            <td><code>${shortValue(token(name)) || "—"}</code></td>
            <td>${use}</td>
          </tr>`,
      )}
    </tbody>
  </table>`;

const section = (
  id: string,
  kicker: string,
  title: string,
  lead: string,
  body: TemplateResult,
) =>
  html`<section class="fd-section panel" id=${`fd-${id}`} aria-labelledby=${`fd-${id}-title`}>
    <p class="kicker">${kicker}</p>
    <h2 id=${`fd-${id}-title`}>${title}</h2>
    <p class="lead">${lead}</p>
    ${body}
  </section>`;

/** Samples the --bb-tension linear() stops into an SVG path. */
const tensionCurve = () => {
  const stops = token("--bb-tension")
    .replace(/^linear\(|\)$/g, "")
    .split(",")
    .map((part) => part.trim().split(/\s+/));
  const points = stops.map(([value, at], index) => [
    at ? parseFloat(at) / 100 : index / (stops.length - 1),
    parseFloat(value),
  ]);
  const d = points
    .map(([x, y], i) => `${i ? "L" : "M"}${(x * 280 + 10).toFixed(1)} ${(110 - y * 80).toFixed(1)}`)
    .join(" ");
  return html`<svg class="fd-curve" viewBox="0 0 300 130" role="img" aria-label=${l("Curva della molla --bb-tension: supera il valore finale del 16% e oscilla prima di fermarsi")}>
    ${svg`<line x1="10" x2="290" y1="30" y2="30" class="fd-curve-target"></line>
      <line x1="10" x2="290" y1="110" y2="110" class="fd-curve-axis"></line>
      <path d=${d} class="fd-curve-line"></path>`}
  </svg>`;
};

const MENU = [
  { id: "recent", label: m("Più recenti") },
  { id: "popular", label: m("Più popolari") },
  { id: "name", label: m("Nome") },
];

/** Section ids and labels, used by the side navigation of the Foundations page. */
export const FOUNDATION_SECTIONS: [string, string][] = [
  ["fd-coda", m("Coda")],
  ["fd-pellicola", m("Pellicola")],
  ["fd-riflesso", m("Riflesso e galleggiamento")],
  ["fd-movimento", m("Movimento")],
  ["fd-vetro", m("Vetro")],
  ["fd-colore", m("Colore")],
  ["fd-tipografia", m("Tipografia")],
  ["fd-paletti", m("Paletti")],
];

export function renderFoundations(): TemplateResult {
  return html`<header class="component-header">
      <span class="kicker">Foundations</span>
      <h1>${l("Come è fatta una bolla")}</h1>
      <code class="tag">--bb-*</code>
      <p class="lead">
        ${l("Material 3 resta la struttura: ruoli colore, scala tipografica, stati e accessibilità. Bolle ne è la pelle e la riconosci da tre segni: l'angolo a coda, la pellicola iridescente e lo schiocco. Tutto passa da pochi token in più, che puoi regolare o spegnere.")}
      </p>
    </header>


    ${section(
      "coda",
      l("Forma"),
      l("La coda"),
      l("Ogni superficie sospesa ha tre angoli tondi e uno stretto, che punta verso l'elemento da cui è nata. Menu, tooltip e azioni del FAB calcolano l'angolo all'apertura; snackbar e card lo tengono in basso, sul lato di inizio. I bottoni restano a pillola."),
      html`<div class="fd-demo-row">
          <div class="fd-shape" style="border-radius: var(--bb-tail) var(--bb-radius) var(--bb-radius) var(--bb-radius)">
            <span>${l("Menu sotto il bottone")}</span>
          </div>
          <div class="fd-shape" style="border-radius: var(--bb-radius) var(--bb-radius) var(--bb-radius) var(--bb-tail)">
            <span>${l("Snackbar · card")}</span>
          </div>
          <div class="fd-live">
            <bolle-button variant="tonal" haspopup="menu" @click=${show("fd-menu")}
              >${l("Ordina")}</bolle-button
            >
            <bolle-menu id="fd-menu" menu-label=${l("Ordina per")} .items=${MENU.map((item) => ({ ...item, label: l(item.label) }))}></bolle-menu>
            <bolle-tooltip label=${l("La coda punta qui")}>
              <bolle-button variant="outlined">${l("Passa sopra")}</bolle-button>
            </bolle-tooltip>
          </div>
        </div>
        ${tokenTable([
          ["--bb-radius", l("Raggio dei tre angoli tondi delle superfici sospese")],
          ["--bb-tail", l("Angolo stretto rivolto all'origine")],
          ["--bb-card-tail", l("Angolo stretto delle card")],
          ["--bb-radius-m", l("Raggio di snackbar e tooltip ricco")],
          ["--bb-radius-s", l("Raggio del tooltip semplice")],
        ])}`,
    )}

    ${section(
      "pellicola",
      l("Materiale"),
      l("La pellicola"),
      l("Un gradiente conico tenue ricavato dal colore seed: le quattro tinte ruotano attorno alla sua tonalità, così la pellicola segue il tema dinamico. Si usa con misura: anello di focus, stato selezionato, FAB. Una sola superficie iridescente per schermata, mai come sfondo."),
      html`<div class="fd-film-strip" aria-hidden="true"></div>
        <div class="fd-film-stops">
          ${[1, 2, 3, 4].map(
            (i) =>
              html`<span><i style=${`background: var(--bb-film-${i})`}></i><code>--bb-film-${i}</code></span>`,
          )}
        </div>
        <div class="fd-demo-row">
          <div class="fd-live">
            <bolle-button>${l("Premi Tab per il focus")}</bolle-button>
            <bolle-chip variant="filter" selected label=${l("Selezionato")}></bolle-chip>
            <bolle-floating-action-button label=${l("Nuovo")}>+</bolle-floating-action-button>
          </div>
          <p class="fd-rule">
            ${l("L'anello iridescente è sempre doppiato da un contorno pieno: il significato non dipende mai dal gradiente.")}
          </p>
        </div>
        ${tokenTable([
          ["--bb-film", l("Gradiente conico completo")],
          ["--bb-film-wash", l("Velatura al 30% per il FAB")],
          ["--bb-ring-width", l("Spessore dell'anello pellicola")],
          ["--bb-ring-gap", l("Distanza dell'anello dal controllo")],
        ])}`,
    )}

    ${section(
      "riflesso",
      l("Luce"),
      l("Riflesso e galleggiamento"),
      l("In Bolle l'elevazione si legge da ombra morbida e riflesso, non solo dal colore di superficie. Più un elemento sale, più l'ombra si allarga e prende la tinta del primario. Al passaggio del puntatore ogni pulsante mostra il riflesso della bolla sopra il proprio colore, insieme allo strato di stato M3."),
      html`<div class="fd-floats">
          ${[1, 2, 3, 4, 5].map(
            (level) =>
              html`<div class="fd-float" style=${`box-shadow: var(--bb-float-${level})`}>
                <span class="fd-float-shine" aria-hidden="true"></span>
                <code>--bb-float-${level}</code>
              </div>`,
          )}
        </div>
        <div class="fd-demo-row">
          <div class="fd-live">
            <bolle-button>Filled</bolle-button>
            <bolle-button variant="tonal">Tonal</bolle-button>
            <bolle-button variant="accent">${l("Accento")}</bolle-button>
            <bolle-button variant="outlined">Outlined</bolle-button>
          </div>
          <p class="fd-rule">${l("Passa sopra i pulsanti: il riflesso compare in alto a destra.")}</p>
        </div>
        ${tokenTable([
          ["--bb-highlight", l("Riflesso in alto a destra, all'hover e sul FAB")],
          ["--bb-float-2", l("Menu, tooltip ricco, card elevate")],
          ["--bb-float-3", l("Snackbar, FAB")],
          ["--bb-float-5", l("Il livello più alto, con tinta del primario")],
        ])}`,
    )}

    ${section(
      "movimento",
      l("Movimento"),
      l("Lo schiocco"),
      l("Molle con tensione superficiale. Alla pressione il pulsante si schiaccia a volume costante; al rilascio oscilla con una molla poco smorzata. Le superfici si gonfiano dall'angolo a coda e scoppiano alla chiusura. Le dialog, una volta aperte, galleggiano in modo quasi impercettibile."),
      html`<div class="fd-motion">
          <figure>
            ${tensionCurve()}
            <figcaption><code>--bb-tension</code> · ${token("--bb-tension-duration")}</figcaption>
          </figure>
          <ul class="fd-moves">
            <li><strong>${l("Pressione")}</strong> · ${l("scala {scale} in {duration}", { scale: token("--bb-squish").replace(" ", " × "), duration: token("--bb-squish-duration") })}</li>
            <li><strong>${l("Rilascio")}</strong> · ${lh("ritorno con {token}", { token: html`<code>--bb-tension</code>` })}</li>
            <li><strong>${l("Comparsa")}</strong> · ${l("si gonfia dall'angolo a coda in {duration}", { duration: token("--bb-inflate-duration") })}</li>
            <li><strong>${l("Chiusura")}</strong> · ${l("cresce del 5% e sfuma in {duration}", { duration: token("--bb-pop-duration") })}</li>
            <li><strong>${l("Galleggiamento")}</strong> · ${l("le dialog oscillano di {distance} ogni {duration}", { distance: token("--bb-bob-distance"), duration: token("--bb-bob-duration") })}</li>
            <li><strong>${l("Indicatori")}</strong> · ${l("nei pulsanti segmentati l'indicatore scorre come una goccia")}</li>
          </ul>
        </div>
        <div class="fd-demo-row">
          <div class="fd-live">
            <bolle-button size="medium">${l("Premi e rilascia")}</bolle-button>
            <bolle-button variant="tonal" @click=${show("fd-dialog")}>${l("Apri una dialog")}</bolle-button>
            <bolle-segmented-buttons
              label=${l("Periodo")}
              .items=${[
                { id: "day", label: l("Giorno") },
                { id: "week", label: l("Settimana") },
                { id: "month", label: l("Mese") },
              ]}
              value="day"
            ></bolle-segmented-buttons>
            <bolle-loading-indicator label=${l("Caricamento")}></bolle-loading-indicator>
          </div>
        </div>
        <bolle-dialog id="fd-dialog" label=${l("Una dialog che galleggia")} close-label=${l("Chiudi")}>
          <p>${l("Guarda il bordo: la dialog sale e scende di un paio di pixel.")}</p>
        </bolle-dialog>
        <p class="note">
          ${lh("Con {token} restano solo le dissolvenze: niente dondolio, scoppio né galleggiamento.", { token: html`<code>prefers-reduced-motion</code>` })}
        </p>`,
    )}

    ${section(
      "vetro",
      l("Materiale"),
      l("Vetro"),
      l("Solo gli strati sospesi sono traslucidi: menu e azioni del FAB. Sotto c'è sempre una versione opaca di riserva, che si attiva se il browser non supporta backdrop-filter, sui dispositivi lenti e con prefers-reduced-transparency."),
      tokenTable([
        ["--bb-glass-opacity", l("Opacità del fondo traslucido")],
        ["--bb-glass-blur", l("Sfocatura dello sfondo")],
      ]),
    )}

    ${section(
      "colore",
      l("Colore"),
      l("Colore"),
      l("Il colore funzionale arriva dai ruoli tonali di M3, generati dal seed #5B4CF0 con npm run colors. La pellicola è un livello decorativo a parte. L'accento Scoppio è riservato a call to action rare."),
      html`<div class="fd-swatches">
        ${[
          ["primary", "on-primary", m("Bolla · primario")],
          ["primary-container", "on-primary-container", m("Lilla · container")],
          ["surface", "on-surface", m("Schiuma · superficie")],
          ["inverse-surface", "inverse-on-surface", m("Inchiostro")],
          ["secondary-container", "on-secondary-container", m("Nebbia · secondario")],
        ].map(
          ([bg, fg, label]) =>
            html`<div class="fd-swatch" style=${`background: var(--md-sys-color-${bg}); color: var(--md-sys-color-${fg})`}>
              <strong>${l(label)}</strong><code>${token(`--md-sys-color-${bg}`)}</code>
            </div>`,
        )}
        <div class="fd-swatch" style="background: var(--bb-accent); color: var(--bb-on-accent)">
          <strong>${l("Scoppio · accento")}</strong><code>${token("--bb-accent")}</code>
        </div>
      </div>`,
    )}

    ${section(
      "tipografia",
      l("Tipografia"),
      l("Tipografia"),
      l("La scala di M3 non cambia: cambiano solo le famiglie. Fredoka 600 per display e titoli dai 32 px in su, Figtree per testo e controlli, JetBrains Mono per il codice."),
      html`<div class="fd-type">
        <p class="fd-type-display">Aa Bolle</p>
        <p class="fd-type-plain">${l("Componenti morbidi, regole rigorose.")}</p>
        <p><code class="fd-type-code">&lt;bolle-button variant="filled"&gt;Inizia&lt;/bolle-button&gt;</code></p>
      </div>
      ${tokenTable([
        ["--md-ref-typeface-display", l("Display e headline large")],
        ["--md-ref-typeface-plain", l("Testo e controlli")],
        ["--md-ref-typeface-code", l("Codice")],
      ])}`,
    )}

    ${section(
      "paletti",
      l("Regole"),
      l("Paletti"),
      l("Tre vincoli tengono insieme carattere e accessibilità."),
      html`<ul class="fd-rules">
        <li>${bolleMark(20)}<span><strong>${l("Il colore resta M3.")}</strong> ${l("I ruoli tonali garantiscono il contrasto; l'iridescenza non indica mai uno stato da sola.")}</span></li>
        <li>${bolleMark(20)}<span><strong>${l("Movimento rispettoso.")}</strong> ${l("Con movimento ridotto solo dissolvenze.")}</span></li>
        <li>${bolleMark(20)}<span><strong>${l("Leggera quando serve.")}</strong> ${l("Su dispositivi lenti si spengono sfocatura e filtro goccia.")}</span></li>
      </ul>`,
    )}`;
}
