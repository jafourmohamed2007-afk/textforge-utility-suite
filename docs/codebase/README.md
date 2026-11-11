# FitKB codebase, file by file

Each file below is one source file. Create the file at the path shown and paste the code block. Regenerate with `npm run docs:codebase`.

1. [`package.json`](./01-package-json.md) — Dependencies and scripts (runtime deps: next, react, react-dom only).
2. [`tsconfig.json`](./02-tsconfig-json.md) — Strict TypeScript configuration.
3. [`next.config.ts`](./03-next-config-ts.md) — Next.js config with security headers.
4. [`postcss.config.mjs`](./04-postcss-config-mjs.md) — Tailwind CSS v4 PostCSS plugin.
5. [`.env.example`](./05-env-example.md) — Public site URL used for canonical links and JSON-LD.
6. [`.gitignore`](./06-gitignore.md) — Ignored build output.
7. [`lib/types.ts`](./07-lib-types-ts.md) — Serializable contracts: presets, options, page content.
8. [`lib/site.ts`](./08-lib-site-ts.md) — Site config and the SEO title builder.
9. [`lib/structured-data.ts`](./09-lib-structured-data-ts.md) — SoftwareApplication / HowTo / FAQPage / Breadcrumb JSON-LD builders.
10. [`data/tools-registry.ts`](./10-data-tools-registry-ts.md) — Preset dictionary that powers every /[slug] page.
11. [`lib/image/math.ts`](./11-lib-image-math-ts.md) — Pure geometry and size helpers (crop plans, mm to px, KB limits).
12. [`lib/image/fit.ts`](./12-lib-image-fit-ts.md) — Pure size-targeting search (quality binary search + scale adjustment).
13. [`lib/image/browser.ts`](./13-lib-image-browser-ts.md) — Browser side: decode with EXIF orientation, draw to canvas, encode.
14. [`app/globals.css`](./14-app-globals-css.md) — Tailwind v4 theme tokens, dark mode, 48px tap targets, slider and checkerboard.
15. [`app/layout.tsx`](./15-app-layout-tsx.md) — Root layout, default metadata and viewport.
16. [`app/page.tsx`](./16-app-page-tsx.md) — Home page: free-form resizer plus preset list.
17. [`app/[slug]/page.tsx`](./17-app-slug-page-tsx.md) — Dynamic preset route: generateStaticParams, generateMetadata, JSON-LD.
18. [`app/not-found.tsx`](./18-app-not-found-tsx.md) — 404 page.
19. [`app/sitemap.ts`](./19-app-sitemap-ts.md) — sitemap.xml generated from the registry.
20. [`app/robots.ts`](./20-app-robots-ts.md) — robots.txt.
21. [`app/manifest.ts`](./21-app-manifest-ts.md) — Web app manifest.
22. [`app/icon.svg`](./22-app-icon-svg.md) — Favicon.
23. [`components/SiteHeader.tsx`](./23-components-siteheader-tsx.md) — Header with preset navigation chips.
24. [`components/SiteFooter.tsx`](./24-components-sitefooter-tsx.md) — Footer.
25. [`components/OptionControl.tsx`](./25-components-optioncontrol-tsx.md) — Touch-friendly select / range / toggle controls.
26. [`components/PhotoWorkspace.tsx`](./26-components-photoworkspace-tsx.md) — Client workspace: upload, settings, live compression, preview, download.
27. [`components/ToolGuide.tsx`](./27-components-toolguide-tsx.md) — E-E-A-T content panels: how-to, output spec, method, FAQ.
28. [`tests/image.test.ts`](./28-tests-image-test-ts.md) — Node test runner unit tests for the math and size search.
