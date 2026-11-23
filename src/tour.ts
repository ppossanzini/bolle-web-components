import { html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { tourStyles } from "./tour.styles.js";
import { tourLabels, type TourLabels } from "./localization.js";

export type TourPlacement = "auto" | "top" | "bottom" | "start" | "end";

export interface TourStep {
  /** CSS selector of the element to highlight; without it the card is centred. */
  target?: string;
  title: string;
  body?: string;
  /** Overrides the placement of the tour for this step. */
  placement?: TourPlacement;
  /** Label of the primary button on the last step, e.g. "Apri il cruscotto". */
  actionLabel?: string;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface CardPosition {
  left: number;
  top: number;
  tail: "below" | "above" | "start" | "end";
}

const FOCUSABLE =
  "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
/** Space between the highlighted box and the card. */
const GAP = 12;
/** Smallest distance the card keeps from the viewport edge. */
const MARGIN = 12;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Focusable elements under a root, crossing the shadow roots of the controls in it. */
function focusableElements(root: ParentNode): HTMLElement[] {
  const found: HTMLElement[] = [];
  for (const element of root.querySelectorAll<HTMLElement>("*")) {
    if (element.matches(FOCUSABLE) && element.checkVisibility())
      found.push(element);
    if (element.shadowRoot)
      found.push(...focusableElements(element.shadowRoot));
  }
  return found;
}

/** The focused element, followed down through every open shadow root. */
function deepActive(root: ParentNode): HTMLElement | null {
  let active = (root as ShadowRoot).activeElement as HTMLElement | null;
  while (active?.shadowRoot?.activeElement)
    active = active.shadowRoot.activeElement as HTMLElement;
  return active;
}

/**
 * First-run tour: dims the page, keeps one element in the light and walks the reader
 * through the steps of a configuration. The steps are a property, so the content is
 * data: `parseTourConfig` in `tour-config.ts` reads and validates the JSON file.
 */
export class BolleTour extends BolleElement {
  static properties = {
    steps: { attribute: false },
    open: { type: Boolean, reflect: true },
    index: { type: Number },
    placement: { reflect: true },
    padding: { type: Number },
    locale: {},
  };
  static styles = [commonStyles, tourStyles];

  steps: TourStep[] = [];
  open = false;
  /** Step on screen; set it to open the tour on a given step. */
  index = 0;
  placement: TourPlacement = "auto";
  /** Space kept around the highlighted element. */
  padding = 8;
  /** BCP 47 tag of the built-in texts; empty reads the document language. */
  locale = "";

  private area: Box | null = null;
  private target: HTMLElement | null = null;
  private previousFocus: HTMLElement | null = null;
  /** Measured after layout, so the position follows the real card size. */
  private cardSize = { width: 0, height: 0 };
  private cardObserver = new ResizeObserver(() => {
    this.syncCardSize();
    this.applyPosition();
  });
  private observedCard: HTMLElement | null = null;

  get step(): TourStep | undefined {
    return this.steps[this.index];
  }

  get labels(): TourLabels {
    return tourLabels(this.locale || document.documentElement.lang);
  }

  /** Opens the tour on a step. Without steps it does nothing. */
  start(index = 0) {
    if (!this.steps.length) return;
    this.index = Math.max(0, Math.min(index, this.steps.length - 1));
    this.open = true;
  }

  next() {
    if (this.index >= this.steps.length - 1) {
      this.finish(true);
      return;
    }
    this.index += 1;
  }

  back() {
    if (this.index > 0) this.index -= 1;
  }

  /** Closes the tour; `completed` tells the page whether the reader reached the end. */
  finish(completed: boolean) {
    if (!this.open) return;
    this.open = false;
    this.emit("finish", { completed, index: this.index });
  }

  /** Re-reads the target and its box, for a page that changed while the tour is open. */
  refresh() {
    if (!this.open) return;
    this.measure();
    this.requestUpdate();
  }

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener("scroll", this.onViewportChange, true);
    window.addEventListener("resize", this.onViewportChange);
    window.addEventListener("keydown", this.onKeydown, true);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("scroll", this.onViewportChange, true);
    window.removeEventListener("resize", this.onViewportChange);
    window.removeEventListener("keydown", this.onKeydown, true);
    this.cardObserver.disconnect();
    this.observedCard = null;
  }

  /** Measures the target before rendering, so the first paint lands in the right place. */
  protected willUpdate(changed: PropertyValues) {
    if (
      this.open &&
      (changed.has("open") || changed.has("index") || changed.has("steps"))
    )
      this.measure();
  }

  protected updated(changed: PropertyValues) {
    // The card is measured once it lands in the DOM, so the first paint can use the
    // previous size: the correction is written before the frame is painted.
    this.observeCard();
    this.syncCardSize();
    this.applyPosition();
    void this.settleCard();
    const opened = changed.has("open");
    if (opened && !this.open) {
      if (this.previousFocus?.isConnected) {
        this.previousFocus.focus({ preventScroll: true });
        this.previousFocus = null;
      }
      return;
    }
    if (!this.open) return;
    const stepped = opened || changed.has("index") || changed.has("steps");
    if (!stepped) return;
    if (opened)
      this.previousFocus = document.activeElement as HTMLElement | null;
    this.reveal();
    this.focusCard();
    this.emit("step-change", {
      index: this.index,
      step: this.step,
      total: this.steps.length,
    });
  }

  /** Keeps the measured card size in step with the rendered one. */
  private observeCard() {
    const card = this.renderRoot.querySelector<HTMLElement>(".card");
    if (card !== this.observedCard) {
      this.cardObserver.disconnect();
      this.observedCard = card;
      if (card) this.cardObserver.observe(card);
      this.syncCardSize();
    }
  }

  private syncCardSize() {
    const card = this.observedCard;
    if (!card) return;
    this.cardSize = { width: card.offsetWidth, height: card.offsetHeight };
  }

  /**
   * Measures the card once the controls it contains have rendered: their own first update
   * lands after ours, and until then the card is shorter than what the reader sees.
   */
  private async settleCard() {
    const card = this.observedCard;
    if (!card) return;
    const pending = [
      ...card.querySelectorAll<
        HTMLElement & { updateComplete?: Promise<unknown> }
      >("*"),
    ]
      .map((element) => element.updateComplete)
      .filter((done): done is Promise<unknown> => Boolean(done));
    if (pending.length) await Promise.all(pending);
    if (this.observedCard !== card) return;
    this.syncCardSize();
    this.applyPosition();
  }

  /** Writes the computed position straight to the card, without a second render. */
  private applyPosition() {
    const card = this.observedCard;
    if (!card) return;
    const position = this.position();
    card.style.left = `${position.left}px`;
    card.style.top = `${position.top}px`;
    card.dataset.tail = position.tail;
  }

  private onViewportChange = () => {
    if (!this.open) return;
    this.measure();
    this.requestUpdate();
  };

  private onKeydown = (event: KeyboardEvent) => {
    if (!this.open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      this.finish(false);
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = focusableElements(this.renderRoot);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = deepActive(this.renderRoot);
    if (event.shiftKey && (!active || active === first)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  private focusCard() {
    this.renderRoot.querySelector<HTMLElement>(".card")?.focus();
  }

  /** Brings the target into view, but only when it is not already fully visible. */
  private reveal() {
    const selector = this.step?.target?.trim();
    const target = selector
      ? document.querySelector<HTMLElement>(selector)
      : null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const visible =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth;
    if (visible) return;
    target.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: reducedMotion() ? "auto" : "smooth",
    });
  }

  private measure() {
    const selector = this.step?.target?.trim();
    this.target = selector
      ? document.querySelector<HTMLElement>(selector)
      : null;
    const rect = this.target?.getBoundingClientRect();
    this.area = rect
      ? {
          left: rect.left - this.padding,
          top: rect.top - this.padding,
          width: rect.width + this.padding * 2,
          height: rect.height + this.padding * 2,
        }
      : null;
  }

  /** Places the card beside the target, or in the middle when there is no target. */
  private position(): CardPosition {
    const size = this.cardSize;
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const centre: CardPosition = {
      left: Math.round((viewport.width - size.width) / 2),
      top: Math.round((viewport.height - size.height) / 2),
      tail: "below",
    };
    let next = centre;
    if (this.area) {
      const area = this.area;
      const around: Record<Exclude<TourPlacement, "auto">, CardPosition> = {
        bottom: {
          left: Math.round(area.left + area.width / 2 - size.width / 2),
          top: Math.round(area.top + area.height + GAP),
          tail: "below",
        },
        top: {
          left: Math.round(area.left + area.width / 2 - size.width / 2),
          top: Math.round(area.top - size.height - GAP),
          tail: "above",
        },
        end: {
          left: Math.round(area.left + area.width + GAP),
          top: Math.round(area.top + area.height / 2 - size.height / 2),
          tail: "end",
        },
        start: {
          left: Math.round(area.left - size.width - GAP),
          top: Math.round(area.top + area.height / 2 - size.height / 2),
          tail: "start",
        },
      };
      const wanted: Exclude<TourPlacement, "auto">[] =
        (this.step?.placement ?? this.placement) === "auto"
          ? ["bottom", "top", "end", "start"]
          : [
              (this.step?.placement ?? this.placement) as Exclude<
                TourPlacement,
                "auto"
              >,
            ];
      const fits = (position: CardPosition) =>
        position.left >= MARGIN &&
        position.top >= MARGIN &&
        position.left + size.width <= viewport.width - MARGIN &&
        position.top + size.height <= viewport.height - MARGIN;
      next = wanted.map((placement) => around[placement]).find(fits) ?? centre;
    }
    const clamp = (value: number, min: number, max: number) =>
      Math.round(Math.max(min, Math.min(value, max)));
    next = {
      ...next,
      left: clamp(
        next.left,
        MARGIN,
        Math.max(MARGIN, viewport.width - size.width - MARGIN),
      ),
      top: clamp(
        next.top,
        MARGIN,
        Math.max(MARGIN, viewport.height - size.height - MARGIN),
      ),
    };
    return next;
  }

  protected render() {
    const step = this.step;
    if (!this.open || !step) return nothing;
    const position = this.position();
    const labels = this.labels;
    const counter = labels.counter
      .replace("{current}", String(this.index + 1))
      .replace("{total}", String(this.steps.length));
    const last = this.index >= this.steps.length - 1;
    return html`<div
      class="layer"
      part="layer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
      aria-describedby=${step.body ? "tour-body" : nothing}
    >
      <div
        class="spotlight ${this.area ? "" : "is-centred"}"
        part="spotlight"
        aria-hidden="true"
        style=${
          this.area
            ? styleMap({
                left: `${this.area.left}px`,
                top: `${this.area.top}px`,
                width: `${this.area.width}px`,
                height: `${this.area.height}px`,
              })
            : nothing
        }
      ></div>
      <section
        class="card"
        part="card"
        tabindex="-1"
        data-tail=${position.tail}
        style=${styleMap({
          left: `${position.left}px`,
          top: `${position.top}px`,
        })}
      >
        <p class="counter" part="counter">${counter}</p>
        <h2 class="title" part="title" id="tour-title">${step.title}</h2>
        ${
          step.body
            ? html`<p class="body" part="body" id="tour-body">${step.body}</p>`
            : nothing
        }
        <div class="actions" part="actions">
          <bolle-button variant="text" @click=${() => this.finish(false)}
            >${labels.skip}</bolle-button
          >
          <div class="nav">
            ${
              this.index > 0
                ? html`<bolle-button variant="text" @click=${() => this.back()}
                    >${labels.back}</bolle-button
                  >`
                : nothing
            }
            <bolle-button @click=${() => this.next()}
              >${last ? (step.actionLabel ?? labels.done) : labels.next}</bolle-button
            >
          </div>
        </div>
      </section>
    </div>`;
  }
}
