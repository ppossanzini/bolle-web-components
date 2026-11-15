# Siti di progettazione componenti e UI library — classificazione per presentazione e chiarezza

Ricerca eseguita il 15/11/2026. Tutti gli URL in tabella sono stati verificati con fetch diretto (HTTP 200) e ispezionati nella struttura: blocchi di codice, tabelle API, playground live, skip-link, ricerca, riferimenti a design token e accessibilità.

## Criteri e pesi

| Criterio | Peso | Cosa è stato misurato |
|---|---|---|
| Chiarezza del contenuto | alto | sezioni fisse (uso, anatomia, stati, errori), linguaggio normativo |
| Esempi live / playground | alto | demo interattive, codice copiabile, tab per framework |
| Completezza del contratto API | alto | tabelle Attributes/Props/Events/Slots/Methods/CSS parts |
| IA e navigazione | medio | raggruppamento per funzione, TOC, ricerca, stabilità dei path |
| Qualità visiva | medio | layout, dark/light, densità controllata |
| Accessibilità e token | medio | skip-link, note WCAG, riferimenti a token |

Il punteggio (0-10) sintetizza questi indicatori oggettivi più l'ispezione visiva. Per i siti interamente client-rendered (Apple HIG, Base Web, Fluent, Supernova, zeroheight) il giudizio è inferito dalla struttura visibile, non da un dump completo del testo.

## Fascia 1 — Riferimenti assoluti (9,5)

| # | Sito | URL docs | Categoria | Fa meglio | Limite |
|---|---|---|---|---|---|
| 1 | Spectrum Web Components | https://spectrum.adobe.com/web/swc/components/button | Web components | Anatomy → Behaviors → Content standards → Accessibility → WCAG 2.2 → Keyboard → i18n/RTL; "Copy code" e "Copy markdown"; nav con contatori | SPA: ~2 KB di testo servito (SEO/LLM ostili); solo 24 elementi |
| 2 | Shoelace | https://shoelace.style/components/button | Web components | Demo live con tab SOURCE/HTML/React/CDN; tabelle Attributes, Properties, Events, Slots, Methods, CSS Custom Properties; TOC destra | Nessuna guida di design (anatomia, quando usarlo) |
| 3 | Web Awesome | https://webawesome.com/docs/components/button | Web components | Aggiunge CSS Parts e Custom States; capitoli theming/token | Densità altissima, nav carica; parte del valore dietro licenza |
| 4 | shadcn/ui | https://ui.shadcn.com/docs/components/base/button | Libreria componenti | "Copy Page" in markdown (agent-ready), tab per implementazione, "View Code" inline, esempi RTL, TOC | URL instabile; nessuna guida visiva; solo React |
| 5 | Material Design 3 | https://m3.material.io/components | Design system | IA esemplare: switch piattaforma, tree-nav, ricerca, pausa animazioni, light/dark; Guidelines/Specs/Accessibility | Nessun codice; SPA |

## Fascia 2 — Eccellenti (9)

| # | Sito | URL docs | Categoria | Fa meglio | Limite |
|---|---|---|---|---|---|
| 6 | GOV.UK Design System | https://design-system.service.gov.uk/components/button/ | Design system | Template identico per componente (When to use / How it works / Error messages / Research con dati utente); esempi in iframe | Presentazione datata; nessun layer token documentato |
| 7 | Carbon (IBM) | https://carbondesignsystem.com/components/button/usage/ | Design system | Guida più profonda: anatomia, stati, content guidance, a11y; tab codice per framework | Codice in altra tab (0 `<pre>` nelle pagine usage); IA dispersiva |
| 8 | Radix Primitives | https://www.radix-ui.com/primitives/docs/components/dialog | Headless | Anatomy, keyboard interactions, 12 tabelle API, a11y dichiarata | Zero design/styling |
| 9 | Mantine | https://mantine.dev/core/button/ | Libreria componenti | 24 blocchi di codice, esempi affiancati, 52 riferimenti ARIA | Solo React; nessuna guida di design |
| 10 | Nuxt UI | https://ui.nuxt.com/components/button | Libreria componenti | Preview + codice affiancati, token e dark mode documentati, API/Events/Slots | Vincolato a Nuxt/Vue; IA ridondante |
| 11 | Apple HIG | https://developer.apple.com/design/human-interface-guidelines/components | Design system | Presentazione visiva superba, tassonomia per piattaforma, testi brevi e normativi | Client-rendered; nessun codice/asset web |

