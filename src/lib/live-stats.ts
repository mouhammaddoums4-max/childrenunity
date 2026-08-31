import "server-only";
import type { Locale } from "@/i18n/config";
import { getPrograms } from "@/lib/content";
import { hasDatabase, prisma } from "@/lib/db";
import type { Stat } from "@/lib/content";

/**
 * Chiffres d'impact, comptés dans la base.
 *
 * Ils ne sont plus saisis à la main : chaque nombre est le résultat d'une
 * requête, il monte tout seul à mesure que les dossiers sont enregistrés
 * et il ne peut donc pas être démenti. Un dossier encore en brouillon ou
 * en attente de validation n'est jamais compté.
 *
 * Les compteurs partent de zéro et montent à mesure que l'administration
 * enregistre les dossiers. Sans base joignable, la fonction renvoie une
 * liste vide et la bande se retire : une page servie sans sa bande vaut
 * mieux qu'une page en erreur.
 */
export async function getLiveStats(locale: Locale): Promise<Stat[]> {
  if (!hasDatabase) return [];

  try {
    const [children, mentors, countries] = await Promise.all([
      /* Enfants dont le dossier est validé : accompagnés aujourd'hui, ou
         sortis du dispositif au terme de leur parcours. */
      prisma.child.count({ where: { status: { in: ["ACTIVE", "GRADUATED"] } } }),

      /* Bénévoles réellement en exercice : un mentor compte s'il suit au
         moins un enfant et que son rattachement n'est pas clos. */
      prisma.user.count({
        where: {
          active: true,
          role: "MENTOR",
          mentorships: { some: { endedAt: null } },
        },
      }),

      /* Pays où au moins un enfant est accompagné. */
      prisma.child
        .findMany({
          where: { status: { in: ["ACTIVE", "GRADUATED"] } },
          distinct: ["country"],
          select: { country: true },
        })
        .then((rows) => rows.length),
    ]);

    /* Les programmes sont éditoriaux, pas des enregistrements : ils se
       comptent dans le contenu du site, qui fait foi. */
    const programmes = getPrograms(locale).length;

    const stats: Stat[] = [
      {
        value: format(children),
        icon: "smile",
        accent: "brand",
        label: locale === "fr" ? "Enfants accompagnés" : "Children supported",
      },
      {
        value: format(mentors),
        icon: "users",
        accent: "teal",
        label: locale === "fr" ? "Bénévoles engagés" : "Volunteers involved",
      },
      {
        value: format(programmes),
        icon: "graduation",
        accent: "orange",
        label: locale === "fr" ? "Programmes actifs" : "Active programmes",
      },
      {
        value: format(countries),
        icon: "globe",
        accent: "brand",
        label: locale === "fr" ? "Pays d'intervention" : "Countries of operation",
      },
    ];

    /* Les compteurs sont affichés même à zéro : la bande part de zéro et
       monte au fil des dossiers enregistrés, ce qui vaut mieux qu'un
       chiffre saisi d'avance que personne ne pourrait vérifier. */
    return stats;
  } catch {
    /* Base injoignable au moment du rendu : la page reste servie, sans
       la bande, plutôt que de renvoyer une erreur au visiteur. */
    return [];
  }
}

/** Séparateur de milliers en espace insécable, comme le reste du site. */
function format(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}
