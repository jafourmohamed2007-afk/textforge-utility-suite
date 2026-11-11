import type { GuideDefinition } from "../lib/types";

/**
 * Long-form explainers published at /guides/[slug].
 *
 * Every guide answers one real question people search for when an upload form
 * rejects their photo. Text is original, written for this site, and kept
 * factual: where rules differ between countries or forms, the guide says so
 * and points to the official source instead of guessing.
 */

const PUBLISHED = "2026-11-11";

export const guides = [
  {
    slug: "how-to-compress-image-to-exact-kb",
    title: "How to Compress a Photo to an Exact KB Size",
    description:
      "A step-by-step guide to getting any photo under a KB limit such as 20 KB, 50 KB or 100 KB, on a phone or computer, without making it blurrier than it needs to be.",
    summary:
      "Open the photo in a resizer that targets a file size, set the limit your form states, and let it lower the JPEG quality first and the dimensions only if needed. Check the exact byte count before uploading, because forms reject files that are even one byte too large.",
    topic: "Basics",
    published: PUBLISHED,
    updated: PUBLISHED,
    sections: [
      {
        heading: "Why file size and photo size are different things",
        blocks: [
          {
            type: "p",
            text: "A photo has two sizes. Its dimensions are the number of pixels across and down, for example 3000 × 4000. Its file size is how many bytes the saved file takes up, for example 4.2 MB. Upload forms usually limit the file size, and sometimes the dimensions as well.",
          },
          {
            type: "p",
            text: "The two are linked but not fixed. The same 3000 × 4000 photo can be saved as a 6 MB file or a 400 KB file depending on how strongly it is compressed. That is why you can usually meet a KB limit without shrinking the photo as much as you might expect.",
          },
        ],
      },
      {
        heading: "The two levers: quality and dimensions",
        blocks: [
          {
            type: "p",
            text: "JPEG compression throws away detail the eye is least likely to notice. A quality setting controls how much is thrown away. Between quality 95 and quality 75 most photos lose half or more of their file size with very little visible change. Below about quality 50, blocky patterns start to appear around edges and in skies.",
          },
          {
            type: "p",
            text: "Reducing the dimensions removes pixels altogether. Halving the width and height leaves a quarter of the pixels, which usually cuts the file to roughly a quarter as well. It is the stronger lever, but it also removes real detail, so it should be the second step, not the first.",
          },
          {
            type: "note",
            text: "A good resizer tries quality first and only reduces dimensions when quality alone cannot reach the limit. That keeps the most detail for a given size.",
          },
        ],
      },
      {
        heading: "Step by step with FitKB",
        blocks: [
          {
            type: "ol",
            items: [
              "Open the [resizer on the home page](/), or a preset such as [compress to 20 KB](/compress-image-to-20kb) or [compress to 50 KB](/compress-image-to-50kb).",
              "Tap the upload area and choose your photo from the gallery, or take a new one with the camera.",
              "Type the limit from your form into the Size limit box, or tap one of the quick buttons.",
              "Wait a second or two while FitKB encodes the photo several times and keeps the sharpest version under the limit.",
              "Check the New size and Exact values under the preview, zoom in on faces or text, then tap Download.",
            ],
          },
          {
            type: "p",
            text: "Because everything runs in the browser, the photo is never uploaded to a server. That matters for ID photos, signatures and documents.",
          },
        ],
      },
      {
        heading: "What size to expect for common limits",
        blocks: [
          {
            type: "p",
            text: "These are typical results for an ordinary phone photo with the dimensions left free. A plain background compresses much better than a busy scene, so passport-style photos come out sharper than these ranges suggest.",
          },
          {
            type: "table",
            caption: "Typical long-edge size of a phone photo after compression",
            head: ["Limit", "Typical long edge", "Good for"],
            rows: [
              ["10 KB", "200 to 350 px", "Thumbnails, strict exam portals"],
              ["20 KB", "300 to 500 px", "Application photos, signatures"],
              ["50 KB", "500 to 800 px", "ID and profile photos"],
              ["100 KB", "800 to 1200 px", "Forms that show the photo large"],
              ["200 KB", "1200 to 1800 px", "Job portals, email, listings"],
              ["1 MB", "2500 px or more", "Documents and general sharing"],
            ],
          },
        ],
      },
      {
        heading: "Common mistakes",
        blocks: [
          {
            type: "ul",
            items: [
              "Screenshotting the photo to make it smaller. Screenshots are usually PNG files, which are larger for photos, and they include phone status bars.",
              "Uploading a result that is exactly on the limit. Some forms count 1 KB as 1024 bytes and some as 1000. Staying at or under the limit × 1000 bytes passes both. See [KB vs KiB](/guides/kb-vs-kib-file-size-explained).",
              "Shrinking the dimensions far more than necessary. Try the size limit alone first; only set fixed dimensions if the form asks for them.",
              "Converting to PNG because it sounds higher quality. For photos, PNG files are many times larger than JPEG. See [JPG vs PNG vs WebP](/guides/jpg-vs-png-vs-webp-for-uploads).",
            ],
          },
        ],
      },
    ],
    relatedTools: ["compress-image-to-20kb", "compress-image-to-50kb", "compress-image-to-100kb"],
    faq: [
      {
        question: "Can I compress a photo to an exact number of KB, like exactly 20 KB?",
        answer:
          "JPEG sizes move in small jumps, so landing on an exact byte count is not practical. What forms check is that the file is not over the limit. Aim for the highest quality at or just under the limit, which is what FitKB does.",
      },
      {
        question: "Does compressing a photo reduce its dimensions?",
        answer:
          "Not necessarily. Lowering JPEG quality reduces the file size while keeping every pixel. Dimensions only need to shrink when the limit is very small compared with the photo.",
      },
    ],
  },
  {
    slug: "kb-vs-kib-file-size-explained",
    title: 'KB vs KiB: Why a "20 KB" Photo Can Still Be Rejected',
    description:
      "Kilobytes can mean 1000 or 1024 bytes depending on who is counting. Here is how the difference causes upload errors, and how to pick a file size that passes every check.",
    summary:
      "1 KB is 1000 bytes in the international (SI) standard, while 1 KiB is 1024 bytes. Many systems, including Windows, show KB but count in 1024s. A file that is 20.3 KB by one count is 19.8 KB by the other, so stay at or under the limit × 1000 bytes to be safe.",
    topic: "Basics",
    published: PUBLISHED,
    updated: PUBLISHED,
    sections: [
      {
        heading: "Two meanings of one unit",
        blocks: [
          {
            type: "p",
            text: "The kilo in kilobyte means 1000, just like in kilometre. Because computers work in powers of two, the industry also used kilobyte to mean 1024 bytes for decades. In 1998 the International Electrotechnical Commission introduced the kibibyte (KiB) for 1024 bytes so the two could be told apart, but many programs still write KB for both.",
          },
          {
            type: "table",
            caption: "Decimal and binary units compared",
            head: ["Unit", "Bytes", "Used by"],
            rows: [
              ["1 KB (kilobyte)", "1,000", "SI standard, macOS Finder, most storage makers"],
              ["1 KiB (kibibyte)", "1,024", "Windows File Explorer (labelled KB), many servers"],
              ["1 MB (megabyte)", "1,000,000", "SI standard, macOS"],
              ["1 MiB (mebibyte)", "1,048,576", "Windows (labelled MB), many upload checks"],
            ],
          },
        ],
      },
      {
        heading: "How the difference causes rejections",
        blocks: [
          {
            type: "p",
            text: "Imagine a form with a 20 KB limit, and a photo that is 20,300 bytes. Divided by 1024, that is 19.8 KB, so Windows shows it as under the limit. If the form's server checks against 20 × 1000 = 20,000 bytes, the same file is 300 bytes too large and is rejected.",
          },
          {
            type: "p",
            text: "The opposite also happens: a file shown as 20.4 KB on a Mac is accepted by a form that counts 20 × 1024 = 20,480 bytes. People see inconsistent results and assume the form is broken, when the two sides simply count differently.",
          },
        ],
      },
      {
        heading: "The safe rule",
        blocks: [
          {
            type: "note",
            text: "Keep the file at or under the limit multiplied by 1000 bytes. A file of 20,000 bytes or less passes a 20 KB limit whichever way the form counts.",
          },
          {
            type: "p",
            text: "FitKB applies every limit this way and shows the exact byte count next to the rounded size, so you can see that a result passes before you upload it. Try it with the [20 KB preset](/compress-image-to-20kb).",
          },
        ],
      },
      {
        heading: "How to check a file's exact size",
        blocks: [
          {
            type: "ul",
            items: [
              "Windows: right-click the file, choose Properties, and read the number of bytes in brackets next to Size.",
              "macOS: select the file and press Command + I. Finder shows the size in decimal KB and the exact byte count.",
              "Android: most file manager apps show details or properties with the exact size; some round it.",
              "iPhone: in the Files app, long-press the file and choose Get Info.",
            ],
          },
        ],
      },
      {
        heading: "Quick conversion table",
        blocks: [
          {
            type: "p",
            text: "The table shows how many bytes each common limit allows under both counting methods. The middle column is the safe target, because it passes either way.",
          },
          {
            type: "table",
            caption: "Common upload limits in bytes",
            head: ["Limit", "Safe target (× 1000)", "Binary reading (× 1024)"],
            rows: [
              ["10 KB", "10,000 bytes", "10,240 bytes"],
              ["20 KB", "20,000 bytes", "20,480 bytes"],
              ["50 KB", "50,000 bytes", "51,200 bytes"],
              ["100 KB", "100,000 bytes", "102,400 bytes"],
              ["200 KB", "200,000 bytes", "204,800 bytes"],
              ["1 MB", "1,000,000 bytes", "1,048,576 bytes"],
            ],
          },
        ],
      },
      {
        heading: "Why the gap matters more for small limits",
        blocks: [
          {
            type: "p",
            text: "The difference between the two methods is 2.4 percent. On a 10 MB limit that is a quarter of a megabyte, which rarely matters because files are seldom that close to the edge. On a 20 KB limit it is only 480 bytes, and compressed photos very often land within a few hundred bytes of the target. That is why KB confusion causes far more rejections on strict exam and application portals than on general file-sharing sites.",
          },
          {
            type: "p",
            text: "If a form gives its limit in bytes, for example 20480 bytes, use that number directly: divide it by 1000 and enter the result as the KB limit in FitKB, here 20.48. The tool accepts decimals.",
          },
        ],
      },
    ],
    relatedTools: ["compress-image-to-20kb", "compress-image-to-10kb", "compress-image-to-50kb"],
    faq: [
      {
        question: "Is 1 MB 1000 KB or 1024 KB?",
        answer:
          "In the SI standard 1 MB is 1000 KB, or 1,000,000 bytes. Windows and many servers use 1024 KB, or 1,048,576 bytes, and still call it MB. Staying under 1,000,000 bytes satisfies both.",
      },
      {
        question: "Why does my phone show a different size from my computer?",
        answer:
          "Different apps divide by 1000 or by 1024 and round differently. The exact byte count is the only number that never changes.",
      },
    ],
  },
  {
    slug: "why-is-my-photo-rejected-online-form",
    title: "Why Online Forms Reject Your Photo: 9 Causes and Fixes",
    description:
      "File too large, wrong format, wrong dimensions or a HEIC photo from an iPhone: the most common reasons an upload form refuses a photo, and how to fix each one.",
    summary:
      "Most rejections come from the file being over the size limit, being in a format the form does not accept (often HEIC or PNG), or having the wrong pixel dimensions. Read the error message, compare it with the form's instructions, and fix that one property instead of re-taking the photo.",
    topic: "Troubleshooting",
    published: PUBLISHED,
    updated: PUBLISHED,
    sections: [
      {
        heading: "1. The file is over the size limit",
        blocks: [
          {
            type: "p",
            text: "Phone cameras save photos of 2 to 10 MB, while forms often allow 20 KB to 200 KB. Compress the photo to the stated limit with a tool such as the [50 KB preset](/compress-image-to-50kb) and check the exact byte count before uploading.",
          },
        ],
      },
      {
        heading: "2. The file is just barely over the limit",
        blocks: [
          {
            type: "p",
            text: "If your file looks like it is under the limit but is still refused, the form may count kilobytes as 1000 bytes while your device counts 1024. Keep files at or below the limit × 1000 bytes. The full explanation is in [KB vs KiB](/guides/kb-vs-kib-file-size-explained).",
          },
        ],
      },
      {
        heading: "3. The file is too small",
        blocks: [
          {
            type: "p",
            text: "Some forms also set a minimum, such as 10 KB to 50 KB. Over-compressed photos can fall below it. Raise the limit in the resizer to just under the maximum, which gives the best quality anyway.",
          },
        ],
      },
      {
        heading: "4. The format is not accepted",
        blocks: [
          {
            type: "p",
            text: "Many forms accept only JPG or JPEG. PNG, WebP and HEIC files are refused even when they are small enough. FitKB saves JPG by default. If your form accepts only .jpeg rather than .jpg, rename the file; both extensions describe the same format. More detail in [JPG vs PNG vs WebP](/guides/jpg-vs-png-vs-webp-for-uploads).",
          },
        ],
      },
      {
        heading: "5. It is an iPhone HEIC photo",
        blocks: [
          {
            type: "p",
            text: "iPhones save photos as HEIC by default. Browsers usually convert them when you pick them through the photo picker, but files transferred by cable or cloud often stay HEIC. See [how to upload iPhone HEIC photos](/guides/heic-iphone-photos-to-jpg-for-forms).",
          },
        ],
      },
      {
        heading: "6. The pixel dimensions are wrong",
        blocks: [
          {
            type: "p",
            text: "Forms sometimes require exact dimensions, such as 600 × 600 pixels, or a range. Use the Dimensions setting to crop to an exact size, or the [35 × 45 mm](/passport-size-photo-35x45mm) and [2 × 2 inch](/us-passport-photo-2x2) presets for passport shapes.",
          },
        ],
      },
      {
        heading: "7. The photo appears sideways",
        blocks: [
          {
            type: "p",
            text: "Phones store rotation as a tag instead of rotating the pixels. Some forms ignore the tag and show the photo sideways. Re-saving the photo through FitKB applies the rotation to the pixels, so the result is upright everywhere.",
          },
        ],
      },
      {
        heading: "8. The content does not meet the rules",
        blocks: [
          {
            type: "p",
            text: "Passport and visa photos are checked for background colour, head size, lighting, glasses and expression. No resizer can fix those; follow the official guidance and retake the photo. Our [passport photo size guide](/guides/passport-photo-size-in-pixels) explains the sizing part.",
          },
        ],
      },
      {
        heading: "9. The browser or connection failed",
        blocks: [
          {
            type: "ul",
            items: [
              "Try again on a stable connection; uploads can time out on weak mobile data.",
              "Use an up-to-date browser such as Chrome, Safari, Firefox or Edge.",
              "If the form runs inside an app, try the same page in the phone's main browser.",
              "Clear the form's page and pick the file again rather than reusing a cached selection.",
            ],
          },
        ],
      },
      {
        heading: "A quick checklist before uploading",
        blocks: [
          {
            type: "ol",
            items: [
              "The file is JPG unless the form lists other formats.",
              "The exact byte count is at or under the limit × 1000, and above any minimum.",
              "The pixel dimensions match what the form asks for, if it gives any.",
              "The photo is upright and shows what the form asks for: face, signature or document.",
              "You are uploading the new file, not the original with a similar name. FitKB adds the limit to the file name, such as photo-20kb.jpg, to make this easy.",
            ],
          },
        ],
      },
    ],
    relatedTools: ["compress-image-to-50kb", "compress-image-to-20kb", "passport-size-photo-35x45mm"],
    faq: [
      {
        question: "The form says 'invalid file'. What does that usually mean?",
        answer:
          "Most often the format is not accepted, for example a HEIC or PNG file on a JPG-only form. Convert the photo to JPG and check the size limit.",
      },
      {
        question: "Will compressing the photo again make it worse?",
        answer: "Each JPEG save loses a little detail. Always start from the original photo rather than from an already compressed copy.",
      },
    ],
  },
  {
    slug: "passport-photo-size-in-pixels",
    title: "Passport Photo Size in Pixels: mm, Inches and DPI Explained",
    description:
      "How to turn a passport photo size in millimetres or inches into pixels, with worked examples for 35 × 45 mm, 2 × 2 inch and 50 × 70 mm photos.",
    summary:
      "Multiply each side in inches by the DPI, or each side in millimetres by the DPI and divide by 25.4. At 300 DPI, 35 × 45 mm is 413 × 531 pixels and 2 × 2 inches is 600 × 600 pixels. The issuing authority's rules always take priority over general guides.",
    topic: "Photo ID",
    published: PUBLISHED,
    updated: PUBLISHED,
    sections: [
      {
        heading: "The conversion formula",
        blocks: [
          {
            type: "p",
            text: "DPI, dots per inch, says how many pixels are printed in each inch of paper. An inch is exactly 25.4 mm. To find the pixels needed for a printed size:",
          },
          {
            type: "ul",
            items: ["From inches: pixels = inches × DPI.", "From millimetres: pixels = millimetres ÷ 25.4 × DPI."],
          },
          {
            type: "p",
            text: "300 DPI is the usual standard for photo prints. For example, 35 mm ÷ 25.4 × 300 = 413.4, so a 35 mm wide photo needs about 413 pixels across.",
          },
        ],
      },
      {
        heading: "Common photo sizes at 300 DPI",
        blocks: [
          {
            type: "table",
            caption: "Common passport and visa photo sizes converted to pixels at 300 DPI",
            head: ["Print size", "Pixels at 300 DPI", "Examples of use"],
            rows: [
              ["35 × 45 mm", "413 × 531 px", "UK passports, Schengen visas, many other countries"],
              ["2 × 2 in (51 × 51 mm)", "600 × 600 px", "US passports and visas"],
              ["50 × 70 mm", "591 × 827 px", "Canadian passports"],
              ["33 × 48 mm", "390 × 567 px", "Some Chinese visa applications"],
            ],
          },
          {
            type: "note",
            text: "Requirements change and differ between print and online applications. Always confirm the size, file format and file size on the official website of the authority you are applying to.",
          },
        ],
      },
      {
        heading: "Digital uploads are different from prints",
        blocks: [
          {
            type: "p",
            text: "Online applications usually state a size in pixels and a file size in KB, not millimetres. A printed size only matters when you print the photo. If a form asks for at least 600 × 600 pixels and at most 240 KB, those two numbers are all you need to meet.",
          },
          {
            type: "p",
            text: "The DPI value stored inside a file does not change how the photo looks on screen or its file size. Pixels are what count. See [DPI vs pixels](/guides/dpi-vs-pixels-explained) for more.",
          },
        ],
      },
      {
        heading: "Making the photo",
        blocks: [
          {
            type: "ol",
            items: [
              "Stand in front of a plain, light wall in even daylight, without shadows on your face or behind you.",
              "Ask someone to take the photo from about 1.5 m away at eye level, with your head and shoulders in the frame.",
              "Open the [35 × 45 mm preset](/passport-size-photo-35x45mm) or the [2 × 2 inch preset](/us-passport-photo-2x2).",
              "Move the Vertical framing slider so your head is centred with space above it.",
              "Set the KB limit from the form and download the result.",
            ],
          },
        ],
      },
      {
        heading: "Printing the photo yourself",
        blocks: [
          {
            type: "p",
            text: "If you need a printed photo, most photo printing services accept a JPG and print it at a standard size such as 4 × 6 inches (10 × 15 cm). Place several copies of your passport photo on a 4 × 6 inch canvas at 300 DPI, which is 1200 × 1800 pixels, so each one prints at the right physical size. Check that the print service does not crop or scale the image to fit the paper.",
          },
          {
            type: "p",
            text: "Print on glossy or matte photo paper, not on plain office paper, and cut along the edges carefully. Many authorities reject photos that are damaged, creased or printed on ordinary paper.",
          },
        ],
      },
      {
        heading: "Checklist before you submit",
        blocks: [
          {
            type: "ul",
            items: [
              "The pixel size or print size matches the official requirement exactly.",
              "The file size and format match the online form, for example JPG under 240 KB.",
              "Your face is in focus, with even lighting and no shadows on the face or background.",
              "The background is plain and the colour the authority asks for.",
              "Your head is straight, centred and the size the rules require.",
              "The photo is recent, usually taken within the last six months.",
            ],
          },
          {
            type: "note",
            text: "FitKB handles the first two points. The rest depend on how the photo was taken, so retake it if any of them are not met.",
          },
        ],
      },
    ],
    relatedTools: ["passport-size-photo-35x45mm", "us-passport-photo-2x2", "compress-image-to-50kb"],
    faq: [
      {
        question: "Why does 35 × 45 mm sometimes appear as 413 × 531 and sometimes as 413 × 532?",
        answer:
          "45 mm at 300 DPI is 531.5 pixels, so tools round it either way. Both are within a fraction of a millimetre and print the same.",
      },
      {
        question: "Can FitKB check that my photo meets passport rules?",
        answer:
          "No. FitKB sets the shape, pixel size and file size. It does not check head size, background or expression, which are judged by the issuing authority.",
      },
    ],
  },
  {
    slug: "how-to-resize-signature-for-online-forms",
    title: "How to Scan and Resize Your Signature for Online Forms",
    description:
      "Capture a clean signature with your phone camera, then resize it to the box and KB limit an application form asks for, such as 400 × 160 pixels under 20 KB.",
    summary:
      "Sign with a dark pen on plain white paper, photograph it from directly above in bright, even light, then fit it into the required box with white padding and compress it under the limit. A clean white background is what keeps a signature both sharp and small.",
    topic: "Signature",
    published: PUBLISHED,
    updated: PUBLISHED,
    sections: [
      {
        heading: "What forms usually ask for",
        blocks: [
          {
            type: "p",
            text: "Application portals usually want a signature image that is wider than it is tall, in JPG format, within a small file size such as 10 KB to 30 KB. Some give exact pixel dimensions and some give a range. Read the instructions on the form first; they are the only rules that matter.",
          },
        ],
      },
      {
        heading: "Capturing a clean signature",
        blocks: [
          {
            type: "ol",
            items: [
              "Sign on plain white paper with a black or dark blue pen. Gel and felt-tip pens give bolder lines than ballpoints.",
              "Place the paper on a flat surface near a window or under bright light. Avoid shadows from your phone or hand.",
              "Hold the phone directly above the signature so the paper is not tilted, and fill most of the frame.",
              "Take two or three photos and keep the sharpest one.",
            ],
          },
          {
            type: "note",
            text: "Grey paper and shadows cost bytes. A truly white background compresses to almost nothing, leaving the file size for the strokes themselves.",
          },
        ],
      },
      {
        heading: "Resizing without cutting it off",
        blocks: [
          {
            type: "p",
            text: "Signatures must never be cropped. The [signature preset](/signature-resize-20kb) uses a fit-and-pad method: it scales the whole signature to fit inside a 400 × 160 pixel box and fills the remaining space with white. Enter different dimensions if your form gives them.",
          },
          {
            type: "p",
            text: "If there is a lot of white space around the strokes, crop the photo closer to the signature in your phone's gallery app before uploading it. The strokes then fill more of the box and look bolder.",
          },
        ],
      },
      {
        heading: "Checking the result",
        blocks: [
          {
            type: "ul",
            items: [
              "Zoom into the preview and check that thin strokes are still continuous.",
              "Confirm the exact byte count is under the form's limit.",
              "Check the file ends in .jpg if the form accepts only JPG.",
              "Keep the original photo so you can create another version if a different form needs other dimensions.",
            ],
          },
        ],
      },
      {
        heading: "Common problems and fixes",
        blocks: [
          {
            type: "table",
            caption: "Signature image problems and how to fix them",
            head: ["Problem", "Likely cause", "Fix"],
            rows: [
              ["Grey or yellow background", "Dim or warm indoor light", "Retake near a window in daylight"],
              ["Faint, broken strokes", "Thin ballpoint pen, heavy compression", "Use a gel or felt-tip pen; raise the KB limit slightly"],
              ["Signature looks tiny", "Too much paper around it", "Crop closer before uploading"],
              ["Slanted or stretched", "Phone held at an angle", "Hold the phone flat, directly above the paper"],
              ["Rejected as wrong size", "Dimensions differ from the form's rules", "Enter the exact width and height the form gives"],
            ],
          },
        ],
      },
      {
        heading: "Keep your signature safe",
        blocks: [
          {
            type: "p",
            text: "A signature image can be misused, so treat it like an ID document. Do not post it publicly or send it to people you do not know. Because FitKB runs entirely in your browser, the signature is never uploaded while you resize it. Delete spare copies from shared devices once your application is submitted.",
          },
        ],
      },
    ],
    relatedTools: ["signature-resize-20kb", "compress-image-to-10kb", "compress-image-to-20kb"],
    faq: [
      {
        question: "Should a signature be saved as PNG for sharper lines?",
        answer:
          "Only if the form accepts PNG. Most application portals ask for JPG, and a clean signature on white paper is perfectly sharp as a JPG at 10 to 20 KB.",
      },
      {
        question: "Can I make the background transparent?",
        answer:
          "JPG has no transparency, and forms that request JPG expect a white background. FitKB always fills the background with white.",
      },
    ],
  },
  {
    slug: "jpg-vs-png-vs-webp-for-uploads",
    title: "JPG vs PNG vs WebP: Which Format to Use for Uploads",
    description:
      "What the difference between JPG, PNG and WebP actually is, which one gives the smallest file for photos, and which one forms are most likely to accept.",
    summary:
      "Use JPG for photos you upload to forms: it is accepted almost everywhere and gives small files. PNG is lossless and best for screenshots and graphics, but photos saved as PNG are several times larger. WebP is smaller than JPG at the same quality, but many forms still refuse it.",
    topic: "Formats",
    published: PUBLISHED,
    updated: PUBLISHED,
    sections: [
      {
        heading: "The short comparison",
        blocks: [
          {
            type: "table",
            caption: "JPG, PNG and WebP compared for uploading photos",
            head: ["Format", "Compression", "Transparency", "Best for", "Accepted by forms"],
            rows: [
              ["JPG / JPEG", "Lossy", "No", "Photos", "Almost always"],
              ["PNG", "Lossless", "Yes", "Screenshots, logos, text", "Often"],
              ["WebP", "Lossy or lossless", "Yes", "Photos and graphics on the web", "Sometimes"],
              ["HEIC", "Lossy", "Yes", "Storage on Apple devices", "Rarely"],
            ],
          },
        ],
      },
      {
        heading: "JPG: the safe default for photos",
        blocks: [
          {
            type: "p",
            text: "JPG (also written JPEG; the two extensions are the same format) has been the standard for photos since the 1990s. It discards fine detail that is hard to see, controlled by a quality setting. Every browser, phone and upload form understands it, which is why FitKB saves JPG by default.",
          },
        ],
      },
      {
        heading: "PNG: perfect copies, large files",
        blocks: [
          {
            type: "p",
            text: "PNG keeps every pixel exactly, which is ideal for screenshots, diagrams and text. Photos have so much fine variation that lossless compression barely helps, so a photo saved as PNG is often three to ten times larger than a good JPG. Converting a PNG photo to JPG is usually the quickest way to meet a size limit.",
          },
        ],
      },
      {
        heading: "WebP: smaller, but check the form",
        blocks: [
          {
            type: "p",
            text: "WebP was developed by Google for the web. At similar visual quality it is typically smaller than JPG, and all major browsers can display it. Many government and exam portals still accept only JPG, so choose WebP only when the form explicitly lists it. FitKB offers WebP in the Format setting.",
          },
        ],
      },
      {
        heading: "Which should you choose?",
        blocks: [
          {
            type: "ul",
            items: [
              "A form that says JPG or JPEG: JPG.",
              "A form that lists several formats and has a tight KB limit: WebP if listed, otherwise JPG.",
              "A screenshot of text or a document: PNG if accepted, otherwise JPG at a high quality.",
              "An iPhone HEIC photo: convert to JPG first, as explained in [how to upload HEIC photos](/guides/heic-iphone-photos-to-jpg-for-forms).",
            ],
          },
        ],
      },
      {
        heading: "How JPEG compression works, briefly",
        blocks: [
          {
            type: "p",
            text: "JPEG splits the image into small blocks of 8 × 8 pixels and describes each block as a mix of smooth patterns. Fine detail that the eye barely notices is stored less precisely or dropped. The quality setting decides how much is dropped. Colour detail is usually stored at lower resolution than brightness, because our eyes are less sensitive to it.",
          },
          {
            type: "p",
            text: "That is why JPEG is excellent for photos, where small losses are invisible, and weaker for sharp text and line art, where the losses show up as faint smudges around edges.",
          },
        ],
      },
      {
        heading: "What quality numbers mean",
        blocks: [
          {
            type: "table",
            caption: "Approximate effect of JPEG quality on a typical photo",
            head: ["Quality", "Typical look", "Typical use"],
            rows: [
              ["90 to 95", "Indistinguishable from the original", "Archiving, printing"],
              ["75 to 90", "Very good; differences only when zoomed in", "Websites, email, most uploads"],
              ["50 to 75", "Good; slight softness in fine textures", "Strict upload limits"],
              ["Below 50", "Visible blocks and smudging", "Only when the limit leaves no choice"],
            ],
          },
          {
            type: "p",
            text: "Quality numbers are not standardised between programs, so quality 80 in one app is not exactly the same as quality 80 in another. FitKB shows the quality it chose under the preview.",
          },
        ],
      },
    ],
    relatedTools: ["compress-image-to-100kb", "compress-image-to-200kb", "compress-image-to-50kb"],
    faq: [
      {
        question: "Is JPEG different from JPG?",
        answer:
          "No. They are the same format. The three-letter .jpg extension dates from older Windows systems that limited extensions to three characters.",
      },
      {
        question: "Does converting PNG to JPG lose quality?",
        answer:
          "A little, because JPG is lossy, but at the quality levels used for uploads the difference is rarely visible in photos. Transparent areas become white.",
      },
    ],
  },
  {
    slug: "dpi-vs-pixels-explained",
    title: "DPI vs Pixels: What Actually Changes a Photo's File Size",
    description:
      "Why changing a photo's DPI does not make it smaller, what pixels and DPI really mean, and what to do when a form asks for a photo at 200 or 300 DPI.",
    summary:
      "File size depends on the number of pixels and how they are compressed, not on DPI. DPI is only a note inside the file saying how large to print it. To make a file smaller, reduce quality or pixel dimensions; to meet a DPI requirement, make sure the pixel size matches the print size at that DPI.",
    topic: "Basics",
    published: PUBLISHED,
    updated: PUBLISHED,
    sections: [
      {
        heading: "Pixels are the photo",
        blocks: [
          {
            type: "p",
            text: "A digital photo is a grid of coloured squares called pixels. A 12-megapixel phone photo is about 4000 × 3000 pixels. On screen, the number of pixels decides how much detail there is; nothing else does.",
          },
        ],
      },
      {
        heading: "DPI is a printing instruction",
        blocks: [
          {
            type: "p",
            text: "DPI (dots per inch, also called PPI for pixels per inch) is a number stored in the file that tells a printer how many pixels to place in each inch of paper. A 600 × 600 pixel photo prints at 2 × 2 inches at 300 DPI, or at 6 × 6 inches at 100 DPI. The file and its pixels are identical in both cases.",
          },
          {
            type: "note",
            text: "Changing the DPI value alone never changes the file size or how the photo looks on screen.",
          },
        ],
      },
      {
        heading: "When a form asks for a specific DPI",
        blocks: [
          {
            type: "p",
            text: "When a form says something like 3.5 × 4.5 cm at 300 DPI, what it really needs is enough pixels: 413 × 531. Create the photo at those pixel dimensions with the [35 × 45 mm preset](/passport-size-photo-35x45mm). The conversion is explained in the [passport photo size guide](/guides/passport-photo-size-in-pixels).",
          },
          {
            type: "p",
            text: "A small number of systems read the stored DPI value itself. If a form rejects a correctly sized photo for its DPI, open it in a desktop image editor, set the resolution to the required value without resampling, and save it again.",
          },
        ],
      },
      {
        heading: "What actually changes file size",
        blocks: [
          {
            type: "ul",
            items: [
              "Pixel count: fewer pixels means a smaller file.",
              "Compression quality: lower JPEG quality means a smaller file.",
              "Content: plain backgrounds compress better than detailed scenes or noisy low-light photos.",
              "Format: JPG and WebP are far smaller than PNG for photos.",
            ],
          },
        ],
      },
      {
        heading: "Pixels needed for common print sizes",
        blocks: [
          {
            type: "p",
            text: "Use this table when a form or printer asks for a print size at 300 DPI. At lower DPI values the pixel counts shrink proportionally; at 150 DPI, halve them.",
          },
          {
            type: "table",
            caption: "Pixels needed at 300 DPI for common print sizes",
            head: ["Print size", "Pixels at 300 DPI"],
            rows: [
              ["35 × 45 mm passport photo", "413 × 531"],
              ["2 × 2 in passport photo", "600 × 600"],
              ["3.5 × 5 in (9 × 13 cm)", "1050 × 1500"],
              ["4 × 6 in (10 × 15 cm)", "1200 × 1800"],
              ["5 × 7 in (13 × 18 cm)", "1500 × 2100"],
              ["A4 page (210 × 297 mm)", "2480 × 3508"],
            ],
          },
        ],
      },
      {
        heading: "Why screens ignore DPI",
        blocks: [
          {
            type: "p",
            text: "A screen shows an image using its own pixels, not inches. A phone with a sharp display may pack 400 or more pixels into an inch, while an older monitor may have about 100. The same 600 × 600 photo therefore looks small on one and large on another, regardless of the DPI value stored in the file. Only printing turns pixels into physical inches, which is the one moment DPI matters.",
          },
        ],
      },
    ],
    relatedTools: ["passport-size-photo-35x45mm", "us-passport-photo-2x2", "compress-image-to-100kb"],
    faq: [
      {
        question: "Is 72 DPI lower quality than 300 DPI?",
        answer: "Not on screen. Two files with the same pixels look identical whatever DPI they store. DPI only changes the printed size.",
      },
      {
        question: "How many pixels do I need to print a photo at 300 DPI?",
        answer: "Multiply the print size in inches by 300. A 4 × 6 inch print needs 1200 × 1800 pixels.",
      },
    ],
  },
  {
    slug: "heic-iphone-photos-to-jpg-for-forms",
    title: "How to Upload iPhone HEIC Photos to Forms That Want JPG",
    description:
      "Why iPhone photos are saved as HEIC, why upload forms reject them, and four ways to get a JPG instead, including a setting that makes the camera save JPG.",
    summary:
      "iPhones save photos as HEIC by default to save space, and many forms accept only JPG. Picking the photo through the photo picker in Safari usually converts it automatically. Otherwise, switch the camera to Most Compatible, or export a JPG copy, then compress it to the form's limit.",
    topic: "Formats",
    published: PUBLISHED,
    updated: PUBLISHED,
    sections: [
      {
        heading: "What HEIC is",
        blocks: [
          {
            type: "p",
            text: "HEIC (High Efficiency Image Container) is a modern photo format that Apple has used by default since iOS 11. It stores photos at about half the size of JPG at similar quality. The downside is compatibility: many websites, older computers and upload forms cannot read it.",
          },
        ],
      },
      {
        heading: "Option 1: Pick the photo through the photo picker",
        blocks: [
          {
            type: "p",
            text: "When you tap an upload button in Safari and choose Photo Library, iOS usually hands the website a JPG copy. This is the simplest route and works with FitKB: tap the upload area, choose the photo, and the result is saved as JPG.",
          },
        ],
      },
      {
        heading: "Option 2: Make the camera save JPG",
        blocks: [
          {
            type: "ol",
            items: ["Open Settings on the iPhone.", "Tap Camera, then Formats.", "Choose Most Compatible."],
          },
          {
            type: "p",
            text: "New photos are then saved as JPG. Photos you have already taken stay HEIC, and JPG photos take more storage.",
          },
        ],
      },
      {
        heading: "Option 3: Transfer photos as JPG",
        blocks: [
          {
            type: "p",
            text: "If you copy photos to a computer with a cable, open Settings, tap Photos, and under Transfer to Mac or PC choose Automatic. The iPhone then converts photos to a compatible format during the transfer.",
          },
        ],
      },
      {
        heading: "Option 4: Convert on a Mac or PC",
        blocks: [
          {
            type: "ul",
            items: [
              "Mac: open the photo in Preview, choose File, then Export, and pick JPEG as the format.",
              "Windows: the Photos app can open HEIC once the HEIF Image Extensions are installed from the Microsoft Store; then use Save as and choose JPG.",
            ],
          },
        ],
      },
      {
        heading: "Then meet the size limit",
        blocks: [
          {
            type: "p",
            text: "A converted iPhone photo is still 2 to 5 MB. Open it in a preset such as [compress to 100 KB](/compress-image-to-100kb), or the [home page resizer](/) to type any limit.",
          },
        ],
      },
      {
        heading: "How to tell whether a photo is HEIC",
        blocks: [
          {
            type: "ul",
            items: [
              "In the iPhone Photos app, open the photo and swipe up, or tap the info button; the format is shown with the camera details.",
              "In the Files app or on a computer, look at the file extension: .heic or .heif means HEIC, .jpg or .jpeg means JPG.",
              "If a form says the file type is not supported but the photo opens fine on your iPhone, it is very likely HEIC.",
            ],
          },
        ],
      },
      {
        heading: "Why many forms still refuse HEIC",
        blocks: [
          {
            type: "p",
            text: "Upload forms check file types to make sure the systems that store and display the photos can read them. JPG has been readable everywhere for decades, while HEIC support is still uneven across browsers and server software, and some HEIC features are covered by patents. Until that changes, expect most government and exam portals to keep asking for JPG.",
          },
        ],
      },
    ],
    relatedTools: ["compress-image-to-100kb", "compress-image-to-50kb", "passport-size-photo-35x45mm"],
    faq: [
      {
        question: "Can FitKB open HEIC files directly?",
        answer:
          "It depends on the browser. Safari on iPhone and Mac can decode HEIC, so it works there. Chrome and Firefox on other systems usually cannot; convert the photo to JPG first.",
      },
      {
        question: "Does HEIC to JPG conversion lose quality?",
        answer: "Very little at normal settings. Any loss is far smaller than the compression needed to meet a typical form limit.",
      },
    ],
  },
  {
    slug: "photo-and-signature-size-for-exam-forms",
    title: "Photo and Signature Size for Exam and Job Application Forms",
    description:
      "A practical checklist for preparing the photo and signature that exam, recruitment and admission portals ask for, with the typical size ranges and how to meet them.",
    summary:
      "Read the official notification for the exact rules, then prepare two files: a recent photo with a plain light background, and a signature on white paper. Typical limits are about 20 to 50 KB for the photo and 10 to 30 KB for the signature, both in JPG, but each form sets its own.",
    topic: "Photo ID",
    published: PUBLISHED,
    updated: PUBLISHED,
    sections: [
      {
        heading: "Start with the official instructions",
        blocks: [
          {
            type: "p",
            text: "Every exam board, university and employer sets its own rules, and they change between years. Find the section of the official notification or help page that lists photo and signature requirements, and write down four things for each file: format, minimum and maximum file size, pixel dimensions, and background colour.",
          },
          {
            type: "note",
            text: "The ranges below are typical examples, not rules for any particular form. Where they differ from your form's instructions, follow the form.",
          },
        ],
      },
      {
        heading: "Typical requirements",
        blocks: [
          {
            type: "table",
            caption: "Typical photo and signature requirements on application portals",
            head: ["File", "Typical file size", "Typical shape", "Format"],
            rows: [
              ["Photograph", "20 KB to 50 KB", "Portrait, taller than wide", "JPG"],
              ["Signature", "10 KB to 30 KB", "Landscape, wider than tall", "JPG"],
              ["Thumb impression", "10 KB to 50 KB", "Square or landscape", "JPG"],
              ["Supporting document", "100 KB to 1 MB", "Any", "JPG or PDF"],
            ],
          },
        ],
      },
      {
        heading: "Preparing the photo",
        blocks: [
          {
            type: "ol",
            items: [
              "Use a recent photo with your face clearly visible, a neutral expression, and a plain white or light background.",
              "Avoid caps and dark glasses unless the instructions allow them for religious or medical reasons.",
              "Open the [20 KB](/compress-image-to-20kb) or [50 KB](/compress-image-to-50kb) preset, or type the exact limit on the [home page](/).",
              "If dimensions are given, choose Exact width × height, crop to fill, and enter them.",
              "Download, and check the file name ends in .jpg.",
            ],
          },
        ],
      },
      {
        heading: "Preparing the signature",
        blocks: [
          {
            type: "p",
            text: "Sign on white paper with a dark pen, photograph it from above in good light, and use the [signature preset](/signature-resize-20kb). Change the width, height and limit to match your form. Detailed tips are in [how to resize your signature](/guides/how-to-resize-signature-for-online-forms).",
          },
        ],
      },
      {
        heading: "Before you submit",
        blocks: [
          {
            type: "ul",
            items: [
              "Check that each file is between the minimum and the maximum size, counting exact bytes.",
              "Make sure the photo and signature are not swapped in the upload fields.",
              "Look at the preview the portal shows after upload, if it has one.",
              "Keep the originals and the final files together so you can reuse them for later stages.",
            ],
          },
        ],
      },
      {
        heading: "Mistakes that get applications flagged",
        blocks: [
          {
            type: "ul",
            items: [
              "Using an old photo that no longer looks like you, or one with a filter or beauty effect applied.",
              "Uploading a selfie with the face at an angle or partly in shadow.",
              "Signing in capital letters on one form and in cursive on another; use the same signature you will use on exam day.",
              "Uploading the photo in the signature field or the other way round.",
              "Taking a screenshot of the photo, which adds phone status bars and changes the format.",
              "Leaving it until the last day, when portals are slow and there is no time to fix a rejected upload.",
            ],
          },
          {
            type: "note",
            text: "Some exams compare your uploaded photo with your appearance on the day. Use a clear, recent, natural photo and keep a few prints of the same photo in case they are needed later.",
          },
        ],
      },
    ],
    relatedTools: ["compress-image-to-20kb", "signature-resize-20kb", "compress-image-to-50kb"],
    faq: [
      {
        question: "My form has a minimum size, for example 20 KB to 50 KB. How do I stay above it?",
        answer:
          "Set the limit to the maximum, here 50 KB. FitKB picks the highest quality that fits, so the file normally lands just under the maximum and well above the minimum.",
      },
      {
        question: "Can I use the same photo for several applications?",
        answer:
          "Yes, as long as it is recent enough for each form. Keep the original and create a separate copy for each set of size rules.",
      },
    ],
  },
] as const satisfies readonly GuideDefinition[];

