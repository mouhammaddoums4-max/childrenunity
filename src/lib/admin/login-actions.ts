"use server";

import { headers } from "next/headers";
import { createLoginLink } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
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

  const sent = await sendByEmail(link.user.email, link.user.fullName, url);

  if (sent) return { status: "sent" };

  /* Aucun service d'envoi configuré. En développement, on affiche le lien
     pour pouvoir travailler ; en production, on refuse plutôt que de
     laisser croire qu'un courriel est parti. */
  if (process.env.NODE_ENV !== "production") {
    return { status: "sent", devLink: url };
  }

  console.error("[auth] BREVO_API_KEY absente : lien de connexion non envoyé.");
  return {
    status: "error",
    message:
      "L'envoi des courriels n'est pas encore configuré. Prévenez l'administrateur du site.",
  };
}

/** Envoi via Brevo. Renvoie `false` si le service n'est pas configuré. */
async function sendByEmail(
  to: string,
  name: string,
  url: string,
): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return false;

  const sender = {
    name: "Children's Unity Foundation",
    email: process.env.BREVO_SENDER ?? "contact@childrensunityfoundation.org",
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender,
        to: [{ email: to, name }],
        subject: "Votre lien de connexion — Administration CUF",
        htmlContent: `
          <p>Bonjour ${name},</p>
          <p>Voici votre lien de connexion à l'administration de la fondation.
             Il est valable quinze minutes et ne peut servir qu'une fois.</p>
          <p><a href="${url}">Se connecter</a></p>
          <p>Si vous n'avez pas demandé ce lien, ignorez ce message :
             aucun accès n'a été ouvert.</p>
        `,
      }),
    });

    if (!response.ok) {
      console.error("[auth] Brevo a refusé l'envoi :", response.status);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[auth] Envoi du lien impossible :", error);
    return false;
  }
}
