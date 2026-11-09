import type { ComponentProps } from "react";
import { classes } from "@/lib/classes";

interface InputProps extends ComponentProps<"input"> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

/** Accessible form input with label, hint and error messaging */
export function Input({
  id,
  label,
  hint,
  error,
  className,
  "aria-describedby": describedBy,
  ...props
}: InputProps) {
  const description =
    [describedBy, hint && `${id}-hint`, error && `${id}-error`]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={description}
        className={classes(
          "w-full min-h-[48px] rounded-[14px] border border-border bg-white px-4 py-3 text-base text-ink placeholder:text-muted/60",
          "focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand",
          "transition-shadow duration-200",
          error && "border-red-600 focus:ring-red-500",
          className,
        )}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-700 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
