// W2 "TAF as a timeline" — pure logic for the forecast-time scrub.
// Ported from docs/animations/designs/W2-TafTimeline.dc.html. Do not re-derive.
// The slider is hours after 1800Z on the 12th (0..24); each hour is 25 px on
// the timeline, which starts at x = 36.

export type TafSegment = "base" | "tempo" | "fm" | "bec";

export interface TafTimelineState {
  h: number;
  hText: string;
  when: string;
  cond: string;
  legal: boolean;
  caption: string;
  seg: TafSegment; // which raw-TAF line is highlighted
  cx: number; // cursor x in stage px
}

export function tafTimelineState(h: number): TafTimelineState {
  const z = (18 + h) % 24;
  const day = h < 6 ? 12 : 13;
  const pad = (n: number) => (n < 10 ? "0" : "") + n;
  let seg: TafSegment, cond, ok, caption;
  if (h >= 14) {
    seg = "bec";
    cond = "Wind 300° at 10 kt · more than 6 SM · scattered 4,000 ft";
    ok = true;
    caption = "After 0800Z the BECMG change is complete: the new conditions hold.";
  } else if (h >= 12) {
    seg = "bec";
    cond = "Changing gradually to 300° at 10 kt, more than 6 SM";
    ok = false;
    caption =
      "BECMG 1306/1308: a gradual change between 0600Z and 0800Z on the 13th. Until it is complete, plan on the worse conditions.";
  } else if (h >= 6) {
    seg = "fm";
    cond = "Wind 240° at 15 gusting 25 kt · 2 SM · thunderstorm, heavy rain · overcast 1,000 ft";
    ok = false;
    caption = "FM130000: from 0000Z on the 13th, a complete change. Everything before it is replaced.";
  } else if (h >= 2 && h < 4) {
    seg = "tempo";
    cond = "At times 4 SM, light rain showers, broken 3,000 ft";
    ok = true;
    caption =
      "TEMPO 1220/1222: between 2000Z and 2200Z, temporary dips lasting less than an hour at a time. The base forecast still applies in between.";
  } else {
    seg = "base";
    cond = "Wind 180° at 10 kt · more than 6 SM · scattered 4,000 ft";
    ok = true;
    caption = "The base forecast. 1218/1318 means valid from the 12th at 1800Z to the 13th at 1800Z.";
  }
  return {
    h,
    hText:
      "the " + day + "th at " + pad(z) + "00 Zulu, " + (ok ? "visibility 3 statute miles or more" : "below 3 statute miles or changing"),
    when: day + "th · " + pad(z) + "00Z",
    cond,
    legal: ok,
    caption,
    seg,
    cx: 36 + h * 25,
  };
}
