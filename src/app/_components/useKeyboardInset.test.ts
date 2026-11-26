import { describe, it, expect } from "vitest";
import { keyboardInset } from "./useKeyboardInset";

describe("keyboardInset", () => {
  it("is zero with no keyboard", () => {
    expect(keyboardInset(844, { height: 844, offsetTop: 0 })).toBe(0);
  });

  it("is the hidden height when the keyboard is up", () => {
    expect(keyboardInset(844, { height: 508, offsetTop: 0 })).toBe(336);
  });

  it("accounts for Safari scrolling the visual viewport", () => {
    expect(keyboardInset(844, { height: 508, offsetTop: 120 })).toBe(216);
  });

  it("never goes negative (pinch zoom, rounding)", () => {
    expect(keyboardInset(844, { height: 900, offsetTop: 0 })).toBe(0);
  });
});
