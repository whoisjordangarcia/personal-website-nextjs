import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomeTerminal from "./HomeTerminal";

// Mock TerminalLine to avoid timing issues
vi.mock("./TerminalLine", () => ({
  default: ({
    prompt,
    command,
    onDone,
    className,
    promptLabel,
    showCursorWhenDone,
  }: {
    prompt: React.ReactNode;
    command: string;
    onDone?: () => void;
    className?: string;
    promptLabel?: string;
    showCursorWhenDone?: boolean;
  }) => {
    // Immediately call onDone to trigger state changes
    if (onDone) {
      setTimeout(onDone, 0);
    }
    return (
      <h1
        className={"terminal-line " + (className ?? "")}
        aria-label={(promptLabel ?? "") + command}
      >
        {prompt}
        <span>{command}</span>
        {showCursorWhenDone !== false && <span className="terminal-cursor" />}
      </h1>
    );
  },
}));

describe("HomeTerminal", () => {
  it("renders the first terminal line with correct command", () => {
    render(<HomeTerminal />);

    // Check that the first command prompt is visible
    expect(screen.getByText(/jordangarcia@127\.0\.0\.1/)).toBeInTheDocument();
  });

  it("renders the first command 'me -h'", () => {
    render(<HomeTerminal />);

    expect(screen.getByText("me -h")).toBeInTheDocument();
  });

  it("has correct aria-label for first command", () => {
    render(<HomeTerminal />);

    const heading = screen.getByRole("heading");
    expect(heading).toHaveAttribute(
      "aria-label",
      "jordangarcia@127.0.0.1 ~ $ me -h",
    );
  });

  it("renders with correct styling classes", () => {
    render(<HomeTerminal />);

    const heading = screen.getByRole("heading");
    expect(heading).toHaveClass("terminal-line", "text-base");
  });

  it("renders the Prompt component with correct structure", () => {
    render(<HomeTerminal />);

    expect(screen.getByText(/jordangarcia@127\.0\.0\.1/)).toBeInTheDocument();
    expect(screen.getByText(/~ \$/)).toBeInTheDocument();
  });
});
