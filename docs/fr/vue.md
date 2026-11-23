[Italiano](../it/vue.md) · [English](../en/vue.md) · [Français](./vue.md) · [中文](../zh/vue.md)

# Vue 3 · exemples d’utilisation exhaustifs

Ce guide couvre les 51 composants de la bibliothèque. Chaque section énumère les
attributs publics, les slots, les événements et les méthodes, puis montre un
exemple Vue 3 qui les utilise tous. Les exemples supposent `<script setup lang="ts">`
et Vue 3.4 ou une version ultérieure. Pour React, voir [react.md](./react.md).

Les composants sont des Custom Elements : Vue les traite comme des éléments
natifs, et non comme des composants Vue. Cela entraîne trois conséquences,
expliquées dans les règles d’intégration : les attributs restent des attributs
HTML, les événements sont des événements DOM avec `detail`, et les méthodes
s’appellent via un template ref.

## Installation et enregistrement

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

Le build de la bibliothèque enregistre déjà toutes les balises : aucun plugin Vue
ni `app.use()` n’est nécessaire. Le thème clair est celui par défaut ; le sombre
s’active avec `document.documentElement.dataset.theme = "dark"`, comme dans la
démo.

### Compilateur Vue

Vue doit savoir que les balises `bolle-*` ne sont pas des composants à résoudre.

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

Si le build de Vue s’effectue à l’exécution, appliquez la même règle sur
l’application :

```ts
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("bolle-");
```

`vue-tsc` ne déduit pas les types des attributs des Custom Elements. Pour une
vérification statique complète, il faut des composants wrapper typés, comme
celui-ci :

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

Le wrapper n’est utile que si vous avez besoin du type checking : dans les
exemples suivants, les balises de la bibliothèque sont utilisées directement.

## Règles d’intégration

### Propriétés et attributs

Vue définit une propriété DOM lorsque la clé existe sur l’élément, sinon il écrit
un attribut. Les propriétés qui acceptent des tableaux ou des objets doivent donc
être liées avec `:` et le nom de la propriété, et non comme une chaîne :

| Composant                                                                                | Propriétés à lier                                 |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `bolle-segmented-buttons`                                                                | `:items`, `:values`                               |
| `bolle-search`                                                                           | `:suggestions`                                    |
| `bolle-date-picker`                                                                      | `:labels`                                         |
| `bolle-list`                                                                             | `:items`, `:value` (aussi tableau), `:expanded`   |
| `bolle-navigation-*`, `bolle-tabs`, `bolle-fab-menu`, `bolle-split-button`, `bolle-menu` | `:items`                                          |
| `bolle-slider`                                                                           | `:iconStart`, `:iconEnd` (acceptent SVG ou texte) |
| `bolle-switch`                                                                           | `:icon`, `:iconSelected`                          |

Tous les autres attributs (`variant`, `size`, `label`, `disabled`, `required`,
`supporting-text`…) fonctionnent à la fois comme attributs statiques et avec
`:binding`. Pour les attributs composés, utilisez la forme kebab-case :
`:supporting-text`, `:upper-value`, `:remove-label`, `:menu-label`,
`:close-label`.

Les propriétés déclarées sans attribut (`icon`, `iconSelected`, `iconStart`,
`iconEnd`, `items`, `values`, `suggestions`, `labels`, `expanded` et `value`
de la list) n’existent que comme propriétés : elles se lient avec le nom exact de
la propriété (`:iconStart`, `:items`). Avec un template in-DOM, le navigateur met
les noms d’attributs en minuscules ; dans ce cas, utilisez
`v-bind="{ iconStart }"`.

Les booléens sont des attributs reflétés : `<bolle-checkbox checked />` équivaut
à `:checked="true"`, tandis que `:checked="false"` supprime l’attribut.

### Événements

Tous les événements personnalisés sont `bubbles: true` et `composed: true`. En
Vue, on les écoute avec `@nom-evenement` et le payload se trouve dans
`event.detail`. Les noms sont toujours en kebab-case :

```
@change  @value-input  @selection-change  @navigate  @expand
@action  @remove  @search  @suggest  @closed  @before-close
@menu-select  @menu-open  @menu-close  @queued
```

