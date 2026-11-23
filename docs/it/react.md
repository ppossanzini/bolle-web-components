[Italiano](./react.md) · [English](../en/react.md) · [Français](../fr/react.md) · [中文](../zh/react.md)

# React · esempi d'uso esaustivi

Questa guida copre tutti i 51 componenti della libreria con un esempio React per
ciascuno. Il riferimento agli attributi, agli slot, agli eventi e ai metodi è lo
stesso della guida Vue: [vue.md](./vue.md). Qui trovi le regole specifiche di
React e il codice.

La base consigliata è React 19. Con React 18 gli esempi funzionano cambiando il
modo in cui passi proprietà non stringa e proprietà booleane (vedi sotto).

## Installazione e registrazione

```sh
npm install bolle-web-components
```

```tsx
// src/main.tsx
import "bolle-web-components/tokens.css";
import "bolle-web-components/typography.css";
import "bolle-web-components"; // registra tutti i tag bolle-*
import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);
```

L'import di registrazione deve avvenire prima del primo render: React 19 decide
se scrivere una proprietà o un attributo guardando l'istanza già aggiornata.
Il tema scuro si attiva con
`document.documentElement.dataset.theme = "dark"`.

## Regole di integrazione

### Proprietà

React 19 scrive una proprietà DOM quando esiste sull'istanza dell'elemento,
altrimenti un attributo. Quindi array, oggetti e booleani si passano
direttamente:

```tsx
<bolle-list items={items} value={selected} expanded={expanded} />
<bolle-text-field value={email} maxlength={120} counter />
<bolle-button disabled={false} />
```

Con React 18 i valori non stringa diventerebbero attributi (`[object Object]`) e
`disabled={false}` scriverebbe `disabled="false"`, che è comunque vero. In quel
caso assegna le proprietà con il hook `useBolleProps` mostrato sotto, oppure usa
`disabled={undefined}` per i booleani falsi.

### Eventi

React non mappa gli eventi personalizzati (`change`, `value-input`,
`menu-select`…) sulle props JSX. Vanno collegati con `addEventListener` su un
ref. Gli eventi nativi `click` e `submit` continuano a usare `onClick` e
`onSubmit`.

```tsx
// src/bolle.ts
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

export function useBolleEvent<T extends HTMLElement, D = unknown>(
  ref: RefObject<T | null>,
  name: string,
  handler: (detail: D, event: Event) => void,
) {
  const saved = useRef(handler);
  saved.current = handler;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const listener = (event: Event) =>
      saved.current((event as CustomEvent<D>).detail, event);
    node.addEventListener(name, listener);
    return () => node.removeEventListener(name, listener);
  }, [ref, name]);
}

/** Solo per React 18: assegna come proprietà i valori non stringa. */
export function useBolleProps<T extends HTMLElement>(
  ref: RefObject<T | null>,
  props: Record<string, unknown>,
) {
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    for (const [key, value] of Object.entries(props)) {
      if (key in node)
        (node as unknown as Record<string, unknown>)[key] = value;
    }
  });
}
```

Il secondo argomento di `handler` è l'evento: serve per `before-close`, dove
`event.preventDefault()` annulla la chiusura.

### Ref e metodi

Dialog, sheet, snackbar, tooltip, menu, fab-menu e carousel espongono metodi
imperativi. Il ref è tipizzato con la classe del componente.

```tsx
const snackbar = useRef<BolleSnackbar | null>(null);

<bolle-snackbar ref={snackbar} message="Documento salvato" />
<bolle-button onClick={() => snackbar.current?.show("Documento salvato")}>Salva</bolle-button>
```

### Stato controllato

Il pattern è identico a Vue: stato React passato come proprietà e riallineato nel
listener.

```tsx
const [email, setEmail] = useState("");
const field = useRef<BolleTextField | null>(null);
useBolleEvent(field, "value-input", ({ value }: { value: string }) =>
  setEmail(value),
);

<bolle-text-field ref={field} label="Email" value={email} />;

const terms = useRef<BolleCheckbox | null>(null);
useBolleEvent(terms, "change", ({ checked }: { checked: boolean }) =>
  setAccepted(checked),
);
<bolle-checkbox ref={terms} label="Accetto" checked={accepted} />;
```

Per checkbox, switch, radio e chip filtro l'evento è `change` con `checked` o
`selected`; per text field, search, slider, segmented buttons, date e time
picker è `value-input`/`change` con `value`. Anche quando l'evento si chiama
`change`, non è l'evento nativo di React: va collegato con `useBolleEvent`.

### Form

I componenti sono form-associated: entrano nel `FormData` con `name` e `value`,
senza input nascosti. `form.reset()` ripristina i valori iniziali.

```tsx
function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log(data.get("email"), data.get("newsletter"));
}
```

### Slot

Gli slot sono light DOM: si passa un figlio con l'attributo `slot`.

```tsx
<bolle-app-bar label="Posta">
  <bolle-icon-button slot="leading" label="Menu">☰</bolle-icon-button>
</bolle-app-bar>

<bolle-button>
  <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true">…</svg>
  Nuovo
</bolle-button>
```

React 19 supporta `slot` come attributo; con React 18 viene comunque scritto
come attributo personalizzato.

### Scorciatoie da tastiera

Ogni elemento `bolle-*` tranne `bolle-menu` accetta `shortcut` con la sintassi
di `aria-keyshortcuts`. Il componente imposta `aria-keyshortcuts` sul controllo
interno che riceve il focus e gestisce il tasto da solo: non serve un listener in
`useEffect`. Le regole sono nella [guida Vue](vue.md#scorciatoie-da-tastiera).

```tsx
<bolle-button shortcut="Alt+S" onClick={save}>Salva</bolle-button>
<bolle-text-field label="Cerca" shortcut="Control+K Meta+K" />
```

### Icone

Gli slot accettano JSX, quindi SVG inline. Il campo `icon` dentro gli array di
item viene invece reso come testo: usa un nome di legatura Material Symbols con
il font icone del progetto, oppure un carattere. Non passare markup come stringa.

### Tipi JSX

Senza dichiarazioni, TypeScript rifiuta i tag sconosciuti. Un fallback compatto:

```ts
// src/bolle-elements.d.ts
import type * as React from "react";

type BolleElementProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & { [prop: string]: unknown };

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      [tag: `bolle-${string}`]: BolleElementProps;
    }
  }
}
```

Per il type checking preciso aggiungi dichiarazioni puntuali, che hanno la
precedenza sul fallback:

```ts
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "bolle-text-field": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        variant?: "filled" | "outlined";
        label?: string;
        value?: string;
        type?: string;
        supportingText?: string;
        error?: boolean;
        multiline?: boolean;
        rows?: number;
        maxlength?: number;
        counter?: boolean;
        prefix?: string;
        suffix?: string;
        shortcut?: string;
        name?: string;
        required?: boolean;
        disabled?: boolean;
      };
      "bolle-list": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        items?: import("bolle-web-components").BolleItem[];
        label?: string;
        variant?: "standard" | "segmented";
        interactive?: boolean;
        selection?: "none" | "single" | "multiple";
        value?: string | string[];
        expanded?: string[];
      };
    }
  }
}
```

D'ora in poi gli import di React (`import * as React from "react"` per i tipi,
più `useRef`, `useState` e gli helper) si intendono presenti in ogni esempio.

