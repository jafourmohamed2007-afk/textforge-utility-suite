# 21. `app/page.tsx`

Home page: free-form resizer plus preset list.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { PhotoWorkspace } from "@/components/PhotoWorkspace";
import { RichText } from "@/components/RichText";
import { SiteHeader } from "@/components/SiteHeader";
import { faqGroups } from "@/data/faq";
import { getAllGuides, readingMinutes } from "@/data/guides";
import { getAllTools, homePreset } from "@/data/tools-registry";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { organizationSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: { absolute: `Resize Image to KB Online - Free Photo Resizer (${siteConfig.year} Mobile Friendly)` },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.fullName,
    url: absoluteUrl("/"),
    title: siteConfig.fullName,
    description: siteConfig.description,
  },
};

const howItWorks = [
  {
    title: "1. Your browser opens the photo",
    body: "The photo is decoded on your device and turned upright using the rotation your camera stored. Nothing is uploaded.",
  },
  {
    title: "2. FitKB searches for the best quality",
    body: "It encodes the photo as a JPEG several times, narrowing in on the highest quality that is still at or under your limit.",
  },
  {
    title: "3. Dimensions shrink only if needed",
    body: "If even low quality is too big, the photo is scaled down just enough. Fixed-size passport and signature presets are never distorted.",
  },
  {
    title: "4. You check it and download",
    body: "The exact byte count, dimensions and quality are shown before you save, so you know it passes before you upload it.",
  },
] as const;

export default function HomePage() {
  const tools = getAllTools();
  const guides = getAllGuides();
  const homeFaq = faqGroups.flatMap((group) => group.entries).slice(0, 5);
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
        "@type": "SoftwareApplication",
        name: "Resize Image to KB",
        url: absoluteUrl("/"),
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Any (web browser)",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "ItemList",
        name: "FitKB presets",
        itemListElement: tools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.name,
          url: absoluteUrl(`/${tool.slug}`),
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <SiteHeader />
      <main id="main" className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:pt-10">
        <section className="mb-6 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">Resize any photo to the exact KB your form needs</h1>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">
            Pick a photo, type the limit, download. FitKB keeps the sharpest version under the limit, and your photo never leaves your phone.
          </p>
        </section>

        <PhotoWorkspace preset={homePreset} label="Resize image to KB" />

        <section id="presets" aria-labelledby="presets-heading" className="mt-12 scroll-mt-4">
          <h2 id="presets-heading" className="text-2xl font-bold tracking-tight text-ink">
            Ready-made presets
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/${tool.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-line bg-panel p-4 transition-colors hover:border-brand-500"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">{tool.category}</span>
                  <span className="mt-1 font-bold text-ink">{tool.name}</span>
                  <span className="mt-1 text-sm leading-relaxed text-ink-soft">{tool.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="why-heading" className="mt-12 grid gap-4 sm:grid-cols-3">
          <h2 id="why-heading" className="sr-only">
            Why FitKB
          </h2>
          {[
            ["Never over the limit", "The size limit is applied as KB × 1000 bytes, so files pass both 1000- and 1024-byte checks."],
            ["Private by design", "Photos are processed in your browser. Nothing is uploaded, which matters for ID photos and signatures."],
            ["Made for phones", "Big tap targets, camera and gallery upload, and a layout that does not jump while the photo is processed."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-line bg-panel p-5">
              <h3 className="font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </section>

        <section aria-labelledby="how-heading" className="mt-12">
          <h2 id="how-heading" className="text-2xl font-bold tracking-tight text-ink">
            How FitKB gets a photo under the KB limit
          </h2>
          <p className="mt-2 max-w-3xl leading-relaxed text-ink-soft">
            Most compressors pick one quality setting and hope for the best. FitKB treats the limit as a target and searches for it, which
            is why results land just under the limit with as much detail as possible.
          </p>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2">
            {howItWorks.map((step) => (
              <li key={step.title} className="rounded-2xl border border-line bg-panel p-5">
                <h3 className="font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <AdSlot className="mt-12" />

        <section aria-labelledby="guides-heading" className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 id="guides-heading" className="text-2xl font-bold tracking-tight text-ink">
              Guides
            </h2>
            <Link href="/guides" className="tap-target inline-flex items-center text-sm font-semibold text-brand-700 dark:text-brand-300">
              All guides →
            </Link>
          </div>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, 6).map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="flex h-full flex-col rounded-2xl border border-line bg-panel p-4 transition-colors hover:border-brand-500"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                    {guide.topic} · {readingMinutes(guide)} min
                  </span>
                  <span className="mt-1 font-bold text-ink">{guide.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="home-faq-heading" className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 id="home-faq-heading" className="text-2xl font-bold tracking-tight text-ink">
              Common questions
            </h2>
            <Link href="/faq" className="tap-target inline-flex items-center text-sm font-semibold text-brand-700 dark:text-brand-300">
              Full FAQ →
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {homeFaq.map((entry) => (
              <details key={entry.question} className="group rounded-2xl border border-line bg-panel">
                <summary className="tap-target flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {entry.question}
                  <span aria-hidden="true" className="text-xl text-ink-soft transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="px-4 pb-4 text-sm leading-relaxed text-ink-soft">
                  <RichText text={entry.answer} />
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
```
