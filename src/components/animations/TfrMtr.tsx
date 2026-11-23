"use client";

import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { TFR_MTR_CAPTIONS, MTR_ROUTE, tfrMtrScene } from "./logic/tfrMtr";

// A6 — "TFRs and training routes" 6-beat loop animation.
// Layout and copy ported from docs/animations/designs/A6-TFRsAndTrainingRoutes.dc.html.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };
const RED = "#b42318";

export default function TfrMtr() {
  const loop = useBeatLoop();
  const reducedMotion = useReducedMotion();
  const { beat } = loop;
  const o = tfrMtrScene(beat);
  const caption = TFR_MTR_CAPTIONS[beat - 1];

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        <defs>
          <pattern id="a6h" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="12" fill="rgba(180,35,24,0.14)" />
          </pattern>
        </defs>
        {/* The map: river and roads */}
        <path d="M0 300Q170 270 330 300T672 280" stroke="#a9cfe3" strokeWidth="10" fill="none" />
        <path d="M60 0L120 420M500 0L470 420M0 96L672 70" stroke="#FFFFFF" strokeWidth="5" />
        {/* Stadium */}
        <g>
          <ellipse cx="190" cy="150" rx="46" ry="30" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <ellipse cx="190" cy="150" rx="26" ry="14" fill="#eaf6d8" stroke="#0e1114" strokeWidth="1.5" />
          <text x="190" y="198" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Stadium
          </text>
        </g>
        {/* Forest */}
        <g>
          <circle cx="500" cy="170" r="16" fill="#eaf6d8" stroke="#0e1114" strokeWidth="1.5" />
          <circle cx="526" cy="186" r="14" fill="#eaf6d8" stroke="#0e1114" strokeWidth="1.5" />
          <circle cx="482" cy="192" r="13" fill="#eaf6d8" stroke="#0e1114" strokeWidth="1.5" />
          <circle cx="508" cy="200" r="15" fill="#eaf6d8" stroke="#0e1114" strokeWidth="1.5" />
          <text x="504" y="236" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Forest
          </text>
        </g>
        {/* Your job site */}
        <g>
          <rect x="330" y="330" width="44" height="18" rx="3" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <text x="352" y="366" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Your job site
          </text>
        </g>
        {/* Stadium TFR */}
        <g style={{ opacity: o.stadiumTfr, ...fade }}>
          <circle cx="190" cy="150" r="104" fill="url(#a6h)" stroke={RED} strokeWidth="2.5" strokeDasharray="8 6" />
        </g>
        {/* Wildfire TFR */}
        <g style={{ opacity: o.wildfireTfr, ...fade }}>
          <circle cx="504" cy="186" r="92" fill="url(#a6h)" stroke={RED} strokeWidth="2.5" strokeDasharray="8 6" />
          <path d="M504 176q-12 -18 0 -34q4 12 12 16q8 10 0 22q-6 6 -12 -4z" fill={RED} />
        </g>
        {/* Military training route */}
        <g style={{ opacity: o.mtr, ...fade }}>
          <path d="M20 404L652 262" stroke="#8a9198" strokeWidth="3" />
          <rect x="74" y="366" width="62" height="20" rx="3" fill="#FFFFFF" stroke="#8a9198" strokeWidth="1.5" />
          <text x="105" y="380" fontSize="12" fontWeight="600" fill="#2b2f33" textAnchor="middle">
            {MTR_ROUTE}
          </text>
        </g>
        {/* The jet running the route */}
        <g
          style={{
            opacity: o.mtr,
            transform: `translate(${o.jetX}px, ${o.jetY}px) rotate(-12.7deg)`,
            transition: reducedMotion ? "opacity 0.4s ease" : "transform 2.2s linear, opacity 0.4s ease",
          }}
        >
          <path d="M-22 0L8 -5L22 0L8 5Z" fill="#0e1114" />
          <path d="M-8 -3L-16 -14L-4 -4ZM-8 3L-16 14L-4 4Z" fill="#0e1114" />
        </g>
      </svg>
      {/* The drone at the job site */}
      <div className="absolute left-[326px] top-[306px]">
        <Drone size={52} />
      </div>
      {/* TFR labels */}
      <div
        className="absolute left-[100px] top-[30px] text-[12px] font-semibold leading-[1.35] bg-white px-[8px] py-[4px] rounded-[6px]"
        style={{ color: RED, border: `1.5px solid ${RED}`, opacity: o.stadiumTfr, ...fade }}
      >
        TFR · 3 NM radius · surface to 3,000 ft AGL
        <br />1 hour before to 1 hour after
      </div>
      <div
        className="absolute left-[440px] top-[64px] text-[12px] font-semibold bg-white px-[8px] py-[4px] rounded-[6px]"
        style={{ color: RED, border: `1.5px solid ${RED}`, opacity: o.wildfireTfr, ...fade }}
      >
        TFR · wildfire · issued today
      </div>
      {/* NOTAM note */}
      <div
        className="absolute right-[14px] bottom-[14px] w-[250px] box-border px-[12px] py-[8px] rounded-[10px] bg-graphite text-white text-[12.5px] leading-[1.4]"
        style={{ opacity: o.notam, ...fade }}
      >
        <span className="font-semibold text-ice-blue">Not on the chart.</span> Found only by checking NOTAMs and the FAA TFR list.
      </div>
      <div className="absolute left-[14px] bottom-[14px] text-[11px]">Example map. Distances not to scale.</div>
    </>
  );

  return (
    <AnimationFrame
      title="TFRs and training routes"
      category="Airspace"
      stage={stage}
      stageBg="#f6f8fa"
      caption={caption}
      controls={
        <LoopControls
          beat={beat}
          totalBeats={6}
          playing={loop.playing}
          onToggle={loop.toggle}
          onReplay={loop.replay}
          onPrev={loop.prev}
          onNext={loop.next}
        />
      }
      claim="Check for TFRs before every flight. A TFR applies to drones the same as to every other aircraft."
      sourceLabel="Part 107 rules"
      citation="14 CFR 91.137 area; AIM 3-5-2"
      bogeymanLine="Stadium ring: 3 nautical miles, 3,000 feet, an hour either side."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
