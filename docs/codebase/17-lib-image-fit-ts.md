# 17. `lib/image/fit.ts`

Pure size-targeting search (quality binary search + scale adjustment).

```ts
/**
 * Size-targeting search, independent of the browser so it can be unit tested.
 *
 * The encoder is called with (scale, quality) and reports the encoded size.
 * Strategy:
 *   1. Try the highest quality at the current scale. If it fits and is not far
 *      below the target, done. If it is far below and the image was shrunk,
 *      grow the scale back toward the original and try again.
 *   2. Try the quality floor. If even that is too big, shrink the scale
 *      (unless dimensions are locked) and repeat.
 *   3. Otherwise binary-search the highest quality that still fits.
 */

export interface Encoded<T> {
  size: number;
  data: T;
}

export type Encoder<T> = (scale: number, quality: number) => Promise<Encoded<T>>;

export interface FitOptions {
  targetBytes: number;
  /** Dimensions are fixed (passport photo, signature box): only quality may change. */
  locked: boolean;
  initialScale: number;
  minScale: number;
  maxRounds?: number;
}

export interface FitOutcome<T> {
  encoded: Encoded<T>;
  scale: number;
  quality: number;
  /** False when even the smallest attempt is over the limit. */
  fits: boolean;
  attempts: number;
}

export const MAX_QUALITY = 0.95;
const SEARCH_STEPS = 7;
const UNLOCKED_QUALITY_FLOOR = 0.4;
const LOCKED_QUALITY_FLOOR = 0.05;

export async function fitToTarget<T>(encode: Encoder<T>, options: FitOptions): Promise<FitOutcome<T>> {
  const { targetBytes, locked, minScale } = options;
  const maxRounds = options.maxRounds ?? 8;
  const floor = locked ? LOCKED_QUALITY_FLOOR : UNLOCKED_QUALITY_FLOOR;
  let scale = locked ? 1 : Math.min(1, Math.max(minScale, options.initialScale));
  let attempts = 0;
  const found: { bestFit: FitOutcome<T> | null; smallest: FitOutcome<T> | null } = { bestFit: null, smallest: null };

  const run = async (quality: number): Promise<Encoded<T>> => {
    attempts += 1;
    return encode(scale, quality);
  };
  const remember = (encoded: Encoded<T>, quality: number, fits: boolean): FitOutcome<T> => {
    const outcome = { encoded, scale, quality, fits, attempts };
    if (fits && (!found.bestFit || encoded.size > found.bestFit.encoded.size)) found.bestFit = outcome;
    if (!fits && (!found.smallest || encoded.size < found.smallest.encoded.size)) found.smallest = outcome;
    return outcome;
  };

  for (let round = 0; round < maxRounds; round += 1) {
    const top = await run(MAX_QUALITY);
    if (top.size <= targetBytes) {
      const outcome = remember(top, MAX_QUALITY, true);
      const roomToGrow = !locked && scale < 1 && top.size < targetBytes * 0.6 && round < maxRounds - 1;
      if (!roomToGrow) return { ...(found.bestFit ?? outcome), attempts };
      scale = Math.min(1, scale * Math.sqrt(targetBytes / top.size) * 0.92);
      continue;
    }

    const low = await run(floor);
    if (low.size > targetBytes) {
      remember(low, floor, false);
      if (found.bestFit) return { ...found.bestFit, attempts };
      if (locked || scale <= minScale) break;
      const shrink = Math.min(0.95, Math.max(0.3, Math.sqrt(targetBytes / low.size) * 0.95));
      scale = Math.max(minScale, scale * shrink);
      continue;
    }

    let lo = floor;
    let hi = MAX_QUALITY;
    let best = low;
    let bestQuality = floor;
    for (let step = 0; step < SEARCH_STEPS; step += 1) {
      const mid = (lo + hi) / 2;
      const candidate = await run(mid);
      if (candidate.size <= targetBytes) {
        best = candidate;
        bestQuality = mid;
        lo = mid;
      } else {
        hi = mid;
      }
    }
    const outcome = remember(best, bestQuality, true);
    return { ...(found.bestFit ?? outcome), attempts };
  }

  const fallback = found.bestFit ?? found.smallest;
  if (!fallback) throw new Error("The image could not be encoded.");
  return { ...fallback, attempts };
}
```
