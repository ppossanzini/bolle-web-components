[Italiano](../it/vue.md) · [English](./vue.md) · [Français](../fr/vue.md) · [中文](../zh/vue.md)

# Vue 3 · exhaustive usage examples

This guide covers all 51 components of the library. Each section lists the
public attributes, the slots, the events and the methods, then shows a Vue 3
example that uses them all. The examples assume `<script setup lang="ts">` and
Vue 3.4 or later. For React see [react.md](./react.md).

The components are Custom Elements: Vue treats them as native elements, not as
Vue components. This has three consequences, explained in the integration rules:
attributes stay HTML attributes, events are DOM events with `detail`,
and methods are called through a template ref.

## Installation and registration

```sh
npm install bolle-web-components
```

```ts
// src/main.ts
import "bolle-web-components/tokens.css";
import "bolle-web-components/typography.css";
import "bolle-web-components"; // registra tutti i tag bolle-*
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```

The library build already registers every tag: no Vue plugins and no
`app.use()` are needed. The light theme is the default; dark is enabled with
`document.documentElement.dataset.theme = "dark"`, as in the demo.

### Vue compiler

Vue must know that the `bolle-*` tags are not components to be resolved.

```ts
// vite.config.ts
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("bolle-"),
        },
      },
    }),
  ],
});
```

If the Vue build happens at runtime, apply the same rule to the app:

```ts
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("bolle-");
```

`vue-tsc` does not infer the types of Custom Element attributes. For a complete
static check you need typed wrapper components, like this one:

```vue
<!-- src/components/AppTextField.vue -->
<script setup lang="ts">
import type { BolleTextField } from "bolle-web-components";

const model = defineModel<string>({ default: "" });
</script>

<template>
  <bolle-text-field
    :label="label"
    :value="model"
    @value-input="
      model = ($event as CustomEvent<{ value: string }>).detail.value
    "
  />
</template>
```

The wrapper is useful only if you need type checking: the following examples
use the library tags directly.

## Integration rules

### Properties and attributes

Vue sets a DOM property when the key exists on the element, otherwise it
writes an attribute. Properties that accept arrays or objects must therefore
be bound with `:` and the property name, not as a string:

| Component                                                                                | Property to bind                                   |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `bolle-segmented-buttons`                                                                | `:items`, `:values`                                |
| `bolle-search`                                                                           | `:suggestions`                                     |
| `bolle-date-picker`                                                                      | `:labels`                                          |
| `bolle-list`                                                                             | `:items`, `:value` (including arrays), `:expanded` |
| `bolle-navigation-*`, `bolle-tabs`, `bolle-fab-menu`, `bolle-split-button`, `bolle-menu` | `:items`                                           |
| `bolle-slider`                                                                           | `:iconStart`, `:iconEnd` (accept SVG or text)      |
| `bolle-switch`                                                                           | `:icon`, `:iconSelected`                           |

All other attributes (`variant`, `size`, `label`, `disabled`, `required`,
`supporting-text`…) work both as static attributes and with `:binding`.
For composed attributes use kebab-case: `:supporting-text`,
`:upper-value`, `:remove-label`, `:menu-label`, `:close-label`.

Properties declared without an attribute (`icon`, `iconSelected`, `iconStart`,
`iconEnd`, `items`, `values`, `suggestions`, `labels`, `expanded` and the list
`value`) exist only as properties: bind them with the exact property name
(`:iconStart`, `:items`). With an in-DOM template the browser lowercases
attribute names, so in that case use `v-bind="{ iconStart }"`.

Booleans are reflected attributes: `<bolle-checkbox checked />` is equivalent
to `:checked="true"`, while `:checked="false"` removes the attribute.

### Events

All custom events are `bubbles: true` and `composed: true`. In Vue you listen
to them with `@event-name` and the payload is in `event.detail`. The names are
always kebab-case:

```
@change  @value-input  @selection-change  @navigate  @expand
@action  @remove  @search  @suggest  @closed  @before-close
@menu-select  @menu-open  @menu-close  @queued
```

The `before-close` event is cancelable: `@before-close.prevent` prevents the
dialog from closing. Native events such as `click` and `submit` work
normally.

```ts
// src/bolle.ts
export function detail<T>(event: Event): T {
  return (event as CustomEvent<T>).detail;
}
```

### Controlled value

Form components do not emit a native `input` event: they emit
`value-input` on every keystroke and `change` on confirmation. The pattern is
always the same: you pass `:value` (or `:checked`, `:selected`) and realign the
state in the handler.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { detail } from "./bolle";

const email = ref("");
const accepted = ref(false);
</script>

<template>
  <bolle-text-field
    label="Email"
    type="email"
    :value="email"
    @value-input="email = detail<{ value: string }>($event).value"
  />
  <bolle-checkbox
    label="Accetto i termini"
    :checked="accepted"
    @change="accepted = detail<{ checked: boolean }>($event).checked"
  />
</template>
```

For checkbox, switch, radio, filter chip, segmented buttons, list and tabs the
returned value is a boolean (`checked`, `selected`) or an id (`value`), not
an input string.

### Refs and methods

Dialog, sheet, snackbar, tooltip, menu, fab-menu and carousel expose imperative
methods. They are called on a template ref typed with the component class.

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleSnackbar } from "bolle-web-components";

const snackbar = ref<BolleSnackbar | null>(null);
</script>

<template>
  <bolle-snackbar ref="snackbar" message="Documento salvato" />
  <bolle-button @click="snackbar?.show('Documento salvato')"
    >Salva</bolle-button
  >
</template>
```

### Form

Form components are form-associated: `bolle-button` with
`type="submit"`, checkbox, switch, radio, text field, search, slider,
segmented buttons, date picker, time picker and filter chip enter the
`FormData` with `name` and `value`. No hidden inputs are needed and names are
not duplicated.

```vue
<form @submit.prevent="onSubmit">
  <bolle-text-field name="email" label="Email" required />
  <bolle-checkbox name="newsletter" value="si" label="Newsletter" />
  <bolle-button type="submit">Iscriviti</bolle-button>
</form>
```

```ts
function onSubmit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement);
  console.log(data.get("email"), data.get("newsletter"));
}
```

`form.reset()` restores the controls to their initial value, including date
ranges, range sliders and multiple selections.

### Language, direction and theme

Pickers use `locale` (default `document.documentElement.lang`) and accept
overrides with `:labels`. Components read the direction from the ancestor via
`:dir()`: setting `dir="rtl"` on `<html>` or on a container is enough. The theme
is changed with `data-theme="dark"` on `<html>`.

