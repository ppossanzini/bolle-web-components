# Design system del prototipo · tabella dati

**Scelta imposta: Bolle** (questo repository), già in uso per la sidebar. Nessun confronto tra sistemi: la tabella è un componente di Bolle e deve usarne token e componenti. Gli altri sistemi con una capability (Material 3, Design System .italia, Element Plus, shadcn) non sono stati presentati per questo motivo.

La pagina esplorabile del sistema è il sito di documentazione (`npm run dev:site`).

## Componenti Bolle usati

| Componente | Dove |
| --- | --- |
| `bolle-sidebar` | navigazione dell'applicazione (filtro nascosto con `search="none"`) |
| `bolle-search` | ricerca globale |
| `bolle-button`, `bolle-icon-button` | barra strumenti, paginazione, azioni di riga e di colonna |
| `bolle-menu` | menu colonna, menu riga, gruppi, righe per pagina, azioni di massa, navigazione su telefono |
| `bolle-checkbox` | selezione righe e pagina, responsabili nei filtri, colonne visibili |
| `bolle-chip` (filter, input) | stati nei filtri, filtri attivi rimovibili |
| `bolle-switch` | «Solo commesse in ritardo» |
| `bolle-text-field` | importo da / fino a |
| `bolle-segmented-buttons` | densità |
| `bolle-side-sheet` | Filtri, Vista, Scheda commessa |
| `bolle-progress-indicator` | avanzamento commessa e fasi |
| `bolle-loading-indicator` | primo caricamento e aggiornamento (`contained`) |
| `bolle-snackbar` | conferme e Annulla dopo l'archiviazione |

## Elementi nuovi, da definire nella libreria

Sono parti della tabella stessa, non esistono ancora in Bolle e diventano il perimetro di `bolle-data-table`:

- cella di intestazione con ordinamento (icona e rango per l'ordinamento multiplo), maniglia di trascinamento, menu e maniglia di larghezza;
- etichetta di stato (pill con il codino Bolle), avatar con iniziali;
- riga di gruppo con totale e media, riga di anteprima;
- colonne fissate con ombra al bordo, colonna azioni fissata alla fine;
- elenco a schede per gli schermi stretti.

Uno scheletro con effetto shimmer, inventato nella prima versione, è stato tolto su richiesta dell'utente: il caricamento usa solo `bolle-loading-indicator`.
