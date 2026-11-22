// R6 "Category sorter" — pure pick logic, ported from
// docs/animations/designs/R6-CategorySorter.dc.html. Do not re-derive.

export interface SorterDrone {
  w: string;
  chips: string[];
  a: 1 | 2 | 3 | 4;
  why: string;
}

export const DRONES: SorterDrone[] = [
  {
    w: "0.5 lb",
    chips: ["Weight 0.5 lb", "No exposed rotating parts", "No category label", "No airworthiness certificate"],
    a: 1,
    why: "It weighs 0.55 lb or less and has no exposed rotating parts that would lacerate skin.",
  },
  {
    w: "1.2 lb",
    chips: ["Weight 1.2 lb", "Prop guards fitted", "Label: Category 2", "On an FAA-accepted declaration of compliance"],
    a: 2,
    why: "It is labeled Category 2 and listed on an FAA-accepted declaration of compliance.",
  },
  {
    w: "4 lb",
    chips: ["Weight 4 lb", "Label: Category 3", "On an FAA-accepted declaration of compliance", "No airworthiness certificate"],
    a: 3,
    why: "It is labeled Category 3, so it may fly over people only on restricted sites or without sustained flight over them.",
  },
  {
    w: "30 lb",
    chips: ["Weight 30 lb", "No category label", "Airworthiness certificate (Part 21)"],
    a: 4,
    why: "It holds an airworthiness certificate issued under Part 21.",
  },
];

export const CATEGORY_TESTS = [
  "0.55 lb or less, no exposed rotating parts",
  "Injury limit 11 ft-lb, declared and labeled",
  "Injury limit 25 ft-lb, declared and labeled, restricted sites only",
  "Has an airworthiness certificate",
];

// pick: 0 = no pick yet, 1-4 = chosen category
export function sorterFeedback(droneIndex: number, pick: number): { right: boolean; feedback: string } {
  const d = DRONES[droneIndex];
  const right = pick === d.a;
  const wrongWhy = [
    "",
    "Category 1 stops at 0.55 lb. This drone weighs " + d.w + ".",
    "Category 2 needs a declaration of compliance and a Category 2 label. This drone is not labeled Category 2.",
    "Category 3 needs a declaration of compliance and a Category 3 label. This drone is not labeled Category 3.",
    "Category 4 needs an airworthiness certificate. This drone has none.",
  ];
  if (!pick) return { right: false, feedback: "Which category lets this drone fly over people? Pick one." };
  if (right) return { right: true, feedback: "Correct: Category " + d.a + ". " + d.why };
  return { right: false, feedback: "Not Category " + pick + ". " + wrongWhy[pick] };
}
