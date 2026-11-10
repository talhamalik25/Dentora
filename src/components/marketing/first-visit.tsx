import { ArrowUpRight } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { FirstVisitMotion } from "./first-visit-motion";

const steps = [
  ["Choose your treatment", "Explore dental services and choose the treatment you'd like to discuss."],
  ["Find your time", "Select your preferred dentist and an available appointment time."],
  ["Confirm your visit", "Provide your details and receive confirmation after successful booking."],
  ["Visit Dentora", "Arrive at the clinic at your scheduled appointment time."],
];

export function FirstVisit() {
  return (
    <FirstVisitMotion>
      <SiteContainer className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-20 xl:gap-28">
        <header data-visit-heading className="min-w-0 lg:sticky lg:top-32 [@media(max-height:600px)]:static">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[.12em] text-muted">05 / Your first visit</p>
          <h2 id="first-visit-heading" className="text-[clamp(38px,5vw,72px)] leading-[1.04] font-semibold tracking-[-.055em] text-black">
            Your first visit,<br /><span className="text-brand">made simple.</span>
          </h2>
          <p className="mt-7 max-w-[340px] text-base leading-relaxed text-muted">
            A preview of your appointment journey. Online booking is coming soon; availability and reservations are not yet enabled.
          </p>
          <ButtonLink href="/book" variant="secondary" className="mt-7 gap-3">
            About online booking <ArrowUpRight size={18} aria-hidden="true" />
          </ButtonLink>
        </header>

        <ol aria-label="Your first visit, in four steps" className="m-0 min-w-0 list-none p-0">
          {steps.map(([title, description], index) => (
            <li key={title} data-visit-step data-active={index === 0} className="group/step relative pl-9 sm:pl-12">
              {index < steps.length - 1 && (
                <span aria-hidden="true" className="absolute top-[50px] left-[7px] h-full w-px bg-black/10">
                  <span data-visit-fill className="absolute inset-0 origin-top bg-brand [transform:scaleY(0)]" />
                </span>
              )}
              <span data-visit-marker aria-hidden="true" className="absolute top-[42px] left-0 size-[15px] rounded-full border border-border bg-white transition-colors duration-200 group-data-[active=true]/step:border-brand group-data-[active=true]/step:bg-brand motion-reduce:transition-none" />
              <div className="min-h-[200px] border-t border-black/10 py-8 group-last/step:border-b sm:min-h-[220px] lg:min-h-[240px]">
                <div data-visit-copy>
                  <p aria-hidden="true" className="mb-5 text-[clamp(36px,4vw,56px)] leading-none font-medium tracking-[-.06em] text-black transition-colors duration-200 group-data-[active=true]/step:text-brand motion-reduce:transition-none">0{index + 1}</p>
                  <h3 className="text-[clamp(24px,2.5vw,36px)] leading-[1.15] font-medium tracking-[-.035em] text-black transition-colors duration-200 group-data-[active=true]/step:text-brand motion-reduce:transition-none">{title}</h3>
                  <p className="mt-3 max-w-[380px] text-base leading-relaxed text-muted">{description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </SiteContainer>
    </FirstVisitMotion>
  );
}
