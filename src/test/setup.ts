import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Suppress styled-jsx warnings in happy-dom (jsx/global attrs are compiled away in prod)
vi.spyOn(console, "error").mockImplementation(
  (...args: Parameters<typeof console.error>) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (msg.includes("for a non-boolean attribute")) {
      return;
    }
    process.stderr.write(`${args.map(String).join(" ")}\n`);
  },
);

// Mock next/script
vi.mock("next/script", () => ({
  default: (_props: { src?: string; [key: string]: unknown }) => {
    return null;
  },
}));