### Stato applicato e agganci

I componenti applicano da sé il cambiamento del lettore e lo riportano con un
evento: ordinamento, pagina, selezione, apertura riga, raggruppamento, colonne,
spostamento di una scheda o di un'attività. Non serve riscrivere lo stato
ascoltando l'evento; l'ascolto resta utile solo per sapere cosa è cambiato.

Quando i dati stanno su un server il componente cede il lavoro a un aggancio:
`sortHandler`, `pageHandler` e `columnHandler` sulla data table, `restrict` su
kanban e gantt. L'aggancio riceve la richiesta, e il componente ridisegna quando
la promessa è risolta. In React si assegnano con un template ref o una prop, perché sono proprietà e
non attributi: `table.sortHandler = …`.

<!-- catalogue -->

## Catalogo dei componenti

Ogni componente elenca attributi, proprietà JavaScript, slot ed eventi pubblici; l'esempio è quello della prima ricetta della documentazione del sito, già scritta per questo framework.

### bolle-button

Attributi: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slot: `default`, `icon`, `trailing-icon` · Eventi: `change`

**Pulsante con icona** — La variante decide la forma: filled per l'azione principale, tonal per la secondaria, outlined e text per le altre. Lo slot predefinito porta il testo, icon l'icona iniziale e trailing-icon quella finale.

```jsx
export function Azioni() {
  return (
    <>
      <bolle-button variant="filled">Salva la commessa</bolle-button>
      <bolle-button variant="outlined">
        <span slot="icon" aria-hidden="true">
          ★
        </span>
        Archivia
      </bolle-button>
      <bolle-button variant="text" href="#/commesse">
        Tutte le commesse
      </bolle-button>
    </>
  );
}
```

Altre ricette: Pulsante che resta premuto

### bolle-icon-button

Attributi: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slot: `default`, `icon`, `trailing-icon` · Eventi: `change`

**Pulsante a icona** — label è obbligatoria perché è il nome letto dai lettori di schermo, dato che il pulsante mostra solo il simbolo. variant standard lascia l'icona senza sfondo, filled la appoggia su una superficie.

```jsx
export function Comandi() {
  return (
    <>
      <bolle-icon-button label="Cerca">
        <span slot="icon" aria-hidden="true">
          ★
        </span>
      </bolle-icon-button>
      <bolle-icon-button variant="filled" label="Aggiungi">
        <span slot="icon" aria-hidden="true">
          +
        </span>
      </bolle-icon-button>
    </>
  );
}
```

### bolle-floating-action-button

Attributi: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slot: `default`, `icon`, `trailing-icon` · Eventi: `change`

**Pulsante flottante** — Il pulsante flottante resta ancorato all'angolo del contenitore e mostra il solo simbolo: label è il nome accessibile e va sempre dichiarata. size regular resta tondo, extended aggiunge il testo.

```jsx
export function NuovaCommessa() {
  return (
    <div style={{ position: "relative", blockSize: 320 }}>
      <bolle-floating-action-button
        label="Nuova commessa"
        style={{ position: "absolute", insetBlockEnd: 16, insetInlineEnd: 16 }}
      >
        <span slot="icon" aria-hidden="true">
          +
        </span>
      </bolle-floating-action-button>
    </div>
  );
}
```

### bolle-extended-fab

Attributi: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slot: `default`, `icon`, `trailing-icon` · Eventi: `change`

**Pulsante flottante esteso** — La forma estesa mostra icona e testo insieme: lo slot icon porta il simbolo, lo slot predefinito il testo. Resta il pulsante dell'azione principale della schermata.

```jsx
export function NuovaCommessa() {
  return (
    <bolle-extended-fab>
      <span slot="icon" aria-hidden="true">
        +
      </span>
      Nuova commessa
    </bolle-extended-fab>
  );
}
```

### bolle-button-group

Attributi: `label`, `required`, `selection`, `shape`, `size`, `variant` · Slot: `default` · Eventi: `selection-change`

**Pulsanti collegati** — Il gruppo unisce pulsanti adiacenti: variant connected toglie lo spazio e condivide i bordi, selection single trasforma il gruppo in una scelta unica e riporta il valore con change.

```jsx
import { useState } from "react";

export function Vista() {
  const [vista, setVista] = useState("elenco");

  return (
    <bolle-button-group
      variant="connected"
      selection="single"
      label="Vista"
      onChange={(event) => setVista(event.detail.value)}
    >
      <bolle-button
        variant="outlined"
        value="elenco"
        selected={vista === "elenco"}
      >
        Elenco
      </bolle-button>
      <bolle-button
        variant="outlined"
        value="griglia"
        selected={vista === "griglia"}
      >
        Griglia
      </bolle-button>
    </bolle-button-group>
  );
}
```

### bolle-badge

Attributi: `label`, `max`, `small`, `value` · Slot: `label` · Eventi: -

**Segnalazione su un elemento** — Il badge mostra value sopra l'elemento che lo contiene e comprime il numero oltre max in «999+». small toglie il testo e lascia il punto, per una segnalazione senza numero.

```jsx
export function Segnalazioni() {
  return (
    <>
      <bolle-badge value="12">
        <bolle-icon-button label="Messaggi">
          <span slot="icon" aria-hidden="true">
            ★
          </span>
        </bolle-icon-button>
      </bolle-badge>
      <bolle-badge value="1200" max={99}>
        <bolle-avatar name="Giulia Ferraro" />
      </bolle-badge>
    </>
  );
}
```

### bolle-bottom-app-bar

Attributi: `align`, `divider`, `dock`, `label`, `sticky`, `variant` · Slot: `default`, `fab`, `leading`, `trailing` · Eventi: -

**Barra inferiore con pulsante flottante** — La barra inferiore tiene i comandi in linea e il pulsante flottante: lo slot predefinito riceve i comandi, leading e trailing gli elementi ai lati, fab il pulsante che si incastra nel taglio. dock porta il pulsante dentro la barra.

```jsx
export function BarraInferiore() {
  return (
    <bolle-bottom-app-bar dock>
      <bolle-icon-button slot="leading" label="Menu">
        <span slot="icon" aria-hidden="true">
          ★
        </span>
      </bolle-icon-button>
      <bolle-icon-button label="Cerca">
        <span slot="icon" aria-hidden="true">
          +
        </span>
      </bolle-icon-button>
      <bolle-floating-action-button slot="fab" label="Nuova commessa">
        <span slot="icon" aria-hidden="true">
          +
        </span>
      </bolle-floating-action-button>
    </bolle-bottom-app-bar>
  );
}
```

### bolle-avatar

Attributi: `alt`, `color`, `initials`, `label`, `name`, `shape`, `size`, `src`, `status` · Slot: `badge`, `icon` · Eventi: -

**Avatar con immagine o iniziali** — src mostra l'immagine e, quando manca o non si carica, il componente torna alle iniziali ricavate da name. initials le fissa a mano, status aggiunge il punto di presenza e size cambia la misura.

