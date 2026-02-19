"use client";

import React from "react";

// Simulated window list (static, hoisted to avoid re-creation on each render)
const windows = [
  { id: 0, name: "zsh" },
  { id: 1, name: "vim" },
  { id: 2, name: "node" },
];

export default function TmuxStatusBar() {
  const [now, setNow] = React.useState<string>(() => formatNow());
  const [prefixActive, setPrefixActive] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(false);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
  const [splitOverlay, setSplitOverlay] = React.useState<
    null | "vertical" | "horizontal"
  >(null);
  const [newWindowOverlay, setNewWindowOverlay] = React.useState(false);
  const [activeWindowIndex, setActiveWindowIndex] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setNow(formatNow()), 1000);
    return () => clearInterval(t);
  }, []);

  const hostname = "lucky-falcon";

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
      } else if (k.toLowerCase() === "n") {
        // Next window
        setActiveWindowIndex((prev) => (prev + 1) % windows.length);
        showStatus("next-window");
      } else if (k.toLowerCase() === "p") {
        // Previous window
        setActiveWindowIndex(
          (prev) => (prev - 1 + windows.length) % windows.length,
        );
        showStatus("previous-window");
      } else if (/^[0-9]$/.test(k)) {
        // Select window by number
        const idx = parseInt(k, 10);
        if (idx < windows.length) {
          setActiveWindowIndex(idx);
          showStatus(`select-window -t ${idx}`);
        } else {
          showStatus(`window ${idx} not found`);
        }
      } else if (k.toLowerCase() === "d") {
        showStatus("detached (simulated)");
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
      className="tmux-status pointer-events-none fixed right-2 left-2 hidden sm:block"
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
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
          {/* Left: Powerline hostname/session */}
          <div className="flex items-center justify-self-start">
            <span className="tmux-powerline-left">
              <span className="tmux-powerline-left__session">[0]</span>
              <span className="tmux-powerline-left__host">{hostname}</span>
              <span className="tmux-powerline-left__arrow" aria-hidden="true" />
            </span>
          </div>
          {/* Center: Window list */}
          <div className="flex items-center gap-1 justify-self-center">
            {windows.map((win, idx) => (
              <span
                key={win.id}
                className={`tmux-win ${idx === activeWindowIndex ? "tmux-win--active" : ""}`}
              >
                {win.id}:{win.name}
                {idx === activeWindowIndex && "*"}
              </span>
            ))}
          </div>
          {/* Right: Status indicators + date */}
          <div className="flex items-center gap-3 justify-self-end text-[#a5adcb]">
            {/* Battery indicator */}
            <span
              className="tmux-indicator"
              title="Battery"
              aria-label="Battery 85%"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
                fill="none"
              >
                <rect
                  x="2"
                  y="7"
                  width="18"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M20 10v4h2v-4h-2z" fill="currentColor" />
                <rect x="4" y="9" width="12" height="6" rx="1" fill="#a6e3a1" />
              </svg>
              <span className="tmux-indicator__text">85%</span>
            </span>
            {/* WiFi indicator */}
            <span
              className="tmux-indicator"
              title="WiFi"
              aria-label="WiFi connected"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
                fill="none"
              >
                <path
                  d="M12 18c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z"
                  fill="currentColor"
                />
                <path
                  d="M12 14c1.7 0 3.2.7 4.3 1.8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 14c-1.7 0-3.2.7-4.3 1.8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 10c2.8 0 5.3 1.1 7.1 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 10c-2.8 0-5.3 1.1-7.1 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 6c3.9 0 7.4 1.6 10 4.2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 6c-3.9 0-7.4 1.6-10 4.2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {/* Load average */}
            <span
              className="tmux-indicator"
              title="Load average"
              aria-label="Load 0.42"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
                fill="none"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 14l3-4 3 2 4-5"
                  stroke="#8bd5ca"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="tmux-indicator__text">0.42</span>
            </span>
            <span className="tmux-date">{now}</span>
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
            <div className="tmux-help__row">
              <kbd>Ctrl</kbd>+<kbd>b</kbd> <span className="mx-1">then</span>{" "}
              <kbd>n</kbd> / <kbd>p</kbd> — next/prev window
            </div>
            <div className="tmux-help__row">
              <kbd>Ctrl</kbd>+<kbd>b</kbd> <span className="mx-1">then</span>{" "}
              <kbd>0-9</kbd> — select window
            </div>
            <div className="tmux-help__row">
              <kbd>Ctrl</kbd>+<kbd>b</kbd> <span className="mx-1">then</span>{" "}
              <kbd>d</kbd> — detach
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

        /* Powerline-style left hostname/session segment */
        .tmux-powerline-left {
          display: inline-flex;
          align-items: center;
          position: relative;
          height: 22px;
        }
        .tmux-powerline-left__session {
          background: #8bd5ca; /* Catppuccin teal */
          color: #1e2030;
          padding: 2px 8px;
          font-weight: 600;
          font-size: 0.85rem;
        }
        .tmux-powerline-left__host {
          background: #363a4f;
          color: #cad3f5;
          padding: 2px 12px 2px 8px;
          font-size: 0.85rem;
        }
        .tmux-powerline-left__arrow {
          position: absolute;
          right: -8px;
          top: 0;
          bottom: 0;
          width: 0;
          border-top: 11px solid transparent;
          border-bottom: 11px solid transparent;
          border-left: 8px solid #363a4f;
        }

        /* Window list items */
        .tmux-win {
          padding: 1px 6px;
          font-size: 0.9rem;
          color: #a5adcb;
          border-radius: 2px;
          transition: background 0.15s ease;
        }
        .tmux-win--active {
          background: #a6e3a1;
          color: #1e2030;
          font-weight: 500;
        }

        /* Status indicators */
        .tmux-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
        }
        .tmux-indicator__text {
          font-variant-numeric: tabular-nums;
        }
        .tmux-date {
          font-size: 0.9rem;
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
