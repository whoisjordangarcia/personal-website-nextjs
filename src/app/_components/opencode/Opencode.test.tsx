import { beforeEach, describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OpencodeTranscript from "./OpencodeTranscript";
import OpencodeConsole from "./OpencodeConsole";

const articles = [
  { title: "First Post", slug: "first-post", date: "2026-06-01" },
];

// Freeze the scanner (it honors prefers-reduced-motion) so its 40ms frame
// timer doesn't flood the run with act() warnings.
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});

describe("OpencodeTranscript", () => {
  it("renders the bio, articles and links on the server", () => {
    render(<OpencodeTranscript articles={articles} />);
    expect(screen.getByText(/Aussie in Miami/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "First Post" })).toHaveAttribute(
      "href",
      "/articles/first-post",
    );
    expect(
      screen.getByRole("link", { name: "hello@jordangarcia.me" }),
    ).toBeInTheDocument();
  });
});

describe("OpencodeConsole", () => {
  it("renders the session sidebar with context, MCP and todo", () => {
    render(<OpencodeConsole articles={articles} onCycle={vi.fn()} />);
    const sidebar = screen.getByRole("complementary", {
      name: "Session sidebar",
    });
    expect(sidebar).toHaveTextContent("41,000 tokens");
    expect(sidebar).toHaveTextContent("MCP");
    expect(sidebar).toHaveTextContent("Fable 4");
  });

  it("answers commands and shows the model in the footer", async () => {
    const user = userEvent.setup();
    render(<OpencodeConsole articles={articles} onCycle={vi.fn()} />);

    await user.type(screen.getByLabelText("Ask the agent"), "/ls{Enter}");

    expect(screen.getByRole("status")).toHaveTextContent("working");
    expect(
      await screen.findByRole(
        "link",
        { name: "First Post" },
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getAllByText(/Fable 4/).length).toBeGreaterThan(0);
  });

  it("toggles the build/plan badge", async () => {
    const user = userEvent.setup();
    render(<OpencodeConsole articles={articles} onCycle={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /Mode: build/ }));
    expect(
      screen.getByRole("button", { name: /Mode: plan/ }),
    ).toBeInTheDocument();
  });

  it("switches skins on /skin", async () => {
    const user = userEvent.setup();
    const onCycle = vi.fn();
    render(<OpencodeConsole articles={articles} onCycle={onCycle} />);

    await user.type(screen.getByLabelText("Ask the agent"), "/skin{Enter}");
    await vi.waitFor(() => expect(onCycle).toHaveBeenCalledOnce(), {
      timeout: 3000,
    });
  });
});
