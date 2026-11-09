import type { ReactNode } from "react";
import { classes } from "@/lib/classes";

interface SectionHeadingProps {
  /** Uppercase label above the heading */
  eyebrow: string;
  /** The heading content */
  children: ReactNode;
  /** Optional supporting paragraph */
  description?: string;
  /** Additional classes on wrapper */
  className?: string;
  /** Align center for editorial sections */
  center?: boolean;
}

/** Reusable editorial section heading — eyebrow + title + optional description */
export function SectionHeading({
  eyebrow,
  children,
  description,
  className,
  center = false,
}: SectionHeadingProps) {
  return (
    <div className={classes("max-w-2xl", center && "mx-auto text-center", className)}>
      {/* Eyebrow */}
      <p
        className={classes(
          "flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.5px] leading-relaxed text-brand",
          center && "justify-center",
        )}
      >
        <span className="inline-block h-[1.5px] w-7 bg-brand" aria-hidden="true" />
        {eyebrow}
      </p>

      {/* Title */}
      <h2 className="mt-5 font-sans text-[clamp(1.8rem,3vw,3rem)] font-bold leading-[1.1] tracking-tight text-black">
        {children}
      </h2>

      {/* Description */}
      {description && (
        <p className="mt-5 text-base leading-7 text-muted">{description}</p>
      )}
    </div>
  );
}
