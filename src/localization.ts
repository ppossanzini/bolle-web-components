export const pickerMessages = {
  en: {
    required: "Select an option.",
    open: "Open picker",
    cancel: "Cancel",
    confirm: "OK",
    previous: "Previous month",
    next: "Next month",
    month: "Month",
    year: "Year",
    start: "Start date",
    end: "End date",
    hour: "Hour",
    minute: "Minute",
    period: "AM or PM",
    input: "Use keyboard input",
    dial: "Use dial",
    hours: "hours",
    minutes: "minutes",
  },
  it: {
    required: "Seleziona un’opzione.",
    open: "Apri selettore",
    cancel: "Annulla",
    confirm: "OK",
    previous: "Mese precedente",
    next: "Mese successivo",
    month: "Mese",
    year: "Anno",
    start: "Data iniziale",
    end: "Data finale",
    hour: "Ora",
    minute: "Minuti",
    period: "AM o PM",
    input: "Usa tastiera",
    dial: "Usa quadrante",
    hours: "ore",
    minutes: "minuti",
  },
  fr: {
    required: "Sélectionnez une option.",
    open: "Ouvrir le sélecteur",
    cancel: "Annuler",
    confirm: "OK",
    previous: "Mois précédent",
    next: "Mois suivant",
    month: "Mois",
    year: "Année",
    start: "Date de début",
    end: "Date de fin",
    hour: "Heure",
    minute: "Minutes",
    period: "AM ou PM",
    input: "Saisir au clavier",
    dial: "Utiliser le cadran",
    hours: "heures",
    minutes: "minutes",
  },
  zh: {
    required: "请选择一个选项。",
    open: "打开选择器",
    cancel: "取消",
    confirm: "确定",
    previous: "上个月",
    next: "下个月",
    month: "月",
    year: "年",
    start: "开始日期",
    end: "结束日期",
    hour: "时",
    minute: "分",
    period: "上午或下午",
    input: "使用键盘输入",
    dial: "使用表盘",
    hours: "小时",
    minutes: "分钟",
  },
} as const;

export type SupportedLocale = "en" | "it" | "fr" | "zh";

/** Language subtag of a BCP 47 tag mapped to a bundled message set; English otherwise. */
export function supportedLocale(locale: string): SupportedLocale {
  const language = (locale || "").toLowerCase().split(/[-_]/)[0];
  return language === "it" || language === "fr" || language === "zh"
    ? language
    : "en";
}
export type PickerLabels = { [K in keyof typeof pickerMessages.en]: string };
export function messages(
  locale: string,
  overrides: Partial<PickerLabels>,
): PickerLabels {
  return {
    ...pickerMessages[supportedLocale(locale)],
    ...overrides,
  };
}

/** Etichette dei comandi di espansione degli elenchi annidati. */
export const listMessages = {
  en: { expand: "Expand", collapse: "Collapse" },
  it: { expand: "Espandi", collapse: "Comprimi" },
  fr: { expand: "Développer", collapse: "Réduire" },
  zh: { expand: "展开", collapse: "收起" },
} as const;

export type ListLabels = { [K in keyof typeof listMessages.en]: string };

export function listLabels(
  locale: string,
  overrides: Partial<ListLabels> = {},
): ListLabels {
  return {
    ...listMessages[supportedLocale(locale)],
    ...overrides,
  };
}

/** Built-in texts of the menu filter. `{query}` is filled at runtime. */
export const menuMessages = {
  en: {
    filter: "Filter the menu",
    noResults: "No menu item contains “{query}”.",
  },
  it: {
    filter: "Filtra il menu",
    noResults: "Nessuna voce del menu contiene «{query}».",
  },
  fr: {
    filter: "Filtrer le menu",
    noResults: "Aucun élément du menu ne contient « {query} ».",
  },
  zh: {
    filter: "筛选菜单",
    noResults: "没有包含“{query}”的菜单项。",
  },
} as const;

export type MenuLabels = { [K in keyof typeof menuMessages.en]: string };

export function menuLabels(
  locale = "",
  overrides: Partial<MenuLabels> = {},
): MenuLabels {
  return {
    ...menuMessages[supportedLocale(locale || document.documentElement.lang)],
    ...overrides,
  };
}

