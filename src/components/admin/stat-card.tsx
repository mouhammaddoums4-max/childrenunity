import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const accents = {
  brand: { bg: "bg-brand-50", text: "text-brand" },
  teal: { bg: "bg-teal-50", text: "text-teal-ink" },
  orange: { bg: "bg-orange-50", text: "text-orange-ink" },
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "brand",
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: keyof typeof accents;
  href?: string;
}) {
  const style = accents[accent];

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-ink-muted">{label}</span>
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            style.bg,
          )}
        >
          <Icon className={cn("size-5", style.text)} aria-hidden="true" />
        </span>
      </div>

      <p className="font-display mt-3 text-3xl leading-none font-extrabold tabular-nums text-navy">
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-ink-muted">{hint}</p> : null}
    </>
  );

  const className =
    "block h-full rounded-3xl border border-line bg-white p-6 shadow-soft transition-[transform,box-shadow] duration-200";

  if (href) {
    return (
      <Link href={href} className={cn(className, "hover:-translate-y-0.5 hover:shadow-lift")}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
