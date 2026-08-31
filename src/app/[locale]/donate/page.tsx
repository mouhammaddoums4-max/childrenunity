import type { Metadata } from "next";
import { Building2, Gift, HandHeart, ShieldCheck } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { DonationWidget } from "@/components/donation-widget";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { meta } = getDictionary(locale);
  return { title: meta.donate.title, description: meta.donate.description };
}

const otherIcons = [HandHeart, Building2, Gift];
const otherStyles = [
  { bg: "bg-brand-50", text: "text-brand" },
  { bg: "bg-teal-50", text: "text-teal-ink" },
  { bg: "bg-orange-50", text: "text-orange-ink" },
];

export default async function DonatePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const { donate } = dictionary;

  return (
    <>
      <PageHero
        eyebrow={donate.hero.eyebrow}
        title={donate.hero.title}
        lead={donate.hero.lead}
      />

      <section className="section">
        <Container className="grid gap-8 sm:gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <DonationWidget locale={locale} dictionary={dictionary} />

          <div className="rounded-card bg-navy p-6 text-white sm:p-8 lg:p-10">
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/10">
              <ShieldCheck className="size-7 text-teal" aria-hidden="true" />
            </span>
            <h2 className="font-display mt-5 text-h2 font-bold">
              {donate.transparency.title}
            </h2>
            <p className="mt-4 leading-relaxed text-white/80">
              {donate.transparency.body}
            </p>

            <ul className="mt-8 space-y-5 border-t border-white/15 pt-8">
              {dictionary.impact.allocation.items.map((item) => (
                <li key={item.label}>
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-white/80">{item.label}</span>
                    <span className="font-display font-bold tabular-nums">
                      {item.value} %
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="reveal-bar h-full rounded-full bg-teal"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-white section">
        <Container>
          <SectionHeading
            eyebrow={donate.other.eyebrow}
            title={donate.other.title}
            align="center"
          />

          <ul className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {donate.other.items.map((item, index) => {
              const Icon = otherIcons[index];
              const style = otherStyles[index];

              return (
                <li
                  key={item.title}
                  className="rounded-card border border-line bg-canvas p-6 sm:p-8"
                >
                  <span
                    className={`flex size-11 items-center justify-center rounded-xl ${style.bg}`}
                  >
                    <Icon className={`size-7 ${style.text}`} aria-hidden="true" />
                  </span>
                  <h3 className="font-display mt-5 text-h3 font-bold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
    </>
  );
}
