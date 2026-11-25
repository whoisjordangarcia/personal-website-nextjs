import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AgentConsole from "./AgentConsole";

const articles = [
  { title: "First Post", slug: "first-post", date: "2026-06-01" },
];

describe("AgentConsole", () => {
  it("answers a typed command after a short think", async () => {
    const user = userEvent.setup();
    render(<AgentConsole articles={articles} onCycle={vi.fn()} />);

    await user.type(screen.getByLabelText("Ask the agent"), "ls{Enter}");

    expect(screen.getByText("Thinking…")).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "First Post" }),
    ).toHaveAttribute("href", "/articles/first-post");
    expect(screen.getByLabelText("Ask the agent")).toHaveValue("");
  });

  it("shows links when asked", async () => {
    const user = userEvent.setup();
    render(<AgentConsole articles={articles} onCycle={vi.fn()} />);

    await user.type(screen.getByLabelText("Ask the agent"), "links{Enter}");

    expect(
      await screen.findByRole("link", { name: "hello@jordangarcia.me" }),
    ).toBeInTheDocument();
  });

  it("switches skins on the skin command", async () => {
    const user = userEvent.setup();
    const onCycle = vi.fn();
    render(<AgentConsole articles={articles} onCycle={onCycle} />);

    await user.type(screen.getByLabelText("Ask the agent"), "skin{Enter}");

    await vi.waitFor(() => expect(onCycle).toHaveBeenCalledOnce());
  });

  it("downgrades the model when intent detection 'fails'", async () => {
    const user = userEvent.setup();
    render(<AgentConsole articles={articles} onCycle={vi.fn()} />);
    expect(screen.getByText("Fable 4")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Ask the agent"), "hi{Enter}");

    expect(
      await screen.findByText(/Fable 4 failed intent detection/),
    ).toBeInTheDocument();
    expect(screen.getByText("Fable 3")).toBeInTheDocument();
  });

  it("clears the conversation", async () => {
    const user = userEvent.setup();
    render(<AgentConsole articles={articles} onCycle={vi.fn()} />);
    const input = screen.getByLabelText("Ask the agent");

    await user.type(input, "whoami{Enter}");
    expect(await screen.findByText(/Aussie in Miami/)).toBeInTheDocument();

    await user.type(input, "clear{Enter}");
    expect(screen.queryByText(/Aussie in Miami/)).not.toBeInTheDocument();
  });
});