/** Built-in labels of controls the caller cannot name: tab scroll buttons, tooltip dismiss. */
export const controlMessages = {
  en: {
    previousTabs: "Previous tabs",
    nextTabs: "Next tabs",
    dismiss: "Dismiss",
  },
  it: {
    previousTabs: "Schede precedenti",
    nextTabs: "Schede successive",
    dismiss: "Chiudi",
  },
  fr: {
    previousTabs: "Onglets précédents",
    nextTabs: "Onglets suivants",
    dismiss: "Fermer",
  },
  zh: { previousTabs: "上一组标签", nextTabs: "下一组标签", dismiss: "关闭" },
} as const;

export type ControlLabels = {
  [K in keyof typeof controlMessages.en]: string;
};

export function controlLabels(
  locale: string,
  overrides: Partial<ControlLabels> = {},
): ControlLabels {
  return {
    ...controlMessages[
      supportedLocale(locale || document.documentElement.lang)
    ],
    ...overrides,
  };
}

/** Built-in texts of the sidebar. `{count}` and `{query}` are filled at runtime. */
export const sidebarMessages = {
  en: {
    filter: "Filter the menu",
    found: "{count} items found",
    empty: "No menu item contains “{query}”.",
    clear: "Clear the filter",
    collapse: "Collapse the menu",
    expand: "Expand the menu",
    resize: "Resize the menu",
  },
  it: {
    filter: "Filtra il menu",
    found: "{count} voci trovate",
    empty: "Nessuna voce del menu contiene «{query}».",
    clear: "Cancella il filtro",
    collapse: "Riduci il menu",
    expand: "Espandi il menu",
    resize: "Ridimensiona il menu",
  },
  fr: {
    filter: "Filtrer le menu",
    found: "{count} éléments trouvés",
    empty: "Aucun élément du menu ne contient « {query} ».",
    clear: "Effacer le filtre",
    collapse: "Réduire le menu",
    expand: "Développer le menu",
    resize: "Redimensionner le menu",
  },
  zh: {
    filter: "筛选菜单",
    found: "找到 {count} 项",
    empty: "没有菜单项包含“{query}”。",
    clear: "清除筛选",
    collapse: "收起菜单",
    expand: "展开菜单",
    resize: "调整菜单宽度",
  },
} as const;

/** Built-in texts of the data table. `{count}`, `{from}`, `{to}`, `{total}` and
 * `{column}` are filled at runtime. */
