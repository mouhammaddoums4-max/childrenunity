import type { Metadata } from "next";
import { getDictionary } from "@/i18n/dictionaries";
import { getArticles } from "@/lib/content";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { ArticleCard } from "@/components/sections/article-card";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { meta } = getDictionary(locale);
  return { title: meta.news.title, description: meta.news.description };
}

export default async function NewsPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const articles = getArticles(locale);

  return (
    <>
      <PageHero
        eyebrow={dictionary.news.hero.eyebrow}
        title={dictionary.news.hero.title}
        lead={dictionary.news.hero.lead}
      />

      <section className="section">
        <Container>
          {articles.length === 0 ? (
            <p className="rounded-card border border-line bg-white p-7 text-center text-ink-muted sm:p-10">
              {dictionary.news.empty}
            </p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {articles.map((article) => (
                <li key={article.slug}>
                  <ArticleCard
                    article={article}
                    locale={locale}
                    dictionary={dictionary}
                  />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
