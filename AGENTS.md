# AGENTS

These instructions apply to the entire repository.

## Development

- Format code with `bun run prettier:write` and verify using `bun run prettier:check`.
- Lint with `bun run lint` and verify using `bun run lint:check`.
- Run the type checker with `bun run typecheck`.
- Verify the build with `bun run build`.
- Execute end-to-end tests with `bun run test:e2e` (install browsers once via `bun run test:e2e:install`).

Ensure these commands pass before committing changes.

## Logging

- When running verification commands, silence standard output so only errors are shown by redirecting stdout to `/dev/null` (e.g., `bun run lint:check >/dev/null`).
- You may run the same commands without redirection to view full logs.
