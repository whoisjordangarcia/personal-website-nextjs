Run all quality gates before committing or creating a PR. Run these steps and report results:

1. **Unit tests**: `bunx vitest run`
2. **Prettier**: `bun run prettier:check` — if it fails, fix with `bun run prettier:write` and re-check
3. **ESLint**: `bun run lint`
4. **TypeScript**: `bun run typecheck`

Run steps 1-4 in parallel when possible. If any step fails, fix the issue and re-run that step.

Summarize pass/fail for each step. Only report details for failures.
