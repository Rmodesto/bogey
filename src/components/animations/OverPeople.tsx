"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { VEHICLE_SCENARIOS, VEHICLE_CAPTION, vehicleFeedback } from "./logic/overPeople";

// R7 — "Over people and vehicles" scenario player. Layout and copy ported from
// docs/animations/designs/R7-OverPeopleAndVehicles.dc.html.

const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-ice-blue";

function Car({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 166)`}>
      <path
        d="M0 -8L0 -20Q0 -24 4 -24L12 -24L20 -36L46 -36L56 -24L64 -24Q68 -24 68 -20L68 -8Z"
        fill="#FFFFFF"
        stroke="#0e1114"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="-7" r="7" fill="#0e1114" />
      <circle cx="52" cy="-7" r="7" fill="#0e1114" />
      <path d="M24 -32h18l6 8H18Z" fill="#a9cfe3" />
    </g>
  );
}

function Person({ x, fill }: { x: number; fill: string }) {
  return (
    <g transform={`translate(${x} 166)`}>
      <circle cx="0" cy="-34" r="7" fill={fill} />
      <path d="M-9 0L-9 -16Q-9 -25 0 -25Q9 -25 9 -16L9 0Z" fill={fill} />
    </g>
  );
}

export default function OverPeople() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(-1);
  const reducedMotion = useReducedMotion();

  const n = VEHICLE_SCENARIOS.length;
  const s = VEHICLE_SCENARIOS[i];
  const v = s.v;
  const { right, feedback } = vehicleFeedback(i, pick);
  const answered = pick >= 0;
  const fade = reducedMotion ? undefined : "opacity 0.5s ease";

  const stage = (
    <div className="w-full h-full box-border p-[14px] flex flex-col gap-[10px]">
      {/* Scene: road, cars, crowd, closed set */}
      <div className="relative h-[196px] shrink-0 rounded-[10px] bg-mist-blue overflow-hidden">
        <svg aria-hidden="true" width="642" height="196" viewBox="0 0 642 196" fill="none" className="absolute left-0 top-0">
          <rect x="0" y="166" width="642" height="30" fill="#e3e6ea" />
          <path d="M0 166h642" stroke="#0e1114" strokeWidth="2" />
          <path d="M0 181h642" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="18 14" style={{ opacity: v.oCars, transition: fade }} />
          {/* Moving cars */}
          <g style={{ opacity: v.oCars, transition: fade }}>
            <Car x={222} />
            <Car x={356} />
          </g>
          <path
            d="M196 138h18M196 148h12M330 138h18M330 148h12"
            stroke="#0e1114"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ opacity: v.oSpeed, transition: fade }}
          />
          {/* Parking sign */}
          <g style={{ opacity: v.oPark, transition: fade }}>
            <rect x="446" y="116" width="26" height="26" rx="4" fill="#6fa6c6" stroke="#0e1114" strokeWidth="2" />
            <text x="459" y="135" fontSize="16" fontWeight="700" fill="#FFFFFF" textAnchor="middle">P</text>
            <path d="M459 142v24" stroke="#0e1114" strokeWidth="2" />
          </g>
          {/* Open-air assembly */}
          <g style={{ opacity: v.oCrowd, transition: fade }}>
            {[214, 244, 274, 304, 334, 364, 394, 424].map((x, k) => (
              <Person key={x} x={x} fill={k % 2 ? "#2b2f33" : "#8a9198"} />
            ))}
          </g>
          {/* Closed set */}
          <g style={{ opacity: v.oFence, transition: fade }}>
            <path d="M150 166V112M494 166V112" stroke="#0e1114" strokeWidth="4" />
            <path d="M150 122h20M150 140h20M474 122h20M474 140h20" stroke="#0e1114" strokeWidth="2" />
            <rect x="504" y="100" width="118" height="40" rx="4" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <text x="563" y="117" fontSize="12" fontWeight="700" fill="#0e1114" textAnchor="middle">Closed set</text>
            <text x="563" y="132" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="middle">Drivers briefed</text>
          </g>
          {/* Transit arc */}
          <path
            d="M96 96Q322 6 548 96"
            stroke="#0e1114"
            strokeWidth="2"
            strokeDasharray="7 7"
            fill="none"
            style={{ opacity: v.oTransit, transition: fade }}
          />
          <path
            d="M538 84l12 13-17 2"
            stroke="#0e1114"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: v.oTransit, transition: fade }}
          />
          {/* Drone */}
          <g transform="translate(289 42)">
            <Drone size={66} />
          </g>
        </svg>
        <div className="absolute left-[372px] top-[50px] text-[12px] font-semibold px-[8px] py-[2px] border-[1.5px] border-jet-black rounded-full bg-white">
          {v.tag}
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
      title="Over people and vehicles"
      category="Regulations"
      stage={stage}
      stageBg="#FFFFFF"
      caption={VEHICLE_CAPTION}
      controls={controls}
      claim="Over moving vehicles: pass through without lingering, or stay on a closed site where everyone is on notice."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.39; 14 CFR 107.145"
      bogeymanLine="Crossing the road is fine. Following the traffic is not."
      liveAnnouncement={feedback}
    />
  );
}
