# Personal Website v4

<p align="center">
  <img src="docs/jordangarcia_ss.png?raw=1" alt="Website screenshot" width="800" />
</p>

A terminal-themed personal portfolio website featuring a CLI aesthetic with animated typing effects and an interactive tmux-inspired status bar.

## Features

- **Terminal Interface** — Simulated terminal with realistic typing animations and command-line aesthetics
- **Animated Content** — Staggered link reveal, terminal-style hover (color inversion)
- **Tmux Status Bar** — Interactive status bar with keyboard shortcuts (Ctrl+b prefix):
  - `?` — Help panel
  - `%` — Split window vertically
  - `"` — Split window horizontally
  - `c` — New window
  - `d` — Detach
- **Catppuccin Theme** — Consistent color palette using the Catppuccin Macchiato theme
- **Analytics** — Umami analytics integration for privacy-friendly tracking
- **Dotfiles Endpoint** — Serves boot script from GitHub dotfiles repository

## Tech Stack

| Category         | Technology                         |
| ---------------- | ---------------------------------- |
| **Runtime**      | Bun                                |
| **Framework**    | Next.js 16 (App Router)            |
| **UI**           | React 19, TypeScript               |
| **Styling**      | Tailwind CSS 4, Catppuccin         |
| **Fonts**        | Ioskeley Mono, Geist Sans          |
| **API**          | tRPC 11                            |
| **State**        | TanStack React Query 5             |
| **Database**     | SQLite via @libsql/client, Drizzle |
| **Validation**   | Zod                                |
| **Code Quality** | ESLint, Prettier, Vitest           |
| **Deployment**   | Vercel                             |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/whoisjordangarcia/personal-website-nextjs.git
   cd personal-website-nextjs
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and configure:

   | Variable                       | Description                  |
   | ------------------------------ | ---------------------------- |
   | `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Umami analytics website ID   |
   | `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | URL to Umami tracking script |

4. **Set up the database**

   ```bash
   bun run db:push        # Create/update schema
   # or
   bun run db:migrate     # Run generated migrations
   ```

5. **Start development server**

   ```bash
   bun run dev            # Opens http://localhost:3000
   ```

### Production Build

```bash
bun run build
bun start
```

## Scripts

| Script                   | Description                          |
| ------------------------ | ------------------------------------ |
| `bun run dev`            | Start development server (Turbopack) |
| `bun run build`          | Create production build              |
| `bun start`              | Serve production build               |
| `bun run lint`           | Run ESLint                           |
| `bun run typecheck`      | Run TypeScript type checker          |
| `bun run prettier:check` | Check code formatting                |
| `bun run prettier:write` | Format code with Prettier            |
| `bun run db:generate`    | Generate Drizzle migrations          |
| `bun run db:migrate`     | Run database migrations              |
| `bun run db:push`        | Push schema changes to database      |
| `bun run db:studio`      | Open Drizzle Studio UI               |

## Project Structure

```
personal-website-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── _components/        # React components
│   │   │   ├── terminal/       # Terminal UI (HomeTerminal, TerminalLine)
│   │   │   └── tmux/           # Tmux status bar component
│   │   ├── api/trpc/           # tRPC API route handler
│   │   ├── dotfiles/           # Dotfiles boot script endpoint
│   │   ├── layout.tsx          # Root layout with fonts and providers
│   │   └── page.tsx            # Homepage
│   ├── server/                 # Server-side code
│   │   ├── api/                # tRPC routers and configuration
│   │   └── db/                 # Database connection and schema
│   ├── trpc/                   # tRPC client utilities
│   ├── styles/                 # Global CSS with Tailwind
│   └── env.js                  # Environment variable validation
├── public/                     # Static assets
│   └── fonts/                  # Ioskeley Mono font files
├── drizzle/                    # Database migrations
├── docs/                       # Documentation assets
└── [config files]              # ESLint, Prettier, TypeScript, etc.
```

## Acknowledgments

- Built with [Create T3 App](https://create.t3.gg)
- Color theme: [Catppuccin](https://github.com/catppuccin/catppuccin)
- Font: [Ioskeley Mono](https://github.com/ahatem/IoskeleyMono)
