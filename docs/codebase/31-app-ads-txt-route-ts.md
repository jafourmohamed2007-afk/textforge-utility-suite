# 31. `app/ads.txt/route.ts`

ads.txt generated from the AdSense publisher id.

```ts
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /ads.txt authorises Google to sell ad space on this domain. It is generated
 * from NEXT_PUBLIC_ADSENSE_CLIENT, so it can never contain a wrong id; without
 * that setting the file does not exist.
 */
export function GET(): Response {
  const client = siteConfig.adsenseClient;
  if (!client) return new Response("Not found\n", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  const publisher = client.replace(/^ca-/, "");
  return new Response(`google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
}
```
