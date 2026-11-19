import { css } from "lit";

/**
 * Layout of the planning surface. The grid column is sticky, the timeline scrolls
 * behind it and the rows are placed by index inside one tall container.
 */
export const ganttStyles = css`
  :host {
    display: block;
    block-size: 100%;
    min-block-size: 320px;
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-body-medium-font);
    --row-h: 40px;
    --day-w: 34px;
    --grid-w: 640px;
    --head-h: 56px;
  }
  :host([density="compact"]) {
    --row-h: 30px;
  }
  :host([hidden]) {
    display: none;
  }
  .gantt {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    block-size: 100%;
    min-block-size: 0;
    overflow: hidden;
  }

  /* Toolbar -------------------------------------------------------------- */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    padding-block-end: 10px;
  }
  .toolbar .spacer {
    flex: 1 1 auto;
  }

  /* Chart ---------------------------------------------------------------- */
  .frame {
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    min-block-size: 0;
    border-radius: 20px 20px 20px 6px;
    border: 1px solid var(--md-sys-color-outline-variant);
    overflow: hidden;
  }
  .chart {
    position: relative;
    display: block;
    overflow: auto;
    background: var(--md-sys-color-surface-container-lowest);
    /* Reserved gutter: the window reads the scroll position on every move. */
    scrollbar-gutter: stable;
    overscroll-behavior: contain;
  }
  .inner {
    position: relative;
    inline-size: calc(var(--grid-w) + var(--timeline-w));
    min-block-size: 100%;
  }

  /* Header --------------------------------------------------------------- */
  .head {
    position: sticky;
    inset-block-start: 0;
    z-index: 5;
    display: flex;
    background: var(--md-sys-color-surface-container);
    border-block-end: 1px solid var(--md-sys-color-outline-variant);
  }
  .corner {
    position: sticky;
    inset-inline-start: 0;
    z-index: 6;
    inline-size: var(--grid-w);
    flex: none;
    display: grid;
    grid-template-columns: var(--columns);
    align-items: stretch;
    background: var(--md-sys-color-surface-container);
    border-inline-end: 1px solid var(--md-sys-color-outline-variant);
  }
  .col-head {
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
    min-inline-size: 0;
    padding-inline: 8px;
    block-size: 28px;
    font: var(--md-sys-typescale-label-small-font);
    color: var(--md-sys-color-on-surface-variant);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    overflow: hidden;
    white-space: nowrap;
  }
  .col-head .grip {
    position: absolute;
    inset-block: 0;
    inset-inline-end: -3px;
    inline-size: 7px;
    cursor: col-resize;
    touch-action: none;
  }
  .col-head .grip::after {
    content: "";
    position: absolute;
    inset-block: 6px;
    inset-inline-start: 3px;
    inline-size: 1px;
    background: var(--md-sys-color-outline-variant);
  }
  .head-time {
    position: relative;
    flex: none;
    inline-size: var(--timeline-w);
  }
  .head-row {
    position: relative;
    block-size: 28px;
    border-block-end: 1px solid var(--md-sys-color-outline-variant);
  }
  .head-row:last-child {
    border-block-end: 0;
  }
  .tick {
    position: absolute;
    inset-block: 0;
    display: flex;
    align-items: center;
    padding-inline: 6px;
    overflow: hidden;
    white-space: nowrap;
    font: var(--md-sys-typescale-label-small-font);
    color: var(--md-sys-color-on-surface-variant);
    border-inline-start: 1px solid var(--md-sys-color-outline-variant);
    box-sizing: border-box;
  }
  .head-row.primary .tick {
    font: var(--md-sys-typescale-label-medium-font);
    color: var(--md-sys-color-on-surface);
    font-weight: 600;
    text-transform: capitalize;
  }

  /* Rows ----------------------------------------------------------------- */
  .rows {
    position: relative;
  }
  /* Rows are placed by index: the window keeps only the visible slice in the DOM. */
  .row {
    position: absolute;
    inset-inline: 0;
    display: flex;
    block-size: var(--row-h);
    border-block-end: 1px solid
      color-mix(in srgb, var(--md-sys-color-outline-variant) 60%, transparent);
  }
  .row:hover .cell,
  .row:hover .track {
    background-color: color-mix(
      in srgb,
      var(--md-sys-color-primary) 4%,
      transparent
    );
  }
  .row.selected .cell,
  .row.selected .track {
    background-color: color-mix(
      in srgb,
      var(--md-sys-color-primary) 10%,
      transparent
    );
  }
  .cell {
    position: sticky;
    inset-inline-start: 0;
    z-index: 3;
    inline-size: var(--grid-w);
    flex: none;
    display: grid;
    grid-template-columns: var(--columns);
    align-items: center;
    background: var(--md-sys-color-surface-container-lowest);
    border-inline-end: 1px solid var(--md-sys-color-outline-variant);
  }
  .cell > div {
    min-inline-size: 0;
    padding-inline: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font: var(--md-sys-typescale-body-small-font);
  }
  .cell .name {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .cell .name .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cell .name .count {
    color: var(--md-sys-color-on-surface-variant);
  }
  .toggle {
    display: inline-grid;
    place-items: center;
    inline-size: 20px;
    block-size: 20px;
    flex: none;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: var(--md-sys-color-outline);
    cursor: pointer;
  }
  .toggle:hover {
    background: color-mix(in srgb, currentColor 12%, transparent);
  }
  .toggle:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 1px;
  }
  .toggle .icon {
    inline-size: 16px;
    block-size: 16px;
    transition: rotate var(--md-sys-motion-duration-short3);
  }
  .row.collapsed .toggle .icon {
    rotate: -90deg;
  }
  .row.summary .cell .name {
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
  }
  .row.group .cell {
    background: var(--md-sys-color-surface-container);
  }
  .row.group .cell .name {
    font-weight: 600;
    color: var(--md-sys-color-on-surface);
  }
  .track {
    position: relative;
    flex: none;
    inline-size: var(--timeline-w);
    /* Weekend shading: the timeline starts on a Monday, at the inline-start edge. */
    background-image: repeating-linear-gradient(
      var(--gradient-side, to right),
      transparent 0 calc(var(--day-w) * 5),
      color-mix(in srgb, var(--md-sys-color-on-surface) 5%, transparent)
        calc(var(--day-w) * 5) calc(var(--day-w) * 7)
    );
  }
  .row.group .track {
    background-color: var(--md-sys-color-surface-container);
  }
  .today {
    position: absolute;
    inset-block-start: var(--head-h);
    inset-block-end: 0;
    inline-size: 2px;
    background: var(--md-sys-color-error);
    z-index: 1;
    pointer-events: none;
  }
  .today::before {
    content: "";
    position: absolute;
    inset-block-start: -5px;
    inset-inline-start: -3px;
    inline-size: 8px;
    block-size: 8px;
    border-radius: 50%;
    background: var(--md-sys-color-error);
  }

  /* Bars ----------------------------------------------------------------- */
  .bar {
    position: absolute;
    inset-block-start: 8px;
    block-size: calc(var(--row-h) - 18px);
    min-block-size: 12px;
    border-radius: 6px;
    background: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
    cursor: grab;
    touch-action: none;
    display: flex;
    align-items: center;
    box-shadow: inset 0 0 0 1px
      color-mix(in srgb, var(--md-sys-color-primary) 40%, transparent);
    overflow: hidden;
  }
  :host([density="compact"]) .bar {
    inset-block-start: 6px;
    block-size: calc(var(--row-h) - 13px);
  }
  .bar .fill {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    background: var(--md-sys-color-primary);
    opacity: 0.85;
    pointer-events: none;
  }
  .bar .bar-label {
    position: relative;
    padding-inline: 6px;
    font: var(--md-sys-typescale-label-small-font);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
    color: var(--md-sys-color-on-primary-container);
  }
  .bar.dragging {
    opacity: 0.85;
    cursor: grabbing;
    box-shadow: var(--bb-float-2);
    z-index: 4;
  }
  .bar.refused {
    box-shadow: 0 0 0 2px var(--md-sys-color-error);
  }
  .bar:focus-visible,
  .milestone:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }
  .bar.summary-bar {
    inset-block-start: calc(var(--row-h) / 2 - 5px);
    block-size: 10px;
    border-radius: 2px;
    /* A softer tone than on-surface: white reads as an alert in the dark theme. */
    background: var(--md-sys-color-on-surface-variant);
    box-shadow: none;
    cursor: default;
    overflow: visible;
  }
  .bar.summary-bar .fill {
    background: var(--md-sys-color-on-surface);
    opacity: 1;
  }
  .bar.summary-bar::before,
  .bar.summary-bar::after {
    content: "";
    position: absolute;
    inset-block: -4px;
    inline-size: 2px;
    background: var(--md-sys-color-on-surface-variant);
  }
  .bar.summary-bar::before {
    inset-inline-start: 0;
  }
  .bar.summary-bar::after {
    inset-inline-end: 0;
  }
  .milestone {
    position: absolute;
    inset-block-start: 50%;
    inline-size: 14px;
    block-size: 14px;
    translate: -50% -50%;
    rotate: 45deg;
    border-radius: 2px;
    background: var(--md-sys-color-tertiary);
    cursor: grab;
    touch-action: none;
  }
  .milestone[data-refused="true"] {
    box-shadow: 0 0 0 2px var(--md-sys-color-error);
  }
  .baseline {
    position: absolute;
    inset-block-end: 3px;
    block-size: 3px;
    border-radius: 2px;
    background: color-mix(
      in srgb,
      var(--md-sys-color-outline) 70%,
      transparent
    );
    pointer-events: none;
  }
  .handle {
    position: absolute;
    inset-block: 0;
    inline-size: 8px;
    cursor: ew-resize;
    touch-action: none;
  }
  .handle.start {
    inset-inline-start: 0;
  }
  .handle.end {
    inset-inline-end: 0;
  }
  .bar:hover .handle::after,
  .bar.dragging .handle::after {
    content: "";
    position: absolute;
    inset-block: 30%;
    inset-inline-start: 3px;
    inline-size: 2px;
    border-radius: 1px;
    background: currentColor;
    opacity: 0.6;
  }
  /* The connector sits outside the bar: no clipping, no fight with the resize handle. */
  .link {
    position: absolute;
    inset-block-start: 50%;
    inline-size: 10px;
    block-size: 10px;
    translate: 0 -50%;
    border-radius: 50%;
    border: 2px solid var(--md-sys-color-primary);
    background: var(--md-sys-color-surface-container-lowest);
    cursor: crosshair;
    opacity: 0;
    touch-action: none;
    z-index: 3;
  }
  .row:hover .link,
  .link:focus-visible {
    opacity: 1;
  }
  .link:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 2px;
  }

  /* Dependencies --------------------------------------------------------- */
  .deps {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: var(--grid-w);
    z-index: 2;
    pointer-events: none;
    overflow: visible;
  }
  .deps path {
    fill: none;
    stroke: var(--md-sys-color-outline);
    stroke-width: 1.5;
  }
  .deps path.hot {
    stroke: var(--md-sys-color-error);
    stroke-width: 2;
  }
  .deps .arrow {
    fill: var(--md-sys-color-outline);
  }

  /* Right-to-left: the timeline starts at the right edge and the layer of
     dependencies draws physical coordinates, so that layer is mirrored. */
  .gantt:dir(rtl) .deps {
    transform: scaleX(-1);
  }
  .gantt:dir(rtl) .track {
    --gradient-side: to left;
  }
  .gantt:dir(rtl) .milestone {
    translate: 50% -50%;
  }
  .gantt:dir(rtl) .row.collapsed .toggle .icon {
    rotate: 90deg;
  }

  /* Load strip ----------------------------------------------------------- */
  .load-cells {
    position: relative;
    flex: none;
    inline-size: var(--timeline-w);
    block-size: 100%;
    display: flex;
  }
  .load-cell {
    block-size: 100%;
    flex: none;
    border-inline-end: 1px solid
      color-mix(in srgb, var(--md-sys-color-outline-variant) 40%, transparent);
  }
  .load-cell[data-level="over"] {
    background: var(--md-sys-color-error-container);
  }
  .load-cell[data-level="full"] {
    background: color-mix(
      in srgb,
      var(--md-sys-color-tertiary) 38%,
      transparent
    );
  }
  .load-cell[data-level="some"] {
    background: color-mix(
      in srgb,
      var(--md-sys-color-tertiary) 20%,
      transparent
    );
  }
  .load-cell[data-level="off"] {
    background: color-mix(
      in srgb,
      var(--md-sys-color-outline-variant) 18%,
      transparent
    );
  }

  /* Drag note ------------------------------------------------------------ */
  .drag-note {
    position: fixed;
    z-index: 30;
    padding: 6px 10px;
    border-radius: 8px;
    background: var(--md-sys-color-inverse-surface);
    color: var(--md-sys-color-inverse-on-surface);
    font: var(--md-sys-typescale-label-medium-font);
    box-shadow: var(--bb-float-2);
    pointer-events: none;
    white-space: nowrap;
  }
  .drag-note[data-refused] {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
    box-shadow:
      var(--bb-float-2),
      inset 0 0 0 1px var(--md-sys-color-error);
  }

  /* States --------------------------------------------------------------- */
  .state {
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 12px;
    padding: 64px 16px;
    text-align: center;
    color: var(--md-sys-color-on-surface-variant);
  }
  .state p {
    margin: 0;
  }
  .state-icon {
    inline-size: 24px;
    block-size: 24px;
    color: var(--md-sys-color-error);
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

  @media (max-width: 900px) {
    .toolbar {
      gap: 8px;
    }
  }
`;
