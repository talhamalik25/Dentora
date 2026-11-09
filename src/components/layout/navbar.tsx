"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { MobileNavigation } from "./mobile-navigation";

export const marketingNavigation = [
  { label: "Treatments", href: "/services" },
  { label: "Specialists", href: null },
  { label: "Studio / About", href: "/#approach" },
  { label: "Journal", href: null },
  { label: "Contact", href: "/#contact" },
] as const;

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

export function Navbar() {
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash, () => "");
  const activeHref = pathname === "/" ? `/${hash}` : pathname;
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(header.current, { opacity: 0.5 }, { opacity: 1, duration: 0.65, clearProps: "opacity" });
    });
    return () => media.revert();
  }, []);

  return (
    <header ref={header} className={`${pathname === "/" ? "absolute inset-x-0 top-0 bg-black/15" : "sticky fixed top-0 bg-black"} z-50 border-b border-white/15 text-white backdrop-blur-sm [&_a:focus-visible]:outline-white [&_button:focus-visible]:outline-white`}>
      <div className="mx-auto flex h-20 max-w-[1536px] items-center justify-between gap-2 px-5 sm:px-8 lg:h-24 lg:px-12 xl:px-16">
        <Link href="/" className="inline-flex min-h-11 shrink-0 items-center" aria-label="Dentora home">
          <Image src="/images/dentora-navbar-logo.png" alt="" width={900} height={240} sizes="(max-width: 359px) 96px, (max-width: 767px) 30vw, (max-width: 1023px) 136px, 176px" className="h-auto w-[clamp(96px,30vw,136px)] lg:w-[176px]" />
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-5 lg:flex xl:gap-8">
          {marketingNavigation.map((item) => item.href ? (
            <Link key={item.label} href={item.href} aria-current={activeHref === item.href ? "page" : undefined} className="inline-flex min-h-11 items-center border-b border-transparent text-[13px] transition-colors hover:border-white/70 aria-[current]:border-white motion-reduce:transition-none">{item.label}</Link>
          ) : (
            <span key={item.label} aria-disabled="true" className="text-[13px] text-white/65">{item.label}<span className="ml-1.5 text-[9px] uppercase tracking-wider">Soon</span></span>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/book" className="group inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-white px-3 min-[360px]:px-4 text-[12px] font-semibold text-black! transition-colors hover:bg-ice sm:px-6 sm:text-[13px] motion-reduce:transition-none">
            Book a Visit <ArrowUpRight size={16} className="hidden min-[360px]:block text-brand transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
          </Link>
          <MobileNavigation activeHref={activeHref} items={marketingNavigation} />
        </div>
      </div>
    </header>
  );
}
