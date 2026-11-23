import { describe, it, expect } from "vitest";
import { NIGHT_LIGHT_SCENARIOS, nightLightsFeedback } from "../logic/nightLights";
import { LOST_LINK_SCENARIOS, lostLinkFeedback } from "../logic/lostLink";
import { ILLUSION_SCENARIOS, illusionFeedback } from "../logic/nightIllusions";
import { WALKAROUND_SCENARIOS, walkaroundFeedback } from "../logic/preflightWalkaround";

// Scenarios, answers, and copy ported verbatim from the design files:
// A7-LightsAtNight.dc.html, O4-LostLinkAndGpsLoss.dc.html,
// O7-NightIllusions.dc.html, O10-PreflightWalkaround.dc.html.

describe("nightLightsFeedback (A7)", () => {
  it("has five scenes with the design's answers", () => {
    expect(NIGHT_LIGHT_SCENARIOS).toHaveLength(5);
    expect(NIGHT_LIGHT_SCENARIOS.map((s) => s.a)).toEqual([0, 2, 3, 1, 1]);
    expect(NIGHT_LIGHT_SCENARIOS.map((s) => s.opts.length)).toEqual([4, 4, 4, 4, 2]);
    expect(NIGHT_LIGHT_SCENARIOS[0].opts).toEqual([
      "Toward you",
      "Away from you",
      "Crossing right to left",
      "Crossing left to right",
    ]);
  });

  it("green on your left and red on your right means toward you", () => {
    const { right, feedback } = nightLightsFeedback(0, 0);
    expect(right).toBe(true);
    expect(feedback).toBe(
      "Correct. Red is on its left wing and green on its right. With red on your right, its nose is pointed at you."
    );
  });

  it("a lone red light crosses right to left; a lone green crosses left to right", () => {
    expect(nightLightsFeedback(1, 2).right).toBe(true);
    expect(nightLightsFeedback(2, 3).right).toBe(true);
    expect(nightLightsFeedback(1, 2).feedback).toContain("Red is the left wingtip.");
  });

  it("a steady white light alone is the tail, flying away", () => {
    const { right, feedback } = nightLightsFeedback(3, 1);
    expect(right).toBe(true);
    expect(feedback).toContain("The white position light is on the tail.");
  });

  it("quotes the wrong pick and explains, in the design's format", () => {
    const { right, feedback } = nightLightsFeedback(0, 2);
    expect(right).toBe(false);
    expect(feedback).toBe(
      'Not "Crossing right to left". Red is on its left wing and green on its right. With red on your right, its nose is pointed at you.'
    );
  });

  it("the tower scene says stay well away because guy wires are unlighted", () => {
    const { right, feedback } = nightLightsFeedback(4, 1);
    expect(right).toBe(true);
    expect(feedback).toContain("Guy wires are not lighted.");
    expect(feedback).toContain("staying 2,000 ft away");
  });

  it("prompts before any pick", () => {
    expect(nightLightsFeedback(1, -1).feedback).toBe("Read the lights, then make your call.");
  });
});

describe("lostLinkFeedback (O4)", () => {
  it("has four failures with the design's answers and tags", () => {
    expect(LOST_LINK_SCENARIOS).toHaveLength(4);
    expect(LOST_LINK_SCENARIOS.map((s) => s.a)).toEqual([0, 0, 1, 0]);
    expect(LOST_LINK_SCENARIOS.map((s) => s.tag)).toEqual([
      "Link lost · return at 60 ft",
      "Link lost · return at 200 ft",
      "GPS lost · link OK",
      "Link lost · GPS lost",
    ]);
  });

  it("low return altitude: it should have been set above the trees", () => {
    const { right, feedback } = lostLinkFeedback(0, 0);
    expect(right).toBe(true);
    expect(feedback).toBe(
      "Correct. Return-to-home flies at the altitude you programmed. Set it above every obstacle before launch, and do not rely on obstacle sensors alone."
    );
    expect(lostLinkFeedback(0, 1).feedback).toContain('Not "Nothing: it will avoid them itself".');
  });

  it("with the failsafe set, the drone climbs, flies home, and lands", () => {
    expect(lostLinkFeedback(1, 0).right).toBe(true);
    expect(lostLinkFeedback(1, 0).feedback).toContain("climbs to the return altitude");
  });

  it("GPS loss with a working link: holds altitude but drifts", () => {
    const { right, feedback } = lostLinkFeedback(2, 1);
    expect(right).toBe(true);
    expect(feedback).toContain("Without GPS it cannot hold position or find home.");
    expect(lostLinkFeedback(2, 2).right).toBe(false);
  });

  it("a fly-away's last prevention chance is before launch", () => {
    const { right, feedback } = lostLinkFeedback(3, 0);
    expect(right).toBe(true);
    expect(feedback).toContain("Confirm a stable GPS position and check the lost-link setting before takeoff.");
  });

  it("prompts before any pick", () => {
    expect(lostLinkFeedback(0, -1).feedback).toBe("Pick an answer.");
  });
});

