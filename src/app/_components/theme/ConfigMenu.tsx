"use client";

import React from "react";
import {
  FONTS,
  getSavedFont,
  previewFont,
  saveFont,
  type FontId,
} from "./font";
import {
  getSavedTheme,
  previewTheme,
  saveTheme,
  THEMES,
  type ThemeId,
} from "./theme";

export type ConfigTab = "theme" | "font";

type Section = {
  title: string;
  blurb: string;
  options: { id: string; label: string; note: string }[];
  saved: string;
  preview: (id: string) => void;
  save: (id: string) => void;
};

const SWATCH = ["red", "peach", "yellow", "green", "blue", "mauve"];

/**
 * /config-style settings menu with Theme and Font tabs.
 * ↑/↓ (or j/k) previews live, ←/→ or Tab switches tabs, Enter saves,
 * Esc reverts both settings. Taps apply directly on touch screens.
 */
export default function ConfigMenu({
  initialTab = "theme",
  onClose,
}: {
  initialTab?: ConfigTab;
  onClose: () => void;
}) {
  const [saved] = React.useState(() => ({
    theme: getSavedTheme(),
    font: getSavedFont(),
  }));
  const [tab, setTab] = React.useState<ConfigTab>(initialTab);
  const sections: Record<ConfigTab, Section> = {
    theme: {
      title: "Theme",
      blurb: "Choose the palette that looks best to you",
      options: THEMES,
      saved: saved.theme,
      preview: (id) => previewTheme(id as ThemeId),
      save: (id) => saveTheme(id as ThemeId),
    },
    font: {
      title: "Font",
      blurb: "Choose the monospace font for the whole site",
      options: FONTS,
      saved: saved.font,
      preview: (id) => previewFont(id as FontId),
      save: (id) => saveFont(id as FontId),
    },
  };
  const section = sections[tab];
  const startIndex = (t: ConfigTab) =>
    Math.max(
      0,
      sections[t].options.findIndex((o) => o.id === sections[t].saved),
    );
  const [index, setIndex] = React.useState(() => startIndex(initialTab));
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const switchTab = (next: ConfigTab) => {
    // Leaving a tab drops its unsaved preview.
    section.preview(section.saved);
    setTab(next);
    setIndex(startIndex(next));
  };

  const move = (delta: number) => {
    const n = section.options.length;
    const next = (index + delta + n) % n;
    setIndex(next);
    section.preview(section.options[next]!.id);
  };

  const confirm = (i: number) => {
    section.save(section.options[i]!.id);
    onClose();
  };

  const cancel = () => {
    previewTheme(saved.theme);
    previewFont(saved.font);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (k === "ArrowDown" || k === "j") move(1);
    else if (k === "ArrowUp" || k === "k") move(-1);
    else if (k === "ArrowRight" || k === "ArrowLeft" || k === "Tab") {
      switchTab(tab === "theme" ? "font" : "theme");
    } else if (k === "Enter") confirm(index);
    else if (k === "Escape") cancel();
    else if (/^[1-9]$/.test(k) && Number(k) <= section.options.length) {
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
        aria-label="Config"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="w-full max-w-md border border-(--ctp-surface1) bg-(--ctp-base) p-4 text-sm text-(--ctp-text) outline-none"
      >
        <div role="tablist" aria-label="Settings" className="flex gap-4">
          {(Object.keys(sections) as ConfigTab[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={t === tab}
              onClick={() => t !== tab && switchTab(t)}
              className={`min-h-11 cursor-pointer font-bold sm:min-h-0 ${
                t === tab
                  ? "text-(--ctp-mauve) underline underline-offset-4"
                  : "text-(--ctp-overlay0) hover:text-(--ctp-text)"
              }`}
            >
              {sections[t].title}
            </button>
          ))}
        </div>
        <p className="mt-1 text-(--ctp-overlay0)">{section.blurb}</p>

        <ul
          role="listbox"
          aria-label={section.title}
          className="mt-3 space-y-0.5"
        >
          {section.options.map((o, i) => {
            const active = i === index;
            return (
              <li key={o.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseEnter={() => {
                    setIndex(i);
                    section.preview(o.id);
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
                    {i + 1}. {o.label}
                  </span>
                  <span className="text-(--ctp-overlay0)">{o.note}</span>
                  {o.id === section.saved && (
                    <span className="text-(--ctp-green)" aria-label="current">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {tab === "theme" ? (
          <p aria-hidden className="mt-3 tracking-[0.2em]">
            {SWATCH.map((c) => (
              <span key={c} style={{ color: `var(--ctp-${c})` }}>
                ●
              </span>
            ))}
          </p>
        ) : (
          <p aria-hidden className="mt-3 text-(--ctp-subtext0)">
            {"const ok = (0O1lI) => x !== y; // {}[]"}
          </p>
        )}

        <p className="mt-3 text-xs text-(--ctp-overlay0)">
          <span className="pointer-coarse:hidden">
            ↑/↓ select · ←/→ tab · Enter confirm · Esc cancel
          </span>
          <span className="hidden pointer-coarse:inline">
            Tap to apply ·{" "}
            <button type="button" onClick={cancel} className="underline">
              cancel
            </button>
          </span>
        </p>
      </div>
    </div>
  );
}
