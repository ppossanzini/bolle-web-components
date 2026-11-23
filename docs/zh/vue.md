[Italiano](../it/vue.md) · [English](../en/vue.md) · [Français](../fr/vue.md) · [中文](./vue.md)

# Vue 3 · 完整使用示例

本指南涵盖组件库的全部 51 个组件。每一节先列出公开的属性、slot、事件和方法，然后给出一个全部用到它们的 Vue 3 示例。示例假定使用 `<script setup lang="ts">` 以及 Vue 3.4 或更高版本。React 的用法请参阅 [react.md](./react.md)。

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
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("bolle-");
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
    @value-input="
      model = ($event as CustomEvent<{ value: string }>).detail.value
    "
  />
</template>
```

只有在需要类型检查时包装组件才有用：下面的示例直接使用组件库的标签。

## 集成规则

### Property 与 attribute

如果元素上存在对应的键，Vue 会设置 DOM property，否则写入 attribute。因此，接受数组或对象的 property 必须用 `:` 加 property 名称绑定，而不能以字符串形式传入：

| 组件                                                                                     | 需要绑定的 property                         |
| ---------------------------------------------------------------------------------------- | ------------------------------------------- |
| `bolle-segmented-buttons`                                                                | `:items`, `:values`                         |
| `bolle-search`                                                                           | `:suggestions`                              |
| `bolle-date-picker`                                                                      | `:labels`                                   |
| `bolle-list`                                                                             | `:items`, `:value`（包括数组）, `:expanded` |
| `bolle-navigation-*`, `bolle-tabs`, `bolle-fab-menu`, `bolle-split-button`, `bolle-menu` | `:items`                                    |
| `bolle-slider`                                                                           | `:iconStart`, `:iconEnd`（接受 SVG 或文本） |
| `bolle-switch`                                                                           | `:icon`, `:iconSelected`                    |

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
  <bolle-button @click="snackbar?.show('Documento salvato')"
    >Salva</bolle-button
  >
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
  <bolle-text-field
    label="Search"
    shortcut="Control+K Meta+K"
  ></bolle-text-field>
</template>
```

`:shortcut="value"` 可使其动态变化；空字符串会移除快捷键以及对应的 ARIA 属性。

### 图标与 slot

slot 接受 Vue 节点：`<svg slot="icon">`、`<span slot="leading">`、`<img slot="media">`。而 item 数组中的 `icon` 字段会按文本渲染：请配合项目加载的图标字体使用 Material Symbols 的连字（ligature）名称，或者使用一个字符。不要以字符串形式传入 HTML 标记，否则它会按原样显示。

组件库不包含图标字体。演示在 slot 中使用内联 SVG，在 item 中使用连字名称。

### 状态由组件应用与钩子

组件自行应用读者的改动，并用事件报告：排序、页码、选择、行展开、分组、列、卡片或任务的移动。无需在监听中回写状态；监听仅用于了解发生了什么变化。

当数据位于服务器时，组件把工作交给钩子：数据表格的 `sortHandler`、`pageHandler` 与 `columnHandler`，看板与甘特图的 `restrict`。钩子接收请求，组件在 Promise 完成后重绘。在 Vue 中它们是函数属性，因此以 camelCase 绑定：`:sortHandler`、`:itemRenderer`、`:restrict`。

<!-- catalogue -->

## 组件目录

每个组件列出属性、JavaScript 属性、插槽与公开事件；示例取自站点文档的第一条配方，已按该框架编写。

### bolle-button

属性: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · 插槽: `default`, `icon`, `trailing-icon` · 事件: `change`

**带图标的按钮** — 变体决定形状：filled 用于主要操作，tonal 用于次要操作，outlined 与 text 用于其他。默认插槽提供文本，icon 提供起始图标，trailing-icon 提供末尾图标。

```vue
<template>
  <bolle-button variant="filled">Salva la commessa</bolle-button>
  <bolle-button variant="outlined">
    <span slot="icon" aria-hidden="true">★</span>
    Archivia
  </bolle-button>
  <bolle-button variant="text" href="#/commesse"
    >Tutte le commesse</bolle-button
  >
</template>
```

更多配方: 保持按下的按钮

### bolle-icon-button

属性: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · 插槽: `default`, `icon`, `trailing-icon` · 事件: `change`

**图标按钮** — label 必需，因为按钮只显示符号，它是屏幕阅读器读取的名称。variant standard 使图标无背景，filled 将其放在面板上。

```vue
<template>
  <bolle-icon-button label="Cerca">
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-icon-button>
  <bolle-icon-button variant="filled" label="Aggiungi">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-icon-button>
</template>
```

### bolle-floating-action-button

属性: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · 插槽: `default`, `icon`, `trailing-icon` · 事件: `change`

**浮动按钮** — 浮动按钮固定在容器角落，仅显示符号：label 是可访问名称，必须声明。size regular 保持圆形，extended 增加文本。

```vue
<template>
  <div class="tela">
    <bolle-floating-action-button label="Nuova commessa">
      <span slot="icon" aria-hidden="true">+</span>
    </bolle-floating-action-button>
  </div>
</template>

<style>
.tela {
  position: relative;
  block-size: 320px;
}
.tela bolle-floating-action-button {
  position: absolute;
  inset-block-end: 16px;
  inset-inline-end: 16px;
}
</style>
```

### bolle-extended-fab

属性: `color`, `controls`, `disabled`, `download`, `expanded`, `formaction`, `formenctype`, `formmethod`, `formnovalidate`, `haspopup`, `href`, `hreflang`, `label`, `name`, `selected`, `shape`, `size`, `target`, `toggle`, `type`, `value`, `variant`, `width` · 插槽: `default`, `icon`, `trailing-icon` · 事件: `change`

**扩展浮动按钮** — 扩展形式同时显示图标与文本：icon 插槽提供符号，默认插槽提供文本。它仍是页面主要操作的按钮。

```vue
<template>
  <bolle-extended-fab>
    <span slot="icon" aria-hidden="true">+</span>
    Nuova commessa
  </bolle-extended-fab>
</template>
```

### bolle-button-group

属性: `label`, `required`, `selection`, `shape`, `size`, `variant` · 插槽: `default` · 事件: `selection-change`

