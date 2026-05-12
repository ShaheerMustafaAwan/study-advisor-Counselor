import { defineConfig, devices } from "@playwright/test";

/** Dedicated port so Playwright does not attach to an unrelated process on 8080. */
const PORT = 8090;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    // Prefer our Vite instance; another app answering 8080/8090 can look "ready" but break tests.
    reuseExistingServer: Boolean(process.env.PW_REUSE_DEV_SERVER),
    timeout: 120_000,
  },
});
