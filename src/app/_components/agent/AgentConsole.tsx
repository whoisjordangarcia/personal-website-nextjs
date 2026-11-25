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
}: {
  articles: AgentArticle[];
  onCycle: () => void;
}) {
  const { turns, value, setValue, model, submit, onKeyDown, endRef } =
    useAgentSession({ articles, onCycle });

  return (
    <>
      <div
        className="agent-transcript text-[0.95rem] leading-relaxed break-words text-[#CAD3F5]"
        aria-live="polite"
      >
        {turns.map((t) => (
          <div key={t.id} className="agent-step mt-6">
            <p className="agent-user">
              <span className="text-[#6e738d]">❯ </span>
              {t.input}
            </p>
            <div className="mt-3 space-y-2">
              {t.replies === null ? (
                <p className="text-[#6e738d]">
                  <span className="agent-spark text-[#f5a97f]">✻</span>{" "}
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
      />
    </>
  );
}

export function ReplyView({ reply }: { reply: Reply }) {
  if (reply.kind === "warning") {
    return <p className="text-[#eed49f]">{reply.text}</p>;
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
        <span aria-hidden className="text-[#a6da95]">
          ●
        </span>
        <p>
          <span className="font-bold">{reply.tool}</span>
          <span className="text-[#a5adcb]">({reply.arg})</span>
        </p>
      </div>
      <div className="flex gap-2 pl-1 text-[#a5adcb]">
        <span aria-hidden className="text-[#6e738d]">
          ⎿
        </span>
        <div className="min-w-0 flex-1 space-y-0.5">
          {reply.lines.map((l, i) => (
            <p key={i}>
              {l.label && (
                <span className="inline-block w-[10ch] text-[#8bd5ca]">
                  {l.label}
                </span>
              )}
              {l.href ? (
                l.href.startsWith("/") ? (
                  <Link href={l.href} className="term-link text-[#f2d5cf]">
                    {l.text}
                  </Link>
                ) : (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="term-link text-[#f2d5cf]"
                  >
                    {l.text}
                  </a>
                )
              ) : (
                <span className="text-[#6e738d]">{l.text}</span>
              )}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
