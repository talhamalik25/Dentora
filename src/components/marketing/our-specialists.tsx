import { SiteContainer } from "@/components/ui/container";
import { demoSpecialists } from "@/features/marketing/specialists";
import { SpecialistGallery } from "./specialist-gallery";

export function OurSpecialists() {
  return (
    <section id="specialists" aria-labelledby="specialists-heading" className="bg-white py-20 text-black md:py-24 lg:py-32">
      <SiteContainer>
        <p className="border-b border-black/10 pb-6 text-xs font-semibold uppercase tracking-[.12em]">03 / Our Specialists</p>
        <div className="grid gap-6 py-8 md:grid-cols-[1.5fr_1fr] md:items-end md:gap-12 md:py-12 lg:pb-16">
          <h2 id="specialists-heading" className="max-w-[750px] text-[clamp(38px,5.6vw,80px)] leading-[1.03] font-semibold tracking-[-.055em]">
            The people behind<br />every smile.
          </h2>
          <p className="max-w-[340px] text-base leading-relaxed text-muted md:justify-self-end">
            Get to know the people who bring care, precision and personal attention to every visit.
          </p>
        </div>
        <p id="specialists-disclosure" className="mb-6 max-w-[680px] text-xs leading-relaxed text-muted">
          <span className="font-semibold text-black">DEMO PROFILES</span> — Fictional names and example areas of care. Stock portraits show models, not Dentora staff. No credentials or endorsements are implied.
        </p>
        <SpecialistGallery profiles={demoSpecialists} />
      </SiteContainer>
    </section>
  );
}
