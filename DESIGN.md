
# DENTORA — DESIGN.md

**Version:** 2.0  
**Status:** Approved Design System  
**Project:** Dentora — Premium Dental Clinic Platform  
**Framework:** Next.js App Router + TypeScript  
**Styling:** Tailwind CSS  
**Animations:** GSAP + ScrollTrigger  
**3D:** Three.js / React Three Fiber  

---

# 0. DESIGN AUTHORITY

This document is the mandatory visual and interaction design contract for every AI coding agent, designer, and developer working on Dentora.

Dentora is a premium dental clinic platform consisting of:

1. Public marketing website
2. Online appointment booking
3. Admin dashboard
4. Receptionist workspace
5. Dentist workspace

All interfaces must share one consistent visual identity.

## Non-Negotiable Rules

1. Read this entire document before modifying the UI.
2. Preserve all previously approved designs and components.
3. Never redesign unrelated sections.
4. Use Tailwind CSS as the primary styling system.
5. Use GSAP for advanced animation and Three.js for meaningful 3D experiences.
6. Do not introduce new brand colors.
7. Do not replace custom premium components with generic UI templates.
8. Do not modify backend business logic during UI tasks.
9. Never create Git branches, commits, or pushes unless explicitly requested.
10. Always verify desktop and mobile responsiveness.

**Design philosophy:**

Swiss Editorial Typography × Luxury Healthcare × Futuristic Minimalism × Purposeful Interaction.

Dentora must feel like a premium custom-built digital experience, not a generic dental clinic template.

---

# 1. BRAND IDENTITY

## 1.1 Approved Color Palette

Only four primary brand colors are approved.

| Color | HEX | Purpose |
|---|---|---|
| Royal Blue | `#2563EB` | Primary CTAs, active states, selective accents |
| Ice Blue | `#EAF2FF` | Alternate sections, subtle backgrounds |
| White | `#FFFFFF` | Primary backgrounds and negative space |
| Black | `#000000` | Typography, contrast sections and dark surfaces |

### Recommended Visual Distribution

- White: approximately 40%
- Ice Blue: approximately 20%
- Black: approximately 20%
- Royal Blue: approximately 20%

These percentages are visual guidelines, not strict quotas.

Use Royal Blue selectively. Too much blue will make the website look generic.

## 1.2 Allowed Technical Neutrals

The following neutrals are permitted:

- Main body text: `#171717`
- Secondary text: `#525252`
- Subtle border: `#E5E7EB`
- Separators: `rgba(0,0,0,0.10)`
- Dark-background secondary text: `rgba(255,255,255,0.72)`

Functional error, warning, and success colors may be used when semantically required.

Do not use additional decorative brand colors.

## 1.3 Background Usage

White is the dominant background.

Ice Blue should appear in selected sections to create visual rhythm.

Black should be reserved for high-impact sections, immersive photographic heroes, or the footer.

Royal Blue full-width sections should be used sparingly for important CTAs.

Avoid:
- Excessive gradients
- Neon glows
- Generic blue blobs
- Unnecessary glassmorphism
- Bright decorative colors

---

# 2. TAILWIND CSS — MANDATORY STYLING STANDARD

Tailwind CSS is the primary styling system for Dentora.

All new UI components must use Tailwind utility classes for ordinary styling.

## 2.1 Tailwind Responsibilities

Use Tailwind for:

- Layouts
- Flexbox and Grid
- Spacing
- Typography
- Backgrounds
- Colors
- Borders
- Border radius
- Responsiveness
- Hover states
- Focus states
- Transitions
- Component positioning
- Standard shadows

## 2.2 Custom CSS Exceptions

Custom CSS is allowed for:

- Advanced GSAP animation effects
- Three.js canvas-specific presentation
- Complex masks and clipping effects
- Specialized visual treatments
- Browser-specific fixes
- Global design tokens and base styles

Do not create large CSS files for basic layouts that Tailwind can handle.

## 2.3 Existing Components

Do not rewrite approved components simply because they currently use CSS Modules or custom CSS.

Existing approved sections should only be migrated when:

1. There is a demonstrated maintainability problem.
2. Migration does not alter visual appearance.
3. The owner explicitly approves the migration.

Visual quality and functionality take priority over unnecessary refactoring.

## 2.4 Tailwind Version Compatibility

Inspect the installed Tailwind version before modifying configuration.

For Tailwind CSS v4, use its CSS-first configuration and theme token conventions.

Do not introduce an unnecessary `tailwind.config.js` simply because an older tutorial uses one.

