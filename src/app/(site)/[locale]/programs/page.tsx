import type { Metadata } from "next";
import { Check, Heart, TrendingUp } from "lucide-react";
import { path } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPrograms } from "@/lib/content";
import { accentClasses } from "@/lib/accents";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { programIcon } from "@/components/ui/icons";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { meta } = getDictionary(locale);
  return { title: meta.programs.title, description: meta.programs.description };
}

export default async function ProgramsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const { programs: copy, common } = dictionary;
  const programs = getPrograms(locale);

  return (
    <>
      <PageHero
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        lead={copy.hero.lead}
      />

      {/* Sommaire cliquable des six programmes */}
      <section className="border-b border-line bg-white py-5 sm:py-6">
        <Container>
          <ul className="flex flex-wrap gap-2 sm:gap-2.5">
            {programs.map((program) => {
              const accent = accentClasses[program.accent];
              return (
                <li key={program.slug}>
                  <a
                    href={`#${program.slug}`}
                    className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold transition-opacity duration-200 hover:opacity-80 ${accent.softBg} ${accent.text}`}
                  >
                    {program.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <div className="divide-y divide-line">
        {programs.map((program, index) => {
          const Icon = programIcon(program.icon);
          const accent = accentClasses[program.accent];
          const reversed = index % 2 === 1;

          return (
            <section
              key={program.slug}
              id={program.slug}
              className={index % 2 === 1 ? "bg-white" : ""}
            >
              <Container className="section-sm">
                <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                  <div className={reversed ? "lg:order-2" : undefined}>
                    <span
                      className={`flex size-14 items-center justify-center rounded-card sm:size-16 ${accent.softBg}`}
                    >
                      <Icon className={`size-6 ${accent.text}`} aria-hidden="true" />
                    </span>

                    <h2
                      className={`font-display mt-5 text-h2 font-bold sm:mt-6 ${accent.text}`}
                    >
                      {program.title}
                    </h2>
                    <p className="mt-3 text-base font-medium text-navy sm:text-lg">
                      {program.summary}
                    </p>
                    <p className="mt-5 leading-relaxed text-ink-muted">
                      {program.description}
                    </p>

                    <div
                      className={`mt-8 flex items-start gap-3.5 rounded-xl p-5 ${accent.softBg}`}
                    >
                      <TrendingUp
                        className={`mt-0.5 size-5 shrink-0 ${accent.text}`}
                        aria-hidden="true"
                      />
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-navy">
                          {copy.impactTitle} :{" "}
                        </span>
                        <span className="text-ink-muted">{program.result}</span>
                      </p>
                    </div>
                  </div>

                  <div className={reversed ? "lg:order-1" : undefined}>
                    <div className="rounded-card border border-line bg-white p-6 sm:p-8">
                      <h3 className="font-display text-lg font-bold text-navy">
                        {copy.detailTitle}
                      </h3>
                      <ul className="mt-6 space-y-4">
                        {program.features.map((feature) => (
                          <li key={feature} className="flex gap-3.5">
                            <span
                              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${accent.softBg}`}
                            >
                              <Check
                                className={`size-3.5 ${accent.text}`}
                                aria-hidden="true"
                              />
                            </span>
                            <span className="text-sm leading-relaxed text-ink">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      <section className="section">
        <Container>
          <div className="rounded-panel bg-navy p-7 text-center text-white sm:p-10 lg:p-14">
            <h2 className="font-display text-h2 font-bold">
              {copy.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/80">
              {copy.cta.body}
            </p>
            <ButtonLink
              href={path(locale, "donate")}
              variant="accent"
              size="lg"
              className="mt-8"
            >
              <Heart className="size-4.5" aria-hidden="true" />
              {common.donate}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
