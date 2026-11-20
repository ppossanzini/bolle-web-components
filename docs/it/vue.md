[Italiano](./vue.md) · [English](../en/vue.md) · [Français](../fr/vue.md) · [中文](../zh/vue.md)

# Vue 3 · esempi d'uso esaustivi

Questa guida copre tutti i 51 componenti della libreria. Ogni sezione elenca gli
attributi pubblici, gli slot, gli eventi e i metodi, poi mostra un esempio Vue 3
che li usa tutti. Gli esempi presuppongono `<script setup lang="ts">` e Vue 3.4 o
successivo. Per React vedi [react.md](./react.md).

I componenti sono Custom Elements: Vue li tratta come elementi nativi, non come
componenti Vue. Questo ha tre conseguenze, spiegate nelle regole di integrazione:
gli attributi restano attributi HTML, gli eventi sono eventi DOM con `detail`,
e i metodi si chiamano tramite un template ref.

## Installazione e registrazione

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

La build della libreria registra già tutti i tag: non servono plugin Vue né
`app.use()`. Il tema chiaro è il default; lo scuro si attiva con
`document.documentElement.dataset.theme = "dark"`, come nella demo.

### Compilatore Vue

Vue deve sapere che i tag `bolle-*` non sono componenti da risolvere.

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

Se la build di Vue avviene a runtime, imposta la stessa regola sull'app:

```ts
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("bolle-");
```

`vue-tsc` non deduce i tipi degli attributi dei Custom Elements. Per una
verifica statica completa servono componenti wrapper tipizzati, come questo:

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

Il wrapper è utile solo se serve il type checking: negli esempi seguenti si
usano direttamente i tag della libreria.

## Regole di integrazione

### Proprietà e attributi

Vue imposta una proprietà DOM quando la chiave esiste sull'elemento, altrimenti
scrive un attributo. Le proprietà che accettano array o oggetti devono quindi
essere legate con `:` e il nome della proprietà, non come stringa:

| Componente                                                                               | Proprietà da legare                              |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `bolle-segmented-buttons`                                                                | `:items`, `:values`                              |
| `bolle-search`                                                                           | `:suggestions`                                   |
| `bolle-date-picker`                                                                      | `:labels`                                        |
| `bolle-list`                                                                             | `:items`, `:value` (anche array), `:expanded`    |
| `bolle-navigation-*`, `bolle-tabs`, `bolle-fab-menu`, `bolle-split-button`, `bolle-menu` | `:items`                                         |
| `bolle-slider`                                                                           | `:iconStart`, `:iconEnd` (accettano SVG o testo) |
| `bolle-switch`                                                                           | `:icon`, `:iconSelected`                         |

Tutti gli altri attributi (`variant`, `size`, `label`, `disabled`, `required`,
`supporting-text`…) funzionano sia come attributi statici sia con `:binding`.
Per gli attributi composti usa la forma kebab-case: `:supporting-text`,
`:upper-value`, `:remove-label`, `:menu-label`, `:close-label`.

Le proprietà dichiarate senza attributo (`icon`, `iconSelected`, `iconStart`,
`iconEnd`, `items`, `values`, `suggestions`, `labels`, `expanded` e `value`
della list) esistono solo come proprietà: si legano con il nome esatto della
proprietà (`:iconStart`, `:items`). Con un template in-DOM il browser abbassa i
nomi degli attributi, quindi in quel caso usa `v-bind="{ iconStart }"`.

I booleani sono attributi riflessi: `<bolle-checkbox checked />` equivale a
`:checked="true"`, mentre `:checked="false"` rimuove l'attributo.

### Eventi

Tutti gli eventi personalizzati sono `bubbles: true` e `composed: true`. In Vue
si ascoltano con `@nome-evento` e il payload è in `event.detail`. I nomi sono
sempre kebab-case:

```
@change  @value-input  @selection-change  @navigate  @expand
@action  @remove  @search  @suggest  @closed  @before-close
@menu-select  @menu-open  @menu-close  @queued
```

