import { describe, it, expect } from "vitest";
import { parseFrontmatter } from "./frontmatter";

describe("parseFrontmatter", () => {
  it("parses strings, quoted strings, numbers and booleans", () => {
    const { data, content } = parseFrontmatter(
      [
        "---",
        "title: tmux — The Way I Actually Use It",
        'date: "2026-04-15"',
        "quote: 'it''s fine'",
        "readingTime: 5",
        "draft: false",
        "---",
        "",
        "Body text",
      ].join("\n"),
    );
    expect(data).toEqual({
      title: "tmux — The Way I Actually Use It",
      date: "2026-04-15",
      quote: "it's fine",
      readingTime: 5,
      draft: false,
    });
    expect(content).toBe("\nBody text");
  });

  it("keeps colons inside values", () => {
    const { data } = parseFrontmatter(
      "---\ndescription: Not a tutorial: a setup.\n---\n",
    );
    expect(data.description).toBe("Not a tutorial: a setup.");
  });

  it("handles CRLF line endings", () => {
    const { data, content } = parseFrontmatter(
      "---\r\ntitle: Hi\r\n---\r\nBody",
    );
    expect(data).toEqual({ title: "Hi" });
    expect(content).toBe("Body");
  });

  it("returns the source untouched when there is no frontmatter", () => {
    expect(parseFrontmatter("# Just MDX")).toEqual({
      data: {},
      content: "# Just MDX",
    });
  });

  it("throws on YAML it does not support instead of guessing", () => {
    expect(() => parseFrontmatter("---\ntags:\n  - a\n---\n")).toThrow(
      /Unsupported frontmatter line/,
    );
    expect(() => parseFrontmatter("---\ntags: [a, b]\n---\n")).toThrow(
      /Unsupported frontmatter value/,
    );
  });
});
