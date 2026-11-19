/** Italian source text → Simplified Chinese. Keys come from scripts/i18n-keys.mjs. */
const messages: Record<string, string> = {
  'Vibrant è disponibile solo con menu verticale. Il menu si apre con show(anchor). tail="none" disegna il menu senza coda, con i quattro angoli uguali. Con filterable il menu mostra un campo di filtro; sotto 480px il menu verticale diventa un foglio dal basso.':
    'Vibrant 仅适用于垂直菜单。菜单通过 show(anchor) 打开。tail="none" 绘制无尾角的菜单，四角相同。启用 filterable 后菜单显示筛选输入框；宽度低于 480px 时垂直菜单变为底部面板。',
  "## Aggiornamento dei dati": "## 数据更新",
  "Aggiornamento dei dati": "数据更新",
  "Il componente ridisegna quando riceve una nuova proprietà. Non osserva le mutazioni interne all'array: un valore riassegnato con lo stesso riferimento non produce aggiornamenti. La tabella riporta i casi misurati.":
    "组件在收到新属性时重绘。它不观察数组内部的变更：用相同引用重新赋值不会产生更新。表格列出实测情况。",
  "Il componente ridisegna quando riceve una nuova proprietà. Non osserva le mutazioni interne all'array: un valore riassegnato con lo stesso riferimento non produce aggiornamenti.":
    "组件在收到新属性时重绘。它不观察数组内部的变更：用相同引用重新赋值不会产生更新。",
  "JavaScript, mutazione sul posto": "JavaScript，就地修改",
  "Vue, stato derivato": "Vue，派生状态",
  "La proprietà è un array dell'applicazione: il componente lo legge e non lo modifica. Il riferimento resta l'unico segnale di cambiamento, tranne la chiamata esplicita a refresh().":
    "该属性是应用拥有的数组：组件只读取，不修改。除显式调用 refresh() 外，引用是唯一的变化信号。",
  "Non ridisegna: l'array è lo stesso oggetto e il confronto è per riferimento.":
    "不重绘：数组是同一对象，比较基于引用。",
  "Operazione": "操作",
  "Risultato": "结果",
  "React assegna una nuova proprietà a ogni cambio, quindi ridisegna.":
    "React 每次变化都赋新属性，因此会重绘。",
  "Ridisegna con i dati mutati.": "用修改后的数据重绘。",
  "Ridisegna: il riferimento è nuovo.": "重绘：引用是新的。",
  "Vue assegna una nuova proprietà a ogni cambio, quindi ridisegna.":
    "Vue 每次变化都赋新属性，因此会重绘。",
  "non ridisegna, il riferimento è lo stesso": "不重绘，引用相同",
  "ridisegna": "重绘",
  "ridisegna con i dati mutati": "用修改后的数据重绘",
  "Anteprima di {title}": "{title} 的预览",
  "Apri in CodePen": "在 CodePen 中打开",
  "Apri nel playground": "在演练场中打开",
  "Esegui": "运行",
  "Esempio copiato": "示例已复制",
  "Pannelli dell'esempio": "示例面板",
  "Reimposta": "重置",
  "Esempio di renderer di cella": "单元格渲染函数示例",
  "Il componente chiama le funzioni dell'applicazione: column.render per ogni cella, rowRenderer per l'intera riga, detail per la riga aperta, groupSummary per gruppo. Gli slot coprono solo le aree esterne.":
    "组件调用应用提供的函数：每个单元格用 column.render，整行用 rowRenderer，打开的行用 detail，每个分组用 groupSummary。插槽仅用于外部区域。",
  "Slot del framework tramite wrapper": "通过包装组件使用框架插槽",
  "Vue e React non possono passare uno slot con scope a un elemento personalizzato. Un wrapper di poche righe trasforma la slot in un renderer: la pagina scrive il template della cella una volta, il wrapper monta il contenuto per ogni riga e libera la memoria quando la cella esce dal documento.":
    "Vue 和 React 无法向自定义元素传递带作用域的插槽。几行代码的包装组件把插槽转换为渲染函数：页面只写一次单元格模板，包装组件为每一行挂载内容，并在单元格离开文档时释放内存。",
  "Il componente chiama column.render per ogni cella, una volta per riga: qui si decide il contenuto e non si prepara nulla in anticipo. La funzione restituisce un nodo o una stringa; rowRenderer sostituisce invece l'intera riga.":
    "组件为每个单元格调用 column.render，每行一次：内容在此决定，无需提前准备。函数返回节点或字符串；rowRenderer 则替换整行。",
  "Il componente chiama le funzioni che gli passi: column.render per ogni cella, detail per la riga aperta, groupSummary per gruppo. Gli slot servono solo alle aree esterne, come intestazione, stati e piè di pagina.":
    "组件调用你传入的函数：每个单元格用 column.render，打开的行用 detail，每个分组用 groupSummary。插槽仅用于外部区域，如标题、状态和页脚。",
  "group-by accetta la chiave di una colonna con groupable. Il componente chiama groupSummary con le righe del gruppo, oppure groupRenderer per sostituire l'intera intestazione del gruppo.":
    "group-by 接受带 groupable 的列的键。组件以该组的行调用 groupSummary，或用 groupRenderer 替换整个分组标题。",
  "Registrare i componenti": "注册组件",
  "Tabella minima": "最小表格",
  "Formattare i valori": "格式化数值",
  "Cella personalizzata": "自定义单元格",
  "Ordinamento": "排序",
  "Selezione delle righe": "行选择",
  "Dettaglio della riga": "行详情",
  "Raggruppamento": "分组",
  "Paginazione": "分页",
  "Caricamento, errore e vuoto": "加载、错误和空状态",
  "Colonne fisse, larghezze e visibilità": "固定列、宽度与可见性",
  "Scorrimento continuo": "连续滚动",
  "Stile tramite CSS part": "通过 CSS 部件设置样式",
  "Il componente è un elemento personalizzato e va registrato una volta. Vue e React richiedono una dichiarazione in più perché i tag bolle-* non sono elementi noti.":
    "组件是自定义元素，需要注册一次。由于 bolle-* 标签不是已知元素，Vue 和 React 需要额外声明。",
  "columns dichiara le colonne, rows i dati. row-key indica il campo univoco di ogni riga. Gli array si passano come proprietà, non come attributi.":
    "columns 声明列，rows 提供数据。row-key 指定每行的唯一字段。数组以属性形式传入，而不是特性。",
  "value trasforma il valore di una cella in testo. Serve per importi, date e numeri: la tabella continua a mostrare una sola riga di testo per cella.":
    "value 将单元格值转换为文本。用于金额、日期和数字：表格每个单元格仍只显示一行文本。",
  "loading copre la tabella durante il primo caricamento, updating la attenua mantenendo le righe, error mostra il messaggio ricevuto. Le azioni dello stato vuoto si passano nello slot empty.":
    "loading 覆盖首次加载时的表格，updating 保留行并变暗，error 显示收到的消息。空状态操作放入 empty 插槽。",
  "virtual disegna solo le righe visibili. L'host deve avere un'altezza definita, altrimenti la tabella non ha un'area di scorrimento. row-height regola l'altezza stimata di ogni riga.":
    "virtual 只绘制可见行。宿主必须设置固定高度，否则表格没有滚动区域。row-height 设置每行的估算高度。",
  "Le parti pubbliche si raggiungono con ::part dal foglio dell'applicazione e valgono per tutte le righe. Il contenuto dei renderer si stila con contentStyles, perché vive nello shadow root.":
    "公共部件通过应用样式表中的 ::part 访问，作用于所有行。渲染内容用 contentStyles 设置样式，因为它位于 shadow root 中。",
  "Linguaggio degli esempi": "示例语言",
  "## Uso nel codice": "## 代码用法",
  "Uso nel codice": "代码用法",
  "Cella personalizzata": "自定义单元格",
  "Selezione delle righe": "行选择",
  "Dettaglio della riga": "行详情",
  "Raggruppamento": "分组",
  "Paginazione": "分页",
  "Scorrimento continuo": "连续滚动",
  "Stile tramite CSS part": "通过 CSS 部件设置样式",
  "loading copre la tabella durante il primo caricamento, updating la attenua mantenendo le righe, error mostra il messaggio ricevuto. Le azioni dello stato vuoto si passano nello slot empty.":
    "loading 覆盖首次加载时的表格，updating 保留行并变暗，error 显示收到的消息。空状态操作通过 empty 插槽传入。",
  "## Anatomia pubblica": "## 公共结构",
  "Anatomia pubblica": "公共结构",
  "CSS part": "CSS 部件",
  "Slot": "插槽",
  "Esempio completo": "完整示例",
  "Parte pubblica dello stile del componente.": "组件样式的公共部件。",
  "Slot pubblico da usare per il contenuto indicato dal nome.":
    "按名称使用的公共插槽。",
  "I segnaposto hanno questo significato: {rowId} è il valore di rowKey, {columnKey} è il campo key della colonna, {groupName} è il valore del gruppo e {id} è l'identificatore dell'elemento.":
    "{rowId} 表示 rowKey 值，{columnKey} 表示列的 key 字段，{groupName} 表示分组值，{id} 表示元素标识符。",
  "Slot e CSS part sono un contratto di composizione. Le parti interne senza elenco restano private al componente.":
    "插槽和 CSS 部件构成组合契约。未列出的内部结构仍为组件私有。",
  "L'applicazione riempie gli slot, la shell decide la forma misurando la propria larghezza: sotto 840px la navigazione passa sotto il contenuto e il pannello diventa un foglio, oltre 1240px la navigazione resta estesa. Allargando la finestra l'anteprima passa da sola alla forma più ampia.":
    "应用填充插槽，外壳按自身宽度决定形态：低于 840px 时导航移到内容下方，面板变为抽屉；超过 1240px 时导航保持展开。放大窗口时预览会自动切换到最宽的形态。",
  "42 commesse attive · 7 in ritardo · 3 collaudi questa settimana":
    "42 个进行中的工程 · 7 个逾期 · 本周 3 个验收",
  "5 cantieri aperti": "5 个在建工地",
  "6 commesse con scadenza superata": "6 个逾期工程",
  "9 riquadri": "9 个块",
  "Applicazione": "应用",
  "Attività recenti": "最近动态",
  "Avanzamento cantieri": "工地进度",
  "Cantieri": "工地",
  "Carico": "负载",
  "Carico per responsabile": "各负责人负载",
  "Colonne": "列数",
  "Fatturato": "营收",
  "Fatturato per mese": "各月营收",
  "Griglia a dodici colonne di riquadri: ampiezza, ordine, ridimensionamento e riordino, con il layout che resta all'applicazione.":
    "十二列块状网格：宽度、顺序、调整大小与重新排序，布局归属应用。",
  "Lavori in ritardo": "逾期工程",
  "Ogni riquadro dichiara la propria ampiezza con span e un minimo con min-span. Il riquadro si sposta trascinando la maniglia, con Alt e le frecce o dal menu, e si allarga trascinando l'angolo o con le frecce. Ogni modifica arriva con layout-change.":
    "每个块用 span 声明宽度，用 min-span 声明最小值。拖动把手、Alt 加方向键或通过菜单移动，拖动角或用方向键调整宽度。每次变更都以 layout-change 返回。",
  "Pannello secondario": "辅助面板",
  "Personale": "人员",
  "Regioni di un'applicazione gestionale: barra superiore, navigazione, contenuto, pannello secondario e barra di stato, con la forma che cambia secondo la larghezza.":
    "管理应用的区域：顶栏、导航、内容、辅助面板和状态栏，形态随宽度变化。",
  "Riquadri del cruscotto": "仪表板块",
  "Sposta o allarga un riquadro": "移动或调整块的大小",
  "Ultimo aggiornamento 22:31": "最后更新 22:31",
  "lunedì 16 novembre 2026": "2026 年 11 月 16 日星期一",
  "ore assegnate su 40 settimanali": "每周 40 小时中的已分配工时",
  "ultime 24 ore": "最近 24 小时",
  "ultimi dodici mesi, in migliaia di €": "最近十二个月，单位千欧元",
  "Apri scheda": "打开记录",
  "Archivia": "归档",
  "Cliente": "客户",
  "Commessa": "工程",
  "Comune": "市镇",
  "Dettaglio riga": "行详情",
  "Duplica commessa": "复制工程",
  "Importo": "金额",
  "Inizio lavori": "开工日期",
  "Raggruppa per": "分组依据",
  "Responsabile": "负责人",
  "Righe per pagina": "每页行数",
  "Scadenza": "截止日期",
  "Scorrimento continuo": "连续滚动",
  "Stato": "状态",
  "commesse": "项工程",
  "Elenco di righe con colonne dichiarate dall'applicazione: ordinamento anche multiplo, gruppi, pagine, selezione, dettaglio della riga e colonne regolabili.":
    "由应用声明列的行的列表：支持单列与多列排序、分组、分页、选择、行详情和可调整的列宽。",
  " · prima {color}": " · 之前 {color}",
  "## Esempio": "## 示例",
  "## Limiti aperti": "## 尚未解决的限制",
  "## Supporto": "## 支持情况",
  ", prima {color}": "，之前 {color}",
  "12 non letti": "12 封未读",
  "Accenti colorati con superfici grigie.": "彩色强调色搭配灰色表面。",
  "Accento": "强调",
  "Accessibile per costruzione": "天生无障碍",
  "Accessibilità": "无障碍",
  "Accetto i termini": "我接受条款",
  "Aiuto": "帮助",
  "Algoritmo": "算法",
  "Allineamento": "对齐",
  "Altre opzioni": "更多选项",
  "Altri componenti": "其他组件",
  "Altri token": "其他令牌",
  "Ambra": "琥珀",
  "Angolo stretto delle card": "Card 的窄角",
  "Angolo stretto rivolto all'origine": "指向来源的窄角",
  "Annulla": "取消",
  "Anteprima": "预览",
  "Anteprima del CSS": "CSS 预览",
  "Applica": "应用",
  "Apri": "打开",
  "Apri dialog": "打开 Dialog",
  "Apri drawer": "打开 Drawer",
  "Apri foglio": "打开底部面板",
  "Apri in nuova scheda": "在新标签页中打开",
  "Apri navigazione": "打开导航",
  "Apri pannello": "打开面板",
  "Apri una dialog": "打开一个 Dialog",
  "Archivio": "归档",
  "Ariosa": "宽松",
  "Armonia · Analoga": "配色 · 类似色",
  "Armonia · Complementare": "配色 · 互补色",
  "Armonia · Complementare divisa": "配色 · 分裂互补色",
  "Armonia · Quadrato": "配色 · 正方形",
  "Armonia · Triade": "配色 · 三角",
  "Aspetto": "外观",
  "Assist, filter, input e suggestion, con elevazione, rimozione e avatar.":
    "Assist、Filter、Input 和 Suggestion，支持高度、移除和头像。",
  "Attivazione": "激活方式",
  "Attivo": "活动",
  "Attributo": "特性",
  "Avanzamento": "进度",
  "Avanzamento lineare o circolare, determinato o indeterminato, anche ondulato.":
    "线性或环形进度，确定或不确定，也可呈波浪形。",
  "Azione": "操作",
  "Azione flottante con taglie e sei mappature di colore.":
    "浮动操作按钮，提供多种尺寸和六种颜色映射。",
  "Azione principale affiancata da un menu di azioni alternative.":
    "主操作旁附带一个备选操作菜单。",
  "Azione principale o secondaria, con stati di toggle, link e invio form.":
    "主要或次要操作，支持切换状态、链接和表单提交。",
  "Azioni": "操作",
  "Azioni documento": "文档操作",
  "Badge": "Badge",
  "Barra superiore con sette layout, sottotitolo, slot e stato di scorrimento.":
    "顶部栏，提供七种布局、副标题、插槽和滚动状态。",
  "Bianche": "纯白",
  "Bianco": "白色",
  "Bolla · primario": "气泡 · 主色",
  "Bolla-valore, livello liquido, membrana o intervallo a gocce che si fondono.":
    "气泡数值、液面、薄膜，或由相融水滴组成的区间。",
  "Bolle è una libreria di componenti che prende i token, la struttura e l'accessibilità di Material 3 e li avvolge in una pelle nuova: forme a fumetto, una pellicola iridescente e un movimento che si schiaccia e scoppia.":
    "Bolle 是一个组件库：它沿用 Material 3 的令牌、结构和无障碍能力，再披上一层新外衣——对话气泡般的形状、一层虹彩薄膜，以及会挤压、会破裂的动效。",
  "Bosco": "森林",
  "Bottone con sola icona; l'etichetta accessibile è obbligatoria.":
    "仅含图标的按钮；必须提供无障碍标签。",
  "Campo a riga singola o multilinea, con affissi, contatore, errore e slot icona.":
    "单行或多行字段，支持前后缀、计数器、错误提示和图标插槽。",
  "Campo di testo con suggerimenti da option native, filtro durante la digitazione e ruolo combobox.":
    "文本字段，提供来自原生 option 的建议、输入时过滤，并具有 combobox 角色。",
  "Caricamento": "加载中",
  "Cartelle": "文件夹",
  "Casa": "家庭",
  "Catalogo": "目录",
  "Categorie": "分类",
  "Centro": "中部",
  "Cerca": "搜索",
  "Cerca città": "搜索城市",
  "Cerca nella posta": "搜索邮件",
  "Cestino": "回收站",
  "Chiudi": "关闭",
  "Chiusura": "关闭",
  "Ciclo orario": "时制",
  "Città di consegna": "送货城市",
  "Coda": "尾角",
  "Codice": "代码",
  "Codice copiato": "代码已复制",
  "Codice dell'esempio": "示例代码",
  "Collegamento": "链接",
  "Colore": "颜色",
  "Colore personalizzato": "自定义颜色",
  "Colore seed": "种子色",
  "Colore selezionato · {name}": "已选颜色 · {name}",
  "Colore · {name}": "颜色 · {name}",
  "Colori": "颜色",
  "Colori di base": "基础颜色",
  "Come in Material 3, Primary diventa il tono 40 (chiaro) o 80 (scuro) della palette del seme.":
    "与 Material 3 一致，Primary 取种子色调色板的色调 40（浅色）或 80（深色）。",
  "Come tonal spot, con colori più saturi.":
    "与 Tonal Spot 相同，但颜色更饱和。",
  "Come è fatta una bolla": "气泡的构成",
  "Comparsa": "出现",
  "Compatta": "紧凑",
  "Componenti": "组件",
  "Componenti morbidi, regole rigorose.": "柔软的组件，严谨的规则。",
  "Compresso": "收起",
  "Con href l'intera card diventa un link: è il modo di portare a un'altra pagina con una superficie, mentre i bottoni restano per le azioni. Una card-link non deve contenere altri controlli interattivi. La coda punta da dove arriva l'utente: una card sotto il contenuto la gira in alto, dal lato opposto alla direzione in cui porta. Con tail=\"none\" la coda sparisce e la card resta una bolla con i quattro angoli uguali.":
    '设置 href 后，整张 Card 会变成链接：用一块表面引导用户前往另一个页面，按钮则仍用于操作。链接 Card 内不得包含其他交互控件。尾角指向用户来的方向：位于内容下方的 Card 会把尾角朝上，与其引导的方向相反。 使用 tail="none" 时尾角消失，Card 保持四角相同的泡泡形状。',
  "Con movimento ridotto solo dissolvenze.": "减少动态效果时只保留淡入淡出。",
  "Condividi": "分享",
  "Conferma": "确认",
  "Contatore": "计数器",
  "Contatore o punto di notifica; con etichetta diventa uno stato annunciato.":
    "计数或通知圆点；带标签时会成为可被读出的状态。",
  "Contenuto": "内容",
  "Contenuto aggiuntivo del drawer.": "Drawer 的附加内容。",
  "Contenuto indipendente con un'azione interna.": "独立内容，内含一个操作。",
  "Contrasto": "对比度",
  "Controlli": "控件",
  "Controlli dei token": "令牌控件",
  "Copia": "复制",
  "Copia CSS": "复制 CSS",
  "Copia collegamento": "复制链接",
  "Copia il comando": "复制命令",
  "Copia il comando di installazione": "复制安装命令",
  "Copia pagina": "复制页面",
  "Corallo": "珊瑚",
  "Corsivo": "斜体",
  "Cosa è implementato e cosa manca rispetto a Material 3, dal catalogo del README (in inglese). Copertura della voce non significa conformità completa.":
    "相对 Material 3 已实现和尚缺的部分，摘自 README 中的目录（英文）。条目已覆盖并不代表完全符合规范。",
  "Crea": "创建",
  "Crea documento": "创建文档",
  "Curva della molla --bb-tension: supera il valore finale del 16% e oscilla prima di fermarsi":
    "弹簧曲线 --bb-tension：先越过终值 16%，再来回摆动直至停下",
  "Da due a cinque segmenti con selezione singola o multipla.":
    "二到五个分段，支持单选或多选。",
  "Da due a sei azioni correlate aperte da un FAB.":
    "由 FAB 展开的二到六个相关操作。",
  "Da tre a cinque destinazioni, baseline o flexible, con layout orizzontale.":
    "三到五个目的地，baseline 或 flexible，支持水平布局。",
  "Da tre a sette livelli con nome, disegnati come bolle che crescono.":
    "三到七个具名等级，以逐渐变大的气泡呈现。",
  "Data appuntamento": "预约日期",
  "Data finale": "结束日期",
  "Data iniziale": "开始日期",
  "Data singola o intervallo, con selettore modale o calendario docked.":
    "单个日期或日期范围，支持模态选择器或停靠式日历。",
  "Decorativo": "装饰性",
  "Default": "默认",
  "Densità": "密度",
  "Densità della tavolozza": "调色板密度",
  "Destra": "右",
  "Determina il fuso orario della spedizione.": "决定发货所用的时区。",
  "Dettagli": "详情",
  "Dettagli del documento selezionato.": "所选文档的详情。",
  "Dichiarato · attivo": "声明值 · 生效值",
  "Dimensione": "大小",
  "Dimensione base": "基础字号",
  "Dimensione base (px)": "基础字号（px）",
  "Direzione RTL": "RTL 方向",
  "Direzione del testo": "文字方向",
  "Disabilitata": "已禁用",
  "Disabilitato": "已禁用",
  "Display e headline large": "Display 与 Headline Large",
  "Distanza dell'anello dal controllo": "焦点环与控件的间距",
  "Documenti": "文档",
  "Documenti recenti": "最近的文档",
  "Documenti salvati": "已保存的文档",
  "Documenti salvati.": "已保存的文档。",
  "Documento": "文档",
  "Documento di esempio": "示例文档",
  "Documento eliminato": "文档已删除",
  "Dopo": "之后",
  "Drawer di sezioni modale o standard, con contenuto aggiuntivo.":
    "模态或标准的分区 Drawer，可含附加内容。",
  "Duplica": "复制副本",
  "Durata (ms)": "时长（ms）",
  "Elenco componenti": "组件列表",
  "Elenco dei token che il CSS di {tag} usa, con il valore dichiarato accanto a quello attivo. Ogni valore si scrive per intero (px o altra unità) e la modifica vale per tutti gli esempi del componente. Colori e forma restano token globali del tema attivo; i token dei componenti annidati appartengono al componente che li usa.":
    "{tag} 的 CSS 所用令牌列表，声明值与生效值并列显示。每个值都需完整书写（px 或其他单位），修改会作用于该组件的所有示例。颜色和形状仍是当前主题的全局令牌；嵌套组件的令牌归使用它们的组件所有。",
  "Elevata": "凸起",
  "Elimina": "删除",
  "Eliminare il documento?": "删除该文档？",
  "Eliminare la bozza?": "删除草稿？",
  "Email": "电子邮件",
  "Errore": "错误",
  "Esadecimale": "十六进制",
  "Esempio di componenti Bolle": "Bolle 组件示例",
  "Esempio di navigazione": "导航示例",
  "Espanso": "展开",
  "Esporta e importa": "导出与导入",
  "Estesa": "完整",
  "Etichetta": "标签",
  "Etichetta accessibile": "无障碍标签",
  "Etichetta azione": "操作标签",
  "Etichetta chiusura": "关闭标签",
  "Etichetta del gruppo": "分组标签",
  "Etichetta menu": "菜单标签",
  "Etichetta precedente": "“上一个”标签",
  "Etichetta rimozione": "移除标签",
  "Etichetta successivo": "“下一个”标签",
  "Etichette, nomi accessibili e testi tradotti arrivano dal contenuto del chiamante: il componente non inventa testo.":
    "标签、无障碍名称和翻译文本均来自调用方的内容：组件不会自行生成文本。",
  "FAB esteso con testo visibile e icona opzionale.":
    "带可见文字和可选图标的扩展 FAB。",
  "Filtra componenti": "筛选组件",
  "Filtra suggerimenti": "筛选建议",
  "Filtri": "筛选",
  "Filtro": "筛选",
  "Finestra modale o non modale, con azioni e variante a schermo intero.":
    "模态或非模态窗口，带操作按钮和全屏变体。",
  "Foglio ancorato in basso, modale o standard, con maniglia di trascinamento.":
    "固定在底部的面板，模态或标准，带拖动手柄。",
  "Fondamenta": "Foundations",
  "Font testo": "正文字体",
  "Font titoli": "标题字体",
  "Forma": "形状",
  "Forma e testo": "形状与文字",
  "Forma, colore e tipografia applicati a una scheda.":
    "应用到卡片上的形状、颜色和字体。",
  "Formato": "格式",
  "Forme": "形状",
  "Galleggiamento": "漂浮",
  "Genera da Primary": "由 Primary 生成",
  "Giorno": "日",
  "Gonfia un tema da un solo colore.": "用一种颜色吹出整套主题。",
  "Gradiente conico completo": "完整锥形渐变",
  "Grafite": "石墨",
  "Grassetto": "粗体",
  "Gruppo con selezione singola o multipla, navigazione da tastiera e geometria connessa.":
    "单选或多选按钮组，支持键盘导航和相连几何形状。",
  "Guarda i componenti": "查看组件",
  "Guarda il bordo: la dialog sale e scende di un paio di pixel.":
    "注意边框：Dialog 会上下浮动几个像素。",
  "Home": "首页",
  "I due vicini del complementare (+150° e +210°).":
    "互补色两侧的邻色（+150° 和 +210°）。",
  "I ruoli tonali garantiscono il contrasto; l'iridescenza non indica mai uno stato da sola.":
    "色调角色保证对比度；虹彩从不单独表示状态。",
  "Icona finale": "尾随图标",
  "Icona iniziale": "前导图标",
  "Icone": "图标",
  "Icone Tabler": "Tabler 图标",
  "Il CSS non contiene token Bolle riconosciuti.":
    "CSS 中没有可识别的 Bolle 令牌。",
  "Il JSON contiene tema chiaro e scuro, forme, tipografia e densità e si reimporta qui. Il CSS è pronto per il tuo foglio di stile: tema chiaro su {light}, colori scuri su {dark}.":
    "JSON 包含浅色和深色主题、形状、字体和密度，可在此重新导入。CSS 可直接放入你的样式表：浅色主题位于 {light}，深色颜色位于 {dark}。",
  "Il JSON non è un'esportazione dei token Bolle.":
    "该 JSON 不是 Bolle 令牌的导出文件。",
  "Il colore dinamico di Material 3 genera i ruoli tonali; Bolle ne ricava anche la pellicola. Scegli un seed e guarda cosa cambia: il tema vale per tutto il sito.":
    "Material 3 的动态颜色生成色调角色；Bolle 还从中得出虹彩薄膜。选一个种子色，看看有什么变化：主题会作用于整个网站。",
  "Il colore funzionale arriva dai ruoli tonali di M3, generati dal seed #5B4CF0 con npm run colors. La pellicola è un livello decorativo a parte. L'accento Scoppio è riservato a call to action rare.":
    "功能色来自 M3 的色调角色，由种子色 #5B4CF0 通过 npm run colors 生成。虹彩薄膜是独立的装饰层。“破裂”强调色仅保留给少量行动号召。",
  "Il colore resta M3.": "颜色仍是 M3。",
  "Il file JSON non è valido.": "JSON 文件无效。",
  "Il file è troppo grande (massimo 512 KB).": "文件过大（最大 512 KB）。",
  "Il livello più alto, con tinta del primario": "最高层级，带主色色调",
  "Il seme è il valore corrente di Primary; la generazione sostituisce tutti gli altri ruoli del tema chiaro.":
    "种子色为 Primary 的当前值；生成会替换浅色主题的所有其他角色。",
  "Il seme è il valore corrente di Primary; la generazione sostituisce tutti gli altri ruoli del tema scuro.":
    "种子色为 Primary 的当前值；生成会替换深色主题的所有其他角色。",
  "Il testo di base usa la dimensione scelta: etichette, campi e paragrafi crescono e calano insieme.":
    "基础文字采用所选字号：标签、字段和段落一同放大或缩小。",
  "Implementato": "已实现",
  "Impostazioni": "设置",
  "In Bolle l'elevazione si legge da ombra morbida e riflesso, non solo dal colore di superficie. Più un elemento sale, più l'ombra si allarga e prende la tinta del primario. Al passaggio del puntatore ogni pulsante mostra il riflesso della bolla sopra il proprio colore, insieme allo strato di stato M3.":
    "在 Bolle 中，高度通过柔和阴影和高光来体现，而不只是表面颜色。元素越高，阴影越宽，并带上主色色调。指针悬停时，每个按钮都会在自身颜色上显示气泡高光，同时叠加 M3 状态层。",
  "In pausa": "已暂停",
  "In questa pagina": "本页内容",
  "Inattivo": "未激活",
  "Inchiostro": "墨色",
  "Indeterminata": "不确定",
  "Indeterminato": "不确定",
  "Indicatori": "指示器",
  "Indice": "索引",
  "Inizia": "开始",
  "Inizia ora": "立即开始",
  "Inizio settimana": "每周起始日",
  "Inset": "内缩",
  "Installa il pacchetto, scegli un seed, e i tuoi componenti M3 prendono forma.":
    "安装软件包，选一个种子色，你的 M3 组件就成形了。",
  "Intensità": "强度",
  "Interattiva": "可交互",
  "Interfacce con tensione superficiale": "有表面张力的界面",
  "Interfacce con tensione superficiale.": "有表面张力的界面。",
  "Interruttore immediato con icone di stato opzionali.":
    "即时生效的开关，可选状态图标。",
  "Invia": "发送",
  "Invia per email": "通过电子邮件发送",
  "Invia più tardi": "稍后发送",
  "Ispirata a Material 3 · open source": "受 Material 3 启发 · 开源",
  "L'anello iridescente è sempre doppiato da un contorno pieno: il significato non dipende mai dal gradiente.":
    "虹彩焦点环始终叠加一圈实色轮廓：含义从不依赖渐变。",
  "L'attributo {attribute} usa la sintassi di {syntax}. Se il componente contiene un controllo focalizzabile, la combinazione lo mette a fuoco; bottoni e link vengono anche attivati.":
    "{attribute} 特性使用 {syntax} 语法。若组件内含可聚焦控件，该组合键会使其获得焦点；按钮和链接还会被激活。",
  "L'operazione non può essere annullata.": "此操作无法撤销。",
  "La coda": "尾角",
  "La coda punta qui": "尾角指向这里",
  "La copia resta nel tuo spazio personale.": "副本保留在你的个人空间中。",
  "La pellicola": "虹彩薄膜",
  "La scala di M3 non cambia: cambiano solo le famiglie. Fredoka 600 per display e titoli dai 32 px in su, Figtree per testo e controlli, JetBrains Mono per il codice.":
    "M3 的字体层级不变，只更换字体族。Fredoka 600 用于 32 px 及以上的 Display 和标题，Figtree 用于正文和控件，JetBrains Mono 用于代码。",
  'La coda non è obbligatoria: card, menu, tooltip, azioni del FAB e snackbar accettano tail="none" e tornano bolle con i quattro angoli uguali, senza cambiare raggio.':
    '尾部并非必需：card、menu、tooltip、FAB 操作与 snackbar 都接受 tail="none"，变回四角相同的泡泡，半径不变。',
  "Laguna": "泻湖",
  "Larghezza": "宽度",
  "Lavoro": "工作",
  "Layout": "布局",
  "Leggera quando serve": "按需轻量",
  "Leggera quando serve.": "按需轻量。",
  "Leggera,Morbida,Media,Forte,Intensa": "轻,柔,中,强,极强",
  "Lilla · container": "淡紫 · 容器",
  "Limiti aperti": "尚未解决的限制",
  "Lingua": "语言",
  "Lo schiocco": "弹跳",
  "Luce": "光泽",
  "Lunghezza massima": "最大长度",
  "Maniglia": "手柄",
  "Mantieni il primario esatto": "保持主色精确不变",
  "Massimo": "最大值",
  "Material 3 resta la struttura: ruoli colore, scala tipografica, stati e accessibilità. Bolle ne è la pelle e la riconosci da tre segni: l'angolo a coda, la pellicola iridescente e lo schiocco. Tutto passa da pochi token in più, che puoi regolare o spegnere.":
    "Material 3 仍是骨架：颜色角色、字体层级、状态和无障碍。Bolle 是它的外衣，你能从三个标志认出它：尾角、虹彩薄膜和弹跳。一切都通过少量额外令牌实现，你可以调整或关闭它们。",
  "Materiale": "材质",
  "Media": "中",
  "Menu": "菜单",
  "Menu baseline o verticale, con gruppi, sottomenu e selezione.":
    "Baseline 或垂直菜单，支持分组、子菜单和选择。",
  "Menu sotto il bottone": "按钮下方的菜单",
  "Menu, tooltip ricco, card elevate": "菜单、富文本 Tooltip、凸起 Card",
  "Mese": "月",
  "Messaggi ricevuti": "收到的消息",
  "Messaggi ricevuti.": "收到的消息。",
  "Messaggio": "消息",
  "Messaggio temporaneo con azione, chiusura e coda di messaggi.":
    "临时消息，带操作、关闭按钮和消息队列。",
  "Minimo": "最小值",
  "Misure": "尺寸",
  "Modale": "模态",
  "Modifica": "编辑",
  "Molle con tensione superficiale. Alla pressione il pulsante si schiaccia a volume costante; al rilascio oscilla con una molla poco smorzata. Le superfici si gonfiano dall'angolo a coda e scoppiano alla chiusura. Le dialog, una volta aperte, galleggiano in modo quasi impercettibile.":
    "带表面张力的弹簧。按下时按钮以恒定体积被挤扁；松开时随一个低阻尼弹簧来回摆动。表面从尾角处鼓起，关闭时破裂。Dialog 打开后会几乎难以察觉地漂浮。",
  "Molle con tensione superficiale: si schiaccia, oscilla, si gonfia, scoppia. E si ferma del tutto se l'utente preferisce meno movimento.":
    "带表面张力的弹簧：挤扁、摆动、鼓起、破裂。若用户偏好减少动态效果，则完全静止。",
  "Mostra snackbar": "显示 Snackbar",
  "Movimento": "动效",
  "Movimento rispettoso": "克制的动效",
  "Movimento rispettoso.": "克制的动效。",
  "Multilinea": "多行",
  "Navigazione laterale": "侧边导航",
  "Navigazione principale": "主导航",
  "Nebbia · secondario": "雾 · 次要色",
  "Nero": "黑色",
  'Nessun blocco :root o [data-theme="dark"] trovato nel CSS.':
    'CSS 中未找到 :root 或 [data-theme="dark"] 代码块。',
  "Nessun componente precedente": "没有上一个组件",
  "Nessun componente successivo": "没有下一个组件",
  "Nessun componente: disponibile per il tuo CSS":
    "无组件使用：可供你的 CSS 使用",
  "Nome": "名称",
  "Non potrai recuperarla.": "删除后将无法恢复。",
  "Nord": "北部",
  "Notifiche": "通知",
  "Nuovo": "新建",
  "Nuovo elemento": "新项目",
  "Obbligatoria": "必填",
  "Obbligatorio": "必填",
  "Oceano": "海洋",
  "Ogni riga cambia un solo attributo; gli altri restano quelli dell'anteprima.":
    "每一行只改变一个特性；其余特性与预览保持一致。",
  "Ogni scheda mostra il componente reale nel suo stato predefinito. Le famiglie seguono l'ordine e il raggruppamento della overview Material 3.":
    "每张卡片都展示组件在默认状态下的真实样子。组件族的顺序和分组遵循 Material 3 概览。",
  "Ogni superficie sospesa ha tre angoli tondi e uno stretto, che punta verso l'elemento da cui è nata. Menu, tooltip e azioni del FAB calcolano l'angolo all'apertura; snackbar e card lo tengono in basso, sul lato di inizio. I bottoni restano a pillola.":
    "每个浮层表面都有三个圆角和一个窄角，窄角指向它所源自的元素。Menu、Tooltip 和 FAB 操作在打开时计算该角的位置；Snackbar 和 Card 则将其固定在底部起始侧。按钮仍保持胶囊形。",
  "Ogni superficie sospesa ha un angolo stretto che indica da dove è nata. Menu, tooltip e snackbar ti dicono sempre a chi appartengono.":
    "每个浮层表面都有一个窄角，指明它从哪里来。Menu、Tooltip 和 Snackbar 总能告诉你它们属于谁。",
  "Ogni token ha il colore e il numero della sua quota nell'anteprima. La modifica vale per tutti gli esempi di {tag}.":
    "每个令牌都在预览中以颜色和编号标出其尺寸。修改会作用于 {tag} 的所有示例。",
  "Ondulato": "波浪形",
  "Opacità del fondo traslucido": "半透明底色的不透明度",
  "Oppure incolla JSON o CSS": "或粘贴 JSON 或 CSS",
  "Opzioni": "选项",
  "Ora con quadrante o inserimento numerico, ciclo 12 o 24 ore.":
    "通过表盘或数字输入选择时间，支持 12 或 24 小时制。",
  "Ora promemoria": "提醒时间",
  "Ordina": "排序",
  "Ordina per": "排序方式",
  "Orientamento": "方向",
  "Pagina copiata in Markdown": "页面已复制为 Markdown",
  "Palette Material": "Material 调色板",
  "Paletti": "护栏",
  "Pannello del playground": "演练场面板",
  "Pannello laterale modale o standard, con variante staccata dal bordo.":
    "模态或标准侧边面板，带脱离边缘的变体。",
  "Parametri": "参数",
  "Passa sopra": "悬停",
  "Passa sopra i pulsanti: il riflesso compare in alto a destra.":
    "将指针悬停在按钮上：高光出现在右上角。",
  "Passa sopra un componente per vedere i token che usa":
    "将指针悬停在组件上，查看它使用的令牌",
  "Passo": "步长",
  "Pellicola": "虹彩薄膜",
  "Pensato per colori estratti da immagini: fedele al seme, accenti per temperatura.":
    "专为从图片提取的颜色设计：忠于种子色，强调色按色温区分。",
  "Percorso": "路径",
  "Periodo": "时段",
  "Persistente": "常驻",
  "Più popolari": "最受欢迎",
  "Più recenti": "最新",
  "Più tardi": "稍后",
  "Placeholder": "Placeholder",
  "Posta": "收件箱",
  "Precedente": "上一个",
  "Precedente: {name}": "上一个：{name}",
  "Predefinito M3: secondary e tertiary sono varianti tenui della tinta del seme.":
    "M3 默认：secondary 和 tertiary 是种子色色调的柔和变体。",
  "Preferenze": "偏好",
  "Preferenze di notifica": "通知偏好",
  "Preferenze personali": "个人偏好",
  "Preferenze personali.": "个人偏好。",
  "Preferiti": "收藏",
  "Prefisso": "前缀",
  "Premi / per cercare": "按 / 搜索",
  "Premi Tab per il focus": "按 Tab 获取焦点",
  "Premi e rilascia": "按下并松开",
  "Pressione": "按下",
  "Prima": "之前",
  "Prima: {color}": "之前：{color}",
  "Primary e container restano molto vicini al seme, anche se saturo.":
    "Primary 和容器色始终非常接近种子色，即使种子色很饱和。",
  "Primary resta il colore scelto; il testo sopra diventa il tono più leggibile.":
    "Primary 保持所选颜色；其上的文字采用最易读的色调。",
  "Primary su Surface": "Surface 上的 Primary",
  "Principale": "主要",
  "Proprietà": "属性",
  "Proprietà pubbliche lette dalla classe registrata. Array e oggetti si assegnano come proprietà JavaScript; gli attributi booleani valgono per presenza, quindi {example} resta disabilitato.":
    "从已注册类中读取的公共属性。数组和对象需作为 JavaScript 属性赋值；布尔特性以是否存在为准，因此 {example} 仍为禁用状态。",
  "Puoi revocare il consenso.": "你可以随时撤回同意。",
  "Quadrato sulla ruota (+90° e +180°).": "色轮上的正方形（+90° 和 +180°）。",
  "Quasi bianche": "近白",
  "Quasi senza colore: utile per interfacce sobrie.":
    "几乎无色：适合素雅的界面。",
  "Raggio degli angoli e componenti che lo usano": "圆角半径及使用它的组件",
  "Raggio dei tre angoli tondi delle superfici sospese":
    "浮层表面三个圆角的半径",
  "Raggio del tooltip semplice": "简单 Tooltip 的圆角半径",
  "Raggio di snackbar e tooltip ricco": "Snackbar 和富文本 Tooltip 的圆角半径",
  "Raggruppa azioni correlate con roving tabindex, orizzontale o verticale.":
    "以 roving tabindex 组织相关操作，水平或垂直排列。",
  "Rail compresso o espanso per la navigazione laterale.":
    "收起或展开的 Rail，用于侧边导航。",
  "Regione": "地区",
  "Regola colori, forma e tipografia. Le modifiche si applicano a tutti i componenti e al sito, separatamente per tema chiaro e scuro.":
    "调整颜色、形状和字体。修改会应用到所有组件和整个网站，浅色和深色主题分别设置。",
  "Regole": "规则",
  "Reimposta dettaglio": "重置细节",
  "Reimposta misure": "重置尺寸",
  "Reimposta parametri": "重置参数",
  "Reimposta tema": "重置主题",
  "Reset": "重置",
  "Rete senza fili.": "无线网络。",
  "Ricerca con suggerimenti filtrabili, combobox ARIA e area risultati.":
    "带可筛选建议、ARIA combobox 和结果区域的搜索。",
  "Riflessa": "反映",
  "Riflesso e galleggiamento": "高光与漂浮",
  "Riflesso in alto a destra, all'hover e sul FAB":
    "右上角高光，悬停时及 FAB 上显示",
  "Righe": "行数",
  "Righe con icone, testo di supporto, link, espansione e selezione singola o multipla.":
    "带图标、辅助文字、链接、展开和单选或多选的列表行。",
  "Rilascio": "松开",
  "Rimovibile": "可移除",
  "Rimuovi Preferiti": "移除收藏",
  "Rinomina": "重命名",
  "Ripeti": "重复",
  "Ritardo suggerimenti (ms)": "建议延迟（ms）",
  "Ruota le tinte di secondary e tertiary in modo marcato rispetto al seme.":
    "让 secondary 和 tertiary 的色相相对种子色大幅旋转。",
  "Salva": "保存",
  "Salva bozza": "保存草稿",
  "Salva una copia": "另存副本",
  "Salvato.": "已保存。",
  "Scala delle forme": "形状层级",
  "Scarica": "下载",
  "Scarica CSS": "下载 CSS",
  "Scarica JSON": "下载 JSON",
  "Scegli i filtri da applicare.": "选择要应用的筛选条件。",
  "Scegli un colore qualsiasi": "任选一种颜色",
  "Scegli una regione": "选择一个地区",
  "Scelta singola in un gruppo con navigazione da tastiera.":
    "在组内单选，支持键盘导航。",
  "Scelta singola su option e optgroup native, con menu Material, stato di errore e campo filled o outlined.":
    "基于原生 option 和 optgroup 的单选，带 Material 菜单、错误状态以及 filled 或 outlined 字段。",
  "Scheda di esempio": "示例卡片",
  "Schema colore": "配色方案",
  "Schiuma · superficie": "泡沫 · 表面",
  "Scoppio · accento": "破裂 · 强调",
  "Scorciatoia da tastiera": "键盘快捷键",
  "Scorrevoli": "可滚动",
  "Scorso": "已滚动",
  "Scrivi una città": "输入城市",
  "Se conosci M3, conosci già Bolle.": "懂 M3，就懂 Bolle。",
  "Secondary e tertiary accanto al seme (−30° e +30°).":
    "secondary 和 tertiary 紧挨种子色（−30° 和 +30°）。",
  "Secondary e tertiary sul lato opposto della ruota (+180°).":
    "secondary 和 tertiary 位于色轮另一侧（+180°）。",
  "Segmenti": "分段",
  "Segnaposto": "占位文字",
  "Selezionata": "已选中",
  "Selezionato": "已选中",
  "Selezione": "选择",
  "Selezione binaria con stato indeterminato, errore e testo di supporto.":
    "二元选择，支持不确定状态、错误和辅助文字。",
  "Selezione multipla": "多选",
  "Senza animazione": "无动画",
  "Separatore orizzontale o verticale, con inset e modalità decorativa.":
    "水平或垂直分隔线，支持内缩和装饰模式。",
  "Sequenza di slide con controlli, contatore e varianti hero, multi-browse e full-screen.":
    "幻灯片序列，带控件、计数器以及 hero、multi-browse 和 full-screen 变体。",
  "Set colore": "颜色组",
  "Settimana": "周",
  "Sezioni": "分区",
  "Sezioni della pagina": "页面分区",
  "Sfocatura dello sfondo": "背景模糊",
  "Sinistra": "左",
  "Snackbar · card": "Snackbar · Card",
  "Snackbar, FAB": "Snackbar、FAB",
  "Soffia la tua prima interfaccia.": "吹出你的第一个界面。",
  "Sola lettura": "只读",
  "Solo gli strati sospesi sono traslucidi: menu e azioni del FAB. Sotto c'è sempre una versione opaca di riserva, che si attiva se il browser non supporta backdrop-filter, sui dispositivi lenti e con prefers-reduced-transparency.":
    "只有浮层才是半透明的：Menu 和 FAB 操作。其下始终有一个不透明的备用版本，在浏览器不支持 backdrop-filter、设备性能较弱或启用 prefers-reduced-transparency 时生效。",
  "Solo grigi: il seme non conta.": "仅灰色：种子色不起作用。",
  "Solo punto": "仅圆点",
  "Sotto c'è Material 3, al completo. Sopra, tre regole applicate con coerenza a ogni componente.":
    "底层是完整的 Material 3。表层是三条规则，一致地应用于每个组件。",
  "Sottolineato": "下划线",
  "Sottotitolo": "副标题",
  "Spessore dell'anello pellicola": "虹彩薄膜环的粗细",
  "Sposta in…": "移动到…",
  "Staccato": "脱离",
  "Standard": "标准",
  "Stessi nomi dei componenti, stessi token di colore e tipografia. Il carattere passa da pochi token in più, che puoi regolare o spegnere.":
    "相同的组件名称，相同的颜色和字体令牌。个性来自少量额外令牌，你可以调整或关闭它们。",
  "Sticky": "Sticky",
  "Stile bottoni": "按钮样式",
  "Su dispositivi lenti si spengono sfocatura e filtro goccia.":
    "在性能较弱的设备上会关闭模糊和水滴滤镜。",
  "Successivo": "下一个",
  "Successivo: {name}": "下一个：{name}",
  "Suffisso": "后缀",
  "Suggerimenti": "建议",
  "Suggerimenti fra le città servite.": "可配送城市中的建议。",
  "Superfici": "表面",
  "Superficie": "表面",
  "Superficie per contenuto correlato, con media, orientamento e varianti di elevazione.":
    "承载相关内容的表面，支持媒体、方向和不同高度变体。",
  "Supporto e limiti": "支持与限制",
  "Tab primari o secondari, attivazione automatica o manuale, anche scorrevoli.":
    "主要或次要标签页，自动或手动激活，也可滚动。",
  "Tavolozza": "调色板",
  "Tema": "主题",
  "Tema chiaro": "浅色主题",
  "Tema e token": "主题与令牌",
  "Tema scuro": "深色主题",
  "Tema {name}": "{name} 主题",
  "Temi": "主题",
  "Template": "模板",
  "Testi ed etichette": "文字与标签",
  "Testo di aiuto su hover e focus, semplice o con contenuto ricco.":
    "悬停和聚焦时显示的帮助文字，简单或富文本内容。",
  "Testo di esempio per valutare carattere, interlinea e colore su una superficie reale.":
    "示例文字，用于在真实表面上评估字体、行高和颜色。",
  "Testo di supporto": "辅助文字",
  "Testo e controlli": "正文与控件",
  "Testo su Primary": "Primary 上的文字",
  "Testo · {font} · {size}px": "正文 · {font} · {size}px",
  "Tinte (Material)": "色调（Material）",
  "Tinte ruotate e giocose per tutti gli accenti.":
    "所有强调色都采用旋转后的活泼色调。",
  "Tipo": "类型",
  "Tipografia": "字体排版",
  "Titoli · {font}": "标题 · {font}",
  "Titolo": "标题",
  "Titolo di sezione": "分区标题",
  "Toggle": "切换",
  "Token": "令牌",
  "Token applicati": "已应用的令牌",
  "Token del componente": "组件令牌",
  "Token importati: {count} valori": "已导入令牌：{count} 个值",
  "Toni {name}": "{name} 色调",
  "Tre gesti che rendono una bolla una bolla.": "让气泡成为气泡的三个动作。",
  "Tre tinte equidistanti (+120° e +240°).": "三种等距色调（+120° 和 +240°）。",
  "Tre vincoli tengono insieme carattere e accessibilità.":
    "三条约束让个性与无障碍兼得。",
  "Tutta la card porta alla destinazione.": "整张卡片都通向目标页面。",
  "Tutti i componenti di M3. Con più aria dentro.":
    "M3 的全部组件，多了些空气感。",
  "Tutti i componenti →": "所有组件 →",
  "Un gradiente conico tenue ricavato dal colore seed: le quattro tinte ruotano attorno alla sua tonalità, così la pellicola segue il tema dinamico. Si usa con misura: anello di focus, stato selezionato, FAB. Una sola superficie iridescente per schermata, mai come sfondo.":
    "由种子色派生的柔和锥形渐变：四种色调围绕其色相旋转，因此虹彩薄膜会跟随动态主题。用得克制：焦点环、选中状态、FAB。每屏只有一个虹彩表面，绝不用作背景。",
  "Un'iridescenza che deriva dal tuo colore seed e compare solo dove conta: focus, selezione, l'azione principale.":
    "一层源自你种子色的虹彩，只出现在关键之处：焦点、选中、主要操作。",
  "Una dialog che galleggia": "会漂浮的 Dialog",
  "Una superficie dentro un'altra prende il raggio del contenitore meno il padding che il contenitore applica, con un minimo di 2px. Il contenitore lo pubblica in --bb-inset-radius e la superficie interna lo eredita: card dentro dialog, fogli o altre card, media nelle card, voci nei menu e campi nei picker.":
    "一个表面位于另一个表面内部时，采用容器圆角减去容器施加的内边距，且不小于 2px。容器把它发布到 --bb-inset-radius，内部表面继承该值：对话框、面板或另一张卡片中的卡片、卡片内的媒体、菜单项以及选择器内的字段。",
  "Usa": "使用",
  "Usa #RGB o #RRGGBB": "请使用 #RGB 或 #RRGGBB",
  "Usa modello": "使用模板",
  "Useremo questo indirizzo per le notifiche.": "我们将使用此地址发送通知。",
  "Uso": "用法",
  "Valore": "值",
  "Valore di {token}": "{token} 的值",
  "Valore di {token} in pixel": "{token} 的值（像素）",
  "Valore massimo (range)": "最大值（范围）",
  "Variante": "变体",
  "Ricerca": "搜索",
  "Varianti": "变体",
  "Velatura al 30% per il FAB": "FAB 的 30% 遮罩",
  "Verifica del contrasto": "对比度检查",
  "Verifica la resa da destra a sinistra con il pulsante {rtl} nella barra in alto.":
    "使用顶部栏中的 {rtl} 按钮检查从右到左的显示效果。",
  "Verticale": "垂直",
  "Vetro": "玻璃",
  "Viola": "紫罗兰",
  "Vista": "视图",
  "Volume": "音量",
  "bolle · Interfacce con tensione superficiale": "bolle · 有表面张力的界面",
  "bolle, presentazione": "bolle 演示",
  "contrasti dei ruoli tonali M3, focus sempre visibile.":
    "M3 色调角色的对比度，焦点始终可见。",
  "cresce del 5% e sfuma in {duration}": "放大 5% 并在 {duration} 内淡出",
  "default {value}": "默认 {value}",
  "le dialog oscillano di {distance} ogni {duration}":
    "Dialog 每 {duration} 浮动 {distance}",
  "nei pulsanti segmentati l'indicatore scorre come una goccia":
    "在分段按钮中，指示器像水滴一样滑动",
  "no": "否",
  "non dichiarato": "未声明",
  "prefers-reduced-motion spegne dondolio e scoppio.":
    "prefers-reduced-motion 会关闭摇摆和破裂效果。",
  "prima": "之前",
  "scala {scale} in {duration}": "在 {duration} 内缩放至 {scale}",
  "sfocature e trasparenze si disattivano su dispositivi lenti.":
    "在性能较弱的设备上会关闭模糊和透明效果。",
  "si gonfia dall'angolo a coda in {duration}": "在 {duration} 内从尾角处鼓起",
  "solo JS": "仅 JS",
  "sotto {min}:1": "低于 {min}:1",
  "sì": "是",
  "{changed} di {total} ruoli cambiati nell'ultima operazione: a sinistra il colore precedente.":
    "上次操作改变了 {total} 个角色中的 {changed} 个：左侧为之前的颜色。",
  "{compact} porta a tre quarti spaziature e dimensioni dei componenti.":
    "{compact} 会将组件的间距和尺寸缩小到四分之三。",
  "{name} · ispirata a Material 3, non affiliata a Google.":
    "{name} · 受 Material 3 启发，与 Google 无关联。",
  "{n} componenti": "{n} 个组件",
  "{n} proprietà": "{n} 个属性",
  "{region} (non disponibile)": "{region}（不可用）",
  "{total} ruoli. Dopo una generazione i ruoli cambiati mostrano il colore precedente accanto al nuovo.":
    "共 {total} 个角色。生成后，发生变化的角色会在新颜色旁显示之前的颜色。",
  "| Proprietà | Attributo | Tipo | Default | Riflessa |":
    "| 属性 | 特性 | 类型 | 默认值 | 反映 |",
  "Con {token} restano solo le dissolvenze: niente dondolio, scoppio né galleggiamento.":
    "启用 {token} 时只保留淡入淡出：没有摇摆、破裂或漂浮。",
  "ritorno con {token}": "通过 {token} 回弹",
  "Panoramica dei componenti": "组件概览",
  "Esporta": "导出",
  "Importa": "导入",
  "Trascina qui un file .json o .css": "将 .json 或 .css 文件拖到此处",
  "Scegli file": "选择文件",
  "Amministrazione": "行政管理",
  "Anagrafiche": "通讯录",
  "Articoli": "物料",
  "Attive": "进行中",
  "Cantieri edili": "建筑工地",
  "Chiuse": "已关闭",
  "Commesse": "工单",
  "Compressa": "已收起",
  "Cruscotto": "仪表盘",
  "Fatture": "发票",
  "Impianti elettrici e termici": "电气与供暖系统",
  "In attesa di avvio": "待启动",
  "Intestazione": "页眉",
  "Inventario": "盘点",
  "Le voci troppo lunghe finiscono con i puntini e mostrano il testo intero in un tooltip. Nella rail i gruppi si aprono in un menu accanto.":
    "过长的标签以省略号结尾，并在 tooltip 中显示全文。在 rail 中，分组会在旁边的菜单里打开。",
  "Magazzino": "仓库",
  "Manutenzione straordinaria": "特殊维护",
  "Manutenzioni": "维护",
  "Movimenti di carico e scarico": "出入库记录",
  "Navigazione di un'applicazione gestionale: albero fino a tre livelli, filtro, contatori, rail compatta e larghezza regolabile.":
    "管理类应用的导航：最多三级的树、筛选、计数、紧凑的 rail 和可调宽度。",
  "Programmate": "已计划",
  "Scadenzario pagamenti": "付款日程",
  "Storico interventi": "维修历史",
  "Aggiunta rapida": "快速添加",
  "Archivia la scheda": "归档卡片",
  "Board a colonne di schede: spostamento tra colonne e riordino, corsie, colonne comprimibili, limiti WIP segnalati e stato di carico, errore e board vuota.":
    "卡片列看板：跨列移动与排序、泳道、可折叠列、WIP 上限提示，以及加载、错误和空看板状态。",
  "Chiuso": "已关闭",
  "Collaudo": "验收",
  "Colonna": "列",
  "Colonne comprimibili": "可折叠列",
  "Corsie": "泳道",
  "Da assegnare": "待分配",
  "Duplica la scheda": "复制卡片",
  "In corso": "进行中",
  "Nuova commessa · da assegnare": "新工单 · 待分配",
  "Nuova scheda": "新卡片",
  "Ordina per scadenza": "按到期日排序",
  "Per passare in Chiuso l'avanzamento deve essere al 100%.":
    "进度达到 100% 才能移至已关闭。",
  "Programmato": "已计划",
  "Trascinamento": "拖拽",
  "Una commessa chiusa non si riapre dal kanban.":
    "已关闭的工单不能从看板重新打开。",
  "Una commessa già avanzata non torna in cantiere senza un verbale.":
    "已推进的工单没有书面记录不能退回施工。",
  "in ritardo": "逾期",
  "Altro": "更多",
  "Azioni della schermata": "屏幕操作",
  "Cancella i filtri": "清除筛选",
  "Con immagine": "带图片",
  "Contenitore in fondo alla schermata: azioni, uno spazio per il pulsante principale e una forma piana o staccata dal bordo.":
    "屏幕底部的容器：操作、主按钮的位置，以及与边缘齐平或分离的形态。",
  "Controllo delle pagine di un elenco che resta all'applicazione: intervallo, pagine numerate, frecce e righe per pagina.":
    "列表分页控件，数据仍归应用所有：范围、页码、箭头和每页行数。",
  "Indietro": "返回",
  "La barra non conosce l'applicazione: riceve le azioni negli slot e lascia al contenitore decidere cosa mostrare. Con dock il pulsante flottante esce dal bordo superiore e la barra resta un riferimento stabile mentre il contenuto scorre, se è sticky.":
    "该栏不感知应用：通过插槽接收操作，由容器决定显示什么。启用 dock 后浮动按钮突出上边缘；启用 sticky 后，内容滚动时该栏保持为稳定的参照。",
  "Le commesse archiviate non compaiono qui. Cambia i filtri o creane una nuova.":
    "已归档的工单不会显示在这里。请更改筛选条件或新建一个。",
  "Le iniziali si ricavano dal nome quando non sono date, e restano leggibili anche in una lingua senza spazi. Se l'immagine non si carica, l'avatar ricade sulle iniziali senza lasciare un riquadro vuoto. Lo slot icon sostituisce il contenuto e lo slot badge aggiunge un contatore.":
    "未提供缩写时由姓名推导，在无空格的语言中同样可读。图片加载失败时回退到缩写，不会留下空框。icon 插槽替换内容，badge 插槽添加计数。",
  "Linea superiore": "上边线",
  "Nessuna commessa da mostrare": "暂无可显示的工单",
  "Nuova commessa": "新建工单",
  "Pagina": "第",
  "Pagine": "页面",
  "Pulsante agganciato": "按钮挂载",
  "Righe in totale": "总行数",
  "Scelta delle righe": "行数选择",
  "Segno di identità di una persona o di un ente: immagine, iniziali o icona, con un indicatore di stato.":
    "个人或机构的身份标记：图片、缩写或图标，带状态指示。",
  "Superficie da mostrare quando un contenitore non ha nulla da disegnare: icona, titolo, una riga di testo e le azioni che ne escono.":
    "容器无内容可显示时使用的界面：图标、标题、一行说明以及离开该状态的操作。",
  "Testo": "文本",
  "Tono": "色调",
  "Un solo componente per il vuoto e per l'errore: il tono error colora l'icona con il ruolo d'errore e, con role alert, la regione viene annunciata appena compare. Con align start il testo e le azioni si allineano al bordo, come dentro una tabella.":
    "空状态与错误共用一个组件：error 色调用错误角色绘制图标，配合 role alert 在出现时立即播报。align start 让文本与操作靠边对齐，适合放入表格。",
  "righe": "行",
  "righe in totale": "行总计",
  "Componente": "组件",
  "Matrice degli stati": "状态矩阵",
  "Ogni cella riporta la proprietà pubblica che espone lo stato; il trattino indica che il componente non ha quello stato. {covered} componenti su {total} ne espongono almeno uno. Gli stati di interazione — hover, focus visibile e premuto — arrivano dal livello di stato condiviso di ogni superficie azionabile.":
    "每个单元格给出暴露该状态的公共属性；短横线表示该组件没有该状态。{covered}/{total} 个组件至少暴露一种状态。交互状态——悬停、可见焦点和按下——来自每个可操作表面共享的状态层。",
  "Filtro interno": "内置筛选",
  "Indicatore Morph con le bolle, con la sequenza di sette forme o dentro un contenitore.":
    "Morph 指示器：气泡形态、七形状序列或置于容器中。",
  "Avatar visibili": "可见头像",
  "Contatore premibile": "可点击计数",
  "Il gruppo dispone gli avatar che riceve e non conosce le persone: con max nasconde i successivi e somma nel contatore anche quelle non passate come avatar, dichiarate con total. Il contatore è una semplice somma, oppure un pulsante con interactive che chiede l'elenco completo con avatar-group-select. L'anello del colore di fondo stacca un avatar dal successivo.":
    "该组只排列收到的头像，并不了解人员：启用 max 后隐藏其余头像，并把通过 total 声明、未作为头像传入的人员计入计数。计数是纯文本，或在启用 interactive 时成为按钮，通过 avatar-group-select 请求完整列表。背景色描边让相邻头像彼此分离。",
  "Le briciole non navigano da sole: ricevono i livelli con href e segnalano con breadcrumb-select quello scelto, così l'applicazione decide se cambiare rotta. Con max-items il percorso mostra il primo livello, un pulsante con i puntini e gli ultimi livelli; il pulsante apre il percorso completo. Il separatore a chevron si specchia in una lingua da destra a sinistra.":
    "面包屑自身不导航：接收带 href 的层级，并通过 breadcrumb-select 报告所选层级，由应用决定是否切换路由。启用 max-items 时展示第一级、省略按钮和最后几级；按钮可展开完整路径。从右到左的语言中 chevron 分隔符会镜像。",
  "Livelli": "层级",
  "Livelli visibili": "可见层级",
  "Partecipanti": "参与者",
  "Percorso dalla radice dell'applicazione alla pagina aperta: livelli dell'applicazione, livello corrente non collegato, percorso lungo raccorciato.":
    "从应用根到当前页面的路径：层级由应用声明，当前层级不带链接，过长路径会缩短。",
  "Persone mostrate come avatar sovrapposti, con un contatore per quelle che non entrano nello spazio.":
    "以重叠头像展示人员，放不下的以计数表示。",
  "Persone totali": "人员总数",
  "Separatore": "分隔符",
  "Sopralluogo": "11 月 12 日的现场勘查",
  "Sovrapposizione": "重叠",
  "Verbali": "现场勘查记录",
  "Attività figlie": "子任务",
  "Chiudi il dettaglio": "关闭详情",
  "Consegna lavori": "工程交付",
  "Dipendenze": "依赖",
  "Durata": "工期",
  "Fase": "阶段",
  "Fine": "结束",
  "Giulia Ferraro": "Giulia Ferraro",
  "Inizio": "开始",
  "Non si sposta un'attività prima del": "任务不能移动到",
  "Pianificazione lavori": "工作计划",
  "Piano approvato": "已批准计划",
  "Predecessori": "前置任务",
  "Provincia di Brescia": "布雷西亚省",
  "Rifacimento impianto elettrico": "电气系统改造",
  "Scala": "刻度",
  "Una scadenza non cade di sabato o domenica.": "截止日期不能落在周六或周日。",
  "giorni": "天",
  "giorno": "日",
  "milestone": "里程碑",
  "nessuno": "无",
  "Piano a barre su un asse temporale: quattro scale, riepiloghi e milestone, dipendenze, piano approvato, carico per responsabile, colonne regolabili e modifica da puntatore o da tastiera.":
    "时间轴上的条形计划：四种刻度、汇总与里程碑、依赖关系、已批准计划、负责人负荷、可调列，并支持指针与键盘修改。",
  "Ordinamento e paginazione": "排序与分页",
  "Con page-size maggiore di zero la tabella pagina da sé le righe che ha già e mostra il pager. Con pageHandler la pagina richiesta arriva all'applicazione, che ricarica la fetta di righe e il totale.":
    "page-size 大于零时，表格自行分页其持有的行并显示分页器。使用 pageHandler 时，所需页码到达应用，由应用加载行片段与总数。",
  "Fissa l'ordine iniziale, con l'icona già accesa.":
    "设定初始顺序，表头图标即刻生效。",
  "La tabella ordina e pagina le righe che riceve: un clic sull'intestazione va prima crescente e poi decrescente, e page-size da solo accende il pager.":
    "表格对收到的行排序和分页：点击表头先升序再降序，仅 page-size 即可启用分页器。",
  "Ordina e pagina da sola: l'applicazione non taglia né riordina nulla.":
    "它自行排序和分页：应用既不切片也不重排。",
  "Riceve l'ordine richiesto e la tabella ridisegna dopo la promessa.":
    "接收所需顺序；表格在 Promise 完成后重绘。",
  "Riceve pagina e dimensione e la tabella ridisegna dopo la promessa.":
    "接收页码与每页行数；表格在 Promise 完成后重绘。",
  "Un clic sull'intestazione ordina da sola: prima crescente, poi decrescente. Con sortHandler la richiesta arriva all'applicazione, che ricarica le righe, e la tabella si ridisegna quando la promessa è risolta.":
    "点击表头即自行排序：先升序，再降序。使用 sortHandler 时请求到达应用，应用重新加载行，表格在 Promise 完成后重绘。",
  "fissa l'ordine iniziale": "设定初始顺序",
  "riceve l'ordine, la tabella ridisegna dopo la promessa":
    "接收顺序；表格在 Promise 完成后重绘",
  "riceve pagina e dimensione, la tabella ridisegna dopo la promessa":
    "接收页码与每页行数；表格在 Promise 完成后重绘",
  "Il componente chiama detail con la riga aperta e inserisce il risultato sotto di essa. La riga si apre e si chiude da sola: expand riporta solo quali righe sono aperte.":
    "组件用打开的行调用 detail，并把结果放在该行下方。行自行展开和收起：expand 只报告哪些行处于打开状态。",
  "La tabella applica selezione, apertura riga, raggruppamento e cambi di colonna da sé: gli eventi li riportano soltanto.":
    "表格自行应用选择、行展开、分组和列变更：事件只是报告这些变化。",
  "La tabella ordina e pagina le righe che riceve: un clic sull'intestazione va prima crescente e poi decrescente, e page-size da solo accende il pager. Selezione, apertura riga, raggruppamento e cambi di colonna li applica lei, e gli eventi li riportano. sortHandler, pageHandler e columnHandler servono solo quando i dati stanno altrove: ricevono la richiesta e la tabella ridisegna quando la promessa è risolta.":
    "表格对收到的行排序和分页：点击表头先升序再降序，仅 page-size 即可启用分页器。选择、行展开、分组和列变更由表格自行应用，事件只作报告。sortHandler、pageHandler 和 columnHandler 仅在数据位于别处时使用：它们接收请求，表格在 Promise 完成后重绘。",
  "Riceve l'elenco delle colonne dopo ogni modifica, per conservarlo altrove.":
    "每次修改后接收列清单，以便保存在别处。",
  "la tabella applica selezione, apertura riga, raggruppamento e cambi di colonna da sé: gli eventi li riportano soltanto":
    "表格自行应用选择、行展开、分组和列变更：事件只作报告",
  "pinned tiene la colonna ferma durante lo scorrimento orizzontale, width fissa la larghezza iniziale, hidden la nasconde, sortable a false toglie l'ordinamento. Fissare, nascondere, riordinare e ridimensionare lo fa la tabella: column-change riporta il nuovo elenco e columnHandler lo salva dove serve.":
    "pinned 在横向滚动时固定列，width 设定初始宽度，hidden 隐藏列，sortable false 取消排序。固定、隐藏、重排和调整宽度由表格完成：column-change 报告新的列清单，columnHandler 将其保存到需要的地方。",
  "riceve l'elenco delle colonne dopo ogni modifica, per conservarlo altrove":
    "每次修改后接收列清单，以便保存在别处",
  "selectable mostra la casella su ogni riga e nell'intestazione. La selezione la tiene la tabella: l'evento select riporta gli identificatori scelti e le righe corrispondenti, senza che l'applicazione debba riscriverli.":
    "selectable 在每行和表头显示复选框。选择由表格保存：select 事件报告所选标识符和对应行，应用无需回写。",
  "Il piano sposta l'attività da sé e riporta il cambio con task-change; il rifiuto arriva con task-change-blocked applicando la regola che l'applicazione passa in restrict, e l'apertura con task-open. Le righe sono virtualizzate, la colonna della griglia resta ferma in orizzontale e l'intestazione del tempo resta ferma in alto. L'altezza del host è obbligatoria.":
    "甘特图自行移动任务，并用 task-change 报告变化；拒绝通过 task-change-blocked 返回，并应用应用在 restrict 中传入的规则，打开通过 task-open 报告。行已虚拟化，网格列横向固定，时间表头纵向固定。宿主必须设定高度。",
  "La board sposta la scheda da sé e riporta il cambio con card-move; dove può andare lo decide la regola che l'applicazione passa in restrict, e il rifiuto arriva con card-move-blocked. Lo scorrimento verticale è della colonna, non della board; il trascinamento ha la copia che segue il puntatore, il segnaposto e lo scorrimento automatico ai bordi. La scheda si sposta anche con Alt e le frecce dalla maniglia.":
    "看板自行移动卡片，并用 card-move 报告变化；可去往何处由应用在 restrict 中传入的规则决定，拒绝通过 card-move-blocked 返回。纵向滚动属于列而不属于看板；拖拽包含跟随指针的副本、占位符以及边缘自动滚动。也可以用手柄配合 Alt 与方向键移动卡片。",
  "La paginazione si sposta da sé alla pagina richiesta e riporta il cambio con page-change: il totale lo riceve, i dati non li taglia. La finestra delle pagine numerate lascia sempre raggiungibili la prima e l'ultima, e sotto i 560px di spazio il numero della pagina prende il posto dell'elenco; con form compact restano intervallo e frecce.":
    "分页器自行移动到所需页码，并用 page-change 报告变化：它接收总数，从不切分数据。页码窗口保持首尾页可达，空间低于 560px 时由页码文字取代列表；form compact 保留范围与箭头。",
  "La tabella ordina e pagina da sé le righe che riceve, applica selezione, apertura riga, raggruppamento e cambi di colonna, e cede il caricamento all'applicazione solo quando le si passano sortHandler, pageHandler e columnHandler. L'intestazione resta ferma, le colonne fissate restano visibili mentre scorri e le righe si aprono con un dettaglio.":
    "表格自行对收到的行排序和分页，应用选择、行展开、分组和列变更，仅当传入 sortHandler、pageHandler 与 columnHandler 时才把加载交给应用。表头保持固定，滚动时固定列保持可见，行可展开查看详情。",
  "Piano minimo": "最简计划",
  "Il piano disegna le attività sull'asse del tempo: parent costruisce l'albero e una attività con figli diventa una barra di riepilogo. L'altezza del host è obbligatoria, perché la superficie riempie lo spazio che riceve.":
    "计划在时间轴上绘制任务：parent 构建层级，带子任务的任务显示为汇总条。宿主必须设定高度，因为该面板会填满收到的空间。",
  "Colonne e contenuto delle celle": "列与单元格内容",
  "columns sceglie le colonne della griglia: le chiavi note (code, name, resource, start, end, duration, progress, deps) hanno già il loro contenuto, una chiave nuova prende render e riceve l'attività. Le regole CSS del markup passano da contentStyles, perché gira dentro lo shadow root del piano.":
    "columns 决定网格的列：已知键（code、name、resource、start、end、duration、progress、deps）已有内容，新键使用 render 并接收任务。这些标记的 CSS 通过 contentStyles 传入，因为它们运行在计划的 shadow root 内。",
  "Spostare e ridimensionare": "移动与调整长度",
  "editable abilita il trascinamento, le maniglie ai lati e le frecce con Alt. restrict decide se lo spostamento è ammesso e il rifiuto arriva con task-change-blocked. Il piano applica lo spostamento da sé e lo riporta con task-change: qui lo si conserva.":
    "editable 启用拖拽、两侧手柄和 Alt 加方向键。restrict 决定移动是否可行，拒绝通过 task-change-blocked 返回。计划自行应用移动并用 task-change 报告：这里将其保存。",
  "Contenuto della barra": "条形内容",
  "barRenderer sostituisce quello che la barra mostra: riceve l'attività, il piano e l'intervallo calcolato, che per una attività con figli è il riepilogo dei discendenti. Serve per badge, percentuali e icone; le regole CSS vanno in contentStyles.":
    "barRenderer 替换条形显示的内容：它接收任务、计划以及计算出的区间，对于带子任务的任务该区间是其后代的汇总。适合徽章、百分比和图标；其 CSS 放在 contentStyles 中。",
  "Stati e slot": "状态与插槽",
  "loading, error ed empty prendono il posto delle righe. Gli slot loading, error ed empty li sostituiscono con il contenuto dell'applicazione: un pulsante che ricrea il piano, un comando di ricarica o un'azione per aggiungere la prima attività.":
    "loading、error 和 empty 取代行内容。loading、error 和 empty 插槽用应用内容替换它们：重建计划的按钮、重新加载的命令或添加首个任务的操作。",
  "Aggiunge azioni dentro lo stato vuoto predefinito.":
    "在默认空状态中添加操作。",
  "Aggiunge un'area sopra la tabella, fuori dal riquadro.":
    "在表格上方、框外添加一个区域。",
  "Area che riceve lo scorrimento verticale e orizzontale.":
    "接收纵向与横向滚动的区域。",
  "Area del riepilogo di gruppo.": "分组汇总区域。",
  "Area della paginazione.": "分页区域。",
  "Area espansa sotto la riga.": "行下方展开的区域。",
  "Cella dati.": "数据单元格。",
  "Contenitore esterno della tabella.": "表格的外层容器。",
  "Controllo separatore della larghezza colonna.": "列宽调整分隔控件。",
  "Il contenuto delle celle non passa dagli slot: il componente chiama column.render, rowRenderer, detail e groupSummary. Gli slot coprono le aree esterne alla tabella.":
    "单元格内容不经过插槽：组件调用 column.render、rowRenderer、detail 和 groupSummary。插槽覆盖表格之外的区域。",
  "Il contenuto delle righe non passa dagli slot: il componente chiama column.render per una cella e barRenderer per la barra, e groupLabel per il nome di un gruppo. Gli slot coprono gli stati, quando al posto delle righe non c'è nulla da mostrare.":
    "行内容不经过插槽：组件为单元格调用 column.render、为条形调用 barRenderer，为分组名称调用 groupLabel。插槽覆盖状态，即没有行可显示时。",
  "Intestazione della tabella.": "表格表头。",
  "Pulsante che attiva l'ordinamento.": "启用排序的按钮。",
  "Riga dati.": "数据行。",
  "Riga di raggruppamento.": "分组行。",
  "Riquadro dello stato di caricamento.": "加载状态框。",
  "Riquadro dello stato di errore.": "错误状态框。",
  "Riquadro dello stato vuoto.": "空状态框。",
  "Singola cella di intestazione.": "单个表头单元格。",
  "Sostituisce interamente lo stato vuoto.": "完全替换空状态。",
  "Sostituisce la paginazione predefinita.": "替换默认分页器。",
  "Sostituisce lo stato mostrato durante il caricamento iniziale.":
    "替换初始加载期间显示的状态。",
  "Sostituisce lo stato mostrato mentre loading è attivo.":
    "替换 loading 生效期间显示的状态。",
  "Sostituisce lo stato mostrato quando error contiene un messaggio.":
    "替换 error 含有消息时显示的状态。",
  "Sostituisce lo stato mostrato quando non ci sono attività.":
    "替换没有任务时显示的状态。",
  "Stato di caricamento.": "加载状态。",
  "Stato di errore.": "错误状态。",
  "Stato vuoto.": "空状态。",
  "Albero della navigazione.": "导航树。",
  "Area che riceve i comandi esterni.": "接收外部命令的区域。",
  "Area che riceve lo scorrimento.": "接收滚动的区域。",
  "Area dei risultati della ricerca.": "搜索结果区域。",
  "Area del calendario.": "日历区域。",
  "Area del carosello.": "轮播区域。",
  "Area del testo di supporto.": "辅助文本区域。",
  "Area di scrittura.": "输入区域。",
  "Area di stato dell'impalcatura.": "外壳的状态区域。",
  "Area di stato.": "状态区域。",
  "Area finale dell'elemento.": "元素的结尾区域。",
  "Area inferiore dell'impalcatura.": "外壳的下部区域。",
  "Area iniziale dell'elemento.": "元素的起始区域。",
  "Area sopra il contenuto, fuori dal riquadro.": "内容上方、框外的区域。",
  "Area sotto il contenuto.": "内容下方的区域。",
  "Avanzamento dell'attività.": "任务进度。",
  "Avatar mostrato accanto al testo.": "显示在文本旁的 avatar。",
  "Barra dei comandi.": "命令栏。",
  "Barra dell'applicazione.": "应用栏。",
  "Barra di navigazione.": "导航栏。",
  "Barra inferiore dell'impalcatura.": "外壳的底部栏。",
  "Barra stretta della navigazione.": "窄式导航栏。",
  "Barra stretta di navigazione.": "窄式导航栏。",
  "Barra superiore dell'impalcatura.": "外壳的顶部栏。",
  "Binario del cursore.": "滑块轨道。",
  "Binario su cui scorre l'indicatore.": "指示器滑动的轨道。",
  "Blocco del titolo e del sottotitolo.": "标题与副标题区块。",
  "Bolla visibile della superficie.": "面板的可见气泡。",
  "Campo dei minuti.": "分钟字段。",
  "Campo delle ore.": "小时字段。",
  "Campo di filtro.": "筛选字段。",
  "Campo di ricerca.": "搜索字段。",
  "Campo o comando che filtra il contenuto.": "用于筛选内容的字段或命令。",
  "Cella che contiene il dettaglio.": "承载详情的单元格。",
  "Cella dei comandi di riga.": "行命令单元格。",
  "Cella del comando di apertura.": "展开命令所在单元格。",
  "Cella della casella di selezione.": "选择框所在单元格。",
  "Cella di dati.": "数据单元格。",
  "Colonna della board.": "看板列。",
  "Comandi del pannello di supporto.": "辅助面板的命令。",
  "Comandi di avanzamento del contenuto.": "内容前进的命令。",
  "Comandi in coda all'area o sotto il contenuto.":
    "区域末尾或内容下方的命令。",
  "Comando associato al contenuto.": "与内容关联的命令。",
  "Comando che apre e chiude il gruppo.": "展开与收起分组的命令。",
  "Comando che apre il sottoelenco.": "展开子列表的命令。",
  "Comando che chiude la superficie.": "关闭面板的命令。",
  "Comando che chiude senza confermare.": "不确认直接关闭的命令。",
  "Comando che ferma l'operazione.": "停止操作的命令。",
  "Comando che toglie la pastiglia.": "移除标签的命令。",
  "Comando del periodo, mattina o pomeriggio.": "上下午切换命令。",
  "Comando di annullamento.": "取消命令。",
  "Comando di conferma.": "确认命令。",
  "Conteggio dell'elemento di navigazione.": "导航项计数。",
  "Conteggio mostrato accanto al testo.": "显示在文本旁的计数。",
  "Contenitore degli elementi.": "元素的容器。",
  "Contenitore dell'impalcatura.": "外壳容器。",
  "Contenitore della navigazione.": "导航容器。",
  "Contenitore interno del componente.": "组件内部容器。",
  "Contenuto centrale, quando il componente ne separa uno.":
    "组件单独区分的居中内容。",
  "Contenuto del comando che torna indietro.": "后退命令的内容。",
  "Contenuto del comando che va avanti.": "前进命令的内容。",
  "Contenuto del componente.": "组件内容。",
  "Contenuto del dettaglio.": "详情内容。",
  "Contenuto dell'area vuota predefinita.": "默认空区域的内容。",
  "Contenuto dell'elenco.": "列表内容。",
  "Contenuto della barra dei comandi.": "命令栏的内容。",
  "Contenuto dopo il campo di testo.": "文本字段之后的内容。",
  "Contenuto dopo il testo: icona o valore.": "文本之后的内容：图标或值。",
  "Contenuto dopo il valore.": "值之后的内容。",
  "Contenuto interno della riga.": "行的内部内容。",
  "Contenuto prima del campo di testo.": "文本字段之前的内容。",
  "Contenuto prima del testo: icona o avatar.":
    "文本之前的内容：图标或 avatar。",
  "Contenuto prima del valore.": "值之前的内容。",
  "Contenuto principale del componente.": "组件的主要内容。",
  "Contenuto scorrevole del corpo.": "主体的可滚动内容。",
  "Controllo nativo che riceve il clic.": "接收点击的原生控件。",
  "Corpo del componente, sotto l'intestazione.": "组件主体，位于头部之下。",
  "Corpo scorrevole della superficie.": "面板的可滚动主体。",
  "Corsia della board.": "看板的泳道。",
  "Cursore inferiore dell'intervallo.": "区间的下方滑块。",
  "Cursore superiore dell'intervallo.": "区间的上方滑块。",
  "Cursore.": "滑块。",
  "Destinazione della barra.": "栏的目标项。",
  "Destinazione della navigazione.": "导航目标项。",
  "Elemento che apre il menu o l'overlay.": "打开菜单或浮层的元素。",
  "Elemento che apre l'overlay.": "打开浮层的元素。",
  "Elemento della barra stretta.": "窄栏的元素。",
  "Elemento della destinazione.": "目标项的元素。",
  "Elenco dei passi.": "步骤列表。",
  "Elenco dei risultati.": "结果列表。",
  "Elenco dei suggerimenti.": "建议列表。",
  "Elenco delle destinazioni.": "目标项列表。",
  "Elenco delle schede.": "标签列表。",
  "Elenco interno del componente.": "组件的内部列表。",
  "Etichetta del controllo, collegata al campo.": "控件的标签，与字段关联。",
  "Etichetta del valore finale di un intervallo.": "区间终值的标签。",
  "Finestra visibile del contenuto.": "内容的可见窗口。",
  "Freccia che indica l'apertura.": "表示可展开的箭头。",
  "Freccia del gruppo.": "分组的箭头。",
  "Freccia dell'elemento di navigazione.": "导航项的箭头。",
  "Goccia che segue il cursore.": "跟随滑块的液滴。",
  "Griglia dei giorni.": "日期网格。",
  "Gruppo che tiene insieme gli elementi.": "把元素组合在一起的分组。",
  "Gruppo dei pulsanti flottanti.": "浮动按钮组。",
  "I passi leggono le voci dalle proprietà e prendono dallo slot label il testo del passo corrente, quando il nome non basta.":
    "步骤从属性读取项，名称不够时从 label 插槽取得当前步骤的文本。",
  "Icona che accompagna il contenuto.": "随内容显示的图标。",
  "Icona del componente.": "组件的图标。",
  "Icona dell'elemento di navigazione.": "导航项的图标。",
  "Icona dell'elemento stretto.": "窄栏元素的图标。",
  "Icona dell'elemento.": "元素的图标。",
  "Icona della destinazione.": "目标项的图标。",
  "Icona della scheda.": "标签的图标。",
  "Icona dello stato attivo.": "开启状态的图标。",
  "Icona dello stato inattivo.": "关闭状态的图标。",
  "Icona finale dell'elemento.": "元素的末尾图标。",
  "Il badge mostra un conteggio o una parola sopra un altro elemento e prende dallo slot label il testo, quando non vuoi passarlo come proprietà.":
    "徽章在其他元素上方显示计数或词语，当不以属性传入时从 label 插槽取得文本。",
  "Il campo con suggerimenti prende dagli slot gli stessi contenuti del campo di testo; l'elenco dei suggerimenti si apre da sé sopra il resto del contenuto.":
    "带建议的字段使用与文本字段相同的插槽内容；建议列表自行在其他内容之上打开。",
  "Il campo di testo prende dallo slot predefinito nulla del contenuto scritto, che resta nell'input, e dagli altri slot l'icona iniziale, il prefisso, il suffisso, il comando finale e il testo di supporto.":
    "文本字段不从默认插槽取得输入内容，因为内容留在 input 中；其他插槽提供起始图标、前缀、后缀、末尾命令和辅助文本。",
  "Il carosello scorre gli elementi che riceve nello slot predefinito e prende dagli slot i comandi di avanzamento, lo stato letto dai lettori di schermo e i controlli aggiuntivi.":
    "轮播在默认插槽中滚动传入的元素，并从插槽取得前进命令、屏幕阅读器读取的状态以及额外控件。",
  "Il contenuto della navigazione non passa dagli slot: il componente legge items, groups e actions e chiama item e railItem per il contenuto di una voce. Gli slot coprono l'intestazione, il filtro, il piè di pagina e lo stato vuoto.":
    "导航内容不经过插槽：组件读取 items、groups 和 actions，并调用 item 与 railItem 生成条目内容。插槽覆盖头部、筛选、页脚和空状态。",
  "Il contenuto di una scheda non passa dagli slot: il componente legge columns e cards e chiama card per il contenuto della scheda. Gli slot coprono gli stati, quando al posto della board non c'è nulla da mostrare.":
    "卡片内容不经过插槽：组件读取 columns 与 cards，并调用 card 生成卡片内容。插槽覆盖状态，即没有看板可显示时。",
  "Il controllo a segmenti legge le voci dalle proprietà e non ha slot: label resta la legenda del gruppo, e con multiple la scelta ammette più segmenti.":
    "分段控件从属性读取项，没有插槽：label 仍是分组的图例，multiple 允许选择多个分段。",
  "Il cursore prende dagli slot l'icona alle due estremità, l'etichetta e il valore mostrato; con range mostra due cursori e riporta entrambi i valori.":
    "滑块从插槽取得两端图标、标签和显示值；使用 range 时显示两个滑块并同时报告两个值。",
  "Il dialogo prende dallo slot predefinito il contenuto e dagli altri due il titolo letto come intestazione e la riga dei comandi; con modal blocca la pagina, con fullscreen la occupa.":
    "对话框从默认插槽取得内容，另外两个插槽提供作为标题的文本和命令行；modal 阻塞页面，fullscreen 占满页面。",
  "Il foglio dal basso prende dallo slot predefinito il contenuto, dallo slot heading il titolo e da actions i comandi; drag-handle mostra la presa che lo trascina.":
    "底部面板从默认插槽取得内容，heading 插槽提供标题，actions 提供命令；drag-handle 显示拖动它的手柄。",
  "Il foglio laterale prende dallo slot predefinito il contenuto, da heading il titolo e da actions i comandi; entra dal lato indicato da placement e modal lo rende bloccante.":
    "侧面板从默认插槽取得内容，heading 提供标题，actions 提供命令；它从 placement 指定的方向进入，modal 使其阻塞页面。",
  "Il gruppo impila gli avatar che riceve e riassume i restanti in un conteggio: lo slot predefinito riceve i bolle-avatar, e l'ordine è quello in cui li scrivi.":
    "分组堆叠接收的 avatar，并把其余数量汇总为计数：默认插槽接收 bolle-avatar，顺序与书写顺序一致。",
  "Il gruppo tiene insieme pulsanti adiacenti e prende dallo slot predefinito i pulsanti da unire, nell'ordine in cui li scrivi.":
    "分组把相邻按钮连在一起，默认插槽接收要合并的按钮，顺序与书写顺序一致。",
  "Il menu dei pulsanti flottanti legge le azioni dalle proprietà e prende dallo slot icon il simbolo del pulsante che lo apre.":
    "浮动按钮菜单从属性读取操作，并从 icon 插槽取得打开它的按钮符号。",
  "Il menu si apre con show(anchor) e legge le voci dalle proprietà, non dagli slot: ogni voce porta testo, icona, scorciatoia e sotto-menu.":
    "菜单用 show(anchor) 打开，并从属性读取条目而非插槽：每条包含文本、图标、快捷键和子菜单。",
  "Il messaggio si mostra con show() e prende dagli slot il testo, l'azione che lo accompagna e il comando che lo chiude; la proprietà message resta la scorciatoia per il solo testo.":
    "消息用 show() 显示，并从插槽取得文本、附带操作和关闭命令；message 属性仍是仅传文本的简写。",
  "Il pannello di navigazione prende dallo slot predefinito le voci, da heading il titolo e da actions i comandi in coda, e si apre in linea o sovrapposto alla pagina.":
    "导航面板从默认插槽取得条目，heading 提供标题，actions 提供尾随命令，可以内联或覆盖页面打开。",
  "Il pulsante a icona prende dallo slot predefinito il simbolo e da icon la variante grafica; label resta obbligatoria perché è il nome letto dai lettori di schermo.":
    "图标按钮从默认插槽取得符号，icon 插槽提供图形变体；label 仍然必需，因为它是屏幕阅读器读取的名称。",
  "Il pulsante di opzione prende dallo slot predefinito il testo e si raggruppa per name: scegliere una voce toglie la scelta alle altre dello stesso gruppo.":
    "单选按钮从默认插槽取得文本，并按 name 分组：选择一项会清除同组其他项的选择。",
  "Il pulsante diviso separa l'azione principale dal menu: lo slot predefinito riceve il testo del pulsante, icon l'icona e il menu si apre dal comando a fianco.":
    "分体按钮把主要操作与菜单分开：默认插槽接收按钮文本，icon 提供图标，菜单从旁边的命令打开。",
  "Il pulsante flottante esteso mostra icona e testo insieme: lo slot predefinito riceve il testo e lo slot icon il simbolo.":
    "扩展浮动按钮同时显示图标与文本：默认插槽接收文本，icon 插槽接收符号。",
  "Il pulsante flottante prende dallo slot predefinito il testo, che con size regular resta nascosto, e da icon il simbolo; extended aggiunge l'etichetta accanto all'icona.":
    "浮动按钮从默认插槽取得文本（size 为 regular 时隐藏），从 icon 取得符号；extended 在图标旁加标签。",
  "Il pulsante prende dallo slot predefinito il testo e dagli altri due l'icona iniziale e quella finale; la variante decide se il contenuto è testo, icona o entrambi.":
    "按钮从默认插槽取得文本，另外两个插槽提供起始与末尾图标；变体决定内容是文本、图标还是两者。",
  "Il selettore di data prende dagli slot il titolo del pannello e il testo di supporto del campo; end-label nomina il valore finale quando selection-mode è range.":
    "日期选择器从插槽取得面板标题和字段的辅助文本；当 selection-mode 为 range 时，end-label 命名终值。",
  "Il selettore di orario prende dagli slot il titolo del quadrante e il testo di supporto del campo; con format a ventiquattro ore sparisce il periodo.":
    "时间选择器从插槽取得表盘标题和字段的辅助文本；使用二十四小时制时不再显示上下午。",
  "Il separatore non ha slot: disegna una linea fra due gruppi di contenuto, con inset per staccarla dai bordi e vertical per separare elementi affiancati.":
    "分隔线没有插槽：它在两组内容之间画一条线，inset 使其与边缘分开，vertical 用于分隔并排元素。",
  "Il suggerimento si aggancia a un elemento con show(anchor) e prende dallo slot predefinito il contenuto; gli altri slot coprono etichetta, testo di supporto, comandi e il comando di chiusura delle varianti ricche.":
    "提示气泡通过 show(anchor) 附着到元素，并从默认插槽取得内容；其他插槽提供标签、辅助文本、命令以及丰富变体的关闭命令。",
  "Immagine o contenuto grafico della superficie.": "面板的图像或图形内容。",
  "Indicatore circolare.": "环形指示器。",
  "Indicatore dell'elemento attivo.": "活动项的指示器。",
  "Indicatore della destinazione attiva.": "活动目标项的指示器。",
  "Indicatore dello stato o della posizione.": "状态或位置的指示器。",
  "Indicatore lineare.": "线性指示器。",
  "Intervallo scelto.": "所选区间。",
  "Intestazione del calendario.": "日历的表头。",
  "Intestazione del componente.": "组件的表头。",
  "Intestazione del pannello di supporto.": "辅助面板的表头。",
  "Intestazione della colonna.": "列的表头。",
  "Intestazione della corsia.": "泳道的表头。",
  "Intestazione della scheda.": "卡片的表头。",
  "Intestazione della superficie.": "面板的表头。",
  "Intestazione fornita dall'applicazione.": "由应用提供的表头。",
  "L'avatar mostra iniziali o un'immagine e prende dallo slot icon il simbolo che sostituisce le iniziali, per esempio quando l'immagine non è disponibile.":
    "头像显示首字母或图片，并从 icon 插槽取得替代首字母的符号，例如图片不可用时。",
  "L'elenco prende dallo slot predefinito le righe, scritte come bolle-list-item, e le compone con icona, testo, supporto e coda; itemRenderer sostituisce l'intera riga.":
    "列表从默认插槽取得行，以 bolle-list-item 书写，并组合图标、文本、辅助内容和尾部内容；itemRenderer 替换整行。",
  "L'impalcatura compone le superfici intorno al contenuto: la navigazione, la barra, quella inferiore e il pannello di supporto arrivano dagli slot, e il contenuto principale è lo slot predefinito.":
    "外壳在内容周围组合各个面板：导航、栏、底部栏和辅助面板来自插槽，主要内容位于默认插槽。",
  "L'indicatore di avanzamento non ha slot: riceve value, min, max e label e disegna la forma lineare o circolare; con indeterminate segnala un'attesa senza valore.":
    "进度指示器没有插槽：接收 value、min、max 和 label，绘制线性或环形；indeterminate 表示无数值的等待。",
  "L'indicatore di caricamento non ha slot: mostra un'animazione con la label accessibile che gli passi, e contained lo appoggia su una superficie.":
    "加载指示器没有插槽：用传入的可访问标签显示动画，contained 使其放置在面板上。",
  "L'interruttore prende dallo slot predefinito il testo dell'etichetta e cambia stato da sé, riportando il valore con l'evento change.":
    "开关从默认插槽取得标签文本，并自行切换状态，通过 change 事件报告值。",
  "La barra dei comandi dispone gli elementi che riceve nello slot predefinito, e con variabili può portare a capo i comandi in eccesso invece di comprimerli.":
    "命令栏把默认插槽收到的元素排成一行，并可将多余命令换行而不是压缩。",
  "La barra dell'applicazione prende dal titolo il testo principale e dagli slot i comandi iniziali e finali; lo slot predefinito sostituisce il titolo quando serve un'intestazione più ricca.":
    "应用栏从 title 取得主文本，从插槽取得起始与末尾命令；需要更丰富的标题时用默认插槽替换 title。",
  "La barra di navigazione legge le destinazioni dalle proprietà, non dagli slot: ogni destinazione porta icona, testo e indicatore di attività.":
    "导航栏从属性读取目标项，而非插槽：每个目标项包含图标、文本和活动指示器。",
  "La barra inferiore tiene i comandi in linea e il pulsante flottante: lo slot predefinito riceve i comandi, gli altri slot l'elemento iniziale, quello finale e il pulsante flottante.":
    "底部栏容纳行内命令和浮动按钮：默认插槽接收命令，其他插槽提供起始元素、末尾元素和浮动按钮。",
  "La barra stretta legge le destinazioni dalle proprietà: con expanded mostra anche i testi, altrimenti resta alle icone con il suggerimento.":
    "窄栏从属性读取目标项：expanded 时同时显示文本，否则只显示图标与提示。",
  "La casella prende dallo slot predefinito il testo dell'etichetta e si collega al campo con name, value e checked; indeterminate mostra lo stato misto.":
    "复选框从默认插槽取得标签文本，并通过 name、value 和 checked 与表单关联；indeterminate 显示混合状态。",
  "La dashboard dispone i riquadri che le passi e non impone contenuti: ogni riquadro è un bolle-widget nello slot predefinito, con intestazione, corpo, comandi e maniglia di ridimensionamento già forniti dal widget.":
    "仪表盘排列传入的瓦片，不限定内容：每个瓦片都是默认插槽中的 bolle-widget，其表头、主体、命令和调整手柄由 widget 提供。",
  "La paginazione non ha slot: mostra l'intervallo, le frecce e le pagine numerate, e si sposta alla pagina richiesta riportandola con page-change.":
    "分页器没有插槽：显示范围、箭头和编号页码，并移动到所需页码，通过 page-change 报告。",
  "La pastiglia prende dallo slot predefinito il testo e dagli altri un'icona o un avatar; removable aggiunge il comando che la toglie.":
    "标签从默认插槽取得文本，其他插槽提供图标或 avatar；removable 增加移除它的命令。",
  "La ricerca prende dagli slot il contenuto del campo e dei risultati: results riceve l'elenco che compare sotto la barra, il resto segue le regole del campo di testo.":
    "搜索从插槽取得字段与结果的内容：results 接收显示在栏下的列表，其余遵循文本字段规则。",
  "La scheda prende dallo slot predefinito il contenuto e dagli altri slot l'immagine di testa e la riga di comandi: media occupa la larghezza, content resta la scorciatoia per il solo blocco interno.":
    "卡片从默认插槽取得内容，其他插槽提供顶部图像和命令行：media 占满宽度，content 仍是仅内部区块的简写。",
  "La select avvolge un elemento select nativo: le opzioni restano nel markup, e lo slot supporting porta il testo che spiega la scelta.":
    "select 包装原生 select 元素：选项留在标记中，supporting 插槽提供解释选择的文本。",
  "Le briciole arrivano da items, non dagli slot: il componente disegna il percorso, separa le voci e rende l'ultima come pagina corrente.":
    "面包屑来自 items 而非插槽：组件绘制路径、分隔条目，并将最后一项作为当前页面。",
  "Le schede leggono le voci dalle proprietà e prendono dallo slot predefinito i pannelli: ogni pannello dichiara con slot il nome della scheda che lo apre.":
    "标签从属性读取条目，从默认插槽取得面板：每个面板通过 slot 声明打开它的标签。",
  "Linea di separazione.": "分隔线。",
  "Lo stato vuoto centra un'icona, un titolo e un testo, e prende dallo slot actions il comando che fa uscire dallo stato vuoto.":
    "空状态居中显示图标、标题和文本，并从 actions 插槽取得离开空状态的命令。",
  "Maniglia che ridimensiona il pannello.": "调整面板大小用的手柄。",
  "Marchio in cima alla navigazione.": "导航顶部的品牌标识。",
  "Membrana della superficie.": "面板的薄膜。",
  "Menu dell'overlay.": "浮层的菜单。",
  "Messaggio testuale della superficie.": "面板的文本消息。",
  "Modulo della ricerca.": "搜索表单。",
  "Navigazione principale dell'impalcatura.": "外壳的主导航。",
  "Navigazione ridotta a icona.": "缩减为图标的导航。",
  "Nome del giorno della settimana.": "星期的名称。",
  "Numero di righe del gruppo.": "分组的行数。",
  "Numero di schede della colonna.": "列的卡片数量。",
  "Onda dell'indicatore.": "指示器的波纹。",
  "Pannello che entra dal bordo.": "从边缘进入的面板。",
  "Pannello della scheda attiva.": "活动标签的面板。",
  "Piè di pagina del componente.": "组件的页脚。",
  "Ponte che collega i due cursori.": "连接两个滑块的桥。",
  "Presa che avvia il trascinamento della scheda.": "开始拖动卡片的手柄。",
  "Presa che avvia il trascinamento.": "开始拖动的手柄。",
  "Presa del cursore.": "滑块手柄。",
  "Pulsante del giorno.": "日期按钮。",
  "Pulsante flottante agganciato all'angolo.": "固定在角落的浮动按钮。",
  "Pulsante interno del componente.": "组件的内部按钮。",
  "Punto del passo.": "步骤圆点。",
  "Quadrante dell'ora.": "小时表盘。",
  "Ramo dell'albero di navigazione.": "导航树的分支。",
  "Riepilogo del gruppo.": "分组汇总。",
  "Riga dei comandi.": "命令行。",
  "Riga del dettaglio aperto.": "已展开详情的行。",
  "Riga della tabella o dell'elenco.": "表格或列表的行。",
  "Riga di dati della scheda.": "卡片的数据行。",
  "Riga scelta.": "被选中的行。",
  "Riga visibile dell'elemento.": "元素的可见行。",
  "Riquadro del campo.": "字段框。",
  "Riquadro del dialogo.": "对话框框体。",
  "Riquadro del riquadro della dashboard.": "仪表盘的瓦片。",
  "Scheda interna del componente.": "组件的内部卡片。",
  "Segnalazione dell'elemento.": "元素的标记。",
  "Segnalazione della scheda.": "标签的标记。",
  "Segnalazione sovrapposta, come un conteggio.": "叠加标记，例如计数。",
  "Segnalazione sovrapposta.": "叠加标记。",
  "Selettore della modalità.": "模式选择器。",
  "Singola riga dell'elenco.": "列表的单行。",
  "Singola scheda della barra.": "栏中的单个标签。",
  "Singola voce dell'elenco.": "列表的单个条目。",
  "Singolo elemento dell'elenco.": "列表的单个元素。",
  "Singolo giorno.": "单日。",
  "Singolo passo.": "单个步骤。",
  "Singolo segmento del controllo.": "控件的单个分段。",
  "Singolo suggerimento.": "单条建议。",
  "Sostituisce lo stato mostrato durante il caricamento.":
    "替换加载期间显示的状态。",
  "Sostituisce lo stato mostrato quando non ci sono dati.":
    "替换没有数据时显示的状态。",
  "Sottoelenco dell'elemento.": "元素的子列表。",
  "Sottotitolo della superficie.": "面板的副标题。",
  "Superficie del campo, su cui si disegna il contorno.":
    "字段的面板，用于绘制轮廓。",
  "Superficie del messaggio.": "消息的面板。",
  "Superficie del suggerimento.": "提示气泡的面板。",
  "Superficie della board.": "看板的面板。",
  "Superficie della pastiglia.": "标签的面板。",
  "Superficie visibile della bolla o del pannello.": "气泡或面板的可见表面。",
  "Supporto in linea, accanto al contenuto.": "与内容并排的行内支持。",
  "Supporto sovrapposto al contenuto.": "覆盖在内容上的支持。",
  "Testo del segmento.": "分段的文本。",
  "Testo dell'elemento di navigazione.": "导航项的文本。",
  "Testo dell'elemento stretto.": "窄栏元素的文本。",
  "Testo dell'etichetta.": "标签的文本。",
  "Testo della destinazione.": "目标项的文本。",
  "Testo della pastiglia.": "标签的文本。",
  "Testo della scheda.": "标签的文本。",
  "Testo della segnalazione.": "标记的文本。",
  "Testo di supporto sotto il contenuto principale.": "主内容下方的辅助文本。",
  "Testo mostrato quando il campo è vuoto.": "字段为空时显示的文本。",
  "Testo principale dell'elemento.": "元素的主要文本。",
  "Testo scritto dentro l'etichetta.": "写在标签内的文本。",
  "Testo secondario dell'elemento.": "元素的次要文本。",
  "Testo secondario sotto il contenuto.": "内容下方的次要文本。",
  "Titolo del gruppo.": "分组的标题。",
  "Titolo dell'area, letto come intestazione.": "区域的标题，作为表头读取。",
  "Titolo della colonna.": "列的标题。",
  "Titolo della superficie.": "面板的标题。",
  "Titolo principale della superficie.": "面板的主标题。",
  "Traccia che tiene i segmenti.": "容纳分段的轨道。",
  "Valore mostrato accanto all'etichetta.": "显示在标签旁的值。",
  "Valore numerico o testuale.": "数值或文本值。",
  "Valore sul quadrante.": "表盘上的值。",
  "Velo mostrato durante un aggiornamento.": "更新期间显示的遮罩。",
  "Contenuto del pannello della scheda con questo identificatore.":
    "该标识符对应标签面板的内容。",
  "Albero di navigazione": "导航树",
  "Avanzamento lineare e circolare": "线性与环形进度",
  "Avatar con icona al posto delle iniziali": "用图标代替首字母的头像",
  "Avatar con immagine o iniziali": "带头像图片或首字母的 avatar",
  "Azione principale e menu": "主要操作与菜单",
  "Azioni rapide": "快捷操作",
  "Barra che si comprime allo scorrimento": "滚动时收起的栏",
  "Barra dell'applicazione": "应用栏",
  "Barra di comandi": "命令栏",
  "Barra di navigazione": "导航栏",
  "Barra di ricerca con risultati": "带结果的搜索栏",
  "Barra inferiore con pulsante flottante": "带浮动按钮的底部栏",
  "Barra stretta": "窄栏",
  "Board minima": "最简看板",
  "Bolla del conteggio interattiva": "可交互的计数气泡",
  "Campo con prefisso e supporto": "带前缀与辅助文本的字段",
  "Campo con suggerimenti": "带建议的字段",
  "Campo in errore": "错误状态的字段",
  "Campo multiriga": "多行字段",
  "Carosello di schede": "卡片轮播",
  "Casella che governa un elenco": "控制列表的复选框",
  "Casella con testo e supporto": "带文本与辅助说明的复选框",
  "Con appearance contained e layout inline la ricerca sta dentro una barra e non occupa tutta la larghezza: la variante divided la stacca con una linea dal contenuto che segue.":
    "使用 appearance contained 与 layout inline 时，搜索位于栏内，不占满宽度：divided 变体用一条线与后面的内容分开。",
  "Con interactive la bolla che nasconde i restanti diventa un comando: il clic arriva con avatar-group-select e il conteggio dice quante persone restano fuori.":
    "使用 interactive 时，隐藏其余项的气泡成为命令：点击通过 avatar-group-select 到达，计数表示还有多少人未显示。",
  "Con multiple il controllo tiene più segmenti accesi e restituisce values. È la forma giusta per i filtri rapidi, dove più criteri restano attivi insieme.":
    "使用 multiple 时，控件可同时点亮多个分段并返回 values。适合快速筛选，多个条件同时生效。",
  "Con range il cursore mostra due maniglie e riporta value e upperValue: è la forma giusta per un filtro fra due importi o due date.":
    "使用 range 时，滑块显示两个手柄并返回 value 与 upperValue：适合金额或日期区间筛选。",
  "Con scrollable le schede in eccesso scorrono in orizzontale invece di comprimersi: è la forma per un numero variabile di schede, quando i nomi sono lunghi.":
    "使用 scrollable 时，多余的标签横向滚动而不是被压缩：适合标签数量不固定且名称较长的场景。",
  "Con search la sidebar mette sopra le voci il campo che le filtra; count mostra il contatore di una voce e collapsed riduce tutta la navigazione a icona, con il testo nel suggerimento.":
    "使用 search 时，侧栏在条目上方放置筛选字段；count 显示条目计数，collapsed 将整个导航缩为图标，文本放入提示。",
  "Con selection-mode range il calendario prende due date e le riporta in value e end-value; lo slot end-label nomina il secondo campo e week-starts-on sceglie il primo giorno della settimana.":
    "使用 selection-mode range 时，日历取两个日期并在 value 与 end-value 中返回；end-label 插槽命名第二个字段，week-starts-on 设定一周的第一天。",
  "Con toggle il pulsante mantiene lo stato premuto e lo riporta con selected, per i comandi che accendono qualcosa come il grassetto di un editor.":
    "使用 toggle 时，按钮保持按下状态并通过 selected 返回，适用于开关某功能的命令，例如编辑器的加粗。",
  "Contenuto della scheda": "卡片内容",
  "Contenuto di una voce": "条目内容",
  "Cursore singolo": "单个滑块",
  "Dialogo a tutto schermo": "全屏对话框",
  "Dialogo di conferma": "确认对话框",
  "Elenco con icone e dettaglio": "带图标与详情的列表",
  "Elenco da un array": "由数组生成的列表",
  "Foglio dal basso": "底部面板",
  "Griglia di riquadri": "瓦片网格",
  "Gruppo di avatar": "头像组",
  "Gruppo di opzioni": "选项组",
  "I pulsanti di opzione si raggruppano per name: scegliere una voce toglie la scelta alle altre dello stesso gruppo, e il valore arriva con change.":
    "单选按钮按 name 分组：选择一项会清除同组其他项的选择，值通过 change 返回。",
  "I segmenti arrivano da items e la scelta da value: il controllo la applica da sé e la riporta con change. multiple ammette più segmenti e restituisce values.":
    "分段来自 items，选择来自 value：控件自行应用并通过 change 报告。multiple 允许多个分段并返回 values。",
  "Icona personalizzata e allineamento": "自定义图标与对齐",
  "Il badge mostra value sopra l'elemento che lo contiene e comprime il numero oltre max in «999+». small toglie il testo e lascia il punto, per una segnalazione senza numero.":
    "徽章在包含它的元素上方显示 value，超过 max 的数字显示为“999+”。small 去掉文本只留圆点，用于无数值的标记。",
  "Il campo prende dagli slot il prefisso, il suffisso e il testo di supporto, mentre il valore resta nell'input e arriva con input e change. variant filled o outlined cambia la forma del riquadro.":
    "字段从插槽取得前缀、后缀和辅助文本，值留在 input 中并通过 input 与 change 返回。variant filled 或 outlined 改变框的样式。",
  "Il carosello scorre gli elementi dello slot predefinito e mostra i comandi avanti e indietro: index dice quale è visibile e la scelta arriva con change. Lo scorrimento è a passi, con il tocco e la tastiera.":
    "轮播在默认插槽中滚动元素并显示前进后退命令：index 表示当前可见项，选择变化通过 change 返回。滚动按步进行，支持触摸与键盘。",
  "Il cursore mostra il valore sull'etichetta e lo riporta con input durante il trascinamento e con change alla fine. min e max fissano l'intervallo, step la granularità.":
    "滑块在标签上显示值，拖动时通过 input 返回，结束时通过 change 返回。min 与 max 设定范围，step 设定步长。",
  "Il foglio entra dal bordo inferiore e porta con sé i comandi: drag-handle mostra la presa che lo trascina, heading il titolo, actions la riga finale. open e show() lo aprono.":
    "面板从底边进入并带上命令：drag-handle 显示拖动它的手柄，heading 提供标题，actions 提供末行。open 与 show() 打开它。",
  "Il gruppo impila gli avatar che riceve e riassume i restanti in una bolla con il conteggio: max decide quanti mostrarne, total dice quanti sono in tutto quando non li passi tutti.":
    "分组堆叠接收的 avatar，并用带计数的气泡汇总其余：max 决定显示多少个，total 在未全部传入时说明总数。",
  "Il gruppo unisce pulsanti adiacenti: variant connected toglie lo spazio e condivide i bordi, selection single trasforma il gruppo in una scelta unica e riporta il valore con change.":
    "分组连接相邻按钮：variant connected 去掉间距并共边，selection single 使分组成为单选并通过 change 返回值。",
  "Il menu dei pulsanti flottanti apre le azioni secondarie dal pulsante principale: items dichiara le voci, open dice se è aperto e la scelta arriva con menu-select.":
    "浮动按钮菜单从主按钮展开次要操作：items 声明条目，open 表示是否展开，选择通过 menu-select 返回。",
  "Il pannello apre le voci in verticale e può stare in linea accanto al contenuto o sovrapposto alla pagina: placement start o end sceglie il lato, modal lo rende bloccante.":
    "面板纵向展开条目，可内联在内容旁或覆盖页面：placement start 或 end 选择方向，modal 使其阻塞。",
  "Il pannello entra dal lato indicato da placement e lascia visibile il contenuto: è la forma giusta per il dettaglio di una riga, con heading per il titolo e actions per i comandi in coda.":
    "面板从 placement 指定的一侧进入并保留内容可见：适合行详情，heading 提供标题，actions 提供尾随命令。",
  "Il pulsante diviso tiene l'azione principale a sinistra e apre il menu dal comando a fianco: le voci arrivano da items e la scelta con menu-select, mentre il clic sull'azione principale arriva con click.":
    "分体按钮左侧保持主要操作，菜单从旁边的命令展开：条目来自 items，选择通过 menu-select 返回，主要操作的点击通过 click 返回。",
  "Il pulsante flottante resta ancorato all'angolo del contenitore e mostra il solo simbolo: label è il nome accessibile e va sempre dichiarata. size regular resta tondo, extended aggiunge il testo.":
    "浮动按钮固定在容器角落，仅显示符号：label 是可访问名称，必须声明。size regular 保持圆形，extended 增加文本。",
  "Il selettore apre il calendario dal campo: il valore scelto arriva con change nel formato ISO, e locale decide lingua e nomi dei giorni. selection-mode range aggiunge la seconda data in end-value.":
    "选择器从字段打开日历：所选值以 ISO 格式通过 change 返回，locale 决定语言与星期名称。selection-mode range 在 end-value 中增加第二个日期。",
  "Il selettore apre il quadrante dell'ora dal campo: il valore scelto arriva con change, hour-cycle decide il formato a dodici o ventiquattro ore e lo slot title nomina il quadrante.":
    "选择器从字段打开小时表盘：所选值通过 change 返回，hour-cycle 决定十二或二十四小时制，title 插槽命名表盘。",
  "Il separatore non ha contenuto: divide due gruppi di elementi, con inset per staccarlo dai bordi e vertical per separare comandi affiancati.":
    "分隔线没有内容：分隔两组元素，inset 使其与边缘分开，vertical 用于分隔并排命令。",
  "Il suggerimento si aggancia a un elemento con show(anchor) e si chiude da sé quando il puntatore esce o arriva Esc. label è il testo breve, supporting-text aggiunge la riga di dettaglio.":
    "提示气泡通过 show(anchor) 附着到元素，指针离开或按下 Esc 时自行关闭。label 是简短文本，supporting-text 增加详情行。",
  "Impalcatura completa": "完整外壳",
  "Indicatore di caricamento": "加载指示器",
  "Interruttore": "开关",
  "Intervallo di date": "日期区间",
  "Intervallo fra due valori": "两值之间的区间",
  "L'elenco prende le righe dallo slot predefinito e le compone con icona, testo, supporto e coda; interactive abilita il clic e selection riporta la scelta con change.":
    "列表从默认插槽取得行，并组合图标、文本、辅助内容和尾部内容；interactive 启用点击，selection 通过 change 报告选择。",
  "L'impalcatura mette insieme le superfici intorno al contenuto: la navigazione, la barra, quella inferiore e il pannello di supporto arrivano dagli slot e il contenuto principale è lo slot predefinito. Le aree che non ricevono nulla non occupano spazio.":
    "外壳在内容周围组合各面板：导航、栏、底部栏与辅助面板来自插槽，主要内容位于默认插槽。未接收内容的区域不占空间。",
  "L'indicatore mostra l'attesa di un'operazione: label è il nome letto dai lettori di schermo e va sempre dichiarata. variant contained lo appoggia su una superficie quando copre un riquadro.":
    "指示器显示操作等待：label 是屏幕阅读器读取的名称，必须声明。variant contained 在覆盖瓦片时将其放在面板上。",
  "L'interruttore cambia stato da sé e riporta il valore con change: è la forma giusta per una preferenza che ha effetto immediato, mentre la casella resta per una scelta da confermare.":
    "开关自行切换状态并通过 change 返回值：适合立即生效的偏好；复选框则用于需要确认的选择。",
  "La barra dispone gli elementi che riceve nello slot predefinito: varianti diverse separano i comandi principali da quelli di servizio, e la barra porta a capo gli elementi in eccesso invece di comprimerli.":
    "栏把默认插槽收到的元素排开：不同变体区分主要命令与辅助命令，栏将多余元素换行而非压缩。",
  "La barra inferiore tiene i comandi in linea e il pulsante flottante: lo slot predefinito riceve i comandi, leading e trailing gli elementi ai lati, fab il pulsante che si incastra nel taglio. dock porta il pulsante dentro la barra.":
    "底部栏容纳行内命令与浮动按钮：默认插槽接收命令，leading 与 trailing 提供两侧元素，fab 提供嵌入缺口中的按钮。dock 将按钮放入栏内。",
  "La barra porta il titolo e i comandi: title riceve il testo principale, subtitle la riga sotto, gli slot leading e actions i comandi ai due lati. Lo slot predefinito sostituisce il titolo quando serve un'intestazione più ricca.":
    "栏承载标题与命令：title 提供主文本，subtitle 提供下方一行，leading 与 actions 插槽提供两侧命令。需要更丰富的头部时用默认插槽替换 title。",
  "La barra stretta mostra le icone delle destinazioni e, con expanded, anche i testi. Serve fra la barra inferiore e il pannello laterale, quando lo spazio è poco ma le sezioni restano molte.":
    "窄栏显示目标项图标，使用 expanded 时同时显示文本。适用于空间有限但分区较多的场景，位于底部栏与侧面板之间。",
  "La casella prende dallo slot predefinito il testo dell'etichetta e cambia stato da sé, riportando checked con change. supporting-text aggiunge la riga di spiegazione, indeterminate mostra lo stato misto.":
    "复选框从默认插槽取得标签文本并自行切换状态，通过 change 报告 checked。supporting-text 增加说明行，indeterminate 显示混合状态。",
  "La dashboard dispone i riquadri che riceve e non impone contenuti: ogni riquadro è un bolle-widget, e span decide quante colonne occupa mentre min-span fissa il minimo quando lo spazio si stringe.":
    "仪表盘排列收到的瓦片，不限定内容：每个瓦片都是 bolle-widget，span 决定占多少列，min-span 在空间变窄时设定下限。",
  "La forma estesa mostra icona e testo insieme: lo slot icon porta il simbolo, lo slot predefinito il testo. Resta il pulsante dell'azione principale della schermata.":
    "扩展形式同时显示图标与文本：icon 插槽提供符号，默认插槽提供文本。它仍是页面主要操作的按钮。",
  "La pastiglia prende dallo slot predefinito il testo e dagli altri un'icona o un avatar. selected la segna come scelta, removable aggiunge il comando che la toglie e riporta remove.":
    "标签从默认插槽取得文本，其他插槽提供图标或 avatar。selected 将其标记为已选，removable 增加移除命令并报告 remove。",
  "La ricerca è un campo di testo con il comando di pulizia già incluso: results riceve l'elenco che compare sotto la barra, che l'applicazione riempie con i risultati di suggest o search.":
    "搜索是已内置清除命令的文本字段：results 接收显示在栏下的列表，由应用用 suggest 或 search 的结果填充。",
  "La scheda non si compone con uno slot: il componente chiama card per ogni scheda e riceve la scheda e la board. laneLabel dà un nome alle corsie, che altrimenti mostrano la chiave.":
    "卡片不通过插槽组合：组件为每张卡片调用 card，并接收卡片与看板。laneLabel 为泳道命名，否则显示键名。",
  "La scheda prende dallo slot predefinito il contenuto, da media l'immagine di testa che occupa la larghezza e da actions la riga di comandi. href rende l'intera scheda un collegamento.":
    "卡片从默认插槽取得内容，media 提供占满宽度的顶部图片，actions 提供命令行。href 使整张卡片成为链接。",
  "La select avvolge un elemento select nativo: le opzioni restano nel markup e il valore arriva con change. Il menu che si apre è quello del componente, con la stessa forma dei campi di testo.":
    "select 包装原生 select 元素：选项留在标记中，值通过 change 返回。展开的菜单由组件提供，与文本字段样式一致。",
  "La variante decide la forma: filled per l'azione principale, tonal per la secondaria, outlined e text per le altre. Lo slot predefinito porta il testo, icon l'icona iniziale e trailing-icon quella finale.":
    "变体决定形状：filled 用于主要操作，tonal 用于次要操作，outlined 与 text 用于其他。默认插槽提供文本，icon 提供起始图标，trailing-icon 提供末尾图标。",
  "La voce non si compone con uno slot: il componente chiama item per ogni voce dell'albero e railItem quando la barra è ridotta, così il contenuto si dichiara una volta sola. Le regole CSS del markup si passano in contentStyles.":
    "条目不通过插槽组合：组件为树中每个条目调用 item，栏变窄时调用 railItem，因此内容只需声明一次。这些标记的 CSS 放在 contentStyles 中。",
  "Lo slot icon sostituisce il simbolo predefinito e align sposta il blocco a sinistra, utile quando lo stato vuoto riempie una colonna di contenuto.":
    "icon 插槽替换默认符号，align 将区块左移，适合空状态填充一列内容的场景。",
  "Lo slot icon sostituisce le iniziali: serve per un account generico o per un'immagine non disponibile. Lo slot badge sovrappone una segnalazione all'angolo.":
    "icon 插槽替换首字母：适用于通用账号或图片不可用。badge 插槽在角落叠加标记。",
  "Lo stato vuoto centra icona, titolo e testo; lo slot actions porta il comando che fa uscire dallo stato vuoto. tone error lo colora per un errore di caricamento.":
    "空状态居中显示图标、标题和文本；actions 插槽提供离开空状态的命令。tone error 将其着色为加载错误。",
  "Menu di azioni": "操作菜单",
  "Messaggio con azione": "带操作的消息",
  "Pager sui dati presenti": "基于现有数据的分页",
  "Pannello di navigazione": "导航面板",
  "Pannello di supporto": "辅助面板",
  "Pannello laterale di dettaglio": "侧边详情面板",
  "Passi di un percorso": "流程步骤",
  "Pastiglia con icona e rimozione": "带图标与移除的标签",
  "Percorso di navigazione": "面包屑路径",
  "Pulsante a icona": "图标按钮",
  "Pulsante che resta premuto": "保持按下的按钮",
  "Pulsante con icona": "带图标的按钮",
  "Pulsante flottante": "浮动按钮",
  "Pulsante flottante esteso": "扩展浮动按钮",
  "Pulsanti collegati": "相连按钮",
  "Regola di spostamento e limiti": "移动规则与限制",
  "Ricerca in linea nella barra": "栏内行内搜索",
  "Ricerca, contatori e rail compatta": "搜索、计数与紧凑栏",
  "Riquadri spostabili e ridimensionabili": "可移动与调整大小的瓦片",
  "Scelta della dimensione e forma compatta": "选择每页行数与紧凑形式",
  "Scelta di un orario": "选择时间",
  "Scelta di una data": "选择日期",
  "Scelta fra segmenti": "分段选择",
  "Scelta multipla": "多选",
  "Scheda con immagine e comandi": "带图片与命令的卡片",
  "Scheda orizzontale come collegamento": "作为链接的横向卡片",
  "Schede che scorrono": "可滚动的标签",
  "Schede con pannelli": "带面板的标签",
  "Segnalazione su un elemento": "元素上的标记",
  "Select con opzioni native": "带原生选项的 select",
  "Separatore fra gruppi": "组之间的分隔线",
  "Stato vuoto con un comando": "带命令的空状态",
  "Suggerimento su un comando": "命令上的提示",
  "columns dichiara le colonne e cards le schede, ciascuna con la colonna in cui si trova. Con movable il lettore trascina la scheda o la sposta con Alt e le frecce: la board applica lo spostamento e lo riporta con card-move.":
    "columns 声明列，cards 声明卡片，每张卡片带有其所在列。使用 movable 时，读者可拖动卡片或用 Alt 加方向键移动：看板自行应用并通过 card-move 报告。",
  "error porta il contorno e il testo nel colore d'errore, e con supporting-text il messaggio spiega cosa correggere. La validazione resta all'applicazione, che decide quando alzare il segnale.":
    "error 将轮廓与文本变为错误色，配合 supporting-text 说明需要修正什么。校验仍由应用负责，决定何时给出信号。",
  "indeterminate segnala una scelta parziale: è lo stato della casella di intestazione quando solo alcune righe sono scelte. Il valore lo decide l'applicazione dalle righe selezionate.":
    "indeterminate 表示部分选择：即只有部分行被选中时表头复选框的状态。值由应用根据已选行推导。",
  "items dichiara le destinazioni con icona e testo, value dice quale è attiva: il componente applica la scelta da sé e la riporta con change. Oltre cinque destinazioni conviene passare alla barra laterale.":
    "items 声明带图标与文本的目标项，value 指定当前项：组件自行应用选择并通过 change 报告。超过五个目标项时宜改用侧边栏。",
  "items dichiara le righe senza scrivere markup: ogni voce porta testo, supporto, icona, contatore e figli per il sottoelenco. itemRenderer sostituisce l'intera riga quando serve un contenuto tuo.":
    "items 无需标记即可声明行：每个条目包含文本、辅助内容、图标、计数和子列表。需要自定义内容时用 itemRenderer 替换整行。",
  "items dichiara le schede e value quella attiva: il componente applica la scelta da sé e la riporta con change. Ogni pannello dichiara con slot l'identificatore della scheda che lo apre.":
    "items 声明标签，value 指定当前标签：组件自行应用选择并通过 change 报告。每个面板通过 slot 声明打开它的标签。",
  "items dichiara le voci del percorso: il componente mette il separatore fra una voce e l'altra e segna l'ultima come pagina corrente. separator sceglie il segno, max-items comprime le voci centrali dietro un comando.":
    "items 声明路径条目：组件在条目之间放置分隔符，并将最后一项标记为当前页面。separator 选择符号，max-items 将中间条目收纳在一个命令后。",
  "items dichiara le voci e i loro figli: il componente costruisce l'albero fino a tre livelli, apre il ramo della voce scelta e riporta il percorso con navigate. La voce corrente si imposta con current, il percorso delle voci separate da barra.":
    "items 声明条目及其子项：组件构建最多三层的树，展开所选条目的分支，并通过 navigate 报告路径。当前条目用 current 设定，路径由条目以斜线分隔。",
  "label è obbligatoria perché è il nome letto dai lettori di schermo, dato che il pulsante mostra solo il simbolo. variant standard lascia l'icona senza sfondo, filled la appoggia su una superficie.":
    "label 必需，因为按钮只显示符号，它是屏幕阅读器读取的名称。variant standard 使图标无背景，filled 将其放在面板上。",
  "movable, resizable e removable rendono il riquadro regolabile dal lettore: la maniglia in alto avvia lo spostamento, quella in basso a destra il ridimensionamento, e il menu offre la chiusura. La dashboard applica il risultato e lo riporta con tile-move, tile-resize e tile-remove.":
    "movable、resizable 和 removable 让读者调整瓦片：上方手柄开始移动，右下角手柄调整大小，菜单提供移除。仪表盘自行应用结果并通过 tile-move、tile-resize 和 tile-remove 报告。",
  "multiline trasforma il campo in un'area di testo e rows fissa l'altezza iniziale; gli slot restano quelli del campo, con il suffisso per un conteggio.":
    "multiline 将字段变为文本区域，rows 设定初始高度；插槽仍是字段的插槽，可用后缀显示计数。",
  "open apre il dialogo e modal lo rende bloccante: il fuoco resta dentro finché non si chiude, e la chiusura arriva con closed. heading riceve il titolo letto come intestazione, actions la riga dei comandi.":
    "open 打开对话框，modal 使其阻塞：焦点保持在内部直到关闭，关闭通过 closed 返回。heading 提供作为标题的文本，actions 提供命令行。",
  "options dichiara i nomi dei passi e value quello corrente: il componente segna i passi fatti, quello attivo e i restanti, e riporta la scelta con change.":
    "options 声明步骤名称，value 指定当前步骤：组件标记已完成、当前和待完成的步骤，并通过 change 报告选择。",
  "orientation horizontal mette immagine e testo affiancati, href rende la scheda un collegamento e tail dice da dove arriva: la coda punta al contenuto che la precede.":
    "orientation horizontal 使图片与文本并排，href 使卡片成为链接，tail 说明来源：尾部指向其上方的内容。",
  "page-size accende il pager e total dice quante righe esistono: il componente si sposta da sé alla pagina richiesta e la riporta con page-change, così l'applicazione taglia la fetta di dati che mostra.":
    "page-size 启用分页器，total 说明行的总数：组件自行移动到所需页码并通过 page-change 报告，应用据此切分显示的数据。",
  "pageSizes aggiunge il selettore delle righe per pagina: sceglierne una riporta la pagina a zero. form compact toglie l'elenco numerato e lascia intervallo e frecce, utile sotto una tabella.":
    "pageSizes 增加每页行数选择：选择后页码回到第一页。form compact 去掉编号列表，只保留范围与箭头，适合放在表格下方。",
  "restrict decide dove può andare una scheda e restituisce il motivo del rifiuto, che arriva con card-move-blocked. wip sulla colonna è un limite consigliato: la board lo segnala senza impedire lo spostamento.":
    "restrict 决定卡片可去往何处并返回拒绝原因，通过 card-move-blocked 到达。列上的 wip 是建议上限：看板会提示但不阻止移动。",
  "scrolled segnala che il contenuto sotto ha iniziato a scorrere e collapsed comprime la barra: l'applicazione ascolta lo scorrimento e passa il valore, mentre la barra cambia altezza e ombra.":
    "scrolled 表示下方内容已开始滚动，collapsed 收起栏：应用监听滚动并传入值，栏随之改变高度与阴影。",
  "show() apre il messaggio e duration lo chiude da solo: lo slot message porta il testo, action l'azione che lo accompagna e dismiss il comando di chiusura. message resta la scorciatoia per il solo testo.":
    "show() 打开消息，duration 自动关闭：message 插槽提供文本，action 提供附带操作，dismiss 提供关闭命令。message 仍是仅传文本的简写。",
  "show(anchor) apre il menu sotto l'elemento che lo richiama e la scelta arriva con menu-select. items dichiara le voci, con icona, scorciatoia, disabled e figli per il sotto-menu.":
    "show(anchor) 在调用它的元素下方打开菜单，选择通过 menu-select 返回。items 声明条目，含图标、快捷键、disabled 与子菜单。",
  "src mostra l'immagine e, quando manca o non si carica, il componente torna alle iniziali ricavate da name. initials le fissa a mano, status aggiunge il punto di presenza e size cambia la misura.":
    "src 显示图片，缺失或加载失败时组件回退到由 name 推导的首字母。initials 可手动指定，status 增加在线圆点，size 改变尺寸。",
  "suggestions dichiara i suggerimenti e il componente li filtra mentre si scrive, riportandoli con suggest; scegliere una voce riempie il campo ed emette change. suggestion-delay regola l'attesa prima di chiedere i dati.":
    "suggestions 声明建议项，组件在输入时筛选并通过 suggest 返回；选择一项会填充字段并触发 change。suggestion-delay 设定请求数据前的等待。",
  "supporting-mode decide dove vive il contenuto dello slot supporting: inline accanto al contenuto, modal sopra la pagina, sheet in un foglio laterale. Il componente sceglie la forma adatta alla larghezza e riporta il cambio con form-change.":
    "supporting-mode 决定 supporting 插槽内容的位置：inline 在内容旁，modal 覆盖页面，sheet 位于侧面板。组件按宽度选择合适形式并通过 form-change 报告变化。",
  "value dice quanto è stato fatto rispetto a max, label è il nome letto dai lettori di schermo. variant circular passa all'anello, indeterminate segnala un'attesa senza valore.":
    "value 表示相对 max 的完成量，label 是屏幕阅读器读取的名称。variant circular 切换为圆环，indeterminate 表示无数值的等待。",
  "variant fullscreen occupa la finestra e serve per un compito lungo, come un editor: la superficie perde gli angoli e i comandi restano in fondo.":
    "variant fullscreen 占满窗口，适合编辑器等长任务：面板去掉圆角，命令保留在底部。",
};

export default messages;
