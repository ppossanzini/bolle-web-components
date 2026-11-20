[Italiano](../it/react.md) · [English](./react.md) · [Français](../fr/react.md) · [中文](../zh/react.md)

# React · exhaustive usage examples

This guide covers all 51 components of the library with a React example for
each one. The reference for attributes, slots, events and methods is the same as
in the Vue guide: [vue.md](./vue.md). Here you'll find the React-specific rules
and the code.

The recommended baseline is React 19. With React 18 the examples work by
changing the way you pass non-string properties and boolean properties (see
below).

## Installation and registration

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

The registration import must happen before the first render: React 19 decides
whether to write a property or an attribute by looking at the already-updated
instance. The dark theme is activated with
`document.documentElement.dataset.theme = "dark"`.

## Integration rules

### Properties

React 19 writes a DOM property when it exists on the element instance, otherwise
it writes an attribute. So arrays, objects and booleans are passed directly:

```tsx
<bolle-list items={items} value={selected} expanded={expanded} />
<bolle-text-field value={email} maxlength={120} counter />
<bolle-button disabled={false} />
```

With React 18 non-string values would become attributes (`[object Object]`) and
`disabled={false}` would write `disabled="false"`, which is still truthy. In that
case assign the properties with the `useBolleProps` hook shown below, or use
`disabled={undefined}` for false booleans.

### Events

React does not map custom events (`change`, `value-input`,
`menu-select`…) onto JSX props. They must be attached with `addEventListener` on
a ref. The native `click` and `submit` events keep using `onClick` and
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

The second argument of `handler` is the event: it is needed for `before-close`,
where `event.preventDefault()` cancels the closing.

### Refs and methods

Dialog, sheet, snackbar, tooltip, menu, fab-menu and carousel expose imperative
methods. The ref is typed with the component class.

```tsx
const snackbar = useRef<BolleSnackbar | null>(null);

<bolle-snackbar ref={snackbar} message="Documento salvato" />
<bolle-button onClick={() => snackbar.current?.show("Documento salvato")}>Salva</bolle-button>
```

### Controlled state

The pattern is identical to Vue: React state passed as a property and realigned
in the listener.

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

For checkbox, switch, radio and filter chip the event is `change` with `checked`
or `selected`; for text field, search, slider, segmented buttons, date and time
picker it is `value-input`/`change` with `value`. Even when the event is called
`change`, it is not React's native event: it must be attached with
`useBolleEvent`.

### Forms

The components are form-associated: they enter the `FormData` with `name` and
`value`, without hidden inputs. `form.reset()` restores the initial values.

```tsx
function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log(data.get("email"), data.get("newsletter"));
}
```

### Slots

Slots are light DOM: you pass a child with the `slot` attribute.

```tsx
<bolle-app-bar label="Posta">
  <bolle-icon-button slot="leading" label="Menu">☰</bolle-icon-button>
</bolle-app-bar>

<bolle-button>
  <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true">…</svg>
  Nuovo
</bolle-button>
```

React 19 supports `slot` as an attribute; with React 18 it is still written as a
custom attribute.

### Keyboard shortcuts

