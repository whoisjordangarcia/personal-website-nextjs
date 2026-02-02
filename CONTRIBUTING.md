# Contributing

Thank you for your interest in contributing to this project!

## Development Setup

1. Fork and clone the repository
2. Install dependencies with `bun install`
3. Copy `.env.example` to `.env.local` and configure variables
4. Run `bun run db:push` to set up the database
5. Start the dev server with `bun run dev`

## Code Quality

Before submitting changes, ensure all checks pass:

```bash
bun run prettier:write    # Format code
bun run lint:check        # Check for lint errors
bun run typecheck         # Check TypeScript types
bun run build             # Verify build succeeds
```

## Pull Request Guidelines

1. Create a feature branch from `main`
2. Make your changes with clear, descriptive commits
3. Ensure all code quality checks pass
4. Submit a pull request with a clear description of changes

## Code Style

- Code is formatted with Prettier
- ESLint enforces consistent patterns
- TypeScript strict mode is enabled
- Tailwind CSS is used for styling

## Project Structure

- `src/app/` - Next.js pages and routes
- `src/app/_components/` - React components
- `src/server/` - Server-side code (tRPC, database)
- `src/trpc/` - tRPC client utilities
