"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LegalBadge from "./LegalBadge";
import { cloudBoxVerdict, hazeOpacity } from "./logic/cloudBox";

// R2 — "The cloud box" scrub animation.
// Geometry and copy ported from docs/animations/designs/R2-CloudBox.dc.html.

export default function CloudBox() {
  const [alt, setAlt] = useState(300);
  const [vis, setVis] = useState(4);
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

  const { legal, caption } = cloudBoxVerdict(alt, vis);
  const haze = hazeOpacity(vis);
  const droneBottom = 56 + Math.round(alt * 0.24);
  const valueText = `${alt} feet above ground, visibility ${vis} statute miles, ${legal ? "legal" : "not legal"}`;

  const stage = (
    <>
      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0 h-[56px] bg-divider-gray border-t-2 border-jet-black" />
      {/* Altitude axis */}
      <div className="absolute left-[56px] bottom-[56px] w-[2px] h-[340px] bg-jet-black" />
      <div className="absolute left-[14px] top-[10px] text-[12px] font-semibold">ft AGL</div>
      {[
        { ft: 200, bottom: 103 },
        { ft: 400, bottom: 151 },
        { ft: 700, bottom: 223 },
      ].map((t) => (
        <div key={t.ft}>
          <div className="absolute left-[46px] w-[12px] h-[1.5px] bg-jet-black" style={{ bottom: t.bottom }} />
          <div className="absolute left-[10px] text-[12px] tabular-nums" style={{ bottom: t.bottom - 7 }}>
            {t.ft}
          </div>
        </div>
      ))}
      {/* Keep-out box */}
      <div
        className="absolute left-[190px] bottom-[104px] w-[450px] h-[292px] box-border border-2 border-dashed border-[#b42318]"
        style={{
          background:
            "repeating-linear-gradient(135deg, rgba(180,35,24,0.10) 0 6px, rgba(180,35,24,0) 6px 14px)",
        }}
      />
      <div className="absolute left-[198px] top-[30px] text-[12px] font-semibold text-[#b42318] bg-white px-[4px] rounded-[3px]">
        Keep out of this box
      </div>
      {/* Cloud */}
      <div className="absolute left-[330px] bottom-[224px] w-[170px] h-[70px] rounded-[36px] bg-white border-2 border-jet-black" />
      <div className="absolute left-[366px] bottom-[268px] w-[90px] h-[64px] rounded-full bg-white border-2 border-jet-black border-b-white" />
      <div className="absolute left-[380px] bottom-[250px] text-[12px] font-semibold">Cloud base 700 ft</div>
      {/* 500 below measure */}
      <div className="absolute left-[414px] bottom-[104px] h-[120px] border-l-[1.5px] border-jet-black" />
      <div className="absolute left-[422px] bottom-[156px] text-[13px] font-semibold bg-white px-[4px] rounded-[3px]">
        500 ft below
      </div>
      {/* 2,000 horizontal measures */}
      <div className="absolute left-[190px] bottom-[258px] w-[140px] border-t-[1.5px] border-jet-black" />
      <div className="absolute left-[196px] bottom-[264px] text-[13px] font-semibold bg-white px-[4px] rounded-[3px]">
        2,000 ft horizontally
      </div>
      <div className="absolute left-[500px] bottom-[258px] w-[140px] border-t-[1.5px] border-jet-black" />
      {/* Drone */}
      <div
        className="absolute left-[236px] w-[64px] h-[24px]"
        style={{ bottom: droneBottom, transition: reducedMotion ? "none" : "bottom 0.15s linear" }}
      >
        <div className="absolute left-[-12px] bottom-0">
          <Drone flying={moving} />
        </div>
      </div>
      {/* Haze overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-fog-gray pointer-events-none"
        style={{ opacity: haze, transition: "opacity 0.2s linear" }}
      />
      {/* Readout + verdict */}
      <div className="absolute left-[70px] bottom-[64px] flex flex-col items-start gap-[6px]">
        <div className="text-[20px] font-semibold tabular-nums bg-white px-[4px] rounded-[3px]">
          {alt} ft AGL &middot; {vis} SM
        </div>
        <LegalBadge legal={legal} />
      </div>
      <div className="absolute right-[12px] bottom-[8px] text-[12px]">Horizontal distance not to scale</div>
    </>
  );

  const controls = (
    <>
      <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
        <label htmlFor="r2-alt" className="text-[13px] font-semibold">
          Altitude: {alt} ft AGL
        </label>
        <input
          id="r2-alt"
          type="range"
          min={0}
          max={700}
          step={10}
          value={alt}
          aria-valuetext={`${alt} feet above ground, ${legal ? "legal" : "not legal"}`}
          onChange={(e) => {
            setAlt(Number(e.target.value));
            bump();
          }}
          className="w-full h-[44px]"
          style={{ accentColor: "#7fbf2e" }}
        />
      </div>
      <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
        <label htmlFor="r2-vis" className="text-[13px] font-semibold">
          Visibility from the control station: {vis} SM
        </label>
        <input
          id="r2-vis"
          type="range"
          min={1}
          max={10}
          step={1}
          value={vis}
          aria-valuetext={`${vis} statute miles visibility, ${vis >= 3 ? "legal" : "not legal"}`}
          onChange={(e) => setVis(Number(e.target.value))}
          className="w-full h-[44px]"
          style={{ accentColor: "#7fbf2e" }}
        />
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="The cloud box"
      category="Regulations"
      stage={stage}
      caption={caption}
      controls={controls}
      claim="3 statute miles visibility. 500 ft below and 2,000 ft horizontally from clouds."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.51(c)-(d)"
      bogeymanLine="Statute miles, not nautical. And it applies in Class G too."
      liveAnnouncement={`${valueText}. ${caption}`}
    />
  );
}
