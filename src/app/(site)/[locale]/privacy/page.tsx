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
  const { privacy } = getDictionary(locale);
  return { title: privacy.meta.title, description: privacy.meta.description };
}

export default async function PrivacyPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const { privacy } = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={privacy.hero.eyebrow}
        title={privacy.hero.title}
        lead={privacy.hero.lead}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <ol className="space-y-10">
              {privacy.sections.map((section, index) => (
                <li key={section.title}>
                  <h2 className="font-display flex gap-4 text-xl font-bold text-navy">
                    <span
                      className="font-display shrink-0 tabular-nums text-brand"
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

            <div className="mt-14 flex items-start gap-4 rounded-3xl border border-line bg-white p-6 shadow-soft">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50">
                <Mail className="size-5 text-brand" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display font-bold text-navy">
                  {privacy.contactTitle}
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
