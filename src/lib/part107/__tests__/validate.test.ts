import { describe, it, expect, vi } from "vitest";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.resolve(__dirname, "../../../../content/part107");

// Helper to run validation with modified content
async function runValidate() {
  vi.resetModules();
  const mod = await import("../../../../scripts/part107/validate");
  return mod.validate();
}

describe("validate", () => {
  it("passes with valid sample content", async () => {
    const result = await runValidate();
    expect(result.errors).toHaveLength(0);
    expect(result.data).not.toBeNull();
  });

  it("fails on duplicate IDs", async () => {
    const refsPath = path.join(CONTENT_DIR, "references.json");
    const original = fs.readFileSync(refsPath, "utf-8");
    try {
      const refs = JSON.parse(original);
      refs.push({ ...refs[0] });
      fs.writeFileSync(refsPath, JSON.stringify(refs));
      const result = await runValidate();
      expect(result.errors.some((e: string) => e.includes("Duplicate ID"))).toBe(true);
    } finally {
      fs.writeFileSync(refsPath, original);
    }
  });

  it("fails on missing reference", async () => {
    const modPath = path.join(CONTENT_DIR, "modules/regulations.json");
    const original = fs.readFileSync(modPath, "utf-8");
    try {
      const data = JSON.parse(original);
      data.module.references = ["ref-nonexistent"];
      fs.writeFileSync(modPath, JSON.stringify(data));
      const result = await runValidate();
      expect(result.errors.some((e: string) => e.includes("missing reference"))).toBe(true);
    } finally {
      fs.writeFileSync(modPath, original);
    }
  });

  it("validates lesson sections correctly", async () => {
    const result = await runValidate();
    expect(result.errors).toHaveLength(0);
    expect(result.data).not.toBeNull();
    const lessons = result.data!.lessons;
    for (const lesson of lessons) {
      expect(lesson.sections.length).toBeGreaterThanOrEqual(1);
      for (const section of lesson.sections) {
        expect(section.id).toBeTruthy();
        expect(section.title).toBeTruthy();
        expect(section.content).toBeTruthy();
      }
    }
  });

  it("fails on missing sections field", async () => {
    const modPath = path.join(CONTENT_DIR, "modules/regulations.json");
    const original = fs.readFileSync(modPath, "utf-8");
    try {
      const data = JSON.parse(original);
      delete data.lessons[0].sections;
      fs.writeFileSync(modPath, JSON.stringify(data));
      const result = await runValidate();
      expect(result.errors.length).toBeGreaterThan(0);
    } finally {
      fs.writeFileSync(modPath, original);
    }
  });

  it("fails on invalid visualizer type", async () => {
    const modPath = path.join(CONTENT_DIR, "modules/regulations.json");
    const original = fs.readFileSync(modPath, "utf-8");
    try {
      const data = JSON.parse(original);
      data.lessons[0].sections[0].visualizer = { type: "invalid" };
      fs.writeFileSync(modPath, JSON.stringify(data));
      const result = await runValidate();
      expect(result.errors.length).toBeGreaterThan(0);
    } finally {
      fs.writeFileSync(modPath, original);
    }
  });

  it("fails when question has wrong number of correct choices", async () => {
    const qPath = path.join(CONTENT_DIR, "questions/regulations.json");
    const original = fs.readFileSync(qPath, "utf-8");
    try {
      const qs = JSON.parse(original);
      qs[0].choices.forEach((c: { isCorrect: boolean }) => (c.isCorrect = true));
      fs.writeFileSync(qPath, JSON.stringify(qs));
      const result = await runValidate();
      expect(result.errors.length).toBeGreaterThan(0);
    } finally {
      fs.writeFileSync(qPath, original);
    }
  });
});
