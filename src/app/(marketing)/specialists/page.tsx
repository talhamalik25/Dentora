import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { demoSpecialists } from "@/features/marketing/specialists";

export const metadata: Metadata = {
  title: "Specialists — Thoughtful Dental Care",
  description: "Meet the dental specialists envisioned for Dentora. Demonstration profiles exploring patient-focused dental care.",
};

export default function SpecialistsPage() {
  return (
    <main id="main-content" className="bg-white text-ink">
      {/* ── Page Header ── */}
      <section className="border-b border-border bg-white py-20 md:py-28 lg:py-32">
        <SiteContainer>
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.5px] leading-relaxed text-brand">
            <span className="inline-block h-[1.5px] w-7 bg-brand" aria-hidden="true" />
            Our Specialists
          </p>

          <h1 className="mt-5 max-w-3xl font-sans text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-black">
            The people behind
            <br />
            <span className="text-brand">every smile.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            Get to know the professionals envisioned to bring care, precision, and unhurried personal attention to every clinical interaction.
          </p>

          {/* Prominent Demo Disclosure per instructions */}
          <div className="mt-8 max-w-2xl rounded-[var(--radius-card)] border border-brand/20 bg-ice p-5 text-xs leading-relaxed text-ink">
            <span className="font-semibold text-brand">DEMO PROFILES</span> — Fictional names and example areas of care. Stock portraits depict models, not Dentora clinical staff. No credentials, certifications, or medical endorsements are implied.
          </div>
        </SiteContainer>
      </section>

      {/* ── Specialist Directory Grid ── */}
      <section className="py-20 md:py-28 bg-white">
        <SiteContainer>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {demoSpecialists.map((specialist, index) => (
              <article
                key={specialist.id}
                className="group flex flex-col overflow-hidden rounded-[var(--radius-panel)] border border-border bg-white transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
              >
                {/* Portrait Frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-ice">
                  <Image
                    src={specialist.portrait}
                    alt={specialist.portraitAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                    style={{
                      transform: `scale(${specialist.crop.scale})`,
                      transformOrigin: specialist.crop.origin,
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold tracking-wider text-black backdrop-blur-sm border border-black/5">
                      0{index + 1} · DEMO
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-7">
                  <div>
                    <h2 className="text-2xl font-medium tracking-tight text-black">
                      {specialist.name}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-brand">
                      {specialist.focus}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {specialist.summary}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-border pt-5">
                    <Link
                      href="/book"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-black transition-colors hover:text-brand"
                    >
                      Book preview with this profile <ArrowUpRight size={14} className="text-brand" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ── Consultation Info Box ── */}
          <div className="mt-20 rounded-[var(--radius-panel)] border border-border bg-ice p-8 sm:p-12">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-black">
                Personalized consultations, shaped around you
              </h2>
              <p className="mt-3 text-base leading-relaxed text-on-ice">
                In our planned booking journey, patients will have the choice to either select a specific dentist by focus area or select &ldquo;Any Available&rdquo; for earliest appointment availability.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/book"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
                >
                  View appointment preview <ArrowUpRight size={16} />
                </Link>
                <Link
                  href="/booking-policies"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-border bg-white px-6 text-sm font-medium text-ink transition-colors hover:bg-ice"
                >
                  Read booking policies
                </Link>
              </div>
            </div>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
