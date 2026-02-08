import type { FAAReference, ACSRef, FigureAsset, ExamBlueprint, LessonSection } from "./schema";

// These types represent the denormalized build output
export interface DenormalizedQuestion {
  id: string;
  stem: string;
  choices: { id: string; text: string; isCorrect: boolean }[];
  explanation: {
    correct: string;
    reason: string;
    keyTakeaway: string;
    references: string[];
    resolvedReferences: FAAReference[];
  };
  domain: string;
  moduleId: string;
  lessonId?: string;
  acsRefs?: string[];
  figureIds?: string[];
  difficulty: "easy" | "medium" | "hard";
  status: "active" | "draft" | "retired";
  version: number;
}

export interface DenormalizedModule {
  id: string;
  title: string;
  description: string;
  domain: string;
  order: number;
  lessonIds: string[];
  references: string[];
  icon: string;
  estimatedHours: number;
  version: number;
  lessons: {
    id: string;
    moduleId: string;
    title: string;
    order: number;
    objectives: string[];
    references: string[];
    acsRefs?: string[];
    estimatedMinutes: number;
    sections: LessonSection[];
    version: number;
  }[];
}

// Static imports from generated content
import questionsData from "../../../generated/part107/questions.json";
import modulesData from "../../../generated/part107/modules.json";
import blueprintsData from "../../../generated/part107/blueprints.json";
import referencesData from "../../../generated/part107/references.json";
import acsData from "../../../generated/part107/acs.json";
import figuresData from "../../../generated/part107/figures.json";

export function loadQuestions(): DenormalizedQuestion[] {
  return questionsData as DenormalizedQuestion[];
}

export function loadModules(): DenormalizedModule[] {
  return modulesData as DenormalizedModule[];
}

export function loadExamBlueprints(): ExamBlueprint[] {
  return blueprintsData as ExamBlueprint[];
}

export function loadReferences(): FAAReference[] {
  return referencesData as FAAReference[];
}

export function loadACSRefs(): ACSRef[] {
  return acsData as ACSRef[];
}

export function loadFigures(): FigureAsset[] {
  return figuresData as FigureAsset[];
}