```jsx
const persone = [
  { src: "/giulia.jpg", name: "Giulia Ferraro", status: "online" },
  { name: "Marco Bellini", size: "lg" },
  { initials: "GF", color: "tertiary" },
];

export function Persone() {
  return (
    <>
      {persone.map((persona) => (
        <bolle-avatar key={persona.name ?? persona.initials} {...persona} />
      ))}
    </>
  );
}
```

Altre ricette: Avatar con icona al posto delle iniziali

### bolle-breadcrumb

Attributi: `label`, `max-items`, `separator` · Proprietà JavaScript: `items`, `labels` · Slot: - · Eventi: `breadcrumb-select`

**Percorso di navigazione** — items dichiara le voci del percorso: il componente mette il separatore fra una voce e l'altra e segna l'ultima come pagina corrente. separator sceglie il segno, max-items comprime le voci centrali dietro un comando.

```jsx
import { useEffect, useRef } from "react";

const items = [
  { label: "Home", href: "#/it/" },
  { label: "Commesse", href: "#/it/commesse" },
  { label: "C2026-1000" },
];

export function Percorso() {
  const ref = useRef(null);

  useEffect(() => {
    const percorso = ref.current;
    if (!percorso) return;
    percorso.items = items;
  }, []);

  return <bolle-breadcrumb ref={ref} label="Percorso" />;
}
```

### bolle-avatar-group

Attributi: `interactive`, `label`, `max`, `overlap`, `size`, `total` · Proprietà JavaScript: `labels` · Slot: `default` · Eventi: `avatar-group-select`

**Gruppo di avatar** — Il gruppo impila gli avatar che riceve e riassume i restanti in una bolla con il conteggio: max decide quanti mostrarne, total dice quanti sono in tutto quando non li passi tutti.

```jsx
export function Partecipanti({ persone }) {
  return (
    <bolle-avatar-group label="Partecipanti" max={3} total={8}>
      {persone.map((persona) => (
        <bolle-avatar key={persona.name} name={persona.name} />
      ))}
    </bolle-avatar-group>
  );
}
```

Altre ricette: Bolla del conteggio interattiva

### bolle-empty-state

Attributi: `align`, `role`, `text`, `title`, `tone` · Proprietà JavaScript: `icon` · Slot: `actions`, `icon` · Eventi: -

**Stato vuoto con un comando** — Lo stato vuoto centra icona, titolo e testo; lo slot actions porta il comando che fa uscire dallo stato vuoto. tone error lo colora per un errore di caricamento.

```jsx
export function Stati() {
  return (
    <>
      <bolle-empty-state
        title="Nessuna commessa"
        text="Non ci sono commesse per questo filtro."
      >
        <bolle-button slot="actions" variant="filled">
          Crea commessa
        </bolle-button>
      </bolle-empty-state>
      <bolle-empty-state
        tone="error"
        title="Piano non raggiungibile"
        text="Riprova fra qualche istante."
      >
        <bolle-button slot="actions" variant="tonal">
          Riprova
        </bolle-button>
      </bolle-empty-state>
    </>
  );
}
```

Altre ricette: Icona personalizzata e allineamento

### bolle-pagination

Attributi: `form`, `label`, `page`, `page-size`, `range`, `total` · Proprietà JavaScript: `labels`, `pageSizes` · Slot: - · Eventi: `page-change`

**Pager sui dati presenti** — page-size accende il pager e total dice quante righe esistono: il componente si sposta da sé alla pagina richiesta e la riporta con page-change, così l'applicazione taglia la fetta di dati che mostra.

```jsx
import { useEffect, useRef } from "react";

export function Pager({ total }) {
  const ref = useRef(null);

  useEffect(() => {
    const pager = ref.current;
    if (!pager) return;
    pager.total = total;
    const onPage = (event) => console.log("Pagina", event.detail.page);
    pager.addEventListener("page-change", onPage);
    return () => pager.removeEventListener("page-change", onPage);
  }, [total]);

  return <bolle-pagination ref={ref} label="Pagine" page-size={10} />;
}
```

Altre ricette: Scelta della dimensione e forma compatta

### bolle-progress-indicator

Attributi: `indeterminate`, `label`, `max`, `value`, `variant`, `wavy` · Slot: - · Eventi: -

**Avanzamento lineare e circolare** — value dice quanto è stato fatto rispetto a max, label è il nome letto dai lettori di schermo. variant circular passa all'anello, indeterminate segnala un'attesa senza valore.

```jsx
export function Avanzamenti() {
  return (
    <>
      <bolle-progress-indicator value={62} label="Avanzamento cantieri" />
      <bolle-progress-indicator
        value={30}
        variant="circular"
        label="Avanzamento"
      />
      <bolle-progress-indicator indeterminate label="Caricamento" />
    </>
  );
}
```

### bolle-loading-indicator

Slot: - · Eventi: -

**Indicatore di caricamento** — L'indicatore mostra l'attesa di un'operazione: label è il nome letto dai lettori di schermo e va sempre dichiarata. variant contained lo appoggia su una superficie quando copre un riquadro.

```jsx
export function Attese() {
  return (
    <>
      <bolle-loading-indicator label="Caricamento delle commesse" />
      <bolle-loading-indicator variant="contained" label="Aggiornamento" />
    </>
  );
}
```

### bolle-snackbar

Attributi: `action-label`, `close-label`, `duration`, `message`, `open`, `tail` · Slot: `action`, `dismiss`, `message` · Eventi: `action`, `closed`, `queued`

**Messaggio con azione** — show() apre il messaggio e duration lo chiude da solo: lo slot message porta il testo, action l'azione che lo accompagna e dismiss il comando di chiusura. message resta la scorciatoia per il solo testo.

```jsx
import { useRef } from "react";

export function Archivia({ ripristina }) {
  const feedback = useRef(null);

  return (
    <>
      <bolle-button variant="filled" onClick={() => feedback.current?.show()}>
        Archivia
      </bolle-button>
      <bolle-snackbar ref={feedback} duration={6000}>
        <span slot="message">Commessa archiviata</span>
        <bolle-button slot="action" variant="text" onClick={ripristina}>
          Annulla
        </bolle-button>
      </bolle-snackbar>
    </>
  );
}
```

### bolle-tour

Attributi: `index`, `locale`, `open`, `padding`, `placement` · Proprietà JavaScript: `steps` · Slot: - · Eventi: `finish`, `step-change`

**Tour dal JSON di configurazione** — I passi non stanno nel codice: parseTourConfig legge il JSON con la versione e shouldStartTour la confronta con quella che l'applicazione ha già mostrato. Il componente non fa rete e non ricorda nulla, quindi è l'applicazione a decidere quando partire e a salvare la versione al finish.

