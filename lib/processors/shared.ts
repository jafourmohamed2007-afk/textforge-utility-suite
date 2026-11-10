import type { OptionValues, ResultStat } from "../types";

/** Converts Windows (CRLF) and classic Mac (CR) line endings to LF. */
export function normalizeNewlines(text: string): string {
  return text.replace(/\r\n?/g, "\n");
}

export function readString(options: OptionValues, key: string, fallback: string): string {
  const value = options[key];
  return typeof value === "string" ? value : fallback;
}

export function readNumber(options: OptionValues, key: string, fallback: number): number {
  const value = options[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return fallback;
}

export function readBoolean(options: OptionValues, key: string, fallback: boolean): boolean {
  const value = options[key];
  return typeof value === "boolean" ? value : fallback;
}

export function countWords(text: string): number {
  const matches = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu);
  return matches ? matches.length : 0;
}

export function countLines(text: string): number {
  if (text.length === 0) return 0;
  return text.split("\n").length;
}

const numberFormat = new Intl.NumberFormat("en-US");

export function formatCount(value: number): string {
  return numberFormat.format(value);
}

/** Standard before/after stats shared by every tool. */
export function sizeStats(input: string, output: string): ResultStat[] {
  return [
    { label: "Input chars", value: formatCount(input.length) },
    { label: "Output chars", value: formatCount(output.length) },
    { label: "Words", value: formatCount(countWords(output)) },
    { label: "Lines", value: formatCount(countLines(output)) },
  ];
}

/**
 * Placeholder vault used to shield fragments (code spans, escapes) from later
 * regex passes. Private-use code points never occur in normal user text.
 */
export function createVault() {
  const store: string[] = [];
  return {
    protect(fragment: string): string {
      store.push(fragment);
      return `\uE000${store.length - 1}\uE001`;
    },
    restore(text: string): string {
      let current = text;
      // Restore repeatedly in case protected fragments were nested.
      for (let pass = 0; pass < 4 && current.includes("\uE000"); pass += 1) {
        current = current.replace(/\uE000(\d+)\uE001/g, (_match, index: string) => store[Number(index)] ?? "");
      }
      return current;
    },
  };
}
