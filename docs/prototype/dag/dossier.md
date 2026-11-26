# Dossier del prototipo · grafo DAG

Prototipo usa e getta in [prototype/dag](../../../prototype/dag/index.html). Avvio: `npx vite --host 127.0.0.1`, poi `/prototype/dag/index.html`.

## Diagrammi del prototipo

Vedi [Diagrammi del prototipo · grafo DAG](./diagrams.md): superfici, modello dati, ordine dei controlli su un collegamento, gesto di collegamento, rapporto fra componente e applicazione.

## Decisioni di esperienza

- Utenti: il developer che integra il componente e l'utente finale dell'applicazione che lo ospita. Il componente non conosce il dominio.
- Scopo della superficie: costruire e leggere un grafo aciclico orientato; l'applicazione decide che cosa sono nodi, porte e collegamenti.
- Colori: tema Bolle chiaro e scuro. Ruolo primario per selezione e collegamento valido, ruolo d'errore per il rifiuto; i toni del badge (`neutral`, `primary`, `success`, `warning`, `error`) usano i ruoli di stato esistenti.
- Segno del sistema: il nodo è una bolla con un angolo stretto, come il marchio e le icone della tavolozza.
- Direzione, tema, orientamento e scenario sono controlli del banco di prova, non della superficie del prodotto.

## Perimetro

Chiesto all'utente il 26/11/2026: solo il prototipo del componente, generico, senza un caso d'uso fisso. Interazione libera e vincolabile, con vincoli che il developer stabilisce da codice.

Il prototipo copre per intero il componente:

- canvas con spostamento della vista, zoom, griglia, mappa;
- nodi con icona, nome, descrizione, badge, porte generiche o tipizzate;
- creazione di collegamenti con il puntatore, con verdetto su ogni porta durante il trascinamento;
- aggiunta di nodi dalla tavolozza, dal doppio clic e dal rilascio di un collegamento nel vuoto;
- selezione singola, multipla e rettangolare; spostamento, duplicazione, eliminazione; annulla e ripeti;
- tutto da tastiera, compresi collegamento e scollegamento, attraverso il menu del nodo;
- disposizione automatica a livelli, orizzontale e verticale;
- stati di caricamento, vuoto, errore e sola lettura; tema scuro e RTL;
- volume alto: circa 200 nodi e 330 collegamenti.

Framework: Lit 3, SPA in DOM leggero, lo stesso della libreria, così il prototipo usa i componenti Bolle reali.

Il banco di prova presenta quattro configurazioni dello stesso componente: libera, vincolata, sola lettura, grafo grande. I dati di esempio servono solo a riempire il canvas con contenuto realistico.

## Riferimenti UX

| Elemento | Riferimento | Uso |
| --- | --- | --- |
| Canvas con nodi e collegamenti curvi | React Flow, n8n, Node-RED | struttura della superficie |
| Porte come punti sui bordi, ingresso prima e uscita dopo | n8n, Node-RED, Blender | trascinamento da porta a porta |
| Porte con nome e tipo dentro il nodo | Blender, Unreal Blueprint, KNIME | configurazione vincolata |
| Porte valide evidenziate e non valide attenuate durante il trascinamento | Unreal Blueprint, Rete.js | verdetto prima del rilascio |
| Motivo del rifiuto vicino al puntatore | Unreal Blueprint | il vincolo del developer diventa testo per l'utente |
| Rilascio nel vuoto che apre l'elenco dei nodi compatibili | n8n, Unreal Blueprint | aggiunta e collegamento in un gesto |
| Tavolozza laterale con ricerca e gruppi | Node-RED, KNIME | tipi di nodo dichiarati dal developer |
| Mappa in basso | React Flow, Miro | orientamento sui grafi grandi |
| Disposizione a livelli | Dagre, ELK, Airflow | lettura del flusso da sorgenti a destinazioni |
| Badge di stato sul nodo in sola lettura | Airflow, GitHub Actions | osservazione di un'esecuzione |
| Collegamento senza trascinamento | WCAG 2.5.7 | «Collega a» e «Ricevi da» nel menu del nodo, con le voci rifiutate e il motivo |
| Selezione rettangolare con Maiusc | Figma, React Flow | selezione multipla |

Rifiutati:

- il ciclo come opzione: un DAG non lo ammette, quindi il rifiuto è strutturale e non configurabile;
- lo spostamento automatico della vista quando il fuoco da tastiera passa a un nodo fuori schermo. La regola del progetto vieta gli scorrimenti non chiesti. La vista si sposta solo con «Centra nella vista», «Adatta», la mappa, le frecce sul fondo o il trascinamento;
- lo scorrimento automatico al bordo durante il trascinamento, per la stessa regola.

