// A9 "Invisible hazards" — pure beat data, ported from
// docs/animations/designs/A9-InvisibleHazards.dc.html. Do not re-derive.
// TODO(verify): turbulence above stacks and cooling towers, pending a check
// against the AIM.

export const INVISIBLE_HAZARDS_CAPTIONS = [
  "A site that looks clear: a cooling tower, a row of poles, a radio tower.",
  "The drone crosses above the cooling tower. The air there looks like the air anywhere else.",
  "It is not. Hot air rising from a stack or cooling tower is turbulent enough to toss a small aircraft, and it may be invisible.",
  "Power lines between the poles are thin enough to disappear until you are almost on them.",
  "Guy wires run far out from a tower, well away from the structure you can see.",
  "None of this shows on your camera feed in time. Survey the site first and plan a path that stays clear.",
];

export interface InvisibleHazardsScene {
  droneX: number; // drone translate x (dX)
  droneY: number; // drone translate y (dY)
  droneR: number; // drone rotation in degrees (dR)
  plume: number; // rising-hot-air plume (oPlume)
  wire: number; // power lines between the poles (oWire)
  guy: number; // guy wires off the tower (oGuy)
  plan: number; // "Plan for what you cannot see" box (oPlan)
}

export function invisibleHazardsScene(beat: number): InvisibleHazardsScene {
  return {
    droneX: beat <= 1 ? 300 : beat <= 3 ? 140 : beat === 4 ? 400 : 500,
    droneY: beat === 3 ? 110 : beat === 4 ? 236 : beat >= 5 ? 200 : 170,
    droneR: beat === 3 ? -28 : 0,
    plume: beat >= 3 ? 1 : 0,
    wire: beat >= 4 ? 1 : 0,
    guy: beat >= 5 ? 1 : 0,
    plan: beat >= 6 ? 1 : 0,
  };
}
