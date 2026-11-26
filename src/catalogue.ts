import {
  BolleButton,
  BolleIconButton,
  BolleFloatingActionButton,
  BolleExtendedFab,
  BolleButtonGroup,
} from "./buttons.js";
import {
  BolleCheckbox,
  BolleSwitch,
  BolleRadioButton,
  BolleTextField,
  BolleAutocomplete,
  BolleSearch,
  BolleSegmentedButtons,
} from "./forms.js";
import { BolleSlider, BolleSteps } from "./slider.js";
import { BolleSelect } from "./select.js";
import { BolleDatePicker, BolleTimePicker } from "./pickers.js";
import {
  BolleDialog,
  BolleBottomSheet,
  BolleSideSheet,
  BolleNavigationDrawer,
  BolleSnackbar,
  BolleTooltip,
  BolleFabMenu,
  BolleSplitButton,
} from "./overlays.js";
import {
  BolleAppBar,
  BolleToolbar,
  BolleCard,
  BolleBadge,
  BolleDivider,
  BolleList,
  BolleChip,
} from "./surfaces.js";
import {
  BolleNavigationBar,
  BolleNavigationRail,
  BolleTabs,
} from "./navigation.js";
import { BolleSidebar } from "./sidebar.js";
import { BolleDataTable } from "./data-table.js";
import { BolleKanban } from "./kanban.js";
import { BolleGantt } from "./gantt.js";
import { BolleDag } from "./dag.js";
import { BolleBottomAppBar } from "./bottom-app-bar.js";
import { BolleAvatar } from "./avatar.js";
import { BolleEmptyState } from "./empty-state.js";
import { BollePagination } from "./pagination.js";
import { BolleBreadcrumb } from "./breadcrumb.js";
import { BolleAvatarGroup } from "./avatar-group.js";
import { BolleAppShell } from "./app-shell.js";
import { BolleDashboard, BolleWidget } from "./dashboard.js";
import {
  BolleProgressIndicator,
  BolleLoadingIndicator,
  BolleCarousel,
} from "./feedback.js";
import { BolleTour } from "./tour.js";

