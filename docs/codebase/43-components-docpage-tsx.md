# 43. `components/DocPage.tsx`

Shared layout for About, Contact and the legal pages.

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { SitePage } from "@/data/site-pages";
import { getSitePage } from "@/lib/pages";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { serializeJsonLd, simplePageGraph } from "@/lib/structured-data";
import { Breadcrumbs } from "./Breadcrumbs";
import { ContentSections } from "./ContentSections";
import { SiteHeader } from "./SiteHeader";

const updatedFormat = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export function sitePageMetadata(slug: SitePage["slug"]): Metadata {
  const page = getSitePage(slug);
  const path = `/${page.slug}`;
  return {
    // "About FitKB" would otherwise become "About FitKB | FitKB".
    title: page.title.includes(siteConfig.name) ? { absolute: `${page.title} Photo Resizer` } : page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: siteConfig.fullName, url: absoluteUrl(path), title: page.title, description: page.description },
  };
}

/** Shared layout for About, Contact and the legal pages. */
export function DocPage({ slug, children }: { slug: SitePage["slug"]; children?: ReactNode }) {
  const page = getSitePage(slug);
  const path = `/${page.slug}`;
  const isLegal = slug === "privacy-policy" || slug === "terms" || slug === "disclaimer";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(simplePageGraph(page.title, path, page.description, page.schemaType)) }}
      />
      <SiteHeader activeSection={slug === "about" ? "about" : undefined} />
      <main id="main" className="mx-auto max-w-3xl px-4 pb-8 pt-2">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: page.title }]} />
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{page.title}</h1>
          <p className="mt-2 text-lg leading-relaxed text-ink-soft">{page.description}</p>
          {isLegal ? (
            <p className="mt-2 text-sm text-ink-soft">
              Last updated: <time dateTime={siteConfig.policiesUpdated}>{updatedFormat.format(new Date(`${siteConfig.policiesUpdated}T00:00:00Z`))}</time>
            </p>
          ) : null}
        </header>
        {children}
        <ContentSections sections={page.sections} />
      </main>
    </>
  );
}
```
