import Link from "next/link";
import type { ToolDefinition } from "@/lib/types";

const reviewedFormat = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/**
 * Server-rendered content placed *below* the interactive workspace:
 * step-by-step process, output specification, method/privacy notes and FAQ. Mirrors the HowTo + FAQPage JSON-LD so on-page text and structured data
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

      <section aria-labelledby="spec-heading">
        <h2 id="spec-heading" className="text-2xl font-bold tracking-tight text-ink">
          Output specification
        </h2>
        <p className="mt-2 max-w-prose text-sm text-ink-soft">
          These are the starting settings for this page. You can change every one of them in the Settings panel above.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-panel">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">{tool.name} output specification</caption>
            <tbody>
              {tool.specs.map((row, index) => (
                <tr key={row.label} className={index > 0 ? "border-t border-line" : undefined}>
                  <th scope="row" className="whitespace-nowrap bg-panel-strong px-4 py-3 font-semibold text-ink">
                    {row.label}
                  </th>
                  <td className="px-4 py-3 text-ink-soft">{row.value}</td>
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
            <strong className="text-ink">Runs on your device.</strong> The photo is decoded and re-encoded with the browser&apos;s Canvas API. It
            is never uploaded, so passport photos and signatures stay private.
          </li>
          <li>
            <strong className="text-ink">How the size is reached.</strong> FitKB tries the highest JPEG quality first, then binary-searches the
            quality until the file is at or under the limit. Dimensions are reduced only when quality alone cannot reach it, and never for
            fixed-size photos.
          </li>
          <li>
            <strong className="text-ink">Safe for strict forms.</strong> The limit is applied as KB × 1000 bytes, so the file passes whether a
            portal counts 1 KB as 1000 or 1024 bytes. Metadata such as GPS location is not copied into the new file.
          </li>
          <li>
            <strong className="text-ink">Tested.</strong> The size search and crop calculations are covered by automated tests.
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
            Related presets
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/${item.slug}`}
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
