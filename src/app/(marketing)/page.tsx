import { Hero } from "@/components/marketing/hero";
import {
  ArrowUpRight,
  Stethoscope,
  Sparkles,
  ScanLine,
} from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { demoServices } from "@/features/marketing/services";

const serviceIcons = [Stethoscope, Sparkles, ScanLine];

export default function Home() {
  return (
    <main id="main-content">
      <Hero />

      {/* ── Values Strip ─────────────────────────────── */}
      <section className="border-y border-border bg-ice">
        <SiteContainer className="grid gap-6 py-10 sm:grid-cols-3 md:py-12">
          {[
            ["Modern approach", "Considered, contemporary dental care."],
            ["Patient comfort", "Every visit shaped around you."],
            ["Lasting results", "Care you can trust over time."],
          ].map(([title, text]) => (
            <div
              key={title}
              className="flex items-center gap-4 max-sm:justify-start sm:justify-center sm:border-l sm:border-border sm:first:border-l-0"
            >
              <div>
                <h2 className="text-[13px] font-semibold text-black">
                  {title}
                </h2>
                <p className="mt-1 text-[11px] text-muted">{text}</p>
              </div>
            </div>
          ))}
        </SiteContainer>
      </section>

      {/* ── Services ─────────────────────────────────── */}
      <section id="services" className="py-20 md:py-28 lg:py-36">
        <SiteContainer>
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="What we offer"
                description="Explore our range of treatments, from preventive care to cosmetic and restorative dentistry."
              >
                Treatments designed
                <br />
                around you.
              </SectionHeading>
              <p className="text-[11px] text-muted leading-relaxed">
                Demonstration services · not currently bookable
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demoServices.map((service, i) => {
              const Icon = serviceIcons[i];
              return (
                <Reveal key={service.id} delay={i * 0.08}>
                  <article className="group rounded-[14px] border border-border bg-white p-8 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] lg:p-9">
                    <span className="text-sm font-medium text-muted">
                      0{i + 1}
                    </span>
                    <div className="mt-5 flex items-center gap-3">
                      <Icon
                        size={22}
                        className="text-brand"
                        aria-hidden="true"
                      />
                      <h3 className="text-[1.3rem] font-bold tracking-tight text-black">
                        {service.name}
                      </h3>
                    </div>
                    <p className="mt-4 text-[13px] leading-7 text-muted">
                      {service.description}
                    </p>
                    <ButtonLink
                      href={`/services`}
                      variant="secondary"
                      className="mt-6 border-0 px-0 text-xs hover:bg-transparent hover:text-brand"
                    >
                      Learn more{" "}
                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </ButtonLink>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </SiteContainer>
      </section>

      {/* ── Approach ─────────────────────────────────── */}
      <section id="approach" className="bg-ice py-16 md:py-20 lg:py-24">
        <SiteContainer className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center rounded-[160px_160px_16px_16px] border border-border bg-white px-8 py-12 text-center lg:min-h-[380px]">
              <Sparkles size={36} className="text-brand" aria-hidden="true" />
              <p className="mt-5 text-[2rem] font-bold leading-tight tracking-tight text-black md:text-[2.2rem]">
                Dentistry with{" "}
                <span className="text-brand">understanding.</span>
              </p>
              <span className="mt-6 text-[8px] font-semibold uppercase tracking-[2px] text-muted">
                THE DENTORA PHILOSOPHY
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionHeading
              eyebrow="A different feeling"
              description="A dental visit should feel clear, considered, and personal. Our concept puts the conversation first, making space to understand what matters to you."
            >
              More human.
              <br />
              Less clinical.
            </SectionHeading>

            <ul className="mt-7 list-none space-y-0 p-0">
              {[
                "Time to listen, without the rush",
                "Clear explanations, shared decisions",
                "Comfort considered at every step",
              ].map((item, i) => (
                <li
                  key={item}
                  className="border-b border-border py-3.5 text-[13px] text-ink"
                >
                  <span className="mr-5 text-[10px] font-semibold text-brand">
                    0{i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              These are design principles for our demo clinic, not verified
              clinical claims.
            </p>
          </Reveal>
        </SiteContainer>
      </section>

      {/* ── Your Visit ───────────────────────────────── */}
      <section id="your-visit" className="py-20 md:py-28 lg:py-36">
        <SiteContainer>
          <Reveal>
            <SectionHeading eyebrow="Your first visit">
              A simple start to better care.
            </SectionHeading>

            <div className="mt-10 grid gap-10 sm:grid-cols-3 lg:gap-12">
              {[
                [
                  "Let's get acquainted",
                  "Share your questions and what you would like from your care.",
                ],
                [
                  "Understand your options",
                  "Talk through an assessment and possible next steps with a dentist.",
                ],
                [
                  "Make a plan together",
                  "Choose a path that considers your needs, comfort, and priorities.",
                ],
              ].map(([title, text], i) => (
                <article
                  key={title}
                  className="border-b border-border pb-6 sm:border-b-0 sm:pb-0"
                >
                  <span className="text-[28px] font-bold text-brand">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 text-[1.35rem] font-bold tracking-tight text-black">
                    {title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-7 text-muted">
                    {text}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-[11px] text-muted leading-relaxed">
              Example patient journey. Actual clinical processes will be
              confirmed before launch.
            </p>
          </Reveal>
        </SiteContainer>
      </section>

      {/* ── CTA Panel ────────────────────────────────── */}
      <section className="pb-20">
        <SiteContainer>
          <div className="flex flex-col items-start justify-between gap-8 rounded-[16px] bg-black p-9 text-white md:flex-row md:items-center md:gap-12 md:p-14">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[2.5px] text-brand">
                Your next chapter
              </p>
              <h2 className="mt-4 text-[clamp(1.6rem,3vw,2.5rem)] font-bold leading-tight tracking-tight">
                A little more confidence.
                <br />
                A lot more you.
              </h2>
              <p className="mt-4 text-xs leading-relaxed text-white/70">
                Explore the beginning of a more thoughtful dental experience.
              </p>
            </div>
            <div className="shrink-0">
              <ButtonLink href="/book">
                Plan your visit{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </ButtonLink>
              <p className="mt-3 text-center text-[10px] text-white/50">
                Booking preview · coming soon
              </p>
            </div>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