**相连按钮** — 分组连接相邻按钮：variant connected 去掉间距并共边，selection single 使分组成为单选并通过 change 返回值。

```vue
<script setup lang="ts">
import { ref } from "vue";

const vista = ref("elenco");
</script>

<template>
  <bolle-button-group
    variant="connected"
    selection="single"
    label="Vista"
    @change="vista = $event.detail.value"
  >
    <bolle-button
      variant="outlined"
      value="elenco"
      :selected="vista === 'elenco'"
    >
      Elenco
    </bolle-button>
    <bolle-button
      variant="outlined"
      value="griglia"
      :selected="vista === 'griglia'"
    >
      Griglia
    </bolle-button>
  </bolle-button-group>
</template>
```

### bolle-badge

属性: `label`, `max`, `small`, `value` · 插槽: `label` · 事件: -

**元素上的标记** — 徽章在包含它的元素上方显示 value，超过 max 的数字显示为“999+”。small 去掉文本只留圆点，用于无数值的标记。

```vue
<template>
  <bolle-badge value="12">
    <bolle-icon-button label="Messaggi">
      <span slot="icon" aria-hidden="true">★</span>
    </bolle-icon-button>
  </bolle-badge>

  <bolle-badge value="1200" :max="99">
    <bolle-avatar name="Giulia Ferraro"></bolle-avatar>
  </bolle-badge>
</template>
```

### bolle-bottom-app-bar

属性: `align`, `divider`, `dock`, `label`, `sticky`, `variant` · 插槽: `default`, `fab`, `leading`, `trailing` · 事件: -

**带浮动按钮的底部栏** — 底部栏容纳行内命令与浮动按钮：默认插槽接收命令，leading 与 trailing 提供两侧元素，fab 提供嵌入缺口中的按钮。dock 将按钮放入栏内。

```vue
<template>
  <bolle-bottom-app-bar dock>
    <bolle-icon-button slot="leading" label="Menu">
      <span slot="icon" aria-hidden="true">★</span>
    </bolle-icon-button>
    <bolle-icon-button label="Cerca">
      <span slot="icon" aria-hidden="true">+</span>
    </bolle-icon-button>
    <bolle-floating-action-button slot="fab" label="Nuova commessa">
      <span slot="icon" aria-hidden="true">+</span>
    </bolle-floating-action-button>
  </bolle-bottom-app-bar>
</template>
```

### bolle-avatar

属性: `alt`, `color`, `initials`, `label`, `name`, `shape`, `size`, `src`, `status` · 插槽: `badge`, `icon` · 事件: -

**带头像图片或首字母的 avatar** — src 显示图片，缺失或加载失败时组件回退到由 name 推导的首字母。initials 可手动指定，status 增加在线圆点，size 改变尺寸。

```vue
<script setup lang="ts">
const persone = [
  { src: "/giulia.jpg", name: "Giulia Ferraro", status: "online" },
  { name: "Marco Bellini", size: "lg" },
  { initials: "GF", color: "tertiary" },
];
</script>

<template>
  <bolle-avatar
    v-for="persona in persone"
    :key="persona.name ?? persona.initials"
    v-bind="persona"
  ></bolle-avatar>
</template>
```

更多配方: 用图标代替首字母的头像

### bolle-breadcrumb

属性: `label`, `max-items`, `separator` · JavaScript 属性: `items`, `labels` · 插槽: - · 事件: `breadcrumb-select`

**面包屑路径** — items 声明路径条目：组件在条目之间放置分隔符，并将最后一项标记为当前页面。separator 选择符号，max-items 将中间条目收纳在一个命令后。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { BreadcrumbItem } from "@bolle/web-components";

const items = ref<BreadcrumbItem[]>([
  { label: "Home", href: "#/it/" },
  { label: "Commesse", href: "#/it/commesse" },
  { label: "C2026-1000" },
]);

const onSelect = (event: CustomEvent<BreadcrumbItem>) => {
  console.log("Voce scelta:", event.detail.label);
};
</script>

<template>
  <bolle-breadcrumb
    label="Percorso"
    :items="items"
    @breadcrumb-select="onSelect"
  ></bolle-breadcrumb>
</template>
```

### bolle-avatar-group

属性: `interactive`, `label`, `max`, `overlap`, `size`, `total` · JavaScript 属性: `labels` · 插槽: `default` · 事件: `avatar-group-select`

**头像组** — 分组堆叠接收的 avatar，并用带计数的气泡汇总其余：max 决定显示多少个，total 在未全部传入时说明总数。

```vue
<script setup lang="ts">
const partecipanti = [
  { name: "Giulia Ferraro" },
  { name: "Marco Bellini" },
  { name: "Sara Colombo" },
];
</script>

<template>
  <bolle-avatar-group label="Partecipanti" :max="3" :total="8">
    <bolle-avatar
      v-for="persona in partecipanti"
      :key="persona.name"
      :name="persona.name"
    ></bolle-avatar>
  </bolle-avatar-group>
</template>
```

更多配方: 可交互的计数气泡

### bolle-empty-state

属性: `align`, `role`, `text`, `title`, `tone` · JavaScript 属性: `icon` · 插槽: `actions`, `icon` · 事件: -

**带命令的空状态** — 空状态居中显示图标、标题和文本；actions 插槽提供离开空状态的命令。tone error 将其着色为加载错误。

```vue
<template>
  <bolle-empty-state
    title="Nessuna commessa"
    text="Non ci sono commesse per questo filtro."
  >
    <bolle-button slot="actions" variant="filled">Crea commessa</bolle-button>
  </bolle-empty-state>

  <bolle-empty-state
    tone="error"
    title="Piano non raggiungibile"
    text="Riprova fra qualche istante."
  >
    <bolle-button slot="actions" variant="tonal">Riprova</bolle-button>
  </bolle-empty-state>
