"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { heavyHotAndHighState } from "./logic/heavyHotAndHigh";

// L4 — "Heavy, hot, and high" scrub animation. One slider loads payload on
// the drone, the other raises density altitude; both eat into the same climb
// and flight-time margin, and the drone hangs lower as the margin shrinks.
// Geometry and copy ported from docs/animations/designs/L4-HeavyHotAndHigh.dc.html.
// Bars show percent of the published figure and are illustrative: use the
// manufacturer's data for a real aircraft.

export default function HeavyHotAndHigh() {
  const [w, setW] = useState(20);
  const [d, setD] = useState(1000);
  const [moving, setMoving] = useState(false);
  const flyTimer = useRef<ReturnType<typeof setTimeout>>();
  const reducedMotion = useReducedMotion();

  function bump() {
    if (reducedMotion) return;
    setMoving(true);
    clearTimeout(flyTimer.current);
    flyTimer.current = setTimeout(() => setMoving(false), 700);
  }
  useEffect(() => () => clearTimeout(flyTimer.current), []);

  const s = heavyHotAndHighState(w, d);
  // Drone altitude tracks the climb bar: 2.2 px per percent above the ground.
  const droneBottom = 74 + s.climb * 2.2;
  const pkgSize = 8 + w * 0.3;
  // The design hangs the package off the drone's bottom edge; at the worst
  // heavy-and-high corner that put the package below the ground line, so its
  // bottom is clamped to the ground top (56 px) here. Visual fix only.
  const pkgBottom = Math.max(56, droneBottom - pkgSize);
  const barTransition = reducedMotion ? "none" : "width 0.15s linear";

  const stage = (
    <>
      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0 h-[56px] bg-divider-gray border-t-2 border-jet-black" />
      {/* Drone */}
      <div
        className="absolute left-[90px] w-[132px] h-[60px]"
        style={{ bottom: droneBottom, transition: reducedMotion ? "none" : "bottom 0.2s linear" }}
      >
        <div className="absolute left-0 bottom-0">
          <Drone size={132} flying={moving} />
        </div>
      </div>
      {/* Payload package, hanging under the drone */}
      <div
        aria-hidden="true"
        className="absolute box-border bg-[#dcbf98] border-2 border-jet-black"
        style={{
          left: 156 - pkgSize / 2,
          bottom: pkgBottom,
          width: pkgSize,
          height: pkgSize,
          opacity: w > 0 ? 1 : 0,
          transition: reducedMotion ? "none" : "bottom 0.2s linear, width 0.15s linear, height 0.15s linear",
        }}
      />
      {/* Performance bars */}
      <div className="absolute left-[330px] top-[36px] w-[310px] flex flex-col gap-[22px]">
        <div>
          <div className="flex justify-between text-[13px] font-semibold">
            <span>Climb rate</span>
            <span className="tabular-nums">{s.climb}%</span>
          </div>
          <div className="h-[22px] mt-[4px] border-[1.5px] border-jet-black rounded-[5px] bg-white overflow-hidden">
            <div
              className="h-full"
              style={{ width: `${s.climb}%`, background: s.climbLow ? "#b42318" : "#9cd94a", transition: barTransition }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[13px] font-semibold">
            <span>Flight time</span>
            <span className="tabular-nums">{s.time}%</span>
          </div>
          <div className="h-[22px] mt-[4px] border-[1.5px] border-jet-black rounded-[5px] bg-white overflow-hidden">
            <div
              className="h-full"
              style={{ width: `${s.time}%`, background: s.timeLow ? "#b42318" : "#9cd94a", transition: barTransition }}
            />
          </div>
        </div>
      </div>
      <div className="absolute left-[330px] top-[196px] w-[310px] text-[12px]">
        Percent of the published figure. Illustrative: use the manufacturer&rsquo;s data for a real aircraft.
      </div>
      {/* Readout */}
      <div className="absolute left-[24px] top-[20px] text-[18px] font-semibold bg-white px-[4px] rounded-[3px]">
        {s.summary}
      </div>
    </>
  );

  const controls = (
    <>
      <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
        <label htmlFor="l4-w" className="text-[13px] font-semibold">
          Payload: {s.w}% of maximum
        </label>
        <input
          id="l4-w"
          type="range"
          min={0}
          max={100}
          step={5}
          value={w}
          aria-valuetext={s.wText}
          onChange={(e) => {
            setW(Number(e.target.value));
            bump();
          }}
          className="w-full h-[44px]"
          style={{ accentColor: "#7fbf2e" }}
        />
      </div>
      <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
        <label htmlFor="l4-d" className="text-[13px] font-semibold">
          Density altitude: {s.dFmt} ft
        </label>
        <input
          id="l4-d"
          type="range"
          min={0}
          max={10000}
          step={500}
          value={d}
          aria-valuetext={s.dText}
          onChange={(e) => {
            setD(Number(e.target.value));
            bump();
          }}
          className="w-full h-[44px]"
          style={{ accentColor: "#7fbf2e" }}
        />
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Heavy, hot, and high"
      category="Loading & Performance"
      stage={stage}
      caption={s.caption}
      controls={controls}
      claim="More weight and thinner air both cut climb and flight time. The fix is less weight, not more throttle."
      sourceLabel="FAA pilot handbook"
      citation="FAA-H-8083-25"
      bogeymanLine="Published flight time is for a light drone on a cool day."
      liveAnnouncement={`${s.wText}, ${s.dText}. ${s.caption}`}
    />
  );
}
