import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Heart, ShieldCheck, Target } from "lucide-react";
import { locales, path } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getChild, getChildReferences } from "@/lib/sponsorship";
import { accentClasses } from "@/lib/accents";
import { formatAmount } from "@/lib/format";
import { resolvePhoto } from "@/lib/public-photo";
import { resolveLocale } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

type ChildParams = { params: Promise<{ locale: string; reference: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getChildReferences().map((reference) => ({ locale, reference })),
  );
}

export async function generateMetadata({
  params,
}: ChildParams): Promise<Metadata> {
  const { reference } = await params;
  const locale = await resolveLocale(params);
  const child = getChild(locale, reference);
  if (!child) return {};

  const { sponsorship } = getDictionary(locale);
  return {
    title: `${child.firstName} — ${sponsorship.meta.title}`,
    description: child.story[0],
  };
}

export default async function ChildPage({ params }: ChildParams) {
  const { reference } = await params;
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const child = getChild(locale, reference);

  if (!child) notFound();

  const accent = accentClasses[child.accent];
  const photo = resolvePhoto(child.photo);
  const { sponsorship, common } = dictionary;
  const { detail, card } = sponsorship;

  return (
    <Container className="py-10 sm:py-12 lg:py-16">
      <Link
        href={path(locale, "sponsorship")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {detail.back}
      </Link>

      <div className="mt-8 grid gap-8 sm:gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        {/* Parcours */}
        <div>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <h1 className="font-display text-[clamp(1.875rem,5.6vw,3rem)] font-extrabold text-navy">
              {child.firstName}
            </h1>
            <span className="text-base text-ink-muted sm:text-lg">
              {child.age} {card.age}
            </span>
          </div>

          <p className="mt-3 text-ink-muted">
            {child.country} · {card.grade} {child.grade} ·{" "}
            <span className="tabular-nums">
              {card.reference} {child.reference}
            </span>
          </p>

          <div
            className={`mt-8 aspect-[16/9] overflow-hidden rounded-3xl ${accent.softBg}`}
          >
            {photo ? (
              <Image
                src={photo}
                alt={child.firstName}
                width={960}
                height={540}
                className="size-full object-cover"
              />
            ) : (
              /* Aucune photo autorisee : monogramme, jamais d'image d'emprunt */
              <span
                className={`font-display flex size-full items-center justify-center text-8xl font-extrabold ${accent.text} opacity-40`}
                aria-hidden="true"
              >
                {child.firstName.charAt(0)}
              </span>
            )}
          </div>

          <h2 className="font-display mt-9 text-xl font-bold text-navy sm:mt-10 sm:text-2xl">
            {detail.storyTitle}
          </h2>
          <div className="mt-5 space-y-5">
            {child.story.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Video de presentation, servie sans cookie de suivi */}
          {child.videoId ? (
            <>
              <h2 className="font-display mt-9 text-xl font-bold text-navy sm:mt-10 sm:text-2xl">
                {detail.videoTitle}
              </h2>
              <div className="mt-5 aspect-video overflow-hidden rounded-3xl bg-navy">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${child.videoId}`}
                  title={`${detail.videoTitle} — ${child.firstName}`}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="size-full border-0"
                />
              </div>
            </>
          ) : null}
        </div>

        {/* Collecte et engagement */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-7">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-display text-2xl font-bold tabular-nums text-navy">
                {formatAmount(child.raised, locale)}
              </span>
              <span className="font-display text-lg font-bold tabular-nums text-navy">
                {child.progress} %
              </span>
            </div>

            <div
              className="mt-3 h-3 overflow-hidden rounded-full bg-canvas"
              role="progressbar"
              aria-valuenow={child.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${child.firstName} — ${card.funded}`}
            >
              <div
                className={`h-full rounded-full ${accent.bar}`}
                style={{ width: `${child.progress}%` }}
              />
            </div>

            <p className="mt-3 text-sm tabular-nums text-ink-muted">
              {formatAmount(child.goal, locale)} {card.goal}
            </p>

            <ButtonLink
              href={path(locale, "contact")}
              size="lg"
              className="mt-7 w-full"
            >
              <Heart className="size-4.5" aria-hidden="true" />
              {detail.sponsorCta}
            </ButtonLink>

            <h2 className="font-display mt-9 border-t border-line pt-7 text-lg font-bold text-navy">
              {detail.needsTitle}
            </h2>
            <ul className="mt-5 space-y-3.5">
              {child.needs.map((need) => (
                <li key={need} className="flex gap-3">
                  <span
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${accent.softBg}`}
                  >
                    <Check
                      className={`size-3 ${accent.text}`}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-sm leading-relaxed text-ink">{need}</span>
                </li>
              ))}
            </ul>

            <h2 className="font-display mt-8 text-lg font-bold text-navy">
              {detail.objectivesTitle}
            </h2>
            <ul className="mt-5 space-y-3.5">
              {child.objectives.map((objective) => (
                <li key={objective} className="flex gap-3">
                  <Target
                    className={`mt-0.5 size-4 shrink-0 ${accent.text}`}
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-relaxed text-ink">
                    {objective}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 flex items-start gap-3 rounded-2xl bg-teal-50 p-5 text-xs leading-relaxed text-ink-muted">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-teal-ink"
              aria-hidden="true"
            />
            {sponsorship.privacy.body}
          </p>

          <p className="mt-4 text-center text-sm">
            <Link
              href={path(locale, "donate")}
              className="font-semibold text-brand hover:underline"
            >
              {common.donate}
            </Link>
          </p>
        </aside>
      </div>
    </Container>
  );
}
