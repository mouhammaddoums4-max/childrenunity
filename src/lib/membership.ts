import type { Locale } from "@/i18n/config";

/**
 * Adhésion à la fondation.
 *
 * Le montant est exprimé en **francs guinéens**, la devise de référence
 * de la fondation : c'est un tarif statutaire, pas un montant converti.
 * Il s'affiche tel quel, sans conversion, pour qu'un adhérent règle
 * exactement la somme votée.
 */

type Localized<T> = Record<Locale, T>;

function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

/** Cotisation annuelle : 500 000 GNF par an. */
export const ANNUAL_DUES_GNF = 500_000;

/**
 * Droit d'entrée réglé une seule fois, en plus de la cotisation.
 *
 * À `0`, il n'existe pas : le formulaire ne propose alors qu'une seule
 * formule, la cotisation annuelle. Posez-y le montant voté par les
 * instances si la fondation en institue un, et le choix entre les deux
 * formules réapparaît de lui-même.
 */
export const MEMBERSHIP_FEE_GNF = 0;

export type PlanId = "joining" | "full";

type PlanSource = {
  id: PlanId;
  amountGnf: number;
  recommended: boolean;
  label: Localized<string>;
  detail: Localized<string>;
};

const joiningPlan: PlanSource = {
  id: "joining",
  amountGnf: MEMBERSHIP_FEE_GNF,
  recommended: false,
  label: { fr: "Droit d'entrée seul", en: "Joining fee only" },
  detail: {
    fr: "Votre inscription est enregistrée et votre matricule vous est attribué. La cotisation annuelle reste à régler ensuite.",
    en: "Your registration is recorded and your membership number issued. The annual dues remain to be paid afterwards.",
  },
};

const fullPlan: PlanSource = {
  id: "full",
  amountGnf: MEMBERSHIP_FEE_GNF + ANNUAL_DUES_GNF,
  recommended: true,
  label: { fr: "Cotisation annuelle", en: "Annual dues" },
  detail: {
    fr: "Vous êtes membre à jour pour l'année entière, sans autre démarche.",
    en: "You are a fully paid-up member for the whole year, with nothing further to do.",
  },
};

/* Sans droit d'entrée, les deux formules seraient identiques. */
const planSources: PlanSource[] =
  MEMBERSHIP_FEE_GNF > 0 ? [joiningPlan, fullPlan] : [fullPlan];

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
  const plans = getPlans(locale);
  return plans.find((plan) => plan.id === id) ?? plans[plans.length - 1];
}
