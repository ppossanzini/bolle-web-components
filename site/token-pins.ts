// Colour roles the reader fixes by hand. A pinned role keeps its exact value; every
// other role of the same family is rebuilt from the pinned colour's own palette, and
// the text that sits on a pinned colour takes the most readable tone of that palette.
import {
  Hct,
  TonalPalette,
  argbFromHex,
  hexFromArgb,
} from "@material/material-color-utilities";
import { contrastRatio } from "./color-math.js";

/** Roles of a colour family and the Material tone each one reads in light and dark. */
type Tone = [light: number, dark: number];

interface FamilyRole {
  token: string;
  tone: Tone;
}

/** Families that carry a hue: the three Material accents plus the semantic ones. */
export const FAMILIES = [
  "primary",
  "secondary",
  "tertiary",
  "error",
  "success",
  "warning",
] as const;

/** Roles of a family and the Material tone of each one, shared with the generator. */
export const familyRoles = (name: string): FamilyRole[] => {
  const roles: FamilyRole[] = [
    { token: name, tone: [40, 80] },
    { token: `on-${name}`, tone: [100, 20] },
    { token: `${name}-container`, tone: [90, 30] },
    { token: `on-${name}-container`, tone: [10, 90] },
    { token: `${name}-fixed`, tone: [90, 90] },
    { token: `${name}-fixed-dim`, tone: [80, 80] },
    { token: `on-${name}-fixed`, tone: [10, 10] },
    { token: `on-${name}-fixed-variant`, tone: [30, 30] },
  ];
  // Surface tint and the inverse role exist for the primary family only.
  if (name === "primary")
    roles.push(
      { token: "surface-tint", tone: [40, 80] },
      { token: "inverse-primary", tone: [80, 40] },
    );
  return roles;
};

/** Text and icon colour that sits on a base role, with its Material default tone. */
export interface TextPair {
  base: string;
  on: string;
  tone: Tone;
  /**
   * The base is a chosen colour rather than a derived one: its text follows it as soon
   * as it changes, without waiting for a generation.
   */
  always?: boolean;
}

export const TEXT_PAIRS: TextPair[] = [
  { base: "primary", on: "on-primary", tone: [100, 20] },
  { base: "primary-container", on: "on-primary-container", tone: [10, 90] },
  { base: "secondary", on: "on-secondary", tone: [100, 20] },
  { base: "secondary-container", on: "on-secondary-container", tone: [10, 90] },
  { base: "tertiary", on: "on-tertiary", tone: [100, 20] },
  { base: "tertiary-container", on: "on-tertiary-container", tone: [10, 90] },
  { base: "error", on: "on-error", tone: [100, 20] },
  { base: "error-container", on: "on-error-container", tone: [10, 90] },
  { base: "success", on: "on-success", tone: [100, 20] },
  { base: "success-container", on: "on-success-container", tone: [10, 90] },
  { base: "warning", on: "on-warning", tone: [100, 20] },
  { base: "warning-container", on: "on-warning-container", tone: [10, 90] },
  { base: "surface", on: "on-surface", tone: [10, 90] },
  { base: "surface-variant", on: "on-surface-variant", tone: [30, 80] },
  { base: "inverse-surface", on: "inverse-on-surface", tone: [95, 20] },
  { base: "primary-fixed", on: "on-primary-fixed", tone: [10, 10] },
  {
    base: "primary-fixed",
    on: "on-primary-fixed-variant",
    tone: [30, 30],
  },
  { base: "secondary-fixed", on: "on-secondary-fixed", tone: [10, 10] },
  {
    base: "secondary-fixed",
    on: "on-secondary-fixed-variant",
    tone: [30, 30],
  },
  { base: "tertiary-fixed", on: "on-tertiary-fixed", tone: [10, 10] },
  {
    base: "tertiary-fixed",
    on: "on-tertiary-fixed-variant",
    tone: [30, 30],
  },
  { base: "accent", on: "on-accent", tone: [100, 20], always: true },
];

