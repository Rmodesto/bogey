import { test, expect } from "@playwright/test";
import { lessonWithQuiz, quizQuestionCount } from "./fixtures/content";

const { moduleId, lesson } = lessonWithQuiz;
const url = `/learn/${moduleId}/${lesson.id}`;
const checkCount = quizQuestionCount(lesson.id);

/** Section titles may contain regex metacharacters. */
const title = (t: string) => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

// Journey: a candidate reads a lesson section by section, then takes the check.
test.describe("lesson", () => {
  test("renders the lesson and every section in the sidebar", async ({ page }) => {
    await page.goto(url);
    await expect(page.getByRole("heading", { name: lesson.title })).toBeVisible();
    for (const section of lesson.sections) {
      await expect(page.getByRole("button", { name: title(section.title) }).first()).toBeVisible();
    }
  });

  test("Continue and Previous walk the sections", async ({ page }) => {
    test.skip(lesson.sections.length < 2, "lesson has a single section");
    await page.goto(url);

    await expect(page.getByRole("button", { name: "Previous" })).toHaveCount(0);
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("button", { name: "Previous" })).toBeVisible();

    await page.getByRole("button", { name: "Previous" }).click();
    await expect(page.getByRole("button", { name: "Previous" })).toHaveCount(0);
  });

  test("the sidebar jumps straight to the last section", async ({ page }) => {
    test.skip(lesson.sections.length < 2, "lesson has a single section");
    await page.goto(url);
    const last = lesson.sections[lesson.sections.length - 1];
    await page.getByRole("button", { name: title(last.title) }).first().click();
    // The last section swaps Continue for the next-lesson link.
    await expect(page.getByRole("button", { name: "Continue" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Next Lesson|Back to/i }).first()).toBeVisible();
  });

  test("the Knowledge Check appears only on the last section", async ({ page }) => {
    await page.goto(url);
    if (lesson.sections.length > 1) {
      await expect(page.getByText("Knowledge Check")).toHaveCount(0);
    }
    const last = lesson.sections[lesson.sections.length - 1];
    await page.getByRole("button", { name: title(last.title) }).first().click();

    await expect(page.getByText("Knowledge Check")).toBeVisible();
    await expect(page.getByText(`1 / ${checkCount}`)).toBeVisible();
    await expect(page.getByTestId("quiz-choice")).not.toHaveCount(0);
  });

  test("answering a check question reveals the verdict and advances", async ({ page }) => {
    await page.goto(url);
    const last = lesson.sections[lesson.sections.length - 1];
    await page.getByRole("button", { name: title(last.title) }).first().click();

    await page.getByTestId("quiz-choice").first().click();
    await expect(page.getByText(/^(Correct!|Not quite)$/)).toBeVisible();

    const advance = checkCount > 1 ? "Next Question" : "See Results";
    await expect(page.getByRole("button", { name: advance })).toBeVisible();

    if (checkCount > 1) {
      await page.getByRole("button", { name: "Next Question" }).click();
      await expect(page.getByText(`2 / ${checkCount}`)).toBeVisible();
      await expect(page.getByText(/^(Correct!|Not quite)$/)).toHaveCount(0);
    }
  });

  test("finishing every check question shows the result card", async ({ page }) => {
    test.skip(checkCount > 12, `this lesson's check has ${checkCount} questions`);
    await page.goto(url);
    const last = lesson.sections[lesson.sections.length - 1];
    await page.getByRole("button", { name: title(last.title) }).first().click();

    for (let i = 0; i < checkCount; i++) {
      await page.getByTestId("quiz-choice").first().click();
      await page
        .getByRole("button", { name: i === checkCount - 1 ? "See Results" : "Next Question" })
        .click();
    }

    await expect(page.getByTestId("quiz-complete")).toBeVisible();
    // Reported as a percentage today; ADR-0004 makes a check result a count,
    // because check length runs from 1 to 32 Questions depending on the lesson.
    await expect(page.getByText(new RegExp(`out of ${checkCount} correct`))).toBeVisible();
  });

  test("a check result does not survive a reload", async ({ page }) => {
    await page.goto(url);
    const last = lesson.sections[lesson.sections.length - 1];
    await page.getByRole("button", { name: title(last.title) }).first().click();
    await page.getByTestId("quiz-choice").first().click();

    await page.reload();
    await expect(page.getByText("Knowledge Check")).toHaveCount(0);
  });
});
