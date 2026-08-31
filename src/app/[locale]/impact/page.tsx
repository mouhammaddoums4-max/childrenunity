import type { Metadata } from "next";
import { Info, MapPin } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { getCountries, getResults } from "@/lib/content";
import { accentClasses } from "@/lib/accents";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatsBand } from "@/components/sections/stats-band";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { meta } = getDictionary(locale);
  return { title: meta.impact.title, description: meta.impact.description };
}

/* Teintes de la charte, de la plus foncee a la plus claire : la part
   diminue en meme temps que l'intensite, et chaque barre porte sa
   valeur en clair (la couleur ne porte aucune information a elle seule). */
const allocationBars = ["bg-brand", "bg-teal", "bg-orange", "bg-navy"];

export default async function ImpactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const { impact } = dictionary;
  const results = getResults(locale);
  const countries = getCountries(locale);

  return (
    <>
      <PageHero
        eyebrow={impact.hero.eyebrow}
        title={impact.hero.title}
        lead={impact.hero.lead}
      />

      <StatsBand locale={locale} />

      {/* Resultats detailles */}
      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow={impact.results.eyebrow}
            title={impact.results.title}
            align="center"
          />

          <ul className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {results.map((result) => {
              const accent = accentClasses[result.accent];
              return (
                <li
                  key={result.label}
                  className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8"
                >
                  <p
                    className={`font-display text-3xl font-extrabold tabular-nums sm:text-4xl ${accent.text}`}
                  >
                    {result.value}
                  </p>
                  <h3 className="font-display mt-3 text-lg font-bold text-navy">
                    {result.label}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                    {result.detail}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Repartition des depenses */}
      <section className="bg-white py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow={impact.allocation.eyebrow}
            title={impact.allocation.title}
            lead={impact.allocation.lead}
          />

          <ul className="mt-10 max-w-3xl space-y-6 sm:mt-12 sm:space-y-7">
            {impact.allocation.items.map((item, index) => (
              <li key={item.label}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-medium text-navy">{item.label}</span>
                  <span className="font-display text-lg font-bold tabular-nums text-navy">
                    {item.value} %
                  </span>
                </div>
                <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-canvas">
                  <div
                    className={`h-full rounded-full ${allocationBars[index % allocationBars.length]}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-10 flex max-w-3xl items-start gap-3 rounded-2xl bg-canvas p-5 text-sm leading-relaxed text-ink-muted">
            <Info className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
            {impact.allocation.note}
          </p>
        </Container>
      </section>

      {/* Pays d'intervention */}
      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow={impact.countries.eyebrow}
            title={impact.countries.title}
            lead={impact.countries.lead}
            align="center"
          />

          <ul className="mt-10 grid gap-3.5 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {countries.map((country) => (
              <li
                key={country.code}
                className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-4 shadow-soft sm:gap-4 sm:p-5"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-50">
                  <MapPin className="size-5 text-brand" aria-hidden="true" />
                </span>
                <span>
                  <span className="font-display block font-bold text-navy">
                    {country.name}
                  </span>
                  <span className="text-sm tabular-nums text-ink-muted">
                    {country.since}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