## Fascia 3 — Molto buoni (8-8,5)

| # | Sito | URL docs | Categoria | Punteggio | Nota |
|---|---|---|---|---|---|
| 12 | Material Web | https://material-web.dev/components/button/ | Web components | 8,5 | Token espliciti, tabella properties; componenti alpha/deprecati |
| 13 | Polaris web components | https://shopify.dev/docs/api/app-home/latest/web-components | Web components | 8,5 | Migliore IA di catalogo (`actions/`, `forms/`, `feedback-and-status-indicators/`); poca guida visiva |
| 14 | Gestalt (Pinterest) | https://gestalt.pinterest.systems/web/button | Design system | 8,5 | Guidelines + 35 riferimenti a11y per componente |
| 15 | Primer (GitHub) | https://primer.style/product/components/button/ | Design system | 8,5 | Accessibility, dark mode, link Figma, token; docs Product/Brand duplicate |
| 16 | Atlassian Design System | https://www.atlassian.design/components/button/examples | Design system | 8,5 | Esempi per variante, content/design guidelines; HTML 673 KB |
| 17 | USWDS | https://designsystem.digital.gov/components/button/ | Design system | 8,5 | Guida uso, codice HTML pronto, patterns; nessun layer token visibile |
| 18 | Ant Design | https://ant.design/components/button/ | Libreria componenti | 8,5 | Demo interattive con codice per variante; estetica densa, incoerenze EN/CN |
| 19 | Headless UI | https://headlessui.com/react/menu | Headless | 8,5 | Esempi live, tabelle props, note keyboard; nessuna estetica |
| 20 | Ark UI | https://ark-ui.com/docs/components/accordion | Headless | 8,5 | Anatomy, 13 tabelle props; codice dietro tab |
| 21 | DaisyUI | https://daisyui.com/components/button/ | Libreria componenti | 8,5 | Catalogo varianti enorme, copia in un click; zero a11y/design |
| 22 | Base Web (Uber) | https://baseweb.design/components/ | Libreria componenti | 8 | Props TypeScript generate; interamente client-rendered, docs ferme |
| 23 | Chakra UI | https://chakra-ui.com/docs/components/button | Libreria componenti | 8 | Demo + codice, tabelle props; percorso v2/v3 confuso |
| 24 | Bootstrap | https://getbootstrap.com/docs/5.3/components/accordion/ | Libreria componenti | 8 | Storica solidità di esempi+codice; estetica datata, a11y separata |
| 25 | Element Plus | https://element-plus.org/en-US/component/button.html | Libreria componenti | 8 | 14 playground, 5 tabelle API; inglese disomogeneo, sito 342 KB |
| 26 | Vaadin | https://vaadin.com/docs/latest/components/button | Libreria componenti | 8 | Copertura enorme, esempi Java+TS, theming; pagine ~66k caratteri |
| 27 | Designers Italia | https://designers.italia.it/design-system/componenti/buttons/ | Design system | 8 | Anatomia, stato, a11y WCAG, design token; pochi esempi di codice |
| 28 | Bootstrap Italia | https://italia.github.io/bootstrap-italia/docs/componenti/buttons/ | Libreria componenti | 8 | Esempi completi in italiano; presentazione datata |
| 29 | Park UI | https://park-ui.com/docs/introduction | Libreria componenti | 8 | Design token + ricette componenti, dark mode; docs in evoluzione |
| 30 | Storybook – Writing docs | https://storybook.js.org/docs/writing-docs | Metodo | 8,5 | Autodocs, doc blocks, MDX con esempi concreti |
| 31 | Lit | https://lit.dev/ | Base tecnica | 8,5 | Playground, IA chiara per custom elements |
| 32 | Tailwind CSS | https://tailwindcss.com/docs | Utility CSS | 8,5 | Ricerca e copia codice eccellenti; nessuna guida componente |
| 33 | Component Gallery | https://component.gallery/ | Galleria | 8 | Catalogo trasversale di pattern per componente |
| 34 | Iconify | https://iconify.design/docs/ | Risorse icone | 8 | Docs per set, esempi d'uso; non copre componenti UI |
| 35 | Patterns.dev | https://www.patterns.dev/ | Pattern | 8 | Pattern con diagrammi + codice; non è un catalogo di DS |

