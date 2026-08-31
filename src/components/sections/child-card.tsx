import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { path, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Child } from "@/lib/sponsorship";
import { accentClasses } from "@/lib/accents";
import { Money } from "@/components/ui/money";
import { resolvePhoto } from "@/lib/public-photo";

export function ChildCard({
  child,
  locale,
  dictionary,
}: {
  child: Child;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const accent = accentClasses[child.accent];
  const photo = resolvePhoto(child.photo);
  const { card } = dictionary.sponsorship;
  const href = `${path(locale, "sponsorship")}/${child.reference.toLowerCase()}`;
  const complete = child.progress >= 100;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className={`relative aspect-[4/3] ${accent.softBg}`}>
        {photo ? (
          <Image
            src={photo}
            alt={child.firstName}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          /* Aucune photo autorisee : monogramme, jamais d'image d'emprunt */
          <span
            className={`font-display absolute inset-0 flex items-center justify-center text-5xl font-extrabold sm:text-6xl ${accent.text} opacity-40`}
            aria-hidden="true"
          >
            {child.firstName.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-navy sm:text-xl">
            <Link href={href} className="after:absolute after:inset-0">
              {child.firstName}
            </Link>
          </h3>
          <span className="text-sm text-ink-muted">
            {child.age} {card.age}
          </span>
        </div>

        <p className="mt-1.5 text-sm text-ink-muted">
          {child.country} · {card.grade} {child.grade}
        </p>

        {/* Avancement de la collecte : la valeur est aussi ecrite en clair */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-semibold text-navy tabular-nums">
              <Money gnf={child.raised} locale={locale} />{" "}
              <span className="font-normal text-ink-muted">{card.collected}</span>
            </span>
            <span className="font-display font-bold tabular-nums text-navy">
              {child.progress} %
            </span>
          </div>
          <div
            className="mt-2 h-2.5 overflow-hidden rounded-full bg-canvas"
            role="progressbar"
            aria-valuenow={child.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${child.firstName} — ${card.funded}`}
          >
            <div
              className={`h-full rounded-full ${accent.bar}`}
              style={{ width: `${child.progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-ink-muted tabular-nums">
            <Money gnf={child.goal} locale={locale} /> {card.goal}
          </p>
        </div>

        <span
          className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${accent.text}`}
        >
          {complete ? card.fullyFunded : card.discover}
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  );
}
