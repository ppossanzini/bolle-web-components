[Italiano](../it/react.md) · [English](../en/react.md) · [Français](./react.md) · [中文](../zh/react.md)

# React · exemples d’utilisation exhaustifs

Ce guide couvre les 51 composants de la bibliothèque avec un exemple React pour
chacun. La référence des attributs, des slots, des événements et des méthodes est
la même que celle du guide Vue : [vue.md](./vue.md). Vous trouverez ici les règles
propres à React et le code.

La base recommandée est React 19. Avec React 18, les exemples fonctionnent en
changeant la manière de passer les propriétés non chaînes et les propriétés
booléennes (voir ci-dessous).

## Installation et enregistrement

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

L'import d'enregistrement doit précéder le premier rendu : React 19 décide
s'il faut écrire une propriété ou un attribut en examinant l'instance déjà mise à
jour. Le thème sombre s'active avec
`document.documentElement.dataset.theme = "dark"`.

## Règles d'intégration

### Propriétés

React 19 écrit une propriété DOM lorsqu'elle existe sur l'instance de l'élément,
sinon un attribut. Les tableaux, les objets et les booléens se passent donc
directement :

```tsx
<bolle-list items={items} value={selected} expanded={expanded} />
<bolle-text-field value={email} maxlength={120} counter />
<bolle-button disabled={false} />
```

Avec React 18, les valeurs non chaînes deviendraient des attributs
(`[object Object]`) et `disabled={false}` écrirait `disabled="false"`, ce qui est
de toute façon vrai. Dans ce cas, affectez les propriétés avec le hook
`useBolleProps` présenté ci-dessous, ou utilisez
`disabled={undefined}` pour les booléens faux.

### Événements

React ne mappe pas les événements personnalisés (`change`, `value-input`,
`menu-select`…) sur les props JSX. Il faut les brancher avec `addEventListener`
sur une ref. Les événements natifs `click` et `submit` continuent d'utiliser
`onClick` et `onSubmit`.

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

Le second argument de `handler` est l'événement : il sert pour `before-close`,
où `event.preventDefault()` annule la fermeture.

### Ref et méthodes

Dialog, sheet, snackbar, tooltip, menu, fab-menu et carousel exposent des
méthodes impératives. La ref est typée avec la classe du composant.

```tsx
const snackbar = useRef<BolleSnackbar | null>(null);

<bolle-snackbar ref={snackbar} message="Documento salvato" />
<bolle-button onClick={() => snackbar.current?.show("Documento salvato")}>Salva</bolle-button>
```

### État contrôlé

Le modèle est identique à celui de Vue : un état React passé comme propriété et
réaligné dans le listener.

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

Pour la checkbox, le switch, le radio et la chip de filtre, l'événement est
`change` avec `checked` ou `selected` ; pour le text field, la search, le slider,
les segmented buttons, le date et le time picker, c'est
`value-input`/`change` avec `value`. Même lorsque l'événement s'appelle
`change`, ce n'est pas l'événement natif de React : il faut le brancher avec
`useBolleEvent`.

### Formulaires

Les composants sont form-associated : ils entrent dans le `FormData` avec `name`
et `value`, sans input caché. `form.reset()` rétablit les valeurs initiales.

```tsx
function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log(data.get("email"), data.get("newsletter"));
}
```

### Slots

Les slots sont en light DOM : on passe un enfant avec l'attribut `slot`.

```tsx
<bolle-app-bar label="Posta">
  <bolle-icon-button slot="leading" label="Menu">☰</bolle-icon-button>
</bolle-app-bar>

<bolle-button>
  <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true">…</svg>
  Nuovo
</bolle-button>
```

React 19 prend en charge `slot` comme attribut ; avec React 18, il est de toute
façon écrit comme attribut personnalisé.

### Raccourcis clavier

