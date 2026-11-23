// O10 "Preflight walkaround" — pure pick logic ported from
// docs/animations/designs/O10-PreflightWalkaround.dc.html. Do not re-derive.

// Which inspection ring is highlighted (0 or 1, fed to CSS opacity).
export interface WalkaroundVisibility {
  oProp: number; // propeller with the crack mark
  oBatt: number; // battery on the bench
  oCtl: number; // controller
  oLight: number; // anti-collision light
  oCam: number; // camera on its new mount
}

export interface WalkaroundScenario {
  label: string;
  q: string;
  opts: string[];
  a: number;
  why: string;
  v: WalkaroundVisibility;
  tag: string;
}

export const WALKAROUND_SCENARIOS: WalkaroundScenario[] = [
  {
    label: "Propellers: one blade has a small crack near the hub.",
    q: "Fly, or not?",
    opts: ["Fly: the crack is small", "Do not fly until it is replaced"],
    a: 1,
    why: "A cracked or chipped propeller can fail in flight. The aircraft is not in a condition for safe operation.",
    v: { oProp: 1, oBatt: 0, oCtl: 0, oLight: 0, oCam: 0 },
    tag: "Check 1 of 5: propellers",
  },
  {
    label: "Battery: 80% charge, but the case is slightly swollen.",
    q: "Fly, or not?",
    opts: ["Fly: the charge is enough", "Do not fly: take it out of service"],
    a: 1,
    why: "Swelling means the battery is damaged. The charge level does not change that.",
    v: { oProp: 0, oBatt: 1, oCtl: 0, oLight: 0, oCam: 0 },
    tag: "Check 2 of 5: battery",
  },
  {
    label: "Controller: linked, sticks respond correctly, lost-link setting checked.",
    q: "Is this part of the preflight?",
    opts: ["Yes: the control link must be checked", "No: only the aircraft is inspected"],
    a: 0,
    why: "The preflight must confirm that the control link between the control station and the aircraft is working properly.",
    v: { oProp: 0, oBatt: 0, oCtl: 1, oLight: 0, oCam: 0 },
    tag: "Check 3 of 5: control station",
  },
  {
    label: "Night flight: the anti-collision light works, but its own battery is nearly empty.",
    q: "Fly, or not?",
    opts: ["Fly: it is on now", "Do not fly until it will last the flight"],
    a: 1,
    why: "At night the light must stay lit and visible for 3 statute miles for the whole flight. It may be dimmed for safety, never switched off.",
    v: { oProp: 0, oBatt: 0, oCtl: 0, oLight: 1, oCam: 0 },
    tag: "Check 4 of 5: anti-collision light",
  },
  {
    label: "A camera has been fitted on a new mount.",
    q: "What must you confirm?",
    opts: ["It is secure and does not change how the drone flies", "Nothing: add-ons are not part of preflight"],
    a: 0,
    why: "Anything attached must be secure and must not adversely affect flight characteristics or controllability.",
    v: { oProp: 0, oBatt: 0, oCtl: 0, oLight: 0, oCam: 1 },
    tag: "Check 5 of 5: attached equipment",
  },
];

// pick: -1 = no pick yet, 0-based option index otherwise (design convention).
export function walkaroundFeedback(scenarioIndex: number, pick: number): { right: boolean; feedback: string } {
  const s = WALKAROUND_SCENARIOS[scenarioIndex];
  if (pick < 0) return { right: false, feedback: "Make your call." };
  if (pick === s.a) return { right: true, feedback: "Correct. " + s.why };
  return { right: false, feedback: 'Not "' + s.opts[pick] + '". ' + s.why };
}