```vue
<bolle-date-picker
  label="Data"
  locale="it"
  :labels="{ open: 'Apri calendario', confirm: 'Conferma' }"
/>
```

### Keyboard shortcuts

Every `bolle-*` element except `bolle-menu` accepts `shortcut`, written in the
`aria-keyshortcuts` syntax (`Alt+S`, `Control+Shift+F`, alternatives separated by
a space). The component writes `aria-keyshortcuts` on its focusable inner
control: buttons, links, checkboxes and radios are focused and clicked, fields
are focused. Disabled or hidden components ignore the shortcut.

```vue
<template>
  <bolle-button shortcut="Alt+S" @click="save">Save</bolle-button>
  <bolle-text-field
    label="Search"
    shortcut="Control+K Meta+K"
  ></bolle-text-field>
</template>
```

`:shortcut="value"` makes it dynamic; an empty string removes the shortcut and
the ARIA attribute.

### Icons and slots

Slots accept Vue nodes: `<svg slot="icon">`, `<span slot="leading">`,
`<img slot="media">`. The `icon` field inside item arrays, on the other hand, is
rendered as text: use a Material Symbols ligature name with the icon font
loaded by the project, or a character. Do not pass HTML markup as a
string, because it would be shown literally.

The library does not include an icon font. The demo uses inline SVG in slots and
ligature names in items.

### Applied state and hooks

Components apply the reader's change themselves and report it with an event:
sorting, page, selection, row expansion, grouping, columns, moving a card or a
task. There is no need to write the state back while listening; the event stays
useful to know what changed.

When the data lives on a server the component hands the work to a hook:
`sortHandler`, `pageHandler` and `columnHandler` on the data table, `restrict` on
kanban and gantt. The hook receives the request and the component redraws once
the promise settles. In Vue these are function properties, so they are bound in
camelCase: `:sortHandler`, `:itemRenderer`, `:restrict`.

<!-- catalogue -->

## Component catalogue

Every component lists its attributes, JavaScript properties, slots and public events; the example is the first recipe of the site documentation, already written for this framework.

### bolle-button

Attributes: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Events: `change`

**Button with an icon** — The variant decides the shape: filled for the main action, tonal for the secondary, outlined and text for the others. The default slot takes the text, icon the start icon and trailing-icon the end one.

```vue
<template>
  <bolle-button variant="filled">Salva la commessa</bolle-button>
  <bolle-button variant="outlined">
    <span slot="icon" aria-hidden="true">★</span>
    Archivia
  </bolle-button>
  <bolle-button variant="text" href="#/commesse"
    >Tutte le commesse</bolle-button
  >
</template>
```

More recipes: Button that stays pressed

### bolle-icon-button

Attributes: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Events: `change`

**Icon button** — label is required because it is the name read by screen readers, since the button shows only the symbol. variant standard leaves the icon without a background, filled rests it on a surface.

```vue
<template>
  <bolle-icon-button label="Cerca">
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-icon-button>
  <bolle-icon-button variant="filled" label="Aggiungi">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-icon-button>
</template>
```

### bolle-floating-action-button

Attributes: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Events: `change`

**Floating button** — The floating button stays anchored to the corner of its container and shows only the symbol: label is the accessible name and is always required. size regular stays round, extended adds the text.

```vue
<template>
  <div class="tela">
    <bolle-floating-action-button label="Nuova commessa">
      <span slot="icon" aria-hidden="true">+</span>
    </bolle-floating-action-button>
  </div>
</template>

<style>
.tela {
  position: relative;
  block-size: 320px;
}
.tela bolle-floating-action-button {
  position: absolute;
  inset-block-end: 16px;
  inset-inline-end: 16px;
}
</style>
```

### bolle-extended-fab

Attributes: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Events: `change`

**Extended floating button** — The extended form shows icon and text together: the icon slot takes the symbol, the default slot the text. It stays the button of the main action of the screen.

```vue
<template>
  <bolle-extended-fab>
    <span slot="icon" aria-hidden="true">+</span>
    Nuova commessa
  </bolle-extended-fab>
</template>
```

### bolle-button-group

Attributes: `label`, `required`, `selection`, `shape`, `size`, `variant` · Slots: `default` · Events: `selection-change`

**Connected buttons** — The group joins adjacent buttons: variant connected removes the space and shares the borders, selection single turns the group into a single choice and reports the value with change.

```vue
<script setup lang="ts">
import { ref } from "vue";

const vista = ref("elenco");
</script>

<template>
  <bolle-button-group
    variant="connected"
    selection="single"
    label="Vista"
    @change="vista = $event.detail.value"
  >
    <bolle-button
      variant="outlined"
      value="elenco"
      :selected="vista === 'elenco'"
    >
      Elenco
    </bolle-button>
    <bolle-button
      variant="outlined"
      value="griglia"
      :selected="vista === 'griglia'"
    >
      Griglia
    </bolle-button>
  </bolle-button-group>
</template>
```

### bolle-badge

Attributes: `label`, `max`, `small`, `value` · Slots: `label` · Events: -

**Badge on an element** — The badge shows value over the element that contains it and shortens the number beyond max to “999+”. small drops the text and keeps the dot, for a badge without a number.

```vue
<template>
  <bolle-badge value="12">
    <bolle-icon-button label="Messaggi">
      <span slot="icon" aria-hidden="true">★</span>
    </bolle-icon-button>
  </bolle-badge>

  <bolle-badge value="1200" :max="99">
    <bolle-avatar name="Giulia Ferraro"></bolle-avatar>
  </bolle-badge>
</template>
```

### bolle-bottom-app-bar

Attributes: `align`, `divider`, `dock`, `label`, `sticky`, `variant` · Slots: `default`, `fab`, `leading`, `trailing` · Events: -

**Bottom bar with a floating button** — The bottom bar holds the inline commands and the floating button: the default slot takes the commands, leading and trailing the elements at the sides, fab the button that fits into the notch. dock brings the button inside the bar.

```vue
<template>
  <bolle-bottom-app-bar dock>
    <bolle-icon-button slot="leading" label="Menu">
      <span slot="icon" aria-hidden="true">★</span>
    </bolle-icon-button>
    <bolle-icon-button label="Cerca">
      <span slot="icon" aria-hidden="true">+</span>
    </bolle-icon-button>
    <bolle-floating-action-button slot="fab" label="Nuova commessa">
      <span slot="icon" aria-hidden="true">+</span>
    </bolle-floating-action-button>
  </bolle-bottom-app-bar>
</template>
```

### bolle-avatar

