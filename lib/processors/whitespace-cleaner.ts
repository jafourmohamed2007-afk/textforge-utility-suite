import type { OptionValues, ProcessResult } from "../types";
import { formatCount, normalizeNewlines, readBoolean, readNumber, sizeStats } from "./shared.ts";

/** Space-like characters that render as a gap but are not U+0020. */
const EXOTIC_SPACES = /[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g;
/**
 * Invisible characters that silently break search, diffing and code.
 * ZWJ (U+200D) and ZWNJ (U+200C) are intentionally kept: they glue emoji
 * sequences and are required by several scripts (Persian, Hindi, etc.).
 */
const INVISIBLES = /[\u200B\u2060\uFEFF\u00AD]/g;

function leadingWidth(line: string): number {
  const match = /^ */.exec(line);
  return match ? match[0].length : 0;
}

export function cleanWhitespace(input: string, options: OptionValues): ProcessResult {
  const tabWidth = Math.max(0, Math.min(8, Math.round(readNumber(options, "tabWidth", 2))));
  const maxBlankLines = Math.max(0, Math.min(3, Math.round(readNumber(options, "maxBlankLines", 1))));
  const dedent = readBoolean(options, "dedent", true);
  const stripIndent = readBoolean(options, "stripIndent", false);
  const collapseSpaces = readBoolean(options, "collapseSpaces", true);
  const removeInvisible = readBoolean(options, "removeInvisible", true);
  const trimEdges = readBoolean(options, "trimEdges", true);

  let text = normalizeNewlines(input);
  let invisibleCount = 0;

  if (removeInvisible) {
    text = text.replace(INVISIBLES, () => {
      invisibleCount += 1;
      return "";
    });
    text = text.replace(EXOTIC_SPACES, () => {
      invisibleCount += 1;
      return " ";
    });
  }

  const tabCount = (text.match(/\t/g) ?? []).length;
  const tabReplacement = " ".repeat(tabWidth);
  let trailingRemoved = 0;

  let lines = text.split("\n").map((rawLine) => {
    const expanded = rawLine.replace(/\t/g, tabReplacement);
    const trimmedEnd = expanded.replace(/[ \f\v]+$/, "");
    if (trimmedEnd.length !== expanded.length) trailingRemoved += 1;
    return trimmedEnd;
  });

  if (stripIndent) {
    lines = lines.map((line) => line.replace(/^ +/, ""));
  } else if (dedent) {
    const indents = lines.filter((line) => line.trim() !== "").map(leadingWidth);
    const common = indents.length > 0 ? Math.min(...indents) : 0;
    if (common > 0) lines = lines.map((line) => line.slice(Math.min(common, leadingWidth(line))));
  }

  if (collapseSpaces) {
    // Collapse runs of spaces *after* the indentation so structure is preserved.
    lines = lines.map((line) => {
      const indent = line.slice(0, leadingWidth(line));
      return indent + line.slice(indent.length).replace(/ {2,}/g, " ");
    });
  }

  // Limit consecutive blank lines (this collapses triple paragraph breaks).
  const collapsed: string[] = [];
  let blankRun = 0;
  let blankLinesRemoved = 0;
  for (const line of lines) {
    if (line === "") {
      blankRun += 1;
      if (blankRun > maxBlankLines) {
        blankLinesRemoved += 1;
        continue;
      }
    } else {
      blankRun = 0;
    }
    collapsed.push(line);
  }

  if (trimEdges) {
    while (collapsed.length > 0 && collapsed[0] === "") {
      collapsed.shift();
      blankLinesRemoved += 1;
    }
    while (collapsed.length > 0 && collapsed[collapsed.length - 1] === "") {
      collapsed.pop();
      blankLinesRemoved += 1;
    }
  }

  const output = collapsed.join("\n");

  return {
    output,
    stats: [
      { label: "Trailing fixed", value: formatCount(trailingRemoved) },
      { label: "Tabs converted", value: formatCount(tabCount) },
      { label: "Blank lines cut", value: formatCount(blankLinesRemoved) },
      { label: "Invisibles fixed", value: formatCount(invisibleCount) },
      { label: "Chars saved", value: formatCount(Math.max(0, input.length - output.length)) },
      ...sizeStats(input, output).slice(1),
    ],
  };
}