L'evento `before-close` è annullabile: `@before-close.prevent` impedisce la
chiusura del dialog. Gli eventi nativi come `click` e `submit` funzionano
normalmente.

```ts
// src/bolle.ts
export function detail<T>(event: Event): T {
  return (event as CustomEvent<T>).detail;
}
```

### Valore controllato

I componenti di form non emettono un evento `input` nativo: emettono
`value-input` a ogni tasto e `change` alla conferma. Il pattern è sempre lo
stesso: passi `:value` (o `:checked`, `:selected`) e riallinei lo stato
nell'handler.

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

Per checkbox, switch, radio, chip filtro, segmented buttons, list e tabs il
valore restituito è un booleano (`checked`, `selected`) o un id (`value`), non
una stringa di input.

### Ref e metodi

Dialog, sheet, snackbar, tooltip, menu, fab-menu e carousel espongono metodi
imperativi. Si chiamano su un template ref tipizzato con la classe del
componente.

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

I componenti di form sono form-associated: `bolle-button` con
`type="submit"`, checkbox, switch, radio, text field, search, slider,
segmented buttons, date picker, time picker e chip filtro entrano nel
`FormData` con `name` e `value`. Non servono input nascosti e i nomi non
vengono duplicati.

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

`form.reset()` riporta i controlli al valore iniziale, compresi intervalli di
date, slider range e selezioni multiple.

### Lingua, direzione e tema

I picker usano `locale` (default `document.documentElement.lang`) e accettano
override con `:labels`. I componenti leggono la direzione dall'antenato tramite
`:dir()`: basta impostare `dir="rtl"` su `<html>` o su un contenitore. Il tema
si cambia con `data-theme="dark"` su `<html>`.

```vue
<bolle-date-picker
  label="Data"
  locale="it"
  :labels="{ open: 'Apri calendario', confirm: 'Conferma' }"
/>
```

### Scorciatoie da tastiera

Ogni elemento `bolle-*` tranne `bolle-menu` accetta `shortcut`, scritto con la
sintassi di `aria-keyshortcuts` (`Alt+S`, `Control+Shift+F`, alternative separate
da uno spazio). Il componente scrive `aria-keyshortcuts` sul controllo interno che
riceve il focus: bottoni, link, checkbox e radio ricevono focus e clic, i campi
solo il focus. I componenti disabilitati o nascosti ignorano la scorciatoia.

```vue
<template>
  <bolle-button shortcut="Alt+S" @click="save">Salva</bolle-button>
  <bolle-text-field
    label="Cerca"
    shortcut="Control+K Meta+K"
  ></bolle-text-field>
</template>
```

Con `:shortcut="value"` diventa dinamica; una stringa vuota rimuove la
scorciatoia e l'attributo ARIA.

### Icone e slot

Gli slot accettano nodi Vue: `<svg slot="icon">`, `<span slot="leading">`,
`<img slot="media">`. Il campo `icon` dentro gli array di item, invece, viene
reso come testo: usa un nome di legatura Material Symbols con il font icone
caricato dal progetto, oppure un carattere. Non passare markup HTML come
stringa, perché verrebbe mostrato letteralmente.

La libreria non include un font icone. La demo usa SVG inline negli slot e nomi
di legatura negli item.

### Stato applicato e agganci

I componenti applicano da sé il cambiamento del lettore e lo riportano con un
evento: ordinamento, pagina, selezione, apertura riga, raggruppamento, colonne,
spostamento di una scheda o di un'attività. Non serve riscrivere lo stato
ascoltando l'evento; l'ascolto resta utile solo per sapere cosa è cambiato.

Quando i dati stanno su un server il componente cede il lavoro a un aggancio:
`sortHandler`, `pageHandler` e `columnHandler` sulla data table, `restrict` su
kanban e gantt. L'aggancio riceve la richiesta, e il componente ridisegna quando
la promessa è risolta. Per Vue sono proprietà con funzione, quindi si legano in
camelCase: `:sortHandler`, `:itemRenderer`, `:restrict`.

<!-- catalogue -->

## Catalogo dei componenti

