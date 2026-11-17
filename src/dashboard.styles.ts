import { css } from "lit";

export const dashboardStyles = css`
  :host {
    display: block;
    min-inline-size: 0;
  }
  .sr-only {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(var(--dashboard-columns, 12), minmax(0, 1fr));
    gap: 16px;
    align-items: start;
  }
  .density-compact .dashboard-grid {
    gap: 12px;
  }

  /* Tile --------------------------------------------------------------- */
  .tile {
    position: relative;
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
    border-radius: var(--bb-radius) var(--bb-radius) var(--bb-radius) var(--bb-tail);
    background: var(--md-sys-color-surface-container-lowest);
    border: 1px solid var(--md-sys-color-outline-variant);
    box-shadow: var(--bb-float-1);
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-body-medium-font);
    transition: background var(--md-sys-motion-duration-short3, 150ms);
  }
  /* Hover is a state layer on the surface; the lift belongs to the tile that moves. */
  :host(:hover) .tile {
    background: var(--md-sys-color-surface-container-low);
  }
  .tile.dragging,
  :host(:hover) .tile.dragging {
    background: var(--md-sys-color-surface-container-lowest);
    opacity: 0.35;
  }
  .tile-head {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 14px 12px 8px 6px;
  }
  .density-compact .tile-head {
    padding-block: 10px 6px;
  }
  .tile-grip {
    display: inline-grid;
    place-items: center;
    inline-size: 26px;
    block-size: 28px;
    flex: none;
    padding: 0;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--md-sys-color-outline);
    cursor: grab;
    opacity: 0;
    touch-action: none;
    transition: opacity 120ms;
  }
  .tile-grip svg {
    inline-size: 18px;
    block-size: 18px;
  }
  :host(:hover) .tile-grip,
  :host(:focus-within) .tile-grip {
    opacity: 1;
  }
  .tile-grip:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: -2px;
    opacity: 1;
  }
  .tile-icon {
    display: inline-grid;
    place-items: center;
    inline-size: 32px;
    block-size: 32px;
    flex: none;
    border-radius: 12px 12px 12px 4px;
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface-variant);
  }
  .tile-icon svg {
    inline-size: 18px;
    block-size: 18px;
  }
  .tile-titles {
    flex: 1;
    min-inline-size: 0;
  }
  .tile-titles h3 {
    margin: 0;
    font: var(--md-sys-typescale-title-small-font);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tile-titles p {
    margin: 2px 0 0;
    font: var(--md-sys-typescale-body-small-font);
    color: var(--md-sys-color-on-surface-variant);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tile-actions {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    flex: none;
  }
  .tile-body {
    flex: 1;
    min-block-size: 0;
    padding: 4px 18px 18px;
  }
  .density-compact .tile-body {
    padding: 2px 14px 12px;
  }
  .tile-resize {
    position: absolute;
    inset-block-end: 2px;
    inset-inline-end: 2px;
    inline-size: 20px;
    block-size: 20px;
    cursor: nwse-resize;
    opacity: 0;
    touch-action: none;
    transition: opacity 120ms;
  }
  :host(:dir(rtl)) .tile-resize {
    cursor: nesw-resize;
  }
  .tile-resize::before {
    content: "";
    position: absolute;
    inset-inline-end: 4px;
    inset-block-end: 4px;
    inline-size: 8px;
    block-size: 8px;
    border-inline-end: 2px solid var(--md-sys-color-outline);
    border-block-end: 2px solid var(--md-sys-color-outline);
    border-end-end-radius: 2px;
  }
  :host(:hover) .tile-resize,
  .tile-resize:focus-visible {
    opacity: 1;
    outline: none;
  }
  .tile-resize:focus-visible {
    box-shadow: 0 0 0 2px var(--md-sys-color-primary);
    border-radius: 4px;
  }

  /* Drag and drop ------------------------------------------------------ */
  /* The gap the tile will occupy, drawn where the grid will put it. */
  ::slotted(.bb-dashboard-placeholder) {
    border-radius: var(--bb-radius) var(--bb-radius) var(--bb-radius) var(--bb-tail);
    border: 2px dashed var(--md-sys-color-primary);
    background: color-mix(in srgb, var(--md-sys-color-primary) 7%, transparent);
  }
  ::slotted(.bb-dashboard-placeholder.refused) {
    border-color: var(--md-sys-color-error);
    background: color-mix(in srgb, var(--md-sys-color-error) 7%, transparent);
  }
  .ghost-drop {
    position: fixed;
    z-index: 40;
    pointer-events: none;
  }
  .ghost {
    padding: 14px 12px 8px 6px;
    border-radius: var(--bb-radius) var(--bb-radius) var(--bb-radius) var(--bb-tail);
    background: var(--md-sys-color-surface-container-lowest);
    border: 1px solid var(--md-sys-color-outline-variant);
    box-shadow: var(--bb-float-4);
    rotate: -0.4deg;
    transition: box-shadow var(--md-sys-motion-duration-short3, 150ms);
  }
  .ghost.refused {
    box-shadow:
      0 0 0 2px var(--md-sys-color-error),
      var(--bb-float-4);
  }
  .ghost h4 {
    margin: 0;
    font: var(--md-sys-typescale-title-small-font);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ghost p {
    margin: 2px 0 0;
    font: var(--md-sys-typescale-body-small-font);
    color: var(--md-sys-color-on-surface-variant);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ghost-note {
    inline-size: max-content;
    max-inline-size: min(300px, 80vw);
    margin: 6px 0 0;
    padding: 4px 10px;
    border-radius: 10px;
    background: var(--md-sys-color-inverse-surface);
    color: var(--md-sys-color-inverse-on-surface);
    font: var(--md-sys-typescale-label-small-font);
  }
  .ghost.refused + .ghost-note {
    background: var(--md-sys-color-error);
    color: var(--md-sys-color-on-error);
  }
`;
