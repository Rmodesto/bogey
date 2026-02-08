import { loadQuestions } from "./loaders";
import { generateExam } from "./exam";
import type { DenormalizedQuestion } from "./loaders";

// Legacy Question interface matching src/data/questions.ts
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

export function getStudyQuestions(): LegacyQuestion[] {
  return loadQuestions()
    .filter((q) => q.status === "active")
    .map((q, i) => toLegacyQuestion(q, i));
}

export function getExamQuestions(): LegacyQuestion[] {
  const exam = generateExam({ blueprintId: "bp-practice-01", seed: 42 });
  return exam.map((q, i) => toLegacyQuestion(q, i));
}
