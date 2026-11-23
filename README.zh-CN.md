[English](README.md)

# Bolle Material Web Components

一个基于 Material 的 Web Components 组件库，以 `bolle-web-components` 发布。

文档站点：<https://ppossanzini.github.io/bolle-web-components/>
（意大利文、英文、法文和简体中文）。

## Bolle 层

Material 3 是骨架，Bolle 是外观。组件名称、颜色角色和字体比例沿用 M3。
风格特征来自 `tokens.css` 中的 `--bb-*` token，可以调整，也可以关闭。

| 标志                    | 位置                                                                                                                                                                                   | Token                                                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 尾角（Tail）            | 较尖的那个角指向表面的来源：菜单、tooltip 和 FAB 菜单指向触发元素；snackbar 和卡片保持在左下（bottom-start）；位于内容下方的链接卡片将尾角翻到顶部，并位于其链接去向的另一侧（`tail`） | `--bb-radius`、`--bb-tail`、`--bb-card-tail`                                                                                                         |
| 膜（Film）              | 焦点轮廓和选中 chip 外的光环；FAB 的淡色晕染。仅作装饰：状态由实线轮廓和容器颜色承载                                                                                                   | `--bb-film`、`--bb-film-1…4`、`--bb-ring-width`、`--bb-ring-gap`                                                                                     |
| 挤压/弹出（Squish/pop） | 按钮被挤压（1.1 × 0.86）后晃动回弹；浮动表面从尾角膨胀出现，关闭时“啵”地弹破；基础对话框打开后保持几乎察觉不到的轻微浮动（2px，±0.15°）                                                | `--bb-squish`、`--bb-tension`、`--bb-inflate-duration`、`--bb-pop-duration`、`--bb-bob-distance`、`--bb-bob-duration`                                |
| 漂浮（Float）           | 柔和的墨色阴影，层级越高越偏紫；右上角高光在 hover 和按下时出现在按钮颜色上，FAB 静止时也有                                                                                            | `--bb-float-1…5`、`--bb-highlight`                                                                                                                   |
| 液态（Liquid）          | 分段按钮用弹簧曲线在各分段间移动同一个指示器；加载指示器是不断上升、相互融合的气泡                                                                                                     | —                                                                                                                                                    |
| 玻璃（Glass）           | 菜单和 FAB 操作项半透明并带模糊；在不支持 `backdrop-filter`、低性能设备以及开启“降低透明度”时为不透明                                                                                  | `--bb-glass-opacity`、`--bb-glass-blur`                                                                                                              |
| 滚动条                  | 组件内部的每个滚动区域都没有箭头按钮，因此轨道和滑块两端完全圆润；轨道与容器边缘保留间距；Firefox 保留原生细滚动条，颜色相同                                                           | `--bb-scrollbar-size`、`--bb-scrollbar-inset`、`--bb-scrollbar-margin`、`--bb-scrollbar-track`、`--bb-scrollbar-thumb`、`--bb-scrollbar-thumb-hover` |

颜色角色由 `npm run colors` 从种子色 `#5B4CF0` 生成
（tonal spot 方案，primary 调色板使用种子色的完整色度）。选中状态的图标为填充样式
（`--md-icon-fill: 1`）。`bolle-button` 上的 `variant="accent"` 使用少见的
“Scoppio”强调色 `--bb-accent`。字体：display 和 headline-large 使用 Fredoka 600，
正文和 UI 使用 Figtree，代码使用 JetBrains Mono。在
`prefers-reduced-motion` 下只保留淡入淡出：没有晃动、弹出或对话框浮动。

`bolle-*` 组件内的文本无法用指针选中
（host 上设置了 `user-select: none`）；`input`、`textarea` 和可编辑内容仍然
可以选中。这同样适用于插入卡片和对话框 slot 中的内容。

## 基础

基础层包括：

| 基础              | Token 与页面内容                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------- |
| 设计 token        | reference、system 和 component 三类；CSS 映射保留 `comp` 段                                 |
| 颜色              | 22 对容器/内容角色，以及 outline 和 outline-variant，分浅色和深色，十六进制值从 DOM 读取    |
| 形状              | 10 级圆角，包括 Expressive 的 increased 和 extra-extra-large，另有 5 种方向变体             |
| 高度（Elevation） | 0–5 级、色调叠加，以及 32% 的 scrim 角色                                                    |
| 动效              | 16 种时长、10 种缓动、6 组弹簧阻尼/刚度参数                                                 |
| 状态              | 状态层：hover 8%、focus 10%、按下 10%、拖动 16%、禁用 38%；禁用容器 12%、内容 38%、轮廓 12% |
| 布局              | 断点 599/839/1199/1599，边距 16/24，窗格间距 24，阅读行宽 40–60ch                           |
| 图标              | 尺寸 20/24/40/48 以及图标交付方式的决策                                                     |

数值来自记录的快照：token 集 34.0.21 的角色色调和
baseline 调色板的十六进制值。`on-primary-container`、
`on-secondary-container`、`on-tertiary-container` 和 `on-error-container` 在浅色模式下
现在使用色调 30（34.0.21 中的值），而不是色调 10。

项目自行推导的部分和待解决事项：

- Elevation 阴影是根据 dp 层级推导的：资料来源没有公布偏移、
  模糊或扩散值。色调 elevation 使用 `color-mix` 混合 `primary`。
- 未生成中等和高对比度级别；浅色和深色只提供
  标准级别。
- 弹簧是数值 token，不是 CSS timing function；使用它们的组件
  必须把弹簧转换为曲线或时长。
- 栅格列数、列宽和间距由项目决定：M3
  资料没有为它们提供数值表。
- 未内置 Material Symbols。组件和演示使用文本字形，因此
  图标交付方式仍由项目决定。

## 排版

运行 `npm run typography`，从
`scripts/typography.mjs` 生成 30 种 Material 字体样式。构建和开发命令也会生成它们。
先加载 `tokens.css`，再加载 `typography.css`。保留同级的 `fonts/` 目录：
Figtree 400–700、Fredoka 500–700 和 JetBrains Mono 400–500 均在本地提供，
许可证位于 `fonts/LICENSE`。锁定版本的 Fontsource 包提供的所有子集都会按原始
Unicode 范围复制，浏览器只请求匹配的子集。这些字体未覆盖的文字使用
操作系统的回退字体；本库不声称内置阿拉伯文、印度系文字或东亚文字的字体
覆盖。

字体族映射到四个 reference token：`--md-ref-typeface-display`（Fredoka，
字重 600，用于 display 和 headline-large）、`--md-ref-typeface-brand` 和
`--md-ref-typeface-plain`（Figtree），以及 `--md-ref-typeface-code`
（JetBrains Mono）。字号、行高和字距沿用 M3 比例。

可以使用 `md-type-body-large` 和
`md-type-emphasized-body-large` 这样的类，或每个样式对应的 CSS 自定义属性。
font 简写和字距是分开的：自定义组件还必须应用
`letter-spacing: var(--md-sys-typescale-body-large-tracking)`。
brand 和 plain 的 font-family token 可以分别覆盖。
实现使用 token 快照 34.0.21 中的静态字重：
强调的 title medium/small 和 label 使用 700，而不是可变字体轴上不同的
值 600。不声称支持可变字体轴。
演示包含全部 30 种样式的示例。生成的 CSS 从不
手动编辑。
演示中的角色映射：页面标题使用 display large，章节标题使用 headline
medium，文章标题使用 title large，段落和状态文本使用 body large，按钮使用
label large，元数据使用 label medium，示例说明使用 body small。
每个映射都同时应用 font 和字距 token，并保留语义化 HTML。

### 语言、数字与链接

`lang` 选择项目的语言行高策略。列出的小类语言
使用系数 1，默认/中等类别使用 1.07，缅甸语和泰卢固语使用 1.3，乌尔都语
使用保守的超大系数 2。这些是项目根据近似参考比例做出的调整，并非经过验证的
按角色划分的 Material 行高 token。
设置 `data-language-height="small|medium|large|extra-large"` 可覆盖
类别，尤其是在实际字体/文字体系不同时。内置的小类
语言列表仅作示例，并不是完整的语言检测器。
字体度量会在显式的语言边界处重新声明；font-family reference
token 仍可继承。Shadow 组件从其 host 继承上下文。

