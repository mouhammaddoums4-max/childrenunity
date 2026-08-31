import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getChild, getChildReferences } from "@/lib/sponsorship";

/**
 * Vignette de partage d'une fiche de parrainage.
 *
 * Elle porte le prénom, l'âge, le pays et l'avancement de la collecte —
 * exactement ce que la fiche publie déjà. **Aucune photographie n'y
 * figure**, même lorsque l'autorisation du représentant légal a été
 * recueillie pour le site : une vignette de partage est recopiée par les
 * réseaux, mise en cache hors de notre portée et impossible à retirer
 * ensuite. Le retrait sur simple demande, promis dans les mentions
 * légales, ne pourrait pas être tenu.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Children's Unity Foundation";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getChildReferences().map((reference) => ({ locale, reference })),
  );
}

const logo = readFileSync(
  path.join(process.cwd(), "public", "logo-mark.png"),
).toString("base64");

const accentColors = {
  brand: "#a855e8",
  teal: "#00acac",
  orange: "#f86000",
} as const;

export default async function ChildOpengraphImage({
  params,
}: {
  params: Promise<{ locale: string; reference: string }>;
}) {
  const { locale, reference } = await params;
  const typed: Locale = isLocale(locale) ? locale : "fr";
  const { sponsorship, meta } = getDictionary(typed);
  const child = getChild(typed, reference);

  if (!child) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#120a5e",
            color: "#fff",
            fontSize: 48,
            fontFamily: "sans-serif",
          }}
        >
          {meta.siteName}
        </div>
      ),
      size,
    );
  }

  const accent = accentColors[child.accent];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #120a5e 0%, #7718b0 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 20 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/png;base64,${logo}`} width={84} height={70} alt="" />
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.72)" }}>
            {meta.siteName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: accent, letterSpacing: 2 }}>
            {sponsorship.hero.eyebrow.toUpperCase()}
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2,
            }}
          >
            {child.firstName}
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 30,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            {`${child.age} ${sponsorship.card.age} · ${child.country}`}
          </div>
        </div>

        {/* Avancement de la collecte, en clair et en barre */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 26,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <span>{sponsorship.card.funded}</span>
            <span style={{ fontWeight: 700 }}>{`${child.progress} %`}</span>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 16,
              borderRadius: 8,
              background: "rgba(255,255,255,0.18)",
            }}
          >
            <div
              style={{
                width: `${Math.max(2, child.progress)}%`,
                height: "100%",
                borderRadius: 8,
                background: accent,
              }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
