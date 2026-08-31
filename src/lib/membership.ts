import type { Locale } from "@/i18n/config";

/**
 * Formules d'adhésion.
 *
 * Les montants sont exprimés en **francs guinéens**, la devise de
 * référence de la fondation : ce sont des tarifs statutaires, pas des
 * montants convertis. Ils sont affichés tels quels, sans conversion, pour
 * qu'un adhérent règle exactement la somme votée.
 */

type Localized<T> = Record<Locale, T>;

function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

export const MEMBERSHIP_FEE_GNF = 100_000;
export const ANNUAL_DUES_GNF = 500_000;

export type PlanId = "joining" | "full";

type PlanSource = {
  id: PlanId;
  amountGnf: number;
  /** Formule mise en avant par défaut. */
  recommended: boolean;
  label: Localized<string>;
  detail: Localized<string>;
};

const planSources: PlanSource[] = [
  {
    id: "joining",
    amountGnf: MEMBERSHIP_FEE_GNF,
    recommended: false,
    label: { fr: "Frais d'adhésion seuls", en: "Joining fee only" },
    detail: {
      fr: "Votre inscription est enregistrée et votre numéro d'adhésion vous est attribué. La cotisation annuelle reste à régler ensuite.",
      en: "Your registration is recorded and your membership number issued. The annual dues remain to be paid afterwards.",
    },
  },
  {
    id: "full",
    amountGnf: MEMBERSHIP_FEE_GNF + ANNUAL_DUES_GNF,
    recommended: true,
    label: { fr: "Adhésion + cotisation annuelle", en: "Joining fee + annual dues" },
    detail: {
      fr: "Vous êtes membre à jour pour l'année entière, sans autre démarche.",
      en: "You are a fully paid-up member for the whole year, with nothing further to do.",
    },
  },
];

export type Plan = {
  id: PlanId;
  amountGnf: number;
  recommended: boolean;
  label: string;
  detail: string;
};

export function getPlans(locale: Locale): Plan[] {
  return planSources.map((plan) => ({
    id: plan.id,
    amountGnf: plan.amountGnf,
    recommended: plan.recommended,
    label: pick(plan.label, locale),
    detail: pick(plan.detail, locale),
  }));
}

export function getPlan(locale: Locale, id: PlanId): Plan {
  return getPlans(locale).find((plan) => plan.id === id) ?? getPlans(locale)[1];
}
