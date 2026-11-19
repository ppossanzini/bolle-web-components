/** Runnable example: the three panels of an editor, ready to execute. */
export interface ExamplePanels {
  title: string;
  html: string;
  css: string;
  js: string;
}

const PACKAGE = "bolle-web-components@0.3.3";
const MODULE_URL = `https://esm.sh/${PACKAGE}`;
const TOKENS_URL = `https://cdn.jsdelivr.net/npm/${PACKAGE}/dist/tokens.css`;
const TYPOGRAPHY_URL = `https://cdn.jsdelivr.net/npm/${PACKAGE}/dist/typography.css`;

/** Stylesheet links and the import map that resolves the package name. */
export const penHead = `<link rel="stylesheet" href="${TOKENS_URL}">
<link rel="stylesheet" href="${TYPOGRAPHY_URL}">
<style>body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; }</style>
<script type="importmap">
{ "imports": { "@bolle/web-components": "${MODULE_URL}" } }
</script>`;

/** Opens a new CodePen with the given content through the documented prefill POST. */
export function openInCodePen(payload: ExamplePanels): void {
  const form = document.createElement("form");
  form.action = "https://codepen.io/pen/define";
  form.method = "POST";
  form.target = "_blank";
  form.style.display = "none";

  const data = document.createElement("input");
  data.type = "hidden";
  data.name = "data";
  data.value = JSON.stringify({
    title: payload.title,
    html: payload.html,
    css: payload.css,
    js: payload.js,
    head: penHead,
    editors: "1100",
    tags: ["web-components", "bolle", "design-system"],
  });

  form.append(data);
  document.body.append(form);
  form.submit();
  form.remove();
}
