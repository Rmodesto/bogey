import { getBlueprint } from "./service";
import type { DenormalizedBlueprint } from "./loaders";

// The single decision of which exam the app runs: blueprint + seed.
// Exam facts (question count, time limit, passing score, weights) live on
// the blueprint record — pages read them from here, never restate them.
export const ACTIVE_BLUEPRINT_ID = "bp-practice-01";
export const ACTIVE_SEED = 42;

export function getActiveBlueprint(): DenormalizedBlueprint {
  const bp = getBlueprint(ACTIVE_BLUEPRINT_ID);
  if (!bp) throw new Error(`Active blueprint "${ACTIVE_BLUEPRINT_ID}" not found`);
  return bp;
}

// Correct answers needed to pass: the passing score applied to the number of
// questions actually asked, rounded up. A count, not a rounded percentage.
export function passThreshold(totalAsked: number): number {
  return Math.ceil(getActiveBlueprint().passingScore * totalAsked);
}
