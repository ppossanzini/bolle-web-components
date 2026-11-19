import { html, nothing, type PropertyValues } from "lit";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { avatarGroupStyles } from "./avatar-group.styles.js";
import { breadcrumbLabels, type BreadcrumbLabels } from "./localization.js";
import type { BolleAvatar } from "./avatar.js";

export interface AvatarGroupSelectDetail {
  /** Number of people the group hides behind the overflow bubble. */
  count: number;
}

const fill = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );

/**
 * People shown as overlapping avatars. It places the `bolle-avatar` children it
 * receives and, beyond `max`, sums them up in an overflow bubble.
 */
export class BolleAvatarGroup extends BolleElement {
  static properties = {
    max: { type: Number },
    total: { type: Number },
    size: { reflect: true },
    overlap: { type: Number },
    interactive: { type: Boolean, reflect: true },
    label: {},
    labels: { attribute: false },
    _more: { state: true },
    _count: { state: true },
  };
  static styles = [commonStyles, avatarGroupStyles];

  /** Avatars shown before the overflow bubble; 0 shows every avatar. */
  max = 4;
  /** People in the group when not every one of them is passed as an avatar. */
  total = 0;
  size: "xs" | "small" | "medium" | "large" | "xl" = "medium";
  /** Share of an avatar the next one covers, from 0 to 1. */
  /**
   * Share of an avatar the next one covers, from 0 to 1. Kept small so two
   * initials stay readable under the avatar that follows.
   */
  overlap = 0.2;
  /** Makes the overflow bubble a button that asks for the full list. */
  interactive = false;
  /** Accessible name of the group. */
  label = "";
  labels: Partial<BreadcrumbLabels> = {};

  private _more = 0;
  private _count = 0;

  private get text(): BreadcrumbLabels {
    return breadcrumbLabels(
      document.documentElement.lang,
      this.labels as Partial<BreadcrumbLabels>,
    );
  }

  private get avatars() {
    return Array.from(this.querySelectorAll<BolleAvatar>("bolle-avatar"));
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "group");
  }

  protected updated(changed: PropertyValues<this>) {
    this.style.setProperty("--bb-avatar-group-overlap", String(this.overlap));
    this.setAttribute("aria-label", this.accessibleName);
    if (changed.has("max") || changed.has("total")) this.refresh();
  }

  /** Hides the avatars past `max` and counts the people behind the bubble. */
  private refresh() {
    const avatars = this.avatars;
    const visible = this.max > 0 ? this.max : avatars.length;
    let hidden = 0;
    avatars.forEach((avatar, index) => {
      const hide = index >= visible;
      avatar.hidden = hide;
      if (hide) hidden += 1;
    });
    const declared = this.total || avatars.length;
    this._count = declared;
    this._more = Math.max(0, hidden + Math.max(0, declared - avatars.length));
  }

  private get accessibleName() {
    return this.label || this.text.group;
  }

  protected render() {
    const more = this._more;
    const label = fill(this.text.more, { count: more });
    return html`<span class="group">
      <slot @slotchange=${() => this.refresh()}></slot>
      ${more > 0
        ? this.interactive
          ? html`<button
              class="more"
              type="button"
              aria-label=${label}
              @click=${() =>
                this.emit<AvatarGroupSelectDetail>("avatar-group-select", {
                  count: more,
                })}
            >
              +${more}
            </button>`
          : html`<span class="more" role="img" aria-label=${label}>+${more}</span>`
        : nothing}
    </span>`;
  }
}
