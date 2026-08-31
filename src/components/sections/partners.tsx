import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { partners } from "@/lib/content";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

/* Nombre d'emplacements affiches tant qu'aucun partenaire n'est saisi. */
const PLACEHOLDER_SLOTS = 6;

/**
 * Bandeau des partenaires et soutiens.
 *
 * Les logos se declarent dans `partners` (src/lib/content.ts) : tant que
 * la liste est vide, la section montre des emplacements vides pour donner
 * a voir la mise en page sans afficher de partenariat qui n'existe pas.
 */
export function Partners({ dictionary }: { dictionary: Dictionary }) {
  const copy = dictionary.home.partners;
  const empty = partners.length === 0;

  return (
    <section className="border-y border-line bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={copy.lead}
          align="center"
        />

        <ul className="mt-10 grid grid-cols-2 gap-3.5 sm:mt-14 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {empty
            ? Array.from({ length: PLACEHOLDER_SLOTS }, (_, index) => (
                <li key={index}>
                  <div className="flex h-20 items-center justify-center rounded-2xl border-2 border-dashed border-line bg-canvas px-3 sm:h-24">
                    <ImageIcon
                      className="size-6 text-ink-muted/50"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{copy.placeholder}</span>
                  </div>
                </li>
              ))
            : partners.map((partner) => {
                const card = (
                  <div className="flex h-20 items-center justify-center rounded-2xl border border-line bg-white px-4 transition-[border-color,box-shadow] duration-200 group-hover:border-brand/30 group-hover:shadow-soft sm:h-24">
                    {partner.logo ? (
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={200}
                        height={80}
                        className="max-h-10 w-auto object-contain opacity-80 grayscale transition duration-200 group-hover:opacity-100 group-hover:grayscale-0 sm:max-h-12"
                      />
                    ) : (
                      /* Sans fichier de logo, le nom fait office de signature. */
                      <span className="font-display text-center text-sm font-bold text-navy sm:text-base">
                        {partner.name}
                      </span>
                    )}
                  </div>
                );

                return (
                  <li key={partner.id}>
                    {partner.href ? (
                      <a
                        href={partner.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group block"
                      >
                        {card}
                      </a>
                    ) : (
                      <div className="group">{card}</div>
                    )}
                  </li>
                );
              })}
        </ul>

        {empty ? (
          <p className="mt-6 text-center text-sm text-ink-muted">
            {copy.placeholder}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
