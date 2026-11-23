// L2 "Center of gravity" — pure logic for the payload-position scrub.
// Ported from docs/animations/designs/L2-CenterOfGravity.dc.html. Do not
// re-derive. The balance point follows the payload; outside ±6 cm the load
// is outside its balance limits even though total weight is unchanged.
// Motor figures are illustrative: they show direction, not real figures.

export interface CenterOfGravityState {
  p: number;
  ok: boolean;
  /** Front-motor bar percent, clamped to 100. */
  front: number;
  /** Rear-motor bar percent, clamped to 100. */
  rear: number;
  /** Raw (unclamped) front figure exceeded 85: bar turns red. */
  frontOver: boolean;
  /** Raw (unclamped) rear figure exceeded 85: bar turns red. */
  rearOver: boolean;
  side: "front" | "rear";
  /** Drone tilt in degrees: 0 within limits, ±5 outside. */
  tilt: number;
  posText: string;
  pText: string;
  caption: string;
}

export function centerOfGravityState(p: number): CenterOfGravityState {
  const ok = Math.abs(p) <= 6; // ILLUSTRATIVE: the ±6 cm balance limit shows direction, not a real figure
  const front = Math.round(55 + p * 4.5); // ILLUSTRATIVE
  const rear = Math.round(55 - p * 4.5); // ILLUSTRATIVE
  const side = p > 0 ? "front" : "rear";
  let caption;
  if (p === 0)
    caption = "The payload sits under the middle. The balance point is centered and all motors share the work.";
  else if (ok)
    caption =
      "The payload is " +
      Math.abs(p) +
      " cm toward the " +
      side +
      ". The balance point follows it, and the " +
      side +
      " motors work harder to hold the drone level.";
  else
    caption =
      "Same weight, but the balance point is outside its limits. The " +
      side +
      " motors are near full power and have nothing left for control.";
  return {
    p,
    ok,
    front: Math.min(100, front),
    rear: Math.min(100, rear),
    frontOver: front > 85,
    rearOver: rear > 85,
    side,
    tilt: ok ? 0 : p > 0 ? 5 : -5,
    posText: p === 0 ? "centered" : Math.abs(p) + " cm toward the " + side,
    pText:
      p === 0
        ? "centered"
        : Math.abs(p) + " centimeters toward the " + side + (ok ? ", within limits" : ", outside limits"),
    caption,
  };
}
