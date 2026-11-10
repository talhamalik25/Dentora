"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function FirstVisitMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add({ reduce: "(prefers-reduced-motion: reduce)", animate: "(prefers-reduced-motion: no-preference)" }, (context) => {
      const steps = Array.from(section.querySelectorAll<HTMLElement>("[data-visit-step]"));
      const markers = steps.map(step => step.querySelector<HTMLElement>("[data-visit-marker]")!);
      const fills = Array.from(section.querySelectorAll<HTMLElement>("[data-visit-fill]"));
      const fillTo = context.conditions?.reduce ? [] : fills.map(fill => {
        gsap.set(fill, { scaleY: 0 });
        return gsap.quickTo(fill, "scaleY", { duration: 0.3, ease: "power1.out" });
      });
      const lastFill = fills.map(() => -1);
      let current = -1;
      const updateActive = () => {
        // Measure the markers, so wrapped copy and viewport changes do not
        // assume equal row heights. Only update the DOM when the step changes.
        let next = 0;
        const threshold = window.innerHeight * 0.55;
        const positions = markers.map(marker => marker.getBoundingClientRect().top);
        positions.forEach((position, index) => {
          if (position <= threshold) next = index;
        });
        // Use live marker positions: the preceding section changes its pin
        // spacing at breakpoints, so cached scroll distances can become stale.
        fillTo.forEach((animate, index) => {
          const progress = gsap.utils.clamp(0, 1, (threshold - positions[index]) / (positions[index + 1] - positions[index]));
          if (Math.abs(progress - lastFill[index]) > 0.001) {
            lastFill[index] = progress;
            animate(progress);
          }
        });
        if (current === next) return;
        current = next;
        steps.forEach((step, index) => { step.dataset.active = String(index === next); });
      };

      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: updateActive, onRefresh: updateActive,
      });
      updateActive();

      if (!context.conditions?.reduce) {
        steps.forEach((step) => {
          gsap.fromTo(step.querySelector("[data-visit-copy]"), { opacity: 0.4, y: 10 }, {
            opacity: 1, y: 0, duration: 0.5, ease: "power2.out", immediateRender: false,
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: step, start: "top 90%", once: true },
          });
        });
      }

      return () => steps.forEach((step, index) => { step.dataset.active = String(index === 0); });
    }, section);

    return () => media.revert();
  }, []);

  return (
    <section ref={root} id="your-visit" aria-labelledby="first-visit-heading" className="bg-white py-20 md:py-24 lg:py-32">
      {children}
    </section>
  );
}
