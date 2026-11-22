// W3 "Ceiling to legal altitude" — pure logic, ported from
// docs/animations/designs/W3-CeilingToAltitude.dc.html. Do not re-derive.

export interface CeilingVerdict {
  room: number;
  maxAlt: number;
  legal: boolean;
  caption: string;
  code: string;
  ceilText: string;
}

const f = (n: number) => n.toLocaleString("en-US");

export function ceilingVerdict(ceil: number): CeilingVerdict {
  const room = Math.max(0, ceil - 500);
  const maxAlt = Math.min(400, room);
  const h = String(ceil / 100);
  let caption;
  if (room === 0) caption = "The ceiling is " + ceil + " ft AGL. Staying 500 ft below it leaves no room to fly.";
  else if (ceil < 900)
    caption =
      "Ceiling " + ceil + " ft minus 500 ft leaves " + maxAlt + " ft AGL. Cloud clearance is the limit today, not the 400 ft rule.";
  else caption = "Ceiling minus 500 ft is " + f(room) + " ft, so the 400 ft AGL rule is the limit.";
  return {
    room,
    maxAlt,
    legal: maxAlt > 0,
    caption,
    code: "OVC" + (h.length === 1 ? "00" + h : "0" + h),
    ceilText: f(ceil),
  };
}
