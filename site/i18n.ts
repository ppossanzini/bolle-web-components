import { supportedLocale } from "../src/index.js";
import en from "./locales/en.js";
import fr from "./locales/fr.js";
import zh from "./locales/zh.js";

export type Locale = "it" | "en" | "fr" | "zh";

export const LOCALES: { id: Locale; label: string; tag: string }[] = [
  { id: "it", label: "Italiano", tag: "it" },
  { id: "en", label: "English", tag: "en" },
  { id: "fr", label: "Français", tag: "fr" },
  { id: "zh", label: "中文", tag: "zh-CN" },
];

/** Italian source text → translation. Missing entries fall back to the Italian text. */
const DICTIONARIES: Record<Exclude<Locale, "it">, Record<string, string>> = { en, fr, zh };

let current: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  LOCALES.some((locale) => locale.id === value);

/** First supported browser language; English when none is supported. */
export function browserLocale(): Locale {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const language = tag.toLowerCase().split(/[-_]/)[0];
    if (isLocale(language)) return language;
  }
  return "en";
}

export function setLocale(locale: Locale) {
  current = locale;
  const tag = LOCALES.find((item) => item.id === locale)?.tag ?? locale;
  document.documentElement.lang = tag;
}

export const locale = () => current;

/** Library message set for the current site language. */
export const libraryLocale = () => supportedLocale(current);

/**
 * Translates an Italian source string. `{name}` placeholders are filled from `params`
 * after translation, so word order can change per language.
 */
export function l(text: string, params?: Record<string, string | number>): string {
  const translated = current === "it" ? text : (DICTIONARIES[current][text] ?? text);
  if (!params) return translated;
  return translated.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );
}

/** Hash for a route in the current language, e.g. `#/en/bolle-button`. */
export const routeHref = (route = "") => `#/${current}/${route}`;

/**
 * Marks Italian text stored in module-level data (catalog summaries, control labels,
 * demo items). It returns the text unchanged: the code that renders it calls `l()`.
 * The key extractor collects both `l("…")` and `m("…")`.
 */
export const m = (text: string) => text;
