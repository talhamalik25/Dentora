import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Booking Policies — Dentora",
  description: "Official booking, cancellation, and appointment guidelines for the Dentora dental clinic platform.",
};

const policyRules = [
  {
    title: "Advance Scheduling Horizon",
    rule: "Up to 60 days in advance",
    description: "Patients may schedule appointments up to 60 calendar days ahead of time. This window ensures optimal clinical staffing and equipment readiness.",
  },
  {
    title: "Minimum Booking Notice",
    rule: "2 hours prior to start time",
    description: "To allow the clinical team adequate preparation for patient intake and sterilization protocols, appointments must be scheduled at least 2 hours before the start time.",
  },
  {
    title: "Slot Intervals & Treatment Durations",
    rule: "15-minute start intervals",
    description: "Available appointment start times are offered in 15-minute intervals. Treatment durations vary based on the specific clinical procedure selected (e.g., 30 minutes for general care, 45 minutes for cosmetic, 60 minutes for restorative).",
  },
  {
    title: "Cancellation & Rescheduling Cutoff",
    rule: "12 hours advance notice",
    description: "Patients may cancel or reschedule their appointment up to 12 hours before the scheduled time without penalty via their secure management link.",
  },
  {
    title: "Rescheduling Limits",
    rule: "Maximum 2 patient-initiated reschedules",
    description: "To maintain clinic availability for all patients, up to 2 self-service reschedules are permitted per booking. Further modifications require direct contact with the clinic reception desk.",
  },
  {
    title: "Guest Booking & Access",
    rule: "No account registration required",
    description: "Dentora features friction-free guest booking. Appointments are verified through your email address, which receives a secure one-time token link to manage your booking.",
  },
  {
    title: "Payment Policy",
    rule: "Zero upfront online payment",
    description: "Online payments are excluded from the initial platform release. All consultations, diagnostics, and procedures are settled directly at the clinic reception following your appointment.",
  },
];

export default function BookingPoliciesPage() {
  return (
    <main id="main-content" className="bg-white text-ink">
      {/* ── Header ── */}
      <section className="border-b border-border bg-ice py-20 md:py-28 lg:py-32">
        <SiteContainer>
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.5px] leading-relaxed text-brand">
            <span className="inline-block h-[1.5px] w-7 bg-brand" aria-hidden="true" />
            Clinic Terms & Standards
          </p>

          <h1 className="mt-5 max-w-3xl font-sans text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-black">
            Booking policies.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-on-ice">
            Clear, transparent expectations designed to protect patient time, clinical focus, and healthcare quality.
          </p>

          <div className="mt-8 max-w-2xl rounded-[var(--radius-card)] border border-brand/20 bg-white p-5 text-xs leading-relaxed text-ink shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="font-semibold text-brand">SPECIFICATION PREVIEW</span> — These policies reflect our approved product rules for Dentora. Online booking is currently disabled in this demonstration release.
          </div>
        </SiteContainer>
      </section>

      {/* ── Policies List ── */}
      <section className="py-20 md:py-28 bg-white">
        <SiteContainer className="max-w-4xl">
          <div className="space-y-10">
            {policyRules.map((item, index) => (
              <article
                key={item.title}
                className="rounded-[var(--radius-panel)] border border-border bg-white p-7 sm:p-9 transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand">
                    Rule 0{index + 1}
                  </span>
                  <span className="inline-block rounded-full bg-ice px-3 py-1 text-xs font-semibold text-brand">
                    {item.rule}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-black sm:text-2xl">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-border pt-8">
            <Link
              href="/book"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              View appointment preview <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-muted hover:text-black"
            >
              ← Back to homepage
            </Link>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
