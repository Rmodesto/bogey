// R11 "Eight hours and 0.04" — pure logic for the two-gate scrub.
// Ported from docs/animations/designs/R11-EightHoursAnd004.dc.html.
// 14 CFR 107.27 applies 91.17 to the crew: no duty within 8 hours of
// drinking, and none with an alcohol concentration of 0.04 or greater.
// Each limit stands alone; both gates must be open to launch — and even
// then, never while under the influence.

export const HOURS_REQUIRED = 8;
// The concentration gate closes at 0.04 itself: the reading must be BELOW
// 0.04. `bac` is expressed in hundredths (slider 0–10 → 0.00–0.10).
export const BAC_CLOSED_AT = 4;

export interface AlcoholState {
  timeGateOpen: boolean;
  bacGateOpen: boolean;
  legal: boolean;
  bacText: string;
  hoursText: string;
  bacAriaText: string;
  caption: string;
}

export function alcoholState(hours: number, bac: number): AlcoholState {
  const h = hours;
  const b = bac;
  const timeGateOpen = h >= HOURS_REQUIRED;
  const bacGateOpen = b < BAC_CLOSED_AT;
  const legal = timeGateOpen && bacGateOpen;
  const bacText = (b / 100).toFixed(2);
  let caption;
  if (legal)
    caption =
      "Both gates are open: 8 hours have passed and the reading is below 0.04. You still may not fly while under the influence, whatever the numbers say.";
  else if (!timeGateOpen && bacGateOpen)
    caption = "The reading is below 0.04, but only " + h + " hours have passed. The full 8 hours must pass as well.";
  else if (timeGateOpen)
    caption = "8 hours have passed, but the reading is " + bacText + ". It must be below 0.04; 0.04 itself is too high.";
  else caption = "Neither gate is open: only " + h + " hours, and a reading of " + bacText + ".";
  return {
    timeGateOpen,
    bacGateOpen,
    legal,
    bacText,
    hoursText: h + " hours since the last drink",
    bacAriaText: "alcohol concentration " + bacText,
    caption,
  };
}
