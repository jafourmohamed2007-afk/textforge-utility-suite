# 41. `components/Breadcrumbs.tsx`

Visible breadcrumb trail.

```tsx
import Link from "next/link";

export interface Crumb {
  name: string;
  href?: string;
}

/** Visible breadcrumb trail; the last item is the current page. */
export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
      <ol className="flex flex-wrap items-center gap-x-1">
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center gap-x-1">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="inline-flex min-h-12 min-w-12 items-center justify-center hover:text-ink">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="inline-flex min-h-12 items-center text-ink">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```