export const dataTableMessages = {
  en: {
    loading: "Loading the rows",
    updating: "Updating the rows",
    empty: "No rows to show",
    error: "The rows could not be loaded",
    retry: "Try again",
    selectRow: "Select row {key}",
    selectPage: "Select every row on this page",
    selected: "{count} selected",
    column: "Column {column}",
    sortAscending: "Sort ascending",
    sortDescending: "Sort descending",
    sortNone: "Remove the sorting",
    sortHint:
      "Enter sorts the column, Shift and click adds an ordering, Alt and arrow keys move the column.",
    groupBy: "Group by {column}",
    ungroup: "Stop grouping",
    pin: "Pin to the start",
    unpin: "Unpin the column",
    moveStart: "Move to the start",
    moveEnd: "Move to the end",
    hideColumn: "Hide the column",
    showColumn: "Show the column",
    resizeColumn: "Column width {column}",
    rowActions: "Actions for {row}",
    expandRow: "Show the details of {row}",
    collapseRow: "Hide the details of {row}",
    details: "Details",
    rows: "Rows",
    perPage: "Rows per page",
    range: "{from}–{to} of {total}",
    pageOf: "Page {page} of {pages}",
    firstPage: "First page",
    previousPage: "Previous page",
    nextPage: "Next page",
    lastPage: "Last page",
    columnPanel: "Columns",
    moved: "{column} moved to position {index} of {count}.",
    moveCancelled: "Move cancelled for {column}.",
    moveBlocked: "{column} cannot move further.",
    pinned: "{column} is pinned to the start.",
    unpinned: "{column} is no longer pinned.",
    hidden: "{column} is hidden.",
    shown: "{column} is shown.",
  },
  it: {
    loading: "Caricamento delle righe",
    updating: "Aggiornamento delle righe",
    empty: "Nessuna riga da mostrare",
    error: "Non è stato possibile caricare le righe",
    retry: "Riprova",
    selectRow: "Seleziona la riga {key}",
    selectPage: "Seleziona tutte le righe della pagina",
    selected: "{count} selezionate",
    column: "Colonna {column}",
    sortAscending: "Ordina crescente",
    sortDescending: "Ordina decrescente",
    sortNone: "Togli ordinamento",
    sortHint:
      "Invio ordina la colonna, Maiuscole e clic aggiunge un ordinamento, Alt e frecce spostano la colonna.",
    groupBy: "Raggruppa per {column}",
    ungroup: "Non raggruppare",
    pin: "Fissa all'inizio",
    unpin: "Sblocca la colonna",
    moveStart: "Sposta all'inizio",
    moveEnd: "Sposta alla fine",
    hideColumn: "Nascondi la colonna",
    showColumn: "Mostra la colonna",
    resizeColumn: "Larghezza colonna {column}",
    rowActions: "Azioni per {row}",
    expandRow: "Mostra il dettaglio di {row}",
    collapseRow: "Chiudi il dettaglio di {row}",
    details: "Dettaglio",
    rows: "Righe",
    perPage: "Righe per pagina",
    range: "{from}–{to} di {total}",
    pageOf: "Pagina {page} di {pages}",
    firstPage: "Prima pagina",
    previousPage: "Pagina precedente",
    nextPage: "Pagina successiva",
    lastPage: "Ultima pagina",
    columnPanel: "Colonne",
    moved: "{column} spostata in posizione {index} di {count}.",
    moveCancelled: "Spostamento annullato per {column}.",
    moveBlocked: "{column} non può essere spostata oltre.",
    pinned: "{column} è fissata all'inizio.",
    unpinned: "{column} non è più fissata.",
    hidden: "{column} è nascosta.",
    shown: "{column} è visibile.",
  },
  fr: {
    loading: "Chargement des lignes",
    updating: "Mise à jour des lignes",
    empty: "Aucune ligne à afficher",
    error: "Les lignes n'ont pas pu être chargées",
    retry: "Réessayer",
    selectRow: "Sélectionner la ligne {key}",
    selectPage: "Sélectionner toutes les lignes de la page",
    selected: "{count} sélectionnées",
    column: "Colonne {column}",
    sortAscending: "Trier par ordre croissant",
    sortDescending: "Trier par ordre décroissant",
    sortNone: "Retirer le tri",
    sortHint:
      "Entrée trie la colonne, Maj et clic ajoute un tri, Alt et les flèches déplacent la colonne.",
    groupBy: "Grouper par {column}",
    ungroup: "Ne plus grouper",
    pin: "Fixer au début",
    unpin: "Détacher la colonne",
    moveStart: "Déplacer au début",
    moveEnd: "Déplacer à la fin",
    hideColumn: "Masquer la colonne",
    showColumn: "Afficher la colonne",
    resizeColumn: "Largeur de la colonne {column}",
    rowActions: "Actions pour {row}",
    expandRow: "Afficher le détail de {row}",
    collapseRow: "Fermer le détail de {row}",
    details: "Détail",
    rows: "Lignes",
    perPage: "Lignes par page",
    range: "{from}–{to} sur {total}",
    pageOf: "Page {page} sur {pages}",
    firstPage: "Première page",
    previousPage: "Page précédente",
    nextPage: "Page suivante",
    lastPage: "Dernière page",
    columnPanel: "Colonnes",
    moved: "{column} déplacée en position {index} sur {count}.",
    moveCancelled: "Déplacement annulé pour {column}.",
    moveBlocked: "{column} ne peut pas aller plus loin.",
    pinned: "{column} est fixée au début.",
    unpinned: "{column} n'est plus fixée.",
    hidden: "{column} est masquée.",
    shown: "{column} est visible.",
  },
  zh: {
    loading: "正在加载行",
    updating: "正在更新行",
    empty: "没有可显示的行",
    error: "无法加载行",
    retry: "重试",
    selectRow: "选择第 {key} 行",
    selectPage: "选择本页所有行",
    selected: "已选择 {count} 项",
    column: "列 {column}",
    sortAscending: "升序排列",
    sortDescending: "降序排列",
    sortNone: "取消排序",
    sortHint: "回车排序列，Shift 加点击追加排序，Alt 加方向键移动列。",
    groupBy: "按{column}分组",
    ungroup: "取消分组",
    pin: "固定在开头",
    unpin: "取消固定",
    moveStart: "移到开头",
    moveEnd: "移到最后",
    hideColumn: "隐藏该列",
    showColumn: "显示该列",
    resizeColumn: "列宽 {column}",
    rowActions: "{row} 的操作",
    expandRow: "显示 {row} 的详情",
    collapseRow: "收起 {row} 的详情",
    details: "详情",
    rows: "行",
    perPage: "每页行数",
    range: "第 {from}–{to} 行，共 {total} 行",
    pageOf: "第 {page} 页，共 {pages} 页",
    firstPage: "第一页",
    previousPage: "上一页",
    nextPage: "下一页",
    lastPage: "最后一页",
    columnPanel: "列",
    moved: "{column} 已移至第 {index} 位，共 {count} 列。",
    moveCancelled: "已取消移动 {column}。",
    moveBlocked: "{column} 无法继续移动。",
    pinned: "{column} 已固定在开头。",
    unpinned: "{column} 已取消固定。",
    hidden: "{column} 已隐藏。",
    shown: "{column} 已显示。",
  },
} as const;

