# 13. `lib/image/browser.ts`

Browser side: decode with EXIF orientation, draw to canvas, encode.

```ts
import type { OutputFormat, PresetSpec } from "../types";
import { fitToTarget, type FitOutcome } from "./fit";
import { initialScale, minimumScale, planDraw, scaledDimensions, targetBytes, type Dimensions } from "./math";

export type DecodedImage = ImageBitmap | HTMLImageElement;

export interface LoadedPhoto {
  image: DecodedImage;
  width: number;
  height: number;
  name: string;
  size: number;
  type: string;
}

export interface CompressResult {
  blob: Blob;
  width: number;
  height: number;
  quality: number;
  fits: boolean;
  format: OutputFormat;
  /** True when the browser could not produce WebP and JPEG was used instead. */
  formatFallback: boolean;
  attempts: number;
}

/** Decodes a photo, honouring EXIF orientation so phone photos are upright. */
export async function loadPhoto(file: File): Promise<LoadedPhoto> {
  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|gif|bmp|avif|heic|heif)$/i.test(file.name)) {
    throw new Error("That file is not an image. Choose a JPG, PNG or WebP photo.");
  }
  const meta = { name: file.name || "photo", size: file.size, type: file.type };
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { image: bitmap, width: bitmap.width, height: bitmap.height, ...meta };
    } catch {
      // Fall through to <img> decoding (older Safari).
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return { image, width: image.naturalWidth, height: image.naturalHeight, ...meta };
  } catch {
    throw new Error(
      "This browser cannot open that image. HEIC photos from an iPhone open in Safari; elsewhere, export the photo as JPG first.",
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("The browser could not encode the image."))), mime, quality);
  });
}

const MIME: Record<OutputFormat, string> = { jpeg: "image/jpeg", webp: "image/webp" };

/** Compresses a decoded photo to the preset's size limit and dimensions. */
export async function compressPhoto(photo: LoadedPhoto, preset: PresetSpec): Promise<CompressResult> {
  const plan = planDraw({ width: photo.width, height: photo.height }, preset.mode, { width: preset.width, height: preset.height }, preset.focusY / 100);
  const bytes = targetBytes(preset.targetKB);
  let mime = MIME[preset.format];
  let formatFallback = false;

  const canvas = document.createElement("canvas");
  let drawnAt: Dimensions | null = null;

  const draw = (scale: number): Dimensions => {
    const size = plan.locked ? plan.canvas : scaledDimensions(plan.canvas, scale);
    if (drawnAt && drawnAt.width === size.width && drawnAt.height === size.height) return size;
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not available in this browser.");
    const ratioX = size.width / plan.canvas.width;
    const ratioY = size.height / plan.canvas.height;
    // JPEG has no transparency: paint white first so transparent PNGs do not turn black.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size.width, size.height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      photo.image,
      plan.source.x,
      plan.source.y,
      plan.source.width,
      plan.source.height,
      plan.dest.x * ratioX,
      plan.dest.y * ratioY,
      plan.dest.width * ratioX,
      plan.dest.height * ratioY,
    );
    drawnAt = size;
    return size;
  };

  // Some browsers silently return PNG when they cannot write WebP; detect once.
  if (mime === "image/webp") {
    draw(plan.locked ? 1 : Math.min(1, minimumScale(plan.canvas) * 2));
    const probe = await canvasToBlob(canvas, mime, 0.8);
    if (probe.type !== "image/webp") {
      mime = "image/jpeg";
      formatFallback = true;
    }
    drawnAt = null;
  }

  const outcome: FitOutcome<Blob> = await fitToTarget<Blob>(
    async (scale, quality) => {
      draw(scale);
      const blob = await canvasToBlob(canvas, mime, quality);
      return { size: blob.size, data: blob };
    },
    {
      targetBytes: bytes,
      locked: plan.locked,
      initialScale: initialScale(plan.canvas, bytes),
      minScale: minimumScale(plan.canvas),
    },
  );

  const finalSize = plan.locked ? plan.canvas : scaledDimensions(plan.canvas, outcome.scale);
  return {
    blob: outcome.encoded.data,
    width: finalSize.width,
    height: finalSize.height,
    quality: outcome.quality,
    fits: outcome.fits,
    format: mime === "image/webp" ? "webp" : "jpeg",
    formatFallback,
    attempts: outcome.attempts,
  };
}

export function outputFileName(originalName: string, targetKB: number, format: OutputFormat): string {
  const base = originalName.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "") || "photo";
  return `${base}-${targetKB}kb.${format === "webp" ? "webp" : "jpg"}`;
}
```
