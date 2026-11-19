[Italiano](../it/vue.md) · [English](../en/vue.md) · [Français](../fr/vue.md) · [中文](./vue.md)

# Vue 3 · 完整使用示例

本指南涵盖组件库的全部 36 个组件。每一节先列出公开的属性、slot、事件和方法，然后给出一个全部用到它们的 Vue 3 示例。示例假定使用 `<script setup lang="ts">` 以及 Vue 3.4 或更高版本。React 的用法请参阅 [react.md](./react.md)。

这些组件是 Custom Elements：Vue 把它们当作原生元素处理，而不是 Vue 组件。这带来三个影响，集成规则中会详细说明：属性仍是 HTML attribute，事件是带有 `detail` 的 DOM 事件，方法需要通过模板 ref 调用。

## 安装与注册

```sh
npm install bolle-web-components
```

```ts
// src/main.ts
import "bolle-web-components/tokens.css";
import "bolle-web-components/typography.css";
import "bolle-web-components"; // registra tutti i tag bolle-*
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```

组件库的构建产物已经注册了所有标签：不需要任何 Vue 插件，也不需要 `app.use()`。默认是亮色主题；与演示一样，通过 `document.documentElement.dataset.theme = "dark"` 启用暗色主题。

### Vue 编译器

Vue 必须知道 `bolle-*` 标签不是需要解析的组件。

```ts
// vite.config.ts
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("bolle-"),
        },
      },
    }),
  ],
});
```

如果 Vue 在运行时编译模板，请对 app 应用同样的规则：

```ts
app.config.compilerOptions.isCustomElement = (tag) =>
  tag.startsWith("bolle-");
```

`vue-tsc` 无法推断 Custom Element 属性的类型。如需完整的静态检查，需要像下面这样编写带类型的包装组件：

```vue
<!-- src/components/AppTextField.vue -->
<script setup lang="ts">
import type { BolleTextField } from "bolle-web-components";

const model = defineModel<string>({ default: "" });
</script>

<template>
  <bolle-text-field
    :label="label"
    :value="model"
    @value-input="model = ($event as CustomEvent<{ value: string }>).detail.value"
  />
</template>
```

只有在需要类型检查时包装组件才有用：下面的示例直接使用组件库的标签。

## 集成规则

### Property 与 attribute

如果元素上存在对应的键，Vue 会设置 DOM property，否则写入 attribute。因此，接受数组或对象的 property 必须用 `:` 加 property 名称绑定，而不能以字符串形式传入：

| 组件                  | 需要绑定的 property                              |
| --------------------- | ------------------------------------------------ |
| `bolle-segmented-buttons` | `:items`, `:values`                         |
| `bolle-search`       | `:suggestions`                                   |
| `bolle-date-picker`  | `:labels`                                        |
| `bolle-list`         | `:items`, `:value`（包括数组）, `:expanded` |
| `bolle-navigation-*`, `bolle-tabs`, `bolle-fab-menu`, `bolle-split-button`, `bolle-menu` | `:items` |
| `bolle-slider`       | `:iconStart`, `:iconEnd`（接受 SVG 或文本）    |
| `bolle-switch`       | `:icon`, `:iconSelected`                         |

其他所有属性（`variant`、`size`、`label`、`disabled`、`required`、`supporting-text`…）既可以作为静态 attribute 使用，也可以用 `:binding` 绑定。复合名称的属性请使用 kebab-case：`:supporting-text`、`:upper-value`、`:remove-label`、`:menu-label`、`:close-label`。

没有声明 attribute 的 property（`icon`、`iconSelected`、`iconStart`、`iconEnd`、`items`、`values`、`suggestions`、`labels`、`expanded` 以及 list 的 `value`）只作为 property 存在：请使用准确的 property 名称绑定（`:iconStart`、`:items`）。使用 in-DOM 模板时，浏览器会把 attribute 名称转为小写，这种情况下请使用 `v-bind="{ iconStart }"`。

布尔值是反射的 attribute：`<bolle-checkbox checked />` 等价于 `:checked="true"`，而 `:checked="false"` 会移除该 attribute。

### 事件

所有自定义事件都是 `bubbles: true` 和 `composed: true`。在 Vue 中用 `@event-name` 监听，payload 位于 `event.detail`。事件名始终是 kebab-case：

```
@change  @value-input  @selection-change  @navigate  @expand
@action  @remove  @search  @suggest  @closed  @before-close
@menu-select  @menu-open  @menu-close  @queued
```

`before-close` 事件可以取消：`@before-close.prevent` 会阻止 dialog 关闭。`click`、`submit` 等原生事件照常工作。

```ts
// src/bolle.ts
export function detail<T>(event: Event): T {
  return (event as CustomEvent<T>).detail;
}
```

### 受控值

表单组件不会触发原生的 `input` 事件：每次按键时触发 `value-input`，确认时触发 `change`。模式始终相同：传入 `:value`（或 `:checked`、`:selected`），并在处理函数中同步状态。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { detail } from "./bolle";

const email = ref("");
const accepted = ref(false);
</script>

<template>
  <bolle-text-field
    label="Email"
    type="email"
    :value="email"
    @value-input="email = detail<{ value: string }>($event).value"
  />
  <bolle-checkbox
    label="Accetto i termini"
    :checked="accepted"
    @change="accepted = detail<{ checked: boolean }>($event).checked"
  />
</template>
```

对于 checkbox、switch、radio、filter chip、segmented buttons、list 和 tabs，返回值是布尔值（`checked`、`selected`）或 id（`value`），而不是输入的字符串。

### Ref 与方法

Dialog、sheet、snackbar、tooltip、menu、fab-menu 和 carousel 提供命令式方法。通过以组件类为类型的模板 ref 调用它们。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleSnackbar } from "bolle-web-components";

const snackbar = ref<BolleSnackbar | null>(null);
</script>

<template>
  <bolle-snackbar ref="snackbar" message="Documento salvato" />
  <bolle-button @click="snackbar?.show('Documento salvato')">Salva</bolle-button>
</template>
```

### 表单

表单组件是 form-associated 元素：`type="submit"` 的 `bolle-button`、checkbox、switch、radio、text field、search、slider、segmented buttons、date picker、time picker 和 filter chip 都会通过 `name` 和 `value` 进入 `FormData`。无需隐藏的 input，名称也不会重复。

```vue
<form @submit.prevent="onSubmit">
  <bolle-text-field name="email" label="Email" required />
  <bolle-checkbox name="newsletter" value="si" label="Newsletter" />
  <bolle-button type="submit">Iscriviti</bolle-button>
</form>
```

```ts
function onSubmit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement);
  console.log(data.get("email"), data.get("newsletter"));
}
```

`form.reset()` 会把控件恢复为初始值，包括日期范围、范围 slider 和多选。

### 语言、方向与主题

picker 使用 `locale`（默认为 `document.documentElement.lang`），并可通过 `:labels` 覆盖文案。组件通过 `:dir()` 从祖先元素读取方向：在 `<html>` 或某个容器上设置 `dir="rtl"` 即可。在 `<html>` 上设置 `data-theme="dark"` 即可切换主题。

```vue
<bolle-date-picker
  label="Data"
  locale="it"
  :labels="{ open: 'Apri calendario', confirm: 'Conferma' }"
/>
```

### 键盘快捷键

除 `bolle-menu` 外，每个 `bolle-*` 元素都接受 `shortcut`，写法遵循 `aria-keyshortcuts` 语法（`Alt+S`、`Control+Shift+F`，多个备选项以空格分隔）。组件会在其内部可聚焦的控件上写入 `aria-keyshortcuts`：按钮、链接、checkbox 和 radio 会获得焦点并被点击，输入字段会获得焦点。禁用或隐藏的组件会忽略快捷键。

