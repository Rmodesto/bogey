// O11 "Airport lighting" — pure beat data ported from
// docs/animations/designs/O11-AirportLighting.dc.html. Do not re-derive.

export const AIRPORT_LIGHTING_CAPTIONS = [
  "A civilian land airport: the beacon alternates white and green.",
  "A military airport: two quick white flashes, then green.",
  "A heliport: green, yellow, and white.",
  "A lighted seaplane base: white and yellow.",
  "On the ground, runway edge lights are white and taxiway edge lights are blue.",
  "Each color is named on screen, here and on the test. Learn the patterns as words: white-green, white-white-green.",
];

// The beacon rows, in the order the design reveals them. Every light names
// its color in words next to the dot (color is never the only signal).
export interface BeaconRow {
  name: string;
  colors: string[]; // the flash sequence, as words
}

export const BEACON_ROWS: BeaconRow[] = [
  { name: "Civilian land airport", colors: ["White", "Green"] },
  { name: "Military airport", colors: ["White", "White", "Green"] },
  { name: "Heliport", colors: ["Green", "Yellow", "White"] },
  { name: "Seaplane base", colors: ["White", "Yellow"] },
];

export interface AirportLightingScene {
  o1: number; // civilian land airport row
  o2: number; // military airport row
  o3: number; // heliport row
  o4: number; // seaplane base row
  o5: number; // runway edge (white) and taxiway edge (blue) lights
}

export function airportLightingScene(beat: number): AirportLightingScene {
  return {
    o1: beat >= 1 ? 1 : 0,
    o2: beat >= 2 ? 1 : 0,
    o3: beat >= 3 ? 1 : 0,
    o4: beat >= 4 ? 1 : 0,
    o5: beat >= 5 ? 1 : 0,
  };
}
