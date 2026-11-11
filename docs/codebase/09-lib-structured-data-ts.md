# 09. `lib/structured-data.ts`

SoftwareApplication / HowTo / FAQPage / Breadcrumb JSON-LD builders.

```ts
import type { ToolDefinition } from "./types";
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

export function faqSchema(tool: ToolDefinition): JsonLd {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(`/${tool.slug}`)}#faq`,
    mainEntity: tool.faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

export function breadcrumbSchema(tool: ToolDefinition): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: siteConfig.name, item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: tool.name, item: absoluteUrl(`/${tool.slug}`) },
    ],
  };
}

export function organizationSchema(): JsonLd {
  return {
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: siteConfig.fullName,
    url: absoluteUrl("/"),
  };
}

export function toolPageGraph(tool: ToolDefinition): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), softwareApplicationSchema(tool), howToSchema(tool), faqSchema(tool), breadcrumbSchema(tool)],
  };
}

/**
 * Serialises JSON-LD for a <script> tag. "<" is escaped so user-controlled or
 * registry text can never close the script element early (XSS hardening).
 */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
```
