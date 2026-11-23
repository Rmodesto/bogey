// R12 "Moving vehicles and cargo" — pure pick logic, ported from
// docs/animations/designs/R12-MovingVehiclesAndCargo.dc.html. Do not re-derive.

export interface DriveSceneFlags {
  oLand: number; // flat ground strip
  oOpen: number; // sparse ranchland backdrop
  oTown: number; // town buildings and people
  oTruck: number; // moving truck with the pilot in the bed
  oBoat: number; // moving boat on open water
  oHeli: number; // helicopter with the pilot aboard
  oPkg: number; // customer package slung under the drone
}

export interface DriveScenario {
  label: string;
  q: string;
  opts: string[];
  a: number; // index of the correct option
  why: string;
  v: DriveSceneFlags;
}

export const DRIVE_SCENARIOS: DriveScenario[] = [
  {
    label: "The pilot rides in the bed of a moving truck across empty ranchland.",
    q: "May the pilot fly from this moving vehicle?",
    opts: ["Allowed", "Not allowed"],
    a: 0,
    why: "Flying from a moving land vehicle is allowed over a sparsely populated area when the drone is not carrying someone else’s property for pay.",
    v: { oLand: 1, oOpen: 1, oTown: 0, oTruck: 1, oBoat: 0, oHeli: 0, oPkg: 0 },
  },
  {
    label: "The same truck drives through a town neighborhood.",
    q: "May the pilot fly from this moving vehicle?",
    opts: ["Allowed", "Not allowed"],
    a: 1,
    why: "A town is not a sparsely populated area.",
    v: { oLand: 1, oOpen: 0, oTown: 1, oTruck: 1, oBoat: 0, oHeli: 0, oPkg: 0 },
  },
  {
    label: "Empty ranchland again, but the drone carries a customer’s package for a fee.",
    q: "May the pilot fly from this moving vehicle?",
    opts: ["Allowed", "Not allowed"],
    a: 1,
    why: "Another person’s property may not be carried for compensation or hire from a moving vehicle.",
    v: { oLand: 1, oOpen: 1, oTown: 0, oTruck: 1, oBoat: 0, oHeli: 0, oPkg: 1 },
  },
  {
    label: "The pilot is a passenger in a helicopter and flies the drone from it.",
    q: "May the pilot fly from this moving vehicle?",
    opts: ["Allowed", "Not allowed"],
    a: 1,
    why: "Part 107 does not allow flying from a moving aircraft, wherever it is.",
    v: { oLand: 1, oOpen: 1, oTown: 0, oTruck: 0, oBoat: 0, oHeli: 1, oPkg: 0 },
  },
  {
    label: "The pilot flies from a moving boat on open water, far from anyone.",
    q: "May the pilot fly from this moving vehicle?",
    opts: ["Allowed", "Not allowed"],
    a: 0,
    why: "A boat follows the same rule as a land vehicle: sparsely populated area, and no property carried for pay.",
    v: { oLand: 0, oOpen: 0, oTown: 0, oTruck: 0, oBoat: 1, oHeli: 0, oPkg: 0 },
  },
];

export const DRIVE_PROMPT = "Allowed, or not allowed? Make your call.";

export const DRIVE_CAPTION = "The vehicle, the area below, and the cargo each change the answer.";

// pick: -1 = no pick yet, otherwise option index
export function driveFeedback(i: number, pick: number): { right: boolean; feedback: string } {
  const s = DRIVE_SCENARIOS[i];
  if (pick < 0) return { right: false, feedback: DRIVE_PROMPT };
  if (pick === s.a) return { right: true, feedback: "Correct. " + s.why };
  return { right: false, feedback: 'Not "' + s.opts[pick] + '". ' + s.why };
}