```vue
<template>
  <bolle-button shortcut="Alt+S" @click="save">Save</bolle-button>
  <bolle-text-field label="Search" shortcut="Control+K Meta+K"></bolle-text-field>
</template>
```

`:shortcut="value"` 可使其动态变化；空字符串会移除快捷键以及对应的 ARIA 属性。

### 图标与 slot

slot 接受 Vue 节点：`<svg slot="icon">`、`<span slot="leading">`、`<img slot="media">`。而 item 数组中的 `icon` 字段会按文本渲染：请配合项目加载的图标字体使用 Material Symbols 的连字（ligature）名称，或者使用一个字符。不要以字符串形式传入 HTML 标记，否则它会按原样显示。

组件库不包含图标字体。演示在 slot 中使用内联 SVG，在 item 中使用连字名称。

## 操作（Actions）

### bolle-button

属性：`variant`（filled、tonal、filled-tonal、outlined、elevated、text、standard）、`size`（xs、small、medium、large、xl）、`shape`（round、square）、`width`（default、narrow、wide；影响仅图标按钮）、`disabled`、`toggle`、`selected`、`label`、`href`、`target`、`type`（button、submit、reset）、`name`、`value`、`expanded`、`controls`、`haspopup`。Slot：默认 slot、`icon`。事件：启用 `toggle` 时触发 `change`，携带 `{ selected }`。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { detail } from "./bolle";

const variants = ["filled", "tonal", "filled-tonal", "outlined", "elevated", "text", "standard"] as const;
const sizes = ["xs", "small", "medium", "large", "xl"] as const;
const expanded = ref(false);
const submitted = ref("");

function onToggle(event: Event) {
  expanded.value = detail<{ selected: boolean }>(event).selected;
}
function onSubmit(event: Event) {
  submitted.value = String(
    new FormData(event.currentTarget as HTMLFormElement).get("azione"),
  );
}
</script>

<template>
  <bolle-button v-for="variant in variants" :key="variant" :variant="variant">
    {{ variant }}
  </bolle-button>
  <bolle-button v-for="size in sizes" :key="size" :size="size" variant="tonal">
    {{ size }}
  </bolle-button>

  <bolle-button variant="outlined" shape="square">Quadrato</bolle-button>

  <bolle-button variant="filled">
    <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M11 5h2v14h-2zM5 11h14v2H5z" />
    </svg>
    Nuovo
  </bolle-button>

  <bolle-button
    toggle
    haspopup="menu"
    :selected="expanded"
    :expanded="expanded"
    controls="pannello"
    @change="onToggle"
  >
    {{ expanded ? "Chiudi" : "Apri" }}
  </bolle-button>

  <bolle-button href="https://example.com" target="_blank" variant="text">
    Documentazione
  </bolle-button>

  <form @submit.prevent="onSubmit">
    <bolle-button type="submit" name="azione" value="salva">Salva</bolle-button>
    <bolle-button type="reset" variant="outlined">Reimposta</bolle-button>
  </form>

  <bolle-button label="Aggiungi" disabled>Disabilitato</bolle-button>
  <output>{{ submitted }}</output>
</template>
```

### bolle-icon-button

继承 `bolle-button` 的全部功能，并新增 `icon-only`。可访问标签是必需的：请始终使用 `label`。`width`（narrow、wide）改变仅图标时的区域大小。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { detail } from "./bolle";

const pinned = ref(false);
const menuOpen = ref(false);
</script>

<template>
  <bolle-icon-button
    v-for="size in ['xs', 'small', 'medium', 'large', 'xl']"
    :key="size"
    :size="size"
    :label="`Azione ${size}`"
  >
    <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
    </svg>
  </bolle-icon-button>

  <bolle-icon-button width="narrow" label="Ristretto">★</bolle-icon-button>
  <bolle-icon-button width="wide" label="Largo">★</bolle-icon-button>
  <bolle-icon-button variant="tonal" shape="square" label="Quadrato">★</bolle-icon-button>

  <bolle-icon-button
    toggle
    :selected="pinned"
    label="Fissa in alto"
    @change="pinned = detail<{ selected: boolean }>($event).selected"
  >
    📌
  </bolle-icon-button>

  <bolle-icon-button
    haspopup="menu"
    :expanded="menuOpen"
    controls="menu-azioni"
    label="Altre azioni"
  >
    ⋯
  </bolle-icon-button>
</template>
```

### bolle-floating-action-button

属性：`size`（fab 为基础尺寸，另有 small、medium、large）、`color`（primary-container、secondary-container、tertiary-container、primary、secondary、tertiary、surface）、`label`、`disabled`、`href`。Slot：默认 slot、`icon`。FAB 只显示图标：`label` 是可访问标签。

```vue
<script setup lang="ts">
const colors = [
  "primary-container",
  "secondary-container",
  "tertiary-container",
  "primary",
  "secondary",
  "tertiary",
  "surface",
] as const;
</script>

<template>
  <bolle-floating-action-button
    v-for="color in colors"
    :key="color"
    :color="color"
    :label="`Crea (${color})`"
  >
    ＋
  </bolle-floating-action-button>

  <bolle-floating-action-button size="small" label="Crea piccolo">＋</bolle-floating-action-button>
  <bolle-floating-action-button size="medium" label="Crea medio" color="tertiary">＋</bolle-floating-action-button>
  <bolle-floating-action-button size="large" label="Crea grande" color="secondary">＋</bolle-floating-action-button>
  <bolle-floating-action-button href="https://example.com" label="Apri collegamento">↗</bolle-floating-action-button>
  <bolle-floating-action-button label="Crea disabilitato" disabled>＋</bolle-floating-action-button>
</template>
```

### bolle-extended-fab

在 FAB 的基础上增加可见文本。属性：与 FAB 相同，另加 `size` small、medium、large（默认 small）。可见文本放在默认 slot 中；`label` 设置可访问标签。

```vue
<template>
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
</template>
```

### bolle-button-group

属性：`label`、`variant`（standard、connected）、`selection`（none、single、multiple）、`required`、`size`、`shape`。子元素：带 `value` 的 `bolle-button` 或 `bolle-icon-button`。事件：`selection-change`，携带 `{ values }`。当 `selection` 不为 `none` 时，子元素变为切换按钮，键盘可用方向键移动。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { detail } from "./bolle";

const alignment = ref("left");
const formats = ref<string[]>(["bold"]);
</script>

<template>
  <bolle-button-group
    label="Allineamento"
    variant="connected"
    selection="single"
    required
    size="small"
    shape="round"
    @selection-change="alignment = detail<{ values: string[] }>($event).values[0] ?? alignment"
  >
    <bolle-button value="left" :selected="alignment === 'left'">Sinistra</bolle-button>
    <bolle-button value="center" :selected="alignment === 'center'">Centro</bolle-button>
    <bolle-button value="right" :selected="alignment === 'right'">Destra</bolle-button>
  </bolle-button-group>

  <bolle-button-group
    label="Formato"
    variant="connected"
    selection="multiple"
    size="small"
    @selection-change="formats = detail<{ values: string[] }>($event).values"
  >
    <bolle-button value="bold" :selected="formats.includes('bold')">B</bolle-button>
    <bolle-button value="italic" :selected="formats.includes('italic')">I</bolle-button>
    <bolle-button value="underline" :selected="formats.includes('underline')">U</bolle-button>
  </bolle-button-group>

  <bolle-button-group label="Gruppo semplice" variant="standard" selection="none" size="large">
    <bolle-button variant="outlined">A</bolle-button>
    <bolle-button variant="outlined">B</bolle-button>
  </bolle-button-group>
