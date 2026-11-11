import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { sectionId } from "@/components/ContentSections";
import { RichText } from "@/components/RichText";
import { SiteHeader } from "@/components/SiteHeader";
import { allFaqEntries, faqGroups } from "@/data/faq";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { breadcrumbSchema, faqSchema, organizationSchema, serializeJsonLd } from "@/lib/structured-data";

const title = "Frequently Asked Questions";
const description = "Answers about resizing photos to a KB limit, file formats, passport photos, signatures, downloading and privacy on FitKB.";

export const metadata: Metadata = {
  title: `FAQ: Photo Resizing, KB Limits and Privacy`,
  description,
  alternates: { canonical: "/faq" },
  openGraph: { type: "website", siteName: siteConfig.fullName, url: absoluteUrl("/faq"), title, description },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), faqSchema("/faq", allFaqEntries()), breadcrumbSchema([["FAQ", "/faq"]])],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <SiteHeader activeSection="faq" />
      <main id="main" className="mx-auto max-w-3xl px-4 pb-8 pt-2">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "FAQ" }]} />
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mt-2 text-lg leading-relaxed text-ink-soft">{description}</p>
        </header>
        <nav aria-label="FAQ topics" className="mb-8 flex flex-wrap gap-2">
          {faqGroups.map((group) => (
            <a
              key={group.topic}
              href={`#${sectionId(group.topic)}`}
              className="tap-target inline-flex items-center rounded-full border border-line bg-panel px-4 text-sm font-medium text-ink hover:border-brand-500"
            >
              {group.topic}
            </a>
          ))}
        </nav>
        <div className="flex flex-col gap-10">
          {faqGroups.map((group, index) => (
            <div key={group.topic} className="flex flex-col gap-10">
              <section aria-labelledby={sectionId(group.topic)}>
                <h2 id={sectionId(group.topic)} className="scroll-mt-4 text-2xl font-bold tracking-tight text-ink">
                  {group.topic}
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  {group.entries.map((entry) => (
                    <details key={entry.question} className="group rounded-2xl border border-line bg-panel">
                      <summary className="tap-target flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                        {entry.question}
                        <span aria-hidden="true" className="text-xl text-ink-soft transition-transform group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="px-4 pb-4 leading-relaxed text-ink-soft">
                        <RichText text={entry.answer} />
                      </p>
                    </details>
                  ))}
                </div>
              </section>
              {index === 1 ? <AdSlot /> : null}
            </div>
          ))}
        </div>
        <p className="mt-10 rounded-2xl border border-line bg-panel p-5 text-ink-soft">
          <RichText text="Still stuck? Read the [guides](/guides) or [contact us](/contact) with the details of the form you are filling." />
        </p>
      </main>
    </>
  );
}
