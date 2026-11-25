import { css } from "lit";

/** Bolle signature: tail corner toward the origin, inflate on open, pop on close. */
export const bolleStyles = css`
  :host {
    -webkit-user-select: none;
    user-select: none;
  }
  /* Scrollbars without arrow buttons, so both ends of track and thumb stay round. */
  :host::-webkit-scrollbar,
  ::-webkit-scrollbar {
    width: var(--bb-scrollbar-size, 12px);
    height: var(--bb-scrollbar-size, 12px);
    background: transparent;
  }
  :host::-webkit-scrollbar-button,
  ::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
  }
  :host::-webkit-scrollbar-track,
  ::-webkit-scrollbar-track {
    margin: var(--bb-scrollbar-margin, 8px);
    border-radius: var(--md-sys-shape-corner-full, 9999px);
    background: var(--bb-scrollbar-track, transparent);
  }
  :host::-webkit-scrollbar-thumb,
  ::-webkit-scrollbar-thumb {
    border: var(--bb-scrollbar-inset, 3px) solid transparent;
    border-radius: var(--md-sys-shape-corner-full, 9999px);
    background: var(
        --bb-scrollbar-thumb,
        color-mix(in srgb, currentColor 38%, transparent)
      )
      padding-box;
  }
  :host::-webkit-scrollbar-thumb:hover,
  ::-webkit-scrollbar-thumb:hover {
    background-color: var(
      --bb-scrollbar-thumb-hover,
      color-mix(in srgb, currentColor 62%, transparent)
    );
  }
  :host::-webkit-scrollbar-corner,
  ::-webkit-scrollbar-corner {
    background: transparent;
  }
  /* Engines without ::-webkit-scrollbar (Firefox) draw no arrows; only colour and width apply. */
  @supports not selector(::-webkit-scrollbar) {
    :host,
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--bb-scrollbar-thumb, currentColor)
        var(--bb-scrollbar-track, transparent);
    }
  }
  input,
  textarea,
  [contenteditable]:not([contenteditable="false"]) {
    -webkit-user-select: text;
    user-select: text;
  }
  [data-tail] {
    --bb-r: var(--bb-corner, var(--bb-radius));
    --bb-shape: var(--bb-r);
  }
  [data-tail="top-left"] {
    --bb-shape: var(--bb-tail) var(--bb-r) var(--bb-r) var(--bb-r);
    transform-origin: top left;
  }
  [data-tail="top-right"] {
    --bb-shape: var(--bb-r) var(--bb-tail) var(--bb-r) var(--bb-r);
    transform-origin: top right;
  }
  [data-tail="bottom-right"] {
    --bb-shape: var(--bb-r) var(--bb-r) var(--bb-tail) var(--bb-r);
    transform-origin: bottom right;
  }
  [data-tail="bottom-left"] {
    --bb-shape: var(--bb-r) var(--bb-r) var(--bb-r) var(--bb-tail);
    transform-origin: bottom left;
  }
  :where(*) {
    transition: var(--bb-shape-motion);
  }
  [popover][data-tail] {
    transition:
      opacity var(--bb-spring-effects-fast-duration)
        var(--bb-spring-effects-fast),
      scale var(--bb-spring-spatial-fast-duration) var(--bb-spring-spatial-fast),
      overlay var(--bb-spring-spatial-fast-duration) allow-discrete,
      display var(--bb-spring-effects-fast-duration) allow-discrete,
      var(--bb-shape-motion);
  }
  [popover][data-tail]:popover-open {
    animation: bb-inflate var(--bb-spring-spatial-duration)
      var(--bb-spring-spatial);
  }
  [popover][data-tail]:not(:popover-open) {
    opacity: 0;
    scale: 1.05;
  }
  @keyframes bb-inflate {
    from {
      opacity: 0;
      scale: 0.6;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    [popover][data-tail]:popover-open {
      animation: bb-fade var(--bb-pop-duration) linear;
    }
    [popover][data-tail]:not(:popover-open) {
      scale: none;
    }
    @keyframes bb-fade {
      from {
        opacity: 0;
      }
    }
  }
`;

