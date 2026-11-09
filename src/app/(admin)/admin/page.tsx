import type { Metadata } from "next";
import { SiteContainer } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Administration preview",
  robots: { index: false, follow: false },
};

export default function AdminPreview() {
  return (
    <main id="main-content">
      <SiteContainer className="min-h-[65vh] py-20 md:py-28 lg:py-36">
        {/* Eyebrow */}
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.5px] leading-relaxed text-brand">
          <span
            className="inline-block h-[1.5px] w-7 bg-brand"
            aria-hidden="true"
          />
          Dentora · administration
        </p>

        <h1 className="mt-5 font-sans text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[1.02] tracking-tight text-black">
          Room for
          <br />
          <span className="text-brand">what comes next.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-7 text-muted">
          The admin workspace is not available in this phase. This public
          placeholder contains no clinic data or administrative controls.
          Authentication and authorization will be implemented before
          operational features are added.
        </p>

        <div className="mt-8">
          <ButtonLink href="/">Return to Dentora</ButtonLink>
        </div>
      </SiteContainer>
    </main>
  );
}
