/**
 * Shared, serializable contracts for FitKB.
 *
 * Registry entries must stay JSON-serializable so Server Components can pass
 * them to the client workspace. All image work happens in the browser.
 */

export type OptionValue = string | number | boolean;

interface BaseOption {
  id: string;
  label: string;
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
  unit?: string;
}

export interface ToggleOption extends BaseOption {
  type: "toggle";
  defaultValue: boolean;
}

export type ToolOption = SelectOption | RangeOption | ToggleOption;

/**
 * How the photo's pixel dimensions are decided.
 *  - original: keep the photo's own dimensions (shrunk only if needed to hit the size limit)
 *  - max:      fit inside width x height, never upscaled, aspect ratio kept
 *  - cover:    exactly width x height, cropped to fill (passport photos)
 *  - contain:  exactly width x height, whole image kept, padded with white (signatures)
 */
export type SizeMode = "original" | "max" | "cover" | "contain";

export type OutputFormat = "jpeg" | "webp";

export interface PresetSpec {
  /** Upper size limit in KB. The engine stays at or under targetKB x 1000 bytes. */
  targetKB: number;
  mode: SizeMode;
  /** Pixel width/height for max, cover and contain modes. */
  width: number;
  height: number;
  format: OutputFormat;
  /** Vertical crop position for cover mode, 0 = top, 100 = bottom. */
  focusY: number;
}

export interface HowToStep {
  title: string;
  body: string;
}

export interface SpecRow {
  label: string;
  value: string;
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
  /** Intro paragraph rendered under the H1. */
  intro: string;
  category: "Compress" | "Photo ID" | "Signature";
  keywords: readonly string[];
  preset: PresetSpec;
  specs: readonly SpecRow[];
  howTo: readonly HowToStep[];
  faq: readonly FaqEntry[];
  /** ISO date (YYYY-MM-DD) of the last editorial / logic review. */
  lastReviewed: string;
  relatedSlugs: readonly string[];
}
