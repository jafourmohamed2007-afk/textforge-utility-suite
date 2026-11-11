# 40. `components/Logo.tsx`

Inline logo mark and wordmark.

```tsx
/**
 * FitKB logo mark: a crop frame with an arrow landing on the size-limit line
 * ("fit under the limit"). Same artwork as app/icon.svg and public/logo.svg.
 * `id` keeps the gradient id unique when the mark appears more than once.
 */
export function LogoMark({ id, className = "size-8" }: { id: string; className?: string }) {
  const gradient = `fitkb-gradient-${id}`;
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14a088" />
          <stop offset="1" stopColor="#0a6a5b" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${gradient})`} />
      <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 23V13h10M41 13h10v10M13 41v10h10M51 41v10H41" strokeWidth="4" opacity=".9" />
        <path d="M32 17v19M24.5 29 32 36.5 39.5 29" strokeWidth="5" />
      </g>
      <path d="M22 44h20" stroke="#ffd166" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

/** Mark plus "FitKB" wordmark, with "KB" in the brand colour. */
export function Logo({ id, className = "" }: { id: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark id={id} />
      <span className="text-lg font-extrabold tracking-tight text-ink">
        Fit<span className="text-brand-600 dark:text-brand-300">KB</span>
      </span>
    </span>
  );
}
```
