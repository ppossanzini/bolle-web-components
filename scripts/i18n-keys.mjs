// Collects the Italian source strings passed to l("…"), m("…") and lh("…") in site/*.ts and
// reports, per locale, the keys missing from site/locales/<locale>.ts and the stale ones.
// Usage: node scripts/i18n-keys.mjs [--json]   (--json prints the missing keys per locale)
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const siteDir = join(root, "site");
const locales = ["en", "fr", "zh"];

// A double-quoted JS string literal, allowing escaped characters.
const literal = String.raw`"((?:[^"\\]|\\.)*)"`;
// A call site may pass the Italian key with either quote style.
const callDouble = new RegExp(String.raw`\b(?:l|m|lh)\(\s*${literal}`, "g");
const callSingle = /\b(?:l|m|lh)\(\s*'((?:[^'\\]|\\.)*)'/g;
// Recipe titles and descriptions reach l() through a variable, so they are read
// from their own fields instead of from a call.
// A recipe declares its own title and description with six spaces of indentation;
// the same words inside a code sample belong to the sample, not to the page.
const recipeField = new RegExp(
  String.raw`^ {6}(?:title|description):\s*${literal}`,
  "gm",
);
// The anatomy guides reach l() through a variable too: intro and purpose are
// read from their own fields.
const anatomyField = new RegExp(
  String.raw`\b(?:intro|purpose):\s*${literal}`,
  "g",
);

const unescape = (text) => JSON.parse(`"${text}"`);

const keys = new Set();
for (const file of readdirSync(siteDir)) {
  if (!file.endsWith(".ts") || file === "i18n.ts") continue;
  const source = readFileSync(join(siteDir, file), "utf8");
  for (const match of source.matchAll(callDouble)) keys.add(unescape(match[1]));
  for (const match of source.matchAll(callSingle))
    keys.add(match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\"));
  if (file === "recipes.ts")
    for (const match of source.matchAll(recipeField))
      keys.add(unescape(match[1]));
  if (file === "docs-app.ts")
    for (const match of source.matchAll(anatomyField))
      keys.add(unescape(match[1]));
}

const dictionary = (locale) => {
  const source = readFileSync(join(siteDir, "locales", `${locale}.ts`), "utf8");
  const pair = /^\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')\s*:/gm;
  return new Set(
    [...source.matchAll(pair)].map((match) =>
      match[1] !== undefined
        ? unescape(match[1])
        : match[2].replace(/\\'/g, "'").replace(/\\\\/g, "\\"),
    ),
  );
};

const report = {};
for (const locale of locales) {
  const present = dictionary(locale);
  report[locale] = {
    missing: [...keys].filter((key) => !present.has(key)).sort(),
    stale: [...present].filter((key) => !keys.has(key)).sort(),
  };
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ keys: [...keys].sort(), report }, null, 2));
} else {
  console.log(`${keys.size} keys`);
  for (const locale of locales)
    console.log(
      `${locale}: ${report[locale].missing.length} missing, ${report[locale].stale.length} stale`,
    );
  if (locales.some((locale) => report[locale].missing.length > 0))
    process.exitCode = 1;
}
