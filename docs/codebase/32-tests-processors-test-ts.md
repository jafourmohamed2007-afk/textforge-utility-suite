# 32. `tests/processors.test.ts`

Node test runner unit tests for all processors.

````ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { convertToCsv, detectDelimiter } from "../lib/processors/csv-converter.ts";
import { stripMarkdown } from "../lib/processors/markdown-stripper.ts";
import { formatWhatsApp, markdownToWhatsApp } from "../lib/processors/whatsapp-formatter.ts";
import { cleanWhitespace } from "../lib/processors/whitespace-cleaner.ts";

describe("whatsapp-text-formatter", () => {
  it("wraps each non-empty line and moves spaces outside the markers", () => {
    const { output } = formatWhatsApp("  hello world  \n\nsecond", { style: "bold", stripExisting: true });
    assert.equal(output, "  *hello world*  \n\n*second*");
  });

  it("supports italic, strikethrough and bold italic", () => {
    assert.equal(formatWhatsApp("hi", { style: "italic" }).output, "_hi_");
    assert.equal(formatWhatsApp("hi", { style: "strikethrough" }).output, "~hi~");
    assert.equal(formatWhatsApp("hi", { style: "bold-italic" }).output, "*_hi_*");
  });

  it("does not double existing markers when stripExisting is on", () => {
    assert.equal(formatWhatsApp("*already bold*", { style: "italic", stripExisting: true }).output, "_already bold_");
  });

  it("builds numbered and bulleted lists skipping blank lines", () => {
    assert.equal(formatWhatsApp("a\n\nb", { style: "numbered" }).output, "1. a\n\n2. b");
    assert.equal(formatWhatsApp(" a \nb", { style: "bullet" }).output, "- a\n- b");
  });

  it("wraps monospace as a single block", () => {
    assert.equal(formatWhatsApp("\nline 1\nline 2\n", { style: "monospace" }).output, "```line 1\nline 2```");
  });

  it("converts markdown emphasis, headings and links", () => {
    assert.equal(markdownToWhatsApp("**bold** and *italic* and ~~gone~~"), "*bold* and _italic_ and ~gone~");
    assert.equal(markdownToWhatsApp("# Title"), "*Title*");
    assert.equal(markdownToWhatsApp("[site](https://a.b)"), "site (https://a.b)");
    assert.equal(markdownToWhatsApp("* item"), "- item");
    assert.equal(markdownToWhatsApp("keep `**code**`"), "keep `**code**`");
  });

  it("returns empty output for empty input", () => {
    assert.equal(formatWhatsApp("   ", { style: "bold" }).output, "");
  });
});

describe("bulk-whitespace-cleaner", () => {
  const defaults = { tabWidth: 2, maxBlankLines: 1, dedent: true, stripIndent: false, collapseSpaces: true, removeInvisible: true, trimEdges: true };

  it("strips trailing spaces and collapses triple paragraph breaks", () => {
    const { output } = cleanWhitespace("one   \n\n\n\ntwo\t\n", defaults);
    assert.equal(output, "one\n\ntwo");
  });

  it("dedents shared tab indentation but keeps nesting", () => {
    const { output } = cleanWhitespace("\t\tparent\n\t\t\tchild", defaults);
    assert.equal(output, "parent\n  child");
  });

  it("can remove all indentation and join lines with 0 blank lines", () => {
    const { output } = cleanWhitespace("  a\n\n    b", { ...defaults, stripIndent: true, maxBlankLines: 0 });
    assert.equal(output, "a\nb");
  });

  it("normalises CRLF, NBSP and zero-width characters but keeps ZWJ emoji", () => {
    const family = "\u{1F468}‍\u{1F469}‍\u{1F467}";
    const { output } = cleanWhitespace(`a b​c\r\n${family}`, defaults);
    assert.equal(output, `a bc\n${family}`);
  });

  it("collapses inner spaces without touching indentation", () => {
    const { output } = cleanWhitespace("x\n    a    b", { ...defaults, dedent: false });
    assert.equal(output, "x\n    a b");
  });

  it("deletes tabs when tab width is 0", () => {
    assert.equal(cleanWhitespace("a\tb", { ...defaults, tabWidth: 0 }).output, "ab");
  });
});

