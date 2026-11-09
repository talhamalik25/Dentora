import type { ComponentProps } from "react";
import { classes } from "@/lib/classes";

/** Constrained content container — max-width 1360px with responsive gutters */
export function SiteContainer({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={classes(
        "mx-auto w-full max-w-[1360px] px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16",
        className,
      )}
      {...props}
    />
  );
}