</template>
```

## 通信（Communication）

### bolle-badge

属性：`value`、`label`、`small`、`max`。没有 `label` 时 badge 为 `aria-hidden`；有 `label` 时变为 `role="status"` 并播报数值。使用 `small` 时不显示文本，只显示圆点。`max` 会生成 `999+`。

```vue
<template>
  <span class="badge-anchor">
    <bolle-icon-button label="Notifiche">🔔</bolle-icon-button>
    <bolle-badge value="12" style="position: absolute; inset-block-start: -4px; inset-inline-end: -4px" />
  </span>

  <bolle-badge :value="1200" :max="999" label="Messaggi non letti" />
  <bolle-badge value="Nuovo" label="Novità" />
  <bolle-badge value="" label="Aggiornamento disponibile" small />
  <bolle-badge value="7" />
</template>
```

### bolle-progress-indicator

属性：`label`、`value`、`max`、`indeterminate`、`variant`（linear、circular）、`wavy`。`wavy` 适用于线性变体，可与确定和不确定模式组合使用。

```vue
<template>
  <bolle-progress-indicator label="Download" :value="65" />
  <bolle-progress-indicator label="Connessione" indeterminate />
  <bolle-progress-indicator label="Avanzamento pratica" :value="35" :max="50" />
  <bolle-progress-indicator wavy label="Avanzamento ondulato" :value="60" />
  <bolle-progress-indicator wavy indeterminate label="Attesa ondulata" />
  <bolle-progress-indicator variant="circular" label="Caricamento file" :value="65" />
  <bolle-progress-indicator variant="circular" indeterminate label="Attesa circolare" />
</template>
```

### bolle-loading-indicator

属性：`label`、`variant`（default、morph、contained）。始终为不确定模式，带有 `role="progressbar"`。`morph` 变体跟随七形状序列；`contained` 绘制填充容器。

```vue
<template>
  <bolle-loading-indicator label="Caricamento" />
  <bolle-loading-indicator variant="contained" label="Caricamento allegati" />
</template>
```

### bolle-snackbar

属性：`open`、`message`、`action-label`、`close-label`、`duration`（毫秒，实际最小值为 4000；0 表示禁用自动关闭）。方法：`show(message?)`、`close(reason?)`。事件：`action`、`closed`（携带 `{ reason }`）、`queued`（携带 `{ pending }`）。连续调用 `show` 会将消息排队。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleSnackbar } from "bolle-web-components";
import { detail } from "./bolle";

const snackbar = ref<BolleSnackbar | null>(null);
const log = ref("");
</script>

<template>
  <bolle-snackbar
    ref="snackbar"
    message="Documento eliminato"
    action-label="Annulla"
    close-label="Chiudi"
    :duration="6000"
    @action="log = 'azione: annulla'"
    @closed="log = `chiuso: ${detail<{ reason: string }>($event).reason}`"
    @queued="log = `in coda: ${detail<{ pending: number }>($event).pending}`"
  />

  <bolle-button variant="tonal" @click="snackbar?.show('Documento salvato')">Mostra</bolle-button>
  <bolle-button
    variant="outlined"
    @click="snackbar?.show('Primo'); snackbar?.show('Secondo'); snackbar?.show('Terzo')"
  >
    Accoda tre messaggi
  </bolle-button>
  <bolle-button variant="text" @click="snackbar?.close('manuale')">Chiudi</bolle-button>
  <output>{{ log }}</output>
</template>
```

### bolle-tooltip

属性：`label`、`variant`（plain、rich）、`supporting-text`、`persistent`。Slot：默认 slot（触发元素）、`content`、`actions`。方法：`show()`、`hide()`。plain tooltip 在失去焦点或悬停结束时关闭；`persistent` 会让它保持打开直到按下 Escape。rich 变体在点击外部时关闭，不得用于承载关键的交互内容。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleTooltip } from "bolle-web-components";

const tip = ref<BolleTooltip | null>(null);
</script>

<template>
  <bolle-tooltip label="Conserva una copia del documento">
    <bolle-button variant="tonal">Salva una copia</bolle-button>
  </bolle-tooltip>

  <bolle-tooltip
    ref="tip"
    variant="rich"
    persistent
    label="Spazio personale"
    supporting-text="La copia resta nel tuo spazio e resta aperta finché non la chiudi."
  >
    <bolle-button variant="outlined">Dettagli</bolle-button>
    <p slot="content">Puoi riaprire la copia dalla sezione Documenti.</p>
    <bolle-button slot="actions" variant="text">Apri Documenti</bolle-button>
  </bolle-tooltip>

  <bolle-button variant="text" @click="tip?.show()">Mostra tooltip ricco</bolle-button>
  <bolle-button variant="text" @click="tip?.hide()">Nascondi</bolle-button>
</template>
```

### bolle-carousel

属性：`label`、`variant`（hero、multi-browse、uncontained、uncontained-multi-aspect-ratio、center-aligned-hero、full-screen）、`previous-label`、`next-label`、`index`。子元素：各个幻灯片。方法：`goTo(index)`。事件：`change`，携带 `{ index }`。`full-screen` 变体垂直滚动。Keyline 跟随轮播自身宽度：`hero` 占满容器，`multi-browse` 显示三项，`uncontained` 保持在 160 到 220px 之间。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleCarousel } from "bolle-web-components";
import { detail } from "./bolle";

const carousel = ref<BolleCarousel | null>(null);
const current = ref(0);
const variants = [
  "hero",
  "multi-browse",
  "uncontained",
  "uncontained-multi-aspect-ratio",
  "center-aligned-hero",
  "full-screen",
] as const;
</script>

<template>
  <bolle-carousel
    ref="carousel"
    variant="hero"
    label="Documenti recenti"
    previous-label="Precedente"
    next-label="Successivo"
    :index="current"
    @change="current = detail<{ index: number }>($event).index"
  >
    <article><h3>Posta</h3><p>Messaggi ricevuti</p></article>
    <article><h3>Archivio</h3><p>Documenti salvati</p></article>
    <article><h3>Impostazioni</h3><p>Preferenze personali</p></article>
  </bolle-carousel>

  <bolle-carousel
    v-for="variant in variants"
    :key="variant"
    :variant="variant"
    :label="`Carousel ${variant}`"
    previous-label="Precedente"
    next-label="Successivo"
  >
    <article>A · {{ variant }}</article>
    <article>B · {{ variant }}</article>
    <article>C · {{ variant }}</article>
  </bolle-carousel>

  <bolle-button variant="outlined" @click="carousel?.goTo(0)">Prima slide</bolle-button>
  <bolle-button variant="outlined" @click="carousel?.goTo(2)">Ultima slide</bolle-button>
  <output>{{ current + 1 }}</output>
</template>
```

## 容器（Containment）

### bolle-card

属性：`variant`（filled、elevated、outlined）、`orientation`（vertical、horizontal）、`href`、`label`。Slot：`media`、默认 slot。设置 `href` 后，默认内容会被包裹在链接中，因此不要在卡片内放置其他链接或可交互按钮。

```vue
<template>
  <bolle-card
    v-for="variant in ['filled', 'elevated', 'outlined']"
    :key="variant"
    :variant="variant"
    :label="`Scheda ${variant}`"
  >
    <h3>Documento</h3>
    <p>Contenuto indipendente con un'azione interna.</p>
    <bolle-button variant="text">Apri</bolle-button>
  </bolle-card>

  <bolle-card orientation="horizontal" href="https://example.com" label="Rapporto annuale">
    <img slot="media" src="/cover.jpg" alt="Copertina del rapporto" />
    <h3>Rapporto annuale</h3>
    <p>Riepilogo delle attività dell'anno.</p>
  </bolle-card>
</template>
```

