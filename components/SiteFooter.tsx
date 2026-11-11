import Link from "next/link";
import { getAllTools } from "@/data/tools-registry";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-panel">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm sm:grid-cols-2">
        <div>
          <p className="font-semibold text-ink">{siteConfig.fullName}</p>
          <p className="mt-2 max-w-prose text-ink-soft">
            Photos are resized and compressed inside your browser. Nothing is uploaded, stored or logged, and there are no accounts, trackers
            or third-party scripts.
          </p>
        </div>
        <nav aria-label="All presets">
          <p className="font-semibold text-ink">Presets</p>
          <ul className="mt-1 grid grid-cols-1 sm:grid-cols-2">
            {getAllTools().map((tool) => (
              <li key={tool.slug}>
                <Link href={`/${tool.slug}`} className="tap-target inline-flex items-center text-ink-soft hover:text-ink">
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-xs text-ink-soft">
        © {siteConfig.year} {siteConfig.name}. Free to use.
      </p>
    </footer>
  );
}