## Fascia 4 — Utili ma parziali (7-7,5)

| Sito | URL docs | Punteggio | Nota |
|---|---|---|---|
| Spectrum design system | https://spectrum.adobe.com/components | 7,5 | Guidance curata, foundations, token; SPA senza codice, vecchi path 404 |
| PrimeNG | https://primeng.org/button | 7,5 | Demo + source viewer; UI caotica, inglese approssimativo |
| PrimeVue | https://primevue.org/button | 7,5 | Come PrimeNG |
| UI Patterns | https://ui-patterns.com/patterns | 7,5 | Esempi reali e note di usabilità; design datato |
| 21st.dev | https://21st.dev/ | 7,5 | Catalogo shadcn-style con preview; copy marketing |
| Magic UI | https://magicui.design/ | 7,5 | Preview animate accattivanti; docs essenziali, nessuna a11y |
| Material Symbols | https://fonts.google.com/icons | 7,5 | Catalogo con filtri e variabili; solo icone |
| Supernova Learn | https://learn.supernova.io/latest | 7,5 | Esempio reale di docs DS generate; contenuto tecnico limitato |
| Chromatic docs | https://www.chromatic.com/docs/ | 7,5 | Visual testing + docs; focus commerciale |
| Bulma | https://bulma.io/documentation/components/ | 7 | Chiaro e semplice; datato, a11y assente |
| zeroheight docs | https://docs.zeroheight.com/ | 7 | Documenta lo strumento; contenuto poco profondo |
| Aceternity UI | https://ui.aceternity.com/components | 7 | Impatto visivo forte; nessun code block sull'indice, IA assente |

## Fascia 5 — Solo ispirazione visiva (6,5)

