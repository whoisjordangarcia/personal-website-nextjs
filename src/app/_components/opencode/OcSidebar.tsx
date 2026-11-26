import React from "react";
import { profileLinks } from "../home/profile";

/**
 * Right-hand session sidebar, after opencode's routes/session/sidebar.tsx:
 * bold session title, then Context / MCP / Todo sections, cwd in the footer.
 * Only shown on wide screens (lg+), like opencode hides it on narrow
 * terminals.
 */
export default function OcSidebar({
  model,
  turns,
}: {
  model: string;
  /** Prompts sent so far; drives the (fake) token count. */
  turns: number;
}) {
  const tokens = 41_000 + turns * 1_337;
  const percent = Math.round((tokens / 1_000_000) * 100);

  return (
    <aside
      aria-label="Session sidebar"
      className="fixed top-0 right-0 bottom-0 z-30 hidden w-[42ch] flex-col bg-(--ctp-mantle) px-[2ch] py-4 text-sm text-(--ctp-subtext0) lg:flex"
    >
      <p className="pb-4 font-bold text-(--ctp-text)">who is jordan?</p>

      <div className="flex-1 space-y-4 overflow-y-auto pr-[1ch]">
        <section>
          <h2 className="font-bold text-(--ctp-text)">Context</h2>
          <p>{tokens.toLocaleString("en-US")} tokens</p>
          <p>{percent}% used</p>
          <p>$0.00 spent</p>
        </section>

        <section>
          <h2 className="font-bold text-(--ctp-text)">MCP</h2>
          <ul>
            {profileLinks.map((l) => (
              <li key={l.label} className="flex items-center gap-[1ch]">
                <span aria-hidden className="text-(--ctp-green)">
                  •
                </span>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="term-link text-(--ctp-text)"
                >
                  {l.label}
                </a>
                <span className="text-(--ctp-overlay0)">connected</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-(--ctp-text)">Todo</h2>
          <ul>
            <li>
              <span className="text-(--ctp-green)">[✓]</span> ship articles
            </li>
            <li>
              <span className="text-(--ctp-green)">[✓]</span> add agent skins
            </li>
            <li>
              <span className="text-(--ctp-yellow)">[•]</span> write the next
              post
            </li>
          </ul>
        </section>
      </div>

      <footer className="space-y-1 pt-4 text-xs text-(--ctp-overlay0)">
        <p>~/dev/jordangarcia.me</p>
        <p>
          <span className="text-(--ctp-green)">•</span> {model}
        </p>
      </footer>
    </aside>
  );
}
