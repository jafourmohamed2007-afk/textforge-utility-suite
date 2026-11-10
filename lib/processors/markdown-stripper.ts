import type { OptionValues, ProcessResult } from "../types";
import { createVault, formatCount, normalizeNewlines, readBoolean, readString, sizeStats } from "./shared.ts";

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&mdash;": "—",
  "&ndash;": "–",
  "&hellip;": "…",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d{1,7});/g, (match, code: string) => {
      const value = Number(code);
      return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : match;
    })
    .replace(/&#x([0-9a-f]{1,6});/gi, (match, code: string) => {
      const value = Number.parseInt(code, 16);
      return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : match;
    })
    .replace(/&[a-z]+;|&#39;/gi, (entity) => HTML_ENTITIES[entity.toLowerCase()] ?? entity);
}

const FENCE_OPEN = /^[ \t]{0,3}(`{3,}|~{3,})(.*)$/;
const HORIZONTAL_RULE = /^[ \t]{0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/;
const SETEXT_UNDERLINE = /^[ \t]{0,3}=+[ \t]*$/;
const TABLE_SEPARATOR = /^[ \t]*\|?[ \t]*:?-{3,}:?[ \t]*(\|[ \t]*:?-{3,}:?[ \t]*)*\|?[ \t]*$/;
const REFERENCE_DEFINITION = /^[ \t]{0,3}\[(?!\^)[^\]]+\]:[ \t]+\S+.*$/;
const FOOTNOTE_DEFINITION = /^[ \t]{0,3}\[\^[^\]]+\]:[ \t]*/;
const HEADING = /^[ \t]{0,3}#{1,6}(?:[ \t]+(.*?))?[ \t]*#*[ \t]*$/;
const BLOCKQUOTE = /^[ \t]*(?:>[ \t]?)+/;
const TASK_ITEM = /^([ \t]*)[-*+][ \t]+\[[ xX]\][ \t]+/;
const UNORDERED_ITEM = /^([ \t]*)[-*+][ \t]+/;

interface StripCounters {
  headings: number;
  links: number;
  codeBlocks: number;
}

function stripInline(line: string, linkMode: string, stripHtml: boolean, counters: StripCounters): string {
  const vault = createVault();

  // Backslash escapes and inline code are shielded so their content stays literal.
  let text = line.replace(/\\([\\`*_{}[\]()#+\-.!|~>=])/g, (_m, char: string) => vault.protect(char));
  text = text.replace(/(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/g, (_m, _ticks: string, code: string) => vault.protect(code.trim()));

  text = text
    // Images: keep alt text only.
    .replace(/!\[([^\]]*)\]\((?:[^()\s]|\([^()]*\))+(?:[ \t]+"[^"]*")?\)/g, "$1")
    .replace(/!\[([^\]]*)\]\[[^\]]*\]/g, "$1")
    // Inline links.
    .replace(/\[([^\]]+)\]\(((?:[^()\s]|\([^()]*\))+)(?:[ \t]+"[^"]*")?\)/g, (_m, label: string, url: string) => {
      counters.links += 1;
      if (linkMode === "text-url") return `${label} (${url})`;
      if (linkMode === "url") return url;
      return label;
    })
    // Reference links [text][ref] and collapsed [text][].
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, (_m, label: string) => {
      counters.links += 1;
      return label;
    })
    // Autolinks <https://...> and <mail@example.com>.
    .replace(/<((?:https?|ftp):\/\/[^>\s]+|[^@>\s]+@[^@>\s]+\.[^@>\s]+)>/g, "$1")
    // Footnote references.
    .replace(/\[\^[^\]]+\]/g, "");

  if (stripHtml) text = text.replace(/<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s[^<>]*)?\/?>/g, "").replace(/<!--[\s\S]*?-->/g, "");

  text = text
    .replace(/(\*\*\*|___)(?!\s)(.+?)(?<!\s)\1/g, "$2")
    .replace(/(\*\*|__)(?!\s)(.+?)(?<!\s)\1/g, "$2")
    .replace(/~~(?!\s)(.+?)(?<!\s)~~/g, "$1")
    .replace(/==(?!\s)(.+?)(?<!\s)==/g, "$1")
    .replace(/(^|[^*\w])\*(?![\s*])(.+?)(?<![\s*])\*(?!\w)/g, "$1$2")
    .replace(/(^|[^_\p{L}\p{N}])_(?![\s_])(.+?)(?<![\s_])_(?![\p{L}\p{N}])/gu, "$1$2");

  return decodeEntities(vault.restore(text));
}

