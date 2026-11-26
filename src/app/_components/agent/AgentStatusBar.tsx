"use client";

import React from "react";

/** Fixed bottom chrome for the agent skin: input box, status line, mode hint. */
export default function AgentStatusBar({
  onCycle,
  value,
  onChange,
  onSubmit,
  onKeyDown,
  model,
  onConfig,
}: {
  onCycle: () => void;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Current (fake) model version; drops when intent detection "fails". */
  model: string;
  /** Opens the theme menu. */
  onConfig: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus the prompt on desktop only: on touch it would pop the keyboard.
  React.useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
  }, []);

  const time = React.useSyncExternalStore(
    subscribeClock,
    formatTime,
    () => null,
  );

  return (
    <div className="agent-chrome fixed right-0 bottom-0 left-0 z-40 bg-(--ctp-base) px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-8">
      <form
        className="mt-2 flex items-center gap-2 border-y border-(--ctp-surface1) py-1.5 text-(--ctp-text)"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <span aria-hidden className="text-(--ctp-overlay0)">
          ❯
        </span>
        <input
          id="agent-prompt"
          aria-label="Ask the agent"
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder='Try "help"'
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          className="min-w-0 flex-1 bg-transparent text-base text-(--ctp-text) caret-(--ctp-rosewater) outline-none placeholder:text-(--ctp-surface2) sm:text-[0.95rem]"
        />
      </form>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-(--ctp-overlay0)">
        <span className="text-(--ctp-mauve)">{model}</span>
        <span>│</span>
        <span>$0.00</span>
        <span>│</span>
        <ContextMeter used={0.04} tokens="41k" />
        <span>│</span>
        <span className="hidden sm:inline">~/dev/jordangarcia.me</span>
        <span className="hidden sm:inline">│</span>
        <span className="text-(--ctp-mauve)">main</span>
        <span>│</span>
        <span>Palm Beach{time ? ` ${time}` : ""}</span>
      </div>
      <div className="mt-0.5 flex flex-wrap items-center gap-x-4">
        <button
          type="button"
          onClick={onCycle}
          className="inline-flex min-h-11 cursor-pointer items-center gap-1 text-xs text-(--ctp-mauve) hover:text-(--ctp-text) sm:min-h-0"
        >
          ▸▸ agent mode on{" "}
          <span className="text-(--ctp-overlay0) pointer-coarse:hidden">
            (shift+tab to cycle)
          </span>
          <span className="hidden text-(--ctp-overlay0) pointer-coarse:inline">
            (tap to cycle)
          </span>
        </button>
        <button
          type="button"
          onClick={() => onConfig()}
          className="inline-flex min-h-11 cursor-pointer items-center gap-1 text-xs text-(--ctp-overlay0) hover:text-(--ctp-text) sm:min-h-0"
        >
          ⚙ /config <span className="pointer-coarse:hidden">(⌘,)</span>
          <span className="hidden pointer-coarse:inline">theme</span>
        </button>
      </div>
    </div>
  );
}

function subscribeClock(cb: () => void) {
  const t = setInterval(cb, 15_000);
  return () => clearInterval(t);
}

function formatTime() {
  return new Date().toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Context-window gauge: a 10-cell bar, then percent and token count. */
function ContextMeter({ used, tokens }: { used: number; tokens: string }) {
  const cells = 10;
  const filled = Math.max(1, Math.round(used * cells));
  return (
    <span
      className="inline-flex items-center gap-1.5"
      aria-label={`context window ${Math.round(used * 100)}% used`}
    >
      <span aria-hidden className="tracking-[-0.1em]">
        <span className="text-(--ctp-mauve)">{"━".repeat(filled)}</span>
        <span className="text-(--ctp-surface1)">
          {"━".repeat(cells - filled)}
        </span>
      </span>
      <span>
        {Math.round(used * 100)}% ({tokens})
      </span>
    </span>
  );
}
