"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LegalBadge from "./LegalBadge";
import { alcoholState } from "./logic/alcoholGates";

// R11 — "Eight hours and 0.04" scrub animation. Two gauges, two gates: the
// hours bar must reach the 8-hour mark and the concentration marker must sit
// below 0.04 before the launch pad opens.
// Geometry and copy ported from docs/animations/designs/R11-EightHoursAnd004.dc.html.

function GateChip({ open }: { open: boolean }) {
  return (
    <span
      className={`text-[13px] font-semibold px-[10px] py-[2px] rounded-full border-2 ${
        open ? "border-volt-green bg-volt-green text-jet-black" : "border-[#b42318] bg-white text-[#b42318]"
      }`}
    >
      {open ? "Open" : "Closed"}
    </span>
  );
}

export default function AlcoholGates() {
  // `bac` is in hundredths: the 0–10 slider maps to 0.00–0.10.
  const [hours, setHours] = useState(4);
  const [bac, setBac] = useState(2);
  const reducedMotion = useReducedMotion();

  const s = alcoholState(hours, bac);

  const stage = (
    <>
      {/* Ground */}
      <div className="absolute left-0 right-0 bottom-0 h-[56px] bg-divider-gray border-t-2 border-jet-black" />
      {/* Gate 1 — hours since the last drink */}
      <div className="absolute left-[36px] top-[22px] text-[14px] font-semibold">
        Gate 1 · Hours since the last drink: {hours}
      </div>
      <div className="absolute right-[36px] top-[20px]">
        <GateChip open={s.timeGateOpen} />
      </div>
      <div className="absolute left-[36px] top-[54px] w-[600px] h-[26px] box-border border-[1.5px] border-jet-black rounded-[5px] bg-white overflow-hidden">
        <div
          className="h-full"
          style={{
            width: `${(hours / 12) * 100}%`,
            background: s.timeGateOpen ? "#9cd94a" : "#a9cfe3",
            transition: reducedMotion ? "none" : "width 0.15s linear",
          }}
        />
      </div>
      <div className="absolute left-[435px] top-[44px] h-[46px] border-l-[3px] border-jet-black" />
      <div className="absolute left-[36px] top-[86px] text-[12px]">0 h</div>
      <div className="absolute left-[418px] top-[92px] text-[12px] font-semibold">8 h</div>
      <div className="absolute left-[612px] top-[86px] text-[12px]">12 h</div>
      {/* Gate 2 — alcohol concentration */}
      <div className="absolute left-[36px] top-[140px] text-[14px] font-semibold">
        Gate 2 · Alcohol concentration: {s.bacText}
      </div>
      <div className="absolute right-[36px] top-[138px]">
        <GateChip open={s.bacGateOpen} />
      </div>
      <div
        className="absolute left-[36px] top-[172px] w-[600px] h-[26px] box-border border-[1.5px] border-jet-black rounded-[5px]"
        style={{ background: "linear-gradient(90deg, #eaf6d8 0 40%, #FFFFFF 40% 100%)" }}
      />
      <div className="absolute left-[275px] top-[162px] h-[46px] border-l-[3px] border-jet-black" />
      <div
        className="absolute top-[166px] w-[14px] h-[38px] ml-[-7px] rounded-[4px] border-2 border-jet-black box-border"
        style={{
          left: 36 + bac * 60,
          background: s.bacGateOpen ? "#9cd94a" : "#b42318",
          transition: reducedMotion ? "none" : "left 0.15s linear",
        }}
      />
      <div className="absolute left-[36px] top-[204px] text-[12px]">0.00</div>
      <div className="absolute left-[258px] top-[210px] text-[12px] font-semibold">0.04</div>
      <div className="absolute left-[456px] top-[204px] text-[12px] text-graphite">
        0.08 is the driving limit, not this one
      </div>
      <div className="absolute left-[515px] top-[172px] h-[26px] border-l-[1.5px] border-dashed border-slate" />
      {/* Readout + verdict */}
      <div className="absolute left-[36px] bottom-[64px] flex flex-col items-start gap-[6px]">
        <div className="text-[20px] font-semibold tabular-nums bg-white px-[4px] rounded-[3px]">
          {hours} h · {s.bacText}
        </div>
        <LegalBadge legal={s.legal} legalLabel="Both gates open" notLegalLabel="Not legal to fly" />
      </div>
      {/* Launch pad */}
      <div className="absolute right-[60px] bottom-[56px] w-[64px] h-[24px]">
        <div className="absolute left-[-12px] bottom-0">
          <Drone flying={false} />
        </div>
      </div>
      <div className="absolute right-[30px] bottom-[30px] text-[12px]">Launch pad</div>
    </>
  );

  const controls = (
    <>
      <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
        <label htmlFor="r11-h" className="text-[13px] font-semibold">
          Hours since the last drink: {hours}
        </label>
        <input
          id="r11-h"
          type="range"
          min={0}
          max={12}
          step={0.5}
          value={hours}
          aria-valuetext={s.hoursText}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-full h-[44px]"
          style={{ accentColor: "#7fbf2e" }}
        />
      </div>
      <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
        <label htmlFor="r11-b" className="text-[13px] font-semibold">
          Alcohol concentration: {s.bacText}
        </label>
        <input
          id="r11-b"
          type="range"
          min={0}
          max={10}
          step={1}
          value={bac}
          aria-valuetext={s.bacAriaText}
          onChange={(e) => setBac(Number(e.target.value))}
          className="w-full h-[44px]"
          style={{ accentColor: "#7fbf2e" }}
        />
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Eight hours and 0.04"
      category="Regulations"
      stage={stage}
      caption={s.caption}
      controls={controls}
      claim="8 hours since the last drink, and below 0.04. Both, and never while under the influence."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.27; 14 CFR 91.17"
      bogeymanLine="0.08 is the driving limit. For flying it is 0.04."
      liveAnnouncement={`${s.hoursText}, ${s.bacAriaText}. ${s.caption}`}
    />
  );
}
