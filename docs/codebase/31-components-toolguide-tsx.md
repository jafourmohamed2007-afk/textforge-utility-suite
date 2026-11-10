# 31. `components/ToolGuide.tsx`

E-E-A-T content panels: how-to, syntax table, method, FAQ.

```tsx
import Link from "next/link";
import type { ToolDefinition } from "@/lib/types";

const reviewedFormat = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/**
 * Server-rendered educational content placed *below* the interactive
 * workspace: step-by-step process, syntax reference, privacy/method notes and
 * FAQ. Mirrors the HowTo + FAQPage JSON-LD so on-page text and structured data
 * always agree.
 */
export function ToolGuide({ tool, related }: { tool: ToolDefinition; related: readonly ToolDefinition[] }) {
  const reviewed = reviewedFormat.format(new Date(`${tool.lastReviewed}T00:00:00Z`));

  return (
    <div className="mt-12 flex flex-col gap-10">
      <section aria-labelledby="how-to-heading">
        <h2 id="how-to-heading" className="text-2xl font-bold tracking-tight text-ink">
          How to use the {tool.name}
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {tool.howTo.map((step, index) => (
            <li key={step.title} id={`step-${index + 1}`} className="flex gap-3 rounded-2xl border border-line bg-panel p-4">
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-600 font-mono text-sm font-bold text-white"
              >
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="syntax-heading">
        <h2 id="syntax-heading" className="text-2xl font-bold tracking-tight text-ink">
          Syntax reference: what changes and why
        </h2>
        <p className="mt-2 max-w-prose text-sm text-ink-soft">
          Each rule below is applied with native JavaScript string and regular-expression methods, in the order listed, directly on your
          device.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-panel">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">{tool.name} transformation rules</caption>
            <thead className="bg-panel-strong">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold text-ink">
                  Input
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-ink">
                  Output
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-ink">
                  Rule
                </th>
              </tr>
            </thead>
            <tbody>
              {tool.syntax.map((rule) => (
                <tr key={`${rule.pattern}-${rule.result}`} className="border-t border-line">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-ink">{rule.pattern}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-brand-700 dark:text-brand-300">{rule.result}</td>
                  <td className="min-w-56 px-4 py-3 text-ink-soft">{rule.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="method-heading" className="rounded-2xl border border-line bg-panel p-5">
        <h2 id="method-heading" className="text-xl font-bold tracking-tight text-ink">
          Methodology, privacy and accuracy
        </h2>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-ink-soft">
          <li>
            <strong className="text-ink">Runs locally.</strong> The page ships a small JavaScript function for this tool. Your text is
            processed in browser memory and is never sent over the network, so there is zero server latency and nothing to leak.
          </li>
          <li>
            <strong className="text-ink">Deterministic output.</strong> The same input and options always produce the same result. There
            is no AI rewriting; only the syntax described in the reference table is changed.
          </li>
          <li>
            <strong className="text-ink">Tested rules.</strong> Each transformation is covered by automated tests for edge cases such as
            Windows line endings, emoji, quoted fields and identifiers containing underscores.
          </li>
          <li>
            <strong className="text-ink">Last reviewed:</strong> <time dateTime={tool.lastReviewed}>{reviewed}</time>.
          </li>
        </ul>
      </section>

      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-ink">
          Frequently asked questions
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {tool.faq.map((entry) => (
            <details key={entry.question} className="group rounded-2xl border border-line bg-panel">
              <summary className="tap-target flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {entry.question}
                <span aria-hidden="true" className="text-xl text-ink-soft transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed text-ink-soft">{entry.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 ? (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-bold tracking-tight text-ink">
            Related tools
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/tools/${item.slug}`}
                  className="flex min-h-12 flex-col rounded-2xl border border-line bg-panel p-4 transition-colors hover:border-brand-500"
                >
                  <span className="font-semibold text-ink">{item.name}</span>
                  <span className="mt-1 text-sm text-ink-soft">{item.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
```
