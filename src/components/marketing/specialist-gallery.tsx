"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import type { SpecialistProfile } from "@/features/marketing/specialists";

export function SpecialistGallery({ profiles }: { profiles: SpecialistProfile[] }) {
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const active = preview ?? selected;
  const stage = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const previous = useRef(0);

  useEffect(() => {
    const outgoing = previous.current;
    previous.current = active;
    const media = gsap.matchMedia();
    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      if (outgoing === active || !stage.current) return;
      const oldPanel = stage.current.children[outgoing];
      const panel = stage.current.children[active];
      // Reverting this context on every selection cancels stale transitions.
      gsap.fromTo(oldPanel, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.out" });
      gsap.fromTo(panel.querySelector("[data-portrait-mask]"), { clipPath: "inset(0 0 8% 0)" }, {
        clipPath: "inset(0 0 0% 0)", duration: 0.55, ease: "power3.out",
      });
      gsap.fromTo(panel.querySelector("[data-portrait-motion]"), { scale: 1.025 }, {
        scale: 1, duration: 0.55, ease: "power2.out",
      });
      gsap.fromTo(panel.querySelector("[data-portrait-caption]"), { opacity: 0, y: 6 }, {
        opacity: 1, y: 0, duration: 0.35, ease: "power2.out",
      });
    }, stage);
    return () => media.revert();
  }, [active]);

  useEffect(() => {
    const track = stage.current;
    if (!track) return;
    // Native scrolling handles touch and trackpads; only commit when a card is
    // mostly in view. There is no React update for each scroll/pointer pixel.
    const observer = new IntersectionObserver((entries) => {
      if (window.matchMedia("(min-width: 1024px)").matches) return;
      const visible = entries.find(entry => entry.isIntersecting && entry.intersectionRatio > 0.6);
      if (visible) {
        setSelected(Number((visible.target as HTMLElement).dataset.index));
        setPreview(null);
      }
    }, { root: track, threshold: 0.6 });
    Array.from(track.children).forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  function navigate(index: number) {
    const track = stage.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.children[0] as HTMLElement).offsetLeft,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  function navigateNames(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowDown" ? (index + 1) % profiles.length
      : event.key === "ArrowUp" ? (index - 1 + profiles.length) % profiles.length
      : event.key === "Home" ? 0 : event.key === "End" ? profiles.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    list.current?.querySelectorAll("button")[next]?.focus();
  }

  return (
    <div aria-describedby="specialists-disclosure" className="min-w-0 lg:grid lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16 xl:gap-24">
      <div ref={list} className="hidden min-w-0 lg:block"
        onPointerLeave={() => { if (!list.current?.querySelector(":focus-visible")) setPreview(null); }}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPreview(null); }}>
        {profiles.map((profile, index) => (
          <div key={profile.id} data-active={active === index} className="group/person border-t border-black/10 last:border-b">
            <h3>
              <button type="button" aria-pressed={selected === index} aria-controls={`portrait-${profile.id}`}
                onPointerEnter={(event) => { if (event.pointerType === "mouse" && !list.current?.querySelector(":focus-visible")) setPreview(index); }}
                onFocus={() => setPreview(index)}
                onClick={() => { setSelected(index); setPreview(null); }}
                onKeyDown={(event) => navigateNames(event, index)}
                className="grid min-h-32 w-full cursor-pointer grid-cols-[24px_minmax(0,1fr)_44px] items-center gap-4 py-8 text-left focus-visible:rounded-sm xl:gap-6">
                <span aria-hidden="true" className="self-start pt-2 text-xs tabular-nums text-muted group-data-[active=true]/person:text-brand">0{index + 1}</span>
                <span>
                  <span className="block text-[clamp(32px,3.2vw,46px)] leading-[1.1] font-medium tracking-[-.045em] transition-colors duration-200 group-data-[active=true]/person:text-brand motion-reduce:transition-none">{profile.name}</span>
                  <span className="mt-3 block text-sm font-normal text-muted">{profile.focus}</span>
                </span>
                <span className="grid size-11 place-items-center rounded-full border border-border group-data-[active=true]/person:border-transparent group-data-[active=true]/person:bg-ice group-data-[active=true]/person:text-brand"><ArrowUpRight size={20} aria-hidden="true" /></span>
              </button>
            </h3>
          </div>
        ))}
        <p className="mt-6 text-xs leading-relaxed text-muted">Hover to preview. Select a name to keep the portrait in view.</p>
      </div>

      <div className="min-w-0">
        <div ref={stage} id="specialist-portraits" role="region" aria-label="Specialist demo portraits" tabIndex={0}
          onKeyDown={(event) => {
            if (window.matchMedia("(min-width: 1024px)").matches || event.target !== event.currentTarget) return;
            const next = event.key === "ArrowRight" ? Math.min(selected + 1, profiles.length - 1)
              : event.key === "ArrowLeft" ? Math.max(selected - 1, 0) : null;
            if (next !== null) { event.preventDefault(); navigate(next); }
          }}
          className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:thin] lg:grid lg:gap-0 lg:overflow-visible lg:pb-0">
          {profiles.map((profile, index) => (
            <article key={profile.id} id={`portrait-${profile.id}`} data-index={index} data-active={active === index}
              className="w-[88%] shrink-0 snap-start snap-always last:mr-[12%] sm:w-[72%] sm:last:mr-[28%] lg:invisible lg:col-start-1 lg:row-start-1 lg:w-full lg:opacity-0 lg:last:mr-0 lg:data-[active=true]:visible lg:data-[active=true]:z-10 lg:data-[active=true]:opacity-100">
              <div data-portrait-mask className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-panel)] bg-ice">
                <div data-portrait-motion className="absolute inset-0">
                  <Image src={profile.portrait} alt={profile.portraitAlt} fill
                    sizes="(min-width: 1024px) 850px, (min-width: 640px) 850px, 650px"
                    className="object-cover grayscale"
                    style={{ transform: `scale(${profile.crop.scale})`, transformOrigin: profile.crop.origin }} />
                </div>
                {profile.isDemo && <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-2 text-[11px] font-semibold tracking-[.08em]">DEMO PROFILE</span>}
              </div>
              <div data-portrait-caption className="pt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-2xl font-medium tracking-[-.035em]">{profile.name}</h3>
                  <span aria-hidden="true" className="text-xs tabular-nums text-muted">0{index + 1} / 0{profiles.length}</span>
                </div>
                <p className="mt-1 text-sm text-brand">{profile.focus}{profile.isDemo ? " · demo focus" : ""}</p>
                <p className="mt-3 max-w-[380px] text-base leading-relaxed text-muted">{profile.summary}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 lg:hidden">
          <p className="text-xs text-muted">Swipe to explore <span className="ml-2 tabular-nums">{selected + 1} / {profiles.length}</span></p>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous specialist" aria-controls="specialist-portraits" disabled={selected === 0} onClick={() => navigate(selected - 1)} className="grid size-11 cursor-pointer place-items-center rounded-full border border-border hover:bg-ice disabled:cursor-default disabled:opacity-30"><ArrowLeft size={19} aria-hidden="true" /></button>
            <button type="button" aria-label="Next specialist" aria-controls="specialist-portraits" disabled={selected === profiles.length - 1} onClick={() => navigate(selected + 1)} className="grid size-11 cursor-pointer place-items-center rounded-full border border-border hover:bg-ice disabled:cursor-default disabled:opacity-30"><ArrowRight size={19} aria-hidden="true" /></button>
          </div>
        </div>
        <p role="status" className="sr-only">Selected demo profile: {profiles[selected].name}.</p>
      </div>
    </div>
  );
}
