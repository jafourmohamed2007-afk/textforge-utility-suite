import type { Processor } from "../types";
import { convertToCsv } from "./csv-converter.ts";
import { stripMarkdown } from "./markdown-stripper.ts";
import { cleanWhitespace } from "./whitespace-cleaner.ts";
import { formatWhatsApp } from "./whatsapp-formatter.ts";

/**
 * Slug -> pure processing function. Every processor is synchronous, side-effect
 * free and runs entirely in the browser (no network round trips).
 * Add a new tool by registering its definition in `data/tools-registry.ts`
 * and its processor here; the dynamic route picks both up automatically.
 */
export const processors: Readonly<Record<string, Processor>> = {
  "whatsapp-text-formatter": formatWhatsApp,
  "bulk-whitespace-cleaner": cleanWhitespace,
  "raw-text-to-csv-converter": convertToCsv,
  "markdown-to-clean-text-stripper": stripMarkdown,
};

export function getProcessor(slug: string): Processor | undefined {
  return processors[slug];
}
