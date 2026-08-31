import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { isDraft } from "@/lib/publication";

export default function robots(): MetadataRoute.Robots {
  return {
    /* En démonstration, le site est fermé à l'indexation : il porte
       encore des contenus d'exemple qu'aucun moteur ne doit reprendre. */
    rules: isDraft
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
