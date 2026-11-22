import { describe, it, expect } from "vitest";
import { altitudeVerdict } from "../logic/altitudeLimit";

// Thresholds ported from docs/animations/designs/R1-AltitudeLimit.dc.html
describe("altitudeVerdict", () => {
  it("open field: legal up to exactly 400 ft AGL", () => {
    expect(altitudeVerdict(400, false).legal).toBe(true);
    expect(altitudeVerdict(410, false).legal).toBe(false);
    expect(altitudeVerdict(0, false).legal).toBe(true);
  });

  it("near the tower: ceiling lifts to 900 ft AGL (500 ft tower + 400)", () => {
    expect(altitudeVerdict(900, true).legal).toBe(true);
    expect(altitudeVerdict(910, true).legal).toBe(false);
    expect(altitudeVerdict(620, true).legal).toBe(true); // design's initial state
  });

  it("reports the ceiling for each position", () => {
    expect(altitudeVerdict(0, false).ceiling).toBe(400);
    expect(altitudeVerdict(0, true).ceiling).toBe(900);
  });

  it("uses the design captions verbatim", () => {
    expect(altitudeVerdict(620, true).caption).toBe(
      "Within 400 ft of the tower, the ceiling lifts to 400 ft above its top: 900 ft AGL here."
    );
    expect(altitudeVerdict(910, true).caption).toBe(
      "Above 900 ft AGL, even beside the tower, the drone is over the limit."
    );
    expect(altitudeVerdict(300, false).caption).toBe(
      "In the open field the drone may climb to 400 ft AGL."
    );
    expect(altitudeVerdict(500, false).caption).toBe(
      "Away from the tower, anything above 400 ft AGL is over the limit."
    );
  });
});
