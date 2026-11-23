"use client";

import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { RIGHT_OF_WAY_CAPTIONS, rightOfWayScene } from "./logic/rightOfWay";

// R13 — "Right of way" 6-beat loop animation.
// Layout and copy ported from docs/animations/designs/R13-RightOfWay.dc.html.
// Visual fix vs the design: the "well clear" measuring arrow ended at y=318,
// inside the drone's rotor disc (drone top edge is y=300); it now ends at
// y=296 so it points at the drone without crossing into it.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };

export default function RightOfWay() {
  const loop = useBeatLoop();
  const reducedMotion = useReducedMotion();
  const { beat } = loop;
  const o = rightOfWayScene(beat);
  const caption = RIGHT_OF_WAY_CAPTIONS[beat - 1];
  const move = reducedMotion ? "none" : "transform 1.2s ease, opacity 0.6s ease";

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Ground */}
        <rect x="0" y="364" width="672" height="56" fill="#e3e6ea" />
        <path d="M0 364h672" stroke="#0e1114" strokeWidth="2" />
        {/* Pilot */}
        <g transform="translate(96 364)">
          <circle cx="0" cy="-34" r="7" fill="#2b2f33" />
          <path d="M-9 0L-9 -16Q-9 -25 0 -25Q9 -25 9 -16L9 0Z" fill="#2b2f33" />
        </g>
        <text x="96" y="386" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
          Pilot
        </text>
        {/* Job site */}
        <rect x="250" y="300" width="70" height="64" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
        <path d="M244 300L285 270L326 300Z" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
        <text x="285" y="386" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">
          Job site
        </text>
        {/* Pilot's sight line */}
        <path
          d={`M104 322L${o.eyeX} ${o.eyeY}`}
          stroke="#4f7d14"
          strokeWidth="2"
          strokeDasharray="6 6"
          style={{ opacity: o.eye, ...fade }}
        />
        {/* The drone */}
        <g style={{ transform: `translate(${o.droneX}px, ${o.droneY}px)`, transition: move }}>
          <g transform="translate(-33 -30)">
            <Drone size={66} />
          </g>
        </g>
        {/* The helicopter */}
        <g style={{ transform: `translate(${o.heliX}px, 190px)`, opacity: o.heli, transition: move }}>
          <path
            d="M-56 0Q-56 -22 -20 -22L24 -22Q50 -22 50 0Q50 16 24 16L-28 16Q-56 16 -56 0Z"
            fill="#FFFFFF"
            stroke="#0e1114"
            strokeWidth="2"
          />
          <path d="M50 -4L112 -12L112 -24" stroke="#0e1114" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M-84 -32h170M0 -32v10" stroke="#0e1114" strokeWidth="3" strokeLinecap="round" />
          <path d="M-46 -12h26v18h-30q-4 -10 4 -18Z" fill="#a9cfe3" />
          <path d="M-36 28h72M-22 16v12M18 16v12" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Well clear */}
        <g style={{ opacity: o.clear, ...fade }}>
          <path
            d="M196 250V296M190 260l6-10 6 10M190 286l6 10 6-10"
            stroke="#0e1114"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="206" y="288" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="start">
            Well clear
          </text>
        </g>
      </svg>
      {/* Yielded early badge */}
      <div className="absolute left-[24px] top-[20px] flex" style={{ opacity: o.clear, ...fade }}>
        <div className="flex items-center gap-[6px] px-[12px] py-[5px] rounded-full bg-volt-green text-jet-black text-[14px] font-semibold">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0e1114" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8.5l3.2 3.2L13 5" />
          </svg>
          <span>Yielded early</span>
        </div>
      </div>
      {/* Never-pass warning */}
      <div
        className="absolute right-[16px] top-[20px] max-w-[270px] box-border px-[12px] py-[8px] rounded-[10px] bg-white text-[13px] font-semibold leading-[1.4]"
        style={{ border: "2px dashed #b42318", color: "#b42318", opacity: o.warn, ...fade }}
      >
        Never pass over, under, or ahead of another aircraft unless well clear.
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Right of way"
      category="Regulations"
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
      claim="A drone yields the right of way to all other aircraft."
      sourceLabel="Part 107 rules"
      citation="14 CFR 107.37"
      bogeymanLine="Assume the other pilot has not seen you."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
