[简体中文](README.zh-CN.md)

# Bolle Material Web Components

A material based web component library, published as `bolle-web-components`.

Documentation site: <https://ppossanzini.github.io/bolle-web-components/>
(Italian, English, French and Simplified Chinese).

## Bolle layer

Material 3 is the structure; Bolle is the skin. Component names, colour roles
and the type scale stay M3. The character comes from `--bb-*` tokens in
`tokens.css`, which can be tuned or switched off.

| Sign       | Where                                                                                                                                                                                                                                                                                                                                                                   | Tokens                                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tail       | The narrow corner points at where the surface comes from: menus, tooltips and FAB menu at the opener; snackbar and cards keep it bottom-start; a link card below the content turns it top, on the side opposite to where it leads (`tail`). It is optional: `tail="none"` on a card, menu, tooltip, FAB menu or snackbar leaves four equal corners with the same radius | `--bb-radius`, `--bb-tail`, `--bb-card-tail`                                                                                                         |
| Nesting    | A surface inside another keeps the container radius minus the padding the container applies, never below 2px: a card in a dialog, a sheet or another card, media in a card, menu items, picker fields. A container publishes the value as `--bb-inset-radius` and the inner surface inherits it; the tail never exceeds the corner it belongs to                        | `--bb-inset-radius`, `--md-comp-card-padding`, `--md-comp-dialog-padding`                                                                            |
| Film       | Ring around the focus outline and selected chips; FAB wash. Decorative only: the solid outline and container colour carry the state                                                                                                                                                                                                                                     | `--bb-film`, `--bb-film-1…4`, `--bb-ring-width`, `--bb-ring-gap`                                                                                     |
| Squish/pop | Buttons squish (1.1 × 0.86) and wobble back; floating surfaces inflate from the tail and pop on close; basic dialogs keep a near-imperceptible bob (2px, ±0.15°) after opening                                                                                                                                                                                          | `--bb-squish`, `--bb-tension`, `--bb-inflate-duration`, `--bb-pop-duration`, `--bb-bob-distance`, `--bb-bob-duration`                                |
| Float      | Soft ink shadows that turn violet at higher levels; the surface reflection is a crisp mark one corner radius away from the top-right corner (`--bb-shine-inset`, `--bb-shine-size`), while the hover reflection is a sharp arc that follows the control corner, held off the border (`--bb-glint-radius`, `--bb-glint-gap`, `--bb-glint-width`)                                                                                                                                                                                                                        | `--bb-float-1…5`, `--bb-highlight`, `--bb-shine-inset`, `--bb-shine-size`, `--bb-glint-radius`, `--bb-glint-gap`                                           |
| Liquid     | Segmented buttons move one indicator between segments with the spring curve; the loading indicator is rising, merging bubbles                                                                                                                                                                                                                                           | —                                                                                                                                                    |
| Glass      | Menus and FAB actions are translucent with blur; opaque without `backdrop-filter`, on slow devices and with reduced transparency                                                                                                                                                                                                                                        | `--bb-glass-opacity`, `--bb-glass-blur`                                                                                                              |
| Scrollbars | Every scroll area inside a component has no arrow buttons, so track and thumb ends are fully round; the track keeps a gap from the container edges; Firefox keeps its native thin bar with the same colours                                                                                                                                                             | `--bb-scrollbar-size`, `--bb-scrollbar-inset`, `--bb-scrollbar-margin`, `--bb-scrollbar-track`, `--bb-scrollbar-thumb`, `--bb-scrollbar-thumb-hover` |

Colour roles are generated from the seed `#5B4CF0` by `npm run colors`
(tonal spot, with the primary palette at full seed chroma). Selected icons fill
(`--md-icon-fill: 1`). `variant="accent"` on `bolle-button` uses the rare
"Scoppio" accent `--bb-accent`. Typefaces: Fredoka 600 for display and
headline-large, Figtree for text and UI, JetBrains Mono for code. With
`prefers-reduced-motion` only fades remain: no wobble, pop or dialog bob.

Text inside `bolle-*` components cannot be selected with the pointer
(`user-select: none` on the host); `input`, `textarea` and editable content stay
selectable. This also applies to content slotted into cards and dialogs.

## Foundations

The foundations layer covers:

| Foundation    | Tokens and page content                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| Design tokens | Reference, system and component classes; CSS mapping keeps the `comp` segment                                       |
| Colour        | 22 container/content role pairs plus outline and outline-variant, light and dark, with hex values read from the DOM |
| Shape         | 10 corner steps including Expressive increased and extra-extra-large, plus 5 directional variants                   |
| Elevation     | Levels 0–5, tonal tints and the scrim role at 32%                                                                   |
| Motion        | 16 durations, 10 easings, 6 spring damping/stiffness pairs and their sampled `linear()` easings                     |
| States        | Hover 8%, focus 10%, pressed 10%, dragged 16%, disabled 38% layer; disabled container 12%, content 38%, outline 12% |
| Layout        | Breakpoints 599/839/1199/1599, margins 16/24, pane spacer 24, reading measure 40–60ch                               |
| Icons         | Sizes 20/24/40/48 and the delivery decision                                                                         |

Values come from the recorded snapshot: role tones of token set 34.0.21 and the
baseline palette hex values. `on-primary-container`,
`on-secondary-container`, `on-tertiary-container` and `on-error-container` now use
tone 30 in light mode (the 34.0.21 value), not tone 10.

Project projections and open items:

- Elevation shadows are a projection of the dp levels: the sources publish no
  offset, blur or spread values. Tonal elevation uses `color-mix` with `primary`.
- Medium and high contrast are generated by `npm run colors` and appended to
  `src/tokens.css` as `data-contrast="medium"` and `data-contrast="high"`
  presets, in light and dark. The standard level stays the default.
- Springs are numeric tokens, not CSS timing functions. `npm run motion` samples
  each damping/stiffness pair into a `linear()` easing plus its settle time, and
  the floating surfaces use the default spatial and fast spatial springs for
  entry and exit.
- The grid column count, column width and gutter are project decisions: the M3
  sources publish no table for them.
- Material Symbols is not bundled. Components and the demo use text glyphs, so
  icon delivery remains a project decision.

## Typography

Run `npm run typography` to generate the 30 Material type styles from
`scripts/typography.mjs`. Build and development commands also generate them.
Load `tokens.css` before `typography.css`. Keep the adjacent `fonts/` directory:
Figtree 400–700, Fredoka 500–700 and JetBrains Mono 400–500 are served locally,
with their licences in `fonts/LICENSE`. All subsets supplied by the pinned
Fontsource packages are copied with their original Unicode ranges, and the
browser requests only matching subsets. Scripts outside these fonts use the
operating system fallback fonts; no bundled Arabic, Indic or East Asian font
coverage is claimed.

Families map to four reference tokens: `--md-ref-typeface-display` (Fredoka,
weight 600, used by display and headline-large), `--md-ref-typeface-brand` and
`--md-ref-typeface-plain` (Figtree), and `--md-ref-typeface-code`
(JetBrains Mono). Sizes, line heights and tracking stay those of the M3 scale.

Use classes such as `md-type-body-large` and
`md-type-emphasized-body-large`, or the per-style CSS custom properties.
Font shorthand and tracking are separate: custom components must also apply
`letter-spacing: var(--md-sys-typescale-body-large-tracking)`.
Brand and plain font-family tokens can be overridden independently.
The implementation uses the static weights in token snapshot 34.0.21:
emphasized title medium/small and labels use 700, not the differing variable
axis value 600. No variable-font axes are claimed.
The demo contains specimens of all 30 styles. Generated CSS is never edited
manually.
Demo role mapping: page heading uses display large, section headings headline
medium, article headings title large, paragraphs and status body large, buttons
label large, metadata label medium and specimen captions body small.
Each mapping applies both font and tracking tokens and preserves semantic HTML.

### Languages, figures and links

