import { describe, it, expect } from "vitest";
import { pickVerb, SPINNER_VERBS } from "./spinner-verbs";

describe("pickVerb", () => {
  it("returns one of the verbs", () => {
    expect(SPINNER_VERBS).toContain(pickVerb());
  });

  it("never repeats the previous verb", () => {
    for (let i = 0; i < 50; i++) {
      const prev = SPINNER_VERBS[i % SPINNER_VERBS.length]!;
      expect(pickVerb(prev)).not.toBe(prev);
    }
  });

  it("is deterministic with an injected random", () => {
    expect(pickVerb(undefined, () => 0)).toBe(SPINNER_VERBS[0]);
  });
});
