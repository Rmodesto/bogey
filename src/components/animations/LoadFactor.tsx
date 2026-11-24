"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { loadFactorState } from "./logic/loadFactor";

// L1 — "Bank angle and load factor" scrub animation.
// Geometry and copy ported from docs/animations/designs/L1-LoadFactor.dc.html.
// TODO(verify): load-factor values per bank angle cited to the Pilot's
// Handbook (FAA-H-8083-25); pending a check against the source.

export default function LoadFactor() {
  const [bank, setBank] = useState(45);
  const [moving, setMoving] = useState(false);
  const flyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reducedMotion = useReducedMotion();

  function bump() {
    if (reducedMotion) return;
    setMoving(true);
    clearTimeout(flyTimer.current);
    flyTimer.current = setTimeout(() => setMoving(false), 700);
  }
  useEffect(() => () => clearTimeout(flyTimer.current), []);

  const s = loadFactorState(bank);
  const valueText = `${bank} degrees of bank, load factor ${s.lf} G, load ${s.load} pounds`;

  const stage = (
    <>
      {/* Horizon */}
      <div className="absolute left-[20px] top-[210px] w-[330px] border-t-2 border-dashed border-slate" />
      <div className="absolute left-[24px] top-[216px] text-[11px]">Horizon</div>
      {/* Banked drone */}
      <div
        aria-hidden="true"
        className="absolute left-[65px] top-[150px] w-[240px] h-[120px]"
        style={{
          transform: `rotate(${bank}deg)`,
          transition: reducedMotion ? "none" : "transform 0.15s linear",
        }}
      >
        <div className="absolute left-0 top-[6px]">
          <Drone size={240} flying={moving} />
        </div>
      </div>
      {/* Bank angle readout */}
      <div className="absolute left-[20px] top-[14px] px-[12px] py-[8px] bg-white rounded-[10px] flex flex-col tabular-nums">
        <span className="text-[12px]">Bank angle</span>
        <span className="text-[26px] font-semibold">{bank}&deg;</span>
      </div>
      <div className="absolute left-[20px] bottom-[14px] text-[12px]">
        10 lb sUAS in a level, coordinated turn, seen from behind
      </div>
      {/* Load panel */}
      <div className="absolute right-[12px] top-[12px] bottom-[12px] w-[290px] box-border p-[12px] bg-white rounded-[10px] flex flex-col gap-[10px]">
        <div className="flex justify-between items-baseline tabular-nums">
          <span className="text-[13px]">Load factor</span>
          <span className="text-[26px] font-semibold">{s.lf} G</span>
        </div>
        <div className="flex justify-between items-baseline tabular-nums">
          <span className="text-[13px]">Load the wing supports</span>
          <span className="text-[20px] font-semibold">{s.load} lb</span>
        </div>
        {/* Bars */}
        <div className="grow flex items-end justify-center gap-[36px] border-b-2 border-jet-black relative">
          <div className="absolute left-0 right-0 bottom-[100px] border-t-[1.5px] border-dashed border-slate" />
          <div className="absolute right-0 bottom-[104px] text-[11px]">1 G</div>
          <div className="w-[64px] h-[100px] bg-ice-blue border-2 border-b-0 border-jet-black box-border" />
          <div
            className="w-[64px] bg-volt-green border-2 border-b-0 border-jet-black box-border"
            style={{
              height: Math.round(100 * s.lfNumber),
              transition: reducedMotion ? "none" : "height 0.15s linear",
            }}
          />
        </div>
        <div className="flex justify-center gap-[36px] text-[12px] font-semibold">
          <span className="w-[64px] text-center">Weight 10 lb</span>
          <span className="w-[64px] text-center">Load {s.load} lb</span>
        </div>
        {/* Reference table */}
        <div className="grid grid-cols-4 gap-[4px] text-[12px] tabular-nums text-center">
          {[
            ["0°", "1.00"],
            ["30°", "1.15"],
            ["45°", "1.41"],
            ["60°", "2.00"],
          ].map(([deg, g]) => (
            <span key={deg} className="py-[4px] rounded-[6px] bg-fog-gray">
              {deg}
              <br />
              {g}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  const controls = (
    <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
      <label htmlFor="l1-bank" className="text-[13px] font-semibold">
        Bank angle: {bank}&deg;
      </label>
      <input
        id="l1-bank"
        type="range"
        min={0}
        max={60}
        step={5}
        value={bank}
        aria-valuetext={valueText}
        onChange={(e) => {
          setBank(Number(e.target.value));
          bump();
        }}
        className="w-full h-[44px]"
        style={{ accentColor: "#7fbf2e" }}
      />
    </div>
  );

  return (
    <AnimationFrame
      title="Bank angle and load factor"
      category="Loading & Performance"
      stage={stage}
      caption={s.caption}
      controls={controls}
      claim="Load supported = weight × load factor. At 60° of bank the load factor is 2 G."
      sourceLabel="FAA pilot handbook"
      citation="FAA-H-8083-25"
      bogeymanLine="At 60 degrees the load doubles. Stall speed rises too, but it does not double."
      liveAnnouncement={`${valueText}. ${s.caption}`}
    />
  );
}
