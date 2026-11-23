// W6 "Thunderstorm life cycle" — pure beat data, ported from
// docs/animations/designs/W6-ThunderstormLifeCycle.dc.html. Do not re-derive.
// TODO(verify): the stage names and "mature begins when precipitation starts"
// are pending a check against the Aviation Weather Handbook.

export const THUNDERSTORM_CAPTIONS = [
  "A thunderstorm needs three things together: moisture, unstable air, and something to lift it.",
  "Cumulus stage: continuous updrafts build the cloud.",
  "Mature stage: it begins when precipitation starts to fall. Updrafts and downdrafts exist together, and the storm is at its most violent.",
  "Dissipating stage: downdrafts take over and the storm weakens.",
  "A microburst is a small, intense downdraft that spreads out when it hits the ground. A drone under it meets a headwind, then a downdraft, then a tailwind.",
  "With a thunderstorm in the area, do not fly. The hazards reach well beyond the cloud you can see.",
];

export const THUNDERSTORM_STAGE_NAMES = ["1. Cumulus", "2. Mature", "3. Dissipating"];

export const THUNDERSTORM_INGREDIENTS = ["Moisture", "Unstable air", "Lifting action"];

export interface ThunderstormScene {
  oIng: number; // ingredient chips (always on)
  o1: number; // cumulus-stage cloud
  o2: number; // mature-stage cloud
  o3: number; // dissipating-stage cloud
  oMb: number; // microburst
  oD: number; // drone
  dY: string; // drone translate y
  dR: string; // drone rotation
  oNo: number; // "Storm in the area: do not fly" badge
}

export function thunderstormScene(beat: number): ThunderstormScene {
  return {
    oIng: 1,
    o1: beat >= 2 ? 1 : 0.15,
    o2: beat >= 3 ? 1 : 0.15,
    o3: beat >= 4 ? 1 : 0.15,
    oMb: beat >= 5 ? 1 : 0,
    oD: beat >= 5 ? 1 : 0,
    dY: beat >= 6 ? "352px" : "318px",
    dR: beat >= 6 ? "24deg" : "0deg",
    oNo: beat >= 6 ? 1 : 0,
  };
}