export function stripMarkdown(input: string, options: OptionValues): ProcessResult {
  const codeMode = readString(options, "codeBlocks", "remove");
  const linkMode = readString(options, "links", "text");
  const listMode = readString(options, "listMarkers", "remove");
  const removeHashtags = readBoolean(options, "removeHashtags", false);
  const stripHtml = readBoolean(options, "stripHtml", true);
  const collapseBlank = readBoolean(options, "collapseBlank", true);

  const counters: StripCounters = { headings: 0, links: 0, codeBlocks: 0 };
  let lines = normalizeNewlines(input).split("\n");

  // YAML / TOML front matter at the very top of the document.
  const frontMatterFence = lines[0]?.trim();
  if (frontMatterFence === "---" || frontMatterFence === "+++") {
    const closing = lines.findIndex((line, index) => index > 0 && line.trim() === frontMatterFence);
    if (closing > 0) lines = lines.slice(closing + 1);
  }

  const output: string[] = [];
  let fence: { marker: string } | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";

    if (fence) {
      const closingFence = new RegExp(`^[ \\t]{0,3}${fence.marker[0] === "`" ? "`" : "~"}{${fence.marker.length},}[ \\t]*$`);
      if (closingFence.test(line)) {
        fence = null;
        if (codeMode === "keep") output.push("");
      } else if (codeMode === "keep") {
        output.push(line);
      }
      continue;
    }

    const fenceMatch = FENCE_OPEN.exec(line);
    if (fenceMatch) {
      fence = { marker: fenceMatch[1] ?? "```" };
      counters.codeBlocks += 1;
      continue;
    }

    if (HORIZONTAL_RULE.test(line) || SETEXT_UNDERLINE.test(line) || TABLE_SEPARATOR.test(line) || REFERENCE_DEFINITION.test(line)) {
      // A "---" line directly under text is a setext H2 underline; both cases are dropped.
      continue;
    }

    let current = line.replace(FOOTNOTE_DEFINITION, "");

    const heading = HEADING.exec(current);
    if (heading) {
      counters.headings += 1;
      current = heading[1] ?? "";
    }

    current = current.replace(BLOCKQUOTE, "");

    const bullet = listMode === "bullet" ? "• " : "";
    if (TASK_ITEM.test(current)) current = current.replace(TASK_ITEM, `$1${bullet}`);
    else if (UNORDERED_ITEM.test(current)) current = current.replace(UNORDERED_ITEM, `$1${bullet}`);

    // Table rows: "| a | b |" -> "a    b" (tab separated for spreadsheet pasting).
    if (/^\s*\|.*\|\s*$/.test(current)) {
      current = current
        .trim()
        .replace(/^\||\|$/g, "")
        .split(/(?<!\\)\|/)
        .map((cell) => cell.trim())
        .join("\t");
    }

    current = stripInline(current, linkMode, stripHtml, counters);

    if (removeHashtags) current = current.replace(/(^|\s)#[\p{L}\p{N}_]+/gu, "$1").replace(/ {2,}/g, " ");

    output.push(current.replace(/[ \t]+$/, ""));
  }

  let result = output.join("\n");
  if (collapseBlank) result = result.replace(/\n{3,}/g, "\n\n");
  result = result.replace(/^\n+|\n+$/g, "");

  return {
    output: result,
    stats: [
      { label: "Headings", value: formatCount(counters.headings) },
      { label: "Links", value: formatCount(counters.links) },
      { label: "Code blocks", value: formatCount(counters.codeBlocks) },
      ...sizeStats(input, result),
    ],
  };
}
