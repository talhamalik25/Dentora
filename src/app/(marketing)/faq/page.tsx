import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { clinicConfig } from "@/config/clinic.config";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Dentora",
  description: "Read answers to common questions regarding Dentora's care philosophy, planned booking system, and clinic policies.",
};

const faqSections = [
  {
    category: "Appointments & Booking",
    items: [
      {
        q: "Can I book an appointment right now?",
        a: "Not yet. This website is a design and architectural demonstration: it cannot check real-time availability, hold dates, or collect confidential health information. In the live release, bookings will be confirmed only after the server successfully validates and accepts them.",
      },
      {
        q: "Will I need to create an account to book?",
        a: `No. ${clinicConfig.identity.name} is planned with seamless guest booking so patients do not need to register a password or account. Secure one-time management links sent to your verified email will allow you to view or reschedule visits.`,
      },
      {
        q: "Will I be able to choose my dentist?",
        a: "Yes. The planned booking experience allows you to select your care category and then choose either a specific dentist or 'Any Available' for the earliest open appointment slot.",
      },
      {
        q: "How far in advance can appointments be scheduled?",
        a: `The planned booking horizon is up to ${clinicConfig.scheduling.bookingMaxDaysAhead} days in advance, with a minimum required notice of ${clinicConfig.scheduling.bookingMinNoticeHours} hours. Start times will be offered in ${clinicConfig.scheduling.slotIntervalMinutes}-minute slot intervals.`,
      },
    ],
  },
  {
    category: "Policies & Cancellations",
    items: [
      {
        q: "What is the cancellation and rescheduling policy?",
        a: `A ${clinicConfig.scheduling.cancellationCutoffHours}-hour minimum notice cutoff is planned for cancellations and rescheduling. Patients will be able to perform up to ${clinicConfig.scheduling.maxPatientReschedules} self-initiated reschedules via their secure management link.`,
      },
      {
        q: "Will I need to pay online when booking?",
        a: "Online payments are excluded from the initial release scope. No credit card or billing details will be collected during appointment scheduling.",
      },
      {
        q: "What happens if I miss my scheduled appointment?",
        a: "Appointments that are not attended without 12-hour advance cancellation will be recorded as a missed visit. We encourage patients to reschedule early to allow other patients access to care.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main id="main-content" className="bg-white text-ink">
      {/* ── Hero ── */}
      <section className="border-b border-border bg-ice py-20 md:py-28 lg:py-32">
        <SiteContainer>
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.5px] leading-relaxed text-brand">
            <span className="inline-block h-[1.5px] w-7 bg-brand" aria-hidden="true" />
            Support & Clarity
          </p>

          <h1 className="mt-5 max-w-3xl font-sans text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-black">
            Good questions.
            <br />
            <span className="text-brand font-medium">Clear answers.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-on-ice">
            Everything you need to know about how {clinicConfig.identity.name} is envisioned to operate — from our appointment scheduling rules to clinic policies.
          </p>

          <div className="mt-8 max-w-2xl rounded-[var(--radius-card)] border border-brand/20 bg-white p-5 text-xs leading-relaxed text-ink shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="font-semibold text-brand">DEMONSTRATION STATUS</span> — These answers describe our approved product specifications and business rules. Real-time booking is not currently operational.
          </div>
        </SiteContainer>
      </section>

      {/* ── FAQ Content ── */}
      <section className="py-20 md:py-28 bg-white">
        <SiteContainer>
          <div className="space-y-16 lg:space-y-24">
            {faqSections.map((section, sIdx) => (
              <div key={section.category} className="grid gap-8 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4">
                  <span className="text-xs font-semibold uppercase tracking-[.14em] text-brand">
                    0{sIdx + 1} / Topic
                  </span>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">
                    {section.category}
                  </h2>
                </div>

                <div className="divide-y divide-border lg:col-span-8">
                  {section.items.map((item) => (
                    <article key={item.q} className="py-7 first:pt-0 last:pb-0">
                      <h3 className="text-lg font-medium tracking-tight text-black sm:text-xl">
                        {item.q}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-muted">
                        {item.a}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Footer Banner ── */}
          <div className="mt-20 flex flex-col justify-between gap-6 rounded-[var(--radius-panel)] bg-black p-8 text-white sm:flex-row sm:items-center sm:p-10">
            <div>
              <h3 className="text-xl font-semibold">Still have questions?</h3>
              <p className="mt-1 text-sm text-white/70">Review our detailed booking policies or contact our team.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/booking-policies"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-black transition-colors hover:bg-ice"
              >
                Booking Policies <ArrowUpRight size={14} className="text-brand" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/30 px-5 text-xs font-medium text-white transition-colors hover:bg-white/10"
              >
                Contact Page
              </Link>
            </div>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
