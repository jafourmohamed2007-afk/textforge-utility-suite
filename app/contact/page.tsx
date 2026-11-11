import { DocPage, sitePageMetadata } from "@/components/DocPage";
import { siteConfig } from "@/lib/site";

export const metadata = sitePageMetadata("contact");

export default function ContactPage() {
  return (
    <DocPage slug="contact">
      <a
        href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`${siteConfig.name} question`)}`}
        className="mb-10 inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-600 px-5 font-semibold text-white transition-colors hover:bg-brand-700"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16v12H4z" strokeLinejoin="round" />
          <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Email {siteConfig.contactEmail}
      </a>
    </DocPage>
  );
}
