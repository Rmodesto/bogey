import { describe, it, expect } from "vitest";
import { DRONES, CATEGORY_TESTS, sorterFeedback } from "../logic/categorySorter";
import { REMOTE_ID_MODES, REMOTE_ID_MODE_LABELS } from "../logic/remoteId";
import { CHART_ITEMS } from "../logic/chartLineToShape";

// Answers and copy ported from the design files in docs/animations/designs/

describe("sorterFeedback (R6)", () => {
  it("has four drones with answers 1 through 4", () => {
    expect(DRONES.map((d) => d.a)).toEqual([1, 2, 3, 4]);
    expect(CATEGORY_TESTS).toHaveLength(4);
  });

  it("confirms a correct pick with the drone's why", () => {
    const { right, feedback } = sorterFeedback(1, 2);
    expect(right).toBe(true);
    expect(feedback).toContain("Correct: Category 2.");
    expect(feedback).toContain("declaration of compliance");
  });

  it("explains which requirement a wrong pick fails", () => {
    expect(sorterFeedback(3, 1).feedback).toBe("Not Category 1. Category 1 stops at 0.55 lb. This drone weighs 30 lb.");
    expect(sorterFeedback(0, 4).feedback).toContain("needs an airworthiness certificate");
  });

  it("prompts before any pick", () => {
    expect(sorterFeedback(0, 0).feedback).toBe("Which category lets this drone fly over people? Pick one.");
  });
});

describe("REMOTE_ID_MODES (R8)", () => {
  it("has three modes matching the labels", () => {
    expect(REMOTE_ID_MODES).toHaveLength(3);
    expect(REMOTE_ID_MODE_LABELS).toEqual(["Built in", "Add-on module", "Recognized area"]);
  });

  it("standard broadcasts control station location and emergency status; the module does not", () => {
    const standard = REMOTE_ID_MODES[0].tags.map((t) => t.label);
    const module_ = REMOTE_ID_MODES[1].tags.map((t) => t.label);
    expect(standard).toContain("Control station position and altitude");
    expect(standard).toContain("Emergency status");
    expect(module_).toContain("Takeoff position and altitude");
    expect(module_).not.toContain("Control station position and altitude");
    expect(module_).not.toContain("Emergency status");
  });

  it("the recognized area requires no broadcast", () => {
    expect(REMOTE_ID_MODES[2].tags[0]).toEqual({ label: "No broadcast required", highlight: true });
  });
});

describe("CHART_ITEMS (A2)", () => {
  it("has five line styles; only the shaded band needs no authorization", () => {
    expect(CHART_ITEMS).toHaveLength(5);
    expect(CHART_ITEMS.map((i) => i.auth)).toEqual([true, true, true, true, false]);
  });

  it("maps line styles to airspace classes", () => {
    expect(CHART_ITEMS.map((i) => i.cls)).toEqual([
      "Class B",
      "Class C",
      "Class D",
      "Class E from the surface",
      "Class E from 700 ft AGL",
    ]);
  });

  it("only the shaded band names Class G beneath it", () => {
    expect(CHART_ITEMS[4].below).toBe("Class G below 700 ft AGL");
    expect(CHART_ITEMS.slice(0, 4).every((i) => i.below === "")).toBe(true);
  });

  it("Class B stacks three tiers; Class D is a single cylinder", () => {
    expect(CHART_ITEMS[0].rects).toHaveLength(3);
    expect(CHART_ITEMS[2].rects).toHaveLength(1);
  });
});
