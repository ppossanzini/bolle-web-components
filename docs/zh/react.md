[Italiano](../it/react.md) · [English](../en/react.md) · [Français](../fr/react.md) · [中文](./react.md)

# React · 完整使用示例

本指南涵盖组件库的全部 51 个组件，并为每个组件提供一个 React 示例。属性、slot、事件和方法的参考与 Vue 指南相同：[vue.md](./vue.md)。本文介绍 React 特有的规则和代码。

推荐的基线版本是 React 19。在 React 18 中，只需改变非字符串属性和布尔属性的传递方式，示例同样可以运行（见下文）。

## 安装与注册

```sh
npm install bolle-web-components
```

```tsx
// src/main.tsx
import "bolle-web-components/tokens.css";
import "bolle-web-components/typography.css";
import "bolle-web-components"; // registra tutti i tag bolle-*
import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);
```

注册组件的 import 必须在首次渲染之前执行：React 19 会检查已升级的元素实例，以决定写入 property 还是 attribute。通过 `document.documentElement.dataset.theme = "dark"` 启用暗色主题。

## 集成规则

### 属性（property）

如果元素实例上存在对应的 DOM property，React 19 就写入 property，否则写入 attribute。因此数组、对象和布尔值可以直接传递：

```tsx
<bolle-list items={items} value={selected} expanded={expanded} />
<bolle-text-field value={email} maxlength={120} counter />
<bolle-button disabled={false} />
```

在 React 18 中，非字符串值会变成 attribute（`[object Object]`），而 `disabled={false}` 会写入 `disabled="false"`，其结果仍为真值。这种情况下，请使用下文介绍的 `useBolleProps` hook 赋值 property，或者对值为 false 的布尔属性使用 `disabled={undefined}`。

### 事件

React 不会把自定义事件（`change`、`value-input`、`menu-select`…）映射到 JSX props 上，必须通过 ref 用 `addEventListener` 绑定。原生的 `click` 和 `submit` 事件仍然使用 `onClick` 和 `onSubmit`。

```tsx
// src/bolle.ts
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

export function useBolleEvent<T extends HTMLElement, D = unknown>(
  ref: RefObject<T | null>,
  name: string,
  handler: (detail: D, event: Event) => void,
) {
  const saved = useRef(handler);
  saved.current = handler;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const listener = (event: Event) =>
      saved.current((event as CustomEvent<D>).detail, event);
    node.addEventListener(name, listener);
    return () => node.removeEventListener(name, listener);
  }, [ref, name]);
}

/** Solo per React 18: assegna come proprietà i valori non stringa. */
export function useBolleProps<T extends HTMLElement>(
  ref: RefObject<T | null>,
  props: Record<string, unknown>,
) {
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    for (const [key, value] of Object.entries(props)) {
      if (key in node)
        (node as unknown as Record<string, unknown>)[key] = value;
    }
  });
}
```

`handler` 的第二个参数是事件对象：`before-close` 需要用到它，调用 `event.preventDefault()` 可以取消关闭。

### Ref 与方法

Dialog、sheet、snackbar、tooltip、menu、fab-menu 和 carousel 提供命令式方法。ref 使用组件类作为类型。

```tsx
const snackbar = useRef<BolleSnackbar | null>(null);

<bolle-snackbar ref={snackbar} message="Documento salvato" />
<bolle-button onClick={() => snackbar.current?.show("Documento salvato")}>Salva</bolle-button>
```

### 受控状态

模式与 Vue 相同：把 React state 作为 property 传入，并在监听器中同步回来。

```tsx
const [email, setEmail] = useState("");
const field = useRef<BolleTextField | null>(null);
useBolleEvent(field, "value-input", ({ value }: { value: string }) =>
  setEmail(value),
);

<bolle-text-field ref={field} label="Email" value={email} />;

const terms = useRef<BolleCheckbox | null>(null);
useBolleEvent(terms, "change", ({ checked }: { checked: boolean }) =>
  setAccepted(checked),
);
<bolle-checkbox ref={terms} label="Accetto" checked={accepted} />;
```

checkbox、switch、radio 和 filter chip 的事件是 `change`，携带 `checked` 或 `selected`；text field、search、slider、segmented buttons、date picker 和 time picker 的事件是 `value-input`/`change`，携带 `value`。即使事件名为 `change`，它也不是 React 的原生事件：必须用 `useBolleEvent` 绑定。

### 表单

这些组件是 form-associated 元素：它们通过 `name` 和 `value` 进入 `FormData`，无需隐藏的 input。`form.reset()` 会恢复初始值。

```tsx
function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log(data.get("email"), data.get("newsletter"));
}
```

### Slots

slot 位于 light DOM 中：传入一个带 `slot` 属性的子元素即可。

```tsx
<bolle-app-bar label="Posta">
  <bolle-icon-button slot="leading" label="Menu">☰</bolle-icon-button>
</bolle-app-bar>

<bolle-button>
  <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true">…</svg>
  Nuovo
</bolle-button>
```

React 19 支持把 `slot` 作为 attribute；在 React 18 中它同样会作为自定义 attribute 写入。

### 键盘快捷键

