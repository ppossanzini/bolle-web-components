/** Italian source text → English. Keys come from scripts/i18n-keys.mjs. */
const messages: Record<string, string> = {
  'Vibrant è disponibile solo con menu verticale. Il menu si apre con show(anchor). tail="none" disegna il menu senza coda, con i quattro angoli uguali. Con filterable il menu mostra un campo di filtro; sotto 480px il menu verticale diventa un foglio dal basso.':
    'Vibrant is available only with the vertical menu. The menu opens with show(anchor). tail="none" draws the menu without the tail, with four equal corners. With filterable the menu shows a filter field; below 480px the vertical menu becomes a bottom sheet.',
  "## Aggiornamento dei dati": "## Data updates",
  "Aggiornamento dei dati": "Data updates",
  "Comprimibile": "Collapsible",
  "Gruppo che contiene la pagina corrente, aperto o chiuso che sia.":
    "Group that holds the current page, whether it is open or closed.",
  "Il componente ridisegna quando riceve una nuova proprietà. Non osserva le mutazioni interne all'array: un valore riassegnato con lo stesso riferimento non produce aggiornamenti. La tabella riporta i casi misurati.":
    "The component redraws when it receives a new property. It does not observe mutations inside the array: a value reassigned with the same reference produces no update. The table lists the measured cases.",
  "Il componente ridisegna quando riceve una nuova proprietà. Non osserva le mutazioni interne all'array: un valore riassegnato con lo stesso riferimento non produce aggiornamenti.":
    "The component redraws when it receives a new property. It does not observe mutations inside the array: a value reassigned with the same reference produces no update.",
  "JavaScript, mutazione sul posto": "JavaScript, in-place mutation",
  "Vue, stato derivato": "Vue, derived state",
  "La proprietà è un array dell'applicazione: il componente lo legge e non lo modifica. Il riferimento resta l'unico segnale di cambiamento, tranne la chiamata esplicita a refresh().":
    "The property is an array owned by the application: the component reads it and does not modify it. The reference stays the only change signal, except for the explicit refresh() call.",
  "La voce non si compone con uno slot: il componente chiama item per ogni voce dell'albero e railItem quando la barra è ridotta, così il contenuto si dichiara una volta sola. item riceve anche active, current ed expanded, quindi la riga attiva si veste senza chiudere lo stato nell'handler. Le regole CSS del markup si passano in contentStyles.":
    "The entry is not composed with a slot: the component calls item for every entry of the tree and railItem when the bar is narrow, so the content is declared once. item also receives active, current and expanded, so the active row is styled without closing over the state in the handler. The CSS of that markup goes in contentStyles.",
  "Le voci troppo lunghe finiscono con i puntini e mostrano il testo intero in un tooltip. Nella rail i gruppi si aprono in un menu accanto. `collapsible` mostra o nasconde il comando che comprime la barra; `guide` disegna una linea guida sotto ogni gruppo. Le parti `item-current`, `item-active`, `item-group` e `level-1`, `level-2`, `level-3` vestono una riga per stato e per livello.":
    "Labels that are too long end with an ellipsis and show the full text in a tooltip. In the rail, groups open in a menu alongside. `collapsible` shows or hides the control that folds the bar; `guide` draws a guide line under every group. The parts `item-current`, `item-active`, `item-group` and `level-1`, `level-2`, `level-3` style a row by state and by level.",
  "Linea guida": "Guide line",
  "Maniglia che regola la larghezza della barra.":
    "Handle that sets the width of the bar.",
  "Non ridisegna: l'array è lo stesso oggetto e il confronto è per riferimento.":
    "Does not redraw: the array is the same object and the comparison is by reference.",
  "Operazione": "Operation",
  "Risultato": "Result",
  "React assegna una nuova proprietà a ogni cambio, quindi ridisegna.":
    "React assigns a new property on every change, so it redraws.",
  "Ridisegna con i dati mutati.": "Redraws with the mutated data.",
  "Ridisegna: il riferimento è nuovo.": "Redraws: the reference is new.",
  "Riga che corrisponde alla pagina corrente.":
    "Row that matches the current page.",
  "Riga della navigazione, uguale per voce semplice e gruppo; porta anche il livello e lo stato con le parti qui sotto.":
    "Navigation row, the same for a plain entry and for a group; it also carries the level and the state through the parts below.",
  "Riga di primo livello.": "First-level row.",
  "Riga di secondo livello, dentro un gruppo.":
    "Second-level row, inside a group.",
  "Riga di terzo livello, dentro un gruppo annidato.":
    "Third-level row, inside a nested group.",
  "Riga di un gruppo che apre un sottoelenco.":
    "Row of a group that opens a sub-list.",
  "Sottoelenco aperto da un gruppo.": "Sub-list opened by a group.",
  "Vue assegna una nuova proprietà a ogni cambio, quindi ridisegna.":
    "Vue assigns a new property on every change, so it redraws.",
  "non ridisegna, il riferimento è lo stesso":
    "does not redraw, the reference is the same",
  "ridisegna": "redraws",
  "ridisegna con i dati mutati": "redraws with the mutated data",
  "Anteprima di {title}": "Preview of {title}",
  "Apri in CodePen": "Open in CodePen",
  "Apri nel playground": "Open in the playground",
  "Esegui": "Run",
  "Esempio copiato": "Example copied",
  "Pannelli dell'esempio": "Example panels",
  "Reimposta": "Reset",
  "Esempio di renderer di cella": "Cell renderer example",
  "Il componente chiama le funzioni dell'applicazione: column.render per ogni cella, rowRenderer per l'intera riga, detail per la riga aperta, groupSummary per gruppo. Gli slot coprono solo le aree esterne.":
    "The component calls the application functions: column.render for every cell, rowRenderer for the whole row, detail for the opened row, groupSummary for each group. Slots cover only the outer areas.",
  "Slot del framework tramite wrapper": "Framework slot through a wrapper",
  "Vue e React non possono passare uno slot con scope a un elemento personalizzato. Un wrapper di poche righe trasforma la slot in un renderer: la pagina scrive il template della cella una volta, il wrapper monta il contenuto per ogni riga e libera la memoria quando la cella esce dal documento.":
    "Vue and React cannot pass a scoped slot to a custom element. A wrapper of a few lines turns the slot into a renderer: the page writes the cell template once, the wrapper mounts the content for every row and releases the memory when the cell leaves the document.",
  "Il componente chiama column.render per ogni cella, una volta per riga: qui si decide il contenuto e non si prepara nulla in anticipo. La funzione restituisce un nodo o una stringa; rowRenderer sostituisce invece l'intera riga.":
    "The component calls column.render for every cell, once per row: the content is decided here, nothing is prepared in advance. The function returns a node or a string; rowRenderer replaces the whole row instead.",
  "Il componente chiama le funzioni che gli passi: column.render per ogni cella, detail per la riga aperta, groupSummary per gruppo. Gli slot servono solo alle aree esterne, come intestazione, stati e piè di pagina.":
    "The component calls the functions you pass: column.render for every cell, detail for the opened row, groupSummary for each group. Slots cover only the outer areas, such as the header, states and footer.",
  "group-by accetta la chiave di una colonna con groupable. Il componente chiama groupSummary con le righe del gruppo, oppure groupRenderer per sostituire l'intera intestazione del gruppo.":
    "group-by takes the key of a column with groupable. The component calls groupSummary with the rows of the group, or groupRenderer to replace the whole group header.",
  "Registrare i componenti": "Register the components",
  "Tabella minima": "Minimal table",
  "Formattare i valori": "Format values",
  "Cella personalizzata": "Custom cell",
  "Ordinamento": "Sorting",
  "Selezione delle righe": "Row selection",
  "Dettaglio della riga": "Row detail",
  "Raggruppamento": "Grouping",
  "Paginazione": "Paging",
  "Caricamento, errore e vuoto": "Loading, error and empty",
  "Colonne fisse, larghezze e visibilità":
    "Pinned columns, widths and visibility",
  "Scorrimento continuo": "Continuous scrolling",
  "Stile tramite CSS part": "Styling with CSS parts",
  "Il componente è un elemento personalizzato e va registrato una volta. Vue e React richiedono una dichiarazione in più perché i tag bolle-* non sono elementi noti.":
    "The component is a custom element and must be registered once. Vue and React need one extra declaration because bolle-* tags are not known elements.",
  "columns dichiara le colonne, rows i dati. row-key indica il campo univoco di ogni riga. Gli array si passano come proprietà, non come attributi.":
    "columns declares the columns, rows the data. row-key names the unique field of each row. Arrays are passed as properties, not as attributes.",
  "value trasforma il valore di una cella in testo. Serve per importi, date e numeri: la tabella continua a mostrare una sola riga di testo per cella.":
    "value turns a cell value into text. Use it for amounts, dates and numbers: the table still shows a single line of text per cell.",
  "loading copre la tabella durante il primo caricamento, updating la attenua mantenendo le righe, error mostra il messaggio ricevuto. Le azioni dello stato vuoto si passano nello slot empty.":
    "loading covers the table during the first load, updating dims it while keeping the rows, error shows the received message. Empty state actions go in the empty slot.",
  "virtual disegna solo le righe visibili. L'host deve avere un'altezza definita, altrimenti la tabella non ha un'area di scorrimento. row-height regola l'altezza stimata di ogni riga.":
    "virtual draws only the visible rows. The host needs a fixed height, otherwise the table has no scroll area. row-height sets the estimated height of each row.",
  "Le parti pubbliche si raggiungono con ::part dal foglio dell'applicazione e valgono per tutte le righe. Il contenuto dei renderer si stila con contentStyles, perché vive nello shadow root.":
    "Public parts are reached with ::part from the application stylesheet and apply to every row. Renderer content is styled with contentStyles, because it lives in the shadow root.",
  "Linguaggio degli esempi": "Language of the examples",
  "## Uso nel codice": "## Usage in code",
  "Uso nel codice": "Usage in code",
  "Cella personalizzata": "Custom cell",
  "Selezione delle righe": "Row selection",
  "Dettaglio della riga": "Row detail",
  "Raggruppamento": "Grouping",
  "Paginazione": "Paging",
  "Scorrimento continuo": "Continuous scrolling",
  "Stile tramite CSS part": "Styling with CSS parts",
  "loading copre la tabella durante il primo caricamento, updating la attenua mantenendo le righe, error mostra il messaggio ricevuto. Le azioni dello stato vuoto si passano nello slot empty.":
    "loading covers the table during the first load, updating dims it while keeping the rows, error shows the received message. Empty state actions go in the empty slot.",
  "## Anatomia pubblica": "## Public anatomy",
  "Anatomia pubblica": "Public anatomy",
  "CSS part": "CSS part",
  "Slot": "Slot",
  "Esempio completo": "Complete example",
  "Parte pubblica dello stile del componente.":
    "Public style part of the component.",
  "Slot pubblico da usare per il contenuto indicato dal nome.":
    "Public slot for the content indicated by the name.",
  "I segnaposto hanno questo significato: {rowId} è il valore di rowKey, {columnKey} è il campo key della colonna, {groupName} è il valore del gruppo e {id} è l'identificatore dell'elemento.":
    "The placeholders have these meanings: {rowId} is the rowKey value, {columnKey} is the column key field, {groupName} is the group value, and {id} is the element identifier.",
  "Slot e CSS part sono un contratto di composizione. Le parti interne senza elenco restano private al componente.":
    "Slots and CSS parts are a composition contract. Internal parts that are not listed remain private to the component.",
  "L'applicazione riempie gli slot, la shell decide la forma misurando la propria larghezza: sotto 840px la navigazione passa sotto il contenuto e il pannello diventa un foglio, oltre 1240px la navigazione resta estesa. Allargando la finestra l'anteprima passa da sola alla forma più ampia.":
    "The application fills the slots; the shell picks the form by measuring its own width: below 840px the navigation moves under the content and the pane becomes a sheet, above 1240px the navigation stays extended. Widening the window moves the preview to the widest form on its own.",
  "42 commesse attive · 7 in ritardo · 3 collaudi questa settimana":
    "42 active jobs · 7 late · 3 handovers this week",
  "5 cantieri aperti": "5 open sites",
  "6 commesse con scadenza superata": "6 jobs past their due date",
  "9 riquadri": "9 tiles",
  "Applicazione": "Application",
  "Attività recenti": "Recent activity",
  "Avanzamento cantieri": "Site progress",
  "Cantieri": "Sites",
  "Carico": "Load",
  "Carico per responsabile": "Load per manager",
  "Colonne": "Columns",
  "Fatturato": "Revenue",
  "Fatturato per mese": "Revenue per month",
  "Griglia a dodici colonne di riquadri: ampiezza, ordine, ridimensionamento e riordino, con il layout che resta all'applicazione.":
    "Twelve-column grid of tiles: width, order, resizing and reordering, with the layout kept by the application.",
  "Lavori in ritardo": "Late jobs",
  "Ogni riquadro dichiara la propria ampiezza con span e un minimo con min-span. Il riquadro si sposta trascinando la maniglia, con Alt e le frecce o dal menu, e si allarga trascinando l'angolo o con le frecce. Ogni modifica arriva con layout-change.":
    "Each tile declares its width with span and a minimum with min-span. A tile moves by dragging its handle, with Alt and the arrow keys or from its menu, and resizes by dragging the corner or with the arrow keys. Every change arrives as layout-change.",
  "Pacchetto su npm": "Package on npm",
  "Pannello secondario": "Supporting pane",
  "Personale": "People",
  "Regioni di un'applicazione gestionale: barra superiore, navigazione, contenuto, pannello secondario e barra di stato, con la forma che cambia secondo la larghezza.":
    "Regions of a management application: top bar, navigation, content, supporting pane and status bar, with the form changing with the width.",
  "Riquadri del cruscotto": "Dashboard tiles",
  "Sposta o allarga un riquadro": "Move or resize a tile",
  "Ultimo aggiornamento 22:31": "Last update 22:31",
  "lunedì 16 novembre 2026": "Monday 16 November 2026",
  "ore assegnate su 40 settimanali": "hours assigned out of 40 a week",
  "ultime 24 ore": "last 24 hours",
  "ultimi dodici mesi, in migliaia di €":
    "last twelve months, in thousands of €",
  "Apri scheda": "Open the record",
  "Archivia": "Archive",
  "Cliente": "Client",
  "Commessa": "Job",
  "Comune": "Town",
  "Dettaglio riga": "Row details",
  "Duplica commessa": "Duplicate the job",
  "Importo": "Amount",
  "Inizio lavori": "Works start",
  "Raggruppa per": "Group by",
  "Responsabile": "Manager",
  "Righe per pagina": "Rows per page",
  "Scadenza": "Due date",
  "Scorrimento continuo": "Continuous scrolling",
  "Stato": "Status",
  "commesse": "jobs",
  "Elenco di righe con colonne dichiarate dall'applicazione: ordinamento anche multiplo, gruppi, pagine, selezione, dettaglio della riga e colonne regolabili.":
    "Row list with columns declared by the application: single and multiple sorting, groups, pages, selection, row details and resizable columns.",
  " · prima {color}": " · before {color}",
  "## Esempio": "## Example",
  "## Limiti aperti": "## Open limits",
  "## Supporto": "## Support",
  ", prima {color}": ", before {color}",
  "12 non letti": "12 unread",
  "Accenti colorati con superfici grigie.": "Colored accents on grey surfaces.",
  "Accento": "Accent",
  "Accessibile per costruzione": "Accessible by design",
  "Accessibilità": "Accessibility",
  "Accetto i termini": "I accept the terms",
  "Aiuto": "Help",
  "Algoritmo": "Algorithm",
  "Allineamento": "Alignment",
  "Altre opzioni": "More options",
  "Altri componenti": "More components",
  "Altri token": "More tokens",
  "Ambra": "Amber",
  "Angolo stretto delle card": "Narrow corner of cards",
  "Angolo stretto rivolto all'origine": "Narrow corner pointing at the origin",
  "Annulla": "Cancel",
  "Anteprima": "Preview",
  "Anteprima del CSS": "CSS preview",
  "Applica": "Apply",
  "Apri": "Open",
  "Apri dialog": "Open dialog",
  "Apri drawer": "Open drawer",
  "Apri foglio": "Open sheet",
  "Apri in nuova scheda": "Open in new tab",
  "Apri navigazione": "Open navigation",
  "Apri pannello": "Open panel",
  "Apri una dialog": "Open a dialog",
  "Archivio": "Archive",
  "Ariosa": "Comfortable",
  "Armonia · Analoga": "Harmony · Analogous",
  "Armonia · Complementare": "Harmony · Complementary",
  "Armonia · Complementare divisa": "Harmony · Split complementary",
  "Armonia · Quadrato": "Harmony · Square",
  "Armonia · Triade": "Harmony · Triadic",
  "Aspetto": "Appearance",
  "Assist, filter, input e suggestion, con elevazione, rimozione e avatar.":
    "Assist, filter, input and suggestion, with elevation, removal and avatar.",
  "Attivazione": "Activation",
  "Attivo": "Active",
  "Attributo": "Attribute",
  "Avanzamento": "Progress",
  "Avanzamento lineare o circolare, determinato o indeterminato, anche ondulato.":
    "Linear or circular progress, determinate or indeterminate, optionally wavy.",
  "Azione": "Action",
  "Azione flottante con taglie e sei mappature di colore.":
    "Floating action with sizes and six color mappings.",
  "Azione principale affiancata da un menu di azioni alternative.":
    "Primary action paired with a menu of alternative actions.",
  "Azione principale o secondaria, con stati di toggle, link e invio form.":
    "Primary or secondary action, with toggle, link and form-submit states.",
  "Azioni": "Actions",
  "Azioni documento": "Document actions",
  "Badge": "Badge",
  "Barra superiore con sette layout, sottotitolo, slot e stato di scorrimento.":
    "Top bar with seven layouts, subtitle, slots and scroll state.",
  "Bianche": "White",
  "Bianco": "White",
  "Bolla · primario": "Bubble · primary",
  "Bolla-valore, livello liquido, membrana o intervallo a gocce che si fondono.":
    "Value bubble, liquid level, membrane or a range of merging drops.",
  "Bolle è una libreria di componenti che prende i token, la struttura e l'accessibilità di Material 3 e li avvolge in una pelle nuova: forme a fumetto, una pellicola iridescente e un movimento che si schiaccia e scoppia.":
    "Bolle is a component library that takes the tokens, structure and accessibility of Material 3 and wraps them in a new skin: speech-bubble shapes, an iridescent film and motion that squishes and pops.",
  "Bosco": "Forest",
  "Bottone con sola icona; l'etichetta accessibile è obbligatoria.":
    "Icon-only button; the accessible label is required.",
  "Campo a riga singola o multilinea, con affissi, contatore, errore e slot icona.":
    "Single-line or multiline field, with affixes, counter, error and icon slots.",
  "Campo di testo con suggerimenti da option native, filtro durante la digitazione e ruolo combobox.":
    "Text field with suggestions from native options, filtering while typing and the combobox role.",
  "Caricamento": "Loading",
  "Cartelle": "Folders",
  "Casa": "Home",
  "Catalogo": "Catalog",
  "Categorie": "Categories",
  "Centro": "Center",
  "Cerca": "Search",
  "Cerca città": "Search city",
  "Cerca nella posta": "Search mail",
  "Cestino": "Trash",
  "Chiudi": "Close",
  "Chiusura": "Exit",
  "Ciclo orario": "Hour cycle",
  "Città di consegna": "Delivery city",
  "Coda": "Tail",
  "Codice": "Code",
  "Codice copiato": "Code copied",
  "Codice dell'esempio": "Example code",
  "Collegamento": "Link",
  "Colore": "Color",
  "Colore personalizzato": "Custom color",
  "Colore seed": "Seed color",
  "Colore selezionato · {name}": "Selected color · {name}",
  "Colore · {name}": "Color · {name}",
  "Colori": "Colors",
  "Colori di base": "Base colors",
  "Come in Material 3, Primary diventa il tono 40 (chiaro) o 80 (scuro) della palette del seme.":
    "As in Material 3, Primary becomes tone 40 (light) or 80 (dark) of the seed palette.",
  "Come tonal spot, con colori più saturi.":
    "Like tonal spot, with more saturated colors.",
  "Come è fatta una bolla": "Anatomy of a bubble",
  "Comparsa": "Enter",
  "Compatta": "Compact",
  "Componenti": "Components",
  "Componenti morbidi, regole rigorose.": "Soft components, strict rules.",
  "Compresso": "Collapsed",
  "Con href l'intera card diventa un link: è il modo di portare a un'altra pagina con una superficie, mentre i bottoni restano per le azioni. Una card-link non deve contenere altri controlli interattivi. La coda punta da dove arriva l'utente: una card sotto il contenuto la gira in alto, dal lato opposto alla direzione in cui porta. Con tail=\"none\" la coda sparisce e la card resta una bolla con i quattro angoli uguali.":
    'With href the whole card becomes a link: it is how a surface leads to another page, while buttons stay for actions. A link card must not contain other interactive controls. The tail points to where the user comes from: a card below the content turns it upwards, opposite to the direction it leads to. With tail="none" the tail disappears and the card stays a bubble with four equal corners.',
  "Con movimento ridotto solo dissolvenze.": "With reduced motion, fades only.",
  "Condividi": "Share",
  "Conferma": "Confirm",
  "Contatore": "Counter",
  "Contatore o punto di notifica; con etichetta diventa uno stato annunciato.":
    "Counter or notification dot; with a label it becomes an announced status.",
  "Contenuto": "Content",
  "Contenuto aggiuntivo del drawer.": "Additional drawer content.",
  "Contenuto indipendente con un'azione interna.":
    "Standalone content with an inner action.",
  "Contrasto": "Contrast",
  "Controlli": "Controls",
  "Controlli dei token": "Token controls",
  "Copia": "Copy",
  "Copia CSS": "Copy CSS",
  "Copia collegamento": "Copy link",
  "Copia il comando": "Copy the command",
  "Copia il comando di installazione": "Copy the install command",
  "Copia pagina": "Copy page",
  "Corallo": "Coral",
  "Corsivo": "Italic",
  "Cosa è implementato e cosa manca rispetto a Material 3, dal catalogo del README (in inglese). Copertura della voce non significa conformità completa.":
    "What is implemented and what is missing compared with Material 3, from the README catalog. Covering an item does not mean full conformance.",
  "Crea": "Create",
  "Crea documento": "Create document",
  "Curva della molla --bb-tension: supera il valore finale del 16% e oscilla prima di fermarsi":
    "Spring curve --bb-tension: overshoots the final value by 16% and oscillates before settling",
  "Da due a cinque segmenti con selezione singola o multipla.":
    "Two to five segments with single or multiple selection.",
  "Da due a sei azioni correlate aperte da un FAB.":
    "Two to six related actions opened from a FAB.",
  "Da tre a cinque destinazioni, baseline o flexible, con layout orizzontale.":
    "Three to five destinations, baseline or flexible, with horizontal layout.",
  "Da tre a sette livelli con nome, disegnati come bolle che crescono.":
    "Three to seven named levels, drawn as growing bubbles.",
  "Data appuntamento": "Appointment date",
  "Data finale": "End date",
  "Data iniziale": "Start date",
  "Data singola o intervallo, con selettore modale o calendario docked.":
    "Single date or range, with modal picker or docked calendar.",
  "Decorativo": "Decorative",
  "Default": "Default",
  "Densità": "Density",
  "Densità della tavolozza": "Palette density",
  "Destra": "Right",
  "Determina il fuso orario della spedizione.": "Sets the shipping time zone.",
  "Dettagli": "Details",
  "Dettagli del documento selezionato.": "Details of the selected document.",
  "Dichiarato · attivo": "Declared · active",
  "Dimensione": "Size",
  "Dimensione base": "Base size",
  "Dimensione base (px)": "Base size (px)",
  "Direzione RTL": "RTL direction",
  "Direzione del testo": "Text direction",
  "Disabilitata": "Disabled",
  "Disabilitato": "Disabled",
  "Display e headline large": "Display and headline large",
  "Distanza dell'anello dal controllo": "Ring offset from the control",
  "Documenti": "Documents",
  "Documenti recenti": "Recent documents",
  "Documenti salvati": "Saved documents",
  "Documenti salvati.": "Saved documents.",
  "Documento": "Document",
  "Documento di esempio": "Sample document",
  "Documento eliminato": "Document deleted",
  "Dopo": "After",
  "Drawer di sezioni modale o standard, con contenuto aggiuntivo.":
    "Modal or standard section drawer, with additional content.",
  "Duplica": "Duplicate",
  "Durata (ms)": "Duration (ms)",
  "Elenco componenti": "Component list",
  "Elenco dei token che il CSS di {tag} usa, con il valore dichiarato accanto a quello attivo. Ogni valore si scrive per intero (px o altra unità) e la modifica vale per tutti gli esempi del componente. Colori e forma restano token globali del tema attivo; i token dei componenti annidati appartengono al componente che li usa.":
    "List of the tokens used by the CSS of {tag}, with the declared value next to the active one. Write each value in full (px or another unit); the change applies to every example of the component. Colors and shape remain global tokens of the active theme; tokens of nested components belong to the component that uses them.",
  "Elevata": "Elevated",
  "Elimina": "Delete",
  "Eliminare il documento?": "Delete the document?",
  "Eliminare la bozza?": "Delete the draft?",
  "Email": "Email",
  "Errore": "Error",
  "Esadecimale": "Hex",
  "Esempio di componenti Bolle": "Bolle components example",
  "Esempio di navigazione": "Navigation example",
  "Espanso": "Expanded",
  "Esporta e importa": "Export and import",
  "Estesa": "Full",
  "Etichetta": "Label",
  "Etichetta accessibile": "Accessible label",
  "Etichetta azione": "Action label",
  "Etichetta chiusura": "Close label",
  "Etichetta del gruppo": "Group label",
  "Etichetta menu": "Menu label",
  "Etichetta precedente": "Previous label",
  "Etichetta rimozione": "Remove label",
  "Etichetta successivo": "Next label",
  "Etichette, nomi accessibili e testi tradotti arrivano dal contenuto del chiamante: il componente non inventa testo.":
    "Labels, accessible names and translated text come from the caller's content: the component never invents text.",
  "FAB esteso con testo visibile e icona opzionale.":
    "Extended FAB with visible text and optional icon.",
  "Filtra componenti": "Filter components",
  "Filtra suggerimenti": "Filter suggestions",
  "Filtri": "Filters",
  "Filtro": "Filter",
  "Finestra modale o non modale, con azioni e variante a schermo intero.":
    "Modal or non-modal window, with actions and a full-screen variant.",
  "Foglio ancorato in basso, modale o standard, con maniglia di trascinamento.":
    "Sheet anchored to the bottom, modal or standard, with drag handle.",
  "Fondamenta": "Foundations",
  "Font testo": "Body font",
  "Font titoli": "Heading font",
  "Forma": "Shape",
  "Forma e testo": "Shape and text",
  "Forma, colore e tipografia applicati a una scheda.":
    "Shape, color and typography applied to a card.",
  "Formato": "Format",
  "Forme": "Shapes",
  "Galleggiamento": "Floating",
  "Genera da Primary": "Generate from Primary",
  "Giorno": "Day",
  "Gonfia un tema da un solo colore.": "Inflate a theme from a single color.",
  "Gradiente conico completo": "Full conic gradient",
  "Grafite": "Graphite",
  "Grassetto": "Bold",
  "Gruppo con selezione singola o multipla, navigazione da tastiera e geometria connessa.":
    "Group with single or multiple selection, keyboard navigation and connected geometry.",
  "Guarda i componenti": "Browse components",
  "Guarda il bordo: la dialog sale e scende di un paio di pixel.":
    "Watch the edge: the dialog rises and falls by a couple of pixels.",
  "Home": "Home",
  "I due vicini del complementare (+150° e +210°).":
    "The two neighbors of the complement (+150° and +210°).",
  "I ruoli tonali garantiscono il contrasto; l'iridescenza non indica mai uno stato da sola.":
    "Tonal roles guarantee contrast; iridescence never signals a state on its own.",
  "Icona finale": "Trailing icon",
  "Icona iniziale": "Leading icon",
  "Icone": "Icons",
  "Icone Tabler": "Tabler Icons",
  "Il CSS non contiene token Bolle riconosciuti.":
    "The CSS contains no recognized Bolle tokens.",
  "Il JSON contiene tema chiaro e scuro, forme, tipografia e densità, compresi i token delle dimensioni ridotti per la densità compatta, e si reimporta qui. Il CSS è pronto per il tuo foglio di stile: tema chiaro su {light}, colori scuri su {dark}, dimensioni compatte su {density}.":
    "The JSON holds light and dark themes, shapes, typography and density, including the dimension tokens scaled for the compact density, and can be re-imported here. The CSS is ready for your stylesheet: light theme on {light}, dark colors on {dark}, compact dimensions on {density}.",
  "Il JSON non è un'esportazione dei token Bolle.":
    "The JSON is not a Bolle token export.",
  "Il colore dinamico di Material 3 genera i ruoli tonali; Bolle ne ricava anche la pellicola. Scegli un seed e guarda cosa cambia: il tema vale per tutto il sito.":
    "Material 3 dynamic color generates the tonal roles; Bolle also derives the film from them. Pick a seed and watch what changes: the theme applies to the whole site.",
  "Il colore funzionale arriva dai ruoli tonali di M3, generati dal seed #5B4CF0 con npm run colors. La pellicola è un livello decorativo a parte. L'accento Scoppio è riservato a call to action rare.":
    "Functional color comes from the M3 tonal roles, generated from the seed #5B4CF0 with npm run colors. The film is a separate decorative layer. The Pop accent is reserved for rare calls to action.",
  "Il colore resta M3.": "Color stays M3.",
  "Il file JSON non è valido.": "The JSON file is not valid.",
  "Il file è troppo grande (massimo 512 KB).":
    "The file is too large (512 KB maximum).",
  "Il livello più alto, con tinta del primario":
    "The highest level, tinted with primary",
  "Il seme è il valore corrente di Primary; la generazione sostituisce tutti gli altri ruoli del tema chiaro.":
    "The seed is the current Primary value; generating replaces all the other light-theme roles.",
  "Il seme è il valore corrente di Primary; la generazione sostituisce tutti gli altri ruoli del tema scuro.":
    "The seed is the current Primary value; generating replaces all the other dark-theme roles.",
  "Il testo di base usa la dimensione scelta: etichette, campi e paragrafi crescono e calano insieme.":
    "Body text uses the chosen size: labels, fields and paragraphs grow and shrink together.",
  "Implementato": "Implemented",
  "Impostazioni": "Settings",
  "In Bolle l'elevazione si legge da ombra morbida e riflesso, non solo dal colore di superficie. Più un elemento sale, più l'ombra si allarga e prende la tinta del primario. Al passaggio del puntatore ogni pulsante mostra il riflesso della bolla sopra il proprio colore, insieme allo strato di stato M3.":
    "In Bolle, elevation reads from a soft shadow and a highlight, not just from the surface color. The higher an element rises, the wider its shadow spreads and the more it takes on the primary tint. On hover every button shows the bubble highlight over its own color, together with the M3 state layer.",
  "In pausa": "Paused",
  "In questa pagina": "On this page",
  "Inattivo": "Inactive",
  "Inchiostro": "Ink",
  "Indeterminata": "Indeterminate",
  "Indeterminato": "Indeterminate",
  "Indicatori": "Indicators",
  "Indice": "Contents",
  "Inizia": "Get started",
  "Inizia ora": "Get started now",
  "Inizio settimana": "Week starts on",
  "Inset": "Inset",
  "Installa il pacchetto, scegli un seed, e i tuoi componenti M3 prendono forma.":
    "Install the package, pick a seed, and your M3 components take shape.",
  "Intensità": "Intensity",
  "Interattiva": "Interactive",
  "Interfacce con tensione superficiale": "Interfaces with surface tension",
  "Interfacce con tensione superficiale.": "Interfaces with surface tension.",
  "Interruttore immediato con icone di stato opzionali.":
    "Instant switch with optional state icons.",
  "Invia": "Send",
  "Invia per email": "Send by email",
  "Invia più tardi": "Send later",
  "Ispirata a Material 3 · open source": "Inspired by Material 3 · open source",
  "L'anello iridescente è sempre doppiato da un contorno pieno: il significato non dipende mai dal gradiente.":
    "The iridescent ring is always backed by a solid outline: meaning never depends on the gradient.",
  "L'attributo {attribute} usa la sintassi di {syntax}. Se il componente contiene un controllo focalizzabile, la combinazione lo mette a fuoco; bottoni e link vengono anche attivati.":
    "The {attribute} attribute uses the {syntax} syntax. If the component contains a focusable control, the shortcut focuses it; buttons and links are also activated.",
  "L'operazione non può essere annullata.": "This action cannot be undone.",
  "La coda": "The tail",
  "La coda punta qui": "The tail points here",
  "La copia resta nel tuo spazio personale.":
    "The copy stays in your personal space.",
  "La pellicola": "The film",
  "La scala di M3 non cambia: cambiano solo le famiglie. Fredoka 600 per display e titoli dai 32 px in su, Figtree per testo e controlli, JetBrains Mono per il codice.":
    "The M3 scale doesn't change: only the families do. Fredoka 600 for display and headings from 32 px up, Figtree for text and controls, JetBrains Mono for code.",
  'La coda non è obbligatoria: card, menu, tooltip, azioni del FAB e snackbar accettano tail="none" e tornano bolle con i quattro angoli uguali, senza cambiare raggio.':
    'The tail is optional: card, menu, tooltip, FAB actions and snackbar accept tail="none" and become bubbles with four equal corners, without changing radius.',
  "Laguna": "Lagoon",
  "Larghezza": "Width",
  "Lavoro": "Work",
  "Layout": "Layout",
  "Leggera quando serve": "Light when it counts",
  "Leggera quando serve.": "Light when it counts.",
  "Leggera,Morbida,Media,Forte,Intensa": "Light,Soft,Medium,Strong,Intense",
  "Lilla · container": "Lilac · container",
  "Limiti aperti": "Open limits",
  "Lingua": "Language",
  "Lo schiocco": "The pop",
  "Luce": "Light",
  "Lunghezza massima": "Maximum length",
  "Maniglia": "Handle",
  "Mantieni il primario esatto": "Keep primary exact",
  "Massimo": "Maximum",
  "Material 3 resta la struttura: ruoli colore, scala tipografica, stati e accessibilità. Bolle ne è la pelle e la riconosci da tre segni: l'angolo a coda, la pellicola iridescente e lo schiocco. Tutto passa da pochi token in più, che puoi regolare o spegnere.":
    "Material 3 remains the structure: color roles, type scale, states and accessibility. Bolle is its skin, and you can tell it by three signs: the tail corner, the iridescent film and the pop. Everything goes through a few extra tokens that you can tune or turn off.",
  "Materiale": "Material",
  "Media": "Medium",
  "Menu": "Menu",
  "Menu baseline o verticale, con gruppi, sottomenu e selezione.":
    "Baseline or vertical menu, with groups, submenus and selection.",
  "Menu sotto il bottone": "Menu below the button",
  "Menu, tooltip ricco, card elevate": "Menus, rich tooltips, elevated cards",
  "Mese": "Month",
  "Messaggi ricevuti": "Received messages",
  "Messaggi ricevuti.": "Received messages.",
  "Messaggio": "Message",
  "Messaggio temporaneo con azione, chiusura e coda di messaggi.":
    "Temporary message with action, close button and message queue.",
  "Minimo": "Minimum",
  "Misure": "Measurements",
  "Modale": "Modal",
  "Modifica": "Edit",
  "Molle con tensione superficiale. Alla pressione il pulsante si schiaccia a volume costante; al rilascio oscilla con una molla poco smorzata. Le superfici si gonfiano dall'angolo a coda e scoppiano alla chiusura. Le dialog, una volta aperte, galleggiano in modo quasi impercettibile.":
    "Springs with surface tension. When pressed, a button squishes at constant volume; on release it wobbles on an underdamped spring. Surfaces inflate from the tail corner and pop when they close. Once open, dialogs float almost imperceptibly.",
  "Molle con tensione superficiale: si schiaccia, oscilla, si gonfia, scoppia. E si ferma del tutto se l'utente preferisce meno movimento.":
    "Springs with surface tension: they squish, wobble, inflate and pop. And they stop completely if the user prefers less motion.",
  "Mostra snackbar": "Show snackbar",
  "Movimento": "Motion",
  "Movimento rispettoso": "Respectful motion",
  "Movimento rispettoso.": "Respectful motion.",
  "Multilinea": "Multiline",
  "Navigazione laterale": "Side navigation",
  "Navigazione principale": "Main navigation",
  "Nebbia · secondario": "Mist · secondary",
  "Nero": "Black",
  'Nessun blocco :root o [data-theme="dark"] trovato nel CSS.':
    'No :root or [data-theme="dark"] block found in the CSS.',
  "Nessun componente precedente": "No previous component",
  "Nessun componente successivo": "No next component",
  "Nessun componente: disponibile per il tuo CSS":
    "No component: available for your CSS",
  "Nome": "Name",
  "Non potrai recuperarla.": "You won't be able to recover it.",
  "Nord": "North",
  "Notifiche": "Notifications",
  "Nuovo": "New",
  "Nuovo elemento": "New item",
  "Obbligatoria": "Required",
  "Obbligatorio": "Required",
  "Oceano": "Ocean",
  "Ogni riga cambia un solo attributo; gli altri restano quelli dell'anteprima.":
    "Each row changes a single attribute; the others stay as in the preview.",
  "Ogni scheda mostra il componente reale nel suo stato predefinito. Le famiglie seguono l'ordine e il raggruppamento della overview Material 3.":
    "Each card shows the real component in its default state. Families follow the order and grouping of the Material 3 overview.",
  "Ogni superficie sospesa ha tre angoli tondi e uno stretto, che punta verso l'elemento da cui è nata. Menu, tooltip e azioni del FAB calcolano l'angolo all'apertura; snackbar e card lo tengono in basso, sul lato di inizio. I bottoni restano a pillola.":
    "Every floating surface has three rounded corners and one narrow corner, pointing at the element it came from. Menus, tooltips and FAB actions compute the corner when they open; snackbars and cards keep it at the bottom, on the start side. Buttons stay pill-shaped.",
  "Ogni superficie sospesa ha un angolo stretto che indica da dove è nata. Menu, tooltip e snackbar ti dicono sempre a chi appartengono.":
    "Every floating surface has a narrow corner that shows where it came from. Menus, tooltips and snackbars always tell you who they belong to.",
  "Ogni token ha il colore e il numero della sua quota nell'anteprima. La modifica vale per tutti gli esempi di {tag}.":
    "Each token shows the color and number of its dimension in the preview. The change applies to every example of {tag}.",
  "Ondulato": "Wavy",
  "Opacità del fondo traslucido": "Opacity of the translucent background",
  "Oppure incolla JSON o CSS": "Or paste JSON or CSS",
  "Opzioni": "Options",
  "Ora con quadrante o inserimento numerico, ciclo 12 o 24 ore.":
    "Time with a dial or numeric input, 12- or 24-hour cycle.",
  "Ora promemoria": "Reminder time",
  "Ordina": "Sort",
  "Ordina per": "Sort by",
  "Orientamento": "Orientation",
  "Pagina copiata in Markdown": "Page copied as Markdown",
  "Palette Material": "Material palette",
  "Paletti": "Guardrails",
  "Pannello del playground": "Playground panel",
  "Pannello laterale modale o standard, con variante staccata dal bordo.":
    "Modal or standard side panel, with a variant detached from the edge.",
  "Parametri": "Parameters",
  "Passa sopra": "Hover",
  "Passa sopra i pulsanti: il riflesso compare in alto a destra.":
    "Hover over the buttons: the highlight appears at the top right.",
  "Passa sopra un componente per vedere i token che usa":
    "Hover over a component to see the tokens it uses",
  "Passo": "Step",
  "Pellicola": "Film",
  "Pensato per colori estratti da immagini: fedele al seme, accenti per temperatura.":
    "Designed for colors extracted from images: faithful to the seed, accents by temperature.",
  "Percorso": "Breadcrumb",
  "Periodo": "Period",
  "Persistente": "Persistent",
  "Più popolari": "Most popular",
  "Più recenti": "Newest",
  "Più tardi": "Later",
  "Placeholder": "Placeholder",
  "Posta": "Inbox",
  "Precedente": "Previous",
  "Precedente: {name}": "Previous: {name}",
  "Predefinito M3: secondary e tertiary sono varianti tenui della tinta del seme.":
    "M3 default: secondary and tertiary are muted variants of the seed hue.",
  "Preferenze": "Preferences",
  "Preferenze di notifica": "Notification preferences",
  "Preferenze personali": "Personal preferences",
  "Preferenze personali.": "Personal preferences.",
  "Preferiti": "Favorites",
  "Prefisso": "Prefix",
  "Premi / per cercare": "Press / to search",
  "Premi Tab per il focus": "Press Tab to focus",
  "Premi e rilascia": "Press and release",
  "Pressione": "Press",
  "Prima": "Before",
  "Prima: {color}": "Before: {color}",
  "Primary e container restano molto vicini al seme, anche se saturo.":
    "Primary and container stay very close to the seed, even when saturated.",
  "Primary resta il colore scelto; il testo sopra diventa il tono più leggibile.":
    "Primary stays the chosen color; the text on it becomes the most readable tone.",
  "Principale": "Main",
  "Proprietà": "Property",
  "Proprietà pubbliche lette dalla classe registrata. Array e oggetti si assegnano come proprietà JavaScript; gli attributi booleani valgono per presenza, quindi {example} resta disabilitato.":
    "Public properties read from the registered class. Arrays and objects are assigned as JavaScript properties; boolean attributes work by presence, so {example} stays disabled.",
  "Puoi revocare il consenso.": "You can withdraw consent.",
  "Quadrato sulla ruota (+90° e +180°).":
    "Square on the wheel (+90° and +180°).",
  "Quasi bianche": "Off-white",
  "Quasi senza colore: utile per interfacce sobrie.":
    "Almost colorless: useful for understated interfaces.",
  "Raggio degli angoli e componenti che lo usano":
    "Corner radius and the components that use it",
  "Raggio dei tre angoli tondi delle superfici sospese":
    "Radius of the three rounded corners of floating surfaces",
  "Raggio del tooltip semplice": "Plain tooltip radius",
  "Raggio di snackbar e tooltip ricco": "Snackbar and rich tooltip radius",
  "Raggruppa azioni correlate con roving tabindex, orizzontale o verticale.":
    "Groups related actions with roving tabindex, horizontal or vertical.",
  "Rail compresso o espanso per la navigazione laterale.":
    "Collapsed or expanded rail for side navigation.",
  "Regione": "Region",
  "Regola colori, forma e tipografia. Le modifiche si applicano a tutti i componenti e al sito, separatamente per tema chiaro e scuro.":
    "Adjust colors, shape and typography. Changes apply to all components and to the site, separately for the light and dark themes.",
  "Regole": "Rules",
  "Reimposta dettaglio": "Reset detail",
  "Reimposta misure": "Reset measurements",
  "Reimposta parametri": "Reset parameters",
  "Reimposta tema": "Reset theme",
  "Reset": "Reset",
  "Rete senza fili.": "Wireless network.",
  "Ricerca con suggerimenti filtrabili, combobox ARIA e area risultati.":
    "Search with filterable suggestions, ARIA combobox and results area.",
  "Riflessa": "Reflects",
  "Riflesso e galleggiamento": "Highlight and floating",
  "Raggio d'angolo del controllo: l'arco del riflesso all'hover lo segue":
    "Control corner radius: the hover arc follows it",
  "Distanza del riflesso dal bordo del controllo":
    "Gap between the reflection and the control border",
  "Riflesso netto in alto a destra, sul FAB e sulle superfici in rilievo":
    "Crisp highlight at the top right, on the FAB and on raised surfaces",
  "Distanza del riflesso dall'angolo: uguale al border-radius della superficie":
    "Gap between the highlight and the corner: match the border-radius of the surface",
  "Larghezza del riflesso; l'altezza vale 0,62 di questa misura":
    "Highlight width; the height is 0.62 of it",
  "Righe": "Rows",
  "Righe con icone, testo di supporto, link, espansione e selezione singola o multipla.":
    "Rows with icons, supporting text, links, expansion and single or multiple selection.",
  "Rilascio": "Release",
  "Rimovibile": "Removable",
  "Rimuovi Preferiti": "Remove Favorites",
  "Rinomina": "Rename",
  "Ripeti": "Redo",
  "Ritardo suggerimenti (ms)": "Suggestion delay (ms)",
  "Ruota le tinte di secondary e tertiary in modo marcato rispetto al seme.":
    "Rotates the secondary and tertiary hues sharply away from the seed.",
  "Salva": "Save",
  "Salva bozza": "Save draft",
  "Salva una copia": "Save a copy",
  "Salvato.": "Saved.",
  "Scala delle forme": "Shape scale",
  "Scarica": "Download",
  "Scarica CSS": "Download CSS",
  "Scarica JSON": "Download JSON",
  "Scegli i filtri da applicare.": "Choose the filters to apply.",
  "Scegli un colore qualsiasi": "Pick any color",
  "Scegli una regione": "Choose a region",
  "Scelta singola in un gruppo con navigazione da tastiera.":
    "Single choice within a group, with keyboard navigation.",
  "Scelta singola su option e optgroup native, con menu Material, stato di errore e campo filled o outlined.":
    "Single choice over native option and optgroup, with Material menu, error state and filled or outlined field.",
  "Scheda di esempio": "Sample card",
  "Schema colore": "Color scheme",
  "Schiuma · superficie": "Foam · surface",
  "Scoppio · accento": "Pop · accent",
  "Scorciatoia da tastiera": "Keyboard shortcut",
  "Scorrevoli": "Scrollable",
  "Scorso": "Scrolled",
  "Scrivi una città": "Type a city",
  "Se conosci M3, conosci già Bolle.":
    "If you know M3, you already know Bolle.",
  "Secondary e tertiary accanto al seme (−30° e +30°).":
    "Secondary and tertiary next to the seed (−30° and +30°).",
  "Secondary e tertiary sul lato opposto della ruota (+180°).":
    "Secondary and tertiary on the opposite side of the wheel (+180°).",
  "Segmenti": "Segments",
  "Segnaposto": "Placeholder",
  "Selezionata": "Selected",
  "Selezionato": "Selected",
  "Selezione": "Selection",
  "Selezione binaria con stato indeterminato, errore e testo di supporto.":
    "Binary selection with indeterminate state, error and supporting text.",
  "Selezione multipla": "Multiple selection",
  "Senza animazione": "No animation",
  "Separatore orizzontale o verticale, con inset e modalità decorativa.":
    "Horizontal or vertical separator, with inset and decorative mode.",
  "Sequenza di slide con controlli, contatore e varianti hero, multi-browse e full-screen.":
    "Sequence of slides with controls, counter and hero, multi-browse and full-screen variants.",
  "Set colore": "Color set",
  "Settimana": "Week",
  "Sezioni": "Sections",
  "Sezioni della pagina": "Page sections",
  "Sfocatura dello sfondo": "Background blur",
  "Sinistra": "Left",
  "Snackbar · card": "Snackbar · card",
  "Snackbar, FAB": "Snackbar, FAB",
  "Soffia la tua prima interfaccia.": "Blow your first interface.",
  "Sola lettura": "Read-only",
  "Solo gli strati sospesi sono traslucidi: menu e azioni del FAB. Sotto c'è sempre una versione opaca di riserva, che si attiva se il browser non supporta backdrop-filter, sui dispositivi lenti e con prefers-reduced-transparency.":
    "Only floating layers are translucent: menus and FAB actions. Underneath there is always an opaque fallback, used when the browser doesn't support backdrop-filter, on slow devices and with prefers-reduced-transparency.",
  "Solo grigi: il seme non conta.": "Greys only: the seed doesn't matter.",
  "Solo punto": "Dot only",
  "Sotto c'è Material 3, al completo. Sopra, tre regole applicate con coerenza a ogni componente.":
    "Underneath is Material 3, complete. On top, three rules applied consistently to every component.",
  "Sottolineato": "Underline",
  "Sottotitolo": "Subtitle",
  "Spessore dell'anello pellicola": "Film ring thickness",
  "Sposta in…": "Move to…",
  "Staccato": "Detached",
  "Standard": "Standard",
  "Stessi nomi dei componenti, stessi token di colore e tipografia. Il carattere passa da pochi token in più, che puoi regolare o spegnere.":
    "Same component names, same color and typography tokens. The character comes from a few extra tokens that you can tune or turn off.",
  "Sticky": "Sticky",
  "Stile bottoni": "Button style",
  "Su dispositivi lenti si spengono sfocatura e filtro goccia.":
    "On slow devices, blur and the goo filter are turned off.",
  "Successivo": "Next",
  "Successivo: {name}": "Next: {name}",
  "Suffisso": "Suffix",
  "Suggerimenti": "Suggestions",
  "Suggerimenti fra le città servite.": "Suggestions from the cities we serve.",
  "Superfici": "Surfaces",
  "Superficie": "Surface",
  "Superficie per contenuto correlato, con media, orientamento e varianti di elevazione.":
    "Surface for related content, with media, orientation and elevation variants.",
  "Supporto e limiti": "Support and limits",
  "Tab primari o secondari, attivazione automatica o manuale, anche scorrevoli.":
    "Primary or secondary tabs, automatic or manual activation, optionally scrollable.",
  "Tavolozza": "Palette",
  "Tema": "Theme",
  "Tema chiaro": "Light theme",
  "Tema e token": "Theme and tokens",
  "Tema scuro": "Dark theme",
  "Tema {name}": "{name} theme",
  "Temi": "Themes",
  "Template": "Template",
  "Testi ed etichette": "Text and labels",
  "Testo di aiuto su hover e focus, semplice o con contenuto ricco.":
    "Help text on hover and focus, plain or with rich content.",
  "Testo di esempio per valutare carattere, interlinea e colore su una superficie reale.":
    "Sample text to judge typeface, line height and color on a real surface.",
  "Testo di supporto": "Supporting text",
  "Testo e controlli": "Text and controls",
  "Testo · {font} · {size}px": "Text · {font} · {size}px",
  "Tinte (Material)": "Tinted (Material)",
  "Tinte ruotate e giocose per tutti gli accenti.":
    "Rotated, playful hues for every accent.",
  "Tipo": "Type",
  "Tipografia": "Typography",
  "Titoli · {font}": "Headings · {font}",
  "Titolo": "Title",
  "Titolo di sezione": "Section title",
  "Toggle": "Toggle",
  "Token": "Token",
  "Token applicati": "Applied tokens",
  "Token del componente": "Component tokens",
  "Token importati: {count} valori": "Imported tokens: {count} values",
  "Toni {name}": "{name} tones",
  "Tre gesti che rendono una bolla una bolla.":
    "Three gestures that make a bubble a bubble.",
  "Tre tinte equidistanti (+120° e +240°).":
    "Three evenly spaced hues (+120° and +240°).",
  "Tre vincoli tengono insieme carattere e accessibilità.":
    "Three constraints hold character and accessibility together.",
  "Tutta la card porta alla destinazione.":
    "The whole card leads to the destination.",
  "Tutti i componenti di M3. Con più aria dentro.":
    "Every M3 component. With more air inside.",
  "Tutti i componenti →": "All components →",
  "Un gradiente conico tenue ricavato dal colore seed: le quattro tinte ruotano attorno alla sua tonalità, così la pellicola segue il tema dinamico. Si usa con misura: anello di focus dei bottoni e del FAB, stato selezionato. I chip restano sul solo contorno pieno, perché a quella dimensione l'anello cade fuori dal controllo e si legge come un difetto. Una sola superficie iridescente per schermata, mai come sfondo.":
    "A soft conic gradient derived from the seed colour: the four hues rotate around its hue, so the film follows the dynamic theme. Use it sparingly: focus ring on buttons and the FAB, selected state. Chips keep the solid outline only, because at that size the ring falls outside the control and reads as a defect. One iridescent surface per screen, never as a background.",
  "Un'iridescenza che deriva dal tuo colore seed e compare solo dove conta: focus, selezione, l'azione principale.":
    "An iridescence derived from your seed color that appears only where it matters: focus, selection, the main action.",
  "Una dialog che galleggia": "A floating dialog",
  "Una superficie dentro un'altra prende il raggio del contenitore meno il padding che il contenitore applica, con un minimo di 2px. Il contenitore lo pubblica in --bb-inset-radius e la superficie interna lo eredita: card dentro dialog, fogli o altre card, media nelle card, voci nei menu e campi nei picker.":
    "A surface inside another takes the container radius minus the padding the container applies, never below 2px. The container publishes it as --bb-inset-radius and the inner surface inherits it: a card inside a dialog, a sheet or another card, media inside cards, menu items and picker fields.",
  "Usa": "Use",
  "Usa #RGB o #RRGGBB": "Use #RGB or #RRGGBB",
  "Usa modello": "Use template",
  "Useremo questo indirizzo per le notifiche.":
    "We'll use this address for notifications.",
  "Uso": "Usage",
  "Valore": "Value",
  "Valore di {token}": "Value of {token}",
  "Valore di {token} in pixel": "Value of {token} in pixels",
  "Valore massimo (range)": "Maximum value (range)",
  "Variante": "Variant",
  "Ricerca": "Search",
  "Varianti": "Variants",
  "Velatura al 30% per il FAB": "30% scrim for the FAB",
  "Verifica del contrasto": "Contrast check",
  "Verifica la resa da destra a sinistra con il pulsante {rtl} nella barra in alto.":
    "Check the right-to-left rendering with the {rtl} button in the top bar.",
  "Verticale": "Vertical",
  "Vetro": "Glass",
  "Viola": "Violet",
  "Vista": "View",
  "Volume": "Volume",
  "bolle · Interfacce con tensione superficiale":
    "bolle · Interfaces with surface tension",
  "bolle, presentazione": "bolle, presentation",
  "contrasti dei ruoli tonali M3, focus sempre visibile.":
    "M3 tonal role contrast, focus always visible.",
  "cresce del 5% e sfuma in {duration}": "grows by 5% and fades in {duration}",
  "default {value}": "default {value}",
  "le dialog oscillano di {distance} ogni {duration}":
    "dialogs bob by {distance} every {duration}",
  "nei pulsanti segmentati l'indicatore scorre come una goccia":
    "in segmented buttons the indicator slides like a drop",
  "no": "no",
  "non dichiarato": "not declared",
  "prefers-reduced-motion spegne dondolio e scoppio.":
    "prefers-reduced-motion turns off wobble and pop.",
  "prima": "before",
  "scala {scale} in {duration}": "scale {scale} in {duration}",
  "sfocature e trasparenze si disattivano su dispositivi lenti.":
    "blur and transparency are turned off on slow devices.",
  "si gonfia dall'angolo a coda in {duration}":
    "inflates from the tail corner in {duration}",
  "solo JS": "JS only",
  "sotto {min}:1": "below {min}:1",
  "sì": "yes",
  "{changed} di {total} ruoli cambiati nell'ultima operazione: a sinistra il colore precedente.":
    "{changed} of {total} roles changed in the last operation: the previous color is on the left.",
  "{compact} porta a tre quarti spaziature e dimensioni dei componenti; i token ridotti escono con l'esportazione e si attivano con {attr}.":
    "{compact} scales component spacing and sizes to three quarters; the scaled tokens are part of the export and turn on with {attr}.",
  "{name} · ispirata a Material 3, non affiliata a Google.":
    "{name} · inspired by Material 3, not affiliated with Google.",
  "{n} componenti": "{n} components",
  "{n} proprietà": "{n} properties",
  "{region} (non disponibile)": "{region} (not available)",
  "{total} ruoli. Dopo una generazione i ruoli cambiati mostrano il colore precedente accanto al nuovo.":
    "{total} roles. After a generation, changed roles show the previous color next to the new one.",
  "| Proprietà | Attributo | Tipo | Default | Riflessa |":
    "| Property | Attribute | Type | Default | Reflects |",
  "Con {token} restano solo le dissolvenze: niente dondolio, scoppio né galleggiamento.":
    "With {token} only fades remain: no wobble, pop or floating.",
  "ritorno con {token}": "return with {token}",
  "Panoramica dei componenti": "Components overview",
  "Esporta": "Export",
  "Importa": "Import",
  "Trascina qui un file .json o .css": "Drop a .json or .css file here",
  "Scegli file": "Choose file",
  "Amministrazione": "Administration",
  "Anagrafiche": "Directory",
  "Articoli": "Items",
  "Attive": "Active",
  "Cantieri edili": "Building sites",
  "Chiuse": "Closed",
  "Commesse": "Jobs",
  "Compressa": "Collapsed",
  "Cruscotto": "Dashboard",
  "Fatture": "Invoices",
  "Impianti elettrici e termici": "Electrical and heating systems",
  "In attesa di avvio": "Awaiting start",
  "Intestazione": "Header",
  "Inventario": "Stocktake",
  "Magazzino": "Warehouse",
  "Manutenzione straordinaria": "Extraordinary maintenance",
  "Manutenzioni": "Maintenance",
  "Movimenti di carico e scarico": "Goods in and out",
  "Navigazione di un'applicazione gestionale: albero fino a tre livelli, filtro, contatori, rail compatta e larghezza regolabile.":
    "Navigation for a management application: a tree up to three levels deep, filter, counters, compact rail and adjustable width.",
  "Programmate": "Scheduled",
  "Scadenzario pagamenti": "Payment schedule",
  "Storico interventi": "Service history",
  "Aggiunta rapida": "Quick add",
  "Archivia la scheda": "Archive the card",
  "Board a colonne di schede: spostamento tra colonne e riordino, corsie, colonne comprimibili, limiti WIP segnalati e stato di carico, errore e board vuota.":
    "Column board of cards: moving between columns and reordering, lanes, collapsible columns, reported WIP limits and the loading, error and empty board states.",
  "Chiuso": "Closed",
  "Collaudo": "Handover",
  "Colonna": "Column",
  "Colonne comprimibili": "Collapsible columns",
  "Corsie": "Lanes",
  "Da assegnare": "To be assigned",
  "Duplica la scheda": "Duplicate the card",
  "In corso": "In progress",
  "Nuova commessa · da assegnare": "New job · to be assigned",
  "Nuova scheda": "New card",
  "Ordina per scadenza": "Sort by due date",
  "Per passare in Chiuso l'avanzamento deve essere al 100%.":
    "A job moves to Closed only at 100% progress.",
  "Programmato": "Scheduled",
  "Trascinamento": "Dragging",
  "Una commessa chiusa non si riapre dal kanban.":
    "A closed job does not reopen from the board.",
  "Una commessa già avanzata non torna in cantiere senza un verbale.":
    "A job already under way does not return to the site without a signed report.",
  "in ritardo": "late",
  "Altro": "More",
  "Azioni della schermata": "Screen actions",
  "Cancella i filtri": "Clear the filters",
  "Con immagine": "With an image",
  "Contenitore in fondo alla schermata: azioni, uno spazio per il pulsante principale e una forma piana o staccata dal bordo.":
    "Container at the bottom of the screen: actions, a place for the primary button and a form that sits on the edge or detaches from it.",
  "Controllo delle pagine di un elenco che resta all'applicazione: intervallo, pagine numerate, frecce e righe per pagina.":
    "Page control for a list the application owns: range, numbered pages, arrows and rows per page.",
  "Indietro": "Back",
  "La barra non conosce l'applicazione: riceve le azioni negli slot e lascia al contenitore decidere cosa mostrare. Con dock il pulsante flottante esce dal bordo superiore e la barra resta un riferimento stabile mentre il contenuto scorre, se è sticky.":
    "The bar knows nothing about the application: it receives the actions in its slots and lets the container decide what to show. With dock the floating button leaves the top edge, and a sticky bar stays a stable reference while the content scrolls.",
  "Le commesse archiviate non compaiono qui. Cambia i filtri o creane una nuova.":
    "Archived jobs do not appear here. Change the filters or create a new one.",
  "Le iniziali si ricavano dal nome quando non sono date, e restano leggibili anche in una lingua senza spazi. Se l'immagine non si carica, l'avatar ricade sulle iniziali senza lasciare un riquadro vuoto. Lo slot icon sostituisce il contenuto e lo slot badge aggiunge un contatore.":
    "The initials come from the name when they are not given, and stay readable in a language without spaces too. If the image fails to load, the avatar falls back to the initials instead of leaving an empty box. The icon slot replaces the content and the badge slot adds a counter.",
  "Linea superiore": "Top line",
  "Nessuna commessa da mostrare": "No jobs to show",
  "Nuova commessa": "New job",
  "Pagina": "Page",
  "Pagine": "Pages",
  "Pulsante agganciato": "Docked button",
  "Righe in totale": "Rows in total",
  "Scelta delle righe": "Row choice",
  "Segno di identità di una persona o di un ente: immagine, iniziali o icona, con un indicatore di stato.":
    "Identity mark of a person or an entity: image, initials or icon, with a status indicator.",
  "Superficie da mostrare quando un contenitore non ha nulla da disegnare: icona, titolo, una riga di testo e le azioni che ne escono.":
    "Surface to show when a container has nothing to draw: icon, title, one line of text and the actions that leave the state.",
  "Testo": "Text",
  "Tono": "Tone",
  "Un solo componente per il vuoto e per l'errore: il tono error colora l'icona con il ruolo d'errore e, con role alert, la regione viene annunciata appena compare. Con align start il testo e le azioni si allineano al bordo, come dentro una tabella.":
    "One component for both the empty and the error case: the error tone paints the icon with the error role and, with role alert, the region is announced as soon as it appears. With align start the text and the actions sit on the edge, as inside a table.",
  "righe": "rows",
  "righe in totale": "rows in total",
  "Componente": "Component",
  "Matrice degli stati": "State matrix",
  "Ogni cella riporta la proprietà pubblica che espone lo stato; il trattino indica che il componente non ha quello stato. {covered} componenti su {total} ne espongono almeno uno. Gli stati di interazione — hover, focus visibile e premuto — arrivano dal livello di stato condiviso di ogni superficie azionabile.":
    "Each cell names the public property that exposes the state; a dash means the component has no such state. {covered} of {total} components expose at least one. Interaction states — hover, focus-visible and pressed — come from the shared state layer of every actionable surface.",
  "Filtro interno": "Built-in filter",
  "Indicatore Morph con le bolle, con la sequenza di sette forme o dentro un contenitore.":
    "Morph indicator with bubbles, with the seven-shape sequence or inside a container.",
  "Avatar visibili": "Visible avatars",
  "Contatore premibile": "Clickable counter",
  "Il gruppo dispone gli avatar che riceve e non conosce le persone: con max nasconde i successivi e somma nel contatore anche quelle non passate come avatar, dichiarate con total. Il contatore è una semplice somma, oppure un pulsante con interactive che chiede l'elenco completo con avatar-group-select. L'anello del colore di fondo stacca un avatar dal successivo.":
    "The group lays out the avatars it receives and knows nothing about the people: with max it hides the rest and adds the people not passed as avatars, declared with total, to the counter. The counter is a plain sum, or a button with interactive that asks for the full list through avatar-group-select. A ring of the background colour separates one avatar from the next.",
  "Le briciole non navigano da sole: ricevono i livelli con href e segnalano con breadcrumb-select quello scelto, così l'applicazione decide se cambiare rotta. Con max-items il percorso mostra il primo livello, un pulsante con i puntini e gli ultimi livelli; il pulsante apre il percorso completo. Il separatore a chevron si specchia in una lingua da destra a sinistra.":
    "The breadcrumb never navigates on its own: it receives the levels with an href and reports the chosen one with breadcrumb-select, so the application decides whether to change route. With max-items the path shows the first level, a button with a gap and the last levels; the button opens the full path. The chevron separator mirrors in a right-to-left language.",
  "Livelli": "Levels",
  "Livelli visibili": "Visible levels",
  "Partecipanti": "Participants",
  "Percorso dalla radice dell'applicazione alla pagina aperta: livelli dell'applicazione, livello corrente non collegato, percorso lungo raccorciato.":
    "Path from the root of the application to the open page: levels declared by the application, the current level not linked, a long path shortened.",
  "Persone mostrate come avatar sovrapposti, con un contatore per quelle che non entrano nello spazio.":
    "People shown as overlapping avatars, with a counter for those that do not fit.",
  "Persone totali": "People in total",
  "Separatore": "Separator",
  "Sopralluogo": "Site visit of 12 November",
  "Sovrapposizione": "Overlap",
  "Verbali": "Site visit reports",
  "Attività figlie": "Child tasks",
  "Chiudi il dettaglio": "Close the detail",
  "Consegna lavori": "Handover",
  "Dipendenze": "Dependencies",
  "Durata": "Duration",
  "Fase": "Phase",
  "Fine": "End",
  "Giulia Ferraro": "Giulia Ferraro",
  "Inizio": "Start",
  "Non si sposta un'attività prima del": "A task cannot be moved before",
  "Pianificazione lavori": "Work plan",
  "Piano approvato": "Approved plan",
  "Predecessori": "Predecessors",
  "Provincia di Brescia": "Province of Brescia",
  "Rifacimento impianto elettrico": "Electrical system renewal",
  "Scala": "Scale",
  "Una scadenza non cade di sabato o domenica.":
    "A deadline cannot fall on a Saturday or a Sunday.",
  "giorni": "days",
  "giorno": "day",
  "milestone": "milestone",
  "nessuno": "none",
  "Piano a barre su un asse temporale: quattro scale, riepiloghi e milestone, dipendenze, piano approvato, carico per responsabile, colonne regolabili e modifica da puntatore o da tastiera.":
    "Bar chart on a time axis: four scales, summaries and milestones, dependencies, approved plan, workload per owner, adjustable columns and changes by pointer or keyboard.",
  "Ordinamento e paginazione": "Sorting and paging",
  "Con page-size maggiore di zero la tabella pagina da sé le righe che ha già e mostra il pager. Con pageHandler la pagina richiesta arriva all'applicazione, che ricarica la fetta di righe e il totale.":
    "With page-size above zero the table pages the rows it holds and shows the pager. With pageHandler the requested page reaches the application, which loads the slice of rows and the total.",
  "Fissa l'ordine iniziale, con l'icona già accesa.":
    "Sets the initial order, with the header icon already on.",
  "La tabella ordina e pagina le righe che riceve: un clic sull'intestazione va prima crescente e poi decrescente, e page-size da solo accende il pager.":
    "The table sorts and pages the rows it receives: a header click goes ascending then descending, and page-size alone turns the pager on.",
  "Ordina e pagina da sola: l'applicazione non taglia né riordina nulla.":
    "It sorts and pages on its own: the application neither slices nor reorders anything.",
  "Riceve l'ordine richiesto e la tabella ridisegna dopo la promessa.":
    "Receives the requested order; the table redraws once the promise settles.",
  "Riceve pagina e dimensione e la tabella ridisegna dopo la promessa.":
    "Receives the page and its size; the table redraws once the promise settles.",
  "Un clic sull'intestazione ordina da sola: prima crescente, poi decrescente. Con sortHandler la richiesta arriva all'applicazione, che ricarica le righe, e la tabella si ridisegna quando la promessa è risolta.":
    "A header click sorts on its own: ascending first, then descending. With sortHandler the request reaches the application, which loads the rows again, and the table redraws once the promise settles.",
  "fissa l'ordine iniziale": "sets the initial order",
  "riceve l'ordine, la tabella ridisegna dopo la promessa":
    "receives the order; the table redraws once the promise settles",
  "riceve pagina e dimensione, la tabella ridisegna dopo la promessa":
    "receives the page and its size; the table redraws once the promise settles",
  "Il componente chiama detail con la riga aperta e inserisce il risultato sotto di essa. La riga si apre e si chiude da sola: expand riporta solo quali righe sono aperte.":
    "The component calls detail with the open row and places the result under it. The row opens and closes on its own: expand only reports which rows are open.",
  "La tabella applica selezione, apertura riga, raggruppamento e cambi di colonna da sé: gli eventi li riportano soltanto.":
    "The table applies selection, row expansion, grouping and column changes on its own: the events only report them.",
  "La tabella ordina e pagina le righe che riceve: un clic sull'intestazione va prima crescente e poi decrescente, e page-size da solo accende il pager. Selezione, apertura riga, raggruppamento e cambi di colonna li applica lei, e gli eventi li riportano. sortHandler, pageHandler e columnHandler servono solo quando i dati stanno altrove: ricevono la richiesta e la tabella ridisegna quando la promessa è risolta.":
    "The table sorts and pages the rows it receives: a header click goes ascending then descending, and page-size alone turns the pager on. Selection, row expansion, grouping and column changes are applied by the table, and the events report them. sortHandler, pageHandler and columnHandler are needed only when the data lives elsewhere: they receive the request and the table redraws once the promise settles.",
  "Riceve l'elenco delle colonne dopo ogni modifica, per conservarlo altrove.":
    "Receives the column list after every change, to store it elsewhere.",
  "la tabella applica selezione, apertura riga, raggruppamento e cambi di colonna da sé: gli eventi li riportano soltanto":
    "the table applies selection, row expansion, grouping and column changes on its own: the events only report them",
  "pinned tiene la colonna ferma durante lo scorrimento orizzontale, width fissa la larghezza iniziale, hidden la nasconde, sortable a false toglie l'ordinamento. Fissare, nascondere, riordinare e ridimensionare lo fa la tabella: column-change riporta il nuovo elenco e columnHandler lo salva dove serve.":
    "pinned keeps the column fixed while scrolling horizontally, width sets the starting width, hidden hides it, sortable false removes the sorting. Pinning, hiding, reordering and resizing are done by the table: column-change reports the new list and columnHandler stores it where needed.",
  "riceve l'elenco delle colonne dopo ogni modifica, per conservarlo altrove":
    "receives the column list after every change, to store it elsewhere",
  "selectable mostra la casella su ogni riga e nell'intestazione. La selezione la tiene la tabella: l'evento select riporta gli identificatori scelti e le righe corrispondenti, senza che l'applicazione debba riscriverli.":
    "selectable shows the checkbox on every row and in the header. The table keeps the selection: the select event reports the chosen identifiers and the matching rows, without the application having to write them back.",
  "Il piano sposta l'attività da sé e riporta il cambio con task-change; il rifiuto arriva con task-change-blocked applicando la regola che l'applicazione passa in restrict, e l'apertura con task-open. Le righe sono virtualizzate, la colonna della griglia resta ferma in orizzontale e l'intestazione del tempo resta ferma in alto. L'altezza del host è obbligatoria.":
    "The plan moves the task on its own and reports the change with task-change; a refusal arrives with task-change-blocked applying the rule the application passes in restrict, and opening with task-open. Rows are virtualised, the grid column stays fixed horizontally and the time header stays fixed at the top. The host needs a height.",
  "La board sposta la scheda da sé e riporta il cambio con card-move; dove può andare lo decide la regola che l'applicazione passa in restrict, e il rifiuto arriva con card-move-blocked. Lo scorrimento verticale è della colonna, non della board; il trascinamento ha la copia che segue il puntatore, il segnaposto e lo scorrimento automatico ai bordi. La scheda si sposta anche con Alt e le frecce dalla maniglia.":
    "The board moves the card on its own and reports the change with card-move; where it may go is decided by the rule the application passes in restrict, and a refusal arrives with card-move-blocked. Vertical scrolling belongs to the column, not to the board; dragging has the copy that follows the pointer, the placeholder and automatic scrolling at the edges. The card also moves with Alt and the arrows from the grip.",
  "La paginazione si sposta da sé alla pagina richiesta e riporta il cambio con page-change: il totale lo riceve, i dati non li taglia. La finestra delle pagine numerate lascia sempre raggiungibili la prima e l'ultima, e sotto i 560px di spazio il numero della pagina prende il posto dell'elenco; con form compact restano intervallo e frecce.":
    "The pagination moves to the requested page on its own and reports the change with page-change: it receives the total and never slices the data. The numbered window keeps the first and the last page reachable, and below 560px of room the page number takes the place of the list; form compact keeps the range and the arrows.",
  "La tabella ordina e pagina da sé le righe che riceve, applica selezione, apertura riga, raggruppamento e cambi di colonna, e cede il caricamento all'applicazione solo quando le si passano sortHandler, pageHandler e columnHandler. L'intestazione resta ferma, le colonne fissate restano visibili mentre scorri e le righe si aprono con un dettaglio.":
    "The table sorts and pages the rows it receives on its own, applies selection, row expansion, grouping and column changes, and hands loading over to the application only when sortHandler, pageHandler and columnHandler are passed in. The header stays fixed, pinned columns stay visible while you scroll and rows open with a detail.",
  "Piano minimo": "Minimal plan",
  "Il piano disegna le attività sull'asse del tempo: parent costruisce l'albero e una attività con figli diventa una barra di riepilogo. L'altezza del host è obbligatoria, perché la superficie riempie lo spazio che riceve.":
    "The plan draws the tasks on the time axis: parent builds the tree and a task with children becomes a summary bar. The host needs a height, because the surface fills the space it receives.",
  "Colonne e contenuto delle celle": "Columns and cell content",
  "columns sceglie le colonne della griglia: le chiavi note (code, name, resource, start, end, duration, progress, deps) hanno già il loro contenuto, una chiave nuova prende render e riceve l'attività. Le regole CSS del markup passano da contentStyles, perché gira dentro lo shadow root del piano.":
    "columns chooses the grid columns: the known keys (code, name, resource, start, end, duration, progress, deps) already have their content, and a new key takes render and receives the task. The CSS of that markup goes through contentStyles, because it runs inside the chart shadow root.",
  "Spostare e ridimensionare": "Moving and resizing",
  "editable abilita il trascinamento, le maniglie ai lati e le frecce con Alt. restrict decide se lo spostamento è ammesso e il rifiuto arriva con task-change-blocked. Il piano applica lo spostamento da sé e lo riporta con task-change: qui lo si conserva.":
    "editable enables dragging, the handles at the sides and the arrow keys with Alt. restrict decides whether the move is allowed and a refusal arrives with task-change-blocked. The plan applies the move on its own and reports it with task-change: here it is stored.",
  "Contenuto della barra": "Bar content",
  "barRenderer sostituisce quello che la barra mostra: riceve l'attività, il piano e l'intervallo calcolato, che per una attività con figli è il riepilogo dei discendenti. Serve per badge, percentuali e icone; le regole CSS vanno in contentStyles.":
    "barRenderer replaces what the bar shows: it receives the task, the chart and the computed span, which for a task with children is the rollup of its descendants. Use it for badges, percentages and icons; its CSS goes in contentStyles.",
  "Stati e slot": "States and slots",
  "loading, error ed empty prendono il posto delle righe. Gli slot loading, error ed empty li sostituiscono con il contenuto dell'applicazione: un pulsante che ricrea il piano, un comando di ricarica o un'azione per aggiungere la prima attività.":
    "loading, error and empty take the place of the rows. The loading, error and empty slots replace them with the application content: a button that builds the plan again, a reload command or an action that adds the first task.",
  "Aggiunge azioni dentro lo stato vuoto predefinito.":
    "Adds actions inside the built-in empty state.",
  "Aggiunge un'area sopra la tabella, fuori dal riquadro.":
    "Adds an area above the table, outside the frame.",
  "Area che riceve lo scorrimento verticale e orizzontale.":
    "Area that takes the vertical and horizontal scrolling.",
  "Area del riepilogo di gruppo.": "Area of the group summary.",
  "Area della paginazione.": "Area of the pagination.",
  "Area espansa sotto la riga.": "Expanded area under the row.",
  "Cella dati.": "Data cell.",
  "Contenitore esterno della tabella.": "Outer container of the table.",
  "Controllo separatore della larghezza colonna.":
    "Separator control for the column width.",
  "Il contenuto delle celle non passa dagli slot: il componente chiama column.render, rowRenderer, detail e groupSummary. Gli slot coprono le aree esterne alla tabella.":
    "Cell content does not go through slots: the component calls column.render, rowRenderer, detail and groupSummary. The slots cover the areas outside the table.",
  "Il contenuto delle righe non passa dagli slot: il componente chiama column.render per una cella e barRenderer per la barra, e groupLabel per il nome di un gruppo. Gli slot coprono gli stati, quando al posto delle righe non c'è nulla da mostrare.":
    "Row content does not go through slots: the component calls column.render for a cell, barRenderer for the bar and groupLabel for a group name. The slots cover the states, when there are no rows to show.",
  "Intestazione della tabella.": "Header of the table.",
  "Pulsante che attiva l'ordinamento.": "Button that turns sorting on.",
  "Riga dati.": "Data row.",
  "Riga di raggruppamento.": "Grouping row.",
  "Riquadro dello stato di caricamento.": "Box of the loading state.",
  "Riquadro dello stato di errore.": "Box of the error state.",
  "Riquadro dello stato vuoto.": "Box of the empty state.",
  "Singola cella di intestazione.": "Single header cell.",
  "Sostituisce interamente lo stato vuoto.": "Replaces the whole empty state.",
  "Sostituisce la paginazione predefinita.":
    "Replaces the built-in pagination.",
  "Sostituisce lo stato mostrato durante il caricamento iniziale.":
    "Replaces the state shown during the initial load.",
  "Sostituisce lo stato mostrato mentre loading è attivo.":
    "Replaces the state shown while loading is on.",
  "Sostituisce lo stato mostrato quando error contiene un messaggio.":
    "Replaces the state shown when error holds a message.",
  "Sostituisce lo stato mostrato quando non ci sono attività.":
    "Replaces the state shown when there are no tasks.",
  "Stato di caricamento.": "Loading state.",
  "Stato di errore.": "Error state.",
  "Stato vuoto.": "Empty state.",
  "Albero della navigazione.": "Navigation tree.",
  "Area che riceve i comandi esterni.":
    "Area that takes the external commands.",
  "Area che riceve lo scorrimento.": "Area that takes the scrolling.",
  "Area dei risultati della ricerca.": "Area of the search results.",
  "Area del calendario.": "Area of the calendar.",
  "Area del carosello.": "Area of the carousel.",
  "Area del testo di supporto.": "Area of the supporting text.",
  "Area di scrittura.": "Writing area.",
  "Area di stato dell'impalcatura.": "Status area of the shell.",
  "Area di stato.": "Status area.",
  "Area finale dell'elemento.": "End area of the item.",
  "Area inferiore dell'impalcatura.": "Lower area of the shell.",
  "Area iniziale dell'elemento.": "Start area of the item.",
  "Area sopra il contenuto, fuori dal riquadro.":
    "Area above the content, outside the frame.",
  "Area sotto il contenuto.": "Area under the content.",
  "Avanzamento dell'attività.": "Progress of the task.",
  "Avatar mostrato accanto al testo.": "Avatar shown next to the text.",
  "Barra dei comandi.": "Command bar.",
  "Barra dell'applicazione.": "Application bar.",
  "Barra di navigazione.": "Navigation bar.",
  "Barra inferiore dell'impalcatura.": "Bottom bar of the shell.",
  "Barra stretta della navigazione.": "Narrow navigation bar.",
  "Barra stretta di navigazione.": "Narrow navigation bar.",
  "Barra superiore dell'impalcatura.": "Top bar of the shell.",
  "Binario del cursore.": "Slider track.",
  "Binario su cui scorre l'indicatore.": "Track the indicator runs on.",
  "Blocco del titolo e del sottotitolo.": "Block of the title and subtitle.",
  "Bolla visibile della superficie.": "Visible bubble of the surface.",
  "Campo dei minuti.": "Minutes field.",
  "Campo delle ore.": "Hours field.",
  "Campo di filtro.": "Filter field.",
  "Campo di ricerca.": "Search field.",
  "Campo o comando che filtra il contenuto.":
    "Field or command that filters the content.",
  "Cella che contiene il dettaglio.": "Cell that holds the detail.",
  "Cella dei comandi di riga.": "Cell of the row commands.",
  "Cella del comando di apertura.": "Cell of the opening command.",
  "Cella della casella di selezione.": "Cell of the selection box.",
  "Cella di dati.": "Data cell.",
  "Colonna della board.": "Column of the board.",
  "Comandi del pannello di supporto.": "Commands of the supporting panel.",
  "Comandi di avanzamento del contenuto.": "Commands that move the content.",
  "Comandi in coda all'area o sotto il contenuto.":
    "Commands at the end of the area or under the content.",
  "Comando associato al contenuto.": "Command attached to the content.",
  "Comando che apre e chiude il gruppo.":
    "Command that opens and closes the group.",
  "Comando che apre il sottoelenco.": "Command that opens the sublist.",
  "Comando che chiude la superficie.": "Command that closes the surface.",
  "Comando che chiude senza confermare.":
    "Command that closes without confirming.",
  "Comando che ferma l'operazione.": "Command that stops the operation.",
  "Comando che toglie la pastiglia.": "Command that removes the chip.",
  "Comando del periodo, mattina o pomeriggio.":
    "Period command, morning or afternoon.",
  "Comando di annullamento.": "Cancel command.",
  "Comando di conferma.": "Confirm command.",
  "Conteggio dell'elemento di navigazione.": "Count of the navigation item.",
  "Conteggio mostrato accanto al testo.": "Count shown next to the text.",
  "Contenitore degli elementi.": "Container of the items.",
  "Contenitore dell'impalcatura.": "Container of the shell.",
  "Contenitore della navigazione.": "Container of the navigation.",
  "Contenitore interno del componente.": "Inner container of the component.",
  "Contenuto centrale, quando il componente ne separa uno.":
    "Central content, when the component separates one.",
  "Contenuto del comando che torna indietro.":
    "Content of the backward command.",
  "Contenuto del comando che va avanti.": "Content of the forward command.",
  "Contenuto del componente.": "Content of the component.",
  "Contenuto del dettaglio.": "Content of the detail.",
  "Contenuto dell'area vuota predefinita.":
    "Content of the built-in empty area.",
  "Contenuto dell'elenco.": "Content of the list.",
  "Contenuto della barra dei comandi.": "Content of the command bar.",
  "Contenuto dopo il campo di testo.": "Content after the text field.",
  "Contenuto dopo il testo: icona o valore.":
    "Content after the text: icon or value.",
  "Contenuto dopo il valore.": "Content after the value.",
  "Contenuto interno della riga.": "Inner content of the row.",
  "Contenuto prima del campo di testo.": "Content before the text field.",
  "Contenuto prima del testo: icona o avatar.":
    "Content before the text: icon or avatar.",
  "Contenuto prima del valore.": "Content before the value.",
  "Contenuto principale del componente.": "Main content of the component.",
  "Contenuto scorrevole del corpo.": "Scrolling content of the body.",
  "Controllo nativo che riceve il clic.":
    "Native control that takes the click.",
  "Corpo del componente, sotto l'intestazione.":
    "Body of the component, under the header.",
  "Corpo scorrevole della superficie.": "Scrolling body of the surface.",
  "Corsia della board.": "Lane of the board.",
  "Cursore inferiore dell'intervallo.": "Lower thumb of the range.",
  "Cursore superiore dell'intervallo.": "Upper thumb of the range.",
  "Cursore.": "Thumb.",
  "Destinazione della barra.": "Destination of the bar.",
  "Destinazione della navigazione.": "Destination of the navigation.",
  "Elemento che apre il menu o l'overlay.":
    "Element that opens the menu or the overlay.",
  "Elemento che apre l'overlay.": "Element that opens the overlay.",
  "Elemento della barra stretta.": "Item of the narrow bar.",
  "Elemento della destinazione.": "Item of the destination.",
  "Elenco dei passi.": "List of steps.",
  "Elenco dei risultati.": "List of results.",
  "Elenco dei suggerimenti.": "List of suggestions.",
  "Elenco delle destinazioni.": "List of destinations.",
  "Elenco delle schede.": "List of tabs.",
  "Elenco interno del componente.": "Inner list of the component.",
  "Etichetta del controllo, collegata al campo.":
    "Label of the control, linked to the field.",
  "Etichetta del valore finale di un intervallo.":
    "Label of the final value of a range.",
  "Finestra visibile del contenuto.": "Visible window of the content.",
  "Freccia che indica l'apertura.": "Arrow that tells the area can open.",
  "Freccia del gruppo.": "Arrow of the group.",
  "Freccia dell'elemento di navigazione.": "Arrow of the navigation item.",
  "Goccia che segue il cursore.": "Drop that follows the thumb.",
  "Griglia dei giorni.": "Grid of the days.",
  "Gruppo che tiene insieme gli elementi.":
    "Group that holds the items together.",
  "Gruppo dei pulsanti flottanti.": "Group of the floating buttons.",
  "I passi leggono le voci dalle proprietà e prendono dallo slot label il testo del passo corrente, quando il nome non basta.":
    "The steps read their items from the properties and take the text of the current step from the label slot, when the name is not enough.",
  "Icona che accompagna il contenuto.": "Icon that goes with the content.",
  "Icona del componente.": "Icon of the component.",
  "Icona dell'elemento di navigazione.": "Icon of the navigation item.",
  "Icona dell'elemento stretto.": "Icon of the narrow item.",
  "Icona dell'elemento.": "Icon of the item.",
  "Icona della destinazione.": "Icon of the destination.",
  "Icona della scheda.": "Icon of the tab.",
  "Icona dello stato attivo.": "Icon of the active state.",
  "Icona dello stato inattivo.": "Icon of the inactive state.",
  "Icona finale dell'elemento.": "End icon of the item.",
  "Il badge mostra un conteggio o una parola sopra un altro elemento e prende dallo slot label il testo, quando non vuoi passarlo come proprietà.":
    "The badge shows a count or a word over another element and takes its text from the label slot, when it is not passed as a property.",
  "Il campo con suggerimenti prende dagli slot gli stessi contenuti del campo di testo; l'elenco dei suggerimenti si apre da sé sopra il resto del contenuto.":
    "The field with suggestions takes the same slot content as the text field; the suggestion list opens on its own above the rest of the content.",
  "Il campo di testo prende dallo slot predefinito nulla del contenuto scritto, che resta nell'input, e dagli altri slot l'icona iniziale, il prefisso, il suffisso, il comando finale e il testo di supporto.":
    "The text field takes none of the typed content from the default slot, because it stays in the input, and takes from the other slots the start icon, the prefix, the suffix, the end command and the supporting text.",
  "Il carosello scorre gli elementi che riceve nello slot predefinito e prende dagli slot i comandi di avanzamento, lo stato letto dai lettori di schermo e i controlli aggiuntivi.":
    "The carousel scrolls the items it receives in the default slot and takes from the slots the moving commands, the status read by screen readers and the extra controls.",
  "Il contenuto della navigazione non passa dagli slot: il componente legge items, groups e actions e chiama item e railItem per il contenuto di una voce. Gli slot coprono l'intestazione, il filtro, il piè di pagina e lo stato vuoto.":
    "The navigation content does not go through slots: the component reads items, groups and actions and calls item and railItem for the content of an entry. The slots cover the header, the filter, the footer and the empty state.",
  "Il contenuto di una scheda non passa dagli slot: il componente legge columns e cards e chiama card per il contenuto della scheda. Gli slot coprono gli stati, quando al posto della board non c'è nulla da mostrare.":
    "The content of a card does not go through slots: the component reads columns and cards and calls card for the card content. The slots cover the states, when there is nothing to show instead of the board.",
  "Il controllo a segmenti legge le voci dalle proprietà e non ha slot: label resta la legenda del gruppo, e con multiple la scelta ammette più segmenti.":
    "The segmented control reads its items from the properties and has no slots: label stays the legend of the group, and multiple allows more than one segment.",
  "Il cursore prende dagli slot l'icona alle due estremità, l'etichetta e il valore mostrato; con range mostra due cursori e riporta entrambi i valori.":
    "The slider takes from the slots the icon at each end, the label and the shown value; with range it shows two thumbs and reports both values.",
  "Il dialogo prende dallo slot predefinito il contenuto e dagli altri due il titolo letto come intestazione e la riga dei comandi; con modal blocca la pagina, con fullscreen la occupa.":
    "The dialog takes the content from the default slot and from the other two the title read as a heading and the command row; modal blocks the page, fullscreen fills it.",
  "Il foglio dal basso prende dallo slot predefinito il contenuto, dallo slot heading il titolo e da actions i comandi; drag-handle mostra la presa che lo trascina.":
    "The bottom sheet takes the content from the default slot, the title from the heading slot and the commands from actions; drag-handle shows the grip that drags it.",
  "Il foglio laterale prende dallo slot predefinito il contenuto, da heading il titolo e da actions i comandi; entra dal lato indicato da placement e modal lo rende bloccante.":
    "The side sheet takes the content from the default slot, the title from heading and the commands from actions; it enters from the side set by placement and modal makes it blocking.",
  "Il gruppo impila gli avatar che riceve e riassume i restanti in un conteggio: lo slot predefinito riceve i bolle-avatar, e l'ordine è quello in cui li scrivi.":
    "The group stacks the avatars it receives and sums the rest in a count: the default slot takes the bolle-avatar elements, in the order they are written.",
  "Il gruppo tiene insieme pulsanti adiacenti e prende dallo slot predefinito i pulsanti da unire, nell'ordine in cui li scrivi.":
    "The group holds adjacent buttons together and takes from the default slot the buttons to join, in the order they are written.",
  "Il menu dei pulsanti flottanti legge le azioni dalle proprietà e prende dallo slot icon il simbolo del pulsante che lo apre.":
    "The floating button menu reads its actions from the properties and takes from the icon slot the symbol of the button that opens it.",
  "Il menu si apre con show(anchor) e legge le voci dalle proprietà, non dagli slot: ogni voce porta testo, icona, scorciatoia e sotto-menu.":
    "The menu opens with show(anchor) and reads its entries from the properties, not from slots: every entry carries text, icon, shortcut and submenu.",
  "Il messaggio si mostra con show() e prende dagli slot il testo, l'azione che lo accompagna e il comando che lo chiude; la proprietà message resta la scorciatoia per il solo testo.":
    "The message is shown with show() and takes from the slots the text, the action beside it and the command that closes it; the message property stays the shortcut for the text alone.",
  "Il pannello di navigazione prende dallo slot predefinito le voci, da heading il titolo e da actions i comandi in coda, e si apre in linea o sovrapposto alla pagina.":
    "The navigation panel takes the entries from the default slot, the title from heading and the trailing commands from actions, and opens inline or over the page.",
  "Il pulsante a icona prende dallo slot predefinito il simbolo e da icon la variante grafica; label resta obbligatoria perché è il nome letto dai lettori di schermo.":
    "The icon button takes the symbol from the default slot and the graphic variant from icon; label stays required because it is the name read by screen readers.",
  "Il pulsante di opzione prende dallo slot predefinito il testo e si raggruppa per name: scegliere una voce toglie la scelta alle altre dello stesso gruppo.":
    "The radio button takes its text from the default slot and groups by name: choosing one entry clears the others of the same group.",
  "Il pulsante diviso separa l'azione principale dal menu: lo slot predefinito riceve il testo del pulsante, icon l'icona e il menu si apre dal comando a fianco.":
    "The split button separates the main action from the menu: the default slot takes the button text, icon the icon, and the menu opens from the command beside it.",
  "Il pulsante flottante esteso mostra icona e testo insieme: lo slot predefinito riceve il testo e lo slot icon il simbolo.":
    "The extended floating button shows icon and text together: the default slot takes the text and the icon slot the symbol.",
  "Il pulsante flottante prende dallo slot predefinito il testo, che con size regular resta nascosto, e da icon il simbolo; extended aggiunge l'etichetta accanto all'icona.":
    "The floating button takes the text from the default slot, hidden when size is regular, and the symbol from icon; extended adds the label next to the icon.",
  "Il pulsante prende dallo slot predefinito il testo e dagli altri due l'icona iniziale e quella finale; la variante decide se il contenuto è testo, icona o entrambi.":
    "The button takes the text from the default slot and from the other two the start and end icons; the variant decides whether the content is text, icon or both.",
  "Il selettore di data prende dagli slot il titolo del pannello e il testo di supporto del campo; end-label nomina il valore finale quando selection-mode è range.":
    "The date picker takes from the slots the panel title and the supporting text of the field; end-label names the final value when selection-mode is range.",
  "Il selettore di orario prende dagli slot il titolo del quadrante e il testo di supporto del campo; con format a ventiquattro ore sparisce il periodo.":
    "The time picker takes from the slots the dial title and the supporting text of the field; with a twenty-four hour format the period disappears.",
  "Il separatore non ha slot: disegna una linea fra due gruppi di contenuto, con inset per staccarla dai bordi e vertical per separare elementi affiancati.":
    "The divider has no slots: it draws a line between two groups of content, with inset to detach it from the edges and vertical to separate side-by-side elements.",
  "Il suggerimento si aggancia a un elemento con show(anchor) e prende dallo slot predefinito il contenuto; gli altri slot coprono etichetta, testo di supporto, comandi e il comando di chiusura delle varianti ricche.":
    "The tooltip attaches to an element with show(anchor) and takes its content from the default slot; the other slots cover the label, the supporting text, the commands and the close command of the rich variants.",
  "Immagine o contenuto grafico della superficie.":
    "Image or graphic content of the surface.",
  "Indicatore circolare.": "Circular indicator.",
  "Indicatore dell'elemento attivo.": "Indicator of the active item.",
  "Indicatore della destinazione attiva.":
    "Indicator of the active destination.",
  "Indicatore dello stato o della posizione.":
    "Indicator of the state or the position.",
  "Indicatore lineare.": "Linear indicator.",
  "Intervallo scelto.": "Chosen range.",
  "Intestazione del calendario.": "Header of the calendar.",
  "Intestazione del componente.": "Header of the component.",
  "Intestazione del pannello di supporto.": "Header of the supporting panel.",
  "Intestazione della colonna.": "Header of the column.",
  "Intestazione della corsia.": "Header of the lane.",
  "Intestazione della scheda.": "Header of the card.",
  "Intestazione della superficie.": "Header of the surface.",
  "Intestazione fornita dall'applicazione.":
    "Header provided by the application.",
  "L'avatar mostra iniziali o un'immagine e prende dallo slot icon il simbolo che sostituisce le iniziali, per esempio quando l'immagine non è disponibile.":
    "The avatar shows initials or an image and takes from the icon slot the symbol that replaces the initials, for example when the image is missing.",
  "L'elenco prende dallo slot predefinito le righe, scritte come bolle-list-item, e le compone con icona, testo, supporto e coda; itemRenderer sostituisce l'intera riga.":
    "The list takes the rows from the default slot, written as bolle-list-item, and composes them with icon, text, support and trailing content; itemRenderer replaces the whole row.",
  "L'impalcatura compone le superfici intorno al contenuto: la navigazione, la barra, quella inferiore e il pannello di supporto arrivano dagli slot, e il contenuto principale è lo slot predefinito.":
    "The shell composes the surfaces around the content: the navigation, the bar, the bottom bar and the supporting panel come from the slots, and the main content is the default slot.",
  "L'indicatore di avanzamento non ha slot: riceve value, min, max e label e disegna la forma lineare o circolare; con indeterminate segnala un'attesa senza valore.":
    "The progress indicator has no slots: it takes value, min, max and label and draws the linear or circular shape; indeterminate reports a wait without a value.",
  "L'indicatore di caricamento non ha slot: mostra un'animazione con la label accessibile che gli passi, e contained lo appoggia su una superficie.":
    "The loading indicator has no slots: it shows an animation with the accessible label it is given, and contained rests it on a surface.",
  "L'interruttore prende dallo slot predefinito il testo dell'etichetta e cambia stato da sé, riportando il valore con l'evento change.":
    "The switch takes the label text from the default slot and changes state on its own, reporting the value with the change event.",
  "La barra dei comandi dispone gli elementi che riceve nello slot predefinito, e con variabili può portare a capo i comandi in eccesso invece di comprimerli.":
    "The command bar lays out the elements it receives in the default slot, and can wrap the extra commands instead of squeezing them.",
  "La barra dell'applicazione prende dal titolo il testo principale e dagli slot i comandi iniziali e finali; lo slot predefinito sostituisce il titolo quando serve un'intestazione più ricca.":
    "The application bar takes the main text from the title and the start and end commands from the slots; the default slot replaces the title when a richer heading is needed.",
  "La barra di navigazione legge le destinazioni dalle proprietà, non dagli slot: ogni destinazione porta icona, testo e indicatore di attività.":
    "The navigation bar reads its destinations from the properties, not from slots: every destination carries icon, text and activity indicator.",
  "La barra inferiore tiene i comandi in linea e il pulsante flottante: lo slot predefinito riceve i comandi, gli altri slot l'elemento iniziale, quello finale e il pulsante flottante.":
    "The bottom bar holds the inline commands and the floating button: the default slot takes the commands, the other slots the start element, the end element and the floating button.",
  "La barra stretta legge le destinazioni dalle proprietà: con expanded mostra anche i testi, altrimenti resta alle icone con il suggerimento.":
    "The narrow bar reads its destinations from the properties: with expanded it also shows the texts, otherwise it keeps the icons with the tooltip.",
  "La casella prende dallo slot predefinito il testo dell'etichetta e si collega al campo con name, value e checked; indeterminate mostra lo stato misto.":
    "The checkbox takes the label text from the default slot and binds to the field with name, value and checked; indeterminate shows the mixed state.",
  "La dashboard dispone i riquadri che le passi e non impone contenuti: ogni riquadro è un bolle-widget nello slot predefinito, con intestazione, corpo, comandi e maniglia di ridimensionamento già forniti dal widget.":
    "The dashboard lays out the tiles it is given and imposes no content: every tile is a bolle-widget in the default slot, with header, body, commands and resize handle already provided by the widget.",
  "La paginazione non ha slot: mostra l'intervallo, le frecce e le pagine numerate, e si sposta alla pagina richiesta riportandola con page-change.":
    "The pagination has no slots: it shows the range, the arrows and the numbered pages, and moves to the requested page, reporting it with page-change.",
  "La pastiglia prende dallo slot predefinito il testo e dagli altri un'icona o un avatar; removable aggiunge il comando che la toglie.":
    "The chip takes its text from the default slot and from the others an icon or an avatar; removable adds the command that removes it.",
  "La ricerca prende dagli slot il contenuto del campo e dei risultati: results riceve l'elenco che compare sotto la barra, il resto segue le regole del campo di testo.":
    "The search takes the content of the field and of the results from the slots: results takes the list shown under the bar, the rest follows the text field rules.",
  "La scheda prende dallo slot predefinito il contenuto e dagli altri slot l'immagine di testa e la riga di comandi: media occupa la larghezza, content resta la scorciatoia per il solo blocco interno.":
    "The card takes the content from the default slot and from the other slots the lead image and the command row: media fills the width, content stays the shortcut for the inner block alone.",
  "La select avvolge un elemento select nativo: le opzioni restano nel markup, e lo slot supporting porta il testo che spiega la scelta.":
    "The select wraps a native select element: the options stay in the markup and the supporting slot carries the text that explains the choice.",
  "Le briciole arrivano da items, non dagli slot: il componente disegna il percorso, separa le voci e rende l'ultima come pagina corrente.":
    "The breadcrumbs come from items, not from slots: the component draws the path, separates the entries and renders the last one as the current page.",
  "Le schede leggono le voci dalle proprietà e prendono dallo slot predefinito i pannelli: ogni pannello dichiara con slot il nome della scheda che lo apre.":
    "The tabs read their entries from the properties and take the panels from the default slot: every panel names the tab that opens it through slot.",
  "Linea di separazione.": "Separating line.",
  "Lo stato vuoto centra un'icona, un titolo e un testo, e prende dallo slot actions il comando che fa uscire dallo stato vuoto.":
    "The empty state centres an icon, a title and a text, and takes from the actions slot the command that leaves the empty state.",
  "Maniglia che ridimensiona il pannello.": "Handle that resizes the panel.",
  "Marchio in cima alla navigazione.": "Brand at the top of the navigation.",
  "Membrana della superficie.": "Membrane of the surface.",
  "Menu dell'overlay.": "Menu of the overlay.",
  "Messaggio testuale della superficie.": "Text message of the surface.",
  "Modulo della ricerca.": "Form of the search.",
  "Navigazione principale dell'impalcatura.": "Main navigation of the shell.",
  "Navigazione ridotta a icona.": "Navigation reduced to an icon.",
  "Nome del giorno della settimana.": "Name of the weekday.",
  "Numero di righe del gruppo.": "Number of rows in the group.",
  "Numero di schede della colonna.": "Number of cards in the column.",
  "Onda dell'indicatore.": "Wave of the indicator.",
  "Pannello che entra dal bordo.": "Panel that enters from the edge.",
  "Pannello della scheda attiva.": "Panel of the active tab.",
  "Piè di pagina del componente.": "Footer of the component.",
  "Ponte che collega i due cursori.": "Bridge that joins the two thumbs.",
  "Presa che avvia il trascinamento della scheda.":
    "Grip that starts dragging the card.",
  "Presa che avvia il trascinamento.": "Grip that starts the drag.",
  "Presa del cursore.": "Thumb grip.",
  "Pulsante del giorno.": "Day button.",
  "Pulsante flottante agganciato all'angolo.":
    "Floating button pinned to the corner.",
  "Pulsante interno del componente.": "Inner button of the component.",
  "Punto del passo.": "Dot of the step.",
  "Quadrante dell'ora.": "Hour dial.",
  "Ramo dell'albero di navigazione.": "Branch of the navigation tree.",
  "Riepilogo del gruppo.": "Summary of the group.",
  "Riga dei comandi.": "Command row.",
  "Riga del dettaglio aperto.": "Row of the open detail.",
  "Riga della tabella o dell'elenco.": "Row of the table or the list.",
  "Riga di dati della scheda.": "Data row of the card.",
  "Riga scelta.": "Chosen row.",
  "Riga visibile dell'elemento.": "Visible row of the item.",
  "Riquadro del campo.": "Box of the field.",
  "Riquadro del dialogo.": "Box of the dialog.",
  "Riquadro del riquadro della dashboard.": "Tile of the dashboard.",
  "Scheda interna del componente.": "Inner card of the component.",
  "Segnalazione dell'elemento.": "Badge of the item.",
  "Segnalazione della scheda.": "Badge of the tab.",
  "Segnalazione sovrapposta, come un conteggio.":
    "Overlaid badge, like a count.",
  "Segnalazione sovrapposta.": "Overlaid badge.",
  "Selettore della modalità.": "Mode selector.",
  "Singola riga dell'elenco.": "Single row of the list.",
  "Singola scheda della barra.": "Single tab of the bar.",
  "Singola voce dell'elenco.": "Single entry of the list.",
  "Singolo elemento dell'elenco.": "Single item of the list.",
  "Singolo giorno.": "Single day.",
  "Singolo passo.": "Single step.",
  "Singolo segmento del controllo.": "Single segment of the control.",
  "Singolo suggerimento.": "Single suggestion.",
  "Sostituisce lo stato mostrato durante il caricamento.":
    "Replaces the state shown while loading.",
  "Sostituisce lo stato mostrato quando non ci sono dati.":
    "Replaces the state shown when there is no data.",
  "Sottoelenco dell'elemento.": "Sublist of the item.",
  "Sottotitolo della superficie.": "Subtitle of the surface.",
  "Superficie del campo, su cui si disegna il contorno.":
    "Surface of the field, where the outline is drawn.",
  "Superficie del messaggio.": "Surface of the message.",
  "Superficie del suggerimento.": "Surface of the tooltip.",
  "Superficie della board.": "Surface of the board.",
  "Superficie della pastiglia.": "Surface of the chip.",
  "Superficie visibile della bolla o del pannello.":
    "Visible surface of the bubble or the panel.",
  "Supporto in linea, accanto al contenuto.":
    "Inline support, next to the content.",
  "Supporto sovrapposto al contenuto.": "Support over the content.",
  "Testo del segmento.": "Text of the segment.",
  "Testo dell'elemento di navigazione.": "Text of the navigation item.",
  "Testo dell'elemento stretto.": "Text of the narrow item.",
  "Testo dell'etichetta.": "Text of the label.",
  "Testo della destinazione.": "Text of the destination.",
  "Testo della pastiglia.": "Text of the chip.",
  "Testo della scheda.": "Text of the tab.",
  "Testo della segnalazione.": "Text of the badge.",
  "Testo di supporto sotto il contenuto principale.":
    "Supporting text under the main content.",
  "Testo mostrato quando il campo è vuoto.":
    "Text shown while the field is empty.",
  "Testo principale dell'elemento.": "Main text of the item.",
  "Testo scritto dentro l'etichetta.": "Text written inside the label.",
  "Testo secondario dell'elemento.": "Secondary text of the item.",
  "Testo secondario sotto il contenuto.": "Secondary text under the content.",
  "Titolo del gruppo.": "Title of the group.",
  "Titolo dell'area, letto come intestazione.":
    "Title of the area, read as a heading.",
  "Titolo della colonna.": "Title of the column.",
  "Titolo della superficie.": "Title of the surface.",
  "Titolo principale della superficie.": "Main title of the surface.",
  "Traccia che tiene i segmenti.": "Track that holds the segments.",
  "Valore mostrato accanto all'etichetta.": "Value shown next to the label.",
  "Valore numerico o testuale.": "Numeric or textual value.",
  "Valore sul quadrante.": "Value on the dial.",
  "Velo mostrato durante un aggiornamento.": "Veil shown during an update.",
  "Contenuto del pannello della scheda con questo identificatore.":
    "Content of the tab panel with this identifier.",
  "Albero di navigazione": "Navigation tree",
  "Avanzamento lineare e circolare": "Linear and circular progress",
  "Avatar con icona al posto delle iniziali":
    "Avatar with an icon instead of the initials",
  "Avatar con immagine o iniziali": "Avatar with an image or the initials",
  "Azione principale e menu": "Main action and menu",
  "Azioni rapide": "Quick actions",
  "Barra che si comprime allo scorrimento": "Bar that shrinks on scroll",
  "Barra dell'applicazione": "Application bar",
  "Barra di comandi": "Command bar",
  "Barra di navigazione": "Navigation bar",
  "Barra di ricerca con risultati": "Search bar with results",
  "Barra inferiore con pulsante flottante": "Bottom bar with a floating button",
  "Barra stretta": "Narrow bar",
  "Board minima": "Minimal board",
  "Bolla del conteggio interattiva": "Interactive count bubble",
  "Campo con prefisso e supporto": "Field with a prefix and supporting text",
  "Campo con suggerimenti": "Field with suggestions",
  "Campo in errore": "Field in error",
  "Campo multiriga": "Multiline field",
  "Carosello di schede": "Card carousel",
  "Casella che governa un elenco": "Checkbox that drives a list",
  "Casella con testo e supporto": "Checkbox with text and support",
  "Con appearance contained e layout inline la ricerca sta dentro una barra e non occupa tutta la larghezza: la variante divided la stacca con una linea dal contenuto che segue.":
    "With appearance contained and layout inline the search sits inside a bar and does not take the full width: the divided variant separates it from the content that follows with a line.",
  "Con interactive la bolla che nasconde i restanti diventa un comando: il clic arriva con avatar-group-select e il conteggio dice quante persone restano fuori.":
    "With interactive the bubble that hides the rest becomes a command: the click arrives with avatar-group-select and the count tells how many people stay out.",
  "Con multiple il controllo tiene più segmenti accesi e restituisce values. È la forma giusta per i filtri rapidi, dove più criteri restano attivi insieme.":
    "With multiple the control keeps more than one segment on and reports values. It is the right form for quick filters, where several criteria stay active together.",
  "Con range il cursore mostra due maniglie e riporta value e upperValue: è la forma giusta per un filtro fra due importi o due date.":
    "With range the slider shows two thumbs and reports value and upperValue: it is the right form for a filter between two amounts or two dates.",
  "Con scrollable le schede in eccesso scorrono in orizzontale invece di comprimersi: è la forma per un numero variabile di schede, quando i nomi sono lunghi.":
    "With scrollable the extra tabs scroll horizontally instead of squeezing: it is the form for a variable number of tabs, when the names are long.",
  "Con search la sidebar mette sopra le voci il campo che le filtra; count mostra il contatore di una voce e collapsed riduce tutta la navigazione a icona, con il testo nel suggerimento.":
    "With search the sidebar puts the filter field above the entries; count shows the counter of an entry and collapsed reduces the whole navigation to icons, with the text in the tooltip.",
  "Con selection-mode range il calendario prende due date e le riporta in value e end-value; lo slot end-label nomina il secondo campo e week-starts-on sceglie il primo giorno della settimana.":
    "With selection-mode range the calendar takes two dates and reports them in value and end-value; the end-label slot names the second field and week-starts-on chooses the first day of the week.",
  "Con toggle il pulsante mantiene lo stato premuto e lo riporta con selected, per i comandi che accendono qualcosa come il grassetto di un editor.":
    "With toggle the button keeps the pressed state and reports it with selected, for commands that switch something on like the bold of an editor.",
  "Contenuto della scheda": "Card content",
  "Contenuto di una voce": "Content of an entry",
  "Cursore singolo": "Single thumb",
  "Dialogo a tutto schermo": "Full-screen dialog",
  "Dialogo di conferma": "Confirmation dialog",
  "Elenco con icone e dettaglio": "List with icons and detail",
  "Elenco da un array": "List from an array",
  "Foglio dal basso": "Bottom sheet",
  "Griglia di riquadri": "Grid of tiles",
  "Gruppo di avatar": "Avatar group",
  "Gruppo di opzioni": "Group of options",
  "I pulsanti di opzione si raggruppano per name: scegliere una voce toglie la scelta alle altre dello stesso gruppo, e il valore arriva con change.":
    "The radio buttons group by name: choosing one entry clears the others of the same group, and the value arrives with change.",
  "I segmenti arrivano da items e la scelta da value: il controllo la applica da sé e la riporta con change. multiple ammette più segmenti e restituisce values.":
    "The segments come from items and the choice from value: the control applies it on its own and reports it with change. multiple allows more than one segment and reports values.",
  "Icona personalizzata e allineamento": "Custom icon and alignment",
  "Il badge mostra value sopra l'elemento che lo contiene e comprime il numero oltre max in «999+». small toglie il testo e lascia il punto, per una segnalazione senza numero.":
    "The badge shows value over the element that contains it and shortens the number beyond max to “999+”. small drops the text and keeps the dot, for a badge without a number.",
  "Il campo prende dagli slot il prefisso, il suffisso e il testo di supporto, mentre il valore resta nell'input e arriva con input e change. variant filled o outlined cambia la forma del riquadro.":
    "The field takes the prefix, the suffix and the supporting text from the slots, while the value stays in the input and arrives with input and change. variant filled or outlined changes the shape of the box.",
  "Il carosello scorre gli elementi dello slot predefinito e mostra i comandi avanti e indietro: index dice quale è visibile e la scelta arriva con change. Lo scorrimento è a passi, con il tocco e la tastiera.":
    "The carousel scrolls the items of the default slot and shows the forward and backward commands: index says which one is visible and the change arrives with change. It moves in steps, with touch and keyboard.",
  "Il cursore mostra il valore sull'etichetta e lo riporta con input durante il trascinamento e con change alla fine. min e max fissano l'intervallo, step la granularità.":
    "The slider shows the value on the label and reports it with input while dragging and with change at the end. min and max set the range, step the granularity.",
  "Il foglio entra dal bordo inferiore e porta con sé i comandi: drag-handle mostra la presa che lo trascina, heading il titolo, actions la riga finale. open e show() lo aprono.":
    "The sheet enters from the bottom edge and brings its commands along: drag-handle shows the grip that drags it, heading the title, actions the final row. open and show() open it.",
  "Il gruppo impila gli avatar che riceve e riassume i restanti in una bolla con il conteggio: max decide quanti mostrarne, total dice quanti sono in tutto quando non li passi tutti.":
    "The group stacks the avatars it receives and sums the rest in a bubble with a count: max decides how many to show, total tells how many there are when not all are passed.",
  "Il gruppo unisce pulsanti adiacenti: variant connected toglie lo spazio e condivide i bordi, selection single trasforma il gruppo in una scelta unica e riporta il valore con change.":
    "The group joins adjacent buttons: variant connected removes the space and shares the borders, selection single turns the group into a single choice and reports the value with change.",
  "Il menu dei pulsanti flottanti apre le azioni secondarie dal pulsante principale: items dichiara le voci, open dice se è aperto e la scelta arriva con menu-select.":
    "The floating button menu opens the secondary actions from the main button: items declares the entries, open says whether it is open and the choice arrives with menu-select.",
  "Il pannello apre le voci in verticale e può stare in linea accanto al contenuto o sovrapposto alla pagina: placement start o end sceglie il lato, modal lo rende bloccante.":
    "The panel opens the entries vertically and can sit inline beside the content or over the page: placement start or end chooses the side, modal makes it blocking.",
  "Il pannello entra dal lato indicato da placement e lascia visibile il contenuto: è la forma giusta per il dettaglio di una riga, con heading per il titolo e actions per i comandi in coda.":
    "The panel enters from the side set by placement and leaves the content visible: it is the right form for the detail of a row, with heading for the title and actions for the trailing commands.",
  "Il pulsante diviso tiene l'azione principale a sinistra e apre il menu dal comando a fianco: le voci arrivano da items e la scelta con menu-select, mentre il clic sull'azione principale arriva con click.":
    "The split button keeps the main action on the left and opens the menu from the command beside it: the entries come from items and the choice with menu-select, while the click on the main action arrives with click.",
  "Il pulsante flottante resta ancorato all'angolo del contenitore e mostra il solo simbolo: label è il nome accessibile e va sempre dichiarata. size regular resta tondo, extended aggiunge il testo.":
    "The floating button stays anchored to the corner of its container and shows only the symbol: label is the accessible name and is always required. size regular stays round, extended adds the text.",
  "Il selettore apre il calendario dal campo: il valore scelto arriva con change nel formato ISO, e locale decide lingua e nomi dei giorni. selection-mode range aggiunge la seconda data in end-value.":
    "The picker opens the calendar from the field: the chosen value arrives with change in ISO format, and locale decides language and day names. selection-mode range adds the second date in end-value.",
  "Il selettore apre il quadrante dell'ora dal campo: il valore scelto arriva con change, hour-cycle decide il formato a dodici o ventiquattro ore e lo slot title nomina il quadrante.":
    "The picker opens the hour dial from the field: the chosen value arrives with change, hour-cycle decides the twelve or twenty-four hour format and the title slot names the dial.",
  "Il separatore non ha contenuto: divide due gruppi di elementi, con inset per staccarlo dai bordi e vertical per separare comandi affiancati.":
    "The divider has no content: it divides two groups of elements, with inset to detach it from the edges and vertical to separate side-by-side commands.",
  "Il suggerimento si aggancia a un elemento con show(anchor) e si chiude da sé quando il puntatore esce o arriva Esc. label è il testo breve, supporting-text aggiunge la riga di dettaglio.":
    "The tooltip attaches to an element with show(anchor) and closes by itself when the pointer leaves or Esc arrives. label is the short text, supporting-text adds the detail line.",
  "Impalcatura completa": "Complete shell",
  "Indicatore di caricamento": "Loading indicator",
  "Interruttore": "Switch",
  "Intervallo di date": "Date range",
  "Intervallo fra due valori": "Range between two values",
  "L'elenco prende le righe dallo slot predefinito e le compone con icona, testo, supporto e coda; interactive abilita il clic e selection riporta la scelta con change.":
    "The list takes the rows from the default slot and composes them with icon, text, support and trailing content; interactive enables the click and selection reports the choice with change.",
  "L'impalcatura mette insieme le superfici intorno al contenuto: la navigazione, la barra, quella inferiore e il pannello di supporto arrivano dagli slot e il contenuto principale è lo slot predefinito. Le aree che non ricevono nulla non occupano spazio.":
    "The shell assembles the surfaces around the content: the navigation, the bar, the bottom bar and the supporting panel come from the slots and the main content is the default slot. Areas that receive nothing take no space.",
  "L'indicatore mostra l'attesa di un'operazione: label è il nome letto dai lettori di schermo e va sempre dichiarata. variant contained lo appoggia su una superficie quando copre un riquadro.":
    "The indicator shows the wait of an operation: label is the name read by screen readers and is always required. variant contained rests it on a surface when it covers a tile.",
  "L'interruttore cambia stato da sé e riporta il valore con change: è la forma giusta per una preferenza che ha effetto immediato, mentre la casella resta per una scelta da confermare.":
    "The switch changes state on its own and reports the value with change: it is the right form for a preference with immediate effect, while the checkbox stays for a choice to confirm.",
  "La barra dispone gli elementi che riceve nello slot predefinito: varianti diverse separano i comandi principali da quelli di servizio, e la barra porta a capo gli elementi in eccesso invece di comprimerli.":
    "The bar lays out the elements it receives in the default slot: different variants separate the main commands from the service ones, and the bar wraps the extra elements instead of squeezing them.",
  "La barra inferiore tiene i comandi in linea e il pulsante flottante: lo slot predefinito riceve i comandi, leading e trailing gli elementi ai lati, fab il pulsante che si incastra nel taglio. dock porta il pulsante dentro la barra.":
    "The bottom bar holds the inline commands and the floating button: the default slot takes the commands, leading and trailing the elements at the sides, fab the button that fits into the notch. dock brings the button inside the bar.",
  "La barra porta il titolo e i comandi: title riceve il testo principale, subtitle la riga sotto, gli slot leading e actions i comandi ai due lati. Lo slot predefinito sostituisce il titolo quando serve un'intestazione più ricca.":
    "The bar carries the title and the commands: title takes the main text, subtitle the line below, the leading and actions slots the commands at the sides. The default slot replaces the title when a richer header is needed.",
  "La barra stretta mostra le icone delle destinazioni e, con expanded, anche i testi. Serve fra la barra inferiore e il pannello laterale, quando lo spazio è poco ma le sezioni restano molte.":
    "The narrow bar shows the icons of the destinations and, with expanded, also the texts. It sits between the bottom bar and the side panel, when space is short but the sections stay many.",
  "La casella prende dallo slot predefinito il testo dell'etichetta e cambia stato da sé, riportando checked con change. supporting-text aggiunge la riga di spiegazione, indeterminate mostra lo stato misto.":
    "The checkbox takes the label text from the default slot and changes state on its own, reporting checked with change. supporting-text adds the explanation line, indeterminate shows the mixed state.",
  "La dashboard dispone i riquadri che riceve e non impone contenuti: ogni riquadro è un bolle-widget, e span decide quante colonne occupa mentre min-span fissa il minimo quando lo spazio si stringe.":
    "The dashboard lays out the tiles it receives and imposes no content: every tile is a bolle-widget, and span decides how many columns it takes while min-span sets the minimum when space narrows.",
  "La forma estesa mostra icona e testo insieme: lo slot icon porta il simbolo, lo slot predefinito il testo. Resta il pulsante dell'azione principale della schermata.":
    "The extended form shows icon and text together: the icon slot takes the symbol, the default slot the text. It stays the button of the main action of the screen.",
  "La pastiglia prende dallo slot predefinito il testo e dagli altri un'icona o un avatar. selected la segna come scelta, removable aggiunge il comando che la toglie e riporta remove.":
    "The chip takes its text from the default slot and from the others an icon or an avatar. selected marks it as chosen, removable adds the command that removes it and reports remove.",
  "La ricerca è un campo di testo con il comando di pulizia già incluso: results riceve l'elenco che compare sotto la barra, che l'applicazione riempie con i risultati di suggest o search.":
    "The search is a text field with the clear command already included: results takes the list that appears under the bar, which the application fills with the results of suggest or search.",
  "La scheda non si compone con uno slot: il componente chiama card per ogni scheda e riceve la scheda e la board. laneLabel dà un nome alle corsie, che altrimenti mostrano la chiave.":
    "The card is not composed with a slot: the component calls card for every card and receives the card and the board. laneLabel names the lanes, which otherwise show the key.",
  "La scheda prende dallo slot predefinito il contenuto, da media l'immagine di testa che occupa la larghezza e da actions la riga di comandi. href rende l'intera scheda un collegamento.":
    "The card takes the content from the default slot, from media the lead image that fills the width and from actions the command row. href turns the whole card into a link.",
  "La select avvolge un elemento select nativo: le opzioni restano nel markup e il valore arriva con change. Il menu che si apre è quello del componente, con la stessa forma dei campi di testo.":
    "The select wraps a native select element: the options stay in the markup and the value arrives with change. The menu that opens is the component one, with the same shape as the text fields.",
  "La variante decide la forma: filled per l'azione principale, tonal per la secondaria, outlined e text per le altre. Lo slot predefinito porta il testo, icon l'icona iniziale e trailing-icon quella finale.":
    "The variant decides the shape: filled for the main action, tonal for the secondary, outlined and text for the others. The default slot takes the text, icon the start icon and trailing-icon the end one.",
  "Lo slot icon sostituisce il simbolo predefinito e align sposta il blocco a sinistra, utile quando lo stato vuoto riempie una colonna di contenuto.":
    "The icon slot replaces the built-in symbol and align moves the block to the left, useful when the empty state fills a column of content.",
  "Lo slot icon sostituisce le iniziali: serve per un account generico o per un'immagine non disponibile. Lo slot badge sovrappone una segnalazione all'angolo.":
    "The icon slot replaces the initials: it serves a generic account or a missing image. The badge slot overlays a signal on the corner.",
  "Lo stato vuoto centra icona, titolo e testo; lo slot actions porta il comando che fa uscire dallo stato vuoto. tone error lo colora per un errore di caricamento.":
    "The empty state centres an icon, a title and a text; the actions slot takes the command that leaves the empty state. tone error colours it for a loading error.",
  "Menu di azioni": "Menu of actions",
  "Messaggio con azione": "Message with an action",
  "Pager sui dati presenti": "Pager over the rows at hand",
  "Pannello di navigazione": "Navigation panel",
  "Pannello di supporto": "Supporting panel",
  "Pannello laterale di dettaglio": "Side panel of detail",
  "Passi di un percorso": "Steps of a path",
  "Pastiglia con icona e rimozione": "Chip with an icon and removal",
  "Percorso di navigazione": "Breadcrumb path",
  "Pulsante a icona": "Icon button",
  "Pulsante che resta premuto": "Button that stays pressed",
  "Pulsante con icona": "Button with an icon",
  "Pulsante flottante": "Floating button",
  "Pulsante flottante esteso": "Extended floating button",
  "Pulsanti collegati": "Connected buttons",
  "Regola di spostamento e limiti": "Move rule and limits",
  "Ricerca in linea nella barra": "Search inline in the bar",
  "Ricerca, contatori e rail compatta": "Search, counters and compact rail",
  "Riquadri spostabili e ridimensionabili": "Movable and resizable tiles",
  "Scelta della dimensione e forma compatta":
    "Choosing the size and compact form",
  "Scelta di un orario": "Choosing a time",
  "Scelta di una data": "Choosing a date",
  "Scelta fra segmenti": "Choice among segments",
  "Scelta multipla": "Multiple choice",
  "Scheda con immagine e comandi": "Card with image and commands",
  "Scheda orizzontale come collegamento": "Horizontal card as a link",
  "Schede che scorrono": "Tabs that scroll",
  "Schede con pannelli": "Tabs with panels",
  "Segnalazione su un elemento": "Badge on an element",
  "Select con opzioni native": "Select with native options",
  "Separatore fra gruppi": "Divider between groups",
  "Stato vuoto con un comando": "Empty state with a command",
  "Suggerimento su un comando": "Tooltip on a command",
  "columns dichiara le colonne e cards le schede, ciascuna con la colonna in cui si trova. Con movable il lettore trascina la scheda o la sposta con Alt e le frecce: la board applica lo spostamento e lo riporta con card-move.":
    "columns declares the columns and cards the cards, each with the column it sits in. With movable the reader drags the card or moves it with Alt and the arrows: the board applies the move and reports it with card-move.",
  "error porta il contorno e il testo nel colore d'errore, e con supporting-text il messaggio spiega cosa correggere. La validazione resta all'applicazione, che decide quando alzare il segnale.":
    "error turns the outline and the text to the error colour, and with supporting-text the message explains what to fix. Validation stays with the application, which decides when to raise the signal.",
  "indeterminate segnala una scelta parziale: è lo stato della casella di intestazione quando solo alcune righe sono scelte. Il valore lo decide l'applicazione dalle righe selezionate.":
    "indeterminate reports a partial choice: it is the state of the header checkbox when only some rows are chosen. The application derives the value from the selected rows.",
  "items dichiara le destinazioni con icona e testo, value dice quale è attiva: il componente applica la scelta da sé e la riporta con change. Oltre cinque destinazioni conviene passare alla barra laterale.":
    "items declares the destinations with icon and text, value says which one is active: the component applies the choice on its own and reports it with change. Above five destinations it is better to switch to the side bar.",
  "items dichiara le righe senza scrivere markup: ogni voce porta testo, supporto, icona, contatore e figli per il sottoelenco. itemRenderer sostituisce l'intera riga quando serve un contenuto tuo.":
    "items declares the rows without writing markup: every entry carries text, support, icon, counter and children for the sublist. itemRenderer replaces the whole row when custom content is needed.",
  "items dichiara le schede e value quella attiva: il componente applica la scelta da sé e la riporta con change. Ogni pannello dichiara con slot l'identificatore della scheda che lo apre.":
    "items declares the tabs and value the active one: the component applies the choice on its own and reports it with change. Every panel names the tab that opens it through slot.",
  "items dichiara le voci del percorso: il componente mette il separatore fra una voce e l'altra e segna l'ultima come pagina corrente. separator sceglie il segno, max-items comprime le voci centrali dietro un comando.":
    "items declares the entries of the path: the component puts the separator between them and marks the last one as the current page. separator chooses the sign, max-items squeezes the middle entries behind a command.",
  "items dichiara le voci e i loro figli: il componente costruisce l'albero fino a tre livelli, apre il ramo della voce scelta e riporta il percorso con navigate. La voce corrente si imposta con current, il percorso delle voci separate da barra.":
    "items declares the entries and their children: the component builds the tree up to three levels, opens the branch of the chosen entry and reports the path with navigate. The current entry is set with current, the path of the entries separated by a slash.",
  "label è obbligatoria perché è il nome letto dai lettori di schermo, dato che il pulsante mostra solo il simbolo. variant standard lascia l'icona senza sfondo, filled la appoggia su una superficie.":
    "label is required because it is the name read by screen readers, since the button shows only the symbol. variant standard leaves the icon without a background, filled rests it on a surface.",
  "movable, resizable e removable rendono il riquadro regolabile dal lettore: la maniglia in alto avvia lo spostamento, quella in basso a destra il ridimensionamento, e il menu offre la chiusura. La dashboard applica il risultato e lo riporta con tile-move, tile-resize e tile-remove.":
    "movable, resizable and removable let the reader adjust the tile: the handle at the top starts the move, the one at the bottom right the resize, and the menu offers the removal. The dashboard applies the result and reports it with tile-move, tile-resize and tile-remove.",
  "multiline trasforma il campo in un'area di testo e rows fissa l'altezza iniziale; gli slot restano quelli del campo, con il suffisso per un conteggio.":
    "multiline turns the field into a text area and rows sets the starting height; the slots stay those of the field, with the suffix for a counter.",
  "open apre il dialogo e modal lo rende bloccante: il fuoco resta dentro finché non si chiude, e la chiusura arriva con closed. heading riceve il titolo letto come intestazione, actions la riga dei comandi.":
    "open opens the dialog and modal makes it blocking: the focus stays inside until it closes, and the closing arrives with closed. heading takes the title read as a heading, actions the command row.",
  "options dichiara i nomi dei passi e value quello corrente: il componente segna i passi fatti, quello attivo e i restanti, e riporta la scelta con change.":
    "options declares the step names and value the current one: the component marks the done steps, the active one and the remaining ones, and reports the choice with change.",
  "orientation horizontal mette immagine e testo affiancati, href rende la scheda un collegamento e tail dice da dove arriva: la coda punta al contenuto che la precede.":
    "orientation horizontal puts image and text side by side, href turns the card into a link and tail says where it comes from: the tail points at the content above it.",
  "page-size accende il pager e total dice quante righe esistono: il componente si sposta da sé alla pagina richiesta e la riporta con page-change, così l'applicazione taglia la fetta di dati che mostra.":
    "page-size turns the pager on and total says how many rows exist: the component moves to the requested page on its own and reports it with page-change, so the application slices the data it shows.",
  "pageSizes aggiunge il selettore delle righe per pagina: sceglierne una riporta la pagina a zero. form compact toglie l'elenco numerato e lascia intervallo e frecce, utile sotto una tabella.":
    "pageSizes adds the rows-per-page selector: choosing one brings the page back to zero. form compact removes the numbered list and keeps the range and the arrows, useful under a table.",
  "restrict decide dove può andare una scheda e restituisce il motivo del rifiuto, che arriva con card-move-blocked. wip sulla colonna è un limite consigliato: la board lo segnala senza impedire lo spostamento.":
    "restrict decides where a card may go and returns the reason of the refusal, which arrives with card-move-blocked. wip on the column is an advised limit: the board reports it without blocking the move.",
  "scrolled segnala che il contenuto sotto ha iniziato a scorrere e collapsed comprime la barra: l'applicazione ascolta lo scorrimento e passa il valore, mentre la barra cambia altezza e ombra.":
    "scrolled reports that the content below has started scrolling and collapsed shrinks the bar: the application listens to the scroll and passes the value, while the bar changes height and shadow.",
  "show() apre il messaggio e duration lo chiude da solo: lo slot message porta il testo, action l'azione che lo accompagna e dismiss il comando di chiusura. message resta la scorciatoia per il solo testo.":
    "show() opens the message and duration closes it by itself: the message slot takes the text, action the action beside it and dismiss the closing command. message stays the shortcut for the text alone.",
  "show(anchor) apre il menu sotto l'elemento che lo richiama e la scelta arriva con menu-select. items dichiara le voci, con icona, scorciatoia, disabled e figli per il sotto-menu.":
    "show(anchor) opens the menu under the element that calls it and the choice arrives with menu-select. items declares the entries, with icon, shortcut, disabled and children for the submenu.",
  "src mostra l'immagine e, quando manca o non si carica, il componente torna alle iniziali ricavate da name. initials le fissa a mano, status aggiunge il punto di presenza e size cambia la misura.":
    "src shows the image and, when it is missing or fails to load, the component falls back to the initials taken from name. initials sets them by hand, status adds the presence dot and size changes the size.",
  "suggestions dichiara i suggerimenti e il componente li filtra mentre si scrive, riportandoli con suggest; scegliere una voce riempie il campo ed emette change. suggestion-delay regola l'attesa prima di chiedere i dati.":
    "suggestions declares the suggestions and the component filters them while typing, reporting them with suggest; choosing an entry fills the field and emits change. suggestion-delay sets the wait before asking for the data.",
  "supporting-mode decide dove vive il contenuto dello slot supporting: inline accanto al contenuto, modal sopra la pagina, sheet in un foglio laterale. Il componente sceglie la forma adatta alla larghezza e riporta il cambio con form-change.":
    "supporting-mode decides where the content of the supporting slot lives: inline beside the content, modal over the page, sheet in a side panel. The component picks the form suited to the width and reports the change with form-change.",
  "value dice quanto è stato fatto rispetto a max, label è il nome letto dai lettori di schermo. variant circular passa all'anello, indeterminate segnala un'attesa senza valore.":
    "value says how much is done against max, label is the name read by screen readers. variant circular switches to the ring, indeterminate reports a wait without a value.",
  "variant fullscreen occupa la finestra e serve per un compito lungo, come un editor: la superficie perde gli angoli e i comandi restano in fondo.":
    "variant fullscreen fills the window and serves a long task, like an editor: the surface loses the corners and the commands stay at the bottom.",
  " · fissato": " · fixed",
  ", fissato": ", fixed",
  "Colori fissati": "Fixed colors",
  "Fissa questo colore": "Fix this color",
  "La generazione lo mantiene e ricalcola gli altri ruoli attorno a lui.":
    "Generation keeps it and recalculates the other roles around it.",
  "Nessun colore fissato: la generazione segue il seme. Apri un colore della tavolozza e attiva «Fissa questo colore» per imporlo e lasciare che il resto si adatti.":
    "No fixed color: generation follows the seed. Open a palette color and turn on “Fix this color” to impose it and let the rest adapt.",
  "Sblocca tutti": "Unfix all",
  "Sblocca {role}": "Unfix {role}",
  "Testo su {role}": "Text on {role}",
  "I colori Bolle (Accent e On accent) non derivano dal seme: la generazione li lascia come sono e adatta solo il testo sopra l'accento. Film, ombre e scrollbar si ricalcolano da soli dal primario e dalla superficie.":
    "Bolle colours (Accent and On accent) are not derived from the seed: generation leaves them as they are and only adapts the text on the accent. Film, shadows and scrollbars recalculate on their own from the primary and the surface.",
  "{role} su Surface": "{role} on surface",
  "Commessa salvata": "Job saved",
  "Le modifiche sono state registrate e condivise con il team.":
    "The changes are recorded and shared with the team.",
  "Scadenza vicina": "Deadline approaching",
  "Restano due giorni per consegnare il collaudo.":
    "Two days left to deliver the inspection.",
  "Sincronizzazione non riuscita": "Synchronisation failed",
  "La connessione è caduta: i dati restano in coda.":
    "The connection dropped: the data stays queued.",
  "Stati": "States",
  "Azione critica": "Critical action",
  "In attesa": "Pending",
  "Approvata": "Approved",
  "Apri il cruscotto": "Open the dashboard",
  "Archiviate": "Archived",
  "Avvia il tour": "Start the tour",
  "Cerca commesse": "Search jobs",
  "Cerca una commessa": "Find a job",
  "Ci siamo": "That is it",
  "Configurazione JSON": "JSON configuration",
  "Filtra per stato": "Filter by state",
  "I passi sono dati, non codice: parseTourConfig legge il JSON e shouldStartTour confronta la versione con quella già vista. Il componente non fa rete e non ricorda nulla: si apre quando l'applicazione chiama start(), e dice con finish se il lettore ha visto tutto.":
    "The steps are data, not code: parseTourConfig reads the JSON and shouldStartTour compares the version with the one already seen. The component does no network access and remembers nothing: it opens when the application calls start(), and reports with finish whether the reader saw everything.",
  "Il numero o il nome del cliente bastano: la ricerca parte da qui.":
    "The job number or the client name is enough: the search starts here.",
  "Il tour non ha slot: il contenuto dei passi è un array, e l'applicazione lo ricava dal JSON con parseTourConfig. Espone i CSS part di ogni pezzo della scheda, dalla layer al singolo testo, per adattarlo alla propria pelle.":
    "The tour has no slots: the content of the steps is an array, and the application builds it from JSON with parseTourConfig. It exposes the CSS parts of every piece of the card, from the layer to the single line of text, to adapt it to its own skin.",
  "In corso e archiviate sono due filtri che si sommano.":
    "In progress and archived are two filters that add up.",
  "Livello fisso che blocca la pagina e contiene il riflettore e la scheda.":
    "Fixed layer that blocks the page and holds the spotlight and the card.",
  "Margine dal bersaglio": "Margin from the target",
  "Numero o cliente": "Number or client",
  "Posizione": "Placement",
  "Questo passo non ha un bersaglio: la scheda resta al centro.":
    "This step has no target: the card stays in the middle.",
  "Riga con il numero del passo e il totale.":
    "Line with the step number and the total.",
  "Riga dei comandi: salta, indietro, avanti o fine.":
    "Command row: skip, back, next or done.",
  "Riquadro che tiene in luce l'elemento del passo e scurisce il resto.":
    "Box that keeps the step element in the light and dims the rest.",
  "Scheda del passo, ancorata al bersaglio o centrata.":
    "Step card, anchored to the target or centred.",
  "Testo del passo.": "Step text.",
  "Titolo del passo, usato anche come nome accessibile della scheda.":
    "Step title, also used as the accessible name of the card.",
  "Tour di primo accesso: oscura la pagina, lascia in luce un elemento e accompagna il lettore nei passi descritti da una configurazione JSON con versione.":
    "First-run tour: dims the page, keeps one element in the light and walks the reader through the steps described by a versioned JSON configuration.",
  "{count} passi. Modifica il JSON e riavvia il tour.":
    "{count} steps. Edit the JSON and start the tour again.",
  "Filtra le commesse": "Filter the jobs",
  "La tabella": "The table",
  "Pilotare il tour e leggere i passi": "Drive the tour and read the steps",
  "Tour dal JSON di configurazione": "Tour from the JSON configuration",
  "Un passo senza bersaglio e l'azione finale":
    "A step without a target and the closing action",
  "I passi non stanno nel codice: parseTourConfig legge il JSON con la versione e shouldStartTour la confronta con quella che l'applicazione ha già mostrato. Il componente non fa rete e non ricorda nulla, quindi è l'applicazione a decidere quando partire e a salvare la versione al finish.":
    "The steps are not in the code: parseTourConfig reads the JSON with its version and shouldStartTour compares it with the one the application already showed. The component does no network access and remembers nothing, so the application decides when to start and stores the version on finish.",
  "Un passo senza target non ha un elemento da mettere in luce: il riflettore copre tutta la pagina e la scheda resta al centro. actionLabel cambia il testo del bottone dell'ultimo passo, mentre placement decide dove si appoggia la scheda rispetto al bersaglio, con auto che sceglie il primo lato che ci sta.":
    "A step without a target has no element to highlight: the spotlight covers the whole page and the card stays in the middle. actionLabel changes the label of the last button, while placement decides which side the card takes against the target, with auto picking the first side that fits.",
  "start accetta l'indice da cui partire, next e back muovono il passo e finish chiude dichiarando se il lettore è arrivato in fondo. step-change porta indice, passo e totale, così l'applicazione può annotare dove si è fermato, e refresh rilegge il bersaglio dopo un cambio di pagina.":
    "start takes the index to open on, next and back move the step and finish closes declaring whether the reader reached the end. step-change carries index, step and total, so the application can record where the reader stopped, and refresh re-reads the target after the page changed.",
  "14 script in coda": "14 scripts queued",
  "3 repliche": "3 replicas",
  "API REST": "REST API",
  "Accettate": "Accepted",
  "Addestramento": "Training",
  "Aggregazione": "Aggregation",
  "Analisi": "Analysis",
  "Analisi statica": "Static analysis",
  "Approvazione": "Approval",
  "Approvazione rilascio": "Release approval",
  "Area di lavoro con la griglia, la vista e lo zoom.": "Work area with the grid, the view and the zoom.",
  "Attende una persona": "Waits for a person",
  "Avvisi": "Notifications",
  "Avviso": "Notification",
  "Avviso al team": "Notify the team",
  "Barra dei comandi: annulla, zoom, adatta, disponi.": "Command bar: undo, zoom, fit, arrange.",
  "Build": "Build",
  "Build backend": "Backend build",
  "Build frontend": "Frontend build",
  "CSV o Parquet su archivio": "CSV or Parquet to storage",
  "Checkout di un repository": "Checkout of a repository",
  "Checkout sorgenti": "Source checkout",
  "Collegamento fra due porte.": "Link between two ports.",
  "Comando di shell": "Shell command",
  "Compilazione e pacchetto": "Compile and package",
  "Condizione sulle righe": "Condition on the rows",
  "Configurazione": "Configuration",
  "Confronto su dati di test": "Comparison on test data",
  "Contenuto aggiuntivo del nodo con quell'id, sotto l'intestazione e le righe delle porte.": "Extra content of the node with that id, under the header and the port rows.",
  "Contenuto del nodo": "Node content",
  "Controllo sicurezza": "Security check",
  "Cruscotto commerciale": "Sales dashboard",
  "Da file a tabella": "From file to table",
  "Data warehouse": "Data warehouse",
  "Data warehouse vendite": "Sales data warehouse",
  "Database": "Database",
  "Dati": "Data",
  "Dati di test": "Test data",
  "Descrizione": "Description",
  "Destinazioni": "Destinations",
  "Duplicati, valori mancanti, formati": "Duplicates, missing values, formats",
  "Editor di grafo aciclico orientato: nodi con porte libere o tipizzate, collegamenti con il motivo di ogni rifiuto, tavolozza dei tipi di nodo, disposizione a livelli, mappa e modifica da puntatore o da tastiera.": "Directed acyclic graph editor: nodes with free or typed ports, links with the reason of every refusal, a palette of node types, layered layout, a map and editing by pointer or keyboard.",
  "Esecuzione": "Execution",
  "Esportazione": "Export",
  "Fatturato per regione": "Revenue by region",
  "File": "File",
  "File CSV": "CSV file",
  "File caricato o su archivio": "Uploaded or stored file",
  "Flusso dati vendite": "Sales data flow",
  "Grafici e indicatori": "Charts and indicators",
  "Grafo minimo": "Minimal graph",
  "Il data warehouse accetta solo righe passate da «Pulizia»": "The data warehouse accepts only rows that went through “Cleaning”",
  "Il flusso ha già un data warehouse": "The flow already has a data warehouse",
  "Immagine container": "Container image",
  "Installa dipendenze": "Install dependencies",
  "Invia a": "Sends to",
  "Join su una chiave comune": "Join on a shared key",
  "L'editor applica da sé la modifica e la riporta con dag-change. Il ciclo è sempre rifiutato; gli altri vincoli li dichiara l'applicazione in constraints, e ogni rifiuto mostra il suo motivo. Con overrides l'applicazione sostituisce il comportamento di un'operazione, e lo slot node-{id} aggiunge contenuto al nodo. L'altezza del host è obbligatoria.": "The editor applies the change itself and reports it with dag-change. A loop is always refused; the other constraints are declared by the application in constraints, and every refusal shows its reason. With overrides the application replaces the behaviour of an operation, and the node-{id} slot adds content to the node. The host needs a height.",
  "L'editor riceve nodes ed edges, applica da sé ogni modifica e la riporta con dag-change, che porta il grafo nuovo e la causa. Un nodo senza porte dichiarate ha un ingresso e un'uscita generici. L'altezza del host è obbligatoria.": "The editor receives nodes and edges, applies every change itself and reports it with dag-change, which carries the new graph and the cause. A node without declared ports has a generic input and output. The host needs a height.",
  "Lettura CSV": "CSV reading",
  "Lettura listino": "Price list reading",
  "Listino prezzi": "Price list",
  "Lo slot node-{id} aggiunge contenuto al nodo con quell'id, sotto l'intestazione e le righe delle porte. Il nodo cresce per contenerlo e le porte seguono la nuova altezza; un pulsante nello slot riceve i propri clic senza avviare il trascinamento.": "The node-{id} slot adds content to the node with that id, under the header and the port rows. The node grows to hold it and the ports follow the new height; a button in the slot receives its own clicks without starting a drag.",
  "Mappa": "Map",
  "Mappa del grafo.": "Map of the graph.",
  "Messaggio a un canale": "Message to a channel",
  "Meteo regionale": "Regional weather",
  "Metriche": "Metrics",
  "Migrazione database": "Database migration",
  "Modello": "Model",
  "Modello di regressione": "Regression model",
  "Nodi, porte e collegamenti arrivano dalle proprietà nodes, edges e kinds. Lo slot node-{id} aggiunge contenuto sotto l'intestazione del nodo con quell'id; il nodo cresce per contenerlo e le porte seguono la nuova altezza.": "Nodes, ports and links come from the nodes, edges and kinds properties. The node-{id} slot adds content under the header of the node with that id; the node grows to hold it and the ports follow the new height.",
  "Ordini 2026": "Orders 2026",
  "Ordini con prezzi": "Orders with prices",
  "Porte tipizzate e vincoli": "Typed ports and constraints",
  "Previsione domanda": "Demand forecast",
  "Pubblicazione in un ambiente": "Publication to an environment",
  "Pulizia": "Cleaning",
  "Pulizia ordini": "Order cleaning",
  "Punto di collegamento di un nodo.": "Connection point of a node.",
  "Riceve da": "Receives from",
  "Righe pulite": "Clean rows",
  "Righe scartate": "Discarded rows",
  "Rilascio in collaudo": "Release to staging",
  "Rilascio in produzione": "Release to production",
  "Riquadro di un nodo.": "Box of a node.",
  "Risposta JSON resa tabellare": "JSON response as a table",
  "Scansione delle dipendenze": "Dependency scan",
  "Scansione vulnerabilità": "Vulnerability scan",
  "Scartate": "Discarded",
  "Script": "Script",
  "Solo Italia": "Italy only",
  "Somme e medie per gruppo": "Sums and averages by group",
  "Sorgente gestita dall'amministratore dei dati": "Source managed by the data administrator",
  "Sorgenti": "Sources",
  "Sostituire un'operazione": "Replacing an operation",
  "Suite di test automatici": "Automated test suite",
  "Tabella di un database relazionale": "Table of a relational database",
  "Tabella storicizzata": "Historised table",
  "Tavolozza dei tipi di nodo.": "Palette of node types.",
  "Test": "Test",
  "Test end-to-end": "End-to-end tests",
  "Test unitari": "Unit tests",
  "Trasformazioni": "Transformations",
  "Una porta con type entra solo in una porta dello stesso tipo, o di uno compatibile secondo typeCompatible; max limita i suoi collegamenti. constraints aggiunge le regole dell'applicazione: ogni funzione restituisce true oppure il motivo del rifiuto, che l'editor mostra durante il trascinamento, nel menu e con dag-connection-rejected.": "A port with type goes only into a port of the same type, or of a compatible one according to typeCompatible; max limits its links. constraints adds the rules of the application: every function returns true or the reason of the refusal, which the editor shows while dragging, in the menu and with dag-connection-rejected.",
  "Unione": "Join",
  "Valutazione": "Evaluation",
  "Valutazione previsione": "Forecast evaluation",
  "aggiornato ogni notte": "updated every night",
  "chiave: codice articolo": "key: item code",
  "metriche": "metrics",
  "modello": "model",
  "overrides sostituisce il comportamento di un'operazione: add, connect, move, arrange, duplicate e delete. La funzione riceve la richiesta e apply, che esegue la modifica predefinita; se apply non viene chiamata il grafo resta com'è, e l'applicazione può aggiornarlo da sé.": "overrides replaces the behaviour of an operation: add, connect, move, arrange, duplicate and delete. The function receives the request and apply, which performs the default change; when apply is not called the graph stays as it is, and the application can update it itself.",
  "regressione · 12 variabili": "regression · 12 variables",
  "responsabile di prodotto": "product owner",
  "rimuove 1,8% di duplicati": "removes 1.8% duplicates",
  "somma per regione e mese": "sum by region and month",
  "tabella": "table",
  "ultimi 90 giorni": "last 90 days",
  "{rows} righe": "{rows} rows",
};

export default messages;
