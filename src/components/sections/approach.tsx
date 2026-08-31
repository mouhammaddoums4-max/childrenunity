import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const stepColors = [
  "bg-brand text-white",
  "bg-teal text-white",
  "bg-orange text-white",
  "bg-navy text-white",
];

export function Approach({ dictionary }: { dictionary: Dictionary }) {
  const { approach } = dictionary.home;

  return (
    <section className="section">
      <Container>
        <SectionHeading
          eyebrow={approach.eyebrow}
          title={approach.title}
          lead={approach.lead}
          align="center"
        />

        <ol className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {approach.steps.map((step, index) => (
            <li
              key={step.title}
              className="reveal relative rounded-card border border-line bg-white p-6 sm:p-7"
            >
              <span
                className={`font-display flex size-11 items-center justify-center rounded-xl text-lg font-bold tabular-nums ${stepColors[index]}`}
                aria-hidden="true"
              >
                {index + 1}
              </span>

              <h3 className="font-display mt-5 text-h3 font-bold text-navy">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
