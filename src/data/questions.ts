export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: {
    correct: string;
    reason: string;
    keyTakeaway: string;
  };
  domain: string;
  regulation?: string;
}

export const studyQuestions: Question[] = [
  {
    id: 1,
    question:
      "What is the maximum groundspeed that a small unmanned aircraft may be operated?",
    options: ["87 knots", "100 knots", "120 knots", "150 knots"],
    correctAnswer: 0,
    explanation: {
      correct: "87 knots is the correct answer.",
      reason:
        "According to 14 CFR Part 107.51(b), no person may operate a small unmanned aircraft at a groundspeed exceeding 87 knots (100 miles per hour).",
      keyTakeaway:
        "The 87 knot speed limit is a fundamental operational limitation for all Part 107 operations and is designed to ensure adequate pilot reaction time and aircraft controllability.",
    },
    domain: "Operations",
    regulation: "14 CFR 107.51(b)",
  },
  {
    id: 2,
    question:
      "What is the maximum altitude a small unmanned aircraft may be flown without special authorization?",
    options: ["400 feet AGL", "500 feet AGL", "400 feet MSL", "500 feet MSL"],
    correctAnswer: 0,
    explanation: {
      correct: "400 feet AGL is the correct answer.",
      reason:
        "Under 14 CFR Part 107.51(b), the maximum allowable altitude is 400 feet above ground level (AGL), or if higher than 400 feet AGL, within a 400-foot radius of a structure and not flying higher than 400 feet above the structure's immediate uppermost limit.",
      keyTakeaway:
        "The 400-foot AGL ceiling keeps small UAS well below manned aircraft traffic patterns and is one of the most commonly tested operational limitations.",
    },
    domain: "Operations",
    regulation: "14 CFR 107.51(b)",
  },
  {
    id: 3,
    question:
      "Under what conditions may a remote pilot operate a small UAS from a moving vehicle?",
    options: [
      "Only in a sparsely populated area",
      "Only over water",
      "Never under any circumstances",
      "Only when the vehicle is stationary",
    ],
    correctAnswer: 0,
    explanation: {
      correct:
        "A remote pilot may operate from a moving vehicle only in a sparsely populated area.",
      reason:
        "14 CFR 107.25 states that a remote pilot may operate a small UAS from a moving vehicle or aircraft only in a sparsely populated area. This restriction protects people on the ground.",
      keyTakeaway:
        "Moving vehicle operations are not completely prohibited — they are limited to sparsely populated areas to reduce risk to people on the ground.",
    },
    domain: "Regulations",
    regulation: "14 CFR 107.25",
  },
];

