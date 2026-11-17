import { css, html, svg, unsafeCSS } from "lit";

// Path data from Tabler Icons (outline, MIT).
const CHECK = ["M5 12l5 5l10 -10"];
const X = ["M18 6l-12 12", "M6 6l12 12"];
const CHEVRON_DOWN = ["M6 9l6 6l6 -6"];
const SIDEBAR_FRAME = [
  "M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z",
  "M9 4v16",
];
const ARROW_UP = ["M12 5l0 14", "M18 11l-6 -6", "M6 11l6 -6"];
const ARROW_DOWN = ["M12 5l0 14", "M18 13l-6 6", "M6 13l6 6"];
const ARROWS_SORT = ["M3 9l4 -4l4 4", "M7 5l0 14", "M21 15l-4 4l-4 -4", "M17 19l0 -14"];
const DOTS_VERTICAL = ["M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M11 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"];
const CHEVRON_RIGHT = ["M9 6l6 6l-6 6"];
const CHEVRON_LEFT = ["M15 6l-6 6l6 6"];
const CHEVRONS_LEFT = ["M11 7l-5 5l5 5", "M17 7l-5 5l5 5"];
const CHEVRONS_RIGHT = ["M7 7l5 5l-5 5", "M13 7l5 5l-5 5"];
const GRIP_VERTICAL = ["M9 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M9 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M9 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M13 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M13 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M13 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"];
const PIN = ["M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4", "M9 15l-4.5 4.5", "M14.5 4l5.5 5.5"];
const PUSH_PIN_OFF = ["M9 4.5l6 0", "M14 4.5v3.5l3 3v1.5l-6 0", "M10 9.5l-3 3v1.5h6", "M12 14.5v5", "M4 4l16 16"];
const ALERT_TRIANGLE = ["M12 9v4", "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z", "M12 16h.01"];
const DATABASE_OFF = ["M12 6v6", "M6 6v6", "M18 6v6", "M6 12v6", "M18 12v6", "M3 3l18 18"];
const FILTER_OFF = ["M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-5.414 -5.414a2 2 0 0 1 -.586 -1.414v-2.172z"];
const COLUMNS = ["M4 4h6v16h-6z", "M14 4h6v16h-6z", "M4 4v16", "M20 4v16"];
const LAYOUT_ROWS = ["M4 4h16v6h-16z", "M4 14h16v6h-16z"];
const DENSITY_MEDIUM = ["M4 6h16", "M4 12h16", "M4 18h16"];
const DENSITY_SMALL = ["M4 8h16", "M4 16h16"];
const PLUS = ["M12 5v14", "M5 12h14"];

const SIDEBAR_COLLAPSE = [...SIDEBAR_FRAME, "M15 10l-2 2l2 2"];
const SIDEBAR_EXPAND = [...SIDEBAR_FRAME, "M14 10l2 2l-2 2"];

const tabler = (paths: string[]) => html`<svg
  class="tabler-icon"
  viewBox="0 0 24 24"
  width="1em"
  height="1em"
  aria-hidden="true"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  ${paths.map((d) => svg`<path d=${d}></path>`)}
</svg>`;

export const checkIcon = () => tabler(CHECK);
export const closeIcon = () => tabler(X);
export const chevronDownIcon = () => tabler(CHEVRON_DOWN);
export const sidebarCollapseIcon = () => tabler(SIDEBAR_COLLAPSE);
export const sidebarExpandIcon = () => tabler(SIDEBAR_EXPAND);
export const sortArrowUpIcon = () => tabler(ARROW_UP);
export const sortArrowDownIcon = () => tabler(ARROW_DOWN);
export const sortNoneIcon = () => tabler(ARROWS_SORT);
export const rowMenuIcon = () => tabler(DOTS_VERTICAL);
export const expandIcon = () => tabler(CHEVRON_RIGHT);
export const previousIcon = () => tabler(CHEVRON_LEFT);
export const nextPageIcon = () => tabler(CHEVRON_RIGHT);
export const firstPageIcon = () => tabler(CHEVRONS_LEFT);
export const lastPageIcon = () => tabler(CHEVRONS_RIGHT);
export const columnGripIcon = () => tabler(GRIP_VERTICAL);
export const pinIcon = () => tabler(PIN);
export const unpinIcon = () => tabler(PUSH_PIN_OFF);
export const alertIcon = () => tabler(ALERT_TRIANGLE);
export const databaseOffIcon = () => tabler(DATABASE_OFF);
export const filterOffIcon = () => tabler(FILTER_OFF);
export const columnsIcon = () => tabler(COLUMNS);
export const groupIcon = () => tabler(LAYOUT_ROWS);
export const densityComfortableIcon = () => tabler(DENSITY_MEDIUM);
export const densityCompactIcon = () => tabler(DENSITY_SMALL);
export const plusIcon = () => tabler(PLUS);

/** Tabler check as a CSS mask, for ::before content painted with currentColor. */
export const checkMask = unsafeCSS(
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${CHECK[0]}"/></svg>`,
  )}")`,
);

export const checkMaskStyles = css`
  content: "";
  display: inline-block;
  inline-size: 1em;
  block-size: 1em;
  background-color: currentColor;
  mask: ${checkMask} center / contain no-repeat;
`;
