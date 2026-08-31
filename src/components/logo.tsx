import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

export function Logo({
  locale,
  className,
  withText = true,
  tone = "dark",
}: {
  locale: Locale;
  className?: string;
  withText?: boolean;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";

  return (
    <Link
      href={`/${locale}`}
      className={cn("group flex items-center gap-3", className)}
      aria-label="Children's Unity Foundation"
    >
      <Image
        src="/logo-mark.png"
        alt=""
        aria-hidden="true"
        width={739}
        height={618}
        priority
        className="h-11 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-12"
      />

      {withText ? (
        <span className="hidden leading-none lg:block">
          <span
            className={cn(
              "font-display block text-[15px] font-bold tracking-tight whitespace-nowrap",
              light ? "text-white" : "text-navy",
            )}
          >
            CHILDREN&apos;S UNITY
          </span>
          <span
            className={cn(
              "mt-1 block text-[10px] font-semibold tracking-[0.32em]",
              light ? "text-white/70" : "text-ink-muted",
            )}
          >
            FOUNDATION
          </span>
        </span>
      ) : null}
    </Link>
  );
}
