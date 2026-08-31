import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

/**
 * Aiguillage des requetes.
 *
 * Deux espaces cohabitent dans la meme application :
 *
 * - le **site public**, dont chaque page vit sous /fr ou /en ; une URL sans
 *   prefixe est redirigee vers la langue preferee du navigateur, avec le
 *   francais comme repli ;
 * - l'**administration**, servie sous /admin, sans prefixe de langue et
 *   sans redirection.
 *
 * Le sous-domaine `admin.` mene directement a l'administration : la requete
 * est reecrite vers /admin, sans redirection visible, de sorte que
 * admin.childrensunityfoundation.org affiche la console de gestion tout en
 * restant le meme deploiement — un seul build, une seule base.
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

/**
 * Sous-domaines qui menent a l'administration.
 *
 * `admin.` fonctionne toujours ; `ADMIN_HOSTS` permet d'en declarer
 * d'autres, separes par des virgules — un nom complet
 * (« cuf.childrensunityfoundation.org ») ou un simple prefixe (« cuf »).
 * Le sous-domaine retenu n'a donc pas a etre fige dans le code.
 */
const adminHosts = ["admin", ...(process.env.ADMIN_HOSTS ?? "").split(",")]
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

function isAdminHost(host: string): boolean {
  const name = host.split(":")[0];
  return adminHosts.some(
    (entry) => name === entry || name.startsWith(`${entry}.`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host")?.toLowerCase() ?? "";

  /* Sous-domaine d'administration : tout y mene a /admin. */
  if (isAdminHost(host)) {
    if (pathname.startsWith("/admin")) return NextResponse.next();

    const rewritten = request.nextUrl.clone();
    rewritten.pathname = `/admin${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(rewritten);
  }

  /* L'administration reste joignable en direct, sans prefixe de langue. */
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

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
