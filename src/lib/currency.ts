import type { Locale } from "@/i18n/config";

/**
 * Devises proposées pour les dons.
 *
 * Les paliers sont définis à la main pour chaque devise plutôt que
 * convertis depuis un taux : un taux figé dans le code se périme et
 * produirait des montants illisibles (« 97 843 GNF »). Chaque devise
 * garde donc des paliers ronds, équivalents en ordre de grandeur.
 * Le premier montant de chaque liste est celui présélectionné.
 */
export type CurrencyCode = "GNF" | "EUR" | "USD";

export type Currency = {
  code: CurrencyCode;
  /** Paliers proposés, du plus petit au plus grand. */
  amounts: number[];
  /** Ce que finance chaque palier, dans l'ordre de `amounts`. */
  impactKeys: ["25", "50", "120", "250"];
};

export const currencies: Record<CurrencyCode, Currency> = {
  GNF: {
    code: "GNF",
    amounts: [250_000, 500_000, 1_200_000, 2_500_000],
    impactKeys: ["25", "50", "120", "250"],
  },
  EUR: {
    code: "EUR",
    amounts: [25, 50, 120, 250],
    impactKeys: ["25", "50", "120", "250"],
  },
  USD: {
    code: "USD",
    amounts: [25, 50, 120, 250],
    impactKeys: ["25", "50", "120", "250"],
  },
};

export const currencyCodes = Object.keys(currencies) as CurrencyCode[];

/** Fuseaux horaires des pays où le franc guinéen est la monnaie. */
const GNF_TIMEZONES = ["Africa/Conakry"];

/** Fuseaux des autres pays d'intervention, facturés en dollar. */
const USD_TIMEZONES = [
  "Africa/Dakar",
  "Africa/Bamako",
  "Africa/Abidjan",
  "Africa/Ouagadougou",
  "Africa/Porto-Novo",
  "Africa/Lome",
  "Africa/Niamey",
];

/**
 * Devise la plus probable pour le visiteur, déduite de son fuseau horaire
 * puis de la langue du navigateur. Rien n'est envoyé à un service tiers,
 * et le visiteur peut toujours choisir une autre devise à la main.
 */
export function detectCurrency(locale: Locale): CurrencyCode {
  if (typeof window === "undefined") {
    return locale === "fr" ? "EUR" : "USD";
  }

  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (GNF_TIMEZONES.includes(zone)) return "GNF";
    if (USD_TIMEZONES.includes(zone)) return "USD";
  } catch {
    /* Fuseau indisponible : on retombe sur la langue ci-dessous. */
  }

  const language = navigator.language?.toLowerCase() ?? "";
  if (language.endsWith("-gn")) return "GNF";
  if (language.startsWith("en")) return "USD";
  return "EUR";
}

const localeTags: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" };

export function formatMoney(
  value: number,
  currency: CurrencyCode,
  locale: Locale,
): string {
  return new Intl.NumberFormat(localeTags[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
