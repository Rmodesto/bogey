// O7 "Night illusions" — pure pick logic ported from
// docs/animations/designs/O7-NightIllusions.dc.html. Do not re-derive.

// Which stage scene is shown (0 or 1, fed to CSS opacity).
export interface IllusionVisibility {
  oOne: number; // one steady light on a dark hillside
  oSlope: number; // sloping row of ground lights posing as the horizon
  oPad: number; // lit pad over dark, featureless ground
}

export interface IllusionScenario {
  label: string;
  q: string;
  opts: string[];
  a: number;
  why: string;
  v: IllusionVisibility;
}

export const ILLUSION_SCENARIOS: IllusionScenario[] = [
  {
    label: "Night. You stare at one steady light on a dark hillside. After a few seconds it seems to drift.",
    q: "What is happening?",
    opts: ["The light is moving", "Autokinesis", "False horizon"],
    a: 1,
    why: "A single fixed light stared at against a dark background appears to move. Keep your eyes scanning instead of fixing on it.",
    v: { oOne: 1, oSlope: 0, oPad: 0 },
  },
  {
    label: "Night. A sloping row of ground lights looks like the horizon. Others blend into the stars.",
    q: "Which illusion is this?",
    opts: ["Autokinesis", "False horizon", "Black hole approach"],
    a: 1,
    why: "Ground lights mistaken for stars, or a sloping line of lights taken for the horizon, give a false sense of what is level.",
    v: { oOne: 0, oSlope: 1, oPad: 0 },
  },
  {
    label: "Night. You bring the drone back over dark, featureless ground. Only the landing pad is lit.",
    q: "What is the risk?",
    opts: ["Misjudging height and approach angle", "None: the pad is lit", "Autokinesis"],
    a: 0,
    why: "With nothing visible around the lit spot, height and distance are hard to judge. This is the black hole approach.",
    v: { oOne: 0, oSlope: 0, oPad: 1 },
  },
];

// pick: -1 = no pick yet, 0-based option index otherwise (design convention).
export function illusionFeedback(scenarioIndex: number, pick: number): { right: boolean; feedback: string } {
  const s = ILLUSION_SCENARIOS[scenarioIndex];
  if (pick < 0) return { right: false, feedback: "Pick an answer." };
  if (pick === s.a) return { right: true, feedback: "Correct. " + s.why };
  return { right: false, feedback: 'Not "' + s.opts[pick] + '". ' + s.why };
}
