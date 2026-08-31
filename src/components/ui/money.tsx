"use client";

import type { Locale } from "@/i18n/config";
import { formatMoney, fromGnf } from "@/lib/currency";
import { useCurrency } from "@/lib/currency-store";

/**
 * Montant enregistré en francs guinéens, affiché dans la devise du
 * visiteur. Au rendu serveur, c'est toujours le franc guinéen — la devise
 * par défaut — qui sort ; la conversion arrive à l'hydratation.
 */
export function Money({
  gnf,
  locale,
  className,
}: {
  /** Montant en francs guinéens, la devise de référence du site. */
  gnf: number;
  locale: Locale;
  className?: string;
}) {
  const [currency] = useCurrency();

  return (
    <span className={className}>
      {formatMoney(fromGnf(gnf, currency), currency, locale)}
    </span>
  );
}
