# 07. `lib/types.ts`

Serializable engine contracts (tool definitions, options, results).

```ts
/**
 * Shared, serializable contracts for the TextForge engine.
 *
 * Everything in the registry must stay JSON-serializable so that it can be
 * passed from Server Components into the client workspace without functions.
 * Processing functions live in `lib/processors` and are resolved by slug on
 * the client.
 */

export type OptionValue = string | number | boolean;
export type OptionValues = Record<string, OptionValue>;

interface BaseOption {
  /** Key used inside the OptionValues record handed to processors. */
  id: string;
  /** Human-readable control label. */
  label: string;
  /** Short helper text rendered under the control. */
  hint?: string;
}

export interface SelectOption extends BaseOption {
  type: "select";
  choices: ReadonlyArray<{ value: string; label: string }>;
  defaultValue: string;
}

export interface RangeOption extends BaseOption {
  type: "range";
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  /** Optional unit suffix shown next to the live value (e.g. "spaces"). */
  unit?: string;
}

export interface ToggleOption extends BaseOption {
  type: "toggle";
  defaultValue: boolean;
}

export type ToolOption = SelectOption | RangeOption | ToggleOption;

export interface HowToStep {
  title: string;
  body: string;
}

export interface SyntaxRule {
  /** What the user types / what is detected. */
  pattern: string;
  /** What TextForge produces. */
  result: string;
  /** Plain-language note. */
  note: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  slug: string;
  /** Full product name used in titles and H1. */
  name: string;
  /** Compact label for navigation chips. */
  shortName: string;
  /** One-line value proposition (meta description). */
  tagline: string;
  /** Longer intro paragraph rendered under the H1. */
  intro: string;
  category: "Messaging" | "Cleanup" | "Data" | "Markdown";
  keywords: readonly string[];
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  sampleInput: string;
  /** File name used by the Download button. */
  downloadName: string;
  downloadMime: "text/plain" | "text/csv";
  options: readonly ToolOption[];
  howTo: readonly HowToStep[];
  syntax: readonly SyntaxRule[];
  faq: readonly FaqEntry[];
  /** ISO date (YYYY-MM-DD) of the last editorial / logic review. */
  lastReviewed: string;
  relatedSlugs: readonly string[];
}

export interface ResultStat {
  label: string;
  value: string;
}

export interface ProcessResult {
  output: string;
  stats: ResultStat[];
  /** Optional structured preview (used by the CSV converter). */
  table?: string[][];
  /** Non-fatal notice shown under the output panel. */
  warning?: string;
}

export type Processor = (input: string, options: OptionValues) => ProcessResult;
```
