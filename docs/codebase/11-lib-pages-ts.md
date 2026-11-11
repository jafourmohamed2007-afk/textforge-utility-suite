# 11. `lib/pages.ts`

Builds the About, Contact and policy pages from site settings.

```ts
import { buildSitePages, type SitePage } from "@/data/site-pages";
import { absoluteUrl, siteConfig } from "./site";

const sitePages = buildSitePages({
  siteName: siteConfig.name,
  fullName: siteConfig.fullName,
  siteUrl: absoluteUrl("/").replace(/\/$/, ""),
  contactEmail: siteConfig.contactEmail,
  owner: siteConfig.owner,
  adsEnabled: siteConfig.adsenseClient !== null,
  updated: siteConfig.policiesUpdated,
});

export function getSitePage(slug: SitePage["slug"]): SitePage {
  const page = sitePages.find((item) => item.slug === slug);
  if (!page) throw new Error(`Unknown site page: ${slug}`);
  return page;
}

export function getAllSitePages(): readonly SitePage[] {
  return sitePages;
}
```
