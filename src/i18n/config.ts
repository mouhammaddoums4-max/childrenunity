export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Les segments d'URL sont partagés entre les deux langues
 * (/fr/programs et /en/programs) : une seule arborescence de routes
 * à maintenir, les libellés visibles étant traduits via le dictionnaire.
 */
export const routes = {
  home: "",
  about: "about",
  programs: "programs",
  impact: "impact",
  news: "news",
  contact: "contact",
  donate: "donate",
} as const;

export type RouteKey = keyof typeof routes;

export function path(locale: Locale, key: RouteKey): string {
  const segment = routes[key];
  return segment ? `/${locale}/${segment}` : `/${locale}`;
}
