const LINK_PATTERN = /\[([^\]]+)\]\((\/[^)\s]*|https:\/\/[^)\s]+)\)/g;

export interface TextPart {
  text: string;
  href?: string;
}

/**
 * Splits "see [the guide](/guides/x)" into plain text and link parts. Internal
 * links start with "/", external ones with "https://".
 */
export function parseLinks(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ text: text.slice(last, index) });
    parts.push({ text: match[1] ?? "", href: match[2] ?? "/" });
    last = index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

/** Removes link markup, leaving the label (for JSON-LD and meta text). */
export function stripLinks(text: string): string {
  return text.replace(LINK_PATTERN, "$1");
}
