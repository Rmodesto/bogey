// A6 "TFRs and training routes" — pure beat data, ported from
// docs/animations/designs/A6-TFRsAndTrainingRoutes.dc.html. Do not re-derive.

export const TFR_MTR_CAPTIONS = [
  "Your job site, with a stadium to the west and forest to the east. Nothing printed on the chart says you cannot fly.",
  "Game day at a major stadium. A TFR covers 3 nautical miles around it, up to 3,000 ft AGL, from one hour before until one hour after the event.",
  "A wildfire starts in the forest. A second TFR appears the same day.",
  "Neither ring is printed on the chart. You find them by checking NOTAMs and the FAA TFR list before every flight.",
  "The gray line is a military training route. Jets fly it low and faster than 250 knots. Four digits means no segment above 1,500 ft AGL.",
  "A TFR closes the airspace to you. A training route does not, but it is a reason to look and listen harder.",
];

export const MTR_ROUTE = "VR1234"; // 4 digits: no segment above 1,500 ft AGL

export interface TfrMtrScene {
  stadiumTfr: number; // stadium TFR ring + label
  wildfireTfr: number; // wildfire TFR ring + label
  notam: number; // "Not on the chart" NOTAM note
  mtr: number; // MTR line, its label, and the jet
  jetX: number; // jet translate, stage px
  jetY: number;
}

export function tfrMtrScene(beat: number): TfrMtrScene {
  return {
    stadiumTfr: beat >= 2 ? 1 : 0,
    wildfireTfr: beat >= 3 ? 1 : 0,
    notam: beat >= 4 ? 1 : 0,
    mtr: beat >= 5 ? 1 : 0,
    jetX: beat >= 6 ? 600 : beat === 5 ? 330 : 60,
    jetY: beat >= 6 ? 274 : beat === 5 ? 334 : 395,
  };
}
