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
    let name = literal ?? template ?? "default";
    name = name
      .replace("${this.rowId(row)}", "{rowId}")
      .replace("${rowId}", "{rowId}")
      .replace("${column.key}", "{columnKey}")
      .replace("${columnKey}", "{columnKey}")
      .replace("${name}", "{groupName}")
      .replace("${lane}", "{lane}")
      .replace("${card.id}", "{cardId}")
      .replace("${item.id}", "{itemId}")
      .replace("${id}", "{id}");
    if (/^(cell-|detail-|row-)/.test(name))
      name = name.replace("{id}", "{rowId}");
    names.add(name);
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

const propertyNames = (block) => {
  const rows = [];
  for (const match of block.matchAll(
    /^\s{4}([A-Za-z_$][\w$]*):\s*(\{[^}]*\}|\{\s*[^)]*?\}|true|\{\})/gm,
  )) {
    const name = match[1];
    const spec = match[2];
    if (/\bstate:\s*true\b/.test(spec)) continue;
    const attribute = /\battribute:\s*false\b/.test(spec)
      ? ""
      : (/\battribute:\s*"([^"]+)"/.exec(spec)?.[1] ?? name.toLowerCase());
    const type = /\btype:\s*(Boolean|Number|String|Array|Object)\b/.exec(
      spec,
    )?.[1];
    rows.push({ name, attribute, type: type ?? "string" });
  }
  return rows;
};

const eventNames = (block) => {
  const names = new Set();
  for (const match of block.matchAll(/this\.emit(?:<[^>]*>)?\(\s*"([a-z-]+)"/g))
    names.add(match[1]);
  return [...names];
};

const result = {};
for (const component of sources.keys()) {
  const slots = new Set();
  const parts = new Set();
  const attributes = new Map();
  const events = new Set();
  let current = component;
  const visited = new Set();
  while (current && !visited.has(current)) {
    visited.add(current);
    const found = sources.get(current);
    if (!found) break;
    for (const slot of slotNames(found.block)) slots.add(slot);
    for (const part of partNames(found.block)) parts.add(part);
    for (const row of propertyNames(found.block))
      if (!attributes.has(row.name)) attributes.set(row.name, row);
    for (const name of eventNames(found.block)) events.add(name);
    if (
      ["LitElement", "BolleElement", "BolleFormElement"].includes(found.parent)
    )
      break;
    current = found.parent;
  }
  result[component] = {
    slots: [...slots].sort(),
    parts: [...parts].sort(),
    attributes: [...attributes.values()].sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
    events: [...events].sort(),
  };
}

await writeFile(
  "site/component-anatomy.json",
  `${JSON.stringify(result, null, 2)}\n`,
);
