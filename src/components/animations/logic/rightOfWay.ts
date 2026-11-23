// R13 "Right of way" — pure beat data, ported from
// docs/animations/designs/R13-RightOfWay.dc.html. Do not re-derive.

export const RIGHT_OF_WAY_CAPTIONS = [
  "The drone is working over a job site at 200 feet.",
  "A helicopter comes in low from the right. Manned aircraft can turn up at drone altitudes without warning.",
  "The remote pilot sees it first. That is the job: see other aircraft and avoid them.",
  "The drone gives way early: it moves off and descends, away from the helicopter’s path.",
  "The helicopter passes with the drone well clear. Its pilot probably never saw the drone.",
  "Waiting and then ducking under at the last second is not yielding. Give way early, every time.",
];

export interface RightOfWayScene {
  droneX: number; // drone translate x (dX)
  droneY: number; // drone translate y (dY)
  heliX: number; // helicopter translate x (hX); y is fixed at 190
  heli: number; // helicopter opacity (oHeli)
  eye: number; // pilot's sight line opacity, beat 3 only (oEye)
  eyeX: number; // sight-line endpoint
  eyeY: number;
  clear: number; // "well clear" gap + "Yielded early" badge, beat 5 only (oClear)
  warn: number; // never-pass warning box (oWarn)
}

export function rightOfWayScene(beat: number): RightOfWayScene {
  return {
    droneX: beat >= 4 ? 170 : 330,
    droneY: beat >= 4 ? 330 : 160,
    heliX: beat <= 1 ? 800 : beat === 2 ? 590 : beat === 3 ? 520 : beat === 4 ? 430 : 150,
    heli: beat <= 1 ? 0 : 1,
    eye: beat === 3 ? 1 : 0,
    eyeX: 470,
    eyeY: 196,
    clear: beat === 5 ? 1 : 0,
    warn: beat >= 6 ? 1 : 0,
  };
}
