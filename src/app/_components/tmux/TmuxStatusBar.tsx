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
  const [newWindowOverlay, setNewWindowOverlay] = React.useState(false);

  React.useEffect(() => {
    const t = setInterval(() => setNow(formatNow()), 1000);
    return () => clearInterval(t);
  }, []);

  const sessionName = "1:zsh";

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

      // Only trigger prefix on Ctrl+b without other modifiers
      if (
        !awaitingKey &&
        e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey &&
        !e.metaKey &&
        (e.key === "b" || e.key === "B")
      ) {
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

      // Ignore pure modifier keys while awaiting the next key
      const k = e.key;
      if (k === "Shift" || k === "Control" || k === "Alt" || k === "Meta") {
        return;
      }

      // Handle post-prefix keys
      e.preventDefault();
      if (k === "?" || (e.code === "Slash" && e.shiftKey)) {
        setShowHelp((v) => !v);
        showStatus('display panes: ?  split: % or "  new: c');
      } else if (k === "%" || (e.code === "Digit5" && e.shiftKey)) {
        setSplitOverlay("vertical");
        showStatus("split-window -h");
        setTimeout(() => setSplitOverlay(null), 700);
      } else if (k === '"' || (e.code === "Quote" && e.shiftKey)) {
        setSplitOverlay("horizontal");
        showStatus("split-window -v");
        setTimeout(() => setSplitOverlay(null), 700);
      } else if (k.toLowerCase() === "c") {
        showStatus("new-window");
        setNewWindowOverlay(true);
        // Nudge page content to simulate window change
        document.documentElement.classList.add("tmux-newwin-shift");
        setTimeout(() => {
          setNewWindowOverlay(false);
          document.documentElement.classList.remove("tmux-newwin-shift");
        }, 650);
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
      document.documentElement.classList.remove("tmux-newwin-shift");
    };
  }, [showHelp]);

  return (
    <div
      className="tmux-status pointer-events-none fixed right-2 left-2"
      style={{ bottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
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
      {newWindowOverlay && (
        <div className="tmux-newwin-overlay" aria-hidden>
          <div className="tmux-newwin-pane" />
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
        className="w-full rounded border border-[#363a4f] bg-[#1e2030]/90 px-2 py-1 text-base text-[#cad3f5] shadow-sm backdrop-blur select-none"
        role="status"
        aria-label="tmux status bar"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-2 justify-self-start">
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-[#363a4f]"
              aria-label="Terminal"
              title="Terminal"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
                focusable="false"
              >
                <rect
                  x="3.5"
                  y="5.5"
                  width="17"
                  height="13"
                  rx="1.5"
                  fill="#24273a"
                  stroke="#4b4f6b"
                />
                <path
                  d="M7 9l3 3-3 3"
                  stroke="#a5adcb"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M12 15h5"
                  stroke="#a5adcb"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
          <div className="flex items-center justify-self-center">
            {/* Center active segment with powerline edges */}
            <span className="tmux-seg tmux-seg--active tmux-seg--powerline">
              {sessionName}
            </span>
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
        .tmux-status,
        .tmux-status kbd {
          font-family: inherit;
        }

        .tmux-prefix {
          position: absolute;
          right: 0.75rem;
          bottom: calc(2.25rem + env(safe-area-inset-bottom, 0px));
          background: #363a4f;
          color: #cad3f5;
          border: 1px solid #4b4f6b;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 1rem;
        }

        .tmux-status-msg {
          position: absolute;
          left: 0.75rem;
          bottom: calc(2.25rem + env(safe-area-inset-bottom, 0px));
          background: #363a4f;
          color: #cad3f5;
          border: 1px solid #4b4f6b;
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 1rem;
          max-width: 60vw;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tmux-help {
          position: fixed;
          left: 0;
          right: 0;
          bottom: calc(3.5rem + env(safe-area-inset-bottom, 0px));
          display: flex;
          justify-content: center;
          pointer-events: none;
        }
        .tmux-help__inner {
          pointer-events: auto;
          background: #1e2030;
          border: 1px solid #363a4f;
          color: #cad3f5;
          font-size: 1rem;
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
          font-size: 1rem;
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

        /* Powerline-style angled ends */
        .tmux-seg--powerline {
          padding-left: 10px;
          padding-right: 14px; /* extra room for right chevron */
        }
        .tmux-seg--powerline::before,
        .tmux-seg--powerline::after {
          content: "";
          position: absolute;
          top: -1px; /* align with 1px border */
          bottom: -1px;
          width: 0;
          border-top: calc(50% + 1px) solid transparent;
          border-bottom: calc(50% + 1px) solid transparent;
        }
        .tmux-seg--powerline::before {
          /* Left wedge that blends into bar background */
          left: -10px;
          border-right: 10px solid #1e2030; /* tmux bar bg */
        }
        .tmux-seg--powerline::after {
          /* Right wedge that blends into bar background */
          right: -10px;
          border-left: 10px solid #1e2030; /* tmux bar bg */
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

        /* New window slide overlay */
        .tmux-newwin-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 40;
        }
        .tmux-newwin-pane {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: 100%;
          background: linear-gradient(
            90deg,
            rgba(30, 32, 48, 0) 0%,
            rgba(30, 32, 48, 0.85) 35%,
            rgba(30, 32, 48, 0.95) 100%
          );
          border-left: 1px solid #4b4f6b;
          animation: tmuxNewWinSlide 0.65s ease-out forwards;
        }
        @keyframes tmuxNewWinSlide {
          0% {
            transform: translateX(100%);
            opacity: 0.2;
          }
          60% {
            transform: translateX(0%);
            opacity: 1;
          }
          100% {
            transform: translateX(0%);
            opacity: 0;
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
