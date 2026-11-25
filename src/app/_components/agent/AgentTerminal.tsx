import Link from "next/link";
import React from "react";
import { profileLinks } from "../home/profile";

export type AgentArticle = { title: string; slug: string; date: string };

/**
 * Agent-transcript skin for the homepage. Everything is rendered on the
 * server (crawlers see the full bio); the "streaming" feel is pure CSS via
 * staggered animation delays on .agent-step.
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

const UserTurn = ({ delay, text }: { delay: number; text: string }) => (
  <Step delay={delay} className="mt-6 first:mt-0">
    <p className="agent-user">
      <span className="text-(--ctp-overlay0)">❯ </span>
      {text}
    </p>
  </Step>
);

const Bullet = ({
  color = "var(--ctp-text)",
  children,
}: {
  color?: string;
  children: React.ReactNode;
}) => (
  <div className="flex gap-2">
    <span aria-hidden style={{ color }}>
      ●
    </span>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);

const ToolResult = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-2 pl-1 text-(--ctp-subtext0)">
    <span aria-hidden className="text-(--ctp-overlay0)">
      ⎿
    </span>
    <div className="min-w-0 flex-1 space-y-0.5">{children}</div>
  </div>
);

export default function AgentTerminal({
  articles,
}: {
  articles: AgentArticle[];
}) {
  return (
    <div className="agent-transcript text-[0.95rem] leading-relaxed break-words text-(--ctp-text)">
      <UserTurn delay={0} text="who is jordan?" />

      <Step delay={450} className="mt-4">
        <Bullet>
          <p>
            Aussie in Miami, building at{" "}
            <a
              href="https://www.nestgenomics.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="term-link text-(--ctp-blue)"
            >
              @nestgenomics
            </a>
            . Full-stack systems for genomics in{" "}
            <code className="text-(--ctp-blue)">TypeScript</code>,{" "}
            <code className="text-(--ctp-blue)">Python</code>, and{" "}
            <code className="text-(--ctp-blue)">Bash</code>.
          </p>
          <p className="mt-3">
            <strong>Cares about:</strong> type safety, performance, sharp
            tooling, TUIs, and UI that doesn&rsquo;t make you think.
          </p>
          <p className="mt-3">
            <strong>Off-screen:</strong> long runs, hybrid workouts, and too
            much coffee.
          </p>
        </Bullet>
      </Step>

      {articles.length > 0 && (
        <>
          <Step delay={900} className="mt-4">
            <Bullet color="var(--ctp-green)">
              <span className="font-bold">Bash</span>
              <span className="text-(--ctp-subtext0)">
                (ls articles/ | head -3)
              </span>
            </Bullet>
          </Step>
          <Step delay={1100}>
            <ToolResult>
              {articles.map((a) => (
                <p key={a.slug} className="flex flex-col sm:flex-row sm:gap-3">
                  <span className="shrink-0 text-(--ctp-overlay0)">
                    {a.date}
                  </span>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="term-link text-(--ctp-rosewater)"
                  >
                    {a.title}
                  </Link>
                </p>
              ))}
              <p>
                <Link
                  href="/articles"
                  className="term-link text-(--ctp-overlay0)"
                >
                  … all articles
                </Link>
              </p>
            </ToolResult>
          </Step>
        </>
      )}

      <Step delay={1400} className="mt-4">
        <Bullet color="var(--ctp-green)">
          <span className="font-bold">Read</span>
          <span className="text-(--ctp-subtext0)">(links.md)</span>
        </Bullet>
      </Step>
      <Step delay={1600}>
        <ToolResult>
          {profileLinks.map((l) => (
            <p key={l.label}>
              <span className="inline-block w-[10ch] text-(--ctp-teal)">
                {l.label}
              </span>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="term-link text-(--ctp-rosewater)"
              >
                {l.text}
              </a>
            </p>
          ))}
        </ToolResult>
      </Step>

      <Step delay={1900} className="mt-6">
        <p className="text-(--ctp-overlay0)">
          <span className="agent-spark text-(--ctp-peach)">✻</span> Brewed for
          1.9s · Neovim, Next.js, Tailwind, Vercel, Catppuccin, Ioskeley Mono
        </p>
      </Step>
    </div>
  );
}
