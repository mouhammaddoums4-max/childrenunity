import type { Accent } from "./content";

/**
 * Les classes sont écrites en toutes lettres (et non construites par
 * concaténation) pour que Tailwind puisse les détecter à la compilation.
 *
 * `text` utilise systématiquement la variante assombrie de la couleur :
 * le teal et l'orange de la charte ne passent pas le ratio 4.5:1 sur fond
 * clair, contrairement à leurs déclinaisons `-ink`.
 */
export const accentClasses: Record<
  Accent,
  { text: string; bg: string; softBg: string; ring: string; bar: string }
> = {
  brand: {
    text: "text-brand",
    bg: "bg-brand",
    softBg: "bg-brand-50",
    ring: "ring-brand/20",
    bar: "bg-brand",
  },
  teal: {
    text: "text-teal-ink",
    bg: "bg-teal",
    softBg: "bg-teal-50",
    ring: "ring-teal/20",
    bar: "bg-teal",
  },
  orange: {
    text: "text-orange-ink",
    bg: "bg-orange",
    softBg: "bg-orange-50",
    ring: "ring-orange/20",
    bar: "bg-orange",
  },
};