### bolle-dialog

属性：`open`、`label`、`variant`（basic、full-screen）、`modal`、`close-label`。Slot：默认 slot、`actions`。方法：`show(opener?)`、`close(returnValue?)`。事件：`closed`（携带 `{ returnValue }`）、`before-close`（携带 `{ reason }`，可取消）。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleDialog } from "bolle-web-components";
import { detail } from "./bolle";

const confirm = ref<BolleDialog | null>(null);
const fullscreen = ref<BolleDialog | null>(null);
const nonModal = ref<BolleDialog | null>(null);
const proposalOpen = ref(false);
const dirty = ref(true);
const result = ref("");

function onBeforeClose(event: Event) {
  if (dirty.value) event.preventDefault();
}
function onClosed(event: Event) {
  result.value = detail<{ returnValue: string }>(event).returnValue;
  proposalOpen.value = false;
}
</script>

<template>
  <bolle-button variant="filled" @click="confirm?.show()">Elimina</bolle-button>
  <bolle-dialog
    ref="confirm"
    label="Eliminare il documento?"
    variant="basic"
    :modal="true"
    close-label="Annulla"
    @before-close="onBeforeClose"
    @closed="onClosed"
  >
    <p>L'operazione non può essere annullata.</p>
    <bolle-button slot="actions" variant="text" @click="confirm?.close('elimina')">
      Elimina
    </bolle-button>
  </bolle-dialog>

  <bolle-button variant="outlined" @click="fullscreen?.show()">Apri a schermo intero</bolle-button>
  <bolle-dialog ref="fullscreen" variant="full-screen" label="Editor" close-label="Chiudi">
    <p>Contenuto a schermo intero.</p>
    <bolle-button slot="actions" @click="fullscreen?.close('salvato')">Salva</bolle-button>
  </bolle-dialog>

  <bolle-button variant="text" @click="nonModal?.show()">Dialog non modale</bolle-button>
  <bolle-dialog ref="nonModal" :modal="false" label="Nota" close-label="Chiudi">
    <p>Questo dialog non blocca il resto della pagina.</p>
  </bolle-dialog>

  <bolle-button variant="tonal" @click="proposalOpen = true">Dialog dichiarativo</bolle-button>
  <bolle-dialog :open="proposalOpen" label="Proposta" close-label="Chiudi" @closed="onClosed">
    <p>Controllato dalla proprietà open.</p>
  </bolle-dialog>
  <output>{{ result }}</output>
</template>
```

### bolle-bottom-sheet

继承 dialog。额外属性：`drag-handle`、`variant`（modal、standard）。standard 变体不使用原生 dialog：它渲染一个内联 section，在 `open` 为 true 时可见。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleBottomSheet } from "bolle-web-components";
import { detail } from "./bolle";

const sheet = ref<BolleBottomSheet | null>(null);
const inlineOpen = ref(true);
const result = ref("");
</script>

<template>
  <bolle-button variant="filled" @click="sheet?.show()">Apri foglio modale</bolle-button>
  <bolle-bottom-sheet
    ref="sheet"
    drag-handle
    label="Filtri"
    close-label="Chiudi"
    @closed="result = detail<{ returnValue: string }>($event).returnValue ?? ''"
  >
    <p>Scegli i filtri da applicare.</p>
    <bolle-button slot="actions" @click="sheet?.close('applica')">Applica</bolle-button>
  </bolle-bottom-sheet>

  <bolle-bottom-sheet
    :open="inlineOpen"
    variant="standard"
    drag-handle
    label="Filtri inline"
  >
    <p>Foglio standard ancorato in basso.</p>
    <bolle-button variant="text" @click="inlineOpen = false">Chiudi</bolle-button>
  </bolle-bottom-sheet>
  <output>{{ result }}</output>
</template>
```

### bolle-side-sheet

继承 dialog。额外属性：`detached`、`variant`（modal、standard）。侧边由组件决定：`side`。`detached` 会添加分离式变体的外边距。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleSideSheet } from "bolle-web-components";

const side = ref<BolleSideSheet | null>(null);
const standardOpen = ref(true);
</script>

<template>
  <bolle-button variant="filled" @click="side?.show()">Apri pannello</bolle-button>
  <bolle-side-sheet ref="side" label="Dettagli" detached close-label="Chiudi">
    <p>Dettagli del documento selezionato.</p>
    <bolle-button slot="actions" @click="side?.close('salvato')">Salva</bolle-button>
  </bolle-side-sheet>

  <bolle-side-sheet :open="standardOpen" variant="standard" detached label="Dettagli inline">
    <p>Pannello standard sempre visibile accanto al contenuto.</p>
    <bolle-button variant="text" @click="standardOpen = false">Chiudi</bolle-button>
  </bolle-side-sheet>
</template>
```

### bolle-divider

属性：`vertical`、`inset`、`variant`（full、inset、inset-start、inset-end）、`decorative`。没有 `decorative` 时暴露 `role="separator"`；设置 `decorative` 后会对辅助技术隐藏。

```vue
<template>
  <bolle-divider />
  <bolle-divider inset />
  <bolle-divider variant="inset-start" />
  <bolle-divider variant="inset-end" />
  <bolle-divider decorative />

  <div style="display: flex; block-size: 120px; align-items: center; gap: 8px">
    <span>Prima</span>
    <bolle-divider vertical />
    <span>Dopo</span>
  </div>
  <div style="display: flex; block-size: 120px; align-items: center; gap: 8px">
    <span>Prima</span>
    <bolle-divider vertical decorative />
    <span>Dopo</span>
  </div>
</template>
```

## 导航（Navigation）

### bolle-app-bar

属性：`label`、`variant`（small、center-aligned、medium、medium-flexible、large、large-flexible、search）、`subtitle`、`alignment`（leading、center）、`sticky`、`scrolled`、`collapsed`。Slot：`leading`、`trailing`、默认 slot。在 `search` 变体中，默认 slot 放置一个 `bolle-search`；在其他变体中，默认 slot 放置标题，替代 `label`。

```vue
<script setup lang="ts">
import { ref } from "vue";

const scrolled = ref(false);
const collapsed = ref(false);
const variants = ["small", "center-aligned", "medium", "medium-flexible", "large", "large-flexible"] as const;
</script>

<template>
  <bolle-app-bar
    label="Posta"
    variant="small"
    subtitle="12 non letti"
    alignment="leading"
    sticky
    :scrolled="scrolled"
    :collapsed="collapsed"
  >
    <bolle-icon-button slot="leading" label="Menu">☰</bolle-icon-button>
    <bolle-icon-button slot="trailing" label="Cerca">🔍</bolle-icon-button>
  </bolle-app-bar>

  <bolle-app-bar
    v-for="variant in variants"
    :key="variant"
    :variant="variant"
    :label="`Posta ${variant}`"
    subtitle="12 non letti"
    :collapsed="collapsed"
  >
    <bolle-icon-button slot="leading" label="Menu">☰</bolle-icon-button>
  </bolle-app-bar>

  <bolle-app-bar variant="search">
    <bolle-search label="Cerca" placeholder="Cerca nella posta">
      <span slot="leading" aria-hidden="true">🔍</span>
    </bolle-search>
  </bolle-app-bar>

  <bolle-button variant="outlined" @click="scrolled = !scrolled">Alterna scrolled</bolle-button>
  <bolle-button variant="outlined" @click="collapsed = !collapsed">Alterna collapsed</bolle-button>
