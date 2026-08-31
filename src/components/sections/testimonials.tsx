import { Quote } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getTestimonials } from "@/lib/content";
import { accentClasses } from "@/lib/accents";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function Testimonials({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const testimonials = getTestimonials(locale);
  const { testimonials: copy } = dictionary.home;

  return (
    <section className="bg-brand-50/50 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          align="center"
        />

        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => {
            const accent = accentClasses[testimonial.accent];

            return (
              <li key={testimonial.id}>
                <figure className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-soft">
                  <Quote
                    className={`size-8 ${accent.text}`}
                    aria-hidden="true"
                  />
                  <blockquote className="mt-5 flex-1 text-base leading-relaxed text-ink">
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-line pt-5">
                    <span className="font-display block font-bold text-navy">
                      {testimonial.author}
                    </span>
                    <span className="mt-1 block text-sm text-ink-muted">
                      {testimonial.role}
                    </span>
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
