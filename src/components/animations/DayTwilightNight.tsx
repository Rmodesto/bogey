"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { dayNightState } from "./logic/dayTwilightNight";

// R4 — "Day, twilight, night" scrub animation.
// Logic and copy ported from docs/animations/designs/R4-DayTwilightNight.dc.html.

export default function DayTwilightNight() {
  const [t, setT] = useState(1185);
  const reducedMotion = useReducedMotion();

  const s = dayNightState(t);
  const sunLeft = Math.round(60 + s.sunFrac * 520);
  const sunBottom = Math.round(70 + Math.sin(Math.PI * s.sunFrac) * 230);
  const valueText = `${s.clock}, ${s.period.toLowerCase()}`;

  const stage = (
    <>
      {/* Sun */}
      <div
        aria-hidden="true"
        className="absolute w-[44px] h-[44px] rounded-full bg-[#ffd166] border-2 border-jet-black"
        style={{
          left: sunLeft,
          bottom: sunBottom,
          opacity: s.period === "Day" ? 1 : 0,
          transition: "opacity 0.3s linear",
        }}
      />
      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0 h-[56px] bg-graphite border-t-2 border-jet-black" />
      {/* Drone (static position, no scrub bump in this design) */}
      <div className="absolute left-[150px] bottom-[170px] w-[64px] h-[24px]">
        <div className="absolute left-[-12px] bottom-0">
          <Drone />
        </div>
      </div>
      {/* Anti-collision strobe */}
      <div
        aria-hidden="true"
        className={reducedMotion ? "" : "strobe"}
        style={{
          position: "absolute",
          left: 182,
          bottom: 150,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#FFFFFF",
          boxShadow: "0 0 0 6px rgba(255,255,255,0.45), 0 0 0 16px rgba(255,255,255,0.2)",
          opacity: s.lightRequired ? 1 : 0,
        }}
      />
      <style jsx global>{`
        @keyframes strobe {
          0%,
          60% {
            transform: scale(1);
          }
          70% {
            transform: scale(1.5);
          }
          100% {
            transform: scale(1);
          }
        }
        .strobe {
          animation: strobe 1.2s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .strobe {
            animation: none;
          }
        }
      `}</style>
      {/* Period + clock */}
      <div className="absolute left-[12px] top-[12px] px-[12px] py-[8px] bg-white text-jet-black rounded-[10px] flex flex-col gap-[2px]">
        <span className="text-[22px] font-semibold">{s.period}</span>
        <span className="text-[14px] tabular-nums">{s.clock}</span>
      </div>
      {/* Requirements panel */}
      <div className="absolute right-[12px] top-[12px] w-[300px] p-[12px] bg-white text-jet-black rounded-[10px] flex flex-col gap-[8px] text-[13px]">
        <div className="flex justify-between gap-[12px]">
          <span>Anti-collision light, visible 3 SM</span>
          <span className="font-semibold whitespace-nowrap">{s.lightRequired ? "Required" : "Not required"}</span>
        </div>
        <div className="flex justify-between gap-[12px]">
          <span>Initial test or training after April 6, 2021</span>
          <span className="font-semibold whitespace-nowrap">{s.trainingRequired ? "Required" : "Not required"}</span>
        </div>
        <div className="flex justify-between gap-[12px]">
          <span>Waiver</span>
          <span className="font-semibold whitespace-nowrap">Not needed</span>
        </div>
      </div>
    </>
  );

  const controls = (
    <div className="flex flex-col gap-[2px] w-full">
      <label htmlFor="r4-time" className="text-[13px] font-semibold">
        Time of day: {s.clock} (example day: sunrise 6:30 a.m., sunset 7:30 p.m.)
      </label>
      <input
        id="r4-time"
        type="range"
        min={0}
        max={1439}
        step={5}
        value={t}
        aria-valuetext={valueText}
        onChange={(e) => setT(Number(e.target.value))}
        className="w-full h-[44px]"
        style={{ accentColor: "#7fbf2e" }}
      />
      {/* Day/night strip */}
      <div aria-hidden="true" className="flex h-[12px] rounded-[6px] overflow-hidden border border-jet-black">
        <div style={{ flex: "360 0 0" }} className="bg-jet-black" />
        <div style={{ flex: "30 0 0" }} className="bg-deep-ice-blue" />
        <div style={{ flex: "780 0 0" }} className="bg-mist-blue" />
        <div style={{ flex: "30 0 0" }} className="bg-deep-ice-blue" />
        <div style={{ flex: "240 0 0" }} className="bg-jet-black" />
      </div>
      <div className="flex text-[12px]">
        <span style={{ flex: "360 0 0" }}>Night</span>
        <span style={{ flex: "810 0 0" }}>Day, with 30 minutes of civil twilight at each end</span>
        <span style={{ flex: "270 0 0" }} className="text-right">
          Night
        </span>
      </div>
    </div>
  );

  return (
    <AnimationFrame
      title="Day, twilight, night"
      category="Regulations"
      stage={stage}
      stageHeight={380}
      stageBg={s.sky}
      caption={s.caption}
      controls={controls}
      claim="Twilight and night: anti-collision light on, visible for 3 SM. Night also needs current training. No waiver."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.29"
      bogeymanLine="Twilight needs the light. Night needs the light and the training."
      liveAnnouncement={`${valueText}. ${s.caption}`}
    />
  );
}
