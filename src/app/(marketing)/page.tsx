import { Hero } from "@/components/marketing/hero";
import { AboutIntroduction } from "@/components/marketing/about-introduction";
import { ArrowUpRight } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
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
      <section id="your-visit" className="py-20 md:py-28 lg:py-36">
        <SiteContainer>
          <Reveal>
            <SectionHeading eyebrow="Your first visit">
              A simple start to better care.
            </SectionHeading>

            <div className="mt-10 grid gap-10 sm:grid-cols-3 lg:gap-12">
              {[
                [
                  "Let's get acquainted",
                  "Share your questions and what you would like from your care.",
                ],
                [
                  "Understand your options",
                  "Talk through an assessment and possible next steps with a dentist.",
                ],
                [
                  "Make a plan together",
                  "Choose a path that considers your needs, comfort, and priorities.",
                ],
              ].map(([title, text], i) => (
                <article
                  key={title}
                  className="border-b border-border pb-6 sm:border-b-0 sm:pb-0"
                >
                  <span className="text-[28px] font-bold text-brand">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 text-[1.35rem] font-bold tracking-tight text-black">
                    {title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-7 text-muted">
                    {text}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-[11px] text-muted leading-relaxed">
              Example patient journey. Actual clinical processes will be
              confirmed before launch.
            </p>
          </Reveal>
        </SiteContainer>
      </section>

      {/* ── CTA Panel ────────────────────────────────── */}
      <section className="pb-20">
        <SiteContainer>
          <div className="flex flex-col items-start justify-between gap-8 rounded-[16px] bg-black p-9 text-white md:flex-row md:items-center md:gap-12 md:p-14">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[2.5px] text-brand">
                Your next chapter
              </p>
              <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.5rem)] font-bold leading-tight tracking-tight">
                A little more confidence.
                <br />
                A lot more you.
              </h2>
              <p className="mt-4 text-xs leading-relaxed text-white/70">
                Explore the beginning of a more thoughtful dental experience.
              </p>
            </div>
            <div className="shrink-0">
              <ButtonLink href="/book">
                Plan your visit{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </ButtonLink>
              <p className="mt-3 text-center text-[10px] text-white/50">
                Booking preview · coming soon
              </p>
            </div>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
