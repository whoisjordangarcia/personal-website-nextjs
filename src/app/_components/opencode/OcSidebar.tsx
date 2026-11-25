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
  model: number;
  /** Prompts sent so far; drives the (fake) token count. */
  turns: number;
}) {
  const tokens = 41_000 + turns * 1_337;
  const percent = Math.round((tokens / 1_000_000) * 100);

  return (
    <aside
      aria-label="Session sidebar"
      className="fixed top-0 right-0 bottom-0 z-30 hidden w-[42ch] flex-col bg-[#1e2030] px-[2ch] py-4 text-sm text-[#a5adcb] lg:flex"
    >
      <p className="pb-4 font-bold text-[#CAD3F5]">who is jordan?</p>

      <div className="flex-1 space-y-4 overflow-y-auto pr-[1ch]">
        <section>
          <h2 className="font-bold text-[#CAD3F5]">Context</h2>
          <p>{tokens.toLocaleString("en-US")} tokens</p>
          <p>{percent}% used</p>
          <p>$0.00 spent</p>
        </section>

        <section>
          <h2 className="font-bold text-[#CAD3F5]">MCP</h2>
          <ul>
            {profileLinks.map((l) => (
              <li key={l.label} className="flex items-center gap-[1ch]">
                <span aria-hidden className="text-[#a6da95]">
                  •
                </span>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="term-link text-[#CAD3F5]"
                >
                  {l.label}
                </a>
                <span className="text-[#6e738d]">connected</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-[#CAD3F5]">Todo</h2>
          <ul>
            <li>
              <span className="text-[#a6da95]">[✓]</span> ship articles
            </li>
            <li>
              <span className="text-[#a6da95]">[✓]</span> add agent skins
            </li>
            <li>
              <span className="text-[#eed49f]">[•]</span> write the next post
            </li>
          </ul>
        </section>
      </div>

      <footer className="space-y-1 pt-4 text-xs text-[#6e738d]">
        <p>~/dev/jordangarcia.me</p>
        <p>
          <span className="text-[#a6da95]">•</span> Fable {model}
        </p>
      </footer>
    </aside>
  );
}
