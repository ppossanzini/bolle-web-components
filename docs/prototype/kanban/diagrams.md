# Diagrammi del prototipo · kanban

Prototipo: [prototype/kanban](../../../prototype/kanban/index.html). Diagrammi tratti da quello che il prototipo mostra.

## Flusso della fase

```mermaid
flowchart LR
  A[Perimetro chiesto all'utente] --> B[Riferimenti UX]
  B --> C[Design system: Bolle, imposto]
  C --> D[Costruzione SPA Lit]
  D --> E[Esplorazione e verdetto per superficie]
  E --> F[Consegna all'analisi]
```

## Superfici

```mermaid
flowchart TB
  K[S1 Board a colonne] --> C1[Colonna espansa]
  K --> C2[Colonna compressa]
  K --> L[S2 Corsie per responsabile o cliente]
  K --> D[S3 Trascinamento con indicatore e regola]
  K --> M1[S4 Menu della scheda]
  K --> M2[S5 Menu della colonna]
  K --> A[S6 Aggiunta rapida]
  K --> P[S7 Scheda di dettaglio]
  K --> S[S8 Stati: caricamento, vuoto, errore]
```

## Spostamento di una scheda

```mermaid
stateDiagram-v2
  [*] --> Trascinamento: puntatore o Alt e frecce
  Trascinamento --> Ammesso: canMove dell'applicazione
  Trascinamento --> Rifiutato: regola contraria
  Ammesso --> Spostata: rilascio
  Ammesso --> Annullata: Esc
  Rifiutato --> Annullata: rilascio
  Spostata --> [*]
  Annullata --> [*]
```

## Regole del prototipo

```mermaid
flowchart LR
  R1[In Chiuso solo con avanzamento 100%] --> V{canMove}
  R2[Da Chiuso non si torna indietro] --> V
  R3[Da Programmato a In corso solo se avanzamento ≤ 60%] --> V
  V -->|sì| OK[spostamento]
  V -->|no| NO[riga nel menu disabilitata, colonna rossa, motivo annunciato]
```

## Limiti WIP

```mermaid
flowchart LR
  W[colonna con wip > 0] --> N{schede > wip}
  N -->|no| G[conteggio normale]
  N -->|sì| A[conteggio in errore e avviso]
  A --> S[lo spostamento avviene comunque]
```
