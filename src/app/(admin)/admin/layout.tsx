import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Administration — Children's Unity Foundation",
    template: "%s — Administration CUF",
  },
  /* Une console de gestion n'a rien à faire dans un moteur de recherche. */
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Racine de l'administration.
 *
 * L'espace de gestion a sa propre racine HTML, séparée du site public :
 * il ne charge ni l'en-tête, ni le pied de page, ni le bandeau de
 * consentement, et son interface reste en français quelle que soit la
 * langue choisie par les visiteurs.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-dvh bg-canvas">{children}</body>
    </html>
  );
}