Mobbin (https://mobbin.com/), Land-book (https://www.land-book.com/), Godly (https://godly.website/), Awwwards (https://www.awwwards.com/) — screenshot e vetrine reali; nessun valore documentale.

## Migliori per una libreria di web component

Per i custom elements il modello giusto è il **contratto dell'elemento**, non la documentazione React-first:

1. **Shoelace / Web Awesome** — la pagina è il contratto: Attributes, Properties, Events, Slots, Methods, CSS Custom Properties, CSS Parts, Custom States, con demo live.
2. **Spectrum Web Components** — guida di design + accessibilità + WCAG 2.2 + i18n/RTL, con esportazione in markdown.
3. **Polaris web components** — miglior tassonomia di catalogo (per funzione, non alfabetica).

Applicazione al sito Bolle:

1. Generare la tabella API per componente dai dati esistenti (`src/design-system.json`, `src/catalogue.types.ts`) invece di scriverla a mano.
2. Due tab per pagina, in stile Material 3: **Design** (anatomia, stati, token usati) e **Develop** (import, markup, properties, eventi).
3. Sezione **Accessibilità** con tabella tasto→azione e clausola WCAG coperta, più "Copy as Markdown".
4. **Template congelato** per tutte le pagine componente, con ordine delle sezioni invariato (GOV.UK).

## Anti-pattern ricorrenti

1. Docs SPA-only: Material 3 serve 66 caratteri di testo, Base Web 0 KB, Spectrum SWC ~2 KB — niente ricerca indicizzata, niente lettura offline, niente LLM.
2. Path instabili e redirect a catena (shadcn `/docs/components/button` → `/docs/components/base/button`; `polaris.shopify.com` → `shopify.dev`).
3. Marketing spacciato per docs (21st.dev, Aceternity, Magic UI).
4. Solo props table (Base Web, Ark UI, Headless UI) o solo guidance (Apple HIG, Spectrum): nessuno dei due basta.
5. Densità senza disclosure progressiva (Vaadin, Atlassian, Spectrum).
6. Codice assente dove serve (Carbon nelle pagine usage, Designers Italia).
7. Docs che violano ciò che predicano: pochi design system espongono uno skip-link o una ricerca raggiungibile al primo tab.
8. Riferimenti morti: Nord di Equinor non esiste più (`opensource.equinor.com/eqds/`, `equinor.github.io/nord/`, `nord.equinor.com` tutti falliti); `designsystemscollective.com` risponde 403 ai bot.

## Pattern adottati nella pagina componente del sito demo

Verificati navigando nel browser i riferimenti di fascia 1 e 2 (15/11/2026). Ogni scelta della pagina componente del sito Bolle deriva da un pattern presente in più riferimenti.

| Scelta nel sito Bolle | Riferimenti che la usano | Dati usati |
|---|---|---|
| Parametri accanto all'anteprima, non in un pannello nascosto | Spectrum SWC, Mantine | `controls` del catalogo |
| Codice attaccato sotto l'anteprima, con tab HTML/Vue/React e "Copia" | Radix, shadcn/ui, Nuxt UI, Shoelace | `entry.code()`; la tab HTML compare solo se l'esempio non richiede proprietà JavaScript |
| Scheda "Misure" con quote numerate nell'anteprima | Material 3 (Specs), Carbon (Specifications) | token di dimensione letti dal CSS del componente |
| Galleria "Varianti", un attributo per riga | Web Awesome, GOV.UK, Nuxt UI | controlli enum del catalogo; esclusa per overlay con `id` fissi |
| Tabella API: proprietà, attributo, tipo, default, riflessa | Web Awesome, Radix, Spectrum SWC | `elementProperties` della classe Lit registrata |
| "Supporto e limiti" espliciti | GOV.UK (Research), Carbon (status) | colonne Support e Open limits del README |
| Sezione Accessibilità a voci fisse | Spectrum SWC, Carbon, Radix | contratto `shortcut` e regole del README |
| Rail "In questa pagina" con evidenziazione della sezione | 10 riferimenti su 11 | sezioni presenti nella pagina |
| "Copia pagina" in Markdown | Spectrum SWC, shadcn/ui, Nuxt UI, Mantine | titolo, codice, API, supporto e limiti |
| Filtro della navigazione con tasto `/` | Radix, Nuxt UI, Mantine, Carbon, Apple HIG | titolo, gruppo e tag delle voci |
| Precedente/successivo in testata e in fondo | shadcn/ui, Nuxt UI | ordine dei gruppi della navigazione |

## Appendice — URL non più validi (esclusi dalla classifica)

`opensource.equinor.com/eqds/`, `equinor.github.io/frost-design-system/`, `equinor.github.io/nord/`, `github.com/equinor/nord`, `nord.equinor.com`, `designsystemscollective.com` (403), `supernova.io/docs` (→ `learn.supernova.io`), `zeroheight.com/docs` (→ `docs.zeroheight.com`), `ark-ui.com/docs/overview/introduction`, `material-web.dev/components/` (→ `/components/button/`), `ui-patterns.com/patterns/Button`, `spectrum.adobe.com/page/button`, `spectrum.adobe.com/components/button`.
