import { describe, it, expect } from "vitest";
import { centerOfGravityState } from "../../../components/animations/logic/centerOfGravity";
import { angleOfAttackAndStallState } from "../../../components/animations/logic/angleOfAttackAndStall";
import { heavyHotAndHighState } from "../../../components/animations/logic/heavyHotAndHigh";
import { runwayNumbersAndSignsState } from "../../../components/animations/logic/runwayNumbersAndSigns";

describe("centerOfGravityState (L2)", () => {
  it("is within limits out to 6 cm either way, not at 7", () => {
    expect(centerOfGravityState(0).ok).toBe(true);
    expect(centerOfGravityState(6).ok).toBe(true);
    expect(centerOfGravityState(-6).ok).toBe(true);
    expect(centerOfGravityState(7).ok).toBe(false);
    expect(centerOfGravityState(-7).ok).toBe(false);
  });

  it("splits the motor load 4.5 percent per centimeter, clamped at 100", () => {
    expect(centerOfGravityState(0)).toMatchObject({ front: 55, rear: 55 });
    expect(centerOfGravityState(4)).toMatchObject({ front: 73, rear: 37 });
    expect(centerOfGravityState(10)).toMatchObject({ front: 100, rear: 10 });
    expect(centerOfGravityState(-10)).toMatchObject({ front: 10, rear: 100 });
  });

  it("a bar runs hot past 85 percent", () => {
    expect(centerOfGravityState(6).frontOver).toBe(false);
    expect(centerOfGravityState(7).frontOver).toBe(true);
    expect(centerOfGravityState(-7).rearOver).toBe(true);
    expect(centerOfGravityState(-7).frontOver).toBe(false);
  });

  it("tilts 5 degrees toward the heavy end only outside the limits", () => {
    expect(centerOfGravityState(6).tilt).toBe(0);
    expect(centerOfGravityState(7).tilt).toBe(5);
    expect(centerOfGravityState(-7).tilt).toBe(-5);
  });

  it("labels the payload position the way the design does", () => {
    expect(centerOfGravityState(0).posText).toBe("centered");
    expect(centerOfGravityState(0).pText).toBe("centered");
    expect(centerOfGravityState(4).posText).toBe("4 cm toward the front");
    expect(centerOfGravityState(-3).posText).toBe("3 cm toward the rear");
    expect(centerOfGravityState(4).pText).toBe("4 centimeters toward the front, within limits");
    expect(centerOfGravityState(-8).pText).toBe("8 centimeters toward the rear, outside limits");
  });

  it("captions match the design verbatim", () => {
    expect(centerOfGravityState(0).caption).toBe(
      "The payload sits under the middle. The balance point is centered and all motors share the work.",
    );
    expect(centerOfGravityState(4).caption).toBe(
      "The payload is 4 cm toward the front. The balance point follows it, and the front motors work harder to hold the drone level.",
    );
    expect(centerOfGravityState(-3).caption).toBe(
      "The payload is 3 cm toward the rear. The balance point follows it, and the rear motors work harder to hold the drone level.",
    );
    expect(centerOfGravityState(8).caption).toBe(
      "Same weight, but the balance point is outside its limits. The front motors are near full power and have nothing left for control.",
    );
    expect(centerOfGravityState(-8).caption).toContain("The rear motors are near full power");
  });
});

describe("angleOfAttackAndStallState (L3)", () => {
  it("stalls past 16 degrees at any airspeed", () => {
    expect(angleOfAttackAndStallState(16, 30).stalled).toBe(false);
    expect(angleOfAttackAndStallState(16, 90).stalled).toBe(false);
    expect(angleOfAttackAndStallState(17, 30).stalled).toBe(true);
    expect(angleOfAttackAndStallState(17, 90).stalled).toBe(true);
    expect(angleOfAttackAndStallState(0, 90).stalled).toBe(false);
  });

  it("lift climbs 5 percent per degree to 100, then collapses 9 per degree", () => {
    expect(angleOfAttackAndStallState(0, 60).lift).toBe(20);
    expect(angleOfAttackAndStallState(6, 60).lift).toBe(50);
    expect(angleOfAttackAndStallState(16, 60).lift).toBe(100);
    expect(angleOfAttackAndStallState(17, 60).lift).toBe(91);
    expect(angleOfAttackAndStallState(24, 60).lift).toBe(28);
  });

  it("airspeed never moves the lift curve", () => {
    expect(angleOfAttackAndStallState(10, 30).lift).toBe(angleOfAttackAndStallState(10, 90).lift);
    expect(angleOfAttackAndStallState(20, 30).lift).toBe(angleOfAttackAndStallState(20, 90).lift);
  });

  it("aria texts spell out the state", () => {
    expect(angleOfAttackAndStallState(6, 60).aText).toBe("6 degrees angle of attack, flying");
    expect(angleOfAttackAndStallState(18, 60).aText).toBe("18 degrees angle of attack, stalled");
    expect(angleOfAttackAndStallState(6, 60).sText).toBe("60 knots");
  });

  it("captions match the design verbatim", () => {
    expect(angleOfAttackAndStallState(6, 60).caption).toBe(
      "At 6° the air follows the wing smoothly. Raising the angle makes more lift, up to a point. Changing the airspeed does not change that point.",
    );
    expect(angleOfAttackAndStallState(13, 60).caption).toBe(
      "At 13° lift is near its peak. A little more and the wing reaches its critical angle.",
    );
    expect(angleOfAttackAndStallState(16, 60).caption).toBe(
      "At 16° lift is near its peak. A little more and the wing reaches its critical angle.",
    );
    expect(angleOfAttackAndStallState(18, 90).caption).toBe(
      "At 18° the wing is past its critical angle. The airflow has broken away from the top surface and lift drops, even at 90 knots.",
    );
  });
});

