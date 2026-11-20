// Regenerates the catalogue part of docs/<locale>/vue.md and react.md from the
// sources the site already uses: the catalog entries, the anatomy of every
// component and the first recipe of each one. The prose before the catalogue is
// hand-written and stays untouched, so the guides cannot drift from the library.
// Usage: node scripts/framework-guides.mjs [--check]
import { readFile, writeFile } from "node:fs/promises";
import prettier from "prettier";

const locales = ["it", "en", "fr", "zh"];
const translatedLocales = ["en", "fr", "zh"];
const frameworks = ["vue", "react"];
const check = process.argv.includes("--check");
const catalogueMarker = "<!-- catalogue -->";

const labels = {
  it: {
    heading: "Catalogo dei componenti",
    intro:
      "Ogni componente elenca attributi, proprietà JavaScript, slot ed eventi pubblici; l'esempio è quello della prima ricetta della documentazione del sito, già scritta per questo framework.",
    attributes: "Attributi",
    properties: "Proprietà JavaScript",
    slots: "Slot",
    events: "Eventi",
    none: "nessuno",
    others: "Altre ricette",
  },
  en: {
    heading: "Component catalogue",
    intro:
      "Every component lists its attributes, JavaScript properties, slots and public events; the example is the first recipe of the site documentation, already written for this framework.",
    attributes: "Attributes",
    properties: "JavaScript properties",
    slots: "Slots",
    events: "Events",
    none: "none",
    others: "More recipes",
  },
  fr: {
    heading: "Catalogue des composants",
    intro:
      "Chaque composant liste ses attributs, propriétés JavaScript, slots et événements publics ; l'exemple est celui de la première recette de la documentation du site, déjà écrite pour ce framework.",
    attributes: "Attributs",
    properties: "Propriétés JavaScript",
    slots: "Slots",
    events: "Événements",
    none: "aucun",
    others: "Autres recettes",
  },
  zh: {
    heading: "组件目录",
    intro:
      "每个组件列出属性、JavaScript 属性、插槽与公开事件；示例取自站点文档的第一条配方，已按该框架编写。",
    attributes: "属性",
    properties: "JavaScript 属性",
    slots: "插槽",
    events: "事件",
    none: "无",
    others: "更多配方",
  },
};

const anatomy = JSON.parse(
  await readFile("site/component-anatomy.json", "utf8"),
);
const catalog = await readFile("site/catalog.ts", "utf8");
const recipes = await readFile("site/recipes.ts", "utf8");
const entries = [...catalog.matchAll(/\n {4}tag: "(bolle-[a-z-]+)",/g)].map(
  (m) => m[1],
);

const dictionaries = {};
for (const locale of translatedLocales) {
  const source = await readFile(`site/locales/${locale}.ts`, "utf8");
  const pairs = new Map();
  for (const match of source.matchAll(
    /^\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')\s*:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'),?$/gm,
  )) {
    const key = match[1] ?? match[2];
    const value = match[3] ?? match[4];
    if (key !== undefined && value !== undefined)
      pairs.set(key.replace(/\\"/g, '"'), value.replace(/\\"/g, '"'));
  }
  dictionaries[locale] = pairs;
}
const translate = (locale, text) =>
  locale === "it" ? text : (dictionaries[locale].get(text) ?? text);

// The array of recipes is delimited by the next component key, because a code
// sample may contain a line that looks like the end of the array.
const recipeStarts = [...recipes.matchAll(/^ {2}"(bolle-[a-z-]+)": \[/gm)].map(
  (match) => ({ tag: match[1], index: match.index }),
);
const recipesEnd = recipes.lastIndexOf("\n  ],\n};");
const recipeOf = (tag) => {
  const at = recipeStarts.findIndex((item) => item.tag === tag);
  if (at === -1) return undefined;
  const start = recipeStarts[at].index;
  const end = recipeStarts[at + 1]?.index ?? recipesEnd;
  const block = recipes.slice(start, end);
  const titles = [...block.matchAll(/\n {6}title: "([^"]+)"/g)].map(
    (m) => m[1],
  );
  const descriptions = [
    ...block.matchAll(/\n {6}description:\n {8}"((?:[^"\\]|\\.)*)"/g),
  ].map((m) => m[1]);
  const codeStart = block.indexOf("\n      code: {");
  const codeEnd = block.indexOf("\n      },\n", codeStart);
  const codeBlock =
    codeStart === -1
      ? ""
      : block.slice(codeStart, codeEnd === -1 ? undefined : codeEnd);
  const code = {};
  const starts = [...codeBlock.matchAll(/\n {8}(html|vue|react): \`/g)];
  starts.forEach((match, index) => {
    const from = match.index + match[0].length;
    const next = starts[index + 1];
    const to = next ? next.index : codeBlock.lastIndexOf("`,");
    code[match[1]] = codeBlock
      .slice(from, to === -1 ? undefined : to)
      .replace(/`,\s*$/, "")
      // The recipes escape backticks and interpolations for their own template literal.
      .replace(/\\`/g, "`")
      .replace(/\\\$\{/g, "${")
      .trim();
  });
  return {
    title: titles[0] ?? "",
    description: descriptions[0] ?? "",
    titles,
    code,
  };
};

