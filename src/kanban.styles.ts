import { css } from "lit";

export const kanbanStyles = css`
  :host {
    display: block;
    /* The board fills the host: the application gives the host its height. */
    block-size: 100%;
    min-block-size: 0;
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-body-medium-font);
  }
  :host([hidden]) {
    display: none;
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
  .board {
    display: flex;
    flex-direction: column;
    block-size: 100%;
    min-block-size: 0;
    overflow: auto;
    /* The gutters stay reserved: toggling them re-triggers the overflow and loops the layout. */
    scrollbar-gutter: stable;
    padding: var(--bb-kanban-padding, 0);
  }
  .lane {
    display: flex;
    flex-direction: column;
    gap: var(--bb-kanban-lane-gap, 8px);
    min-block-size: 0;
    margin-block-end: var(--bb-kanban-lane-gap, 8px);
  }
  /* A single strip fills the board; stacked lanes grow with their own content. */
  :host(:not([lanes])) .lane {
    flex: 1 1 auto;
    margin-block-end: 0;
  }
  :host([lanes]) .lane {
    flex: 0 0 auto;
  }
  .lane-head {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .lane-head h2 {
    margin: 0;
    font: var(--md-sys-typescale-title-small-font);
  }
  .columns {
    display: flex;
    flex: 1 1 auto;
    gap: var(--bb-kanban-column-gap, 16px);
    align-items: stretch;
    min-block-size: var(--bb-kanban-column-min-height, 200px);
    overflow-x: auto;
    overflow-y: hidden;
    padding-block-end: 2px;
  }
  :host([lanes]) .columns {
    flex: 0 0 auto;
    min-block-size: 0;
    overflow-y: clip;
  }
  .column {
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
    min-inline-size: var(--bb-kanban-column-min-width, 260px);
    max-inline-size: var(--bb-kanban-column-max-width, 360px);
    min-block-size: 0;
    padding: 8px;
    border-radius: var(--bb-kanban-column-radius, 20px 20px 20px 6px);
    background: var(--bb-kanban-column-surface, var(--md-sys-color-surface-container-low));
    border: 1px solid transparent;
    transition:
      border-color var(--md-sys-motion-duration-short3, 150ms),
      background var(--md-sys-motion-duration-short3, 150ms);
  }
  .column.over {
    border-color: var(--md-sys-color-primary);
    background: color-mix(
      in srgb,
      var(--md-sys-color-primary) 6%,
      var(--bb-kanban-column-surface, var(--md-sys-color-surface-container-low))
    );
  }
  .column.refused {
    border-color: var(--md-sys-color-error);
    background: color-mix(
      in srgb,
      var(--md-sys-color-error) 6%,
      var(--bb-kanban-column-surface, var(--md-sys-color-surface-container-low))
    );
  }
  .column.collapsed {
    flex: 0 0 auto;
    min-inline-size: 0;
    padding: 0;
  }
  .column-head {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 4px 8px 10px;
  }
  .column-head h2 {
    margin: 0;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font: var(--md-sys-typescale-title-small-font);
  }
  .column-head .count,
  .column-head bolle-icon-button {
    flex: none;
  }
  .count {
    padding: 1px 8px;
    white-space: nowrap;
    border-radius: 10px;
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-label-small-font);
    font-variant-numeric: tabular-nums;
  }
  .count.over {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
  }
  .spacer {
    flex: 1 1 auto;
  }
  .collapse-strip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    inline-size: 100%;
    block-size: 100%;
    min-block-size: 160px;
    padding: 16px 10px;
    border: 0;
    border-radius: var(--bb-kanban-column-radius, 20px 20px 20px 6px);
    background: var(--bb-kanban-column-surface, var(--md-sys-color-surface-container-low));
    color: inherit;
    font: var(--md-sys-typescale-title-small-font);
    cursor: pointer;
  }
  .collapse-strip .label {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
  .list {
    display: grid;
    /* The implicit auto track can be wider than the box once the scrollbar appears. */
    grid-template-columns: minmax(0, 1fr);
    flex: 1 1 auto;
    align-content: start;
    gap: var(--bb-kanban-card-gap, 8px);
    margin: 0;
    padding: 0 4px 4px 0;
    list-style: none;
    min-block-size: 24px;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
  }
  .card {
    --md-comp-card-padding: var(--bb-kanban-card-padding, 12px);
    --bb-card-radius: var(--bb-kanban-card-radius, 18px);
    display: block;
    padding: 0;
    border-radius: var(--bb-card-radius);
    cursor: pointer;
  }
  :host([density="compact"]) .card {
    --bb-kanban-card-padding: 9px;
    --bb-kanban-card-radius: 14px;
    --bb-kanban-card-gap: 6px;
  }
  /* Hover is a state layer on the surface; the lift belongs to the dragged copy. */
  .card:hover,
  .card.force-hover {
    --md-sys-color-surface: var(--md-sys-color-surface-container);
  }
  .card:focus-within {
    --md-sys-color-surface: var(--md-sys-color-surface-container);
  }
  .card.selected {
    box-shadow: inset 0 0 0 2px var(--md-sys-color-primary);
  }
  .card.dragging,
  .card.dragging:hover {
    --md-sys-color-surface: var(--md-sys-color-surface);
    opacity: 0.35;
  }
  .card-head {
    display: flex;
    align-items: center;
    gap: 6px;
    min-block-size: 22px;
  }
  .grip {
    display: inline-grid;
    place-items: center;
    inline-size: 22px;
    block-size: 22px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--md-sys-color-outline);
    cursor: grab;
    opacity: 0.45;
    touch-action: none;
    transition: opacity var(--md-sys-motion-duration-short3, 150ms);
  }
  .grip:focus-visible {
    opacity: 1;
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 1px;
  }
  .card:hover .grip,
  .card:focus-within .grip {
    opacity: 1;
  }
  .grip svg,
  .grip sl-icon {
    inline-size: 16px;
    block-size: 16px;
  }
  .card-title {
    margin: 0;
    font: var(--md-sys-typescale-title-small-font);
    overflow-wrap: anywhere;
  }
  .card-subtitle {
    margin: 2px 0 0;
    font: var(--md-sys-typescale-body-small-font);
    color: var(--md-sys-color-on-surface-variant);
  }
  .card-body:empty {
    display: none;
  }
  .empty-column {
    margin: 8px 6px;
    font: var(--md-sys-typescale-body-small-font);
    color: var(--md-sys-color-on-surface-variant);
  }
  .composer {
    margin-block-start: 8px;
    padding: 8px;
    border-radius: var(--bb-kanban-card-radius, 18px);
    background: var(--md-sys-color-surface-container-lowest);
    border: 1px solid var(--md-sys-color-outline-variant);
  }
  .composer-actions {
    display: flex;
    justify-content: flex-end;
    margin-block-start: 4px;
  }
  /* Drag and drop ---------------------------------------------------------- */
  .ghost-drop {
    position: fixed;
    z-index: 40;
    pointer-events: none;
  }
  .ghost {
    --md-comp-card-padding: var(--bb-kanban-card-padding, 12px);
    --bb-card-radius: var(--bb-kanban-card-radius, 18px);
    display: block;
    border-radius: var(--bb-card-radius);
    box-shadow: var(--bb-float-4, var(--md-sys-elevation-level3));
    rotate: -1.2deg;
    transition: box-shadow var(--md-sys-motion-duration-short3, 150ms);
  }
  .ghost.refused {
    box-shadow:
      0 0 0 2px var(--md-sys-color-error),
      var(--bb-float-4, var(--md-sys-elevation-level3));
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
  .placeholder {
    border-radius: var(--bb-kanban-card-radius, 18px);
    border: 2px dashed var(--md-sys-color-primary);
    background: color-mix(in srgb, var(--md-sys-color-primary) 7%, transparent);
  }
  .placeholder.refused {
    border-color: var(--md-sys-color-error);
    background: color-mix(in srgb, var(--md-sys-color-error) 7%, transparent);
  }
  /* States ----------------------------------------------------------------- */
  .state {
    display: grid;
    justify-items: center;
    gap: 8px;
    margin: auto;
    padding: 72px 16px;
    text-align: center;
    color: var(--md-sys-color-on-surface-variant);
  }
  .state p {
    margin: 0;
  }
  .state-icon {
    display: grid;
    place-items: center;
    inline-size: 40px;
    block-size: 40px;
    font-size: 24px;
    color: var(--md-sys-color-outline);
  }
  .state-icon.error {
    color: var(--md-sys-color-error);
  }
  /* Bolle scrollbars: no arrow buttons, round track and thumb. */
  .board::-webkit-scrollbar,
  .columns::-webkit-scrollbar,
  .list::-webkit-scrollbar {
    inline-size: 10px;
    block-size: 10px;
    background: transparent;
  }
  .board::-webkit-scrollbar-button,
  .columns::-webkit-scrollbar-button,
  .list::-webkit-scrollbar-button {
    display: none;
    inline-size: 0;
    block-size: 0;
  }
  .board::-webkit-scrollbar-track,
  .columns::-webkit-scrollbar-track,
  .list::-webkit-scrollbar-track {
    margin: 4px;
    border-radius: 9999px;
    background: transparent;
  }
  .board::-webkit-scrollbar-thumb,
  .columns::-webkit-scrollbar-thumb,
  .list::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--md-sys-color-on-surface) 26%, transparent)
      padding-box;
  }
`;
