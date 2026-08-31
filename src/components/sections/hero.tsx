import Image from "next/image";
import { ArrowRight, GraduationCap, Heart, Users } from "lucide-react";
import { path, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

const pillarIcons = [Users, GraduationCap, Heart];
const pillarColors = ["bg-brand", "bg-teal", "bg-orange"];

export function Hero({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { hero } = dictionary.home;
  const { common } = dictionary;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-canvas to-canvas">
      {/* Halos colores tres diffus, purement decoratifs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-brand/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 right-0 size-96 rounded-full bg-teal/10 blur-3xl"
      />

      <Container className="relative grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-20">
        <div className="animate-rise">
          <h1 className="font-display text-4xl leading-[1.08] font-extrabold text-navy sm:text-5xl lg:text-6xl">
            {hero.titleLine1}
            <br />
            {hero.titleLine2}
            <br />
            <span className="text-brand">{hero.titleHighlight}</span>
            <span className="text-orange">.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {hero.lead}
          </p>

          <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <ButtonLink href={path(locale, "programs")} size="lg">
              {common.discover}
              <ArrowRight className="size-4.5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href={path(locale, "contact")}
              variant="outline"
              size="lg"
            >
              {common.volunteer}
              <Heart className="size-4.5" aria-hidden="true" />
            </ButtonLink>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
            {hero.pillars.map((pillar, index) => {
              const Icon = pillarIcons[index];
              return (
                <li key={pillar.title} className="flex items-center gap-3.5">
                  <span
                    className={`flex size-12 items-center justify-center rounded-full text-white ${pillarColors[index]}`}
                  >
                    <Icon className="size-5.5" aria-hidden="true" />
                  </span>
                  <span className="leading-tight">
                    <span className="font-display block font-bold text-navy">
                      {pillar.title}
                    </span>
                    <span className="text-sm text-ink-muted">
                      {pillar.subtitle}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Le logo porte deja les arcs, le soleil et les trois enfants :
            il sert directement de visuel, pose sur un disque clair.
            Pour y placer une photo, remplacer ce bloc par un <Image>. */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <div className="relative aspect-square">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-white to-brand-50 shadow-lift"
            />
            <div className="absolute inset-0 flex items-center justify-center p-[14%]">
              <Image
                src="/logo-mark.png"
                alt={dictionary.meta.siteName}
                width={739}
                height={618}
                priority
                className="animate-drift w-full drop-shadow-[0_18px_28px_rgba(18,10,94,0.16)]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