describe("illusionFeedback (O7)", () => {
  it("has three scenes with the design's answers", () => {
    expect(ILLUSION_SCENARIOS).toHaveLength(3);
    expect(ILLUSION_SCENARIOS.map((s) => s.a)).toEqual([1, 1, 0]);
    expect(ILLUSION_SCENARIOS.map((s) => s.opts.length)).toEqual([3, 3, 3]);
  });

  it("a stared-at steady light that drifts is autokinesis", () => {
    const { right, feedback } = illusionFeedback(0, 1);
    expect(right).toBe(true);
    expect(feedback).toBe(
      "Correct. A single fixed light stared at against a dark background appears to move. Keep your eyes scanning instead of fixing on it."
    );
    expect(illusionFeedback(0, 0).feedback).toContain('Not "The light is moving".');
  });

  it("a sloping row of ground lights is a false horizon", () => {
    const { right, feedback } = illusionFeedback(1, 1);
    expect(right).toBe(true);
    expect(feedback).toContain("a false sense of what is level");
    expect(illusionFeedback(1, 0).feedback).toContain('Not "Autokinesis".');
  });

  it("a lone lit pad risks misjudged height and angle: the black hole approach", () => {
    const { right, feedback } = illusionFeedback(2, 0);
    expect(right).toBe(true);
    expect(feedback).toContain("This is the black hole approach.");
  });

  it("prompts before any pick", () => {
    expect(illusionFeedback(1, -1).feedback).toBe("Pick an answer.");
  });
});

describe("walkaroundFeedback (O10)", () => {
  it("has five checks with the design's answers and tags", () => {
    expect(WALKAROUND_SCENARIOS).toHaveLength(5);
    expect(WALKAROUND_SCENARIOS.map((s) => s.a)).toEqual([1, 1, 0, 1, 0]);
    expect(WALKAROUND_SCENARIOS.map((s) => s.tag)).toEqual([
      "Check 1 of 5: propellers",
      "Check 2 of 5: battery",
      "Check 3 of 5: control station",
      "Check 4 of 5: anti-collision light",
      "Check 5 of 5: attached equipment",
    ]);
  });

  it("a cracked propeller grounds the aircraft, however small the crack", () => {
    const { right, feedback } = walkaroundFeedback(0, 1);
    expect(right).toBe(true);
    expect(feedback).toBe(
      "Correct. A cracked or chipped propeller can fail in flight. The aircraft is not in a condition for safe operation."
    );
    expect(walkaroundFeedback(0, 0).feedback).toBe(
      'Not "Fly: the crack is small". A cracked or chipped propeller can fail in flight. The aircraft is not in a condition for safe operation.'
    );
  });

  it("a swollen battery is out of service regardless of charge", () => {
    expect(walkaroundFeedback(1, 1).right).toBe(true);
    expect(walkaroundFeedback(1, 1).feedback).toContain("Swelling means the battery is damaged.");
  });

  it("the control link check is part of the preflight", () => {
    const { right, feedback } = walkaroundFeedback(2, 0);
    expect(right).toBe(true);
    expect(feedback).toContain("control link between the control station and the aircraft");
  });

  it("the anti-collision light must last the whole flight", () => {
    const { right, feedback } = walkaroundFeedback(3, 1);
    expect(right).toBe(true);
    expect(feedback).toContain("visible for 3 statute miles for the whole flight");
  });

  it("attached equipment must be secure and not change flight characteristics", () => {
    const { right, feedback } = walkaroundFeedback(4, 0);
    expect(right).toBe(true);
    expect(feedback).toContain("must not adversely affect flight characteristics or controllability");
  });

  it("prompts before any pick", () => {
    expect(walkaroundFeedback(0, -1).feedback).toBe("Make your call.");
  });
});
