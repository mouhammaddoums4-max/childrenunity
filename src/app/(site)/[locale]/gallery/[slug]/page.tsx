import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { path } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublicProject } from "@/lib/public-data";
import { formatDate } from "@/lib/format";
import { resolveLocale } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";

export const revalidate = 300;

type ProjectParams = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({
  params,
}: ProjectParams): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const project = await getPublicProject(locale, slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description ?? undefined,
  };
}

export default async function ProjectPage({ params }: ProjectParams) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const project = await getPublicProject(locale, slug);

  if (!project) notFound();

  return (
    <Container className="py-12 sm:py-16">
      <Link
        href={path(locale, "gallery")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {dictionary.gallery.back}
      </Link>

      <header className="mt-8 max-w-3xl">
        <h1 className="font-display text-3xl leading-tight font-extrabold text-navy sm:text-4xl">
          {project.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4" aria-hidden="true" />
            <time dateTime={project.happenedAt}>
              {formatDate(project.happenedAt, locale)}
            </time>
          </span>
          {project.location ? (
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              {project.location}
            </span>
          ) : null}
        </div>

        {project.description ? (
          <p className="mt-6 leading-relaxed text-ink-muted">
            {project.description}
          </p>
        ) : null}
      </header>

      {/* Album : chaque photo porte son propre texte alternatif, saisi
          par l'administration au moment de la mise en ligne. */}
      {project.photos.length > 0 ? (
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {project.photos.map((photo, index) => (
            <li key={photo.path}>
              <figure className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
                <div className="relative aspect-[4/3] bg-brand-50">
                  <Image
                    src={photo.path}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    /* Les premières images comptent pour le rendu perçu ;
                       les suivantes se chargent à l'approche. */
                    priority={index < 3}
                  />
                </div>
                {photo.caption ? (
                  <figcaption className="p-4 text-sm leading-relaxed text-ink-muted">
                    {photo.caption}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      ) : null}
    </Container>
  );
}
