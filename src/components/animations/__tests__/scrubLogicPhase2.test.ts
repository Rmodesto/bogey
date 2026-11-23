import { describe, it, expect } from "vitest";
import { groundspeedState } from "../logic/groundspeed";
import { alcoholState } from "../logic/alcoholGates";
import { latLongState } from "../logic/latLong";

describe("groundspeedState (R3)", () => {
  it("adds the wind to the fixed 70-knot airspeed", () => {
    expect(groundspeedState(0).airspeed).toBe(70);
    expect(groundspeedState(0).groundspeed).toBe(70);
    expect(groundspeedState(-30).groundspeed).toBe(40);
    expect(groundspeedState(30).groundspeed).toBe(100);
  });

  it("legal at exactly 87 knots, not above", () => {
    expect(groundspeedState(17).groundspeed).toBe(87);
    expect(groundspeedState(17).legal).toBe(true);
    expect(groundspeedState(18).legal).toBe(false);
    expect(groundspeedState(-30).legal).toBe(true);
    expect(groundspeedState(0).legal).toBe(true);
  });

  it("converts 87 knots to 100 mph", () => {
    expect(groundspeedState(17).groundspeedMph).toBe(100);
  });

  it("labels the wind the way the design does", () => {
    expect(groundspeedState(0).windLabel).toBe("Wind: calm");
    expect(groundspeedState(-10).windLabel).toBe("Headwind 10 kt");
    expect(groundspeedState(8).windLabel).toBe("Tailwind 8 kt");
    expect(groundspeedState(0).windText).toBe("calm");
    expect(groundspeedState(-10).windText).toBe("10 knot headwind, legal");
    expect(groundspeedState(18).windText).toBe("18 knot tailwind, not legal");
  });

  it("captions match the design verbatim", () => {
    expect(groundspeedState(0).caption).toBe("Calm air: groundspeed equals airspeed, 70 knots.");
    expect(groundspeedState(-10).caption).toBe(
      "A 10-knot headwind. The drone still moves through the air at 70 knots, but only 60 over the ground.",
    );
    expect(groundspeedState(8).caption).toBe(
      "A 8-knot tailwind pushes groundspeed to 78 knots. Same airspeed, still within the limit.",
    );
    expect(groundspeedState(20).caption).toBe(
      "A 20-knot tailwind. Airspeed has not changed, but groundspeed is 90 knots: over the 87-knot limit.",
    );
  });
});

describe("alcoholState (R11)", () => {
  it("both-gates truth table (bac in hundredths)", () => {
    expect(alcoholState(4, 6)).toMatchObject({ timeGateOpen: false, bacGateOpen: false, legal: false });
    expect(alcoholState(4, 2)).toMatchObject({ timeGateOpen: false, bacGateOpen: true, legal: false });
    expect(alcoholState(10, 6)).toMatchObject({ timeGateOpen: true, bacGateOpen: false, legal: false });
    expect(alcoholState(10, 2)).toMatchObject({ timeGateOpen: true, bacGateOpen: true, legal: true });
  });

  it("the time gate opens at exactly 8 hours", () => {
    expect(alcoholState(7.5, 2).legal).toBe(false);
    expect(alcoholState(8, 2).legal).toBe(true);
  });

  it("the concentration gate closes at 0.04 itself", () => {
    expect(alcoholState(10, 3).bacGateOpen).toBe(true);
    expect(alcoholState(10, 4).bacGateOpen).toBe(false);
    expect(alcoholState(10, 4).bacText).toBe("0.04");
  });

  it("captions match the design verbatim", () => {
    expect(alcoholState(10, 2).caption).toBe(
      "Both gates are open: 8 hours have passed and the reading is below 0.04. You still may not fly while under the influence, whatever the numbers say.",
    );
    expect(alcoholState(4, 2).caption).toBe(
      "The reading is below 0.04, but only 4 hours have passed. The full 8 hours must pass as well.",
    );
    expect(alcoholState(10, 4).caption).toBe(
      "8 hours have passed, but the reading is 0.04. It must be below 0.04; 0.04 itself is too high.",
    );
    expect(alcoholState(4, 6).caption).toBe("Neither gate is open: only 4 hours, and a reading of 0.06.");
    expect(alcoholState(4.5, 2).caption).toContain("only 4.5 hours");
  });
});

describe("latLongState (A8)", () => {
  it("reads the corners of the tile in degrees and minutes", () => {
    expect(latLongState(0, 0).readout).toBe("35°00′ N, 98°00′ W");
    expect(latLongState(50, 30).readout).toBe("35°30′ N, 97°10′ W");
  });

  it("longitude counts down going east, 60 minutes per degree", () => {
    expect(latLongState(18, 12).lon).toBe("97°42′ W");
    expect(latLongState(18, 12).lat).toBe("35°12′ N");
    expect(latLongState(30, 0).lon).toBe("97°30′ W");
    expect(latLongState(31, 0).lon).toBe("97°29′ W");
  });

  it("the caption counts from the nearest labeled line", () => {
    expect(latLongState(18, 12).caption).toBe(
      "Latitude: 12 ticks north of the 35° line, so 35°12′ N. Longitude: 18 minutes east of the 98° line, and going east the number goes down, so 97°42′ W.",
    );
    expect(latLongState(31, 0).caption).toContain("1 minutes east of the 97°30′ line");
    expect(latLongState(30, 0).caption).toContain("30 minutes east of the 98° line");
  });

  it("aria texts spell the coordinates out", () => {
    expect(latLongState(18, 12).xText).toBe("longitude 97 degrees 42 minutes west");
    expect(latLongState(18, 12).yText).toBe("latitude 35 degrees 12 minutes north");
  });
});