For Tailwind CSS v3, maintain the project's existing configuration conventions.

Never mix incompatible v3 and v4 approaches.

## 2.5 Design Tokens

Centralize brand tokens.

Suggested Tailwind v4 example:

```css
@import "tailwindcss";

@theme {
  --color-brand-blue: #2563EB;
  --color-brand-ice: #EAF2FF;
  --color-brand-white: #FFFFFF;
  --color-brand-black: #000000;

  --color-text-primary: #171717;
  --color-text-secondary: #525252;
  --color-border-subtle: #E5E7EB;

  --radius-panel: 1rem;
  --radius-card: 0.875rem;
}
```

This is a reference only.

Inspect existing tokens and consolidate them rather than creating duplicates.

## 2.6 Preferred Implementation Example

```tsx
<section className="bg-brand-ice px-5 py-24 md:px-12 lg:py-36">
  <div className="mx-auto max-w-[1360px]">
    <h2 className="max-w-4xl text-5xl font-semibold tracking-tight text-brand-black md:text-7xl">
      Dentistry, reimagined.
    </h2>
  </div>
</section>
```

Avoid scattered hardcoded hex values inside components when shared tokens are available.

---

# 3. TYPOGRAPHY SYSTEM

Typography is one of Dentora's strongest visual characteristics.

## 3.1 Font Direction

Use Helvetica-inspired Swiss grotesk typography.

Preferred styles:

- Helvetica Neue
- Neue Haas Grotesk
- Inter
- Arial
- High-quality system sans-serif fallback

Use proprietary fonts only when properly licensed.

Maintain one consistent primary font family.

Avoid:
- Decorative serif fonts
- Futuristic gaming fonts
- Random font combinations
- Excessive font weights

## 3.2 Typography Scale

| Element | Desktop target | Mobile target |
|---|---|---|
| Hero heading | 64–112px | 36–48px |
| Editorial heading | 48–88px | 32–46px |
| Section heading | 32–48px | 26–36px |
| Card heading | 20–28px | 18–24px |
| Body text | 16–18px | 16px |
| Small label | 12–14px | 12–14px |

Use fluid `clamp()` typography where appropriate.

## 3.3 Typography Rules

- Prefer tight letter spacing for large headings.
- Maintain readable line height.
- Use intentional line breaks.
- Avoid excessive uppercase text.
- Do not color every heading Royal Blue.
- Highlight only selected words or phrases.
- Never allow headings to overflow mobile screens.
- Avoid reducing body text below readable sizes to fit complex layouts.

---

# 4. LAYOUT & SPACING

Dentora uses a custom editorial layout system.

## 4.1 Containers

Maximum primary content width:

`1360px`

Recommended horizontal gutters:

- Mobile: 20–24px
- Tablet: 32–48px
- Desktop: 48–80px

## 4.2 Section Spacing

Recommended vertical spacing:

- Mobile: 72–104px
- Desktop: 112–176px

Adjust spacing according to content density.

## 4.3 Composition Rules

Use:

- Asymmetric editorial grids
- Large typography
- Generous whitespace
- Strong alignment
- Thin separators
- Premium photography
- Intentional visual hierarchy

Avoid:

- Repeated generic three-card sections
- Excessive floating cards
- Unnecessary shadows
- Random decorative elements
- Overly rounded containers
- Large empty gaps without purpose

Every section should feel individually art-directed while remaining consistent with Dentora.

---

# 5. HERO SECTION — APPROVED DESIGN

The existing hero design is an approved component.

Do not redesign it without explicit permission.

## 5.1 Visual Direction

The hero uses:

- Premium dental photography
- Large editorial typography
- Integrated image and text composition
- Refined navbar
- Primary booking CTA
- Secondary treatment CTA

The approved photographic hero replaces the earlier conceptual chrome-tooth hero direction.

The metallic 3D tooth remains a signature feature of the About section.

## 5.2 Desktop Hero

- Cinematic background image
- Integrated content and imagery
- Strong editorial heading
- Clearly visible dentist/treatment visual
- Carefully controlled overlay
- Balanced composition

## 5.3 Mobile Hero

The image and content MUST remain part of one integrated hero section.

Do not render the image as a separate standalone block above the text.

Requirements:

- Unified hero container
- Integrated image layer
- Readable text overlay
- Responsive image positioning
- No abrupt image-to-content boundary
- No awkward face cropping
- No overlapping CTA buttons
- No horizontal overflow

The mobile experience must preserve the same premium composition as desktop.

---

# 6. NAVBAR & LOGO

The existing Dentora logo and navbar are approved.

## Desktop

