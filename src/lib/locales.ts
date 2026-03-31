/** Locale constants — safe to import in Client Components, Server Components, and proxy.ts */
export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