L’événement `before-close` est annulable : `@before-close.prevent` empêche la
fermeture du dialog. Les événements natifs comme `click` et `submit` fonctionnent
normalement.

```ts
// src/bolle.ts
export function detail<T>(event: Event): T {
  return (event as CustomEvent<T>).detail;
}
```

### Valeur contrôlée

Les composants de formulaire n’émettent pas d’événement `input` natif : ils
émettent `value-input` à chaque frappe et `change` à la validation. Le schéma est
toujours le même : vous passez `:value` (ou `:checked`, `:selected`) et réalignez
l’état dans le handler.

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

Pour checkbox, switch, radio, chip filtre, segmented buttons, list et tabs, la
valeur renvoyée est un booléen (`checked`, `selected`) ou un id (`value`), et non
une chaîne de saisie.

### Ref et méthodes

Dialog, sheet, snackbar, tooltip, menu, fab-menu et carousel exposent des
méthodes impératives. On les appelle sur un template ref typé avec la classe du
composant.

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

### Formulaire

Les composants de formulaire sont form-associated : `bolle-button` avec
`type="submit"`, checkbox, switch, radio, text field, search, slider,
segmented buttons, date picker, time picker et chip filtre entrent dans le
`FormData` avec `name` et `value`. Aucun input masqué n’est nécessaire et les
noms ne sont pas dupliqués.

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

`form.reset()` ramène les contrôles à leur valeur initiale, y compris les
intervalles de dates, les slider range et les sélections multiples.

### Langue, direction et thème

Les pickers utilisent `locale` (par défaut `document.documentElement.lang`) et
acceptent des overrides avec `:labels`. Les composants lisent la direction depuis
l’ancêtre via `:dir()` : il suffit de définir `dir="rtl"` sur `<html>` ou sur un
conteneur. Le thème se change avec `data-theme="dark"` sur `<html>`.

```vue
<bolle-date-picker
  label="Data"
  locale="it"
  :labels="{ open: 'Apri calendario', confirm: 'Conferma' }"
/>
```

### Raccourcis clavier

Chaque élément `bolle-*` sauf `bolle-menu` accepte `shortcut`, écrit avec la
syntaxe de `aria-keyshortcuts` (`Alt+S`, `Control+Shift+F`, alternatives séparées
par une espace). Le composant écrit `aria-keyshortcuts` sur le contrôle interne
qui reçoit le focus : boutons, liens, cases à cocher et radios reçoivent le focus
et un clic, les champs seulement le focus. Les composants désactivés ou masqués
ignorent le raccourci.

```vue
<template>
  <bolle-button shortcut="Alt+S" @click="save">Enregistrer</bolle-button>
  <bolle-text-field
    label="Rechercher"
    shortcut="Control+K Meta+K"
  ></bolle-text-field>
</template>
```

Avec `:shortcut="value"` il devient dynamique ; une chaîne vide supprime le
raccourci et l’attribut ARIA.

### Icônes et slots

Les slots acceptent des nœuds Vue : `<svg slot="icon">`, `<span slot="leading">`,
`<img slot="media">`. En revanche, le champ `icon` à l’intérieur des tableaux
d’items est rendu comme du texte : utilisez un nom de ligature Material Symbols
avec la police d’icônes chargée par le projet, ou un caractère. Ne passez pas de
markup HTML sous forme de chaîne, car il s’afficherait littéralement.

La bibliothèque n’inclut pas de police d’icônes. La démo utilise des SVG inline
dans les slots et des noms de ligature dans les items.

### État appliqué et crochets

Les composants appliquent eux-mêmes le changement du lecteur et le rapportent
avec un événement : tri, page, sélection, ouverture de ligne, regroupement,
colonnes, déplacement d'une carte ou d'une tâche. Il n'est pas nécessaire de
réécrire l'état en écoutant ; l'écoute reste utile pour savoir ce qui a changé.

