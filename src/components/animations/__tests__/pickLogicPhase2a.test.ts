import { describe, it, expect } from "vitest";
import { SIGHT_SCENARIOS, SIGHT_PROMPT, sightFeedback } from "../logic/lineOfSight";
import { VEHICLE_SCENARIOS, VEHICLE_PROMPT, vehicleFeedback } from "../logic/overPeople";
import { INCIDENTS, REPORT_PROMPT, reportFeedback } from "../logic/reportOrNot";
import { DRIVE_SCENARIOS, DRIVE_PROMPT, driveFeedback } from "../logic/movingVehicle";

// Scenarios, answers, and feedback strings ported from the verified designs in
// docs/animations/designs/ (R5, R7, R9, R12).

describe("sightFeedback (R5)", () => {
  it("matches the design's correct answers", () => {
    expect(SIGHT_SCENARIOS.map((s) => s.a)).toEqual([0, 1, 1, 0, 1]);
    expect(SIGHT_SCENARIOS).toHaveLength(5);
  });

  it("every scenario offers the same two options", () => {
    for (const s of SIGHT_SCENARIOS) {
      expect(s.opts).toEqual(["Meets the rule", "Does not"]);
    }
  });

  it("confirms a correct pick with the design's reason", () => {
    const { right, feedback } = sightFeedback(0, 0);
    expect(right).toBe(true);
    expect(feedback).toBe("Correct. Glasses and contact lenses are allowed. They are the one aid the rule permits.");
  });

  it("names the rejected option on a wrong pick", () => {
    const { right, feedback } = sightFeedback(1, 0);
    expect(right).toBe(false);
    expect(feedback).toBe(
      'Not "Meets the rule". Vision must be unaided by any device other than corrective lenses. Binoculars cannot be how the drone is kept in sight.'
    );
  });

  it("the observer-beside-the-pilot scenario meets the rule; the distant observer does not", () => {
    expect(sightFeedback(3, 0).right).toBe(true);
    expect(sightFeedback(4, 1).right).toBe(true);
    expect(sightFeedback(4, 1).feedback).toContain("does not extend your range");
  });

  it("prompts before any pick", () => {
    expect(sightFeedback(0, -1)).toEqual({ right: false, feedback: SIGHT_PROMPT });
    expect(SIGHT_PROMPT).toBe("Meets the rule, or does not? Make your call.");
  });
});

describe("vehicleFeedback (R7)", () => {
  it("matches the design's correct answers", () => {
    expect(VEHICLE_SCENARIOS.map((s) => s.a)).toEqual([0, 1, 0, 1, 0]);
    expect(VEHICLE_SCENARIOS).toHaveLength(5);
  });

  it("confirms each scenario's correct pick", () => {
    expect(vehicleFeedback(0, 0).right).toBe(true);
    expect(vehicleFeedback(0, 0).feedback).toContain("does not maintain sustained flight");
    expect(vehicleFeedback(1, 1).right).toBe(true);
    expect(vehicleFeedback(1, 1).feedback).toContain("sustained flight over moving vehicles");
    expect(vehicleFeedback(2, 0).right).toBe(true);
    expect(vehicleFeedback(2, 0).feedback).toContain("on notice");
    expect(vehicleFeedback(3, 1).right).toBe(true);
    expect(vehicleFeedback(3, 1).feedback).toContain("open-air assembly");
    expect(vehicleFeedback(4, 0).right).toBe(true);
    expect(vehicleFeedback(4, 0).feedback).toContain("stationary vehicle");
  });

  it("names the rejected option on a wrong hover pick", () => {
    const { right, feedback } = vehicleFeedback(1, 0);
    expect(right).toBe(false);
    expect(feedback).toBe('Not "Allowed". That is sustained flight over moving vehicles on an open public road.');
  });

  it("prompts before any pick", () => {
    expect(vehicleFeedback(0, -1)).toEqual({ right: false, feedback: VEHICLE_PROMPT });
    expect(VEHICLE_PROMPT).toBe("Allowed, or not allowed? Make your call.");
  });
});

describe("reportFeedback (R9)", () => {
  it("matches the design's correct answers", () => {
    expect(INCIDENTS.map((s) => s.a)).toEqual([1, 0, 0, 1, 1]);
    expect(INCIDENTS).toHaveLength(5);
  });

  it("every incident offers report-or-not options", () => {
    for (const s of INCIDENTS) {
      expect(s.opts).toEqual(["Report within 10 days", "No report needed"]);
    }
  });

  it("the destroyed drone alone needs no report", () => {
    const { right, feedback } = reportFeedback(0, 1);
    expect(right).toBe(true);
    expect(feedback).toBe("Correct. Damage to the drone itself does not count, whatever it cost.");
  });

  it("the $900 car repair and the blackout get reported", () => {
    expect(reportFeedback(1, 0).right).toBe(true);
    expect(reportFeedback(1, 0).feedback).toContain("10 calendar days");
    expect(reportFeedback(2, 0).right).toBe(true);
    expect(reportFeedback(2, 0).feedback).toContain("Any loss of consciousness");
  });

  it("the $350 window and the minor cut do not get reported", () => {
    expect(reportFeedback(3, 1).right).toBe(true);
    expect(reportFeedback(3, 1).feedback).toContain("$500 or less");
    expect(reportFeedback(4, 1).right).toBe(true);
    expect(reportFeedback(4, 1).feedback).toContain("not a serious injury");
  });

  it("names the rejected option on a wrong pick", () => {
    const { right, feedback } = reportFeedback(0, 0);
    expect(right).toBe(false);
    expect(feedback).toBe('Not "Report within 10 days". Damage to the drone itself does not count, whatever it cost.');
  });

  it("prompts before any pick", () => {
    expect(reportFeedback(0, -1)).toEqual({ right: false, feedback: REPORT_PROMPT });
    expect(REPORT_PROMPT).toBe("Report it, or not? Make your call.");
  });
});

describe("driveFeedback (R12)", () => {
  it("matches the design's correct answers", () => {
    expect(DRIVE_SCENARIOS.map((s) => s.a)).toEqual([0, 1, 1, 1, 0]);
    expect(DRIVE_SCENARIOS).toHaveLength(5);
  });

  it("confirms each scenario's correct pick", () => {
    expect(driveFeedback(0, 0).right).toBe(true);
    expect(driveFeedback(0, 0).feedback).toContain("sparsely populated area");
    expect(driveFeedback(1, 1).right).toBe(true);
    expect(driveFeedback(1, 1).feedback).toBe("Correct. A town is not a sparsely populated area.");
    expect(driveFeedback(2, 1).right).toBe(true);
    expect(driveFeedback(2, 1).feedback).toContain("compensation or hire");
    expect(driveFeedback(3, 1).right).toBe(true);
    expect(driveFeedback(3, 1).feedback).toContain("moving aircraft");
    expect(driveFeedback(4, 0).right).toBe(true);
    expect(driveFeedback(4, 0).feedback).toContain("same rule as a land vehicle");
  });

  it("names the rejected option on a wrong pick in town", () => {
    const { right, feedback } = driveFeedback(1, 0);
    expect(right).toBe(false);
    expect(feedback).toBe('Not "Allowed". A town is not a sparsely populated area.');
  });

  it("prompts before any pick", () => {
    expect(driveFeedback(0, -1)).toEqual({ right: false, feedback: DRIVE_PROMPT });
    expect(DRIVE_PROMPT).toBe("Allowed, or not allowed? Make your call.");
  });
});
