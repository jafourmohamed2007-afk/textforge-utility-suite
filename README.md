# TextForge Dynamic Tool Suite

Private, mobile-first text utilities built with **Next.js 15 (App Router)**, **strict TypeScript** and **Tailwind CSS v4**. All processing runs in the browser with native string methods. Nothing is sent to a server.

| Route | Tool |
| --- | --- |
| `/tools/whatsapp-text-formatter` | Plain text → WhatsApp bold / italic / strikethrough / monospace / lists, plus Markdown → WhatsApp |
| `/tools/bulk-whitespace-cleaner` | Trailing spaces, tab indentation, repeated spaces, triple line breaks, invisible characters |
| `/tools/raw-text-to-csv-converter` | Comma / tab / semicolon / pipe / aligned text → RFC 4180 CSV with table preview |
| `/tools/markdown-to-clean-text-stripper` | Markdown (headings, emphasis, links, code, tables, HTML) → plain text |

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # processor unit tests (node:test, no extra deps)
npm run typecheck
npm run build && npm start
```

You need Node 22.18 or newer, because the tests run TypeScript directly with Node's built-in type stripping. Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) before building for production so canonical URLs, the sitemap and the JSON-LD point at your domain.

## Architecture

```
data/tools-registry.ts     Static, serializable tool dictionary (copy, options, how-to, syntax, FAQ)
lib/processors/*.ts        Pure (input, options) => result functions, one per tool
lib/processors/index.ts    slug -> processor map
app/tools/[slug]/page.tsx  generateStaticParams + generateMetadata + JSON-LD + layout
components/ToolWorkspace   Client island: options, input/output panes, copy, download, stats
components/ToolGuide       Server-rendered how-to, syntax reference, methodology and FAQ
```

### Adding a tool

1. Add an entry to `data/tools-registry.ts` (slug, copy, options, howTo, syntax, faq).
2. Write `lib/processors/<name>.ts` that exports `(input: string, options: OptionValues) => ProcessResult`.
3. Register it in `lib/processors/index.ts`.

The page, metadata, structured data, sitemap entry and navigation are generated automatically.

## Performance and UX choices

- **Runtime dependencies:** `next`, `react` and `react-dom` only. There are no UI kits, icon packs, web fonts, analytics or third-party scripts. Fonts use the system stack, so no font swap shifts the layout.
- **Static generation:** every tool page is pre-rendered at build time (`dynamicParams = false`). Unknown slugs return a static 404.
- **Zero layout shift:** panes use fixed heights (`h-64 / sm:h-80 / lg:h-[30rem]`). The Copy button has a fixed width, so its "Copied!" state does not resize it. The stats strip has a reserved minimum height. Measured CLS is 0 on a Pixel 7 profile and at 1366×900.
- **Smooth typing:** processing runs through `useDeferredValue` + `useMemo`, so typing stays responsive on low-end phones even with large inputs.
- **Touch:** every button, select, toggle, slider and FAQ summary is at least 48×48 px. The sliders have a 28 px thumb. Form controls use a 16 px font, so iOS does not zoom when you tap them.
- **Clipboard:** the async Clipboard API is used where available. When it is not, the button falls back to a selection-based `execCommand("copy")` and shows "Copied!" or "Copy failed". The Paste button falls back to focusing the input with a hint to long-press.

## SEO

- `generateMetadata` builds the title as `"<Tool Name> Online - Free Text Formatter Tool (2026 Mobile Friendly)"`, along with the description, keywords, canonical, Open Graph and Twitter tags.
- Each tool page includes a JSON-LD `@graph` with `SoftwareApplication` (free `Offer`), `HowTo`, `FAQPage`, `BreadcrumbList` and `Organization`. The JSON is escaped so it cannot break out of the script tag. Next.js recommends rendering JSON-LD as a `<script>` in the page component. Google reads it anywhere in the document.
- Under the workspace, each page has server-rendered how-to steps, a syntax reference table, a methodology/privacy section with a "last reviewed" date, an FAQ and related tools. This text matches the structured data.
- `sitemap.xml`, `robots.txt` and `manifest.webmanifest` are generated from the registry.

## Reviewing on mobile

`docs/codebase/` contains one Markdown file per source file (numbered in build order, each with its path and a single code block). Regenerate it after changes with `npm run docs:codebase`.