</template>
```

更多配方: 自定义图标与对齐

### bolle-pagination

属性: `form`, `label`, `page`, `page-size`, `range`, `total` · JavaScript 属性: `labels`, `pageSizes` · 插槽: - · 事件: `page-change`

**基于现有数据的分页** — page-size 启用分页器，total 说明行的总数：组件自行移动到所需页码并通过 page-change 报告，应用据此切分显示的数据。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { PaginationChangeDetail } from "@bolle/web-components";

const total = ref(248);

const onPage = (event: CustomEvent<PaginationChangeDetail>) => {
  const { page, pageSize } = event.detail;
  console.log("Pagina", page, "di", pageSize);
};
</script>

<template>
  <bolle-pagination
    label="Pagine"
    page-size="10"
    :total="total"
    @page-change="onPage"
  ></bolle-pagination>
</template>
```

更多配方: 选择每页行数与紧凑形式

### bolle-progress-indicator

属性: `indeterminate`, `label`, `max`, `value`, `variant`, `wavy` · 插槽: - · 事件: -

**线性与环形进度** — value 表示相对 max 的完成量，label 是屏幕阅读器读取的名称。variant circular 切换为圆环，indeterminate 表示无数值的等待。

```vue
<template>
  <bolle-progress-indicator :value="62" label="Avanzamento cantieri" />
  <bolle-progress-indicator
    :value="30"
    variant="circular"
    label="Avanzamento"
  />
  <bolle-progress-indicator indeterminate label="Caricamento" />
</template>
```

### bolle-loading-indicator

插槽: - · 事件: -

**加载指示器** — 指示器显示操作等待：label 是屏幕阅读器读取的名称，必须声明。variant contained 在覆盖瓦片时将其放在面板上。

```vue
<template>
  <bolle-loading-indicator label="Caricamento delle commesse" />
  <bolle-loading-indicator variant="contained" label="Aggiornamento" />
</template>
```

### bolle-snackbar

属性: `action-label`, `close-label`, `duration`, `message`, `open`, `tail` · 插槽: `action`, `dismiss`, `message` · 事件: `action`, `closed`, `queued`

**带操作的消息** — show() 打开消息，duration 自动关闭：message 插槽提供文本，action 提供附带操作，dismiss 提供关闭命令。message 仍是仅传文本的简写。

```vue
<script setup lang="ts">
import { ref } from "vue";

const messaggio = ref<HTMLElement | null>(null);
</script>

<template>
  <bolle-button variant="filled" @click="messaggio?.show()"
    >Archivia</bolle-button
  >

  <bolle-snackbar ref="messaggio" duration="6000">
    <span slot="message">Commessa archiviata</span>
    <bolle-button slot="action" variant="text" @click="ripristina"
      >Annulla</bolle-button
    >
  </bolle-snackbar>
</template>
```

### bolle-tour

属性: `index`, `locale`, `open`, `padding`, `placement` · JavaScript 属性: `steps` · 插槽: - · 事件: `finish`, `step-change`

**从 JSON 配置生成引导** — 步骤不写在代码里：parseTourConfig 读取带版本的 JSON，shouldStartTour 将其与应用已展示的版本比较。组件不访问网络、不保存状态，由应用决定何时开始，并在 finish 时保存版本。

```vue
<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  parseTourConfig,
  shouldStartTour,
  type TourStep,
} from "@bolle/web-components";

const tour = ref<{ start: (index?: number) => void }>();
const steps = ref<TourStep[]>([]);
let version = "";

const start = () => tour.value?.start();

onMounted(async () => {
  const config = parseTourConfig(await (await fetch("/tour.json")).text());
  steps.value = config.steps;
  version = config.version;
  if (shouldStartTour(config, localStorage.getItem("bolle-tour"))) start();
});

const onFinish = (event: CustomEvent<{ completed: boolean }>) => {
  if (event.detail.completed) localStorage.setItem("bolle-tour", version);
};
</script>

<template>
  <bolle-button variant="tonal" @click="start">Rivedi il tour</bolle-button>
  <bolle-tour ref="tour" :steps="steps" @finish="onFinish"></bolle-tour>
</template>
```

更多配方: 没有目标的步骤与结束操作 · 筛选任务 · 表格 · 就这么简单 · 控制引导并读取步骤

### bolle-tooltip

属性: `label`, `persistent`, `supporting-text`, `tail`, `variant` · JavaScript 属性: `labels` · 插槽: `actions`, `content`, `default`, `dismiss`, `label`, `supporting`, `trigger` · 事件: -

**命令上的提示** — 提示气泡通过 show(anchor) 附着到元素，指针离开或按下 Esc 时自行关闭。label 是简短文本，supporting-text 增加详情行。

```vue
<script setup lang="ts">
const hint = ref<HTMLElement | null>(null);
const salva = ref<HTMLElement | null>(null);
</script>

<template>
  <bolle-icon-button
    ref="salva"
    label="Salva"
    @pointerenter="hint?.show(salva)"
    @pointerleave="hint?.close()"
  >
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-icon-button>

  <bolle-tooltip
    ref="hint"
    label="Salva la commessa"
    supporting-text="Scorciatoia: Ctrl e S"
  >
  </bolle-tooltip>
</template>
```

### bolle-carousel

属性: `index`, `label`, `next-label`, `previous-label`, `variant` · 插槽: `controls`, `default`, `next`, `previous`, `status` · 事件: `change`

**卡片轮播** — 轮播在默认插槽中滚动元素并显示前进后退命令：index 表示当前可见项，选择变化通过 change 返回。滚动按步进行，支持触摸与键盘。

```vue
<template>
  <bolle-carousel label="Schede" @change="indice = $event.detail.index">
    <bolle-card>Prima scheda</bolle-card>
    <bolle-card>Seconda scheda</bolle-card>
    <bolle-card>Terza scheda</bolle-card>
  </bolle-carousel>
</template>
```

### bolle-card

属性: `href`, `label`, `orientation`, `tail`, `variant` · 插槽: `content`, `default`, `media` · 事件: -

**带图片与命令的卡片** — 卡片从默认插槽取得内容，media 提供占满宽度的顶部图片，actions 提供命令行。href 使整张卡片成为链接。

```vue
<template>
  <bolle-card variant="filled">
    <img slot="media" alt="" src="/cantiere.jpg" />
    <h3>Ristrutturazione scuola</h3>
    <p>Consegna prevista a marzo 2027.</p>
    <bolle-button slot="actions" variant="text">Apri</bolle-button>
  </bolle-card>
</template>
```

更多配方: 作为链接的横向卡片