export type DataTableLabels = {
  [K in keyof typeof dataTableMessages.en]: string;
};

export function dataTableLabels(
  locale: string,
  overrides: Partial<DataTableLabels> = {},
): DataTableLabels {
  return {
    ...dataTableMessages[
      supportedLocale(locale || document.documentElement.lang)
    ],
    ...overrides,
  };
}

/** Built-in texts of the application shell and the dashboard. */
export const shellMessages = {
  en: {
    navigation: "Main navigation",
    supporting: "Supporting pane",
    closeSupporting: "Close the pane",
    status: "Application status",
    dashboard: "Dashboard",
    moveWidget: "Move {title}",
    resizeWidget: "Width of {title}",
    widgetMenu: "Options for {title}",
    columns: "{count} columns of 12",
    hideWidget: "Hide the tile",
    moveBefore: "Move before",
    moveAfter: "Move after",
    width: "Width",
    moved: "{title} moved to position {index} of {count}.",
    resized: "{title} is {count} columns wide.",
    cancelled: "Move cancelled.",
    hidden: "{title} is hidden.",
    dropAt: "Position {index} of {count}",
    noTarget: "Drop the tile on the dashboard.",
  },
  it: {
    navigation: "Navigazione principale",
    supporting: "Pannello secondario",
    closeSupporting: "Chiudi il pannello",
    status: "Stato dell'applicazione",
    dashboard: "Cruscotto",
    moveWidget: "Sposta {title}",
    resizeWidget: "Larghezza di {title}",
    widgetMenu: "Opzioni del riquadro {title}",
    columns: "{count} colonne su 12",
    hideWidget: "Nascondi il riquadro",
    moveBefore: "Sposta prima",
    moveAfter: "Sposta dopo",
    width: "Larghezza",
    moved: "{title} in posizione {index} di {count}.",
    resized: "{title} largo {count} colonne su 12.",
    cancelled: "Spostamento annullato.",
    hidden: "{title} nascosto.",
    dropAt: "Posizione {index} di {count}",
    noTarget: "Rilascia il riquadro sulla dashboard.",
  },
  fr: {
    navigation: "Navigation principale",
    supporting: "Panneau secondaire",
    closeSupporting: "Fermer le panneau",
    status: "État de l'application",
    dashboard: "Tableau de bord",
    moveWidget: "Déplacer {title}",
    resizeWidget: "Largeur de {title}",
    widgetMenu: "Options de la tuile {title}",
    columns: "{count} colonnes sur 12",
    hideWidget: "Masquer la tuile",
    moveBefore: "Déplacer avant",
    moveAfter: "Déplacer après",
    width: "Largeur",
    moved: "{title} en position {index} sur {count}.",
    resized: "{title} sur {count} colonnes.",
    cancelled: "Déplacement annulé.",
    hidden: "{title} masquée.",
    dropAt: "Position {index} sur {count}",
    noTarget: "Déposez la tuile sur le tableau de bord.",
  },
  zh: {
    navigation: "主导航",
    supporting: "辅助面板",
    closeSupporting: "关闭面板",
    status: "应用状态",
    dashboard: "仪表板",
    moveWidget: "移动{title}",
    resizeWidget: "{title}的宽度",
    widgetMenu: "{title}的选项",
    columns: "共 12 列中的 {count} 列",
    hideWidget: "隐藏该块",
    moveBefore: "前移",
    moveAfter: "后移",
    width: "宽度",
    moved: "{title}已移至第 {index} 位，共 {count} 块。",
    resized: "{title}宽 {count} 列。",
    cancelled: "已取消移动。",
    hidden: "{title}已隐藏。",
    dropAt: "第 {index} 位，共 {count} 块",
    noTarget: "请将块放到仪表板上。",
  },
} as const;

