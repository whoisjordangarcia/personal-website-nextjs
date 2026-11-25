"use client";

import React from "react";
import AgentConsole from "./agent/AgentConsole";
import type { AgentArticle } from "./agent/AgentTerminal";
import OpencodeConsole from "./opencode/OpencodeConsole";

export type Variant = "agent" | "opencode";
/** Shift+Tab order. */
export const VARIANTS: Variant[] = ["agent", "opencode"];
const STORAGE_KEY = "home-ui";

export function isVariant(v: unknown): v is Variant {
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
  agent,
  opencode,
  articles,
}: {
  /** What the server rendered (from ?ui=); hydration starts here. */
  initial: Variant;
  agent: React.ReactNode;
  opencode: React.ReactNode;
  /** For the interactive prompt's "ls" / "open" commands. */
  articles: AgentArticle[];
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
          <AgentConsole articles={articles} onCycle={cycle} />
        </>
      ) : (
        <>
          {opencode}
          <OpencodeConsole articles={articles} onCycle={cycle} />
        </>
      )}
    </div>
  );
}