```jsx
import { useCallback, useEffect, useRef, useState } from "react";
import {
  parseTourConfig,
  shouldStartTour,
  type TourStep,
} from "@bolle/web-components";

export function PrimoAccesso() {
  const tour = useRef<{ start: (index?: number) => void }>(null);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const version = useRef("");

  useEffect(() => {
    let active = true;
    fetch("/tour.json")
      .then((response) => response.text())
      .then((text) => {
        if (!active) return;
        const config = parseTourConfig(text);
        setSteps(config.steps);
        version.current = config.version;
        if (shouldStartTour(config, localStorage.getItem("bolle-tour")))
          tour.current?.start();
      });
    return () => {
      active = false;
    };
  }, []);

  const onFinish = useCallback(
    (event: CustomEvent<{ completed: boolean }>) => {
      if (event.detail.completed)
        localStorage.setItem("bolle-tour", version.current);
    },
    [],
  );

  return (
    <>
      <bolle-button variant="tonal" onClick={() => tour.current?.start()}>
        Rivedi il tour
      </bolle-button>
      <bolle-tour ref={tour} steps={steps} onFinish={onFinish} />
    </>
  );
}
```

Altre ricette: Un passo senza bersaglio e l'azione finale · Filtra le commesse · La tabella · Ci siamo · Pilotare il tour e leggere i passi

### bolle-tooltip

Attributi: `label`, `persistent`, `supporting-text`, `tail`, `variant` · Proprietà JavaScript: `labels` · Slot: `actions`, `content`, `default`, `dismiss`, `label`, `supporting`, `trigger` · Eventi: -

**Suggerimento su un comando** — Il suggerimento si aggancia a un elemento con show(anchor) e si chiude da sé quando il puntatore esce o arriva Esc. label è il testo breve, supporting-text aggiunge la riga di dettaglio.

```jsx
import { useRef } from "react";

export function Salva() {
  const hint = useRef(null);
  const salva = useRef(null);

  return (
    <>
      <bolle-icon-button
        ref={salva}
        label="Salva"
        onPointerEnter={() => hint.current?.show(salva.current)}
        onPointerLeave={() => hint.current?.close()}
      >
        <span slot="icon" aria-hidden="true">
          ★
        </span>
      </bolle-icon-button>
      <bolle-tooltip
        ref={hint}
        label="Salva la commessa"
        supporting-text="Scorciatoia: Ctrl e S"
      />
    </>
  );
}
```

### bolle-carousel

Attributi: `index`, `label`, `next-label`, `previous-label`, `variant` · Slot: `controls`, `default`, `next`, `previous`, `status` · Eventi: `change`

**Carosello di schede** — Il carosello scorre gli elementi dello slot predefinito e mostra i comandi avanti e indietro: index dice quale è visibile e la scelta arriva con change. Lo scorrimento è a passi, con il tocco e la tastiera.

```jsx
export function Schede() {
  return (
    <bolle-carousel label="Schede">
      <bolle-card>Prima scheda</bolle-card>
      <bolle-card>Seconda scheda</bolle-card>
      <bolle-card>Terza scheda</bolle-card>
    </bolle-carousel>
  );
}
```

### bolle-card

Attributi: `href`, `label`, `orientation`, `tail`, `variant` · Slot: `content`, `default`, `media` · Eventi: -

**Scheda con immagine e comandi** — La scheda prende dallo slot predefinito il contenuto, da media l'immagine di testa che occupa la larghezza e da actions la riga di comandi. href rende l'intera scheda un collegamento.

```jsx
export function Scheda() {
  return (
    <bolle-card variant="filled">
      <img slot="media" alt="" src="/cantiere.jpg" />
      <h3>Ristrutturazione scuola</h3>
      <p>Consegna prevista a marzo 2027.</p>
      <bolle-button slot="actions" variant="text">
        Apri
      </bolle-button>
    </bolle-card>
  );
}
```

Altre ricette: Scheda orizzontale come collegamento

### bolle-dialog

Attributi: `close-label`, `label`, `modal`, `open`, `variant` · Slot: `actions`, `default`, `heading` · Eventi: `before-close`, `closed`

**Dialogo di conferma** — open apre il dialogo e modal lo rende bloccante: il fuoco resta dentro finché non si chiude, e la chiusura arriva con closed. heading riceve il titolo letto come intestazione, actions la riga dei comandi.

```jsx
import { useState } from "react";

export function Archivia() {
  const [aperto, setAperto] = useState(false);

  return (
    <>
      <bolle-button variant="filled" onClick={() => setAperto(true)}>
        Archivia
      </bolle-button>
      <bolle-dialog
        label="Archivia commessa"
        modal
        open={aperto}
        onClosed={() => setAperto(false)}
      >
        <h2 slot="heading">Archiviare la commessa?</h2>
        <p>La commessa esce dagli elenchi attivi e resta consultabile.</p>
        <bolle-button
          slot="actions"
          variant="text"
          onClick={() => setAperto(false)}
        >
          Annulla
        </bolle-button>
        <bolle-button slot="actions" variant="filled">
          Archivia
        </bolle-button>
      </bolle-dialog>
    </>
  );
}
```

Altre ricette: Dialogo a tutto schermo

### bolle-bottom-sheet

Attributi: `close-label`, `drag-handle`, `label`, `modal`, `open`, `variant` · Slot: `actions`, `default`, `heading` · Eventi: `before-close`, `closed`

**Foglio dal basso** — Il foglio entra dal bordo inferiore e porta con sé i comandi: drag-handle mostra la presa che lo trascina, heading il titolo, actions la riga finale. open e show() lo aprono.

```jsx
import { useState } from "react";

export function Filtri() {
  const [aperto, setAperto] = useState(false);

  return (
    <>
      <bolle-button variant="filled" onClick={() => setAperto(true)}>
        Filtri
      </bolle-button>
      <bolle-bottom-sheet label="Filtri" drag-handle modal open={aperto}>
        <h2 slot="heading">Filtri</h2>
        <p>Scegli lo stato delle commesse.</p>
        <bolle-button
          slot="actions"
          variant="text"
          onClick={() => setAperto(false)}
        >
          Annulla
        </bolle-button>
        <bolle-button slot="actions" variant="filled">
          Applica
        </bolle-button>
      </bolle-bottom-sheet>
    </>
  );
}
```

### bolle-side-sheet

Attributi: `close-label`, `detached`, `label`, `modal`, `open`, `variant` · Slot: `actions`, `default`, `heading` · Eventi: `before-close`, `closed`

**Pannello laterale di dettaglio** — Il pannello entra dal lato indicato da placement e lascia visibile il contenuto: è la forma giusta per il dettaglio di una riga, con heading per il titolo e actions per i comandi in coda.

```jsx
import { useState } from "react";

export function Dettaglio() {
  const [aperto, setAperto] = useState(false);

  return (
    <>
      <bolle-button variant="tonal" onClick={() => setAperto(true)}>
        Dettaglio
      </bolle-button>
      <bolle-side-sheet
        label="Dettaglio commessa"
        placement="end"
        modal
        open={aperto}
      >
        <h2 slot="heading">C2026-1000</h2>
        <p>Ristrutturazione scuola di Seriate.</p>
        <bolle-button slot="actions" variant="filled">
          Apri scheda
        </bolle-button>
      </bolle-side-sheet>
    </>
  );
}
```

### bolle-divider

Attributi: `decorative`, `inset`, `variant`, `vertical` · Slot: - · Eventi: -

