import { loadQuestions, loadExamBlueprints } from "./loaders";
import { generateExam } from "./exam";
import { ACTIVE_BLUEPRINT_ID, ACTIVE_SEED } from "./active";
import { toLegacyQuestion } from "./legacy";
import type { LegacyQuestion } from "./legacy";
import type { DenormalizedQuestion, DenormalizedBlueprint } from "./loaders";

// Server-side bridge to the legacy question shape. The pure conversion lives
// in legacy.ts; everything here touches the loaders and must stay out of
// client components.

export type { LegacyQuestion };
export { toLegacyQuestion };

export function getStudyQuestions(): LegacyQuestion[] {
  return loadQuestions()
    .filter((q) => q.status === "active")
    .map((q, i) => toLegacyQuestion(q, i));
}

// The active question bank and blueprint, for server components that pass
// exam-assembly inputs down to a client island.
export function getActiveBank(): DenormalizedQuestion[] {
  return loadQuestions().filter((q) => q.status === "active");
}

export function getActiveBlueprintData(): DenormalizedBlueprint {
  const bp = loadExamBlueprints().find((b) => b.id === ACTIVE_BLUEPRINT_ID);
  if (!bp) throw new Error(`Active blueprint "${ACTIVE_BLUEPRINT_ID}" not found`);
  return bp;
}

// Fixed-seed exam, kept for tests and tooling that depend on the historical
// deterministic draw. The exam UI now draws a random seed per attempt.
export function getExamQuestions(): LegacyQuestion[] {
  const exam = generateExam({ blueprintId: ACTIVE_BLUEPRINT_ID, seed: ACTIVE_SEED });
  return exam.map((q, i) => toLegacyQuestion(q, i));
}
