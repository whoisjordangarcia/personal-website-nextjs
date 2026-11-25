import { describe, it, expect } from "vitest";
import { scannerFrame, scannerLength, SCANNER_DEFAULTS } from "./scanner";

describe("scanner", () => {
  it("cycles through forward, hold, back and hold", () => {
    expect(scannerLength()).toBe(8 + 9 + 7 + 30);
  });

  it("puts the head at the frame index on the way right", () => {
    const cells = scannerFrame(3);
    expect(cells[3]).toMatchObject({ glyph: "⬥", alpha: 1, lit: true });
    expect(cells[2]).toMatchObject({ glyph: "◆", alpha: 0.9, lit: true });
    expect(cells[4]?.lit).toBe(false);
  });

  it("sweeps back from the right edge", () => {
    const firstBack = SCANNER_DEFAULTS.width + SCANNER_DEFAULTS.holdEnd;
    const cells = scannerFrame(firstBack);
    expect(cells[6]).toMatchObject({ glyph: "⬥", lit: true });
    expect(cells[7]).toMatchObject({ glyph: "◆", lit: true });
  });

  it("wraps around after a full cycle", () => {
    expect(scannerFrame(scannerLength() + 2)).toEqual(scannerFrame(2));
  });

  it("always renders width cells", () => {
    for (let f = 0; f < scannerLength(); f++) {
      expect(scannerFrame(f)).toHaveLength(8);
    }
  });
});
