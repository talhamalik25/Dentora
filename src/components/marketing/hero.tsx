import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { demoServices } from "@/features/marketing/services";
import { HeroEntrance } from "./hero-entrance";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black text-white md:min-h-[max(760px,100svh)] lg:justify-center">
      <div aria-hidden="true" className="relative mt-[calc(5rem+1px)] h-[clamp(17.5rem,72vw,20rem)] shrink-0 overflow-hidden md:h-[clamp(22rem,48vw,30rem)] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto lg:-z-30">
        <Image src="/images/heroimage.png" alt="" fill preload sizes="100vw" className="object-cover object-[68%_center] md:object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_42%,rgba(0,0,0,0.38)_68%,#000_100%)] lg:hidden" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-linear-to-t from-black/95 via-black/35 to-black/10 lg:bg-linear-to-r lg:from-black/85 lg:via-black/45 lg:to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-black/60 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-[1536px] px-5 pt-6 pb-10 sm:px-8 md:pt-10 md:pb-12 lg:px-12 lg:pt-44 lg:pb-52 xl:px-16">
        <HeroEntrance>
          <p data-hero-reveal className="mb-4 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white/80 md:mb-6"><span className="h-px w-7 bg-white/60" aria-hidden="true" />Care, thoughtfully considered</p>
          <h1 id="hero-heading" className="max-w-[760px] text-[clamp(34px,9vw,42px)] leading-[1.02] font-medium tracking-[-1.5px] md:max-w-[550px] md:text-[clamp(48px,6.3vw,64px)] md:leading-[1.08] md:tracking-[-2.2px] lg:max-w-[760px] lg:text-[clamp(64px,5.7vw,88px)] lg:tracking-[-3.5px]">
            <span data-hero-reveal className="block">Modern dentistry</span>
            <span data-hero-reveal className="block">with a gentle touch.</span>
          </h1>
          <p data-hero-reveal className="mt-5 max-w-[34ch] text-base leading-7 text-white/80 md:mt-6 md:max-w-[395px]">Experience modern dental care designed around your comfort, confidence, and a healthier smile.</p>
          <div className="mt-7 flex flex-wrap gap-2 md:mt-8 md:gap-3">
            <Link data-hero-reveal href="/book" className="group inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-white px-4 text-[13px] font-semibold text-black! transition-colors hover:bg-ice focus-visible:outline-white motion-reduce:transition-none sm:px-6 sm:gap-5">Book an appointment<ArrowUpRight size={17} className="text-brand transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" /></Link>
            <Link data-hero-reveal href="/services" className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-white/45 bg-black/15 px-4 text-[13px] font-medium text-white! transition-colors hover:bg-white/15 focus-visible:outline-white motion-reduce:transition-none sm:px-6 sm:gap-4">Explore treatments<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </HeroEntrance>
      </div>
      <div className="relative z-10 inset-x-0 bottom-0 mx-auto w-full max-w-[1536px] px-5 pb-7 sm:px-8 md:pb-9 lg:absolute lg:px-12 xl:px-16">
        <div className="flex flex-col gap-4 border-t border-white/20 pt-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0"><p className="mb-3 text-xs uppercase tracking-[0.12em] text-white/65 lg:text-[9px] lg:tracking-[0.18em]"><span className="lg:hidden">Demo imagery · treatments</span><span className="hidden lg:inline">Explore our care · demo services</span></p><ul aria-label="Demonstration treatment categories" tabIndex={0} className="flex max-w-full touch-pan-x gap-2 overflow-x-auto overscroll-x-contain pb-2 focus-visible:outline-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{demoServices.map((service) => <li key={service.id} className="shrink-0 rounded-full border border-white/25 px-4 py-2.5 text-[11px] text-white/85 max-lg:min-h-11 max-lg:px-5 max-lg:text-[13px]">{service.name}</li>)}</ul></div>
          <p className="hidden shrink-0 text-[10px] text-white/65 lg:block">Dentora concept · illustrative imagery</p>
        </div>
      </div>
    </section>
  );
}
