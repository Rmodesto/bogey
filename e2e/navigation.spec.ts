import { test, expect } from "@playwright/test";
import { modules } from "./fixtures/content";

// Journey: moving between screens, and the routes that must exist at all.
test.describe("navigation", () => {
  const routes = ["/", "/learn", "/study", "/exam", "/dashboard"];

  for (const route of routes) {
    test(`${route} responds and renders a heading`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1, h2").first()).toBeVisible();
    });
  }

  test("every prerendered lesson route responds", async ({ page }) => {
    // dynamicParams = false, so an unknown lesson must 404 while every generated
    // path must resolve. Checks the first lesson of each module to stay quick.
    for (const mod of modules) {
      const response = await page.goto(`/learn/${mod.id}/${mod.lessons[0].id}`);
      expect(response?.status(), `${mod.id}/${mod.lessons[0].id}`).toBe(200);
    }
  });

  test("an unknown lesson 404s", async ({ page }) => {
    const response = await page.goto("/learn/mod-regulations/les-does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("the browser back button returns from a lesson to the shelf", async ({ page }) => {
    await page.goto("/learn");
    await page.getByRole("link", { name: "Start" }).first().click();
    await expect(page).toHaveURL(/\/learn\/.+\/.+/);
    await page.goBack();
    await expect(page).toHaveURL(/\/learn$/);
  });
});
