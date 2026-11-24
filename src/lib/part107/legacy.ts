import type { DenormalizedQuestion } from "./loaders";

// The legacy question shape the study/exam/results UIs render. Pure module —
// no loader imports — so client components can convert a server-provided bank
// without pulling the generated JSON into the bundle.

// Legacy Question interface matching the original hardcoded question shape
export interface LegacyQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: {
    correct: string;
    reason: string;
    keyTakeaway: string;
  };
  domain: string;
  regulation?: string;
}

export function toLegacyQuestion(q: DenormalizedQuestion, index: number): LegacyQuestion {
  const correctIndex = q.choices.findIndex((c) => c.isCorrect);
  const firstRef = q.explanation.resolvedReferences?.[0];
  return {
    id: index + 1,
    question: q.stem,
    options: q.choices.map((c) => c.text),
    correctAnswer: correctIndex,
    explanation: {
      correct: q.explanation.correct,
      reason: q.explanation.reason,
      keyTakeaway: q.explanation.keyTakeaway,
    },
    domain: q.domain,
    regulation: firstRef ? `${firstRef.docId}${firstRef.section ? ` ${firstRef.section}` : ""}` : undefined,
  };
}