export const examQuestions: Question[] = [
  {
    id: 1,
    question:
      "What is the maximum altitude a small unmanned aircraft may be flown without special authorization?",
    options: ["400 feet AGL", "500 feet AGL", "400 feet MSL", "500 feet MSL"],
    correctAnswer: 0,
    explanation: {
      correct: "400 feet AGL is the correct answer.",
      reason:
        "Under 14 CFR Part 107.51(b), the maximum allowable altitude is 400 feet above ground level.",
      keyTakeaway: "The 400-foot AGL ceiling is a fundamental Part 107 limit.",
    },
    domain: "Operations",
    regulation: "14 CFR 107.51(b)",
  },
  {
    id: 2,
    question:
      "Which class of airspace requires ATC authorization for UAS operations?",
    options: [
      "Class B, C, D, and E surface area",
      "Class G only",
      "Class E only",
      "All controlled airspace",
    ],
    correctAnswer: 0,
    explanation: {
      correct:
        "Class B, C, D, and E surface area airspace require ATC authorization.",
      reason:
        "Part 107.41 prohibits operations in Class B, C, D, or within the lateral boundaries of the surface area of Class E airspace designated for an airport without prior ATC authorization (LAANC or DroneZone).",
      keyTakeaway:
        "Always check airspace before flight. LAANC provides near-real-time authorization for controlled airspace near airports.",
    },
    domain: "Airspace Classification",
    regulation: "14 CFR 107.41",
  },
  {
    id: 3,
    question: "What does a METAR report provide?",
    options: [
      "Current surface weather conditions",
      "Forecast weather conditions",
      "Winds aloft data",
      "NOTAMs for an area",
    ],
    correctAnswer: 0,
    explanation: {
      correct: "METAR reports provide current surface weather conditions.",
      reason:
        "A METAR (Meteorological Aerodrome Report) is an observation of current surface weather conditions at a specific airport or weather station.",
      keyTakeaway:
        "METARs are observations (current), while TAFs are forecasts (future). Know the difference for the exam.",
    },
    domain: "Weather",
    regulation: "AC 00-45H",
  },
  {
    id: 4,
    question:
      "Who is responsible for determining whether a small UAS operation can be conducted safely?",
    options: [
      "Remote pilot in command",
      "Visual observer",
      "FAA inspector",
      "Aircraft manufacturer",
    ],
    correctAnswer: 0,
    explanation: {
      correct: "The remote pilot in command (RPIC) is responsible.",
      reason:
        "14 CFR 107.19 establishes that the remote pilot in command is directly responsible for and is the final authority as to the operation of the small unmanned aircraft system.",
      keyTakeaway:
        "The RPIC has final authority and responsibility — similar to a manned aircraft pilot in command. This responsibility cannot be delegated.",
    },
    domain: "Regulations",
    regulation: "14 CFR 107.19",
  },
  {
    id: 5,
    question:
      "What effect does high density altitude have on UAS performance?",
    options: [
      "Decreased performance",
      "Increased performance",
      "No effect",
      "Increased battery life",
    ],
    correctAnswer: 0,
    explanation: {
      correct: "High density altitude decreases UAS performance.",
      reason:
        "High density altitude means the air is less dense. Less dense air reduces propeller efficiency and lift, requiring more power to maintain flight, which decreases overall performance and battery life.",
      keyTakeaway:
        "High, hot, and humid conditions increase density altitude and reduce aircraft performance. Always account for environmental conditions during preflight planning.",
    },
    domain: "Loading & Performance",
  },
  {
    id: 6,
    question:
      "During preflight inspection, the remote pilot discovers a small crack in the propeller. What action should be taken?",
    options: [
      "Replace the propeller before flight",
      "Fly if the crack is less than 1 inch",
      "Apply tape to secure the crack",
      "Fly at reduced speed only",
    ],
    correctAnswer: 0,
    explanation: {
      correct: "The propeller must be replaced before flight.",
      reason:
        "Any damage to a propeller can lead to vibration, imbalance, and potential catastrophic failure during flight. The RPIC is responsible for ensuring the aircraft is in a condition for safe operation per 107.15.",
      keyTakeaway:
        "Never fly with damaged components. Preflight inspection is critical and the RPIC must ensure airworthiness before every flight.",
    },
    domain: "Operations",
    regulation: "14 CFR 107.15",
  },
  {
    id: 7,
    question:
      "What is the minimum visibility required for Part 107 operations?",
    options: [
      "3 statute miles",
      "1 statute mile",
      "5 statute miles",
      "2 statute miles",
    ],
    correctAnswer: 0,
    explanation: {
      correct: "3 statute miles is the minimum visibility required.",
      reason:
        "14 CFR 107.51(c) requires a minimum flight visibility of 3 statute miles as reported from the location of the control station.",
      keyTakeaway:
        "The 3 SM visibility minimum ensures the RPIC and visual observers can maintain visual line of sight with the UAS and see-and-avoid other aircraft.",
    },
    domain: "Weather",
    regulation: "14 CFR 107.51(c)",
  },
  {
    id: 8,
    question:
      "Under Part 107, when must a remote pilot report an accident to the FAA?",
    options: [
      "Within 10 days of serious injury, loss of consciousness, or property damage over $500",
      "Within 24 hours of any incident",
      "Within 30 days of any incident",
      "Only if the UAS is destroyed",
    ],
    correctAnswer: 0,
    explanation: {
      correct: "Within 10 days of qualifying events.",
      reason:
        "14 CFR 107.9 requires the RPIC to report any operation that results in serious injury to any person, loss of consciousness, or damage to any property (other than the UAS) in excess of $500 within 10 calendar days.",
      keyTakeaway:
        "Remember the three triggers: serious injury, loss of consciousness, or $500+ property damage. The reporting window is 10 calendar days.",
    },
    domain: "Regulations",
    regulation: "14 CFR 107.9",
  },
  {
    id: 9,
    question: "What type of weather briefing should a remote pilot request for a planned flight in 3 hours?",
    options: [
      "Standard briefing",
      "Abbreviated briefing",
      "Outlook briefing",
      "SIGMET briefing",
    ],
    correctAnswer: 0,
    explanation: {
      correct: "A standard briefing is appropriate.",
      reason:
        "A standard briefing is requested when the pilot has not received a previous briefing and the flight is planned within approximately 6 hours. It provides the most complete weather picture.",
      keyTakeaway:
        "Standard = no prior info (most complete). Abbreviated = updating a previous briefing. Outlook = planning 6+ hours in advance.",
    },
    domain: "Weather",
  },
  {
    id: 10,
    question:
      "The weight of an aircraft can best be controlled by the pilot by restricting what?",
    options: [
      "Payload and fuel",
      "Speed and altitude",
      "Takeoff distance",
      "Flight time",
    ],
    correctAnswer: 0,
    explanation: {
      correct: "Payload and fuel are the controllable weight factors.",
      reason:
        "The pilot can control aircraft weight primarily through payload (cargo, equipment) and fuel load. The empty weight of the aircraft is fixed. For UAS, this translates to payload and battery selection.",
      keyTakeaway:
        "Weight management is critical for UAS operations. Heavier payloads reduce flight time and performance. Always calculate weight and balance before flight.",
    },
    domain: "Loading & Performance",
  },
];
