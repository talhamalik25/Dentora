"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Plus } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";

const questions = [
  ["Can I book an appointment now?", "Not yet. This website is a demonstration: it cannot check availability, reserve appointments or collect patient information. The planned service will confirm a booking only after the server successfully accepts it."],
  ["Will I need an account?", "Guest booking is planned, so an account will not be required. Secure management links are intended to let you manage your appointment. Neither feature is operational in this preview."],
  ["Will I be able to choose my dentist?", "The planned journey lets you select a treatment, then choose a dentist or Any Available before choosing a date and time. Dentist availability is not connected in this preview."],
  ["How far ahead will I be able to book?", "The planned booking window is up to 60 days ahead, with at least 2 hours’ notice. Available start times will use 15-minute intervals; this does not mean every treatment lasts 15 minutes. Live times are not available yet."],
  ["What if I need to change my visit?", "The planned cancellation and rescheduling cutoff is 12 hours before the appointment. Up to 2 patient-initiated reschedules will be allowed. Appointment management is not operational in this preview."],
  ["Will I need to pay when booking?", "Online payments are excluded from the planned initial release. This demonstration does not take payments or create bookings. Treatment fees and payment arrangements have not been published here."],
];

export function EditorialFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const targets: Record<string, number> = { ArrowDown: (index + 1) % questions.length, ArrowUp: (index + questions.length - 1) % questions.length, Home: 0, End: questions.length - 1 };
    if (event.key in targets) { event.preventDefault(); buttons.current[targets[event.key]]?.focus(); }
  };
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-white py-20 text-black md:py-28 lg:py-36">
      <SiteContainer className="grid items-start gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
        <header className="lg:sticky lg:top-32 [@media(max-height:600px)]:static">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[.12em] text-muted">A little clarity</p>
          <h2 id="faq-heading" className="text-[clamp(42px,5.5vw,76px)] leading-[1.02] font-semibold tracking-[-.055em]">Good questions.<br /><span className="text-brand">Clear answers.</span></h2>
          <p className="mt-7 max-w-[300px] text-base leading-relaxed text-muted">A look at how booking is planned to work. Online appointments are not live yet.</p>
        </header>
        <div className="min-w-0 border-t border-black/15">
          {questions.map(([question, answer], index) => {
            const expanded = open === index;
            return (
              <div key={question} className="border-b border-black/15">
                <h3>
                  <button ref={element => { buttons.current[index] = element; }} id={`faq-question-${index}`} type="button" aria-expanded={expanded} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(expanded ? null : index)} onKeyDown={event => navigate(event, index)} className={`group flex w-full items-start gap-4 py-7 text-left transition-colors duration-200 sm:gap-6 sm:py-8 motion-reduce:transition-none ${expanded ? "text-brand" : "text-black hover:text-brand"}`}>
                    <span aria-hidden="true" className="pt-1 text-xs tabular-nums">0{index + 1}</span>
                    <span className="flex-1 text-[clamp(20px,2vw,28px)] leading-[1.2] font-medium tracking-[-.025em]">{question}</span>
                    <Plus aria-hidden="true" className={`mt-0.5 size-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${expanded ? "rotate-45" : ""}`} />
                  </button>
                </h3>
                <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} aria-hidden={!expanded} inert={!expanded} className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none ${expanded ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden"><p className="max-w-[540px] pr-5 pb-8 pl-8 text-base leading-relaxed text-muted sm:pl-10">{answer}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </SiteContainer>
    </section>
  );
}