`.md-numerals-tabular` 应用等高等宽数字，而不改变文本
角色。适用于时钟、变化的数值和数字表格单元格。
`.md-text-link` 为链接添加下划线并应用 primary 颜色角色；
`.md-text-link--tertiary` 将其改为 tertiary。焦点有可见的轮廓。
菜单导航操作保留组件自身的样式，而不是行内文本链接样式。
除 30 个字体示例外，演示还展示了文档内容、元数据、数字摘要、时间、数据表、
链接和多语言段落。

### 排版无障碍检查

Chromium 检查涵盖语言行高的选择、标准浅色/深色前景
与背景配对、200% 根文字大小、自定义行/字母/单词/段落
间距，以及 320、640 和 1280 CSS 像素下的重排（reflow）。测试的文本角色配对均超过
4.5:1。这些检查并不认证每一种合成状态、用户主题或字体。
浏览器缩放、屏幕阅读器以及真实设备/文字字形塑形仍需手动检查。
不要把回退字体的可用性或这份自动化样本视为完整的多语言
或 WCAG 合规。

首个实现：`bolle-menu`，基于 Lit 3.3.3 和 TypeScript 构建。
本库不依赖任何 Material 组件。ES 模块打包了 Lit，
无需应用构建步骤即可在 HTML 中使用。

## 框架集成

本库以 Custom Elements 的形式使用。集成指南为每个组件提供了
详尽的 Vue 和 React 示例，涵盖 attribute、
slot、事件、命令式方法和表单。每份指南提供四种
语言：

- Italiano: [Vue 3](docs/it/vue.md) · [React](docs/it/react.md)
- English: [Vue 3](docs/en/vue.md) · [React](docs/en/react.md)
- Français: [Vue 3](docs/fr/vue.md) · [React](docs/fr/react.md)
- 中文: [Vue 3](docs/zh/vue.md) · [React](docs/zh/react.md)

索引：[docs/README.md](docs/README.md)。

在线文档站点位于 `site/`。它以一个展示页
（`#/`）开场，该页由 `artwork/` 中的品牌形象画板构建：bolle 标志和
`bolle` 文字标志、主视觉、三个标志性特征（尾角、膜、挤压）、真实
组件展示、可为整个站点重新换肤的种子色选择器、CSS 示例以及
安装命令。标志用 CSS 绘制（`site/landing.ts` 中的 `bolleMark`）：
膜环宽度为边长的 1/14，primary 色内核加高光；小于 24px 时只保留
带尾角的形状，这也是 favicon。

**Foundations** 页面（`#/foundations`）逐节讲解 Bolle 层
（尾角、膜、高光与漂浮、动效、玻璃、颜色、排版、
规则）。每一节都有可以试用的实时组件（菜单和 tooltip 的尾角、焦点
和选中光环、hover 高光、挤压、浮动对话框、液态
分段指示器、bolle 加载器）、根据 `--bb-tension` 绘制的弹簧曲线，
以及一张列出其 `--bb-*` token 的表格，数值从
页面读取。

组件目录位于 `#/overview`。它列出每个组件，显示
预览，并为当前状态生成对应的 Vue 和 React 代码片段。
组件配置分布在两个地方。尺寸 token 位于
预览旁的 **Dimensioni** 面板中，滚动时保持可见，因此
修改会立即显示效果。主题、模板、组件参数，以及
颜色、形状、排版和其余 token，在侧边面板（side sheet）中打开，入口是预览上方的
**Configura** 操作或应用栏的设置按钮；
选择其他组件会关闭该面板。

两个面板都只列出当前渲染实例真正使用的 token：站点
根据元素当前的 attribute 计算 `:host(...)` 条件，
并丢弃被后续规则覆盖的声明，因此普通按钮永远不会显示 FAB
token。每一行采用技术化布局：等宽字体的 token 名、声明的默认值、
显示当前值的数字输入框（旁边是单位），以及按像素值缩放的测量
条。像素 token 使用 `input type="number"`：方向键每次
步进 1，Shift 加方向键或滚轮每次步进 10，滚轮只在字段获得焦点时编辑数值，
否则滚动面板；值不是像素
长度的 token 保留文本输入框。覆盖值以作用于
组件标签的规则输出，有覆盖值的 token 会显示重置控件。尺寸 token
保留在 **Dimensioni** 面板中，其他 token 都在面板的 **Token del componente**
分区中；颜色、圆角和排版在其中各有自己的
子分组。

**Dimensioni** 面板打开时，预览上会为每个可编辑的尺寸 token
绘制 SVG 测量线。每个 token 对应一条线，取自它所控制尺寸的最外层
元素，并带有一个编号和一种颜色；包含编号、数值
和简短 token 名的徽标位于预览的侧边栏中，
堆叠排列以免互相重叠，并用一条虚线引线连接到对应的线。只有当覆盖该 token
确实会改变实际使用的值时，这条线才会被采用，因此被覆盖的声明不会绘制任何内容；
线的方向取自会发生变化的 longhand 属性：
`gap` 沿 flex 布局分隔子项的方向，
padding 绘制在其所填充的盒子内部。渲染子项少于两个的 gap，
以及盒子尺寸并未落在其上的 `min`/`max`，同样不绘制：声明
虽然生效，但渲染结果没有变化。相同的编号和颜色也出现在
token 行上，各行按编号排序。悬停在某一行上时，其他所有
线会变暗，并勾勒出该 token 所控制尺寸的元素。面板标题栏中的
**Nascondi quote** 控件可移除这层叠加。

**Template** 选择器把根元素上的所有 `--md-comp-*` 间距和尺寸 token
缩放为四分之三：padding、margin、gap、inset、height、width、最小和
最大尺寸、点击目标以及元素之间的间距。**Ariosa** 选项
恢复声明的值，**Compatta** 选项把缩放后的值
写成根元素上的行内覆盖，切换回来时将其移除。圆角、
颜色、排版、elevation 和状态不透明度不受影响，因此
对比只涉及密度。该选择器出现在配置面板中，
也位于 **Design tokens** 页面顶部。

**Design tokens** 页面用于编辑图形基础：全部 M3 语义颜色
角色（47 个，按族分组），从 materialui.co/colors 上发布的
Material 调色板中选取；七个 HCT 主题预设（Viola `#5B4CF0` 是站点
默认值，其后是来自品牌形象的 Laguna、Corallo 和 Bosco，然后是 Oceano、
Ambra 和 Grafite）；根据当前
primary 完整 HCT 生成配色方案，支持标准/中等/高对比度；圆角；标题和正文字体
族（默认 Figtree）；以及
基础文字大小。预设会同时重新生成浅色和深色调色板；
该选择器在 token 页面和组件
配置抽屉顶部都可用。浅色和深色主题的值分别保存，
作用于整个站点，并可导出为 CSS `:root` 代码片段。紧凑密度会将所有
`--md-comp-*` 长度令牌缩小到四分之三；导出文件将这些值写入
`:root[data-density="compact"]` 块，JSON 则把它们列在 `dimensions` 下。
应用在根元素上设置 `data-density="compact"`，或把这些声明复制到自己的
`:root`，即可复现紧凑界面。示例图标来自 Tabler Icons。

每个组件页面还会显示该组件使用的 token，检测方式是
查看其 shadow DOM 在当前 attribute 组合下实际匹配的规则。
颜色和圆角映射到全局主题值；`--md-comp-*` 细节
token 连同其在 `tokens.css` 中声明的值一起列出，并通过
精确的文本输入框编辑。覆盖值以作用于
组件标签的规则输出，例如
`bolle-menu { --md-comp-menu-item-vertical-padding: 20px; }`，因此它会作用于
该组件的所有实例，而不会为每个实例创建 token 副本。
字体比例名称仅供参考列出，因为只有两个字体
族和基础字号可以编辑。

长配置列表使用的下拉框（`site/docs-select.ts`）是由
`bolle-button` 和 `bolle-menu` 组合而成的站点模式，并不是
组件库目录中的条目。

```sh
npm run dev:site     # http://127.0.0.1:5174/
npm run build:site   # static site in dist-site/
```

