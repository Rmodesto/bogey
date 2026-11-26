import { test, expect } from "@playwright/test";
import { modules, firstModule, firstLesson } from "./fixtures/content";

// Journey: a candidate browses the shelf and opens a lesson.
//
// Assertions here are order-independent on purpose: the shelf does not render
// modules in the registry's `order`, and pinning DOM order would make this spec
// fail for a reason that has nothing to do with the journey.
test.describe("learn shelf", () => {
  test("lists every module with its lesson count", async ({ page }) => {
    await page.goto("/learn");

    for (const mod of modules) {
      await expect(page.getByRole("heading", { name: mod.title })).toBeVisible();
    }
    // One "completed / total" readout per module, all reading zero completed.
    const counts = page.getByText(/^0\/\d+$/);
    await expect(counts).toHaveCount(modules.length);
    await expect(page.getByText("lessons completed")).toHaveCount(modules.length);
  });

  test("only the first lesson of each module is reachable", async ({ page }) => {
    await page.goto("/learn");

    // This pins TODAY's behaviour, not desired behaviour. The shelf hardcodes
    // completedCount = 0 and nothing can mark a lesson complete, so 20 of 25
    // lessons are unreachable. ADR-0004 removes this lock; when it does, this
    // assertion must be inverted — which is exactly why it is pinned.
    const starts = page.getByRole("link", { name: "Start", exact: true });
    await expect(starts).toHaveCount(modules.length);

    const hrefs = await starts.evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    expect(new Set(hrefs)).toEqual(
      new Set(modules.map((m) => `/learn/${m.id}/${m.lessons[0].id}`))
    );
  });

  test("opening a module's first lesson lands on that lesson", async ({ page }) => {
    await page.goto("/learn");
    await page
      .getByRole("link", { name: "Start", exact: true })
      .and(page.locator(`[href="/learn/${firstModule.id}/${firstLesson.id}"]`))
      .click();

    await expect(page).toHaveURL(`/learn/${firstModule.id}/${firstLesson.id}`);
    await expect(page.getByRole("heading", { name: firstLesson.title })).toBeVisible();
  });
});