`lang` selects a project language-height policy. Listed small-category languages
use factor 1, the default/medium category 1.07, Burmese and Telugu 1.3, and Urdu
uses the conservative extra-large factor 2. These are project adaptations from
approximate reference ratios, not verified per-role Material line-height tokens.
Set `data-language-height="small|medium|large|extra-large"` to override the
category, particularly when the actual font/script differs. The built-in small
language list is illustrative, not a complete language detector.
Font metrics are redeclared at explicit language boundaries; font-family reference
tokens remain inheritable. Shadow components inherit the context from their host.

`.md-numerals-tabular` applies lining tabular figures without changing the text
role. Use it for clocks, changing values and numeric table cells.
`.md-text-link` underlines links and applies the primary colour role;
`.md-text-link--tertiary` changes it to tertiary. Focus has a visible outline.
Menu navigation actions keep their component styling, not inline text-link styling.
The demo shows document content, metadata, a numeric summary, times, a data table,
links and multilingual passages in addition to the 30 type specimens.

### Typography accessibility checks

Chromium checks cover language-height selection, standard light/dark foreground
and background pairs, 200% root text size, custom line/letter/word/paragraph
spacing, and reflow at 320, 640 and 1280 CSS pixels. Text role pairs tested exceed
4.5:1. These checks do not certify every composited state, user theme or font.
Browser zoom, screen readers and real-device/script shaping remain manual checks.
Do not treat fallback availability or this automated sample as full multilingual
or WCAG conformance.

First implementation: `bolle-menu`, built with Lit 3.3.3 and TypeScript.
The library has no Material component dependency. The ES module bundles Lit and
works in HTML without an application build step.

## Framework integration

The library is consumed as Custom Elements. The integration guides show an
exhaustive Vue and React example for every component, covering attributes,
slots, events, imperative methods and forms. Each guide is available in four
languages:

- Italiano: [Vue 3](docs/it/vue.md) · [React](docs/it/react.md)
- English: [Vue 3](docs/en/vue.md) · [React](docs/en/react.md)
- Français: [Vue 3](docs/fr/vue.md) · [React](docs/fr/react.md)
- 中文: [Vue 3](docs/zh/vue.md) · [React](docs/zh/react.md)

Index: [docs/README.md](docs/README.md).

The live documentation site is in `site/`. It opens on a presentation page
(`#/`) built from the identity boards in `artwork/`: the bolle mark and
`bolle` wordmark, hero, the three signs (tail, film, squish), a showcase of real
components, a seed picker that re-themes the whole site, a CSS example and the
install command. The mark is drawn in CSS (`bolleMark` in `site/landing.ts`):
film ring 1/14 of the side, primary core and highlight; below 24px only the
tailed shape remains, which is also the favicon.

The **Foundations** page (`#/foundations`) explains the Bolle layer section by
section (tail, film, highlight and float, motion, glass, colour, typography,
rules). Each section has live components to try (menu and tooltip tails, focus
and selection rings, hover highlight, squish, a floating dialog, the liquid
segmented indicator, the bolle loader), the spring curve drawn from
`--bb-tension`, and a table of its `--bb-*` tokens with values read from the
page.

The component catalogue is at `#/overview`. It lists every component, shows a
preview, and generates the matching Vue and React snippet for the current state.
The component configuration is split in two places. The size tokens sit next to
the preview in a **Dimensioni** panel that stays visible while scrolling, so an
edit shows its effect immediately. Theme, template, the component parameters and
the colour, shape, typography and remaining tokens open in a side sheet from the
**Configura** action above the preview or from the app bar settings button;
selecting another component closes the sheet.

Both panels list only the tokens the rendered instance really uses: the site
evaluates the `:host(...)` conditions against the element's current attributes
and drops declarations a later rule overrides, so a plain button never shows FAB
tokens. Each row uses a technical layout: monospace token name, declared default,
a number field for the current value with the unit beside it, and a measurement
bar scaled to the pixel value. Pixel tokens use `input type="number"`: arrows step
by one, Shift with the arrows or the wheel steps by ten, the wheel only edits a
focused field and scrolls the panel otherwise; a token whose value is not a pixel
length keeps a text field. The override is emitted as a rule scoped to the
component tag, and a token with an override shows a reset control. Size tokens
stay in the **Dimensioni** panel, every other token in the **Token del componente**
section of the sheet; colours, corner radii and typography keep their own
subgroups inside it.

While the **Dimensioni** panel is open, the preview carries SVG measurement lines
for every editable size token. Each token gets one line, taken from the outermost
element it sizes, and a number and a colour; the badge with the number, the value
and the short token name sits in a side gutter of the preview, stacked so the
badges never overlap, and a dashed leader joins it to its line. The line is
accepted only when overriding the token really changes the used value, so an
overridden declaration draws nothing, and its axis comes from the longhand that
changes: `gap` follows the direction the flex layout separates items by, and
padding is drawn inside the box it pads. A gap with fewer than two rendered items
and a `min`/`max` the box is not sitting on draw nothing either: the declaration
is live, the rendering does not change. The same number and colour appear on the
token row, and the rows are sorted by number. Hovering a row dims every other
line and outlines the element that token sizes. The **Nascondi quote** control in
the panel header removes the overlay.

A **Template** selector scales every `--md-comp-*` spacing and size token at the
root to three quarters: padding, margin, gap, inset, height, width, minimum and
maximum sizes, targets and spaces between elements. The **Ariosa** option
restores the declared values, the **Compatta** option writes the scaled values
as inline root overrides and removes them when switched back. Corner radii,
colours, typography, elevations and state opacities are excluded, so the
comparison covers density alone. The selector appears in the configuration sheet
and at the top of the **Design tokens** page.

The **Design tokens** page edits the graphic foundation: all M3 semantic colour
roles (47, grouped by family) chosen from the Material palette published on
materialui.co/colors, seven HCT theme presets (Viola `#5B4CF0` is the site
default, followed by Laguna, Corallo and Bosco from the identity, then Oceano,
Ambra and Grafite), the full HCT generation of the colour scheme from the current
primary with standard/medium/high contrast, corner radii, title and body font
families (Figtree by default), and
the base text size. A preset regenerates both the light and the dark palette;
the selector is available on the tokens page and at the top of the component
configuration drawer. Values are kept separately for light and dark themes,
apply to the whole site, and are exported as a CSS `:root` snippet. The compact
density scales every `--md-comp-*` length token to three quarters; the export
carries those values in a `:root[data-density="compact"]` block, and the JSON
adds them under `dimensions`. An application reproduces the compact UI by
setting `data-density="compact"` on the root, or by copying the block into its
own `:root`. Example icons come from Tabler Icons.

Each component page also shows the tokens that component consumes, detected
from the rules its shadow DOM actually matches for the current attribute set.
Colours and corner radii map to the global theme values; the `--md-comp-*` detail
tokens are listed with their declared value from `tokens.css` and edited with an
exact text field. An override is emitted as a rule
scoped to the component tag, for example
`bolle-menu { --md-comp-menu-item-vertical-padding: 20px; }`, so it applies to
every instance of that component without creating a per-instance token copy.
Typography scale names are listed for reference because only the two font
families and the base size are editable.

The dropdown used by long configuration lists (`site/docs-select.ts`) is a site
pattern composed from `bolle-button` and `bolle-menu`, not an entry in the
library catalogue.

```sh
npm run dev:site     # http://127.0.0.1:5174/
npm run build:site   # static site in dist-site/
```

Each guide states the platform rules that matter: property versus attribute
binding, `addEventListener` for custom events, typed template refs in Vue and
`useBolleEvent`/`useBolleProps` in React, and the JSX type declarations.
Code excerpts are identical across the three editions; only the prose is
translated.

## Run and build

```sh
npm ci
npm run dev          # component catalogue
npm run dev:site     # documentation site with live configuration and code
npm run build
npm run build:site   # static documentation site in dist-site/
npm run i18n:check   # site strings missing or unused per language
npm pack --dry-run
```

