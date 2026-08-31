import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Poppins } from "next/font/google";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getEvent } from "@/lib/event";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SocialRail } from "@/components/social-rail";
import { CookieNotice } from "@/components/cookie-notice";
import { EventModal } from "@/components/event-modal";
import { LanguageSwitcher } from "@/components/language-switcher";
import { siteUrl } from "@/lib/site";
import { isDraft } from "@/lib/publication";
import "../../globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dictionary = getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: dictionary.meta.home.title,
      template: `%s — ${dictionary.meta.siteName}`,
    },
    description: dictionary.meta.home.description,
    applicationName: dictionary.meta.siteName,
    robots: isDraft
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    icons: { icon: "/logo-mark.png" },
    openGraph: {
      type: "website",
      siteName: dictionary.meta.siteName,
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      title: dictionary.meta.home.title,
      description: dictionary.meta.home.description,
    },
    alternates: {
      languages: { fr: "/fr", en: "/en" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale: Locale = locale;
  const dictionary = getDictionary(typedLocale);
  const foundationEvent = getEvent(typedLocale);

  return (
    <html lang={typedLocale} className={`${poppins.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-brand focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          {dictionary.nav.skipToContent}
        </a>

        <SiteHeader locale={typedLocale} dictionary={dictionary} />

        <SocialRail label={dictionary.footer.social} />

        <main id="main" className="flex-1">
          {children}
        </main>

        <SiteFooter locale={typedLocale} dictionary={dictionary} />

        {/* Deux pastilles flottantes symetriques : langue a droite,
            reseaux sociaux a gauche. */}
        <LanguageSwitcher
          locale={typedLocale}
          label={dictionary.nav.changeLanguage}
        />

        <CookieNotice locale={typedLocale} dictionary={dictionary} />

        {/* Annonce d'evenement : la fenetre s'ouvre sur toutes les pages,
            une fois par session et des que le contenu annonce change. */}
        {foundationEvent ? (
          <EventModal event={foundationEvent} dictionary={dictionary} />
        ) : null}
      </body>
    </html>
  );
}
