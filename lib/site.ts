export const siteConfig = {
  name: "TextForge",
  fullName: "TextForge Dynamic Tool Suite",
  description:
    "Free, private, mobile-first text utilities: WhatsApp formatter, whitespace cleaner, text to CSV converter and Markdown stripper. Everything runs in your browser.",
  /** Public origin; override with NEXT_PUBLIC_SITE_URL at build time. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://textforge.example.com").replace(/\/+$/, ""),
  locale: "en_US",
  year: 2026,
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Title pattern targeting "online / free / mobile" search intent. */
export function buildToolTitle(toolName: string): string {
  return `${toolName} Online - Free Text Formatter Tool (${siteConfig.year} Mobile Friendly)`;
}
