// R1 "The 400-foot rule" — pure verdict logic, ported from
// docs/animations/designs/R1-AltitudeLimit.dc.html. Do not re-derive.

export interface AltitudeVerdict {
  ceiling: number;
  legal: boolean;
  caption: string;
}

export function altitudeVerdict(alt: number, near: boolean): AltitudeVerdict {
  const ceiling = near ? 900 : 400;
  const legal = alt <= ceiling;
  let caption;
  if (near && legal)
    caption = "Within 400 ft of the tower, the ceiling lifts to 400 ft above its top: 900 ft AGL here.";
  else if (near) caption = "Above 900 ft AGL, even beside the tower, the drone is over the limit.";
  else if (legal) caption = "In the open field the drone may climb to 400 ft AGL.";
  else caption = "Away from the tower, anything above 400 ft AGL is over the limit.";
  return { ceiling, legal, caption };
}
