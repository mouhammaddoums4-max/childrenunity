"use client";

import { useId, useMemo, useState } from "react";
import { AlertCircle, Check, Landmark, Send, Smartphone, Wallet } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { formatMoney } from "@/lib/currency";
import { getPlans, type PlanId } from "@/lib/membership";
import {
  createReference,
  getPaymentMethods,
  type PaymentMethodId,
} from "@/lib/payments";
import {
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

type FieldName =
  | "firstName"
  | "lastName"
  | "country"
  | "city"
  | "phone"
  | "email"
  | "profession";

const REQUIRED_FIELDS: FieldName[] = [
  "firstName",
  "lastName",
  "country",
  "city",
  "phone",
  "email",
  "profession",
];

export function MembershipForm({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { membership, give } = dictionary;
  const { form } = membership;

  const plans = useMemo(() => getPlans(locale), [locale]);
  const methods = useMemo(() => getPaymentMethods(), []);

  const ids: Record<FieldName | "motivation", string> = {
    firstName: useId(),
    lastName: useId(),
    country: useId(),
    city: useId(),
    phone: useId(),
    email: useId(),
    profession: useId(),
    motivation: useId(),
  };

  const [plan, setPlan] = useState<PlanId>("full");
  const [method, setMethod] = useState<PaymentMethodId | null>(null);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    country: "",
    city: "",
    phone: "",
    email: "",
    profession: "",
    motivation: "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [reference, setReference] = useState("");

  const chosenPlan = plans.find((entry) => entry.id === plan) ?? plans[0];
  const chosenMethod = methods.find((entry) => entry.id === method);
  /* Les tarifs sont statutaires : ils s'affichent en francs guinéens,
     sans conversion, pour que l'adhérent règle la somme exacte. */
  const amountLabel = formatMoney(chosenPlan.amountGnf, "GNF", locale);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: Partial<Record<string, string>> = {};

    for (const field of REQUIRED_FIELDS) {
      if (values[field].trim().length < 2) found[field] = form.errors[field];
    }
    if (!EMAIL_PATTERN.test(values.email.trim())) found.email = form.errors.email;
    if (!chosenMethod?.available) found.method = form.errors.method;

    setErrors(found);

    const firstInvalid = REQUIRED_FIELDS.find((field) => found[field]);
    if (firstInvalid) {
      document.getElementById(ids[firstInvalid])?.focus();
      return;
    }
    if (found.method) return;

    setReference(createReference("CUF-M"));
  }

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  if (reference) {
    return (
      <div className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-9">
        <PaymentInstructions
          give={give}
          locale={locale}
          reference={reference}
          method={method}
          subject={`${reference} — ${chosenPlan.label}`}
          recapLines={[
            `${give.summary.reference}: ${reference}`,
            `${membership.summaryLabels.plan}: ${chosenPlan.label}`,
            `${give.summary.amount}: ${amountLabel}`,
            `${give.summary.method}: ${method ? methodNames[method] : ""}`,
            "",
            `${membership.summaryLabels.applicant}: ${values.firstName} ${values.lastName}`,
            `${membership.summaryLabels.location}: ${values.city}, ${values.country}`,
            `${membership.summaryLabels.profession}: ${values.profession}`,
            values.email,
            values.phone,
            values.motivation,
          ]}
        />

        <p className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-ink-muted">
          {membership.notice}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-9"
    >
      <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">
        {form.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{form.lead}</p>

      {/* Formule */}
      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-navy">
          {form.planTitle}
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {plans.map((entry) => {
            const selected = plan === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setPlan(entry.id)}
                className={cn(
                  "rounded-2xl border-2 p-5 text-left transition-colors duration-200",
                  selected
                    ? "border-brand bg-brand-50"
                    : "border-line hover:border-brand/40",
                )}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-lg font-bold tabular-nums text-navy">
                    {formatMoney(entry.amountGnf, "GNF", locale)}
                  </span>
                  {entry.recommended ? (
                    <span className="rounded-full bg-teal px-2.5 py-0.5 text-[11px] font-semibold text-white">
                      {form.recommended}
                    </span>
                  ) : null}
                </span>
                <span className="mt-1.5 block text-sm font-semibold text-navy">
                  {entry.label}
                </span>
                <span className="mt-1.5 block text-xs leading-relaxed text-ink-muted">
                  {entry.detail}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Identité et coordonnées */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {(
          [
            ["firstName", "given-name", "text"],
            ["lastName", "family-name", "text"],
            ["country", "country-name", "text"],
            ["city", "address-level2", "text"],
            ["phone", "tel", "tel"],
            ["email", "email", "email"],
          ] as const
        ).map(([field, autoComplete, type]) => (
          <div key={field}>
            <label
              htmlFor={ids[field]}
              className="block text-sm font-semibold text-navy"
            >
              {form[field]}{" "}
              <span className="font-normal text-ink-muted">
                ({form.required})
              </span>
            </label>
            <input
              id={ids[field]}
              type={type}
              autoComplete={autoComplete}
              inputMode={type === "email" ? "email" : type === "tel" ? "tel" : undefined}
              value={values[field]}
              onChange={(event) => update(field, event.target.value)}
              aria-invalid={Boolean(errors[field])}
              className={fieldClass(errors[field])}
            />
            {errors[field] ? <FieldError>{errors[field]!}</FieldError> : null}
          </div>
        ))}

        <div className="sm:col-span-2">
          <label
            htmlFor={ids.profession}
            className="block text-sm font-semibold text-navy"
          >
            {form.profession}{" "}
            <span className="font-normal text-ink-muted">({form.required})</span>
          </label>
          <input
            id={ids.profession}
            type="text"
            autoComplete="organization-title"
            value={values.profession}
            onChange={(event) => update("profession", event.target.value)}
            aria-invalid={Boolean(errors.profession)}
            className={fieldClass(errors.profession)}
          />
          {errors.profession ? (
            <FieldError>{errors.profession}</FieldError>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor={ids.motivation}
            className="block text-sm font-semibold text-navy"
          >
            {form.motivation}
          </label>
          <textarea
            id={ids.motivation}
            rows={3}
            value={values.motivation}
            onChange={(event) => update("motivation", event.target.value)}
            className={cn(fieldClass(), "resize-y")}
          />
        </div>
      </div>

      {/* Règlement */}
      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-navy">
          {form.methodTitle}
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {methods.map((entry) => {
            const Icon = methodIcons[entry.id];
            const selected = method === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={!entry.available}
                onClick={() => {
                  setMethod(entry.id);
                  setErrors((current) => ({ ...current, method: undefined }));
                }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors duration-200",
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
                <span className="flex-1 text-sm font-semibold text-navy">
                  {methodNames[entry.id]}
                  {!entry.available ? (
                    <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                      {give.method.soon}
                    </span>
                  ) : null}
                </span>
                {selected ? (
                  <Check className="size-5 shrink-0 text-brand" aria-hidden="true" />
                ) : null}
              </button>
            );
          })}
        </div>
        {errors.method ? <FieldError>{errors.method}</FieldError> : null}
      </fieldset>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7">
        <p className="text-sm text-ink-muted">
          {give.summary.amount} :{" "}
          <span className="font-display text-lg font-bold tabular-nums text-navy">
            {amountLabel}
          </span>
        </p>
        <Button type="submit" size="lg">
          <Send className="size-4.5" aria-hidden="true" />
          {form.submit}
        </Button>
      </div>
    </form>
  );
}

function fieldClass(invalid?: string) {
  return cn(
    "mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-ink focus:outline-none",
    invalid ? "border-red-500 focus:border-red-600" : "border-line focus:border-brand",
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
