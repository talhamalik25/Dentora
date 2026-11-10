"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ExperienceMotion({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    // ── Desktop (1024px+): Controlled cinematic image expansion with concise pin ──
    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const stage = container.querySelector<HTMLElement>("[data-experience-stage]");
      const frame = container.querySelector<HTMLElement>("[data-experience-frame]");
      const img = container.querySelector<HTMLElement>("[data-experience-image]");
      const overlay = container.querySelector<HTMLElement>("[data-experience-overlay]");
      const initialHeader = container.querySelector<HTMLElement>("[data-experience-initial-header]");
      const eyebrow = container.querySelector<HTMLElement>("[data-experience-eyebrow]");
      const heading = container.querySelector<HTMLElement>("[data-experience-heading]");
      const copy = container.querySelector<HTMLElement>("[data-experience-copy]");
      const disclosure = container.querySelector<HTMLElement>("[data-experience-disclosure]");

      if (!stage || !frame) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=90%",
          pin: stage,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Initial editorial label fades out as image expands
      if (initialHeader) {
        tl.fromTo(
          initialHeader,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -16, duration: 0.2, ease: "power1.out" },
          0
        );
      }

      // 2. Centered framed card smoothly expands to 100% full viewport bleed
      tl.fromTo(
        frame,
        { clipPath: "inset(72px 5% 4% 5% round 20px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.5, ease: "none" },
        0
      );

      // 3. Subtle camera glide
      if (img) {
        tl.fromTo(
          img,
          { scale: 1.08 },
          { scale: 1.0, duration: 0.75, ease: "none" },
          0
        );
      }

      // 4. Contrast overlay deepens promptly to guarantee pristine text contrast
      if (overlay) {
        tl.fromTo(
          overlay,
          { opacity: 0.18 },
          { opacity: 0.88, duration: 0.35, ease: "none" },
          0.05
        );
      }

      // 5. Editorial headline and copy reveal early (settling by ~45% progress)
      const textElements = [eyebrow, heading, copy, disclosure].filter(Boolean);
      if (textElements.length > 0) {
        tl.fromTo(
          textElements,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.28,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.14
        );
      }
    }, container);

    // ── Tablet (768px – 1023px): Proportional expansion ──
    media.add("(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const stage = container.querySelector<HTMLElement>("[data-experience-stage]");
      const frame = container.querySelector<HTMLElement>("[data-experience-frame]");
      const img = container.querySelector<HTMLElement>("[data-experience-image]");
      const overlay = container.querySelector<HTMLElement>("[data-experience-overlay]");
      const initialHeader = container.querySelector<HTMLElement>("[data-experience-initial-header]");
      const eyebrow = container.querySelector<HTMLElement>("[data-experience-eyebrow]");
      const heading = container.querySelector<HTMLElement>("[data-experience-heading]");
      const copy = container.querySelector<HTMLElement>("[data-experience-copy]");
      const disclosure = container.querySelector<HTMLElement>("[data-experience-disclosure]");

      if (!stage || !frame) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=70%",
          pin: stage,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (initialHeader) {
        tl.fromTo(
          initialHeader,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -12, duration: 0.18, ease: "power1.out" },
          0
        );
      }

      tl.fromTo(
        frame,
        { clipPath: "inset(64px 3.5% 3% 3.5% round 16px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.45, ease: "none" },
        0
      );

      if (img) {
        tl.fromTo(img, { scale: 1.05 }, { scale: 1.0, duration: 0.65, ease: "none" }, 0);
      }

      if (overlay) {
        tl.fromTo(overlay, { opacity: 0.2 }, { opacity: 0.85, duration: 0.38, ease: "none" }, 0.05);
      }

      const textElements = [eyebrow, heading, copy, disclosure].filter(Boolean);
      if (textElements.length > 0) {
        tl.fromTo(
          textElements,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" },
          0.16
        );
      }
    }, container);

    // ── Mobile (<768px): Shorter, unpinned reveal — preserves natural touch scrolling ──
    media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const frame = container.querySelector<HTMLElement>("[data-experience-frame]");
      const img = container.querySelector<HTMLElement>("[data-experience-image]");
      const overlay = container.querySelector<HTMLElement>("[data-experience-overlay]");
      const initialHeader = container.querySelector<HTMLElement>("[data-experience-initial-header]");
      const eyebrow = container.querySelector<HTMLElement>("[data-experience-eyebrow]");
      const heading = container.querySelector<HTMLElement>("[data-experience-heading]");
      const copy = container.querySelector<HTMLElement>("[data-experience-copy]");
      const disclosure = container.querySelector<HTMLElement>("[data-experience-disclosure]");

      if (!frame) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 78%",
          end: "center center",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      if (initialHeader) {
        tl.fromTo(
          initialHeader,
          { opacity: 1 },
          { opacity: 0, duration: 0.18, ease: "power1.out" },
          0
        );
      }

      tl.fromTo(
        frame,
        { clipPath: "inset(54px 12px 14px 12px round 14px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.45, ease: "none" },
        0
      );

      if (img) {
        tl.fromTo(img, { scale: 1.04 }, { scale: 1.0, duration: 0.55, ease: "none" }, 0);
      }

      if (overlay) {
        tl.fromTo(overlay, { opacity: 0.25 }, { opacity: 0.85, duration: 0.35, ease: "none" }, 0.05);
      }

      const textElements = [eyebrow, heading, copy, disclosure].filter(Boolean);
      if (textElements.length > 0) {
        tl.fromTo(
          textElements,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.28, stagger: 0.05, ease: "power2.out" },
          0.15
        );
      }
    }, container);

    return () => media.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {children}
    </div>
  );
}
