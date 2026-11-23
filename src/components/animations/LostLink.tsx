"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { LOST_LINK_SCENARIOS, lostLinkFeedback } from "./logic/lostLink";

// O4 — "Lost link and GPS loss" scenario player. Four failures: low return
// altitude, correct return altitude, GPS drift, and a full fly-away.
// Layout and copy ported from docs/animations/designs/O4-LostLinkAndGpsLoss.dc.html.

export default function LostLink() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(-1);
  const reducedMotion = useReducedMotion();

  const n = LOST_LINK_SCENARIOS.length;
  const s = LOST_LINK_SCENARIOS[i];
  const { right, feedback } = lostLinkFeedback(i, pick);
  const fade = reducedMotion ? undefined : "opacity 0.5s ease";
  const cols = s.opts.length > 3 ? 2 : s.opts.length;

  const stage = (
    <div className="w-full h-full box-border p-[14px] flex flex-col gap-[10px] text-jet-black">
      {/* Field scene: home pad, pilot, trees, drone */}
      <div className="relative h-[196px] shrink-0 rounded-[10px] overflow-hidden" style={{ background: "#e7f2f8" }}>
        <svg aria-hidden="true" width="642" height="196" viewBox="0 0 642 196" fill="none" className="absolute left-0 top-0">
          <rect x="0" y="166" width="642" height="30" fill="#e3e6ea" />
          <path d="M0 166h642" stroke="#0e1114" strokeWidth="2" />
          {/* Home pad and pilot */}
          <rect x="40" y="160" width="60" height="6" fill="#0e1114" />
          <text x="70" y="186" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="middle">Home</text>
          <g transform="translate(128 166)">
            <circle cx="0" cy="-34" r="7" fill="#2b2f33" />
            <path d="M-9 0L-9 -16Q-9 -25 0 -25Q9 -25 9 -16L9 0Z" fill="#2b2f33" />
          </g>
          {/* Trees, 120 ft */}
          <rect x="286" y="120" width="8" height="46" fill="#2b2f33" />
          <path d="M268 125L290 50L312 125Z" fill="#eaf6d8" stroke="#0e1114" strokeWidth="2" strokeLinejoin="round" />
          <rect x="326" y="116" width="8" height="50" fill="#2b2f33" />
          <path d="M308 123L330 42L352 123Z" fill="#eaf6d8" stroke="#0e1114" strokeWidth="2" strokeLinejoin="round" />
          <rect x="366" y="121" width="8" height="45" fill="#2b2f33" />
          <path d="M348 127L370 54L392 127Z" fill="#eaf6d8" stroke="#0e1114" strokeWidth="2" strokeLinejoin="round" />
          <text x="330" y="186" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="middle">Trees: 120 ft</text>
        </svg>

        {/* The drone, and its drifted ghost for the GPS-loss scene */}
        <div aria-hidden="true" className="absolute left-[470px] top-[92px]">
          <Drone size={66} />
        </div>
        <div aria-hidden="true" className="absolute left-[548px] top-[92px]" style={{ opacity: s.v.oDrift * 0.35, transition: fade }}>
          <Drone size={66} />
        </div>

        {/* Scenario overlays */}
        <svg aria-hidden="true" width="642" height="196" viewBox="0 0 642 196" fill="none" className="absolute left-0 top-0">
          {/* Low return path into the trees */}
          <path d="M470 116L352 116" stroke="#b42318" strokeWidth="2.5" strokeDasharray="7 6" style={{ opacity: s.v.oLow, transition: fade }} />
          <path d="M342 108l14 14M356 108l-14 14" stroke="#b42318" strokeWidth="3" strokeLinecap="round" style={{ opacity: s.v.oLow, transition: fade }} />
          {/* High return path over the trees to home */}
          <path d="M500 90V32H70V150" stroke="#4f7d14" strokeWidth="2.5" strokeDasharray="7 6" fill="none" style={{ opacity: s.v.oHigh, transition: fade }} />
          <path d="M63 140l7 11 7-11" stroke="#4f7d14" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: s.v.oHigh, transition: fade }} />
          {/* Wind and drift */}
          <g style={{ opacity: s.v.oDrift, transition: fade }}>
            <path d="M430 60h52M472 53l10 7-10 7M430 76h36M456 69l10 7-10 7" stroke="#0e1114" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="430" y="48" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="start">Wind</text>
          </g>
          {/* Fly-away path off the top right */}
          <g style={{ opacity: s.v.oAway, transition: fade }}>
            <path d="M546 100Q600 84 634 40" stroke="#b42318" strokeWidth="2.5" strokeDasharray="7 6" fill="none" />
            <path d="M620 44l14-5-3 15" stroke="#b42318" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>

        <div className="absolute left-[418px] top-[138px] text-[12px] font-semibold px-[8px] py-[2px] rounded-full bg-white" style={{ border: "1.5px solid #0e1114" }}>
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
      <span className="text-[14px] font-semibold tabular-nums">Failure {i + 1} of {n}</span>
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
      title="Lost link and GPS loss"
      category="Operations"
      stage={stage}
      stageBg="#FFFFFF"
      caption="Each failure takes away something different: the link, the position fix, or both."
      controls={controls}
      claim="Decide what the drone does on a lost link before you launch, and set the return altitude above every obstacle."
      sourceLabel="FAA remote pilot guide"
      citation="FAA-G-8082-22"
      bogeymanLine="GPS loss and link loss are different failures. Know which one you have."
      liveAnnouncement={`${s.label} ${feedback}`}
    />
  );
}
