import { describe, it, expect } from "vitest";
import {
  REGISTRATION_CAPTIONS,
  REGISTRATION_NUMBER,
  REGISTRATION_WEIGHT_LABEL,
  registrationScene,
} from "@/components/animations/logic/registrationAndMarking";
import { RIGHT_OF_WAY_CAPTIONS, rightOfWayScene } from "@/components/animations/logic/rightOfWay";
import {
  CERTIFICATE_TIMELINE_CAPTIONS,
  CERTIFICATE_AGE,
  RECENCY_MONTHS_LABEL,
  TEST_AGE,
  certificateTimelineScene,
} from "@/components/animations/logic/certificateTimeline";
import {
  INVISIBLE_HAZARDS_CAPTIONS,
  invisibleHazardsScene,
} from "@/components/animations/logic/invisibleHazards";

// Beat data for the Phase 3a loop animations, asserted against the design
// files in docs/animations/designs/ (captions byte-for-byte).

describe("registrationScene (R10)", () => {
  it("carries the design's captions", () => {
    expect(REGISTRATION_CAPTIONS).toEqual([
      "This drone weighs 0.40 pounds. For purely recreational flying, a drone of 0.55 pounds or less needs no registration.",
      "This flight is under Part 107. Every aircraft flown under Part 107 must be registered, whatever it weighs.",
      "Under Part 107 each aircraft is registered on its own. A registration lasts 3 years and then must be renewed.",
      "The registration number must be legibly displayed on an external surface of the aircraft.",
      "A number hidden inside the battery compartment does not meet the rule.",
      "Registered, marked on the outside, and renewed every 3 years. That is the whole rule.",
    ]);
  });

  it("uses the design's scale reading and registration number", () => {
    expect(REGISTRATION_WEIGHT_LABEL).toBe("0.40 lb");
    expect(REGISTRATION_NUMBER).toBe("FA3XK7W2PL");
  });

  it("reveals the rule cards one beat at a time", () => {
    expect(registrationScene(1)).toEqual({ rec: 1, p107: 0, card: 0, num: 0, bay: 0, done: 0 });
    expect(registrationScene(2)).toEqual({ rec: 1, p107: 1, card: 0, num: 0, bay: 0, done: 0 });
    expect(registrationScene(3)).toEqual({ rec: 1, p107: 1, card: 1, num: 0, bay: 0, done: 0 });
    expect(registrationScene(4)).toEqual({ rec: 1, p107: 1, card: 1, num: 1, bay: 0, done: 0 });
  });

  it("shows the battery-bay counterexample on beat 5 only", () => {
    expect(registrationScene(5)).toEqual({ rec: 1, p107: 1, card: 1, num: 1, bay: 1, done: 0 });
    expect(registrationScene(6)).toEqual({ rec: 1, p107: 1, card: 1, num: 1, bay: 0, done: 1 });
  });
});

describe("rightOfWayScene (R13)", () => {
  it("carries the design's captions", () => {
    expect(RIGHT_OF_WAY_CAPTIONS).toEqual([
      "The drone is working over a job site at 200 feet.",
      "A helicopter comes in low from the right. Manned aircraft can turn up at drone altitudes without warning.",
      "The remote pilot sees it first. That is the job: see other aircraft and avoid them.",
      "The drone gives way early: it moves off and descends, away from the helicopter’s path.",
      "The helicopter passes with the drone well clear. Its pilot probably never saw the drone.",
      "Waiting and then ducking under at the last second is not yielding. Give way early, every time.",
    ]);
  });

  it("flies the helicopter in from off-stage right", () => {
    expect(rightOfWayScene(1)).toMatchObject({ heliX: 800, heli: 0 });
    expect(rightOfWayScene(2)).toMatchObject({ heliX: 590, heli: 1 });
    expect(rightOfWayScene(3)).toMatchObject({ heliX: 520, heli: 1 });
    expect(rightOfWayScene(4)).toMatchObject({ heliX: 430, heli: 1 });
    expect(rightOfWayScene(5)).toMatchObject({ heliX: 150, heli: 1 });
    expect(rightOfWayScene(6)).toMatchObject({ heliX: 150, heli: 1 });
  });

  it("sees it first on beat 3, then gives way early on beat 4", () => {
    expect(rightOfWayScene(2)).toMatchObject({ eye: 0, droneX: 330, droneY: 160 });
    expect(rightOfWayScene(3)).toMatchObject({ eye: 1, eyeX: 470, eyeY: 196 });
    expect(rightOfWayScene(4)).toMatchObject({ eye: 0, droneX: 170, droneY: 330 });
  });

  it("marks the pass well clear on beat 5 and the warning on beat 6", () => {
    expect(rightOfWayScene(4)).toMatchObject({ clear: 0, warn: 0 });
    expect(rightOfWayScene(5)).toMatchObject({ clear: 1, warn: 0 });
    expect(rightOfWayScene(6)).toMatchObject({ clear: 0, warn: 1 });
  });
});

