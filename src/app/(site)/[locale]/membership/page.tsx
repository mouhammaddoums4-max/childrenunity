import type { Metadata } from "next";
import { Award, BookOpen, FileText, Vote } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { formatMoney } from "@/lib/currency";
import { ANNUAL_DUES_GNF, MEMBERSHIP_FEE_GNF } from "@/lib/membership";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { MembershipForm } from "@/components/membership-form";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { membership } = getDictionary(locale);
  return {
    title: membership.meta.title,
    description: membership.meta.description,
  };
}

const benefitIcons = [Vote, Award, BookOpen, FileText];
const benefitStyles = [
  { bg: "bg-brand-50", text: "text-brand" },
  { bg: "bg-teal-50", text: "text-teal-ink" },
  { bg: "bg-orange-50", text: "text-orange-ink" },
  { bg: "bg-brand-50", text: "text-brand" },
];

export default async function MembershipPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const { membership } = dictionary;

  return (
    <>
      <PageHero
        eyebrow={membership.hero.eyebrow}
        title={membership.hero.title}
        lead={membership.hero.lead}
      />

      {/* Ce que l'adhesion apporte */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow={membership.benefits.eyebrow}
            title={membership.benefits.title}
            align="center"
          />

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {membership.benefits.items.map((item, index) => {
              const Icon = benefitIcons[index];
              const style = benefitStyles[index];
              return (
                <li
                  key={item.title}
                  className="rounded-3xl border border-line bg-white p-7 shadow-soft"
                >
                  <span
                    className={`flex size-12 items-center justify-center rounded-2xl ${style.bg}`}
                  >
                    <Icon className={`size-6 ${style.text}`} aria-hidden="true" />
                  </span>
                  <h3 className="font-display mt-5 text-lg font-bold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Tarifs statutaires */}
      <section className="bg-white py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow={membership.fees.eyebrow}
            title={membership.fees.title}
            lead={membership.fees.lead}
          />

          <dl className="mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
            {[
              {
                label: membership.fees.joining,
                note: membership.fees.joiningNote,
                amount: MEMBERSHIP_FEE_GNF,
                accent: "border-brand",
              },
              {
                label: membership.fees.dues,
                note: membership.fees.duesNote,
                amount: ANNUAL_DUES_GNF,
                accent: "border-teal",
              },
            ].map((fee) => (
              <div
                key={fee.label}
                className={`rounded-3xl border-l-4 bg-canvas p-7 ${fee.accent}`}
              >
                <dt className="font-semibold text-navy">{fee.label}</dt>
                <dd className="font-display mt-2 text-3xl font-extrabold tabular-nums text-navy">
                  {formatMoney(fee.amount, "GNF", locale)}
                </dd>
                <dd className="mt-2 text-sm text-ink-muted">{fee.note}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Demande d'adhesion */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <MembershipForm locale={locale} dictionary={dictionary} />
        </Container>
      </section>
    </>
  );
}
