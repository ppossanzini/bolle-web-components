# Diagrammi del prototipo · shell e cruscotto

Prototipo: [prototype/app-shell](../../../prototype/app-shell/index.html). Diagrammi tratti da quello che il prototipo mostra.

## Flusso della fase

```mermaid
flowchart LR
  A[Perimetro chiesto all'utente] --> B[Riferimenti UX]
  B --> C[Design system: Bolle, imposto]
  C --> D[Costruzione SPA Lit]
  D --> E[Esplorazione e verdetto per superficie]
  E --> F[Consegna all'analisi]
```

## Regioni e forme della shell

```mermaid
flowchart TB
  subgraph Shell
    A[Barra superiore<br/>titolo, azioni, densità] --> B[Corpo]
    B --> C[Navigazione]
    B --> D[Contenuto<br/>testata e griglia]
    B --> E[Pannello secondario]
    A --> F[Barra di stato]
  end
```

| Forma | Larghezza | Navigazione | Pannello secondario |
| --- | --- | --- | --- |
| `expanded` | ≥ 1240 px | sidebar estesa, 264 px | affiancato, 340 px |
| `medium` | 840–1239 px | sidebar compressa a rail | affiancato se aperto |
| `compact` | < 840 px | barra in basso con 4 voci, menu nella barra superiore | foglio laterale modale |

## Griglia e riquadri

```mermaid
flowchart LR
  G[Griglia a 12 colonne] --> W1[Riquadro<br/>span 2–12]
  W1 -->|maniglia in alto| M[Sposta]
  W1 -->|maniglia in basso a destra| R[Larghezza]
  W1 -->|menu| S[Larghezza, sposta, nascondi]
  M --> E[evento layout-change]
  R --> E
  S --> E
  E --> APP[L'applicazione salva il layout]
```

## Stati dei riquadri

```mermaid
stateDiagram-v2
  [*] --> ConDati
  ConDati --> Caricamento: scenario di prova
  Caricamento --> ConDati
  ConDati --> SenzaDati
  ConDati --> Errore
  Errore --> ConDati: Riprova
  SenzaDati --> ConDati
```

## Superfici

```mermaid
flowchart TB
  S1[S1 Shell espansa] --> S2[S2 Shell media]
  S1 --> S3[S3 Shell compatta]
  S1 --> S4[S4 Cruscotto a griglia]
  S4 --> S5[S5 Menu del riquadro]
  S4 --> S6[S6 Pannello dettaglio commessa]
  S6 --> S7[S7 Pannello layout salvato]
  S3 --> S8[S8 Foglio dettaglio su schermo stretto]
  S9[S9 Barra di stato]
```
