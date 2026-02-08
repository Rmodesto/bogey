import { loadQuestions, loadExamBlueprints } from "./loaders";
import type { DenormalizedQuestion } from "./loaders";

export type GeneratedQuestion = DenormalizedQuestion;

// Deterministic seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface GenerateExamOptions {
  blueprintId: string;
  seed?: number;
  numQuestions?: number;
}

export function generateExam(options: GenerateExamOptions): GeneratedQuestion[] {
  const blueprints = loadExamBlueprints();
  const bp = blueprints.find((b) => b.id === options.blueprintId);
  if (!bp) throw new Error(`Blueprint "${options.blueprintId}" not found`);

  const totalQuestions = options.numQuestions ?? bp.totalQuestions;
  const seed = options.seed ?? Date.now();
  const rng = mulberry32(seed);

  const allQuestions = loadQuestions().filter((q) => q.status === "active");
  const questionsByDomain = new Map<string, DenormalizedQuestion[]>();
  for (const q of allQuestions) {
    const list = questionsByDomain.get(q.domain) || [];
    list.push(q);
    questionsByDomain.set(q.domain, list);
  }

  const selected = new Set<string>();
  const result: DenormalizedQuestion[] = [];

  // 1. Fulfill per-domain minimums
  for (const dw of bp.domainWeights) {
    const pool = shuffle(questionsByDomain.get(dw.domain) || [], rng);
    let count = 0;
    for (const q of pool) {
      if (count >= dw.minQuestions) break;
      if (!selected.has(q.id)) {
        result.push(q);
        selected.add(q.id);
        count++;
      }
    }
  }

  // 2. Fill remaining slots by weighted random selection
  const remaining = totalQuestions - result.length;
  if (remaining > 0) {
    const pool = allQuestions.filter((q) => !selected.has(q.id));
    const shuffled = shuffle(pool, rng);
    for (let i = 0; i < Math.min(remaining, shuffled.length); i++) {
      result.push(shuffled[i]);
      selected.add(shuffled[i].id);
    }
  }

  // 3. Shuffle final result deterministically
  return shuffle(result, rng);
}
