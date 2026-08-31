import "server-only";
import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";

/**
 * Jetons d'approbation d'adhésion.
 *
 * Le site n'a pas de base de données. Plutôt que d'en simuler une, le
 * dossier d'adhésion voyage **dans le lien d'approbation lui-même**,
 * signé par une clé que seul le serveur connaît : l'administrateur reçoit
 * le dossier par courriel, clique sur « Approuver », et le serveur vérifie
 * la signature avant d'attribuer le matricule.
 *
 * Ce que cela apporte : aucun stockage à administrer, aucune donnée
 * personnelle conservée sur le serveur, et un lien impossible à forger
 * sans la clé.
 *
 * Ce que cela ne remplace pas : il n'existe pas de registre des membres.
 * Un lien reste utilisable jusqu'à son expiration, et rien n'empêche deux
 * approbations du même dossier. Le jour où la fondation veut une liste de
 * ses membres et un vrai tableau de bord, il faudra une base de données.
 */

export type MembershipApplication = {
  reference: string;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  profession: string;
  email: string;
  phone: string;
  motivation: string;
  plan: string;
  amountGnf: number;
  locale: string;
};

/** Durée de validité d'un lien d'approbation : trente jours. */
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

function secret(): string {
  const value = process.env.MEMBERSHIP_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "MEMBERSHIP_SECRET manquante ou trop courte (32 caractères minimum).",
    );
  }
  return value;
}

/** La clé est-elle configurée ? Sert à dégrader proprement, sans jeter. */
export function canSign(): boolean {
  const value = process.env.MEMBERSHIP_SECRET;
  return Boolean(value && value.length >= 32);
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64url(input: string): Buffer {
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

export function signApplication(application: MembershipApplication): string {
  const payload = base64url(
    JSON.stringify({ ...application, exp: Date.now() + TTL_MS }),
  );
  const signature = base64url(
    createHmac("sha256", secret()).update(payload).digest(),
  );
  return `${payload}.${signature}`;
}

export function verifyApplication(
  token: string,
): MembershipApplication | undefined {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return undefined;

  const expected = createHmac("sha256", secret()).update(payload).digest();
  const received = fromBase64url(signature);
  /* Comparaison à temps constant : une comparaison naïve laisserait
     deviner la signature octet par octet. */
  if (received.length !== expected.length) return undefined;
  if (!timingSafeEqual(received, expected)) return undefined;

  try {
    const data = JSON.parse(fromBase64url(payload).toString("utf8"));
    if (typeof data.exp !== "number" || Date.now() > data.exp) return undefined;
    delete data.exp;
    return data as MembershipApplication;
  } catch {
    return undefined;
  }
}

/**
 * Matricule définitif, attribué à l'approbation.
 *
 * Il n'est pas séquentiel : sans registre, un compteur serait faux dès le
 * premier redémarrage. Le format reste lisible et se prête à un tri par
 * année d'adhésion.
 */
export function issueMemberId(): string {
  const year = new Date().getFullYear();
  const suffix = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `CUF-${year}-${suffix}`;
}

/** Référence de dossier, communiquée dès le dépôt de la demande. */
export function createApplicationReference(): string {
  const year = new Date().getFullYear();
  const suffix = randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase();
  return `ADH-${year}-${suffix}`;
}
