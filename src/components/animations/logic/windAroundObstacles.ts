// W7 "Wind around obstacles" — pure beat data, ported from
// docs/animations/designs/W7-WindAroundObstacles.dc.html. Do not re-derive.
// Beats 1-4 are the building scene; beats 5-6 cross-fade to the coastline.
// TODO(verify): the sea breeze and land breeze explanation is not in the
// lesson text and has not been checked at the source.

export const WIND_OBSTACLES_CAPTIONS = [
  "A steady wind over open ground flows in smooth, even layers.",
  "A building is in the way. The wind is forced up and over it.",
  "On the downwind side the flow breaks into rolling turbulence. Ridges and tree lines do the same.",
  "Launch in the lee of the building and the drone is tossed before it has any height to recover.",
  "By day near a coast, land heats faster than water. Warm air rises over the land and cooler air flows in from the water: a sea breeze.",
  "At night it reverses. The land cools faster, and the wind blows from land to water: a land breeze.",
];

export interface WindObstaclesScene {
  oA: number; // building scene (beats 1-4)
  oB: number; // coastline scene (beats 5-6)
  oFlat: number; // smooth-flow lines
  oOver: number; // flow forced over the building
  oLee: number; // downwind turbulence
  oD: number; // drone
  dY: string; // drone translate y
  dR: string; // drone rotation
  oDay: number; // sea-breeze (day) layer
  oNight: number; // land-breeze (night) layer
}

export function windObstaclesScene(beat: number): WindObstaclesScene {
  return {
    oA: beat <= 4 ? 1 : 0,
    oB: beat >= 5 ? 1 : 0,
    oFlat: beat === 1 ? 1 : 0.25,
    oOver: beat >= 2 ? 1 : 0,
    oLee: beat >= 3 ? 1 : 0,
    oD: beat === 4 ? 1 : 0,
    dY: beat === 4 ? "290px" : "340px",
    dR: beat === 4 ? "-26deg" : "0deg",
    oDay: beat === 5 ? 1 : 0,
    oNight: beat >= 6 ? 1 : 0,
  };
}
