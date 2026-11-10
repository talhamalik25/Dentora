import Image from "next/image";
import { SiteContainer } from "@/components/ui/container";
import { DifferenceMotion } from "./difference-motion";

const pillars = [
  {
    title: "Thoughtful Care",
    description: "A calm, patient-focused experience from the first conversation.",
  },
  {
    title: "Modern Approach",
    description: "A considered approach to dentistry, combining clarity and thoughtful planning.",
  },
  {
    title: "Personal Attention",
    description: "Care shaped around individual needs and meaningful communication.",
  },
];

export function DentoraDifference() {
  return (
    <DifferenceMotion>
      <SiteContainer className="grid gap-y-8 md:grid-cols-[.95fr_1fr] md:gap-x-10 md:gap-y-0 lg:grid-cols-[1.05fr_1fr] lg:gap-x-16 xl:gap-x-24">
        <header className="min-w-0 md:col-start-2 md:row-start-1">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[.12em] text-on-ice lg:mb-8">
            02 / The Dentora Difference
          </p>
          <h2 id="difference-heading" className="text-[clamp(38px,5.2vw,72px)] leading-[1.04] font-semibold tracking-[-.055em] text-black">
            <span className="block overflow-hidden pb-1"><span data-difference-line className="block">Care that feels</span></span>
            <span className="block overflow-hidden pb-1"><span data-difference-line className="block text-brand">different.</span></span>
          </h2>
        </header>

        <figure className="m-0 flex min-w-0 flex-col md:col-start-1 md:row-span-2 md:row-start-1">
          <div data-difference-mask className="relative isolate aspect-[4/3] flex-1 overflow-hidden rounded-[var(--radius-panel)] bg-white md:aspect-auto md:min-h-[620px]">
            <div data-difference-parallax className="absolute -inset-y-5 inset-x-0">
              <Image
                src="/images/difference/clinic-interior.jpg"
                alt="Daylight-filled dental treatment room with white cabinetry and a chair beside a large window"
                fill
                // The landscape source covers a tall frame: its rendered width
                // is driven by the frame height, not the visible column width.
                sizes="(min-width: 768px) 1280px, 100vw"
                className="object-cover object-[46%_50%] saturate-[.65]"
              />
            </div>
          </div>
          <figcaption className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs leading-relaxed text-on-ice">
            <span>Illustrative clinic photography</span>
            <span>Not the Dentora premises</span>
          </figcaption>
        </figure>

        <div className="min-w-0 md:col-start-2 md:row-start-2 md:pt-6 lg:pt-8">
          <p className="max-w-[440px] text-base leading-[1.7] text-on-ice">
            Thoughtful experiences begin with the details. Discover a modern approach to dental care designed to make every visit feel more comfortable, personal, and considered.
          </p>
          <ol data-difference-pillars className="mt-8 list-none p-0 lg:mt-10">
            {pillars.map((pillar, index) => (
              <li key={pillar.title} data-difference-pillar className="grid grid-cols-[24px_minmax(0,1fr)] gap-4 border-t border-black/10 py-6 last:border-b lg:gap-6">
                <span aria-hidden="true" className="pt-1 text-xs font-medium tabular-nums text-brand">0{index + 1}</span>
                <div>
                  <h3 className="text-[clamp(22px,2.1vw,28px)] leading-tight font-medium tracking-[-.035em] text-black">{pillar.title}</h3>
                  <p className="mt-2 max-w-[350px] text-base leading-relaxed text-on-ice">{pillar.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-[420px] text-xs leading-relaxed text-on-ice">
            Our demo clinic vision — proposed experiences, not verified clinical claims.
          </p>
        </div>
      </SiteContainer>
    </DifferenceMotion>
  );
}
