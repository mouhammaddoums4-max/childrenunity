"use client";

import { useEffect, useId, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { path } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  currencies,
  currencyCodes,
  detectCurrency,
  formatMoney,
  type CurrencyCode,
} from "@/lib/currency";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Frequency = "once" | "monthly";

export function DonationWidget({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { amounts, impactLabels, notice } = dictionary.donate;
  const customId = useId();

  const [frequency, setFrequency] = useState<Frequency>("once");
  /* Le rendu serveur part d'une devise stable ; la devise du visiteur est
     appliquee apres montage, pour ne pas casser l'hydratation. */
  const [currency, setCurrency] = useState<CurrencyCode>(
    locale === "fr" ? "EUR" : "USD",
  );
  const [index, setIndex] = useState<number | null>(1);
  const [custom, setCustom] = useState("");

  useEffect(() => {
    setCurrency(detectCurrency(locale));
  }, [locale]);

  const active = currencies[currency];
  const impact =
    index !== null ? impactLabels[active.impactKeys[index]] : undefined;

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-9">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-navy">
          {amounts.title}
        </h2>

        {/* Devise detectee automatiquement, modifiable a la main */}
        <label className="flex items-center gap-2 text-sm">
          <span className="sr-only">{amounts.currencyLabel}</span>
          <select
            value={currency}
            onChange={(event) => {
              setCurrency(event.target.value as CurrencyCode);
              setCustom("");
              setIndex((current) => current ?? 1);
            }}
            aria-label={amounts.currencyLabel}
            className="min-h-11 cursor-pointer rounded-full border border-line bg-white px-4 font-semibold text-navy transition-colors duration-150 hover:border-brand/40 focus:border-brand focus:outline-none"
          >
            {currencyCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Frequence */}
      <div
        role="radiogroup"
        aria-label={amounts.frequencyLabel}
        className="mt-6 grid grid-cols-2 gap-1.5 rounded-full bg-canvas p-1.5"
      >
        {(["once", "monthly"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={frequency === value}
            onClick={() => setFrequency(value)}
            className={cn(
              "min-h-11 cursor-pointer rounded-full px-4 text-sm font-semibold transition-colors duration-200",
              frequency === value
                ? "bg-brand text-white shadow-soft"
                : "text-ink-muted hover:text-navy",
            )}
          >
            {value === "once" ? amounts.once : amounts.monthly}
          </button>
        ))}
      </div>

      {/* Montants proposes */}
      <div
        role="radiogroup"
        aria-label={amounts.title}
        className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3"
      >
        {active.amounts.map((amount, position) => {
          const selected = index === position;
          return (
            <button
              key={amount}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                setIndex(position);
                setCustom("");
              }}
              className={cn(
                "font-display min-h-14 cursor-pointer rounded-2xl border-2 px-2 text-base font-bold tabular-nums transition-[border-color,background-color,color] duration-200",
                selected
                  ? "border-brand bg-brand-50 text-brand"
                  : "border-line text-navy hover:border-brand/40",
              )}
            >
              {formatMoney(amount, currency, locale)}
              {frequency === "monthly" ? (
                <span className="block text-xs font-medium text-ink-muted">
                  {amounts.perMonth}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Montant libre */}
      <div className="mt-5">
        <label htmlFor={customId} className="block text-sm font-semibold text-navy">
          {amounts.custom}
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            id={customId}
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={custom}
            onChange={(event) => {
              setCustom(event.target.value);
              setIndex(null);
            }}
            placeholder={amounts.customPlaceholder}
            aria-label={amounts.customLabel}
            className="min-h-12 w-full rounded-2xl border border-line bg-white px-4 text-base tabular-nums text-ink transition-colors duration-150 focus:border-brand focus:outline-none"
          />
          <span className="font-display shrink-0 font-bold text-ink-muted">
            {currency}
          </span>
        </div>
      </div>

      {/* Ce que finance le montant choisi */}
      {impact ? (
        <p
          aria-live="polite"
          className="mt-6 rounded-2xl bg-brand-50 p-5 text-sm leading-relaxed text-ink"
        >
          {impact}
        </p>
      ) : null}

      <ButtonLink
        href={path(locale, "contact")}
        size="lg"
        className="mt-7 w-full"
      >
        {amounts.continue}
        <ArrowRight className="size-4.5" aria-hidden="true" />
      </ButtonLink>

      <p className="mt-5 flex items-start gap-2.5 text-xs leading-relaxed text-ink-muted">
        <Info className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
        {notice}
      </p>
    </div>
  );
}
