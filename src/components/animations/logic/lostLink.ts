// O4 "Lost link and GPS loss" — pure pick logic ported from
// docs/animations/designs/O4-LostLinkAndGpsLoss.dc.html. Do not re-derive.

// Which stage elements are shown for a scene (0 or 1, fed to CSS opacity).
export interface LostLinkVisibility {
  oLow: number; // low return path into the trees, with an X
  oHigh: number; // high return path over the trees to home
  oDrift: number; // wind arrows and the drifted ghost drone
  oAway: number; // fly-away path off the top right
}

export interface LostLinkScenario {
  label: string;
  q: string;
  opts: string[];
  a: number;
  why: string;
  v: LostLinkVisibility;
  tag: string;
}

export const LOST_LINK_SCENARIOS: LostLinkScenario[] = [
  {
    label: "The control link drops. Return-to-home is set to 60 ft. The trees in the way are 120 ft tall.",
    q: "What should have been set differently?",
    opts: ["Return altitude above the trees", "Nothing: it will avoid them itself"],
    a: 0,
    why: "Return-to-home flies at the altitude you programmed. Set it above every obstacle before launch, and do not rely on obstacle sensors alone.",
    v: { oLow: 1, oHigh: 0, oDrift: 0, oAway: 0 },
    tag: "Link lost · return at 60 ft",
  },
  {
    label: "The same link loss, but return-to-home was set to 200 ft before launch.",
    q: "What does the drone do?",
    opts: ["Climbs to 200 ft, flies home, lands", "Drifts with the wind", "Falls"],
    a: 0,
    why: "With a GPS fix and the failsafe set, the drone climbs to the return altitude, flies back to its takeoff point, and lands.",
    v: { oLow: 0, oHigh: 1, oDrift: 0, oAway: 0 },
    tag: "Link lost · return at 200 ft",
  },
  {
    label: "GPS is lost. The control link still works. There is a steady wind.",
    q: "What does the drone do?",
    opts: ["Falls", "Holds altitude but drifts with the wind", "Returns home by itself"],
    a: 1,
    why: "Without GPS it cannot hold position or find home. It keeps its altitude and drifts, so fly it by hand and land as soon as it is safe.",
    v: { oLow: 0, oHigh: 0, oDrift: 1, oAway: 0 },
    tag: "GPS lost · link OK",
  },
  {
    label: "The link is lost and there is no GPS. The drone drifts off and does not respond: a fly-away.",
    q: "When was the last chance to prevent this?",
    opts: ["Before launch", "Once it started drifting"],
    a: 0,
    why: "With link and GPS both gone you have no input. Confirm a stable GPS position and check the lost-link setting before takeoff.",
    v: { oLow: 0, oHigh: 0, oDrift: 0, oAway: 1 },
    tag: "Link lost · GPS lost",
  },
];

// pick: -1 = no pick yet, 0-based option index otherwise (design convention).
export function lostLinkFeedback(scenarioIndex: number, pick: number): { right: boolean; feedback: string } {
  const s = LOST_LINK_SCENARIOS[scenarioIndex];
  if (pick < 0) return { right: false, feedback: "Pick an answer." };
  if (pick === s.a) return { right: true, feedback: "Correct. " + s.why };
  return { right: false, feedback: 'Not "' + s.opts[pick] + '". ' + s.why };
}
