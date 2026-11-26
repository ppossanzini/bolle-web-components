# Diagrammi del prototipo · grafo DAG

Prototipo: [prototype/dag](../../../prototype/dag/index.html). Diagrammi tratti da quello che il prototipo mostra.

## Flusso della fase

```mermaid
flowchart LR
  A[Perimetro: solo il componente, generico] --> B[Riferimenti UX]
  B --> C[Design system: Bolle, imposto]
  C --> D[Costruzione SPA Lit e banco di prova]
  D --> E[Esplorazione e verdetto per superficie]
  E --> F[Consegna all'analisi]
```

## Superfici

```mermaid
flowchart TB
  E[proto-dag-editor] --> CV[S1 Canvas: griglia, spostamento della vista, zoom]
  CV --> N[S2 Nodo: testata, badge, porte]
  CV --> L[S3 Collegamenti]
  N --> C[S4 Creazione di collegamento con verdetti]
  C --> AC[S5 Aggiungi e collega]
  E --> P[S6 Tavolozza dei tipi di nodo]
  E --> M[S7 Menu: nodo, collegamento, canvas]
  CV --> SEL[S8 Selezione, spostamento, duplica, elimina, annulla]
  E --> TB[S9 Barra dei comandi e mappa]
  TB --> K[S10 Scorciatoie]
  E --> ST[S11 Stati: caricamento, vuoto, errore, sola lettura]
  E --> AD[S12 Verticale, RTL, tema scuro]
  H[Banco di prova, non è il componente] --> DP[Pannello developer: vincoli, eventi, ordine]
  H --> NS[Proprietà del nodo dell'host]
```

## Modello dati

```mermaid
classDiagram
  class DagNode {
    id
    label
    description?
    kind?
    icon?
    badge? label tone
    x y
    inputs? DagPort[]
    outputs? DagPort[]
    data?
  }
  class DagPort {
    id
    label?
    type?
    max?
  }
  class DagEdge {
    id
    source sourcePort
    target targetPort
  }
  class DagNodeKind {
    kind label description? icon? group?
    inputs? outputs?
  }
  class DagConstraints {
    typeCompatible(out, in)
    maxIncoming maxOutgoing maxNodes
    canConnect(connection)
    canAdd(kind, graph)
    canDelete(node, graph)
    canDeleteEdge(edge, graph)
  }
  DagNode "1" --> "*" DagPort : porte
  DagEdge --> DagNode : source, target
  DagNodeKind ..> DagNode : crea
  DagConstraints ..> DagEdge : valida
```

Porte assenti: una porta generica d'ingresso e una d'uscita. Lista vuota: il nodo non riceve o non emette.

## Ordine dei controlli su un collegamento

```mermaid
flowchart TB
  S[uscita → ingresso] --> RO{sola lettura?}
  RO -->|sì| X1[rifiuto: sola lettura]
  RO -->|no| SELF{stesso nodo?}
  SELF -->|sì| X2[rifiuto: anello]
  SELF -->|no| DUP{già presente?}
  DUP -->|sì| X3[rifiuto: doppione]
  DUP -->|no| CYC{la destinazione raggiunge l'origine?}
  CYC -->|sì| X4[rifiuto: ciclo, con il percorso]
  CYC -->|no| TY{tipi dichiarati e incompatibili?}
  TY -->|sì| X5[rifiuto: tipo]
  TY -->|no| MAX{porta o nodo al limite?}
  MAX -->|sì| X6[rifiuto: limite]
  MAX -->|no| DEV{canConnect del developer}
  DEV -->|stringa| X7[rifiuto: motivo del developer]
  DEV -->|true| OK[collegamento creato]
```

Le prime quattro regole sono strutturali e sempre attive; le altre esistono solo se il developer le dichiara.

## Gesto di collegamento

```mermaid
stateDiagram-v2
  [*] --> Pronto
  Pronto --> Trascina: pressione su una porta
  Trascina --> Trascina: verdetti calcolati una volta, porte valide evidenziate
  Trascina --> SuPortaValida: puntatore su porta o nodo valido
  Trascina --> SuPortaRifiutata: puntatore su porta rifiutata
  SuPortaValida --> Collegato: rilascio
  SuPortaRifiutata --> Rifiutato: rilascio
  Trascina --> MenuAggiungi: rilascio nel vuoto
  MenuAggiungi --> Collegato: scelta di un tipo compatibile
  Trascina --> Pronto: Esc
  Collegato --> [*]: dag-change
  Rifiutato --> [*]: dag-connection-rejected e snackbar
```

## Componente e applicazione

```mermaid
sequenceDiagram
  participant U as Utente
  participant C as proto-dag-editor
  participant A as Applicazione
  A->>C: nodes, edges, kinds, constraints, readonly, orientation
  U->>C: collega, sposta, aggiunge, elimina
  C->>C: verifica regole strutturali e vincoli
  C-->>A: dag-change con nodes, edges, cause
  C-->>A: dag-connection-rejected con il motivo
  C-->>A: dag-selection-change
  U->>C: doppio clic o Invio su un nodo
  C-->>A: dag-node-activate
  A->>A: apre il proprio dettaglio
  A->>C: nodes aggiornati
```
