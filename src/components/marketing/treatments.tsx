import { SiteContainer } from "@/components/ui/container";
import { demoServices } from "@/features/marketing/services";
import { TreatmentShowcase } from "./treatment-showcase";

export function Treatments() {
  return (
    <section id="services" aria-labelledby="treatments-heading" className="bg-white py-[clamp(80px,9vw,144px)] text-black">
      <SiteContainer>
        <div className="flex justify-between gap-4 border-b border-black/10 pb-6 text-[11px] font-semibold uppercase tracking-[.12em]"><span>03 / What we offer</span><span className="text-muted">Care, considered.</span></div>
        <div className="grid gap-6 pt-8 pb-10 md:grid-cols-[1.6fr_1fr] md:items-end md:gap-10 md:pt-10 md:pb-14">
          <h2 id="treatments-heading" className="text-[clamp(40px,5.8vw,80px)] leading-[1.02] font-semibold tracking-[-.055em]">Treatments designed<br /><span className="text-brand">around you.</span></h2>
          <p className="max-w-80 text-base leading-[1.65] text-muted md:pb-1">Explore our range of treatments, from preventive care to cosmetic and restorative dentistry.</p>
        </div>
        <TreatmentShowcase services={demoServices} />
        <p className="mt-7 text-[11px] leading-relaxed text-muted">Demonstration services · not currently bookable</p>
      </SiteContainer>
    </section>
  );
}
