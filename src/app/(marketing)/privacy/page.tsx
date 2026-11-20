import type { Metadata } from "next";
import Link from "next/link";
import { SiteContainer } from "@/components/ui/container";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy — Dentora",
  description: "Privacy policy and data protection principles for Dentora. Demonstration website disclosure.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="bg-white text-ink">
      {/* ── Header ── */}
      <section className="border-b border-border bg-ice py-20 md:py-28 lg:py-32">
        <SiteContainer>
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.5px] leading-relaxed text-brand">
            <span className="inline-block h-[1.5px] w-7 bg-brand" aria-hidden="true" />
            Legal & Data Ethics
          </p>

          <h1 className="mt-5 max-w-3xl font-sans text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-black">
            Privacy policy.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-on-ice">
            Transparency, patient dignity, and uncompromising data protection are foundational to our healthcare design philosophy.
          </p>

          <div className="mt-8 max-w-2xl rounded-[var(--radius-card)] border border-brand/20 bg-white p-5 text-xs leading-relaxed text-ink shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="font-semibold text-brand">PORTFOLIO DEMONSTRATION NOTICE</span> — This website is published strictly as a product and architectural demonstration. No personal, financial, or protected health information (PHI) is collected, stored, or transmitted through this website.
          </div>
        </SiteContainer>
      </section>

      {/* ── Policy Articles ── */}
      <section className="py-20 md:py-28 bg-white">
        <SiteContainer className="max-w-4xl">
          <div className="space-y-12 text-base leading-relaxed text-muted">
            <article>
              <h2 className="text-2xl font-semibold tracking-tight text-black">
                1. Scope of Demonstration
              </h2>
              <p className="mt-4">
                Dentora is an interactive prototype demonstrating the design, layout, and user experience of a modern dental clinic platform. Forms and interactive controls on this demonstration site are rendered for design evaluation and interface testing only.
              </p>
            </article>

            <article>
              <h2 className="text-2xl font-semibold tracking-tight text-black">
                2. Information We Do Not Collect
              </h2>
              <p className="mt-4">
                Because this is an evaluation environment:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>We do not record your personal contact information (names, email addresses, telephone numbers).</li>
                <li>We do not record medical, dental, or radiographic health records.</li>
                <li>We do not collect credit card, banking, or payment credentials.</li>
                <li>Any data submitted to mock fields is processed in-memory or discarded immediately.</li>
              </ul>
            </article>

            <article>
              <h2 className="text-2xl font-semibold tracking-tight text-black">
                3. Cookies and Local Storage
              </h2>
              <p className="mt-4">
                This preview does not deploy tracking pixels, third-party advertising cookies, or cross-site profiling trackers. Any browser storage utilized is strictly technical (e.g., preserving local animation preferences or theme states).
              </p>
            </article>

            <article>
              <h2 className="text-2xl font-semibold tracking-tight text-black">
                4. Production Architecture Commitment
              </h2>
              <p className="mt-4">
                When Dentora transitions from demonstration to production clinic operations, the platform will adhere to applicable global healthcare regulations, including GDPR, HIPAA data safeguard standards, end-to-end encryption for electronic health records, and strict role-based access control for clinic personnel.
              </p>
            </article>

            <article>
              <h2 className="text-2xl font-semibold tracking-tight text-black">
                5. Inquiries
              </h2>
              <p className="mt-4">
                For questions regarding this demonstration platform or design architecture, please contact our team at{" "}
                <a href={`mailto:${site.demoContact.email}`} className="text-brand hover:underline">
                  {site.demoContact.email}
                </a>.
              </p>
            </article>
          </div>

          <div className="mt-16 border-t border-border pt-8">
            <Link
              href="/"
              className="text-sm font-semibold text-black hover:text-brand"
            >
              ← Back to homepage
            </Link>
          </div>
        </SiteContainer>
      </section>
    </main>
  );
}
