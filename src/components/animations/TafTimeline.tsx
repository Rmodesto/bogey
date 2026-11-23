"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import LegalBadge from "./LegalBadge";
import { tafTimelineState, TafSegment } from "./logic/tafTimeline";

// W2 — "TAF as a timeline" scrub animation. One slider moves the forecast
// time across the valid period; the raw TAF line that applies lights up and
// the timeline cursor follows.
// Geometry and copy ported from docs/animations/designs/W2-TafTimeline.dc.html.

const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const TAF_LINES: { seg: TafSegment; text: string }[] = [
  { seg: "base", text: "TAF KXYZ 121720Z 1218/1318 18010KT P6SM SCT040" },
  { seg: "tempo", text: "TEMPO 1220/1222 4SM -SHRA BKN030" },
  { seg: "fm", text: "FM130000 24015G25KT 2SM +TSRA OVC010" },
  { seg: "bec", text: "BECMG 1306/1308 30010KT P6SM SCT040" },
];

// Timeline hour labels, every 3 hours from 1800Z on the 12th.
const HOUR_LABELS = ["18Z", "21Z", "00Z", "03Z", "06Z", "09Z", "12Z", "15Z", "18Z"];

export default function TafTimeline() {
  const [h, setH] = useState(1);
  const reducedMotion = useReducedMotion();

  const s = tafTimelineState(h);

  const stage = (
    <>
      {/* The raw TAF, one line per group; the active group is highlighted */}
      <div
        className="absolute left-[14px] top-[12px] right-[14px] px-[10px] py-[8px] rounded-[8px] bg-white"
        style={{ font: `600 12.5px ${mono}`, lineHeight: 1.55, border: "1.5px solid #e3e6ea" }}
      >
        {TAF_LINES.map((line, i) => (
          <div key={line.seg}>
            {i > 0 ? " " : ""}
            <span
              className="px-[3px] py-[1px] rounded-[3px]"
              style={{ background: s.seg === line.seg ? "#9cd94a" : "rgba(0,0,0,0)" }}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Segment bars */}
        <rect x="36" y="150" width="150" height="40" fill="#eaf6d8" stroke="#0e1114" strokeWidth="1.5" />
        <text x="111" y="175" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
          Base
        </text>
        <rect x="86" y="124" width="50" height="22" fill="#FFFFFF" stroke="#0e1114" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x="111" y="140" fontSize="11" fontWeight="600" fill="#0e1114" textAnchor="middle">
          TEMPO
        </text>
        <rect x="186" y="150" width="150" height="40" fill="rgba(180,35,24,0.14)" stroke="#0e1114" strokeWidth="1.5" />
        <text x="261" y="175" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
          FM: complete change
        </text>
        <rect x="336" y="150" width="50" height="40" fill="#f6f8fa" stroke="#0e1114" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x="361" y="175" fontSize="10" fontWeight="600" fill="#0e1114" textAnchor="middle">
          BECMG
        </text>
        <rect x="386" y="150" width="250" height="40" fill="#eaf6d8" stroke="#0e1114" strokeWidth="1.5" />
        <text x="511" y="175" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
          After the change
        </text>
        {/* Hour ticks: a tall tick every 6 hours */}
        {Array.from({ length: 25 }, (_, i) => (
          <path key={i} d={`M${36 + i * 25} 196v${i % 6 === 0 ? 10 : 5}`} stroke="#0e1114" strokeWidth="1.2" />
        ))}
        {HOUR_LABELS.map((label, i) => (
          <text
            key={i}
            x={36 + i * 75}
            y="222"
            fontSize="11"
            fontWeight={i % 2 === 0 ? 600 : 400}
            fill="#0e1114"
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
        <text x="36" y="240" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="middle">
          12th
        </text>
        <text x="186" y="240" fontSize="11" fontWeight="400" fill="#0e1114" textAnchor="middle">
          13th
        </text>
      </svg>
      {/* Time cursor */}
      <div
        aria-hidden="true"
        className="absolute top-[116px] h-[96px] border-l-[3px] border-jet-black"
        style={{ left: s.cx, transition: reducedMotion ? "none" : "left 0.1s linear" }}
      />
      {/* Readout + verdict */}
      <div className="absolute left-[36px] bottom-[20px] right-[36px] flex items-center gap-[12px] flex-wrap">
        <div className="text-[20px] font-semibold tabular-nums bg-white px-[6px] rounded-[3px]">{s.when}</div>
        <div className="text-[14px] font-semibold">{s.cond}</div>
        <LegalBadge legal={s.legal} legalLabel="3 SM or more" notLegalLabel="Below 3 SM" />
      </div>
    </>
  );

  const controls = (
    <div className="flex flex-col gap-[2px] flex-[1_1_260px]">
      <label htmlFor="w2-h" className="text-[13px] font-semibold">
        Forecast time: {s.when}
      </label>
      <input
        id="w2-h"
        type="range"
        min={0}
        max={24}
        step={1}
        value={h}
        aria-valuetext={s.hText}
        onChange={(e) => setH(Number(e.target.value))}
        className="w-full h-[44px]"
        style={{ accentColor: "#7fbf2e" }}
      />
    </div>
  );

  return (
    <AnimationFrame
      title="TAF as a timeline"
      category="Weather"
      stage={stage}
      caption={s.caption}
      controls={controls}
      claim="FM is a complete change. TEMPO is temporary. BECMG is gradual. Every time is Zulu."
      sourceLabel="FAA weather handbook"
      citation="Aviation Weather Handbook"
      bogeymanLine="1218 is the 12th at 1800 Zulu. It is a day and an hour."
      liveAnnouncement={`${s.hText}. ${s.caption}`}
    />
  );
}
