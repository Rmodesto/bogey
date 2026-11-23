// A5 "Special-use airspace" — pure beat data, ported from
// docs/animations/designs/A5-SpecialUseGallery.dc.html. Do not re-derive.

export interface SpecialUseCard {
  code: string;
  kind: string;
  name: string;
  text: string;
  perm: boolean; // permission required; !perm shows "No permission needed"
}

export const SPECIAL_USE_CARDS: SpecialUseCard[] = [
  {
    code: "P-",
    kind: "Wall",
    name: "Prohibited area",
    text: "Security or national welfare. Plan on not flying here.",
    perm: true,
  },
  {
    code: "R-",
    kind: "Gate",
    name: "Restricted area",
    text: "Hazards such as artillery, gunnery, or missiles. Active full-time or at published hours.",
    perm: true,
  },
  {
    code: "W-",
    kind: "Caution",
    name: "Warning area",
    text: "Over water from 3 NM off the coast outward. May hold hazardous activity.",
    perm: false,
  },
  {
    code: "MOA",
    kind: "Caution",
    name: "Military operations area",
    text: "Military training. Open to you; check whether it is active.",
    perm: false,
  },
  {
    code: "A-",
    kind: "Caution",
    name: "Alert area",
    text: "High volume of pilot training or unusual aerial activity.",
    perm: false,
  },
  {
    code: "Not charted",
    kind: "Caution",
    name: "Controlled firing area",
    text: "Firing is suspended when an aircraft approaches.",
    perm: false,
  },
];

export const SPECIAL_USE_CAPTIONS = [
  "Prohibited area: a wall. Flight needs permission from the using agency, so plan on not flying there.",
  "Restricted area: a gate. You may enter only with permission from the using or controlling agency.",
  "Warning area: over water, from 3 nautical miles offshore outward. No permission needed, but what happens inside can be hazardous.",
  "Military operations area: not closed. You may fly there, with extreme caution when it is active.",
  "Alert area: no restriction. Expect heavy training traffic and keep watching.",
  "Controlled firing area: the firing stops when an aircraft is detected, which is why it is not on the chart.",
];

export interface SpecialUseCardState {
  opacity: number; // 1 once visited, 0.18 before its beat
  active: boolean; // thick border on the current beat's card
}

export function specialUseCardState(index: number, beat: number): SpecialUseCardState {
  return {
    opacity: index < beat ? 1 : 0.18,
    active: index === beat - 1,
  };
}
