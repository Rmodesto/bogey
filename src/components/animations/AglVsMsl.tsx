"use client";

import { useState } from "react";
import AnimationFrame from "./AnimationFrame";
import { aglMslState } from "./logic/aglVsMsl";

// A4 — "AGL versus MSL" scrub animation.
// Geometry and copy ported from docs/animations/designs/A4-AGLvsMSL.dc.html.

export default function AglVsMsl() {
  const [elev, setElev] = useState(957);

  const s = aglMslState(elev);
  const gH = Math.round(elev * 0.18);
  const valueText = `Ground elevation ${s.elevText} feet mean sea level; tower top ${s.mslText} feet MSL, 316 feet above ground`;

  const stage = (
    <>
      {/* Sea */}
      <div className="absolute left-0 right-0 bottom-0 h-[40px] bg-ice-blue border-t-2 border-jet-black" />
      <div className="absolute left-[12px] bottom-[12px] text-[12px] font-semibold">Sea level, 0 ft MSL</div>
      {/* Ground slab */}
      <div
        className="absolute left-0 right-0 bottom-[42px] bg-divider-gray border-t-2 border-jet-black"
        style={{ height: gH }}
      />
      <div
        className="absolute left-[450px] text-[12px] font-semibold bg-white px-[4px] rounded-[3px]"
        style={{ bottom: 42 + Math.max(0, gH - 24) }}
      >
        Ground: {s.elevText} ft MSL
      </div>
      {/* Tower */}
      <div className="absolute left-[330px] w-[10px] h-[57px] bg-jet-black" style={{ bottom: 42 + gH }} />
      <div className="absolute left-[330px] w-[10px] h-[10px] rounded-full bg-[#b42318]" style={{ bottom: 42 + gH + 57 }} />
      {/* MSL measure (from sea level) */}
      <div className="absolute left-[290px] bottom-[42px] border-l-2 border-deep-ice-blue" style={{ height: gH + 57 }} />
      <div
        className="absolute left-[150px] text-[14px] font-semibold bg-white px-[4px] rounded-[3px]"
        style={{ bottom: 42 + Math.round((gH + 57) / 2) - 8 }}
      >
        {s.mslText} ft MSL
      </div>
      {/* AGL measure (from ground) */}
      <div className="absolute left-[378px] h-[57px] border-l-2 border-[#4f7d14]" style={{ bottom: 42 + gH }} />
      <div
        className="absolute left-[388px] text-[14px] font-semibold text-[#33590a] bg-white px-[4px] rounded-[3px]"
        style={{ bottom: 42 + gH + 20 }}
      >
        316 ft AGL
      </div>
      {/* Chart obstacle symbol card */}
      <div className="absolute left-[12px] top-[12px] px-[14px] py-[10px] bg-white rounded-[10px] flex items-center gap-[12px]">
        <svg aria-hidden="true" width="22" height="30" viewBox="0 0 22 30" fill="none" stroke="#1F4E9A" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M3 28L11 4l8 24" />
          <circle cx="11" cy="28" r="1.5" fill="#1F4E9A" />
        </svg>
        <div className="flex flex-col tabular-nums">
          <span className="text-[12px]">Chart obstacle symbol</span>
          <span className="text-[22px] font-semibold text-chart-blue">{s.msl}</span>
          <span className="text-[18px] text-chart-blue">(316)</span>
        </div>
      </div>
    </>
  );

  const controls = (
    <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
      <label htmlFor="a4-elev" className="text-[13px] font-semibold">
        Ground elevation: {s.elevText} ft MSL
      </label>
      <input
        id="a4-elev"
        type="range"
        min={0}
        max={1500}
        step={1}
        value={elev}
        aria-valuetext={valueText}
        onChange={(e) => setElev(Number(e.target.value))}
        className="w-full h-[44px]"
        style={{ accentColor: "#7fbf2e" }}
      />
    </div>
  );

  return (
    <AnimationFrame
      title="AGL versus MSL"
      category="Airspace"
      stage={stage}
      caption={s.caption}
      controls={controls}
      claim="Top number: feet above sea level (MSL). In parentheses: feet above the ground (AGL)."
      sourceLabel="FAA chart guide"
      citation="FAA Aeronautical Chart Users' Guide"
      bogeymanLine="Part 107 limits are AGL. Use the number in parentheses."
      liveAnnouncement={`${valueText}. ${s.caption}`}
    />
  );
}
