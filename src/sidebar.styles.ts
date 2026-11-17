import { css } from "lit";

export const sidebarStyles = css`
  :host {
    --bb-glint-color: rgb(
      from color-mix(in srgb, var(--md-sys-color-primary) 12%, white) r g b /
        0.5
    );
    --bolle-sidebar-padding: 12px;
    display: block;
    inline-size: max-content;
    block-size: 100%;
  }
  .surface {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    block-size: 100%;
    min-block-size: 0;
    border-inline-end: 1px solid var(--md-sys-color-outline-variant);
    background: var(--md-sys-color-surface-container-low);
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-body-medium-font);
  }
  :host([collapsed]) .surface {
    inline-size: var(--md-comp-navigation-rail-width);
  }
  /* Card form: card radius and elevation; rows take the card radius minus the padding. */
  :host([variant="card"]) .surface {
    --bb-inset-radius: max(
      2px,
      calc(var(--bb-radius) - var(--bolle-sidebar-padding))
    );
    border-inline-end: 0;
    border-radius: var(--bb-radius);
    box-shadow: var(--bb-float-2);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--md-comp-action-gap);
    padding: 12px var(--bolle-sidebar-padding) 8px 28px;
  }
  :host([collapsed]) .header {
    justify-content: center;
    padding-inline: 0;
  }
  .brand {
    min-inline-size: 0;
    font: var(--md-sys-typescale-title-medium-font);
    font-family: var(--md-ref-typeface-display);
  }
  .body {
    flex: 1;
    min-block-size: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 var(--bolle-sidebar-padding) 8px;
  }
  :host([collapsed]) .body {
    padding-inline: 0;
  }
  .filter {
    padding-block: 4px 12px;
  }
  .filter bolle-text-field,
  .filter bolle-search {
    inline-size: 100%;
  }
  .visually-hidden {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .icon {
    display: inline-grid;
    place-items: center;
    flex: none;
    inline-size: var(--md-sys-icon-size);
    block-size: var(--md-sys-icon-size);
    font-size: var(--md-sys-icon-size);
  }
  .icon svg {
    inline-size: 100%;
    block-size: 100%;
  }

  /* Tree: one shrinkable column, so long labels end with an ellipsis. */
  .tree,
  .branch,
  .rail {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .tree,
  .branch {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
  .branch {
    margin-block-start: 4px;
  }
  .branch[hidden] {
    display: none;
  }
  bolle-tooltip {
    display: block;
  }
  .row {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    box-sizing: border-box;
    inline-size: 100%;
    min-block-size: 40px;
    padding-inline: 16px;
    border: 0;
    border-radius: var(--bb-inset-radius, var(--md-sys-shape-corner-full));
    background: transparent;
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-label-large-font);
    letter-spacing: var(--md-sys-typescale-label-large-tracking);
    text-align: start;
    text-decoration: none;
    cursor: pointer;
  }
  .row.level-1 {
    color: var(--md-sys-color-on-surface);
  }
  /* Level 2 starts under the level-1 label: leading space, icon, gap. */
  .row.level-2 {
    padding-inline-start: calc(16px + var(--md-sys-icon-size) + 12px);
  }
  .row.level-3 {
    padding-inline-start: calc(16px + var(--md-sys-icon-size) + 28px);
    min-block-size: 36px;
    font: var(--md-sys-typescale-body-medium-font);
    letter-spacing: var(--md-sys-typescale-body-medium-tracking);
  }
  /* Guide line along the whole third-level branch, above the selected row. */
  .branch .branch {
    position: relative;
  }
  .branch .branch::before {
    content: "";
    position: absolute;
    z-index: 1;
    inset-block: 0;
    inset-inline-start: calc(16px + var(--md-sys-icon-size) + 18px);
    inline-size: 1px;
    background: var(--md-sys-color-outline-variant);
    pointer-events: none;
  }
  .row:hover,
  .rail-item:hover .indicator {
    background-image:
      linear-gradient(var(--bolle-state-hover), var(--bolle-state-hover)),
      var(--bb-hover-glint);
    background-size:
      100% 100%,
      var(--bb-glint-box) var(--bb-glint-box);
    background-position:
      0 0,
      var(--bb-glint-position);
    background-repeat: no-repeat;
  }
  /* Solid inner ring carries focus; the film ring outside it is decoration. */
  .row::after,
  .indicator::after {
    content: "";
    position: absolute;
    inset: calc(-1 * var(--bb-ring-gap));
    padding: var(--bb-ring-width);
    border-radius: inherit;
    background: var(--bb-film);
    mask:
      linear-gradient(#000 0 0) content-box exclude,
      linear-gradient(#000 0 0);
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--md-sys-motion-duration-short3);
  }
  .row:focus-visible,
  .rail-item:focus-visible .indicator {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 1px;
  }
  .row:focus-visible::after,
  .rail-item:focus-visible .indicator::after {
    opacity: 1;
  }
  .row[aria-current="page"] {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    font-weight: 600;
  }
  .row.in-current .label {
    color: var(--md-sys-color-on-surface);
    font-weight: 600;
  }
  .label {
    flex: 1;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .label mark {
    border-radius: 2px;
    background: var(--md-sys-color-tertiary-container);
    color: var(--md-sys-color-on-tertiary-container);
  }
  .count {
    flex: none;
    min-inline-size: 20px;
    padding-inline: 6px;
    border-radius: var(--md-sys-shape-corner-full);
    background: color-mix(in srgb, currentColor 12%, transparent);
    font: var(--md-sys-typescale-label-small-font);
    font-variant-numeric: tabular-nums;
    line-height: 20px;
    text-align: center;
  }
  .chevron {
    display: inline-grid;
    flex: none;
    font-size: 18px;
    transition: rotate var(--md-sys-motion-duration-short4)
      var(--md-sys-motion-easing-standard);
  }
  [aria-expanded="false"] > .chevron {
    rotate: -90deg;
  }
  :host(:dir(rtl)) [aria-expanded="false"] > .chevron {
    rotate: 90deg;
  }
  .empty {
    display: grid;
    justify-items: start;
    gap: 4px;
    padding: 16px 12px;
    color: var(--md-sys-color-on-surface-variant);
  }
  .empty p {
    margin: 0;
  }

  /* Rail: the collapsed sidebar. */
  .rail {
    display: grid;
    gap: var(--md-comp-navigation-rail-item-vertical-space-collapsed);
  }
  .rail-item {
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 4px;
    inline-size: 100%;
    min-block-size: var(--md-comp-navigation-rail-item-height);
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--md-sys-color-on-surface-variant);
    text-decoration: none;
    cursor: pointer;
  }
  .rail-item:hover,
  .rail-item:active {
    background-image: none;
  }
  .rail-item:focus-visible {
    outline: none;
  }
  .indicator {
    position: relative;
    display: grid;
    place-items: center;
    inline-size: var(--md-comp-navigation-rail-indicator-width);
    block-size: var(--md-comp-navigation-rail-indicator-height);
    border-radius: var(--md-sys-shape-corner-full);
  }
  .rail-item.active .indicator,
  .rail-item[aria-expanded="true"] .indicator {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }
  .rail-label {
    max-inline-size: calc(var(--md-comp-navigation-rail-width) - 16px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font: var(--md-sys-typescale-label-medium-font);
  }
  .rail-item.active .rail-label {
    color: var(--md-sys-color-on-surface);
    font-weight: 600;
  }
  .indicator bolle-badge {
    position: absolute;
    inset-block-start: -4px;
    inset-inline-start: calc(50% + 4px);
  }

  /* Resize grip on the inner edge, centred vertically: the bottom sheet drag
     handle turned upright, with a wider hit area. */
  .grip {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: -12px;
    z-index: 2;
    display: grid;
    place-items: center;
    inline-size: 24px;
    block-size: 56px;
    translate: 0 -50%;
    border-radius: var(--md-sys-shape-corner-full);
    cursor: col-resize;
    touch-action: none;
  }
  .grip::before {
    content: "";
    inline-size: var(--md-comp-bottom-sheet-drag-handle-height);
    block-size: var(--md-comp-bottom-sheet-drag-handle-width);
    border-radius: var(--md-sys-shape-corner-full);
    background: var(--md-sys-color-on-surface-variant);
    opacity: 0.4;
    transition: opacity var(--md-sys-motion-duration-short3);
  }
  .grip:hover::before,
  .grip:active::before,
  .grip:focus-visible::before {
    opacity: 1;
  }
  .grip:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 1px;
  }
  @media (forced-colors: active) {
    .row::after,
    .indicator::after {
      display: none;
    }
    .row[aria-current="page"] {
      outline: 2px solid Highlight;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .chevron {
      transition: none;
    }
  }
`;
