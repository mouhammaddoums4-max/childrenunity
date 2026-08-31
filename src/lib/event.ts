import type { Locale } from "@/i18n/config";

/**
 * Événement mis en avant à l'ouverture du site.
 *
 * Le panel n'a pas encore de date : l'affiche annonce « Bientôt ». Tant
 * que `date` reste vide, la fenêtre affiche ce statut plutôt qu'une date
 * inventée, et rien n'a besoin d'être corrigé le jour où elle sera fixée
 * — il suffira de la poser ici.
 *
 * Pour retirer la fenêtre sans toucher au reste du code, passez `active`
 * à `false`.
 */

type Localized<T> = Record<Locale, T>;

type EventSource = {
  /** `false` retire complètement la fenêtre du site. */
  active: boolean;
  /**
   * Identifiant de l'édition. Le changer fait réapparaître la fenêtre
   * chez les visiteurs qui avaient déjà fermé la précédente.
   */
  id: string;
  /**
   * Date de début au format ISO, quand elle est connue. Vide, la fenêtre
   * affiche « Bientôt » et ne disparaît pas d'elle-même.
   */
  date?: string;
  /** Dernier jour d'affichage, si la date est connue. */
  until?: string;
  /** Lieu, quand il est arrêté. */
  place?: Localized<string>;
  eyebrow: Localized<string>;
  title: Localized<string>;
  tagline: Localized<string>;
  lead: Localized<string>;
  soon: Localized<string>;
  programmeTitle: Localized<string>;
  programme: Localized<string[]>;
};

const source: EventSource = {
  active: true,
  id: "panel-instruction-education",
  eyebrow: { fr: "Panel · Thème", en: "Panel · Theme" },
  title: {
    fr: "L'instruction et l'éducation",
    en: "Instruction and education",
  },
  tagline: {
    fr: "Investir aujourd'hui, bâtir demain !",
    en: "Invest today, build tomorrow!",
  },
  lead: {
    fr: "Un panel pour échanger, partager des idées et agir ensemble pour un avenir meilleur pour chaque enfant.",
    en: "A panel to exchange, share ideas and act together for a better future for every child.",
  },
  soon: {
    fr: "Bientôt — restez connectés !",
    en: "Coming soon — stay tuned!",
  },
  programmeTitle: { fr: "Au programme", en: "On the programme" },
  programme: {
    fr: [
      "Panels et discussions inspirantes",
      "Partage d'expériences",
      "Solutions et bonnes pratiques",
      "Échanges avec le public",
      "Engagements pour l'avenir",
    ],
    en: [
      "Inspiring panels and discussions",
      "Sharing of experience",
      "Solutions and good practice",
      "Exchanges with the audience",
      "Commitments for the future",
    ],
  },
};

export type FoundationEvent = {
  id: string;
  eyebrow: string;
  title: string;
  tagline: string;
  lead: string;
  soon: string;
  programmeTitle: string;
  programme: string[];
  /** Absente tant que la date n'est pas fixée. */
  date?: string;
  place?: string;
};

/**
 * L'événement à annoncer, ou `undefined` s'il n'y en a pas — parce qu'il
 * a été désactivé, ou parce que sa date est passée.
 */
export function getEvent(locale: Locale): FoundationEvent | undefined {
  if (!source.active) return undefined;

  /* Comparaison en jours pleins : l'événement reste annoncé pendant
     toute la journée du `until`, quel que soit le fuseau du visiteur. */
  if (source.until) {
    const today = new Date().toISOString().slice(0, 10);
    if (today > source.until) return undefined;
  }

  return {
    id: source.id,
    eyebrow: source.eyebrow[locale],
    title: source.title[locale],
    tagline: source.tagline[locale],
    lead: source.lead[locale],
    soon: source.soon[locale],
    programmeTitle: source.programmeTitle[locale],
    programme: source.programme[locale],
    date: source.date,
    place: source.place?.[locale],
  };
}