describe("heavyHotAndHighState (L4)", () => {
  it("cuts climb and flight time per the design's formulas", () => {
    expect(heavyHotAndHighState(0, 0)).toMatchObject({ climb: 100, time: 100 });
    expect(heavyHotAndHighState(20, 1000)).toMatchObject({ climb: 85, time: 90 });
    expect(heavyHotAndHighState(100, 10000)).toMatchObject({ climb: 5, time: 40 });
  });

  it("bars turn red below 40 percent", () => {
    expect(heavyHotAndHighState(60, 7000).climb).toBe(39);
    expect(heavyHotAndHighState(60, 7000).climbLow).toBe(true);
    expect(heavyHotAndHighState(60, 7000).timeLow).toBe(false);
    expect(heavyHotAndHighState(100, 10000).time).toBe(40);
    expect(heavyHotAndHighState(100, 10000).timeLow).toBe(false);
    expect(heavyHotAndHighState(100, 10000).climbLow).toBe(true);
  });

  it("formats density altitude with a thousands separator", () => {
    expect(heavyHotAndHighState(20, 10000).dFmt).toBe("10,000");
    expect(heavyHotAndHighState(20, 500).dFmt).toBe("500");
    expect(heavyHotAndHighState(20, 1000).summary).toBe("Payload 20% · 1,000 ft density altitude");
  });

  it("aria texts spell out both sliders", () => {
    expect(heavyHotAndHighState(35, 4500).wText).toBe("payload 35 percent of maximum");
    expect(heavyHotAndHighState(35, 4500).dText).toBe("density altitude 4500 feet");
  });

  it("captions match the design verbatim", () => {
    expect(heavyHotAndHighState(20, 2000).caption).toBe(
      "A light drone in dense air: close to the published climb rate and flight time.",
    );
    expect(heavyHotAndHighState(80, 6000).caption).toBe(
      "Heavy, hot, and high together. Each one cuts into the same margin, and the motors are already working hard just to hover.",
    );
    expect(heavyHotAndHighState(80, 1000).caption).toBe(
      "More weight needs more lift, which needs more power. Climb and flight time both drop. Still under the weight limit does not mean published performance.",
    );
    expect(heavyHotAndHighState(20, 6000).caption).toBe(
      "Thin air gives the propellers less to push against. The same drone climbs slower and the battery drains faster.",
    );
    expect(heavyHotAndHighState(40, 3000).caption).toBe(
      "Each step of payload or density altitude takes a little more of the margin.",
    );
  });
});

describe("runwayNumbersAndSignsState (O2)", () => {
  it("divides the heading by 10 and rounds", () => {
    expect(runwayNumbersAndSignsState(160).n).toBe(16);
    expect(runwayNumbersAndSignsState(165).n).toBe(17);
    expect(runwayNumbersAndSignsState(270).n).toBe(27);
  });

  it("a heading that rounds to 0 is Runway 36", () => {
    expect(runwayNumbersAndSignsState(0).n).toBe(36);
    expect(runwayNumbersAndSignsState(4).n).toBe(36);
    expect(runwayNumbersAndSignsState(359).n).toBe(36);
    expect(runwayNumbersAndSignsState(5).n).toBe(1);
  });

  it("the other end is always 18 away", () => {
    expect(runwayNumbersAndSignsState(160).o).toBe(34);
    expect(runwayNumbersAndSignsState(270).o).toBe(9);
    expect(runwayNumbersAndSignsState(184).o).toBe(36);
    expect(runwayNumbersAndSignsState(185).o).toBe(1);
  });

  it("zero-pads the numbers and the heading", () => {
    expect(runwayNumbersAndSignsState(42)).toMatchObject({ num: "04", opp: "22" });
    expect(runwayNumbersAndSignsState(270)).toMatchObject({ num: "27", opp: "09" });
    expect(runwayNumbersAndSignsState(5).hd).toBe("005");
    expect(runwayNumbersAndSignsState(0).hd).toBe("000");
    expect(runwayNumbersAndSignsState(160).hd).toBe("160");
  });

  it("names the compass direction in eighths", () => {
    expect(runwayNumbersAndSignsState(0).dir).toBe("north");
    expect(runwayNumbersAndSignsState(90).dir).toBe("east");
    expect(runwayNumbersAndSignsState(160).dir).toBe("south");
    expect(runwayNumbersAndSignsState(292).dir).toBe("west");
    expect(runwayNumbersAndSignsState(359).dir).toBe("north");
  });

  it("captions match the design verbatim", () => {
    expect(runwayNumbersAndSignsState(160).caption).toBe(
      "A runway pointing 160° magnetic, toward the south: divide by 10 and round to get Runway 16. The other end is 18 away: Runway 34.",
    );
    expect(runwayNumbersAndSignsState(4).caption).toBe(
      "A runway pointing 004° magnetic, toward the north: divide by 10 and round to get Runway 36. The other end is 18 away: Runway 18.",
    );
    expect(runwayNumbersAndSignsState(160).hText).toBe("heading 160 degrees, runway 16");
  });
});
