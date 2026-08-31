import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Eye, Heart, Landmark, Scale, ShieldCheck, Sprout, Target } from "lucide-react";
import { path } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getTeam } from "@/lib/content";
import { accentClasses } from "@/lib/accents";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { resolvePhoto } from "@/lib/public-photo";
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
      <section className="section">
        <Container>
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            <article className="rounded-card border border-line bg-white p-6 sm:p-9">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50">
                <Target className="size-7 text-brand" aria-hidden="true" />
              </span>
              <h2 className="font-display mt-5 text-h2 font-bold text-navy">
                {about.mission.title}
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">
                {about.mission.body}
              </p>
            </article>

            <article className="rounded-card border border-line bg-white p-6 sm:p-9">
              <span className="flex size-11 items-center justify-center rounded-xl bg-teal-50">
                <Eye className="size-7 text-teal-ink" aria-hidden="true" />
              </span>
              <h2 className="font-display mt-5 text-h2 font-bold text-navy">
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
      <section className="section">
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
                  className="rounded-card border border-line bg-white p-6 sm:p-8"
                >
                  <div className={`h-1.5 w-12 rounded-full ${accent.bar}`} />
                  <h3 className="font-display mt-5 text-h3 font-bold text-navy">
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
      <section className="bg-brand-50/50 section">
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
                  className="rounded-card bg-white/[0.07] p-6 ring-1 ring-white/10 sm:p-7"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                    <Icon className="size-6 text-teal" aria-hidden="true" />
                  </span>
                  <h3 className="font-display mt-5 text-h3 font-bold">
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
      <section className="section">
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
              /* Photo affichee seulement si le fichier existe reellement */
              const photo = resolvePhoto(member.photo);

              return (
                <li
                  key={member.id}
                  className="rounded-card border border-line bg-white p-6 text-center sm:p-7"
                >
                  {/* Portrait s'il existe, monogramme sinon */}
                  {photo ? (
                    <Image
                      src={photo}
                      alt={member.name}
                      width={160}
                      height={160}
                      className={`mx-auto size-16 rounded-full object-cover object-top ring-2 sm:size-20 ${accent.ring}`}
                    />
                  ) : (
                    <span
                      className={`font-display mx-auto flex size-16 items-center justify-center rounded-full text-xl font-bold text-white sm:size-20 sm:text-2xl ${accent.bg}`}
                      aria-hidden="true"
                    >
                      {initials}
                    </span>
                  )}
                  <h3 className="font-display mt-5 text-h3 font-bold text-navy">
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
          <div className="rounded-panel border border-line bg-white p-7 text-center sm:p-10 lg:p-14">
            <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-orange-50">
              <Heart className="size-7 text-orange-ink" aria-hidden="true" />
            </span>
            <h2 className="font-display mt-6 text-h2 font-bold text-navy">
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
