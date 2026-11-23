// W9 "Fronts in cross-section" — pure beat data, ported from
// docs/animations/designs/W9-FrontsInCrossSection.dc.html. Do not re-derive.

export const FRONTS_CAPTIONS = [
  "A front is the boundary between two air masses.",
  "Cold front: cold air wedges under the warm air and shoves it up steeply. Cold fronts move faster.",
  "The steep lift builds a narrow band of towering cloud with showers or thunderstorms, gusty winds, and a sharp wind shift.",
  "Warm front: warm air slides up and over the cold air on a long, shallow slope. Warm fronts move slower.",
  "The gentle lift spreads a wide area of layered cloud, with steady precipitation, low ceilings, and poor visibility.",
  "When any front passes, temperature, wind, and pressure all change. Check the TAF for when it arrives.",
];

export const FRONTS_CHANGES = ["Temperature changes", "Wind shifts", "Pressure changes"];

export interface FrontsScene {
  oC1: number; // cold-front wedge
  oC2: number; // cold front's towering cloud
  oW1: number; // warm-front slope
  oW2: number; // warm front's layered cloud
  oChg: number; // what-changes chips
}

export function frontsScene(beat: number): FrontsScene {
  return {
    oC1: beat >= 2 ? 1 : 0,
    oC2: beat >= 3 ? 1 : 0,
    oW1: beat >= 4 ? 1 : 0,
    oW2: beat >= 5 ? 1 : 0,
    oChg: beat >= 6 ? 1 : 0,
  };
}
