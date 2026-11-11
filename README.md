# FitKB Photo Resizer

FitKB resizes and compresses photos to an exact KB limit for online forms: 10 KB, 20 KB, 50 KB, 100 KB and 200 KB, 35×45 mm and 2×2 inch passport photos, and signatures. It is built with **Next.js 15 (App Router)**, **strict TypeScript** and **Tailwind CSS v4**. All image processing runs in the browser with the Canvas API, so photos are never uploaded.

| Route | Preset |
| --- | --- |
| `/` | Free-form resizer (any KB limit, any dimensions) |
| `/compress-image-to-10kb` … `/compress-image-to-200kb` | Size-limit presets |
| `/passport-size-photo-35x45mm` | 413×531 px crop (35×45 mm at 300 DPI), ≤ 50 KB |
| `/us-passport-photo-2x2` | 600×600 px square crop, ≤ 240 KB |
| `/signature-resize-20kb` | 400×160 px white canvas, signature kept whole, ≤ 20 KB |

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # unit tests (node:test, no extra deps)
npm run typecheck
npm run build && npm start
```

You need Node 22.18 or newer, because the tests run TypeScript directly with Node's built-in type stripping. Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) before building for production so canonical URLs, the sitemap and the JSON-LD point at your domain.

## How the size limit is reached

1. The photo is decoded with `createImageBitmap(file, { imageOrientation: "from-image" })`, so phone photos stay upright.
2. `planDraw` works out the canvas and crop for the chosen mode: keep original, fit inside a box, exact size with crop (`cover`), or exact size with white padding (`contain`).
3. `fitToTarget` encodes at quality 0.95. If that is too big, it encodes at the quality floor and binary-searches the highest quality that fits. When even the floor is too big and the dimensions are not fixed, it shrinks the image and repeats. When the first guess was too small, it grows the image back. Fixed-size photos only ever lose quality.
4. The limit is applied as KB × 1000 bytes, so files pass portals that count 1 KB as either 1000 or 1024 bytes.

The search (`lib/image/fit.ts`) and the geometry (`lib/image/math.ts`) are pure functions covered by `tests/image.test.ts`.

## Adding a preset

Add an entry to `data/tools-registry.ts` with the slug, page text, `preset` settings, spec rows, how-to steps and FAQ. The page, metadata, structured data, sitemap entry and navigation are generated automatically.

## Performance, UX and SEO

- **Runtime dependencies:** `next`, `react` and `react-dom` only. There are no UI kits, web fonts or third-party scripts.
- **Static generation:** every preset page is pre-rendered at build time (`dynamicParams = false`). Unknown slugs return a static 404.
- **No layout shift:** upload and result previews have fixed heights. The stats strip has a reserved height. The width and height fields are always shown, and are disabled when they don't apply, so nothing jumps.
- **Touch:** every control is at least 48×48 px. Number fields use a 16 px font, so iOS does not zoom when you tap them.
- **Ways to add a photo:** tap to pick one (gallery or camera), drag and drop, or paste.
- **Metadata:** titles follow `"<Preset> Online - Free Photo Resizer (2026 Mobile Friendly)"`. Each preset page includes `SoftwareApplication`, `HowTo`, `FAQPage` and `BreadcrumbList` JSON-LD, plus how-to, specification, methodology and FAQ sections that match the structured data.

## Reviewing on mobile

`docs/codebase/` contains one Markdown file per source file. Regenerate it with `npm run docs:codebase`.
