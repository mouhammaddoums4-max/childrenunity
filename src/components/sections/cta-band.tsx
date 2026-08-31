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
    <section className="py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-brand px-8 py-14 text-white sm:px-14 sm:py-16">
          <Arcs
            className="pointer-events-none absolute -top-16 -right-10 w-80 opacity-20"
          />

          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl leading-tight font-bold sm:text-4xl">
              {cta.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
              {cta.body}
            </p>

            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
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
