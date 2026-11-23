// W5 "Stable and unstable air" — pure beat data, ported from
// docs/animations/designs/W5-StableVsUnstable.dc.html. Do not re-derive.

export const STABLE_UNSTABLE_CAPTIONS = [
  "Stable air resists moving up and down. Unstable air, once it starts to rise, keeps rising.",
  "Clouds: stable air makes flat layers. Unstable air builds upward into towers.",
  "The ride: stable air is smooth. Unstable air is turbulent.",
  "Precipitation: stable air gives steady rain. Unstable air gives showers.",
  "Visibility: stable air traps haze and smoke near the ground. Unstable air mixes it away.",
  "The trap: each kind of air has one good trait and one bad one. Smooth goes with hazy; clear goes with bumpy.",
];

// The comparison rows, revealed one per beat from beat 2.
export interface StableUnstableRow {
  label: string;
  stable: string;
  unstable: string;
}

export const STABLE_UNSTABLE_ROWS: StableUnstableRow[] = [
  { label: "Clouds", stable: "Layered (stratiform)", unstable: "Towering (cumuliform)" },
  { label: "Air", stable: "Smooth", unstable: "Turbulent" },
  { label: "Precipitation", stable: "Steady, continuous", unstable: "Showery" },
  { label: "Visibility", stable: "Fair to poor, in haze", unstable: "Good, outside the showers" },
];

export const STABLE_UNSTABLE_TRAP = "Smooth air and good visibility do not come together.";

export interface StableUnstableScene {
  o2: number; // Clouds row
  o3: number; // Air row
  o4: number; // Precipitation row
  o5: number; // Visibility row
  o6: number; // the trap line
}

export function stableUnstableScene(beat: number): StableUnstableScene {
  return {
    o2: beat >= 2 ? 1 : 0,
    o3: beat >= 3 ? 1 : 0,
    o4: beat >= 4 ? 1 : 0,
    o5: beat >= 5 ? 1 : 0,
    o6: beat >= 6 ? 1 : 0,
  };
}
