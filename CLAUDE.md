# CLAUDE.md

Guidance for agents working in this repo. Read before running commands.

## Package manager: Bun (never npm)

This project uses **Bun**. The committed lockfile is `bun.lock` — there is no
`package-lock.json`. Using `npm install` here is a trap: it creates an untracked
`node_modules` and a transient `package-lock.json` but never touches `bun.lock`,
so dependency changes don't actually land.

- Install: `bun install` (CI uses `bun install --frozen-lockfile`)
- Update deps: `bun update` (rewrites `package.json` ranges + `bun.lock`)
- Run scripts: `bun run <script>` / `bunx <bin>`

## Running locally

The app fail-fast-validates env vars at startup via `@t3-oss/env-nextjs`
(`src/env.js`), so it crashes without `DATABASE_URL`. The DB is libsql/SQLite —
for local dev, point it at a local file (no Turso account needed):

```bash
bun run db:push                          # materialize Drizzle schema into the DB
DATABASE_URL="file:local.db" bun run dev # http://localhost:3000
```

`local.db` is gitignored. To skip env validation entirely (e.g. for builds):
prefix with `SKIP_ENV_VALIDATION=1`.

## CI gates (must all pass before pushing)

CI runs these in order — run the same locally before committing:

```bash
bun run typecheck      # tsc --noEmit
bun run lint           # eslint .       (correctness rules)
bun run prettier:check # prettier --check . (formatting — SEPARATE from lint)
bunx vitest run        # 108+ unit tests (needs DATABASE_URL set)
```

Lint passing does NOT imply formatting passes — `prettier:check` is its own
gate. Auto-fix formatting with `bun run prettier:write`.

Note: JSX text apostrophes must be escaped (`react/no-unescaped-entities`); use
`&rsquo;`/`&apos;` rather than a bare `'`.

## Architecture

T3 stack, terminal-themed personal site:

- **Next.js 16** (App Router, Turbopack) — `src/app/`
- **tRPC 11** + **TanStack Query** — `src/server/api/`, `src/trpc/`
- **Drizzle ORM** over **libsql/SQLite** — `src/server/db/` (schema in `schema.ts`)
- **Tailwind CSS 4** — `src/styles/`
- Homepage content (the terminal bio/links) lives in
  `src/app/_components/terminal/HomeTerminal.tsx`, not in markdown.

## Conventions

- Commit messages: conventional commits (`chore:`, `content:`, `feat:`, ...).
- Catppuccin color palette; colors are hard-coded hex in `className` (e.g.
  `text-[#CAD3F5]`).
