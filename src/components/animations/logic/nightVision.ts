// O6 "Night vision" — pure beat data, ported from
// docs/animations/designs/O6-NightVision.dc.html. Do not re-derive.

export const NIGHT_VISION_CAPTIONS = [
  "Light enters the eye and lands on the retina at the back.",
  "Cones are packed into the center. They see color and fine detail, and they need good light.",
  "Rods surround the center. They work in dim light, without color. At night, the rods do the seeing.",
  "So the center of your vision is the weak spot at night. Look straight at a dim light and it fades.",
  "Look slightly to one side and the light lands on the rods. This is off-center viewing.",
  "Your eyes need about 30 minutes in the dark to adapt fully. One bright white light and you start over.",
];

export const DARK_ADAPTATION_MINUTES = 30;

export interface NightVisionScene {
  cones: number; // cone cluster at the retina's center
  rods: number; // rods around it
  axis: number; // straight-ahead ray (dims during off-center beats)
  offRay: number; // off-center ray
  glow: number; // halo of the night light
  dot: number; // the light itself
  lookCenter: number; // "Looking straight at it" marker
  lookOff: number; // "Looking just beside it" marker
  clock: number; // dark-adaptation panel
}

export function nightVisionScene(beat: number): NightVisionScene {
  return {
    cones: beat >= 2 ? 1 : 0,
    rods: beat >= 3 ? 1 : 0,
    axis: beat === 5 || beat === 6 ? 0.25 : 1,
    offRay: beat >= 5 ? 1 : 0,
    glow: beat === 4 ? 0.05 : beat >= 5 ? 0.35 : 0.2,
    dot: beat === 4 ? 0.15 : beat >= 5 ? 1 : 0.6,
    lookCenter: beat === 4 ? 1 : 0,
    lookOff: beat >= 5 ? 1 : 0,
    clock: beat >= 6 ? 1 : 0,
  };
}
