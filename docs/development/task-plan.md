# Piano dei compiti · sviluppo

## bolle-dag

Un solo attore (l'assistente), in sequenza, un compito alla volta. Analisi e architettura non sono state eseguite come fasi separate, come per gli altri componenti Schiuma: la base è il prototipo approvato in [docs/prototype/dag/dossier.md](../prototype/dag/dossier.md) e le decisioni dell'utente del 26/11/2026.

| Id | Titolo | Dipende da | Stato |
| --- | --- | --- | --- |
| dag-core | Componente `bolle-dag`: `src/dag.ts`, `src/dag.styles.ts`, icone, `dagMessages`, registrazione | — | chiuso |
| dag-site | Pagina Schiuma: demo, voce di catalogo, anatomia, esempi, ricette, traduzioni del sito | dag-core | chiuso |
| dag-docs | README inglese e cinese, guide per framework, changelog, dossier del prototipo | dag-core | chiuso |
| dag-verify | Build, controlli e confronto visivo con il prototipo | dag-site, dag-docs | chiuso |

Ordine cronologico: dag-core → dag-site → dag-docs → dag-verify.
