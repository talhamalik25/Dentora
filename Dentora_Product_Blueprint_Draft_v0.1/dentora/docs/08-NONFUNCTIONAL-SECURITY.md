# Nonfunctional and security requirements

## Security
- Only server-side database access; secret keys in environment variables.
- Strong login/session security; HttpOnly, Secure, SameSite cookies and session expiration.
- Protect every admin data route with explicit role/record-level authorization.
- Encrypt transport (HTTPS) and use database provider encryption at rest.
- Validate and sanitize input; avoid XSS, injection and leaked error details.
- Public rate limiting, anti-automation controls and anti-enumeration responses.
- Audit privileged appointment, scheduling and account changes.
- Secrets never committed; separate development, staging and production data.

## Patient privacy
- V1 stores contact information and appointments, not clinical or health history.
- Do not collect symptoms or sensitive details in free text by default.
- Consent and retention policy must be approved before collecting real patient data.
- No real patient records, credentials or photos in publicly deployed portfolio demos.
- Verify applicable Pakistani privacy/health data requirements before actual clinic launch; do not claim regulatory compliance without review.

## Reliability & operations
- Reliable transaction/slot occupancy strategy; backup and recovery plan.
- Visibility for failed email notifications and retry mechanism.
- Server-side logs redact phone/email/token values where possible.
- Explicit states for network failures; graceful empty/loading/error UI.
- Staging deployment for acceptance tests; health and error monitoring.

## Accessibility & performance
- Target WCAG 2.2 AA where practical, including form labels and focus handling.
- Mobile-first responsive design and reduced-motion preferences.
- Optimize images, fonts, Core Web Vitals; avoid blocking on heavy animations.
- SEO metadata, canonical URLs, sitemap and structured data only when verified.