除 `bolle-menu` 外，每个 `bolle-*` 元素都接受 `aria-keyshortcuts` 语法的 `shortcut`。组件会在其内部可聚焦的控件上设置 `aria-keyshortcuts`，并自行处理按键：无需在 `useEffect` 中注册监听器。属性规则见 [Vue 指南](vue.md#键盘快捷键)。

```tsx
<bolle-button shortcut="Alt+S" onClick={save}>Save</bolle-button>
<bolle-text-field label="Search" shortcut="Control+K Meta+K" />
```

### 图标

slot 接受 JSX，因此可以使用内联 SVG。而 item 数组中的 `icon` 字段会按文本渲染：请配合项目的图标字体使用 Material Symbols 的连字（ligature）名称，或者使用一个字符。不要以字符串形式传入标记。

### JSX 类型

没有类型声明时，TypeScript 会拒绝未知的标签。一个简洁的兜底方案：

```ts
// src/bolle-elements.d.ts
import type * as React from "react";

type BolleElementProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & { [prop: string]: unknown };

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      [tag: `bolle-${string}`]: BolleElementProps;
    }
  }
}
```

如需精确的类型检查，可以添加有针对性的声明，它们的优先级高于兜底声明：

```ts
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "bolle-text-field": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        variant?: "filled" | "outlined";
        label?: string;
        value?: string;
        type?: string;
        supportingText?: string;
        error?: boolean;
        multiline?: boolean;
        rows?: number;
        maxlength?: number;
        counter?: boolean;
        prefix?: string;
        suffix?: string;
        shortcut?: string;
        name?: string;
        required?: boolean;
        disabled?: boolean;
      };
      "bolle-list": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        items?: import("bolle-web-components").BolleItem[];
        label?: string;
        variant?: "standard" | "segmented";
        interactive?: boolean;
        selection?: "none" | "single" | "multiple";
        value?: string | string[];
        expanded?: string[];
      };
    }
  }
}
```

从这里开始，每个示例都默认已经引入了 React（类型使用 `import * as React from "react"`，另外还有 `useRef`、`useState` 和辅助函数）。

### 状态由组件应用与钩子

组件自行应用读者的改动，并用事件报告：排序、页码、选择、行展开、分组、列、卡片或任务的移动。无需在监听中回写状态；监听仅用于了解发生了什么变化。

当数据位于服务器时，组件把工作交给钩子：数据表格的 `sortHandler`、`pageHandler` 与 `columnHandler`，看板与甘特图的 `restrict`。钩子接收请求，组件在 Promise 完成后重绘。在 React 中它们是属性而非特性，因此通过 ref 或 prop 赋值：`table.sortHandler = …`。

<!-- catalogue -->

## 组件目录

每个组件列出属性、JavaScript 属性、插槽与公开事件；示例取自站点文档的第一条配方，已按该框架编写。

### bolle-button

属性: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · 插槽: `default`, `icon`, `trailing-icon` · 事件: `change`

**带图标的按钮** — 变体决定形状：filled 用于主要操作，tonal 用于次要操作，outlined 与 text 用于其他。默认插槽提供文本，icon 提供起始图标，trailing-icon 提供末尾图标。

```jsx
export function Azioni() {
  return (
    <>
      <bolle-button variant="filled">Salva la commessa</bolle-button>
      <bolle-button variant="outlined">
        <span slot="icon" aria-hidden="true">
          ★
        </span>
        Archivia
      </bolle-button>
      <bolle-button variant="text" href="#/commesse">
        Tutte le commesse
      </bolle-button>
    </>
  );
}
```

更多配方: 保持按下的按钮

### bolle-icon-button

属性: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · 插槽: `default`, `icon`, `trailing-icon` · 事件: `change`

**图标按钮** — label 必需，因为按钮只显示符号，它是屏幕阅读器读取的名称。variant standard 使图标无背景，filled 将其放在面板上。

```jsx
export function Comandi() {
  return (
    <>
      <bolle-icon-button label="Cerca">
        <span slot="icon" aria-hidden="true">
          ★
        </span>
      </bolle-icon-button>
      <bolle-icon-button variant="filled" label="Aggiungi">
        <span slot="icon" aria-hidden="true">
          +
        </span>
      </bolle-icon-button>
    </>
  );
}
```

### bolle-floating-action-button

属性: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · 插槽: `default`, `icon`, `trailing-icon` · 事件: `change`

**浮动按钮** — 浮动按钮固定在容器角落，仅显示符号：label 是可访问名称，必须声明。size regular 保持圆形，extended 增加文本。

```jsx
export function NuovaCommessa() {
  return (
    <div style={{ position: "relative", blockSize: 320 }}>
      <bolle-floating-action-button
        label="Nuova commessa"
        style={{ position: "absolute", insetBlockEnd: 16, insetInlineEnd: 16 }}
      >
        <span slot="icon" aria-hidden="true">
          +
        </span>
      </bolle-floating-action-button>
    </div>
  );
}
```

### bolle-extended-fab

属性: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · 插槽: `default`, `icon`, `trailing-icon` · 事件: `change`

**扩展浮动按钮** — 扩展形式同时显示图标与文本：icon 插槽提供符号，默认插槽提供文本。它仍是页面主要操作的按钮。

```jsx
export function NuovaCommessa() {
  return (
    <bolle-extended-fab>
      <span slot="icon" aria-hidden="true">
        +
      </span>
      Nuova commessa
    </bolle-extended-fab>
  );
}
```

### bolle-button-group

属性: `label`, `required`, `selection`, `shape`, `size`, `variant` · 插槽: `default` · 事件: `selection-change`

**相连按钮** — 分组连接相邻按钮：variant connected 去掉间距并共边，selection single 使分组成为单选并通过 change 返回值。

```jsx
import { useState } from "react";

export function Vista() {
  const [vista, setVista] = useState("elenco");

  return (
    <bolle-button-group
      variant="connected"
      selection="single"
      label="Vista"
      onChange={(event) => setVista(event.detail.value)}
    >
      <bolle-button
        variant="outlined"
        value="elenco"
        selected={vista === "elenco"}
      >
        Elenco
      </bolle-button>
      <bolle-button
        variant="outlined"
        value="griglia"
        selected={vista === "griglia"}
      >
        Griglia
      </bolle-button>
    </bolle-button-group>
  );
}
```

### bolle-badge

属性: `label`, `max`, `small`, `value` · 插槽: `label` · 事件: -

**元素上的标记** — 徽章在包含它的元素上方显示 value，超过 max 的数字显示为“999+”。small 去掉文本只留圆点，用于无数值的标记。

```jsx
export function Segnalazioni() {
  return (
    <>
      <bolle-badge value="12">
        <bolle-icon-button label="Messaggi">
          <span slot="icon" aria-hidden="true">
            ★
          </span>
        </bolle-icon-button>
      </bolle-badge>
      <bolle-badge value="1200" max={99}>
        <bolle-avatar name="Giulia Ferraro" />
      </bolle-badge>
    </>
  );
}
```

### bolle-bottom-app-bar

属性: `align`, `divider`, `dock`, `label`, `sticky`, `variant` · 插槽: `default`, `fab`, `leading`, `trailing` · 事件: -

**带浮动按钮的底部栏** — 底部栏容纳行内命令与浮动按钮：默认插槽接收命令，leading 与 trailing 提供两侧元素，fab 提供嵌入缺口中的按钮。dock 将按钮放入栏内。

```jsx
export function BarraInferiore() {
  return (
    <bolle-bottom-app-bar dock>
      <bolle-icon-button slot="leading" label="Menu">
        <span slot="icon" aria-hidden="true">
          ★
        </span>
      </bolle-icon-button>
      <bolle-icon-button label="Cerca">
        <span slot="icon" aria-hidden="true">
          +
        </span>
      </bolle-icon-button>
      <bolle-floating-action-button slot="fab" label="Nuova commessa">
        <span slot="icon" aria-hidden="true">
          +
        </span>
      </bolle-floating-action-button>
    </bolle-bottom-app-bar>
  );
}
```

### bolle-avatar

属性: `alt`, `color`, `initials`, `label`, `name`, `shape`, `size`, `src`, `status` · 插槽: `badge`, `icon` · 事件: -

**带头像图片或首字母的 avatar** — src 显示图片，缺失或加载失败时组件回退到由 name 推导的首字母。initials 可手动指定，status 增加在线圆点，size 改变尺寸。

```jsx
const persone = [
  { src: "/giulia.jpg", name: "Giulia Ferraro", status: "online" },
  { name: "Marco Bellini", size: "lg" },
  { initials: "GF", color: "tertiary" },
];

export function Persone() {
  return (
    <>
      {persone.map((persona) => (
        <bolle-avatar key={persona.name ?? persona.initials} {...persona} />
      ))}
    </>
  );
}
```

更多配方: 用图标代替首字母的头像

### bolle-breadcrumb

属性: `label`, `max-items`, `separator` · JavaScript 属性: `items`, `labels` · 插槽: - · 事件: `breadcrumb-select`

**面包屑路径** — items 声明路径条目：组件在条目之间放置分隔符，并将最后一项标记为当前页面。separator 选择符号，max-items 将中间条目收纳在一个命令后。

```jsx
import { useEffect, useRef } from "react";

const items = [
  { label: "Home", href: "#/it/" },
  { label: "Commesse", href: "#/it/commesse" },
  { label: "C2026-1000" },
];

export function Percorso() {
  const ref = useRef(null);

  useEffect(() => {
    const percorso = ref.current;
    if (!percorso) return;
    percorso.items = items;
  }, []);

  return <bolle-breadcrumb ref={ref} label="Percorso" />;
}
```

### bolle-avatar-group

属性: `interactive`, `label`, `max`, `overlap`, `size`, `total` · JavaScript 属性: `labels` · 插槽: `default` · 事件: `avatar-group-select`

**头像组** — 分组堆叠接收的 avatar，并用带计数的气泡汇总其余：max 决定显示多少个，total 在未全部传入时说明总数。

```jsx
export function Partecipanti({ persone }) {
  return (
    <bolle-avatar-group label="Partecipanti" max={3} total={8}>
      {persone.map((persona) => (
        <bolle-avatar key={persona.name} name={persona.name} />
      ))}
    </bolle-avatar-group>
  );
}
```

更多配方: 可交互的计数气泡

### bolle-empty-state

属性: `align`, `role`, `text`, `title`, `tone` · JavaScript 属性: `icon` · 插槽: `actions`, `icon` · 事件: -

**带命令的空状态** — 空状态居中显示图标、标题和文本；actions 插槽提供离开空状态的命令。tone error 将其着色为加载错误。

```jsx
export function Stati() {
  return (
    <>
      <bolle-empty-state
        title="Nessuna commessa"
        text="Non ci sono commesse per questo filtro."
      >
        <bolle-button slot="actions" variant="filled">
          Crea commessa
        </bolle-button>
      </bolle-empty-state>
      <bolle-empty-state
        tone="error"
        title="Piano non raggiungibile"
        text="Riprova fra qualche istante."
      >
        <bolle-button slot="actions" variant="tonal">
          Riprova
        </bolle-button>
      </bolle-empty-state>
    </>
  );
}
```

更多配方: 自定义图标与对齐

### bolle-pagination

属性: `form`, `label`, `page`, `page-size`, `range`, `total` · JavaScript 属性: `labels`, `pageSizes` · 插槽: - · 事件: `page-change`

**基于现有数据的分页** — page-size 启用分页器，total 说明行的总数：组件自行移动到所需页码并通过 page-change 报告，应用据此切分显示的数据。

```jsx
import { useEffect, useRef } from "react";

export function Pager({ total }) {
  const ref = useRef(null);

  useEffect(() => {
    const pager = ref.current;
    if (!pager) return;
    pager.total = total;
    const onPage = (event) => console.log("Pagina", event.detail.page);
    pager.addEventListener("page-change", onPage);
    return () => pager.removeEventListener("page-change", onPage);
  }, [total]);

  return <bolle-pagination ref={ref} label="Pagine" page-size={10} />;
}
```

更多配方: 选择每页行数与紧凑形式

### bolle-progress-indicator

属性: `indeterminate`, `label`, `max`, `value`, `variant`, `wavy` · 插槽: - · 事件: -

**线性与环形进度** — value 表示相对 max 的完成量，label 是屏幕阅读器读取的名称。variant circular 切换为圆环，indeterminate 表示无数值的等待。

```jsx
export function Avanzamenti() {
  return (
    <>
      <bolle-progress-indicator value={62} label="Avanzamento cantieri" />
      <bolle-progress-indicator
        value={30}
        variant="circular"
        label="Avanzamento"
      />
      <bolle-progress-indicator indeterminate label="Caricamento" />
    </>
  );
}
```

### bolle-loading-indicator

插槽: - · 事件: -

**加载指示器** — 指示器显示操作等待：label 是屏幕阅读器读取的名称，必须声明。variant contained 在覆盖瓦片时将其放在面板上。

```jsx
export function Attese() {
  return (
    <>
      <bolle-loading-indicator label="Caricamento delle commesse" />
      <bolle-loading-indicator variant="contained" label="Aggiornamento" />
    </>
  );
}
```

### bolle-snackbar

属性: `action-label`, `close-label`, `duration`, `message`, `open`, `tail` · 插槽: `action`, `dismiss`, `message` · 事件: `action`, `closed`, `queued`

**带操作的消息** — show() 打开消息，duration 自动关闭：message 插槽提供文本，action 提供附带操作，dismiss 提供关闭命令。message 仍是仅传文本的简写。

```jsx
import { useRef } from "react";

export function Archivia({ ripristina }) {
  const feedback = useRef(null);

  return (
    <>
      <bolle-button variant="filled" onClick={() => feedback.current?.show()}>
        Archivia
      </bolle-button>
      <bolle-snackbar ref={feedback} duration={6000}>
        <span slot="message">Commessa archiviata</span>
        <bolle-button slot="action" variant="text" onClick={ripristina}>
          Annulla
        </bolle-button>
      </bolle-snackbar>
    </>
  );
}
```

### bolle-tooltip

属性: `label`, `persistent`, `supporting-text`, `tail`, `variant` · JavaScript 属性: `labels` · 插槽: `actions`, `content`, `default`, `dismiss`, `label`, `supporting`, `trigger` · 事件: -

**命令上的提示** — 提示气泡通过 show(anchor) 附着到元素，指针离开或按下 Esc 时自行关闭。label 是简短文本，supporting-text 增加详情行。

```jsx
import { useRef } from "react";

export function Salva() {
  const hint = useRef(null);
  const salva = useRef(null);

  return (
    <>
      <bolle-icon-button
        ref={salva}
        label="Salva"
        onPointerEnter={() => hint.current?.show(salva.current)}
        onPointerLeave={() => hint.current?.close()}
      >
        <span slot="icon" aria-hidden="true">
          ★
        </span>
      </bolle-icon-button>
      <bolle-tooltip
        ref={hint}
        label="Salva la commessa"
        supporting-text="Scorciatoia: Ctrl e S"
      />
    </>
  );
}
```

### bolle-carousel

属性: `index`, `label`, `next-label`, `previous-label`, `variant` · 插槽: `controls`, `default`, `next`, `previous`, `status` · 事件: `change`

**卡片轮播** — 轮播在默认插槽中滚动元素并显示前进后退命令：index 表示当前可见项，选择变化通过 change 返回。滚动按步进行，支持触摸与键盘。

```jsx
export function Schede() {
  return (
    <bolle-carousel label="Schede">
      <bolle-card>Prima scheda</bolle-card>
      <bolle-card>Seconda scheda</bolle-card>
      <bolle-card>Terza scheda</bolle-card>
    </bolle-carousel>
  );
}
```

### bolle-card

属性: `href`, `label`, `orientation`, `tail`, `variant` · 插槽: `content`, `default`, `media` · 事件: -

**带图片与命令的卡片** — 卡片从默认插槽取得内容，media 提供占满宽度的顶部图片，actions 提供命令行。href 使整张卡片成为链接。

```jsx
export function Scheda() {
  return (
    <bolle-card variant="filled">
      <img slot="media" alt="" src="/cantiere.jpg" />
      <h3>Ristrutturazione scuola</h3>
      <p>Consegna prevista a marzo 2027.</p>
      <bolle-button slot="actions" variant="text">
        Apri
      </bolle-button>
    </bolle-card>
  );
}
```

更多配方: 作为链接的横向卡片

### bolle-dialog

属性: `close-label`, `label`, `modal`, `open`, `variant` · 插槽: `actions`, `default`, `heading` · 事件: `before-close`, `closed`

**确认对话框** — open 打开对话框，modal 使其阻塞：焦点保持在内部直到关闭，关闭通过 closed 返回。heading 提供作为标题的文本，actions 提供命令行。

```jsx
import { useState } from "react";

export function Archivia() {
  const [aperto, setAperto] = useState(false);

  return (
    <>
      <bolle-button variant="filled" onClick={() => setAperto(true)}>
        Archivia
      </bolle-button>
      <bolle-dialog
        label="Archivia commessa"
        modal
        open={aperto}
        onClosed={() => setAperto(false)}
      >
        <h2 slot="heading">Archiviare la commessa?</h2>
        <p>La commessa esce dagli elenchi attivi e resta consultabile.</p>
        <bolle-button
          slot="actions"
          variant="text"
          onClick={() => setAperto(false)}
        >
          Annulla
        </bolle-button>
        <bolle-button slot="actions" variant="filled">
          Archivia
        </bolle-button>
      </bolle-dialog>
    </>
  );
}
```

更多配方: 全屏对话框

### bolle-bottom-sheet

属性: `close-label`, `drag-handle`, `label`, `modal`, `open`, `variant` · 插槽: `actions`, `default`, `heading` · 事件: `before-close`, `closed`

**底部面板** — 面板从底边进入并带上命令：drag-handle 显示拖动它的手柄，heading 提供标题，actions 提供末行。open 与 show() 打开它。

```jsx
import { useState } from "react";

export function Filtri() {
  const [aperto, setAperto] = useState(false);

  return (
    <>
      <bolle-button variant="filled" onClick={() => setAperto(true)}>
        Filtri
      </bolle-button>
      <bolle-bottom-sheet label="Filtri" drag-handle modal open={aperto}>
        <h2 slot="heading">Filtri</h2>
        <p>Scegli lo stato delle commesse.</p>
        <bolle-button
          slot="actions"
          variant="text"
          onClick={() => setAperto(false)}
        >
          Annulla
        </bolle-button>
        <bolle-button slot="actions" variant="filled">
          Applica
        </bolle-button>
      </bolle-bottom-sheet>
    </>
  );
}
```

### bolle-side-sheet

属性: `close-label`, `detached`, `label`, `modal`, `open`, `variant` · 插槽: `actions`, `default`, `heading` · 事件: `before-close`, `closed`

**侧边详情面板** — 面板从 placement 指定的一侧进入并保留内容可见：适合行详情，heading 提供标题，actions 提供尾随命令。

```jsx
import { useState } from "react";

export function Dettaglio() {
  const [aperto, setAperto] = useState(false);

  return (
    <>
      <bolle-button variant="tonal" onClick={() => setAperto(true)}>
        Dettaglio
      </bolle-button>
      <bolle-side-sheet
        label="Dettaglio commessa"
        placement="end"
        modal
        open={aperto}
      >
        <h2 slot="heading">C2026-1000</h2>
        <p>Ristrutturazione scuola di Seriate.</p>
        <bolle-button slot="actions" variant="filled">
          Apri scheda
        </bolle-button>
      </bolle-side-sheet>
    </>
  );
}
```

### bolle-divider

属性: `decorative`, `inset`, `variant`, `vertical` · 插槽: - · 事件: -

**组之间的分隔线** — 分隔线没有内容：分隔两组元素，inset 使其与边缘分开，vertical 用于分隔并排命令。

```jsx
export function Separatori() {
  return (
    <>
      <p>Committenti</p>
      <bolle-divider inset />
      <p>Fornitori</p>
      <span>Esporta</span>
      <bolle-divider vertical />
      <span>Archivia</span>
    </>
  );
}
```

### bolle-app-bar

属性: `alignment`, `collapsed`, `label`, `scrolled`, `sticky`, `subtitle`, `variant` · 插槽: `actions`, `default`, `leading`, `title`, `trailing` · 事件: -

**应用栏** — 栏承载标题与命令：title 提供主文本，subtitle 提供下方一行，leading 与 actions 插槽提供两侧命令。需要更丰富的头部时用默认插槽替换 title。

```jsx
export function Barra() {
  return (
    <bolle-app-bar title="Commesse" subtitle="12 attive" sticky>
      <bolle-icon-button slot="leading" label="Menu">
        <span slot="icon" aria-hidden="true">
          ★
        </span>
      </bolle-icon-button>
      <bolle-icon-button slot="actions" label="Cerca">
        <span slot="icon" aria-hidden="true">
          +
        </span>
      </bolle-icon-button>
    </bolle-app-bar>
  );
}
```

更多配方: 滚动时收起的栏

### bolle-toolbar

属性: `color`, `label`, `orientation`, `variant` · 插槽: `default` · 事件: -

**命令栏** — 栏把默认插槽收到的元素排开：不同变体区分主要命令与辅助命令，栏将多余元素换行而非压缩。

```jsx
export function Comandi({ viste }) {
  return (
    <bolle-toolbar label="Azioni sulle commesse">
      <bolle-segmented-buttons label="Vista" items={viste} />
      <bolle-button variant="text">Esporta</bolle-button>
      <bolle-button variant="text">Archivia</bolle-button>
    </bolle-toolbar>
  );
}
```

### bolle-navigation-bar

属性: `label`, `layout`, `value`, `variant` · JavaScript 属性: `items` · 插槽: - · 事件: `navigate`

**导航栏** — items 声明带图标与文本的目标项，value 指定当前项：组件自行应用选择并通过 change 报告。超过五个目标项时宜改用侧边栏。

```jsx
export function Sezioni({ sezioni, sezione, onChange }) {
  return (
    <bolle-navigation-bar
      label="Sezioni"
      items={sezioni}
      value={sezione}
      onChange={onChange}
    />
  );
}
```

### bolle-navigation-rail

属性: `expanded`, `label`, `layout`, `value`, `variant` · JavaScript 属性: `items` · 插槽: - · 事件: `navigate`

**窄栏** — 窄栏显示目标项图标，使用 expanded 时同时显示文本。适用于空间有限但分区较多的场景，位于底部栏与侧面板之间。

```jsx
export function BarraStretta({ sezioni, sezione, onChange }) {
  return (
    <bolle-navigation-rail
      label="Sezioni"
      expanded
      items={sezioni}
      value={sezione}
      onChange={onChange}
    />
  );
}
```

### bolle-navigation-drawer

属性: `close-label`, `detached`, `label`, `modal`, `open`, `value`, `variant` · JavaScript 属性: `items` · 插槽: `actions`, `default`, `heading` · 事件: `before-close`, `closed`, `navigate`

**导航面板** — 面板纵向展开条目，可内联在内容旁或覆盖页面：placement start 或 end 选择方向，modal 使其阻塞。

```jsx
export function Pannello({ sezioni, sezione, onChange }) {
  return (
    <bolle-navigation-drawer
      label="Sezioni"
      open
      items={sezioni}
      value={sezione}
      onChange={onChange}
    >
      <h2 slot="heading">Commesse</h2>
      <span slot="actions">Versione 0.3.3</span>
    </bolle-navigation-drawer>
  );
}
```

### bolle-tabs

属性: `activation`, `label`, `scrollable`, `value`, `variant` · JavaScript 属性: `items`, `labels` · 插槽: `content-{itemId}`, `default` · 事件: `change`

**带面板的标签** — items 声明标签，value 指定当前标签：组件自行应用选择并通过 change 报告。每个面板通过 slot 声明打开它的标签。

```jsx
export function Dettaglio({ scheda, schede, onScheda }) {
  return (
    <bolle-tabs
      label="Dettaglio"
      items={schede}
      value={scheda}
      onChange={onScheda}
    >
      <div slot="note">Note della commessa</div>
      <div slot="documenti">Documenti allegati</div>
    </bolle-tabs>
  );
}
```

更多配方: 可滚动的标签

### bolle-checkbox

属性: `checked`, `error`, `indeterminate`, `supporting-text` · 插槽: `default` · 事件: `change`

**带文本与辅助说明的复选框** — 复选框从默认插槽取得标签文本并自行切换状态，通过 change 报告 checked。supporting-text 增加说明行，indeterminate 显示混合状态。

```jsx
export function Scelte() {
  return (
    <>
      <bolle-checkbox name="urgente">Segna come urgente</bolle-checkbox>
      <bolle-checkbox
        name="privacy"
        required
        supporting-text="Serve per inviare la richiesta"
      >
        Ho letto l'informativa
      </bolle-checkbox>
    </>
  );
}
```

更多配方: 控制列表的复选框

### bolle-switch

属性: `checked`, `error`, `indeterminate`, `supporting-text` · JavaScript 属性: `icon`, `iconSelected` · 插槽: `default` · 事件: `change`

**开关** — 开关自行切换状态并通过 change 返回值：适合立即生效的偏好；复选框则用于需要确认的选择。

```jsx
import { useState } from "react";

export function Notifiche() {
  const [attive, setAttive] = useState(true);

  return (
    <bolle-switch
      name="notifiche"
      checked={attive}
      onChange={(event) => setAttive(event.detail.checked)}
    >
      Notifiche attive
    </bolle-switch>
  );
}
```

### bolle-radio-button

属性: `checked`, `error`, `indeterminate`, `supporting-text` · 插槽: `default` · 事件: `change`

**选项组** — 单选按钮按 name 分组：选择一项会清除同组其他项的选择，值通过 change 返回。

```jsx
import { useState } from "react";

const opzioni = ["alta", "media", "bassa"];

export function Priorita() {
  const [priorita, setPriorita] = useState("alta");

  return (
    <>
      {opzioni.map((valore) => (
        <bolle-radio-button
          key={valore}
          name="priorita"
          value={valore}
          checked={priorita === valore}
          onChange={() => setPriorita(valore)}
        >
          {valore}
        </bolle-radio-button>
      ))}
    </>
  );
}
```

### bolle-chip

属性: `disabled`, `elevated`, `href`, `label`, `removable`, `remove-label`, `selected`, `variant` · 插槽: `avatar`, `default`, `icon` · 事件: `action`, `change`, `remove`

**带图标与移除的标签** — 标签从默认插槽取得文本，其他插槽提供图标或 avatar。selected 将其标记为已选，removable 增加移除命令并报告 remove。

```jsx
export function Filtri() {
  return (
    <>
      <bolle-chip selected>Urgente</bolle-chip>
      <bolle-chip removable remove-label="Togli il filtro Cliente">
        <bolle-avatar slot="avatar" name="Giulia Ferraro" />
        Cliente
      </bolle-chip>
    </>
  );
}
```

### bolle-list

属性: `interactive`, `label`, `selection`, `variant` · JavaScript 属性: `expanded`, `itemRenderer`, `items`, `labels`, `value` · 插槽: `default` · 事件: `action`, `change`, `expand`

**带图标与详情的列表** — 列表从默认插槽取得行，并组合图标、文本、辅助内容和尾部内容；interactive 启用点击，selection 通过 change 报告选择。

```jsx
export function Elenco({ onScelta }) {
  return (
    <bolle-list
      label="Commesse"
      interactive
      selection="single"
      onChange={onScelta}
    >
      <bolle-list-item>
        <span slot="leading" aria-hidden="true">
          ★
        </span>
        C2026-1000
        <span slot="supporting">Ristrutturazione scuola</span>
        <span slot="trailing">12</span>
      </bolle-list-item>
      <bolle-list-item>C2026-1001</bolle-list-item>
    </bolle-list>
  );
}
```

更多配方: 由数组生成的列表

### bolle-segmented-buttons

属性: `multiple` · JavaScript 属性: `items`, `values` · 插槽: - · 事件: `change`

**分段选择** — 分段来自 items，选择来自 value：控件自行应用并通过 change 报告。multiple 允许多个分段并返回 values。

```jsx
import { useEffect, useRef, useState } from "react";

const items = [
  { id: "elenco", label: "Elenco" },
  { id: "griglia", label: "Griglia" },
  { id: "mappa", label: "Mappa" },
];

export function Vista() {
  const ref = useRef(null);
  const [vista, setVista] = useState("elenco");

  useEffect(() => {
    const control = ref.current;
    if (!control) return;
    control.items = items;
    control.value = vista;
  }, [vista]);

  return <bolle-segmented-buttons ref={ref} label="Vista" />;
}
```

更多配方: 多选

### bolle-slider

属性: `compact`, `max`, `min`, `min-gap`, `step`, `suffix`, `upper-label`, `upper-value`, `variant` · JavaScript 属性: `icon` · 插槽: `icon`, `label`, `value` · 事件: `change`, `value-input`

**单个滑块** — 滑块在标签上显示值，拖动时通过 input 返回，结束时通过 change 返回。min 与 max 设定范围，step 设定步长。

```jsx
import { useState } from "react";

export function Avanzamento() {
  const [valore, setValore] = useState(40);

  return (
    <bolle-slider
      label="Avanzamento"
      min={0}
      max={100}
      step={5}
      value={String(valore)}
      onChange={(event) => setValore(Number(event.detail.value))}
    />
  );
}
```

更多配方: 两值之间的区间

### bolle-steps

属性: `options` · 插槽: `label` · 事件: `change`

**流程步骤** — options 声明步骤名称，value 指定当前步骤：组件标记已完成、当前和待完成的步骤，并通过 change 报告选择。

```jsx
const passi = ["Dati", "Documenti", "Riepilogo"];

export function Passi({ passo, onChange }) {
  return (
    <bolle-steps
      label="Avanzamento"
      options={passi}
      value={passo}
      onChange={(event) => onChange(String(event.detail.index))}
    />
  );
}
```

### bolle-text-field

属性: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · 插槽: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · 事件: `change`, `value-input`

**带前缀与辅助文本的字段** — 字段从插槽取得前缀、后缀和辅助文本，值留在 input 中并通过 input 与 change 返回。variant filled 或 outlined 改变框的样式。

```jsx
import { useState } from "react";

export function Importo() {
  const [importo, setImporto] = useState("");

  return (
    <bolle-text-field
      label="Importo"
      type="number"
      value={importo}
      onChange={(event) => setImporto(event.detail.value)}
    >
      <span slot="prefix">€</span>
      <span slot="supporting">Importo al netto dell'IVA</span>
    </bolle-text-field>
  );
}
```

更多配方: 错误状态的字段 · 多行字段

### bolle-search

属性: `appearance`, `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `filter`, `inputmode`, `layout`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `suggestion-delay`, `suggestions-label`, `supporting-text`, `type`, `variant` · JavaScript 属性: `suggestions` · 插槽: `leading`, `prefix`, `results`, `suffix`, `supporting`, `trailing` · 事件: `change`, `search`, `suggest`, `value-input`

**带结果的搜索栏** — 搜索是已内置清除命令的文本字段：results 接收显示在栏下的列表，由应用用 suggest 或 search 的结果填充。

```jsx
export function Ricerca({ risultati, onSearch }) {
  return (
    <bolle-search
      label="Cerca commesse"
      onSearch={(event) => onSearch(event.detail.value)}
    >
      <bolle-list slot="results" label="Risultati">
        {risultati.map((voce) => (
          <bolle-list-item key={voce.id}>{voce.label}</bolle-list-item>
        ))}
      </bolle-list>
    </bolle-search>
  );
}
```

更多配方: 栏内行内搜索

### bolle-date-picker

属性: `autocapitalize`, `autocomplete`, `counter`, `end-value`, `enterkeyhint`, `error`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `selection-mode`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant`, `week-starts-on` · JavaScript 属性: `labels` · 插槽: `end-label`, `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · 事件: `change`, `value-input`

**选择日期** — 选择器从字段打开日历：所选值以 ISO 格式通过 change 返回，locale 决定语言与星期名称。selection-mode range 在 end-value 中增加第二个日期。

```jsx
export function Scadenza({ scadenza, onChange }) {
  return (
    <bolle-date-picker
      label="Scadenza"
      value={scadenza}
      onChange={(event) => onChange(event.detail.value)}
    />
  );
}
```

更多配方: 日期区间

### bolle-time-picker

属性: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `hour-cycle`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · JavaScript 属性: `labels` · 插槽: `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · 事件: `change`, `value-input`

**选择时间** — 选择器从字段打开小时表盘：所选值通过 change 返回，hour-cycle 决定十二或二十四小时制，title 插槽命名表盘。

```jsx
export function Consegna({ consegna, onChange }) {
  return (
    <bolle-time-picker
      label="Consegna"
      hour-cycle={24}
      value={consegna}
      onChange={(event) => onChange(event.detail.value)}
    >
      <span slot="title">Orario di consegna</span>
    </bolle-time-picker>
  );
}
```

### bolle-menu

属性: `color-scheme`, `compact-width`, `density`, `filter`, `filterable`, `inactive`, `locale`, `menu-label`, `options`, `quick`, `selection-mode`, `tail`, `variant` · JavaScript 属性: `items`, `labels` · 插槽: - · 事件: -

**操作菜单** — show(anchor) 在调用它的元素下方打开菜单，选择通过 menu-select 返回。items 声明条目，含图标、快捷键、disabled 与子菜单。

```jsx
import { useRef } from "react";

const items = [
  { id: "apri", label: "Apri scheda" },
  { id: "duplica", label: "Duplica", shortcut: "Ctrl D" },
];

export function Azioni({ onScelta }) {
  const menu = useRef(null);

  return (
    <>
      <bolle-button
        variant="tonal"
        onClick={(event) => menu.current?.show(event.currentTarget)}
      >
        Azioni
      </bolle-button>
      <bolle-menu
        ref={menu}
        label="Azioni"
        items={items}
        onMenuSelect={onScelta}
      />
    </>
  );
}
```

### bolle-fab-menu

属性: `color`, `label`, `open`, `tail` · JavaScript 属性: `items` · 插槽: `icon` · 事件: `action`

**快捷操作** — 浮动按钮菜单从主按钮展开次要操作：items 声明条目，open 表示是否展开，选择通过 menu-select 返回。

```jsx
export function AzioniRapide({ items }) {
  return (
    <bolle-fab-menu label="Azioni rapide" items={items}>
      <span slot="icon" aria-hidden="true">
        +
      </span>
    </bolle-fab-menu>
  );
}
```

### bolle-split-button

属性: `disabled`, `icon`, `label`, `menu-label`, `size`, `variant` · JavaScript 属性: `items` · 插槽: `icon` · 事件: `action`

**主要操作与菜单** — 分体按钮左侧保持主要操作，菜单从旁边的命令展开：条目来自 items，选择通过 menu-select 返回，主要操作的点击通过 click 返回。

```jsx
const items = [
  { id: "bozza", label: "Salva come bozza" },
  { id: "duplica", label: "Salva e duplica" },
];

export function Salva() {
  return (
    <bolle-split-button label="Salva" variant="filled" items={items}>
      <span slot="icon" aria-hidden="true">
        ★
      </span>
    </bolle-split-button>
  );
}
```

### bolle-select

属性: `error`, `open`, `placeholder`, `supporting-text`, `variant` · 插槽: `supporting` · 事件: `change`

**带原生选项的 select** — select 包装原生 select 元素：选项留在标记中，值通过 change 返回。展开的菜单由组件提供，与文本字段样式一致。

```jsx
export function Stato({ stato, onChange }) {
  return (
    <bolle-select
      label="Stato"
      value={stato}
      onChange={(event) => onChange(event.detail.value)}
    >
      <select name="stato">
        <option value="aperta">In corso</option>
        <option value="chiusa">Chiusa</option>
        <option value="sospesa">Sospesa</option>
      </select>
      <span slot="supporting">Lo stato decide l'ordine delle commesse</span>
    </bolle-select>
  );
}
```

### bolle-autocomplete

属性: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · JavaScript 属性: `options` · 插槽: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · 事件: `change`, `value-input`

**带建议的字段** — suggestions 声明建议项，组件在输入时筛选并通过 suggest 返回；选择一项会填充字段并触发 change。suggestion-delay 设定请求数据前的等待。

```jsx
const suggerimenti = [
  { id: "bergamo", label: "Bergamo" },
  { id: "brescia", label: "Brescia" },
  { id: "seriate", label: "Seriate" },
];

export function Comune() {
  return (
    <bolle-autocomplete
      label="Comune"
      suggestions={suggerimenti}
      suggestion-delay={200}
    />
  );
}
```

### bolle-sidebar

属性: `collapsed`, `context`, `current`, `label`, `max-width`, `min-width`, `search`, `variant`, `width` · JavaScript 属性: `contentStyles`, `empty`, `expanded`, `filter`, `item`, `items`, `labels`, `railItem` · 插槽: `empty`, `filter`, `footer`, `header` · 事件: `collapse`, `expand`, `navigate`, `resize`

**导航树** — items 声明条目及其子项：组件构建最多三层的树，展开所选条目的分支，并通过 navigate 报告路径。当前条目用 current 设定，路径由条目以斜线分隔。

```jsx
import { useEffect, useRef } from "react";
import type { BolleSidebar, SidebarItem } from "@bolle/web-components";

const items: SidebarItem[] = [
  { id: "cruscotto", label: "Cruscotto" },
  {
    id: "commesse",
    label: "Commesse",
    count: 12,
    children: [
      { id: "attive", label: "Attive" },
      { id: "chiuse", label: "Chiuse" },
    ],
  },
  { id: "clienti", label: "Clienti" },
];

export function Navigation() {
  const ref = useRef<BolleSidebar>(null);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    nav.items = items;
    nav.current = "commesse/attive";
  }, []);

  return (
    <bolle-sidebar ref={ref} label="Navigazione" style={{ blockSize: "520px" }} />
  );
}
```

更多配方: 搜索、计数与紧凑栏 · 条目内容

### bolle-app-shell

属性: `close-label`, `expanded-width`, `form`, `label`, `medium-width`, `supporting-label`, `supporting-mode`, `supporting-open` · JavaScript 属性: `labels` · 插槽: `bar`, `bottom-bar`, `default`, `navigation`, `navigation-compact`, `status`, `supporting`, `supporting-actions`, `supporting-header`, `supporting-inline`, `supporting-modal` · 事件: `form-change`, `supporting-close`

**完整外壳** — 外壳在内容周围组合各面板：导航、栏、底部栏与辅助面板来自插槽，主要内容位于默认插槽。未接收内容的区域不占空间。

```jsx
export function Shell({ children }) {
  return (
    <bolle-app-shell style={{ blockSize: "100dvh" }}>
      <bolle-navigation-drawer slot="navigation" label="Sezioni">
        <a href="#/commesse">Commesse</a>
        <a href="#/clienti">Clienti</a>
      </bolle-navigation-drawer>
      <bolle-app-bar slot="bar" title="Commesse" />
      <main>{children}</main>
      <bolle-bottom-app-bar slot="bottom-bar" />
    </bolle-app-shell>
  );
}
```

更多配方: 辅助面板

### bolle-dashboard

属性: `columns`, `compact-columns`, `density`, `label`, `medium-columns` · JavaScript 属性: `labels` · 插槽: `default` · 事件: -

**瓦片网格** — 仪表盘排列收到的瓦片，不限定内容：每个瓦片都是 bolle-widget，span 决定占多少列，min-span 在空间变窄时设定下限。

```jsx
export function Overview() {
  return (
    <bolle-dashboard label="Panoramica" style={{ blockSize: "640px" }}>
      <bolle-widget title="Lavori in ritardo" span={8} min-span={4}>
        <p>Quattro commesse oltre la scadenza.</p>
      </bolle-widget>
      <bolle-widget title="Avanzamento cantieri" span={4} min-span={3}>
        <bolle-progress-indicator value={62} label="Avanzamento" />
      </bolle-widget>
    </bolle-dashboard>
  );
}
```

更多配方: 可移动与调整大小的瓦片

### bolle-kanban

属性: `addable`, `card-gap`, `collapsible`, `column-gap`, `column-max-width`, `column-min-width`, `density`, `empty-label`, `error`, `label`, `lanes`, `loading`, `movable`, `selected` · JavaScript 属性: `card`, `cardActions`, `cards`, `collapsed`, `columnActions`, `columnRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `labels`, `laneLabel`, `laneRenderer`, `loadingRenderer`, `restrict` · 插槽: `empty`, `error`, `loading` · 事件: `card-action`, `card-add`, `card-move`, `card-move-blocked`, `card-open`, `column-action`, `column-collapse`, `retry`

**最简看板** — columns 声明列，cards 声明卡片，每张卡片带有其所在列。使用 movable 时，读者可拖动卡片或用 Alt 加方向键移动：看板自行应用并通过 card-move 报告。

```jsx
import { useEffect, useRef } from "react";

export function Board({ columns, cards }) {
  const ref = useRef(null);

  useEffect(() => {
    const board = ref.current;
    if (!board) return;
    board.columns = columns;
    board.cards = cards;
    board.movable = true;
  }, [columns, cards]);

  return (
    <bolle-kanban ref={ref} label="Cantieri" style={{ blockSize: "520px" }} />
  );
}
```

更多配方: 移动规则与限制 · 卡片内容

### bolle-gantt

属性: `baseline`, `density`, `editable`, `empty-label`, `error`, `group-by`, `label`, `linkable`, `loading`, `scale`, `selected` · JavaScript 属性: `barRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `groupLabel`, `labels`, `loadingRenderer`, `restrict`, `tasks` · 插槽: `empty`, `error`, `loading` · 事件: `columns-change`, `dependency-add`, `dependency-blocked`, `retry`, `task-change`, `task-change-blocked`, `task-open`, `task-select`, `view-change`

**最简计划** — 计划在时间轴上绘制任务：parent 构建层级，带子任务的任务显示为汇总条。宿主必须设定高度，因为该面板会填满收到的空间。

```jsx
import { useEffect, useRef } from "react";
import type { BolleGantt, GanttTask } from "@bolle/web-components";

const tasks: GanttTask[] = [
  {
    id: "p-1",
    code: "C2026-1000",
    name: "Ristrutturazione scuola",
    start: "2026-09-07",
    end: "2027-03-12",
  },
  {
    id: "p-1-1",
    parent: "p-1",
    code: "C2026-1000.01",
    name: "Impianto elettrico",
    start: "2026-09-14",
    end: "2026-10-02",
    progress: 30,
    resource: "Giulia Ferraro",
  },
];

export function Plan() {
  const ref = useRef<BolleGantt>(null);

  useEffect(() => {
    if (ref.current) ref.current.tasks = tasks;
  }, []);

  return (
    <bolle-gantt
      ref={ref}
      label="Piano di commessa"
      style={{ blockSize: "420px" }}
    />
  );
}
```

更多配方: 列与单元格内容 · 移动与调整长度 · 条形内容 · 状态与插槽

### bolle-data-table

属性: `compact-row-height`, `default-column-width`, `density`, `empty-label`, `error`, `expandable`, `group-by`, `group-height`, `header-height`, `label`, `loading`, `max-column-width`, `min-column-width`, `overscan`, `page`, `page-size`, `row-height`, `row-key`, `selectable`, `total`, `updating`, `variant`, `virtual` · JavaScript 属性: `columnHandler`, `columns`, `contentStyles`, `detail`, `emptyRenderer`, `errorRenderer`, `expanded`, `footerRenderer`, `groupRenderer`, `groupSummary`, `headerRenderer`, `labels`, `loadingRenderer`, `pageHandler`, `rowActions`, `rowRenderer`, `rows`, `selected`, `sort`, `sortHandler` · 插槽: `empty`, `empty-state`, `error`, `footer`, `header`, `loading` · 事件: `column-change`, `expand`, `group`, `retry`, `row-action`, `row-activate`, `select`, `sort`

**通过包装组件使用框架插槽** — Vue 和 React 无法向自定义元素传递带作用域的插槽。几行代码的包装组件把插槽转换为渲染函数：页面只写一次单元格模板，包装组件为每一行挂载内容，并在单元格离开文档时释放内存。

```jsx
// BolleDataTable.tsx
import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { ReactNode } from "react";
import type {
  BolleDataTable as Element,
  DataTableColumn,
  DataTableRow,
} from "@bolle/web-components";

interface Props {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  label: string;
  rowKey?: string;
  cell?: (scope: { row: DataTableRow; column: DataTableColumn }) => ReactNode;
}

export function BolleDataTable({ columns, rows, label, rowKey = "id", cell }: Props) {
  const ref = useRef<Element>(null);
  const cells = useRef(new Map<string, { host: HTMLElement; root: Root }>());

  useEffect(() => {
    const table = ref.current;
    if (!table) return;

    table.columns = columns.map((column) => ({
      ...column,
      render: cell
        ? (row: DataTableRow) => {
            const key = `${row[rowKey]}-${column.key}`;
            let entry = cells.current.get(key);
            if (!entry) {
              const host = document.createElement("span");
              entry = { host, root: createRoot(host) };
              cells.current.set(key, entry);
            }
            entry.root.render(<>{cell({ row, column })}</>);
            return entry.host;
          }
        : column.render,
    }));
    table.rows = rows;
  }, [columns, rows, cell, rowKey]);

  useEffect(() => {
    const entries = cells.current;
    return () => {
      for (const { root } of entries.values()) root.unmount();
      entries.clear();
    };
  }, []);

  return <bolle-data-table ref={ref} label={label} row-key={rowKey} />;
}

// Pagina: il contenuto della cella è JSX, non una funzione che costruisce nodi.
<BolleDataTable
  label="Commesse"
  columns={columns}
  rows={rows}
  cell={({ row, column }) =>
    column.key === "status" ? <span className="badge">{row.status}</span> : null
  }
/>
```

更多配方: 注册组件 · 最小表格 · 格式化数值 · 自定义单元格 · 排序 · 行选择 · 行详情 · 分组 · 分页 · 加载、错误和空状态 · 固定列、宽度与可见性 · 连续滚动 · 通过 CSS 部件设置样式
