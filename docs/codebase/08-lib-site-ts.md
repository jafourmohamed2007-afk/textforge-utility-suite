# 08. `lib/site.ts`

Site config and the SEO title builder.

```ts
export const siteConfig = {
  name: "FitKB",
  fullName: "FitKB Photo Resizer",
  description:
    "Resize and compress photos to an exact KB limit for online forms: 10 KB, 20 KB, 50 KB, 100 KB, passport photos and signatures. Free, private and runs in your browser.",
  /** Public origin; override with NEXT_PUBLIC_SITE_URL at build time. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://fitkb.example.com").replace(/\/+$/, ""),
  locale: "en_US",
  year: 2026,
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Title pattern targeting "online / free / mobile" search intent. */
export function buildToolTitle(toolName: string): string {
  return `${toolName} Online - Free Photo Resizer (${siteConfig.year} Mobile Friendly)`;
}
```
