import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import { hasDatabase, prisma } from "@/lib/db";

/**
 * Lecture des données publiées, depuis la base.
 *
 * ─────────────────────────────────────────────────────────────────────
 * C'est ici que l'administration alimente le site : dès qu'un enfant est
 * enregistré, ouvert au parrainage, ou qu'un projet est publié, les pages
 * publiques le reflètent sans qu'aucun fichier ne soit modifié.
 *
 * Deux règles gouvernent ce module :
 *
 * 1. **Rien de nominatif ne sort.** Les requêtes sélectionnent
 *    explicitement les champs publiables ; le nom de famille, la date de
 *    naissance ou l'adresse d'un enfant ne peuvent pas fuir par
 *    inadvertance, parce qu'ils ne sont jamais demandés.
 *
 * 2. **Pas de base, pas d'erreur.** Tant que `DATABASE_URL` est absente,
 *    chaque fonction renvoie `null`, et l'appelant retombe sur le contenu
 *    de démonstration. Le site reste consultable pendant l'installation.
 * ─────────────────────────────────────────────────────────────────────
 */

const REVALIDATE_SECONDS = 300;

export type PublicChild = {
  reference: string;
  name: string;
  age: number;
  city: string;
  country: string;
  story: string[];
  needs: string[];
  goals: string[];
  photoPath: string | null;
  videoId: string | null;
  /** Objectif annuel, en francs guinéens. */
  goalGnf: number;
  /** Versements confirmés sur l'année en cours, en francs guinéens. */
  raisedGnf: number;
  /** Orientation en cours : école, atelier, école coranique… */
  placement: { kind: string; trade: string | null; level: string | null } | null;
};

function ageFrom(dateOfBirth: Date): number {
  const now = new Date();
  let age = now.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = now.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dateOfBirth.getDate())) {
    age -= 1;
  }
  return Math.max(0, age);
}

/**
 * Enfants que l'administration a ouverts au parrainage.
 *
 * Un enfant n'apparaît que si son dossier est validé (`ACTIVE`) **et**
 * que l'administration l'a explicitement ouvert : les deux conditions
 * sont nécessaires, pour qu'un dossier validé ne devienne pas public par
 * simple effet de bord.
 */
export const getPublicChildren = unstable_cache(
  async (): Promise<PublicChild[] | null> => {
    if (!hasDatabase) return null;

    const children = await prisma.child.findMany({
      where: { status: "ACTIVE", openToSponsors: true },
      orderBy: { createdAt: "desc" },
      select: {
        reference: true,
        publicName: true,
        publicStory: true,
        publicNeeds: true,
        publicGoals: true,
        dateOfBirth: true,
        city: true,
        country: true,
        annualCostGnf: true,
        photoConsent: true,
        photoPath: true,
        videoId: true,
        placements: {
          where: { status: "ACTIVE" },
          orderBy: { startedAt: "desc" },
          take: 1,
          select: { kind: true, trade: true, level: true },
        },
        payments: {
          where: { status: "CONFIRMED" },
          select: { amountGnf: true },
        },
      },
    });

    return children.map((child) => {
      /* L'image n'est publiée que si l'autorisation écrite du représentant
         légal a été recueillie, quel que soit le fichier présent. */
      const consented = child.photoConsent === "GRANTED";

      return {
        reference: child.reference,
        name: child.publicName,
        age: ageFrom(child.dateOfBirth),
        city: child.city,
        country: child.country,
        story: child.publicStory ? child.publicStory.split("\n\n") : [],
        needs: child.publicNeeds,
        goals: child.publicGoals,
        photoPath: consented ? child.photoPath : null,
        videoId: consented ? child.videoId : null,
        goalGnf: child.annualCostGnf,
        raisedGnf: child.payments.reduce((sum, p) => sum + p.amountGnf, 0),
        placement: child.placements[0] ?? null,
      };
    });
  },
  ["public-children"],
  { revalidate: REVALIDATE_SECONDS, tags: ["children"] },
);

export type PublicProject = {
  slug: string;
  title: string;
  description: string | null;
  happenedAt: string;
  location: string | null;
  coverPath: string | null;
  photos: { path: string; alt: string; caption: string | null }[];
};

/** Projets publiés de la galerie, textes servis dans la langue demandée. */
export const getPublicProjects = unstable_cache(
  async (locale: Locale): Promise<PublicProject[] | null> => {
    if (!hasDatabase) return null;

    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { happenedAt: "desc" },
      select: {
        slug: true,
        titleFr: true,
        titleEn: true,
        descriptionFr: true,
        descriptionEn: true,
        happenedAt: true,
        location: true,
        coverPath: true,
        photos: {
          orderBy: { position: "asc" },
          select: {
            path: true,
            altFr: true,
            altEn: true,
            captionFr: true,
            captionEn: true,
          },
        },
      },
    });

    const french = locale === "fr";

    return projects.map((project) => ({
      slug: project.slug,
      title: french ? project.titleFr : project.titleEn,
      description: french ? project.descriptionFr : project.descriptionEn,
      happenedAt: project.happenedAt.toISOString().slice(0, 10),
      location: project.location,
      coverPath: project.coverPath ?? project.photos[0]?.path ?? null,
      photos: project.photos.map((photo) => ({
        path: photo.path,
        alt: french ? photo.altFr : photo.altEn,
        caption: french ? photo.captionFr : photo.captionEn,
      })),
    }));
  },
  ["public-projects"],
  { revalidate: REVALIDATE_SECONDS, tags: ["projects"] },
);

export async function getPublicProject(
  locale: Locale,
  slug: string,
): Promise<PublicProject | null> {
  const projects = await getPublicProjects(locale);
  return projects?.find((project) => project.slug === slug) ?? null;
}
