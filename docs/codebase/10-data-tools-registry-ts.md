# 10. `data/tools-registry.ts`

Preset dictionary that powers every /[slug] page.

```ts
import type { FaqEntry, HowToStep, PresetSpec, SpecRow, ToolDefinition } from "../lib/types";

/**
 * Static preset dictionary. Every entry generates:
 *   - a statically pre-rendered page at /[slug]
 *   - <title>, meta description, canonical, Open Graph and Twitter tags
 *   - SoftwareApplication, HowTo, FAQPage and BreadcrumbList JSON-LD
 *   - a sitemap.xml entry
 * Entries must remain JSON-serializable (no functions).
 */

const LAST_REVIEWED = "2026-11-11";

const sharedFaq: readonly FaqEntry[] = [
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. The photo is decoded, resized and compressed inside your browser with the Canvas API. Nothing is uploaded, so ID photos and signatures never leave your phone or computer.",
  },
  {
    question: "Why is the result a little under the KB limit instead of exactly on it?",
    answer:
      "Upload forms reject files that are even one byte over the limit, and some count 1 KB as 1000 bytes while others use 1024. FitKB stays at or under the limit times 1000 bytes, which passes both checks, and picks the highest quality that fits.",
  },
  {
    question: "Can I use photos from an iPhone (HEIC)?",
    answer:
      "Yes in Safari, and when you pick a photo through the iPhone photo picker it is usually converted to JPG automatically. If another browser cannot open a HEIC file, export it as JPG (Share, then Save as JPEG) and try again.",
  },
];

function compressSteps(kb: number): readonly HowToStep[] {
  return [
    {
      title: "Choose your photo",
      body: "Tap the upload area to pick a photo from your gallery or camera, drag a file onto it, or paste an image. JPG, PNG and WebP all work.",
    },
    {
      title: `Keep ${kb} KB as the limit`,
      body: `The size limit is already set to ${kb} KB. Change it if your form asks for something else. You can also cap the width and height.`,
    },
    {
      title: "Let FitKB find the best quality",
      body: "The tool re-encodes the photo several times in your browser and keeps the sharpest version that is still under the limit. It only shrinks the dimensions when quality alone is not enough.",
    },
    {
      title: "Check and download",
      body: "Compare the before and after sizes, zoom into the preview, then tap Download. The file name includes the limit so you can find it in your downloads.",
    },
  ];
}

function compressPreset(targetKB: number): PresetSpec {
  return { targetKB, mode: "original", width: 1600, height: 1600, format: "jpeg", focusY: 50 };
}

function compressSpecs(kb: number, typical: string): readonly SpecRow[] {
  return [
    { label: "Size limit", value: `${kb} KB or less (${(kb * 1000).toLocaleString("en-US")} bytes)` },
    { label: "Output format", value: "JPEG (WebP optional)" },
    { label: "Dimensions", value: "Original, shrunk only if needed" },
    { label: "Typical result", value: typical },
    { label: "Processing", value: "In your browser, nothing uploaded" },
  ];
}

export const toolsRegistry = [
  {
    slug: "compress-image-to-20kb",
    name: "Compress Image to 20KB",
    shortName: "20 KB",
    tagline: "Reduce any photo to 20 KB or less in seconds, right on your phone. No upload, no sign-up, no watermark.",
    intro:
      "Application portals for exams, jobs and government services often reject photos above 20 KB. Choose your photo and FitKB finds the sharpest version that fits under 20 KB, shrinking the dimensions only when it has to.",
    category: "Compress",
    keywords: ["compress image to 20kb", "reduce photo size to 20kb", "image resize 20kb", "20kb photo converter", "jpg to 20kb"],
    preset: compressPreset(20),
    specs: compressSpecs(20, "About 300 to 500 px wide for a normal photo"),
    howTo: compressSteps(20),
    faq: [
      {
        question: "How small will my photo be at 20 KB?",
        answer:
          "A detailed camera photo usually ends up around 300 to 500 pixels wide at 20 KB. That is enough for a form thumbnail or ID photo. Plain backgrounds compress better, so a passport-style photo stays sharper than a busy landscape.",
      },
      {
        question: "My form needs between 10 KB and 20 KB. Will this work?",
        answer:
          "Usually yes. FitKB aims for the highest quality under 20 KB, so results normally land just below the limit, well above 10 KB. The exact size is shown under the preview before you download.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["compress-image-to-50kb", "compress-image-to-10kb", "passport-size-photo-35x45mm"],
  },
  {
    slug: "compress-image-to-50kb",
    name: "Compress Image to 50KB",
    shortName: "50 KB",
    tagline: "Shrink JPG, PNG or WebP photos to 50 KB or less without losing more quality than you have to. Free and private.",
    intro:
      "50 KB is one of the most common upload limits for application photos and profile pictures. FitKB re-encodes your photo in the browser and keeps the best-looking version that stays under 50 KB.",
    category: "Compress",
    keywords: ["compress image to 50kb", "reduce image size to 50kb", "photo 50kb converter", "jpg to 50kb", "resize image 50kb online"],
    preset: compressPreset(50),
    specs: compressSpecs(50, "About 500 to 800 px wide for a normal photo"),
    howTo: compressSteps(50),
    faq: [
      {
        question: "Will 50 KB look blurry?",
        answer:
          "Not for typical form and profile use. At 50 KB most photos keep 500 to 800 pixels on the long side with clean detail. Zoom into the preview before downloading to check faces and text.",
      },
      {
        question: "Can I convert a PNG to a 50 KB JPG?",
        answer:
          "Yes. PNG files are converted to JPEG, which is far smaller for photos. Transparent areas become white, which is what upload forms expect.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["compress-image-to-20kb", "compress-image-to-100kb", "signature-resize-20kb"],
  },
  {
    slug: "compress-image-to-100kb",
    name: "Compress Image to 100KB",
    shortName: "100 KB",
    tagline: "Get any image under 100 KB for forms, email and websites. Runs in your browser with no upload.",
    intro:
      "100 KB keeps a photo sharp enough for most uses while passing typical upload limits. FitKB lowers JPEG quality step by step and only reduces the dimensions if quality alone cannot reach 100 KB.",
    category: "Compress",
    keywords: ["compress image to 100kb", "reduce image size to 100kb", "jpg to 100kb", "image compressor 100kb", "photo size 100kb"],
    preset: compressPreset(100),
    specs: compressSpecs(100, "About 800 to 1200 px wide for a normal photo"),
    howTo: compressSteps(100),
    faq: [
      {
        question: "Is 100 KB good enough for printing?",
        answer:
          "For a small print such as an ID card photo, yes. For anything larger than a postcard, keep the original file. A 100 KB JPEG is meant for uploads and screens.",
      },
      {
        question: "Why did my 90 KB photo change at all?",
        answer:
          "Every photo is re-encoded so EXIF data such as GPS location is removed and the orientation is fixed. If the original is already small, the result is a clean JPEG of similar size.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["compress-image-to-50kb", "compress-image-to-200kb", "us-passport-photo-2x2"],
  },
  {
    slug: "compress-image-to-200kb",
    name: "Compress Image to 200KB",
    shortName: "200 KB",
    tagline: "Compress large phone photos to 200 KB or less while keeping them sharp. Private, free and mobile friendly.",
    intro:
      "Modern phone cameras produce 3 to 10 MB photos. FitKB brings them under 200 KB for job portals, marketplaces and email, usually without changing the dimensions you can see on screen.",
    category: "Compress",
    keywords: ["compress image to 200kb", "reduce photo to 200kb", "jpg to 200kb", "image size reducer 200kb", "compress jpeg 200kb"],
    preset: compressPreset(200),
    specs: compressSpecs(200, "About 1200 to 1800 px wide for a normal photo"),
    howTo: compressSteps(200),
    faq: [
      {
        question: "How long does it take?",
        answer:
          "Usually one to three seconds on a phone. Very large photos take longer because the browser encodes them several times to find the best quality under the limit.",
      },
      {
        question: "Does it remove location data?",
        answer: "Yes. The new file is drawn from pixels only, so EXIF metadata such as GPS coordinates and camera details is not copied.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["compress-image-to-100kb", "compress-image-to-50kb", "compress-image-to-20kb"],
  },
  {
    slug: "compress-image-to-10kb",
    name: "Compress Image to 10KB",
    shortName: "10 KB",
    tagline: "Make a photo or scan 10 KB or smaller for strict upload limits. Works on any phone, nothing is uploaded.",
    intro:
      "Some application systems allow only 10 KB for a photo or thumb impression. FitKB keeps the face or mark readable by lowering quality first, then shrinking dimensions just enough to pass.",
    category: "Compress",
    keywords: ["compress image to 10kb", "reduce photo size to 10kb", "10kb photo resize", "jpg to 10kb", "image 10kb converter"],
    preset: compressPreset(10),
    specs: compressSpecs(10, "About 200 to 350 px wide for a normal photo"),
    howTo: compressSteps(10),
    faq: [
      {
        question: "How can I keep a 10 KB photo readable?",
        answer:
          "Crop tightly before uploading so the face or signature fills the frame, and use a plain background. Fewer details means more of the 10 KB goes to what matters.",
      },
      {
        question: "The result says it could not fit. What now?",
        answer:
          "This happens only with locked dimensions. Switch Dimensions to Keep original or Fit inside a box so FitKB is allowed to shrink the photo, or raise the size limit.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["compress-image-to-20kb", "signature-resize-20kb", "passport-size-photo-35x45mm"],
  },
  {
    slug: "passport-size-photo-35x45mm",
    name: "Passport Size Photo Maker 35x45mm",
    shortName: "35×45 mm",
    tagline: "Crop and compress a photo to the 35×45 mm passport size (413×531 px at 300 DPI) under 50 KB, on your phone.",
    intro:
      "35×45 mm is the most widely used passport and visa photo size, used for example for UK passports and Schengen visas. FitKB crops your photo to that shape at 300 DPI and keeps the file under your size limit. Always check the official rules of the form you are filling.",
    category: "Photo ID",
    keywords: ["passport size photo 35x45", "35x45 mm photo online", "passport photo maker", "passport size photo kb", "visa photo resize"],
    preset: { targetKB: 50, mode: "cover", width: 413, height: 531, format: "jpeg", focusY: 30 },
    specs: [
      { label: "Print size", value: "35 × 45 mm" },
      { label: "Pixel size", value: "413 × 531 px (300 DPI)" },
      { label: "Size limit", value: "50 KB by default, adjustable" },
      { label: "Crop", value: "Fills the frame, framing adjustable" },
      { label: "Background", value: "Kept as photographed; use a plain light wall" },
    ],
    howTo: [
      {
        title: "Take a plain photo",
        body: "Stand in front of a plain light wall in even light, face the camera, keep a neutral expression and leave space above your head.",
      },
      {
        title: "Upload it",
        body: "Tap the upload area and choose the photo. FitKB crops it to the 35×45 mm shape at 300 DPI (413×531 pixels).",
      },
      {
        title: "Adjust the framing",
        body: "Use the Vertical framing slider to move the crop up or down until your head and the top of your shoulders sit in the frame.",
      },
      {
        title: "Match the form's KB limit and download",
        body: "Set the size limit your form states (50 KB is the default), check the preview and tap Download.",
      },
    ],
    faq: [
      {
        question: "Does this check biometric rules like head size?",
        answer:
          "No. FitKB crops, sizes and compresses the photo, but it does not measure head position, lighting or expression. Follow the official photo guidance of the issuing authority.",
      },
      {
        question: "Why 413 × 531 pixels?",
        answer: "35 mm and 45 mm converted at 300 dots per inch give 413 × 531 pixels, a standard print resolution for photo prints.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["us-passport-photo-2x2", "signature-resize-20kb", "compress-image-to-20kb"],
  },
  {
    slug: "us-passport-photo-2x2",
    name: "2x2 Inch Passport Photo Maker",
    shortName: "2×2 inch",
    tagline: "Crop any photo to a square 2×2 inch (600×600 px) passport photo and keep it under 240 KB. Free, on your phone.",
    intro:
      "The United States uses a square 2×2 inch passport photo. FitKB crops your photo to a 600×600 pixel square, the digital size often requested for online applications, and compresses it under your size limit.",
    category: "Photo ID",
    keywords: ["2x2 passport photo", "us passport photo online", "600x600 photo converter", "2x2 photo maker", "passport photo 2x2 inch"],
    preset: { targetKB: 240, mode: "cover", width: 600, height: 600, format: "jpeg", focusY: 30 },
    specs: [
      { label: "Print size", value: "2 × 2 in (51 × 51 mm)" },
      { label: "Pixel size", value: "600 × 600 px" },
      { label: "Size limit", value: "240 KB by default, adjustable" },
      { label: "Crop", value: "Square, framing adjustable" },
      { label: "Background", value: "Kept as photographed; use a plain white or off-white wall" },
    ],
    howTo: [
      {
        title: "Take the photo",
        body: "Use a plain white or off-white background, even lighting and a straight-on, neutral expression. Remove glasses.",
      },
      {
        title: "Upload it",
        body: "Tap the upload area and choose the photo. FitKB crops it to a 600×600 pixel square.",
      },
      {
        title: "Frame your head",
        body: "Move the Vertical framing slider until your whole head and the top of your shoulders are centred in the square.",
      },
      {
        title: "Download",
        body: "Keep the 240 KB limit or set the one your application asks for, then tap Download.",
      },
    ],
    faq: [
      {
        question: "Is 600 × 600 pixels accepted?",
        answer:
          "Many online systems ask for a square digital photo of at least 600 × 600 pixels. Requirements differ between applications, so confirm the dimensions and file size on the official site before submitting.",
      },
      {
        question: "Can I print this photo?",
        answer: "Yes. 600 × 600 pixels prints at 2 × 2 inches at 300 DPI. Print it on photo paper at its actual size, without scaling.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["passport-size-photo-35x45mm", "compress-image-to-100kb", "signature-resize-20kb"],
  },
  {
    slug: "signature-resize-20kb",
    name: "Signature Resize to 20KB",
    shortName: "Signature",
    tagline: "Turn a photo of your signature into a clean 400×160 px image under 20 KB for online forms. Nothing is uploaded.",
    intro:
      "Online applications often ask for a scanned signature in a wide box under 20 KB. FitKB fits your signature photo into a 400×160 pixel white canvas without cropping it, then compresses it under the limit.",
    category: "Signature",
    keywords: ["signature resize 20kb", "signature photo resize", "resize signature online", "signature 20kb converter", "signature image size"],
    preset: { targetKB: 20, mode: "contain", width: 400, height: 160, format: "jpeg", focusY: 50 },
    specs: [
      { label: "Canvas", value: "400 × 160 px, white padding" },
      { label: "Size limit", value: "20 KB by default, adjustable" },
      { label: "Fit", value: "Whole signature kept, never cropped" },
      { label: "Output format", value: "JPEG" },
      { label: "Tip", value: "Sign with a dark pen on plain white paper" },
    ],
    howTo: [
      {
        title: "Photograph your signature",
        body: "Sign with a black or dark blue pen on plain white paper. Photograph it from directly above in good light, filling most of the frame.",
      },
      {
        title: "Upload it",
        body: "Choose the photo. FitKB places the whole signature inside a 400×160 pixel white box without cropping any part of it.",
      },
      {
        title: "Change the box if your form needs it",
        body: "Enter the width and height your form specifies. The signature is centred and padded with white.",
      },
      {
        title: "Download",
        body: "Check that the strokes are readable in the preview, then tap Download.",
      },
    ],
    faq: [
      {
        question: "Why is there white space around my signature?",
        answer:
          "Contain mode keeps the entire signature and fills the rest of the box with white, so nothing is cut off. Crop the photo closer to the signature before uploading to reduce the padding.",
      },
      {
        question: "The paper looks grey. Can I fix that?",
        answer: "Retake the photo in brighter, even light, or near a window. Grey paper costs bytes, while a clean white background compresses to almost nothing.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["passport-size-photo-35x45mm", "compress-image-to-20kb", "compress-image-to-10kb"],
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

/** Free-form tool shown on the home page. */
export const homePreset: PresetSpec = { targetKB: 50, mode: "original", width: 1600, height: 1600, format: "jpeg", focusY: 50 };
```
