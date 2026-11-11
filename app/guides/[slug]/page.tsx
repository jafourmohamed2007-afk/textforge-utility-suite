import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContentSections, sectionId } from "@/components/ContentSections";
import { RichText } from "@/components/RichText";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllGuides, getGuideBySlug, readingMinutes } from "@/data/guides";
import { getToolBySlug } from "@/data/tools-registry";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { guidePageGraph, serializeJsonLd } from "@/lib/structured-data";
import type { ToolDefinition } from "@/lib/types";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Page not found", robots: { index: false } };
  const path = `/guides/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      siteName: siteConfig.fullName,
      locale: siteConfig.locale,
      url: absoluteUrl(path),
      title: guide.title,
      description: guide.description,
      publishedTime: guide.published,
      modifiedTime: guide.updated,
    },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description },
  };
}

const dateFormat = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T00:00:00Z`));

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const tools = guide.relatedTools.map((toolSlug) => getToolBySlug(toolSlug)).filter((tool): tool is ToolDefinition => tool !== undefined);
  const others = getAllGuides().filter((item) => item.slug !== guide.slug).slice(0, 4);
  const [primaryTool] = tools;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(guidePageGraph(guide)) }} />
      <SiteHeader activeSection="guides" />
      <main id="main" className="mx-auto max-w-3xl px-4 pb-8 pt-2">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }, { name: guide.title }]} />
        <article>
          <header className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">{guide.topic}</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{guide.title}</h1>
            <p className="mt-3 text-sm text-ink-soft">
              By {siteConfig.owner ?? siteConfig.name} · Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time> · {readingMinutes(guide)} min read
            </p>
          </header>

          <div className="mb-8 rounded-2xl border border-line bg-panel p-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Quick answer</p>
            <p className="mt-2 text-lg leading-relaxed text-ink">
              <RichText text={guide.summary} />
            </p>
            {primaryTool ? (
              <Link
                href={`/${primaryTool.slug}`}
                className="mt-4 inline-flex min-h-12 items-center rounded-xl bg-brand-600 px-5 font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Open the {primaryTool.name} tool
              </Link>
            ) : null}
          </div>

          <nav aria-labelledby="toc-heading" className="mb-10">
            <h2 id="toc-heading" className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
              In this guide
            </h2>
            <ol className="mt-2 flex flex-col">
              {guide.sections.map((section) => (
                <li key={section.heading}>
                  <a href={`#${sectionId(section.heading)}`} className="inline-flex min-h-12 items-center text-brand-700 hover:underline dark:text-brand-300">
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <ContentSections sections={guide.sections} afterSection={(index) => (index === 1 ? <AdSlot /> : null)} />

          <section aria-labelledby="guide-faq-heading" className="mt-10">
            <h2 id="guide-faq-heading" className="text-2xl font-bold tracking-tight text-ink">
              Questions people also ask
            </h2>
            <dl className="mt-4 flex flex-col gap-4">
              {guide.faq.map((entry) => (
                <div key={entry.question} className="rounded-2xl border border-line bg-panel p-4">
                  <dt className="font-semibold text-ink">{entry.question}</dt>
                  <dd className="mt-1 leading-relaxed text-ink-soft">
                    <RichText text={entry.answer} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </article>

        <section aria-labelledby="tools-heading" className="mt-12">
          <h2 id="tools-heading" className="text-2xl font-bold tracking-tight text-ink">
            Tools for this
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link href={`/${tool.slug}`} className="flex min-h-12 flex-col rounded-2xl border border-line bg-panel p-4 hover:border-brand-500">
                  <span className="font-semibold text-ink">{tool.name}</span>
                  <span className="mt-1 text-sm text-ink-soft">{tool.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="more-guides-heading" className="mt-12">
          <h2 id="more-guides-heading" className="text-2xl font-bold tracking-tight text-ink">
            More guides
          </h2>
          <ul className="mt-4 flex flex-col">
            {others.map((item) => (
              <li key={item.slug}>
                <Link href={`/guides/${item.slug}`} className="inline-flex min-h-12 items-center font-medium text-brand-700 hover:underline dark:text-brand-300">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <AdSlot className="mt-8" />
        </section>
      </main>
    </>
  );
}
