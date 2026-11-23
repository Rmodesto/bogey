"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import { NIGHT_LIGHT_SCENARIOS, nightLightsFeedback } from "./logic/nightLights";

// A7 — "Lights at night" scenario player. Read a manned aircraft's position
// lights on a dark sky and call its direction of flight.
// Layout and copy ported from docs/animations/designs/A7-LightsAtNight.dc.html.

const STARS: [number, number][] = [
  [40, 60], [120, 30], [210, 70], [470, 40], [540, 80],
  [600, 30], [90, 120], [580, 130], [330, 24], [420, 150],
];

export default function NightLights() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(-1);
  const reducedMotion = useReducedMotion();

  const n = NIGHT_LIGHT_SCENARIOS.length;
  const s = NIGHT_LIGHT_SCENARIOS[i];
  const { right, feedback } = nightLightsFeedback(i, pick);
  const fade = reducedMotion ? undefined : "opacity 0.5s ease";
  const cols = s.opts.length > 3 ? 2 : s.opts.length;

  const stage = (
    <div className="w-full h-full box-border p-[14px] flex flex-col gap-[10px] text-jet-black">
      {/* Night-sky scene */}
      <div className="relative h-[196px] shrink-0 rounded-[10px] overflow-hidden" style={{ background: "#0e1114" }}>
        <svg aria-hidden="true" width="642" height="196" viewBox="0 0 642 196" fill="none" className="absolute left-0 top-0">
          {STARS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" fill="#8a9198" />
          ))}
          <path d="M0 176h642" stroke="#2b2f33" strokeWidth="2" />
          {/* Pair: green left, red right (nose-on) */}
          <g style={{ opacity: s.v.oGL, transition: fade }}>
            <circle cx="271" cy="92" r="22" fill="#30a46c" opacity="0.25" />
            <circle cx="271" cy="92" r="10" fill="#30a46c" />
            <text x="271" y="136" fontSize="12" fontWeight="600" fill="#FFFFFF" textAnchor="middle">Green</text>
          </g>
          <g style={{ opacity: s.v.oRR, transition: fade }}>
            <circle cx="371" cy="92" r="22" fill="#e5484d" opacity="0.25" />
            <circle cx="371" cy="92" r="10" fill="#e5484d" />
            <text x="371" y="136" fontSize="12" fontWeight="600" fill="#FFFFFF" textAnchor="middle">Red</text>
          </g>
          {/* Lone red, lone green, lone white */}
          <g style={{ opacity: s.v.oR1, transition: fade }}>
            <circle cx="321" cy="92" r="22" fill="#e5484d" opacity="0.25" />
            <circle cx="321" cy="92" r="10" fill="#e5484d" />
            <text x="321" y="136" fontSize="12" fontWeight="600" fill="#FFFFFF" textAnchor="middle">Red</text>
          </g>
          <g style={{ opacity: s.v.oG1, transition: fade }}>
            <circle cx="321" cy="92" r="22" fill="#30a46c" opacity="0.25" />
            <circle cx="321" cy="92" r="10" fill="#30a46c" />
            <text x="321" y="136" fontSize="12" fontWeight="600" fill="#FFFFFF" textAnchor="middle">Green</text>
          </g>
          <g style={{ opacity: s.v.oW, transition: fade }}>
            <circle cx="321" cy="92" r="22" fill="#FFFFFF" opacity="0.25" />
            <circle cx="321" cy="92" r="10" fill="#FFFFFF" />
            <text x="321" y="136" fontSize="12" fontWeight="600" fill="#FFFFFF" textAnchor="middle">White</text>
          </g>
          {/* Lighted tower with unlit guy wires */}
          <g style={{ opacity: s.v.oTower, transition: fade }}>
            <path d="M321 176V44" stroke="#8a9198" strokeWidth="4" />
            <path d="M311 176L321 60L331 176M313 150h16M315 120h12M317 90h8" stroke="#8a9198" strokeWidth="1.5" fill="none" />
            <circle cx="321" cy="42" r="16" fill="#e5484d" opacity="0.25" />
            <circle cx="321" cy="42" r="7" fill="#e5484d" />
            <circle cx="321" cy="110" r="5" fill="#e5484d" />
            <path d="M321 60L150 176M321 60L492 176M321 110L226 176M321 110L416 176" stroke="#8a9198" strokeWidth="1" strokeDasharray="2 7" opacity="0.5" />
            <text x="150" y="168" fontSize="11" fontWeight="600" fill="#FFFFFF" textAnchor="middle">Guy wires: no lights</text>
            <text x="350" y="46" fontSize="11" fontWeight="600" fill="#FFFFFF" textAnchor="start">Red obstruction lights</text>
          </g>
        </svg>
        <div className="absolute left-[10px] top-[8px] max-w-[622px] text-[12.5px] font-semibold bg-white px-[8px] py-[2px] rounded-[6px]">
          {s.label}
        </div>
      </div>

      {/* Question */}
      <div className="text-[15px] font-semibold leading-[1.3]">{s.q}</div>

      {/* Answers */}
      <div
        role="group"
        aria-label="Answers"
        className="grid gap-[8px]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {s.opts.map((label, k) => {
          const mine = pick === k;
          const ok = mine && right;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={mine}
              onClick={() => setPick(k)}
              className="min-h-[44px] flex items-center justify-between gap-[6px] text-left px-[12px] py-[8px] rounded-[10px] cursor-pointer text-[14px] font-semibold leading-[1.25] text-jet-black focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-deep-ice-blue"
              style={{
                border: ok ? "2px solid #7fbf2e" : mine ? "2px dashed #b42318" : "2px solid #0e1114",
                background: ok ? "#eaf6d8" : "#FFFFFF",
              }}
            >
              <span>{label}</span>
              <span className="text-[12px]" style={{ color: ok ? "#33590a" : "#b42318" }}>
                {ok ? "Correct" : mine ? "Not this" : ""}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <div
        className="grow flex items-center px-[12px] py-[6px] rounded-[10px] text-[13.5px] font-medium leading-[1.4]"
        style={{
          border: pick >= 0 ? (right ? "2px solid #7fbf2e" : "2px dashed #b42318") : "2px solid #e3e6ea",
          color: pick >= 0 && !right ? "#b42318" : "#0e1114",
          background: pick >= 0 ? (right ? "#eaf6d8" : "#FFFFFF") : "#f6f8fa",
        }}
      >
        {feedback}
      </div>
    </div>
  );

  const controls = (
    <>
      <span className="text-[14px] font-semibold tabular-nums">Scene {i + 1} of {n}</span>
      <button
        type="button"
        onClick={() => {
          setI(Math.max(0, i - 1));
          setPick(-1);
        }}
        className="min-h-[44px] px-[16px] ml-auto rounded-full text-[14px] font-semibold cursor-pointer border-2 border-jet-black bg-white text-jet-black focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-deep-ice-blue"
      >
        Back
      </button>
      <button
        type="button"
        onClick={() => {
          setI((i + 1) % n);
          setPick(-1);
        }}
        className="min-h-[44px] px-[16px] rounded-full text-[14px] font-semibold cursor-pointer border-2 border-volt-green bg-volt-green text-jet-black hover:bg-volt-lime hover:border-volt-lime transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-deep-ice-blue"
      >
        {i === n - 1 ? "Start over" : "Next"}
      </button>
    </>
  );

  return (
    <AnimationFrame
      title="Lights at night"
      category="Airspace"
      stage={stage}
      stageBg="#FFFFFF"
      caption="Each light is named on screen, so the answer never depends on telling the colors apart."
      controls={controls}
      claim="Red is the left wing, green is the right wing, white is the tail."
      sourceLabel="FAA pilot handbook"
      citation="AIM 4-3-23"
      bogeymanLine="Red and green together means it is coming at you. Yield early."
      liveAnnouncement={`${s.label} ${feedback}`}
    />
  );
}
