import { css } from "lit";
export const feedbackStyles = css`
  :host {
    display: block;
  }
  :host([variant="linear"]) {
    inline-size: 100%;
  }
  :host([variant="circular"]) {
    display: inline-block;
    inline-size: auto;
  }
  progress {
    display: block;
    inline-size: 100%;
    block-size: var(--md-comp-progress-thickness);
    accent-color: var(--md-sys-color-primary);
    border: 0;
    border-radius: var(--md-sys-shape-corner-full);
    overflow: hidden;
    background: var(--md-sys-color-secondary-container);
  }
  progress::-webkit-progress-bar {
    background: var(--md-sys-color-secondary-container);
  }
  progress::-webkit-progress-value {
    background: var(--md-sys-color-primary);
    border-radius: var(--md-sys-shape-corner-full);
  }
  progress::-moz-progress-bar {
    background: var(--md-sys-color-primary);
  }
  .circle {
    inline-size: var(--md-comp-progress-circular-size);
    block-size: var(--md-comp-progress-circular-size);
    transform: rotate(-90deg);
  }
  .track,
  .value {
    fill: none;
    stroke-width: var(--md-comp-progress-stroke-width, 4px);
  }
  .track {
    stroke: var(--md-sys-color-secondary-container);
  }
  .value {
    stroke: var(--md-sys-color-primary);
    stroke-linecap: round;
  }
  .linear {
    position: relative;
    overflow: hidden;
    inline-size: 100%;
    block-size: var(--md-comp-progress-thickness);
    border-radius: var(--md-sys-shape-corner-full);
    background: var(--md-sys-color-secondary-container);
  }
  .linear-stop {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: 0;
    inline-size: var(--md-comp-progress-stop-size, 4px);
    block-size: var(--md-comp-progress-stop-size, 4px);
    border-radius: var(--md-sys-shape-corner-full);
    background: var(--md-sys-color-primary);
    transform: translateY(-50%);
  }
  .wavy {
    display: block;
    inline-size: 100%;
    block-size: calc(
      var(--md-comp-progress-thickness) +
        var(--md-comp-progress-wavy-overhang, 6px)
    );
    overflow: visible;
  }
  .wavy path {
    fill: none;
    stroke-width: var(--md-comp-progress-thickness);
    stroke-linecap: round;
  }
  .wavy-track {
    stroke: var(--md-sys-color-secondary-container);
  }
  .wavy-value {
    stroke: var(--md-sys-color-primary);
  }
  .wavy-indeterminate {
    animation: wavy-slide 1.6s linear infinite;
  }
  @keyframes wavy-slide {
    from {
      transform: translateX(
        calc(-1 * var(--md-comp-progress-wavy-travel, 32px))
      );
    }
    to {
      transform: translateX(0);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .wavy-indeterminate {
      animation: none;
    }
  }
  .linear-value {
    position: absolute;
    inset-block: 0;
    inline-size: var(--md-comp-progress-indeterminate-width, 40%);
    border-radius: inherit;
    background: var(--md-sys-color-primary);
  }
  .linear.indeterminate .linear-value {
    animation: linear-slide 1.8s var(--md-sys-motion-easing-standard) infinite;
  }
  .indeterminate {
    animation: rotate 1.4s linear infinite;
  }
  .indeterminate .value {
    animation: dash 1.4s ease-in-out infinite;
  }
  @keyframes linear-slide {
    0% {
      inset-inline-start: calc(
        -1 * var(--md-comp-progress-indeterminate-width, 40%)
      );
    }
    100% {
      inset-inline-start: 100%;
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1 100;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 70 100;
      stroke-dashoffset: -20;
    }
    100% {
      stroke-dasharray: 70 100;
      stroke-dashoffset: -95;
    }
  }
  .loading {
    position: relative;
    inline-size: var(--md-comp-loading-size);
    block-size: var(--md-comp-loading-size);
    display: grid;
    place-items: center;
  }
  .goo {
    position: absolute;
  }
  /* Bubbles rise and merge through the SVG goo filter (blur + alpha threshold). */
  .bubbles {
    position: relative;
    inline-size: var(--md-comp-loading-active-size);
    block-size: var(--md-comp-loading-active-size);
    filter: url(#bb-goo);
  }
  .bubbles span {
    position: absolute;
    inset-block-end: 0;
    inset-inline-start: 50%;
    inline-size: var(--md-comp-loading-bubble-size, 42%);
    aspect-ratio: 1;
    margin-inline-start: calc(-1 * var(--md-comp-loading-bubble-offset, 21%));
    border-radius: 50%;
    background: var(--md-sys-color-primary);
    animation: bolle-rise 1.6s var(--md-sys-motion-easing-emphasized) infinite;
  }
  .bubbles span:nth-child(2) {
    inline-size: var(--md-comp-loading-bubble-secondary-size, 30%);
    margin-inline-start: calc(
      -1 * var(--md-comp-loading-bubble-secondary-offset, 30%)
    );
    animation-delay: -0.53s;
  }
  .bubbles span:nth-child(3) {
    inline-size: var(--md-comp-loading-bubble-tertiary-size, 24%);
    margin-inline-start: var(--md-comp-loading-bubble-tertiary-offset, 4%);
    animation-delay: -1.06s;
  }
  @keyframes bolle-rise {
    0% {
      translate: 0 0;
      scale: 0.4;
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    70% {
      scale: 1;
    }
    100% {
      translate: 0 calc(-1 * var(--md-comp-loading-active-size) * 0.6);
      scale: 0.7;
      opacity: 0;
    }
  }
  @media (update: slow) {
    .bubbles {
      filter: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .linear-value,
    .indeterminate,
    .indeterminate .value,
    .morph-shape,
    .bubbles span {
      animation: none;
    }
    .morph-shape {
      border-radius: 38%;
      rotate: none;
    }
    .bubbles span {
      opacity: 1;
      scale: 1;
    }
    .bubbles span:nth-child(2) {
      translate: 0 -40%;
    }
    .bubbles span:nth-child(3) {
      translate: 0 -90%;
    }
  }
  :host([variant="contained"]) .loading {
    background: var(--md-sys-color-primary-container);
    border-radius: var(--md-sys-shape-corner-full);
  }
  :host([variant="contained"]) .bubbles span {
    background: var(--md-sys-color-on-primary-container);
  }
  /* Expressive shape sequence: one form rotating and morphing through seven
     shapes. The forms are project-authored, not a measured replica. */
  .loading.morph {
    inline-size: auto;
    block-size: auto;
  }
  .morph-shape {
    display: block;
    inline-size: var(--md-comp-loading-morph-size);
    block-size: var(--md-comp-loading-morph-size);
    background: var(--md-sys-color-primary);
    animation:
      morph-shapes var(--md-comp-loading-morph-duration)
        var(--md-sys-motion-easing-emphasized) infinite,
      morph-turn var(--md-comp-loading-morph-duration) linear infinite;
  }
  @keyframes morph-shapes {
    0%,
    100% {
      border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
    }
    14% {
      border-radius: 38% 38% 38% 38% / 38% 38% 38% 38%;
    }
    28% {
      border-radius: 50% 18% 50% 18% / 18% 50% 18% 50%;
    }
    42% {
      border-radius: 62% 6% 62% 6% / 6% 62% 6% 62%;
    }
    56% {
      border-radius: 50% 50% 50% 50% / 28% 28% 28% 28%;
    }
    70% {
      border-radius: 16% 50% 16% 50% / 50% 16% 50% 16%;
    }
    84% {
      border-radius: 30% 30% 30% 30% / 30% 30% 30% 30%;
    }
  }
  @keyframes morph-turn {
    to {
      rotate: 360deg;
    }
  }
  :host([variant="contained"]) .morph-shape {
    background: var(--md-sys-color-on-primary-container);
  }
  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
  .carousel {
    position: relative;
    container-type: inline-size;
  }
  .viewport {
    display: flex;
    gap: var(--md-comp-carousel-gap);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    padding: var(--md-comp-field-gap);
  }
  /* Keylines follow the carousel's own inline size, not the viewport, so the
     focal item keeps its proportions inside a narrow column or a wide pane.
     cqi resolves against the container in the flat tree, which is why the
     width belongs to the slotted rule rather than a variable on .viewport. */
  ::slotted(*) {
    flex: 0 0 var(--md-comp-carousel-item-basis, 78%);
    scroll-snap-align: start;
    border-radius: var(--md-sys-shape-corner-extra-large);
    overflow: clip;
  }
  :host([variant="hero"]) ::slotted(*) {
    flex-basis: calc(
      100cqi - var(--md-comp-carousel-leading-space) - var(
          --md-comp-carousel-trailing-space
        )
    );
  }
  :host([variant="multi-browse"]) .viewport {
    scroll-padding-inline-start: var(--md-comp-carousel-leading-space);
  }
  :host([variant="multi-browse"]) ::slotted(*) {
    flex-basis: max(
      var(--md-comp-carousel-multi-item-min, 96px),
      calc(
        (
            100cqi - 2 * var(--md-comp-carousel-leading-space) - 2 *
              var(--md-comp-carousel-gap)
          ) /
          3
      )
    );
  }
  :host([variant="uncontained"]) ::slotted(*) {
    flex-basis: clamp(
      var(--md-comp-carousel-uncontained-item-min, 160px),
      var(--md-comp-carousel-uncontained-item-fluid, 24cqi),
      var(--md-comp-carousel-uncontained-item-max, 220px)
    );
  }
  :host([variant="center-aligned-hero"]) .viewport {
    scroll-snap-type: x mandatory;
    scroll-padding-inline: var(
      --md-comp-carousel-center-aligned-scroll-padding,
      14%
    );
  }
  :host([variant="center-aligned-hero"]) ::slotted(*) {
    flex-basis: var(--md-comp-carousel-center-aligned-item-basis, 60cqi);
    scroll-snap-align: center;
  }
  :host([variant="full-screen"]) .viewport {
    flex-direction: column;
    block-size: var(--md-comp-carousel-full-height);
    overflow-x: hidden;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    padding: 0;
    gap: var(--md-comp-carousel-full-screen-gap);
  }
  :host([variant="uncontained"]) .viewport,
  :host([variant="uncontained-multi-aspect-ratio"]) .viewport {
    scroll-snap-type: none;
  }
  :host([variant="uncontained-multi-aspect-ratio"]) ::slotted(*) {
    flex-basis: auto;
    max-inline-size: 70cqi;
  }
  :host([variant="center-aligned-hero"]) ::slotted(*) {
    scroll-snap-align: center;
  }
  :host([variant="full-screen"]) ::slotted(*) {
    flex: 0 0 100%;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: var(--md-comp-action-gap);
    font: var(--md-sys-typescale-label-medium-font);
    letter-spacing: var(--md-sys-typescale-label-medium-tracking);
  }
  .controls button {
    min-block-size: var(--md-comp-action-target);
    min-inline-size: var(--md-comp-action-target);
    border-radius: var(--md-sys-shape-corner-full);
  }
`;
