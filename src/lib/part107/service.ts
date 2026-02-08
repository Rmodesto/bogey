import { loadQuestions, loadModules, loadExamBlueprints } from "./loaders";
import type { DenormalizedQuestion, DenormalizedModule } from "./loaders";
import type { ExamBlueprint } from "./schema";
export { generateExam } from "./exam";
export type { GeneratedQuestion, GenerateExamOptions } from "./exam";

// Module-level cached maps
let questionMap: Map<string, DenormalizedQuestion> | null = null;
let moduleMap: Map<string, DenormalizedModule> | null = null;

function getQuestionMap() {
  if (!questionMap) {
    questionMap = new Map(loadQuestions().map((q) => [q.id, q]));
  }
  return questionMap;
}

function getModuleMap() {
  if (!moduleMap) {
    moduleMap = new Map(loadModules().map((m) => [m.id, m]));
  }
  return moduleMap;
}

export function getModule(id: string): DenormalizedModule | undefined {
  return getModuleMap().get(id);
}

export function listModules(): DenormalizedModule[] {
  return loadModules().sort((a, b) => a.order - b.order);
}

export function listLessons(moduleId: string) {
  const mod = getModule(moduleId);
  return mod?.lessons ?? [];
}

export function getQuestion(id: string): DenormalizedQuestion | undefined {
  return getQuestionMap().get(id);
}

export interface QueryQuestionsFilter {
  domain?: string;
  moduleId?: string;
  lessonId?: string;
  difficulty?: "easy" | "medium" | "hard";
  acsRefIds?: string[];
}

export function queryQuestions(filter: QueryQuestionsFilter): DenormalizedQuestion[] {
  let qs = loadQuestions();
  if (filter.domain) qs = qs.filter((q) => q.domain === filter.domain);
  if (filter.moduleId) qs = qs.filter((q) => q.moduleId === filter.moduleId);
  if (filter.lessonId) qs = qs.filter((q) => q.lessonId === filter.lessonId);
  if (filter.difficulty) qs = qs.filter((q) => q.difficulty === filter.difficulty);
  if (filter.acsRefIds && filter.acsRefIds.length > 0) {
    const set = new Set(filter.acsRefIds);
    qs = qs.filter((q) => q.acsRefs?.some((a) => set.has(a)));
  }
  return qs;
}

export function getLesson(moduleId: string, lessonId: string) {
  const mod = getModule(moduleId);
  return mod?.lessons.find((l) => l.id === lessonId);
}

export function getAdjacentLessons(moduleId: string, lessonId: string) {
  const lessons = listLessons(moduleId);
  const idx = lessons.findIndex((l) => l.id === lessonId);
  return {
    prev: idx > 0 ? lessons[idx - 1] : null,
    next: idx < lessons.length - 1 ? lessons[idx + 1] : null,
  };
}

export function getBlueprint(id: string): ExamBlueprint | undefined {
  return loadExamBlueprints().find((b) => b.id === id);
}

export function listBlueprints(): ExamBlueprint[] {
  return loadExamBlueprints();
}
