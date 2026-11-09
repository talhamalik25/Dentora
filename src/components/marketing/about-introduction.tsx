"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SiteContainer } from "@/components/ui/container";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Dynamically load the WebGL Three.js canvas on client only
const AboutMolarCanvas = dynamic(
  () => import("./about-molar-canvas"),
  {
    ssr: false,
    loading: () => <StaticMolarFallback />,
  }
);

function StaticMolarFallback() {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center select-none"
      aria-hidden="true"
    >
      <div className="relative aspect-square w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[500px]">
        <Image
          src="/images/molar-fallback.png"
          alt="Dentora metallic molar sculpture"
          fill
          sizes="(max-width: 640px) 340px, (max-width: 1024px) 440px, 500px"
          className="object-contain drop-shadow-[0_20px_35px_rgba(37,99,235,0.12)]"
          priority
        />
      </div>
    </div>
  );
}

export function AboutIntroduction() {
  const sectionRef = useRef<HTMLElement>(null);
  const sculptureWrapperRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Editorial Label & Divider Reveal
        gsap.fromTo(
          "[data-about-label]",
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          }
        );

        // 2. Headline Reveal with staggered lines
        gsap.fromTo(
          "[data-about-heading-line]",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 74%",
              once: true,
            },
          }
        );

        // 3. Supporting copy & CTA fade-up
        gsap.fromTo(
          "[data-about-copy]",
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          "[data-about-cta]",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: 0.32,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 68%",
              once: true,
            },
          }
        );

        // 4. Subtle 3D Sculpture Scroll Parallax
        if (sculptureWrapperRef.current) {
          gsap.fromTo(
            sculptureWrapperRef.current,
            { y: 30, opacity: 0.85 },
            {
              y: -30,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
                onUpdate: (self) => {
                  setScrollProgress(self.progress);
                },
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-intro-heading"
      className="relative isolate overflow-hidden bg-ice py-20 sm:py-24 md:py-28 lg:py-36 xl:py-40 border-b border-border transition-colors"
    >
      {/* Soft ambient background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-brand/5 blur-3xl"
      />

      <SiteContainer>
        {/*
          Single-canvas layout:
          On mobile (single-column flex):
            Order 1: Editorial Label + Divider + Headline
            Order 2: 3D Sculpture
            Order 3: Supporting Copy + CTA
          On desktop (CSS Grid lg:grid-cols-12):
            Cols 1-7, Row 1: Label + Divider + Headline
            Cols 8-12, Rows 1-2: 3D Dental Sculpture
            Cols 1-7, Row 2: Supporting Copy + CTA
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-12 xl:gap-x-16">
          {/* Header Block (Label, Divider, Headline) */}
          <div className="order-1 lg:col-span-7 lg:col-start-1 lg:row-start-1">
            {/* Small Editorial Label */}
            <div
              data-about-label
              className="flex items-center gap-3.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-brand"
            >
              <span className="h-px w-7 bg-brand/50" aria-hidden="true" />
              01 / OUR PHILOSOPHY
            </div>

            {/* Thin Horizontal Divider */}
            <div
              data-about-label
              className="mt-4 mb-7 h-px w-full max-w-[560px] bg-black/10 sm:mt-5 sm:mb-8"
              aria-hidden="true"
            />

            {/* Oversized Headline */}
            <h2
              id="about-intro-heading"
              className="text-[clamp(2.4rem,5.4vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.035em] text-black"
            >
              <span data-about-heading-line className="block">
                Not just dentistry.
              </span>
              <span data-about-heading-line className="block font-medium">
                An art of{" "}
                <span className="text-brand font-medium">better smiles</span>.
              </span>
            </h2>
          </div>

          {/* 3D Dental Sculpture (Order 2 on mobile, Right column on desktop) */}
          <div
            ref={sculptureWrapperRef}
            className="order-2 mt-8 mb-6 flex h-[340px] sm:h-[400px] w-full items-center justify-center lg:order-none lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:my-0 lg:h-[520px] xl:h-[580px]"
          >
            <div className="relative flex h-full w-full max-w-[420px] lg:max-w-none items-center justify-center">
              {/* Subtle radial aura behind sculpture */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-radial from-brand/10 via-transparent to-transparent opacity-80 blur-2xl"
              />
              <AboutMolarCanvas scrollProgress={scrollProgress} />
            </div>
          </div>

          {/* Supporting Copy & CTA (Order 3 on mobile, below headline on desktop) */}
          <div className="order-3 lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:mt-6">
            <p
              data-about-copy
              className="max-w-[560px] text-[15px] sm:text-base md:text-[17px] lg:text-[18px] leading-[1.68] text-on-ice"
            >
              At Dentora, we believe exceptional dental care begins with
              understanding people. Our approach brings together thoughtful
              care, modern techniques, and attention to every detail.
            </p>

            <p
              data-about-copy
              className="mt-3 text-[11px] text-muted tracking-wide"
            >
              Brand philosophy concept · not a clinical representation
            </p>

            {/* CTA Button */}
            <div
              data-about-cta
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/services"
                className="group inline-flex min-h-[50px] items-center justify-center gap-3 rounded-full bg-black px-7 text-[13px] font-semibold text-white! transition-colors duration-200 hover:bg-brand focus-visible:outline-brand motion-reduce:transition-none"
              >
                Discover Dentora
                <ArrowUpRight
                  size={16}
                  className="text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
