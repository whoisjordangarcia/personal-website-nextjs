import { profileLinks } from "../home/profile";
import type { AgentArticle } from "./AgentTerminal";

/** One line of tool output; `href` makes it a link. */
export type ReplyLine = { label?: string; text: string; href?: string };

export type Reply =
  | { kind: "text"; text: string }
  | { kind: "warning"; text: string }
  | { kind: "tool"; tool: string; arg: string; lines: ReplyLine[] };

export type Action =
  | { type: "navigate"; href: string }
  | { type: "clear" }
  | { type: "tmux" }
  | { type: "downgrade" };

export type CommandResult = { replies: Reply[]; action?: Action };

export const SUGGESTIONS = ["help", "ls", "links", "whoami", "tmux"];

const HELP = [
  "I'm a static site pretending to be an agent, so I know a few tricks:",
  "whoami · ls · open <n> · links · github · email · tmux · clear",
].join("\n");

const FALLBACK =
  "I can't actually think. I'm a few hundred lines of TypeScript. Try \"help\".";

/**
 * Canned replies for the fake agent prompt. Pure, so it's easy to test;
 * the console component handles timing, rendering and side effects.
 */
export function runCommand(
  raw: string,
  articles: AgentArticle[],
): CommandResult {
  const input = raw.trim().replace(/^\//, "").toLowerCase();
  const [cmd = "", ...rest] = input.split(/\s+/);
  const arg = rest.join(" ");

  if (!input) return { replies: [] };

  switch (cmd) {
    case "help":
    case "?":
      return text(HELP);

    case "whoami":
    case "who":
    case "about":
      return text(
        "Jordan Garcia: Aussie in Miami, senior engineer at @nestgenomics building full-stack systems for genomics. Into type safety, fast software, sharp tools and TUIs.",
      );

    case "ls":
    case "articles":
    case "blog":
    case "posts":
      return {
        replies: [
          {
            kind: "tool",
            tool: "Bash",
            arg: "ls articles/",
            lines: [
              ...articles.map((a, i) => ({
                label: `${i + 1}`,
                text: a.title,
                href: `/articles/${a.slug}`,
              })),
              { text: "… open <n> to read one", href: undefined },
            ],
          },
        ],
      };

    case "open":
    case "cat":
    case "read": {
      const n = Number(arg);
      const match = Number.isInteger(n)
        ? articles[n - 1]
        : articles.find((a) => a.slug === arg.replace(/\.mdx?$/, ""));
      if (!match) return text(`No article "${arg}". Try "ls" first.`);
      return {
        replies: [{ kind: "text", text: `Opening "${match.title}"…` }],
        action: { type: "navigate", href: `/articles/${match.slug}` },
      };
    }

    case "cd":
      if (arg.replace(/\/$/, "") === "articles") {
        return {
          replies: [{ kind: "text", text: "cd articles/" }],
          action: { type: "navigate", href: "/articles" },
        };
      }
      return text(`cd: no such directory: ${arg || "~"}`);

    case "links":
    case "contact":
    case "socials":
      return linksReply(profileLinks.map((l) => l.label));

    case "email":
    case "github":
    case "linkedin":
    case "x":
    case "twitter":
    case "instagram":
      return linksReply([cmd === "twitter" ? "x" : cmd]);

    case "tmux":
    case "exit":
    case "quit":
      return {
        replies: [{ kind: "text", text: "Switching to tmux…" }],
        action: { type: "tmux" },
      };

    case "clear":
      return { replies: [], action: { type: "clear" } };

    case "sudo":
      return text("Nice try.");

    default:
      // The joke: anything off-script "fails intent detection" and the
      // console drops to a lower model, like a real agent under load.
      return { ...text(FALLBACK), action: { type: "downgrade" } };
  }
}

function text(t: string): CommandResult {
  return { replies: [{ kind: "text", text: t }] };
}

function linksReply(labels: string[]): CommandResult {
  return {
    replies: [
      {
        kind: "tool",
        tool: "Read",
        arg: "links.md",
        lines: profileLinks
          .filter((l) => labels.includes(l.label))
          .map((l) => ({ label: l.label, text: l.text, href: l.href })),
      },
    ],
  };
}

export const MODEL_START = 7;

/** The warning shown when a free-form prompt "fails intent detection". */
export function downgradeWarning(model: number): string {
  if (model <= 1) {
    return "⚠ Fable 1 failed intent detection · no lower model available. It's regex all the way down.";
  }
  return `⚠ Fable ${model} failed intent detection · switching to Fable ${model - 1} (less intelligent, equally confident)`;
}