Quand les données sont sur un serveur, le composant confie le travail à un
crochet : `sortHandler`, `pageHandler` et `columnHandler` sur la table de
données, `restrict` sur kanban et gantt. Le crochet reçoit la demande et le
composant redessine quand la promesse est résolue. En Vue ce sont des propriétés
fonction, donc liées en camelCase : `:sortHandler`, `:itemRenderer`, `:restrict`.

<!-- catalogue -->

## Catalogue des composants

Chaque composant liste ses attributs, propriétés JavaScript, slots et événements publics ; l'exemple est celui de la première recette de la documentation du site, déjà écrite pour ce framework.

### bolle-button

Attributs: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Événements: `change`

**Bouton avec icône** — La variante décide la forme : filled pour l'action principale, tonal pour la secondaire, outlined et text pour les autres. Le slot par défaut porte le texte, icon l'icône initiale et trailing-icon la finale.

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

Autres recettes: Bouton qui reste enfoncé

### bolle-icon-button

Attributs: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Événements: `change`

**Bouton icône** — label est obligatoire car c'est le nom lu par les lecteurs d'écran, le bouton n'affichant que le symbole. variant standard laisse l'icône sans fond, filled la pose sur une surface.

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

Attributs: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Événements: `change`

**Bouton flottant** — Le bouton flottant reste ancré au coin de son conteneur et n'affiche que le symbole : label est le nom accessible et reste obligatoire. size regular reste rond, extended ajoute le texte.

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

Attributs: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Événements: `change`

**Bouton flottant étendu** — La forme étendue montre icône et texte ensemble : le slot icon porte le symbole, le slot par défaut le texte. Il reste le bouton de l'action principale de l'écran.

```vue
<template>
  <bolle-extended-fab>
    <span slot="icon" aria-hidden="true">+</span>
    Nuova commessa
  </bolle-extended-fab>
</template>
```

### bolle-button-group

Attributs: `label`, `required`, `selection`, `shape`, `size`, `variant` · Slots: `default` · Événements: `selection-change`

**Boutons liés** — Le groupe réunit des boutons adjacents : variant connected retire l'espace et partage les bordures, selection single transforme le groupe en choix unique et rapporte la valeur avec change.

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

Attributs: `label`, `max`, `small`, `value` · Slots: `label` · Événements: -

**Signal sur un élément** — Le badge affiche value au-dessus de l'élément qui le contient et abrège le nombre au-delà de max en « 999+ ». small retire le texte et garde le point, pour un signal sans nombre.

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

Attributs: `align`, `divider`, `dock`, `label`, `sticky`, `variant` · Slots: `default`, `fab`, `leading`, `trailing` · Événements: -

**Barre inférieure avec bouton flottant** — La barre inférieure tient les commandes en ligne et le bouton flottant : le slot par défaut reçoit les commandes, leading et trailing les éléments latéraux, fab le bouton qui s'encastre dans l'encoche. dock amène le bouton dans la barre.

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

Attributs: `alt`, `color`, `initials`, `label`, `name`, `shape`, `size`, `src`, `status` · Slots: `badge`, `icon` · Événements: -

**Avatar avec image ou initiales** — src affiche l'image et, quand elle manque ou ne se charge pas, le composant revient aux initiales tirées de name. initials les fixe à la main, status ajoute le point de présence et size change la taille.

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

Autres recettes: Avatar avec une icône au lieu des initiales

### bolle-breadcrumb

Attributs: `label`, `max-items`, `separator` · Propriétés JavaScript: `items`, `labels` · Slots: - · Événements: `breadcrumb-select`

**Fil d'Ariane** — items déclare les entrées du chemin : le composant place le séparateur entre elles et marque la dernière comme page courante. separator choisit le signe, max-items comprime les entrées centrales derrière une commande.

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

Attributs: `interactive`, `label`, `max`, `overlap`, `size`, `total` · Propriétés JavaScript: `labels` · Slots: `default` · Événements: `avatar-group-select`

**Groupe d'avatars** — Le groupe empile les avatars reçus et résume les autres dans une bulle avec compteur : max décide combien en montrer, total dit combien il y en a quand on ne les passe pas tous.

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

Autres recettes: Bulle du compteur interactive

### bolle-empty-state

