# Roadmap

Planned work on the website portfolio. GitHub issues track the individual items; this file
is the overview, roughly in priority order.

## Reuse: make starting from a template effortless

- [ ] Template gallery index with search and filters by field, style and feature
      (booking, shop, schedule, 3D hero), replacing the hand-written showcase page.
- [ ] "Use this template" export: a script that copies one template (page, layout data,
      components, images) into a fresh Next.js project with a single command.
- [ ] One data file per template with a documented schema, so swapping content never
      means editing JSX.
- [ ] A README section per template: what it includes, which data file drives it, screenshots.

## Keep up with the latest AI features

- [ ] AI copywriting helper: generate the sample content for a template from a one-line
      business description (AI SDK, structured output).
- [ ] AI chat / concierge widget that any template can enable (bookings, FAQ) using the
      AI SDK with tool calling.
- [ ] Image generation hook for placeholder photos per template.
- [ ] Track AI SDK and Next.js releases and upgrade every quarter; document the migration.

## Quality

- [ ] GitHub Actions CI: lint, typecheck, unit tests, Playwright smoke on every PR.
- [ ] Fix the remaining type issues in `tests/` and the `set-state-in-effect` lint error in
      the villa store.
- [ ] Lighthouse pass on every template (LCP, CLS, image sizes), target 90+ mobile.
- [ ] Accessibility audit: focus states, contrast, reduced-motion fallbacks for 3D heroes.

## Back office

- [ ] Make the gym management system a standalone template with a seed script and demo
      login, so it can be tried without creating OAuth credentials.
- [ ] Online payments (Stripe) for memberships and day passes.

## Housekeeping

- [ ] Reduce repository size: move large showreel and rail images to a CDN.
- [ ] Remove unused layout variants after the gallery index lands.
