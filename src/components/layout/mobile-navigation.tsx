"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

type NavigationItem = { readonly label: string; readonly href: string | null };

export function MobileNavigation({ activeHref, items }: { activeHref: string | null; items: readonly NavigationItem[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
    };
  }, []);

  function closeAndRestoreFocus() { setOpen(false); toggle.current?.focus(); }

  return (
    <div ref={root} className="lg:hidden"
      onKeyDown={(event) => { if (event.key === "Escape" && open) { event.preventDefault(); closeAndRestoreFocus(); } }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <button ref={toggle} type="button" className="grid size-11 cursor-pointer place-items-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10 motion-reduce:transition-none" aria-expanded={open} aria-controls="dentora-mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((previous) => !previous)}>
        {open ? <X size={19} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={19} strokeWidth={1.5} aria-hidden="true" />}
      </button>
      <div data-open={open} inert={!open} aria-hidden={!open} className="pointer-events-none invisible absolute inset-x-0 top-full max-h-[calc(100dvh-80px)] -translate-y-1 overflow-y-auto overscroll-contain border-b border-white/20 bg-black p-6 text-white opacity-0 transition-[opacity,transform,visibility] duration-200 data-[open=true]:pointer-events-auto data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:opacity-100 motion-reduce:transition-none sm:px-8">
        <nav id="dentora-mobile-navigation" aria-label="Mobile navigation">
          <p className="mb-5 text-[10px] uppercase tracking-[0.2em] text-white/60">Explore Dentora</p>
          {items.map((item) => item.href ? (
            <Link key={item.label} href={item.href} aria-current={activeHref === item.href ? "location" : undefined} onClick={closeAndRestoreFocus} className="flex min-h-16 items-center justify-between gap-4 border-t border-white/15 text-[23px] tracking-tight transition-colors hover:text-ice aria-[current]:underline motion-reduce:transition-none">
              {item.label}<ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          ) : (
            <span key={item.label} aria-disabled="true" className="flex min-h-16 items-center justify-between gap-4 border-t border-white/15 text-[23px] tracking-tight text-white/55">{item.label}<span className="text-[10px] uppercase tracking-wider">Coming soon</span></span>
          ))}
        </nav>
      </div>
    </div>
  );
}
