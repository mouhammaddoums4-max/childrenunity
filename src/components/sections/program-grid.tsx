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
          <li key={program.slug} className="reveal">
            <Link
              href={`${path(locale, "programs")}#${program.slug}`}
              className="group flex h-full flex-col rounded-card border border-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-200 ease-soft hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-soft sm:p-7"
            >
              <span
                className={`flex size-11 items-center justify-center rounded-xl ${accent.softBg}`}
              >
                <Icon className={`size-5.5 ${accent.text}`} aria-hidden="true" />
              </span>

              <h3
                className={`font-display mt-5 text-h3 font-bold ${accent.text}`}
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
