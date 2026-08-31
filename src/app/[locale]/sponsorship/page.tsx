import type { Metadata } from "next";
import { ShieldCheck, Users } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { eligibleAges, getChildren } from "@/lib/sponsorship";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { ChildCard } from "@/components/sections/child-card";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { sponsorship } = getDictionary(locale);
  return {
    title: sponsorship.meta.title,
    description: sponsorship.meta.description,
  };
}

const stepColors = [
  "bg-brand text-white",
  "bg-teal text-white",
  "bg-orange text-white",
  "bg-navy text-white",
];

export default async function SponsorshipPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const { sponsorship } = dictionary;
  const children = getChildren(locale);

  return (
    <>
      <PageHero
        eyebrow={sponsorship.hero.eyebrow}
        title={sponsorship.hero.title}
        lead={sponsorship.hero.lead}
      />

      {/* Enfants proposes au parrainage */}
      <section className="section-sm">
        <Container>
          {/* Condition d'age, annoncee avant la liste */}
          <p className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium text-navy sm:mb-10">
            <Users className="size-4 shrink-0 text-brand" aria-hidden="true" />
            {sponsorship.eligibility
              .replace("{min}", String(eligibleAges.min))
              .replace("{max}", String(eligibleAges.max))}
          </p>

          {children.length === 0 ? (
            <p className="rounded-card border border-line bg-white p-7 text-center text-ink-muted sm:p-10">
              {sponsorship.empty}
            </p>
          ) : null}

          <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {children.map((child) => (
              <li key={child.reference}>
                <ChildCard
                  child={child}
                  locale={locale}
                  dictionary={dictionary}
                />
              </li>
            ))}
          </ul>

          {/* Engagement de protection, affiche avec les fiches */}
          <div className="mt-10 flex items-start gap-3.5 rounded-card border border-line bg-white p-5 shadow-soft sm:mt-12 sm:gap-4 sm:p-6 lg:p-7">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 sm:size-12">
              <ShieldCheck className="size-5 text-teal-ink sm:size-6" aria-hidden="true" />
            </span>
            <p className="max-w-4xl text-[0.9375rem] leading-relaxed text-ink-muted sm:text-base">
              <span className="font-semibold text-navy">
                {sponsorship.privacy.title} —{" "}
              </span>
              {sponsorship.privacy.body}
            </p>
          </div>
        </Container>
      </section>

      {/* Fonctionnement */}
      <section className="bg-white section">
        <Container>
          <SectionHeading
            eyebrow={sponsorship.how.eyebrow}
            title={sponsorship.how.title}
            align="center"
          />

          <ol className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {sponsorship.how.steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-card border border-line bg-canvas p-6 sm:p-7"
              >
                <span
                  className={`font-display flex size-11 items-center justify-center rounded-xl text-lg font-bold tabular-nums ${stepColors[index]}`}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <h3 className="font-display mt-5 text-h3 font-bold text-navy">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
