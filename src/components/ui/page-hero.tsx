import { Container } from "@/components/ui/container";
import { Arcs, Sun } from "@/components/ui/arcs";

/** Banniere de tete commune a toutes les pages interieures. */
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
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-brand-50/70 to-canvas">
      <Arcs
        className="pointer-events-none absolute -top-16 -right-12 w-72 opacity-[0.12] sm:-top-24 sm:-right-16 sm:w-[28rem]"
      />
      <Sun className="pointer-events-none absolute top-12 right-8 hidden size-16 opacity-70 lg:block" />

      <Container className="relative py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl animate-rise">
          <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
            {eyebrow}
          </p>
          <h1 className="font-display mt-4 text-[clamp(1.875rem,5.6vw,3rem)] leading-[1.12] font-extrabold text-navy">
            {title}
          </h1>
          <div className="mt-5 h-1 w-16 rounded-full bg-brand" />
          <p className="mt-5 text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
            {lead}
          </p>
        </div>
      </Container>
    </section>
  );
}