export type ShellLabels = { [K in keyof typeof shellMessages.en]: string };

export function shellLabels(
  locale: string,
  overrides: Partial<ShellLabels> = {},
): ShellLabels {
  return {
    ...shellMessages[supportedLocale(locale || document.documentElement.lang)],
    ...overrides,
  };
}

/** Built-in texts of the pagination. */
export const paginationMessages = {
  en: {
    label: "Pages",
    range: "{from}–{to} of {total}",
    pageOf: "Page {page} of {pages}",
    first: "First page",
    previous: "Previous page",
    next: "Next page",
    last: "Last page",
    perPage: "Rows per page",
    goTo: "Go to page {page}",
  },
  it: {
    label: "Pagine",
    range: "{from}–{to} di {total}",
    pageOf: "Pagina {page} di {pages}",
    first: "Prima pagina",
    previous: "Pagina precedente",
    next: "Pagina successiva",
    last: "Ultima pagina",
    perPage: "Righe per pagina",
    goTo: "Vai alla pagina {page}",
  },
  fr: {
    label: "Pages",
    range: "{from}–{to} sur {total}",
    pageOf: "Page {page} sur {pages}",
    first: "Première page",
    previous: "Page précédente",
    next: "Page suivante",
    last: "Dernière page",
    perPage: "Lignes par page",
    goTo: "Aller à la page {page}",
  },
  zh: {
    label: "页面",
    range: "{from}–{to}，共 {total} 条",
    pageOf: "第 {page} 页，共 {pages} 页",
    first: "第一页",
    previous: "上一页",
    next: "下一页",
    last: "最后一页",
    perPage: "每页行数",
    goTo: "前往第 {page} 页",
  },
} as const;

export type PaginationLabels = {
  [K in keyof typeof paginationMessages.en]: string;
};

export function paginationLabels(
  locale: string,
  overrides: Partial<PaginationLabels> = {},
): PaginationLabels {
  return {
    ...paginationMessages[
      supportedLocale(locale || document.documentElement.lang)
    ],
    ...overrides,
  };
}

/** Built-in texts of the breadcrumb and the avatar group. */
export const navigationTrailMessages = {
  en: {
    label: "Breadcrumb",
    expand: "Show the full path, {count} levels",
    group: "People",
    more: "{count} more",
  },
  it: {
    label: "Percorso",
    expand: "Mostra il percorso completo, {count} livelli",
    group: "Persone",
    more: "altri {count}",
  },
  fr: {
    label: "Fil d'Ariane",
    expand: "Afficher le chemin complet, {count} niveaux",
    group: "Personnes",
    more: "{count} de plus",
  },
  zh: {
    label: "面包屑",
    expand: "显示完整路径，共 {count} 级",
    group: "人员",
    more: "另有 {count} 位",
  },
} as const;

export type BreadcrumbLabels = {
  label: string;
  expand: string;
};

export type AvatarGroupLabels = {
  group: string;
  more: string;
};

export function breadcrumbLabels(
  locale: string,
  overrides: Partial<BreadcrumbLabels> = {},
): BreadcrumbLabels {
  const messages =
    navigationTrailMessages[
      supportedLocale(locale || document.documentElement.lang)
    ];
  return {
    label: messages.label,
    expand: messages.expand,
    ...overrides,
  };
}

export function avatarGroupLabels(
  locale: string,
  overrides: Partial<AvatarGroupLabels> = {},
): AvatarGroupLabels {
  const messages =
    navigationTrailMessages[
      supportedLocale(locale || document.documentElement.lang)
    ];
  return {
    group: messages.group,
    more: messages.more,
    ...overrides,
  };
}

