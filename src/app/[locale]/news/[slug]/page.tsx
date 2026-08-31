import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { locales, path } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getArticle, getArticleSlugs } from "@/lib/content";
import { accentClasses } from "@/lib/accents";
import { formatDate } from "@/lib/format";
import { resolveLocale } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { CtaBand } from "@/components/sections/cta-band";

type ArticleParams = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getArticleSlugs().map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: ArticleParams): Promise<Metadata> {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const article = getArticle(locale, slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({ params }: ArticleParams) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const article = getArticle(locale, slug);

  if (!article) notFound();

  const accent = accentClasses[article.accent];

  return (
    <>
      <article>
        <header className="border-b border-line bg-gradient-to-b from-brand-50/60 to-canvas">
          <Container className="py-14 sm:py-16">
            <Link
              href={path(locale, "news")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {dictionary.common.allNews}
            </Link>

            <span
              className={`mt-8 inline-flex rounded-full px-3.5 py-1.5 text-xs font-semibold ${accent.softBg} ${accent.text}`}
            >
              {article.category}
            </span>

            <h1 className="font-display mt-4 max-w-3xl text-3xl leading-tight font-extrabold text-navy sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" aria-hidden="true" />
                <time dateTime={article.date}>
                  {dictionary.news.published} {formatDate(article.date, locale)}
                </time>
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4" aria-hidden="true" />
                {article.readingTime} {dictionary.news.readingTime}
              </span>
            </div>
          </Container>
        </header>

        <Container className="py-14 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-lg leading-relaxed font-medium text-navy">
              {article.excerpt}
            </p>

            <div className="mt-8 space-y-6">
              {article.body.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </article>

      <CtaBand locale={locale} dictionary={dictionary} />
    </>
  );
}