</template>
```

### bolle-toolbar

属性：`label`、`variant`（docked、floating）、`orientation`（horizontal、vertical）、`color`（standard、vibrant）。子控件使用 roaming `tabindex`，并根据方向用方向键移动焦点。

```vue
<template>
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
</template>
```

### bolle-navigation-bar

属性：`label`、`items`（`BolleItem` 数组，包含 `id`、`label`、`icon`、`href`、`disabled`）、`value`、`variant`（standard、flexible）、`layout`（vertical、horizontal）。事件：`navigate`，携带 `{ id }`。请使用三到五个目的地。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleItem } from "bolle-web-components";
import { detail } from "./bolle";

const destinations: BolleItem[] = [
  { id: "inbox", label: "Posta", icon: "inbox" },
  { id: "archive", label: "Archivio", icon: "archive", href: "/archivio" },
  { id: "settings", label: "Impostazioni", icon: "settings" },
  { id: "trash", label: "Cestino", icon: "trash", disabled: true },
];

const current = ref("inbox");
</script>

<template>
  <bolle-navigation-bar
    label="Navigazione principale"
    :items="destinations"
    :value="current"
    variant="standard"
    layout="vertical"
    @navigate="current = detail<{ id: string }>($event).id"
  />

  <bolle-navigation-bar
    label="Navigazione flessibile"
    :items="destinations"
    :value="current"
    variant="flexible"
    layout="horizontal"
    @navigate="current = detail<{ id: string }>($event).id"
  />
  <output>{{ current }}</output>
</template>
```

### bolle-navigation-rail

继承 navigation bar，并新增 `expanded`。rail 默认始终处于收起状态；`expanded` 会在图标旁显示标签。`variant` 和 `layout` 仍然可用。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleItem } from "bolle-web-components";
import { detail } from "./bolle";

const destinations: BolleItem[] = [
  { id: "inbox", label: "Posta", icon: "inbox" },
  { id: "archive", label: "Archivio", icon: "archive" },
  { id: "settings", label: "Impostazioni", icon: "settings" },
];
const current = ref("inbox");
</script>

<template>
  <bolle-navigation-rail
    label="Rail compresso"
    :items="destinations"
    :value="current"
    @navigate="current = detail<{ id: string }>($event).id"
  />
  <bolle-navigation-rail
    expanded
    variant="standard"
    layout="vertical"
    label="Rail espanso"
    :items="destinations"
    :value="current"
    @navigate="current = detail<{ id: string }>($event).id"
  />
</template>
```

### bolle-navigation-drawer

继承 side sheet。属性：`items`、`value`、`label`、`variant`（modal、standard）、`detached`、`close-label`；默认 slot 用于放置额外内容。事件：`navigate`，携带 `{ id }`。方法：`show(opener?)`、`close()`。standard 变体保持内联，通过 `open` 控制。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleItem, BolleNavigationDrawer } from "bolle-web-components";
import { detail } from "./bolle";

const destinations: BolleItem[] = [
  { id: "inbox", label: "Posta", icon: "inbox" },
  { id: "archive", label: "Archivio", icon: "archive", href: "/archivio" },
  { id: "settings", label: "Impostazioni", icon: "settings" },
];
const current = ref("inbox");
const standardOpen = ref(true);
const drawer = ref<BolleNavigationDrawer | null>(null);
</script>

<template>
  <bolle-button variant="filled" @click="drawer?.show()">Apri drawer</bolle-button>
  <bolle-navigation-drawer
    ref="drawer"
    label="Sezioni"
    close-label="Chiudi"
    :items="destinations"
    :value="current"
    @navigate="current = detail<{ id: string }>($event).id"
  >
    <p>Contenuto aggiuntivo del drawer.</p>
  </bolle-navigation-drawer>

  <bolle-navigation-drawer
    :open="standardOpen"
    variant="standard"
    detached
    label="Sezioni standard"
    :items="destinations"
    :value="current"
    @navigate="current = detail<{ id: string }>($event).id"
  >
    <bolle-button variant="text" @click="standardOpen = false">Chiudi</bolle-button>
  </bolle-navigation-drawer>
</template>
```

### bolle-tabs

属性：`items`（`id`、`label`、`icon`、`badge`、`disabled`）、`value`、`label`、`variant`（primary、secondary）、`activation`（automatic、manual）、`scrollable`。Slot：每个 item 的 `id` 对应一个 slot。事件：`change`，携带 `{ value }`。使用 `manual` 时，需要按 Enter 或点击才会选中，仅用方向键不会选中。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleItem } from "bolle-web-components";
import { detail } from "./bolle";

const primary: BolleItem[] = [
  { id: "inbox", label: "Posta", icon: "inbox", badge: "3" },
  { id: "archive", label: "Archivio", icon: "archive" },
  { id: "settings", label: "Preferenze", icon: "settings" },
  { id: "trash", label: "Cestino", icon: "trash", disabled: true },
];
const many: BolleItem[] = Array.from({ length: 8 }, (_, index) => ({
  id: `s${index}`,
  label: `Vista ${index + 1}`,
}));

const tab = ref("inbox");
const manyTab = ref("s0");
</script>

<template>
  <bolle-tabs
    label="Categorie"
    :items="primary"
    :value="tab"
    variant="primary"
    activation="automatic"
    :scrollable="false"
    @change="tab = detail<{ value: string }>($event).value"
  >
    <p slot="inbox">Messaggi ricevuti.</p>
    <p slot="archive">Documenti salvati.</p>
    <p slot="settings">Preferenze personali.</p>
    <p slot="trash">Elementi eliminati.</p>
  </bolle-tabs>

  <bolle-tabs
    label="Dettagli"
    :items="primary"
    :value="tab"
    variant="secondary"
    activation="manual"
    @change="tab = detail<{ value: string }>($event).value"
  >
    <p slot="inbox">Scheda secondaria.</p>
    <p slot="archive">Archivio secondario.</p>
    <p slot="settings">Impostazioni secondarie.</p>
    <p slot="trash">Cestino secondario.</p>
  </bolle-tabs>

  <bolle-tabs
    label="Viste scorrevoli"
    :items="many"
    :value="manyTab"
    scrollable
    @change="manyTab = detail<{ value: string }>($event).value"
  >
    <p v-for="item in many" :key="item.id" :slot="item.id">{{ item.label }}</p>
  </bolle-tabs>
</template>
```

## 选择（Selection）

### bolle-checkbox

属性：`checked`、`indeterminate`、`label`、`value`、`name`、`required`、`disabled`、`supporting-text`、`error`。Slot：默认 slot（标签）。事件：`change`，携带 `{ checked, value }`。form-associated。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { detail } from "./bolle";

const terms = ref(false);
const partial = ref(true);
const newsletter = ref(true);

function onTerms(event: Event) {
  terms.value = detail<{ checked: boolean }>(event).checked;
}
</script>

<template>
  <form>
    <bolle-checkbox
      label="Accetto i termini"
      name="terms"
      value="si"
      required
      :checked="terms"
      supporting-text="Puoi revocare il consenso in qualsiasi momento."
      @change="onTerms"
    />
    <bolle-checkbox name="newsletter" value="si" :checked="newsletter" label="Newsletter" />
    <bolle-checkbox :indeterminate="partial" label="Selezione parziale" />
    <bolle-checkbox checked disabled label="Disabilitata" />
    <bolle-checkbox checked error required label="Campo con errore" supporting-text="Devi accettare per continuare." />
  </form>
</template>
```

### bolle-switch

继承 checkbox，并新增 `icon` 和 `iconSelected`，它们只能作为 property 使用（`:icon`、`:iconSelected`）。role 为 `switch`。属性、事件和表单行为与 checkbox 相同。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { detail } from "./bolle";

