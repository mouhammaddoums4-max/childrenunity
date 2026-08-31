/**
 * Statut de publication du site.
 *
 * ─────────────────────────────────────────────────────────────────────
 * POURQUOI CE FICHIER EXISTE
 *
 * Les chiffres d'impact, les témoignages, les membres de l'équipe, les
 * actualités et les fiches de parrainage livrés avec ce dépôt sont des
 * **exemples de mise en page**. Affichés tels quels sur un site qui
 * demande des dons, ce sont des affirmations fausses : « 10 000 enfants
 * accompagnés » n'engage pas moins la fondation parce que c'est un
 * gabarit. Ce fichier empêche cette situation de se produire par oubli.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Deux interrupteurs, dans cet ordre :
 *
 * 1. `NEXT_PUBLIC_SITE_STATUS=live` (variable d'environnement) fait
 *    passer le site en ligne. Tant qu'elle n'est pas posée, le site est
 *    en démonstration : les moteurs de recherche sont priés de ne rien
 *    indexer et un bandeau le dit à qui regarde.
 *
 * 2. `contentReviewed` ci-dessous se passe à `true` une fois les données
 *    réelles saisies dans `content.ts` et `sponsorship.ts`, et relues.
 *
 * En ligne mais non relu, les sections concernées **disparaissent** au
 * lieu d'afficher des exemples. C'est volontaire : une page plus courte
 * vaut mieux qu'un chiffre inventé.
 */

export const isLive = process.env.NEXT_PUBLIC_SITE_STATUS === "live";

/**
 * À passer à `true` quand les contenus de `content.ts` et
 * `sponsorship.ts` sont ceux de la fondation, et qu'ils ont été relus.
 */
export const contentReviewed = false;

/** Le site montre-t-il encore des contenus d'exemple ? */
export const showsSampleContent = !contentReviewed;

/** Le bandeau de démonstration et le `noindex` sont-ils actifs ? */
export const isDraft = !isLive || !contentReviewed;

/**
 * Filtre appliqué à chaque jeu de données non vérifié : en ligne sans
 * relecture, il ne reste rien à afficher.
 */
/**
 * Les chiffres portés par le dictionnaire (répartition des dépenses, par
 * exemple) ne passent pas par `publicData` : ce drapeau permet de retirer
 * leur section entière tant qu'ils n'ont pas été vérifiés.
 */
export const showsUnverifiedFigures = !isLive || contentReviewed;

/**
 * Filtre appliqué à chaque jeu de données non vérifié : en ligne sans
 * relecture, il ne reste rien à afficher.
 */
export function publicData<T>(items: T[]): T[] {
  return isLive && !contentReviewed ? [] : items;
}