每份指南都说明了关键的平台规则：property 与 attribute
绑定的区别、自定义事件使用 `addEventListener`、Vue 中带类型的模板 ref，
React 中的 `useBolleEvent`/`useBolleProps`，以及 JSX 类型声明。
三个版本中的代码片段完全相同；只有正文经过
翻译。

## 运行与构建

```sh
npm ci
npm run dev          # component catalogue
npm run dev:site     # documentation site with live configuration and code
npm run build
npm run build:site   # static documentation site in dist-site/
npm run i18n:check   # site strings missing or unused per language
npm pack --dry-run
```

每次推送到 `master` 都会通过 `.github/workflows/pages.yml` 构建文档站点并发布到
GitHub Pages（类型检查、翻译检查、`build:site`）。站点使用相对资源路径，因此可以在
`/bolle-web-components/` 路径下运行。在仓库设置中，Pages 的来源必须设为
**GitHub Actions**。

开发页面是一个完整的目录：先是包含 30 种字体样式的基础部分，
然后是每个组件分组及其所有已实现变体（均带标签），最后是
验证说明。页面提供深色模式和从右到左（RTL）布局。仍有
未完成 Material 变体的组件会在说明中指出差距，因此出现在页面中
从不代表完全合规。

## 变体与布局审查

目录页面围绕统一的容器宽度、统一的间距比例和
每种配置一个变体标签进行了重建，因此每个已实现的变体都可见并且
有名称。本次审查中应用的修正：

- 按钮：未选中的切换按钮使用 outlined 外观；相连的按钮组在
  窄宽度下换行而不是溢出；标签永远不会在按钮内部断行。
- 分段按钮：相连的几何形状，选中分段带对勾；
  原生 radio 视觉上隐藏，但仍可获得焦点。
- Chip：可见容器保持 32px，而点击区域达到 48px；filter
  chip 显示对勾，input chip 可以带头像；新增 elevated 样式。
- 文本框：前置/后置图标 slot、前缀、后缀、计数器和必填
  标记；每个字段的输入文本都使用 body-large 角色。
- 滑块：一条轨道上叠加原生 input，因此范围变体在同一条轨道上有两个
  手柄；标签为 body-medium，数值气泡为 label-medium，位于
  手柄上方，停靠标记位于激活填充层下方；垂直方向
  使用原生垂直回退方案。
- 导航栏和导航轨：80px 导航栏，64x32 和 56x32 的激活指示器，24px
  图标，12px 标签，导航轨条目高 56px；图标为行内 SVG。
- 日期和时间选择器：一个字段容器，触发器位于其中，值
  用 Intl 格式化（dd/mm/yy，12/24 小时制），只读字段点击后打开
  选择器，范围字段等宽，月份列表预先选中，时间使用时钟图标。
- 演示图标来自 Tabler Icons，以行内 SVG 形式提供，因此会继承 currentColor，
  不加载图标 webfont。`--md-ref-typeface-icons` 仍可供
  使用图标字体的项目使用。
- 分体按钮：主操作和菜单部分共享同一轮廓，外侧为全圆角，
  内侧为 4px 圆角，在 RTL 中镜像。
- 组件字体角色已统一：tabs 为 title-small 14，card 和 list 的辅助
  文本为 body-medium 14，应用栏副标题为 body-medium 14，FAB 图标 24，大号
  extended FAB 为 title-large 22，fab 菜单条目为 label-large 14，轮播计数器为
  label-medium 12。
- 分隔线：full、inset、inset-start、inset-end 和 vertical。
- 卡片：渲染 media slot；水平方向使用固定的媒体列。
- 列表：segmented 样式，行之间分隔并带圆角，支持选中状态。
- 应用栏：surface 背景、内边距、底部对齐的 flexible 标题，以及
  按变体区分的标题尺寸；搜索栏填满应用栏。
- 导航：导航轨标签不换行；导航轨条目使用 56px 高度；flexible
  导航栏使用水平条目布局。
- 浮层：standard 底部面板、侧边面板和抽屉固定在各自边缘；
  侧边面板支持分离式框架；底部面板支持拖动手柄；
  对话框同时接受 `full-screen` 和 `fullscreen`。
- 选择器：每个字段只有一个日历/时钟入口（原生指示器
  已隐藏），范围字段对齐，移除了 docked 模式下重复的图标。
- 轮播：hero、multi-browse、uncontained 和 center-aligned-hero 使用不同的
  条目宽度。
- 不确定进度：滑动的线性进度条和动画化的环形弧线；加载
  指示器会变形，并提供 reduced-motion 回退。

### 行为审查轮次

目录中的每个条目都再次对照本地组件和
基础快照进行了检查，并新增了以下行为。

- 菜单：使用 `role="group"` 和分组标签的分组条目，通过 `density` 以 4dp
  为步长的密度偏移，并移除了窗口失焦时关闭的行为，改为由
  指针和焦点触发关闭。
- 标签页：可滚动的标签条，带上一页/下一页控件、边缘禁用状态、
  保持边缘状态准确的 `ResizeObserver`，且没有可移动指示器。
- 列表：`selection="single|multiple"`，采用 listbox/option 语义，选中
  着色、hover 状态、带展开控件和嵌套列表的可展开行，
  以及 `expand` 事件。
- 搜索：带 `aria-activedescendant` 的建议 combobox，过滤后的选项、
  方向键、Enter、Escape、可选的防抖以及 `suggest` 事件。
- 分体按钮：`size` 遵循按钮的五级尺寸比例。
- Tooltip：plain 偏移 4dp，rich 偏移 8dp，rich tooltip 会一直保留，直到
  外部点击、Escape 或其关闭控件。
- Snackbar：消息队列以及进入动效，可通过 reduced-motion 关闭。
- 滑块：轨道两端内嵌的起始/结束图标、有上限的轨道宽度，以及旋转的自定义
  垂直轨道，取代原生回退方案。
- 进度：确定进度轨道在自定义表面上重建，带 4dp 停靠
  指示器，另有 Expressive 波浪轨道，在确定模式下裁剪数值，
  在不确定模式下播放动画。
- 复选框、单选按钮和开关：自定义 M3 控件，带对勾路径、不确定
  横线、单选圆环、错误边框和焦点环；开关绘制真实手柄，
  尺寸随状态在 16/24dp 间变化，并可选关/开图标。
- 日期选择器：行内 docked 日历，与模态日历共享同一视图。
- 时间选择器：在表盘上按指针角度拖动，手势期间
  锁定所在圆环，并自动从小时切换到分钟。
- 对话框、面板和抽屉：按位置区分的进入动效，可通过 reduced-motion
  关闭。

与规范相比仍缺失、并已在页面中说明的内容：数字输入形式的日期
选择器和时间选择器、精确的七形状加载变形、可移动的 Expressive 标签页
指示器、对话框容器变换（container transform）、轮播条目变形、extended FAB
在滚动时收起，以及通过 Material Symbols 交付图标（演示使用
行内 Tabler SVG）。

## HTML 用法

```html
<link rel="stylesheet" href="./dist/tokens.css" />
<button id="trigger" aria-haspopup="menu">Actions</button>
<bolle-menu id="menu" menu-label="Document actions"></bolle-menu>
<script type="module">
  import "./dist/bolle.js";
  const trigger = document.querySelector("#trigger");
  const menu = document.querySelector("#menu");
  menu.items = [
    { id: "open", label: "Open" },
    { separator: true },
    { id: "archive", label: "Archive", disabled: true },
  ];
  trigger.addEventListener("click", () => menu.show(trigger));
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      menu.show(trigger, { last: event.key === "ArrowUp" });
    }
  });
  menu.addEventListener("menu-select", (event) => {
    console.log(event.detail.item.id, event.detail.selectedIds);
  });
</script>
```

翻译后的标签由使用方应用提供。标签和图标不接受 HTML 字符串。
`icon` 属性只接受装饰性文本。
组件使用 Shadow DOM。CSS 自定义属性从文档继承；公开结构通过
`::part(...)` 和命名插槽使用。文档页面会列出每个组件的公开插槽和部件，
并随页面复制示例。内部类名不属于公开定制接口。

使用组件令牌覆盖几何尺寸，使用系统颜色角色控制主题。在根元素上设置
`data-theme="dark"` 即可使用自带的深色主题。

```css
bolle-button::part(control) {
  padding-inline: var(--md-comp-button-leading-space, 24px);
}
```