const wifi = ref(true);
const notifications = ref(false);
</script>

<template>
  <bolle-switch
    label="Wi-Fi"
    name="wifi"
    value="on"
    :checked="wifi"
    :icon="'🔅'"
    :iconSelected="'🔆'"
    @change="wifi = detail<{ checked: boolean }>($event).checked"
  />
  <bolle-switch
    label="Notifiche"
    :checked="notifications"
    supporting-text="Ricevi un avviso per ogni aggiornamento."
    @change="notifications = detail<{ checked: boolean }>($event).checked"
  />
  <bolle-switch checked disabled label="Bluetooth disabilitato" />
  <bolle-switch checked error required label="Con errore" supporting-text="Azione richiesta." />
</template>
```

### bolle-radio-button

属性：`name`、`value`、`checked`、`label`、`required`、`disabled`。按 `name` 分组选择；方向键移动焦点并选中，Home/End 跳到第一个和最后一个。事件：`change`，携带 `{ checked, value }`。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { detail } from "./bolle";

const plan = ref("standard");
</script>

<template>
  <form>
    <bolle-radio-button
      v-for="option in ['standard', 'plus', 'enterprise']"
      :key="option"
      name="plan"
      :value="option"
      :label="option"
      :checked="plan === option"
      required
      @change="plan = detail<{ value: string }>($event).value"
    />
    <bolle-radio-button name="plan" value="legacy" label="Legacy" disabled />
    <bolle-radio-button name="locale" value="it" label="Italiano" checked />
    <bolle-radio-button name="locale" value="en" label="Inglese" />
  </form>
</template>
```

### bolle-chip

属性：`variant`（assist、filter、input、suggestion）、`label`、`selected`、`elevated`、`disabled`、`removable`、`remove-label`、`href`、`name`、`value`、`required`。Slot：`avatar`、`icon`、默认 slot。事件：`action`、filter 变体的 `change`（携带 `{ selected }`）、`remove`。只有 filter 变体会进入表单。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { detail } from "./bolle";

const favorite = ref(false);
const city = ref(["Roma"]);
const log = ref("");
</script>

<template>
  <bolle-chip variant="assist" label="Aggiungi al calendario" @action="log = 'assist'" />
  <bolle-chip
    variant="filter"
    name="filters"
    value="favorite"
    label="Preferiti"
    :selected="favorite"
    @change="favorite = detail<{ selected: boolean }>($event).selected"
  />
  <bolle-chip variant="filter" name="filters" value="unread" label="Solo non letti" />
  <bolle-chip variant="filter" elevated label="Elevata" />

  <bolle-chip
    v-for="name in city"
    :key="name"
    variant="input"
    :label="name"
    removable
    :remove-label="`Rimuovi ${name}`"
    @remove="city = city.filter((value) => value !== name)"
  >
    <span slot="avatar" aria-hidden="true">{{ name.slice(0, 2) }}</span>
  </bolle-chip>

  <bolle-chip variant="suggestion" label="Grazie!">
    <span slot="icon" aria-hidden="true">✓</span>
  </bolle-chip>
  <bolle-chip variant="assist" href="https://example.com" label="Apri collegamento">
    <span slot="icon" aria-hidden="true">↗</span>
  </bolle-chip>
  <bolle-chip variant="assist" label="Disabilitata" disabled />
  <output>{{ log }}</output>
</template>
```

### bolle-list

属性：`items`（包含 `id`、`label`、`icon`、`supportingText`、`badge`、`href`、`selected`、`disabled`、`items`、`expanded`）、`label`、`variant`（standard、segmented）、`interactive`、`selection`（none、single、multiple）、`value`（字符串或数组）、`expanded`（id 数组）。Slot：默认 slot 用于额外的行。事件：`action`（携带 `{ id }`）、`change`（携带 `{ value, id, selected }`）、`expand`（携带 `{ id, expanded }`）。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleItem } from "bolle-web-components";
import { detail } from "./bolle";

const items: BolleItem[] = [
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

const single = ref("inbox");
const multiple = ref<string[]>(["inbox"]);
const expanded = ref<string[]>(["folders"]);
const log = ref("");

function onExpand(event: Event) {
  const { id, expanded: open } = detail<{ id: string; expanded: boolean }>(event);
  expanded.value = open
    ? [...expanded.value, id]
    : expanded.value.filter((value) => value !== id);
}
</script>

<template>
  <bolle-list
    label="Selezione singola"
    variant="standard"
    interactive
    selection="single"
    :items="items"
    :value="single"
    :expanded="expanded"
    @change="single = detail<{ value: string }>($event).value"
    @expand="onExpand"
  />

  <bolle-list
    label="Selezione multipla"
    variant="segmented"
    selection="multiple"
    :items="items"
    :value="multiple"
    @change="multiple = detail<{ value: string[] }>($event).value"
  />

  <bolle-list
    label="Azioni"
    interactive
    selection="none"
    :items="items"
    @action="log = `azione ${detail<{ id: string }>($event).id}`"
  />

  <bolle-list label="Statico con link" selection="none" :items="items">
    <li><div class="list-item">Riga personalizzata</div></li>
  </bolle-list>
  <output>{{ log }}</output>
</template>
```

### bolle-segmented-buttons

属性：`items`（包含 `id`、`label`、`icon`、`disabled`）、`multiple`、`values`（数组，仅用于多选）、`value`（单选）、`label`、`name`、`required`、`disabled`。事件：`change`，携带 `{ value, values }`。请使用二到五个分段。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleItem } from "bolle-web-components";
import { detail } from "./bolle";

const segments: BolleItem[] = [
  { id: "inbox", label: "Posta", icon: "inbox" },
  { id: "archive", label: "Archivio", icon: "archive" },
  { id: "settings", label: "Impostazioni", icon: "settings" },
  { id: "trash", label: "Cestino", icon: "trash", disabled: true },
];

const view = ref("inbox");
const filters = ref<string[]>(["inbox", "archive"]);
</script>

<template>
  <form>
    <bolle-segmented-buttons
      label="Vista"
      name="view"
      :items="segments"
      :value="view"
      required
      @change="view = detail<{ value: string }>($event).value"
    />
    <bolle-segmented-buttons
      label="Filtri"
      name="filters"
      multiple
      :items="segments"
      :values="filters"
      @change="filters = detail<{ values: string[] }>($event).values"
    />
    <bolle-segmented-buttons label="Disabilitati" name="disabled" :items="segments" value="inbox" disabled />
  </form>
</template>
```

### bolle-slider

属性：`value`、`min`、`max`、`step`、`variant`（continuous、centered、range）、`size`（xs、small、medium、large、xl）、`upper-value`、`upper-label`、`orientation`（horizontal、vertical）、`show-value`、`stops`、`iconStart`、`iconEnd`、`label`、`name`、`required`、`disabled`。事件：`value-input`（携带 `{ value, upperValue }`）、`change`（payload 相同）。两个图标字段只是 property，绑定写法为 `:iconStart` 和 `:iconEnd`。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { detail } from "./bolle";

const volume = ref("40");
const balance = ref("60");
const price = ref("20");
const upper = ref(80);
const brightness = ref("40");

function onPrice(event: Event) {
  const value = detail<{ value: string; upperValue?: number }>(event);
  price.value = value.value;
  upper.value = value.upperValue ?? upper.value;
}
</script>

<template>
  <bolle-slider
    name="volume"
    label="Volume"
    :value="volume"
    :min="0"
    :max="100"
    :step="1"
    variant="continuous"
    size="xs"
    orientation="horizontal"
    show-value
    @value-input="volume = detail<{ value: string }>($event).value"
  />

  <bolle-slider
    label="Bilanciamento"
    variant="centered"
    :value="balance"
    show-value
    @value-input="balance = detail<{ value: string }>($event).value"
  />

  <bolle-slider
    label="Prezzo"
    name="price"
    variant="range"
    :value="price"
    :upper-value="upper"
    upper-label="Massimo"
    show-value
    required
    @value-input="onPrice"
    @change="onPrice"
  />

  <bolle-slider
    label="Luminosità"
    :value="brightness"
    show-value
    :iconStart="'🔅'"
    :iconEnd="'🔆'"
    @value-input="brightness = detail<{ value: string }>($event).value"
  />

  <bolle-slider label="Passo 10 con indicatori" :step="10" value="40" show-value stops />
  <bolle-slider label="Small" size="small" value="30" />
  <bolle-slider label="Large" size="large" value="70" />
  <bolle-slider label="Verticale" orientation="vertical" value="50" />
  <bolle-slider label="Disabilitato" value="20" disabled />
</template>
```

