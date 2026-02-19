import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Analytics } from "./Analytics";

// Mock the env module
vi.mock("@/env", () => ({
  env: {
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: "test-website-id",
    NEXT_PUBLIC_UMAMI_SCRIPT_URL: "https://analytics.example.com/script.js",
  },
}));

describe("Analytics", () => {
  beforeEach(() => {
    // Reset window.umami mock
    window.umami = {
      track: vi.fn(),
      trackView: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("tracks page view on mount", () => {
    render(<Analytics />);

    expect(window.umami?.trackView).toHaveBeenCalledWith("/");
  });

  it("tracks link clicks", () => {
    render(
      <>
        <Analytics />
        <a href="https://example.com">Test Link</a>
      </>,
    );

    const link = screen.getByText("Test Link");
    fireEvent.click(link);

    expect(window.umami?.track).toHaveBeenCalledWith("external_link_click", {
      href: "https://example.com/",
      text: "Test Link",
    });
  });

  it("does not track clicks on non-anchor elements", () => {
    render(
      <>
        <Analytics />
        <button>Test Button</button>
      </>,
    );

    const button = screen.getByText("Test Button");
    fireEvent.click(button);

    expect(window.umami?.track).not.toHaveBeenCalled();
  });

  it("tracks clicks on elements inside anchors", () => {
    render(
      <>
        <Analytics />
        <a href="https://example.com">
          <span>Nested Text</span>
        </a>
      </>,
    );

    const span = screen.getByText("Nested Text");
    fireEvent.click(span);

    expect(window.umami?.track).toHaveBeenCalledWith("link_click", {
      href: "https://example.com/",
      text: "Nested Text",
    });
  });
});

describe("Analytics without config", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock("@/env", () => ({
      env: {
        NEXT_PUBLIC_UMAMI_WEBSITE_ID: undefined,
        NEXT_PUBLIC_UMAMI_SCRIPT_URL: undefined,
      },
    }));
  });

  it("returns null when websiteId is not configured", async () => {
    const { Analytics: AnalyticsNoConfig } = await import("./Analytics");

    const { container } = render(<AnalyticsNoConfig />);

    expect(container.firstChild).toBeNull();
  });
});