**Separatore fra gruppi** — Il separatore non ha contenuto: divide due gruppi di elementi, con inset per staccarlo dai bordi e vertical per separare comandi affiancati.

```jsx
export function Separatori() {
  return (
    <>
      <p>Committenti</p>
      <bolle-divider inset />
      <p>Fornitori</p>
      <span>Esporta</span>
      <bolle-divider vertical />
      <span>Archivia</span>
    </>
  );
}
```

### bolle-app-bar

Attributi: `alignment`, `collapsed`, `label`, `scrolled`, `sticky`, `subtitle`, `variant` · Slot: `actions`, `default`, `leading`, `title`, `trailing` · Eventi: -

**Barra dell'applicazione** — La barra porta il titolo e i comandi: title riceve il testo principale, subtitle la riga sotto, gli slot leading e actions i comandi ai due lati. Lo slot predefinito sostituisce il titolo quando serve un'intestazione più ricca.

```jsx
export function Barra() {
  return (
    <bolle-app-bar title="Commesse" subtitle="12 attive" sticky>
      <bolle-icon-button slot="leading" label="Menu">
        <span slot="icon" aria-hidden="true">
          ★
        </span>
      </bolle-icon-button>
      <bolle-icon-button slot="actions" label="Cerca">
        <span slot="icon" aria-hidden="true">
          +
        </span>
      </bolle-icon-button>
    </bolle-app-bar>
  );
}
```

Altre ricette: Barra che si comprime allo scorrimento

### bolle-toolbar

Attributi: `color`, `label`, `orientation`, `variant` · Slot: `default` · Eventi: -

**Barra di comandi** — La barra dispone gli elementi che riceve nello slot predefinito: varianti diverse separano i comandi principali da quelli di servizio, e la barra porta a capo gli elementi in eccesso invece di comprimerli.

```jsx
export function Comandi({ viste }) {
  return (
    <bolle-toolbar label="Azioni sulle commesse">
      <bolle-segmented-buttons label="Vista" items={viste} />
      <bolle-button variant="text">Esporta</bolle-button>
      <bolle-button variant="text">Archivia</bolle-button>
    </bolle-toolbar>
  );
}
```

### bolle-navigation-bar

Attributi: `label`, `layout`, `value`, `variant` · Proprietà JavaScript: `items` · Slot: - · Eventi: `navigate`

**Barra di navigazione** — items dichiara le destinazioni con icona e testo, value dice quale è attiva: il componente applica la scelta da sé e la riporta con change. Oltre cinque destinazioni conviene passare alla barra laterale.

```jsx
export function Sezioni({ sezioni, sezione, onChange }) {
  return (
    <bolle-navigation-bar
      label="Sezioni"
      items={sezioni}
      value={sezione}
      onChange={onChange}
    />
  );
}
```

### bolle-navigation-rail

Attributi: `expanded`, `label`, `layout`, `value`, `variant` · Proprietà JavaScript: `items` · Slot: - · Eventi: `navigate`

**Barra stretta** — La barra stretta mostra le icone delle destinazioni e, con expanded, anche i testi. Serve fra la barra inferiore e il pannello laterale, quando lo spazio è poco ma le sezioni restano molte.

```jsx
export function BarraStretta({ sezioni, sezione, onChange }) {
  return (
    <bolle-navigation-rail
      label="Sezioni"
      expanded
      items={sezioni}
      value={sezione}
      onChange={onChange}
    />
  );
}
```

### bolle-navigation-drawer

Attributi: `close-label`, `detached`, `label`, `modal`, `open`, `value`, `variant` · Proprietà JavaScript: `items` · Slot: `actions`, `default`, `heading` · Eventi: `before-close`, `closed`, `navigate`

**Pannello di navigazione** — Il pannello apre le voci in verticale e può stare in linea accanto al contenuto o sovrapposto alla pagina: placement start o end sceglie il lato, modal lo rende bloccante.

```jsx
export function Pannello({ sezioni, sezione, onChange }) {
  return (
    <bolle-navigation-drawer
      label="Sezioni"
      open
      items={sezioni}
      value={sezione}
      onChange={onChange}
    >
      <h2 slot="heading">Commesse</h2>
      <span slot="actions">Versione 0.3.3</span>
    </bolle-navigation-drawer>
  );
}
```

### bolle-tabs

Attributi: `activation`, `label`, `scrollable`, `value`, `variant` · Proprietà JavaScript: `items`, `labels` · Slot: `content-{itemId}`, `default` · Eventi: `change`

**Schede con pannelli** — items dichiara le schede e value quella attiva: il componente applica la scelta da sé e la riporta con change. Ogni pannello dichiara con slot l'identificatore della scheda che lo apre.

```jsx
export function Dettaglio({ scheda, schede, onScheda }) {
  return (
    <bolle-tabs
      label="Dettaglio"
      items={schede}
      value={scheda}
      onChange={onScheda}
    >
      <div slot="note">Note della commessa</div>
      <div slot="documenti">Documenti allegati</div>
    </bolle-tabs>
  );
}
```

Altre ricette: Schede che scorrono

### bolle-checkbox

Attributi: `checked`, `error`, `indeterminate`, `supporting-text` · Slot: `default` · Eventi: `change`

**Casella con testo e supporto** — La casella prende dallo slot predefinito il testo dell'etichetta e cambia stato da sé, riportando checked con change. supporting-text aggiunge la riga di spiegazione, indeterminate mostra lo stato misto.

```jsx
export function Scelte() {
  return (
    <>
      <bolle-checkbox name="urgente">Segna come urgente</bolle-checkbox>
      <bolle-checkbox
        name="privacy"
        required
        supporting-text="Serve per inviare la richiesta"
      >
        Ho letto l'informativa
      </bolle-checkbox>
    </>
  );
}
```

Altre ricette: Casella che governa un elenco

### bolle-switch

Attributi: `checked`, `error`, `indeterminate`, `supporting-text` · Proprietà JavaScript: `icon`, `iconSelected` · Slot: `default` · Eventi: `change`

**Interruttore** — L'interruttore cambia stato da sé e riporta il valore con change: è la forma giusta per una preferenza che ha effetto immediato, mentre la casella resta per una scelta da confermare.

```jsx
import { useState } from "react";

export function Notifiche() {
  const [attive, setAttive] = useState(true);

  return (
    <bolle-switch
      name="notifiche"
      checked={attive}
      onChange={(event) => setAttive(event.detail.checked)}
    >
      Notifiche attive
    </bolle-switch>
  );
}
```

### bolle-radio-button

Attributi: `checked`, `error`, `indeterminate`, `supporting-text` · Slot: `default` · Eventi: `change`

**Gruppo di opzioni** — I pulsanti di opzione si raggruppano per name: scegliere una voce toglie la scelta alle altre dello stesso gruppo, e il valore arriva con change.

```jsx
import { useState } from "react";

const opzioni = ["alta", "media", "bassa"];

export function Priorita() {
  const [priorita, setPriorita] = useState("alta");

  return (
    <>
      {opzioni.map((valore) => (
        <bolle-radio-button
          key={valore}
          name="priorita"
          value={valore}
          checked={priorita === valore}
          onChange={() => setPriorita(valore)}
        >
          {valore}
        </bolle-radio-button>
      ))}
    </>
  );
}
```

