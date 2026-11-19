# Dossier del prototipo · gantt

Prototipo usa e getta in [prototype/gantt](../../../prototype/gantt/index.html). Avvio: `npx vite --host 127.0.0.1`, poi `/prototype/gantt/index.html`.

## Diagrammi del prototipo

Vedi [Diagrammi del prototipo · gantt](./diagrams.md): superfici, modello delle righe, flussi di modifica, regole e finestra di virtualizzazione.

## Decisioni di esperienza

- Utenti: direttore tecnico e capi commessa di un'impresa edile e impiantistica («Cantieri Rossi»), su desktop in ufficio. Il telefono è un caso di lettura, non di pianificazione.
- Scopo della superficie: vedere l'intero portafoglio commesse su un asse temporale, capire dove il piano si sovrappone e spostare una data senza aprire un modulo.
- Colori: tema Bolle chiaro e scuro; la data corrente usa il ruolo d'errore, il carico oltre capacità usa lo stesso ruolo, le barre il ruolo primario.
- Densità: due valori, comoda (40 px di riga) e compatta (30 px). La densità è una scelta della superficie, non del componente.
- Baseline: la riga grigia sotto la barra è il piano approvato. L'interruttore «Piano approvato» nella barra dei comandi la mostra o la nasconde, acceso all'apertura.
- Direzione e tema sono controlli del banco di prova presenti nell'intestazione, come «Scenario di prova»: non fanno parte della superficie del prodotto.

## Perimetro

Chiesto all'utente il 17/11/2026, tutto incluso:

- scale giorno, settimana, mese, trimestre;
- volume grande, oltre 2000 attività, con ricerca e filtro;
- interazione sia con il puntatore sia da tastiera;
- raggruppamenti, dipendenze, baseline, carico risorse, colonne configurabili, stati, densità, RTL e tema scuro.

Framework: Lit 3, SPA in DOM leggero, lo stesso della libreria, così il prototipo usa i componenti Bolle reali.

## Riferimenti UX

| Elemento | Riferimento | Uso |
| --- | --- | --- |
| Griglia di attività a sinistra e asse temporale a destra | Microsoft Project, GanttProject, TeamGantt | struttura della superficie, colonna griglia ferma in orizzontale |
| Intestazione a due righe con periodo lungo sopra e periodo breve sotto | Microsoft Project, Smartsheet | scala giorno e settimana leggibili insieme |
| Barra con riempimento di avanzamento | TeamGantt, Teamwork | avanzamento dentro la barra, non in una colonna separata |
| Barra di riepilogo con estremità a capanna | Microsoft Project, GanttProject | distinzione fra attività e commessa |
| Milestone a rombo | Microsoft Project | consegne e scadenze |
| Baseline come barra sottile sotto quella corrente | Microsoft Project, TeamGantt | confronto con il piano approvato |
| Linee di dipendenza a gomito con freccia | GanttProject, Frappe Gantt | relazione fine-inizio |
| Maniglie di ridimensionamento ai due bordi | TeamGantt, Frappe Gantt | allungare e accorciare con il puntatore |
| Nota che segue il puntatore con le date o il motivo del rifiuto | Linear, Jira | conferma immediata durante il trascinamento |
| Striscia di carico per giorno | Float, Asana workload | sovrapposizione delle attività sulla stessa persona |
| Colonna griglia che si restringe con la finestra | Azure DevOps, Jira timeline | la timeline resta utilizzabile su schermi piccoli |
| Interruttore per mostrare il piano approvato | Microsoft Project, TeamGantt | la baseline è utile a tratti, non sempre: interruttore, non colonna |
| Modifica senza trascinamento | WCAG 2.5.7 | Alt e frecce con la barra a fuoco |

Rifiutato: affidare il cambio di scala allo zoom del browser. Il prototipo cambia la scala temporale e le colonne, e lascia lo zoom al sistema.

## Design system

Imposto: Bolle, il sistema della libreria, già documentato nel catalogo del sito. Nessuna pagina di confronto aggiuntiva, nessun token nuovo: il prototipo usa `--md-sys-*`, `--bb-float-*` e i tipi di testo esistenti.

Componenti usati: `bolle-search`, `bolle-select`, `bolle-button`, `bolle-segmented-buttons`, `bolle-menu`, `bolle-side-sheet`, `bolle-snackbar`, `bolle-loading-indicator`. Barre, griglia, dipendenze e striscia di carico sono disegnate dal prototipo: sono il contenuto della superficie, non controlli.

Componenti mancanti emersi qui e non aggiunti, da valutare in fase di architettura:

- una scala temporale a due righe;
- una striscia di carico per giorno;
- una vista a due riquadri con colonna ferma e area scorrevole.

