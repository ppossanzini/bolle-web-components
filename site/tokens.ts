import {
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeFruitSalad,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeRainbow,
  SchemeTonalSpot,
  SchemeVibrant,
  TonalPalette,
  argbFromHex,
  hexFromArgb,
} from "@material/material-color-utilities";
import { l, m } from "./i18n.js";

export type ThemeName = "light" | "dark";

export type Density = "airy" | "compact";

export const DENSITY_PRESETS: { id: Density; label: string; scale: number }[] = [
  { id: "airy", label: m("Ariosa"), scale: 1 },
  { id: "compact", label: m("Compatta"), scale: 3 / 4 },
];

export const densityPreset = (id: Density) =>
  DENSITY_PRESETS.find((preset) => preset.id === id) ?? DENSITY_PRESETS[0];

export interface TokenSet {
  colors: Record<string, string>;
  shapes: Record<string, number>;
  brandFont: string;
  plainFont: string;
  baseSize: number;
}

export interface ColorRole {
  token: string;
  label: string;
  group: string;
  light: string;
  dark: string;
}

export const COLOR_ROLE_GROUPS = [
  "Primary",
  "Secondary",
  "Tertiary",
  "Error",
  "Surface",
  "Outline",
  "Inverse",
  "Fixed",
  "Utility",
] as const;

export const COLOR_ROLES: ColorRole[] = [
  { token: "primary", label: "Primary", group: "Primary", light: "#6750a4", dark: "#d0bcff" },
  { token: "on-primary", label: "On primary", group: "Primary", light: "#ffffff", dark: "#381e72" },
  { token: "primary-container", label: "Primary container", group: "Primary", light: "#eaddff", dark: "#4f378b" },
  { token: "on-primary-container", label: "On primary container", group: "Primary", light: "#4f378b", dark: "#eaddff" },
  { token: "secondary", label: "Secondary", group: "Secondary", light: "#625b71", dark: "#ccc2dc" },
  { token: "on-secondary", label: "On secondary", group: "Secondary", light: "#ffffff", dark: "#332d41" },
  { token: "secondary-container", label: "Secondary container", group: "Secondary", light: "#e8def8", dark: "#4a4458" },
  { token: "on-secondary-container", label: "On secondary container", group: "Secondary", light: "#4a4458", dark: "#e8def8" },
  { token: "tertiary", label: "Tertiary", group: "Tertiary", light: "#7d5260", dark: "#efb8c8" },
  { token: "on-tertiary", label: "On tertiary", group: "Tertiary", light: "#ffffff", dark: "#492532" },
  { token: "tertiary-container", label: "Tertiary container", group: "Tertiary", light: "#ffd8e4", dark: "#633b48" },
  { token: "on-tertiary-container", label: "On tertiary container", group: "Tertiary", light: "#633b48", dark: "#ffd8e4" },
  { token: "error", label: "Error", group: "Error", light: "#b3261e", dark: "#f2b8b5" },
  { token: "on-error", label: "On error", group: "Error", light: "#ffffff", dark: "#601410" },
  { token: "error-container", label: "Error container", group: "Error", light: "#f9dedc", dark: "#8c1d18" },
  { token: "on-error-container", label: "On error container", group: "Error", light: "#8c1d18", dark: "#f9dedc" },
  { token: "surface", label: "Surface", group: "Surface", light: "#fef7ff", dark: "#141218" },
  { token: "surface-dim", label: "Surface dim", group: "Surface", light: "#ded8e1", dark: "#141218" },
  { token: "surface-bright", label: "Surface bright", group: "Surface", light: "#fef7ff", dark: "#3b383e" },
  { token: "surface-container-lowest", label: "Surface container lowest", group: "Surface", light: "#ffffff", dark: "#0f0d13" },
  { token: "surface-container-low", label: "Surface container low", group: "Surface", light: "#f7f2fa", dark: "#1d1b20" },
  { token: "surface-container", label: "Surface container", group: "Surface", light: "#f3edf7", dark: "#211f26" },
  { token: "surface-container-high", label: "Surface container high", group: "Surface", light: "#ece6f0", dark: "#2b2930" },
  { token: "surface-container-highest", label: "Surface container highest", group: "Surface", light: "#e6e0e9", dark: "#36343b" },
  { token: "surface-variant", label: "Surface variant", group: "Surface", light: "#e7e0ec", dark: "#49454f" },
  { token: "on-surface", label: "On surface", group: "Surface", light: "#1d1b20", dark: "#e6e0e9" },
  { token: "on-surface-variant", label: "On surface variant", group: "Surface", light: "#49454f", dark: "#cac4d0" },
  { token: "outline", label: "Outline", group: "Outline", light: "#79747e", dark: "#938f99" },
  { token: "outline-variant", label: "Outline variant", group: "Outline", light: "#cac4d0", dark: "#49454f" },
  { token: "inverse-surface", label: "Inverse surface", group: "Inverse", light: "#322f35", dark: "#e6e0e9" },
  { token: "inverse-on-surface", label: "Inverse on surface", group: "Inverse", light: "#f5eff7", dark: "#322f35" },
  { token: "inverse-primary", label: "Inverse primary", group: "Inverse", light: "#d0bcff", dark: "#6750a4" },
  { token: "surface-tint", label: "Surface tint", group: "Inverse", light: "#6750a4", dark: "#d0bcff" },
  { token: "primary-fixed", label: "Primary fixed", group: "Fixed", light: "#eaddff", dark: "#eaddff" },
  { token: "primary-fixed-dim", label: "Primary fixed dim", group: "Fixed", light: "#d0bcff", dark: "#d0bcff" },
  { token: "on-primary-fixed", label: "On primary fixed", group: "Fixed", light: "#21005d", dark: "#21005d" },
  { token: "on-primary-fixed-variant", label: "On primary fixed variant", group: "Fixed", light: "#4f378b", dark: "#4f378b" },
  { token: "secondary-fixed", label: "Secondary fixed", group: "Fixed", light: "#e8def8", dark: "#e8def8" },
  { token: "secondary-fixed-dim", label: "Secondary fixed dim", group: "Fixed", light: "#ccc2dc", dark: "#ccc2dc" },
  { token: "on-secondary-fixed", label: "On secondary fixed", group: "Fixed", light: "#1d192b", dark: "#1d192b" },
  { token: "on-secondary-fixed-variant", label: "On secondary fixed variant", group: "Fixed", light: "#4a4458", dark: "#4a4458" },
  { token: "tertiary-fixed", label: "Tertiary fixed", group: "Fixed", light: "#ffd8e4", dark: "#ffd8e4" },
  { token: "tertiary-fixed-dim", label: "Tertiary fixed dim", group: "Fixed", light: "#efb8c8", dark: "#efb8c8" },
  { token: "on-tertiary-fixed", label: "On tertiary fixed", group: "Fixed", light: "#31111d", dark: "#31111d" },
  { token: "on-tertiary-fixed-variant", label: "On tertiary fixed variant", group: "Fixed", light: "#633b48", dark: "#633b48" },
  { token: "scrim", label: "Scrim", group: "Utility", light: "#000000", dark: "#000000" },
  { token: "shadow", label: "Shadow", group: "Utility", light: "#000000", dark: "#000000" },
];

