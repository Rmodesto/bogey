import { defineConfig, devices } from "@playwright/test";

// E2E runs against a production build, not `next dev`: the content pipeline
// runs as part of `npm run build`, and the prerendered output is what users
// actually get. `reuseExistingServer` keeps local reruns fast.
// Port is overridable because 3000-3100 are commonly taken by other local
// projects; a collision makes the whole suite fail to boot rather than fail a test.
const PORT = Number(process.env.E2E_PORT ?? 4321);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npx next start --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
