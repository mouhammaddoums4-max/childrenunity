import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/ui/social-icons";
import { path, type Locale, type RouteKey } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getPrograms, organisation } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/newsletter-form";

type NavKey = Exclude<RouteKey, "donate">;

const navKeys: NavKey[] = ["home", "about", "programs", "impact", "news", "contact"];

const socialLinks = [
  { key: "facebook", href: organisation.social.facebook, Icon: FacebookIcon, label: "Facebook" },
  { key: "instagram", href: organisation.social.instagram, Icon: InstagramIcon, label: "Instagram" },
  { key: "linkedin", href: organisation.social.linkedin, Icon: LinkedinIcon, label: "LinkedIn" },
  { key: "youtube", href: organisation.social.youtube, Icon: YoutubeIcon, label: "YouTube" },
];

export function SiteFooter({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { footer, nav, meta } = dictionary;
  const programs = getPrograms(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-navy text-white">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          {/* Identite + newsletter */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo-mark.png"
                alt=""
                aria-hidden="true"
                width={739}
                height={618}
                className="h-12 w-auto"
              />
              <span className="leading-none">
                <span className="font-display block text-base font-bold">
                  CHILDREN&apos;S UNITY
                </span>
                <span className="mt-1 block text-[10px] font-semibold tracking-[0.32em] text-white/60">
                  FOUNDATION
                </span>
              </span>
            </div>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
              {footer.about}
            </p>

            <h2 className="font-display mt-9 text-lg font-bold">
              {footer.newsletterTitle}
            </h2>
            <p className="mt-2 text-sm text-white/70">{footer.newsletterBody}</p>
            <NewsletterForm footer={footer} />
          </div>

          {/* Navigation */}
          <nav aria-label={footer.navTitle}>
            <h2 className="font-display text-sm font-bold tracking-[0.16em] uppercase text-white/50">
              {footer.navTitle}
            </h2>
            <ul className="mt-5 space-y-3">
              {navKeys.map((key) => (
                <li key={key}>
                  <Link
                    href={path(locale, key)}
                    className="text-sm text-white/80 transition-colors duration-150 hover:text-white"
                  >
                    {nav[key]}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="font-display mt-9 text-sm font-bold tracking-[0.16em] uppercase text-white/50">
              {footer.programsTitle}
            </h2>
            <ul className="mt-5 space-y-3">
              {programs.slice(0, 4).map((program) => (
                <li key={program.slug}>
                  <Link
                    href={`${path(locale, "programs")}#${program.slug}`}
                    className="text-sm text-white/80 transition-colors duration-150 hover:text-white"
                  >
                    {program.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="font-display text-sm font-bold tracking-[0.16em] uppercase text-white/50">
              {footer.contactTitle}
            </h2>

            <ul className="mt-5 space-y-4 text-sm text-white/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
                <span>
                  {organisation.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
                <a
                  href={`mailto:${organisation.email}`}
                  className="transition-colors duration-150 hover:text-white"
                >
                  {organisation.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden="true" />
                <a
                  href={`tel:${organisation.phoneHref}`}
                  className="transition-colors duration-150 hover:text-white"
                >
                  {organisation.phone}
                </a>
              </li>
            </ul>

            <h2 className="font-display mt-9 text-sm font-bold tracking-[0.16em] uppercase text-white/50">
              {footer.social}
            </h2>
            <ul className="mt-5 flex gap-2.5">
              {socialLinks.map(({ key, href, Icon, label }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-brand"
                  >
                    <Icon className="size-4.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/15 pt-8 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {meta.siteName}. {footer.rights}
          </p>
          <p className="text-white/50">{meta.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
