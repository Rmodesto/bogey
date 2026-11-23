"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { ILLUSION_SCENARIOS, illusionFeedback } from "./logic/nightIllusions";

// O7 — "Night illusions" scenario player. Three dark-sky scenes: autokinesis,
// false horizon, and the black hole approach.
// Layout and copy ported from docs/animations/designs/O7-NightIllusions.dc.html.

const STARS: [number, number][] = [
  [40, 50], [120, 30], [210, 64], [470, 40], [540, 76], [600, 30],
  [90, 104], [580, 120], [330, 24], [420, 96], [260, 40], [150, 80],
];

const SLOPE_LIGHTS: [number, number][] = [
  [60, 164], [134, 155], [208, 146], [282, 136], [356, 127], [430, 118], [504, 109], [578, 100],
];

export default function NightIllusions() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(-1);
  const reducedMotion = useReducedMotion();

  const n = ILLUSION_SCENARIOS.length;
  const s = ILLUSION_SCENARIOS[i];
  const { right, feedback } = illusionFeedback(i, pick);
  const fade = reducedMotion ? undefined : "opacity 0.5s ease";
  const cols = s.opts.length > 3 ? 2 : s.opts.length;

  const stage = (
    <div className="w-full h-full box-border p-[14px] flex flex-col gap-[10px] text-jet-black">
      {/* Night scene */}
      <div className="relative h-[196px] shrink-0 rounded-[10px] overflow-hidden" style={{ background: "#0e1114" }}>
        <svg aria-hidden="true" width="642" height="196" viewBox="0 0 642 196" fill="none" className="absolute left-0 top-0">
          {STARS.map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.2" fill="#FFFFFF" />
          ))}
          {/* One steady light on a dark hillside */}
          <g style={{ opacity: s.v.oOne, transition: fade }}>
            <path d="M0 150Q200 96 642 136L642 196L0 196Z" fill="#2b2f33" />
            <circle cx="321" cy="96" r="16" fill="#f5d90a" opacity="0.25" />
            <circle cx="321" cy="96" r="6" fill="#f5d90a" />
            <circle cx="353" cy="84" r="5" fill="#f5d90a" opacity="0.3" />
            <circle cx="381" cy="78" r="4" fill="#f5d90a" opacity="0.15" />
            <path d="M334 92q24 -12 40 -12" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="3 5" fill="none" />
            <text x="321" y="128" fontSize="11" fontWeight="600" fill="#FFFFFF" textAnchor="middle">One steady light</text>
          </g>
          {/* Sloping row of ground lights */}
          <g style={{ opacity: s.v.oSlope, transition: fade }}>
            <path d="M0 196L0 176L642 96L642 196Z" fill="#2b2f33" />
            {SLOPE_LIGHTS.map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#f5d90a" />
            ))}
            <path d="M30 140h582" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="3 6" />
            <text x="606" y="134" fontSize="11" fontWeight="600" fill="#FFFFFF" textAnchor="end">True horizon</text>
            <text x="120" y="186" fontSize="11" fontWeight="600" fill="#FFFFFF" textAnchor="middle">Row of ground lights</text>
          </g>
          {/* Lit pad, nothing else visible */}
          <g style={{ opacity: s.v.oPad, transition: fade }}>
            <rect x="0" y="150" width="642" height="46" fill="#17191c" />
            <ellipse cx="321" cy="170" rx="44" ry="9" fill="#9cd94a" />
            <text x="321" y="192" fontSize="11" fontWeight="600" fill="#FFFFFF" textAnchor="middle">Lit pad, nothing else visible</text>
            <path d="M246 96L300 160" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="3 6" />
          </g>
        </svg>
        {/* The returning drone, part of the black-hole scene */}
        <div aria-hidden="true" className="absolute left-[196px] top-[60px]" style={{ opacity: s.v.oPad, transition: fade }}>
          <Drone size={60} />
        </div>
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
      title="Night illusions"
      category="Operations"
      stage={stage}
      stageBg="#FFFFFF"
      caption="Each scene is a way the dark fools the eye. Name it before it catches you in the field."
      controls={controls}
      claim="At night, do not fix your eyes on a single light. Keep scanning."
      sourceLabel="FAA pilot handbook"
      citation="FAA-G-8082-22"
      bogeymanLine="If a lone light starts to wander, it is probably your eyes."
      liveAnnouncement={`${s.label} ${feedback}`}
    />
  );
}
