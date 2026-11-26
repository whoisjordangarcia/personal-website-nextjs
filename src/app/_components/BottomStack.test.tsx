import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BottomStack from "./BottomStack";

// Mock the child components
vi.mock("./tmux/TmuxStatusBar", () => ({
  default: () => <div data-testid="tmux-status-bar">TmuxStatusBar</div>,
}));

vi.mock("./CreditsFooter", () => ({
  default: () => <div data-testid="credits-footer">CreditsFooter</div>,
}));

describe("BottomStack", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the bottom stack container", () => {
    const { container } = render(<BottomStack />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("fixed", "z-40", "flex", "flex-col", "gap-2");
  });

  it("renders TmuxStatusBar component", () => {
    render(<BottomStack />);

    expect(screen.getByTestId("tmux-status-bar")).toBeInTheDocument();
  });

  it("renders CreditsFooter component", () => {
    render(<BottomStack />);

    expect(screen.getByTestId("credits-footer")).toBeInTheDocument();
  });

  it("has aria-live attribute for accessibility", () => {
    const { container } = render(<BottomStack />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute("aria-live", "polite");
  });

  it("applies correct positioning styles", () => {
    const { container } = render(<BottomStack />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("right-2", "left-2");
    // Read the raw inline style: happy-dom >= 20.14 normalizes rem to px
    // in computed styles, which would make toHaveStyle environment-specific.
    expect(wrapper.getAttribute("style")).toContain(
      "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
    );
  });

  it("wraps children in pointer-events-auto divs", () => {
    const { container } = render(<BottomStack />);

    const pointerEventsDivs = container.querySelectorAll(
      ".pointer-events-auto",
    );
    expect(pointerEventsDivs.length).toBe(2);
  });
});
