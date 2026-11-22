import { describe, it, expect } from "vitest";
import { cloudBoxVerdict, hazeOpacity } from "../logic/cloudBox";
import { dayNightState } from "../logic/dayTwilightNight";
import { aglMslState } from "../logic/aglVsMsl";
import { ceilingVerdict } from "../logic/ceilingToAltitude";
import { loadFactorState } from "../logic/loadFactor";

// Thresholds ported from the design files in docs/animations/designs/

describe("cloudBoxVerdict (R2)", () => {
  it("legal only when at or below 200 ft and visibility at least 3 SM", () => {
    expect(cloudBoxVerdict(200, 3).legal).toBe(true);
    expect(cloudBoxVerdict(210, 3).legal).toBe(false);
    expect(cloudBoxVerdict(200, 2).legal).toBe(false);
    expect(cloudBoxVerdict(210, 2).legal).toBe(false);
  });

  it("names the 500-ft gap under the 700-ft cloud base", () => {
    expect(cloudBoxVerdict(300, 4).caption).toContain("400 ft below the cloud base");
    expect(cloudBoxVerdict(300, 4).caption).toContain("200 ft AGL");
  });

  it("low visibility grounds the flight at any altitude", () => {
    expect(cloudBoxVerdict(0, 2).caption).toBe(
      "Visibility from the control station is below 3 statute miles. No flight, at any altitude."
    );
  });

  it("haze fades in below 6 SM", () => {
    expect(hazeOpacity(6)).toBe(0);
    expect(hazeOpacity(10)).toBe(0);
    expect(hazeOpacity(1)).toBeCloseTo(0.75);
  });
});

describe("dayNightState (R4)", () => {
  it("splits the example day at sunrise 6:30 and sunset 7:30 with 30-minute twilight", () => {
    expect(dayNightState(390).period).toBe("Day"); // 6:30 a.m.
    expect(dayNightState(1169).period).toBe("Day"); // 7:29 p.m.
    expect(dayNightState(360).period).toBe("Civil twilight"); // 6:00 a.m.
    expect(dayNightState(389).period).toBe("Civil twilight");
    expect(dayNightState(1170).period).toBe("Civil twilight"); // 7:30 p.m.
    expect(dayNightState(1199).period).toBe("Civil twilight");
    expect(dayNightState(359).period).toBe("Night");
    expect(dayNightState(1200).period).toBe("Night");
  });

  it("twilight needs the light, night needs the light and the training", () => {
    expect(dayNightState(720)).toMatchObject({ lightRequired: false, trainingRequired: false });
    expect(dayNightState(370)).toMatchObject({ lightRequired: true, trainingRequired: false });
    expect(dayNightState(0)).toMatchObject({ lightRequired: true, trainingRequired: true });
  });

  it("formats the clock in 12-hour time", () => {
    expect(dayNightState(0).clock).toBe("12:00 a.m.");
    expect(dayNightState(1185).clock).toBe("7:45 p.m.");
    expect(dayNightState(725).clock).toBe("12:05 p.m.");
  });
});

describe("aglMslState (A4)", () => {
  it("tower top is ground elevation plus 316", () => {
    expect(aglMslState(957).msl).toBe(1273);
    expect(aglMslState(0).msl).toBe(316);
  });

  it("caption converts 400 AGL to MSL at the site", () => {
    expect(aglMslState(957).caption).toContain("1,357 ft MSL");
  });
});

describe("ceilingVerdict (W3)", () => {
  it("ceiling minus 500, capped at 400", () => {
    expect(ceilingVerdict(500).maxAlt).toBe(0);
    expect(ceilingVerdict(800).maxAlt).toBe(300);
    expect(ceilingVerdict(900).maxAlt).toBe(400);
    expect(ceilingVerdict(1500).maxAlt).toBe(400);
  });

  it("no room to fly at or below a 500-ft ceiling", () => {
    expect(ceilingVerdict(500).legal).toBe(false);
    expect(ceilingVerdict(300).legal).toBe(false);
    expect(ceilingVerdict(600).legal).toBe(true);
  });

  it("builds the METAR code from the ceiling", () => {
    expect(ceilingVerdict(800).code).toBe("OVC008");
    expect(ceilingVerdict(1500).code).toBe("OVC015");
    expect(ceilingVerdict(300).code).toBe("OVC003");
  });
});

describe("loadFactorState (L1)", () => {
  it("matches the reference table for a 10 lb aircraft", () => {
    expect(loadFactorState(0).lf).toBe("1.00");
    expect(loadFactorState(30).lf).toBe("1.15");
    expect(loadFactorState(45).lf).toBe("1.41");
    expect(loadFactorState(60).lf).toBe("2.00");
    expect(loadFactorState(60).load).toBe("20.0");
    expect(loadFactorState(45).load).toBe("14.1");
  });

  it("wings level is 1 G and says so", () => {
    expect(loadFactorState(0).caption).toBe(
      "Wings level: the wing supports the aircraft weight and nothing more, 1 G."
    );
  });
});
