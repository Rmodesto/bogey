import { describe, it, expect } from "vitest";
import {
  LAANC_CAPTIONS,
  LAANC_GRID_CEILINGS,
  LAANC_APPROVED_CELL,
  LAANC_APPROVED_CEILING,
  laancScene,
} from "../logic/laanc";
import { SPECIAL_USE_CARDS, SPECIAL_USE_CAPTIONS, specialUseCardState } from "../logic/specialUse";
import { TFR_MTR_CAPTIONS, MTR_ROUTE, tfrMtrScene } from "../logic/tfrMtr";
import {
  SAMPLE_METAR,
  METAR_TOKENS,
  METAR_CAPTIONS,
  METAR_DECODES,
  metarScene,
  metarTokenStatus,
} from "../logic/metarTour";
import { BATTERY_CAPTIONS, BATTERY_RULES, BATTERY_STAGE_NAMES, batteryScene } from "../logic/batteryFailure";
import { NIGHT_VISION_CAPTIONS, DARK_ADAPTATION_MINUTES, nightVisionScene } from "../logic/nightVision";

// Beat data for the Phase 2 loop animations, asserted against the design
// files in docs/animations/designs/ (captions byte-for-byte).

describe("laancScene (A3)", () => {
  it("carries the design's captions", () => {
    expect(LAANC_CAPTIONS).toEqual([
      "A towered airport. Its Class D airspace reaches the surface, so you need authorization before you fly here.",
      "The FAA facility map lays a grid over it. Each number is the highest altitude, in feet AGL, that can be approved automatically.",
      "Your site is in a 200 square, and you plan to fly at 150 ft AGL.",
      "The request goes through LAANC, from an app. You do not call the tower on a radio.",
      "At or below the number in the square, approval comes back in near-real time.",
      "Above the number, up to 400 ft, is a further-coordination request that a person reviews. Where LAANC is not offered, apply in FAADroneZone.",
    ]);
  });

  it("builds the scene one step per beat", () => {
    expect(laancScene(1)).toEqual({ grid: 0, pin: 0, request: 0, approval: 0, more: 0 });
    expect(laancScene(2)).toEqual({ grid: 1, pin: 0, request: 0, approval: 0, more: 0 });
    expect(laancScene(3)).toEqual({ grid: 1, pin: 1, request: 0, approval: 0, more: 0 });
    expect(laancScene(4)).toEqual({ grid: 1, pin: 1, request: 1, approval: 0, more: 0 });
    expect(laancScene(5)).toEqual({ grid: 1, pin: 1, request: 1, approval: 1, more: 0 });
    expect(laancScene(6)).toEqual({ grid: 1, pin: 1, request: 1, approval: 1, more: 1 });
  });

  it("uses the design's 5x6 facility-map grid, lowest over the runway", () => {
    expect(LAANC_GRID_CEILINGS).toEqual([
      [400, 400, 200, 200, 400, 400],
      [400, 200, 100, 100, 200, 400],
      [200, 100, 0, 0, 100, 200],
      [400, 200, 100, 100, 200, 400],
      [400, 400, 200, 200, 400, 400],
    ]);
    expect(LAANC_APPROVED_CELL).toEqual({ row: 1, col: 4 });
    expect(LAANC_APPROVED_CEILING).toBe(200);
  });
});

describe("special-use cards (A5)", () => {
  it("carries the design's captions", () => {
    expect(SPECIAL_USE_CAPTIONS).toEqual([
      "Prohibited area: a wall. Flight needs permission from the using agency, so plan on not flying there.",
      "Restricted area: a gate. You may enter only with permission from the using or controlling agency.",
      "Warning area: over water, from 3 nautical miles offshore outward. No permission needed, but what happens inside can be hazardous.",
      "Military operations area: not closed. You may fly there, with extreme caution when it is active.",
      "Alert area: no restriction. Expect heavy training traffic and keep watching.",
      "Controlled firing area: the firing stops when an aircraft is detected, which is why it is not on the chart.",
    ]);
  });

  it("shows six cards in P, R, W, MOA, Alert, CFA order", () => {
    expect(SPECIAL_USE_CARDS.map((c) => c.name)).toEqual([
      "Prohibited area",
      "Restricted area",
      "Warning area",
      "Military operations area",
      "Alert area",
      "Controlled firing area",
    ]);
    expect(SPECIAL_USE_CARDS.map((c) => c.code)).toEqual(["P-", "R-", "W-", "MOA", "A-", "Not charted"]);
  });

  it("only prohibited and restricted areas require permission", () => {
    expect(SPECIAL_USE_CARDS.map((c) => c.perm)).toEqual([true, true, false, false, false, false]);
  });

  it("reveals one card per beat; visited cards stay lit, future cards dim", () => {
    expect(specialUseCardState(0, 1)).toEqual({ opacity: 1, active: true });
    expect(specialUseCardState(1, 1)).toEqual({ opacity: 0.18, active: false });
    expect(specialUseCardState(0, 3)).toEqual({ opacity: 1, active: false });
    expect(specialUseCardState(2, 3)).toEqual({ opacity: 1, active: true });
    expect(specialUseCardState(5, 6)).toEqual({ opacity: 1, active: true });
  });
});