export const SHAPE_TOKENS = [
  { token: "none", label: "None", fallback: 0, max: 0 },
  { token: "extra-small", label: "Extra small", fallback: 4, max: 12 },
  { token: "small", label: "Small", fallback: 8, max: 16 },
  { token: "medium", label: "Medium", fallback: 12, max: 24 },
  { token: "large", label: "Large", fallback: 16, max: 28 },
  { token: "large-increased", label: "Large increased", fallback: 20, max: 32 },
  { token: "extra-large", label: "Extra large", fallback: 28, max: 40 },
  { token: "extra-large-increased", label: "Extra large increased", fallback: 32, max: 44 },
  { token: "extra-extra-large", label: "Extra extra large", fallback: 48, max: 56 },
] as const;

/** M3 dynamic roles used to derive a full scheme from a seed colour. */
const DYNAMIC_ROLES: Record<string, (scheme: DynamicScheme) => number> = {
  primary: (s) => MaterialDynamicColors.primary.getArgb(s),
  "on-primary": (s) => MaterialDynamicColors.onPrimary.getArgb(s),
  "primary-container": (s) => MaterialDynamicColors.primaryContainer.getArgb(s),
  "on-primary-container": (s) => MaterialDynamicColors.onPrimaryContainer.getArgb(s),
  secondary: (s) => MaterialDynamicColors.secondary.getArgb(s),
  "on-secondary": (s) => MaterialDynamicColors.onSecondary.getArgb(s),
  "secondary-container": (s) => MaterialDynamicColors.secondaryContainer.getArgb(s),
  "on-secondary-container": (s) => MaterialDynamicColors.onSecondaryContainer.getArgb(s),
  tertiary: (s) => MaterialDynamicColors.tertiary.getArgb(s),
  "on-tertiary": (s) => MaterialDynamicColors.onTertiary.getArgb(s),
  "tertiary-container": (s) => MaterialDynamicColors.tertiaryContainer.getArgb(s),
  "on-tertiary-container": (s) => MaterialDynamicColors.onTertiaryContainer.getArgb(s),
  error: (s) => MaterialDynamicColors.error.getArgb(s),
  "on-error": (s) => MaterialDynamicColors.onError.getArgb(s),
  "error-container": (s) => MaterialDynamicColors.errorContainer.getArgb(s),
  "on-error-container": (s) => MaterialDynamicColors.onErrorContainer.getArgb(s),
  surface: (s) => MaterialDynamicColors.surface.getArgb(s),
  "surface-dim": (s) => MaterialDynamicColors.surfaceDim.getArgb(s),
  "surface-bright": (s) => MaterialDynamicColors.surfaceBright.getArgb(s),
  "surface-container-lowest": (s) => MaterialDynamicColors.surfaceContainerLowest.getArgb(s),
  "surface-container-low": (s) => MaterialDynamicColors.surfaceContainerLow.getArgb(s),
  "surface-container": (s) => MaterialDynamicColors.surfaceContainer.getArgb(s),
  "surface-container-high": (s) => MaterialDynamicColors.surfaceContainerHigh.getArgb(s),
  "surface-container-highest": (s) => MaterialDynamicColors.surfaceContainerHighest.getArgb(s),
  "surface-variant": (s) => MaterialDynamicColors.surfaceVariant.getArgb(s),
  "on-surface": (s) => MaterialDynamicColors.onSurface.getArgb(s),
  "on-surface-variant": (s) => MaterialDynamicColors.onSurfaceVariant.getArgb(s),
  outline: (s) => MaterialDynamicColors.outline.getArgb(s),
  "outline-variant": (s) => MaterialDynamicColors.outlineVariant.getArgb(s),
  "inverse-surface": (s) => MaterialDynamicColors.inverseSurface.getArgb(s),
  "inverse-on-surface": (s) => MaterialDynamicColors.inverseOnSurface.getArgb(s),
  "inverse-primary": (s) => MaterialDynamicColors.inversePrimary.getArgb(s),
  "surface-tint": (s) => MaterialDynamicColors.surfaceTint.getArgb(s),
  "primary-fixed": (s) => MaterialDynamicColors.primaryFixed.getArgb(s),
  "primary-fixed-dim": (s) => MaterialDynamicColors.primaryFixedDim.getArgb(s),
  "on-primary-fixed": (s) => MaterialDynamicColors.onPrimaryFixed.getArgb(s),
  "on-primary-fixed-variant": (s) => MaterialDynamicColors.onPrimaryFixedVariant.getArgb(s),
  "secondary-fixed": (s) => MaterialDynamicColors.secondaryFixed.getArgb(s),
  "secondary-fixed-dim": (s) => MaterialDynamicColors.secondaryFixedDim.getArgb(s),
  "on-secondary-fixed": (s) => MaterialDynamicColors.onSecondaryFixed.getArgb(s),
  "on-secondary-fixed-variant": (s) => MaterialDynamicColors.onSecondaryFixedVariant.getArgb(s),
  "tertiary-fixed": (s) => MaterialDynamicColors.tertiaryFixed.getArgb(s),
  "tertiary-fixed-dim": (s) => MaterialDynamicColors.tertiaryFixedDim.getArgb(s),
  "on-tertiary-fixed": (s) => MaterialDynamicColors.onTertiaryFixed.getArgb(s),
  "on-tertiary-fixed-variant": (s) => MaterialDynamicColors.onTertiaryFixedVariant.getArgb(s),
  scrim: (s) => MaterialDynamicColors.scrim.getArgb(s),
  shadow: (s) => MaterialDynamicColors.shadow.getArgb(s),
};

