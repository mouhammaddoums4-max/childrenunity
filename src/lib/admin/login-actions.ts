"use server";

import { headers } from "next/headers";
import { createLoginLink } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import { delivered, sendEmail } from "@/lib/notifications";
import { siteUrl } from "@/lib/site";

export type LoginState = {
  status: "idle" | "sent" | "error";
  message?: string;
  /** Lien affiché uniquement hors production, faute de service d'envoi. */
  devLink?: string;
};

/**
 * Demande d'un lien de connexion.
 *
 * La réponse est **la même que l'adresse existe ou non** : sans cela, ce
 * formulaire dirait à n'importe qui quelles adresses possèdent un compte
 * dans l'administration.
 */
export async function requestLoginLink(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { status: "error", message: "Indiquez une adresse e-mail valide." };
  }

  if (!hasDatabase) {
    return {
      status: "error",
      message:
        "La base de données n'est pas encore connectée. Ajoutez PostgreSQL au projet, puis réessayez.",
    };
  }

  const link = await createLoginLink(email);

  /* Adresse inconnue : on s'arrête là, mais on répond « envoyé ». */
  if (!link) {
    return { status: "sent" };
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const origin =
    process.env.NODE_ENV === "production"
      ? siteUrl
      : `http://${host ?? "localhost:3000"}`;
  const url = `${origin}/admin/login/verify?token=${link.token}`;

  const sent = delivered(
    await sendEmail({
      to: link.user.email,
      subject: "Votre lien de connexion — Administration CUF",
      text: [
        `Bonjour ${link.user.fullName},`,
        "",
        "Voici votre lien de connexion à l'administration de la fondation.",
        "Il est valable quinze minutes et ne peut servir qu'une seule fois.",
        "",
        url,
        "",
        "Si vous n'avez pas demandé ce lien, ignorez ce message :",
        "aucun accès n'a été ouvert.",
      ].join("\n"),
    }),
  );

  if (sent) return { status: "sent" };

  /* Aucun service d'envoi configuré. En développement, on affiche le lien
     pour pouvoir travailler ; en production, on refuse plutôt que de
     laisser croire qu'un courriel est parti. */
  if (process.env.NODE_ENV !== "production") {
    return { status: "sent", devLink: url };
  }

  console.error("[auth] Service d'envoi non configuré : lien de connexion non transmis.");
  return {
    status: "error",
    message:
      "L'envoi des courriels n'est pas encore configuré. Prévenez l'administrateur du site.",
  };
}
