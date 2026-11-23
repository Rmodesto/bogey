// O8 "Hazardous attitudes" — pure pick logic ported from
// docs/animations/designs/O8-HazardousAttitudes.dc.html. Do not re-derive.

export const ATTITUDE_OPTIONS = ["Anti-authority", "Impulsivity", "Invulnerability", "Macho", "Resignation"];

export interface AttitudeScenario {
  label: string;
  q: string;
  opts: string[];
  a: number; // index of the correct option
  why: string;
  quote: string; // what the crew member says in the scene
}

export const ATTITUDE_SCENARIOS: AttitudeScenario[] = [
  {
    label: "The client is watching the shoot.",
    q: "Which hazardous attitude is this?",
    opts: ATTITUDE_OPTIONS,
    a: 3,
    why: "Macho takes chances to prove something. Antidote: “Taking chances is foolish.”",
    quote: "“I can thread it between those trees. Watch this.”",
  },
  {
    label: "The preflight check shows a flight restriction over the site.",
    q: "Which hazardous attitude is this?",
    opts: ATTITUDE_OPTIONS,
    a: 0,
    why: "Anti-authority resents being told what to do. Antidote: “Follow the rules. They are usually right.”",
    quote: "“Those rules are for other people. Nobody tells me where to fly.”",
  },
  {
    label: "The light is fading and the pilot skips the preflight.",
    q: "Which hazardous attitude is this?",
    opts: ATTITUDE_OPTIONS,
    a: 1,
    why: "Impulsivity acts before thinking. Antidote: “Not so fast. Think first.”",
    quote: "“No time for the checklist. Just launch, quickly.”",
  },
  {
    label: "Gusts are over the drone’s published limit.",
    q: "Which hazardous attitude is this?",
    opts: ATTITUDE_OPTIONS,
    a: 2,
    why: "Invulnerability believes accidents happen to others. Antidote: “It could happen to me.”",
    quote: "“I have flown in worse. It will not happen to me.”",
  },
  {
    label: "The visual observer sees a helicopter approaching but says nothing.",
    q: "Which hazardous attitude is this?",
    opts: ATTITUDE_OPTIONS,
    a: 4,
    why: "Resignation gives up on making a difference. Antidote: “I am not helpless. I can make a difference.”",
    quote: "“What’s the use? The pilot has already decided.”",
  },
];

export const ATTITUDE_PROMPT = "Name the attitude.";

export const ATTITUDE_CAPTION =
  "Each line is something a crew member says on a job. The attitude behind it has a name and an antidote.";

// pick: -1 = no pick yet, 0-based option index otherwise (design convention).
export function attitudeFeedback(scenarioIndex: number, pick: number): { right: boolean; feedback: string } {
  const s = ATTITUDE_SCENARIOS[scenarioIndex];
  if (pick < 0) return { right: false, feedback: ATTITUDE_PROMPT };
  if (pick === s.a) return { right: true, feedback: "Correct. " + s.why };
  return { right: false, feedback: 'Not "' + s.opts[pick] + '". ' + s.why };
}
