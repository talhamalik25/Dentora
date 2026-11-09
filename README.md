# Dentora — Phase 1

A single-clinic dental platform concept. Phase 1 implements the public design foundation only. No booking requests, authentication, database connections, patient data collection, or admin operations are enabled.

## Local development

```sh
npm install
npm run dev
```

Validation:

```sh
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

The initialized Next.js 16.4.5, React/React DOM 19.3.0, TypeScript 5.9.3, and Tailwind 4.3.5 versions are retained. Next's React peer range includes React 19; the existing Tailwind Turbopack integration compiles successfully. Existing package.json and package-lock.json edits were preserved, with no new dependencies. Some extraneous installed packages were reported by npm ls and were not removed.

## Architecture

```text
public/images/clinic.svg          Original local clinic illustration
src/
  app/
    (marketing)/
      layout.tsx                 Shared public navigation and footer
      page.tsx                   Homepage
      book/page.tsx              Nonfunctional booking preview
      services/page.tsx          Demonstration services
    (admin)/admin/page.tsx        Public, noindex admin placeholder
    globals.css                  Tokens, responsive and shared styles
    layout.tsx                   Root metadata, document, skip link
  components/
    layout/                      Brand, navbar, mobile navigation, footer
    ui/                          Button/ButtonLink, Container, Input,
                                 SectionHeading, Reveal
  config/site.ts                 Navigation and clearly labeled demo contact
  features/marketing/services.ts Typed demonstration service catalog
  lib/classes.ts                 Shared class-name helper
  models/README.md               Future server persistence boundary
  types/clinic.ts                Domain and public availability contracts
```

Routes compose features and reusable components. Marketing owns its demonstration data. UI imports only shared utilities; contracts do not import UI or persistence. Models will be server-only. The route group `(admin)` is organizational, not an authorization boundary. Its placeholder is public and contains no sensitive functionality.

## Design system

CSS variables define deep teal `#123C46`, medical teal `#177E89`, mint `#E6F3F1`, white `#FFFFFF`, and champagne `#CBAE83`. Ivory surfaces, Georgia display type, and a local system sans-serif avoid external font requests. Champagne is decorative, not used as body text on white. Reusable tokens cover muted text, borders, and an 8px control radius. Tailwind utilities handle composition; shared CSS handles the visual language and breakpoints.

The homepage includes an original SVG studio illustration, services, the care philosophy, an example visit journey, and a booking CTA. Services, clinical principles, and contact information are identified as demonstration content. No dentists, ratings, awards, or patient statistics are invented.

Client boundaries are limited to mobile navigation and GSAP reveal wrappers. Children remain server-rendered. Reveals preserve document flow, are visible without JavaScript, use IntersectionObserver, and clean up on unmount. Reduced motion disables reveals, smooth scrolling, and hover transforms. Mobile navigation supports disclosure semantics, Escape with focus return, close on selection, and close when focus leaves. Inputs support explicit labels, hints, error associations, and invalid state; no patient form is exposed in Phase 1.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Public homepage; services, approach, visit, contact anchors |
| `/services` | Illustrative service categories |
| `/book` | Coming-soon notice; booking disabled; no data collected |
| `/admin` | Public placeholder; no login or operational controls |

## Files changed

Modified `src/app/layout.tsx` and `src/app/globals.css`; replaced the starter `src/app/page.tsx` with the marketing route-group page. Replaced this README. Added the files shown in the architecture tree, including four layout components and five UI components. The existing starter favicon and unused starter SVG assets remain; they can be replaced with final brand assets later. Dependency files already had user changes and were not edited by this implementation.

## Phase 1 validation

- `npm run lint`: passed (also checked `eslint src`).
- `npx tsc --noEmit`: passed with strict mode enabled.
- `npm run build`: passed; all four application routes statically prerendered.
- Production HTTP checks: `/`, `/services`, `/book`, `/admin` returned 200.
- Actual headless Microsoft Edge review via DevTools Protocol at 375px and 1440px: screenshots reviewed; no horizontal overflow; hero image loaded; homepage fragment targets present.
- Mobile menu expanded; Escape closed it and returned focus; the hero booking CTA navigated to `/book`, which exposed the disabled booking action.
- Emulated reduced motion: preference recognized, smooth scrolling disabled, hero visible.
- Keyboard Tab reached the visible skip link with a 3px focus outline; no JavaScript exceptions observed during that browser session.

Temporary review scripts and screenshots are in ignored `.next/`; they are not a permanent test suite. Browser checks used the installed Edge browser, not Playwright. Full cross-browser, assistive-technology, and automated accessibility testing remain future work.

## Next phase

Define and validate booking requirements before implementation: real clinic timezone and service durations, schedule exceptions, lead times, cancellation rules, and patient-information policies. Add Zod schemas and meaningful tests for timezone/DST conversion and overlapping slot reservations. Then implement server-side availability, transactional concurrency protection, and idempotency; authorize admin operations before exposing private data. See `src/models/README.md` for persistence safeguards.

No secrets or environment configuration are needed in Phase 1. Never place database credentials or private keys in NEXT_PUBLIC variables. Demonstration service durations and contact details must not be treated as operational settings.
