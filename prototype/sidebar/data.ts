// PROTOTIPO USA E GETTA. Non promuovere a codice di produzione.
import dashboard from "@tabler/icons/outline/layout-dashboard.svg?raw";
import briefcase from "@tabler/icons/outline/briefcase.svg?raw";
import packageIcon from "@tabler/icons/outline/package.svg?raw";
import tool from "@tabler/icons/outline/tool.svg?raw";
import invoice from "@tabler/icons/outline/file-invoice.svg?raw";
import users from "@tabler/icons/outline/users.svg?raw";
import settings from "@tabler/icons/outline/settings.svg?raw";

export interface NavNode {
  id: string;
  label: string;
  icon?: string;
  count?: number;
  children?: NavNode[];
}

/** Navigation of a works and maintenance management application, three levels deep. */
export const navigation: NavNode[] = [
  { id: "cruscotto", label: "Cruscotto", icon: dashboard },
  {
    id: "commesse",
    label: "Commesse",
    icon: briefcase,
    count: 12,
    children: [
      {
        id: "attive",
        label: "Attive",
        count: 8,
        children: [
          { id: "cantieri", label: "Cantieri edili", count: 3 },
          { id: "impianti", label: "Impianti elettrici e termici", count: 4 },
          {
            id: "straordinaria",
            label: "Manutenzione straordinaria",
            count: 1,
          },
        ],
      },
      { id: "attesa", label: "In attesa di avvio", count: 4 },
      { id: "chiuse", label: "Chiuse" },
      {
        id: "preventivi",
        label: "Preventivi",
        children: [
          { id: "da-inviare", label: "Da inviare", count: 3 },
          { id: "inviati", label: "Inviati al cliente" },
          { id: "accettati", label: "Accettati" },
        ],
      },
    ],
  },
  {
    id: "magazzino",
    label: "Magazzino",
    icon: packageIcon,
    children: [
      { id: "articoli", label: "Articoli" },
      {
        id: "movimenti",
        label: "Movimenti",
        children: [
          { id: "carichi", label: "Carichi" },
          { id: "scarichi", label: "Scarichi" },
          { id: "trasferimenti", label: "Trasferimenti tra sedi" },
        ],
      },
      { id: "inventario", label: "Inventario annuale" },
      { id: "fornitori", label: "Fornitori" },
    ],
  },
  {
    id: "manutenzioni",
    label: "Manutenzioni",
    icon: tool,
    count: 5,
    children: [
      {
        id: "pianificate",
        label: "Pianificate",
        children: [
          { id: "settimana", label: "Settimana corrente" },
          { id: "mese", label: "Mese corrente" },
        ],
      },
      { id: "aperti", label: "Interventi aperti", count: 5 },
      { id: "storico", label: "Storico interventi" },
    ],
  },
  {
    id: "amministrazione",
    label: "Amministrazione",
    icon: invoice,
    count: 2,
    children: [
      {
        id: "fatture",
        label: "Fatture",
        children: [
          { id: "emesse", label: "Emesse" },
          { id: "ricevute", label: "Ricevute da registrare", count: 2 },
        ],
      },
      { id: "pagamenti", label: "Pagamenti" },
      { id: "scadenzario", label: "Scadenzario" },
    ],
  },
  {
    id: "anagrafiche",
    label: "Anagrafiche",
    icon: users,
    children: [
      { id: "clienti", label: "Clienti" },
      {
        id: "personale",
        label: "Personale",
        children: [
          { id: "tecnici", label: "Tecnici di cantiere" },
          { id: "uffici", label: "Personale d’ufficio" },
        ],
      },
      { id: "mezzi", label: "Mezzi e attrezzature" },
    ],
  },
  { id: "impostazioni", label: "Impostazioni", icon: settings },
];