Attributes: `alt`, `color`, `initials`, `label`, `name`, `shape`, `size`, `src`, `status` · Slots: `badge`, `icon` · Events: -

**Avatar with an image or the initials** — src shows the image and, when it is missing or fails to load, the component falls back to the initials taken from name. initials sets them by hand, status adds the presence dot and size changes the size.

```vue
<script setup lang="ts">
const persone = [
  { src: "/giulia.jpg", name: "Giulia Ferraro", status: "online" },
  { name: "Marco Bellini", size: "lg" },
  { initials: "GF", color: "tertiary" },
];
</script>

<template>
  <bolle-avatar
    v-for="persona in persone"
    :key="persona.name ?? persona.initials"
    v-bind="persona"
  ></bolle-avatar>
</template>
```

More recipes: Avatar with an icon instead of the initials

### bolle-breadcrumb

Attributes: `label`, `max-items`, `separator` · JavaScript properties: `items`, `labels` · Slots: - · Events: `breadcrumb-select`

**Breadcrumb path** — items declares the entries of the path: the component puts the separator between them and marks the last one as the current page. separator chooses the sign, max-items squeezes the middle entries behind a command.

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BreadcrumbItem } from "@bolle/web-components";

const items = ref<BreadcrumbItem[]>([
  { label: "Home", href: "#/it/" },
  { label: "Commesse", href: "#/it/commesse" },
  { label: "C2026-1000" },
]);

const onSelect = (event: CustomEvent<BreadcrumbItem>) => {
  console.log("Voce scelta:", event.detail.label);
};
</script>

<template>
  <bolle-breadcrumb
    label="Percorso"
    :items="items"
    @breadcrumb-select="onSelect"
  ></bolle-breadcrumb>
</template>
```

### bolle-avatar-group

Attributes: `interactive`, `label`, `max`, `overlap`, `size`, `total` · JavaScript properties: `labels` · Slots: `default` · Events: `avatar-group-select`

**Avatar group** — The group stacks the avatars it receives and sums the rest in a bubble with a count: max decides how many to show, total tells how many there are when not all are passed.

```vue
<script setup lang="ts">
const partecipanti = [
  { name: "Giulia Ferraro" },
  { name: "Marco Bellini" },
  { name: "Sara Colombo" },
];
</script>

<template>
  <bolle-avatar-group label="Partecipanti" :max="3" :total="8">
    <bolle-avatar
      v-for="persona in partecipanti"
      :key="persona.name"
      :name="persona.name"
    ></bolle-avatar>
  </bolle-avatar-group>
</template>
```

More recipes: Interactive count bubble

### bolle-empty-state

Attributes: `align`, `role`, `text`, `title`, `tone` · JavaScript properties: `icon` · Slots: `actions`, `icon` · Events: -

**Empty state with a command** — The empty state centres an icon, a title and a text; the actions slot takes the command that leaves the empty state. tone error colours it for a loading error.

```vue
<template>
  <bolle-empty-state
    title="Nessuna commessa"
    text="Non ci sono commesse per questo filtro."
  >
    <bolle-button slot="actions" variant="filled">Crea commessa</bolle-button>
  </bolle-empty-state>

  <bolle-empty-state
    tone="error"
    title="Piano non raggiungibile"
    text="Riprova fra qualche istante."
  >
    <bolle-button slot="actions" variant="tonal">Riprova</bolle-button>
  </bolle-empty-state>
</template>
```

More recipes: Custom icon and alignment

### bolle-pagination

Attributes: `form`, `label`, `page`, `page-size`, `range`, `total` · JavaScript properties: `labels`, `pageSizes` · Slots: - · Events: `page-change`

**Pager over the rows at hand** — page-size turns the pager on and total says how many rows exist: the component moves to the requested page on its own and reports it with page-change, so the application slices the data it shows.

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { PaginationChangeDetail } from "@bolle/web-components";

const total = ref(248);

const onPage = (event: CustomEvent<PaginationChangeDetail>) => {
  const { page, pageSize } = event.detail;
  console.log("Pagina", page, "di", pageSize);
};
</script>

<template>
  <bolle-pagination
    label="Pagine"
    page-size="10"
    :total="total"
    @page-change="onPage"
  ></bolle-pagination>
</template>
```

More recipes: Choosing the size and compact form

### bolle-progress-indicator

Attributes: `indeterminate`, `label`, `max`, `value`, `variant`, `wavy` · Slots: - · Events: -

**Linear and circular progress** — value says how much is done against max, label is the name read by screen readers. variant circular switches to the ring, indeterminate reports a wait without a value.

```vue
<template>
  <bolle-progress-indicator :value="62" label="Avanzamento cantieri" />
  <bolle-progress-indicator
    :value="30"
    variant="circular"
    label="Avanzamento"
  />
  <bolle-progress-indicator indeterminate label="Caricamento" />
</template>
```

### bolle-loading-indicator

Slots: - · Events: -

**Loading indicator** — The indicator shows the wait of an operation: label is the name read by screen readers and is always required. variant contained rests it on a surface when it covers a tile.

```vue
<template>
  <bolle-loading-indicator label="Caricamento delle commesse" />
  <bolle-loading-indicator variant="contained" label="Aggiornamento" />
</template>
```

### bolle-snackbar

Attributes: `action-label`, `close-label`, `duration`, `message`, `open`, `tail` · Slots: `action`, `dismiss`, `message` · Events: `action`, `closed`, `queued`

**Message with an action** — show() opens the message and duration closes it by itself: the message slot takes the text, action the action beside it and dismiss the closing command. message stays the shortcut for the text alone.

```vue
<script setup lang="ts">
import { ref } from "vue";

const messaggio = ref<HTMLElement | null>(null);
</script>

<template>
  <bolle-button variant="filled" @click="messaggio?.show()"
    >Archivia</bolle-button
  >

  <bolle-snackbar ref="messaggio" duration="6000">
    <span slot="message">Commessa archiviata</span>
    <bolle-button slot="action" variant="text" @click="ripristina"
      >Annulla</bolle-button
    >
  </bolle-snackbar>
</template>
```

### bolle-tour

Attributes: `index`, `locale`, `open`, `padding`, `placement` · JavaScript properties: `steps` · Slots: - · Events: `finish`, `step-change`

**Tour from the JSON configuration** — The steps are not in the code: parseTourConfig reads the JSON with its version and shouldStartTour compares it with the one the application already showed. The component does no network access and remembers nothing, so the application decides when to start and stores the version on finish.

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  parseTourConfig,
  shouldStartTour,
  type TourStep,
} from "@bolle/web-components";

