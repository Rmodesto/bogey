"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { DRIVE_SCENARIOS, DRIVE_CAPTION, driveFeedback } from "./logic/movingVehicle";

// R12 — "Moving vehicles and cargo" scenario player. Layout and copy ported
// from docs/animations/designs/R12-MovingVehiclesAndCargo.dc.html.

const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-ice-blue";

function Person({ x, y, scale, fill }: { x: number; y: number; scale: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="-34" r="7" fill={fill} />
      <path d="M-9 0L-9 -16Q-9 -25 0 -25Q9 -25 9 -16L9 0Z" fill={fill} />
    </g>
  );
}

export default function MovingVehicle() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(-1);
  const reducedMotion = useReducedMotion();

  const n = DRIVE_SCENARIOS.length;
  const s = DRIVE_SCENARIOS[i];
  const v = s.v;
  const { right, feedback } = driveFeedback(i, pick);
  const answered = pick >= 0;
  const fade = reducedMotion ? undefined : "opacity 0.5s ease";

  const stage = (
    <div className="w-full h-full box-border p-[14px] flex flex-col gap-[10px]">
      {/* Scene: truck, boat, helicopter, backdrop */}
      <div className="relative h-[196px] shrink-0 rounded-[10px] bg-mist-blue overflow-hidden">
        <svg aria-hidden="true" width="642" height="196" viewBox="0 0 642 196" fill="none" className="absolute left-0 top-0">
          {/* Ground */}
          <g style={{ opacity: v.oLand, transition: fade }}>
            <rect x="0" y="166" width="642" height="30" fill="#e3e6ea" />
            <path d="M0 166h642" stroke="#0e1114" strokeWidth="2" />
          </g>
          {/* Sparse ranchland */}
          <g style={{ opacity: v.oOpen, transition: fade }}>
            <path d="M0 166Q120 110 240 166M300 166Q450 96 642 150L642 166Z" fill="#f6f8fa" stroke="#8a9198" strokeWidth="1.5" />
            <path d="M560 166v-34M560 150h-10v-12M560 144h10v-10" stroke="#4f7d14" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>
          {/* Town */}
          <g style={{ opacity: v.oTown, transition: fade }}>
            <rect x="20" y="96" width="60" height="70" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <rect x="92" y="70" width="52" height="96" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <rect x="486" y="84" width="66" height="82" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <rect x="564" y="110" width="58" height="56" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <path
              d="M32 112h12M56 112h12M32 134h12M56 134h12M104 88h10M124 88h10M104 110h10M124 110h10M104 132h10M124 132h10M500 100h12M526 100h12M500 124h12M526 124h12M578 126h10M598 126h10"
              stroke="#8a9198"
              strokeWidth="7"
            />
            <Person x={440} y={166} scale={1} fill="#8a9198" />
            <Person x={464} y={166} scale={1} fill="#2b2f33" />
          </g>
          {/* Moving truck, pilot in the bed */}
          <g style={{ opacity: v.oTruck, transition: fade }}>
            <path
              d="M196 158L196 132L262 132L262 112L296 112L312 132L326 136L326 158Z"
              fill="#FFFFFF"
              stroke="#0e1114"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M268 118h24l10 14h-34Z" fill="#a9cfe3" />
            <circle cx="220" cy="159" r="9" fill="#0e1114" />
            <circle cx="300" cy="159" r="9" fill="#0e1114" />
            <Person x={228} y={132} scale={0.8} fill="#2b2f33" />
            <path d="M160 138h24M166 150h18" stroke="#0e1114" strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* Moving boat */}
          <g style={{ opacity: v.oBoat, transition: fade }}>
            <rect x="0" y="160" width="642" height="36" fill="#a9cfe3" />
            <path
              d="M0 160q16 -8 32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0t32 0"
              stroke="#0e1114"
              strokeWidth="2"
              fill="none"
            />
            <path d="M186 142L330 142L310 166L204 166Z" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" strokeLinejoin="round" />
            <Person x={250} y={142} scale={0.8} fill="#2b2f33" />
            <path d="M150 150h24" stroke="#0e1114" strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* Helicopter */}
          <g style={{ opacity: v.oHeli, transition: fade }}>
            <path
              d="M150 96Q150 72 190 72L236 72Q262 72 262 96Q262 112 236 112L180 112Q150 112 150 96Z"
              fill="#FFFFFF"
              stroke="#0e1114"
              strokeWidth="2"
            />
            <path d="M150 92L84 84L84 72" stroke="#0e1114" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M130 62h170M214 62v10" stroke="#0e1114" strokeWidth="3" strokeLinecap="round" />
            <path d="M222 82h28q6 8 4 18h-32Z" fill="#a9cfe3" />
            <path d="M176 124h76M190 112v12M236 112v12" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" />
            <Person x={206} y={110} scale={0.6} fill="#2b2f33" />
          </g>
          {/* Drone */}
          <g transform="translate(410 44)">
            <Drone size={66} />
          </g>
          {/* Customer package */}
          <g style={{ opacity: v.oPkg, transition: fade }}>
            <path d="M443 74v12" stroke="#0e1114" strokeWidth="1.5" />
            <rect x="431" y="86" width="24" height="20" fill="#dcbf98" stroke="#0e1114" strokeWidth="2" />
            <path d="M431 96h24M443 86v20" stroke="#0e1114" strokeWidth="1.2" />
          </g>
        </svg>
        {/* Design places this pill at left 474 / top 40, where it clips on the
            scene's right edge; moved below the package so the text fits. */}
        <div
          className="absolute left-[348px] top-[112px] text-[12px] font-semibold px-[8px] py-[2px] border-[1.5px] border-jet-black rounded-full bg-white whitespace-nowrap"
          style={{ opacity: v.oPkg, transition: fade }}
        >
          Customer package, for a fee
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
      title="Moving vehicles and cargo"
      category="Regulations"
      stage={stage}
      stageBg="#FFFFFF"
      caption={DRIVE_CAPTION}
      controls={controls}
      claim="From a moving car or boat: only over a sparsely populated area, and not carrying property for pay. From a moving aircraft: no."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.25"
      bogeymanLine="Two questions: who is below, and is the cargo paid for?"
      liveAnnouncement={feedback}
    />
  );
}