Every push to `master` builds the documentation site and publishes it to
GitHub Pages through `.github/workflows/pages.yml` (type-check, translation
check, `build:site`). The site uses relative asset URLs, so it works under the
`/bolle-web-components/` path. In the repository settings, Pages must use
**GitHub Actions** as its source.

The development page is a full catalogue: foundations with the 30 type styles,
then every component group with each implemented variant labelled, then the
verification notes. It offers dark mode and right-to-left layout. Components with
an open Material variant state the gap in its note, so presence in the page is
never presented as full conformance.

## Variant and layout review

The catalogue page was rebuilt around one container width, one spacing scale and
one variant label per configuration, so every implemented variant is visible and
named. Corrections applied in this review:

- Buttons: toggle unselected uses the outlined look; connected groups wrap at
  narrow widths instead of overflowing; labels never break inside a button.
- Segmented buttons: connected geometry with checkmark on the selected segment;
  the native radio is visually hidden but still focusable.
- Chips: visible container stays at 32px while the hit area reaches 48px; filter
  chips show a checkmark, input chips accept an avatar; elevated style added.
- Text fields: leading/trailing icon slots, prefix, suffix, counter and required
  marker; input text uses the body-large role in every field.
- Sliders: one track with native inputs overlaid, so the range variant has two
  handles on the same track; label body-medium, value bolle label-medium above
  the handle, stop markers layered under the active fill; vertical orientation
  uses a native vertical fallback.
- Navigation bar and rail: 80px bar, 64x32 and 56x32 active indicators, 24px
  icons, 12px labels, rail items at 56px; icons are inline SVG.
- Date and time pickers: one field container with the trigger inside, value
  formatted with Intl (dd/mm/yy, 12/24-hour), readonly field that opens the
  picker, equal-width range fields, month list pre-selected, clock icon for time.
- Demo icons come from Tabler Icons as inline SVG, so they inherit currentColor
  and do not load an icon webfont. `--md-ref-typeface-icons` stays available for
  projects that deliver an icon font.
- Split button: primary and menu parts share one silhouette, outer full corners
  and inner 4px corners, mirrored in RTL.
- Component type roles normalised: tabs title-small 14, card and list supporting
  text body-medium 14, app bar subtitle body-medium 14, FAB icon 24, large
  extended FAB title-large 22, fab menu items label-large 14, carousel counter
  label-medium 12.
- Dividers: full, inset, inset-start, inset-end and vertical.
- Cards: media slot rendered; horizontal orientation with a fixed media column.
- Lists: segmented style with separated rounded rows and selected state.
- App bars: surface background, padding, bottom-aligned flexible titles and
  headline sizes per variant; search bar fills the app bar.
- Navigation: rail labels do not wrap; rail items use the 56px height; flexible
  bar with horizontal item layout.
- Overlays: standard bottom sheet, side sheet and drawer are fixed at their edge;
  side sheet supports a detached frame; bottom sheet supports a drag handle;
  the dialog accepts `full-screen` as well as `fullscreen`.
- Pickers: one calendar/clock affordance per field (the native indicator is
  hidden), range fields aligned, docked duplicate icon removed.
- Carousel: hero, multi-browse, uncontained and center-aligned-hero use distinct
  item widths.
- Indeterminate progress: sliding linear bar and animated circular arc; loading
  indicator morphs with reduced-motion fallback.

### Behaviour audit round

Every catalogue entry was checked again against the local component and
foundation snapshots, and the following behaviours were added.

- Menu: grouped entries with `role="group"` and a group label, density offset in
  4dp steps through `density`, and dismissal on window blur removed in favour of
  pointer and focus dismissal.
- Tabs: scrollable strip with previous/next controls, disabled edge states, a
  `ResizeObserver` that keeps the edge state accurate, and no movable indicator.
- Lists: `selection="single|multiple"` with listbox/option semantics, selection
  tint, hover state, expandable rows with a disclosure control and nested lists,
  and an `expand` event.
- Search: suggestion combobox with `aria-activedescendant`, filtered options,
  arrow keys, Enter, Escape, optional debounce and a `suggest` event.
- Split button: `size` follows the five-step button scale.
- Tooltip: plain offset 4dp, rich offset 8dp, rich tooltip persists until an
  outside press, Escape or its dismiss control.
- Snackbar: message queue plus entry motion with a reduced-motion opt-out.
- Slider: inset start/end icons, capped track width, and a rotated custom
  vertical track instead of the native fallback.
- Progress: determinate track rebuilt on a custom surface with the 4dp stop
  indicator, plus an Expressive wavy track that clips determinate values and
  animates when indeterminate.
- Checkbox, radio and switch: custom M3 controls with check path, indeterminate
  dash, radio ring, error border and focus ring; the switch draws a real handle
  with state-dependent 16/24dp size and optional off/on icons.
- Date picker: inline docked calendar sharing the modal calendar view.
- Time picker: pointer-angle drag on the dial, with the ring pinned for the
  duration of the gesture and automatic advance from hour to minute.
- Dialog, sheet and drawer: entry motion per placement with a reduced-motion
  opt-out.

Still missing against the guidelines, and stated in the page: numeric-input date
picker and time picker, exact seven-shape loading morph, movable Expressive tab
indicator, dialog container transform, carousel item morph, extended FAB
collapse on scroll and icon delivery through Material Symbols (the demo uses
inline Tabler SVG).

## HTML usage

```html
<link rel="stylesheet" href="./dist/tokens.css" />
<button id="trigger" aria-haspopup="menu">Actions</button>
<bolle-menu id="menu" menu-label="Document actions"></bolle-menu>
<script type="module">
  import "./dist/bolle.js";
  const trigger = document.querySelector("#trigger");
  const menu = document.querySelector("#menu");
  menu.items = [
    { id: "open", label: "Open" },
    { separator: true },
    { id: "archive", label: "Archive", disabled: true },
  ];
  trigger.addEventListener("click", () => menu.show(trigger));
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      menu.show(trigger, { last: event.key === "ArrowUp" });
    }
  });
  menu.addEventListener("menu-select", (event) => {
    console.log(event.detail.item.id, event.detail.selectedIds);
  });
</script>
```

Supply translated labels from the consuming application. No HTML strings are
accepted as labels or icons. The `icon` property accepts decorative text only.
Components use Shadow DOM. CSS custom properties inherit from the document;
public anatomy uses `::part(...)` and named slots. The documentation page lists
the public slots and parts for every component and copies usage examples with
the page. Internal classes are not a public customization contract.

Use component token overrides for geometry and system colour roles for theme.
Set `data-theme="dark"` on the root for the supplied dark theme.

```css
bolle-button::part(control) {
  padding-inline: var(--md-comp-button-leading-space, 24px);
}
```

```html
<bolle-button>
  <span slot="icon">+</span>
  Save
  <span slot="trailing-icon">⌘S</span>
</bolle-button>
```

## Public contract

| Property / attribute               | Values                                                       |
| ---------------------------------- | ------------------------------------------------------------ |
| `items` (JavaScript property only) | `MenuEntry[]`, immutable replacement on change               |
| `variant`                          | `vertical` (default), `baseline`                             |
| `colorScheme` / `color-scheme`     | `standard` (default), `vibrant`                              |
| `selectionMode` / `selection-mode` | `none`, `single`, `multi`                                    |
| `menuLabel` / `menu-label`         | Required localized accessible name                           |
| `quick`                            | Skip entry animation                                         |
| `open`                             | Read-only open state                                         |
| `selectedIds`                      | Read-only array of selected action ids                       |
| `show(anchor, options?)`           | Async; optional `last`, or `x` and `y` for context placement |
| `close(restoreFocus = true)`       | Close descendants and optionally return focus                |

