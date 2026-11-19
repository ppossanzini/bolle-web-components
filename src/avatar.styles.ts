import { css } from "lit";

export const avatarStyles = css`
  :host {
    display: inline-block;
    flex: none;
    vertical-align: middle;
    /* A ring of the surface behind lets the avatar sit on an overlap without a seam. */
    box-shadow: 0 0 0 var(--bb-avatar-ring-width, 0) var(--bb-avatar-ring, transparent);
    border-radius: var(--md-sys-shape-corner-full, 9999px);
    --bb-avatar-size: var(--md-comp-avatar-medium-size, 40px);
  }
  :host([shape="rounded"]) {
    border-radius: var(--bb-avatar-radius, var(--md-sys-shape-corner-medium, 12px));
  }
  :host([shape="square"]) {
    border-radius: var(--md-sys-shape-corner-none, 0);
  }
  :host([size="xs"]) {
    --bb-avatar-size: var(--md-comp-avatar-xs-size, 24px);
  }
  :host([size="small"]) {
    --bb-avatar-size: var(--md-comp-avatar-small-size, 32px);
  }
  :host([size="large"]) {
    --bb-avatar-size: var(--md-comp-avatar-large-size, 56px);
  }
  :host([size="xl"]) {
    --bb-avatar-size: var(--md-comp-avatar-xl-size, 80px);
  }
  :host([hidden]) {
    display: none;
  }
  .avatar {
    position: relative;
    display: grid;
    place-items: center;
    inline-size: var(--bb-avatar-size);
    block-size: var(--bb-avatar-size);
    overflow: hidden;
    border-radius: var(--md-sys-shape-corner-full, 9999px);
    background: var(--bb-avatar-surface, var(--md-sys-color-tertiary-container));
    color: var(--bb-avatar-on-surface, var(--md-sys-color-on-tertiary-container));
    font: var(--md-sys-typescale-label-large-font);
    font-weight: 600;
    letter-spacing: 0.02em;
    line-height: 1;
    text-transform: uppercase;
    /* Initials never mirror: the letter stays the same in a right-to-left layout. */
    direction: ltr;
    unicode-bidi: isolate;
  }
  :host([size="xs"]) .avatar {
    font: var(--md-sys-typescale-label-small-font);
    font-weight: 600;
  }
  :host([size="large"]) .avatar,
  :host([size="xl"]) .avatar {
    font: var(--md-sys-typescale-title-medium-font);
    font-weight: 600;
  }
  :host([color="primary"]) .avatar {
    background: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
  }
  :host([color="secondary"]) .avatar {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }
  :host([color="surface"]) .avatar {
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface-variant);
  }
  :host([shape="rounded"]) .avatar {
    border-radius: var(--bb-avatar-radius, var(--md-sys-shape-corner-medium, 12px));
  }
  :host([shape="square"]) .avatar {
    border-radius: var(--md-sys-shape-corner-none, 0);
  }
  img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    display: block;
  }
  .icon,
  ::slotted([slot="icon"]) {
    display: grid;
    place-items: center;
    inline-size: 60%;
    block-size: 60%;
    font-size: calc(var(--bb-avatar-size) * 0.6);
  }
  .icon svg,
  ::slotted([slot="icon"]) svg {
    inline-size: 100%;
    block-size: 100%;
  }
  /* The status dot reads on the container colour, so it carries a ring of it. */
  .status {
    position: absolute;
    inset-block-end: 0;
    inset-inline-end: 0;
    inline-size: 30%;
    block-size: 30%;
    max-inline-size: 14px;
    max-block-size: 14px;
    min-inline-size: 8px;
    min-block-size: 8px;
    border-radius: 50%;
    box-shadow: 0 0 0 2px var(--bb-avatar-ring, var(--md-sys-color-surface));
  }
  :host([status="online"]) .status {
    background: var(--md-sys-color-primary);
  }
  :host([status="busy"]) .status {
    background: var(--md-sys-color-error);
  }
  :host([status="away"]) .status {
    background: var(--md-sys-color-tertiary);
  }
  :host([status="offline"]) .status {
    background: var(--md-sys-color-outline);
  }
`;
