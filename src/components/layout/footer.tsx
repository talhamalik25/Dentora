import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteContainer } from "@/components/ui/container";
import { FinaleMotion } from "@/components/marketing/finale-motion";
import { Brand } from "./brand";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer id="contact" className="bg-black pt-14 pb-7 text-white md:pt-20">
      <FinaleMotion>
        <SiteContainer>
          <div className="flex flex-col justify-between gap-8 border-b border-white/20 pb-8 md:flex-row md:items-center">
            <div className="[&_a]:text-white"><Brand /></div>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {site.navigation.slice(0, 3).map(item => <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center text-white/75 hover:text-white hover:underline hover:underline-offset-4">{item.label}</Link>)}
              <Link href="/book" className="inline-flex min-h-11 items-center gap-2 text-white hover:underline hover:underline-offset-4">Appointment preview <ArrowUpRight className="size-4 text-brand" aria-hidden="true" /></Link>
            </nav>
          </div>
          <div className="flex flex-col justify-between gap-7 pt-8 md:flex-row">
            <p className="max-w-[340px] text-[clamp(24px,3vw,38px)] leading-[1.1] tracking-[-.035em]">Thoughtful care.<br /><span className="text-white/70">A calmer experience.</span></p>
            <div className="text-sm leading-relaxed text-white/70">
              <p className="mb-3 text-xs uppercase tracking-[.12em]">Contact · demo information</p>
              <p>{site.demoContact.address}<br />{site.demoContact.email}</p>
              <p className="mt-3 max-w-[300px] text-xs">Placeholder details. This is not an operating clinic.</p>
            </div>
          </div>
          <div data-finale-reveal className="mt-16 mb-9 flex items-start justify-between gap-1 text-[clamp(54px,15.5vw,212px)] leading-[.88] font-bold tracking-[-.075em] md:mt-24" aria-label="Dentora">
            <span aria-hidden="true">DENTORA</span><span aria-hidden="true" className="pt-[.12em] text-[.2em] tracking-normal text-brand">®</span>
          </div>
          <div className="flex flex-col justify-between gap-3 border-t border-white/20 pt-6 text-xs leading-relaxed text-white/70 sm:flex-row">
            <span>Dentora · A dental care concept</span>
            <span className="max-w-[380px] sm:text-right">Portfolio demonstration. No appointments or personal data collected.</span>
          </div>
        </SiteContainer>
      </FinaleMotion>
    </footer>
  );
}
