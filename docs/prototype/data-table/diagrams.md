# Diagrammi del prototipo · tabella dati

Prototipo: [prototype/data-table](../../../prototype/data-table/index.html). Diagrammi tratti da quello che il prototipo mostra.

## Flusso della fase

```mermaid
flowchart LR
  A[Perimetro chiesto all'utente] --> B[Riferimenti UX]
  B --> C[Design system: Bolle, imposto]
  C --> D[Costruzione SPA Lit]
  D --> E[Esplorazione e verdetto per superficie]
  E --> F[Consegna all'analisi]
```

## Superfici e navigazione

```mermaid
flowchart TB
  L[S1 Elenco commesse<br/>tabella] -->|clic su riga o codice| D[S5 Scheda commessa<br/>side sheet]
  L -->|freccia di riga| P[S1a Anteprima in linea]
  L -->|Filtri| F[S3 Pannello Filtri]
  L -->|Vista| V[S4 Pannello Vista<br/>densità e colonne]
  L -->|⋮ intestazione| CM[S6 Menu colonna]
  L -->|⋮ riga| RM[S7 Menu riga]
  L -->|checkbox| SB[S8 Barra selezione]
  SB -->|Assegna / Cambia stato| BM[Menu azioni di massa]
  SB -->|Archivia| SN[Snackbar con Annulla]
  RM -->|Archivia| SN
  L -->|Raggruppa| GM[Menu gruppi]
  L -.->|larghezza < 720px| C[S2 Elenco a schede]
```

## Stati dell'elenco

```mermaid
stateDiagram-v2
  [*] --> Caricamento: primo accesso
  Caricamento --> Pronto: dati ricevuti
  Caricamento --> ErroreBloccante: errore senza dati
  ErroreBloccante --> Caricamento: Riprova
  Pronto --> Aggiornamento: ordina / filtra / pagina / gruppo
  Aggiornamento --> Pronto
  Aggiornamento --> ErroreInLinea: errore con dati precedenti
  ErroreInLinea --> Aggiornamento: Riprova
  Pronto --> VuotoArchivio: nessuna commessa
  Pronto --> VuotoFiltri: nessun risultato
  VuotoFiltri --> Aggiornamento: Cancella ricerca e filtri
```

## Chi calcola cosa

```mermaid
flowchart LR
  subgraph App[Applicazione]
    Q[ricerca, filtri, ordinamento, gruppi, pagina] --> S[(server simulato)]
    S --> R[righe della finestra]
  end
  subgraph T[Tabella]
    R --> V[render, finestra virtuale]
    V --> E[eventi: sort, filter, page, select, move-column, resize-column]
  end
  E --> Q
```
