import { readFile, readdir, writeFile } from "node:fs/promises";

const sources = new Map();
for (const name of await readdir("src")) {
  if (!name.endsWith(".ts")) continue;
  const text = await readFile(`src/${name}`, "utf8");
  for (const match of text.matchAll(
    /\bclass\s+([A-Za-z0-9_]+)(?:\s+extends\s+([A-Za-z0-9_]+))?[^{]*\{/g,
  )) {
    const start = match.index;
    const rest = text.slice(start + match[0].length);
    const next = rest.search(
      /\nexport class\s|\nexport function\s|\nexport interface\s|\n$/,
    );
    sources.set(match[1], {
      block: text.slice(
        start,
        next === -1 ? text.length : start + match[0].length + next,
      ),
      parent: match[2] ?? "",
    });
  }
}

const slotNames = (block) => {
  const names = new Set();
  for (const match of block.matchAll(/<slot\b[^>]*>/g)) {
    const literal = /\bname="([^"]+)"/.exec(match[0])?.[1];
    const template = /\bname=\$\{`([^`]+)`\}/.exec(match[0])?.[1];
    names.add(
      literal ?? template?.replace(/\$\{[^}]+\}/g, "{id}") ?? "default",
    );
  }
  return [...names];
};

const partNames = (block) => {
  const names = new Set();
  for (const match of block.matchAll(/part="([^"]+)"/g))
    for (const name of match[1].split(/\s+/)) if (name) names.add(name);
  for (const match of block.matchAll(/part=\$\{([^}]+)\}/g))
    for (const literal of match[1].matchAll(/["'`]([^"'`]+)["'`]/g))
      for (const name of literal[1].split(/\s+/)) if (name) names.add(name);
  return [...names];
};

const result = {};
for (const component of sources.keys()) {
  const slots = new Set();
  const parts = new Set();
  let current = component;
  const visited = new Set();
  while (current && !visited.has(current)) {
    visited.add(current);
    const found = sources.get(current);
    if (!found) break;
    for (const slot of slotNames(found.block)) slots.add(slot);
    for (const part of partNames(found.block)) parts.add(part);
    if (
      ["LitElement", "BolleElement", "BolleFormElement"].includes(found.parent)
    )
      break;
    current = found.parent;
  }
  result[component] = {
    slots: [...slots].sort(),
    parts: [...parts].sort(),
  };
}

await writeFile(
  "site/component-anatomy.json",
  `${JSON.stringify(result, null, 2)}\n`,
);
