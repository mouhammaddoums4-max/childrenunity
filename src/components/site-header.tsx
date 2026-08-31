"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import { path, type Locale, type RouteKey } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/cn";

/* Le tunnel de paiement et la page de don ne sont pas des onglets. */
type NavKey = Exclude<RouteKey, "donate" | "give" | "privacy">;

const navKeys: NavKey[] = [
  "home",
  "about",
  "programs",
  "sponsorship",
  "membership",
  "impact",
  "news",
  "contact",
];

export function SiteHeader({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { nav, common } = dictionary;
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Le menu mobile se referme des que l'on change de page. C'est un etat
     derive du chemin, ajuste pendant le rendu plutot que par un effet :
     React applique le changement avant de peindre, sans rendu en cascade. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  /* Fond plein et ombre une fois la page defilee. */
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Panneau mobile ouvert : on bloque le defilement derriere lui. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const items = navKeys.map((key) => {
    const href = path(locale, key);
    const active = key === "home" ? pathname === href : pathname.startsWith(href);
    return { key, href, active, label: nav[key] };
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-line transition-colors duration-300 ease-soft",
        scrolled ? "bg-white/85 backdrop-blur-xl" : "bg-white",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-3 sm:h-18 sm:gap-5 lg:h-20 lg:gap-6">
        <Logo locale={locale} className="shrink-0" />

        <nav
          aria-label={dictionary.meta.siteName}
          className="hidden items-center gap-0.5 xl:flex"
        >
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-2 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200 ease-soft xl:px-3.5",
                item.active
                  ? "bg-brand-50 text-brand"
                  : "text-ink-muted hover:bg-canvas hover:text-navy",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ButtonLink
            href={path(locale, "donate")}
            className="hidden whitespace-nowrap sm:inline-flex"
          >
            <Heart className="size-4" aria-hidden="true" />
            {common.donate}
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? nav.closeMenu : nav.openMenu}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line text-navy transition-colors duration-200 ease-soft hover:bg-canvas xl:hidden"
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {open ? (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-white xl:hidden"
        >
          <Container className="flex flex-col gap-1 py-5">
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "rounded-xl px-4 py-3.5 text-base font-semibold transition-colors duration-150",
                  item.active
                    ? "bg-brand-50 text-brand"
                    : "text-navy hover:bg-canvas",
                )}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-3 border-t border-line pt-5">
              <ButtonLink href={path(locale, "donate")} size="lg">
                <Heart className="size-4" aria-hidden="true" />
                {common.donate}
              </ButtonLink>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
