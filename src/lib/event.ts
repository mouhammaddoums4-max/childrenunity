import type { Locale } from "@/i18n/config";

/**
 * Événement mis en avant à l'ouverture du site.
 *
 * ─────────────────────────────────────────────────────────────────────
 * À CONFIGURER AVANT LA MISE EN LIGNE
 *
 * Les informations ci-dessous sont un gabarit : remplacez la date, le
 * lieu et les intitulés par ceux de l'événement réel. Tant que ce n'est
 * pas fait, ne mettez pas le site en ligne avec `active: true` — une date
 * inventée sur un site de fondation se retourne contre elle.
 *
 * Pour retirer la fenêtre sans toucher au reste du code, passez `active`
 * à `false`. Pour annoncer un autre événement, il suffit de réécrire cet
 * objet : la fenêtre, ses traductions et le formulaire suivent.
 * ─────────────────────────────────────────────────────────────────────
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
  /** Date de début, au format ISO, pour la balise `<time>`. */
  date: string;
  /**
   * Dernier jour d'affichage, au format ISO. Passée cette date, la
   * fenêtre disparaît d'elle-même : personne n'a à penser à la retirer.
   */
  until: string;
  eyebrow: Localized<string>;
  title: Localized<string>;
  lead: Localized<string>;
  when: Localized<string>;
  where: Localized<string>;
};

const source: EventSource = {
  active: true,
  id: "education-instruction-2026",
  date: "2026-11-14",
  until: "2026-11-14",
  eyebrow: { fr: "Événement à venir", en: "Upcoming event" },
  title: {
    fr: "Journée de l'éducation et de l'instruction",
    en: "Education and Learning Day",
  },
  lead: {
    fr: "Une journée pour réunir familles, enseignants et partenaires autour d'une question simple : comment garder chaque enfant à l'école, et l'y faire réussir. Ateliers, témoignages et rencontres avec nos équipes de terrain.",
    en: "A day bringing families, teachers and partners together around one question: how do we keep every child in school, and help them succeed there. Workshops, first-hand accounts and meetings with our field teams.",
  },
  when: { fr: "Samedi 14 novembre 2026, 9h – 17h", en: "Saturday 14 November 2026, 9am – 5pm" },
  where: { fr: "Conakry, République de Guinée", en: "Conakry, Republic of Guinea" },
};

export type FoundationEvent = {
  id: string;
  date: string;
  title: string;
  eyebrow: string;
  lead: string;
  when: string;
  where: string;
};

/**
 * L'événement à annoncer, ou `undefined` s'il n'y en a pas — parce qu'il
 * a été désactivé, ou parce que sa date est passée.
 */
export function getEvent(locale: Locale): FoundationEvent | undefined {
  if (!source.active) return undefined;

  /* Comparaison en jours pleins : l'événement reste annoncé pendant
     toute la journée du `until`, quel que soit le fuseau du visiteur. */
  const today = new Date().toISOString().slice(0, 10);
  if (today > source.until) return undefined;

  return {
    id: source.id,
    date: source.date,
    title: source.title[locale],
    eyebrow: source.eyebrow[locale],
    lead: source.lead[locale],
    when: source.when[locale],
    where: source.where[locale],
  };
}
