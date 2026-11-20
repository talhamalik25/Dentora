import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { demoServices } from "@/features/marketing/services";
import { clinicConfig } from "@/config/clinic.config";

export const metadata: Metadata = {
  title: "Treatments & Dental Care Services — Dentora",
  description: "Explore our range of treatments, from preventive hygiene to cosmetic and restorative dentistry.",
};

const serviceImages: Record<string, { src: string; alt: string }> = {
  general: {
    src: "/images/treatments/general.jpg",
    alt: "Dental chair and clinical instruments in daylight",
  },
  cosmetic: {
    src: "/images/treatments/cosmetic.jpg",
    alt: "Dentist discussing tooth shade guides with patient",
  },
  restorative: {
    src: "/images/treatments/restorative.jpg",
    alt: "Dental cast model held in clinical gloved hands",
  },
};

export default function ServicesPage() {
  return (
    <main id="main-content" className="bg-white text-ink">
      {/* ── Page Header ── */}
      <section className="border-b border-border bg-ice py-20 md:py-28 lg:py-32">
        <SiteContainer>
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.5px] leading-relaxed text-brand">
            <span className="inline-block h-[1.5px] w-7 bg-brand" aria-hidden="true" />
            Demonstration services
          </p>

          <h1 className="mt-5 max-w-3xl font-sans text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-black">
            Care, considered.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-on-ice">
            An illustrative introduction to the care categories envisioned for {clinicConfig.identity.name}. Treatments, clinical suitability, and procedures are customized for each patient during dedicated consultations.
          </p>

          <div className="mt-8 max-w-2xl rounded-[var(--radius-card)] border border-brand/20 bg-white p-5 text-xs leading-relaxed text-ink shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="font-semibold text-brand">DEMONSTRATION CONTENT</span> — Services and durations shown are illustrative concepts for design presentation. Real treatment options will be verified by a licensed dental practitioner.
          </div>
        </SiteContainer>
      </section>

      {/* ── Services Directory ── */}
      <section className="py-20 md:py-28 bg-white">
        <SiteContainer>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {demoServices.map((service, index) => {
              const image = serviceImages[service.id];
              return (
                <article
                  key={service.id}
                  className="group flex flex-col overflow-hidden rounded-[var(--radius-panel)] border border-border bg-white transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
                >
                  {/* Image Frame */}
                  {image && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-ice">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover saturate-[.85] transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold tracking-wider text-black backdrop-blur-sm border border-black/5">
                          0{index + 1}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Body */}
                  <div className="flex flex-1 flex-col justify-between p-7">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-brand">
                        <Clock size={14} aria-hidden="true" />
                        <span>Approx. {service.durationMinutes} minutes</span>
                      </div>

                      <h2 className="mt-3 text-2xl font-bold tracking-tight text-black">
                        {service.name}
                      </h2>

                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-8 border-t border-border pt-5">
                      <span className="block text-xs text-muted mb-4">
                        Concept preview · not currently bookable
                      </span>
                      <Link
                        href="/book"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-black transition-colors hover:text-brand"
                      >
                        Plan this treatment <ArrowUpRight size={14} className="text-brand" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-[var(--radius-panel)] bg-ice p-8 sm:p-10">
            <div>
              <h2 className="text-xl font-semibold text-black">Ready to explore appointment planning?</h2>
              <p className="mt-1 text-sm text-on-ice">View our appointment preview and review planned scheduling guidelines.</p>
            </div>
            <ButtonLink href="/book">View appointment preview ↗</ButtonLink>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