Chaque élément `bolle-*` sauf `bolle-menu` accepte `shortcut` avec la syntaxe
de `aria-keyshortcuts`. Le composant pose `aria-keyshortcuts` sur le contrôle
interne qui reçoit le focus et gère la touche lui-même : aucun écouteur dans
`useEffect` n’est nécessaire. Les règles sont dans le
[guide Vue](vue.md#raccourcis-clavier).

```tsx
<bolle-button shortcut="Alt+S" onClick={save}>Enregistrer</bolle-button>
<bolle-text-field label="Rechercher" shortcut="Control+K Meta+K" />
```

### Icônes

Les slots acceptent du JSX, donc des SVG inline. Le champ `icon` à l'intérieur des
tableaux d'items est en revanche rendu comme texte : utilisez un nom de ligature
Material Symbols avec la police d'icônes du projet, ou un caractère. Ne passez
pas de balisage sous forme de chaîne.

### Types JSX

Sans déclarations, TypeScript refuse les tags inconnus. Un fallback compact :

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

Pour un type checking précis, ajoutez des déclarations ponctuelles, qui ont la
priorité sur le fallback :

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

Dorénavant, les imports de React (`import * as React from "react"` pour les types,
plus `useRef`, `useState` et les helpers) sont considérés comme présents dans
chaque exemple.

### État appliqué et crochets

Les composants appliquent eux-mêmes le changement du lecteur et le rapportent
avec un événement : tri, page, sélection, ouverture de ligne, regroupement,
colonnes, déplacement d'une carte ou d'une tâche. Il n'est pas nécessaire de
réécrire l'état en écoutant ; l'écoute reste utile pour savoir ce qui a changé.

Quand les données sont sur un serveur, le composant confie le travail à un
crochet : `sortHandler`, `pageHandler` et `columnHandler` sur la table de
données, `restrict` sur kanban et gantt. Le crochet reçoit la demande et le
composant redessine quand la promesse est résolue. En React, on les affecte avec une ref ou une prop, car ce sont des propriétés et
non des attributs : `table.sortHandler = …`.

<!-- catalogue -->

## Catalogue des composants

Chaque composant liste ses attributs, propriétés JavaScript, slots et événements publics ; l'exemple est celui de la première recette de la documentation du site, déjà écrite pour ce framework.

### bolle-button

Attributs: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Événements: `change`

**Bouton avec icône** — La variante décide la forme : filled pour l'action principale, tonal pour la secondaire, outlined et text pour les autres. Le slot par défaut porte le texte, icon l'icône initiale et trailing-icon la finale.

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

Autres recettes: Bouton qui reste enfoncé

### bolle-icon-button

Attributs: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Événements: `change`

**Bouton icône** — label est obligatoire car c'est le nom lu par les lecteurs d'écran, le bouton n'affichant que le symbole. variant standard laisse l'icône sans fond, filled la pose sur une surface.

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

Attributs: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Événements: `change`

**Bouton flottant** — Le bouton flottant reste ancré au coin de son conteneur et n'affiche que le symbole : label est le nom accessible et reste obligatoire. size regular reste rond, extended ajoute le texte.

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

Attributs: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · Slots: `default`, `icon`, `trailing-icon` · Événements: `change`

**Bouton flottant étendu** — La forme étendue montre icône et texte ensemble : le slot icon porte le symbole, le slot par défaut le texte. Il reste le bouton de l'action principale de l'écran.

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

Attributs: `label`, `required`, `selection`, `shape`, `size`, `variant` · Slots: `default` · Événements: `selection-change`

**Boutons liés** — Le groupe réunit des boutons adjacents : variant connected retire l'espace et partage les bordures, selection single transforme le groupe en choix unique et rapporte la valeur avec change.

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

Attributs: `label`, `max`, `small`, `value` · Slots: `label` · Événements: -

**Signal sur un élément** — Le badge affiche value au-dessus de l'élément qui le contient et abrège le nombre au-delà de max en « 999+ ». small retire le texte et garde le point, pour un signal sans nombre.

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

Attributs: `align`, `divider`, `dock`, `label`, `sticky`, `variant` · Slots: `default`, `fab`, `leading`, `trailing` · Événements: -

**Barre inférieure avec bouton flottant** — La barre inférieure tient les commandes en ligne et le bouton flottant : le slot par défaut reçoit les commandes, leading et trailing les éléments latéraux, fab le bouton qui s'encastre dans l'encoche. dock amène le bouton dans la barre.

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

Attributs: `alt`, `color`, `initials`, `label`, `name`, `shape`, `size`, `src`, `status` · Slots: `badge`, `icon` · Événements: -

**Avatar avec image ou initiales** — src affiche l'image et, quand elle manque ou ne se charge pas, le composant revient aux initiales tirées de name. initials les fixe à la main, status ajoute le point de présence et size change la taille.

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

Autres recettes: Avatar avec une icône au lieu des initiales

### bolle-breadcrumb

Attributs: `label`, `max-items`, `separator` · Propriétés JavaScript: `items`, `labels` · Slots: - · Événements: `breadcrumb-select`

**Fil d'Ariane** — items déclare les entrées du chemin : le composant place le séparateur entre elles et marque la dernière comme page courante. separator choisit le signe, max-items comprime les entrées centrales derrière une commande.

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

Attributs: `interactive`, `label`, `max`, `overlap`, `size`, `total` · Propriétés JavaScript: `labels` · Slots: `default` · Événements: `avatar-group-select`

**Groupe d'avatars** — Le groupe empile les avatars reçus et résume les autres dans une bulle avec compteur : max décide combien en montrer, total dit combien il y en a quand on ne les passe pas tous.

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

Autres recettes: Bulle du compteur interactive

### bolle-empty-state

Attributs: `align`, `role`, `text`, `title`, `tone` · Propriétés JavaScript: `icon` · Slots: `actions`, `icon` · Événements: -

**État vide avec une commande** — L'état vide centre une icône, un titre et un texte ; le slot actions porte la commande qui sort de l'état vide. tone error le colore pour une erreur de chargement.

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

Autres recettes: Icône personnalisée et alignement

### bolle-pagination

Attributs: `form`, `label`, `page`, `page-size`, `range`, `total` · Propriétés JavaScript: `labels`, `pageSizes` · Slots: - · Événements: `page-change`

**Pagineur sur les lignes disponibles** — page-size active le pagineur et total dit combien de lignes existent : le composant se déplace seul vers la page demandée et la rapporte avec page-change, ainsi l'application découpe les données affichées.

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

Autres recettes: Choix de la taille et forme compacte

### bolle-progress-indicator

Attributs: `indeterminate`, `label`, `max`, `value`, `variant`, `wavy` · Slots: - · Événements: -

**Avancement linéaire et circulaire** — value dit ce qui est fait par rapport à max, label est le nom lu par les lecteurs d'écran. variant circular passe à l'anneau, indeterminate signale une attente sans valeur.

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

Slots: - · Événements: -

**Indicateur de chargement** — L'indicateur montre l'attente d'une opération : label est le nom lu par les lecteurs d'écran et reste obligatoire. variant contained le pose sur une surface quand il couvre une tuile.

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

Attributs: `action-label`, `close-label`, `duration`, `message`, `open`, `tail` · Slots: `action`, `dismiss`, `message` · Événements: `action`, `closed`, `queued`

**Message avec action** — show() ouvre le message et duration le ferme seul : le slot message porte le texte, action l'action qui l'accompagne et dismiss la commande de fermeture. message reste le raccourci pour le texte seul.

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

Attributs: `index`, `locale`, `open`, `padding`, `placement` · Propriétés JavaScript: `steps` · Slots: - · Événements: `finish`, `step-change`

**Visite depuis la configuration JSON** — Les étapes ne sont pas dans le code : parseTourConfig lit le JSON avec sa version et shouldStartTour la compare à celle déjà montrée par l’application. Le composant ne fait aucun appel réseau et ne mémorise rien : c’est l’application qui décide du démarrage et enregistre la version au finish.

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

Autres recettes: Une étape sans cible et l’action finale · Filtrer les commandes · Le tableau · C’est terminé · Piloter la visite et lire les étapes

### bolle-tooltip

Attributs: `label`, `persistent`, `supporting-text`, `tail`, `variant` · Propriétés JavaScript: `labels` · Slots: `actions`, `content`, `default`, `dismiss`, `label`, `supporting`, `trigger` · Événements: -

**Infobulle sur une commande** — L'infobulle s'accroche à un élément avec show(anchor) et se ferme seule quand le pointeur sort ou qu'Échap arrive. label est le texte court, supporting-text ajoute la ligne de détail.

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

Attributs: `index`, `label`, `next-label`, `previous-label`, `variant` · Slots: `controls`, `default`, `next`, `previous`, `status` · Événements: `change`

**Carrousel de cartes** — Le carrousel fait défiler les éléments du slot par défaut et affiche les commandes avant et arrière : index dit lequel est visible et le choix arrive avec change. Le défilement se fait par étapes, au toucher et au clavier.

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

Attributs: `href`, `label`, `orientation`, `tail`, `variant` · Slots: `content`, `default`, `media` · Événements: -

**Carte avec image et commandes** — La carte prend le contenu dans le slot par défaut, dans media l'image de tête qui occupe la largeur et dans actions la ligne de commandes. href transforme toute la carte en lien.

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

Autres recettes: Carte horizontale comme lien

### bolle-dialog

Attributs: `close-label`, `label`, `modal`, `open`, `variant` · Slots: `actions`, `default`, `heading` · Événements: `before-close`, `closed`

**Dialogue de confirmation** — open ouvre le dialogue et modal le rend bloquant : le focus reste à l'intérieur jusqu'à la fermeture, et la fermeture arrive avec closed. heading reçoit le titre lu comme en-tête, actions la ligne de commandes.

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

Autres recettes: Dialogue plein écran

### bolle-bottom-sheet

Attributs: `close-label`, `drag-handle`, `label`, `modal`, `open`, `variant` · Slots: `actions`, `default`, `heading` · Événements: `before-close`, `closed`

**Panneau inférieur** — Le panneau entre par le bord inférieur et porte ses commandes : drag-handle affiche la poignée qui le fait glisser, heading le titre, actions la ligne finale. open et show() l'ouvrent.

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

Attributs: `close-label`, `detached`, `label`, `modal`, `open`, `variant` · Slots: `actions`, `default`, `heading` · Événements: `before-close`, `closed`

**Panneau latéral de détail** — Le panneau entre par le côté indiqué par placement et laisse le contenu visible : c'est la forme adéquate pour le détail d'une ligne, avec heading pour le titre et actions pour les commandes de fin.

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

Attributs: `decorative`, `inset`, `variant`, `vertical` · Slots: - · Événements: -

**Séparateur entre groupes** — Le séparateur n'a pas de contenu : il divise deux groupes d'éléments, avec inset pour le détacher des bords et vertical pour séparer des commandes côte à côte.

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

Attributs: `alignment`, `collapsed`, `label`, `scrolled`, `sticky`, `subtitle`, `variant` · Slots: `actions`, `default`, `leading`, `title`, `trailing` · Événements: -

**Barre de l'application** — La barre porte le titre et les commandes : title reçoit le texte principal, subtitle la ligne en dessous, les slots leading et actions les commandes latérales. Le slot par défaut remplace le titre quand un en-tête plus riche est nécessaire.

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

Autres recettes: Barre qui se comprime au défilement

### bolle-toolbar

Attributs: `color`, `label`, `orientation`, `variant` · Slots: `default` · Événements: -

**Barre de commandes** — La barre dispose les éléments reçus dans le slot par défaut : des variantes différentes séparent les commandes principales des commandes de service, et la barre renvoie à la ligne les éléments en trop au lieu de les comprimer.

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

Attributs: `label`, `layout`, `value`, `variant` · Propriétés JavaScript: `items` · Slots: - · Événements: `navigate`

**Barre de navigation** — items déclare les destinations avec icône et texte, value dit laquelle est active : le composant applique le choix seul et le rapporte avec change. Au-delà de cinq destinations, mieux vaut passer à la barre latérale.

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

Attributs: `expanded`, `label`, `layout`, `value`, `variant` · Propriétés JavaScript: `items` · Slots: - · Événements: `navigate`

**Barre étroite** — La barre étroite montre les icônes des destinations et, avec expanded, aussi les textes. Elle se place entre la barre inférieure et le panneau latéral, quand l'espace est réduit mais que les sections restent nombreuses.

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

Attributs: `close-label`, `detached`, `label`, `modal`, `open`, `value`, `variant` · Propriétés JavaScript: `items` · Slots: `actions`, `default`, `heading` · Événements: `before-close`, `closed`, `navigate`

**Panneau de navigation** — Le panneau ouvre les entrées verticalement et peut se placer en ligne à côté du contenu ou par-dessus la page : placement start ou end choisit le côté, modal le rend bloquant.

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

Attributs: `activation`, `label`, `scrollable`, `value`, `variant` · Propriétés JavaScript: `items`, `labels` · Slots: `content-{itemId}`, `default` · Événements: `change`

**Onglets avec panneaux** — items déclare les onglets et value celui qui est actif : le composant applique le choix seul et le rapporte avec change. Chaque panneau nomme l'onglet qui l'ouvre via slot.

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

Autres recettes: Onglets qui défilent

### bolle-checkbox

Attributs: `checked`, `error`, `indeterminate`, `supporting-text` · Slots: `default` · Événements: `change`

**Case avec texte et aide** — La case prend le texte de l'étiquette dans le slot par défaut et change d'état seule, en rapportant checked avec change. supporting-text ajoute la ligne d'explication, indeterminate montre l'état mixte.

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

Autres recettes: Case qui pilote une liste

### bolle-switch

Attributs: `checked`, `error`, `indeterminate`, `supporting-text` · Propriétés JavaScript: `icon`, `iconSelected` · Slots: `default` · Événements: `change`

**Interrupteur** — L'interrupteur change d'état seul et rapporte la valeur avec change : c'est la forme adaptée à une préférence à effet immédiat, tandis que la case reste pour un choix à confirmer.

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

Attributs: `checked`, `error`, `indeterminate`, `supporting-text` · Slots: `default` · Événements: `change`

**Groupe d'options** — Les boutons radio se regroupent par name : choisir une entrée retire le choix aux autres du même groupe, et la valeur arrive avec change.

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

Attributs: `disabled`, `elevated`, `href`, `label`, `removable`, `remove-label`, `selected`, `variant` · Slots: `avatar`, `default`, `icon` · Événements: `action`, `change`, `remove`

**Pastille avec icône et retrait** — La pastille prend son texte dans le slot par défaut et, dans les autres, une icône ou un avatar. selected la marque comme choisie, removable ajoute la commande qui la retire et rapporte remove.

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

Attributs: `interactive`, `label`, `selection`, `variant` · Propriétés JavaScript: `expanded`, `itemRenderer`, `items`, `labels`, `value` · Slots: `default` · Événements: `action`, `change`, `expand`

**Liste avec icônes et détail** — La liste prend les lignes dans le slot par défaut et les compose avec icône, texte, aide et contenu final ; interactive active le clic et selection rapporte le choix avec change.

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

Autres recettes: Liste à partir d'un tableau

### bolle-segmented-buttons

Attributs: `multiple` · Propriétés JavaScript: `items`, `values` · Slots: - · Événements: `change`

**Choix entre segments** — Les segments viennent de items et le choix de value : le contrôle l'applique seul et le rapporte avec change. multiple autorise plusieurs segments et renvoie values.

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

Autres recettes: Choix multiple

### bolle-slider

Attributs: `compact`, `max`, `min`, `min-gap`, `step`, `suffix`, `upper-label`, `upper-value`, `variant` · Propriétés JavaScript: `icon` · Slots: `icon`, `label`, `value` · Événements: `change`, `value-input`

**Curseur unique** — Le curseur affiche la valeur sur l'étiquette et la renvoie avec input pendant le glissement et avec change à la fin. min et max fixent l'intervalle, step la granularité.

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

Autres recettes: Intervalle entre deux valeurs

### bolle-steps

Attributs: `options` · Slots: `label` · Événements: `change`

**Étapes d'un parcours** — options déclare les noms des étapes et value celle en cours : le composant marque les étapes faites, celle active et les restantes, et rapporte le choix avec change.

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

Attributs: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Slots: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · Événements: `change`, `value-input`

**Champ avec préfixe et texte d'aide** — Le champ prend dans les slots le préfixe, le suffixe et le texte d'aide, tandis que la valeur reste dans l'input et arrive avec input et change. variant filled ou outlined change la forme du cadre.

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

Autres recettes: Champ en erreur · Champ multiligne

### bolle-search

Attributs: `appearance`, `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `filter`, `inputmode`, `layout`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `suggestion-delay`, `suggestions-label`, `supporting-text`, `type`, `variant` · Propriétés JavaScript: `suggestions` · Slots: `leading`, `prefix`, `results`, `suffix`, `supporting`, `trailing` · Événements: `change`, `search`, `suggest`, `value-input`

**Barre de recherche avec résultats** — La recherche est un champ de texte avec la commande d'effacement déjà incluse : results reçoit la liste qui apparaît sous la barre, que l'application remplit avec les résultats de suggest ou search.

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

Autres recettes: Recherche en ligne dans la barre

### bolle-date-picker

Attributs: `autocapitalize`, `autocomplete`, `counter`, `end-value`, `enterkeyhint`, `error`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `selection-mode`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant`, `week-starts-on` · Propriétés JavaScript: `labels` · Slots: `end-label`, `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · Événements: `change`, `value-input`

**Choix d'une date** — Le sélecteur ouvre le calendrier depuis le champ : la valeur choisie arrive avec change au format ISO, et locale décide langue et noms des jours. selection-mode range ajoute la seconde date dans end-value.

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

Autres recettes: Plage de dates

### bolle-time-picker

Attributs: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `hour-cycle`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Propriétés JavaScript: `labels` · Slots: `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · Événements: `change`, `value-input`

**Choix d'une heure** — Le sélecteur ouvre le cadran de l'heure depuis le champ : la valeur choisie arrive avec change, hour-cycle décide le format sur douze ou vingt-quatre heures et le slot title nomme le cadran.

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

Attributs: `color-scheme`, `compact-width`, `density`, `filter`, `filterable`, `inactive`, `locale`, `menu-label`, `options`, `quick`, `selection-mode`, `tail`, `variant` · Propriétés JavaScript: `items`, `labels` · Slots: - · Événements: -

**Menu d'actions** — show(anchor) ouvre le menu sous l'élément qui l'appelle et le choix arrive avec menu-select. items déclare les entrées, avec icône, raccourci, disabled et enfants pour le sous-menu.

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

Attributs: `color`, `label`, `open`, `tail` · Propriétés JavaScript: `items` · Slots: `icon` · Événements: `action`

**Actions rapides** — Le menu des boutons flottants ouvre les actions secondaires depuis le bouton principal : items déclare les entrées, open dit s'il est ouvert et le choix arrive avec menu-select.

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

Attributs: `disabled`, `icon`, `label`, `menu-label`, `size`, `variant` · Propriétés JavaScript: `items` · Slots: `icon` · Événements: `action`

**Action principale et menu** — Le bouton divisé garde l'action principale à gauche et ouvre le menu depuis la commande voisine : les entrées viennent de items et le choix avec menu-select, tandis que le clic sur l'action principale arrive avec click.

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

Attributs: `error`, `open`, `placeholder`, `supporting-text`, `variant` · Slots: `supporting` · Événements: `change`

**Select avec options natives** — La select enveloppe un élément select natif : les options restent dans le balisage et la valeur arrive avec change. Le menu qui s'ouvre est celui du composant, avec la même forme que les champs de texte.

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

Attributs: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · Propriétés JavaScript: `options` · Slots: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · Événements: `change`, `value-input`

**Champ avec suggestions** — suggestions déclare les suggestions et le composant les filtre pendant la saisie, en les rapportant avec suggest ; choisir une entrée remplit le champ et émet change. suggestion-delay règle l'attente avant de demander les données.

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

Attributs: `collapsed`, `context`, `current`, `label`, `max-width`, `min-width`, `search`, `variant`, `width` · Propriétés JavaScript: `contentStyles`, `empty`, `expanded`, `filter`, `item`, `items`, `labels`, `railItem` · Slots: `empty`, `filter`, `footer`, `header` · Événements: `collapse`, `expand`, `navigate`, `resize`

**Arborescence de navigation** — items déclare les entrées et leurs enfants : le composant construit l'arbre jusqu'à trois niveaux, ouvre la branche de l'entrée choisie et rapporte le chemin avec navigate. L'entrée courante se règle avec current, le chemin des entrées séparées par une barre.

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

Autres recettes: Recherche, compteurs et rail compact · Contenu d'une entrée

### bolle-app-shell

Attributs: `close-label`, `expanded-width`, `form`, `label`, `medium-width`, `supporting-label`, `supporting-mode`, `supporting-open` · Propriétés JavaScript: `labels` · Slots: `bar`, `bottom-bar`, `default`, `navigation`, `navigation-compact`, `status`, `supporting`, `supporting-actions`, `supporting-header`, `supporting-inline`, `supporting-modal` · Événements: `form-change`, `supporting-close`

**Coque complète** — La coque assemble les surfaces autour du contenu : la navigation, la barre, la barre inférieure et le panneau d'aide viennent des slots et le contenu principal est le slot par défaut. Les zones sans contenu n'occupent pas d'espace.

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

Autres recettes: Panneau d'aide

### bolle-dashboard

Attributs: `columns`, `compact-columns`, `density`, `label`, `medium-columns` · Propriétés JavaScript: `labels` · Slots: `default` · Événements: -

**Grille de tuiles** — Le tableau de bord dispose les tuiles reçues et n'impose aucun contenu : chaque tuile est un bolle-widget, et span décide du nombre de colonnes tandis que min-span fixe le minimum quand l'espace se réduit.

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

Autres recettes: Tuiles déplaçables et redimensionnables

### bolle-kanban

Attributs: `addable`, `card-gap`, `collapsible`, `column-gap`, `column-max-width`, `column-min-width`, `density`, `empty-label`, `error`, `label`, `lanes`, `loading`, `movable`, `selected` · Propriétés JavaScript: `card`, `cardActions`, `cards`, `collapsed`, `columnActions`, `columnRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `labels`, `laneLabel`, `laneRenderer`, `loadingRenderer`, `restrict` · Slots: `empty`, `error`, `loading` · Événements: `card-action`, `card-add`, `card-move`, `card-move-blocked`, `card-open`, `column-action`, `column-collapse`, `retry`

**Tableau minimal** — columns déclare les colonnes et cards les cartes, chacune avec la colonne où elle se trouve. Avec movable, le lecteur glisse la carte ou la déplace avec Alt et les flèches : le tableau applique le déplacement et le rapporte avec card-move.

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

Autres recettes: Règle de déplacement et limites · Contenu de la carte

### bolle-gantt

Attributs: `baseline`, `density`, `editable`, `empty-label`, `error`, `group-by`, `label`, `linkable`, `loading`, `scale`, `selected` · Propriétés JavaScript: `barRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `groupLabel`, `labels`, `loadingRenderer`, `restrict`, `tasks` · Slots: `empty`, `error`, `loading` · Événements: `columns-change`, `dependency-add`, `dependency-blocked`, `retry`, `task-change`, `task-change-blocked`, `task-open`, `task-select`, `view-change`

**Plan minimal** — Le plan dessine les tâches sur l'axe du temps : parent construit l'arbre et une tâche avec des enfants devient une barre de synthèse. La hauteur de l'hôte est obligatoire, car la surface remplit l'espace qu'elle reçoit.

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

Autres recettes: Colonnes et contenu des cellules · Déplacer et redimensionner · Contenu de la barre · États et slots

### bolle-data-table

Attributs: `compact-row-height`, `default-column-width`, `density`, `empty-label`, `error`, `expandable`, `group-by`, `group-height`, `header-height`, `label`, `loading`, `max-column-width`, `min-column-width`, `overscan`, `page`, `page-size`, `row-height`, `row-key`, `selectable`, `total`, `updating`, `variant`, `virtual` · Propriétés JavaScript: `columnHandler`, `columns`, `contentStyles`, `detail`, `emptyRenderer`, `errorRenderer`, `expanded`, `footerRenderer`, `groupRenderer`, `groupSummary`, `headerRenderer`, `labels`, `loadingRenderer`, `pageHandler`, `rowActions`, `rowRenderer`, `rows`, `selected`, `sort`, `sortHandler` · Slots: `empty`, `empty-state`, `error`, `footer`, `header`, `loading` · Événements: `column-change`, `expand`, `group`, `retry`, `row-action`, `row-activate`, `select`, `sort`

**Emplacement du framework via un wrapper** — Vue et React ne peuvent pas transmettre un emplacement avec portée à un élément personnalisé. Un wrapper de quelques lignes transforme l'emplacement en renderer : la page écrit le template de la cellule une fois, le wrapper monte le contenu pour chaque ligne et libère la mémoire quand la cellule quitte le document.

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

Autres recettes: Enregistrer les composants · Table minimale · Formater les valeurs · Cellule personnalisée · Tri · Sélection des lignes · Détail de la ligne · Regroupement · Pagination · Chargement, erreur et vide · Colonnes fixes, largeurs et visibilité · Défilement continu · Style via les parties CSS
