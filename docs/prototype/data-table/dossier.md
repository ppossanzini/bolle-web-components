# Dossier del prototipo · `bolle-data-table`

Prototipo usa e getta in [prototype/data-table](../../../prototype/data-table/index.html). Avvio: `npx vite`, poi `/prototype/data-table/index.html`.

## Diagrammi del prototipo

Vedi [Diagrammi del prototipo · tabella dati](./diagrams.md): flusso della fase, superfici e navigazione, stati dell'elenco, divisione dei compiti tra applicazione e tabella.

## Decisioni di esperienza

- Utenti: personale amministrativo e capi commessa di un'impresa edile e impiantistica («Cantieri Rossi»), su desktop; consultazione rapida su telefono.
- Scopo della superficie: trovare, confrontare e aggiornare le commesse.
- Colori: tema Bolle predefinito, chiaro e scuro (`data-theme="dark"`).

## Perimetro

Chiesto all'utente il 16/11/2026. Inclusi: ordinamento anche multiplo, filtri per colonna e ricerca globale, paginazione, scorrimento virtuale, selezione e azioni di massa, azioni sulla riga, righe espandibili, raggruppamento con subtotali, colonne (mostra/nascondi, larghezza, fissate), riordino trascinando, densità, stati di caricamento/vuoto/errore, schermo stretto.
Esclusi: modifica in linea, export.

Framework: Lit 3 (SPA in DOM leggero), lo stesso della libreria, così il prototipo usa i componenti Bolle reali.

## Riferimenti UX

Schemi presi da documentazione pubblica nota (non riverificata in questa sessione), senza copiarne l'aspetto:

| Elemento | Riferimento | Uso |
| --- | --- | --- |
| Tabella HTML con `aria-sort`, non griglia | W3C ARIA APG, Sortable Table | intestazioni come pulsanti, Tab tra i controlli |
| Ordinamento multiplo con Maiusc+clic e rango | MUI X Data Grid, AG Grid | numero accanto alla freccia |
| Menu della colonna (ordina, raggruppa, fissa, sposta, nascondi) | AG Grid, MUI X | menu ⋮ visibile al passaggio e al fuoco |
| Barra di selezione che sostituisce la barra strumenti, «Seleziona tutte le N» | Material Design 2 data tables, Gmail | `S8` |
| Filtri in pannello laterale e filtri attivi come chip rimovibili | Carbon Data table, Atlassian | `S3` |
| Righe espandibili con anteprima | Carbon expandable rows | `S1a` |
| Elenco a schede sotto i 720px | GOV.UK responsive tables, Carbon | `S2` |
| Riordino colonne con alternativa senza trascinamento | WCAG 2.5.7 | Alt+frecce, menu, frecce nel pannello Vista |

Rifiutato: la tabella come `role="grid"` con navigazione a frecce cella per cella. Con link, checkbox e menu in ogni riga, il pattern `table` con Tab è più semplice e coerente con lo scouting.

## Design system

Imposto: Bolle. Dettagli e componenti in [Design system del prototipo](./design-system.md).

## Costruzione

File: [app.ts](../../../prototype/data-table/app.ts), [data.ts](../../../prototype/data-table/data.ts), [styles.css](../../../prototype/data-table/styles.css).

- Dati finti in `data.ts`: 248 commesse (modo a pagine) e 5.000 (scorrimento continuo), generate con seme fisso; nomi, clienti e comuni realistici del bergamasco e bresciano.
- Il «server» simulato filtra, ordina e raggruppa con un ritardo; la tabella mostra solo quello che riceve.
- Menu «Scenario di prova» (solo prototipo): volume, risposta lenta, errore al prossimo caricamento, archivio vuoto, ricarica da zero.

Verifiche eseguite in Chromium headless a 1440×900, 1024×768 e 390×844, chiaro, scuro e RTL, senza errori di pagina:

- ordinamento singolo e multiplo con `aria-sort` corretto;
- scorrimento virtuale: 29 righe nel DOM su 5.000, `aria-rowcount` 5001, anche con gruppi;
- selezione della pagina (25), archiviazione e Annulla (248 → 246 → 248);
- Alt+→ sposta la colonna, il fuoco resta sull'intestazione e l'annuncio dice la posizione;
- frecce sulla maniglia di larghezza (320 → 288 px);
- trascinamento della colonna Cliente dopo Stato;
- filtri: 27 commesse «In corso» in ritardo, chip rimovibili;
- stati: caricamento, aggiornamento, errore bloccante, errore in linea con dati precedenti, archivio vuoto, nessun risultato.

