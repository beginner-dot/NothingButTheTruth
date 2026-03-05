# The Christianity of Christ — Interactive Course

Production-ready Next.js + TypeScript project for an interactive short course centered on the Christianity of Christ.

## Features
- 11 modules (`module-0` to `module-10`) in MDX under `content/modules`.
- Framework in every module: Bible Foundation, Spirit of Prophecy, Historical Context, Practical Application, Accountability.
- Dashboard with progress summary, habits tracker, reality-check recommendations, encouragement feed, and reflection journal.
- API routes: `/api/progress`, `/api/habits`, `/api/quiz/submit`, `/api/reflection`, `/api/dashboard`, `/api/admin`.
- SQLite + Prisma local datastore with adapter abstraction for PostgreSQL.
- Auth stub in `src/lib/auth.ts` (email / OAuth placeholder).
- Tailwind responsive UI with high-contrast mode toggle.
- Unit tests (logic) and integration-style API test.
- Resource manifest + validation script.
- Dockerfile for container deployment.

## Stack
- Next.js 15 + TypeScript
- MDX content files + `gray-matter`
- Prisma + SQLite (default) / PostgreSQL (adapter)
- Tailwind CSS
- Vitest

## Quick Start
1. Install dependencies:
   - `npm install`
2. Configure env:
   - copy `.env.example` to `.env`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations (dev):
   - `npm run prisma:migrate`
5. Seed demo data:
   - `npm run seed`
6. Start app:
   - `npm run dev`

## Content Editing
- Core lesson template: `content/modules/LESSON_TEMPLATE.mdx`
- Module folders: `content/modules/module-0` ... `content/modules/module-10`
- Each module has:
  - `lesson-1.mdx` (core lesson)
  - `deep-dive-1.mdx`
  - `deep-dive-2.mdx`

## Scripts
- `npm run lint`
- `npm run test`
- `npm run content:import` (builds lesson manifest)
- `npm run resources:validate` (checks placeholder URLs)
- `npm run build`

## Deployment

### Vercel
- Import the repo in Vercel.
- Set env vars (`DATABASE_PROVIDER`, `DATABASE_URL`).
- Build command: `npm run build`
- Start command: `npm run start`

### Netlify
- Build command: `npm run build`
- Publish directory: `.next`
- Use Next.js runtime/plugin in Netlify.

### Docker
- Build: `docker build -t christianity-of-christ .`
- Run: `docker run -p 3000:3000 christianity-of-christ`

## Prisma Adapter Notes
- Default: SQLite (`DATABASE_PROVIDER=sqlite`, `DATABASE_URL=file:./dev.db`)
- PostgreSQL mode: set `DATABASE_PROVIDER=postgresql` and a PostgreSQL `DATABASE_URL`.
- Adapter selection occurs in `src/lib/db/index.ts`.

## Admin & Moderation
- Admin stub page: `/admin`
- Community categories + moderation workflow stubs: `/community`
- Privacy + educational disclaimer: `/privacy`

## Accessibility
- Keyboard-navigable controls.
- High-contrast toggle in header.
- Audio resource placeholders in lesson resources for future narrated content.

## Localization
- English strings in `src/lib/i18n/en.ts`.
- Add additional locale files and switch by route or middleware.
