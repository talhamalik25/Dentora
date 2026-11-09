DENTORA — DESIGN.md
Status: Approved design direction · Version: 1.0 · Project: Dentora, single dental clinic website + appointment booking + staff dashboard
Authority: This document is the visual design contract for every human designer and coding agent working on Dentora.
Scope: Public website, booking experience, and Admin / Receptionist / Dentist workspaces.
Primary goal: Preserve a distinctive premium editorial healthcare aesthetic throughout all phases and prevent the product from gradually becoming a generic template.

0. Read this first — non-negotiable instructions for agents
1. Read this entire file before touching the UI. Read the existing project architecture and product requirements as well. Functional specifications control business logic; this file controls visual and interaction design.
2. Do not redesign the visual identity. Do not substitute a UI-kit theme, another palette, a generic medical template, or an unrelated design trend.
3. Reuse existing approved components and design tokens. If a new component is necessary, build it in the same visual language. Do not invent local colors or inconsistent styles.
4. When implementing one screen, preserve the quality of surrounding screens. Do not simplify the site to a generic card-based dashboard or change the navbar, typography, spacing, or section system without a specific reason.
5. If a requirement is underspecified, propose a solution consistent with this file. Flag any material deviation before implementing it. Never silently change the brand system.
6. No invented trust claims: no fabricated patient ratings, awards, testimonials, accreditations, clinic addresses, clinician credentials, or medical outcomes. Label placeholder imagery/content clearly as demo material.
7. Do not change approved business rules while working on visuals. Scope changes require explicit approval.
8. Treat aesthetics as testable quality: check mobile/tablet/desktop states, interaction states, contrast, and actual page screenshots before claiming a UI task is complete.
The one-sentence art direction
Swiss editorial typography × luxury healthcare calm × restrained futuristic dental imagery. Bold, precise, spacious, confident. Not loud, cluttered, cartoonish, or conventionally corporate.
Visual reference interpretation
The user-provided reference features oversized Helvetica-like typography, a prominent metallic tooth sculpture, minimal pill-outline navigation, white/black contrast and a strong blue accent. Borrow the visual principles, not the reference brand, slogans, layout pixel-for-pixel, assets or identity. Dentora must remain its own brand.
1. Approved visual identity
1.1 Locked four-color brand palette
Token	HEX	Role	Usage guidance
--color-white	#FFFFFF	Primary canvas	Light pages, generous negative space, main text-on-dark inversion
--color-ice-blue	#EAF2FF	Soft supporting canvas	Alternate editorial sections, selected panels, appointment steps, quiet dashboard surfaces
--color-royal-blue	#2563EB	Primary accent	Primary CTAs, active controls, meaningful highlights, links and small emphasis
--color-black	#000000	High-contrast anchor	Oversized headlines, strong text, occasional immersive dark sections


Never return to the earlier electric blue #0071F5 or teal/mint/champagne identity. The four brand colors above are approved. No purple, red, green, orange, gold, or gradients that imply a new brand palette. Neutral opacity variations and functional status colors (success/warning/error) may be used only when semantically needed, not as ornamental brand accents; status colors must be accessible and documented.

Visual allocation is a guide, not a rigid pixel quota: predominantly White (~40%), supporting Ice Blue (~20%), Black/text/dark sections (~20%), Royal Blue/accent surfaces (~20%). Usually less solid Royal Blue is more premium: large blue fills should be reserved for deliberate CTA statements rather than repeated on every section.
1.2 Secondary technical neutrals
The design uses the four brand colors, but readable interface hierarchy also requires neutral values, not new brand hues. Allowed neutrals include:
- Main body text on white: #171717 / Black at full or near-full opacity.
- Secondary text: #525252 on white and #404040 on Ice Blue.
- Subtle border: #E5E7EB.
- Light separator: rgba(0, 0, 0, 0.10).
- Muted text on black: rgba(255, 255, 255, 0.72).
- Shadows: black at very low opacity.
These neutrals are interface utilities, not a fifth accent color. Put all reusable values in tokens; no ad hoc per-component color inventions.
1.3 Background rhythm
- Primary content sections: White.
- Selected alternate/booking sections: Ice Blue.
- One or two intentional Black feature/footer sections for drama.
- Royal Blue full-width CTA: occasional, not repetitive.
- Gradients: optional and minimal; if used, stay within White/Ice Blue/Royal Blue opacity and avoid neon glowing panels.
- Chrome/metallic tooth is a photographic material treatment, not a color token.
2. Typography — the signature element
Font system
- Direction: Helvetica / Helvetica Neue / Neue Haas Grotesk-style Swiss grotesk.
- Use a properly licensed Helvetica-family font only if already available. Otherwise use a high-quality compatible sans-serif fallback (e.g. Arial, Inter, system sans-serif). Never download, bundle, redistribute or assume access to proprietary font files.
- Keep one primary sans family. Avoid pairing with ornamental serif or futuristic sci-fi display fonts.
- Headlines use tight tracking and selected bold weights; body typography remains neutral and highly readable.
Responsive type scale (starting design targets)
Style	Desktop	Mobile	Weight	Line height
Hero display	clamp(3.4rem, 7.3vw, 7.5rem)	Fluid	600–800	0.92–1.02
Editorial section heading	clamp(2.6rem, 5vw, 5.5rem)	Fluid	600–750	1.0–1.1
Section title	clamp(1.8rem, 3vw, 3rem)	Fluid	550–700	1.1–1.2
Card title	1.25–1.65rem	1.1–1.4rem	550–700	1.2
Body	1–1.125rem	1rem	400–500	1.55–1.7
Small UI label	0.75–0.875rem	0.75–0.875rem	500–650	1.25


