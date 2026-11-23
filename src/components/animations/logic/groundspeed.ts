// R3 "Groundspeed, not airspeed" — pure logic for the wind scrub.
// Ported from docs/animations/designs/R3-Groundspeed.dc.html.
// 14 CFR 107.51(a) limits groundspeed to 87 knots (100 mph); the drone here
// holds a fixed 70-knot airspeed, so only a tailwind can push it over.

export const AIRSPEED_KN = 70;
export const LIMIT_KN = 87;

export interface GroundspeedState {
  airspeed: number;
  groundspeed: number;
  groundspeedMph: number;
  legal: boolean;
  windLabel: string;
  windText: string;
  caption: string;
}

export function groundspeedState(wind: number): GroundspeedState {
  const w = wind;
  const groundspeed = AIRSPEED_KN + w;
  const legal = groundspeed <= LIMIT_KN;
  const groundspeedMph = Math.round(groundspeed * 1.15078);
  let caption;
  if (w === 0) caption = "Calm air: groundspeed equals airspeed, 70 knots.";
  else if (w < 0)
    caption =
      "A " + -w + "-knot headwind. The drone still moves through the air at 70 knots, but only " + groundspeed + " over the ground.";
  else if (legal)
    caption = "A " + w + "-knot tailwind pushes groundspeed to " + groundspeed + " knots. Same airspeed, still within the limit.";
  else
    caption =
      "A " + w + "-knot tailwind. Airspeed has not changed, but groundspeed is " + groundspeed + " knots: over the 87-knot limit.";
  const windLabel = w === 0 ? "Wind: calm" : w < 0 ? "Headwind " + -w + " kt" : "Tailwind " + w + " kt";
  const windText =
    w === 0 ? "calm" : (w < 0 ? -w + " knot headwind" : w + " knot tailwind") + ", " + (legal ? "legal" : "not legal");
  return { airspeed: AIRSPEED_KN, groundspeed, groundspeedMph, legal, windLabel, windText, caption };
}