```html
<bolle-button>
  <span slot="icon">+</span>
  Save
  <span slot="trailing-icon">⌘S</span>
</bolle-button>
```

## 公共接口

| Property / attribute               | 取值                                                  |
| ---------------------------------- | ----------------------------------------------------- |
| `items`（仅 JavaScript property）  | `MenuEntry[]`，变更时整体不可变替换                   |
| `variant`                          | `vertical`（默认）、`baseline`                        |
| `colorScheme` / `color-scheme`     | `standard`（默认）、`vibrant`                         |
| `selectionMode` / `selection-mode` | `none`、`single`、`multi`                             |
| `menuLabel` / `menu-label`         | 必填，本地化的无障碍名称                              |
| `quick`                            | 跳过进入动画                                          |
| `open`                             | 只读的打开状态                                        |
| `selectedIds`                      | 只读数组，包含已选操作的 id                           |
| `show(anchor, options?)`           | 异步；可选 `last`，或用 `x` 和 `y` 实现上下文菜单定位 |
| `close(restoreFocus = true)`       | 关闭子菜单，并可选择归还焦点                          |

操作字段：`id`、`label`、`supportingText`、`trailingText`、`badge`、`icon`、
`disabled`、`selected`、`href`、`children`。id 在整棵树中唯一。
`selected` 用于初始化选中状态；之后用户的选择由组件管理。
`href` 操作不能同时用于选择或打开子菜单。分隔符使用
`{ separator: true }`。禁用的操作仍可获得焦点，但无法激活。

`menu-select` 携带 `{ item, selectedIds }` 冒泡并穿过 Shadow DOM。
`menu-open` 和 `menu-close` 同样会冒泡。子菜单的事件会经由
其祖先菜单冒泡；只需要根菜单事件的使用方应检查 `event.target`。

Angular 使用方需要 `CUSTOM_ELEMENTS_SCHEMA`；Vue 使用方需要为每个 `bolle-*` 标签
配置 `compilerOptions.isCustomElement`；React 使用方对自定义事件使用
`addEventListener`。详尽文档化的示例见
[Vue 3](docs/it/vue.md) 和 [React](docs/it/react.md)；它们的运行时验证
仍未完成。英文、法文和简体中文版本位于 `docs/en`、
`docs/fr` 和 `docs/zh`。

### 键盘快捷键

除 `bolle-menu` 外，每个 `bolle-*` 元素都接受 `shortcut`（property 和
反射的 attribute）。其值使用 `aria-keyshortcuts` 语法：修饰键
`Alt`、`Control`、`Meta`、`Shift` 用 `+` 与按键连接，多个备选组合
用空格分隔。

```html
<bolle-button shortcut="Alt+S">Save</bolle-button>
<bolle-text-field label="Search" shortcut="Control+K Meta+K"></bolle-text-field>
```

| 行为     | 规则                                                                                   |
| -------- | -------------------------------------------------------------------------------------- |
| ARIA     | `aria-keyshortcuts` 设置在第一个可获得焦点的内部控件上，`shortcut` 为空时移除          |
| 激活     | 按钮、链接、复选框和单选按钮获得焦点并触发点击；文本框和下拉选择获得焦点               |
| 跳过     | host 被禁用或隐藏、事件已 `defaultPrevented`、按键重复、在字段中输入时未带修饰键的按键 |
| 复合控件 | 标签页、导航栏和列表聚焦到第一个条目                                                   |
| 冲突     | 两个 host 声明相同组合时，先注册者生效                                                 |

一个挂在 `document` 上的共享 `keydown` 监听器服务所有实例。匹配时还会
检查 `event.code`，因此 Alt/Option 组合在 macOS 键盘布局下也能工作。请选择
不会覆盖浏览器或辅助技术快捷键的组合。

## Material 范围与资料缺口

