import type { OptionValues, ProcessResult } from "../types";
import { formatCount, normalizeNewlines, readBoolean, readString } from "./shared.ts";

export type DelimiterKey = "comma" | "tab" | "semicolon" | "pipe" | "spaces";

const DELIMITER_CHARS: Record<Exclude<DelimiterKey, "spaces">, string> = {
  comma: ",",
  tab: "\t",
  semicolon: ";",
  pipe: "|",
};

const DELIMITER_NAMES: Record<DelimiterKey, string> = {
  comma: "Comma",
  tab: "Tab",
  semicolon: "Semicolon",
  pipe: "Pipe",
  spaces: "Aligned spaces",
};

const PREVIEW_ROW_LIMIT = 50;

/** Counts a delimiter outside of double-quoted sections of a single line. */
function countOutsideQuotes(line: string, delimiter: string): number {
  let inQuotes = false;
  let count = 0;
  for (const char of line) {
    if (char === '"') inQuotes = !inQuotes;
    else if (!inQuotes && char === delimiter) count += 1;
  }
  return count;
}

/**
 * Picks the delimiter that splits the sample lines most consistently.
 * Score = (lines sharing the most common non-zero count) x (that count).
 */
export function detectDelimiter(text: string): DelimiterKey {
  const sample = text
    .split("\n")
    .filter((line) => line.trim() !== "")
    .slice(0, 25);
  if (sample.length === 0) return "comma";

  let best: { key: DelimiterKey; score: number } = { key: "comma", score: 0 };
  for (const key of ["tab", "comma", "semicolon", "pipe"] as const) {
    const counts = sample.map((line) => countOutsideQuotes(line, DELIMITER_CHARS[key]));
    const frequency = new Map<number, number>();
    for (const count of counts) if (count > 0) frequency.set(count, (frequency.get(count) ?? 0) + 1);
    let modeCount = 0;
    let modeLines = 0;
    for (const [count, lines] of frequency) {
      if (lines > modeLines || (lines === modeLines && count > modeCount)) {
        modeCount = count;
        modeLines = lines;
      }
    }
    const score = modeLines * modeCount + (modeLines === sample.length ? 1000 : 0);
    if (modeCount > 0 && score > best.score) best = { key, score };
  }

  if (best.score === 0 && sample.some((line) => / {2,}/.test(line.trim()))) return "spaces";
  return best.key;
}

interface ParseOutcome {
  rows: string[][];
  unclosedQuote: boolean;
}

/** RFC 4180 style parser: handles quoted fields, escaped quotes ("") and embedded newlines. */
function parseDelimited(text: string, delimiter: string): ParseOutcome {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let fieldStarted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (inQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"' && field.trim() === "" && !fieldStarted) {
      inQuotes = true;
      fieldStarted = true;
      field = "";
    } else if (char === delimiter) {
      row.push(field);
      field = "";
      fieldStarted = false;
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      fieldStarted = false;
    } else {
      field += char;
    }
  }
  row.push(field);
  rows.push(row);
  return { rows, unclosedQuote: inQuotes };
}

function parseAlignedSpaces(text: string): ParseOutcome {
  return {
    rows: text.split("\n").map((line) => line.trim().split(/ {2,}|\t/)),
    unclosedQuote: false,
  };
}

const MARKDOWN_SEPARATOR_ROW = /^\s*:?-+:?\s*$/;

function cleanPipeTable(rows: string[][]): string[][] {
  return rows
    .map((cells) => {
      const copy = [...cells];
      if (copy.length > 1 && (copy[0] ?? "").trim() === "") copy.shift();
      if (copy.length > 1 && (copy[copy.length - 1] ?? "").trim() === "") copy.pop();
      return copy;
    })
    .filter((cells) => !cells.every((cell) => MARKDOWN_SEPARATOR_ROW.test(cell)));
}

const NUMERIC = /^[-+]?(\d+[.,]?\d*|[.,]\d+)(e[-+]?\d+)?$/i;

