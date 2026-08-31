import { TriangleAlert } from "lucide-react";
import { isDraft } from "@/lib/publication";

/**
 * Bandeau de démonstration.
 *
 * Tant que les contenus d'exemple sont en place, personne ne doit pouvoir
 * prendre ce site pour la communication officielle de la fondation. Le
 * bandeau le dit, et `robots` interdit l'indexation en parallèle.
 *
 * Il disparaît quand `NEXT_PUBLIC_SITE_STATUS=live` et que
 * `contentReviewed` est passé à `true` dans `src/lib/publication.ts`.
 */
export function DraftBanner({ label }: { label: string }) {
  if (!isDraft) return null;

  return (
    <p className="flex items-center justify-center gap-2.5 bg-sun px-4 py-2 text-center text-[0.8125rem] leading-snug font-semibold text-navy">
      <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
      {label}
    </p>
  );
}
