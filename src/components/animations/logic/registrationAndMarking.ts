// R10 "Registration and marking" — pure beat data, ported from
// docs/animations/designs/R10-RegistrationAndMarking.dc.html. Do not re-derive.
// TODO(verify): the 3-year registration period and the external-marking rule,
// pending a check against 14 CFR Part 48.

export const REGISTRATION_CAPTIONS = [
  "This drone weighs 0.40 pounds. For purely recreational flying, a drone of 0.55 pounds or less needs no registration.",
  "This flight is under Part 107. Every aircraft flown under Part 107 must be registered, whatever it weighs.",
  "Under Part 107 each aircraft is registered on its own. A registration lasts 3 years and then must be renewed.",
  "The registration number must be legibly displayed on an external surface of the aircraft.",
  "A number hidden inside the battery compartment does not meet the rule.",
  "Registered, marked on the outside, and renewed every 3 years. That is the whole rule.",
];

// The scale's readout and the registration number painted on the aircraft.
export const REGISTRATION_WEIGHT_LABEL = "0.40 lb";
export const REGISTRATION_NUMBER = "FA3XK7W2PL";

export interface RegistrationScene {
  rec: number; // "Recreational flying only" card (oRec)
  p107: number; // "Any Part 107 flight" card (o107)
  card: number; // "Registration" card (oCard)
  num: number; // registrationAndMarking number on an outside surface (oNum)
  bay: number; // battery-bay callout, beat 5 only (oBay)
  done: number; // "Registered and marked" badge (oDone)
}

export function registrationScene(beat: number): RegistrationScene {
  return {
    rec: beat >= 1 ? 1 : 0,
    p107: beat >= 2 ? 1 : 0,
    card: beat >= 3 ? 1 : 0,
    num: beat >= 4 ? 1 : 0,
    bay: beat === 5 ? 1 : 0,
    done: beat >= 6 ? 1 : 0,
  };
}
