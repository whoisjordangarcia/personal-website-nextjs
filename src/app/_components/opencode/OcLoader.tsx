"use client";

import React from "react";
import { scannerFrame, scannerLength } from "./scanner";

const FRAME_MS = 40;

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** opencode's knight-rider scanner, drawn as text cells. */
export function OcScanner({ color = "var(--ctp-peach)" }: { color?: string }) {
  const reduced = usePrefersReducedMotion();
  const [frame, setFrame] = React.useState(0);

  React.useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(
      () => setFrame((f) => (f + 1) % scannerLength()),
      FRAME_MS,
    );
    return () => window.clearInterval(t);
  }, [reduced]);

  return (
    <span aria-hidden className="inline-flex tracking-[0.15em]">
      {scannerFrame(reduced ? 0 : frame).map((c, i) => (
        <span
          key={i}
          style={{
            color: `color-mix(in srgb, ${color} ${Math.round(c.alpha * 100)}%, transparent)`,
          }}
        >
          {c.glyph}
        </span>
      ))}
    </span>
  );
}

/** Seconds since mount, ticking every 100ms (frozen under reduced motion). */
function useElapsed(reduced: boolean) {
  const [elapsed, setElapsed] = React.useState(0);
  React.useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    const t = window.setInterval(
      () => setElapsed((performance.now() - start) / 1000),
      100,
    );
    return () => window.clearInterval(t);
  }, [reduced]);
  return elapsed;
}

/**
 * Pending-reply row: a peach-ruled panel with the scanner, a shimmering
 * fun verb, a live timer and the interrupt hint.
 */
export default function OcLoader({ verb = "Working" }: { verb?: string }) {
  const reduced = usePrefersReducedMotion();
  const elapsed = useElapsed(reduced);

  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-x-3 gap-y-1 border-l-2 border-(--ctp-peach) bg-(--ctp-mantle) px-3 py-2"
    >
      <span className="text-base">
        <OcScanner />
      </span>
      <span className="oc-shimmer font-bold">{verb}…</span>
      <span className="text-xs text-(--ctp-overlay0) tabular-nums">
        {elapsed.toFixed(1)}s · esc interrupt
      </span>
    </div>
  );
}
