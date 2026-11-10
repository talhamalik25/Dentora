import Image from "next/image";
import { ExperienceMotion } from "./experience-motion";

export function ClinicExperience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative w-full bg-ice text-black"
    >
      <ExperienceMotion>
        <div
          data-experience-stage
          className="relative flex h-[86vh] min-h-[580px] w-full flex-col overflow-hidden bg-ice md:h-screen md:min-h-[640px]"
        >
          {/* ── Initial editorial label above image frame ── */}
          <div
            data-experience-initial-header
            className="pointer-events-none relative z-20 flex w-full shrink-0 items-center justify-between border-b border-black/10 px-5 py-4 sm:px-8 md:px-12 md:py-5 lg:px-16"
          >
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-black">
              04 / The Dentora Experience
            </p>
            <span className="text-xs text-muted">
              A space to feel at ease
            </span>
          </div>

          {/* ── Expanding architectural image frame ── */}
          <div
            data-experience-frame
            className="relative flex-1 w-full overflow-hidden"
          >
            {/* The photographic asset */}
            <div data-experience-image className="absolute inset-0 size-full">
              <Image
                src="/images/experience/clinic-space.jpg"
                alt="Bright minimalist dental clinic treatment environment with natural daylight, white architectural forms, and subtle blue accents"
                fill
                sizes="100vw"
                quality={85}
                className="object-cover object-center"
              />
            </div>

            {/* Cinematic contrast overlay supporting high-contrast white typography */}
            <div
              data-experience-overlay
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25 opacity-75 md:opacity-70 motion-reduce:opacity-75"
            />

            {/* Editorial storytelling composition */}
            <div
              data-experience-content
              className="relative z-10 flex size-full flex-col justify-end px-5 pb-10 sm:px-8 sm:pb-12 md:px-12 md:pb-16 lg:px-20 lg:pb-24 xl:px-28"
            >
              <div className="max-w-[760px]">
                <p
                  data-experience-eyebrow
                  className="mb-4 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[.14em] text-white/90 sm:mb-5"
                >
                  <span
                    className="size-2 rounded-full bg-brand"
                    aria-hidden="true"
                  />
                  04 / The Dentora Experience
                </p>

                <h2
                  id="experience-heading"
                  data-experience-heading
                  className="text-[clamp(34px,5.8vw,82px)] font-semibold leading-[1.03] tracking-[-.055em] text-white"
                >
                  A space to feel
                  <br />
                  at ease.
                </h2>

                <p
                  data-experience-copy
                  className="mt-5 max-w-[560px] text-base leading-[1.68] text-white/85 sm:mt-6 sm:text-lg"
                >
                  Every detail of the experience matters. From the atmosphere
                  around you to the care you receive, Dentora is designed around
                  a calmer, more considered approach to dentistry.
                </p>

                <p
                  data-experience-disclosure
                  className="mt-6 text-xs leading-relaxed text-white/55 sm:mt-8"
                >
                  Illustrative clinic environment · proposed patient experience,
                  not verified premises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ExperienceMotion>
    </section>
  );
}
