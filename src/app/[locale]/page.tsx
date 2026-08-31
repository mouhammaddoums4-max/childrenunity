import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { path } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getArticles } from "@/lib/content";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Hero } from "@/components/sections/hero";
import { Why } from "@/components/sections/why";
import { ProgramGrid } from "@/components/sections/program-grid";
import { StatsBand } from "@/components/sections/stats-band";
import { Approach } from "@/components/sections/approach";
import { Testimonials } from "@/components/sections/testimonials";
import { ArticleCard } from "@/components/sections/article-card";
import { Partners } from "@/components/sections/partners";
import { CtaBand } from "@/components/sections/cta-band";

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const { home, common } = dictionary;
  const articles = getArticles(locale).slice(0, 3);

  return (
    <>
      <Hero locale={locale} dictionary={dictionary} />

      <Why locale={locale} dictionary={dictionary} />

      {/* Programmes */}
      <section className="section-sm">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={home.programs.eyebrow}
              title={home.programs.title}
              lead={home.programs.lead}
            />
            <ButtonLink
              href={path(locale, "programs")}
              variant="outline"
              className="hidden sm:inline-flex"
            >
              {common.allPrograms}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>

          <div className="mt-10 sm:mt-12">
            <ProgramGrid locale={locale} label={common.learnMore} />
          </div>
        </Container>
      </section>

      <StatsBand locale={locale} />

      {/* Qui nous sommes */}
      <section className="section">
        <Container className="grid items-center gap-10 sm:gap-14 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Photo
              src={["/images/community.webp", "/hero.webp"]}
              alt={home.about.imageAlt}
              ratio="aspect-[4/3] lg:aspect-[5/4]"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="shadow-lift"
            />
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow={home.about.eyebrow}
              title={home.about.title}
              lead={home.about.body}
            />

            <ul className="mt-8 space-y-4">
              {home.about.points.map((point) => (
                <li key={point} className="flex gap-3.5">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-teal/15">
                    <Check className="size-3.5 text-teal-ink" aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-relaxed text-ink">{point}</span>
                </li>
              ))}
            </ul>

            <ButtonLink href={path(locale, "about")} className="mt-9">
              {common.learnMore}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Approach dictionary={dictionary} />

      <Testimonials locale={locale} dictionary={dictionary} />

      {/* Actualites */}
      {articles.length > 0 ? (
        <section className="section">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow={home.news.eyebrow}
                title={home.news.title}
                lead={home.news.lead}
              />
              <Link
                href={path(locale, "news")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
              >
                {common.allNews}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <ul className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-3">
              {articles.map((article) => (
                <li key={article.slug} className="relative">
                  <ArticleCard
                    article={article}
                    locale={locale}
                    dictionary={dictionary}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <Partners dictionary={dictionary} />

      <CtaBand locale={locale} dictionary={dictionary} />
    </>
  );
}
