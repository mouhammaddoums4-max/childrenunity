"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

/**
 * Reconstruit l'URL courante dans une autre langue : seul le premier
 * segment du chemin change, les segments de route etant partages.
 */
function swapLocale(pathname: string, next: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${next}`;
  segments[0] = next;
  return `/${segments.join("/")}`;
}

/**
 * Interrupteur FR/EN flottant, ancre au milieu du bord droit de la
 * fenetre. Les deux langues restent visibles en permanence : le pouce
 * violet glisse sur celle qui est active, comme un bouton switch.
 */
export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const activeIndex = Math.max(0, locales.indexOf(locale));

  return (
    <div className="fixed top-1/2 right-3 z-30 -translate-y-1/2 sm:right-5">
      <div
        role="group"
        aria-label={label}
        className="relative flex flex-col gap-1 rounded-full border border-line bg-white/90 p-1 shadow-lift backdrop-blur-md"
      >
        {/* Pouce coulissant : purement decoratif, l'etat reel est porte
            par aria-current sur le lien actif. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-1 top-1 h-9 rounded-full bg-brand shadow-soft transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${activeIndex * 2.5}rem)` }}
        />

        {locales.map((code) => {
          const active = code === locale;
          return (
            <Link
              key={code}
              href={swapLocale(pathname, code)}
              lang={code}
              hrefLang={code}
              aria-current={active ? "true" : undefined}
              title={localeNames[code]}
              className={cn(
                "relative z-10 flex size-9 items-center justify-center rounded-full text-xs font-bold tracking-wide uppercase transition-colors duration-200",
                active ? "text-white" : "text-ink-muted hover:text-brand",
              )}
            >
              {code}
              <span className="sr-only"> — {localeNames[code]}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
