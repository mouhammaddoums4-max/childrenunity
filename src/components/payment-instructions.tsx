"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getAccount, type PaymentMethodId } from "@/lib/payments";
import { organisation } from "@/lib/content";
import { Button, ButtonLink } from "@/components/ui/button";

/** Libellés commerciaux : ce sont des marques, identiques dans les deux langues. */
export const methodNames: Record<PaymentMethodId, string> = {
  "orange-money": "Orange Money",
  "mtn-momo": "MTN Mobile Money",
  wave: "Wave",
  card: "Carte bancaire · Visa / Mastercard",
  paypal: "PayPal",
  bank: "Virement bancaire",
};

export function fill(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
}

/**
 * Écran final commun au don, au parrainage et à l'adhésion : la référence
 * à rappeler, le compte à créditer, et l'envoi du récapitulatif à la
 * fondation. L'appelant fournit les lignes du récapitulatif, car elles
 * diffèrent d'un parcours à l'autre.
 */
export function PaymentInstructions({
  give,
  locale,
  reference,
  method,
  subject,
  recapLines,
  settlementLabel,
}: {
  give: Dictionary["give"];
  locale: Locale;
  reference: string;
  method: PaymentMethodId | null;
  /** Objet du message envoyé à la fondation. */
  subject: string;
  /** Récapitulatif, une ligne par entrée ; les vides sont ignorées. */
  recapLines: string[];
  /** Montant en francs guinéens, quand le transfert se fait en local. */
  settlementLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const resolved = method ? getAccount(method) : undefined;

  const recap = recapLines.filter(Boolean).join("\n");
  const mailto =
    `mailto:${organisation.email}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(recap)}`;

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Presse-papiers refusé : la référence reste lisible à l'écran. */
    }
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">
        {give.done.title}
      </h2>
      <p className="mt-3 leading-relaxed text-ink-muted">{give.done.lead}</p>

      {/* Référence à rappeler dans le transfert */}
      <div className="mt-7 rounded-xl border-2 border-brand bg-brand-50 p-5">
        <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">
          {give.summary.reference}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="font-display text-2xl font-extrabold tabular-nums text-navy">
            {reference}
          </span>
          <Button variant="outline" onClick={copyReference}>
            {copied ? (
              <Check className="size-4" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? give.done.copied : give.done.copy}
          </Button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink">
          {give.done.referenceHint}
        </p>
      </div>

      {/* Compte à créditer */}
      {resolved?.kind === "phone" ? (
        <div className="mt-6 rounded-xl border border-line p-5">
          <p className="text-sm leading-relaxed text-ink-muted">
            {fill(give.done.phoneInstruction, {
              method: method ? methodNames[method] : "",
              holder: resolved.holder,
            })}
          </p>
          <p className="font-display mt-3 text-xl font-bold tabular-nums text-navy">
            {resolved.value}
          </p>
          <p className="mt-1 text-sm text-ink-muted">{resolved.holder}</p>

          {/* Le transfert local se règle en francs guinéens */}
          {settlementLabel ? (
            <p className="mt-4 rounded-xl bg-canvas p-4 text-sm text-ink">
              {give.done.settlement}{" "}
              <span className="font-display font-bold tabular-nums">
                {settlementLabel}
              </span>
            </p>
          ) : null}
        </div>
      ) : null}

      {resolved?.kind === "bank" ? (
        <div className="mt-6 rounded-xl border border-line p-5">
          <p className="text-sm leading-relaxed text-ink-muted">
            {give.done.bankInstruction}
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">{resolved.bank}</dt>
              <dd className="font-semibold tabular-nums text-navy">
                {resolved.iban}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-sm text-ink-muted">{resolved.holder}</p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={mailto} size="lg" className="flex-1">
          {give.done.sendRecap}
        </ButtonLink>
        <ButtonLink href={`/${locale}`} variant="outline" size="lg">
          {give.done.backHome}
        </ButtonLink>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-ink-muted">
        {fill(give.done.sendHint, { email: organisation.email })}
      </p>
    </div>
  );
}
