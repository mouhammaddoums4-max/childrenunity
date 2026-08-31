import { Container } from "@/components/ui/container";
import { Arcs } from "@/components/ui/arcs";

/**
 * Banniere de tete commune a toutes les pages interieures.
 *
 * Un seul motif d'arcs, tres efface, cale sur le bord droit : il rappelle
 * le logo sans concurrencer le titre. Le filet sous le titre et le petit
 * soleil ont ete retires, ils encombraient la tete de chaque page.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-brand-50/60 to-canvas">
      <Arcs className="pointer-events-none absolute -top-20 -right-16 w-72 opacity-[0.07] sm:-top-28 sm:-right-20 sm:w-[30rem]" />

      <Container className="section-sm relative">
        <div className="max-w-3xl animate-rise">
          <p className="text-eyebrow font-semibold text-brand uppercase">
            {eyebrow}
          </p>
          <h1 className="font-display mt-4 text-h1 font-extrabold text-navy">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lead text-ink-muted">{lead}</p>
        </div>
      </Container>
    </section>
  );
}
