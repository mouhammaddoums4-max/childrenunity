import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, ImageIcon, MapPin } from "lucide-react";
import { path } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicProjects } from "@/lib/public-data";
import { formatDate } from "@/lib/format";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";

/* Les albums viennent de la base : on redemande périodiquement plutôt que
   de figer la page au build, pour qu'une publication apparaisse d'elle-même. */
export const revalidate = 300;

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { gallery } = getDictionary(locale);
  return { title: gallery.meta.title, description: gallery.meta.description };
}

export default async function GalleryPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const { gallery } = dictionary;
  const projects = await getPublicProjects(locale);

  return (
    <>
      <PageHero
        eyebrow={gallery.hero.eyebrow}
        title={gallery.hero.title}
        lead={gallery.hero.lead}
      />

      <section className="py-16 sm:py-20">
        <Container>
          {!projects || projects.length === 0 ? (
            /* Aucun album publié : on le dit, plutôt que d'afficher une
               grille vide ou des images d'illustration. */
            <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-line bg-white p-12 text-center shadow-soft">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50">
                <Camera className="size-7 text-brand" aria-hidden="true" />
              </span>
              <p className="mt-6 leading-relaxed text-ink-muted">
                {gallery.empty}
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <li key={project.slug}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
                    <div className="relative aspect-[4/3] bg-brand-50">
                      {project.coverPath ? (
                        <Image
                          src={project.coverPath}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 360px, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon
                            className="size-10 text-brand/40"
                            aria-hidden="true"
                          />
                        </span>
                      )}

                      {project.photos.length > 0 ? (
                        <span className="absolute right-3 bottom-3 rounded-full bg-navy/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                          {project.photos.length}{" "}
                          {project.photos.length > 1
                            ? gallery.photoCountPlural
                            : gallery.photoCount}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <time
                        dateTime={project.happenedAt}
                        className="text-xs font-semibold tracking-wide text-brand uppercase"
                      >
                        {formatDate(project.happenedAt, locale)}
                      </time>

                      <h2 className="font-display mt-2 text-lg leading-snug font-bold text-navy">
                        <Link
                          href={`${path(locale, "gallery")}/${project.slug}`}
                          className="after:absolute after:inset-0"
                        >
                          {project.title}
                        </Link>
                      </h2>

                      {project.location ? (
                        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
                          <MapPin className="size-4" aria-hidden="true" />
                          {project.location}
                        </p>
                      ) : null}

                      {project.description ? (
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                          {project.description}
                        </p>
                      ) : null}

                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                        {gallery.viewProject}
                        <ArrowRight
                          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
