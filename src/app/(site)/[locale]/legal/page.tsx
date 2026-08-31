import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { organisation } from "@/lib/content";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { legal } = getDictionary(locale);
  return { title: legal.meta.title, description: legal.meta.description };
}

export default async function LegalPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const { legal } = getDictionary(locale);

  /* Les coordonnées viennent de `organisation` : une seule source, déjà
     utilisée par le pied de page et la page contact. */
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: legal.fields.name, value: organisation.name },
    { label: legal.fields.status, value: legal.values.status },
    { label: legal.fields.address, value: organisation.address.join(", ") },
    {
      label: legal.fields.email,
      value: (
        <a
          href={`mailto:${organisation.email}`}
          className="text-brand hover:underline"
        >
          {organisation.email}
        </a>
      ),
    },
    {
      label: legal.fields.phone,
      value: (
        <a
          href={`tel:${organisation.phoneHref}`}
          className="text-brand hover:underline"
        >
          {organisation.phone}
        </a>
      ),
    },
    { label: legal.fields.director, value: legal.values.director },
    { label: legal.fields.registration, value: legal.values.registration },
    { label: legal.fields.host, value: legal.values.host },
  ];

  return (
    <>
      <PageHero
        eyebrow={legal.hero.eyebrow}
        title={legal.hero.title}
        lead={legal.hero.lead}
      />

      <section className="section-sm">
        <Container>
          <div className="max-w-3xl">
            <dl className="divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 p-5 sm:grid-cols-[13rem_1fr] sm:gap-6 sm:p-6"
                >
                  <dt className="text-sm font-semibold text-navy">
                    {row.label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-ink-muted">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <ol className="mt-12 space-y-10">
              {legal.sections.map((section, index) => (
                <li key={section.title}>
                  <h2 className="font-display flex gap-4 text-h3 font-bold text-navy">
                    <span
                      className="font-display shrink-0 text-brand tabular-nums"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </h2>
                  <p className="mt-3 pl-10 leading-relaxed text-ink-muted">
                    {section.body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex items-start gap-4 rounded-card border border-line bg-white p-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                <Mail className="size-5 text-brand" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display font-bold text-navy">
                  {legal.contactTitle}
                </h2>
                <a
                  href={`mailto:${organisation.email}`}
                  className="mt-1 block text-sm text-brand hover:underline"
                >
                  {organisation.email}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