/** Built-in texts of the kanban board. */
export const kanbanMessages = {
  en: {
    boardMenu: "Board actions",
    moveCard: "Move {title}",
    cardMenu: "Actions for {title}",
    columnMenu: "Options for {label}",
    addCard: "Add a card to {label}",
    newCard: "New card in {label}",
    cardPlaceholder: "Card title",
    cancel: "Cancel",
    emptyColumn: "No cards in this column",
    wipLimit: "Advised limit {count}",
    wipOver: "{column} is over the advised limit ({count} of {limit}).",
    moved: "{title} moved to {column}, position {index}.",
    unknownColumn: "That column is not on the board.",
    edge: "There is no other column in that direction.",
    cancelled: "Move cancelled.",
    dropAt: "{column} · position {index}",
    expand: "Expand the column",
    collapse: "Collapse the column",
    expandColumn: "Expand {label}",
    collapsed: "{label} collapsed.",
    expanded: "{label} expanded.",
    added: "Card added to {column}.",
    loading: "Loading the board",
    empty: "No cards yet",
    error: "The board could not be loaded",
    retry: "Try again",
  },
  it: {
    boardMenu: "Azioni della board",
    moveCard: "Sposta {title}",
    cardMenu: "Azioni per {title}",
    columnMenu: "Opzioni per {label}",
    addCard: "Aggiungi una scheda in {label}",
    newCard: "Nuova scheda in {label}",
    cardPlaceholder: "Titolo della scheda",
    cancel: "Annulla",
    emptyColumn: "Nessuna scheda in questa colonna",
    wipLimit: "Limite consigliato {count}",
    wipOver: "{column} supera il limite consigliato ({count} su {limit}).",
    moved: "{title} in {column}, posizione {index}.",
    unknownColumn: "Quella colonna non è nella board.",
    edge: "Non c'è un'altra colonna in quella direzione.",
    cancelled: "Spostamento annullato.",
    dropAt: "{column} · posizione {index}",
    expand: "Espandi la colonna",
    collapse: "Comprimi la colonna",
    expandColumn: "Espandi {label}",
    collapsed: "{label} compressa.",
    expanded: "{label} espansa.",
    added: "Scheda aggiunta in {column}.",
    loading: "Caricamento della board",
    empty: "Non ci sono ancora schede",
    error: "Non riusciamo a caricare la board",
    retry: "Riprova",
  },
  fr: {
    boardMenu: "Actions du tableau",
    moveCard: "Déplacer {title}",
    cardMenu: "Actions pour {title}",
    columnMenu: "Options de {label}",
    addCard: "Ajouter une carte dans {label}",
    newCard: "Nouvelle carte dans {label}",
    cardPlaceholder: "Titre de la carte",
    cancel: "Annuler",
    emptyColumn: "Aucune carte dans cette colonne",
    wipLimit: "Limite conseillée {count}",
    wipOver: "{column} dépasse la limite conseillée ({count} sur {limit}).",
    moved: "{title} déplacée vers {column}, position {index}.",
    unknownColumn: "Cette colonne n'est pas dans le tableau.",
    edge: "Aucune autre colonne dans cette direction.",
    cancelled: "Déplacement annulé.",
    dropAt: "{column} · position {index}",
    expand: "Déplier la colonne",
    collapse: "Replier la colonne",
    expandColumn: "Déplier {label}",
    collapsed: "{label} repliée.",
    expanded: "{label} dépliée.",
    added: "Carte ajoutée dans {column}.",
    loading: "Chargement du tableau",
    empty: "Aucune carte pour le moment",
    error: "Le tableau ne peut pas être chargé",
    retry: "Réessayer",
  },
  zh: {
    boardMenu: "看板操作",
    moveCard: "移动{title}",
    cardMenu: "{title}的操作",
    columnMenu: "{label}的选项",
    addCard: "在{label}中添加卡片",
    newCard: "{label}中的新卡片",
    cardPlaceholder: "卡片标题",
    cancel: "取消",
    emptyColumn: "此列暂无卡片",
    wipLimit: "建议上限 {count}",
    wipOver: "{column}超过建议上限（{count}/{limit}）。",
    moved: "{title}已移至{column}第 {index} 位。",
    unknownColumn: "该列不在看板中。",
    edge: "该方向没有其他列。",
    cancelled: "已取消移动。",
    dropAt: "{column} · 第 {index} 位",
    expand: "展开该列",
    collapse: "折叠该列",
    expandColumn: "展开{label}",
    collapsed: "{label}已折叠。",
    expanded: "{label}已展开。",
    added: "卡片已添加到{column}。",
    loading: "正在加载看板",
    empty: "还没有卡片",
    error: "无法加载看板",
    retry: "重试",
  },
} as const;

