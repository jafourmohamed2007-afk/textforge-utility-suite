# TextForge codebase, file by file

Each file below is one source file. Create the file at the path shown and paste the code block. Regenerate with `npm run docs:codebase`.

1. [`package.json`](./01-package-json.md) — Dependencies and scripts (runtime deps: next, react, react-dom only).
2. [`tsconfig.json`](./02-tsconfig-json.md) — Strict TypeScript configuration.
3. [`next.config.ts`](./03-next-config-ts.md) — Next.js config with security headers.
4. [`postcss.config.mjs`](./04-postcss-config-mjs.md) — Tailwind CSS v4 PostCSS plugin.
5. [`.env.example`](./05-env-example.md) — Public site URL used for canonical links and JSON-LD.
6. [`.gitignore`](./06-gitignore.md) — Ignored build output.
7. [`lib/types.ts`](./07-lib-types-ts.md) — Serializable engine contracts (tool definitions, options, results).
8. [`lib/site.ts`](./08-lib-site-ts.md) — Site config and the SEO title builder.
9. [`lib/structured-data.ts`](./09-lib-structured-data-ts.md) — SoftwareApplication / HowTo / FAQPage / Breadcrumb JSON-LD builders.
10. [`data/tools-registry.ts`](./10-data-tools-registry-ts.md) — Static tool dictionary that powers every /tools/[slug] page.
11. [`lib/processors/shared.ts`](./11-lib-processors-shared-ts.md) — Shared string helpers for processors.
12. [`lib/processors/whatsapp-formatter.ts`](./12-lib-processors-whatsapp-formatter-ts.md) — whatsapp-text-formatter processor.
13. [`lib/processors/whitespace-cleaner.ts`](./13-lib-processors-whitespace-cleaner-ts.md) — bulk-whitespace-cleaner processor.
14. [`lib/processors/csv-converter.ts`](./14-lib-processors-csv-converter-ts.md) — raw-text-to-csv-converter processor.
15. [`lib/processors/markdown-stripper.ts`](./15-lib-processors-markdown-stripper-ts.md) — markdown-to-clean-text-stripper processor.
16. [`lib/processors/index.ts`](./16-lib-processors-index-ts.md) — Slug -> processor map.
17. [`app/globals.css`](./17-app-globals-css.md) — Tailwind v4 theme tokens, dark mode, 48px tap targets, slider styling.
18. [`app/layout.tsx`](./18-app-layout-tsx.md) — Root layout, default metadata and viewport.
19. [`app/page.tsx`](./19-app-page-tsx.md) — Home page listing all tools.
20. [`app/tools/[slug]/page.tsx`](./20-app-tools-slug-page-tsx.md) — Dynamic tool route: generateStaticParams, generateMetadata, JSON-LD.
21. [`app/not-found.tsx`](./21-app-not-found-tsx.md) — 404 page.
22. [`app/sitemap.ts`](./22-app-sitemap-ts.md) — sitemap.xml generated from the registry.
23. [`app/robots.ts`](./23-app-robots-ts.md) — robots.txt.
24. [`app/manifest.ts`](./24-app-manifest-ts.md) — Web app manifest.
25. [`app/icon.svg`](./25-app-icon-svg.md) — Favicon.
26. [`components/SiteHeader.tsx`](./26-components-siteheader-tsx.md) — Header with tool navigation chips.
27. [`components/SiteFooter.tsx`](./27-components-sitefooter-tsx.md) — Footer.
28. [`components/OptionControl.tsx`](./28-components-optioncontrol-tsx.md) — Touch-friendly select / range / toggle controls.
29. [`components/CopyButton.tsx`](./29-components-copybutton-tsx.md) — Tap-to-copy button with Copied! feedback and fallback.
30. [`components/ToolWorkspace.tsx`](./30-components-toolworkspace-tsx.md) — Client-side input/output workspace engine.
31. [`components/ToolGuide.tsx`](./31-components-toolguide-tsx.md) — E-E-A-T content panels: how-to, syntax table, method, FAQ.
32. [`tests/processors.test.ts`](./32-tests-processors-test-ts.md) — Node test runner unit tests for all processors.