export {
  BolleAppShell,
  BolleDashboard,
  BolleWidget,
  BolleDataTable,
  BolleKanban,
  BolleGantt,
  BolleDag,
  BolleBottomAppBar,
  BolleSidebar,
  BolleButton,
  BolleIconButton,
  BolleFloatingActionButton,
  BolleExtendedFab,
  BolleButtonGroup,
  BolleCheckbox,
  BolleSwitch,
  BolleRadioButton,
  BolleTextField,
  BolleAutocomplete,
  BolleSelect,
  BolleSearch,
  BolleDatePicker,
  BolleTimePicker,
  BolleSlider,
  BolleSteps,
  BolleSegmentedButtons,
  BolleDialog,
  BolleBottomSheet,
  BolleSideSheet,
  BolleNavigationDrawer,
  BolleSnackbar,
  BolleTooltip,
  BolleFabMenu,
  BolleSplitButton,
  BolleAppBar,
  BolleToolbar,
  BolleCard,
  BolleBadge,
  BolleDivider,
  BolleList,
  BolleChip,
  BolleNavigationBar,
  BolleNavigationRail,
  BolleTabs,
  BolleProgressIndicator,
  BolleLoadingIndicator,
  BolleCarousel,
  BolleAvatar,
  BolleAvatarGroup,
  BolleBreadcrumb,
  BolleEmptyState,
  BollePagination,
  BolleTour,
};
export type { TourPlacement, TourStep } from "./tour.js";
export {
  parseTourConfig,
  shouldStartTour,
  type TourConfig,
} from "./tour-config.js";
export type { BolleItem, SurfaceTail } from "./shared.js";
export type { CardTail } from "./surfaces.js";
export type {
  SidebarItem,
  SidebarNavigateDetail,
  SidebarExpandDetail,
  SidebarCollapseDetail,
  SidebarResizeDetail,
  SidebarRowContext,
} from "./sidebar.js";
export { SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH } from "./sidebar.js";
export type {
  DataTableColumn,
  DataTableRow,
  DataTableSort,
  DataTableSortDetail,
  DataTableColumnChangeDetail,
  DataTablePageDetail,
  DataTableSelectDetail,
  DataTableExpandDetail,
  DataTableRowDetail,
  DataTableRowActionDetail,
  DataTableRowRenderer,
  DataTableHeaderRenderer,
  DataTableGroupRenderer,
  DataTableStateRenderer,
} from "./data-table.js";
export type {
  KanbanCard,
  KanbanColumn,
  KanbanMoveDetail,
  KanbanMoveBlockedDetail,
  KanbanCardDetail,
  KanbanCardActionDetail,
  KanbanColumnDetail,
  KanbanColumnActionDetail,
  KanbanCollapseDetail,
  KanbanAddDetail,
} from "./kanban.js";
export type {
  GanttTask,
  GanttColumn,
  GanttScale,
  GanttGroup,
  GanttChangeRequest,
  GanttChangeDetail,
  GanttDependencyDetail,
  GanttTaskDetail,
  GanttViewDetail,
  GanttColumnsDetail,
} from "./gantt.js";
export type {
  DagNode,
  DagPort,
  DagEdge,
  DagNodeKind,
  DagGraph,
  DagConnection,
  DagVerdict,
  DagConstraints,
  DagOrientation,
  DagTone,
  DagPosition,
  DagAddRequest,
  DagConnectRequest,
  DagMoveRequest,
  DagDuplicateRequest,
  DagDeleteRequest,
  DagOverrides,
  DagChangeCause,
  DagChangeDetail,
  DagSelectionDetail,
  DagRejectedDetail,
  DagNodeDetail,
} from "./dag.js";
export type {
  AvatarGroupLabels,
  ControlLabels,
  DagLabels,
  GanttLabels,
  ListLabels,
  MenuLabels,
  SidebarLabels,
} from "./localization.js";
export type { KanbanLabels, PaginationLabels } from "./localization.js";
export type { AvatarShape, AvatarSize, AvatarStatus } from "./avatar.js";
export { avatarInitials } from "./avatar.js";
export type { BreadcrumbItem } from "./breadcrumb.js";
export type { AvatarGroupSelectDetail } from "./avatar-group.js";
export type { BreadcrumbLabels } from "./localization.js";
export type { PaginationChangeDetail } from "./pagination.js";
export type {
  AppShellForm,
  AppShellFormDetail,
  SupportingMode,
} from "./app-shell.js";
export { APP_SHELL_MEDIUM, APP_SHELL_EXPANDED } from "./app-shell.js";
export type {
  DashboardLayoutEntry,
  DashboardLayoutDetail,
} from "./dashboard.js";
export {
  DASHBOARD_COLUMNS,
  DASHBOARD_COMPACT_COLUMNS,
  DASHBOARD_MEDIUM_COLUMNS,
} from "./dashboard.js";
export type { ShellLabels } from "./localization.js";
export type { PickerLabels, SupportedLocale } from "./localization.js";
export { supportedLocale } from "./localization.js";
export type * from "./catalogue.types.js";

