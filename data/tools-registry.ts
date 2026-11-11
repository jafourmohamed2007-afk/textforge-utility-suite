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

/** "20 KB", or "1 MB" for 1000 KB. */
function sizeLabel(kb: number): string {
  return kb >= 1000 && kb % 1000 === 0 ? `${kb / 1000} MB` : `${kb} KB`;
}

function compressSteps(kb: number): readonly HowToStep[] {
  const label = sizeLabel(kb);
  return [
    {
      title: "Choose your photo",
      body: "Tap the upload area to pick a photo from your gallery or camera, drag a file onto it, or paste an image. JPG, PNG and WebP all work.",
    },
    {
      title: `Keep ${label} as the limit`,
      body: `The size limit is already set to ${label}. Change it if your form asks for something else. You can also cap the width and height.`,
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
    { label: "Size limit", value: `${sizeLabel(kb)} or less (${(kb * 1000).toLocaleString("en-US")} bytes)` },
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
  {
    slug: "compress-image-to-30kb",
    name: "Compress Image to 30KB",
    shortName: "30 KB",
    tagline: "Reduce a photo or scan to 30 KB or less for application forms. Free, private and works on any phone.",
    intro:
      "30 KB sits between the very strict 20 KB limits and the more generous 50 KB ones, and is common for application photos and thumb impressions. FitKB keeps the highest quality that fits under 30 KB.",
    category: "Compress",
    keywords: ["compress image to 30kb", "reduce photo size to 30kb", "jpg to 30kb", "30kb photo converter", "resize image 30kb"],
    preset: compressPreset(30),
    specs: compressSpecs(30, "About 350 to 600 px wide for a normal photo"),
    howTo: compressSteps(30),
    faq: [
      {
        question: "My form allows 10 KB to 30 KB. What limit should I set?",
        answer:
          "Set 30 KB. FitKB picks the highest quality under the limit, so the file normally lands just under 30 KB and well above the 10 KB minimum.",
      },
      {
        question: "Is 30 KB enough for a clear face photo?",
        answer:
          "Yes for a head-and-shoulders photo with a plain background. Crop out empty space first so more of the 30 KB is spent on the face.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["compress-image-to-20kb", "compress-image-to-40kb", "compress-image-to-50kb"],
  },
  {
    slug: "compress-image-to-40kb",
    name: "Compress Image to 40KB",
    shortName: "40 KB",
    tagline: "Get any JPG, PNG or WebP photo under 40 KB without a visible drop in quality. No upload, no watermark.",
    intro:
      "Some portals cap photos at 40 KB, often with a lower minimum such as 20 KB. FitKB compresses your photo in the browser and keeps the sharpest version that stays under 40 KB.",
    category: "Compress",
    keywords: ["compress image to 40kb", "reduce image size to 40kb", "jpg to 40kb", "photo 40kb", "image resize 40kb online"],
    preset: compressPreset(40),
    specs: compressSpecs(40, "About 450 to 700 px wide for a normal photo"),
    howTo: compressSteps(40),
    faq: [
      {
        question: "How do I make sure the photo is not below a 20 KB minimum?",
        answer:
          "Use 40 KB as the limit. Results land close to the limit, and the exact byte count is shown so you can confirm it is above the minimum.",
      },
      {
        question: "Can I also set exact pixel dimensions?",
        answer:
          "Yes. Choose Exact width × height, crop to fill in the Dimensions setting and enter the numbers from your form. FitKB then compresses that crop under 40 KB.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["compress-image-to-30kb", "compress-image-to-50kb", "passport-size-photo-35x45mm"],
  },
  {
    slug: "compress-image-to-150kb",
    name: "Compress Image to 150KB",
    shortName: "150 KB",
    tagline: "Compress photos to 150 KB or less for job portals, scholarship forms and email. Private and mobile friendly.",
    intro:
      "150 KB is large enough to keep a full-screen photo crisp and small enough for most upload limits. FitKB usually reaches it by adjusting JPEG quality alone, keeping a large part of the original resolution.",
    category: "Compress",
    keywords: ["compress image to 150kb", "reduce photo size to 150kb", "jpg to 150kb", "image 150kb converter", "resize image 150kb"],
    preset: compressPreset(150),
    specs: compressSpecs(150, "About 1000 to 1500 px wide for a normal photo"),
    howTo: compressSteps(150),
    faq: [
      {
        question: "Will a document photo stay readable at 150 KB?",
        answer:
          "Usually yes. Photograph the page flat in good light so the text is sharp, then check the preview at full zoom before downloading.",
      },
      {
        question: "Why is my result much smaller than 150 KB?",
        answer:
          "If the original is already small or simple, FitKB keeps it at the highest quality and it simply does not need 150 KB. It never adds data to reach a size.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["compress-image-to-100kb", "compress-image-to-200kb", "compress-image-to-300kb"],
  },
  {
    slug: "compress-image-to-300kb",
    name: "Compress Image to 300KB",
    shortName: "300 KB",
    tagline: "Bring large phone photos under 300 KB while keeping them sharp for screens and small prints. Free and private.",
    intro:
      "300 KB is a common limit for listing photos, ID documents and attachments. Phone photos of 3 to 10 MB usually reach it at high JPEG quality, so detail stays clear.",
    category: "Compress",
    keywords: ["compress image to 300kb", "reduce image size to 300kb", "jpg to 300kb", "photo 300kb", "image compressor 300kb"],
    preset: compressPreset(300),
    specs: compressSpecs(300, "About 1500 to 2200 px wide for a normal photo"),
    howTo: compressSteps(300),
    faq: [
      {
        question: "Is 300 KB good enough for an ID document scan?",
        answer:
          "For most portals, yes. Keep the document flat, fill the frame and avoid glare. If text looks soft, retake the photo closer rather than raising the size.",
      },
      {
        question: "Can I compress several photos at once?",
        answer: "FitKB processes one photo at a time so you can check each result. Choosing the next photo keeps your settings.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["compress-image-to-200kb", "compress-image-to-500kb", "compress-image-to-150kb"],
  },
  {
    slug: "compress-image-to-500kb",
    name: "Compress Image to 500KB",
    shortName: "500 KB",
    tagline: "Shrink a photo to 500 KB or less with almost no visible change. Ideal for email, marketplaces and portals.",
    intro:
      "At 500 KB most phone photos keep their full resolution or close to it. FitKB lowers JPEG quality only as far as needed, which is usually invisible at this size.",
    category: "Compress",
    keywords: ["compress image to 500kb", "reduce photo size to 500kb", "jpg to 500kb", "image size 500kb", "resize photo under 500kb"],
    preset: compressPreset(500),
    specs: compressSpecs(500, "Often 2000 px or more, close to the original"),
    howTo: compressSteps(500),
    faq: [
      {
        question: "Will people notice the photo was compressed?",
        answer:
          "Rarely at 500 KB. Differences mostly appear in very fine textures such as grass or hair, and only when zoomed in.",
      },
      {
        question: "What if my photo is a PNG screenshot?",
        answer:
          "It is converted to JPG, which works well for photos. For screenshots of text, check the preview at full zoom; if letters look soft, use WebP if your form accepts it.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["compress-image-to-300kb", "compress-image-to-1mb", "compress-image-to-200kb"],
  },
  {
    slug: "compress-image-to-1mb",
    name: "Compress Image to 1MB",
    shortName: "1 MB",
    tagline: "Reduce large photos to under 1 MB for uploads and email while keeping them sharp. Free, private, no upload.",
    intro:
      "Many sites limit uploads to 1 MB, while phone cameras save 3 to 10 MB photos. FitKB gets them under 1,000,000 bytes, which passes both 1000- and 1024-based checks, while keeping as much resolution as the limit allows.",
    category: "Compress",
    keywords: ["compress image to 1mb", "reduce photo size to 1mb", "jpg under 1mb", "image compressor 1mb", "resize image to 1mb"],
    preset: compressPreset(1000),
    specs: compressSpecs(1000, "About 2500 px or more on the long edge"),
    howTo: compressSteps(1000),
    faq: [
      {
        question: "Is 1 MB 1000 KB or 1024 KB here?",
        answer:
          "FitKB keeps the file at or under 1,000,000 bytes, which is under the limit whether a site counts 1 MB as 1000 KB or 1024 KB.",
      },
      {
        question: "Does it work for very large photos, like 48 MP?",
        answer:
          "Yes, though it takes a few seconds longer because the photo is encoded several times. Phones with little memory may need a smaller original.",
      },
      ...sharedFaq,
    ],
    lastReviewed: LAST_REVIEWED,
    relatedSlugs: ["compress-image-to-500kb", "compress-image-to-300kb", "compress-image-to-200kb"],
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
