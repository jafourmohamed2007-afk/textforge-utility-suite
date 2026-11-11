import Link from "next/link";
import { getAllGuides } from "@/data/guides";
import { getAllTools } from "@/data/tools-registry";
import { siteConfig } from "@/lib/site";
import { Logo } from "./Logo";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of use" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

const linkClass = "tap-target inline-flex items-center text-ink-soft hover:text-ink";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-panel">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo id="footer" />
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">Photo Resizer</p>
          <p className="mt-2 max-w-prose text-ink-soft">
            Photos are resized and compressed inside your browser. They are never uploaded, stored or seen by us.
            {siteConfig.adsenseClient ? " The site is funded by ads served by Google; see the privacy policy for details." : ""}
          </p>
        </div>
        <nav aria-label="All presets">
          <p className="font-semibold text-ink">Presets</p>
          <ul className="mt-1">
            {getAllTools().map((tool) => (
              <li key={tool.slug}>
                <Link href={`/${tool.slug}`} className={`${linkClass} py-1`}>
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Guides">
          <p className="font-semibold text-ink">
            <Link href="/guides" className="tap-target inline-flex items-center hover:text-brand-700">
              Guides →
            </Link>
          </p>
          <ul className="mt-1">
            {getAllGuides().map((guide) => (
              <li key={guide.slug}>
                <Link href={`/guides/${guide.slug}`} className={`${linkClass} py-1`}>
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company and legal">
          <p className="font-semibold text-ink">Site</p>
          <ul className="mt-1">
            {companyLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-xs text-ink-soft">
        © {siteConfig.year} {siteConfig.name}. Not affiliated with any government, passport office or exam board.
      </p>
    </footer>
  );
}
