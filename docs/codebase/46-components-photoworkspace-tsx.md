# 46. `components/PhotoWorkspace.tsx`

Client workspace: upload, settings, live compression, preview, download.

```tsx
"use client";

import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { compressPhoto, loadPhoto, outputFileName, type CompressResult, type LoadedPhoto } from "@/lib/image/browser";
import { formatByteCount, formatBytes, targetBytes } from "@/lib/image/math";
import type { OptionValue, PresetSpec, SelectOption, RangeOption } from "@/lib/types";
import { OptionControl } from "./OptionControl";

const QUICK_LIMITS = [10, 20, 50, 100, 200, 500] as const;

const modeOption: SelectOption = {
  id: "mode",
  type: "select",
  label: "Dimensions",
  defaultValue: "original",
  choices: [
    { value: "original", label: "Keep original (shrink only if needed)" },
    { value: "max", label: "Fit inside width × height" },
    { value: "cover", label: "Exact width × height, crop to fill" },
    { value: "contain", label: "Exact width × height, pad with white" },
  ],
};

const formatOption: SelectOption = {
  id: "format",
  type: "select",
  label: "Format",
  defaultValue: "jpeg",
  choices: [
    { value: "jpeg", label: "JPG (accepted everywhere)" },
    { value: "webp", label: "WebP (smaller, not all forms accept it)" },
  ],
};

const focusOption: RangeOption = {
  id: "focusY",
  type: "range",
  label: "Vertical framing",
  hint: "0 keeps the top of the photo, 100 keeps the bottom. Used when cropping.",
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 50,
  unit: "%",
};

interface ResultView extends CompressResult {
  url: string;
  fileName: string;
}

type Status = "empty" | "working" | "done" | "error";

const panelButton =
  "tap-target inline-flex items-center justify-center rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-brand-500 disabled:cursor-not-allowed disabled:opacity-40";

export function PhotoWorkspace({ preset, label }: { preset: PresetSpec; label: string }) {
  const idPrefix = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jobRef = useRef(0);
  const [photo, setPhoto] = useState<LoadedPhoto | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<PresetSpec>(preset);
  const [limitDraft, setLimitDraft] = useState(String(preset.targetKB));
  const [result, setResult] = useState<ResultView | null>(null);
  const [status, setStatus] = useState<Status>("empty");
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [saved, setSaved] = useState<"download" | "share" | null>(null);

  // Web Share with files (mainly iPhone and Android) lets people save straight to Photos.
  useEffect(() => {
    try {
      const probe = new File([new Uint8Array(1)], "probe.jpg", { type: "image/jpeg" });
      setCanShare(typeof navigator.canShare === "function" && navigator.canShare({ files: [probe] }));
    } catch {
      setCanShare(false);
    }
  }, []);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(null), 2500);
    return () => clearTimeout(timer);
  }, [saved]);

  async function shareResult() {
    if (!result) return;
    const file = new File([result.blob], result.fileName, { type: result.blob.type });
    try {
      await navigator.share({ files: [file], title: result.fileName });
      setSaved("share");
    } catch (error) {
      // AbortError = the person closed the share sheet; nothing to report.
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setMessage("Sharing is not available here. Use Download instead.");
      }
    }
  }

  const acceptFile = useCallback(async (file: File | undefined | null) => {
    if (!file) return;
    setStatus("working");
    setMessage("Opening photo…");
    try {
      const loaded = await loadPhoto(file);
      setPhoto(loaded);
      setOriginalUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return URL.createObjectURL(file);
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "That photo could not be opened.");
    }
  }, []);

  // Paste an image from the clipboard anywhere on the page.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((item) => item.type.startsWith("image/"));
      if (file) {
        event.preventDefault();
        void acceptFile(file);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [acceptFile]);

  // Re-compress whenever the photo or a setting changes (debounced for typing).
  useEffect(() => {
    if (!photo) return;
    const job = ++jobRef.current;
    setStatus("working");
    setMessage("Finding the best quality under the limit…");
    const timer = setTimeout(async () => {
      try {
        const compressed = await compressPhoto(photo, settings);
        if (job !== jobRef.current) return;
        const view: ResultView = {
          ...compressed,
          url: URL.createObjectURL(compressed.blob),
          fileName: outputFileName(photo.name, settings.targetKB, compressed.format),
        };
        setResult((previous) => {
          if (previous) URL.revokeObjectURL(previous.url);
          return view;
        });
        setStatus("done");
        setMessage(
          !compressed.fits
            ? `Even at the lowest quality this is ${formatBytes(compressed.blob.size)}. Raise the limit or make the dimensions smaller.`
            : compressed.formatFallback
              ? "This browser cannot create WebP, so the photo was saved as JPG."
              : "Done. Check the preview, then download.",
        );
      } catch (error) {
        if (job !== jobRef.current) return;
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Compression failed.");
      }
    }, 220);
    return () => clearTimeout(timer);
  }, [photo, settings]);

  useEffect(
    () => () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
    },
    [originalUrl],
  );

  function update(patch: Partial<PresetSpec>) {
    setSettings((previous) => ({ ...previous, ...patch }));
  }

  function handleOption(id: string, value: OptionValue) {
    if (id === "mode" && typeof value === "string") update({ mode: value as PresetSpec["mode"] });
    if (id === "format" && typeof value === "string") update({ format: value as PresetSpec["format"] });
    if (id === "focusY" && typeof value === "number") update({ focusY: value });
  }

  function handleLimit(raw: string) {
    setLimitDraft(raw);
    const value = Number(raw);
    if (Number.isFinite(value) && value >= 1 && value <= 20000) update({ targetKB: Math.round(value * 10) / 10 });
  }

  function handleDimension(key: "width" | "height", raw: string) {
    const value = Math.round(Number(raw));
    if (Number.isFinite(value) && value >= 16 && value <= 8000) update({ [key]: value });
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    void acceptFile(event.dataTransfer.files[0]);
  }

  const original = photo ? `${formatBytes(photo.size)} · ${photo.width} × ${photo.height}` : "—";
  const savedPercent = photo && result ? Math.max(0, Math.floor((1 - result.blob.size / photo.size) * 100)) : null;
  const dimsDisabled = settings.mode === "original";
  const tone = status === "error" || (result && !result.fits) ? "text-rose-700 dark:text-rose-300" : "text-ink-soft";

  return (
    <section aria-label={`${label} workspace`} className="flex flex-col gap-4">
      <div className="order-1 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Original photo / upload target */}
        <div className="flex flex-col rounded-2xl border border-line bg-panel">
          <div className="flex min-h-16 items-center justify-between gap-2 border-b border-line px-3 py-2">
            <h2 className="text-sm font-semibold text-ink">Your photo</h2>
            <button type="button" onClick={() => fileInputRef.current?.click()} className={panelButton}>
              {photo ? "Change photo" : "Choose photo"}
            </button>
          </div>
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative m-3 flex h-64 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed text-center transition-colors focus-within:border-brand-500 sm:h-80 ${
              dragging ? "border-brand-500 bg-brand-50 dark:bg-white/5" : "border-line hover:border-brand-500"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                void acceptFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            {originalUrl ? (
              <img src={originalUrl} alt="Original photo" className="checker h-full w-full object-contain" />
            ) : (
              <>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-10 text-brand-600" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M12 16V4m0 0-4 4m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" />
                </svg>
                <span className="text-base font-semibold text-ink">Tap to choose a photo</span>
                <span className="px-4 text-sm text-ink-soft">or drag it here, or paste an image. JPG, PNG and WebP.</span>
              </>
            )}
          </label>
          <p className="px-3 pb-3 text-xs text-ink-soft">
            Original: <span className="font-mono tabular-nums text-ink">{original}</span>
          </p>
        </div>

        {/* Result */}
        <div className="flex flex-col rounded-2xl border border-line bg-panel">
          <div className="flex min-h-16 items-center justify-between gap-2 border-b border-line px-3 py-2">
            <h2 className="text-sm font-semibold text-ink">
              Result
              <span
                aria-hidden="true"
                className={`ml-2 inline-block size-2 rounded-full align-middle ${status === "working" ? "animate-pulse bg-amber-500" : "bg-transparent"}`}
              />
            </h2>
          </div>
          <div className="checker m-3 flex h-64 items-center justify-center overflow-hidden rounded-xl sm:h-80">
            {result ? (
              <img src={result.url} alt={`Compressed photo, ${formatBytes(result.blob.size)}`} className="h-full w-full object-contain" />
            ) : (
              <p className="px-6 text-center text-sm text-ink-soft">The compressed photo appears here. The Download button below turns on when it is ready.</p>
            )}
          </div>
          {/* Fixed-height action row: buttons enable in place, nothing below moves. */}
          <div className="flex gap-2 px-3">
            {result && status !== "error" ? (
              <a
                href={result.url}
                download={result.fileName}
                onClick={() => setSaved("download")}
                className="tap-target inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-base font-semibold text-white transition-colors hover:bg-brand-700"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 4v12m0 0 4-4m-4 4-4-4M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="truncate">
                  {saved === "download" ? "Downloaded" : `Download ${result.format === "webp" ? "WebP" : "JPG"}`}
                  <span className="font-mono font-normal tabular-nums opacity-90"> · {formatBytes(result.blob.size)}</span>
                </span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="tap-target inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 text-base font-semibold text-white opacity-40"
              >
                Download
              </button>
            )}
            {canShare ? (
              <button type="button" onClick={() => void shareResult()} disabled={!result || status === "error"} className={panelButton}>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-1.5 size-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15V3m0 0-4 4m4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {saved === "share" ? "Shared" : "Share"}
              </button>
            ) : null}
          </div>
          <p role="status" aria-live="polite" className={`min-h-16 px-3 py-2 text-xs ${tone}`}>
            {message}
            {result && status === "done" ? <span className="block truncate text-ink-soft">File name: {result.fileName}</span> : null}
          </p>
        </div>
      </div>

      {/* Reserved-height stats strip */}
      <dl className="order-2 grid min-h-12 grid-cols-2 gap-x-4 gap-y-1 rounded-2xl border border-line bg-panel px-3 py-3 text-xs sm:flex sm:flex-wrap sm:gap-x-6">
        {[
          ["New size", result ? formatBytes(result.blob.size) : "—"],
          ["Exact", result ? formatByteCount(result.blob.size) : "—"],
          ["Limit", `${formatByteCount(targetBytes(settings.targetKB))}`],
          ["Dimensions", result ? `${result.width} × ${result.height}` : "—"],
          ["Quality", result ? `${Math.round(result.quality * 100)}%` : "—"],
          ["Saved", savedPercent === null ? "—" : `${savedPercent}%`],
        ].map(([name, value]) => (
          <div key={name} className="flex items-baseline gap-1.5">
            <dt className="text-ink-soft">{name}</dt>
            <dd className="font-mono font-semibold tabular-nums text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <fieldset className="order-3 rounded-2xl border border-line bg-panel p-3 sm:p-4 lg:order-first">
        <legend className="px-1 text-sm font-semibold text-ink">Settings</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col sm:col-span-2 lg:col-span-1">
            <label htmlFor={`${idPrefix}-limit`} className="mb-1 px-1 text-sm font-medium text-ink">
              Size limit
            </label>
            <div className="relative">
              <input
                id={`${idPrefix}-limit`}
                type="number"
                inputMode="decimal"
                min={1}
                max={20000}
                step="any"
                value={limitDraft}
                onChange={(event) => handleLimit(event.target.value)}
                className="tap-target w-full rounded-xl border border-line bg-surface pl-3 pr-12 font-mono text-base tabular-nums text-ink hover:border-brand-500 focus:border-brand-500"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-soft">KB</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Common limits">
              {QUICK_LIMITS.map((kb) => (
                <button
                  key={kb}
                  type="button"
                  aria-pressed={settings.targetKB === kb}
                  onClick={() => handleLimit(String(kb))}
                  className={`tap-target rounded-full px-3 text-sm font-semibold transition-colors ${
                    settings.targetKB === kb ? "bg-brand-600 text-white" : "border border-line bg-surface text-ink hover:border-brand-500"
                  }`}
                >
                  {kb}
                </button>
              ))}
            </div>
          </div>

          <OptionControl option={modeOption} value={settings.mode} onChange={handleOption} idPrefix={idPrefix} />

          <div className="grid grid-cols-2 gap-3">
            {(["width", "height"] as const).map((key) => (
              <div key={key} className="flex flex-col">
                <label htmlFor={`${idPrefix}-${key}`} className="mb-1 px-1 text-sm font-medium capitalize text-ink">
                  {key}
                </label>
                <div className="relative">
                  <input
                    id={`${idPrefix}-${key}`}
                    type="number"
                    inputMode="numeric"
                    min={16}
                    max={8000}
                    defaultValue={settings[key]}
                    disabled={dimsDisabled}
                    onChange={(event) => handleDimension(key, event.target.value)}
                    className="tap-target w-full rounded-xl border border-line bg-surface pl-3 pr-10 font-mono text-base tabular-nums text-ink hover:border-brand-500 focus:border-brand-500 disabled:opacity-40"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-soft">px</span>
                </div>
              </div>
            ))}
          </div>

          <OptionControl option={formatOption} value={settings.format} onChange={handleOption} idPrefix={idPrefix} />

          <div className={settings.mode === "cover" ? "" : "opacity-50"}>
            <OptionControl option={focusOption} value={settings.focusY} onChange={handleOption} idPrefix={idPrefix} />
          </div>
        </div>
      </fieldset>
    </section>
  );
}
```