## Esplorazione

Superfici da validare, con il verdetto dell'utente:

| Superficie | Verdetto | Motivo |
| --- | --- | --- |
| S1 Elenco commesse (tabella) | da dare | |
| S1a Anteprima in linea | da dare | |
| S2 Elenco a schede (telefono) | da dare | |
| S3 Pannello Filtri | da dare | |
| S4 Pannello Vista (densità, colonne) | da dare | |
| S5 Scheda commessa | da dare | |
| S6 Menu colonna e riordino | da dare | |
| S7 Menu riga | da dare | |
| S8 Barra selezione e azioni di massa | da dare | |
| Stati: caricamento, vuoto, errore | da dare | |
| S9 Contenitore: card o libera | da dare | |

Osservazioni dell'utente:

- La tabella deve poter stare anche fuori da una card: aggiunto il controllo «Contenitore» (Card / Libera) nell'intestazione della pagina, per confrontare le due forme sulle stesse righe.

- Il caricamento deve usare l'indicatore di Bolle: lo scheletro shimmer è stato sostituito con `bolle-loading-indicator`.
- L'anteprima della riga deve stare sopra la colonna azioni: anteprima e intestazioni di gruppo ora occupano la larghezza visibile e restano ferme quando la tabella scorre in orizzontale. La larghezza la segue un `ResizeObserver` sull'area che scorre: misurarla una volta per render la lasciava ferma dopo un ridimensionamento, e l'anteprima finiva prima o dopo la colonna azioni.
- Il menu delle azioni si apre sempre verso il lato più largo dello schermo, in orizzontale e in verticale: corretto in `bolle-menu` per tutta la libreria, sottomenu compresi.

## Promozione nella libreria

Promossa su richiesta dell'utente il 16/11/2026, con il perimetro del prototipo meno la modifica in linea e l'export.

- Componente: `bolle-data-table` in [data-table.ts](../../../src/data-table.ts), stili in [data-table.styles.ts](../../../src/data-table.styles.ts), etichette in [localization.ts](../../../src/localization.ts), icona e registrazione in [catalogue.ts](../../../src/catalogue.ts).
- Documentazione e demo: pagina «Data table» nella sezione Schiuma del sito ([catalog.ts](../../../site/catalog.ts)) con anteprima interattiva su dati realistici ([data-table-demo.ts](../../../site/data-table-demo.ts)), controlli, codice HTML/Vue/React e tabella API generata.
- Il prototipo resta in `prototype/data-table` e non è stato promosso: il componente è stato riscritto con l'API pubblica.

Differenze rispetto al prototipo, decise in sviluppo:

- I dati li possiede l'applicazione: il componente non ordina, filtra né pagina, e riporta ogni cambio con `sort`, `page-change`, `select`, `expand`, `group`, `column-change`, `row-action`, `row-activate` e `retry`.
- Il contenuto dei renderer vive nel shadow root, quindi il loro CSS si passa con `contentStyles`; anteprima e intestazioni di gruppo hanno un contenitore interno che resta fermo e copre solo la larghezza visibile.
- `virtual` richiede un'altezza sul nodo: senza, il contenitore cresce e non c'è finestra da calcolare.

Aperto, per l'analisi:

1. La paginazione conta righe, non gruppi: un gruppo può continuare nella pagina dopo e i suoi totali riguardano solo le righe ricevute.
2. Il riordino e la larghezza delle colonne non sono salvati: l'applicazione li conserva dagli eventi `column-change`.
3. Sotto i 720px il componente resta una tabella che scorre: l'elenco a schede del prototipo non è stato promosso e richiede una variante da decidere.

## Consegna

Da completare dopo i verdetti. Domande aperte per l'analisi:

1. Con i gruppi e la paginazione, la pagina conta le righe (scelta attuale: un gruppo può continuare nella pagina dopo, con totali sull'intero gruppo) o i gruppi?
2. Sotto i 720px la tabella diventa un elenco a schede: quali campi deve dichiarare l'applicazione per la scheda?
3. Il riordino e la larghezza delle colonne vanno salvati dall'applicazione (evento) o dalla tabella?
4. La riga cliccabile apre la scheda: serve un'opzione per disattivarlo?
