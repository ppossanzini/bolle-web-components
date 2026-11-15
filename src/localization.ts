export const pickerMessages = {
  en: {
    required: "Select an option.",
    open: "Open picker",
    cancel: "Cancel",
    confirm: "OK",
    previous: "Previous month",
    next: "Next month",
    month: "Month",
    year: "Year",
    start: "Start date",
    end: "End date",
    hour: "Hour",
    minute: "Minute",
    period: "AM or PM",
    input: "Use keyboard input",
    dial: "Use dial",
    hours: "hours",
    minutes: "minutes",
  },
  it: {
    required: "Seleziona un’opzione.",
    open: "Apri selettore",
    cancel: "Annulla",
    confirm: "OK",
    previous: "Mese precedente",
    next: "Mese successivo",
    month: "Mese",
    year: "Anno",
    start: "Data iniziale",
    end: "Data finale",
    hour: "Ora",
    minute: "Minuti",
    period: "AM o PM",
    input: "Usa tastiera",
    dial: "Usa quadrante",
    hours: "ore",
    minutes: "minuti",
  },
  fr: {
    required: "Sélectionnez une option.",
    open: "Ouvrir le sélecteur",
    cancel: "Annuler",
    confirm: "OK",
    previous: "Mois précédent",
    next: "Mois suivant",
    month: "Mois",
    year: "Année",
    start: "Date de début",
    end: "Date de fin",
    hour: "Heure",
    minute: "Minutes",
    period: "AM ou PM",
    input: "Saisir au clavier",
    dial: "Utiliser le cadran",
    hours: "heures",
    minutes: "minutes",
  },
  zh: {
    required: "请选择一个选项。",
    open: "打开选择器",
    cancel: "取消",
    confirm: "确定",
    previous: "上个月",
    next: "下个月",
    month: "月",
    year: "年",
    start: "开始日期",
    end: "结束日期",
    hour: "时",
    minute: "分",
    period: "上午或下午",
    input: "使用键盘输入",
    dial: "使用表盘",
    hours: "小时",
    minutes: "分钟",
  },
} as const;

export type SupportedLocale = "en" | "it" | "fr" | "zh";

/** Language subtag of a BCP 47 tag mapped to a bundled message set; English otherwise. */
export function supportedLocale(locale: string): SupportedLocale {
  const language = (locale || "").toLowerCase().split(/[-_]/)[0];
  return language === "it" || language === "fr" || language === "zh" ? language : "en";
}
export type PickerLabels = { [K in keyof typeof pickerMessages.en]: string };
export function messages(
  locale: string,
  overrides: Partial<PickerLabels>,
): PickerLabels {
  return {
    ...pickerMessages[supportedLocale(locale)],
    ...overrides,
  };
}

/** Etichette dei comandi di espansione degli elenchi annidati. */
export const listMessages = {
  en: { expand: "Expand", collapse: "Collapse" },
  it: { expand: "Espandi", collapse: "Comprimi" },
  fr: { expand: "Développer", collapse: "Réduire" },
  zh: { expand: "展开", collapse: "收起" },
} as const;

export type ListLabels = { [K in keyof typeof listMessages.en]: string };

export function listLabels(
  locale: string,
  overrides: Partial<ListLabels> = {},
): ListLabels {
  return {
    ...listMessages[supportedLocale(locale)],
    ...overrides,
  };
}

/** Built-in labels of controls the caller cannot name: tab scroll buttons, tooltip dismiss. */
export const controlMessages = {
  en: { previousTabs: "Previous tabs", nextTabs: "Next tabs", dismiss: "Dismiss" },
  it: { previousTabs: "Schede precedenti", nextTabs: "Schede successive", dismiss: "Chiudi" },
  fr: { previousTabs: "Onglets précédents", nextTabs: "Onglets suivants", dismiss: "Fermer" },
  zh: { previousTabs: "上一组标签", nextTabs: "下一组标签", dismiss: "关闭" },
} as const;

export const controlLabels = (locale: string) =>
  controlMessages[supportedLocale(locale || document.documentElement.lang)];