- Refined Dentora branding
- Minimal navigation
- Carefully balanced spacing
- Distinct booking CTA
- Subtle hover interactions
- Elegant sticky behavior where implemented

## Mobile

- Compact logo
- Accessible menu button
- Booking CTA when space permits
- Proper touch targets
- No overlapping controls
- Smooth and accessible menu interaction

Do not:

- Replace the logo without permission
- Invent a new wordmark
- Redesign the navigation unnecessarily
- Create duplicate headers

---

# 7. INTERACTIVE 3D EXPERIENCE

The interactive 3D tooth in the About section is an approved signature feature.

Preserve its appearance and behavior.

## 7.1 Technology

Use:

- Three.js
- React Three Fiber where already implemented
- GSAP for coordinated animation where appropriate

Reuse the existing scene and model.

## 7.2 Visual Quality

The 3D tooth must feel:

- Realistic
- Sculptural
- Premium
- Elegantly illuminated
- Visually balanced
- Smoothly animated

Avoid cartoonish models and excessive reflections.

## 7.3 User Interaction

Support:

- Mouse drag rotation
- Mobile finger drag rotation
- Horizontal and vertical interaction
- Smooth damping
- Subtle idle movement
- Stable object positioning

User interaction must not conflict with existing GSAP animations.

## 7.4 Touch Behavior

- Allow natural finger-based interaction.
- Prevent accidental page scrolling while actively manipulating the model where required.
- Preserve normal scrolling outside the interactive region.
- Avoid global scroll locking.
- Do not cause layout shifts.
- Keep the object inside its visual boundaries.

## 7.5 Performance

- Reuse the existing WebGL canvas.
- Avoid unnecessary re-renders.
- Limit device pixel ratio where appropriate.
- Optimize model geometry and materials.
- Load heavy 3D components on the client.
- Provide a static fallback where necessary.
- Respect reduced-motion preferences.

## 7.6 Purposeful 3D Rule

Not every section needs a 3D model.

Three.js must be used only when it adds meaningful visual or interactive value.

Use GSAP and CSS transforms for lightweight depth effects.

Do not make the website look like a gaming interface.

---

# 8. GSAP MOTION DESIGN

Motion must enhance the experience, not distract from it.

## 8.1 Animation Standards

| Interaction | Recommended duration |
|---|---|
| Text reveal | 350–700ms |
| Button hover | 150–250ms |
| Menu transition | 180–300ms |
| Section reveal | 400–800ms |
| Image reveal | 500–900ms |

These are guidelines, not mandatory fixed timings.

## 8.2 Approved Motion

- Text stagger reveals
- Subtle scroll animations
- Refined image-mask transitions
- Controlled parallax
- Button arrow movement
- Smooth state transitions
- Gentle 3D rotation

## 8.3 GSAP Engineering Rules

- Use scoped GSAP contexts.
- Clean up animations on unmount.
- Avoid duplicate ScrollTriggers.
- Prevent animation conflicts.
- Avoid excessive layout-triggering properties.
- Respect reduced-motion settings.
- Ensure content remains accessible when animations are unavailable.

## 8.4 Forbidden Motion

Avoid:

- Scroll hijacking
- Excessively long pinned sections
- Constant bouncing
- Aggressive zoom effects
- Unnecessary page loaders
- Heavy animations on every component
- Animations that delay booking functionality

---

# 9. HOMEPAGE DESIGN STRUCTURE

The homepage follows a premium editorial storytelling approach.

## Section 01 — Hero

Status: Approved.

- Premium photographic hero
- Responsive integrated composition
- Bold typography
- Booking CTA
- Treatment CTA

Do not modify without permission.

## Section 02 — About / Philosophy

Status: Approved.

- Oversized editorial typography
- Interactive 3D tooth
- GSAP scroll interactions
- Premium whitespace
- Philosophy copy

Preserve existing animations and model appearance.

## Section 03 — Treatments Showcase

Status: Approved.

- Premium treatment presentation
- Interactive service imagery
- Editorial typography
- Refined GSAP transitions
- Mobile touch interactions

Do not replace with a generic service-card grid.

## Section 04 — The Dentora Difference

Design direction:

- Premium editorial split-screen
- High-quality clinic photography
- Large heading
- Three experience pillars
- Restrained GSAP reveals
- Subtle image depth

Avoid generic icon cards.

## Section 05 — Our Specialists

Design direction:

- Large professional portraits
- Editorial profile layouts
- Qualifications and specialties
- Refined hover interactions
- Clear profile and booking actions

Do not fabricate dentist identities or credentials.

