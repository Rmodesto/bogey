"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LegalBadge from "./LegalBadge";
import { centerOfGravityState } from "./logic/centerOfGravity";

// L2 — "Center of gravity" scrub animation. One slider slides the payload
// fore and aft under a drone of unchanged total weight; the balance point
// follows it and the motor bars show which end works harder.
// Geometry and copy ported from docs/animations/designs/L2-CenterOfGravity.dc.html.
// Motor figures are illustrative: they show direction, not real figures.

export default function CenterOfGravity() {
  const [p, setP] = useState(0);
  const reducedMotion = useReducedMotion();

  const s = centerOfGravityState(p);
  // Payload and balance-point x in design space: 13 px per centimeter around
  // the stage center at 336; limits bar spans 256–416 (±6 cm).
  const px = 336 + p * 13;
  const slide = reducedMotion ? "none" : "left 0.15s linear";

  const stage = (
    <>
      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0 h-[56px] bg-divider-gray border-t-2 border-jet-black" />
      {/* Drone, tilting when the balance point leaves its limits */}
      <div
        className="absolute left-[186px] top-[96px] w-[300px] h-[137px]"
        style={{
          transform: `rotate(${s.tilt}deg)`,
          transition: reducedMotion ? "none" : "transform 0.2s ease",
        }}
      >
        <div className="absolute left-0 top-0">
          <Drone size={300} />
        </div>
      </div>
      {/* Payload */}
      <div
        aria-hidden="true"
        className="absolute top-[236px] w-[44px] h-[34px] ml-[-22px] box-border bg-[#dcbf98] border-2 border-jet-black"
        style={{ left: px, transition: slide }}
      />
      <div
        className="absolute top-[274px] w-[120px] ml-[-60px] text-center text-[12px] font-semibold"
        style={{ left: px, transition: slide }}
      >
        Payload
      </div>
      {/* Balance limits */}
      <div
        aria-hidden="true"
        className="absolute left-[256px] top-[300px] w-[160px] h-[10px] box-border border-[1.5px] border-[#4f7d14] bg-volt-mist rounded-[3px]"
      />
      <div className="absolute left-[256px] top-[314px] w-[160px] text-center text-[11px] text-[#33590a] font-semibold">
        Balance limits
      </div>
      {/* Balance-point marker */}
      <div
        aria-hidden="true"
        className="absolute top-[284px] w-0 h-0 ml-[-9px]"
        style={{
          left: px,
          borderLeft: "9px solid rgba(0,0,0,0)",
          borderRight: "9px solid rgba(0,0,0,0)",
          borderBottom: `16px solid ${s.ok ? "#0e1114" : "#b42318"}`,
          transition: slide,
        }}
      />
      {/* Motor bars */}
      <div className="absolute left-[24px] top-[20px] w-[150px]">
        <div className="text-[12px] font-semibold">Rear motors: {s.rear}%</div>
        <div className="h-[16px] mt-[4px] border-[1.5px] border-jet-black rounded-[4px] bg-white overflow-hidden">
          <div
            className="h-full"
            style={{
              width: `${s.rear}%`,
              background: s.rearOver ? "#b42318" : "#9cd94a",
              transition: reducedMotion ? "none" : "width 0.15s linear",
            }}
          />
        </div>
      </div>
      <div className="absolute right-[24px] top-[20px] w-[150px]">
        <div className="text-[12px] font-semibold">Front motors: {s.front}%</div>
        <div className="h-[16px] mt-[4px] border-[1.5px] border-jet-black rounded-[4px] bg-white overflow-hidden">
          <div
            className="h-full"
            style={{
              width: `${s.front}%`,
              background: s.frontOver ? "#b42318" : "#9cd94a",
              transition: reducedMotion ? "none" : "width 0.15s linear",
            }}
          />
        </div>
      </div>
      <div className="absolute left-[24px] top-[70px] text-[12px]">Rear</div>
      <div className="absolute right-[24px] top-[70px] text-[12px]">Front</div>
      {/* Readout + verdict */}
      <div className="absolute left-[24px] bottom-[64px] flex flex-col items-start gap-[6px]">
        <div className="text-[18px] font-semibold bg-white px-[4px] rounded-[3px]">Total weight: unchanged</div>
        <LegalBadge legal={s.ok} legalLabel="Within balance limits" notLegalLabel="Outside balance limits" />
      </div>
      <div className="absolute right-[12px] bottom-[64px] text-[12px]">Motor figures are illustrative</div>
    </>
  );

  const controls = (
    <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
      <label htmlFor="l2-p" className="text-[13px] font-semibold">
        Payload position: {s.posText}
      </label>
      <input
        id="l2-p"
        type="range"
        min={-10}
        max={10}
        step={1}
        value={p}
        aria-valuetext={s.pText}
        onChange={(e) => setP(Number(e.target.value))}
        className="w-full h-[44px]"
        style={{ accentColor: "#7fbf2e" }}
      />
    </div>
  );

  return (
    <AnimationFrame
      title="Center of gravity"
      category="Loading & Performance"
      stage={stage}
      caption={s.caption}
      controls={controls}
      claim="Being under the weight limit is not enough. The load must also be within the balance limits."
      sourceLabel="FAA pilot handbook"
      citation="FAA-H-8083-25"
      bogeymanLine="Same weight in a different place is a different aircraft."
      liveAnnouncement={`Payload ${s.pText}. ${s.caption}`}
    />
  );
}
