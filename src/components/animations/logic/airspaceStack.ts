// A1 "Airspace stack" — pure beat data, ported from
// docs/animations/designs/A1-AirspaceStack.dc.html. Do not re-derive.

export const AIRSPACE_STACK_CAPTIONS = [
  "Start with the ground: open country and three airports.",
  "Class G sits at the surface. Class E lies above it.",
  "Around airports, controlled airspace reaches down to the surface: Class D, Class C, Class B.",
  "B, C, D, and surface Class E need ATC authorization. Class G, and Class E above the surface, need none.",
  "The drone uses a thin slice: surface to 400 ft AGL. What matters is which volumes reach the surface where you fly.",
  "Check what reaches the surface at your site. If it is B, C, D, or surface Class E, get authorization first.",
];

export interface AirspaceStackLayers {
  layers: number; // Class G / Class E strata and labels
  volumes: number; // D / C / B volumes
  badges: number; // authorization legend
  droneBand: number; // surface-to-400 band
}

export function airspaceStackLayers(beat: number): AirspaceStackLayers {
  return {
    layers: beat >= 2 ? 1 : 0,
    volumes: beat >= 3 ? 1 : 0,
    badges: beat >= 4 ? 1 : 0,
    droneBand: beat >= 5 ? 1 : 0,
  };
}