Every `bolle-*` element except `bolle-menu` accepts `shortcut` in the
`aria-keyshortcuts` syntax. The component sets `aria-keyshortcuts` on its
focusable inner control and handles the key itself: no `useEffect` listener is
needed. Attribute rules are in the [Vue guide](vue.md#keyboard-shortcuts).

```tsx
<bolle-button shortcut="Alt+S" onClick={save}>Save</bolle-button>
<bolle-text-field label="Search" shortcut="Control+K Meta+K" />
```

### Icons

Slots accept JSX, hence inline SVG. The `icon` field inside item arrays is
instead rendered as text: use a Material Symbols ligature name with the project
icon font, or a character. Do not pass markup as a string.

### JSX types

Without declarations, TypeScript rejects unknown tags. A compact fallback:

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

For precise type checking add targeted declarations, which take precedence over
the fallback:

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

From here on, the React imports (`import * as React from "react"` for the types,
plus `useRef`, `useState` and the helpers) are assumed to be present in every
example.

### Applied state and hooks

Components apply the reader's change themselves and report it with an event:
sorting, page, selection, row expansion, grouping, columns, moving a card or a
task. There is no need to write the state back while listening; the event stays
useful to know what changed.

When the data lives on a server the component hands the work to a hook:
`sortHandler`, `pageHandler` and `columnHandler` on the data table, `restrict` on
kanban and gantt. The hook receives the request and the component redraws once
the promise settles. In React they are set with a template ref or a prop, since they are properties
and not attributes: `table.sortHandler = …`.

<!-- catalogue -->

## Component catalogue

Every component lists its attributes, JavaScript properties, slots and public events; the example is the first recipe of the site documentation, already written for this framework.

### bolle-button

Attributes: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Events: `change`

**Button with an icon** — The variant decides the shape: filled for the main action, tonal for the secondary, outlined and text for the others. The default slot takes the text, icon the start icon and trailing-icon the end one.

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

More recipes: Button that stays pressed

### bolle-icon-button

Attributes: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Events: `change`

**Icon button** — label is required because it is the name read by screen readers, since the button shows only the symbol. variant standard leaves the icon without a background, filled rests it on a surface.

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

Attributes: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Events: `change`

**Floating button** — The floating button stays anchored to the corner of its container and shows only the symbol: label is the accessible name and is always required. size regular stays round, extended adds the text.

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

Attributes: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Events: `change`

**Extended floating button** — The extended form shows icon and text together: the icon slot takes the symbol, the default slot the text. It stays the button of the main action of the screen.

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

Attributes: `label`, `required`, `selection`, `shape`, `size`, `variant` · Slots: `default` · Events: `selection-change`

**Connected buttons** — The group joins adjacent buttons: variant connected removes the space and shares the borders, selection single turns the group into a single choice and reports the value with change.

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

Attributes: `label`, `max`, `small`, `value` · Slots: `label` · Events: -

**Badge on an element** — The badge shows value over the element that contains it and shortens the number beyond max to “999+”. small drops the text and keeps the dot, for a badge without a number.

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

Attributes: `align`, `divider`, `dock`, `label`, `sticky`, `variant` · Slots: `default`, `fab`, `leading`, `trailing` · Events: -

**Bottom bar with a floating button** — The bottom bar holds the inline commands and the floating button: the default slot takes the commands, leading and trailing the elements at the sides, fab the button that fits into the notch. dock brings the button inside the bar.

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

Attributes: `alt`, `color`, `initials`, `label`, `name`, `shape`, `size`, `src`, `status` · Slots: `badge`, `icon` · Events: -

**Avatar with an image or the initials** — src shows the image and, when it is missing or fails to load, the component falls back to the initials taken from name. initials sets them by hand, status adds the presence dot and size changes the size.

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

More recipes: Avatar with an icon instead of the initials

### bolle-breadcrumb

Attributes: `label`, `max-items`, `separator` · JavaScript properties: `items`, `labels` · Slots: - · Events: `breadcrumb-select`

**Breadcrumb path** — items declares the entries of the path: the component puts the separator between them and marks the last one as the current page. separator chooses the sign, max-items squeezes the middle entries behind a command.

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

Attributes: `interactive`, `label`, `max`, `overlap`, `size`, `total` · JavaScript properties: `labels` · Slots: `default` · Events: `avatar-group-select`

**Avatar group** — The group stacks the avatars it receives and sums the rest in a bubble with a count: max decides how many to show, total tells how many there are when not all are passed.

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

More recipes: Interactive count bubble

### bolle-empty-state

Attributes: `align`, `role`, `text`, `title`, `tone` · JavaScript properties: `icon` · Slots: `actions`, `icon` · Events: -

**Empty state with a command** — The empty state centres an icon, a title and a text; the actions slot takes the command that leaves the empty state. tone error colours it for a loading error.

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

More recipes: Custom icon and alignment

### bolle-pagination

Attributes: `form`, `label`, `page`, `page-size`, `range`, `total` · JavaScript properties: `labels`, `pageSizes` · Slots: - · Events: `page-change`

**Pager over the rows at hand** — page-size turns the pager on and total says how many rows exist: the component moves to the requested page on its own and reports it with page-change, so the application slices the data it shows.

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

More recipes: Choosing the size and compact form

### bolle-progress-indicator

Attributes: `indeterminate`, `label`, `max`, `value`, `variant`, `wavy` · Slots: - · Events: -

**Linear and circular progress** — value says how much is done against max, label is the name read by screen readers. variant circular switches to the ring, indeterminate reports a wait without a value.

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

Slots: - · Events: -

**Loading indicator** — The indicator shows the wait of an operation: label is the name read by screen readers and is always required. variant contained rests it on a surface when it covers a tile.

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

Attributes: `action-label`, `close-label`, `duration`, `message`, `open`, `tail` · Slots: `action`, `dismiss`, `message` · Events: `action`, `closed`, `queued`

**Message with an action** — show() opens the message and duration closes it by itself: the message slot takes the text, action the action beside it and dismiss the closing command. message stays the shortcut for the text alone.

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

### bolle-tooltip

Attributes: `label`, `persistent`, `supporting-text`, `tail`, `variant` · JavaScript properties: `labels` · Slots: `actions`, `content`, `default`, `dismiss`, `label`, `supporting`, `trigger` · Events: -

**Tooltip on a command** — The tooltip attaches to an element with show(anchor) and closes by itself when the pointer leaves or Esc arrives. label is the short text, supporting-text adds the detail line.

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

Attributes: `index`, `label`, `next-label`, `previous-label`, `variant` · Slots: `controls`, `default`, `next`, `previous`, `status` · Events: `change`

**Card carousel** — The carousel scrolls the items of the default slot and shows the forward and backward commands: index says which one is visible and the change arrives with change. It moves in steps, with touch and keyboard.

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

Attributes: `href`, `label`, `orientation`, `tail`, `variant` · Slots: `content`, `default`, `media` · Events: -

**Card with image and commands** — The card takes the content from the default slot, from media the lead image that fills the width and from actions the command row. href turns the whole card into a link.

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

More recipes: Horizontal card as a link

### bolle-dialog

Attributes: `close-label`, `label`, `modal`, `open`, `variant` · Slots: `actions`, `default`, `heading` · Events: `before-close`, `closed`

**Confirmation dialog** — open opens the dialog and modal makes it blocking: the focus stays inside until it closes, and the closing arrives with closed. heading takes the title read as a heading, actions the command row.

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

More recipes: Full-screen dialog

### bolle-bottom-sheet

Attributes: `close-label`, `drag-handle`, `label`, `modal`, `open`, `variant` · Slots: `actions`, `default`, `heading` · Events: `before-close`, `closed`

**Bottom sheet** — The sheet enters from the bottom edge and brings its commands along: drag-handle shows the grip that drags it, heading the title, actions the final row. open and show() open it.

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

Attributes: `close-label`, `detached`, `label`, `modal`, `open`, `variant` · Slots: `actions`, `default`, `heading` · Events: `before-close`, `closed`

**Side panel of detail** — The panel enters from the side set by placement and leaves the content visible: it is the right form for the detail of a row, with heading for the title and actions for the trailing commands.

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

Attributes: `decorative`, `inset`, `variant`, `vertical` · Slots: - · Events: -

**Divider between groups** — The divider has no content: it divides two groups of elements, with inset to detach it from the edges and vertical to separate side-by-side commands.

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

Attributes: `alignment`, `collapsed`, `label`, `scrolled`, `sticky`, `subtitle`, `variant` · Slots: `actions`, `default`, `leading`, `title`, `trailing` · Events: -

**Application bar** — The bar carries the title and the commands: title takes the main text, subtitle the line below, the leading and actions slots the commands at the sides. The default slot replaces the title when a richer header is needed.

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

More recipes: Bar that shrinks on scroll

### bolle-toolbar

Attributes: `color`, `label`, `orientation`, `variant` · Slots: `default` · Events: -

**Command bar** — The bar lays out the elements it receives in the default slot: different variants separate the main commands from the service ones, and the bar wraps the extra elements instead of squeezing them.

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

Attributes: `label`, `layout`, `value`, `variant` · JavaScript properties: `items` · Slots: - · Events: `navigate`

**Navigation bar** — items declares the destinations with icon and text, value says which one is active: the component applies the choice on its own and reports it with change. Above five destinations it is better to switch to the side bar.

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

Attributes: `expanded`, `label`, `layout`, `value`, `variant` · JavaScript properties: `items` · Slots: - · Events: `navigate`

**Narrow bar** — The narrow bar shows the icons of the destinations and, with expanded, also the texts. It sits between the bottom bar and the side panel, when space is short but the sections stay many.

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

Attributes: `close-label`, `detached`, `label`, `modal`, `open`, `value`, `variant` · JavaScript properties: `items` · Slots: `actions`, `default`, `heading` · Events: `before-close`, `closed`, `navigate`

**Navigation panel** — The panel opens the entries vertically and can sit inline beside the content or over the page: placement start or end chooses the side, modal makes it blocking.

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

Attributes: `activation`, `label`, `scrollable`, `value`, `variant` · JavaScript properties: `items`, `labels` · Slots: `content-{itemId}`, `default` · Events: `change`

**Tabs with panels** — items declares the tabs and value the active one: the component applies the choice on its own and reports it with change. Every panel names the tab that opens it through slot.

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

More recipes: Tabs that scroll

### bolle-checkbox

Attributes: `checked`, `error`, `indeterminate`, `supporting-text` · Slots: `default` · Events: `change`

**Checkbox with text and support** — The checkbox takes the label text from the default slot and changes state on its own, reporting checked with change. supporting-text adds the explanation line, indeterminate shows the mixed state.

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

More recipes: Checkbox that drives a list

### bolle-switch

Attributes: `checked`, `error`, `indeterminate`, `supporting-text` · JavaScript properties: `icon`, `iconSelected` · Slots: `default` · Events: `change`

**Switch** — The switch changes state on its own and reports the value with change: it is the right form for a preference with immediate effect, while the checkbox stays for a choice to confirm.

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

Attributes: `checked`, `error`, `indeterminate`, `supporting-text` · Slots: `default` · Events: `change`

**Group of options** — The radio buttons group by name: choosing one entry clears the others of the same group, and the value arrives with change.

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

Attributes: `disabled`, `elevated`, `href`, `label`, `removable`, `remove-label`, `selected`, `variant` · Slots: `avatar`, `default`, `icon` · Events: `action`, `change`, `remove`

**Chip with an icon and removal** — The chip takes its text from the default slot and from the others an icon or an avatar. selected marks it as chosen, removable adds the command that removes it and reports remove.

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

Attributes: `interactive`, `label`, `selection`, `variant` · JavaScript properties: `expanded`, `itemRenderer`, `items`, `labels`, `value` · Slots: `default` · Events: `action`, `change`, `expand`

**List with icons and detail** — The list takes the rows from the default slot and composes them with icon, text, support and trailing content; interactive enables the click and selection reports the choice with change.

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

More recipes: List from an array

### bolle-segmented-buttons

Attributes: `multiple` · JavaScript properties: `items`, `values` · Slots: - · Events: `change`

**Choice among segments** — The segments come from items and the choice from value: the control applies it on its own and reports it with change. multiple allows more than one segment and reports values.

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

More recipes: Multiple choice

### bolle-slider

Attributes: `compact`, `max`, `min`, `min-gap`, `step`, `suffix`, `upper-label`, `upper-value`, `variant` · JavaScript properties: `icon` · Slots: `icon`, `label`, `value` · Events: `change`, `value-input`

**Single thumb** — The slider shows the value on the label and reports it with input while dragging and with change at the end. min and max set the range, step the granularity.

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

More recipes: Range between two values

### bolle-steps

Attributes: `options` · Slots: `label` · Events: `change`

**Steps of a path** — options declares the step names and value the current one: the component marks the done steps, the active one and the remaining ones, and reports the choice with change.

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

Attributes: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Slots: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · Events: `change`, `value-input`

**Field with a prefix and supporting text** — The field takes the prefix, the suffix and the supporting text from the slots, while the value stays in the input and arrives with input and change. variant filled or outlined changes the shape of the box.

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

More recipes: Field in error · Multiline field

### bolle-search

Attributes: `appearance`, `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `filter`, `inputmode`, `layout`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `suggestion-delay`, `suggestions-label`, `supporting-text`, `type`, `variant` · JavaScript properties: `suggestions` · Slots: `leading`, `prefix`, `results`, `suffix`, `supporting`, `trailing` · Events: `change`, `search`, `suggest`, `value-input`

**Search bar with results** — The search is a text field with the clear command already included: results takes the list that appears under the bar, which the application fills with the results of suggest or search.

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

More recipes: Search inline in the bar

### bolle-date-picker

Attributes: `autocapitalize`, `autocomplete`, `counter`, `end-value`, `enterkeyhint`, `error`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `selection-mode`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant`, `week-starts-on` · JavaScript properties: `labels` · Slots: `end-label`, `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · Events: `change`, `value-input`

**Choosing a date** — The picker opens the calendar from the field: the chosen value arrives with change in ISO format, and locale decides language and day names. selection-mode range adds the second date in end-value.

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

More recipes: Date range

### bolle-time-picker

Attributes: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `hour-cycle`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · JavaScript properties: `labels` · Slots: `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · Events: `change`, `value-input`

**Choosing a time** — The picker opens the hour dial from the field: the chosen value arrives with change, hour-cycle decides the twelve or twenty-four hour format and the title slot names the dial.

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

Attributes: `color-scheme`, `compact-width`, `density`, `filter`, `filterable`, `inactive`, `locale`, `menu-label`, `options`, `quick`, `selection-mode`, `tail`, `variant` · JavaScript properties: `items`, `labels` · Slots: - · Events: -

**Menu of actions** — show(anchor) opens the menu under the element that calls it and the choice arrives with menu-select. items declares the entries, with icon, shortcut, disabled and children for the submenu.

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

Attributes: `color`, `label`, `open`, `tail` · JavaScript properties: `items` · Slots: `icon` · Events: `action`

**Quick actions** — The floating button menu opens the secondary actions from the main button: items declares the entries, open says whether it is open and the choice arrives with menu-select.

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

Attributes: `disabled`, `icon`, `label`, `menu-label`, `size`, `variant` · JavaScript properties: `items` · Slots: `icon` · Events: `action`

**Main action and menu** — The split button keeps the main action on the left and opens the menu from the command beside it: the entries come from items and the choice with menu-select, while the click on the main action arrives with click.

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

Attributes: `error`, `open`, `placeholder`, `supporting-text`, `variant` · Slots: `supporting` · Events: `change`

**Select with native options** — The select wraps a native select element: the options stay in the markup and the value arrives with change. The menu that opens is the component one, with the same shape as the text fields.

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

Attributes: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · JavaScript properties: `options` · Slots: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · Events: `change`, `value-input`

**Field with suggestions** — suggestions declares the suggestions and the component filters them while typing, reporting them with suggest; choosing an entry fills the field and emits change. suggestion-delay sets the wait before asking for the data.

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

Attributes: `collapsed`, `context`, `current`, `label`, `max-width`, `min-width`, `search`, `variant`, `width` · JavaScript properties: `contentStyles`, `empty`, `expanded`, `filter`, `item`, `items`, `labels`, `railItem` · Slots: `empty`, `filter`, `footer`, `header` · Events: `collapse`, `expand`, `navigate`, `resize`

**Navigation tree** — items declares the entries and their children: the component builds the tree up to three levels, opens the branch of the chosen entry and reports the path with navigate. The current entry is set with current, the path of the entries separated by a slash.

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

More recipes: Search, counters and compact rail · Content of an entry

### bolle-app-shell

Attributes: `close-label`, `expanded-width`, `form`, `label`, `medium-width`, `supporting-label`, `supporting-mode`, `supporting-open` · JavaScript properties: `labels` · Slots: `bar`, `bottom-bar`, `default`, `navigation`, `navigation-compact`, `status`, `supporting`, `supporting-actions`, `supporting-header`, `supporting-inline`, `supporting-modal` · Events: `form-change`, `supporting-close`

**Complete shell** — The shell assembles the surfaces around the content: the navigation, the bar, the bottom bar and the supporting panel come from the slots and the main content is the default slot. Areas that receive nothing take no space.

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

More recipes: Supporting panel

### bolle-dashboard

Attributes: `columns`, `compact-columns`, `density`, `label`, `medium-columns` · JavaScript properties: `labels` · Slots: `default` · Events: -

**Grid of tiles** — The dashboard lays out the tiles it receives and imposes no content: every tile is a bolle-widget, and span decides how many columns it takes while min-span sets the minimum when space narrows.

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

More recipes: Movable and resizable tiles

### bolle-kanban

Attributes: `addable`, `card-gap`, `collapsible`, `column-gap`, `column-max-width`, `column-min-width`, `density`, `empty-label`, `error`, `label`, `lanes`, `loading`, `movable`, `selected` · JavaScript properties: `card`, `cardActions`, `cards`, `collapsed`, `columnActions`, `columnRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `labels`, `laneLabel`, `laneRenderer`, `loadingRenderer`, `restrict` · Slots: `empty`, `error`, `loading` · Events: `card-action`, `card-add`, `card-move`, `card-move-blocked`, `card-open`, `column-action`, `column-collapse`, `retry`

**Minimal board** — columns declares the columns and cards the cards, each with the column it sits in. With movable the reader drags the card or moves it with Alt and the arrows: the board applies the move and reports it with card-move.

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

More recipes: Move rule and limits · Card content

### bolle-gantt

Attributes: `baseline`, `density`, `editable`, `empty-label`, `error`, `group-by`, `label`, `linkable`, `loading`, `scale`, `selected` · JavaScript properties: `barRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `groupLabel`, `labels`, `loadingRenderer`, `restrict`, `tasks` · Slots: `empty`, `error`, `loading` · Events: `columns-change`, `dependency-add`, `dependency-blocked`, `retry`, `task-change`, `task-change-blocked`, `task-open`, `task-select`, `view-change`

**Minimal plan** — The plan draws the tasks on the time axis: parent builds the tree and a task with children becomes a summary bar. The host needs a height, because the surface fills the space it receives.

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

More recipes: Columns and cell content · Moving and resizing · Bar content · States and slots

### bolle-data-table

Attributes: `compact-row-height`, `default-column-width`, `density`, `empty-label`, `error`, `expandable`, `group-by`, `group-height`, `header-height`, `label`, `loading`, `max-column-width`, `min-column-width`, `overscan`, `page`, `page-size`, `row-height`, `row-key`, `selectable`, `total`, `updating`, `variant`, `virtual` · JavaScript properties: `columnHandler`, `columns`, `contentStyles`, `detail`, `emptyRenderer`, `errorRenderer`, `expanded`, `footerRenderer`, `groupRenderer`, `groupSummary`, `headerRenderer`, `labels`, `loadingRenderer`, `pageHandler`, `rowActions`, `rowRenderer`, `rows`, `selected`, `sort`, `sortHandler` · Slots: `empty`, `empty-state`, `error`, `footer`, `header`, `loading` · Events: `column-change`, `expand`, `group`, `retry`, `row-action`, `row-activate`, `select`, `sort`

**Framework slot through a wrapper** — Vue and React cannot pass a scoped slot to a custom element. A wrapper of a few lines turns the slot into a renderer: the page writes the cell template once, the wrapper mounts the content for every row and releases the memory when the cell leaves the document.

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

More recipes: Register the components · Minimal table · Format values · Custom cell · Sorting · Row selection · Row detail · Grouping · Paging · Loading, error and empty · Pinned columns, widths and visibility · Continuous scrolling · Styling with CSS parts
