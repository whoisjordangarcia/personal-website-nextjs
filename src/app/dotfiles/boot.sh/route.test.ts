import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "./route";

// Mock the global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("boot.sh API route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns script content on successful fetch", async () => {
    const scriptContent = "#!/bin/bash\necho 'Hello World'";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(scriptContent),
    });

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(scriptContent);
  });

  it("sets correct Content-Type header", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve("script"),
    });

    const response = await GET();

    expect(response.headers.get("Content-Type")).toBe("text/plain");
  });

  it("sets Cache-Control header for 5 minutes", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve("script"),
    });

    const response = await GET();

    expect(response.headers.get("Cache-Control")).toBe("public, max-age=300");
  });

  it("returns 500 error when fetch fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Failed to fetch boot script" });
  });

  it("returns 500 error on network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Internal server error" });
  });

  it("fetches from the correct GitHub URL", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve("script"),
    });

    await GET();

    expect(mockFetch).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/whoisjordangarcia/dotfiles/main/boot.sh",
    );
  });

  it("handles empty script content", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(""),
    });

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
  });

  it("handles large script content", async () => {
    const largeScript = "x".repeat(100000);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(largeScript),
    });

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(largeScript);
  });

  it("logs error on catch block", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Test error");
    mockFetch.mockRejectedValueOnce(error);

    await GET();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching boot script:",
      error,
    );
    consoleSpy.mockRestore();
  });
});