export const catalogue = {
  "bolle-autocomplete": BolleAutocomplete,
  "bolle-app-bar": BolleAppBar,
  "bolle-badge": BolleBadge,
  "bolle-bottom-sheet": BolleBottomSheet,
  "bolle-button-group": BolleButtonGroup,
  "bolle-button": BolleButton,
  "bolle-card": BolleCard,
  "bolle-carousel": BolleCarousel,
  "bolle-checkbox": BolleCheckbox,
  "bolle-chip": BolleChip,
  "bolle-date-picker": BolleDatePicker,
  "bolle-dialog": BolleDialog,
  "bolle-divider": BolleDivider,
  "bolle-extended-fab": BolleExtendedFab,
  "bolle-fab-menu": BolleFabMenu,
  "bolle-floating-action-button": BolleFloatingActionButton,
  "bolle-icon-button": BolleIconButton,
  "bolle-list": BolleList,
  "bolle-loading-indicator": BolleLoadingIndicator,
  "bolle-navigation-bar": BolleNavigationBar,
  "bolle-navigation-drawer": BolleNavigationDrawer,
  "bolle-navigation-rail": BolleNavigationRail,
  "bolle-progress-indicator": BolleProgressIndicator,
  "bolle-radio-button": BolleRadioButton,
  "bolle-search": BolleSearch,
  "bolle-select": BolleSelect,
  "bolle-segmented-buttons": BolleSegmentedButtons,
  "bolle-side-sheet": BolleSideSheet,
  "bolle-app-shell": BolleAppShell,
  "bolle-dashboard": BolleDashboard,
  "bolle-widget": BolleWidget,
  "bolle-data-table": BolleDataTable,
  "bolle-kanban": BolleKanban,
  "bolle-gantt": BolleGantt,
  "bolle-dag": BolleDag,
  "bolle-bottom-app-bar": BolleBottomAppBar,
  "bolle-avatar": BolleAvatar,
  "bolle-avatar-group": BolleAvatarGroup,
  "bolle-breadcrumb": BolleBreadcrumb,
  "bolle-empty-state": BolleEmptyState,
  "bolle-pagination": BollePagination,
  "bolle-sidebar": BolleSidebar,
  "bolle-slider": BolleSlider,
  "bolle-snackbar": BolleSnackbar,
  "bolle-split-button": BolleSplitButton,
  "bolle-steps": BolleSteps,
  "bolle-switch": BolleSwitch,
  "bolle-tabs": BolleTabs,
  "bolle-text-field": BolleTextField,
  "bolle-time-picker": BolleTimePicker,
  "bolle-toolbar": BolleToolbar,
  "bolle-tooltip": BolleTooltip,
  "bolle-tour": BolleTour,
} as const;

for (const [name, constructor] of Object.entries(catalogue)) {
  if (!customElements.get(name)) customElements.define(name, constructor);
}

declare global {
  interface HTMLElementTagNameMap {
    "bolle-autocomplete": BolleAutocomplete;
    "bolle-app-bar": BolleAppBar;
    "bolle-badge": BolleBadge;
    "bolle-bottom-sheet": BolleBottomSheet;
    "bolle-button-group": BolleButtonGroup;
    "bolle-button": BolleButton;
    "bolle-card": BolleCard;
    "bolle-carousel": BolleCarousel;
    "bolle-checkbox": BolleCheckbox;
    "bolle-chip": BolleChip;
    "bolle-date-picker": BolleDatePicker;
    "bolle-dialog": BolleDialog;
    "bolle-divider": BolleDivider;
    "bolle-extended-fab": BolleExtendedFab;
    "bolle-fab-menu": BolleFabMenu;
    "bolle-floating-action-button": BolleFloatingActionButton;
    "bolle-icon-button": BolleIconButton;
    "bolle-list": BolleList;
    "bolle-loading-indicator": BolleLoadingIndicator;
    "bolle-navigation-bar": BolleNavigationBar;
    "bolle-navigation-drawer": BolleNavigationDrawer;
    "bolle-navigation-rail": BolleNavigationRail;
    "bolle-progress-indicator": BolleProgressIndicator;
    "bolle-radio-button": BolleRadioButton;
    "bolle-search": BolleSearch;
    "bolle-select": BolleSelect;
    "bolle-segmented-buttons": BolleSegmentedButtons;
    "bolle-side-sheet": BolleSideSheet;
    "bolle-app-shell": BolleAppShell;
    "bolle-dashboard": BolleDashboard;
    "bolle-widget": BolleWidget;
    "bolle-data-table": BolleDataTable;
    "bolle-kanban": BolleKanban;
    "bolle-gantt": BolleGantt;
    "bolle-dag": BolleDag;
    "bolle-bottom-app-bar": BolleBottomAppBar;
    "bolle-avatar": BolleAvatar;
    "bolle-avatar-group": BolleAvatarGroup;
    "bolle-breadcrumb": BolleBreadcrumb;
    "bolle-empty-state": BolleEmptyState;
    "bolle-pagination": BollePagination;
    "bolle-sidebar": BolleSidebar;
    "bolle-slider": BolleSlider;
    "bolle-snackbar": BolleSnackbar;
    "bolle-split-button": BolleSplitButton;
    "bolle-steps": BolleSteps;
    "bolle-switch": BolleSwitch;
    "bolle-tabs": BolleTabs;
    "bolle-text-field": BolleTextField;
    "bolle-time-picker": BolleTimePicker;
    "bolle-toolbar": BolleToolbar;
    "bolle-tooltip": BolleTooltip;
    "bolle-tour": BolleTour;
  }
}
