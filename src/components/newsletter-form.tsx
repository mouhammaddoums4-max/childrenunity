"use client";

import { useId, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries";
import { organisation } from "@/lib/content";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Point d'entrée du prestataire d'emailing (Brevo, Mailchimp…).
 *
 * Renseignez `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` avec l'URL du formulaire
 * d'inscription fourni par le prestataire, et l'adresse sera envoyée
 * directement chez lui. Tant que la variable est vide, le bouton ouvre le
 * logiciel de messagerie du visiteur avec une demande d'inscription : rien
 * n'est perdu, et rien ne prétend fonctionner sans être branché.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

type Status = "idle" | "sending" | "error" | "done";

export function NewsletterForm({ footer }: { footer: Dictionary["footer"] }) {
  const inputId = useId();
  const messageId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!EMAIL_PATTERN.test(value)) {
      setStatus("error");
      return;
    }

    if (!ENDPOINT) {
      /* Aucun prestataire branché : on passe par la messagerie du visiteur. */
      const subject = encodeURIComponent(footer.newsletterTitle);
      window.location.href = `mailto:${organisation.email}?subject=${subject}&body=${encodeURIComponent(value)}`;
      setStatus("done");
      setEmail("");
      return;
    }

    setStatus("sending");
    try {
      const body = new FormData();
      body.append("email", value);
      await fetch(ENDPOINT, { method: "POST", body, mode: "no-cors" });
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p
        className="mt-5 flex items-start gap-2.5 rounded-2xl bg-white/10 p-4 text-sm text-white"
        role="status"
      >
        <CheckCircle2
          className="mt-0.5 size-5 shrink-0 text-teal"
          aria-hidden="true"
        />
        {footer.newsletterSuccess}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-5">
      <label htmlFor={inputId} className="sr-only">
        {footer.newsletterLabel}
      </label>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder={footer.newsletterPlaceholder}
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? messageId : undefined}
          className="min-h-12 flex-1 rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/50 focus:border-white/50 focus:outline-none"
        />
        <Button
          type="submit"
          variant="accent"
          className="shrink-0"
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {footer.newsletterSubmit}
        </Button>
      </div>

      {status === "error" ? (
        <p id={messageId} role="alert" className="mt-2.5 text-sm text-sun">
          {footer.newsletterError}
        </p>
      ) : null}
    </form>
  );
}
