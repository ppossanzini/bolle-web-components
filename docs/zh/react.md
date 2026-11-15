[Italiano](../it/react.md) · [English](../en/react.md) · [Français](../fr/react.md) · [中文](./react.md)

# React · 完整使用示例

本指南涵盖组件库的全部 36 个组件，并为每个组件提供一个 React 示例。属性、slot、事件和方法的参考与 Vue 指南相同：[vue.md](./vue.md)。本文介绍 React 特有的规则和代码。

推荐的基线版本是 React 19。在 React 18 中，只需改变非字符串属性和布尔属性的传递方式，示例同样可以运行（见下文）。

## 安装与注册

```sh
npm install @bolle/web-components
```

```tsx
// src/main.tsx
import "@bolle/web-components/tokens.css";
import "@bolle/web-components/typography.css";
import "@bolle/web-components"; // registra tutti i tag bolle-*
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
      if (key in node) (node as unknown as Record<string, unknown>)[key] = value;
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
useBolleEvent(field, "value-input", ({ value }: { value: string }) => setEmail(value));

<bolle-text-field ref={field} label="Email" value={email} />

const terms = useRef<BolleCheckbox | null>(null);
useBolleEvent(terms, "change", ({ checked }: { checked: boolean }) => setAccepted(checked));
<bolle-checkbox ref={terms} label="Accetto" checked={accepted} />
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
        items?: import("@bolle/web-components").BolleItem[];
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

## 操作（Actions）

### bolle-button

```tsx
export function ButtonExamples() {
  const [expanded, setExpanded] = useState(false);
  const [submitted, setSubmitted] = useState("");
  const toggle = useRef<BolleButton | null>(null);
  useBolleEvent(toggle, "change", ({ selected }: { selected: boolean }) =>
    setExpanded(selected),
  );

  const variants = ["filled", "tonal", "filled-tonal", "outlined", "elevated", "text", "standard"] as const;
  const sizes = ["xs", "small", "medium", "large", "xl"] as const;

  return (
    <div>
      {variants.map((variant) => (
        <bolle-button key={variant} variant={variant}>{variant}</bolle-button>
      ))}
      {sizes.map((size) => (
        <bolle-button key={size} size={size} variant="tonal">{size}</bolle-button>
      ))}

      <bolle-button variant="outlined" shape="square">Quadrato</bolle-button>

      <bolle-button variant="filled">
        <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M11 5h2v14h-2zM5 11h14v2H5z" />
        </svg>
        Nuovo
      </bolle-button>

      <bolle-button
        ref={toggle}
        toggle
        haspopup="menu"
        selected={expanded}
        expanded={expanded}
        controls="pannello"
      >
        {expanded ? "Chiudi" : "Apri"}
      </bolle-button>

      <bolle-button href="https://example.com" target="_blank" variant="text">
        Documentazione
      </bolle-button>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(String(new FormData(event.currentTarget).get("azione")));
        }}
      >
        <bolle-button type="submit" name="azione" value="salva">Salva</bolle-button>
        <bolle-button type="reset" variant="outlined">Reimposta</bolle-button>
      </form>

      <bolle-button label="Aggiungi" disabled>Disabilitato</bolle-button>
      <output>{submitted}</output>
    </div>
  );
}
```

### bolle-icon-button

```tsx
export function IconButtonExamples() {
  const [pinned, setPinned] = useState(false);
  const pin = useRef<BolleIconButton | null>(null);
  useBolleEvent(pin, "change", ({ selected }: { selected: boolean }) =>
    setPinned(selected),
  );

  return (
    <div>
      {(["xs", "small", "medium", "large", "xl"] as const).map((size) => (
        <bolle-icon-button key={size} size={size} label={`Azione ${size}`}>
          <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
          </svg>
        </bolle-icon-button>
      ))}

      <bolle-icon-button width="narrow" label="Ristretto">★</bolle-icon-button>
      <bolle-icon-button width="wide" label="Largo">★</bolle-icon-button>
      <bolle-icon-button variant="tonal" shape="square" label="Quadrato">★</bolle-icon-button>

      <bolle-icon-button ref={pin} toggle selected={pinned} label="Fissa in alto">
        📌
      </bolle-icon-button>

      <bolle-icon-button haspopup="menu" expanded controls="menu-azioni" label="Altre azioni">
        ⋯
      </bolle-icon-button>
    </div>
  );
}
```

### bolle-floating-action-button

```tsx
const colors = [
  "primary-container",
  "secondary-container",
  "tertiary-container",
  "primary",
  "secondary",
  "tertiary",
  "surface",
] as const;

