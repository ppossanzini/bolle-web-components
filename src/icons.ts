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
// Path data from Tabler Icons (outline, MIT).
const REFRESH = ["M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4", "M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"];
const ALERT_TRIANGLE = ["M12 9v4", "M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.871l-8.106 -13.534a1.914 1.914 0 0 0 -3.274 0z", "M12 16h.01"];
const DATABASE_OFF = ["M12 6v6", "M6 6v6", "M18 6v6", "M6 12v6", "M18 12v6", "M3 3l18 18"];
const FILTER_OFF = ["M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-5.414 -5.414a2 2 0 0 1 -.586 -1.414v-2.172z"];
const COLUMNS = ["M4 4h6v16h-6z", "M14 4h6v16h-6z", "M4 4v16", "M20 4v16"];
const LAYOUT_ROWS = ["M4 4h16v6h-16z", "M4 14h16v6h-16z"];
const DENSITY_MEDIUM = ["M4 6h16", "M4 12h16", "M4 18h16"];
const DENSITY_SMALL = ["M4 8h16", "M4 16h16"];
const PLUS = ["M12 5v14", "M5 12h14"];
const ZOOM_IN = ["M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0", "M7 10l6 0", "M10 7l0 6", "M21 21l-6 -6"];
const ZOOM_OUT = ["M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0", "M7 10l6 0", "M21 21l-6 -6"];
const FOCUS_CENTERED = ["M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M4 8v-2a2 2 0 0 1 2 -2h2", "M4 16v2a2 2 0 0 0 2 2h2", "M16 4h2a2 2 0 0 1 2 2v2", "M16 20h2a2 2 0 0 0 2 -2v-2"];
const ARROW_BACK_UP = ["M9 14l-4 -4l4 -4", "M5 10h11a4 4 0 1 1 0 8h-1"];
const ARROW_FORWARD_UP = ["M15 14l4 -4l-4 -4", "M19 10h-11a4 4 0 1 0 0 8h1"];
const HIERARCHY_2 = ["M10 3h4v4h-4l0 -4", "M3 17h4v4h-4l0 -4", "M17 17h4v4h-4l0 -4", "M7 17l5 -4l5 4", "M12 7l0 6"];
const KEYBOARD = ["M2 8a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2l0 -8", "M6 10l0 .01", "M10 10l0 .01", "M14 10l0 .01", "M18 10l0 .01", "M6 14l0 .01", "M18 14l0 .01", "M10 14l4 .01"];
const LOCK = ["M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6", "M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0", "M8 11v-4a4 4 0 1 1 8 0v4"];
const TOPOLOGY_STAR_3 = ["M10 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0", "M18 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0", "M10 5a2 2 0 1 0 -4 0a2 2 0 0 0 4 0", "M6 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0", "M18 19a2 2 0 1 0 -4 0a2 2 0 0 0 4 0", "M14 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0", "M22 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0", "M6 12h4", "M14 12h4", "M15 7l-2 3", "M9 7l2 3", "M11 14l-2 3", "M13 14l2 3"];
const BOX = ["M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5", "M12 12l8 -4.5", "M12 12l0 9", "M12 12l-8 -4.5"];

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
export const refreshIcon = () => tabler(REFRESH);
export const zoomInIcon = () => tabler(ZOOM_IN);
export const zoomOutIcon = () => tabler(ZOOM_OUT);
export const fitViewIcon = () => tabler(FOCUS_CENTERED);
export const undoIcon = () => tabler(ARROW_BACK_UP);
export const redoIcon = () => tabler(ARROW_FORWARD_UP);
export const layoutIcon = () => tabler(HIERARCHY_2);
export const keyboardIcon = () => tabler(KEYBOARD);
export const lockIcon = () => tabler(LOCK);
export const graphIcon = () => tabler(TOPOLOGY_STAR_3);
export const boxIcon = () => tabler(BOX);

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
