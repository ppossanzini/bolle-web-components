import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import archive from "@tabler/icons/outline/archive.svg?raw";
import arrowLeft from "@tabler/icons/outline/arrow-left.svg?raw";
import arrowRight from "@tabler/icons/outline/arrow-right.svg?raw";
import markdown from "@tabler/icons/outline/markdown.svg?raw";
import refresh from "@tabler/icons/outline/refresh.svg?raw";
import rulerMeasure from "@tabler/icons/outline/ruler-measure.svg?raw";
import arrowDown from "@tabler/icons/outline/arrow-down.svg?raw";
import arrowUp from "@tabler/icons/outline/arrow-up.svg?raw";
import bold from "@tabler/icons/outline/bold.svg?raw";
import briefcase from "@tabler/icons/outline/briefcase.svg?raw";
import chevronDown from "@tabler/icons/outline/chevron-down.svg?raw";
import clipboard from "@tabler/icons/outline/clipboard.svg?raw";
import copy from "@tabler/icons/outline/copy.svg?raw";
import dashboard from "@tabler/icons/outline/layout-dashboard.svg?raw";
import fileInvoice from "@tabler/icons/outline/file-invoice.svg?raw";
import folder from "@tabler/icons/outline/folder.svg?raw";
import help from "@tabler/icons/outline/help.svg?raw";
import heart from "@tabler/icons/outline/heart.svg?raw";
import home from "@tabler/icons/outline/home.svg?raw";
import inbox from "@tabler/icons/outline/inbox.svg?raw";
import italic from "@tabler/icons/outline/italic.svg?raw";
import menu from "@tabler/icons/outline/menu-2.svg?raw";
import moon from "@tabler/icons/outline/moon.svg?raw";
import packageIcon from "@tabler/icons/outline/package.svg?raw";
import palette from "@tabler/icons/outline/palette.svg?raw";
import pin from "@tabler/icons/outline/pin.svg?raw";
import plus from "@tabler/icons/outline/plus.svg?raw";
import plane from "@tabler/icons/outline/plane.svg?raw";
import planeOff from "@tabler/icons/outline/plane-off.svg?raw";
import scissors from "@tabler/icons/outline/scissors.svg?raw";
import search from "@tabler/icons/outline/search.svg?raw";
import settings from "@tabler/icons/outline/settings.svg?raw";
import star from "@tabler/icons/outline/star.svg?raw";
import sun from "@tabler/icons/outline/sun.svg?raw";
import tool from "@tabler/icons/outline/tool.svg?raw";
import sunHigh from "@tabler/icons/outline/sun-high.svg?raw";
import trash from "@tabler/icons/outline/trash.svg?raw";
import underline from "@tabler/icons/outline/underline.svg?raw";
import users from "@tabler/icons/outline/users.svg?raw";
import mapPin from "@tabler/icons/outline/map-pin.svg?raw";
import alertTriangle from "@tabler/icons/outline/alert-triangle.svg?raw";
import alertCircle from "@tabler/icons/outline/alert-circle.svg?raw";
import check from "@tabler/icons/outline/check.svg?raw";
import gauge from "@tabler/icons/outline/gauge.svg?raw";
import building from "@tabler/icons/outline/building.svg?raw";
import chartBar from "@tabler/icons/outline/chart-bar.svg?raw";
import clock from "@tabler/icons/outline/clock.svg?raw";
import volume from "@tabler/icons/outline/volume.svg?raw";
import wifi from "@tabler/icons/outline/wifi.svg?raw";
import wifiOff from "@tabler/icons/outline/wifi-off.svg?raw";
import x from "@tabler/icons/outline/x.svg?raw";

const icons: Record<string, string> = {
  archive,
  "arrow-left": arrowLeft,
  "arrow-right": arrowRight,
  markdown,
  refresh,
  "ruler-measure": rulerMeasure,
  "arrow-down": arrowDown,
  "arrow-up": arrowUp,
  bold,
  briefcase,
  "chevron-down": chevronDown,
  clipboard,
  copy,
  "file-invoice": fileInvoice,
  "layout-dashboard": dashboard,
  folder,
  help,
  heart,
  home,
  inbox,
  italic,
  "menu-2": menu,
  moon,
  package: packageIcon,
  palette,
  pin,
  plane,
  "plane-off": planeOff,
  plus,
  scissors,
  search,
  settings,
  star,
  sun,
  "sun-high": sunHigh,
  tool,
  trash,
  underline,
  users,
  "map-pin": mapPin,
  "alert-triangle": alertTriangle,
  "alert-circle": alertCircle,
  "check": check,
  "gauge": gauge,
  "building": building,
  "chart-bar": chartBar,
  "clock": clock,
  volume,
  wifi,
  "wifi-off": wifiOff,
  x,
};

/** Tabler icon as an inline SVG so `currentColor` and the 24px sizing apply. */
export const ti = (name: keyof typeof icons | string) => {
  const svg = icons[name];
  if (!svg) throw new Error(`Unknown Tabler icon: ${name}`);
  return html`${unsafeSVG(svg)}`;
};