Ogni componente elenca attributi, proprietà JavaScript, slot ed eventi pubblici; l'esempio è quello della prima ricetta della documentazione del sito, già scritta per questo framework.

### bolle-button

Attributi: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slot: `default`, `icon`, `trailing-icon` · Eventi: `change`

**Pulsante con icona** — La variante decide la forma: filled per l'azione principale, tonal per la secondaria, outlined e text per le altre. Lo slot predefinito porta il testo, icon l'icona iniziale e trailing-icon quella finale.

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

Altre ricette: Pulsante che resta premuto

### bolle-icon-button

Attributi: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slot: `default`, `icon`, `trailing-icon` · Eventi: `change`

**Pulsante a icona** — label è obbligatoria perché è il nome letto dai lettori di schermo, dato che il pulsante mostra solo il simbolo. variant standard lascia l'icona senza sfondo, filled la appoggia su una superficie.

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

Attributi: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slot: `default`, `icon`, `trailing-icon` · Eventi: `change`

**Pulsante flottante** — Il pulsante flottante resta ancorato all'angolo del contenitore e mostra il solo simbolo: label è il nome accessibile e va sempre dichiarata. size regular resta tondo, extended aggiunge il testo.

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

Attributi: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slot: `default`, `icon`, `trailing-icon` · Eventi: `change`

**Pulsante flottante esteso** — La forma estesa mostra icona e testo insieme: lo slot icon porta il simbolo, lo slot predefinito il testo. Resta il pulsante dell'azione principale della schermata.

```vue
<template>
  <bolle-extended-fab>
    <span slot="icon" aria-hidden="true">+</span>
    Nuova commessa
  </bolle-extended-fab>
</template>
```

### bolle-button-group

Attributi: `label`, `required`, `selection`, `shape`, `size`, `variant` · Slot: `default` · Eventi: `selection-change`

**Pulsanti collegati** — Il gruppo unisce pulsanti adiacenti: variant connected toglie lo spazio e condivide i bordi, selection single trasforma il gruppo in una scelta unica e riporta il valore con change.

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

Attributi: `label`, `max`, `small`, `value` · Slot: `label` · Eventi: -

**Segnalazione su un elemento** — Il badge mostra value sopra l'elemento che lo contiene e comprime il numero oltre max in «999+». small toglie il testo e lascia il punto, per una segnalazione senza numero.

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

Attributi: `align`, `divider`, `dock`, `label`, `sticky`, `variant` · Slot: `default`, `fab`, `leading`, `trailing` · Eventi: -

**Barra inferiore con pulsante flottante** — La barra inferiore tiene i comandi in linea e il pulsante flottante: lo slot predefinito riceve i comandi, leading e trailing gli elementi ai lati, fab il pulsante che si incastra nel taglio. dock porta il pulsante dentro la barra.

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

Attributi: `alt`, `color`, `initials`, `label`, `name`, `shape`, `size`, `src`, `status` · Slot: `badge`, `icon` · Eventi: -

**Avatar con immagine o iniziali** — src mostra l'immagine e, quando manca o non si carica, il componente torna alle iniziali ricavate da name. initials le fissa a mano, status aggiunge il punto di presenza e size cambia la misura.

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

Altre ricette: Avatar con icona al posto delle iniziali

### bolle-breadcrumb

Attributi: `label`, `max-items`, `separator` · Proprietà JavaScript: `items`, `labels` · Slot: - · Eventi: `breadcrumb-select`

**Percorso di navigazione** — items dichiara le voci del percorso: il componente mette il separatore fra una voce e l'altra e segna l'ultima come pagina corrente. separator sceglie il segno, max-items comprime le voci centrali dietro un comando.

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

Attributi: `interactive`, `label`, `max`, `overlap`, `size`, `total` · Proprietà JavaScript: `labels` · Slot: `default` · Eventi: `avatar-group-select`

**Gruppo di avatar** — Il gruppo impila gli avatar che riceve e riassume i restanti in una bolla con il conteggio: max decide quanti mostrarne, total dice quanti sono in tutto quando non li passi tutti.

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