- Hero headlines: uppercase or deliberately mixed-case, but use a consistent editorial system within a page.
- Hero line lengths: manually composed when necessary, never clipped on narrow screens.
- Avoid 5+ unrelated font sizes in a single section.
- Avoid making every word Royal Blue; emphasize one short phrase or strategically selected word.
- Don't shrink body text just to fit a complex layout.
Example voice (illustrative, not legally approved medical marketing copy):
A NEW LEVEL OF DENTAL CARE.

Modern dentistry. A more confident smile.

3. Layout, spacing and composition
Overall composition
1. Premium editorial grids, intentional whitespace, strong edges and asymmetrical balance.
2. Avoid a uniform 3-card grid repeated in every section. Mix typographic statements, treatment rows, editorial image/text compositions, visual feature sections and restrained cards.
3. Strong alignment matters more than decorative flourishes.
4. Primary desktop content width: max-width: 1360px with generous responsive side gutters.
5. Recommended horizontal gutters: mobile 20–24px, tablet 32–48px, desktop 48–80px (adapt to viewport).
6. Section vertical rhythm: mobile ~`72–104px`; desktop ~`112–176px`, adjusted by content density.
7. Spacing scale based on 4px/8px increments. Favor breathing room over dense content.
8. Borders are thin, usually 1px; avoid thick gray outlines everywhere.
9. Border-radius system: subtle corners for editorial images/panels (12–20px), pills for navigation/chips/buttons; do not round everything to 32px.
10. Use low-opacity shadows only for layering that needs them. Avoid generic floating-card visual noise.
Common failure modes to avoid
- Hero with stock smiling dentist + four generic feature cards + floating reviews.
- All sections use Ice Blue and therefore lose rhythm.
- Glowing blue blobs, excessive blur, glassmorphism or gradients.
- Every section and button competes for attention.
- Headings clipped on mobile, huge blank gaps on tablets, or horizontal overflow.
- Marketing pages look premium but booking/admin suddenly revert to default shadcn-style layouts.
4. Imagery and art direction
Signature hero visual
- Art-directed high-quality 3D chrome/metallic molar sculpture as a signature visual asset.
- Sculptural, realistic material and controlled reflections; no cartoon tooth, clip-art dental icon, or garish 3D effects.
- Place within a deliberate typographic composition, not necessarily centered as a generic product mockup.
- Soft directional lighting and faint Ice Blue bounce. Subtle depth; no intense neon glow.
- Provide an optimized static image fallback for mobile, slow devices and reduced-motion users.
- A source image or 3D model must be appropriately licensed/created. Do not repurpose a competitor's protected visual asset.
Supporting imagery
- Clean architectural clinic interiors, genuine practitioner portraits if available, treatment closeups appropriate for a medical website, natural candid details.
- Real user-supplied/clinic-provided photography is preferred. Demo placeholder visuals must be explicitly labeled where shown as factual clinic material.
- Consistent photography temperature, contrast, cropping, and corner radius.
- Prefer a few excellent large images over many generic stock thumbnails.
- Do not use before/after clinical outcomes without permission, authenticity and appropriate disclosure.
5. Navigation and universal UI
Public navbar
- Minimal, tailored layout with Dentora wordmark, capsule/pill-outline nav items, and one visible Book Appointment CTA.
- Thin lines, precise spacing, excellent baseline alignment; avoid cluttered menus.
- Sticky behavior allowed if elegant and stable; no layout jump. On scroll, use subtle background/border treatment rather than dramatic shrink effects.
- Active route and keyboard focus must be clear.
- Mobile: compact brand + book CTA where space allows + accessible menu button; real tap targets; close on navigation and Escape; no overflow or off-screen controls.
Buttons / interactive controls
Variant	Appearance	Use
Primary	Royal Blue fill, White text	Book appointment, save/confirm, high-priority action
Secondary	White or transparent, Black text, thin border	Explore services, lower-priority actions
Dark	Black fill, White text	Selective dark editorial context
Text/arrow	Minimal text + restrained arrow movement	Editorial links
Destructive	Functional accessible warning treatment	Actual delete/cancel actions only


