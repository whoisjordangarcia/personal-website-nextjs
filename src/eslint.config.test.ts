import { describe, it, expect } from "vitest";
import eslintConfig from "eslint-config-jordangarcia";
import { coreSafety, typescriptStrict } from "eslint-config-jordangarcia";

describe("eslint-config-jordangarcia", () => {
  it("exports a default config array with two layers", () => {
    expect(Array.isArray(eslintConfig)).toBe(true);
    expect(eslintConfig).toHaveLength(2);
  });

  it("includes coreSafety as the first layer", () => {
    expect(eslintConfig[0]).toBe(coreSafety);
    expect(coreSafety.name).toBe("jordangarcia/core-safety");
  });

  it("includes typescriptStrict as the second layer", () => {
    expect(eslintConfig[1]).toBe(typescriptStrict);
    expect(typescriptStrict.name).toBe("jordangarcia/typescript-strict");
  });

  describe("coreSafety rules", () => {
    it("enforces strict equality", () => {
      expect(coreSafety.rules.eqeqeq).toEqual(["error", "always"]);
    });

    it("disallows eval", () => {
      expect(coreSafety.rules["no-eval"]).toBe("error");
    });

    it("enforces prefer-const", () => {
      expect(coreSafety.rules["prefer-const"]).toBe("error");
    });

    it("warns on console usage", () => {
      expect(coreSafety.rules["no-console"]).toBe("warn");
    });

    it("disallows debugger", () => {
      expect(coreSafety.rules["no-debugger"]).toBe("error");
    });
  });

  describe("typescriptStrict rules", () => {
    it("targets ts and tsx files", () => {
      expect(typescriptStrict.files).toEqual(["**/*.ts", "**/*.tsx"]);
    });

    it("catches floating promises", () => {
      expect(
        typescriptStrict.rules["@typescript-eslint/no-floating-promises"],
      ).toBe("error");
    });

    it("enforces consistent type imports", () => {
      expect(
        typescriptStrict.rules["@typescript-eslint/consistent-type-imports"],
      ).toEqual(["warn", { prefer: "type-imports" }]);
    });

    it("enforces exhaustive switch statements", () => {
      expect(
        typescriptStrict.rules[
          "@typescript-eslint/switch-exhaustiveness-check"
        ],
      ).toBe("error");
    });

    it("disallows variable shadowing", () => {
      expect(typescriptStrict.rules["@typescript-eslint/no-shadow"]).toBe(
        "error",
      );
    });
  });
});