## 文本与输入（Text and input）

### bolle-text-field

属性：`variant`（filled、outlined）、`type`（text、email、password、number、date、time、url、tel、search）、`label`、`value`、`placeholder`、`supporting-text`、`error`、`multiline`、`rows`、`readonly`、`min`、`max`、`step`、`pattern`、`autocomplete`、`maxlength`、`counter`、`prefix`、`suffix`、`name`、`required`、`disabled`。Slot：`leading`、`trailing`。事件：每次按键触发 `value-input`（携带 `{ value }`），确认时触发 `change`（携带 `{ value }`）。`pattern` 和 `autocomplete` 适用于单行字段；`rows` 仅适用于 `multiline`。

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { detail } from "./bolle";

const email = ref("");
const message = ref("");
const emailError = computed(
  () => email.value.length > 0 && !email.value.includes("@"),
);

function onEmail(event: Event) {
  email.value = detail<{ value: string }>(event).value;
}
function onMessage(event: Event) {
  message.value = detail<{ value: string }>(event).value;
}
</script>

<template>
  <form>
    <bolle-text-field
      name="email"
      label="Email"
      type="email"
      variant="outlined"
      placeholder="nome@dominio.it"
      autocomplete="email"
      :maxlength="120"
      counter
      required
      :value="email"
      :error="emailError"
      supporting-text="Useremo questo indirizzo per le notifiche."
      @value-input="onEmail"
      @change="onEmail"
    >
      <span slot="leading" aria-hidden="true">✉</span>
      <span slot="trailing" aria-hidden="true">?</span>
    </bolle-text-field>

    <bolle-text-field label="Nome utente" variant="filled" prefix="@" :maxlength="30" counter />
    <bolle-text-field label="Prezzo" type="number" min="0" max="9999" step="0.01" prefix="€" suffix="EUR" value="12.50" />
    <bolle-text-field
      label="Messaggio"
      multiline
      :rows="4"
      :maxlength="200"
      counter
      :value="message"
      @value-input="onMessage"
    />
    <bolle-text-field label="Solo lettura" readonly value="Valore bloccato" />
    <bolle-text-field label="Quantità" type="number" min="1" max="10" step="1" value="2" />
    <bolle-text-field label="Codice" pattern="[A-Z]{3}[0-9]{3}" value="ABC123" supporting-text="Tre lettere e tre cifre." />
    <bolle-text-field label="Data" type="date" min="2026-01-01" max="2026-12-31" />
    <bolle-text-field label="Ricerca" type="search" placeholder="Cerca" />
    <bolle-text-field label="Disabilitato" disabled value="Non modificabile" />
  </form>
</template>
```

### bolle-search

继承 text field。额外属性：`appearance`（contained、divided）、`layout`（docked、full-screen）、`suggestions`（数组）、`suggestions-label`、`filter`、`suggestion-delay`（毫秒）。Slot：`leading`、`trailing`、`results`（仅 docked 布局）。事件：`value-input`、`change`，确认时触发 `search`（携带 `{ value }`），每次输入时触发 `suggest`（携带 `{ value }`；当 `suggestion-delay` 大于零时会延迟触发）。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleItem } from "bolle-web-components";
import { detail } from "./bolle";

const cities = ["Bologna", "Bolzano", "Firenze", "Genova", "Milano", "Napoli", "Roma", "Torino"];
const suggestions = ref<string[]>(cities);
const query = ref("");
const lastSearch = ref("");

const results: BolleItem[] = [
  { id: "r1", label: "Roma", supportingText: "Capitale d'Italia" },
  { id: "r2", label: "Torino", supportingText: "Capoluogo piemontese" },
];

function onSuggest(event: Event) {
  const value = detail<{ value: string }>(event).value.toLocaleLowerCase();
  suggestions.value = cities.filter((city) => city.toLocaleLowerCase().includes(value));
}
</script>

<template>
  <bolle-search
    label="Cerca documenti"
    placeholder="Titolo o autore"
    appearance="contained"
    layout="docked"
    :value="query"
    :suggestions="[]"
    :suggestion-delay="0"
    @value-input="query = detail<{ value: string }>($event).value"
    @search="lastSearch = detail<{ value: string }>($event).value"
  >
    <span slot="leading" aria-hidden="true">🔍</span>
    <span slot="trailing" aria-hidden="true">⌘K</span>
    <bolle-list slot="results" label="Risultati" selection="none" :items="results" />
  </bolle-search>

  <bolle-search appearance="divided" label="Cerca nel testo" placeholder="Parola chiave" />

  <bolle-search layout="full-screen" label="Cerca ovunque" placeholder="Cerca ovunque" />

  <bolle-search
    filter
    label="Cerca città"
    placeholder="Scrivi una città"
    suggestions-label="Suggerimenti"
    :suggestion-delay="150"
    :suggestions="suggestions"
    @suggest="onSuggest"
    @search="lastSearch = detail<{ value: string }>($event).value"
  />
  <output>{{ lastSearch }}</output>
</template>
```

### bolle-date-picker

属性：`variant`（modal、docked）、`selection-mode`（single、range）、`value`（格式 `AAAA-MM-GG`）、`end-value`、`locale`、`labels`、`min`、`max`、`week-starts-on`（0 为周日，1 为周一）、`label`、`name`、`required`、`disabled`、`supporting-text`、`error`。事件：`change`，携带 `{ value, endValue }`。`docked` 变体始终显示日历，不会打开对话框。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { detail } from "./bolle";

const appointment = ref("2026-11-11");
const rangeStart = ref("2026-11-01");
const rangeEnd = ref("2026-11-20");

function onAppointment(event: Event) {
  appointment.value = detail<{ value: string }>(event).value;
}
function onRange(event: Event) {
  const value = detail<{ value: string; endValue: string }>(event);
  rangeStart.value = value.value;
  rangeEnd.value = value.endValue;
}
</script>

<template>
  <form>
    <bolle-date-picker
      label="Data appuntamento"
      name="appointment"
      locale="it"
      variant="modal"
      selection-mode="single"
      min="2026-01-01"
      max="2026-12-31"
      required
      :value="appointment"
      supporting-text="Seleziona un giorno lavorativo."
      @change="onAppointment"
    />

    <bolle-date-picker
      label="Periodo"
      name="period"
      locale="it"
      selection-mode="range"
      :value="rangeStart"
      :end-value="rangeEnd"
      @change="onRange"
    />

    <bolle-date-picker
      variant="docked"
      label="Calendario sempre visibile"
      locale="it"
      selection-mode="single"
      :value="appointment"
      :week-starts-on="1"
      :labels="{ previous: 'Mese precedente', next: 'Mese successivo' }"
      @change="onAppointment"
    />

    <bolle-date-picker label="Disabilitato" disabled value="2026-11-11" />
  </form>
