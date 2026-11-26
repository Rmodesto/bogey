import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    // Playwright owns ./e2e; vitest must not try to run those specs.
    exclude: ["e2e/**", "node_modules/**"],
  },
});
