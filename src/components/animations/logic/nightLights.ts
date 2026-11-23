// A7 "Lights at night" — pure pick logic ported from
// docs/animations/designs/A7-LightsAtNight.dc.html. Do not re-derive.

// Which stage elements are lit for a scene (0 or 1, fed to CSS opacity).
export interface NightLightsVisibility {
  oGL: number; // green light at left of center
  oRR: number; // red light at right of center
  oR1: number; // lone red light, centered
  oG1: number; // lone green light, centered
  oW: number; // lone white light, centered
  oTower: number; // lighted tower with unlit guy wires
}

export interface NightLightsScenario {
  label: string;
  q: string;
  opts: string[];
  a: number;
  why: string;
  v: NightLightsVisibility;
}

export const NIGHT_LIGHT_SCENARIOS: NightLightsScenario[] = [
  {
    label: "Night. An aircraft shows a green light on your left and a red light on your right.",
    q: "Which way is the aircraft flying?",
    opts: ["Toward you", "Away from you", "Crossing right to left", "Crossing left to right"],
    a: 0,
    why: "Red is on its left wing and green on its right. With red on your right, its nose is pointed at you.",
    v: { oGL: 1, oRR: 1, oR1: 0, oG1: 0, oW: 0, oTower: 0 },
  },
  {
    label: "Night. You see only a red light, moving.",
    q: "Which way is the aircraft flying?",
    opts: ["Toward you", "Away from you", "Crossing right to left", "Crossing left to right"],
    a: 2,
    why: "Red is the left wingtip. You are looking at its left side, so it is crossing from your right to your left.",
    v: { oGL: 0, oRR: 0, oR1: 1, oG1: 0, oW: 0, oTower: 0 },
  },
  {
    label: "Night. You see only a green light, moving.",
    q: "Which way is the aircraft flying?",
    opts: ["Toward you", "Away from you", "Crossing right to left", "Crossing left to right"],
    a: 3,
    why: "Green is the right wingtip. You are looking at its right side, so it is crossing from your left to your right.",
    v: { oGL: 0, oRR: 0, oR1: 0, oG1: 1, oW: 0, oTower: 0 },
  },
  {
    label: "Night. You see only a steady white light.",
    q: "Which way is the aircraft flying?",
    opts: ["Toward you", "Away from you", "Crossing right to left", "Crossing left to right"],
    a: 1,
    why: "The white position light is on the tail. You are behind it, and it is flying away.",
    v: { oGL: 0, oRR: 0, oR1: 0, oG1: 0, oW: 1, oTower: 0 },
  },
  {
    label: "Night. A tall tower shows red obstruction lights. You need to fly past it.",
    q: "How much room do you give the tower?",
    opts: ["Just clear the lights", "Stay well away from it"],
    a: 1,
    why: "Guy wires are not lighted. The AIM says they can reach about 1,500 ft out from a tower and advises staying 2,000 ft away.",
    v: { oGL: 0, oRR: 0, oR1: 0, oG1: 0, oW: 0, oTower: 1 },
  },
];

// pick: -1 = no pick yet, 0-based option index otherwise (design convention).
export function nightLightsFeedback(scenarioIndex: number, pick: number): { right: boolean; feedback: string } {
  const s = NIGHT_LIGHT_SCENARIOS[scenarioIndex];
  if (pick < 0) return { right: false, feedback: "Read the lights, then make your call." };
  if (pick === s.a) return { right: true, feedback: "Correct. " + s.why };
  return { right: false, feedback: 'Not "' + s.opts[pick] + '". ' + s.why };
}