const tour = ref<{ start: (index?: number) => void }>();
const steps = ref<TourStep[]>([]);
let version = "";

const start = () => tour.value?.start();

onMounted(async () => {
  const config = parseTourConfig(await (await fetch("/tour.json")).text());
  steps.value = config.steps;
  version = config.version;
  if (shouldStartTour(config, localStorage.getItem("bolle-tour"))) start();
});

const onFinish = (event: CustomEvent<{ completed: boolean }>) => {
  if (event.detail.completed) localStorage.setItem("bolle-tour", version);
};
</script>

<template>
  <bolle-button variant="tonal" @click="start">Rivedi il tour</bolle-button>
  <bolle-tour ref="tour" :steps="steps" @finish="onFinish"></bolle-tour>
</template>
```

More recipes: A step without a target and the closing action · Filter the jobs · The table · That is it · Drive the tour and read the steps

### bolle-tooltip

Attributes: `label`, `persistent`, `supporting-text`, `tail`, `variant` · JavaScript properties: `labels` · Slots: `actions`, `content`, `default`, `dismiss`, `label`, `supporting`, `trigger` · Events: -

**Tooltip on a command** — The tooltip attaches to an element with show(anchor) and closes by itself when the pointer leaves or Esc arrives. label is the short text, supporting-text adds the detail line.

```vue
<script setup lang="ts">
const hint = ref<HTMLElement | null>(null);
const salva = ref<HTMLElement | null>(null);
</script>

<template>
  <bolle-icon-button
    ref="salva"
    label="Salva"
    @pointerenter="hint?.show(salva)"
    @pointerleave="hint?.close()"
  >
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-icon-button>

  <bolle-tooltip
    ref="hint"
    label="Salva la commessa"
    supporting-text="Scorciatoia: Ctrl e S"
  >
  </bolle-tooltip>
</template>
```

### bolle-carousel

Attributes: `index`, `label`, `next-label`, `previous-label`, `variant` · Slots: `controls`, `default`, `next`, `previous`, `status` · Events: `change`

**Card carousel** — The carousel scrolls the items of the default slot and shows the forward and backward commands: index says which one is visible and the change arrives with change. It moves in steps, with touch and keyboard.

```vue
<template>
  <bolle-carousel label="Schede" @change="indice = $event.detail.index">
    <bolle-card>Prima scheda</bolle-card>
    <bolle-card>Seconda scheda</bolle-card>
    <bolle-card>Terza scheda</bolle-card>
  </bolle-carousel>
</template>
```

### bolle-card

Attributes: `href`, `label`, `orientation`, `tail`, `variant` · Slots: `content`, `default`, `media` · Events: -

**Card with image and commands** — The card takes the content from the default slot, from media the lead image that fills the width and from actions the command row. href turns the whole card into a link.

```vue
<template>
  <bolle-card variant="filled">
    <img slot="media" alt="" src="/cantiere.jpg" />
    <h3>Ristrutturazione scuola</h3>
    <p>Consegna prevista a marzo 2027.</p>
    <bolle-button slot="actions" variant="text">Apri</bolle-button>
  </bolle-card>
</template>
```

More recipes: Horizontal card as a link

### bolle-dialog

Attributes: `close-label`, `label`, `modal`, `open`, `variant` · Slots: `actions`, `default`, `heading` · Events: `before-close`, `closed`

**Confirmation dialog** — open opens the dialog and modal makes it blocking: the focus stays inside until it closes, and the closing arrives with closed. heading takes the title read as a heading, actions the command row.

```vue
<script setup lang="ts">
import { ref } from "vue";

const aperto = ref(false);
const chiuso = (event: CustomEvent<{ returnValue: string }>) => {
  aperto.value = false;
  if (event.detail.returnValue === "archivia") archiviaLaCommessa();
};
</script>

<template>
  <bolle-button variant="filled" @click="aperto = true">Archivia</bolle-button>

  <bolle-dialog label="Archivia commessa" modal :open="aperto" @closed="chiuso">
    <h2 slot="heading">Archiviare la commessa?</h2>
    <p>La commessa esce dagli elenchi attivi e resta consultabile.</p>
    <bolle-button slot="actions" variant="text" @click="aperto = false">
      Annulla
    </bolle-button>
    <bolle-button slot="actions" variant="filled">Archivia</bolle-button>
  </bolle-dialog>
</template>
```

More recipes: Full-screen dialog

### bolle-bottom-sheet

Attributes: `close-label`, `drag-handle`, `label`, `modal`, `open`, `variant` · Slots: `actions`, `default`, `heading` · Events: `before-close`, `closed`

**Bottom sheet** — The sheet enters from the bottom edge and brings its commands along: drag-handle shows the grip that drags it, heading the title, actions the final row. open and show() open it.

```vue
<script setup lang="ts">
import { ref } from "vue";

const aperto = ref(false);
</script>

<template>
  <bolle-button variant="filled" @click="aperto = true">Filtri</bolle-button>
  <bolle-bottom-sheet label="Filtri" drag-handle modal :open="aperto">
    <h2 slot="heading">Filtri</h2>
    <p>Scegli lo stato delle commesse.</p>
    <bolle-button slot="actions" variant="text" @click="aperto = false">
      Annulla
    </bolle-button>
    <bolle-button slot="actions" variant="filled">Applica</bolle-button>
  </bolle-bottom-sheet>
</template>
```

### bolle-side-sheet

Attributes: `close-label`, `detached`, `label`, `modal`, `open`, `variant` · Slots: `actions`, `default`, `heading` · Events: `before-close`, `closed`

**Side panel of detail** — The panel enters from the side set by placement and leaves the content visible: it is the right form for the detail of a row, with heading for the title and actions for the trailing commands.

```vue
<script setup lang="ts">
import { ref } from "vue";

const aperto = ref(false);
</script>

<template>
  <bolle-button variant="tonal" @click="aperto = true">Dettaglio</bolle-button>
  <bolle-side-sheet
    label="Dettaglio commessa"
    placement="end"
    modal
    :open="aperto"
  >
    <h2 slot="heading">C2026-1000</h2>
    <p>Ristrutturazione scuola di Seriate.</p>
    <bolle-button slot="actions" variant="filled">Apri scheda</bolle-button>
  </bolle-side-sheet>
</template>
```

### bolle-divider

Attributes: `decorative`, `inset`, `variant`, `vertical` · Slots: - · Events: -

**Divider between groups** — The divider has no content: it divides two groups of elements, with inset to detach it from the edges and vertical to separate side-by-side commands.

```vue
<template>
  <p>Committenti</p>
  <bolle-divider inset></bolle-divider>
  <p>Fornitori</p>

  <span>Esporta</span>
  <bolle-divider vertical></bolle-divider>
  <span>Archivia</span>
