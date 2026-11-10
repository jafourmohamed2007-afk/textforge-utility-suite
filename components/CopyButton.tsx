"use client";

import { useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "error";

interface CopyButtonProps {
  text: string;
  /** Accessible description of what is copied, e.g. "CSV output". */
  subject: string;
  className?: string;
}

/** Legacy fallback for browsers / webviews without the async Clipboard API. */
function copyWithSelection(text: string): boolean {
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.top = "0";
  helper.style.left = "0";
  helper.style.opacity = "0";
  helper.style.pointerEvents = "none";
  document.body.appendChild(helper);
  helper.select();
  helper.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(helper);
  return ok;
}

export async function writeClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied or document not focused: fall through to legacy path.
    }
  }
  return copyWithSelection(text);
}

const LABELS: Record<CopyState, string> = {
  idle: "Copy",
  copied: "Copied!",
  error: "Copy failed",
};

export function CopyButton({ text, subject, className = "" }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // Reset the feedback state whenever the content changes.
  useEffect(() => {
    setState("idle");
  }, [text]);

  async function handleCopy() {
    const ok = await writeClipboard(text);
    setState(ok ? "copied" : "error");
    if (ok && typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(12);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1800);
  }

  const tone =
    state === "copied"
      ? "bg-emerald-600 text-white ring-emerald-600"
      : state === "error"
        ? "bg-rose-600 text-white ring-rose-600"
        : "bg-brand-600 text-white ring-brand-600 hover:bg-brand-700 active:bg-brand-800";

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={text.length === 0}
      aria-label={`Copy ${subject} to clipboard`}
      className={`tap-target inline-flex w-32 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold ring-1 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${tone} ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
        {state === "copied" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" strokeLinecap="round" />
          </>
        )}
      </svg>
      {/* Fixed-width button + fixed label slot = no layout shift between states. */}
      <span aria-live="polite">{LABELS[state]}</span>
    </button>
  );
}
