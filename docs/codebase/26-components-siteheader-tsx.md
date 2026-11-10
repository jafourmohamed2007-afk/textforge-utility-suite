# 26. `components/SiteHeader.tsx`

Header with tool navigation chips.

```tsx
import Link from "next/link";
import { getAllTools } from "@/data/tools-registry";
import { siteConfig } from "@/lib/site";

export function SiteHeader({ activeSlug }: { activeSlug?: string }) {
  const tools = getAllTools();
  return (
    <header className="border-b border-line bg-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="tap-target inline-flex items-center gap-2 self-start text-lg font-bold tracking-tight text-ink">
          <span aria-hidden="true" className="grid size-8 place-items-center rounded-lg bg-brand-600 font-mono text-sm text-white">
            Tf
          </span>
          {siteConfig.name}
        </Link>
        <nav aria-label="Tools" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <ul className="flex gap-2 whitespace-nowrap">
            {tools.map((tool) => {
              const active = tool.slug === activeSlug;
              return (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`tap-target inline-flex items-center rounded-full px-4 text-sm font-medium transition-colors ${
                      active ? "bg-brand-600 text-white" : "text-ink-soft hover:bg-panel-strong hover:text-ink"
                    }`}
                  >
                    {tool.shortName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
```
