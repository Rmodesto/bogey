// R5 "Line of sight" — pure pick logic, ported from
// docs/animations/designs/R5-LineOfSight.dc.html. Do not re-derive.

export interface SightSceneFlags {
  oVN: number; // observer standing next to the pilot
  oVF: number; // far observer, on radio
  oD1: number; // drone on the near side of the building
  oD2: number; // drone beyond the building
  oL1: number; // pilot -> near drone sight line
  oL2: number; // pilot -> building, blocked sight line
  oL3: number; // far observer -> far drone sight line
  oL4: number; // near observer -> near drone sight line
  gear: string; // gear pill next to the pilot
}

export interface SightScenario {
  label: string;
  q: string;
  opts: string[];
  a: number; // index of the correct option
  why: string;
  v: SightSceneFlags;
}

export const SIGHT_SCENARIOS: SightScenario[] = [
  {
    label: "The pilot wears eyeglasses and watches the drone directly.",
    q: "Does this meet the line-of-sight rule?",
    opts: ["Meets the rule", "Does not"],
    a: 0,
    why: "Glasses and contact lenses are allowed. They are the one aid the rule permits.",
    v: { oVN: 0, oVF: 0, oD1: 1, oD2: 0, oL1: 1, oL2: 0, oL3: 0, oL4: 0, gear: "Eyeglasses" },
  },
  {
    label: "The drone is far out. The pilot keeps track of it through binoculars.",
    q: "Does this meet the line-of-sight rule?",
    opts: ["Meets the rule", "Does not"],
    a: 1,
    why: "Vision must be unaided by any device other than corrective lenses. Binoculars cannot be how the drone is kept in sight.",
    v: { oVN: 0, oVF: 0, oD1: 1, oD2: 0, oL1: 0, oL2: 0, oL3: 0, oL4: 0, gear: "Binoculars" },
  },
  {
    label: "The pilot wears FPV goggles. Nobody else is watching the drone.",
    q: "Does this meet the line-of-sight rule?",
    opts: ["Meets the rule", "Does not"],
    a: 1,
    why: "Goggles show the camera view, not the aircraft. Someone on the crew must keep it in unaided sight.",
    v: { oVN: 0, oVF: 0, oD1: 1, oD2: 0, oL1: 0, oL2: 0, oL3: 0, oL4: 0, gear: "FPV goggles" },
  },
  {
    label: "The pilot wears FPV goggles. An observer beside them watches the drone and they keep talking.",
    q: "Does this meet the line-of-sight rule?",
    opts: ["Meets the rule", "Does not"],
    a: 0,
    why: "A visual observer may be the one who keeps the drone in sight, as long as the crew stays in communication.",
    v: { oVN: 1, oVF: 0, oD1: 1, oD2: 0, oL1: 0, oL2: 0, oL3: 0, oL4: 1, gear: "FPV goggles" },
  },
  {
    label: "The drone goes behind a building, out of the pilot’s sight. A distant observer can see it.",
    q: "Does this meet the line-of-sight rule?",
    opts: ["Meets the rule", "Does not"],
    a: 1,
    why: "The pilot, the person at the controls, and the observer must each be able to see the drone for the whole flight. An observer does not extend your range.",
    v: { oVN: 0, oVF: 1, oD1: 0, oD2: 1, oL1: 0, oL2: 1, oL3: 1, oL4: 0, gear: "No aid" },
  },
];

export const SIGHT_PROMPT = "Meets the rule, or does not? Make your call.";

export const SIGHT_CAPTION =
  "Each scene changes who is watching and how. Decide whether the crew still has line of sight.";

// pick: -1 = no pick yet, otherwise option index
export function sightFeedback(i: number, pick: number): { right: boolean; feedback: string } {
  const s = SIGHT_SCENARIOS[i];
  if (pick < 0) return { right: false, feedback: SIGHT_PROMPT };
  if (pick === s.a) return { right: true, feedback: "Correct. " + s.why };
  return { right: false, feedback: 'Not "' + s.opts[pick] + '". ' + s.why };
}
