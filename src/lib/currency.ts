import type { Locale } from "@/i18n/config";

/**
 * Devises du site.
 *
 * La fondation est basée à Conakry : le **franc guinéen est la devise par
 * défaut**, y compris au rendu serveur. Elle est remplacée par celle du
 * pays du visiteur lorsque celui-ci est identifiable (langue du navigateur,
 * puis fuseau horaire), et le visiteur peut toujours en choisir une autre
 * à la main depuis le module de don.
 */
export type CurrencyCode = "GNF" | "XOF" | "XAF" | "EUR" | "USD" | "GBP";

export const defaultCurrency: CurrencyCode = "GNF";

export type Currency = {
  code: CurrencyCode;
  /** Paliers de don proposés, du plus petit au plus grand. */
  amounts: number[];
  /** Ce que finance chaque palier, dans l'ordre de `amounts`. */
  impactKeys: ["25", "50", "120", "250"];
  /**
   * Valeur d'une unité de cette devise, en francs guinéens. Sert
   * uniquement à afficher dans la devise du visiteur des montants
   * enregistrés en GNF (objectifs de parrainage).
   */
  gnfPerUnit: number;
  /** Arrondi appliqué après conversion, pour éviter « 97 843 GNF ». */
  step: number;
};

/*
 * Taux **indicatifs**, relevés le 31 août 2026 et arrondis : ils servent à
 * l'affichage, jamais à un encaissement. Le franc CFA (XOF et XAF) est
 * arrimé à l'euro à 655,957 pour 1 €. À réviser ici, et nulle part
 * ailleurs, quand les taux auront trop dérivé.
 */
export const currencies: Record<CurrencyCode, Currency> = {
  GNF: {
    code: "GNF",
    amounts: [250_000, 500_000, 1_200_000, 2_500_000],
    impactKeys: ["25", "50", "120", "250"],
    gnfPerUnit: 1,
    step: 10_000,
  },
  XOF: {
    code: "XOF",
    amounts: [15_000, 30_000, 75_000, 150_000],
    impactKeys: ["25", "50", "120", "250"],
    gnfPerUnit: 15.2,
    step: 500,
  },
  XAF: {
    code: "XAF",
    amounts: [15_000, 30_000, 75_000, 150_000],
    impactKeys: ["25", "50", "120", "250"],
    gnfPerUnit: 15.2,
    step: 500,
  },
  EUR: {
    code: "EUR",
    amounts: [25, 50, 120, 250],
    impactKeys: ["25", "50", "120", "250"],
    gnfPerUnit: 10_000,
    step: 5,
  },
  USD: {
    code: "USD",
    amounts: [25, 50, 120, 250],
    impactKeys: ["25", "50", "120", "250"],
    gnfPerUnit: 8_700,
    step: 5,
  },
  GBP: {
    code: "GBP",
    amounts: [20, 45, 100, 200],
    impactKeys: ["25", "50", "120", "250"],
    gnfPerUnit: 11_500,
    step: 5,
  },
};

export const currencyCodes = Object.keys(currencies) as CurrencyCode[];

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value in currencies;
}

/**
 * Pays -> devise, en codes ISO 3166-1 alpha-2.
 *
 * Y figurent les pays d'intervention et les principaux pays donateurs.
 * Un pays absent de cette table retombe sur le franc guinéen.
 */
const countryCurrency: Record<string, CurrencyCode> = {
  GN: "GNF",

  /* Union économique et monétaire ouest-africaine (franc CFA BCEAO) */
  BJ: "XOF", BF: "XOF", CI: "XOF", GW: "XOF",
  ML: "XOF", NE: "XOF", SN: "XOF", TG: "XOF",

  /* Communauté économique et monétaire d'Afrique centrale (franc CFA BEAC) */
  CM: "XAF", CF: "XAF", TD: "XAF", CG: "XAF", GQ: "XAF", GA: "XAF",

  /* Zone euro */
  AT: "EUR", BE: "EUR", CY: "EUR", DE: "EUR", EE: "EUR", ES: "EUR",
  FI: "EUR", FR: "EUR", GR: "EUR", HR: "EUR", IE: "EUR", IT: "EUR",
  LT: "EUR", LU: "EUR", LV: "EUR", MT: "EUR", NL: "EUR", PT: "EUR",
  SI: "EUR", SK: "EUR",

  GB: "GBP",

  US: "USD", CA: "USD", AU: "USD", NZ: "USD",
};

