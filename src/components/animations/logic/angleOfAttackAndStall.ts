// L3 "Angle of attack and stall" — pure logic for the two-slider scrub.
// Ported from docs/animations/designs/L3-AngleOfAttackAndStall.dc.html.
// Do not re-derive. The critical angle is shown as 16° for this example
// wing; the stall depends on angle, not airspeed. Lift bar is illustrative.
// TODO(verify): the 16° critical angle is an example-wing figure; it is
// labeled that way on screen and must stay labeled that way.

export interface AngleOfAttackState {
  a: number;
  s: number;
  stalled: boolean;
  /** Lift bar percent (illustrative). */
  lift: number;
  aText: string;
  sText: string;
  caption: string;
}

export function angleOfAttackAndStallState(a: number, s: number): AngleOfAttackState {
  const stalled = a > 16;
  const lift = stalled ? Math.max(20, 100 - (a - 16) * 9) : 20 + a * 5; // ILLUSTRATIVE
  let caption;
  if (stalled)
    caption =
      "At " +
      a +
      "° the wing is past its critical angle. The airflow has broken away from the top surface and lift drops, even at " +
      s +
      " knots.";
  else if (a >= 13)
    caption = "At " + a + "° lift is near its peak. A little more and the wing reaches its critical angle.";
  else
    caption =
      "At " +
      a +
      "° the air follows the wing smoothly. Raising the angle makes more lift, up to a point. Changing the airspeed does not change that point.";
  return {
    a,
    s,
    stalled,
    lift,
    aText: a + " degrees angle of attack, " + (stalled ? "stalled" : "flying"),
    sText: s + " knots",
    caption,
  };
}
