import { ArrowRight, Check, HandHeart, TriangleAlert, X } from "lucide-react";
import { path, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

/**
 * Raison d'etre de la fondation : le constat, la reponse, puis l'enjeu
 * pour la societe.
 *
 * Placee juste apres la banniere d'accueil, avant la liste des programmes :
 * le visiteur comprend le probleme avant qu'on lui presente les moyens
 * d'agir. Le bandeau final met face a face les deux trajectoires possibles
 * d'un meme enfant, car c'est la que se joue l'argument : ces enfants sont
 * la societe de demain.
 */
export function Why({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { why } = dictionary.home;
  const { stake } = why;
  const { common } = dictionary;

  return (
    <section className="section border-y border-line bg-white">
      <Container>
        <SectionHeading
          eyebrow={why.eyebrow}
          title={why.title}
          lead={why.lead}
          align="center"
        />

        <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-2">
          {/* Le constat */}
          <article className="reveal rounded-card border border-line bg-canvas p-6 sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-xl bg-orange-50">
              <TriangleAlert
                className="size-5.5 text-orange-ink"
                aria-hidden="true"
              />
            </span>
            <h3 className="font-display mt-5 text-h3 font-bold text-navy">
              {why.problem.title}
            </h3>
            <p className="mt-3 leading-relaxed text-ink-muted">
              {why.problem.body}
            </p>
          </article>

          {/* Notre reponse */}
          <article className="reveal rounded-card border border-brand/15 bg-brand-50/60 p-6 sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-xl bg-white">
              <HandHeart
                className="size-5.5 text-brand"
                aria-hidden="true"
              />
            </span>
            <h3 className="font-display mt-5 text-h3 font-bold text-navy">
              {why.answer.title}
            </h3>
            <p className="mt-3 leading-relaxed text-ink-muted">
              {why.answer.body}
            </p>
          </article>
        </div>

        {/* L'enjeu : les deux trajectoires d'un meme enfant */}
        <div className="reveal-panel mt-8 overflow-hidden rounded-panel bg-navy px-6 py-10 text-white sm:mt-10 sm:px-10 sm:py-12 lg:px-14">
          <SectionHeading
            eyebrow={stake.eyebrow}
            title={stake.title}
            lead={stake.lead}
            align="center"
            tone="light"
          />

          <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2">
            <Trajectory
              title={stake.without.title}
              items={stake.without.items}
              tone="without"
            />
            <Trajectory
              title={stake.with.title}
              items={stake.with.items}
              tone="with"
            />
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-white/85 sm:text-lg">
            {stake.conclusion}
          </p>

          <div className="mt-8 flex justify-center">
            <ButtonLink href={path(locale, "programs")} variant="accent">
              {common.discover}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Une des deux trajectoires. La couleur ne porte jamais seule
 * l'information : chaque puce garde son icone, croix ou coche.
 */
function Trajectory({
  title,
  items,
  tone,
}: {
  title: string;
  items: readonly string[];
  tone: "without" | "with";
}) {
  const without = tone === "without";
  const Icon = without ? X : Check;

  return (
    <div
      className={
        without
          ? "rounded-card bg-white/[0.06] p-6 ring-1 ring-white/10 sm:p-8"
          : "rounded-card bg-teal/15 p-6 ring-1 ring-teal/30 sm:p-8"
      }
    >
      <h3 className="font-display text-h3 font-bold">{title}</h3>

      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span
              className={
                without
                  ? "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-orange/25"
                  : "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-teal/30"
              }
            >
              <Icon
                className={
                  without ? "size-3.5 text-sun" : "size-3.5 text-white"
                }
                aria-hidden="true"
              />
            </span>
            <span className="text-sm leading-relaxed text-white/80">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