### bolle-dialog

属性: `close-label`, `label`, `modal`, `open`, `variant` · 插槽: `actions`, `default`, `heading` · 事件: `before-close`, `closed`

**确认对话框** — open 打开对话框，modal 使其阻塞：焦点保持在内部直到关闭，关闭通过 closed 返回。heading 提供作为标题的文本，actions 提供命令行。

```vue
<script setup lang="ts">
import { ref } from "vue";

const aperto = ref(false);
const chiuso = (event: CustomEvent<{ returnValue: string }>) => {
  aperto.value = false;
  if (event.detail.returnValue === "archivia") archiviaLaCommessa();
};
</script>

<template>
  <bolle-button variant="filled" @click="aperto = true">Archivia</bolle-button>

  <bolle-dialog label="Archivia commessa" modal :open="aperto" @closed="chiuso">
    <h2 slot="heading">Archiviare la commessa?</h2>
    <p>La commessa esce dagli elenchi attivi e resta consultabile.</p>
    <bolle-button slot="actions" variant="text" @click="aperto = false">
      Annulla
    </bolle-button>
    <bolle-button slot="actions" variant="filled">Archivia</bolle-button>
  </bolle-dialog>
</template>
```

更多配方: 全屏对话框

### bolle-bottom-sheet

属性: `close-label`, `drag-handle`, `label`, `modal`, `open`, `variant` · 插槽: `actions`, `default`, `heading` · 事件: `before-close`, `closed`

**底部面板** — 面板从底边进入并带上命令：drag-handle 显示拖动它的手柄，heading 提供标题，actions 提供末行。open 与 show() 打开它。

```vue
<script setup lang="ts">
import { ref } from "vue";

const aperto = ref(false);
</script>

<template>
  <bolle-button variant="filled" @click="aperto = true">Filtri</bolle-button>
  <bolle-bottom-sheet label="Filtri" drag-handle modal :open="aperto">
    <h2 slot="heading">Filtri</h2>
    <p>Scegli lo stato delle commesse.</p>
    <bolle-button slot="actions" variant="text" @click="aperto = false">
      Annulla
    </bolle-button>
    <bolle-button slot="actions" variant="filled">Applica</bolle-button>
  </bolle-bottom-sheet>
</template>
```

### bolle-side-sheet

属性: `close-label`, `detached`, `label`, `modal`, `open`, `variant` · 插槽: `actions`, `default`, `heading` · 事件: `before-close`, `closed`

**侧边详情面板** — 面板从 placement 指定的一侧进入并保留内容可见：适合行详情，heading 提供标题，actions 提供尾随命令。

```vue
<script setup lang="ts">
import { ref } from "vue";

const aperto = ref(false);
</script>

<template>
  <bolle-button variant="tonal" @click="aperto = true">Dettaglio</bolle-button>
  <bolle-side-sheet
    label="Dettaglio commessa"
    placement="end"
    modal
    :open="aperto"
  >
    <h2 slot="heading">C2026-1000</h2>
    <p>Ristrutturazione scuola di Seriate.</p>
    <bolle-button slot="actions" variant="filled">Apri scheda</bolle-button>
  </bolle-side-sheet>
</template>
```

### bolle-divider

属性: `decorative`, `inset`, `variant`, `vertical` · 插槽: - · 事件: -

**组之间的分隔线** — 分隔线没有内容：分隔两组元素，inset 使其与边缘分开，vertical 用于分隔并排命令。

```vue
<template>
  <p>Committenti</p>
  <bolle-divider inset></bolle-divider>
  <p>Fornitori</p>

  <span>Esporta</span>
  <bolle-divider vertical></bolle-divider>
  <span>Archivia</span>
</template>
```

### bolle-app-bar

属性: `alignment`, `collapsed`, `label`, `scrolled`, `sticky`, `subtitle`, `variant` · 插槽: `actions`, `default`, `leading`, `title`, `trailing` · 事件: -

**应用栏** — 栏承载标题与命令：title 提供主文本，subtitle 提供下方一行，leading 与 actions 插槽提供两侧命令。需要更丰富的头部时用默认插槽替换 title。

```vue
<template>
  <bolle-app-bar title="Commesse" subtitle="12 attive" sticky>
    <bolle-icon-button slot="leading" label="Menu">
      <span slot="icon" aria-hidden="true">★</span>
    </bolle-icon-button>
    <bolle-icon-button slot="actions" label="Cerca">
      <span slot="icon" aria-hidden="true">+</span>
    </bolle-icon-button>
  </bolle-app-bar>
</template>
```

更多配方: 滚动时收起的栏

### bolle-toolbar

属性: `color`, `label`, `orientation`, `variant` · 插槽: `default` · 事件: -

**命令栏** — 栏把默认插槽收到的元素排开：不同变体区分主要命令与辅助命令，栏将多余元素换行而非压缩。

```vue
<template>
  <bolle-toolbar label="Azioni sulle commesse">
    <bolle-segmented-buttons label="Vista" :items="viste" />
    <bolle-button variant="text">Esporta</bolle-button>
    <bolle-button variant="text">Archivia</bolle-button>
  </bolle-toolbar>
</template>
```

### bolle-navigation-bar

属性: `label`, `layout`, `value`, `variant` · JavaScript 属性: `items` · 插槽: - · 事件: `navigate`

**导航栏** — items 声明带图标与文本的目标项，value 指定当前项：组件自行应用选择并通过 change 报告。超过五个目标项时宜改用侧边栏。

```vue
<script setup lang="ts">
import { ref } from "vue";

const sezione = ref("commesse");
const sezioni = [
  { id: "commesse", label: "Commesse" },
  { id: "clienti", label: "Clienti" },
  { id: "scadenze", label: "Scadenze" },
];
</script>

<template>
  <bolle-navigation-bar
    label="Sezioni"
    :items="sezioni"
    :value="sezione"
    @change="sezione = $event.detail.value"
  ></bolle-navigation-bar>
</template>
```

### bolle-navigation-rail

属性: `expanded`, `label`, `layout`, `value`, `variant` · JavaScript 属性: `items` · 插槽: - · 事件: `navigate`

