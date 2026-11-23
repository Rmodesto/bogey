// O3 "Build a CTAF call" — pure pick logic ported from
// docs/animations/designs/O3-BuildACtafCall.dc.html. Do not re-derive.

// Which call blocks (and the listening radio) are lit in the scene.
// Values feed CSS opacity exactly as the design sets them.
export interface CtafSceneFlags {
  oB1: number; // "Riverside traffic" — who you are calling
  oB2: number; // "Cessna 4765 Juliett" — who you are
  oB3: number; // "10 miles south" — where you are
  oB4: number; // "inbound runway 27" — what you intend
  oB5: number; // "Riverside" — airport name again, last
  oEar: number; // handheld radio: listening
}

export interface CtafScenario {
  label: string;
  q: string;
  opts: string[];
  a: number; // index of the correct option
  why: string;
  v: CtafSceneFlags;
}

export const CTAF_SCENARIOS: CtafScenario[] = [
  {
    label: "A pilot makes a call at Riverside, an airport with no control tower.",
    q: "What does the call start with?",
    opts: ["“Riverside traffic”", "The aircraft’s tail number"],
    a: 0,
    why: "A self-announce call starts with who you are calling: the airport name followed by “traffic”.",
    v: { oB1: 1, oB2: 0.15, oB3: 0.15, oB4: 0.15, oB5: 0.15, oEar: 0 },
  },
  {
    label: "The aircraft is a Cessna with tail number N4765J.",
    q: "How is the letter J said on the radio?",
    opts: ["Juliett", "Jay", "Jupiter"],
    a: 0,
    why: "Letters use the phonetic alphabet. J is Juliett.",
    v: { oB1: 1, oB2: 1, oB3: 0.15, oB4: 0.15, oB5: 0.15, oEar: 0 },
  },
  {
    label: "The pilot gives a position and a runway: “10 miles south, inbound runway 27.”",
    q: "How would the number 9 be said on the radio?",
    opts: ["Niner", "Nine"],
    a: 0,
    why: "Nine is said “niner”. Three is “tree” and five is “fife”.",
    v: { oB1: 1, oB2: 1, oB3: 1, oB4: 1, oB5: 0.15, oEar: 0 },
  },
  {
    label: "The call ends the way it began, with the airport name.",
    q: "No CTAF is published for an airport. Which frequency is the default?",
    opts: ["122.9 MHz", "121.5 MHz", "123.45 MHz"],
    a: 0,
    why: "When no CTAF is published, the default is 122.9 MHz.",
    v: { oB1: 1, oB2: 1, oB3: 1, oB4: 1, oB5: 1, oEar: 0 },
  },
  {
    label: "You are flying a drone a few miles from Riverside.",
    q: "What do you do with the CTAF?",
    opts: ["Listen to it", "Announce every takeoff on it"],
    a: 0,
    why: "Part 107 does not require you to talk on the radio. Monitoring tells you where the manned traffic is; transmit only in a real emergency.",
    v: { oB1: 1, oB2: 1, oB3: 1, oB4: 1, oB5: 1, oEar: 1 },
  },
];

export const CTAF_PROMPT = "Pick an answer.";

export const CTAF_CAPTION =
  "A radio call is built from the same blocks every time: who you are calling, who you are, where you are, what you intend.";

// pick: -1 = no pick yet, 0-based option index otherwise (design convention).
export function ctafFeedback(scenarioIndex: number, pick: number): { right: boolean; feedback: string } {
  const s = CTAF_SCENARIOS[scenarioIndex];
  if (pick < 0) return { right: false, feedback: CTAF_PROMPT };
  if (pick === s.a) return { right: true, feedback: "Correct. " + s.why };
  return { right: false, feedback: 'Not "' + s.opts[pick] + '". ' + s.why };
}
