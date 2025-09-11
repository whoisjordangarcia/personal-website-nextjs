"use client";

import React from "react";

type Props = {
  prompt: React.ReactNode;
  promptLabel?: string;
  command: string;
  className?: string;
  startDelayMs?: number;
  minSpeedMs?: number; // minimum delay per char
  maxSpeedMs?: number; // maximum delay per char
  pauseOnChars?: string; // e.g., ",.:;" to add extra pause
  pauseMs?: number; // pause duration for pauseOnChars
  showCursorWhenDone?: boolean;
  onDone?: () => void;
};

export default function TerminalLine({
  prompt,
  promptLabel,
  command,
  className,
  startDelayMs = 250,
  minSpeedMs = 28,
  maxSpeedMs = 65,
  pauseOnChars = ",.;: ",
  pauseMs = 120,
  showCursorWhenDone = true,
  onDone,
}: Props) {
  const [index, setIndex] = React.useState(0);
  const [started, setStarted] = React.useState(false);
  const done = index >= command.length;

  React.useEffect(() => {
    const startT = setTimeout(() => setStarted(true), startDelayMs);
    return () => clearTimeout(startT);
  }, [startDelayMs]);

  React.useEffect(() => {
    if (!started || done) return;

    const ch = command[index] ?? "";
    const isPauseChar = pauseOnChars.includes(ch);
    const base = randInt(minSpeedMs, maxSpeedMs);
    const delay = base + (isPauseChar ? pauseMs : 0);

    const t = setTimeout(() => setIndex((i) => i + 1), delay);
    return () => clearTimeout(t);
  }, [
    started,
    index,
    done,
    command,
    minSpeedMs,
    maxSpeedMs,
    pauseOnChars,
    pauseMs,
  ]);

  // fire onDone once when typing finishes
  const doneCalledRef = React.useRef(false);
  React.useEffect(() => {
    if (done && !doneCalledRef.current) {
      doneCalledRef.current = true;
      onDone?.();
    }
  }, [done, onDone]);

  const visible = command.slice(0, index);

  return (
    <h1
      className={"terminal-line " + (className ?? "")}
      aria-label={(promptLabel ?? "") + command}
    >
      {prompt}
      <span>{visible}</span>
      {(showCursorWhenDone || !done) && <span className="terminal-cursor" />}
    </h1>
  );
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
