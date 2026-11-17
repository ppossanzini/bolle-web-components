# Dossier del prototipo · shell e cruscotto

Prototipo usa e getta in [prototype/app-shell](../../../prototype/app-shell/index.html). Avvio: `npx vite`, poi `/prototype/app-shell/index.html`.

## Diagrammi del prototipo

Vedi [Diagrammi del prototipo · shell e cruscotto](./diagrams.md): flusso della fase, regioni, forme per breakpoint, griglia e riquadri, stati, superfici.

## Decisioni di esperienza

- Utenti: capi commessa e amministrazione di un'impresa edile e impiantistica («Cantieri Rossi»), su desktop in ufficio e su telefono in cantiere.
- Scopo della superficie: leggere lo stato delle commesse in un colpo d'occhio e aprire il dettaglio senza cambiare pagina.
- Colori: tema Bolle predefinito, chiaro e scuro. Il cruscotto non introduce colori propri: gli indicatori usano i ruoli di superficie e d'errore.

## Perimetro

Chiesto all'utente il 16/11/2026, tutto incluso: regioni della shell, tre forme per i breakpoint, navigazione che cambia forma, griglia a 12 colonne, riquadri ridimensionabili e riordinabili, pannello secondario, layout salvato dall'applicazione, stati dei riquadri, densità, RTL.

Framework: Lit 3 (SPA in DOM leggero), lo stesso della libreria, così il prototipo usa i componenti Bolle reali.

## Riferimenti UX

| Elemento | Riferimento | Uso |
| --- | --- | --- |
| Regioni della shell | Material 3 canonical layouts | barra superiore, navigazione, contenuto, pannello secondario |
| Forme per breakpoint | Material 3 window size classes | compact < 840, medium 840–1249, expanded ≥ 1250 (qui 1240 per la larghezza della sidebar) |
| Navigazione che cambia forma | Material 3 navigation bar / rail / drawer | sidebar estesa, rail compressa, barra in basso |
| Griglia a 12 colonne con riquadri | Carbon, Atlassian dashboard | ampiezza dichiarata dal riquadro, limite minimo |
| Riordino con alternativa senza trascinamento | WCAG 2.5.7 | Alt+frecce e menu «Sposta prima/dopo» |
| Trascinamento con copia e segnaposto | Trello, Jira, Grafana | copia che segue il puntatore, spazio tratteggiato nella posizione di arrivo, posizione annunciata |
| Ridimensionamento | Grafana, Kibana | maniglia in basso a destra, frecce da tastiera, larghezze discrete |
| Pannello secondario | Material 3 supporting pane | dettaglio accanto al contenuto, foglio modale su schermo stretto |
| Layout salvato dall'applicazione | scouting Schiuma | evento `layout-change`, nessuna persistenza nel componente |

Rifiutato: il ridimensionamento libero a pixel. Le ampiezze sono colonne intere su 12, così la griglia resta leggibile e il layout è serializzabile.

## Design system

Imposto: Bolle. Componenti usati: `bolle-app-bar`, `bolle-sidebar` (estesa e rail), `bolle-navigation-bar`, `bolle-side-sheet`, `bolle-tabs`, `bolle-icon-button`, `bolle-button`, `bolle-segmented-buttons`, `bolle-progress-indicator`, `bolle-loading-indicator`, `bolle-menu`, `bolle-snackbar`.

## Costruzione

File: [app.ts](../../../prototype/app-shell/app.ts), [data.ts](../../../prototype/app-shell/data.ts), [styles.css](../../../prototype/app-shell/styles.css).

- Dati finti: sei commesse in ritardo, cinque cantieri, cinque attività, cinque responsabili con carico, dodici mesi di fatturato.
- Menu «Scenario di prova»: riquadri con dati, in caricamento, senza dati, in errore, e ripristino del layout.
- Ogni riquadro dichiara la propria ampiezza con `data-span`; su schermo medio e stretto un'ampiezza dichiarata vale come limite e i riquadri prendono la riga intera.

Verifiche in Chromium headless a 1600×950, 1100×900 e 390×844, chiaro, scuro e RTL, senza errori di pagina:

