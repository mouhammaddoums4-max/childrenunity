import type { Metadata } from "next";
import { Clock, HandHeart, Mail, MapPin, Phone } from "lucide-react";
import { path } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { organisation } from "@/lib/content";
import { resolveLocale, type LocaleParams } from "@/lib/locale-param";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { meta } = getDictionary(locale);
  return { title: meta.contact.title, description: meta.contact.description };
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dictionary = getDictionary(locale);
  const { contact, common } = dictionary;

  return (
    <>
      <PageHero
        eyebrow={contact.hero.eyebrow}
        title={contact.hero.title}
        lead={contact.hero.lead}
      />

      <section className="section">
        <Container className="grid gap-8 sm:gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <ContactForm dictionary={dictionary} />

          <div className="space-y-6">
            <div className="rounded-card border border-line bg-white p-6 sm:p-7">
              <h2 className="font-display text-lg font-bold text-navy">
                {contact.details.title}
              </h2>

              <ul className="mt-6 space-y-6 text-sm">
                <li className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                    <MapPin className="size-5 text-brand" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold text-navy">
                      {contact.details.addressLabel}
                    </span>
                    <span className="mt-1 block text-ink-muted">
                      {organisation.address.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  </span>
                </li>

                <li className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                    <Mail className="size-5 text-teal-ink" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold text-navy">
                      {contact.details.emailLabel}
                    </span>
                    <a
                      href={`mailto:${organisation.email}`}
                      className="mt-1 block text-ink-muted hover:text-brand hover:underline"
                    >
                      {organisation.email}
                    </a>
                  </span>
                </li>

                <li className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                    <Phone className="size-5 text-orange-ink" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold text-navy">
                      {contact.details.phoneLabel}
                    </span>
                    <a
                      href={`tel:${organisation.phoneHref}`}
                      className="mt-1 block text-ink-muted hover:text-brand hover:underline"
                    >
                      {organisation.phone}
                    </a>
                  </span>
                </li>

                <li className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                    <Clock className="size-5 text-brand" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold text-navy">
                      {contact.details.hoursLabel}
                    </span>
                    <span className="mt-1 block text-ink-muted">
                      {contact.details.hours}
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-card bg-brand p-6 text-white sm:p-7">
              <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
                <HandHeart className="size-6" aria-hidden="true" />
              </span>
              <h2 className="font-display mt-5 text-h3 font-bold">
                {contact.volunteer.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                {contact.volunteer.body}
              </p>
              <ButtonLink
                href={path(locale, "donate")}
                variant="quiet"
                className="mt-6"
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
