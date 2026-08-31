import Image from "next/image";
import { ArrowRight, GraduationCap, Heart, UserPlus, Users } from "lucide-react";
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
    <section className="relative isolate overflow-hidden">
      {/* Photographie de fond, retournee horizontalement pour placer l'enfant
          a droite et le ciel clair sous la colonne de texte. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero.webp"
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] sm:object-center"
        />

        {/* Voile clair : il porte le contraste du texte, plus dense a gauche
            ou se trouve le titre, et s'efface vers le soleil. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/92 to-canvas/60 sm:to-canvas/20 lg:via-canvas/80 lg:to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-canvas to-transparent"
        />
      </div>

      <Container className="relative py-12 sm:py-16 lg:py-24">
        <div className="max-w-xl animate-rise lg:max-w-2xl">
          <h1 className="font-display text-display font-extrabold text-navy">
            {hero.titleLine1}
            <br />
            {hero.titleLine2}
            <br />
            <span className="text-brand">{hero.titleHighlight}</span>
            <span className="text-orange">.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lead font-medium text-ink sm:mt-7">
            {hero.lead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-3.5">
            <ButtonLink href={path(locale, "donate")} size="lg">
              <Heart className="size-4.5" aria-hidden="true" />
              {common.donate}
            </ButtonLink>
            <ButtonLink
              href={path(locale, "sponsorship")}
              variant="outline"
              size="lg"
            >
              {common.sponsor}
              <ArrowRight className="size-4.5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href={path(locale, "membership")}
              variant="outline"
              size="lg"
            >
              <UserPlus className="size-4.5" aria-hidden="true" />
              {common.becomeMember}
            </ButtonLink>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-5 sm:mt-12 sm:gap-x-10 sm:gap-y-6">
            {hero.pillars.map((pillar, index) => {
              const Icon = pillarIcons[index];
              return (
                <li key={pillar.title} className="flex items-center gap-3.5">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-full text-white shadow-soft sm:size-12 ${pillarColors[index]}`}
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
      </Container>
    </section>
  );
}
