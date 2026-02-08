import { describe, it, expect } from "vitest";
import { queryQuestions, listModules, getModule, getQuestion, getLesson, getAdjacentLessons } from "../service";
import { toLegacyQuestion } from "../compat";
import { loadQuestions } from "../loaders";

describe("service", () => {
  it("queryQuestions filters by domain", () => {
    const regs = queryQuestions({ domain: "Regulations" });
    expect(regs.length).toBeGreaterThan(0);
    expect(regs.every((q) => q.domain === "Regulations")).toBe(true);
  });

  it("queryQuestions filters by moduleId", () => {
    const qs = queryQuestions({ moduleId: "mod-weather" });
    expect(qs.length).toBeGreaterThan(0);
    expect(qs.every((q) => q.moduleId === "mod-weather")).toBe(true);
  });

  it("queryQuestions filters by difficulty", () => {
    const easy = queryQuestions({ difficulty: "easy" });
    expect(easy.every((q) => q.difficulty === "easy")).toBe(true);
  });

  it("listModules returns sorted modules", () => {
    const mods = listModules();
    expect(mods.length).toBe(5);
    expect(mods[0].order).toBeLessThan(mods[1].order);
  });

  it("getModule returns module with lessons", () => {
    const mod = getModule("mod-regulations");
    expect(mod).toBeDefined();
    expect(mod!.lessons.length).toBeGreaterThan(0);
  });

  it("getLesson returns lesson with sections", () => {
    const lesson = getLesson("mod-regulations", "les-reg-ops");
    expect(lesson).toBeDefined();
    expect(lesson!.sections.length).toBeGreaterThan(0);
    expect(lesson!.estimatedMinutes).toBeGreaterThan(0);
  });

  it("getAdjacentLessons returns correct prev/next", () => {
    const { prev, next } = getAdjacentLessons("mod-regulations", "les-reg-ops");
    expect(prev).toBeNull();
    expect(next).toBeDefined();
    expect(next!.id).toBe("les-reg-responsibilities");

    const adj2 = getAdjacentLessons("mod-regulations", "les-reg-responsibilities");
    expect(adj2.prev).toBeDefined();
    expect(adj2.prev!.id).toBe("les-reg-ops");
    expect(adj2.next).toBeNull();
  });

  it("loaded lessons include estimatedMinutes and sections", () => {
    const mods = listModules();
    for (const mod of mods) {
      for (const lesson of mod.lessons) {
        expect(lesson.estimatedMinutes).toBeGreaterThan(0);
        expect(lesson.sections.length).toBeGreaterThan(0);
      }
    }
  });

  it("getQuestion returns a question by id", () => {
    const q = getQuestion("q-reg-001");
    expect(q).toBeDefined();
    expect(q!.stem).toContain("moving vehicle");
  });
});

describe("toLegacyQuestion", () => {
  it("maps to legacy shape correctly", () => {
    const q = loadQuestions()[0];
    const legacy = toLegacyQuestion(q, 0);
    expect(legacy).toHaveProperty("id", 1);
    expect(legacy).toHaveProperty("question");
    expect(legacy).toHaveProperty("options");
    expect(legacy).toHaveProperty("correctAnswer");
    expect(legacy).toHaveProperty("explanation");
    expect(legacy.explanation).toHaveProperty("correct");
    expect(legacy.explanation).toHaveProperty("reason");
    expect(legacy.explanation).toHaveProperty("keyTakeaway");
    expect(typeof legacy.correctAnswer).toBe("number");
    expect(legacy.options).toBeInstanceOf(Array);
    expect(legacy.options.length).toBeGreaterThanOrEqual(2);
  });
});
