import Link from "next/link";
import { getAllTools } from "@/data/tools-registry";
import { siteConfig } from "@/lib/site";
import { Logo } from "./Logo";

const mainNav = [
  { href: "/guides", label: "Guides" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
] as const;

/** Number of presets shown as chips; the rest are on the home page and in the footer. */
const FEATURED_PRESETS = 8;

export function SiteHeader({ activeSlug, activeSection }: { activeSlug?: string; activeSection?: "guides" | "faq" | "about" }) {
  const tools = getAllTools().slice(0, FEATURED_PRESETS);
  return (
    <header className="border-b border-line bg-panel">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 pt-1">
        <Link href="/" aria-label={`${siteConfig.name} home`} className="tap-target inline-flex items-center">
          <Logo id="header" />
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-1">
            {mainNav.map((item) => {
              const active = activeSection !== undefined && item.href === `/${activeSection}`;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`tap-target inline-flex items-center rounded-lg px-2 text-sm font-semibold transition-colors sm:px-3 ${
                      active ? "text-brand-700 dark:text-brand-300" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <nav aria-label="Presets" className="mx-auto max-w-6xl overflow-x-auto px-4 pb-1">
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
          <li>
            <Link href="/#presets" className="tap-target inline-flex items-center rounded-full px-3 text-sm font-medium text-brand-700 hover:bg-panel-strong dark:text-brand-300">
              All presets →
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