**窄栏** — 窄栏显示目标项图标，使用 expanded 时同时显示文本。适用于空间有限但分区较多的场景，位于底部栏与侧面板之间。

```vue
<template>
  <bolle-navigation-rail
    label="Sezioni"
    expanded
    :items="sezioni"
    :value="sezione"
    @change="sezione = $event.detail.value"
  ></bolle-navigation-rail>
</template>
```

### bolle-navigation-drawer

属性: `close-label`, `detached`, `label`, `modal`, `open`, `value`, `variant` · JavaScript 属性: `items` · 插槽: `actions`, `default`, `heading` · 事件: `before-close`, `closed`, `navigate`

**导航面板** — 面板纵向展开条目，可内联在内容旁或覆盖页面：placement start 或 end 选择方向，modal 使其阻塞。

```vue
<template>
  <bolle-navigation-drawer
    label="Sezioni"
    open
    :items="sezioni"
    :value="sezione"
    @change="sezione = $event.detail.value"
  >
    <h2 slot="heading">Commesse</h2>
    <span slot="actions">Versione 0.3.3</span>
  </bolle-navigation-drawer>
</template>
```

### bolle-tabs

属性: `activation`, `label`, `scrollable`, `value`, `variant` · JavaScript 属性: `items`, `labels` · 插槽: `content-{itemId}`, `default` · 事件: `change`

**带面板的标签** — items 声明标签，value 指定当前标签：组件自行应用选择并通过 change 报告。每个面板通过 slot 声明打开它的标签。

```vue
<script setup lang="ts">
import { ref } from "vue";

const scheda = ref("note");
const schede = [
  { id: "note", label: "Note" },
  { id: "documenti", label: "Documenti", count: 3 },
];
</script>

<template>
  <bolle-tabs
    label="Dettaglio"
    :items="schede"
    :value="scheda"
    @change="scheda = $event.detail.value"
  >
    <div slot="note">Note della commessa</div>
    <div slot="documenti">Documenti allegati</div>
  </bolle-tabs>
</template>
```

更多配方: 可滚动的标签

### bolle-checkbox

属性: `checked`, `error`, `indeterminate`, `supporting-text` · 插槽: `default` · 事件: `change`

**带文本与辅助说明的复选框** — 复选框从默认插槽取得标签文本并自行切换状态，通过 change 报告 checked。supporting-text 增加说明行，indeterminate 显示混合状态。

```vue
<template>
  <bolle-checkbox name="urgente">Segna come urgente</bolle-checkbox>
  <bolle-checkbox
    name="privacy"
    required
    supporting-text="Serve per inviare la richiesta"
  >
    Ho letto l'informativa
  </bolle-checkbox>
</template>
```

更多配方: 控制列表的复选框

### bolle-switch

属性: `checked`, `error`, `indeterminate`, `supporting-text` · JavaScript 属性: `icon`, `iconSelected` · 插槽: `default` · 事件: `change`

**开关** — 开关自行切换状态并通过 change 返回值：适合立即生效的偏好；复选框则用于需要确认的选择。

```vue
<script setup lang="ts">
import { ref } from "vue";

const notifiche = ref(true);
</script>

<template>
  <bolle-switch
    name="notifiche"
    :checked="notifiche"
    @change="notifiche = $event.detail.checked"
  >
    Notifiche attive
  </bolle-switch>
</template>
```

### bolle-radio-button

属性: `checked`, `error`, `indeterminate`, `supporting-text` · 插槽: `default` · 事件: `change`

**选项组** — 单选按钮按 name 分组：选择一项会清除同组其他项的选择，值通过 change 返回。

```vue
<script setup lang="ts">
import { ref } from "vue";

const priorita = ref("alta");
const opzioni = ["alta", "media", "bassa"];
</script>

<template>
  <bolle-radio-button
    v-for="valore in opzioni"
    :key="valore"
    name="priorita"
    :value="valore"
    :checked="priorita === valore"
    @change="priorita = valore"
  >
    {{ valore }}
  </bolle-radio-button>
</template>
```

### bolle-chip

属性: `disabled`, `elevated`, `href`, `label`, `removable`, `remove-label`, `selected`, `variant` · 插槽: `avatar`, `default`, `icon` · 事件: `action`, `change`, `remove`

**带图标与移除的标签** — 标签从默认插槽取得文本，其他插槽提供图标或 avatar。selected 将其标记为已选，removable 增加移除命令并报告 remove。

```vue
<template>
  <bolle-chip selected>Urgente</bolle-chip>
  <bolle-chip removable remove-label="Togli il filtro Cliente">
    <bolle-avatar slot="avatar" name="Giulia Ferraro"></bolle-avatar>
    Cliente
  </bolle-chip>
</template>
```

### bolle-list

属性: `interactive`, `label`, `selection`, `variant` · JavaScript 属性: `expanded`, `itemRenderer`, `items`, `labels`, `value` · 插槽: `default` · 事件: `action`, `change`, `expand`

**带图标与详情的列表** — 列表从默认插槽取得行，并组合图标、文本、辅助内容和尾部内容；interactive 启用点击，selection 通过 change 报告选择。

```vue
<template>
  <bolle-list
    label="Commesse"
    interactive
    selection="single"
    @change="scelta = $event.detail.value"
  >
    <bolle-list-item>
      <span slot="leading" aria-hidden="true">★</span>
      C2026-1000
      <span slot="supporting">Ristrutturazione scuola</span>
      <span slot="trailing">12</span>
    </bolle-list-item>
    <bolle-list-item>C2026-1001</bolle-list-item>
  </bolle-list>
</template>
```

更多配方: 由数组生成的列表

### bolle-segmented-buttons

属性: `multiple` · JavaScript 属性: `items`, `values` · 插槽: - · 事件: `change`

**分段选择** — 分段来自 items，选择来自 value：控件自行应用并通过 change 报告。multiple 允许多个分段并返回 values。

```vue
<script setup lang="ts">
import { ref } from "vue";

const vista = ref("elenco");

const items = [
  { id: "elenco", label: "Elenco" },
  { id: "griglia", label: "Griglia" },
  { id: "mappa", label: "Mappa" },
];
</script>

<template>
  <bolle-segmented-buttons
    label="Vista"
    :items="items"
    :value="vista"
    @change="vista = $event.detail.value"
  ></bolle-segmented-buttons>
</template>
```

