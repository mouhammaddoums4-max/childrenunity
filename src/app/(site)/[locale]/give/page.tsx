import type { Metadata } from "next";
import { getDictionary } from "@/i18n/dictionaries";
import { getChild } from "@/lib/sponsorship";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { GiveFlow, type GiveTarget } from "@/components/give-flow";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { give } = getDictionary(locale);
  return {
    title: give.meta.title,
    description: give.meta.description,
    /* Tunnel transactionnel : sans interet pour les moteurs de recherche. */
    robots: { index: false, follow: true },
  };
}

export default async function GivePage({
  params,
  searchParams,
}: LocaleParams & {
  searchParams: Promise<{ child?: string }>;
}) {
  const locale = await resolveLocale(params);
  const { child: requested } = await searchParams;
  const dictionary = getDictionary(locale);
  const { give } = dictionary;

  /* Le tunnel sert aussi bien un don libre qu'un parrainage : c'est le
     parametre `child` qui bascule d'un cas a l'autre. */
  const child = requested ? getChild(locale, requested) : undefined;
  const target: GiveTarget | undefined = child
    ? {
        reference: child.reference,
        name: child.firstName,
        remainingGnf: Math.max(0, child.goal - child.raised),
      }
    : undefined;

  const title = target
    ? give.hero.sponsorshipTitle.replace("{name}", target.name)
    : give.hero.donationTitle;

  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
          {give.hero.eyebrow}
        </p>
        <h1 className="font-display mt-4 text-3xl leading-tight font-extrabold text-navy sm:text-4xl">
          {title}
        </h1>
        <p className="mt-5 leading-relaxed text-ink-muted">{give.hero.lead}</p>
      </div>

      <div className="mt-10">
        <GiveFlow locale={locale} dictionary={dictionary} target={target} />
      </div>
    </Container>
  );
}
