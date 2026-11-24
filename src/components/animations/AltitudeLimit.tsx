"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LegalBadge from "./LegalBadge";
import { altitudeVerdict } from "./logic/altitudeLimit";

// R1 — "The 400-foot rule" scrub animation.
// Geometry and copy ported from docs/animations/designs/R1-AltitudeLimit.dc.html
// (dark palette from R1-AltitudeLimit-Dark.dc.html).

export default function AltitudeLimit({ dark = false }: { dark?: boolean }) {
  const [alt, setAlt] = useState(620);
  const [near, setNear] = useState(true);
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

  const { legal, caption } = altitudeVerdict(alt, near);

  const droneLeft = near ? 384 : 170;
  const droneBottom = 56 + Math.round(alt * 0.36);
  const valueText = `${alt} feet above ground, ${legal ? "legal" : "not legal"}`;

  // Palette split, light vs dark design
  const ink = dark ? "bg-slate" : "bg-jet-black"; // axis and tower
  const tickText = dark ? "text-white" : "text-jet-black";

  const positionButton = (pressed: boolean) =>
    `min-h-[44px] px-[14px] rounded-full text-[14px] font-semibold cursor-pointer transition-colors ${
      dark
        ? pressed
          ? "bg-volt-green text-jet-black border-2 border-volt-green"
          : "bg-jet-black text-white border border-slate/60"
        : pressed
          ? "bg-jet-black text-white border-2 border-jet-black"
          : "bg-white text-jet-black border-2 border-jet-black"
    }`;

  const stage = (
    <>
      {/* Ground */}
      <div className={`absolute left-0 right-0 bottom-0 h-[56px] ${dark ? "bg-jet-black border-t-2 border-slate" : "bg-divider-gray border-t-2 border-jet-black"}`} />
      {/* Altitude axis */}
      <div className={`absolute left-[56px] bottom-[56px] w-[2px] h-[340px] ${ink}`} />
      <div className={`absolute left-[14px] top-[10px] text-[12px] font-semibold ${tickText}`}>ft AGL</div>
      {[
        { ft: 200, bottom: 127, bold: false },
        { ft: 400, bottom: 199, bold: true },
        { ft: 600, bottom: 271, bold: false },
        { ft: 800, bottom: 343, bold: false },
      ].map((t) => (
        <div key={t.ft}>
          <div className={`absolute left-[46px] w-[12px] h-[1.5px] ${ink}`} style={{ bottom: t.bottom }} />
          <div
            className={`absolute left-[14px] text-[12px] tabular-nums ${tickText} ${t.bold ? "font-semibold" : ""}`}
            style={{ bottom: t.bottom - 7 }}
          >
            {t.ft}
          </div>
        </div>
      ))}
      {/* 400 ft AGL limit line */}
      <div className={`absolute left-[58px] right-0 bottom-[199px] border-t-2 border-dashed ${dark ? "border-ice-blue" : "border-graphite"}`} />
      <div className={`absolute left-[70px] bottom-[204px] text-[12px] font-semibold px-[4px] ${dark ? "text-ice-blue bg-graphite" : "text-graphite bg-white"}`}>
        Limit: 400 ft AGL
      </div>
      {/* Structure allowance zone */}
      <div
        className={`absolute left-[330px] bottom-[56px] w-[300px] h-[324px] box-border border-2 border-dashed ${
          dark ? "border-volt-green bg-volt-green/10" : "border-[#4f7d14] bg-volt-lime/[0.08]"
        }`}
      />
      <div className={`absolute left-[338px] top-[46px] text-[12px] font-semibold px-[4px] ${dark ? "text-volt-green bg-graphite" : "text-[#33590a] bg-white"}`}>
        Near the structure: up to 400 ft above its top
      </div>
      {/* Tower */}
      <div className={`absolute left-[474px] bottom-[56px] w-[12px] h-[180px] ${ink}`} />
      {dark ? (
        <div
          className="absolute left-[473px] bottom-[236px] w-[14px] h-[14px] rounded-full bg-[#f87171]"
          style={{ boxShadow: "0 0 0 6px rgba(248,113,113,0.25)" }}
        />
      ) : (
        <div className="absolute left-[476px] bottom-[236px] w-[8px] h-[8px] rounded-full bg-[#b42318]" />
      )}
      <div className={`absolute left-[496px] bottom-[136px] text-[12px] px-[4px] ${dark ? "bg-graphite text-white" : "bg-white text-jet-black"}`}>
        Tower, 500 ft
      </div>
      {/* 400 ft horizontal span */}
      <div className={`absolute left-[330px] bottom-[30px] w-[150px] border-t-[1.5px] ${dark ? "border-slate" : "border-jet-black"}`} />
      <div className={`absolute left-[372px] bottom-[8px] text-[12px] font-medium ${tickText}`}>400 ft</div>
      {/* Drone */}
      <div
        className="absolute w-[64px] h-[24px]"
        style={{
          left: droneLeft,
          bottom: droneBottom,
          transition: reducedMotion ? "none" : "left 0.4s ease, bottom 0.15s linear",
        }}
      >
        <div className="absolute left-[-12px] bottom-0">
          <Drone flying={moving} dark={dark} />
        </div>
      </div>
      {/* Readout + verdict */}
      <div className="absolute right-[12px] bottom-[66px] flex flex-col items-end gap-[6px]">
        <div className={`text-[28px] font-semibold tabular-nums px-[6px] ${dark ? "text-ice-blue bg-graphite" : "text-jet-black bg-white"}`}>
          {alt} ft AGL
        </div>
        <LegalBadge legal={legal} />
      </div>
    </>
  );

  const controls = (
    <>
      <div className="flex flex-col gap-[4px] grow">
        <label htmlFor="r1-alt-slider" className="text-[13px] font-semibold">
          Altitude
        </label>
        <input
          id="r1-alt-slider"
          type="range"
          min={0}
          max={900}
          step={10}
          value={alt}
          aria-valuetext={valueText}
          onChange={(e) => {
            setAlt(Number(e.target.value));
            bump();
          }}
          className="w-full h-[44px]"
          style={{ accentColor: dark ? "#9cd94a" : "#7fbf2e" }}
        />
      </div>
      <div className="flex flex-col gap-[4px]">
        <span className="text-[13px] font-semibold">Position</span>
        <div className="flex gap-[8px]" role="group" aria-label="Position">
          <button
            type="button"
            aria-pressed={!near}
            onClick={() => {
              setNear(false);
              bump();
            }}
            className={positionButton(!near)}
          >
            Open field
          </button>
          <button
            type="button"
            aria-pressed={near}
            onClick={() => {
              setNear(true);
              bump();
            }}
            className={positionButton(near)}
          >
            Within 400 ft of tower
          </button>
        </div>
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="The 400-foot rule"
      category="Regulations"
      stage={stage}
      caption={caption}
      controls={controls}
      claim="400 ft above the ground, or within 400 ft of a structure, up to 400 ft above its top."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.51(b)"
      bogeymanLine="Read the unit first. This limit is AGL, never MSL."
      liveAnnouncement={`${valueText}. ${caption}`}
      dark={dark}
    />
  );
}
