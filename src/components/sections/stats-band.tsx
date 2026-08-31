import type { Locale } from "@/i18n/config";
import { getStats } from "@/lib/content";
import { statIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";

const iconColors = ["text-brand", "text-teal", "text-orange", "text-brand"];

export function StatsBand({ locale }: { locale: Locale }) {
  const stats = getStats(locale);

  return (
    <section className="bg-navy py-14 text-white sm:py-16">
      <Container>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = statIcon(stat.icon);

            return (
              <li
                key={stat.label}
                className="flex items-center gap-4 lg:justify-center"
              >
                <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon
                    className={`size-7 ${iconColors[index % iconColors.length]}`}
                    aria-hidden="true"
                  />
                </span>
                <span>
                  <span className="font-display block text-3xl leading-none font-extrabold tabular-nums">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block text-sm text-white/70">
                    {stat.label}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
