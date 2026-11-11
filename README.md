<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logo-dark.svg">
    <img src="public/logo.svg" alt="FitKB" width="300">
  </picture>
</p>

# FitKB Photo Resizer

FitKB resizes and compresses photos to an exact KB limit for online forms: 10 KB to 1 MB, 35×45 mm and 2×2 inch passport photos, and signatures. It also publishes plain-language guides, a FAQ and the trust pages (About, Contact, Privacy, Terms, Disclaimer) that ad networks and search engines look for. It is built with **Next.js 15 (App Router)**, **strict TypeScript** and **Tailwind CSS v4**. All image processing runs in the browser with the Canvas API, so photos are never uploaded.

| Route | Preset |
| --- | --- |
| `/` | Free-form resizer (any KB limit, any dimensions) |
| `/compress-image-to-10kb` … `/compress-image-to-1mb` | 11 size-limit presets (10, 20, 30, 40, 50, 100, 150, 200, 300, 500 KB, 1 MB) |
| `/passport-size-photo-35x45mm` | 413×531 px crop (35×45 mm at 300 DPI), ≤ 50 KB |
| `/us-passport-photo-2x2` | 600×600 px square crop, ≤ 240 KB |
| `/signature-resize-20kb` | 400×160 px white canvas, signature kept whole, ≤ 20 KB |
| `/guides`, `/guides/[slug]` | 9 explainers (KB vs KiB, rejected uploads, passport pixel sizes, signatures, formats, DPI, HEIC, exam forms) |
| `/faq` | 16 questions in 4 topics, with `FAQPage` JSON-LD |
| `/about`, `/contact`, `/privacy-policy`, `/terms`, `/disclaimer` | Trust and policy pages |
| `/sitemap.xml`, `/robots.txt`, `/ads.txt`, `/opengraph-image` | Generated |

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # unit tests (node:test, no extra deps)
npm run typecheck
npm run build && npm start
```

You need Node 22.18 or newer, because the tests run TypeScript directly with Node's built-in type stripping. Copy `.env.example` to `.env.local` and set at least `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL` before building for production.

## How the size limit is reached

1. The photo is decoded with `createImageBitmap(file, { imageOrientation: "from-image" })`, so phone photos stay upright.
2. `planDraw` works out the canvas and crop for the chosen mode: keep original, fit inside a box, exact size with crop (`cover`), or exact size with white padding (`contain`).
3. `fitToTarget` encodes at quality 0.95. If that is too big, it encodes at the quality floor and binary-searches the highest quality that fits. When even the floor is too big and the dimensions are not fixed, it shrinks the image and repeats. When the first guess was too small, it grows the image back. Fixed-size photos only ever lose quality.
4. The limit is applied as KB × 1000 bytes, so files pass portals that count 1 KB as either 1000 or 1024 bytes.

The search (`lib/image/fit.ts`) and the geometry (`lib/image/math.ts`) are pure functions covered by `tests/image.test.ts`.

## Adding a preset or a guide

- **Preset:** add an entry to `data/tools-registry.ts` with the slug, page text, `preset` settings, spec rows, how-to steps and FAQ. The first 8 entries appear as header chips.
- **Guide:** add an entry to `data/guides.ts`. Write `[label](/path)` for internal links; `npm test` fails if a link points to a page that does not exist, if a guide is under about 2 minutes of reading, or if a title or description is duplicated.

Pages, metadata, structured data, sitemap entries and navigation are generated automatically.

## Google AdSense

Ads are off until you set `NEXT_PUBLIC_ADSENSE_CLIENT`. With it set, the build adds:

- the AdSense script (async, in `<head>`) and the `google-adsense-account` verification meta tag;
- `/ads.txt` with your publisher id;
- the advertising and cookie section Google requires in `/privacy-policy`, plus matching lines in the terms, disclaimer and footer;
- optional fixed ad slots (`components/AdSlot.tsx`) when `NEXT_PUBLIC_ADSENSE_SLOT` is also set. Each slot is labelled "Advertisement", reserves its height so the page does not shift, and sits between content sections, never next to the upload or Download buttons, which AdSense forbids because it causes accidental clicks.

### Launch and approval checklist

1. Deploy on your own domain (for example with Vercel or any Node host) and set `NEXT_PUBLIC_SITE_URL` to it. AdSense does not approve free subdomains.
2. Create the contact mailbox and set `NEXT_PUBLIC_CONTACT_EMAIL`. Optionally set `NEXT_PUBLIC_OWNER_NAME`.
3. Add the site to Google Search Console, submit `/sitemap.xml`, and wait until the pages show as indexed.
4. Let it collect some real organic traffic first. There is no published minimum, but sites with no visitors are often refused as "low value content".
5. Sign up at AdSense, set `NEXT_PUBLIC_ADSENSE_CLIENT`, redeploy, and request review.
6. In AdSense, under Privacy & messaging, turn on the European regulations (GDPR) consent message. Google requires a certified consent message for visitors from the EEA, the UK and Switzerland, and the privacy policy says one is shown.
7. After approval, choose Auto ads, or create one responsive Display unit and set `NEXT_PUBLIC_ADSENSE_SLOT`.

Approval and traffic are decided by Google, so nothing in the code can guarantee them. What the site does is meet the published requirements: original content, clear navigation, policy pages, contact details, no deceptive ad placement, and fast pages that work on phones.

## Performance, UX and SEO

- **Runtime dependencies:** `next`, `react` and `react-dom` only. There are no UI kits, web fonts or analytics; the only third-party script is AdSense, and only when you enable it.
- **Static generation:** all 40 routes are pre-rendered at build time (`dynamicParams = false`). Unknown slugs return a static 404.
- **Download:** a full-width Download button under the preview shows the format and final size, and changes to "Downloaded" when tapped. On phones that support sharing files, a Share button saves straight to Photos. File names include the limit, such as `IMG_2041-20kb.jpg`.
- **No layout shift:** upload and result previews have fixed heights. The stats strip has a reserved height. The width and height fields are always shown, and are disabled when they don't apply, so nothing jumps.
- **Touch:** every control is at least 48×48 px. Number fields use a 16 px font, so iOS does not zoom when you tap them.
- **Ways to add a photo:** tap to pick one (gallery or camera), drag and drop, or paste.
- **Metadata:** titles follow `"<Preset> Online - Free Photo Resizer (2026 Mobile Friendly)"`. Each preset page includes `SoftwareApplication`, `HowTo`, `FAQPage` and `BreadcrumbList` JSON-LD, plus how-to, specification, methodology and FAQ sections that match the structured data. Guides use `Article` JSON-LD with published and updated dates, a quick answer at the top, a table of contents, and links to the matching tools. Tool pages link back to related guides.

## Logo and icons

The mark is a crop frame with an arrow landing on the size-limit line: "fit under the limit".

| File | Use |
| --- | --- |
| `app/icon.svg`, `app/favicon.ico` (48 px) | Browser tab and Google Search favicon |
| `app/apple-icon.png` (180 px) | iPhone home screen |
| `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-512.png` | Installable web app (manifest) |
| `public/logo.svg`, `public/logo-dark.svg`, `public/logo-wordmark.png` | Mark plus wordmark for light and dark backgrounds |
| `components/Logo.tsx` | The same artwork inline in the header and footer |

The Organization JSON-LD points to `icon-512.png` as the logo, and the social preview image uses the mark.

## Reviewing on mobile

`docs/codebase/` contains one Markdown file per source file. Regenerate it with `npm run docs:codebase`.