## Section 06 — Clinic Experience

Design direction:

- Architectural photography
- Calm storytelling
- Immersive visual composition
- Minimal copy
- Subtle motion

## Section 07 — Appointment CTA

Design direction:

- High-impact Royal Blue or Black background
- Oversized typography
- One clear primary action
- Strong contrast
- Minimal decoration

## Section 08 — FAQ & Footer

- Accessible accordion
- Clear contact details
- Useful navigation
- Premium footer typography
- Responsive layout

Avoid repeating near-identical sections.

---

# 10. INNER PAGES

Every inner page must follow the same visual identity.

Required public pages:

1. Home
2. About
3. Services
4. Service details
5. Dentists
6. Dentist profiles
7. Contact
8. FAQ
9. Privacy Policy
10. Booking Policies
11. Appointment Booking

Inner pages should not look like unrelated templates.

Reuse established:

- Typography
- Navigation
- Buttons
- Containers
- Design tokens
- Spacing
- Interaction patterns

---

# 11. BOOKING EXPERIENCE

The appointment booking UI must feel consistent with Dentora.

However, functionality and clarity take priority over decorative effects.

## Booking Steps

1. Select treatment.
2. Select dentist or Any Available.
3. Choose date.
4. Choose available time.
5. Enter patient information.
6. Review and confirm.
7. View confirmation.

## Approved Business Rules

- Single dental clinic
- Multiple dentists
- Instant confirmed booking
- 15-minute slot interval
- 60-day advance booking horizon
- 2-hour minimum booking notice
- 12-hour cancellation/rescheduling cutoff
- Maximum 2 patient-initiated reschedules
- Guest booking
- Secure management links
- Payments excluded from initial release

Do not modify these rules during UI development.

## Booking UI Requirements

- Clear step indicator
- Accessible form fields
- Distinct selected states
- Loading and error states
- Responsive date and time selection
- Clear booking summary
- Accessible confirmation details
- Proper timezone display

Do not claim an appointment is confirmed until the server confirms it.

---

# 12. ADMIN DASHBOARD DESIGN

The dashboard must maintain Dentora's brand identity.

However, it should be calmer and more operational than the marketing website.

## Visual System

- White primary background
- Ice Blue supporting surfaces
- Black headings
- Royal Blue active states
- Minimal borders
- Professional typography
- Clean data visualization

## Main Components

- Sidebar
- Header
- KPI cards
- Appointment calendar
- Data tables
- Filters
- Search
- Forms
- Dialogs
- Status indicators
- Loading states
- Empty states

## Dashboard Rules

- No repeated page headings.
- No unnecessary decorative 3D effects.
- No excessive cards.
- No giant metrics without context.
- No cluttered sidebar.
- No fabricated data presented as real.
- No generic theme inconsistent with the website.

The Admin, Receptionist, and Dentist workspaces must share reusable components.

Backend authorization remains mandatory regardless of whether a UI control is hidden.

---

# 13. COMPONENT STANDARDS

Reusable components should be built only when needed.

Recommended shared components:

- SiteContainer
- SectionHeading
- EditorialHeading
- PrimaryButton
- SecondaryButton
- TextArrowLink
- Navbar
- MobileMenu
- Footer
- ServiceRow
- DentistProfileCard
- BookingStepper
- FormField
- BookingSummary
- DashboardShell
- Sidebar
- PageHeader
- KPIBlock
- DataTable
- Modal
- Toast

## Rules

1. Tailwind CSS for ordinary component styling.
2. Use shared design tokens.
3. Avoid repeated near-identical components.
4. Maintain consistent border radius.
5. Maintain consistent spacing.
6. Prefer Lucide icons where appropriate.
7. Implement hover, focus, loading, disabled, and error states.
8. Keep components accessible.

---

# 14. RESPONSIVE DESIGN

All components must be designed mobile-first.

## Required Validation Widths

- 320px
- 375px
- 390px
- 430px
- 768px
- 1024px
- 1440px

## Mobile Requirements

- No horizontal overflow.
- No clipped headings.
- No overlapping navbar controls.
- Properly integrated hero photography.
- Touch-friendly buttons.
- Responsive 3D interaction.
- Readable typography.
- Comfortable spacing.
- Smooth interactions.

## Tablet Requirements

- Intentional layout adaptation.
- Balanced typography.
- Correct image proportions.
- Responsive navigation.
- No awkward empty gaps.

## Desktop Requirements

- Premium editorial composition.
- Strong typography.
- Balanced negative space.
- Crisp imagery.
- Refined motion.
- Consistent visual hierarchy.

