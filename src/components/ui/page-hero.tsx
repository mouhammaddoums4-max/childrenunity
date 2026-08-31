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
        className="pointer-events-none absolute -top-24 -right-16 w-[28rem] opacity-[0.12]"
      />
      <Sun className="pointer-events-none absolute top-12 right-8 hidden size-16 opacity-70 lg:block" />

      <Container className="relative py-16 sm:py-20">
        <div className="max-w-3xl animate-rise">
          <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
            {eyebrow}
          </p>
          <h1 className="font-display mt-4 text-4xl leading-[1.1] font-extrabold text-navy sm:text-5xl">
            {title}
          </h1>
          <div className="mt-5 h-1 w-16 rounded-full bg-brand" />
          <p className="mt-6 text-base leading-relaxed text-ink-muted sm:text-lg">
            {lead}
          </p>
        </div>
      </Container>
    </section>
  );
}
