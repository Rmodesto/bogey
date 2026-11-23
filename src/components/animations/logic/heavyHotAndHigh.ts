// L4 "Heavy, hot, and high" — pure logic for the payload and density-altitude
// scrub. Ported from docs/animations/designs/L4-HeavyHotAndHigh.dc.html.
// Do not re-derive. Bars show percent of the published figure and are
// illustrative: use the manufacturer's data for a real aircraft.

export interface HeavyHotHighState {
  w: number;
  d: number;
  /** Climb-rate bar percent of the published figure (illustrative). */
  climb: number;
  /** Flight-time bar percent of the published figure (illustrative). */
  time: number;
  /** Climb bar below 40 percent: bar turns red. */
  climbLow: boolean;
  /** Flight-time bar below 40 percent: bar turns red. */
  timeLow: boolean;
  dFmt: string;
  wText: string;
  dText: string;
  summary: string;
  caption: string;
}

export function heavyHotAndHighState(w: number, d: number): HeavyHotHighState {
  const climb = Math.max(5, Math.round(100 - w * 0.55 - d / 250)); // ILLUSTRATIVE
  const time = Math.max(10, Math.round(100 - w * 0.4 - d / 500)); // ILLUSTRATIVE
  const fmt = (n: number) => n.toLocaleString("en-US");
  let caption;
  if (w <= 20 && d <= 2000)
    caption = "A light drone in dense air: close to the published climb rate and flight time.";
  else if (w > 60 && d > 5000)
    caption =
      "Heavy, hot, and high together. Each one cuts into the same margin, and the motors are already working hard just to hover.";
  else if (w > 60)
    caption =
      "More weight needs more lift, which needs more power. Climb and flight time both drop. Still under the weight limit does not mean published performance.";
  else if (d > 5000)
    caption =
      "Thin air gives the propellers less to push against. The same drone climbs slower and the battery drains faster.";
  else caption = "Each step of payload or density altitude takes a little more of the margin.";
  return {
    w,
    d,
    climb,
    time,
    climbLow: climb < 40,
    timeLow: time < 40,
    dFmt: fmt(d),
    wText: "payload " + w + " percent of maximum",
    dText: "density altitude " + d + " feet",
    summary: "Payload " + w + "% · " + fmt(d) + " ft density altitude",
    caption,
  };
}