## Design system

Imposto: Bolle, il sistema della libreria. Nessuna pagina di confronto, nessun token nuovo: il prototipo usa `--md-sys-*`, `--bb-float-*`, `--bb-scrollbar-*` e i tipi di testo esistenti.

Componenti usati: `bolle-icon-button`, `bolle-button`, `bolle-tooltip`, `bolle-search`, `bolle-menu` (gruppi, sottomenu, voci disattivate con testo di supporto), `bolle-snackbar` con azione «Annulla», `bolle-side-sheet`, `bolle-empty-state`, `bolle-loading-indicator`. Nel banco di prova anche `bolle-select`, `bolle-switch`, `bolle-segmented-buttons`, `bolle-text-field`.

Disegnati dal prototipo, perché sono il contenuto della superficie: canvas, nodo, porte, collegamenti, mappa, nota che segue il puntatore, sagoma della tavolozza durante il trascinamento.

Componenti mancanti emersi qui e non aggiunti, da valutare in architettura:

- un'area di lavoro con spostamento della vista e zoom, riusabile anche da altri editor;
- una mappa di navigazione;
- una barra dei comandi flottante, oggi composta a mano con `bolle-icon-button`.

## Costruzione

File: [dag-editor.ts](../../../prototype/dag/dag-editor.ts) (componente), [graph.ts](../../../prototype/dag/graph.ts) (modello, vincoli, cicli, disposizione), [data.ts](../../../prototype/dag/data.ts) (configurazioni), [app.ts](../../../prototype/dag/app.ts) (banco di prova), [styles.css](../../../prototype/dag/styles.css).

API del componente nel prototipo:

- proprietà: `nodes`, `edges`, `kinds`, `constraints`, `label`, `readonly`, `orientation`, `loading`, `error`, `minimap`, `snap`;
- metodi: `fitView()`, `zoomTo()`, `autoLayout()`, `topologicalOrder()`, `canConnect()`, `undo()`, `redo()`, `clearHistory()`;
- eventi: `dag-change` con `cause`, `dag-selection-change`, `dag-connection-rejected` con `reason`, `dag-node-activate`, `dag-retry`;
- vincoli: `typeCompatible`, `maxIncoming`, `maxOutgoing`, `maxNodes`, `canConnect`, `canAdd`, `canDelete`, `canDeleteEdge`, più `type` e `max` sulla porta. Ogni regola restituisce `true` oppure il testo del motivo.

Dati finti, in `data.ts`:

- libera: pipeline di rilascio, 14 nodi, 17 collegamenti, 8 tipi di nodo senza porte dichiarate;
- vincolata: flusso dati, 13 nodi, 12 collegamenti, 13 tipi di nodo con porte tipizzate, 4 tipi di dato;
- sola lettura: la pipeline di rilascio con un badge di stato per nodo;
- grafo grande: 197 nodi, 333 collegamenti, 12 livelli, generati con seme fisso.

Verifiche in Chromium a 1385×866 e 620 px di larghezza, tema chiaro e scuro, LTR e RTL:

- tipi controllati senza errori con `tsc` su `prototype/dag`;
- trascinamento da «Meteo regionale» con verdetti calcolati: unica destinazione valida «Cruscotto commerciale»; «Previsione domanda» rifiutata perché l'ingresso è occupato, il data warehouse rifiutato dalla regola del developer;
- rilascio sul data warehouse: nota rossa «Il data warehouse accetta solo righe passate da «Pulizia»», evento `dag-connection-rejected`, snackbar e annuncio con lo stesso testo;
- rilascio valido: collegamento creato, annuncio «Collegato «Meteo regionale» a «Cruscotto commerciale»»;
- rilascio nel vuoto: menu «Aggiungi e collega» con le sorgenti disattivate («Non riceve collegamenti»), «Lettura CSV» disattivata per tipo, il data warehouse disattivato da `canAdd`; la scelta di «Aggregazione» aggiunge e collega in un passo;
- tastiera: Maiusc+F10 su «Fatturato per regione», «Collega a» → «Pulizia ordini» disattivata con «Creerebbe un ciclo: Fatturato per regione → Pulizia ordini → Ordini con prezzi → Solo Italia → Fatturato per regione»;
- Canc su «Ordini 2026»: non eliminato, snackbar con il motivo di `canDelete`;
- frecce e Maiusc+frecce spostano per passo di griglia; Ctrl+Z due volte riporta la posizione; Alt+freccia porta il fuoco al nodo vicino;
- trascinamento dalla tavolozza: sagoma che segue il puntatore, nodo «Test 4» aggiunto al rilascio;
- selezione rettangolare con Maiusc: tre nodi, annuncio «3 nodi selezionati»;
- doppio clic su un nodo: l'applicazione apre il proprio foglio «Proprietà del nodo» e può rinominare il nodo;
- sola lettura: tavolozza nascosta, comandi di modifica assenti, etichetta «Sola lettura», badge con i cinque toni;
- grafo grande: disposizione a livelli, apertura al 55% centrata sulle sorgenti, «Adatta» al 20%, circa 5 ms per aggiornamento della vista;
- verticale: porte in alto e in basso, nomi delle porte nell'etichetta al passaggio del puntatore;
- RTL: sorgenti a destra, porte e collegamenti specchiati, codice del pannello in LTR;
- stati: scheletro con indicatore di caricamento, stato vuoto con «Aggiungi un nodo», errore con «Riprova»;
- sotto 760 px la tavolozza parte chiusa e la mappa è nascosta.

