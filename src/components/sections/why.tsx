import { ArrowRight, HandHeart, TriangleAlert } from "lucide-react";
import { path, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

/**
 * Raison d'etre de la fondation : le constat d'abord, la reponse ensuite.
 *
 * Placee juste apres la banniere d'accueil, avant la liste des programmes :
 * le visiteur comprend le probleme avant qu'on lui presente les moyens
 * d'agir.
 */
export function Why({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { why } = dictionary.home;
  const { common } = dictionary;

  return (
    <section className="border-y border-line bg-white py-14 sm:py-20 lg:py-24">
      <Container>
        <SectionHeading
          eyebrow={why.eyebrow}
          title={why.title}
          lead={why.lead}
          align="center"
        />

        <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-2">
          {/* Le constat */}
          <article className="rounded-3xl border border-line bg-canvas p-6 sm:p-8">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-orange-50 sm:size-14">
              <TriangleAlert
                className="size-6 text-orange-ink sm:size-7"
                aria-hidden="true"
              />
            </span>
            <h3 className="font-display mt-5 text-xl font-bold text-navy sm:mt-6">
              {why.problem.title}
            </h3>
            <p className="mt-3 leading-relaxed text-ink-muted">
              {why.problem.body}
            </p>
          </article>

          {/* Notre reponse */}
          <article className="rounded-3xl border border-brand/15 bg-brand-50/60 p-6 sm:p-8">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white sm:size-14">
              <HandHeart
                className="size-6 text-brand sm:size-7"
                aria-hidden="true"
              />
            </span>
            <h3 className="font-display mt-5 text-xl font-bold text-navy sm:mt-6">
              {why.answer.title}
            </h3>
            <p className="mt-3 leading-relaxed text-ink-muted">
              {why.answer.body}
            </p>
          </article>
        </div>

        {/* L'enjeu, en une phrase */}
        <div className="mt-8 flex flex-col items-center gap-6 rounded-3xl bg-navy px-6 py-8 text-center text-white sm:mt-10 sm:px-10 sm:py-10">
          <p className="max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
            {why.stake}
          </p>
          <ButtonLink href={path(locale, "programs")} variant="accent">
            {common.discover}
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