/** WCAG relative luminance of a #RRGGBB colour. */
function luminance(hex: string): number {
  const value = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => {
    const c = ((value >> shift) & 255) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(16) + 0.7152 * channel(8) + 0.0722 * channel(0);
}

/** WCAG contrast ratio between two #RRGGBB colours. */
export function contrastRatio(first: string, second: string): number {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

type SchemeClass = new (source: Hct, isDark: boolean, contrast: number) => DynamicScheme;

export interface ColorAlgorithm {
  id: string;
  label: string;
  /** Material 3 scheme that also supplies the variant rules. */
  scheme: SchemeClass;
  /** Hue offsets of secondary and tertiary for colour-wheel harmonies. */
  harmony?: [number, number];
  /** Harmonies and tonal spot keep the full seed chroma in the primary palette. */
  seedPrimary?: boolean;
}

/**
 * Material 3 variants keep secondary and tertiary close to the seed (tonal spot is the
 * quietest). Harmonies place them elsewhere on the colour wheel with real chroma.
 */
export const COLOR_ALGORITHMS: ColorAlgorithm[] = [
  { id: "tonal-spot", label: "Material · Tonal spot", scheme: SchemeTonalSpot, seedPrimary: true },
  { id: "vibrant", label: "Material · Vibrant", scheme: SchemeVibrant },
  { id: "expressive", label: "Material · Expressive", scheme: SchemeExpressive },
  { id: "fidelity", label: "Material · Fidelity", scheme: SchemeFidelity },
  { id: "content", label: "Material · Content", scheme: SchemeContent },
  { id: "rainbow", label: "Material · Rainbow", scheme: SchemeRainbow },
  { id: "fruit-salad", label: "Material · Fruit salad", scheme: SchemeFruitSalad },
  { id: "neutral", label: "Material · Neutral", scheme: SchemeNeutral },
  { id: "monochrome", label: "Material · Monochrome", scheme: SchemeMonochrome },
  { id: "complementary", label: m("Armonia · Complementare"), scheme: SchemeTonalSpot, harmony: [180, 180], seedPrimary: true },
  { id: "analogous", label: m("Armonia · Analoga"), scheme: SchemeTonalSpot, harmony: [-30, 30], seedPrimary: true },
  { id: "split", label: m("Armonia · Complementare divisa"), scheme: SchemeTonalSpot, harmony: [150, 210], seedPrimary: true },
  { id: "triadic", label: m("Armonia · Triade"), scheme: SchemeTonalSpot, harmony: [120, 240], seedPrimary: true },
  { id: "tetradic", label: m("Armonia · Quadrato"), scheme: SchemeTonalSpot, harmony: [90, 180], seedPrimary: true },
];

export const colorAlgorithm = (id: string) =>
  COLOR_ALGORITHMS.find((item) => item.id === id) ?? COLOR_ALGORITHMS[0];

export interface SurfaceMode {
  id: string;
  label: string;
  /** Chroma of the neutral and neutral-variant palettes; null keeps the algorithm's own. */
  chroma: [number, number] | null;
}

/** Surfaces, outlines and text greys: from the seed-tinted M3 neutrals to plain white and grey. */
export const SURFACE_MODES: SurfaceMode[] = [
  { id: "white", label: m("Bianche"), chroma: [0, 0] },
  { id: "soft", label: m("Quasi bianche"), chroma: [1.5, 3] },
  { id: "tinted", label: m("Tinte (Material)"), chroma: null },
];

export const surfaceMode = (id: string) =>
  SURFACE_MODES.find((item) => item.id === id) ?? SURFACE_MODES[0];

export interface SchemeOptions {
  contrast?: number;
  /** Keep the seed as the exact primary instead of tone 40/80. */
  keepSeed?: boolean;
  algorithm?: string;
  surfaces?: string;
}

const wrapHue = (hue: number) => ((hue % 360) + 360) % 360;

/**
 * Colour roles from a seed. M3 never uses the seed itself as `primary`: it takes tone 40
 * (light) or 80 (dark) of the seed palette. With `keepSeed` the seed stays the exact
 * primary and on-primary becomes the palette tone with the higher contrast on it.
 */
export function hctScheme(
  seed: string,
  theme: ThemeName,
  options: SchemeOptions = {},
): Record<string, string> {
  const { contrast = 0, keepSeed = false } = options;
  const algorithm = colorAlgorithm(options.algorithm ?? "tonal-spot");
  const surfaces = surfaceMode(options.surfaces ?? "white");
  const source = Hct.fromInt(argbFromHex(seed));
  const base = new algorithm.scheme(source, theme === "dark", contrast);
  const seedPalette = TonalPalette.fromInt(argbFromHex(seed));
  const primaryPalette = algorithm.seedPrimary ? seedPalette : base.primaryPalette;
  // Harmony accents keep enough chroma to read as colours, never more than the seed has.
  const accentChroma = Math.max(Math.min(source.chroma, 48), 24);
  const accent = (offset: number, chroma: number) =>
    TonalPalette.fromHueAndChroma(wrapHue(source.hue + offset), chroma);
  const [secondaryPalette, tertiaryPalette] = algorithm.harmony
    ? [accent(algorithm.harmony[0], accentChroma * 0.75), accent(algorithm.harmony[1], accentChroma)]
    : [base.secondaryPalette, base.tertiaryPalette];
  const [neutralPalette, neutralVariantPalette] = surfaces.chroma
    ? [
        TonalPalette.fromHueAndChroma(source.hue, surfaces.chroma[0]),
        TonalPalette.fromHueAndChroma(source.hue, surfaces.chroma[1]),
      ]
    : [base.neutralPalette, base.neutralVariantPalette];
  const scheme = new DynamicScheme({
    sourceColorHct: base.sourceColorHct,
    variant: base.variant,
    contrastLevel: contrast,
    isDark: theme === "dark",
    primaryPalette,
    secondaryPalette,
    tertiaryPalette,
    neutralPalette,
    neutralVariantPalette,
  });
  const colors = Object.fromEntries(
    COLOR_ROLES.map((role) => [
      role.token,
      hexFromArgb(DYNAMIC_ROLES[role.token](scheme)),
    ]),
  );
  if (!keepSeed) return colors;
  const exact = hexFromArgb(argbFromHex(seed));
  const candidates = [100, 95, 10, 0].map((tone) => hexFromArgb(seedPalette.tone(tone)));
  const onPrimary = candidates.reduce((best, candidate) =>
    contrastRatio(candidate, exact) > contrastRatio(best, exact) ? candidate : best,
  );
  return { ...colors, primary: exact, "surface-tint": exact, "on-primary": onPrimary };
}

export const FONT_STACKS: Record<string, string> = {
  Figtree: "Figtree, system-ui, sans-serif",
  Fredoka: "Fredoka, Figtree, system-ui, sans-serif",
  Sistema: "system-ui, sans-serif",
  Georgia: "Georgia, serif",
  Times: "'Times New Roman', serif",
  Monospace: "'JetBrains Mono', ui-monospace, monospace",
  Trebuchet: "'Trebuchet MS', sans-serif",
};

export const FONT_KEYS = Object.keys(FONT_STACKS);

interface ThemePreset {
  id: string;
  label: string;
  seed: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: "bolle", label: m("Viola"), seed: "#5B4CF0" },
  { id: "laguna", label: m("Laguna"), seed: "#0E7C86" },
  { id: "corallo", label: m("Corallo"), seed: "#C2410C" },
  { id: "bosco", label: m("Bosco"), seed: "#2F7D32" },
  { id: "oceano", label: m("Oceano"), seed: "#00639b" },
  { id: "ambra", label: m("Ambra"), seed: "#7a5900" },
  { id: "grafite", label: m("Grafite"), seed: "#5a6068" },
];

export const DEFAULT_THEME_PRESET = THEME_PRESETS[0];

export const themePreset = (id: string): ThemePreset =>
  THEME_PRESETS.find((preset) => preset.id === id) ?? DEFAULT_THEME_PRESET;

export const presetTokenSet = (
  theme: ThemeName,
  presetId: string = DEFAULT_THEME_PRESET.id,
): TokenSet => ({
  colors: hctScheme(themePreset(presetId).seed, theme),
  shapes: Object.fromEntries(
    SHAPE_TOKENS.map((shape) => [shape.token, shape.fallback]),
  ),
  brandFont: "Figtree",
  plainFont: "Figtree",
  baseSize: 16,
});

export const defaultTokenSet = (theme: ThemeName): TokenSet =>
  presetTokenSet(theme);

export function applyTokens(set: TokenSet, density: Density = "airy"): void {
  const root = document.documentElement;
  for (const role of COLOR_ROLES)
    root.style.setProperty(
      `--md-sys-color-${role.token}`,
      set.colors[role.token],
    );
  for (const shape of SHAPE_TOKENS)
    root.style.setProperty(
      `--md-sys-shape-corner-${shape.token}`,
      `${set.shapes[shape.token]}px`,
    );
  root.style.setProperty("--md-ref-typeface-brand", FONT_STACKS[set.brandFont]);
  root.style.setProperty("--md-ref-typeface-plain", FONT_STACKS[set.plainFont]);
  root.style.fontSize = `${set.baseSize}px`;
  applyDensity(densityPreset(density).scale);
}

/** Component length tokens in the loaded token sheet, read from `:root`. */
function componentTokens(): Record<string, string> {
  const found: Record<string, string> = {};
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule) || !rule.selectorText.includes(":root"))
        continue;
      for (const name of Array.from(rule.style))
        if (name.startsWith("--md-comp-"))
          found[name] = rule.style.getPropertyValue(name).trim();
    }
  }
  return found;
}

