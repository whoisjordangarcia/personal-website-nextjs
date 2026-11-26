"use client";

import React from "react";

/**
 * iOS Safari keeps position:fixed; bottom:0 pinned to the *layout*
 * viewport, so the on-screen keyboard covers fixed prompt bars. This
 * tracks how much of the bottom the keyboard hides (via visualViewport)
 * and exposes it as --kb on <html>; bottom bars use bottom: var(--kb).
 */
export function keyboardInset(
  innerHeight: number,
  vv: { height: number; offsetTop: number },
): number {
  return Math.max(0, Math.round(innerHeight - vv.height - vv.offsetTop));
}

export function useKeyboardInset() {
  React.useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const root = document.documentElement;
    const update = () => {
      root.style.setProperty(
        "--kb",
        `${keyboardInset(window.innerHeight, vv)}px`,
      );
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      root.style.removeProperty("--kb");
    };
  }, []);
}
