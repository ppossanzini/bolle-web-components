// Dati della pagina di documentazione: commesse di un'impresa edile e impiantistica.

export interface LateJob {
  id: string;
  code: string;
  title: string;
  client: string;
  city: string;
  manager: string;
  days: number;
  progress: number;
  amount: number;
}

export interface SiteProgress {
  id: string;
  name: string;
  city: string;
  progress: number;
  people: number;
  phase: string;
}

export interface Activity {
  id: string;
  who: string;
  what: string;
  target: string;
  when: string;
  kind: "nota" | "foto" | "documento" | "collaudo";
}

export interface Load {
  id: string;
  name: string;
  jobs: number;
  hours: number;
  capacity: number;
}

export interface Kpi {
  id: string;
  label: string;
  value: string;
  detail: string;
  trend: "up" | "down" | "flat";
  trendLabel: string;
  tone: "primary" | "tertiary" | "error" | "secondary";
}

export const TODAY_LABEL = "lunedì 16 novembre 2026";

export const kpis: Kpi[] = [
  {
    id: "kpi-active",
    label: "Commesse attive",
    value: "42",
    detail: "su 248 in archivio",
    trend: "up",
    trendLabel: "+3 rispetto a ottobre",
    tone: "primary",
  },
  {
    id: "kpi-value",
    label: "Valore in corso",
    value: "12,4 Mln €",
    detail: "di cui 4,1 Mln da fatturare",
    trend: "up",
    trendLabel: "+8,2% nel trimestre",
    tone: "tertiary",
  },
  {
    id: "kpi-late",
    label: "Commesse in ritardo",
    value: "7",
    detail: "2 oltre i 30 giorni",
    trend: "down",
    trendLabel: "-2 rispetto a ottobre",
    tone: "error",
  },
  {
    id: "kpi-handover",
    label: "Collaudi questa settimana",
    value: "3",
    detail: "il primo giovedì alle 9:00",
    trend: "flat",
    trendLabel: "come la settimana scorsa",
    tone: "secondary",
  },
];

export const lateJobs: LateJob[] = [
  {
    id: "j1",
    code: "C2026-1119",
    title: "Consolidamento solai – palestra comunale",
    client: "Comune di Bergamo",
    city: "Bergamo",
    manager: "Marco Bellini",
    days: 41,
    progress: 62,
    amount: 389_350,
  },
  {
    id: "j2",
    code: "C2025-1044",
    title: "Rifacimento impianto elettrico – corpo B",
    client: "ASST Papa Giovanni XXIII",
    city: "Bergamo",
    manager: "Giulia Ferraro",
    days: 27,
    progress: 74,
    amount: 216_900,
  },
  {
    id: "j3",
    code: "C2026-1173",
    title: "Bonifica amianto e nuova copertura",
    client: "Metalmeccanica Orobica Srl",
    city: "Clusone",
    manager: "Sara Colombo",
    days: 19,
    progress: 48,
    amount: 408_600,
  },
  {
    id: "j4",
    code: "C2025-1012",
    title: "Impianto di climatizzazione VRF",
    client: "Hotel Bellavista Sirmione",
    city: "Sirmione",
    manager: "Francesca Moretti",
    days: 12,
    progress: 81,
    amount: 141_200,
  },
  {
    id: "j5",
    code: "C2024-0986",
    title: "Illuminazione pubblica a LED",
    client: "Provincia di Brescia",
    city: "Brescia",
    manager: "Davide Rinaldi",
    days: 9,
    progress: 88,
    amount: 98_400,
  },
  {
    id: "j6",
    code: "C2026-1155",
    title: "Riqualificazione centrale termica – ala est",
    client: "Fondazione Carlo Rossi Onlus",
    city: "Treviglio",
    manager: "Elena Galli",
    days: 6,
    progress: 35,
    amount: 187_500,
  },
];

export const siteProgress: SiteProgress[] = [
  {
    id: "s1",
    name: "Nuovo impianto fotovoltaico 60 kWp",
    city: "Dalmine",
    progress: 76,
    people: 9,
    phase: "Cantiere",
  },
  {
    id: "s2",
    name: "Ristrutturazione facciata e cappotto",
    city: "Seriate",
    progress: 54,
    people: 14,
    phase: "Cantiere",
  },
  {
    id: "s3",
    name: "Adeguamento antincendio – reparto di degenza",
    city: "Bergamo",
    progress: 91,
    people: 6,
    phase: "Collaudo",
  },
  {
    id: "s4",
    name: "Cablaggio strutturato e rete dati",
    city: "Brescia",
    progress: 38,
    people: 5,
    phase: "Approvvigionamento",
  },
  {
    id: "s5",
    name: "Nuova pavimentazione industriale",
    city: "Caravaggio",
    progress: 22,
    people: 11,
    phase: "Cantiere",
  },
];

export const activities: Activity[] = [
  {
    id: "a1",
    who: "Marco Bellini",
    what: "ha caricato 4 foto del getto sul solaio",
    target: "C2026-1119",
    when: "12 minuti fa",
    kind: "foto",
  },
  {
    id: "a2",
    who: "Sara Colombo",
    what: "ha spostato la scadenza al 4 dicembre",
    target: "C2026-1173",
    when: "48 minuti fa",
    kind: "nota",
  },
  {
    id: "a3",
    who: "Giulia Ferraro",
    what: "ha allegato il verbale di collaudo",
    target: "C2025-1044",
    when: "2 ore fa",
    kind: "documento",
  },
  {
    id: "a4",
    who: "Davide Rinaldi",
    what: "ha chiuso la commessa",
    target: "C2024-0986",
    when: "ieri, 17:40",
    kind: "collaudo",
  },
  {
    id: "a5",
    who: "Elena Galli",
    what: "ha chiesto un preventivo di variante",
    target: "C2026-1155",
    when: "ieri, 15:05",
    kind: "nota",
  },
];

export const load: Load[] = [
  { id: "l1", name: "Francesca Moretti", jobs: 9, hours: 42, capacity: 40 },
  { id: "l2", name: "Marco Bellini", jobs: 7, hours: 38, capacity: 40 },
  { id: "l3", name: "Giulia Ferraro", jobs: 6, hours: 33, capacity: 40 },
  { id: "l4", name: "Sara Colombo", jobs: 5, hours: 27, capacity: 40 },
  { id: "l5", name: "Davide Rinaldi", jobs: 4, hours: 19, capacity: 40 },
];

/** Fatturato degli ultimi dodici mesi, in migliaia di euro. */
export const revenue = [
  { month: "dic", value: 720 },
  { month: "gen", value: 610 },
  { month: "feb", value: 840 },
  { month: "mar", value: 905 },
  { month: "apr", value: 760 },
  { month: "mag", value: 1120 },
  { month: "giu", value: 1240 },
  { month: "lug", value: 690 },
  { month: "ago", value: 410 },
  { month: "set", value: 980 },
  { month: "ott", value: 1180 },
  { month: "nov", value: 640 },
];