Altre ricette: Bolla del conteggio interattiva

### bolle-empty-state

Attributi: `align`, `role`, `text`, `title`, `tone` · Proprietà JavaScript: `icon` · Slot: `actions`, `icon` · Eventi: -

**Stato vuoto con un comando** — Lo stato vuoto centra icona, titolo e testo; lo slot actions porta il comando che fa uscire dallo stato vuoto. tone error lo colora per un errore di caricamento.

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

Altre ricette: Icona personalizzata e allineamento

### bolle-pagination

Attributi: `form`, `label`, `page`, `page-size`, `range`, `total` · Proprietà JavaScript: `labels`, `pageSizes` · Slot: - · Eventi: `page-change`

**Pager sui dati presenti** — page-size accende il pager e total dice quante righe esistono: il componente si sposta da sé alla pagina richiesta e la riporta con page-change, così l'applicazione taglia la fetta di dati che mostra.

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

Altre ricette: Scelta della dimensione e forma compatta

### bolle-progress-indicator

Attributi: `indeterminate`, `label`, `max`, `value`, `variant`, `wavy` · Slot: - · Eventi: -

**Avanzamento lineare e circolare** — value dice quanto è stato fatto rispetto a max, label è il nome letto dai lettori di schermo. variant circular passa all'anello, indeterminate segnala un'attesa senza valore.

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

Slot: - · Eventi: -

**Indicatore di caricamento** — L'indicatore mostra l'attesa di un'operazione: label è il nome letto dai lettori di schermo e va sempre dichiarata. variant contained lo appoggia su una superficie quando copre un riquadro.

```vue
<template>
  <bolle-loading-indicator label="Caricamento delle commesse" />
  <bolle-loading-indicator variant="contained" label="Aggiornamento" />
</template>
```

### bolle-snackbar

Attributi: `action-label`, `close-label`, `duration`, `message`, `open`, `tail` · Slot: `action`, `dismiss`, `message` · Eventi: `action`, `closed`, `queued`

**Messaggio con azione** — show() apre il messaggio e duration lo chiude da solo: lo slot message porta il testo, action l'azione che lo accompagna e dismiss il comando di chiusura. message resta la scorciatoia per il solo testo.

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

### bolle-tooltip

Attributi: `label`, `persistent`, `supporting-text`, `tail`, `variant` · Proprietà JavaScript: `labels` · Slot: `actions`, `content`, `default`, `dismiss`, `label`, `supporting`, `trigger` · Eventi: -

**Suggerimento su un comando** — Il suggerimento si aggancia a un elemento con show(anchor) e si chiude da sé quando il puntatore esce o arriva Esc. label è il testo breve, supporting-text aggiunge la riga di dettaglio.

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

Attributi: `index`, `label`, `next-label`, `previous-label`, `variant` · Slot: `controls`, `default`, `next`, `previous`, `status` · Eventi: `change`

**Carosello di schede** — Il carosello scorre gli elementi dello slot predefinito e mostra i comandi avanti e indietro: index dice quale è visibile e la scelta arriva con change. Lo scorrimento è a passi, con il tocco e la tastiera.

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

Attributi: `href`, `label`, `orientation`, `tail`, `variant` · Slot: `content`, `default`, `media` · Eventi: -

**Scheda con immagine e comandi** — La scheda prende dallo slot predefinito il contenuto, da media l'immagine di testa che occupa la larghezza e da actions la riga di comandi. href rende l'intera scheda un collegamento.

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

Altre ricette: Scheda orizzontale come collegamento

### bolle-dialog

Attributi: `close-label`, `label`, `modal`, `open`, `variant` · Slot: `actions`, `default`, `heading` · Eventi: `before-close`, `closed`

**Dialogo di conferma** — open apre il dialogo e modal lo rende bloccante: il fuoco resta dentro finché non si chiude, e la chiusura arriva con closed. heading riceve il titolo letto come intestazione, actions la riga dei comandi.

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

Altre ricette: Dialogo a tutto schermo

### bolle-bottom-sheet

