import { describe, it, expect } from "vitest";
import {
  CTAF_SCENARIOS,
  CTAF_PROMPT,
  CTAF_CAPTION,
  ctafFeedback,
} from "../../../components/animations/logic/buildACtafCall";
import {
  ATTITUDE_SCENARIOS,
  ATTITUDE_OPTIONS,
  ATTITUDE_PROMPT,
  attitudeFeedback,
} from "../../../components/animations/logic/hazardousAttitudes";
import {
  RISK_SCENARIOS,
  RISK_CHIPS,
  RISK_PROMPT,
  riskChipBg,
  riskFeedback,
} from "../../../components/animations/logic/riskCheckOnAJob";
import {
  AIRPORT_LIGHTING_CAPTIONS,
  BEACON_ROWS,
  airportLightingScene,
} from "../../../components/animations/logic/airportLighting";
import {
  RADIO_LOS_CAPTIONS,
  RADIO_LOS_SIGNALS,
  radioLosScene,
} from "../../../components/animations/logic/radioLineOfSight";

// Scenario and beat data for the Phase 3 operations animations, asserted
// against the design files in docs/animations/designs/ (O3, O8, O9, O11, O12)
// byte-for-byte.

describe("ctafFeedback (O3)", () => {
  it("matches the design's correct answers", () => {
    expect(CTAF_SCENARIOS.map((s) => s.a)).toEqual([0, 0, 0, 0, 0]);
    expect(CTAF_SCENARIOS).toHaveLength(5);
  });

  it("builds the call block by block, ending on the listening radio", () => {
    expect(CTAF_SCENARIOS[0].v).toEqual({ oB1: 1, oB2: 0.15, oB3: 0.15, oB4: 0.15, oB5: 0.15, oEar: 0 });
    expect(CTAF_SCENARIOS[2].v).toEqual({ oB1: 1, oB2: 1, oB3: 1, oB4: 1, oB5: 0.15, oEar: 0 });
    expect(CTAF_SCENARIOS[4].v).toEqual({ oB1: 1, oB2: 1, oB3: 1, oB4: 1, oB5: 1, oEar: 1 });
  });

  it("starts the call with the airport name plus traffic", () => {
    expect(CTAF_SCENARIOS[0].opts).toEqual(["“Riverside traffic”", "The aircraft’s tail number"]);
    const { right, feedback } = ctafFeedback(0, 0);
    expect(right).toBe(true);
    expect(feedback).toBe("Correct. A self-announce call starts with who you are calling: the airport name followed by “traffic”.");
  });

  it("says letters and numbers phonetically", () => {
    expect(ctafFeedback(1, 0).right).toBe(true);
    expect(ctafFeedback(1, 0).feedback).toBe("Correct. Letters use the phonetic alphabet. J is Juliett.");
    expect(ctafFeedback(2, 0).right).toBe(true);
    expect(ctafFeedback(2, 0).feedback).toBe("Correct. Nine is said “niner”. Three is “tree” and five is “fife”.");
  });

  it("defaults to 122.9 MHz when no CTAF is published", () => {
    expect(CTAF_SCENARIOS[3].opts).toEqual(["122.9 MHz", "121.5 MHz", "123.45 MHz"]);
    expect(ctafFeedback(3, 0).right).toBe(true);
    expect(ctafFeedback(3, 0).feedback).toContain("the default is 122.9 MHz");
  });

  it("the drone pilot listens; transmit only in a real emergency", () => {
    expect(ctafFeedback(4, 0).right).toBe(true);
    expect(ctafFeedback(4, 0).feedback).toBe(
      "Correct. Part 107 does not require you to talk on the radio. Monitoring tells you where the manned traffic is; transmit only in a real emergency."
    );
  });

  it("names the rejected option on a wrong pick", () => {
    const { right, feedback } = ctafFeedback(1, 1);
    expect(right).toBe(false);
    expect(feedback).toBe('Not "Jay". Letters use the phonetic alphabet. J is Juliett.');
  });

  it("prompts before any pick, and carries the design's caption", () => {
    expect(ctafFeedback(0, -1)).toEqual({ right: false, feedback: CTAF_PROMPT });
    expect(CTAF_PROMPT).toBe("Pick an answer.");
    expect(CTAF_CAPTION).toBe(
      "A radio call is built from the same blocks every time: who you are calling, who you are, where you are, what you intend."
    );
  });
});

