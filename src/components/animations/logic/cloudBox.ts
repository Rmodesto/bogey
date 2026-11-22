// R2 "The cloud box" — pure verdict logic, ported from
// docs/animations/designs/R2-CloudBox.dc.html. Do not re-derive.
// Scene: cloud base fixed at 700 ft AGL, so 500-below caps flight at 200 ft.

export interface CloudBoxVerdict {
  altOk: boolean;
  visOk: boolean;
  legal: boolean;
  caption: string;
}

export function cloudBoxVerdict(alt: number, vis: number): CloudBoxVerdict {
  const altOk = alt <= 200;
  const visOk = vis >= 3;
  let caption;
  if (altOk && visOk)
    caption = "Clear of the box, and visibility is at least 3 statute miles. This flight is within the limits.";
  else if (visOk)
    caption =
      "The drone is " +
      (700 - alt) +
      " ft below the cloud base. It needs 500 ft, so under this cloud the highest it may fly is 200 ft AGL.";
  else if (altOk)
    caption = "Visibility from the control station is below 3 statute miles. No flight, at any altitude.";
  else caption = "Too close to the cloud, and visibility is below 3 statute miles.";
  return { altOk, visOk, legal: altOk && visOk, caption };
}

// Haze overlay opacity for a given visibility
export function hazeOpacity(vis: number): number {
  return vis >= 6 ? 0 : (6 - vis) * 0.15;
}
