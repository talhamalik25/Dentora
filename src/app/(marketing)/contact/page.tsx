import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { site } from "@/config/site";
import { clinicConfig } from "@/config/clinic.config";

export const metadata: Metadata = {
  title: "Contact — Get in Touch",
  description: "Contact and studio details for Dentora. Demonstration dental clinic concept.",
};

export default function ContactPage() {
  return (
    <main id="main-content" className="bg-white text-ink">
      {/* ── Header ── */}
      <section className="border-b border-border bg-ice py-20 md:py-28 lg:py-32">
        <SiteContainer>
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.5px] leading-relaxed text-brand">
            <span className="inline-block h-[1.5px] w-7 bg-brand" aria-hidden="true" />
            Connect with Dentora
          </p>

          <h1 className="mt-5 max-w-3xl font-sans text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-black">
            Get in touch.
            <br />
            <span className="text-brand font-medium">We are here to help.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-on-ice">
            Have questions about our care concepts, treatment philosophy, or future appointment openings? Reach out to our demonstration team.
          </p>

          <div className="mt-8 max-w-2xl rounded-[var(--radius-card)] border border-brand/20 bg-white p-5 text-xs leading-relaxed text-ink shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="font-semibold text-brand">DEMONSTRATION NOTICE</span> — Dentora is an illustrative dental clinic design concept. The address, email, and operating hours below are simulated placeholders for testing and design review.
          </div>
        </SiteContainer>
      </section>

      {/* ── Contact Details Grid ── */}
      <section className="py-20 md:py-28 bg-white">
        <SiteContainer>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Location Card */}
            <div className="rounded-[var(--radius-panel)] border border-border bg-white p-8 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
              <div className="flex size-12 items-center justify-center rounded-full bg-ice text-brand">
                <MapPin size={22} aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-xl font-medium tracking-tight text-black">Studio Location</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {site.demoContact.address}
              </p>
              <p className="mt-4 text-xs text-muted/80">
                Simulated clinic address · no physical reception on site.
              </p>
            </div>

            {/* Inquiries Card */}
            <div className="rounded-[var(--radius-panel)] border border-border bg-white p-8 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
              <div className="flex size-12 items-center justify-center rounded-full bg-ice text-brand">
                <Mail size={22} aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-xl font-medium tracking-tight text-black">Electronic Inquiries</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                <a
                  href={`mailto:${site.demoContact.email}`}
                  className="font-medium text-black hover:text-brand hover:underline"
                >
                  {site.demoContact.email}
                </a>
              </p>
              <p className="mt-4 text-xs text-muted/80">
                Demonstration inbox · inquiries monitored during development.
              </p>
            </div>

            {/* Hours Card */}
            <div className="rounded-[var(--radius-panel)] border border-border bg-white p-8 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
              <div className="flex size-12 items-center justify-center rounded-full bg-ice text-brand">
                <Clock size={22} aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-xl font-medium tracking-tight text-black">Planned Clinic Hours</h2>
              <div className="mt-3 space-y-1 text-sm text-muted">
                {clinicConfig.scheduling.regularHours.map((h) => (
                  <p key={h.label}><span className="font-medium text-black">{h.label}:</span> {h.hours}</p>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted/80">
                Illustrative clinic operating timetable.
              </p>
            </div>
          </div>

          {/* ── FAQ & Support Banner ── */}
          <div className="mt-16 flex flex-col justify-between gap-6 rounded-[var(--radius-panel)] bg-ice p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-black">
                Common questions answered
              </h2>
              <p className="mt-2 text-sm text-on-ice">
                Learn more about our planned booking policies, notice periods, and guest appointments.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/faq"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
              >
                View FAQs <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/book"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-border bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-ice"
              >
                Appointment preview
              </Link>
            </div>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
