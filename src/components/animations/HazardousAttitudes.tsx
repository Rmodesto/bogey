"use client";

import { useState } from "react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { ATTITUDE_SCENARIOS, ATTITUDE_CAPTION, attitudeFeedback } from "./logic/hazardousAttitudes";

// O8 — "Hazardous attitudes" scenario player. A crew member on the job says
// one line per vignette; the student names the attitude behind it. Five
// options in a two-column grid over a shorter 120px scene.
// Layout and copy ported from docs/animations/designs/O8-HazardousAttitudes.dc.html.

const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-ice-blue";

export default function HazardousAttitudes() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(-1);

  const n = ATTITUDE_SCENARIOS.length;
  const s = ATTITUDE_SCENARIOS[i];
  const { right, feedback } = attitudeFeedback(i, pick);
  const answered = pick >= 0;

  const stage = (
    <div className="w-full h-full box-border p-[14px] flex flex-col gap-[10px]">
      {/* Scene: the speaker, the drone, and what they say */}
      <div className="relative h-[120px] shrink-0 rounded-[10px] bg-mist-blue overflow-hidden">
        <svg aria-hidden="true" width="642" height="120" viewBox="0 0 642 120" fill="none" className="absolute left-0 top-0">
          <rect x="0" y="100" width="642" height="20" fill="#e3e6ea" />
          <path d="M0 100h642" stroke="#0e1114" strokeWidth="2" />
          {/* The crew member speaking */}
          <g transform="translate(70 100)">
            <circle cx="0" cy="-34" r="7" fill="#2b2f33" />
            <path d="M-9 0L-9 -16Q-9 -25 0 -25Q9 -25 9 -16L9 0Z" fill="#2b2f33" />
          </g>
          {/* The drone on the job */}
          <g transform="translate(120 40)">
            <Drone size={60} />
          </g>
          {/* Speech line toward the quote */}
          <path d="M96 60l14 -8" stroke="#0e1114" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="absolute left-[200px] top-[44px] right-[14px] text-[14px] font-semibold leading-[1.35] px-[12px] py-[8px] border-2 border-jet-black rounded-[12px] bg-white">
          {s.quote}
        </div>
        <div className="absolute left-[10px] top-[8px] max-w-[622px] text-[12.5px] font-semibold bg-white px-[8px] py-[2px] rounded-[6px]">
          {s.label}
        </div>
      </div>
      {/* Question */}
      <div className="text-[15px] font-semibold leading-[1.3]">{s.q}</div>
      {/* Options: five attitudes, two columns */}
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
        Vignette {i + 1} of {n}
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
      title="Hazardous attitudes"
      category="Operations"
      stage={stage}
      stageBg="#FFFFFF"
      caption={ATTITUDE_CAPTION}
      controls={controls}
      claim="Five hazardous attitudes, five antidotes. Name the attitude, then say its antidote."
      sourceLabel="FAA pilot handbook"
      citation="FAA-H-8083-25"
      bogeymanLine="Macho shows off. Invulnerable thinks it cannot happen to them."
      liveAnnouncement={`${s.label} ${feedback}`}
    />
  );
}
