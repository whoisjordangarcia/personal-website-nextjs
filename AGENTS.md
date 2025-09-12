# AGENTS

These instructions apply to the entire repository.

## Development

- Format code with `bun run prettier:write` and verify using `bun run prettier:check`.
- Lint with `bun run lint` and verify using `bun run lint:check`.
- Run the type checker with `bun run typecheck`.
- Verify the build with `bun run build`.
- Execute end-to-end tests with `bun run test:e2e` (install browsers once via `bun run test:e2e:install`).

Ensure these commands pass before committing changes.
