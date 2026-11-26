import { test, expect } from "@playwright/test";
import { blueprint, formatTime } from "./fixtures/content";

const total = blueprint.totalQuestions;

/** The navigator toggle is an icon button with no accessible name. */
const navToggle = (page: import("@playwright/test").Page) => page.locator("header button").last();

// Journey: a candidate sits a practice exam and submits it.
test.describe("exam", () => {
  test("the start screen states the blueprint's facts", async ({ page }) => {
    await page.goto("/exam");
    await expect(page.getByText("Questions", { exact: true })).toBeVisible();
    await expect(page.getByText(String(total), { exact: true }).first()).toBeVisible();

    // The time limit and passing score are literals in this screen while the
    // timer reads blueprint.timeLimitSeconds. Asserting the blueprint's values
    // is deliberate: if the blueprint moves and the copy does not, this fails —
    // the duplication ADR-0002 exists to catch.
    await expect(page.getByText(`${blueprint.timeLimitSeconds / 60} min`)).toBeVisible();
    await expect(page.getByText(`${Math.round(blueprint.passingScore * 100)}%`)).toBeVisible();
  });

  test("Begin Exam draws the blueprint's count and starts the clock", async ({ page }) => {
    await page.goto("/exam");
    await page.getByRole("button", { name: "Begin Exam" }).click();

    await expect(page.getByTestId("exam-question")).toBeVisible();
    await expect(page.getByText(`Question 1 of ${total}`)).toBeVisible();
    await expect(page.getByText(`Answered: 0/${total}`)).toBeVisible();
    await expect(page.getByTestId("exam-timer")).toContainText(/^\s*\d:\d\d:\d\d\s*$/);
  });

  test("the navigator holds one cell per drawn Question", async ({ page }) => {
    await page.goto("/exam");
    await page.getByRole("button", { name: "Begin Exam" }).click();
    await navToggle(page).click();
    await expect(page.getByTestId("exam-nav-cell")).toHaveCount(total);
  });

  test("answering, flagging and jumping all hold their state", async ({ page }) => {
    await page.goto("/exam");
    await page.getByRole("button", { name: "Begin Exam" }).click();

    const firstStem = (await page.getByTestId("exam-question").textContent()) ?? "";
    await page.getByTestId("exam-option").first().click();
    await expect(page.getByText(`Answered: 1/${total}`)).toBeVisible();

    await page.getByRole("button", { name: "Flag" }).click();
    await expect(page.getByText("Flagged: 1")).toBeVisible();

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText(`Question 2 of ${total}`)).toBeVisible();
    await expect(page.getByTestId("exam-question")).not.toHaveText(firstStem);

    await navToggle(page).click();
    await page.getByTestId("exam-nav-cell").first().click();
    await expect(page.getByTestId("exam-question")).toHaveText(firstStem);
    await expect(page.getByText(`Answered: 1/${total}`)).toBeVisible();
  });

  test("the clock counts down from the blueprint's limit", async ({ page }) => {
    await page.goto("/exam");
    await page.getByRole("button", { name: "Begin Exam" }).click();

    const start = (await page.getByTestId("exam-timer").textContent())?.trim();
    expect(start).toBe(formatTime(blueprint.timeLimitSeconds));
    await expect(page.getByTestId("exam-timer")).not.toHaveText(start ?? "", { timeout: 5_000 });
  });

  test("Submit Exam carries the sitting to the results screen", async ({ page }) => {
    await page.goto("/exam");
    await page.getByRole("button", { name: "Begin Exam" }).click();

    await page.getByTestId("exam-option").first().click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByTestId("exam-option").nth(1).click();

    // Submit Exam only exists on the last Question — there is no hand-in-early
    // control, so reaching the end is part of the journey.
    await navToggle(page).click();
    await page.getByTestId("exam-nav-cell").last().click();
    await expect(page.getByText(`Question ${total} of ${total}`)).toBeVisible();

    await page.getByRole("button", { name: "Submit Exam" }).click();
    await expect(page).toHaveURL(/\/results\?/);
    await expect(page.getByRole("heading", { name: "Exam Results" })).toBeVisible();

    // The whole sitting travels in the URL, and the seed is what lets /results
    // rebuild the same Draw. ADR-0004 moves all of this server-side; until then,
    // these parameters are the contract between the two screens.
    const url = new URL(page.url());
    expect(url.searchParams.get("seed")).toMatch(/^\d+$/);
    expect(Number(url.searchParams.get("total"))).toBe(total);
    expect(Number(url.searchParams.get("score"))).toBeGreaterThanOrEqual(0);
    expect(JSON.parse(url.searchParams.get("answers") ?? "[]")).toHaveLength(total);
  });

  test("there is no way to submit before the last Question", async ({ page }) => {
    // Pinned behaviour, worth knowing: a candidate who has answered everything
    // must still walk to the end to hand in. The real test lets you submit at
    // any point, so this is a fidelity gap, not just a UI quirk.
    await page.goto("/exam");
    await page.getByRole("button", { name: "Begin Exam" }).click();
    await expect(page.getByRole("button", { name: "Submit Exam" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
  });

  test("two sittings draw different exams", async ({ page }) => {
    await page.goto("/exam");
    await page.getByRole("button", { name: "Begin Exam" }).click();
    const first = await page.getByTestId("exam-question").textContent();

    await page.goto("/exam");
    await page.getByRole("button", { name: "Begin Exam" }).click();
    const second = await page.getByTestId("exam-question").textContent();

    // A fresh seed per attempt. Identical first stems would mean the seed
    // stopped varying and every candidate sat the same exam.
    expect(first).not.toBe(second);
  });

  test("a reload abandons the sitting", async ({ page }) => {
    // Pinned as current behaviour, and it is the bug ADR-0004 fixes: the seed is
    // chosen in a component initialiser, so a reload silently starts a
    // different Draw with the clock reset.
    await page.goto("/exam");
    await page.getByRole("button", { name: "Begin Exam" }).click();
    await page.getByTestId("exam-option").first().click();

    await page.reload();
    await expect(page.getByRole("button", { name: "Begin Exam" })).toBeVisible();
  });
});
