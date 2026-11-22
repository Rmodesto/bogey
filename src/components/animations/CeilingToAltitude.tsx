"use client";

import { useState } from "react";
import AnimationFrame from "./AnimationFrame";
import LegalBadge from "./LegalBadge";
import { ceilingVerdict } from "./logic/ceilingToAltitude";

// W3 — "Ceiling to legal altitude" scrub animation.
// Geometry and copy ported from docs/animations/designs/W3-CeilingToAltitude.dc.html.

const S = 0.22; // ft-to-px scale

export default function CeilingToAltitude() {
  const [ceil, setCeil] = useState(800);

  const v = ceilingVerdict(ceil);
  const brBottom = 56 + Math.round(v.room * S);
  const brH = Math.round((ceil - v.room) * S);
  const valueText = `Ceiling ${v.ceilText} feet above ground; highest legal altitude ${v.maxAlt} feet`;

  const stage = (
    <>
      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0 h-[56px] bg-divider-gray border-t-2 border-jet-black" />
      {/* Altitude axis */}
      <div className="absolute left-[56px] bottom-[56px] w-[2px] h-[340px] bg-jet-black" />
      <div className="absolute left-[14px] top-[10px] text-[12px] font-semibold">ft AGL</div>
      {[
        { label: "400", bottom: 143 },
        { label: "800", bottom: 231 },
        { label: "1,200", bottom: 319 },
      ].map((t) => (
        <div key={t.label}>
          <div className="absolute left-[46px] w-[12px] h-[1.5px] bg-jet-black" style={{ bottom: t.bottom }} />
          <div className="absolute left-[10px] text-[12px] tabular-nums" style={{ bottom: t.bottom - 7 }}>
            {t.label}
          </div>
        </div>
      ))}
      {/* Flyable band */}
      <div
        className="absolute left-[58px] right-0 bottom-[56px] border-t-2 border-[#4f7d14]"
        style={{
          height: Math.round(v.maxAlt * S),
          background:
            "repeating-linear-gradient(135deg, rgba(127,191,46,0.45) 0 5px, rgba(127,191,46,0.12) 5px 11px)",
          transition: "height 0.2s linear",
        }}
      />
      {/* 400 ft limit line */}
      <div className="absolute left-[58px] right-0 bottom-[143px] border-t-2 border-dashed border-graphite" />
      <div className="absolute right-[10px] bottom-[148px] text-[12px] font-semibold bg-white px-[4px] rounded-[3px]">
        400 ft AGL limit
      </div>
      {/* Cloud deck */}
      <div
        className="absolute left-[58px] right-0 h-[30px] bg-white border-y-2 border-jet-black"
        style={{ bottom: 56 + Math.round(ceil * S), transition: "bottom 0.2s linear" }}
      />
      <div
        className="absolute left-[80px] text-[12px] font-semibold"
        style={{ bottom: 56 + Math.round(ceil * S) + 8, transition: "bottom 0.2s linear" }}
      >
        Overcast, base {v.ceilText} ft AGL
      </div>
      {/* 500-below measure */}
      <div
        className="absolute left-[420px] border-l-2 border-jet-black"
        style={{ bottom: brBottom, height: brH, transition: "bottom 0.2s linear, height 0.2s linear" }}
      />
      <div
        className="absolute left-[430px] text-[13px] font-semibold bg-white px-[4px] rounded-[3px]"
        style={{ bottom: brBottom + Math.round(brH / 2) - 8, transition: "bottom 0.2s linear" }}
      >
        500 ft below
      </div>
      {/* METAR strip */}
      <div className="absolute left-[70px] top-[10px] right-[12px] px-[10px] py-[6px] bg-jet-black text-white rounded-[8px] font-mono text-[13px]">
        KXYZ 211753Z 18006KT 6SM{" "}
        <span className="bg-volt-green text-jet-black px-[4px] rounded-[3px] font-semibold">{v.code}</span> 12/10 A3001
      </div>
      {/* Readout + verdict */}
      <div className="absolute left-[70px] bottom-[62px] flex flex-col items-start gap-[6px]">
        <div className="text-[18px] font-semibold tabular-nums bg-white px-[4px] rounded-[3px]">
          Highest legal altitude: {v.maxAlt} ft AGL
        </div>
        <LegalBadge legal={v.legal} legalLabel="Flight possible" notLegalLabel="No room to fly" />
      </div>
    </>
  );

  const controls = (
    <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
      <label htmlFor="w3-ceil" className="text-[13px] font-semibold">
        Reported ceiling: {v.ceilText} ft AGL
      </label>
      <input
        id="w3-ceil"
        type="range"
        min={300}
        max={1500}
        step={100}
        value={ceil}
        aria-valuetext={valueText}
        onChange={(e) => setCeil(Number(e.target.value))}
        className="w-full h-[44px]"
        style={{ accentColor: "#7fbf2e" }}
      />
    </div>
  );

  return (
    <AnimationFrame
      title="Ceiling to legal altitude"
      category="Weather"
      stage={stage}
      caption={v.caption}
      controls={controls}
      claim="Ceiling minus 500 ft, and never above 400 ft AGL."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.51(d)"
      bogeymanLine="OVC008 is 800 ft above the ground. METAR cloud heights are hundreds of feet AGL."
      liveAnnouncement={`${valueText}. ${v.caption}`}
    />
  );
}
