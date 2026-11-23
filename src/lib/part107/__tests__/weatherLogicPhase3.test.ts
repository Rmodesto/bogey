import { describe, it, expect } from "vitest";
import { tafTimelineState } from "@/components/animations/logic/tafTimeline";
import { densityAltitudeState } from "@/components/animations/logic/densityAltitude";
import { fogFormsState } from "@/components/animations/logic/howFogForms";
import {
  STABLE_UNSTABLE_CAPTIONS,
  STABLE_UNSTABLE_ROWS,
  STABLE_UNSTABLE_TRAP,
  stableUnstableScene,
} from "@/components/animations/logic/stableVsUnstable";
import {
  THUNDERSTORM_CAPTIONS,
  THUNDERSTORM_INGREDIENTS,
  THUNDERSTORM_STAGE_NAMES,
  thunderstormScene,
} from "@/components/animations/logic/thunderstormLifeCycle";
import { WIND_OBSTACLES_CAPTIONS, windObstaclesScene } from "@/components/animations/logic/windAroundObstacles";
import { FRONTS_CAPTIONS, FRONTS_CHANGES, frontsScene } from "@/components/animations/logic/frontsInCrossSection";

// Logic for the Phase 3 weather animations, asserted against the design
// files in docs/animations/designs/ (captions byte-for-byte).

describe("tafTimelineState (W2)", () => {
  it("maps slider hours to the TAF segments the design uses", () => {
    expect(tafTimelineState(0).seg).toBe("base");
    expect(tafTimelineState(1).seg).toBe("base");
    expect(tafTimelineState(2).seg).toBe("tempo");
    expect(tafTimelineState(3).seg).toBe("tempo");
    expect(tafTimelineState(4).seg).toBe("base"); // the TEMPO window has closed
    expect(tafTimelineState(5).seg).toBe("base");
    expect(tafTimelineState(6).seg).toBe("fm");
    expect(tafTimelineState(11).seg).toBe("fm");
    expect(tafTimelineState(12).seg).toBe("bec");
    expect(tafTimelineState(13).seg).toBe("bec");
    expect(tafTimelineState(14).seg).toBe("bec");
    expect(tafTimelineState(24).seg).toBe("bec");
  });

  it("speaks Zulu: the day flips at the FM line, the clock wraps at midnight", () => {
    expect(tafTimelineState(0).when).toBe("12th · 1800Z");
    expect(tafTimelineState(5).when).toBe("12th · 2300Z");
    expect(tafTimelineState(6).when).toBe("13th · 0000Z");
    expect(tafTimelineState(14).when).toBe("13th · 0800Z");
    expect(tafTimelineState(24).when).toBe("13th · 1800Z");
  });

  it("3-SM verdict: good in base and TEMPO, bad from FM until BECMG completes", () => {
    expect(tafTimelineState(0).legal).toBe(true);
    expect(tafTimelineState(3).legal).toBe(true);
    expect(tafTimelineState(6).legal).toBe(false);
    expect(tafTimelineState(12).legal).toBe(false);
    expect(tafTimelineState(13).legal).toBe(false);
    expect(tafTimelineState(14).legal).toBe(true);
  });

  it("conditions lines match the design verbatim", () => {
    expect(tafTimelineState(0).cond).toBe("Wind 180° at 10 kt · more than 6 SM · scattered 4,000 ft");
    expect(tafTimelineState(2).cond).toBe("At times 4 SM, light rain showers, broken 3,000 ft");
    expect(tafTimelineState(6).cond).toBe(
      "Wind 240° at 15 gusting 25 kt · 2 SM · thunderstorm, heavy rain · overcast 1,000 ft",
    );
    expect(tafTimelineState(12).cond).toBe("Changing gradually to 300° at 10 kt, more than 6 SM");
    expect(tafTimelineState(14).cond).toBe("Wind 300° at 10 kt · more than 6 SM · scattered 4,000 ft");
  });

  it("captions match the design verbatim", () => {
    expect(tafTimelineState(0).caption).toBe(
      "The base forecast. 1218/1318 means valid from the 12th at 1800Z to the 13th at 1800Z.",
    );
    expect(tafTimelineState(2).caption).toBe(
      "TEMPO 1220/1222: between 2000Z and 2200Z, temporary dips lasting less than an hour at a time. The base forecast still applies in between.",
    );
    expect(tafTimelineState(6).caption).toBe(
      "FM130000: from 0000Z on the 13th, a complete change. Everything before it is replaced.",
    );
    expect(tafTimelineState(12).caption).toBe(
      "BECMG 1306/1308: a gradual change between 0600Z and 0800Z on the 13th. Until it is complete, plan on the worse conditions.",
    );
    expect(tafTimelineState(14).caption).toBe("After 0800Z the BECMG change is complete: the new conditions hold.");
  });

  it("aria text and cursor track the slider", () => {
    expect(tafTimelineState(0).hText).toBe("the 12th at 1800 Zulu, visibility 3 statute miles or more");
    expect(tafTimelineState(6).hText).toBe("the 13th at 0000 Zulu, below 3 statute miles or changing");
    expect(tafTimelineState(0).cx).toBe(36);
    expect(tafTimelineState(6).cx).toBe(186);
    expect(tafTimelineState(24).cx).toBe(636);
  });
});

