// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
// Dati finti ma realistici: commesse di un'impresa edile e impiantistica.

export type JobStatus =
  | "offerta"
  | "pianificata"
  | "in-corso"
  | "sospesa"
  | "collaudo"
  | "chiusa";

export interface Job {
  id: string;
  code: string;
  title: string;
  client: string;
  city: string;
  status: JobStatus;
  manager: string;
  amount: number;
  progress: number;
  due: string;
  started: string;
  phases: { name: string; progress: number }[];
  notes: string;
}

export const STATUS_LABEL: Record<JobStatus, string> = {
  offerta: "In offerta",
  pianificata: "Pianificata",
  "in-corso": "In corso",
  sospesa: "Sospesa",
  collaudo: "In collaudo",
  chiusa: "Chiusa",
};

export const MANAGERS = [
  "Giulia Ferraro",
  "Marco Bellini",
  "Sara Colombo",
  "Luca De Santis",
  "Francesca Moretti",
  "Davide Rinaldi",
  "Elena Galli",
  "Alessandro Conti",
];

const CLIENTS = [
  "Comune di Bergamo",
  "Immobiliare Lago Srl",
  "Condominio Via Manzoni 14",
  "ASST Papa Giovanni XXIII",
  "Fondazione Carlo Rossi Onlus",
  "Logistica Padana SpA",
  "Hotel Bellavista Sirmione",
  "Istituto Comprensivo Seriate",
  "Parrocchia San Giorgio",
  "Agricola Valcalepio",
  "Metalmeccanica Orobica Srl",
  "Provincia di Brescia",
  "Residenza Le Querce",
  "Banca di Credito Cooperativo",
  "Supermercati Brianza",
];

const CITIES = [
  "Bergamo",
  "Brescia",
  "Seriate",
  "Treviglio",
  "Dalmine",
  "Sirmione",
  "Lovere",
  "Clusone",
  "Romano di Lombardia",
  "Caravaggio",
  "Palazzolo sull'Oglio",
  "Sarnico",
];

const WORKS = [
  "Rifacimento impianto elettrico",
  "Ristrutturazione facciata e cappotto termico",
  "Nuovo impianto fotovoltaico da 60 kWp",
  "Adeguamento antincendio",
  "Manutenzione straordinaria copertura",
  "Riqualificazione centrale termica",
  "Ampliamento capannone logistico",
  "Impianto di climatizzazione VRF",
  "Rifacimento bagni e impianto idrico",
  "Bonifica amianto e nuova copertura",
  "Cablaggio strutturato e rete dati",
  "Illuminazione pubblica a LED",
  "Messa a norma quadri elettrici",
  "Nuova pavimentazione industriale",
  "Consolidamento solai",
];

const PLACES = [
  "scuola primaria",
  "palazzina uffici",
  "reparto di degenza",
  "magazzino nord",
  "sede centrale",
  "corpo B",
  "parcheggio interrato",
  "palestra comunale",
  "ala est",
  "piano terra e primo",
];

const PHASES = ["Progettazione", "Approvvigionamento", "Cantiere", "Collaudo"];

const NOTES = [
  "In attesa del nulla osta dei Vigili del Fuoco per la chiusura dei lavori.",
  "Il cliente ha chiesto una variante sui corpi illuminanti: preventivo inviato il 3 novembre.",
  "Accesso al cantiere solo dalle 7:30 alle 16:00, ritiro chiavi in portineria.",
  "Fornitura pannelli in ritardo di due settimane, già avvisato il direttore lavori.",
  "Sopralluogo congiunto con l'ufficio tecnico comunale fissato per il prossimo martedì.",
  "Nessuna criticità aperta.",
];

/** Mulberry32: same data on every load, so the walk-through is repeatable. */
function random(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TODAY = new Date(2026, 10, 16);
const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function makeJobs(count: number): Job[] {
  const next = random(20261116);
  const pick = <T>(list: T[]) => list[Math.floor(next() * list.length)];
  const statuses: JobStatus[] = [
    "in-corso",
    "in-corso",
    "in-corso",
    "pianificata",
    "pianificata",
    "offerta",
    "collaudo",
    "sospesa",
    "chiusa",
    "chiusa",
  ];
  return Array.from({ length: count }, (_, index) => {
    const status = pick(statuses);
    const progress =
      status === "chiusa"
        ? 100
        : status === "offerta"
          ? 0
          : status === "pianificata"
            ? Math.round(next() * 8)
            : status === "collaudo"
              ? 90 + Math.round(next() * 9)
              : 10 + Math.round(next() * 80);
    const started = new Date(TODAY);
    started.setDate(started.getDate() - Math.round(next() * 420));
    const due = new Date(started);
    due.setDate(due.getDate() + 60 + Math.round(next() * 480));
    const work = pick(WORKS);
    const title = next() < 0.55 ? `${work} – ${pick(PLACES)}` : work;
    const year = 2024 + Math.floor(next() * 3);
    return {
      id: `job-${index + 1}`,
      code: `C${year}-${String(1000 + index).padStart(4, "0")}`,
      title,
      client: pick(CLIENTS),
      city: pick(CITIES),
      status,
      manager: pick(MANAGERS),
      amount: Math.round((8000 + next() * next() * 1_400_000) / 50) * 50,
      progress,
      due: iso(due),
      started: iso(started),
      phases: PHASES.map((name, phase) => ({
        name,
        progress: Math.max(
          0,
          Math.min(100, Math.round(progress * 1.6 - phase * 38 + next() * 10)),
        ),
      })),
      notes: pick(NOTES),
    };
  });
}

export const TODAY_ISO = iso(TODAY);
