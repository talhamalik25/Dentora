import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "About Dentora — Our Philosophy & Approach",
  description: "Learn about the philosophy and design behind Dentora — a concept built around calm, thoughtful dental care.",
};

const pillars = [
  {
    num: "01",
    title: "Thoughtful Care",
    description: "A calm, patient-focused experience from the very first conversation. We believe comfort and trust precede every clinical decision.",
  },
  {
    num: "02",
    title: "Modern Approach",
    description: "A considered approach to dentistry combining precision, digital clarity, and unhurried consultation shaped around individual needs.",
  },
  {
    num: "03",
    title: "Personal Attention",
    description: "Care shaped around people, not appointments. Meaningful communication and tailored treatment plans designed for long-term health.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" className="bg-white text-ink">
      {/* ── Editorial Hero ── */}
      <section className="border-b border-border bg-ice py-20 md:py-28 lg:py-36">
        <SiteContainer>
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.5px] leading-relaxed text-brand">
            <span className="inline-block h-[1.5px] w-7 bg-brand" aria-hidden="true" />
            Our Philosophy
          </p>

          <h1 className="mt-5 max-w-4xl font-sans text-[clamp(2.4rem,5.5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.035em] text-black">
            Not just dentistry.
            <br />
            <span className="font-medium">
              An art of <span className="text-brand font-medium">better smiles</span>.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-on-ice">
            At Dentora, we believe exceptional dental care begins with understanding people. Our approach brings together thoughtful care, modern techniques, and attention to every detail in an atmosphere designed to put you completely at ease.
          </p>

          <div className="mt-6">
            <span className="inline-block rounded-full bg-white/80 px-4 py-1.5 text-xs text-muted backdrop-blur-sm border border-black/5">
              Brand concept demonstration · not an operating clinic
            </span>
          </div>
        </SiteContainer>
      </section>

      {/* ── Architectural / Environment Spotlight ── */}
      <section className="py-20 md:py-28 lg:py-32">
        <SiteContainer>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-panel)] bg-ice shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                <Image
                  src="/images/difference/clinic-interior.jpg"
                  alt="Minimalist dental treatment room with floor-to-ceiling windows"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-[46%_50%] saturate-[.75]"
                />
              </div>
              <p className="mt-3 text-xs text-muted">
                Illustrative architectural concept · intended patient sanctuary
              </p>
            </div>

            <div className="lg:col-span-6 lg:pl-6">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-brand">
                Atmosphere & Space
              </p>
              <h2 className="mt-4 text-[clamp(28px,3.5vw,44px)] font-semibold leading-[1.1] tracking-[-0.035em] text-black">
                Designed for calm from the ground up.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted">
                Traditional dental settings often evoke apprehension. Dentora reimagines the physical environment with acoustic tranquility, natural daylight, warm minimalist materials, and unhurried consultation spaces.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted">
                Every sensory touchpoint — from gentle lighting to intuitive digital communication — is curated to make your healthcare journey restful and empowering.
              </p>
            </div>
          </div>
        </SiteContainer>
      </section>

      {/* ── The Three Experience Pillars ── */}
      <section className="border-t border-border bg-ice py-20 md:py-28">
        <SiteContainer>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-brand">
              Core Principles
            </p>
            <h2 className="mt-3 text-[clamp(28px,3.8vw,48px)] font-semibold tracking-[-0.035em] text-black">
              The Dentora Difference
            </h2>
            <p className="mt-4 text-base text-on-ice">
              Three guiding tenets that define how we imagine dental health should feel.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.num}
                className="rounded-[var(--radius-card)] border border-black/10 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
              >
                <span className="text-xs font-medium tabular-nums text-brand" aria-hidden="true">
                  {pillar.num}
                </span>
                <h3 className="mt-4 text-xl font-medium tracking-tight text-black">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          {/* ── Action Bar ── */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-[var(--radius-panel)] bg-black p-8 text-white sm:p-10">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">Explore our care concepts</h3>
              <p className="mt-1 text-sm text-white/70">Discover our three focus categories: General, Cosmetic, and Restorative.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition-colors hover:bg-ice"
              >
                Explore Treatments <ArrowUpRight size={16} className="text-brand" />
              </Link>
              <Link
                href="/specialists"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Meet Specialists
              </Link>
            </div>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
