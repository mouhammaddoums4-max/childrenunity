import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Valide le segment de langue de l'URL et renvoie une locale typee. */
export async function resolveLocale(
  params: Promise<{ locale: string }>,
): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