</template>
```

### bolle-app-bar

Attributes: `alignment`, `collapsed`, `label`, `scrolled`, `sticky`, `subtitle`, `variant` · Slots: `actions`, `default`, `leading`, `title`, `trailing` · Events: -

**Application bar** — The bar carries the title and the commands: title takes the main text, subtitle the line below, the leading and actions slots the commands at the sides. The default slot replaces the title when a richer header is needed.

```vue
<template>
  <bolle-app-bar title="Commesse" subtitle="12 attive" sticky>
    <bolle-icon-button slot="leading" label="Menu">
      <span slot="icon" aria-hidden="true">★</span>
    </bolle-icon-button>
    <bolle-icon-button slot="actions" label="Cerca">
      <span slot="icon" aria-hidden="true">+</span>
    </bolle-icon-button>
  </bolle-app-bar>
</template>
```

More recipes: Bar that shrinks on scroll

### bolle-toolbar

Attributes: `color`, `label`, `orientation`, `variant` · Slots: `default` · Events: -

**Command bar** — The bar lays out the elements it receives in the default slot: different variants separate the main commands from the service ones, and the bar wraps the extra elements instead of squeezing them.

```vue
<template>
  <bolle-toolbar label="Azioni sulle commesse">
    <bolle-segmented-buttons label="Vista" :items="viste" />
    <bolle-button variant="text">Esporta</bolle-button>
    <bolle-button variant="text">Archivia</bolle-button>
  </bolle-toolbar>
</template>
```

### bolle-navigation-bar

Attributes: `label`, `layout`, `value`, `variant` · JavaScript properties: `items` · Slots: - · Events: `navigate`

**Navigation bar** — items declares the destinations with icon and text, value says which one is active: the component applies the choice on its own and reports it with change. Above five destinations it is better to switch to the side bar.

```vue
<script setup lang="ts">
import { ref } from "vue";

const sezione = ref("commesse");
const sezioni = [
  { id: "commesse", label: "Commesse" },
  { id: "clienti", label: "Clienti" },
  { id: "scadenze", label: "Scadenze" },
];
</script>

<template>
  <bolle-navigation-bar
    label="Sezioni"
    :items="sezioni"
    :value="sezione"
    @change="sezione = $event.detail.value"
  ></bolle-navigation-bar>
</template>
```

### bolle-navigation-rail

Attributes: `expanded`, `label`, `layout`, `value`, `variant` · JavaScript properties: `items` · Slots: - · Events: `navigate`

**Narrow bar** — The narrow bar shows the icons of the destinations and, with expanded, also the texts. It sits between the bottom bar and the side panel, when space is short but the sections stay many.

```vue
<template>
  <bolle-navigation-rail
    label="Sezioni"
    expanded
    :items="sezioni"
    :value="sezione"
    @change="sezione = $event.detail.value"
  ></bolle-navigation-rail>
</template>
```

### bolle-navigation-drawer

Attributes: `close-label`, `detached`, `label`, `modal`, `open`, `value`, `variant` · JavaScript properties: `items` · Slots: `actions`, `default`, `heading` · Events: `before-close`, `closed`, `navigate`

**Navigation panel** — The panel opens the entries vertically and can sit inline beside the content or over the page: placement start or end chooses the side, modal makes it blocking.

```vue
<template>
  <bolle-navigation-drawer
    label="Sezioni"
    open
    :items="sezioni"
    :value="sezione"
    @change="sezione = $event.detail.value"
  >
    <h2 slot="heading">Commesse</h2>
    <span slot="actions">Versione 0.3.3</span>
  </bolle-navigation-drawer>
</template>
```

### bolle-tabs

Attributes: `activation`, `label`, `scrollable`, `value`, `variant` · JavaScript properties: `items`, `labels` · Slots: `content-{itemId}`, `default` · Events: `change`

**Tabs with panels** — items declares the tabs and value the active one: the component applies the choice on its own and reports it with change. Every panel names the tab that opens it through slot.

```vue
<script setup lang="ts">
import { ref } from "vue";

const scheda = ref("note");
const schede = [
  { id: "note", label: "Note" },
  { id: "documenti", label: "Documenti", count: 3 },
];
</script>

<template>
  <bolle-tabs
    label="Dettaglio"
    :items="schede"
    :value="scheda"
    @change="scheda = $event.detail.value"
  >
    <div slot="note">Note della commessa</div>
    <div slot="documenti">Documenti allegati</div>
  </bolle-tabs>
</template>
```

More recipes: Tabs that scroll

### bolle-checkbox

Attributes: `checked`, `error`, `indeterminate`, `supporting-text` · Slots: `default` · Events: `change`

**Checkbox with text and support** — The checkbox takes the label text from the default slot and changes state on its own, reporting checked with change. supporting-text adds the explanation line, indeterminate shows the mixed state.

```vue
<template>
  <bolle-checkbox name="urgente">Segna come urgente</bolle-checkbox>
  <bolle-checkbox
    name="privacy"
    required
    supporting-text="Serve per inviare la richiesta"
  >
    Ho letto l'informativa
  </bolle-checkbox>
</template>
```

More recipes: Checkbox that drives a list

### bolle-switch

Attributes: `checked`, `error`, `indeterminate`, `supporting-text` · JavaScript properties: `icon`, `iconSelected` · Slots: `default` · Events: `change`

**Switch** — The switch changes state on its own and reports the value with change: it is the right form for a preference with immediate effect, while the checkbox stays for a choice to confirm.

```vue
<script setup lang="ts">
import { ref } from "vue";

const notifiche = ref(true);
</script>

<template>
  <bolle-switch
    name="notifiche"
    :checked="notifiche"
    @change="notifiche = $event.detail.checked"
  >
    Notifiche attive
  </bolle-switch>
</template>
```

### bolle-radio-button

Attributes: `checked`, `error`, `indeterminate`, `supporting-text` · Slots: `default` · Events: `change`

**Group of options** — The radio buttons group by name: choosing one entry clears the others of the same group, and the value arrives with change.

```vue
<script setup lang="ts">
import { ref } from "vue";

const priorita = ref("alta");
const opzioni = ["alta", "media", "bassa"];
</script>

<template>
  <bolle-radio-button
    v-for="valore in opzioni"
    :key="valore"
    name="priorita"
    :value="valore"
    :checked="priorita === valore"
    @change="priorita = valore"
  >
    {{ valore }}
  </bolle-radio-button>
