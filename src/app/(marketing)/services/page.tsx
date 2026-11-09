import type { Metadata } from "next";
import { SiteContainer } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { demoServices } from "@/features/marketing/services";

export const metadata: Metadata = { title: "Explore our care concept" };

export default function ServicesPage() {
  return (
    <main id="main-content">
      <SiteContainer className="py-20 md:py-28 lg:py-36">
        {/* Eyebrow */}
        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.5px] leading-relaxed text-brand">
          <span
            className="inline-block h-[1.5px] w-7 bg-brand"
            aria-hidden="true"
          />
          Demonstration services
        </p>

        {/* Title */}
        <h1 className="mt-5 font-sans text-[clamp(1.8rem,3vw,3rem)] font-bold leading-[1.1] tracking-tight text-black">
          Care, considered.
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-muted">
          An illustrative introduction to the care categories envisioned for
          Dentora. Treatments, availability, and suitability must be confirmed
          with a qualified dentist before launch.
        </p>

        {/* Service cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoServices.map((service) => (
            <article
              key={service.id}
              className="rounded-[14px] border border-border bg-white p-8 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <h2 className="text-xl font-bold tracking-tight text-black">
                {service.name}
              </h2>
              <p className="mt-3 text-[13px] leading-7 text-muted">
                {service.description}
              </p>
              <span className="mt-4 block text-[11px] text-muted">
                Concept preview · not currently bookable
              </span>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <ButtonLink href="/book">View appointment preview ↗</ButtonLink>
        </div>
      </SiteContainer>
    </main>
  );
}
