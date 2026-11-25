import { describe, it, expect } from "vitest";
import { downgradeWarning, runCommand } from "./agent-commands";

const articles = [
  { title: "First Post", slug: "first-post", date: "2026-06-01" },
  { title: "Second Post", slug: "second-post", date: "2026-05-01" },
];

describe("runCommand", () => {
  it("ignores empty input", () => {
    expect(runCommand("   ", articles)).toEqual({ replies: [] });
  });

  it("lists articles with links, numbered from 1", () => {
    const { replies } = runCommand("ls", articles);
    expect(replies[0]).toMatchObject({ kind: "tool", tool: "Bash" });
    const lines = replies[0]?.kind === "tool" ? replies[0].lines : [];
    expect(lines[0]).toEqual({
      label: "1",
      text: "First Post",
      href: "/articles/first-post",
    });
  });

  it("opens an article by number or slug", () => {
    expect(runCommand("open 2", articles).action).toEqual({
      type: "navigate",
      href: "/articles/second-post",
    });
    expect(runCommand("cat first-post.mdx", articles).action).toEqual({
      type: "navigate",
      href: "/articles/first-post",
    });
  });

  it("explains a missing article instead of navigating", () => {
    const result = runCommand("open 9", articles);
    expect(result.action).toBeUndefined();
    expect(result.replies[0]).toMatchObject({ kind: "text" });
  });

  it("accepts slash commands and any casing", () => {
    expect(runCommand("/HELP", articles).replies[0]).toMatchObject({
      kind: "text",
    });
    expect(runCommand("/clear", articles).action).toEqual({ type: "clear" });
  });

  it("filters links to a single profile", () => {
    const { replies } = runCommand("github", articles);
    const lines = replies[0]?.kind === "tool" ? replies[0].lines : [];
    expect(lines).toHaveLength(1);
    expect(lines[0]?.href).toBe("https://github.com/whoisjordangarcia");
  });

  it("opens the theme menu on config/theme/settings", () => {
    for (const c of ["config", "/theme", "settings"]) {
      expect(runCommand(c, articles).action).toEqual({ type: "config" });
    }
  });

  it("switches skins on skin, and refuses to exit", () => {
    expect(runCommand("skin", articles).action).toEqual({ type: "cycle" });
    expect(runCommand("exit", articles).action).toBeUndefined();
  });

  it("falls back to a canned reply and a model downgrade", () => {
    const result = runCommand("write me a poem", articles);
    expect(result.replies[0]).toMatchObject({ kind: "text" });
    expect(result.action).toEqual({ type: "downgrade" });
  });

  it("words the downgrade warning, bottoming out at Fable 1", () => {
    expect(downgradeWarning(4)).toMatch(/Fable 4 .* switching to Fable 3/);
    expect(downgradeWarning(1)).toMatch(/no lower model/);
  });
});
