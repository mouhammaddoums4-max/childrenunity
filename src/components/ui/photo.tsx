import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Arcs, Sun } from "@/components/ui/arcs";
import { cn } from "@/lib/cn";

const publicDir = path.join(process.cwd(), "public");

/**
 * Les visuels sont deposes au fur et a mesure dans `public/images/`
 * (voir le README de ce dossier). Tant qu'un fichier manque, on retombe
 * sur le motif d'arcs de la charte plutot que sur un cadre vide : le site
 * reste presentable, et l'ajout d'une photo ne demande aucun code.
 */
function firstExisting(candidates: string[]): string | undefined {
  return candidates.find((src) =>
    fs.existsSync(path.join(publicDir, src.replace(/^\//, ""))),
  );
}

export function Photo({
  src,
  alt,
  ratio = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
  priority = false,
}: {
  /** Chemins essayes dans l'ordre, relatifs a `public/`. */
  src: string | string[];
  alt: string;
  /** Classe Tailwind du rapport d'image, variable selon le point de rupture. */
  ratio?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const candidates = Array.isArray(src) ? src : [src];
  const found = firstExisting(candidates);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-50 to-teal-50 sm:rounded-[2rem]",
        ratio,
        className,
      )}
    >
      {found ? (
        <Image
          src={found}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center p-8 sm:p-10"
        >
          <Sun className="absolute top-6 right-6 size-10 opacity-80 sm:size-14" />
          <Arcs className="w-full max-w-xs sm:max-w-sm" />
        </div>
      )}
    </div>
  );
}