describe("attitudeFeedback (O8)", () => {
  it("matches the design's correct answers", () => {
    expect(ATTITUDE_SCENARIOS.map((s) => s.a)).toEqual([3, 0, 1, 2, 4]);
    expect(ATTITUDE_SCENARIOS).toHaveLength(5);
  });

  it("every vignette offers the same five attitudes", () => {
    expect(ATTITUDE_OPTIONS).toEqual(["Anti-authority", "Impulsivity", "Invulnerability", "Macho", "Resignation"]);
    for (const s of ATTITUDE_SCENARIOS) {
      expect(s.opts).toEqual(ATTITUDE_OPTIONS);
    }
  });

  it("carries the design's quotes", () => {
    expect(ATTITUDE_SCENARIOS.map((s) => s.quote)).toEqual([
      "“I can thread it between those trees. Watch this.”",
      "“Those rules are for other people. Nobody tells me where to fly.”",
      "“No time for the checklist. Just launch, quickly.”",
      "“I have flown in worse. It will not happen to me.”",
      "“What’s the use? The pilot has already decided.”",
    ]);
  });

  it("confirms each attitude with its antidote", () => {
    expect(attitudeFeedback(0, 3).right).toBe(true);
    expect(attitudeFeedback(0, 3).feedback).toBe("Correct. Macho takes chances to prove something. Antidote: “Taking chances is foolish.”");
    expect(attitudeFeedback(1, 0).feedback).toContain("Follow the rules. They are usually right.");
    expect(attitudeFeedback(2, 1).feedback).toContain("Not so fast. Think first.");
    expect(attitudeFeedback(3, 2).feedback).toContain("It could happen to me.");
    expect(attitudeFeedback(4, 4).feedback).toContain("I am not helpless. I can make a difference.");
  });

  it("names the rejected option on a wrong pick", () => {
    const { right, feedback } = attitudeFeedback(0, 2);
    expect(right).toBe(false);
    expect(feedback).toBe('Not "Invulnerability". Macho takes chances to prove something. Antidote: “Taking chances is foolish.”');
  });

  it("prompts before any pick", () => {
    expect(attitudeFeedback(0, -1)).toEqual({ right: false, feedback: ATTITUDE_PROMPT });
    expect(ATTITUDE_PROMPT).toBe("Name the attitude.");
  });
});

describe("riskFeedback (O9)", () => {
  it("matches the design's correct answers (always the safe call)", () => {
    expect(RISK_SCENARIOS.map((s) => s.a)).toEqual([0, 0, 0, 0, 0]);
    expect(RISK_SCENARIOS).toHaveLength(5);
  });

  it("walks the chip row one check at a time", () => {
    expect(RISK_CHIPS).toEqual(["Pilot", "Aircraft", "Environment", "External pressure", "Crew"]);
    expect(RISK_SCENARIOS.map((s) => s.chip)).toEqual([0, 1, 2, 3, 4]);
    expect(riskChipBg(0, 0)).toBe("#9cd94a");
    expect(riskChipBg(0, 1)).toBe("#FFFFFF");
    expect(riskChipBg(3, 3)).toBe("#9cd94a");
    expect(riskChipBg(3, 4)).toBe("#FFFFFF");
  });

  it("confirms each check's correct pick", () => {
    expect(riskFeedback(0, 0).right).toBe(true);
    expect(riskFeedback(0, 0).feedback).toContain("Fatigue and illness degrade judgment");
    expect(riskFeedback(1, 0).feedback).toContain("condition for safe operation");
    expect(riskFeedback(2, 0).feedback).toContain("people on the ground");
    expect(riskFeedback(3, 0).right).toBe(true);
    expect(riskFeedback(3, 0).feedback).toBe(
      "Correct. A deadline is an external pressure. The remote pilot in command has final authority, and the gusts are the deciding fact."
    );
    expect(riskFeedback(4, 0).feedback).toContain("who watches what");
  });

  it("names the rejected option on a wrong pick", () => {
    const { right, feedback } = riskFeedback(3, 1);
    expect(right).toBe(false);
    expect(feedback).toBe(
      'Not "The client". A deadline is an external pressure. The remote pilot in command has final authority, and the gusts are the deciding fact.'
    );
  });

  it("prompts before any pick", () => {
    expect(riskFeedback(0, -1)).toEqual({ right: false, feedback: RISK_PROMPT });
    expect(RISK_PROMPT).toBe("Make your call.");
  });
});