const SPACING_TOKEN =
  /(padding|margin|gap|space|spacing|inset|height|width|size|target|between|leading|trailing|min-|max-)/;
const EXCLUDED_TOKEN =
  /(corner|radius|elevation|opacity|duration|focus|outline|font|tracking|shadow)/;
const LENGTH = /^-?\d*\.?\d+px$/;

function scaleLengths(value: string, scale: number): string | null {
  const parts = value.split(/\s+/);
  if (!parts.every((part) => part === "0" || LENGTH.test(part))) return null;
  return parts
    .map((part) => {
      if (part === "0") return part;
      const sized = Math.round(parseFloat(part) * scale);
      return `${sized}px`;
    })
    .join(" ");
}

let densityKeys: string[] = [];

/** Applies the density preset to every component length token on the root. */
function applyDensity(scale: number, attempt = 0): void {
  const root = document.documentElement;
  for (const name of densityKeys) root.style.removeProperty(name);
  densityKeys = [];
  if (scale === 1) return;
  const tokens = componentTokens();
  if (Object.keys(tokens).length === 0) {
    if (attempt < 3)
      requestAnimationFrame(() => applyDensity(scale, attempt + 1));
    return;
  }
  for (const [name, value] of Object.entries(tokens)) {
    if (EXCLUDED_TOKEN.test(name) || !SPACING_TOKEN.test(name)) continue;
    const scaled = scaleLengths(value, scale);
    if (!scaled) continue;
    root.style.setProperty(name, scaled);
    densityKeys.push(name);
  }
}