describe("raw-text-to-csv-converter", () => {
  const defaults = { delimiter: "auto", outputDelimiter: "comma", quoting: "minimal", trimCells: true, skipEmptyRows: true, padRows: true, formulaGuard: false };

  it("detects tabs and quotes fields containing commas", () => {
    const result = convertToCsv("Name\tCity\nGrace\tNew York, NY", defaults);
    assert.equal(result.output, 'Name,City\nGrace,"New York, NY"');
    assert.deepEqual(result.table, [["Name", "City"], ["Grace", "New York, NY"]]);
  });

  it("detects delimiters consistently", () => {
    assert.equal(detectDelimiter("a;b;c\n1;2;3"), "semicolon");
    assert.equal(detectDelimiter("a,b\n1,2"), "comma");
    assert.equal(detectDelimiter("| a | b |\n|---|---|\n| 1 | 2 |"), "pipe");
    assert.equal(detectDelimiter("name    age\nbob     42"), "spaces");
  });

  it("parses RFC 4180 quoted fields with escaped quotes and newlines", () => {
    const result = convertToCsv('id,note\n1,"He said ""hi""\nthen left"', defaults);
    assert.deepEqual(result.table, [["id", "note"], ["1", 'He said "hi"\nthen left']]);
    assert.equal(result.output, 'id,note\n1,"He said ""hi""\nthen left"');
  });

  it("converts markdown tables and drops separator rows", () => {
    const result = convertToCsv("| a | b |\n|---|:-:|\n| 1 | 2 |", defaults);
    assert.equal(result.output, "a,b\n1,2");
  });

  it("pads ragged rows and reports a warning", () => {
    const result = convertToCsv("a,b,c\n1,2", defaults);
    assert.equal(result.output, "a,b,c\n1,2,");
    assert.match(result.warning ?? "", /padded/);
  });

  it("supports quote-all, semicolon output and formula guard", () => {
    const result = convertToCsv("x,y\n=SUM(A1),-5", { ...defaults, quoting: "all", outputDelimiter: "semicolon", formulaGuard: true });
    assert.equal(result.output, '"x";"y"\n"\'=SUM(A1)";"-5"');
  });

  it("handles empty input", () => {
    assert.equal(convertToCsv("  \n ", defaults).output, "");
  });
});

describe("markdown-to-clean-text-stripper", () => {
  const defaults = { codeBlocks: "remove", links: "text", listMarkers: "remove", removeHashtags: false, stripHtml: true, collapseBlank: true };

  it("removes headings, emphasis, links and images", () => {
    const md = "# Title\n\nSome **bold**, _italic_ and [a link](https://x.y \"t\").\n\n![alt text](img.png)";
    assert.equal(stripMarkdown(md, defaults).output, "Title\n\nSome bold, italic and a link.\n\nalt text");
  });

  it("removes or keeps fenced code blocks", () => {
    const md = "before\n```js\nconst a = 1;\n```\nafter";
    assert.equal(stripMarkdown(md, defaults).output, "before\nafter");
    assert.equal(stripMarkdown(md, { ...defaults, codeBlocks: "keep" }).output, "before\nconst a = 1;\n\nafter");
  });

  it("keeps snake_case identifiers and arithmetic intact", () => {
    assert.equal(stripMarkdown("use file_name_here and 2 * 3 * 4", defaults).output, "use file_name_here and 2 * 3 * 4");
  });

  it("handles lists, task lists, quotes, tables, escapes and entities", () => {
    const md = "- one\n- [x] done\n> quoted\n| a | b |\n|---|---|\n| 1 | 2 |\n\\*not italic\\* &amp; more";
    assert.equal(stripMarkdown(md, defaults).output, "one\ndone\nquoted\na\tb\n1\t2\n*not italic* & more");
    assert.equal(stripMarkdown("- one", { ...defaults, listMarkers: "bullet" }).output, "• one");
  });

  it("supports link modes, hashtag removal, HTML and front matter", () => {
    assert.equal(stripMarkdown("[a](https://b.c)", { ...defaults, links: "text-url" }).output, "a (https://b.c)");
    assert.equal(stripMarkdown("[a](https://b.c)", { ...defaults, links: "url" }).output, "https://b.c");
    assert.equal(stripMarkdown("Ship it #release #dev now", { ...defaults, removeHashtags: true }).output, "Ship it now");
    assert.equal(stripMarkdown("Press <kbd>Ctrl</kbd>", defaults).output, "Press Ctrl");
    assert.equal(stripMarkdown("---\ntitle: x\n---\nBody", defaults).output, "Body");
  });

  it("keeps inline code content literal", () => {
    assert.equal(stripMarkdown("Run `npm **run** dev`", defaults).output, "Run npm **run** dev");
  });
});
````
