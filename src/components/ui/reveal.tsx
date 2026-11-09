"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before the animation starts */
  delay?: number;
}

/** Intersection-observer reveal animation — respects prefers-reduced-motion */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const media = gsap.matchMedia();
    let observer: IntersectionObserver | undefined;

    media.add("(prefers-reduced-motion: no-preference)", () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              root.current,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                delay,
                ease: "power2.out",
                clearProps: "all",
              },
            );
            observer?.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      observer.observe(root.current!);
      return () => observer?.disconnect();
    }, root);

    return () => {
      observer?.disconnect();
      media.revert();
    };
  }, [delay]);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
