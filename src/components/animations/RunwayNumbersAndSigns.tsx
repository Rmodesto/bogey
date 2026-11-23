"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import { runwayNumbersAndSignsState } from "./logic/runwayNumbersAndSigns";

// O2 — "Runway numbers and signs" scrub animation. One slider spins a runway
// on a compass rose; the runway number is the magnetic heading divided by 10
// and rounded, with the opposite end 18 away. A fixed panel decodes the
// airport sign colors.
// Geometry and copy ported from
// docs/animations/designs/O2-RunwayNumbersAndSigns.dc.html.

// Compass tick marks every 10°, heavier at the cardinal points.
function compassTicks() {
  const ticks = [];
  for (let deg = 0; deg < 360; deg += 10) {
    const major = deg % 90 === 0;
    ticks.push(
      <path
        key={deg}
        d={major ? "M190 62V80" : "M190 70V80"}
        stroke="#0e1114"
        strokeWidth={major ? 2 : 1}
        transform={`rotate(${deg} 190 210)`}
      />,
    );
  }
  return ticks;
}

export default function RunwayNumbersAndSigns() {
  const [h, setH] = useState(160);
  const reducedMotion = useReducedMotion();

  const s = runwayNumbersAndSignsState(h);

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Compass rose */}
        <circle cx="190" cy="210" r="150" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
        {compassTicks()}
        <text x="190" y="52" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
          N 360&deg;
        </text>
        <text x="352" y="214" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="start">
          E 090&deg;
        </text>
        <text x="190" y="382" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
          S 180&deg;
        </text>
        <text x="28" y="214" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="end">
          W
        </text>
        {/* Runway, rotating with the heading */}
        <g
          style={{
            transform: `rotate(${s.h}deg)`,
            transformOrigin: "190px 210px",
            transition: reducedMotion ? "none" : "transform 0.15s linear",
          }}
        >
          <rect x="168" y="96" width="44" height="228" rx="3" fill="#2b2f33" />
          <path d="M190 150V270" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="12 10" />
          <path d="M174 310h4M182 310h4M194 310h4M202 310h4" stroke="#FFFFFF" strokeWidth="3" />
          <path
            d="M190 96V70M182 80l8-12 8 12"
            stroke="#b42318"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      {/* Readout */}
      <div className="absolute left-[20px] top-[14px] text-[20px] font-semibold tabular-nums bg-white px-[6px] rounded-[3px]">
        Runway {s.num} &middot; other end {s.opp}
      </div>
      {/* Sign panel */}
      <div className="absolute left-[380px] top-[22px] w-[274px] flex flex-col gap-[14px]">
        <div className="text-[13px] font-semibold">Airport signs</div>
        <div className="flex items-center gap-[10px]">
          <span className="shrink-0 w-[74px] text-center text-[15px] font-bold py-[5px] rounded-[4px] bg-[#b42318] text-white border-2 border-jet-black">
            {s.num}-{s.opp}
          </span>
          <span className="text-[12.5px] leading-[1.3]">
            <span className="font-semibold">Mandatory</span>
            <br />
            White on red. Hold short; do not enter.
          </span>
        </div>
        <div className="flex items-center gap-[10px]">
          <span className="shrink-0 w-[74px] text-center text-[15px] font-bold py-[5px] rounded-[4px] bg-jet-black text-[#f5d90a] border-2 border-jet-black">
            A
          </span>
          <span className="text-[12.5px] leading-[1.3]">
            <span className="font-semibold">Location</span>
            <br />
            Yellow on black. Where you are now.
          </span>
        </div>
        <div className="flex items-center gap-[10px]">
          <span className="shrink-0 w-[74px] text-center text-[15px] font-bold py-[5px] rounded-[4px] bg-[#f5d90a] text-jet-black border-2 border-jet-black">
            B &rarr;
          </span>
          <span className="text-[12.5px] leading-[1.3]">
            <span className="font-semibold">Direction</span>
            <br />
            Black on yellow. Which way to go.
          </span>
        </div>
        <div className="text-[12.5px] leading-[1.4] pt-[8px] border-t-[1.5px] border-divider-gray">
          <span className="font-semibold">Paint:</span> white markings are on runways, yellow on taxiways. Hold-short
          lines are four yellow lines, two solid and two dashed.
        </div>
      </div>
    </>
  );

  const controls = (
    <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
      <label htmlFor="o2-h" className="text-[13px] font-semibold">
        Runway magnetic heading: {s.hd}&deg;
      </label>
      <input
        id="o2-h"
        type="range"
        min={0}
        max={359}
        step={1}
        value={h}
        aria-valuetext={s.hText}
        onChange={(e) => setH(Number(e.target.value))}
        className="w-full h-[44px]"
        style={{ accentColor: "#7fbf2e" }}
      />
    </div>
  );

  return (
    <AnimationFrame
      title="Runway numbers and signs"
      category="Operations"
      stage={stage}
      stageBg="#f6f8fa"
      caption={s.caption}
      controls={controls}
      claim="Runway number is the magnetic heading divided by 10 and rounded. Red signs are mandatory."
      sourceLabel="FAA airport procedures"
      citation="AIM 2-3"
      bogeymanLine="Runway 16 points south-southeast. It is not north."
      liveAnnouncement={`${s.hText}. ${s.caption}`}
    />
  );
}
