import type { MetadataRoute } from "next";
import { locales, routes, type RouteKey } from "@/i18n/config";
import { getArticleSlugs } from "@/lib/content";
import { getChildReferences } from "@/lib/sponsorship";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routeKeys = Object.keys(routes) as RouteKey[];

  const pages = locales.flatMap((locale) =>
    routeKeys.map((key) => {
      const segment = routes[key];
      return {
        url: `${siteUrl}/${locale}${segment ? `/${segment}` : ""}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: key === "home" ? 1 : 0.7,
      };
    }),
  );

  const articles = locales.flatMap((locale) =>
    getArticleSlugs().map((slug) => ({
      url: `${siteUrl}/${locale}/${routes.news}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  );

  const children = locales.flatMap((locale) =>
    getChildReferences().map((reference) => ({
      url: `${siteUrl}/${locale}/${routes.sponsorship}/${reference}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...pages, ...articles, ...children];
}
