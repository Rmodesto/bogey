// A3 "Getting authorization" — pure beat data, ported from
// docs/animations/designs/A3-GettingAuthorization.dc.html. Do not re-derive.

export const LAANC_CAPTIONS = [
  "A towered airport. Its Class D airspace reaches the surface, so you need authorization before you fly here.",
  "The FAA facility map lays a grid over it. Each number is the highest altitude, in feet AGL, that can be approved automatically.",
  "Your site is in a 200 square, and you plan to fly at 150 ft AGL.",
  "The request goes through LAANC, from an app. You do not call the tower on a radio.",
  "At or below the number in the square, approval comes back in near-real time.",
  "Above the number, up to 400 ft, is a further-coordination request that a person reviews. Where LAANC is not offered, apply in FAADroneZone.",
];

// UAS facility-map grid ceilings in ft AGL, 5 rows x 6 columns,
// exactly as the design draws them (row-major, top-left first).
export const LAANC_GRID_CEILINGS: number[][] = [
  [400, 400, 200, 200, 400, 400],
  [400, 200, 100, 100, 200, 400],
  [200, 100, 0, 0, 100, 200],
  [400, 200, 100, 100, 200, 400],
  [400, 400, 200, 200, 400, 400],
];

// The square the request targets (row, col in the grid above) — a 200 square.
export const LAANC_APPROVED_CELL = { row: 1, col: 4 };
export const LAANC_APPROVED_CEILING =
  LAANC_GRID_CEILINGS[LAANC_APPROVED_CELL.row][LAANC_APPROVED_CELL.col];

export interface LaancScene {
  grid: number; // facility-map grid and its footnote
  pin: number; // highlighted square + drone + request card
  request: number; // LAANC card (and the arrow into it)
  approval: number; // approval card (and the arrow into it)
  more: number; // further-coordination / FAADroneZone card
}

export function laancScene(beat: number): LaancScene {
  return {
    grid: beat >= 2 ? 1 : 0,
    pin: beat >= 3 ? 1 : 0,
    request: beat >= 4 ? 1 : 0,
    approval: beat >= 5 ? 1 : 0,
    more: beat >= 6 ? 1 : 0,
  };
}
