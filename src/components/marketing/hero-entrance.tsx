"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

export function HeroEntrance({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo("[data-hero-reveal]", { opacity: 0.4, y: 12 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: "power2.out", clearProps: "all",
      });
    }, root);
    return () => media.revert();
  }, []);
  return <div ref={root}>{children}</div>;
}
