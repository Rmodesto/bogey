import fs from "fs";
import path from "path";
import {
  FAARefSchema,
  ACSRefSchema,
  FigureAssetSchema,
  ModuleFileSchema,
  QuestionSchema,
  ExamBlueprintSchema,
} from "../../src/lib/part107/schema";
import type {
  FAAReference,
  ACSRef,
  FigureAsset,
  Module,
  Lesson,
  Question,
  ExamBlueprint,
} from "../../src/lib/part107/schema";

const CONTENT_DIR = path.resolve(__dirname, "../../content/part107");

function readJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function globJSON(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f));
}

// Normalized similarity for near-duplicate detection
function normalizedSimilarity(a: string, b: string): number {
  const an = a.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  const bn = b.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  if (an === bn) return 1;
  const longer = an.length > bn.length ? an : bn;
  const shorter = an.length > bn.length ? bn : an;
  if (longer.length === 0) return 1;
  // Levenshtein
  const costs: number[] = [];
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (longer[i - 1] !== shorter[j - 1]) {
          newValue = Math.min(newValue, lastValue, costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }
  return (longer.length - costs[shorter.length]) / longer.length;
}

export interface ValidationResult {
  errors: string[];
  warnings: string[];
  data: {
    references: FAAReference[];
    acsRefs: ACSRef[];
    figures: FigureAsset[];
    modules: Module[];
    lessons: Lesson[];
    questions: Question[];
    blueprints: ExamBlueprint[];
  } | null;
}

export function validate(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Parse all content
  let references: FAAReference[] = [];
  let acsRefs: ACSRef[] = [];
  let figures: FigureAsset[] = [];
  const modules: Module[] = [];
  const lessons: Lesson[] = [];
  const questions: Question[] = [];
  let blueprints: ExamBlueprint[] = [];

  try {
    const raw = readJSON(path.join(CONTENT_DIR, "references.json"));
    references = raw.map((r: unknown, i: number) => {
      const result = FAARefSchema.safeParse(r);
      if (!result.success) {
        errors.push(`references.json[${i}]: ${result.error.message}`);
        return null;
      }
      return result.data;
    }).filter(Boolean);
  } catch (e: any) {
    errors.push(`Failed to read references.json: ${e.message}`);
  }

  try {
    const raw = readJSON(path.join(CONTENT_DIR, "acs.json"));
    acsRefs = raw.map((r: unknown, i: number) => {
      const result = ACSRefSchema.safeParse(r);
      if (!result.success) {
        errors.push(`acs.json[${i}]: ${result.error.message}`);
        return null;
      }
      return result.data;
    }).filter(Boolean);
  } catch (e: any) {
    errors.push(`Failed to read acs.json: ${e.message}`);
  }

  try {
    const raw = readJSON(path.join(CONTENT_DIR, "figures/manifest.json"));
    figures = raw.map((r: unknown, i: number) => {
      const result = FigureAssetSchema.safeParse(r);
      if (!result.success) {
        errors.push(`figures/manifest.json[${i}]: ${result.error.message}`);
        return null;
      }
      return result.data;
    }).filter(Boolean);
  } catch (e: any) {
    errors.push(`Failed to read figures/manifest.json: ${e.message}`);
  }

  // Modules
  for (const file of globJSON(path.join(CONTENT_DIR, "modules"))) {
    try {
      const raw = readJSON(file);
      const result = ModuleFileSchema.safeParse(raw);
      if (!result.success) {
        errors.push(`${path.basename(file)}: ${result.error.message}`);
        continue;
      }
      modules.push(result.data.module);
      lessons.push(...result.data.lessons);
    } catch (e: any) {
      errors.push(`Failed to read ${path.basename(file)}: ${e.message}`);
    }
  }

  // Questions
  for (const file of globJSON(path.join(CONTENT_DIR, "questions"))) {
    try {
      const raw = readJSON(file);
      for (let i = 0; i < raw.length; i++) {
        const result = QuestionSchema.safeParse(raw[i]);
        if (!result.success) {
          errors.push(`${path.basename(file)}[${i}]: ${result.error.message}`);
          continue;
        }
        questions.push(result.data as Question);
      }
    } catch (e: any) {
      errors.push(`Failed to read ${path.basename(file)}: ${e.message}`);
    }
  }

  // Blueprints
  try {
    const raw = readJSON(path.join(CONTENT_DIR, "exams/blueprints.json"));
    blueprints = raw.map((r: unknown, i: number) => {
      const result = ExamBlueprintSchema.safeParse(r);
      if (!result.success) {
        errors.push(`blueprints.json[${i}]: ${result.error.message}`);
        return null;
      }
      return result.data;
    }).filter(Boolean);
  } catch (e: any) {
    errors.push(`Failed to read blueprints.json: ${e.message}`);
  }

  if (errors.length > 0) {
    return { errors, warnings, data: null };
  }

  // 2. Unique ID enforcement
  const allIds = new Map<string, string>();
  function checkId(id: string, source: string) {
    if (allIds.has(id)) {
      errors.push(`Duplicate ID "${id}" in ${source} (also in ${allIds.get(id)})`);
    }
    allIds.set(id, source);
  }
  references.forEach((r) => checkId(r.id, "references"));
  acsRefs.forEach((r) => checkId(r.id, "acs"));
  figures.forEach((r) => checkId(r.id, "figures"));
  modules.forEach((r) => checkId(r.id, "modules"));
  lessons.forEach((r) => checkId(r.id, "lessons"));
  questions.forEach((r) => checkId(r.id, "questions"));
  blueprints.forEach((r) => checkId(r.id, "blueprints"));

  // 3. Referential integrity
  const refIds = new Set(references.map((r) => r.id));
  const acsIds = new Set(acsRefs.map((r) => r.id));
  const figureIdSet = new Set(figures.map((r) => r.id));
  const moduleIds = new Set(modules.map((r) => r.id));
  const lessonIds = new Set(lessons.map((r) => r.id));

  for (const mod of modules) {
    for (const lid of mod.lessonIds) {
      if (!lessonIds.has(lid)) errors.push(`Module "${mod.id}" references missing lesson "${lid}"`);
    }
    for (const rid of mod.references) {
      if (!refIds.has(rid)) errors.push(`Module "${mod.id}" references missing reference "${rid}"`);
    }
  }

  for (const les of lessons) {
    if (!moduleIds.has(les.moduleId)) errors.push(`Lesson "${les.id}" references missing module "${les.moduleId}"`);
    for (const rid of les.references) {
      if (!refIds.has(rid)) errors.push(`Lesson "${les.id}" references missing reference "${rid}"`);
    }
    if (les.acsRefs) {
      for (const aid of les.acsRefs) {
        if (!acsIds.has(aid)) errors.push(`Lesson "${les.id}" references missing ACS ref "${aid}"`);
      }
    }
  }

  for (const q of questions) {
    if (!moduleIds.has(q.moduleId)) errors.push(`Question "${q.id}" references missing module "${q.moduleId}"`);
    if (q.lessonId && !lessonIds.has(q.lessonId)) errors.push(`Question "${q.id}" references missing lesson "${q.lessonId}"`);
    for (const rid of q.explanation.references) {
      if (!refIds.has(rid)) errors.push(`Question "${q.id}" references missing reference "${rid}"`);
    }
    if (q.acsRefs) {
      for (const aid of q.acsRefs) {
        if (!acsIds.has(aid)) errors.push(`Question "${q.id}" references missing ACS ref "${aid}"`);
      }
    }
    if (q.figureIds) {
      for (const fid of q.figureIds) {
        if (!figureIdSet.has(fid)) errors.push(`Question "${q.id}" references missing figure "${fid}"`);
      }
    }
  }

  // 4. Blueprint validation
  for (const bp of blueprints) {
    const weightSum = bp.domainWeights.reduce((s, d) => s + d.weight, 0);
    if (Math.abs(weightSum - 1.0) > 0.01) {
      errors.push(`Blueprint "${bp.id}" domain weights sum to ${weightSum}, expected ~1.0`);
    }
    for (const dw of bp.domainWeights) {
      const domainQs = questions.filter((q) => q.domain === dw.domain && q.status === "active");
      if (domainQs.length === 0) {
        errors.push(`Blueprint "${bp.id}" references domain "${dw.domain}" with no active questions`);
      }
    }
  }

  // 5. Near-duplicate stem detection (warning only)
  for (let i = 0; i < questions.length; i++) {
    for (let j = i + 1; j < questions.length; j++) {
      const sim = normalizedSimilarity(questions[i].stem, questions[j].stem);
      if (sim > 0.85) {
        warnings.push(`Near-duplicate stems: "${questions[i].id}" and "${questions[j].id}" (similarity: ${(sim * 100).toFixed(1)}%)`);
      }
    }
  }

  return {
    errors,
    warnings,
    data: { references, acsRefs, figures, modules, lessons, questions, blueprints },
  };
}

// CLI entry point
if (require.main === module || process.argv[1]?.includes("validate")) {
  const result = validate();
  if (result.warnings.length > 0) {
    console.warn("\n⚠ Warnings:");
    result.warnings.forEach((w) => console.warn(`  - ${w}`));
  }
  if (result.errors.length > 0) {
    console.error("\n✗ Validation failed:");
    result.errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log("\n✓ Validation passed");
  if (result.data) {
    console.log(`  ${result.data.modules.length} modules, ${result.data.lessons.length} lessons, ${result.data.questions.length} questions, ${result.data.blueprints.length} blueprints`);
  }
}
