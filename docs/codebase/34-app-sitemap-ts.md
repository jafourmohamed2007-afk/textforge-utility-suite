# 34. `app/sitemap.ts`

sitemap.xml generated from the registry.

```ts
import type { MetadataRoute } from "next";
import { getAllGuides } from "@/data/guides";
import { getAllTools } from "@/data/tools-registry";
import { getAllSitePages } from "@/lib/pages";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools();
  const guides = getAllGuides();
  const newest = [...tools.map((tool) => tool.lastReviewed), ...guides.map((guide) => guide.updated)].reduce(
    (latest, date) => (date > latest ? date : latest),
    "2026-01-01",
  );
  return [
    { url: absoluteUrl("/"), lastModified: newest, changeFrequency: "weekly", priority: 1 },
    ...tools.map((tool) => ({
      url: absoluteUrl(`/${tool.slug}`),
      lastModified: tool.lastReviewed,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: absoluteUrl("/guides"), lastModified: newest, changeFrequency: "weekly", priority: 0.8 },
    ...guides.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: guide.updated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/faq"), lastModified: newest, changeFrequency: "monthly", priority: 0.6 },
    ...getAllSitePages().map((page) => ({
      url: absoluteUrl(`/${page.slug}`),
      lastModified: siteConfig.policiesUpdated,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
```