Attributs: `align`, `role`, `text`, `title`, `tone` · Propriétés JavaScript: `icon` · Slots: `actions`, `icon` · Événements: -

**État vide avec une commande** — L'état vide centre une icône, un titre et un texte ; le slot actions porte la commande qui sort de l'état vide. tone error le colore pour une erreur de chargement.

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

Autres recettes: Icône personnalisée et alignement

### bolle-pagination

Attributs: `form`, `label`, `page`, `page-size`, `range`, `total` · Propriétés JavaScript: `labels`, `pageSizes` · Slots: - · Événements: `page-change`

**Pagineur sur les lignes disponibles** — page-size active le pagineur et total dit combien de lignes existent : le composant se déplace seul vers la page demandée et la rapporte avec page-change, ainsi l'application découpe les données affichées.

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

Autres recettes: Choix de la taille et forme compacte

### bolle-progress-indicator

Attributs: `indeterminate`, `label`, `max`, `value`, `variant`, `wavy` · Slots: - · Événements: -

**Avancement linéaire et circulaire** — value dit ce qui est fait par rapport à max, label est le nom lu par les lecteurs d'écran. variant circular passe à l'anneau, indeterminate signale une attente sans valeur.

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

Slots: - · Événements: -

**Indicateur de chargement** — L'indicateur montre l'attente d'une opération : label est le nom lu par les lecteurs d'écran et reste obligatoire. variant contained le pose sur une surface quand il couvre une tuile.

```vue
<template>
  <bolle-loading-indicator label="Caricamento delle commesse" />
  <bolle-loading-indicator variant="contained" label="Aggiornamento" />
</template>
```

### bolle-snackbar

Attributs: `action-label`, `close-label`, `duration`, `message`, `open`, `tail` · Slots: `action`, `dismiss`, `message` · Événements: `action`, `closed`, `queued`

**Message avec action** — show() ouvre le message et duration le ferme seul : le slot message porte le texte, action l'action qui l'accompagne et dismiss la commande de fermeture. message reste le raccourci pour le texte seul.

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

Attributs: `index`, `locale`, `open`, `padding`, `placement` · Propriétés JavaScript: `steps` · Slots: - · Événements: `finish`, `step-change`

**Visite depuis la configuration JSON** — Les étapes ne sont pas dans le code : parseTourConfig lit le JSON avec sa version et shouldStartTour la compare à celle déjà montrée par l’application. Le composant ne fait aucun appel réseau et ne mémorise rien : c’est l’application qui décide du démarrage et enregistre la version au finish.

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

Autres recettes: Une étape sans cible et l’action finale · Filtrer les commandes · Le tableau · C’est terminé · Piloter la visite et lire les étapes

### bolle-tooltip

Attributs: `label`, `persistent`, `supporting-text`, `tail`, `variant` · Propriétés JavaScript: `labels` · Slots: `actions`, `content`, `default`, `dismiss`, `label`, `supporting`, `trigger` · Événements: -

**Infobulle sur une commande** — L'infobulle s'accroche à un élément avec show(anchor) et se ferme seule quand le pointeur sort ou qu'Échap arrive. label est le texte court, supporting-text ajoute la ligne de détail.

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

Attributs: `index`, `label`, `next-label`, `previous-label`, `variant` · Slots: `controls`, `default`, `next`, `previous`, `status` · Événements: `change`

**Carrousel de cartes** — Le carrousel fait défiler les éléments du slot par défaut et affiche les commandes avant et arrière : index dit lequel est visible et le choix arrive avec change. Le défilement se fait par étapes, au toucher et au clavier.

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

Attributs: `href`, `label`, `orientation`, `tail`, `variant` · Slots: `content`, `default`, `media` · Événements: -

**Carte avec image et commandes** — La carte prend le contenu dans le slot par défaut, dans media l'image de tête qui occupe la largeur et dans actions la ligne de commandes. href transforme toute la carte en lien.

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

Autres recettes: Carte horizontale comme lien

### bolle-dialog

Attributs: `close-label`, `label`, `modal`, `open`, `variant` · Slots: `actions`, `default`, `heading` · Événements: `before-close`, `closed`