</template>
```

在表单中，范围选择器会以同一个 `name` 提交两个值：

```ts
new FormData(form).getAll("period"); // ["2026-11-01", "2026-11-20"]
```

### bolle-time-picker

属性：`variant`（dial、input）、`hour-cycle`（12、24）、`value`（`HH:mm`）、`locale`、`labels`、`label`、`name`、`required`、`disabled`。事件：`change`，携带 `{ value }`。设置 `hour-cycle="12"` 时会出现 AM/PM 选择器。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { detail } from "./bolle";

const time = ref("09:30");
const evening = ref("18:45");

function onTime(event: Event) {
  time.value = detail<{ value: string }>(event).value;
}
function onEvening(event: Event) {
  evening.value = detail<{ value: string }>(event).value;
}
</script>

<template>
  <form>
    <bolle-time-picker
      label="Ora promemoria"
      name="time"
      variant="dial"
      :hour-cycle="24"
      locale="it"
      required
      :value="time"
      @change="onTime"
    />
    <bolle-time-picker
      label="Ora in formato 12"
      variant="dial"
      :hour-cycle="12"
      locale="it"
      :value="evening"
      :labels="{ period: 'AM o PM', hour: 'Ora', minute: 'Minuti' }"
      @change="onEvening"
    />
    <bolle-time-picker
      label="Inserimento da tastiera"
      variant="input"
      :hour-cycle="24"
      value="08:15"
      @change="onTime"
    />
    <bolle-time-picker label="Disabilitato" disabled value="07:00" />
  </form>
</template>
```

## 菜单（Menu）

### bolle-menu

属性：`items`（`MenuEntry[]`）、`menu-label`（必填）、`variant`（vertical、baseline）、`color-scheme`（standard、vibrant；仅 vertical）、`selection-mode`（none、single、multi）、`filterable`、`filter`、`locale`、`compact-width`（默认 480px）、`quick`、`density`（数字，负值更紧凑）、`inactive`。方法：`show(anchor, { last?, x?, y? })`、`close(restoreFocus?)`。Getter：`open`、`selectedIds`。事件：`menu-open`、`menu-close`、`menu-select`，携带 `{ item, selectedIds }`。

启用 `filterable` 后菜单显示筛选输入框；`filter` 保存查询并可外部设置。宽度低于 `compact-width` 时垂直菜单变为底部面板，可用 Escape 或点击外部关闭。`selectedIds` 汇总子菜单的选择，`menu-select` 报告根级选择。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleMenu, MenuEntry } from "bolle-web-components";
import { detail } from "./bolle";

const actions = ref<BolleMenu | null>(null);
const filters = ref<BolleMenu | null>(null);
const baseline = ref<BolleMenu | null>(null);
const last = ref("");

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

function open(
  menu: BolleMenu | null,
  event: Event,
  options: { last?: boolean; x?: number; y?: number } = {},
) {
  menu?.show(event.currentTarget as HTMLElement, options);
}
function onSelect(event: Event) {
  const result = detail<{ item: { label: string }; selectedIds: string[] }>(event);
  last.value = `${result.item.label} (${result.selectedIds.join(", ")})`;
}
</script>

<template>
  <bolle-button haspopup="menu" @click="open(actions, $event)">Azioni</bolle-button>
  <bolle-menu
    ref="actions"
    menu-label="Azioni documento"
    variant="vertical"
    color-scheme="standard"
    selection-mode="none"
    :quick="false"
    :density="0"
    :inactive="false"
    :items="documentItems"
    @menu-open="last = 'menu aperto'"
    @menu-close="last = 'menu chiuso'"
    @menu-select="onSelect"
  />

  <bolle-button variant="tonal" haspopup="menu" @click="open(filters, $event, { last: true })">
    Filtri
  </bolle-button>
  <bolle-menu
    ref="filters"
    menu-label="Filtri contenuti"
    color-scheme="vibrant"
    selection-mode="multi"
    :density="-1"
    :items="filterItems"
    @menu-select="onSelect"
  />

  <bolle-button variant="outlined" haspopup="menu" @click="open(baseline, $event, { x: 120, y: 160 })">
    Menu baseline a coordinate
  </bolle-button>
  <bolle-button variant="text" @click="actions?.close()">Chiudi menu azioni</bolle-button>
  <bolle-menu
    ref="baseline"
    menu-label="Azioni rapide"
    variant="baseline"
    :items="baselineItems"
    @menu-select="onSelect"
  />
  <output>{{ last }}</output>
</template>
```

`show` 执行的校验规则：`menu-label` 不能为空；baseline 变体不允许 `color-scheme="vibrant"`；id 必须唯一；分组嵌套不能超过四层；带 `href` 的条目不能有 `children`，也不能用于带选择功能的菜单。

### bolle-fab-menu

属性：`label`、`items`（二到六个操作）、`open`。Slot：`icon`。事件：`action`，携带 `{ id }`。`label` 是按钮和菜单的可访问名称。`open` 是反射的内部状态：没有对应的变更事件，因此不能用作受控绑定。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BolleItem } from "bolle-web-components";
import { detail } from "./bolle";

const fabItems: BolleItem[] = [
  { id: "note", label: "Nota", icon: "note" },
  { id: "folder", label: "Cartella", icon: "folder" },
  { id: "upload", label: "Carica file", icon: "upload" },
  { id: "event", label: "Evento", icon: "calendar", disabled: true },
];
const log = ref("");
</script>

<template>
  <bolle-fab-menu
    label="Crea"
    :items="fabItems"
    @action="log = `crea ${detail<{ id?: string }>($event).id}`"
  >
    <span slot="icon" aria-hidden="true">＋</span>
  </bolle-fab-menu>
  <output>{{ log }}</output>
</template>
```

### bolle-split-button

属性：`label`、`menu-label`、`items`（`MenuEntry[]`）、`disabled`、`variant`（filled、tonal、outlined、elevated）、`size`（xs、small、medium、large、xl）。事件：主按钮的 `action`，以及从内部菜单传播出来的 `menu-select`（携带 `{ item, selectedIds }`）；`menu-open` 和 `menu-close` 同样会冒泡。打开菜单必须设置 `menu-label`。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { MenuEntry } from "bolle-web-components";
import { detail } from "./bolle";

const variants = ["filled", "tonal", "outlined", "elevated"] as const;
const sizes = ["xs", "small", "medium", "large", "xl"] as const;
const log = ref("");

const items: MenuEntry[] = [
  { id: "later", label: "Invia più tardi" },
  { id: "draft", label: "Salva bozza" },
  { separator: true },
  { id: "template", label: "Usa modello" },
];

function onSelect(event: Event) {
  log.value = detail<{ item: { label: string } }>(event).item.label;
}
</script>

<template>
  <bolle-split-button
    v-for="variant in variants"
    :key="variant"
    :variant="variant"
    :label="`Invia ${variant}`"
    :menu-label="`Altre opzioni ${variant}`"
    :items="items"
    @action="log = 'azione principale'"
    @menu-select="onSelect"
    @menu-open="log = 'menu aperto'"
    @menu-close="log = 'menu chiuso'"
  />

  <bolle-split-button
    v-for="size in sizes"
    :key="size"
    :size="size"
    :label="size"
    :menu-label="`Altre opzioni ${size}`"
    :items="items"
    @menu-select="onSelect"
  />

  <bolle-split-button
    label="Invia"
    menu-label="Altre opzioni"
    disabled
    :items="items"
  />
  <output>{{ log }}</output>
</template>
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
