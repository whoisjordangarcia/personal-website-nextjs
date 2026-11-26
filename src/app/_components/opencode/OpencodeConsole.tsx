"use client";

import Link from "next/link";
import React from "react";
import type { AgentArticle } from "../agent/AgentTerminal";
import type { Reply } from "../agent/agent-commands";
import { useAgentSession } from "../agent/useAgentSession";
import OcLoader, { OcScanner } from "./OcLoader";
import OcSidebar from "./OcSidebar";
import { OcMeta, OcTool, OcUser } from "./OpencodeTranscript";

type Mode = "build" | "plan";

/** Long enough for the loader to read as work rather than a flicker. */
const OC_THINK_MS = 1100;

/** Interactive prompt + bottom bar for the OpenCode-style skin. */
export default function OpencodeConsole({
  articles,
  onCycle,
  onConfig = () => undefined,
}: {
  articles: AgentArticle[];
  onCycle: () => void;
  /** Opens the theme menu (the "config" command). */
  onConfig?: (tab?: "theme" | "font") => void;
}) {
  const { turns, value, setValue, busy, model, submit, onKeyDown, endRef } =
    useAgentSession({ articles, onCycle, onConfig, thinkMs: OC_THINK_MS });
  const [mode, setMode] = React.useState<Mode>("build");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
  }, []);

  return (
    <>
      <div
        className="text-[0.95rem] leading-relaxed break-words text-(--ctp-text)"
        aria-live="polite"
      >
        {turns.map((t) => (
          <div key={t.id} className="agent-step mt-6">
            <OcUser>{t.input}</OcUser>
            <div className="mt-3 space-y-2">
              {t.replies === null ? (
                <OcLoader verb={t.verb} />
              ) : (
                <>
                  {t.replies.map((r, i) => (
                    <OcReply key={i} reply={r} />
                  ))}
                  <OcMeta model={model} ms="0.4s" />
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} className="scroll-mb-52" />
      </div>

      <OcSidebar model={model} turns={turns.length} />

      <div className="fixed right-0 bottom-(--kb,0px) left-0 z-40 bg-(--ctp-base) px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-8 md:right-[34ch] lg:right-[42ch]">
        <form
          className="mt-2 flex items-center gap-2 border border-(--ctp-surface1) px-3 py-1.5 focus-within:border-(--ctp-blue)"
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
        >
          <span aria-hidden className="text-(--ctp-blue)">
            &gt;
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Ask the agent"
            placeholder="Ask anything… /help"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            className="min-w-0 flex-1 bg-transparent text-base text-(--ctp-text) caret-(--ctp-blue) outline-none placeholder:text-(--ctp-surface2) sm:text-[0.95rem]"
          />
        </form>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 text-xs text-(--ctp-overlay0)">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode((m) => (m === "build" ? "plan" : "build"))}
              className={`inline-flex min-h-11 cursor-pointer items-center px-1.5 font-bold text-(--ctp-base) uppercase sm:min-h-0 ${
                mode === "build" ? "bg-(--ctp-peach)" : "bg-(--ctp-blue)"
              }`}
              aria-label={`Mode: ${mode}. Tap to switch.`}
            >
              {mode}
            </button>
            {busy ? (
              <span className="flex items-center gap-2">
                <OcScanner />
                <span>esc interrupt</span>
              </span>
            ) : (
              <span>
                <span className="text-(--ctp-text)">{model}</span> · jordan
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onConfig()}
              className="inline-flex min-h-11 cursor-pointer items-center hover:text-(--ctp-text) sm:min-h-0"
            >
              <span className="pointer-coarse:hidden">ctrl+,</span>
              &nbsp;theme
            </button>
            <button
              type="button"
              onClick={onCycle}
              className="inline-flex min-h-11 cursor-pointer items-center hover:text-(--ctp-text) sm:min-h-0"
            >
              <span className="pointer-coarse:hidden">shift+tab</span>
              <span className="hidden pointer-coarse:inline">tap</span>
              &nbsp;switch skin
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function OcReply({ reply }: { reply: Reply }) {
  if (reply.kind === "warning") {
    return <p className="text-(--ctp-yellow)">{reply.text}</p>;
  }
  if (reply.kind === "text") {
    return <p className="whitespace-pre-line">{reply.text}</p>;
  }
  return (
    <div>
      <OcTool
        icon={reply.tool === "Bash" ? "$" : "→"}
        name={reply.tool.toLowerCase()}
        arg={reply.arg}
      />
      <ul className="mt-1 space-y-0.5 border-l border-(--ctp-surface0) pl-3 text-(--ctp-subtext0)">
        {reply.lines.map((l, i) => (
          <li key={i}>
            {l.label && (
              <span className="inline-block w-[10ch] text-(--ctp-teal)">
                {l.label}
              </span>
            )}
            {l.href ? (
              l.href.startsWith("/") ? (
                <Link
                  href={l.href}
                  className="term-link text-(--ctp-rosewater)"
                >
                  {l.text}
                </Link>
              ) : (
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="term-link text-(--ctp-rosewater)"
                >
                  {l.text}
                </a>
              )
            ) : (
              <span className="text-(--ctp-overlay0)">{l.text}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
