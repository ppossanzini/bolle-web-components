// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
// Dati finti ma realistici: lavori di un'impresa edile e impiantistica.

export type Phase = "programmato" | "in-corso" | "collaudo" | "chiuso";

export interface Card {
  id: string;
  code: string;
  title: string;
  client: string;
  city: string;
  manager: string;
  phase: Phase;
  due: string;
  progress: number;
  amount: number;
  tags: string[];
}

export interface Column {
  id: Phase;
  label: string;
  wip: number;
}

export const COLUMNS: Column[] = [
  { id: "programmato", label: "Programmato", wip: 0 },
  { id: "in-corso", label: "In corso", wip: 5 },
  { id: "collaudo", label: "Collaudo", wip: 3 },
  { id: "chiuso", label: "Chiuso", wip: 0 },
];

export const MANAGERS = [
  "Giulia Ferraro",
  "Marco Bellini",
  "Sara Colombo",
  "Luca De Santis",
  "Francesca Moretti",
];

const CLIENTS = [
  "Comune di Bergamo",
  "Immobiliare Lago Srl",
  "ASST Papa Giovanni XXIII",
  "Logistica Padana SpA",
  "Hotel Bellavista Sirmione",
  "Agricola Valcalepio",
  "Provincia di Brescia",
  "Fondazione Carlo Rossi Onlus",
];

const CITIES = ["Bergamo", "Brescia", "Seriate", "Treviglio", "Dalmine", "Clusone"];

const WORKS = [
  "Rifacimento impianto elettrico",
  "Ristrutturazione facciata e cappotto",
  "Nuovo impianto fotovoltaico 60 kWp",
  "Adeguamento antincendio",
  "Riqualificazione centrale termica",
  "Impianto di climatizzazione VRF",
  "Bonifica amianto e nuova copertura",
  "Cablaggio strutturato e rete dati",
  "Nuova pavimentazione industriale",
  "Illuminazione pubblica a LED",
];

const TAGS = ["Impianti", "Edilizia", "Sicurezza", "Energia", "Urgente", "Variante"];

const random = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const TODAY = new Date(2026, 10, 16);
const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const TODAY_ISO = iso(TODAY);

/** Seeded board: twelve jobs spread over the four phases. */
export function makeBoard(): Card[] {
  const next = random(16112026);
  const pick = <T,>(list: T[]) => list[Math.floor(next() * list.length)];
  const phases: Phase[] = [
    "programmato",
    "programmato",
    "programmato",
    "in-corso",
    "in-corso",
    "in-corso",
    "in-corso",
    "in-corso",
    "in-corso",
    "collaudo",
    "collaudo",
    "collaudo",
    "chiuso",
    "chiuso",
  ];
  return phases.map((phase, index) => {
    const started = new Date(TODAY);
    started.setDate(started.getDate() - Math.round(next() * 260));
    const due = new Date(TODAY);
    due.setDate(due.getDate() + Math.round(next() * 150) - 40);
    const progress =
      phase === "chiuso"
        ? 100
        : phase === "programmato"
          ? Math.round(next() * 10)
          : phase === "collaudo"
            ? 88 + Math.round(next() * 11)
            : 20 + Math.round(next() * 65);
    return {
      id: `card-${index + 1}`,
      code: `C${2025 + Math.floor(next() * 2)}-${1000 + index}`,
      title: pick(WORKS),
      client: pick(CLIENTS),
      city: pick(CITIES),
      manager: pick(MANAGERS),
      phase,
      due: iso(due),
      progress,
      amount: Math.round((12_000 + next() * next() * 640_000) / 50) * 50,
      tags: next() < 0.55 ? [pick(TAGS)] : next() < 0.8 ? [pick(TAGS), pick(TAGS)] : [],
    };
  });
}