describe("airportLightingScene (O11)", () => {
  it("carries the design's captions", () => {
    expect(AIRPORT_LIGHTING_CAPTIONS).toEqual([
      "A civilian land airport: the beacon alternates white and green.",
      "A military airport: two quick white flashes, then green.",
      "A heliport: green, yellow, and white.",
      "A lighted seaplane base: white and yellow.",
      "On the ground, runway edge lights are white and taxiway edge lights are blue.",
      "Each color is named on screen, here and on the test. Learn the patterns as words: white-green, white-white-green.",
    ]);
  });

  it("names every beacon pattern in color words", () => {
    expect(BEACON_ROWS.map((r) => r.name)).toEqual([
      "Civilian land airport",
      "Military airport",
      "Heliport",
      "Seaplane base",
    ]);
    expect(BEACON_ROWS.map((r) => r.colors)).toEqual([
      ["White", "Green"],
      ["White", "White", "Green"],
      ["Green", "Yellow", "White"],
      ["White", "Yellow"],
    ]);
  });

  it("reveals one row per beat, then the runway scene; beat 6 adds nothing new", () => {
    expect(airportLightingScene(1)).toEqual({ o1: 1, o2: 0, o3: 0, o4: 0, o5: 0 });
    expect(airportLightingScene(2)).toEqual({ o1: 1, o2: 1, o3: 0, o4: 0, o5: 0 });
    expect(airportLightingScene(3)).toEqual({ o1: 1, o2: 1, o3: 1, o4: 0, o5: 0 });
    expect(airportLightingScene(4)).toEqual({ o1: 1, o2: 1, o3: 1, o4: 1, o5: 0 });
    expect(airportLightingScene(5)).toEqual({ o1: 1, o2: 1, o3: 1, o4: 1, o5: 1 });
    expect(airportLightingScene(6)).toEqual({ o1: 1, o2: 1, o3: 1, o4: 1, o5: 1 });
  });
});

describe("radioLosScene (O12)", () => {
  it("carries the design's captions", () => {
    expect(RADIO_LOS_CAPTIONS).toEqual([
      "The control link is radio. With a clear path between controller and drone, the signal is strong.",
      "The drone flies farther out. The path is still clear, but the signal weakens with distance.",
      "It drops behind the hill. The hill is now between the two radios and the link is blocked.",
      "Back in the open, near other transmitters on a crowded band. Interference cuts the usable range even with a clear path.",
      "So range is not one number. It depends on what is between you and the drone and what else is transmitting.",
      "Keep a clear path to the drone, and decide before launch what it does when the link is lost.",
    ]);
  });

  it("reads the signal strength beat by beat", () => {
    expect(RADIO_LOS_SIGNALS).toEqual([
      "Signal: strong",
      "Signal: weaker",
      "Signal: lost",
      "Signal: weak, interference",
      "Signal: good",
      "Signal: good",
    ]);
    expect([1, 2, 3, 4, 5, 6].map((b) => radioLosScene(b).bars)).toEqual([
      [1, 1, 1, 1],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [1, 1, 1, 0],
    ]);
  });

  it("flies the drone out, behind the hill, and back near the transmitters", () => {
    expect(radioLosScene(1)).toMatchObject({ dX: 190, dY: 170, lx: 190, ly: 170, lc: "#4f7d14", ld: "1 0", oX: 0, oTx: 0.2 });
    expect(radioLosScene(2)).toMatchObject({ dX: 300, dY: 170, lx: 300, ly: 170, lc: "#4f7d14", ld: "10 5", oX: 0 });
    // Behind the hill the drone is at 590, but the line stops at the hill (400, 268).
    expect(radioLosScene(3)).toMatchObject({ dX: 590, dY: 320, lx: 400, ly: 268, lc: "#b42318", ld: "6 7", oX: 1, oTx: 0.2 });
    expect(radioLosScene(4)).toMatchObject({ dX: 250, dY: 200, lx: 250, ly: 200, lc: "#b42318", ld: "6 7", oX: 0, oTx: 1 });
    expect(radioLosScene(5)).toMatchObject({ dX: 300, dY: 170, lx: 300, ly: 170, lc: "#4f7d14", ld: "1 0", oTx: 1, oPlan: 0 });
    expect(radioLosScene(6)).toMatchObject({ dX: 300, dY: 170, oPlan: 1, oTx: 1 });
  });
});