Attributi: `close-label`, `drag-handle`, `label`, `modal`, `open`, `variant` · Slot: `actions`, `default`, `heading` · Eventi: `before-close`, `closed`

**Foglio dal basso** — Il foglio entra dal bordo inferiore e porta con sé i comandi: drag-handle mostra la presa che lo trascina, heading il titolo, actions la riga finale. open e show() lo aprono.

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

Attributi: `close-label`, `detached`, `label`, `modal`, `open`, `variant` · Slot: `actions`, `default`, `heading` · Eventi: `before-close`, `closed`

**Pannello laterale di dettaglio** — Il pannello entra dal lato indicato da placement e lascia visibile il contenuto: è la forma giusta per il dettaglio di una riga, con heading per il titolo e actions per i comandi in coda.

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

Attributi: `decorative`, `inset`, `variant`, `vertical` · Slot: - · Eventi: -

**Separatore fra gruppi** — Il separatore non ha contenuto: divide due gruppi di elementi, con inset per staccarlo dai bordi e vertical per separare comandi affiancati.

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

Attributi: `alignment`, `collapsed`, `label`, `scrolled`, `sticky`, `subtitle`, `variant` · Slot: `actions`, `default`, `leading`, `title`, `trailing` · Eventi: -

**Barra dell'applicazione** — La barra porta il titolo e i comandi: title riceve il testo principale, subtitle la riga sotto, gli slot leading e actions i comandi ai due lati. Lo slot predefinito sostituisce il titolo quando serve un'intestazione più ricca.

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

Altre ricette: Barra che si comprime allo scorrimento

### bolle-toolbar

Attributi: `color`, `label`, `orientation`, `variant` · Slot: `default` · Eventi: -

**Barra di comandi** — La barra dispone gli elementi che riceve nello slot predefinito: varianti diverse separano i comandi principali da quelli di servizio, e la barra porta a capo gli elementi in eccesso invece di comprimerli.

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

Attributi: `label`, `layout`, `value`, `variant` · Proprietà JavaScript: `items` · Slot: - · Eventi: `navigate`

**Barra di navigazione** — items dichiara le destinazioni con icona e testo, value dice quale è attiva: il componente applica la scelta da sé e la riporta con change. Oltre cinque destinazioni conviene passare alla barra laterale.

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

Attributi: `expanded`, `label`, `layout`, `value`, `variant` · Proprietà JavaScript: `items` · Slot: - · Eventi: `navigate`

**Barra stretta** — La barra stretta mostra le icone delle destinazioni e, con expanded, anche i testi. Serve fra la barra inferiore e il pannello laterale, quando lo spazio è poco ma le sezioni restano molte.

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

Attributi: `close-label`, `detached`, `label`, `modal`, `open`, `value`, `variant` · Proprietà JavaScript: `items` · Slot: `actions`, `default`, `heading` · Eventi: `before-close`, `closed`, `navigate`

**Pannello di navigazione** — Il pannello apre le voci in verticale e può stare in linea accanto al contenuto o sovrapposto alla pagina: placement start o end sceglie il lato, modal lo rende bloccante.

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

Attributi: `activation`, `label`, `scrollable`, `value`, `variant` · Proprietà JavaScript: `items`, `labels` · Slot: `content-{itemId}`, `default` · Eventi: `change`

**Schede con pannelli** — items dichiara le schede e value quella attiva: il componente applica la scelta da sé e la riporta con change. Ogni pannello dichiara con slot l'identificatore della scheda che lo apre.

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

Altre ricette: Schede che scorrono

### bolle-checkbox

Attributi: `checked`, `error`, `indeterminate`, `supporting-text` · Slot: `default` · Eventi: `change`

**Casella con testo e supporto** — La casella prende dallo slot predefinito il testo dell'etichetta e cambia stato da sé, riportando checked con change. supporting-text aggiunge la riga di spiegazione, indeterminate mostra lo stato misto.

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

Altre ricette: Casella che governa un elenco

### bolle-switch