const TONES = [
  0, 4, 6, 10, 12, 17, 20, 22, 24, 25, 30, 35, 40, 50, 60, 70, 80, 87, 90, 92,
  94, 95, 96, 98, 100,
];

const HEX = /^#[0-9a-f]{6}$/i;

/** Palette of one colour: its own hue and chroma, at any tone. */
const paletteOf = (hex: string) => {
  const hct = Hct.fromInt(argbFromHex(hex));
  return TonalPalette.fromHueAndChroma(hct.hue, hct.chroma);
};

/** WCAG AA for body text: the threshold a repaired text colour has to reach. */
const MIN_CONTRAST = 4.5;

/**
 * Tone of `palette` to write on `base`: among the tones that reach WCAG AA the one
 * closest to the Material default wins, so a repaired pair keeps the hue of its family
 * instead of collapsing to black or white. When no tone reaches AA the most contrasting
 * one is used and the contrast report shows the shortfall.
 */
export const readableTone = (
  palette: TonalPalette,
  base: string,
  preferred: number,
): string => {
  const candidates = TONES.map((tone) => {
    const hex = hexFromArgb(palette.tone(tone));
    return { tone, hex, ratio: contrastRatio(hex, base) };
  });
  const readable = candidates.filter(
    (candidate) => candidate.ratio >= MIN_CONTRAST,
  );
  if (readable.length > 0)
    return readable.reduce((winner, candidate) =>
      Math.abs(candidate.tone - preferred) < Math.abs(winner.tone - preferred)
        ? candidate
        : winner,
    ).hex;
  return candidates.reduce((winner, candidate) =>
    candidate.ratio > winner.ratio ? candidate : winner,
  ).hex;
};

const validPins = (
  pins: Record<string, string>,
  colors: Record<string, string>,
) =>
  Object.fromEntries(
    Object.entries(pins).filter(
      ([role, value]) => role in colors && HEX.test(value),
    ),
  );

/**
 * Applies the pinned roles to a generated scheme and adapts everything they govern.
 * `colors` comes from the algorithm, `pins` maps a role to the colour the reader wants,
 * `dark` selects which tones of each palette the scheme is read in.
 */
export function applyPins(
  colors: Record<string, string>,
  pins: Record<string, string>,
  dark: boolean,
): Record<string, string> {
  const fixed = validPins(pins, colors);
  const next = { ...colors, ...fixed };
  const rebuilt = new Set<string>();
  for (const family of FAMILIES) {
    const source = fixed[family];
    if (!source) continue;
    const palette = paletteOf(source);
    for (const role of familyRoles(family)) {
      if (role.token in fixed || !(role.token in next)) continue;
      next[role.token] = hexFromArgb(palette.tone(role.tone[dark ? 1 : 0]));
      rebuilt.add(role.token);
    }
  }
  for (const { base, on, tone } of TEXT_PAIRS) {
    if (on in fixed || !(on in next)) continue;
    // The text follows a base that was fixed by hand or rebuilt from a pin.
    if (!(base in fixed) && !rebuilt.has(base)) continue;
    const text = readableTone(
      paletteOf(next[base]),
      next[base],
      tone[dark ? 1 : 0],
    );
    if (text !== next[on]) next[on] = text;
  }
  return next;
}

/**
 * Adapts the text of a chosen base colour that is not part of a derived family, such as
 * the Bolle accent, without waiting for a generation.
 */
export const adaptText = (
  colors: Record<string, string>,
  base: string,
  dark: boolean,
): Record<string, string> => {
  const pair = TEXT_PAIRS.find((item) => item.base === base && item.always);
  if (!pair || !(base in colors)) return colors;
  return {
    ...colors,
    [pair.on]: readableTone(
      paletteOf(colors[base]),
      colors[base],
      pair.tone[dark ? 1 : 0],
    ),
  };
};

/** Pairs whose text colour a pin decides, for the contrast report of the generator. */
export const pinnedPairs = (pins: Record<string, string>): TextPair[] =>
  TEXT_PAIRS.filter(({ base }) => base in pins);