export function tokensCss(set: TokenSet): string {
  const lines = [
    ":root {",
    `  font-size: ${set.baseSize}px;`,
    `  --md-ref-typeface-brand: ${FONT_STACKS[set.brandFont]};`,
    `  --md-ref-typeface-plain: ${FONT_STACKS[set.plainFont]};`,
    ...COLOR_ROLES.map(
      (role) => `  --md-sys-color-${role.token}: ${set.colors[role.token]};`,
    ),
    ...SHAPE_TOKENS.map(
      (shape) =>
        `  --md-sys-shape-corner-${shape.token}: ${set.shapes[shape.token]}px;`,
    ),
    "}",
  ];
  return lines.join("\n");
}

/** File format of an exported theme: both colour schemes plus shared shape and type. */
export interface ThemeFile {
  format: "bolle-tokens";
  version: 1;
  density: Density;
  light: TokenSet;
  dark: TokenSet;
}

export function exportThemeJson(
  palettes: Record<ThemeName, TokenSet>,
  density: Density,
): string {
  const file: ThemeFile = {
    format: "bolle-tokens",
    version: 1,
    density,
    light: palettes.light,
    dark: palettes.dark,
  };
  return `${JSON.stringify(file, null, 2)}\n`;
}

/** Light values on :root, dark colours under [data-theme="dark"]; ready for a stylesheet. */
export function exportThemeCss(palettes: Record<ThemeName, TokenSet>): string {
  const dark = [
    ':root[data-theme="dark"] {',
    ...COLOR_ROLES.map(
      (role) => `  --md-sys-color-${role.token}: ${palettes.dark.colors[role.token]};`,
    ),
    "}",
  ];
  return `${tokensCss(palettes.light)}\n\n${dark.join("\n")}\n`;
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/** Fills a partial token set from a fallback, keeping only valid values. */
function cleanSet(input: unknown, fallback: TokenSet): TokenSet {
  const source = (input ?? {}) as Partial<TokenSet>;
  const colors = { ...fallback.colors };
  for (const role of COLOR_ROLES) {
    const value = source.colors?.[role.token];
    if (typeof value === "string" && HEX_COLOR.test(value)) colors[role.token] = value.toLowerCase();
  }
  const shapes = { ...fallback.shapes };
  for (const shape of SHAPE_TOKENS) {
    const value = Number(source.shapes?.[shape.token]);
    if (Number.isFinite(value) && value >= 0 && value <= 200) shapes[shape.token] = value;
  }
  const font = (value: unknown, current: string) =>
    typeof value === "string" && value in FONT_STACKS ? value : current;
  const size = Number(source.baseSize);
  return {
    colors,
    shapes,
    brandFont: font(source.brandFont, fallback.brandFont),
    plainFont: font(source.plainFont, fallback.plainFont),
    baseSize: Number.isFinite(size) && size >= 10 && size <= 24 ? size : fallback.baseSize,
  };
}

export interface ImportResult {
  palettes: Record<ThemeName, TokenSet>;
  density?: Density;
  /** Number of values read from the file, to tell the user what happened. */
  count: number;
}

/** Reads `--md-sys-color-*`, shape, typeface and font-size declarations from a CSS block. */
function readCssBlock(block: string, base: TokenSet): { set: TokenSet; count: number } {
  const set: TokenSet = { ...base, colors: { ...base.colors }, shapes: { ...base.shapes } };
  let count = 0;
  for (const [, name, raw] of block.matchAll(/(--[\w-]+|font-size)\s*:\s*([^;]+);/g)) {
    const value = raw.trim();
    const color = /^--md-sys-color-(.+)$/.exec(name)?.[1];
    const shape = /^--md-sys-shape-corner-(.+)$/.exec(name)?.[1];
    if (color && color in set.colors && HEX_COLOR.test(value)) {
      set.colors[color] = value.toLowerCase();
      count += 1;
    } else if (shape && shape in set.shapes && /^\d+(\.\d+)?px$/.test(value)) {
      set.shapes[shape] = parseFloat(value);
      count += 1;
    } else if (name === "font-size" && /^\d+px$/.test(value)) {
      set.baseSize = parseInt(value, 10);
      count += 1;
    } else if (name === "--md-ref-typeface-brand" || name === "--md-ref-typeface-plain") {
      const key = FONT_KEYS.find((item) => FONT_STACKS[item] === value);
      if (key) {
        if (name.endsWith("brand")) set.brandFont = key;
        else set.plainFont = key;
        count += 1;
      }
    }
  }
  return { set, count };
}

/** Accepts a Bolle JSON export or a CSS file; throws a readable error otherwise. */
export function importTheme(
  text: string,
  current: Record<ThemeName, TokenSet>,
): ImportResult {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) {
    let data: Partial<ThemeFile>;
    try {
      data = JSON.parse(trimmed);
    } catch {
      throw new Error(l("Il file JSON non è valido."));
    }
    if (data.format !== "bolle-tokens" || !data.light)
      throw new Error(l("Il JSON non è un'esportazione dei token Bolle."));
    const density = DENSITY_PRESETS.some((item) => item.id === data.density)
      ? data.density
      : undefined;
    return {
      palettes: {
        light: cleanSet(data.light, current.light),
        dark: cleanSet(data.dark ?? data.light, current.dark),
      },
      density,
      count: COLOR_ROLES.length * 2,
    };
  }
  const darkMatch = /\[data-theme=["']?dark["']?\][^{]*\{([^}]*)\}/.exec(trimmed);
  const lightMatch = /(?:^|\})\s*:root\s*\{([^}]*)\}/.exec(trimmed);
  if (!lightMatch && !darkMatch)
    throw new Error(l("Nessun blocco :root o [data-theme=\"dark\"] trovato nel CSS."));
  const light = lightMatch ? readCssBlock(lightMatch[1], current.light) : { set: current.light, count: 0 };
  const darkBase: TokenSet = {
    ...current.dark,
    shapes: light.set.shapes,
    brandFont: light.set.brandFont,
    plainFont: light.set.plainFont,
    baseSize: light.set.baseSize,
  };
  const dark = darkMatch ? readCssBlock(darkMatch[1], darkBase) : { set: darkBase, count: 0 };
  const count = light.count + dark.count;
  if (count === 0) throw new Error(l("Il CSS non contiene token Bolle riconosciuti."));
  return { palettes: { light: light.set, dark: dark.set }, count };
}