**Dialogue de confirmation** — open ouvre le dialogue et modal le rend bloquant : le focus reste à l'intérieur jusqu'à la fermeture, et la fermeture arrive avec closed. heading reçoit le titre lu comme en-tête, actions la ligne de commandes.

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

Autres recettes: Dialogue plein écran

### bolle-bottom-sheet

Attributs: `close-label`, `drag-handle`, `label`, `modal`, `open`, `variant` · Slots: `actions`, `default`, `heading` · Événements: `before-close`, `closed`

**Panneau inférieur** — Le panneau entre par le bord inférieur et porte ses commandes : drag-handle affiche la poignée qui le fait glisser, heading le titre, actions la ligne finale. open et show() l'ouvrent.

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

Attributs: `close-label`, `detached`, `label`, `modal`, `open`, `variant` · Slots: `actions`, `default`, `heading` · Événements: `before-close`, `closed`

**Panneau latéral de détail** — Le panneau entre par le côté indiqué par placement et laisse le contenu visible : c'est la forme adéquate pour le détail d'une ligne, avec heading pour le titre et actions pour les commandes de fin.

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

Attributs: `decorative`, `inset`, `variant`, `vertical` · Slots: - · Événements: -

**Séparateur entre groupes** — Le séparateur n'a pas de contenu : il divise deux groupes d'éléments, avec inset pour le détacher des bords et vertical pour séparer des commandes côte à côte.

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

Attributs: `alignment`, `collapsed`, `label`, `scrolled`, `sticky`, `subtitle`, `variant` · Slots: `actions`, `default`, `leading`, `title`, `trailing` · Événements: -

**Barre de l'application** — La barre porte le titre et les commandes : title reçoit le texte principal, subtitle la ligne en dessous, les slots leading et actions les commandes latérales. Le slot par défaut remplace le titre quand un en-tête plus riche est nécessaire.

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

Autres recettes: Barre qui se comprime au défilement

### bolle-toolbar

Attributs: `color`, `label`, `orientation`, `variant` · Slots: `default` · Événements: -

**Barre de commandes** — La barre dispose les éléments reçus dans le slot par défaut : des variantes différentes séparent les commandes principales des commandes de service, et la barre renvoie à la ligne les éléments en trop au lieu de les comprimer.

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

Attributs: `label`, `layout`, `value`, `variant` · Propriétés JavaScript: `items` · Slots: - · Événements: `navigate`

**Barre de navigation** — items déclare les destinations avec icône et texte, value dit laquelle est active : le composant applique le choix seul et le rapporte avec change. Au-delà de cinq destinations, mieux vaut passer à la barre latérale.

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

Attributs: `expanded`, `label`, `layout`, `value`, `variant` · Propriétés JavaScript: `items` · Slots: - · Événements: `navigate`

**Barre étroite** — La barre étroite montre les icônes des destinations et, avec expanded, aussi les textes. Elle se place entre la barre inférieure et le panneau latéral, quand l'espace est réduit mais que les sections restent nombreuses.

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

Attributs: `close-label`, `detached`, `label`, `modal`, `open`, `value`, `variant` · Propriétés JavaScript: `items` · Slots: `actions`, `default`, `heading` · Événements: `before-close`, `closed`, `navigate`

**Panneau de navigation** — Le panneau ouvre les entrées verticalement et peut se placer en ligne à côté du contenu ou par-dessus la page : placement start ou end choisit le côté, modal le rend bloquant.

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

Attributs: `activation`, `label`, `scrollable`, `value`, `variant` · Propriétés JavaScript: `items`, `labels` · Slots: `content-{itemId}`, `default` · Événements: `change`

**Onglets avec panneaux** — items déclare les onglets et value celui qui est actif : le composant applique le choix seul et le rapporte avec change. Chaque panneau nomme l'onglet qui l'ouvre via slot.

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

Autres recettes: Onglets qui défilent

### bolle-checkbox

Attributs: `checked`, `error`, `indeterminate`, `supporting-text` · Slots: `default` · Événements: `change`

**Case avec texte et aide** — La case prend le texte de l'étiquette dans le slot par défaut et change d'état seule, en rapportant checked avec change. supporting-text ajoute la ligne d'explication, indeterminate montre l'état mixte.

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