更多配方: 多选

### bolle-slider

属性: `compact`, `max`, `min`, `min-gap`, `step`, `suffix`, `upper-label`, `upper-value`, `variant` · JavaScript 属性: `icon` · 插槽: `icon`, `label`, `value` · 事件: `change`, `value-input`

**单个滑块** — 滑块在标签上显示值，拖动时通过 input 返回，结束时通过 change 返回。min 与 max 设定范围，step 设定步长。

```vue
<script setup lang="ts">
import { ref } from "vue";

const avanzamento = ref(40);
</script>

<template>
  <bolle-slider
    label="Avanzamento"
    min="0"
    max="100"
    step="5"
    :value="avanzamento"
    @change="avanzamento = Number($event.detail.value)"
  ></bolle-slider>
</template>
```

更多配方: 两值之间的区间

### bolle-steps

属性: `options` · 插槽: `label` · 事件: `change`

**流程步骤** — options 声明步骤名称，value 指定当前步骤：组件标记已完成、当前和待完成的步骤，并通过 change 报告选择。

```vue
<script setup lang="ts">
import { ref } from "vue";

const passo = ref("1");
const passi = ["Dati", "Documenti", "Riepilogo"];
</script>

<template>
  <bolle-steps
    label="Avanzamento"
    :options="passi"
    :value="passo"
    @change="passo = String($event.detail.index)"
  ></bolle-steps>
</template>
```

### bolle-text-field

属性: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · 插槽: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · 事件: `change`, `value-input`

**带前缀与辅助文本的字段** — 字段从插槽取得前缀、后缀和辅助文本，值留在 input 中并通过 input 与 change 返回。variant filled 或 outlined 改变框的样式。

```vue
<script setup lang="ts">
import { ref } from "vue";

const importo = ref("");
</script>

<template>
  <bolle-text-field
    label="Importo"
    type="number"
    :value="importo"
    @change="importo = $event.detail.value"
  >
    <span slot="prefix">€</span>
    <span slot="supporting">Importo al netto dell'IVA</span>
  </bolle-text-field>
</template>
```

更多配方: 错误状态的字段 · 多行字段

### bolle-search

属性: `appearance`, `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `filter`, `inputmode`, `layout`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `suggestion-delay`, `suggestions-label`, `supporting-text`, `type`, `variant` · JavaScript 属性: `suggestions` · 插槽: `leading`, `prefix`, `results`, `suffix`, `supporting`, `trailing` · 事件: `change`, `search`, `suggest`, `value-input`

**带结果的搜索栏** — 搜索是已内置清除命令的文本字段：results 接收显示在栏下的列表，由应用用 suggest 或 search 的结果填充。

```vue
<script setup lang="ts">
import { ref } from "vue";

const risultati = ref<Array<{ id: string; label: string }>>([]);
</script>

<template>
  <bolle-search
    label="Cerca commesse"
    @search="risultati = cercaSulServer($event.detail.value)"
  >
    <bolle-list slot="results" label="Risultati">
      <bolle-list-item v-for="voce in risultati" :key="voce.id">
        {{ voce.label }}
      </bolle-list-item>
    </bolle-list>
  </bolle-search>
</template>
```

更多配方: 栏内行内搜索

### bolle-date-picker

属性: `autocapitalize`, `autocomplete`, `counter`, `end-value`, `enterkeyhint`, `error`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `selection-mode`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant`, `week-starts-on` · JavaScript 属性: `labels` · 插槽: `end-label`, `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · 事件: `change`, `value-input`

**选择日期** — 选择器从字段打开日历：所选值以 ISO 格式通过 change 返回，locale 决定语言与星期名称。selection-mode range 在 end-value 中增加第二个日期。

```vue
<script setup lang="ts">
import { ref } from "vue";

const scadenza = ref("");
</script>

<template>
  <bolle-date-picker
    label="Scadenza"
    :value="scadenza"
    @change="scadenza = $event.detail.value"
  ></bolle-date-picker>
</template>
```

更多配方: 日期区间

### bolle-time-picker

属性: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `hour-cycle`, `inputmode`, `locale`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · JavaScript 属性: `labels` · 插槽: `leading`, `prefix`, `suffix`, `supporting`, `title`, `trailing` · 事件: `change`, `value-input`

**选择时间** — 选择器从字段打开小时表盘：所选值通过 change 返回，hour-cycle 决定十二或二十四小时制，title 插槽命名表盘。

```vue
<script setup lang="ts">
import { ref } from "vue";

const consegna = ref("");
</script>

<template>
  <bolle-time-picker
    label="Consegna"
    hour-cycle="24"
    :value="consegna"
    @change="consegna = $event.detail.value"
  >
    <span slot="title">Orario di consegna</span>
  </bolle-time-picker>
</template>
```

### bolle-menu

属性: `color-scheme`, `compact-width`, `density`, `filter`, `filterable`, `inactive`, `locale`, `menu-label`, `options`, `quick`, `selection-mode`, `tail`, `variant` · JavaScript 属性: `items`, `labels` · 插槽: - · 事件: -

**操作菜单** — show(anchor) 在调用它的元素下方打开菜单，选择通过 menu-select 返回。items 声明条目，含图标、快捷键、disabled 与子菜单。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { MenuEntry } from "@bolle/web-components";

const items: MenuEntry[] = [
  { id: "apri", label: "Apri scheda" },
  { id: "duplica", label: "Duplica", shortcut: "Ctrl D" },
  {
    id: "archivia",
    label: "Archivia",
    children: [{ id: "chiudi", label: "Chiudi anche i documenti" }],
  },
];

const menu = ref<HTMLElement | null>(null);
</script>

<template>
  <bolle-button variant="tonal" @click="menu?.show($event.currentTarget)">
    Azioni
  </bolle-button>
  <bolle-menu
    ref="menu"
    label="Azioni"
    :items="items"
    @menu-select="onScelta"
  ></bolle-menu>
</template>
```

### bolle-fab-menu

属性: `color`, `label`, `open`, `tail` · JavaScript 属性: `items` · 插槽: `icon` · 事件: `action`

