import { describe, it, expect } from "vitest";
import { AIRSPACE_STACK_CAPTIONS, airspaceStackLayers } from "../logic/airspaceStack";
import { PATTERN_POSITIONS, PATTERN_CALLS, PATTERN_CAPTIONS } from "../logic/trafficPattern";

// Beat data ported from the design files in docs/animations/designs/

describe("airspaceStackLayers (A1)", () => {
  it("has six captions", () => {
    expect(AIRSPACE_STACK_CAPTIONS).toHaveLength(6);
  });

  it("builds the scene one layer per beat", () => {
    expect(airspaceStackLayers(1)).toEqual({ layers: 0, volumes: 0, badges: 0, droneBand: 0 });
    expect(airspaceStackLayers(2)).toEqual({ layers: 1, volumes: 0, badges: 0, droneBand: 0 });
    expect(airspaceStackLayers(3)).toEqual({ layers: 1, volumes: 1, badges: 0, droneBand: 0 });
    expect(airspaceStackLayers(4)).toEqual({ layers: 1, volumes: 1, badges: 1, droneBand: 0 });
    expect(airspaceStackLayers(5)).toEqual({ layers: 1, volumes: 1, badges: 1, droneBand: 1 });
    expect(airspaceStackLayers(6)).toEqual({ layers: 1, volumes: 1, badges: 1, droneBand: 1 });
  });
});

describe("traffic pattern beats (O1)", () => {
  it("has six positions, calls, and captions", () => {
    expect(PATTERN_POSITIONS).toHaveLength(6);
    expect(PATTERN_CALLS).toHaveLength(6);
    expect(PATTERN_CAPTIONS).toHaveLength(6);
  });

  it("flies the five legs with left turns (rotation decreasing by 90)", () => {
    expect(PATTERN_POSITIONS.map((p) => p[2])).toEqual([0, -90, -180, -270, -360, -360]);
  });

  it("each radio call names its leg", () => {
    expect(PATTERN_CALLS[0]).toContain("departing runway 9");
    expect(PATTERN_CALLS[1]).toContain("left crosswind");
    expect(PATTERN_CALLS[2]).toContain("left downwind");
    expect(PATTERN_CALLS[3]).toContain("left base");
    expect(PATTERN_CALLS[4]).toContain("final");
    expect(PATTERN_CALLS[5]).toContain("clear of runway 9");
    expect(PATTERN_CALLS.every((c) => c.startsWith("Millbrook traffic, Skyhawk 517 Romeo Charlie"))).toBe(true);
  });

  it("captions name the legs in order", () => {
    expect(PATTERN_CAPTIONS.slice(0, 5).map((c) => c.split(":")[0])).toEqual([
      "Upwind",
      "Crosswind",
      "Downwind",
      "Base",
      "Final",
    ]);
  });
});
