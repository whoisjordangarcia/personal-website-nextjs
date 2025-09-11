"use client";

import React from "react";

export default function TmuxStatusBar() {
  const [now, setNow] = React.useState<string>(() => formatNow());
  const [prefixActive, setPrefixActive] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
  const [splitOverlay, setSplitOverlay] = React.useState<
    null | "vertical" | "horizontal"
  >(null);

  React.useEffect(() => {
    const t = setInterval(() => setNow(formatNow()), 1000);
    return () => clearInterval(t);
  }, []);

  const sessionName = "nvim";

  // Keyboard: emulate tmux prefix & a few actions
  React.useEffect(() => {
    let awaitingKey = false;
    let prefixTimer: ReturnType<typeof setTimeout> | null = null;
    const statusTimerRef = { current: null as number | null };

    function showStatus(message: string, ms = 1200) {
      setStatusMsg(message);
      if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
      statusTimerRef.current = window.setTimeout(() => setStatusMsg(null), ms);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (showHelp && e.key === "Escape") {
        setShowHelp(false);
        return;
      }

      if (!awaitingKey && e.ctrlKey && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        setPrefixActive(true);
        awaitingKey = true;
        if (prefixTimer) clearTimeout(prefixTimer);
        prefixTimer = setTimeout(() => {
          setPrefixActive(false);
          awaitingKey = false;
        }, 1500);
        return;
      }

      if (!awaitingKey) return;

      // Handle post-prefix keys
      e.preventDefault();
      const k = e.key;
      if (k === "?") {
        setShowHelp((v) => !v);
        showStatus('display panes: ?  split: % or "  new: c');
      } else if (k === "%") {
        setSplitOverlay("vertical");
        showStatus("split-window -h");
        setTimeout(() => setSplitOverlay(null), 700);
      } else if (k === '"') {
        setSplitOverlay("horizontal");
        showStatus("split-window -v");
        setTimeout(() => setSplitOverlay(null), 700);
      } else if (k.toLowerCase() === "c") {
        showStatus("new-window");
      } else {
        showStatus(`unbound key: ${k}`);
      }

      setPrefixActive(false);
      awaitingKey = false;
      if (prefixTimer) clearTimeout(prefixTimer);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (prefixTimer) clearTimeout(prefixTimer);
      if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
    };
  }, [showHelp]);

  return (
    <div className="tmux-status pointer-events-none hidden sm:block">
      {/* Split overlay lines */}
      {splitOverlay && (
        <div className="tmux-split-overlay" aria-hidden>
          {splitOverlay === "vertical" ? (
            <div className="tmux-split-vert" />
          ) : (
            <div className="tmux-split-horz" />
          )}
        </div>
      )}
      {/* Status message bubble */}
      {statusMsg && (
        <div className="tmux-status-msg" aria-live="polite">
          {statusMsg}
        </div>
      )}
      {/* Prefix indicator */}
      {prefixActive && <div className="tmux-prefix">[prefix]</div>}
      <div
        className="w-full rounded border border-[#363a4f] bg-[#1e2030]/90 px-2 py-1 text-[11px] text-[#cad3f5] shadow-sm backdrop-blur select-none"
        role="status"
        aria-label="tmux status bar"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-2 justify-self-start">
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#363a4f]"
              aria-label="Arch Linux"
              title="Arch Linux"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="#1793d1"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2 L21 20 L3 20 Z M12 9 L15 16 L9 16 Z"
                />
              </svg>
            </span>
          </div>
          <div className="flex items-center justify-self-center">
            {/* Center active segment without icon */}
            <span className="tmux-seg tmux-seg--active">{sessionName}</span>
          </div>
          <div className="flex items-center gap-2 justify-self-end text-[#a5adcb]">
            <span>{now}</span>
          </div>
        </div>
      </div>
      {/* Help panel */}
      {showHelp && (
        <div className="tmux-help" role="dialog" aria-modal="true">
          <div className="tmux-help__inner">
            <div className="tmux-help__title">tmux keys</div>
            <div className="tmux-help__row">
              <kbd>Ctrl</kbd>+<kbd>b</kbd> <span className="mx-1">then</span>{" "}
              <kbd>?</kbd> — help
            </div>
            <div className="tmux-help__row">
              <kbd>Ctrl</kbd>+<kbd>b</kbd> <span className="mx-1">then</span>{" "}
              <kbd>%</kbd> — split vertical
            </div>
            <div className="tmux-help__row">
              <kbd>Ctrl</kbd>+<kbd>b</kbd> <span className="mx-1">then</span>{" "}
              <kbd>"</kbd> — split horizontal
            </div>
            <div className="tmux-help__row">
              <kbd>Ctrl</kbd>+<kbd>b</kbd> <span className="mx-1">then</span>{" "}
              <kbd>c</kbd> — new window
            </div>
            <div className="tmux-help__hint">Press Esc to close</div>
          </div>
        </div>
      )}
      <style jsx global>{`
        .tmux-status {
          position: fixed;
          left: 0.5rem; /* align with previous credits spacing */
          right: 0.5rem;
          bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
          z-index: 50;
        }

        .tmux-prefix {
          position: absolute;
          right: 0.75rem;
          bottom: calc(3.25rem + env(safe-area-inset-bottom, 0px));
          background: #363a4f;
          color: #cad3f5;
          border: 1px solid #4b4f6b;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 11px;
        }

        .tmux-status-msg {
          position: absolute;
          left: 0.75rem;
          bottom: calc(3.25rem + env(safe-area-inset-bottom, 0px));
          background: #363a4f;
          color: #cad3f5;
          border: 1px solid #4b4f6b;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 11px;
          max-width: 60vw;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tmux-help {
          position: fixed;
          left: 0;
          right: 0;
          bottom: calc(4.5rem + env(safe-area-inset-bottom, 0px));
          display: flex;
          justify-content: center;
          pointer-events: none;
        }
        .tmux-help__inner {
          pointer-events: auto;
          background: #1e2030;
          border: 1px solid #363a4f;
          color: #cad3f5;
          font-size: 12px;
          border-radius: 6px;
          padding: 10px 12px;
          width: min(480px, 92vw);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
        }
        .tmux-help__title {
          font-weight: 600;
          margin-bottom: 6px;
          color: #f4dbd6;
        }
        .tmux-help__row {
          margin: 2px 0;
        }
        .tmux-help__hint {
          margin-top: 8px;
          color: #a5adcb;
          font-size: 11px;
        }
        kbd {
          background: #363a4f;
          padding: 1px 4px;
          border-radius: 3px;
          border: 1px solid #4b4f6b;
        }

        /* Powerline-style center segment */
        .tmux-seg {
          display: inline-flex;
          align-items: center;
          position: relative;
          padding: 2px 8px;
          border-radius: 3px;
        }
        .tmux-seg--active {
          border: 1px solid #a6e3a1; /* Catppuccin green */
          background: #a6e3a1;
          color: #1e2030;
        }

        /* Split overlays */
        .tmux-split-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }
        .tmux-split-vert {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 1px;
          background: #4b4f6b;
          opacity: 0.9;
        }
        .tmux-split-horz {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: #4b4f6b;
          opacity: 0.9;
        }

        @media (prefers-reduced-motion: reduce) {
          .tmux-split-overlay {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

function formatNow() {
  const d = new Date();
  // Example: Thu, Sep 11
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
}
