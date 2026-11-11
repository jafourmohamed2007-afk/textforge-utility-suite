import type { FaqEntry, GuideDefinition, ToolDefinition } from "./types";
import { stripLinks } from "./links";
import { absoluteUrl, buildToolTitle, siteConfig } from "./site";

type JsonLd = Record<string, unknown>;

export function softwareApplicationSchema(tool: ToolDefinition): JsonLd {
  const url = absoluteUrl(`/${tool.slug}`);
  return {
    "@type": "SoftwareApplication",
    "@id": `${url}#app`,
    name: tool.name,
    alternateName: buildToolTitle(tool.name),
    description: tool.tagline,
    url,
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: tool.category,
    operatingSystem: "Any (web browser): Android, iOS, Windows, macOS, Linux",
    browserRequirements: "Requires JavaScript and Canvas. Photos are processed locally in the browser.",
    isAccessibleForFree: true,
    inLanguage: "en",
    dateModified: tool.lastReviewed,
    keywords: tool.keywords.join(", "),
    featureList: tool.howTo.map((step) => step.title),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  };
}

export function howToSchema(tool: ToolDefinition): JsonLd {
  return {
    "@type": "HowTo",
    "@id": `${absoluteUrl(`/${tool.slug}`)}#howto`,
    name: `How to use the ${tool.name}`,
    description: tool.intro,
    totalTime: "PT1M",
    supply: { "@type": "HowToSupply", name: "A photo (JPG, PNG or WebP)" },
    tool: { "@type": "HowToTool", name: tool.name },
    step: tool.howTo.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
      url: `${absoluteUrl(`/${tool.slug}`)}#step-${index + 1}`,
    })),
  };
}

export function faqSchema(path: string, entries: readonly FaqEntry[]): JsonLd {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: stripLinks(entry.answer) },
    })),
  };
}

/** Breadcrumb trail from the home page; each item is [name, path]. */
export function breadcrumbSchema(trail: ReadonlyArray<readonly [string, string]>): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [[siteConfig.name, "/"] as const, ...trail].map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}

export function organizationSchema(): JsonLd {
  return {
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: siteConfig.fullName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.svg"),
    email: siteConfig.contactEmail,
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: siteConfig.contactEmail, url: absoluteUrl("/contact") },
  };
}

export function toolPageGraph(tool: ToolDefinition): JsonLd {
  const path = `/${tool.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      softwareApplicationSchema(tool),
      howToSchema(tool),
      faqSchema(path, tool.faq),
      breadcrumbSchema([[tool.name, path]]),
    ],
  };
}

export function guidePageGraph(guide: GuideDefinition): JsonLd {
  const path = `/guides/${guide.slug}`;
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: guide.title,
        description: guide.description,
        abstract: stripLinks(guide.summary),
        url,
        mainEntityOfPage: url,
        inLanguage: "en",
        datePublished: guide.published,
        dateModified: guide.updated,
        articleSection: guide.topic,
        author: { "@id": `${absoluteUrl("/")}#organization` },
        publisher: { "@id": `${absoluteUrl("/")}#organization` },
        image: absoluteUrl("/opengraph-image"),
      },
      faqSchema(path, guide.faq),
      breadcrumbSchema([
        ["Guides", "/guides"],
        [guide.title, path],
      ]),
    ],
  };
}

/** WebPage + breadcrumb graph for simple pages such as About or Privacy. */
export function simplePageGraph(name: string, path: string, description: string, type = "WebPage"): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      {
        "@type": type,
        "@id": `${absoluteUrl(path)}#webpage`,
        name,
        description,
        url: absoluteUrl(path),
        inLanguage: "en",
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        dateModified: siteConfig.policiesUpdated,
      },
      breadcrumbSchema([[name, path]]),
    ],
  };
}

/**
 * Serialises JSON-LD for a <script> tag. "<" is escaped so user-controlled or
 * registry text can never close the script element early (XSS hardening).
 */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
