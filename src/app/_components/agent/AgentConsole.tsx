"use client";

import Link from "next/link";
import React from "react";
import AgentStatusBar from "./AgentStatusBar";
import type { AgentArticle } from "./AgentTerminal";
import type { Reply } from "./agent-commands";
import { useAgentSession } from "./useAgentSession";

/**
 * The interactive part of the agent skin: a fake prompt that answers a
 * handful of canned commands below the server-rendered transcript.
 */
export default function AgentConsole({
  articles,
  onCycle,
  onConfig = () => undefined,
}: {
  articles: AgentArticle[];
  onCycle: () => void;
  /** Opens the theme menu (the "config" command). */
  onConfig?: () => void;
}) {
  const { turns, value, setValue, model, submit, onKeyDown, endRef } =
    useAgentSession({ articles, onCycle, onConfig });

  return (
    <>
      <div
        className="agent-transcript text-[0.95rem] leading-relaxed break-words text-(--ctp-text)"
        aria-live="polite"
      >
        {turns.map((t) => (
          <div key={t.id} className="agent-step mt-6">
            <p className="agent-user">
              <span className="text-(--ctp-overlay0)">❯ </span>
              {t.input}
            </p>
            <div className="mt-3 space-y-2">
              {t.replies === null ? (
                <p className="text-(--ctp-overlay0)">
                  <span className="agent-spark text-(--ctp-peach)">✻</span>{" "}
                  Thinking…
                </p>
              ) : (
                t.replies.map((r, i) => <ReplyView key={i} reply={r} />)
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} className="scroll-mb-52" />
      </div>

      <AgentStatusBar
        onCycle={onCycle}
        value={value}
        onChange={setValue}
        onSubmit={() => submit(value)}
        onKeyDown={onKeyDown}
        model={model}
        onConfig={onConfig}
      />
    </>
  );
}

export function ReplyView({ reply }: { reply: Reply }) {
  if (reply.kind === "warning") {
    return <p className="text-(--ctp-yellow)">{reply.text}</p>;
  }
  if (reply.kind === "text") {
    return (
      <div className="flex gap-2">
        <span aria-hidden>●</span>
        <p className="min-w-0 flex-1 whitespace-pre-line">{reply.text}</p>
      </div>
    );
  }
  return (
    <div>
      <div className="flex gap-2">
        <span aria-hidden className="text-(--ctp-green)">
          ●
        </span>
        <p>
          <span className="font-bold">{reply.tool}</span>
          <span className="text-(--ctp-subtext0)">({reply.arg})</span>
        </p>
      </div>
      <div className="flex gap-2 pl-1 text-(--ctp-subtext0)">
        <span aria-hidden className="text-(--ctp-overlay0)">
          ⎿
        </span>
        <div className="min-w-0 flex-1 space-y-0.5">
          {reply.lines.map((l, i) => (
            <p key={i}>
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
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
