# 23. `components/SiteHeader.tsx`

Header with preset navigation chips.

```tsx
import Link from "next/link";
import { getAllTools } from "@/data/tools-registry";
import { siteConfig } from "@/lib/site";

export function SiteHeader({ activeSlug }: { activeSlug?: string }) {
  const tools = getAllTools();
  return (
    <header className="border-b border-line bg-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="tap-target inline-flex items-center gap-2 self-start text-lg font-bold tracking-tight text-ink">
          <span aria-hidden="true" className="grid size-8 place-items-center rounded-lg bg-brand-600 font-mono text-xs font-bold text-white">
            KB
          </span>
          {siteConfig.name}
        </Link>
        <nav aria-label="Presets" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <ul className="flex gap-1 whitespace-nowrap">
            {tools.map((tool) => {
              const active = tool.slug === activeSlug;
              return (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`tap-target inline-flex items-center rounded-full px-3 text-sm font-medium transition-colors ${
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
