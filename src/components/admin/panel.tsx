import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Bloc de contenu du tableau de bord : un titre, un corps, un lien. */
export function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-navy">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-ink-muted">{description}</p>
          ) : null}
        </div>

        {action ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            {action.label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}
