/** Italian source text → French. Keys come from scripts/i18n-keys.mjs. */
const messages: Record<string, string> = {
  'Vibrant è disponibile solo con menu verticale. Il menu si apre con show(anchor). tail="none" disegna il menu senza coda, con i quattro angoli uguali. Con filterable il menu mostra un campo di filtro; sotto 480px il menu verticale diventa un foglio dal basso.':
    "Vibrant n'est disponible qu'avec le menu vertical. Le menu s'ouvre avec show(anchor). tail=\"none\" dessine le menu sans queue, avec quatre angles égaux. Avec filterable le menu affiche un champ de filtre ; sous 480px le menu vertical devient une feuille par le bas.",
  "## Aggiornamento dei dati": "## Mise à jour des données",
  "Aggiornamento dei dati": "Mise à jour des données",
  "Comprimibile": "Rétractable",
  "Gruppo che contiene la pagina corrente, aperto o chiuso che sia.":
    "Groupe qui contient la page courante, qu'il soit ouvert ou fermé.",
  "Il componente ridisegna quando riceve una nuova proprietà. Non osserva le mutazioni interne all'array: un valore riassegnato con lo stesso riferimento non produce aggiornamenti. La tabella riporta i casi misurati.":
    "Le composant redessine quand il reçoit une nouvelle propriété. Il n'observe pas les mutations internes au tableau : une valeur réaffectée avec la même référence ne produit aucune mise à jour. Le tableau liste les cas mesurés.",
  "Il componente ridisegna quando riceve una nuova proprietà. Non osserva le mutazioni interne all'array: un valore riassegnato con lo stesso riferimento non produce aggiornamenti.":
    "Le composant redessine quand il reçoit une nouvelle propriété. Il n'observe pas les mutations internes au tableau : une valeur réaffectée avec la même référence ne produit aucune mise à jour.",
  "JavaScript, mutazione sul posto": "JavaScript, mutation sur place",
  "Vue, stato derivato": "Vue, état dérivé",
  "La proprietà è un array dell'applicazione: il componente lo legge e non lo modifica. Il riferimento resta l'unico segnale di cambiamento, tranne la chiamata esplicita a refresh().":
    "La propriété est un tableau de l'application : le composant le lit sans le modifier. La référence reste le seul signal de changement, sauf l'appel explicite à refresh().",
  "La voce non si compone con uno slot: il componente chiama item per ogni voce dell'albero e railItem quando la barra è ridotta, così il contenuto si dichiara una volta sola. item riceve anche active, current ed expanded, quindi la riga attiva si veste senza chiudere lo stato nell'handler. Le regole CSS del markup si passano in contentStyles.":
    "L'entrée n'est pas composée avec un slot : le composant appelle item pour chaque entrée de l'arbre et railItem quand la barre est étroite, le contenu n'est donc déclaré qu'une fois. item reçoit aussi active, current et expanded, la ligne active s'habille donc sans capturer l'état dans le gestionnaire. Le CSS de ce balisage va dans contentStyles.",
  "Le voci troppo lunghe finiscono con i puntini e mostrano il testo intero in un tooltip. Nella rail i gruppi si aprono in un menu accanto. `collapsible` mostra o nasconde il comando che comprime la barra; `guide` disegna una linea guida sotto ogni gruppo. Le parti `item-current`, `item-active`, `item-group` e `level-1`, `level-2`, `level-3` vestono una riga per stato e per livello.":
    "Les libellés trop longs finissent par des points de suspension et affichent le texte entier dans une infobulle. Dans le rail, les groupes s'ouvrent dans un menu à côté. `collapsible` affiche ou masque la commande qui replie la barre ; `guide` trace une ligne de guide sous chaque groupe. Les parties `item-current`, `item-active`, `item-group` et `level-1`, `level-2`, `level-3` habillent une ligne par état et par niveau.",
  "Linea guida": "Ligne de guide",
  "Maniglia che regola la larghezza della barra.":
    "Poignée qui règle la largeur de la barre.",
  "Non ridisegna: l'array è lo stesso oggetto e il confronto è per riferimento.":
    "Ne redessine pas : le tableau est le même objet et la comparaison se fait par référence.",
  "Operazione": "Opération",
  "Risultato": "Résultat",
  "React assegna una nuova proprietà a ogni cambio, quindi ridisegna.":
    "React affecte une nouvelle propriété à chaque changement, donc il redessine.",
  "Ridisegna con i dati mutati.": "Redessine avec les données mutées.",
  "Ridisegna: il riferimento è nuovo.":
    "Redessine : la référence est nouvelle.",
  "Riga che corrisponde alla pagina corrente.":
    "Ligne qui correspond à la page courante.",
  "Riga della navigazione, uguale per voce semplice e gruppo; porta anche il livello e lo stato con le parti qui sotto.":
    "Ligne de navigation, identique pour une entrée simple et pour un groupe ; elle porte aussi le niveau et l'état par les parties ci-dessous.",
  "Riga di primo livello.": "Ligne de premier niveau.",
  "Riga di secondo livello, dentro un gruppo.":
    "Ligne de deuxième niveau, dans un groupe.",
  "Riga di terzo livello, dentro un gruppo annidato.":
    "Ligne de troisième niveau, dans un groupe imbriqué.",
  "Riga di un gruppo che apre un sottoelenco.":
    "Ligne d'un groupe qui ouvre une sous-liste.",
  "Sottoelenco aperto da un gruppo.": "Sous-liste ouverte par un groupe.",
  "Vue assegna una nuova proprietà a ogni cambio, quindi ridisegna.":
    "Vue affecte une nouvelle propriété à chaque changement, donc il redessine.",
  "non ridisegna, il riferimento è lo stesso":
    "ne redessine pas, la référence est la même",
  "ridisegna": "redessine",
  "ridisegna con i dati mutati": "redessine avec les données mutées",
  "Anteprima di {title}": "Aperçu de {title}",
  "Apri in CodePen": "Ouvrir dans CodePen",
  "Apri nel playground": "Ouvrir dans le bac à sable",
  "Esegui": "Exécuter",
  "Esempio copiato": "Exemple copié",
  "Pannelli dell'esempio": "Panneaux de l'exemple",
  "Reimposta": "Réinitialiser",
  "Esempio di renderer di cella": "Exemple de renderer de cellule",
  "Il componente chiama le funzioni dell'applicazione: column.render per ogni cella, rowRenderer per l'intera riga, detail per la riga aperta, groupSummary per gruppo. Gli slot coprono solo le aree esterne.":
    "Le composant appelle les fonctions de l'application : column.render pour chaque cellule, rowRenderer pour la ligne entière, detail pour la ligne ouverte, groupSummary par groupe. Les emplacements ne couvrent que les zones externes.",
  "Slot del framework tramite wrapper":
    "Emplacement du framework via un wrapper",
  "Vue e React non possono passare uno slot con scope a un elemento personalizzato. Un wrapper di poche righe trasforma la slot in un renderer: la pagina scrive il template della cella una volta, il wrapper monta il contenuto per ogni riga e libera la memoria quando la cella esce dal documento.":
    "Vue et React ne peuvent pas transmettre un emplacement avec portée à un élément personnalisé. Un wrapper de quelques lignes transforme l'emplacement en renderer : la page écrit le template de la cellule une fois, le wrapper monte le contenu pour chaque ligne et libère la mémoire quand la cellule quitte le document.",
  "Il componente chiama column.render per ogni cella, una volta per riga: qui si decide il contenuto e non si prepara nulla in anticipo. La funzione restituisce un nodo o una stringa; rowRenderer sostituisce invece l'intera riga.":
    "Le composant appelle column.render pour chaque cellule, une fois par ligne : le contenu se décide ici, rien n'est préparé à l'avance. La fonction renvoie un nœud ou une chaîne ; rowRenderer remplace la ligne entière.",
  "Il componente chiama le funzioni che gli passi: column.render per ogni cella, detail per la riga aperta, groupSummary per gruppo. Gli slot servono solo alle aree esterne, come intestazione, stati e piè di pagina.":
    "Le composant appelle les fonctions que vous fournissez : column.render pour chaque cellule, detail pour la ligne ouverte, groupSummary par groupe. Les emplacements ne couvrent que les zones externes, comme l'en-tête, les états et le pied.",
  "group-by accetta la chiave di una colonna con groupable. Il componente chiama groupSummary con le righe del gruppo, oppure groupRenderer per sostituire l'intera intestazione del gruppo.":
    "group-by accepte la clé d'une colonne avec groupable. Le composant appelle groupSummary avec les lignes du groupe, ou groupRenderer pour remplacer tout l'en-tête du groupe.",
  "Registrare i componenti": "Enregistrer les composants",
  "Tabella minima": "Table minimale",
  "Formattare i valori": "Formater les valeurs",
  "Cella personalizzata": "Cellule personnalisée",
  "Ordinamento": "Tri",
  "Selezione delle righe": "Sélection des lignes",
  "Dettaglio della riga": "Détail de la ligne",
  "Raggruppamento": "Regroupement",
  "Paginazione": "Pagination",
  "Caricamento, errore e vuoto": "Chargement, erreur et vide",
  "Colonne fisse, larghezze e visibilità":
    "Colonnes fixes, largeurs et visibilité",
  "Scorrimento continuo": "Défilement continu",
  "Stile tramite CSS part": "Style via les parties CSS",
  "Il componente è un elemento personalizzato e va registrato una volta. Vue e React richiedono una dichiarazione in più perché i tag bolle-* non sono elementi noti.":
    "Le composant est un élément personnalisé et doit être enregistré une fois. Vue et React demandent une déclaration supplémentaire car les balises bolle-* ne sont pas des éléments connus.",
  "columns dichiara le colonne, rows i dati. row-key indica il campo univoco di ogni riga. Gli array si passano come proprietà, non come attributi.":
    "columns déclare les colonnes, rows les données. row-key indique le champ unique de chaque ligne. Les tableaux se passent comme propriétés, pas comme attributs.",
  "value trasforma il valore di una cella in testo. Serve per importi, date e numeri: la tabella continua a mostrare una sola riga di testo per cella.":
    "value transforme la valeur d'une cellule en texte. À utiliser pour les montants, les dates et les nombres : la table affiche toujours une seule ligne de texte par cellule.",
  "loading copre la tabella durante il primo caricamento, updating la attenua mantenendo le righe, error mostra il messaggio ricevuto. Le azioni dello stato vuoto si passano nello slot empty.":
    "loading couvre la table pendant le premier chargement, updating l'atténue en gardant les lignes, error affiche le message reçu. Les actions de l'état vide vont dans l'emplacement empty.",
  "virtual disegna solo le righe visibili. L'host deve avere un'altezza definita, altrimenti la tabella non ha un'area di scorrimento. row-height regola l'altezza stimata di ogni riga.":
    "virtual ne dessine que les lignes visibles. L'hôte doit avoir une hauteur définie, sinon la table n'a pas de zone de défilement. row-height règle la hauteur estimée de chaque ligne.",
  "Le parti pubbliche si raggiungono con ::part dal foglio dell'applicazione e valgono per tutte le righe. Il contenuto dei renderer si stila con contentStyles, perché vive nello shadow root.":
    "Les parties publiques sont atteintes avec ::part depuis la feuille de l'application et valent pour toutes les lignes. Le contenu des renderers se style avec contentStyles, car il vit dans le shadow root.",
  "Linguaggio degli esempi": "Langue des exemples",
  "## Uso nel codice": "## Utilisation dans le code",
  "Uso nel codice": "Utilisation dans le code",
  "Cella personalizzata": "Cellule personnalisée",
  "Selezione delle righe": "Sélection des lignes",
  "Dettaglio della riga": "Détail de la ligne",
  "Raggruppamento": "Regroupement",
  "Paginazione": "Pagination",
  "Scorrimento continuo": "Défilement continu",
  "Stile tramite CSS part": "Style via les parties CSS",
  "loading copre la tabella durante il primo caricamento, updating la attenua mantenendo le righe, error mostra il messaggio ricevuto. Le azioni dello stato vuoto si passano nello slot empty.":
    "loading couvre la table pendant le premier chargement, updating l'atténue en gardant les lignes, error affiche le message reçu. Les actions de l'état vide vont dans l'emplacement empty.",
  "## Anatomia pubblica": "## Anatomie publique",
  "Anatomia pubblica": "Anatomie publique",
  "CSS part": "Partie CSS",
  "Slot": "Emplacement",
  "Esempio completo": "Exemple complet",
  "Parte pubblica dello stile del componente.":
    "Partie publique du style du composant.",
  "Slot pubblico da usare per il contenuto indicato dal nome.":
    "Emplacement public pour le contenu indiqué par le nom.",
  "I segnaposto hanno questo significato: {rowId} è il valore di rowKey, {columnKey} è il campo key della colonna, {groupName} è il valore del gruppo e {id} è l'identificatore dell'elemento.":
    "Les espaces réservés ont les significations suivantes : {rowId} est la valeur de rowKey, {columnKey} est le champ key de la colonne, {groupName} est la valeur du groupe et {id} est l'identifiant de l'élément.",
  "Slot e CSS part sono un contratto di composizione. Le parti interne senza elenco restano private al componente.":
    "Les emplacements et les parties CSS forment un contrat de composition. Les parties internes absentes de la liste restent privées.",
  "L'applicazione riempie gli slot, la shell decide la forma misurando la propria larghezza: sotto 840px la navigazione passa sotto il contenuto e il pannello diventa un foglio, oltre 1240px la navigazione resta estesa. Allargando la finestra l'anteprima passa da sola alla forma più ampia.":
    "L'application remplit les slots ; la shell choisit la forme en mesurant sa propre largeur : sous 840px la navigation passe sous le contenu et le panneau devient une feuille, au-delà de 1240px la navigation reste étendue. En élargissant la fenêtre, l'aperçu passe seul à la forme la plus large.",
  "42 commesse attive · 7 in ritardo · 3 collaudi questa settimana":
    "42 affaires actives · 7 en retard · 3 réceptions cette semaine",
  "5 cantieri aperti": "5 chantiers ouverts",
  "6 commesse con scadenza superata": "6 affaires en retard",
  "9 riquadri": "9 tuiles",
  "Applicazione": "Application",
  "Attività recenti": "Activité récente",
  "Avanzamento cantieri": "Avancement des chantiers",
  "Cantieri": "Chantiers",
  "Carico": "Charge",
  "Carico per responsabile": "Charge par responsable",
  "Colonne": "Colonnes",
  "Fatturato": "Chiffre d'affaires",
  "Fatturato per mese": "Chiffre d'affaires par mois",
  "Griglia a dodici colonne di riquadri: ampiezza, ordine, ridimensionamento e riordino, con il layout che resta all'applicazione.":
    "Grille de tuiles sur douze colonnes : largeur, ordre, redimensionnement et réorganisation, le layout restant à l'application.",
  "Lavori in ritardo": "Travaux en retard",
  "Ogni riquadro dichiara la propria ampiezza con span e un minimo con min-span. Il riquadro si sposta trascinando la maniglia, con Alt e le frecce o dal menu, e si allarga trascinando l'angolo o con le frecce. Ogni modifica arriva con layout-change.":
    "Chaque tuile déclare sa largeur avec span et un minimum avec min-span. Une tuile se déplace en faisant glisser sa poignée, avec Alt et les flèches ou depuis son menu, et se redimensionne en tirant le coin ou avec les flèches. Chaque changement arrive avec layout-change.",
  "Pannello secondario": "Panneau secondaire",
  "Personale": "Personnel",
  "Regioni di un'applicazione gestionale: barra superiore, navigazione, contenuto, pannello secondario e barra di stato, con la forma che cambia secondo la larghezza.":
    "Régions d'une application de gestion : barre supérieure, navigation, contenu, panneau secondaire et barre d'état, la forme changeant avec la largeur.",
  "Riquadri del cruscotto": "Tuiles du tableau de bord",
  "Sposta o allarga un riquadro": "Déplacez ou redimensionnez une tuile",
  "Ultimo aggiornamento 22:31": "Dernière mise à jour 22:31",
  "lunedì 16 novembre 2026": "lundi 16 novembre 2026",
  "ore assegnate su 40 settimanali": "heures attribuées sur 40 par semaine",
  "ultime 24 ore": "dernières 24 heures",
  "ultimi dodici mesi, in migliaia di €":
    "douze derniers mois, en milliers d'€",
  "Apri scheda": "Ouvrir la fiche",
  "Archivia": "Archiver",
  "Cliente": "Client",
  "Commessa": "Affaire",
  "Comune": "Commune",
  "Dettaglio riga": "Détail de la ligne",
  "Duplica commessa": "Dupliquer l'affaire",
  "Importo": "Montant",
  "Inizio lavori": "Début des travaux",
  "Raggruppa per": "Grouper par",
  "Responsabile": "Responsable",
  "Righe per pagina": "Lignes par page",
  "Scadenza": "Échéance",
  "Scorrimento continuo": "Défilement continu",
  "Stato": "Statut",
  "commesse": "affaires",
  "Elenco di righe con colonne dichiarate dall'applicazione: ordinamento anche multiplo, gruppi, pagine, selezione, dettaglio della riga e colonne regolabili.":
    "Liste de lignes avec colonnes déclarées par l'application : tri simple et multiple, groupes, pages, sélection, détail de la ligne et colonnes redimensionnables.",
  " · prima {color}": " · avant {color}",
  "## Esempio": "## Exemple",
  "## Limiti aperti": "## Limites connues",
  "## Supporto": "## Prise en charge",
  ", prima {color}": ", avant {color}",
  "12 non letti": "12 non lus",
  "Accenti colorati con superfici grigie.":
    "Accents colorés sur surfaces grises.",
  "Accento": "Accent",
  "Accessibile per costruzione": "Accessible par conception",
  "Accessibilità": "Accessibilité",
  "Accetto i termini": "J'accepte les conditions",
  "Aiuto": "Aide",
  "Algoritmo": "Algorithme",
  "Allineamento": "Alignement",
  "Altre opzioni": "Plus d'options",
  "Altri componenti": "Autres composants",
  "Altri token": "Autres tokens",
  "Ambra": "Ambre",
  "Angolo stretto delle card": "Angle étroit des cartes",
  "Angolo stretto rivolto all'origine": "Angle étroit tourné vers l'origine",
  "Annulla": "Annuler",
  "Anteprima": "Aperçu",
  "Anteprima del CSS": "Aperçu du CSS",
  "Applica": "Appliquer",
  "Apri": "Ouvrir",
  "Apri dialog": "Ouvrir la dialog",
  "Apri drawer": "Ouvrir le drawer",
  "Apri foglio": "Ouvrir la feuille",
  "Apri in nuova scheda": "Ouvrir dans un nouvel onglet",
  "Apri navigazione": "Ouvrir la navigation",
  "Apri pannello": "Ouvrir le panneau",
  "Apri una dialog": "Ouvrir une dialog",
  "Archivio": "Archives",
  "Ariosa": "Aérée",
  "Armonia · Analoga": "Harmonie · Analogue",
  "Armonia · Complementare": "Harmonie · Complémentaire",
  "Armonia · Complementare divisa": "Harmonie · Complémentaire divisée",
  "Armonia · Quadrato": "Harmonie · Carré",
  "Armonia · Triade": "Harmonie · Triade",
  "Aspetto": "Apparence",
  "Assist, filter, input e suggestion, con elevazione, rimozione e avatar.":
    "Assist, filter, input et suggestion, avec élévation, suppression et avatar.",
  "Attivazione": "Activation",
  "Attivo": "Actif",
  "Attributo": "Attribut",
  "Avanzamento": "Progression",
  "Avanzamento lineare o circolare, determinato o indeterminato, anche ondulato.":
    "Progression linéaire ou circulaire, déterminée ou indéterminée, éventuellement ondulée.",
  "Azione": "Action",
  "Azione flottante con taglie e sei mappature di colore.":
    "Action flottante avec tailles et six mappages de couleur.",
  "Azione principale affiancata da un menu di azioni alternative.":
    "Action principale accompagnée d'un menu d'actions alternatives.",
  "Azione principale o secondaria, con stati di toggle, link e invio form.":
    "Action principale ou secondaire, avec états toggle, lien et envoi de formulaire.",
  "Azioni": "Actions",
  "Azioni documento": "Actions du document",
  "Badge": "Badge",
  "Barra superiore con sette layout, sottotitolo, slot e stato di scorrimento.":
    "Barre supérieure avec sept layouts, sous-titre, slots et état de défilement.",
  "Bianche": "Blanches",
  "Bianco": "Blanc",
  "Bolla · primario": "Bulle · primaire",
  "Bolla-valore, livello liquido, membrana o intervallo a gocce che si fondono.":
    "Bulle-valeur, niveau liquide, membrane ou intervalle de gouttes qui fusionnent.",
  "Bolle è una libreria di componenti che prende i token, la struttura e l'accessibilità di Material 3 e li avvolge in una pelle nuova: forme a fumetto, una pellicola iridescente e un movimento che si schiaccia e scoppia.":
    "Bolle est une bibliothèque de composants qui reprend les tokens, la structure et l'accessibilité de Material 3 et les enveloppe d'une nouvelle peau : des formes de bulle de BD, un film irisé et un mouvement qui s'écrase et éclate.",
  "Bosco": "Forêt",
  "Bottone con sola icona; l'etichetta accessibile è obbligatoria.":
    "Bouton avec icône seule ; le libellé accessible est obligatoire.",
  "Campo a riga singola o multilinea, con affissi, contatore, errore e slot icona.":
    "Champ sur une ligne ou multiligne, avec affixes, compteur, erreur et slots d'icône.",
  "Campo di testo con suggerimenti da option native, filtro durante la digitazione e ruolo combobox.":
    "Champ de texte avec suggestions issues d'options natives, filtrage pendant la saisie et rôle combobox.",
  "Caricamento": "Chargement",
  "Cartelle": "Dossiers",
  "Casa": "Maison",
  "Catalogo": "Catalogue",
  "Categorie": "Catégories",
  "Centro": "Centre",
  "Cerca": "Rechercher",
  "Cerca città": "Rechercher une ville",
  "Cerca nella posta": "Rechercher dans les e-mails",
  "Cestino": "Corbeille",
  "Chiudi": "Fermer",
  "Chiusura": "Fermeture",
  "Ciclo orario": "Format horaire",
  "Città di consegna": "Ville de livraison",
  "Coda": "Pointe",
  "Codice": "Code",
  "Codice copiato": "Code copié",
  "Codice dell'esempio": "Code de l'exemple",
  "Collegamento": "Lien",
  "Colore": "Couleur",
  "Colore personalizzato": "Couleur personnalisée",
  "Colore seed": "Couleur seed",
  "Colore selezionato · {name}": "Couleur sélectionnée · {name}",
  "Colore · {name}": "Couleur · {name}",
  "Colori": "Couleurs",
  "Colori di base": "Couleurs de base",
  "Come in Material 3, Primary diventa il tono 40 (chiaro) o 80 (scuro) della palette del seme.":
    "Comme dans Material 3, Primary devient le ton 40 (clair) ou 80 (sombre) de la palette de la graine.",
  "Come tonal spot, con colori più saturi.":
    "Comme tonal spot, avec des couleurs plus saturées.",
  "Come è fatta una bolla": "Anatomie d'une bulle",
  "Comparsa": "Apparition",
  "Compatta": "Compacte",
  "Componenti": "Composants",
  "Componenti morbidi, regole rigorose.": "Composants doux, règles strictes.",
  "Compresso": "Réduit",
  "Con href l'intera card diventa un link: è il modo di portare a un'altra pagina con una superficie, mentre i bottoni restano per le azioni. Una card-link non deve contenere altri controlli interattivi. La coda punta da dove arriva l'utente: una card sotto il contenuto la gira in alto, dal lato opposto alla direzione in cui porta. Con tail=\"none\" la coda sparisce e la card resta una bolla con i quattro angoli uguali.":
    "Avec href, toute la carte devient un lien : c'est la façon de mener vers une autre page avec une surface, tandis que les boutons restent réservés aux actions. Une carte-lien ne doit contenir aucun autre contrôle interactif. La pointe indique d'où vient l'utilisateur : une carte placée sous le contenu la tourne vers le haut, à l'opposé de la direction où elle mène. Avec tail=\"none\", la pointe disparaît et la carte reste une bulle aux quatre coins égaux.",
  "Con movimento ridotto solo dissolvenze.":
    "Avec le mouvement réduit, uniquement des fondus.",
  "Condividi": "Partager",
  "Conferma": "Confirmer",
  "Contatore": "Compteur",
  "Contatore o punto di notifica; con etichetta diventa uno stato annunciato.":
    "Compteur ou point de notification ; avec un libellé, il devient un état annoncé.",
  "Contenuto": "Contenu",
  "Contenuto aggiuntivo del drawer.": "Contenu supplémentaire du drawer.",
  "Contenuto indipendente con un'azione interna.":
    "Contenu indépendant avec une action interne.",
  "Contrasto": "Contraste",
  "Controlli": "Contrôles",
  "Controlli dei token": "Contrôles des tokens",
  "Copia": "Copier",
  "Copia CSS": "Copier le CSS",
  "Copia collegamento": "Copier le lien",
  "Copia il comando": "Copier la commande",
  "Copia il comando di installazione": "Copier la commande d'installation",
  "Copia pagina": "Copier la page",
  "Corallo": "Corail",
  "Corsivo": "Italique",
  "Cosa è implementato e cosa manca rispetto a Material 3, dal catalogo del README (in inglese). Copertura della voce non significa conformità completa.":
    "Ce qui est implémenté et ce qui manque par rapport à Material 3, d'après le catalogue du README (en anglais). Couvrir une entrée ne signifie pas une conformité complète.",
  "Crea": "Créer",
  "Crea documento": "Créer un document",
  "Curva della molla --bb-tension: supera il valore finale del 16% e oscilla prima di fermarsi":
    "Courbe du ressort --bb-tension : dépasse la valeur finale de 16 % et oscille avant de s'arrêter",
  "Da due a cinque segmenti con selezione singola o multipla.":
    "De deux à cinq segments, avec sélection simple ou multiple.",
  "Da due a sei azioni correlate aperte da un FAB.":
    "De deux à six actions liées ouvertes depuis un FAB.",
  "Da tre a cinque destinazioni, baseline o flexible, con layout orizzontale.":
    "De trois à cinq destinations, baseline ou flexible, avec layout horizontal.",
  "Da tre a sette livelli con nome, disegnati come bolle che crescono.":
    "De trois à sept niveaux nommés, dessinés comme des bulles qui grossissent.",
  "Data appuntamento": "Date du rendez-vous",
  "Data finale": "Date de fin",
  "Data iniziale": "Date de début",
  "Data singola o intervallo, con selettore modale o calendario docked.":
    "Date unique ou plage, avec sélecteur modal ou calendrier docked.",
  "Decorativo": "Décoratif",
  "Default": "Par défaut",
  "Densità": "Densité",
  "Densità della tavolozza": "Densité de la palette",
  "Destra": "Droite",
  "Determina il fuso orario della spedizione.":
    "Détermine le fuseau horaire de l'expédition.",
  "Dettagli": "Détails",
  "Dettagli del documento selezionato.": "Détails du document sélectionné.",
  "Dichiarato · attivo": "Déclaré · actif",
  "Dimensione": "Taille",
  "Dimensione base": "Taille de base",
  "Dimensione base (px)": "Taille de base (px)",
  "Direzione RTL": "Direction RTL",
  "Direzione del testo": "Direction du texte",
  "Disabilitata": "Désactivée",
  "Disabilitato": "Désactivé",
  "Display e headline large": "Display et headline large",
  "Distanza dell'anello dal controllo": "Distance de l'anneau au contrôle",
  "Documenti": "Documents",
  "Documenti recenti": "Documents récents",
  "Documenti salvati": "Documents enregistrés",
  "Documenti salvati.": "Documents enregistrés.",
  "Documento": "Document",
  "Documento di esempio": "Document d'exemple",
  "Documento eliminato": "Document supprimé",
  "Dopo": "Après",
  "Drawer di sezioni modale o standard, con contenuto aggiuntivo.":
    "Drawer de sections modal ou standard, avec contenu supplémentaire.",
  "Duplica": "Dupliquer",
  "Durata (ms)": "Durée (ms)",
  "Elenco componenti": "Liste des composants",
  "Elenco dei token che il CSS di {tag} usa, con il valore dichiarato accanto a quello attivo. Ogni valore si scrive per intero (px o altra unità) e la modifica vale per tutti gli esempi del componente. Colori e forma restano token globali del tema attivo; i token dei componenti annidati appartengono al componente che li usa.":
    "Liste des tokens utilisés par le CSS de {tag}, avec la valeur déclarée à côté de la valeur active. Chaque valeur s'écrit en entier (px ou autre unité) et la modification s'applique à tous les exemples du composant. Les couleurs et la forme restent des tokens globaux du thème actif ; les tokens des composants imbriqués appartiennent au composant qui les utilise.",
  "Elevata": "Élevée",
  "Elimina": "Supprimer",
  "Eliminare il documento?": "Supprimer le document ?",
  "Eliminare la bozza?": "Supprimer le brouillon ?",
  "Email": "E-mail",
  "Errore": "Erreur",
  "Esadecimale": "Hexadécimal",
  "Esempio di componenti Bolle": "Exemple de composants Bolle",
  "Esempio di navigazione": "Exemple de navigation",
  "Espanso": "Étendu",
  "Esporta e importa": "Exporter et importer",
  "Estesa": "Étendue",
  "Etichetta": "Libellé",
  "Etichetta accessibile": "Libellé accessible",
  "Etichetta azione": "Libellé de l'action",
  "Etichetta chiusura": "Libellé de fermeture",
  "Etichetta del gruppo": "Libellé du groupe",
  "Etichetta menu": "Libellé du menu",
  "Etichetta precedente": "Libellé précédent",
  "Etichetta rimozione": "Libellé de suppression",
  "Etichetta successivo": "Libellé suivant",
  "Etichette, nomi accessibili e testi tradotti arrivano dal contenuto del chiamante: il componente non inventa testo.":
    "Les libellés, noms accessibles et textes traduits viennent du contenu de l'appelant : le composant n'invente aucun texte.",
  "FAB esteso con testo visibile e icona opzionale.":
    "FAB étendu avec texte visible et icône facultative.",
  "Filtra componenti": "Filtrer les composants",
  "Filtra suggerimenti": "Filtrer les suggestions",
  "Filtri": "Filtres",
  "Filtro": "Filtre",
  "Finestra modale o non modale, con azioni e variante a schermo intero.":
    "Fenêtre modale ou non modale, avec actions et variante plein écran.",
  "Foglio ancorato in basso, modale o standard, con maniglia di trascinamento.":
    "Feuille ancrée en bas, modale ou standard, avec poignée de glissement.",
  "Fondamenta": "Foundations",
  "Font testo": "Police du texte",
  "Font titoli": "Police des titres",
  "Forma": "Forme",
  "Forma e testo": "Forme et texte",
  "Forma, colore e tipografia applicati a una scheda.":
    "Forme, couleur et typographie appliquées à une carte.",
  "Formato": "Format",
  "Forme": "Formes",
  "Galleggiamento": "Flottement",
  "Genera da Primary": "Générer depuis Primary",
  "Giorno": "Jour",
  "Gonfia un tema da un solo colore.":
    "Gonfle un thème à partir d'une seule couleur.",
  "Gradiente conico completo": "Dégradé conique complet",
  "Grafite": "Graphite",
  "Grassetto": "Gras",
  "Gruppo con selezione singola o multipla, navigazione da tastiera e geometria connessa.":
    "Groupe avec sélection simple ou multiple, navigation au clavier et géométrie connectée.",
  "Guarda i componenti": "Voir les composants",
  "Guarda il bordo: la dialog sale e scende di un paio di pixel.":
    "Regardez le bord : la dialog monte et descend de quelques pixels.",
  "Home": "Accueil",
  "I due vicini del complementare (+150° e +210°).":
    "Les deux voisines de la complémentaire (+150° et +210°).",
  "I ruoli tonali garantiscono il contrasto; l'iridescenza non indica mai uno stato da sola.":
    "Les rôles tonals garantissent le contraste ; l'irisation n'indique jamais un état à elle seule.",
  "Icona finale": "Icône de fin",
  "Icona iniziale": "Icône de début",
  "Icone": "Icônes",
  "Icone Tabler": "Icônes Tabler",
  "Il CSS non contiene token Bolle riconosciuti.":
    "Le CSS ne contient aucun token Bolle reconnu.",
  "Il JSON contiene tema chiaro e scuro, forme, tipografia e densità, compresi i token delle dimensioni ridotti per la densità compatta, e si reimporta qui. Il CSS è pronto per il tuo foglio di stile: tema chiaro su {light}, colori scuri su {dark}, dimensioni compatte su {density}.":
    "Le JSON contient les thèmes clair et sombre, les formes, la typographie et la densité, y compris les tokens de dimension réduits pour la densité compacte, et se réimporte ici. Le CSS est prêt pour votre feuille de style : thème clair sur {light}, couleurs sombres sur {dark}, dimensions compactes sur {density}.",
  "Il JSON non è un'esportazione dei token Bolle.":
    "Le JSON n'est pas un export des tokens Bolle.",
  "Il colore dinamico di Material 3 genera i ruoli tonali; Bolle ne ricava anche la pellicola. Scegli un seed e guarda cosa cambia: il tema vale per tutto il sito.":
    "La couleur dynamique de Material 3 génère les rôles tonals ; Bolle en dérive aussi le film. Choisissez une seed et observez ce qui change : le thème s'applique à tout le site.",
  "Il colore funzionale arriva dai ruoli tonali di M3, generati dal seed #5B4CF0 con npm run colors. La pellicola è un livello decorativo a parte. L'accento Scoppio è riservato a call to action rare.":
    "La couleur fonctionnelle vient des rôles tonals de M3, générés depuis la seed #5B4CF0 avec npm run colors. Le film est une couche décorative à part. L'accent Éclatement est réservé à de rares call to action.",
  "Il colore resta M3.": "La couleur reste M3.",
  "Il file JSON non è valido.": "Le fichier JSON n'est pas valide.",
  "Il file è troppo grande (massimo 512 KB).":
    "Le fichier est trop volumineux (512 Ko maximum).",
  "Il livello più alto, con tinta del primario":
    "Le niveau le plus haut, teinté de primaire",
  "Il seme è il valore corrente di Primary; la generazione sostituisce tutti gli altri ruoli del tema chiaro.":
    "La graine est la valeur actuelle de Primary ; la génération remplace tous les autres rôles du thème clair.",
  "Il seme è il valore corrente di Primary; la generazione sostituisce tutti gli altri ruoli del tema scuro.":
    "La graine est la valeur actuelle de Primary ; la génération remplace tous les autres rôles du thème sombre.",
  "Il testo di base usa la dimensione scelta: etichette, campi e paragrafi crescono e calano insieme.":
    "Le texte de base utilise la taille choisie : libellés, champs et paragraphes grandissent et diminuent ensemble.",
  "Implementato": "Implémenté",
  "Impostazioni": "Paramètres",
  "In Bolle l'elevazione si legge da ombra morbida e riflesso, non solo dal colore di superficie. Più un elemento sale, più l'ombra si allarga e prende la tinta del primario. Al passaggio del puntatore ogni pulsante mostra il riflesso della bolla sopra il proprio colore, insieme allo strato di stato M3.":
    "Dans Bolle, l'élévation se lit à l'ombre douce et au reflet, pas seulement à la couleur de surface. Plus un élément monte, plus l'ombre s'élargit et prend la teinte du primaire. Au survol, chaque bouton montre le reflet de la bulle sur sa propre couleur, avec la couche d'état M3.",
  "In pausa": "En pause",
  "In questa pagina": "Sur cette page",
  "Inattivo": "Inactif",
  "Inchiostro": "Encre",
  "Indeterminata": "Indéterminée",
  "Indeterminato": "Indéterminé",
  "Indicatori": "Indicateurs",
  "Indice": "Index",
  "Inizia": "Commencer",
  "Inizia ora": "Commencer maintenant",
  "Inizio settimana": "Début de semaine",
  "Inset": "Inset",
  "Installa il pacchetto, scegli un seed, e i tuoi componenti M3 prendono forma.":
    "Installez le paquet, choisissez une seed, et vos composants M3 prennent forme.",
  "Intensità": "Intensité",
  "Interattiva": "Interactive",
  "Interfacce con tensione superficiale":
    "Des interfaces à tension superficielle",
  "Interfacce con tensione superficiale.":
    "Des interfaces à tension superficielle.",
  "Interruttore immediato con icone di stato opzionali.":
    "Interrupteur immédiat avec icônes d'état facultatives.",
  "Invia": "Envoyer",
  "Invia per email": "Envoyer par e-mail",
  "Invia più tardi": "Envoyer plus tard",
  "Ispirata a Material 3 · open source": "Inspirée de Material 3 · open source",
  "L'anello iridescente è sempre doppiato da un contorno pieno: il significato non dipende mai dal gradiente.":
    "L'anneau irisé est toujours doublé d'un contour plein : le sens ne dépend jamais du dégradé.",
  "L'attributo {attribute} usa la sintassi di {syntax}. Se il componente contiene un controllo focalizzabile, la combinazione lo mette a fuoco; bottoni e link vengono anche attivati.":
    "L'attribut {attribute} utilise la syntaxe de {syntax}. Si le composant contient un contrôle focalisable, la combinaison lui donne le focus ; les boutons et les liens sont aussi activés.",
  "L'operazione non può essere annullata.": "Cette opération est irréversible.",
  "La coda": "La pointe",
  "La coda punta qui": "La pointe vise ici",
  "La copia resta nel tuo spazio personale.":
    "La copie reste dans votre espace personnel.",
  "La pellicola": "Le film",
  "La scala di M3 non cambia: cambiano solo le famiglie. Fredoka 600 per display e titoli dai 32 px in su, Figtree per testo e controlli, JetBrains Mono per il codice.":
    "L'échelle de M3 ne change pas : seules les familles changent. Fredoka 600 pour les display et les titres à partir de 32 px, Figtree pour le texte et les contrôles, JetBrains Mono pour le code.",
  'La coda non è obbligatoria: card, menu, tooltip, azioni del FAB e snackbar accettano tail="none" e tornano bolle con i quattro angoli uguali, senza cambiare raggio.':
    'La queue est facultative : card, menu, tooltip, actions du FAB et snackbar acceptent tail="none" et redeviennent des bulles aux quatre coins égaux, sans changer de rayon.',
  "Laguna": "Lagune",
  "Larghezza": "Largeur",
  "Lavoro": "Travail",
  "Layout": "Layout",
  "Leggera quando serve": "Légère quand il le faut",
  "Leggera quando serve.": "Légère quand il le faut.",
  "Leggera,Morbida,Media,Forte,Intensa": "Légère,Douce,Moyenne,Forte,Intense",
  "Lilla · container": "Lilas · container",
  "Limiti aperti": "Limites connues",
  "Lingua": "Langue",
  "Lo schiocco": "L'éclatement",
  "Luce": "Lumière",
  "Lunghezza massima": "Longueur maximale",
  "Maniglia": "Poignée",
  "Mantieni il primario esatto": "Conserver le primaire exact",
  "Massimo": "Maximum",
  "Material 3 resta la struttura: ruoli colore, scala tipografica, stati e accessibilità. Bolle ne è la pelle e la riconosci da tre segni: l'angolo a coda, la pellicola iridescente e lo schiocco. Tutto passa da pochi token in più, che puoi regolare o spegnere.":
    "Material 3 reste la structure : rôles de couleur, échelle typographique, états et accessibilité. Bolle en est la peau, reconnaissable à trois signes : l'angle en pointe, le film irisé et l'éclatement. Tout passe par quelques tokens supplémentaires, que vous pouvez régler ou désactiver.",
  "Materiale": "Matière",
  "Media": "Moyenne",
  "Menu": "Menu",
  "Menu baseline o verticale, con gruppi, sottomenu e selezione.":
    "Menu baseline ou vertical, avec groupes, sous-menus et sélection.",
  "Menu sotto il bottone": "Menu sous le bouton",
  "Menu, tooltip ricco, card elevate": "Menus, tooltip riche, cartes élevées",
  "Mese": "Mois",
  "Messaggi ricevuti": "Messages reçus",
  "Messaggi ricevuti.": "Messages reçus.",
  "Messaggio": "Message",
  "Messaggio temporaneo con azione, chiusura e coda di messaggi.":
    "Message temporaire avec action, fermeture et file d'attente de messages.",
  "Minimo": "Minimum",
  "Misure": "Mesures",
  "Modale": "Modale",
  "Modifica": "Modifier",
  "Molle con tensione superficiale. Alla pressione il pulsante si schiaccia a volume costante; al rilascio oscilla con una molla poco smorzata. Le superfici si gonfiano dall'angolo a coda e scoppiano alla chiusura. Le dialog, una volta aperte, galleggiano in modo quasi impercettibile.":
    "Des ressorts à tension superficielle. À la pression, le bouton s'écrase à volume constant ; au relâchement, il oscille avec un ressort peu amorti. Les surfaces se gonflent depuis l'angle en pointe et éclatent à la fermeture. Une fois ouvertes, les dialogs flottent de façon presque imperceptible.",
  "Molle con tensione superficiale: si schiaccia, oscilla, si gonfia, scoppia. E si ferma del tutto se l'utente preferisce meno movimento.":
    "Des ressorts à tension superficielle : ça s'écrase, oscille, gonfle, éclate. Et tout s'arrête si l'utilisateur préfère moins de mouvement.",
  "Mostra snackbar": "Afficher la snackbar",
  "Movimento": "Mouvement",
  "Movimento rispettoso": "Mouvement respectueux",
  "Movimento rispettoso.": "Mouvement respectueux.",
  "Multilinea": "Multiligne",
  "Navigazione laterale": "Navigation latérale",
  "Navigazione principale": "Navigation principale",
  "Nebbia · secondario": "Brume · secondaire",
  "Nero": "Noir",
  'Nessun blocco :root o [data-theme="dark"] trovato nel CSS.':
    'Aucun bloc :root ou [data-theme="dark"] trouvé dans le CSS.',
  "Nessun componente precedente": "Aucun composant précédent",
  "Nessun componente successivo": "Aucun composant suivant",
  "Nessun componente: disponibile per il tuo CSS":
    "Aucun composant : disponible pour votre CSS",
  "Nome": "Nom",
  "Non potrai recuperarla.": "Vous ne pourrez pas le récupérer.",
  "Nord": "Nord",
  "Notifiche": "Notifications",
  "Nuovo": "Nouveau",
  "Nuovo elemento": "Nouvel élément",
  "Obbligatoria": "Obligatoire",
  "Obbligatorio": "Obligatoire",
  "Oceano": "Océan",
  "Ogni riga cambia un solo attributo; gli altri restano quelli dell'anteprima.":
    "Chaque ligne modifie un seul attribut ; les autres restent ceux de l'aperçu.",
  "Ogni scheda mostra il componente reale nel suo stato predefinito. Le famiglie seguono l'ordine e il raggruppamento della overview Material 3.":
    "Chaque fiche montre le vrai composant dans son état par défaut. Les familles suivent l'ordre et le regroupement de l'overview Material 3.",
  "Ogni superficie sospesa ha tre angoli tondi e uno stretto, che punta verso l'elemento da cui è nata. Menu, tooltip e azioni del FAB calcolano l'angolo all'apertura; snackbar e card lo tengono in basso, sul lato di inizio. I bottoni restano a pillola.":
    "Chaque surface flottante a trois angles arrondis et un angle étroit, qui pointe vers l'élément dont elle est née. Les menus, tooltips et actions du FAB calculent l'angle à l'ouverture ; snackbars et cartes le gardent en bas, côté début. Les boutons restent en pilule.",
  "Ogni superficie sospesa ha un angolo stretto che indica da dove è nata. Menu, tooltip e snackbar ti dicono sempre a chi appartengono.":
    "Chaque surface flottante a un angle étroit qui indique d'où elle est née. Menus, tooltips et snackbars vous disent toujours à qui ils appartiennent.",
  "Ogni token ha il colore e il numero della sua quota nell'anteprima. La modifica vale per tutti gli esempi di {tag}.":
    "Chaque token a la couleur et le numéro de sa cote dans l'aperçu. La modification s'applique à tous les exemples de {tag}.",
  "Ondulato": "Ondulé",
  "Opacità del fondo traslucido": "Opacité du fond translucide",
  "Oppure incolla JSON o CSS": "Ou collez du JSON ou du CSS",
  "Opzioni": "Options",
  "Ora con quadrante o inserimento numerico, ciclo 12 o 24 ore.":
    "Heure avec cadran ou saisie numérique, format 12 ou 24 heures.",
  "Ora promemoria": "Heure du rappel",
  "Ordina": "Trier",
  "Ordina per": "Trier par",
  "Orientamento": "Orientation",
  "Pagina copiata in Markdown": "Page copiée en Markdown",
  "Palette Material": "Palette Material",
  "Paletti": "Garde-fous",
  "Pannello del playground": "Panneau du playground",
  "Pannello laterale modale o standard, con variante staccata dal bordo.":
    "Panneau latéral modal ou standard, avec variante détachée du bord.",
  "Parametri": "Paramètres",
  "Passa sopra": "Survolez-moi",
  "Passa sopra i pulsanti: il riflesso compare in alto a destra.":
    "Survolez les boutons : le reflet apparaît en haut à droite.",
  "Passa sopra un componente per vedere i token che usa":
    "Survolez un composant pour voir les tokens qu'il utilise",
  "Passo": "Pas",
  "Pellicola": "Film",
  "Pensato per colori estratti da immagini: fedele al seme, accenti per temperatura.":
    "Conçu pour les couleurs extraites d'images : fidèle à la graine, accents selon la température.",
  "Percorso": "Fil d'Ariane",
  "Periodo": "Période",
  "Persistente": "Persistant",
  "Più popolari": "Les plus populaires",
  "Più recenti": "Les plus récents",
  "Più tardi": "Plus tard",
  "Placeholder": "Placeholder",
  "Posta": "Boîte de réception",
  "Precedente": "Précédent",
  "Precedente: {name}": "Précédent : {name}",
  "Predefinito M3: secondary e tertiary sono varianti tenui della tinta del seme.":
    "Par défaut M3 : secondary et tertiary sont des variantes atténuées de la teinte de la graine.",
  "Preferenze": "Préférences",
  "Preferenze di notifica": "Préférences de notification",
  "Preferenze personali": "Préférences personnelles",
  "Preferenze personali.": "Préférences personnelles.",
  "Preferiti": "Favoris",
  "Prefisso": "Préfixe",
  "Premi / per cercare": "Appuyez sur / pour rechercher",
  "Premi Tab per il focus": "Appuyez sur Tab pour le focus",
  "Premi e rilascia": "Appuyez et relâchez",
  "Pressione": "Pression",
  "Prima": "Avant",
  "Prima: {color}": "Avant : {color}",
  "Primary e container restano molto vicini al seme, anche se saturo.":
    "Primary et container restent très proches de la graine, même saturée.",
  "Primary resta il colore scelto; il testo sopra diventa il tono più leggibile.":
    "Primary reste la couleur choisie ; le texte au-dessus prend le ton le plus lisible.",
  "Principale": "Principale",
  "Proprietà": "Propriété",
  "Proprietà pubbliche lette dalla classe registrata. Array e oggetti si assegnano come proprietà JavaScript; gli attributi booleani valgono per presenza, quindi {example} resta disabilitato.":
    "Propriétés publiques lues depuis la classe enregistrée. Les tableaux et objets s'affectent comme propriétés JavaScript ; les attributs booléens valent par leur présence, donc {example} reste désactivé.",
  "Puoi revocare il consenso.": "Vous pouvez retirer votre consentement.",
  "Quadrato sulla ruota (+90° e +180°).": "Carré sur la roue (+90° et +180°).",
  "Quasi bianche": "Presque blanches",
  "Quasi senza colore: utile per interfacce sobrie.":
    "Presque sans couleur : utile pour des interfaces sobres.",
  "Raggio degli angoli e componenti che lo usano":
    "Rayon des angles et composants qui l'utilisent",
  "Raggio dei tre angoli tondi delle superfici sospese":
    "Rayon des trois angles arrondis des surfaces flottantes",
  "Raggio del tooltip semplice": "Rayon du tooltip simple",
  "Raggio di snackbar e tooltip ricco":
    "Rayon de la snackbar et du tooltip riche",
  "Raggruppa azioni correlate con roving tabindex, orizzontale o verticale.":
    "Regroupe des actions liées avec roving tabindex, horizontal ou vertical.",
  "Rail compresso o espanso per la navigazione laterale.":
    "Rail réduit ou étendu pour la navigation latérale.",
  "Regione": "Région",
  "Regola colori, forma e tipografia. Le modifiche si applicano a tutti i componenti e al sito, separatamente per tema chiaro e scuro.":
    "Réglez les couleurs, la forme et la typographie. Les modifications s'appliquent à tous les composants et au site, séparément pour les thèmes clair et sombre.",
  "Regole": "Règles",
  "Reimposta dettaglio": "Réinitialiser le détail",
  "Reimposta misure": "Réinitialiser les mesures",
  "Reimposta parametri": "Réinitialiser les paramètres",
  "Reimposta tema": "Réinitialiser le thème",
  "Reset": "Réinitialiser",
  "Rete senza fili.": "Réseau sans fil.",
  "Ricerca con suggerimenti filtrabili, combobox ARIA e area risultati.":
    "Recherche avec suggestions filtrables, combobox ARIA et zone de résultats.",
  "Riflessa": "Reflétée",
  "Riflesso e galleggiamento": "Reflet et flottement",
  "Riflesso in alto a destra, all'hover e sul FAB":
    "Reflet en haut à droite, au survol et sur le FAB",
  "Raggio d'angolo che il riflesso segue: uguale alla curvatura del controllo":
    "Rayon d'angle suivi par le reflet : à aligner sur la courbure du contrôle",
  "Righe": "Lignes",
  "Righe con icone, testo di supporto, link, espansione e selezione singola o multipla.":
    "Lignes avec icônes, texte d'aide, liens, développement et sélection simple ou multiple.",
  "Rilascio": "Relâchement",
  "Rimovibile": "Supprimable",
  "Rimuovi Preferiti": "Retirer des favoris",
  "Rinomina": "Renommer",
  "Ripeti": "Rétablir",
  "Ritardo suggerimenti (ms)": "Délai des suggestions (ms)",
  "Ruota le tinte di secondary e tertiary in modo marcato rispetto al seme.":
    "Fait pivoter nettement les teintes de secondary et tertiary par rapport à la graine.",
  "Salva": "Enregistrer",
  "Salva bozza": "Enregistrer le brouillon",
  "Salva una copia": "Enregistrer une copie",
  "Salvato.": "Enregistré.",
  "Scala delle forme": "Échelle des formes",
  "Scarica": "Télécharger",
  "Scarica CSS": "Télécharger le CSS",
  "Scarica JSON": "Télécharger le JSON",
  "Scegli i filtri da applicare.": "Choisissez les filtres à appliquer.",
  "Scegli un colore qualsiasi": "Choisissez n'importe quelle couleur",
  "Scegli una regione": "Choisissez une région",
  "Scelta singola in un gruppo con navigazione da tastiera.":
    "Choix unique dans un groupe avec navigation au clavier.",
  "Scelta singola su option e optgroup native, con menu Material, stato di errore e campo filled o outlined.":
    "Choix unique parmi des option et optgroup natifs, avec menu Material, état d'erreur et champ filled ou outlined.",
  "Scheda di esempio": "Fiche d'exemple",
  "Schema colore": "Schéma de couleurs",
  "Schiuma · superficie": "Écume · surface",
  "Scoppio · accento": "Éclatement · accent",
  "Scorciatoia da tastiera": "Raccourci clavier",
  "Scorrevoli": "Défilants",
  "Scorso": "Défilé",
  "Scrivi una città": "Saisissez une ville",
  "Se conosci M3, conosci già Bolle.":
    "Si vous connaissez M3, vous connaissez déjà Bolle.",
  "Secondary e tertiary accanto al seme (−30° e +30°).":
    "Secondary et tertiary à côté de la graine (−30° et +30°).",
  "Secondary e tertiary sul lato opposto della ruota (+180°).":
    "Secondary et tertiary du côté opposé de la roue (+180°).",
  "Segmenti": "Segments",
  "Segnaposto": "Texte indicatif",
  "Selezionata": "Sélectionnée",
  "Selezionato": "Sélectionné",
  "Selezione": "Sélection",
  "Selezione binaria con stato indeterminato, errore e testo di supporto.":
    "Sélection binaire avec état indéterminé, erreur et texte d'aide.",
  "Selezione multipla": "Sélection multiple",
  "Senza animazione": "Sans animation",
  "Separatore orizzontale o verticale, con inset e modalità decorativa.":
    "Séparateur horizontal ou vertical, avec inset et mode décoratif.",
  "Sequenza di slide con controlli, contatore e varianti hero, multi-browse e full-screen.":
    "Suite de slides avec contrôles, compteur et variantes hero, multi-browse et full-screen.",
  "Set colore": "Jeu de couleurs",
  "Settimana": "Semaine",
  "Sezioni": "Sections",
  "Sezioni della pagina": "Sections de la page",
  "Sfocatura dello sfondo": "Flou de l'arrière-plan",
  "Sinistra": "Gauche",
  "Snackbar · card": "Snackbar · carte",
  "Snackbar, FAB": "Snackbar, FAB",
  "Soffia la tua prima interfaccia.": "Soufflez votre première interface.",
  "Sola lettura": "Lecture seule",
  "Solo gli strati sospesi sono traslucidi: menu e azioni del FAB. Sotto c'è sempre una versione opaca di riserva, che si attiva se il browser non supporta backdrop-filter, sui dispositivi lenti e con prefers-reduced-transparency.":
    "Seules les couches flottantes sont translucides : menus et actions du FAB. Dessous, il y a toujours une version opaque de secours, qui s'active si le navigateur ne prend pas en charge backdrop-filter, sur les appareils lents et avec prefers-reduced-transparency.",
  "Solo grigi: il seme non conta.":
    "Gris uniquement : la graine ne compte pas.",
  "Solo punto": "Point seul",
  "Sotto c'è Material 3, al completo. Sopra, tre regole applicate con coerenza a ogni componente.":
    "Dessous, Material 3, au complet. Dessus, trois règles appliquées avec cohérence à chaque composant.",
  "Sottolineato": "Souligné",
  "Sottotitolo": "Sous-titre",
  "Spessore dell'anello pellicola": "Épaisseur de l'anneau de film",
  "Sposta in…": "Déplacer vers…",
  "Staccato": "Détaché",
  "Standard": "Standard",
  "Stessi nomi dei componenti, stessi token di colore e tipografia. Il carattere passa da pochi token in più, che puoi regolare o spegnere.":
    "Mêmes noms de composants, mêmes tokens de couleur et de typographie. Le caractère passe par quelques tokens supplémentaires, que vous pouvez régler ou désactiver.",
  "Sticky": "Sticky",
  "Stile bottoni": "Style des boutons",
  "Su dispositivi lenti si spengono sfocatura e filtro goccia.":
    "Sur les appareils lents, le flou et le filtre goutte se désactivent.",
  "Successivo": "Suivant",
  "Successivo: {name}": "Suivant : {name}",
  "Suffisso": "Suffixe",
  "Suggerimenti": "Suggestions",
  "Suggerimenti fra le città servite.":
    "Suggestions parmi les villes desservies.",
  "Superfici": "Surfaces",
  "Superficie": "Surface",
  "Superficie per contenuto correlato, con media, orientamento e varianti di elevazione.":
    "Surface pour du contenu lié, avec média, orientation et variantes d'élévation.",
  "Supporto e limiti": "Prise en charge et limites",
  "Tab primari o secondari, attivazione automatica o manuale, anche scorrevoli.":
    "Onglets primaires ou secondaires, activation automatique ou manuelle, éventuellement défilants.",
  "Tavolozza": "Palette",
  "Tema": "Thème",
  "Tema chiaro": "Thème clair",
  "Tema e token": "Thème et tokens",
  "Tema scuro": "Thème sombre",
  "Tema {name}": "Thème {name}",
  "Temi": "Thèmes",
  "Template": "Modèle",
  "Testi ed etichette": "Textes et libellés",
  "Testo di aiuto su hover e focus, semplice o con contenuto ricco.":
    "Texte d'aide au survol et au focus, simple ou avec contenu riche.",
  "Testo di esempio per valutare carattere, interlinea e colore su una superficie reale.":
    "Texte d'exemple pour évaluer la police, l'interligne et la couleur sur une vraie surface.",
  "Testo di supporto": "Texte d'aide",
  "Testo e controlli": "Texte et contrôles",
  "Testo · {font} · {size}px": "Texte · {font} · {size}px",
  "Tinte (Material)": "Teintes (Material)",
  "Tinte ruotate e giocose per tutti gli accenti.":
    "Teintes pivotées et ludiques pour tous les accents.",
  "Tipo": "Type",
  "Tipografia": "Typographie",
  "Titoli · {font}": "Titres · {font}",
  "Titolo": "Titre",
  "Titolo di sezione": "Titre de section",
  "Toggle": "Toggle",
  "Token": "Tokens",
  "Token applicati": "Tokens appliqués",
  "Token del componente": "Tokens du composant",
  "Token importati: {count} valori": "Tokens importés : {count} valeurs",
  "Toni {name}": "Tons {name}",
  "Tre gesti che rendono una bolla una bolla.":
    "Trois gestes qui font d'une bulle une bulle.",
  "Tre tinte equidistanti (+120° e +240°).":
    "Trois teintes équidistantes (+120° et +240°).",
  "Tre vincoli tengono insieme carattere e accessibilità.":
    "Trois contraintes réunissent caractère et accessibilité.",
  "Tutta la card porta alla destinazione.":
    "Toute la carte mène à la destination.",
  "Tutti i componenti di M3. Con più aria dentro.":
    "Tous les composants de M3. Avec plus d'air dedans.",
  "Tutti i componenti →": "Tous les composants →",
  "Un gradiente conico tenue ricavato dal colore seed: le quattro tinte ruotano attorno alla sua tonalità, così la pellicola segue il tema dinamico. Si usa con misura: anello di focus dei bottoni e del FAB, stato selezionato. I chip restano sul solo contorno pieno, perché a quella dimensione l'anello cade fuori dal controllo e si legge come un difetto. Una sola superficie iridescente per schermata, mai come sfondo.":
    "Un dégradé conique léger dérivé de la couleur graine : les quatre teintes tournent autour de sa teinte, si bien que le film suit le thème dynamique. À utiliser avec mesure : anneau de focus des boutons et du FAB, état sélectionné. Les chips gardent uniquement le contour plein, car à cette taille l’anneau tombe hors du contrôle et se lit comme un défaut. Une seule surface iridescente par écran, jamais comme arrière-plan.",
  "Un'iridescenza che deriva dal tuo colore seed e compare solo dove conta: focus, selezione, l'azione principale.":
    "Une irisation issue de votre couleur seed, qui n'apparaît que là où ça compte : focus, sélection, action principale.",
  "Una dialog che galleggia": "Une dialog qui flotte",
  "Una superficie dentro un'altra prende il raggio del contenitore meno il padding che il contenitore applica, con un minimo di 2px. Il contenitore lo pubblica in --bb-inset-radius e la superficie interna lo eredita: card dentro dialog, fogli o altre card, media nelle card, voci nei menu e campi nei picker.":
    "Une surface dans une autre reprend le rayon du conteneur moins le rembourrage qu'il applique, jamais moins de 2px. Le conteneur le publie dans --bb-inset-radius et la surface intérieure l'hérite : une carte dans une boîte de dialogue, un panneau ou une autre carte, les médias dans les cartes, les entrées de menu et les champs des sélecteurs.",
  "Usa": "Utiliser",
  "Usa #RGB o #RRGGBB": "Utilisez #RGB ou #RRGGBB",
  "Usa modello": "Utiliser le modèle",
  "Useremo questo indirizzo per le notifiche.":
    "Nous utiliserons cette adresse pour les notifications.",
  "Uso": "Utilisation",
  "Valore": "Valeur",
  "Valore di {token}": "Valeur de {token}",
  "Valore di {token} in pixel": "Valeur de {token} en pixels",
  "Valore massimo (range)": "Valeur maximale (plage)",
  "Variante": "Variante",
  "Ricerca": "Recherche",
  "Varianti": "Variantes",
  "Velatura al 30% per il FAB": "Voile à 30 % pour le FAB",
  "Verifica del contrasto": "Vérification du contraste",
  "Verifica la resa da destra a sinistra con il pulsante {rtl} nella barra in alto.":
    "Vérifiez le rendu de droite à gauche avec le bouton {rtl} dans la barre du haut.",
  "Verticale": "Vertical",
  "Vetro": "Verre",
  "Viola": "Violet",
  "Vista": "Vue",
  "Volume": "Volume",
  "bolle · Interfacce con tensione superficiale":
    "bolle · Des interfaces à tension superficielle",
  "bolle, presentazione": "bolle, présentation",
  "contrasti dei ruoli tonali M3, focus sempre visibile.":
    "contrastes des rôles tonals M3, focus toujours visible.",
  "cresce del 5% e sfuma in {duration}":
    "grossit de 5 % et s'estompe en {duration}",
  "default {value}": "par défaut {value}",
  "le dialog oscillano di {distance} ogni {duration}":
    "les dialogs oscillent de {distance} toutes les {duration}",
  "nei pulsanti segmentati l'indicatore scorre come una goccia":
    "dans les boutons segmentés, l'indicateur glisse comme une goutte",
  "no": "non",
  "non dichiarato": "non déclaré",
  "prefers-reduced-motion spegne dondolio e scoppio.":
    "prefers-reduced-motion désactive le balancement et l'éclatement.",
  "prima": "avant",
  "scala {scale} in {duration}": "échelle {scale} en {duration}",
  "sfocature e trasparenze si disattivano su dispositivi lenti.":
    "les flous et transparences se désactivent sur les appareils lents.",
  "si gonfia dall'angolo a coda in {duration}":
    "se gonfle depuis l'angle en pointe en {duration}",
  "solo JS": "JS uniquement",
  "sotto {min}:1": "sous {min}:1",
  "sì": "oui",
  "{changed} di {total} ruoli cambiati nell'ultima operazione: a sinistra il colore precedente.":
    "{changed} rôles sur {total} modifiés lors de la dernière opération : à gauche, la couleur précédente.",
  "{compact} porta a tre quarti spaziature e dimensioni dei componenti; i token ridotti escono con l'esportazione e si attivano con {attr}.":
    "{compact} réduit aux trois quarts les espacements et les dimensions des composants ; les tokens réduits font partie de l'export et s'activent avec {attr}.",
  "{name} · ispirata a Material 3, non affiliata a Google.":
    "{name} · inspirée de Material 3, non affiliée à Google.",
  "{n} componenti": "{n} composants",
  "{n} proprietà": "{n} propriétés",
  "{region} (non disponibile)": "{region} (indisponible)",
  "{total} ruoli. Dopo una generazione i ruoli cambiati mostrano il colore precedente accanto al nuovo.":
    "{total} rôles. Après une génération, les rôles modifiés affichent la couleur précédente à côté de la nouvelle.",
  "| Proprietà | Attributo | Tipo | Default | Riflessa |":
    "| Propriété | Attribut | Type | Par défaut | Reflétée |",
  "Con {token} restano solo le dissolvenze: niente dondolio, scoppio né galleggiamento.":
    "Avec {token}, seuls les fondus restent : ni oscillation, ni éclatement, ni flottement.",
  "ritorno con {token}": "retour avec {token}",
  "Panoramica dei componenti": "Vue d'ensemble des composants",
  "Esporta": "Exporter",
  "Importa": "Importer",
  "Trascina qui un file .json o .css": "Déposez un fichier .json ou .css ici",
  "Scegli file": "Choisir un fichier",
  "Amministrazione": "Administration",
  "Anagrafiche": "Annuaire",
  "Articoli": "Articles",
  "Attive": "Actives",
  "Cantieri edili": "Chantiers de construction",
  "Chiuse": "Clôturées",
  "Commesse": "Commandes",
  "Compressa": "Réduite",
  "Cruscotto": "Tableau de bord",
  "Fatture": "Factures",
  "Impianti elettrici e termici": "Installations électriques et thermiques",
  "In attesa di avvio": "En attente de démarrage",
  "Intestazione": "En-tête",
  "Inventario": "Inventaire",
  "Magazzino": "Entrepôt",
  "Manutenzione straordinaria": "Maintenance extraordinaire",
  "Manutenzioni": "Maintenances",
  "Movimenti di carico e scarico": "Entrées et sorties de stock",
  "Navigazione di un'applicazione gestionale: albero fino a tre livelli, filtro, contatori, rail compatta e larghezza regolabile.":
    "Navigation d’une application de gestion : arborescence jusqu’à trois niveaux, filtre, compteurs, rail compact et largeur réglable.",
  "Programmate": "Planifiées",
  "Scadenzario pagamenti": "Échéancier des paiements",
  "Storico interventi": "Historique des interventions",
  "Aggiunta rapida": "Ajout rapide",
  "Archivia la scheda": "Archiver la carte",
  "Board a colonne di schede: spostamento tra colonne e riordino, corsie, colonne comprimibili, limiti WIP segnalati e stato di carico, errore e board vuota.":
    "Tableau en colonnes de cartes : déplacement entre colonnes et réordonnancement, couloirs, colonnes repliables, limites WIP signalées et états de chargement, erreur et tableau vide.",
  "Chiuso": "Clôturé",
  "Collaudo": "Réception",
  "Colonna": "Colonne",
  "Colonne comprimibili": "Colonnes repliables",
  "Corsie": "Couloirs",
  "Da assegnare": "À affecter",
  "Duplica la scheda": "Dupliquer la carte",
  "In corso": "En cours",
  "Nuova commessa · da assegnare": "Nouveau chantier · à affecter",
  "Nuova scheda": "Nouvelle carte",
  "Ordina per scadenza": "Trier par échéance",
  "Per passare in Chiuso l'avanzamento deve essere al 100%.":
    "Un chantier ne passe à Clôturé qu'à 100 % d'avancement.",
  "Programmato": "Planifié",
  "Trascinamento": "Glissement",
  "Una commessa chiusa non si riapre dal kanban.":
    "Un chantier clôturé ne se rouvre pas depuis le tableau.",
  "Una commessa già avanzata non torna in cantiere senza un verbale.":
    "Un chantier déjà avancé ne revient pas sur site sans procès-verbal.",
  "in ritardo": "en retard",
  "Altro": "Plus",
  "Azioni della schermata": "Actions de l'écran",
  "Cancella i filtri": "Effacer les filtres",
  "Con immagine": "Avec une image",
  "Contenitore in fondo alla schermata: azioni, uno spazio per il pulsante principale e una forma piana o staccata dal bordo.":
    "Conteneur en bas de l'écran : actions, une place pour le bouton principal et une forme posée sur le bord ou détachée.",
  "Controllo delle pagine di un elenco che resta all'applicazione: intervallo, pagine numerate, frecce e righe per pagina.":
    "Contrôle des pages d'une liste qui reste à l'application : plage, pages numérotées, flèches et lignes par page.",
  "Indietro": "Retour",
  "La barra non conosce l'applicazione: riceve le azioni negli slot e lascia al contenitore decidere cosa mostrare. Con dock il pulsante flottante esce dal bordo superiore e la barra resta un riferimento stabile mentre il contenuto scorre, se è sticky.":
    "La barre ne connaît pas l'application : elle reçoit les actions dans ses slots et laisse le conteneur décider de ce qu'il affiche. Avec dock le bouton flottant dépasse du bord supérieur, et une barre sticky reste un repère stable pendant le défilement.",
  "Le commesse archiviate non compaiono qui. Cambia i filtri o creane una nuova.":
    "Les chantiers archivés n'apparaissent pas ici. Modifiez les filtres ou créez-en un nouveau.",
  "Le iniziali si ricavano dal nome quando non sono date, e restano leggibili anche in una lingua senza spazi. Se l'immagine non si carica, l'avatar ricade sulle iniziali senza lasciare un riquadro vuoto. Lo slot icon sostituisce il contenuto e lo slot badge aggiunge un contatore.":
    "Les initiales viennent du nom lorsqu'elles ne sont pas fournies et restent lisibles dans une langue sans espaces. Si l'image ne se charge pas, l'avatar revient aux initiales sans laisser de cadre vide. Le slot icon remplace le contenu et le slot badge ajoute un compteur.",
  "Linea superiore": "Ligne supérieure",
  "Nessuna commessa da mostrare": "Aucun chantier à afficher",
  "Nuova commessa": "Nouveau chantier",
  "Pagina": "Page",
  "Pagine": "Pages",
  "Pulsante agganciato": "Bouton ancré",
  "Righe in totale": "Lignes au total",
  "Scelta delle righe": "Choix des lignes",
  "Segno di identità di una persona o di un ente: immagine, iniziali o icona, con un indicatore di stato.":
    "Marque d'identité d'une personne ou d'une entité : image, initiales ou icône, avec un indicateur d'état.",
  "Superficie da mostrare quando un contenitore non ha nulla da disegnare: icona, titolo, una riga di testo e le azioni che ne escono.":
    "Surface à afficher quand un conteneur n'a rien à dessiner : icône, titre, une ligne de texte et les actions qui en sortent.",
  "Testo": "Texte",
  "Tono": "Ton",
  "Un solo componente per il vuoto e per l'errore: il tono error colora l'icona con il ruolo d'errore e, con role alert, la regione viene annunciata appena compare. Con align start il testo e le azioni si allineano al bordo, come dentro una tabella.":
    "Un seul composant pour le vide et pour l'erreur : le ton error colore l'icône avec le rôle d'erreur et, avec role alert, la région est annoncée dès son apparition. Avec align start le texte et les actions s'alignent au bord, comme dans un tableau.",
  "righe": "lignes",
  "righe in totale": "lignes au total",
  "Componente": "Composant",
  "Matrice degli stati": "Matrice des états",
  "Ogni cella riporta la proprietà pubblica che espone lo stato; il trattino indica che il componente non ha quello stato. {covered} componenti su {total} ne espongono almeno uno. Gli stati di interazione — hover, focus visibile e premuto — arrivano dal livello di stato condiviso di ogni superficie azionabile.":
    "Chaque cellule nomme la propriété publique qui expose l'état ; un tiret indique que le composant n'a pas cet état. {covered} composants sur {total} en exposent au moins un. Les états d'interaction — survol, focus visible et appui — viennent de la couche d'état partagée de chaque surface actionnable.",
  "Filtro interno": "Filtre intégré",
  "Indicatore Morph con le bolle, con la sequenza di sette forme o dentro un contenitore.":
    "Indicateur Morph avec bulles, avec la séquence de sept formes ou dans un conteneur.",
  "Avatar visibili": "Avatars visibles",
  "Contatore premibile": "Compteur cliquable",
  "Il gruppo dispone gli avatar che riceve e non conosce le persone: con max nasconde i successivi e somma nel contatore anche quelle non passate come avatar, dichiarate con total. Il contatore è una semplice somma, oppure un pulsante con interactive che chiede l'elenco completo con avatar-group-select. L'anello del colore di fondo stacca un avatar dal successivo.":
    "Le groupe dispose les avatars qu'il reçoit et ne connaît pas les personnes : avec max il masque les suivants et ajoute au compteur celles qui ne sont pas passées comme avatars, déclarées avec total. Le compteur est une simple somme, ou un bouton avec interactive qui demande la liste complète via avatar-group-select. Un anneau de la couleur de fond détache un avatar du suivant.",
  "Le briciole non navigano da sole: ricevono i livelli con href e segnalano con breadcrumb-select quello scelto, così l'applicazione decide se cambiare rotta. Con max-items il percorso mostra il primo livello, un pulsante con i puntini e gli ultimi livelli; il pulsante apre il percorso completo. Il separatore a chevron si specchia in una lingua da destra a sinistra.":
    "Le fil d'Ariane ne navigue jamais seul : il reçoit les niveaux avec un href et signale celui choisi avec breadcrumb-select, l'application décide du changement de route. Avec max-items le chemin montre le premier niveau, un bouton avec des points et les derniers niveaux ; le bouton ouvre le chemin complet. Le séparateur chevron se reflète dans une langue de droite à gauche.",
  "Livelli": "Niveaux",
  "Livelli visibili": "Niveaux visibles",
  "Partecipanti": "Participants",
  "Percorso dalla radice dell'applicazione alla pagina aperta: livelli dell'applicazione, livello corrente non collegato, percorso lungo raccorciato.":
    "Chemin de la racine de l'application à la page ouverte : niveaux déclarés par l'application, niveau courant non lié, chemin long raccourci.",
  "Persone mostrate come avatar sovrapposti, con un contatore per quelle che non entrano nello spazio.":
    "Personnes affichées en avatars superposés, avec un compteur pour celles qui ne tiennent pas.",
  "Persone totali": "Personnes au total",
  "Separatore": "Séparateur",
  "Sopralluogo": "Visite du 12 novembre",
  "Sovrapposizione": "Chevauchement",
  "Verbali": "Rapports de visite",
  "Attività figlie": "Tâches enfants",
  "Chiudi il dettaglio": "Fermer le détail",
  "Consegna lavori": "Livraison des travaux",
  "Dipendenze": "Dépendances",
  "Durata": "Durée",
  "Fase": "Phase",
  "Fine": "Fin",
  "Giulia Ferraro": "Giulia Ferraro",
  "Inizio": "Début",
  "Non si sposta un'attività prima del":
    "Une tâche ne peut pas être déplacée avant le",
  "Pianificazione lavori": "Planning des travaux",
  "Piano approvato": "Plan approuvé",
  "Predecessori": "Prédécesseurs",
  "Provincia di Brescia": "Province de Brescia",
  "Rifacimento impianto elettrico": "Rénovation de l'installation électrique",
  "Scala": "Échelle",
  "Una scadenza non cade di sabato o domenica.":
    "Une échéance ne tombe pas un samedi ou un dimanche.",
  "giorni": "jours",
  "giorno": "jour",
  "milestone": "jalon",
  "nessuno": "aucun",
  "Piano a barre su un asse temporale: quattro scale, riepiloghi e milestone, dipendenze, piano approvato, carico per responsabile, colonne regolabili e modifica da puntatore o da tastiera.":
    "Diagramme à barres sur un axe de temps : quatre échelles, synthèses et jalons, dépendances, plan approuvé, charge par responsable, colonnes ajustables et modifications au pointeur ou au clavier.",
  "Ordinamento e paginazione": "Tri et pagination",
  "Con page-size maggiore di zero la tabella pagina da sé le righe che ha già e mostra il pager. Con pageHandler la pagina richiesta arriva all'applicazione, che ricarica la fetta di righe e il totale.":
    "Avec page-size supérieur à zéro, la table pagine elle-même les lignes qu'elle détient et affiche le pagineur. Avec pageHandler, la page demandée arrive à l'application, qui recharge la tranche de lignes et le total.",
  "Fissa l'ordine iniziale, con l'icona già accesa.":
    "Fixe l'ordre initial, avec l'icône d'en-tête déjà active.",
  "La tabella ordina e pagina le righe che riceve: un clic sull'intestazione va prima crescente e poi decrescente, e page-size da solo accende il pager.":
    "La table trie et pagine les lignes qu'elle reçoit : un clic sur l'en-tête passe en croissant puis en décroissant, et page-size suffit à activer le pagineur.",
  "Ordina e pagina da sola: l'applicazione non taglia né riordina nulla.":
    "Elle trie et pagine seule : l'application ne découpe ni ne réordonne rien.",
  "Riceve l'ordine richiesto e la tabella ridisegna dopo la promessa.":
    "Reçoit l'ordre demandé ; la table redessine une fois la promesse résolue.",
  "Riceve pagina e dimensione e la tabella ridisegna dopo la promessa.":
    "Reçoit la page et sa taille ; la table redessine une fois la promesse résolue.",
  "Un clic sull'intestazione ordina da sola: prima crescente, poi decrescente. Con sortHandler la richiesta arriva all'applicazione, che ricarica le righe, e la tabella si ridisegna quando la promessa è risolta.":
    "Un clic sur l'en-tête trie seul : croissant d'abord, puis décroissant. Avec sortHandler la demande arrive à l'application, qui recharge les lignes, et la table redessine quand la promesse est résolue.",
  "fissa l'ordine iniziale": "fixe l'ordre initial",
  "riceve l'ordine, la tabella ridisegna dopo la promessa":
    "reçoit l'ordre ; la table redessine une fois la promesse résolue",
  "riceve pagina e dimensione, la tabella ridisegna dopo la promessa":
    "reçoit la page et sa taille ; la table redessine une fois la promesse résolue",
  "Il componente chiama detail con la riga aperta e inserisce il risultato sotto di essa. La riga si apre e si chiude da sola: expand riporta solo quali righe sono aperte.":
    "Le composant appelle detail avec la ligne ouverte et place le résultat sous celle-ci. La ligne s'ouvre et se ferme seule : expand indique seulement quelles lignes sont ouvertes.",
  "La tabella applica selezione, apertura riga, raggruppamento e cambi di colonna da sé: gli eventi li riportano soltanto.":
    "La table applique seule la sélection, l'ouverture de ligne, le regroupement et les changements de colonne : les événements ne font que les rapporter.",
  "La tabella ordina e pagina le righe che riceve: un clic sull'intestazione va prima crescente e poi decrescente, e page-size da solo accende il pager. Selezione, apertura riga, raggruppamento e cambi di colonna li applica lei, e gli eventi li riportano. sortHandler, pageHandler e columnHandler servono solo quando i dati stanno altrove: ricevono la richiesta e la tabella ridisegna quando la promessa è risolta.":
    "La table trie et pagine les lignes qu'elle reçoit : un clic sur l'en-tête passe en croissant puis en décroissant, et page-size suffit à activer le pagineur. La sélection, l'ouverture de ligne, le regroupement et les changements de colonne sont appliqués par la table, et les événements les rapportent. sortHandler, pageHandler et columnHandler servent uniquement lorsque les données sont ailleurs : ils reçoivent la demande et la table redessine quand la promesse est résolue.",
  "Riceve l'elenco delle colonne dopo ogni modifica, per conservarlo altrove.":
    "Reçoit la liste des colonnes après chaque modification, pour la conserver ailleurs.",
  "la tabella applica selezione, apertura riga, raggruppamento e cambi di colonna da sé: gli eventi li riportano soltanto":
    "la table applique seule la sélection, l'ouverture de ligne, le regroupement et les changements de colonne : les événements ne font que les rapporter",
  "pinned tiene la colonna ferma durante lo scorrimento orizzontale, width fissa la larghezza iniziale, hidden la nasconde, sortable a false toglie l'ordinamento. Fissare, nascondere, riordinare e ridimensionare lo fa la tabella: column-change riporta il nuovo elenco e columnHandler lo salva dove serve.":
    "pinned garde la colonne fixe pendant le défilement horizontal, width fixe la largeur initiale, hidden la masque, sortable false retire le tri. Épingler, masquer, réordonner et redimensionner, c'est la table qui le fait : column-change rapporte la nouvelle liste et columnHandler l'enregistre là où il faut.",
  "riceve l'elenco delle colonne dopo ogni modifica, per conservarlo altrove":
    "reçoit la liste des colonnes après chaque modification, pour la conserver ailleurs",
  "selectable mostra la casella su ogni riga e nell'intestazione. La selezione la tiene la tabella: l'evento select riporta gli identificatori scelti e le righe corrispondenti, senza che l'applicazione debba riscriverli.":
    "selectable affiche la case sur chaque ligne et dans l'en-tête. La table garde la sélection : l'événement select rapporte les identifiants choisis et les lignes correspondantes, sans que l'application doive les réécrire.",
  "Il piano sposta l'attività da sé e riporta il cambio con task-change; il rifiuto arriva con task-change-blocked applicando la regola che l'applicazione passa in restrict, e l'apertura con task-open. Le righe sono virtualizzate, la colonna della griglia resta ferma in orizzontale e l'intestazione del tempo resta ferma in alto. L'altezza del host è obbligatoria.":
    "Le plan déplace la tâche seul et rapporte le changement avec task-change ; le refus arrive avec task-change-blocked en appliquant la règle passée par l'application dans restrict, et l'ouverture avec task-open. Les lignes sont virtualisées, la colonne de la grille reste fixe horizontalement et l'en-tête du temps reste fixe en haut. La hauteur de l'hôte est obligatoire.",
  "La board sposta la scheda da sé e riporta il cambio con card-move; dove può andare lo decide la regola che l'applicazione passa in restrict, e il rifiuto arriva con card-move-blocked. Lo scorrimento verticale è della colonna, non della board; il trascinamento ha la copia che segue il puntatore, il segnaposto e lo scorrimento automatico ai bordi. La scheda si sposta anche con Alt e le frecce dalla maniglia.":
    "Le tableau déplace la carte seul et rapporte le changement avec card-move ; l'endroit autorisé est décidé par la règle passée par l'application dans restrict, et le refus arrive avec card-move-blocked. Le défilement vertical appartient à la colonne, pas au tableau ; le glissement a la copie qui suit le pointeur, l'espace réservé et le défilement automatique aux bords. La carte se déplace aussi avec Alt et les flèches depuis la poignée.",
  "La paginazione si sposta da sé alla pagina richiesta e riporta il cambio con page-change: il totale lo riceve, i dati non li taglia. La finestra delle pagine numerate lascia sempre raggiungibili la prima e l'ultima, e sotto i 560px di spazio il numero della pagina prende il posto dell'elenco; con form compact restano intervallo e frecce.":
    "La pagination se déplace seule vers la page demandée et rapporte le changement avec page-change : elle reçoit le total et ne découpe jamais les données. La fenêtre des pages garde la première et la dernière accessibles, et sous 560px d'espace le numéro de page remplace la liste ; form compact garde la plage et les flèches.",
  "La tabella ordina e pagina da sé le righe che riceve, applica selezione, apertura riga, raggruppamento e cambi di colonna, e cede il caricamento all'applicazione solo quando le si passano sortHandler, pageHandler e columnHandler. L'intestazione resta ferma, le colonne fissate restano visibili mentre scorri e le righe si aprono con un dettaglio.":
    "La table trie et pagine seule les lignes qu'elle reçoit, applique la sélection, l'ouverture de ligne, le regroupement et les changements de colonne, et confie le chargement à l'application seulement lorsqu'on lui passe sortHandler, pageHandler et columnHandler. L'en-tête reste fixe, les colonnes figées restent visibles pendant le défilement et les lignes s'ouvrent avec un détail.",
  "Piano minimo": "Plan minimal",
  "Il piano disegna le attività sull'asse del tempo: parent costruisce l'albero e una attività con figli diventa una barra di riepilogo. L'altezza del host è obbligatoria, perché la superficie riempie lo spazio che riceve.":
    "Le plan dessine les tâches sur l'axe du temps : parent construit l'arbre et une tâche avec des enfants devient une barre de synthèse. La hauteur de l'hôte est obligatoire, car la surface remplit l'espace qu'elle reçoit.",
  "Colonne e contenuto delle celle": "Colonnes et contenu des cellules",
  "columns sceglie le colonne della griglia: le chiavi note (code, name, resource, start, end, duration, progress, deps) hanno già il loro contenuto, una chiave nuova prende render e riceve l'attività. Le regole CSS del markup passano da contentStyles, perché gira dentro lo shadow root del piano.":
    "columns choisit les colonnes de la grille : les clés connues (code, name, resource, start, end, duration, progress, deps) ont déjà leur contenu, une nouvelle clé prend render et reçoit la tâche. Les règles CSS de ce balisage passent par contentStyles, car elles s'exécutent dans le shadow root du plan.",
  "Spostare e ridimensionare": "Déplacer et redimensionner",
  "editable abilita il trascinamento, le maniglie ai lati e le frecce con Alt. restrict decide se lo spostamento è ammesso e il rifiuto arriva con task-change-blocked. Il piano applica lo spostamento da sé e lo riporta con task-change: qui lo si conserva.":
    "editable active le glissement, les poignées sur les côtés et les flèches avec Alt. restrict décide si le déplacement est autorisé et le refus arrive avec task-change-blocked. Le plan applique le déplacement seul et le rapporte avec task-change : ici on le conserve.",
  "Contenuto della barra": "Contenu de la barre",
  "barRenderer sostituisce quello che la barra mostra: riceve l'attività, il piano e l'intervallo calcolato, che per una attività con figli è il riepilogo dei discendenti. Serve per badge, percentuali e icone; le regole CSS vanno in contentStyles.":
    "barRenderer remplace ce que la barre affiche : il reçoit la tâche, le plan et l'intervalle calculé, qui pour une tâche avec enfants est la synthèse de ses descendants. Utile pour des badges, des pourcentages et des icônes ; ses règles CSS vont dans contentStyles.",
  "Stati e slot": "États et slots",
  "loading, error ed empty prendono il posto delle righe. Gli slot loading, error ed empty li sostituiscono con il contenuto dell'applicazione: un pulsante che ricrea il piano, un comando di ricarica o un'azione per aggiungere la prima attività.":
    "loading, error et empty prennent la place des lignes. Les slots loading, error et empty les remplacent par le contenu de l'application : un bouton qui recrée le plan, une commande de rechargement ou une action pour ajouter la première tâche.",
  "Aggiunge azioni dentro lo stato vuoto predefinito.":
    "Ajoute des actions dans l'état vide par défaut.",
  "Aggiunge un'area sopra la tabella, fuori dal riquadro.":
    "Ajoute une zone au-dessus de la table, hors du cadre.",
  "Area che riceve lo scorrimento verticale e orizzontale.":
    "Zone qui reçoit le défilement vertical et horizontal.",
  "Area del riepilogo di gruppo.": "Zone de la synthèse de groupe.",
  "Area della paginazione.": "Zone de la pagination.",
  "Area espansa sotto la riga.": "Zone dépliée sous la ligne.",
  "Cella dati.": "Cellule de données.",
  "Contenitore esterno della tabella.": "Conteneur extérieur de la table.",
  "Controllo separatore della larghezza colonna.":
    "Contrôle séparateur de la largeur de colonne.",
  "Il contenuto delle celle non passa dagli slot: il componente chiama column.render, rowRenderer, detail e groupSummary. Gli slot coprono le aree esterne alla tabella.":
    "Le contenu des cellules ne passe pas par des slots : le composant appelle column.render, rowRenderer, detail et groupSummary. Les slots couvrent les zones extérieures à la table.",
  "Il contenuto delle righe non passa dagli slot: il componente chiama column.render per una cella e barRenderer per la barra, e groupLabel per il nome di un gruppo. Gli slot coprono gli stati, quando al posto delle righe non c'è nulla da mostrare.":
    "Le contenu des lignes ne passe pas par des slots : le composant appelle column.render pour une cellule, barRenderer pour la barre et groupLabel pour le nom d'un groupe. Les slots couvrent les états, quand il n'y a aucune ligne à afficher.",
  "Intestazione della tabella.": "En-tête de la table.",
  "Pulsante che attiva l'ordinamento.": "Bouton qui active le tri.",
  "Riga dati.": "Ligne de données.",
  "Riga di raggruppamento.": "Ligne de regroupement.",
  "Riquadro dello stato di caricamento.": "Cadre de l'état de chargement.",
  "Riquadro dello stato di errore.": "Cadre de l'état d'erreur.",
  "Riquadro dello stato vuoto.": "Cadre de l'état vide.",
  "Singola cella di intestazione.": "Cellule d'en-tête unique.",
  "Sostituisce interamente lo stato vuoto.":
    "Remplace entièrement l'état vide.",
  "Sostituisce la paginazione predefinita.":
    "Remplace la pagination par défaut.",
  "Sostituisce lo stato mostrato durante il caricamento iniziale.":
    "Remplace l'état affiché pendant le chargement initial.",
  "Sostituisce lo stato mostrato mentre loading è attivo.":
    "Remplace l'état affiché pendant que loading est actif.",
  "Sostituisce lo stato mostrato quando error contiene un messaggio.":
    "Remplace l'état affiché quand error contient un message.",
  "Sostituisce lo stato mostrato quando non ci sono attività.":
    "Remplace l'état affiché quand il n'y a aucune tâche.",
  "Stato di caricamento.": "État de chargement.",
  "Stato di errore.": "État d'erreur.",
  "Stato vuoto.": "État vide.",
  "Albero della navigazione.": "Arborescence de navigation.",
  "Area che riceve i comandi esterni.":
    "Zone qui reçoit les commandes externes.",
  "Area che riceve lo scorrimento.": "Zone qui reçoit le défilement.",
  "Area dei risultati della ricerca.": "Zone des résultats de recherche.",
  "Area del calendario.": "Zone du calendrier.",
  "Area del carosello.": "Zone du carrousel.",
  "Area del testo di supporto.": "Zone du texte d'aide.",
  "Area di scrittura.": "Zone de saisie.",
  "Area di stato dell'impalcatura.": "Zone d'état de la coque.",
  "Area di stato.": "Zone d'état.",
  "Area finale dell'elemento.": "Zone finale de l'élément.",
  "Area inferiore dell'impalcatura.": "Zone inférieure de la coque.",
  "Area iniziale dell'elemento.": "Zone initiale de l'élément.",
  "Area sopra il contenuto, fuori dal riquadro.":
    "Zone au-dessus du contenu, hors du cadre.",
  "Area sotto il contenuto.": "Zone sous le contenu.",
  "Avanzamento dell'attività.": "Avancement de la tâche.",
  "Avatar mostrato accanto al testo.": "Avatar affiché à côté du texte.",
  "Barra dei comandi.": "Barre de commandes.",
  "Barra dell'applicazione.": "Barre de l'application.",
  "Barra di navigazione.": "Barre de navigation.",
  "Barra inferiore dell'impalcatura.": "Barre inférieure de la coque.",
  "Barra stretta della navigazione.": "Barre de navigation étroite.",
  "Barra stretta di navigazione.": "Barre de navigation étroite.",
  "Barra superiore dell'impalcatura.": "Barre supérieure de la coque.",
  "Binario del cursore.": "Rail du curseur.",
  "Binario su cui scorre l'indicatore.":
    "Rail sur lequel l'indicateur se déplace.",
  "Blocco del titolo e del sottotitolo.": "Bloc du titre et du sous-titre.",
  "Bolla visibile della superficie.": "Bulle visible de la surface.",
  "Campo dei minuti.": "Champ des minutes.",
  "Campo delle ore.": "Champ des heures.",
  "Campo di filtro.": "Champ de filtre.",
  "Campo di ricerca.": "Champ de recherche.",
  "Campo o comando che filtra il contenuto.":
    "Champ ou commande qui filtre le contenu.",
  "Cella che contiene il dettaglio.": "Cellule qui contient le détail.",
  "Cella dei comandi di riga.": "Cellule des commandes de ligne.",
  "Cella del comando di apertura.": "Cellule de la commande d'ouverture.",
  "Cella della casella di selezione.": "Cellule de la case de sélection.",
  "Cella di dati.": "Cellule de données.",
  "Colonna della board.": "Colonne du tableau.",
  "Comandi del pannello di supporto.": "Commandes du panneau d'aide.",
  "Comandi di avanzamento del contenuto.":
    "Commandes de progression du contenu.",
  "Comandi in coda all'area o sotto il contenuto.":
    "Commandes en fin de zone ou sous le contenu.",
  "Comando associato al contenuto.": "Commande associée au contenu.",
  "Comando che apre e chiude il gruppo.":
    "Commande qui ouvre et ferme le groupe.",
  "Comando che apre il sottoelenco.": "Commande qui ouvre la sous-liste.",
  "Comando che chiude la superficie.": "Commande qui ferme la surface.",
  "Comando che chiude senza confermare.": "Commande qui ferme sans confirmer.",
  "Comando che ferma l'operazione.": "Commande qui arrête l'opération.",
  "Comando che toglie la pastiglia.": "Commande qui retire la pastille.",
  "Comando del periodo, mattina o pomeriggio.":
    "Commande de la période, matin ou après-midi.",
  "Comando di annullamento.": "Commande d'annulation.",
  "Comando di conferma.": "Commande de confirmation.",
  "Conteggio dell'elemento di navigazione.":
    "Compteur de l'élément de navigation.",
  "Conteggio mostrato accanto al testo.": "Compteur affiché à côté du texte.",
  "Contenitore degli elementi.": "Conteneur des éléments.",
  "Contenitore dell'impalcatura.": "Conteneur de la coque.",
  "Contenitore della navigazione.": "Conteneur de la navigation.",
  "Contenitore interno del componente.": "Conteneur interne du composant.",
  "Contenuto centrale, quando il componente ne separa uno.":
    "Contenu central, quand le composant en sépare un.",
  "Contenuto del comando che torna indietro.":
    "Contenu de la commande de retour.",
  "Contenuto del comando che va avanti.": "Contenu de la commande d'avance.",
  "Contenuto del componente.": "Contenu du composant.",
  "Contenuto del dettaglio.": "Contenu du détail.",
  "Contenuto dell'area vuota predefinita.":
    "Contenu de la zone vide par défaut.",
  "Contenuto dell'elenco.": "Contenu de la liste.",
  "Contenuto della barra dei comandi.": "Contenu de la barre de commandes.",
  "Contenuto dopo il campo di testo.": "Contenu après le champ de texte.",
  "Contenuto dopo il testo: icona o valore.":
    "Contenu après le texte : icône ou valeur.",
  "Contenuto dopo il valore.": "Contenu après la valeur.",
  "Contenuto interno della riga.": "Contenu interne de la ligne.",
  "Contenuto prima del campo di testo.": "Contenu avant le champ de texte.",
  "Contenuto prima del testo: icona o avatar.":
    "Contenu avant le texte : icône ou avatar.",
  "Contenuto prima del valore.": "Contenu avant la valeur.",
  "Contenuto principale del componente.": "Contenu principal du composant.",
  "Contenuto scorrevole del corpo.": "Contenu défilant du corps.",
  "Controllo nativo che riceve il clic.": "Contrôle natif qui reçoit le clic.",
  "Corpo del componente, sotto l'intestazione.":
    "Corps du composant, sous l'en-tête.",
  "Corpo scorrevole della superficie.": "Corps défilant de la surface.",
  "Corsia della board.": "Couloir du tableau.",
  "Cursore inferiore dell'intervallo.": "Curseur inférieur de l'intervalle.",
  "Cursore superiore dell'intervallo.": "Curseur supérieur de l'intervalle.",
  "Cursore.": "Curseur.",
  "Destinazione della barra.": "Destination de la barre.",
  "Destinazione della navigazione.": "Destination de la navigation.",
  "Elemento che apre il menu o l'overlay.":
    "Élément qui ouvre le menu ou la surcouche.",
  "Elemento che apre l'overlay.": "Élément qui ouvre la surcouche.",
  "Elemento della barra stretta.": "Élément de la barre étroite.",
  "Elemento della destinazione.": "Élément de la destination.",
  "Elenco dei passi.": "Liste des étapes.",
  "Elenco dei risultati.": "Liste des résultats.",
  "Elenco dei suggerimenti.": "Liste des suggestions.",
  "Elenco delle destinazioni.": "Liste des destinations.",
  "Elenco delle schede.": "Liste des onglets.",
  "Elenco interno del componente.": "Liste interne du composant.",
  "Etichetta del controllo, collegata al campo.":
    "Étiquette du contrôle, liée au champ.",
  "Etichetta del valore finale di un intervallo.":
    "Étiquette de la valeur finale d'un intervalle.",
  "Finestra visibile del contenuto.": "Fenêtre visible du contenu.",
  "Freccia che indica l'apertura.": "Flèche qui indique l'ouverture.",
  "Freccia del gruppo.": "Flèche du groupe.",
  "Freccia dell'elemento di navigazione.": "Flèche de l'élément de navigation.",
  "Goccia che segue il cursore.": "Goutte qui suit le curseur.",
  "Griglia dei giorni.": "Grille des jours.",
  "Gruppo che tiene insieme gli elementi.": "Groupe qui réunit les éléments.",
  "Gruppo dei pulsanti flottanti.": "Groupe des boutons flottants.",
  "I passi leggono le voci dalle proprietà e prendono dallo slot label il testo del passo corrente, quando il nome non basta.":
    "Les étapes lisent leurs éléments dans les propriétés et prennent le texte de l'étape courante dans le slot label, quand le nom ne suffit pas.",
  "Icona che accompagna il contenuto.": "Icône qui accompagne le contenu.",
  "Icona del componente.": "Icône du composant.",
  "Icona dell'elemento di navigazione.": "Icône de l'élément de navigation.",
  "Icona dell'elemento stretto.": "Icône de l'élément étroit.",
  "Icona dell'elemento.": "Icône de l'élément.",
  "Icona della destinazione.": "Icône de la destination.",
  "Icona della scheda.": "Icône de l'onglet.",
  "Icona dello stato attivo.": "Icône de l'état actif.",
  "Icona dello stato inattivo.": "Icône de l'état inactif.",
  "Icona finale dell'elemento.": "Icône finale de l'élément.",
  "Il badge mostra un conteggio o una parola sopra un altro elemento e prende dallo slot label il testo, quando non vuoi passarlo come proprietà.":
    "Le badge affiche un compteur ou un mot au-dessus d'un autre élément et prend son texte dans le slot label, quand il n'est pas passé en propriété.",
  "Il campo con suggerimenti prende dagli slot gli stessi contenuti del campo di testo; l'elenco dei suggerimenti si apre da sé sopra il resto del contenuto.":
    "Le champ avec suggestions prend les mêmes contenus de slot que le champ de texte ; la liste de suggestions s'ouvre seule au-dessus du reste du contenu.",
  "Il campo di testo prende dallo slot predefinito nulla del contenuto scritto, che resta nell'input, e dagli altri slot l'icona iniziale, il prefisso, il suffisso, il comando finale e il testo di supporto.":
    "Le champ de texte ne prend aucun contenu saisi dans le slot par défaut, car il reste dans l'input, et prend dans les autres slots l'icône initiale, le préfixe, le suffixe, la commande finale et le texte d'aide.",
  "Il carosello scorre gli elementi che riceve nello slot predefinito e prende dagli slot i comandi di avanzamento, lo stato letto dai lettori di schermo e i controlli aggiuntivi.":
    "Le carrousel fait défiler les éléments reçus dans le slot par défaut et prend dans les slots les commandes de progression, l'état lu par les lecteurs d'écran et les contrôles supplémentaires.",
  "Il contenuto della navigazione non passa dagli slot: il componente legge items, groups e actions e chiama item e railItem per il contenuto di una voce. Gli slot coprono l'intestazione, il filtro, il piè di pagina e lo stato vuoto.":
    "Le contenu de la navigation ne passe pas par des slots : le composant lit items, groups et actions et appelle item et railItem pour le contenu d'une entrée. Les slots couvrent l'en-tête, le filtre, le pied de page et l'état vide.",
  "Il contenuto di una scheda non passa dagli slot: il componente legge columns e cards e chiama card per il contenuto della scheda. Gli slot coprono gli stati, quando al posto della board non c'è nulla da mostrare.":
    "Le contenu d'une carte ne passe pas par des slots : le composant lit columns et cards et appelle card pour le contenu de la carte. Les slots couvrent les états, quand il n'y a rien à afficher à la place du tableau.",
  "Il controllo a segmenti legge le voci dalle proprietà e non ha slot: label resta la legenda del gruppo, e con multiple la scelta ammette più segmenti.":
    "Le contrôle segmenté lit ses éléments dans les propriétés et n'a pas de slots : label reste la légende du groupe, et multiple autorise plusieurs segments.",
  "Il cursore prende dagli slot l'icona alle due estremità, l'etichetta e il valore mostrato; con range mostra due cursori e riporta entrambi i valori.":
    "Le curseur prend dans les slots l'icône aux deux extrémités, l'étiquette et la valeur affichée ; avec range il montre deux curseurs et rapporte les deux valeurs.",
  "Il dialogo prende dallo slot predefinito il contenuto e dagli altri due il titolo letto come intestazione e la riga dei comandi; con modal blocca la pagina, con fullscreen la occupa.":
    "Le dialogue prend le contenu dans le slot par défaut et, dans les deux autres, le titre lu comme en-tête et la ligne de commandes ; modal bloque la page, fullscreen l'occupe.",
  "Il foglio dal basso prende dallo slot predefinito il contenuto, dallo slot heading il titolo e da actions i comandi; drag-handle mostra la presa che lo trascina.":
    "Le panneau inférieur prend le contenu dans le slot par défaut, le titre dans le slot heading et les commandes dans actions ; drag-handle affiche la poignée qui le fait glisser.",
  "Il foglio laterale prende dallo slot predefinito il contenuto, da heading il titolo e da actions i comandi; entra dal lato indicato da placement e modal lo rende bloccante.":
    "Le panneau latéral prend le contenu dans le slot par défaut, le titre dans heading et les commandes dans actions ; il entre du côté indiqué par placement et modal le rend bloquant.",
  "Il gruppo impila gli avatar che riceve e riassume i restanti in un conteggio: lo slot predefinito riceve i bolle-avatar, e l'ordine è quello in cui li scrivi.":
    "Le groupe empile les avatars reçus et résume les autres dans un compteur : le slot par défaut reçoit les bolle-avatar, dans l'ordre où ils sont écrits.",
  "Il gruppo tiene insieme pulsanti adiacenti e prende dallo slot predefinito i pulsanti da unire, nell'ordine in cui li scrivi.":
    "Le groupe réunit des boutons adjacents et prend dans le slot par défaut les boutons à joindre, dans l'ordre où ils sont écrits.",
  "Il menu dei pulsanti flottanti legge le azioni dalle proprietà e prende dallo slot icon il simbolo del pulsante che lo apre.":
    "Le menu des boutons flottants lit ses actions dans les propriétés et prend dans le slot icon le symbole du bouton qui l'ouvre.",
  "Il menu si apre con show(anchor) e legge le voci dalle proprietà, non dagli slot: ogni voce porta testo, icona, scorciatoia e sotto-menu.":
    "Le menu s'ouvre avec show(anchor) et lit ses entrées dans les propriétés, pas dans des slots : chaque entrée porte texte, icône, raccourci et sous-menu.",
  "Il messaggio si mostra con show() e prende dagli slot il testo, l'azione che lo accompagna e il comando che lo chiude; la proprietà message resta la scorciatoia per il solo testo.":
    "Le message s'affiche avec show() et prend dans les slots le texte, l'action qui l'accompagne et la commande qui le ferme ; la propriété message reste le raccourci pour le texte seul.",
  "Il pannello di navigazione prende dallo slot predefinito le voci, da heading il titolo e da actions i comandi in coda, e si apre in linea o sovrapposto alla pagina.":
    "Le panneau de navigation prend les entrées dans le slot par défaut, le titre dans heading et les commandes de fin dans actions, et s'ouvre en ligne ou par-dessus la page.",
  "Il pulsante a icona prende dallo slot predefinito il simbolo e da icon la variante grafica; label resta obbligatoria perché è il nome letto dai lettori di schermo.":
    "Le bouton icône prend le symbole dans le slot par défaut et la variante graphique dans icon ; label reste obligatoire car c'est le nom lu par les lecteurs d'écran.",
  "Il pulsante di opzione prende dallo slot predefinito il testo e si raggruppa per name: scegliere una voce toglie la scelta alle altre dello stesso gruppo.":
    "Le bouton radio prend son texte dans le slot par défaut et se regroupe par name : choisir une entrée retire le choix aux autres du même groupe.",
  "Il pulsante diviso separa l'azione principale dal menu: lo slot predefinito riceve il testo del pulsante, icon l'icona e il menu si apre dal comando a fianco.":
    "Le bouton divisé sépare l'action principale du menu : le slot par défaut reçoit le texte du bouton, icon l'icône, et le menu s'ouvre depuis la commande voisine.",
  "Il pulsante flottante esteso mostra icona e testo insieme: lo slot predefinito riceve il testo e lo slot icon il simbolo.":
    "Le bouton flottant étendu montre icône et texte ensemble : le slot par défaut reçoit le texte et le slot icon le symbole.",
  "Il pulsante flottante prende dallo slot predefinito il testo, che con size regular resta nascosto, e da icon il simbolo; extended aggiunge l'etichetta accanto all'icona.":
    "Le bouton flottant prend le texte dans le slot par défaut, masqué avec size regular, et le symbole dans icon ; extended ajoute l'étiquette à côté de l'icône.",
  "Il pulsante prende dallo slot predefinito il testo e dagli altri due l'icona iniziale e quella finale; la variante decide se il contenuto è testo, icona o entrambi.":
    "Le bouton prend le texte dans le slot par défaut et, dans les deux autres, les icônes initiale et finale ; la variante décide si le contenu est texte, icône ou les deux.",
  "Il selettore di data prende dagli slot il titolo del pannello e il testo di supporto del campo; end-label nomina il valore finale quando selection-mode è range.":
    "Le sélecteur de date prend dans les slots le titre du panneau et le texte d'aide du champ ; end-label nomme la valeur finale quand selection-mode vaut range.",
  "Il selettore di orario prende dagli slot il titolo del quadrante e il testo di supporto del campo; con format a ventiquattro ore sparisce il periodo.":
    "Le sélecteur d'heure prend dans les slots le titre du cadran et le texte d'aide du champ ; avec un format sur vingt-quatre heures la période disparaît.",
  "Il separatore non ha slot: disegna una linea fra due gruppi di contenuto, con inset per staccarla dai bordi e vertical per separare elementi affiancati.":
    "Le séparateur n'a pas de slots : il trace une ligne entre deux groupes de contenu, avec inset pour la détacher des bords et vertical pour séparer des éléments côte à côte.",
  "Il suggerimento si aggancia a un elemento con show(anchor) e prende dallo slot predefinito il contenuto; gli altri slot coprono etichetta, testo di supporto, comandi e il comando di chiusura delle varianti ricche.":
    "L'infobulle s'accroche à un élément avec show(anchor) et prend son contenu dans le slot par défaut ; les autres slots couvrent l'étiquette, le texte d'aide, les commandes et la commande de fermeture des variantes riches.",
  "Immagine o contenuto grafico della superficie.":
    "Image ou contenu graphique de la surface.",
  "Indicatore circolare.": "Indicateur circulaire.",
  "Indicatore dell'elemento attivo.": "Indicateur de l'élément actif.",
  "Indicatore della destinazione attiva.":
    "Indicateur de la destination active.",
  "Indicatore dello stato o della posizione.":
    "Indicateur de l'état ou de la position.",
  "Indicatore lineare.": "Indicateur linéaire.",
  "Intervallo scelto.": "Intervalle choisi.",
  "Intestazione del calendario.": "En-tête du calendrier.",
  "Intestazione del componente.": "En-tête du composant.",
  "Intestazione del pannello di supporto.": "En-tête du panneau d'aide.",
  "Intestazione della colonna.": "En-tête de la colonne.",
  "Intestazione della corsia.": "En-tête du couloir.",
  "Intestazione della scheda.": "En-tête de la carte.",
  "Intestazione della superficie.": "En-tête de la surface.",
  "Intestazione fornita dall'applicazione.":
    "En-tête fourni par l'application.",
  "L'avatar mostra iniziali o un'immagine e prende dallo slot icon il simbolo che sostituisce le iniziali, per esempio quando l'immagine non è disponibile.":
    "L'avatar affiche des initiales ou une image et prend dans le slot icon le symbole qui remplace les initiales, par exemple quand l'image manque.",
  "L'elenco prende dallo slot predefinito le righe, scritte come bolle-list-item, e le compone con icona, testo, supporto e coda; itemRenderer sostituisce l'intera riga.":
    "La liste prend les lignes dans le slot par défaut, écrites en bolle-list-item, et les compose avec icône, texte, aide et contenu final ; itemRenderer remplace la ligne entière.",
  "L'impalcatura compone le superfici intorno al contenuto: la navigazione, la barra, quella inferiore e il pannello di supporto arrivano dagli slot, e il contenuto principale è lo slot predefinito.":
    "La coque compose les surfaces autour du contenu : la navigation, la barre, la barre inférieure et le panneau d'aide viennent des slots, et le contenu principal est le slot par défaut.",
  "L'indicatore di avanzamento non ha slot: riceve value, min, max e label e disegna la forma lineare o circolare; con indeterminate segnala un'attesa senza valore.":
    "L'indicateur de progression n'a pas de slots : il reçoit value, min, max et label et dessine la forme linéaire ou circulaire ; indeterminate signale une attente sans valeur.",
  "L'indicatore di caricamento non ha slot: mostra un'animazione con la label accessibile che gli passi, e contained lo appoggia su una superficie.":
    "L'indicateur de chargement n'a pas de slots : il affiche une animation avec l'étiquette accessible fournie, et contained le pose sur une surface.",
  "L'interruttore prende dallo slot predefinito il testo dell'etichetta e cambia stato da sé, riportando il valore con l'evento change.":
    "L'interrupteur prend le texte de l'étiquette dans le slot par défaut et change d'état seul, en rapportant la valeur avec l'événement change.",
  "La barra dei comandi dispone gli elementi che riceve nello slot predefinito, e con variabili può portare a capo i comandi in eccesso invece di comprimerli.":
    "La barre de commandes dispose les éléments reçus dans le slot par défaut et peut renvoyer à la ligne les commandes en trop au lieu de les comprimer.",
  "La barra dell'applicazione prende dal titolo il testo principale e dagli slot i comandi iniziali e finali; lo slot predefinito sostituisce il titolo quando serve un'intestazione più ricca.":
    "La barre de l'application prend le texte principal dans le titre et les commandes initiales et finales dans les slots ; le slot par défaut remplace le titre quand un en-tête plus riche est nécessaire.",
  "La barra di navigazione legge le destinazioni dalle proprietà, non dagli slot: ogni destinazione porta icona, testo e indicatore di attività.":
    "La barre de navigation lit ses destinations dans les propriétés, pas dans des slots : chaque destination porte icône, texte et indicateur d'activité.",
  "La barra inferiore tiene i comandi in linea e il pulsante flottante: lo slot predefinito riceve i comandi, gli altri slot l'elemento iniziale, quello finale e il pulsante flottante.":
    "La barre inférieure tient les commandes en ligne et le bouton flottant : le slot par défaut reçoit les commandes, les autres slots l'élément initial, final et le bouton flottant.",
  "La barra stretta legge le destinazioni dalle proprietà: con expanded mostra anche i testi, altrimenti resta alle icone con il suggerimento.":
    "La barre étroite lit ses destinations dans les propriétés : avec expanded elle affiche aussi les textes, sinon elle reste aux icônes avec l'infobulle.",
  "La casella prende dallo slot predefinito il testo dell'etichetta e si collega al campo con name, value e checked; indeterminate mostra lo stato misto.":
    "La case prend le texte de l'étiquette dans le slot par défaut et se lie au champ avec name, value et checked ; indeterminate montre l'état mixte.",
  "La dashboard dispone i riquadri che le passi e non impone contenuti: ogni riquadro è un bolle-widget nello slot predefinito, con intestazione, corpo, comandi e maniglia di ridimensionamento già forniti dal widget.":
    "Le tableau de bord dispose les tuiles reçues et n'impose aucun contenu : chaque tuile est un bolle-widget dans le slot par défaut, avec en-tête, corps, commandes et poignée de redimensionnement fournis par le widget.",
  "La paginazione non ha slot: mostra l'intervallo, le frecce e le pagine numerate, e si sposta alla pagina richiesta riportandola con page-change.":
    "La pagination n'a pas de slots : elle affiche la plage, les flèches et les pages numérotées, et se déplace vers la page demandée en la rapportant avec page-change.",
  "La pastiglia prende dallo slot predefinito il testo e dagli altri un'icona o un avatar; removable aggiunge il comando che la toglie.":
    "La pastille prend son texte dans le slot par défaut et, dans les autres, une icône ou un avatar ; removable ajoute la commande qui la retire.",
  "La ricerca prende dagli slot il contenuto del campo e dei risultati: results riceve l'elenco che compare sotto la barra, il resto segue le regole del campo di testo.":
    "La recherche prend dans les slots le contenu du champ et des résultats : results reçoit la liste affichée sous la barre, le reste suit les règles du champ de texte.",
  "La scheda prende dallo slot predefinito il contenuto e dagli altri slot l'immagine di testa e la riga di comandi: media occupa la larghezza, content resta la scorciatoia per il solo blocco interno.":
    "La carte prend le contenu dans le slot par défaut et, dans les autres slots, l'image de tête et la ligne de commandes : media occupe la largeur, content reste le raccourci pour le seul bloc interne.",
  "La select avvolge un elemento select nativo: le opzioni restano nel markup, e lo slot supporting porta il testo che spiega la scelta.":
    "La select enveloppe un élément select natif : les options restent dans le balisage et le slot supporting porte le texte qui explique le choix.",
  "Le briciole arrivano da items, non dagli slot: il componente disegna il percorso, separa le voci e rende l'ultima come pagina corrente.":
    "Le fil d'Ariane vient de items, pas de slots : le composant dessine le chemin, sépare les entrées et rend la dernière comme page courante.",
  "Le schede leggono le voci dalle proprietà e prendono dallo slot predefinito i pannelli: ogni pannello dichiara con slot il nome della scheda che lo apre.":
    "Les onglets lisent leurs entrées dans les propriétés et prennent les panneaux dans le slot par défaut : chaque panneau nomme l'onglet qui l'ouvre via slot.",
  "Linea di separazione.": "Ligne de séparation.",
  "Lo stato vuoto centra un'icona, un titolo e un testo, e prende dallo slot actions il comando che fa uscire dallo stato vuoto.":
    "L'état vide centre une icône, un titre et un texte, et prend dans le slot actions la commande qui sort de l'état vide.",
  "Maniglia che ridimensiona il pannello.":
    "Poignée qui redimensionne le panneau.",
  "Marchio in cima alla navigazione.": "Marque en haut de la navigation.",
  "Membrana della superficie.": "Membrane de la surface.",
  "Menu dell'overlay.": "Menu de la surcouche.",
  "Messaggio testuale della superficie.": "Message textuel de la surface.",
  "Modulo della ricerca.": "Formulaire de la recherche.",
  "Navigazione principale dell'impalcatura.":
    "Navigation principale de la coque.",
  "Navigazione ridotta a icona.": "Navigation réduite à l'icône.",
  "Nome del giorno della settimana.": "Nom du jour de la semaine.",
  "Numero di righe del gruppo.": "Nombre de lignes du groupe.",
  "Numero di schede della colonna.": "Nombre de cartes de la colonne.",
  "Onda dell'indicatore.": "Onde de l'indicateur.",
  "Pannello che entra dal bordo.": "Panneau qui entre par le bord.",
  "Pannello della scheda attiva.": "Panneau de l'onglet actif.",
  "Piè di pagina del componente.": "Pied de page du composant.",
  "Ponte che collega i due cursori.": "Pont qui relie les deux curseurs.",
  "Presa che avvia il trascinamento della scheda.":
    "Poignée qui démarre le glissement de la carte.",
  "Presa che avvia il trascinamento.": "Poignée qui démarre le glissement.",
  "Presa del cursore.": "Poignée du curseur.",
  "Pulsante del giorno.": "Bouton du jour.",
  "Pulsante flottante agganciato all'angolo.": "Bouton flottant ancré au coin.",
  "Pulsante interno del componente.": "Bouton interne du composant.",
  "Punto del passo.": "Point de l'étape.",
  "Quadrante dell'ora.": "Cadran de l'heure.",
  "Ramo dell'albero di navigazione.": "Branche de l'arborescence.",
  "Riepilogo del gruppo.": "Synthèse du groupe.",
  "Riga dei comandi.": "Ligne de commandes.",
  "Riga del dettaglio aperto.": "Ligne du détail ouvert.",
  "Riga della tabella o dell'elenco.": "Ligne de la table ou de la liste.",
  "Riga di dati della scheda.": "Ligne de données de la carte.",
  "Riga scelta.": "Ligne choisie.",
  "Riga visibile dell'elemento.": "Ligne visible de l'élément.",
  "Riquadro del campo.": "Cadre du champ.",
  "Riquadro del dialogo.": "Cadre du dialogue.",
  "Riquadro del riquadro della dashboard.": "Tuile du tableau de bord.",
  "Scheda interna del componente.": "Carte interne du composant.",
  "Segnalazione dell'elemento.": "Signal de l'élément.",
  "Segnalazione della scheda.": "Signal de l'onglet.",
  "Segnalazione sovrapposta, come un conteggio.":
    "Signal superposé, comme un compteur.",
  "Segnalazione sovrapposta.": "Signal superposé.",
  "Selettore della modalità.": "Sélecteur de mode.",
  "Singola riga dell'elenco.": "Ligne unique de la liste.",
  "Singola scheda della barra.": "Onglet unique de la barre.",
  "Singola voce dell'elenco.": "Entrée unique de la liste.",
  "Singolo elemento dell'elenco.": "Élément unique de la liste.",
  "Singolo giorno.": "Jour unique.",
  "Singolo passo.": "Étape unique.",
  "Singolo segmento del controllo.": "Segment unique du contrôle.",
  "Singolo suggerimento.": "Suggestion unique.",
  "Sostituisce lo stato mostrato durante il caricamento.":
    "Remplace l'état affiché pendant le chargement.",
  "Sostituisce lo stato mostrato quando non ci sono dati.":
    "Remplace l'état affiché quand il n'y a pas de données.",
  "Sottoelenco dell'elemento.": "Sous-liste de l'élément.",
  "Sottotitolo della superficie.": "Sous-titre de la surface.",
  "Superficie del campo, su cui si disegna il contorno.":
    "Surface du champ, où se dessine le contour.",
  "Superficie del messaggio.": "Surface du message.",
  "Superficie del suggerimento.": "Surface de l'infobulle.",
  "Superficie della board.": "Surface du tableau.",
  "Superficie della pastiglia.": "Surface de la pastille.",
  "Superficie visibile della bolla o del pannello.":
    "Surface visible de la bulle ou du panneau.",
  "Supporto in linea, accanto al contenuto.":
    "Aide en ligne, à côté du contenu.",
  "Supporto sovrapposto al contenuto.": "Aide superposée au contenu.",
  "Testo del segmento.": "Texte du segment.",
  "Testo dell'elemento di navigazione.": "Texte de l'élément de navigation.",
  "Testo dell'elemento stretto.": "Texte de l'élément étroit.",
  "Testo dell'etichetta.": "Texte de l'étiquette.",
  "Testo della destinazione.": "Texte de la destination.",
  "Testo della pastiglia.": "Texte de la pastille.",
  "Testo della scheda.": "Texte de l'onglet.",
  "Testo della segnalazione.": "Texte du signal.",
  "Testo di supporto sotto il contenuto principale.":
    "Texte d'aide sous le contenu principal.",
  "Testo mostrato quando il campo è vuoto.":
    "Texte affiché quand le champ est vide.",
  "Testo principale dell'elemento.": "Texte principal de l'élément.",
  "Testo scritto dentro l'etichetta.": "Texte écrit dans l'étiquette.",
  "Testo secondario dell'elemento.": "Texte secondaire de l'élément.",
  "Testo secondario sotto il contenuto.": "Texte secondaire sous le contenu.",
  "Titolo del gruppo.": "Titre du groupe.",
  "Titolo dell'area, letto come intestazione.":
    "Titre de la zone, lu comme en-tête.",
  "Titolo della colonna.": "Titre de la colonne.",
  "Titolo della superficie.": "Titre de la surface.",
  "Titolo principale della superficie.": "Titre principal de la surface.",
  "Traccia che tiene i segmenti.": "Piste qui tient les segments.",
  "Valore mostrato accanto all'etichetta.":
    "Valeur affichée à côté de l'étiquette.",
  "Valore numerico o testuale.": "Valeur numérique ou textuelle.",
  "Valore sul quadrante.": "Valeur sur le cadran.",
  "Velo mostrato durante un aggiornamento.":
    "Voile affiché pendant une mise à jour.",
  "Contenuto del pannello della scheda con questo identificatore.":
    "Contenu du panneau d'onglet avec cet identifiant.",
  "Albero di navigazione": "Arborescence de navigation",
  "Avanzamento lineare e circolare": "Avancement linéaire et circulaire",
  "Avatar con icona al posto delle iniziali":
    "Avatar avec une icône au lieu des initiales",
  "Avatar con immagine o iniziali": "Avatar avec image ou initiales",
  "Azione principale e menu": "Action principale et menu",
  "Azioni rapide": "Actions rapides",
  "Barra che si comprime allo scorrimento":
    "Barre qui se comprime au défilement",
  "Barra dell'applicazione": "Barre de l'application",
  "Barra di comandi": "Barre de commandes",
  "Barra di navigazione": "Barre de navigation",
  "Barra di ricerca con risultati": "Barre de recherche avec résultats",
  "Barra inferiore con pulsante flottante":
    "Barre inférieure avec bouton flottant",
  "Barra stretta": "Barre étroite",
  "Board minima": "Tableau minimal",
  "Bolla del conteggio interattiva": "Bulle du compteur interactive",
  "Campo con prefisso e supporto": "Champ avec préfixe et texte d'aide",
  "Campo con suggerimenti": "Champ avec suggestions",
  "Campo in errore": "Champ en erreur",
  "Campo multiriga": "Champ multiligne",
  "Carosello di schede": "Carrousel de cartes",
  "Casella che governa un elenco": "Case qui pilote une liste",
  "Casella con testo e supporto": "Case avec texte et aide",
  "Con appearance contained e layout inline la ricerca sta dentro una barra e non occupa tutta la larghezza: la variante divided la stacca con una linea dal contenuto che segue.":
    "Avec appearance contained et layout inline, la recherche tient dans une barre et n'occupe pas toute la largeur : la variante divided la sépare du contenu suivant par une ligne.",
  "Con interactive la bolla che nasconde i restanti diventa un comando: il clic arriva con avatar-group-select e il conteggio dice quante persone restano fuori.":
    "Avec interactive, la bulle qui masque les autres devient une commande : le clic arrive avec avatar-group-select et le compteur indique combien de personnes restent dehors.",
  "Con multiple il controllo tiene più segmenti accesi e restituisce values. È la forma giusta per i filtri rapidi, dove più criteri restano attivi insieme.":
    "Avec multiple, le contrôle garde plusieurs segments actifs et renvoie values. C'est la forme adaptée aux filtres rapides, où plusieurs critères restent actifs ensemble.",
  "Con range il cursore mostra due maniglie e riporta value e upperValue: è la forma giusta per un filtro fra due importi o due date.":
    "Avec range, le curseur montre deux poignées et renvoie value et upperValue : c'est la forme adaptée à un filtre entre deux montants ou deux dates.",
  "Con scrollable le schede in eccesso scorrono in orizzontale invece di comprimersi: è la forma per un numero variabile di schede, quando i nomi sono lunghi.":
    "Avec scrollable, les onglets en trop défilent horizontalement au lieu de se comprimer : c'est la forme pour un nombre variable d'onglets, quand les noms sont longs.",
  "Con search la sidebar mette sopra le voci il campo che le filtra; count mostra il contatore di una voce e collapsed riduce tutta la navigazione a icona, con il testo nel suggerimento.":
    "Avec search, la barre latérale place le champ de filtre au-dessus des entrées ; count affiche le compteur d'une entrée et collapsed réduit toute la navigation en icônes, avec le texte dans l'infobulle.",
  "Con selection-mode range il calendario prende due date e le riporta in value e end-value; lo slot end-label nomina il secondo campo e week-starts-on sceglie il primo giorno della settimana.":
    "Avec selection-mode range, le calendrier prend deux dates et les renvoie dans value et end-value ; le slot end-label nomme le second champ et week-starts-on choisit le premier jour de la semaine.",
  "Con toggle il pulsante mantiene lo stato premuto e lo riporta con selected, per i comandi che accendono qualcosa come il grassetto di un editor.":
    "Avec toggle, le bouton garde l'état enfoncé et le renvoie avec selected, pour les commandes qui activent quelque chose comme le gras d'un éditeur.",
  "Contenuto della scheda": "Contenu de la carte",
  "Contenuto di una voce": "Contenu d'une entrée",
  "Cursore singolo": "Curseur unique",
  "Dialogo a tutto schermo": "Dialogue plein écran",
  "Dialogo di conferma": "Dialogue de confirmation",
  "Elenco con icone e dettaglio": "Liste avec icônes et détail",
  "Elenco da un array": "Liste à partir d'un tableau",
  "Foglio dal basso": "Panneau inférieur",
  "Griglia di riquadri": "Grille de tuiles",
  "Gruppo di avatar": "Groupe d'avatars",
  "Gruppo di opzioni": "Groupe d'options",
  "I pulsanti di opzione si raggruppano per name: scegliere una voce toglie la scelta alle altre dello stesso gruppo, e il valore arriva con change.":
    "Les boutons radio se regroupent par name : choisir une entrée retire le choix aux autres du même groupe, et la valeur arrive avec change.",
  "I segmenti arrivano da items e la scelta da value: il controllo la applica da sé e la riporta con change. multiple ammette più segmenti e restituisce values.":
    "Les segments viennent de items et le choix de value : le contrôle l'applique seul et le rapporte avec change. multiple autorise plusieurs segments et renvoie values.",
  "Icona personalizzata e allineamento": "Icône personnalisée et alignement",
  "Il badge mostra value sopra l'elemento che lo contiene e comprime il numero oltre max in «999+». small toglie il testo e lascia il punto, per una segnalazione senza numero.":
    "Le badge affiche value au-dessus de l'élément qui le contient et abrège le nombre au-delà de max en « 999+ ». small retire le texte et garde le point, pour un signal sans nombre.",
  "Il campo prende dagli slot il prefisso, il suffisso e il testo di supporto, mentre il valore resta nell'input e arriva con input e change. variant filled o outlined cambia la forma del riquadro.":
    "Le champ prend dans les slots le préfixe, le suffixe et le texte d'aide, tandis que la valeur reste dans l'input et arrive avec input et change. variant filled ou outlined change la forme du cadre.",
  "Il carosello scorre gli elementi dello slot predefinito e mostra i comandi avanti e indietro: index dice quale è visibile e la scelta arriva con change. Lo scorrimento è a passi, con il tocco e la tastiera.":
    "Le carrousel fait défiler les éléments du slot par défaut et affiche les commandes avant et arrière : index dit lequel est visible et le choix arrive avec change. Le défilement se fait par étapes, au toucher et au clavier.",
  "Il cursore mostra il valore sull'etichetta e lo riporta con input durante il trascinamento e con change alla fine. min e max fissano l'intervallo, step la granularità.":
    "Le curseur affiche la valeur sur l'étiquette et la renvoie avec input pendant le glissement et avec change à la fin. min et max fixent l'intervalle, step la granularité.",
  "Il foglio entra dal bordo inferiore e porta con sé i comandi: drag-handle mostra la presa che lo trascina, heading il titolo, actions la riga finale. open e show() lo aprono.":
    "Le panneau entre par le bord inférieur et porte ses commandes : drag-handle affiche la poignée qui le fait glisser, heading le titre, actions la ligne finale. open et show() l'ouvrent.",
  "Il gruppo impila gli avatar che riceve e riassume i restanti in una bolla con il conteggio: max decide quanti mostrarne, total dice quanti sono in tutto quando non li passi tutti.":
    "Le groupe empile les avatars reçus et résume les autres dans une bulle avec compteur : max décide combien en montrer, total dit combien il y en a quand on ne les passe pas tous.",
  "Il gruppo unisce pulsanti adiacenti: variant connected toglie lo spazio e condivide i bordi, selection single trasforma il gruppo in una scelta unica e riporta il valore con change.":
    "Le groupe réunit des boutons adjacents : variant connected retire l'espace et partage les bordures, selection single transforme le groupe en choix unique et rapporte la valeur avec change.",
  "Il menu dei pulsanti flottanti apre le azioni secondarie dal pulsante principale: items dichiara le voci, open dice se è aperto e la scelta arriva con menu-select.":
    "Le menu des boutons flottants ouvre les actions secondaires depuis le bouton principal : items déclare les entrées, open dit s'il est ouvert et le choix arrive avec menu-select.",
  "Il pannello apre le voci in verticale e può stare in linea accanto al contenuto o sovrapposto alla pagina: placement start o end sceglie il lato, modal lo rende bloccante.":
    "Le panneau ouvre les entrées verticalement et peut se placer en ligne à côté du contenu ou par-dessus la page : placement start ou end choisit le côté, modal le rend bloquant.",
  "Il pannello entra dal lato indicato da placement e lascia visibile il contenuto: è la forma giusta per il dettaglio di una riga, con heading per il titolo e actions per i comandi in coda.":
    "Le panneau entre par le côté indiqué par placement et laisse le contenu visible : c'est la forme adéquate pour le détail d'une ligne, avec heading pour le titre et actions pour les commandes de fin.",
  "Il pulsante diviso tiene l'azione principale a sinistra e apre il menu dal comando a fianco: le voci arrivano da items e la scelta con menu-select, mentre il clic sull'azione principale arriva con click.":
    "Le bouton divisé garde l'action principale à gauche et ouvre le menu depuis la commande voisine : les entrées viennent de items et le choix avec menu-select, tandis que le clic sur l'action principale arrive avec click.",
  "Il pulsante flottante resta ancorato all'angolo del contenitore e mostra il solo simbolo: label è il nome accessibile e va sempre dichiarata. size regular resta tondo, extended aggiunge il testo.":
    "Le bouton flottant reste ancré au coin de son conteneur et n'affiche que le symbole : label est le nom accessible et reste obligatoire. size regular reste rond, extended ajoute le texte.",
  "Il selettore apre il calendario dal campo: il valore scelto arriva con change nel formato ISO, e locale decide lingua e nomi dei giorni. selection-mode range aggiunge la seconda data in end-value.":
    "Le sélecteur ouvre le calendrier depuis le champ : la valeur choisie arrive avec change au format ISO, et locale décide langue et noms des jours. selection-mode range ajoute la seconde date dans end-value.",
  "Il selettore apre il quadrante dell'ora dal campo: il valore scelto arriva con change, hour-cycle decide il formato a dodici o ventiquattro ore e lo slot title nomina il quadrante.":
    "Le sélecteur ouvre le cadran de l'heure depuis le champ : la valeur choisie arrive avec change, hour-cycle décide le format sur douze ou vingt-quatre heures et le slot title nomme le cadran.",
  "Il separatore non ha contenuto: divide due gruppi di elementi, con inset per staccarlo dai bordi e vertical per separare comandi affiancati.":
    "Le séparateur n'a pas de contenu : il divise deux groupes d'éléments, avec inset pour le détacher des bords et vertical pour séparer des commandes côte à côte.",
  "Il suggerimento si aggancia a un elemento con show(anchor) e si chiude da sé quando il puntatore esce o arriva Esc. label è il testo breve, supporting-text aggiunge la riga di dettaglio.":
    "L'infobulle s'accroche à un élément avec show(anchor) et se ferme seule quand le pointeur sort ou qu'Échap arrive. label est le texte court, supporting-text ajoute la ligne de détail.",
  "Impalcatura completa": "Coque complète",
  "Indicatore di caricamento": "Indicateur de chargement",
  "Interruttore": "Interrupteur",
  "Intervallo di date": "Plage de dates",
  "Intervallo fra due valori": "Intervalle entre deux valeurs",
  "L'elenco prende le righe dallo slot predefinito e le compone con icona, testo, supporto e coda; interactive abilita il clic e selection riporta la scelta con change.":
    "La liste prend les lignes dans le slot par défaut et les compose avec icône, texte, aide et contenu final ; interactive active le clic et selection rapporte le choix avec change.",
  "L'impalcatura mette insieme le superfici intorno al contenuto: la navigazione, la barra, quella inferiore e il pannello di supporto arrivano dagli slot e il contenuto principale è lo slot predefinito. Le aree che non ricevono nulla non occupano spazio.":
    "La coque assemble les surfaces autour du contenu : la navigation, la barre, la barre inférieure et le panneau d'aide viennent des slots et le contenu principal est le slot par défaut. Les zones sans contenu n'occupent pas d'espace.",
  "L'indicatore mostra l'attesa di un'operazione: label è il nome letto dai lettori di schermo e va sempre dichiarata. variant contained lo appoggia su una superficie quando copre un riquadro.":
    "L'indicateur montre l'attente d'une opération : label est le nom lu par les lecteurs d'écran et reste obligatoire. variant contained le pose sur une surface quand il couvre une tuile.",
  "L'interruttore cambia stato da sé e riporta il valore con change: è la forma giusta per una preferenza che ha effetto immediato, mentre la casella resta per una scelta da confermare.":
    "L'interrupteur change d'état seul et rapporte la valeur avec change : c'est la forme adaptée à une préférence à effet immédiat, tandis que la case reste pour un choix à confirmer.",
  "La barra dispone gli elementi che riceve nello slot predefinito: varianti diverse separano i comandi principali da quelli di servizio, e la barra porta a capo gli elementi in eccesso invece di comprimerli.":
    "La barre dispose les éléments reçus dans le slot par défaut : des variantes différentes séparent les commandes principales des commandes de service, et la barre renvoie à la ligne les éléments en trop au lieu de les comprimer.",
  "La barra inferiore tiene i comandi in linea e il pulsante flottante: lo slot predefinito riceve i comandi, leading e trailing gli elementi ai lati, fab il pulsante che si incastra nel taglio. dock porta il pulsante dentro la barra.":
    "La barre inférieure tient les commandes en ligne et le bouton flottant : le slot par défaut reçoit les commandes, leading et trailing les éléments latéraux, fab le bouton qui s'encastre dans l'encoche. dock amène le bouton dans la barre.",
  "La barra porta il titolo e i comandi: title riceve il testo principale, subtitle la riga sotto, gli slot leading e actions i comandi ai due lati. Lo slot predefinito sostituisce il titolo quando serve un'intestazione più ricca.":
    "La barre porte le titre et les commandes : title reçoit le texte principal, subtitle la ligne en dessous, les slots leading et actions les commandes latérales. Le slot par défaut remplace le titre quand un en-tête plus riche est nécessaire.",
  "La barra stretta mostra le icone delle destinazioni e, con expanded, anche i testi. Serve fra la barra inferiore e il pannello laterale, quando lo spazio è poco ma le sezioni restano molte.":
    "La barre étroite montre les icônes des destinations et, avec expanded, aussi les textes. Elle se place entre la barre inférieure et le panneau latéral, quand l'espace est réduit mais que les sections restent nombreuses.",
  "La casella prende dallo slot predefinito il testo dell'etichetta e cambia stato da sé, riportando checked con change. supporting-text aggiunge la riga di spiegazione, indeterminate mostra lo stato misto.":
    "La case prend le texte de l'étiquette dans le slot par défaut et change d'état seule, en rapportant checked avec change. supporting-text ajoute la ligne d'explication, indeterminate montre l'état mixte.",
  "La dashboard dispone i riquadri che riceve e non impone contenuti: ogni riquadro è un bolle-widget, e span decide quante colonne occupa mentre min-span fissa il minimo quando lo spazio si stringe.":
    "Le tableau de bord dispose les tuiles reçues et n'impose aucun contenu : chaque tuile est un bolle-widget, et span décide du nombre de colonnes tandis que min-span fixe le minimum quand l'espace se réduit.",
  "La forma estesa mostra icona e testo insieme: lo slot icon porta il simbolo, lo slot predefinito il testo. Resta il pulsante dell'azione principale della schermata.":
    "La forme étendue montre icône et texte ensemble : le slot icon porte le symbole, le slot par défaut le texte. Il reste le bouton de l'action principale de l'écran.",
  "La pastiglia prende dallo slot predefinito il testo e dagli altri un'icona o un avatar. selected la segna come scelta, removable aggiunge il comando che la toglie e riporta remove.":
    "La pastille prend son texte dans le slot par défaut et, dans les autres, une icône ou un avatar. selected la marque comme choisie, removable ajoute la commande qui la retire et rapporte remove.",
  "La ricerca è un campo di testo con il comando di pulizia già incluso: results riceve l'elenco che compare sotto la barra, che l'applicazione riempie con i risultati di suggest o search.":
    "La recherche est un champ de texte avec la commande d'effacement déjà incluse : results reçoit la liste qui apparaît sous la barre, que l'application remplit avec les résultats de suggest ou search.",
  "La scheda non si compone con uno slot: il componente chiama card per ogni scheda e riceve la scheda e la board. laneLabel dà un nome alle corsie, che altrimenti mostrano la chiave.":
    "La carte ne se compose pas avec un slot : le composant appelle card pour chaque carte et reçoit la carte et le tableau. laneLabel nomme les couloirs, qui affichent sinon la clé.",
  "La scheda prende dallo slot predefinito il contenuto, da media l'immagine di testa che occupa la larghezza e da actions la riga di comandi. href rende l'intera scheda un collegamento.":
    "La carte prend le contenu dans le slot par défaut, dans media l'image de tête qui occupe la largeur et dans actions la ligne de commandes. href transforme toute la carte en lien.",
  "La select avvolge un elemento select nativo: le opzioni restano nel markup e il valore arriva con change. Il menu che si apre è quello del componente, con la stessa forma dei campi di testo.":
    "La select enveloppe un élément select natif : les options restent dans le balisage et la valeur arrive avec change. Le menu qui s'ouvre est celui du composant, avec la même forme que les champs de texte.",
  "La variante decide la forma: filled per l'azione principale, tonal per la secondaria, outlined e text per le altre. Lo slot predefinito porta il testo, icon l'icona iniziale e trailing-icon quella finale.":
    "La variante décide la forme : filled pour l'action principale, tonal pour la secondaire, outlined et text pour les autres. Le slot par défaut porte le texte, icon l'icône initiale et trailing-icon la finale.",
  "Lo slot icon sostituisce il simbolo predefinito e align sposta il blocco a sinistra, utile quando lo stato vuoto riempie una colonna di contenuto.":
    "Le slot icon remplace le symbole par défaut et align déplace le bloc à gauche, utile quand l'état vide remplit une colonne de contenu.",
  "Lo slot icon sostituisce le iniziali: serve per un account generico o per un'immagine non disponibile. Lo slot badge sovrappone una segnalazione all'angolo.":
    "Le slot icon remplace les initiales : il sert à un compte générique ou à une image indisponible. Le slot badge superpose un signal au coin.",
  "Lo stato vuoto centra icona, titolo e testo; lo slot actions porta il comando che fa uscire dallo stato vuoto. tone error lo colora per un errore di caricamento.":
    "L'état vide centre une icône, un titre et un texte ; le slot actions porte la commande qui sort de l'état vide. tone error le colore pour une erreur de chargement.",
  "Menu di azioni": "Menu d'actions",
  "Messaggio con azione": "Message avec action",
  "Pager sui dati presenti": "Pagineur sur les lignes disponibles",
  "Pannello di navigazione": "Panneau de navigation",
  "Pannello di supporto": "Panneau d'aide",
  "Pannello laterale di dettaglio": "Panneau latéral de détail",
  "Passi di un percorso": "Étapes d'un parcours",
  "Pastiglia con icona e rimozione": "Pastille avec icône et retrait",
  "Percorso di navigazione": "Fil d'Ariane",
  "Pulsante a icona": "Bouton icône",
  "Pulsante che resta premuto": "Bouton qui reste enfoncé",
  "Pulsante con icona": "Bouton avec icône",
  "Pulsante flottante": "Bouton flottant",
  "Pulsante flottante esteso": "Bouton flottant étendu",
  "Pulsanti collegati": "Boutons liés",
  "Regola di spostamento e limiti": "Règle de déplacement et limites",
  "Ricerca in linea nella barra": "Recherche en ligne dans la barre",
  "Ricerca, contatori e rail compatta": "Recherche, compteurs et rail compact",
  "Riquadri spostabili e ridimensionabili":
    "Tuiles déplaçables et redimensionnables",
  "Scelta della dimensione e forma compatta":
    "Choix de la taille et forme compacte",
  "Scelta di un orario": "Choix d'une heure",
  "Scelta di una data": "Choix d'une date",
  "Scelta fra segmenti": "Choix entre segments",
  "Scelta multipla": "Choix multiple",
  "Scheda con immagine e comandi": "Carte avec image et commandes",
  "Scheda orizzontale come collegamento": "Carte horizontale comme lien",
  "Schede che scorrono": "Onglets qui défilent",
  "Schede con pannelli": "Onglets avec panneaux",
  "Segnalazione su un elemento": "Signal sur un élément",
  "Select con opzioni native": "Select avec options natives",
  "Separatore fra gruppi": "Séparateur entre groupes",
  "Stato vuoto con un comando": "État vide avec une commande",
  "Suggerimento su un comando": "Infobulle sur une commande",
  "columns dichiara le colonne e cards le schede, ciascuna con la colonna in cui si trova. Con movable il lettore trascina la scheda o la sposta con Alt e le frecce: la board applica lo spostamento e lo riporta con card-move.":
    "columns déclare les colonnes et cards les cartes, chacune avec la colonne où elle se trouve. Avec movable, le lecteur glisse la carte ou la déplace avec Alt et les flèches : le tableau applique le déplacement et le rapporte avec card-move.",
  "error porta il contorno e il testo nel colore d'errore, e con supporting-text il messaggio spiega cosa correggere. La validazione resta all'applicazione, che decide quando alzare il segnale.":
    "error met le contour et le texte en couleur d'erreur, et avec supporting-text le message explique quoi corriger. La validation reste à l'application, qui décide quand lever le signal.",
  "indeterminate segnala una scelta parziale: è lo stato della casella di intestazione quando solo alcune righe sono scelte. Il valore lo decide l'applicazione dalle righe selezionate.":
    "indeterminate signale un choix partiel : c'est l'état de la case d'en-tête quand seules certaines lignes sont choisies. L'application déduit la valeur des lignes sélectionnées.",
  "items dichiara le destinazioni con icona e testo, value dice quale è attiva: il componente applica la scelta da sé e la riporta con change. Oltre cinque destinazioni conviene passare alla barra laterale.":
    "items déclare les destinations avec icône et texte, value dit laquelle est active : le composant applique le choix seul et le rapporte avec change. Au-delà de cinq destinations, mieux vaut passer à la barre latérale.",
  "items dichiara le righe senza scrivere markup: ogni voce porta testo, supporto, icona, contatore e figli per il sottoelenco. itemRenderer sostituisce l'intera riga quando serve un contenuto tuo.":
    "items déclare les lignes sans écrire de balisage : chaque entrée porte texte, aide, icône, compteur et enfants pour la sous-liste. itemRenderer remplace la ligne entière quand un contenu propre est nécessaire.",
  "items dichiara le schede e value quella attiva: il componente applica la scelta da sé e la riporta con change. Ogni pannello dichiara con slot l'identificatore della scheda che lo apre.":
    "items déclare les onglets et value celui qui est actif : le composant applique le choix seul et le rapporte avec change. Chaque panneau nomme l'onglet qui l'ouvre via slot.",
  "items dichiara le voci del percorso: il componente mette il separatore fra una voce e l'altra e segna l'ultima come pagina corrente. separator sceglie il segno, max-items comprime le voci centrali dietro un comando.":
    "items déclare les entrées du chemin : le composant place le séparateur entre elles et marque la dernière comme page courante. separator choisit le signe, max-items comprime les entrées centrales derrière une commande.",
  "items dichiara le voci e i loro figli: il componente costruisce l'albero fino a tre livelli, apre il ramo della voce scelta e riporta il percorso con navigate. La voce corrente si imposta con current, il percorso delle voci separate da barra.":
    "items déclare les entrées et leurs enfants : le composant construit l'arbre jusqu'à trois niveaux, ouvre la branche de l'entrée choisie et rapporte le chemin avec navigate. L'entrée courante se règle avec current, le chemin des entrées séparées par une barre.",
  "label è obbligatoria perché è il nome letto dai lettori di schermo, dato che il pulsante mostra solo il simbolo. variant standard lascia l'icona senza sfondo, filled la appoggia su una superficie.":
    "label est obligatoire car c'est le nom lu par les lecteurs d'écran, le bouton n'affichant que le symbole. variant standard laisse l'icône sans fond, filled la pose sur une surface.",
  "movable, resizable e removable rendono il riquadro regolabile dal lettore: la maniglia in alto avvia lo spostamento, quella in basso a destra il ridimensionamento, e il menu offre la chiusura. La dashboard applica il risultato e lo riporta con tile-move, tile-resize e tile-remove.":
    "movable, resizable et removable permettent au lecteur d'ajuster la tuile : la poignée en haut démarre le déplacement, celle en bas à droite le redimensionnement, et le menu propose le retrait. Le tableau de bord applique le résultat et le rapporte avec tile-move, tile-resize et tile-remove.",
  "multiline trasforma il campo in un'area di testo e rows fissa l'altezza iniziale; gli slot restano quelli del campo, con il suffisso per un conteggio.":
    "multiline transforme le champ en zone de texte et rows fixe la hauteur initiale ; les slots restent ceux du champ, avec le suffixe pour un compteur.",
  "open apre il dialogo e modal lo rende bloccante: il fuoco resta dentro finché non si chiude, e la chiusura arriva con closed. heading riceve il titolo letto come intestazione, actions la riga dei comandi.":
    "open ouvre le dialogue et modal le rend bloquant : le focus reste à l'intérieur jusqu'à la fermeture, et la fermeture arrive avec closed. heading reçoit le titre lu comme en-tête, actions la ligne de commandes.",
  "options dichiara i nomi dei passi e value quello corrente: il componente segna i passi fatti, quello attivo e i restanti, e riporta la scelta con change.":
    "options déclare les noms des étapes et value celle en cours : le composant marque les étapes faites, celle active et les restantes, et rapporte le choix avec change.",
  "orientation horizontal mette immagine e testo affiancati, href rende la scheda un collegamento e tail dice da dove arriva: la coda punta al contenuto che la precede.":
    "orientation horizontal met image et texte côte à côte, href transforme la carte en lien et tail dit d'où elle vient : la queue pointe vers le contenu qui la précède.",
  "page-size accende il pager e total dice quante righe esistono: il componente si sposta da sé alla pagina richiesta e la riporta con page-change, così l'applicazione taglia la fetta di dati che mostra.":
    "page-size active le pagineur et total dit combien de lignes existent : le composant se déplace seul vers la page demandée et la rapporte avec page-change, ainsi l'application découpe les données affichées.",
  "pageSizes aggiunge il selettore delle righe per pagina: sceglierne una riporta la pagina a zero. form compact toglie l'elenco numerato e lascia intervallo e frecce, utile sotto una tabella.":
    "pageSizes ajoute le sélecteur de lignes par page : en choisir une ramène la page à zéro. form compact retire la liste numérotée et garde la plage et les flèches, utile sous une table.",
  "restrict decide dove può andare una scheda e restituisce il motivo del rifiuto, che arriva con card-move-blocked. wip sulla colonna è un limite consigliato: la board lo segnala senza impedire lo spostamento.":
    "restrict décide où une carte peut aller et renvoie le motif du refus, qui arrive avec card-move-blocked. wip sur la colonne est une limite conseillée : le tableau la signale sans empêcher le déplacement.",
  "scrolled segnala che il contenuto sotto ha iniziato a scorrere e collapsed comprime la barra: l'applicazione ascolta lo scorrimento e passa il valore, mentre la barra cambia altezza e ombra.":
    "scrolled indique que le contenu en dessous a commencé à défiler et collapsed comprime la barre : l'application écoute le défilement et passe la valeur, tandis que la barre change de hauteur et d'ombre.",
  "show() apre il messaggio e duration lo chiude da solo: lo slot message porta il testo, action l'azione che lo accompagna e dismiss il comando di chiusura. message resta la scorciatoia per il solo testo.":
    "show() ouvre le message et duration le ferme seul : le slot message porte le texte, action l'action qui l'accompagne et dismiss la commande de fermeture. message reste le raccourci pour le texte seul.",
  "show(anchor) apre il menu sotto l'elemento che lo richiama e la scelta arriva con menu-select. items dichiara le voci, con icona, scorciatoia, disabled e figli per il sotto-menu.":
    "show(anchor) ouvre le menu sous l'élément qui l'appelle et le choix arrive avec menu-select. items déclare les entrées, avec icône, raccourci, disabled et enfants pour le sous-menu.",
  "src mostra l'immagine e, quando manca o non si carica, il componente torna alle iniziali ricavate da name. initials le fissa a mano, status aggiunge il punto di presenza e size cambia la misura.":
    "src affiche l'image et, quand elle manque ou ne se charge pas, le composant revient aux initiales tirées de name. initials les fixe à la main, status ajoute le point de présence et size change la taille.",
  "suggestions dichiara i suggerimenti e il componente li filtra mentre si scrive, riportandoli con suggest; scegliere una voce riempie il campo ed emette change. suggestion-delay regola l'attesa prima di chiedere i dati.":
    "suggestions déclare les suggestions et le composant les filtre pendant la saisie, en les rapportant avec suggest ; choisir une entrée remplit le champ et émet change. suggestion-delay règle l'attente avant de demander les données.",
  "supporting-mode decide dove vive il contenuto dello slot supporting: inline accanto al contenuto, modal sopra la pagina, sheet in un foglio laterale. Il componente sceglie la forma adatta alla larghezza e riporta il cambio con form-change.":
    "supporting-mode décide où vit le contenu du slot supporting : inline à côté du contenu, modal par-dessus la page, sheet dans un panneau latéral. Le composant choisit la forme adaptée à la largeur et rapporte le changement avec form-change.",
  "value dice quanto è stato fatto rispetto a max, label è il nome letto dai lettori di schermo. variant circular passa all'anello, indeterminate segnala un'attesa senza valore.":
    "value dit ce qui est fait par rapport à max, label est le nom lu par les lecteurs d'écran. variant circular passe à l'anneau, indeterminate signale une attente sans valeur.",
  "variant fullscreen occupa la finestra e serve per un compito lungo, come un editor: la superficie perde gli angoli e i comandi restano in fondo.":
    "variant fullscreen occupe la fenêtre et sert à une tâche longue, comme un éditeur : la surface perd les coins et les commandes restent en bas.",
  " · fissato": " · fixe",
  ", fissato": ", fixe",
  "Colori fissati": "Couleurs fixées",
  "Fissa questo colore": "Fixer cette couleur",
  "La generazione lo mantiene e ricalcola gli altri ruoli attorno a lui.":
    "La génération la conserve et recalcule les autres rôles autour d’elle.",
  "Nessun colore fissato: la generazione segue il seme. Apri un colore della tavolozza e attiva «Fissa questo colore» per imporlo e lasciare che il resto si adatti.":
    "Aucune couleur fixée : la génération suit la graine. Ouvrez une couleur de la palette et activez « Fixer cette couleur » pour l’imposer et laisser le reste s’adapter.",
  "Sblocca tutti": "Tout défixer",
  "Sblocca {role}": "Défixer {role}",
  "Testo su {role}": "Texte sur {role}",
  "I colori Bolle (Accent e On accent) non derivano dal seme: la generazione li lascia come sono e adatta solo il testo sopra l'accento. Film, ombre e scrollbar si ricalcolano da soli dal primario e dalla superficie.":
    "Les couleurs Bolle (Accent et Sur accent) ne dérivent pas de la graine : la génération les laisse telles quelles et n’adapte que le texte sur l’accent. Film, ombres et barres de défilement se recalculent seuls à partir du primaire et de la surface.",
  "{role} su Surface": "{role} sur la surface",
  "Commessa salvata": "Commande enregistrée",
  "Le modifiche sono state registrate e condivise con il team.":
    "Les modifications sont enregistrées et partagées avec l’équipe.",
  "Scadenza vicina": "Échéance proche",
  "Restano due giorni per consegnare il collaudo.":
    "Il reste deux jours pour livrer le contrôle.",
  "Sincronizzazione non riuscita": "Échec de la synchronisation",
  "La connessione è caduta: i dati restano in coda.":
    "La connexion a été interrompue : les données restent en file d’attente.",
  "Stati": "États",
  "Azione critica": "Action critique",
  "In attesa": "En attente",
  "Approvata": "Approuvée",
  "Apri il cruscotto": "Ouvrir le tableau de bord",
  "Archiviate": "Archivées",
  "Avvia il tour": "Lancer la visite",
  "Cerca commesse": "Rechercher des commandes",
  "Cerca una commessa": "Trouver une commande",
  "Ci siamo": "C’est terminé",
  "Configurazione JSON": "Configuration JSON",
  "Filtra per stato": "Filtrer par état",
  "I passi sono dati, non codice: parseTourConfig legge il JSON e shouldStartTour confronta la versione con quella già vista. Il componente non fa rete e non ricorda nulla: si apre quando l'applicazione chiama start(), e dice con finish se il lettore ha visto tutto.":
    "Les étapes sont des données, pas du code : parseTourConfig lit le JSON et shouldStartTour compare la version avec celle déjà vue. Le composant ne fait aucun appel réseau et ne mémorise rien : il s’ouvre quand l’application appelle start() et indique avec finish si le lecteur a tout vu.",
  "Il numero o il nome del cliente bastano: la ricerca parte da qui.":
    "Le numéro de la commande ou le nom du client suffit : la recherche part d’ici.",
  "Il tour non ha slot: il contenuto dei passi è un array, e l'applicazione lo ricava dal JSON con parseTourConfig. Espone i CSS part di ogni pezzo della scheda, dalla layer al singolo testo, per adattarlo alla propria pelle.":
    "La visite n’a pas de slots : le contenu des étapes est un tableau et l’application le construit à partir du JSON avec parseTourConfig. Elle expose les CSS part de chaque élément de la carte, de la couche au simple texte, pour l’adapter à sa propre peau.",
  "In corso e archiviate sono due filtri che si sommano.":
    "En cours et archivées sont deux filtres qui s’additionnent.",
  "Livello fisso che blocca la pagina e contiene il riflettore e la scheda.":
    "Couche fixe qui bloque la page et contient le projecteur et la carte.",
  "Margine dal bersaglio": "Marge par rapport à la cible",
  "Numero o cliente": "Numéro ou client",
  "Posizione": "Position",
  "Questo passo non ha un bersaglio: la scheda resta al centro.":
    "Cette étape n’a pas de cible : la carte reste au centre.",
  "Riga con il numero del passo e il totale.":
    "Ligne avec le numéro de l’étape et le total.",
  "Riga dei comandi: salta, indietro, avanti o fine.":
    "Ligne de commandes : ignorer, retour, suivant ou terminer.",
  "Riquadro che tiene in luce l'elemento del passo e scurisce il resto.":
    "Cadre qui garde l’élément de l’étape en lumière et assombrit le reste.",
  "Scheda del passo, ancorata al bersaglio o centrata.":
    "Carte de l’étape, ancrée à la cible ou centrée.",
  "Testo del passo.": "Texte de l’étape.",
  "Titolo del passo, usato anche come nome accessibile della scheda.":
    "Titre de l’étape, utilisé aussi comme nom accessible de la carte.",
  "Tour di primo accesso: oscura la pagina, lascia in luce un elemento e accompagna il lettore nei passi descritti da una configurazione JSON con versione.":
    "Visite de première connexion : assombrit la page, laisse un élément en lumière et guide le lecteur dans les étapes décrites par une configuration JSON versionnée.",
  "{count} passi. Modifica il JSON e riavvia il tour.":
    "{count} étapes. Modifiez le JSON et relancez la visite.",
  "Filtra le commesse": "Filtrer les commandes",
  "La tabella": "Le tableau",
  "Pilotare il tour e leggere i passi": "Piloter la visite et lire les étapes",
  "Tour dal JSON di configurazione": "Visite depuis la configuration JSON",
  "Un passo senza bersaglio e l'azione finale":
    "Une étape sans cible et l’action finale",
  "I passi non stanno nel codice: parseTourConfig legge il JSON con la versione e shouldStartTour la confronta con quella che l'applicazione ha già mostrato. Il componente non fa rete e non ricorda nulla, quindi è l'applicazione a decidere quando partire e a salvare la versione al finish.":
    "Les étapes ne sont pas dans le code : parseTourConfig lit le JSON avec sa version et shouldStartTour la compare à celle déjà montrée par l’application. Le composant ne fait aucun appel réseau et ne mémorise rien : c’est l’application qui décide du démarrage et enregistre la version au finish.",
  "Un passo senza target non ha un elemento da mettere in luce: il riflettore copre tutta la pagina e la scheda resta al centro. actionLabel cambia il testo del bottone dell'ultimo passo, mentre placement decide dove si appoggia la scheda rispetto al bersaglio, con auto che sceglie il primo lato che ci sta.":
    "Une étape sans cible n’a aucun élément à mettre en lumière : le projecteur couvre toute la page et la carte reste au centre. actionLabel change le libellé du dernier bouton, tandis que placement décide du côté de la carte par rapport à la cible, auto choisissant le premier côté qui tient.",
  "start accetta l'indice da cui partire, next e back muovono il passo e finish chiude dichiarando se il lettore è arrivato in fondo. step-change porta indice, passo e totale, così l'applicazione può annotare dove si è fermato, e refresh rilegge il bersaglio dopo un cambio di pagina.":
    "start accepte l’index de départ, next et back déplacent l’étape et finish ferme en déclarant si le lecteur est allé au bout. step-change porte l’index, l’étape et le total, pour que l’application note où le lecteur s’est arrêté, et refresh relit la cible après un changement de page.",
};

export default messages;
