import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { path, type Locale } from "@/i18n/config";
import { getPrograms } from "@/lib/content";
import { accentClasses } from "@/lib/accents";
import { programIcon } from "@/components/ui/icons";

export function ProgramGrid({
  locale,
  label,
}: {
  locale: Locale;
  /** Texte du lien de chaque carte (visuellement une fleche seule). */
  label: string;
}) {
  const programs = getPrograms(locale);

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => {
        const Icon = programIcon(program.icon);
        const accent = accentClasses[program.accent];

        return (
          <li key={program.slug}>
            <Link
              href={`${path(locale, "programs")}#${program.slug}`}
              className="group flex h-full flex-col rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-lift"
            >
              <span
                className={`flex size-12 items-center justify-center rounded-2xl sm:size-14 ${accent.softBg}`}
              >
                <Icon className={`size-6 sm:size-7 ${accent.text}`} aria-hidden="true" />
              </span>

              <h3
                className={`font-display mt-5 text-lg font-bold sm:mt-6 ${accent.text}`}
              >
                {program.title}
              </h3>

              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-muted">
                {program.summary}
              </p>

              <span
                className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${accent.text}`}
              >
                <span className="sr-only">
                  {label} : {program.title}
                </span>
                <ArrowRight
                  className="size-5 transition-transform duration-300 group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