Action fields: `id`, `label`, `supportingText`, `trailingText`, `badge`, `icon`,
`disabled`, `selected`, `href`, `children`. Ids are unique across the tree.
`selected` initializes selection; later user selection belongs to the component.
`href` actions cannot also select or open a submenu. Separators use
`{ separator: true }`. Disabled actions remain focusable but cannot activate.

`menu-select` bubbles across Shadow DOM with `{ item, selectedIds }`.
`menu-open` and `menu-close` also bolle. Events from descendants bolle through
their ancestors; consumers that need only root events check `event.target`.

Angular consumers need `CUSTOM_ELEMENTS_SCHEMA`; Vue consumers configure
`compilerOptions.isCustomElement` for every `bolle-*` tag; React consumers use
`addEventListener` for custom events. The exhaustively documented examples are in
[Vue 3](docs/it/vue.md) and [React](docs/it/react.md); their runtime verification
is still open. The English, French and Simplified Chinese editions live in `docs/en`,
`docs/fr` and `docs/zh`.

### Keyboard shortcuts

Every `bolle-*` element except `bolle-menu` accepts `shortcut` (property and
reflected attribute). The value uses the `aria-keyshortcuts` syntax: modifiers
`Alt`, `Control`, `Meta`, `Shift` joined to the key with `+`, alternatives
separated by a space.

```html
<bolle-button shortcut="Alt+S">Save</bolle-button>
<bolle-text-field label="Search" shortcut="Control+K Meta+K"></bolle-text-field>
```

| Behaviour         | Rule                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| ARIA              | `aria-keyshortcuts` is set on the first focusable inner control and removed when `shortcut` is empty   |
| Activation        | Buttons, links, checkboxes and radios receive focus and a click; text fields and selects receive focus |
| Skipped           | Disabled or hidden host, `defaultPrevented` event, key repeat, unmodified keys while typing in a field |
| Composite widgets | Tabs, navigation bar and lists focus their first item                                                  |
| Conflicts         | When two hosts declare the same combination, the first registered wins                                 |

One shared `keydown` listener on `document` serves every instance. Matching also
checks `event.code`, so Alt/Option combinations work on macOS layouts. Choose
combinations that do not override browser or assistive-technology shortcuts.

## Material scope and source gaps

