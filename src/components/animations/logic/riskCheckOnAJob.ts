// O9 "Risk check on a job" — pure pick logic ported from
// docs/animations/designs/O9-RiskLoopOnAJob.dc.html. Do not re-derive.

// The chip row over the scene, in design order. Each scenario lights
// exactly one chip (the design's c0..c4 values: volt-green vs white).
export const RISK_CHIPS = ["Pilot", "Aircraft", "Environment", "External pressure", "Crew"];

export interface RiskScenario {
  label: string;
  q: string;
  opts: string[];
  a: number; // index of the correct option
  why: string;
  chip: number; // index into RISK_CHIPS of the highlighted chip
}

export const RISK_SCENARIOS: RiskScenario[] = [
  {
    label: "A real-estate shoot. You slept four hours and have a headache.",
    q: "What do you do about it?",
    opts: ["Count it as a risk: postpone or hand the flight off", "Fly: it is a short job"],
    a: 0,
    why: "The pilot is the first thing to check. Fatigue and illness degrade judgment before you notice.",
    chip: 0,
  },
  {
    label: "The drone had a hard landing yesterday and has not been looked at since.",
    q: "What happens before the flight?",
    opts: ["Inspect it; fix or ground it", "A quick hover test over the driveway"],
    a: 0,
    why: "The aircraft must be in a condition for safe operation, and that is checked before flight, not during it.",
    chip: 1,
  },
  {
    label: "The house is next to a school that lets out in 20 minutes.",
    q: "How do you handle the timing?",
    opts: ["Fly at a time when no one will be under the drone", "Fly now and keep it quick"],
    a: 0,
    why: "The environment includes people on the ground. Change the plan so the flight is not over them.",
    chip: 2,
  },
  {
    label: "The wind is gusting past the drone’s limit. The agent says the listing goes live in an hour.",
    q: "Who decides whether to fly?",
    opts: ["The remote pilot in command", "The client"],
    a: 0,
    why: "A deadline is an external pressure. The remote pilot in command has final authority, and the gusts are the deciding fact.",
    chip: 3,
  },
  {
    label: "Conditions improve and the flight is on. The observer has just arrived.",
    q: "What happens before launch?",
    opts: ["Brief the plan, roles, and emergency actions", "Nothing: the pilot knows the plan"],
    a: 0,
    why: "Everyone on the crew needs to know the plan, who watches what, and what happens if something goes wrong.",
    chip: 4,
  },
];

export const RISK_PROMPT = "Make your call.";

export const RISK_CAPTION =
  "One job, five checks. The highlighted chip shows which part of the risk picture each one tests.";

// Background for chip `chipIndex` on scenario `scenarioIndex`,
// exactly as the design colors c0..c4.
export function riskChipBg(scenarioIndex: number, chipIndex: number): string {
  return RISK_SCENARIOS[scenarioIndex].chip === chipIndex ? "#9cd94a" : "#FFFFFF";
}

// pick: -1 = no pick yet, 0-based option index otherwise (design convention).
export function riskFeedback(scenarioIndex: number, pick: number): { right: boolean; feedback: string } {
  const s = RISK_SCENARIOS[scenarioIndex];
  if (pick < 0) return { right: false, feedback: RISK_PROMPT };
  if (pick === s.a) return { right: true, feedback: "Correct. " + s.why };
  return { right: false, feedback: 'Not "' + s.opts[pick] + '". ' + s.why };
}
