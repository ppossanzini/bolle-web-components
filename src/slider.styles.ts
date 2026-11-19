import { css } from "lit";

export const sliderStyles = css`
  :host {
    display: block;
    inline-size: 100%;
    max-inline-size: var(--md-comp-slider-max-width);
    color: var(--md-sys-color-on-surface);
    --bb-slider-squish: var(--bb-tension-duration) var(--bb-tension);
    --bb-slider-fade: var(--md-sys-motion-duration-short3)
      var(--md-sys-motion-easing-standard);
  }
  .label {
    display: flex;
    justify-content: space-between;
    gap: var(--md-comp-action-gap);
    margin: 0 0 var(--md-comp-slider-label-gap, 8px);
    font: var(--md-sys-typescale-label-large-font);
    letter-spacing: var(--md-sys-typescale-label-large-tracking);
    color: var(--md-sys-color-on-surface-variant);
  }
  .label strong {
    color: var(--md-sys-color-on-surface);
    font-variant-numeric: tabular-nums;
  }
  .slider,
  .range {
    position: relative;
    touch-action: none;
    min-inline-size: var(--md-comp-slider-min-width);
  }
  input[type="range"] {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    appearance: none;
    background: transparent;
  }
  input[type="range"]:disabled {
    cursor: default;
  }
  .slider input::-webkit-slider-thumb {
    appearance: none;
    inline-size: var(--md-comp-slider-input-thumb-width, 24px);
    block-size: var(--md-comp-slider-input-thumb-height, 44px);
  }
  .slider input::-moz-range-thumb {
    inline-size: var(--md-comp-slider-input-thumb-width, 24px);
    block-size: var(--md-comp-slider-input-thumb-height, 44px);
    border: 0;
  }
  :host([disabled]) .slider,
  :host([disabled]) .range,
  :host([disabled]) .steps {
    opacity: 0.38;
  }

  /* Keyboard focus: outline on A, B, C; film halo on the thumb for D and E, never while dragging. */
  .slider:not(.membrane):has(input:focus-visible),
  .steps:has(:focus-visible) {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 6px;
    border-radius: var(--md-sys-shape-corner-full);
  }
  .membrane:not([data-pointer]):has(input:focus-visible) .membrane-thumb {
    stroke: var(--bb-film-2);
    stroke-width: 5;
  }
  .range:not([data-pointer]):has([data-end="lo"]:focus-visible) .thumb-lo,
  .range:not([data-pointer]):has([data-end="hi"]:focus-visible) .thumb-hi {
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--bb-film-2) 55%, transparent);
  }

  /* A · value bubble */
  .slider {
    --v: 50;
    --x: calc(
      var(--md-comp-slider-thumb-size, 24px) / 2 +
        (100% - var(--md-comp-slider-thumb-size, 24px)) * var(--v) / 100
    );
    block-size: var(--md-comp-slider-bubble-height, 72px);
  }
  .track {
    position: absolute;
    inset-inline: 0;
    inset-block-end: var(--md-comp-slider-track-offset, 18px);
    block-size: var(--md-comp-slider-track-height, 8px);
    border-radius: var(--md-sys-shape-corner-full);
    background: linear-gradient(
      to right,
      var(--md-sys-color-primary) var(--x),
      var(--md-sys-color-surface-container-high) var(--x)
    );
  }
  .thumb {
    position: absolute;
    inset-block-end: var(--md-comp-slider-thumb-offset, 10px);
    inset-inline-start: var(--x);
    inline-size: var(--md-comp-slider-thumb-size, 24px);
    block-size: var(--md-comp-slider-thumb-size, 24px);
    margin-inline-start: calc(var(--md-comp-slider-thumb-size, 24px) / -2);
    box-sizing: border-box;
    border-radius: 50%;
    border: var(--md-comp-slider-thumb-outline-width, 3px) solid
      var(--md-sys-color-surface-container-lowest);
    background: var(--md-sys-color-primary);
    box-shadow: var(--bb-float-2, var(--md-sys-elevation-level2));
    pointer-events: none;
    transition: transform var(--bb-slider-squish);
  }
  .bubble {
    position: absolute;
    inset-inline-start: var(--x);
    inset-block-end: var(--md-comp-slider-bubble-offset, 30px);
    inline-size: var(--md-comp-slider-bubble-size, 44px);
    block-size: var(--md-comp-slider-bubble-size, 44px);
    margin-inline-start: calc(var(--md-comp-slider-bubble-size, 44px) / -2);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50% 50% 50%
      var(--md-comp-slider-bubble-tail, var(--bb-tail, 6px));
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    box-shadow: var(--bb-float-2, var(--md-sys-elevation-level2));
    pointer-events: none;
    transform: rotate(-45deg) scale(0.82);
    transition:
      transform var(--bb-slider-squish),
      inset-block-end var(--bb-slider-squish);
  }
  .bubble > span {
    transform: rotate(45deg);
    font: 700 15px/1 var(--md-ref-typeface-plain, inherit);
    font-variant-numeric: tabular-nums;
  }
  .slider:not(.liquid):not(.membrane):active .thumb {
    transform: scale(1.25, 0.8);
  }
  .slider:active .bubble {
    transform: rotate(-45deg) scale(1.08);
    inset-block-end: var(--md-comp-slider-bubble-active-offset, 40px);
  }

  /* A · compact: 32px row, value in the label, bubble only while in use */
  :host([compact]) .label {
    margin-block-end: var(--md-comp-slider-compact-label-gap, 2px);
  }
  :host([compact]) .slider {
    block-size: var(--md-comp-slider-compact-height, 32px);
  }
  :host([compact]) .track {
    inset-block-end: var(--md-comp-slider-compact-track-offset, 12px);
  }
  :host([compact]) .thumb {
    inset-block-end: var(--md-comp-slider-compact-thumb-offset, 4px);
  }
  :host([compact]) .bubble {
    inset-block-end: var(--md-comp-slider-compact-bubble-offset, 20px);
    opacity: 0;
    transition:
      opacity var(--bb-slider-fade),
      transform var(--bb-slider-squish),
      inset-block-end var(--bb-slider-squish);
  }
  :host([compact]) .slider:active .bubble,
  :host([compact]) .slider:has(input:focus-visible) .bubble {
    opacity: 1;
    inset-block-end: var(--md-comp-slider-bubble-offset, 30px);
  }

  /* B · liquid level */
  .liquid {
    --fill: max(
      var(--md-comp-slider-liquid-min-fill, 64px),
      calc(var(--v) * 1%)
    );
    block-size: var(--md-comp-slider-liquid-height, 64px);
    border-radius: var(--md-sys-shape-corner-full);
    background: var(--md-sys-color-surface-container-high);
    overflow: hidden;
    transition: transform var(--bb-slider-squish);
  }
  .liquid::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    inline-size: var(--fill);
    border-radius: var(--md-sys-shape-corner-full);
    background: var(--md-sys-color-primary);
    pointer-events: none;
  }
  .liquid::after {
    content: "";
    position: absolute;
    inset-block-start: var(--md-comp-slider-liquid-glint-offset, 11px);
    inset-inline-start: calc(var(--fill) - 30px);
    inline-size: var(--md-comp-slider-liquid-glint-width, 16px);
    block-size: var(--md-comp-slider-liquid-glint-height, 9px);
    border-radius: 50%;
    background: var(--md-sys-color-surface-container-lowest);
    opacity: 0.55;
    transform: rotate(35deg);
    pointer-events: none;
  }
  .liquid .icon-slot {
    position: absolute;
    z-index: 1;
    inset-inline-start: var(--md-comp-slider-liquid-icon-offset, 20px);
    inset-block-start: 50%;
    translate: 0 -50%;
    display: flex;
    font-size: var(--md-comp-slider-liquid-icon-size, 22px);
    color: var(--md-sys-color-on-primary);
    pointer-events: none;
  }
  .liquid input::-webkit-slider-thumb {
    inline-size: 1px;
    block-size: var(--md-comp-slider-liquid-height, 64px);
  }
  .liquid input::-moz-range-thumb {
    inline-size: 1px;
    block-size: var(--md-comp-slider-liquid-height, 64px);
  }
  .liquid:active {
    transform: scale(1.02, 0.9);
  }

  /* C · bubbles in a row */
  .steps {
    display: inline-flex;
    align-items: flex-end;
    gap: var(--md-comp-slider-steps-gap, 6px);
  }
  .step {
    inline-size: var(--md-comp-slider-step-size, 52px);
    block-size: var(--md-comp-slider-step-size, 52px);
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .step:focus-visible {
    outline: none;
  }
  .dot {
    --size: 24px;
    display: block;
    inline-size: var(--size);
    block-size: var(--size);
    box-sizing: border-box;
    border-radius: 50%;
    border: var(--md-comp-slider-step-outline-width, 2px) solid
      var(--md-sys-color-outline);
    background: transparent;
    transition:
      transform var(--bb-slider-squish),
      background-color var(--bb-slider-fade);
  }
  .step:has(~ .step[aria-checked="true"]) .dot {
    background: var(--md-sys-color-primary);
    border-color: var(--md-sys-color-primary);
  }
  .step[aria-checked="true"] .dot {
    border: 3px solid transparent;
    transform: scale(1.12);
    background:
      linear-gradient(var(--md-sys-color-primary), var(--md-sys-color-primary))
        padding-box,
      var(--bb-film) border-box;
  }
  .step:active .dot {
    transform: scale(1.2, 0.85);
  }

  /* D · membrane */
  .membrane {
    block-size: var(--md-comp-slider-membrane-height, 110px);
  }
  .membrane svg {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    overflow: visible;
    pointer-events: none;
  }
  .membrane input {
    inset-block-start: var(--md-comp-slider-membrane-input-offset, 40px);
    block-size: var(--md-comp-slider-membrane-input-height, 60px);
  }
  .membrane-on {
    stop-color: var(--md-sys-color-primary);
  }
  .membrane-off {
    stop-color: var(--md-sys-color-outline-variant);
  }
  .membrane-thumb {
    fill: var(--md-sys-color-primary);
    stroke: var(--md-sys-color-surface-container-lowest);
    stroke-width: var(--md-comp-slider-membrane-thumb-outline-width, 3);
  }
  .membrane-value {
    fill: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-title-large-font);
    font-variant-numeric: tabular-nums;
  }

  /* E · merging drops */
  .range {
    --lo: 20;
    --hi: 70;
    --xl: calc(
      var(--md-comp-slider-range-thumb-size, 28px) / 2 +
        (100% - var(--md-comp-slider-range-thumb-size, 28px)) * var(--lo) / 100
    );
    --xh: calc(
      var(--md-comp-slider-range-thumb-size, 28px) / 2 +
        (100% - var(--md-comp-slider-range-thumb-size, 28px)) * var(--hi) / 100
    );
    block-size: var(--md-comp-slider-range-height, 44px);
  }
  .range::before {
    content: "";
    position: absolute;
    inset-inline: 0;
    inset-block-start: var(--md-comp-slider-range-track-offset, 18px);
    block-size: var(--md-comp-slider-range-track-height, 8px);
    border-radius: var(--md-sys-shape-corner-full);
    background: var(--md-sys-color-surface-container-high);
  }
  .bridge {
    position: absolute;
    inset-inline-start: var(--xl);
    inline-size: calc(var(--xh) - var(--xl));
    inset-block-start: var(--md-comp-slider-range-bridge-offset, 17px);
    block-size: var(--md-comp-slider-range-bridge-height, 10px);
    border-radius: var(--md-sys-shape-corner-full);
    background: var(--md-sys-color-primary);
    pointer-events: none;
    transition:
      block-size var(--bb-slider-squish),
      inset-block-start var(--bb-slider-squish);
  }
  .range.merged .bridge {
    block-size: var(--md-comp-slider-range-merged-height, 24px);
    inset-block-start: var(--md-comp-slider-range-merged-offset, 10px);
  }
  .drop {
    position: absolute;
    inset-block-start: var(--md-comp-slider-range-thumb-offset, 8px);
    inline-size: var(--md-comp-slider-range-thumb-size, 28px);
    block-size: var(--md-comp-slider-range-thumb-size, 28px);
    margin-inline-start: calc(
      var(--md-comp-slider-range-thumb-size, 28px) / -2
    );
    border-radius: 50%;
    background: var(--md-sys-color-primary);
    box-shadow: var(--bb-float-2, var(--md-sys-elevation-level2));
    pointer-events: none;
    transition: box-shadow var(--bb-slider-fade);
  }
  .thumb-lo {
    inset-inline-start: var(--xl);
  }
  .thumb-hi {
    inset-inline-start: var(--xh);
  }
  .range input {
    pointer-events: none;
  }
  .range input::-webkit-slider-thumb {
    pointer-events: auto;
    appearance: none;
    inline-size: var(--md-comp-slider-range-thumb-size, 28px);
    block-size: var(--md-comp-slider-range-height, 44px);
    cursor: pointer;
  }
  .range input::-moz-range-thumb {
    pointer-events: auto;
    inline-size: var(--md-comp-slider-range-thumb-size, 28px);
    block-size: var(--md-comp-slider-range-height, 44px);
    border: 0;
    cursor: pointer;
  }

  @media (prefers-reduced-motion: reduce) {
    .thumb,
    .bubble,
    .liquid,
    .dot,
    .bridge {
      transition: none;
    }
    .slider:active .thumb,
    .liquid:active,
    .step:active .dot {
      transform: none;
    }
    .slider:active .bubble {
      transform: rotate(-45deg) scale(0.82);
      inset-block-end: var(--md-comp-slider-bubble-offset, 30px);
    }
  }
`;
