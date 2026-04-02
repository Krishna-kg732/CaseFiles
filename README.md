# CaseFiles

> Production system failure postmortems, documented as criminal case files.

A static blog built with **Astro 4.x** + **Tailwind CSS** + **TypeScript**. Drop a single `.md` file into `src/content/cases/` and the full UI renders automatically — zero per-post UI work.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev            # → http://localhost:4321

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Adding a New Case

**That's the whole DX — three steps:**

1. **Copy the template:**
   ```bash
   cp src/content/cases/_TEMPLATE.md src/content/cases/my-incident-slug.md
   ```

2. **Fill in the frontmatter** (the YAML block at the top). Every field drives UI automatically:
   - `title`, `caseNumber`, `summary` → card + header + OG image
   - `domain` → filing cabinet tab
   - `severity` → color-coded stamp (P0 red, P1 amber, P2 yellow, P3 blue)
   - `timeline` → animated red-thread timeline
   - `actionItems` → tri-color checklist with progress bar
   - `evidence` → polaroid grid with lightbox
   - `systems` → auto-links related cases

3. **Write the body** in Markdown/MDX below the frontmatter. Suggested sections:
   - `## What happened`
   - `## Root cause`
   - `## What we did to fix it`
   - `## What we should have done differently`

**That's it.** Save the file, the dev server hot-reloads, and the case appears in the filing cabinet.

---

## Draft Mode

Set `draft: true` in any case file's frontmatter to hide it from production builds. Drafts:

- ✅ **Visible** in `npm run dev` (local development)
- ❌ **Hidden** in `npm run build` (production)

This means you can commit work-in-progress cases to the repo without them appearing on the live site. When ready, just flip `draft: false`.

---

## Deployment

Push to `main` → Vercel auto-deploys.

The project is configured with:
- `vercel.json` — build settings and OG image caching headers
- `@astrojs/vercel` adapter — hybrid output (static SSG + server-side OG endpoint)
- `.nvmrc` — pins Node.js 22

Vercel will:
1. Install dependencies
2. Run `npm run build`
3. Deploy static HTML + one serverless function (OG image generation)

---

## Project Structure

```
src/
├── content/
│   ├── config.ts              ← Zod schema for case frontmatter
│   └── cases/
│       ├── _TEMPLATE.md       ← Copy this to create a new case
│       └── *.md               ← Your cases go here
├── components/
│   ├── case/                  ← CaseCard, CaseHeader, MetaBar, Timeline, etc.
│   ├── index/                 ← FilingCabinet, DomainTab, SeverityCalendar, SearchBar
│   └── global/                ← Nav, Footer, SEOHead
├── layouts/
│   ├── BaseLayout.astro       ← HTML shell + dark mode + view transitions
│   └── CaseLayout.astro       ← Case detail wrapper + reading progress bar
├── pages/
│   ├── index.astro            ← Filing cabinet index
│   ├── cases/[slug].astro     ← Case detail pages (auto-generated)
│   ├── domain/[domain].astro  ← Domain-filtered views
│   └── api/og/[slug].ts       ← OG image generation (SVG)
├── lib/                       ← Utility functions (cases, severity, reading-time)
├── store/                     ← Nanostores (read cases, bookmarks, filters)
├── styles/                    ← Global CSS + Tailwind base
└── types/                     ← TypeScript types
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build (SSG + serverless) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome |
| `npm run test` | Run tests with Vitest |

---

## Tech Stack

- **Astro 4.x** — Static site generation with content collections
- **Tailwind CSS 3.x** — Custom manila/stamp theme with dark mode
- **TypeScript** — Strict mode throughout
- **Framer Motion** — React islands for animations
- **nanostores** — Persistent state (read cases, bookmarks, filters)
- **fuse.js** — Client-side fuzzy search
- **Biome** — Linting + formatting
- **Vitest** — Unit testing