- Button sizes: min accessible click target approx 44×44px; consistent padding, radius, and alignment.
- Hover: refined color/border change, 1–3px arrow movement or slight transform; no bouncing or prolonged animations.
- Focus-visible state must remain obvious on light and dark backgrounds.
- Disabled and loading states cannot look like functioning buttons.
- Do not use a CTA without a meaningful destination/action.
Forms
- Strong labels above controls; placeholders are not labels.
- Clean thin borders; Royal Blue focus ring; clear inline errors and success confirmations.
- Medical/patient details must be designed for clarity, privacy and low cognitive load.
- Preserve inputs and explain errors if submission fails.
- Use appropriate autocomplete, input type, and keyboard behavior on mobile.
- Respect touch targets and readable text sizes (generally 16px+ on mobile inputs).
6. Public website page-by-page art direction
6.1 Homepage — recommended narrative rhythm
1. Hero: editorial oversized headline, premium 3D chrome tooth, concise value proposition, distinct Book Appointment primary CTA and Explore Services secondary CTA. No fake stats/badges.
2. Clinic introduction: very large text block and a short authentic philosophy; asymmetrical arrangement with generous negative space.
3. Treatments/services: refined horizontal rows or asymmetric modular grid; strong service names and subtle arrow affordances. Show actual booking-eligible services from product data when connected.
4. Why Dentora: grounded clinic strengths only; avoid unverifiable superlatives or fake certifications.
5. Dentists: confident editorial profiles with qualifications and service expertise, only if verified/demo-marked.
6. Clinic experience: immersive high-quality imagery, minimal copy, calm pacing.
7. Booking editorial CTA: a controlled strong Royal Blue or Black section with compelling contrast and one primary action.
8. FAQ / footer: clear, usable and accessible; elegant inverted dark footer is permitted.
Homepage rhythm: content-led editorial sections → visual break → useful information → decisive CTA. Do not make eight almost identical rows/cards.
6.2 Services index / detail
- Strong header with service name, concise description and prominent booking CTA.
- Clear duration, applicable practitioners, and price only if validated and published by the clinic.
- Treatment information should be understandable, accurate and restrained, never clinical overpromising.
- Service cards remain visually consistent with the overall editorial system.
6.3 Dentist listing / profile
- Portrait-led editorial layout, professional titles/qualifications and specialties if verified.
- Clear availability and booking action when supported by the backend.
- Avoid generic social counters, fictional review ratings, and misleading names.
6.4 Contact / about / policies
- Clean copy-first hierarchy; helpful location/contact links and working hours (verified or demo-labeled).
- Policies are readable documents, not decorative tiny text.
- Mobile map embeds are optional; don't overload performance.
7. Booking experience — premium, but clarity first
Booking must look like Dentora, not like a separate boilerplate scheduling widget.
Recommended structure
1. Choose service
2. Choose dentist or Any Available
3. Choose date and an actual available start time
4. Enter patient details
5. Review and confirm
6. Confirmation / manage booking link information
Booking visual rules
- Use a clear step indicator; spacious two-column desktop layout when appropriate, single-column mobile layout.
- Option cards/rows are tidy and selectable with unmistakable selected states.
- Date and time slots must visibly distinguish available, selected, unavailable, loading and expired states.
- Keep a sticky/visible summary only when it does not obscure mobile controls.
- Avoid psychological pressure tricks like fake countdowns, manufactured scarcity or fabricated reviews.
- Show the clinic timezone clearly, especially when the user's device timezone differs.
- Confirmation view must have clear appointment details, useful next steps and no ambiguous success claims before server confirmation.
- Reschedule/cancel surfaces must explain policy and limitations in plain language.
Locked booking rules — do not change in design work
- Single clinic, multiple dentists.
- Instant confirmed booking upon successful reservation.
- Patient may pick a dentist or Any Available.
- Guest booking; no required patient login.
- Slot start interval: 15 minutes.
- Booking horizon: 60 days (clinic-local calendar policy).
- Minimum new-booking notice: 2 hours.
- Patient self-service cancel/reschedule cutoff: 12 hours before appointment start.
- Maximum 2 successful patient-initiated reschedules per appointment.
- Management access via secure appointment-specific link.
- Backend must verify live slot availability and prevent overlapping bookings; UI must not imply a slot is reserved until the server confirms.
- Payments are out of scope for the initial release.
The exact clinic timezone, holidays, service buffers, exception overrides and management-link lifetime are still separate product decisions, not to be improvised by the UI agent.
8. Staff dashboard visual system
Philosophy
Use the same typography, palette, iconography, spacing and interaction language, but shift the balance toward operational calm and legibility. A dentist/receptionist should navigate quickly; do not transplant a giant 3D tooth into every screen.
Dashboard composition
- White main workspace with Ice Blue used for selected groupings and subtle contextual panels.
- Black headings, restrained Royal Blue emphasis, neutral body text.
- Sidebar or adaptive navigation with visible active state and properly grouped items.
- A single clear page title; never repeat “Dashboard” 2–3 times in header/sidebar/content.
- KPIs: compact, meaningful labels and units; cards should have restrained borders and consistent rhythm. Not giant decorative circles unless the metric benefits.
- Charts: accessible and minimal; Royal Blue used selectively, with comparison series visually distinguishable by opacity/pattern/labels. No made-up figures.
- Tables: useful column hierarchy, readable density, consistent status badges, filter/search placement and persistent actions. Avoid horizontal clipping on mobile; use a considered responsive table/list alternative.
- Empty, error, loading and permission-denied states must look finished.
Role-specific workspaces
- Admin: full operational overview, appointments, patients, dentist and service management, schedules, reporting, settings.
- Receptionist: scheduling, check-in, patient coordination and appropriate restricted access.
- Dentist: own appointments/schedule and permitted actions only.
Authorization is a backend responsibility: hiding buttons is not a security boundary.
9. Motion and interaction standards
Motion is an accent, not the product.
Motion	Target
Entry reveal	~350–700 ms, subtle opacity/translate, well-staggered
Button hover	~150–250 ms, crisp easing
Accordion/menu	~180–300 ms, stable layout
Section transitions	Restrained; no scroll-hijacking or mandatory page-loader sequence
Hero tooth	Very subtle parallax/floating only if performant and not distracting


