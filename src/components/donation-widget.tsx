"use client";

import { useId, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { path } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { donationAmounts } from "@/lib/content";
import { formatAmount } from "@/lib/format";
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
  const [selected, setSelected] = useState<number | null>(donationAmounts[1]);
  const [custom, setCustom] = useState("");

  const impact =
    selected !== null
      ? impactLabels[String(selected) as keyof typeof impactLabels]
      : undefined;

  return (
    <div className="rounded-3xl border border-line bg-white p-7 shadow-soft sm:p-9">
      <h2 className="font-display text-2xl font-bold text-navy">
        {amounts.title}
      </h2>

      {/* Frequence */}
      <div
        role="radiogroup"
        aria-label={amounts.title}
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
        className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {donationAmounts.map((amount) => {
          const active = selected === amount;
          return (
            <button
              key={amount}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                setSelected(amount);
                setCustom("");
              }}
              className={cn(
                "font-display min-h-14 cursor-pointer rounded-2xl border-2 text-lg font-bold tabular-nums transition-[border-color,background-color,color] duration-200",
                active
                  ? "border-brand bg-brand-50 text-brand"
                  : "border-line text-navy hover:border-brand/40",
              )}
            >
              {formatAmount(amount, locale)}
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
        <input
          id={customId}
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={custom}
          onChange={(event) => {
            setCustom(event.target.value);
            setSelected(null);
          }}
          placeholder={amounts.customPlaceholder}
          aria-label={amounts.customLabel}
          className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-base tabular-nums text-ink transition-colors duration-150 focus:border-brand focus:outline-none"
        />
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
