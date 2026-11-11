import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.fullName}: resize photos to an exact KB size`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card generated at build time (no image files to maintain). */
export default function OpenGraphImage() {
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
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 20,
              background: "#0d8571",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            KB
          </div>
          <div style={{ fontSize: 48, fontWeight: 700 }}>{siteConfig.name}</div>
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
