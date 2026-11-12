/**
 * Public origin, in order of preference:
 *  1. NEXT_PUBLIC_SITE_URL, if set;
 *  2. on Vercel, the project's production domain (your custom domain once one
 *     is connected, otherwise the .vercel.app address), which Vercel provides
 *     at build time as VERCEL_PROJECT_PRODUCTION_URL;
 *  3. a placeholder for local development.
 * next.config.ts copies the result into NEXT_PUBLIC_SITE_URL so browser code
 * sees the same value.
 */
export function resolveSiteUrl(env: Record<string, string | undefined>): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const url = explicit || (vercel ? `https://${vercel.replace(/^https?:\/\//, "")}` : "https://fitkb.example.com");
  return url.replace(/\/+$/, "");
}

const siteUrl = resolveSiteUrl(process.env);

/** Accepts "ca-pub-1234567890123456" (or "pub-…"); anything else disables ads. */
export function parseAdsenseClient(raw: string | undefined): string | null {
  const value = raw?.trim() ?? "";
  const match = /^(?:ca-)?(pub-\d{10,20})$/.exec(value);
  return match ? `ca-${match[1]}` : null;
}

/** Ad unit ids are 10 digit numbers created in the AdSense dashboard. */
export function parseAdSlot(raw: string | undefined): string | null {
  const value = raw?.trim() ?? "";
  return /^\d{6,20}$/.test(value) ? value : null;
}

function contactEmail(): string {
  const configured = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (configured && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configured)) return configured;
  return `hello@${new URL(siteUrl).hostname.replace(/^www\./, "")}`;
}

export const siteConfig = {
  name: "FitKB",
  fullName: "FitKB Photo Resizer",
  description:
    "Resize and compress photos to an exact KB limit for online forms: 10 KB, 20 KB, 50 KB, 100 KB, passport photos and signatures. Free, private and runs in your browser.",
  /** Public origin; override with NEXT_PUBLIC_SITE_URL at build time. */
  url: siteUrl,
  locale: "en_US",
  year: 2026,
  /** Date the legal pages were last changed (YYYY-MM-DD). */
  policiesUpdated: "2026-11-11",
  contactEmail: contactEmail(),
  /** Optional name of the person or company running the site, shown on About. */
  owner: process.env.NEXT_PUBLIC_OWNER_NAME?.trim() || null,
  /** Google AdSense publisher id; ads, ads.txt and the verification tag are off until it is set. */
  adsenseClient: parseAdsenseClient(process.env.NEXT_PUBLIC_ADSENSE_CLIENT),
  /** Optional manual in-content ad unit. Without it, AdSense Auto ads decide placement. */
  adsenseSlot: parseAdSlot(process.env.NEXT_PUBLIC_ADSENSE_SLOT),
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Title pattern targeting "online / free / mobile" search intent. */
export function buildToolTitle(toolName: string): string {
  return `${toolName} Online - Free Photo Resizer (${siteConfig.year} Mobile Friendly)`;
}