参考：[Material menus](https://m3.material.io/components/menus/overview)，
本地规范快照读取于 2026-11-10，DSM 数据版本 38.2.9。
本地规范还引用了 token 数据 34.0.21 和 `v0_192`。
这些是不同的资料版本，而不是一个统一且经过验证的 token 发布版本。

- Baseline 使用其文档中规定的 4px 容器圆角；vertical 使用 16px。
- Vibrant 仅适用于 vertical 菜单。
- 在 Web 上分组使用分隔线。分组间隙和水平变体不
  声称为受支持的 Material Web 变体。
- 48px 的最小点击目标有意超过 token 表中记录的 44px Expressive 条目视觉
  高度。视觉几何和交互几何需要复查。
- 当排版样式表在颜色和组件 token 之后加载时，菜单使用本地的
  Roboto label-large 和 body-small 角色。
- 进入时的位移/缩放、200ms 子菜单延迟、内边距和阴影取值
  包含暂定的实现选择。它们不是从 Expressive 图示中验证得出的
  缺失尺寸。
- Baseline 使用 12px 的条目水平内边距和 24px 的图标槽位；vertical 使用
  记录的 token 表中的 16px 和 20px。Expressive 图示的尺寸
  仍不完整。
- 菜单密度以 4dp 步长偏移实现；过滤、指针离开时
  关闭子菜单、退出过渡、感知起点的涟漪（ripple）以及完整的
  Expressive 弹簧和形状动效仍未完成。
- 菜单和子菜单在水平和垂直方向都朝视口中空间更大的一侧打开，并保持在视口内；在紧凑窗口中用底部面板替代
  尚未实现。嵌套多选目前归属于各个子菜单；
  根菜单的 `selectedIds` 不汇总子菜单的选择。
- 只实现了自带的标准对比度浅色/深色预设。
  对比度级别生成和完整的 reference 到 system token 生成器
  仍未完成。

## 验证状态

类型检查和生产构建可通过 `npm run build` 执行。
Chromium 检查涵盖选择、禁用操作、键盘、子菜单、焦点
归还、视口定位、深色和从右到左渲染、可滚动的标签
条、列表选择与展开、搜索 combobox、菜单分组与
密度、分体按钮尺寸、snackbar 排队、rich tooltip 保留、
M3 复选框控件、确定进度和波浪进度、滑块内嵌图标、表盘
拖动以及对话框进入动效。溢出矩阵在 320 到 1440 CSS
像素、浅色、深色、LTR 和 RTL 下均无问题。

不声称符合 WCAG 2.2 AA。自动化回归测试套件将在
生产代码按已采用的前端规则获批后补充。屏幕阅读器检查、
真实设备、Firefox/WebKit、Vue/React 示例的运行时检查以及
Angular 集成仍未完成。
在发布身份、许可证和发布检查确认之前，该包保持私有。
本阶段不会进行发布。

## 0.3.2 版组件目录

该包现在注册了全部 52 个标签：菜单和
`catalogue` 映射中的下列 51 个条目。每个新增组件都有可用的原生控件或语义化
表面。条目覆盖**并不**意味着完全符合 Material 3 或 Expressive。
“支持”列说明已实现的接口。“限制”列
说明缺失的变体或行为。

`demo/showcase.ts` 通过公共包入口渲染每个目录条目。
`src/catalogue.ts` 导出各个类、`catalogue` 注册映射、
`BolleItem`、选择器标签和事件 detail 类型。每个标签都有
`HTMLElementTagNameMap` 声明。导入该包即会注册这些标签。

| 目录条目     | 公共元素                       | 支持                                                                                                                                                                                                                                                                                                            | 尚未解决的限制                                                                                                                                |
| ------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 应用栏       | `bolle-app-bar`                | 语义化 header 和标题；small、centered、medium、large、medium-flexible、large-flexible 和 search 布局；副标题；前置/后置 slot；sticky，受控的 scrolled/collapsed 状态                                                                                                                                            | 无自动滚动跟踪、自适应操作溢出或弹簧收起；搜索内容使用默认 slot                                                                               |
| 底部应用栏   | `bolle-bottom-app-bar`         | 屏幕底部的容器：`leading`、默认操作区、`trailing` 与 `fab` 插槽；可用方向键、Home 和 End 在其控件间移动焦点；`standard` 与边缘齐平，`floating` 以留白和圆角脱离边缘；`divider` 控制上边线；`sticky` 让内容滚动时保持不动；`dock` 让浮动按钮突出上边缘；`align` 控制操作区起点或居中；`label` 为工具栏命名       | 该栏只是容器：它不感知所属屏幕，只渲染应用放入插槽的内容。仅支持一个挂载按钮，位于行末一侧；不支持按钮展开或自动溢出菜单                      |
| 自动补全     | `bolle-autocomplete`           | filled/outlined 文本框，建议 listbox 由 `<option>` 子元素或 `options` 数组构建；输入时进行不区分大小写的子串过滤；ArrowDown/ArrowUp、Enter、Escape 和 Tab；位于顶层（top layer）的弹出层，可突破容器裁剪，空间不足时翻到字段上方；带 `aria-activedescendant` 的 combobox ARIA；继承的校验、只读、禁用和表单提交 | 无异步获取或防抖钩子；仅支持单个值；建议匹配为子串匹配，而非模糊匹配                                                                          |
| 徽标         | `bolle-badge`                  | 小圆点或数字文本；计数上限；由调用方提供的无障碍状态标签                                                                                                                                                                                                                                                        | 由调用方定位徽标，并在计数变化时更新完整标签                                                                                                  |
| 底部面板     | `bolle-bottom-sheet`           | 位于底部的原生模态对话框；可选拖动手柄；standard 变体固定在底部且无 scrim；操作和关闭控件                                                                                                                                                                                                                       | 无滑动/拖动手势、停靠档位或随内容扩展；手柄仅为视觉元素                                                                                       |
| 按钮组       | `bolle-button-group`           | standard 和 connected 组；单选/多选；激活后必选；filled、tonal、outlined 或 elevated 按钮；仅标签或图标+标签内容；尺寸和形状向下传递；相连的内侧圆角采用 M3 各尺寸的值（XS 4、S/M 8、L 16、XL 20dp），hover 时增大（XS 8、S/M 12、L/XL 20dp）；方向键/Home/End 焦点导航                                         | 无相邻宽度动画或弹簧动效；按钮组本身不提交值；初始的必选选择由调用方负责                                                                      |
| 按钮         | `bolle-button`                 | filled、tonal、outlined、elevated、text；切换按钮采用 M3 未选中/选中的颜色映射；round/square，圆角随尺寸变化（12/12/16/28/28dp），按下时变形（8/8/12/16/16dp）；五种尺寸，small 容器为 40px；原生链接；禁用；表单 submit/reset                                                                                  | 无感知起点的涟漪；不支持切换+文本组合；未提供完整的原生表单覆盖 attribute 集                                                                  |
| 卡片         | `bolle-card`                   | 语义化 article；filled、outlined、elevated；垂直和水平方向，带 media slot；可选的整卡链接，整个表面可点击，带 hover 状态层和焦点环；`tail`（默认 `bottom-start`，`bottom-end`、`top-start`、`top-end`）                                                                                                         | 整卡链接内不得包含其他交互控件；无拖动状态                                                                                                    |
| 轮播         | `bolle-carousel`               | 原生滚动/吸附；上一张/下一张及键盘导航；hero、center-aligned-hero、multi-browse、uncontained、uncontained-multi-aspect-ratio 和垂直全屏布局钩子                                                                                                                                                                 | hero/multi-browse 使用项目自定的 flex 宽度，而非动态 M3 keyline 遮罩；无条目变形；宽高比和全屏断点限制由调用方控制                            |
| 复选框       | `bolle-checkbox`               | 自定义 18dp 复选框，圆角方形，带对勾路径和不确定横线、焦点环、错误边框、辅助文本；必填、禁用；表单关联和重置                                                                                                                                                                                                    | 无精确的 M3 对勾路径时序，辅助文本中无错误图标                                                                                                |
| Chip         | `bolle-chip`                   | assist、suggestion、input 和 filter；flat 和 elevated 样式；前置图标和头像 slot；filter 对勾取代原生标记；可选移除；链接                                                                                                                                                                                        | 无单选 radio 式 filter 组，无拖动/重排；移除只触发事件，不会删除使用方的数据                                                                  |
| 日期选择器   | `bolle-date-picker`            | 格式化的只读字段；模态日历网格和行内 docked 日历；单日/范围；月份/年份选择；本地化的月份/星期名称；min/max；键盘导航；确认/取消                                                                                                                                                                                 | 无数字输入视图；可编辑输入被格式化字段取代；缺少 Shift+M/Y 快捷键                                                                             |
| 对话框       | `bolle-dialog`                 | 原生对话框；basic/fullscreen；模态或非模态；关闭值；Escape；平台提供的焦点限制与归还；按位置区分的进入动效，可通过 reduced-motion 关闭                                                                                                                                                                          | 无从触发元素出发的容器变换，也无退出动画                                                                                                      |
| 分隔线       | `bolle-divider`                | 原生水平分隔线；full、inset、inset-start、inset-end 和 vertical 模式；装饰模式                                                                                                                                                                                                                                  | 垂直形式需要父元素有高度，否则使用操作目标的最小值                                                                                            |
| Extended FAB | `bolle-extended-fab`           | 标签/图标按钮；small（56）、medium（80）和 large（96）尺寸；六种强调色/容器颜色以及 surface；submit/reset                                                                                                                                                                                                       | 无滚动驱动的收起、品牌变体或容器变换；未经验证的 Expressive 圆角仍属项目自定调整                                                              |
| FAB 菜单     | `bolle-fab-menu`               | 原生 FAB 触发器；primary、secondary 和 tertiary 颜色组；位于顶层、可轻触关闭（light dismiss）的菜单；条目操作；方向键/Home/End；首字母导航；Escape 和焦点归还                                                                                                                                                   | 无其他 FAB 尺寸；2–6 个条目的数量由调用方负责；这个仅含操作的菜单不使用 `href`                                                                |
| 悬浮操作按钮 | `bolle-floating-action-button` | FAB、medium、large 和旧版 small；高度 56/80/96px；静止时 elevation 3 级，hover 时 4 级；六种强调色/容器颜色以及 surface                                                                                                                                                                                         | 无容器变换、弹簧动效或自动 tooltip                                                                                                            |
| 图标按钮     | `bolle-icon-button`            | 原生按钮/链接；默认/切换；filled、tonal、outlined、standard；尺寸、形状和宽度钩子                                                                                                                                                                                                                               | 窄/宽几何使用项目自定的最小目标，而非完整的按尺寸 token 矩阵；图标形状/粗细由调用方内容决定                                                   |
| 列表         | `bolle-list`                   | 原生列表，支持 standard 和 segmented 样式；单行和双行；图标、辅助文本、链接和可交互按钮；由条目 `badge` 生成的后置计数徽标；采用 listbox/option 语义的单选和多选；带嵌套列表和展开状态的可展开行                                                                                                                | 无可拖动/可重排的行，无嵌套复选框/单选按钮；segmented 间隙使用项目自定的 2px                                                                  |
| 加载指示器   | `bolle-loading-indicator`      | 带名称的不确定 progressbar；default/contained；变形风格的关键帧，提供 reduced-motion 回退                                                                                                                                                                                                                       | 近似的变形，而非精确的七种 M3 形状路径；参考资料未提供这些路径或变形时序                                                                      |
| 导航栏       | `bolle-navigation-bar`         | 80px 导航栏，3 个目的地槽位，64x32 激活指示器，24px 图标，12px 标签；链接或操作；禁用的目的地                                                                                                                                                                                                                   | 无断点自动切换，无 flexible 导航栏宽度动画                                                                                                    |
| 导航抽屉     | `bolle-navigation-drawer`      | 位于起始侧的 standard 或 modal 导航；目的地；当前链接；导航事件；模态下执行操作后关闭                                                                                                                                                                                                                           | 无目的地分组区块、自动响应式切换或持久布局尺寸调整                                                                                            |
| 导航轨       | `bolle-navigation-rail`        | 收起宽度 96px、展开宽度 220px，56px 条目，56x32 指示器；当前目的地                                                                                                                                                                                                                                              | 无模态展开导航轨、展开切换、内嵌 FAB 或分区                                                                                                   |
| 进度指示器   | `bolle-progress-indicator`     | 带 4dp 停靠指示器的确定线性轨道、不确定滑动、环形 SVG 变体，以及 Expressive 波浪轨道（确定模式裁剪或不确定模式相位动画）；数值有界                                                                                                                                                                              | 无弹簧过渡，无精确的 Expressive 波浪振幅                                                                                                      |
| 单选按钮     | `bolle-radio-button`           | 原生 radio；按 form/name 范围互斥选择；方向键/Home/End；必填和禁用；表单重置                                                                                                                                                                                                                                    | 组标签由使用方的 fieldset/legend 提供；使用原生字形而非精确的 M3 图形                                                                         |
| 搜索         | `bolle-search`                 | 语义化 search 区域；contained 和 divided 外观；docked 结果和全屏布局外壳；查询事件；Enter 搜索事件；结果 slot；建议 combobox，支持过滤选项、方向键、Enter 确认、Escape 以及 `suggest` 上的可选防抖；字段填满搜索栏，标签和辅助文本保留在无障碍树中，焦点指示器由搜索栏承载                                      | 无展开的全屏接管或加载状态；建议数据和获取由调用方负责                                                                                        |
| 分段按钮     | `bolle-segmented-buttons`      | 原生 fieldset/radio 或 checkbox 组；二到五个分段；仅标签或图标+标签内容；相连的分段几何，40px 容器位于 48px 目标内并保留 1px 轮廓；选中分段带对勾；单值/多值；必填、禁用；表单重置/恢复                                                                                                                         | 选中分段的内侧圆角遵循项目规则，而非完整 token 矩阵；未实现密度等级                                                                           |
| 下拉选择     | `bolle-select`                 | 基于原生 `<option>` 和 `<optgroup>` 子元素的单选；Material vertical 菜单，带分组标签、对勾和 12dp 选中形状；filled/outlined 字段，带标签、占位文本、辅助文本和错误；菜单宽度跟随字段，最大 280px；Enter/Space/方向键打开，Escape 关闭；必填校验、禁用状态和表单提交                                             | 无多选，关闭状态下不支持输入跳转（type-ahead）；弹出层使用菜单语义（`menuitemradio`）而非 listbox；选项变化需要 DOM 变更才能刷新              |
| 侧边面板     | `bolle-side-sheet`             | 模态对话框，或固定在结束侧的 standard aside；分离式框架，带 16px 外边距和圆角                                                                                                                                                                                                                                   | 持久页面布局由调用方负责；无滑动/拖动，也不会自动调整内容尺寸                                                                                 |
| 滑块         | `bolle-slider`                 | 单条自定义轨道，叠加原生 input：连续、居中，以及带两个手柄的范围；4px 停靠标记，使用 M3 角色；五种轨道尺寸；hover/focus 时显示数值气泡，最小宽度 48px；轨道两侧的内嵌起始/结束图标；旋转的自定义垂直轨道；轨道宽度上限 token；`compact` 气泡滑块：32px 行高，数值位于标签旁，仅在拖动或键盘聚焦时显示气泡       | Firefox 轨道一致性未验证；内嵌图标对齐在轨道两端，而非 M3 较粗的内嵌轨道；按下时手柄不会增大到 28dp 的按下状态                                |
| Snackbar     | `bolle-snackbar`               | 持久的 polite live region；顶层表面；消息/操作/关闭；hover/focus 时暂停计时；排队消息依次显示；进入动效，可通过 reduced-motion 关闭                                                                                                                                                                             | 无退出或容器变换动效；应用必须选择合适的超时，或设置 `duration=0`                                                                             |
| 分体按钮     | `bolle-split-button`           | 主操作加菜单操作，以 2px 接缝相连，外侧全圆角、内侧 4px 圆角，在 RTL 中镜像；可选前置图标；四种颜色样式；与按钮比例一致的五种尺寸；禁用                                                                                                                                                                         | 无弹簧形状动效，主操作不支持具名表单提交                                                                                                      |
| 开关         | `bolle-switch`                 | 基于原生 checkbox 的 switch 角色；手柄尺寸随状态在 16/24dp 间过渡，可选关/开手柄图标，错误边框，禁用状态，辅助文本；表单关联和重置                                                                                                                                                                              | 无按下状态的 28dp 手柄或状态层涟漪                                                                                                            |
| 标签页       | `bolle-tabs`                   | tablist 和按名称插入的面板 slot；primary 和 secondary 样式；每个标签可带图标和徽标；自动/手动激活；方向键/Home/End；禁用标签；可滚动标签条，带上一页/下一页控件和边缘状态                                                                                                                                       | 无可移动的 Expressive 指示器或滚动到激活项的动画；滚动按钮是 tablist 外围的项目自定控件                                                       |
| 文本框       | `bolle-text-field`             | filled/outlined；input/textarea；标签、帮助文本、必填标记和计数器；前置/后置图标 slot；前缀和后缀；原生校验；只读和边界值                                                                                                                                                                                       | 无 select 模式、minlength、密码可见性控件或浮动标签动画                                                                                       |
| 时间选择器   | `bolle-time-picker`            | 格式化的只读字段；模态表盘和输入模式；12/24 小时制；AM/PM；键盘表盘导航；在 24 小时制内外圈之间按指针角度拖动；min/max/step 校验                                                                                                                                                                                | 无连续的分钟表盘，无精确的 M3 表盘几何                                                                                                        |
| 工具栏       | `bolle-toolbar`                | docked/floating；standard/vibrant；水平/垂直；原生控件的方向键/Home/End 焦点导航                                                                                                                                                                                                                                | 无自适应溢出菜单、展开、停靠过渡或 FAB 变形                                                                                                   |
| Tooltip      | `bolle-tooltip`                | 顶层的 plain 或 rich 内容；hover、focus 和 Escape；plain tooltip 偏移 4，rich 偏移 8；rich tooltip 保持打开，直到被外部点击、Escape 或其关闭控件关闭；rich 内容/操作 slot；触发元素的无障碍描述                                                                                                                 | 在真实触发元素上使用 `aria-description`，而非跨 shadow 的 `aria-describedby`；触发元素必须是原生/Bolle 按钮、链接或 input；触摸行为取决于平台 |

### Schiuma

Schiuma 收录面向管理类应用的高级组件。它们使用与 Material 目录相同的 token 和规则，但没有 Material 3 对应组件，因此其接口由 Bolle 自行定义。

| Schiuma 条目 | 公共元素             | 支持                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 尚存限制                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------ | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sidebar      | `bolle-sidebar`      | 最多三级的导航树，带 `aria-current` 和 `aria-expanded`；行高 40/40/36px，第三级有贯通全高的引导线；带高亮匹配和实时结果计数的筛选，可显示为文本框（`search="field"`）、`contained` 或 `divided` 搜索栏，或用 `search="none"` 隐藏；计数；过长标签以省略号结尾并在 tooltip 中显示全文；带徽标的 rail 形态，分组在旁边的菜单中打开；内侧边缘的调整手柄，220–480px，支持指针和键盘；`edge` 和 `card` 形态；RTL                                                                                                                                                                                                                                           | 更深的树会抛出错误；无拖拽排序、固定项或宽度持久化：由应用保存 `navigate`、`expand`、`collapse` 和 `resize` 事件报告的内容                                                                                                                                                                                                                                                                                                                                                                           |
| 应用外壳     | `bolle-app-shell`    | 以插槽提供应用区域——`bar`、`navigation`、默认内容、`supporting`、`status`、`bottom-bar`——形态按自身宽度决定：低于 840px 时导航移到底部栏、辅助面板变为抽屉，高于 1240px 时导航保持展开；`form` 可强制形态，`form-change` 报告实测形态；辅助面板在内容旁作为列显示，打开时获得焦点                                                                                                                                                                                                                                                                                                                                                                     | 外壳不负责路由或持久化：应用填充插槽并响应 `form-change` 与 `supporting-close`。断点固定为 840 与 1240。会在自身设置 `data-form` 供页面样式使用                                                                                                                                                                                                                                                                                                                                                      |
| 仪表板       | `bolle-dashboard`    | 十二列的 `bolle-widget` 块网格；每个块声明 `span` 与 `min-span`，带有把手、标题、可选副标题、操作插槽，以及宽度、前后移动和隐藏的菜单；可通过指针拖拽重新排序：副本跟随指针，落点处显示虚线空位，指针提示显示位置，边缘自动滚动，Esc 取消；也可用 Alt 加方向键或菜单；可通过角把手、方向键或菜单调整宽度；每次操作都有实时区域播报                                                                                                                                                                                                                                                                                                                    | 组件只移动和调整给定的块，并通过 `layout-change`、`widget-hide` 报告；顺序、宽度和隐藏状态归应用所有。宽度为整列，不用像素                                                                                                                                                                                                                                                                                                                                                                           |
| 看板         | `bolle-kanban`       | 列与卡片组成的看板：卡片由应用声明，包含 `id`、`column`、可选的 `lane` 以及用于播报的 `title`；可在列之间移动和重新排序，方式是带指针跟随副本、虚线占位符、错误角色表示的拒绝列和边缘自动滚动的指针拖拽，或从卡片把手使用 Alt 加方向键；`restrict` 返回拒绝移动的原因；每列的 `wip` 只作为超出提示，从不阻塞；`collapsed` 折叠列；`lanes` 与 `laneLabel` 按泳道把卡片分组为堆叠条带；`addable` 快速添加；`cardActions` 与 `columnActions` 提供卡片和列菜单；加载、错误和空状态；`comfortable` 与 `compact` 密度；纵向滚动属于列，不属于看板                                                                                                           | 组件从不移动卡片、不施加流转规则、不保存顺序：它通过 `card-move` 请求，通过 `card-move-blocked` 报告拒绝，并由 `restrict` 决定。顺序、折叠状态和卡片归应用所有，应用响应 `card-move`、`card-move-blocked`、`card-open`、`card-action`、`column-action`、`column-collapse`、`card-add` 和 `retry`。宿主需要高度，因为看板会填满它。`card` 返回的标记位于 shadow root 中，其 CSS 需通过 `contentStyles` 传入。不支持列排序、按列排序和跨看板拖拽                                                       |
| 甘特图       | `bolle-gantt`        | 计划表面：任务由应用声明，包含 `id`、`code`、`name`、`start`、`end`，可选的 `parent`、`progress`、`milestone`、`hours`、`deps`、`resource`、`phase` 和 `baseline`；日、周、月、季度四种时间刻度，双行表头、周末底纹与今日线；带端帽的汇总条、里程碑菱形与条形下方的基线；带箭头的依赖折线；指针移动与缩放，跟随指针的提示条，被拒绝时显示红色原因提示，按 Esc 取消；键盘 Alt 加方向键与 Shift+Alt 加方向键；`group-by` 支持由 `parent` 构成的树、`resource` 或 `phase`，按负责人显示负荷条；列菜单带可见列，拖动分隔线调整宽度，并按宿主宽度自动预设；行虚拟化，网格列在横向上固定，时间表头在顶部固定；`baseline` 显示已批准计划；加载、错误与空状态 | 该表面从不缩短、延长或连接任务：通过 `task-change` 请求，通过 `task-change-blocked` 报告拒绝并应用应用端在 `restrict` 中给出的规则，通过 `task-open` 报告打开。它自身只拒绝结构性问题——结束早于开始、依赖已存在或形成循环——并通过 `dependency-add` 与 `dependency-blocked` 发出。刻度、密度与基线是表面持有的视图状态，通过 `view-change` 报告；可见列通过 `columns-change` 报告。宿主需要高度，因为计划会填满它。每个任务只占一行：不支持行排序、单元格内编辑、日期区间筛选，依赖连接也没有键盘路径 |
| 数据表格     | `bolle-data-table`   | 受控表格的行：应用声明列，可设明确宽度，以及 `align`、`pinned`、`hidden`、`groupable`、`sortable`、`value` 和 `render`；单列与多列排序，带序号标记和 `aria-sort`；表头菜单可排序、分组、固定、移动和隐藏列；拖拽列，Esc 取消，Alt 加方向键为无需拖拽的方式；可用指针、双击和方向键调整列宽；表头固定；固定列带边缘阴影；选择支持整页与不确定状态；行详情；分组带计数和应用提供的汇总；带范围的分页器；`virtual` 窗口化渲染；加载、更新、空和错误状态；`card` 与 `free` 形态；`comfortable` 与 `compact` 密度                                                                                                                                          | 组件不排序、不过滤、不分页：数据归应用所有，应用响应 `sort`、`page-change`、`select`、`expand`、`group`、`column-change`、`row-action`、`row-activate` 和 `retry` 事件。`virtual` 需要宿主有高度。`render`、`detail` 和 `groupSummary` 返回的标记位于 shadow root 中，其 CSS 需通过 `contentStyles` 传入。不支持行内编辑、导出、列合并和拖拽行排序                                                                                                                                                   |
| 头像         | `bolle-avatar`       | 身份标记：图片、缩写或图标；未提供缩写时由 `name` 推导，在无空格的语言中同样可读；`size` 从 `xs` 到 `xl`，`shape` 为 circle、rounded 或 square，`color` 角色，可选 `status` 指示点；`icon` 与 `badge` 插槽；图片加载失败时回退到缩写；可访问名称来自 `label`、`alt`、`name` 或缩写                                                                                                                                                                                                                                                                                                                                                                    | 按约定为装饰元素：本身不带链接、按钮或菜单，由调用方放入其中。不支持头像组或堆叠，也不带在线状态提示                                                                                                                                                                                                                                                                                                                                                                                                 |
| 头像组       | `bolle-avatar-group` | 排列收到的 `bolle-avatar`，按尺寸比例重叠；`max` 保留前几个可见，其余汇总到计数气泡，`total` 计入未作为头像传入的人员，`size` 设定共享尺寸，`overlap` 设定重叠比例；气泡为纯文本，或在启用 `interactive` 时成为按钮并通过 `avatar-group-select` 上报；背景色描边分隔相邻头像；`label` 为组命名                                                                                                                                                                                                                                                                                                                                                        | 只负责排列与计数：不获取人员，也不打开列表，`avatar-group-select` 仅报告隐藏数量。气泡不是提示或浮层。自行声明 `size` 的头像保持自身尺寸                                                                                                                                                                                                                                                                                                                                                             |
| 面包屑       | `bolle-breadcrumb`   | 由应用声明的层级路径，含 `id`、`label`、可选 `href`、`icon` 与 `current`；当前层级不是链接并带 `aria-current="page"`；`max-items` 把过长路径缩为第一级、可展开的省略按钮和最后几级；`separator` 为 chevron、slash 或 none，在从右到左的布局中镜像；标签以省略号截断，从不绘制到宿主之外；可用 `labels` 覆盖文案；`breadcrumb-select` 报告所选层级                                                                                                                                                                                                                                                                                                     | 自身从不导航：应用响应 `breadcrumb-select` 并决定路由。省略按钮只展开一次路径，不是菜单。不随宽度自动折叠，也无法弹出同级或上级                                                                                                                                                                                                                                                                                                                                                                      |
| 空状态       | `bolle-empty-state`  | 容器无内容可显示时使用的界面：`icon` 及其插槽、`title`、`text` 与 `actions` 插槽；`tone` 为 neutral 或 error，`align` 为 center 或 start，`role` 可让错误以 alert 播报                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 它只绘制状态，不判定状态：区分“无数据”与“无结果”以及选择操作属于应用。除图标外不提供插图插槽，也不自带重试逻辑                                                                                                                                                                                                                                                                                                                                                                                       |
| 分页         | `bolle-pagination`   | 列表分页控件，数据归应用所有：`page`、`pageSize` 与 `total`，含范围文字、随容器收窄的页码窗口、首页/上一页/下一页/末页箭头，以及来自 `pageSizes` 的每页行数选择；`form` 为 full 或 compact；容器变窄时页码列表让位于页码文字，边缘箭头也先行隐藏；可用 `labels` 覆盖文案；`page-change` 同时报告页码与每页行数                                                                                                                                                                                                                                                                                                                                        | 从不切分数据：应用响应 `page-change` 并传入行。`page` 从 0 开始，`pageSize` 为 0 时隐藏分页器。不支持无限滚动或跳页输入                                                                                                                                                                                                                                                                                                                                                                              |

### 公共取值与事件

包含数组或对象的属性通过 JavaScript property 赋值。
以下 attribute 使用 kebab case：`supporting-text`、`upper-value`、`upper-label`、
`close-label`、`action-label`、`menu-label`、`remove-label`、`selection-mode`、
`end-value`、`week-starts-on`、`hour-cycle` 和 `show-value`。
布尔 attribute 以是否存在表示；`disabled="false"` 仍表示禁用。
翻译后的标签、图标内容和目的地文本由调用方内容提供。
选择器控件、列表展开按钮、标签页滚动按钮和富文本工具提示的关闭按钮
提供英文、意大利文、法文和简体中文消息，根据 `locale`、`lang` 或文档语言的
语言子标签选择（其他情况使用英文）；选择器还接受 `labels` 覆盖对象。日期
格式化使用 `Intl.DateTimeFormat`。

```ts
import {
  BolleCheckbox,
  type BolleItem,
  type BolleValueChangeDetail,
} from "bolle-web-components";
import "bolle-web-components/tokens.css";
import "bolle-web-components/typography.css";

const destinations: BolleItem[] = [
  { id: "inbox", label: "Inbox", icon: "✉", href: "/inbox" },
  { id: "archive", label: "Archive", href: "/archive" },
];
document.querySelector("bolle-navigation-bar")!.items = destinations;

const field = document.querySelector("bolle-text-field")!;
field.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<BolleValueChangeDetail>).detail;
  console.log(value);
});

const checkbox = new BolleCheckbox();
checkbox.name = "consent";
checkbox.value = "yes";
checkbox.label = "Consent";
document.querySelector("form")!.append(checkbox);
```

- `BolleItem`：唯一的 `id`、可见的 `label`，可选的文本 `icon`、
  `supportingText`、`href`、`disabled`。条目字符串按文本渲染，绝不作为 HTML。
- 按钮 `variant`：`filled`、`tonal`/`filled-tonal`、`outlined`、`elevated`、
  `text`；图标按钮还接受 `standard`。`toggle` 启用 `selected`。
  按钮尺寸：`xs`、`small`、`medium`、`large`、`xl`。形状：`round`、`square`。
- 悬浮操作按钮尺寸：`fab`（默认）、`medium`、`large`，以及旧版
  `small`。Extended 悬浮操作按钮尺寸：`small`（默认）、`medium`、
  `large`。颜色：`primary-container`、`secondary-container`、
  `tertiary-container`、`primary`、`secondary`、`tertiary`、`surface`。
- `change`：对应控件分别为 `{ value }`、`{ checked, value }` 或 `{ selected }`。
  多选会增加 `values`；滑块增加
  `upperValue`；日期范围增加 `endValue`。
- `value-input`：编辑过程中当前的文本、搜索、日期、时间或滑块值。
  原生的 composed `input` 事件同样会穿过组件边界。
- `action`：可选的条目 `id`；`navigate`：目的地 `id`；
  `remove`：chip 移除请求；`selection-change`：按钮组的 `values`；
  `search`：查询 `value`；轮播 `change`：数字 `index`。
- `closed`：对话框的 `returnValue` 或 snackbar 的 `reason`。
  对于对话框的 Escape 关闭，`before-close` 可以取消。
- 对话框/面板：`show(opener?)`、`close(returnValue?)`、`open`。
  `variant="standard"` 让面板保留在页面布局中。
  对话框全屏的写法是 `variant="fullscreen"`。
- Snackbar：`show(message?)`、`close(reason?)`、`duration`（毫秒）；
  0 表示禁用计时器。正数时长最小为 4000 ms。
- 轮播：`goTo(index)`、`index`、`previous-label`、`next-label`。
- 标签页：`value` 选择 `BolleItem.id`；面板使用 `slot="<id>"`。
  `activation="manual"` 只移动焦点而不选中，直到按下 Enter 或 Space。

### 表单与焦点

复选框、单选按钮、开关、filter chip、文本框、搜索、
日期/时间选择器、滑块和分段按钮使用 `ElementInternals`。
这些 host 支持 `name`、`form`、禁用的 fieldset、原生约束状态、
`checkValidity()`、`reportValidity()`、重置以及浏览器状态恢复。
表单重置恢复首次渲染时的值，而不是之后修改的 attribute
值。日期和时间值序列化为 `YYYY-MM-DD` 和 `HH:MM`。
范围日期/滑块和多选分段会在 `name` 下提交多个重复条目。
未勾选的复选框、开关和 filter chip 不提交任何内容。
按钮组不提交选择；分段按钮会提交。

按钮、图标按钮和悬浮操作按钮支持 `type="submit"` 或
`type="reset"` 以及外部 `form` attribute。提交操作使用一个原生的
临时提交器，因此 `name`/`value` 和原生表单校验都会生效。
该提交器仅在提交期间存在。`formaction`、`formmethod`、
`formenctype`、`formtarget` 和 `formnovalidate` 未对外暴露。

控件的 `label` 值用于命名真实的 shadow 控件。仅在自定义 host 上
设置标签不能替代控件必需的标签。原生焦点指示器使用
现有的 focus token。模态表面使用平台提供的焦点限制，而不是
文档级的自定义按键陷阱。rich tooltip 的描述使用
可获得焦点的内部触发元素。没有 `href` 的导航会触发 `navigate`，供路由器处理。
只有带真实 `href` 的链接才提供浏览器原生导航。

### Material 支持边界

`src/design-system.json` 记录设计系统版本、资料日期、
token 快照和验证边界。`src/tokens.css` 包含手写的
组件 token 以及浅色/深色预设。生成的排版和本地字体
交付保持不变。新的共享样式使用这些 token。

最小操作目标为 48 CSS 像素。这超过了规范中部分 32/40/44 像素的
视觉容器。部分组件尺寸、间隙、
宽度、圆角和动效属于项目自定调整。资料缺口不构成
Material 的要求。精确的 Expressive 几何、七形状加载动效、
弹簧动效、动态轮播 keyline 以及完整的组件状态矩阵
仍未完成。波浪进度轨道是 Expressive
形状的近似，而非测量后的复刻。不声称完全符合 Expressive。
演示是一个交互式目录，而不是覆盖所有状态、
所有对比度的合规页面。

支持的平台要求包括原生 custom elements、shadow DOM、
`ElementInternals`、原生 dialog 和 Popover API。不内置任何 polyfill。
只提供现有的标准对比度浅色/深色主题。
高/中对比度生成、完整的 token 生成器以及对
使用方颜色覆盖的认证仍未完成。

### 目录验证

生产构建和 TypeScript 声明生成均通过。
演示使用方文件也通过了 TypeScript 严格检查。
Prettier 未报告格式错误。
行内 Chromium 检查在现有演示服务器上使用公共组件。
检查涵盖注册/演示覆盖、表单提交与重置、禁用的
fieldset、具名提交按钮、互斥单选的键盘选择、模态
关闭、standard 面板、日期网格的键盘选择、时间表盘选择、
标签页、按钮组/工具栏焦点、FAB 菜单关闭以及 tooltip 描述。
演示在 320、640 和 1280 像素下没有文档级的水平溢出。
这些检查中没有出现运行时页面错误。
其他 Chromium 检查也已通过，涵盖必填单选组、禁用/无名称的
分段值、filter chip 提交、多选/范围重置、日期范围
边界、数值清理、connected 组的必选选择以及 FAB 菜单的 Tab
关闭。一个全新文档加载构建产物并渲染全部
36 个已注册元素。

审查轮次新增的检查涵盖可滚动标签条、列表选择与
展开、搜索 combobox、菜单分组与密度、分体按钮尺寸、
snackbar 排队、rich tooltip 保留、自定义复选框控件、
确定/波浪进度、滑块内嵌图标、时间表盘拖动以及对话框进入
动效；溢出矩阵覆盖 320、600、900、1280 和 1440 像素，两种
主题均包含。

在生产代码获批之前，不添加持久化的自动化测试文件。
Firefox/WebKit、触摸/指针拖动、屏幕阅读器、完整的颜色状态
对比度、每个新组件的缩放/文本间距以及框架集成
仍未验证。这些检查不构成无障碍合规。

## 许可证

本包以 Apache License 2.0 发布。完整文本见 [LICENSE](./LICENSE)，`package.json`
中以 `"license": "Apache-2.0"` 声明同一标识符。

该许可证覆盖本仓库的源码与构建产物，不改变第三方资源的授权条款：
Fontsource 字体家族的许可证随字体一同发布；
`src/icons.ts` 中的图标路径数据来自 Tabler Icons，以 MIT 许可证授权。
