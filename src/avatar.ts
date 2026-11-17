import { html, nothing, type PropertyValues } from "lit";
import { BolleElement } from "./shared.js";
import { commonStyles } from "./shared.styles.js";
import { avatarStyles } from "./avatar.styles.js";

export type AvatarSize = "xs" | "small" | "medium" | "large" | "xl";
export type AvatarShape = "circle" | "rounded" | "square";
export type AvatarStatus = "online" | "busy" | "away" | "offline";

/** First letters of a name: one for a single word, two for a full name. */
export function avatarInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const pick = words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[words.length - 1][0];
  // Word boundaries in some scripts are not spaces: a single long word keeps one letter.
  return pick.slice(0, 2).toLocaleUpperCase();
}

/**
 * Identity mark of a person or an entity: a picture, the initials of a name, or an
 * icon, with an optional status dot. Slots: `icon`, `badge`.
 */
export class BolleAvatar extends BolleElement {
  static properties = {
    src: {},
    alt: {},
    name: {},
    initials: {},
    label: {},
    size: { reflect: true },
    shape: { reflect: true },
    color: { reflect: true },
    status: { reflect: true },
    _imageFailed: { state: true },
  };
  static styles = [commonStyles, avatarStyles];

  /** Image URL; when it cannot be loaded the avatar falls back to the initials. */
  src = "";
  /** Alternative text of the image. */
  alt = "";
  /** Full name, used for the initials when `initials` is empty. */
  name = "";
  /** Initials shown without an image; derived from `name` when empty. */
  initials = "";
  /** Accessible name of the avatar; `alt` then `name` then `initials` when empty. */
  label = "";
  size: AvatarSize = "medium";
  shape: AvatarShape = "circle";
  color: "primary" | "secondary" | "tertiary" | "surface" = "tertiary";
  status?: AvatarStatus;

  private _imageFailed = false;

  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has("src")) this._imageFailed = false;
  }

  private get text() {
    return this.initials || avatarInitials(this.name);
  }

  private get accessibleName() {
    return this.label || this.alt || this.name || this.text;
  }

  protected render() {
    const showImage = this.src && !this._imageFailed;
    return html`<span
      class="avatar"
      role="img"
      aria-label=${this.accessibleName || nothing}
    >
      ${
        showImage
          ? html`<img
              src=${this.src}
              alt=""
              loading="lazy"
              decoding="async"
              @error=${() => (this._imageFailed = true)}
            />`
          : html`<slot name="icon">${this.text ? html`<span aria-hidden="true">${this.text}</span>` : nothing}</slot>`
      }
      ${this.status
        ? html`<span class="status" aria-hidden="true"></span>`
        : nothing}
      <slot name="badge"></slot>
    </span>`;
  }
}
