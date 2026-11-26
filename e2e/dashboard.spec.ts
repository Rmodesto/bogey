import { test, expect } from "@playwright/test";

// Journey: a candidate checks where they stand.
test.describe("dashboard", () => {
  test("renders the readiness and focus panels", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Training Dashboard" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Exam Readiness" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Start Exam" })).toHaveAttribute("href", "/exam");
  });

  test("the numbers shown are placeholders, not a candidate's record", async ({ page }) => {
    // Pinned deliberately. Every figure on this screen is a hardcoded sample and
    // the Domain labels do not match the content registry — the page says
    // "Loading & Performance" while the registry says "Loading and Performance".
    // ADR-0003 replaces all of it; this assertion is the tripwire.
    await page.goto("/dashboard");
    await expect(page.getByText("80%").first()).toBeVisible();
    await expect(page.getByText("+12% this week")).toBeVisible();
    await expect(page.getByText("Loading & Performance").first()).toBeVisible();
  });
});