Reference: [Material menus](https://m3.material.io/components/menus/overview),
local specification snapshot read on 2026-11-10, DSM data version 38.2.9.
The local specification also cites token data 34.0.21 and `v0_192`.
These are distinct source versions, not a unified verified token release.

- Baseline uses its documented 4px container corner; vertical uses 16px.
- Vibrant is available only for vertical menus.
- Groups use dividers on the web. Group gaps and a horizontal variant are not
  claimed as supported Material web variants.
- A 48px minimum target deliberately exceeds the 44px Expressive visual item
  height recorded in the token table. Visual and interaction geometry need review.
- The menu uses the local Roboto label-large and body-small roles when the
  typography stylesheet is loaded after the colour and component tokens.
- Entry translation/scale, 200ms submenu delay, padding and shadow resolution
  include provisional implementation choices. They are not verified missing
  measurements from the Expressive diagrams.
- Baseline uses 12px horizontal item padding and 24px icon slots; vertical uses
  16px and 20px from the recorded token table. Expressive diagram measurements
  remain incomplete.
- Menu density is implemented as a 4dp step offset. Filtering, pointer-exit
  submenu dismissal, exit transitions, origin-aware ripple and the spring easing
  of the surface pass Chromium checks; measured Expressive geometry and the full
  shape-motion matrix remain open.
- Menus and submenus open towards the wider side of the viewport, horizontally
  and vertically, then stay inside it. Below `compact-width` (480 CSS pixels by
  default) a vertical menu is presented as a bottom sheet dismissed with Escape
  or an outside press. Root `selectedIds` aggregates the selection of nested
  submenus and `menu-select` reports it.
- Standard, medium and high contrast are supplied as generated presets for light
  and dark. A complete reference-to-system token generator remains open.

## Verification status

Type checking and production build are executable with `npm run build`.
Chromium checks cover selection, disabled actions, keyboard, submenus, focus
return, viewport placement, dark and right-to-left rendering, the scrollable tab
strip, list selection and expansion, the search combobox, menu groups and
density, menu filtering and its empty state, pointer-exit submenu dismissal,
origin-aware ripple, aggregated submenu selection, the compact menu sheet, menu
exit transitions, spring easings on the popover, the medium and high contrast
presets, the seven-shape loading morph, carousel keylines, split-button sizes,
snackbar queueing, rich tooltip persistence, the M3 checkbox control,
determinate and wavy progress, slider inset icons, dial drag and dialog entry
motion. The overflow matrix is clean from 320 to 1440 CSS
pixels in light, dark, LTR and RTL.

No claim of WCAG 2.2 AA conformance is made. Automated regression suites follow
production-code approval under the adopted frontend rules. Screen-reader checks,
real devices, Firefox/WebKit, the runtime checks of the Vue/React examples and
Angular integration remain open.
The package stays private until the release checks are confirmed. The licence is
decided: Apache-2.0, see [Licence](#licence). No publication occurs during this
phase.

## Component catalogue in 0.3.2

The package now registers 52 tags: `bolle-menu` and the 51 entries of the
`catalogue` map, documented in the two tables below. Each addition has a functional native control or semantic
surface. Entry coverage does **not** mean complete Material 3 or Expressive
conformance. The support column states the implemented contract. The limits
column states missing variants or behaviour.

`demo/showcase.ts` renders every catalogue entry through the public package entry.
`src/catalogue.ts` exports the classes, the `catalogue` registration map,
`BolleItem`, picker labels and event detail types. Every tag has a
`HTMLElementTagNameMap` declaration. Importing the package registers the tags.

| Catalogue entry        | Public element                 | Support                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Open limits                                                                                                                                                                                                                                                                               |
| ---------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App bars               | `bolle-app-bar`                | Semantic header and heading; small, centered, medium, large, medium-flexible, large-flexible and search layouts; subtitle; leading/trailing slots; sticky, controlled scrolled/collapsed state                                                                                                                                                                                                                                                                                       | No automatic scroll tracking, adaptive action overflow or spring collapse; search content uses the default slot; the `label` fallback does not show once the element has other slotted children (whitespace counts), so pass the title as a default-slot child when using the named slots |
| Bottom app bar         | `bolle-bottom-app-bar`         | Container on the bottom edge: `leading`, default actions, `trailing` and a `fab` slot; roving focus across its controls with the arrow keys, Home and End; `standard` sits on the edge and `floating` detaches the surface with an inset and the bar radius; optional `divider` line on the top edge; `sticky` keeps it in place while the content scrolls; `dock` lets the floating button hang over the top edge; `align` starts or centres the actions; `label` names the toolbar | The bar is a container, not a router: it knows nothing about the screen it belongs to and renders whatever the application puts in the slots. One docked button only, on the inline-end side; no per-button expansion or automatic action overflow                                        |
| Autocomplete           | `bolle-autocomplete`           | Filled/outlined text field with a suggestion listbox built from `<option>` children or an `options` array; case-insensitive substring filter while typing; ArrowDown/ArrowUp, Enter, Escape and Tab; top-layer popup that escapes container clipping and flips above the field when space is missing; combobox ARIA with `aria-activedescendant`; inherited validation, readonly, disabled and form submission                                                                       | No asynchronous fetching or debounce hook; single value only; suggestion matching is a substring, not fuzzy                                                                                                                                                                               |
| Badges                 | `bolle-badge`                  | Small dot or numeric text; count cap; caller-supplied accessible status label                                                                                                                                                                                                                                                                                                                                                                                                        | Caller positions badge and updates the complete label when the count changes                                                                                                                                                                                                              |
| Bottom sheets          | `bolle-bottom-sheet`           | Native modal dialog at the bottom; optional drag handle; standard variant fixed at the bottom without scrim; actions and close control                                                                                                                                                                                                                                                                                                                                               | No swipe/drag gesture, detents or content-driven expansion; the handle is visual only                                                                                                                                                                                                     |
| Button groups          | `bolle-button-group`           | Standard and connected groups; single/multiple selection; required selection after activation; filled, tonal, outlined or elevated buttons; label-only or icon+label contents; size and shape propagation; connected inner corners at the M3 per-size values (XS 4, S/M 8, L 16, XL 20dp) that grow on hover (XS 8, S/M 12, L/XL 20dp); arrow/Home/End focus                                                                                                                         | No neighbouring-width animation or spring motion; group itself submits no value; initial required selection belongs to the caller                                                                                                                                                         |
| Buttons                | `bolle-button`                 | Filled, tonal, outlined, elevated, text; toggles with M3 unselected/selected colour mapping; round/square with size-aware radii (12/12/16/28/28dp) and pressed morph (8/8/12/16/16dp); five sizes with a 40px small container; native links; disabled; form submit/reset                                                                                                                                                                                                             | No origin-aware ripple; no toggle-text combination; no full native form override attribute set                                                                                                                                                                                            |
| Cards                  | `bolle-card`                   | Semantic article; filled, outlined, elevated; vertical and horizontal orientation with media slot; optional whole-card link with full-surface target, hover state layer and focus ring; `tail` (`bottom-start` default, `bottom-end`, `top-start`, `top-end`)                                                                                                                                                                                                                        | Whole-card links must not contain other interactive controls; no dragged state                                                                                                                                                                                                            |
| Carousel               | `bolle-carousel`               | Native scroll/snap; previous/next and keyboard navigation; hero, center-aligned-hero, multi-browse, uncontained, uncontained-multi-aspect-ratio and vertical full-screen layout hooks                                                                                                                                                                                                                                                                                                | Keylines derive from the carousel inline size through container query units; no item morph; caller controls aspect ratios and full-screen breakpoint restrictions                                                                                                                         |
| Checkbox               | `bolle-checkbox`               | Custom 18dp checkbox with rounded square, check path and indeterminate dash, focus ring, error border, supporting text; required, disabled; form association and reset                                                                                                                                                                                                                                                                                                               | No exact M3 check path timing or error icon in the supporting text                                                                                                                                                                                                                        |
| Chips                  | `bolle-chip`                   | Assist, suggestion, input and filter; flat and elevated styles; leading icon and avatar slots; filter checkmark replaces the native mark; optional removal; links                                                                                                                                                                                                                                                                                                                    | No single-select radio filter group or drag/reorder; removal emits an event and does not delete consumer data                                                                                                                                                                             |
| Date pickers           | `bolle-date-picker`            | Formatted readonly field; modal calendar grid and inline docked calendar; single/range; month/year selection; locale month/day names; min/max; keyboard navigation; confirm/cancel                                                                                                                                                                                                                                                                                                   | No numeric input view; editable typing replaced by the formatted field; Shift+M/Y shortcuts missing                                                                                                                                                                                       |
| Dialogs                | `bolle-dialog`                 | Native dialog; basic/fullscreen; modal or nonmodal; close value; Escape; platform focus containment and return; entry motion per placement with reduced-motion opt-out                                                                                                                                                                                                                                                                                                               | No container transform from the invoking element or exit animation                                                                                                                                                                                                                        |
| Divider                | `bolle-divider`                | Native horizontal rule; full, inset, inset-start, inset-end and vertical modes; decorative mode                                                                                                                                                                                                                                                                                                                                                                                      | Vertical form needs a parent height or uses the action-target minimum                                                                                                                                                                                                                     |
| Extended FAB           | `bolle-extended-fab`           | Label/icon button; small (56), medium (80) and large (96) sizes; six accent/container colours and surface; submit/reset                                                                                                                                                                                                                                                                                                                                                              | No scroll-driven collapse, branded variant or container transform; unverified Expressive radii remain project adaptations                                                                                                                                                                 |
| FAB menu               | `bolle-fab-menu`               | Native FAB trigger; primary, secondary and tertiary colour sets; top-layer light-dismiss menu; item actions; arrows/Home/End; first-letter navigation; Escape and focus return                                                                                                                                                                                                                                                                                                       | No alternate FAB sizes; item count of 2–6 belongs to the caller; `href` is not used in this action-only menu                                                                                                                                                                              |
| Floating action button | `bolle-floating-action-button` | FAB, medium, large and legacy small; height 56/80/96px; elevation level 3 at rest and level 4 on hover; six accent/container colours and surface                                                                                                                                                                                                                                                                                                                                     | No container transform, spring motion or automatic tooltip                                                                                                                                                                                                                                |
| Icon buttons           | `bolle-icon-button`            | Native button/link; default/toggle; filled, tonal, outlined, standard; sizes, shapes and width hooks                                                                                                                                                                                                                                                                                                                                                                                 | Narrow/wide geometry uses project minimum targets rather than the complete per-size token matrix; icon shape/weight belongs to caller content                                                                                                                                             |
| Lists                  | `bolle-list`                   | Native list with standard and segmented styles; one- and two-line rows; icons, supporting text, links and interactive buttons; trailing count badge from the item `badge`; single and multiple selection with listbox/option semantics; expandable rows with nested lists and disclosure state                                                                                                                                                                                       | No draggable/reorderable rows or nested checkboxes/radios; segmented gaps use a 2px project value                                                                                                                                                                                         |
| Menus                  | `bolle-menu`                   | Top-layer surface opened with `show(anchor)`; vertical or baseline; groups, dividers, links and submenus opened by hover or arrow; quick mode, density, single/multi selection, built-in `filterable` field, aggregated `selectedIds`, origin-aware ripple, viewport-aware placement with a tail corner, compact bottom sheet below `compact-width`, focus return and reduced-motion opt-out                                                                                         | Measured Expressive geometry and the complete shape-motion matrix remain open; the compact sheet has a grabber but no drag-to-dismiss; the filter is a project addition, not an M3 menu variant                                                                                           |
| Loading indicator      | `bolle-loading-indicator`      | Named indeterminate progressbar; default bubbles, `morph` seven-shape sequence and contained; reduced-motion fallback                                                                                                                                                                                                                                                                                                                                                                | The seven shapes are project-authored, not the exact M3 paths; the reference does not supply the paths or morph timing                                                                                                                                                                    |
| Navigation bar         | `bolle-navigation-bar`         | 80px bar, 3-slot destinations, 64x32 active indicator, 24px icons, 12px labels; links or actions; disabled destinations                                                                                                                                                                                                                                                                                                                                                              | No automatic breakpoint swap or flexible-bar width animation                                                                                                                                                                                                                              |
| Navigation drawer      | `bolle-navigation-drawer`      | Standard or modal start-side navigation; destinations; current link; navigation event; close on modal action                                                                                                                                                                                                                                                                                                                                                                         | No grouped destination sections, automatic responsive switching or persistent layout resizing                                                                                                                                                                                             |
| Navigation rail        | `bolle-navigation-rail`        | 96px collapsed and 220px expanded widths, 56px items, 56x32 indicator; current destination                                                                                                                                                                                                                                                                                                                                                                                           | No modal expanded rail, expansion toggle, embedded FAB or sections                                                                                                                                                                                                                        |
| Progress indicators    | `bolle-progress-indicator`     | Determinate linear track with 4dp stop indicator, indeterminate slide, circular SVG variants and an Expressive wavy track with determinate clip or indeterminate phase motion; bounded values                                                                                                                                                                                                                                                                                        | No spring transitions or exact Expressive wave amplitude                                                                                                                                                                                                                                  |
| Radio button           | `bolle-radio-button`           | Native radio; form/name-scoped exclusive selection; arrows/Home/End; required and disabled; form reset                                                                                                                                                                                                                                                                                                                                                                               | A consumer fieldset/legend supplies the group label; native glyph rather than exact M3 artwork                                                                                                                                                                                            |
| Search                 | `bolle-search`                 | Semantic search region; contained and divided appearances; docked results and full-screen layout shells; query events; Enter search event; results slot; suggestion combobox with filtered options, arrow keys, Enter acceptance, Escape and optional debounce on `suggest`; the field fills the bar, the label and supporting text stay in the accessibility tree and the bar carries the focus indicator                                                                           | No expanded full-screen takeover or loading state; suggestion data and fetching belong to the caller                                                                                                                                                                                      |
| Segmented buttons      | `bolle-segmented-buttons`      | Native fieldset/radio or checkbox group; two to five segments; label-only or icon+label contents; connected segment geometry with a 40px container inside a 48px target and a retained 1px outline; checkmark on selected segments; single/multiple values; required, disabled; form reset/restore                                                                                                                                                                                   | Inner selected corners follow a project rule, not a full token matrix; density steps are not implemented                                                                                                                                                                                  |
| Select                 | `bolle-select`                 | Single choice over native `<option>` and `<optgroup>` children; Material vertical menu with group labels, checkmark and 12dp selected shape; filled/outlined field with label, placeholder, supporting text and error; menu width follows the field up to 280px; Enter/Space/Arrow keys open, Escape closes; required validation, disabled state and form submission                                                                                                                 | No multiple selection or type-ahead in the closed field; the popup uses menu semantics (`menuitemradio`) instead of a listbox; option changes need a DOM mutation to refresh                                                                                                              |
| Side sheets            | `bolle-side-sheet`             | Modal dialog or fixed standard aside at the end edge; detached frame with 16px margin and rounded corners                                                                                                                                                                                                                                                                                                                                                                            | Caller owns persistent page layout; no swipe/drag or automatic content resizing                                                                                                                                                                                                           |
| Sliders                | `bolle-slider`                 | Single custom track with native inputs overlaid: continuous, centered and range with two handles; stop markers at 4px with the M3 roles; five track sizes; value bolle on hover/focus with 48px minimum width; inset start/end icons flanking the track; rotated custom vertical track; capped width token; `compact` bubble slider: 32px row, value beside the label, bubble only while dragging or keyboard-focused                                                                | Firefox track parity unverified; inset icons align at the track ends instead of the thicker M3 inset track; the pressed handle does not grow to the 28dp pressed state                                                                                                                    |
| Snackbar               | `bolle-snackbar`               | Persistent polite live region; top-layer surface; message/action/dismiss; timer pause on hover/focus; queued messages shown one after another; entry motion with reduced-motion opt-out                                                                                                                                                                                                                                                                                              | No exit or container-transform motion; application must choose an adequate timeout, or `duration=0`                                                                                                                                                                                       |
| Split button           | `bolle-split-button`           | Primary action plus menu action joined at a 2px seam, outer full corners and inner 4px corners mirrored in RTL; optional leading icon; four colour styles; five sizes matching the button scale; disabled                                                                                                                                                                                                                                                                            | No spring shape motion or named form submit on the primary action                                                                                                                                                                                                                         |
| Switch                 | `bolle-switch`                 | Switch role over a native checkbox; state-dependent 16/24dp handle with transition, optional off/on handle icons, error border, disabled state, supporting text; form association and reset                                                                                                                                                                                                                                                                                          | No pressed-state 28dp handle or state-layer ripple                                                                                                                                                                                                                                        |
| Tabs                   | `bolle-tabs`                   | Tablist and named slotted panels; primary and secondary styles; icon and badge per tab; automatic/manual activation; arrows/Home/End; disabled tabs; scrollable strip with previous/next controls and edge states                                                                                                                                                                                                                                                                    | No movable Expressive indicator or scroll-to-active animation; scroll buttons are project controls around the tablist                                                                                                                                                                     |
| Text fields            | `bolle-text-field`             | Filled/outlined; input/textarea; labels, helper text, required marker and counter; leading/trailing icon slots; prefix and suffix; native validation; readonly and bounds                                                                                                                                                                                                                                                                                                            | No select mode, minlength, password visibility control or floating-label animation                                                                                                                                                                                                        |
| Time pickers           | `bolle-time-picker`            | Formatted readonly field; modal dial and input modes; 12/24-hour; AM/PM; keyboard dial navigation; pointer-angle drag across outer and inner 24-hour rings; min/max/step validation                                                                                                                                                                                                                                                                                                  | No continuous minute dial or exact M3 dial geometry                                                                                                                                                                                                                                       |
| Toolbars               | `bolle-toolbar`                | Docked/floating; standard/vibrant; horizontal/vertical; native control arrow/Home/End focus                                                                                                                                                                                                                                                                                                                                                                                          | No adaptive overflow menu, expansion, docking transition or FAB morph                                                                                                                                                                                                                     |
| Tooltips               | `bolle-tooltip`                | Top-layer plain or rich content; hover, focus and Escape; plain tooltip offset 4 and rich offset 8; rich tooltip stays open until dismissed by outside press, Escape or its dismiss control; rich content/action slots; accessible trigger description                                                                                                                                                                                                                               | Uses `aria-description` on the real trigger, not cross-shadow `aria-describedby`; native/Bolle button, link or input trigger required; touch behaviour depends on the platform                                                                                                            |

### Schiuma

Schiuma groups the advanced components for admin applications. They are
built on the same tokens and rules as the Material catalogue but have no
Material 3 counterpart, so their contract is Bolle's own.

| Schiuma entry | Public element       | Support                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Open limits                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sidebar       | `bolle-sidebar`      | Navigation tree up to three levels with `aria-current` and `aria-expanded`; rows 40/40/36px with a full-height guide line on the third level; filter with highlighted matches and a live result count, shown as a text field (`search="field"`), a `contained` or `divided` search bar, or hidden with `search="none"`; counters; long labels end with an ellipsis and show the full text in a tooltip; rail form with badges and a menu beside it for groups; resize grip on the inner edge, 220–480px, pointer and keyboard; `edge` and `card` forms; RTL                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Deeper trees throw; no drag reordering, pinned items or persisted width: the application stores what the `navigate`, `expand`, `collapse` and `resize` events report                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| App shell     | `bolle-app-shell`    | Regions of an application as slots — `bar`, `navigation`, default content, `supporting`, `status`, `bottom-bar` — with the form taken from its own width: below 840px the navigation moves to the bottom bar and the supporting pane becomes a sheet, above 1240px the navigation stays extended; `form` forces a form and `form-change` reports the measured one; the supporting pane is a column beside the content and focuses itself when opened                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | The shell does not browse, route or persist anything: the application fills the slots and answers `form-change` and `supporting-close`. Breakpoints are fixed at 840 and 1240. It sets `data-form` on itself for page styling                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Dashboard     | `bolle-dashboard`    | Twelve-column grid of `bolle-widget` tiles; each tile declares `span` and `min-span`, and carries a handle, a title, an optional subtitle, an actions slot and a menu with width, move before or after and hide; reordering by pointer drag with a copy that follows the pointer, a dashed gap in the landing slot, the position in the pointer note, edge autoscroll and Escape to cancel, or by Alt+arrows and the menu; resizing by the corner handle, the arrow keys or the menu; a live region announces every step                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | The component moves and resizes the tiles it is given and reports it through `layout-change`, `widget-hide`; the order, the widths and the hidden tiles stay with the application. Widths are whole columns, never pixels                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Kanban        | `bolle-kanban`       | Board of columns and cards: cards declared by the application with `id`, `column`, optional `lane` and a `title` used by the announcements; moving between columns and reordering by pointer drag with a copy that follows the pointer, a dashed placeholder, a refused column in the error role and edge autoscroll, or by Alt+arrows from the card handle; `restrict` returns the reason a move is refused; `wip` per column shown as an overrun, never as a block; collapsible columns with `collapsed`; lanes grouping the cards in stacked strips with `lanes` and `laneLabel`; quick add with `addable`; card and column menus fed by `cardActions` and `columnActions`; loading, error and empty states; `comfortable` and `compact` densities; vertical scrolling inside the column, never on the board                                                                                                                                                                                               | The component never moves a card, applies a transition rule or stores the order: it asks with `card-move`, reports the refusal with `card-move-blocked` and lets `restrict` decide. The order, the fold state and the cards stay with the application, which answers `card-move`, `card-move-blocked`, `card-open`, `card-action`, `column-action`, `column-collapse`, `card-add` and `retry`. The host needs a height, because the board fills it. Markup returned by `card` lives in the shadow root, so its CSS goes in `contentStyles`. No column reordering, per-column sorting or cross-board dragging                                                                                                                                                                 |
| Gantt         | `bolle-gantt`        | Planning surface: tasks declared by the application with `id`, `code`, `name`, `start`, `end`, optional `parent`, `progress`, `milestone`, `hours`, `deps`, `resource`, `phase` and `baseline`; four time scales — day, week, month, quarter — with a two-row header, weekend shading and a today line; summary bars with end caps, milestone diamonds and a baseline under the bar; dependency elbows with arrowheads; pointer move and resize with a note that follows the pointer, a red note with the reason when the move is refused, and Escape to cancel; Alt+arrows and Shift+Alt+arrows from the keyboard; `group-by` for the tree from `parent`, `resource` or `phase`, with a workload strip per resource; a column menu with visible columns, widths adjusted by dragging the separators, and a preset that follows the width of the host; virtualised rows, a grid column fixed horizontally and a time header fixed on top; `baseline` shows the approved plan; loading, error and empty states | The surface never shortens, extends or links a task: it asks with `task-change`, reports the refusal with `task-change-blocked` applying the rule the application passes in `restrict`, and reports the opening with `task-open`. It refuses by itself only what is structural — an end before a start, a dependency that already exists or closes a loop — emitted as `dependency-add` and `dependency-blocked`. Scale, density and baseline are view state owned by the surface and reported with `view-change`; the visible columns are reported with `columns-change`. The host needs a height, because the plan fills it. Each task sits in one row: no row reordering, no inline cell editing, no date-range filter, and the dependency connector has no keyboard path |
| DAG           | `bolle-dag`          | Directed acyclic graph editor: nodes declared by the application with `id`, `label`, `x`, `y` and optional `description`, `kind`, `icon`, `badge`, `inputs`, `outputs` and `data`; links between an output port and an input port, drawn as curves with arrowheads; ports omitted give one generic input and one generic output, ports declared with `label`, `type` and `max` become rows of the node; a palette of the node types in `kinds`, grouped and searchable, with drag onto the canvas; releasing a link on empty space offers only the compatible node types; zoom, view movement, a map, rectangle selection with Shift, duplication, deletion, undo and redo; a layered layout, horizontal or vertical, mirrored in a right-to-left layout; every action reachable from the keyboard, linking included through the node menu; `readonly`, loading, error and empty states | The editor applies a change to its own `nodes` and `edges` and reports it with `dag-change`, with the cause. A loop, a link to the node itself and a duplicate link are always refused; the other rules come from `constraints` — `typeCompatible`, `maxIncoming`, `maxOutgoing`, `maxNodes`, `canConnect`, `canAdd`, `canDelete`, `canDeleteEdge` — and every refusal shows its reason while dragging, in the menu, in a snackbar and with `dag-connection-rejected`. `overrides` replaces an operation — `add`, `connect`, `move`, `arrange`, `duplicate`, `delete` — with a function that receives the request and `apply`; without `apply` the graph stays as it is. The `node-{id}` slot adds content under the node header. Double click or Enter emits `dag-node-activate`, so the application opens its own detail. The host needs a height; the node width is fixed at 232px |
| Data table    | `bolle-data-table`   | Rows of a controlled table: columns declared by the application with explicit widths, `align`, `pinned`, `hidden`, `groupable`, `sortable`, `value` and `render`; single and multiple sorting with rank badges and `aria-sort`; header menu for sorting, grouping, pinning, moving and hiding a column; column drag with Escape to cancel and Alt+arrows as a path without dragging; resize handle by pointer, double click and arrows; sticky header; pinned columns with an edge shadow; selection with per-page and indeterminate states; row details; groups with counts and an application summary; pager with range; windowed rendering with `virtual`; loading, updating, empty and error states; `card` and `free` forms; `comfortable` and `compact` densities                                                                                                                                                                                                                                       | The component never sorts, filters or pages the data: the application owns the rows and answers the `sort`, `page-change`, `select`, `expand`, `group`, `column-change`, `row-action`, `row-activate` and `retry` events. `virtual` needs a height on the host. Markup returned by `render`, `detail` and `groupSummary` lives in the shadow root, so its CSS goes in `contentStyles`. No inline editing, export, column spanning or drag reordering of rows                                                                                                                                                                                                                                                                                                                 |
| Avatar        | `bolle-avatar`       | Identity mark with an image, initials or icon; initials derived from `name` when not given and readable in a language without spaces; `size` from `xs` to `xl`, `shape` circle, rounded or square, `color` role and an optional `status` dot; `icon` and `badge` slots; falls back to the initials when the image fails; the accessible name comes from `label`, `alt`, `name` or the initials                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Decorative by contract: it carries no link, button or menu and the caller places it inside one. No group or stacked form, no presence tooltip                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Avatar group  | `bolle-avatar-group` | The `bolle-avatar` children it receives, overlapping by a share of their size; `max` keeps the first ones visible and sums the rest in an overflow bubble, `total` counts the people not passed as avatars, `size` sets the shared size and `overlap` the covered share; the bubble is plain text, or a button with `interactive` that emits `avatar-group-select`; a ring of the surface colour separates one avatar from the next; `label` names the group                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | It arranges the avatars and counts them: it does not fetch people or open a list, because `avatar-group-select` only reports how many are hidden. The bubble is not a tooltip or a popover. An avatar that declares its own `size` keeps it                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Breadcrumb    | `bolle-breadcrumb`   | Path of levels declared by the application with `id`, `label`, optional `href`, `icon` and `current`; the current level is not a link and carries `aria-current="page"`; `max-items` shortens a long path to the first level, an expandable gap and the last levels; `separator` chevron, slash or none, mirrored in a right-to-left layout; labels truncate with an ellipsis and never paint outside the host; `labels` override; `breadcrumb-select` reports the chosen level                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | It never navigates: the application answers `breadcrumb-select` and decides the route. The gap button expands the path once and is not a menu. No automatic collapse on width, no sibling or ancestor popover                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Empty state   | `bolle-empty-state`  | The surface a container shows when it has nothing to draw: `icon` with its slot, `title`, `text` and an `actions` slot; `tone` neutral or error, `align` center or start, and `role` so an error can be announced as an alert                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | It draws the state, it does not decide it: telling “no data” from “no results” and choosing the actions stays with the application. No illustration slot beyond the icon, no retry logic of its own                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Pagination    | `bolle-pagination`   | Page control of a list the application owns: `page`, `pageSize` and `total`, with the range readout, numbered pages whose window narrows with the container, first, previous, next and last arrows, and a rows-per-page select from `pageSizes`; `form` full or compact; the numbered list gives way to the page number, and the edge arrows step aside, when the container is narrow; `labels` override; `page-change` reports both the page and the size                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | It never slices the data: the application answers `page-change` and passes the rows. Zero-based `page`, `pageSize` 0 hides the pager. No infinite scroll, no jump-to-page input                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

### Public values and events

Properties containing arrays or objects use JavaScript property assignment.
Attributes use kebab case for `supporting-text`, `upper-value`, `upper-label`,
`close-label`, `action-label`, `menu-label`, `compact-width`, `remove-label`,
`selection-mode`, `page-size`, `page-sizes`, `end-value`, `week-starts-on`,
`hour-cycle` and `show-value`.
Boolean attributes use presence/absence; `disabled="false"` still means disabled.
Caller content supplies translated labels, icon content and destination text.
Picker controls, list expand buttons, tab scroll buttons and the rich tooltip
dismiss button have English, Italian, French and Simplified Chinese messages,
chosen from the language subtag of `locale`, `lang` or the document language
(English otherwise); pickers also accept the `labels` override object. Date
formatting uses `Intl.DateTimeFormat`.

```ts
import {
  BolleCheckbox,
  type BolleItem,
  type BolleValueChangeDetail,
} from "bolle-web-components";
import "bolle-web-components/tokens.css";
import "bolle-web-components/typography.css";

const destinations: BolleItem[] = [
  { id: "inbox", label: "Inbox", icon: "✉", href: "/inbox" },
  { id: "archive", label: "Archive", href: "/archive" },
];
document.querySelector("bolle-navigation-bar")!.items = destinations;

const field = document.querySelector("bolle-text-field")!;
field.addEventListener("change", (event) => {
  const { value } = (event as CustomEvent<BolleValueChangeDetail>).detail;
  console.log(value);
});

const checkbox = new BolleCheckbox();
checkbox.name = "consent";
checkbox.value = "yes";
checkbox.label = "Consent";
document.querySelector("form")!.append(checkbox);
```

- `BolleItem`: unique `id`, visible `label`, optional text `icon`,
  `supportingText`, `href`, `disabled`. Item strings render as text, never HTML.
- Button `variant`: `filled`, `tonal`/`filled-tonal`, `outlined`, `elevated`,
  `text`; icon buttons also accept `standard`. `toggle` enables `selected`.
  Button sizes: `xs`, `small`, `medium`, `large`, `xl`. Shapes: `round`, `square`.
- Floating action button sizes: `fab` (default), `medium`, `large`, legacy
  `small`. Extended floating action button sizes: `small` (default), `medium`,
  `large`. Colours: `primary-container`, `secondary-container`,
  `tertiary-container`, `primary`, `secondary`, `tertiary`, `surface`.
- `change`: `{ value }`, `{ checked, value }` or `{ selected }` for the
  corresponding control. Multiple selection adds `values`; sliders add
  `upperValue`; date ranges add `endValue`.
- `value-input`: current text, search, date, time or slider value during editing.
  Native composed `input` events also cross the component boundary.
- `action`: an optional item `id`; `navigate`: destination `id`;
  `remove`: chip removal request; `selection-change`: button group `values`;
  `search`: query `value`; carousel `change`: numeric `index`.
- `closed`: dialog `returnValue` or snackbar `reason`.
  `before-close` is cancellable for dialog Escape dismissal.
- Dialogs/sheets: `show(opener?)`, `close(returnValue?)`, `open`.
  `variant="standard"` keeps a sheet in the page layout.
  Dialog fullscreen spelling is `variant="fullscreen"`.
- Snackbar: `show(message?)`, `close(reason?)`, `duration` in milliseconds;
  zero disables the timer. Positive durations have a 4000 ms minimum.
- Carousel: `goTo(index)`, `index`, `previous-label`, `next-label`.
- Menu: `show(anchor, { last?, x?, y? })`, `close(restoreFocus?)`, `open`.
  `filterable` shows a filter field, `filter` holds its query, `locale` picks the
  built-in messages, `compact-width` (480 by default) is the width below which a
  vertical menu becomes a bottom sheet. `selectedIds` includes the entries
  selected in nested submenus and `menu-select` reports the same set.
- Loading indicator: `variant="morph"` runs the seven-shape sequence; the default
  variant keeps the bubbles and `contained` draws the filled container.
- Tabs: `value` selects the `BolleItem.id`; a panel uses `slot="<id>"`.
  `activation="manual"` moves focus without selection until Enter or Space.

### Forms and focus

Checkboxes, radio buttons, switches, filter chips, text fields, search,
date/time pickers, sliders and segmented buttons use `ElementInternals`.
The hosts support `name`, `form`, disabled fieldsets, native constraint state,
`checkValidity()`, `reportValidity()`, reset and browser state restoration.
Form reset restores the values present at first render, not later attribute
edits. Date and time values serialize as `YYYY-MM-DD` and `HH:MM`.
Range dates/sliders and multiple segments submit repeated entries under `name`.
Unchecked checkboxes, switches and filter chips submit nothing.
Button groups do not submit selection; segmented buttons do.

Buttons, icon buttons and floating action buttons support `type="submit"` or
`type="reset"` and the external `form` attribute. A submit action uses a native
temporary submitter so `name`/`value` and native form validation apply.
The submitter exists only during submission. `formaction`, `formmethod`,
`formenctype`, `formtarget` and `formnovalidate` are not exposed.

Control `label` values name the real shadow control. A label on a custom host
alone does not replace the required control label. Native focus indicators use
the existing focus token. Modal surfaces use platform focus containment rather
than a document-wide custom key trap. Rich tooltip descriptions use the
focusable inner trigger. Navigation without `href` emits `navigate` for a router.
Only links with real `href` provide native browser navigation.

### Material support boundaries

`src/design-system.json` records the design system version, source date,
token snapshot and verification boundary. `src/tokens.css` contains authored
component tokens and light/dark presets. Generated typography and local font
delivery remain unchanged. The new shared styles consume those tokens.

The minimum action target is 48 CSS pixels. This exceeds some 32/40/44-pixel
visual containers in the specification. Some component dimensions, gaps,
widths, radii and motion are project adaptations. Source gaps do not establish
Material requirements. Exact Expressive geometry and the complete shape-motion
matrix remain open. The seven-shape loading morph, the spring easings, the wavy
progress track and the carousel keylines are project realisations, not measured
replicas. The state matrix is derived from the component definitions and shown
on the documentation overview page, so the demo remains an interactive
catalogue rather than an every-contrast conformance page. No full Expressive
conformance is claimed.

Supported platform requirements are native custom elements, shadow DOM,
`ElementInternals`, native dialog and the Popover API. No polyfills are bundled.
The standard, medium and high contrast presets are supplied for light and dark.
A complete token generator and certification of consumer colour overrides
remain open.

### Catalogue verification

Production build and TypeScript declaration emission pass.
The demo consumer files also pass strict TypeScript checking.
Prettier reports no formatting errors.
Inline Chromium checks use the public components on the existing demo server.
The checks cover registration/demo coverage, form submission and reset, disabled
fieldsets, named submit buttons, exclusive radio keyboard selection, modal
dismissal, standard sheets, date-grid keyboard selection, time-dial selection,
tabs, group/toolbar focus, FAB-menu dismissal and tooltip descriptions.
The demo has no document-level horizontal overflow at 320, 640 and 1280 pixels.
No runtime page errors occur in these checks.
Additional Chromium checks pass for required radio groups, disabled/nameless
segmented values, filter-chip submission, multiple/range reset, date-range
bounds, numeric sanitization, connected required selection and FAB-menu Tab
dismissal. A fresh document loads the built distribution and renders all
49 registered elements.

The audit round adds checks for the scrollable tab strip, list selection and
expansion, the search combobox, menu groups and density, split-button sizes,
snackbar queueing, rich tooltip persistence, the custom checkbox control,
determinate/wavy progress, slider inset icons, time-dial drag and dialog entry
motion; the overflow matrix covers 320, 600, 900, 1280 and 1440 pixels in both
themes.

Persistent automated test files are not added before production-code approval.
Firefox/WebKit, touch/pointer drag, screen readers, complete colour-state
contrast, zoom/text spacing for every new component and framework integration
remain unverified. These checks do not establish accessibility conformance.

## Licence

The package is released under the Apache License 2.0. The full text is in
[LICENSE](./LICENSE), and the same identifier is declared in `package.json` as
`"license": "Apache-2.0"`.

The licence covers the source of this repository and the built distribution.
Third-party assets keep their own terms: the Fontsource font families carry
their licences in the `LICENSE` file published with the fonts, and the icon path
data vendored in `src/icons.ts` comes from Tabler Icons under the MIT licence.