## Costruzione

File: [app.ts](../../../prototype/gantt/app.ts), [data.ts](../../../prototype/gantt/data.ts), [styles.css](../../../prototype/gantt/styles.css).

Dati finti, in `data.ts`: 48 commesse, 2160 attività, 261 milestone, 1547 dipendenze, 10 responsabili, 6 fasi. Le ore di ogni attività derivano dalla concorrenza della persona nel periodo, così il carico risultante sta intorno alla capacità di 8 ore e solo le settimane più dense la superano. Data corrente simulata: 17/11/2026.

Layout: un solo scorrimento, dentro `.chart`; intestazione a due righe ferma in alto (56 px); colonna griglia ferma in orizzontale con `position: sticky`; righe posizionate per indice dentro un contenitore alto `righe × altezza riga`; livello SVG delle dipendenze dentro lo stesso contenitore, dopo le righe.

Larghezza della timeline alle quattro scale: 28152, 9936, 3312, 1325 px. Cambiando scala resta ferma la data al bordo, non la posizione in pixel.

Verifiche in Chromium headless a 1440×900, 1024×800 e 390×844, in tema chiaro, scuro e RTL, senza errori di pagina:

- 24 righe nel DOM su 2160: la finestra si ricalcola allo scorrimento;
- spostamento con il puntatore a scala settimana: 24 px diventano 2 giorni, la nota mostra `02/10/2025 → 05/10/2025` e l'annuncio riporta le stesse date;
- ridimensionamento del bordo di fine: `03/10/2025 → 15/10/2025` con annuncio;
- spostamento di andata e ritorno: `29/09/2025 → 02/10/2025`, portata a `01/10/2025 → 04/10/2025` e riportata indietro con il puntatore alla data di partenza; il limite è la posizione che l'attività aveva nel piano caricato, non l'ultima posizione assunta, quindi una modifica resta sempre reversibile;
- spostamento rifiutato oltre il limite: la barra mostra l'anello d'errore, la nota diventa rossa con il motivo e la data del limite («Non si sposta un'attività prima del 29/09/2025»), la data non cambia;
- Annulla con Esc durante il trascinamento: nessuna modifica, annuncio «Modifica annullata»;
- creazione di dipendenza trascinando il connettore su un'altra barra: la dipendenza compare, l'annuncio dice quale attività precede quale; ciclo e dipendenza già presente vengono rifiutati con il motivo;
- tastiera: barra raggiungibile con Tab, Invio apre il dettaglio, Alt+frecce sposta di uno scalino della scala corrente, Shift+Alt+freccia muove solo la fine;
- menu colonne: apertura sopra il pulsante, nove voci con casella, la selezione iniziale corrisponde alle colonne visibili, la voce disattivata è l'ultima visibile, la scelta aggiorna la griglia;
- trascinamento del separatore per ridimensionare una colonna;
- raggruppamento per responsabile: la riga di gruppo porta il conteggio e la striscia di carico, con 119 colonne nel campione verificato, 24 in errore, 21 in saturazione, 43 parziali, 31 inattive;
- raggruppamento per struttura del lavoro e per fase, con compressione dei rami;
- ricerca «fotovoltaico»: da 2160 a 129 righe, con la ricerca vuota che porta allo stato «Nessuna attività corrisponde alla ricerca» e al pulsante per cancellarla;
- tre stati di prova più lo stato vuoto da ricerca, con riprova in errore;
- densità compatta: righe da 40 a 30 px;
- interruttore «Piano approvato»: acceso mostra le barre di baseline, spento le toglie dalla finestra;
- preset delle colonne per larghezza: sette colonne sopra 1180 px, cinque fra 900 e 1179, due fra 720 e 899, una sola sotto 720 px con la timeline che resta visibile;
- nessun overflow del documento a 1440, 1280, 1024 e 390 px;
- tema scuro: ruoli di superficie, barre, riepiloghi e striscia di carico leggibili;
- RTL: griglia a destra, timeline a sinistra, settimane crescenti verso sinistra, dipendenze specchiate, weekend allineati alla griglia.

## Esplorazione

| Superficie | Verdetto | Motivo |
| --- | --- | --- |
| S1 Intestazione e comandi | approvata | Ricerca, raggruppamento, colonne e scenario su una riga; scala, densità e interruttore del piano approvato nella barra sotto; i due controlli del banco di prova separati a destra |
| S2 Timeline a due righe | approvata | Anno o mese sopra, settimana o giorno sotto, weekend ombreggiati, linea della data corrente |
| S3 Griglia delle attività | approvata | Colonna ferma in orizzontale, righe virtualizzate, colonne ridimensionabili e configurabili |
| S4 Barre, riepiloghi, milestone, baseline | approvata | Ripieno di avanzamento, estremità a capanna sui riepiloghi, rombo per le milestone, riga grigia del piano approvato sotto la barra, con interruttore |
| S5 Dipendenze | approvata | Linee a gomito con freccia, evidenziate quando sono il bersaglio di un collegamento |
| S6 Spostamento e ridimensionamento | approvata | Nota con le date che segue il puntatore, anello d'errore e motivo sul rifiuto, Esc per annullare |
| S7 Creazione di dipendenza | approvata con riserva | Connettore fuori dalla barra, bersaglio evidenziato, rifiuto di cicli e duplicati; resta senza percorso da tastiera |
| S8 Modifica da tastiera | approvata con riserva | Alt e frecce per lo scalino della scala, Shift+Alt per la fine, Invio per il dettaglio; il collegamento fra attività resta solo con il puntatore |
| S9 Menu delle colonne | approvata | Nove voci, casella di selezione, ultima colonna non disattivabile |
| S10 Raggruppamenti e carico | approvata | Struttura del lavoro, responsabile, fase; striscia di carico dentro la riga di gruppo |
| S11 Pannello di dettaglio | approvata con riserva | Foglio laterale con i dati dell'attività; il componente promosso lascia l'apertura all'applicazione con task-open, senza foglio incorporato |
| S12 Stati | approvata | Caricamento, errore con riprova, piano vuoto, ricerca senza risultati |
| S13 Adattamento | approvata | Preset delle colonne per larghezza; su telefono restano nome e una finestra di timeline |
| S14 Tema scuro e RTL | approvata | Ruoli di superficie e specchiatura completa della superficie |

Osservazioni dell'utente:

- 17/11/2026: perimetro completo, quattro scale, oltre 2000 attività con ricerca e filtro, interazione da puntatore e da tastiera.
- 17/11/2026: un'attività portata avanti non si riusciva più a riportare indietro; la regola usava come limite l'ultima posizione assunta invece di quella del piano caricato. Corretto.
- 17/11/2026: le righe grigie sotto le attività non erano spiegate da nessuna parte; scelto l'interruttore «Piano approvato».
- 17/11/2026: prototipo approvato e promosso a `bolle-gantt`.

## Consegna

Approvato e promosso il 17/11/2026 come `bolle-gantt` in `src/gantt.ts` e `src/gantt.styles.ts`, con demo in `site/gantt-demo.ts`, voce nel catalogo del sito, righe nel README inglese e cinese e changelog 0.3.2 in `design-system.json`.

Contratto promosso:

- il componente riceve `tasks`, `columns`, `scale`, `groupBy`, `density`, `baseline`, `editable` e `linkable` e non modifica mai le attività;
- chiede lo spostamento con `task-change`, riporta il rifiuto con `task-change-blocked` applicando la regola che l'applicazione passa in `restrict`, e segnala l'apertura con `task-open`;
- crea la dipendenza con `dependency-add` e rifiuta da sé solo ciò che è strutturale — fine prima dell'inizio, dipendenza già presente o che chiude un ciclo — con `dependency-blocked`;
- riporta lo stato di vista con `view-change` e le colonne visibili con `columns-change`; `retry` sull'errore;
- possiede interazione, misura, virtualizzazione, annunci, nota di trascinamento e stati.

Testi: `ganttMessages` in `src/localization.ts` per inglese, italiano, francese e cinese, sostituibili con `labels`.

Limiti dichiarati:

- la creazione di dipendenze non ha un percorso da tastiera: si fa solo con il puntatore;
- le celle della griglia non sono modificabili: le date si cambiano dalla barra o dall'applicazione;
- nessun riordino delle righe a mano, nessun filtro per intervallo di date;
- in RTL il nome lungo nella griglia mostra la coda della stringa con i puntini a sinistra;
- l'altezza del host è obbligatoria, perché il piano la riempie.

Domande aperte per l'analisi:

1. La regola «non prima di oggi, e non prima della posizione del piano caricato» la dichiara l'applicazione o è un comportamento del componente?
2. Lo spostamento deve poter essere multiplo, con più attività selezionate?
3. Il carico risorse è una striscia del gantt, un componente a sé o una vista del raggruppamento?
4. La baseline arriva con l'attività o con un piano separato, e l'interruttore è del componente o dell'applicazione?
5. Dove si apre la superficie: sulle prime attività del piano o sulla data corrente?
6. Il preset delle colonne per larghezza è del componente o dell'applicazione?
7. Una milestone che cade nel fine settimana va rifiutata o spostata al venerdì?
8. Le dipendenze si creano anche da tastiera, e con quale comando?