### bolle-chip

Attributi: `disabled`, `elevated`, `href`, `label`, `removable`, `remove-label`, `selected`, `variant` · Slot: `avatar`, `default`, `icon` · Eventi: `action`, `change`, `remove`

**Pastiglia con icona e rimozione** — La pastiglia prende dallo slot predefinito il testo e dagli altri un'icona o un avatar. selected la segna come scelta, removable aggiunge il comando che la toglie e riporta remove.

```jsx
export function Filtri() {
  return (
    <>
      <bolle-chip selected>Urgente</bolle-chip>
      <bolle-chip removable remove-label="Togli il filtro Cliente">
        <bolle-avatar slot="avatar" name="Giulia Ferraro" />
        Cliente
      </bolle-chip>
    </>
  );
}
```

### bolle-list

Attributi: `interactive`, `label`, `selection`, `variant` · Proprietà JavaScript: `expanded`, `itemRenderer`, `items`, `labels`, `value` · Slot: `default` · Eventi: `action`, `change`, `expand`

**Elenco con icone e dettaglio** — L'elenco prende le righe dallo slot predefinito e le compone con icona, testo, supporto e coda; interactive abilita il clic e selection riporta la scelta con change.

```jsx
export function Elenco({ onScelta }) {
  return (
    <bolle-list
      label="Commesse"
      interactive
      selection="single"
      onChange={onScelta}
    >
      <bolle-list-item>
        <span slot="leading" aria-hidden="true">
          ★
        </span>
        C2026-1000
        <span slot="supporting">Ristrutturazione scuola</span>
        <span slot="trailing">12</span>
      </bolle-list-item>
      <bolle-list-item>C2026-1001</bolle-list-item>
    </bolle-list>
  );
}
```

Altre ricette: Elenco da un array

### bolle-segmented-buttons

Attributi: `multiple` · Proprietà JavaScript: `items`, `values` · Slot: - · Eventi: `change`

**Scelta fra segmenti** — I segmenti arrivano da items e la scelta da value: il controllo la applica da sé e la riporta con change. multiple ammette più segmenti e restituisce values.

```jsx
import { useEffect, useRef, useState } from "react";

const items = [
  { id: "elenco", label: "Elenco" },
  { id: "griglia", label: "Griglia" },
  { id: "mappa", label: "Mappa" },
];

export function Vista() {
  const ref = useRef(null);
  const [vista, setVista] = useState("elenco");

  useEffect(() => {
    const control = ref.current;
    if (!control) return;
    control.items = items;
    control.value = vista;
  }, [vista]);

  return <bolle-segmented-buttons ref={ref} label="Vista" />;
}
```

Altre ricette: Scelta multipla

### bolle-slider

Attributi: `compact`, `max`, `min`, `min-gap`, `step`, `suffix`, `upper-label`, `upper-value`, `variant` · Proprietà JavaScript: `icon` · Slot: `icon`, `label`, `value` · Eventi: `change`, `value-input`

**Cursore singolo** — Il cursore mostra il valore sull'etichetta e lo riporta con input durante il trascinamento e con change alla fine. min e max fissano l'intervallo, step la granularità.

```jsx
import { useState } from "react";

export function Avanzamento() {
  const [valore, setValore] = useState(40);

  return (
    <bolle-slider
      label="Avanzamento"
      min={0}
      max={100}
      step={5}
      value={String(valore)}
      onChange={(event) => setValore(Number(event.detail.value))}
    />
  );
}
```

Altre ricette: Intervallo fra due valori

### bolle-steps

Attributi: `options` · Slot: `label` · Eventi: `change`

**Passi di un percorso** — options dichiara i nomi dei passi e value quello corrente: il componente segna i passi fatti, quello attivo e i restanti, e riporta la scelta con change.

```jsx
const passi = ["Dati", "Documenti", "Riepilogo"];

export function Passi({ passo, onChange }) {
  return (
    <bolle-steps
      label="Avanzamento"
      options={passi}
      value={passo}
      onChange={(event) => onChange(String(event.detail.index))}
    />
  );
}
```

### bolle-text-field

Attributi: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Slot: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · Eventi: `change`, `value-input`

**Campo con prefisso e supporto** — Il campo prende dagli slot il prefisso, il suffisso e il testo di supporto, mentre il valore resta nell'input e arriva con input e change. variant filled o outlined cambia la forma del riquadro.

```jsx
import { useState } from "react";

export function Importo() {
  const [importo, setImporto] = useState("");

  return (
    <bolle-text-field
      label="Importo"
      type="number"
      value={importo}
      onChange={(event) => setImporto(event.detail.value)}
    >
      <span slot="prefix">€</span>
      <span slot="supporting">Importo al netto dell'IVA</span>
    </bolle-text-field>
  );
}
```

Altre ricette: Campo in errore · Campo multiriga

### bolle-search

Attributi: `appearance`, `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `filter`, `inputmode`, `layout`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `suggestion-delay`, `suggestions-label`, `supporting-text`, `type`, `variant` · Proprietà JavaScript: `suggestions` · Slot: `leading`, `prefix`, `results`, `suffix`, `supporting`, `trailing` · Eventi: `change`, `search`, `suggest`, `value-input`

**Barra di ricerca con risultati** — La ricerca è un campo di testo con il comando di pulizia già incluso: results riceve l'elenco che compare sotto la barra, che l'applicazione riempie con i risultati di suggest o search.

```jsx
export function Ricerca({ risultati, onSearch }) {
  return (
    <bolle-search
      label="Cerca commesse"
      onSearch={(event) => onSearch(event.detail.value)}
    >
      <bolle-list slot="results" label="Risultati">
        {risultati.map((voce) => (
          <bolle-list-item key={voce.id}>{voce.label}</bolle-list-item>
        ))}
      </bolle-list>
    </bolle-search>
  );
}
```

Altre ricette: Ricerca in linea nella barra

### bolle-date-picker

Attributi: `autocapitalize`, `autocomplete`, `counter`, `end-value`, `enterkeyhint`, `error`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `selection-mode`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant`, `week-starts-on` · Proprietà JavaScript: `labels` · Slot: `end-label`, `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · Eventi: `change`, `value-input`

**Scelta di una data** — Il selettore apre il calendario dal campo: il valore scelto arriva con change nel formato ISO, e locale decide lingua e nomi dei giorni. selection-mode range aggiunge la seconda data in end-value.

```jsx
export function Scadenza({ scadenza, onChange }) {
  return (
    <bolle-date-picker
      label="Scadenza"
      value={scadenza}
      onChange={(event) => onChange(event.detail.value)}
    />
  );
}
```

Altre ricette: Intervallo di date

### bolle-time-picker

Attributi: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `hour-cycle`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Proprietà JavaScript: `labels` · Slot: `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · Eventi: `change`, `value-input`

**Scelta di un orario** — Il selettore apre il quadrante dell'ora dal campo: il valore scelto arriva con change, hour-cycle decide il formato a dodici o ventiquattro ore e lo slot title nomina il quadrante.

