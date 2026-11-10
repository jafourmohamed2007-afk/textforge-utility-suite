import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolGuide } from "@/components/ToolGuide";
import { ToolWorkspace, type WorkspaceTool } from "@/components/ToolWorkspace";
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
  if (!tool) return { title: "Tool not found", robots: { index: false } };

  const title = buildToolTitle(tool.name);
  const path = `/tools/${tool.slug}`;

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
    twitter: { card: "summary", title, description: tool.tagline },
    other: { "last-reviewed": tool.lastReviewed },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  // Only the fields the client island needs are serialised into the RSC payload.
  const workspaceTool: WorkspaceTool = {
    slug: tool.slug,
    name: tool.name,
    inputLabel: tool.inputLabel,
    outputLabel: tool.outputLabel,
    inputPlaceholder: tool.inputPlaceholder,
    sampleInput: tool.sampleInput,
    downloadName: tool.downloadName,
    downloadMime: tool.downloadMime,
    options: tool.options,
  };

  return (
    <>
      {/* SoftwareApplication + HowTo + FAQPage + BreadcrumbList structured data. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(toolPageGraph(tool)) }} />
      <SiteHeader activeSlug={tool.slug} />
      <main id="main" className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="inline-flex min-h-12 items-center hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {tool.name}
            </li>
          </ol>
        </nav>

        <header className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">{tool.category} tool</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{tool.name} Online</h1>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-soft">{tool.intro}</p>
        </header>

        <ToolWorkspace tool={workspaceTool} />

        <ToolGuide tool={tool} related={getRelatedTools(tool)} />
      </main>
    </>
  );
}
