import { LitElement, html, nothing } from "lit";
import type { BolleDialog } from "../src/index.js";
import type { ExamplePanels } from "./codepen.js";
import { openInCodePen, penHead } from "./codepen.js";
import { ti } from "../demo/icons.js";
import { l } from "./i18n.js";

type Panel = "html" | "css" | "js";

/** Document loaded by the preview frame: the panels plus the shared head. */
const previewDocument = (panels: ExamplePanels) => `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${penHead}
<style>${panels.css}</style>
</head>
<body>
${panels.html}
<script type="module">
${panels.js}
</script>
</body>
</html>`;

/**
 * Modal editor for a runnable example: the reader edits the three panels, runs
 * them in a sandboxed frame and can copy the result or open it in CodePen.
 */
export class RecipePlayground extends LitElement {
  static properties = {
    panel: { state: true },
    source: { state: true },
    running: { state: true },
  };

  declare panel: Panel;
  declare source: ExamplePanels;
  declare running: string;

  private original: ExamplePanels = { title: "", html: "", css: "", js: "" };

  constructor() {
    super();
    this.panel = "html";
    this.source = { title: "", html: "", css: "", js: "" };
    this.running = "";
  }

  createRenderRoot() {
    return this;
  }

  show(example: ExamplePanels) {
    this.original = { ...example };
    this.source = { ...example };
    this.panel = "html";
    this.run();
    const dialog = this.querySelector<BolleDialog>("#playground-dialog");
    void dialog?.show();
  }

  private run() {
    this.running = previewDocument(this.source);
  }

  private edit(panel: Panel, value: string) {
    this.source = { ...this.source, [panel]: value };
  }

  private reset() {
    this.source = { ...this.original };
    this.run();
  }

  private close() {
    this.querySelector<BolleDialog>("#playground-dialog")?.close();
  }

  private get markdown() {
    return [
      `# ${this.source.title}`,
      "",
      "```html",
      this.source.html,
      "```",
      "",
      "```css",
      this.source.css,
      "```",
      "",
      "```js",
      this.source.js,
      "```",
    ].join("\n");
  }

  private async copy() {
    await navigator.clipboard.writeText(this.markdown);
    document
      .querySelector<HTMLElement & { show(message: string): void }>(
        "#site-snackbar",
      )
      ?.show(l("Esempio copiato"));
  }

  protected render() {
    return html`<bolle-dialog
      id="playground-dialog"
      variant="fullscreen"
      modal
      label=${this.source.title}
    >
      <span slot="heading" class="pg-title">${this.source.title}</span>
      <bolle-icon-button
        slot="heading"
        variant="standard"
        label=${l("Chiudi")}
        @click=${() => this.close()}
        >${ti("x")}</bolle-icon-button
      >
      <div class="pg">
        <div class="pg-editor">
          <div class="pg-bar">
            <bolle-segmented-buttons
              label=${l("Pannelli dell'esempio")}
              .items=${[
                { id: "html", label: "HTML" },
                { id: "css", label: "CSS" },
                { id: "js", label: "JavaScript" },
              ]}
              .value=${this.panel}
              @change=${(event: Event) => {
                if (event.target !== event.currentTarget) return;
                this.panel = (event as CustomEvent<{ value: string }>).detail
                  .value as Panel;
              }}
            ></bolle-segmented-buttons>
            <span class="pg-actions">
              <bolle-button variant="filled" @click=${() => this.run()}
                >${l("Esegui")}</bolle-button
              >
              <bolle-button variant="text" @click=${() => this.reset()}
                >${l("Reimposta")}</bolle-button
              >
              <bolle-button variant="text" @click=${() => this.copy()}
                >${l("Copia")}</bolle-button
              >
              <bolle-button
                variant="text"
                @click=${() => openInCodePen(this.source)}
                >${l("Apri in CodePen")}</bolle-button
              >
            </span>
          </div>
          <textarea
            class="pg-code"
            spellcheck="false"
            aria-label=${this.panel.toUpperCase()}
            .value=${this.source[this.panel]}
            @input=${(event: Event) =>
              this.edit(
                this.panel,
                (event.target as HTMLTextAreaElement).value,
              )}
          ></textarea>
        </div>
        <div class="pg-preview">
          ${
            this.running
              ? html`<iframe
                  class="pg-frame"
                  title=${l("Anteprima di {title}", {
                    title: this.source.title,
                  })}
                  sandbox="allow-scripts allow-forms allow-popups allow-modals"
                  .srcdoc=${this.running}
                ></iframe>`
              : nothing
          }
        </div>
      </div>
      <bolle-button slot="actions" variant="text" @click=${() => this.close()}
        >${l("Chiudi")}</bolle-button
      >
    </bolle-dialog>`;
  }
}

if (!customElements.get("recipe-playground"))
  customElements.define("recipe-playground", RecipePlayground);
