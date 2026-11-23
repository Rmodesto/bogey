"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import { CTAF_SCENARIOS, CTAF_CAPTION, ctafFeedback } from "./logic/buildACtafCall";

// O3 — "Build a CTAF call" scenario player. The call's building blocks light
// up one step at a time; the last step is the drone pilot's handheld radio.
// Layout and copy ported from docs/animations/designs/O3-BuildACtafCall.dc.html.

const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-ice-blue";

export default function BuildACtafCall() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(-1);
  const reducedMotion = useReducedMotion();

  const n = CTAF_SCENARIOS.length;
  const s = CTAF_SCENARIOS[i];
  const v = s.v;
  const { right, feedback } = ctafFeedback(i, pick);
  const answered = pick >= 0;
  const fade = reducedMotion ? undefined : "opacity 0.5s ease";

  const stage = (
    <div className="w-full h-full box-border p-[14px] flex flex-col gap-[10px]">
      {/* Scene: the call's blocks, left to right, then the listening radio */}
      <div className="relative h-[196px] shrink-0 rounded-[10px] bg-mist-blue overflow-hidden">
        <svg aria-hidden="true" width="642" height="196" viewBox="0 0 642 196" fill="none" className="absolute left-0 top-0">
          {/* Who you are calling */}
          <g style={{ opacity: v.oB1, transition: fade }}>
            <rect x="16" y="70" width="150" height="40" rx="8" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <text x="91" y="95" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">Riverside traffic</text>
            <text x="91" y="128" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="middle">Who you are calling</text>
          </g>
          {/* Who you are */}
          <g style={{ opacity: v.oB2, transition: fade }}>
            <rect x="176" y="70" width="164" height="40" rx="8" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <text x="258" y="95" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">Cessna 4765 Juliett</text>
            <text x="258" y="128" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="middle">Who you are</text>
          </g>
          {/* Where you are */}
          <g style={{ opacity: v.oB3, transition: fade }}>
            <rect x="350" y="70" width="124" height="40" rx="8" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <text x="412" y="95" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">10 miles south</text>
            <text x="412" y="128" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="middle">Where you are</text>
          </g>
          {/* What you intend */}
          <g style={{ opacity: v.oB4, transition: fade }}>
            <rect x="484" y="70" width="142" height="40" rx="8" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <text x="555" y="95" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">inbound runway 27</text>
            <text x="555" y="128" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="middle">What you intend</text>
          </g>
          {/* Airport name again, last */}
          <g style={{ opacity: v.oB5, transition: fade }}>
            <rect x="246" y="146" width="150" height="36" rx="8" fill="#eaf6d8" stroke="#0e1114" strokeWidth="2" />
            <text x="321" y="169" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">Riverside</text>
            <text x="410" y="169" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="start">Airport name again, last</text>
          </g>
          {/* Handheld radio: listening */}
          <g style={{ opacity: v.oEar, transition: fade }}>
            <rect x="40" y="140" width="40" height="46" rx="6" fill="#2b2f33" />
            <path d="M60 140V118" stroke="#0e1114" strokeWidth="3" strokeLinecap="round" />
            <rect x="46" y="148" width="28" height="14" rx="2" fill="#9cd94a" />
            <text x="92" y="160" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="start">Handheld radio:</text>
            <text x="92" y="175" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="start">listening</text>
          </g>
        </svg>
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
        Step {i + 1} of {n}
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
      title="Build a CTAF call"
      category="Operations"
      stage={stage}
      stageBg="#FFFFFF"
      caption={CTAF_CAPTION}
      controls={controls}
      claim="Near an airport, listen on the CTAF. Remote pilots monitor; they rarely transmit."
      sourceLabel="FAA remote pilot guide"
      citation="FAA-G-8082-22"
      bogeymanLine="The airport name goes first and last."
      liveAnnouncement={`${s.label} ${feedback}`}
    />
  );
}
