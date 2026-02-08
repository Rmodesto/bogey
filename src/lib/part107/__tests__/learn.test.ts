import { describe, it, expect } from "vitest";
import { listModules } from "../service";

describe("learning module content", () => {
  const modules = listModules();

  it("modules have icon and estimatedHours", () => {
    for (const mod of modules) {
      expect(mod.icon).toBeDefined();
      expect(typeof mod.icon).toBe("string");
      expect(mod.icon.length).toBeGreaterThan(0);
      expect(mod.estimatedHours).toBeGreaterThanOrEqual(0);
    }
  });

  it("every lesson has at least 1 section", () => {
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        expect(lesson.sections.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("section content is non-empty string", () => {
    for (const mod of modules) {
      for (const lesson of mod.lessons) {
        for (const section of lesson.sections) {
          expect(typeof section.content).toBe("string");
          expect(section.content.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
