"use client";

import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { PATTERN_POSITIONS, PATTERN_CALLS, PATTERN_CAPTIONS } from "./logic/trafficPattern";

// O1 — "The traffic pattern" 6-beat loop animation.
// Layout and copy ported from docs/animations/designs/O1-TrafficPattern.dc.html.
// TODO(verify): traffic-pattern details cited to AIM 4-3-3; pending a
// check against the source.

export default function TrafficPattern() {
  const loop = useBeatLoop();
  const reducedMotion = useReducedMotion();
  const { beat } = loop;
  const [px, py, rot] = PATTERN_POSITIONS[beat - 1];
  const caption = PATTERN_CAPTIONS[beat - 1];
  const call = PATTERN_CALLS[beat - 1];

  const stage = (
    <>
      {/* Pattern circuit */}
      <div className="absolute left-[130px] bottom-[98px] w-[410px] h-[202px] box-border border-2 border-dashed border-slate" />
      {/* Runway */}
      <div className="absolute left-[236px] bottom-[90px] w-[200px] h-[16px] bg-graphite" />
      <div className="absolute left-[242px] bottom-[91px] text-[11px] font-semibold text-white">9</div>
      <div className="absolute left-[416px] bottom-[91px] text-[11px] font-semibold text-white">27</div>
      {/* Leg labels */}
      <div className="absolute left-[448px] bottom-[106px] text-[12px] font-semibold bg-white px-[4px] rounded-[3px]">Upwind</div>
      <div className="absolute left-[550px] bottom-[192px] text-[12px] font-semibold bg-white px-[4px] rounded-[3px]">Crosswind</div>
      <div className="absolute left-[300px] bottom-[308px] text-[12px] font-semibold bg-white px-[4px] rounded-[3px]">Downwind</div>
      <div className="absolute left-[84px] bottom-[192px] text-[12px] font-semibold bg-white px-[4px] rounded-[3px]">Base</div>
      <div className="absolute left-[150px] bottom-[106px] text-[12px] font-semibold bg-white px-[4px] rounded-[3px]">Final</div>
      {/* Airplane */}
      <div
        className="absolute w-[32px] h-[32px]"
        style={{
          left: px - 16,
          bottom: py - 16,
          transform: `rotate(${rot}deg)`,
          transition: reducedMotion ? "none" : "left 2s ease-in-out, bottom 2s ease-in-out, transform 0.8s ease",
        }}
      >
        <svg role="img" aria-label="Airplane" width="32" height="32" viewBox="0 0 32 32" fill="#0e1114">
          <path d="M30 16l-9-3-5-9h-3l3 9H8l-3-4H2l2 7-2 7h3l3-4h8l-3 9h3l5-9z" />
        </svg>
      </div>
      {/* Drone operating area */}
      <div className="absolute left-[250px] bottom-[12px] w-[300px] h-[52px] box-border border-[2.5px] border-dashed border-[#4f7d14] bg-volt-lime/10 rounded-[8px] flex items-center justify-center text-[12px] font-semibold text-[#33590a]">
        Drone operating area, clear of the pattern
      </div>
      {/* Wind chip */}
      <div className="absolute right-[12px] top-[12px] flex items-center gap-[6px] text-[12px] font-semibold px-[8px] py-[4px] rounded-[8px] bg-white">
        <svg aria-hidden="true" width="26" height="12" viewBox="0 0 26 12" fill="none" stroke="#0e1114" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 6H3M8 1L3 6l5 5" />
        </svg>
        <span>Wind from the east</span>
      </div>
      {/* CTAF call */}
      <div className="absolute left-[12px] top-[12px] w-[440px] box-border px-[12px] py-[8px] bg-white border-2 border-deep-ice-blue rounded-[12px] flex flex-col gap-[2px]">
        <span className="text-[11px] font-semibold text-graphite">On the CTAF</span>
        <span className="text-[13px] leading-[1.4]">{call}</span>
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="The traffic pattern"
      category="Operations"
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
      claim="Standard pattern: left turns. Upwind, crosswind, downwind, base, final."
      sourceLabel="FAA airport procedures"
      citation="AIM 4-3-3"
      bogeymanLine={'Hear "left base" and you should know which corner to watch.'}
      liveAnnouncement={`Beat ${beat} of 6. ${caption} ${call}`}
    />
  );
}
