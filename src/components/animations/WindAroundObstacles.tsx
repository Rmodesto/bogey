"use client";

import { useReducedMotion } from "motion/react";
import AnimationFrame from "./AnimationFrame";
import Drone from "./Drone";
import LoopControls from "./LoopControls";
import { useBeatLoop } from "./useBeatLoop";
import { WIND_OBSTACLES_CAPTIONS, windObstaclesScene } from "./logic/windAroundObstacles";

// W7 — "Wind around obstacles" 6-beat loop animation. Beats 1-4: wind over a
// building and the turbulent lee. Beats 5-6: cross-fade to a coastline for
// sea breeze and land breeze.
// Layout and copy ported from docs/animations/designs/W7-WindAroundObstacles.dc.html.
// TODO(verify): the sea breeze and land breeze explanation is not in the
// lesson text and has not been checked at the source.

const fade = { transition: "opacity 0.6s ease, transform 0.8s ease" };

export default function WindAroundObstacles() {
  const loop = useBeatLoop();
  const { beat } = loop;
  const reducedMotion = useReducedMotion();
  const v = windObstaclesScene(beat);
  const caption = WIND_OBSTACLES_CAPTIONS[beat - 1];
  // The design moves the drone's anchor point; the div's top-left sits 30 px
  // left and 27 px above it (nested svg x="-30" y="-27").
  const droneTop = parseInt(v.dY, 10) - 27;

  const stage = (
    <>
      <svg aria-hidden="true" width="672" height="420" viewBox="0 0 672 420" fill="none" className="absolute left-0 top-0">
        {/* Scene A: the building */}
        <g style={{ opacity: v.oA, ...fade }}>
          <rect x="0" y="364" width="672" height="56" fill="#e3e6ea" />
          <path d="M0 364h672" stroke="#0e1114" strokeWidth="2" />
          <rect x="250" y="210" width="110" height="154" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
          <path d="M270 236h18M322 236h18M270 276h18M322 276h18M270 316h18M322 316h18" stroke="#8a9198" strokeWidth="9" />
          {/* Smooth layered flow */}
          <path d="M20 120H640M20 160H640" stroke="#0e1114" strokeWidth="2" strokeDasharray="10 8" style={{ opacity: v.oFlat, ...fade }} />
          {/* Flow forced up and over */}
          <g style={{ opacity: v.oOver, ...fade }}>
            <path d="M20 250Q200 250 240 190Q300 150 370 196" stroke="#0e1114" strokeWidth="2" fill="none" strokeDasharray="10 8" />
            <path d="M20 300Q180 300 230 220" stroke="#0e1114" strokeWidth="2" fill="none" strokeDasharray="10 8" />
          </g>
          {/* Rolling turbulence in the lee */}
          <g style={{ opacity: v.oLee, ...fade }}>
            <path
              d="M380 210q40 10 30 44q-10 30 -36 16q-14 -14 6 -24M430 250q44 14 30 52q-14 30 -40 14q-14 -16 8 -24M500 230q40 6 34 40q-10 28 -32 14"
              stroke="#b42318"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <text x="470" y="196" fontSize="12" fontWeight="600" fill="#b42318" textAnchor="middle">
              Turbulence on the downwind side
            </text>
          </g>
          <text x="60" y="104" fontSize="12" fontWeight="600" fill="#0e1114" textAnchor="start">
            Wind
          </text>
          <path d="M96 100h40M128 94l10 6-10 6" stroke="#0e1114" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* Scene B: the coastline */}
        <g style={{ opacity: v.oB, ...fade }}>
          <rect x="0" y="330" width="336" height="90" fill="#a9cfe3" />
          <rect x="336" y="330" width="336" height="90" fill="#e3e6ea" />
          <path d="M0 330h672" stroke="#0e1114" strokeWidth="2" />
          <text x="168" y="384" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Water
          </text>
          <text x="504" y="384" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">
            Land
          </text>
          {/* Day: sea breeze */}
          <g style={{ opacity: v.oDay, ...fade }}>
            <circle cx="560" cy="80" r="26" fill="#f5d90a" stroke="#0e1114" strokeWidth="2" />
            <path d="M500 310V200M494 209l6-9 6 9" stroke="#b42318" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M150 300H440M428 292l12 8-12 8" stroke="#0e1114" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="300" y="284" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">
              Sea breeze: water to land
            </text>
            <text x="504" y="188" fontSize="12" fontWeight="600" fill="#b42318" textAnchor="middle">
              Land heats faster
            </text>
          </g>
          {/* Night: land breeze */}
          <g style={{ opacity: v.oNight, ...fade }}>
            <path d="M584 60a26 26 0 1 0 0 44a34 34 0 0 1 0 -44Z" fill="#FFFFFF" stroke="#0e1114" strokeWidth="2" />
            <path d="M170 310V200M164 209l6-9 6 9" stroke="#b42318" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M520 300H230M242 292l-12 8 12 8" stroke="#0e1114" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="380" y="284" fontSize="13" fontWeight="600" fill="#0e1114" textAnchor="middle">
              Land breeze: land to water
            </text>
            <text x="170" y="188" fontSize="12" fontWeight="600" fill="#b42318" textAnchor="middle">
              Water stays warmer
            </text>
          </g>
        </g>
      </svg>
      {/* The drone, tossed in the lee on beat 4 */}
      <div
        aria-hidden="true"
        className="absolute left-[410px] w-[60px]"
        style={{
          top: droneTop,
          opacity: v.oD * v.oA,
          transform: `rotate(${v.dR})`,
          transformOrigin: "30px 27px",
          transition: reducedMotion ? "none" : "transform 1.2s ease, top 1.2s ease, opacity 0.6s ease",
        }}
      >
        <Drone size={60} />
      </div>
    </>
  );

  return (
    <AnimationFrame
      title="Wind around obstacles"
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
      claim="Expect turbulence on the downwind side of buildings, ridges, and tree lines."
      sourceLabel="FAA pilot handbook"
      citation="FAA-H-8083-25"
      bogeymanLine="Shelter from the wind is where the rough air is."
      liveAnnouncement={`Beat ${beat} of 6. ${caption}`}
    />
  );
}
