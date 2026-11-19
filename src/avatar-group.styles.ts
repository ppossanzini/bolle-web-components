import { css } from "lit";

export const avatarGroupStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    --bb-avatar-group-overlap: 0.2;
    /* The overflow bubble and the avatars share one size, medium unless set. */
    --bb-avatar-group-size: var(--md-comp-avatar-medium-size, 40px);
  }
  :host([hidden]) {
    display: none;
  }
  .group {
    display: inline-flex;
    align-items: center;
    /* Children overlap by a share of the avatar size the group is given. */
    padding-inline-start: 0;
  }
  ::slotted(bolle-avatar:not(:first-child)) {
    margin-inline-start: calc(
      var(--bb-avatar-group-size) * var(--bb-avatar-group-overlap) * -1
    );
  }
  /* Every avatar keeps a ring of the surface it sits on, so the overlap reads. */
  ::slotted(bolle-avatar) {
    --bb-avatar-ring: var(--bb-avatar-group-ring, var(--md-sys-color-surface));
    --bb-avatar-ring-width: 2px;
    position: relative;
  }
  ::slotted(bolle-avatar:not(:first-child)) {
    /* The one on top covers the ring of the one it overlaps, never the reverse. */
    z-index: 0;
  }
  ::slotted(bolle-avatar[hidden]) {
    display: none;
  }
  .more {
    display: inline-grid;
    place-items: center;
    inline-size: var(--bb-avatar-group-size);
    block-size: var(--bb-avatar-group-size);
    min-inline-size: 0;
    margin-inline-start: calc(
      var(--bb-avatar-group-size) * var(--bb-avatar-group-overlap) * -1
    );
    padding: 0 4px;
    border: 0;
    border-radius: var(--md-sys-shape-corner-full, 9999px);
    box-shadow: 0 0 0 2px var(--bb-avatar-group-ring, var(--md-sys-color-surface));
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-label-medium-font);
    font-variant-numeric: tabular-nums;
    cursor: default;
    position: relative;
  }
  :host([interactive]) .more:not([disabled]) {
    cursor: pointer;
  }
  :host([interactive]) .more:not([disabled]):hover {
    background: var(--md-sys-color-surface-container-highest);
    color: var(--md-sys-color-on-surface);
  }
  .more:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }
  :host([size="xs"]) {
    --bb-avatar-group-size: var(--md-comp-avatar-xs-size, 24px);
  }
  :host([size="small"]) {
    --bb-avatar-group-size: var(--md-comp-avatar-small-size, 32px);
  }
  :host([size="large"]) {
    --bb-avatar-group-size: var(--md-comp-avatar-large-size, 56px);
  }
  :host([size="xl"]) {
    --bb-avatar-group-size: var(--md-comp-avatar-xl-size, 80px);
  }
  /* The ring is painted with the pseudo element, which a hidden child must not keep. */
  :host([size]) ::slotted(bolle-avatar) {
    --bb-avatar-size: var(--bb-avatar-group-size);
  }
`;
