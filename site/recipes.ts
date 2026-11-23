/**
 * Code recipes for a component page. Every recipe exists in each supported
 * language, so the reader picks the language once and reads one complete
 * example per documented behaviour. Values are the public properties and
 * events of the component.
 */
export type RecipeLang = "html" | "vue" | "react";

export interface Recipe {
  /** Italian source text, localised at render time. */
  title: string;
  /** Italian source text, localised at render time. */
  description: string;
  code: Record<RecipeLang, string>;
}

/** Order and labels of the language switch above the recipes. */
export const RECIPE_LANGS: Array<{ id: RecipeLang; label: string }> = [
  { id: "html", label: "HTML + JavaScript" },
  { id: "vue", label: "Vue 3" },
  { id: "react", label: "React" },
];

export const RECIPES: Record<string, Recipe[]> = {
  "bolle-avatar": [
    {
      title: "Avatar con immagine o iniziali",
      description:
        "src mostra l'immagine e, quando manca o non si carica, il componente torna alle iniziali ricavate da name. initials le fissa a mano, status aggiunge il punto di presenza e size cambia la misura.",
      code: {
        html: `<bolle-avatar src="/giulia.jpg" name="Giulia Ferraro" status="online"></bolle-avatar>
<bolle-avatar name="Marco Bellini" size="lg"></bolle-avatar>
<bolle-avatar initials="GF" color="tertiary"></bolle-avatar>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `const persone = [
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
}`,
      },
    },
    {
      title: "Avatar con icona al posto delle iniziali",
      description:
        "Lo slot icon sostituisce le iniziali: serve per un account generico o per un'immagine non disponibile. Lo slot badge sovrappone una segnalazione all'angolo.",
      code: {
        html: `<bolle-avatar label="Account">
  <span slot="icon" aria-hidden="true">★</span>
</bolle-avatar>

<bolle-avatar name="Giulia Ferraro">
  <span slot="badge">3</span>
</bolle-avatar>`,
        vue: `<template>
  <bolle-avatar label="Account">
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-avatar>

  <bolle-avatar name="Giulia Ferraro">
    <span slot="badge">3</span>
  </bolle-avatar>
</template>`,
        react: `export function Avatar() {
  return (
    <>
      <bolle-avatar label="Account">
        <span slot="icon" aria-hidden="true">★</span>
      </bolle-avatar>
      <bolle-avatar name="Giulia Ferraro">
        <span slot="badge">3</span>
      </bolle-avatar>
    </>
  );
}`,
      },
    },
  ],
  "bolle-avatar-group": [
    {
      title: "Gruppo di avatar",
      description:
        "Il gruppo impila gli avatar che riceve e riassume i restanti in una bolla con il conteggio: max decide quanti mostrarne, total dice quanti sono in tutto quando non li passi tutti.",
      code: {
        html: `<bolle-avatar-group label="Partecipanti" max="3" total="8">
  <bolle-avatar name="Giulia Ferraro"></bolle-avatar>
  <bolle-avatar name="Marco Bellini"></bolle-avatar>
  <bolle-avatar name="Sara Colombo"></bolle-avatar>
</bolle-avatar-group>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `export function Partecipanti({ persone }) {
  return (
    <bolle-avatar-group label="Partecipanti" max={3} total={8}>
      {persone.map((persona) => (
        <bolle-avatar key={persona.name} name={persona.name} />
      ))}
    </bolle-avatar-group>
  );
}`,
      },
    },
    {
      title: "Bolla del conteggio interattiva",
      description:
        "Con interactive la bolla che nasconde i restanti diventa un comando: il clic arriva con avatar-group-select e il conteggio dice quante persone restano fuori.",
      code: {
        html: `<bolle-avatar-group id="gruppo" label="Partecipanti" max="4" interactive>
  <bolle-avatar name="Giulia Ferraro"></bolle-avatar>
  <bolle-avatar name="Marco Bellini"></bolle-avatar>
  <bolle-avatar name="Sara Colombo"></bolle-avatar>
  <bolle-avatar name="Luca De Santis"></bolle-avatar>
  <bolle-avatar name="Francesca Moretti"></bolle-avatar>
</bolle-avatar-group>

<script type="module">
  document.querySelector("#gruppo").addEventListener("avatar-group-select", (event) => {
    console.log("Persone nascoste:", event.detail.count);
  });
</script>`,
        vue: `<script setup lang="ts">
import type { AvatarGroupSelectDetail } from "@bolle/web-components";

const onSelect = (event: CustomEvent<AvatarGroupSelectDetail>) => {
  console.log("Persone nascoste:", event.detail.count);
};
</script>

<template>
  <bolle-avatar-group
    label="Partecipanti"
    :max="4"
    interactive
    @avatar-group-select="onSelect"
  >
    <bolle-avatar v-for="persona in partecipanti" :key="persona.name" :name="persona.name" />
  </bolle-avatar-group>
</template>`,
        react: `import { useEffect, useRef } from "react";

export function Partecipanti({ persone }) {
  const ref = useRef(null);

  useEffect(() => {
    const group = ref.current;
    if (!group) return;
    const onSelect = (event) => console.log("Persone nascoste:", event.detail.count);
    group.addEventListener("avatar-group-select", onSelect);
    return () => group.removeEventListener("avatar-group-select", onSelect);
  }, []);

  return (
    <bolle-avatar-group ref={ref} label="Partecipanti" max={4} interactive>
      {persone.map((persona) => (
        <bolle-avatar key={persona.name} name={persona.name} />
      ))}
    </bolle-avatar-group>
  );
}`,
      },
    },
  ],
  "bolle-breadcrumb": [
    {
      title: "Percorso di navigazione",
      description:
        "items dichiara le voci del percorso: il componente mette il separatore fra una voce e l'altra e segna l'ultima come pagina corrente. separator sceglie il segno, max-items comprime le voci centrali dietro un comando.",
      code: {
        html: `<bolle-breadcrumb id="percorso" label="Percorso"></bolle-breadcrumb>

<script type="module">
  const percorso = document.querySelector("#percorso");

  percorso.items = [
    { label: "Home", href: "#/it/" },
    { label: "Commesse", href: "#/it/commesse" },
    { label: "C2026-1000" },
  ];

  percorso.addEventListener("breadcrumb-select", (event) => {
    console.log("Voce scelta:", event.detail.label);
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useEffect, useRef } from "react";

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
}`,
      },
    },
  ],
  "bolle-empty-state": [
    {
      title: "Stato vuoto con un comando",
      description:
        "Lo stato vuoto centra icona, titolo e testo; lo slot actions porta il comando che fa uscire dallo stato vuoto. tone error lo colora per un errore di caricamento.",
      code: {
        html: `<bolle-empty-state title="Nessuna commessa" text="Non ci sono commesse per questo filtro.">
  <bolle-button slot="actions" variant="filled">Crea commessa</bolle-button>
</bolle-empty-state>

<bolle-empty-state
  tone="error"
  title="Piano non raggiungibile"
  text="Riprova fra qualche istante."
>
  <bolle-button slot="actions" variant="tonal">Riprova</bolle-button>
</bolle-empty-state>`,
        vue: `<template>
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
</template>`,
        react: `export function Stati() {
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
}`,
      },
    },
    {
      title: "Icona personalizzata e allineamento",
      description:
        "Lo slot icon sostituisce il simbolo predefinito e align sposta il blocco a sinistra, utile quando lo stato vuoto riempie una colonna di contenuto.",
      code: {
        html: `<bolle-empty-state align="start" title="Nessun documento" text="Allega il primo documento.">
  <span slot="icon" aria-hidden="true">★</span>
</bolle-empty-state>`,
        vue: `<template>
  <bolle-empty-state
    align="start"
    title="Nessun documento"
    text="Allega il primo documento."
  >
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-empty-state>
</template>`,
        react: `export function VuotoDocumenti() {
  return (
    <bolle-empty-state
      align="start"
      title="Nessun documento"
      text="Allega il primo documento."
    >
      <span slot="icon" aria-hidden="true">★</span>
    </bolle-empty-state>
  );
}`,
      },
    },
  ],
  "bolle-pagination": [
    {
      title: "Pager sui dati presenti",
      description:
        "page-size accende il pager e total dice quante righe esistono: il componente si sposta da sé alla pagina richiesta e la riporta con page-change, così l'applicazione taglia la fetta di dati che mostra.",
      code: {
        html: `<bolle-pagination id="pager" label="Pagine" page-size="10"></bolle-pagination>

<script type="module">
  const pager = document.querySelector("#pager");
  pager.total = 248;

  pager.addEventListener("page-change", (event) => {
    const { page, pageSize } = event.detail;
    const start = page * pageSize;
    console.log("Mostra le righe da", start, "a", start + pageSize - 1);
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useEffect, useRef } from "react";

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
}`,
      },
    },
    {
      title: "Scelta della dimensione e forma compatta",
      description:
        "pageSizes aggiunge il selettore delle righe per pagina: sceglierne una riporta la pagina a zero. form compact toglie l'elenco numerato e lascia intervallo e frecce, utile sotto una tabella.",
      code: {
        html: `<bolle-pagination id="pager" label="Pagine" page-size="10" form="compact"></bolle-pagination>

<script type="module">
  const pager = document.querySelector("#pager");
  pager.total = 248;
  pager.pageSizes = [10, 25, 50];
</script>`,
        vue: `<template>
  <bolle-pagination
    label="Pagine"
    page-size="10"
    form="compact"
    :total="total"
    :pageSizes="[10, 25, 50]"
  ></bolle-pagination>
</template>`,
        react: `export function Pager({ total }) {
  return (
    <bolle-pagination
      label="Pagine"
      page-size={10}
      form="compact"
      total={total}
      pageSizes={[10, 25, 50]}
    />
  );
}`,
      },
    },
  ],
  "bolle-button": [
    {
      title: "Pulsante con icona",
      description:
        "La variante decide la forma: filled per l'azione principale, tonal per la secondaria, outlined e text per le altre. Lo slot predefinito porta il testo, icon l'icona iniziale e trailing-icon quella finale.",
      code: {
        html: `<bolle-button variant="filled">Salva la commessa</bolle-button>
<bolle-button variant="outlined">
  <span slot="icon" aria-hidden="true">★</span>
  Archivia
</bolle-button>
<bolle-button variant="text" href="#/commesse">Tutte le commesse</bolle-button>`,
        vue: `<template>
  <bolle-button variant="filled">Salva la commessa</bolle-button>
  <bolle-button variant="outlined">
    <span slot="icon" aria-hidden="true">★</span>
    Archivia
  </bolle-button>
  <bolle-button variant="text" href="#/commesse">Tutte le commesse</bolle-button>
</template>`,
        react: `export function Azioni() {
  return (
    <>
      <bolle-button variant="filled">Salva la commessa</bolle-button>
      <bolle-button variant="outlined">
        <span slot="icon" aria-hidden="true">★</span>
        Archivia
      </bolle-button>
      <bolle-button variant="text" href="#/commesse">
        Tutte le commesse
      </bolle-button>
    </>
  );
}`,
      },
    },
    {
      title: "Pulsante che resta premuto",
      description:
        "Con toggle il pulsante mantiene lo stato premuto e lo riporta con selected, per i comandi che accendono qualcosa come il grassetto di un editor.",
      code: {
        html: `<bolle-button id="grassetto" toggle variant="outlined" aria-pressed="false">
  Grassetto
</bolle-button>

<script type="module">
  const grassetto = document.querySelector("#grassetto");

  grassetto.addEventListener("change", (event) => {
    // Attiva o disattiva la formattazione con event.detail.selected.
    console.log("Premuto:", event.detail.selected);
  });
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";

const premuto = ref(false);
</script>

<template>
  <bolle-button toggle variant="outlined" :selected="premuto" @change="premuto = !premuto">
    Grassetto
  </bolle-button>
</template>`,
        react: `import { useState } from "react";

export function Grassetto() {
  const [premuto, setPremuto] = useState(false);

  return (
    <bolle-button
      toggle
      variant="outlined"
      selected={premuto}
      onChange={() => setPremuto((value) => !value)}
    >
      Grassetto
    </bolle-button>
  );
}`,
      },
    },
  ],
  "bolle-icon-button": [
    {
      title: "Pulsante a icona",
      description:
        "label è obbligatoria perché è il nome letto dai lettori di schermo, dato che il pulsante mostra solo il simbolo. variant standard lascia l'icona senza sfondo, filled la appoggia su una superficie.",
      code: {
        html: `<bolle-icon-button label="Cerca">
  <span slot="icon" aria-hidden="true">★</span>
</bolle-icon-button>
<bolle-icon-button variant="filled" label="Aggiungi">
  <span slot="icon" aria-hidden="true">+</span>
</bolle-icon-button>`,
        vue: `<template>
  <bolle-icon-button label="Cerca">
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-icon-button>
  <bolle-icon-button variant="filled" label="Aggiungi">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-icon-button>
</template>`,
        react: `export function Comandi() {
  return (
    <>
      <bolle-icon-button label="Cerca">
        <span slot="icon" aria-hidden="true">★</span>
      </bolle-icon-button>
      <bolle-icon-button variant="filled" label="Aggiungi">
        <span slot="icon" aria-hidden="true">+</span>
      </bolle-icon-button>
    </>
  );
}`,
      },
    },
  ],
  "bolle-floating-action-button": [
    {
      title: "Pulsante flottante",
      description:
        "Il pulsante flottante resta ancorato all'angolo del contenitore e mostra il solo simbolo: label è il nome accessibile e va sempre dichiarata. size regular resta tondo, extended aggiunge il testo.",
      code: {
        html: `<div style="position: relative; block-size: 320px">
  <bolle-floating-action-button label="Nuova commessa" style="position: absolute; inset-block-end: 16px; inset-inline-end: 16px">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-floating-action-button>
</div>`,
        vue: `<template>
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
</style>`,
        react: `export function NuovaCommessa() {
  return (
    <div style={{ position: "relative", blockSize: 320 }}>
      <bolle-floating-action-button
        label="Nuova commessa"
        style={{ position: "absolute", insetBlockEnd: 16, insetInlineEnd: 16 }}
      >
        <span slot="icon" aria-hidden="true">+</span>
      </bolle-floating-action-button>
    </div>
  );
}`,
      },
    },
  ],
  "bolle-extended-fab": [
    {
      title: "Pulsante flottante esteso",
      description:
        "La forma estesa mostra icona e testo insieme: lo slot icon porta il simbolo, lo slot predefinito il testo. Resta il pulsante dell'azione principale della schermata.",
      code: {
        html: `<bolle-extended-fab>
  <span slot="icon" aria-hidden="true">+</span>
  Nuova commessa
</bolle-extended-fab>`,
        vue: `<template>
  <bolle-extended-fab>
    <span slot="icon" aria-hidden="true">+</span>
    Nuova commessa
  </bolle-extended-fab>
</template>`,
        react: `export function NuovaCommessa() {
  return (
    <bolle-extended-fab>
      <span slot="icon" aria-hidden="true">+</span>
      Nuova commessa
    </bolle-extended-fab>
  );
}`,
      },
    },
  ],
  "bolle-button-group": [
    {
      title: "Pulsanti collegati",
      description:
        "Il gruppo unisce pulsanti adiacenti: variant connected toglie lo spazio e condivide i bordi, selection single trasforma il gruppo in una scelta unica e riporta il valore con change.",
      code: {
        html: `<bolle-button-group variant="connected" selection="single" label="Vista">
  <bolle-button variant="outlined" value="elenco">Elenco</bolle-button>
  <bolle-button variant="outlined" value="griglia">Griglia</bolle-button>
</bolle-button-group>`,
        vue: `<script setup lang="ts">
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
    <bolle-button variant="outlined" value="elenco" :selected="vista === 'elenco'">
      Elenco
    </bolle-button>
    <bolle-button variant="outlined" value="griglia" :selected="vista === 'griglia'">
      Griglia
    </bolle-button>
  </bolle-button-group>
</template>`,
        react: `import { useState } from "react";

export function Vista() {
  const [vista, setVista] = useState("elenco");

  return (
    <bolle-button-group
      variant="connected"
      selection="single"
      label="Vista"
      onChange={(event) => setVista(event.detail.value)}
    >
      <bolle-button variant="outlined" value="elenco" selected={vista === "elenco"}>
        Elenco
      </bolle-button>
      <bolle-button variant="outlined" value="griglia" selected={vista === "griglia"}>
        Griglia
      </bolle-button>
    </bolle-button-group>
  );
}`,
      },
    },
  ],
  "bolle-split-button": [
    {
      title: "Azione principale e menu",
      description:
        "Il pulsante diviso tiene l'azione principale a sinistra e apre il menu dal comando a fianco: le voci arrivano da items e la scelta con menu-select, mentre il clic sull'azione principale arriva con click.",
      code: {
        html: `<bolle-split-button id="salva" label="Salva" variant="filled">
  <span slot="icon" aria-hidden="true">★</span>
</bolle-split-button>

<script type="module">
  const salva = document.querySelector("#salva");
  salva.items = [
    { id: "bozza", label: "Salva come bozza" },
    { id: "duplica", label: "Salva e duplica" },
  ];

  salva.addEventListener("menu-select", (event) => {
    console.log("Scelta:", event.detail.item.id);
  });
</script>`,
        vue: `<script setup lang="ts">
const items = [
  { id: "bozza", label: "Salva come bozza" },
  { id: "duplica", label: "Salva e duplica" },
];
</script>

<template>
  <bolle-split-button label="Salva" variant="filled" :items="items">
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-split-button>
</template>`,
        react: `const items = [
  { id: "bozza", label: "Salva come bozza" },
  { id: "duplica", label: "Salva e duplica" },
];

export function Salva() {
  return (
    <bolle-split-button label="Salva" variant="filled" items={items}>
      <span slot="icon" aria-hidden="true">★</span>
    </bolle-split-button>
  );
}`,
      },
    },
  ],
  "bolle-fab-menu": [
    {
      title: "Azioni rapide",
      description:
        "Il menu dei pulsanti flottanti apre le azioni secondarie dal pulsante principale: items dichiara le voci, open dice se è aperto e la scelta arriva con menu-select.",
      code: {
        html: `<bolle-fab-menu id="rapide" label="Azioni rapide">
  <span slot="icon" aria-hidden="true">+</span>
</bolle-fab-menu>

<script type="module">
  const rapide = document.querySelector("#rapide");
  rapide.items = [
    { id: "commessa", label: "Nuova commessa" },
    { id: "cliente", label: "Nuovo cliente" },
  ];
</script>`,
        vue: `<template>
  <bolle-fab-menu label="Azioni rapide" :items="items">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-fab-menu>
</template>`,
        react: `export function AzioniRapide({ items }) {
  return (
    <bolle-fab-menu label="Azioni rapide" items={items}>
      <span slot="icon" aria-hidden="true">+</span>
    </bolle-fab-menu>
  );
}`,
      },
    },
  ],
  "bolle-segmented-buttons": [
    {
      title: "Scelta fra segmenti",
      description:
        "I segmenti arrivano da items e la scelta da value: il controllo la applica da sé e la riporta con change. multiple ammette più segmenti e restituisce values.",
      code: {
        html: `<bolle-segmented-buttons id="vista" label="Vista"></bolle-segmented-buttons>

<script type="module">
  const vista = document.querySelector("#vista");
  vista.items = [
    { id: "elenco", label: "Elenco" },
    { id: "griglia", label: "Griglia" },
    { id: "mappa", label: "Mappa" },
  ];
  vista.value = "elenco";

  vista.addEventListener("change", (event) => {
    console.log("Vista scelta:", event.detail.value);
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useEffect, useRef, useState } from "react";

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
}`,
      },
    },
    {
      title: "Scelta multipla",
      description:
        "Con multiple il controllo tiene più segmenti accesi e restituisce values. È la forma giusta per i filtri rapidi, dove più criteri restano attivi insieme.",
      code: {
        html: `<bolle-segmented-buttons id="filtri" label="Filtri" multiple></bolle-segmented-buttons>

<script type="module">
  const filtri = document.querySelector("#filtri");
  filtri.items = [
    { id: "aperte", label: "Aperte" },
    { id: "urgenti", label: "Urgenti" },
    { id: "mie", label: "Mie" },
  ];
  filtri.values = ["aperte"];

  filtri.addEventListener("change", (event) => {
    console.log("Filtri attivi:", event.detail.values.join(", "));
  });
</script>`,
        vue: `<template>
  <bolle-segmented-buttons
    label="Filtri"
    multiple
    :items="filtri"
    :values="attivi"
  ></bolle-segmented-buttons>
</template>`,
        react: `export function Filtri({ filtri, attivi }) {
  return (
    <bolle-segmented-buttons
      label="Filtri"
      multiple
      items={filtri}
      values={attivi}
    />
  );
}`,
      },
    },
  ],
  "bolle-checkbox": [
    {
      title: "Casella con testo e supporto",
      description:
        "La casella prende dallo slot predefinito il testo dell'etichetta e cambia stato da sé, riportando checked con change. supporting-text aggiunge la riga di spiegazione, indeterminate mostra lo stato misto.",
      code: {
        html: `<bolle-checkbox name="urgente">Segna come urgente</bolle-checkbox>
<bolle-checkbox name="privacy" required supporting-text="Serve per inviare la richiesta">
  Ho letto l'informativa
</bolle-checkbox>`,
        vue: `<template>
  <bolle-checkbox name="urgente">Segna come urgente</bolle-checkbox>
  <bolle-checkbox
    name="privacy"
    required
    supporting-text="Serve per inviare la richiesta"
  >
    Ho letto l'informativa
  </bolle-checkbox>
</template>`,
        react: `export function Scelte() {
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
}`,
      },
    },
    {
      title: "Casella che governa un elenco",
      description:
        "indeterminate segnala una scelta parziale: è lo stato della casella di intestazione quando solo alcune righe sono scelte. Il valore lo decide l'applicazione dalle righe selezionate.",
      code: {
        html: `<bolle-checkbox id="tutte" indeterminate>Tutte le commesse</bolle-checkbox>
<bolle-checkbox name="riga-1">C2026-1000</bolle-checkbox>
<bolle-checkbox name="riga-2">C2026-1001</bolle-checkbox>

<script type="module">
  const tutte = document.querySelector("#tutte");
  const righe = Array.from(document.querySelectorAll("bolle-checkbox[name^='riga']"));

  tutte.addEventListener("change", () => {
    for (const riga of righe) riga.checked = tutte.checked;
  });
</script>`,
        vue: `<script setup lang="ts">
import { computed, ref } from "vue";

const righe = ref([
  { id: "riga-1", label: "C2026-1000", checked: false },
  { id: "riga-2", label: "C2026-1001", checked: true },
]);

const scelte = computed(() => righe.value.filter((riga) => riga.checked).length);
const tutte = computed(() => scelte.value === righe.value.length);
const parziale = computed(() => scelte.value > 0 && !tutte.value);
</script>

<template>
  <bolle-checkbox :checked="tutte" :indeterminate="parziale">Tutte le commesse</bolle-checkbox>
  <bolle-checkbox
    v-for="riga in righe"
    :key="riga.id"
    :name="riga.id"
    :checked="riga.checked"
    @change="riga.checked = !riga.checked"
  >
    {{ riga.label }}
  </bolle-checkbox>
</template>`,
        react: `import { useMemo, useState } from "react";

export function Elenco() {
  const [righe, setRighe] = useState([
    { id: "riga-1", label: "C2026-1000", checked: false },
    { id: "riga-2", label: "C2026-1001", checked: true },
  ]);

  const scelte = useMemo(() => righe.filter((riga) => riga.checked).length, [righe]);
  const tutte = scelte === righe.length;
  const parziale = scelte > 0 && !tutte;

  return (
    <>
      <bolle-checkbox checked={tutte} indeterminate={parziale}>
        Tutte le commesse
      </bolle-checkbox>
      {righe.map((riga) => (
        <bolle-checkbox
          key={riga.id}
          name={riga.id}
          checked={riga.checked}
          onChange={() =>
            setRighe((list) =>
              list.map((item) =>
                item.id === riga.id ? { ...item, checked: !item.checked } : item,
              ),
            )
          }
        >
          {riga.label}
        </bolle-checkbox>
      ))}
    </>
  );
}`,
      },
    },
  ],
  "bolle-switch": [
    {
      title: "Interruttore",
      description:
        "L'interruttore cambia stato da sé e riporta il valore con change: è la forma giusta per una preferenza che ha effetto immediato, mentre la casella resta per una scelta da confermare.",
      code: {
        html: `<bolle-switch name="notifiche" checked>Notifiche attive</bolle-switch>

<script type="module">
  document.querySelector("bolle-switch").addEventListener("change", (event) => {
    console.log("Notifiche:", event.detail.checked);
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useState } from "react";

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
}`,
      },
    },
  ],
  "bolle-radio-button": [
    {
      title: "Gruppo di opzioni",
      description:
        "I pulsanti di opzione si raggruppano per name: scegliere una voce toglie la scelta alle altre dello stesso gruppo, e il valore arriva con change.",
      code: {
        html: `<bolle-radio-button name="priorita" value="alta" checked>Alta</bolle-radio-button>
<bolle-radio-button name="priorita" value="media">Media</bolle-radio-button>
<bolle-radio-button name="priorita" value="bassa">Bassa</bolle-radio-button>

<script type="module">
  document.querySelectorAll("bolle-radio-button").forEach((opzione) => {
    opzione.addEventListener("change", (event) => {
      console.log("Priorità:", event.detail.value);
    });
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useState } from "react";

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
}`,
      },
    },
  ],
  "bolle-chip": [
    {
      title: "Pastiglia con icona e rimozione",
      description:
        "La pastiglia prende dallo slot predefinito il testo e dagli altri un'icona o un avatar. selected la segna come scelta, removable aggiunge il comando che la toglie e riporta remove.",
      code: {
        html: `<bolle-chip selected>Urgente</bolle-chip>
<bolle-chip removable remove-label="Togli il filtro Cliente">
  <bolle-avatar slot="avatar" name="Giulia Ferraro"></bolle-avatar>
  Cliente
</bolle-chip>

<script type="module">
  document.querySelector("bolle-chip[removable]").addEventListener("remove", () => {
    console.log("Filtro tolto");
  });
</script>`,
        vue: `<template>
  <bolle-chip selected>Urgente</bolle-chip>
  <bolle-chip removable remove-label="Togli il filtro Cliente">
    <bolle-avatar slot="avatar" name="Giulia Ferraro"></bolle-avatar>
    Cliente
  </bolle-chip>
</template>`,
        react: `export function Filtri() {
  return (
    <>
      <bolle-chip selected>Urgente</bolle-chip>
      <bolle-chip removable remove-label="Togli il filtro Cliente">
        <bolle-avatar slot="avatar" name="Giulia Ferraro" />
        Cliente
      </bolle-chip>
    </>
  );
}`,
      },
    },
  ],
  "bolle-text-field": [
    {
      title: "Campo con prefisso e supporto",
      description:
        "Il campo prende dagli slot il prefisso, il suffisso e il testo di supporto, mentre il valore resta nell'input e arriva con input e change. variant filled o outlined cambia la forma del riquadro.",
      code: {
        html: `<bolle-text-field label="Importo" type="number">
  <span slot="prefix">€</span>
  <span slot="supporting">Importo al netto dell'IVA</span>
</bolle-text-field>

<script type="module">
  const campo = document.querySelector("bolle-text-field");
  campo.addEventListener("change", (event) => {
    console.log("Importo:", event.detail.value);
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useState } from "react";

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
}`,
      },
    },
    {
      title: "Campo in errore",
      description:
        "error porta il contorno e il testo nel colore d'errore, e con supporting-text il messaggio spiega cosa correggere. La validazione resta all'applicazione, che decide quando alzare il segnale.",
      code: {
        html: `<bolle-text-field
  label="Email"
  type="email"
  required
  error
  supporting-text="Inserisci un indirizzo completo, con la chiocciola"
></bolle-text-field>`,
        vue: `<template>
  <bolle-text-field
    label="Email"
    type="email"
    required
    :error="inErrore"
    supporting-text="Inserisci un indirizzo completo, con la chiocciola"
  ></bolle-text-field>
</template>`,
        react: `export function Email({ inErrore }) {
  return (
    <bolle-text-field
      label="Email"
      type="email"
      required
      error={inErrore}
      supporting-text="Inserisci un indirizzo completo, con la chiocciola"
    />
  );
}`,
      },
    },
    {
      title: "Campo multiriga",
      description:
        "multiline trasforma il campo in un'area di testo e rows fissa l'altezza iniziale; gli slot restano quelli del campo, con il suffisso per un conteggio.",
      code: {
        html: `<bolle-text-field label="Note" multiline rows="4">
  <span slot="suffix">0/500</span>
</bolle-text-field>`,
        vue: `<template>
  <bolle-text-field label="Note" multiline rows="4">
    <span slot="suffix">{{ note.length }}/500</span>
  </bolle-text-field>
</template>`,
        react: `export function Note({ note }) {
  return (
    <bolle-text-field label="Note" multiline rows={4}>
      <span slot="suffix">{note.length}/500</span>
    </bolle-text-field>
  );
}`,
      },
    },
  ],
  "bolle-search": [
    {
      title: "Barra di ricerca con risultati",
      description:
        "La ricerca è un campo di testo con il comando di pulizia già incluso: results riceve l'elenco che compare sotto la barra, che l'applicazione riempie con i risultati di suggest o search.",
      code: {
        html: `<bolle-search id="cerca" label="Cerca commesse">
  <bolle-list slot="results" label="Risultati"></bolle-list>
</bolle-search>

<script type="module">
  const cerca = document.querySelector("#cerca");

  cerca.addEventListener("search", (event) => {
    console.log("Cerca:", event.detail.value);
  });
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";

const risultati = ref<Array<{ id: string; label: string }>>([]);
</script>

<template>
  <bolle-search label="Cerca commesse" @search="risultati = cercaSulServer($event.detail.value)">
    <bolle-list slot="results" label="Risultati">
      <bolle-list-item v-for="voce in risultati" :key="voce.id">
        {{ voce.label }}
      </bolle-list-item>
    </bolle-list>
  </bolle-search>
</template>`,
        react: `export function Ricerca({ risultati, onSearch }) {
  return (
    <bolle-search label="Cerca commesse" onSearch={(event) => onSearch(event.detail.value)}>
      <bolle-list slot="results" label="Risultati">
        {risultati.map((voce) => (
          <bolle-list-item key={voce.id}>{voce.label}</bolle-list-item>
        ))}
      </bolle-list>
    </bolle-search>
  );
}`,
      },
    },
    {
      title: "Ricerca in linea nella barra",
      description:
        "Con appearance contained e layout inline la ricerca sta dentro una barra e non occupa tutta la larghezza: la variante divided la stacca con una linea dal contenuto che segue.",
      code: {
        html: `<bolle-search
  label="Cerca"
  appearance="contained"
  layout="inline"
></bolle-search>`,
        vue: `<template>
  <bolle-search label="Cerca" appearance="contained" layout="inline"></bolle-search>
</template>`,
        react: `export function CercaInLinea() {
  return <bolle-search label="Cerca" appearance="contained" layout="inline" />;
}`,
      },
    },
  ],
  "bolle-select": [
    {
      title: "Select con opzioni native",
      description:
        "La select avvolge un elemento select nativo: le opzioni restano nel markup e il valore arriva con change. Il menu che si apre è quello del componente, con la stessa forma dei campi di testo.",
      code: {
        html: `<bolle-select label="Stato">
  <select name="stato">
    <option value="aperta">In corso</option>
    <option value="chiusa">Chiusa</option>
    <option value="sospesa">Sospesa</option>
  </select>
  <span slot="supporting">Lo stato decide l'ordine delle commesse</span>
</bolle-select>

<script type="module">
  document.querySelector("bolle-select").addEventListener("change", (event) => {
    console.log("Stato scelto:", event.detail.value);
  });
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";

const stato = ref("aperta");
</script>

<template>
  <bolle-select label="Stato" :value="stato" @change="stato = $event.detail.value">
    <select name="stato">
      <option value="aperta">In corso</option>
      <option value="chiusa">Chiusa</option>
      <option value="sospesa">Sospesa</option>
    </select>
    <span slot="supporting">Lo stato decide l'ordine delle commesse</span>
  </bolle-select>
</template>`,
        react: `export function Stato({ stato, onChange }) {
  return (
    <bolle-select label="Stato" value={stato} onChange={(event) => onChange(event.detail.value)}>
      <select name="stato">
        <option value="aperta">In corso</option>
        <option value="chiusa">Chiusa</option>
        <option value="sospesa">Sospesa</option>
      </select>
      <span slot="supporting">Lo stato decide l'ordine delle commesse</span>
    </bolle-select>
  );
}`,
      },
    },
  ],
  "bolle-autocomplete": [
    {
      title: "Campo con suggerimenti",
      description:
        "suggestions dichiara i suggerimenti e il componente li filtra mentre si scrive, riportandoli con suggest; scegliere una voce riempie il campo ed emette change. suggestion-delay regola l'attesa prima di chiedere i dati.",
      code: {
        html: `<bolle-autocomplete id="comune" label="Comune"></bolle-autocomplete>

<script type="module">
  const comune = document.querySelector("#comune");

  comune.suggestions = [
    { id: "bergamo", label: "Bergamo" },
    { id: "brescia", label: "Brescia" },
    { id: "seriate", label: "Seriate" },
  ];

  comune.addEventListener("suggest", (event) => {
    console.log("Testo scritto:", event.detail.value);
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `const suggerimenti = [
  { id: "bergamo", label: "Bergamo" },
  { id: "brescia", label: "Brescia" },
  { id: "seriate", label: "Seriate" },
];

export function Comune() {
  return (
    <bolle-autocomplete label="Comune" suggestions={suggerimenti} suggestion-delay={200} />
  );
}`,
      },
    },
  ],
  "bolle-slider": [
    {
      title: "Cursore singolo",
      description:
        "Il cursore mostra il valore sull'etichetta e lo riporta con input durante il trascinamento e con change alla fine. min e max fissano l'intervallo, step la granularità.",
      code: {
        html: `<bolle-slider id="avanzamento" label="Avanzamento" min="0" max="100" step="5" value="40"></bolle-slider>

<script type="module">
  document.querySelector("#avanzamento").addEventListener("change", (event) => {
    console.log("Avanzamento:", event.detail.value);
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useState } from "react";

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
}`,
      },
    },
    {
      title: "Intervallo fra due valori",
      description:
        "Con range il cursore mostra due maniglie e riporta value e upperValue: è la forma giusta per un filtro fra due importi o due date.",
      code: {
        html: `<bolle-slider
  id="fascia"
  label="Importo"
  range
  min="0"
  max="100000"
  step="1000"
  value="20000"
  upper-value="60000"
></bolle-slider>

<script type="module">
  document.querySelector("#fascia").addEventListener("change", (event) => {
    console.log("Da", event.detail.value, "a", event.detail.upperValue);
  });
</script>`,
        vue: `<template>
  <bolle-slider
    label="Importo"
    range
    min="0"
    max="100000"
    step="1000"
    :value="da"
    :upper-value="a"
    @change="da = $event.detail.value; a = $event.detail.upperValue"
  ></bolle-slider>
</template>`,
        react: `export function Fascia({ da, a, onChange }) {
  return (
    <bolle-slider
      label="Importo"
      range
      min={0}
      max={100000}
      step={1000}
      value={da}
      upper-value={a}
      onChange={(event) => onChange(event.detail.value, event.detail.upperValue)}
    />
  );
}`,
      },
    },
  ],
  "bolle-steps": [
    {
      title: "Passi di un percorso",
      description:
        "options dichiara i nomi dei passi e value quello corrente: il componente segna i passi fatti, quello attivo e i restanti, e riporta la scelta con change.",
      code: {
        html: `<bolle-steps id="passi" label="Avanzamento" options="Dati,Documenti,Riepilogo"></bolle-steps>

<script type="module">
  const passi = document.querySelector("#passi");
  passi.value = "1";

  passi.addEventListener("change", (event) => {
    console.log("Passo scelto:", event.detail.index);
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `const passi = ["Dati", "Documenti", "Riepilogo"];

export function Passi({ passo, onChange }) {
  return (
    <bolle-steps
      label="Avanzamento"
      options={passi}
      value={passo}
      onChange={(event) => onChange(String(event.detail.index))}
    />
  );
}`,
      },
    },
  ],
  "bolle-dialog": [
    {
      title: "Dialogo di conferma",
      description:
        "open apre il dialogo e modal lo rende bloccante: il fuoco resta dentro finché non si chiude, e la chiusura arriva con closed. heading riceve il titolo letto come intestazione, actions la riga dei comandi.",
      code: {
        html: `<bolle-button id="apri" variant="filled">Archivia</bolle-button>

<bolle-dialog id="conferma" label="Archivia commessa" modal>
  <h2 slot="heading">Archiviare la commessa?</h2>
  <p>La commessa esce dagli elenchi attivi e resta consultabile.</p>
  <bolle-button slot="actions" variant="text">Annulla</bolle-button>
  <bolle-button slot="actions" variant="filled" id="conferma-archivia">Archivia</bolle-button>
</bolle-dialog>

<script type="module">
  const dialogo = document.querySelector("#conferma");

  document.querySelector("#apri").addEventListener("click", () => dialogo.show());
  document.querySelector("#conferma-archivia").addEventListener("click", () => dialogo.close("archivia"));

  dialogo.addEventListener("closed", (event) => {
    if (event.detail.returnValue === "archivia") console.log("Commessa archiviata");
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useState } from "react";

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
        <bolle-button slot="actions" variant="text" onClick={() => setAperto(false)}>
          Annulla
        </bolle-button>
        <bolle-button slot="actions" variant="filled">
          Archivia
        </bolle-button>
      </bolle-dialog>
    </>
  );
}`,
      },
    },
    {
      title: "Dialogo a tutto schermo",
      description:
        "variant fullscreen occupa la finestra e serve per un compito lungo, come un editor: la superficie perde gli angoli e i comandi restano in fondo.",
      code: {
        html: `<bolle-dialog id="editor" label="Modifica commessa" variant="fullscreen" modal>
  <h2 slot="heading">Modifica commessa</h2>
  <p>Contenuto dell'editor.</p>
  <bolle-button slot="actions" variant="filled" id="salva-editor">Salva</bolle-button>
</bolle-dialog>

<script type="module">
  const editor = document.querySelector("#editor");
  document.querySelector("#salva-editor").addEventListener("click", () => editor.close("salva"));
</script>`,
        vue: `<template>
  <bolle-dialog label="Modifica commessa" variant="fullscreen" modal>
    <h2 slot="heading">Modifica commessa</h2>
    <p>Contenuto dell'editor.</p>
    <bolle-button slot="actions" variant="filled">Salva</bolle-button>
  </bolle-dialog>
</template>`,
        react: `export function Editor() {
  return (
    <bolle-dialog label="Modifica commessa" variant="fullscreen" modal>
      <h2 slot="heading">Modifica commessa</h2>
      <p>Contenuto dell'editor.</p>
      <bolle-button slot="actions" variant="filled">
        Salva
      </bolle-button>
    </bolle-dialog>
  );
}`,
      },
    },
  ],
  "bolle-bottom-sheet": [
    {
      title: "Foglio dal basso",
      description:
        "Il foglio entra dal bordo inferiore e porta con sé i comandi: drag-handle mostra la presa che lo trascina, heading il titolo, actions la riga finale. open e show() lo aprono.",
      code: {
        html: `<bolle-button id="apri" variant="filled">Filtri</bolle-button>

<bolle-bottom-sheet id="filtri" label="Filtri" drag-handle modal>
  <h2 slot="heading">Filtri</h2>
  <p>Scegli lo stato delle commesse.</p>
  <bolle-button slot="actions" variant="text" id="chiudi-filtri">Annulla</bolle-button>
  <bolle-button slot="actions" variant="filled">Applica</bolle-button>
</bolle-bottom-sheet>

<script type="module">
  const filtri = document.querySelector("#filtri");
  document.querySelector("#apri").addEventListener("click", () => filtri.show());
  document.querySelector("#chiudi-filtri").addEventListener("click", () => filtri.close());
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useState } from "react";

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
        <bolle-button slot="actions" variant="text" onClick={() => setAperto(false)}>
          Annulla
        </bolle-button>
        <bolle-button slot="actions" variant="filled">
          Applica
        </bolle-button>
      </bolle-bottom-sheet>
    </>
  );
}`,
      },
    },
  ],
  "bolle-side-sheet": [
    {
      title: "Pannello laterale di dettaglio",
      description:
        "Il pannello entra dal lato indicato da placement e lascia visibile il contenuto: è la forma giusta per il dettaglio di una riga, con heading per il titolo e actions per i comandi in coda.",
      code: {
        html: `<bolle-button id="apri" variant="tonal">Dettaglio</bolle-button>

<bolle-side-sheet id="dettaglio" label="Dettaglio commessa" placement="end" modal>
  <h2 slot="heading">C2026-1000</h2>
  <p>Ristrutturazione scuola di Seriate.</p>
  <bolle-button slot="actions" variant="filled">Apri scheda</bolle-button>
</bolle-side-sheet>

<script type="module">
  const dettaglio = document.querySelector("#dettaglio");
  document.querySelector("#apri").addEventListener("click", () => dettaglio.show());
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";

const aperto = ref(false);
</script>

<template>
  <bolle-button variant="tonal" @click="aperto = true">Dettaglio</bolle-button>
  <bolle-side-sheet label="Dettaglio commessa" placement="end" modal :open="aperto">
    <h2 slot="heading">C2026-1000</h2>
    <p>Ristrutturazione scuola di Seriate.</p>
    <bolle-button slot="actions" variant="filled">Apri scheda</bolle-button>
  </bolle-side-sheet>
</template>`,
        react: `import { useState } from "react";

export function Dettaglio() {
  const [aperto, setAperto] = useState(false);

  return (
    <>
      <bolle-button variant="tonal" onClick={() => setAperto(true)}>
        Dettaglio
      </bolle-button>
      <bolle-side-sheet label="Dettaglio commessa" placement="end" modal open={aperto}>
        <h2 slot="heading">C2026-1000</h2>
        <p>Ristrutturazione scuola di Seriate.</p>
        <bolle-button slot="actions" variant="filled">
          Apri scheda
        </bolle-button>
      </bolle-side-sheet>
    </>
  );
}`,
      },
    },
  ],
  "bolle-snackbar": [
    {
      title: "Messaggio con azione",
      description:
        "show() apre il messaggio e duration lo chiude da solo: lo slot message porta il testo, action l'azione che lo accompagna e dismiss il comando di chiusura. message resta la scorciatoia per il solo testo.",
      code: {
        html: `<bolle-button id="archivia" variant="filled">Archivia</bolle-button>

<bolle-snackbar id="feedback" duration="6000">
  <span slot="message">Commessa archiviata</span>
  <bolle-button slot="action" variant="text" id="annulla">Annulla</bolle-button>
</bolle-snackbar>

<script type="module">
  const feedback = document.querySelector("#feedback");

  document.querySelector("#archivia").addEventListener("click", () => feedback.show());
  document.querySelector("#annulla").addEventListener("click", () => {
    feedback.close();
    ripristinaLaCommmessa();
  });
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";

const messaggio = ref<HTMLElement | null>(null);
</script>

<template>
  <bolle-button variant="filled" @click="messaggio?.show()">Archivia</bolle-button>

  <bolle-snackbar ref="messaggio" duration="6000">
    <span slot="message">Commessa archiviata</span>
    <bolle-button slot="action" variant="text" @click="ripristina">Annulla</bolle-button>
  </bolle-snackbar>
</template>`,
        react: `import { useRef } from "react";

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
}`,
      },
    },
  ],
  "bolle-tooltip": [
    {
      title: "Suggerimento su un comando",
      description:
        "Il suggerimento si aggancia a un elemento con show(anchor) e si chiude da sé quando il puntatore esce o arriva Esc. label è il testo breve, supporting-text aggiunge la riga di dettaglio.",
      code: {
        html: `<bolle-icon-button id="salva" label="Salva">
  <span slot="icon" aria-hidden="true">★</span>
</bolle-icon-button>

<bolle-tooltip id="hint" label="Salva la commessa" supporting-text="Scorciatoia: Ctrl e S">
  <span slot="actions"><bolle-button variant="text">Annulla</bolle-button></span>
</bolle-tooltip>

<script type="module">
  const hint = document.querySelector("#hint");
  const salva = document.querySelector("#salva");

  salva.addEventListener("pointerenter", () => hint.show(salva));
  salva.addEventListener("pointerleave", () => hint.close());
</script>`,
        vue: `<script setup lang="ts">
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

  <bolle-tooltip ref="hint" label="Salva la commessa" supporting-text="Scorciatoia: Ctrl e S">
  </bolle-tooltip>
</template>`,
        react: `import { useRef } from "react";

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
        <span slot="icon" aria-hidden="true">★</span>
      </bolle-icon-button>
      <bolle-tooltip ref={hint} label="Salva la commessa" supporting-text="Scorciatoia: Ctrl e S" />
    </>
  );
}`,
      },
    },
  ],
  "bolle-menu": [
    {
      title: "Menu di azioni",
      description:
        "show(anchor) apre il menu sotto l'elemento che lo richiama e la scelta arriva con menu-select. items dichiara le voci, con icona, scorciatoia, disabled e figli per il sotto-menu.",
      code: {
        html: `<bolle-button id="apri" variant="tonal">Azioni</bolle-button>

<script type="module">
  const menu = document.querySelector("#azioni");
  menu.items = [
    { id: "apri", label: "Apri scheda" },
    { id: "duplica", label: "Duplica", shortcut: "Ctrl D" },
    {
      id: "archivia",
      label: "Archivia",
      children: [{ id: "chiudi", label: "Chiudi anche i documenti" }],
    },
  ];
  menu.show(document.querySelector("#apri"));

  menu.addEventListener("menu-select", (event) => {
    console.log("Voce scelta:", event.detail.item.id);
  });
</script>`,
        vue: `<script setup lang="ts">
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
  <bolle-menu ref="menu" label="Azioni" :items="items" @menu-select="onScelta"></bolle-menu>
</template>`,
        react: `import { useRef } from "react";

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
      <bolle-menu ref={menu} label="Azioni" items={items} onMenuSelect={onScelta} />
    </>
  );
}`,
      },
    },
  ],
  "bolle-app-bar": [
    {
      title: "Barra dell'applicazione",
      description:
        "La barra porta il titolo e i comandi: title riceve il testo principale, subtitle la riga sotto, gli slot leading e actions i comandi ai due lati. Lo slot predefinito sostituisce il titolo quando serve un'intestazione più ricca.",
      code: {
        html: `<bolle-app-bar title="Commesse" subtitle="12 attive" sticky>
  <bolle-icon-button slot="leading" label="Menu">
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-icon-button>
  <bolle-icon-button slot="actions" label="Cerca">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-icon-button>
</bolle-app-bar>`,
        vue: `<template>
  <bolle-app-bar title="Commesse" subtitle="12 attive" sticky>
    <bolle-icon-button slot="leading" label="Menu">
      <span slot="icon" aria-hidden="true">★</span>
    </bolle-icon-button>
    <bolle-icon-button slot="actions" label="Cerca">
      <span slot="icon" aria-hidden="true">+</span>
    </bolle-icon-button>
  </bolle-app-bar>
</template>`,
        react: `export function Barra() {
  return (
    <bolle-app-bar title="Commesse" subtitle="12 attive" sticky>
      <bolle-icon-button slot="leading" label="Menu">
        <span slot="icon" aria-hidden="true">★</span>
      </bolle-icon-button>
      <bolle-icon-button slot="actions" label="Cerca">
        <span slot="icon" aria-hidden="true">+</span>
      </bolle-icon-button>
    </bolle-app-bar>
  );
}`,
      },
    },
    {
      title: "Barra che si comprime allo scorrimento",
      description:
        "scrolled segnala che il contenuto sotto ha iniziato a scorrere e collapsed comprime la barra: l'applicazione ascolta lo scorrimento e passa il valore, mentre la barra cambia altezza e ombra.",
      code: {
        html: `<bolle-app-bar id="barra" title="Commesse" sticky>
  <span slot="actions"><bolle-button variant="text">Esporta</bolle-button></span>
</bolle-app-bar>

<script type="module">
  const barra = document.querySelector("#barra");
  const pagina = document.querySelector("main");

  pagina.addEventListener("scroll", () => {
    barra.scrolled = pagina.scrollTop > 0;
    barra.collapsed = pagina.scrollTop > 96;
  });
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";

const scorso = ref(false);
const compressa = ref(false);

const onScroll = (event: Event) => {
  const pagina = event.currentTarget as HTMLElement;
  scorso.value = pagina.scrollTop > 0;
  compressa.value = pagina.scrollTop > 96;
};
</script>

<template>
  <bolle-app-bar title="Commesse" sticky :scrolled="scorso" :collapsed="compressa">
    <span slot="actions"><bolle-button variant="text">Esporta</bolle-button></span>
  </bolle-app-bar>
  <main style="overflow: auto" @scroll="onScroll">Contenuto</main>
</template>`,
        react: `export function Barra({ children }) {
  const [scorso, setScorso] = useState(false);
  const [compressa, setCompressa] = useState(false);

  return (
    <>
      <bolle-app-bar title="Commesse" sticky scrolled={scorso} collapsed={compressa} />
      <main
        style={{ overflow: "auto" }}
        onScroll={(event) => {
          setScorso(event.currentTarget.scrollTop > 0);
          setCompressa(event.currentTarget.scrollTop > 96);
        }}
      >
        {children}
      </main>
    </>
  );
}`,
      },
    },
  ],
  "bolle-bottom-app-bar": [
    {
      title: "Barra inferiore con pulsante flottante",
      description:
        "La barra inferiore tiene i comandi in linea e il pulsante flottante: lo slot predefinito riceve i comandi, leading e trailing gli elementi ai lati, fab il pulsante che si incastra nel taglio. dock porta il pulsante dentro la barra.",
      code: {
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
        vue: `<template>
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
</template>`,
        react: `export function BarraInferiore() {
  return (
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
  );
}`,
      },
    },
  ],
  "bolle-toolbar": [
    {
      title: "Barra di comandi",
      description:
        "La barra dispone gli elementi che riceve nello slot predefinito: varianti diverse separano i comandi principali da quelli di servizio, e la barra porta a capo gli elementi in eccesso invece di comprimerli.",
      code: {
        html: `<bolle-toolbar label="Azioni sulle commesse">
  <bolle-segmented-buttons id="vista" label="Vista"></bolle-segmented-buttons>
  <bolle-button variant="text">Esporta</bolle-button>
  <bolle-button variant="text">Archivia</bolle-button>
</bolle-toolbar>`,
        vue: `<template>
  <bolle-toolbar label="Azioni sulle commesse">
    <bolle-segmented-buttons label="Vista" :items="viste" />
    <bolle-button variant="text">Esporta</bolle-button>
    <bolle-button variant="text">Archivia</bolle-button>
  </bolle-toolbar>
</template>`,
        react: `export function Comandi({ viste }) {
  return (
    <bolle-toolbar label="Azioni sulle commesse">
      <bolle-segmented-buttons label="Vista" items={viste} />
      <bolle-button variant="text">Esporta</bolle-button>
      <bolle-button variant="text">Archivia</bolle-button>
    </bolle-toolbar>
  );
}`,
      },
    },
  ],
  "bolle-navigation-bar": [
    {
      title: "Barra di navigazione",
      description:
        "items dichiara le destinazioni con icona e testo, value dice quale è attiva: il componente applica la scelta da sé e la riporta con change. Oltre cinque destinazioni conviene passare alla barra laterale.",
      code: {
        html: `<bolle-navigation-bar id="nav" label="Sezioni"></bolle-navigation-bar>

<script type="module">
  const nav = document.querySelector("#nav");
  nav.items = [
    { id: "commesse", label: "Commesse" },
    { id: "clienti", label: "Clienti" },
    { id: "scadenze", label: "Scadenze" },
  ];
  nav.value = "commesse";

  nav.addEventListener("change", (event) => {
    console.log("Sezione:", event.detail.value);
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `export function Sezioni({ sezioni, sezione, onChange }) {
  return (
    <bolle-navigation-bar label="Sezioni" items={sezioni} value={sezione} onChange={onChange} />
  );
}`,
      },
    },
  ],
  "bolle-navigation-rail": [
    {
      title: "Barra stretta",
      description:
        "La barra stretta mostra le icone delle destinazioni e, con expanded, anche i testi. Serve fra la barra inferiore e il pannello laterale, quando lo spazio è poco ma le sezioni restano molte.",
      code: {
        html: `<bolle-navigation-rail id="rail" label="Sezioni" expanded></bolle-navigation-rail>

<script type="module">
  const rail = document.querySelector("#rail");
  rail.items = [
    { id: "commesse", label: "Commesse" },
    { id: "clienti", label: "Clienti" },
    { id: "scadenze", label: "Scadenze" },
  ];
  rail.value = "clienti";
</script>`,
        vue: `<template>
  <bolle-navigation-rail
    label="Sezioni"
    expanded
    :items="sezioni"
    :value="sezione"
    @change="sezione = $event.detail.value"
  ></bolle-navigation-rail>
</template>`,
        react: `export function BarraStretta({ sezioni, sezione, onChange }) {
  return (
    <bolle-navigation-rail
      label="Sezioni"
      expanded
      items={sezioni}
      value={sezione}
      onChange={onChange}
    />
  );
}`,
      },
    },
  ],
  "bolle-navigation-drawer": [
    {
      title: "Pannello di navigazione",
      description:
        "Il pannello apre le voci in verticale e può stare in linea accanto al contenuto o sovrapposto alla pagina: placement start o end sceglie il lato, modal lo rende bloccante.",
      code: {
        html: `<bolle-navigation-drawer id="drawer" label="Sezioni" open>
  <h2 slot="heading">Commesse</h2>
  <span slot="actions">Versione 0.3.3</span>
</bolle-navigation-drawer>

<script type="module">
  const drawer = document.querySelector("#drawer");
  drawer.items = [
    { id: "elenco", label: "Elenco" },
    { id: "clienti", label: "Clienti" },
  ];
  drawer.value = "elenco";
</script>`,
        vue: `<template>
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
</template>`,
        react: `export function Pannello({ sezioni, sezione, onChange }) {
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
}`,
      },
    },
  ],
  "bolle-date-picker": [
    {
      title: "Scelta di una data",
      description:
        "Il selettore apre il calendario dal campo: il valore scelto arriva con change nel formato ISO, e locale decide lingua e nomi dei giorni. selection-mode range aggiunge la seconda data in end-value.",
      code: {
        html: `<bolle-date-picker id="scadenza" label="Scadenza"></bolle-date-picker>

<script type="module">
  const scadenza = document.querySelector("#scadenza");
  scadenza.addEventListener("change", (event) => {
    console.log("Data scelta:", event.detail.value);
  });
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";

const scadenza = ref("");
</script>

<template>
  <bolle-date-picker
    label="Scadenza"
    :value="scadenza"
    @change="scadenza = $event.detail.value"
  ></bolle-date-picker>
</template>`,
        react: `export function Scadenza({ scadenza, onChange }) {
  return (
    <bolle-date-picker label="Scadenza" value={scadenza} onChange={(event) => onChange(event.detail.value)} />
  );
}`,
      },
    },
    {
      title: "Intervallo di date",
      description:
        "Con selection-mode range il calendario prende due date e le riporta in value e end-value; lo slot end-label nomina il secondo campo e week-starts-on sceglie il primo giorno della settimana.",
      code: {
        html: `<bolle-date-picker
  id="periodo"
  label="Periodo"
  selection-mode="range"
  week-starts-on="1"
>
  <span slot="end-label">Fine periodo</span>
</bolle-date-picker>

<script type="module">
  document.querySelector("#periodo").addEventListener("change", (event) => {
    console.log("Dal", event.detail.value, "al", event.detail.endValue);
  });
</script>`,
        vue: `<template>
  <bolle-date-picker
    label="Periodo"
    selection-mode="range"
    week-starts-on="1"
    :value="dal"
    :end-value="al"
    @change="dal = $event.detail.value; al = $event.detail.endValue"
  >
    <span slot="end-label">Fine periodo</span>
  </bolle-date-picker>
</template>`,
        react: `export function Periodo({ dal, al, onChange }) {
  return (
    <bolle-date-picker
      label="Periodo"
      selection-mode="range"
      week-starts-on={1}
      value={dal}
      end-value={al}
      onChange={(event) => onChange(event.detail.value, event.detail.endValue)}
    >
      <span slot="end-label">Fine periodo</span>
    </bolle-date-picker>
  );
}`,
      },
    },
  ],
  "bolle-time-picker": [
    {
      title: "Scelta di un orario",
      description:
        "Il selettore apre il quadrante dell'ora dal campo: il valore scelto arriva con change, hour-cycle decide il formato a dodici o ventiquattro ore e lo slot title nomina il quadrante.",
      code: {
        html: `<bolle-time-picker id="consegna" label="Consegna" hour-cycle="24">
  <span slot="title">Orario di consegna</span>
</bolle-time-picker>

<script type="module">
  document.querySelector("#consegna").addEventListener("change", (event) => {
    console.log("Orario scelto:", event.detail.value);
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `export function Consegna({ consegna, onChange }) {
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
}`,
      },
    },
  ],
  "bolle-badge": [
    {
      title: "Segnalazione su un elemento",
      description:
        "Il badge mostra value sopra l'elemento che lo contiene e comprime il numero oltre max in «999+». small toglie il testo e lascia il punto, per una segnalazione senza numero.",
      code: {
        html: `<bolle-badge value="12">
  <bolle-icon-button label="Messaggi">
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-icon-button>
</bolle-badge>

<bolle-badge value="1200" max="99">
  <bolle-avatar name="Giulia Ferraro"></bolle-avatar>
</bolle-badge>`,
        vue: `<template>
  <bolle-badge value="12">
    <bolle-icon-button label="Messaggi">
      <span slot="icon" aria-hidden="true">★</span>
    </bolle-icon-button>
  </bolle-badge>

  <bolle-badge value="1200" :max="99">
    <bolle-avatar name="Giulia Ferraro"></bolle-avatar>
  </bolle-badge>
</template>`,
        react: `export function Segnalazioni() {
  return (
    <>
      <bolle-badge value="12">
        <bolle-icon-button label="Messaggi">
          <span slot="icon" aria-hidden="true">★</span>
        </bolle-icon-button>
      </bolle-badge>
      <bolle-badge value="1200" max={99}>
        <bolle-avatar name="Giulia Ferraro" />
      </bolle-badge>
    </>
  );
}`,
      },
    },
  ],
  "bolle-card": [
    {
      title: "Scheda con immagine e comandi",
      description:
        "La scheda prende dallo slot predefinito il contenuto, da media l'immagine di testa che occupa la larghezza e da actions la riga di comandi. href rende l'intera scheda un collegamento.",
      code: {
        html: `<bolle-card variant="filled">
  <img slot="media" alt="" src="/cantiere.jpg" />
  <h3>Ristrutturazione scuola</h3>
  <p>Consegna prevista a marzo 2027.</p>
  <bolle-button slot="actions" variant="text">Apri</bolle-button>
</bolle-card>`,
        vue: `<template>
  <bolle-card variant="filled">
    <img slot="media" alt="" src="/cantiere.jpg" />
    <h3>Ristrutturazione scuola</h3>
    <p>Consegna prevista a marzo 2027.</p>
    <bolle-button slot="actions" variant="text">Apri</bolle-button>
  </bolle-card>
</template>`,
        react: `export function Scheda() {
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
}`,
      },
    },
    {
      title: "Scheda orizzontale come collegamento",
      description:
        "orientation horizontal mette immagine e testo affiancati, href rende la scheda un collegamento e tail dice da dove arriva: la coda punta al contenuto che la precede.",
      code: {
        html: `<bolle-card orientation="horizontal" href="#/commesse/c2026-1000" tail="start">
  <img slot="media" alt="" src="/cantiere.jpg" />
  <h3>C2026-1000</h3>
  <span slot="supporting">Ristrutturazione scuola · Seriate</span>
</bolle-card>`,
        vue: `<template>
  <bolle-card orientation="horizontal" href="#/commesse/c2026-1000" tail="start">
    <img slot="media" alt="" src="/cantiere.jpg" />
    <h3>C2026-1000</h3>
    <span slot="supporting">Ristrutturazione scuola · Seriate</span>
  </bolle-card>
</template>`,
        react: `export function SchedaCollegamento() {
  return (
    <bolle-card orientation="horizontal" href="#/commesse/c2026-1000" tail="start">
      <img slot="media" alt="" src="/cantiere.jpg" />
      <h3>C2026-1000</h3>
      <span slot="supporting">Ristrutturazione scuola · Seriate</span>
    </bolle-card>
  );
}`,
      },
    },
  ],
  "bolle-list": [
    {
      title: "Elenco con icone e dettaglio",
      description:
        "L'elenco prende le righe dallo slot predefinito e le compone con icona, testo, supporto e coda; interactive abilita il clic e selection riporta la scelta con change.",
      code: {
        html: `<bolle-list label="Commesse" interactive selection="single">
  <bolle-list-item>
    <span slot="leading" aria-hidden="true">★</span>
    C2026-1000
    <span slot="supporting">Ristrutturazione scuola</span>
    <span slot="trailing">12</span>
  </bolle-list-item>
  <bolle-list-item>C2026-1001</bolle-list-item>
</bolle-list>

<script type="module">
  document.querySelector("bolle-list").addEventListener("change", (event) => {
    console.log("Voce scelta:", event.detail.value);
  });
</script>`,
        vue: `<template>
  <bolle-list label="Commesse" interactive selection="single" @change="scelta = $event.detail.value">
    <bolle-list-item>
      <span slot="leading" aria-hidden="true">★</span>
      C2026-1000
      <span slot="supporting">Ristrutturazione scuola</span>
      <span slot="trailing">12</span>
    </bolle-list-item>
    <bolle-list-item>C2026-1001</bolle-list-item>
  </bolle-list>
</template>`,
        react: `export function Elenco({ onScelta }) {
  return (
    <bolle-list label="Commesse" interactive selection="single" onChange={onScelta}>
      <bolle-list-item>
        <span slot="leading" aria-hidden="true">★</span>
        C2026-1000
        <span slot="supporting">Ristrutturazione scuola</span>
        <span slot="trailing">12</span>
      </bolle-list-item>
      <bolle-list-item>C2026-1001</bolle-list-item>
    </bolle-list>
  );
}`,
      },
    },
    {
      title: "Elenco da un array",
      description:
        "items dichiara le righe senza scrivere markup: ogni voce porta testo, supporto, icona, contatore e figli per il sottoelenco. itemRenderer sostituisce l'intera riga quando serve un contenuto tuo.",
      code: {
        html: `<bolle-list id="elenco" label="Commesse"></bolle-list>

<script type="module">
  const elenco = document.querySelector("#elenco");

  elenco.items = [
    { id: "c-1", label: "C2026-1000", supporting: "Ristrutturazione scuola", count: 12 },
    { id: "c-2", label: "C2026-1001", supporting: "Palestra comunale" },
  ];

  elenco.itemRenderer = (item) => {
    const row = document.createElement("strong");
    row.textContent = item.label;
    return row;
  };
  elenco.contentStyles = "strong { color: var(--md-sys-color-primary); }";
</script>`,
        vue: `<script setup lang="ts">
import { h } from "vue";

const items = [
  { id: "c-1", label: "C2026-1000", supporting: "Ristrutturazione scuola", count: 12 },
  { id: "c-2", label: "C2026-1001", supporting: "Palestra comunale" },
];

const itemRenderer = (item) => h("strong", item.label);
const contentStyles = "strong { color: var(--md-sys-color-primary); }";
</script>

<template>
  <bolle-list
    label="Commesse"
    :items="items"
    :itemRenderer="itemRenderer"
    :contentStyles="contentStyles"
  ></bolle-list>
</template>`,
        react: `import { useEffect, useRef } from "react";

const items = [
  { id: "c-1", label: "C2026-1000", supporting: "Ristrutturazione scuola", count: 12 },
  { id: "c-2", label: "C2026-1001", supporting: "Palestra comunale" },
];

export function Elenco() {
  const ref = useRef(null);

  useEffect(() => {
    const elenco = ref.current;
    if (!elenco) return;
    elenco.items = items;
  }, []);

  return <bolle-list ref={ref} label="Commesse" />;
}`,
      },
    },
  ],
  "bolle-carousel": [
    {
      title: "Carosello di schede",
      description:
        "Il carosello scorre gli elementi dello slot predefinito e mostra i comandi avanti e indietro: index dice quale è visibile e la scelta arriva con change. Lo scorrimento è a passi, con il tocco e la tastiera.",
      code: {
        html: `<bolle-carousel id="schede" label="Schede">
  <bolle-card>Prima scheda</bolle-card>
  <bolle-card>Seconda scheda</bolle-card>
  <bolle-card>Terza scheda</bolle-card>
</bolle-carousel>

<script type="module">
  document.querySelector("#schede").addEventListener("change", (event) => {
    console.log("Scheda visibile:", event.detail.index);
  });
</script>`,
        vue: `<template>
  <bolle-carousel label="Schede" @change="indice = $event.detail.index">
    <bolle-card>Prima scheda</bolle-card>
    <bolle-card>Seconda scheda</bolle-card>
    <bolle-card>Terza scheda</bolle-card>
  </bolle-carousel>
</template>`,
        react: `export function Schede() {
  return (
    <bolle-carousel label="Schede">
      <bolle-card>Prima scheda</bolle-card>
      <bolle-card>Seconda scheda</bolle-card>
      <bolle-card>Terza scheda</bolle-card>
    </bolle-carousel>
  );
}`,
      },
    },
  ],
  "bolle-progress-indicator": [
    {
      title: "Avanzamento lineare e circolare",
      description:
        "value dice quanto è stato fatto rispetto a max, label è il nome letto dai lettori di schermo. variant circular passa all'anello, indeterminate segnala un'attesa senza valore.",
      code: {
        html: `<bolle-progress-indicator value="62" label="Avanzamento cantieri"></bolle-progress-indicator>
<bolle-progress-indicator value="30" variant="circular" label="Avanzamento"></bolle-progress-indicator>
<bolle-progress-indicator indeterminate label="Caricamento"></bolle-progress-indicator>`,
        vue: `<template>
  <bolle-progress-indicator :value="62" label="Avanzamento cantieri" />
  <bolle-progress-indicator :value="30" variant="circular" label="Avanzamento" />
  <bolle-progress-indicator indeterminate label="Caricamento" />
</template>`,
        react: `export function Avanzamenti() {
  return (
    <>
      <bolle-progress-indicator value={62} label="Avanzamento cantieri" />
      <bolle-progress-indicator value={30} variant="circular" label="Avanzamento" />
      <bolle-progress-indicator indeterminate label="Caricamento" />
    </>
  );
}`,
      },
    },
  ],
  "bolle-loading-indicator": [
    {
      title: "Indicatore di caricamento",
      description:
        "L'indicatore mostra l'attesa di un'operazione: label è il nome letto dai lettori di schermo e va sempre dichiarata. variant contained lo appoggia su una superficie quando copre un riquadro.",
      code: {
        html: `<bolle-loading-indicator label="Caricamento delle commesse"></bolle-loading-indicator>
<bolle-loading-indicator variant="contained" label="Aggiornamento"></bolle-loading-indicator>`,
        vue: `<template>
  <bolle-loading-indicator label="Caricamento delle commesse" />
  <bolle-loading-indicator variant="contained" label="Aggiornamento" />
</template>`,
        react: `export function Attese() {
  return (
    <>
      <bolle-loading-indicator label="Caricamento delle commesse" />
      <bolle-loading-indicator variant="contained" label="Aggiornamento" />
    </>
  );
}`,
      },
    },
  ],
  "bolle-divider": [
    {
      title: "Separatore fra gruppi",
      description:
        "Il separatore non ha contenuto: divide due gruppi di elementi, con inset per staccarlo dai bordi e vertical per separare comandi affiancati.",
      code: {
        html: `<p>Committenti</p>
<bolle-divider inset></bolle-divider>
<p>Fornitori</p>

<span>Esporta</span>
<bolle-divider vertical></bolle-divider>
<span>Archivia</span>`,
        vue: `<template>
  <p>Committenti</p>
  <bolle-divider inset></bolle-divider>
  <p>Fornitori</p>

  <span>Esporta</span>
  <bolle-divider vertical></bolle-divider>
  <span>Archivia</span>
</template>`,
        react: `export function Separatori() {
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
}`,
      },
    },
  ],
  "bolle-tabs": [
    {
      title: "Schede con pannelli",
      description:
        "items dichiara le schede e value quella attiva: il componente applica la scelta da sé e la riporta con change. Ogni pannello dichiara con slot l'identificatore della scheda che lo apre.",
      code: {
        html: `<bolle-tabs id="dettaglio" label="Dettaglio" value="note">
  <div slot="note">Note della commessa</div>
  <div slot="documenti">Documenti allegati</div>
</bolle-tabs>

<script type="module">
  const dettaglio = document.querySelector("#dettaglio");
  dettaglio.items = [
    { id: "note", label: "Note" },
    { id: "documenti", label: "Documenti", count: 3 },
  ];
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";

const scheda = ref("note");
const schede = [
  { id: "note", label: "Note" },
  { id: "documenti", label: "Documenti", count: 3 },
];
</script>

<template>
  <bolle-tabs label="Dettaglio" :items="schede" :value="scheda" @change="scheda = $event.detail.value">
    <div slot="note">Note della commessa</div>
    <div slot="documenti">Documenti allegati</div>
  </bolle-tabs>
</template>`,
        react: `export function Dettaglio({ scheda, schede, onScheda }) {
  return (
    <bolle-tabs label="Dettaglio" items={schede} value={scheda} onChange={onScheda}>
      <div slot="note">Note della commessa</div>
      <div slot="documenti">Documenti allegati</div>
    </bolle-tabs>
  );
}`,
      },
    },
    {
      title: "Schede che scorrono",
      description:
        "Con scrollable le schede in eccesso scorrono in orizzontale invece di comprimersi: è la forma per un numero variabile di schede, quando i nomi sono lunghi.",
      code: {
        html: `<bolle-tabs id="schede" label="Sezioni" scrollable></bolle-tabs>

<script type="module">
  const schede = document.querySelector("#schede");
  schede.items = [
    { id: "note", label: "Note" },
    { id: "documenti", label: "Documenti" },
    { id: "scadenze", label: "Scadenze" },
    { id: "pagamenti", label: "Pagamenti" },
    { id: "collaudo", label: "Collaudo" },
  ];
</script>`,
        vue: `<template>
  <bolle-tabs label="Sezioni" scrollable :items="schede"></bolle-tabs>
</template>`,
        react: `export function Sezioni({ schede }) {
  return <bolle-tabs label="Sezioni" scrollable items={schede} />;
}`,
      },
    },
  ],
  "bolle-sidebar": [
    {
      title: "Albero di navigazione",
      description:
        "items dichiara le voci e i loro figli: il componente costruisce l'albero fino a tre livelli, apre il ramo della voce scelta e riporta il percorso con navigate. La voce corrente si imposta con current, il percorso delle voci separate da barra.",
      code: {
        html: `<bolle-sidebar id="nav" label="Navigazione" style="block-size: 520px"></bolle-sidebar>

<script type="module">
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
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useEffect, useRef } from "react";
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
}`,
      },
    },
    {
      title: "Ricerca, contatori e rail compatta",
      description:
        "Con search la sidebar mette sopra le voci il campo che le filtra; count mostra il contatore di una voce e collapsed riduce tutta la navigazione a icona, con il testo nel suggerimento.",
      code: {
        html: `<bolle-sidebar
  id="nav"
  label="Navigazione"
  search="field"
  collapsed
  style="block-size: 520px"
></bolle-sidebar>

<script type="module">
  const nav = document.querySelector("#nav");

  nav.items = [
    { id: "commesse", label: "Commesse", count: 12 },
    { id: "clienti", label: "Clienti", count: 4 },
  ];

  // Il pulsante che riduce la barra vive nell'applicazione.
  document.querySelector("#riduci").addEventListener("click", () => {
    nav.collapsed = !nav.collapsed;
  });
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";

// items: come nella ricetta "Albero di navigazione".
const collapsed = ref(false);
</script>

<template>
  <bolle-sidebar
    label="Navigazione"
    search="field"
    style="block-size: 520px"
    :items="items"
    :collapsed="collapsed"
  ></bolle-sidebar>

  <bolle-button variant="text" @click="collapsed = !collapsed">
    {{ collapsed ? "Espandi" : "Riduci" }}
  </bolle-button>
</template>`,
        react: `import { useEffect, useRef, useState } from "react";
import type { BolleSidebar } from "@bolle/web-components";

export function Navigation({ items }) {
  const ref = useRef<BolleSidebar>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    nav.items = items;
    nav.search = "field";
    nav.collapsed = collapsed;
  }, [items, collapsed]);

  return (
    <>
      <bolle-sidebar ref={ref} label="Navigazione" style={{ blockSize: "520px" }} />
      <button onClick={() => setCollapsed((value) => !value)}>
        {collapsed ? "Espandi" : "Riduci"}
      </button>
    </>
  );
}`,
      },
    },
    {
      title: "Contenuto di una voce",
      description:
        "La voce non si compone con uno slot: il componente chiama item per ogni voce dell'albero e railItem quando la barra è ridotta, così il contenuto si dichiara una volta sola. Le regole CSS del markup si passano in contentStyles.",
      code: {
        html: `<bolle-sidebar id="nav" label="Navigazione" style="block-size: 520px"></bolle-sidebar>

<script type="module">
  const nav = document.querySelector("#nav");

  nav.item = (entry) => {
    const row = document.createElement("span");
    row.className = "voce";
    row.textContent = entry.label;
    if (entry.count) row.dataset.count = String(entry.count);
    return row;
  };

  nav.items = [{ id: "commesse", label: "Commesse", count: 12 }];
</script>`,
        vue: `<script setup lang="ts">
import { h } from "vue";
import type { SidebarItem } from "@bolle/web-components";

// items: come nella ricetta "Albero di navigazione".
const item = (entry: SidebarItem) =>
  h("span", { class: "voce", "data-count": entry.count }, entry.label);

const contentStyles = ".voce { font-weight: 600; }";
</script>

<template>
  <bolle-sidebar
    label="Navigazione"
    style="block-size: 520px"
    :items="items"
    :item="item"
    :contentStyles="contentStyles"
  ></bolle-sidebar>
</template>`,
        react: `import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

const mount = (element) => {
  const host = document.createElement("span");
  createRoot(host).render(element);
  return host;
};

const item = (entry) => mount(<span className="voce">{entry.label}</span>);

export function Navigation({ items }) {
  const ref = useRef(null);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    nav.items = items;
    nav.item = item;
    nav.contentStyles = ".voce { font-weight: 600; }";
  }, [items]);

  return <bolle-sidebar ref={ref} label="Navigazione" style={{ blockSize: "520px" }} />;
}`,
      },
    },
  ],
  "bolle-app-shell": [
    {
      title: "Impalcatura completa",
      description:
        "L'impalcatura mette insieme le superfici intorno al contenuto: la navigazione, la barra, quella inferiore e il pannello di supporto arrivano dagli slot e il contenuto principale è lo slot predefinito. Le aree che non ricevono nulla non occupano spazio.",
      code: {
        html: `<bolle-app-shell style="block-size: 100dvh">
  <bolle-navigation-drawer slot="navigation" label="Sezioni">
    <a href="#/commesse">Commesse</a>
    <a href="#/clienti">Clienti</a>
  </bolle-navigation-drawer>
  <bolle-app-bar slot="bar" title="Commesse"></bolle-app-bar>
  <main>Contenuto della pagina</main>
  <bolle-bottom-app-bar slot="bottom-bar"></bolle-bottom-app-bar>
</bolle-app-shell>`,
        vue: `<template>
  <bolle-app-shell style="block-size: 100dvh">
    <bolle-navigation-drawer slot="navigation" label="Sezioni">
      <a href="#/commesse">Commesse</a>
      <a href="#/clienti">Clienti</a>
    </bolle-navigation-drawer>
    <bolle-app-bar slot="bar" title="Commesse"></bolle-app-bar>
    <main>Contenuto della pagina</main>
    <bolle-bottom-app-bar slot="bottom-bar"></bolle-bottom-app-bar>
  </bolle-app-shell>
</template>`,
        react: `export function Shell({ children }) {
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
}`,
      },
    },
    {
      title: "Pannello di supporto",
      description:
        "supporting-mode decide dove vive il contenuto dello slot supporting: inline accanto al contenuto, modal sopra la pagina, sheet in un foglio laterale. Il componente sceglie la forma adatta alla larghezza e riporta il cambio con form-change.",
      code: {
        html: `<bolle-app-shell supporting-mode="sheet" style="block-size: 100dvh">
  <bolle-navigation-drawer slot="navigation" label="Sezioni"></bolle-navigation-drawer>
  <main>Contenuto della pagina</main>
  <aside slot="supporting">
    <h2 slot="supporting-header">Dettaglio commessa</h2>
    <p>C2026-1000 · Seriate</p>
  </aside>
</bolle-app-shell>

<script type="module">
  const shell = document.querySelector("bolle-app-shell");
  shell.addEventListener("form-change", (event) => {
    console.log("Forma scelta:", event.detail.form);
  });
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";
import type { AppShellFormDetail } from "@bolle/web-components";

const form = ref("");

const onFormChange = (event: CustomEvent<AppShellFormDetail>) => {
  form.value = event.detail.form;
};
</script>

<template>
  <bolle-app-shell
    supporting-mode="sheet"
    style="block-size: 100dvh"
    @form-change="onFormChange"
  >
    <bolle-navigation-drawer slot="navigation" label="Sezioni"></bolle-navigation-drawer>
    <main>Contenuto della pagina</main>
    <aside slot="supporting">
      <h2 slot="supporting-header">Dettaglio commessa</h2>
      <p>C2026-1000 · Seriate</p>
    </aside>
  </bolle-app-shell>
</template>`,
        react: `import { useEffect, useRef, useState } from "react";

export function Shell({ children, detail }) {
  const ref = useRef(null);
  const [form, setForm] = useState("");

  useEffect(() => {
    const shell = ref.current;
    if (!shell) return;
    const onChange = (event) => setForm(event.detail.form);
    shell.addEventListener("form-change", onChange);
    return () => shell.removeEventListener("form-change", onChange);
  }, []);

  return (
    <bolle-app-shell
      ref={ref}
      supporting-mode="sheet"
      style={{ blockSize: "100dvh" }}
    >
      <bolle-navigation-drawer slot="navigation" label="Sezioni" />
      <main>{children}</main>
      <aside slot="supporting">{detail}</aside>
    </bolle-app-shell>
  );
}`,
      },
    },
  ],
  "bolle-dashboard": [
    {
      title: "Griglia di riquadri",
      description:
        "La dashboard dispone i riquadri che riceve e non impone contenuti: ogni riquadro è un bolle-widget, e span decide quante colonne occupa mentre min-span fissa il minimo quando lo spazio si stringe.",
      code: {
        html: `<bolle-dashboard label="Panoramica" style="block-size: 640px">
  <bolle-widget title="Lavori in ritardo" span="8" min-span="4">
    <p>Quattro commesse oltre la scadenza.</p>
  </bolle-widget>
  <bolle-widget title="Avanzamento cantieri" span="4" min-span="3">
    <bolle-progress-indicator value="62" label="Avanzamento"></bolle-progress-indicator>
  </bolle-widget>
</bolle-dashboard>`,
        vue: `<template>
  <bolle-dashboard label="Panoramica" style="block-size: 640px">
    <bolle-widget title="Lavori in ritardo" span="8" min-span="4">
      <p>Quattro commesse oltre la scadenza.</p>
    </bolle-widget>
    <bolle-widget title="Avanzamento cantieri" span="4" min-span="3">
      <bolle-progress-indicator value="62" label="Avanzamento" />
    </bolle-widget>
  </bolle-dashboard>
</template>`,
        react: `export function Overview() {
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
}`,
      },
    },
    {
      title: "Riquadri spostabili e ridimensionabili",
      description:
        "movable, resizable e removable rendono il riquadro regolabile dal lettore: la maniglia in alto avvia lo spostamento, quella in basso a destra il ridimensionamento, e il menu offre la chiusura. La dashboard applica il risultato e lo riporta con tile-move, tile-resize e tile-remove.",
      code: {
        html: `<bolle-dashboard label="Panoramica" style="block-size: 640px">
  <bolle-widget
    id="ritardi"
    title="Lavori in ritardo"
    span="8"
    movable
    resizable
    removable
  >
    <p>Quattro commesse oltre la scadenza.</p>
  </bolle-widget>
</bolle-dashboard>

<script type="module">
  const dashboard = document.querySelector("bolle-dashboard");

  dashboard.addEventListener("tile-move", (event) => {
    console.log("Riquadro spostato:", event.detail.id, "→", event.detail.index);
  });
</script>`,
        vue: `<script setup lang="ts">
const onTileMove = (event: CustomEvent<{ id: string; index: number }>) => {
  console.log("Riquadro spostato:", event.detail.id, "→", event.detail.index);
};
</script>

<template>
  <bolle-dashboard label="Panoramica" style="block-size: 640px" @tile-move="onTileMove">
    <bolle-widget title="Lavori in ritardo" span="8" movable resizable removable>
      <p>Quattro commesse oltre la scadenza.</p>
    </bolle-widget>
  </bolle-dashboard>
</template>`,
        react: `import { useEffect, useRef } from "react";

export function Overview() {
  const ref = useRef(null);

  useEffect(() => {
    const dashboard = ref.current;
    if (!dashboard) return;
    const onMove = (event) => console.log("Riquadro spostato:", event.detail.id);
    dashboard.addEventListener("tile-move", onMove);
    return () => dashboard.removeEventListener("tile-move", onMove);
  }, []);

  return (
    <bolle-dashboard ref={ref} label="Panoramica" style={{ blockSize: "640px" }}>
      <bolle-widget title="Lavori in ritardo" span={8} movable resizable removable>
        <p>Quattro commesse oltre la scadenza.</p>
      </bolle-widget>
    </bolle-dashboard>
  );
}`,
      },
    },
  ],
  "bolle-kanban": [
    {
      title: "Board minima",
      description:
        "columns dichiara le colonne e cards le schede, ciascuna con la colonna in cui si trova. Con movable il lettore trascina la scheda o la sposta con Alt e le frecce: la board applica lo spostamento e lo riporta con card-move.",
      code: {
        html: `<bolle-kanban id="board" label="Cantieri" movable style="block-size: 520px"></bolle-kanban>

<script type="module">
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
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useEffect, useRef } from "react";

export function Board({ columns, cards }) {
  const ref = useRef(null);

  useEffect(() => {
    const board = ref.current;
    if (!board) return;
    board.columns = columns;
    board.cards = cards;
    board.movable = true;
  }, [columns, cards]);

  return <bolle-kanban ref={ref} label="Cantieri" style={{ blockSize: "520px" }} />;
}`,
      },
    },
    {
      title: "Regola di spostamento e limiti",
      description:
        "restrict decide dove può andare una scheda e restituisce il motivo del rifiuto, che arriva con card-move-blocked. wip sulla colonna è un limite consigliato: la board lo segnala senza impedire lo spostamento.",
      code: {
        html: `<bolle-kanban id="board" label="Cantieri" movable style="block-size: 520px"></bolle-kanban>

<script type="module">
  const board = document.querySelector("#board");

  board.columns = [
    { id: "da-fare", label: "Da fare" },
    { id: "in-corso", label: "In corso", wip: 3 },
    { id: "fatto", label: "Fatto" },
  ];

  // Nessuna scheda torna indietro di colonna.
  board.restrict = (card, column) =>
    column.id === "da-fare" && board.cards.find((item) => item.id === card.id)?.column === "fatto"
      ? "Una scheda chiusa non torna da fare."
      : undefined;

  board.addEventListener("card-move-blocked", (event) => {
    console.warn(event.detail.reason);
  });
</script>`,
        vue: `<script setup lang="ts">
import type { KanbanCard, KanbanColumn } from "@bolle/web-components";

// columns e cards: come nella ricetta "Board minima".
const carte = ref<KanbanCard[]>([]);

const restrict = (card: KanbanCard, column: KanbanColumn) =>
  column.id === "da-fare" && carte.value.find((item) => item.id === card.id)?.column === "fatto"
    ? "Una scheda chiusa non torna da fare."
    : undefined;
</script>

<template>
  <bolle-kanban
    label="Cantieri"
    movable
    style="block-size: 520px"
    :columns="columns"
    :cards="carte"
    :restrict="restrict"
  ></bolle-kanban>
</template>`,
        react: `import { useEffect, useRef } from "react";

export function Board({ columns, cards }) {
  const ref = useRef(null);

  useEffect(() => {
    const board = ref.current;
    if (!board) return;
    board.columns = columns;
    board.cards = cards;
    board.movable = true;
    board.restrict = (card, column) =>
      column.id === "da-fare" &&
      cards.find((item) => item.id === card.id)?.column === "fatto"
        ? "Una scheda chiusa non torna da fare."
        : undefined;
  }, [columns, cards]);

  return <bolle-kanban ref={ref} label="Cantieri" style={{ blockSize: "520px" }} />;
}`,
      },
    },
    {
      title: "Contenuto della scheda",
      description:
        "La scheda non si compone con uno slot: il componente chiama card per ogni scheda e riceve la scheda e la board. laneLabel dà un nome alle corsie, che altrimenti mostrano la chiave.",
      code: {
        html: `<bolle-kanban id="board" label="Cantieri" lanes style="block-size: 520px"></bolle-kanban>

<script type="module">
  const board = document.querySelector("#board");

  board.card = (item) => {
    const box = document.createElement("div");
    box.className = "scheda";
    box.innerHTML = "<strong>" + item.title + "</strong>";
    return box;
  };

  board.contentStyles = ".scheda { display: grid; gap: 4px; }";
  board.laneLabel = (lane) => (lane === "urgente" ? "Urgente" : "Ordinaria");
</script>`,
        vue: `<script setup lang="ts">
import { h } from "vue";
import type { KanbanCard } from "@bolle/web-components";

const card = (item: KanbanCard) =>
  h("div", { class: "scheda" }, h("strong", item.title));

const laneLabel = (lane: string) => (lane === "urgente" ? "Urgente" : "Ordinaria");
const contentStyles = ".scheda { display: grid; gap: 4px; }";
</script>

<template>
  <bolle-kanban
    label="Cantieri"
    lanes
    style="block-size: 520px"
    :columns="columns"
    :cards="cards"
    :card="card"
    :laneLabel="laneLabel"
    :contentStyles="contentStyles"
  ></bolle-kanban>
</template>`,
        react: `import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

const mount = (element) => {
  const host = document.createElement("div");
  createRoot(host).render(element);
  return host;
};

export function Board({ columns, cards }) {
  const ref = useRef(null);

  useEffect(() => {
    const board = ref.current;
    if (!board) return;
    board.columns = columns;
    board.cards = cards;
    board.lanes = true;
    board.card = (item) => mount(<strong>{item.title}</strong>);
  }, [columns, cards]);

  return <bolle-kanban ref={ref} label="Cantieri" style={{ blockSize: "520px" }} />;
}`,
      },
    },
  ],
  "bolle-gantt": [
    {
      title: "Piano minimo",
      description:
        "Il piano disegna le attività sull'asse del tempo: parent costruisce l'albero e una attività con figli diventa una barra di riepilogo. L'altezza del host è obbligatoria, perché la superficie riempie lo spazio che riceve.",
      code: {
        html: `<bolle-gantt
  id="plan"
  label="Piano di commessa"
  style="block-size: 420px"
></bolle-gantt>

<script type="module">
  const plan = document.querySelector("#plan");

  plan.tasks = [
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
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useEffect, useRef } from "react";
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
}`,
      },
    },
    {
      title: "Colonne e contenuto delle celle",
      description:
        "columns sceglie le colonne della griglia: le chiavi note (code, name, resource, start, end, duration, progress, deps) hanno già il loro contenuto, una chiave nuova prende render e riceve l'attività. Le regole CSS del markup passano da contentStyles, perché gira dentro lo shadow root del piano.",
      code: {
        html: `<bolle-gantt id="plan" label="Piano" style="block-size: 420px"></bolle-gantt>

<script type="module">
  const plan = document.querySelector("#plan");

  plan.columns = [
    { id: "name", width: 280 },
    { id: "owner", label: "Titolare", width: 140,
      render: (task) => {
        const badge = document.createElement("span");
        badge.className = "owner";
        badge.textContent = task.resource ?? "—";
        return badge;
      },
    },
  ];

  plan.contentStyles = ".owner { color: var(--md-sys-color-primary); }";
  plan.tasks = tasks;
</script>`,
        vue: `<script setup lang="ts">
import { h } from "vue";
import type { GanttColumn } from "@bolle/web-components";

// tasks: come nella ricetta "Piano minimo".
const columns: GanttColumn[] = [
  { id: "name", width: 280 },
  {
    id: "owner",
    label: "Titolare",
    width: 140,
    render: (task) =>
      h("span", { class: "owner" }, task.resource ?? "—"),
  },
];

const contentStyles = ".owner { color: var(--md-sys-color-primary); }";
</script>

<template>
  <bolle-gantt
    label="Piano"
    style="block-size: 420px"
    :columns="columns"
    :contentStyles="contentStyles"
    :tasks="tasks"
  ></bolle-gantt>
</template>`,
        react: `import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import type { BolleGantt, GanttColumn } from "@bolle/web-components";

const mount = (element) => {
  const host = document.createElement("span");
  createRoot(host).render(element);
  return host;
};

const columns: GanttColumn[] = [
  { id: "name", width: 280 },
  {
    id: "owner",
    label: "Titolare",
    width: 140,
    render: (task) =>
      mount(<span className="owner">{task.resource ?? "—"}</span>),
  },
];

export function Plan({ tasks }) {
  const ref = useRef<BolleGantt>(null);

  useEffect(() => {
    const plan = ref.current;
    if (!plan) return;
    plan.columns = columns;
    plan.contentStyles = ".owner { color: var(--md-sys-color-primary); }";
    plan.tasks = tasks;
  }, [tasks]);

  return <bolle-gantt ref={ref} label="Piano" style={{ blockSize: "420px" }} />;
}`,
      },
    },
    {
      title: "Spostare e ridimensionare",
      description:
        "editable abilita il trascinamento, le maniglie ai lati e le frecce con Alt. restrict decide se lo spostamento è ammesso e il rifiuto arriva con task-change-blocked. Il piano applica lo spostamento da sé e lo riporta con task-change: qui lo si conserva.",
      code: {
        html: `<bolle-gantt
  id="plan"
  label="Piano"
  editable
  style="block-size: 420px"
></bolle-gantt>

<script type="module">
  const plan = document.querySelector("#plan");

  // Nessuno spostamento nel passato.
  plan.restrict = ({ start }) =>
    start < "2026-09-01" ? "Non si sposta un'attività prima del 1 settembre 2026." : undefined;

  plan.addEventListener("task-change", async (event) => {
    const { task, start, end } = event.detail;
    await fetch("/api/attivita/" + task.id, {
      method: "PATCH",
      body: JSON.stringify({ start, end }),
    });
  });

  plan.tasks = tasks;
</script>`,
        vue: `<script setup lang="ts">
import type { GanttChangeRequest, GanttTaskDetail } from "@bolle/web-components";

// tasks: come nella ricetta "Piano minimo".
const restrict = ({ start }: GanttChangeRequest) =>
  start < "2026-09-01"
    ? "Non si sposta un'attività prima del 1 settembre 2026."
    : undefined;

// Il piano ha già applicato lo spostamento: qui lo si conserva.
const onTaskChange = async (event: CustomEvent<GanttTaskDetail>) => {
  const { task, start, end } = event.detail;
  await fetch(\`/api/attivita/\${task.id}\`, {
    method: "PATCH",
    body: JSON.stringify({ start, end }),
  });
};
</script>

<template>
  <bolle-gantt
    label="Piano"
    editable
    style="block-size: 420px"
    :tasks="tasks"
    :restrict="restrict"
    @task-change="onTaskChange"
  ></bolle-gantt>
</template>`,
        react: `import { useEffect, useRef } from "react";
import type { BolleGantt } from "@bolle/web-components";

export function Plan({ tasks }) {
  const ref = useRef<BolleGantt>(null);

  useEffect(() => {
    const plan = ref.current;
    if (!plan) return;
    plan.tasks = tasks;
    plan.editable = true;
    plan.restrict = ({ start }) =>
      start < "2026-09-01"
        ? "Non si sposta un'attività prima del 1 settembre 2026."
        : undefined;

    // Il piano ha già applicato lo spostamento: qui lo si conserva.
    const onTaskChange = async (event) => {
      const { task, start, end } = event.detail;
      await fetch(\`/api/attivita/\${task.id}\`, {
        method: "PATCH",
        body: JSON.stringify({ start, end }),
      });
    };

    plan.addEventListener("task-change", onTaskChange);
    return () => plan.removeEventListener("task-change", onTaskChange);
  }, [tasks]);

  return (
    <bolle-gantt ref={ref} label="Piano" editable style={{ blockSize: "420px" }} />
  );
}`,
      },
    },
    {
      title: "Contenuto della barra",
      description:
        "barRenderer sostituisce quello che la barra mostra: riceve l'attività, il piano e l'intervallo calcolato, che per una attività con figli è il riepilogo dei discendenti. Serve per badge, percentuali e icone; le regole CSS vanno in contentStyles.",
      code: {
        html: `<bolle-gantt id="plan" label="Piano" style="block-size: 420px"></bolle-gantt>

<script type="module">
  const plan = document.querySelector("#plan");

  plan.barRenderer = (task) => {
    const label = document.createElement("span");
    label.className = "bar-text";
    label.textContent = task.milestone ? "◆" : \`\${task.name} · \${task.progress ?? 0}%\`;
    return label;
  };

  plan.contentStyles = \`
    .bar-text {
      position: relative;
      padding: 0 8px;
      font: var(--md-sys-typescale-label-small-font);
      color: var(--md-sys-color-on-primary);
      white-space: nowrap;
    }\`;

  plan.tasks = tasks;
</script>`,
        vue: `<script setup lang="ts">
import { h } from "vue";

// tasks: come nella ricetta "Piano minimo".
const barRenderer = (task) =>
  h(
    "span",
    { class: "bar-text" },
    task.milestone ? "◆" : \`\${task.name} · \${task.progress ?? 0}%\`,
  );

const contentStyles = \`
  .bar-text {
    position: relative;
    padding: 0 8px;
    font: var(--md-sys-typescale-label-small-font);
    color: var(--md-sys-color-on-primary);
    white-space: nowrap;
  }\`;
</script>

<template>
  <bolle-gantt
    label="Piano"
    style="block-size: 420px"
    :tasks="tasks"
    :barRenderer="barRenderer"
    :contentStyles="contentStyles"
  ></bolle-gantt>
</template>`,
        react: `import { useEffect, useRef } from "react";
import type { BolleGantt } from "@bolle/web-components";

const barRenderer = (task) => {
  const label = document.createElement("span");
  label.className = "bar-text";
  label.textContent = task.milestone
    ? "◆"
    : \`\${task.name} · \${task.progress ?? 0}%\`;
  return label;
};

export function Plan({ tasks }) {
  const ref = useRef<BolleGantt>(null);

  useEffect(() => {
    const plan = ref.current;
    if (!plan) return;
    plan.tasks = tasks;
    plan.barRenderer = barRenderer;
    plan.contentStyles = ".bar-text { padding: 0 8px; }";
  }, [tasks]);

  return <bolle-gantt ref={ref} label="Piano" style={{ blockSize: "420px" }} />;
}`,
      },
    },
    {
      title: "Stati e slot",
      description:
        "loading, error ed empty prendono il posto delle righe. Gli slot loading, error ed empty li sostituiscono con il contenuto dell'applicazione: un pulsante che ricrea il piano, un comando di ricarica o un'azione per aggiungere la prima attività.",
      code: {
        html: `<bolle-gantt
  id="plan"
  label="Piano"
  empty-label="Nessuna attività pianificata"
  style="block-size: 420px"
>
  <bolle-button slot="empty" variant="filled">Aggiungi la prima attività</bolle-button>
</bolle-gantt>

<script type="module">
  const plan = document.querySelector("#plan");

  const load = async () => {
    plan.loading = true;
    plan.error = "";
    try {
      plan.tasks = await (await fetch("/api/piano")).json();
    } catch {
      plan.error = "Il piano non è raggiungibile.";
    } finally {
      plan.loading = false;
    }
  };

  load();
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);
const error = ref("");
const tasks = ref([]);

const load = async () => {
  loading.value = true;
  error.value = "";
  try {
    tasks.value = await (await fetch("/api/piano")).json();
  } catch {
    error.value = "Il piano non è raggiungibile.";
  } finally {
    loading.value = false;
  }
};

void load();
</script>

<template>
  <bolle-gantt
    label="Piano"
    style="block-size: 420px"
    :loading="loading"
    :error="error"
    :tasks="tasks"
  >
    <bolle-button slot="empty" variant="filled" @click="load">
      Aggiungi la prima attività
    </bolle-button>
    <bolle-button slot="error" variant="outlined" @click="load">Riprova</bolle-button>
  </bolle-gantt>
</template>`,
        react: `import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

// In React lo slot si crea come nodo con il nome dello slot.
const slot = (name, element) => {
  const host = document.createElement("div");
  host.slot = name;
  createRoot(host).render(element);
  return host;
};

export function Plan() {
  const ref = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const plan = ref.current;
    if (!plan) return;
    plan.tasks = tasks;
    plan.error = error;
  }, [tasks, error]);

  useEffect(() => {
    const plan = ref.current;
    if (!plan) return;
    plan.append(
      slot("empty", <button onClick={() => plan.tasks = []}>Aggiungi la prima attività</button>),
    );
  }, []);

  return <bolle-gantt ref={ref} label="Piano" style={{ blockSize: "420px" }} />;
}`,
      },
    },
  ],
  "bolle-data-table": [
    {
      title: "Slot del framework tramite wrapper",
      description:
        "Vue e React non possono passare uno slot con scope a un elemento personalizzato. Un wrapper di poche righe trasforma la slot in un renderer: la pagina scrive il template della cella una volta, il wrapper monta il contenuto per ogni riga e libera la memoria quando la cella esce dal documento.",
      code: {
        html: `<!-- In HTML non serve un wrapper: si usa la funzione renderer. -->
<script type="module">
  const table = document.querySelector("#jobs");

  table.columns = [
    { key: "code", label: "Codice", width: 140 },
    {
      key: "status",
      label: "Stato",
      width: 160,
      render: (row) => sectionFor(row.status),
    },
  ];
</script>`,
        vue: `<!-- BolleDataTable.vue -->
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
            \`\${row.id}-\${column.key}\`,
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
</template>`,
        react: `// BolleDataTable.tsx
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
            const key = \`\${row[rowKey]}-\${column.key}\`;
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
/>`,
      },
    },
    {
      title: "Registrare i componenti",
      description:
        "Il componente è un elemento personalizzato e va registrato una volta. Vue e React richiedono una dichiarazione in più perché i tag bolle-* non sono elementi noti.",
      code: {
        html: `<!-- L'import registra tutti gli elementi una volta sola. -->
<script type="module" src="/src/main.ts"></script>

<script type="module">
  import "@bolle/web-components";
</script>`,
        vue: `// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

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
});`,
        react: `// src/bolle.d.ts
import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "bolle-data-table": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        label?: string;
        "row-key"?: string;
        "page-size"?: number;
        selectable?: boolean;
        expandable?: boolean;
        virtual?: boolean;
      };
    }
  }
}`,
      },
    },
    {
      title: "Tabella minima",
      description:
        "columns dichiara le colonne, rows i dati. row-key indica il campo univoco di ogni riga. Gli array si passano come proprietà, non come attributi.",
      code: {
        html: `<bolle-data-table id="jobs" label="Commesse" row-key="id"></bolle-data-table>

<script type="module">
  import "@bolle/web-components";

  const table = document.querySelector("#jobs");

  table.columns = [
    { key: "code", label: "Codice", width: 140, pinned: true },
    { key: "client", label: "Cliente", width: 240 },
    { key: "amount", label: "Importo", width: 140, align: "end" },
  ];

  table.rows = [
    { id: "job-1", code: "C-2026-1001", client: "Comune di Bergamo", amount: 148000 },
    { id: "job-2", code: "C-2026-1002", client: "Hotel Bellavista", amount: 92000 },
  ];
</script>`,
        vue: `<script setup lang="ts">
import "@bolle/web-components";
import type { DataTableColumn, DataTableRow } from "@bolle/web-components";

const columns: DataTableColumn[] = [
  { key: "code", label: "Codice", width: 140, pinned: true },
  { key: "client", label: "Cliente", width: 240 },
  { key: "amount", label: "Importo", width: 140, align: "end" },
];

const rows: DataTableRow[] = [
  { id: "job-1", code: "C-2026-1001", client: "Comune di Bergamo", amount: 148000 },
  { id: "job-2", code: "C-2026-1002", client: "Hotel Bellavista", amount: 92000 },
];
</script>

<template>
  <bolle-data-table
    label="Commesse"
    row-key="id"
    :columns="columns"
    :rows="rows"
  ></bolle-data-table>
</template>`,
        react: `import { useEffect, useRef } from "react";
import "@bolle/web-components";
import type {
  BolleDataTable,
  DataTableColumn,
  DataTableRow,
} from "@bolle/web-components";

const columns: DataTableColumn[] = [
  { key: "code", label: "Codice", width: 140, pinned: true },
  { key: "client", label: "Cliente", width: 240 },
  { key: "amount", label: "Importo", width: 140, align: "end" },
];

const rows: DataTableRow[] = [
  { id: "job-1", code: "C-2026-1001", client: "Comune di Bergamo", amount: 148000 },
  { id: "job-2", code: "C-2026-1002", client: "Hotel Bellavista", amount: 92000 },
];

export function JobsTable() {
  const ref = useRef<BolleDataTable>(null);

  useEffect(() => {
    const table = ref.current;
    if (!table) return;
    table.columns = columns;
    table.rows = rows;
  }, []);

  return <bolle-data-table ref={ref} label="Commesse" row-key="id" />;
}`,
      },
    },
    {
      title: "Formattare i valori",
      description:
        "value trasforma il valore di una cella in testo. Serve per importi, date e numeri: la tabella continua a mostrare una sola riga di testo per cella.",
      code: {
        html: `<script type="module">
  const table = document.querySelector("#jobs");

  const euros = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  });

  const dates = new Intl.DateTimeFormat("it-IT");

  table.columns = [
    { key: "client", label: "Cliente", width: 240 },
    {
      key: "amount",
      label: "Importo",
      width: 140,
      align: "end",
      value: (row) => euros.format(row.amount),
    },
    {
      key: "due",
      label: "Consegna",
      width: 140,
      value: (row) => dates.format(new Date(row.due)),
    },
  ];
</script>`,
        vue: `<script setup lang="ts">
import type { DataTableColumn } from "@bolle/web-components";

const euros = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

const dates = new Intl.DateTimeFormat("it-IT");

const columns: DataTableColumn[] = [
  { key: "client", label: "Cliente", width: 240 },
  {
    key: "amount",
    label: "Importo",
    width: 140,
    align: "end",
    value: (row) => euros.format(Number(row.amount)),
  },
  {
    key: "due",
    label: "Consegna",
    width: 140,
    value: (row) => dates.format(new Date(String(row.due))),
  },
];
</script>`,
        react: `import type { DataTableColumn } from "@bolle/web-components";

const euros = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
});

const dates = new Intl.DateTimeFormat("it-IT");

const columns: DataTableColumn[] = [
  { key: "client", label: "Cliente", width: 240 },
  {
    key: "amount",
    label: "Importo",
    width: 140,
    align: "end",
    value: (row) => euros.format(Number(row.amount)),
  },
  {
    key: "due",
    label: "Consegna",
    width: 140,
    value: (row) => dates.format(new Date(String(row.due))),
  },
];`,
      },
    },
    {
      title: "Cella personalizzata",
      description:
        "Il componente chiama column.render per ogni cella, una volta per riga: qui si decide il contenuto e non si prepara nulla in anticipo. La funzione restituisce un nodo o una stringa; rowRenderer sostituisce invece l'intera riga.",
      code: {
        html: `<script type="module">
  const table = document.querySelector("#jobs");

  const badge = (text, isLate) => {
    const span = document.createElement("span");
    span.className = isLate ? "badge is-late" : "badge";
    span.textContent = text;
    return span;
  };

  table.columns = [
    { key: "code", label: "Codice", width: 140 },
    {
      key: "status",
      label: "Stato",
      width: 160,
      render: (row) =>
        badge(row.status, row.status === "In ritardo"),
    },
  ];
</script>`,
        vue: `<script setup lang="ts">
import { h } from "vue";
import { render as mountVue } from "vue";
import type { DataTableColumn } from "@bolle/web-components";
import StatusBadge from "./StatusBadge.vue";

// Il componente chiama render per ogni cella: qui si monta un componente Vue.
const mount = (vnode: Parameters<typeof mountVue>[0]) => {
  const host = document.createElement("span");
  mountVue(vnode, host);
  return host;
};

const columns: DataTableColumn[] = [
  { key: "code", label: "Codice", width: 140 },
  {
    key: "status",
    label: "Stato",
    width: 160,
    render: (row) => mount(h(StatusBadge, { status: row.status })),
  },
];
</script>

<template>
  <bolle-data-table label="Commesse" row-key="id" :columns="columns" :rows="rows">
  </bolle-data-table>
</template>`,
        react: `import { createRoot } from "react-dom/client";
import type { ReactElement } from "react";
import type { DataTableColumn } from "@bolle/web-components";
import { StatusBadge } from "./StatusBadge";

// Il componente chiama render per ogni cella: qui si monta un componente React.
const mount = (element: ReactElement) => {
  const host = document.createElement("span");
  createRoot(host).render(element);
  return host;
};

const columns: DataTableColumn[] = [
  { key: "code", label: "Codice", width: 140 },
  {
    key: "status",
    label: "Stato",
    width: 160,
    render: (row) => mount(<StatusBadge status={row.status} />),
  },
];

export function JobsTable() {
  return <bolle-data-table label="Commesse" row-key="id" />;
}`,
      },
    },
    {
      title: "Ordinamento",
      description:
        "Un clic sull'intestazione ordina da sola: prima crescente, poi decrescente. Con sortHandler la richiesta arriva all'applicazione, che ricarica le righe, e la tabella si ridisegna quando la promessa è risolta.",
      code: {
        html: `<bolle-data-table id="jobs" label="Commesse" row-key="id"></bolle-data-table>

<script type="module">
  const table = document.querySelector("#jobs");

  // Senza sortHandler la tabella ordina le righe che ha già.
  table.rows = await (await fetch("/api/commesse")).json();

  // Con sortHandler l'ordine richiesto arriva qui.
  table.sortHandler = async ({ sort }) => {
    const query = new URLSearchParams({ sort: JSON.stringify(sort) });
    table.rows = await (await fetch(\`/api/commesse?\${query}\`)).json();
  };
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";
import type { DataTableRow, DataTableSortDetail } from "@bolle/web-components";

// columns: come nella ricetta "Tabella minima".
const rows = ref<DataTableRow[]>(await fetchJobs());

// Senza sortHandler la tabella ordina le righe che ha già.
const sortOnServer = async ({ sort }: DataTableSortDetail) => {
  const query = new URLSearchParams({ sort: JSON.stringify(sort) });
  rows.value = await (await fetch(\`/api/commesse?\${query}\`)).json();
};
</script>

<template>
  <bolle-data-table
    label="Commesse"
    row-key="id"
    :columns="columns"
    :rows="rows"
    :sortHandler="sortOnServer"
  ></bolle-data-table>
</template>`,
        react: `import { useEffect, useRef } from "react";
import type {
  BolleDataTable,
  DataTableColumn,
  DataTableRow,
  DataTableSortDetail,
} from "@bolle/web-components";

// columns e rows: come nella ricetta "Tabella minima".
export function JobsTable({
  columns,
  rows,
}: {
  columns: DataTableColumn[];
  rows: DataTableRow[];
}) {
  const ref = useRef<BolleDataTable>(null);

  useEffect(() => {
    const table = ref.current;
    if (!table) return;
    table.columns = columns;
    table.rows = rows;
    // Senza sortHandler la tabella ordina le righe che ha già.
    table.sortHandler = async ({ sort }: DataTableSortDetail) => {
      const query = new URLSearchParams({ sort: JSON.stringify(sort) });
      table.rows = await (await fetch(\`/api/commesse?\${query}\`)).json();
    };
  }, [columns, rows]);

  return <bolle-data-table ref={ref} label="Commesse" row-key="id" />;
}`,
      },
    },
    {
      title: "Selezione delle righe",
      description:
        "selectable mostra la casella su ogni riga e nell'intestazione. La selezione la tiene la tabella: l'evento select riporta gli identificatori scelti e le righe corrispondenti, senza che l'applicazione debba riscriverli.",
      code: {
        html: `<bolle-data-table id="jobs" label="Commesse" row-key="id" selectable>
</bolle-data-table>

<script type="module">
  const table = document.querySelector("#jobs");
  table.columns = columns;
  table.rows = rows;

  // La tabella applica la scelta da sé: l'evento serve per leggerla.
  table.addEventListener("select", (event) => {
    console.log("Righe scelte:", event.detail.rows);
  });

  // L'identificatore di partenza si imposta come proprietà.
  table.selected = ["job-2"];
</script>`,
        vue: `<script setup lang="ts">
import type { DataTableSelectDetail } from "@bolle/web-components";

// columns e rows: come nella ricetta "Tabella minima".
const onSelect = (event: CustomEvent<DataTableSelectDetail>) => {
  console.log("Righe scelte:", event.detail.rows);
};
</script>

<template>
  <bolle-data-table
    label="Commesse"
    row-key="id"
    selectable
    :columns="columns"
    :rows="rows"
    @select="onSelect"
  ></bolle-data-table>
</template>`,
        react: `import { useEffect, useRef } from "react";
import type {
  BolleDataTable,
  DataTableColumn,
  DataTableRow,
  DataTableSelectDetail,
} from "@bolle/web-components";

// columns e rows: come nella ricetta "Tabella minima".
export function JobsTable({
  columns,
  rows,
}: {
  columns: DataTableColumn[];
  rows: DataTableRow[];
}) {
  const ref = useRef<BolleDataTable>(null);

  useEffect(() => {
    const table = ref.current;
    if (!table) return;

    table.columns = columns;
    table.rows = rows;
    table.selectable = true;

    // La tabella applica la scelta da sé: l'evento serve per leggerla.
    const onSelect = (event: Event) => {
      console.log(
        "Righe scelte:",
        (event as CustomEvent<DataTableSelectDetail>).detail.rows,
      );
    };

    table.addEventListener("select", onSelect);
    return () => table.removeEventListener("select", onSelect);
  }, [columns, rows]);

  return <bolle-data-table ref={ref} label="Commesse" row-key="id" />;
}`,
      },
    },
    {
      title: "Dettaglio della riga",
      description:
        "Il componente chiama detail con la riga aperta e inserisce il risultato sotto di essa. La riga si apre e si chiude da sola: expand riporta solo quali righe sono aperte.",
      code: {
        html: `<bolle-data-table id="jobs" label="Commesse" row-key="id" expandable>
</bolle-data-table>

<script type="module">
  const table = document.querySelector("#jobs");
  table.columns = columns;
  table.rows = rows;

  table.detail = (row) => {
    const list = document.createElement("dl");
    list.className = "facts";
    list.innerHTML = \`
      <dt>Cliente</dt><dd>\${row.client}</dd>
      <dt>Importo</dt><dd>\${row.amount} €</dd>
    \`;
    return list;
  };
</script>`,
        vue: `<script setup lang="ts">
import { h, render as mountVue } from "vue";
import RowFacts from "./RowFacts.vue";

const mount = (vnode: Parameters<typeof mountVue>[0]) => {
  const host = document.createElement("div");
  mountVue(vnode, host);
  return host;
};

// Una sola funzione: il componente la chiama per la riga che si apre.
const detail = (row) => mount(h(RowFacts, { row }));
</script>

<template>
  <bolle-data-table
    label="Commesse"
    row-key="id"
    expandable
    :columns="columns"
    :rows="rows"
    :detail="detail"
  >
  </bolle-data-table>
</template>`,
        react: `import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import type { ReactElement } from "react";
import type { BolleDataTable } from "@bolle/web-components";
import { RowFacts } from "./RowFacts";

const mount = (element: ReactElement) => {
  const host = document.createElement("div");
  createRoot(host).render(element);
  return host;
};

// Una sola funzione: il componente la chiama per la riga che si apre.
const detail = (row) => mount(<RowFacts row={row} />);

export function JobsTable({ columns, rows }) {
  const ref = useRef<BolleDataTable>(null);

  useEffect(() => {
    const table = ref.current;
    if (!table) return;

    table.columns = columns;
    table.rows = rows;
    table.expandable = true;
    table.detail = detail;
  }, [columns, rows]);

  return <bolle-data-table ref={ref} label="Commesse" row-key="id" />;
}`,
      },
    },
    {
      title: "Raggruppamento",
      description:
        "group-by accetta la chiave di una colonna con groupable. Il componente chiama groupSummary con le righe del gruppo, oppure groupRenderer per sostituire l'intera intestazione del gruppo.",
      code: {
        html: `<bolle-data-table
  id="jobs"
  label="Commesse"
  row-key="id"
  group-by="client"
></bolle-data-table>

<script type="module">
  const table = document.querySelector("#jobs");

  table.columns = [
    { key: "code", label: "Codice", width: 140 },
    { key: "client", label: "Cliente", width: 240, groupable: true },
  ];

  table.groupSummary = (rows) => {
    const total = rows.reduce((sum, row) => sum + Number(row.amount), 0);
    return rows.length + " commesse · " + total + " €";
  };
</script>`,
        vue: `<script setup lang="ts">
import { h, render as mountVue } from "vue";
import type { DataTableColumn, DataTableRow } from "@bolle/web-components";
import GroupTotals from "./GroupTotals.vue";

const columns: DataTableColumn[] = [
  { key: "code", label: "Codice", width: 140 },
  { key: "client", label: "Cliente", width: 240, groupable: true },
];

const mount = (vnode: Parameters<typeof mountVue>[0]) => {
  const host = document.createElement("span");
  mountVue(vnode, host);
  return host;
};

// Il componente chiama questa funzione una volta per gruppo.
const groupSummary = (rows: DataTableRow[]) =>
  mount(h(GroupTotals, { rows }));
</script>

<template>
  <bolle-data-table
    label="Commesse"
    row-key="id"
    group-by="client"
    :columns="columns"
    :rows="rows"
    :groupSummary="groupSummary"
  >
  </bolle-data-table>
</template>`,
        react: `import { createRoot } from "react-dom/client";
import type { ReactElement } from "react";
import type { DataTableColumn, DataTableRow } from "@bolle/web-components";
import { GroupTotals } from "./GroupTotals";

const columns: DataTableColumn[] = [
  { key: "code", label: "Codice", width: 140 },
  { key: "client", label: "Cliente", width: 240, groupable: true },
];

const mount = (element: ReactElement) => {
  const host = document.createElement("span");
  createRoot(host).render(element);
  return host;
};

// Il componente chiama questa funzione una volta per gruppo.
const groupSummary = (rows: DataTableRow[]) =>
  mount(<GroupTotals rows={rows} />);

export function JobsTable({ rows }: { rows: DataTableRow[] }) {
  return (
    <bolle-data-table label="Commesse" row-key="id" group-by="client" />
  );
}`,
      },
    },
    {
      title: "Paginazione",
      description:
        "Con page-size maggiore di zero la tabella pagina da sé le righe che ha già e mostra il pager. Con pageHandler la pagina richiesta arriva all'applicazione, che ricarica la fetta di righe e il totale.",
      code: {
        html: `<bolle-data-table id="jobs" label="Commesse" row-key="id" page-size="10">
</bolle-data-table>

<script type="module">
  const table = document.querySelector("#jobs");

  // Senza pageHandler la tabella taglia da sé le righe che ha già.
  table.rows = await (await fetch("/api/commesse")).json();

  // Con pageHandler la pagina richiesta arriva qui; total dice quante righe esistono.
  table.pageHandler = async ({ page, pageSize }) => {
    const query = new URLSearchParams({ page, pageSize });
    const body = await (await fetch(\`/api/commesse?\${query}\`)).json();
    table.rows = body.rows;
    table.total = body.total;
  };
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";
import type { DataTablePageDetail, DataTableRow } from "@bolle/web-components";

// columns: come nella ricetta "Tabella minima".
const rows = ref<DataTableRow[]>(await fetchJobs());
const total = ref(rows.value.length);

// Senza pageHandler la tabella pagina da sé le righe che ha già.
const loadPage = async ({ page, pageSize }: DataTablePageDetail) => {
  const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  const body = await (await fetch(\`/api/commesse?\${query}\`)).json();
  rows.value = body.rows;
  total.value = body.total;
};
</script>

<template>
  <bolle-data-table
    label="Commesse"
    row-key="id"
    page-size="10"
    :columns="columns"
    :rows="rows"
    :total="total"
    :pageHandler="loadPage"
  ></bolle-data-table>
</template>`,
        react: `import { useEffect, useRef } from "react";
import type {
  BolleDataTable,
  DataTableColumn,
  DataTablePageDetail,
  DataTableRow,
} from "@bolle/web-components";

// columns e jobs: come nella ricetta "Tabella minima".
export function JobsTable({
  columns,
  jobs,
  total,
}: {
  columns: DataTableColumn[];
  jobs: DataTableRow[];
  total: number;
}) {
  const ref = useRef<BolleDataTable>(null);

  useEffect(() => {
    const table = ref.current;
    if (!table) return;
    table.columns = columns;
    table.rows = jobs;
    table.total = total;
    // Senza pageHandler la tabella pagina da sé le righe che ha già.
    table.pageHandler = async ({ page, pageSize }: DataTablePageDetail) => {
      const query = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      const body = await (await fetch(\`/api/commesse?\${query}\`)).json();
      table.rows = body.rows;
      table.total = body.total;
    };
  }, [columns, jobs, total]);

  return (
    <bolle-data-table ref={ref} label="Commesse" row-key="id" page-size={10} />
  );
}`,
      },
    },
    {
      title: "Caricamento, errore e vuoto",
      description:
        "loading copre la tabella durante il primo caricamento, updating la attenua mantenendo le righe, error mostra il messaggio ricevuto. Le azioni dello stato vuoto si passano nello slot empty.",
      code: {
        html: `<bolle-data-table
  id="jobs"
  label="Commesse"
  row-key="id"
  loading
  empty-label="Nessuna commessa per questo filtro"
>
  <bolle-button slot="empty" variant="filled">Crea commessa</bolle-button>
</bolle-data-table>

<script type="module">
  const table = document.querySelector("#jobs");

  try {
    table.rows = await fetchJobs();
    table.error = "";
  } catch (error) {
    table.error = error.message;
  } finally {
    table.loading = false;
  }
</script>`,
        vue: `<script setup lang="ts">
import { onMounted, ref } from "vue";

const rows = ref([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    rows.value = await fetchJobs();
  } catch (cause) {
    error.value = (cause as Error).message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <bolle-data-table
    label="Commesse"
    row-key="id"
    :loading="loading"
    :error="error"
    empty-label="Nessuna commessa per questo filtro"
    :columns="columns"
    :rows="rows"
  >
    <bolle-button slot="empty" variant="filled">Crea commessa</bolle-button>
  </bolle-data-table>
</template>`,
        react: `import { useEffect, useRef, useState } from "react";
import type { BolleDataTable, DataTableRow } from "@bolle/web-components";

export function JobsTable() {
  const ref = useRef<BolleDataTable>(null);
  const [rows, setRows] = useState<DataTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchJobs()
      .then((data) => active && setRows(data))
      .catch((cause: Error) => active && setError(cause.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const table = ref.current;
    if (!table) return;
    table.loading = loading;
    table.error = error;
    table.rows = rows;
  }, [loading, error, rows]);

  return (
    <bolle-data-table
      ref={ref}
      label="Commesse"
      row-key="id"
      empty-label="Nessuna commessa per questo filtro"
    >
      <bolle-button slot="empty" variant="filled">
        Crea commessa
      </bolle-button>
    </bolle-data-table>
  );
}`,
      },
    },
    {
      title: "Colonne fisse, larghezze e visibilità",
      description:
        "pinned tiene la colonna ferma durante lo scorrimento orizzontale, width fissa la larghezza iniziale, hidden la nasconde, sortable a false toglie l'ordinamento. Fissare, nascondere, riordinare e ridimensionare lo fa la tabella: column-change riporta il nuovo elenco e columnHandler lo salva dove serve.",
      code: {
        html: `<bolle-data-table
  id="jobs"
  label="Commesse"
  row-key="id"
  default-column-width="180"
  min-column-width="88"
  max-column-width="480"
></bolle-data-table>

<script type="module">
  const table = document.querySelector("#jobs");

  table.columns = [
    { key: "code", label: "Codice", width: 140, pinned: true },
    { key: "client", label: "Cliente", width: 260 },
    { key: "notes", label: "Note", width: 320, hidden: true },
    { key: "amount", label: "Importo", width: 140, align: "end" },
    { key: "status", label: "Stato", width: 160, sortable: false },
  ];

  // La tabella applica il cambio da sé; qui lo si conserva fra due visite.
  table.columnHandler = async ({ columns }) => {
    await fetch("/api/preferenze-colonne", {
      method: "PUT",
      body: JSON.stringify(columns),
    });
  };
</script>`,
        vue: `<script setup lang="ts">
import type { DataTableColumn } from "@bolle/web-components";

const columns: DataTableColumn[] = [
  { key: "code", label: "Codice", width: 140, pinned: true },
  { key: "client", label: "Cliente", width: 260 },
  { key: "notes", label: "Note", width: 320, hidden: true },
  { key: "amount", label: "Importo", width: 140, align: "end" },
  { key: "status", label: "Stato", width: 160, sortable: false },
];
</script>

<template>
  <bolle-data-table
    label="Commesse"
    row-key="id"
    default-column-width="180"
    min-column-width="88"
    max-column-width="480"
    :columns="columns"
    :rows="rows"
  ></bolle-data-table>
</template>`,
        react: `import { useEffect, useRef } from "react";
import type {
  BolleDataTable,
  DataTableColumn,
  DataTableRow,
} from "@bolle/web-components";

const columns: DataTableColumn[] = [
  { key: "code", label: "Codice", width: 140, pinned: true },
  { key: "client", label: "Cliente", width: 260 },
  { key: "notes", label: "Note", width: 320, hidden: true },
  { key: "amount", label: "Importo", width: 140, align: "end" },
  { key: "status", label: "Stato", width: 160, sortable: false },
];

// rows: come nella ricetta "Tabella minima".
export function JobsTable({ rows }: { rows: DataTableRow[] }) {
  const ref = useRef<BolleDataTable>(null);

  useEffect(() => {
    const table = ref.current;
    if (!table) return;
    table.columns = columns;
    table.rows = rows;
  }, [rows]);

  return (
    <bolle-data-table
      ref={ref}
      label="Commesse"
      row-key="id"
      default-column-width="180"
      min-column-width="88"
      max-column-width="480"
    />
  );
}`,
      },
    },
    {
      title: "Scorrimento continuo",
      description:
        "virtual disegna solo le righe visibili. L'host deve avere un'altezza definita, altrimenti la tabella non ha un'area di scorrimento. row-height regola l'altezza stimata di ogni riga.",
      code: {
        html: `<bolle-data-table
  id="jobs"
  label="Commesse"
  row-key="id"
  virtual
  row-height="44"
></bolle-data-table>

<style>
  /* Senza altezza definita la tabella cresce e non scorre. */
  #jobs {
    display: block;
    block-size: 520px;
  }
</style>`,
        vue: `<script setup lang="ts">
import "@bolle/web-components";
</script>

<template>
  <bolle-data-table
    class="jobs"
    label="Commesse"
    row-key="id"
    virtual
    :rowHeight="44"
    :columns="columns"
    :rows="rows"
  ></bolle-data-table>
</template>

<style scoped>
.jobs {
  display: block;
  block-size: 520px;
}
</style>`,
        react: `import { useEffect, useRef } from "react";
import type { BolleDataTable } from "@bolle/web-components";

// columns e rows: come nella ricetta "Tabella minima".
export function JobsTable({
  columns,
  rows,
}: {
  columns: DataTableColumn[];
  rows: DataTableRow[];
}) {
  const ref = useRef<BolleDataTable>(null);

  useEffect(() => {
    const table = ref.current;
    if (!table) return;
    table.columns = columns;
    table.rows = rows;
    table.virtual = true;
    table.rowHeight = 44;
  }, []);

  return (
    <bolle-data-table
      ref={ref}
      label="Commesse"
      row-key="id"
      style={{ display: "block", blockSize: 520 }}
    />
  );
}`,
      },
    },
    {
      title: "Stile tramite CSS part",
      description:
        "Le parti pubbliche si raggiungono con ::part dal foglio dell'applicazione e valgono per tutte le righe. Il contenuto dei renderer si stila con contentStyles, perché vive nello shadow root.",
      code: {
        html: `<style>
  bolle-data-table::part(header-cell) {
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  bolle-data-table::part(row-selected) {
    background: var(--md-sys-color-primary-container);
  }

  bolle-data-table::part(data-cell) {
    font-variant-numeric: tabular-nums;
  }
</style>`,
        vue: `<style scoped>
bolle-data-table::part(header-cell) {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

bolle-data-table::part(row-selected) {
  background: var(--md-sys-color-primary-container);
}

bolle-data-table::part(data-cell) {
  font-variant-numeric: tabular-nums;
}
</style>`,
        react: `/* jobs-table.css, importato dal componente */
bolle-data-table::part(header-cell) {
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

bolle-data-table::part(row-selected) {
  background: var(--md-sys-color-primary-container);
}

bolle-data-table::part(data-cell) {
  font-variant-numeric: tabular-nums;
}`,
      },
    },
  ],
  "bolle-tour": [
    {
      title: "Tour dal JSON di configurazione",
      description:
        "I passi non stanno nel codice: parseTourConfig legge il JSON con la versione e shouldStartTour la confronta con quella che l'applicazione ha già mostrato. Il componente non fa rete e non ricorda nulla, quindi è l'applicazione a decidere quando partire e a salvare la versione al finish.",
      code: {
        html: `<bolle-button id="tour-start" variant="tonal">Rivedi il tour</bolle-button>
<bolle-tour id="tour"></bolle-tour>

<script type="module">
  import { parseTourConfig, shouldStartTour } from "@bolle/web-components";

  const config = parseTourConfig(await (await fetch("/tour.json")).text());
  const tour = document.getElementById("tour");
  tour.steps = config.steps;
  tour.placement = config.placement ?? "auto";

  const seen = localStorage.getItem("bolle-tour");
  if (shouldStartTour(config, seen)) tour.start();

  document
    .getElementById("tour-start")
    .addEventListener("click", () => tour.start());

  tour.addEventListener("finish", (event) => {
    if (event.detail.completed)
      localStorage.setItem("bolle-tour", config.version);
  });
</script>`,
        vue: `<script setup lang="ts">
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
</template>`,
        react: `import { useCallback, useEffect, useRef, useState } from "react";
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
}`,
      },
    },
    {
      title: "Un passo senza bersaglio e l'azione finale",
      description:
        "Un passo senza target non ha un elemento da mettere in luce: il riflettore copre tutta la pagina e la scheda resta al centro. actionLabel cambia il testo del bottone dell'ultimo passo, mentre placement decide dove si appoggia la scheda rispetto al bersaglio, con auto che sceglie il primo lato che ci sta.",
      code: {
        html: `<bolle-tour id="tour" placement="auto"></bolle-tour>

<script type="module">
  const tour = document.getElementById("tour");
  tour.steps = [
    {
      target: "#filtri",
      title: "Filtra le commesse",
      body: "Stato, cliente e periodo si sommano.",
    },
    {
      target: "#tabella",
      title: "La tabella",
      body: "Ordina una colonna cliccando il suo nome.",
      placement: "top",
    },
    {
      title: "Ci siamo",
      body: "Da qui parte tutto il resto.",
      actionLabel: "Apri il cruscotto",
    },
  ];
  tour.addEventListener("finish", (event) => {
    if (event.detail.completed) location.hash = "#/dashboard";
  });
  tour.start();
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";
import type { TourStep } from "@bolle/web-components";

const tour = ref<{ start: (index?: number) => void }>();
const steps: TourStep[] = [
  {
    target: "#filtri",
    title: "Filtra le commesse",
    body: "Stato, cliente e periodo si sommano.",
  },
  {
    target: "#tabella",
    title: "La tabella",
    body: "Ordina una colonna cliccando il suo nome.",
    placement: "top",
  },
  {
    title: "Ci siamo",
    body: "Da qui parte tutto il resto.",
    actionLabel: "Apri il cruscotto",
  },
];

const onFinish = (event: CustomEvent<{ completed: boolean }>) => {
  if (event.detail.completed) location.hash = "#/dashboard";
};
</script>

<template>
  <bolle-tour ref="tour" :steps="steps" @finish="onFinish"></bolle-tour>
</template>`,
        react: `import { useCallback, useRef } from "react";
import type { TourStep } from "@bolle/web-components";

const steps: TourStep[] = [
  {
    target: "#filtri",
    title: "Filtra le commesse",
    body: "Stato, cliente e periodo si sommano.",
  },
  {
    target: "#tabella",
    title: "La tabella",
    body: "Ordina una colonna cliccando il suo nome.",
    placement: "top",
  },
  {
    title: "Ci siamo",
    body: "Da qui parte tutto il resto.",
    actionLabel: "Apri il cruscotto",
  },
];

export function TourCompleto() {
  const tour = useRef<{ start: (index?: number) => void }>(null);
  const onFinish = useCallback(
    (event: CustomEvent<{ completed: boolean }>) => {
      if (event.detail.completed) location.hash = "#/dashboard";
    },
    [],
  );
  return <bolle-tour ref={tour} steps={steps} onFinish={onFinish} />;
}`,
      },
    },
    {
      title: "Pilotare il tour e leggere i passi",
      description:
        "start accetta l'indice da cui partire, next e back muovono il passo e finish chiude dichiarando se il lettore è arrivato in fondo. step-change porta indice, passo e totale, così l'applicazione può annotare dove si è fermato, e refresh rilegge il bersaglio dopo un cambio di pagina.",
      code: {
        html: `<bolle-tour id="tour" placement="bottom"></bolle-tour>
<bolle-button id="next" variant="tonal">Passo successivo</bolle-button>

<script type="module">
  const tour = document.getElementById("tour");
  tour.steps = [
    { target: "#filtri", title: "Filtra le commesse" },
    { target: "#tabella", title: "La tabella" },
    { title: "Ci siamo", actionLabel: "Chiudi" },
  ];

  tour.addEventListener("step-change", (event) => {
    const { index, total } = event.detail;
    console.log(\`Passo \${index + 1} di \${total}\`);
  });

  tour.start(1);
  document
    .getElementById("next")
    .addEventListener("click", () => tour.next());
</script>`,
        vue: `<script setup lang="ts">
import { ref } from "vue";
import type { TourStep } from "@bolle/web-components";

const tour = ref<{
  start: (index?: number) => void;
  next: () => void;
  back: () => void;
  finish: (completed: boolean) => void;
}>();
const steps: TourStep[] = [
  { target: "#filtri", title: "Filtra le commesse" },
  { target: "#tabella", title: "La tabella" },
  { title: "Ci siamo", actionLabel: "Chiudi" },
];

const onStep = (event: CustomEvent<{ index: number; total: number }>) => {
  const { index, total } = event.detail;
  console.log(\`Passo \${index + 1} di \${total}\`);
};
</script>

<template>
  <bolle-tour
    ref="tour"
    placement="bottom"
    :steps="steps"
    @step-change="onStep"
  ></bolle-tour>
  <bolle-button variant="tonal" @click="tour?.next()">
    Passo successivo
  </bolle-button>
</template>`,
        react: `import { useCallback, useRef } from "react";
import type { TourStep } from "@bolle/web-components";

interface TourHandle {
  start: (index?: number) => void;
  next: () => void;
  back: () => void;
  finish: (completed: boolean) => void;
}

const steps: TourStep[] = [
  { target: "#filtri", title: "Filtra le commesse" },
  { target: "#tabella", title: "La tabella" },
  { title: "Ci siamo", actionLabel: "Chiudi" },
];

export function TourPilotato() {
  const tour = useRef<TourHandle>(null);
  const onStep = useCallback(
    (event: CustomEvent<{ index: number; total: number }>) => {
      const { index, total } = event.detail;
      console.log(\`Passo \${index + 1} di \${total}\`);
    },
    [],
  );
  return (
    <>
      <bolle-tour
        ref={tour}
        placement="bottom"
        steps={steps}
        onStepChange={onStep}
      />
      <bolle-button variant="tonal" onClick={() => tour.current?.next()}>
        Passo successivo
      </bolle-button>
    </>
  );
}`,
      },
    },
  ],
};
