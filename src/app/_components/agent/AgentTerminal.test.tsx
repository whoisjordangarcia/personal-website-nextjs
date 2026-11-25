import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AgentTerminal from "./AgentTerminal";

const articles = [
  { title: "First Post", slug: "first-post", date: "2026-06-01" },
  { title: "Second Post", slug: "second-post", date: "2026-05-01" },
];

describe("AgentTerminal", () => {
  it("renders the bio without waiting on any animation", () => {
    render(<AgentTerminal articles={articles} />);
    expect(screen.getByText(/Aussie in Miami/)).toBeInTheDocument();
  });

  it("links the latest articles", () => {
    render(<AgentTerminal articles={articles} />);
    expect(screen.getByRole("link", { name: "First Post" })).toHaveAttribute(
      "href",
      "/articles/first-post",
    );
  });

  it("renders every profile link", () => {
    render(<AgentTerminal articles={articles} />);
    expect(
      screen.getByRole("link", { name: "hello@jordangarcia.me" }),
    ).toHaveAttribute("href", "mailto:hello@jordangarcia.me");
    expect(
      screen.getByRole("link", { name: "jordandotbuilds" }),
    ).toHaveAttribute("href", "https://x.com/jordandotbuilds");
  });

  it("skips the articles tool call when there are none", () => {
    render(<AgentTerminal articles={[]} />);
    expect(screen.queryByText(/ls articles/)).not.toBeInTheDocument();
  });
});
