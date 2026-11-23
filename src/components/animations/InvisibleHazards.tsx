"use client";

import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { INVISIBLE_HAZARDS_CAPTIONS, invisibleHazardsScene } from "./logic/invisibleHazards";

// A9 — "Invisible hazards" 6-beat loop animation.
// Layout and copy ported from docs/animations/designs/A9-InvisibleHazards.dc.html.
// TODO(verify): turbulence above stacks and cooling towers, pending a check
// against the AIM.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };

export default function InvisibleHazards() {
  const loop = useBeatLoop();
  const reducedMotion = useReducedMotion();
  const { beat } = loop;
  const o = invisibleHazardsScene(beat);
  const caption = INVISIBLE_HAZARDS_CAPTIONS[beat - 1];
  const move = reducedMotion ? "none" : "transform 1.2s ease, opacity 0.6s ease";

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Ground */}
        <rect x="0" y="364" width="672" height="56" fill="#e3e6ea" />
        <path d="M0 364h672" stroke="#0e1114" strokeWidth="2" />
        {/* Cooling tower */}
        <path d="M86 364Q112 300 104 232L176 232Q168 300 194 364Z" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
        <text x="140" y="386" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">
          Cooling tower
        </text>
        {/* Rising hot air */}
        <g style={{ opacity: o.plume, ...fade }}>
          <path
            d="M108 228Q84 150 120 96Q96 60 124 20M140 228Q150 150 132 96Q160 56 140 14M172 228Q200 150 164 100Q192 60 166 20"
            stroke="#b42318"
            strokeWidth="2.5"
            strokeDasharray="7 6"
            fill="none"
          />
          <path
            d="M116 34l8-14 8 14M132 28l8-14 8 14M158 34l8-14 8 14"
            stroke="#b42318"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="206" y="60" fontSize="12" fontWeight="600" fill="#b42318" textAnchor="start">
            Rising hot air
          </text>
          <text x="206" y="76" fontSize="12" fontWeight="600" fill="#b42318" textAnchor="start">
            you cannot see
          </text>
        </g>
        {/* Poles */}
        <path d="M330 364V250M320 262h20M470 364V250M460 262h20" stroke="#0e1114" strokeWidth="4" strokeLinecap="round" />
        {/* Power lines */}
        <g style={{ opacity: o.wire, ...fade }}>
          <path d="M322 262Q400 292 462 262M338 262Q400 292 478 262" stroke="#0e1114" strokeWidth="1.5" fill="none" />
          <text x="400" y="306" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Power lines
          </text>
        </g>
        <text x="400" y="386" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">
          Poles
        </text>
        {/* Radio tower */}
        <path d="M580 364V120" stroke="#8a9198" strokeWidth="4" />
        <path d="M572 364L580 140L588 364M574 320h12M576 270h8M577 220h6" stroke="#8a9198" strokeWidth="1.5" fill="none" />
        <text x="580" y="386" fontSize="12" fontWeight="400" fill="#0e1114" textAnchor="middle">
          Tower
        </text>
        {/* Guy wires */}
        <g style={{ opacity: o.guy, ...fade }}>
          <path d="M580 140L500 364M580 140L660 364M580 230L530 364M580 230L630 364" stroke="#0e1114" strokeWidth="1.2" />
          <text x="520" y="230" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="end">
            Guy wires
          </text>
        </g>
        {/* The drone */}
        <g
          style={{
            transform: `translate(${o.droneX}px, ${o.droneY}px) rotate(${o.droneR}deg)`,
            transition: move,
          }}
        >
          <g transform="translate(-33 -30)">
            <Drone size={66} />
          </g>
        </g>
      </svg>
      {/* Plan box */}
      <div
        className="absolute right-[16px] top-[16px] max-w-[250px] box-border px-[12px] py-[8px] rounded-[10px] bg-graphite text-white text-[12.5px] leading-[1.4]"
        style={{ opacity: o.plan, ...fade }}
      >
        <span className="font-semibold text-ice-blue">Plan for what you cannot see.</span> Walk the site in daylight and
        keep your distance.
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Invisible hazards"
      category="Airspace"
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
      claim="The air above a stack or cooling tower can be violently turbulent even when it looks clear."
      sourceLabel="FAA flight manual"
      citation="AIM 7-5-15"
      bogeymanLine="If it was built to get rid of heat, do not fly over it."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
