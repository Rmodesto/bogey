"use client";

import { useState } from "react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { RISK_SCENARIOS, RISK_CHIPS, RISK_CAPTION, riskChipBg, riskFeedback } from "./logic/riskCheckOnAJob";

// O9 — "Risk check on a job" scenario player. One real-estate job, five
// checks; the chip row highlights which part of the risk picture each one
// tests (Pilot, Aircraft, Environment, External pressure, Crew).
// Layout and copy ported from docs/animations/designs/O9-RiskLoopOnAJob.dc.html.

const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-ice-blue";

export default function RiskCheckOnAJob() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(-1);

  const n = RISK_SCENARIOS.length;
  const s = RISK_SCENARIOS[i];
  const { right, feedback } = riskFeedback(i, pick);
  const answered = pick >= 0;

  const stage = (
    <div className="w-full h-full box-border p-[14px] flex flex-col gap-[10px]">
      {/* Scene: the house for sale, the crew, the drone, and the client */}
      <div className="relative h-[196px] shrink-0 rounded-[10px] bg-mist-blue overflow-hidden">
        <svg aria-hidden="true" width="642" height="196" viewBox="0 0 642 196" fill="none" className="absolute left-0 top-0">
          <rect x="0" y="166" width="642" height="30" fill="#e3e6ea" />
          <path d="M0 166h642" stroke="#0e1114" strokeWidth="2" />
          {/* The house */}
          <rect x="250" y="96" width="140" height="70" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <path d="M238 96L320 50L402 96Z" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" strokeLinejoin="round" />
          <rect x="306" y="126" width="28" height="40" fill="#a9cfe3" stroke="#0e1114" strokeWidth="2" />
          <path d="M266 112h22v22h-22ZM352 112h22v22h-22Z" fill="#a9cfe3" stroke="#0e1114" strokeWidth="1.5" />
          {/* For-sale sign */}
          <path d="M420 166v-36" stroke="#0e1114" strokeWidth="2" />
          <rect x="404" y="110" width="50" height="22" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <text x="429" y="125" fontSize="9" fontWeight="700" fill="#0e1114" textAnchor="middle">For sale</text>
          {/* Pilot */}
          <g transform="translate(110 166)">
            <circle cx="0" cy="-34" r="7" fill="#2b2f33" />
            <path d="M-9 0L-9 -16Q-9 -25 0 -25Q9 -25 9 -16L9 0Z" fill="#2b2f33" />
          </g>
          <text x="110" y="186" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="middle">Pilot</text>
          {/* Observer (label centered on the figure; the design had it 4px off) */}
          <g transform="translate(156 166)">
            <circle cx="0" cy="-34" r="7" fill="#6fa6c6" />
            <path d="M-9 0L-9 -16Q-9 -25 0 -25Q9 -25 9 -16L9 0Z" fill="#6fa6c6" />
          </g>
          <text x="156" y="186" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="middle">Observer</text>
          {/* The drone over the job */}
          <g transform="translate(184 110)">
            <Drone size={56} />
          </g>
          {/* Client */}
          <g transform="translate(560 166)">
            <circle cx="0" cy="-34" r="7" fill="#8a9198" />
            <path d="M-9 0L-9 -16Q-9 -25 0 -25Q9 -25 9 -16L9 0Z" fill="#8a9198" />
          </g>
          <text x="560" y="186" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="middle">Client</text>
        </svg>
        {/* Risk-picture chips */}
        <div className="absolute left-[10px] top-[36px] flex gap-[6px]">
          {RISK_CHIPS.map((chip, k) => (
            <span
              key={chip}
              className="text-[12px] font-semibold px-[10px] py-[2px] rounded-full border-2 border-jet-black"
              style={{ background: riskChipBg(i, k) }}
            >
              {chip}
            </span>
          ))}
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
        Check {i + 1} of {n}
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
      title="Risk check on a job"
      category="Operations"
      stage={stage}
      stageBg="#FFFFFF"
      caption={RISK_CAPTION}
      controls={controls}
      claim="Before every job, check the pilot, the aircraft, the environment, and the outside pressure. The remote pilot in command decides."
      sourceLabel="FAA pilot handbook"
      citation="FAA-H-8083-25"
      bogeymanLine="The client’s deadline is a pressure, not a reason."
      liveAnnouncement={`${s.label} ${feedback}`}
    />
  );
}
