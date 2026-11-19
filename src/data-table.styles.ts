import { css } from "lit";

export const dataTableStyles = css`
  :host {
    display: block;
    min-inline-size: 0;
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
  .table {
    /* Row and header colours are variables so the free form can lay the same
       table straight on the page surface. */
    --table-row: var(--md-sys-color-surface-container-lowest);
    --table-head: var(--md-sys-color-surface-container-low);
    --table-row-height: 52px;
    --table-header-height: 52px;
    --table-group-height: 48px;
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    inline-size: 100%;
    block-size: 100%;
    min-block-size: 0;
    border-radius: var(--bb-radius) var(--bb-radius) var(--bb-radius)
      var(--bb-tail);
    background: var(--table-row);
    box-shadow: var(--bb-float-1);
    border: 1px solid var(--md-sys-color-outline-variant);
    overflow: hidden;
    color: var(--md-sys-color-on-surface);
    font: var(--md-sys-typescale-body-medium-font);
  }
  .table.density-compact {
    --table-row-height: 40px;
    font: var(--md-sys-typescale-body-small-font);
  }
  /* Free form: the table sits on the page and only hairlines separate rows. */
  .table.is-free {
    --table-row: var(--md-sys-color-surface);
    --table-head: var(--md-sys-color-surface);
    border: 0;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    overflow: visible;
  }
  .table.is-free .group th {
    background: var(--md-sys-color-surface-container-low);
  }
  .table.is-free .detail td {
    background: var(--md-sys-color-surface-container-low);
  }
  .table.is-free .footer {
    border-block-start: 1px solid var(--md-sys-color-outline-variant);
    background: transparent;
  }

  /* Loading ----------------------------------------------------------- */
  .busy {
    position: absolute;
    inset-block-start: calc(var(--table-header-height) + 20px);
    inset-inline-start: 50%;
    translate: -50% 0;
    z-index: 6;
  }
  :host(:dir(rtl)) .busy {
    translate: 50% 0;
  }
  .dimmed table {
    opacity: 0.55;
    transition: opacity 160ms;
  }

  /* Scroller and table ------------------------------------------------ */
  .scroller {
    position: relative;
    flex: 1;
    min-block-size: 0;
    overflow: auto;
    overscroll-behavior: contain;
  }
  .table.is-free .scroller {
    overflow: hidden auto;
  }
  table {
    /* Declared column widths, and never narrower than the panel. A percentage
       width here resolves against an indefinite box and explodes the columns. */
    inline-size: max-content;
    min-inline-size: 100%;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0;
  }
  th,
  td {
    box-sizing: border-box;
    padding: 0 12px;
    text-align: start;
    vertical-align: middle;
    border-block-end: 1px solid var(--md-sys-color-outline-variant);
    background: var(--table-row);
    overflow: hidden;
    white-space: nowrap;
  }
  .end {
    text-align: end;
  }
  td.end {
    padding-inline-end: 20px;
  }
  .spacer td {
    padding: 0;
    border: 0;
  }

  /* Header ------------------------------------------------------------ */
  thead th {
    position: sticky;
    top: 0;
    z-index: 3;
    block-size: var(--table-header-height);
    padding: 0;
    background: var(--table-head);
    font: var(--md-sys-typescale-label-large-font);
    color: var(--md-sys-color-on-surface-variant);
    overflow: visible;
  }
  thead th.cell-pinned,
  thead th.cell-end {
    z-index: 4;
  }
  thead th.select,
  thead th.expand,
  thead th.actions {
    padding: 0 4px;
    text-align: center;
  }
  .head {
    position: relative;
    display: flex;
    align-items: center;
    gap: 2px;
    block-size: 100%;
    padding-inline: 12px 10px;
  }
  .end .head {
    flex-direction: row;
  }
  th:hover .head .sort,
  th:focus-within .head .sort {
    padding-inline-end: 34px;
  }
  th.end:hover .head .sort,
  th.end:focus-within .head .sort {
    padding-inline: 34px 6px;
  }
  .grip {
    position: absolute;
    inset-inline-start: 0;
    z-index: 1;
    display: inline-grid;
    place-items: center;
    inline-size: 16px;
    block-size: 28px;
    border-radius: 6px;
    color: var(--md-sys-color-outline);
    cursor: grab;
    opacity: 0;
    touch-action: none;
    transition: opacity 120ms;
  }
  .grip svg {
    inline-size: 16px;
    block-size: 16px;
  }
  th:hover .grip,
  th:focus-within .grip,
  th.dragging .grip {
    opacity: 1;
  }
  th.dragging .grip {
    cursor: grabbing;
  }
  .sort {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 6px;
    min-inline-size: 0;
    block-size: 40px;
    padding: 0 6px;
    border: 0;
    border-radius: var(--md-sys-shape-corner-small);
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
  }
  .sort.static {
    cursor: default;
  }
  .sort:hover {
    background: color-mix(
      in srgb,
      var(--md-sys-color-on-surface) 8%,
      transparent
    );
    color: var(--md-sys-color-on-surface);
  }
  .sort:focus-visible,
  .resize:focus-visible,
  .group-toggle:focus-visible {
    outline: 2px solid var(--md-sys-color-primary);
    outline-offset: -2px;
  }
  [aria-sort] .sort {
    color: var(--md-sys-color-on-surface);
  }
  .ellipsis {
    display: block;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sort-mark {
    position: relative;
    display: inline-flex;
    align-items: center;
    color: var(--md-sys-color-outline);
    opacity: 0;
    transition: opacity 120ms;
  }
  .sort-mark svg {
    inline-size: 16px;
    block-size: 16px;
  }
  .sort:hover .sort-mark,
  .sort:focus-visible .sort-mark,
  .sort-mark.on {
    opacity: 1;
  }
  .sort-mark.on {
    color: var(--md-sys-color-primary);
  }
  .rank {
    margin-inline-start: 1px;
    font: var(--md-sys-typescale-label-small-font);
    font-weight: 700;
  }
  .pin-mark {
    display: inline-flex;
    color: var(--md-sys-color-primary);
  }
  .pin-mark svg {
    inline-size: 14px;
    block-size: 14px;
  }
  .head-menu {
    position: absolute;
    inset-inline-end: 6px;
    border-radius: 50%;
    background: var(--table-head);
    opacity: 0;
    transition: opacity 120ms;
  }
  th:hover .head-menu,
  th:focus-within .head-menu,
  .head-menu[aria-expanded="true"] {
    opacity: 1;
  }
  .resize {
    position: absolute;
    inset-block: 10px;
    inset-inline-end: -5px;
    z-index: 2;
    inline-size: 10px;
    border-radius: 5px;
    cursor: col-resize;
    touch-action: none;
  }
  .resize::after {
    content: "";
    position: absolute;
    inset-block: 4px;
    inset-inline-start: 4px;
    inline-size: 2px;
    border-radius: 1px;
    background: var(--md-sys-color-outline-variant);
  }
  .resize:hover::after,
  .resize:focus-visible::after {
    inset-block: -6px;
    background: var(--md-sys-color-primary);
  }

  /* Dragging a column -------------------------------------------------- */
  thead th.dragging {
    z-index: 7;
  }
  th.dragging .head {
    z-index: 6;
    border-radius: var(--md-sys-shape-corner-medium);
    background: var(--md-sys-color-surface-container-highest);
    box-shadow: var(--bb-float-3);
  }

  /* Pinned columns ----------------------------------------------------- */
  .cell-pinned {
    position: sticky;
    z-index: 1;
  }
  .cell-end {
    position: sticky;
    inset-inline-end: 0;
    z-index: 1;
    box-shadow: -1px 0 0 var(--md-sys-color-outline-variant);
  }
  :host(:dir(rtl)) .cell-end {
    box-shadow: 1px 0 0 var(--md-sys-color-outline-variant);
  }
  .scrolled-x .pinned-edge {
    box-shadow: 6px 0 8px -6px rgb(var(--bb-ink) / 0.28);
    clip-path: inset(0 -14px 0 0);
  }
  :host(:dir(rtl)) .scrolled-x .pinned-edge {
    box-shadow: -6px 0 8px -6px rgb(var(--bb-ink) / 0.28);
    clip-path: inset(0 0 0 -14px);
  }

  /* Rows --------------------------------------------------------------- */
  .row {
    cursor: pointer;
  }
  .row td {
    block-size: var(--table-row-height);
  }
  .row td.select,
  .row td.expand,
  .row td.actions {
    padding: 0 4px;
    text-align: center;
  }
  .row:hover td {
    background: color-mix(
      in srgb,
      var(--md-sys-color-on-surface) 4%,
      var(--table-row)
    );
  }
  .row.selected td {
    background: color-mix(
      in srgb,
      var(--md-sys-color-primary) 9%,
      var(--table-row)
    );
  }
  .row.selected:hover td {
    background: color-mix(
      in srgb,
      var(--md-sys-color-primary) 13%,
      var(--table-row)
    );
  }
  .chev {
    display: inline-flex;
    transition: rotate 160ms;
  }
  .chev svg {
    inline-size: 18px;
    block-size: 18px;
  }
  .chev.open svg {
    rotate: 90deg;
  }

  /* Group rows --------------------------------------------------------- */
  .group th {
    position: sticky;
    top: var(--table-header-height);
    z-index: 2;
    block-size: var(--table-group-height);
    padding: 0;
    background: var(--md-sys-color-surface-container);
    font: var(--md-sys-typescale-body-medium-font);
    color: var(--md-sys-color-on-surface);
  }
  .density-compact .group th {
    block-size: 40px;
  }
  .group-inner {
    position: sticky;
    inset-inline-start: 0;
    display: flex;
    align-items: center;
    gap: 16px;
    inline-size: var(--table-visible, 100%);
    padding-inline: 8px 20px;
    box-sizing: border-box;
  }
  .group-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    block-size: 36px;
    padding: 0 10px 0 6px;
    border: 0;
    border-radius: var(--md-sys-shape-corner-small);
    background: transparent;
    color: inherit;
    font: var(--md-sys-typescale-title-small-font);
    cursor: pointer;
  }
  .group-toggle:hover {
    background: color-mix(
      in srgb,
      var(--md-sys-color-on-surface) 8%,
      transparent
    );
  }
  .group-count {
    font: var(--md-sys-typescale-label-medium-font);
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
  }
  .group-summary {
    display: inline-flex;
    gap: 20px;
    margin-inline-start: auto;
    font: var(--md-sys-typescale-body-small-font);
  }

  /* Row detail --------------------------------------------------------- */
  .detail td {
    overflow: visible;
    padding: 0;
    background: var(--md-sys-color-surface-container-low);
    white-space: normal;
    block-size: auto;
  }
  /* The content keeps its place while the table scrolls sideways, over every
     column, and spans only what the reader sees. */
  .detail-inner {
    position: sticky;
    inset-inline-start: 0;
    box-sizing: border-box;
    inline-size: var(--table-visible, 100%);
  }

  /* Empty and error ---------------------------------------------------- */
  /* The state surface is a component; the table only gives it a max width. */
  /* The state sits under the sticky header and keeps the width it is given. */
  .state {
    position: sticky;
    inset-inline-start: 0;
    padding: 8px 24px 32px;
  }
  .state .empty {
    --bb-empty-state-icon-size: 56px;
  }

  /* Footer ------------------------------------------------------------- */
  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    flex-wrap: wrap;
    min-block-size: 56px;
    padding: 6px 12px 6px 16px;
    border-block-start: 1px solid var(--md-sys-color-outline-variant);
    background: var(--table-head);
    font: var(--md-sys-typescale-body-small-font);
    color: var(--md-sys-color-on-surface-variant);
  }
  .footer bolle-pagination {
    inline-size: 100%;
  }

  @media (max-width: 720px) {
    .footer {
      justify-content: space-between;
    }
  }
`;
