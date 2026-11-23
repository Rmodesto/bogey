"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import { densityAltitudeState } from "./logic/densityAltitude";

// W4 — "Density altitude" scrub animation. Two sliders (field elevation and
// temperature) drive the worked density-altitude sum; the air-molecule dots
// spread out and the drone sinks as the air thins.
// Geometry and copy ported from docs/animations/designs/W4-DensityAltitude.dc.html.
// The climb-and-lift bar and molecule spacing are ILLUSTRATIVE: direction only.

export default function DensityAltitude() {
  const [e, setE] = useState(3000);
  const [t, setT] = useState(35);
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

  const s = densityAltitudeState(e, t);
  const fade = reducedMotion ? "none" : undefined;

  const stage = (
    <>
      {/* Air molecules: the dots spread apart as density altitude rises */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 right-0 bottom-[56px] opacity-70"
        style={{
          backgroundImage: "radial-gradient(circle, #6fa6c6 2.5px, rgba(0,0,0,0) 3px)",
          backgroundSize: `${s.dot} ${s.dot}`,
          transition: fade ?? "background-size 0.2s linear",
        }}
      />
      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0 h-[56px] bg-divider-gray border-t-2 border-jet-black" />
      {/* Drone, higher when performance is better */}
      <div
        className="absolute left-[300px] w-[64px] h-[24px]"
        style={{ bottom: s.dB, transition: fade ?? "bottom 0.2s linear" }}
      >
        <div className="absolute left-[-12px] bottom-0">
          <Drone flying={moving} />
        </div>
      </div>
      {/* Density-altitude readout */}
      <div className="absolute left-[20px] top-[16px] w-[290px] box-border px-[12px] py-[10px] rounded-[12px] bg-white border-2 border-jet-black">
        <div className="text-[12px] font-semibold text-graphite">Density altitude</div>
        <div className="text-[26px] font-semibold tabular-nums">{s.daText} ft</div>
        <div className="text-[12.5px] leading-[1.4]">{s.feel}</div>
      </div>
      {/* Performance bar */}
      <div
        className="absolute right-[20px] top-[16px] w-[250px] box-border px-[12px] py-[10px] rounded-[12px] bg-white"
        style={{ border: "1.5px solid #e3e6ea" }}
      >
        <div className="text-[12px] font-semibold mb-[4px]">Climb and lift (illustrative)</div>
        <div className="h-[16px] rounded-[4px] overflow-hidden" style={{ border: "1.5px solid #0e1114" }}>
          <div
            className="h-full"
            style={{ width: s.perfW, background: s.perfFill, transition: fade ?? "width 0.2s linear" }}
          />
        </div>
        <div className="text-[12px] mt-[6px]">Standard temperature here: {s.std}°C</div>
      </div>
      <div className="absolute left-[20px] bottom-[64px] text-[12px] bg-white px-[4px] rounded-[3px]">
        Dots are air molecules. Standard pressure assumed.
      </div>
    </>
  );

  const controls = (
    <>
      <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
        <label htmlFor="w4-e" className="text-[13px] font-semibold">
          Field elevation: {s.elevText} ft
        </label>
        <input
          id="w4-e"
          type="range"
          min={0}
          max={8000}
          step={500}
          value={e}
          aria-valuetext={s.eText}
          onChange={(ev) => {
            setE(Number(ev.target.value));
            bump();
          }}
          className="w-full h-[44px]"
          style={{ accentColor: "#7fbf2e" }}
        />
      </div>
      <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
        <label htmlFor="w4-t" className="text-[13px] font-semibold">
          Temperature: {s.t}°C
        </label>
        <input
          id="w4-t"
          type="range"
          min={-10}
          max={40}
          step={1}
          value={t}
          aria-valuetext={s.tText}
          onChange={(ev) => {
            setT(Number(ev.target.value));
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
      title="Density altitude"
      category="Weather"
      stage={stage}
      caption={s.caption}
      controls={controls}
      claim="High, hot, and humid air is thin air. Thin air means less lift and less climb."
      sourceLabel="FAA pilot handbook"
      citation="FAA-H-8083-25"
      bogeymanLine="High density altitude means thin air, not dense air."
      liveAnnouncement={`${s.eText}, ${s.tText}. ${s.caption}`}
    />
  );
}