const guidesBySlug: ReadonlyMap<string, GuideDefinition> = new Map(guides.map((guide) => [guide.slug, guide]));

export function getAllGuides(): readonly GuideDefinition[] {
  return guides;
}

export function getGuideBySlug(slug: string): GuideDefinition | undefined {
  return guidesBySlug.get(slug);
}

/**
 * Guides that promote a given tool, for internal linking from tool pages.
 * Tools no guide mentions get the general "Basics" and troubleshooting guides.
 */
export function getGuidesForTool(toolSlug: string): GuideDefinition[] {
  const matches = guides.filter((guide) => (guide.relatedTools as readonly string[]).includes(toolSlug));
  if (matches.length > 0) return matches;
  return guides.filter((guide) => guide.topic === "Basics" || guide.topic === "Troubleshooting");
}

/** Rough reading time at 220 words per minute. */
export function readingMinutes(guide: GuideDefinition): number {
  const parts: string[] = [guide.summary];
  for (const section of guide.sections) {
    parts.push(section.heading);
    for (const block of section.blocks) {
      if (block.type === "p" || block.type === "note") parts.push(block.text);
      else if (block.type === "ul" || block.type === "ol") parts.push(...block.items);
      else parts.push(block.caption, ...block.head, ...block.rows.flat());
    }
  }
  const words = parts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
