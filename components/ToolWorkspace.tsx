"use client";

import { useCallback, useDeferredValue, useId, useMemo, useRef, useState } from "react";
import { getProcessor } from "@/lib/processors";
import type { OptionValue, OptionValues, ProcessResult, ToolDefinition } from "@/lib/types";
import { CopyButton } from "./CopyButton";
import { OptionControl } from "./OptionControl";

export type WorkspaceTool = Pick<
  ToolDefinition,
  | "slug"
  | "name"
  | "inputLabel"
  | "outputLabel"
  | "inputPlaceholder"
  | "sampleInput"
  | "downloadName"
  | "downloadMime"
  | "options"
>;

function defaultOptions(tool: WorkspaceTool): OptionValues {
  const values: OptionValues = {};
  for (const option of tool.options) values[option.id] = option.defaultValue;
  return values;
}

const EMPTY_RESULT: ProcessResult = { output: "", stats: [] };

const secondaryButton =
  "tap-target inline-flex items-center justify-center rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-brand-500 hover:text-brand-700 active:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-brand-300 dark:active:bg-white/5";

export function ToolWorkspace({ tool }: { tool: WorkspaceTool }) {
  const idPrefix = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<OptionValues>(() => defaultOptions(tool));
  const [notice, setNotice] = useState("");

  // Keeps typing at 60fps on low-end phones: heavy processing yields to input.
  const deferredInput = useDeferredValue(input);
  const deferredOptions = useDeferredValue(options);
  const isStale = deferredInput !== input || deferredOptions !== options;

  const result = useMemo<ProcessResult>(() => {
    const processor = getProcessor(tool.slug);
    if (!processor) return { ...EMPTY_RESULT, warning: "This tool has no processor registered." };
    try {
      return processor(deferredInput, deferredOptions);
    } catch (error) {
      return { ...EMPTY_RESULT, warning: error instanceof Error ? error.message : "Unexpected processing error." };
    }
  }, [tool.slug, deferredInput, deferredOptions]);

  const handleOptionChange = useCallback((id: string, value: OptionValue) => {
    setOptions((previous) => ({ ...previous, [id]: value }));
  }, []);

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setNotice(text ? "Pasted from clipboard." : "Clipboard is empty.");
    } catch {
      inputRef.current?.focus();
      setNotice("Clipboard access was blocked. Long-press the input box and choose Paste.");
    }
  }

  function handleDownload() {
    const blob = new Blob([result.output], { type: `${tool.downloadMime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = tool.downloadName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  const inputId = `${idPrefix}-input`;
  const outputId = `${idPrefix}-output`;
  const hasOptions = tool.options.length > 0;
  // Tabular output is easier to read without soft wrapping.
  const noWrap = tool.downloadMime === "text/csv";
  const statSlots = result.stats.length > 0 ? result.stats : [{ label: "Output chars", value: "0" }];

  return (
    <section aria-label={`${tool.name} workspace`} className="flex flex-col gap-4">
      {hasOptions ? (
        <fieldset className="order-3 rounded-2xl border border-line bg-panel p-3 sm:p-4 lg:order-first">
          <legend className="px-1 text-sm font-semibold text-ink">Options</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tool.options.map((option) => (
              <OptionControl
                key={option.id}
                option={option}
                value={options[option.id] ?? option.defaultValue}
                onChange={handleOptionChange}
                idPrefix={idPrefix}
              />
            ))}
          </div>
        </fieldset>
      ) : null}

      {/* Stacked on mobile, side-by-side on desktop. Fixed heights => zero CLS.
          On phones the panes come first and options follow, so the paste box is
          reachable without scrolling past every control. */}
      <div className="order-1 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-line bg-panel">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
            <label htmlFor={inputId} className="text-sm font-semibold text-ink">
              {tool.inputLabel}
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={handlePaste} className={secondaryButton}>
                Paste
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput(tool.sampleInput);
                  setNotice("Sample text loaded.");
                }}
                className={secondaryButton}
              >
                Sample
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setNotice("Input cleared.");
                  inputRef.current?.focus();
                }}
                disabled={input.length === 0}
                className={secondaryButton}
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            ref={inputRef}
            id={inputId}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={tool.inputPlaceholder}
            spellCheck={false}
            wrap={noWrap ? "off" : "soft"}
            autoCapitalize="off"
            autoCorrect="off"
            className="h-64 w-full resize-none rounded-b-2xl bg-transparent p-3 font-mono text-base leading-relaxed text-ink placeholder:text-ink-soft sm:h-80 lg:h-[30rem]"
          />
        </div>

        <div className="flex flex-col rounded-2xl border border-line bg-panel">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
            <label htmlFor={outputId} className="text-sm font-semibold text-ink">
              {tool.outputLabel}
              <span
                aria-hidden="true"
                className={`ml-2 inline-block size-2 rounded-full align-middle transition-opacity ${isStale ? "bg-amber-500 opacity-100" : "opacity-0"}`}
              />
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={handleDownload} disabled={result.output.length === 0} className={secondaryButton}>
                Download
              </button>
              <CopyButton text={result.output} subject={tool.outputLabel} />
            </div>
          </div>
          <textarea
            id={outputId}
            value={result.output}
            readOnly
            placeholder="Your result appears here instantly."
            spellCheck={false}
            wrap={noWrap ? "off" : "soft"}
            className="h-64 w-full resize-none rounded-b-2xl bg-transparent p-3 font-mono text-base leading-relaxed text-ink placeholder:text-ink-soft sm:h-80 lg:h-[30rem]"
          />
        </div>
      </div>

      {/* Reserved-height status strip: content changes never move the page. */}
      <div className="order-2 flex min-h-12 flex-col gap-2 rounded-2xl border border-line bg-panel px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:flex sm:flex-wrap sm:gap-x-5">
          {statSlots.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-1.5">
              <dt className="text-ink-soft">{stat.label}</dt>
              <dd className="font-mono font-semibold tabular-nums text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <p role="status" aria-live="polite" className="min-h-4 text-xs text-ink-soft">
          {notice}
        </p>
      </div>

      {result.warning ? (
        <p role="alert" className="order-4 rounded-xl border border-amber-400/60 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          {result.warning}
        </p>
      ) : null}

      {result.table !== undefined ? <TablePreview rows={result.table} /> : null}
    </section>
  );
}

function TablePreview({ rows }: { rows: string[][] }) {
  const [header, ...body] = rows;
  return (
    <section aria-label="Table preview" className="order-5 rounded-2xl border border-line bg-panel">
      <h2 className="border-b border-line px-3 py-3 text-sm font-semibold text-ink">Table preview</h2>
      <div className="h-72 overflow-auto overscroll-contain">
        {header ? (
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-panel-strong">
              <tr>
                {header.map((cell, index) => (
                  <th key={index} scope="col" className="whitespace-nowrap border-b border-line px-3 py-2 font-semibold text-ink">
                    {cell || <span className="text-ink-soft">—</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, rowIndex) => (
                <tr key={rowIndex} className="odd:bg-black/[0.02] dark:odd:bg-white/[0.03]">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="whitespace-nowrap border-b border-line/60 px-3 py-2 font-mono text-ink">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-3 text-sm text-ink-soft">Paste delimited rows to see them as a table.</p>
        )}
      </div>
    </section>
  );
}