function neutralizeFormula(cell: string): string {
  if (/^[=+\-@\t\r]/.test(cell) && !NUMERIC.test(cell)) return `'${cell}`;
  return cell;
}

function encodeField(cell: string, outputDelimiter: string, quoteAll: boolean): string {
  const needsQuotes =
    quoteAll ||
    cell.includes(outputDelimiter) ||
    cell.includes('"') ||
    cell.includes("\n") ||
    cell.includes("\r") ||
    /^\s|\s$/.test(cell);
  return needsQuotes ? `"${cell.replace(/"/g, '""')}"` : cell;
}

export function convertToCsv(input: string, options: OptionValues): ProcessResult {
  const text = normalizeNewlines(input);
  const requested = readString(options, "delimiter", "auto");
  const outputKey = readString(options, "outputDelimiter", "comma");
  const quoteAll = readString(options, "quoting", "minimal") === "all";
  const trimCells = readBoolean(options, "trimCells", true);
  const skipEmptyRows = readBoolean(options, "skipEmptyRows", true);
  const padRows = readBoolean(options, "padRows", true);
  const formulaGuard = readBoolean(options, "formulaGuard", false);

  if (text.trim() === "") {
    return {
      output: "",
      table: [],
      stats: [
        { label: "Rows", value: "0" },
        { label: "Columns", value: "0" },
        { label: "Delimiter", value: "—" },
      ],
    };
  }

  const delimiterKey: DelimiterKey =
    requested === "auto" || !(requested in DELIMITER_NAMES) ? detectDelimiter(text) : (requested as DelimiterKey);

  const parsed = delimiterKey === "spaces" ? parseAlignedSpaces(text) : parseDelimited(text, DELIMITER_CHARS[delimiterKey]);

  let rows = delimiterKey === "pipe" ? cleanPipeTable(parsed.rows) : parsed.rows;
  if (trimCells) rows = rows.map((cells) => cells.map((cell) => cell.trim()));
  if (skipEmptyRows) rows = rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
  if (formulaGuard) rows = rows.map((cells) => cells.map(neutralizeFormula));

  const columnCount = rows.reduce((max, cells) => Math.max(max, cells.length), 0);
  let raggedRows = 0;
  if (padRows) {
    rows = rows.map((cells) => {
      if (cells.length === columnCount) return cells;
      raggedRows += 1;
      return [...cells, ...Array<string>(columnCount - cells.length).fill("")];
    });
  } else {
    raggedRows = rows.filter((cells) => cells.length !== columnCount).length;
  }

  const outputDelimiter = outputKey === "semicolon" ? ";" : outputKey === "tab" ? "\t" : ",";
  const output = rows.map((cells) => cells.map((cell) => encodeField(cell, outputDelimiter, quoteAll)).join(outputDelimiter)).join("\n");

  const warnings: string[] = [];
  if (parsed.unclosedQuote) warnings.push("An opening double quote was never closed; the rest of the input was read as one field.");
  if (raggedRows > 0 && padRows) warnings.push(`${raggedRows} short row(s) were padded with empty cells to ${columnCount} columns.`);
  if (raggedRows > 0 && !padRows) warnings.push(`${raggedRows} row(s) have a different column count than the widest row.`);
  if (rows.length > PREVIEW_ROW_LIMIT) warnings.push(`Table preview shows the first ${PREVIEW_ROW_LIMIT} of ${formatCount(rows.length)} rows. The CSV output contains every row.`);

  return {
    output,
    table: rows.slice(0, PREVIEW_ROW_LIMIT),
    warning: warnings.length > 0 ? warnings.join(" ") : undefined,
    stats: [
      { label: "Rows", value: formatCount(rows.length) },
      { label: "Columns", value: formatCount(columnCount) },
      { label: "Delimiter", value: `${DELIMITER_NAMES[delimiterKey]}${requested === "auto" ? " (auto)" : ""}` },
      { label: "Output chars", value: formatCount(output.length) },
    ],
  };
}
