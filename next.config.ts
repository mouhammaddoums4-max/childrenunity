import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

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
 * Les styles, eux, sont resserrés en production : la compilation ne produit
 * aucune balise `<style>` en ligne (vérifié sur la sortie du build), seuls
 * les attributs `style` posés par React subsistent — d'où la séparation
 * entre `style-src` et `style-src-attr`. En développement, le rechargement
 * à chaud injecte des styles en ligne : la règle y reste souple.
 *
 * `frame-src` n'autorise que YouTube en mode sans cookie, pour les vidéos
 * de présentation des enfants parrainés. Aucune miniature n'est chargée
 * avant le clic, donc aucun domaine d'images tiers n'est autorisé.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  isProduction ? "style-src 'self'" : "style-src 'self' 'unsafe-inline'",
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.youtube-nocookie.com",
  "media-src 'self'",
  "manifest-src 'self'",
  /* Le site n'emploie ni service worker ni worker dédié. */
  "worker-src 'none'",
  /* Aucun plugin, aucune balise <base> détournée, aucun envoi de
     formulaire vers un domaine tiers, aucune mise en cadre du site. */
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

/**
 * Capteurs et interfaces matérielles refusés par défaut, y compris aux
 * cadres embarqués. Seul le plein écran est concédé, et uniquement au
 * lecteur YouTube sans cookie : sans cette exception, `allowFullScreen`
 * sur l'iframe resterait sans effet.
 */
const permissionsPolicy = [
  'fullscreen=(self "https://www.youtube-nocookie.com")',
  "accelerometer=()",
  "autoplay=(self)",
  "browsing-topics=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=(self)",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "usb=()",
  "xr-spatial-tracking=()",
].join(", ");

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
  { key: "Permissions-Policy", value: permissionsPolicy },
  /* Ni Flash ni Acrobat ne doivent lire une politique inter-domaines ici. */
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  /* Le site obtient son propre cluster d'agents : une page d'un autre
     sous-domaine ne peut plus tenter de partager sa mémoire avec lui. */
  { key: "Origin-Agent-Cluster", value: "?1" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  /* Ne pas annoncer la version du framework aux robots de reconnaissance. */
  poweredByHeader: false,

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      /* Le fichier de contact sécurité doit rester lisible par tous les
         outils de veille, y compris depuis un autre domaine. */
      {
        source: "/.well-known/security.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
