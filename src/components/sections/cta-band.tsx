import { ArrowRight, Heart } from "lucide-react";
import { path, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Arcs } from "@/components/ui/arcs";

export function CtaBand({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const { cta } = dictionary.home;
  const { common } = dictionary;

  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[1.75rem] bg-brand px-6 py-10 text-white sm:rounded-[2rem] sm:px-14 sm:py-16">
          <Arcs
            className="pointer-events-none absolute -top-12 -right-8 w-56 opacity-20 sm:-top-16 sm:-right-10 sm:w-80"
          />

          <div className="relative max-w-2xl">
            <h2 className="font-display text-[clamp(1.5rem,4.2vw,2.25rem)] leading-tight font-bold">
              {cta.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85 sm:mt-5 sm:text-lg">
              {cta.body}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-3.5">
              <ButtonLink
                href={path(locale, "donate")}
                variant="accent"
                size="lg"
              >
                <Heart className="size-4.5" aria-hidden="true" />
                {common.donate}
              </ButtonLink>
              <ButtonLink
                href={path(locale, "contact")}
                variant="quiet"
                size="lg"
              >
                {common.volunteer}
                <ArrowRight className="size-4.5" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
