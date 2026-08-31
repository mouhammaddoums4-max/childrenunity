import { cn } from "@/lib/cn";

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
    <div
      className={cn(
        "max-w-2xl",
        centered && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.18em]",
            light ? "text-white/70" : "text-brand",
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={cn(
          "mt-3 text-3xl leading-tight font-bold sm:text-4xl",
          light ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>

      {/* Petit trait de rappel de la charte, sous le titre */}
      <div
        className={cn(
          "mt-4 h-1 w-14 rounded-full",
          centered && "mx-auto",
          light ? "bg-white/50" : "bg-brand",
        )}
      />

      {lead ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            light ? "text-white/80" : "text-ink-muted",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
