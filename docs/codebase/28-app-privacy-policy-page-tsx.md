# 28. `app/privacy-policy/page.tsx`

Privacy policy page.

```tsx
import { DocPage, sitePageMetadata } from "@/components/DocPage";

export const metadata = sitePageMetadata("privacy-policy");

export default function Page() {
  return <DocPage slug="privacy-policy" />;
}
```
