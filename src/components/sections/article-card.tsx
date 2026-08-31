import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { path, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Article } from "@/lib/content";
import { accentClasses } from "@/lib/accents";
import { formatDate } from "@/lib/format";

export function ArticleCard({
  article,
  locale,
  dictionary,
}: {
  article: Article;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const accent = accentClasses[article.accent];
  const href = `${path(locale, "news")}/${article.slug}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
      {/* Bandeau colore tenant lieu de visuel d'article */}
      <div className={`h-2.5 ${accent.bar}`} aria-hidden="true" />

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <span
          className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${accent.softBg} ${accent.text}`}
        >
          {article.category}
        </span>

        <h3 className="font-display mt-4 text-lg leading-snug font-bold text-navy sm:text-xl">
          <Link href={href} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
          {article.excerpt}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden="true" />
            <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {article.readingTime} {dictionary.news.readingTime}
          </span>
          <span
            className={`ml-auto inline-flex items-center gap-1.5 font-semibold ${accent.text}`}
          >
            {dictionary.common.readMore}
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
