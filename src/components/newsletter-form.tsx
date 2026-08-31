"use client";

import { useId, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm({ footer }: { footer: Dictionary["footer"] }) {
  const inputId = useId();
  const messageId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      return;
    }

    /* Aucun service d'emailing n'est encore branche : l'inscription est
       validee cote client seulement. Brancher ici l'appel a l'API du
       prestataire (Brevo, Mailchimp, ...) quand il sera choisi. */
    setStatus("done");
    setEmail("");
  }

  if (status === "done") {
    return (
      <p
        className="flex items-start gap-2.5 rounded-2xl bg-white/10 p-4 text-sm text-white"
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
        <Button type="submit" variant="accent" className="shrink-0">
          <Send className="size-4" aria-hidden="true" />
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