**快捷操作** — 浮动按钮菜单从主按钮展开次要操作：items 声明条目，open 表示是否展开，选择通过 menu-select 返回。

```vue
<template>
  <bolle-fab-menu label="Azioni rapide" :items="items">
    <span slot="icon" aria-hidden="true">+</span>
  </bolle-fab-menu>
</template>
```

### bolle-split-button

属性: `disabled`, `icon`, `label`, `menu-label`, `size`, `variant` · JavaScript 属性: `items` · 插槽: `icon` · 事件: `action`

**主要操作与菜单** — 分体按钮左侧保持主要操作，菜单从旁边的命令展开：条目来自 items，选择通过 menu-select 返回，主要操作的点击通过 click 返回。

```vue
<script setup lang="ts">
const items = [
  { id: "bozza", label: "Salva come bozza" },
  { id: "duplica", label: "Salva e duplica" },
];
</script>

<template>
  <bolle-split-button label="Salva" variant="filled" :items="items">
    <span slot="icon" aria-hidden="true">★</span>
  </bolle-split-button>
</template>
```

### bolle-select

属性: `error`, `open`, `placeholder`, `supporting-text`, `variant` · 插槽: `supporting` · 事件: `change`

**带原生选项的 select** — select 包装原生 select 元素：选项留在标记中，值通过 change 返回。展开的菜单由组件提供，与文本字段样式一致。

```vue
<script setup lang="ts">
import { ref } from "vue";

const stato = ref("aperta");
</script>

<template>
  <bolle-select
    label="Stato"
    :value="stato"
    @change="stato = $event.detail.value"
  >
    <select name="stato">
      <option value="aperta">In corso</option>
      <option value="chiusa">Chiusa</option>
      <option value="sospesa">Sospesa</option>
    </select>
    <span slot="supporting">Lo stato decide l'ordine delle commesse</span>
  </bolle-select>
</template>
```

### bolle-autocomplete

属性: `autocapitalize`, `autocomplete`, `counter`, `enterkeyhint`, `error`, `inputmode`, `max`, `maxlength`, `min`, `minlength`, `multiline`, `pattern`, `placeholder`, `prefix`, `readonly`, `rows`, `spellcheck`, `step`, `suffix`, `supporting-text`, `type`, `variant` · JavaScript 属性: `options` · 插槽: `leading`, `prefix`, `suffix`, `supporting`, `trailing` · 事件: `change`, `value-input`

**带建议的字段** — suggestions 声明建议项，组件在输入时筛选并通过 suggest 返回；选择一项会填充字段并触发 change。suggestion-delay 设定请求数据前的等待。

```vue
<script setup lang="ts">
const suggerimenti = [
  { id: "bergamo", label: "Bergamo" },
  { id: "brescia", label: "Brescia" },
  { id: "seriate", label: "Seriate" },
];
</script>

<template>
  <bolle-autocomplete
    label="Comune"
    :suggestions="suggerimenti"
    :suggestion-delay="200"
  ></bolle-autocomplete>
</template>
```

### bolle-sidebar

属性: `collapsed`, `context`, `current`, `label`, `max-width`, `min-width`, `search`, `variant`, `width` · JavaScript 属性: `contentStyles`, `empty`, `expanded`, `filter`, `item`, `items`, `labels`, `railItem` · 插槽: `empty`, `filter`, `footer`, `header` · 事件: `collapse`, `expand`, `navigate`, `resize`

**导航树** — items 声明条目及其子项：组件构建最多三层的树，展开所选条目的分支，并通过 navigate 报告路径。当前条目用 current 设定，路径由条目以斜线分隔。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { SidebarItem, SidebarNavigateDetail } from "@bolle/web-components";

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

const current = ref("commesse/attive");

// La sidebar applica la scelta da sé: l'evento serve per navigare.
const onNavigate = (event: CustomEvent<SidebarNavigateDetail>) => {
  current.value = event.detail.path;
};
</script>

<template>
  <bolle-sidebar
    label="Navigazione"
    style="block-size: 520px"
    :items="items"
    :current="current"
    @navigate="onNavigate"
  ></bolle-sidebar>
</template>
```

更多配方: 搜索、计数与紧凑栏 · 条目内容

### bolle-app-shell

属性: `close-label`, `expanded-width`, `form`, `label`, `medium-width`, `supporting-label`, `supporting-mode`, `supporting-open` · JavaScript 属性: `labels` · 插槽: `bar`, `bottom-bar`, `default`, `navigation`, `navigation-compact`, `status`, `supporting`, `supporting-actions`, `supporting-header`, `supporting-inline`, `supporting-modal` · 事件: `form-change`, `supporting-close`

**完整外壳** — 外壳在内容周围组合各面板：导航、栏、底部栏与辅助面板来自插槽，主要内容位于默认插槽。未接收内容的区域不占空间。

```vue
<template>
  <bolle-app-shell style="block-size: 100dvh">
    <bolle-navigation-drawer slot="navigation" label="Sezioni">
      <a href="#/commesse">Commesse</a>
      <a href="#/clienti">Clienti</a>
    </bolle-navigation-drawer>
    <bolle-app-bar slot="bar" title="Commesse"></bolle-app-bar>
    <main>Contenuto della pagina</main>
    <bolle-bottom-app-bar slot="bottom-bar"></bolle-bottom-app-bar>
  </bolle-app-shell>
</template>
```

更多配方: 辅助面板

### bolle-dashboard

属性: `columns`, `compact-columns`, `density`, `label`, `medium-columns` · JavaScript 属性: `labels` · 插槽: `default` · 事件: -

**瓦片网格** — 仪表盘排列收到的瓦片，不限定内容：每个瓦片都是 bolle-widget，span 决定占多少列，min-span 在空间变窄时设定下限。

```vue
<template>
  <bolle-dashboard label="Panoramica" style="block-size: 640px">
    <bolle-widget title="Lavori in ritardo" span="8" min-span="4">
      <p>Quattro commesse oltre la scadenza.</p>
    </bolle-widget>
    <bolle-widget title="Avanzamento cantieri" span="4" min-span="3">
      <bolle-progress-indicator value="62" label="Avanzamento" />
    </bolle-widget>
  </bolle-dashboard>