Difetti trovati e corretti durante la costruzione: vista iniziale al 25% su un grafo lungo, disposizione che scivolava in diagonale sul grafo grande, vista iniziale calcolata sul grafo precedente dopo un cambio di configurazione, doppio clic sul nodo che apriva l'aggiunta perché la cattura del puntatore spostava il bersaglio sul canvas, bordo di selezione coperto dal bordo d'errore, selezione del testo durante il trascinamento.

## Esplorazione

Il 26/11/2026 l'utente ha approvato il prototipo nel suo insieme («mi piace»): il verdetto vale per tutte le superfici.

| Superficie | Verdetto | Motivo |
| --- | --- | --- |
| S1 Canvas | approvata | approvazione d'insieme del 26/11/2026 |
| S2 Nodo | approvata | approvazione d'insieme; contenuto arricchibile con uno slot, deciso alla consegna |
| S3 Collegamenti | approvata | approvazione d'insieme |
| S4 Creazione di collegamento con verdetti | approvata | approvazione d'insieme |
| S5 Aggiungi e collega | approvata | approvazione d'insieme |
| S6 Tavolozza | approvata | approvazione d'insieme |
| S7 Menu | approvata | approvazione d'insieme |
| S8 Selezione e modifiche | approvata | approvazione d'insieme |
| S9 Barra dei comandi e mappa | approvata | approvazione d'insieme |
| S10 Scorciatoie | approvata | approvazione d'insieme |
| S11 Stati | approvata | approvazione d'insieme |
| S12 Verticale, RTL, tema scuro | approvata | approvazione d'insieme |

Osservazioni dell'utente:

- 26/11/2026: il componente è del design system, quindi generico e non legato a un caso d'uso; interazione libera e vincolabile da codice; solo prototipo.
- 26/11/2026: prototipo approvato; da implementare nel gruppo Schiuma con il perimetro di `bolle-gantt`.

## Consegna

Approvato e promosso il 26/11/2026 come `bolle-dag` in [dag.ts](../../../src/dag.ts) e [dag.styles.ts](../../../src/dag.styles.ts), con demo in [dag-demo.ts](../../../site/dag-demo.ts), voce nella sezione Schiuma del sito, quattro ricette, righe nel README inglese e cinese, guide Vue e React e changelog in `design-system.json`. Il registro dello sviluppo è in [docs/development/dossier.md](../../development/dossier.md).

Risposte dell'utente alle domande aperte, 26/11/2026:

1. Il componente applica da sé le modifiche ed emette `dag-change`; l'applicazione può sostituire un'operazione con `overrides`, una funzione che riceve la richiesta e `apply`.
2. Ricollegare un collegamento trascinandone un'estremità: fuori perimetro.
3. Il contenuto del nodo si arricchisce con lo slot `node-{id}`.
4. Vincoli asincroni, etichette dei collegamenti, gruppi, copia e incolla, gesti tattili: fuori perimetro, come nel prototipo. Un'operazione asincrona resta possibile con `overrides`, che chiama `apply` quando vuole.
5. Fuoco da tastiera su un nodo fuori schermo: resta «Centra nella vista», come nel prototipo.
6. Testi: in `src/localization.ts` (`dagMessages`), in inglese, italiano, francese e cinese, sostituibili con `labels`.