```jsx
export function Consegna({ consegna, onChange }) {
  return (
    <bolle-time-picker
      label="Consegna"
      hour-cycle={24}
      value={consegna}
      onChange={(event) => onChange(event.detail.value)}
    >
      <span slot="title">Orario di consegna</span>
    </bolle-time-picker>
  );
}
```

### bolle-menu

Attributi: `color-scheme`, `compact-width`, `density`, `filter`, `filterable`, `inactive`, `locale`, `menu-label`, `options`, `quick`, `selection-mode`, `tail`, `variant` · Proprietà JavaScript: `items`, `labels` · Slot: - · Eventi: -

**Menu di azioni** — show(anchor) apre il menu sotto l'elemento che lo richiama e la scelta arriva con menu-select. items dichiara le voci, con icona, scorciatoia, disabled e figli per il sotto-menu.

```jsx
import { useRef } from "react";

const items = [
  { id: "apri", label: "Apri scheda" },
  { id: "duplica", label: "Duplica", shortcut: "Ctrl D" },
];

export function Azioni({ onScelta }) {
  const menu = useRef(null);

  return (
    <>
      <bolle-button
        variant="tonal"
        onClick={(event) => menu.current?.show(event.currentTarget)}
      >
        Azioni
      </bolle-button>
      <bolle-menu
        ref={menu}
        label="Azioni"
        items={items}
        onMenuSelect={onScelta}
      />
    </>
  );
}
```

### bolle-fab-menu

Attributi: `color`, `label`, `open`, `tail` · Proprietà JavaScript: `items` · Slot: `icon` · Eventi: `action`

**Azioni rapide** — Il menu dei pulsanti flottanti apre le azioni secondarie dal pulsante principale: items dichiara le voci, open dice se è aperto e la scelta arriva con menu-select.

```jsx
export function AzioniRapide({ items }) {
  return (
    <bolle-fab-menu label="Azioni rapide" items={items}>
      <span slot="icon" aria-hidden="true">
        +
      </span>
    </bolle-fab-menu>
  );
}
```

### bolle-split-button

Attributi: `disabled`, `icon`, `label`, `menu-label`, `size`, `variant` · Proprietà JavaScript: `items` · Slot: `icon` · Eventi: `action`

**Azione principale e menu** — Il pulsante diviso tiene l'azione principale a sinistra e apre il menu dal comando a fianco: le voci arrivano da items e la scelta con menu-select, mentre il clic sull'azione principale arriva con click.

```jsx
const items = [
  { id: "bozza", label: "Salva come bozza" },
  { id: "duplica", label: "Salva e duplica" },
];

export function Salva() {
  return (
    <bolle-split-button label="Salva" variant="filled" items={items}>
      <span slot="icon" aria-hidden="true">
        ★
      </span>
    </bolle-split-button>
  );
}
```

### bolle-select

Attributi: `error`, `open`, `placeholder`, `supporting-text`, `variant` · Slot: `supporting` · Eventi: `change`

**Select con opzioni native** — La select avvolge un elemento select nativo: le opzioni restano nel markup e il valore arriva con change. Il menu che si apre è quello del componente, con la stessa forma dei campi di testo.

```jsx
export function Stato({ stato, onChange }) {
  return (
    <bolle-select
      label="Stato"
      value={stato}
      onChange={(event) => onChange(event.detail.value)}
    >
      <select name="stato">
        <option value="aperta">In corso</option>
        <option value="chiusa">Chiusa</option>
        <option value="sospesa">Sospesa</option>
      </select>
      <span slot="supporting">Lo stato decide l'ordine delle commesse</span>
    </bolle-select>
  );
}
```

### bolle-autocomplete

Attributi: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Proprietà JavaScript: `options` · Slot: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · Eventi: `change`, `value-input`

**Campo con suggerimenti** — suggestions dichiara i suggerimenti e il componente li filtra mentre si scrive, riportandoli con suggest; scegliere una voce riempie il campo ed emette change. suggestion-delay regola l'attesa prima di chiedere i dati.

```jsx
const suggerimenti = [
  { id: "bergamo", label: "Bergamo" },
  { id: "brescia", label: "Brescia" },
  { id: "seriate", label: "Seriate" },
];

export function Comune() {
  return (
    <bolle-autocomplete
      label="Comune"
      suggestions={suggerimenti}
      suggestion-delay={200}
    />
  );
}
```

### bolle-sidebar

Attributi: `collapsed`, `context`, `current`, `label`, `max-width`, `min-width`, `search`, `variant`, `width` · Proprietà JavaScript: `contentStyles`, `empty`, `expanded`, `filter`, `item`, `items`, `labels`, `railItem` · Slot: `empty`, `filter`, `footer`, `header` · Eventi: `collapse`, `expand`, `navigate`, `resize`

**Albero di navigazione** — items dichiara le voci e i loro figli: il componente costruisce l'albero fino a tre livelli, apre il ramo della voce scelta e riporta il percorso con navigate. La voce corrente si imposta con current, il percorso delle voci separate da barra.

```jsx
import { useEffect, useRef } from "react";
import type { BolleSidebar, SidebarItem } from "@bolle/web-components";

const items: SidebarItem[] = [
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

export function Navigation() {
  const ref = useRef<BolleSidebar>(null);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    nav.items = items;
    nav.current = "commesse/attive";
  }, []);

  return (
    <bolle-sidebar ref={ref} label="Navigazione" style={{ blockSize: "520px" }} />
  );
}
```

Altre ricette: Ricerca, contatori e rail compatta · Contenuto di una voce

### bolle-app-shell

Attributi: `close-label`, `expanded-width`, `form`, `label`, `medium-width`, `supporting-label`, `supporting-mode`, `supporting-open` · Proprietà JavaScript: `labels` · Slot: `bar`, `bottom-bar`, `default`, `navigation`, `navigation-compact`, `status`, `supporting`, `supporting-actions`, `supporting-header`, `supporting-inline`, `supporting-modal` · Eventi: `form-change`, `supporting-close`

**Impalcatura completa** — L'impalcatura mette insieme le superfici intorno al contenuto: la navigazione, la barra, quella inferiore e il pannello di supporto arrivano dagli slot e il contenuto principale è lo slot predefinito. Le aree che non ricevono nulla non occupano spazio.

```jsx
export function Shell({ children }) {
  return (
    <bolle-app-shell style={{ blockSize: "100dvh" }}>
      <bolle-navigation-drawer slot="navigation" label="Sezioni">
        <a href="#/commesse">Commesse</a>
        <a href="#/clienti">Clienti</a>
      </bolle-navigation-drawer>
      <bolle-app-bar slot="bar" title="Commesse" />
      <main>{children}</main>
      <bolle-bottom-app-bar slot="bottom-bar" />
    </bolle-app-shell>
  );
}
```

Altre ricette: Pannello di supporto

### bolle-dashboard

Attributi: `columns`, `compact-columns`, `density`, `label`, `medium-columns` · Proprietà JavaScript: `labels` · Slot: `default` · Eventi: -

**Griglia di riquadri** — La dashboard dispone i riquadri che riceve e non impone contenuti: ogni riquadro è un bolle-widget, e span decide quante colonne occupa mentre min-span fissa il minimo quando lo spazio si stringe.