</template>
```

### bolle-chip

Attributes: `disabled`, `elevated`, `href`, `label`, `removable`, `remove-label`, `selected`, `variant` · Slots: `avatar`, `default`, `icon` · Events: `action`, `change`, `remove`

**Chip with an icon and removal** — The chip takes its text from the default slot and from the others an icon or an avatar. selected marks it as chosen, removable adds the command that removes it and reports remove.

```vue
<template>
  <bolle-chip selected>Urgente</bolle-chip>
  <bolle-chip removable remove-label="Togli il filtro Cliente">
    <bolle-avatar slot="avatar" name="Giulia Ferraro"></bolle-avatar>
    Cliente
  </bolle-chip>
</template>
```

### bolle-list

Attributes: `interactive`, `label`, `selection`, `variant` · JavaScript properties: `expanded`, `itemRenderer`, `items`, `labels`, `value` · Slots: `default` · Events: `action`, `change`, `expand`

**List with icons and detail** — The list takes the rows from the default slot and composes them with icon, text, support and trailing content; interactive enables the click and selection reports the choice with change.

```vue
<template>
  <bolle-list
    label="Commesse"
    interactive
    selection="single"
    @change="scelta = $event.detail.value"
  >
    <bolle-list-item>
      <span slot="leading" aria-hidden="true">★</span>
      C2026-1000
      <span slot="supporting">Ristrutturazione scuola</span>
      <span slot="trailing">12</span>
    </bolle-list-item>
    <bolle-list-item>C2026-1001</bolle-list-item>
  </bolle-list>
</template>
```

More recipes: List from an array

### bolle-segmented-buttons

Attributes: `multiple` · JavaScript properties: `items`, `values` · Slots: - · Events: `change`

**Choice among segments** — The segments come from items and the choice from value: the control applies it on its own and reports it with change. multiple allows more than one segment and reports values.

```vue
<script setup lang="ts">
import { ref } from "vue";

const vista = ref("elenco");

const items = [
  { id: "elenco", label: "Elenco" },
  { id: "griglia", label: "Griglia" },
  { id: "mappa", label: "Mappa" },
];
</script>

<template>
  <bolle-segmented-buttons
    label="Vista"
    :items="items"
    :value="vista"
    @change="vista = $event.detail.value"
  ></bolle-segmented-buttons>
</template>
```

More recipes: Multiple choice

### bolle-slider

Attributes: `compact`, `max`, `min`, `min-gap`, `step`, `suffix`, `upper-label`, `upper-value`, `variant` · JavaScript properties: `icon` · Slots: `icon`, `label`, `value` · Events: `change`, `value-input`

**Single thumb** — The slider shows the value on the label and reports it with input while dragging and with change at the end. min and max set the range, step the granularity.

```vue
<script setup lang="ts">
import { ref } from "vue";

const avanzamento = ref(40);
</script>

<template>
  <bolle-slider
    label="Avanzamento"
    min="0"
    max="100"
    step="5"
    :value="avanzamento"
    @change="avanzamento = Number($event.detail.value)"
  ></bolle-slider>
</template>
```

More recipes: Range between two values

### bolle-steps

Attributes: `options` · Slots: `label` · Events: `change`

**Steps of a path** — options declares the step names and value the current one: the component marks the done steps, the active one and the remaining ones, and reports the choice with change.

```vue
<script setup lang="ts">
import { ref } from "vue";

const passo = ref("1");
const passi = ["Dati", "Documenti", "Riepilogo"];
</script>

<template>
  <bolle-steps
    label="Avanzamento"
    :options="passi"
    :value="passo"
    @change="passo = String($event.detail.index)"
  ></bolle-steps>
</template>
```

### bolle-text-field

Attributes: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Slots: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · Events: `change`, `value-input`

**Field with a prefix and supporting text** — The field takes the prefix, the suffix and the supporting text from the slots, while the value stays in the input and arrives with input and change. variant filled or outlined changes the shape of the box.

```vue
<script setup lang="ts">
import { ref } from "vue";

const importo = ref("");
</script>

<template>
  <bolle-text-field
    label="Importo"
    type="number"
    :value="importo"
    @change="importo = $event.detail.value"
  >
    <span slot="prefix">€</span>
    <span slot="supporting">Importo al netto dell'IVA</span>
  </bolle-text-field>
</template>
```

More recipes: Field in error · Multiline field

### bolle-search

Attributes: `appearance`, `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `filter`, `inputmode`, `layout`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `suggestion-delay`, `suggestions-label`, `supporting-text`, `type`, `variant` · JavaScript properties: `suggestions` · Slots: `leading`, `prefix`, `results`, `suffix`, `supporting`, `trailing` · Events: `change`, `search`, `suggest`, `value-input`

**Search bar with results** — The search is a text field with the clear command already included: results takes the list that appears under the bar, which the application fills with the results of suggest or search.

```vue
<script setup lang="ts">
import { ref } from "vue";

const risultati = ref<Array<{ id: string; label: string }>>([]);
</script>

<template>
  <bolle-search
    label="Cerca commesse"
    @search="risultati = cercaSulServer($event.detail.value)"
  >
    <bolle-list slot="results" label="Risultati">
      <bolle-list-item v-for="voce in risultati" :key="voce.id">
        {{ voce.label }}
      </bolle-list-item>
    </bolle-list>
  </bolle-search>
</template>
```

More recipes: Search inline in the bar

### bolle-date-picker

Attributes: `autocapitalize`, `autocomplete`, `counter`, `end-value`, `enterkeyhint`, `error`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `selection-mode`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant`, `week-starts-on` · JavaScript properties: `labels` · Slots: `end-label`, `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · Events: `change`, `value-input`

**Choosing a date** — The picker opens the calendar from the field: the chosen value arrives with change in ISO format, and locale decides language and day names. selection-mode range adds the second date in end-value.

```vue
<script setup lang="ts">
import { ref } from "vue";

const scadenza = ref("");
</script>

<template>
  <bolle-date-picker
    label="Scadenza"
    :value="scadenza"
    @change="scadenza = $event.detail.value"
  ></bolle-date-picker>
</template>
```

More recipes: Date range

### bolle-time-picker

Attributes: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `hour-cycle`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · JavaScript properties: `labels` · Slots: `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · Events: `change`, `value-input`

**Choosing a time** — The picker opens the hour dial from the field: the chosen value arrives with change, hour-cycle decides the twelve or twenty-four hour format and the title slot names the dial.

```vue
<script setup lang="ts">
import { ref } from "vue";

const consegna = ref("");
</script>

