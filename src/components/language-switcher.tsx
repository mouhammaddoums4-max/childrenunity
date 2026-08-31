"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
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

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors duration-200 hover:border-brand/40 hover:bg-brand-50"
      >
        <Languages className="size-4 text-brand" aria-hidden="true" />
        <span className="uppercase">{locale}</span>
        <ChevronDown
          className={cn(
            "size-4 text-ink-muted transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift"
        >
          {locales.map((code) => (
            <Link
              key={code}
              role="menuitem"
              href={swapLocale(pathname, code)}
              onClick={() => setOpen(false)}
              lang={code}
              hrefLang={code}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                code === locale
                  ? "bg-brand-50 text-brand"
                  : "text-ink hover:bg-canvas",
              )}
            >
              {localeNames[code]}
              {code === locale ? (
                <Check className="size-4" aria-hidden="true" />
              ) : null}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