- Use GSAP selectively; use CSS for simpler transitions.
- Honor prefers-reduced-motion and supply a fully functional no-motion experience.
- Avoid animations that delay booking flows or hide critical information.
- Keep motion stable across responsive breakpoints; no excessive transform that causes horizontal overflow.
- Beware animation-on-scroll content becoming invisible if JS fails; provide sensible fallback.
10. Responsive specifications
Mandatory validation widths: 320px, 375px, 430px, 768px, 1024px, 1440px (plus at least one in-between fluid viewport).
Mobile
- No horizontal scrolling caused by the layout.
- Hero headline wraps intentionally and remains visible.
- Tooth artwork never covers primary CTA or important copy.
- Navbar remains usable; no overflowing pills.
- Booking forms stack naturally; slots remain tappable; footer remains readable.
- Inputs have correct mobile keyboard types and adequate spacing.
- Tables adapt to a practical list/card format where needed.
Tablet
- Composition is not an awkward resized desktop screenshot.
- Recalculate asymmetric grids and heading widths deliberately.
- Sidebar/menu transitions are intentional; no trapped or unclickable navigation.
Desktop
- Strong editorial composition; visual assets balance bold text.
- Large whitespace is deliberate rather than accidental.
- No awkwardly stretched paragraphs or overly wide forms.
11. Accessibility, trust and quality
- Aim for WCAG 2.2 AA for normal-sized text and controls.
- Check actual contrast. Royal Blue on White and Black on White are generally suitable, but do not assume Blue text on Ice Blue is always adequate without measuring.
- All controls keyboard-accessible; visible focus rings; correct semantic landmarks/headings.
- Provide meaningful alt text for informative imagery; mark decorative imagery appropriately.
- Respect reduced motion, accessible dialog focus behavior, form error announcements, and touch targets.
- Medical site content must avoid misleading claims and fabricated clinical results.
- Privacy-sensitive patient information must not be shown in decorative demo screenshots without permission; use synthetic data for portfolio/demo.
- Optimize hero images, fonts and animations for loading performance. Prioritize mobile speed and stable layout.
12. Component inventory and consistency requirements
Core reusable design components (build only as needed):
- SiteContainer, SectionShell, SectionHeader, EditorialHeading
- PublicNavbar, MobileMenu, Footer
- PrimaryButton, SecondaryButton, TextArrowLink
- ServiceRow / ServiceCard, DentistProfileCard, ImageFeature
- BookingStepper, ServiceSelector, DentistSelector, DatePicker, TimeSlotGrid, BookingSummary
- FormField, Input, Select, Textarea, ErrorMessage, SuccessState
- DashboardShell, Sidebar, PageHeader, KPIBlock, DataTable, FilterBar, StatusPill, EmptyState, Modal, Toast
Rules:
- Shared tokens first; consistent radii, gaps, shadows, typography and icon sizes.
- Prefer Lucide-style simple line icons; no mix-and-match icon families.
- Components must expose loading/disabled/error/focus/active states as relevant.
- Don't duplicate near-identical navbar, cards or buttons with slight differences for different screens.
13. Example design tokens (reference only; not a request to code now)
:root {
  --color-white: #FFFFFF;
  --color-ice-blue: #EAF2FF;
  --color-royal-blue: #2563EB;
  --color-black: #000000;

  --color-text: #171717;
  --color-text-muted: #525252;
  --color-border: #E5E7EB;

  --radius-panel: 16px;
  --radius-card: 14px;
  --radius-pill: 999px;

  --content-max: 1360px;
  --focus-ring: #2563EB;
}
Use semantic mappings for dark surfaces, interactive text, disabled states and accessible feedback. Do not copy these variables blindly into components if the project already contains equivalent tokens; consolidate instead.
14. Per-page implementation review checklist (mandatory)
An agent must not mark a screen as complete until it checks and reports:
- [ ] Looks unmistakably like Dentora: Helvetica-style editorial typography, four-color palette, clean grid and considered spacing.
- [ ] Does not resemble a generic health/appointment template.
- [ ] Correct header/footer/sidebar variants; no duplicate headings or awkward chrome.
- [ ] Primary and secondary calls to action are clear, functional and visually consistent.
- [ ] Content does not contain fabricated clinic claims, names, reviews or statistics.
- [ ] White / Ice Blue / Black / Royal Blue are used intentionally (not equal blocks everywhere).
- [ ] Responsive at 320/375/430/768/1024/1440 widths; no overflow.
- [ ] Hover, keyboard focus, selected, disabled, loading, error and empty states addressed.
- [ ] Contrast, alt text, keyboard navigation and reduced motion verified.
- [ ] Images and animations are performant and legitimately sourced.
- [ ] Existing approved layouts/components remain consistent.
- [ ] The product/business workflow stays consistent with approved planning docs.
- [ ] Screenshots or actual browser preview inspected; any unverified aspects explicitly stated.
Agent handoff report format
Every UI task ends with:
1. Screens/components changed and files touched.
2. How the result follows DESIGN.md (palette, type, layout, imagery, motion).
3. Responsive QA (which widths were actually tested and issues found).
4. Accessibility and interaction QA (what was actually tested).
5. Unresolved deviations, missing assets or assumptions.
6. Screenshots/preview where available; never claim visual verification without a real preview.
15. Change control
This is the canonical design contract. Future agents may refine implementation details while preserving the visual system. Changing primary color, adding an accent hue, replacing typography direction, changing the signature editorial aesthetic, or redesigning all pages requires explicit owner approval and an update to this file.

When another document conflicts:
1. Security / functional specifications govern safety, permissions, booking behavior and data handling.
2. DESIGN.md governs brand identity, styling, responsive visual behavior and interaction presentation.
3. A local task prompt governs its requested feature only if it does not contradict the above; otherwise flag the conflict before changing it.
North star: If the UI looks visually impressive in one screenshot but falls apart across mobile, booking, admin, accessibility or real content, it is not finished and it is not premium.