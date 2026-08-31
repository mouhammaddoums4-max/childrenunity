import type { NextConfig } from "next";

/**
 * Politique de sécurité du contenu.
 *
 * `'unsafe-inline'` reste nécessaire pour les scripts : Next.js sérialise
 * l'état des pages dans des balises `<script>` en ligne, et les supprimer
 * demanderait un nonce, donc de rendre chaque page dynamiquement — au prix
 * du pré-rendu statique. Le compromis est tenable ici parce que le site
 * n'affiche aucun contenu écrit par un visiteur : il n'existe pas de point
 * d'entrée par lequel injecter du script. Tout ce qui vient d'un autre
 * domaine reste bloqué, ce qui coupe le vecteur d'attaque réel.
 *
 * `frame-src` n'autorise que YouTube en mode sans cookie, pour les vidéos
 * de présentation des enfants parrainés.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.youtube-nocookie.com",
  "media-src 'self'",
  "manifest-src 'self'",
  /* Aucun plugin, aucune balise <base> détournée, aucun envoi de
     formulaire vers un domaine tiers, aucune mise en cadre du site. */
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  /* Deux ans de HTTPS obligatoire. `preload` n'est volontairement pas
     activé : l'inscription à la liste des navigateurs est difficile à
     défaire, et se décide une fois le domaine définitivement en place. */
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  /* Redondant avec frame-ancestors, mais compris des navigateurs anciens. */
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  /* Ne pas annoncer la version du framework aux robots de reconnaissance. */
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
