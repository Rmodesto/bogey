import { describe, it, expect } from "vitest";
import { generateExam, allocateByWeight } from "../exam";

describe("generateExam", () => {
  it("produces deterministic output with same seed", () => {
    const a = generateExam({ blueprintId: "bp-practice-01", seed: 123 });
    const b = generateExam({ blueprintId: "bp-practice-01", seed: 123 });
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
  });

  it("produces different output with different seeds", () => {
    const a = generateExam({ blueprintId: "bp-practice-01", seed: 1 });
    const b = generateExam({ blueprintId: "bp-practice-01", seed: 999 });
    expect(a.length).toBe(b.length);
    expect(a.map((q) => q.id)).not.toEqual(b.map((q) => q.id));
  });

  it("respects blueprint totalQuestions", () => {
    const exam = generateExam({ blueprintId: "bp-practice-01", seed: 42 });
    expect(exam.length).toBe(60);
  });

  it("matches the blueprint's domain split (48/20/25/5/2 of 60)", () => {
    const exam = generateExam({ blueprintId: "bp-practice-01", seed: 42 });
    const regCount = exam.filter((q) => q.domain === "Regulations").length;
    const wxCount = exam.filter((q) => q.domain === "Weather").length;
    const asCount = exam.filter((q) => q.domain === "Airspace Classification").length;
    const lpCount = exam.filter((q) => q.domain === "Loading and Performance").length;
    const opsCount = exam.filter((q) => q.domain === "Operations").length;
    expect(regCount).toBe(29);
    expect(asCount).toBe(12);
    expect(opsCount).toBe(15);
    expect(wxCount).toBe(3);
    expect(lpCount).toBe(1);
  });

  it("has no duplicate questions", () => {
    const exam = generateExam({ blueprintId: "bp-practice-01", seed: 42 });
    expect(new Set(exam.map((q) => q.id)).size).toBe(exam.length);
  });

  it("allocates by weight and always sums to the requested total", () => {
    const weights = [
      { domain: "A", weight: 0.48, minQuestions: 29 },
      { domain: "B", weight: 0.2, minQuestions: 12 },
      { domain: "C", weight: 0.05, minQuestions: 3 },
      { domain: "D", weight: 0.02, minQuestions: 1 },
      { domain: "E", weight: 0.25, minQuestions: 15 },
    ];
    for (const total of [1, 5, 12, 30, 60, 65, 120]) {
      const alloc = allocateByWeight(weights, total);
      const sum = Array.from(alloc.values()).reduce((s, n) => s + n, 0);
      expect(sum).toBe(total);
    }
    const full = allocateByWeight(weights, 60);
    expect(Array.from(full.values())).toEqual([29, 12, 3, 1, 15]);
  });

  it("allows overriding numQuestions", () => {
    const exam = generateExam({ blueprintId: "bp-practice-01", seed: 42, numQuestions: 12 });
    expect(exam.length).toBe(12);
  });

  it("throws on unknown blueprint", () => {
    expect(() => generateExam({ blueprintId: "nonexistent" })).toThrow();
  });
});
