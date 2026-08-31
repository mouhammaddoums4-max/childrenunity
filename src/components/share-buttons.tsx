"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import {
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
  XIcon,
} from "@/components/ui/social-icons";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Partage d'une fiche sur les réseaux.
 *
 * Aucun script de réseau social n'est chargé : ce sont de simples liens
 * de partage, donc rien ne piste le visiteur avant qu'il clique. Sur
 * mobile, le partage natif du système est proposé en premier — il donne
 * accès à toutes les applications installées, pas seulement aux quatre
 * réseaux listés ici.
 */
export function ShareButtons({
  url,
  text,
  copy,
}: {
  /** URL absolue de la fiche. */
  url: string;
  /** Phrase pré-remplie, reprise par les réseaux qui l'acceptent. */
  text: string;
  copy: Dictionary["share"];
}) {
  const [copied, setCopied] = useState(false);
  const [nativeShared, setNativeShared] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  const networks = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      Icon: WhatsappIcon,
      href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    },
    {
      key: "facebook",
      label: "Facebook",
      Icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: "x",
      label: "X",
      Icon: XIcon,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      Icon: LinkedinIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* Presse-papiers refusé : les liens ci-dessus restent utilisables. */
    }
  }

  async function shareNatively() {
    if (!navigator.share) return;
    try {
      await navigator.share({ title: text, text, url });
      setNativeShared(true);
    } catch {
      /* Partage annulé par le visiteur : rien à signaler. */
    }
  }

  return (
    <section aria-labelledby="share-title" className="mt-10 border-t border-line pt-8">
      <h2 id="share-title" className="font-display text-h3 font-bold text-navy">
        {copy.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{copy.lead}</p>

      <ul className="mt-5 flex flex-wrap gap-2.5">
        {networks.map(({ key, label, Icon, href }) => (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${copy.on} ${label}`}
              title={label}
              className="flex size-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-200 ease-soft hover:border-brand/30 hover:bg-brand-50 hover:text-brand"
            >
              <Icon className="size-4.5" aria-hidden="true" />
            </a>
          </li>
        ))}

        <li>
          <button
            type="button"
            onClick={copyLink}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium text-navy transition-colors duration-200 ease-soft hover:border-brand/30 hover:bg-brand-50"
          >
            {copied ? (
              <Check className="size-4 text-teal-ink" aria-hidden="true" />
            ) : (
              <Link2 className="size-4" aria-hidden="true" />
            )}
            {copied ? copy.copied : copy.copyLink}
          </button>
        </li>

        {/* Partage natif : proposé seulement là où le système le fournit. */}
        {typeof navigator !== "undefined" && "share" in navigator ? (
          <li>
            <button
              type="button"
              onClick={shareNatively}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors duration-200 ease-soft hover:bg-brand-600"
            >
              <Share2 className="size-4" aria-hidden="true" />
              {nativeShared ? copy.shared : copy.more}
            </button>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
