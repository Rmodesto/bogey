import { z } from "zod";

// --- FAA Reference ---
export const FAARefSchema = z.object({
  id: z.string(),
  title: z.string(),
  docId: z.string(),
  url: z.string().optional(),
  section: z.string().optional(),
  revisionDate: z.string().optional(),
});
export type FAAReference = z.infer<typeof FAARefSchema>;

// --- ACS Reference ---
export const ACSRefSchema = z.object({
  id: z.string(),
  code: z.string(),
  area: z.string(),
  subject: z.string(),
  description: z.string().optional(),
  version: z.number(),
});
export type ACSRef = z.infer<typeof ACSRefSchema>;

// --- Figure Asset ---
export const FigureAssetSchema = z.object({
  id: z.string(),
  filename: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  sourceRefId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export type FigureAsset = z.infer<typeof FigureAssetSchema>;

// --- Choice ---
export const ChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCorrect: z.boolean(),
});
export type Choice = z.infer<typeof ChoiceSchema>;

// --- Explanation ---
export const ExplanationSchema = z.object({
  correct: z.string(),
  reason: z.string(),
  keyTakeaway: z.string(),
  references: z.array(z.string()),
});
export type Explanation = z.infer<typeof ExplanationSchema>;

// --- Question ---
export const QuestionSchema = z
  .object({
    id: z.string(),
    stem: z.string(),
    choices: z.array(ChoiceSchema).min(2),
    explanation: ExplanationSchema,
    domain: z.string(),
    moduleId: z.string(),
    lessonId: z.string().optional(),
    acsRefs: z.array(z.string()).optional(),
    figureIds: z.array(z.string()).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    status: z.enum(["active", "draft", "retired"]),
    version: z.number(),
  })
  .refine(
    (q) => q.choices.filter((c) => c.isCorrect).length === 1,
    { message: "Each question must have exactly one correct choice" }
  );
export type Question = z.infer<typeof QuestionSchema>;

// --- Visualizer Config ---
export const VisualizerConfigSchema = z.object({
  type: z.enum(["airspace", "metar"]),
  config: z.record(z.string(), z.unknown()).optional(),
});
export type VisualizerConfig = z.infer<typeof VisualizerConfigSchema>;

// --- Bogeyman Config ---
export const BogeymanConfigSchema = z.object({
  message: z.string(),
  mood: z.enum(["neutral", "happy", "warning", "celebrating"]),
});
export type BogeymanConfig = z.infer<typeof BogeymanConfigSchema>;

// --- Lesson Section ---
export const LessonSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  visualizer: VisualizerConfigSchema.optional(),
  bogeyman: BogeymanConfigSchema.optional(),
});
export type LessonSection = z.infer<typeof LessonSectionSchema>;

// --- Lesson ---
export const LessonSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  title: z.string(),
  order: z.number(),
  objectives: z.array(z.string()).min(1),
  references: z.array(z.string()).min(1),
  acsRefs: z.array(z.string()).optional(),
  estimatedMinutes: z.number().int().min(1),
  sections: z.array(LessonSectionSchema).min(1),
  version: z.number(),
});
export type Lesson = z.infer<typeof LessonSchema>;

// --- Module ---
export const ModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  domain: z.string(),
  order: z.number(),
  lessonIds: z.array(z.string()).min(1),
  references: z.array(z.string()).min(1),
  icon: z.string(),
  estimatedHours: z.number().min(0),
  version: z.number(),
});
export type Module = z.infer<typeof ModuleSchema>;

// --- Domain Weight ---
export const DomainWeightSchema = z.object({
  domain: z.string(),
  weight: z.number().min(0).max(1),
  minQuestions: z.number().int().min(0),
});
export type DomainWeight = z.infer<typeof DomainWeightSchema>;

// --- Exam Blueprint ---
export const ExamBlueprintSchema = z.object({
  id: z.string(),
  title: z.string(),
  totalQuestions: z.number().int().min(1),
  timeLimitSeconds: z.number().int().min(1),
  passingScore: z.number().min(0).max(1),
  domainWeights: z.array(DomainWeightSchema),
  version: z.number(),
});
export type ExamBlueprint = z.infer<typeof ExamBlueprintSchema>;

// --- Module file (module + lessons bundled) ---
export const ModuleFileSchema = z.object({
  module: ModuleSchema,
  lessons: z.array(LessonSchema).min(1),
});
export type ModuleFile = z.infer<typeof ModuleFileSchema>;
