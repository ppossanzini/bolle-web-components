import { css } from "lit";

export const paginationStyles = css`
  :host {
    display: block;
    /* The pager adapts to the space it is given, not to the window it sits in. */
    container-type: inline-size;
    color: var(--md-sys-color-on-surface-variant);
    font: var(--md-sys-typescale-body-medium-font);
  }
  :host([hidden]) {
    display: none;
  }
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--bb-pagination-gap, 8px) 16px;
    min-block-size: 40px;
  }
  .range {
    font-variant-numeric: tabular-nums;
  }
  :host([range="none"]) .range {
    display: none;
  }
  .pages {
    display: flex;
    align-items: center;
    gap: 2px;
    /* The arrows stay on the far side: the range and the size read as one block. */
    margin-inline-start: auto;
  }
  .label {
    padding-inline: 8px;
    font: var(--md-sys-typescale-label-large-font);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .size {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .size-select {
    inline-size: var(--bb-pagination-size-width, 148px);
  }
  /* Numbered pages are the window around the current one: the edges stay reachable. */
  .page-list {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .page {
    display: inline-grid;
    place-items: center;
    min-inline-size: 32px;
    block-size: 36px;
    padding: 0 6px;
    border: 0;
    border-radius: var(--md-sys-shape-corner-full, 9999px);
    background: transparent;
    color: inherit;
    font: var(--md-sys-typescale-label-large-font);
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    transition: background var(--md-sys-motion-duration-short3, 150ms);
  }
  .page:hover {
    background: color-mix(in srgb, currentColor 8%, transparent);
  }
  .page:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: 1px;
  }
  .page[aria-current="page"] {
    background: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }
  .page[aria-current="page"]:hover {
    background: var(--md-sys-color-primary);
  }
  .gap {
    display: inline-grid;
    place-items: center;
    min-inline-size: 24px;
    block-size: 36px;
    color: var(--md-sys-color-outline);
  }
  /* The page number takes over from the numbered list when the room runs out. */
  .label {
    display: none;
  }
  @container (max-width: 620px) {
    .page-list {
      display: none;
    }
    .label {
      display: inline;
    }
  }
  :host([form="compact"]) .page-list {
    display: none;
  }
  :host([form="compact"]) .label {
    display: inline;
  }
  /* The jump-to-edge arrows are the first thing to go when the row runs out. */
  @container (max-width: 560px) {
    .first,
    .last {
      display: none;
    }
  }
`;
