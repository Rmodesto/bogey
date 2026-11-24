import { allocateByWeight } from "./allocate";
import type { DenormalizedQuestion, DenormalizedBlueprint } from "./loaders";

// Pure exam assembly: everything in this module works on data passed in, so
// client components can generate an exam from a server-provided bank without
// importing the loaders (which would drag the generated JSON into the bundle).

export type GeneratedQuestion = DenormalizedQuestion;

// Deterministic seeded PRNG (mulberry32)
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface GenerateExamFromOptions {
  seed?: number;
  numQuestions?: number;
}

export function generateExamFrom(
  activeQuestions: DenormalizedQuestion[],
  bp: DenormalizedBlueprint,
  options: GenerateExamFromOptions = {}
): GeneratedQuestion[] {
  const totalQuestions = options.numQuestions ?? bp.totalQuestions;
  const seed = options.seed ?? Date.now();
  const rng = mulberry32(seed);

  const questionsByDomain = new Map<string, DenormalizedQuestion[]>();
  for (const q of activeQuestions) {
    const list = questionsByDomain.get(q.domain) || [];
    list.push(q);
    questionsByDomain.set(q.domain, list);
  }

  const selected = new Set<string>();
  const result: DenormalizedQuestion[] = [];

  // 1. Draw each domain's share of the exam, set by the blueprint weights
  const targets = allocateByWeight(bp.domainWeights, totalQuestions);
  for (const dw of bp.domainWeights) {
    const pool = shuffle(questionsByDomain.get(dw.domain) || [], rng);
    const target = targets.get(dw.domain) ?? 0;
    let count = 0;
    for (const q of pool) {
      if (count >= target) break;
      if (!selected.has(q.id)) {
        result.push(q);
        selected.add(q.id);
        count++;
      }
    }
  }

  // 2. If a domain ran short of questions, fill the gap from the rest of the bank
  const remaining = totalQuestions - result.length;
  if (remaining > 0) {
    const pool = activeQuestions.filter((q) => !selected.has(q.id));
    const shuffled = shuffle(pool, rng);
    for (let i = 0; i < Math.min(remaining, shuffled.length); i++) {
      result.push(shuffled[i]);
      selected.add(shuffled[i].id);
    }
  }

  // 3. Shuffle final result deterministically
  return shuffle(result, rng);
}
