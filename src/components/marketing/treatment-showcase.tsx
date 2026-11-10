"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import type { Service } from "@/types/clinic";

const photography = [
  { src: "/images/treatments/general.jpg", alt: "Dental chair and instruments in a light-filled treatment room", position: "50% 42%" },
  { src: "/images/treatments/cosmetic.jpg", alt: "Dentist discussing tooth shades with a patient", position: "60% 50%" },
  { src: "/images/treatments/restorative.jpg", alt: "Gloved hands holding a dental cast to examine tooth structure", position: "50% 62%" },
];

export function TreatmentShowcase({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const gallery = useRef<HTMLDivElement>(null);
  const previous = useRef(0);

  useEffect(() => {
    // CSS supplies the visible state before hydration and without animation.
    // Each selection owns its tween, so rapid changes cannot leave stale layers.
    const outgoing = previous.current;
    previous.current = active;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const layer = gallery.current?.children[active];
      const oldLayer = gallery.current?.children[outgoing];
      if (outgoing === active) return;
      if (oldLayer) gsap.fromTo(oldLayer, { opacity: 1 }, {
        opacity: 0, duration: 0.5, ease: "power2.out",
      });
      if (layer) gsap.fromTo(layer, { opacity: 0, scale: 1.025 }, {
        opacity: 1, scale: 1, duration: 0.5, ease: "power2.out",
      });
    });
    return () => media.revert();
  }, [active]);

  return (
    <div className="grid gap-7 md:grid-cols-[1.35fr_1fr] md:items-start md:gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-[clamp(48px,6vw,88px)]">
      <div className="min-w-0" aria-label="Treatment categories">
        {services.map((service, index) => (
          <article key={service.id} className="group/treatment border-t border-black/10 py-[18px] last:border-b md:pt-6 md:pb-5 lg:pt-8 lg:pb-6" data-active={active === index}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse" && !event.currentTarget.parentElement?.querySelector(":focus-visible")) setActive(index);
            }}>
            <h3>
              <button type="button" className="grid min-h-12 w-full cursor-pointer grid-cols-[22px_minmax(0,1fr)_36px] items-center gap-2.5 border-0 bg-transparent p-0 text-left text-inherit lg:grid-cols-[28px_minmax(0,1fr)_44px] lg:gap-4" aria-pressed={active === index}
                aria-controls="treatment-preview" onFocus={() => setActive(index)} onClick={() => setActive(index)}>
                <span className="self-start pt-3 text-[11px] font-medium text-muted group-data-[active=true]/treatment:text-brand" aria-hidden="true">0{index + 1}</span>
                <span className="text-[clamp(26px,3.2vw,44px)] leading-[1.08] font-medium tracking-[-.045em] capitalize transition-colors duration-200 group-data-[active=true]/treatment:text-brand motion-reduce:transition-none">{service.name}</span>
                <span className="grid size-9 place-items-center rounded-full border border-border transition-[color,background,transform] duration-200 group-data-[active=true]/treatment:rotate-45 group-data-[active=true]/treatment:border-transparent group-data-[active=true]/treatment:bg-ice group-data-[active=true]/treatment:text-brand motion-reduce:transition-none lg:size-11"><ArrowUpRight size={22} aria-hidden="true" /></span>
              </button>
            </h3>
            <div className="mt-3 pl-8 lg:pl-11">
              <p className="max-w-[365px] text-base leading-relaxed text-muted">{service.description}</p>
              <Link className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold hover:text-brand" href="/services" aria-label={`Learn more about ${service.name}`} onFocus={() => setActive(index)}>
                Learn more <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <figure id="treatment-preview" className="row-start-1 m-0 min-w-0 md:row-start-auto md:pt-7 lg:pt-9" aria-label={`${services[active].name} preview`}>
        <div className="relative isolate aspect-[1.6] overflow-hidden rounded-[var(--radius-panel)] bg-ice md:aspect-[.72] lg:aspect-[.85]" ref={gallery}>
          {photography.map((photo, index) => (
            <div key={photo.src} className="absolute inset-0 opacity-0 data-[active=true]:z-1 data-[active=true]:opacity-100" data-active={active === index} aria-hidden={active !== index}>
              <Image className="object-cover saturate-[.35]" src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 38vw, (min-width: 768px) 40vw, 100vw"
                style={{ objectPosition: photo.position }} />
            </div>
          ))}
          <span className="absolute bottom-5 left-5 z-2 rounded-full bg-white px-3.5 py-2.5 text-[11px] tracking-[.08em] tabular-nums" aria-hidden="true">0{active + 1} / 03</span>
        </div>
        <figcaption className="mt-3 flex justify-between gap-3 text-[10px] text-muted"><span>Illustrative photography</span><span>Not our clinic</span></figcaption>
      </figure>
    </div>
  );
}