<template>
  <bolle-time-picker
    label="Consegna"
    hour-cycle="24"
    :value="consegna"
    @change="consegna = $event.detail.value"
  >
    <span slot="title">Orario di consegna</span>
  </bolle-time-picker>
</template>
```

### bolle-menu

Attributes: `color-scheme`, `compact-width`, `density`, `filter`, `filterable`, `inactive`, `locale`, `menu-label`, `options`, `quick`, `selection-mode`, `tail`, `variant` · JavaScript properties: `items`, `labels` · Slots: - · Events: -

**Menu of actions** — show(anchor) opens the menu under the element that calls it and the choice arrives with menu-select. items declares the entries, with icon, shortcut, disabled and children for the submenu.

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { MenuEntry } from "@bolle/web-components";

const items: MenuEntry[] = [
  { id: "apri", label: "Apri scheda" },
  { id: "duplica", label: "Duplica", shortcut: "Ctrl D" },
  {
    id: "archivia",
    label: "Archivia",
    children: [{ id: "chiudi", label: "Chiudi anche i documenti" }],
  },
];

const menu = ref<HTMLElement | null>(null);
</script>

<template>
  <bolle-button variant="tonal" @click="menu?.show($event.currentTarget)">
    Azioni
  </bolle-button>
  <bolle-menu
    ref="menu"
    label="Azioni"
    :items="items"
    @menu-select="onScelta"
  ></bolle-menu>
</template>
```

### bolle-fab-menu

Attributes: `color`, `label`, `open`, `tail` · JavaScript properties: `items` · Slots: `icon` · Events: `action`

**Quick actions** — The floating button menu opens the secondary actions from the main button: items declares the entries, open says whether it is open and the choice arrives with menu-select.

```vue
<template>
  <bolle-fab-menu label="Azioni rapide" :items="items">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-fab-menu>
</template>
```

### bolle-split-button

Attributes: `disabled`, `icon`, `label`, `menu-label`, `size`, `variant` · JavaScript properties: `items` · Slots: `icon` · Events: `action`

**Main action and menu** — The split button keeps the main action on the left and opens the menu from the command beside it: the entries come from items and the choice with menu-select, while the click on the main action arrives with click.

```vue
<script setup lang="ts">
const items = [
  { id: "bozza", label: "Salva come bozza" },
  { id: "duplica", label: "Salva e duplica" },
];
</script>

<template>
  <bolle-split-button label="Salva" variant="filled" :items="items">
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-split-button>
</template>
```

### bolle-select

Attributes: `error`, `open`, `placeholder`, `supporting-text`, `variant` · Slots: `supporting` · Events: `change`

**Select with native options** — The select wraps a native select element: the options stay in the markup and the value arrives with change. The menu that opens is the component one, with the same shape as the text fields.

```vue
<script setup lang="ts">
import { ref } from "vue";

const stato = ref("aperta");
</script>

<template>
  <bolle-select
    label="Stato"
    :value="stato"
    @change="stato = $event.detail.value"
  >
    <select name="stato">
      <option value="aperta">In corso</option>
      <option value="chiusa">Chiusa</option>
      <option value="sospesa">Sospesa</option>
    </select>
    <span slot="supporting">Lo stato decide l'ordine delle commesse</span>
  </bolle-select>
</template>
```

### bolle-autocomplete

Attributes: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · JavaScript properties: `options` · Slots: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · Events: `change`, `value-input`

**Field with suggestions** — suggestions declares the suggestions and the component filters them while typing, reporting them with suggest; choosing an entry fills the field and emits change. suggestion-delay sets the wait before asking for the data.

```vue
<script setup lang="ts">
const suggerimenti = [
  { id: "bergamo", label: "Bergamo" },
  { id: "brescia", label: "Brescia" },
  { id: "seriate", label: "Seriate" },
];
</script>

<template>
  <bolle-autocomplete
    label="Comune"
    :suggestions="suggerimenti"
    :suggestion-delay="200"
  ></bolle-autocomplete>
</template>
```

### bolle-sidebar

Attributes: `collapsed`, `context`, `current`, `label`, `max-width`, `min-width`, `search`, `variant`, `width` · JavaScript properties: `contentStyles`, `empty`, `expanded`, `filter`, `item`, `items`, `labels`, `railItem` · Slots: `empty`, `filter`, `footer`, `header` · Events: `collapse`, `expand`, `navigate`, `resize`

**Navigation tree** — items declares the entries and their children: the component builds the tree up to three levels, opens the branch of the chosen entry and reports the path with navigate. The current entry is set with current, the path of the entries separated by a slash.

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { SidebarItem, SidebarNavigateDetail } from "@bolle/web-components";

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

const current = ref("commesse/attive");

// La sidebar applica la scelta da sé: l'evento serve per navigare.
const onNavigate = (event: CustomEvent<SidebarNavigateDetail>) => {
  current.value = event.detail.path;
};
</script>

<template>
  <bolle-sidebar
    label="Navigazione"
    style="block-size: 520px"
    :items="items"
    :current="current"
    @navigate="onNavigate"
  ></bolle-sidebar>
</template>
```

More recipes: Search, counters and compact rail · Content of an entry

### bolle-app-shell

Attributes: `close-label`, `expanded-width`, `form`, `label`, `medium-width`, `supporting-label`, `supporting-mode`, `supporting-open` · JavaScript properties: `labels` · Slots: `bar`, `bottom-bar`, `default`, `navigation`, `navigation-compact`, `status`, `supporting`, `supporting-actions`, `supporting-header`, `supporting-inline`, `supporting-modal` · Events: `form-change`, `supporting-close`

**Complete shell** — The shell assembles the surfaces around the content: the navigation, the bar, the bottom bar and the supporting panel come from the slots and the main content is the default slot. Areas that receive nothing take no space.

```vue
<template>
  <bolle-app-shell style="block-size: 100dvh">
    <bolle-navigation-drawer slot="navigation" label="Sezioni">
      <a href="#/commesse">Commesse</a>
      <a href="#/clienti">Clienti</a>
    </bolle-navigation-drawer>
    <bolle-app-bar slot="bar" title="Commesse"></bolle-app-bar>
    <main>Contenuto della pagina</main>
    <bolle-bottom-app-bar slot="bottom-bar"></bolle-bottom-app-bar>
  </bolle-app-shell>
