# 41. `components/RichText.tsx`

Renders content text with links.

```tsx
import Link from "next/link";
import { Fragment } from "react";
import { parseLinks } from "@/lib/links";

/** Plain text with [label](/path) links rendered as <Link>, and [label](https://…) as external links. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {parseLinks(text).map((part, index) =>
        part.href?.startsWith("https://") ? (
          <a
            key={index}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800 dark:text-brand-300"
          >
            {part.text}
          </a>
        ) : part.href ? (
          <Link
            key={index}
            href={part.href}
            className="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800 dark:text-brand-300"
          >
            {part.text}
          </Link>
        ) : (
          <Fragment key={index}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}
```
