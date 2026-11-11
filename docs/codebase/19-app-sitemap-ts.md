# 19. `app/sitemap.ts`

sitemap.xml generated from the registry.

```ts
import type { MetadataRoute } from "next";
import { getAllTools } from "@/data/tools-registry";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools();
  const newest = tools.reduce((latest, tool) => (tool.lastReviewed > latest ? tool.lastReviewed : latest), "2026-01-01");
  return [
    { url: absoluteUrl("/"), lastModified: newest, changeFrequency: "weekly", priority: 1 },
    ...tools.map((tool) => ({
      url: absoluteUrl(`/${tool.slug}`),
      lastModified: tool.lastReviewed,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
```
