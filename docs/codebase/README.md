# FitKB codebase, file by file

Each file below is one source file. Create the file at the path shown and paste the code block. Regenerate with `npm run docs:codebase`.

1. [`package.json`](./01-package-json.md) — Dependencies and scripts (runtime deps: next, react, react-dom only).
2. [`tsconfig.json`](./02-tsconfig-json.md) — Strict TypeScript configuration.
3. [`next.config.ts`](./03-next-config-ts.md) — Next.js config with security headers.
4. [`postcss.config.mjs`](./04-postcss-config-mjs.md) — Tailwind CSS v4 PostCSS plugin.
5. [`.env.example`](./05-env-example.md) — Site URL, contact email, owner name and AdSense settings.
6. [`.gitignore`](./06-gitignore.md) — Ignored build output.
7. [`lib/types.ts`](./07-lib-types-ts.md) — Serializable contracts: presets, options, guides and content blocks.
8. [`lib/site.ts`](./08-lib-site-ts.md) — Site config, AdSense and contact settings, and the SEO title builder.
9. [`lib/links.ts`](./09-lib-links-ts.md) — Parses [label](/path) links inside content text.
10. [`lib/structured-data.ts`](./10-lib-structured-data-ts.md) — SoftwareApplication / HowTo / FAQPage / Article / Breadcrumb JSON-LD builders.
11. [`lib/pages.ts`](./11-lib-pages-ts.md) — Builds the About, Contact and policy pages from site settings.
12. [`data/tools-registry.ts`](./12-data-tools-registry-ts.md) — Preset dictionary that powers every /[slug] page.
13. [`data/guides.ts`](./13-data-guides-ts.md) — Long-form explainers published at /guides/[slug].
14. [`data/faq.ts`](./14-data-faq-ts.md) — Site-wide FAQ grouped by topic.
15. [`data/site-pages.ts`](./15-data-site-pages-ts.md) — About, Contact, Privacy, Terms and Disclaimer text.
16. [`lib/image/math.ts`](./16-lib-image-math-ts.md) — Pure geometry and size helpers (crop plans, mm to px, KB limits).
17. [`lib/image/fit.ts`](./17-lib-image-fit-ts.md) — Pure size-targeting search (quality binary search + scale adjustment).
18. [`lib/image/browser.ts`](./18-lib-image-browser-ts.md) — Browser side: decode with EXIF orientation, draw to canvas, encode.
19. [`app/globals.css`](./19-app-globals-css.md) — Tailwind v4 theme tokens, dark mode, 48px tap targets, slider and checkerboard.
20. [`app/layout.tsx`](./20-app-layout-tsx.md) — Root layout, default metadata and viewport.
21. [`app/page.tsx`](./21-app-page-tsx.md) — Home page: free-form resizer plus preset list.
22. [`app/[slug]/page.tsx`](./22-app-slug-page-tsx.md) — Dynamic preset route: generateStaticParams, generateMetadata, JSON-LD.
23. [`app/guides/page.tsx`](./23-app-guides-page-tsx.md) — Guides index.
24. [`app/guides/[slug]/page.tsx`](./24-app-guides-slug-page-tsx.md) — Guide article route with Article JSON-LD.
25. [`app/faq/page.tsx`](./25-app-faq-page-tsx.md) — FAQ page with FAQPage JSON-LD.
26. [`app/about/page.tsx`](./26-app-about-page-tsx.md) — About page.
27. [`app/contact/page.tsx`](./27-app-contact-page-tsx.md) — Contact page with email button.
28. [`app/privacy-policy/page.tsx`](./28-app-privacy-policy-page-tsx.md) — Privacy policy page.
29. [`app/terms/page.tsx`](./29-app-terms-page-tsx.md) — Terms of use page.
30. [`app/disclaimer/page.tsx`](./30-app-disclaimer-page-tsx.md) — Disclaimer page.
31. [`app/ads.txt/route.ts`](./31-app-ads-txt-route-ts.md) — ads.txt generated from the AdSense publisher id.
32. [`app/opengraph-image.tsx`](./32-app-opengraph-image-tsx.md) — Social preview image generated at build time.
33. [`app/not-found.tsx`](./33-app-not-found-tsx.md) — 404 page.
34. [`app/sitemap.ts`](./34-app-sitemap-ts.md) — sitemap.xml generated from the registry.
35. [`app/robots.ts`](./35-app-robots-ts.md) — robots.txt.
36. [`app/manifest.ts`](./36-app-manifest-ts.md) — Web app manifest.
37. [`app/icon.svg`](./37-app-icon-svg.md) — Favicon.
38. [`components/SiteHeader.tsx`](./38-components-siteheader-tsx.md) — Header with main navigation and preset chips.
39. [`components/SiteFooter.tsx`](./39-components-sitefooter-tsx.md) — Footer with presets, guides and policy links.
40. [`components/Breadcrumbs.tsx`](./40-components-breadcrumbs-tsx.md) — Visible breadcrumb trail.
41. [`components/RichText.tsx`](./41-components-richtext-tsx.md) — Renders content text with links.
42. [`components/ContentSections.tsx`](./42-components-contentsections-tsx.md) — Renders guide and policy sections: paragraphs, lists, tables, notes.
43. [`components/DocPage.tsx`](./43-components-docpage-tsx.md) — Shared layout for About, Contact and the legal pages.
44. [`components/AdSlot.tsx`](./44-components-adslot-tsx.md) — Optional AdSense unit with reserved height.
45. [`components/OptionControl.tsx`](./45-components-optioncontrol-tsx.md) — Touch-friendly select / range / toggle controls.
46. [`components/PhotoWorkspace.tsx`](./46-components-photoworkspace-tsx.md) — Client workspace: upload, settings, live compression, preview, download.
47. [`components/ToolGuide.tsx`](./47-components-toolguide-tsx.md) — E-E-A-T content panels: how-to, output spec, method, FAQ.
48. [`tests/image.test.ts`](./48-tests-image-test-ts.md) — Node test runner unit tests for the math and size search.
49. [`tests/content.test.ts`](./49-tests-content-test-ts.md) — Content checks: links resolve, unique titles, guide length, AdSense settings.
