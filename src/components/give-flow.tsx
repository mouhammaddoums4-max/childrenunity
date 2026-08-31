"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  Landmark,
  Smartphone,
  Wallet,
} from "lucide-react";
import { path, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  currencies,
  currencyCodes,
  formatMoney,
  fromGnf,
  toGnf,
} from "@/lib/currency";
import { useCurrency } from "@/lib/currency-store";
import {
  createReference,
  getPaymentMethods,
  type PaymentMethodId,
} from "@/lib/payments";
import {
  fill,
  methodNames,
  PaymentInstructions,
} from "@/components/payment-instructions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const methodIcons: Record<PaymentMethodId, typeof Smartphone> = {
  "orange-money": Smartphone,
  "mtn-momo": Smartphone,
  wave: Smartphone,
  card: Wallet,
  paypal: Wallet,
  bank: Landmark,
};

type Step = "amount" | "method" | "details" | "done";

export type GiveTarget = {
  /** Référence de l'enfant parrainé, si le tunnel part d'une fiche. */
  reference: string;
  name: string;
  /** Reste à financer, en francs guinéens. */
  remainingGnf: number;
};

export function GiveFlow({
  locale,
  dictionary,
  target,
}: {
  locale: Locale;
  dictionary: Dictionary;
  target?: GiveTarget;
}) {
  const { give } = dictionary;
  const ids = { name: useId(), email: useId(), phone: useId(), message: useId() };

  const [currency, setCurrency] = useCurrency();
  const [step, setStep] = useState<Step>("amount");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [index, setIndex] = useState<number | null>(1);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState<PaymentMethodId | null>(null);
  const [donor, setDonor] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState("");

  const methods = useMemo(() => getPaymentMethods(), []);
  const chosen = methods.find((entry) => entry.id === method);

  const amount =
    custom.trim() !== ""
      ? Number(custom)
      : index !== null
        ? currencies[currency].amounts[index]
        : 0;

  const amountLabel = Number.isFinite(amount) && amount > 0
    ? formatMoney(amount, currency, locale)
    : "";

  function goToMethod() {
    if (!Number.isFinite(amount) || amount <= 0) {
      setErrors({ amount: give.amount.invalid });
      return;
    }
    setErrors({});
    setStep("method");
  }

  function goToDetails() {
    if (!chosen?.available) {
      setErrors({ method: give.method.invalid });
      return;
    }
    setErrors({});
    setStep("details");
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: Record<string, string> = {};
    if (donor.name.trim().length < 2) found.name = give.details.errors.name;
    if (!EMAIL_PATTERN.test(donor.email.trim())) found.email = give.details.errors.email;
    if (donor.phone.trim().length < 6) found.phone = give.details.errors.phone;

    setErrors(found);
    const firstInvalid = (["name", "email", "phone"] as const).find((k) => found[k]);
    if (firstInvalid) {
      document.getElementById(ids[firstInvalid])?.focus();
      return;
    }

    /* Reference generee ici, jamais au rendu : le serveur et le navigateur
       produiraient sinon deux identifiants differents. */
    setReference(createReference(target ? "CUF-P" : "CUF-D"));
    setStep("done");
  }

  const stepOrder: Step[] = ["amount", "method", "details", "done"];
  const stepIndex = stepOrder.indexOf(step);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
      <div>
        {/* Fil des etapes */}
        <ol className="flex flex-wrap gap-x-2 gap-y-2 text-sm">
          {(["amount", "method", "details", "done"] as const).map((key, position) => {
            const done = position < stepIndex;
            const active = position === stepIndex;
            return (
              <li key={key} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                    active && "bg-brand text-white",
                    done && "bg-teal text-white",
                    !active && !done && "bg-canvas text-ink-muted",
                  )}
                  aria-hidden="true"
                >
                  {done ? <Check className="size-3.5" /> : position + 1}
                </span>
                <span
                  className={cn(
                    "font-medium",
                    active ? "text-navy" : "text-ink-muted",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {give.steps[key]}
                </span>
                {position < 3 ? (
                  <span className="mx-1 text-line" aria-hidden="true">
                    ·
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="mt-8 rounded-card border border-line bg-white p-6 sm:p-8">
          {step === "amount" ? (
            <>
              <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">
                {give.amount.title}
              </h2>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div
                  role="radiogroup"
                  aria-label={give.summary.frequency}
                  className="grid flex-1 grid-cols-2 gap-1.5 rounded-full bg-canvas p-1.5"
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
                      {value === "once" ? give.amount.once : give.amount.monthly}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2">
                  <span className="sr-only">{give.amount.currency}</span>
                  <select
                    value={currency}
                    onChange={(event) => {
                      setCurrency(event.target.value as typeof currency);
                      setCustom("");
                      setMethod(null);
                    }}
                    aria-label={give.amount.currency}
                    className="min-h-11 cursor-pointer rounded-full border border-line bg-white px-4 text-sm font-semibold text-navy hover:border-brand/40 focus:border-brand focus:outline-none"
                  >
                    {currencyCodes.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div
                role="radiogroup"
                aria-label={give.summary.amount}
                className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4"
              >
                {currencies[currency].amounts.map((value, position) => {
                  const selected = custom.trim() === "" && index === position;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => {
                        setIndex(position);
                        setCustom("");
                        setErrors({});
                      }}
                      className={cn(
                        "font-display min-h-14 cursor-pointer rounded-xl border-2 px-2 text-sm font-bold tabular-nums transition-colors duration-200 sm:text-base",
                        selected
                          ? "border-brand bg-brand-50 text-brand"
                          : "border-line text-navy hover:border-brand/40",
                      )}
                    >
                      {formatMoney(value, currency, locale)}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">
                <label
                  htmlFor={ids.name + "-amount"}
                  className="block text-sm font-semibold text-navy"
                >
                  {give.amount.custom}
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    id={ids.name + "-amount"}
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    value={custom}
                    onChange={(event) => {
                      setCustom(event.target.value);
                      setErrors({});
                    }}
                    aria-invalid={Boolean(errors.amount)}
                    className="min-h-12 w-full rounded-xl border border-line bg-white px-4 text-base tabular-nums text-ink focus:border-brand focus:outline-none"
                  />
                  <span className="font-display shrink-0 font-bold text-ink-muted">
                    {currency}
                  </span>
                </div>
                {errors.amount ? <FieldError>{errors.amount}</FieldError> : null}
              </div>

              {target ? (
                <p className="mt-6 rounded-xl bg-brand-50 p-5 text-sm leading-relaxed text-ink">
                  {fill(give.amount.goalRemaining, { name: target.name })} :{" "}
                  <span className="font-semibold tabular-nums">
                    {formatMoney(
                      fromGnf(target.remainingGnf, currency),
                      currency,
                      locale,
                    )}
                  </span>
                </p>
              ) : null}

              <Button size="lg" className="mt-7 w-full" onClick={goToMethod}>
                {give.amount.next}
                <ArrowRight className="size-4.5" aria-hidden="true" />
              </Button>
            </>
          ) : null}

          {step === "method" ? (
            <>
              <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">
                {give.method.title}
              </h2>

              <ul className="mt-6 space-y-3">
                {methods.map((entry) => {
                  const Icon = methodIcons[entry.id];
                  const selected = method === entry.id;
                  return (
                    <li key={entry.id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={!entry.available}
                        onClick={() => {
                          setMethod(entry.id);
                          setErrors({});
                        }}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors duration-200",
                          selected
                            ? "border-brand bg-brand-50"
                            : "border-line hover:border-brand/40",
                          !entry.available &&
                            "cursor-not-allowed opacity-55 hover:border-line",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-xl",
                            selected ? "bg-brand text-white" : "bg-canvas text-brand",
                          )}
                        >
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="flex-1">
                          <span className="block font-semibold text-navy">
                            {methodNames[entry.id]}
                          </span>
                          {!entry.available ? (
                            <span className="mt-0.5 block text-xs text-ink-muted">
                              {give.method.soon}
                            </span>
                          ) : null}
                        </span>
                        {selected ? (
                          <Check className="size-5 shrink-0 text-brand" aria-hidden="true" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {errors.method ? <FieldError>{errors.method}</FieldError> : null}

              <p className="mt-5 flex items-start gap-2.5 text-xs leading-relaxed text-ink-muted">
                <Info className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                {give.method.unavailableHint}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep("amount")}
                >
                  <ArrowLeft className="size-4.5" aria-hidden="true" />
                  {give.method.back}
                </Button>
                <Button size="lg" className="flex-1" onClick={goToDetails}>
                  {give.method.next}
                  <ArrowRight className="size-4.5" aria-hidden="true" />
                </Button>
              </div>
            </>
          ) : null}

          {step === "details" ? (
            <form onSubmit={submit} noValidate>
              <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">
                {give.details.title}
              </h2>
              <p className="mt-2 text-sm text-ink-muted">{give.details.lead}</p>

              <div className="mt-7 space-y-6">
                <Field
                  id={ids.name}
                  label={give.details.name}
                  required={give.details.required}
                  error={errors.name}
                >
                  <input
                    id={ids.name}
                    type="text"
                    autoComplete="name"
                    value={donor.name}
                    onChange={(e) => setDonor({ ...donor, name: e.target.value })}
                    aria-invalid={Boolean(errors.name)}
                    className={fieldClass(errors.name)}
                  />
                </Field>

                <Field
                  id={ids.email}
                  label={give.details.email}
                  required={give.details.required}
                  error={errors.email}
                >
                  <input
                    id={ids.email}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={donor.email}
                    onChange={(e) => setDonor({ ...donor, email: e.target.value })}
                    aria-invalid={Boolean(errors.email)}
                    className={fieldClass(errors.email)}
                  />
                </Field>

                <Field
                  id={ids.phone}
                  label={give.details.phone}
                  required={give.details.required}
                  hint={give.details.phoneHint}
                  error={errors.phone}
                >
                  <input
                    id={ids.phone}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={donor.phone}
                    onChange={(e) => setDonor({ ...donor, phone: e.target.value })}
                    aria-invalid={Boolean(errors.phone)}
                    className={fieldClass(errors.phone)}
                  />
                </Field>

                <Field id={ids.message} label={give.details.message}>
                  <textarea
                    id={ids.message}
                    rows={3}
                    value={donor.message}
                    onChange={(e) => setDonor({ ...donor, message: e.target.value })}
                    className={cn(fieldClass(), "resize-y")}
                  />
                </Field>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep("method")}
                >
                  <ArrowLeft className="size-4.5" aria-hidden="true" />
                  {give.details.back}
                </Button>
                <Button type="submit" size="lg" className="flex-1">
                  {give.details.submit}
                  <ArrowRight className="size-4.5" aria-hidden="true" />
                </Button>
              </div>
            </form>
          ) : null}

          {step === "done" ? (
            <PaymentInstructions
              give={give}
              locale={locale}
              reference={reference}
              method={method}
              subject={`${reference} — ${amountLabel}`}
              recapLines={[
                `${give.summary.reference}: ${reference}`,
                `${give.summary.amount}: ${amountLabel}`,
                `${give.summary.frequency}: ${
                  frequency === "once" ? give.amount.once : give.amount.monthly
                }`,
                `${give.summary.method}: ${method ? methodNames[method] : ""}`,
                target
                  ? `${give.summary.child}: ${target.name} (${target.reference})`
                  : "",
                "",
                donor.name,
                donor.email,
                donor.phone,
                donor.message,
              ]}
              settlementLabel={
                chosen?.settlementCurrency === "GNF" && currency !== "GNF"
                  ? formatMoney(toGnf(amount, currency), "GNF", locale)
                  : undefined
              }
            />
          ) : null}
        </div>
      </div>

      {/* Recapitulatif permanent */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-card bg-navy p-6 text-white shadow-soft sm:p-7">
          <h2 className="font-display text-lg font-bold">{give.summary.title}</h2>

          <dl className="mt-6 space-y-4 text-sm">
            {target ? (
              <Row label={give.summary.child}>
                {target.name} · {target.reference}
              </Row>
            ) : null}
            <Row label={give.summary.amount}>
              <span className="tabular-nums">{amountLabel || "—"}</span>
            </Row>
            <Row label={give.summary.frequency}>
              {frequency === "once" ? give.amount.once : give.amount.monthly}
            </Row>
            <Row label={give.summary.method}>
              {method ? methodNames[method] : "—"}
            </Row>
            {reference ? (
              <Row label={give.summary.reference}>
                <span className="font-display font-bold tabular-nums">
                  {reference}
                </span>
              </Row>
            ) : null}
          </dl>

          <p className="mt-7 flex items-start gap-2.5 border-t border-white/15 pt-6 text-xs leading-relaxed text-white/70">
            <Info className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
            {give.notice}
          </p>
        </div>

        <p className="mt-4 text-center text-sm">
          <Link
            href={path(locale, "contact")}
            className="font-semibold text-brand hover:underline"
          >
            {dictionary.common.contactUs}
          </Link>
        </p>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Petits composants de formulaire                                     */
/* ------------------------------------------------------------------ */

function fieldClass(invalid?: string) {
  return cn(
    "mt-2 w-full rounded-xl border bg-white px-4 py-3.5 text-base text-ink focus:outline-none",
    invalid ? "border-red-500 focus:border-red-600" : "border-line focus:border-brand",
  );
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy">
        {label}{" "}
        {required ? (
          <span className="font-normal text-ink-muted">({required})</span>
        ) : null}
      </label>
      {children}
      {hint ? <p className="mt-2 text-xs text-ink-muted">{hint}</p> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
}

function FieldError({ children }: { children: string }) {
  return (
    <p role="alert" className="mt-2 flex items-center gap-2 text-sm text-red-600">
      <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-white/60">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
