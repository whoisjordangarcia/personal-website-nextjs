# personal website v4

<p align="center">
  <img src="docs/jordangarcia_ss.png?raw=1" alt="Website screenshot" width="800" />
</p>

Personal site built with Next.js App Router, tRPC, Drizzle ORM, and Bun.

## Getting Started

Prerequisites: Install Bun from https://bun.sh

1. Install dependencies

```
bun install
```

2. Environment variables

```
cp .env.example .env.local
# open .env.local and fill required values
```

The following environment variables are supported:

- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` – Umami website ID.
- `NEXT_PUBLIC_UMAMI_SCRIPT_URL` – URL to the Umami tracking script.

3. Database (Drizzle)

```
bun run db:push        # create/update schema
# or
bun run db:migrate     # run generated migrations
bun run db:studio      # optional: DB UI
```

4. Run the app

```
bun run dev            # http://localhost:3000
```

Build and serve

```
bun run build
bun start
```

## Scripts

- `bun run dev` – Start Next.js dev server
- `bun run build` – Production build
- `bun start` – Serve built app
- `bun run lint` – ESLint via `next lint`
- `bun run db:generate` | `db:migrate` | `db:push` | `db:studio` – Drizzle

## Project Structure

- `src/app` – Pages, layout, app routes (`app/api`)
- `src/server` – tRPC routers, DB, server utilities
- `src/trpc` – tRPC client/server helpers
- `drizzle/` – Migrations; `drizzle.config.ts` config
- `public/` – Static assets; `src/styles/globals.css` styles

## Tech Stack

- Next.js, React, TypeScript, Tailwind CSS
- tRPC, @tanstack/react-query, SuperJSON, Zod
- Drizzle ORM, @libsql/client
