"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { WALKAROUND_SCENARIOS, walkaroundFeedback } from "./logic/preflightWalkaround";

// O10 — "Preflight walkaround" scenario player. Five 107.49 stops: propellers,
// battery, control station, anti-collision light, attached equipment.
// Layout and copy ported from docs/animations/designs/O10-PreflightWalkaround.dc.html.
// Design fix: the check tag sits top-left (the design put it top-right, where
// the control-station highlight ring ran underneath it).

export default function PreflightWalkaround() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(-1);
  const reducedMotion = useReducedMotion();

  const n = WALKAROUND_SCENARIOS.length;
  const s = WALKAROUND_SCENARIOS[i];
  const { right, feedback } = walkaroundFeedback(i, pick);
  const fade = reducedMotion ? undefined : "opacity 0.5s ease";
  const cols = s.opts.length > 3 ? 2 : s.opts.length;

  const stage = (
    <div className="w-full h-full box-border p-[14px] flex flex-col gap-[10px] text-jet-black">
      {/* Bench scene: drone, battery, controller */}
      <div className="relative h-[196px] shrink-0 rounded-[10px] overflow-hidden" style={{ background: "#e7f2f8" }}>
        <svg aria-hidden="true" width="642" height="196" viewBox="0 0 642 196" fill="none" className="absolute left-0 top-0">
          <rect x="0" y="166" width="642" height="30" fill="#e3e6ea" />
          <path d="M0 166h642" stroke="#0e1114" strokeWidth="2" />
          {/* Battery */}
          <g>
            <rect x="52" y="96" width="84" height="48" rx="6" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <rect x="136" y="110" width="7" height="20" fill="#0e1114" />
            <rect x="58" y="102" width="56" height="36" rx="3" fill="#9cd94a" />
            <text x="94" y="160" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="middle">Battery</text>
          </g>
          {/* Controller */}
          <g>
            <rect x="508" y="92" width="100" height="56" rx="10" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <circle cx="532" cy="120" r="9" stroke="#0e1114" strokeWidth="2" />
            <circle cx="584" cy="120" r="9" stroke="#0e1114" strokeWidth="2" />
            <rect x="546" y="100" width="24" height="16" rx="2" fill="#a9cfe3" stroke="#0e1114" strokeWidth="1.5" />
            <path d="M558 92V76" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" />
            <text x="558" y="160" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="middle">Controller</text>
          </g>
        </svg>

        {/* The drone on the bench */}
        <div aria-hidden="true" className="absolute left-[196px] top-[52px]">
          <Drone size={250} />
        </div>

        {/* Anti-collision light, crack mark, and the highlight rings */}
        <svg aria-hidden="true" width="642" height="196" viewBox="0 0 642 196" fill="none" className="absolute left-0 top-0">
          <circle cx="321" cy="72" r="6" fill="#9cd94a" stroke="#0e1114" strokeWidth="1.5" />
          <path d="M226 66l8 6" stroke="#b42318" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: s.v.oProp, transition: fade }} />
          <circle cx="242" cy="70" r="30" stroke="#b42318" strokeWidth="3" strokeDasharray="7 5" style={{ opacity: s.v.oProp, transition: fade }} />
          <circle cx="94" cy="120" r="52" stroke="#b42318" strokeWidth="3" strokeDasharray="7 5" style={{ opacity: s.v.oBatt, transition: fade }} />
          <circle cx="558" cy="116" r="62" stroke="#b42318" strokeWidth="3" strokeDasharray="7 5" style={{ opacity: s.v.oCtl, transition: fade }} />
          <circle cx="321" cy="72" r="22" stroke="#b42318" strokeWidth="3" strokeDasharray="7 5" style={{ opacity: s.v.oLight, transition: fade }} />
          <circle cx="321" cy="146" r="24" stroke="#b42318" strokeWidth="3" strokeDasharray="7 5" style={{ opacity: s.v.oCam, transition: fade }} />
        </svg>

        <div
          className="absolute left-[10px] top-[36px] max-w-[250px] text-[12px] font-semibold leading-[1.35] px-[10px] py-[4px] rounded-[10px] bg-white"
          style={{ border: "1.5px solid #0e1114" }}
        >
          {s.tag}
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
      <span className="text-[14px] font-semibold tabular-nums">Check {i + 1} of {n}</span>
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
      title="Preflight walkaround"
      category="Operations"
      stage={stage}
      stageBg="#FFFFFF"
      caption="Walk around the aircraft, the battery, and the controller. Each stop has one thing to decide."
      controls={controls}
      claim="Before every flight, check that the aircraft, the battery, and the control station are in a condition for safe operation."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.49"
      bogeymanLine="The controller gets a preflight too."
      liveAnnouncement={`${s.label} ${feedback}`}
    />
  );
}
