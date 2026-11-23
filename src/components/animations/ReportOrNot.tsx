"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { INCIDENTS, REPORT_CAPTION, reportFeedback } from "./logic/reportOrNot";

// R9 — "Report or not" scenario player. Layout and copy ported from
// docs/animations/designs/R9-ReportOrNot.dc.html.

const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-ice-blue";

export default function ReportOrNot() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(-1);
  const reducedMotion = useReducedMotion();

  const n = INCIDENTS.length;
  const s = INCIDENTS[i];
  const v = s.v;
  const { right, feedback } = reportFeedback(i, pick);
  const answered = pick >= 0;
  const fade = reducedMotion ? undefined : "opacity 0.5s ease";

  const stage = (
    <div className="w-full h-full box-border p-[14px] flex flex-col gap-[10px]">
      {/* Scene: crashed drone plus whatever it hit */}
      <div className="relative h-[196px] shrink-0 rounded-[10px] bg-mist-blue overflow-hidden">
        <svg aria-hidden="true" width="642" height="196" viewBox="0 0 642 196" fill="none" className="absolute left-0 top-0">
          <rect x="0" y="166" width="642" height="30" fill="#e3e6ea" />
          <path d="M0 166h642" stroke="#0e1114" strokeWidth="2" />
          {/* Crashed drone */}
          <g transform="rotate(24 150 140)">
            <g transform="translate(110 122)">
              <Drone size={80} />
            </g>
          </g>
          <path d="M204 112l10-8M210 126l14-2M200 100l4-12" stroke="#0e1114" strokeWidth="2" strokeLinecap="round" />
          {/* Tree */}
          <g style={{ opacity: v.oTree, transition: fade }}>
            <rect x="338" y="110" width="12" height="56" fill="#2b2f33" />
            <circle cx="344" cy="84" r="38" fill="#eaf6d8" stroke="#0e1114" strokeWidth="2" />
            <circle cx="318" cy="108" r="20" fill="#eaf6d8" stroke="#0e1114" strokeWidth="2" />
            <circle cx="372" cy="106" r="22" fill="#eaf6d8" stroke="#0e1114" strokeWidth="2" />
          </g>
          {/* Parked car with a scrape */}
          <g style={{ opacity: v.oCar, transition: fade }}>
            <g transform="translate(300 166)">
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
            <path d="M312 138l8 6-6 6 10 2" stroke="#b42318" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {/* Bystander */}
          <g style={{ opacity: v.oPerson, transition: fade }}>
            <g transform="translate(336 166) scale(1.5)">
              <circle cx="0" cy="-34" r="7" fill="#2b2f33" />
              <path d="M-9 0L-9 -16Q-9 -25 0 -25Q9 -25 9 -16L9 0Z" fill="#2b2f33" />
            </g>
          </g>
          {/* Broken window */}
          <g style={{ opacity: v.oWin, transition: fade }}>
            <rect x="290" y="56" width="110" height="110" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <rect x="312" y="78" width="66" height="54" fill="#a9cfe3" stroke="#0e1114" strokeWidth="2" />
            <path d="M330 86l12 18-14 8 22 14M352 104l18-10" stroke="#0e1114" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
        <div className="absolute left-[430px] top-[76px] max-w-[196px] text-[13px] font-semibold leading-[1.35] px-[12px] py-[8px] border-[1.5px] border-jet-black rounded-[10px] bg-white">
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
        Incident {i + 1} of {n}
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
      title="Report or not"
      category="Regulations"
      stage={stage}
      stageBg="#FFFFFF"
      caption={REPORT_CAPTION}
      controls={controls}
      claim="Report within 10 calendar days: serious injury, any loss of consciousness, or more than $500 damage to property other than the drone."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.9"
      bogeymanLine="Your own wrecked drone does not count toward the $500."
      liveAnnouncement={feedback}
    />
  );
}