describe("densityAltitudeState (W4)", () => {
  it("standard temperature falls 2°C per 1,000 ft from 15°C", () => {
    expect(densityAltitudeState(0, 15).std).toBe(15);
    expect(densityAltitudeState(3000, 35).std).toBe(9);
    expect(densityAltitudeState(8000, 40).std).toBe(-1);
  });

  it("density altitude is pressure altitude + 120 x the temperature difference", () => {
    expect(densityAltitudeState(0, 15).da).toBe(0);
    expect(densityAltitudeState(3000, 35).da).toBe(3000 + 120 * 26);
    expect(densityAltitudeState(0, -10).da).toBe(-3000);
  });

  it("shows the worked sum in the caption, design format, U+2212 for minus", () => {
    expect(densityAltitudeState(3000, 35).caption).toBe(
      "Pressure altitude 3,000 ft. Standard temperature there is 9°C and it is 35°C, a difference of 26°C. 3,000 + (120 × 26) = 6,120 ft.",
    );
    // The raw temperature keeps its ASCII hyphen (the design interpolates t
    // directly); only fmt() values get the U+2212 minus.
    expect(densityAltitudeState(0, -10).caption).toBe(
      "Pressure altitude 0 ft. Standard temperature there is 15°C and it is -10°C, a difference of −25°C. 0 + (120 × −25) = −3,000 ft.",
    );
    expect(densityAltitudeState(0, -10).daText).toBe("−3,000");
  });

  it("the feel line flips at 200 ft either side of the field elevation", () => {
    expect(densityAltitudeState(0, 15).feel).toBe("Close to standard conditions.");
    expect(densityAltitudeState(3000, 35).feel).toBe("The drone performs as if it were 3,120 ft higher than it is.");
    expect(densityAltitudeState(0, -10).feel).toBe(
      "Colder than standard: the air is denser, and performance is better.",
    );
  });

  it("ILLUSTRATIVE bar and dots clamp the way the design does", () => {
    expect(densityAltitudeState(0, 15).perfW).toBe("100%");
    expect(densityAltitudeState(0, 15).perfFill).toBe("#9cd94a");
    expect(densityAltitudeState(0, 15).dot).toBe("20.0px");
    const worst = densityAltitudeState(8000, 40); // da 12,920
    expect(worst.perf).toBe(8);
    expect(worst.perfW).toBe("8%");
    expect(worst.perfFill).toBe("#b42318");
    expect(worst.dot).toBe("46.0px");
    expect(worst.dB).toBeCloseTo(82.8);
  });

  it("aria texts include units", () => {
    expect(densityAltitudeState(3000, 35).eText).toBe("3000 feet elevation");
    expect(densityAltitudeState(3000, 35).tText).toBe("35 degrees Celsius");
  });
});

