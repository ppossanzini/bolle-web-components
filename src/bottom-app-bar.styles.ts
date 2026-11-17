import { css } from "lit";

export const bottomAppBarStyles = css`
  :host {
    display: block;
    inline-size: 100%;
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-body-medium-font);
  }
  :host([hidden]) {
    display: none;
  }
  :host([sticky]) {
    position: sticky;
    inset-block-end: 0;
    z-index: 3;
  }
  .bar {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--md-comp-action-gap, 8px);
    box-sizing: border-box;
    min-block-size: var(--md-comp-bottom-app-bar-height, 80px);
    padding-inline: var(--md-comp-field-padding, 16px);
    background: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface);
  }
  /* The bar sits on the bottom edge of the window: only its top edge carries a line. */
  :host([divider]) .bar {
    border-block-start: 1px solid var(--md-sys-color-outline-variant);
  }
  /* Floating form: a detached surface with the bar radius, inset from the edges. */
  :host([variant="floating"]) {
    padding: 0 var(--md-comp-bottom-app-bar-inset, 16px)
      var(--md-comp-bottom-app-bar-inset, 16px);
  }
  :host([variant="floating"]) .bar {
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: var(--md-sys-shape-corner-large, 16px)
      var(--md-sys-shape-corner-large, 16px)
      var(--md-sys-shape-corner-large, 16px)
      var(--md-sys-shape-corner-small, 8px);
    box-shadow: var(--bb-float-2, var(--md-sys-elevation-level2));
  }
  .actions {
    display: flex;
    align-items: center;
    gap: var(--md-comp-action-gap, 8px);
    min-inline-size: 0;
    flex: 0 1 auto;
  }
  :host([align="center"]) .actions {
    margin-inline: auto;
  }
  .leading,
  .trailing {
    display: inline-flex;
    align-items: center;
    gap: var(--md-comp-action-gap, 8px);
    flex: none;
  }
  .trailing {
    /* The end slot keeps the FAB on the edge the screen reads as the far side. */
    margin-inline-start: auto;
  }
  /* An empty trailing slot still absorbs the space, so the FAB lands on the edge. */
  .trailing:empty {
    margin-inline: auto 0;
  }
  /* Docked FAB: the button hangs over the top edge, its ring is the bar surface. */
  .fab {
    flex: none;
    margin-inline-start: 8px;
  }
  :host([dock]) .fab {
    /* Centred in the 80px bar, then lifted so half of the button hangs above it. */
    margin-block-start: calc(var(--md-comp-fab-height, 56px) / -2);
    margin-inline-end: 4px;
  }
  :host([dock]) .bar {
    overflow: visible;
  }
  ::slotted([slot="fab"]) {
    --bb-fab-ring: var(--md-sys-color-surface-container);
  }
`;
