import Link from "next/link";
import { SiteContainer } from "@/components/ui/container";
import { Brand } from "./brand";
import { site } from "@/config/site";

/** Dark editorial footer — inverted with white text on black */
export function Footer() {
  return (
    <footer id="contact" className="bg-black pt-16 pb-7 text-white">
      <SiteContainer>
        {/* Footer grid */}
        <div className="grid gap-10 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <div className="[&_a]:text-white [&_span]:text-white [&_.text-brand]:text-brand">
              <Brand />
            </div>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/70">
              Thoughtful care. A calmer experience.
              <br />
              A little more reason to smile.
            </p>
          </div>

          {/* Navigation column */}
          <div>
            <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[1.5px] text-white/60">
              Explore Dentora
            </h2>
            <nav aria-label="Footer navigation" className="grid gap-3 text-sm">
              {site.navigation.slice(0, 3).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white/70 transition-colors duration-200 hover:text-brand"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/book"
                className="text-white/70 transition-colors duration-200 hover:text-brand"
              >
                Appointment preview
              </Link>
            </nav>
          </div>

          {/* Contact column */}
          <div>
            <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[1.5px] text-white/60">
              Contact · demo information
            </h2>
            <p className="text-sm leading-7 text-white/70">
              {site.demoContact.address}
              <br />
              {site.demoContact.email}
            </p>
            <p className="mt-3 text-xs leading-5 text-white/50">
              Placeholder details. This is not an operating clinic.
            </p>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-[11px] text-white/40 leading-relaxed sm:flex-row sm:justify-between">
          <span>Dentora · A dental care concept</span>
          <span>
            Portfolio demonstration. No appointments or personal data collected.
          </span>
        </div>
      </SiteContainer>
    </footer>
  );
}