```jsx
export function Overview() {
  return (
    <bolle-dashboard label="Panoramica" style={{ blockSize: "640px" }}>
      <bolle-widget title="Lavori in ritardo" span={8} min-span={4}>
        <p>Quattro commesse oltre la scadenza.</p>
      </bolle-widget>
      <bolle-widget title="Avanzamento cantieri" span={4} min-span={3}>
        <bolle-progress-indicator value={62} label="Avanzamento" />
      </bolle-widget>
    </bolle-dashboard>
  );
}
```

Altre ricette: Riquadri spostabili e ridimensionabili

### bolle-kanban

Attributi: `addable`, `card-gap`, `collapsible`, `column-gap`, `column-max-width`, `column-min-width`, `density`, `empty-label`, `error`, `label`, `lanes`, `loading`, `movable`, `selected` · Proprietà JavaScript: `card`, `cardActions`, `cards`, `collapsed`, `columnActions`, `columnRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `labels`, `laneLabel`, `laneRenderer`, `loadingRenderer`, `restrict` · Slot: `empty`, `error`, `loading` · Eventi: `card-action`, `card-add`, `card-move`, `card-move-blocked`, `card-open`, `column-action`, `column-collapse`, `retry`

**Board minima** — columns dichiara le colonne e cards le schede, ciascuna con la colonna in cui si trova. Con movable il lettore trascina la scheda o la sposta con Alt e le frecce: la board applica lo spostamento e lo riporta con card-move.

```jsx
import { useEffect, useRef } from "react";

export function Board({ columns, cards }) {
  const ref = useRef(null);

  useEffect(() => {
    const board = ref.current;
    if (!board) return;
    board.columns = columns;
    board.cards = cards;
    board.movable = true;
  }, [columns, cards]);

  return (
    <bolle-kanban ref={ref} label="Cantieri" style={{ blockSize: "520px" }} />
  );
}
```

Altre ricette: Regola di spostamento e limiti · Contenuto della scheda

### bolle-gantt

Attributi: `baseline`, `density`, `editable`, `empty-label`, `error`, `group-by`, `label`, `linkable`, `loading`, `scale`, `selected` · Proprietà JavaScript: `barRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `groupLabel`, `labels`, `loadingRenderer`, `restrict`, `tasks` · Slot: `empty`, `error`, `loading` · Eventi: `columns-change`, `dependency-add`, `dependency-blocked`, `retry`, `task-change`, `task-change-blocked`, `task-open`, `task-select`, `view-change`

**Piano minimo** — Il piano disegna le attività sull'asse del tempo: parent costruisce l'albero e una attività con figli diventa una barra di riepilogo. L'altezza del host è obbligatoria, perché la superficie riempie lo spazio che riceve.

```jsx
import { useEffect, useRef } from "react";
import type { BolleGantt, GanttTask } from "@bolle/web-components";

const tasks: GanttTask[] = [
  {
    id: "p-1",
    code: "C2026-1000",
    name: "Ristrutturazione scuola",
    start: "2026-09-07",
    end: "2027-03-12",
  },
  {
    id: "p-1-1",
    parent: "p-1",
    code: "C2026-1000.01",
    name: "Impianto elettrico",
    start: "2026-09-14",
    end: "2026-10-02",
    progress: 30,
    resource: "Giulia Ferraro",
  },
];

export function Plan() {
  const ref = useRef<BolleGantt>(null);

  useEffect(() => {
    if (ref.current) ref.current.tasks = tasks;
  }, []);

  return (
    <bolle-gantt
      ref={ref}
      label="Piano di commessa"
      style={{ blockSize: "420px" }}
    />
  );
}
```

Altre ricette: Colonne e contenuto delle celle · Spostare e ridimensionare · Contenuto della barra · Stati e slot

### bolle-data-table

Attributi: `compact-row-height`, `default-column-width`, `density`, `empty-label`, `error`, `expandable`, `group-by`, `group-height`, `header-height`, `label`, `loading`, `max-column-width`, `min-column-width`, `overscan`, `page`, `page-size`, `row-height`, `row-key`, `selectable`, `total`, `updating`, `variant`, `virtual` · Proprietà JavaScript: `columnHandler`, `columns`, `contentStyles`, `detail`, `emptyRenderer`, `errorRenderer`, `expanded`, `footerRenderer`, `groupRenderer`, `groupSummary`, `headerRenderer`, `labels`, `loadingRenderer`, `pageHandler`, `rowActions`, `rowRenderer`, `rows`, `selected`, `sort`, `sortHandler` · Slot: `empty`, `empty-state`, `error`, `footer`, `header`, `loading` · Eventi: `column-change`, `expand`, `group`, `retry`, `row-action`, `row-activate`, `select`, `sort`

**Slot del framework tramite wrapper** — Vue e React non possono passare uno slot con scope a un elemento personalizzato. Un wrapper di poche righe trasforma la slot in un renderer: la pagina scrive il template della cella una volta, il wrapper monta il contenuto per ogni riga e libera la memoria quando la cella esce dal documento.

```jsx
// BolleDataTable.tsx
import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { ReactNode } from "react";
import type {
  BolleDataTable as Element,
  DataTableColumn,
  DataTableRow,
} from "@bolle/web-components";

interface Props {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  label: string;
  rowKey?: string;
  cell?: (scope: { row: DataTableRow; column: DataTableColumn }) => ReactNode;
}

export function BolleDataTable({ columns, rows, label, rowKey = "id", cell }: Props) {
  const ref = useRef<Element>(null);
  const cells = useRef(new Map<string, { host: HTMLElement; root: Root }>());

  useEffect(() => {
    const table = ref.current;
    if (!table) return;

    table.columns = columns.map((column) => ({
      ...column,
      render: cell
        ? (row: DataTableRow) => {
            const key = `${row[rowKey]}-${column.key}`;
            let entry = cells.current.get(key);
            if (!entry) {
              const host = document.createElement("span");
              entry = { host, root: createRoot(host) };
              cells.current.set(key, entry);
            }
            entry.root.render(<>{cell({ row, column })}</>);
            return entry.host;
          }
        : column.render,
    }));
    table.rows = rows;
  }, [columns, rows, cell, rowKey]);

  useEffect(() => {
    const entries = cells.current;
    return () => {
      for (const { root } of entries.values()) root.unmount();
      entries.clear();
    };
  }, []);

  return <bolle-data-table ref={ref} label={label} row-key={rowKey} />;
}

// Pagina: il contenuto della cella è JSX, non una funzione che costruisce nodi.
<BolleDataTable
  label="Commesse"
  columns={columns}
  rows={rows}
  cell={({ row, column }) =>
    column.key === "status" ? <span className="badge">{row.status}</span> : null
  }
/>
```

Altre ricette: Registrare i componenti · Tabella minima · Formattare i valori · Cella personalizzata · Ordinamento · Selezione delle righe · Dettaglio della riga · Raggruppamento · Paginazione · Caricamento, errore e vuoto · Colonne fisse, larghezze e visibilità · Scorrimento continuo · Stile tramite CSS part
