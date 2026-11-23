// R7 "Over people and vehicles" — pure pick logic, ported from
// docs/animations/designs/R7-OverPeopleAndVehicles.dc.html. Do not re-derive.

export interface VehicleSceneFlags {
  oCars: number; // moving cars on the public road
  oSpeed: number; // speed streaks behind the cars
  oPark: number; // parking sign, cars stationary
  oCrowd: number; // open-air assembly of people
  oFence: number; // closed-set fence and sign
  oTransit: number; // dashed transit arc across the road
  tag: string; // category pill next to the drone
}

export interface VehicleScenario {
  label: string;
  q: string;
  opts: string[];
  a: number; // index of the correct option
  why: string;
  v: VehicleSceneFlags;
}

export const VEHICLE_SCENARIOS: VehicleScenario[] = [
  {
    label: "A Category 1 drone crosses a public road once, without stopping over the traffic.",
    q: "Is this flight allowed without a waiver?",
    opts: ["Allowed", "Not allowed"],
    a: 0,
    why: "Outside a closed site, a category-eligible drone may pass over moving vehicles as long as it does not maintain sustained flight over them.",
    v: { oCars: 1, oSpeed: 1, oPark: 0, oCrowd: 0, oFence: 0, oTransit: 1, tag: "Category 1 · passing through" },
  },
  {
    label: "The same drone hovers over the highway for ten minutes to film the traffic.",
    q: "Is this flight allowed without a waiver?",
    opts: ["Allowed", "Not allowed"],
    a: 1,
    why: "That is sustained flight over moving vehicles on an open public road.",
    v: { oCars: 1, oSpeed: 1, oPark: 0, oCrowd: 0, oFence: 0, oTransit: 0, tag: "Category 1 · hovering 10 min" },
  },
  {
    label: "A closed film set. The road is shut to the public and every driver knows a drone may fly over.",
    q: "Is this flight allowed without a waiver?",
    opts: ["Allowed", "Not allowed"],
    a: 0,
    why: "On a closed or restricted-access site where everyone in a vehicle is on notice, sustained flight over moving vehicles is allowed.",
    v: { oCars: 1, oSpeed: 1, oPark: 0, oCrowd: 0, oFence: 1, oTransit: 0, tag: "Category 2 · following the cars" },
  },
  {
    label: "A Category 3 drone flies over the crowd at an outdoor concert.",
    q: "Is this flight allowed without a waiver?",
    opts: ["Allowed", "Not allowed"],
    a: 1,
    why: "Category 3 may never operate over an open-air assembly of people.",
    v: { oCars: 0, oSpeed: 0, oPark: 0, oCrowd: 1, oFence: 0, oTransit: 0, tag: "Category 3" },
  },
  {
    label: "A drone with no category flies over a lot where the only people are inside parked cars.",
    q: "Is this flight allowed without a waiver?",
    opts: ["Allowed", "Not allowed"],
    a: 0,
    why: "Flight over a person is allowed when that person is inside a stationary vehicle that gives reasonable protection from a falling drone.",
    v: { oCars: 1, oSpeed: 0, oPark: 1, oCrowd: 0, oFence: 0, oTransit: 0, tag: "No category" },
  },
];

export const VEHICLE_PROMPT = "Allowed, or not allowed? Make your call.";

export const VEHICLE_CAPTION =
  "Who is below the drone, are they moving, and is the site closed? Those three facts decide each case.";

// pick: -1 = no pick yet, otherwise option index
export function vehicleFeedback(i: number, pick: number): { right: boolean; feedback: string } {
  const s = VEHICLE_SCENARIOS[i];
  if (pick < 0) return { right: false, feedback: VEHICLE_PROMPT };
  if (pick === s.a) return { right: true, feedback: "Correct. " + s.why };
  return { right: false, feedback: 'Not "' + s.opts[pick] + '". ' + s.why };
}
