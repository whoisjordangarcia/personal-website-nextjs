import Link from "next/link";
import React from "react";
import { profileLinks } from "../home/profile";
import type { AgentArticle } from "../agent/AgentTerminal";
import { MODEL_START } from "../agent/agent-commands";

/**
 * OpenCode-inspired skin: a session header, user messages as left-ruled
 * blocks, tool calls as dim one-liners, and a model/mode footer per reply.
 * Server-rendered; the reveal is the same CSS stagger as the agent skin.
 */
const Step = ({
  delay,
  children,
  className,
}: {
  delay: number;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`agent-step ${className ?? ""}`}
    style={{ "--d": `${delay}ms` } as React.CSSProperties}
  >
    {children}
  </div>
);

export function OcUser({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-[#8aadf4] bg-[#1e2030] px-3 py-2 text-[#CAD3F5]">
      {children}
    </div>
  );
}

export function OcTool({
  icon,
  name,
  arg,
}: {
  icon: string;
  name: string;
  arg: string;
}) {
  return (
    <p className="text-[#6e738d]">
      <span className="text-[#8bd5ca]">{icon}</span> {name}{" "}
      <span className="text-[#a5adcb]">{arg}</span>
    </p>
  );
}

export function OcMeta({ model, ms }: { model: number; ms: string }) {
  return (
    <p className="mt-2 text-xs text-[#6e738d]">
      <span className="text-[#f5a97f]">◇</span> Fable {model} · build · {ms}
    </p>
  );
}

export default function OpencodeTranscript({
  articles,
}: {
  articles: AgentArticle[];
}) {
  return (
    <div className="text-[0.95rem] leading-relaxed break-words text-[#CAD3F5]">
      <Step delay={0}>
        <header className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 border-b border-[#363a4f] pb-2">
          <p className="font-bold">
            <span className="text-[#6e738d]">#</span> who is jordan?
          </p>
          <p className="text-xs text-[#6e738d]">~/dev/jordangarcia.me</p>
        </header>
      </Step>

      <Step delay={150}>
        <OcUser>who is jordan?</OcUser>
      </Step>

      <Step delay={500} className="mt-4 space-y-3">
        <p>
          Aussie in Miami, building at{" "}
          <a
            href="https://www.nestgenomics.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="term-link text-[#8aadf4]"
          >
            @nestgenomics
          </a>
          . Full-stack systems for genomics in TypeScript, Python, and Bash.
        </p>
        <p>
          Cares about type safety, performance, sharp tooling, TUIs, and UI that
          doesn&rsquo;t make you think. Off-screen: long runs, hybrid workouts,
          and too much coffee.
        </p>
      </Step>

      {articles.length > 0 && (
        <Step delay={900} className="mt-4">
          <OcTool icon="$" name="bash" arg="ls articles/" />
          <ul className="mt-1 space-y-0.5 border-l border-[#363a4f] pl-3">
            {articles.map((a) => (
              <li key={a.slug} className="flex flex-col sm:flex-row sm:gap-3">
                <span className="shrink-0 text-[#6e738d]">{a.date}</span>
                <Link
                  href={`/articles/${a.slug}`}
                  className="term-link text-[#f2d5cf]"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </Step>
      )}

      <Step delay={1300} className="mt-4">
        <OcTool icon="→" name="read" arg="links.md" />
        <ul className="mt-1 space-y-0.5 border-l border-[#363a4f] pl-3">
          {profileLinks.map((l) => (
            <li key={l.label}>
              <span className="inline-block w-[10ch] text-[#8bd5ca]">
                {l.label}
              </span>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="term-link text-[#f2d5cf]"
              >
                {l.text}
              </a>
            </li>
          ))}
        </ul>
      </Step>

      <Step delay={1600}>
        <OcMeta model={MODEL_START} ms="1.9s" />
      </Step>
    </div>
  );
}
