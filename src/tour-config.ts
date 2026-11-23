import type { TourPlacement, TourStep } from "./tour.js";

/**
 * Versioned tour configuration, as written in the JSON file an application ships:
 *
 * ```json
 * {
 *   "version": "3",
 *   "placement": "auto",
 *   "steps": [
 *     { "target": "#filters", "title": "Filtra le commesse", "body": "…" },
 *     { "title": "Ci siamo", "actionLabel": "Apri il cruscotto" }
 *   ]
 * }
 * ```
 *
 * A new `version` is what tells the application the tour changed: the reader sees the
 * new one, and the application keeps the version it already showed wherever it stores
 * its own state.
 */
export interface TourConfig {
  version: string;
  placement?: TourPlacement;
  steps: TourStep[];
}

const PLACEMENTS: TourPlacement[] = ["auto", "top", "bottom", "start", "end"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readText = (value: unknown, where: string, required: boolean) => {
  if (value === undefined || value === null || value === "") {
    if (required) throw new Error(`${where} is missing.`);
    return undefined;
  }
  if (typeof value !== "string") throw new Error(`${where} must be a string.`);
  return value;
};

const readPlacement = (value: unknown, where: string) => {
  const placement = readText(value, where, false);
  if (placement === undefined) return undefined;
  if (!PLACEMENTS.includes(placement as TourPlacement))
    throw new Error(`${where} must be one of ${PLACEMENTS.join(", ")}.`);
  return placement as TourPlacement;
};

/**
 * Reads a tour configuration from JSON text or from an already parsed value.
 * Throws with the position of the first step that is not valid.
 */
export function parseTourConfig(input: string | unknown): TourConfig {
  let data: unknown = input;
  if (typeof input === "string") {
    try {
      data = JSON.parse(input);
    } catch {
      throw new Error("The tour configuration is not valid JSON.");
    }
  }
  if (!isRecord(data))
    throw new Error("The tour configuration must be an object.");
  const version = readText(data.version, "version", true)!;
  const placement = readPlacement(data.placement, "placement");
  if (!Array.isArray(data.steps) || data.steps.length === 0)
    throw new Error("steps must be a non-empty array.");
  const steps = data.steps.map((raw, position): TourStep => {
    const where = `steps[${position}]`;
    if (!isRecord(raw)) throw new Error(`${where} must be an object.`);
    return {
      title: readText(raw.title, `${where}.title`, true)!,
      target: readText(raw.target, `${where}.target`, false),
      body: readText(raw.body, `${where}.body`, false),
      placement: readPlacement(raw.placement, `${where}.placement`),
      actionLabel: readText(raw.actionLabel, `${where}.actionLabel`, false),
    };
  });
  return { version, placement, steps };
}

/**
 * Whether the tour has to run, given the version the reader has already seen. The
 * application owns that memory: the helper only compares the two values.
 */
export function shouldStartTour(
  config: TourConfig,
  seenVersion?: string | null,
): boolean {
  return config.version !== (seenVersion ?? "");
}
