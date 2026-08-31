"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import { path, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { useConsent } from "@/lib/consent";
import { Button } from "@/components/ui/button";

/**
 * Bandeau de consentement. Il n'apparait que tant que le visiteur n'a pas
 * repondu, et son absence de reponse vaut refus : rien de tiers n'est
 * charge avant un accord explicite.
 */
export function CookieNotice({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const [level, setLevel] = useConsent();
  const { consent } = dictionary;

  if (level !== "unknown") return null;

  return (
    <div
      role="dialog"
      aria-label={consent.label}
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-5 rounded-3xl border border-line bg-white/95 p-6 shadow-lift backdrop-blur-md sm:flex-row sm:items-center sm:gap-7">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50">
          <Cookie className="size-6 text-brand" aria-hidden="true" />
        </span>

        <div className="flex-1">
          <h2 className="font-display font-bold text-navy">{consent.title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            {consent.body}{" "}
            <Link
              href={path(locale, "privacy")}
              className="font-semibold text-brand hover:underline"
            >
              {consent.learnMore}
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
          <Button variant="outline" onClick={() => setLevel("essential")}>
            {consent.essential}
          </Button>
          <Button onClick={() => setLevel("all")}>{consent.acceptAll}</Button>
        </div>
      </div>
    </div>
  );
}
