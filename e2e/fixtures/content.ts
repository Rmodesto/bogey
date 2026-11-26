import { readFileSync } from "node:fs";
import path from "node:path";

// Specs assert against the built content, never against numbers typed into a
// test. ADR-0002 makes the Exam Blueprint the single source of exam facts, so
// a spec hardcoding "60 questions" would repeat the mistake that ADR exists to
// prevent. `npm run build` regenerates these before the server boots.
const dir = path.join(process.cwd(), "generated", "part107");

const read = <T>(file: string): T =>
  JSON.parse(readFileSync(path.join(dir, file), "utf8")) as T;

export type Blueprint = {
  id: string;
  totalQuestions: number;
  timeLimitSeconds: number;
  passingScore: number;
  domainWeights: { domain: string; weight: number; minQuestions: number }[];
};

export type Lesson = { id: string; title: string; sections: { id: string; title: string }[] };
export type Module = { id: string; title: string; lessons: Lesson[] };
export type Question = { id: string; domain: string; lessonId: string; status: string };

export const blueprint = read<Blueprint[]>("blueprints.json")[0];
export const modules = read<Module[]>("modules.json");
export const questions = read<Question[]>("questions.json");
export const domains = read<{ id: string; name: string }[]>("domains.json");

export const activeQuestions = questions.filter((q) => q.status === "active");

/** The first lesson of the first module — the only one the shelf unlocks today. */
export const firstModule = modules[0];
export const firstLesson = firstModule.lessons[0];

/** A lesson carrying Questions, so its Knowledge Check renders. */
export const lessonWithQuiz = (() => {
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (activeQuestions.some((q) => q.lessonId === lesson.id)) {
        return { moduleId: mod.id, lesson };
      }
    }
  }
  throw new Error("No lesson has Questions; the quiz journey cannot be tested");
})();

/**
 * The lesson with the fewest Questions, so the "finish the whole check" journey
 * stays runnable as the bank grows. Picking the first lesson with any Questions
 * made that spec skip itself once the bank reached 500.
 */
export const lessonWithShortestQuiz = (() => {
  let best: { moduleId: string; lesson: Lesson; count: number } | null = null;
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      const count = activeQuestions.filter((q) => q.lessonId === lesson.id).length;
      if (count > 0 && (!best || count < best.count)) best = { moduleId: mod.id, lesson, count };
    }
  }
  if (!best) throw new Error("No lesson has Questions; the check journey cannot be tested");
  return best;
})();

export const quizQuestionCount = (lessonId: string) =>
  activeQuestions.filter((q) => q.lessonId === lessonId).length;

/** Mirrors formatTime in src/lib/utils.ts. */
export const formatTime = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/** The Pass Threshold is a count, not a rounded percentage (ADR-0002). */
export const passThreshold = (asked: number) => Math.ceil(blueprint.passingScore * asked);
