"use client";

import { useId, useState } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries";
import { organisation } from "@/lib/content";
import { cn } from "@/lib/cn";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * Aucun service d'envoi n'est branche pour l'instant : le formulaire
 * ouvre le logiciel de messagerie du visiteur avec un message pre-rempli,
 * ce qui fonctionne des la mise en ligne et n'egare aucun message.
 *
 * Pour passer a un envoi serveur, remplacer `openMailClient` par un appel
 * a une route d'API (Resend, SMTP, formulaire hebergé...).
 */
function openMailClient(values: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const body = [values.message, "", "---", values.name, values.email].join("\n");
  const href =
    `mailto:${organisation.email}` +
    `?subject=${encodeURIComponent(values.subject)}` +
    `&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}

export function ContactForm({ dictionary }: { dictionary: Dictionary }) {
  const { form } = dictionary.contact;
  const ids = {
    name: useId(),
    email: useId(),
    subject: useId(),
    message: useId(),
  };

  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: form.subjectOptions[0],
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = form.errors.name;
    if (!EMAIL_PATTERN.test(values.email.trim())) next.email = form.errors.email;
    if (values.message.trim().length < 20) next.message = form.errors.message;
    return next;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);

    /* Le premier champ en erreur reprend le focus (WCAG 3.3.1). */
    const firstInvalid = (["name", "email", "message"] as const).find(
      (key) => found[key],
    );
    if (firstInvalid) {
      document.getElementById(ids[firstInvalid])?.focus();
      return;
    }

    openMailClient(values);
    setSent(true);
  }

  function update(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  const fieldClass = (invalid?: string) =>
    cn(
      "mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-ink transition-colors duration-150 placeholder:text-ink-muted/60 focus:outline-none",
      invalid
        ? "border-red-500 focus:border-red-600"
        : "border-line focus:border-brand",
    );

  const labelClass = "block text-sm font-semibold text-navy";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-9"
    >
      <h2 className="font-display text-2xl font-bold text-navy">{form.title}</h2>

      {sent ? (
        <p
          role="status"
          className="mt-6 flex items-start gap-3 rounded-2xl bg-teal-50 p-5 text-sm leading-relaxed text-ink"
        >
          <CheckCircle2
            className="mt-0.5 size-5 shrink-0 text-teal-ink"
            aria-hidden="true"
          />
          {form.success}
        </p>
      ) : null}

      <div className="mt-7 space-y-6">
        <div>
          <label htmlFor={ids.name} className={labelClass}>
            {form.name}{" "}
            <span className="font-normal text-ink-muted">({form.required})</span>
          </label>
          <input
            id={ids.name}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder={form.namePlaceholder}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${ids.name}-error` : undefined}
            className={fieldClass(errors.name)}
          />
          {errors.name ? (
            <FieldError id={`${ids.name}-error`}>{errors.name}</FieldError>
          ) : null}
        </div>

        <div>
          <label htmlFor={ids.email} className={labelClass}>
            {form.email}{" "}
            <span className="font-normal text-ink-muted">({form.required})</span>
          </label>
          <input
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            placeholder={form.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${ids.email}-error` : undefined}
            className={fieldClass(errors.email)}
          />
          {errors.email ? (
            <FieldError id={`${ids.email}-error`}>{errors.email}</FieldError>
          ) : null}
        </div>

        <div>
          <label htmlFor={ids.subject} className={labelClass}>
            {form.subject}
          </label>
          <select
            id={ids.subject}
            name="subject"
            value={values.subject}
            onChange={(event) => update("subject", event.target.value)}
            className={fieldClass()}
          >
            {form.subjectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={ids.message} className={labelClass}>
            {form.message}{" "}
            <span className="font-normal text-ink-muted">({form.required})</span>
          </label>
          <textarea
            id={ids.message}
            name="message"
            rows={6}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            placeholder={form.messagePlaceholder}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${ids.message}-error` : undefined}
            className={cn(fieldClass(errors.message), "resize-y")}
          />
          {errors.message ? (
            <FieldError id={`${ids.message}-error`}>{errors.message}</FieldError>
          ) : null}
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto">
        <Send className="size-4.5" aria-hidden="true" />
        {form.submit}
      </Button>
    </form>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 flex items-center gap-2 text-sm text-red-600"
    >
      <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}
