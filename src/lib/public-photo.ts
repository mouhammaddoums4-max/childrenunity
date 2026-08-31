import { existsSync } from "node:fs";
import path from "node:path";

const EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png", ".avif"];

/**
 * Résout une photo déposée dans `public/`, sans se soucier de son extension.
 *
 * Le contenu déclare par exemple `/team/president`, et il suffit de déposer
 * `president.jpg` ou `president.webp` dans `public/team/` pour que la photo
 * apparaisse. Tant qu'aucun fichier n'existe, la fonction renvoie `undefined`
 * et l'interface affiche un monogramme plutôt qu'une image cassée.
 *
 * Réservé aux composants serveur : la vérification lit le disque au build.
 */
export function resolvePhoto(base?: string): string | undefined {
  if (!base?.startsWith("/")) return undefined;

  const root = path.join(process.cwd(), "public");
  const known = EXTENSIONS.find((extension) => base.endsWith(extension));

  /* Chemin déjà complet : on vérifie simplement qu'il existe. */
  if (known) {
    return existsSync(path.join(root, base)) ? base : undefined;
  }

  for (const extension of EXTENSIONS) {
    const candidate = `${base}${extension}`;
    if (existsSync(path.join(root, candidate))) return candidate;
  }

  return undefined;
}
