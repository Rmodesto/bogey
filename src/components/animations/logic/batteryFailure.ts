// O5 "Lithium battery failure" — pure beat data, ported from
// docs/animations/designs/O5-LithiumBatteryFailure.dc.html. Do not re-derive.

export const BATTERY_CAPTIONS = [
  "A lithium pack is several cells, holding a lot of energy in a small space.",
  "A crash, a puncture, a short circuit, or overcharging damages a cell.",
  "The damaged cell swells. A swollen, dented, or leaking battery is out of service: do not fly it, charge it, or press it flat.",
  "The cell heats up, and the heat releases more heat. It vents toxic smoke. This is thermal runaway.",
  "The heat spreads to the next cell, and the next. A fire that looks out can start again.",
  "Inspect before every flight and every charge. Charge on a surface that will not burn, and do not leave it unattended.",
];

// Stage name shown beside the pack (empty on the rules beat).
export const BATTERY_STAGE_NAMES = [
  "1. Healthy pack",
  "2. Damage",
  "3. Swelling",
  "4. Heat and venting",
  "5. Fire spreads cell to cell",
  "",
];

export const BATTERY_RULES = [
  "Inspect before every flight and every charge",
  "Swollen, dented, or leaking: out of service",
  "Charge on a surface that will not burn, and stay with it",
  "Protect the terminals in transport; spares go in carry-on bags",
];

export interface BatteryScene {
  damage: number; // crack marks on cell 1
  swell: number; // swollen outline around cell 1
  hot1: number; // red heat overlays (0.55 when on)
  hot2: number;
  hot3: number;
  hotSwell: number; // red overlay on the swollen outline
  vent: number; // smoke puffs
  fire1: number; // flames over each cell
  fire2: number;
  fire3: number;
  runaway: number; // "Thermal runaway" tag
  rules: number; // handling-rules panel
  stage: number; // stage-name visibility (hidden on the rules beat)
  stageName: string;
}

export function batteryScene(beat: number): BatteryScene {
  return {
    damage: beat >= 2 ? 1 : 0,
    swell: beat >= 3 ? 1 : 0,
    hot1: beat >= 4 ? 0.55 : 0,
    hot2: beat >= 5 ? 0.55 : 0,
    hot3: beat >= 6 ? 0.55 : 0,
    hotSwell: beat >= 4 ? 0.55 : 0,
    vent: beat >= 4 ? 1 : 0,
    fire1: beat >= 5 ? 1 : 0,
    fire2: beat >= 5 ? 1 : 0,
    fire3: beat >= 6 ? 1 : 0,
    runaway: beat >= 4 ? 1 : 0,
    rules: beat >= 6 ? 1 : 0,
    stage: beat >= 6 ? 0 : 1,
    stageName: BATTERY_STAGE_NAMES[beat - 1],
  };
}