export const commonStyles = css`
  ${bolleStyles}
  /* Film ring: decorative halo around the solid focus outline of a button. Chips keep
     only the solid outline: at their size the ring lands 5px outside the shape and the
     conic gradient reads as an artefact instead of a halo. */
  .button::before {
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
    transition:
      opacity var(--md-sys-motion-duration-short3),
      var(--bb-shape-motion);
  }
  .button:focus-visible::before {
    opacity: 1;
  }
  /* Solid inner ring carries focus; the film ring outside it is only decoration. */
  .button:focus-visible,
  .chip label:has(input:focus-visible),
  .chip :is(button, a):focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 1px;
  }
  :host([selected]),
  [aria-current="page"],
  [aria-current="true"],
  [aria-selected="true"],
  [aria-pressed="true"],
  label:has(input:checked) {
    --md-icon-fill: 1;
  }
  @media (forced-colors: active) {
    .button::before {
      display: none;
    }
  }
  .icon {
    font-family: var(--md-ref-typeface-icons, inherit);
    font-variation-settings:
      "FILL" var(--md-icon-fill, 0),
      "wght" var(--md-icon-weight, 400),
      "GRAD" 0,
      "opsz" var(--md-icon-optical-size, 24);
    font-weight: 400;
    font-size: 24px;
    line-height: 1;
    direction: ltr;
    text-transform: none;
    transition:
      font-variation-settings var(--md-sys-motion-duration-short4),
      var(--bb-shape-motion);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  :host {
    box-sizing: border-box;
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-body-large-font, 400 16px/24px system-ui);
    letter-spacing: var(--md-sys-typescale-body-large-tracking, 0.5px);
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  [hidden] {
    display: none !important;
  }
  button,
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }
  button,
  a,
  summary,
  input[type="range"],
  input[type="checkbox"],
  input[type="radio"] {
    cursor: pointer;
  }
  button,
  a {
    -webkit-tap-highlight-color: transparent;
  }
  button {
    border: 0;
    background: none;
  }
  button:disabled,
  input:disabled {
    cursor: default;
    opacity: var(--md-sys-state-disabled-content-opacity);
  }
  :focus-visible {
    outline: var(--md-sys-state-focus-indicator-thickness) solid
      var(--md-sys-state-focus-indicator-color);
    outline-offset: var(--md-sys-state-focus-indicator-inner-offset);
  }
  button,
  a {
    position: relative;
  }
  button:not(:disabled):hover,
  a:hover,
  label:has(> input:not(:disabled)):hover {
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
  button:not(:disabled):active,
  a:active,
  label:has(> input:not(:disabled)):active {
    background-image:
      linear-gradient(var(--bolle-state-pressed), var(--bolle-state-pressed)),
      var(--bb-hover-glint);
    background-size:
      100% 100%,
      var(--bb-glint-box) var(--bb-glint-box);
    background-position:
      0 0,
      var(--bb-glint-position);
    background-repeat: no-repeat;
  }
  :host {
    --bolle-state-hover: color-mix(in srgb, currentColor 8%, transparent);
    --bolle-state-pressed: color-mix(in srgb, currentColor 10%, transparent);
    /* Corner radius the hover reflection keeps between itself and the corner.
       A control whose corner is not the large shape sets this next to its
       border-radius. */
    --bb-glint-radius: var(--md-sys-shape-corner-large);
    /* The hover mark floats inside the corner: a gap from the border and a
       thickness, both fixed, so the arc stays clear of the edge and of the label. */
    --bb-glint-gap: 5px;
    --bb-glint-width: 2.5px;
    /* Reflection of --bb-highlight, resolved on the host so a component can set
       --bb-shine-inset to its own corner radius. Keep in sync with tokens.css. */
    --bb-highlight: radial-gradient(
      ellipse calc(var(--bb-shine-size) / 2) calc(var(--bb-shine-size) * 0.31)
        at calc(100% - var(--bb-shine-inset) - var(--bb-shine-size) / 2)
        calc(var(--bb-shine-inset) + var(--bb-shine-size) * 0.31),
      var(--bb-shine-color) 0 99%,
      rgb(255 255 255 / 0) 100%
    );
  }
  /* Hover reflection: an arc concentric with the top-right corner, held a gap
     inside the border and cut sharp, with no fade. Declared on the element so the
     radius of the current state applies. */
  button,
  a,
  label:has(> input) {
    --bb-glint-box: var(--bb-glint-radius);
    --bb-glint-position: right 0 top 0;
    --bb-hover-glint: radial-gradient(
      circle at 0 100%,
      transparent 0
        calc(
          var(--bb-glint-radius) - var(--bb-glint-gap) - var(--bb-glint-width)
        ),
      var(--bb-glint-color, rgb(255 255 255 / 0.4))
        calc(
          var(--bb-glint-radius) - var(--bb-glint-gap) - var(--bb-glint-width)
        )
        calc(var(--bb-glint-radius) - var(--bb-glint-gap)),
      transparent calc(var(--bb-glint-radius) - var(--bb-glint-gap))
    );
  }
  .support {
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-body-small-font);
  }
  @media (prefers-reduced-motion: reduce) {
    *:not([data-tail]),
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
`;
