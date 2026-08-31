"use client";

import { useActionState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { requestLoginLink, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(requestLoginLink, initialState);

  if (state.status === "sent") {
    return (
      <div role="status">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-teal-50">
          <CheckCircle2 className="size-6 text-teal-ink" aria-hidden="true" />
        </span>
        <h2 className="font-display mt-5 text-lg font-bold text-navy">
          Regardez votre boîte mail
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Si cette adresse correspond à un compte, un lien de connexion vient
          d&apos;y être envoyé. Il est valable quinze minutes.
        </p>

        {/* Aucun service d'envoi en développement : le lien est affiché ici
            plutôt que perdu. Ce bloc n'existe pas en production. */}
        {state.devLink ? (
          <div className="mt-5 rounded-2xl border border-line bg-canvas p-4">
            <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
              Développement — lien direct
            </p>
            <a
              href={state.devLink}
              className="mt-2 block text-sm font-medium break-all text-brand hover:underline"
            >
              {state.devLink}
            </a>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form action={action}>
      <label htmlFor="email" className="block text-sm font-semibold text-navy">
        Adresse e-mail
      </label>
      <div className="relative mt-2">
        <Mail
          className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          placeholder="vous@childrensunityfoundation.org"
          className="w-full rounded-2xl border border-line bg-white py-3.5 pr-4 pl-11 text-base text-ink placeholder:text-ink-muted/60 focus:border-brand focus:outline-none"
        />
      </div>

      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 text-sm text-red-600"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white transition-colors duration-200 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-4.5 animate-spin" aria-hidden="true" />
        ) : null}
        {pending ? "Envoi en cours…" : "Recevoir mon lien de connexion"}
        {!pending ? <ArrowRight className="size-4.5" aria-hidden="true" /> : null}
      </button>
    </form>
  );
}
