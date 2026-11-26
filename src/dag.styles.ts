import { css } from "lit";

/**
 * Layout of the DAG editor. The canvas is a fixed frame; the world inside it is
 * translated and scaled, and nodes, ports and links are placed in world pixels.
 */
export const dagStyles = css`
  :host {
    display: block;
    block-size: 100%;
    min-block-size: 360px;
    container-type: inline-size;
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-body-medium-font);
    --dag-edge: var(--md-sys-color-outline);
    --dag-active: var(--md-sys-color-primary);
    --dag-error: var(--md-sys-color-error);
  }
  :host([hidden]) {
    display: none;
  }
  /* The shared shape motion animates width, height and inset: on the canvas it would
     make links, nodes and the overlays that follow the pointer trail behind it. The
     transitions declared below for colour, shadow and port size still apply. */
  .canvas *,
  .note,
  .ghost,
  .marquee {
    transition: none;
  }
  .dag {
    position: relative;
    display: flex;
    block-size: 100%;
    border-radius: var(--md-sys-shape-corner-extra-large);
    background: var(--md-sys-color-surface-container-low);
    overflow: clip;
  }
  .sr {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .tabler-icon {
    inline-size: 20px;
    block-size: 20px;
    flex: none;
  }

  /* Palette */
  .palette {
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    gap: 10px;
    inline-size: 264px;
    flex: none;
    padding: 14px 10px 10px 14px;
    border-inline-end: 1px solid var(--md-sys-color-outline-variant);
    background: var(--md-sys-color-surface-container);
    min-block-size: 0;
  }
  .palette header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .palette h2 {
    margin: 0;
    font: var(--md-sys-typescale-title-medium-font);
  }
  .palette-list {
    overflow: auto;
    min-block-size: 0;
    padding-inline-end: 4px;
  }
  .palette h3 {
    margin: 12px 4px 6px;
    font: var(--md-sys-typescale-label-medium-font);
    color: var(--md-sys-color-on-surface-variant);
  }
  .palette section:first-child h3 {
    margin-block-start: 2px;
  }
  .palette ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 2px;
  }
  .kind {
    display: flex;
    align-items: center;
    gap: 10px;
    inline-size: 100%;
    padding: 8px 10px;
    border: 0;
    border-radius: var(--md-sys-shape-corner-large);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: grab;
    touch-action: none;
  }
  .kind:hover {
    background: color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent);
  }
  .kind:active {
    cursor: grabbing;
    background: color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent);
  }
  .kind:focus-visible {
    outline: 3px solid var(--md-sys-color-secondary);
    outline-offset: -3px;
  }
  .kind:disabled {
    cursor: not-allowed;
    color: color-mix(in srgb, var(--md-sys-color-on-surface) 50%, transparent);
  }
  .kind-icon,
  .node-icon {
    display: grid;
    place-items: center;
    inline-size: 36px;
    block-size: 36px;
    flex: none;
    border-radius: 13px 13px 13px 4px;
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
  }
  .kind-icon > *,
  .node-icon > * {
    inline-size: 20px;
    block-size: 20px;
  }
  .kind:disabled .kind-icon {
    background: var(--md-sys-color-surface-container-highest);
    color: inherit;
  }
  .kind-text {
    display: grid;
    min-inline-size: 0;
  }
  .kind-text strong {
    font: var(--md-sys-typescale-label-large-font);
  }
  .kind-text span {
    font: var(--md-sys-typescale-body-small-font);
    color: var(--md-sys-color-on-surface-variant);
  }
  .kind:disabled .kind-text span {
    color: var(--md-sys-color-error);
  }
  .kind-lock {
    display: inline-flex;
    margin-inline-start: auto;
  }
  .kind-lock .tabler-icon {
    inline-size: 16px;
    block-size: 16px;
  }
  .palette-empty,
  .palette-foot {
    margin: 0;
    padding: 0 4px;
    font: var(--md-sys-typescale-body-small-font);
    color: var(--md-sys-color-on-surface-variant);
  }
  .palette-rail {
    position: absolute;
    inset-block-start: 12px;
    inset-inline-start: 12px;
    z-index: 3;
  }

  /* Canvas */
  .stage {
    position: relative;
    flex: 1;
    min-inline-size: 0;
  }
  .canvas {
    position: absolute;
    inset: 0;
    overflow: clip;
    cursor: grab;
    touch-action: none;
    -webkit-user-select: none;
    user-select: none;
    background-color: var(--md-sys-color-surface-container-low);
    background-image: radial-gradient(
      circle at 1px 1px,
      color-mix(in srgb, var(--md-sys-color-outline) 45%, transparent) 1px,
      transparent 1.4px
    );
    background-size: var(--grid) var(--grid);
  }
  .dag[data-gesture="pan"] .canvas {
    cursor: grabbing;
  }
  .dag[data-gesture="marquee"] .canvas,
  .dag[data-gesture="connect"] .canvas {
    cursor: crosshair;
  }
  .canvas:focus-visible {
    outline: 3px solid var(--md-sys-color-secondary);
    outline-offset: -3px;
  }
  .world {
    position: absolute;
    inset-block-start: 0;
    left: 0;
    transform-origin: 0 0;
  }
  .edges {
    position: absolute;
    overflow: visible;
    pointer-events: none;
  }
  .edge-hit {
    fill: none;
    stroke: transparent;
    stroke-width: 14;
    pointer-events: stroke;
    cursor: pointer;
  }
  .dag[data-gesture="connect"] .edge-hit {
    pointer-events: none;
  }
  .edge-line {
    fill: none;
    stroke: var(--dag-edge);
    stroke-width: 1.75;
    transition: stroke var(--md-sys-motion-duration-short, 100ms) linear;
  }
  .edge:hover .edge-line {
    stroke: var(--md-sys-color-on-surface-variant);
    stroke-width: 2.5;
  }
  .edge[data-related="true"] .edge-line {
    stroke: var(--dag-active);
    stroke-width: 2;
  }
  .edge[data-selected="true"] .edge-line {
    stroke: var(--dag-active);
    stroke-width: 3;
  }
  .preview {
    fill: none;
    stroke-width: 2.25;
    stroke-dasharray: 6 5;
    stroke: var(--md-sys-color-on-surface-variant);
  }
  .preview[data-tone="ok"] {
    stroke: var(--dag-active);
    stroke-dasharray: none;
  }
  .preview[data-tone="error"] {
    stroke: var(--dag-error);
  }
  .arrow path {
    fill: var(--dag-edge);
  }
  .arrow[data-tone="active"] path,
  .arrow[data-tone="ok"] path {
    fill: var(--dag-active);
  }
  .arrow[data-tone="error"] path {
    fill: var(--dag-error);
  }
  .arrow[data-tone="info"] path {
    fill: var(--md-sys-color-on-surface-variant);
  }

  /* Node: a bubble with one narrow corner, the signature of the system. */
  .node {
    position: absolute;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border-radius: 18px 18px 18px 6px;
    background: var(--md-sys-color-surface-container-lowest);
    box-shadow:
      inset 0 0 0 1px var(--md-sys-color-outline-variant),
      var(--bb-float-1);
    cursor: pointer;
    outline: none;
    transition:
      box-shadow var(--md-sys-motion-duration-short, 100ms) linear,
      opacity var(--md-sys-motion-duration-short, 100ms) linear;
  }
  .node::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: var(--md-sys-color-on-surface);
    opacity: 0;
  }
  .node:hover::before {
    opacity: 0.06;
  }
  .node[data-related="true"] {
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--dag-active) 55%, transparent),
      var(--bb-float-1);
  }
  .node[data-candidate="invalid"] {
    opacity: 0.45;
  }
  .node[data-candidate="valid"] {
    box-shadow:
      inset 0 0 0 1.5px color-mix(in srgb, var(--dag-active) 70%, transparent),
      var(--bb-float-1);
  }
  .node[data-tone="error"] {
    box-shadow:
      inset 0 0 0 1.5px var(--md-sys-color-error),
      var(--bb-float-1);
  }
  .node[data-tone="success"] .node-icon {
    background: var(--md-sys-color-success-container);
    color: var(--md-sys-color-on-success-container);
  }
  .node[data-tone="warning"] .node-icon {
    background: var(--md-sys-color-warning-container);
    color: var(--md-sys-color-on-warning-container);
  }
  .node[data-tone="error"] .node-icon {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
  }
  .node[data-tone="primary"] .node-icon {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }
  .node[data-tone="neutral"] .node-icon {
    background: var(--md-sys-color-surface-container-highest);
    color: var(--md-sys-color-on-surface-variant);
  }
  .node[data-selected="true"] {
    z-index: 2;
    box-shadow:
      inset 0 0 0 2px var(--dag-active),
      0 0 0 3px color-mix(in srgb, var(--dag-active) 28%, transparent),
      var(--bb-float-2);
  }
  .node:focus-visible {
    box-shadow:
      inset 0 0 0 2px var(--dag-active),
      0 0 0 4px var(--md-sys-color-surface-container-low),
      0 0 0 7px var(--md-sys-color-secondary);
  }
  .dag[data-gesture="move"] .node[data-selected="true"] {
    box-shadow:
      inset 0 0 0 2px var(--dag-active),
      var(--bb-float-3);
    cursor: grabbing;
    z-index: 2;
  }
  .node-head {
    display: flex;
    align-items: center;
    gap: 10px;
    block-size: 64px;
    flex: none;
    box-sizing: border-box;
    padding: 0 14px 0 12px;
  }
  .node-head[data-labelled="true"] {
    block-size: 60px;
    border-block-end: 1px solid var(--md-sys-color-outline-variant);
  }
  .node-text {
    display: grid;
    min-inline-size: 0;
    flex: 1;
  }
  .node-text strong,
  .node-text span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .node-text strong {
    font: var(--md-sys-typescale-label-large-font);
  }
  .node-text span {
    font: var(--md-sys-typescale-body-small-font);
    color: var(--md-sys-color-on-surface-variant);
  }
  .node-rows {
    flex: none;
  }
  /* Content the application slots into the node, under the header and the port rows. */
  ::slotted(*) {
    display: block;
    margin: 0 14px 12px;
    font: var(--md-sys-typescale-body-small-font);
    color: var(--md-sys-color-on-surface-variant);
    cursor: auto;
  }
  .badge {
    flex: none;
    max-inline-size: 84px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 2px 8px;
    border-radius: var(--md-sys-shape-corner-full);
    font: var(--md-sys-typescale-label-small-font);
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface-variant);
  }
  .badge[data-tone="success"] {
    background: var(--md-sys-color-success-container);
    color: var(--md-sys-color-on-success-container);
  }
  .badge[data-tone="warning"] {
    background: var(--md-sys-color-warning-container);
    color: var(--md-sys-color-on-warning-container);
  }
  .badge[data-tone="error"] {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
  }
  .badge[data-tone="primary"] {
    background: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
  }
  .port-label {
    position: absolute;
    translate: 0 -50%;
    display: flex;
    align-items: baseline;
    gap: 6px;
    max-inline-size: 44%;
    font: var(--md-sys-typescale-label-medium-font);
    color: var(--md-sys-color-on-surface-variant);
    white-space: nowrap;
    pointer-events: none;
  }
  .port-name {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .port-label em {
    flex: none;
    font: 10.5px "JetBrains Mono", monospace;
    font-style: normal;
    color: var(--md-sys-color-outline);
  }
  .port-label[data-side="out"] {
    flex-direction: row-reverse;
  }

  /* Port: wide grip area, small visible dot. */
  .port {
    position: absolute;
    inline-size: 22px;
    block-size: 22px;
    translate: -50% -50%;
    border-radius: 50%;
    cursor: crosshair;
    z-index: 1;
  }
  .port::before {
    content: "";
    position: absolute;
    inset: 5px;
    border-radius: 50%;
    box-sizing: border-box;
    background: var(--md-sys-color-surface-container-lowest);
    border: 2px solid var(--md-sys-color-outline);
    transition:
      inset var(--md-sys-motion-duration-short, 100ms) var(--md-sys-motion-easing-standard, ease),
      background var(--md-sys-motion-duration-short, 100ms) linear;
  }
  .port[data-used="true"]::before {
    background: var(--md-sys-color-outline);
  }
  .port:hover::before,
  .port[data-state~="origin"]::before {
    inset: 3px;
    border-color: var(--dag-active);
    background: var(--dag-active);
  }
  .dag[data-readonly="true"] .port {
    cursor: inherit;
  }
  .dag[data-readonly="true"] .port:hover::before {
    inset: 5px;
    border-color: var(--md-sys-color-outline);
    background: var(--md-sys-color-surface-container-lowest);
  }
  .port[data-state~="valid"]::before {
    border-color: var(--dag-active);
    background: color-mix(in srgb, var(--dag-active) 22%, var(--md-sys-color-surface-container-lowest));
  }
  .port[data-state~="invalid"]::before {
    border-color: color-mix(in srgb, var(--md-sys-color-outline) 60%, transparent);
    border-style: dashed;
  }
  .port[data-state~="hover"][data-state~="valid"]::before {
    inset: 2px;
    background: var(--dag-active);
  }
  .port[data-state~="hover"][data-state~="invalid"]::before {
    inset: 2px;
    border-style: solid;
    border-color: var(--dag-error);
    background: var(--md-sys-color-error-container);
  }
  /* Name and type of the port, for vertical layouts and nodes without rows. */
  .port::after {
    content: attr(data-tip);
    position: absolute;
    inset-block-end: calc(100% + 4px);
    inset-inline-start: 50%;
    translate: -50% 0;
    padding: 3px 8px;
    border-radius: var(--md-sys-shape-corner-small);
    background: var(--md-sys-color-inverse-surface);
    color: var(--md-sys-color-inverse-on-surface);
    font: var(--md-sys-typescale-label-small-font);
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--md-sys-motion-duration-short, 100ms) linear;
  }
  .port:hover::after {
    opacity: 1;
    transition-delay: 350ms;
  }
  .marquee {
    position: absolute;
    border: 1.5px solid var(--dag-active);
    border-radius: var(--md-sys-shape-corner-small);
    background: color-mix(in srgb, var(--dag-active) 10%, transparent);
    pointer-events: none;
  }

  /* Commands and map */
  .toolbar {
    position: absolute;
    inset-block-end: 12px;
    inset-inline-start: 12px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 4px;
    border-radius: var(--md-sys-shape-corner-full);
    background: var(--md-sys-color-surface-container-high);
    box-shadow: var(--bb-float-2);
  }
  .toolbar-separator {
    inline-size: 1px;
    block-size: 24px;
    margin: 0 4px;
    background: var(--md-sys-color-outline-variant);
  }
  .zoom {
    min-inline-size: 52px;
    block-size: 40px;
    padding: 0 6px;
    border: 0;
    border-radius: var(--md-sys-shape-corner-full);
    background: transparent;
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-label-large-font);
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }
  .zoom:hover {
    background: color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent);
  }
  .zoom:focus-visible {
    outline: 3px solid var(--md-sys-color-secondary);
    outline-offset: 2px;
  }
  .minimap {
    position: absolute;
    inset-block-end: 12px;
    inset-inline-end: 12px;
    z-index: 3;
    inline-size: 200px;
    block-size: 132px;
    padding: 6px;
    box-sizing: border-box;
    border-radius: var(--md-sys-shape-corner-large);
    background: var(--md-sys-color-surface-container-high);
    box-shadow: var(--bb-float-2);
  }
  .minimap svg {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    cursor: pointer;
    touch-action: none;
  }
  .minimap rect {
    fill: var(--md-sys-color-outline-variant);
  }
  .minimap rect[data-tone="error"] {
    fill: var(--md-sys-color-error);
  }
  .minimap rect[data-selected="true"] {
    fill: var(--md-sys-color-primary);
  }
  .minimap .minimap-view {
    fill: color-mix(in srgb, var(--md-sys-color-primary) 10%, transparent);
    stroke: var(--md-sys-color-primary);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }
  .readonly {
    position: absolute;
    inset-block-start: 12px;
    inset-inline-end: 12px;
    z-index: 3;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px 6px 10px;
    border-radius: var(--md-sys-shape-corner-full);
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-label-large-font);
    box-shadow: var(--bb-float-1);
  }
  .readonly .tabler-icon {
    inline-size: 16px;
    block-size: 16px;
  }

  /* Notes that follow the pointer */
  .note {
    position: fixed;
    z-index: 30;
    max-inline-size: 360px;
    padding: 6px 10px;
    border-radius: var(--md-sys-shape-corner-small);
    background: var(--md-sys-color-inverse-surface);
    color: var(--md-sys-color-inverse-on-surface);
    font: var(--md-sys-typescale-label-medium-font);
    box-shadow: var(--bb-float-2);
    pointer-events: none;
  }
  .note[data-tone="ok"] {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }
  .note[data-tone="error"] {
    background: var(--md-sys-color-error-container);
    color: var(--md-sys-color-on-error-container);
    box-shadow:
      var(--bb-float-2),
      inset 0 0 0 1px var(--md-sys-color-error);
  }
  .ghost {
    position: fixed;
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 10px;
    inline-size: 200px;
    padding: 10px 12px;
    translate: -50% -50%;
    border-radius: 18px 18px 18px 6px;
    background: var(--md-sys-color-surface-container-lowest);
    box-shadow:
      inset 0 0 0 1px var(--md-sys-color-outline-variant),
      var(--bb-float-3);
    pointer-events: none;
    opacity: 0.7;
  }
  .ghost[data-over="true"] {
    opacity: 1;
    box-shadow:
      inset 0 0 0 2px var(--dag-active),
      var(--bb-float-3);
  }

  /* States */
  .state {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 12px;
    padding: 24px;
    pointer-events: none;
  }
  .state > * {
    pointer-events: auto;
  }
  .state[data-kind="loading"],
  .state[data-kind="error"] {
    background: var(--md-sys-color-surface-container-low);
  }
  .state p {
    margin: 0;
    color: var(--md-sys-color-on-surface-variant);
  }
  .skeleton {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .skeleton span {
    position: absolute;
    inline-size: 200px;
    block-size: 56px;
    border-radius: 18px 18px 18px 6px;
    background: var(--md-sys-color-surface-container-high);
    inset-inline-start: calc(8% + (var(--i) * 15%));
    inset-block-start: calc(18% + mod(var(--i), 3) * 22%);
    animation: dag-pulse 1.4s var(--md-sys-motion-easing-standard, ease) infinite alternate;
    animation-delay: calc(var(--i) * 120ms);
  }
  @keyframes dag-pulse {
    to {
      opacity: 0.45;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .skeleton span {
      animation: none;
    }
  }
  .keys {
    display: grid;
    gap: 10px;
    margin: 0;
    padding-block-end: 12px;
  }
  .keys div {
    display: grid;
    gap: 4px;
  }
  .keys dt {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .keys dd {
    margin: 0;
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-body-small-font);
  }
  kbd {
    padding: 1px 7px;
    border-radius: var(--md-sys-shape-corner-small);
    background: var(--md-sys-color-surface-container-highest);
    box-shadow: inset 0 -1px 0 var(--md-sys-color-outline-variant);
    font: 12px "JetBrains Mono", monospace;
  }

  /* The editor reads its own width, not the window's. */
  @container (max-width: 760px) {
    .palette {
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      z-index: 4;
      box-shadow: var(--bb-float-3);
    }
  }
  /* Toolbar and map side by side need about 640px. */
  @container (max-width: 660px) {
    .minimap {
      display: none;
    }
  }
`;
