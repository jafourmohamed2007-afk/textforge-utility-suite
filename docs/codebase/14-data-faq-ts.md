# 14. `data/faq.ts`

Site-wide FAQ grouped by topic.

```ts
import type { FaqEntry } from "../lib/types";

/** Site-wide FAQ at /faq, grouped by topic. Answers may use [label](/path) links. */
export const faqGroups: ReadonlyArray<{ topic: string; entries: readonly FaqEntry[] }> = [
  {
    topic: "Using FitKB",
    entries: [
      {
        question: "Is FitKB free?",
        answer: "Yes. Every preset and setting is free to use, with no sign-up, no watermark and no limit on the number of photos.",
      },
      {
        question: "Do I need to install an app?",
        answer:
          "No. FitKB runs in any modern browser on Android, iPhone, Windows, Mac and Linux. You can add it to your home screen from the browser menu if you use it often.",
      },
      {
        question: "How do I download the result?",
        answer:
          "Tap the Download button under the compressed preview. On Android and computers the file goes to your Downloads folder. On iPhone, Safari puts it in the Downloads folder of the Files app; to save it to Photos instead, tap Share and choose Save Image.",
      },
      {
        question: "Can I set any KB limit, not just the presets?",
        answer: "Yes. Type any limit from 1 KB to 20,000 KB into the Size limit box on the [home page](/) or on any preset page.",
      },
      {
        question: "Can I compress several photos at once?",
        answer:
          "FitKB handles one photo at a time so you can check each result before downloading. Your settings stay in place when you choose the next photo.",
      },
    ],
  },
  {
    topic: "Sizes and formats",
    entries: [
      {
        question: "Why is the result a little under my limit instead of exactly on it?",
        answer:
          "Forms reject files that are even one byte over the limit, and some count 1 KB as 1024 bytes while others use 1000. FitKB stays at or under the limit × 1000 bytes, which passes both. See [KB vs KiB](/guides/kb-vs-kib-file-size-explained).",
      },
      {
        question: "What happens to the photo's quality?",
        answer:
          "FitKB searches for the highest JPEG quality that fits under your limit. It only reduces the pixel dimensions when quality alone cannot get there. The Quality and Dimensions values under the preview show exactly what was used.",
      },
      {
        question: "Which file format do I get?",
        answer:
          "JPG by default, because almost every form accepts it. WebP is available in the Format setting for forms that accept it. See [JPG vs PNG vs WebP](/guides/jpg-vs-png-vs-webp-for-uploads).",
      },
      {
        question: "Can I upload iPhone HEIC photos?",
        answer:
          "In Safari on iPhone and Mac, yes. Other browsers often cannot read HEIC; convert to JPG first, as explained in [how to upload HEIC photos](/guides/heic-iphone-photos-to-jpg-for-forms).",
      },
      {
        question: "Does changing DPI make my file smaller?",
        answer: "No. DPI only tells a printer how large to print the photo. File size depends on pixels and compression. See [DPI vs pixels](/guides/dpi-vs-pixels-explained).",
      },
    ],
  },
  {
    topic: "Passport photos and signatures",
    entries: [
      {
        question: "Will my passport photo be accepted?",
        answer:
          "FitKB produces the correct shape, pixel size and file size, but acceptance also depends on head size, background, lighting and expression, which only the issuing authority judges. Always follow its official guidance.",
      },
      {
        question: "Which passport photo sizes are available?",
        answer:
          "There are presets for [35 × 45 mm](/passport-size-photo-35x45mm) and [2 × 2 inch](/us-passport-photo-2x2). For other sizes, choose Exact width × height, crop to fill on the home page and enter the pixels. The [passport size guide](/guides/passport-photo-size-in-pixels) shows how to convert mm to pixels.",
      },
      {
        question: "How do I make my signature image look clean?",
        answer:
          "Sign with a dark pen on white paper and photograph it from above in bright, even light. The [signature preset](/signature-resize-20kb) fits the whole signature into a white box without cropping. More tips in the [signature guide](/guides/how-to-resize-signature-for-online-forms).",
      },
    ],
  },
  {
    topic: "Privacy and safety",
    entries: [
      {
        question: "Are my photos uploaded anywhere?",
        answer:
          "No. Photos are processed by your own browser and never sent to a server. You can even disconnect from the internet after the page loads and it still works.",
      },
      {
        question: "Is location data removed?",
        answer:
          "Yes. The new file is created from pixels only, so GPS location, camera details and other EXIF data from the original are not copied.",
      },
      {
        question: "Is FitKB an official government service?",
        answer:
          "No. FitKB is an independent tool and is not affiliated with any government, passport office or exam board. See the [disclaimer](/disclaimer).",
      },
    ],
  },
];

export function allFaqEntries(): FaqEntry[] {
  return faqGroups.flatMap((group) => group.entries);
}
```
