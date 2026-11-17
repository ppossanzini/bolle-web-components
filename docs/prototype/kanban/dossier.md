# Dossier del prototipo · kanban

Prototipo usa e getta in [prototype/kanban](../../../prototype/kanban/index.html). Avvio: `npx vite`, poi `/prototype/kanban/index.html`.

## Diagrammi del prototipo

Vedi [Diagrammi del prototipo · kanban](./diagrams.md): superfici, spostamento di una scheda, regole e limiti WIP.

## Decisioni di esperienza

- Utenti: capi commessa e ufficio tecnico di un'impresa edile e impiantistica («Cantieri Rossi»), su desktop in ufficio e su telefono in cantiere.
- Scopo della superficie: vedere dove sono i lavori e spostarli di fase senza aprire un modulo.
- Colori: tema Bolle, chiaro e scuro; il ritardo usa il ruolo d'errore, i tag il ruolo secondario.
- Hover della scheda scelto dall'utente il 16/11/2026 sulle tre varianti affiancate in [hover.html](../../../prototype/kanban/hover.html): variante A, strato di stato sulla superficie senza sollevamento. Il sollevamento resta riservato alla copia trascinata; la scheda di origine del trascinamento resta attenuata al suo posto.

## Perimetro

Chiesto all'utente il 16/11/2026, tutto incluso: spostamento e riordino delle schede, riordino e compressione delle colonne, limiti WIP, spostamento da menu e da tastiera, dettaglio della scheda, filtro e ricerca, aggiunta rapida, corsie, stati, densità, RTL.

Framework: Lit 3 (SPA in DOM leggero), lo stesso della libreria, così il prototipo usa i componenti Bolle reali.

## Riferimenti UX

| Elemento | Riferimento | Uso |
| --- | --- | --- |
| Board a colonne con schede | Trello, Jira | struttura base |
| Indicatore di rilascio tra due schede | Trello, Linear | segnaposto tratteggiato alto quanto la scheda |
| Regole di transizione visibili prima del rilascio | Jira workflows | voce di menu disabilitata con il motivo, colonna rossa durante il trascinamento |
| Limiti WIP come avviso e non come blocco | Kanban Method, Jira | conteggio in errore e snackbar, spostamento consentito |
| Spostamento senza trascinamento | WCAG 2.5.7 | menu «Sposta in» e Alt+frecce |
| Corsie | Jira swimlanes | raggruppamento per responsabile o cliente |
| Aggiunta rapida in colonna | Trello, Linear | campo in linea con Invio |
| Colonna compressa | Azure DevOps | striscia verticale con etichetta e conteggio |
| Scorrimento verticale dentro la colonna | Trello, Jira | la board non scorre: ogni colonna scorre la propria lista, l'intestazione resta ferma |

Rifiutato: il blocco dello spostamento quando il limite WIP è superato. Lo scouting lo prevede come avviso, e un blocco toglierebbe all'applicazione la decisione.

## Design system

Imposto: Bolle. Componenti usati: `bolle-card` (variante `outlined`, `tail="none"`), `bolle-icon-button`, `bolle-button`, `bolle-chip`, `bolle-search`, `bolle-select`, `bolle-segmented-buttons`, `bolle-progress-indicator`, `bolle-loading-indicator`, `bolle-menu`, `bolle-side-sheet`, `bolle-snackbar`, `bolle-text-field`.

## Costruzione

File: [app.ts](../../../prototype/kanban/app.ts), [data.ts](../../../prototype/kanban/data.ts), [styles.css](../../../prototype/kanban/styles.css).

- Dati finti: quattordici lavori distribuiti su quattro fasi, cinque responsabili, otto clienti, tag e importi realistici.
- Colonne: Programmato senza limite, In corso 5, Collaudo 3, Chiuso senza limite.
- Menu «Scenario di prova»: board con schede, in caricamento, senza schede, in errore, ripristino.

Verifiche in Chromium headless a 1600×950 e 390×844, chiaro, scuro e RTL, senza errori di pagina:

- trascinamento della scheda con copia che segue il puntatore, segnaposto tratteggiato nel punto di inserimento, colonna di destinazione evidenziata e suggerimento con la posizione;
- rilascio rifiutato: colonna rossa, copia con bordo rosso e motivo, avviso con il motivo, scheda non spostata;
- scorrimento automatico della board in orizzontale e in verticale quando il puntatore si avvicina al bordo, sia con la board larga sia con la striscia di colonne del telefono;
- Annulla con Esc durante il trascinamento, senza spostare la scheda;
- hover della scheda come strato di stato sulla superficie, senza sollevamento: il sollevamento è riservato alla copia trascinata, la selezione è un anello primario;
- maniglia di trascinamento sempre visibile in forma attenuata, piena su hover e su focus;
- Alt+frecce tra colonne e Alt+su/giù dentro la colonna, con annuncio della posizione;
- menu della scheda con «Sposta in» disabilitato e motivo, sposta prima/dopo, duplica;
- menu della colonna: comprimi, sposta a sinistra o destra, ordina per scadenza;
- colonna compressa con etichetta verticale e conteggio;
- aggiunta rapida in colonna con Invio;
- scheda di dettaglio con i pulsanti di spostamento e le regole applicate;
- filtro per responsabile e ricerca, corsie per responsabile;
- quattro stati della board;
- nessun overflow a 390 px: le colonne scorrono in orizzontale a 82vw;
- scorrimento verticale nella singola colonna, non nella board: verificate le tre condizioni di altezza (board piena, board con poche schede, corsie attive, dove la board scorre perché le corsie sono impilate);
- scorrimento automatico durante il trascinamento nella lista sotto il puntatore e non nella board.

## Esplorazione

Confronto delle varianti di hover: [hover.html](../../../prototype/kanban/hover.html) rende le tre risposte affiancate sulle stesse schede, la prima di ogni pannello con lo stato fermo.

| Superficie | Verdetto | Motivo |
| --- | --- | --- |
| S1 Board a colonne | approvata | Colonne a tutta altezza con scorrimento verticale nella singola colonna; intestazione ferma |
| S2 Corsie | approvata | Corsie impilate, ognuna con il proprio stato e il proprio conteggio |
| S3 Trascinamento con indicatore e regola | approvata | Copia che segue il puntatore, segnaposto, colonna rifiutata in rosso con il motivo, Esc per annullare, Alt+frecce come alternativa |
| S4 Menu della scheda | approvata | Azioni dell'applicazione, nessuna regola duplicata nella board |
| S5 Menu della colonna | approvata | Comprimi, sposta e ordina passano dall'applicazione |
| S6 Aggiunta rapida | approvata | Campo in linea con Invio, un solo invio per scheda |
| S7 Scheda di dettaglio | approvata con riserva | Il prototipo usa un foglio laterale; il componente promosso lascia l'apertura all'applicazione con `card-open`, senza foglio incorporato |
| S8 Stati | approvata | Caricamento, errore con riprova, board vuota |

Osservazioni dell'utente:

- 16/11/2026: gli hover erano sbagliati perché l'ombra stava sul contenitore esterno alla card; scelta la variante A sulle tre affiancate (strato di stato, nessun sollevamento).
- 16/11/2026: lo scorrimento verticale deve stare nella colonna e non nella board.

## Consegna

Promosso il 16/11/2026 come `bolle-kanban` in `src/kanban.ts` e `src/kanban.styles.ts`, con demo in `site/kanban-demo.ts` e voce in `design-system.json`.

Contratto promosso: la board riceve `columns` e `cards` e non li modifica mai. Chiede lo spostamento con `card-move`, riporta il rifiuto con `card-move-blocked` e applica la regola che l'applicazione passa in `restrict`. Restano all'applicazione l'ordine, la fase, lo stato di compressione (`column-collapse`), le azioni (`card-action`, `column-action`), l'apertura della scheda (`card-open`), l'aggiunta (`card-add`) e il riprova (`retry`). La board possiede interazione, misura, annunci e stati.

Limiti dichiarati: niente riordino delle colonne, niente ordinamento per colonna dentro il componente, nessun trascinamento tra board diverse, altezza del host obbligatoria.

Domande aperte per l'analisi:

1. Le regole di transizione le dichiara l'applicazione per ogni coppia di colonne o per scheda?
2. Con le corsie, lo spostamento tra corsie è consentito? Il prototipo lo permette e cambia il valore della corsia.
3. Il limite WIP è solo un avviso o deve poter essere bloccante su richiesta?
4. La colonna compressa è uno stato della colonna o una densità della board?
5. Il riordino delle colonne è dell'applicazione o della board?
