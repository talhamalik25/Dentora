"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Server-rendered content remains visible when motion is unavailable. */
export function FinaleMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = root.current!;
      const lines = section.querySelectorAll("[data-finale-line]");
      if (lines.length) {
        gsap.fromTo(lines, { yPercent: 65, opacity: 0.25 }, {
          yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.09, ease: "power3.out", immediateRender: false,
          scrollTrigger: { trigger: lines[0], start: "top 92%", once: true },
        });
        gsap.to(section.querySelector("[data-finale-drift]"), {
          y: -16, ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      }
      section.querySelectorAll("[data-finale-reveal]").forEach(element => {
        gsap.fromTo(element, { y: 16, opacity: 0.4 }, {
          y: 0, opacity: 1, duration: 0.65, ease: "power2.out", immediateRender: false,
          scrollTrigger: { trigger: element, start: "top 95%", once: true },
        });
      });
    }, root);
    return () => media.revert();
  }, []);
  return <div ref={root}>{children}</div>;
}
