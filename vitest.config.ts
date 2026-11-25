import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  // Tests only need JSX compiled; Vite's built-in transform does that, so
  // @vitejs/plugin-react (fast refresh, Babel) isn't needed here.
  esbuild: { jsx: "automatic" },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/setup.ts",
        "**/*.d.ts",
        "**/*.config.*",
        "**/env.js",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