- trascinamento di un riquadro con il puntatore e con Alt+frecce (annuncio «in posizione 6 di 9»);
- copia del riquadro che segue il puntatore, spazio tratteggiato dove arriverà, posizione nel suggerimento, scorrimento automatico ai bordi della pagina, Esc che annulla;
- ridimensionamento con le frecce sulla maniglia e dal menu (8 → 7 colonne);
- menu del riquadro con larghezze, spostamento e nascondi;
- dettaglio aperto dall'elenco dei ritardi: pannello affiancato su schermo ampio, foglio laterale su schermo stretto;
- scheda «Layout» con il JSON dell'evento `layout-change` e il ripristino;
- quattro stati dei riquadri su tutta la griglia;
- nessun overflow orizzontale a 390 px, dove la navigazione passa alla barra in basso con quattro voci.

## Esplorazione

| Superficie | Verdetto | Motivo |
| --- | --- | --- |
| S1 Shell espansa | approvata | Approvata dall'utente il 16/11/2026. |
| S2 Shell media | approvata | Approvata dall'utente il 16/11/2026. |
| S3 Shell compatta | approvata | Approvata dall'utente il 16/11/2026. |
| S4 Cruscotto a griglia | approvata | Approvata dall'utente il 16/11/2026. |
| S5 Menu del riquadro | approvata | Approvata dall'utente il 16/11/2026. |
| S6 Pannello dettaglio commessa | approvata | Approvata dall'utente il 16/11/2026. |
| S7 Pannello layout salvato | approvata | Approvata dall'utente il 16/11/2026. |
| S8 Foglio dettaglio su schermo stretto | approvata | Approvata dall'utente il 16/11/2026. |
| S9 Barra di stato | approvata | Approvata dall'utente il 16/11/2026. |

Osservazioni dell'utente:

- Approvate tutte le superfici il 16/11/2026, su richiesta di promozione a componente della libreria.

## Promozione nella libreria

Promossa su richiesta dell'utente il 16/11/2026, con tutte le superfici approvate e il perimetro del prototipo.

- Componenti: `bolle-app-shell` in [app-shell.ts](../../../src/app-shell.ts) e [app-shell.styles.ts](../../../src/app-shell.styles.ts); `bolle-dashboard` e `bolle-widget` in [dashboard.ts](../../../src/dashboard.ts) e [dashboard.styles.ts](../../../src/dashboard.styles.ts). Etichette in quattro lingue in [localization.ts](../../../src/localization.ts), registrazione in [catalogue.ts](../../../src/catalogue.ts).
- Documentazione e demo: pagine «App shell» e «Dashboard» nella sezione Schiuma del sito ([catalog.ts](../../../site/catalog.ts)), con anteprima interattiva di un'applicazione completa ([app-shell-demo.ts](../../../site/app-shell-demo.ts)) e dati in [shell-data.ts](../../../site/shell-data.ts).
- Il prototipo resta in `prototype/app-shell` e non è stato promosso.

Differenze rispetto al prototipo, decise in sviluppo:

- La shell dichiara le regioni con gli slot (`bar`, `navigation`, contenuto, `supporting`, `status`, `bottom-bar`) e non compone più la navigazione da sé: l'applicazione decide se mettere una sidebar, un rail o una barra.
- La forma la misura la shell sulla propria larghezza, non la finestra, così funziona anche dentro un pannello; `form` la forza e `form-change` la riporta.
- Il cruscotto è un componente a sé: i riquadri sono elementi `bolle-widget` figli, con `span` e `min-span`, e ogni modifica arriva con `layout-change`.
- Le ampiezze sono colonne intere su 12; il prototipo usava lo stesso criterio.

Aperto, per l'analisi:

1. Le forme non sono configurabili: le soglie 840 e 1240 sono costanti esportate e i breakpoint non si cambiano per applicazione.
2. La shell non gestisce il routing né lo stato del pannello: `supporting-open` lo governa l'applicazione.
3. Il cruscotto non salva nulla: ordine, ampiezze e riquadri nascosti restano all'applicazione.

## Consegna

Da completare dopo i verdetti. Domande aperte per l'analisi:

1. La shell contiene la sidebar come figlio o la riceve da uno slot? Il prototipo la compone, ma la sidebar ha già un proprio contratto.
2. Su schermo medio il pannello secondario resta affiancato: sotto quale larghezza deve diventare un foglio?
3. Le ampiezze si salvano come colonne o come classi semantiche (terzo, metà, intero)?
4. Quante voci nella barra in basso e quale menu copre le altre?
