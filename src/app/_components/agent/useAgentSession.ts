"use client";

import React from "react";
import type { AgentArticle } from "./AgentTerminal";
import {
  downgradeWarning,
  MODEL_START,
  runCommand,
  type Reply,
} from "./agent-commands";

export type Turn = { id: number; input: string; replies: Reply[] | null };

const DEFAULT_THINK_MS = 450;

/**
 * State for the fake agent prompt, shared by every agent-style skin:
 * turns, input value + history, the "thinking" delay, and the joke model
 * downgrade. Skins only decide how it looks.
 */
export function useAgentSession({
  articles,
  onCycle,
  onConfig,
  thinkMs = DEFAULT_THINK_MS,
}: {
  articles: AgentArticle[];
  /** Shift+Tab inside the prompt, and the "skin" command. */
  onCycle: () => void;
  /** The "config" / "theme" commands. */
  onConfig: (tab?: "theme" | "font") => void;
  /** How long the fake "thinking" lasts before a reply appears. */
  thinkMs?: number;
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
        } else if (action?.type === "cycle") {
          onCycle();
        } else if (action?.type === "config") {
          onConfig(action.tab);
        }
      }, thinkMs);
    },
    [articles, busy, onCycle, onConfig, thinkMs],
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

  return { turns, value, setValue, busy, model, submit, onKeyDown, endRef };
}
