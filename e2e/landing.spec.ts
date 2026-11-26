import { test, expect } from "@playwright/test";

// Journey: a visitor arrives and picks a way in.
test.describe("landing", () => {
  test("shows the product name and both hero routes", async ({ page }) => {
    await page.goto("/");

    // Case-insensitive on purpose: the wordmark's capitalisation is a branding
    // decision in flight, and this journey does not depend on which spelling wins.
    await expect(page.getByRole("navigation").getByText(/bogeyman/i)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await expect(page.getByRole("link", { name: "Start Free Training" })).toHaveAttribute("href", "/study");
    await expect(page.getByRole("link", { name: "Try Exam Simulator" })).toHaveAttribute("href", "/exam");
    await expect(page.getByRole("link", { name: "Start Training" })).toHaveAttribute("href", "/dashboard");
  });

  test("Start Free Training reaches the drill screen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Start Free Training" }).click();
    await expect(page).toHaveURL(/\/study$/);
    await expect(page.getByTestId("study-progress")).toBeVisible();
  });

  test("Try Exam Simulator reaches the exam start screen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Try Exam Simulator" }).click();
    await expect(page).toHaveURL(/\/exam$/);
    await expect(page.getByRole("button", { name: "Begin Exam" })).toBeVisible();
  });

  test("renders without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
  });
});
