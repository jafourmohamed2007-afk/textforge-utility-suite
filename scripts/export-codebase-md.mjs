/**
 * Exports every source file into its own numbered Markdown file under
 * docs/codebase/, so the project can be reviewed block-by-block on a phone.
 * Run with: npm run docs:codebase
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "docs", "codebase");

/** [path, purpose] in the order a reader should compile them. */
const files = [
  ["package.json", "Dependencies and scripts (runtime deps: next, react, react-dom only)."],
  ["tsconfig.json", "Strict TypeScript configuration."],
  ["next.config.ts", "Next.js config with security headers."],
  ["postcss.config.mjs", "Tailwind CSS v4 PostCSS plugin."],
  [".env.example", "Public site URL used for canonical links and JSON-LD."],
  [".gitignore", "Ignored build output."],
  ["lib/types.ts", "Serializable contracts: presets, options, page content."],
  ["lib/site.ts", "Site config and the SEO title builder."],
  ["lib/structured-data.ts", "SoftwareApplication / HowTo / FAQPage / Breadcrumb JSON-LD builders."],
  ["data/tools-registry.ts", "Preset dictionary that powers every /[slug] page."],
  ["lib/image/math.ts", "Pure geometry and size helpers (crop plans, mm to px, KB limits)."],
  ["lib/image/fit.ts", "Pure size-targeting search (quality binary search + scale adjustment)."],
  ["lib/image/browser.ts", "Browser side: decode with EXIF orientation, draw to canvas, encode."],
  ["app/globals.css", "Tailwind v4 theme tokens, dark mode, 48px tap targets, slider and checkerboard."],
  ["app/layout.tsx", "Root layout, default metadata and viewport."],
  ["app/page.tsx", "Home page: free-form resizer plus preset list."],
  ["app/[slug]/page.tsx", "Dynamic preset route: generateStaticParams, generateMetadata, JSON-LD."],
  ["app/not-found.tsx", "404 page."],
  ["app/sitemap.ts", "sitemap.xml generated from the registry."],
  ["app/robots.ts", "robots.txt."],
  ["app/manifest.ts", "Web app manifest."],
  ["app/icon.svg", "Favicon."],
  ["components/SiteHeader.tsx", "Header with preset navigation chips."],
  ["components/SiteFooter.tsx", "Footer."],
  ["components/OptionControl.tsx", "Touch-friendly select / range / toggle controls."],
  ["components/PhotoWorkspace.tsx", "Client workspace: upload, settings, live compression, preview, download."],
  ["components/ToolGuide.tsx", "E-E-A-T content panels: how-to, output spec, method, FAQ."],
  ["tests/image.test.ts", "Node test runner unit tests for the math and size search."],
];

const languages = { ts: "ts", tsx: "tsx", mjs: "js", json: "json", css: "css", svg: "svg", example: "bash", gitignore: "gitignore" };

function fenceFor(content) {
  const longest = Math.max(2, ...[...content.matchAll(/`+/g)].map((match) => match[0].length));
  return "`".repeat(longest + 1);
}

function slugify(path) {
  return path.replace(/^\./, "").replace(/[[\]]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const index = [
  "# FitKB codebase, file by file",
  "",
  "Each file below is one source file. Create the file at the path shown and paste the code block. Regenerate with `npm run docs:codebase`.",
  "",
];

files.forEach(([path, purpose], position) => {
  const content = readFileSync(join(root, path), "utf8").replace(/\n$/, "");
  const extension = path.split(".").pop() ?? "";
  const fence = fenceFor(content);
  const number = String(position + 1).padStart(2, "0");
  const name = `${number}-${slugify(path)}.md`;
  const markdown = [`# ${number}. \`${path}\``, "", purpose, "", `${fence}${languages[extension] ?? ""}`, content, fence, ""].join("\n");
  writeFileSync(join(outDir, name), markdown);
  index.push(`${position + 1}. [\`${path}\`](./${name}) — ${purpose}`);
});

writeFileSync(join(outDir, "README.md"), `${index.join("\n")}\n`);

const known = new Set(files.map(([path]) => path));
const sourceDirs = ["app", "components", "lib", "data", "tests", "scripts"];
const missing = [];
for (const dir of sourceDirs) {
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        const rel = relative(root, full);
        if (!known.has(rel) && rel !== "scripts/export-codebase-md.mjs") missing.push(rel);
      }
    }
  };
  walk(join(root, dir));
}
if (missing.length > 0) console.warn(`Not exported (add them to the list): ${missing.join(", ")}`);
console.log(`Wrote ${files.length} files to ${relative(root, outDir)}/`);