</template>
```

更多配方: 可移动与调整大小的瓦片

### bolle-kanban

属性: `addable`, `card-gap`, `collapsible`, `column-gap`, `column-max-width`, `column-min-width`, `density`, `empty-label`, `error`, `label`, `lanes`, `loading`, `movable`, `selected` · JavaScript 属性: `card`, `cardActions`, `cards`, `collapsed`, `columnActions`, `columnRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `labels`, `laneLabel`, `laneRenderer`, `loadingRenderer`, `restrict` · 插槽: `empty`, `error`, `loading` · 事件: `card-action`, `card-add`, `card-move`, `card-move-blocked`, `card-open`, `column-action`, `column-collapse`, `retry`

**最简看板** — columns 声明列，cards 声明卡片，每张卡片带有其所在列。使用 movable 时，读者可拖动卡片或用 Alt 加方向键移动：看板自行应用并通过 card-move 报告。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { KanbanCard, KanbanColumn } from "@bolle/web-components";

const columns: KanbanColumn[] = [
  { id: "da-fare", label: "Da fare" },
  { id: "in-corso", label: "In corso" },
  { id: "fatto", label: "Fatto" },
];

const cards = ref<KanbanCard[]>([
  { id: "c-1", column: "da-fare", title: "Sopralluogo" },
  { id: "c-2", column: "in-corso", title: "Posa massetto" },
]);
</script>

<template>
  <bolle-kanban
    label="Cantieri"
    movable
    style="block-size: 520px"
    :columns="columns"
    :cards="cards"
  ></bolle-kanban>
</template>
```

更多配方: 移动规则与限制 · 卡片内容

### bolle-gantt

属性: `baseline`, `density`, `editable`, `empty-label`, `error`, `group-by`, `label`, `linkable`, `loading`, `scale`, `selected` · JavaScript 属性: `barRenderer`, `columns`, `contentStyles`, `emptyRenderer`, `errorRenderer`, `groupLabel`, `labels`, `loadingRenderer`, `restrict`, `tasks` · 插槽: `empty`, `error`, `loading` · 事件: `columns-change`, `dependency-add`, `dependency-blocked`, `retry`, `task-change`, `task-change-blocked`, `task-open`, `task-select`, `view-change`

**最简计划** — 计划在时间轴上绘制任务：parent 构建层级，带子任务的任务显示为汇总条。宿主必须设定高度，因为该面板会填满收到的空间。

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { GanttTask } from "@bolle/web-components";

const tasks = ref<GanttTask[]>([
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
]);
</script>

<template>
  <bolle-gantt
    label="Piano di commessa"
    style="block-size: 420px"
    :tasks="tasks"
  ></bolle-gantt>
</template>
```

更多配方: 列与单元格内容 · 移动与调整长度 · 条形内容 · 状态与插槽

### bolle-data-table

属性: `compact-row-height`, `default-column-width`, `density`, `empty-label`, `error`, `expandable`, `group-by`, `group-height`, `header-height`, `label`, `loading`, `max-column-width`, `min-column-width`, `overscan`, `page`, `page-size`, `row-height`, `row-key`, `selectable`, `total`, `updating`, `variant`, `virtual` · JavaScript 属性: `columnHandler`, `columns`, `contentStyles`, `detail`, `emptyRenderer`, `errorRenderer`, `expanded`, `footerRenderer`, `groupRenderer`, `groupSummary`, `headerRenderer`, `labels`, `loadingRenderer`, `pageHandler`, `rowActions`, `rowRenderer`, `rows`, `selected`, `sort`, `sortHandler` · 插槽: `empty`, `empty-state`, `error`, `footer`, `header`, `loading` · 事件: `column-change`, `expand`, `group`, `retry`, `row-action`, `row-activate`, `select`, `sort`

**通过包装组件使用框架插槽** — Vue 和 React 无法向自定义元素传递带作用域的插槽。几行代码的包装组件把插槽转换为渲染函数：页面只写一次单元格模板，包装组件为每一行挂载内容，并在单元格离开文档时释放内存。

```vue
<!-- BolleDataTable.vue -->
<script setup lang="ts">
import { computed, h, onBeforeUnmount, render as mountVue } from "vue";
import type { DataTableColumn, DataTableRow } from "@bolle/web-components";

const props = defineProps<{
  columns: DataTableColumn[];
  rows: DataTableRow[];
}>();

const slots = defineSlots<{
  cell?: (scope: { row: DataTableRow; column: DataTableColumn }) => unknown;
}>();

const hosts = new Map<string, HTMLElement>();
let pruneScheduled = false;

const prune = () => {
  if (pruneScheduled) return;
  pruneScheduled = true;
  queueMicrotask(() => {
    pruneScheduled = false;
    for (const [key, host] of hosts)
      if (!host.isConnected) {
        mountVue(null, host);
        hosts.delete(key);
      }
  });
};

const mount = (key: string, vnode: unknown) => {
  const host = hosts.get(key) ?? document.createElement("span");
  hosts.set(key, host);
  mountVue(vnode as never, host);
  prune();
  return host;
};

const columns = computed(() =>
  props.columns.map((column) => ({
    ...column,
    render: slots.cell
      ? (row: DataTableRow) =>
          mount(
            `${row.id}-${column.key}`,
            h("span", slots.cell!({ row, column })),
          )
      : column.render,
  })),
);

onBeforeUnmount(() => {
  for (const host of hosts.values()) mountVue(null, host);
  hosts.clear();
});
</script>

<template>
  <bolle-data-table v-bind="$attrs" :columns="columns" :rows="rows" />
</template>

<!-- Pagina.vue: il template della cella si scrive una volta. -->
<template>
  <BolleDataTable label="Commesse" row-key="id" :columns="columns" :rows="rows">
    <template #cell="{ row, column }">
      <span v-if="column.key === 'status'" class="badge">
        {{ row.status }}
      </span>
    </template>
  </BolleDataTable>
</template>
```

更多配方: 注册组件 · 最小表格 · 格式化数值 · 自定义单元格 · 排序 · 行选择 · 行详情 · 分组 · 分页 · 加载、错误和空状态 · 固定列、宽度与可见性 · 连续滚动 · 通过 CSS 部件设置样式
