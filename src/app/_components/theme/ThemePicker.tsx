"use client";

import React from "react";
import {
  getSavedTheme,
  previewTheme,
  saveTheme,
  THEMES,
  type ThemeId,
} from "./theme";

const SWATCH = ["red", "peach", "yellow", "green", "blue", "mauve"];

/**
 * /config-style theme menu: ↑/↓ (or j/k) previews live, Enter saves,
 * Esc reverts. Tapping an option saves it directly.
 */
export default function ThemePicker({ onClose }: { onClose: () => void }) {
  const [saved] = React.useState<ThemeId>(() => getSavedTheme());
  const [index, setIndex] = React.useState(() =>
    Math.max(
      0,
      THEMES.findIndex((t) => t.id === saved),
    ),
  );
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const move = (delta: number) => {
    setIndex((i) => {
      const next = (i + delta + THEMES.length) % THEMES.length;
      previewTheme(THEMES[next]!.id);
      return next;
    });
  };

  const confirm = (i: number) => {
    saveTheme(THEMES[i]!.id);
    onClose();
  };

  const cancel = () => {
    previewTheme(saved);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (k === "ArrowDown" || k === "j") move(1);
    else if (k === "ArrowUp" || k === "k") move(-1);
    else if (k === "Enter") confirm(index);
    else if (k === "Escape") cancel();
    else if (/^[1-9]$/.test(k) && Number(k) <= THEMES.length) {
      confirm(Number(k) - 1);
    } else return;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-(--ctp-crust)/60 p-4 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) cancel();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Theme"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="w-full max-w-md border border-(--ctp-surface1) bg-(--ctp-base) p-4 text-sm text-(--ctp-text) outline-none"
      >
        <p className="font-bold text-(--ctp-mauve)">Theme</p>
        <p className="mt-1 text-(--ctp-overlay0)">
          Choose the palette that looks best to you
        </p>

        <ul role="listbox" aria-label="Themes" className="mt-3 space-y-0.5">
          {THEMES.map((t, i) => {
            const active = i === index;
            return (
              <li key={t.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseEnter={() => {
                    setIndex(i);
                    previewTheme(t.id);
                  }}
                  onClick={() => confirm(i)}
                  className={`flex min-h-11 w-full cursor-pointer items-center gap-2 text-left sm:min-h-0 ${
                    active ? "text-(--ctp-mauve)" : ""
                  }`}
                >
                  <span aria-hidden className="w-[2ch]">
                    {active ? "❯" : ""}
                  </span>
                  <span>
                    {i + 1}. {t.label}
                  </span>
                  <span className="text-(--ctp-overlay0)">{t.note}</span>
                  {t.id === saved && (
                    <span className="text-(--ctp-green)" aria-label="current">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <p aria-hidden className="mt-3 tracking-[0.2em]">
          {SWATCH.map((c) => (
            <span key={c} style={{ color: `var(--ctp-${c})` }}>
              ●
            </span>
          ))}
        </p>

        <p className="mt-3 text-xs text-(--ctp-overlay0)">
          <span className="pointer-coarse:hidden">
            ↑/↓ to select · Enter to confirm · Esc to cancel
          </span>
          <span className="hidden pointer-coarse:inline">
            Tap a theme to apply it ·{" "}
            <button type="button" onClick={cancel} className="underline">
              cancel
            </button>
          </span>
        </p>
      </div>
    </div>
  );
}
