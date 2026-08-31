import { NextResponse, type NextRequest } from "next/server";
import { organisation } from "@/lib/content";
import { issueMemberId, verifyApplication } from "@/lib/membership-token";
import {
  sendEmail,
  sendSms,
  type DeliveryResult,
} from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Échappement des valeurs venues du dossier.
 *
 * Le nom, la ville ou l'adresse sont saisis par le demandeur. Sans cet
 * échappement, un nom contenant une balise `<script>` s'exécuterait dans
 * le navigateur de l'administrateur au moment d'approuver — la politique
 * de sécurité du site autorisant le script en ligne, elle ne l'arrêterait
 * pas.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function page(title: string, body: string, ok: boolean): NextResponse {
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title}</title>
<style>
  :root { color-scheme: light }
  body { margin:0; min-height:100dvh; display:grid; place-items:center;
         background:#faf8fd; color:#171334;
         font-family: ui-sans-serif, system-ui, sans-serif; padding:1.5rem }
  main { max-width:34rem; background:#fff; border:1px solid #e9e4f2;
         border-radius:1.25rem; padding:2rem }
  h1 { margin:0 0 .75rem; font-size:1.35rem; color:${ok ? "#120a5e" : "#c04a00"} }
  p { margin:.5rem 0; line-height:1.6; color:#56516f }
  code { background:#f5ebfc; color:#58117f; padding:.15rem .4rem;
         border-radius:.35rem; font-size:.95em }
</style>
</head>
<body><main><h1>${title}</h1>${body}</main></body>
</html>`;

  return new NextResponse(html, {
    status: ok ? 200 : 400,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Approbation d'une adhésion.
 *
 * L'administration reçoit le dossier par courriel avec un lien signé ;
 * l'ouvrir vaut approbation. Le serveur vérifie la signature, attribue le
 * matricule et prévient l'adhérent par courriel et par SMS.
 *
 * La page renvoyée n'est jamais indexable et ne conserve rien : elle
 * confirme simplement ce qui vient d'être envoyé.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return page("Lien incomplet", "<p>Ce lien ne porte aucun jeton.</p>", false);
  }

  let application;
  try {
    application = verifyApplication(token);
  } catch {
    return page(
      "Configuration incomplète",
      "<p>La clé <code>MEMBERSHIP_SECRET</code> n'est pas définie sur le serveur : impossible de vérifier ce lien.</p>",
      false,
    );
  }

  if (!application) {
    return page(
      "Lien invalide ou expiré",
      "<p>Ce lien d'approbation n'est pas valide, ou il a dépassé ses trente jours de validité. Demandez à l'adhérent de renouveler sa demande.</p>",
      false,
    );
  }

  const memberId = issueMemberId();
  /* Le montant est rappele dans le courriel : c'est a ce moment que
     l'adherent doit regler, en especes. */
  const dues = new Intl.NumberFormat(application.locale === "en" ? "en-GB" : "fr-FR", {
    style: "currency",
    currency: "GNF",
    maximumFractionDigits: 0,
  }).format(application.amountGnf);
  const fullName = `${application.firstName} ${application.lastName}`;
  const french = application.locale !== "en";

  const body = french
    ? [
        `Bonjour ${application.firstName},`,
        "",
        `Votre adhésion à ${organisation.name} est approuvée.`,
        "",
        `Matricule de membre : ${memberId}`,
        `Référence du dossier : ${application.reference}`,
        `Nom : ${fullName}`,
        `Pays : ${application.country}`,
        "",
        "Conservez ce matricule : il vous identifie auprès de la fondation, à l'assemblée générale et pour le renouvellement de votre cotisation.",
        "",
        `Cotisation annuelle à régler : ${dues}, en espèces auprès de la fondation. Aucun paiement ne se fait en ligne.`,
        "",
        `Pour toute question : ${organisation.email}`,
      ].join("\n")
    : [
        `Hello ${application.firstName},`,
        "",
        `Your membership of ${organisation.name} has been approved.`,
        "",
        `Member number: ${memberId}`,
        `Application reference: ${application.reference}`,
        `Name: ${fullName}`,
        `Country: ${application.country}`,
        "",
        "Keep this number: it identifies you to the foundation, at the general assembly and when renewing your dues.",
        "",
        `Annual dues to pay: ${dues}, in cash at the foundation. No payment is made online.`,
        "",
        `Any questions: ${organisation.email}`,
      ].join("\n");

  const sms = french
    ? `${organisation.shortName} : adhésion approuvée. Votre matricule est ${memberId}. Conservez-le.`
    : `${organisation.shortName}: membership approved. Your member number is ${memberId}. Keep it safe.`;

  const [mail, text] = await Promise.all([
    sendEmail({
      to: application.email,
      subject: french
        ? `Adhésion approuvée — matricule ${memberId}`
        : `Membership approved — member number ${memberId}`,
      text: body,
    }),
    sendSms({ to: application.phone, text: sms }),
  ]);

  /** « envoyé », ou le motif exact du non-envoi. */
  function outcome(result: DeliveryResult): string {
    if (result.status === "sent") return "envoyé";
    if (result.status === "skipped") return "non envoyé (service non configuré)";
    return `non envoyé (${result.reason})`;
  }

  const lines = [
    `<p>Matricule attribué : <code>${escapeHtml(memberId)}</code></p>`,
    `<p>Adhérent : ${escapeHtml(fullName)} — ${escapeHtml(application.email)}</p>`,
    `<p>Courriel : ${escapeHtml(outcome(mail))}</p>`,
    `<p>SMS : ${escapeHtml(outcome(text))}</p>`,
  ];

  if (mail.status !== "sent" && text.status !== "sent") {
    lines.push(
      "<p><strong>Aucune notification n'est partie : communiquez le matricule à l'adhérent par un autre moyen.</strong></p>",
    );
  }

  return page("Adhésion approuvée", lines.join(""), true);
}
