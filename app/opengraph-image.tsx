import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.fullName}: resize photos to an exact KB size`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card generated at build time (no image files to maintain). */
export default async function OpenGraphImage() {
  const mark = await readFile(join(process.cwd(), "app", "icon.svg"));
  const markSrc = `data:image/svg+xml;base64,${mark.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a1312",
          color: "#e3ece9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={markSrc} width={96} height={96} alt="" />
          <div style={{ display: "flex", fontSize: 52, fontWeight: 800 }}>
            Fit<span style={{ color: "#6fd3bf" }}>KB</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Resize any photo to the exact KB your form needs</div>
          <div style={{ fontSize: 34, color: "#94a8a3" }}>20 KB · 50 KB · 100 KB · Passport · Signature — free, private, on your phone</div>
        </div>
      </div>
    ),
    size,
  );
}
