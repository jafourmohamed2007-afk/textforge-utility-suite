# 11. `lib/image/math.ts`

Pure geometry and size helpers (crop plans, mm to px, KB limits).

```ts
import type { SizeMode } from "../types";

export interface Dimensions {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Where the source image is read from and where it lands on the output canvas. */
export interface DrawPlan {
  canvas: Dimensions;
  source: Rect;
  dest: Rect;
  /** True when the output must be exactly canvas-sized (no extra shrinking allowed). */
  locked: boolean;
}

/** Bytes the engine must stay at or under. 1 KB = 1000 bytes, so files also pass 1024-based checks. */
export function targetBytes(targetKB: number): number {
  return Math.max(1, Math.floor(targetKB * 1000));
}

/** Millimetres to pixels at a print resolution (passport photos are specified at 300 DPI). */
export function mmToPx(mm: number, dpi = 300): number {
  return Math.round((mm / 25.4) * dpi);
}

const byteFormat = new Intl.NumberFormat("en-US");

export function formatBytes(bytes: number): string {
  if (bytes < 1000) return `${bytes} B`;
  const kb = bytes / 1000;
  if (kb < 1000) return `${kb < 100 ? kb.toFixed(1) : Math.round(kb)} KB`;
  return `${(kb / 1000).toFixed(2)} MB`;
}

export function formatByteCount(bytes: number): string {
  return `${byteFormat.format(bytes)} bytes`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Computes the output canvas and the source/destination rectangles for a mode.
 * focusY (0..1) chooses which vertical slice survives a crop in cover mode.
 */
export function planDraw(src: Dimensions, mode: SizeMode, box: Dimensions, focusY = 0.5): DrawPlan {
  const full: Rect = { x: 0, y: 0, width: src.width, height: src.height };
  const boxW = Math.max(1, Math.round(box.width));
  const boxH = Math.max(1, Math.round(box.height));

  if (mode === "max") {
    const scale = Math.min(1, boxW / src.width, boxH / src.height);
    const width = Math.max(1, Math.round(src.width * scale));
    const height = Math.max(1, Math.round(src.height * scale));
    return { canvas: { width, height }, source: full, dest: { x: 0, y: 0, width, height }, locked: false };
  }

  if (mode === "cover") {
    const scale = Math.max(boxW / src.width, boxH / src.height);
    const width = boxW / scale;
    const height = boxH / scale;
    const x = (src.width - width) / 2;
    const y = (src.height - height) * clamp(focusY, 0, 1);
    return { canvas: { width: boxW, height: boxH }, source: { x, y, width, height }, dest: { x: 0, y: 0, width: boxW, height: boxH }, locked: true };
  }

  if (mode === "contain") {
    const scale = Math.min(boxW / src.width, boxH / src.height);
    const width = src.width * scale;
    const height = src.height * scale;
    return {
      canvas: { width: boxW, height: boxH },
      source: full,
      dest: { x: (boxW - width) / 2, y: (boxH - height) / 2, width, height },
      locked: true,
    };
  }

  return { canvas: { ...src }, source: full, dest: { ...full }, locked: false };
}

/**
 * First guess for the shrink factor so a large photo is not encoded at full
 * resolution dozens of times. Assumes roughly 0.12 bytes per pixel at medium
 * JPEG quality; the search corrects the guess in both directions.
 */
export function initialScale(canvas: Dimensions, bytes: number): number {
  const pixels = canvas.width * canvas.height;
  if (pixels === 0) return 1;
  return clamp(Math.sqrt(bytes / (pixels * 0.12)), 0.05, 1);
}

/** Smallest allowed shrink factor: the long edge never drops below 64 px. */
export function minimumScale(canvas: Dimensions): number {
  const longEdge = Math.max(canvas.width, canvas.height);
  return longEdge <= 64 ? 1 : 64 / longEdge;
}

export function scaledDimensions(canvas: Dimensions, scale: number): Dimensions {
  return {
    width: Math.max(1, Math.round(canvas.width * scale)),
    height: Math.max(1, Math.round(canvas.height * scale)),
  };
}
```
