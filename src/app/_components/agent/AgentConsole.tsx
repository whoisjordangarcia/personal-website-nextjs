"use client";

import Link from "next/link";
import React from "react";
import AgentStatusBar from "./AgentStatusBar";
import type { AgentArticle } from "./AgentTerminal";
import {
  downgradeWarning,
  MODEL_START,
  runCommand,
  type Reply,
} from "./agent-commands";

type Turn = { id: number; input: string; replies: Reply[] | null };

const THINK_MS = 450;

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
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [value, setValue] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [model, setModel] = React.useState(MODEL_START);
  const modelRef = React.useRef(MODEL_START);
  const history = React.useRef<string[]>([]);
  const historyIdx = React.useRef(-1);
  const nextId = React.useRef(0);
  const endRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [turns]);

  const submit = React.useCallback(
    (raw: string) => {
      const input = raw.trim();
      if (!input || busy) return;
      setValue("");
      history.current.unshift(input);
      historyIdx.current = -1;

      const result = runCommand(input, articles);
      const { action } = result;
      let replies = result.replies;
      if (action?.type === "downgrade") {
        const current = modelRef.current;
        replies = [
          { kind: "warning", text: downgradeWarning(current) },
          ...replies,
        ];
        modelRef.current = Math.max(1, current - 1);
      }
      if (action?.type === "clear") {
        setTurns([]);
        return;
      }

      const id = nextId.current++;
      setTurns((t) => [...t, { id, input, replies: null }]);
      setBusy(true);
      timer.current = window.setTimeout(() => {
        setTurns((t) => t.map((x) => (x.id === id ? { ...x, replies } : x)));
        setBusy(false);
        setModel(modelRef.current);
        if (action?.type === "navigate") {
          window.location.assign(action.href);
        } else if (action?.type === "tmux") {
          onCycle();
        }
      }, THINK_MS);
    },
    [articles, busy, onCycle],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      onCycle();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const h = history.current;
      if (!h.length) return;
      e.preventDefault();
      const next =
        e.key === "ArrowUp"
          ? Math.min(historyIdx.current + 1, h.length - 1)
          : historyIdx.current - 1;
      historyIdx.current = next;
      setValue(next < 0 ? "" : (h[next] ?? ""));
    }
  };

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
        onSuggestion={submit}
        busy={busy}
        model={model}
      />
    </>
  );
}

function ReplyView({ reply }: { reply: Reply }) {
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
