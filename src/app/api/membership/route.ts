import { NextResponse, type NextRequest } from "next/server";
import { organisation } from "@/lib/content";
import { ANNUAL_DUES_GNF, MEMBERSHIP_FEE_GNF } from "@/lib/membership";
import {
  canSign,
  createApplicationReference,
  signApplication,
  type MembershipApplication,
} from "@/lib/membership-token";
import { delivered, sendEmail, sendSms } from "@/lib/notifications";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
/* La demande n'est jamais mise en cache : chaque envoi est unique. */
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/* Indicatif optionnel, 8 à 15 chiffres, espaces et séparateurs tolérés. */
const PHONE_PATTERN = /^\+?[\d\s().-]{8,20}$/;

const FIELDS = [
  "firstName",
  "lastName",
  "country",
  "city",
  "profession",
  "email",
  "phone",
] as const;

/* ------------------------------------------------------------------ */
/* Limitation de débit                                                 */
/* ------------------------------------------------------------------ */
/*
 * Compteur en mémoire : il retient une adresse pendant une heure. Il
 * suffit à écarter un envoi automatisé depuis une seule machine, et il
 * se vide à chaque redémarrage — ce n'est pas une protection contre une
 * attaque distribuée, qui demanderait un magasin partagé.
 */
const MAX_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  /* Purge opportuniste : la table ne grandit pas indéfiniment. */
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_HOUR;
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "inconnu";
}

/** Coupe et nettoie une valeur reçue : rien de long ni de multiligne. */
function clean(value: unknown, max = 200): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: "rate-limited" },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const values = Object.fromEntries(
    FIELDS.map((field) => [field, clean(body[field])]),
  ) as Record<(typeof FIELDS)[number], string>;
  const motivation = clean(body.motivation, 1000);
  const locale = body.locale === "en" ? "en" : "fr";

  const invalid = FIELDS.filter((field) => values[field].length < 2);
  if (!EMAIL_PATTERN.test(values.email)) invalid.push("email");
  if (!PHONE_PATTERN.test(values.phone)) invalid.push("phone");
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: "invalid-fields", fields: [...new Set(invalid)] },
      { status: 422 },
    );
  }

  const application: MembershipApplication = {
    ...values,
    motivation,
    locale,
    reference: createApplicationReference(),
    plan: MEMBERSHIP_FEE_GNF > 0 ? "full" : "annual",
    amountGnf: MEMBERSHIP_FEE_GNF + ANNUAL_DUES_GNF,
  };

  const fee = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "GNF",
    maximumFractionDigits: 0,
  }).format(application.amountGnf);

  const fullName = `${application.firstName} ${application.lastName}`;

  /* Courriel à l'administration : c'est lui qui porte le dossier, faute
     de registre, et le lien signé qui permet de l'approuver. */
  const approvalLink = canSign()
    ? `${siteUrl}/api/membership/approve?token=${encodeURIComponent(
        signApplication(application),
      )}`
    : undefined;

  const adminBody = [
    `Nouvelle demande d'adhésion — ${application.reference}`,
    "",
    `Nom            : ${fullName}`,
    `Pays / ville   : ${application.country}, ${application.city}`,
    `Profession     : ${application.profession}`,
    `Courriel       : ${application.email}`,
    `Téléphone      : ${application.phone}`,
    `Cotisation     : ${fee}`,
    "",
    "Motivation :",
    application.motivation || "(non renseignée)",
    "",
    approvalLink
      ? `APPROUVER CETTE ADHÉSION :\n${approvalLink}\n\nCe lien attribue le matricule et prévient l'adhérent par courriel et par SMS. Il est valable trente jours.`
      : "MEMBERSHIP_SECRET n'est pas configurée : le lien d'approbation n'a pas pu être généré.",
  ].join("\n");

  const applicantBody =
    locale === "fr"
      ? [
          `Bonjour ${application.firstName},`,
          "",
          `Votre demande d'adhésion à ${organisation.name} est bien enregistrée sous la référence ${application.reference}.`,
          "",
          `Cotisation annuelle : ${fee}.`,
          "",
          "Votre dossier est en attente d'approbation par l'administration. Dès qu'il sera validé, vous recevrez votre matricule de membre par courriel et par SMS.",
          "",
          "La cotisation ne se règle pas en ligne : elle se paie en espèces auprès de la fondation, une fois votre adhésion approuvée.",
          "",
          `Pour toute question : ${organisation.email}`,
        ].join("\n")
      : [
          `Hello ${application.firstName},`,
          "",
          `Your application to join ${organisation.name} has been recorded under reference ${application.reference}.`,
          "",
          `Annual dues: ${fee}.`,
          "",
          "Your file is awaiting approval by the administration. As soon as it is approved you will receive your membership number by email and SMS.",
          "",
          "The dues are not paid online: they are paid in cash at the foundation, once your membership is approved.",
          "",
          `Any questions: ${organisation.email}`,
        ].join("\n");

  const applicantSms =
    locale === "fr"
      ? `${organisation.shortName} : demande d'adhésion ${application.reference} enregistrée. Vous recevrez votre matricule après approbation.`
      : `${organisation.shortName}: membership application ${application.reference} recorded. You will receive your member number once approved.`;

  const [adminMail, applicantMail, applicantText] = await Promise.all([
    sendEmail({
      to: process.env.MEMBERSHIP_NOTIFY_EMAIL ?? organisation.email,
      subject: `Adhésion ${application.reference} — ${fullName}`,
      text: adminBody,
      replyTo: application.email,
    }),
    sendEmail({
      to: application.email,
      subject:
        locale === "fr"
          ? `Votre demande d'adhésion ${application.reference}`
          : `Your membership application ${application.reference}`,
      text: applicantBody,
    }),
    sendSms({ to: application.phone, text: applicantSms }),
  ]);

  /* On rapporte ce qui est réellement parti : l'interface s'en sert pour
     ne pas annoncer un courriel ou un SMS qui n'a jamais été envoyé. */
  return NextResponse.json({
    reference: application.reference,
    amountGnf: application.amountGnf,
    notified: {
      admin: delivered(adminMail),
      email: delivered(applicantMail),
      sms: delivered(applicantText),
    },
  });
}
