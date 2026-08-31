"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Lecteur YouTube charge a la demande.
 *
 * Tant que le visiteur n'a pas clique, aucune requete ne part vers
 * YouTube : ni iframe, ni miniature (les miniatures sont servies par un
 * domaine Google et suffiraient a signaler la visite). On affiche donc un
 * fond aux couleurs de la charte, et l'iframe n'apparait qu'ensuite.
 */
export function YoutubeEmbed({
  videoId,
  title,
  video,
}: {
  videoId: string;
  title: string;
  video: Dictionary["video"];
}) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="aspect-video overflow-hidden rounded-3xl bg-navy">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-5 rounded-3xl bg-gradient-to-br from-navy to-brand p-8 text-center text-white">
      <div className="max-w-md">
        <h3 className="font-display text-lg font-bold">{video.consentTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/75">
          {video.consentBody}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full bg-white px-6 font-semibold text-navy transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play className="size-4 fill-current" aria-hidden="true" />
          {video.play}
        </button>

        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white/80 hover:text-white"
        >
          {video.openExternally}
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
