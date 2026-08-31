import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Eye, Heart, Landmark, Scale, ShieldCheck, Sprout, Target } from "lucide-react";
import { path } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getTeam } from "@/lib/content";
import { accentClasses } from "@/lib/accents";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { StatsBand } from "@/components/sections/stats-band";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { meta } = getDictionary(locale);
  return { title: meta.about.title, description: meta.about.description };
}

const valueColors = ["brand", "teal", "orange", "brand"] as const;

const charterIcons = [Landmark, Scale, ShieldCheck, Sprout];

export default async function AboutPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const { about, common } = dictionary;
  const team = getTeam(locale);

  return (
    <>
      <PageHero
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
        lead={about.hero.lead}
      />

      {/* Mission et vision */}
      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-9">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-50 sm:size-14">
                <Target className="size-7 text-brand" aria-hidden="true" />
              </span>
              <h2 className="font-display mt-6 text-2xl font-bold text-navy">
                {about.mission.title}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                {about.mission.body}
              </p>
            </article>

            <article className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-9">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-teal-50 sm:size-14">
                <Eye className="size-7 text-teal-ink" aria-hidden="true" />
              </span>
              <h2 className="font-display mt-6 text-2xl font-bold text-navy">
                {about.vision.title}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                {about.vision.body}
              </p>
            </article>
          </div>
        </Container>
      </section>

      <StatsBand locale={locale} />

      {/* Valeurs */}
      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow={about.values.eyebrow}
            title={about.values.title}
            align="center"
          />

          <ul className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6">
            {about.values.items.map((value, index) => {
              const accent = accentClasses[valueColors[index]];
              return (
                <li
                  key={value.title}
                  className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8"
                >
                  <div className={`h-1.5 w-12 rounded-full ${accent.bar}`} />
                  <h3 className="font-display mt-5 text-xl font-bold text-navy">
                    {value.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink-muted">
                    {value.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Histoire */}
      <section className="bg-brand-50/50 py-14 sm:py-20 lg:py-24">
        <Container className="grid items-center gap-10 sm:gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={about.story.eyebrow}
              title={about.story.title}
              lead={about.story.body}
            />
          </div>
          <Photo
            src="/images/story.webp"
            alt={about.story.imageAlt}
            ratio="aspect-[4/3]"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="shadow-soft"
          />
        </Container>
      </section>

      {/* Statut de l'organisation */}
      <section className="bg-navy py-14 text-white sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow={about.charter.eyebrow}
            title={about.charter.title}
            lead={about.charter.lead}
            align="center"
            tone="light"
          />

          <ul className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {about.charter.items.map((item, index) => {
              const Icon = charterIcons[index];
              return (
                <li
                  key={item.title}
                  className="rounded-3xl bg-white/[0.07] p-6 ring-1 ring-white/10 sm:p-7"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10">
                    <Icon className="size-6 text-teal" aria-hidden="true" />
                  </span>
                  <h3 className="font-display mt-5 text-lg font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">
                    {item.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Equipe */}
      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow={about.team.eyebrow}
            title={about.team.title}
            lead={about.team.lead}
            align="center"
          />

          <ul className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {team.map((member) => {
              const accent = accentClasses[member.accent];
              const initials = member.name
                .split(" ")
                .map((part) => part[0])
                .join("");

              return (
                <li
                  key={member.id}
                  className="rounded-3xl border border-line bg-white p-6 text-center shadow-soft sm:p-7"
                >
                  {/* Portrait s'il existe, monogramme sinon */}
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={160}
                      height={160}
                      className={`mx-auto size-20 rounded-full object-cover object-top ring-2 ${accent.ring}`}
                    />
                  ) : (
                    <span
                      className={`font-display mx-auto flex size-16 items-center justify-center rounded-full text-xl font-bold text-white sm:size-20 sm:text-2xl ${accent.bg}`}
                      aria-hidden="true"
                    >
                      {initials}
                    </span>
                  )}
                  <h3 className="font-display mt-5 text-lg font-bold text-navy">
                    {member.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-muted">{member.role}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Rejoindre */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="rounded-[1.75rem] border border-line bg-white p-7 text-center shadow-soft sm:rounded-[2rem] sm:p-10 lg:p-14">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-orange-50 sm:size-14">
              <Heart className="size-7 text-orange-ink" aria-hidden="true" />
            </span>
            <h2 className="font-display mt-6 text-2xl font-bold text-navy sm:text-3xl">
              {about.join.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink-muted">
              {about.join.body}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-3.5">
              <ButtonLink href={path(locale, "contact")} size="lg">
                {common.contactUs}
                <ArrowRight className="size-4.5" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink
                href={path(locale, "donate")}
                variant="outline"
                size="lg"
              >
                {common.donate}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
