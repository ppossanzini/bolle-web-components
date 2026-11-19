# Diagrammi del prototipo · gantt

Prototipo: [prototype/gantt](../../../prototype/gantt/index.html). Diagrammi tratti da quello che il prototipo mostra.

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
  G[Gantt] --> T[S1 Intestazione e comandi]
  G --> S[S2 Timeline a due righe]
  G --> R[S3 Griglia delle attività]
  R --> B[S4 Barre, riepiloghi, milestone, baseline]
  R --> D[S5 Dipendenze]
  B --> M[S6 Spostamento e ridimensionamento]
  B --> L[S7 Creazione di dipendenza]
  B --> K[S8 Modifica da tastiera]
  R --> C[S9 Menu delle colonne]
  R --> GR[S10 Raggruppamenti e carico]
  R --> P[S11 Pannello di dettaglio]
  G --> ST[S12 Stati]
  G --> AD[S13 Adattamento]
  G --> TH[S14 Tema scuro e RTL]
```

## Modello delle righe

```mermaid
flowchart TB
  T[Task: id, code, name, resource, start, end, progress, hours, milestone, deps, baseline] --> R{Riga}
  R -->|commessa con figli visibili| SM[summary: span calcolato dai figli]
  R -->|attività senza figli visibili| TK[task: span proprio]
  R -->|testata di raggruppamento| GR[group: chiave, etichetta, conteggio, carico]
  SM --> X[indice di riga: posizione verticale]
  TK --> X
  GR --> X
  X --> V[finestra virtualizzata: solo le righe visibili più sei]
```

## Finestra di virtualizzazione

```mermaid
flowchart LR
  SC[scorrimento del riquadro] --> P[scrollTop diviso altezza riga]
  P --> W[prima riga visibile meno sei, ultima più sei]
  W --> DOM[righe nel DOM: 24 su 2160 nel campione]
  RD[ridimensionamento del riquadro] --> W
  DEN[densità 40 o 30 px] --> W
```

## Spostamento o ridimensionamento

```mermaid
stateDiagram-v2
  [*] --> Trascinamento: pointerdown sulla barra o sulla maniglia
  Trascinamento --> Ammesso: regola soddisfatta
  Trascinamento --> Rifiutato: inizio prima del limite, oppure fine prima dell'inizio
  Trascinamento --> Annullata: Esc
  Ammesso --> Applicata: pointerup
  Rifiutato --> Annullata: pointerup
  Ammesso --> Annullata: Esc
  Applicata --> [*]
  Annullata --> [*]
```

## Creazione di dipendenza

```mermaid
stateDiagram-v2
  [*] --> Trascinamento: pointerdown sul connettore
  Trascinamento --> Bersaglio: puntatore sopra un'altra barra
  Bersaglio --> Applicata: rilascio
  Bersaglio --> Rifiutato: ciclo o dipendenza già presente
  Trascinamento --> Annullata: Esc o rilascio fuori
  Rifiutato --> Annullata: rilascio
  Applicata --> [*]
  Annullata --> [*]
```

## Regole del prototipo

```mermaid
flowchart LR
  A[inizio richiesto] --> B{inizio nel piano caricato}
  B -->|prima di oggi| C[limite: inizio del piano caricato]
  B -->|oggi o dopo| D[limite: oggi]
  C --> E{inizio >= limite}
  D --> E
  E -->|no| NO[rifiuto con motivo e data del limite nella nota]
  E -->|sì| OK{è una milestone}
  OK -->|sì e cade nel weekend| NO
  OK -->|altrimenti| SÌ[spostamento accettato]
```

## Baseline

```mermaid
flowchart LR
  SW[interruttore «Piano approvato»] -->|acceso| ON[riga grigia sotto la barra: inizio e fine del piano approvato]
  SW -->|spento| OFF[la riga non viene disegnata]
  ON --> D[scostamento leggibile: barra a destra della riga = ritardo]
```

## Scala temporale

```mermaid
flowchart TB
  SC{Scala} -->|giorno| D1[riga 1: mese e anno<br/>riga 2: giorno del mese<br/>34 px al giorno]
  SC -->|settimana| W1[riga 1: mese e anno<br/>riga 2: numero di settimana<br/>12 px al giorno]
  SC -->|mese| M1[riga 1: anno<br/>riga 2: mese<br/>4 px al giorno]
  SC -->|trimestre| Q1[riga 1: anno<br/>riga 2: trimestre<br/>1,6 px al giorno]
```

## Adattamento delle colonne

```mermaid
flowchart LR
  W[larghezza della finestra] --> A{>= 1180}
  A -->|sì| C7[7 colonne: codice, attività, responsabile, inizio, fine, giorni, avanzamento]
  A -->|no| B{>= 900}
  B -->|sì| C5[5 colonne]
  B -->|no| C{>= 720}
  C -->|sì| C2[attività e responsabile]
  C -->|no| C1[attività a 190 px]
```

## Decisioni aperte

```mermaid
flowchart TB
  Q1[La regola «non prima di oggi» è del componente o dell'applicazione?] --> AR[Architettura]
  Q2[Carico risorse: striscia, componente o vista?] --> AR
  Q3[Baseline: sempre visibile, interruttore o colonna?] --> AR
  Q4[Dipendenza da tastiera: quale comando?] --> AR
  Q5[Preset delle colonne: componente o applicazione?] --> AR
```