Autres recettes: Case qui pilote une liste

### bolle-switch

Attributs: `checked`, `error`, `indeterminate`, `supporting-text` · Propriétés JavaScript: `icon`, `iconSelected` · Slots: `default` · Événements: `change`

**Interrupteur** — L'interrupteur change d'état seul et rapporte la valeur avec change : c'est la forme adaptée à une préférence à effet immédiat, tandis que la case reste pour un choix à confirmer.

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

Attributs: `checked`, `error`, `indeterminate`, `supporting-text` · Slots: `default` · Événements: `change`

**Groupe d'options** — Les boutons radio se regroupent par name : choisir une entrée retire le choix aux autres du même groupe, et la valeur arrive avec change.

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

Attributs: `disabled`, `elevated`, `href`, `label`, `removable`, `remove-label`, `selected`, `variant` · Slots: `avatar`, `default`, `icon` · Événements: `action`, `change`, `remove`

**Pastille avec icône et retrait** — La pastille prend son texte dans le slot par défaut et, dans les autres, une icône ou un avatar. selected la marque comme choisie, removable ajoute la commande qui la retire et rapporte remove.

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

Attributs: `interactive`, `label`, `selection`, `variant` · Propriétés JavaScript: `expanded`, `itemRenderer`, `items`, `labels`, `value` · Slots: `default` · Événements: `action`, `change`, `expand`

**Liste avec icônes et détail** — La liste prend les lignes dans le slot par défaut et les compose avec icône, texte, aide et contenu final ; interactive active le clic et selection rapporte le choix avec change.

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

Autres recettes: Liste à partir d'un tableau

### bolle-segmented-buttons

Attributs: `multiple` · Propriétés JavaScript: `items`, `values` · Slots: - · Événements: `change`

**Choix entre segments** — Les segments viennent de items et le choix de value : le contrôle l'applique seul et le rapporte avec change. multiple autorise plusieurs segments et renvoie values.

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

Autres recettes: Choix multiple

### bolle-slider

Attributs: `compact`, `max`, `min`, `min-gap`, `step`, `suffix`, `upper-label`, `upper-value`, `variant` · Propriétés JavaScript: `icon` · Slots: `icon`, `label`, `value` · Événements: `change`, `value-input`

**Curseur unique** — Le curseur affiche la valeur sur l'étiquette et la renvoie avec input pendant le glissement et avec change à la fin. min et max fixent l'intervalle, step la granularité.

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

Autres recettes: Intervalle entre deux valeurs

### bolle-steps

Attributs: `options` · Slots: `label` · Événements: `change`

**Étapes d'un parcours** — options déclare les noms des étapes et value celle en cours : le composant marque les étapes faites, celle active et les restantes, et rapporte le choix avec change.

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

Attributs: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Slots: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · Événements: `change`, `value-input`

**Champ avec préfixe et texte d'aide** — Le champ prend dans les slots le préfixe, le suffixe et le texte d'aide, tandis que la valeur reste dans l'input et arrive avec input et change. variant filled ou outlined change la forme du cadre.

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

Autres recettes: Champ en erreur · Champ multiligne

### bolle-search

Attributs: `appearance`, `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `filter`, `inputmode`, `layout`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `suggestion-delay`, `suggestions-label`, `supporting-text`, `type`, `variant` · Propriétés JavaScript: `suggestions` · Slots: `leading`, `prefix`, `results`, `suffix`, `supporting`, `trailing` · Événements: `change`, `search`, `suggest`, `value-input`

**Barre de recherche avec résultats** — La recherche est un champ de texte avec la commande d'effacement déjà incluse : results reçoit la liste qui apparaît sous la barre, que l'application remplit avec les résultats de suggest ou search.

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

Autres recettes: Recherche en ligne dans la barre

### bolle-date-picker

Attributs: `autocapitalize`, `autocomplete`, `counter`, `end-value`, `enterkeyhint`, `error`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `selection-mode`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant`, `week-starts-on` · Propriétés JavaScript: `labels` · Slots: `end-label`, `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · Événements: `change`, `value-input`

**Choix d'une date** — Le sélecteur ouvre le calendrier depuis le champ : la valeur choisie arrive avec change au format ISO, et locale décide langue et noms des jours. selection-mode range ajoute la seconde date dans end-value.

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

Autres recettes: Plage de dates

### bolle-time-picker

Attributs: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `hour-cycle`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Propriétés JavaScript: `labels` · Slots: `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · Événements: `change`, `value-input`

