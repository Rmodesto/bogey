"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LegalBadge from "./LegalBadge";
import { AIRSPEED_KN, groundspeedState } from "./logic/groundspeed";

// R3 — "Groundspeed, not airspeed" scrub animation. One slider drives the
// wind while the drone holds a fixed 70-knot airspeed; only the groundspeed
// bar and the ground slide.
// Geometry and copy ported from docs/animations/designs/R3-Groundspeed.dc.html.

export default function Groundspeed() {
  const [wind, setWind] = useState(0);
  const [moving, setMoving] = useState(false);
  const flyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reducedMotion = useReducedMotion();

  // Propellers blur while the scene is being driven, for 700 ms after the
  // last change — unless the user prefers reduced motion.
  function bump() {
    if (reducedMotion) return;
    setMoving(true);
    clearTimeout(flyTimer.current);
    flyTimer.current = setTimeout(() => setMoving(false), 700);
  }
  useEffect(() => () => clearTimeout(flyTimer.current), []);

  const s = groundspeedState(wind);
  // Both bars share the same scale: 4.35 px per knot, limit line at 87 kt.
  const gsW = Math.round(s.groundspeed * 4.35);
  const tilt = 8 + wind * 0.15;
  const gx = -s.groundspeed * 6;
  const tailW = 30 + Math.max(0, wind) * 4;
  const headW = 30 + Math.max(0, -wind) * 4;

  const stage = (
    <>
      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0 h-[56px] bg-divider-gray border-t-2 border-jet-black" />
      {/* Ground dashes slide with groundspeed */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 bottom-[18px] h-[6px]"
        style={{
          background: "repeating-linear-gradient(90deg, #8a9198 0 28px, rgba(0,0,0,0) 28px 56px)",
          backgroundPositionX: gx,
          transition: reducedMotion ? "none" : "background-position-x 0.3s linear",
        }}
      />
      {/* Airspeed bar, fixed */}
      <div className="absolute left-[24px] top-[20px] text-[13px] font-semibold">
        Airspeed (through the air): {AIRSPEED_KN} kt, fixed
      </div>
      <div className="absolute left-[24px] top-[44px] w-[522px] h-[18px] border-[1.5px] border-jet-black rounded-[4px] bg-white">
        <div className="w-[304px] h-full bg-ice-blue" />
      </div>
      {/* Groundspeed bar */}
      <div className="absolute left-[24px] top-[80px] text-[13px] font-semibold">
        Groundspeed (over the ground): {s.groundspeed} kt
      </div>
      <div className="absolute left-[24px] top-[104px] w-[522px] h-[18px] border-[1.5px] border-jet-black rounded-[4px] bg-white">
        <div
          className="h-full"
          style={{
            width: gsW,
            background: s.legal ? "#9cd94a" : "#b42318",
            transition: reducedMotion ? "none" : "width 0.15s linear",
          }}
        />
      </div>
      {/* 87-knot limit line */}
      <div className="absolute left-[402px] top-[34px] h-[100px] border-l-2 border-dashed border-[#b42318]" />
      <div className="absolute left-[410px] top-[128px] text-[13px] font-semibold text-[#b42318] bg-white px-[4px] rounded-[3px]">
        Limit: 87 kt (100 mph)
      </div>
      <div className="absolute left-[24px] top-[128px] text-[12px]">0 kt</div>
      {/* Drone, tilting with the wind */}
      <div
        className="absolute left-[296px] bottom-[150px] w-[64px] h-[24px]"
        style={{ transform: `rotate(${tilt}deg)`, transition: reducedMotion ? "none" : "transform 0.2s ease" }}
      >
        <div className="absolute left-[-12px] bottom-0">
          <Drone flying={moving} />
        </div>
      </div>
      {/* Wind label + arrows */}
      <div className="absolute left-0 right-0 bottom-[196px] text-center text-[13px] font-semibold">{s.windLabel}</div>
      <div aria-hidden="true" className="absolute left-[100px] bottom-[156px] w-[150px] flex justify-end">
        <svg
          width={tailW}
          height="16"
          viewBox="0 0 150 16"
          preserveAspectRatio="none"
          fill="none"
          style={{ opacity: wind > 0 ? 1 : 0, transition: reducedMotion ? "none" : "width 0.15s linear" }}
        >
          <path
            d="M0 8h140M132 2l10 6-10 6"
            stroke="#0e1114"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div aria-hidden="true" className="absolute left-[410px] bottom-[156px] w-[150px] flex justify-start">
        <svg
          width={headW}
          height="16"
          viewBox="0 0 150 16"
          preserveAspectRatio="none"
          fill="none"
          style={{ opacity: wind < 0 ? 1 : 0, transition: reducedMotion ? "none" : "width 0.15s linear" }}
        >
          <path
            d="M150 8H10M18 2L8 8l10 6"
            stroke="#0e1114"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      {/* Readout + verdict */}
      <div className="absolute left-[24px] bottom-[64px] flex flex-col items-start gap-[6px]">
        <div className="text-[20px] font-semibold tabular-nums bg-white px-[4px] rounded-[3px]">
          {s.groundspeed} kt · {s.groundspeedMph} mph over the ground
        </div>
        <LegalBadge legal={s.legal} />
      </div>
      <div className="absolute right-[12px] bottom-[64px] text-[12px]">Flight direction: left to right</div>
    </>
  );

  const controls = (
    <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
      <label htmlFor="r3-wind" className="text-[13px] font-semibold">
        Wind along the flight path: {s.windLabel}
      </label>
      <input
        id="r3-wind"
        type="range"
        min={-30}
        max={30}
        step={1}
        value={wind}
        aria-valuetext={s.windText}
        onChange={(e) => {
          setWind(Number(e.target.value));
          bump();
        }}
        className="w-full h-[44px]"
        style={{ accentColor: "#7fbf2e" }}
      />
    </div>
  );

  return (
    <AnimationFrame
      title="Groundspeed, not airspeed"
      category="Regulations"
      stage={stage}
      caption={s.caption}
      controls={controls}
      claim="Maximum groundspeed is 87 knots, which is 100 mph."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.51(a)"
      bogeymanLine="87 knots, not 100. And it is speed over the ground, not through the air."
      liveAnnouncement={`Wind ${s.windText}; groundspeed ${s.groundspeed} knots. ${s.caption}`}
    />
  );
}