describe("fogFormsState (W8)", () => {
  it("temperature falls 1° per hour from 22°C and stops at the 14°C dew point", () => {
    expect(fogFormsState(0).temp).toBe(22);
    expect(fogFormsState(5).temp).toBe(17);
    expect(fogFormsState(8).temp).toBe(14);
    expect(fogFormsState(9).temp).toBe(14);
    expect(fogFormsState(9).spread).toBe(0);
  });

  it("the verdict flips at a 3° spread, and the badge word escalates", () => {
    expect(fogFormsState(5).legal).toBe(true); // spread 3
    expect(fogFormsState(5).fogWord).toBe("");
    expect(fogFormsState(6).legal).toBe(false); // spread 2
    expect(fogFormsState(6).fogWord).toBe("Fog likely");
    expect(fogFormsState(8).fogWord).toBe("Fog");
  });

  it("captions match the design verbatim at each spread band", () => {
    expect(fogFormsState(0).caption).toBe(
      "The ground is cooling after sunset. The temperature is still 8° above the dew point, so the air is not close to saturated.",
    );
    expect(fogFormsState(4).caption).toBe("The spread is down to 4° and still closing. Fog is not here yet, but it is coming.");
    expect(fogFormsState(6).caption).toBe("A spread of 2° and closing: fog or low cloud is likely.");
    expect(fogFormsState(8).caption).toBe("Temperature has met the dew point. The air is saturated and fog has formed.");
  });

  it("the fog layer thickens as the spread closes below 5°", () => {
    expect(fogFormsState(0).fog).toBe(0);
    expect(fogFormsState(3).fog).toBe(0); // spread 5: still clear
    expect(fogFormsState(5).fog).toBeCloseTo(0.34);
    expect(fogFormsState(9).fog).toBeCloseTo(0.85);
  });

  it("the graph cursor moves 30 px per hour from x = 60", () => {
    expect(fogFormsState(0).mx).toBe(60);
    expect(fogFormsState(9).mx).toBe(330);
  });
});

describe("stable and unstable air (W5)", () => {
  it("carries the design's captions", () => {
    expect(STABLE_UNSTABLE_CAPTIONS).toEqual([
      "Stable air resists moving up and down. Unstable air, once it starts to rise, keeps rising.",
      "Clouds: stable air makes flat layers. Unstable air builds upward into towers.",
      "The ride: stable air is smooth. Unstable air is turbulent.",
      "Precipitation: stable air gives steady rain. Unstable air gives showers.",
      "Visibility: stable air traps haze and smoke near the ground. Unstable air mixes it away.",
      "The trap: each kind of air has one good trait and one bad one. Smooth goes with hazy; clear goes with bumpy.",
    ]);
  });

  it("carries the design's comparison rows and trap line", () => {
    expect(STABLE_UNSTABLE_ROWS).toEqual([
      { label: "Clouds", stable: "Layered (stratiform)", unstable: "Towering (cumuliform)" },
      { label: "Air", stable: "Smooth", unstable: "Turbulent" },
      { label: "Precipitation", stable: "Steady, continuous", unstable: "Showery" },
      { label: "Visibility", stable: "Fair to poor, in haze", unstable: "Good, outside the showers" },
    ]);
    expect(STABLE_UNSTABLE_TRAP).toBe("Smooth air and good visibility do not come together.");
  });

  it("reveals one row per beat, then the trap", () => {
    expect(stableUnstableScene(1)).toEqual({ o2: 0, o3: 0, o4: 0, o5: 0, o6: 0 });
    expect(stableUnstableScene(2)).toEqual({ o2: 1, o3: 0, o4: 0, o5: 0, o6: 0 });
    expect(stableUnstableScene(3)).toEqual({ o2: 1, o3: 1, o4: 0, o5: 0, o6: 0 });
    expect(stableUnstableScene(4)).toEqual({ o2: 1, o3: 1, o4: 1, o5: 0, o6: 0 });
    expect(stableUnstableScene(5)).toEqual({ o2: 1, o3: 1, o4: 1, o5: 1, o6: 0 });
    expect(stableUnstableScene(6)).toEqual({ o2: 1, o3: 1, o4: 1, o5: 1, o6: 1 });
  });
});

describe("thunderstormScene (W6)", () => {
  it("carries the design's captions", () => {
    expect(THUNDERSTORM_CAPTIONS).toEqual([
      "A thunderstorm needs three things together: moisture, unstable air, and something to lift it.",
      "Cumulus stage: continuous updrafts build the cloud.",
      "Mature stage: it begins when precipitation starts to fall. Updrafts and downdrafts exist together, and the storm is at its most violent.",
      "Dissipating stage: downdrafts take over and the storm weakens.",
      "A microburst is a small, intense downdraft that spreads out when it hits the ground. A drone under it meets a headwind, then a downdraft, then a tailwind.",
      "With a thunderstorm in the area, do not fly. The hazards reach well beyond the cloud you can see.",
    ]);
    expect(THUNDERSTORM_STAGE_NAMES).toEqual(["1. Cumulus", "2. Mature", "3. Dissipating"]);
    expect(THUNDERSTORM_INGREDIENTS).toEqual(["Moisture", "Unstable air", "Lifting action"]);
  });

  it("dims future stages to 0.15 and lights them one beat at a time", () => {
    expect(thunderstormScene(1)).toEqual({
      oIng: 1,
      o1: 0.15,
      o2: 0.15,
      o3: 0.15,
      oMb: 0,
      oD: 0,
      dY: "318px",
      dR: "0deg",
      oNo: 0,
    });
    expect(thunderstormScene(2).o1).toBe(1);
    expect(thunderstormScene(2).o2).toBe(0.15);
    expect(thunderstormScene(3).o2).toBe(1);
    expect(thunderstormScene(4).o3).toBe(1);
  });

  it("beat 5 brings the microburst and the drone; beat 6 shoves the drone down", () => {
    expect(thunderstormScene(4).oMb).toBe(0);
    expect(thunderstormScene(5)).toMatchObject({ oMb: 1, oD: 1, dY: "318px", dR: "0deg", oNo: 0 });
    expect(thunderstormScene(6)).toMatchObject({ oMb: 1, oD: 1, dY: "352px", dR: "24deg", oNo: 1 });
  });
});

