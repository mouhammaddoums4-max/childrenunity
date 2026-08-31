import { NextResponse, type NextRequest } from "next/server";
import { consumeLoginToken } from "@/lib/auth";

/**
 * Ouverture de session depuis le lien recu par courriel.
 *
 * Le jeton passe par l'URL : on le consomme immediatement, puis on
 * redirige, pour qu'il ne reste ni dans la barre d'adresse, ni dans
 * l'historique, ni dans les journaux du navigateur.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const failure = new URL("/admin/login?error=link", request.url);

  if (!token) return NextResponse.redirect(failure);

  const user = await consumeLoginToken(token, {
    userAgent: request.headers.get("user-agent"),
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip"),
  }).catch(() => null);

  if (!user) return NextResponse.redirect(failure);

  return NextResponse.redirect(new URL("/admin", request.url));
}
