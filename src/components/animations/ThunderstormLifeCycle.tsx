"use client";

import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import {
  THUNDERSTORM_CAPTIONS,
  THUNDERSTORM_INGREDIENTS,
  THUNDERSTORM_STAGE_NAMES,
  thunderstormScene,
} from "./logic/thunderstormLifeCycle";

// W6 — "Thunderstorm life cycle" 6-beat loop animation. The three stages
// light in turn, then a microburst drives the drone down.
// Layout and copy ported from docs/animations/designs/W6-ThunderstormLifeCycle.dc.html.
// TODO(verify): stage names and "mature begins when precipitation starts",
// pending a check against the Aviation Weather Handbook.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };

export default function ThunderstormLifeCycle() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const reducedMotion = useReducedMotion();
  const v = thunderstormScene(beat);
  const caption = THUNDERSTORM_CAPTIONS[beat - 1];
  // The design moves the drone's anchor point; the div's top-left sits 28 px
  // left and 26 px above it (nested svg x="-28" y="-26").
  const droneTop = parseInt(v.dY, 10) - 26;

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        <rect x="0" y="364" width="672" height="56" fill="#e3e6ea" />
        <path d="M0 364h672" stroke="#0e1114" strokeWidth="2" />
        {/* 1. Cumulus: updrafts only */}
        <g style={{ opacity: v.o1, ...fade }}>
          <path
            d="M60 280Q40 215 73 180Q86 144 125 150Q164 144 177 180Q210 215 190 280Z"
            fill="#FFFFFF"
            stroke="#0e1114"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M100 270V190M94 199l6-9 6 9" stroke="#4f7d14" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M150 270V190M144 199l6-9 6 9" stroke="#4f7d14" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="125" y="392" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">
            {THUNDERSTORM_STAGE_NAMES[0]}
          </text>
        </g>
        {/* 2. Mature: updraft and downdraft together, rain, lightning */}
        <g style={{ opacity: v.o2, ...fade }}>
          <path
            d="M250 280Q224 175 267 100Q284 64 335 70Q386 64 403 100Q446 175 420 280Z"
            fill="#FFFFFF"
            stroke="#0e1114"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M300 270V120M294 129l6-9 6 9" stroke="#4f7d14" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M370 130V270M364 261l6 9 6-9" stroke="#b42318" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M330 286l-5 14M344 286l-5 14M358 286l-5 14M372 286l-5 14M386 286l-5 14M400 286l-5 14"
            stroke="#6fa6c6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M334 312l-5 14M348 312l-5 14M362 312l-5 14M376 312l-5 14M390 312l-5 14M404 312l-5 14"
            stroke="#6fa6c6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text x="335" y="392" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">
            {THUNDERSTORM_STAGE_NAMES[1]}
          </text>
          <path d="M352 200l-10 22h12l-10 24" stroke="#0e1114" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* 3. Dissipating: downdrafts only */}
        <g style={{ opacity: v.o3, ...fade }}>
          <path
            d="M470 280Q448 195 485 140Q500 104 545 110Q590 104 605 140Q642 195 620 280Z"
            fill="#FFFFFF"
            stroke="#0e1114"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M520 150V270M514 261l6 9 6-9" stroke="#b42318" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M570 150V270M564 261l6 9 6-9" stroke="#b42318" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M510 290l-5 14M526 290l-5 14M542 290l-5 14M558 290l-5 14M574 290l-5 14"
            stroke="#6fa6c6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text x="545" y="392" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">
            {THUNDERSTORM_STAGE_NAMES[2]}
          </text>
        </g>
        {/* Microburst under the mature storm */}
        <g style={{ opacity: v.oMb, ...fade }}>
          <path d="M370 286V350" stroke="#b42318" strokeWidth="5" />
          <path d="M370 352Q330 358 290 344M370 352Q410 358 450 344" stroke="#b42318" strokeWidth="3" fill="none" />
          <path
            d="M300 340l-12 4 8 9M440 340l12 4-8 9"
            stroke="#b42318"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="456" y="330" fontSize="12" fontWeight="600" fill="#b42318" textAnchor="start">
            Microburst
          </text>
        </g>
      </svg>
      {/* The drone, shoved down and tipped by the microburst on the last beat */}
      <div
        aria-hidden="true"
        className="absolute left-[208px] w-[56px]"
        style={{
          top: droneTop,
          opacity: v.oD,
          transform: `rotate(${v.dR})`,
          transformOrigin: "28px 26px",
          transition: reducedMotion ? "none" : "transform 1.2s ease, top 1.2s ease, opacity 0.6s ease",
        }}
      >
        <Drone size={56} />
      </div>
      {/* The three ingredients */}
      <div className="absolute left-[16px] top-[14px] flex gap-[8px]" style={{ opacity: v.oIng, ...fade }}>
        {THUNDERSTORM_INGREDIENTS.map((name) => (
          <span
            key={name}
            className="text-[12.5px] font-semibold px-[10px] py-[3px] rounded-full bg-white"
            style={{ border: "1.5px solid #0e1114" }}
          >
            {name}
          </span>
        ))}
      </div>
      {/* No-fly verdict */}
      <div className="absolute right-[16px] top-[14px]" style={{ opacity: v.oNo, ...fade }}>
        <div className="flex items-center gap-[6px] px-[12px] py-[5px] rounded-full bg-white text-[#b42318] border-2 border-[#b42318] text-[14px] font-semibold">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#b42318" strokeWidth="2.5" strokeLinecap="round">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
          <span>Storm in the area: do not fly</span>
        </div>
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Thunderstorm life cycle"
      category="Weather"
      stage={stage}
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
      claim="The mature stage starts when rain begins to fall, and it is the most violent."
      sourceLabel="FAA weather handbook"
      citation="Aviation Weather Handbook"
      bogeymanLine="Rain reaching the ground means mature stage. That is the test answer."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
