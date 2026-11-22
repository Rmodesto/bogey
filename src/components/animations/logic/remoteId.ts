// R8 "Remote ID broadcast" — pure mode data, ported from
// docs/animations/designs/R8-RemoteID.dc.html. Do not re-derive.

export interface RemoteIdMode {
  title: string;
  tags: { label: string; highlight: boolean }[];
  note: string;
  drone: string;
  caption: string;
}

export const REMOTE_ID_MODES: RemoteIdMode[] = [
  {
    title: "Standard Remote ID broadcasts",
    tags: [
      { label: "Drone ID: serial number or session ID", highlight: false },
      { label: "Drone position and altitude", highlight: false },
      { label: "Drone velocity", highlight: false },
      { label: "Control station position and altitude", highlight: true },
      { label: "Time mark", highlight: false },
      { label: "Emergency status", highlight: true },
    ],
    note: "Broadcasts from takeoff to shutdown. If it stops broadcasting, land as soon as practicable.",
    drone: "Built in",
    caption: "Remote ID is built into the aircraft. The highlighted items are what a module does not send.",
  },
  {
    title: "A broadcast module broadcasts",
    tags: [
      { label: "Module serial number", highlight: false },
      { label: "Drone position and altitude", highlight: false },
      { label: "Drone velocity", highlight: false },
      { label: "Takeoff position and altitude", highlight: true },
      { label: "Time mark", highlight: false },
    ],
    note: "The pilot must be able to see the drone at all times. If it stops broadcasting, land as soon as practicable.",
    drone: "Add-on module",
    caption:
      "A module is added to a drone with no built-in Remote ID. It sends the takeoff location in place of the control station location, and no emergency status.",
  },
  {
    title: "Inside a recognized area",
    tags: [
      { label: "No broadcast required", highlight: true },
      { label: "Drone and pilot stay inside the boundary", highlight: false },
      { label: "Pilot can see the drone at all times", highlight: false },
    ],
    note: "Outside the boundary, a drone with no Remote ID equipment may not be flown.",
    drone: "No Remote ID",
    caption: "A drone with no Remote ID equipment may be flown only inside an FAA-recognized identification area.",
  },
];

export const REMOTE_ID_MODE_LABELS = ["Built in", "Add-on module", "Recognized area"];
