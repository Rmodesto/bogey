// R9 "Report or not" — pure pick logic, ported from
// docs/animations/designs/R9-ReportOrNot.dc.html. Do not re-derive.

export interface IncidentSceneFlags {
  oTree: number; // tree the drone hit
  oCar: number; // parked car with a scrape
  oPerson: number; // bystander
  oWin: number; // broken window
  tag: string; // cost/injury readout in the scene
}

export interface IncidentScenario {
  label: string;
  q: string;
  opts: string[];
  a: number; // index of the correct option
  why: string;
  v: IncidentSceneFlags;
}

export const INCIDENTS: IncidentScenario[] = [
  {
    label: "The drone hits a tree and is destroyed. Nobody is hurt and nothing else is damaged.",
    q: "Does the remote pilot have to report this to the FAA?",
    opts: ["Report within 10 days", "No report needed"],
    a: 1,
    why: "Damage to the drone itself does not count, whatever it cost.",
    v: { oTree: 1, oCar: 0, oPerson: 0, oWin: 0, tag: "Drone: $1,800 loss. Other property: $0" },
  },
  {
    label: "The drone clips a parked car. The body shop quotes $900.",
    q: "Does the remote pilot have to report this to the FAA?",
    opts: ["Report within 10 days", "No report needed"],
    a: 0,
    why: "Damage to property other than the drone that costs more than $500 to repair must be reported within 10 calendar days.",
    v: { oTree: 0, oCar: 1, oPerson: 0, oWin: 0, tag: "Repair to the car: $900" },
  },
  {
    label: "The drone strikes a bystander, who blacks out for a few seconds and then recovers.",
    q: "Does the remote pilot have to report this to the FAA?",
    opts: ["Report within 10 days", "No report needed"],
    a: 0,
    why: "Any loss of consciousness must be reported, even a brief one with full recovery.",
    v: { oTree: 0, oCar: 0, oPerson: 1, oWin: 0, tag: "Brief loss of consciousness" },
  },
  {
    label: "The drone breaks a window. Replacing it costs $350.",
    q: "Does the remote pilot have to report this to the FAA?",
    opts: ["Report within 10 days", "No report needed"],
    a: 1,
    why: "The repair costs $500 or less, so no report is required.",
    v: { oTree: 0, oCar: 0, oPerson: 0, oWin: 1, tag: "Repair to the window: $350" },
  },
  {
    label: "A bystander gets a small cut that needs a bandage.",
    q: "Does the remote pilot have to report this to the FAA?",
    opts: ["Report within 10 days", "No report needed"],
    a: 1,
    why: "A minor cut is not a serious injury. The rule covers serious injury and any loss of consciousness.",
    v: { oTree: 0, oCar: 0, oPerson: 1, oWin: 0, tag: "Minor cut, first aid only" },
  },
];

export const REPORT_PROMPT = "Report it, or not? Make your call.";

export const REPORT_CAPTION =
  "Three things trigger a report: serious injury, loss of consciousness, and damage to someone else’s property over $500.";

// pick: -1 = no pick yet, otherwise option index
export function reportFeedback(i: number, pick: number): { right: boolean; feedback: string } {
  const s = INCIDENTS[i];
  if (pick < 0) return { right: false, feedback: REPORT_PROMPT };
  if (pick === s.a) return { right: true, feedback: "Correct. " + s.why };
  return { right: false, feedback: 'Not "' + s.opts[pick] + '". ' + s.why };
}
