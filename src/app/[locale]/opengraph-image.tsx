import { readFileSync } from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Vignette de partage, générée au build.
 *
 * Le site servait jusqu'ici son logo carré de 915 Ko comme image Open
 * Graph : Facebook, WhatsApp et LinkedIn attendent du 1200 x 630 en
 * paysage et ne recompressent rien, si bien que chaque lien partagé
 * s'affichait lent et mal cadré. Cette image est générée aux bonnes
 * dimensions, dans les couleurs de la charte, et dans la langue de la
 * page partagée.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Children's Unity Foundation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const logo = readFileSync(
  path.join(process.cwd(), "public", "logo-mark.png"),
).toString("base64");

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typed: Locale = isLocale(locale) ? locale : "fr";
  const { meta } = getDictionary(typed);

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
          background: "linear-gradient(135deg, #7718b0 0%, #120a5e 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* `next/image` n'existe pas dans le moteur de rendu des vignettes :
            ImageResponse ne connaît qu'un sous-ensemble de HTML et de CSS. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${logo}`}
          width={148}
          height={124}
          alt=""
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            {meta.siteName}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.78)",
              maxWidth: 860,
            }}
          >
            {meta.tagline}
          </div>
        </div>

        {/* Rappel des trois couleurs du logo */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: 120, height: 10, borderRadius: 5, background: "#00acac" }} />
          <div style={{ width: 120, height: 10, borderRadius: 5, background: "#f86000" }} />
          <div style={{ width: 120, height: 10, borderRadius: 5, background: "#fbb417" }} />
        </div>
      </div>
    ),
    size,
  );
}
