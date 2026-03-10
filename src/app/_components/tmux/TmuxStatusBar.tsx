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

      const k = e.key;
      if (k === "Shift" || k === "Control" || k === "Alt" || k === "Meta") {
        return;
      }

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
        document.documentElement.classList.add("tmux-newwin-shift");
        setTimeout(() => {
          setNewWindowOverlay(false);
          document.documentElement.classList.remove("tmux-newwin-shift");
        }, 650);
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
    <div className="tmux-status pointer-events-none fixed bottom-0 left-0 right-0 hidden sm:block">
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
      {statusMsg && (
        <div className="tmux-status-msg" aria-live="polite">
          {statusMsg}
        </div>
      )}
      {prefixActive && <div className="tmux-prefix">[prefix]</div>}
      <div className="tmux-bar" role="status" aria-label="tmux status bar">
        <div className="tmux-bar__left">
          <span className="tmux-seg tmux-seg--session">[0]</span>
          <span className="tmux-seg tmux-seg--active">0:zsh*</span>
        </div>
        <div className="tmux-bar__right">
          <span className="tmux-seg tmux-seg--dim">{now}</span>
        </div>
      </div>
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
              <kbd>&quot;</kbd> — split horizontal
            </div>
            <div className="tmux-help__row">
              <kbd>Ctrl</kbd>+<kbd>b</kbd> <span className="mx-1">then</span>{" "}
              <kbd>c</kbd> — new window
            </div>
            <div className="tmux-help__row">
              <kbd>Ctrl</kbd>+<kbd>b</kbd> <span className="mx-1">then</span>{" "}
              <kbd>d</kbd> — detach
            </div>
            <div className="tmux-help__hint">Press Esc to close</div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatNow() {
  const d = new Date();
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
}
