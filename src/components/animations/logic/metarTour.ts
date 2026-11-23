// W1 "METAR, group by group" — pure beat data, ported from
// docs/animations/designs/W1-MetarGroupByGroup.dc.html. Do not re-derive.

export interface MetarToken {
  text: string;
  group: number; // which beat lights this token
}

export const METAR_TOKENS: MetarToken[] = [
  { text: "KMCO", group: 1 },
  { text: "121853Z", group: 1 },
  { text: "09008KT", group: 2 },
  { text: "10SM", group: 3 },
  { text: "-RA", group: 3 },
  { text: "SCT025", group: 4 },
  { text: "BKN040", group: 4 },
  { text: "18/14", group: 5 },
  { text: "A2990", group: 5 },
];

export const SAMPLE_METAR = METAR_TOKENS.map((t) => t.text).join(" ");

export const METAR_CAPTIONS = [
  "KMCO 121853Z: Orlando International, the 12th day of the month, 1853 Zulu. Zulu is UTC, not local time.",
  "09008KT: wind from 090 degrees, which is east, at 8 knots.",
  "10SM -RA: visibility 10 statute miles in light rain. The minus sign means light.",
  "SCT025 BKN040: scattered cloud at 2,500 ft and broken cloud at 4,000 ft, both AGL. The lowest broken or overcast layer is the ceiling.",
  "18/14 A2990: temperature 18°C, dew point 14°C, altimeter 29.90 inches of mercury.",
  "For Part 107: 10 SM beats the 3 SM minimum, and a 4,000 ft ceiling leaves far more than 500 ft above a drone at 400 ft.",
];

// One-line decode shown above the scene, per beat.
export const METAR_DECODES = [
  "Where and when",
  "Wind",
  "Visibility and weather",
  "Sky condition",
  "Temperature, dew point, altimeter",
  "The whole report",
];

export type MetarTokenStatus = "active" | "past" | "future";

export function metarTokenStatus(group: number, beat: number): MetarTokenStatus {
  return group === beat ? "active" : group < beat ? "past" : "future";
}

export interface MetarScene {
  wind: number; // windsock + wind arrow
  vis: number; // visibility ruler + rain
  sky: number; // cloud layers
  temp: number; // temperature / dew point / altimeter box
  ok: number; // "Within Part 107 weather limits" badge
}

export function metarScene(beat: number): MetarScene {
  return {
    wind: beat >= 2 ? 1 : 0,
    vis: beat >= 3 ? 1 : 0,
    sky: beat >= 4 ? 1 : 0,
    temp: beat >= 5 ? 1 : 0,
    ok: beat >= 6 ? 1 : 0,
  };
}