describe("tfrMtrScene (A6)", () => {
  it("carries the design's captions", () => {
    expect(TFR_MTR_CAPTIONS).toEqual([
      "Your job site, with a stadium to the west and forest to the east. Nothing printed on the chart says you cannot fly.",
      "Game day at a major stadium. A TFR covers 3 nautical miles around it, up to 3,000 ft AGL, from one hour before until one hour after the event.",
      "A wildfire starts in the forest. A second TFR appears the same day.",
      "Neither ring is printed on the chart. You find them by checking NOTAMs and the FAA TFR list before every flight.",
      "The gray line is a military training route. Jets fly it low and faster than 250 knots. Four digits means no segment above 1,500 ft AGL.",
      "A TFR closes the airspace to you. A training route does not, but it is a reason to look and listen harder.",
    ]);
  });

  it("layers the chart one beat at a time", () => {
    expect(tfrMtrScene(1)).toEqual({ stadiumTfr: 0, wildfireTfr: 0, notam: 0, mtr: 0, jetX: 60, jetY: 395 });
    expect(tfrMtrScene(2)).toEqual({ stadiumTfr: 1, wildfireTfr: 0, notam: 0, mtr: 0, jetX: 60, jetY: 395 });
    expect(tfrMtrScene(3)).toEqual({ stadiumTfr: 1, wildfireTfr: 1, notam: 0, mtr: 0, jetX: 60, jetY: 395 });
    expect(tfrMtrScene(4)).toEqual({ stadiumTfr: 1, wildfireTfr: 1, notam: 1, mtr: 0, jetX: 60, jetY: 395 });
    expect(tfrMtrScene(5)).toEqual({ stadiumTfr: 1, wildfireTfr: 1, notam: 1, mtr: 1, jetX: 330, jetY: 334 });
    expect(tfrMtrScene(6)).toEqual({ stadiumTfr: 1, wildfireTfr: 1, notam: 1, mtr: 1, jetX: 600, jetY: 274 });
  });

  it("uses the design's 4-digit route, and the captions carry the rules", () => {
    expect(MTR_ROUTE).toBe("VR1234");
    expect(TFR_MTR_CAPTIONS[4]).toContain("1,500 ft AGL");
    expect(TFR_MTR_CAPTIONS[3]).toContain("NOTAMs");
  });
});

describe("METAR tour (W1)", () => {
  it("uses the design's sample report, token for token", () => {
    expect(SAMPLE_METAR).toBe("KMCO 121853Z 09008KT 10SM -RA SCT025 BKN040 18/14 A2990");
    expect(METAR_TOKENS.map((t) => t.text).join(" ")).toBe(SAMPLE_METAR);
    expect(METAR_TOKENS.map((t) => t.group)).toEqual([1, 1, 2, 3, 3, 4, 4, 5, 5]);
  });

  it("carries the design's captions and per-beat decode lines", () => {
    expect(METAR_CAPTIONS).toEqual([
      "KMCO 121853Z: Orlando International, the 12th day of the month, 1853 Zulu. Zulu is UTC, not local time.",
      "09008KT: wind from 090 degrees, which is east, at 8 knots.",
      "10SM -RA: visibility 10 statute miles in light rain. The minus sign means light.",
      "SCT025 BKN040: scattered cloud at 2,500 ft and broken cloud at 4,000 ft, both AGL. The lowest broken or overcast layer is the ceiling.",
      "18/14 A2990: temperature 18°C, dew point 14°C, altimeter 29.90 inches of mercury.",
      "For Part 107: 10 SM beats the 3 SM minimum, and a 4,000 ft ceiling leaves far more than 500 ft above a drone at 400 ft.",
    ]);
    expect(METAR_DECODES).toEqual([
      "Where and when",
      "Wind",
      "Visibility and weather",
      "Sky condition",
      "Temperature, dew point, altimeter",
      "The whole report",
    ]);
  });

  it("lights the current beat's group; earlier groups read as visited", () => {
    expect(metarTokenStatus(2, 2)).toBe("active");
    expect(metarTokenStatus(1, 2)).toBe("past");
    expect(metarTokenStatus(4, 2)).toBe("future");
    // Beat 6 reviews the whole report: every group is visited, none active.
    expect(METAR_TOKENS.every((t) => metarTokenStatus(t.group, 6) === "past")).toBe(true);
  });

  it("builds the weather scene one group per beat", () => {
    expect(metarScene(1)).toEqual({ wind: 0, vis: 0, sky: 0, temp: 0, ok: 0 });
    expect(metarScene(2)).toEqual({ wind: 1, vis: 0, sky: 0, temp: 0, ok: 0 });
    expect(metarScene(3)).toEqual({ wind: 1, vis: 1, sky: 0, temp: 0, ok: 0 });
    expect(metarScene(4)).toEqual({ wind: 1, vis: 1, sky: 1, temp: 0, ok: 0 });
    expect(metarScene(5)).toEqual({ wind: 1, vis: 1, sky: 1, temp: 1, ok: 0 });
    expect(metarScene(6)).toEqual({ wind: 1, vis: 1, sky: 1, temp: 1, ok: 1 });
  });
});

