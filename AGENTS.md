# AGENTS Instructions

This repository uses Bun and Next.js.

## Commands

- Install dependencies: `bun install`
- Build the application: `bun run build`
- Start the application: `bun run start`
- Lint: `bun run lint` (fix) or `bun run lint:check` (verify)
- Format: `bun run prettier:write` (fix) or `bun run prettier:check`
- Type check: `bun run typecheck`
- End-to-end tests: `bun run test:e2e`

## Workflow

Run `bun run lint:check`, `bun run prettier:check`, and `bun run typecheck` before committing.
Execute `bun run test:e2e` when applicable.
