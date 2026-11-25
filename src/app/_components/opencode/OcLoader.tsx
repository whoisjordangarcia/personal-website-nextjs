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

/** Pending-reply row: scanner + "working". */
export default function OcLoader() {
  return (
    <p className="flex items-center gap-3 text-(--ctp-overlay0)" role="status">
      <OcScanner />
      <span>working</span>
    </p>
  );
}
