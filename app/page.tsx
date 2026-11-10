import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllTools } from "@/data/tools-registry";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { organizationSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.fullName,
    url: absoluteUrl("/"),
    title: siteConfig.fullName,
    description: siteConfig.description,
  },
};

export default function HomePage() {
  const tools = getAllTools();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        name: siteConfig.fullName,
        url: absoluteUrl("/"),
        description: siteConfig.description,
        inLanguage: "en",
      },
      {
        "@type": "ItemList",
        name: "TextForge text tools",
        itemListElement: tools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.name,
          url: absoluteUrl(`/tools/${tool.slug}`),
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <SiteHeader />
      <main id="main" className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:pt-12">
        <section className="max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">Fast, private text tools that work on your phone</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Format WhatsApp messages, clean whitespace, convert raw text to CSV and strip Markdown — instantly, offline-fast and without
            uploading a single character.
          </p>
        </section>

        <section id="tools" aria-labelledby="tools-heading" className="mt-10 scroll-mt-4">
          <h2 id="tools-heading" className="text-xl font-bold text-ink">
            All tools
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-line bg-panel p-5 transition-colors hover:border-brand-500"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">{tool.category}</span>
                  <span className="mt-1 text-lg font-bold text-ink">{tool.name}</span>
                  <span className="mt-2 text-sm leading-relaxed text-ink-soft">{tool.tagline}</span>
                  <span className="mt-4 inline-flex min-h-12 items-center self-start rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white">
                    Open tool →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="why-heading" className="mt-12 grid gap-4 sm:grid-cols-3">
          <h2 id="why-heading" className="sr-only">
            Why TextForge
          </h2>
          {[
            ["Zero uploads", "Processing happens in your browser with native string methods. No servers see your text."],
            ["Built for thumbs", "Every button, toggle and slider has a 48px touch target, and panels never jump while you type."],
            ["Instant results", "Output updates as you type with no network round trips, even on slow mobile connections."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-line bg-panel p-5">
              <h3 className="font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
