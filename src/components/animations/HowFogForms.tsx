"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import LegalBadge from "./LegalBadge";
import { fogFormsState } from "./logic/howFogForms";

// W8 — "How fog forms" scrub animation. One slider moves the night along;
// the temperature trace falls toward the dew point on the graph while fog
// fills the valley scene, radiation-fog style.
// Geometry and copy ported from docs/animations/designs/W8-HowFogForms.dc.html.

export default function HowFogForms() {
  const [h, setH] = useState(2);
  const reducedMotion = useReducedMotion();

  const s = fogFormsState(h);

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Temperature / dew point graph */}
        <rect x="20" y="20" width="340" height="230" rx="10" fill="#FFFFFF" stroke="#e3e6ea" />
        <path d="M60 50V210H336" stroke="#0e1114" strokeWidth="1.5" />
        <text x="52" y="84" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="end">
          22°
        </text>
        <text x="52" y="164" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="end">
          14°
        </text>
        <text x="60" y="228" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="middle">
          Sunset
        </text>
        <text x="330" y="228" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="middle">
          +9 h
        </text>
        {/* Temperature trace. The design's last point dipped below the dew
            point line; it is clamped at 160 to match the 14°C floor. */}
        <polyline
          points="60,80 90,90 120,100 150,110 180,120 210,130 240,140 270,150 300,160 330,160"
          stroke="#0e1114"
          strokeWidth="2.5"
          fill="none"
        />
        <text x="96" y="74" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="start">
          Temperature
        </text>
        <path d="M60 160H336" stroke="#6fa6c6" strokeWidth="2.5" strokeDasharray="7 5" />
        <text x="332" y="178" fontSize="12" fontWeight="600" fill="#2b2f33" textAnchor="end">
          Dew point 14°C
        </text>
        {/* Night valley scene */}
        <rect x="372" y="20" width="280" height="230" rx="10" fill="#17191c" />
        <circle cx="610" cy="56" r="14" fill="#FFFFFF" />
        <path d="M372 216Q470 196 540 210T652 204V250H372Z" fill="#2b2f33" />
        <rect x="430" y="170" width="34" height="40" fill="#8a9198" />
        <path d="M424 170L447 150L470 170Z" fill="#8a9198" />
        <path d="M560 206V150M560 150l-16 22M560 150l16 22M560 166l-12 16M560 166l12 16" stroke="#8a9198" strokeWidth="3" strokeLinecap="round" />
        {/* The fog layer */}
        <rect
          x="372"
          y="120"
          width="280"
          height="130"
          fill="#FFFFFF"
          style={{ opacity: s.fog, transition: reducedMotion ? "none" : "opacity 0.2s linear" }}
        />
      </svg>
      {/* Graph cursor */}
      <div
        aria-hidden="true"
        className="absolute top-[50px] h-[160px]"
        style={{ left: s.mx, borderLeft: "2px solid #b42318", transition: reducedMotion ? "none" : "left 0.1s linear" }}
      />
      <div className="absolute left-[384px] top-[30px] text-[12px] font-semibold text-white">Clear, calm night in a valley</div>
      {/* Readout + verdict */}
      <div className="absolute left-[20px] top-[262px] right-[20px] flex items-center gap-[12px] flex-wrap">
        <div className="text-[20px] font-semibold tabular-nums bg-white px-[6px] rounded-[3px]">
          {s.temp}°C / 14°C · spread {s.spread}°
        </div>
        <LegalBadge legal={s.legal} legalLabel="Fog unlikely" notLegalLabel={s.fogWord} />
      </div>
      {/* Three kinds of fog */}
      <div className="absolute left-[20px] right-[20px] bottom-[14px] grid grid-cols-3 gap-[8px]">
        <div className="px-[10px] py-[8px] rounded-[10px] bg-white border-2 border-jet-black text-[12px] leading-[1.35]">
          <span className="font-semibold">Radiation fog</span>
          <br />
          Clear, calm nights. Usually burns off after sunrise.
        </div>
        <div className="px-[10px] py-[8px] rounded-[10px] bg-white text-[12px] leading-[1.35]" style={{ border: "1.5px solid #e3e6ea" }}>
          <span className="font-semibold">Advection fog</span>
          <br />
          Moist air over a cold surface. Can last all day.
        </div>
        <div className="px-[10px] py-[8px] rounded-[10px] bg-white text-[12px] leading-[1.35]" style={{ border: "1.5px solid #e3e6ea" }}>
          <span className="font-semibold">Upslope fog</span>
          <br />
          Moist air pushed up a slope by wind.
        </div>
      </div>
    </>
  );

  const controls = (
    <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
      <label htmlFor="w8-h" className="text-[13px] font-semibold">
        Hours after sunset: {s.h}
      </label>
      <input
        id="w8-h"
        type="range"
        min={0}
        max={9}
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
      title="How fog forms"
      category="Weather"
      stage={stage}
      stageBg="#f6f8fa"
      caption={s.caption}
      controls={controls}
      claim="When temperature and dew point close in on each other, expect fog or low cloud."
      sourceLabel="FAA weather handbook"
      citation="Aviation Weather Handbook"
      bogeymanLine="Watch the spread shrink, not just the number."
      liveAnnouncement={`${s.hText}. ${s.caption}`}
    />
  );
}
