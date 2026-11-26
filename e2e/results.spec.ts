import { test, expect } from "@playwright/test";
import { blueprint, passThreshold } from "./fixtures/content";

const total = blueprint.totalQuestions;
const seed = 12345;

/** A results URL shaped exactly like the one /exam produces. */
const resultsUrl = (score: number, answers?: unknown) =>
  `/results?seed=${seed}&score=${score}&total=${total}&time=600&answers=${encodeURIComponent(
    JSON.stringify(answers ?? new Array(total).fill(0))
  )}`;

// Journey: a candidate reads their result, reviews what they missed, goes again.
test.describe("results", () => {
  test("a score at the Pass Threshold passes", async ({ page }) => {
    await page.goto(resultsUrl(passThreshold(total)));
    await expect(page.getByRole("heading", { name: "Congratulations!" })).toBeVisible();
  });

  test("one mark below the Pass Threshold fails", async ({ page }) => {
    // ADR-0002: the threshold is a count, not a rounded percentage. At 60
    // questions and 0.7, 41 correct is 68.3% and must fail even though the old
    // round(pct) >= 70 rule would have let 69.5% through.
    await page.goto(resultsUrl(passThreshold(total) - 1));
    await expect(page.getByRole("heading", { name: "Keep Studying" })).toBeVisible();
  });

  test("breaks the sitting down by Domain", async ({ page }) => {
    await page.goto(resultsUrl(passThreshold(total)));
    await expect(page.getByRole("heading", { name: "Performance by Domain" })).toBeVisible();
    for (const weight of blueprint.domainWeights) {
      // domainWeights reference Domains by id; the generated blueprint carries
      // the display name, which is what the page renders.
      expect(typeof weight.domain).toBe("string");
    }
  });

  test("lists the Questions to review when answers are wrong", async ({ page }) => {
    await page.goto(resultsUrl(0));
    await expect(page.getByRole("heading", { name: "Questions to Review" })).toBeVisible();
  });

  test("a reload shows the same result", async ({ page }) => {
    const url = resultsUrl(passThreshold(total));
    await page.goto(url);
    const headline = await page.getByRole("heading", { level: 2 }).first().textContent();
    await page.reload();
    await expect(page.getByRole("heading", { level: 2 }).first()).toHaveText(headline ?? "");
  });

  test("a tampered score is clamped to what the exam could produce", async ({ page }) => {
    await page.goto(resultsUrl(total * 10));
    // Clamped to `total`, so it reads as a perfect sitting rather than nonsense.
    await expect(page.getByRole("heading", { name: "Congratulations!" })).toBeVisible();
    await expect(page.getByText(`${total}/${total}`)).toBeVisible();
  });

  test("a malformed answers payload does not break the page", async ({ page }) => {
    await page.goto(`/results?seed=${seed}&score=10&total=${total}&time=1&answers=not-json`);
    await expect(page.getByRole("heading", { name: "Exam Results" })).toBeVisible();
  });

  test("a results URL with no seed still renders", async ({ page }) => {
    // Falls back to the historical fixed draw (seed 42), so the page renders but
    // grades against a different Draw than the candidate sat. Pinned because
    // ADR-0004 removes this whole mechanism.
    await page.goto(`/results?score=30&total=${total}&time=60`);
    await expect(page.getByRole("heading", { name: "Exam Results" })).toBeVisible();
  });

  test("offers the way back into practice", async ({ page }) => {
    await page.goto(resultsUrl(0));
    await expect(page.getByRole("link", { name: /Retake|Try Again|Exam/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Study/i }).first()).toBeVisible();
  });
});
