import { loadQuestions, loadExamBlueprints } from "./loaders";
import { generateExamFrom } from "./examCore";
import type { GeneratedQuestion } from "./examCore";

export type { GeneratedQuestion };
export { allocateByWeight } from "./allocate";
export { mulberry32, shuffle, generateExamFrom } from "./examCore";

export interface GenerateExamOptions {
  blueprintId: string;
  seed?: number;
  numQuestions?: number;
}

// Server-side convenience: load the bank and blueprint, then delegate to the
// pure generator in examCore.ts. Client code must use generateExamFrom with
// data passed down from a server component instead of calling this.
export function generateExam(options: GenerateExamOptions): GeneratedQuestion[] {
  const blueprints = loadExamBlueprints();
  const bp = blueprints.find((b) => b.id === options.blueprintId);
  if (!bp) throw new Error(`Blueprint "${options.blueprintId}" not found`);

  const activeQuestions = loadQuestions().filter((q) => q.status === "active");
  return generateExamFrom(activeQuestions, bp, {
    seed: options.seed,
    numQuestions: options.numQuestions,
  });
}