export type KanbanLabels = { [K in keyof typeof kanbanMessages.en]: string };

export function kanbanLabels(
  locale: string,
  overrides: Partial<KanbanLabels> = {},
): KanbanLabels {
  return {
    ...kanbanMessages[supportedLocale(locale || document.documentElement.lang)],
    ...overrides,
  };
}

/** Built-in texts of the gantt surface. */
export const ganttMessages = {
  en: {
    scale: "Time scale",
    scaleDay: "Day",
    scaleWeek: "Week",
    scaleMonth: "Month",
    scaleQuarter: "Quarter",
    density: "Density",
    densityComfortable: "Comfortable",
    densityCompact: "Compact",
    baseline: "Approved plan",
    columns: "Columns",
    columnCode: "Code",
    columnName: "Task",
    columnResource: "Owner",
    columnStart: "Start",
    columnEnd: "End",
    columnDuration: "Days",
    columnProgress: "Done",
    columnDeps: "Predecessors",
    rowCount: "{count} tasks",
    week: "W{week}",
    quarter: "Q{quarter}",
    taskLabel: "{code} {name}, from {from} to {to}, {progress}%",
    milestoneLabel: "{code} {name}, {date}",
    linkTitle: "Link {code} to another task",
    linkTarget: "Release to link {code}",
    linkHint: "Release on another task",
    loadTitle: "{resource} · {date} · {hours} h per day",
    moved: "{code}: {from} → {to}.",
    cancelled: "Change cancelled.",
    endBeforeStart: "The end cannot come before the start.",
    dependencyAdded: "{predecessor} comes before {task}.",
    dependencyExists: "That dependency already exists.",
    dependencyLoop: "That dependency would close a loop.",
    dependencySame: "A task cannot depend on itself.",
    expand: "Expand {label}",
    collapse: "Collapse {label}",
    today: "Today",
    loading: "Loading the plan",
    empty: "The plan is empty",
    error: "The plan could not be loaded",
    retry: "Try again",
  },
  it: {
    scale: "Scala temporale",
    scaleDay: "Giorno",
    scaleWeek: "Settimana",
    scaleMonth: "Mese",
    scaleQuarter: "Trimestre",
    density: "Densità",
    densityComfortable: "Comoda",
    densityCompact: "Compatta",
    baseline: "Piano approvato",
    columns: "Colonne",
    columnCode: "Codice",
    columnName: "Attività",
    columnResource: "Responsabile",
    columnStart: "Inizio",
    columnEnd: "Fine",
    columnDuration: "Giorni",
    columnProgress: "Avanz.",
    columnDeps: "Predecessori",
    rowCount: "{count} attività",
    week: "S{week}",
    quarter: "T{quarter}",
    taskLabel: "{code} {name}, dal {from} al {to}, {progress}%",
    milestoneLabel: "{code} {name}, {date}",
    linkTitle: "Collega {code} a un'altra attività",
    linkTarget: "Rilascia per collegare {code}",
    linkHint: "Rilascia su un'altra attività",
    loadTitle: "{resource} · {date} · {hours} h al giorno",
    moved: "{code}: {from} → {to}.",
    cancelled: "Modifica annullata.",
    endBeforeStart: "La fine non può precedere l'inizio.",
    dependencyAdded: "{predecessor} precede {task}.",
    dependencyExists: "La dipendenza esiste già.",
    dependencyLoop: "La dipendenza chiuderebbe un ciclo.",
    dependencySame: "Un'attività non può dipendere da sé stessa.",
    expand: "Espandi {label}",
    collapse: "Comprimi {label}",
    today: "Oggi",
    loading: "Caricamento della pianificazione",
    empty: "La pianificazione è vuota",
    error: "Non riusciamo a caricare la pianificazione",
    retry: "Riprova",
  },
  fr: {
    scale: "Échelle de temps",
    scaleDay: "Jour",
    scaleWeek: "Semaine",
    scaleMonth: "Mois",
    scaleQuarter: "Trimestre",
    density: "Densité",
    densityComfortable: "Confortable",
    densityCompact: "Compacte",
    baseline: "Plan approuvé",
    columns: "Colonnes",
    columnCode: "Code",
    columnName: "Tâche",
    columnResource: "Responsable",
    columnStart: "Début",
    columnEnd: "Fin",
    columnDuration: "Jours",
    columnProgress: "Avanc.",
    columnDeps: "Prédécesseurs",
    rowCount: "{count} tâches",
    week: "S{week}",
    quarter: "T{quarter}",
    taskLabel: "{code} {name}, du {from} au {to}, {progress} %",
    milestoneLabel: "{code} {name}, {date}",
    linkTitle: "Relier {code} à une autre tâche",
    linkTarget: "Relâcher pour relier {code}",
    linkHint: "Relâcher sur une autre tâche",
    loadTitle: "{resource} · {date} · {hours} h par jour",
    moved: "{code} : {from} → {to}.",
    cancelled: "Modification annulée.",
    endBeforeStart: "La fin ne peut pas précéder le début.",
    dependencyAdded: "{predecessor} précède {task}.",
    dependencyExists: "Cette dépendance existe déjà.",
    dependencyLoop: "Cette dépendance fermerait une boucle.",
    dependencySame: "Une tâche ne peut pas dépendre d'elle-même.",
    expand: "Déplier {label}",
    collapse: "Replier {label}",
    today: "Aujourd'hui",
    loading: "Chargement du planning",
    empty: "Le planning est vide",
    error: "Le planning ne peut pas être chargé",
    retry: "Réessayer",
  },
  zh: {
    scale: "时间刻度",
    scaleDay: "日",
    scaleWeek: "周",
    scaleMonth: "月",
    scaleQuarter: "季度",
    density: "密度",
    densityComfortable: "舒适",
    densityCompact: "紧凑",
    baseline: "已批准计划",
    columns: "列",
    columnCode: "编号",
    columnName: "任务",
    columnResource: "负责人",
    columnStart: "开始",
    columnEnd: "结束",
    columnDuration: "天数",
    columnProgress: "完成",
    columnDeps: "前置任务",
    rowCount: "{count} 个任务",
    week: "第{week}周",
    quarter: "第{quarter}季度",
    taskLabel: "{code} {name}，{from} 至 {to}，{progress}%",
    milestoneLabel: "{code} {name}，{date}",
    linkTitle: "将 {code} 连接到其他任务",
    linkTarget: "松开以连接 {code}",
    linkHint: "在其他任务上松开",
    loadTitle: "{resource} · {date} · 每日 {hours} 小时",
    moved: "{code}：{from} → {to}。",
    cancelled: "已取消修改。",
    endBeforeStart: "结束日期不能早于开始日期。",
    dependencyAdded: "{predecessor}先于{task}。",
    dependencyExists: "该依赖已存在。",
    dependencyLoop: "该依赖会形成循环。",
    dependencySame: "任务不能依赖于自身。",
    expand: "展开{label}",
    collapse: "折叠{label}",
    today: "今天",
    loading: "正在加载计划",
    empty: "计划为空",
    error: "无法加载计划",
    retry: "重试",
  },
} as const;

export type GanttLabels = { [K in keyof typeof ganttMessages.en]: string };

export function ganttLabels(
  locale: string,
  overrides: Partial<GanttLabels> = {},
): GanttLabels {
  return {
    ...ganttMessages[supportedLocale(locale || document.documentElement.lang)],
    ...overrides,
  };
}

export type SidebarLabels = { [K in keyof typeof sidebarMessages.en]: string };

export function sidebarLabels(
  locale = "",
  overrides: Partial<SidebarLabels> = {},
): SidebarLabels {
  return {
    ...sidebarMessages[
      supportedLocale(locale || document.documentElement.lang)
    ],
    ...overrides,
  };
}
