import { Hero } from "@/components/marketing/hero";
import { AboutIntroduction } from "@/components/marketing/about-introduction";
import { AppointmentFinale } from "@/components/marketing/appointment-finale";
import { EditorialFaq } from "@/components/marketing/editorial-faq";

import { FirstVisit } from "@/components/marketing/first-visit";
import { Treatments } from "@/components/marketing/treatments";
import { DentoraDifference } from "@/components/marketing/dentora-difference";
import { OurSpecialists } from "@/components/marketing/our-specialists";
import { ClinicExperience } from "@/components/marketing/clinic-experience";

export default function Home() {
  return (
    <main id="main-content" className="max-sm:overflow-x-clip">
      <Hero />

      {/* ── Section 02: The Art of Better Smiles (About Introduction) ── */}
      <AboutIntroduction />

      {/* ── Services ─────────────────────────────────── */}
      <Treatments />

      {/* ── Approach ─────────────────────────────────── */}
      <DentoraDifference />

      <OurSpecialists />

      {/* ── Section 06: Clinic Experience ────────────── */}
      <ClinicExperience />

      {/* ── Your Visit ───────────────────────────────── */}
      <FirstVisit />

      <AppointmentFinale />
      <EditorialFaq />
    </main>
  );
}