Attributi: `checked`, `error`, `indeterminate`, `supporting-text` · Proprietà JavaScript: `icon`, `iconSelected` · Slot: `default` · Eventi: `change`

**Interruttore** — L'interruttore cambia stato da sé e riporta il valore con change: è la forma giusta per una preferenza che ha effetto immediato, mentre la casella resta per una scelta da confermare.

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

Attributi: `checked`, `error`, `indeterminate`, `supporting-text` · Slot: `default` · Eventi: `change`

**Gruppo di opzioni** — I pulsanti di opzione si raggruppano per name: scegliere una voce toglie la scelta alle altre dello stesso gruppo, e il valore arriva con change.

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

Attributi: `disabled`, `elevated`, `href`, `label`, `removable`, `remove-label`, `selected`, `variant` · Slot: `avatar`, `default`, `icon` · Eventi: `action`, `change`, `remove`

**Pastiglia con icona e rimozione** — La pastiglia prende dallo slot predefinito il testo e dagli altri un'icona o un avatar. selected la segna come scelta, removable aggiunge il comando che la toglie e riporta remove.

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

Attributi: `interactive`, `label`, `selection`, `variant` · Proprietà JavaScript: `expanded`, `itemRenderer`, `items`, `labels`, `value` · Slot: `default` · Eventi: `action`, `change`, `expand`

**Elenco con icone e dettaglio** — L'elenco prende le righe dallo slot predefinito e le compone con icona, testo, supporto e coda; interactive abilita il clic e selection riporta la scelta con change.

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

Altre ricette: Elenco da un array

### bolle-segmented-buttons

Attributi: `multiple` · Proprietà JavaScript: `items`, `values` · Slot: - · Eventi: `change`

**Scelta fra segmenti** — I segmenti arrivano da items e la scelta da value: il controllo la applica da sé e la riporta con change. multiple ammette più segmenti e restituisce values.

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

Altre ricette: Scelta multipla

### bolle-slider

Attributi: `compact`, `max`, `min`, `min-gap`, `step`, `suffix`, `upper-label`, `upper-value`, `variant` · Proprietà JavaScript: `icon` · Slot: `icon`, `label`, `value` · Eventi: `change`, `value-input`

**Cursore singolo** — Il cursore mostra il valore sull'etichetta e lo riporta con input durante il trascinamento e con change alla fine. min e max fissano l'intervallo, step la granularità.

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

Altre ricette: Intervallo fra due valori

### bolle-steps

Attributi: `options` · Slot: `label` · Eventi: `change`

**Passi di un percorso** — options dichiara i nomi dei passi e value quello corrente: il componente segna i passi fatti, quello attivo e i restanti, e riporta la scelta con change.

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

Attributi: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Slot: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · Eventi: `change`, `value-input`

**Campo con prefisso e supporto** — Il campo prende dagli slot il prefisso, il suffisso e il testo di supporto, mentre il valore resta nell'input e arriva con input e change. variant filled o outlined cambia la forma del riquadro.

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

Altre ricette: Campo in errore · Campo multiriga

### bolle-search

Attributi: `appearance`, `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `filter`, `inputmode`, `layout`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `suggestion-delay`, `suggestions-label`, `supporting-text`, `type`, `variant` · Proprietà JavaScript: `suggestions` · Slot: `leading`, `prefix`, `results`, `suffix`, `supporting`, `trailing` · Eventi: `change`, `search`, `suggest`, `value-input`

**Barra di ricerca con risultati** — La ricerca è un campo di testo con il comando di pulizia già incluso: results riceve l'elenco che compare sotto la barra, che l'applicazione riempie con i risultati di suggest o search.

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

Altre ricette: Ricerca in linea nella barra

### bolle-date-picker

Attributi: `autocapitalize`, `autocomplete`, `counter`, `end-value`, `enterkeyhint`, `error`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `selection-mode`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant`, `week-starts-on` · Proprietà JavaScript: `labels` · Slot: `end-label`, `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · Eventi: `change`, `value-input`

**Scelta di una data** — Il selettore apre il calendario dal campo: il valore scelto arriva con change nel formato ISO, e locale decide lingua e nomi dei giorni. selection-mode range aggiunge la seconda data in end-value.

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

Altre ricette: Intervallo di date

### bolle-time-picker

Attributi: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `hour-cycle`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Proprietà JavaScript: `labels` · Slot: `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · Eventi: `change`, `value-input`

