import { css } from "lit";

export const breadcrumbStyles = css`
  :host {
    display: block;
    min-inline-size: 0;
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-body-medium-font);
  }
  :host([hidden]) {
    display: none;
  }
  /* The path never paints outside its host: what does not fit ends in an ellipsis. */
  nav {
    min-inline-size: 0;
    overflow: hidden;
  }
  /* One line: a wrapped path leaves an orphan separator at the start of the row. */
  ol {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: var(--bb-breadcrumb-gap, 4px);
    margin: 0;
    padding: 0;
    list-style: none;
    min-inline-size: 0;
  }
  li {
    display: inline-flex;
    align-items: center;
    gap: var(--bb-breadcrumb-gap, 4px);
    flex: 0 1 auto;
    min-inline-size: 0;
  }
  a,
  .current {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-inline-size: 0;
    max-inline-size: var(--bb-breadcrumb-item-width, 32ch);
    padding: 4px 8px;
    border-radius: var(--md-sys-shape-corner-small, 8px);
    color: inherit;
    text-decoration: none;
    overflow: hidden;
  }
  /* The label is its own box: ellipsis applies to a block, not to a flex item's text. */
  .txt {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* A level never shrinks below a few characters: the ellipsis must still say something. */
  a {
    min-inline-size: var(--bb-breadcrumb-min-width, 2rem);
  }
  /* The page the reader is on is the last to give up room. */
  .current {
    max-inline-size: none;
    flex-shrink: 0.25;
  }
  a:hover {
    background: color-mix(in srgb, currentColor 8%, transparent);
    color: var(--md-sys-color-on-surface);
  }
  a:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 1px;
  }
  .current {
    color: var(--md-sys-color-on-surface);
    font-weight: 600;
  }
  .icon {
    display: inline-grid;
    place-items: center;
    flex: none;
    font-size: 18px;
  }
  .separator {
    display: inline-grid;
    place-items: center;
    flex: none;
    color: var(--md-sys-color-outline);
    font-size: 16px;
  }
  /* The chevron mirrors with the reading direction, like the path it divides. */
  :host(:dir(rtl)) .separator.chevron {
    scale: -1 1;
  }
  .separator.slash {
    user-select: none;
  }
  .ellipsis {
    display: inline-grid;
    place-items: center;
    min-inline-size: 32px;
    block-size: 32px;
    padding: 0 4px;
    border: 0;
    border-radius: var(--md-sys-shape-corner-full, 9999px);
    background: transparent;
    color: inherit;
    font: inherit;
    letter-spacing: 0.1em;
    cursor: pointer;
  }
  .ellipsis:hover {
    background: color-mix(in srgb, currentColor 8%, transparent);
  }
  .ellipsis:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 1px;
  }
`;