describe("batteryScene (O5)", () => {
  it("carries the design's captions, stage names, and handling rules", () => {
    expect(BATTERY_CAPTIONS).toEqual([
      "A lithium pack is several cells, holding a lot of energy in a small space.",
      "A crash, a puncture, a short circuit, or overcharging damages a cell.",
      "The damaged cell swells. A swollen, dented, or leaking battery is out of service: do not fly it, charge it, or press it flat.",
      "The cell heats up, and the heat releases more heat. It vents toxic smoke. This is thermal runaway.",
      "The heat spreads to the next cell, and the next. A fire that looks out can start again.",
      "Inspect before every flight and every charge. Charge on a surface that will not burn, and do not leave it unattended.",
    ]);
    expect(BATTERY_STAGE_NAMES).toEqual([
      "1. Healthy pack",
      "2. Damage",
      "3. Swelling",
      "4. Heat and venting",
      "5. Fire spreads cell to cell",
      "",
    ]);
    expect(BATTERY_RULES).toEqual([
      "Inspect before every flight and every charge",
      "Swollen, dented, or leaking: out of service",
      "Charge on a surface that will not burn, and stay with it",
      "Protect the terminals in transport; spares go in carry-on bags",
    ]);
  });

  it("walks the failure chain: damage, swelling, heat and venting, fire", () => {
    expect(batteryScene(1)).toMatchObject({ damage: 0, swell: 0, hot1: 0, vent: 0, fire1: 0 });
    expect(batteryScene(2)).toMatchObject({ damage: 1, swell: 0 });
    expect(batteryScene(3)).toMatchObject({ damage: 1, swell: 1, hot1: 0, vent: 0 });
    expect(batteryScene(4)).toMatchObject({ hot1: 0.55, hotSwell: 0.55, vent: 1, runaway: 1, fire1: 0 });
  });

  it("fire spreads cell to cell, then the rules replace the stage name", () => {
    expect(batteryScene(5)).toMatchObject({ fire1: 1, hot2: 0.55, fire2: 1, hot3: 0, fire3: 0, rules: 0 });
    expect(batteryScene(6)).toMatchObject({ hot3: 0.55, fire3: 1, rules: 1, stage: 0, stageName: "" });
    expect(batteryScene(5)).toMatchObject({ stage: 1, stageName: "5. Fire spreads cell to cell" });
  });
});

describe("nightVisionScene (O6)", () => {
  it("carries the design's captions", () => {
    expect(NIGHT_VISION_CAPTIONS).toEqual([
      "Light enters the eye and lands on the retina at the back.",
      "Cones are packed into the center. They see color and fine detail, and they need good light.",
      "Rods surround the center. They work in dim light, without color. At night, the rods do the seeing.",
      "So the center of your vision is the weak spot at night. Look straight at a dim light and it fades.",
      "Look slightly to one side and the light lands on the rods. This is off-center viewing.",
      "Your eyes need about 30 minutes in the dark to adapt fully. One bright white light and you start over.",
    ]);
    expect(DARK_ADAPTATION_MINUTES).toBe(30);
  });

  it("introduces the eye, then cones, then rods", () => {
    expect(nightVisionScene(1)).toMatchObject({ cones: 0, rods: 0, axis: 1, offRay: 0 });
    expect(nightVisionScene(2)).toMatchObject({ cones: 1, rods: 0 });
    expect(nightVisionScene(3)).toMatchObject({ cones: 1, rods: 1 });
  });

  it("stares the dim light away at beat 4, recovers it off-center at beat 5", () => {
    expect(nightVisionScene(4)).toMatchObject({ glow: 0.05, dot: 0.15, lookCenter: 1, lookOff: 0, axis: 1 });
    expect(nightVisionScene(5)).toMatchObject({ glow: 0.35, dot: 1, lookCenter: 0, lookOff: 1, axis: 0.25, offRay: 1 });
  });

  it("ends on the dark-adaptation clock", () => {
    expect(nightVisionScene(5).clock).toBe(0);
    expect(nightVisionScene(6)).toMatchObject({ clock: 1, lookOff: 1, axis: 0.25 });
  });
});
