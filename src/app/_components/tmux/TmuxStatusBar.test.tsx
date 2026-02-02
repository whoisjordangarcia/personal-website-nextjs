import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import TmuxStatusBar from "./TmuxStatusBar";

describe("TmuxStatusBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Set a fixed date for consistent testing
    vi.setSystemTime(new Date("2024-09-11T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the status bar with role status", () => {
    render(<TmuxStatusBar />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "tmux status bar",
    );
  });

  it("displays the hostname", () => {
    render(<TmuxStatusBar />);

    expect(screen.getByText("lucky-falcon")).toBeInTheDocument();
  });

  it("displays the session indicator", () => {
    render(<TmuxStatusBar />);

    expect(screen.getByText("[0]")).toBeInTheDocument();
  });

  it("displays window list with correct windows", () => {
    render(<TmuxStatusBar />);

    expect(screen.getByText(/0:zsh/)).toBeInTheDocument();
    expect(screen.getByText(/1:vim/)).toBeInTheDocument();
    expect(screen.getByText(/2:node/)).toBeInTheDocument();
  });

  it("marks first window as active by default", () => {
    render(<TmuxStatusBar />);

    // First window should have asterisk
    expect(screen.getByText(/0:zsh\*/)).toBeInTheDocument();
  });

  it("displays battery indicator", () => {
    render(<TmuxStatusBar />);

    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByLabelText("Battery 85%")).toBeInTheDocument();
  });

  it("displays WiFi indicator", () => {
    render(<TmuxStatusBar />);

    expect(screen.getByLabelText("WiFi connected")).toBeInTheDocument();
  });

  it("displays load average indicator", () => {
    render(<TmuxStatusBar />);

    expect(screen.getByText("0.42")).toBeInTheDocument();
    expect(screen.getByLabelText("Load 0.42")).toBeInTheDocument();
  });

  it("displays formatted date", () => {
    render(<TmuxStatusBar />);

    // Date should be formatted as "Thu, Sep 11" or similar based on locale
    const dateElement = screen.getByText(/Sep/);
    expect(dateElement).toBeInTheDocument();
  });

  it("updates date every second", async () => {
    render(<TmuxStatusBar />);

    // Advance time by 1 second
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // The component should still be rendering (no errors)
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  describe("Keyboard interactions", () => {
    it("activates prefix mode on Ctrl+b", async () => {
      render(<TmuxStatusBar />);

      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });

      expect(screen.getByText("[prefix]")).toBeInTheDocument();
    });

    it("deactivates prefix after timeout", async () => {
      render(<TmuxStatusBar />);

      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });

      expect(screen.getByText("[prefix]")).toBeInTheDocument();

      // Wait for prefix timeout (1500ms)
      await act(async () => {
        vi.advanceTimersByTime(1500);
      });

      expect(screen.queryByText("[prefix]")).not.toBeInTheDocument();
    });

    it("shows help panel on Ctrl+b then ?", async () => {
      render(<TmuxStatusBar />);

      // Activate prefix
      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });

      // Press ?
      await act(async () => {
        fireEvent.keyDown(window, { key: "?", shiftKey: true });
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("tmux keys")).toBeInTheDocument();
    });

    it("closes help panel on Escape", async () => {
      render(<TmuxStatusBar />);

      // Open help
      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });
      await act(async () => {
        fireEvent.keyDown(window, { key: "?", shiftKey: true });
      });

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // Press Escape
      await act(async () => {
        fireEvent.keyDown(window, { key: "Escape" });
      });

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("shows split-window status on Ctrl+b then %", async () => {
      render(<TmuxStatusBar />);

      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });

      await act(async () => {
        fireEvent.keyDown(window, { key: "%", shiftKey: true });
      });

      expect(screen.getByText("split-window -h")).toBeInTheDocument();
    });

    it("shows new-window status on Ctrl+b then c", async () => {
      render(<TmuxStatusBar />);

      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });

      await act(async () => {
        fireEvent.keyDown(window, { key: "c" });
      });

      expect(screen.getByText("new-window")).toBeInTheDocument();
    });

    it("navigates to next window on Ctrl+b then n", async () => {
      render(<TmuxStatusBar />);

      // Initially window 0 is active
      expect(screen.getByText(/0:zsh\*/)).toBeInTheDocument();

      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });

      await act(async () => {
        fireEvent.keyDown(window, { key: "n" });
      });

      // Now window 1 should be active
      expect(screen.getByText(/1:vim\*/)).toBeInTheDocument();
      expect(screen.getByText("next-window")).toBeInTheDocument();
    });

    it("navigates to previous window on Ctrl+b then p", async () => {
      render(<TmuxStatusBar />);

      // First go to next window
      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });
      await act(async () => {
        fireEvent.keyDown(window, { key: "n" });
      });

      // Now go to previous
      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });
      await act(async () => {
        fireEvent.keyDown(window, { key: "p" });
      });

      expect(screen.getByText(/0:zsh\*/)).toBeInTheDocument();
      expect(screen.getByText("previous-window")).toBeInTheDocument();
    });

    it("selects window by number on Ctrl+b then 0-9", async () => {
      render(<TmuxStatusBar />);

      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });

      await act(async () => {
        fireEvent.keyDown(window, { key: "2" });
      });

      expect(screen.getByText(/2:node\*/)).toBeInTheDocument();
      expect(screen.getByText("select-window -t 2")).toBeInTheDocument();
    });

    it("shows error for non-existent window number", async () => {
      render(<TmuxStatusBar />);

      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });

      await act(async () => {
        fireEvent.keyDown(window, { key: "9" });
      });

      expect(screen.getByText("window 9 not found")).toBeInTheDocument();
    });

    it("shows detached message on Ctrl+b then d", async () => {
      render(<TmuxStatusBar />);

      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });

      await act(async () => {
        fireEvent.keyDown(window, { key: "d" });
      });

      expect(screen.getByText("detached (simulated)")).toBeInTheDocument();
    });

    it("shows unbound key message for unknown keys", async () => {
      render(<TmuxStatusBar />);

      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });

      await act(async () => {
        fireEvent.keyDown(window, { key: "x" });
      });

      expect(screen.getByText("unbound key: x")).toBeInTheDocument();
    });

    it("wraps around when navigating past last window", async () => {
      render(<TmuxStatusBar />);

      // Go to window 2
      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });
      await act(async () => {
        fireEvent.keyDown(window, { key: "2" });
      });

      // Go to next (should wrap to 0)
      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });
      await act(async () => {
        fireEvent.keyDown(window, { key: "n" });
      });

      expect(screen.getByText(/0:zsh\*/)).toBeInTheDocument();
    });

    it("does not trigger prefix without Ctrl modifier", async () => {
      render(<TmuxStatusBar />);

      await act(async () => {
        fireEvent.keyDown(window, { key: "b" });
      });

      expect(screen.queryByText("[prefix]")).not.toBeInTheDocument();
    });

    it("does not trigger prefix with other modifiers", async () => {
      render(<TmuxStatusBar />);

      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true, shiftKey: true });
      });

      expect(screen.queryByText("[prefix]")).not.toBeInTheDocument();
    });
  });

  describe("Overlays", () => {
    it("shows vertical split overlay on Ctrl+b then %", async () => {
      render(<TmuxStatusBar />);

      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });

      await act(async () => {
        fireEvent.keyDown(window, { key: "%", shiftKey: true });
      });

      const overlay = document.querySelector(".tmux-split-overlay");
      expect(overlay).toBeInTheDocument();
      expect(document.querySelector(".tmux-split-vert")).toBeInTheDocument();
    });

    it('shows horizontal split overlay on Ctrl+b then "', async () => {
      render(<TmuxStatusBar />);

      await act(async () => {
        fireEvent.keyDown(window, { key: "b", ctrlKey: true });
      });

      await act(async () => {
        fireEvent.keyDown(window, { key: '"', shiftKey: true });
      });

      const overlay = document.querySelector(".tmux-split-overlay");
      expect(overlay).toBeInTheDocument();
      expect(document.querySelector(".tmux-split-horz")).toBeInTheDocument();
    });
  });
});