/**
 * Fuseaux horaires -> pays, pour les visiteurs dont la langue ne porte pas
 * de région (« fr » plutôt que « fr-GN »). Seuls les fuseaux utiles sont
 * listés ; les préfixes génériques sont traités dans `fromTimeZone`.
 */
const zoneCountry: Record<string, string> = {
  "Africa/Conakry": "GN",
  "Africa/Dakar": "SN",
  "Africa/Bamako": "ML",
  "Africa/Abidjan": "CI",
  "Africa/Ouagadougou": "BF",
  "Africa/Porto-Novo": "BJ",
  "Africa/Lome": "TG",
  "Africa/Niamey": "NE",
  "Africa/Bissau": "GW",
  "Africa/Douala": "CM",
  "Africa/Libreville": "GA",
  "Africa/Brazzaville": "CG",
  "Africa/Ndjamena": "TD",
  "Africa/Bangui": "CF",
  "Africa/Malabo": "GQ",
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Brussels": "BE",
  "Europe/Madrid": "ES",
  "Europe/Berlin": "DE",
  "Europe/Rome": "IT",
  "Europe/Lisbon": "PT",
};

function fromRegion(): CurrencyCode | undefined {
  const tags = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const tag of tags) {
    if (!tag) continue;
    try {
      const region = new Intl.Locale(tag).region;
      if (region && countryCurrency[region]) return countryCurrency[region];
    } catch {
      /* Étiquette de langue invalide : on passe à la suivante. */
    }
  }
  return undefined;
}

function fromTimeZone(): CurrencyCode | undefined {
  let zone: string;
  try {
    zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
  if (!zone) return undefined;

  const country = zoneCountry[zone];
  if (country) return countryCurrency[country];

  /* Repli large : le reste de l'Europe paie en euro, les Amériques en
     dollar. Tout autre fuseau reste sur la devise par défaut. */
  if (zone.startsWith("Europe/")) return "EUR";
  if (zone.startsWith("America/")) return "USD";
  return undefined;
}

/**
 * Devise la plus probable pour le visiteur. Rien n'est envoyé à un service
 * tiers : la déduction se fait entièrement dans le navigateur. Le franc
 * guinéen reste la réponse tant que le pays n'est pas identifiable.
 */
export function detectCurrency(): CurrencyCode {
  if (typeof window === "undefined") return defaultCurrency;
  return fromRegion() ?? fromTimeZone() ?? defaultCurrency;
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

/**
 * Convertit un montant enregistré en francs guinéens vers la devise
 * demandée, puis l'arrondit au palier de cette devise : les objectifs de
 * parrainage restent des ordres de grandeur lisibles, pas des centimes.
 */
export function fromGnf(valueInGnf: number, currency: CurrencyCode): number {
  const { gnfPerUnit, step } = currencies[currency];
  const converted = valueInGnf / gnfPerUnit;
  return Math.max(step, Math.round(converted / step) * step);
}

/**
 * Convertit un montant saisi dans la devise du visiteur vers le franc
 * guinéen, arrondi au millier : c'est la somme réellement transférée
 * quand le don passe par Orange Money, MTN ou Wave.
 */
export function toGnf(value: number, currency: CurrencyCode): number {
  const converted = value * currencies[currency].gnfPerUnit;
  return Math.max(1_000, Math.round(converted / 1_000) * 1_000);
}
