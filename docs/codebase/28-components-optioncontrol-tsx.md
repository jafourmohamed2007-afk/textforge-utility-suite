# 28. `components/OptionControl.tsx`

Touch-friendly select / range / toggle controls.

```tsx
"use client";

import type { OptionValue, ToolOption } from "@/lib/types";

interface OptionControlProps {
  option: ToolOption;
  value: OptionValue;
  onChange: (id: string, value: OptionValue) => void;
  idPrefix: string;
}

/** Renders a single registry option as a 48px+ touch-friendly control. */
export function OptionControl({ option, value, onChange, idPrefix }: OptionControlProps) {
  const controlId = `${idPrefix}-${option.id}`;
  const hintId = option.hint ? `${controlId}-hint` : undefined;

  if (option.type === "toggle") {
    const checked = value === true;
    return (
      <div className="flex flex-col">
        <button
          type="button"
          role="switch"
          id={controlId}
          aria-checked={checked}
          aria-describedby={hintId}
          onClick={() => onChange(option.id, !checked)}
          className="tap-target flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 text-left text-sm font-medium text-ink transition-colors hover:border-brand-500"
        >
          <span>{option.label}</span>
          <span
            aria-hidden="true"
            className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors duration-150 ${checked ? "bg-brand-600" : "bg-muted-track"}`}
          >
            <span
              className={`absolute top-0.5 size-6 rounded-full bg-white shadow transition-transform duration-150 ${checked ? "translate-x-[1.375rem]" : "translate-x-0.5"}`}
            />
          </span>
        </button>
        {option.hint ? (
          <p id={hintId} className="mt-1 px-1 text-xs text-ink-soft">
            {option.hint}
          </p>
        ) : null}
      </div>
    );
  }

  if (option.type === "range") {
    const numeric = typeof value === "number" ? value : option.defaultValue;
    return (
      <div className="flex flex-col">
        <div className="flex items-baseline justify-between px-1">
          <label htmlFor={controlId} className="text-sm font-medium text-ink">
            {option.label}
          </label>
          <output htmlFor={controlId} className="min-w-16 text-right font-mono text-sm tabular-nums text-brand-700 dark:text-brand-300">
            {numeric}
            {option.unit ? ` ${option.unit}` : ""}
          </output>
        </div>
        <input
          id={controlId}
          type="range"
          min={option.min}
          max={option.max}
          step={option.step}
          value={numeric}
          aria-describedby={hintId}
          onChange={(event) => onChange(option.id, Number(event.target.value))}
          className="range-input h-12 w-full cursor-pointer"
        />
        {option.hint ? (
          <p id={hintId} className="px-1 text-xs text-ink-soft">
            {option.hint}
          </p>
        ) : null}
      </div>
    );
  }

  const selected = typeof value === "string" ? value : option.defaultValue;
  return (
    <div className="flex flex-col">
      <label htmlFor={controlId} className="mb-1 px-1 text-sm font-medium text-ink">
        {option.label}
      </label>
      <div className="relative">
        <select
          id={controlId}
          value={selected}
          aria-describedby={hintId}
          onChange={(event) => onChange(option.id, event.target.value)}
          className="tap-target w-full appearance-none rounded-xl border border-line bg-surface pl-3 pr-10 text-base text-ink transition-colors hover:border-brand-500 focus:border-brand-500"
        >
          {option.choices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-ink-soft"
          fill="currentColor"
        >
          <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {option.hint ? (
        <p id={hintId} className="mt-1 px-1 text-xs text-ink-soft">
          {option.hint}
        </p>
      ) : null}
    </div>
  );
}
```
