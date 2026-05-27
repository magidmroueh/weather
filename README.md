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

The repo ships a checked-in `vercel.json` and an `api/index.mjs` adapter that wraps the TanStack Start SSR fetch handler — `bun run build` produces `apps/web/dist/{client,server}` and Vercel serves the client assets statically while routing every other path through the function.

```bash
bunx vercel link          # first time — picks a Hobby project
bunx vercel env add GEMINI_API_KEY production
bunx vercel --prod
```

Or import the GitHub repo in the Vercel dashboard. The settings encoded in `vercel.json`:

| Setting           | Value                          |
|-------------------|--------------------------------|
| Install command   | `bun install`                  |
| Build command     | `bun run build`                |
| Output directory  | `apps/web/dist/client`         |
| Function entry    | `api/index.mjs`                |

The only environment variable you need to add is `GEMINI_API_KEY` (server-only — not prefixed with `VITE_`, so it stays out of the browser bundle).

## Structure

```
apps/web/                   TanStack Start app (UI + server functions)
packages/shared/            Zod schemas + shared types
packages/tsconfig/          Shared tsconfig base
```

The Zod schemas in `packages/shared` are the source of truth for the contract between client, store, and server function.
