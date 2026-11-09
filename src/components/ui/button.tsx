import Link from "next/link";
import type { ComponentProps } from "react";
import { classes } from "@/lib/classes";

type Variant = "primary" | "secondary" | "dark";

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-sm leading-snug tracking-wide transition-colors duration-200 cursor-pointer";

const sizes = "min-h-[48px] px-7 py-3.5";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover active:bg-brand-hover",
  secondary:
    "bg-transparent text-ink border border-border hover:bg-ice hover:border-brand active:bg-ice",
  dark:
    "bg-black text-white hover:bg-neutral-800 active:bg-neutral-700",
};

const disabled = "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none";

/** Primary, secondary or dark filled button */
export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={classes(base, sizes, variants[variant], disabled, className)}
      {...props}
    />
  );
}

/** Anchor-styled button using next/link */
export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link
      className={classes(base, sizes, variants[variant], className)}
      {...props}
    />
  );
}
