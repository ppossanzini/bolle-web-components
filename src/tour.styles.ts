import { css } from "lit";

export const tourStyles = css`
  :host {
    display: contents;
  }

  /* The layer blocks the page; the dimming comes from the spotlight's outer shadow. */
  .layer {
    position: fixed;
    inset: 0;
    z-index: 60;
  }

  .spotlight {
    position: fixed;
    border-radius: var(--md-sys-shape-corner-medium);
    outline: 2px solid
      color-mix(in srgb, var(--md-sys-color-primary) 55%, transparent);
    box-shadow: 0 0 0 100vmax
      color-mix(in srgb, var(--md-sys-color-scrim) 62%, transparent);
    pointer-events: none;
    transition:
      inset-block-start var(--md-sys-motion-duration-medium2)
        var(--md-sys-motion-easing-emphasized),
      inset-inline-start var(--md-sys-motion-duration-medium2)
        var(--md-sys-motion-easing-emphasized),
      inline-size var(--md-sys-motion-duration-medium2)
        var(--md-sys-motion-easing-emphasized),
      block-size var(--md-sys-motion-duration-medium2)
        var(--md-sys-motion-easing-emphasized);
  }

  /* No target: the whole page dims and the card sits in the middle. */
  .spotlight.is-centred {
    inset: 0;
    inline-size: auto;
    block-size: auto;
    border-radius: 0;
    box-shadow: none;
    background: color-mix(in srgb, var(--md-sys-color-scrim) 62%, transparent);
  }

  .card {
    position: fixed;
    display: grid;
    gap: 6px;
    inline-size: min(360px, calc(100vw - 32px));
    max-block-size: calc(100vh - 32px);
    overflow: auto;
    padding: 20px;
    border-radius: var(--bb-radius) var(--bb-radius) var(--bb-radius)
      var(--bb-tail);
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface);
    box-shadow: var(--bb-float-4, var(--md-sys-elevation-level4));
  }

  /* The narrow corner points at the highlighted element. */
  .card[data-tail="below"] {
    border-start-start-radius: var(--bb-tail);
  }

  .card[data-tail="above"] {
    border-end-start-radius: var(--bb-tail);
  }

  .card[data-tail="end"] {
    border-start-start-radius: var(--bb-tail);
  }

  .card[data-tail="start"] {
    border-start-end-radius: var(--bb-tail);
  }

  .counter {
    margin: 0;
    font: var(--md-sys-typescale-label-medium-font);
    letter-spacing: var(--md-sys-typescale-label-medium-tracking);
    color: var(--md-sys-color-on-surface-variant);
  }

  .title {
    margin: 0;
    font: var(--md-sys-typescale-title-medium-font);
    letter-spacing: var(--md-sys-typescale-title-medium-tracking);
  }

  .body {
    margin: 0;
    font: var(--md-sys-typescale-body-medium-font);
    letter-spacing: var(--md-sys-typescale-body-medium-tracking);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-block-start: 8px;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-inline-start: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    .spotlight {
      transition: none;
    }
  }

  @media (forced-colors: active) {
    .spotlight {
      border: 2px solid CanvasText;
    }
  }
`;
