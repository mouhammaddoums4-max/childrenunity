"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import { path, type Locale, type RouteKey } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/cn";

type NavKey = Exclude<RouteKey, "donate">;

const navKeys: NavKey[] = [
  "home",
  "about",
  "programs",
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

  /* Le menu mobile se referme des que l'on change de page. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
        "sticky top-0 z-40 border-b transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-line bg-white/95 shadow-soft backdrop-blur-md"
          : "border-transparent bg-white",
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-4">
        <Logo locale={locale} />

        <nav
          aria-label={dictionary.meta.siteName}
          className="hidden items-center gap-1 lg:flex"
        >
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "relative rounded-full px-3 py-2 text-[13px] font-semibold tracking-wide whitespace-nowrap uppercase transition-colors duration-200 xl:px-3.5",
                item.active
                  ? "text-brand"
                  : "text-ink-muted hover:text-navy",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand transition-transform duration-200",
                  item.active ? "scale-x-100" : "scale-x-0",
                )}
              />
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

          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} label={nav.changeLanguage} />
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? nav.closeMenu : nav.openMenu}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line text-navy transition-colors duration-200 hover:bg-brand-50 lg:hidden"
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
          className="border-t border-line bg-white lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-5">
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "rounded-2xl px-4 py-3.5 text-base font-semibold transition-colors duration-150",
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
              <LanguageSwitcher locale={locale} label={nav.changeLanguage} />
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
