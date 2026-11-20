import Link from "next/link";
import { clinicConfig } from "@/config/clinic.config";

/** Clinic brand wordmark with inline SVG tooth icon */
export function Brand() {
  const name = clinicConfig.identity.name.toLowerCase();
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 text-[26px] font-bold tracking-[-1.5px] text-black hover:opacity-80 transition-opacity duration-200"
      aria-label={`${clinicConfig.identity.name} home`}
    >
      <svg
        width="31"
        height="35"
        viewBox="0 0 31 35"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M15.5 5C7-1 1 4 3 13c1 6 3 17 7 18 3 1 2-12 5.5-12S18 32 21 31c4-1 6-12 7-18 2-9-4-14-12.5-8Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M11 7c3 2 6 2 9 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span>
        {name}<span className="text-brand">.</span>
      </span>
    </Link>
  );
}
