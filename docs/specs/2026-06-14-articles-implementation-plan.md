# Articles Blog Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/articles` listing page (terminal `ls -la` aesthetic) and `/articles/[slug]` reading view (clean prose) backed by MDX files in the repo.

**Architecture:** MDX files live in `src/content/articles/`. A utility (`src/lib/articles.ts`) reads frontmatter with `gray-matter` and returns sorted article metadata. The listing page and article page are async server components; the article page renders MDX via `next-mdx-remote/rsc` with `rehype-pretty-code` for syntax highlighting.

**Tech Stack:** Next.js 16 App Router, `next-mdx-remote`, `gray-matter`, `rehype-pretty-code`, Vitest, Tailwind CSS 4, Catppuccin palette, Bun.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/content/articles/*.mdx` | Article content (4 seed files) |
| Create | `src/lib/articles.ts` | `getAllArticles()` / `getArticle()` utilities |
| Create | `src/lib/articles.test.ts` | Unit tests for the utility |
| Create | `src/lib/__fixtures__/articles/*.mdx` | Test fixture MDX files |
| Create | `src/app/articles/page.tsx` | Listing page |
| Create | `src/app/articles/[slug]/page.tsx` | Article reading view |
| Modify | `src/app/sitemap.ts` | Add `/articles` + individual slugs |

---

## Task 1: Install Dependencies

**Files:** `package.json`, `bun.lock`

- [ ] **Step 1: Install runtime deps**

```bash
bun add next-mdx-remote gray-matter rehype-pretty-code
```

Expected: `bun.lock` updated, no errors.

- [ ] **Step 2: Verify installs resolved**

```bash
bun run typecheck
```

Expected: Passes (new packages have their own types bundled).

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: add next-mdx-remote, gray-matter, rehype-pretty-code"
```

---

## Task 2: Create Test Fixtures

**Files:**
- Create: `src/lib/__fixtures__/articles/test-article-one.mdx`
- Create: `src/lib/__fixtures__/articles/test-article-two.mdx`

- [ ] **Step 1: Create fixture directory and first MDX file**

Create `src/lib/__fixtures__/articles/test-article-one.mdx`:

```mdx
---
title: Test Article One
slug: test-article-one
date: "2026-05-01"
description: First fixture article for testing.
readingTime: 3
---

# Test Article One

This is the content of test article one.
```

- [ ] **Step 2: Create second fixture MDX file**

Create `src/lib/__fixtures__/articles/test-article-two.mdx`:

```mdx
---
title: Test Article Two
slug: test-article-two
date: "2026-06-01"
description: Second fixture article for testing.
readingTime: 5
---

# Test Article Two

This is the content of test article two.
```

- [ ] **Step 3: Commit fixtures**

```bash
git add src/lib/__fixtures__/
git commit -m "test: add MDX fixtures for articles utility tests"
```

---

## Task 3: Write Failing Tests for Articles Utility

**Files:**
- Create: `src/lib/articles.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/articles.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { getAllArticles, getArticle } from "./articles";

const FIXTURES_DIR = resolve(__dirname, "./__fixtures__/articles");

describe("getAllArticles", () => {
  it("returns all articles as ArticleMeta objects", async () => {
    const articles = await getAllArticles(FIXTURES_DIR);
    expect(articles).toHaveLength(2);
  });

  it("returns articles sorted newest first by date", async () => {
    const articles = await getAllArticles(FIXTURES_DIR);
    expect(articles[0]!.date).toBe("2026-06-01");
    expect(articles[1]!.date).toBe("2026-05-01");
  });

  it("returns correct frontmatter fields", async () => {
    const articles = await getAllArticles(FIXTURES_DIR);
    const article = articles.find((a) => a.slug === "test-article-two");
    expect(article).toMatchObject({
      title: "Test Article Two",
      slug: "test-article-two",
      date: "2026-06-01",
      description: "Second fixture article for testing.",
      readingTime: 5,
    });
  });
});

describe("getArticle", () => {
  it("returns meta and content for a valid slug", async () => {
    const { meta, content } = await getArticle("test-article-one", FIXTURES_DIR);
    expect(meta.title).toBe("Test Article One");
    expect(content).toContain("content of test article one");
  });

  it("throws for a slug that does not exist", async () => {
    await expect(getArticle("does-not-exist", FIXTURES_DIR)).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
DATABASE_URL="file:local.db" bunx vitest run src/lib/articles.test.ts
```

Expected: FAIL — `Cannot find module './articles'`

---

## Task 4: Implement Articles Utility

**Files:**
- Create: `src/lib/articles.ts`

- [ ] **Step 1: Implement the utility**

Create `src/lib/articles.ts`:

```ts
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

export type ArticleMeta = {
  title: string;
  slug: string;
  date: string;
  description: string;
  readingTime: number;
};

export type Article = {
  meta: ArticleMeta;
  content: string;
};

const DEFAULT_DIR = join(process.cwd(), "src/content/articles");

export async function getAllArticles(dir = DEFAULT_DIR): Promise<ArticleMeta[]> {
  const files = await readdir(dir);
  const mdxFiles = files.filter((f) => f.endsWith(".mdx"));

  const articles = await Promise.all(
    mdxFiles.map(async (filename) => {
      const raw = await readFile(join(dir, filename), "utf-8");
      const { data } = matter(raw);
      return {
        title: data.title as string,
        slug: data.slug as string,
        date: data.date as string,
        description: data.description as string,
        readingTime: data.readingTime as number,
      };
    }),
  );

  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticle(
  slug: string,
  dir = DEFAULT_DIR,
): Promise<Article> {
  const raw = await readFile(join(dir, `${slug}.mdx`), "utf-8");
  const { data, content } = matter(raw);
  return {
    meta: {
      title: data.title as string,
      slug: data.slug as string,
      date: data.date as string,
      description: data.description as string,
      readingTime: data.readingTime as number,
    },
    content,
  };
}
```

- [ ] **Step 2: Run tests to confirm they pass**

```bash
DATABASE_URL="file:local.db" bunx vitest run src/lib/articles.test.ts
```

Expected: PASS — 5 tests passing.

- [ ] **Step 3: Run full test suite to check no regressions**

```bash
DATABASE_URL="file:local.db" bunx vitest run
```

Expected: All existing tests still pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/articles.ts src/lib/articles.test.ts
git commit -m "feat: add articles utility with getAllArticles and getArticle"
```

---

## Task 5: Create Four Seed Articles

**Files:**
- Create: `src/content/articles/how-ai-changed-the-way-i-work.mdx`
- Create: `src/content/articles/building-drift-ios-on-the-fly.mdx`
- Create: `src/content/articles/tmux-the-way-i-actually-use-it.mdx`
- Create: `src/content/articles/tailscale-my-personal-network.mdx`

- [ ] **Step 1: Create the AI productivity article**

Create `src/content/articles/how-ai-changed-the-way-i-work.mdx`:

```mdx
---
title: How AI Changed the Way I Work
slug: how-ai-changed-the-way-i-work
date: "2026-06-01"
description: A year of using AI tools daily changed how I think about writing code — not by replacing thinking, but by changing what I think about.
readingTime: 6
---

A year ago I was skeptical. AI-assisted coding felt like autocomplete that occasionally got lucky. Now it&apos;s the first tool I reach for, and not because it writes code for me — it&apos;s because it changed what I spend my focus on.

## The shift

The biggest change isn&apos;t speed. It&apos;s that I stopped writing boilerplate from memory and started writing intent from thought. When I&apos;m building a feature, I&apos;m thinking about what it should do, not how to spell the API. The gap between "I know what this needs to do" and "I have working code" collapsed.

That sounds like a small thing. It isn&apos;t. Boilerplate is cognitively cheap but attention-expensive. Every context switch to look up a method signature is a context switch away from the actual problem.

## What changed in practice

**Code review:** I use Claude to review my own PRs before I open them. Not to catch bugs — I do that — but to ask "is there a simpler way to do this?" It finds things I&apos;m too close to see.

**Exploration:** When I&apos;m in a new codebase or new domain (genomics tooling, for example), I can ask questions about the shape of the problem before I write a line. That used to require hours of docs reading.

**Writing:** This post was outlined with AI. Not written — outlined. There&apos;s a difference.

## What didn&apos;t change

My job is still to understand the problem. AI doesn&apos;t know what &quot;correct&quot; means for my specific codebase, my users, my constraints. It&apos;s a powerful executor of clear intent — but the intent has to come from somewhere.

The engineers I&apos;ve seen struggle with AI tools are the ones who use them as a substitute for understanding. The ones who thrive treat it like a fast, well-read collaborator who needs good direction.

## The honest accounting

I ship faster. I explore more. I spend less time on the parts of engineering that felt like taxes and more time on the parts that feel like craft. That&apos;s the real change.

The tools will keep improving. The bottleneck will keep moving closer to the thing that matters: figuring out what to build and why.
```

- [ ] **Step 2: Create the Drift iOS article**

Create `src/content/articles/building-drift-ios-on-the-fly.mdx`:

```mdx
---
title: Building Drift — My iOS App for On-the-Fly Ideas
slug: building-drift-ios-on-the-fly
date: "2026-05-10"
description: I built my own iOS app because nothing existing fit how I actually think. Here&apos;s what building Drift taught me about iOS development and product design.
readingTime: 7
---

I built Drift because I kept reaching for my phone to capture something — a thought, a URL, a task — and every app I tried felt like it was designed for someone else&apos;s workflow.

So I built my own. That turned out to be one of the better decisions I&apos;ve made.

## Why build instead of buy

I&apos;ve used Notion, Bear, Apple Notes, Obsidian, and half a dozen others. Each has strengths. None of them fit the specific thing I wanted: a place for things that don&apos;t have a home yet. Not tasks. Not notes. Not bookmarks. Ideas in transit.

Drift is that. It&apos;s a fast-capture surface that gets out of the way. Open, type, close. No organization required at capture time.

## What building iOS taught me

**SwiftUI is genuinely good.** Coming from web (React, TypeScript), I expected a steeper curve. The declarative model translates well. State management is different but not alien.

**The platform constraints are the feature.** iOS forces decisions that web never does. How does this behave with a hardware keyboard? What happens on a small screen? Does this feel right to swipe away? Those constraints made the product better.

**Xcode is the hard part.** The editor is fine. The build system, signing, and simulator workflow add friction that has nothing to do with your product. I spend more time fighting Xcode than Swift.

## The architecture

Drift is simple on purpose:

- SwiftUI for all UI
- SwiftData for local persistence
- iCloud sync via CloudKit (automatic with SwiftData)
- No server, no accounts, no backend

The &quot;no server&quot; decision was deliberate. I didn&apos;t want to maintain infrastructure for a personal tool. Everything lives on device and syncs through iCloud. It&apos;s fast, it works offline, and I don&apos;t have a database to keep up.

## What I&apos;d do differently

Start with the interaction model, not the data model. I built Drift data-first (SwiftData schema before UI), which led to a first version that worked correctly but didn&apos;t feel right. The feel came from rebuilding the interaction layer with the data model adjusted to serve it, not the other way around.

## What Drift taught me about products

Building something you use every day gives you feedback no user research can. I know exactly when it feels slow, when a gesture is wrong, when a label doesn&apos;t say the right thing. I&apos;ve shipped more improvements to Drift in six months than most products ship in a year — because the feedback loop is instant.

If you&apos;re a developer who uses your own tools, build more of them. The practice compounds.
```

- [ ] **Step 3: Create the tmux article**

Create `src/content/articles/tmux-the-way-i-actually-use-it.mdx`:

```mdx
---
title: tmux — The Way I Actually Use It
slug: tmux-the-way-i-actually-use-it
date: "2026-04-15"
description: Not a tutorial. A description of the tmux setup I actually use every day, and why the specific choices matter.
readingTime: 5
---

I&apos;ve read a lot of tmux tutorials. They all explain what tmux does. Fewer explain how to think about it, which is the part that takes the longest to develop.

This isn&apos;t a tutorial. It&apos;s a description of how I actually use tmux after a few years of iteration.

## The mental model that changed everything

tmux is not a tab system. It&apos;s a persistent workspace manager. The shift that made it click: sessions outlive your terminal. Close the terminal, reopen it, `tmux attach` — everything is exactly where you left it.

Once I understood that, I stopped thinking of tmux as a way to have multiple windows. I started thinking of it as a way to have multiple contexts that I move between, each of which maintains state indefinitely.

## How I structure sessions

One session per project. Not one session per day, not one giant session with a lot of windows. One per project.

```bash
tmux new-session -s personal-site
tmux new-session -s nest-api
tmux new-session -s dotfiles
```

When I switch projects, I switch sessions. `prefix + $` to rename, `prefix + s` to list and jump. The list view is fast — faster than any launcher I&apos;ve tried.

## Window layout inside a session

Each session typically has 3–4 windows:

- **editor** — Neovim, full screen
- **shell** — general commands, git, misc
- **server** — dev server / long-running process
- **scratch** — throw-away experimentation

`prefix + c` to create, `prefix + ,` to rename, `prefix + [0-9]` to jump. I use numbers, not names, because muscle memory beats reading.

## The config choices that matter

I use `prefix = Ctrl-a` instead of the default `Ctrl-b`. `Ctrl-a` is reachable without moving my hand.

```bash
set -g prefix C-a
unbind C-b
bind C-a send-prefix
```

I set `base-index 1` so windows are numbered 1–9, which maps to the keyboard layout instead of starting at 0.

Mouse mode is on (`set -g mouse on`). I know some people consider this heresy. I disagree. Mouse support for resizing panes saves time. I still navigate with keys.

## The part nobody mentions

The reason tmux is worth learning is not the features. It&apos;s that it enforces a discipline of context. When everything is one session with 20 windows, everything is jumbled. When each project is a named session, switching between them is intentional. That intentionality matters for focus.

tmux is good because it makes the structure of your work explicit.
```

- [ ] **Step 4: Create the Tailscale article**

Create `src/content/articles/tailscale-my-personal-network.mdx`:

```mdx
---
title: Tailscale — My Personal Network
slug: tailscale-my-personal-network
date: "2026-03-20"
description: Tailscale made my personal infrastructure actually usable. Here&apos;s what I run on it and why it changed how I think about access.
readingTime: 4
---

For years I ran a VPN server because I wanted to access my home network remotely. It worked, mostly, but it was something I maintained rather than something I used. Tailscale replaced all of that, and I haven&apos;t thought about it since.

## What Tailscale is

Tailscale is a mesh VPN built on WireGuard. Every device you add gets a stable private IP (`100.x.x.x` range) and can reach every other device on your tailnet, regardless of what network either device is on.

The key difference from a traditional VPN: there&apos;s no central server that traffic routes through. Devices connect directly to each other when possible, falling back to relay servers only when NAT traversal fails. The result is low latency that feels local even when you&apos;re remote.

## What I run on it

**Home server access.** I have a Mac Mini running a few local services — a media server, a local AI model endpoint, backups. All of it is accessible from my phone or laptop anywhere in the world via stable Tailscale hostnames.

**SSH everywhere.** `ssh mini.tail.ts.net` works from my phone (via Termius), from a coffee shop, from anywhere. No port forwarding, no public IP, no firewall rules to maintain.

**Subnet routing.** My router acts as a subnet router, which means my entire home network (`192.168.1.0/24`) is reachable via Tailscale without installing the client on every device. Printers, smart home devices, everything.

## The iOS integration

The Tailscale iOS app runs as a VPN profile. Split tunneling means only traffic to tailnet addresses goes through it — everything else hits the internet directly. Battery impact is negligible.

I use it with Termius for SSH and with Prompt for web services on my home server. Having a real terminal on my phone that can reach my home machines changed how I work when I&apos;m away from my desk.

## Why it works

The magic is that it requires almost no ongoing maintenance. I installed the client on each device once, they joined the tailnet, done. No certificates to renew, no server to keep up, no firewall rules to audit.

The one thing I&apos;d add: set up MagicDNS immediately. It gives each device a stable hostname (`macmini.yourtailnet.ts.net`) instead of requiring you to remember IPs. Combined with a exit node for when I want full tunnel behavior, the setup covers every use case I&apos;ve had.

The honest summary: Tailscale made my personal infrastructure something I use instead of something I maintain.
```

- [ ] **Step 5: Commit seed articles**

```bash
git add src/content/articles/
git commit -m "content: add four seed articles (AI, Drift, tmux, Tailscale)"
```

---

## Task 6: Create the Listing Page

**Files:**
- Create: `src/app/articles/page.tsx`

- [ ] **Step 1: Create the listing page**

Create `src/app/articles/page.tsx`:

```tsx
import { getAllArticles } from "@/lib/articles";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles — Jordan Garcia",
  description:
    "Writing on tooling, iOS development, AI, and the craft of building software.",
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <main className="px-8 py-8 pb-24 lg:w-3/5">
      <div className="font-mono text-base text-[#CAD3F5]">
        <p className="mb-6">
          <span className="text-[#ED8796]">jordangarcia@127.0.0.1</span>{" "}
          <span className="text-[#CAD3F5]">~/articles $</span>{" "}
          <span>ls -la</span>
        </p>
        <ul className="space-y-1">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="group flex gap-4 hover:brightness-110"
              >
                <span className="text-[#656989]">-rw-r--r--</span>
                <span className="text-[#656989]">{article.date}</span>
                <span className="text-[#8bd5ca]">{article.readingTime} min</span>
                <span className="text-[#f2d5cf] group-hover:underline">
                  {article.slug}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
bun run typecheck
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/articles/page.tsx
git commit -m "feat: add /articles listing page with terminal ls-la aesthetic"
```

---

## Task 7: Create the Article Reading View

**Files:**
- Create: `src/app/articles/[slug]/page.tsx`

- [ ] **Step 1: Create the article page**

Create `src/app/articles/[slug]/page.tsx`:

```tsx
import { getArticle, getAllArticles } from "@/lib/articles";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import rehypePrettyCode from "rehype-pretty-code";

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-8 mb-4 text-xl font-bold text-[#eed49f]" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-6 mb-3 text-lg font-semibold text-[#eed49f]" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-[#f2d5cf] underline hover:brightness-110"
      {...props}
    />
  ),
  code: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    // rehype-pretty-code adds data-language to fenced code blocks; leave those unstyled here
    if ("data-language" in props) {
      return <code {...props}>{children}</code>;
    }
    return (
      <code
        className="rounded bg-[#2a2d3d] px-1.5 py-0.5 text-sm text-[#a6da95]"
        {...props}
      >
        {children}
      </code>
    );
  },
  blockquote: (
    props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
  ) => (
    <blockquote
      className="my-4 border-l-4 border-[#8bd5ca] pl-4 text-[#a5adcb] italic"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-4 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 list-disc space-y-1 pl-6" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 list-decimal space-y-1 pl-6" {...props} />
  ),
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = await getArticle(slug);
    return {
      title: `${meta.title} — Jordan Garcia`,
      description: meta.description,
    };
  } catch {
    return { title: "Article Not Found — Jordan Garcia" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article;
  try {
    article = await getArticle(slug);
  } catch {
    notFound();
  }

  const { meta, content } = article;

  return (
    <main className="px-8 py-8 pb-24 lg:w-3/5">
      <Link
        href="/articles"
        className="text-sm text-[#8bd5ca] hover:underline"
      >
        ← articles
      </Link>
      <h1 className="mt-6 mb-2 text-2xl font-bold text-[#CAD3F5]">
        {meta.title}
      </h1>
      <p className="mb-8 text-sm text-[#656989]">
        {meta.date} · {meta.readingTime} min read
      </p>
      <div className="max-w-[65ch] text-[#CAD3F5]">
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [rehypePrettyCode, { theme: "catppuccin-macchiato" }],
              ],
            },
          }}
        />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
bun run typecheck
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/articles/[slug]/page.tsx
git commit -m "feat: add /articles/[slug] reading view with MDX rendering"
```

---

## Task 8: Update Sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Update sitemap to include articles**

Replace the contents of `src/app/sitemap.ts` with:

```ts
import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles();
  const siteUrl = "https://jordangarcia.me";

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articleEntries,
  ];
}
```

- [ ] **Step 2: Verify typecheck passes**

```bash
bun run typecheck
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add /articles and individual article slugs to sitemap"
```

---

## Task 9: Final CI Gates Check

- [ ] **Step 1: Run typecheck**

```bash
bun run typecheck
```

Expected: No errors.

- [ ] **Step 2: Run lint**

```bash
bun run lint
```

Expected: No errors.

- [ ] **Step 3: Run prettier check**

```bash
bun run prettier:check
```

If it fails, auto-fix with:
```bash
bun run prettier:write
git add -A
git commit -m "chore: format articles files"
```

- [ ] **Step 4: Run full test suite**

```bash
DATABASE_URL="file:local.db" bunx vitest run
```

Expected: All tests pass (existing + new articles tests).

- [ ] **Step 5: Smoke test locally**

```bash
DATABASE_URL="file:local.db" bun run dev
```

Visit `http://localhost:3000/articles` — verify the `ls -la` listing renders.
Click an article — verify the prose reading view renders with syntax-highlighted code blocks.
