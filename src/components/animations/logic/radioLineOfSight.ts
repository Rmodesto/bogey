// O12 "Radio line of sight" — pure beat data ported from
// docs/animations/designs/O12-RadioLineOfSight.dc.html. Do not re-derive.

export const RADIO_LOS_CAPTIONS = [
  "The control link is radio. With a clear path between controller and drone, the signal is strong.",
  "The drone flies farther out. The path is still clear, but the signal weakens with distance.",
  "It drops behind the hill. The hill is now between the two radios and the link is blocked.",
  "Back in the open, near other transmitters on a crowded band. Interference cuts the usable range even with a clear path.",
  "So range is not one number. It depends on what is between you and the drone and what else is transmitting.",
  "Keep a clear path to the drone, and decide before launch what it does when the link is lost.",
];

export const RADIO_LOS_SIGNALS = [
  "Signal: strong",
  "Signal: weaker",
  "Signal: lost",
  "Signal: weak, interference",
  "Signal: good",
  "Signal: good",
];

export const RADIO_LOS_PLAN_NOTE =
  "pick a spot with a clear path to the whole flight area, and set what the drone does if the link drops.";

export interface RadioLosScene {
  dX: number; // drone x (px in the 672x420 stage)
  dY: number; // drone y
  lx: number; // signal-line endpoint x (stops at the hill when blocked)
  ly: number; // signal-line endpoint y
  lc: string; // signal-line color: green clear, red blocked/interference
  ld: string; // signal-line dash pattern: solid, long dash, short dash
  oX: number; // red X where the hill blocks the path
  oTx: number; // other transmitters (dim until their beat)
  oPlan: number; // the before-launch plan note
  sig: string; // signal readout
  bars: [number, number, number, number]; // signal-strength bars, lit = 1
}

export function radioLosScene(beat: number): RadioLosScene {
  return {
    dX: beat === 1 ? 190 : beat === 2 ? 300 : beat === 3 ? 590 : beat === 4 ? 250 : 300,
    dY: beat === 3 ? 320 : beat === 4 ? 200 : 170,
    lx: beat === 1 ? 190 : beat === 2 ? 300 : beat === 3 ? 400 : beat === 4 ? 250 : 300,
    ly: beat === 3 ? 268 : beat === 4 ? 200 : 170,
    lc: beat === 3 || beat === 4 ? "#b42318" : "#4f7d14",
    ld: beat === 3 || beat === 4 ? "6 7" : beat === 2 ? "10 5" : "1 0",
    oX: beat === 3 ? 1 : 0,
    oTx: beat >= 4 ? 1 : 0.2,
    oPlan: beat >= 6 ? 1 : 0,
    sig: RADIO_LOS_SIGNALS[beat - 1],
    bars: [
      [1, 1, 0, 1, 1, 1][beat - 1],
      [1, 1, 0, 0, 1, 1][beat - 1],
      [1, 0, 0, 0, 1, 1][beat - 1],
      [1, 0, 0, 0, 0, 0][beat - 1],
    ],
  };
}