**Choix d'une heure** — Le sélecteur ouvre le cadran de l'heure depuis le champ : la valeur choisie arrive avec change, hour-cycle décide le format sur douze ou vingt-quatre heures et le slot title nomme le cadran.

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

Attributs: `color-scheme`, `compact-width`, `density`, `filter`, `filterable`, `inactive`, `locale`, `menu-label`, `options`, `quick`, `selection-mode`, `tail`, `variant` · Propriétés JavaScript: `items`, `labels` · Slots: - · Événements: -

**Menu d'actions** — show(anchor) ouvre le menu sous l'élément qui l'appelle et le choix arrive avec menu-select. items déclare les entrées, avec icône, raccourci, disabled et enfants pour le sous-menu.

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

Attributs: `color`, `label`, `open`, `tail` · Propriétés JavaScript: `items` · Slots: `icon` · Événements: `action`

**Actions rapides** — Le menu des boutons flottants ouvre les actions secondaires depuis le bouton principal : items déclare les entrées, open dit s'il est ouvert et le choix arrive avec menu-select.

```vue
<template>
  <bolle-fab-menu label="Azioni rapide" :items="items">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-fab-menu>
</template>
```

### bolle-split-button

Attributs: `disabled`, `icon`, `label`, `menu-label`, `size`, `variant` · Propriétés JavaScript: `items` · Slots: `icon` · Événements: `action`

**Action principale et menu** — Le bouton divisé garde l'action principale à gauche et ouvre le menu depuis la commande voisine : les entrées viennent de items et le choix avec menu-select, tandis que le clic sur l'action principale arrive avec click.

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

Attributs: `error`, `open`, `placeholder`, `supporting-text`, `variant` · Slots: `supporting` · Événements: `change`

**Select avec options natives** — La select enveloppe un élément select natif : les options restent dans le balisage et la valeur arrive avec change. Le menu qui s'ouvre est celui du composant, avec la même forme que les champs de texte.

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

Attributs: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Propriétés JavaScript: `options` · Slots: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · Événements: `change`, `value-input`

**Champ avec suggestions** — suggestions déclare les suggestions et le composant les filtre pendant la saisie, en les rapportant avec suggest ; choisir une entrée remplit le champ et émet change. suggestion-delay règle l'attente avant de demander les données.

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

Attributs: `collapsed`, `context`, `current`, `label`, `max-width`, `min-width`, `search`, `variant`, `width` · Propriétés JavaScript: `contentStyles`, `empty`, `expanded`, `filter`, `item`, `items`, `labels`, `railItem` · Slots: `empty`, `filter`, `footer`, `header` · Événements: `collapse`, `expand`, `navigate`, `resize`

**Arborescence de navigation** — items déclare les entrées et leurs enfants : le composant construit l'arbre jusqu'à trois niveaux, ouvre la branche de l'entrée choisie et rapporte le chemin avec navigate. L'entrée courante se règle avec current, le chemin des entrées séparées par une barre.

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

Autres recettes: Recherche, compteurs et rail compact · Contenu d'une entrée

### bolle-app-shell

Attributs: `close-label`, `expanded-width`, `form`, `label`, `medium-width`, `supporting-label`, `supporting-mode`, `supporting-open` · Propriétés JavaScript: `labels` · Slots: `bar`, `bottom-bar`, `default`, `navigation`, `navigation-compact`, `status`, `supporting`, `supporting-actions`, `supporting-header`, `supporting-inline`, `supporting-modal` · Événements: `form-change`, `supporting-close`

**Coque complète** — La coque assemble les surfaces autour du contenu : la navigation, la barre, la barre inférieure et le panneau d'aide viennent des slots et le contenu principal est le slot par défaut. Les zones sans contenu n'occupent pas d'espace.

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

