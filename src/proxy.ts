import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * Toutes les pages vivent sous /fr ou /en. Une URL sans prefixe de langue
 * est redirigee vers la langue preferee du navigateur, avec le francais
 * comme repli.
 */
function preferredLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language");
  if (!header) return defaultLocale;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: quality ? Number(quality) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if ((locales as readonly string[]).includes(base)) return base;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /* On laisse passer les fichiers statiques, les routes d'API, les
     fichiers de reference lus par les moteurs de recherche et le dossier
     .well-known (security.txt).

     Les points sont echappes en `\\.` : dans une chaine JavaScript, `\.`
     se reduit a `.`, qui accepte n'importe quel caractere et rendait le
     filtre plus large que voulu. */
  matcher: [
    "/((?!api|_next/static|_next/image|\\.well-known|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|xml|txt)$).*)",
  ],
};
