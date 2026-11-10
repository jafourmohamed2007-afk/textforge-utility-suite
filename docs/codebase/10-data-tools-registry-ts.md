# 10. `data/tools-registry.ts`

Static tool dictionary that powers every /tools/[slug] page.

````ts
import type { ToolDefinition } from "../lib/types";

/**
 * Static tool dictionary. Every entry generates:
 *   - a statically pre-rendered page at /tools/[slug]
 *   - <title>, meta description, canonical, Open Graph and Twitter tags
 *   - SoftwareApplication, HowTo, FAQPage and BreadcrumbList JSON-LD
 *   - a sitemap.xml entry
 * Entries must remain JSON-serializable (no functions).
 */
export const toolsRegistry = [
  {
    slug: "whatsapp-text-formatter",
    name: "WhatsApp Text Formatter",
    shortName: "WhatsApp Formatter",
    tagline:
      "Turn plain text into WhatsApp bold, italic, strikethrough, monospace, quotes and lists instantly. Free, private and built for one-thumb use on mobile.",
    intro:
      "Paste any message and choose a style. TextForge wraps every line in the exact markers WhatsApp understands, moves stray spaces outside the markers so formatting never breaks, and can translate Markdown (**bold**, ~~strike~~, # headings) into WhatsApp syntax.",
    category: "Messaging",
    keywords: [
      "whatsapp text formatter",
      "whatsapp bold text",
      "whatsapp italic generator",
      "whatsapp strikethrough",
      "whatsapp monospace font",
      "markdown to whatsapp",
    ],
    inputLabel: "Plain text",
    outputLabel: "WhatsApp-ready text",
    inputPlaceholder: "Type or paste the message you want to format…",
    sampleInput:
      "Team update for Friday\n  Launch moved to 10:00  \nBring your laptop\n\nOld venue: Room 4B\nQuestions? Reply here",
    downloadName: "whatsapp-message.txt",
    downloadMime: "text/plain",
    options: [
      {
        id: "style",
        type: "select",
        label: "Format style",
        defaultValue: "bold",
        choices: [
          { value: "bold", label: "Bold  *text*" },
          { value: "italic", label: "Italic  _text_" },
          { value: "strikethrough", label: "Strikethrough  ~text~" },
          { value: "bold-italic", label: "Bold italic  *_text_*" },
          { value: "monospace", label: "Monospace block  ```text```" },
          { value: "inline-code", label: "Inline code  `text`" },
          { value: "quote", label: "Quote  > text" },
          { value: "bullet", label: "Bulleted list  - text" },
          { value: "numbered", label: "Numbered list  1. text" },
          { value: "markdown", label: "Convert Markdown → WhatsApp" },
        ],
      },
      {
        id: "stripExisting",
        type: "toggle",
        label: "Remove existing markers first",
        hint: "Prevents doubled symbols such as **text** when re-formatting.",
        defaultValue: true,
      },
    ],
    howTo: [
      {
        title: "Paste your message",
        body: "Tap Paste (or type) in the input panel. Multi-line messages are supported; each line is formatted independently because WhatsApp markers stop at line breaks.",
      },
      {
        title: "Pick a format style",
        body: "Choose bold, italic, strikethrough, bold italic, monospace, inline code, quote, bulleted list, numbered list, or Markdown conversion. The output updates on every keystroke.",
      },
      {
        title: "Check the whitespace handling",
        body: "WhatsApp ignores a marker that touches a space (\"* text *\" stays plain). TextForge trims the inside of each marker and keeps your indentation outside it, so the result always renders.",
      },
      {
        title: "Copy and send",
        body: "Tap Copy, switch to WhatsApp and paste. The markers convert to real formatting as soon as the message is sent or previewed.",
      },
    ],
    syntax: [
      { pattern: "Hello", result: "*Hello*", note: "Bold: a single asterisk on each side." },
      { pattern: "Hello", result: "_Hello_", note: "Italic: a single underscore on each side." },
      { pattern: "Hello", result: "~Hello~", note: "Strikethrough: a single tilde on each side." },
      { pattern: "Hello", result: "```Hello```", note: "Monospace: three backticks, spans multiple lines." },
      { pattern: "Hello", result: "`Hello`", note: "Inline code: one backtick, single line only." },
      { pattern: "**Hello**", result: "*Hello*", note: "Markdown mode: double asterisks become WhatsApp bold." },
      { pattern: "*Hello*", result: "_Hello_", note: "Markdown mode: Markdown italic becomes WhatsApp italic." },
      { pattern: "# Title", result: "*Title*", note: "Markdown mode: headings become bold lines." },
    ],
    faq: [
      {
        question: "Why does my WhatsApp bold text show asterisks instead of bold?",
        answer:
          "WhatsApp only applies formatting when the marker is directly attached to a non-space character on both sides and the whole span sits on one line. \"* hello *\" or a span that crosses a line break stays literal. This formatter trims spaces inside each marker and wraps every line separately to avoid that problem.",
      },
      {
        question: "Can I combine bold and italic in WhatsApp?",
        answer: "Yes. Nest the markers: *_text_* renders as bold italic. Select the \"Bold italic\" style to generate it automatically.",
      },
      {
        question: "Is my message uploaded anywhere?",
        answer:
          "No. All formatting runs in your browser with JavaScript string functions. Nothing is sent to a server, logged or stored, so it is safe for private conversations.",
      },
      {
        question: "Does the formatting work in WhatsApp Business and WhatsApp Web?",
        answer:
          "Yes. Bold, italic, strikethrough and monospace are supported in WhatsApp, WhatsApp Business, WhatsApp Web and the desktop apps. Lists, quotes and inline code are supported in current app versions.",
      },
    ],
    lastReviewed: "2026-11-10",
    relatedSlugs: ["markdown-to-clean-text-stripper", "bulk-whitespace-cleaner"],
  },
  {
    slug: "bulk-whitespace-cleaner",
    name: "Bulk Whitespace Cleaner",
    shortName: "Whitespace Cleaner",
    tagline:
      "Strip trailing spaces, convert or remove tab indentation, collapse triple line breaks and delete invisible characters from any text in one tap.",
    intro:
      "Copying from PDFs, emails, spreadsheets and chat apps leaves behind trailing spaces, mixed tabs, non-breaking spaces and runs of empty lines. The Bulk Whitespace Cleaner normalises all of it while preserving the structure you actually want.",
    category: "Cleanup",
    keywords: [
      "remove trailing spaces",
      "whitespace cleaner online",
      "remove extra line breaks",
      "remove tabs from text",
      "collapse blank lines",
      "remove non breaking spaces",
    ],
    inputLabel: "Messy text",
    outputLabel: "Cleaned text",
    inputPlaceholder: "Paste text with extra spaces, tabs or blank lines…",
    sampleInput:
      "\t\tQuarterly report   \n\t\tPrepared by the data team\t\n\n\n\n\t\t\tRevenue    grew   12%\u00A0this quarter.   \n\n\n\t\t\tCosts were flat.\u200B\n\n\n\n",
    downloadName: "cleaned-text.txt",
    downloadMime: "text/plain",
    options: [
      {
        id: "maxBlankLines",
        type: "range",
        label: "Max blank lines in a row",
        hint: "1 keeps paragraphs separated; 0 joins every line.",
        min: 0,
        max: 3,
        step: 1,
        defaultValue: 1,
        unit: "lines",
      },
      {
        id: "tabWidth",
        type: "range",
        label: "Tab width",
        hint: "Each tab becomes this many spaces. 0 deletes tabs.",
        min: 0,
        max: 8,
        step: 1,
        defaultValue: 2,
        unit: "spaces",
      },
      {
        id: "dedent",
        type: "toggle",
        label: "Remove shared indentation",
        hint: "Shifts the whole block left while keeping relative nesting.",
        defaultValue: true,
      },
      {
        id: "stripIndent",
        type: "toggle",
        label: "Remove all indentation",
        defaultValue: false,
      },
      {
        id: "collapseSpaces",
        type: "toggle",
        label: "Collapse repeated spaces",
        defaultValue: true,
      },
      {
        id: "removeInvisible",
        type: "toggle",
        label: "Fix invisible characters",
        hint: "Zero-width spaces, BOM, soft hyphens and non-breaking spaces.",
        defaultValue: true,
      },
      {
        id: "trimEdges",
        type: "toggle",
        label: "Trim blank lines at start and end",
        defaultValue: true,
      },
    ],
    howTo: [
      {
        title: "Paste the messy text",
        body: "Drop in anything: code copied from a web page, a PDF extract, an email thread or a spreadsheet column. Line endings from Windows (CRLF) and old Mac files (CR) are normalised to LF automatically.",
      },
      {
        title: "Set paragraph spacing",
        body: "Drag the \"Max blank lines\" slider. The default of 1 collapses triple and quadruple breaks into a single empty line between paragraphs.",
      },
      {
        title: "Decide how to treat indentation",
        body: "Tabs are expanded to the chosen width. \"Remove shared indentation\" shifts the block left without flattening nested lines; \"Remove all indentation\" flattens everything.",
      },
      {
        title: "Review the stats and copy",
        body: "The counters show how many trailing spaces, tabs, blank lines and invisible characters were fixed. Tap Copy or Download to take the clean result with you.",
      },
    ],
    syntax: [
      { pattern: "text···⏎", result: "text⏎", note: "Trailing spaces and tabs are removed from every line." },
      { pattern: "⇥⇥item", result: "item", note: "Shared tab indentation is expanded, then removed." },
      { pattern: "a···b", result: "a b", note: "Runs of spaces inside a line collapse to one." },
      { pattern: "¶ ⏎⏎⏎⏎ ¶", result: "¶ ⏎⏎ ¶", note: "Three or more line breaks shrink to the slider limit." },
      { pattern: "U+00A0 (NBSP)", result: "U+0020", note: "Non-breaking and typographic spaces become normal spaces." },
      { pattern: "U+200B / U+FEFF", result: "(removed)", note: "Zero-width spaces and byte-order marks are deleted." },
    ],
    faq: [
      {
        question: "Will cleaning whitespace break emoji or non-Latin text?",
        answer:
          "No. The cleaner deliberately keeps the zero-width joiner (U+200D) and non-joiner (U+200C), which are required for emoji sequences and scripts such as Persian and Hindi. Only characters that are never meaningful in plain text are removed.",
      },
      {
        question: "Is it safe for source code?",
        answer:
          "Yes, with \"Collapse repeated spaces\" turned off if you rely on aligned columns. Relative indentation is preserved when \"Remove shared indentation\" is on, so Python and YAML nesting survives.",
      },
      {
        question: "How large can the text be?",
        answer:
          "The cleaner runs locally and handles several megabytes comfortably on a modern phone. Processing is deferred while you type so the editor never freezes.",
      },
      {
        question: "What counts as a blank line?",
        answer: "Any line that contains only spaces, tabs or invisible characters. These are emptied first and then counted toward the blank-line limit.",
      },
    ],
    lastReviewed: "2026-11-10",
    relatedSlugs: ["markdown-to-clean-text-stripper", "raw-text-to-csv-converter"],
  },
  {
    slug: "raw-text-to-csv-converter",
    name: "Raw Text to CSV Converter",
    shortName: "Text to CSV",
    tagline:
      "Convert comma, tab, semicolon, pipe or space-aligned text into a clean, correctly quoted CSV table with a live preview. Auto-detects the delimiter.",
    intro:
      "Paste rows copied from a spreadsheet, a terminal, a Markdown table or a log file. The converter detects the delimiter, respects quoted fields, pads ragged rows and outputs RFC 4180 compliant CSV that opens cleanly in Excel, Google Sheets and Numbers.",
    category: "Data",
    keywords: [
      "text to csv converter",
      "tab delimited to csv",
      "convert text to csv online",
      "markdown table to csv",
      "semicolon to comma csv",
      "csv cleaner",
    ],
    inputLabel: "Raw delimited text",
    outputLabel: "Clean CSV",
    inputPlaceholder: "Paste rows separated by commas, tabs, semicolons, pipes or spaces…",
    sampleInput:
      "Name\tCity\tRole\tStart date\n Ada Lovelace \tLondon\tAnalyst\t1843-07-01\nGrace Hopper\tNew York, NY\tEngineer\t1944-03-15\nAlan Turing\tManchester\t\t1948-10-01\n\nKatherine Johnson\tHampton\tMathematician",
    downloadName: "converted.csv",
    downloadMime: "text/csv",
    options: [
      {
        id: "delimiter",
        type: "select",
        label: "Input delimiter",
        defaultValue: "auto",
        choices: [
          { value: "auto", label: "Auto-detect" },
          { value: "comma", label: "Comma ," },
          { value: "tab", label: "Tab ⇥" },
          { value: "semicolon", label: "Semicolon ;" },
          { value: "pipe", label: "Pipe | (Markdown tables)" },
          { value: "spaces", label: "2+ spaces (aligned columns)" },
        ],
      },
      {
        id: "outputDelimiter",
        type: "select",
        label: "Output separator",
        defaultValue: "comma",
        choices: [
          { value: "comma", label: "Comma (standard CSV)" },
          { value: "semicolon", label: "Semicolon (European Excel)" },
          { value: "tab", label: "Tab (TSV)" },
        ],
      },
      {
        id: "quoting",
        type: "select",
        label: "Quoting",
        defaultValue: "minimal",
        choices: [
          { value: "minimal", label: "Only when needed" },
          { value: "all", label: "Quote every field" },
        ],
      },
      { id: "trimCells", type: "toggle", label: "Trim spaces in cells", defaultValue: true },
      { id: "skipEmptyRows", type: "toggle", label: "Skip empty rows", defaultValue: true },
      {
        id: "padRows",
        type: "toggle",
        label: "Pad short rows",
        hint: "Adds empty cells so every row has the same column count.",
        defaultValue: true,
      },
      {
        id: "formulaGuard",
        type: "toggle",
        label: "Neutralise spreadsheet formulas",
        hint: "Prefixes cells starting with = + - @ with ' to block CSV injection.",
        defaultValue: false,
      },
    ],
    howTo: [
      {
        title: "Paste the raw rows",
        body: "Copy a range from a spreadsheet (tab separated), a Markdown table, a semicolon export or column-aligned terminal output and paste it into the input panel.",
      },
      {
        title: "Confirm the delimiter",
        body: "Auto-detect scores each candidate delimiter by how consistently it splits the first 25 lines. The detected delimiter is shown in the stats bar; override it from the menu if needed.",
      },
      {
        title: "Tidy the table",
        body: "Trim cells, skip empty rows and pad short rows so every row has the same column count. Check the live table preview below the output.",
      },
      {
        title: "Export",
        body: "Copy the CSV or tap Download to save a .csv file. Fields containing the separator, quotes or line breaks are wrapped in double quotes and inner quotes are doubled, exactly as RFC 4180 requires.",
      },
    ],
    syntax: [
      { pattern: "a⇥b⇥c", result: "a,b,c", note: "Tab-separated rows (spreadsheet copy) become comma-separated." },
      { pattern: "New York, NY", result: "\"New York, NY\"", note: "Fields containing the separator are quoted." },
      { pattern: "5\" screen", result: "\"5\"\" screen\"", note: "Inner double quotes are escaped by doubling them." },
      { pattern: "| a | b |", result: "a,b", note: "Markdown table pipes and |---| separator rows are removed." },
      { pattern: "a;b;c", result: "a,b,c", note: "Semicolon exports from European locales are normalised." },
      { pattern: "=SUM(A1)", result: "'=SUM(A1)", note: "Optional formula guard prevents CSV injection." },
    ],
    faq: [
      {
        question: "How does delimiter auto-detection work?",
        answer:
          "For each candidate (tab, comma, semicolon, pipe) TextForge counts occurrences outside quotes on the first 25 non-empty lines, finds the most common count, and prefers the delimiter that splits every line the same way. If none fits, two or more consecutive spaces are treated as column gaps.",
      },
      {
        question: "Why does Excel put everything in one column?",
        answer:
          "Excel in many European locales expects semicolons. Set \"Output separator\" to Semicolon and the file will open with columns split correctly.",
      },
      {
        question: "Are quoted fields with commas or line breaks supported?",
        answer:
          "Yes. The parser follows RFC 4180: a field that starts with a double quote can contain the delimiter, line breaks and escaped quotes (\"\") until the closing quote.",
      },
      {
        question: "Is my data uploaded?",
        answer: "No. Parsing and conversion run entirely in your browser. Customer lists and financial data never leave your device.",
      },
    ],
    lastReviewed: "2026-11-10",
    relatedSlugs: ["bulk-whitespace-cleaner", "markdown-to-clean-text-stripper"],
  },
  {
    slug: "markdown-to-clean-text-stripper",
    name: "Markdown to Clean Text Stripper",
    shortName: "Markdown Stripper",
    tagline:
      "Remove Markdown syntax — headings, bold, links, images, code blocks, tables and HTML — and get clean, readable plain text instantly.",
    intro:
      "Ideal for turning README files, AI chat answers, Notion or Obsidian notes into text you can paste into emails, forms, CMS fields or social posts. Choose how code blocks, links and lists are handled; everything else is cleaned automatically.",
    category: "Markdown",
    keywords: [
      "markdown to plain text",
      "remove markdown formatting",
      "strip markdown online",
      "convert chatgpt markdown to text",
      "remove asterisks from text",
      "markdown cleaner",
    ],
    inputLabel: "Markdown",
    outputLabel: "Plain text",
    inputPlaceholder: "Paste Markdown from a README, AI chat or notes app…",
    sampleInput:
      "---\ntitle: Release notes\n---\n# Release 2.4 🚀\n\nThis update makes **exports 3× faster** and fixes _several_ bugs. See the [changelog](https://example.com/changelog).\n\n## Highlights\n\n- [x] New `--fast` flag\n- ~~Legacy mode~~ removed\n* Works with <kbd>Ctrl</kbd> + <kbd>C</kbd>\n\n> **Note:** restart the app after updating. #release #devtools\n\n```bash\nnpm install textforge@latest\n```\n\n| Feature | Status |\n|---------|--------|\n| Export  | Faster |\n\n![Diagram](https://example.com/diagram.png)",
    downloadName: "plain-text.txt",
    downloadMime: "text/plain",
    options: [
      {
        id: "codeBlocks",
        type: "select",
        label: "Fenced code blocks",
        defaultValue: "remove",
        choices: [
          { value: "remove", label: "Remove entirely" },
          { value: "keep", label: "Keep code, drop fences" },
        ],
      },
      {
        id: "links",
        type: "select",
        label: "Links",
        defaultValue: "text",
        choices: [
          { value: "text", label: "Keep link text" },
          { value: "text-url", label: "Text (URL)" },
          { value: "url", label: "URL only" },
        ],
      },
      {
        id: "listMarkers",
        type: "select",
        label: "Bullet lists",
        defaultValue: "remove",
        choices: [
          { value: "remove", label: "Remove markers" },
          { value: "bullet", label: "Convert to •" },
        ],
      },
      { id: "removeHashtags", type: "toggle", label: "Remove #hashtags", defaultValue: false },
      { id: "stripHtml", type: "toggle", label: "Remove HTML tags", defaultValue: true },
      { id: "collapseBlank", type: "toggle", label: "Collapse extra blank lines", defaultValue: true },
    ],
    howTo: [
      {
        title: "Paste Markdown",
        body: "Paste a README, a ChatGPT or Claude answer, or notes exported from Obsidian, Notion or GitHub. YAML front matter at the top is detected and removed.",
      },
      {
        title: "Choose what to keep",
        body: "Decide whether fenced code blocks disappear or keep their content, whether links become their text or include the URL, and whether bullet points become • symbols.",
      },
      {
        title: "Let the stripper clean inline syntax",
        body: "Headings (#), emphasis (* _ **), strikethrough (~~), inline code, images, footnotes, blockquotes, table pipes, escapes and HTML entities are converted to their readable text.",
      },
      {
        title: "Copy the plain text",
        body: "Tap Copy and paste into any field that does not render Markdown. Paragraph spacing is preserved, so the text stays readable.",
      },
    ],
    syntax: [
      { pattern: "## Heading", result: "Heading", note: "ATX heading hashes are removed; setext underlines are dropped." },
      { pattern: "**bold** _italic_", result: "bold italic", note: "Emphasis markers are removed; snake_case words are left alone." },
      { pattern: "[docs](https://x.y)", result: "docs", note: "Links keep their label (or label and URL, by option)." },
      { pattern: "![alt](img.png)", result: "alt", note: "Images are replaced by their alt text." },
      { pattern: "`code`", result: "code", note: "Inline code keeps its literal content." },
      { pattern: "```…```", result: "(removed)", note: "Fenced code blocks are removed or unwrapped by option." },
      { pattern: "| a | b |", result: "a⇥b", note: "Table rows become tab-separated text; separators are dropped." },
      { pattern: "&amp; \\*", result: "& *", note: "HTML entities are decoded and backslash escapes are honoured." },
    ],
    faq: [
      {
        question: "How do I remove the asterisks and hashtags from ChatGPT answers?",
        answer:
          "Paste the answer here. Headings lose their # symbols, bold and italic lose their asterisks and underscores, and lists lose their markers. Turn on \"Remove #hashtags\" to also delete social-style #tags from the text.",
      },
      {
        question: "Will it damage words like file_name or 2*3*4?",
        answer:
          "No. Underscore emphasis is only removed when the underscores sit at word boundaries, and asterisk emphasis requires a non-space character on both inner sides, so identifiers and simple maths stay intact.",
      },
      {
        question: "Does it support GitHub Flavored Markdown?",
        answer:
          "Yes: tables, task lists, strikethrough, autolinks, footnotes and fenced code blocks with ``` or ~~~ are all handled, along with inline HTML.",
      },
      {
        question: "Is anything sent to a server?",
        answer: "No. Stripping runs locally in your browser using JavaScript regular expressions, so private notes stay on your device.",
      },
    ],
    lastReviewed: "2026-11-10",
    relatedSlugs: ["whatsapp-text-formatter", "bulk-whitespace-cleaner"],
  },
] as const satisfies readonly ToolDefinition[];

export type ToolSlug = (typeof toolsRegistry)[number]["slug"];

const toolsBySlug: ReadonlyMap<string, ToolDefinition> = new Map(toolsRegistry.map((tool) => [tool.slug, tool]));

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return toolsBySlug.get(slug);
}

export function getAllTools(): readonly ToolDefinition[] {
  return toolsRegistry;
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  return tool.relatedSlugs.map((slug) => toolsBySlug.get(slug)).filter((item): item is ToolDefinition => item !== undefined);
}
````