**Scelta di un orario** — Il selettore apre il quadrante dell'ora dal campo: il valore scelto arriva con change, hour-cycle decide il formato a dodici o ventiquattro ore e lo slot title nomina il quadrante.

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

Attributi: `color-scheme`, `compact-width`, `density`, `filter`, `filterable`, `inactive`, `locale`, `menu-label`, `options`, `quick`, `selection-mode`, `tail`, `variant` · Proprietà JavaScript: `items`, `labels` · Slot: - · Eventi: -

**Menu di azioni** — show(anchor) apre il menu sotto l'elemento che lo richiama e la scelta arriva con menu-select. items dichiara le voci, con icona, scorciatoia, disabled e figli per il sotto-menu.

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

Attributi: `color`, `label`, `open`, `tail` · Proprietà JavaScript: `items` · Slot: `icon` · Eventi: `action`

**Azioni rapide** — Il menu dei pulsanti flottanti apre le azioni secondarie dal pulsante principale: items dichiara le voci, open dice se è aperto e la scelta arriva con menu-select.

```vue
<template>
  <bolle-fab-menu label="Azioni rapide" :items="items">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-fab-menu>
</template>
```

### bolle-split-button

Attributi: `disabled`, `icon`, `label`, `menu-label`, `size`, `variant` · Proprietà JavaScript: `items` · Slot: `icon` · Eventi: `action`

**Azione principale e menu** — Il pulsante diviso tiene l'azione principale a sinistra e apre il menu dal comando a fianco: le voci arrivano da items e la scelta con menu-select, mentre il clic sull'azione principale arriva con click.

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

Attributi: `error`, `open`, `placeholder`, `supporting-text`, `variant` · Slot: `supporting` · Eventi: `change`

**Select con opzioni native** — La select avvolge un elemento select nativo: le opzioni restano nel markup e il valore arriva con change. Il menu che si apre è quello del componente, con la stessa forma dei campi di testo.

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

Attributi: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Proprietà JavaScript: `options` · Slot: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · Eventi: `change`, `value-input`

**Campo con suggerimenti** — suggestions dichiara i suggerimenti e il componente li filtra mentre si scrive, riportandoli con suggest; scegliere una voce riempie il campo ed emette change. suggestion-delay regola l'attesa prima di chiedere i dati.

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

Attributi: `collapsed`, `context`, `current`, `label`, `max-width`, `min-width`, `search`, `variant`, `width` · Proprietà JavaScript: `contentStyles`, `empty`, `expanded`, `filter`, `item`, `items`, `labels`, `railItem` · Slot: `empty`, `filter`, `footer`, `header` · Eventi: `collapse`, `expand`, `navigate`, `resize`

**Albero di navigazione** — items dichiara le voci e i loro figli: il componente costruisce l'albero fino a tre livelli, apre il ramo della voce scelta e riporta il percorso con navigate. La voce corrente si imposta con current, il percorso delle voci separate da barra.

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

Altre ricette: Ricerca, contatori e rail compatta · Contenuto di una voce

### bolle-app-shell

Attributi: `close-label`, `expanded-width`, `form`, `label`, `medium-width`, `supporting-label`, `supporting-mode`, `supporting-open` · Proprietà JavaScript: `labels` · Slot: `bar`, `bottom-bar`, `default`, `navigation`, `navigation-compact`, `status`, `supporting`, `supporting-actions`, `supporting-header`, `supporting-inline`, `supporting-modal` · Eventi: `form-change`, `supporting-close`

**Impalcatura completa** — L'impalcatura mette insieme le superfici intorno al contenuto: la navigazione, la barra, quella inferiore e il pannello di supporto arrivano dagli slot e il contenuto principale è lo slot predefinito. Le aree che non ricevono nulla non occupano spazio.

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

