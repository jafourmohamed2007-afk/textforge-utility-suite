# 29. `app/terms/page.tsx`

Terms of use page.

```tsx
import { DocPage, sitePageMetadata } from "@/components/DocPage";

export const metadata = sitePageMetadata("terms");

export default function Page() {
  return <DocPage slug="terms" />;
}
```
