# 48. `tests/image.test.ts`

Node test runner unit tests for the math and size search.

```ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fitToTarget, MAX_QUALITY, type Encoder } from "../lib/image/fit.ts";
import { formatBytes, initialScale, minimumScale, mmToPx, planDraw, scaledDimensions, targetBytes } from "../lib/image/math.ts";

/**
 * Fake JPEG encoder: size grows with pixel count and quality, roughly like a
 * real photo (about 0.05 B/px at low quality up to 0.6 B/px near 0.95).
 */
function fakeEncoder(width: number, height: number): Encoder<null> {
  return async (scale, quality) => {
    const pixels = Math.round(width * scale) * Math.round(height * scale);
    const bytesPerPixel = 0.04 + 0.6 * quality ** 2;
    return { size: Math.round(600 + pixels * bytesPerPixel), data: null };
  };
}

describe("math", () => {
  it("applies limits as KB x 1000 bytes", () => {
    assert.equal(targetBytes(20), 20000);
    assert.equal(targetBytes(0.5), 500);
  });

  it("converts passport millimetres at 300 DPI", () => {
    assert.equal(mmToPx(35), 413);
    assert.equal(mmToPx(45), 531);
    assert.equal(mmToPx(50.8), 600);
  });

  it("formats sizes", () => {
    assert.equal(formatBytes(950), "950 B");
    assert.equal(formatBytes(19876), "19.9 KB");
    assert.equal(formatBytes(2_500_000), "2.50 MB");
  });

  it("keeps original dimensions in original mode", () => {
    const plan = planDraw({ width: 4000, height: 3000 }, "original", { width: 100, height: 100 });
    assert.deepEqual(plan.canvas, { width: 4000, height: 3000 });
    assert.equal(plan.locked, false);
  });

  it("fits inside a box without upscaling in max mode", () => {
    assert.deepEqual(planDraw({ width: 4000, height: 3000 }, "max", { width: 1600, height: 1600 }).canvas, { width: 1600, height: 1200 });
    assert.deepEqual(planDraw({ width: 800, height: 600 }, "max", { width: 1600, height: 1600 }).canvas, { width: 800, height: 600 });
  });

  it("crops to fill with focus in cover mode", () => {
    const top = planDraw({ width: 3000, height: 4000 }, "cover", { width: 413, height: 531 }, 0);
    assert.deepEqual(top.canvas, { width: 413, height: 531 });
    assert.equal(top.locked, true);
    assert.equal(top.source.y, 0);
    const bottom = planDraw({ width: 3000, height: 4000 }, "cover", { width: 600, height: 600 }, 1);
    assert.equal(bottom.source.width, 3000);
    assert.equal(bottom.source.height, 3000);
    assert.equal(bottom.source.y, 1000);
  });

  it("pads instead of cropping in contain mode", () => {
    const plan = planDraw({ width: 1000, height: 1000 }, "contain", { width: 400, height: 160 });
    assert.deepEqual(plan.canvas, { width: 400, height: 160 });
    assert.equal(plan.dest.width, 160);
    assert.equal(plan.dest.x, 120);
    assert.deepEqual(plan.source, { x: 0, y: 0, width: 1000, height: 1000 });
  });

  it("guesses a starting scale and a minimum scale", () => {
    assert.equal(initialScale({ width: 100, height: 100 }, 50000), 1);
    const guess = initialScale({ width: 4000, height: 3000 }, 20000);
    assert.ok(guess > 0.05 && guess < 0.2, `guess ${guess}`);
    assert.equal(minimumScale({ width: 6400, height: 100 }), 0.01);
    assert.deepEqual(scaledDimensions({ width: 4000, height: 3000 }, 0.1), { width: 400, height: 300 });
  });
});

describe("fitToTarget", () => {
  it("never exceeds the limit and lands close to it for a large photo", async () => {
    const canvas = { width: 4000, height: 3000 };
    const limit = targetBytes(20);
    const outcome = await fitToTarget(fakeEncoder(canvas.width, canvas.height), {
      targetBytes: limit,
      locked: false,
      initialScale: initialScale(canvas, limit),
      minScale: minimumScale(canvas),
    });
    assert.equal(outcome.fits, true);
    assert.ok(outcome.encoded.size <= limit);
    assert.ok(outcome.encoded.size > limit * 0.85, `size ${outcome.encoded.size} too far below ${limit}`);
    assert.ok(outcome.quality >= 0.4, "keeps quality above the floor by shrinking instead");
    assert.ok(outcome.attempts < 40);
  });

  it("keeps full size and max quality when the photo already fits", async () => {
    const outcome = await fitToTarget(fakeEncoder(200, 200), { targetBytes: 200_000, locked: false, initialScale: 1, minScale: 0.32 });
    assert.equal(outcome.scale, 1);
    assert.equal(outcome.quality, MAX_QUALITY);
  });

  it("grows back toward full size when the first guess was too small", async () => {
    const outcome = await fitToTarget(fakeEncoder(1000, 1000), { targetBytes: 500_000, locked: false, initialScale: 0.2, minScale: 0.064 });
    assert.ok(outcome.scale > 0.5, `scale ${outcome.scale}`);
    assert.ok(outcome.encoded.size <= 500_000);
  });

  it("only lowers quality when dimensions are locked", async () => {
    const outcome = await fitToTarget(fakeEncoder(413, 531), { targetBytes: 20_000, locked: true, initialScale: 0.1, minScale: 0.1 });
    assert.equal(outcome.scale, 1);
    assert.equal(outcome.fits, true);
    assert.ok(outcome.encoded.size <= 20_000);
    assert.ok(outcome.quality < MAX_QUALITY);
  });

  it("reports when a locked size cannot fit", async () => {
    const outcome = await fitToTarget(fakeEncoder(3000, 3000), { targetBytes: 5_000, locked: true, initialScale: 1, minScale: 1 });
    assert.equal(outcome.fits, false);
    assert.equal(outcome.scale, 1);
  });
});
```
