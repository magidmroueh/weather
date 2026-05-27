# Weather

A friendly, cartoon-styled, mobile-first web app that gives daily outfit suggestions to your whole family — including walk-readiness advice for pets — based on local weather.

Frontend-only React app deployed to Vercel; a single server function keeps the Gemini key off the client.

## Stack

- **Bun** package manager + **Turborepo**
- **TanStack Start v1** (React 19, file-based routing, Vite, server functions)
- **Tailwind CSS v4**
- **Zustand** (localStorage-backed) for family + preferences
- **TanStack Query** for caching weather and recommendations
- **Open-Meteo** for weather + geocoding (no key required)
- **Gemini 2.5 Flash-Lite** via a server function (key stays on the server)
- **Zod** schemas in `packages/shared` as the contract between UI, store, and server function

## Setup

```bash
bun install
cp apps/web/.env.example apps/web/.env
# Add your GEMINI_API_KEY to apps/web/.env
bun dev
```

Open http://localhost:3000.

Get a free Gemini API key at https://aistudio.google.com/apikey.

## Scripts

- `bun dev` — start the dev server
- `bun run build` — build for production
- `bun run type-check` — TypeScript across the monorepo
- `bun run lint` — lint across the monorepo

## Deploy to Vercel

The repo ships `apps/web/vercel.json` and `apps/web/api/index.mjs` — a tiny adapter that re-exports the TanStack Start SSR fetch handler. `bun run build` produces `apps/web/dist/{client,server}`; Vercel serves the client assets statically and routes everything else through the function.

**Vercel dashboard settings (one-time):**
- **Root Directory:** `apps/web`
- **Environment Variables:** add `GEMINI_API_KEY` (production) — server-only, no `VITE_` prefix so it never reaches the browser.

Everything else (install / build / output / function config / rewrites) is encoded in `apps/web/vercel.json` and runs from the monorepo root via `cd ../..`, so Bun installs the entire workspace and Turbo builds `@weather/shared` before `@weather/web`.

Or, from the CLI:

```bash
bunx vercel link          # first time — picks a Hobby project, root = apps/web
bunx vercel env add GEMINI_API_KEY production
bunx vercel --prod
```

## Structure

```
apps/web/                   TanStack Start app (UI + server functions)
packages/shared/            Zod schemas + shared types
packages/tsconfig/          Shared tsconfig base
```

The Zod schemas in `packages/shared` are the source of truth for the contract between client, store, and server function.