Autres recettes: Panneau d'aide

### bolle-dashboard

Attributs: `columns`, `compact-columns`, `density`, `label`, `medium-columns` · Propriétés JavaScript: `labels` · Slots: `default` · Événements: -

**Grille de tuiles** — Le tableau de bord dispose les tuiles reçues et n'impose aucun contenu : chaque tuile est un bolle-widget, et span décide du nombre de colonnes tandis que min-span fixe le minimum quand l'espace se réduit.

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

Autres recettes: Tuiles déplaçables et redimensionnables

### bolle-kanban

Attributs: `addable`, `card-gap`, `collapsible`, `column-gap`, `column-max-width`, `column-min-width`, `density`, `empty-label`, `error`, `label`, `lanes`, `loading`, `movable`, `selected` · Propriétés JavaScript: `card`, `cardActions`, `cards`, `collapsed`, `columnActions`, `columnRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `labels`, `laneLabel`, `laneRenderer`, `loadingRenderer`, `restrict` · Slots: `empty`, `error`, `loading` · Événements: `card-action`, `card-add`, `card-move`, `card-move-blocked`, `card-open`, `column-action`, `column-collapse`, `retry`

**Tableau minimal** — columns déclare les colonnes et cards les cartes, chacune avec la colonne où elle se trouve. Avec movable, le lecteur glisse la carte ou la déplace avec Alt et les flèches : le tableau applique le déplacement et le rapporte avec card-move.

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

Autres recettes: Règle de déplacement et limites · Contenu de la carte

### bolle-gantt

Attributs: `baseline`, `density`, `editable`, `empty-label`, `error`, `group-by`, `label`, `linkable`, `loading`, `scale`, `selected` · Propriétés JavaScript: `barRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `groupLabel`, `labels`, `loadingRenderer`, `restrict`, `tasks` · Slots: `empty`, `error`, `loading` · Événements: `columns-change`, `dependency-add`, `dependency-blocked`, `retry`, `task-change`, `task-change-blocked`, `task-open`, `task-select`, `view-change`

**Plan minimal** — Le plan dessine les tâches sur l'axe du temps : parent construit l'arbre et une tâche avec des enfants devient une barre de synthèse. La hauteur de l'hôte est obligatoire, car la surface remplit l'espace qu'elle reçoit.

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

Autres recettes: Colonnes et contenu des cellules · Déplacer et redimensionner · Contenu de la barre · États et slots

### bolle-data-table

Attributs: `compact-row-height`, `default-column-width`, `density`, `empty-label`, `error`, `expandable`, `group-by`, `group-height`, `header-height`, `label`, `loading`, `max-column-width`, `min-column-width`, `overscan`, `page`, `page-size`, `row-height`, `row-key`, `selectable`, `total`, `updating`, `variant`, `virtual` · Propriétés JavaScript: `columnHandler`, `columns`, `contentStyles`, `detail`, `emptyRenderer`, `errorRenderer`, `expanded`, `footerRenderer`, `groupRenderer`, `groupSummary`, `headerRenderer`, `labels`, `loadingRenderer`, `pageHandler`, `rowActions`, `rowRenderer`, `rows`, `selected`, `sort`, `sortHandler` · Slots: `empty`, `empty-state`, `error`, `footer`, `header`, `loading` · Événements: `column-change`, `expand`, `group`, `retry`, `row-action`, `row-activate`, `select`, `sort`

**Emplacement du framework via un wrapper** — Vue et React ne peuvent pas transmettre un emplacement avec portée à un élément personnalisé. Un wrapper de quelques lignes transforme l'emplacement en renderer : la page écrit le template de la cellule une fois, le wrapper monte le contenu pour chaque ligne et libère la mémoire quand la cellule quitte le document.

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

Autres recettes: Enregistrer les composants · Table minimale · Formater les valeurs · Cellule personnalisée · Tri · Sélection des lignes · Détail de la ligne · Regroupement · Pagination · Chargement, erreur et vide · Colonnes fixes, largeurs et visibilité · Défilement continu · Style via les parties CSS
