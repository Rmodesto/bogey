// O1 "The traffic pattern" — pure beat data, ported from
// docs/animations/designs/O1-TrafficPattern.dc.html. Do not re-derive.
// TODO(verify): traffic-pattern details cited to AIM 4-3-3; pending a
// check against the source.

// [centerLeft, centerBottom, rotationDeg] per beat
export const PATTERN_POSITIONS: [number, number, number][] = [
  [470, 98, 0],
  [540, 200, -90],
  [336, 300, -180],
  [130, 200, -270],
  [190, 98, -360],
  [330, 98, -360],
];

const WHO = "Millbrook traffic, Skyhawk 517 Romeo Charlie, ";

export const PATTERN_CALLS = [
  WHO + "departing runway 9, remaining in the pattern, Millbrook.",
  WHO + "left crosswind, runway 9, Millbrook.",
  WHO + "left downwind, runway 9, Millbrook.",
  WHO + "left base, runway 9, Millbrook.",
  WHO + "final, runway 9, Millbrook.",
  WHO + "clear of runway 9, Millbrook.",
];

export const PATTERN_CAPTIONS = [
  "Upwind: the airplane takes off into the wind on runway 9, heading east.",
  "Crosswind: the first left turn, climbing away from the runway.",
  "Downwind: flying back past the runway, parallel to it, opposite the landing direction.",
  "Base: another left turn, descending toward the approach end.",
  "Final: lined up with the runway, low and descending. This is where it passes closest to the ground.",
  "Each call tells you the leg. Listen, picture where the airplane is, and stay clear of the pattern.",
];
