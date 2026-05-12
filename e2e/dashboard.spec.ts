import { test, expect } from "@playwright/test";
import { seedCounselorSession } from "./helpers/counselor-session";
import { installCounselorDashboardMocks } from "./helpers/vite-backend-mock";

test.beforeEach(async ({ page }) => {
  await seedCounselorSession(page);
  await installCounselorDashboardMocks(page);
});

test("dashboard shows counselor name and stats", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { name: /welcome back, e2e counselor/i })).toBeVisible();
  await expect(page.getByText("Total Students", { exact: true })).toBeVisible();
});

test("my students page lists mocked student", async ({ page }) => {
  await page.goto("/my-students");
  await expect(
    page.getByRole("heading", { name: /student management/i }),
  ).toBeVisible();
  await expect(page.getByText("Jane Student")).toBeVisible();

  const search = page.getByPlaceholder(/search students/i);
  await search.fill("Nonexistent");
  await expect(page.getByText("No students match your filters.")).toBeVisible();

  await search.fill("Jane");
  await expect(page.getByText("Jane Student")).toBeVisible();
});
