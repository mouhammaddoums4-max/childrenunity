import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "accent" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-[background-color,color,box-shadow,transform] duration-200 " +
  "cursor-pointer select-none active:scale-[0.98] " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-soft hover:bg-brand-600 hover:shadow-lift",
  outline:
    "border-2 border-brand/25 bg-white text-brand hover:border-brand hover:bg-brand-50",
  accent:
    "bg-orange text-white shadow-soft hover:bg-orange-ink hover:shadow-lift",
  quiet:
    "bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20 backdrop-blur-sm",
};

/* Hauteurs >= 44px : cible tactile minimale recommandee. */
const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-13 px-7 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<
    React.ComponentPropsWithoutRef<"a">,
    "href" | "className" | "children"
  >) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps &
  Omit<React.ComponentPropsWithoutRef<"button">, "className" | "children">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
