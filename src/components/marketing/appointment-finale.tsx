import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { FinaleMotion } from "./finale-motion";

export function AppointmentFinale() {
  return (
    <FinaleMotion>
      <section id="plan-your-visit" aria-labelledby="appointment-finale-heading" className="flex min-h-[90svh] items-center overflow-clip bg-black py-20 text-white lg:py-28">
        <SiteContainer>
          <p className="mb-12 flex items-center gap-3 text-xs font-medium uppercase tracking-[.16em] text-white/70 md:mb-16">
            <span aria-hidden="true" className="size-2 rounded-full bg-brand" /> Your next chapter
          </p>
          <div data-finale-drift>
            <h2 id="appointment-finale-heading" className="text-[clamp(38px,8.5vw,122px)] leading-[.96] font-semibold tracking-[-.065em]">
              {["READY FOR A", "DIFFERENT KIND", "OF DENTAL", "EXPERIENCE?"].map((line, index) => (
                <span key={line} className="block overflow-clip pb-[.09em]">
                  <span data-finale-line className={`block ${index === 1 ? "md:pl-[8%]" : ""}`}>{line}</span>
                </span>
              ))}
            </h2>
          </div>
          <div data-finale-reveal className="mt-12 flex flex-col items-start justify-between gap-7 border-t border-white/20 pt-8 md:flex-row md:items-center lg:mt-14">
            <p id="appointment-preview-note" className="max-w-[320px] text-sm leading-relaxed text-white/70">Booking preview · coming soon.<br />Explore the next step. This demo cannot check availability or reserve a visit.</p>
            <Link href="/book" aria-describedby="appointment-preview-note" className="group inline-flex min-h-16 items-center gap-10 rounded-full bg-white px-8 py-5 text-lg font-medium text-black transition-colors duration-200 hover:bg-ice focus-visible:outline-white motion-reduce:transition-none">
              Plan your visit <ArrowUpRight aria-hidden="true" className="size-6 text-brand transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
            </Link>
          </div>
        </SiteContainer>
      </section>
    </FinaleMotion>
  );
}
