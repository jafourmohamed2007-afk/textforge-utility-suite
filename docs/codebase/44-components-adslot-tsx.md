# 44. `components/AdSlot.tsx`

Optional AdSense unit with reserved height.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * One manual, responsive in-content AdSense unit.
 *
 * Renders nothing unless both NEXT_PUBLIC_ADSENSE_CLIENT and
 * NEXT_PUBLIC_ADSENSE_SLOT are set. The box reserves its height before the ad
 * loads so the page does not jump (zero layout shift), is labelled as an
 * advertisement, and is only ever placed between content sections, never
 * next to the upload or download buttons, to avoid accidental clicks.
 */
export function AdSlot({ className = "" }: { className?: string }) {
  const pushed = useRef(false);
  const client = siteConfig.adsenseClient;
  const slot = siteConfig.adsenseSlot;

  useEffect(() => {
    if (!client || !slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // Ad blockers or a missing script: leave the reserved box empty.
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <aside aria-label="Advertisement" className={`flex flex-col items-center ${className}`}>
      <p className="mb-1 text-[11px] uppercase tracking-wider text-ink-soft">Advertisement</p>
      <div className="w-full overflow-hidden" style={{ minHeight: 280 }}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: 280 }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
```
