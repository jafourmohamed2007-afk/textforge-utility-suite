import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { faqGroups } from "../data/faq.ts";
import { getAllGuides, getGuidesForTool, readingMinutes } from "../data/guides.ts";
import { buildSitePages } from "../data/site-pages.ts";
import { getAllTools } from "../data/tools-registry.ts";
import { parseLinks, stripLinks } from "../lib/links.ts";
import { parseAdSlot, parseAdsenseClient, resolveSiteUrl } from "../lib/site.ts";
import type { ContentSection } from "../lib/types.ts";

const settings = {
  siteName: "FitKB",
  fullName: "FitKB Photo Resizer",
  siteUrl: "https://example.com",
  contactEmail: "hello@example.com",
  owner: null,
  updated: "2026-11-11",
};
const pagesWithAds = buildSitePages({ ...settings, adsEnabled: true });
const pagesWithoutAds = buildSitePages({ ...settings, adsEnabled: false });

const tools = getAllTools();
const guides = getAllGuides();

/** Every path the app can serve. */
const routes = new Set<string>([
  "/",
  "/guides",
  "/faq",
  ...tools.map((tool) => `/${tool.slug}`),
  ...guides.map((guide) => `/guides/${guide.slug}`),
  ...pagesWithAds.map((page) => `/${page.slug}`),
]);

function sectionTexts(sections: readonly ContentSection[]): string[] {
  return sections.flatMap((section) =>
    section.blocks.flatMap((block) => {
      if (block.type === "p" || block.type === "note") return [block.text];
      if (block.type === "ul" || block.type === "ol") return [...block.items];
      return [block.caption, ...block.rows.flat()];
    }),
  );
}

const allTexts = [
  ...guides.flatMap((guide) => [guide.summary, ...sectionTexts(guide.sections), ...guide.faq.map((entry) => entry.answer)]),
  ...faqGroups.flatMap((group) => group.entries.map((entry) => entry.answer)),
  ...pagesWithAds.flatMap((page) => sectionTexts(page.sections)),
];

describe("links", () => {
  it("parses internal and external links", () => {
    assert.deepEqual(parseLinks("See [the guide](/guides/x) or [Google](https://google.com)."), [
      { text: "See " },
      { text: "the guide", href: "/guides/x" },
      { text: " or " },
      { text: "Google", href: "https://google.com" },
      { text: "." },
    ]);
    assert.equal(stripLinks("Use [this tool](/compress-image-to-20kb) now"), "Use this tool now");
  });

  it("every internal link in guides, FAQ and site pages points to a real page", () => {
    const broken = allTexts
      .flatMap((text) => parseLinks(text))
      .filter((part) => part.href?.startsWith("/") && !routes.has(part.href.split("#")[0] ?? ""))
      .map((part) => part.href);
    assert.deepEqual(broken, []);
  });

  it("leaves no half-written link markup behind", () => {
    for (const text of allTexts) {
      const plain = parseLinks(text)
        .filter((part) => !part.href)
        .map((part) => part.text)
        .join("");
      assert.doesNotMatch(plain, /\]\(|\[[^\]]*\]$/, text);
    }
  });
});

describe("registry and guides", () => {
  it("has unique slugs that do not collide with fixed routes", () => {
    const fixed = ["guides", "faq", "about", "contact", "privacy-policy", "terms", "disclaimer", "sitemap.xml", "robots.txt", "ads.txt"];
    const slugs = [...tools.map((tool) => tool.slug), ...fixed];
    assert.equal(new Set(slugs).size, slugs.length);
    assert.equal(new Set(guides.map((guide) => guide.slug)).size, guides.length);
  });

  it("references only existing tools", () => {
    const toolSlugs = new Set(tools.map((tool) => tool.slug));
    for (const tool of tools) for (const slug of tool.relatedSlugs) assert.ok(toolSlugs.has(slug), `${tool.slug} -> ${slug}`);
    for (const guide of guides) for (const slug of guide.relatedTools) assert.ok(toolSlugs.has(slug), `${guide.slug} -> ${slug}`);
  });

  it("gives every tool page at least one guide to link to", () => {
    for (const tool of tools) assert.ok(getGuidesForTool(tool.slug).length > 0, tool.slug);
  });

  it("keeps guides substantial and dated", () => {
    for (const guide of guides) {
      assert.ok(guide.sections.length >= 3, guide.slug);
      assert.ok(readingMinutes(guide) >= 2, `${guide.slug} is too short`);
      assert.match(guide.updated, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(guide.description.length >= 70 && guide.description.length <= 200, `${guide.slug} description length`);
    }
  });

  it("uses unique titles and descriptions for every page", () => {
    const titles = [...tools.map((tool) => tool.name), ...guides.map((guide) => guide.title), ...pagesWithAds.map((page) => page.title)];
    const descriptions = [...tools.map((tool) => tool.tagline), ...guides.map((guide) => guide.description)];
    assert.equal(new Set(titles).size, titles.length);
    assert.equal(new Set(descriptions).size, descriptions.length);
  });
});

describe("site pages and ads", () => {
  it("includes the required pages", () => {
    assert.deepEqual(
      pagesWithAds.map((page) => page.slug),
      ["about", "contact", "privacy-policy", "terms", "disclaimer"],
    );
  });

  it("adds the Google advertising disclosure only when ads are on", () => {
    const privacy = (pages: typeof pagesWithAds) => sectionTexts(pages.find((page) => page.slug === "privacy-policy")?.sections ?? []).join(" ");
    assert.match(privacy(pagesWithAds), /Third-party vendors, including Google, use cookies/);
    assert.match(privacy(pagesWithAds), /adssettings\.google\.com/);
    assert.doesNotMatch(privacy(pagesWithoutAds), /Google/);
    assert.match(privacy(pagesWithoutAds), /shows no ads/);
  });

  it("resolves the public site address", () => {
    assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://fitkb.com/", VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app" }), "https://fitkb.com");
    assert.equal(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "", VERCEL_PROJECT_PRODUCTION_URL: "fitkb.com" }), "https://fitkb.com");
    assert.equal(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "fitkb-abc.vercel.app" }), "https://fitkb-abc.vercel.app");
    assert.equal(resolveSiteUrl({}), "https://fitkb.example.com");
  });

  it("validates AdSense ids", () => {
    assert.equal(parseAdsenseClient("ca-pub-1234567890123456"), "ca-pub-1234567890123456");
    assert.equal(parseAdsenseClient(" pub-1234567890123456 "), "ca-pub-1234567890123456");
    assert.equal(parseAdsenseClient("ca-pub-XXXX"), null);
    assert.equal(parseAdsenseClient(undefined), null);
    assert.equal(parseAdSlot("1234567890"), "1234567890");
    assert.equal(parseAdSlot("abc"), null);
  });
});
