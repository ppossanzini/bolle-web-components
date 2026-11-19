import { css } from "lit";

export const menuStyles = css`
  :host {
    display: contents;
    --menu-container: var(
      --md-comp-menus-standard-container-color,
      var(--md-sys-color-surface-container-low)
    );
    --menu-content: var(--md-sys-color-on-surface);
    --menu-secondary: var(--md-sys-color-on-surface-variant);
    --menu-selected: var(--md-sys-color-tertiary-container);
    --menu-on-selected: var(--md-sys-color-on-tertiary-container);
  }
  :host([variant="baseline"]) {
    --menu-container: var(--md-sys-color-surface-container);
    --menu-selected: var(--md-sys-color-secondary-container);
    --menu-on-selected: var(--md-sys-color-on-secondary-container);
    --md-comp-menu-item-horizontal-padding: var(
      --md-comp-menu-baseline-item-horizontal-padding,
      12px
    );
    --md-comp-menu-icon-size: var(--md-comp-menu-baseline-icon-size, 24px);
  }
  :host([color-scheme="vibrant"]) {
    --menu-container: var(
      --md-comp-menus-vibrant-container-color,
      var(--md-sys-color-tertiary-container)
    );
    --menu-content: var(--md-sys-color-on-tertiary-container);
    --menu-secondary: var(--md-sys-color-on-tertiary-container);
    --menu-selected: var(--md-sys-color-tertiary);
    --menu-on-selected: var(--md-sys-color-on-tertiary);
  }
  [popover] {
    position: fixed;
    inset: auto;
    margin: 0;
    box-sizing: border-box;
    min-inline-size: var(--md-comp-menu-min-width);
    max-inline-size: min(var(--md-comp-menu-max-width), 100vw);
    max-block-size: 100dvh;
    overflow-y: auto;
    border: 0;
    padding: var(--md-comp-menu-container-padding);
    background: color-mix(
      in srgb,
      var(--menu-container) var(--bb-glass-opacity, 100%),
      transparent
    );
    backdrop-filter: blur(var(--bb-glass-blur, 0px));
    color: var(--menu-content);
    --bb-corner: var(--bb-radius);
    border-radius: var(
      --bb-shape,
      var(--md-comp-menus-standard-menu-container-shape)
    );
    /* Nested surface: an item sits one block padding inside the menu, so its
       radius is the container radius minus that inset, never below 2px. */
    --menu-radius: var(
      --bb-r,
      var(--md-comp-menus-standard-menu-container-shape)
    );
    --menu-item-radius: max(
      var(--md-comp-menu-item-radius-min, 2px),
      calc(var(--menu-radius) - var(--md-comp-menu-container-padding-block))
    );
    box-shadow: var(--bb-float-2, var(--md-sys-elevation-level2));
    font: var(--md-sys-typescale-label-large-font);
    letter-spacing: var(--md-sys-typescale-label-large-tracking);
  }
  @supports not (backdrop-filter: blur(1px)) {
    [popover] {
      background: var(--menu-container);
    }
  }
  :host([variant="baseline"]) [popover] {
    border-radius: var(--md-comp-menu-container-shape);
    --menu-radius: var(--md-comp-menu-container-shape);
  }
  :host([inactive]) [popover] {
    border-radius: var(--md-comp-menus-standard-menu-inactive-container-shape);
    --menu-radius: var(--md-comp-menus-standard-menu-inactive-container-shape);
  }
  :host([quick]) [popover] {
    animation: none;
  }
  /* Below the compact breakpoint the menu becomes a bottom sheet. */
  [popover].compact {
    inset: auto 0 0 0;
    inline-size: auto;
    min-inline-size: 0;
    max-inline-size: none;
    max-block-size: min(
      var(--md-comp-menu-compact-viewport-height, 70dvh),
      var(--md-comp-menu-compact-max-height, 32rem)
    );
    border-start-start-radius: var(--md-sys-shape-corner-extra-large);
    border-start-end-radius: var(--md-sys-shape-corner-extra-large);
    border-end-start-radius: 0;
    border-end-end-radius: 0;
    padding-block-end: calc(
      var(--md-comp-menu-container-padding-block) +
        env(safe-area-inset-bottom, 0px)
    );
    transition:
      translate var(--bb-spring-spatial-fast-duration)
        var(--bb-spring-spatial-fast),
      opacity var(--bb-spring-effects-fast-duration)
        var(--bb-spring-effects-fast),
      overlay var(--bb-spring-spatial-fast-duration) allow-discrete,
      display var(--bb-spring-effects-fast-duration) allow-discrete;
  }
  [popover].compact:popover-open {
    animation: menu-sheet-in var(--bb-spring-spatial-duration)
      var(--bb-spring-spatial);
  }
  [popover].compact:not(:popover-open) {
    opacity: 0;
    scale: 1;
    translate: 0 100%;
  }
  @keyframes menu-sheet-in {
    from {
      opacity: 0;
      translate: 0 100%;
    }
  }
  .grabber {
    inline-size: var(--md-comp-menu-compact-grabber-width, 32px);
    block-size: var(--md-comp-menu-compact-grabber-height, 4px);
    margin: var(--md-comp-menu-compact-grabber-margin-block-start, 4px) auto
      var(--md-comp-menu-compact-grabber-margin-block-end, 8px);
    border-radius: var(--md-sys-shape-corner-full);
    background: var(--md-sys-color-outline-variant);
  }
  .filter {
    padding: var(--md-comp-menu-item-vertical-padding)
      var(--md-comp-menu-item-horizontal-padding);
  }
  .filter input {
    box-sizing: border-box;
    inline-size: 100%;
    min-block-size: var(--md-comp-menu-item-height);
    padding-inline: var(--md-comp-menu-item-between-space);
    border: var(--md-comp-menu-filter-border-width, 1px) solid
      var(--md-sys-color-outline-variant);
    border-radius: var(--menu-item-radius);
    background: transparent;
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
  }
  .filter input::placeholder {
    color: var(--menu-secondary);
  }
  .filter input:focus-visible {
    outline: var(--md-sys-state-focus-indicator-thickness) solid
      var(--md-sys-color-secondary);
    outline-offset: var(--md-sys-state-focus-indicator-inner-offset);
  }
  .empty {
    margin: 0;
    padding: var(--md-comp-menu-item-vertical-padding)
      var(--md-comp-menu-item-horizontal-padding);
    color: var(--menu-secondary);
    font: var(--md-sys-typescale-body-small-font);
    letter-spacing: var(--md-sys-typescale-body-small-tracking);
  }
  button,
  a {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--md-comp-menu-item-between-space);
    box-sizing: border-box;
    inline-size: 100%;
    min-block-size: var(--md-comp-menu-item-height);
    padding: var(--md-comp-menu-item-vertical-padding)
      var(--md-comp-menu-item-horizontal-padding);
    border: 0;
    border-radius: var(--menu-item-radius);
    background: transparent;
    color: inherit;
    text-decoration: none;
    text-align: start;
    font: inherit;
    cursor: pointer;
    isolation: isolate;
    transition:
      border-radius var(--md-sys-motion-duration-short2)
        var(--md-sys-motion-easing-standard),
      var(--bb-shape-motion);
  }
  button::after,
  a::after {
    content: "";
    position: absolute;
    inset: calc(-1 * var(--md-comp-menu-item-hit-area-overhang, 2px)) 0;
  }
  :host([variant="baseline"]) button,
  :host([variant="baseline"]) a {
    min-block-size: var(--md-comp-menu-item-target-height);
    border-radius: 0;
  }
  :host([variant="baseline"]) button::after,
  :host([variant="baseline"]) a::after {
    content: none;
  }
  button::before,
  a::before {
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    content: "";
    pointer-events: none;
  }
  /* Ripple origin is the press point; clipping keeps it inside the item radius
     without clipping the 2px taller target that surrounds it. */
  .ripple-clip {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    border-radius: inherit;
    pointer-events: none;
  }
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: currentColor;
    opacity: 0;
    transform: scale(0);
    animation: menu-ripple var(--bb-tension-duration) var(--bb-tension) forwards;
  }
  @keyframes menu-ripple {
    0% {
      transform: scale(0);
      opacity: var(--md-sys-state-pressed-state-layer-opacity);
    }
    70% {
      opacity: calc(var(--md-sys-state-pressed-state-layer-opacity) * 0.4);
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
  :is(button, a):hover::before,
  [aria-expanded="true"]::before {
    opacity: var(--md-sys-state-hover-state-layer-opacity);
  }
  :is(button, a):focus-visible::before {
    opacity: var(--md-sys-state-focus-state-layer-opacity);
  }
  :is(button, a):active::before {
    opacity: var(--md-sys-state-pressed-state-layer-opacity);
  }
  :is(button, a):focus-visible {
    outline: var(--md-sys-state-focus-indicator-thickness) solid
      var(--md-sys-color-secondary);
    outline-offset: var(--md-sys-state-focus-indicator-inner-offset);
  }
  .group-label {
    padding: calc(var(--md-comp-menu-item-vertical-padding) * 2)
      var(--md-comp-menu-item-horizontal-padding)
      var(--md-comp-menu-item-vertical-padding);
    font: var(--md-sys-typescale-label-medium-font);
    letter-spacing: var(--md-sys-typescale-label-medium-tracking);
    color: var(--menu-secondary);
  }
  .group + .group {
    border-block-start: var(--md-comp-menu-group-divider-width, 1px) solid
      var(--md-sys-color-outline-variant);
  }
  [aria-checked="true"] {
    background: var(--menu-selected);
    color: var(--menu-on-selected);
  }
  [aria-disabled="true"] {
    cursor: default;
  }
  [aria-disabled="true"] > * {
    opacity: var(--md-sys-state-disabled-content-opacity);
  }
  [aria-disabled="true"]::before {
    opacity: 0 !important;
  }
  .content {
    flex: 1;
    min-inline-size: 0;
    overflow-wrap: anywhere;
  }
  .supporting,
  .trailing {
    color: var(--menu-secondary);
  }
  .supporting {
    display: block;
    font: var(--md-sys-typescale-body-small-font);
    letter-spacing: var(--md-sys-typescale-body-small-tracking);
  }
  [aria-checked="true"] .supporting,
  [aria-checked="true"] .trailing {
    color: inherit;
  }
  .indicator {
    inline-size: var(--md-comp-menu-icon-size);
    flex-shrink: 0;
    text-align: center;
  }
  [role="separator"] {
    block-size: var(--md-comp-menu-divider-height);
    margin-block: var(--md-comp-menu-divider-space);
    background: var(--md-sys-color-outline-variant);
  }
  @media (prefers-reduced-motion: reduce) {
    button,
    a {
      transition: none;
    }
    .ripple {
      display: none;
    }
    [popover].compact:popover-open {
      animation: none;
    }
    [popover].compact:not(:popover-open) {
      translate: none;
    }
  }
  @media (forced-colors: active) {
    [popover] {
      border: var(--md-comp-menu-forced-colors-border-width, 1px) solid
        CanvasText;
    }
    [aria-checked="true"] {
      outline: var(--md-comp-menu-forced-colors-outline-width, 1px) solid
        Highlight;
    }
    button::before,
    a::before {
      display: none;
    }
  }
`;
