# 23. `app/guides/page.tsx`

Guides index.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllGuides, readingMinutes } from "@/data/guides";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { breadcrumbSchema, organizationSchema, serializeJsonLd } from "@/lib/structured-data";

const title = "Photo Size Guides";
const description =
  "Plain-language guides to photo file sizes, KB limits, passport photo dimensions, signatures and image formats, so your upload is accepted the first time.";

export const metadata: Metadata = {
  title: "Photo Size Guides: KB Limits, Passport Photos and Formats",
  description,
  alternates: { canonical: "/guides" },
  openGraph: { type: "website", siteName: siteConfig.fullName, url: absoluteUrl("/guides"), title, description },
};

export default function GuidesIndex() {
  const guides = getAllGuides();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl("/guides")}#webpage`,
        name: title,
        description,
        url: absoluteUrl("/guides"),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: guides.map((guide, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(`/guides/${guide.slug}`),
            name: guide.title,
          })),
        },
      },
      breadcrumbSchema([["Guides", "/guides"]]),
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <SiteHeader activeSection="guides" />
      <main id="main" className="mx-auto max-w-6xl px-4 pb-8 pt-2">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Guides" }]} />
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mt-2 text-lg leading-relaxed text-ink-soft">{description}</p>
        </header>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="flex h-full flex-col rounded-2xl border border-line bg-panel p-5 transition-colors hover:border-brand-500"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                  {guide.topic} · {readingMinutes(guide)} min read
                </span>
                <span className="mt-2 text-lg font-bold leading-snug text-ink">{guide.title}</span>
                <span className="mt-2 text-sm leading-relaxed text-ink-soft">{guide.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
```
