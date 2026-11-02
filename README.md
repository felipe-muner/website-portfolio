# Website Portfolio

**Live:** https://website-portfolio-felipe-muner.vercel.app · **Code:** https://github.com/felipe-muner/website-portfolio

A growing showcase of complete, production-style websites for every kind of small business,
all in one Next.js codebase. Each template is a real, working page (not a mock-up): gym,
yoga studio, villa rental, café, barber, dive shop, air conditioning service, tattoo studio,
restaurant, coworking space, retreat, real estate, courier, boat charter, artist portfolio,
online store, and more. There is also a full gym management back office (members, check-in,
plans, payments, reports) behind Google login.

## Why this exists

Every new website starts from zero: the same hero, the same pricing table, the same
contact form, rebuilt again and again. With AI coding assistants that waste is now also
measured in tokens. This repository is the opposite of starting from zero: pick the
template closest to your field, copy it, and you are already at "make it mine" instead
of "make it exist". I keep the templates current with the latest features of the stack
(Next.js, React, the AI SDK, Remotion), so starting from here also means starting from
today's best practices, not last year's.

**Who it's for:** freelancers, agencies and founders who need a professional site fast;
developers who want a reference implementation of a given page type; and me, since this
is the toolbox I use for my own client pitches and demos.

All template brands, people, reviews, phone numbers and addresses are fictional sample
data. The code is real.

## What's inside

| Area | Where |
|---|---|
| Templates, one route per business type (`/gym`, `/yoga`, `/villa`, `/cafe`, `/barber`, `/dive`, `/aircon`, `/artist`, `/tattoo`, `/restaurant`, `/coworking`, `/retreat`, `/realestate`, `/courier`, `/boat`, `/rental`, `/spa`, `/muaythai`, `/brazilian-jiu-jitsu`, `/reformer-pilates`, `/sacolaria`, `/beachclub`, `/fullmoon`, `/goldenhour`, `/coaching`, `/biosphere*`, plus versioned variants like `/gym/v1..v6`, `/villa/v1..v10`, `/yoga/v1..v6`) | `app/`, `lib/layouts/`, `components/layouts/` |
| Portfolio and showcase index pages | `app/portfolio`, `app/showcase`, `app/work` |
| Trade preview generator (plumbing, HVAC, cleaning) | `app/preview/[slug]`, `lib/previews/`, `components/previews/` |
| Gym management back office (members, check-in, plans, payments, reports, users) | `app/admin/`, `components/admin/`, `app/api/admin/` |
| Database schema and migrations (Drizzle + Postgres) | `drizzle/`, `lib/db/`, `types/` |
| Auth (NextAuth v5, Google OAuth, role-based access) | `lib/auth*`, `app/api/auth/` |
| Showreel and presentation video | `remotion/` |
| Unit and end-to-end tests | `tests/unit/`, `tests/e2e/` |

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Framer Motion ·
react-three-fiber (WebGL heroes) · Drizzle ORM + Neon PostgreSQL · NextAuth.js v5 ·
Remotion · Jest + Playwright · deployed on Vercel.

## Getting started

```bash
git clone https://github.com/felipe-muner/website-portfolio
cd website-portfolio
npm install
cp .env.production.example .env.local   # fill in DATABASE_URL, AUTH_SECRET, Google OAuth
docker compose up -d                     # local Postgres (optional, or use Neon)
npx drizzle-kit push                     # create the schema
npm run dev                              # http://localhost:3000
```

The templates work without a database. Only the back office under `/admin` and the
check-in flow need `DATABASE_URL`, `AUTH_SECRET` and the Google OAuth variables. See
`VERCEL-DEPLOYMENT.md` for the production setup.

## Scripts

```bash
npm run dev            # dev server
npm run build          # production build
npm run lint           # eslint
npm test               # jest unit tests
npm run test:e2e       # playwright end-to-end tests
npm run video          # remotion studio for the showreel
npm run rail:capture   # full-page screenshots of every template
```

## Using a template

1. Open the route you want (for example `/barber`) and the matching data file in
   `lib/layouts/` or the page in `app/<name>/page.tsx`.
2. Copy the page and its `components/layouts/<name>/` folder into your own project.
3. Replace the sample content in the data file. Images live under `public/img/layouts/`.

## Roadmap

Planned work is in [ROADMAP.md](./ROADMAP.md) and the GitHub issues.

## License

Code is released under the [MIT License](./LICENSE). Sample images under `public/` are
either my own or stock images used for demonstration.
