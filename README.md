# THEA

AI-assisted team knowledge base — capture, organize, and find team knowledge in seconds.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Clerk Auth · PostgreSQL · Sentry · Pino

---

## Local dev setup (~5 minutes)

**Prerequisites:** Node.js 20+, npm 10+, Docker (for local Postgres)

```bash
git clone https://github.com/themefisher/thea.git
cd thea
bash scripts/setup.sh   # installs deps, creates .env.local from .env.example
```

Edit `.env.local` with your Clerk credentials, then start Postgres and the app:

```bash
npm run dev:setup   # starts Postgres via Docker + runs migrations
npm run dev         # starts Next.js on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000).

### Alternative: Dev Container (VS Code / GitHub Codespaces)

Open the repo in VS Code and click **"Reopen in Container"** — Node.js is pre-configured. You still need to run `npm run dev:setup` once inside the container.

---

## Running tests

```bash
npm test               # run once
npm run test:watch     # watch mode
npm run test:coverage  # with coverage report
```

---

## Linting & type-checking

```bash
npm run lint           # ESLint
npm run lint:fix       # auto-fix
npm run type-check     # TypeScript (no emit)
```

---

## How to deploy

**Production (automatic):** every merge to `main` deploys to Vercel automatically.

**Manual:**

```bash
npx vercel --prod
```

**Preview:** every open PR gets a Vercel preview URL.

Set the following secrets in your Vercel project settings (or GitHub secrets for CI):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL` (managed Postgres connection string)
- `NEXT_PUBLIC_SENTRY_DSN` (optional)

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry error tracking DSN |

See `.env.example` for the full list.

---

## Project structure

```
src/
  app/
    (auth)/       Sign-in and sign-up pages (Clerk)
    (dashboard)/  Protected app pages
  components/     Shared UI components
  lib/
    db.ts         Postgres client (postgres.js)
    logger.ts     Pino structured logger
  middleware.ts   Clerk auth middleware
  __tests__/      Unit tests
docs/
  branching-strategy.md
.github/
  workflows/
    ci.yml        Lint → type-check → test → build on every PR
.devcontainer/    VS Code / Codespaces dev container config
docker-compose.yml  Local Postgres
scripts/
  setup.sh        One-command local setup
```

---

## Branching strategy

See [docs/branching-strategy.md](docs/branching-strategy.md).
Short version: **GitHub Flow** — branch off `main`, open a PR, squash-merge after review + green CI.

---

## Observability

- **Error tracking:** Sentry (configured via `sentry.client.config.ts` and `sentry.server.config.ts`)
- **Logging:** Pino structured JSON logs (`src/lib/logger.ts`) — pretty-printed in dev, JSON in production