export function FabExamples() {
  return (
    <div>
      {colors.map((color) => (
        <bolle-floating-action-button key={color} color={color} label={`Crea (${color})`}>
          ＋
        </bolle-floating-action-button>
      ))}

      <bolle-floating-action-button size="small" label="Crea piccolo">＋</bolle-floating-action-button>
      <bolle-floating-action-button size="medium" color="tertiary" label="Crea medio">＋</bolle-floating-action-button>
      <bolle-floating-action-button size="large" color="secondary" label="Crea grande">＋</bolle-floating-action-button>
      <bolle-floating-action-button href="https://example.com" label="Apri collegamento">↗</bolle-floating-action-button>
      <bolle-floating-action-button label="Crea disabilitato" disabled>＋</bolle-floating-action-button>
    </div>
  );
}
```

### bolle-extended-fab

```tsx
export function ExtendedFabExamples() {
  return (
    <div>
      <bolle-extended-fab label="Nuovo documento" size="small" color="primary-container">
        Nuovo documento
      </bolle-extended-fab>
      <bolle-extended-fab label="Condividi" size="medium" color="tertiary">
        Condividi
      </bolle-extended-fab>
      <bolle-extended-fab label="Crea presentazione" size="large" color="secondary">
        <span slot="icon" aria-hidden="true">＋</span>
        Crea presentazione
      </bolle-extended-fab>
    </div>
  );
}
```

### bolle-button-group

```tsx
export function ButtonGroupExamples() {
  const [alignment, setAlignment] = useState("left");
  const [formats, setFormats] = useState<string[]>(["bold"]);
  const alignmentGroup = useRef<BolleButtonGroup | null>(null);
  const formatGroup = useRef<BolleButtonGroup | null>(null);

  useBolleEvent(alignmentGroup, "selection-change", ({ values }: { values: string[] }) =>
    setAlignment(values[0] ?? "left"),
  );
  useBolleEvent(formatGroup, "selection-change", ({ values }: { values: string[] }) =>
    setFormats(values),
  );

  return (
    <div>
      <bolle-button-group
        ref={alignmentGroup}
        label="Allineamento"
        variant="connected"
        selection="single"
        required
        size="small"
        shape="round"
      >
        {["left", "center", "right"].map((value) => (
          <bolle-button key={value} value={value} selected={alignment === value}>
            {value}
          </bolle-button>
        ))}
      </bolle-button-group>

      <bolle-button-group
        ref={formatGroup}
        label="Formato"
        variant="connected"
        selection="multiple"
        size="small"
      >
        {["bold", "italic", "underline"].map((value) => (
          <bolle-button key={value} value={value} selected={formats.includes(value)}>
            {value}
          </bolle-button>
        ))}
      </bolle-button-group>

      <bolle-button-group label="Gruppo semplice" variant="standard" selection="none" size="large">
        <bolle-button variant="outlined">A</bolle-button>
        <bolle-button variant="outlined">B</bolle-button>
      </bolle-button-group>
    </div>
  );
}
```

## 通信（Communication）

### bolle-badge

```tsx
export function BadgeExamples() {
  return (
    <div>
      <span className="badge-anchor">
        <bolle-icon-button label="Notifiche">🔔</bolle-icon-button>
        <bolle-badge
          value="12"
          style={{ position: "absolute", insetBlockStart: -4, insetInlineEnd: -4 }}
        />
      </span>

      <bolle-badge value={1200} max={999} label="Messaggi non letti" />
      <bolle-badge value="Nuovo" label="Novità" />
      <bolle-badge value="" label="Aggiornamento disponibile" small />
      <bolle-badge value="7" />
    </div>
  );
}
```

### bolle-progress-indicator

```tsx
export function ProgressExamples() {
  return (
    <div>
      <bolle-progress-indicator label="Download" value={65} />
      <bolle-progress-indicator label="Connessione" indeterminate />
      <bolle-progress-indicator label="Avanzamento pratica" value={35} max={50} />
      <bolle-progress-indicator wavy label="Avanzamento ondulato" value={60} />
      <bolle-progress-indicator wavy indeterminate label="Attesa ondulata" />
      <bolle-progress-indicator variant="circular" label="Caricamento file" value={65} />
      <bolle-progress-indicator variant="circular" indeterminate label="Attesa circolare" />
    </div>
  );
}
```

### bolle-loading-indicator

```tsx
export function LoadingExamples() {
  return (
    <div>
      <bolle-loading-indicator label="Caricamento" />
      <bolle-loading-indicator variant="contained" label="Caricamento allegati" />
    </div>
  );
}
```

### bolle-snackbar

```tsx
export function SnackbarExamples() {
  const snackbar = useRef<BolleSnackbar | null>(null);
  const [log, setLog] = useState("");

  useBolleEvent(snackbar, "closed", ({ reason }: { reason: string }) =>
    setLog(`chiuso: ${reason}`),
  );
  useBolleEvent(snackbar, "action", () => setLog("azione: annulla"));
  useBolleEvent(snackbar, "queued", ({ pending }: { pending: number }) =>
    setLog(`in coda: ${pending}`),
  );

  return (
    <div>
      <bolle-snackbar
        ref={snackbar}
        message="Documento eliminato"
        actionLabel="Annulla"
        closeLabel="Chiudi"
        duration={6000}
      />

      <bolle-button variant="tonal" onClick={() => snackbar.current?.show("Documento salvato")}>
        Mostra
      </bolle-button>
      <bolle-button
        variant="outlined"
        onClick={() => {
          snackbar.current?.show("Primo");
          snackbar.current?.show("Secondo");
          snackbar.current?.show("Terzo");
        }}
      >
        Accoda tre messaggi
      </bolle-button>
      <bolle-button variant="text" onClick={() => snackbar.current?.close("manuale")}>
        Chiudi
      </bolle-button>
      <output>{log}</output>
    </div>
  );
}
```

### bolle-tooltip

```tsx
export function TooltipExamples() {
  const tip = useRef<BolleTooltip | null>(null);

  return (
    <div>
      <bolle-tooltip label="Conserva una copia del documento">
        <bolle-button variant="tonal">Salva una copia</bolle-button>
      </bolle-tooltip>

      <bolle-tooltip
        ref={tip}
        variant="rich"
        persistent
        label="Spazio personale"
        supportingText="La copia resta nel tuo spazio e resta aperta finché non la chiudi."
      >
        <bolle-button variant="outlined">Dettagli</bolle-button>
        <p slot="content">Puoi riaprire la copia dalla sezione Documenti.</p>
        <bolle-button slot="actions" variant="text">Apri Documenti</bolle-button>
      </bolle-tooltip>

      <bolle-button variant="text" onClick={() => tip.current?.show()}>Mostra tooltip ricco</bolle-button>
      <bolle-button variant="text" onClick={() => tip.current?.hide()}>Nascondi</bolle-button>
    </div>
  );
}
```

### bolle-carousel

```tsx
export function CarouselExamples() {
  const [current, setCurrent] = useState(0);
  const carousel = useRef<BolleCarousel | null>(null);
  useBolleEvent(carousel, "change", ({ index }: { index: number }) =>
    setCurrent(index),
  );

  const variants = [
    "hero",
    "multi-browse",
    "uncontained",
    "uncontained-multi-aspect-ratio",
    "center-aligned-hero",
    "full-screen",
  ] as const;

  return (
    <div>
      <bolle-carousel
        ref={carousel}
        variant="hero"
        label="Documenti recenti"
        previousLabel="Precedente"
        nextLabel="Successivo"
        index={current}
      >
        <article><h3>Posta</h3><p>Messaggi ricevuti</p></article>
        <article><h3>Archivio</h3><p>Documenti salvati</p></article>
        <article><h3>Impostazioni</h3><p>Preferenze personali</p></article>
      </bolle-carousel>

      {variants.map((variant) => (
        <bolle-carousel
          key={variant}
          variant={variant}
          label={`Carousel ${variant}`}
          previousLabel="Precedente"
          nextLabel="Successivo"
        >
          <article>A · {variant}</article>
          <article>B · {variant}</article>
          <article>C · {variant}</article>
        </bolle-carousel>
      ))}

      <bolle-button variant="outlined" onClick={() => carousel.current?.goTo(0)}>
        Prima slide
      </bolle-button>
      <bolle-button variant="outlined" onClick={() => carousel.current?.goTo(2)}>
        Ultima slide
      </bolle-button>
      <output>{current + 1}</output>
    </div>
  );
}
```

## 容器（Containment）

### bolle-card

```tsx
export function CardExamples() {
  return (
    <div>
      {(["filled", "elevated", "outlined"] as const).map((variant) => (
        <bolle-card key={variant} variant={variant} label={`Scheda ${variant}`}>
          <h3>Documento</h3>
          <p>Contenuto indipendente con un'azione interna.</p>
          <bolle-button variant="text">Apri</bolle-button>
        </bolle-card>
      ))}

      <bolle-card orientation="horizontal" href="https://example.com" label="Rapporto annuale">
        <img slot="media" src="/cover.jpg" alt="Copertina del rapporto" />
        <h3>Rapporto annuale</h3>
        <p>Riepilogo delle attività dell'anno.</p>
      </bolle-card>
    </div>
  );
}
```

### bolle-dialog

```tsx
export function DialogExamples() {
  const confirm = useRef<BolleDialog | null>(null);
  const fullscreen = useRef<BolleDialog | null>(null);
  const nonModal = useRef<BolleDialog | null>(null);
  const proposal = useRef<BolleDialog | null>(null);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [dirty] = useState(true);
  const [result, setResult] = useState("");

  useBolleEvent(confirm, "before-close", (_detail, event) => {
    if (dirty) event.preventDefault();
  });
  useBolleEvent(confirm, "closed", ({ returnValue }: { returnValue?: string }) =>
    setResult(returnValue ?? ""),
  );
  useBolleEvent(proposal, "closed", ({ returnValue }: { returnValue?: string }) => {
    setProposalOpen(false);
    setResult(returnValue ?? "");
  });

  return (
    <div>
      <bolle-button variant="filled" onClick={() => confirm.current?.show()}>
        Elimina
      </bolle-button>
      <bolle-dialog
        ref={confirm}
        label="Eliminare il documento?"
        variant="basic"
        modal
        closeLabel="Annulla"
      >
        <p>L'operazione non può essere annullata.</p>
        <bolle-button slot="actions" variant="text" onClick={() => confirm.current?.close("elimina")}>
          Elimina
        </bolle-button>
      </bolle-dialog>

      <bolle-button variant="outlined" onClick={() => fullscreen.current?.show()}>
        Apri a schermo intero
      </bolle-button>
      <bolle-dialog ref={fullscreen} variant="full-screen" label="Editor" closeLabel="Chiudi">
        <p>Contenuto a schermo intero.</p>
        <bolle-button slot="actions" onClick={() => fullscreen.current?.close("salvato")}>
          Salva
        </bolle-button>
      </bolle-dialog>

      <bolle-button variant="text" onClick={() => nonModal.current?.show()}>
        Dialog non modale
      </bolle-button>
      <bolle-dialog ref={nonModal} modal={false} label="Nota" closeLabel="Chiudi">
        <p>Questo dialog non blocca il resto della pagina.</p>
      </bolle-dialog>

      <bolle-button variant="tonal" onClick={() => setProposalOpen(true)}>
        Dialog dichiarativo
      </bolle-button>
      <bolle-dialog
        ref={proposal}
        open={proposalOpen}
        label="Proposta"
        closeLabel="Chiudi"
      >
        <p>Controllato dalla proprietà open.</p>
      </bolle-dialog>
      <output>{result}</output>
    </div>
  );
}
```

### bolle-bottom-sheet

```tsx
export function BottomSheetExamples() {
  const sheet = useRef<BolleBottomSheet | null>(null);
  const [inlineOpen, setInlineOpen] = useState(true);
  const [result, setResult] = useState("");
  useBolleEvent(sheet, "closed", ({ returnValue }: { returnValue?: string }) =>
    setResult(returnValue ?? ""),
  );

  return (
    <div>
      <bolle-button variant="filled" onClick={() => sheet.current?.show()}>
        Apri foglio modale
      </bolle-button>
      <bolle-bottom-sheet ref={sheet} dragHandle label="Filtri" closeLabel="Chiudi">
        <p>Scegli i filtri da applicare.</p>
        <bolle-button slot="actions" onClick={() => sheet.current?.close("applica")}>
          Applica
        </bolle-button>
      </bolle-bottom-sheet>

      <bolle-bottom-sheet open={inlineOpen} variant="standard" dragHandle label="Filtri inline">
        <p>Foglio standard ancorato in basso.</p>
        <bolle-button variant="text" onClick={() => setInlineOpen(false)}>Chiudi</bolle-button>
      </bolle-bottom-sheet>
      <output>{result}</output>
    </div>
  );
}
```

### bolle-side-sheet

```tsx
export function SideSheetExamples() {
  const side = useRef<BolleSideSheet | null>(null);
  const [standardOpen, setStandardOpen] = useState(true);

  return (
    <div>
      <bolle-button variant="filled" onClick={() => side.current?.show()}>
        Apri pannello
      </bolle-button>
      <bolle-side-sheet ref={side} label="Dettagli" detached closeLabel="Chiudi">
        <p>Dettagli del documento selezionato.</p>
        <bolle-button slot="actions" onClick={() => side.current?.close("salvato")}>
          Salva
        </bolle-button>
      </bolle-side-sheet>

      <bolle-side-sheet
        open={standardOpen}
        variant="standard"
        detached
        label="Dettagli inline"
      >
        <p>Pannello standard sempre visibile accanto al contenuto.</p>
        <bolle-button variant="text" onClick={() => setStandardOpen(false)}>Chiudi</bolle-button>
      </bolle-side-sheet>
    </div>
  );
}
```

### bolle-divider

```tsx
export function DividerExamples() {
  return (
    <div>
      <bolle-divider />
      <bolle-divider inset />
      <bolle-divider variant="inset-start" />
      <bolle-divider variant="inset-end" />
      <bolle-divider decorative />

      <div style={{ display: "flex", blockSize: 120, alignItems: "center", gap: 8 }}>
        <span>Prima</span>
        <bolle-divider vertical />
        <span>Dopo</span>
      </div>
      <div style={{ display: "flex", blockSize: 120, alignItems: "center", gap: 8 }}>
        <span>Prima</span>
        <bolle-divider vertical decorative />
        <span>Dopo</span>
      </div>
    </div>
  );
}
```

## 导航（Navigation）

### bolle-app-bar

```tsx
export function AppBarExamples() {
  const [scrolled, setScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const variants = ["small", "center-aligned", "medium", "medium-flexible", "large", "large-flexible"] as const;

  return (
    <div>
      <bolle-app-bar
        label="Posta"
        variant="small"
        subtitle="12 non letti"
        alignment="leading"
        sticky
        scrolled={scrolled}
        collapsed={collapsed}
      >
        <bolle-icon-button slot="leading" label="Menu">☰</bolle-icon-button>
        <bolle-icon-button slot="trailing" label="Cerca">🔍</bolle-icon-button>
      </bolle-app-bar>

      {variants.map((variant) => (
        <bolle-app-bar
          key={variant}
          variant={variant}
          label={`Posta ${variant}`}
          subtitle="12 non letti"
          collapsed={collapsed}
        >
          <bolle-icon-button slot="leading" label="Menu">☰</bolle-icon-button>
        </bolle-app-bar>
      ))}

      <bolle-app-bar variant="search">
        <bolle-search label="Cerca" placeholder="Cerca nella posta">
          <span slot="leading" aria-hidden="true">🔍</span>
        </bolle-search>
      </bolle-app-bar>

      <bolle-button variant="outlined" onClick={() => setScrolled((value) => !value)}>
        Alterna scrolled
      </bolle-button>
      <bolle-button variant="outlined" onClick={() => setCollapsed((value) => !value)}>
        Alterna collapsed
      </bolle-button>
    </div>
  );
}
```

### bolle-toolbar

```tsx
export function ToolbarExamples() {
  return (
    <div>
      <bolle-toolbar label="Formato" variant="docked" orientation="horizontal" color="standard">
        <bolle-icon-button label="Grassetto" toggle>B</bolle-icon-button>
        <bolle-icon-button label="Corsivo" toggle>I</bolle-icon-button>
        <bolle-icon-button label="Sottolineato" toggle>U</bolle-icon-button>
        <bolle-divider vertical decorative />
        <bolle-icon-button label="Allinea a sinistra">≡</bolle-icon-button>
      </bolle-toolbar>

      <bolle-toolbar label="Modifica" color="vibrant">
        <bolle-icon-button label="Taglia" variant="standard">✂</bolle-icon-button>
        <bolle-icon-button label="Copia" variant="standard">⧉</bolle-icon-button>
        <bolle-icon-button label="Incolla" variant="standard">📋</bolle-icon-button>
      </bolle-toolbar>

      <bolle-toolbar label="Formato" variant="floating">
        <bolle-icon-button label="Grassetto" toggle>B</bolle-icon-button>
        <bolle-icon-button label="Corsivo" toggle>I</bolle-icon-button>
      </bolle-toolbar>

      <bolle-toolbar label="Allineamento" variant="floating" orientation="vertical">
        <bolle-icon-button label="Su">↑</bolle-icon-button>
        <bolle-icon-button label="Giù">↓</bolle-icon-button>
      </bolle-toolbar>
    </div>
  );
}
```

### bolle-navigation-bar

```tsx
const destinations: BolleItem[] = [
  { id: "inbox", label: "Posta", icon: "inbox" },
  { id: "archive", label: "Archivio", icon: "archive", href: "/archivio" },
  { id: "settings", label: "Impostazioni", icon: "settings" },
  { id: "trash", label: "Cestino", icon: "trash", disabled: true },
];

export function NavigationBarExamples() {
  const [current, setCurrent] = useState("inbox");
  const bar = useRef<BolleNavigationBar | null>(null);
  const flexible = useRef<BolleNavigationBar | null>(null);
  useBolleEvent(bar, "navigate", ({ id }: { id: string }) => setCurrent(id));
  useBolleEvent(flexible, "navigate", ({ id }: { id: string }) => setCurrent(id));

  return (
    <div>
      <bolle-navigation-bar
        ref={bar}
        label="Navigazione principale"
        items={destinations}
        value={current}
        variant="standard"
        layout="vertical"
      />
      <bolle-navigation-bar
        ref={flexible}
        label="Navigazione flessibile"
        items={destinations}
        value={current}
        variant="flexible"
        layout="horizontal"
      />
      <output>{current}</output>
    </div>
  );
}
```

### bolle-navigation-rail

```tsx
// `destinations` è lo stesso array della sezione bolle-navigation-bar.
export function NavigationRailExamples() {
  const [current, setCurrent] = useState("inbox");
  const rail = useRef<BolleNavigationRail | null>(null);
  useBolleEvent(rail, "navigate", ({ id }: { id: string }) => setCurrent(id));

  return (
    <div>
      <bolle-navigation-rail
        ref={rail}
        label="Rail compresso"
        items={destinations}
        value={current}
      />
      <bolle-navigation-rail
        expanded
        variant="standard"
        layout="vertical"
        label="Rail espanso"
        items={destinations}
        value={current}
      />
    </div>
  );
}
```

### bolle-navigation-drawer

```tsx
// `destinations` è lo stesso array della sezione bolle-navigation-bar.
export function NavigationDrawerExamples() {
  const [current, setCurrent] = useState("inbox");
  const [standardOpen, setStandardOpen] = useState(true);
  const drawer = useRef<BolleNavigationDrawer | null>(null);
  useBolleEvent(drawer, "navigate", ({ id }: { id: string }) => setCurrent(id));

  return (
    <div>
      <bolle-button variant="filled" onClick={() => drawer.current?.show()}>
        Apri drawer
      </bolle-button>
      <bolle-navigation-drawer
        ref={drawer}
        label="Sezioni"
        closeLabel="Chiudi"
        items={destinations}
        value={current}
      >
        <p>Contenuto aggiuntivo del drawer.</p>
      </bolle-navigation-drawer>

      <bolle-navigation-drawer
        open={standardOpen}
        variant="standard"
        detached
        label="Sezioni standard"
        items={destinations}
        value={current}
      >
        <bolle-button variant="text" onClick={() => setStandardOpen(false)}>Chiudi</bolle-button>
      </bolle-navigation-drawer>
    </div>
  );
}
```

### bolle-tabs

```tsx
const primaryTabs: BolleItem[] = [
  { id: "inbox", label: "Posta", icon: "inbox", badge: "3" },
  { id: "archive", label: "Archivio", icon: "archive" },
  { id: "settings", label: "Preferenze", icon: "settings" },
  { id: "trash", label: "Cestino", icon: "trash", disabled: true },
];

const manyTabs: BolleItem[] = Array.from({ length: 8 }, (_, index) => ({
  id: `s${index}`,
  label: `Vista ${index + 1}`,
}));

export function TabsExamples() {
  const [tab, setTab] = useState("inbox");
  const [manyTab, setManyTab] = useState("s0");
  const tabs = useRef<BolleTabs | null>(null);
  const secondary = useRef<BolleTabs | null>(null);
  const scrollTabs = useRef<BolleTabs | null>(null);
  useBolleEvent(tabs, "change", ({ value }: { value: string }) => setTab(value));
  useBolleEvent(secondary, "change", ({ value }: { value: string }) => setTab(value));
  useBolleEvent(scrollTabs, "change", ({ value }: { value: string }) => setManyTab(value));

  return (
    <div>
      <bolle-tabs
        ref={tabs}
        label="Categorie"
        items={primaryTabs}
        value={tab}
        variant="primary"
        activation="automatic"
        scrollable={false}
      >
        <p slot="inbox">Messaggi ricevuti.</p>
        <p slot="archive">Documenti salvati.</p>
        <p slot="settings">Preferenze personali.</p>
        <p slot="trash">Elementi eliminati.</p>
      </bolle-tabs>

      <bolle-tabs
        ref={secondary}
        label="Dettagli"
        items={primaryTabs}
        value={tab}
        variant="secondary"
        activation="manual"
      >
        <p slot="inbox">Scheda secondaria.</p>
        <p slot="archive">Archivio secondario.</p>
        <p slot="settings">Impostazioni secondarie.</p>
        <p slot="trash">Cestino secondario.</p>
      </bolle-tabs>

      <bolle-tabs
        ref={scrollTabs}
        label="Viste scorrevoli"
        items={manyTabs}
        value={manyTab}
        scrollable
      >
        {manyTabs.map((item) => (
          <p key={item.id} slot={item.id}>{item.label}</p>
        ))}
      </bolle-tabs>
    </div>
  );
}
```

## 选择（Selection）

### bolle-checkbox

```tsx
export function CheckboxExamples() {
  const [terms, setTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const termsField = useRef<BolleCheckbox | null>(null);
  const newsletterField = useRef<BolleCheckbox | null>(null);
  useBolleEvent(termsField, "change", ({ checked }: { checked: boolean }) =>
    setTerms(checked),
  );
  useBolleEvent(newsletterField, "change", ({ checked }: { checked: boolean }) =>
    setNewsletter(checked),
  );

  return (
    <form>
      <bolle-checkbox
        ref={termsField}
        label="Accetto i termini"
        name="terms"
        value="si"
        required
        checked={terms}
        supportingText="Puoi revocare il consenso in qualsiasi momento."
      />
      <bolle-checkbox
        ref={newsletterField}
        name="newsletter"
        value="si"
        checked={newsletter}
        label="Newsletter"
      />
      <bolle-checkbox indeterminate label="Selezione parziale" />
      <bolle-checkbox checked disabled label="Disabilitata" />
      <bolle-checkbox
        checked
        error
        required
        label="Campo con errore"
        supportingText="Devi accettare per continuare."
      />
    </form>
  );
}
```

该组件的 `change` 事件不是浏览器的原生事件：必须始终通过 ref 用 `useBolleEvent` 绑定，就像两个受控字段那样。

### bolle-switch

```tsx
export function SwitchExamples() {
  const [wifi, setWifi] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const wifiSwitch = useRef<BolleSwitch | null>(null);
  const notificationsSwitch = useRef<BolleSwitch | null>(null);
  useBolleEvent(wifiSwitch, "change", ({ checked }: { checked: boolean }) =>
    setWifi(checked),
  );
  useBolleEvent(notificationsSwitch, "change", ({ checked }: { checked: boolean }) =>
    setNotifications(checked),
  );

  return (
    <div>
      <bolle-switch
        ref={wifiSwitch}
        label="Wi-Fi"
        name="wifi"
        value="on"
        checked={wifi}
        icon="🔅"
        iconSelected="🔆"
      />
      <bolle-switch
        ref={notificationsSwitch}
        label="Notifiche"
        checked={notifications}
        supportingText="Ricevi un avviso per ogni aggiornamento."
      />
      <bolle-switch checked disabled label="Bluetooth disabilitato" />
      <bolle-switch checked error required label="Con errore" supportingText="Azione richiesta." />
    </div>
  );
}
```

`icon` 和 `iconSelected` 只作为 property 存在（没有对应的 attribute）：React 19 能正确赋值。在 React 18 中请使用 `useBolleProps(switchRef, { icon, iconSelected })`。

### bolle-radio-button

```tsx
export function RadioExamples() {
  const [plan, setPlan] = useState("standard");
  const group = useRef<HTMLDivElement | null>(null);
  useBolleEvent(group, "change", ({ value }: { value: string }) => setPlan(value));

  return (
    <form ref={group}>
      {["standard", "plus", "enterprise"].map((option) => (
        <bolle-radio-button
          key={option}
          name="plan"
          value={option}
          label={option}
          checked={plan === option}
          required
        />
      ))}
      <bolle-radio-button name="plan" value="legacy" label="Legacy" disabled />
      <bolle-radio-button name="locale" value="it" label="Italiano" checked />
      <bolle-radio-button name="locale" value="en" label="Inglese" />
    </form>
  );
}
```

监听器放在容器上，而不是单个 radio 上：这样可以接收整个分组的 `change`。

### bolle-chip

```tsx
export function ChipExamples() {
  const [favorite, setFavorite] = useState(false);
  const [cities, setCities] = useState(["Roma"]);
  const [log, setLog] = useState("");
  const chips = useRef<HTMLDivElement | null>(null);

  useBolleEvent(chips, "action", () => setLog("assist"));
  useBolleEvent(chips, "change", ({ selected }: { selected: boolean }) =>
    setFavorite(selected),
  );
  useBolleEvent(chips, "remove", (_detail, event) => {
    const label = (event.target as BolleChip).label;
    setCities((current) => current.filter((city) => city !== label));
  });

  return (
    <div ref={chips}>
      <bolle-chip variant="assist" label="Aggiungi al calendario" />
      <bolle-chip
        variant="filter"
        name="filters"
        value="favorite"
        label="Preferiti"
        selected={favorite}
      />
      <bolle-chip variant="filter" name="filters" value="unread" label="Solo non letti" />
      <bolle-chip variant="filter" elevated label="Elevata" />

      {cities.map((city) => (
        <bolle-chip
          key={city}
          variant="input"
          label={city}
          removable
          removeLabel={`Rimuovi ${city}`}
        >
          <span slot="avatar" aria-hidden="true">{city.slice(0, 2)}</span>
        </bolle-chip>
      ))}

      <bolle-chip variant="suggestion" label="Grazie!">
        <span slot="icon" aria-hidden="true">✓</span>
      </bolle-chip>
      <bolle-chip variant="assist" href="https://example.com" label="Apri collegamento">
        <span slot="icon" aria-hidden="true">↗</span>
      </bolle-chip>
      <bolle-chip variant="assist" label="Disabilitata" disabled />
      <output>{log}</output>
    </div>
  );
}
```

只有 `filter` 变体会通过 `name` 和 `value` 参与表单提交。

### bolle-list

```tsx
const listItems: BolleItem[] = [
  { id: "inbox", label: "Posta", icon: "inbox", supportingText: "Messaggi ricevuti" },
  { id: "archive", label: "Archivio", icon: "archive", href: "/archivio" },
  {
    id: "folders",
    label: "Cartelle",
    icon: "folder",
    items: [
      { id: "work", label: "Lavoro" },
      { id: "home", label: "Casa" },
    ],
  },
  { id: "trash", label: "Cestino", icon: "trash", disabled: true },
  { id: "pinned", label: "Fissati", icon: "pin", selected: true },
];

export function ListExamples() {
  const [single, setSingle] = useState("inbox");
  const [multiple, setMultiple] = useState<string[]>(["inbox"]);
  const [expanded, setExpanded] = useState<string[]>(["folders"]);
  const [log, setLog] = useState("");
  const singleList = useRef<BolleList | null>(null);
  const multiList = useRef<BolleList | null>(null);
  const actionList = useRef<BolleList | null>(null);

  useBolleEvent(singleList, "change", ({ value }: { value: string }) => setSingle(value));
  useBolleEvent(singleList, "expand", ({ id, expanded: open }: { id: string; expanded: boolean }) =>
    setExpanded((current) => (open ? [...current, id] : current.filter((value) => value !== id))),
  );
  useBolleEvent(multiList, "change", ({ value }: { value: string[] }) => setMultiple(value));
  useBolleEvent(actionList, "action", ({ id }: { id: string }) => setLog(`azione ${id}`));

  return (
    <div>
      <bolle-list
        ref={singleList}
        label="Selezione singola"
        variant="standard"
        interactive
        selection="single"
        items={listItems}
        value={single}
        expanded={expanded}
      />
      <bolle-list
        ref={multiList}
        label="Selezione multipla"
        variant="segmented"
        selection="multiple"
        items={listItems}
        value={multiple}
      />
      <bolle-list
        ref={actionList}
        label="Azioni"
        interactive
        selection="none"
        items={listItems}
      />
      <bolle-list label="Statico con link" selection="none" items={listItems}>
        <li><div className="list-item">Riga personalizzata</div></li>
      </bolle-list>
      <output>{log}</output>
    </div>
  );
}
```

### bolle-segmented-buttons

```tsx
const segments: BolleItem[] = [
  { id: "inbox", label: "Posta", icon: "inbox" },
  { id: "archive", label: "Archivio", icon: "archive" },
  { id: "settings", label: "Impostazioni", icon: "settings" },
  { id: "trash", label: "Cestino", icon: "trash", disabled: true },
];

export function SegmentedExamples() {
  const [view, setView] = useState("inbox");
  const [filters, setFilters] = useState<string[]>(["inbox", "archive"]);
  const single = useRef<BolleSegmentedButtons | null>(null);
  const multi = useRef<BolleSegmentedButtons | null>(null);
  useBolleEvent(single, "change", ({ value }: { value: string }) => setView(value));
  useBolleEvent(multi, "change", ({ values }: { values: string[] }) => setFilters(values));

  return (
    <form>
      <bolle-segmented-buttons
        ref={single}
        label="Vista"
        name="view"
        items={segments}
        value={view}
        required
      />
      <bolle-segmented-buttons
        ref={multi}
        label="Filtri"
        name="filters"
        multiple
        items={segments}
        values={filters}
      />
      <bolle-segmented-buttons label="Disabilitati" name="disabled" items={segments} value="inbox" disabled />
    </form>
  );
}
```

### bolle-slider

```tsx
export function SliderExamples() {
  const [volume, setVolume] = useState("40");
  const [balance, setBalance] = useState("60");
  const [price, setPrice] = useState("20");
  const [upper, setUpper] = useState(80);
  const [brightness, setBrightness] = useState("40");
  const volumeSlider = useRef<BolleSlider | null>(null);
  const balanceSlider = useRef<BolleSlider | null>(null);
  const range = useRef<BolleSlider | null>(null);
  const brightnessSlider = useRef<BolleSlider | null>(null);

  useBolleEvent(volumeSlider, "value-input", ({ value }: { value: string }) => setVolume(value));
  useBolleEvent(balanceSlider, "value-input", ({ value }: { value: string }) => setBalance(value));
  useBolleEvent(brightnessSlider, "value-input", ({ value }: { value: string }) => setBrightness(value));
  useBolleEvent(range, "value-input", ({ value, upperValue }: { value: string; upperValue?: number }) => {
    setPrice(value);
    setUpper(upperValue ?? upper);
  });

  return (
    <div>
      <bolle-slider
        ref={volumeSlider}
        name="volume"
        label="Volume"
        value={volume}
        min={0}
        max={100}
        step={1}
        variant="continuous"
        size="xs"
        orientation="horizontal"
        showValue
      />
      <bolle-slider
        ref={balanceSlider}
        label="Bilanciamento"
        variant="centered"
        value={balance}
        showValue
      />
      <bolle-slider
        ref={range}
        label="Prezzo"
        name="price"
        variant="range"
        value={price}
        upperValue={upper}
        upperLabel="Massimo"
        showValue
        required
      />
      <bolle-slider
        ref={brightnessSlider}
        label="Luminosità"
        value={brightness}
        showValue
        iconStart="🔅"
        iconEnd="🔆"
      />
      <bolle-slider label="Passo 10 con indicatori" step={10} value="40" showValue stops />
      <bolle-slider label="Small" size="small" value="30" />
      <bolle-slider label="Large" size="large" value="70" />
      <bolle-slider label="Verticale" orientation="vertical" value="50" />
      <bolle-slider label="Disabilitato" value="20" disabled />
    </div>
  );
}
```

`iconStart` 和 `iconEnd` 是 property：React 19 会直接赋值；在 React 18 中请使用 `useBolleProps`。

## 文本与输入（Text and input）

### bolle-text-field

```tsx
export function TextFieldExamples() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const field = useRef<BolleTextField | null>(null);
  const bio = useRef<BolleTextField | null>(null);
  const emailError = email.length > 0 && !email.includes("@");

  useBolleEvent(field, "value-input", ({ value }: { value: string }) => setEmail(value));
  useBolleEvent(bio, "value-input", ({ value }: { value: string }) => setMessage(value));

  return (
    <form>
      <bolle-text-field
        ref={field}
        name="email"
        label="Email"
        type="email"
        variant="outlined"
        placeholder="nome@dominio.it"
        autocomplete="email"
        maxlength={120}
        counter
        required
        value={email}
        error={emailError}
        supportingText="Useremo questo indirizzo per le notifiche."
      >
        <span slot="leading" aria-hidden="true">✉</span>
        <span slot="trailing" aria-hidden="true">?</span>
      </bolle-text-field>

      <bolle-text-field label="Nome utente" variant="filled" prefix="@" maxlength={30} counter />
      <bolle-text-field label="Prezzo" type="number" min="0" max="9999" step="0.01" prefix="€" suffix="EUR" value="12.50" />
      <bolle-text-field
        ref={bio}
        label="Messaggio"
        multiline
        rows={4}
        maxlength={200}
        counter
        value={message}
      />
      <bolle-text-field label="Solo lettura" readonly value="Valore bloccato" />
      <bolle-text-field label="Quantità" type="number" min="1" max="10" step="1" value="2" />
      <bolle-text-field label="Codice" pattern="[A-Z]{3}[0-9]{3}" value="ABC123" supportingText="Tre lettere e tre cifre." />
      <bolle-text-field label="Data" type="date" min="2026-01-01" max="2026-12-31" />
      <bolle-text-field label="Ricerca" type="search" placeholder="Cerca" />
      <bolle-text-field label="Disabilitato" disabled value="Non modificabile" />
    </form>
  );
}
```

### bolle-search

```tsx
const allCities = ["Bologna", "Bolzano", "Firenze", "Genova", "Milano", "Napoli", "Roma", "Torino"];

export function SearchExamples() {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState(allCities);
  const [lastSearch, setLastSearch] = useState("");
  const search = useRef<BolleSearch | null>(null);

  useBolleEvent(search, "value-input", ({ value }: { value: string }) => setQuery(value));
  useBolleEvent(search, "suggest", ({ value }: { value: string }) =>
    setCities(allCities.filter((city) => city.toLowerCase().includes(value.toLowerCase()))),
  );
  useBolleEvent(search, "search", ({ value }: { value: string }) => setLastSearch(value));

  return (
    <div>
      <bolle-search
        label="Cerca documenti"
        placeholder="Titolo o autore"
        appearance="contained"
        layout="docked"
        value={query}
        suggestions={[]}
        suggestionDelay={0}
      >
        <span slot="leading" aria-hidden="true">🔍</span>
        <span slot="trailing" aria-hidden="true">⌘K</span>
        <bolle-list
          slot="results"
          label="Risultati"
          selection="none"
          items={[
            { id: "r1", label: "Roma", supportingText: "Capitale d'Italia" },
            { id: "r2", label: "Torino", supportingText: "Capoluogo piemontese" },
          ]}
        />
      </bolle-search>

      <bolle-search appearance="divided" label="Cerca nel testo" placeholder="Parola chiave" />
      <bolle-search layout="full-screen" label="Cerca ovunque" placeholder="Cerca ovunque" />

      <bolle-search
        ref={search}
        filter
        label="Cerca città"
        placeholder="Scrivi una città"
        suggestionsLabel="Suggerimenti"
        suggestionDelay={150}
        suggestions={cities}
      />
      <output>{lastSearch}</output>
    </div>
  );
}
```

### bolle-date-picker

```tsx
export function DatePickerExamples() {
  const [appointment, setAppointment] = useState("2026-11-11");
  const [rangeStart, setRangeStart] = useState("2026-11-01");
  const [rangeEnd, setRangeEnd] = useState("2026-11-20");
  const single = useRef<BolleDatePicker | null>(null);
  const range = useRef<BolleDatePicker | null>(null);

  useBolleEvent(single, "change", ({ value }: { value: string }) => setAppointment(value));
  useBolleEvent(range, "change", ({ value, endValue }: { value: string; endValue: string }) => {
    setRangeStart(value);
    setRangeEnd(endValue);
  });

  return (
    <form>
      <bolle-date-picker
        ref={single}
        label="Data appuntamento"
        name="appointment"
        locale="it"
        variant="modal"
        selectionMode="single"
        min="2026-01-01"
        max="2026-12-31"
        required
        value={appointment}
        supportingText="Seleziona un giorno lavorativo."
      />

      <bolle-date-picker
        ref={range}
        label="Periodo"
        name="period"
        locale="it"
        selectionMode="range"
        value={rangeStart}
        endValue={rangeEnd}
      />

      <bolle-date-picker
        variant="docked"
        label="Calendario sempre visibile"
        locale="it"
        selectionMode="single"
        value={appointment}
        weekStartsOn={1}
        labels={{ previous: "Mese precedente", next: "Mese successivo" }}
      />

      <bolle-date-picker label="Disabilitato" disabled value="2026-11-11" />
    </form>
  );
}
```

### bolle-time-picker

```tsx
export function TimePickerExamples() {
  const [time, setTime] = useState("09:30");
  const [evening, setEvening] = useState("18:45");
  const dial = useRef<BolleTimePicker | null>(null);
  const twelve = useRef<BolleTimePicker | null>(null);

  useBolleEvent(dial, "change", ({ value }: { value: string }) => setTime(value));
  useBolleEvent(twelve, "change", ({ value }: { value: string }) => setEvening(value));

  return (
    <form>
      <bolle-time-picker
        ref={dial}
        label="Ora promemoria"
        name="time"
        variant="dial"
        hourCycle={24}
        locale="it"
        required
        value={time}
      />
      <bolle-time-picker
        ref={twelve}
        label="Ora in formato 12"
        variant="dial"
        hourCycle={12}
        locale="it"
        value={evening}
        labels={{ period: "AM o PM", hour: "Ora", minute: "Minuti" }}
      />
      <bolle-time-picker label="Inserimento da tastiera" variant="input" hourCycle={24} value="08:15" />
      <bolle-time-picker label="Disabilitato" disabled value="07:00" />
    </form>
  );
}
```

## 菜单（Menu）

### bolle-menu

```tsx
const documentItems: MenuEntry[] = [
  {
    group: true,
    label: "Modifica",
    items: [
      { id: "undo", label: "Annulla", icon: "undo", trailingText: "⌘Z" },
      { id: "redo", label: "Ripeti", icon: "redo", trailingText: "⇧⌘Z", disabled: true },
    ],
  },
  { separator: true },
  {
    id: "share",
    label: "Condividi",
    icon: "share",
    children: [
      { id: "link", label: "Copia collegamento" },
      { id: "email", label: "Invia per email" },
    ],
  },
  { id: "open", label: "Apri in nuova scheda", href: "https://example.com" },
  { id: "download", label: "Scarica", icon: "download", badge: "PDF" },
];

const filterItems: MenuEntry[] = [
  { id: "unread", label: "Non letti", selected: true },
  { id: "flagged", label: "Con stella" },
  { id: "attachments", label: "Con allegati", supportingText: "Almeno un file" },
];

const baselineItems: MenuEntry[] = [
  { id: "copy", label: "Copia" },
  { id: "paste", label: "Incolla", disabled: true },
];

export function MenuExamples() {
  const actions = useRef<BolleMenu | null>(null);
  const filters = useRef<BolleMenu | null>(null);
  const baseline = useRef<BolleMenu | null>(null);
  const [last, setLast] = useState("");

  const onSelect = ({ item, selectedIds }: { item: { label: string }; selectedIds: string[] }) =>
    setLast(`${item.label} (${selectedIds.join(", ")})`);

  useBolleEvent(actions, "menu-select", onSelect);
  useBolleEvent(filters, "menu-select", onSelect);
  useBolleEvent(baseline, "menu-select", onSelect);
  useBolleEvent(actions, "menu-open", () => setLast("menu aperto"));
  useBolleEvent(actions, "menu-close", () => setLast("menu chiuso"));

  function open(
    menu: BolleMenu | null,
    event: React.MouseEvent,
    options?: { last?: boolean; x?: number; y?: number },
  ) {
    menu?.show(event.currentTarget as HTMLElement, options);
  }

  return (
    <div>
      <bolle-button haspopup="menu" onClick={(event) => open(actions.current, event)}>
        Azioni
      </bolle-button>
      <bolle-menu
        ref={actions}
        menuLabel="Azioni documento"
        variant="vertical"
        colorScheme="standard"
        selectionMode="none"
        quick={false}
        density={0}
        inactive={false}
        items={documentItems}
      />

      <bolle-button
        variant="tonal"
        haspopup="menu"
        onClick={(event) => open(filters.current, event, { last: true })}
      >
        Filtri
      </bolle-button>
      <bolle-menu
        ref={filters}
        menuLabel="Filtri contenuti"
        colorScheme="vibrant"
        selectionMode="multi"
        density={-1}
        items={filterItems}
      />

      <bolle-button
        variant="outlined"
        haspopup="menu"
        onClick={(event) => open(baseline.current, event, { x: 120, y: 160 })}
      >
        Menu baseline a coordinate
      </bolle-button>
      <bolle-button variant="text" onClick={() => actions.current?.close()}>
        Chiudi menu azioni
      </bolle-button>
      <bolle-menu ref={baseline} menuLabel="Azioni rapide" variant="baseline" items={baselineItems} />
      <output>{last}</output>
    </div>
  );
}
```

### bolle-fab-menu

```tsx
const fabItems: BolleItem[] = [
  { id: "note", label: "Nota", icon: "note" },
  { id: "folder", label: "Cartella", icon: "folder" },
  { id: "upload", label: "Carica file", icon: "upload" },
  { id: "event", label: "Evento", icon: "calendar", disabled: true },
];

export function FabMenuExamples() {
  const [log, setLog] = useState("");
  const fab = useRef<BolleFabMenu | null>(null);
  useBolleEvent(fab, "action", ({ id }: { id?: string }) => setLog(`crea ${id}`));

  return (
    <div>
      <bolle-fab-menu ref={fab} label="Crea" items={fabItems}>
        <span slot="icon" aria-hidden="true">＋</span>
      </bolle-fab-menu>
      <output>{log}</output>
    </div>
  );
}
```

### bolle-split-button

```tsx
const splitItems: MenuEntry[] = [
  { id: "later", label: "Invia più tardi" },
  { id: "draft", label: "Salva bozza" },
  { separator: true },
  { id: "template", label: "Usa modello" },
];

export function SplitButtonExamples() {
  const [log, setLog] = useState("");
  const variants = ["filled", "tonal", "outlined", "elevated"] as const;
  const sizes = ["xs", "small", "medium", "large", "xl"] as const;
  const split = useRef<BolleSplitButton | null>(null);

  useBolleEvent(split, "action", () => setLog("azione principale"));
  useBolleEvent(split, "menu-select", ({ item }: { item: { label: string } }) =>
    setLog(item.label),
  );
  useBolleEvent(split, "menu-open", () => setLog("menu aperto"));
  useBolleEvent(split, "menu-close", () => setLog("menu chiuso"));

  return (
    <div>
      {variants.map((variant) => (
        <bolle-split-button
          key={variant}
          variant={variant}
          label={`Invia ${variant}`}
          menuLabel={`Altre opzioni ${variant}`}
          items={splitItems}
        />
      ))}

      {sizes.map((size) => (
        <bolle-split-button
          key={size}
          size={size}
          label={size}
          menuLabel={`Altre opzioni ${size}`}
          items={splitItems}
        />
      ))}

      <bolle-split-button
        ref={split}
        label="Invia"
        menuLabel="Altre opzioni"
        items={splitItems}
      />
      <bolle-split-button label="Invia" menuLabel="Altre opzioni" disabled items={splitItems} />
      <output>{log}</output>
    </div>
  );
}
```

## 覆盖范围

| 分组          | 组件                                                                       |
| ------------- | -------------------------------------------------------------------------- |
| 操作          | button, icon-button, floating-action-button, extended-fab, button-group    |
| 通信          | badge, progress-indicator, loading-indicator, snackbar, tooltip, carousel  |
| 容器          | card, dialog, bottom-sheet, side-sheet, divider                            |
| 导航          | app-bar, toolbar, navigation-bar, navigation-rail, navigation-drawer, tabs |
| 选择          | checkbox, switch, radio-button, chip, list, segmented-buttons, slider      |
| 文本与输入    | text-field, search, date-picker, time-picker                               |
| 菜单          | menu, fab-menu, split-button                                               |






