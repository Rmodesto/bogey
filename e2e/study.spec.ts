import { test, expect } from "@playwright/test";
import { activeQuestions } from "./fixtures/content";

// The verdict badge renders as " Correct" / " Incorrect" — Playwright normalizes
// whitespace for string matchers but not for regex ones, hence the \s*.
const verdict = /^\s*(Correct|Incorrect)\s*$/;

// Journey: a candidate drills the bank one Question at a time.
test.describe("study", () => {
  test("opens on the first Question of the active bank", async ({ page }) => {
    await page.goto("/study");
    await expect(page.getByTestId("study-progress"))
      .toHaveText(`Question 1 of ${activeQuestions.length}`);
    await expect(page.getByTestId("study-option")).not.toHaveCount(0);
  });

  test("answering reveals the verdict and the explanation", async ({ page }) => {
    await page.goto("/study");
    await expect(page.getByText(verdict)).toHaveCount(0);
    await expect(page.getByText("Correct Answer")).toHaveCount(0);

    await page.getByTestId("study-option").first().click();

    await expect(page.getByText(verdict).first()).toBeVisible();
    await expect(page.getByText("Correct Answer")).toBeVisible();
    await expect(page.getByText("Key Takeaway")).toBeVisible();
    await expect(page.getByRole("button", { name: "Next Question" })).toBeVisible();
  });

  test("a locked answer cannot be changed", async ({ page }) => {
    await page.goto("/study");
    const options = page.getByTestId("study-option");
    await options.first().click();
    const first = (await page.getByText(verdict).first().textContent())?.trim();

    await options.nth(1).click();
    expect((await page.getByText(verdict).first().textContent())?.trim()).toBe(first);
  });

  test("Next Question advances the counter and clears the verdict", async ({ page }) => {
    await page.goto("/study");
    await page.getByTestId("study-option").first().click();
    await page.getByRole("button", { name: "Next Question" }).click();

    await expect(page.getByTestId("study-progress"))
      .toHaveText(`Question 2 of ${activeQuestions.length}`);
    await expect(page.getByText(verdict)).toHaveCount(0);
  });

  test("drill position does not survive a reload", async ({ page }) => {
    // Pins the current reality: nothing persists anywhere. ADR-0003 changes
    // this, and this assertion is what will catch the change.
    await page.goto("/study");
    await page.getByTestId("study-option").first().click();
    await page.getByRole("button", { name: "Next Question" }).click();
    await page.reload();
    await expect(page.getByTestId("study-progress"))
      .toHaveText(`Question 1 of ${activeQuestions.length}`);
  });
});
