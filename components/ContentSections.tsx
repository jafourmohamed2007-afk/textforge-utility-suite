import type { ReactNode } from "react";
import type { ContentBlock, ContentSection } from "@/lib/types";
import { RichText } from "./RichText";

export function sectionId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className="leading-relaxed text-ink-soft">
          <RichText text={block.text} />
        </p>
      );
    case "note":
      return (
        <p className="rounded-xl border-l-4 border-brand-500 bg-brand-50 px-4 py-3 leading-relaxed text-ink dark:bg-white/5">
          <RichText text={block.text} />
        </p>
      );
    case "ul":
    case "ol": {
      const List = block.type === "ul" ? "ul" : "ol";
      return (
        <List className={`flex flex-col gap-2 pl-6 leading-relaxed text-ink-soft ${block.type === "ul" ? "list-disc" : "list-decimal"}`}>
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              <RichText text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <div className="overflow-x-auto rounded-2xl border border-line bg-panel">
          <table className="min-w-full text-left text-sm">
            <caption className="px-4 pt-3 text-left text-xs text-ink-soft">{block.caption}</caption>
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th key={cell} scope="col" className="whitespace-nowrap bg-panel-strong px-4 py-3 font-semibold text-ink">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-line">
                  {row.map((cell, index) =>
                    index === 0 ? (
                      <th key={cell} scope="row" className="whitespace-nowrap px-4 py-3 font-semibold text-ink">
                        {cell}
                      </th>
                    ) : (
                      <td key={`${index}-${cell}`} className="px-4 py-3 text-ink-soft">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/**
 * Renders long-form sections. `afterSection` lets a page insert something
 * (an ad slot, a call to action) after a given section index.
 */
export function ContentSections({
  sections,
  afterSection,
}: {
  sections: readonly ContentSection[];
  afterSection?: (index: number) => ReactNode;
}) {
  return (
    <div className="flex flex-col gap-10">
      {sections.map((section, index) => (
        <div key={section.heading} className="flex flex-col gap-10">
          <section aria-labelledby={sectionId(section.heading)} className="flex flex-col gap-4">
            <h2 id={sectionId(section.heading)} className="scroll-mt-4 text-2xl font-bold tracking-tight text-ink">
              {section.heading}
            </h2>
            {section.blocks.map((block, blockIndex) => (
              <Block key={blockIndex} block={block} />
            ))}
          </section>
          {afterSection?.(index)}
        </div>
      ))}
    </div>
  );
}
