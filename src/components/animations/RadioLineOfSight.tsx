"use client";

import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { RADIO_LOS_CAPTIONS, RADIO_LOS_PLAN_NOTE, radioLosScene } from "./logic/radioLineOfSight";

// O12 — "Radio line of sight" 6-beat loop animation. The drone moves between
// beats with a CSS transform transition; the signal line from the pilot
// changes color and dash as the path clears, lengthens, or gets blocked.
// With reduced motion the drone jumps to its position with no transition.
// Layout and copy ported from docs/animations/designs/O12-RadioLineOfSight.dc.html.

export default function RadioLineOfSight() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const reducedMotion = useReducedMotion();
  const o = radioLosScene(beat);
  const caption = RADIO_LOS_CAPTIONS[beat - 1];
  const fade = reducedMotion ? undefined : "opacity 0.6s ease, transform 0.8s ease";
  const move = reducedMotion ? undefined : "transform 1.2s ease, opacity 0.6s ease";

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Ground and hill */}
        <rect x="0" y="364" width="672" height="56" fill="#e3e6ea" />
        <path d="M0 364h672" stroke="#0e1114" strokeWidth="2" />
        <path d="M330 364Q430 150 540 364Z" fill="#eaf6d8" stroke="#0e1114" strokeWidth="2" />
        <text x="435" y="386" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">Hill</text>
        {/* Pilot */}
        <g transform="translate(70 364)">
          <circle cx="0" cy="-34" r="7" fill="#2b2f33" />
          <path d="M-9 0L-9 -16Q-9 -25 0 -25Q9 -25 9 -16L9 0Z" fill="#2b2f33" />
        </g>
        <text x="70" y="386" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">Pilot</text>
        {/* Other transmitters, dim until their beat */}
        <g style={{ opacity: o.oTx, transition: fade }}>
          <path d="M200 364V250" stroke="#8a9198" strokeWidth="4" />
          <path d="M186 262q14 -16 28 0M178 250q22 -26 44 0M170 238q30 -36 60 0" stroke="#b42318" strokeWidth="2" fill="none" strokeLinecap="round" />
          <text x="200" y="386" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">Other transmitters</text>
        </g>
        {/* Signal line from the pilot's controller */}
        <path d={`M82 322L${o.lx} ${o.ly}`} stroke={o.lc} strokeWidth="2.5" strokeDasharray={o.ld} />
        {/* Red X where the hill blocks the path */}
        <g style={{ opacity: o.oX, transition: fade }}>
          <path d="M396 262l16 16M412 262l-16 16" stroke="#b42318" strokeWidth="3.5" strokeLinecap="round" />
        </g>
        {/* The drone, moving between beats */}
        <g style={{ transform: `translate(${o.dX}px, ${o.dY}px)`, transition: move }}>
          <g transform="translate(-33 -30)">
            <Drone size={66} />
          </g>
        </g>
        {/* Signal-strength bars */}
        <rect x="26" y="52" width="11" height="14" rx="2" fill={o.bars[0] ? "#9cd94a" : "#FFFFFF"} stroke="#0e1114" strokeWidth="1.5" />
        <rect x="42" y="44" width="11" height="22" rx="2" fill={o.bars[1] ? "#9cd94a" : "#FFFFFF"} stroke="#0e1114" strokeWidth="1.5" />
        <rect x="58" y="36" width="11" height="30" rx="2" fill={o.bars[2] ? "#9cd94a" : "#FFFFFF"} stroke="#0e1114" strokeWidth="1.5" />
        <rect x="74" y="28" width="11" height="38" rx="2" fill={o.bars[3] ? "#9cd94a" : "#FFFFFF"} stroke="#0e1114" strokeWidth="1.5" />
      </svg>
      {/* Signal readout */}
      <div className="absolute left-[100px] top-[30px] text-[16px] font-semibold bg-white px-[6px] rounded-[3px]">{o.sig}</div>
      {/* Before-launch plan note */}
      <div
        className="absolute right-[16px] top-[16px] max-w-[250px] px-[12px] py-[8px] rounded-[10px] bg-graphite text-white text-[12.5px] leading-[1.4]"
        style={{ opacity: o.oPlan, transition: fade }}
      >
        <span className="font-semibold text-ice-blue">Before launch:</span> {RADIO_LOS_PLAN_NOTE}
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Radio line of sight"
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
      claim="The control link needs a clear path. Hills, buildings, and other transmitters all cut the range."
      sourceLabel="FAA remote pilot guide"
      citation="FAA-G-8082-22"
      bogeymanLine="The range on the box is a best case, not a promise."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
