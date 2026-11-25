"use client";

import React from "react";
import AgentStatusBar from "./agent/AgentStatusBar";

export type Variant = "tmux" | "agent";
const VARIANTS: Variant[] = ["tmux", "agent"];
const STORAGE_KEY = "home-ui";

function isVariant(v: unknown): v is Variant {
  return VARIANTS.includes(v as Variant);
}

// Tiny external store: ?ui= wins over localStorage. The server snapshot
// comes from the page's searchParams, so ?ui=agent is in the HTML itself.
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot(): Variant {
  const fromUrl = new URLSearchParams(window.location.search).get("ui");
  if (isVariant(fromUrl)) return fromUrl;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isVariant(stored) ? stored : "agent";
}
function setVariant(next: Variant) {
  window.localStorage.setItem(STORAGE_KEY, next);
  const url = new URL(window.location.href);
  if (url.searchParams.has("ui")) {
    url.searchParams.delete("ui");
    window.history.replaceState(null, "", url);
  }
  listeners.forEach((l) => l());
}

/**
 * Switches the homepage between skins. Shift+Tab cycles, but only when
 * focus is on the page itself so it never hijacks keyboard navigation.
 */
export default function HomeVariant({
  initial,
  tmux,
  agent,
}: {
  /** What the server rendered (from ?ui=); hydration starts here. */
  initial: Variant;
  tmux: React.ReactNode;
  agent: React.ReactNode;
}) {
  const variant = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => initial,
  );

  const cycle = React.useCallback(() => {
    const current = getSnapshot();
    setVariant(VARIANTS[(VARIANTS.indexOf(current) + 1) % VARIANTS.length]!);
  }, []);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab" || !e.shiftKey) return;
      const active = document.activeElement;
      if (active && active !== document.body) return;
      e.preventDefault();
      cycle();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cycle]);

  return (
    <div data-variant={variant}>
      {variant === "agent" ? (
        <>
          {agent}
          <AgentStatusBar onCycle={cycle} />
        </>
      ) : (
        <>
          {tmux}
          <button
            type="button"
            onClick={cycle}
            className="fixed right-4 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 inline-flex min-h-11 cursor-pointer items-center text-xs text-[#6e738d] hover:text-[#c6a0f6] sm:hidden"
          >
            ▸▸ agent mode
          </button>
        </>
      )}
    </div>
  );
}
