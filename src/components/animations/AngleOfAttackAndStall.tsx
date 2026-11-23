"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import LegalBadge from "./LegalBadge";
import { angleOfAttackAndStallState } from "./logic/angleOfAttackAndStall";

// L3 — "Angle of attack and stall" scrub animation. One slider pitches an
// example wing against the oncoming air; a second changes airspeed, which
// never moves the critical angle. Past 16° the streamlines break away.
// Geometry and copy ported from
// docs/animations/designs/L3-AngleOfAttackAndStall.dc.html.

export default function AngleOfAttackAndStall() {
  const [a, setA] = useState(6);
  const [s, setS] = useState(60);
  const reducedMotion = useReducedMotion();

  const st = angleOfAttackAndStallState(a, s);
  const fade = reducedMotion ? "none" : "opacity 0.6s ease";

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Oncoming-air reference line */}
        <path d="M30 250H640" stroke="#8a9198" strokeWidth="1.5" strokeDasharray="4 6" />
        <text x="36" y="268" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="start">
          Oncoming air
        </text>
        {/* Incoming streamlines */}
        <path d="M30 140H200M30 180H190M30 320H200M30 360H210" stroke="#0e1114" strokeWidth="2" strokeDasharray="10 8" />
        {/* Smooth flow over the top */}
        <g style={{ opacity: st.stalled ? 0 : 1, transition: fade }}>
          <path
            d="M200 140Q330 100 470 150T640 170M190 180Q330 150 470 190T640 210"
            stroke="#0e1114"
            strokeWidth="2"
            strokeDasharray="10 8"
            fill="none"
          />
        </g>
        {/* Separated flow */}
        <g style={{ opacity: st.stalled ? 1 : 0, transition: fade }}>
          <path
            d="M200 140Q280 96 340 110M190 180Q260 150 310 150"
            stroke="#0e1114"
            strokeWidth="2"
            strokeDasharray="10 8"
            fill="none"
          />
          <path
            d="M360 130q40 -6 36 26q-8 26 -32 12q-12 -14 6 -20M430 150q44 0 36 36q-12 28 -38 12M510 150q40 4 30 38q-12 24 -34 10M390 200q36 0 30 30q-10 22 -30 10"
            stroke="#b42318"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <text x="470" y="110" fontSize="12" fontWeight="600" fill="#b42318" textAnchor="middle">
            Airflow has separated
          </text>
        </g>
        {/* Flow under the wing */}
        <path
          d="M200 320Q330 330 470 300T640 290M210 360Q330 370 470 340T640 330"
          stroke="#0e1114"
          strokeWidth="2"
          strokeDasharray="10 8"
          fill="none"
        />
        {/* The wing, pitching nose-up with the slider */}
        <g
          style={{
            transform: `rotate(${-st.a}deg)`,
            transformOrigin: "336px 250px",
            transition: reducedMotion ? "none" : "transform 0.15s linear",
          }}
        >
          <path
            d="M216 250Q236 212 336 216Q420 222 456 250Q400 262 336 262Q250 264 216 250Z"
            fill="#a9cfe3"
            stroke="#0e1114"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M216 250H456" stroke="#0e1114" strokeWidth="1.2" strokeDasharray="5 5" />
        </g>
      </svg>
      {/* Lift bar */}
      <div className="absolute left-[20px] top-[16px] w-[230px] box-border px-[12px] py-[10px] rounded-[12px] bg-white border-[1.5px] border-divider-gray">
        <div className="text-[12px] font-semibold mb-[4px]">Lift (illustrative)</div>
        <div className="h-[16px] border-[1.5px] border-jet-black rounded-[4px] overflow-hidden">
          <div
            className="h-full"
            style={{
              width: `${st.lift}%`,
              background: st.stalled ? "#b42318" : "#9cd94a",
              transition: reducedMotion ? "none" : "width 0.15s linear",
            }}
          />
        </div>
      </div>
      {/* Readout + verdict */}
      <div className="absolute right-[20px] top-[16px] flex flex-col items-end gap-[6px]">
        <div className="text-[20px] font-semibold tabular-nums bg-white px-[4px] rounded-[3px]">
          {st.a}&deg; &middot; {st.s} kt
        </div>
        <LegalBadge legal={!st.stalled} legalLabel="Flying" notLegalLabel="Stalled" />
      </div>
      <div className="absolute right-[12px] bottom-[10px] text-[12px]">
        Critical angle shown as 16&deg; for this example wing
      </div>
    </>
  );

  const controls = (
    <>
      <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
        <label htmlFor="l3-a" className="text-[13px] font-semibold">
          Angle of attack: {st.a}&deg;
        </label>
        <input
          id="l3-a"
          type="range"
          min={0}
          max={24}
          step={1}
          value={a}
          aria-valuetext={st.aText}
          onChange={(e) => setA(Number(e.target.value))}
          className="w-full h-[44px]"
          style={{ accentColor: "#7fbf2e" }}
        />
      </div>
      <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
        <label htmlFor="l3-s" className="text-[13px] font-semibold">
          Airspeed: {st.s} kt
        </label>
        <input
          id="l3-s"
          type="range"
          min={30}
          max={90}
          step={5}
          value={s}
          aria-valuetext={st.sText}
          onChange={(e) => setS(Number(e.target.value))}
          className="w-full h-[44px]"
          style={{ accentColor: "#7fbf2e" }}
        />
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Angle of attack and stall"
      category="Loading & Performance"
      stage={stage}
      caption={st.caption}
      controls={controls}
      claim="A wing stalls when it exceeds its critical angle of attack. That can happen at any airspeed."
      sourceLabel="FAA pilot handbook"
      citation="FAA-H-8083-25"
      bogeymanLine="Speed does not cause a stall. Angle does."
      liveAnnouncement={`${st.aText}, ${st.sText}. ${st.caption}`}
    />
  );
}
