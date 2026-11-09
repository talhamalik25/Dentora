import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { demoServices } from "@/features/marketing/services";
import { HeroEntrance } from "./hero-entrance";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate flex min-h-[max(780px,100svh)] flex-col justify-end overflow-hidden bg-black text-white md:min-h-[max(760px,100svh)] lg:justify-center">
      <Image src="/images/dentora-hero-background.png" alt="" fill preload sizes="(max-width: 1023px) 1700px, 100vw" className="-z-30 object-cover object-[64%_center] md:object-[60%_center] lg:object-center" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-linear-to-t from-black/95 via-black/35 to-black/10 lg:bg-linear-to-r lg:from-black/85 lg:via-black/45 lg:to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-black/60 to-transparent" />
      <div className="mx-auto w-full max-w-[1536px] px-5 pt-[380px] pb-10 sm:px-8 md:pt-80 md:pb-12 lg:px-12 lg:pt-44 lg:pb-52 xl:px-16">
        <HeroEntrance>
          <p data-hero-reveal className="mb-6 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white/80"><span className="h-px w-7 bg-white/60" aria-hidden="true" />Care, thoughtfully considered</p>
          <h1 id="hero-heading" className="max-w-[760px] text-[clamp(38px,10vw,48px)] leading-[1.08] font-medium tracking-[-1.8px] md:text-[64px] md:tracking-[-2.8px] lg:text-[clamp(64px,5.7vw,88px)] lg:tracking-[-3.5px]">
            <span data-hero-reveal className="block">Modern dentistry</span>
            <span data-hero-reveal className="block">with a gentle touch.</span>
          </h1>
          <p data-hero-reveal className="mt-6 max-w-[395px] text-[15px] leading-7 text-white/80 md:text-base">Experience modern dental care designed around your comfort, confidence, and a healthier smile.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link data-hero-reveal href="/book" className="group inline-flex min-h-[52px] items-center justify-center gap-5 rounded-full bg-white px-6 text-[13px] font-semibold text-black! transition-colors hover:bg-ice focus-visible:outline-white motion-reduce:transition-none">Book an appointment<ArrowUpRight size={17} className="text-brand transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" /></Link>
            <Link data-hero-reveal href="/services" className="inline-flex min-h-[52px] items-center justify-center gap-4 rounded-full border border-white/45 bg-black/15 px-6 text-[13px] font-medium text-white! transition-colors hover:bg-white/15 focus-visible:outline-white motion-reduce:transition-none">Explore treatments<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </HeroEntrance>
      </div>
      <div className="inset-x-0 bottom-0 mx-auto w-full max-w-[1536px] px-5 pb-7 sm:px-8 md:pb-9 lg:absolute lg:px-12 xl:px-16">
        <div className="flex flex-col gap-4 border-t border-white/20 pt-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0"><p className="mb-3 text-[9px] uppercase tracking-[0.18em] text-white/65">Explore our care · demo services</p><ul aria-label="Demonstration treatment categories" tabIndex={0} className="flex max-w-full gap-2 overflow-x-auto pb-2 focus-visible:outline-white">{demoServices.map((service) => <li key={service.id} className="shrink-0 rounded-full border border-white/25 px-4 py-2.5 text-[11px] text-white/85">{service.name}</li>)}</ul></div>
          <p className="shrink-0 text-[10px] text-white/65">Dentora concept · illustrative imagery</p>
        </div>
      </div>
    </section>
  );
}