const componentClass = (tag) =>
  `Bolle${tag
    .replace(/^bolle-/, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")}`;

const list = (items) => (items.length ? items.join(", ") : "-");

const section = (tag, locale, framework) => {
  const anatomyOf = anatomy[componentClass(tag)] ?? {
    slots: [],
    attributes: [],
    events: [],
  };
  const text = labels[locale];
  const attributes = anatomyOf.attributes
    .filter((row) => row.attribute)
    .map((row) => `\`${row.attribute}\``);
  const properties = anatomyOf.attributes
    .filter((row) => !row.attribute)
    .map((row) => `\`${row.name}\``);
  const slots = anatomyOf.slots.map((slot) => `\`${slot}\``);
  const events = anatomyOf.events.map((event) => `\`${event}\``);
  const recipe = recipeOf(tag);
  const summary = [
    attributes.length ? `${text.attributes}: ${list(attributes)}` : "",
    properties.length ? `${text.properties}: ${list(properties)}` : "",
    `${text.slots}: ${list(slots)}`,
    `${text.events}: ${list(events)}`,
  ].filter(Boolean);
  const lines = [`### ${tag}`, "", summary.join(" · "), ""];
  if (recipe && recipe.code[framework]) {
    lines.push(
      `**${translate(locale, recipe.title)}** — ${translate(locale, recipe.description)}`,
      "",
      "```" + (framework === "react" ? "jsx" : framework),
      recipe.code[framework].trim(),
      "```",
    );
    const others = recipe.titles.slice(1);
    if (others.length)
      lines.push(
        "",
        `${text.others}: ${others.map((title) => translate(locale, title)).join(" · ")}`,
      );
  }
  return lines.join("\n");
};

let failed = false;
for (const locale of locales) {
  for (const framework of frameworks) {
    const path = `docs/${locale}/${framework}.md`;
    const source = await readFile(path, "utf8");
    const marker = source.indexOf(catalogueMarker);
    const head = source.slice(0, marker);
    const body = [
      catalogueMarker,
      "",
      `## ${labels[locale].heading}`,
      "",
      labels[locale].intro,
      "",
      ...entries.map((tag) => `${section(tag, locale, framework)}\n`),
    ].join("\n");
    const next = await prettier.format(`${head}${body}`, {
      ...(await prettier.resolveConfig(path)),
      filepath: path,
    });
    if (check) {
      if (next !== source) {
        failed = true;
        console.error(`${path}: da rigenerare`);
      }
      continue;
    }
    await writeFile(path, next);
    console.log(`${path}: ${entries.length} componenti`);
  }
}
if (check && failed) process.exitCode = 1;
