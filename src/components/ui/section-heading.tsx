import { cn } from "@/lib/cn";

/**
 * Titre de section, unique modele pour tout le site.
 *
 * Le sur-titre porte seul l'accent de couleur : le filet decoratif qui
 * suivait chaque titre a ete retire, il revenait une dizaine de fois par
 * page et chargeait la lecture sans rien hierarchiser.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const centered = align === "center";
  const light = tone === "light";

  return (
    <div className={cn("reveal max-w-2xl", centered && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "text-eyebrow font-semibold uppercase",
            light ? "text-teal" : "text-brand",
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={cn(
          "font-display mt-4 text-h2 font-bold",
          light ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>

      {lead ? (
        <p
          className={cn(
            "mt-4 text-lead",
            light ? "text-white/75" : "text-ink-muted",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
