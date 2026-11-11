# 30. `app/disclaimer/page.tsx`

Disclaimer page.

```tsx
import { DocPage, sitePageMetadata } from "@/components/DocPage";

export const metadata = sitePageMetadata("disclaimer");

export default function Page() {
  return <DocPage slug="disclaimer" />;
}
```
