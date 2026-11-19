import { html, nothing, type TemplateResult } from "lit";
import { catalogue } from "../src/index.js";
import { entries } from "./catalog.js";
import { l, m, routeHref } from "./i18n.js";

/**
 * Interactive states the matrix reports. A cell names the public property that
 * exposes the state, so the table is derived from the component definitions and
 * reports a missing property instead of a claim nothing verifies.
 */
const STATES = [
  { key: "disabled", label: m("Disabilitato"), properties: ["disabled"] },
  { key: "error", label: m("Errore"), properties: ["error"] },
  {
    key: "selected",
    label: m("Selezionato"),
    properties: ["selected", "selectionMode", "checked"],
  },
  { key: "readonly", label: m("Sola lettura"), properties: ["readonly"] },
  {
    key: "busy",
    label: m("In corso"),
    properties: ["indeterminate", "loading"],
  },
] as const;

type StateName = (typeof STATES)[number]["key"];

const declaredProperties = (tag: string) => {
  const constructor = (
    catalogue as Record<string, { properties?: Record<string, unknown> }>
  )[tag];
  return new Set(Object.keys(constructor?.properties ?? {}));
};

export function stateMatrix() {
  return entries.map((entry) => {
    const properties = declaredProperties(entry.tag);
    const states = Object.fromEntries(
      STATES.map((state) => [
        state.key,
        state.properties.find((name) => properties.has(name)) ?? null,
      ]),
    ) as Record<StateName, string | null>;
    return { entry, states };
  });
}

/** Counts of entries that expose each state, used for the summary line. */
export function stateCoverage() {
  const rows = stateMatrix();
  return STATES.map((state) => ({
    key: state.key,
    label: state.label,
    count: rows.filter((row) => row.states[state.key]).length,
  }));
}

export function renderStateMatrix(): TemplateResult {
  const rows = stateMatrix();
  const covered = rows.filter((row) =>
    STATES.some((state) => row.states[state.key]),
  ).length;
  return html`<section class="state-matrix" id="stati">
    <h2>${l("Matrice degli stati")}</h2>
    <p>
      ${l(
        "Ogni cella riporta la proprietà pubblica che espone lo stato; il trattino indica che il componente non ha quello stato. {covered} componenti su {total} ne espongono almeno uno. Gli stati di interazione — hover, focus visibile e premuto — arrivano dal livello di stato condiviso di ogni superficie azionabile.",
        { covered, total: rows.length },
      )}
    </p>
    <div class="table-wrap">
      <table class="api-table">
        <thead>
          <tr>
            <th scope="col">${l("Componente")}</th>
            ${STATES.map(
              (state) => html`<th scope="col">${l(state.label)}</th>`,
            )}
          </tr>
        </thead>
        <tbody>
          ${rows.map(
            ({ entry, states }) =>
              html`<tr>
                <th scope="row">
                  <a href=${routeHref(entry.tag)}>${entry.title}</a>
                  <code>${entry.tag}</code>
                </th>
                ${STATES.map((state) => {
                  const property = states[state.key];
                  return html`<td>
                    ${property ? html`<code>${property}</code>` : nothing}
                  </td>`;
                })}
              </tr>`,
          )}
        </tbody>
      </table>
    </div>
  </section>`;
}
