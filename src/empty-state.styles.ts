import { css } from "lit";

export const emptyStateStyles = css`
  :host {
    display: block;
    /* As a flex or grid item the state must be allowed to shrink with its container. */
    min-inline-size: 0;
    max-inline-size: 100%;
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-body-medium-font);
    text-align: center;
  }
  :host([hidden]) {
    display: none;
  }
  .state {
    display: grid;
    /* The column takes the container width: a long line must not widen the grid. */
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    align-content: center;
    gap: var(--bb-empty-state-gap, 8px);
    padding: var(--bb-empty-state-padding, 32px 16px);
    min-block-size: var(--bb-empty-state-min-height, 0);
  }
  :host([align="start"]) {
    text-align: start;
  }
  :host([align="start"]) .state {
    justify-items: start;
  }
  .icon {
    display: grid;
    place-items: center;
    inline-size: var(--bb-empty-state-icon-size, 44px);
    block-size: var(--bb-empty-state-icon-size, 44px);
    margin-block-end: 4px;
    border-radius: var(--md-sys-shape-corner-full, 9999px);
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface-variant);
    font-size: calc(var(--bb-empty-state-icon-size, 44px) * 0.5);
  }
  .icon svg {
    inline-size: 55%;
    block-size: 55%;
  }
  :host([tone="error"]) .icon {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
  }
  :host([tone="error"]) {
    color: var(--md-sys-color-on-surface-variant);
  }
  ::slotted([slot="icon"]) {
    font-size: calc(var(--bb-empty-state-icon-size, 44px) * 0.5);
  }
  .title {
    margin: 0;
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-title-medium-font);
  }
  :host([tone="error"]) .title {
    color: var(--md-sys-color-on-surface);
  }
  .text {
    margin: 0;
    min-inline-size: 0;
    max-inline-size: var(--bb-empty-state-text-width, 56ch);
    text-wrap: pretty;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px 8px;
    min-inline-size: 0;
    margin-block-start: 8px;
  }
  :host([align="start"]) .actions {
    justify-content: flex-start;
  }
  .actions:not(:has(*)) {
    display: none;
  }
`;
