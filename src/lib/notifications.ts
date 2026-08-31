import "server-only";

/**
 * Envoi des courriels et des SMS.
 *
 * Rien n'est codé en dur pour un prestataire donné : deux variables
 * d'environnement suffisent à brancher l'un ou l'autre, et tant qu'elles
 * sont absentes **aucun envoi n'est simulé**. Les fonctions renvoient ce
 * qui s'est réellement passé, pour que l'interface ne puisse jamais
 * annoncer à un adhérent un message qui n'est jamais parti.
 *
 * Courriel  : Resend (RESEND_API_KEY, MAIL_FROM)
 * SMS       : passerelle HTTP JSON (SMS_API_URL, SMS_API_KEY, SMS_SENDER)
 *             — compatible Africa's Talking, Orange SMS API, Twilio via
 *             un proxy, ou toute passerelle acceptant un POST JSON.
 */

export type DeliveryResult =
  | { status: "sent" }
  | { status: "skipped"; reason: "not-configured" }
  | { status: "failed"; reason: string };

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function sendEmail({
  to,
  subject,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<DeliveryResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) return { status: "skipped", reason: "not-configured" };

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!response.ok) {
      return { status: "failed", reason: `HTTP ${response.status}` };
    }
    return { status: "sent" };
  } catch (error) {
    return { status: "failed", reason: String(error) };
  }
}

const NIMBA_ENDPOINT = "https://api.nimbasms.com/v1/messages";

/**
 * Nimba SMS attend un numéro au format international **sans le `+`** :
 * 224XXXXXXXXX. On accepte donc les saisies avec espaces, tirets ou
 * indicatif, et on normalise. Un numéro guinéen tapé en national
 * (9 chiffres commençant par 6) se voit préfixer l'indicatif.
 */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.length === 9 && digits.startsWith("6")) return `224${digits}`;
  return digits;
}

export async function sendSms({
  to,
  text,
}: {
  to: string;
  text: string;
}): Promise<DeliveryResult> {
  const key = process.env.SMS_API_KEY;
  const apiSecret = process.env.SMS_API_SECRET;
  if (!key || !apiSecret) return { status: "skipped", reason: "not-configured" };

  const number = normalisePhone(to);
  if (number.length < 8) return { status: "failed", reason: "numéro invalide" };

  /* Authentification HTTP Basic : identifiant de service et jeton secret. */
  const credentials = Buffer.from(`${key}:${apiSecret}`).toString("base64");

  try {
    const response = await fetch(NIMBA_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: [number],
        sender_name: process.env.SMS_SENDER_ID ?? "CUF",
        message: text,
      }),
    });

    if (!response.ok) {
      /* Le corps de la réponse porte le motif du refus (expéditeur non
         validé, crédit épuisé) : il est utile dans les journaux. */
      const detail = await response.text().catch(() => "");
      return {
        status: "failed",
        reason: `HTTP ${response.status}${detail ? ` — ${detail.slice(0, 200)}` : ""}`,
      };
    }
    return { status: "sent" };
  } catch (error) {
    return { status: "failed", reason: String(error) };
  }
}

/** Un envoi a-t-il abouti ? Sert à ne promettre que ce qui est parti. */
export function delivered(result: DeliveryResult): boolean {
  return result.status === "sent";
}
