# AGENTS

Use [Bun](https://bun.sh) for dependency management and running scripts.

## Setup

- Install dependencies: `bun install`

## Formatting

- Fix formatting: `bun run prettier:write`
- Check formatting: `bun run prettier:check`

## Linting

- Fix lint issues: `bun run lint`
- Check linting: `bun run lint:check`

## Type Checking

- TypeScript no-emit checks: `bun run typecheck`

## Tests

- End-to-end tests: `bun run test:e2e`
- Interactive mode: `bun run test:e2e:ui`
- Open last report: `bun run test:e2e:report`
- One-time browser install: `bun run test:e2e:install`

## Build

- Build the app: `bun run build`

After code changes, run formatting check, lint check, typecheck, tests, and build to verify everything works.
