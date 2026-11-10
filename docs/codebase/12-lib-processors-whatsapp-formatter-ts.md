# 12. `lib/processors/whatsapp-formatter.ts`

whatsapp-text-formatter processor.

````ts
import type { ProcessResult, OptionValues } from "../types";
import { createVault, formatCount, normalizeNewlines, readBoolean, readString, sizeStats } from "./shared.ts";

/**
 * WhatsApp formatting rules (as rendered by WhatsApp on Android, iOS, Web and Desktop):
 *   *bold*  _italic_  ~strikethrough~  ```monospace```  `inline code`
 *   > quote   - bulleted list   1. numbered list
 * Markers must touch non-whitespace characters, so leading and trailing
 * spaces are moved outside the markers for every line.
 */

type WrapStyle = "bold" | "italic" | "strikethrough" | "inline-code";

const WRAP_MARKERS: Record<WrapStyle, string> = {
  bold: "*",
  italic: "_",
  strikethrough: "~",
  "inline-code": "`",
};

const EXISTING_MARKER = /(^|[\s(])([*_~])(?!\s)([^\n]*?\S)\2(?=$|[\s.,!?;:)])/g;

/** Removes existing WhatsApp inline markers so re-formatting never doubles them. */
export function stripWhatsAppMarkers(text: string): string {
  let current = text.replace(/```([\s\S]*?)```/g, "$1");
  // Repeat to unwrap nested combinations such as *_bold italic_*.
  for (let pass = 0; pass < 3; pass += 1) {
    const next = current.replace(EXISTING_MARKER, "$1$3").replace(/`([^`\n]+)`/g, "$1");
    if (next === current) break;
    current = next;
  }
  return current;
}

function wrapLine(line: string, marker: string): string {
  if (line.trim() === "") return line;
  const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(line);
  if (!match) return line;
  const [, lead = "", core = "", trail = ""] = match;
  return `${lead}${marker}${core}${marker}${trail}`;
}

function prefixLines(lines: string[], prefixFor: (index: number) => string): string[] {
  let counter = 0;
  return lines.map((line) => {
    if (line.trim() === "") return line;
    counter += 1;
    return `${prefixFor(counter)}${line.trim()}`;
  });
}

/** Translates common Markdown syntax into WhatsApp's native markup. */
export function markdownToWhatsApp(text: string): string {
  const vault = createVault();

  // 1. Shield fenced code blocks and inline code from emphasis conversion.
  let result = text.replace(/^[ \t]*(```|~~~)[^\n]*\n([\s\S]*?)\n[ \t]*\1[ \t]*$/gm, (_m, _fence: string, body: string) =>
    vault.protect("```" + body + "```"),
  );
  result = result.replace(/`([^`\n]+)`/g, (_m, code: string) => vault.protect("`" + code + "`"));

  // 2. Block-level syntax.
  result = result
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/gm, (_m, heading: string) => vault.protect(`*${heading.trim()}*`))
    .replace(/^([ \t]*)[*+][ \t]+/gm, "$1- ")
    .replace(/^[ \t]*([-*_])(?:[ \t]*\1){2,}[ \t]*$/gm, "");

  // 3. Links and images.
  result = result
    .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_m, alt: string, src: string) => (alt ? `${alt} (${src})` : src))
    .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, "$1 ($2)");

  // 4. Inline emphasis. Bold first, protected so the italic pass cannot re-read it.
  result = result
    .replace(/\*\*\*(?!\s)(.+?)(?<!\s)\*\*\*/g, (_m, inner: string) => vault.protect(`*_${inner}_*`))
    .replace(/\*\*(?!\s)(.+?)(?<!\s)\*\*/g, (_m, inner: string) => vault.protect(`*${inner}*`))
    .replace(/__(?!\s)(.+?)(?<!\s)__/g, (_m, inner: string) => vault.protect(`*${inner}*`))
    .replace(/~~(?!\s)(.+?)(?<!\s)~~/g, (_m, inner: string) => vault.protect(`~${inner}~`))
    .replace(/(^|[^*\w])\*(?![\s*])(.+?)(?<![\s*])\*(?!\*)/gm, (_m, before: string, inner: string) => `${before}${vault.protect(`_${inner}_`)}`);

  return vault.restore(result);
}

export function formatWhatsApp(input: string, options: OptionValues): ProcessResult {
  const text = normalizeNewlines(input);
  const style = readString(options, "style", "bold");
  const stripExisting = readBoolean(options, "stripExisting", true);

  if (text.trim() === "") {
    return { output: "", stats: sizeStats(input, "") };
  }

  const source = stripExisting && style !== "markdown" ? stripWhatsAppMarkers(text) : text;
  const lines = source.split("\n");
  const contentLines = lines.filter((line) => line.trim() !== "").length;
  let output: string;

  switch (style) {
    case "bold":
    case "italic":
    case "strikethrough":
    case "inline-code":
      output = lines.map((line) => wrapLine(line, WRAP_MARKERS[style])).join("\n");
      break;
    case "bold-italic":
      output = lines.map((line) => wrapLine(wrapLine(line, "_"), "*")).join("\n");
      break;
    case "monospace":
      output = "```" + source.replace(/^\n+|\n+$/g, "") + "```";
      break;
    case "quote":
      output = prefixLines(lines, () => "> ").join("\n");
      break;
    case "bullet":
      output = prefixLines(lines, () => "- ").join("\n");
      break;
    case "numbered":
      output = prefixLines(lines, (n) => `${n}. `).join("\n");
      break;
    case "markdown":
      output = markdownToWhatsApp(source);
      break;
    default:
      output = source;
  }

  return {
    output,
    stats: [{ label: "Lines formatted", value: formatCount(contentLines) }, ...sizeStats(input, output)],
  };
}
````