describe("windObstaclesScene (W7)", () => {
  it("carries the design's captions", () => {
    expect(WIND_OBSTACLES_CAPTIONS).toEqual([
      "A steady wind over open ground flows in smooth, even layers.",
      "A building is in the way. The wind is forced up and over it.",
      "On the downwind side the flow breaks into rolling turbulence. Ridges and tree lines do the same.",
      "Launch in the lee of the building and the drone is tossed before it has any height to recover.",
      "By day near a coast, land heats faster than water. Warm air rises over the land and cooler air flows in from the water: a sea breeze.",
      "At night it reverses. The land cools faster, and the wind blows from land to water: a land breeze.",
    ]);
  });

  it("builds the building scene across beats 1-4", () => {
    expect(windObstaclesScene(1)).toEqual({
      oA: 1,
      oB: 0,
      oFlat: 1,
      oOver: 0,
      oLee: 0,
      oD: 0,
      dY: "340px",
      dR: "0deg",
      oDay: 0,
      oNight: 0,
    });
    expect(windObstaclesScene(2)).toMatchObject({ oFlat: 0.25, oOver: 1, oLee: 0 });
    expect(windObstaclesScene(3)).toMatchObject({ oOver: 1, oLee: 1, oD: 0 });
    expect(windObstaclesScene(4)).toMatchObject({ oD: 1, dY: "290px", dR: "-26deg" });
  });

  it("cross-fades to the coastline for beats 5 and 6", () => {
    expect(windObstaclesScene(5)).toMatchObject({ oA: 0, oB: 1, oDay: 1, oNight: 0, oD: 0, dY: "340px" });
    expect(windObstaclesScene(6)).toMatchObject({ oA: 0, oB: 1, oDay: 0, oNight: 1 });
  });
});

describe("frontsScene (W9)", () => {
  it("carries the design's captions", () => {
    expect(FRONTS_CAPTIONS).toEqual([
      "A front is the boundary between two air masses.",
      "Cold front: cold air wedges under the warm air and shoves it up steeply. Cold fronts move faster.",
      "The steep lift builds a narrow band of towering cloud with showers or thunderstorms, gusty winds, and a sharp wind shift.",
      "Warm front: warm air slides up and over the cold air on a long, shallow slope. Warm fronts move slower.",
      "The gentle lift spreads a wide area of layered cloud, with steady precipitation, low ceilings, and poor visibility.",
      "When any front passes, temperature, wind, and pressure all change. Check the TAF for when it arrives.",
    ]);
    expect(FRONTS_CHANGES).toEqual(["Temperature changes", "Wind shifts", "Pressure changes"]);
  });

  it("builds the cross-sections one layer per beat", () => {
    expect(frontsScene(1)).toEqual({ oC1: 0, oC2: 0, oW1: 0, oW2: 0, oChg: 0 });
    expect(frontsScene(2)).toEqual({ oC1: 1, oC2: 0, oW1: 0, oW2: 0, oChg: 0 });
    expect(frontsScene(3)).toEqual({ oC1: 1, oC2: 1, oW1: 0, oW2: 0, oChg: 0 });
    expect(frontsScene(4)).toEqual({ oC1: 1, oC2: 1, oW1: 1, oW2: 0, oChg: 0 });
    expect(frontsScene(5)).toEqual({ oC1: 1, oC2: 1, oW1: 1, oW2: 1, oChg: 0 });
    expect(frontsScene(6)).toEqual({ oC1: 1, oC2: 1, oW1: 1, oW2: 1, oChg: 1 });
  });
});
