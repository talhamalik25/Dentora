import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { Button, ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Appointment Preview — Dentora",
  description: "Preview of the planned Dentora appointment booking workflow and scheduling guidelines.",
};

const plannedSteps = [
  { step: "01", name: "Select Treatment", desc: "Choose from General, Cosmetic, or Restorative care categories." },
  { step: "02", name: "Choose Specialist", desc: "Select a specific dentist or 'Any Available' for the soonest slot." },
  { step: "03", name: "Pick Date & Time", desc: "Browse real-time 15-minute slot intervals up to 60 days ahead." },
  { step: "04", name: "Patient Details", desc: "Provide guest contact information without creating an account." },
  { step: "05", name: "Instant Confirmation", desc: "Receive immediate booking confirmation and secure management token." },
];

export default function BookingPage() {
  return (
    <main id="main-content" className="bg-white text-ink">
      <section className="border-b border-border bg-ice py-20 md:py-28 lg:py-32">
        <SiteContainer>
          <CalendarDays
            size={40}
            strokeWidth={1.3}
            className="text-brand"
            aria-hidden="true"
          />

          <p className="mt-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.5px] leading-relaxed text-brand">
            <span
              className="inline-block h-[1.5px] w-7 bg-brand"
              aria-hidden="true"
            />
            Appointment preview
          </p>

          <h1 className="mt-5 font-sans text-[clamp(2.4rem,5vw,4.5rem)] font-extrabold leading-[1.02] tracking-tight text-black">
            Your next visit,
            <br />
            <span className="text-brand">thoughtfully planned.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-on-ice">
            Online booking is scheduled for launch in a future phase. This preview showcases the planned patient reservation flow. This demonstration cannot check live availability or store medical reservations.
          </p>

          <div className="mt-8 max-w-2xl rounded-[var(--radius-card)] border border-brand/20 bg-white p-5 text-xs leading-relaxed text-ink shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="font-semibold text-brand">PREVIEW ONLY</span> — No personal or clinical health data is collected here. Live appointments are not operational in this demonstration.
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button disabled aria-disabled="true">
              Booking system coming soon
            </Button>
            <ButtonLink href="/" variant="secondary">
              <ArrowLeft size={17} aria-hidden="true" /> Back to Dentora
            </ButtonLink>
          </div>
        </SiteContainer>
      </section>

      {/* ── Journey Preview ── */}
      <section className="py-20 md:py-28 bg-white">
        <SiteContainer>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-brand">
              Experience Architecture
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-black sm:text-3xl">
              The planned booking journey
            </h2>
            <p className="mt-3 text-base text-muted">
              Designed for transparency, speed, and peace of mind with zero registration required.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plannedSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-[var(--radius-panel)] border border-border bg-white p-7 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tabular-nums text-brand">
                    Step {item.step}
                  </span>
                  <CheckCircle2 size={16} className="text-brand/60" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-black">
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            ))}

            {/* Policy Reference card */}
            <div className="rounded-[var(--radius-panel)] border border-brand/30 bg-ice p-7 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                  Clinic Rules
                </span>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-black">
                  Standardized Policies
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-ice">
                  12-hour cancellation notice, up to 2 self-service reschedules, and 60-day advance scheduling horizon.
                </p>
              </div>
              <Link
                href="/booking-policies"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
              >
                Review all policies <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
