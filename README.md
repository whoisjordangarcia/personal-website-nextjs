# Personal Website v4

<p align="center">
  <img src="docs/jordangarcia_ss.png?raw=1" alt="Website screenshot" width="800" />
</p>

A terminal-themed personal portfolio website featuring a CLI aesthetic with animated typing effects, neofetch-style system info, and an interactive tmux-inspired status bar.

## Features

- **Terminal Interface** - Simulated terminal with realistic typing animations and command-line aesthetics
- **Neofetch Display** - System info panel with ASCII art, bio, work information, and social links
- **Tmux Status Bar** - Interactive status bar with keyboard shortcuts (Ctrl+b prefix):
  - `?` - Help panel
  - `%` - Split window vertically
  - `"` - Split window horizontally
  - `c` - New window
- **Catppuccin Theme** - Consistent color palette using the Catppuccin Mocha theme
- **Analytics** - Umami analytics integration for privacy-friendly tracking
- **Dotfiles Endpoint** - Serves boot script from GitHub dotfiles repository

## Tech Stack

| Category         | Technology                         |
| ---------------- | ---------------------------------- |
| **Runtime**      | Bun                                |
| **Framework**    | Next.js 16 (App Router)            |
| **UI**           | React 19, TypeScript               |
| **Styling**      | Tailwind CSS 4, Catppuccin         |
| **Fonts**        | JetBrains Mono, Geist Sans         |
| **API**          | tRPC 11                            |
| **State**        | TanStack React Query 5             |
| **Database**     | SQLite via @libsql/client, Drizzle |
| **Validation**   | Zod                                |
| **Code Quality** | ESLint, Prettier                   |
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
| `bun run lint:check`     | Check for lint errors                |
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
│   ├── fonts/                  # JetBrains Mono font files
│   └── resume-2024.pdf         # Resume document
├── drizzle/                    # Database migrations
├── docs/                       # Documentation assets
└── [config files]              # ESLint, Prettier, TypeScript, etc.
```

## API Endpoints

### `/api/trpc/[trpc]`

tRPC API handler for server-client communication.

### `/dotfiles/boot.sh`

Proxies the bootstrap script from the GitHub dotfiles repository. Use with:

```bash
curl -fsSL https://jordangarcia.dev/dotfiles/boot.sh | bash
```

## Development

### Code Quality

Before committing changes, ensure all checks pass:

```bash
bun run prettier:check    # Check formatting
bun run lint:check        # Check for lint errors
bun run typecheck         # Check TypeScript types
bun run build             # Verify build succeeds
```

Or format and fix issues:

```bash
bun run prettier:write    # Auto-format code
bun run lint              # Run linter
```

### Component Overview

#### `HomeTerminal`

Main homepage component that renders the terminal interface with:

- Animated prompt and command typing
- Neofetch-style ASCII art display
- Personal information grid (bio, work, contact, social links)

#### `TerminalLine`

Reusable component for animated typing effects with:

- Configurable typing speed and delays
- Cursor animation
- Callback support for sequencing animations

#### `TmuxStatusBar`

Interactive status bar component featuring:

- Keyboard shortcut handling (Ctrl+b prefix)
- Multiple panel modes (help, split views)
- Powerline-style visual design

## Acknowledgments

- Built with [Create T3 App](https://create.t3.gg)
- Color theme: [Catppuccin](https://github.com/catppuccin/catppuccin)
- Font: [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