describe("certificateTimelineScene (R14)", () => {
  it("carries the design's captions", () => {
    expect(CERTIFICATE_TIMELINE_CAPTIONS).toEqual([
      "At 14 you may take the knowledge test.",
      "At 16 you may hold the Remote Pilot Certificate. It is not issued before then.",
      "The certificate itself does not expire.",
      "What does run out is knowledge recency. To act as remote pilot in command, you must have tested or trained within the previous 24 calendar months.",
      "You keep current with recurrent training, which is online and free. There is no recurrent test.",
      "Let the training lapse and you may not act as pilot in command until you complete it. The certificate stays valid.",
    ]);
  });

  it("uses the design's ages and recency span", () => {
    expect(TEST_AGE).toBe(14);
    expect(CERTIFICATE_AGE).toBe(16);
    expect(RECENCY_MONTHS_LABEL).toBe("24 calendar months");
  });

  it("builds the timeline one beat at a time, age 14 always visible", () => {
    expect(certificateTimelineScene(1)).toEqual({ age14: 1, age16: 0, cert: 0, loop: 0, train: 0, lapse: 0 });
    expect(certificateTimelineScene(2)).toEqual({ age14: 1, age16: 1, cert: 0, loop: 0, train: 0, lapse: 0 });
    expect(certificateTimelineScene(3)).toEqual({ age14: 1, age16: 1, cert: 1, loop: 0, train: 0, lapse: 0 });
    expect(certificateTimelineScene(4)).toEqual({ age14: 1, age16: 1, cert: 1, loop: 1, train: 0, lapse: 0 });
    expect(certificateTimelineScene(5)).toEqual({ age14: 1, age16: 1, cert: 1, loop: 1, train: 1, lapse: 0 });
    expect(certificateTimelineScene(6)).toEqual({ age14: 1, age16: 1, cert: 1, loop: 1, train: 1, lapse: 1 });
  });
});

describe("invisibleHazardsScene (A9)", () => {
  it("carries the design's captions", () => {
    expect(INVISIBLE_HAZARDS_CAPTIONS).toEqual([
      "A site that looks clear: a cooling tower, a row of poles, a radio tower.",
      "The drone crosses above the cooling tower. The air there looks like the air anywhere else.",
      "It is not. Hot air rising from a stack or cooling tower is turbulent enough to toss a small aircraft, and it may be invisible.",
      "Power lines between the poles are thin enough to disappear until you are almost on them.",
      "Guy wires run far out from a tower, well away from the structure you can see.",
      "None of this shows on your camera feed in time. Survey the site first and plan a path that stays clear.",
    ]);
  });

  it("flies the drone across the site, tossed by the plume on beat 3", () => {
    expect(invisibleHazardsScene(1)).toMatchObject({ droneX: 300, droneY: 170, droneR: 0 });
    expect(invisibleHazardsScene(2)).toMatchObject({ droneX: 140, droneY: 170, droneR: 0 });
    expect(invisibleHazardsScene(3)).toMatchObject({ droneX: 140, droneY: 110, droneR: -28 });
    expect(invisibleHazardsScene(4)).toMatchObject({ droneX: 400, droneY: 236, droneR: 0 });
    expect(invisibleHazardsScene(5)).toMatchObject({ droneX: 500, droneY: 200, droneR: 0 });
    expect(invisibleHazardsScene(6)).toMatchObject({ droneX: 500, droneY: 200, droneR: 0 });
  });

  it("reveals one invisible hazard per beat, then the plan", () => {
    expect(invisibleHazardsScene(1)).toMatchObject({ plume: 0, wire: 0, guy: 0, plan: 0 });
    expect(invisibleHazardsScene(2)).toMatchObject({ plume: 0, wire: 0, guy: 0, plan: 0 });
    expect(invisibleHazardsScene(3)).toMatchObject({ plume: 1, wire: 0, guy: 0, plan: 0 });
    expect(invisibleHazardsScene(4)).toMatchObject({ plume: 1, wire: 1, guy: 0, plan: 0 });
    expect(invisibleHazardsScene(5)).toMatchObject({ plume: 1, wire: 1, guy: 1, plan: 0 });
    expect(invisibleHazardsScene(6)).toMatchObject({ plume: 1, wire: 1, guy: 1, plan: 1 });
  });
});
