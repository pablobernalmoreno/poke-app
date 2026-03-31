import { type Locale } from "./locales";

export type { Locale } from "./locales";
export { LOCALES, DEFAULT_LOCALE } from "./locales";

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  es: () => import("@/dictionaries/es.json").then((m) => m.default),
};

export function hasLocale(locale: string): locale is Locale {
  return locale in dictionaries;
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}

// Infer the Dictionary type from the English file (both share the same shape)
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;
