# 22. `app/[slug]/page.tsx`

Dynamic preset route: generateStaticParams, generateMetadata, JSON-LD.

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PhotoWorkspace } from "@/components/PhotoWorkspace";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolGuide } from "@/components/ToolGuide";
import { getGuidesForTool } from "@/data/guides";
import { getAllTools, getRelatedTools, getToolBySlug } from "@/data/tools-registry";
import { absoluteUrl, buildToolTitle, siteConfig } from "@/lib/site";
import { serializeJsonLd, toolPageGraph } from "@/lib/structured-data";

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

/** Only registry slugs exist; anything else is a static 404 (no runtime work). */
export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllTools().map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Page not found", robots: { index: false } };

  const title = buildToolTitle(tool.name);
  const path = `/${tool.slug}`;

  return {
    title: { absolute: title },
    description: tool.tagline,
    keywords: [...tool.keywords],
    alternates: { canonical: path },
    category: tool.category,
    openGraph: {
      type: "website",
      siteName: siteConfig.fullName,
      locale: siteConfig.locale,
      url: absoluteUrl(path),
      title,
      description: tool.tagline,
    },
    twitter: { card: "summary_large_image", title, description: tool.tagline },
    other: { "last-reviewed": tool.lastReviewed },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return (
    <>
      {/* SoftwareApplication + HowTo + FAQPage + BreadcrumbList structured data. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(toolPageGraph(tool)) }} />
      <SiteHeader activeSlug={tool.slug} />
      <main id="main" className="mx-auto max-w-6xl px-4 pb-8 pt-2 sm:pt-4">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: tool.name }]} />

        <header className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">{tool.category}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{tool.name} Online</h1>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-soft">{tool.intro}</p>
        </header>

        <PhotoWorkspace preset={tool.preset} label={tool.name} />

        <ToolGuide tool={tool} related={getRelatedTools(tool)} guides={getGuidesForTool(tool.slug).slice(0, 4)} />
      </main>
    </>
  );
}
```
