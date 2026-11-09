import type { Metadata } from "next";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { Button, ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Appointment preview" };

export default function BookingPage() {
  return (
    <main id="main-content">
      <SiteContainer className="min-h-[65vh] py-20 md:py-28 lg:py-36">
        <CalendarDays
          size={40}
          strokeWidth={1.3}
          className="text-brand"
          aria-hidden="true"
        />

        {/* Eyebrow */}
        <p className="mt-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.5px] leading-relaxed text-brand">
          <span
            className="inline-block h-[1.5px] w-7 bg-brand"
            aria-hidden="true"
          />
          Appointment preview
        </p>

        <h1 className="mt-5 font-sans text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[1.02] tracking-tight text-black">
          Your next visit,
          <br />
          <span className="text-brand">thoughtfully planned.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-7 text-muted">
          Online booking is coming in a future phase. This demonstration cannot
          check availability or reserve an appointment.
        </p>
        <p className="mt-3 text-sm text-muted">
          No personal or health information is collected here.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button disabled>Booking coming soon</Button>
          <ButtonLink href="/" variant="secondary">
            <ArrowLeft size={17} aria-hidden="true" /> Back to Dentora
          </ButtonLink>
        </div>
      </SiteContainer>
    </main>
  );
}
