# Dossier dello sviluppo

## bolle-dag · 26/11/2026

### Pianificazione

Vedi [Piano dei compiti · sviluppo](./task-plan.md). Un attore, in sequenza. Analisi e architettura non sono state eseguite come fasi separate: la base è il prototipo approvato, [Dossier del prototipo · grafo DAG](../prototype/dag/dossier.md), con le decisioni dell'utente del 26/11/2026:

- nome del tag `bolle-dag`;
- il componente applica le modifiche ed emette `dag-change`; l'applicazione sostituisce un'operazione con `overrides`;
- il contenuto del nodo si arricchisce con uno slot; il resto si ferma al prototipo;
- perimetro di consegna come `bolle-gantt`.

Schema di `overrides`, proposto dall'assistente sulla decisione dell'utente: una funzione per operazione (`add`, `connect`, `move`, `arrange`, `duplicate`, `delete`) riceve la richiesta e `apply`; senza `apply` il grafo resta com'è.

### Tecnologia e convenzioni

Stack della libreria: Lit 3 in shadow DOM, `BolleElement`, stili in un modulo `*.styles.ts`, testi in `src/localization.ts` con `labels`, icone Tabler in `src/icons.ts`. Sito: voce in `site/catalog.ts`, demo in un elemento `demo-*`, ricette in `site/recipes.ts`, esempi in `site/playground-examples.ts`, traduzioni gettext in `site/locales/*.ts`. Comandi: `npm run typecheck`, `npm run build`, `npm run build:site`, `npm run i18n:check`, `npm run guides`, `npm run guides:check`, `npm run anatomy`.

### Registro dei compiti

| Compito | Esito | Evidenza |
| --- | --- | --- |
| dag-core | chiuso | [dag.ts](../../src/dag.ts), [dag.styles.ts](../../src/dag.styles.ts), dieci icone in [icons.ts](../../src/icons.ts), `dagMessages` in quattro lingue in [localization.ts](../../src/localization.ts), registrazione ed esportazione dei tipi in [catalogue.ts](../../src/catalogue.ts); `npm run typecheck` senza errori |
| dag-site | chiuso | [dag-demo.ts](../../site/dag-demo.ts) con le configurazioni vincolata e libera e lo slot del nodo; voce Schiuma in [catalog.ts](../../site/catalog.ts); anatomia in [docs-app.ts](../../site/docs-app.ts); quattro ricette ed esempi eseguibili; 120 chiavi per lingua; `npm run i18n:check` 0 mancanti |
| dag-docs | chiuso | righe in [README.md](../../README.md) e [README.zh-CN.md](../../README.zh-CN.md); guide Vue e React in quattro lingue rigenerate; changelog e `componentEntries` 53 in [design-system.json](../../src/design-system.json); consegna nel dossier del prototipo |
| dag-verify | chiuso | `npm run build` e `npm run build:site` riusciti; `guides:check` e `i18n:check` puliti; prove nel browser e confronto visivo descritti sotto |

Skill attivate: `workflow-development`, `workflow-prototype` per la fase precedente. `capabilities-interface-design` non è stata dichiarata: la superficie è quella del prototipo approvato, senza nuove decisioni di forma.

### Verifiche nel browser

Sito di documentazione, pagina `#/it/bolle-dag`, Chromium a 1385×866:

- trascinamento da «Meteo regionale» al data warehouse: nota rossa con il motivo di `canConnect`; verso «Cruscotto commerciale»: collegamento creato e `dag-change` ricevuto dalla demo;
- `overrides.delete` senza `apply`: il nodo resta e la richiesta riporta il nodo e il collegamento collegato; `overrides.move` senza `apply`: il nodo torna alla posizione di partenza;
- pulsante inserito nello slot `node-weather`: riceve il clic, nessun trascinamento avviato; il nodo cresce da 122 a 156 px e le porte seguono;
- doppio clic su un nodo: la demo apre il proprio foglio di dettaglio;
- Maiusc+F10 su «Fatturato per regione»: «Collega a → Pulizia ordini» disattivata con il percorso del ciclo.

### Aderenza al prototipo

Confronto affiancato, configurazione vincolata, durante un collegamento rifiutato: griglia a punti, nodo a bolla con angolo stretto, righe delle porte con tipo, candidati non validi attenuati, anteprima tratteggiata rossa, nota d'errore, barra dei comandi, mappa e pulsante della tavolozza coincidono.

Differenze, tutte lacune che il prototipo lasciava perché occupava l'intera finestra:

- tavolozza e mappa dipendono dalla larghezza del componente e non della finestra: la tavolozza parte chiusa sotto 760 px, la mappa si nasconde sotto 660 px perché a quella larghezza copre la barra dei comandi;
- il nome lungo di una porta si accorcia con i puntini e il tipo resta intero;
- il nodo cresce con il contenuto dello slot, richiesto dall'utente in questa fase.

### Correzioni dopo la consegna

- 27/11/2026, segnalazione dell'utente «le linee si muovono male nella preview». Con la destinazione dietro l'origine o quasi alla stessa altezza, la curva usava un tratto fisso di 40 px e si ripiegava sul nodo. Ora il tratto di controllo è metà della distanza quando la destinazione è avanti, e cresce con la radice della distanza quando è dietro: la linea gira attorno con una curva morbida. Il nodo selezionato resta sopra gli altri, così un nodo appena spostato non finisce sotto quello vicino. Verifica: trascinamento in avanti e all'indietro nell'anteprima del sito, `npm run typecheck` e `npm run build` riusciti.
- 27/11/2026, seconda segnalazione: «se sposto un nodo tutti i collegamenti si spostano in modo scollegato». Causa: la regola `:where(*)` di `shared.styles.ts` dà a ogni elemento le transizioni di forma del sistema, comprese `width`, `height` e `inset`. Nello shadow DOM del componente il riquadro SVG dei collegamenti, che si ridimensiona con i limiti del grafo, arrivava 400 ms dopo il `viewBox`, e tutto il disegno si scalava. Il prototipo non aveva il difetto perché viveva nel DOM leggero. Correzione in `dag.styles.ts`: nessuna transizione ereditata dentro il canvas e sulle sovrapposizioni che seguono il puntatore. Verifica: sei passi di trascinamento con scarto 0 px fra porta e collegamento, larghezza calcolata uguale a quella richiesta; build riuscita.

### Aperto

- La versione del pacchetto resta 0.3.9: non è stato chiesto di alzarla.
- Il prototipo in `prototype/dag/` resta come gli altri prototipi.