</template>
```

More recipes: Supporting panel

### bolle-dashboard

Attributes: `columns`, `compact-columns`, `density`, `label`, `medium-columns` · JavaScript properties: `labels` · Slots: `default` · Events: -

**Grid of tiles** — The dashboard lays out the tiles it receives and imposes no content: every tile is a bolle-widget, and span decides how many columns it takes while min-span sets the minimum when space narrows.

```vue
<template>
  <bolle-dashboard label="Panoramica" style="block-size: 640px">
    <bolle-widget title="Lavori in ritardo" span="8" min-span="4">
      <p>Quattro commesse oltre la scadenza.</p>
    </bolle-widget>
    <bolle-widget title="Avanzamento cantieri" span="4" min-span="3">
      <bolle-progress-indicator value="62" label="Avanzamento" />
    </bolle-widget>
  </bolle-dashboard>
</template>
```

More recipes: Movable and resizable tiles

### bolle-kanban

Attributes: `addable`, `card-gap`, `collapsible`, `column-gap`, `column-max-width`, `column-min-width`, `density`, `empty-label`, `error`, `label`, `lanes`, `loading`, `movable`, `selected` · JavaScript properties: `card`, `cardActions`, `cards`, `collapsed`, `columnActions`, `columnRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `labels`, `laneLabel`, `laneRenderer`, `loadingRenderer`, `restrict` · Slots: `empty`, `error`, `loading` · Events: `card-action`, `card-add`, `card-move`, `card-move-blocked`, `card-open`, `column-action`, `column-collapse`, `retry`

**Minimal board** — columns declares the columns and cards the cards, each with the column it sits in. With movable the reader drags the card or moves it with Alt and the arrows: the board applies the move and reports it with card-move.

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { KanbanCard, KanbanColumn } from "@bolle/web-components";

const columns: KanbanColumn[] = [
  { id: "da-fare", label: "Da fare" },
  { id: "in-corso", label: "In corso" },
  { id: "fatto", label: "Fatto" },
];

const cards = ref<KanbanCard[]>([
  { id: "c-1", column: "da-fare", title: "Sopralluogo" },
  { id: "c-2", column: "in-corso", title: "Posa massetto" },
]);
</script>

<template>
  <bolle-kanban
    label="Cantieri"
    movable
    style="block-size: 520px"
    :columns="columns"
    :cards="cards"
  ></bolle-kanban>
</template>
```

More recipes: Move rule and limits · Card content

### bolle-gantt

Attributes: `baseline`, `density`, `editable`, `empty-label`, `error`, `group-by`, `label`, `linkable`, `loading`, `scale`, `selected` · JavaScript properties: `barRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `groupLabel`, `labels`, `loadingRenderer`, `restrict`, `tasks` · Slots: `empty`, `error`, `loading` · Events: `columns-change`, `dependency-add`, `dependency-blocked`, `retry`, `task-change`, `task-change-blocked`, `task-open`, `task-select`, `view-change`

**Minimal plan** — The plan draws the tasks on the time axis: parent builds the tree and a task with children becomes a summary bar. The host needs a height, because the surface fills the space it receives.

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { GanttTask } from "@bolle/web-components";

const tasks = ref<GanttTask[]>([
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
]);
</script>

<template>
  <bolle-gantt
    label="Piano di commessa"
    style="block-size: 420px"
    :tasks="tasks"
  ></bolle-gantt>
</template>
```

More recipes: Columns and cell content · Moving and resizing · Bar content · States and slots

### bolle-data-table

Attributes: `compact-row-height`, `default-column-width`, `density`, `empty-label`, `error`, `expandable`, `group-by`, `group-height`, `header-height`, `label`, `loading`, `max-column-width`, `min-column-width`, `overscan`, `page`, `page-size`, `row-height`, `row-key`, `selectable`, `total`, `updating`, `variant`, `virtual` · JavaScript properties: `columnHandler`, `columns`, `contentStyles`, `detail`, `emptyRenderer`, `errorRenderer`, `expanded`, `footerRenderer`, `groupRenderer`, `groupSummary`, `headerRenderer`, `labels`, `loadingRenderer`, `pageHandler`, `rowActions`, `rowRenderer`, `rows`, `selected`, `sort`, `sortHandler` · Slots: `empty`, `empty-state`, `error`, `footer`, `header`, `loading` · Events: `column-change`, `expand`, `group`, `retry`, `row-action`, `row-activate`, `select`, `sort`

**Framework slot through a wrapper** — Vue and React cannot pass a scoped slot to a custom element. A wrapper of a few lines turns the slot into a renderer: the page writes the cell template once, the wrapper mounts the content for every row and releases the memory when the cell leaves the document.

```vue
<!-- BolleDataTable.vue -->
<script setup lang="ts">
import { computed, h, onBeforeUnmount, render as mountVue } from "vue";
import type { DataTableColumn, DataTableRow } from "@bolle/web-components";

const props = defineProps<{
  columns: DataTableColumn[];
  rows: DataTableRow[];
}>();

const slots = defineSlots<{
  cell?: (scope: { row: DataTableRow; column: DataTableColumn }) => unknown;
}>();

const hosts = new Map<string, HTMLElement>();
let pruneScheduled = false;

const prune = () => {
  if (pruneScheduled) return;
  pruneScheduled = true;
  queueMicrotask(() => {
    pruneScheduled = false;
    for (const [key, host] of hosts)
      if (!host.isConnected) {
        mountVue(null, host);
        hosts.delete(key);
      }
  });
};

const mount = (key: string, vnode: unknown) => {
  const host = hosts.get(key) ?? document.createElement("span");
  hosts.set(key, host);
  mountVue(vnode as never, host);
  prune();
  return host;
};

const columns = computed(() =>
  props.columns.map((column) => ({
    ...column,
    render: slots.cell
      ? (row: DataTableRow) =>
          mount(
            `${row.id}-${column.key}`,
            h("span", slots.cell!({ row, column })),
          )
      : column.render,
  })),
);

onBeforeUnmount(() => {
  for (const host of hosts.values()) mountVue(null, host);
  hosts.clear();
});
</script>

<template>
  <bolle-data-table v-bind="$attrs" :columns="columns" :rows="rows" />
</template>

<!-- Pagina.vue: il template della cella si scrive una volta. -->
<template>
  <BolleDataTable label="Commesse" row-key="id" :columns="columns" :rows="rows">
    <template #cell="{ row, column }">
      <span v-if="column.key === 'status'" class="badge">
        {{ row.status }}
      </span>
    </template>
  </BolleDataTable>
</template>
```

More recipes: Register the components · Minimal table · Format values · Custom cell · Sorting · Row selection · Row detail · Grouping · Paging · Loading, error and empty · Pinned columns, widths and visibility · Continuous scrolling · Styling with CSS parts
