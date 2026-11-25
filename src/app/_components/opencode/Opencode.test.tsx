import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OpencodeTranscript from "./OpencodeTranscript";
import OpencodeConsole from "./OpencodeConsole";

const articles = [
  { title: "First Post", slug: "first-post", date: "2026-06-01" },
];

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
  it("answers commands and shows the model in the footer", async () => {
    const user = userEvent.setup();
    render(<OpencodeConsole articles={articles} onCycle={vi.fn()} />);

    await user.type(screen.getByLabelText("Ask the agent"), "/ls{Enter}");

    expect(
      await screen.findByRole("link", { name: "First Post" }),
    ).toBeInTheDocument();
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
    await vi.waitFor(() => expect(onCycle).toHaveBeenCalledOnce());
  });
});
