import { organisation } from "./content";

/**
 * Moyens de paiement proposés.
 *
 * ─────────────────────────────────────────────────────────────────────
 * À CONFIGURER AVANT LA MISE EN LIGNE
 *
 * Les comptes ci-dessous sont les coordonnées vers lesquelles le donateur
 * envoie son paiement. Renseignez ici les comptes réels de la fondation.
 * Un moyen dont le compte vaut `undefined` est présenté comme « bientôt
 * disponible » et n'affiche aucune instruction : rien n'est inventé.
 *
 * Orange Money reprend pour l'instant le numéro de contact public de la
 * fondation. Vérifiez qu'il s'agit bien du compte qui doit recevoir les
 * dons, et remplacez-le sinon.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Ces moyens fonctionnent en paiement assisté : le donateur transfère
 * lui-même le montant, en indiquant la référence affichée à l'écran, et
 * la fondation rapproche le versement. Le jour où une passerelle est
 * ouverte (Orange Money Web Payment, MTN MoMo, Wave, Stripe, PayPal),
 * elle se branche derrière ce même tunnel.
 */

export type PaymentMethodId =
  | "orange-money"
  | "mtn-momo"
  | "wave"
  | "bank"
  | "card"
  | "paypal";

type Account =
  | { kind: "phone"; value: string; holder: string }
  | { kind: "bank"; holder: string; bank: string; iban: string }
  | { kind: "link"; value: string };

const accounts: Partial<Record<PaymentMethodId, Account>> = {
  "orange-money": {
    kind: "phone",
    value: organisation.phone,
    holder: organisation.name,
  },
  // "mtn-momo": { kind: "phone", value: "+224 …", holder: organisation.name },
  // "wave": { kind: "phone", value: "+224 …", holder: organisation.name },
  // "bank": { kind: "bank", holder: organisation.name, bank: "…", iban: "…" },
  // "card" et "paypal" demandent une passerelle : les laisser vides.
};

export type PaymentMethod = {
  id: PaymentMethodId;
  /** Devises acceptées ; `null` signifie « toutes ». */
  currencies: string[] | null;
  account?: Account;
  available: boolean;
};

const order: { id: PaymentMethodId; currencies: string[] | null }[] = [
  { id: "orange-money", currencies: ["GNF"] },
  { id: "mtn-momo", currencies: ["GNF"] },
  { id: "wave", currencies: ["GNF"] },
  { id: "card", currencies: null },
  { id: "paypal", currencies: null },
  { id: "bank", currencies: null },
];

export function getPaymentMethods(currency: string): PaymentMethod[] {
  return order
    .filter(
      (method) => method.currencies === null || method.currencies.includes(currency),
    )
    .map((method) => {
      const account = accounts[method.id];
      return {
        id: method.id,
        currencies: method.currencies,
        account,
        available: Boolean(account),
      };
    });
}

export function getAccount(id: PaymentMethodId): Account | undefined {
  return accounts[id];
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Référence communiquée au donateur et rappelée dans le transfert : elle
 * permet à la fondation de rapprocher un versement mobile money d'une
 * demande. Générée à la soumission, jamais au rendu, pour ne pas produire
 * un identifiant différent entre le serveur et le navigateur.
 */
export function createReference(prefix = "CUF"): string {
  let code = "";
  const random =
    typeof crypto !== "undefined" && "getRandomValues" in crypto
      ? Array.from(crypto.getRandomValues(new Uint8Array(6)))
      : Array.from({ length: 6 }, () => Math.floor(Math.random() * 256));

  for (const byte of random) code += ALPHABET[byte % ALPHABET.length];
  return `${prefix}-${code}`;
}
