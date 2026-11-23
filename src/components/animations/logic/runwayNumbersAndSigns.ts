// O2 "Runway numbers and signs" — pure logic for the magnetic-heading scrub.
// Ported from docs/animations/designs/O2-RunwayNumbersAndSigns.dc.html.
// Do not re-derive. Runway number is the magnetic heading divided by 10 and
// rounded; a heading that rounds to 0 is Runway 36, and the other end is
// always 18 away.

export interface RunwaySignsState {
  h: number;
  /** Runway number for this end, unpadded (1–36). */
  n: number;
  /** Runway number for the opposite end, unpadded. */
  o: number;
  /** Zero-padded runway number, e.g. "04". */
  num: string;
  /** Zero-padded opposite-end number. */
  opp: string;
  /** Heading as three digits, e.g. "005". */
  hd: string;
  /** Compass-point name for the heading. */
  dir: string;
  hText: string;
  caption: string;
}

const pad = (n: number) => (n < 10 ? "0" : "") + n;

export function runwayNumbersAndSignsState(h: number): RunwaySignsState {
  let n = Math.round(h / 10);
  if (n === 0) n = 36;
  const o = n > 18 ? n - 18 : n + 18;
  const names = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"];
  const dir = names[Math.round(h / 45) % 8];
  return {
    h,
    n,
    o,
    num: pad(n),
    opp: pad(o),
    hd: ("00" + h).slice(-3),
    dir,
    hText: "heading " + h + " degrees, runway " + n,
    caption:
      "A runway pointing " +
      ("00" + h).slice(-3) +
      "° magnetic, toward the " +
      dir +
      ": divide by 10 and round to get Runway " +
      pad(n) +
      ". The other end is 18 away: Runway " +
      pad(o) +
      ".",
  };
}
