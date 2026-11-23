"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { SIGHT_SCENARIOS, SIGHT_CAPTION, sightFeedback } from "./logic/lineOfSight";

// R5 — "Line of sight" scenario player. Layout and copy ported from
// docs/animations/designs/R5-LineOfSight.dc.html.

const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-ice-blue";

function Person({ x, fill }: { x: number; fill: string }) {
  return (
    <g transform={`translate(${x} 166)`}>
      <circle cx="0" cy="-34" r="7" fill={fill} />
      <path d="M-9 0L-9 -16Q-9 -25 0 -25Q9 -25 9 -16L9 0Z" fill={fill} />
    </g>
  );
}

export default function LineOfSight() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(-1);
  const reducedMotion = useReducedMotion();

  const n = SIGHT_SCENARIOS.length;
  const s = SIGHT_SCENARIOS[i];
  const v = s.v;
  const { right, feedback } = sightFeedback(i, pick);
  const answered = pick >= 0;
  const fade = reducedMotion ? undefined : "opacity 0.5s ease";

  const stage = (
    <div className="w-full h-full box-border p-[14px] flex flex-col gap-[10px]">
      {/* Scene: pilot, building, drones, sight lines */}
      <div className="relative h-[196px] shrink-0 rounded-[10px] bg-mist-blue overflow-hidden">
        <svg aria-hidden="true" width="642" height="196" viewBox="0 0 642 196" fill="none" className="absolute left-0 top-0">
          <rect x="0" y="166" width="642" height="30" fill="#e3e6ea" />
          <path d="M0 166h642" stroke="#0e1114" strokeWidth="2" />
          {/* Building */}
          <rect x="300" y="60" width="84" height="106" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <path d="M316 80h14M354 80h14M316 104h14M354 104h14M316 128h14M354 128h14" stroke="#8a9198" strokeWidth="8" />
          {/* Remote pilot */}
          <Person x={84} fill="#2b2f33" />
          <text x="84" y="186" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="middle">Pilot</text>
          {/* Observer beside the pilot */}
          <g style={{ opacity: v.oVN, transition: fade }}>
            <Person x={134} fill="#6fa6c6" />
            <text x="140" y="186" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="middle">Observer</text>
          </g>
          {/* Far observer, on radio */}
          <g style={{ opacity: v.oVF, transition: fade }}>
            <Person x={566} fill="#6fa6c6" />
            <text x="566" y="186" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="middle">Observer, on radio</text>
          </g>
          {/* Near drone */}
          <g style={{ opacity: v.oD1, transition: fade }}>
            <g transform="translate(170 44)">
              <Drone size={66} />
            </g>
          </g>
          {/* Far drone, beyond the building */}
          <g style={{ opacity: v.oD2, transition: fade }}>
            <g transform="translate(430 50)">
              <Drone size={66} />
            </g>
          </g>
          {/* Sight lines */}
          <path d="M90 130L196 76" stroke="#4f7d14" strokeWidth="2.5" style={{ opacity: v.oL1, transition: fade }} />
          <path d="M140 130L198 78" stroke="#4f7d14" strokeWidth="2.5" style={{ opacity: v.oL4, transition: fade }} />
          <path d="M90 130L298 96" stroke="#b42318" strokeWidth="2.5" strokeDasharray="6 6" style={{ opacity: v.oL2, transition: fade }} />
          <path d="M284 86l14 14M298 86l-14 14" stroke="#b42318" strokeWidth="3" strokeLinecap="round" style={{ opacity: v.oL2, transition: fade }} />
          <path d="M560 130L484 82" stroke="#4f7d14" strokeWidth="2.5" style={{ opacity: v.oL3, transition: fade }} />
        </svg>
        <div className="absolute left-[30px] top-[96px] text-[12px] font-semibold px-[8px] py-[2px] border-[1.5px] border-jet-black rounded-full bg-white">
          {v.gear}
        </div>
        <div className="absolute left-[10px] top-[8px] max-w-[622px] text-[12.5px] font-semibold bg-white px-[8px] py-[2px] rounded-[6px]">
          {s.label}
        </div>
      </div>
      {/* Question */}
      <div className="text-[15px] font-semibold leading-[1.3]">{s.q}</div>
      {/* Options */}
      <div
        role="group"
        aria-label="Answers"
        className="grid gap-[8px]"
        style={{ gridTemplateColumns: `repeat(${s.opts.length > 3 ? 2 : s.opts.length}, minmax(0, 1fr))` }}
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
              className={`min-h-[44px] flex items-center justify-between gap-[6px] text-left px-[12px] py-[8px] rounded-[10px] cursor-pointer text-[14px] font-semibold leading-[1.25] text-jet-black ${FOCUS_RING}`}
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
          border: answered && right ? "2px solid #7fbf2e" : answered ? "2px dashed #b42318" : "2px solid #e3e6ea",
          color: answered && !right ? "#b42318" : "#0e1114",
          background: answered && right ? "#eaf6d8" : answered ? "#FFFFFF" : "#f6f8fa",
        }}
      >
        {feedback}
      </div>
    </div>
  );

  const controls = (
    <>
      <span className="text-[14px] font-semibold tabular-nums">
        Scenario {i + 1} of {n}
      </span>
      <button
        type="button"
        onClick={() => {
          setI(Math.max(0, i - 1));
          setPick(-1);
        }}
        className={`min-h-[44px] px-[16px] ml-auto rounded-full text-[14px] font-semibold cursor-pointer border-2 border-jet-black bg-white text-jet-black ${FOCUS_RING}`}
      >
        Back
      </button>
      <button
        type="button"
        onClick={() => {
          setI((i + 1) % n);
          setPick(-1);
        }}
        className={`min-h-[44px] px-[16px] rounded-full text-[14px] font-semibold cursor-pointer border-2 border-volt-green bg-volt-green text-jet-black hover:bg-volt-lime hover:border-volt-lime transition-colors ${FOCUS_RING}`}
      >
        {i === n - 1 ? "Start over" : "Next"}
      </button>
    </>
  );

  return (
    <AnimationFrame
      title="Line of sight"
      category="Regulations"
      stage={stage}
      stageBg="#FFFFFF"
      caption={SIGHT_CAPTION}
      controls={controls}
      claim="Keep the drone in sight with your own eyes for the whole flight. Glasses and contacts are the only aid allowed."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.31; 14 CFR 107.33"
      bogeymanLine="A screen shows you the picture. It does not show you the drone."
      liveAnnouncement={feedback}
    />
  );
}
