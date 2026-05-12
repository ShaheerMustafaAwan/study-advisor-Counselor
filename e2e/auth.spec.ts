import { test, expect } from "@playwright/test";
import {
  installCounselorDashboardMocks,
  mockNonCounselorLogin,
} from "./helpers/vite-backend-mock";

test.describe("login", () => {
  test("rejects non-counselor accounts", async ({ page }) => {
    await mockNonCounselorLogin(page);
    await page.goto("/login");

    await page.locator('input[type="email"]').fill("student@example.com");
    await page.locator('input[type="password"]').fill("password123");
    await page.getByRole("button", { name: /^sign in$/i }).click();

    await expect(
      page.getByText("This login is only for counselors.", { exact: true }),
    ).toBeVisible();
  });

  test("counselor can sign in and reach dashboard", async ({ page }) => {
    await installCounselorDashboardMocks(page, {
      interceptCounselorLogin: true,
    });
    await page.goto("/login");

    await page.locator('input[type="email"]').fill("counselor@example.com");
    await page.locator('input[type="password"]').fill("password123");
    await page.getByRole("button", { name: /^sign in$/i }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", { name: /welcome back, e2e counselor/i }),
    ).toBeVisible();
  });
});
