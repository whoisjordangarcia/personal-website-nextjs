import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import TerminalLine from "./TerminalLine";

describe("TerminalLine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the prompt correctly", () => {
    render(
      <TerminalLine
        prompt={<span data-testid="prompt">$</span>}
        command="hello"
      />,
    );

    expect(screen.getByTestId("prompt")).toBeInTheDocument();
    expect(screen.getByTestId("prompt")).toHaveTextContent("$");
  });

  it("has correct aria-label with promptLabel and command", () => {
    render(
      <TerminalLine
        prompt={<span>$</span>}
        promptLabel="user@host ~ $ "
        command="ls -la"
      />,
    );

    expect(screen.getByRole("heading")).toHaveAttribute(
      "aria-label",
      "user@host ~ $ ls -la",
    );
  });

  it("applies custom className", () => {
    render(
      <TerminalLine
        prompt={<span>$</span>}
        command="test"
        className="custom-class"
      />,
    );

    expect(screen.getByRole("heading")).toHaveClass(
      "terminal-line",
      "custom-class",
    );
  });

  it("starts with empty visible text before startDelayMs", () => {
    render(
      <TerminalLine
        prompt={<span>$</span>}
        command="hello"
        startDelayMs={500}
      />,
    );

    // Initially, no characters should be visible
    const heading = screen.getByRole("heading");
    const spans = heading.querySelectorAll("span");
    // Second span should be empty (the typed content)
    expect(spans[1]).toHaveTextContent("");
  });

  it("begins typing after startDelayMs", () => {
    render(
      <TerminalLine
        prompt={<span>$</span>}
        command="hi"
        startDelayMs={100}
        minSpeedMs={10}
        maxSpeedMs={10}
      />,
    );

    // Advance past start delay
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Advance to type first character
    act(() => {
      vi.advanceTimersByTime(10);
    });

    const heading = screen.getByRole("heading");
    const spans = heading.querySelectorAll("span");
    expect(spans[1]?.textContent).toBe("h");
  });

  it("completes typing the full command", () => {
    render(
      <TerminalLine
        prompt={<span>$</span>}
        command="abc"
        startDelayMs={0}
        minSpeedMs={10}
        maxSpeedMs={10}
      />,
    );

    // Advance to start typing
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Type all 3 characters
    for (let i = 0; i < 3; i++) {
      act(() => {
        vi.advanceTimersByTime(10);
      });
    }

    const heading = screen.getByRole("heading");
    const spans = heading.querySelectorAll("span");
    expect(spans[1]?.textContent).toBe("abc");
  });

  it("calls onDone callback when typing completes", () => {
    const onDone = vi.fn();

    render(
      <TerminalLine
        prompt={<span>$</span>}
        command="ab"
        startDelayMs={0}
        minSpeedMs={10}
        maxSpeedMs={10}
        onDone={onDone}
      />,
    );

    // Start typing
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Type both characters
    act(() => {
      vi.advanceTimersByTime(10);
    });
    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("shows cursor when showCursorWhenDone is true (default)", () => {
    render(
      <TerminalLine
        prompt={<span>$</span>}
        command="x"
        startDelayMs={0}
        minSpeedMs={10}
        maxSpeedMs={10}
      />,
    );

    // Complete typing
    act(() => {
      vi.advanceTimersByTime(10);
    });

    const heading = screen.getByRole("heading");
    const cursor = heading.querySelector(".terminal-cursor");
    expect(cursor).toBeInTheDocument();
  });

  it("hides cursor when showCursorWhenDone is false and typing is complete", () => {
    render(
      <TerminalLine
        prompt={<span>$</span>}
        command="x"
        startDelayMs={0}
        minSpeedMs={10}
        maxSpeedMs={10}
        showCursorWhenDone={false}
      />,
    );

    // Start typing
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Complete typing the single character
    act(() => {
      vi.advanceTimersByTime(10);
    });

    // Give it an extra tick to complete
    act(() => {
      vi.advanceTimersByTime(10);
    });

    const heading = screen.getByRole("heading");
    const cursor = heading.querySelector(".terminal-cursor");
    // When showCursorWhenDone is false and typing is done, cursor should not be present
    expect(cursor).not.toBeInTheDocument();
  });

  it("handles empty command string", () => {
    const onDone = vi.fn();

    render(<TerminalLine prompt={<span>$</span>} command="" onDone={onDone} />);

    // onDone should be called immediately for empty command
    expect(onDone).toHaveBeenCalled();
  });

  it("handles pause characters with additional delay", () => {
    render(
      <TerminalLine
        prompt={<span>$</span>}
        command="a,b"
        startDelayMs={0}
        minSpeedMs={10}
        maxSpeedMs={10}
        pauseOnChars=","
        pauseMs={100}
      />,
    );

    // Start typing
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Type 'a' (10ms)
    act(() => {
      vi.advanceTimersByTime(10);
    });

    const heading = screen.getByRole("heading");
    const spans = heading.querySelectorAll("span");
    expect(spans[1]?.textContent).toBe("a");

    // Type ',' - needs base + pause time (10ms + 100ms = 110ms)
    act(() => {
      vi.advanceTimersByTime(110);
    });

    expect(spans[1]?.textContent).toBe("a,");
  });

  it("shows cursor while typing is in progress", () => {
    render(
      <TerminalLine
        prompt={<span>$</span>}
        command="abc"
        startDelayMs={500}
        showCursorWhenDone={false}
      />,
    );

    // Even before typing starts, cursor should be shown
    const heading = screen.getByRole("heading");
    const cursor = heading.querySelector(".terminal-cursor");
    expect(cursor).toBeInTheDocument();
  });
});
