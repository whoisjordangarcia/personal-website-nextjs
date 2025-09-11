"use client";

import React from "react";
import TmuxStatusBar from "./tmux/TmuxStatusBar";
import CreditsFooter from "./CreditsFooter";

export default function BottomStack() {
  return (
    <div
      className="fixed right-2 left-2 z-40 flex flex-col gap-2 sm:right-2 sm:left-2"
      style={{ bottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}
      aria-live="polite"
    >
      <div className="pointer-events-auto">
        <TmuxStatusBar />
      </div>
      <div className="pointer-events-auto">
        <CreditsFooter />
      </div>
    </div>
  );
}