---

# 15. ACCESSIBILITY & PERFORMANCE

Aim for WCAG 2.2 AA accessibility.

Requirements:

- Semantic HTML
- Keyboard-accessible controls
- Visible focus indicators
- Appropriate color contrast
- Accessible labels
- Meaningful image alt text
- Reduced-motion support
- Responsive touch targets
- Appropriate mobile input font sizes

## Performance Rules

- Optimize photography using Next.js Image when appropriate.
- Prioritize above-the-fold loading performance.
- Lazy-load below-the-fold assets.
- Dynamically load heavy Three.js scenes.
- Avoid unnecessary JavaScript.
- Avoid layout shifts.
- Reduce unnecessary animation work.
- Do not block the main thread with heavy visual effects.

Performance must not be sacrificed for decorative effects.

---

# 16. CONTENT & TRUST

Dentora may use clearly identified demonstration content during development.

Never fabricate:

- Patient reviews
- Clinic awards
- Medical certifications
- Dentist qualifications
- Clinical outcomes
- Appointment availability
- Business statistics
- Clinic addresses
- Opening hours

Use approved content or clearly labeled placeholders.

Do not display sensitive patient data in demo visuals.

---

# 17. AGENT DEVELOPMENT WORKFLOW

All coding agents must follow this sequence.

## Step 1 — Inspect

Before implementation:

1. Read DESIGN.md.
2. Inspect existing components.
3. Identify the exact requested scope.
4. Identify dependencies and affected files.
5. Preserve approved work.

## Step 2 — Implement

- Modify only the requested section.
- Use Tailwind CSS for new ordinary UI styling.
- Preserve existing GSAP and Three.js behavior.
- Reuse components and tokens.
- Avoid unnecessary dependencies.
- Do not alter unrelated sections.

## Step 3 — Validate

Run appropriate checks:

- ESLint
- TypeScript
- Production build
- Responsive review
- Accessibility checks
- Interaction testing

Never claim browser testing unless performed.

## Step 4 — Report

Every implementation report must include:

1. Files created.
2. Files modified.
3. Components implemented.
4. Tailwind CSS usage.
5. Custom CSS exceptions.
6. GSAP or Three.js changes.
7. Responsive verification.
8. Build and lint results.
9. Remaining limitations.

---

# 18. STRICT CHANGE CONTROL

Agents must NOT:

- Redesign approved sections without permission.
- Change brand colors.
- Replace the approved logo.
- Introduce another UI framework.
- Rewrite the whole website unnecessarily.
- Remove approved animations.
- Replace the interactive 3D tooth.
- Break mobile responsiveness.
- Modify backend logic during frontend tasks.
- Create Git branches, commits, or pushes without explicit approval.

When a change affects an already-approved component, explain the reason and obtain approval before applying a material redesign.

Small bug fixes and explicitly requested changes are permitted.

---

# 19. FINAL DESIGN QUALITY CHECKLIST

Before declaring any UI task complete:

- [ ] DESIGN.md followed completely.
- [ ] Tailwind CSS used for ordinary new UI styling.
- [ ] Brand palette preserved.
- [ ] Typography consistent.
- [ ] Approved sections preserved.
- [ ] Premium visual quality maintained.
- [ ] No generic repetitive layouts.
- [ ] GSAP animations smooth.
- [ ] Three.js interactions functional where applicable.
- [ ] Mobile design verified.
- [ ] No horizontal overflow.
- [ ] No broken navigation.
- [ ] Buttons and links work.
- [ ] Accessibility reviewed.
- [ ] Performance considered.
- [ ] No fabricated clinic claims.
- [ ] TypeScript validation passes.
- [ ] ESLint passes.
- [ ] Production build passes.
- [ ] Actual visual QA completed where browser tooling is available.

---

# 20. SOURCE OF TRUTH

When instructions conflict:

1. Security and functional specifications control business logic.
2. DESIGN.md controls visual identity, styling, and interaction presentation.
3. Approved existing components must be preserved unless the current task specifically authorizes modifications.
4. Individual agent prompts control only their requested scope.

No agent may silently override approved design decisions.

## FINAL PRINCIPLE

**Dentora must feel premium because of its typography, composition, interaction quality, imagery, precision, and restraint — not because of excessive animations or decorative effects.**

A website that looks beautiful on desktop but breaks on mobile is not premium.

A website with impressive 3D visuals but poor usability is not premium.

A website with attractive screenshots but inconsistent real components is not premium.

**Every section must feel intentionally designed, technically refined, and unmistakably Dentora.**
