"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CalendarDays, CheckCircle2, MapPin, Send, X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FoundationEvent } from "@/lib/event";
import { organisation } from "@/lib/content";
import { useConsent } from "@/lib/consent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Une annonce par session, et plus rien une fois l'inscription faite. */
const SEEN_KEY = "cuf.event.seen";
const DONE_KEY = "cuf.event.registered";

/* Le temps que la page se pose avant que la fenetre s'ouvre. */
const DELAY_MS = 1400;

/**
 * Aucun service d'inscription n'est branche : le formulaire ouvre le
 * logiciel de messagerie du visiteur avec un message pre-rempli, comme le
 * fait deja le formulaire de contact. Le jour ou une API existe, seule
 * cette fonction change.
 */
function openMailClient(event: FoundationEvent, name: string, email: string) {
  const body = [
    `Inscription : ${event.title}`,
    /* La date n'est pas toujours connue : on reprend alors le statut. */
    [event.date ?? event.soon, event.place].filter(Boolean).join(" — "),
    "",
    "---",
    name,
    email,
  ].join("\n");

  window.location.href =
    `mailto:${organisation.email}` +
    `?subject=${encodeURIComponent(`Inscription — ${event.title}`)}` +
    `&body=${encodeURIComponent(body)}`;
}

export function EventModal({
  event,
  dictionary,
}: {
  event: FoundationEvent;
  dictionary: Dictionary;
}) {
  const copy = dictionary.event;
  const [consent] = useConsent();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({ name: "", email: "" });
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<Element | null>(null);
  const ids = { name: useId(), email: useId(), title: useId(), lead: useId() };

  /* La fenetre attend que le bandeau de consentement soit repondu : deux
     boites empilees a l'arrivee, c'est une porte fermee au visiteur. */
  useEffect(() => {
    if (consent === "unknown") return;

    let seen = false;
    try {
      seen =
        window.sessionStorage.getItem(SEEN_KEY) === event.id ||
        window.localStorage.getItem(DONE_KEY) === event.id;
    } catch {
      /* Stockage indisponible : on annonce, quitte a le refaire. */
    }
    if (seen) return;

    const timer = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [consent, event.id]);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(SEEN_KEY, event.id);
    } catch {
      /* Sans stockage, la fenetre reviendra a la prochaine page. */
    }
    if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus();
  }, [event.id]);

  /* Defilement bloque, focus capture dans la fenetre, Echap pour sortir. */
  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    function onKeyDown(keyEvent: KeyboardEvent) {
      if (keyEvent.key === "Escape") {
        close();
        return;
      }
      if (keyEvent.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (keyEvent.shiftKey && document.activeElement === first) {
        keyEvent.preventDefault();
        last.focus();
      } else if (!keyEvent.shiftKey && document.activeElement === last) {
        keyEvent.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, close]);

  if (!open) return null;

  function onSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (values.name.trim().length < 2) {
      setError(copy.errorName);
      document.getElementById(ids.name)?.focus();
      return;
    }
    if (!EMAIL_PATTERN.test(values.email.trim())) {
      setError(copy.errorEmail);
      document.getElementById(ids.email)?.focus();
      return;
    }

    openMailClient(event, values.name.trim(), values.email.trim());
    setSent(true);
    try {
      window.localStorage.setItem(DONE_KEY, event.id);
    } catch {
      /* Sans stockage, la fenetre pourra revenir : ce n'est pas grave. */
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6">
      {/* Voile : il isole la fenetre et se ferme au clic, comme attendu. */}
      <button
        type="button"
        aria-label={copy.close}
        onClick={close}
        className="animate-fade absolute inset-0 cursor-pointer bg-navy/55 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ids.title}
        aria-describedby={ids.lead}
        className="animate-pop relative max-h-[92dvh] w-full max-w-xl overflow-y-auto overscroll-contain rounded-panel border border-line bg-white shadow-lift"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label={copy.close}
          className="absolute top-3 right-3 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full text-white/80 transition-colors duration-200 ease-soft hover:bg-white/15 hover:text-white"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        {/* Bandeau de tete : le theme du panel, comme sur l'affiche */}
        <div className="bg-gradient-to-br from-brand to-navy px-6 pt-7 pb-6 text-white sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-eyebrow font-semibold text-teal uppercase">
              {event.eyebrow}
            </p>
            {/* La date n'est pas encore arretee : on annonce le statut. */}
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
              {event.date ? (
                <time dateTime={event.date}>{event.date}</time>
              ) : (
                event.soon
              )}
            </p>
          </div>

          <h2
            id={ids.title}
            className="font-display mt-4 text-h2 font-bold uppercase"
          >
            {event.title}
          </h2>

          <p className="mt-3 text-base font-medium text-sun italic">
            {event.tagline}
          </p>

          {event.place ? (
            <p className="mt-4 flex items-center gap-2.5 text-sm text-white/85">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {event.place}
            </p>
          ) : null}
        </div>

        <div className="px-6 py-6 sm:px-8">
          {sent ? (
            <p
              role="status"
              className="flex items-start gap-3 rounded-card bg-teal-50 p-5 text-sm leading-relaxed text-ink"
            >
              <CheckCircle2
                className="mt-0.5 size-5 shrink-0 text-teal-ink"
                aria-hidden="true"
              />
              {copy.success}
            </p>
          ) : (
            <>
              <p id={ids.lead} className="text-sm leading-relaxed text-ink-muted">
                {event.lead}
              </p>

              {/* Au programme */}
              <h3 className="font-display mt-6 text-eyebrow font-semibold text-brand uppercase">
                {event.programmeTitle}
              </h3>
              <ul className="mt-3 grid gap-2">
                {event.programme.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-teal-ink"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-snug text-ink">{item}</span>
                  </li>
                ))}
              </ul>

              <form onSubmit={onSubmit} noValidate className="mt-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <label htmlFor={ids.name} className="sr-only">
                      {copy.name}
                    </label>
                    <input
                      id={ids.name}
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={(changeEvent) => {
                        setValues((v) => ({ ...v, name: changeEvent.target.value }));
                        setError(undefined);
                      }}
                      placeholder={copy.name}
                      aria-invalid={Boolean(error)}
                      className={fieldClass(Boolean(error))}
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor={ids.email} className="sr-only">
                      {copy.email}
                    </label>
                    <input
                      id={ids.email}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(changeEvent) => {
                        setValues((v) => ({ ...v, email: changeEvent.target.value }));
                        setError(undefined);
                      }}
                      placeholder={copy.email}
                      aria-invalid={Boolean(error)}
                      className={fieldClass(Boolean(error))}
                    />
                  </div>
                </div>

                {error ? (
                  <p role="alert" className="mt-2.5 text-sm text-red-600">
                    {error}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <Button type="submit" className="sm:flex-1">
                    <Send className="size-4" aria-hidden="true" />
                    {copy.submit}
                  </Button>
                  <button
                    type="button"
                    onClick={close}
                    className="min-h-11 cursor-pointer rounded-full px-4 text-sm font-medium text-ink-muted transition-colors duration-200 ease-soft hover:text-navy"
                  >
                    {copy.later}
                  </button>
                </div>

                <p className="mt-3.5 text-xs leading-relaxed text-ink-muted">
                  {copy.notice}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function fieldClass(invalid: boolean): string {
  return cn(
    "min-h-11 w-full rounded-full border bg-white px-4 text-base text-ink transition-colors duration-150 placeholder:text-ink-muted/60 focus:outline-none",
    invalid ? "border-red-500" : "border-line focus:border-brand",
  );
}
