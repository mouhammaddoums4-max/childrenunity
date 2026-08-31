/**
 * URL publique du site, utilisee pour le sitemap et les metadonnees
 * de partage. A definir dans les variables d'environnement du projet
 * (NEXT_PUBLIC_SITE_URL) une fois le nom de domaine choisi.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://childrensunityfoundation.org";
