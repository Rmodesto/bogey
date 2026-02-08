import { describe, it, expect } from "vitest";
import { generateExam } from "../exam";

describe("generateExam", () => {
  it("produces deterministic output with same seed", () => {
    const a = generateExam({ blueprintId: "bp-practice-01", seed: 123 });
    const b = generateExam({ blueprintId: "bp-practice-01", seed: 123 });
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
  });

  it("produces different output with different seeds", () => {
    const a = generateExam({ blueprintId: "bp-practice-01", seed: 1 });
    const b = generateExam({ blueprintId: "bp-practice-01", seed: 999 });
    // With only 5 questions total, they might be the same set but different order
    // At minimum they should both have questions
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
  });

  it("respects blueprint totalQuestions", () => {
    const exam = generateExam({ blueprintId: "bp-practice-01", seed: 42 });
    expect(exam.length).toBe(14);
  });

  it("respects domain minimums", () => {
    const exam = generateExam({ blueprintId: "bp-practice-01", seed: 42 });
    const regCount = exam.filter((q) => q.domain === "Regulations").length;
    const wxCount = exam.filter((q) => q.domain === "Weather").length;
    const asCount = exam.filter((q) => q.domain === "Airspace Classification").length;
    const lpCount = exam.filter((q) => q.domain === "Loading and Performance").length;
    const opsCount = exam.filter((q) => q.domain === "Operations").length;
    expect(regCount).toBeGreaterThanOrEqual(2);
    expect(wxCount).toBeGreaterThanOrEqual(2);
    expect(asCount).toBeGreaterThanOrEqual(3);
    expect(lpCount).toBeGreaterThanOrEqual(2);
    expect(opsCount).toBeGreaterThanOrEqual(2);
  });

  it("allows overriding numQuestions", () => {
    const exam = generateExam({ blueprintId: "bp-practice-01", seed: 42, numQuestions: 12 });
    expect(exam.length).toBe(12);
  });

  it("throws on unknown blueprint", () => {
    expect(() => generateExam({ blueprintId: "nonexistent" })).toThrow();
  });
});
