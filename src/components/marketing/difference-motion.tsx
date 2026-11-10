"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Motion-only client boundary; the editorial content stays server rendered. */
export function DifferenceMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const lines = section.querySelectorAll("[data-difference-line]");
      const pillars = section.querySelectorAll("[data-difference-pillar]");
      const mask = section.querySelector("[data-difference-mask]");

      // Nothing is hidden by CSS. Immediate rendering is disabled so deep links,
      // failed JS, and scroll restoration never leave an empty section.
      gsap.fromTo(lines, { yPercent: 30, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.09,
        ease: "power2.out", immediateRender: false, clearProps: "transform,opacity",
        scrollTrigger: { trigger: section.querySelector("h2"), start: "top 92%", once: true },
      });
      gsap.fromTo(pillars, { y: 14, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.55, stagger: 0.1,
        ease: "power2.out", immediateRender: false, clearProps: "transform,opacity",
        scrollTrigger: { trigger: section.querySelector("[data-difference-pillars]"), start: "top 92%", once: true },
      });
      gsap.fromTo(mask, { clipPath: "inset(0% 0% 8% 0%)", opacity: 0.65 }, {
        clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.8,
        ease: "power2.out", immediateRender: false, clearProps: "clipPath,opacity",
        scrollTrigger: { trigger: mask, start: "top 92%", once: true },
      });
    }, section);

    // Reserve 20px of image overscan; the 24px travel never exposes an edge.
    // No parallax on small screens and no pinning or scroll interception.
    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(section.querySelector("[data-difference-parallax]"), { y: -12 }, {
        y: 12, ease: "none",
        scrollTrigger: {
          trigger: section.querySelector("[data-difference-mask]"),
          start: "top bottom", end: "bottom top", scrub: 0.6,
        },
      });
    }, section);

    return () => media.revert();
  }, []);

  return (
    <section ref={root} id="approach" aria-labelledby="difference-heading" className="bg-ice py-20 text-black md:py-24 lg:py-32">
      {children}
    </section>
  );
}
