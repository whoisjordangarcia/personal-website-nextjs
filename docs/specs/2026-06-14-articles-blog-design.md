# Articles Blog Section — Design Spec

**Date:** 2026-06-14  
**Status:** Approved

---

## Overview

Add a `/articles` section to the personal site. The listing page uses a terminal `ls -la` aesthetic; the article reading view is clean prose. Content is stored as MDX files in the repo — no DB changes, no CMS.

---

## Content Storage

- **Location:** `src/content/articles/*.mdx`
- **Frontmatter fields (required):**
  - `title: string`
  - `slug: string` (matches filename, used for URL)
  - `date: string` (ISO format: `YYYY-MM-DD`)
  - `description: string` (1–2 sentences, used in meta tags)
  - `readingTime: number` (minutes, set manually by author)
- **MDX library:** `next-mdx-remote` with `gray-matter` for frontmatter parsing
- Articles are read at build time via a server-side utility (`src/lib/articles.ts`)

---

## Initial Articles

Four articles to seed the section:

| Slug | Topic |
|------|-------|
| `how-ai-changed-the-way-i-work` | How AI tools boosted productivity |
| `building-drift-ios-on-the-fly` | Building the Drift iOS app |
| `tmux-the-way-i-actually-use-it` | Practical tmux workflow |
| `tailscale-my-personal-network` | Tailscale for personal networking |

---

## Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/articles` | `src/app/articles/page.tsx` | Listing page |
| `/articles/[slug]` | `src/app/articles/[slug]/page.tsx` | Article reading view |

---

## Listing Page (`/articles`)

**Aesthetic:** Terminal `ls -la` output. Matches the homepage terminal theme.

**Layout:**
- Reuses the homepage `<Prompt />` pattern: `jordangarcia@127.0.0.1 ~/articles $ ls -la`
- Each article rendered as a single-line row:
  ```
  -rw-r--r--  2026-06-01  7 min  how-ai-changed-the-way-i-work
  ```
- Columns: file permissions (static, decorative) · date · read time · slug-as-title
- Entire row is a `<Link>` to `/articles/[slug]`

**Colors (Catppuccin):**
- Permissions: `#656989` (muted)
- Date: `#656989` (muted)
- Read time: `#8bd5ca` (teal, matches the `links.md` label color)
- Article title/slug: `#f2d5cf` (pink, matches homepage links)
- Prompt line: `#ED8796` username, `#CAD3F5` path

**Sorting:** Newest first (by `date` field).

**No pagination** — article count is small; add only if it grows past ~20.

---

## Article Reading View (`/articles/[slug]`)

**Aesthetic:** Clean prose. No terminal chrome. Readable and focused.

**Layout:**
- Back link: `← articles` in `#8bd5ca`, top-left
- Title: `text-2xl font-bold text-[#CAD3F5]`
- Metadata row: `date · N min read` in `#656989`
- Body: max-width `65ch`, `text-[#CAD3F5]`, line-height `1.75`
- Background: matches site `#1e2030`

**MDX component overrides:**
- `<h2>`, `<h3>`: Catppuccin yellow `#eed49f`
- `<a>`: `#f2d5cf` with underline on hover
- `<code>` (inline): `#a6da95` on `#2a2d3d` background
- `<pre>` (blocks): dark background, syntax-highlighted via `rehype-pretty-code` with Catppuccin theme
- `<blockquote>`: left border `#8bd5ca`, muted text

**No sidebar, comments, or related posts.**

---

## Utility: `src/lib/articles.ts`

Exports:
- `getAllArticles(): ArticleMeta[]` — reads all MDX frontmatter, returns sorted list
- `getArticle(slug: string): { meta: ArticleMeta; content: string }` — returns single article for rendering

Types:
```ts
type ArticleMeta = {
  title: string;
  slug: string;
  date: string;
  description: string;
  readingTime: number;
};
```

---

## SEO / Meta

- `/articles` page title: `Articles — Jordan Garcia`
- `/articles/[slug]` page title: `{title} — Jordan Garcia`
- Each article gets `description` meta from frontmatter
- Add `/articles` to `sitemap.ts`; add individual article slugs dynamically

---

## Out of Scope

- RSS feed (add later if needed)
- Tags/categories (add later if needed)
- Search (add later if needed)
- Comments
- Admin/authoring UI
