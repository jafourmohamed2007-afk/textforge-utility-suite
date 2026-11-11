# 33. `app/not-found.tsx`

404 page.

```tsx
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-mono text-sm text-brand-700 dark:text-brand-300">404</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">This page does not exist</h1>
        <p className="mt-3 text-ink-soft">The address may be misspelled, or the page was renamed.</p>
        <Link
          href="/#presets"
          className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          See all presets
        </Link>
      </main>
    </>
  );
}
```
