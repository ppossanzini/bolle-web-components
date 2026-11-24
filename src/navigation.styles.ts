import { css } from "lit";
export const navigationStyles = css`
  :host {
    --bb-glint-color: rgb(
      from color-mix(in srgb, var(--md-sys-color-primary) 12%, white) r g b /
        0.5
    );
  }
  :host {
    display: block;
  }
  nav,
  [role="tablist"] {
    display: flex;
    gap: var(--md-comp-action-gap);
    background: var(--md-sys-color-surface-container);
    padding: 0;
    overflow-x: auto;
  }
  nav {
    block-size: var(--md-comp-navigation-bar-height);
    padding: 0 var(--md-comp-action-gap);
  }
  .destination {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md-comp-field-gap);
    min-block-size: var(--md-comp-navigation-bar-height);
    min-inline-size: var(--md-comp-action-target);
    padding: 0 var(--md-comp-field-gap);
    text-decoration: none;
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-label-medium-font);
    letter-spacing: var(--md-sys-typescale-label-medium-tracking);
  }
  .destinations {
    display: flex;
    padding: 0;
    margin: 0;
    list-style: none;
    flex: 1;
    gap: var(--md-comp-action-gap);
  }
  .destinations li {
    display: flex;
    flex: 1;
  }
  :host([rail]) .destinations {
    flex-direction: column;
  }
  .indicator {
    display: grid;
    place-items: center;
    inline-size: var(--md-comp-navigation-indicator-width);
    block-size: var(--md-comp-navigation-indicator-height, 32px);
    border-radius: var(--md-sys-shape-corner-full);
    font-size: var(--md-comp-navigation-icon-size, 24px);
    line-height: 1;
  }
  [aria-current="page"] .indicator,
  [aria-selected="true"] .indicator {
    color: var(--md-sys-color-on-secondary-container);
    background: var(--md-sys-color-secondary-container);
  }
  [aria-current="page"] .nav-label {
    color: var(--md-sys-color-on-surface);
    font-weight: 600;
  }
  :host([rail]) {
    background: var(--md-sys-color-surface);
  }
  /* The item target area spans the full rail width, so the rail has no inline padding. */
  :host([rail]) nav {
    flex-direction: column;
    inline-size: var(--md-comp-navigation-rail-width);
    block-size: auto;
    padding: var(--md-comp-navigation-rail-top-space) 0
      var(--md-comp-navigation-rail-item-vertical-space);
    background: transparent;
  }
  :host([rail][expanded]) nav {
    inline-size: var(--md-comp-navigation-rail-expanded-width);
    padding-block-end: var(--md-comp-navigation-rail-expanded-trailing-space);
  }
  :host([rail]) .destinations {
    gap: var(--md-comp-navigation-rail-collapsed-item-gap);
  }
  :host([rail][expanded]) .destinations {
    gap: var(--md-comp-navigation-rail-expanded-item-gap, 4px);
  }
  /* A 96px la label non ci sta: senza troncamento esce dal binario e invade il contenuto. */
  :host([rail]) .destination {
    min-block-size: var(--md-comp-navigation-rail-item-height);
    padding: var(--md-comp-navigation-rail-item-block-start-space) 0
      var(--md-comp-navigation-rail-item-block-end-space);
    white-space: nowrap;
    max-inline-size: 100%;
    overflow: hidden;
  }
  :host([rail]) .item-content > span:not(.indicator) {
    display: block;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  :host([rail]) .indicator {
    inline-size: var(--md-comp-navigation-rail-indicator-width);
    block-size: var(--md-comp-navigation-rail-indicator-height);
  }
  /* Expanded rail: the active indicator is a pill that wraps icon and label. */
  :host([rail][expanded]) .destination {
    flex-direction: row;
    justify-content: start;
    padding-block: 0;
    padding-inline: var(--md-comp-navigation-rail-expanded-item-leading-space)
      var(--md-comp-navigation-rail-item-trailing-space);
  }
  :host([rail][expanded]) .item-content {
    display: flex;
    align-items: center;
    gap: var(--md-comp-navigation-rail-item-gap);
    max-inline-size: 100%;
    block-size: var(--md-comp-navigation-rail-item-height);
    padding-inline: var(--md-comp-navigation-rail-item-leading-space)
      var(--md-comp-navigation-rail-item-trailing-space);
    border-radius: var(--md-sys-shape-corner-full);
  }
  :host([rail][expanded]) .indicator {
    background: transparent;
    inline-size: auto;
    block-size: auto;
  }
  :host([rail][expanded]) .destination[aria-current="page"] .item-content {
    background-color: var(--md-sys-color-secondary-container);
  }
  :host([rail][expanded]) .destination[aria-current="page"] .indicator {
    color: var(--md-sys-color-on-secondary-container);
  }
  /* The state layer follows the pill, not the full-width target area. */
  :host([rail][expanded]) .destination:not(:disabled):hover,
  :host([rail][expanded]) .destination:active {
    background-image: none;
  }
  :host([rail][expanded]) .destination:not(:disabled):hover .item-content {
    background-image: linear-gradient(
      var(--bolle-state-hover),
      var(--bolle-state-hover)
    );
  }
  :host([rail][expanded]) .destination:active .item-content {
    background-image: linear-gradient(
      var(--bolle-state-pressed),
      var(--bolle-state-pressed)
    );
  }
  .item-content {
    display: contents;
  }
  [role="tab"] {
    flex-direction: row;
    gap: var(--md-comp-field-gap);
    font: var(--md-sys-typescale-title-small-font);
    letter-spacing: var(--md-sys-typescale-title-small-tracking);
    min-block-size: var(--md-comp-action-target);
    border-block-end: var(--md-comp-tabs-active-indicator-thickness, 3px) solid
      transparent;
    white-space: nowrap;
  }
  [role="tab"]:has(.tab-icon) {
    min-block-size: var(--md-comp-tabs-with-icon-height, 64px);
  }
  [role="tab"][aria-selected="true"] {
    border-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-primary);
  }
  :host([variant="secondary"]) [role="tab"] {
    border-block-end-width: var(
      --md-comp-tabs-secondary-active-indicator-thickness,
      2px
    );
  }
  .tab-icon {
    font-size: var(--md-comp-tabs-icon-size, 24px);
    line-height: 1;
  }
  .tab-badge {
    border-radius: var(--md-sys-shape-corner-full);
    background: var(--md-sys-color-error);
    color: var(--md-sys-color-on-error);
    padding-inline: var(--md-comp-badge-padding);
    font: var(--md-sys-typescale-label-small-font);
  }
  :host([variant="flexible"]) nav,
  :host([layout="horizontal"]) nav {
    background: transparent;
    padding: 0;
  }
  :host([variant="flexible"]) .destination,
  :host([layout="horizontal"]) .destination {
    flex-direction: row;
    justify-content: start;
    gap: var(--md-comp-field-padding);
    min-block-size: var(--md-comp-action-target);
    padding-inline: var(--md-comp-field-padding);
  }
  [role="tabpanel"] {
    padding: var(--md-comp-field-padding);
  }
  .tab-scroller {
    display: flex;
    align-items: stretch;
    background: var(--md-sys-color-surface-container);
  }
  .tab-scroller [role="tablist"] {
    flex: 1;
    min-inline-size: 0;
    scroll-behavior: smooth;
    scrollbar-width: none;
  }
  .tab-scroller [role="tablist"]::-webkit-scrollbar {
    display: none;
  }
  .tab-scroller [role="tab"] {
    flex: 0 0 auto;
  }
  .tab-scroll-button {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    inline-size: var(--md-comp-action-target);
    border: 0;
    background: var(--md-sys-color-surface-container);
    color: var(--md-sys-color-on-surface-variant);
    cursor: pointer;
  }
  .tab-scroll-button svg {
    inline-size: var(--md-comp-tabs-scroll-icon-size, 24px);
    block-size: var(--md-comp-tabs-scroll-icon-size, 24px);
  }
  .tab-scroll-button:disabled {
    opacity: var(--md-sys-state-disabled-content-opacity);
    cursor: default;
  }
  .tab-scroll-button:focus-visible {
    outline: var(--md-comp-focus-outline);
    outline-offset: calc(var(--md-comp-focus-outline-offset) * -1);
  }
`;

/* Tabs as a column: with a fixed host height the tab row stays put and only the panel scrolls. */
export const tabsLayoutStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    min-block-size: 0;
  }
  [role="tablist"],
  .tab-scroller {
    flex: none;
  }
  [role="tabpanel"] {
    flex: 1 1 auto;
    min-block-size: 0;
    overflow: auto;
  }
`;