Altre ricette: Pannello di supporto

### bolle-dashboard

Attributi: `columns`, `compact-columns`, `density`, `label`, `medium-columns` · Proprietà JavaScript: `labels` · Slot: `default` · Eventi: -

**Griglia di riquadri** — La dashboard dispone i riquadri che riceve e non impone contenuti: ogni riquadro è un bolle-widget, e span decide quante colonne occupa mentre min-span fissa il minimo quando lo spazio si stringe.

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

Altre ricette: Riquadri spostabili e ridimensionabili

### bolle-kanban

Attributi: `addable`, `card-gap`, `collapsible`, `column-gap`, `column-max-width`, `column-min-width`, `density`, `empty-label`, `error`, `label`, `lanes`, `loading`, `movable`, `selected` · Proprietà JavaScript: `card`, `cardActions`, `cards`, `collapsed`, `columnActions`, `columnRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `labels`, `laneLabel`, `laneRenderer`, `loadingRenderer`, `restrict` · Slot: `empty`, `error`, `loading` · Eventi: `card-action`, `card-add`, `card-move`, `card-move-blocked`, `card-open`, `column-action`, `column-collapse`, `retry`

**Board minima** — columns dichiara le colonne e cards le schede, ciascuna con la colonna in cui si trova. Con movable il lettore trascina la scheda o la sposta con Alt e le frecce: la board applica lo spostamento e lo riporta con card-move.

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

Altre ricette: Regola di spostamento e limiti · Contenuto della scheda

### bolle-gantt

Attributi: `baseline`, `density`, `editable`, `empty-label`, `error`, `group-by`, `label`, `linkable`, `loading`, `scale`, `selected` · Proprietà JavaScript: `barRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `groupLabel`, `labels`, `loadingRenderer`, `restrict`, `tasks` · Slot: `empty`, `error`, `loading` · Eventi: `columns-change`, `dependency-add`, `dependency-blocked`, `retry`, `task-change`, `task-change-blocked`, `task-open`, `task-select`, `view-change`

**Piano minimo** — Il piano disegna le attività sull'asse del tempo: parent costruisce l'albero e una attività con figli diventa una barra di riepilogo. L'altezza del host è obbligatoria, perché la superficie riempie lo spazio che riceve.

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

Altre ricette: Colonne e contenuto delle celle · Spostare e ridimensionare · Contenuto della barra · Stati e slot

### bolle-data-table

Attributi: `compact-row-height`, `default-column-width`, `density`, `empty-label`, `error`, `expandable`, `group-by`, `group-height`, `header-height`, `label`, `loading`, `max-column-width`, `min-column-width`, `overscan`, `page`, `page-size`, `row-height`, `row-key`, `selectable`, `total`, `updating`, `variant`, `virtual` · Proprietà JavaScript: `columnHandler`, `columns`, `contentStyles`, `detail`, `emptyRenderer`, `errorRenderer`, `expanded`, `footerRenderer`, `groupRenderer`, `groupSummary`, `headerRenderer`, `labels`, `loadingRenderer`, `pageHandler`, `rowActions`, `rowRenderer`, `rows`, `selected`, `sort`, `sortHandler` · Slot: `empty`, `empty-state`, `error`, `footer`, `header`, `loading` · Eventi: `column-change`, `expand`, `group`, `retry`, `row-action`, `row-activate`, `select`, `sort`

**Slot del framework tramite wrapper** — Vue e React non possono passare uno slot con scope a un elemento personalizzato. Un wrapper di poche righe trasforma la slot in un renderer: la pagina scrive il template della cella una volta, il wrapper monta il contenuto per ogni riga e libera la memoria quando la cella esce dal documento.

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

Altre ricette: Registrare i componenti · Tabella minima · Formattare i valori · Cella personalizzata · Ordinamento · Selezione delle righe · Dettaglio della riga · Raggruppamento · Paginazione · Caricamento, errore e vuoto · Colonne fisse, larghezze e visibilità · Scorrimento continuo · Stile tramite CSS part
