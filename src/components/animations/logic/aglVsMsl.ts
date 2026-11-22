// A4 "AGL versus MSL" — pure logic, ported from
// docs/animations/designs/A4-AGLvsMSL.dc.html. Do not re-derive.
// Scene: a 316 ft AGL tower on ground whose elevation the slider moves.

export interface AglMslState {
  msl: number;
  elevText: string;
  mslText: string;
  caption: string;
}

const f = (n: number) => n.toLocaleString("en-US");

export function aglMslState(elev: number): AglMslState {
  const msl = elev + 316;
  return {
    msl,
    elevText: f(elev),
    mslText: f(msl),
    caption:
      "Move the ground: the top number changes and the number in parentheses does not. At this site, 400 ft AGL is " +
      f(elev + 400) +
      " ft MSL.",
  };
}
